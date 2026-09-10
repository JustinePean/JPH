/**
 * Determines if the current page should have a modified nav.
 * Returns a comma-separated list of pages that need nav modification.
 */
function getPagesWithModifiedNav() {
    return 'before-after.html,pricing.html,contact.html';
}

/**
 * Checks if current page needs modified nav (remove About/Services, add Home).
 */
function shouldModifyNav() {
    const pagesWithModifiedNav = getPagesWithModifiedNav();
    const currentPath = window.location.pathname.split('/').pop();
    return pagesWithModifiedNav.includes(currentPath);
}

/**
 * Modifies nav links for specific pages (before-after, pricing, contact).
 * Removes About and Services links, adds Home link at the beginning.
 */
function modifyNavForSpecificPages() {
    if (!shouldModifyNav()) return;
    
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    // Remove About and Services links
    const aboutLink = navLinks.querySelector('a[href*="index.html#about"]');
    const servicesLink = navLinks.querySelector('a[href*="index.html#services"]');
    
    if (aboutLink) {
        aboutLink.remove();
    }
    if (servicesLink) {
        servicesLink.remove();
    }
    
    // Add Home link at the beginning
    const homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.textContent = 'Home';
    navLinks.insertBefore(homeLink, navLinks.firstChild);
}

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
                    <a href="before-after.html">Before/After</a>
                    <a href="pricing.html">Pricing</a>
                    <a href="contact.html" class="nav-cta">Contact</a>
                </div>
            </div>
        </nav>
        <div class="scroll-progress"></div>
    `,

    footer: `
        <footer class="footer bg-alt">
            <div class="footer-inner">
                <div class="footer-cta">
                    <h3>Ready to get started?</h3>
                    <p>Let's make your photos shine.</p>
                    <a href="contact.html" class="btn btn-primary">Get In Touch</a>
                    <div class="footer-contact-links">
                        <a href="mailto:justine@justinepeandh.com" class="contact-link" aria-label="Email">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/justine-pean-huyo-a-06b6441bb/" target="_blank" rel="noopener" class="contact-link" aria-label="LinkedIn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                        <a href="https://wa.me/+639912238610" target="_blank" rel="noopener" class="contact-link" aria-label="WhatsApp">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </a>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2026 Justine Pean Huyo-a. All rights reserved.</p>
                </div>
            </div>
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
    
    // Modify nav for specific pages (before-after, pricing, contact)
    modifyNavForSpecificPages();

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
