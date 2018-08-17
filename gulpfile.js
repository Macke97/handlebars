const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

gulp.task('es6', () => {
  return gulp.src('./js/*.js')
    .pipe(
      concat('main.js')
    )
    .pipe(
      babel({
        presets: 'es2015'
      })
    )
    .pipe(
      gulp.dest('./public/js')
    )
});

gulp.task('sass', function () {
  return gulp.src('./sass/style.scss')
    .pipe(sass({includePaths: ['./sass']}).on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
});



gulp.task('default', ['es6', 'sass']);

gulp.task('watch', () => {
  gulp.watch('./sass/*.scss', ['sass']);
  gulp.watch('./js/*.js', ['es6']);
});