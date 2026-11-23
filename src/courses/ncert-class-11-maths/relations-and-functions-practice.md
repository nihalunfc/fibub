---
title: 'Relations and Functions: practice questions'
seoTitle: 'Relations and Functions Class 11 questions with answers'
summary: 'Practice for Class 11 Relations and Functions: Cartesian products, relations, functions, domain and range, special functions and algebra of functions.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'A has 6 elements and B has 4. How many relations are there from A to B?'
    choices: ['2²⁴', '24', '4⁶', '10']
    ans: 0
    why: 'A × B has 6 × 4 = 24 pairs and a relation is any subset: 2²⁴. (4⁶ counts functions.)'
  - q: 'The range of f(x) = |x| + 3 is:'
    choices: ['[3, ∞)', '[0, ∞)', 'all real numbers', '(3, ∞)']
    ans: 0
    why: '|x| ≥ 0 so |x| + 3 ≥ 3, and 3 is reached at x = 0.'
  - q: 'Which is the domain of f(x) = √(x² − 9)?'
    choices: ['(−∞, −3] ∪ [3, ∞)', '[−3, 3]', '[3, ∞)', 'all real numbers']
    ans: 0
    why: 'We need x² − 9 ≥ 0, so x ≤ −3 or x ≥ 3.'
sources:
  - 'CBSE Class 11 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 2.** Read the lesson, [Relations and Functions](/learn/courses/ncert-class-11-maths/relations-and-functions/), first. Try each question on paper before you open the answer.

<div class="bigidea">Ask two questions of any relation: does every input have an output, and does any input have two? For a formula, ask what values of x would break it: a square root of a negative number or a division by zero.</div>

## How to set out answers

1. For a relation, list the pairs; for a function, also state its domain and range.
2. To test a function, check every input has exactly one output.
3. For a domain, write the condition from each trouble spot (root and denominator), then combine them.
4. For a range, complete the square or read it off the graph, and write it as an interval.

## 1-mark questions

1. A has 6 elements and B has 4. Write n(A × B).
<details><summary>Answer</summary>24.</details>

2. Is {(1, 2), (1, 3)} a function?
<details><summary>Answer</summary>No: the input 1 has two outputs.</details>

3. Write the domain of f(x) = 1/(x + 2).
<details><summary>Answer</summary>All real numbers except −2.</details>

4. Find ⌊−3.2⌋.
<details><summary>Answer</summary>−4, since the greatest integer not above −3.2 is −4.</details>

5. Write the range of f(x) = |x| + 3.
<details><summary>Answer</summary>[3, ∞).</details>

## 2-mark and 3-mark questions

6. A = {1, 2, 3} and B = {x, y}. Write A × B and say how many elements it has. *(2 marks)*
<details><summary>Answer</summary>A × B = {(1, x), (1, y), (2, x), (2, y), (3, x), (3, y)}, with 3 × 2 = 6 elements.</details>

7. R = {(x, y) : y = 2x + 1} from A = {1, 2, 3, 4}. List R, its domain and range. *(3 marks)*
<details><summary>Answer</summary>R = {(1, 3), (2, 5), (3, 7), (4, 9)}. Domain = {1, 2, 3, 4}; range = {3, 5, 7, 9}. It is also a function (and one-one).</details>

8. f(x) = x² − 4x + 1. Find f(0), f(2), f(−1) and f(a + 1) − f(a). *(3 marks)*
<details><summary>Answer</summary>

`$f(0) = 1$`, `$f(2) = 4 - 8 + 1 = -3$`, `$f(-1) = 1 + 4 + 1 = 6$`.

`$f(a + 1) - f(a) = (a^2 + 2a + 1 - 4a - 4 + 1) - (a^2 - 4a + 1) = 2a - 3$`.

</details>

9. Find the domain of `$f(x) = \sqrt{x^2 - 9}$`. *(3 marks)*
<details><summary>Answer</summary>

We need `$x^2 - 9 \ge 0$`, so `$(x - 3)(x + 3) \ge 0$`. That holds when `$x \le -3$` or `$x \ge 3$`. Domain: `$(-\infty, -3] \cup [3, \infty)$`.

</details>

10. f(x) = x + 2 and g(x) = x². Find (f + g)(x), (f·g)(1) and the domain of f/g. *(3 marks)*
<details><summary>Answer</summary>

`$(f + g)(x) = x^2 + x + 2$`. `$(f \cdot g)(1) = f(1) \cdot g(1) = 3 \times 1 = 3$`. For `$f/g$` we need `$g(x) \ne 0$`, so the domain is all real `$x$` except 0.

</details>

## 5-mark questions (model answers)

11. Find the domain and range of `$f(x) = \sqrt{9 - x^2}$` and sketch its graph in words. *(5 marks)*
<details><summary>Answer</summary>

Domain: need `$9 - x^2 \ge 0$`, so `$-3 \le x \le 3$`: `$[-3, 3]$`.

Range: `$9 - x^2$` goes from 0 (at x = ±3) up to 9 (at x = 0), so its square root goes from 0 up to 3. Range `$[0, 3]$`.

Graph: if `$y = \sqrt{9 - x^2}$` then `$x^2 + y^2 = 9$` with `$y \ge 0$`: the **upper half** of a circle of radius 3, centred at the origin. It passes the vertical line test.

</details>

12. For f(x) = x² − 6x + 10, find the range by completing the square, and show that f is not one-one. *(5 marks)*
<details><summary>Answer</summary>

`$x^2 - 6x + 10 = (x - 3)^2 + 1$`. A square is at least 0, so `$f(x) \ge 1$`, and 1 is reached at `$x = 3$`. Range: `$[1, \infty)$`.

Not one-one: `$f(2) = 4 - 12 + 10 = 2$` and `$f(4) = 16 - 24 + 10 = 2$`. Two different inputs give the same output.

</details>

## Case-based question

A taxi in a city charges a flag-fall of ₹50 plus ₹12 per kilometre. The fare for x km is `$f(x) = 50 + 12x$`, with `$x \ge 0$`.

13. (a) Find f(5). (b) For what distance is the fare ₹170? (c) State the domain and range of f. (d) Is f one-one? *(4 marks)*
<details><summary>Answer</summary>

(a) `$50 + 60 = 110$`, so ₹110. (b) `$50 + 12x = 170$` gives `$x = 10$` km. (c) Domain `$[0, \infty)$`, range `$[50, \infty)$`. (d) Yes: a larger distance always gives a larger fare, so different inputs give different outputs.

</details>

<div class="problem" data-problem="c11m-rel-domain"></div>

## Assertion and reason

14. **Assertion (A):** Every function is a relation, but not every relation is a function. **Reason (R):** In a function each input has exactly one output.
<details><summary>Answer</summary>Both true and R explains A (option a).</details>

15. **Assertion (A):** f(x) = |x| is one-one. **Reason (R):** f(−2) = f(2).
<details><summary>Answer</summary>A is false: f(−2) = f(2) = 2 with −2 ≠ 2. R is true. Option (d).</details>

<div class="problem" data-problem="c11m-rel-functions"></div>

## Question set

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="relations-and-functions" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- n(A × B) = n(A)·n(B); relations from A to B: 2^(mn); functions: n^m.
- Function test: every input has exactly one output (vertical line test on a graph).
- Domain: root contents ≥ 0, denominators ≠ 0. Range: complete the square or use the graph.
- ⌊x⌋ rounds down; sgn x is −1, 0 or 1; |x| is never negative.
- (f/g)(x) is defined only where g(x) ≠ 0.

</div>
