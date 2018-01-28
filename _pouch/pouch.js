'use strict'

const settings = require('./_settings.js')

const path = require('path')
const glob = require('glob')
const frontmatter = require('front-matter')
const fs = require('fs')

//nunjucks
const nunjucks = require('nunjucks')


const nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader('./templates'),
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




const site = {}

//SHOULD this be a more general function??
function blogs() {
  let blogs = []
  for(let blog of settings.blogs) {

    //get list of file from this blog's input glob
    let files = glob.sync(blog.input);

    //build local list of blog contents
    let blogObjects = []
    for(let file of files) {
      blogObjects.push(readFileContents(file))
    }

    //update the blog object with the local list of blog contents
    blog.items = blogObjects

    //push the blog object into the global blog object
    blogs.push(blog)

  }

  //return the global blogs object
  return blogs
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

  let returnObj = {}
  returnObj.attributes = fm.attributes
  returnObj.content = renderedContent

  return returnObj

}

function renderFileWithTemplate(template,data) {
  return nunjucksEnv.render(template,data);
}

let blogsList = blogs();


  for(let items of blogsList) {

    for(let item of items.items) {

      console.log(renderFileWithTemplate(items.template,{content: item.content}))

    }

  }
