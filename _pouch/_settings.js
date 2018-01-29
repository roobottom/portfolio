module.exports = {
  nunjucksPath: "./templates",
  /*
    Content pages
    template: relative to nunjucksPath
  */
  pages: [
    {
      name: "home",
      input: "./source/home.md",
      output: "./docs/index.html",
      template: "pages/home.html"
    },
    {
      name: "about",
      input: "./source/about.md",
      output: "./docs/about/index.html",
      template: "pages/about.html"
    },
    {
      name: "work",
      input: "./source/work.md",
      output: "./docs/work/index.html",
      template: "pages/about.html"
    },
    {
      name: "articles",
      input: "./source/articles.md",
      output: "./docs/articles/index.html",
      template: "pages/articles.html"
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
      template: "blogs/article.html",
      sortBy: "date",
      tags: {
        output: "./docs/articles/tags",
        template: "pages/articles.html"
      },
      pagination: {
        limit: 5,
        output: "./docs/articles/page-",
        template: "./source/articles.md"
      }
    },
    {
      name: "work",
      input: "./source/work/*.md",
      output: "./docs/work",
      template: "blogs/work.html"
    }
  ]
  /*
    patterns are used to build patterns pages
  */
};
