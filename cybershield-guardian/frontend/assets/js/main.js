// Theme toggle script
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;

  // Load saved theme from localStorage
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
  }

  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    if (body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
});
