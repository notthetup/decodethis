var gulp = require('gulp')
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

var paths = {
  scripts: ['src/*.js'],
  public : ['public/'],
};

gulp.task('compile', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(paths.public + 'js/'));
});

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver());
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['lint','compile']);
});

gulp.task('default', ['lint','compile','webserver', 'watch']);
