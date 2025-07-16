# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static academic website for Prof. Dr. Dr. habil. Jan-Peter Herbst, built with vanilla HTML, CSS, and JavaScript. The site showcases his research, publications, teaching, and academic projects in popular music studies and music production.

## Architecture

### File Structure
- **Root HTML files**: Main pages (index.html, research.html, cv.html, etc.)
- **CSS organization**: Modular CSS with main.css importing all components
  - `/css/`: All stylesheets with component-based organization
  - `main.css`: Master import file for all CSS modules
  - Individual files for typography, layout, components, responsive design
- **JavaScript**: Minimal vanilla JS for interactive elements
  - `/js/`: Timeline interactions and UI components
  - `/publicationshtml/`: Publication-specific JS modules
- **PHP backend**: Contact form processing and CAPTCHA generation
- **Assets**: 
  - `/images/`: Logos, photos, project images
  - `/audio/`: HiMMP project audio files
  - `/publications/`: Academic PDFs organized by type
  - `/poster/`: Conference presentation PDFs

### Key Components
- **CSS Architecture**: Uses @import statements for modular organization
- **Navigation**: Responsive topnav with hamburger menu for mobile
- **Publications System**: Dedicated HTML/CSS/JS modules in `/publicationshtml/`
- **Contact System**: PHP-based with CAPTCHA validation
- **Timeline Features**: Interactive research timeline with JavaScript

## Development Commands

This is a static website with no build process. The package.json exists but contains no functional scripts beyond a placeholder test command.

### Local Development
- Serve files directly through a web server (Apache, Nginx, or local dev server)
- PHP functionality requires a PHP-enabled server for contact forms
- No compilation or build steps required

### File Serving
- All HTML files can be opened directly in browsers
- PHP files require server environment for contact functionality
- Static assets are served directly from their directories

## Important Notes

### CSS Management
- All styles are imported through `css/main.css` - modify individual component files
- Responsive design is handled in `responsive.css` (imported last)
- Variables are centralized in `variables.css`

### Content Updates
- Academic content is primarily in HTML files and PDF documents
- Publication PDFs are organized in `/publications/` with subdirectories
- Project images and assets are in `/images/` directory

### PHP Components
- Contact form processing in `process_contact.php`
- CAPTCHA generation in `generate_captcha.php`
- YouTube metrics in `youtube-metrics.php`
- Main contact page in `cap_cnt.php`

### W3.CSS Framework
- Uses W3.CSS framework for base styling
- Font Awesome for icons
- Google Fonts for typography

This is a straightforward static website with PHP contact functionality - no complex build processes or modern framework dependencies.