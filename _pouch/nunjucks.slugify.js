function slugify(input) {
  let wordsOnly = input.replace(/[^\sa-zA-Z0-9_]+/g,"")
  return wordsOnly.replace(/\s/g,"-").toLowerCase()
}
module.exports = slugify;
