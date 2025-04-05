<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <script src="https://www.w3schools.com/lib/w3.js"></script>
  
  <title>Jan-Peter Herbst - Contact</title>
  <meta content="Contact Professor Dr. Dr. habil. Jan-Peter Herbst for inquiries about research, teaching, or collaborations." name="description">
  <meta content="contact, Jan-Peter Herbst, email, academic contact" name="keywords">
  <link href="images/favicon.png" rel="shortcut icon">
  
  <link href="css/main.css" rel="stylesheet">
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
    <a href="publicationshtml/indexpublications.html">Publications</a>	
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
    <div class="w3-panel w3-blue">
      <h3 class="w3-opacity">Contact</h3>
    </div>
  
    <div id="contact" class="w3-clear">
      <div class="container_form">
        <form action="process_contact.php" method="post">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" placeholder="Your name" required>
  
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Your email address" required>
  
          <label for="message"></label>
          <textarea id="message" name="message" placeholder="Your message" style="height:200px" required></textarea>
          
          <div class="captcha-container">
            <label for="captcha">Please enter the code shown below</label>
            <div class="captcha-image">
              <img src="generate_captcha.php" alt="CAPTCHA image">
            </div>
            <input type="text" id="captcha" name="captcha" placeholder="Enter the code" required>
          </div>
          
          <div class="form-actions">
            <input type="submit" name="submit" value="Submit">
            <input type="reset" value="Reset">
          </div>
        </form>
      </div>
    </div>
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
