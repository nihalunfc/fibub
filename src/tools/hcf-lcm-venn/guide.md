---
name: HCF and LCM
num: 1155
shelf: learn
code: L72
section: school-maths
title: "HCF and LCM"
summary: "Type two numbers and watch their prime factor trees grow. Shared primes land in the middle of a Venn picture to give the HCF; all of them give the LCM. Euclid's division steps and the HCF × LCM check are shown too."
status: live
ads: false
order: 1155
icon: sigma
works: offline
updated: 2026-11-09
related: [number-theory-toolkit, pythagoras-proofs]
sources:
  - "The fundamental theorem of arithmetic, HCF and LCM from prime factorisation, and Euclid's division algorithm are standard number theory. Wording, pictures and examples are fibub's own."
  - "Checked against Python's math.gcd and math.lcm for every pair of numbers up to 300, and against hand-worked examples."
flow:
  - { icon: pencil, label: "Two numbers" }
  - { icon: scissors, label: "Factor tree" }
  - { icon: target, label: "Venn" }
  - { icon: check, label: "HCF and LCM" }
---

## What it does

Every whole number bigger than 1 is a product of primes in exactly one way (the **fundamental theorem of arithmetic**). This page uses that to find the **HCF** (highest common factor, also called the GCD) and the **LCM** (lowest common multiple) of two numbers, and lets you see why the method works:

1. A **factor tree** for each number splits it into primes.
2. The primes are sorted into a **Venn picture**: the primes the two numbers share go in the middle, the rest on each side.
3. The **HCF** is the product of the middle. The **LCM** is the product of everything in the picture.
4. **Euclid's division algorithm** finds the same HCF a second way, by repeated division.
5. A last line checks that HCF × LCM = the product of the two numbers.

It fits the Class 10 chapter *real numbers* (the fundamental theorem of arithmetic and HCF and LCM by prime factorisation) and is handy for factors and multiples in earlier classes. Euclid's division algorithm was dropped from the latest Class 10 book but is still in some state syllabuses and competitive exam books, so it stays here.

For really big numbers, modular arithmetic and the extended Euclid table, use the [[number-theory-toolkit]]. Whole-number patterns also turn up in Pythagorean triples in the [[pythagoras-proofs]] playground.

## How to use it

- Type two whole numbers from 2 to 100 000, or use the − and + buttons, or tap a quick example.
- The trees, the Venn picture, the HCF and LCM lines and Euclid's table all update at once.
- When one side of the Venn picture has a lot of primes, it shows them as powers (for example 2⁸) so the picture stays readable.

## A worked example

The page starts with 96 and 404.

- 96 = 2 × 2 × 2 × 2 × 2 × 3 = 2⁵ × 3 and 404 = 2 × 2 × 101 = 2² × 101.
- They share two 2s, so the middle of the Venn holds 2 and 2, and HCF = 2 × 2 = 4.
- Left side: 2, 2, 2, 3. Right side: 101. LCM = 2⁵ × 3 × 101 = 9 696.
- Check: 4 × 9 696 = 38 784 = 96 × 404.
- Euclid: 404 = 96 × 4 + 20, then 96 = 20 × 4 + 16, then 20 = 16 × 1 + 4, then 16 = 4 × 4 + 0. The last divisor is 4, the same HCF.

## Why HCF × LCM = a × b

The product a × b uses every prime of a and every prime of b, so the shared primes in the middle are counted twice (once for each number) and the others once. The HCF takes the shared primes once and the LCM takes everything once, so together they use every prime exactly as often as a × b does. (This only works for two numbers, not three.)

## Check yourself

Four fresh questions each time: an HCF, an LCM, an LCM from the HCF and the product, and one step of Euclid's algorithm. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**What if the numbers share no prime?** Then the middle is empty, the HCF is 1 (the numbers are *co-prime*) and the LCM is just the product.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
