/**
 * Justine Pean Huyo-a Portfolio Script
 * Handles the Before/After Comparison Modal
 */

const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');
const slider = document.getElementById('slider');
const wrapper = document.getElementById('comparison-wrapper');
const imgBefore = document.getElementById('modal-before');
const imgAfter = document.getElementById('modal-after');
const galleryItems = document.querySelectorAll('.gallery-item');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

const heroImage = document.querySelector('.hero-image');
const aboutSection = document.querySelector('.about-section');
const aboutVisual = document.querySelector('.about-visual');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isExpanded));
        navLinks.classList.toggle('is-open');

        if (navbar && navLinks.classList.contains('is-open')) {
            navbar.classList.remove('is-hidden');
        }
    });
}

if (navbar) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 0) {
            navbar.classList.remove('is-hidden');
            lastScrollY = currentScrollY;
            return;
        }

        if (currentScrollY > lastScrollY && !navLinks?.classList.contains('is-open')) {
            navbar.classList.add('is-hidden');
        } else {
            navbar.classList.remove('is-hidden');
        }

        lastScrollY = currentScrollY;
    });
}

// Initialize Gallery Listeners
if (galleryItems.length > 0) {
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const beforeSrc = item.getAttribute('data-before');
            const afterSrc = item.querySelector('img').src;

            imgBefore.src = beforeSrc;
            imgAfter.src = afterSrc;
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Reset slider to middle
            slider.value = 50;
            wrapper.style.setProperty('--position', '50%');
        });
    });
}

// Slider Input Logic
if (slider) {
    slider.addEventListener('input', (e) => {
        wrapper.style.setProperty('--position', `${e.target.value}%`);
    });
}

// Close Modal Logic
const closeModal = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
};

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// Close on background click
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Close on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
});

// Intersection Observer for hero/about image animations
if (aboutSection && heroImage && aboutVisual) {
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of the about section is visible
    };

    const aboutSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Only apply animation on desktop/tablet (not mobile)
            if (window.innerWidth > 768) {
                if (entry.isIntersecting) {
                    // About section is visible, make hero-image disappear, about-visual appear
                    heroImage.classList.add('fade-out');
                    aboutVisual.classList.add('fade-in');
                } else {
                    // About section is not visible, make hero-image appear, about-visual disappear
                    heroImage.classList.remove('fade-out');
                    aboutVisual.classList.remove('fade-in');
                }
            } else {
                // On mobile, ensure classes are removed to respect mobile-specific CSS
                heroImage.classList.remove('fade-out');
                aboutVisual.classList.remove('fade-in');
            }
        });
    }, observerOptions);

    aboutSectionObserver.observe(aboutSection);
}
