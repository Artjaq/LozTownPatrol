document.addEventListener('DOMContentLoaded', () => {
    // --- Menu mobile (hamburger) ---
    const header = document.getElementById('main-header');
    const navToggle = document.querySelector('.nav-toggle');
    if (header && navToggle) {
        navToggle.addEventListener('click', () => {
            const open = header.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', open);
            navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
            document.body.style.overflow = open ? 'hidden' : '';
        });
        // Fermer le menu au clic sur un lien (navigation)
        header.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Ouvrir le menu');
                document.body.style.overflow = '';
            });
        });
    }

    const slider = document.querySelector('.slider');
    const slides = slider?.querySelector('.slides');
    const sliderNav = slider?.querySelector('.slider-nav');
    const prevBtn = slider?.querySelector('.arrow.prev');
    const nextBtn = slider?.querySelector('.arrow.next');

    if (!slides || !sliderNav || !prevBtn || !nextBtn) {
        console.error('Slider elements not found');
        return;
    }

    let currentSlide = 0;
    const totalSlides = slides.children.length;

    function updateSlider() {
        const offset = -currentSlide * 100;
        slides.style.transform = `translateX(${offset}%)`;
        
        // Update nav buttons
        sliderNav.querySelectorAll('button').forEach((btn, index) => {
            btn.classList.toggle('active', index === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : totalSlides - 1;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
        updateSlider();
    });

    // Nav button click handlers
    sliderNav.querySelectorAll('button').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
});

