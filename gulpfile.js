'use strict';

var path = require('path');
var gulp = require('gulp');
var gulpSass = require('gulp-sass');
var gulpShell = require('gulp-shell');
var exec = require('child_process').exec;
var gulpUglify = require('gulp-uglify');
var Q = require('q');
var del = require('del');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence').use(gulp);

var webpackConfig = require('./webpack.config');

var paths = {
  config: path.relative(__dirname, './webpack.config.js'),
  src: path.relative(__dirname, webpackConfig.context),
  dest: path.relative(__dirname, webpackConfig.output.path)
};

var shellTasks = {
  karma: 'NODE_ENV=test node node_modules/karma/bin/karma start',
  webpackTest: 'NODE_ENV=test node node_modules/.bin/webpack --colors',
  webpackProduction: 'NODE_ENV=production node node_modules/.bin/webpack --colors',
  webpackDevelopment: 'NODE_ENV=development node node_modules/.bin/webpack --colors',
};

var arrFiles = [paths.src + '/index.html', 'node_modules/angular2/node_modules/zone.js/zone.js'];

gulp.task('serve', ['watch'], browserSyncInit([paths.dest], [path.join(paths.dest, '**', '*.{js,html}')]));
gulp.task('test', gulpShell.task([shellTasks.webpackTest, shellTasks.webpackTest + ' --watch &' + shellTasks.karma]));
gulp.task('build', build([shellTasks.webpackProduction]));
gulp.task('build:dev', build([shellTasks.webpackDevelopment]));
gulp.task('sass', sass);
gulp.task('minification', minification);
gulp.task('clean', clean([paths.dest, 'test', 'coverage']));

gulp.task('watch', ['sass', 'html'], watch);
gulp.task('html', html);

function build(tasks) {
  return function() {
    return runSequence('clean', ['sass', 'html'], gulpShell.task(tasks));
  };
}

function watch() {
  gulp.watch(path.join(paths.src, '**/*.scss'), sass);
  gulp.watch(arrFiles, html);
  var cmd = exec('NODE_ENV=development node node_modules/.bin/webpack --colors --watch');
  cmd.stdout.on('data', function(data) {
    console.log(data);
  });
}

function minification() {
  return Q.all([clean([paths.dest + '/bundle.js.map'])(), uglify()]);
}

function clean(files) {
  return function () {
    return callbackToPromise(del, [files]);
  };
}

function sass() {
  var stream = gulp
    .src(paths.src + '/**/*.scss')
    .pipe(gulpSass())
    .pipe(gulp.dest(paths.src));

  return streamToPromise(stream);
}

function html() {
  var stream = gulp
    .src(arrFiles)
    .pipe(gulp.dest(paths.dest));

  return streamToPromise(stream);
}

function uglify() {
  var stream = gulp
    .src(paths.dest + '/bundle.js')
    .pipe(gulpUglify())
    .pipe(gulp.dest(paths.dest));

  return streamToPromise(stream);
}

function streamToPromise(stream) {
  var deferred = Q.defer();

  stream.resume();

  stream
    .once('error', function (err) {
      deferred.reject(err);
    })
    .once('finish', function () {
      deferred.resolve();
    })
    .once('end', function () {
      deferred.resolve();
    });

  return deferred.promise;
}

function callbackToPromise(fn, params) {
  var deferred = Q.defer();

  function done(err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
    }
  }

  params.push(done);
  fn.apply(null, params);

  return deferred.promise;
}

function browserSyncInit(baseDir, files, browser) {
  return function () {
    browser = browser === undefined ? 'default' : browser;

    var deferred = Q.defer();

    function done(err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    }

    browserSync.instance = browserSync(files || [], {
      startPath: '/',
      port: 9000,
      server: {
        baseDir: baseDir,
        middleware: [],
        routes: null
      },
      browser: browser
    }, done);

    return deferred.promise;
  };
}
