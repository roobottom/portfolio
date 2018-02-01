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
        returnObj = fm.attributes
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
        let firstSortItem = collection.items[0][collection.sortBy]
        if(typeof firstSortItem === 'string') { //if a string
          collection.items.sort(function(a, b) {
            var stringA = a[collection.sortBy].toUpperCase();
            var stringB = b[collection.sortBy].toUpperCase();
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
            return b[collection.sortBy] - a[collection.sortBy]
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

function addTagsToCollections(collections) {
  for(let collectionName of collections) {
    for(let collection of site[collectionName]) {
      if(collection.tags) {

        //build collection.tags.items
        let tags = []
        for(let item of collection.items) {
          if(item.tags) {
            tags.push(item.tags)
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

        //create object for each tag
        let tagsObject = []
        for(let key in uniqueTagCount) {

          //get all items with this tag
          let itemsWithTag = []
          for(let item of collection.items) {
            if(item.tags) {
              for(let tag of item.tags) {
                if(tag == key) {
                  itemsWithTag.push(item)
                }
              }
            }
          }
          tagsObject.push({
            name: key,
            count: uniqueTagCount[key],
            items: itemsWithTag
          })
        }
        //push tag items back into site ob
        collection.tags.items = tagsObject

      }
    }
  }
}

function renderCollections() {

  //render each page
  for (let collection of site['pages']) {
    let output = collection.output
    let template = collection.template
    for(let item of collection.items) {

      //define page object
      let page = item
      page.content = item.content

      fs.ensureFileSync(output)
      fs.writeFileSync(output,nunjucksEnv.render(template,{
        page: page,
        site: site
      }))

    }
  }

  //render blogs
  for (let collection of site['blogs']) {

    let template = collection.template
    for(let item of collection.items) {

      let output = collection.output + '/' + item.filename + '/index.html'

      //define page object
      let page = item
      page.content = item.content

      fs.ensureFileSync(output)
      fs.writeFileSync(output,nunjucksEnv.render(template,{
        page: page,
        site: site
      }))

    }

    //render tags pages
    if(collection.tags) {
      let template = collection.tags.template

      for(let item of collection.tags.items) {
        let output = collection.tags.output + '/' + item.name + '/index.html'

        //define page object
        let page = {}
        page.title = item.name
        page.count = item.count
        page.items = item.items

        fs.ensureFileSync(output)
        fs.writeFileSync(output,nunjucksEnv.render(template,{
          page: page,
          site: site
        }))
      }

    }

    //TODO
    //render pagination pages
    if(collection.pagination) {
      let template = collection.pagination.template
    }

  }



}



let collections = ['blogs','pages']
addItemsToCollections(collections)
sortCollections(collections)
paginateCollections(collections)
addTagsToCollections(collections)
renderCollections()

fs.writeJsonSync('./output.json',site)
