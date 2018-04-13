---
title: Sketch pattern library
date: 2017-12-01
org: firefly
seoTitle: How UI design patterns helped us speed up visual design
project:
  team: 
    -
      name: Aegir Hallumander
      url: http://aegir.org
    -
      name: Rachel Anderson
      url: http://twitter.com
---
In 2016, our visual design process at Firefly Learning was a bit of a mess.  I lead a long-term initiative to overhaul our process and tooling which lead to significant gains in our velocity and quality of output.

Splitting an interface into reusable parts is a common way of developing websites and apps. The technology is readily available to developers to support this workflow. Componentisation is encouraged in front-end libraries like React and Angular and is now enjoying wider standardised adoption through the [Web Components](https://www.w3.org/standards/techs/components#w3c_all) specification. Developers also enjoy collaborative working using version control tools like Git.

Until recently, the software to support this workflow for designers has been lacking. However, the introduction of Sketch symbols and libraries coupled with tools like Abstract has revolutionised the way we design interfaces.

At Firefly Learning, I lead a project to fully utilise these new tools to introduce vastly improved standardisation and speed into our design process.

## The problem

Two years ago we were using Adobe Illustrator as our primary design tool; this presented some problems:

*  Interface elements had to be copied and pasted between designs to ensure consistency.
*  If we updated styling for one component, we'd have to update it everywhere manually. (As a result, we tended *not* to make changes).
*  More than one designer working on the same file lead to those designers going temporality insane.

We needed a shared library of elements that could be defined once and shared everywhere; be updated centrally, with updates pushed out.

We also desperately needed a way for more than one designer working on the same file at the same time.

## The solution, phase one

For a bit more context, you can read about our [first pattern library](/articles/creating-a-pattern-library-in-sketch/).

In phase one we: introduced Sketch as our defacto design tool, built the first version of our pattern library and implemented version control.

### Introducing Sketch

I was fearful when telling my team we were making the transition from Illustrator to Sketch. For all its faults, Illustrator is a tool they knew well, and we already had lots of interface elements we could copy-and-paste to save time in new projects. I knew if the transition was going to succeed, I had to prove Sketch would be a superior experience. 

I did two things to smooth the change: First, I created a demo project that I could use to showboat Sketch symbols; this was a big win, and the team could see immediate benefits. 

Second, we introduced Sketch slowly; using it over a couple of smaller projects first before making it our primary design tool. I'm happy to say that this strategy worked too, and the team were soon merrily designing in Sketch full time.

### Creating a Sketch pattern library

I'd like to say that, once we'd made the transition to Sketch, creating our pattern library was a leisurely affair. It wasn't; honestly, it was a bit of a slog. There were a few false starts where we couldn't agree on the best way to structure the symbols. Even when we did arrive at an agreed structure (using a `patterns` and `parts` convention), we discovered that using the symbols was somewhat painful.

At this time in early 2015, the design community wasn't saying much about *how* to use Sketch symbols to build an extensive pattern library. Sure, we felt like pioneers, but that wasn't helping team morale. What we needed was a map.

We created an overview of all the existing front-end patterns and their states and modifiers. As a team, we categorised and rationalised them; this gave us the clear direction we needed.

[Interactive map graphic?]

### Working together

We were early adopters of [Abstract](https://www.goabstract.com/). Introducing this tool was the coup de grâcs for our old Illustrator files. Overnight we were able to work on the same file at the same time with Abstract's git-like workflow. The fact it only works with Sketch sounding the death-knell.

### Sharing patterns

Although Abstract gave us the ability to version our files, it didn't allow us to share a central library of components. Although some tools claimed to have the solution, none of them worked for us. In the end, we opted for the "manually check this is the latest version" approach. It wasn't pretty, but it worked, and [I felt reasonably sure](/articles/creating-a-pattern-library-in-sketch#a-native-solution) that Sketch would release a native solution to this problem.

---

## The solution, phase two

> You know all those patterns you've built? I'd like you to throw them away and start again — Me, in early 2018

What a dickhead! Between us, we'd built the majority of the patterns required for our library, but here I was asking my team to tear them up and create them all over again. Why? Because they were hard to use, and I knew they'd fall into disrepair. I really wanted our pattern library to be a useful resource, not some straw-man solution that wouldn't solve any of our problems.

So, Aegir