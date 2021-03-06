'use strict'

const site = require('../_site.js')

//filesystem
const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')

//utils
const _ = require('lodash')
const async = require('async')

//frontmatter
const frontmatter = require('front-matter')

//nunjucks
var nunjucks = require('nunjucks')
var nunjucksSlugify = require('./nunjucks.slugify.js')
var nunjucksPath = require('./nunjucks.path.js')
var nunjucksAppendtime = require('./nunjucks.appendtime.js')
nunjucks.configure(site.nunjucksPath, {
  noCache: true,
  autoescape: false
})
.addGlobal('baseurl',site.baseurl)
.addFilter('slugify',nunjucksSlugify)
.addFilter('path',nunjucksPath)
.addFilter('appendtime',nunjucksAppendtime)

//images (Light Weight Image Proccessing)
const lwip = require('lwip')


//markdown
var Remarkable = require('remarkable')
const remarkableFigure = require('./remarkable.figure.js')
const remarkableHeadings = require('./remarkable.headings.js')
const remarkableLinks = require('./remarkable.links.js')
const md = new Remarkable('full',{
  html: true,
  xhtmlOut: true,
  typographer: true,
  enable: ['abbr','footnote','deflist','footnote_inline','ins','mark','sub','sup']
})

md.use(remarkableFigure)
md.use(remarkableHeadings)
md.use(remarkableLinks)

//time
const moment = require('moment')

//local util functions
function toURL(str) {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%20/g, '-');
}
function removeWhitespace(str) {
  return str.replace(/(\r\n|\n|\r|\t)/gm,"")
}
function getSeason(datetime) {
  let month = moment(datetime).format('M')

  //12,1,2 = winter | 3,4,5 = spring | 6,7,8 = summer | 9,10,11 = autumn
  if(['12','1','2'].indexOf(month) != -1) { return "Winter" }
  if(['3','4','5'].indexOf(month) != -1) { return "Spring" }
  if(['6','7','8'].indexOf(month) != -1) { return "Summer" }
  if(['9','10','11'].indexOf(month) != -1) { return "Autumn" }

  return datetime
}

function createPatternsString() {
  let files = glob.sync(site.patterns.input)
  site.patterns.string = ''
  for(let file of files) {
    let data = fs.readFileSync(file,'utf8')
    site.patterns.string += data
  }
}
function createComponentsString() {
  let files = glob.sync(site.components.input)
  site.components.string = ''
  for(let file of files) {
    let data = fs.readFileSync(file,'utf8')
    site.components.string += data
  }
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

        //proccess data attributes
        if(fm.attributes.data) {
          for(let data of fm.attributes.data) {
            try {
              //open the file for this testData
              let file = fs.readFileSync(data.file,'utf8')
              if(data.markdown) {
                file = md.render(file)
              }
              fm.attributes[data.key] = file
            }
            catch(err) {
              console.log('missing file or key attributes from testData', err)
            }
          }
        }

        //render nunjcuks tags
        let renderString = removeWhitespace(site.patterns.string) + removeWhitespace(site.components.string) + fm.body
        let renderedContent = nunjucks.renderString(renderString,fm.attributes)

        //render md -> html
        renderedContent = md.render(renderedContent)

        //get first paragraph for intro
        let intro = renderedContent.substring(renderedContent.indexOf('<p>'), renderedContent.indexOf('</p>')).replace(/(<([^>]+)>)/ig,"")

        //get filename
        let filePath = path.parse(file)
        let folders = filePath.dir.split('/')

        //remove the first two items in folders array (`.`,`source`)
        folders.shift()
        folders.shift()

        //return data to the page
        let returnObj = {}
        returnObj = fm.attributes
        returnObj.content = renderedContent
        returnObj.intro = intro

        //return paths and url data to the page
        if(folders.length > 0) { //this is in a sub folder
          returnObj.section = folders[0]
          returnObj.paths = folders
          returnObj.url = '/' + folders.join('/') + '/' + filePath.name
          if(collection.permalinkBy == 'folder') returnObj.url = '/' + folders.join('/')
        }
        else { //top level page
          returnObj.section = filePath.name
          returnObj.url = '/' + filePath.name
          returnObj.paths = []
        }
        returnObj.name = filePath.name

        //override section by folder if set in _site.js
        if (fm.attributes.section) returnObj.section = fm.attributes.section

        //add human readable dates
        returnObj.humanDate = {}
        returnObj.humanDate.dayName = moment(fm.attributes.date).format('dddd');
        returnObj.humanDate.day = moment(fm.attributes.date).format('Do');
        returnObj.humanDate.month = moment(fm.attributes.date).format('MMMM');
        returnObj.humanDate.year = moment(fm.attributes.date).format('YYYY');
        returnObj.humanDate.date = moment(fm.attributes.date).format('dddd, MMMM Do YYYY')
        returnObj.humanDate.season = getSeason(fm.attributes.date)
        returnObj.isoDate = moment(fm.attributes.date).toISOString()

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
            if(collection.sortOrder == 'asc') {
              stringA = b[collection.sortBy].toUpperCase();
              stringB = a[collection.sortBy].toUpperCase();
            }
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
            if(collection.sortOrder == 'asc') return a[collection.sortBy] - b[collection.sortBy]
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
        if(collection.sortOrder == 'asc') {
          next = parseInt(key)+1;
          prev = parseInt(key)-1;
        }


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
        for(let i in tags) {
          tags[i] = tags[i].toLowerCase()
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
            url: toURL(key),
            section: collection.name
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



  //render blogs
  if(collections.includes('blogs')) {
    for (let collection of site['blogs']) {

      let template = collection.template
      for(let item of collection.items) {

        let output = './docs/' + item.url + '/index.html'

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
          page.section = collection.name

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


function processImages(cb) {

  glob(site.images.input,function(err, files) {
    if (err) throw err
    async.each(files, function(file,cb) {
      let image = path.join(__dirname, '..',file)
      let folders = path.parse(file).dir.split('/')
      let unwantedFolders = ['.','source']
      folders = folders.filter(val => !unwantedFolders.includes(val));


      //process jpgs (photos)
      if(path.parse(file).ext == '.jpg') {

        let filename = '1600x' + path.parse(file).base
        let filepath = path.join(__dirname,'..','/docs',folders.join('/'),filename)


        fs.stat(filepath,function(err,stats) {
          if(!stats) { //file is new, do this shit:

            lwip.open(image, function(err, image){
              if(image.width() > image.height()) { //landscape
                let height = (image.height() / image.width())  * 1600
                image.resize(1600,height,function() {
                  console.log('processed landscape photo',filename)
                  image.writeFile(filepath,{quality: 65},function(err) {
                    if(err) throw err
                  })
                })
              }
              else {
                let width = (image/width() / image.height()) * 1600
                image.resize(width,1600,function() {
                  console.log('processed portrait photo',filename)
                  image.writeFile(filepath,{quality: 65},function(err) {
                    if(err) throw err
                  })
                })
              }
            })

          }//end if stats
        })








      }

      //simply copy any other type of image to the images.output folder
      else {
        let targetImage = path.join(__dirname,'..',site.images.output,folders[folders.length-2],folders[folders.length-1],path.parse(file).base)
        fs.copySync(image, targetImage)
        console.log('copied non jpg image file',path.parse(file).base)
      }



      cb()
    }, function(err) {
      console.log('done')
      cb()
    })
  });


}

module.exports = function(cb,argv) {
  if(argv) {
    if(argv.baseurl||argv.b) site.baseurl = argv.b||argv.baseurl
  }

  console.log('building pouch, base:',site.baseurl)

  createPatternsString()
  createComponentsString()

  let collections = ['pages','blogs']
  addItemsToCollections(collections)
  sortCollections(collections)
  paginateCollections(collections)
  addTagsToCollections(collections)
  renderCollections(collections)
  //debug
  //fs.writeJsonSync('./output.json',site)

  //images
  processImages(function() {
    cb()
  })
}
