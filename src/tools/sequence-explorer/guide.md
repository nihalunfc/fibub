---
name: Sequence explorer
num: 1280
shelf: learn
code: L148
section: school-maths
title: "Sequence explorer"
summary: "Watch dot and matchstick patterns grow step by step, read their differences in a table, and get the rule for step n with the reason it works. Type any list of numbers to find its linear, quadratic or doubling rule and the next term."
status: live
ads: false
order: 1280
icon: chart
works: offline
updated: 2026-11-09
related: [ap-explorer, number-theory-toolkit, quadratic-explorer, identity-tiles]
sources:
  - "Figurate numbers (triangular n(n + 1)/2, square n², pentagonal n(3n − 1)/2, hexagonal n(2n − 1)), the method of differences and arithmetic and geometric progressions are standard school maths. Written for fibub; the patterns and examples are fibub's own."
  - "Rules checked against sympy.interpolate (4, 7, 10, 13 → 3n + 1; 1, 3, 6, 10, 15 → n²/2 + n/2; 2, 5, 10, 17, 26 → n² + 1), every drawn step against its formula, and 200 random quadratics."
flow:
  - { icon: chart, label: "Pattern" }
  - { icon: table, label: "Differences" }
  - { icon: sigma, label: "nth term" }
  - { icon: check, label: "Practise" }
---

## What it does

"What comes next?" is the start of a lot of maths. This page draws **growing patterns** (matchstick squares in a row, square and triangular numbers, pentagonal and hexagonal numbers, L shapes of odd numbers, cells that double) and helps you see the rule behind them:

- steps 1, 2 and 3 are drawn side by side with step n, and the dots added at each step are marked in a second colour,
- a table lists the terms with their **differences** (and, at the higher level, the **second differences**),
- the rule for **step n** is written out with your n filled in, with a sentence on *why* it works,
- a **rule finder** reads any list you type and says whether it is linear, quadratic or geometric, with the nth term and the next number.

It follows the Class 9 maths chapter on **sequences and progressions** (predicting what comes next). The Level switch adds the Class 10–11 view: second differences, quadratic rules and sums.

For arithmetic progressions with a staircase picture and Gauss's trick, go on to the [[ap-explorer]]; the dot squares and rectangles here are the same shapes as the [[identity-tiles]], and quadratic rules are graphed in the [[quadratic-explorer]].

## How to use it

1. Pick a **Pattern**.
2. Move **n** with the slider, or type any step number up to a million in the box. Steps too big to draw are still counted.
3. Read the table: if the **difference** row is the same number every time the pattern is linear (an arithmetic progression). If the differences change but go up by the same amount, the rule is quadratic. If they double, it is a doubling (geometric) pattern.
4. Under **Find the rule for your own list**, type at least three numbers (four to test for a quadratic rule) separated by commas, or press an example.

## A worked example

**Matchstick squares**: 4, 7, 10, 13 sticks. Each new square shares a side with the one before, so it needs 3 more sticks: 4 + 3(n − 1) = **3n + 1**. Step 5 has 3 × 5 + 1 = 16 sticks, step 100 has 301.

**Triangular numbers**: 1, 3, 6, 10, 15. The differences 2, 3, 4, 5 go up by 1 each time, so the rule is quadratic. Two triangles fit together into an n by (n + 1) rectangle, so step n has n(n + 1)/2 dots: step 5 has 15. The rule finder writes it as (1/2)n² + (1/2)n, which is the same thing.

**Your own list** 2, 5, 10, 17, 26: differences 3, 5, 7, 9 go up by 2, so the rule is **n² + 1** and the next term is 37.

## Tips

- Always look at the differences first; they tell you what kind of rule to look for.
- A constant second difference d means the n² part of the rule is (d/2)n².
- Some lists, like 1, 1, 2, 3, 5, 8, follow a rule that is none of these types (each term is the sum of the two before). The rule finder says so instead of guessing.

## Check yourself

Four fresh questions each time: the next term of a linear list, a far-away term, the next term of a quadratic list and a triangular number. Nothing is saved.

## FAQ

**Can there be more than one rule for the same numbers?** Yes: any short list can be continued in many ways. The rule finder gives the simplest one of each type that fits every number you typed.

**Is this from the NCERT book?** It covers the same topic with fibub's own patterns and examples. fibub is not part of NCERT.
