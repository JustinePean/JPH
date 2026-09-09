/**
 * Common HTML elements loader
 *
 * Injects shared components (navbar, footer, back-to-top) into every page
 * so they live in one place instead of being duplicated across HTML files.
 */

const COMMON_ELEMENTS = {
    navbar: `
        <nav class="navbar">
            <div class="nav-container">
                <a href="index.html" class="logo">Just Th!nk</a>
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle color theme">
                    <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </button>
                <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="nav-links">
                    <a href="index.html#about">About</a>
                    <a href="index.html#services">Services</a>
                    <a href="index.html#before-after-section">Before/After</a>
                    <a href="index.html#pricing-teaser">Pricing</a>
                    <a href="index.html#faq">FAQ</a>
                    <a href="index.html#contact">Contact</a>
                </div>
            </div>
        </nav>
        <div class="scroll-progress"></div>
    `,

    footer: `
        <footer class="footer bg-alt reveal-on-scroll">
            <p>&copy; 2026 Justine Pean Huyo-a. All rights reserved.</p>
        </footer>
    `,

    backToTop: `
        <button class="back-to-top" aria-label="Back to top">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        </button>
    `
};

/**
 * Adjusts nav links based on the current page.
 * On non-index pages, links should point to index.html#section.
 * On index.html, links should point to #section.
 */
function adjustNavLinks() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const isIndexPage = window.location.pathname.endsWith('index.html') ||
                        window.location.pathname.endsWith('/');

    navLinks.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('index.html#')) {
            link.setAttribute('href', isIndexPage ? href.replace('index.html', '') : href);
        }
    });
}

/**
 * Loads all common elements into the page.
 * Call this function on DOMContentLoaded.
 */
function loadCommonElements() {
    const body = document.body;

    // Insert navbar at the beginning of body
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        navbarPlaceholder.outerHTML = COMMON_ELEMENTS.navbar;
    }

    // Append footer and back-to-top before closing body tag
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = COMMON_ELEMENTS.footer + COMMON_ELEMENTS.backToTop;
    }

    // Adjust nav links for current page
    adjustNavLinks();

    // Re-initialize any navbar-dependent scripts
    if (typeof window.reinitializeNavbar === 'function') {
        window.reinitializeNavbar();
    }
}

// Auto-load on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCommonElements);
} else {
    loadCommonElements();
}
