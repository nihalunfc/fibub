---
title: 'Numbers, divisibility, HCF and LCM'
seoTitle: 'Number system, HCF and LCM for CUET General Test'
summary: 'Divisibility rules, prime factors, HCF and LCM with a picture that makes them obvious, remainders and unit digits, so that number questions in the CUET General Test take seconds, not minutes.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: What is the HCF of 36 and 60?
    choices: ['12', '6', '180']
    ans: 0
    why: 36 = 2² × 3², 60 = 2² × 3 × 5. Shared factors 2² × 3 = 12.
  - q: The HCF of two numbers is 6 and their product is 432. What is their LCM?
    choices: ['72', '144', '36']
    ans: 0
    why: HCF × LCM = product of the two numbers, so LCM = 432 ÷ 6 = 72.
  - q: Which number is divisible by 11?
    choices: ['4,365', '4,356', '4,536']
    ans: 1
    why: For 4,356 the alternate digit sums are 4 + 5 = 9 and 3 + 6 = 9; their difference is 0, a multiple of 11. The others give differences of 2 and 4.
sources:
  - 'National Testing Agency, CUET (UG) syllabus for the General Test (numerical ability) https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 3 · about 16 minutes.** By the end you will test divisibility at a glance, find HCF and LCM from prime factors, and handle remainder and unit-digit questions.

<div class="bigidea">Every whole number is built from primes in exactly one way. Once you write numbers as prime factors, HCF, LCM and divisibility are just bookkeeping.</div>

## 1. Divisibility rules worth knowing

| Divisible by | Rule | Example |
|---|---|---|
| 2, 5, 10 | last digit even / 0 or 5 / 0 | 3,470 works for all three |
| 3, 9 | digit sum divisible by 3 / 9 | 5,832: 5+8+3+2 = 18, so by 3 and 9 |
| 4, 8 | last two / last three digits divisible by 4 / 8 | 7,136: 136 = 8 × 17 |
| 6 | by 2 and by 3 | 4,152 |
| 11 | (sum of odd-place digits) − (sum of even-place digits) is 0 or a multiple of 11 | 4,356: (4+5) − (3+6) = 0 |

## 2. HCF and LCM from prime factors

<figure class="fig" data-fig="hcf-lcm"><figcaption>Pick two numbers. Primes they share sit in the middle: their product is the HCF. Everything in both circles multiplied together is the LCM.</figcaption></figure>

```math
\text{HCF} \times \text{LCM} = a \times b
```

<div class="meaning">

<dl>
<dt>HCF</dt><dd>highest common factor: the biggest number that divides both (the middle of the picture)</dd>
<dt>LCM</dt><dd>lowest common multiple: the smallest number both divide into (everything in the picture)</dd>
<dt>Physical meaning</dt><dd>HCF answers "largest equal pieces" questions (cutting ribbons, tiling a floor with the biggest square tile); LCM answers "together again" questions (bells, traffic lights, runners on a track). The product rule only holds for <em>two</em> numbers.</dd>
</dl>

</div>

<div class="problem" data-problem="lcm-bells"></div>

## 3. Remainders and unit digits

<div class="steps" data-title="Worked example: the unit digit of 7^43">
<div class="step">Powers of 7 end in 7, 9, 3, 1, and then the pattern repeats every 4.</div>
<div class="step">Divide the power by 4: 43 = 4 × 10 + 3, remainder 3.</div>
<div class="step">Remainder 3 means the third digit in the cycle: <b>3</b>. (Remainder 0 would mean the fourth, 1.)</div>
<div class="step">The same trick works for any base: 2, 3, 7, 8 cycle every 4; 4 and 9 every 2; 0, 1, 5, 6 never change.</div>
</div>

For remainders, use **the remainder of a sum or product is the sum or product of remainders**: the remainder of 47 × 52 ÷ 5 is (2 × 2) ÷ 5, remainder 4.

<div class="myth">

**"1 is a prime number."** It is not: a prime has exactly two factors, 1 and itself. 2 is the only even prime. Questions on "how many primes between 1 and 50" (there are 15) catch people who count 1.

</div>

## 4. Practice

<div class="qbank" data-bank="cuet-general-test" data-topics="number-system" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Learn the divisibility rules for 2 to 11; 11 uses alternate digit sums.
- HCF = product of shared primes; LCM = product of all primes at their highest powers.
- HCF × LCM = product, for two numbers only.
- HCF for "biggest equal pieces"; LCM for "together again".
- Unit digits repeat in cycles (mostly of 4); remainders of sums and products follow the remainders.

</div>
