var g = require('gulp'),
    dot = require('gulp-dot'),
    sass = require('gulp-sass'),
    rm = require('rimraf'),
    lr = require('tiny-lr'),
    pkg = require('./package'),
    refresh = require('gulp-livereload'),
    server = lr();

g.task('sass:dev', function () {
  var settings = {
    includePath: __dirname,
    outputStyle: 'expanded'
  };

  g.src(pkg.dir.source + '/sass/style.scss')
    .pipe(sass(settings))
    .pipe(g.dest(pkg.dir.dest + '/css'))
    .pipe(refresh(server));
});

g.task('copy:assets', function () {
  g.src(pkg.dir.source + '/{img,font,js}')
    .pipe(g.dest(pkg.dir.dest))
    .pipe(refresh(server));
});

g.task('copy:vendorScripts', function () {
  [
    'vendor/jquery/jquery.min.js',
    'vendor/foundation/js/foundation.min.js',
    'vendor/modernizr/modernizr.js'
  ].forEach(function (file) {
    g.src(file).pipe(g.dest(pkg.dir.dest+'/js/vendor'));
  });
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

g.task('clean:dest', function () {
  rm.sync(pkg.dir.dest);
});

g.task('default', [
    'clean:dest',
    'dot',
    'sass:dev',
    'copy:assets',
    'copy:vendorScripts'
  ], function () {
    server.listen(35729, function (err) {
      if (err) return console.log(err);

      g.watch(pkg.dir.source + '/{img,font,js}/**/*', function () {
        g.run('copy:assets');
      });
      g.watch(pkg.dir.source + '/sass/**/*.scss', function () {
        g.run('sass:dev');
      });
      g.watch(pkg.dir.source + '/**/*.{dot,def}', function () {
        g.run('dot');
      });

    });
  }
);
