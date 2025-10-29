const { src, dest, watch, series, parallel, task } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const del = require('del');
const plumber = require('gulp-plumber');
const gulpif = require('gulp-if');
const changed = require('gulp-changed');
const cache = require('gulp-cached');
const remember = require('gulp-remember');
const os = require('os');

// Получение переменной окружения
const env = process.env.env || 'development';
const isProduction = env === 'production';
const isDevelopment = env === 'development';

console.log(`🚀 Режим сборки: ${env}`);

// Пути
const paths = {
  src: {
    pug: 'src/pug/**/*.pug',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    images: 'src/images/**/*.{jpg,jpeg,png,gif,svg}',
    fonts: 'src/fonts/**/*'
  },
  dist: {
    html: 'dist/',
    css: 'dist/css/',
    js: 'dist/js/',
    images: 'dist/images/',
    fonts: 'dist/fonts/'
  },
  cache: {
    images: '.cache/images',
    fonts: '.cache/fonts'
  }
};

// Очистка
function clean() {
  return del(['dist/**/*', '.cache/**/*']);
}

// Pug
function compilePug() {
  return src('src/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: !isProduction
    }))
    .pipe(dest(paths.dist.html));
}

// SCSS
function compileSCSS() {
  return src('src/scss/main.scss')
    .pipe(plumber())
    .pipe(gulpif(isDevelopment, sourcemaps.init()))
    .pipe(sass({
      api: 'modern-compiler', // Используем современный API
      quietDeps: true, // Отключаем предупреждения от зависимостей
      silenceDeprecations: ['legacy-js-api', 'import'] // Отключаем устаревшие предупреждения
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpif(isProduction, cleanCSS()))
    .pipe(gulpif(isDevelopment, sourcemaps.write('.')))
    .pipe(dest(paths.dist.css));
}

// JavaScript
function compileJS() {
  return src([
    'src/js/libraries/swiper.min.js',
    'src/js/**/*.js'
  ])
    .pipe(plumber())
    .pipe(gulpif(isDevelopment, sourcemaps.init()))
    .pipe(concat('main.js'))
    .pipe(gulpif(isProduction, uglify()))
    .pipe(gulpif(isDevelopment, sourcemaps.write('.')))
    .pipe(dest(paths.dist.js));
}

// Изображения с кэшированием
function optimizeImages() {
  return src(paths.src.images)
    .pipe(plumber())
    .pipe(gulpif(isDevelopment, changed(paths.dist.images)))
    .pipe(gulpif(isDevelopment, cache('images')))
    .pipe(dest(paths.dist.images))
    .pipe(gulpif(isDevelopment, remember('images')));
}

// WebP с кэшированием
function createWebP() {
  return src('src/images/**/*.{jpg,jpeg,png}')
    .pipe(plumber())
    .pipe(gulpif(isDevelopment, changed(paths.dist.images)))
    .pipe(gulpif(isDevelopment, cache('webp')))
    .pipe(webp({ quality: 80 }))
    .pipe(dest(paths.dist.images))
    .pipe(gulpif(isDevelopment, remember('webp')));
}

// Шрифты с кэшированием
function copyFonts() {
  return src(paths.src.fonts)
    .pipe(plumber())
    .pipe(gulpif(isDevelopment, changed(paths.dist.fonts)))
    .pipe(gulpif(isDevelopment, cache('fonts')))
    .pipe(dest(paths.dist.fonts))
    .pipe(gulpif(isDevelopment, remember('fonts')));
}

// CSS библиотеки
function copyCSSLibs() {
  return src('src/scss/*.css')
    .pipe(plumber())
    .pipe(dest(paths.dist.css));
}

// Получение IP-адреса
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Browser Sync
function serve() {
  const localIP = getLocalIP();
  
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
    notify: false,
    open: false,
    // Настройки для мобильной разработки
    host: '0.0.0.0', // Доступ из любой сети
    port: 3000,
    // Включить внешний доступ
    ui: {
      port: 3001
    },
    // Настройки для мобильных устройств
    tunnel: false, // Можно включить для внешнего доступа
    logLevel: 'info',
    // Автоматическое обновление
    reloadOnRestart: true,
    // Настройки для мобильных браузеров
    codeSync: true,
    // Отключить уведомления на мобильных
    notify: {
      styles: {
        top: 'auto',
        bottom: '0'
      }
    }
  }, () => {
    console.log('\n🌐 Доступ к сайту:');
    console.log(`📱 Мобильные устройства: http://${localIP}:3000`);
    console.log(`💻 Локальный адрес: http://localhost:3000`);
    console.log(`⚙️  Панель управления: http://localhost:3001`);
    console.log('\n📋 Инструкция:');
    console.log('1. Убедитесь, что устройства в одной Wi-Fi сети');
    console.log('2. Откройте браузер на телефоне/планшете');
    console.log(`3. Перейдите по адресу: http://${localIP}:3000`);
    console.log('\n🔄 Изменения будут синхронизироваться автоматически!\n');
  });
}

// Отслеживание изменений
function watchFiles() {
  // Pug
  watch(paths.src.pug, series(compilePug))
    .on('change', browserSync.reload);
  
  // SCSS
  watch(paths.src.scss, series(compileSCSS))
    .on('change', browserSync.reload);
  
  // JS
  watch(paths.src.js, series(compileJS))
    .on('change', browserSync.reload);
  
  // Изображения (только если изменились)
  if (isDevelopment) {
    watch(paths.src.images, series(optimizeImages, createWebP))
      .on('change', browserSync.reload);
  }
  
  // Шрифты (только если изменились)
  if (isDevelopment) {
    watch(paths.src.fonts, series(copyFonts))
      .on('change', browserSync.reload);
  }
}

// Задачи для отдельных компонентов
task('build:fonts', copyFonts);
task('build:images', series(optimizeImages, createWebP));

// Основные задачи
const build = series(
  clean,
  parallel(
    compilePug,
    compileSCSS,
    compileJS,
    optimizeImages,
    createWebP,
    copyFonts,
    copyCSSLibs
  )
);

// Разработка
const dev = series(
  build,
  parallel(serve, watchFiles)
);

// Только отслеживание
const watchOnly = series(
  build,
  watchFiles
);

// Только сервер
const serveOnly = series(
  build,
  serve
);

// Экспорт
exports.clean = clean;
exports.build = build;
exports.dev = dev;
exports.watch = watchOnly;
exports.serve = serveOnly;
exports['build:fonts'] = copyFonts;
exports['build:images'] = series(optimizeImages, createWebP);
exports.default = dev;