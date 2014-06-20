var gulp = require('gulp')
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

var paths = {
  scripts: ['src/*.js'],
};

gulp.task('compile', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('js/'));
});

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('webserver', function() {
  connect.server();
});

gulp.task('default', ['lint','compile','webserver']);
