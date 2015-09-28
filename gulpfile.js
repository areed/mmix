var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var serve = require('gulp-serve');

gulp.task('makeBrowserTests', ['copyMochaAssets', 'bundleTests']);

gulp.task('bundleTests', function() {
  return browserify([
    'ops/test/_run.js',
    'test/assemble.js',
    'test/disassemble.js',
    'test/memory.js',
    'test/MMIX.js',
    'test/utils.js',
  ])
    .bundle()
    .pipe(source('tests.js'))
    .pipe(gulp.dest('dist/tests'));
});

gulp.task('copyMochaAssets', function() {
  return gulp.src([
    'node_modules/mocha/mocha.js',
    'node_modules/mocha/mocha.css',
  ]).pipe(gulp.dest('dist/tests'));
});

gulp.task('serveTests', ['makeBrowserTests'], serve('dist/tests/'));
