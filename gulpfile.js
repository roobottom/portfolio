const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const connect = require('gulp-connect');
const less = require('gulp-less');
const pouch = require('./_pouch/pouch.js')

gulp.task('default', gulp.parallel(server,runPouch,function(done) {
  watch()
  done()
}))

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

function watch() {
  gulp.watch(['./source/**/*.md','./templates/**/*.html'], gulp.parallel(runPouch))
}
