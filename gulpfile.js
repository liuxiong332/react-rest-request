var gulp = require('gulp');
var connect = require('gulp-connect');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

function compile(watch) {
  var bundler = watchify(
    browserify('./lib/main.js', {debug: true})
    .transform("babelify", {presets: ["es2015", "react", "stage-2"]})
  );

  function rebundle() {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('main.js'))
      .pipe(buffer())
      // optional, remove if you dont want sourcemaps
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
      .pipe(sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest('./build/js/'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  return rebundle();
}

gulp.task('sass', function () {
  return gulp.src('./style/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/style'));
});

gulp.task('watch-sass', function() {
  return gulp.watch('./style/*.scss', ['sass']);
});

//start local dev svr
gulp.task('connect', function() {
  return connect.server({
    root: ['./build'],
    livereload: true
  });
});

gulp.task('js', function() { return compile(); });
gulp.task('watch', function() { return compile(true); });
gulp.task('build', ['js', 'sass']);
gulp.task('default', ['watch', 'watch-sass', 'connect']);
