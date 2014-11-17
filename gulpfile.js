var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('default', function () {
    gulp.start('scripts');
});

gulp.task('scripts', function () {
    return gulp.src('lib/gettext.js')
        .pipe(gulp.dest('dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('dist'));
});
