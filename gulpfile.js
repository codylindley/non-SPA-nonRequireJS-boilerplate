var gulp = require('gulp');
var gutil = require('gulp-util');
var useref = require('gulp-useref');
var bundle = require('gulp-bundle');
var runSequence = require('run-sequence');
var cleanhtml = require('gulp-cleanhtml');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');
var removeLogs = require('gulp-removelogs');
var size = require('gulp-filesize');
var htmlhint = require("gulp-htmlhint");
var csslint = require('gulp-csslint');
var jshint = require('gulp-jshint');
var jsonminify = require('gulp-jsonminify');

var build = '0.0.0';

gulp.task('htmlHint', function () {
    gulp.src(['./public/**/*.html','!./public/bower/**'])
    .pipe(htmlhint({htmlhintrc:'.htmlhintrc'}))
    .pipe(htmlhint.reporter());
});

gulp.task('cssLint', function() {
    gulp.src(['./public/**/*.css','!./public/bower/**'])
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter());
});

gulp.task('validatejsHintRc', function () {
    gulp.src(['.jshintrcComments'])
    .pipe(jsonminify())
    .pipe(gulp.dest('./'));
});

gulp.task('jsHint', function() {
    gulp.src(['./public/**/*.js','!./public/bower/**'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter());
});

//bundle together js and css

/*

options to minify CSS below:

keepSpecialComments - * for keeping all (default), 1 for keeping first one, 0 for removing all
keepBreaks - whether to keep line breaks (default is false)
removeEmpty - whether to remove empty elements (default is false)
debug - turns on debug mode measuring time spent on cleaning up (run npm run bench to see example)
root - path with which to resolve absolute @import rules
relativeTo - path with which to resolve relative @import rules

options to minify JS below

mangle - Pass false to skip mangling names.
output - Pass an object if you wish to specify additional output options. The defaults are optimized for best compression.
compress - Pass an object to specify custom compressor options. Pass false to skip compression completely.
preserveComments - A convenience option for options.output.comments. Defaults to preserving no comments.
all - Preserve all comments in code blocks
some - Preserve comments that start with a bang (!) or include a Closure Compiler directive (@preserve, @license, @cc_on)
function - Specify your own comment preservation function. You will be passed the current node and the current comment and are expected to return either true or false.
You can also pass the uglify function any of the options listed here(https://github.com/mishoo/UglifyJS2#the-simple-way) to modify UglifyJS's behavior.

*/
//replace css and js includes, minify both css and js
gulp.task('bundleCSSAndHtml', bundle('./public/**/*.html', {
    appDir: './public',
    buildDir: './publicBuild',
    minify: true,
    minifyCss: {},
    minifyJs: {}
}));

//bundle together js and css
gulp.task('rewriteCSSAndHtmlforBundle', function () {
    return gulp.src(['./public/**/*.html','!./public/bower/**'])
        .pipe(useref())
        .pipe(gulp.dest('./publicBuild'));
});

//minify html
gulp.task('minifyHtml', function(){
	return gulp.src(['./publicBuild/**/*.html'])
    .pipe(cleanhtml())
    .pipe(gulp.dest('./publicBuild'));
});

//optimize images
gulp.task('img', function () {
    gulp.src(['./public/**/*.png','./public/**/*.jpg','./public/**/*.gif','./public/**/*.jpeg','!./public/bower/**'])
        .pipe(imagemin())
        .pipe(gulp.dest('./publicBuild'));
});

//add cache bust, based on build 
gulp.task('bustCache', function(){
    gulp.src(['./publicBuild/**/*.html'])
    .pipe(replace('.css"', '.css?v='+build+'"'))
    .pipe(replace('.js"', '.js?v='+build+'"'))
    .pipe(gulp.dest('./publicBuild'));
});

gulp.task('removeLogs', function(){
    gulp.src(['./publicBuild/**/*.js'])
    .pipe(removeLogs())
    .pipe(gulp.dest('./publicBuild'))
    .pipe(size());
});

gulp.task('validate', function(callback) {
    runSequence(
        'htmlHint',
        'cssLint',
        'validatejsHintRc',
        'jsHint',
    callback);
});

gulp.task('build', function(callback) {
	runSequence(
        'htmlHint',
        'cssLint',
        'validatejsHintRc',
        'jsHint',
        'bundleCSSAndHtml',
        'rewriteCSSAndHtmlforBundle',
        'minifyHtml',
        'img',
        'bustCache',
        'removeLogs',
    callback);
});


