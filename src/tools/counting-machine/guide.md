---
name: Counting machine
num: 1376
shelf: learn
code: L234
section: school-maths
title: "Permutations and combinations: arrange, choose and count every case, with nPr and nCr side by side"
summary: "Seat people in a row, pick a team or shuffle the letters of a word and see every arrangement listed for small cases. nPr and nCr are worked side by side with your numbers, and repeated letters (BANANA, MISSISSIPPI) are handled with n!/(p! q!)."
status: live
ads: false
order: 1376
icon: calculator
works: offline
updated: 2026-11-09
related: [binomial-expansion, sample-space, combinatorics-calculator, probability-tree]
sources:
  - "Standard counting results: the fundamental principle of counting, n!, nPr = n!/(n − r)!, nCr = n!/(r!(n − r)!) and arrangements of n objects with repeats, n!/(p! q! …). Written for fibub."
  - "Checked against Python's math.perm, math.comb and itertools (every n up to 8 listed and counted) and the known count 34,650 for MISSISSIPPI."
flow:
  - { icon: sliders, label: "Set n and r" }
  - { icon: table, label: "See them all" }
  - { icon: calculator, label: "nPr and nCr" }
  - { icon: check, label: "Practise" }
---

## What it does

Counting problems are hard because it is easy to count something twice or miss a case. This page lets you see **every case** while the numbers are small, so the formulas stop being magic:

- **Arrange (order matters).** Seat r of n friends on r chairs in a row. The boxes show how many choices each chair has: n, then n − 1, and so on. Multiplying them gives **nPr = n!/(n − r)!**, and the page lists every seating in dictionary order.
- **Choose (order does not matter).** Pick a team of r from n players. AB and BA are now the same team, and every team turns up r! times in the Arrange list, so **nCr = nPr / r!**. Every team is listed.
- **Letters of a word.** Type any word. If letters repeat, swapping two identical letters makes no new word, so the count is **n!/(p! q! …)**, where p, q, … are how many times each repeated letter appears. BANANA gives 60, MISSISSIPPI gives 34,650.

The page always shows nPr, nCr and r! together, with the link nPr = nCr × r! filled in. It follows the Class 11 chapter *permutations and combinations* and is handy for Class 12 probability, where counting outcomes comes first.

The same nCr numbers build Pascal's triangle in [[binomial-expansion]], and counting outcomes is the first step of a probability in [[sample-space]] and [[probability-tree]].

## How to use it

1. Pick **Arrange**, **Choose** or **Letters of a word** at the top.
2. For Arrange and Choose, set **n** (how many different things) and **r** (how many are used) with the sliders. The number boxes take n up to 30; the list then shows the first 240 cases and the formula does the rest.
3. For words, type a word or tap one of the examples. Only letters count; spaces are ignored.
4. Read the boxes picture, the three facts and the formulas with your numbers, then scroll through the list.

## A worked example

The page starts on Arrange with n = 5 and r = 3: five friends A to E and three chairs.

- Chair 1 has 5 choices, chair 2 has 4, chair 3 has 3: 5P3 = 5 × 4 × 3 = **60**. The list starts ABC, ABD, ABE, ACB, …
- Switch to Choose: the team {A, B, C} was counted 3! = 6 times above (ABC, ACB, BAC, BCA, CAB, CBA), so 5C3 = 60 / 6 = **10**.
- Switch to Letters of a word with BANANA: 6 letters, A three times and N twice. 6! = 720, and 720 / (3! × 2!) = 720 / 12 = **60** different words, all listed.

## Tips

- Ask "does swapping two of them make something new?" If yes, use permutations; if no, use combinations.
- nCr = nC(n − r): choosing 3 players to play is the same as choosing the 2 who sit out.
- 0! = 1, so nP0 = nC0 = 1: there is exactly one way to do nothing.

## Check yourself

Four fresh questions each time: a race finish (permutation), choosing books (combination), arranging the letters of a word with repeats, and a committee made of two groups. Type a whole number and press **Check**. Nothing is saved.

## FAQ

**Why stop listing at 240?** Lists grow very fast: 10P5 is already 30,240. Seeing the first few is enough to see the pattern; the formula counts the rest exactly.

**Can I count bigger cases?** Yes, up to n = 30 here. For big numbers, Stirling numbers, partitions and more, use the [[combinatorics-calculator]].

**Is this from the NCERT book?** It covers the same topics with fibub's own examples. fibub is not part of NCERT.
