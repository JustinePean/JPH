/**
 * Justine Pean Huyo-a Work Script
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
const progressBar = document.querySelector('.scroll-progress');
const backToTopBtn = document.querySelector('.back-to-top');

const heroImage = document.querySelector('.hero-image');
const aboutSection = document.querySelector('.about-section');
const aboutVisual = document.querySelector('.about-visual');
const aboutText = document.querySelector('.about-text');

const updateProgressBar = () => {
    if (progressBar) {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (window.scrollY / height) * 100 : 0;
        progressBar.style.width = scrolled + "%";
    }
};

if (navbar) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        updateProgressBar();

        // Back to Top button visibility
        if (backToTopBtn) {
            if (currentScrollY > 400) {
                backToTopBtn.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
            }
        }

        // Toggle scrolled state for height and background changes
        if (currentScrollY > 50) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }

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

    // Initialize progress bar immediately or on load
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        updateProgressBar();
    } else {
        window.addEventListener('DOMContentLoaded', updateProgressBar);
    }
}

// Back to Top Click Handler
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isExpanded));
        menuToggle.classList.toggle('is-active');
        navLinks.classList.toggle('is-open');

        if (navbar && navLinks.classList.contains('is-open')) {
            navbar.classList.remove('is-hidden');
        }
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
            document.body.style.overflow = 'hidden'; 
            
            // Reset slider to middle
            slider.value = 50;
            wrapper.style.setProperty('--position', '50%');
        });
    });
}

// Work Filtering Logic
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
                
                // Reset scroll position to avoid being stuck in dead space after filtering
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Re-reveal items with stagger
                requestAnimationFrame(revealGalleryItems);
            }, 400);
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
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') closeModal();
});

// Check for Scroll-Driven Animations support
const supportsScrollTimeline = window.CSS && CSS.supports('animation-timeline', 'view()');

// 1. Hero Entrance Logic
if (heroImage) {
    const triggerHeroLoad = () => heroImage.classList.add('is-loaded');
    if (document.readyState === 'complete') triggerHeroLoad();
    else window.addEventListener('load', triggerHeroLoad);
}

// 2. Scroll-Based Parallax & Reveals
if (heroImage || aboutSection) {
    // 2. Parallax Scroll Logic
    let ticking = false;
    let windowHeight = window.innerHeight;
    let isMobile = window.innerWidth <= 768;

    window.addEventListener('resize', () => {
        windowHeight = window.innerHeight;
        isMobile = window.innerWidth <= 768;
    });

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const aboutImageWrapper = aboutVisual?.querySelector('.about-image-wrapper');
                const aboutImg = aboutVisual?.querySelector('img');

                // Hero Parallax (Desktop/Tablet only)
                if (heroImage && !isMobile && heroImage.classList.contains('is-loaded') && !supportsScrollTimeline) {
                    heroImage.style.transform = `translateX(-${scrolled * 0.25}px)`;
                    heroImage.style.opacity = Math.max(0, 1 - scrolled / 900);
                }

                // About Visual Parallax
                const aboutRect = aboutSection ? aboutSection.getBoundingClientRect() : null;
                
                if (!supportsScrollTimeline && aboutRect && aboutVisual && aboutText) {
                    if (aboutRect.top < windowHeight && aboutRect.bottom > 0) {
                        // Calculate progress so it finishes when the top is 30% from the bottom of viewport
                        const rawProgress = Math.max(0, Math.min(1, (aboutRect.top - windowHeight * 0.3) / (windowHeight * 0.7)));
                        const revealProgress = 1 - rawProgress; // 0 to 1

                        aboutVisual.style.opacity = revealProgress;

                        // Apply Masking and Scaling
                        if (aboutImageWrapper && aboutImg) {
                            const inset = 15 - (revealProgress * 15);
                            const scale = 1.3 - (revealProgress * 0.3);
                            aboutImageWrapper.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}% round 26px)`;
                            aboutImg.style.transform = `scale(${scale})`;
                        }

                        const textMoveY = (rawProgress - 0.5) * 50;
                        aboutText.style.transform = `translateY(${textMoveY}px)`;
                    } else if (aboutRect.top >= windowHeight) {
                        aboutVisual.style.opacity = '0';
                        if (aboutImageWrapper) aboutImageWrapper.style.clipPath = 'inset(15% 15% 15% 15% round 26px)';
                        aboutText.style.transform = 'translateY(25px)';
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
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
        threshold: 0.05, 
        rootMargin: '0px 0px -10% 0px' 
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

// Progress Bar Color Change Observer
if (aboutSection && progressBar) {
    const progressColorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBar.classList.add('is-about');
            } else {
                progressBar.classList.remove('is-about');
            }
        });
    }, { threshold: 0.1 }); // Triggers when 10% of the section is visible
    progressColorObserver.observe(aboutSection);
}

// General Reveal on Scroll Logic
const revealElements = document.querySelectorAll('.reveal-on-scroll');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                // Stop observing once the animation has triggered
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Dark Mode Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}
