const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const connect = require('gulp-connect');
const less = require('gulp-less');
const pouch = require('./_pouch/pouch.js')
const site = require('./_site.js')
const webpack = require('webpack-stream')

console.log(site.baseurl)

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
  .pipe(less({
    globalVars: {
      baseurl: "'" + site.baseurl + "'"
    }
  }))
  .pipe(gulp.dest('./docs'))
})

gulp.task('static',function() {
  return gulp.src('./static/**/*')
  .pipe(gulp.dest('./docs'))
})

gulp.task('js',function() {
  return gulp.src('./js/load-later.js')
  .pipe(webpack({
    entry: {
      loadlater: './js/load-later.js'
    },
    output: {
      filename: '[name].js',
    }
  }))
  .pipe(gulp.dest('./docs'))
})

gulp.task('default', gulp.parallel(server,runPouch,'less','static','js',function(done) {
  watch()
  done()
}))

gulp.task('build',gulp.parallel(runPouch,'less','static','js'))

gulp.task('pouch',gulp.parallel(runPouch))

function watch() {
  gulp.watch(['./source/**/*.md','./templates/**/*.html'], gulp.parallel(runPouch))
  gulp.watch(['./less/**/*.less','./templates/_patterns/**/*.less','./templates/_components/**/*.less'], gulp.parallel('less'))
  gulp.watch('./static/**/*', gulp.parallel('static'))
  gulp.watch(['./templates/**/*.js','./js/*.js'], gulp.parallel('js'))
}
