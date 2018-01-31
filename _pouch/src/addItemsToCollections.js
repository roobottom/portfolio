'use strict'

module.exports = function(site,collections) {
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
