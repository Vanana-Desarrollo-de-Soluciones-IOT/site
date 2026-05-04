const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.header');
const mobileMenu = document.querySelector('.mobile-menu');

lucide.createIcons();

function closeMenu() {
    header.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    lucide.createIcons();
}

menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu');
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    menuToggle.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';
    lucide.createIcons();
});

mobileMenu.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', closeMenu);
});