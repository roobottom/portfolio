const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks-render');
const connect = require('gulp-connect');
const less = require('gulp-less');

const settings = require('./_config.js');
const readCollections = require('./_backend/readCollections.js');

//init global site object
const site = {};

// gulp.task('collections:read', () => {
//   for(let i in settings.collections) {
//     return gulp.src(settings.collections[i].input)
//     .pipe(readCollections(site));
//   }
// });

gulp.task('html',() => {
  return gulp.src('./templates/pages/*.html')
  .pipe(nunjucks({
    path: ['./templates']
  }))
  .pipe(gulp.dest('./docs'))
});

gulp.task('server',() => {
  connect.server({
    root: './docs'
  });
});

gulp.task('less',()=> {
  return gulp.src('./less/styles.less')
  .pipe(less())
  .pipe(gulp.dest('./docs'))
});

gulp.task('watch', () => {
  gulp.watch(['./templates/**/*.html'], ['html']);
  gulp.watch(['./less/**/*.less'],['less']);
});

gulp.task('default',
  gulp.parallel('server','html','less','watch')
);
