var gulp = require('gulp')
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');

var metagenerator = require('./app/metagenerator.js');

var paths = {
  scripts: ['src/*.js'],
  public : ['public/'],
  style: ['public/css/style.sass']
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

gulp.task('style', function() {
  return gulp
    .src(paths.style)
    .pipe(plumber())
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css'));
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver());
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, [ 'lint','compile']);
  gulp.watch(paths.style, [ 'style' ]);
});

gulp.task('generate', function(cb){
  metagenerator(cb);
});

gulp.task('default', [ 'lint', 'compile', 'style', 'webserver', 'watch' ]);
