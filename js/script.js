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
const aboutText = document.querySelector('.about-text');
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
    // Function to reveal items with a staggered delay
    const revealGalleryItems = () => {
        let i = 0;
        galleryItems.forEach(item => {
            if (!item.classList.contains('hide')) {
                item.style.transitionDelay = `${i * 0.08}s`;
                item.classList.add('is-visible');
                i++;
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;

            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            
            // 1. Exit animation: remove visibility class and reset delays
            galleryItems.forEach(item => {
                item.classList.remove('is-visible');
                item.style.transitionDelay = '0s';
            });

            // 2. Wait for exit transition, then swap categories and re-reveal
            setTimeout(() => {
                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                });
                
                // Re-reveal items with stagger
                requestAnimationFrame(revealGalleryItems);
            }, 400); // Wait for the exit fade (0.4s feels snappier than the full 0.6s)
        });
    });

    // Initial staggered reveal on page load
    window.addEventListener('load', revealGalleryItems);
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

// Check for Scroll-Driven Animations support
const supportsScrollTimeline = window.CSS && CSS.supports('animation-timeline', 'view()');

// Parallax and Entrance Animations
if (aboutSection && heroImage && aboutVisual && aboutText) {
    // 1. Hero Entrance on Load
    window.addEventListener('load', () => {
        heroImage.classList.add('is-loaded');
    });

    // 2. Parallax Scroll Logic
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const windowHeight = window.innerHeight;
                const isMobile = window.innerWidth <= 768;

                // Hero Parallax (Desktop/Tablet only)
                if (!isMobile && heroImage.classList.contains('is-loaded') && !supportsScrollTimeline) {
                    heroImage.style.transition = 'none'; 
                    heroImage.style.transform = `translateX(-${scrolled * 0.25}px)`;
                    heroImage.style.opacity = Math.max(0, 1 - scrolled / 900);
                    heroImage.style.filter = `blur(${Math.min(6, scrolled / 100)}px)`;
                }

                // About Visual Parallax
                const aboutRect = aboutSection.getBoundingClientRect();
                
                if (!supportsScrollTimeline) {
                    if (aboutRect.top < windowHeight && aboutRect.bottom > 0) {
                        const progress = Math.max(0, Math.min(1, aboutRect.top / windowHeight));

                        aboutVisual.style.transition = 'none';
                        aboutVisual.style.opacity = Math.max(0, 1 - progress);
                        aboutVisual.style.filter = `blur(${Math.min(4, progress * 10)}px)`; 
                        
                        if (isMobile) {
                            const moveY = progress * 15;
                            aboutVisual.style.transform = `translateY(${moveY}px) scale(${1 - progress * 0.05})`;
                        } else {
                            const moveX = progress * 25;
                            aboutVisual.style.transform = `translateX(${moveX}%) scale(${1 - progress * 0.1})`;
                        }

                        const textMoveY = (progress - 0.5) * 50;
                        aboutText.style.transform = `translateY(${textMoveY}px)`;
                    } else if (aboutRect.top >= windowHeight) {
                        aboutVisual.style.opacity = '0';
                        aboutVisual.style.transform = isMobile ? 'translateY(15px) scale(0.95)' : 'translateX(25%) scale(0.9)';
                        aboutVisual.style.filter = 'blur(4px)';
                        aboutText.style.transform = 'translateY(25px)';
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Intersection Observer for Service Cards Reveal
const serviceCards = document.querySelectorAll('.service-card');
if (serviceCards.length > 0) {
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                // Stop observing once the animation has triggered
                serviceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the card is visible
        rootMargin: '0px 0px -50px 0px' // Offset to trigger slightly before it enters fully
    });

    serviceCards.forEach((card, index) => {
        // Check if we are on mobile (stacked layout)
        const isMobile = window.innerWidth <= 768;

        // Only apply stagger on desktop/tablet. On mobile, we set delay to 0s
        // so the card reveals immediately as it enters the viewport.
        card.style.transitionDelay = isMobile ? '0s' : `${index * 0.1}s`;
        serviceObserver.observe(card);
    });
}
