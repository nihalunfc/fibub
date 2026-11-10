---
name: Irrational √2
num: 1318
shelf: learn
section: school-maths
title: "Irrational √2"
summary: "Hunt for a fraction a/b equal to √2 and watch a² and 2b² come close but never meet. See 40 exact digits of √n, then step through the proof by contradiction that √p is irrational, and that r + s√p is irrational too."
status: live
ads: false
order: 1318
icon: sigma
works: offline
updated: 2026-11-09
related: [hcf-lcm-venn, pythagoras-proofs, polynomial-zeros]
sources:
  - "Standard results: the classical proof that the square root of a prime is irrational, closure of the rationals under arithmetic, and repeating decimals as fractions. Written for fibub."
  - "Digits of √n computed with exact whole-number square roots and checked against Python's decimal module to 40 places; best fractions checked against a brute-force search."
flow:
  - { icon: sliders, label: "Pick b" }
  - { icon: chart, label: "Compare" }
  - { icon: pencil, label: "Proof steps" }
  - { icon: check, label: "Practise" }
---

## What it does

A number is **rational** if it can be written as a fraction a/b of whole numbers. √2 cannot, and this page lets you see why in three ways:

- **The fraction hunt.** Pick a bottom number b and the page finds the top number a that makes a/b closest to √n. If a/b were exactly √n, then a² would equal n·b². Two bars compare them. For n = 2 they come within 1 of each other (7² = 49 and 2 × 5² = 50) but never meet, however big b gets.
- **The digits.** √n to 40 decimal places, worked out exactly. The decimal of every fraction either stops or repeats a block for ever; the digits of √2 never do.
- **The proof.** Step through the classic **proof by contradiction**: assume √p = a/b in lowest terms, square, and show that p divides both a and b, which cannot happen. A second proof shows that numbers such as 5 + 2√3 are irrational too.

It follows Class 10 Maths, *real numbers* (irrational numbers and their proofs) and Class 9, *number systems* (rational and irrational numbers, repeating decimals).

The proof leans on prime factors, which you can explore in [[hcf-lcm-venn]]; √2 first turns up as the diagonal of a unit square in [[pythagoras-proofs]].

## How to use it

1. In the first card set **n** (a whole number from 2 to 99) and slide **b**. Read a/b, a², n·b² and the gap between them.
2. Try a perfect square such as n = 9: the bars meet at once, because √9 = 3.
3. In the proof card pick **√p is irrational** and a prime p, then press **Next step** to reveal one step at a time, or **Show all**. Each step says what is claimed and, in grey, why it is true.
4. Pick **r + s√p is irrational**, choose whole numbers r and s (s not 0) and step through again.
5. Open **Why does p divide a when p divides a²?** to see the remainders of squares on dividing by p. None is 0.

## Worked example

With n = 2 and b = 5, the closest top number is a = 7, because 5 × √2 = 7.07. Then a² = 49 and 2b² = 50: off by 1, so 7/5 = 1.4 is close to √2 = 1.41421356… but not equal. With b = 12, a = 17: 289 against 288, off by 1 again. With b = 29, a = 41: 1681 against 1682.

The proof for p = 2: suppose √2 = a/b with no common factor. Then 2b² = a², so 2 divides a², so 2 divides a. Write a = 2c: 2b² = 4c², so b² = 2c², and 2 divides b. Now 2 divides both a and b, which contradicts "no common factor". So √2 is irrational.

## Tips

- In a proof by contradiction, write the assumption clearly first ("suppose √p = a/b in lowest terms"), because the contradiction is with that sentence.
- The step "p divides a², so p divides a" needs p to be prime. It fails for 4: 4 divides 2² = 4, but 4 does not divide 2.
- For r + s√p, rearrange to get √p on its own; the other side is rational, which is the contradiction.

## FAQ

**Does a bigger b ever make the bars equal for n = 2?** No. The proof shows no whole numbers a and b can make a² = 2b².

**What about √6, which is not under a prime?** √6 is irrational too. The same idea works with the prime 2 or 3 in its factors; the page's hunt shows it never meets.

**Is this from the textbook?** No. The proof is the standard one from mathematics; the page and examples are written for fibub, which is not part of NCERT.

**Is anything saved?** No. Everything is worked out in your browser and nothing is stored or sent.
