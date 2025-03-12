/**
 * Publications navigation helper
 * This script automatically highlights the current page in the navigation menu
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop();
  
  // Find and highlight the current page in the publications menu
  const menuItems = document.querySelectorAll('.publications-menu .menu-item');
  menuItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage) {
      item.classList.add('active-menu');
    } else if (currentPage === '' && href === 'indexpublications.html') {
      // Handle case when at the index page without filename in URL
      item.classList.add('active-menu');
    }
  });

  // Add year navigation anchors to each section in articles.html
  if (currentPage === 'articles.html') {
    document.querySelectorAll('.publication h3').forEach(heading => {
      if (heading.textContent.match(/^\d{4}$/)) {
        const year = heading.textContent;
        heading.id = `year-${year}`;
      }
    });
  }
});