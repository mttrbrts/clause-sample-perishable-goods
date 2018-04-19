const gulp = require('gulp')
const pug = require('gulp-pug')
const less = require('gulp-less')
const minifyCSS = require('gulp-csso')
const runSequence = require('run-sequence')
const chug = require('gulp-chug')
const watch = require('gulp-watch');
 
gulp.task('watch', () => {
  return watch('views/**/*', () => {
    runSequence(
      [ 'html', 'css', 'js' ]
    )
  });
})

const OUTPUT_DIR = 'public'

gulp.task('html', () => {
  return gulp.src('views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(OUTPUT_DIR))
})

gulp.task('css', () => {
  gulp.src('views/stylesheets/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest(OUTPUT_DIR + '/css'));
  return gulp.src('views/stylesheets/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest(OUTPUT_DIR + '/css'))
})

gulp.task('images', () => {
  return gulp.src('views/images/**/*')
    .pipe(gulp.dest(OUTPUT_DIR + '/images'))
})

gulp.task('js', () => {
  return gulp.src('views/javascripts/*.js')
    .pipe(gulp.dest(OUTPUT_DIR + '/js'))
})

// Run another Gulp build to build Semantic UI
gulp.task('build-semantic', () => {
	return gulp.src('./semantic/gulpfile.js')
		.pipe(chug({ tasks: ['build'] })) // Run 'gulp build' in /semantic
})

// Copy built Semantic UI files to /public
gulp.task('copy-semantic-css', () => {
  return gulp.src('semantic/dist/semantic.min.css')
    .pipe(gulp.dest(OUTPUT_DIR + '/css'))
})
gulp.task('copy-semantic-js', () => {
  return gulp.src('semantic/dist/semantic.min.js')
    .pipe(gulp.dest(OUTPUT_DIR + '/js'))
})
gulp.task('copy-semantic-fonts', () => {
  return gulp.src('semantic/src/themes/default/assets/fonts/**/*')
    .pipe(gulp.dest(OUTPUT_DIR + '/css/themes/default/assets/fonts'))
})
gulp.task('copy-semantic-images', () => {
  return gulp.src('semantic/src/themes/default/assets/images/**/*')
    .pipe(gulp.dest(OUTPUT_DIR + '/css/themes/default/assets/images'))
})

// Semantic UI requires jQuery
gulp.task('copy-jquery', () => {
	gulp.src('node_modules/jquery/dist/jquery.min.js')
		.pipe(gulp.dest(OUTPUT_DIR + '/js'))
})

// Gulp default task.
gulp.task('default', () => {
	runSequence(
		[ 'html', 'css', 'js', 'images', 'copy-jquery' ],
		'build-semantic',
		[ 'copy-semantic-css', 'copy-semantic-js', 'copy-semantic-fonts', 'copy-semantic-images' ]
	)
})