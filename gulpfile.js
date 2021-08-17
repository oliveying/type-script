var gulp = require('gulp');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var tsify = require('tsify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var paths = {
  pages: ['src/*.html']
}
gulp.task('copy-html', function () {
  return gulp.src(paths.pages)
  .pipe(gulp.dest('dist'))
})

gulp.task("default",gulp.parallel("copy-html"), function () {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
  }).plugin(tsify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist'));
});