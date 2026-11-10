---
name: Algorithm stepper
num: 1287
shelf: learn
code: L168
section: school-maths
title: "Algorithm stepper: bubble sort, binary search and Euclid's HCF, one step at a time"
summary: "Watch bubble sort put a list in order, binary search halve a sorted list to find a number, and Euclid's algorithm cut a rectangle into squares to find the HCF. Step forwards and back, count the comparisons, and see how the step counts grow from 8 items to a million."
status: live
ads: false
order: 1287
icon: sliders
works: offline
updated: 2026-11-09
related: [hcf-lcm-venn, algorithm-visualiser, histogram-builder]
sources:
  - "Bubble sort, linear and binary search and Euclid's algorithm are standard algorithms. Wording, pictures and examples are fibub's own."
  - "Checked against Python's sorted() and bisect, math.gcd for every pair up to 500, and hand counts of comparisons and swaps."
flow:
  - { icon: pointer, label: "Pick one" }
  - { icon: pencil, label: "Your input" }
  - { icon: sliders, label: "Step" }
  - { icon: check, label: "Count steps" }
---

## What it does

An **algorithm** is a list of exact steps that always finishes and always gives the right answer. This page plays three famous ones slowly, so you can follow every step and count how much work each one does:

- **Bubble sort** puts a list in order by comparing neighbours and swapping any pair that is the wrong way round. After each pass the biggest number left has "bubbled" to the end, shown in green. If a whole pass makes no swaps, the list is sorted and it stops early.
- **Binary search** finds a number in a sorted list by looking at the middle, then throwing away the half that cannot hold it. The page also says how many looks a plain left-to-right (**linear**) search would need.
- **Euclid's algorithm** finds the HCF of two numbers by repeated division: a = b × q + r, then the same with b and r, until the remainder is 0. The picture shows why it works: it cuts the biggest possible squares from an a by b rectangle, then from the strip left over, and the last square fits exactly. Its side is the HCF.

It fits the Class 9 mathematics chapter on algorithms (step-by-step methods, sorting, searching and Euclid's algorithm). For prime factor trees and the Venn picture of the HCF, see [[hcf-lcm-venn]]; for more sorting methods such as merge sort and quick sort, try the [[algorithm-visualiser]].

## How to use it

1. Pick **Bubble sort**, **Binary search** or **Euclid's HCF** at the top.
2. Type your own list, number to find, or pair of numbers, or tap the button for a fresh random one.
3. Press **Step** to do one step, **Back** to undo it, **Play** to run it on its own (press again to pause) and **Reset** to start again.
4. The line under the picture says what just happened. The boxes count the steps, comparisons and swaps.
5. The **How the steps grow** table shows the most comparisons each method can need for lists of 8, 16, 100, 1 000 and a million items.

## A worked example

**Bubble sort** on 29, 10, 14, 37, 13, 5, 21, 8: the first pass makes 7 comparisons and carries 37 to the end. Sorting the whole list takes 7 passes, 28 comparisons (7 + 6 + 5 + 4 + 3 + 2 + 1, the most a list of 8 can need) and 18 swaps. The 18 swaps are the 18 pairs in the list where a bigger number comes before a smaller one.

**Binary search** for 57 in the starting list of 16 numbers: the middle (8th) number is 38, too small, so the left half goes; the middle of the rest is 57. Found in 2 looks. A linear search would need 12.

**Euclid** on 168 and 60: 168 = 60 × 2 + 48, 60 = 48 × 1 + 12, 48 = 12 × 4 + 0. The HCF is 12, and the rectangle is cut into two 60-squares, one 48-square and four 12-squares.

## Why some algorithms are faster

Doubling a list doubles the work of linear search, roughly quadruples the work of bubble sort, and adds just **one** look to binary search. For a million items binary search needs at most 20 looks, while bubble sort can need about 500 billion comparisons. That is why computers sort big lists with cleverer methods, and why dictionaries and phone contacts are kept in order.

## Check yourself

Four fresh questions each time: comparisons in one pass of bubble sort, the most looks binary search needs, an HCF by Euclid and the swaps needed for a short list. Nothing is saved.

## FAQ

**Does binary search work on a list that is not sorted?** No. Throwing away half the list only makes sense when everything on one side is smaller and everything on the other side bigger.

**Why does Euclid's algorithm always stop?** Each remainder is smaller than the number before it and never below 0, so after a few steps it has to reach 0.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
