---
name: Arithmetic progression staircase
num: 1162
shelf: learn
code: L79
section: school-maths
title: "Arithmetic progressions: nth term and sum of n terms with a staircase picture and Gauss's trick"
summary: "Slide the first term a and the common difference d and watch the terms grow as a staircase of bars. The nth term and the sum of n terms are worked with your numbers, and Gauss's pairing trick is drawn as the staircase plus its upside-down copy."
status: live
ads: false
order: 1162
icon: chart
works: offline
updated: 2026-11-16
related: [linear-pair-solver, quadratic-explorer, number-theory-toolkit]
sources:
  - "Standard results for arithmetic progressions: aₙ = a + (n − 1)d and Sₙ = n/2 [2a + (n − 1)d] = n/2 (a + l), with the classic story of Gauss adding 1 to 100. Written for fibub."
  - "Checked against direct addition of the terms for 500 random progressions and against Python's sum(range(1, 101)) = 5050."
  - "Arithmetic progression formulas (nth term, sum, number of terms) are standard school results; the new solver rearranges them and was checked by hand on worked examples. Written for fibub."
flow:
  - { icon: sliders, label: "Set a and d" }
  - { icon: chart, label: "Staircase" }
  - { icon: sigma, label: "Sum" }
  - { icon: check, label: "Practise" }
---

## What it does

In an **arithmetic progression** (AP) each term is the one before plus the same number, the **common difference** d: 3, 7, 11, 15, ... has d = 4. Drawn as bars, an AP is a staircase with equal steps. This page draws that staircase and works out, with your numbers:

- the **nth term** aₙ = a + (n − 1)d,
- the **sum of the first n terms** Sₙ = n/2 [2a + (n − 1)d],
- the same sum by **Gauss's pairing**: write the list forwards and backwards; every pair adds to first + last, so the sum is n/2 × (first + last),
- and **which term** a given number is (or that it is not a term at all).

It follows the Class 10 chapter *arithmetic progressions*.

Every term of an AP lies on a straight line, like the lines in the [[linear-pair-solver]]; the sum Sₙ is a quadratic in n, as in the [[quadratic-explorer]]. For patterns in whole numbers more generally, see the [[number-theory-toolkit]].

## How to use it

1. Set the first term **a**, the common difference **d** and the number of terms **n** with the sliders or boxes (n up to 500 in the box).
2. Read the first few terms at the top and see them as bars. Negative terms hang below the line in a different colour.
3. Tick **Show Gauss's pairing** to stack an upside-down copy of the staircase on top. Every column then has the same height, first + last, which is why the sum is n × (first + last) / 2.
4. Type a number in **Which term is** to find its position.
5. The quick buttons give a basic AP, the numbers 1 to 100, a decreasing AP and a savings plan.

## A worked example

The page starts with 3, 7, 11, ... (a = 3, d = 4) and n = 10.

- 10th term: 3 + 9 × 4 = 39.
- Sum: 10/2 × [6 + 9 × 4] = 5 × 42 = 210.
- Gauss: first + last = 3 + 39 = 42, and 10 terms make 5 pairs of 42, again 210.
- Which term is 39? 39 = 3 + (n − 1) × 4 gives n = 10.

**Savings plan**: save ₹500 in month 1 and ₹100 more each month. After 12 months the 12th deposit is ₹1 600 and the total is 12/2 × (500 + 1 600) = ₹12 600.

## Tips

- If you know two terms, subtract them to find d: the 10th term minus the 5th term is 5d.
- A term number must be a whole number of 1 or more; if the formula gives anything else, the value is not in the progression.

## Solve my problem

The staircase answers "what are the terms?" but exam questions usually give clues. The **Solve my problem** box handles the four most common kinds:

- **Two terms are known** (for example the 3rd term is 12 and the 8th is 37): it subtracts the two equations to get d, then finds a, and gives the nth term as dn + (a − d).
- **First term, d and a total**: how many terms make the sum? It solves the quadratic dn² + (2a − d)n − 2S = 0 and keeps only whole numbers of 1 or more. When d is negative both roots can be valid (24, 21, 18, ... reaches 78 after 4 terms and again after 13), and the page says so.
- **First term, last term and number of terms**: finds d and the sum n/2 (a + l).
- **First term, last term and d**: finds how many terms, or tells you plainly that the last term is not in the list.

Each answer comes with the working, and a button loads a, d and n into the staircase above. Four example buttons fill in typical problems. **Common mistakes** are listed too: using n instead of n − 1, getting the sign of d wrong, and not checking a second value of n.

## Check yourself

Four fresh questions each time: an nth term, a sum, which term a number is, and 1 + 2 + ... + m. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why does Gauss's picture switch off for negative terms?** Stacking bars only makes a clean rectangle when they all stand on the line. The formulas work for any AP.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples and pictures. fibub is not part of NCERT.

**How do I find the nth term of an AP?** Use aₙ = a + (n − 1)d. If you only know two terms, use "Solve my problem" to find a and d first.
