---
name: Function gallery
num: 1369
shelf: learn
code: L229
section: school-maths
title: "Function gallery: modulus, signum, greatest integer, reciprocal and more, with domain and range shaded, plus f + g, f − g, fg and f/g"
seoTitle: "Function gallery: domain and range of real functions"
summary: "See the standard real functions of Class 11 maths (identity, constant, polynomial, reciprocal, modulus, signum, greatest integer, square root, exponential, log) with the domain shaded on the x-axis and the range on the y-axis. Then build f + g, f − g, f × g and f ÷ g and find the domain of the result."
status: live
ads: false
order: 1369
icon: curve
works: offline
updated: 2026-11-09
related: [relation-checker, function-grapher, limit-zoom, inequality-shader]
sources:
  - "The standard real functions, their domains and ranges, and the algebra of real functions are standard school mathematics. Wording, pictures and examples are fibub's own; no textbook text, figures or exercises are used."
  - "Checked against Python's math.floor and numpy.sign for the greatest integer and signum functions, and numpy.roots for the points left out of the domain of f/g."
flow:
  - { icon: pointer, label: "Pick f" }
  - { icon: curve, label: "Graph" }
  - { icon: ruler, label: "Domain" }
  - { icon: sliders, label: "Combine" }
---

## What it does

A **real function** takes a real number x and gives back exactly one real number f(x). Two sets go with every function: its **domain**, the inputs it accepts, and its **range**, the outputs it actually gives. This page draws the functions you meet in Class 11 maths (relations and functions) and paints those two sets right on the graph:

- the **domain** as a green band along the x-axis, with a hollow dot where a point is left out;
- the **range** as an orange band along the y-axis.

The gallery has the identity, a constant, the square and cube (polynomials), the reciprocal 1/x, the modulus |x|, the signum function, the greatest integer function [x], the square root, an exponential 2ˣ and the logarithm log₂ x. Slide x to read off f(x) at any point.

The **Combine f and g** mode builds f + g, f − g, f × g and f ÷ g from two simple functions and works out the domain of the result: where both f and g are defined, and, for f ÷ g, also where g(x) is not zero.

Before this, the [[relation-checker]] shows when a relation is a function at all; afterwards, [[limit-zoom]] zooms in on the jumps of [x] and signum, and the [[function-grapher]] plots anything you can type.

## How to use it

1. **Gallery.** Tap a function name. The graph, its rule, domain and range appear. Move the **Slide x** slider to see the point (x, f(x)) and its value in the box below the graph. Where the function is not defined (1/x at 0, √x for negatives), it says so.
2. **Combine f and g.** Pick a type for f and for g (a x + b, a x² + b, a √x + b, a/x + b or a|x| + b) and type a and b. Then press f + g, f − g, f × g or f ÷ g. f is drawn dashed grey, g dotted orange, and the result in blue. For f ÷ g, red dashed lines mark where g(x) = 0, the x values the result cannot use.
3. **Check yourself** gives fresh questions on [x], signum, domains and (f + g)(a), with the working.

## Reading the pictures

- **Steps and jumps.** For [x] each step starts with a filled dot (that value is included) and ends with an open dot (that value belongs to the next step). Signum has open dots at (0, −1) and (0, 1) and a filled dot at the origin, because signum(0) = 0.
- **Single values in the range.** The constant function has range {3}, a single dot on the y-axis; signum has three dots; [x] has a dot at every integer.
- **Open ends.** 1/x never takes the value 0, so its range band has a hole at 0; 2ˣ is always positive, so its band starts just above 0.

## Worked example

Open **Combine f and g** with the starting values f(x) = x² and g(x) = x − 1, and press **f ÷ g**. The title reads (f ÷ g)(x) = (x²) / (x − 1). A red dashed line stands at x = 1, and the domain box says **R − {1}**: both functions are defined for every real x, but g(1) = 0. With the slider at x = 1.5, f(1.5) = 2.25 and g(1.5) = 0.5, so (f ÷ g)(1.5) = 2.25 ÷ 0.5 = 4.5, and the page shows exactly that line. Change g's type to a √x + b with a = 1, b = 0: now the domain is (0, ∞), because √x needs x ≥ 0 and x = 0 makes g zero.

## Tips

- [x] is the greatest integer **not more than** x, so for negative numbers it moves away from zero: [−2.3] = −3.
- A function is **many-one** when two inputs share an output (x² at 2 and −2), and **one-one** when no two do (x³). The gallery is a quick way to see this: a horizontal line hits a one-one graph at most once.
- Domain first, then range: the range of f ÷ g can be awkward to find, but the domain only needs "both defined" and "g not zero".

## FAQ

**Why is signum(0) = 0 and not undefined?** The rule |x|/x would divide by zero, so the definition simply sets signum(0) = 0 by hand. That is why the graph has a filled dot at the origin.

**Is this a function or a relation?** Every graph here passes the vertical line test: each x gives at most one y, so they are all functions.

**Does it save anything?** No. It runs in your browser and nothing is stored or sent. fibub is not part of NCERT; the topics follow the Class 11 syllabus, but the words and pictures are our own.
