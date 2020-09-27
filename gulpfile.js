const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');


gulp.task('scss', (done) =>{
    return gulp
    .src('dev/scss/**/*.scss')
    .pipe(sass())
    .pipe(
        autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        })
    )
    .pipe(gulp.dest('public/stylesheets'))
    done();
});

gulp.task('scripts', () => {
    gulp
    .src([
        'dev/js/auth.js',
        'dev/js/post.js',
        'dev/js/comment.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('public/javascripts'))
});

gulp.task('watch', (done) =>{
    gulp.watch('dev/scss/**/*.scss', gulp.series('scss'));
    gulp.watch('dev/js/**/*.js', gulp.series('scripts'));
    done();
});
gulp.task('default', gulp.series('scss', 'watch', 'scripts'));