module.exports = {
  nunjucksPath: "./templates/",
  patterns: {
    input: "./templates/patterns/**/*.html"
  },
  /*
    Content pages
    template: relative to nunjucksPath
  */
  pages: [
    {
      name: "homepage",
      input: "./source/homepage.md",
      output: "./docs/index.html",
      template: "pages/homepage.html"
    },
    {
      name: "about",
      input: "./source/about.md",
      output: "./docs/about/index.html",
      template: "pages/about.html"
    },
    {
      name: "articles",
      input: "./source/articles.md",
      output: "./docs/articles/index.html",
      template: "pages/articles.html"
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
    },
    {
      name: "styleguide-principals",
      input: "./source/styleguide/principals.md",
      output: "./docs/styleguide/principals/index.html",
      template: "pages/styleguide-principals.html"
    },
    {
      name: "styleguide-components",
      input: "./source/styleguide/components.md",
      output: "./docs/styleguide/components/index.html",
      template: "pages/styleguide-components.html"
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
        template: "blogs/articles-tag.html"
      },
      pagination: {
        limit: 5,
        url: "page-",
        output: "./docs/articles",
        template: "blogs/articles-pagination.html"
        // homepage: {
        //   output: "./docs/articles/index.html",
        //   template: "blogs/articles-page.html"
        // }
      }
    },
    {
      name: "work",
      input: "./source/work/*.md",
      output: "./docs/work",
      template: "blogs/work-item.html",
      sortBy: "date"
    },
    {
      name: "components",
      input: "./source/styleguide/components/*.md",
      output: "./docs/styleguide/components",
      template: "blogs/component.html"
    }
  ]

};
