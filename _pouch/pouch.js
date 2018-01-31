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
  for(let collectionName of collections) {

    for(let collection of site[collectionName]) {

      //get list of files from this item's input glob
      let files = glob.sync(collection.input)

      //build local object of collection contents
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
      collection.items = objects

    }

  }
}

function sortCollections(collections) {
  for(let collectionName of collections) {
    for(let collection of site[collectionName]) {
      if(collection.sortBy) {

        //is the first item to be sorted a string or an object/number?
        let firstSortItem = collection.items[0].attributes[collection.sortBy]
        if(typeof firstSortItem === 'string') { //if a string
          collection.items.sort(function(a, b) {
            var stringA = a.attributes[collection.sortBy].toUpperCase();
            var stringB = b.attributes[collection.sortBy].toUpperCase();
            if (stringA < stringB) {
              return -1;
            }
            if (stringA > stringB) {
              return 1;
            }
            return 0;
          })
        } else { //if not a string sorting is easier
          collection.items.sort((a,b) => {
            return b.attributes[collection.sortBy] - a.attributes[collection.sortBy]
          })
        }


      }
    }
  }
}

function paginateCollections(collections) {

  for(let collectionName of collections) {
    for(let collection of site[collectionName]) {

      if(collection.pagination) {

        collection.pagination.pages = []
        collection.items.forEach((item, index) => {
          if(index%collection.pagination.limit == 0) {
            var uri =  collection.pagination.uri + (collection.pagination.pages.length + 1)
            collection.pagination.pages.push({
              items: [],
              uri: uri
            })
          }
          collection.pagination.pages[collection.pagination.pages.length-1].items.push(item)
        })

      }

    }
  }


}

let collections = ['blogs','pages']
addItemsToCollections(collections)
sortCollections(collections)
paginateCollections(collections)

fs.writeJsonSync('./output.json',site)
