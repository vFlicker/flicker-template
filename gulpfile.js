const autoprefixer = require('autoprefixer'); // автопрефиксер
const browserSync = require('browser-sync').create(); // обновление браузера
const del = require('del'); // удаляет файлы
const gulp = require('gulp'); // сам GULP
const concat = require('gulp-concat'); // объединяет файлы
const cssnano = require('cssnano'); // минифицирует CSS
const htmlmin = require('gulp-htmlmin'); // минифицирует HTML
const imagemin = require('gulp-imagemin'); // сжимает картинки
const postcss = require('gulp-postcss'); // плагин postcss
const rename = require('gulp-rename'); // переименует файлы
const sass = require('gulp-sass')(require('sass'));; // конвертиртирует sass в css
const sourcemaps = require('gulp-sourcemaps'); // создаёт sourcemaps
const svgstore = require('gulp-svgstore'); // создаёт спрайт svg
const uglify = require('gulp-uglify'); // минифицирует JS
const webp = require('gulp-webp'); // конвертиртирует PNG, JPEG в WebP
const webphtml = require('gulp-webp-html'); // заменяет в HTML картинки на WebP

const html = () => {
  return gulp.src('src/*.html')
    .pipe(webphtml())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'))
};

exports.html = html;

const styles = () => {
  return gulp.src('src/styles/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('dist/css'))
    .pipe(postcss([
      cssnano()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
};

exports.styles = styles;

const scripts = () => {
  return gulp.src('src/scripts/script.js')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
};

exports.scripts = scripts;

const vendor = () => {
  return gulp
    .src('src/scripts/vendor/**/*.js')
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
};

exports.vendor = vendor;

const images = () => {
  return gulp.src(['src/images/**/*.{png,jpg,svg}', '!src/images/sprite-icons/*.svg'])
    .pipe(imagemin([
      imagemin.mozjpeg({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      }),
    ]))
    .pipe(gulp.dest('dist/img'))
    .pipe(gulp.src('src/images/**/*.{jpg, png}'))
    .pipe(gulp.dest('dist/img'))
};

exports.images = images;

const createWebp = () => {
  return gulp.src('src/images/**/*.{jpg,png}')
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest('dist/img'))
};

exports.createWebp = createWebp;

const sprite = () => {
  return gulp.src('src/images/sprite-icons/*.svg')
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      }),
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('dist/img'));
};

exports.sprite = sprite;

const copy = () => {
  return gulp.src(
    [
      'src/fonts/*.{woff2,woff}',
      'src/*.ico'
    ],
    {
      base: "src"
    }
  )
    .pipe(gulp.dest('dist'))
};

exports.copy = copy;

const clean = () => {
  return del('dist');
};

const reload = (done) => {
  browserSync.reload();
  done();
};

const watcher = () => {
  gulp.watch('src/*.html', gulp.series(html, reload));
  gulp.watch('src/styles/**/*.scss', gulp.series(styles));
  gulp.watch('src/scripts/*.js', gulp.series(scripts));
};

exports.watcher = watcher;

const server = () => {
  browserSync.init({
    cors: true,
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist'
    }
  });
};

exports.server = server;

exports.default = gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    scripts,
    vendor,
    images,
    createWebp,
    sprite,
    copy
  ),
  gulp.parallel(
    server,
    watcher,
  ),
);
