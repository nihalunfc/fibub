---
title: 'Number Play: practice questions'
seoTitle: 'Number Play Class 8 questions with answers'
summary: 'Class 8 Number Play practice: divisibility, Kaprekar, palindromes, digital roots and magic squares with 1 to 5 mark, case-based and assertion-reason questions.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'The smallest digit that makes 52_4 divisible by 3 is:'
    choices: ['1', '0', '2', '3']
    ans: 0
    why: '5 + 2 + 4 = 11. Adding 1 gives 12, a multiple of 3. A 0 gives 11, which is not.'
  - q: 'A two-digit number plus its reverse is always divisible by:'
    choices: ['11', '9', '10', '7']
    ans: 0
    why: '(10a + b) + (10b + a) = 11(a + b).'
  - q: 'The digital root of 98,765 is:'
    choices: ['8', '5', '9', '7']
    ans: 0
    why: '9 + 8 + 7 + 6 + 5 = 35 and 3 + 5 = 8.'
sources:
  - 'CBSE-style Class 8 question pattern (mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 8 Maths · Chapter 5.** Read the lesson, [Number Play](/learn/courses/ncert-class-8-maths/number-play/), first. Try each question on paper before you open the answer.

<div class="bigidea">Look at the digits. Ask which test fits (last digit, last two digits, digit sum, alternating sum) and say why it works in one sentence. A reason earns more marks than the answer alone.</div>

## How to set out answers

1. Name the test you are using, for example "the digit-sum test for 3".
2. Do the working in a line: 7 + 6 + 4 + 1 = 18.
3. Say the conclusion in words: "18 is a multiple of 9, so 7,641 is divisible by 9."
4. For patterns, write the number in the form 10a + b and show the algebra.

## 1-mark questions

1. Write the divisibility test for 5.
<details><summary>Answer</summary>A number is divisible by 5 if its last digit is 0 or 5.</details>

2. What is the digital root of 5,432?
<details><summary>Answer</summary>5 + 4 + 3 + 2 = 14 and 1 + 4 = 5, so the root is 5.</details>

3. Is 1,331 a palindrome?
<details><summary>Answer</summary>Yes, it reads the same forwards and backwards.</details>

4. What is Kaprekar's constant for 4-digit numbers?
<details><summary>Answer</summary>6174.</details>

## 2-mark and 3-mark questions

5. Without dividing, say whether 3,168 is divisible by 4. *(2 marks)*
<details><summary>Answer</summary>The last two digits form 68. Since 68 ÷ 4 = 17, 3,168 is divisible by 4.</details>

6. Do one Kaprekar step on 2,589. *(2 marks)*
<details><summary>Answer</summary>The biggest arrangement is 9852 and the smallest is 2589. 9852 − 2589 = 7263.</details>

7. Show that 52 + 25 is a multiple of 11. *(2 marks)*
<details><summary>Answer</summary>52 + 25 = 77 = 11 × 7.</details>

8. Is 4,719 divisible by 11? Show the alternating sum. *(3 marks)*
<details><summary>Answer</summary>From the right: 9 − 1 + 7 − 4 = 11. This is a multiple of 11, so 4,719 is divisible by 11 (4,719 = 11 × 429).</details>

9. Find the digit x so that 6x2 is divisible by 9. *(3 marks)*
<details><summary>Answer</summary>The digit sum 6 + x + 2 = 8 + x must be a multiple of 9. So x = 1, giving 612 = 9 × 68.</details>

Fresh numbers every time:

<div class="problem" data-problem="c8m-play-div3"></div>

<div class="problem" data-problem="c8m-play-root"></div>

## 5-mark questions

10. Prove that the sum of a two-digit number and its reverse is always a multiple of 11. Check with 68. *(5 marks)*
<details><summary>Answer</summary>

Let the number be 10a + b. Its reverse is 10b + a. The sum is (10a + b) + (10b + a) = 11a + 11b = 11(a + b), a multiple of 11. Check: 68 + 86 = 154 = 11 × 14, and a + b = 14. ✓

</details>

11. (a) Do reverse and add on 68 until you get a palindrome. (b) Why does a 3 × 3 magic square of 1 to 9 have 15 as its constant? (c) Why must 5 be in the centre? *(5 marks)*
<details><summary>Answer</summary>

(a) 68 + 86 = 154; 154 + 451 = 605; 605 + 506 = 1111, a palindrome after 3 steps.

(b) 1 + 2 + ... + 9 = 45, and the three rows use every number once, so each row is 45 ÷ 3 = 15.

(c) The four lines through the centre (row, column, two diagonals) add to 4 × 15 = 60. They contain every number once and the centre three extra times, so 45 + 3 × centre = 60, giving centre = 5.

</details>

## Case-based question

**Ria's number game.** Ria's father writes the number 4,728 on the board. Ria says, "I can tell you some things about it without dividing."

(a) Is 4,728 divisible by 3? Give the test. *(1)*
<details><summary>Answer</summary>The digit sum is 4 + 7 + 2 + 8 = 21, which is a multiple of 3. Yes.</details>

(b) Is it divisible by 9? *(1)*
<details><summary>Answer</summary>21 is not a multiple of 9, so no.</details>

(c) Is it divisible by 8? Use the last three digits. *(1)*
<details><summary>Answer</summary>The last three digits are 728 and 728 ÷ 8 = 91. Yes.</details>

(d) So 4,728 is divisible by 24. Why? *(1)*
<details><summary>Answer</summary>24 = 3 × 8 and 3 and 8 have no common factor. A number divisible by both is divisible by their product.</details>

## Assertion and reason

Options: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

12. **A:** 7,641 is divisible by 3. **R:** The sum of the digits of 7,641 is 18, a multiple of 3.
<details><summary>Answer</summary>(A). Both are true and the digit-sum rule is the reason.</details>

13. **A:** Starting with 8,888 Kaprekar's routine reaches 6174. **R:** All four digits of 8,888 are the same.
<details><summary>Answer</summary>(D). A is false: 8,888 − 8,888 = 0. R is true, and is the reason A fails.</details>

14. **A:** If 31 × 42 is calculated as 1,312 the digital-root check shows it is wrong. **R:** The roots 4 × 6 give 6, but 1,312 has root 7.
<details><summary>Answer</summary>(A). Both true. (The correct product is 1,302.)</details>

Pick a fresh set from the question bank:

<div class="qbank" data-bank="ncert-class-8-maths" data-topics="number-play" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Use the test that matches the divisor: last digit, last two or three digits, digit sum, alternating sum.
- Write a two-digit number as 10a + b to prove patterns; a number plus its reverse is 11(a + b).
- Kaprekar: biggest minus smallest arrangement, repeat; 4 digits end at 6174.
- Digital root = remainder on dividing by 9; casting out nines is a check, not a proof.
- 3 × 3 magic square of 1 to 9: constant 15, centre 5.

</div>
