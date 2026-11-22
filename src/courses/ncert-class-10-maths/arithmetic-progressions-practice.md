---
title: 'Arithmetic Progressions: practice questions'
seoTitle: 'Arithmetic Progressions Class 10 questions with answers'
summary: 'Board-style practice for Class 10 Arithmetic Progressions: 1, 2, 3 and 5 mark questions, a case-based question and assertion-reason with worked answers.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'In an AP the first term is 6 and the common difference is −2. The 5th term is:'
    choices: ['−2', '2', '−4', '16']
    ans: 0
    why: 'a₅ = 6 + 4 × (−2) = 6 − 8 = −2.'
  - q: 'The sum of the first 8 terms of an AP with first term 3 and last (8th) term 31 is:'
    choices: ['136', '124', '248', '34']
    ans: 0
    why: 'S = n(a + l)/2 = 8 × (3 + 31) / 2 = 8 × 17 = 136.'
  - q: 'If three numbers x, 8, 14 are in AP, then x equals:'
    choices: ['2', '4', '6', '11']
    ans: 0
    why: 'The common difference is 14 − 8 = 6, so x = 8 − 6 = 2.'
sources:
  - 'CBSE Class 10 Mathematics (Standard) question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 10 Maths · Chapter 5.** Read the chapter lesson, [Arithmetic Progressions](/learn/courses/ncert-class-10-maths/arithmetic-progressions/), first. Try each question on paper before you open the answer.

<div class="bigidea">Every AP question comes down to three numbers: the first term `$a$`, the common difference `$d$` and the number of terms `$n$`. Write them down first, then choose `$a_n = a + (n-1)d$` for a single term or `$S_n = \tfrac n2[2a + (n-1)d]$` for a total.</div>

## How to set out an answer

1. Write what is given as `$a$`, `$d$`, `$n$` (and `$l$` if the last term is known).
2. Write the formula you will use in symbols.
3. Substitute with brackets for negative numbers, and work step by step.
4. Check that `$n$` is a positive whole number, and write the answer in words with its unit.

## 1-mark questions

1. Write the first four terms of the AP with `$a = 10$` and `$d = -4$`.
<details>
<summary>Answer</summary>

10, 6, 2, −2.

</details>

2. Is 301 a term of the AP 5, 11, 17, 23, …?
<details>
<summary>Answer</summary>

`$5 + (n-1) \times 6 = 301$` gives `$n - 1 = 49.33$`, which is not a whole number. So 301 is not a term.

</details>

3. Find the common difference of the AP 0.5, 1.25, 2, 2.75, …
<details>
<summary>Answer</summary>

`$d = 1.25 - 0.5 = 0.75$`.

</details>

4. Find the sum of the first 50 natural numbers.
<details>
<summary>Answer</summary>

`$\dfrac{50 \times 51}{2} = 1275$`.

</details>

## 2-mark and 3-mark questions

5. Find the 31st term of an AP whose 11th term is 38 and 16th term is 73. *(3 marks)*
<details>
<summary>Answer</summary>

From the 11th to the 16th term there are 5 steps: `$5d = 73 - 38 = 35$`, so `$d = 7$`.

`$a_{31} = a_{11} + 20d = 38 + 140 = 178$`.

</details>

6. How many terms of the AP 9, 17, 25, … must be taken to give a sum of 636? *(3 marks)*
<details>
<summary>Answer</summary>

`$a = 9$`, `$d = 8$`. `$\dfrac n2[18 + 8(n-1)] = 636$` gives `$n(4n + 5) = 636$`, so `$4n^2 + 5n - 636 = 0$`.

`$D = 25 + 10176 = 10201 = 101^2$`, so `$n = \dfrac{-5 \pm 101}{8} = 12$` or `$-13.25$`. A number of terms cannot be negative: `$n = 12$`.

</details>

7. In an AP the first term is 2 and the last term is 29. The sum of all the terms is 155. Find the number of terms and the common difference. *(3 marks)*
<details>
<summary>Answer</summary>

`$S = \dfrac n2(a + l)$`: `$155 = \dfrac n2 (31)$`, so `$n = 10$`.

`$29 = 2 + 9d$`, so `$d = 3$`.

</details>

8. Find the sum of all three-digit numbers that are divisible by 9. *(3 marks)*
<details>
<summary>Answer</summary>

The numbers are 108, 117, …, 999. `$999 = 108 + (n-1) \times 9$` gives `$n - 1 = 99$`, so `$n = 100$`.

`$S = \dfrac{100}{2}(108 + 999) = 50 \times 1107 = 55350$`.

</details>

9. Show that `$a_n = S_n - S_{n-1}$` and use it to find the 7th term of an AP whose sum is `$S_n = 2n^2 + 3n$`. *(3 marks)*
<details>
<summary>Answer</summary>

`$S_n$` is the sum of `$n$` terms and `$S_{n-1}$` the sum of the first `$n-1$` of them; the difference is the one term left over, `$a_n$`.

`$S_7 = 2(49) + 21 = 119$` and `$S_6 = 2(36) + 18 = 90$`, so `$a_7 = 119 - 90 = 29$`.

</details>

## 5-mark questions (with model answers)

10. The sum of the 4th and 8th terms of an AP is 24 and the sum of the 6th and 10th terms is 44. Find the first three terms and the sum of the first 10 terms. *(5 marks)*
<details>
<summary>Answer</summary>

`$a_4 + a_8 = (a + 3d) + (a + 7d) = 2a + 10d = 24$`, so `$a + 5d = 12$` … (1)

`$a_6 + a_{10} = 2a + 14d = 44$`, so `$a + 7d = 22$` … (2)

Subtract (1) from (2): `$2d = 10$`, so `$d = 5$`. Then `$a = 12 - 25 = -13$`.

The first three terms are `$-13, -8, -3$`.

`$S_{10} = 5[2(-13) + 9 \times 5] = 5 \times 19 = 95$`.

</details>

11. A courtyard has a triangle of tiles laid out: 1 tile in the first row, 3 in the second, 5 in the third, and so on, using 169 tiles in all. How many rows are there, and how many tiles are in the last row? *(5 marks)*
<details>
<summary>Answer</summary>

The rows form an AP with `$a = 1$`, `$d = 2$`, and the sum of `$n$` terms is `$169$`.

Sum of the first `$n$` odd numbers is `$n^2$`, so `$n^2 = 169$` and `$n = 13$`.

Last row: `$a_{13} = 1 + 12 \times 2 = 25$` tiles.

Check by formula: `$S = \dfrac{13}{2}(1 + 25) = 169$`.

</details>

12. A person saves ₹300 in the first month and increases the saving by ₹40 each month. In which month will the saving for that month first exceed ₹700, and how much will have been saved by the end of that month? *(5 marks)*
<details>
<summary>Answer</summary>

`$a = 300$`, `$d = 40$`. We need `$300 + (n-1)40 > 700$`, so `$(n-1)40 > 400$`, `$n - 1 > 10$`, so `$n > 11$`. The first such month is the 12th. Its saving is `$300 + 11 \times 40 = 740$`.

Total saved in 12 months: `$S_{12} = 6[600 + 11 \times 40] = 6 \times 1040 = 6240$`, so ₹6240.

(In the 11th month the saving was exactly ₹700, which does not *exceed* 700.)

</details>

## Case-based question

**The temple steps.** A temple has 30 stone steps up a hill. Each step is 15 cm high, so the top of step 1 is 15 cm above the ground, the top of step 2 is 30 cm above it, and so on.

(a) Write the heights of the tops of steps 1, 2, 3 as an AP and find `$a$` and `$d$`.
(b) How high above the ground is the top of the 30th step?
(c) A pilgrim rests when above 3 m from the ground. Which is the first step whose top is higher than 3 m?
(d) The sum of the heights of the tops of all 30 steps is used to cost the railings. Find it.

<details>
<summary>Answer</summary>

(a) 15, 30, 45, …: `$a = 15$` cm, `$d = 15$` cm.

(b) `$a_{30} = 15 + 29 \times 15 = 450$` cm = 4.5 m.

(c) `$15n > 300$` gives `$n > 20$`; step 20 is exactly 300 cm = 3 m, so the first step above 3 m is the **21st** step (315 cm).

(d) `$S_{30} = 15(15 + 450) = 15 \times 465 = 6975$` cm.

</details>

## Assertion and reason

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

13. **Assertion:** The list 1, 3, 6, 10, 15, … is not an AP. **Reason:** The difference between consecutive terms is not constant.
<details>
<summary>Answer</summary>

(A). The differences are 2, 3, 4, 5: not constant, which is exactly why it is not an AP.

</details>

14. **Assertion:** The sum of the first 100 natural numbers is 5050. **Reason:** For an AP, `$S_n = \dfrac n2(a + l)$`.
<details>
<summary>Answer</summary>

(A). With `$a = 1$`, `$l = 100$`, `$n = 100$`: `$S = 50 \times 101 = 5050$`, using the formula in R.

</details>

15. **Assertion:** If `$a_n = 4n - 1$` then the AP has common difference 4 and first term 4. **Reason:** The first term is found by putting `$n = 1$`.
<details>
<summary>Answer</summary>

(D). `$d = 4$` is right, but `$a_1 = 4(1) - 1 = 3$`, not 4. So A is false, R is true.

</details>

## Try live problems

<div class="problem" data-problem="c10m-ap-term"></div>

<div class="problem" data-problem="c10m-ap-sum"></div>

## More questions

<div class="qbank" data-bank="ncert-class-10-maths" data-topics="arithmetic-progressions" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Find `$a$`, `$d$` and `$n$` first; the formulas do the rest.
- `$a_n = a + (n-1)d$`; `$S_n = \dfrac n2(a + l) = \dfrac n2[2a + (n-1)d]$`.
- Two terms give `$d$`: `$a_s - a_p = (s-p)d$`.
- If `$n$` is not a positive whole number, the number is not a term, or the count does not work.
- Three numbers are in AP when the middle one is the average of the other two.
- `$a_n = S_n - S_{n-1}$`, and the sum of the first `$n$` odd numbers is `$n^2$`.

</div>
