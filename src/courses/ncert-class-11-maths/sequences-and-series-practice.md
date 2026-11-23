---
title: 'Sequences and Series: practice questions'
seoTitle: 'Sequences and Series Class 11 questions with answers'
summary: 'Practice for Class 11 Sequences and Series: AP and GP terms and sums, AM and GM, inserting means and special series, with 1 to 5 mark and case questions.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'The sum of the first 5 terms of the GP 2, 6, 18, ... is:'
    choices: ['242', '162', '80', '486']
    ans: 0
    why: 'a = 2, r = 3, n = 5: S = 2(3^5 − 1)/(3 − 1) = 243 − 1 = 242.'
  - q: 'If the AM of two positive numbers is 13 and their GM is 12, the numbers are:'
    choices: ['8 and 18', '9 and 16', '10 and 16', '12 and 14']
    ans: 0
    why: 'a + b = 26 and ab = 144. Try the pairs of factors of 144: 8 and 18 add to 26, so the numbers are 8 and 18.'
  - q: 'The value of 1² + 2² + 3² + 4² is:'
    choices: ['30', '25', '100', '36']
    ans: 0
    why: '4 × 5 × 9 / 6 = 30, and 1 + 4 + 9 + 16 = 30.'
sources:
  - 'CBSE Class 11 Mathematics question types (mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 8.** Read the lesson, [Sequences and Series](/learn/courses/ncert-class-11-maths/sequences-and-series/), first. Try each question on paper before you open the answer.

<div class="bigidea">First decide what kind of list it is: constant difference (AP) or constant ratio (GP). Write a, d or r, and n. Then use the formula for the nth term or the sum.</div>

## How to set out answers

1. Test the pattern: differences for an AP, ratios for a GP. Write `$a$` and `$d$` (or `$r$`).
2. State the formula you use before you substitute.
3. Substitute with brackets, simplify, and give the answer with units if any.
4. Check small cases by adding the first few terms yourself.

## 1-mark questions

1. Write the next two terms of 2, 6, 18, ...
<details><summary>Answer</summary>It is a GP with `$r = 3$`: 54, 162.</details>

2. What is the common difference of 7, 4, 1, −2, ...?
<details><summary>Answer</summary>`$d = -3$`.</details>

3. Find the GM of 4 and 25.
<details><summary>Answer</summary>`$\sqrt{100} = 10$`.</details>

4. Evaluate `$1 + 2 + 3 + \cdots + 30$`.
<details><summary>Answer</summary>`$30 \times 31/2 = 465$`.</details>

5. If `$S_n = n^2$`, find `$a_3$`.
<details><summary>Answer</summary>`$a_3 = S_3 - S_2 = 9 - 4 = 5$`.</details>

## 2-mark and 3-mark questions

6. Find the 7th term of the GP 5, 10, 20, ... *(2 marks)*
<details><summary>Answer</summary>`$a_7 = 5 \times 2^6 = 320$`.</details>

7. A sequence is defined by `$a_1 = 3$` and `$a_{n+1} = a_n + 4$`. Find `$a_{10}$` and the sum of the first 10 terms. *(3 marks)*
<details><summary>Answer</summary>

It is an AP with `$a = 3$`, `$d = 4$`. `$a_{10} = 3 + 9 \times 4 = 39$`. `$S_{10} = \dfrac{10}{2}(3 + 39) = 210$`.

</details>

8. Find the sum of the first 6 terms of the GP 1, 3, 9, ... *(2 marks)*
<details><summary>Answer</summary>

`$S_6 = \dfrac{3^6 - 1}{3 - 1} = \dfrac{728}{2} = 364$`.

</details>

9. Insert 3 geometric means between 3 and 48. *(3 marks)*
<details><summary>Answer</summary>

There are 5 terms: `$48 = 3r^4$`, so `$r^4 = 16$` and `$r = 2$`. The means are 6, 12, 24. (A negative ratio `$r = -2$` also works: the means would be −6, 12, −24.)

</details>

10. The AM and GM of two positive numbers are 10 and 8. Find the numbers. *(3 marks)*
<details><summary>Answer</summary>

`$a + b = 20$` and `$ab = 64$`. They are the roots of `$t^2 - 20t + 64 = 0$`, that is `$(t - 4)(t - 16) = 0$`. The numbers are 4 and 16.

</details>

11. Find `$1^2 + 2^2 + \cdots + 12^2$`. *(2 marks)*
<details><summary>Answer</summary>

`$\dfrac{12 \times 13 \times 25}{6} = 650$`.

</details>

## 5-mark questions (model answers)

12. Find the sum of the series `$1 \cdot 2 + 2 \cdot 3 + 3 \cdot 4 + \cdots$` to `$n$` terms. *(5 marks)*
<details><summary>Answer</summary>

The k-th term is `$k(k+1) = k^2 + k$`. Sum: `$\sum k^2 + \sum k = \dfrac{n(n+1)(2n+1)}{6} + \dfrac{n(n+1)}{2} = \dfrac{n(n+1)}{6}\left[(2n+1) + 3\right] = \dfrac{n(n+1)(n+2)}{3}$`. Check `$n = 2$`: `$2 + 6 = 8$` and `$2 \cdot 3 \cdot 4/3 = 8$`.

</details>

13. Prove that for two positive numbers `$a, b$`: AM `$\ge$` GM, and state when they are equal. *(5 marks)*
<details><summary>Answer</summary>

`$\dfrac{a+b}{2} - \sqrt{ab} = \dfrac{a + b - 2\sqrt{ab}}{2} = \dfrac{(\sqrt a - \sqrt b)^2}{2}$`. A square is never negative, so AM − GM `$\ge 0$`, that is AM `$\ge$` GM. It equals 0 only when `$\sqrt a = \sqrt b$`, that is `$a = b$`.

</details>

## Case-based question

Anita starts a recurring plan. In month 1 she puts ₹100 in a jar. Each month she puts ₹20 more than the month before. Her brother Ravi puts ₹100 in month 1 and then doubles the amount each month.

14. (a) What does Anita put in month 6? (b) What is her total after 6 months? (c) What does Ravi put in month 6? (d) What is Ravi's total after 6 months?
<details><summary>Answer</summary>

(a) AP with `$a = 100$`, `$d = 20$`: `$a_6 = 100 + 5 \times 20 = 200$`.

(b) `$S_6 = \dfrac{6}{2}(100 + 200) = 900$`.

(c) GP with `$a = 100$`, `$r = 2$`: `$a_6 = 100 \times 2^5 = 3200$`.

(d) `$S_6 = \dfrac{100(2^6 - 1)}{2 - 1} = 6300$`. By month 6 the GP has overtaken the AP many times over.

</details>

## Assertion and reason

15. **Assertion (A):** The sequence 3, 6, 12, 24, ... is a GP. **Reason (R):** The ratio of each term to the one before it is the constant 2. Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.
<details><summary>Answer</summary>(a). A constant ratio is the definition of a GP.</details>

16. **Assertion (A):** For two positive numbers the AM is never less than the GM. **Reason (R):** `$\frac{a+b}{2} - \sqrt{ab} = \frac{(\sqrt a - \sqrt b)^2}{2}$`. Same options.
<details><summary>Answer</summary>(a). The identity in R shows AM − GM is a square divided by 2, so it is at least 0.</details>

## Live problems

<div class="problem" data-problem="c11m-seq-gpsum"></div>

<div class="problem" data-problem="c11m-seq-means"></div>

## Question set

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="sequences-and-series" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- AP: `$a_n = a + (n-1)d$`, `$S_n = \tfrac n2[2a + (n-1)d]$`. GP: `$a_n = ar^{n-1}$`, `$S_n = \tfrac{a(r^n-1)}{r-1}$`.
- `$a_n = S_n - S_{n-1}$`.
- AM `$\ge$` GM; equality when the numbers are equal.
- `$\sum k$`, `$\sum k^2$`, `$\sum k^3$` formulas and splitting a term into these pieces.

</div>
