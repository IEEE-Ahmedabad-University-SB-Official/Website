window.addEventListener('scroll', function () {
    const navBar = document.querySelector('.navSection');
    const defaultLogo = document.getElementById('default-logo');
    const scrolledLogo = document.getElementById('scrolled-logo');
    const bodyElement = document.body;

    // Check if dark theme is applied
    if (bodyElement.classList.contains('darkTheme')) {
        // Dark theme specific scroll behavior
        if (window.scrollY > 0 && window.scrollY < 20) {
            navBar.classList.add('scrolledwhite');
            navBar.classList.add('scrolled');
            defaultLogo.style.display = 'block';
            scrolledLogo.style.display = 'none';
        } else if (window.scrollY >= 20) {
            navBar.classList.remove('scrolledwhite');
            navBar.classList.add('scrolled');
            defaultLogo.style.display = 'block';
            scrolledLogo.style.display = 'none';
        } else {
            navBar.classList.remove('scrolled');
            navBar.classList.remove('scrolledwhite');
            defaultLogo.style.display = 'block';
            scrolledLogo.style.display = 'none';
        }
    } else {
        // Scroll effects for light theme
        if (window.scrollY >= 200 && window.scrollY < 20) {
            navBar.classList.add('scrolledwhite');
            navBar.classList.remove('scrolled');
            defaultLogo.style.display = 'block';
            scrolledLogo.style.display = 'none';
        } else if (window.scrollY >= 20) {
            navBar.classList.remove('scrolledwhite');
            navBar.classList.add('scrolled');
            defaultLogo.style.display = 'none';
            scrolledLogo.style.display = 'block';
        } else {
            navBar.classList.remove('scrolled');
            navBar.classList.remove('scrolledwhite');
            defaultLogo.style.display = 'block';
            scrolledLogo.style.display = 'none';
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname.split('/').pop(); // Get the current file name
    const navLinks = document.querySelectorAll('.navAnchors a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop(); // Get the href file name
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});