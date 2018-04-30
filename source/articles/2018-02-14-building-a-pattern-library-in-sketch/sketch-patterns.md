---
title: Building a pattern library in Sketch in 2018
date: 2018-02-14
tags:
  - pattern libraries
  - design
  - sketch
  - abstract
  - zeplin
  - firefly
zeplin:
  class: max
  set:
    -
      src: 'zeplin-styleguide.png'
      frame: 'browser'
      caption: The Zeplin style guide interface, showing the colours for our Melody theme.
      width: 2184
      height: 1548
    -
      src: 'zeplin-buttons.png'
      frame: 'browser'
      width: 2184
      height: 1548
      caption: Melody style buttons in Zeplin, note the background-colour variable in the CSS for the selected item
---
Since last time [I wrote](/articles/2017-05-02-creating-a-pattern-library-in-sketch) about our UI design library, we've made significant improvements. Sure, it's not always been smooth sailing. And, yes, I've annoyed my team along the way demanding yet another "slight tweak" to the structure. But the UI pattern library we have today is a thing of wonder; used daily and, dare I say, loved by the team. 

The library itself — a single Sketch file — is massive. At last count we've over 250 symbols covering the entire UI of Firefly in our four [core themes](http://themes.fireflylearning.com/). With overrides, this gives us an army of symbols with an incalculable state permutations. The credit has to go to the phenomenally talented [Aegir](http://aegir.org/) and [Rachel](http://www.rachelandersonartist.com/). They did _all_ the work.

## Changes

Working embedded in cross-functional squads means there's a natural rhythm of the dual-track discover/deliver process we use to design and build our products. This affords our designers some "down-time" [^1] to spend maintaining our pattern library. Over the past year we've made the following changes:

### One library to rule them all

Originally, our libraries were structured into [four separate](/articles/2017-05-02-creating-a-pattern-library-in-sketch/#structure) Sketch files, one each for our [four themes](http://themes.fireflylearning.com/). This became problematic as we were adding symbols which required shared elements, like icons. It meant that we had to maintain four copies of some things, which quickly went out of sync, undoing the whole reason to have a single source-of-truth library. 

{{ figure({src:'amalgamated.png',caption:'Each pattern now has Melody, Folio, Nautilus and Storybook versions',class:'side-by-side'}) }}

Aegir did most of the heavy lifting in manually copying-and-pasting symbols from one file to another and relinking all the overrides. Many hours of his work went into correcting the mistake I made when planning the original library structure. 

### Going native

In a [much anticipated](/articles/2017-05-02-creating-a-pattern-library-in-sketch/#a-native-solution) move, Sketch released support for [native libraries](https://www.sketchapp.com/docs/libraries/). This, coupled with support in Abstract, was the missing piece of our workflow puzzle.

With Sketch Libraries and Abstract working in concert, we finally have a workflow where we can access a central repository of symbols in *any* sketch file. Joy of joys! What's more, this also allows us to update the library and push out updates to all those projects; it's everything we wanted.

Now everything is in a single library, we can build just about anything from our kit of parts, neatly organised into core (shared) symbols, symbols for each theme and a collection of OS elements that help us communicate things like scroll bars and standard HTML checkboxes.  

### Style guide

Perhaps the most useful thing we've built over the last year has been the style guide. This single Sketch file contains two things:

* Definitions of the colours used across all four themes
* Every state of each pattern

Our goal is to precisely define a pattern's appearance and interactions in a way engineers can use to construct an exact replica in code. A Design Pattern Library  and a Front End Pattern Library , but they should be exact copies of one another. 

We use [Zeplin](https://zeplin.io) to share the style guide with the development teams. This allows engineers to inspect each item and understand its precise make-up.

Because Zeplin allows you to define variables for colours, the technology and designs are able to have a shared set of colour definitions.

{{ figure(zeplin) }}

Defining colours in this way also means we can share colours across themes. For example, a primary button always has the background colour `$primary`, we just redefine its value in each theme. This makes it very easy for designers and developers to reason about.


## Where next?

Although extremely pleased with ourselves, we're not resting on our laurels. We still have work to do in filling out missing areas in the style guide. 

We're also working on defining a standard set of type styles that can defined and used much like the standard colours.

More recently, Rachel has been doing some sterling work on defining our motion guidelines. These are pluggable units of movement that can be composed together to create an overall effect.

[^1]: Note the use of speech-marks; "down-time" meaning "time not spent on discovering or delivering features", rather than free time
