module.exports = {
  nunjucksPath: "./templates",
  patterns: {
    input: "./patterns/**/*.html"
  },
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
      template: "pages/work.html"
    },
    {
      name: "styleguide",
      input: "./source/styleguide.md",
      output: "./docs/styleguide/index.html",
      template: "pages/styleguide.html"
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
        template: "blogs/articles-tags.html"
      },
      pagination: {
        limit: 5,
        url: "page-",
        output: "./docs/articles",
        template: "blogs/articles-page.html",
        homepage: {
          output: "./docs/articles/index.html",
          template: "blogs/articles-page.html"
        }
      }
    },
    {
      name: "work",
      input: "./source/work/*.md",
      output: "./docs/work",
      template: "blogs/work.html"
    }
  ]

};
