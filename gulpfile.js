import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';

// Styles

export const styles = () => { // name
  return gulp.src('source/sass/style.scss', { sourcemaps: true }) // 1. style.scss

  .pipe(plumber()) // 2. обработка ошибок
    .pipe(sass().on('error', sass.logError)) // style.scss -> style.css
    .pipe(postcss([ // style.css
      autoprefixer(), // style.css -> style.css[prefix]
      csso()  // style.css[prefix] -> style.css[prefix, min]
    ]))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' })) // 3. sourse/css
    .pipe(browser.stream());
}

// HTML

const html = () => { // name
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Scripts

const script = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'));
}

// Images

// const images = () => {
//   return gulp.src('source/img/*/*.jpg.png')
//     .pipe(terser())
//     .pipe(gulp.dest('build/img'));
// }

// WebP



//SVG

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  html, styles, script, server, watcher
);
