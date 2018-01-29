# Pouch: A flat file publishing system built in node

Pouch supports three main types of content:

* Pages
* Blogs
* Patterns

## `_settings.js`

```
pages: [
  {
    name: a unique page identifier,
    input: the source of the page markdown with frontmatter file,
    output: the publish destination for this page,
    template: the nunjucks template used to convert the page into HTML
  }
]

```
