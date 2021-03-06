---
title: Creating a pattern library in Sketch
date: 2017-05-02
tags:
    - pattern libraries
    - sketch
    - abstract
    - firefly
---

I don’t think its hyperbole to say that there’s a revolution happening in the design of digital products. Designers have long had the idea of designing interfaces from a kit of pre-built parts, but never really had the tools to do this effectively. Sketch is such a tool.

At Firefly, we made the transition to Sketch specifically because of the power of symbols. These have enabled us to build our pattern library in a way that helps us to do some extremely rapid prototyping and create consistent experiences for our users.

Our Front-End and iOS teams already have their own pattern libraries. These are different, partly due to technical reasons, but there’s another reason we kept the patterns separate. As we continue to strive for feature parity between platforms, its obvious that there are some fundamental differences between web and iOS.  There is a _way_ of doing things in iOS — interactions that users expect — that’s different from the web. Hence, web and iOS have the same features, but implemented in the way that makes the most sense to users of that platform.

Our dream was to create two design pattern libraries that would contain the same elements as the web and iOS libraries. This would mean that we’d all be working from the same list of patterns, rather than adding a translation step when it came to implementation. 

## Structure

We studied the structure of the existing pattern libraries and created a map that included all patterns, their modifiers and states. This gave us the structure for our patterns, and a place to start from when translating programatic patterns into something that would be useable in Sketch. 

In simple terms, our pattern library is a number of Sketch files containing — as symbols — all the elements in the Firefly interface. We divide these into separate files, one for each platform. We’ve also broken web into web-core and one file for each of our [four core themes](http://themes.fireflylearning.com).

In each of the files, we’ve categorised our symbols into areas. This helps massively with your mental model when browsing the symbols page. This also allows us to print a visual style-guide of all our patterns.

{{ figure({src:'categorising-symbols.png', caption: 'An example of how were using layout and labels to categorise symbols in Sketch', class: 'side-by-side'}) }}

## Symbols

Sketch supports symbol nesting and overrides. This makes symbols extremely powerful. This allows you to create a pattern element by combining symbols together. 

However, organisation is everything. If you don’t follow a systematic approach to creating patterns, they’re extremely difficult to use in the wild. We know from experience that confusion arises about which symbols are patterns, and which are simply the building blocks of patterns. Let me explain...

### Parts and Patterns

{{ figure({src: 'button-anatomy.png',class: 'right'}) }}

A pattern is made up of either parts or other symbols. Each part is a symbol. A Button, for example, is made up of two parts *Background* and *Label*, and another pattern *Icon*. We use [slash notation](https://www.sketchapp.com/learn/documentation/symbols/organizing-symbols/) to organise parts and patterns under one namespace.

{{ figure({src: 'symbols-dropdown.png', caption: 'Using slash notation in symbols names to create easily navigable folders within Sketch', class: 'side-by-side'}) }}

Organising our symbols this way makes it easy when using a pattern. It’s immediately obvious from the list of symbols which is a pattern that’s intended for use, and which are just the building blocks of patterns.

### Using Patterns in the wild

When designing a new feature, we’ll start out with a blank sketch file. Let’s say, for example, that we wanted a very simple interface that required two buttons: OK and Cancel. OK needs to be a cancel type with a tick icon, and Cancel needs to be a default type with a cross icon.

In our pattern library file, we have a page called _scratch_ where we can set up a pattern ready to be copied into another file. We select the `Button > Patterns > Button with Icon Left` symbol from the list and drop it into our scratch page. We can then use the symbol overrides to change it’s Background, Icon and Label as required. We can also override the text.

{{ figure({src: 'using-a-symbol.png', caption: 'Using symbol overrides to change the appearance of the button pattern.'}) }}

Once the pattern is set up, we can then copy this into the new document. This only copies the parts required for this instance of the pattern. So trying to change the symbol overrides in the new file won’t work until you copy over all variations of a pattern. 

## Tips ’n tricks

There’s a few areas where symbols are ripe for improvement. Given Bohemian’s track record for updates and bug fixes I suspect these can’t be too far off. Meantime, there’s a couple of workarounds that we’ve found particularly useful that I’d like to share.

### Pin to corner

The ability to change resize behaviour in symbols is extremely useful. However, the “Pin to corner” option is somewhat limited as it doesn’t let you specify _which_ corner.

{{ figure({src: 'pin-to-corner.png',caption: 'An example of using a transparent shape to pin a symbol to a specific corner, in this case the bottom-left'}) }}

We solve this by simply grouping a transparent shape in with the layer we wish to align. This allows you pin to other corners than the one that Sketch might have automatically picked for you.

### Override colours of icons

It’s annoying to have to have separate symbols for different icon colours. Especially when adding a new colour, meaning you have to create a new symbol for all the icons in the new colour. 

Luckily, we can use layer masks and overrides to easily add colour options. An Icon pattern is actually a grouped rectangle masked out by the icon shape. We are then able to control the icon type *and* colour from a pre-defined pallet of colours. Adding a new colour is as easy as adding a new icon mask symbol.

{{ figure({src: 'override-colour.png', caption: 'Using a combination of symbol overrides and masks lets you pick an icon and change its colour' }) }}

Another small tip: Make your icons and masks different sizes, that way you won’t get shown all the icons and colours together in the overrides dropdown.

---

## Sharing patterns

So far I’ve not really touched on how we’re using our pattern library across a team. An essential part of any pattern library is its use beyond a single person. When we set out to create our pattern library, we had a simple set of requirements:

1. Symbols should be stored in a central location that is accessible by the whole team
2. Symbols can be linked across files, updating a symbol in any file updates it everywhere
3. Editing clashes are handled in a nice way
4. Symbols can be organised into categories

### What we’re currently doing

Initially we experimented with [Craft](https://www.invisionapp.com/craft) from inVision. It’s library functionality would allow us to store symbols in a central location, share them across the team. Most excitingly of all, symbols would be linked across files, meaning we could ensure we were always using the latest version in our designs. 

Unfortunately, when it came to handling editing clashes, Craft did less well. We lost an entire week of work due to our library file becoming corrupted. We were told that this was a known issue, and the file was unrecoverable. We decided not to entrust our entire pattern library to Craft, there was no way we could risk that happening again.

We switched to using Sketch files themselves to contain our patterns. A downside to this solution was that editing clashes weren’t handled, at all. Rather, whoever saved the file last would overwrite work of anyone else. Thankfully, [Abstract](https://abstractapp.com/) came to our rescue. 

The team has been using Abstract for version management of Sketch files for the last few weeks, and what a difference it’s made! Once you have the git mental model in your head, Abstract’s workflow makes a lot of sense. We can now branch off the master pattern library document, make our changes, and merge back. Clashes are handled visually, giving you the choice of which symbol definition to keep. 

{{ figure({src: 'abstract.png', caption: 'Our Pattern Library (or kits as we sometimes call them) as projects in Abstract', class: 'side-by-side'}) }}

We now have three out of four of our original requirements. We’re almost there! But what about linking symbols across files? 

## A native solution?

I’d argue that level of complexity represented by shared symbols in Sketch requires a native solution. Plugins, like Craft, will only ever be a poly-fill at best.

Looking at the features that Bohemian have added to Sketch over the last few versions, I strongly suspect that they’re already planning shared symbols. It’s a natural fit for them, they already have the cloud infrastructure from Sketch Cloud and with their new open JSON formatted files, it seems like this might be the next logical step. 

---

_Are you looking for a new design challenge in London? We’ll be hiring for some exciting positions within the design team throughout 2017 and 2018. We’d love to hear from you! Check out our [list of currently open positions](https://fireflylearning.com/careers)._




