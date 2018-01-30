'use strict'

const settings = require('./_settings.js')

//filesystem
const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')

//utils
const _ = require('lodash')

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
var Remarkable = require('remarkable')
const md = new Remarkable('full',{
  html: true,
  typographer: true,
  enable: ['abbr','footnote','deflist','footnote_inline','ins','mark','sub','sup']
})

//time
const moment = require('moment')


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

//get all objects in a particular source: eg, blog, pages, patterns.
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

//renders any given file with any given template
function renderFileWithTemplate(template,data) {
  return nunjucksEnv.render(template,data)
}

function sortItems(items,sortby) {
  return items.sort((a,b) => {
    return b[sortby] - a[sortby]
  })
}

function getTags(items) {
  let tags = []
  for(let item of items) {
    if(item.attributes.tags) {
      tags.push(item.attributes.tags)
    }
  }

  //clean tags list
  tags = _.flatten(tags)
  for(let tag of tags) {
    tag = tag.toLowerCase()
  }

  //count unique tags
  let uniqueTagCount = []
  tags.forEach(function(n) {
    uniqueTagCount[n] = (uniqueTagCount[n] || 0)+1
  })

  //create tagsObject
  let tagsObject = []
  for(let key in uniqueTagCount) {
    tagsObject.push({
      name: key,
      count: uniqueTagCount[key]
    })
  }

  return tagsObject
}

let pouchGo = function() {

  let site = {
    pages: getObjectsFromSource('pages'),
    blogs: getObjectsFromSource('blogs')
  }

  //update the site object with meta from blogs
  for(let key in site.blogs) {

    //if blog has a sort by key
    if(site.blogs[key].sortBy) {
      site.blogs[key].items = sortItems(site.blogs[key].items,site.blogs[key].sortBy)
    }

    //if blog tags, get tags:
    if(site.blogs[key].tags) {
      site.blogs[key].tags.items = getTags(site.blogs[key].items)
    }

  }

  //render pages
  for(let items of site.pages) {

    for(let item of items.items) {

      //attach meta
      if(items.tags) {
        item.attributes.tags = items.tags
      }

      let renderedFile = renderFileWithTemplate(items.template,{
        content: item.content,
        page: item.attributes,
        site: site
      })

      fs.ensureFileSync(items.output)
      fs.writeFileSync(items.output,renderedFile)

    }

  }



  //render blogs
  for(let blog of site.blogs) {

    //for each item in this blog
    for(let item of blog.items) {

      let renderedFile = renderFileWithTemplate(blog.template,{
        content: item.content,
        page: item.attributes
      })

      let output = blog.output + '/' + item.id + '/index.html'

      fs.ensureFileSync(output)
      fs.writeFileSync(output,renderedFile)

    }

  }

  return true
}

//async wrapper
let pouchAsync = function(cb) {
  pouchGo()
  cb()
}

exports.pouchGo = pouchGo
exports.pouchAsync = pouchAsync
