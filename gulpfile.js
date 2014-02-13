var gulp = require('gulp');
var gutil = require('gulp-util');
var useref = require('gulp-useref');
var bundle = require('gulp-bundle');
var runSequence = require('run-sequence');
var cleanhtml = require('gulp-cleanhtml');
var replace = require('gulp-replace');
var removeLogs = require('gulp-removelogs');
var size = require('gulp-filesize');
var htmlhint = require("gulp-htmlhint");
var csslint = require('gulp-csslint');
var jshint = require('gulp-jshint');
var jsonminify = require('gulp-jsonminify');
var fileinclude = require('gulp-file-include');
var clean = require('gulp-clean');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

var build = '0.0.0';

//run on src

//replace css and js includes, minify both css and js
gulp.task('bundleCSSAndHtml', bundle('./src/**/*.html', {
    appDir: './src',
    buildDir: './build',
    minify: false
}));

//bundle together js and css
gulp.task('rewriteCSSAndHtmlforBundle', function () {
    return gulp.src(['./src/**/*.html','!./src/bower/**'])
        .pipe(useref())
        .pipe(gulp.dest('./build'));
});

gulp.task('includes', function() {
    return gulp.src(['./build/**/*.html','!./build/bower/**'])
        .pipe(fileinclude())
        .pipe(gulp.dest('./build'));
});

//optimize images
gulp.task('img', function () {
    return gulp.src(['./src/**/*.png','./src/**/*.jpg','./src/**/*.gif','./src/**/*.jpeg','./src/**/*.jpg','!./src/bower/**'])
        .pipe(imagemin())
        .pipe(gulp.dest('./build'));
});


//run on build

gulp.task('move', function(){
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    return gulp.src('./build/**/*.*', { base: './build' })
    .pipe(gulp.dest('production'));
});

//run on production

gulp.task('htmlHint', function () {
    return gulp.src(['./production/**/*.html','!./production/shared/includes/*.html'])
    .pipe(htmlhint({htmlhintrc:'.htmlhintrc'}))
    .pipe(htmlhint.reporter());
});

gulp.task('cssLint', function() {
    return gulp.src(['./production/**/*.css','!./production/**/thirdparty.css'])
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter());
});

gulp.task('validatejsHintRc', function () {
    return gulp.src(['.jshintrcComments'])
    .pipe(jsonminify())
    .pipe(gulp.dest('./'));
});

gulp.task('jsHint', function() {
    return gulp.src(['./production/**/*.js','!./production/**/thirdparty.js','!./production/**/ie.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter());
});

//minify html
gulp.task('minifyHtml', function(){
    return gulp.src(['./production/**/*.html'])
    .pipe(cleanhtml())
    .pipe(gulp.dest('./production'));
});

//add cache bust, based on build 
gulp.task('bustCache', function(){
    return gulp.src(['./production/**/*.html'])
    .pipe(replace('.css"', '.css?v='+build+'"'))
    .pipe(replace('.js"', '.js?v='+build+'"'))
    .pipe(gulp.dest('./production'));
});

gulp.task('removeLogs', function(){
    return gulp.src(['./production/**/*.js'])
    .pipe(removeLogs())
    .pipe(gulp.dest('./production'))
    .pipe(size());
});

gulp.task('minifyCss', function() {
    return gulp.src('./production/**/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('./production'));
});

gulp.task('minifyJs', function() {
    return gulp.src('./production/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./production'));
});

gulp.task('watch', function(){
    gulp.watch(['./src/**/*.html','./src/**/*.css','./src/**/*.js','!./build/bower/**'],['build']);
});

gulp.task('build', function(callback) {
	runSequence(
        'bundleCSSAndHtml',
        'rewriteCSSAndHtmlforBundle',
        'includes',
        'img',
    callback);
});

gulp.task('cleanFiles', function(callback) {
    gulp.src(['./build','./production'], {read: false})
    .pipe(clean());
});

gulp.task('production', function(callback) {
    runSequence(
        'bundleCSSAndHtml',
        'rewriteCSSAndHtmlforBundle',
        'includes',
        'img',
        'move',
        'bustCache',
        'htmlHint',
        'cssLint',
        'validatejsHintRc',
        'jsHint',
        'minifyHtml',
        'minifyCss',
        'minifyJs',
        'removeLogs',
    callback);
});


