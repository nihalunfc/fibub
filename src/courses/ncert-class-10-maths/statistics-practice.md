---
title: 'Statistics: practice questions'
seoTitle: 'Statistics Class 10 questions with answers'
summary: 'Board-style practice for Class 10 Statistics: mean, mode and median of grouped data, 1 to 5 mark questions, a case study and assertion-reason, with answers.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'For grouped data, the formula Mode = l + (f1 − f0)/(2f1 − f0 − f2) × h uses f0 for the frequency of:'
    choices: ['the class before the modal class', 'the class after the modal class', 'the modal class itself', 'the first class']
    ans: 0
    why: 'f1 is the modal class, f0 the class just before it and f2 the class just after it.'
  - q: 'If the mean is 20 and the median is 18, the empirical estimate of the mode is:'
    choices: ['14', '16', '22', '19']
    ans: 0
    why: 'Mode ≈ 3 × median − 2 × mean = 54 − 40 = 14.'
  - q: 'In step-deviation, u = (x − a) ÷ h and the mean is:'
    choices: ['a + h × Σfu ÷ Σf', 'a + Σfu ÷ Σf', 'h + a × Σfu ÷ Σf', 'a − h × Σfu ÷ Σf']
    ans: 0
    why: 'Undo the division by h by multiplying the average of u by h, then add back the assumed mean a.'
sources:
  - 'CBSE Class 10 Mathematics (Standard) question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 10 Maths · Chapter 13.** Read the chapter lesson, [Statistics](/learn/courses/ncert-class-10-maths/statistics/), first. Try each question on paper before you open the answer.

<div class="bigidea">Every question here is one of three jobs: build a table (class marks, cumulative frequency), apply the right formula with the right symbols (l, h, f, cf), or interpret the answer in words.</div>

## How to set out an answer

1. Draw the table with columns for the class, f, and whatever you need (x, fx, d, u, cf).
2. Add the totals Σf (= n) and the product column before using a formula.
3. Write the formula, then substitute with the numbers shown, so a slip in arithmetic still earns method marks.
4. For the mode and median, say which class is the modal or median class and why.
5. Give the answer with its unit (marks, rupees, minutes).

## 1-mark questions

1. Find the class mark of the class 35–55.
<details>
<summary>Answer</summary>

(35 + 55) ÷ 2 = 45.

</details>

2. If Σf = 30 and Σfx = 1260, find the mean.
<details>
<summary>Answer</summary>

`$\bar{x} = \dfrac{1260}{30} = 42$`.

</details>

3. The frequencies of the classes 0–10, 10–20, 20–30, 30–40 are 4, 9, 16, 7. Write the modal class.
<details>
<summary>Answer</summary>

The highest frequency, 16, belongs to the class 20–30.

</details>

4. The mean of some data is 36 and its median is 34. Estimate the mode.
<details>
<summary>Answer</summary>

Mode ≈ 3 × median − 2 × mean = 102 − 72 = 30.

</details>

## 2-mark and 3-mark questions

5. A median class is 30–40, with cumulative frequency 22 before it, frequency 14 in it and n = 60. Find the median. *(2 marks)*
<details>
<summary>Answer</summary>

`$n/2 = 30$`. Median `$= 30 + \dfrac{30 - 22}{14} \times 10 = 30 + 5.71 = 35.71$`.

</details>

6. Find the mean of this data by the direct method. Classes 10–20, 20–30, 30–40, 40–50, 50–60 with frequencies 4, 6, 10, 8, 2. *(3 marks)*
<details>
<summary>Answer</summary>

Class marks 15, 25, 35, 45, 55. `$fx$` = 60, 150, 350, 360, 110, so `$\sum fx = 1030$` and `$\sum f = 30$`.

Mean `$= \dfrac{1030}{30} = 34.33$`.

</details>

7. Weekly pocket money (₹) of 50 students: classes 100–150, 150–200, 200–250, 250–300, 300–350 with frequencies 6, 10, 14, 12, 8. Find the mean by the assumed-mean method. *(3 marks)*
<details>
<summary>Answer</summary>

Class marks 125, 175, 225, 275, 325. Take `$a = 225$`: `$d$` = −100, −50, 0, 50, 100 and `$fd$` = −600, −500, 0, 600, 800, so `$\sum fd = 300$`.

Mean `$= 225 + \dfrac{300}{50} = 231$`. The mean pocket money is ₹231.

</details>

8. Find the mode: classes 0–10, 10–20, 20–30, 30–40, 40–50 with frequencies 3, 8, 15, 10, 4. *(3 marks)*
<details>
<summary>Answer</summary>

Modal class 20–30: `$l = 20$`, `$h = 10$`, `$f_1 = 15$`, `$f_0 = 8$`, `$f_2 = 10$`.

Mode `$= 20 + \dfrac{15 - 8}{30 - 8 - 10} \times 10 = 20 + \dfrac{70}{12} = 25.83$`.

</details>

9. The mean of this data is 42. Find the missing frequency p. Classes 0–20, 20–40, 40–60, 60–80, 80–100 with frequencies 8, 10, p, 6, 3. *(3 marks)*
<details>
<summary>Answer</summary>

Class marks 10, 30, 50, 70, 90. `$\sum f = 27 + p$` and `$\sum fx = 80 + 300 + 50p + 420 + 270 = 1070 + 50p$`.

`$\dfrac{1070 + 50p}{27 + p} = 42$`, so `$1070 + 50p = 1134 + 42p$`, giving `$8p = 64$` and `$p = 8$`.

</details>

10. Waiting times (minutes) at a bus stop: classes 0–5, 5–10, 10–15, 15–20, 20–25 with frequencies 4, 10, 18, 12, 6. Find the median. *(3 marks)*
<details>
<summary>Answer</summary>

`$n = 50$`, `$n/2 = 25$`. Cumulative frequencies 4, 14, 32, 44, 50. The median class is 10–15 (first cf at least 25): `$l = 10$`, `$cf = 14$`, `$f = 18$`, `$h = 5$`.

Median `$= 10 + \dfrac{25 - 14}{18} \times 5 = 10 + 3.06 = 13.06$` minutes.

</details>

## 5-mark questions (with model answers)

11. **The marks of 50 students are grouped as: 0–20: 4, 20–40: 11, 40–60: 20, 60–80: 10, 80–100: 5. Find the mean (by step deviation), the median and the mode.** *(5 marks)*
<details>
<summary>Answer</summary>

**Mean.** Class marks 10, 30, 50, 70, 90. Take `$a = 50$`, `$h = 20$`: `$u$` = −2, −1, 0, 1, 2 and `$fu$` = −8, −11, 0, 10, 10, so `$\sum fu = 1$`.

Mean `$= 50 + 20 \times \dfrac{1}{50} = 50.4$`.

**Median.** `$n/2 = 25$`. Cumulative frequencies 4, 15, 35, 45, 50, so the median class is 40–60: `$l = 40$`, `$cf = 15$`, `$f = 20$`, `$h = 20$`. Median `$= 40 + \dfrac{25 - 15}{20} \times 20 = 50$`.

**Mode.** The modal class is 40–60: `$f_1 = 20$`, `$f_0 = 11$`, `$f_2 = 10$`. Mode `$= 40 + \dfrac{20 - 11}{40 - 11 - 10} \times 20 = 40 + \dfrac{180}{19} = 49.47$`.

The three are close, so the marks are nearly symmetric. Check: `$3 \times 50 - 2 \times 50.4 = 49.2$`, near the mode.

</details>

12. **A table gives the number of students scoring “less than” a mark: less than 20: 6, less than 40: 20, less than 60: 42, less than 80: 54, less than 100: 60. Find the median and the mean.** *(5 marks)*
<details>
<summary>Answer</summary>

Subtract to get the frequencies: 0–20: 6, 20–40: 14, 40–60: 22, 60–80: 12, 80–100: 6.

**Median.** `$n = 60$`, `$n/2 = 30$`. The first cumulative frequency at least 30 is 42, so the median class is 40–60 with `$cf = 20$`, `$f = 22$`: Median `$= 40 + \dfrac{30 - 20}{22} \times 20 = 49.09$`.

**Mean.** Class marks 10, 30, 50, 70, 90: `$\sum fx = 60 + 420 + 1100 + 840 + 540 = 2960$`. Mean `$= \dfrac{2960}{60} = 49.33$`.

</details>

13. **For the data 0–20: 6, 20–40: a, 40–60: 20, 60–80: b, 80–100: 8 with total frequency 60, the median is 50. Find a and b.** *(5 marks)*
<details>
<summary>Answer</summary>

`$6 + a + 20 + b + 8 = 60$`, so `$a + b = 26$`.

`$n/2 = 30$`. The median 50 lies in 40–60, so that is the median class, with `$cf = 6 + a$` and `$f = 20$`.

`$50 = 40 + \dfrac{30 - (6 + a)}{20} \times 20 = 40 + 24 - a$`, so `$a = 14$`.

Then `$b = 26 - 14 = 12$`. Check: the cumulative frequencies are 6, 20, 40, ...; 30 is reached in 40–60.

</details>

## Case-based question

**The school canteen.** The canteen manager recorded the number of samosas sold each day for 40 days. Classes 20–30, 30–40, 40–50, 50–60, 60–70 had frequencies 5, 8, 14, 9, 4.

(a) Write the modal class and find the mode.
(b) Find the median number of samosas sold.
(c) Find the mean using the assumed-mean method with a = 45.
(d) On festival days sales were very high. Which average would change most if a few such days were included, and why?

<details>
<summary>Answer</summary>

(a) The highest frequency is 14, so the modal class is 40–50: `$l = 40$`, `$h = 10$`, `$f_1 = 14$`, `$f_0 = 8$`, `$f_2 = 9$`. Mode `$= 40 + \dfrac{14 - 8}{28 - 8 - 9} \times 10 = 40 + \dfrac{60}{11} = 45.45$`.

(b) `$n/2 = 20$`. Cumulative frequencies 5, 13, 27, ... so the median class is 40–50 with `$cf = 13$`: Median `$= 40 + \dfrac{20 - 13}{14} \times 10 = 45$`.

(c) Class marks 25, 35, 45, 55, 65; `$d = x - 45$` = −20, −10, 0, 10, 20; `$fd$` = −100, −80, 0, 90, 80, so `$\sum fd = -10$`. Mean `$= 45 + \dfrac{-10}{40} = 44.75$`.

(d) The mean. It uses every value, so a few very large days pull it upwards. The median and mode depend only on position and frequency and barely move.

</details>

## Assertion and reason

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

14. **Assertion:** The mean of grouped data found by the direct method is the exact mean of the original observations. **Reason:** In grouped data every observation in a class is taken to be equal to the class mark.
<details>
<summary>Answer</summary>

(D). R is true, and it is exactly why A is false: because of that assumption the result is only an estimate.

</details>

15. **Assertion:** The mean by the assumed-mean method does not depend on which value of a is chosen. **Reason:** The formula `$\bar{x} = a + \dfrac{\sum fd}{\sum f}$` corrects the assumed mean by the average deviation.
<details>
<summary>Answer</summary>

(A). Changing a changes every d by the same amount, and the correction term changes in the opposite way, so the mean stays the same. R explains this.

</details>

16. **Assertion:** The modal class is the class with the highest class mark. **Reason:** The mode of grouped data depends on the frequencies of the modal class and its two neighbours.
<details>
<summary>Answer</summary>

(D). The modal class is the one with the highest *frequency*, not class mark, so A is false. R is true.

</details>

## Try live problems

<div class="problem" data-problem="c10m-stat-median"></div>

<div class="problem" data-problem="c10m-stat-mode"></div>

## More questions

<div class="qbank" data-bank="ncert-class-10-maths" data-topics="statistics" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Make a table first: class marks x, then fx (or d, fd, or u, fu), and cumulative frequency for the median.
- Mean: `$\dfrac{\sum fx}{\sum f}$`, or `$a + \dfrac{\sum fd}{\sum f}$`, or `$a + h\dfrac{\sum fu}{\sum f}$`. All three agree.
- Mode: the modal class has the highest frequency; use f₁, f₀ (before) and f₂ (after).
- Median: find n/2, the median class, and use cf of the class *before* it.
- Mode ≈ 3 Median − 2 Mean is only an estimate for mildly skewed data.

</div>
