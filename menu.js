lucide.createIcons();

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const menuLinks = document.querySelectorAll('.menu-link');

function toggleMenu() {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', !expanded);
  navMenu.classList.toggle('is-active');
  document.body.classList.toggle('menu-open');
  
  // Swap icons
  menuToggle.innerHTML = !expanded 
    ? '<i data-lucide="x" class="icon"></i>' 
    : '<i data-lucide="menu" class="icon"></i>';
  lucide.createIcons();
}

menuToggle.addEventListener('click', toggleMenu);

// Close menu when clicking a link
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('is-active')) {
      toggleMenu();
    }
  });
});