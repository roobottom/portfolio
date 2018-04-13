'use strict'

const rule = (headingRule) => (tokens, i, opt, env) => {

  let getHeadingText = (text) => {
    return text = (text.type == 'inline' ? text.content : '')
  }
  let urlise = (text) => {
    let wordsOnly = text.replace(/[^\sa-zA-Z0-9_]+/g,"")
    return wordsOnly.replace(/\s/g,"-").toLowerCase()
  }
  let headingText = (tokens[i+1] ? getHeadingText(tokens[i+1]) : '')
  return '<h' + tokens[i].hLevel + ' id="' + urlise(headingText) + '">'
}

const plugin = (md) => {
	md.renderer.rules.heading_open = rule(md.renderer.rules.heading_open);
}

module.exports = plugin
