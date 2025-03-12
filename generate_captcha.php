<?php
session_start();

// Set header type for image
header("Content-type: image/png");

// Create image with dimensions 250x60
$image = imagecreate(250, 60);

// Set background color (light gray)
$background_color = imagecolorallocate($image, 240, 240, 240);
imagefill($image, 0, 0, $background_color);

// Set text color (dark blue)
$text_color = imagecolorallocate($image, 21, 96, 189);

// Characters to use in CAPTCHA (avoiding ambiguous characters)
$characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
$length = strlen($characters);
$captcha_text = "";

// Generate 6 random characters
for($i = 0; $i < 6; $i++) {
    $random_index = mt_rand(0, $length - 1);
    $captcha_text .= $characters[$random_index];
    
    // Add character to image with random rotation
    $font = realpath('./arial.ttf'); // Ensure this path is correct
    $font_size = rand(18, 25);
    $angle = rand(-15, 15);
    $x = 25 + ($i * 35);
    $y = rand(30, 45);
    
    imagettftext($image, $font_size, $angle, $x, $y, $text_color, $font, $characters[$random_index]);
}

// Add noise to the image (lines)
for($i = 0; $i < 8; $i++) {
    $line_color = imagecolorallocate($image, rand(150, 230), rand(150, 230), rand(150, 230));
    imageline($image, rand(0, 250), rand(0, 60), rand(0, 250), rand(0, 60), $line_color);
}

// Add noise dots
for($i = 0; $i < 100; $i++) {
    $dot_color = imagecolorallocate($image, rand(150, 230), rand(150, 230), rand(150, 230));
    imagesetpixel($image, rand(0, 250), rand(0, 60), $dot_color);
}

// Store CAPTCHA text in session for verification
$_SESSION['captcha'] = $captcha_text;

// Output image and free memory
imagepng($image);
imagedestroy($image);
?>
