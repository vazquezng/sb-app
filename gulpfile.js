var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
const shell = require('gulp-shell');
const path = require('path');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

var paths = {
  assets: 'src/img/**/*',
  fonts: 'src/fonts/**/*',
  cssimages: 'src/css/**/*.png',
  templates: 'src/templates/**/*',
  sass: ['./scss/**/*.scss'],
  css: ['src/css/ionic.web.css', 'src/css/ionic.android.css',
    'src/css/ionic.ios.css'
  ],
  ionicfonts: 'src/lib/ionic/fonts/**/*',
  dist: './www/'
};

const URL_BUCKET = {
  dev: 'http://www.socialtenis.dev:8084',
  prod: 'http://web.slambow.com'
}


process.env.ENVIRONMENT = 'dev';
process.env.URL_BUCKET = URL_BUCKET[process.env.ENVIRONMENT];
process.env.URL_API = 'http://api.slambow.com/api/v1';//'http://192.168.33.10/api/v1';
process.env.FACEBOOK_ID = '188438681613821';
process.env.TWITTER_ID = '';

gulp.task('envProd', (cb) => {
  process.env.ENVIRONMENT = 'prod';
  process.env.URL_BUCKET = URL_BUCKET[process.env.ENVIRONMENT];
  process.env.URL_API = 'http://api.slambow.com/api/v1';
  process.env.FACEBOOK_ID = '353935338297275';
  process.env.TWITTER_ID = '';
  cb();
});


gulp.task('envAndroid', () => {
  process.env.COMPILE_ENV = 'android';
});
gulp.task('envIos', () => {
    process.env.COMPILE_ENV = 'ios';
});

gulp.task('clean', () => {
  const stream = gulp.src(paths.dist, {
      read: false,
    })
    .pipe(clean({
      force: true
    }))
    .on('error', gutil.log);
  return stream;
});

gulp.task('copy', ['clean'], () => {
  gulp.src(paths.assets)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false,
      }],
      use: [pngquant()],
    }))
    .pipe(gulp.dest(`${paths.dist}img`))
    .on('error', gutil.log);

  gulp.src(paths.cssimages)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false,
      }],
      use: [pngquant()],
    }))
    .pipe(gulp.dest(`${paths.dist}css`))
    .on('error', gutil.log);


  gulp.src(paths.templates)
    .pipe(gulp.dest(`${paths.dist}templates`))
    .on('error', gutil.log);

  gulp.src('src/css/**')
    .pipe(gulp.dest(`${paths.dist}css`))
    .on('error', gutil.log);

  gulp.src('src/po/**')
    .pipe(gulp.dest(`${paths.dist}po`))
    .on('error', gutil.log);

  gulp.src(paths.ionicfonts)
    .pipe(gulp.dest(`${paths.dist}lib/ionic/fonts`))
    .on('error', gutil.log);

  /*gulp.src(paths.firebase)
      .pipe(gulp.dest(`${paths.dist}lib/`))
      .on('error', gutil.log);*/

  gulp.src(paths.fonts)
    .pipe(gulp.dest(`${paths.dist}fonts`))
    .on('error', gutil.log);
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./src/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./src/css/'))
    .on('end', done);
});

gulp.task('watchsass', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('webpack', (callback) => {
  const webpackConfigProd = require('./webpack.config.prod.js');
  // run webpack
  webpack(webpackConfigProd, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString({
      // output options
    }));
    callback();
  });
});


gulp.task('webpack-dev-server', () => {
  const webpackConfig = require('./webpack.config.js');

  new WebpackDevServer(webpack(webpackConfig), {
    contentBase: path.join(__dirname, 'src'),
    stats: {
      colors: true,
    },
  }).listen(8084, '0.0.0.0', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }

    const startUrl =
      'http://www.socialtenis.dev:8084/webpack-dev-server/index.html';
    //open(startUrl);
    gutil.log('[webpack-dev-server]', startUrl);
  });
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
      '\n  Download git here:', gutil.colors.cyan(
        'http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan(
        'gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('deploy', shell.task([
  'cordova platform rm android',
  'cordova platform add android@6.1.2',
  'ionic build android',
  'cordova build android --release',
  'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore debug.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk Slambow -storepass android',
  'zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/android-release-final.apk',
  'mv platforms/android/build/outputs/apk/android-release-final.apk android-release-final.apk',
  'rm -f platforms/android/build/outputs/apk/*'
]));

gulp.task('ios', shell.task([
    'cordova platform rm ios',
    'cordova platform add ios',
    'gulp iosTasks',
    'ionic build ios',
]));


gulp.task('default', ['sass']);
gulp.task('watchandroid', ['watchsass', 'envAndroid', 'webpack-dev-server']);


gulp.task('androidLocal', ['sass', 'envAndroid', 'copy', 'webpack']);
gulp.task('android', ['sass', 'envAndroid', 'envProd', 'copy', 'webpack']);
gulp.task('iosTasks', ['sass', 'envIos', 'copy', 'webpack']);
