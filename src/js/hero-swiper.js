// Инициализация Swiper для Hero секции
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем наличие Swiper
  if (typeof Swiper !== 'undefined') {
    const heroSwiper = new Swiper('.hero__slider .swiper', {
      // Основные настройки
      loop: true,
    //   autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false,
    //   },
      speed: 1000,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },

      // Навигация
      navigation: {
        nextEl: '.hero__slider-btn--next',
        prevEl: '.hero__slider-btn--prev',
      },

      // События
      on: {
        slideChange: function() {
          updateSlideCounter(this);
        },
        init: function() {
          updateSlideCounter(this);
        }
      }
    });

    // Функция обновления счетчика слайдов
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
  } else {
    console.warn('Swiper не загружен. Проверьте подключение библиотеки.');
  }
});
