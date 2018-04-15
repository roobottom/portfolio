const site = require('../../../_site.js')

function prose (w,d) {//window,document
  let headings = d.querySelectorAll('.prose h2,.prose h3,.prose h4,.prose h5,.prose h6')
  for(let heading of headings) {

    let updatedContent = `<a href="#${heading.id}" class="prose__headinglink" rel="nofollow" aria-hidden="true"><svg class="icon icon--link" aria-hidden="true"><use xlink:href="${site.baseurl}/images/site-graphics.svg#link"></use></svg></a>${heading.innerHTML}`

    //heading.insertBefore(link,heading)

    heading.innerHTML = updatedContent
  }
};

module.exports = prose
