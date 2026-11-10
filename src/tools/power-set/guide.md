---
name: Power set builder
num: 1372
shelf: learn
code: L219
section: school-maths
title: "Power set builder: list every subset of a set, see why there are 2ⁿ, and count them by size"
seoTitle: "Power set calculator: all subsets and 2ⁿ"
summary: "Type a set of up to 6 elements and see every subset, from ∅ to the whole set, sorted by size with C(n, k) in each group. Switch elements in and out to build one subset and follow its path down a yes/no tree that shows why a set with n elements has 2ⁿ subsets."
status: live
ads: false
order: 1372
icon: table
works: offline
updated: 2026-11-09
related: [venn-diagram, binomial-expansion, inequality-shader, relation-checker]
sources:
  - "Subsets, power sets, the 2ⁿ rule and binomial coefficients are standard set theory and counting. Wording, pictures and examples are fibub's own; no textbook text, figures or exercises are used."
  - "Checked against Python's itertools.combinations (every subset, in order of size) and math.comb (the counts for sets of 0 to 6 elements)."
flow:
  - { icon: pencil, label: "Elements" }
  - { icon: pointer, label: "In or out" }
  - { icon: table, label: "Subsets" }
  - { icon: calculator, label: "2ⁿ" }
---

## What it does

A **subset** of a set A is any collection of A's elements, including none of them (the empty set ∅) and all of them (A itself). The set of all subsets of A is its **power set**, P(A). This page lists P(A) for any set you type, up to 6 elements, and shows where the famous count comes from: a set with n elements has **2ⁿ** subsets.

The reason is a string of yes/no choices. To make a subset, go through the elements one at a time and decide: in or out? Two choices for the first element, two for the second, and so on, so 2 × 2 × … × 2 = 2ⁿ subsets in all. The page draws this as a tree (for up to 4 elements) and lets you make the choices yourself with switches.

It fits the Class 11 maths chapter on sets (subsets and power sets), and the counts by size, C(n, k), lead into permutations and combinations and the binomial theorem later in Class 11.

The [[venn-diagram]] tool shows unions and intersections of the subsets you find here; the counts 1, 4, 6, 4, 1 come back as coefficients in the [[binomial-expansion]].

## How to use it

1. Type the elements, separated by commas (or spaces). Braces are fine: {1, 2, 3}. Repeats are left out, and the page tells you so, because a set lists each element once. Or tap one of the example sets.
2. Under **Build one subset**, tap each element to switch it in or out. Your subset appears with its switch code (1 = in, 0 = out), its path is drawn thick in the tree, and it is highlighted in the full list.
3. **All the subsets, by size** puts the subsets in columns: none, one, two … elements. Each column's heading gives its count C(n, k), the number of ways to choose k of the n elements.
4. The box at the bottom adds it up: 2ⁿ subsets, 2ⁿ − 1 proper subsets, the counts by size, and the fact that exactly half of the subsets contain any given element.

## Worked example

The page opens on {a, b, c}. The title says it has 3 elements, so 2³ = 8 subsets. The columns read:

- 0 elements, C(3, 0) = 1: ∅
- 1 element, C(3, 1) = 3: {a}, {b}, {c}
- 2 elements, C(3, 2) = 3: {a, b}, {a, c}, {b, c}
- 3 elements, C(3, 3) = 1: {a, b, c}

The bottom box gives 1 + 3 + 3 + 1 = 8, 7 proper subsets, and 4 subsets that contain a. Tap **a** and **c** to switch them in: your subset is {a, c}, switch code 101, and the thick path in the tree goes right, left, right.

## Tips

- ∅ is a subset of every set, and every set is a subset of itself.
- The elements of P(A) are sets. So {1} ∈ P({1, 2}), but 1 is not an element of P({1, 2}).
- Adding one element doubles the number of subsets: each old subset appears again with the new element added.

## FAQ

**Why only up to 6 elements?** Seven elements already give 128 subsets, which no longer fits on a phone screen in a useful way. The rule 2ⁿ works for any n.

**What is a proper subset?** A subset that is not the whole set. There are 2ⁿ − 1 of them. (Some books also leave out ∅; then it is 2ⁿ − 2.)

**Is anything saved?** No. Everything runs in your browser. fibub is not part of NCERT; the topics follow the syllabus, but the words, pictures and examples are our own.
