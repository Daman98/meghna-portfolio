// Simple HTML include for header and footer
function includeHTML(selector, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.querySelector(selector).innerHTML = html;
    });
}
document.addEventListener('DOMContentLoaded', function() {
  includeHTML('header', 'header.html');
  includeHTML('footer', 'footer.html');
});
