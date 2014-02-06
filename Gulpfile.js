(function() {
  'use strict';

  var gulp = require('gulp'),
      // gutil = require('gulp-util'),
      dot = require('gulp-dot'),
      less = require('gulp-less'),
      sass = require('gulp-sass'),
      rm = require('rimraf'),
      reload = require('gulp-livereload'),
      imagemin = require('gulp-imagemin'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      watch = require('gulp-watch'),
      header = require('gulp-header'),
      pkg = require('./package'),
      banner;

  banner = '/*!\n' +
               ' * ' + pkg.name + ' - ' + pkg.description + '\n' +
               ' * ' + pkg.url + '\n' +
               ' * @author ' + pkg.author + '\n' +
               ' * @version ' + pkg.version + '\n' +
               ' * Copyright ' + pkg.copyright + '. ' + pkg.license + ' licensed.\n' +
               ' */\n';

  gulp.task('serve', ['dot:dev', 'less:dev', 'img:dev', 'js:dev', 'static']);

  gulp.task('build', ['dot', 'less', 'img', 'js']);

  gulp.task('static', function(next) {
    var staticS = require('node-static');
    var server = new staticS.Server('./build');
    require('http').createServer(function (request, response) {
      request.addListener('end', function () {
        server.serve(request, response);
      }).resume();
    }).listen(8080, next);
  });

  gulp.task('dot:dev', ['clean'], function() {
    return gulp.src('app/*.dot')
      .pipe(watch())
      .pipe(dot({layout: 'app/layouts/dev.dot'}))
      .pipe(gulp.dest('build'))
      .pipe(reload());
  });

  gulp.task('dot', ['clean'], function() {
    return gulp.src('app/*.dot')
      .pipe(dot({layout: 'app/layouts/prod.dot'}))
      .pipe(gulp.dest('build'));
  });

  gulp.task('less:dev', ['clean'], function() {
    return gulp.src('app/less/style.less')
      .pipe(watch())
      .pipe(less())
      .pipe(gulp.dest('build/css'))
      .pipe(reload());
  });

  gulp.task('less', ['clean'], function() {
    return gulp.src('app/less/style.less')
      .pipe(less({compress:true}))
      .pipe(header(banner))
      .pipe(gulp.dest('build/css'));
  });

  gulp.task('img:dev', ['clean'], function() {
    return gulp.src(['app/img/**'])
      .pipe(watch())
      .pipe(gulp.dest('build/img'))
      .pipe(reload());
  });

  gulp.task('img', ['clean'], function() {
    return gulp.src(['app/img/**'])
      .pipe(imagemin())
      .pipe(gulp.dest('build/img'));
  });

  gulp.task('js:dev', ['clean'], function() {
    return gulp.src(['app/js/**'])
      .pipe(watch())
      .pipe(gulp.dest('build/js'))
      .pipe(reload());
  });

  gulp.task('js', ['clean'], function() {
    return gulp.src(['app/js/**'])
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(header(banner))
      .pipe(gulp.dest('build/js'));
  });

  gulp.task('sass:dev', ['clean'], function() {
    return gulp.src('app/sass/style.scss')
      .pipe(watch())
      .pipe(sass())
      .pipe(gulp.dest('build/css'))
      .pipe(reload());
  });

  gulp.task('sass', ['clean'], function() {
    return gulp.src('app/sass/style.scss')
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(header(banner))
      .pipe(gulp.dest('build/css'));
  });

  gulp.task('clean', function(next) {
    rm('build/', function() {
      next();
    });
  });
})();
