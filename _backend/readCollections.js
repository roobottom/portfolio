'use strict';

const through = require('through2');
const path = require('path');

module.exports = function(settings) {
  let collections = [];

  return through.obj(function(file, enc, cb) {
    let fileobj = path.parse(file.path);
    collections.push(fileobj.name);
    console.log(fileobj.name);
		this.push(file);
		cb();
	},
  function(cb) {
    console.log('collections:',collections);
    cb();
  });

};
