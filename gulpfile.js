const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const connect = require('gulp-connect');
const less = require('gulp-less');
const pouch = require('./_pouch/pouch.js')

function server(done) {
  connect.server({
    root: './docs'
  })
  done();
}

function runPouch(done) {
  pouch(function() {
    done();
  });
}

gulp.task('less', function() {
  return gulp.src('./less/styles.less')
  .pipe(less())
  .pipe(gulp.dest('./docs'))
})

gulp.task('static',function() {
  return gulp.src('./static/**/*')
  .pipe(gulp.dest('./docs'))
})

gulp.task('default', gulp.parallel(server,runPouch,'less','static',function(done) {
  watch()
  done()
}))

gulp.task('build',gulp.parallel(runPouch))

function watch() {
  gulp.watch(['./source/**/*.md','./templates/**/*.html'], gulp.parallel(runPouch))
  gulp.watch(['./less/**/*.less','./templates/patterns/**/*.less'], gulp.parallel('less'))
  gulp.watch('./static/**/*', gulp.parallel('static'))
}
