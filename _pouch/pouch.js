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
nunjucks.configure(site.nunjucksPath, {
  noCache: true,
  autoescape: false
})


//markdown
var Remarkable = require('remarkable')
const md = new Remarkable('full',{
  html: true,
  xhtmlOut: true,
  typographer: true,
  enable: ['abbr','footnote','deflist','footnote_inline','ins','mark','sub','sup']
})

//time
const moment = require('moment')

//local util functions
function toURL(str) {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%20/g, '-');
}

function createPatternsString() {
  let files = glob.sync(site.patterns.input)
  site.patterns.string = ''
  for(let file of files) {
    let data = fs.readFileSync(file,'utf8')
    site.patterns.string += data
  }
}
function removeWhitespace(str) {
  return str.replace(/(\r\n|\n|\r|\t)/gm,"")
}

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
        let renderString = removeWhitespace(site.patterns.string) + fm.body
        let renderedContent = nunjucks.renderString(renderString,fm.attributes)

        //render md -> html
        renderedContent = md.render(renderedContent)

        //get filename
        let filePath = path.parse(file)


        let returnObj = {}
        returnObj = fm.attributes
        returnObj.url = filePath.name
        returnObj.content = renderedContent

        //add human readable dates
        returnObj.humanDate = {}
        returnObj.humanDate.day = moment(fm.attributes.date).format('Do');
        returnObj.humanDate.month = moment(fm.attributes.date).format('MMM');
        returnObj.humanDate.year = moment(fm.attributes.date).format('YYYY');
        returnObj.humanDate.date = moment(fm.attributes.date).format('dddd, MMMM Do YYYY')

        objects.push(returnObj)
      }

      //push local objects back into site
      collection.items = objects

    }

  }
}

function sortCollections(collections) {
  for(let collectionName of collections) {

    // --- sort collection

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

    // --- update each collection with prev / next object
    // --- (even if collection hasn't been sorted)

    for(let collection of site[collectionName]) {

      for(let key in collection.items) {
        let next = parseInt(key)-1;
        let prev = parseInt(key)+1;

        if(next in collection.items) {
          collection.items[key].next = {};
          collection.items[key].next.title = collection.items[next].title;
          collection.items[key].next.url = collection.items[next].url;
          collection.items[key].next.date = collection.items[next].date;
        }
        if(prev in collection.items) {
          collection.items[key].prev = {};
          collection.items[key].prev.title = collection.items[prev].title;
          collection.items[key].prev.url = collection.items[prev].url;
          collection.items[key].prev.date = collection.items[prev].date;
        }
      }


    }

  }
}

function paginateCollections(collections) {

  for(let collectionName of collections) {
    for(let collection of site[collectionName]) {

      if(collection.pagination) {

        collection.pagination.pages = [] //array to store pages of items
        collection.pagination.links = [] //array to store links to pages

        collection.items.forEach((item, index) => {
          if(index%collection.pagination.limit == 0) {
            let url = collection.pagination.url + (collection.pagination.pages.length + 1)
            if(collection.pagination.homepage && collection.pagination.pages.length == 0) {
              url = ''
            }
            collection.pagination.pages.push({
              items: [],
              url: url,
              currentPage: collection.pagination.pages.length + 1
            })
            collection.pagination.links.push({
              url: url,
              currentPage: collection.pagination.links.length + 1
            })
          }
          collection.pagination.pages[collection.pagination.pages.length-1].items.push(item)
        })

        //push total total
        collection.pagination.totalPages = collection.pagination.pages.length


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
            items: itemsWithTag,
            url: toURL(key)
          })
        }
        //push tag items back into site ob
        collection.tags.items = tagsObject

      }
    }
  }
}

function renderCollections(collections) {

  //render each page
  if(collections.includes('pages')) {
    for (let collection of site['pages']) {
      let output = collection.output
      let template = collection.template
      for(let item of collection.items) {

        //define page object
        let page = item
        page.content = item.content

        fs.ensureFileSync(output)
        fs.writeFileSync(output,nunjucks.render(template,{
          page: page,
          site: site
        }))

      }
    }
  }


//TODO
//incorperate patterns into render string

  //render blogs
  if(collections.includes('blogs')) {
    for (let collection of site['blogs']) {

      let template = collection.template
      for(let item of collection.items) {

        let output = collection.output + '/' + item.url + '/index.html'

        //define page object
        let page = item
        page.content = item.content

        fs.ensureFileSync(output)
        fs.writeFileSync(output,nunjucks.render(template,{
          page: page,
          site: site
        }))

      }

      //render tags pages
      if(collection.tags) {
        let template = collection.tags.template

        for(let item of collection.tags.items) {
          let output = collection.tags.output + '/' + item.url + '/index.html'

          //define page object
          let page = {}
          page.title = item.name
          page.count = item.count
          page.items = item.items

          fs.ensureFileSync(output)
          fs.writeFileSync(output,nunjucks.render(template,{
            page: page,
            site: site
          }))
        }

      }

      //render pagination pages
      if(collection.pagination) {


        for(let paginationPage of collection.pagination.pages) {

          //set output and template
          let template = collection.pagination.template
          let output = collection.pagination.output + '/' + paginationPage.url + '/index.html'

          if(collection.pagination.homepage && paginationPage.currentPage == 1) { //if homepage for this blog
            template = collection.pagination.homepage.template
            output = collection.pagination.homepage.output
          }

          //define page object
          let page = {}
          page.totalPages = collection.pagination.totalPages
          page.currentPage = paginationPage.currentPage
          page.pagination = collection.pagination.links
          page.items = paginationPage.items

          fs.ensureFileSync(output)
          fs.writeFileSync(output,nunjucks.render(template,{
            page: page,
            site: site
          }))

        }

      }

    }

  }

}


module.exports = function(cb) {
  createPatternsString()

  let collections = ['pages','blogs']
  addItemsToCollections(collections)
  sortCollections(collections)
  paginateCollections(collections)
  addTagsToCollections(collections)
  renderCollections(collections)
  //debug
  fs.writeJsonSync('./output.json',site)
  cb()
}
