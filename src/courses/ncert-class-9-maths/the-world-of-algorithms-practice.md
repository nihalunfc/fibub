---
title: 'The World of Algorithms: practice questions'
seoTitle: 'Algorithms Class 9 questions with answers'
summary: 'Class 9 Algorithms practice: flowcharts, Euclid’s HCF, linear and binary search, bubble and selection sort and counting steps, with all question types.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'The HCF of 45 and 30 by Euclid’s algorithm is:'
    choices: ['15', '30', '5', '3']
    ans: 0
    why: '45 = 1 × 30 + 15; 30 = 2 × 15 + 0. The last divisor is 15.'
  - q: 'Binary search can be used only on a list that is:'
    choices: ['sorted', 'short', 'of even numbers', 'of different lengths']
    ans: 0
    why: 'It uses the middle item to decide which half to throw away, which only makes sense when the list is in order.'
  - q: 'A flowchart sets S = 0, i = 1 and repeats S = S + i, i = i + 1 while i ≤ 3. The final S is:'
    choices: ['6', '3', '9', '0']
    ans: 0
    why: '1 + 2 + 3 = 6.'
sources:
  - 'CBSE Class 9 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 9 Maths · Chapter 11.** Read the lesson, [The World of Algorithms](/learn/courses/ncert-class-9-maths/the-world-of-algorithms/), first. Try each question on paper before you open the answer.

<div class="bigidea">For an algorithm question, run it on a small example and write the values after each step. For Euclid, write every division. For search and sort, show the list after each step.</div>

## How to set out answers

1. For Euclid’s algorithm, write each line as a = q × b + r, until r = 0, and underline the last divisor.
2. For a flowchart, make a table of the variables after each loop.
3. For search, write the guess and the part of the list that is left.
4. For sorting, write the list after each pass or round.

## 1-mark questions

1. Name the flowchart shape used for a yes/no question.
<details><summary>Answer</summary>A diamond.</details>

2. What must be true about a list before binary search can be used?
<details><summary>Answer</summary>It must be sorted.</details>

3. Find the HCF of 24 and 16.
<details><summary>Answer</summary>24 = 1 × 16 + 8; 16 = 2 × 8 + 0. The HCF is 8.</details>

4. How many guesses are enough for binary search on a sorted list of 7 items?
<details><summary>Answer</summary>3 (7 → 3 → 1 → 0).</details>

## 2-mark and 3-mark questions

5. Write one reason why “Add something to the flour until it tastes right” is not a good algorithm. *(2 marks)*
<details><summary>Answer</summary>The step is not clear: “something” and “tastes right” have no exact meaning, so different people would do different things. A good algorithm has clear, exact steps.</details>

6. Use Euclid’s algorithm to find HCF(84, 36). *(2 marks)*
<details><summary>Answer</summary>84 = 2 × 36 + 12; 36 = 3 × 12 + 0. The HCF is 12.</details>

7. Sort 5, 2, 4, 1 by selection sort, writing the list after each round. *(3 marks)*
<details><summary>Answer</summary>

Round 1: smallest is 1, swap with 5: 1, 2, 4, 5. Round 2: smallest of 2, 4, 5 is 2, already in place: 1, 2, 4, 5. Round 3: smallest of 4, 5 is 4, in place. Sorted: 1, 2, 4, 5.

</details>

8. Do the first pass of bubble sort on 6, 3, 5, 2. *(3 marks)*
<details><summary>Answer</summary>

Compare 6 and 3: swap, 3, 6, 5, 2. Compare 6 and 5: swap, 3, 5, 6, 2. Compare 6 and 2: swap, 3, 5, 2, 6. After one pass the biggest, 6, is at the end.

</details>

9. A flowchart sets S = 0, i = 1. While i ≤ 5 it does S = S + i × i and i = i + 1. Trace it and give the final S. *(3 marks)*
<details><summary>Answer</summary>

i = 1: S = 1. i = 2: S = 5. i = 3: S = 14. i = 4: S = 30. i = 5: S = 55. Then i = 6, the test fails, and S = 55 is printed.

</details>

10. Binary search is used on the sorted list 3, 8, 12, 17, 21, 25, 30 to find 25. Show each guess. *(3 marks)*
<details><summary>Answer</summary>

Middle (4th) is 17: 25 is bigger, keep 21, 25, 30. Middle is 25. Found in 2 guesses.

</details>

## 5-mark questions

11. Use Euclid’s algorithm to find HCF(252, 198) and explain, with the rectangle picture, what the answer means. *(5 marks)*
<details><summary>Answer</summary>

252 = 1 × 198 + 54; 198 = 3 × 54 + 36; 54 = 1 × 36 + 18; 36 = 2 × 18 + 0. The HCF is 18. In the picture, cut squares from a 252 by 198 rectangle: one 198 square, then three 54 squares, one 36 square, two 18 squares. Nothing is left, so a square of side 18 tiles the whole rectangle exactly, and no bigger square can.

</details>

12. Draw a flowchart for “print the larger of two numbers a and b”. *(5 marks)*
<details><summary>Answer</summary>

Oval Start, then a parallelogram Read a, b, then a diamond “a &gt; b ?”. From Yes go to a parallelogram “Print a”; from No go to a parallelogram “Print b”. Both lead to an oval Stop. Test with a = 7, b = 4: the diamond says Yes and 7 is printed.

</details>

13. A sorted list has 1000 names. (a) The most checks linear search needs. (b) The most guesses binary search needs. (c) Why is binary search so much faster? *(5 marks)*
<details><summary>Answer</summary>

(a) 1000 checks. (b) 2¹⁰ = 1024 is more than 1000, so at most 10 guesses. (c) Each guess throws away half of the names that are left, while linear search throws away only one.

</details>

## Case-based question

A school has 8 students lined up in the order of roll numbers 6, 2, 8, 1, 5, 3, 7, 4. The teacher wants them in order of roll number, using bubble sort.

14. (a) What is the order after the first pass? (b) How many swaps are made in the first pass? (c) Why is the student with roll number 8 now at the end? (d) Once the line is sorted, how can the teacher find roll number 5 quickly?
<details><summary>Answer</summary>

(a) 6,2: swap; 6,8: no; 8,1: swap; 8,5: swap; 8,3: swap; 8,7: swap; 8,4: swap. The order is 2, 6, 1, 5, 3, 7, 4, 8. (b) 6 swaps. (c) The biggest number is swapped with every neighbour on its right, so it moves along to the end. (d) Use binary search: look at the middle student, compare, and keep the half that can contain 5.

</details>

## Assertion and reason

15. **Assertion (A):** Binary search on a sorted list of 100 items needs at most 7 guesses. **Reason (R):** Each guess halves the number of items left, and 2⁷ = 128 is more than 100.
<details><summary>Answer</summary>Both true and R explains A.</details>

16. **Assertion (A):** In Euclid’s algorithm the HCF is the last remainder. **Reason (R):** The algorithm ends when the remainder is 0.
<details><summary>Answer</summary>A is false: the last remainder is 0, and the HCF is the last divisor (the last non-zero remainder). R is true.</details>

Choose from the question set below as many as you like. Start with the live problems.

<div class="problem" data-problem="c9m-algo-hcf"></div>

<div class="problem" data-problem="c9m-algo-binary"></div>

<div class="qbank" data-bank="ncert-class-9-maths" data-topics="the-world-of-algorithms" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Euclid: a = q × b + r, repeat with (b, r) until the remainder is 0; the last divisor is the HCF.
- Linear search: up to n checks, any list. Binary search: about log₂ n checks, sorted list only.
- Bubble sort swaps out-of-order neighbours; selection sort places the smallest each round.
- Trace a flowchart with a table; diamonds ask yes/no, a back arrow is a loop.
- Counting steps shows why a better algorithm matters more than a faster computer.

</div>
