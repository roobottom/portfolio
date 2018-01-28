module.exports = {
  name: 'Jon Roobottom\'s portfolio',
  pages: [
    {
      name: 'home',
      input: './source/home.md',
      output: './docs/index.html',
      template: './docs/'
    }
  ],
  collections: [
    {
      name: 'articles',
      input: './souce/articles'
    },
    {
      name: 'work',
      input: './source/work'
    }
  ]
}
