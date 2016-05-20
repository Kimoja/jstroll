var gulp = require('gulp');
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    insert = require('gulp-insert'),
    version = require('./bower.json').version;
    
var banner =
  '/*!\n' +
  ' * jstroll.js v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' Joakim Carrilho (Kimoja - https://github.com/Kimoja) \n' +
  ' * Released under the MIT License.\n' +
  ' */\n';

gulp.task('minify', function () {
    return gulp.src('src/jstroll.js')
        .pipe(uglify())
        .pipe(insert.prepend(banner))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'Finished minifying JavaScript'}));
});

gulp.task('default', function () {
    gulp.run('minify');
    gulp.watch('src/jstroll.js', function () {
        gulp.run('minify');
    });
});


