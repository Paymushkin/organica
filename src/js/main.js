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
                const inst = window.newsSwiperInstances && window.newsSwiperInstances.get(swiperEl);
                if (inst) {
                  inst.update();
                  inst.updateAutoHeight(200);
                }
              });
              // Дополнительно стабилизируем высоту после обновления
              requestAnimationFrame(() => {
                swipers.forEach(swiperEl => {
                  const inst = window.newsSwiperInstances && window.newsSwiperInstances.get(swiperEl);
                  if (inst) {
                    inst.updateAutoHeight(200);
                  }
                });
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

