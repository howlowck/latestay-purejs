var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserify = require('browserify');
var util = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var source = require('vinyl-source-stream');
var livereload = require('gulp-livereload');

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['built/**', 'index.html']).on('change', livereload.changed);
});

gulp.task('sass', function () {
    return sass('src/css/default.scss')
        .on('error', function (err) { 
          util.log('error', util.colors.red(err.message));
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('built'));
});

gulp.task('browserify', function () {
   return browserify('./src/js/index.js')
       .bundle()
       .on('error', function (err) {
           util.log('error', util.colors.red(err.message));
           this.emit('end');
       })
       .pipe(source('index.js'))
       .pipe(gulp.dest('./built'));
});

gulp.task('default', function () {
    gulp.start('watch');
    gulp.start('sass');
    gulp.start('browserify');

    gulp.watch(['./src/css/**/*.scss'], ['sass']);
    gulp.watch(['./src/js/**/*'], ['browserify']);
});