'use strict'

//really dumb string version of nodejs' path.parse
//returns, where it can: root, dir, base, ext
//!filenames that utalise the . character will not be parsed correctly!

function path(input) {
  if(input == null) return input
  let returnObj = {}

  returnObj.root = input.startsWith('/') ? '/' : ''

  let dirs = input.split('/')
  returnObj.base = dirs.pop()
  returnObj.dir = dirs.join('/')

  let file = returnObj.base.split('.')
  returnObj.ext = '.' + file.pop()
  returnObj.name = file.shift()

  return returnObj
}

module.exports = path
