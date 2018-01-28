module.exports = {
  nunjucksPath: "./templates",
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
