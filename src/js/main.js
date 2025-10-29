// Главный JavaScript файл

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('Сайт загружен');
  
  // Инициализация компонентов
  initMobileMenu();
  initSmoothScroll();
  initLazyLoading();
  initTabs();
  initHeroSwiper();
  initNewsResponsiveSliders();
  initHeaderScrollFill();
});

// Мобильное меню
function initMobileMenu() {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const header = document.querySelector('.header');
  
  if (menuToggle && header) {
    menuToggle.addEventListener('click', function() {
      header.classList.toggle('header--menu-open');
    });
  }
}

// Адаптивные слайдеры новостей: <=768 включаем Swiper, >768 выключаем
function initNewsResponsiveSliders() {
  const instances = new Map();

  function getVisibleContainers() {
    // Получаем только видимые (активные) слайдеры
    return Array.from(document.querySelectorAll('.tabs__panel.is-active .news__slider .swiper'));
  }

  function enable(swiperEl) {
    if (instances.has(swiperEl)) return; // уже включен
    
    const sliderId = swiperEl.getAttribute('data-news-slider');
    const prevBtn = document.querySelector(`[data-news-prev="${sliderId}"]`);
    const nextBtn = document.querySelector(`[data-news-next="${sliderId}"]`);
    
    const instance = new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 12,
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 12 },
      },
      // управление жестами/клавиатурой
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

  // Функция обновления счетчика слайдов новостей
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

  // Функция сброса и заполнения прогресс-бара новостей (как в hero)
  function resetNewsProgressBar(sliderId) {
    const progressBar = document.querySelector(`[data-news-nav="${sliderId}"] .news__slider-progress-bar`);
    if (progressBar) {
      // Убираем анимацию для мгновенного сброса
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      
      // Принудительно перерисовываем элемент
      progressBar.offsetHeight;
      
      // Возвращаем плавную анимацию заполнения (3 секунды для новостей, так как нет автоплея)
      progressBar.style.transition = 'width 3s linear';
      
      // Запускаем анимацию заполнения
      setTimeout(() => {
        progressBar.style.width = '100%';
      }, 10);
    }
  }

  function disable(swiperEl) {
    const inst = instances.get(swiperEl);
    if (inst) {
      inst.destroy(true, true);
      instances.delete(swiperEl);
    }
  }

  function refresh() {
    const width = window.innerWidth;
    const visibleContainers = getVisibleContainers();
    
    // Отключаем все ранее инициализированные
    instances.forEach((inst, el) => {
      if (!visibleContainers.includes(el)) {
        disable(el);
      }
    });
    
    // Обрабатываем видимые контейнеры
    visibleContainers.forEach(el => {
      if (width <= 768) enable(el);
      else disable(el);
    });
  }

  // начальная инициализация и ресайз с дебаунсом
  refresh();
  window.addEventListener('resize', utils.debounce(refresh, 150));
  
  // Экспортируем refresh для использования в initTabs
  window.newsSlidersRefresh = refresh;
}

// Табы (переиспользуемая инициализация)
function initTabs() {
  const containers = document.querySelectorAll('[data-tabs]');
  containers.forEach(container => {
    const tabs = container.querySelectorAll('.tabs__tab');
    const panels = container.querySelectorAll('.tabs__panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        // Активное состояние на кнопках
        tabs.forEach(t => t.classList.toggle('is-active', t === tab));
        // Переключение панелей
        panels.forEach(panel => {
          panel.classList.toggle('is-active', panel.getAttribute('data-tab-panel') === target);
        });
        // Переинициализация слайдеров новостей при переключении таба
        if (window.newsSlidersRefresh) {
          setTimeout(() => window.newsSlidersRefresh(), 50);
        }
      });
    });
  });
}

// Плавная прокрутка
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Ленивая загрузка изображений
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback для старых браузеров
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

// Hero Swiper
function initHeroSwiper() {
  const heroSlider = document.querySelector('.hero__slider .swiper');
  
  if (heroSlider && typeof Swiper !== 'undefined') {
    const heroSwiper = new Swiper(heroSlider, {
      // Основные настройки
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
        slideChangeTransitionEnd: function() {
          resetProgressBar();
          console.log('Переход завершен, прогресс-бар сброшен и стартовал');
        },
        init: function() {
          updateSlideCounter(this);
          resetProgressBar();
          // Принудительно запускаем автоплей
          console.log('Запуск автоплея слайдера');
          this.autoplay.start();
        },
        autoplayTimeLeft: function(swiper, timeLeft, percentage) {
          // Не используем это событие, так как используем CSS анимацию
        },
        autoplayStart: function() {
          console.log('Автоплей запущен');
          // Не сбрасываем прогресс-бар здесь, так как он уже сброшен в init
        },
        autoplayResume: function() {
          console.log('Автоплей возобновлен');
        },
        autoplayStop: function() {
          console.log('Автоплей остановлен');
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

    // Функция сброса прогресс-бара
    function resetProgressBar() {
      const progressBar = document.querySelector('.hero__slider-progress-bar');
      if (progressBar) {
        // Убираем анимацию для мгновенного сброса
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        
        // Принудительно перерисовываем элемент
        progressBar.offsetHeight;
        
        // Возвращаем плавную анимацию на полное время задержки автоплея
        progressBar.style.transition = 'width 5s linear';
        
        // Запускаем анимацию заполнения
        setTimeout(() => {
          progressBar.style.width = '100%';
        }, 10); // Небольшая задержка для корректного запуска анимации
        
        console.log('Прогресс-бар сброшен в 0%, начинается заполнение за 5 секунд');
      }
    }

  } else {
    console.warn('Swiper не загружен или слайдер не найден');
  }
}

// Белая заливка header при скролле
function initHeaderScrollFill() {
  const header = document.querySelector('.header');
  if (!header) return;

  const toggleOnScroll = () => {
    if (window.scrollY >= 100) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  // Первичная установка
  toggleOnScroll();

  // Слушатели
  window.addEventListener('scroll', utils.throttle(toggleOnScroll, 50), { passive: true });
}

// Утилиты
const utils = {
  // Дебаунс функция
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Троттлинг функция
  throttle: function(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

