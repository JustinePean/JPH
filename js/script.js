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

// Portfolio Filtering Logic
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
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

// Parallax and Entrance Animations
if (aboutSection && heroImage && aboutVisual) {
    // 1. Hero Entrance on Load
    window.addEventListener('load', () => {
        heroImage.classList.add('is-loaded');
    });

    // 2. Parallax Scroll Logic
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 768;

        // Hero Parallax (Desktop/Tablet only)
        if (!isMobile && heroImage.classList.contains('is-loaded')) {
            heroImage.style.transition = 'none'; 
            heroImage.style.transform = `translateX(-${scrolled * 0.5}px)`;
            heroImage.style.opacity = Math.max(0, 1 - scrolled / 600);
            heroImage.style.filter = `blur(${Math.min(8, scrolled / 50)}px)`;
        }

        // About Visual Parallax
        const aboutRect = aboutSection.getBoundingClientRect();
        
        if (aboutRect.top < windowHeight && aboutRect.bottom > 0) {
            // Calculate progress (1 when entering from bottom, 0 when at top)
            const progress = Math.max(0, Math.min(1, aboutRect.top / windowHeight));

            aboutVisual.style.transition = 'none'; // Smooth response to scroll
            aboutVisual.style.opacity = Math.max(0, 1 - progress);
            aboutVisual.style.filter = `blur(${Math.min(8, progress * 20)}px)`;
            
            if (isMobile) {
                // Mobile: Slide in from down to top
                const moveY = progress * 80; // Starts 80px below and moves to 0
                aboutVisual.style.transform = `translateY(${moveY}px)`;
            } else {
                // Desktop/Tablet: Slide in from right
                const moveX = progress * 100;
                aboutVisual.style.transform = `translateX(${moveX}%)`;
            }
        } else if (aboutRect.top >= windowHeight) {
            aboutVisual.style.opacity = '0';
            aboutVisual.style.transform = isMobile ? 'translateY(80px)' : 'translateX(100%)';
            aboutVisual.style.filter = 'blur(8px)';
        }
    });
}
