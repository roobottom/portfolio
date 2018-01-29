module.exports = {
  nunjucksPath: "./templates",
  /*
    Content pages
  */
  pages: [
    {
      name: "home",
      input: "./source/home.md",
      output: "./docs/index.html",
      template: "pages/home.html"
    }
  ],
  /*
    blogs contain multiple posts
  */
  blogs: [
    {
      name: "articles",
      input: "./source/articles/*.md",
      output: "./docs/articles",
      template: "blogs/article.html"
    },
    {
      name: "work",
      input: "./source/work/*.md",
      output: "./docs/work",
      template: "blogs/work.html"
    }
  ]
};
