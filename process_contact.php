<?php
session_start();

// Set error reporting
ini_set('display_errors', 1);
ini_set('error_reporting', E_ALL);

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Initialize response status
$form_valid = false;
$error_fields = array();

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['submit'])) {
    
    // Verify CAPTCHA
    if (!isset($_SESSION['captcha']) || !isset($_POST['captcha']) || 
        strtoupper($_POST['captcha']) !== $_SESSION['captcha']) {
        $error_fields[] = "CAPTCHA verification failed";
    } else {
        // CAPTCHA is correct, proceed with form validation
        
        // Validate name
        if (empty($_POST["name"])) {
            $error_fields[] = "Name is required";
        } else {
            $name = sanitize_input($_POST["name"]);
        }
        
        // Validate email
        if (empty($_POST["email"])) {
            $error_fields[] = "Email is required";
        } else {
            $email = sanitize_input($_POST["email"]);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $error_fields[] = "Invalid email format";
            }
        }
        
        // Validate message
        if (empty($_POST["message"])) {
            $error_fields[] = "Message is required";
        } else {
            $message = sanitize_input($_POST["message"]);
        }
        
        // If no errors, process form
        if (empty($error_fields)) {
            $form_valid = true;
            
            // Prepare email headers
            $to = "janherbst@t-online.de";
            $subject = "Message from Website Contact Form";
            
            $headers = array();
            $headers[] = 'MIME-Version: 1.0';
            $headers[] = 'Content-type: text/html; charset=UTF-8';
            $headers[] = 'From: Website Contact <noreply@janherbst.com>';
            $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
            $headers[] = 'Bcc: erikaherbst@t-online.de';
            
            // Prepare email content
            $email_content = "
                <html>
                <head>
                    <title>New Contact Form Submission</title>
                </head>
                <body>
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Date:</strong> " . date("d/m/Y") . "</p>
                    <p><strong>Time:</strong> " . date("H:i") . "</p>
                    <p><strong>From:</strong> " . $name . " &lt;" . $email . "&gt;</p>
                    <hr>
                    <p>" . nl2br($message) . "</p>
                </body>
                </html>
            ";
            
            // Send email
            $mail_sent = mail($to, $subject, $email_content, implode("\r\n", $headers));
            
            // Destroy the CAPTCHA session to prevent reuse
            unset($_SESSION['captcha']);
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <script src="https://www.w3schools.com/lib/w3.js"></script>
  
  <title>Jan-Peter Herbst - Contact Form Submission</title>
  <meta content="Contact form submission result for Professor Dr. Dr. habil. Jan-Peter Herbst's website." name="description">
  <meta content="contact, form submission, Jan-Peter Herbst" name="keywords">
  <link href="images/favicon.png" rel="shortcut icon">
  
  <link href="styles.css" rel="stylesheet">
</head>

<body>
  <header id="header" class="w3-blue">
    <div class="w3-quarter w3-container">
      <div class="logo">
        <a href="index.html"><img src="images/logo.png" id="logo" alt="logo"></a>
        <h1 class="w3-hide">Jan-Peter Herbst</h1>
      </div>  
    </div>	
  </header>
  
  <div class="topnav" id="myTopnav">
    <a href="index.html" class="split">Home</a>
    <a href="media.html">Media</a>	
    <a href="teaching.html">Teaching</a>
    <a href="publication.html">Publications</a>	
    <a href="research.html">Research</a>
    <a href="cv.html">CV</a>
    <a href="news-detail.html">News</a>
    <a href="cap_cnt.php" class="active">Contact</a>
    <a href="javascript:void(0);" class="icon" onclick="myFunction()">
      <i class="fa fa-bars"></i>
    </a>
  </div>
  
  <script>
    function myFunction() {
      var x = document.getElementById("myTopnav");
      x.classList.toggle("responsive");
    }
  </script>
  
  <div id="container" class="container">
    <?php if ($form_valid && isset($mail_sent) && $mail_sent): ?>
      <!-- Success message -->
      <div class="form-response success">
        <h1>Thank you!</h1>
        <p>Your message has been successfully submitted.</p>
        <p>I will get back to you as soon as possible.</p>
        <p><a href="index.html" class="btn">Return to Homepage</a></p>
      </div>
    <?php elseif (!empty($error_fields)): ?>
      <!-- Error message -->
      <div class="form-response error">
        <h1>Submission Failed</h1>
        <p>There were issues with your submission:</p>
        <ul>
          <?php foreach ($error_fields as $error): ?>
            <li><?php echo $error; ?></li>
          <?php endforeach; ?>
        </ul>
        <p><a href="javascript:history.back()" class="btn">Go Back and Try Again</a></p>
      </div>
    <?php else: ?>
      <!-- Fallback for direct access -->
      <div class="form-response">
        <h1>Contact Form</h1>
        <p>Please use the <a href="cap_cnt.php">contact form</a> to send me a message.</p>
      </div>
    <?php endif; ?>
  </div>
  
  <footer id="footer" class="footer">
    <div class="up-arrow">
      <a href="#myTopnav" style="color:#f2f2f2; font-size: 48px; line-height: 24px;">
        <span class="up-arrow">&#8673;</span>
      </a>  
    </div>	
    <div class="flex-box">
      <div class="row">
        <div class="column">
          <a href="index.html"><img src="images/logo.png" class="footerLogo" alt="" style="width: 250px; height: auto;"></a>
          <p class="footerLogo"><small><nobr>Popular Music Scholar | University Lecturer | Music Producer</nobr></small></p>
        </div>
        
        <div class="column">
          <h4><nobr>Memberships / Research Focus</nobr></h4>
          <ul class="socialmedia social-links">
            <nobr>
              <li><a href="https://de.linkedin.com/pub/jan-herbst/96/15a/3a3" target="blank"><img src="images/linkedin.png" alt=""></a></li>   
              <li><a href="https://researchgate.net/profile/Jan_Herbst" target="blank"><img src="images/researchGate.png" alt=""></a></li>
              <li><a href="https://pure.hud.ac.uk/en/persons/jan-herbst" target="_blank"><img src="images/unisymb.png" alt=""></a></li>
              <li><a href="#" target="_blank"><img src="images/lupe.png" alt="Research"></a></li>
            </nobr>
          </ul>
          
          <ul class="socialmedia social-links2">
            <nobr>
              <li><a href="https://orcid.org/0000-0001-7453-0141" target="blank"><img src="images/orcid.png" alt=""></a></li>   
              <li><a href="https://www.scopus.com/authid/detail.uri?authorId=57209584151" target="blank"><img src="images/scopus.png" alt=""></a></li>
              <li><a href="https://www.growkudos.com/profile/jan_herbst" target="_blank"><img src="images/kudos.png" alt=""></a></li>
              <li><a href="https://www.managers.org.uk" target="_blank"><img src="images/cmi_rund.png" alt="cmi"></a></li>
            </nobr>
          </ul>
        </div>
        
        <div class="column space">
          <h4>Additional Links</h4>
          <ul>
            <li><a href="cap_cnt.php">Contact</a></li>
            <li><a href="research.html#resArea">Research Areas</a></li>
            <li><a href="research.html#servAcad">Service to Academia</a></li>  
            <li><a href="privacy.html">Privacy Policy</a></li>
            <li><a href="imprint.html">Impressum</a></li>
          </ul>
        </div>
      </div>	
    </div>
    <p>&copy; Copyright <strong><span>Prof. Dr. Dr. habil. Jan-Peter Herbst</span></strong>. All Rights Reserved</p>
  </footer>
</body>
</html>
