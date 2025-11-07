// Управление слайдерами (hero, новости)

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
    initNewsResponsiveSliders();
  });

  function initHeroSlider() {
    const heroSlider = document.querySelector('.hero__slider .swiper');
    if (!heroSlider || typeof Swiper === 'undefined') {
      return;
    }

    const heroSwiper = new Swiper(heroSlider, {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        stopOnLastSlide: false,
      },
      speed: 1200,
      effect: 'fade',
      fadeEffect: {
        crossFade: false
      },
      navigation: {
        nextEl: '.hero__slider-btn--next',
        prevEl: '.hero__slider-btn--prev',
      },
      on: {
        slideChange: function() {
          updateSlideCounter(this);
        },
        slideChangeTransitionEnd: function() {
          resetProgressBar();
        },
        init: function() {
          updateSlideCounter(this);
          resetProgressBar();
          this.autoplay.start();
        },
        autoplayStart: function() {
          // no-op, оставлено для совместимости
        },
        autoplayResume: function() {
          // no-op, оставлено для совместимости
        },
        autoplayStop: function() {
          // no-op, оставлено для совместимости
        }
      }
    });

    function updateSlideCounter(swiper) {
      const currentSlideEl = document.querySelector('.hero__current-slide');
      const totalSlidesEl = document.querySelector('.hero__total-slides');

      if (currentSlideEl && totalSlidesEl) {
        const currentSlide = swiper.realIndex + 1;
        const totalSlides = swiper.slides.length;

        currentSlideEl.textContent = currentSlide.toString().padStart(2, '0');
        totalSlidesEl.textContent = totalSlides.toString().padStart(2, '0');
      }
    }

    function resetProgressBar() {
      const progressBar = document.querySelector('.hero__slider-progress-bar');
      if (!progressBar) return;

      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      progressBar.offsetHeight;
      progressBar.style.transition = 'width 5s linear';

      setTimeout(() => {
        progressBar.style.width = '100%';
      }, 10);
    }
  }

  function initNewsResponsiveSliders() {
    if (typeof Swiper === 'undefined') {
      return;
    }

    const instances = window.newsSwiperInstances || new Map();
    window.newsSwiperInstances = instances;

    function getAllContainers() {
      return Array.from(document.querySelectorAll('.news__slider .swiper'));
    }

    function enable(swiperEl) {
      if (instances.has(swiperEl)) return;

      const sliderId = swiperEl.getAttribute('data-news-slider');
      const prevBtn = document.querySelector(`[data-news-prev="${sliderId}"]`);
      const nextBtn = document.querySelector(`[data-news-next="${sliderId}"]`);
      const container = swiperEl.closest('.news__slider');
      const containerHeight = container ? container.offsetHeight : 0;

      if (container && containerHeight > 0) {
        container.style.minHeight = containerHeight + 'px';
      }

      const instance = new Swiper(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 12,
        autoHeight: true,
        observer: true,
        observeParents: true,
        preloadImages: false,
        lazy: {
          loadPrevNext: true,
        },
        breakpoints: {
          576: { slidesPerView: 2, spaceBetween: 12 },
        },
        keyboard: { enabled: true },
        pagination: false,
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
        watchOverflow: true,
        on: {
          init: function() {
            updateNewsSlideCounter(this, sliderId);
            resetNewsProgressBar(sliderId);
            requestAnimationFrame(() => {
              setTimeout(() => {
                if (container) container.style.minHeight = '';
                this.updateAutoHeight(200);
              }, 100);
            });
          },
          slideChange: function() {
            updateNewsSlideCounter(this, sliderId);
          },
          slideChangeTransitionEnd: function() {
            resetNewsProgressBar(sliderId);
          }
        }
      });

      instances.set(swiperEl, instance);
    }

    function updateNewsSlideCounter(swiper, sliderId) {
      const currentSlideEl = document.querySelector(`[data-news-nav="${sliderId}"] .news__current-slide`);
      const totalSlidesEl = document.querySelector(`[data-news-nav="${sliderId}"] .news__total-slides`);

      if (currentSlideEl && totalSlidesEl) {
        const currentSlide = swiper.realIndex + 1;
        const totalSlides = swiper.slides.length;

        currentSlideEl.textContent = currentSlide.toString().padStart(2, '0');
        totalSlidesEl.textContent = totalSlides.toString().padStart(2, '0');
      }
    }

    function resetNewsProgressBar(sliderId) {
      const progressBar = document.querySelector(`[data-news-nav="${sliderId}"] .news__slider-progress-bar`);
      if (!progressBar) return;

      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      progressBar.offsetHeight;
      progressBar.style.transition = 'width 3s linear';

      setTimeout(() => {
        progressBar.style.width = '100%';
      }, 10);
    }

    function disable(swiperEl) {
      const inst = instances.get(swiperEl);
      if (!inst) return;

      inst.destroy(true, true);
      instances.delete(swiperEl);
    }

    function refresh() {
      const width = window.innerWidth;
      const allContainers = getAllContainers();

      instances.forEach((inst, el) => {
        if (!allContainers.includes(el) || width > 768) {
          disable(el);
        }
      });

      allContainers.forEach(el => {
        if (width <= 768) enable(el);
        else disable(el);
      });
    }

    refresh();
    window.addEventListener('resize', debounce(refresh, 150));

    window.newsSlidersRefresh = refresh;
  }

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
})();


