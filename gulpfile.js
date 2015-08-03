var gulp = require('gulp');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');

var libPath = './lib/**/*.js';
var testPath = './test/**/*.spec.js';
var buildTestPath = './build/test/**/*.spec.js';

gulp.task('build', function() {
  return gulp.src([libPath])
      .pipe(babel({sourceMap: false, modules: 'common'}))
      .pipe(gulp.dest('./build/lib'));
});

gulp.task('build_test', function() {
  return gulp.src([testPath])
      .pipe(babel({sourceMap: false, modules: 'common'}))
      .pipe(gulp.dest('./build/test'));
});

gulp.task('test', ['build', 'build_test'], function () {
  return gulp.src(buildTestPath, {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('lint', function () {
  return gulp.src([libPath, testPath])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
});


gulp.task('default', ['lint', 'test']);
