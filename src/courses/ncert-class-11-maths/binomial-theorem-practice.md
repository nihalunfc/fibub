---
title: 'Binomial Theorem: practice questions'
seoTitle: 'Binomial Theorem Class 11 questions with answers'
summary: 'Practice for Class 11 Binomial Theorem: expansions, general term, middle term, sums of coefficients and estimates, with 1 to 5 mark and case questions.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'The 4th term of (x + y)^7 is:'
    choices: ['35 x^4 y^3', '35 x^3 y^4', '21 x^4 y^3', '35 x^5 y^2']
    ans: 0
    why: 'T4 uses k = 3: 7C3 x^(7−3) y^3 = 35 x^4 y^3.'
  - q: 'The middle term of (1 + x)^8 has coefficient:'
    choices: ['70', '56', '35', '28']
    ans: 0
    why: 'n = 8 is even, so the middle term is T5 with coefficient 8C4 = 70.'
  - q: 'The constant term in (x + 1/x)^4 is:'
    choices: ['6', '4', '1', '0']
    ans: 0
    why: 'T(k+1) = 4Ck x^(4−2k). The power is 0 when k = 2: 4C2 = 6.'
sources:
  - 'CBSE Class 11 Mathematics question types (mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 7.** Read the lesson, [Binomial Theorem](/learn/courses/ncert-class-11-maths/binomial-theorem/), first. Try each question on paper before you open the answer.

<div class="bigidea">Write the general term first: <code>T(k+1) = nCk · a^(n−k) · b^k</code>. Then simplify the powers, set the power you want and solve for k. Keep signs and constants inside the brackets.</div>

## How to set out answers

1. Name `$a$`, `$b$` and `$n$` (with their signs: for `$(x - 2)^5$`, `$b = -2$`).
2. Write the general term `$T_{k+1}$` and simplify the powers of `$x$`.
3. Solve for `$k$`; if it is not a whole number from 0 to `$n$`, the term does not exist.
4. Put `$k$` back, calculate, and check with a simple value of `$x$` if you expanded fully.

## 1-mark questions

1. How many terms does `$(a + b)^{12}$` have?
<details><summary>Answer</summary>13.</details>

2. Write `$(x + y)^3$` in expanded form.
<details><summary>Answer</summary>`$x^3 + 3x^2y + 3xy^2 + y^3$`.</details>

3. Write the general term of `$(a + b)^n$`.
<details><summary>Answer</summary>`$T_{k+1} = {}^nC_k\,a^{n-k}b^k$`.</details>

4. What is the sum of the coefficients in `$(1 + x)^5$`?
<details><summary>Answer</summary>Put `$x = 1$`: `$2^5 = 32$`.</details>

5. Find the 3rd term of `$(a + b)^5$`.
<details><summary>Answer</summary>`$k = 2$`: `$^5C_2\,a^3b^2 = 10a^3b^2$`.</details>

## 2-mark and 3-mark questions

6. Expand `$(x + 2)^4$`. *(2 marks)*
<details><summary>Answer</summary>

`$x^4 + 4x^3(2) + 6x^2(4) + 4x(8) + 16 = x^4 + 8x^3 + 24x^2 + 32x + 16$`.

</details>

7. Expand `$(2a - b)^3$`. *(2 marks)*
<details><summary>Answer</summary>

`$(2a)^3 - 3(2a)^2 b + 3(2a)b^2 - b^3 = 8a^3 - 12a^2b + 6ab^2 - b^3$`.

</details>

8. Find the coefficient of `$x^3$` in `$(1 + 2x)^6$`. *(3 marks)*
<details><summary>Answer</summary>

`$T_{k+1} = {}^6C_k (2x)^k$`; for `$k = 3$`: `$^6C_3 \cdot 8 = 20 \times 8 = 160$`.

</details>

9. Find the middle term of `$(x + 1/x)^6$`. *(3 marks)*
<details><summary>Answer</summary>

`$n = 6$` is even, so the middle term is `$T_4$` (`$k = 3$`): `$^6C_3\, x^3 (1/x)^3 = 20$`.

</details>

10. Evaluate `$(101)^4$` using the binomial theorem. *(3 marks)*
<details><summary>Answer</summary>

`$(100 + 1)^4 = 100^4 + 4 \cdot 100^3 + 6 \cdot 100^2 + 4 \cdot 100 + 1 = 100000000 + 4000000 + 60000 + 400 + 1 = 104060401$`.

</details>

11. Show that `$9^n - 8n - 1$` is divisible by 64 for every natural number `$n$`. *(3 marks)*
<details><summary>Answer</summary>

`$9^n = (1 + 8)^n = 1 + 8n + {}^nC_2 8^2 + {}^nC_3 8^3 + \cdots$`. So `$9^n - 8n - 1 = 64\,({}^nC_2 + 8\,{}^nC_3 + \cdots)$`, a multiple of 64.

</details>

## 5-mark questions (model answers)

12. Find the term independent of `$x$` in `$\left(2x + \dfrac{1}{3x^2}\right)^9$`. *(5 marks)*
<details><summary>Answer</summary>

`$T_{k+1} = {}^9C_k (2x)^{9-k} \left(\dfrac{1}{3x^2}\right)^k = {}^9C_k\, 2^{9-k}\, 3^{-k}\, x^{9-3k}$`. The power of `$x$` is zero when `$9 - 3k = 0$`, so `$k = 3$`. The term is `$^9C_3 \cdot 2^6 \cdot 3^{-3} = 84 \times 64 / 27 = 5376/27 = 1792/9$`.

</details>

13. In the expansion of `$(1 + x)^{n}$` the coefficients of the 5th, 6th and 7th terms are in arithmetic progression. Find the values of `$n$`. *(5 marks)*
<details><summary>Answer</summary>

The coefficients are `$^nC_4$`, `$^nC_5$`, `$^nC_6$`. AP means `$2\,{}^nC_5 = {}^nC_4 + {}^nC_6$`. Divide by `$^nC_5$`: `$2 = \dfrac{5}{n-4} + \dfrac{n-5}{6}$`. Multiply by `$6(n-4)$`: `$12(n-4) = 30 + (n-5)(n-4)$`, so `$12n - 48 = 30 + n^2 - 9n + 20$`, i.e. `$n^2 - 21n + 98 = 0$`, `$(n-7)(n-14) = 0$`. So `$n = 7$` or `$n = 14$`.

</details>

## Case-based question

A savings scheme in a village bank adds 2% interest to the balance each year (compound interest). Meena deposits ₹10,000. After `$n$` years the balance is `$10000\,(1.02)^n$`.

14. (a) Write `$(1.02)^5$` as `$(1 + 0.02)^5$` and expand the first three terms. (b) Estimate the balance after 5 years from your terms. (c) What is the number of terms in the full expansion? (d) Is the estimate slightly more or less than the exact value?
<details><summary>Answer</summary>

(a) `$1 + 5(0.02) + 10(0.02)^2 = 1 + 0.1 + 0.004 = 1.104$`.

(b) `$10000 \times 1.104 = ₹11{,}040$` (the exact value is about ₹11,040.81).

(c) 6 terms.

(d) Slightly less, because the dropped terms are all positive.

</details>

## Assertion and reason

15. **Assertion (A):** The number of terms in the expansion of `$(a + b)^{10}$` is 11. **Reason (R):** The expansion has terms for `$k = 0, 1, \dots, 10$`. Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.
<details><summary>Answer</summary>(a).</details>

16. **Assertion (A):** `$(x + y)^2 = x^2 + y^2$` for all `$x, y$`. **Reason (R):** `$(x + y)^2 = x^2 + 2xy + y^2$`. Same options.
<details><summary>Answer</summary>(d). A is false (for example `$x = y = 1$` gives 4 on the left and 2 on the right) and R is the correct expansion.</details>

## Live problems

<div class="problem" data-problem="c11m-binom-general"></div>

<div class="problem" data-problem="c11m-binom-approx"></div>

## Question set

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="binomial-theorem" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- `$T_{k+1} = {}^nC_k\,a^{n-k}b^k$`; the 5th term uses `$k = 4$`.
- Set the power of `$x$` equal to what you want and solve for `$k$`.
- Middle term: one if `$n$` is even, two if `$n$` is odd.
- Sum of the coefficients of `$(1 + x)^n$` is `$2^n$`; use `$x = 1$` and `$x = -1$` for sums.

</div>
