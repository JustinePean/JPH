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
