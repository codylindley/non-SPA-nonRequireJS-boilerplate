var gulp = require('gulp');
var gutil = require('gulp-util');
var useref = require('gulp-useref');
var bundle = require('gulp-bundle');
var runSequence = require('run-sequence');
var cleanhtml = require('gulp-cleanhtml');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');
var imageop = require('gulp-image-optimization');
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
	return gulp.src('./publicBuild/**/*.html')
    .pipe(cleanhtml())
    .pipe(gulp.dest('./publicBuild'));
});

gulp.task('img', function () {
    gulp.src(['./public/**/*.png','./public/**/*.jpg','./public/**/*.gif','./public/**/*.jpeg'])
        .pipe(imagemin())
        .pipe(gulp.dest('./publicBuild'));
});

gulp.task('images', function(cb) {
    gulp.src(['./public/**/*.png','./public/**/*.jpg','./public/**/*.gif','./public/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('./publicBuild')).on('end', cb).on('error', cb);
});

gulp.task('bustCache', function(){
  gulp.src(['./publicBuild/**/*.html'])
    .pipe(replace('.css', '?v=0.0'))
    .pipe(replace('.js', '?v=0.0'))
    .pipe(gulp.dest('./publicBuild'));
});

gulp.task('build', function(callback) {
	runSequence('bundleCSSAndHtml','rewriteCSSAndHtmlforBundle','minifyHtml','bustCache',callback);
});