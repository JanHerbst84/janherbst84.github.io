<?php
// Set headers to specify JSON response
header('Content-Type: application/json');

// YouTube API key (stored securely on server)
$api_key = 'AIzaSyBmhwOUhOTSQwNbjI_nzZB8sC5yOtlsPeU';

// Channel ID for HiMMP-Research
// Note: We're using the channel handle @HiMMP-Research, but the API requires the channel ID
$channel_handle = '@HiMMP-Research';

// Cache file path - store in a directory not directly accessible via web if possible
$cache_file = __DIR__ . '/youtube_metrics_cache.json';
$cache_lifetime = 86400; // 24 hours in seconds

// Function to get channel ID from handle
function getChannelId($handle, $api_key) {
    // Remove @ symbol if present
    $handle = ltrim($handle, '@');
    
    // First, try to get the channel ID using the search endpoint
    $search_url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=$handle&type=channel&key=$api_key";
    $search_response = file_get_contents($search_url);
    $search_data = json_decode($search_response, true);
    
    if (isset($search_data['items']) && count($search_data['items']) > 0) {
        return $search_data['items'][0]['snippet']['channelId'];
    }
    
    // If search fails, return null
    return null;
}

// Function to get channel statistics
function getChannelStats($channel_id, $api_key) {
    $stats_url = "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=$channel_id&key=$api_key";
    $stats_response = file_get_contents($stats_url);
    return json_decode($stats_response, true);
}

// Function to get channel videos
function getChannelVideos($channel_id, $api_key, $max_results = 50) {
    $videos_url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=$channel_id&maxResults=$max_results&type=video&key=$api_key";
    $videos_response = file_get_contents($videos_url);
    return json_decode($videos_response, true);
}

// Function to fetch fresh data from YouTube API
function fetchFreshData($channel_handle, $api_key) {
    $response = [
        'success' => false,
        'error' => null,
        'data' => null,
        'cached' => false
    ];
    
    try {
        // Get channel ID from handle
        $channel_id = getChannelId($channel_handle, $api_key);
        
        if (!$channel_id) {
            throw new Exception("Could not find channel ID for handle: $channel_handle");
        }
        
        // Get channel statistics
        $channel_stats = getChannelStats($channel_id, $api_key);
        
        if (!isset($channel_stats['items']) || count($channel_stats['items']) === 0) {
            throw new Exception("Could not retrieve channel statistics");
        }
        
        // Get channel videos
        $channel_videos = getChannelVideos($channel_id, $api_key);
        
        // Extract relevant data
        $stats = $channel_stats['items'][0]['statistics'];
        $snippet = $channel_stats['items'][0]['snippet'];
        
        // Calculate total views across all videos
        $total_views = isset($stats['viewCount']) ? intval($stats['viewCount']) : 0;
        
        // Count videos
        $video_count = isset($channel_videos['pageInfo']['totalResults']) ? 
                      intval($channel_videos['pageInfo']['totalResults']) : 0;
        
        // Format the data
        $response['success'] = true;
        $response['data'] = [
            'channel_id' => $channel_id,
            'title' => $snippet['title'],
            'description' => $snippet['description'],
            'published_at' => $snippet['publishedAt'],
            'subscriber_count' => isset($stats['subscriberCount']) ? intval($stats['subscriberCount']) : 0,
            'view_count' => $total_views,
            'video_count' => $video_count,
            'comment_count' => isset($stats['commentCount']) ? intval($stats['commentCount']) : 0,
            'thumbnail_url' => isset($snippet['thumbnails']['default']['url']) ? 
                              $snippet['thumbnails']['default']['url'] : '',
            'last_updated' => date('Y-m-d H:i:s')
        ];
        
    } catch (Exception $e) {
        $response['error'] = $e->getMessage();
    }
    
    return $response;
}

// Initialize response
$response = [
    'success' => false,
    'error' => null,
    'data' => null,
    'cached' => false
];

// Check if cache file exists and is less than 24 hours old
if (file_exists($cache_file) && (time() - filemtime($cache_file) < $cache_lifetime)) {
    // Use cached data
    $cached_data = json_decode(file_get_contents($cache_file), true);
    
    if ($cached_data && isset($cached_data['success']) && $cached_data['success']) {
        $response = $cached_data;
        $response['cached'] = true;
        $response['cache_age'] = time() - filemtime($cache_file);
    } else {
        // Invalid cache, fetch fresh data
        $response = fetchFreshData($channel_handle, $api_key);
        
        // Save to cache
        file_put_contents($cache_file, json_encode($response, JSON_PRETTY_PRINT));
    }
} else {
    // Cache doesn't exist or is too old, fetch fresh data
    $response = fetchFreshData($channel_handle, $api_key);
    
    // Save to cache if successful
    if ($response['success']) {
        file_put_contents($cache_file, json_encode($response, JSON_PRETTY_PRINT));
    }
}

// Output the response as JSON
echo json_encode($response, JSON_PRETTY_PRINT);
?>
