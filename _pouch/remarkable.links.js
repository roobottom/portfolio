//prepend gloabl url base to all links
'use strict'

const site = require('../_site.js')

const rule = (linkRule) => (tokens, i, opt, env) => {

  let addBase = (url) => {
    return site.baseurl + url
  }
  let url = (tokens[i].href.indexOf('/') == 0 ? addBase(tokens[i].href) : tokens[i].href)
  return '<a href="' + url + '">'
}

const plugin = (md) => {
	md.renderer.rules.link_open = rule(md.renderer.rules.link_open)
}

module.exports = plugin
