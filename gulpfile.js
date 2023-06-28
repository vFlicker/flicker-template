import autoprefixer from 'autoprefixer'; // autoprefixer
import browserSync from 'browser-sync'; // refresh browser
import cssnano from 'cssnano'; // minify CSS
import del from 'del'; // delete files
import gulp from 'gulp'; // GULP itself
import babel from 'gulp-babel'; // JavaScript transporter
import concat from 'gulp-concat'; // concatenate files
import htmlmin from 'gulp-htmlmin'; // minify HTML
import imagemin from 'gulp-imagemin'; // compresses pictures
import postcss from 'gulp-postcss'; // postcss plugin
import rename from 'gulp-rename'; // rename files
import dartSass from 'sass'; // convert sass to css
import gulpSass from 'gulp-sass'; // convert sass to css
import sourcemaps from 'gulp-sourcemaps'; // creates sourcemaps
import svgstore from 'gulp-svgstore'; // creates an svg sprite
import uglify from 'gulp-uglify'; // minify JS
import webp from 'gulp-webp'; // convert PNG, JPEG to WebP
import webphtml from 'gulp-webp-html'; // replaces HTML images with WebP
import rollup from 'rollup-stream'; // JavaScript module builder
import source from 'vinyl-source-stream'; // to work with the file system
import buffer from 'vinyl-buffer'; // to work with the file system

const browserSyncInstance = browserSync.create();
const sass = gulpSass(dartSass);

export const html = () => {
  return gulp.src('src/*.html')
    .pipe(webphtml())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
};

export const styles = () => {
  return gulp.src('src/styles/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('dist/css'))
    .pipe(postcss([cssnano()]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSyncInstance.stream());
};

export const scripts = () => {
  const rollupConfig = {
    input: './src/scripts/script.js',
    format: 'iife',
    sourcemap: true
  };

  return rollup(rollupConfig)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel({ presets: ['@babel/preset-env'], }))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSyncInstance.stream());
};

export const vendor = () => {
  return gulp
    .src('src/scripts/vendor/**/*.js')
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
};

export const images = () => {
  const imageminConfig = [
    imagemin.mozjpeg({ progressive: true }),
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.svgo({ plugins: [{ removeViewBox: false }]}),
  ];

  return gulp.src(['src/images/**/*.{png,jpg,svg}', '!src/images/sprite-icons/*.svg'])
    .pipe(imagemin(imageminConfig))
    .pipe(gulp.dest('dist/img'))
    .pipe(gulp.src('src/images/**/*.{jpg, png}'))
    .pipe(gulp.dest('dist/img'))
};

export const createWebp = () => {
  return gulp.src('src/images/**/*.{jpg,png}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('dist/img'))
};

export const sprite = () => {
  return gulp.src('src/images/sprite-icons/*.svg')
    .pipe(imagemin([imagemin.svgo({ plugins: [{ removeViewBox: false }] })]))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('dist/img'));
};

export const copy = () => {
  return gulp.src(['src/fonts/*.{woff2,woff}', 'src/*.ico'], { base: "src" })
    .pipe(gulp.dest('dist'))
};

export const clean = () => del('dist');

export const reload = (done) => {
  browserSyncInstance.reload();
  done();
};

export const watcher = () => {
  gulp.watch('src/*.html', gulp.series(html, reload));
  gulp.watch('src/styles/**/*.scss', gulp.series(styles));
  gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
};

export const server = () => {
  browserSyncInstance.init({
    cors: true,
    ui: false,
    notify: false,
    server: { baseDir: 'dist' }
  });
};

const build = gulp.series(
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

export default build;
