// Главный JavaScript файл

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('Сайт загружен');
  
  // Инициализация компонентов
  initMobileMenu();
  initMobileMenuBar();
  initSmoothScroll();
  initLazyLoading();
  initTabs();
  initHeroSwiper();
  initNewsResponsiveSliders();
  initHeaderScrollFill();
  initModals();
  initFaqDetailsAnimation();
});

// Мобильное меню (полноэкранное)
function initMobileMenu() {
  const burger = document.querySelector('.header__burger');
  const menuBarButton = document.querySelector('.mobile-menu-bar__button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu__close');
  const header = document.querySelector('.header');
  const body = document.body;

  if (!mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.add('mobile-menu--open');
    // Скрываем header при открытии меню
    if (header) {
      header.style.display = 'none';
    }
    // Блокируем прокрутку body
    body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('mobile-menu--open');
    // Показываем header при закрытии меню
    if (header) {
      header.style.display = '';
    }
    // Разблокируем прокрутку body
    body.style.overflow = '';
  };

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.contains('mobile-menu--open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Обработчики открытия
  if (burger) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  if (menuBarButton) {
    menuBarButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Обработчик закрытия
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Закрытие при клике на backdrop
  const backdrop = document.querySelector('.mobile-menu__backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeMenu();
      }
    });
  }

  // Закрытие при нажатии Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
      closeMenu();
    }
  });
}

// Попапы (универсальная инициализация)
function initModals() {
  const body = document.body;

  function openModal(name) {
    const modal = document.querySelector(`[data-modal="${name}"]`);
    if (!modal) return;
    
    // Закрываем мобильное меню, если оно открыто
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('mobile-menu--open')) {
      mobileMenu.classList.remove('mobile-menu--open');
      const header = document.querySelector('.header');
      if (header) {
        header.style.display = '';
      }
    }
    
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    
    // Сбрасываем класс валидации при открытии попапа
    const form = modal.querySelector('.modal-form');
    if (form) {
      form.classList.remove('was-validated');
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  // Открытие по клику на любой триггер
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-open]');
    if (trigger) {
      const name = trigger.getAttribute('data-modal-open');
      if (name) {
        e.preventDefault();
        openModal(name);
      }
    }

    // Закрытие по кнопке или клику на затемнение
    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      const modal = e.target.closest('.modal') || document.querySelector('.modal.is-open');
      if (modal) closeModal(modal);
    }
  });

  // Закрытие по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const opened = document.querySelector('.modal.is-open');
      if (opened) closeModal(opened);
    }
  });

  // Обработка отправки формы (в попапе и на странице)
  document.addEventListener('submit', (e) => {
    const modalForm = e.target.closest('.modal-form');
    const pageForm = e.target.closest('.request-form');
    const form = modalForm || pageForm;
    
    if (!form) return;

    e.preventDefault();

    // Добавляем класс для показа ошибок валидации
    form.classList.add('was-validated');

    // Проверка валидности формы
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Здесь можно добавить отправку данных через AJAX
    // Например:
    // const formData = new FormData(form);
    // fetch('/api/submit', { method: 'POST', body: formData })
    //   .then(response => response.json())
    //   .then(data => { ... })
    //   .catch(error => { ... });

    // Временная заглушка: просто выводим сообщение
    console.log('Форма отправлена:', new FormData(form));
    
    // Можно показать сообщение об успехе
    // alert('Заявка успешно отправлена!');
    
    // Если форма в попапе - закрываем попап
    if (modalForm) {
      const modal = form.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    }
    
    // Сбрасываем класс валидации и форму
    form.classList.remove('was-validated');
    form.reset();
  });

  // Убираем красную обводку при изменении чекбокса
  document.addEventListener('change', (e) => {
    const checkbox = e.target;
    if (checkbox.type === 'checkbox') {
      const modalForm = checkbox.closest('.modal-form');
      const pageForm = checkbox.closest('.request-form');
      const form = modalForm || pageForm;
      
      if (form && checkbox.checked && form.classList.contains('was-validated')) {
        // Если чекбокс отмечен, проверяем всю форму
        if (form.checkValidity()) {
          form.classList.remove('was-validated');
        }
      }
    }
  });
}


// Адаптивные слайдеры новостей: <=768 включаем Swiper, >768 выключаем
function initNewsResponsiveSliders() {
  // Глобальное хранилище экземпляров, чтобы было доступно из initTabs
  const instances = window.newsSwiperInstances || new Map();
  window.newsSwiperInstances = instances;

  function getAllContainers() {
    // Получаем все слайдеры (во всех табах)
    return Array.from(document.querySelectorAll('.news__slider .swiper'));
  }

  function enable(swiperEl) {
    if (instances.has(swiperEl)) return; // уже включен
    
    const sliderId = swiperEl.getAttribute('data-news-slider');
    const prevBtn = document.querySelector(`[data-news-prev="${sliderId}"]`);
    const nextBtn = document.querySelector(`[data-news-next="${sliderId}"]`);
    const container = swiperEl.closest('.news__slider');
    // Зафиксируем текущую высоту контейнера на время инициализации, чтобы избежать скачка
    const containerHeight = container ? container.offsetHeight : 0;
    if (container && containerHeight > 0) {
      container.style.minHeight = containerHeight + 'px';
    }
    // Не скрываем слайдер, избегаем моргания при первом показе
    
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
          // После инициализации показываем слайдер и снимаем фиксацию высоты с небольшой задержкой
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
    const allContainers = getAllContainers();
    
    // Отключаем все ранее инициализированные
    instances.forEach((inst, el) => {
      if (!allContainers.includes(el) || width > 768) {
        disable(el);
      }
    });
    
    // Обрабатываем видимые контейнеры
    allContainers.forEach(el => {
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
        const targetPanel = container.querySelector(`.tabs__panel[data-tab-panel="${target}"]`);
        // Переинициализация слайдеров новостей при переключении таба
        if (window.newsSlidersRefresh) {
          // Перестраиваем все слайдеры и дополнительно обновляем те, что в целевой панели
          setTimeout(() => {
            window.newsSlidersRefresh();
            if (targetPanel) {
              const swipers = targetPanel.querySelectorAll('.news__slider .swiper');
              swipers.forEach(swiperEl => {
                const inst = (window.newsSwiperInstances && window.newsSwiperInstances.get(swiperEl));
                if (inst) {
                  inst.update();
                  inst.updateAutoHeight(200);
                }
              });
              // Дополнительно стабилизируем высоту после обновления
              requestAnimationFrame(() => {
                inst.updateAutoHeight(200);
              });
            }
          }, 100);
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

  let ticking = false;

  const updateHeader = () => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    
    if (scrollY >= 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  };

  // Первичная установка
  updateHeader();

  // Слушатель скролла с оптимизацией через requestAnimationFrame
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Плашка меню для мобильной версии (появляется при скролле)
function initMobileMenuBar() {
  const menuBar = document.querySelector('.mobile-menu-bar');
  if (!menuBar) return;

  // Только на мобильных устройствах
  if (window.innerWidth > 767) return;

  const updateVisibility = () => {
    // Получаем значение скролла из нескольких источников для совместимости
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    
    // При скролле меньше 50px (включая 0) - плашка скрыта
    // Используем строгое сравнение для гарантированного скрытия при нулевом скролле
    if (scrollY < 50) {
      menuBar.classList.remove('mobile-menu-bar--visible');
    } else {
      // При скролле >= 50px - показываем плашку
      menuBar.classList.add('mobile-menu-bar--visible');
    }
  };

  // Дополнительная проверка при достижении верха страницы
  const checkScrollTop = () => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    if (scrollY === 0) {
      menuBar.classList.remove('mobile-menu-bar--visible');
    }
  };

  // Первичная установка
  updateVisibility();

  // Слушатели с более частой проверкой для надежности
  window.addEventListener('scroll', () => {
    updateVisibility();
    // Дополнительная проверка при достижении верха
    checkScrollTop();
  }, { passive: true });

  window.addEventListener('scrollend', checkScrollTop, { passive: true });

  window.addEventListener('resize', utils.debounce(() => {
    if (window.innerWidth > 767) {
      menuBar.classList.remove('mobile-menu-bar--visible');
    } else {
      updateVisibility();
    }
  }, 150));
}

// Плавная анимация открытия/закрытия для details в секции FAQ
function initFaqDetailsAnimation() {
  const detailsList = document.querySelectorAll('.faq details');
  if (!detailsList.length) return;

  detailsList.forEach((det) => {
    const summary = det.querySelector('summary');
    const answer = det.querySelector('.faq__answer');
    if (!summary || !answer) return;

    // Инициализация исходного состояния
    if (det.open) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.style.opacity = '1';
    } else {
      answer.style.maxHeight = '0px';
      answer.style.opacity = '0';
    }

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      // Закрытие
      if (det.open) {
        // фиксируем текущую высоту, затем анимируем к 0
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0px';
          answer.style.opacity = '0';
        });
        const onCloseEnd = (ev) => {
          if (ev.propertyName !== 'max-height') return;
          answer.removeEventListener('transitionend', onCloseEnd);
          det.open = false;
        };
        answer.addEventListener('transitionend', onCloseEnd);
      } else {
        // Открытие
        det.open = true;
        // старт с 0 к нужной высоте
        answer.style.maxHeight = '0px';
        answer.style.opacity = '0';
        requestAnimationFrame(() => {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
        });
        const onOpenEnd = (ev) => {
          if (ev.propertyName !== 'max-height') return;
          answer.removeEventListener('transitionend', onOpenEnd);
          // опционально снять максимум, чтобы контент с динамической высотой не обрезался после открытии
          answer.style.maxHeight = answer.scrollHeight + 'px';
        };
        answer.addEventListener('transitionend', onOpenEnd);
      }
    });
  });
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

