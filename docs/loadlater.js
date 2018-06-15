/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

(function(w, d, undefined){

  const prose = __webpack_require__(1)

  prose(w,d)

}(window,document));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const site = __webpack_require__(2)

function prose (w,d) {//window,document
  let headings = d.querySelectorAll('.prose h2,.prose h3,.prose h4,.prose h5,.prose h6')
  for(let heading of headings) {

    let updatedContent = `<a href="#${heading.id}" class="prose__headinglink" rel="nofollow" aria-hidden="true"><svg class="icon icon--link" aria-hidden="true"><use xlink:href="${site.baseurl}/images/site-graphics.svg#link"></use></svg></a>${heading.innerHTML}`

    heading.innerHTML = updatedContent
  }
};

module.exports = prose


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {
  //baseurl: '/portfolio',
  baseurl: '',
  nunjucksPath: "./templates/",
  patterns: {
    input: "./templates/_patterns/**/*.html"
  },
  components: {
    input: "./templates/_components/**/*.html"
  },
  /*
    Pouch will auto process your images if you include the images
  */
  images: {
    input: './source/**/*.+(jpg|jpeg|png)',
    output: './docs',//feed images back into the folder from whence they came
    sizes: [800,1100,1600]
  },
  navigation: [
    {
      name: "Home",
      url: "/",
      section: "homepage"
    },
    {
      name: "Articles",
      url: "/articles",
      section: "articles"
    },
    {
      name: "About me",
      url: "/about",
      section: "about"
    },
    {
      name: "Style Guide",
      url: "/styleguide",
      section: "styleguide",
      navigation: [
        {
          name: "Principles",
          url: "/styleguide/principles",
          section: "styleguide"
        },
        {
          name: "Design",
          url: "/styleguide/design",
          section: "styleguide",
          bloglist: "styleguide-design"
        },
        {
          name: "Components",
          url: "/styleguide/components",
          section: "styleguide"
        }
      ]
    }
  ],
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
      input: "./source/about/about.md",
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
      name: "articles-tag-listing",
      input: "./source/articles-tag-listing.md",
      output: "./docs/articles/tags/index.html",
      template: "pages/articles-tag-listing.html"
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
      template: "pages/styleguide.html",
      section: "styleguide"
    },
    {
      name: "styleguide-principles",
      input: "./source/styleguide/principles.md",
      output: "./docs/styleguide/principles/index.html",
      template: "pages/styleguide.html",
      section: "styleguide"
    },
    {
      name: "styleguide-design",
      input: "./source/styleguide/design.md",
      output: "./docs/styleguide/design/index.html",
      template: "pages/styleguide-design.html",
      section: "styleguide"
    },
    {
      name: "styleguide-components",
      input: "./source/styleguide/components.md",
      output: "./docs/styleguide/components/index.html",
      template: "pages/styleguide-components.html",
      section: "styleguide"
    }
  ],
  /*
    blogs contain multiple posts
  */
  blogs: [
    {
      name: "articles",
      input: "./source/articles/**/*.md",
      output: "./docs/articles",
      template: "blogs/article.html",
      sortBy: "date",
      permalinkBy: "folder", //defaults to filename [filename,folder]
      section: "articles",
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
      name: "styleguide-design",
      input: "./source/styleguide/design/*.md",
      output: "./docs/styleguide/design",
      template: "blogs/styleguide-item.html",
      sortBy: "order",
      sortOrder: "asc" //desc (default) or asc
    },
    {
      name: "components",
      input: "./source/styleguide/components/*.md",
      output: "./docs/styleguide/components",
      template: "blogs/component.html"
    }
  ]

};


/***/ })
/******/ ]);