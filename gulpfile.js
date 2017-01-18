var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
const shell = require('gulp-shell');

var paths = {
    sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

gulp.task('deploy', shell.task([
    'cordova platform rm android',
    'cordova platform add android',
    'ionic build android',
    'cordova build android --release',
    'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore debug.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk Slambow -storepass android',
    process.env.zipalign + ' -v 4 "platforms/android/build/outputs/apk/android-release-unsigned.apk" "platforms/android/build/outputs/apk/android-release-final.apk"',
    'mv platforms/android/build/outputs/apk/android-release-final.apk android-release-final.apk',
    'rm -f platforms/android/build/outputs/apk/*'
]));