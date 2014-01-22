(function() {
  'use strict';

  var g = require('gulp'),
    gutil = require('gulp-util'),
      dot = require('gulp-dot'),
      less = require('gulp-less'),
      rm = require('rimraf'),
      lr = require('tiny-lr'),
      pkg = require('./package'),
      refresh = require('gulp-livereload'),
      spawn = require('child_process').spawn,
      path  = require('path'),
      util = require('util'),
      server = lr();

  process.on('uncaughtException', function(err) {
    gutil.log('Caught exception: ' + err);
  });

  g.task('less', function () {
    g.src(pkg.dir.source + '/less/style.less')
      .pipe(less())
      .pipe(g.dest(pkg.dir.dest + '/css'))
      .pipe(refresh(server));
  });

  g.task('copy:js', function() {
    g.src(pkg.dir.source + '/js/**')
      .pipe(g.dest(pkg.dir.dest + '/js'))
      .pipe(refresh(server));
  });

  g.task('copy:img', function() {
    g.src(pkg.dir.source + '/img/**')
      .pipe(g.dest(pkg.dir.dest + '/img'))
      .pipe(refresh(server));
  });

  g.task('copy:font', function() {
    g.src(pkg.dir.source + '/font/**')
      .pipe(g.dest(pkg.dir.dest + '/font'))
      .pipe(refresh(server));
  });

  g.task('copy',
    ['copy:js', 'copy:img','copy:font', 'copy:vendorScripts'],
    function() {

  });

  g.task('copy:vendorScripts', function () {
    g.src([
      'vendor/jquery/jquery.min.js',
      'vendor/bootstrap/dist/js/bootstrap.min.js'
    ]).pipe(g.dest(pkg.dir.dest+'/js/vendor'));
  });

  g.task('dot', function () {
    var settings = {
      def: pkg.dir.source + '/partials/*.def'
    };

    g.src(pkg.dir.source + '/*.dot')
      .pipe(dot(settings))
      .pipe(g.dest(pkg.dir.dest))
      .pipe(refresh(server));
  });

  g.task('clean', function (cb) {
    rm(pkg.dir.dest + '/*', cb);
  });

  g.task('default', [
      'clean',
      'dot',
      'less',
      'copy'
    ], function () {
      var mongoose = spawn('mongoose', [
        '-document_root',
        path.join(__dirname, pkg.dir.dest),
        '-listening_ports',
        80
      ]);

      mongoose.stdout.on('data', function (data) {
        util.log('mongoose stdout: ' + data);
      });

      mongoose.stderr.on('data', function (data) {
        util.error('mongoose stderr: ' + data);
      });

      mongoose.on('close', function (code) {
        util.log('mongoose child process exited with code ' + code);
      });

      server.listen(35729, function (err) {
        if (err) return console.log(err);

        g.watch(pkg.dir.source + '/{img,font,js}/**/*.*', function () {
          g.run('copy');
        });
        g.watch(pkg.dir.source + '/less/**/*.less', function () {
          g.run('less');
        });
        g.watch(pkg.dir.source + '/**/*.{dot,def}', function () {
          g.run('dot');
        });

      });
    }
  );
})();
