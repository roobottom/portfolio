'use strict'

const site = require('./_site.js')

//filesystem
const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')

//utils
const _ = require('lodash')
const util = require('util')

//frontmatter
const frontmatter = require('front-matter')

//nunjucks
const nunjucks = require('nunjucks')
const nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(site.nunjucksPath),
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





function addItemsToCollections(collections) {
  for(let collection of collections) {

    for(let item of site[collection]) {

      //get list of files from this item's input glob
      let files = glob.sync(item.input)

      //build local object of item contents
      let objects = []
      for(let file of files) {

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
        returnObj.filename = filePath.name
        returnObj.content = renderedContent

        objects.push(returnObj)
      }

      //push local objects back into site
      item.items = objects

    }

  }
}

function sortCollections(collections) {
  for(let collectionName of collections) {
    for(let collection of site[collectionName]) {
      if(collection.sortBy) {
        collection.items.sort((a,b) => {
          return b.attributes[collection.sortBy] - a.attributes[collection.sortBy]
        })
      }
    }
  }
}

let collections = ['blogs','pages']
addItemsToCollections(collections)
sortCollections(collections)

console.log(util.inspect(site, false, null))
