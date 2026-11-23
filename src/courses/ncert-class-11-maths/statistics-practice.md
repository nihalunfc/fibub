---
title: 'Statistics: practice questions'
seoTitle: 'Statistics Class 11 questions with answers'
summary: 'Practice for Class 11 Statistics: range, mean deviation, variance, SD, grouped data and coefficient of variation, with 1 to 5 mark and case questions.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'The variance of 2, 4, 6, 8 (dividing by n) is:'
    choices: ['5', '20', '2.24', '4']
    ans: 0
    why: 'Mean 5; squared deviations 9, 1, 1, 9 add to 20; divide by n = 4 to get 5. The SD is √5 ≈ 2.24.'
  - q: 'If the variance of a data set is 16, the standard deviation is:'
    choices: ['4', '8', '256', '16']
    ans: 0
    why: 'The standard deviation is the positive square root of the variance: √16 = 4.'
  - q: 'The mean of 10 observations is 12 and Σx² = 1500. The variance is:'
    choices: ['6', '138', '144', '12']
    ans: 0
    why: 'σ² = Σx²/n − mean² = 150 − 144 = 6.'
sources:
  - 'CBSE Class 11 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 13.** Read the lesson, [Statistics](/learn/courses/ncert-class-11-maths/statistics/), first. Try each question on paper before you open the answer.

<div class="bigidea">Lay out your working as a table: one column for x, one for the deviation x − mean, one for the squared deviation (and one for f if there are frequencies). Add each column once, then divide by n. A table keeps every sign and square in view.</div>

## How to set out answers

1. Find the mean first and write it down.
2. Make a table with columns for `$x$` (or class mark), `$f$`, `$|x - \bar x|$` or `$(x - \bar x)^2$`.
3. Use `$n = \sum f$` as the divisor in this chapter.
4. State the unit of your answer. The variance has the squared unit; the standard deviation has the data's unit.

## 1-mark questions

1. Find the range of 12, 7, 19, 4, 15.
<details><summary>Answer</summary>

`$19 - 4 = 15$`.

</details>

2. What is the sum of the deviations of the observations from their mean?
<details><summary>Answer</summary>Always 0.</details>

3. The variance of a data set is 25. What is its standard deviation?
<details><summary>Answer</summary>

`$5$`.

</details>

4. Find the class mark of the class 30–40.
<details><summary>Answer</summary>

`$35$`.

</details>

5. Which is a measure of dispersion: mean, median, mode or standard deviation?
<details><summary>Answer</summary>The standard deviation.</details>

<div class="problem" data-problem="c11m-stat-md"></div>

## 2-mark and 3-mark questions

6. Find the mean deviation about the mean of 4, 7, 9, 12, 13, 17. *(3 marks)*
<details><summary>Answer</summary>

Mean `$= 62/6 \approx 10.33$`. Absolute deviations: `$6.33, 3.33, 1.33, 1.67, 2.67, 6.67$`, sum `$22$`. MD `$= 22/6 \approx 3.67$`.

</details>

7. Find the variance and standard deviation of 5, 7, 9, 11, 13. *(3 marks)*
<details><summary>Answer</summary>

Mean 9. Squared deviations: `$16, 4, 0, 4, 16$`, sum 40. Variance `$= 40/5 = 8$`, SD `$= \sqrt8 \approx 2.83$`.

</details>

8. The mean of 8 observations is 15 and `$\sum x^2 = 1960$`. Find the variance. *(2 marks)*
<details><summary>Answer</summary>

`$\sigma^2 = \dfrac{1960}{8} - 15^2 = 245 - 225 = 20$`.

</details>

9. The SD of a set is 6. Each value is multiplied by 5 and then 3 is added. Find the new SD and the new variance. *(2 marks)*
<details><summary>Answer</summary>

New SD `$= 5 \times 6 = 30$` (adding 3 changes nothing). New variance `$= 30^2 = 900$`.

</details>

10. Find the mean and SD of the data: x = 2, 4, 6 with frequencies f = 3, 5, 2. *(3 marks)*
<details><summary>Answer</summary>

`$n = 10$`. `$\sum fx = 6 + 20 + 12 = 38$`, mean `$= 3.8$`.

`$\sum fx^2 = 12 + 80 + 72 = 164$`, variance `$= 16.4 - 14.44 = 1.96$`, SD `$= 1.4$`.

</details>

<div class="problem" data-problem="c11m-stat-var"></div>

11. Two series have: A mean 80, SD 12; B mean 50, SD 9. Which is more consistent? *(2 marks)*
<details><summary>Answer</summary>

CV of A `$= 12/80 \times 100 = 15\%$`; CV of B `$= 9/50 \times 100 = 18\%$`. A has the smaller CV, so A is more consistent.

</details>

12. The mean of five numbers is 6. Four of them are 4, 5, 6, 9. Find the fifth number and the variance. *(3 marks)*
<details><summary>Answer</summary>

The sum is `$5 \times 6 = 30$`, so the fifth number is `$30 - 24 = 6$`.

Deviations from 6: `$-2, -1, 0, 3, 0$`. Squares: `$4, 1, 0, 9, 0$`, sum 14. Variance `$= 14/5 = 2.8$`.

</details>

## 5-mark questions

13. Find the mean and the variance for the following grouped data. *(5 marks)*

| Class | 0–10 | 10–20 | 20–30 | 30–40 |
|---|---|---|---|---|
| Frequency | 5 | 8 | 12 | 5 |

<details><summary>Answer</summary>

Class marks `$x$`: 5, 15, 25, 35. `$n = 30$`. `$\sum fx = 25 + 120 + 300 + 175 = 620$`, mean `$= 20.67$`.

Use `$A = 25$`, `$h = 10$`, `$y = (x - 25)/10 = -2, -1, 0, 1$`. `$\sum fy = -10 - 8 + 0 + 5 = -13$`; `$\sum fy^2 = 20 + 8 + 0 + 5 = 33$`.

Mean `$= 25 + 10(-13/30) = 20.67$` ✓. Variance `$= 100\left[\dfrac{33}{30} - \left(\dfrac{13}{30}\right)^2\right] = 100(1.1 - 0.1878) = 91.22$`. SD `$\approx 9.55$`.

</details>

14. Prove that `$\sigma^2 = \dfrac{\sum x_i^2}{n} - \bar x^2$`. *(5 marks)*
<details><summary>Answer</summary>

Start from `$\sigma^2 = \dfrac{1}{n}\sum (x_i - \bar x)^2$`.

Expand the square: `$\dfrac1n\sum\left(x_i^2 - 2\bar x x_i + \bar x^2\right) = \dfrac{\sum x_i^2}{n} - 2\bar x\dfrac{\sum x_i}{n} + \bar x^2$`.

Since `$\dfrac{\sum x_i}{n} = \bar x$`, this is `$\dfrac{\sum x_i^2}{n} - 2\bar x^2 + \bar x^2 = \dfrac{\sum x_i^2}{n} - \bar x^2$`.

</details>

15. Show that if each observation is changed to `$y_i = ax_i + b$`, then `$\sigma_y = |a|\sigma_x$`. *(5 marks)*
<details><summary>Answer</summary>

The new mean is `$\bar y = a\bar x + b$`. So `$y_i - \bar y = a(x_i - \bar x)$`: the constant `$b$` cancels.

Then `$\sigma_y^2 = \dfrac1n\sum a^2(x_i - \bar x)^2 = a^2\sigma_x^2$`, so `$\sigma_y = |a|\sigma_x$`.

</details>

<div class="problem" data-problem="c11m-stat-shift"></div>

## Case-based question

A coach records the runs of two openers over 8 innings. Rohan: 20, 25, 30, 35, 40, 45, 50, 55. Sameer: 5, 10, 35, 40, 40, 45, 80, 85.

(a) Find the mean of each.
<details><summary>Answer</summary>

Rohan: `$300/8 = 37.5$`. Sameer: `$340/8 = 42.5$`.

</details>

(b) Find the standard deviation of Rohan (to 2 decimal places).
<details><summary>Answer</summary>

Deviations: `$-17.5, -12.5, -7.5, -2.5, 2.5, 7.5, 12.5, 17.5$`. Squares sum `$= 2(306.25 + 156.25 + 56.25 + 6.25) = 1050$`; variance `$= 131.25$`; SD `$\approx 11.46$`.

</details>

(c) Sameer's SD works out to about 26.8. Find both coefficients of variation.
<details><summary>Answer</summary>

Rohan `$11.46/37.5 \times 100 \approx 30.6\%$`. Sameer `$26.8/42.5 \times 100 \approx 63.1\%$`.

</details>

(d) Who is more consistent, and who has the better average?
<details><summary>Answer</summary>Rohan is more consistent (smaller CV). Sameer has the higher average, but with far more ups and downs.</details>

## Assertion and reason

Options: (A) Both A and R are true and R explains A. (B) Both true but R does not explain A. (C) A is true, R is false. (D) A is false, R is true.

16. **Assertion:** The standard deviation is never negative. **Reason:** It is defined as the positive square root of the variance.
<details><summary>Answer</summary>(A). Both are true and R explains A.</details>

17. **Assertion:** Two data sets with the same mean have the same standard deviation. **Reason:** The mean measures the centre of the data, not its spread.
<details><summary>Answer</summary>

(D). A is false: `$4, 6$` and `$0, 10$` both have mean 5 but SDs 1 and 5. R is true.

</details>

18. **Assertion:** Adding 10 to every observation does not change the standard deviation. **Reason:** All deviations from the mean are unchanged when every value shifts by the same amount.
<details><summary>Answer</summary>

(A). Both true; the mean also moves by 10, so each deviation `$x - \bar x$` stays the same.

</details>

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="statistics" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Always find the mean first, then deviations; divide by `$n = \sum f$`.
- `$\sigma^2 = \sum fx^2/n - \bar x^2$` saves time; the SD is its square root.
- Step deviation: `$y = (x - A)/h$`, then `$\bar x = A + h\sum fy/n$`.
- Shift changes only the mean; scaling by `$a$` multiplies the SD by `$|a|$` and the variance by `$a^2$`.
- Compare consistency with CV `$= \sigma/\bar x \times 100$`: smaller is more consistent.

</div>
