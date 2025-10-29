// Конфигурация сборки
module.exports = {
  // Режимы сборки
  modes: {
    development: {
      sourcemaps: true,
      minify: false,
      cache: true,
      watch: true,
      browserSync: true
    },
    production: {
      sourcemaps: false,
      minify: true,
      cache: false,
      watch: false,
      browserSync: false
    }
  },

  // Настройки изображений
  images: {
    // Качество JPEG
    jpegQuality: 80,
    // Качество WebP
    webpQuality: 80,
    // Уровень оптимизации PNG
    pngOptimization: 5,
    // Форматы для WebP
    webpFormats: ['jpg', 'jpeg', 'png']
  },

  // Настройки CSS
  css: {
    // Автопрефиксер
    autoprefixer: {
      browsers: ['> 1%', 'last 2 versions', 'not dead']
    },
    // Минификация
    minify: {
      level: 2
    }
  },

  // Настройки JavaScript
  js: {
    // Минификация
    uglify: {
      compress: true,
      mangle: true
    }
  },

  // Настройки Browser Sync
  browserSync: {
    server: {
      baseDir: 'dist'
    },
    notify: false,
    open: false,
    port: 3000,
    // Настройки для мобильной разработки
    host: '0.0.0.0', // Доступ из любой сети
    ui: {
      port: 3001
    },
    tunnel: false, // Можно включить для внешнего доступа
    logLevel: 'info',
    reloadOnRestart: true,
    codeSync: true,
    // Настройки для мобильных браузеров
    notify: {
      styles: {
        top: 'auto',
        bottom: '0'
      }
    }
  },

  // Пути для кэширования
  cache: {
    images: '.cache/images',
    fonts: '.cache/fonts',
    webp: '.cache/webp'
  }
};

