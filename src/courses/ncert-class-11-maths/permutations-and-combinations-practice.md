---
title: 'Permutations and Combinations: practice questions'
seoTitle: 'Permutations Combinations Class 11 questions'
summary: 'Practice for Class 11 Permutations and Combinations: counting rules, nPr, nCr, repeated letters, conditions and committees, with 1 to 5 mark and case questions.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'The value of 6P2 is:'
    choices: ['30', '15', '12', '36']
    ans: 0
    why: '6P2 = 6 × 5 = 30. (15 is 6C2, which ignores order.)'
  - q: 'How many diagonals does a polygon with 8 sides have?'
    choices: ['20', '28', '16', '8']
    ans: 0
    why: '8C2 − 8 = 28 − 8 = 20 (all pairs of corners minus the 8 sides).'
  - q: 'If nC2 = 45, then n equals:'
    choices: ['10', '9', '11', '12']
    ans: 0
    why: 'n(n−1)/2 = 45 gives n(n−1) = 90 = 10 × 9, so n = 10.'
sources:
  - 'CBSE Class 11 Mathematics question types (mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 6.** Read the lesson, [Permutations and Combinations](/learn/courses/ncert-class-11-maths/permutations-and-combinations/), first. Try each question on paper before you open the answer.

<div class="bigidea">Ask two questions every time. Does order matter (nPr) or not (nCr)? Is there a condition? Handle the condition first, then multiply the choices.</div>

## How to set out answers

1. Say what is being counted and whether order matters.
2. Draw the places as boxes and write the number of choices in each, most restricted place first.
3. Show the multiplication or the formula `$^nP_r$`, `$^nC_r$`, and then the number.
4. Check the size: a selection (nCr) is never larger than the matching arrangement (nPr).

## 1-mark questions

1. Evaluate `$5!$`.
<details><summary>Answer</summary>`$5! = 5 \times 4 \times 3 \times 2 \times 1 = 120$`.</details>

2. Write the value of `$0!$`.
<details><summary>Answer</summary>1.</details>

3. Find `$^8C_2$`.
<details><summary>Answer</summary>`$8 \times 7 / 2 = 28$`.</details>

4. How many 2-digit codes can be formed from the digits 1, 2, 3 if repetition is allowed?
<details><summary>Answer</summary>`$3 \times 3 = 9$`.</details>

5. Which of `$^7P_3$` and `$^7C_3$` is larger?
<details><summary>Answer</summary>`$^7P_3 = 210$` is larger than `$^7C_3 = 35$`; `$^7P_3 = 3! \times {}^7C_3$`.</details>

## 2-mark and 3-mark questions

6. A restaurant has 4 starters, 5 mains and 3 sweets. How many three-course meals (one of each) are there? *(2 marks)*
<details><summary>Answer</summary>`$4 \times 5 \times 3 = 60$` meals (multiplication principle).</details>

7. How many ways can 6 different books be arranged on a shelf? How many if two particular books must be together? *(3 marks)*
<details><summary>Answer</summary>

All: `$6! = 720$`. With two together: block + 4 others = 5 units, `$5! = 120$`, times 2 inside the block: `$240$`.

</details>

8. Find the number of arrangements of the letters of the word MISSISSIPPI. *(3 marks)*
<details><summary>Answer</summary>

11 letters: I four times, S four times, P twice, M once. `$\dfrac{11!}{4!\,4!\,2!} = \dfrac{39916800}{24 \times 24 \times 2} = 34650$`.

</details>

9. If `$^nP_2 = 56$`, find `$n$`. *(2 marks)*
<details><summary>Answer</summary>

`$n(n-1) = 56 = 8 \times 7$`, so `$n = 8$`.

</details>

10. In how many ways can a team of 5 be selected from 9 players, if the captain must be in the team? *(3 marks)*
<details><summary>Answer</summary>

The captain is fixed, so choose the other 4 from 8: `$^8C_4 = 70$`.

</details>

11. A 3-digit number is formed using the digits 0, 1, 2, 3, 4 without repetition. How many are even? *(3 marks)*
<details><summary>Answer</summary>

Case last digit 0: the first two places from the other 4 digits: `$4 \times 3 = 12$`. Case last digit 2 or 4 (2 ways): the first place cannot be 0 or the used digit, so 3 choices, the middle place 3 choices: `$2 \times 3 \times 3 = 18$`. Total `$12 + 18 = 30$`.

</details>

## 5-mark questions (model answers)

12. A committee of 4 is to be chosen from 6 men and 5 women. In how many ways if (a) there is no restriction, (b) it has exactly 2 women, (c) it has at least one woman? *(5 marks)*
<details><summary>Answer</summary>

(a) `$^{11}C_4 = 330$`.

(b) 2 women from 5 and 2 men from 6: `$^5C_2 \times {}^6C_2 = 10 \times 15 = 150$`.

(c) Count the opposite (no woman) and subtract: `$330 - {}^6C_4 = 330 - 15 = 315$`.

</details>

13. Prove that `$^nC_r + {}^nC_{r-1} = {}^{n+1}C_r$` and use it to find `$^{10}C_3 + {}^{10}C_4$`. *(5 marks)*
<details><summary>Answer</summary>

`$^nC_r + {}^nC_{r-1} = \dfrac{n!}{r!(n-r)!} + \dfrac{n!}{(r-1)!(n-r+1)!}$`. Take `$\dfrac{n!}{r!\,(n-r+1)!}$` common: `$\dfrac{n!}{r!(n-r+1)!}\left[(n-r+1) + r\right] = \dfrac{(n+1)\,n!}{r!(n+1-r)!} = {}^{n+1}C_r$`.

So `$^{10}C_3 + {}^{10}C_4 = {}^{11}C_4 = 330$`.

</details>

## Case-based question

A school is organising a quiz. There are 8 students in the final panel: 5 from Class 11 and 3 from Class 12. The teacher must pick a team of 4 and then seat the four in a row for the buzzer round.

14. (a) How many teams of 4 are possible? (b) How many teams have exactly 2 students from Class 12? (c) For one particular team, in how many ways can the four be seated in a row? (d) How many seatings are possible if the team must be chosen first and then seated?
<details><summary>Answer</summary>

(a) `$^8C_4 = 70$`.

(b) `$^3C_2 \times {}^5C_2 = 3 \times 10 = 30$`.

(c) `$4! = 24$`.

(d) `$70 \times 24 = 1680 = {}^8P_4$`.

</details>

## Assertion and reason

15. **Assertion (A):** `$^nC_r = {}^nC_{n-r}$`. **Reason (R):** Choosing `$r$` objects to take is the same as choosing `$n - r$` objects to leave. Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.
<details><summary>Answer</summary>(a). Each selection of r corresponds to exactly one selection of the n − r left out.</details>

16. **Assertion (A):** The number of arrangements of the letters of the word BOOK is 12. **Reason (R):** The number of arrangements of `$n$` objects in which `$p$` are alike is `$n!/p!$`. Same options.
<details><summary>Answer</summary>(a). BOOK has 4 letters with O twice: `$4!/2! = 12$`, which is the rule in R.</details>

## Live problems

<div class="problem" data-problem="c11m-pnc-word"></div>

<div class="problem" data-problem="c11m-pnc-committee"></div>

## Question set

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="permutations-and-combinations" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Multiply for jobs in a row; add for separate options.
- `$^nP_r$` for arrangements, `$^nC_r$` for selections; `$^nP_r = r!\,{}^nC_r$`.
- Identical objects: divide by the factorial of each repeat.
- Conditions first; "at least" is often total minus the opposite.

</div>
