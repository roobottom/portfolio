'use strict'

const settings = require('./_settings.js')

//filesystem
const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')

//frontmatter
const frontmatter = require('front-matter')

//nunjucks
const nunjucks = require('nunjucks')
const nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(settings.nunjucksPath),
  {
    autoescape: false,
    noCache:true
  }
)

//markdown
var Remarkable = require('remarkable');
const md = new Remarkable('full',{
  html: true,
  typographer: true,
  enable: ['abbr','footnote','deflist','footnote_inline','ins','mark','sub','sup']
});

//time
const moment = require('moment')


const site = {}

function getObjectsFromSource(source) {

  //loop through each item in this source
  for(let item of settings[source]) {
    //get list of files from this item's input glob
    let files = glob.sync(item.input)

    //build local object of item contents
    let objects = []
    for(let file of files) {
      objects.push(readFileContents(file))
    }

    //attach the source's items to the item object
    item.items = objects

  }

  //return the updated source
  return settings[source]
}

//returns an object containing `attributes` and `content` objects
function readFileContents(file) {

  let data = fs.readFileSync(file,'utf8')

  //read frontmatter
  let fm = frontmatter(data)

  //render nunjcuks tags
  let renderedContent = nunjucksEnv.renderString(fm.body,fm.attributes)

  //render md -> html
  renderedContent = md.render(renderedContent)

  //get filename
  let filePath = path.parse(file)


  let returnObj = {}
  returnObj.attributes = fm.attributes
  returnObj.id = filePath.name
  returnObj.content = renderedContent

  return returnObj

}

function renderFileWithTemplate(template,data) {
  return nunjucksEnv.render(template,data);
}

let pouchGo = function() {
  let pageList = getObjectsFromSource('pages')
  let blogsList = getObjectsFromSource('blogs')

  //pages
  for(let items of pageList) {

    for(let item of items.items) {

      let renderedFile = renderFileWithTemplate(items.template,{
        content: item.content,
        page: item.attributes
      })

      fs.ensureFileSync(items.output)
      fs.writeFileSync(items.output,renderedFile)

    }

  }

  //blogs
  for(let items of blogsList) {

    for(let item of items.items) {

      let renderedFile = renderFileWithTemplate(items.template,{
        content: item.content,
        page: item.attributes
      })

      console.log(item)

      let output = items.output + '/' + item.id + '/index.html'

      fs.ensureFileSync(output)
      fs.writeFileSync(output,renderedFile)

    }

  }

  return true;
}

//async wrapper
let pouchAsync = function(cb) {
  pouchGo()
  cb()
}

exports.pouchGo = pouchGo
exports.pouchAsync = pouchAsync
