var g = require('gulp'),
    dot = require('gulp-dot'),
    less = require('gulp-less'),
    rm = require('rimraf'),
    lr = require('tiny-lr'),
    pkg = require('./package'),
    refresh = require('gulp-livereload'),
    server = lr();

g.task('less:dev', function () {
  g.src(pkg.dir.source + '/less/**/*.less')
    .pipe(less())
    .pipe(g.dest(pkg.dir.dest + '/css'))
    .pipe(refresh(server));
});

g.task('copy:assets', function() {
  g.src(pkg.dir.source + '/{img,font,js}')
    .pipe(g.dest(pkg.dir.dest));
});

g.task('dot', function () {
  var settings = {
    templateSettings: null,
    def: pkg.dir.source + '/partials/*.def'
  };

  g.src(pkg.dir.source + '/*.dot')
    .pipe(dot(settings))
    .pipe(g.dest(pkg.dir.dest))
    .pipe(refresh(server));
});

g.task('default', function () {
  rm(pkg.dir.dest, function (err) {
    if (err) return console.log(err);

    server.listen(35729, function (err) {
      if (err) return console.log(err);

      g.run('dot', 'less:dev', 'copy:assets', function () {
        g.watch(pkg.dir.source + '/{img,font,js}/**/*', function () {
          g.run('copy:assets');
        });
        g.watch(pkg.dir.source + '/less/**/*.less', function () {
          g.run('less:dev');
        });
        g.watch(pkg.dir.source + '/**/*.{dot,def}', function () {
          g.run('dot');
        });
      });
    });
  });
});
