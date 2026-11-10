---
name: Number theory toolkit
num: 544
shelf: science
code: T372
section: pure-mathematics
title: "Number theory calculator: prime test, factorisation, gcd, modular inverse, Chinese remainder and continued fractions"
summary: "Test whether a huge number is prime, factorise it, find gcd and lcm with the extended Euclid table, work out modular powers and inverses, solve Chinese remainder systems, and expand continued fractions with their convergents. Exact whole-number arithmetic, in your browser."
status: live
ads: true
order: 544
icon: sigma
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, sql-playground, group-explorer, combinatorics-calculator, cipher-teacher, error-correcting-codes, symbolic-algebra]
sources:
  - "Standard number theory (Euclid, Fermat, Euler, Gauss, Lagrange). Miller-Rabin bases from Sorenson and Webster (2015); Baillie-PSW as described by Baillie and Wagstaff (1980); Pollard rho with Brent's improvement (1980)."
  - "Checked against sympy: isprime, factorint, totient, mobius, divisor_sigma, reduced_totient, mod_inverse, solve_congruence, continued_fraction, n_order and diop_DN, on fixed and random numbers up to 10^40 and Mersenne numbers up to 2^1279 − 1."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: search, label: "Factor" }
  - { icon: calculator, label: "Mod and CRT" }
  - { icon: table, label: "Steps" }
---

## What it does

A toolkit for the sums of elementary number theory, done exactly with whole numbers of any size (up to a few thousand digits), so nothing is rounded:

- **Primes and factors:** is the number prime, its prime factorisation, Euler's phi φ(n), Carmichael's λ(n), the Möbius function μ(n), the number and sum of divisors, whether it is perfect, abundant or deficient, the next and previous prime, and the full list of divisors.
- **GCD and LCM** of any list of numbers. For two numbers you get the **extended Euclid** table and Bézout's identity a·x + b·y = gcd(a, b).
- **Modular arithmetic:** a^e mod m by fast repeated squaring, the **modular inverse**, the **order** of a, whether a is a primitive root, and the solutions of a·x ≡ b (mod m).
- **Chinese remainder theorem:** solve several congruences x ≡ r (mod m) at once. The moduli do not need to be coprime; when they clash, it says which lines.
- **Continued fractions** of a fraction, a decimal, a square root, π or e, with every **convergent** p/q and its value. For √n you also get the period and the smallest solution of **Pell's equation** x² − n·y² = 1.

Watch modular arithmetic at work in the [[cipher-teacher]], and explore the groups it builds in the [[group-explorer|group theory explorer]].

## How to use it

1. Pick a tab at the top.
2. Type the numbers. Any box takes a sum such as `2^127 - 1`, `10! + 1` or `3 × 5^4`.
3. The answer appears as you type. Tables (divisors, Euclid steps, CRT check, convergents) download as CSV, and the whole result as an image, PDF or Word file.

## How it works

**Primality** uses trial division for small numbers, then the Miller-Rabin test with the 13 prime bases 2 to 41. Below 3.3 × 10^24 that set of bases is proven to have no exceptions, so the answer is certain. Above it the tool adds the strong Lucas test (together: Baillie-PSW). No composite number is known that passes, but it is not a proof, so the page says "probably prime". A "not prime" answer is always certain.

**Factorisation** divides by the primes below 10 000, checks for perfect powers, then uses Pollard's rho method with Brent's cycle finding. It finds factors up to about 15 digits within its 2.5-second limit. A part it cannot split is shown in brackets and labelled: it is certainly composite, but its factors are large. Numbers made of two 25-digit primes need methods like the quadratic sieve, which this tool does not have.

## Worked example

The page opens with Fermat's number 2^32 + 1 = 4 294 967 297, which Fermat thought was prime. The toolkit shows **4294967297 = 641 × 6700417** (Euler, 1732), with φ(n) = 4 288 266 240, λ(n) = 33 502 080, σ(n) = 4 301 668 356 and 4 divisors. The next prime is 4 294 967 311.

In the GCD tab, 240 and 46 give gcd 2 and lcm 5520, and the Euclid table ends with 240 × (−9) + 46 × 47 = 2.

The Modular tab opens with 7^560 mod 561 = 1. 561 = 3 × 11 × 17 is a Carmichael number: it fools Fermat's test for every base coprime to it. The inverse of 7 mod 561 is 481, and the order of 7 is 80.

The Chinese remainder tab solves Sunzi's old puzzle, remainders 2, 3 and 2 when divided by 3, 5 and 7: x ≡ 23 (mod 105).

Continued fraction of π: [3; 7, 15, 1, 292, …], whose convergents 22/7 and 355/113 are the famous approximations. √61 has period 11, and its Pell equation needs x = 1 766 319 049, y = 226 153 980.

## Frequently asked questions

**How big can the numbers be?** Up to 4000 digits for most sums. Primality of a 400-digit number takes well under a second. Factoring is the hard part: it is quick when all but one factor is under about 15 digits.

**Why "probably prime"?** Above 3.3 × 10^24 a fast test cannot prove primality; proofs such as ECPP are much heavier. In practice Baillie-PSW has never been wrong.

**Do negative numbers work?** Yes: gcd, modular sums and fractions accept them. A negative n is factorised as −1 times |n|.

**Is anything sent anywhere?** No. All the arithmetic runs in your browser, and nothing is stored.
