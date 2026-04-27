const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');
const slider = document.getElementById('slider');
const wrapper = document.getElementById('wrapper');
const imgBefore = document.getElementById('modal-before');
const imgAfter = document.getElementById('modal-after');

document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
        imgBefore.src = item.getAttribute('data-before');
        imgAfter.src = item.querySelector('img').src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

slider.addEventListener('input', (e) => wrapper.style.setProperty('--position', `${e.target.value}%`));
closeBtn.addEventListener('click', () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; });
modal.addEventListener('click', (e) => { if (e.target === modal) closeBtn.click(); });