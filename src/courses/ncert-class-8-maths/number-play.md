---
title: Number Play
seoTitle: 'Number Play Class 8 notes: divisibility and patterns'
summary: 'Class 8 Number Play: divisibility tests with reasons, Kaprekar 6174, palindromes, digital roots, casting out nines and magic squares, with live figures.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'Is 7,641 divisible by 9?'
    choices: ['Yes, the digit sum 18 is a multiple of 9', 'No, it is odd', 'Yes, it ends in 1', 'No, 7 + 6 + 4 + 1 = 17']
    ans: 0
    why: '7 + 6 + 4 + 1 = 18, and 18 is a multiple of 9, so 7,641 is divisible by 9 (it is 9 × 849).'
  - q: 'What does Kaprekar''s routine reach for almost every 4-digit number?'
    choices: ['6174', '1089', '9999', '1001']
    ans: 0
    why: 'Take the biggest and smallest arrangement of the digits, subtract, and repeat. You land on 6174 in at most 7 steps, and 6174 gives 6174 again.'
  - q: 'Each row, column and diagonal of a 3 × 3 magic square made from 1 to 9 adds up to:'
    choices: ['15', '9', '18', '45']
    ans: 0
    why: 'The numbers 1 to 9 add to 45. Three rows share that, so each row is 45 ÷ 3 = 15.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 5 “Number Play” (topic list only; all text, figures and questions here are original fibub work)'
  - 'D. R. Kaprekar (1949), the constant 6174; Euclid, Elements Book VII (divisibility); Lo Shu magic square from ancient China; Narayana Pandita, Ganita Kaumudi (1356 CE), magic squares'
---

**Maths · Class 8 · Chapter 5 · about 45 minutes.** By the end you will be able to test a number for divisibility without dividing, explain why the tests work, run Kaprekar's routine, check a multiplication by casting out nines, and build a magic square.

<div class="bigidea">Numbers are full of patterns, and every pattern has a reason. When you write a number as digits, each digit stands for a power of 10. Because 10 is just one more than 9, many tests for 3, 9 and 11 can be done by adding digits. Learn the reason once and you will never need to memorise the rule.</div>

## 1. Patterns in odd and even numbers

Add the first few odd numbers: 1, 1 + 3 = 4, 1 + 3 + 5 = 9, 1 + 3 + 5 + 7 = 16. The totals are 1², 2², 3², 4². The picture shows why: each new odd number is an L-shaped layer of dots that turns a square into the next bigger square.

<figure class="fig" data-fig="c8-play-odds"><figcaption>Slide n. The dots are coloured by layer. The first layer is 1 dot, the next L has 3, then 5, then 7. All n layers always form an n by n square, so the sum of the first n odd numbers is n × n.</figcaption></figure>

<div class="problem" data-problem="c8m-play-odds"></div>

**Three numbers in a row.** Take 7, 8, 9. They add to 24. Try 20, 21, 22: 63. Both are multiples of 3. Why? Call the middle number n. The three numbers are n − 1, n and n + 1, and they add to 3n. So the sum of three consecutive numbers is always 3 × the middle number.

**Odd and even.** Even + even = even, odd + odd = even, and even + odd = odd. A quick check: write an even number as 2k and an odd one as 2k + 1. For example (2k + 1) + (2m + 1) = 2(k + m + 1), which is even.

## 2. Two-digit numbers and their reverse

Write a two-digit number as 10a + b. Its reverse is 10b + a. Add them:

```math
(10a + b) + (10b + a) = 11a + 11b = 11(a + b)
```

So a two-digit number plus its reverse is always a multiple of 11. Check: 47 + 74 = 121 = 11 × 11. Subtract them (a bigger than b) and you get 9(a − b), always a multiple of 9: 83 − 38 = 45 = 9 × 5.

<div class="problem" data-problem="c8m-play-rev"></div>

**Reverse and add until a palindrome.** A **palindrome** reads the same forwards and backwards, like 4884 or 12321. Start with a number, add its reverse, and repeat. Most numbers reach a palindrome fast. Watch 87 do it.

<div class="steps" data-fig="c8-play-reverse">
<div class="step">Pick any number. We start with 87. It is not a palindrome (78 is not 87).</div>
<div class="step">Step 1: add its reverse. 87 + 78 = 165.</div>
<div class="step">Step 2: 165 is not a palindrome. Add its reverse 561. 165 + 561 = 726.</div>
<div class="step">Step 3: 726 + 627 = 1353.</div>
<div class="step">Step 4: 1353 + 3531 = 4884.</div>
<div class="step">4884 reads the same both ways. A palindrome after 4 steps.</div>
</div>

<div class="myth">

**“Every number reaches a palindrome quickly.”** Most do, but 196 has been tried for millions of steps without anyone finding a palindrome, and nobody has proved it never gets there. It is an open question, so be careful before you promise it works for all numbers.

</div>

## 3. Kaprekar's routine and 6174

In 1949 the Indian mathematician D. R. Kaprekar, a schoolteacher from Devlali near Nashik, found a strange routine. Take any 4-digit number whose digits are not all the same. Arrange its digits to make the biggest number and the smallest number (a zero at the front is allowed). Subtract. Repeat with the answer.

<figure class="fig" data-fig="c8-play-kaprekar"><figcaption>Choose a start, then press Step to do one subtraction, or Run to the end. Whatever number you pick (unless all four digits match) the numbers fall into 6174 and stay there.</figcaption></figure>

Try 3524: 5432 − 2345 = 3087. Then 8730 − 0378 = 8352. Then 8532 − 2358 = 6174. And 7641 − 1467 = 6174 again, so 6174 is a trap that keeps catching every number. It takes at most 7 steps.

<div class="problem" data-problem="c8m-play-kap"></div>

For 3-digit numbers the same routine ends at 495. Explore both, and see how many steps each start needs, here:

<!--fig:tool kaprekar-magic-square-->

## 4. Divisibility tests, and why they work

Dividing is slow. A test tells you the answer by looking at digits. Here are the tests with reasons.

| Divisor | Test | Why it works |
|---|---|---|
| 2 | last digit is 0, 2, 4, 6 or 8 | 10 is a multiple of 2 |
| 5 | last digit is 0 or 5 | 10 is a multiple of 5 |
| 10 | last digit is 0 | the number is a multiple of 10 |
| 4 | last two digits form a multiple of 4 | 100 is a multiple of 4 |
| 8 | last three digits form a multiple of 8 | 1000 is a multiple of 8 |
| 3 | digit sum is a multiple of 3 | 10, 100, 1000 are each one more than a multiple of 9 |
| 9 | digit sum is a multiple of 9 | same reason |
| 11 | (sum of digits in 1st, 3rd, ... places) minus (sum in 2nd, 4th, ...) is 0 or a multiple of 11 | 10 is one less than 11, so place values swing +1, −1, +1 ... |

**Why does the 3 and 9 test work?** Take 4728 = 4 × 1000 + 7 × 100 + 2 × 10 + 8. Each of 1000, 100 and 10 is 1 more than a multiple of 9: 1000 = 999 + 1, 100 = 99 + 1, 10 = 9 + 1. So 4728 = (4 × 999 + 7 × 99 + 2 × 9) + (4 + 7 + 2 + 8). The first bracket is always a multiple of 9 (and of 3), so only the digit sum 21 decides. 21 is a multiple of 3 but not of 9, so 4728 is divisible by 3 but not 9.

<figure class="fig" data-fig="c8-play-divide"><figcaption>Choose a number and a test. For 3 and 9 you see the running digit sum, for 11 the digits get + and − signs, for 4 and 5 only the last digits are shaded. The answer is checked against real division.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Digit sum</dt><dd>add all the digits of the number: 4728 → 4 + 7 + 2 + 8 = 21</dd>
<dt>Alternating sum</dt><dd>for 11: start from the right, add, subtract, add, subtract ...: 3509 → 9 − 0 + 5 − 3 = 11, so 3509 is a multiple of 11</dd>
<dt>Why it matters</dt><dd>You can tell whether a bill can be split equally among 3, 4 or 9 people, or whether a fraction cancels, without a calculator.</dd>
</dl>
</div>

<div class="problem" data-problem="c8m-play-div3"></div>

<div class="problem" data-problem="c8m-play-div11"></div>

**Combining tests.** A number divisible by 2 and 3 is divisible by 6. Divisible by 4 and 9 means divisible by 36. But careful: a number divisible by 2 and 4 is not automatically divisible by 8. Only join tests for numbers with no common factor (co-prime), such as 4 and 9 or 3 and 5.

<div class="myth">

**“A number is divisible by 4 if its last digit is divisible by 4.”** No. 14 ends in 4 but 14 ÷ 4 = 3.5. You need the last **two** digits: 14 is not a multiple of 4, but 24 and 36 are.

</div>

Test any number against all the rules at once, and see the true remainders:

<!--fig:tool divisibility-tests-->

## 5. Digital roots and casting out nines

The **digital root** of a number is what you get by adding its digits again and again until one digit is left. For 7,894: 7 + 8 + 9 + 4 = 28, then 2 + 8 = 10, then 1 + 0 = 1. The digital root is 1. It is the same as the remainder when you divide by 9 (with 9 used when the remainder is 0), which is why the 9-rule works.

<div class="problem" data-problem="c8m-play-root"></div>

**Casting out nines** is a quick way to check a multiplication. If a × b = P then the digital root of a × b must match the digital root of P. Example: 347 × 26 = 9022. Roots: 347 → 14 → 5, 26 → 8, so 5 × 8 = 40 → 4. And 9022 → 13 → 4. They match, so the answer passes.

<figure class="fig" data-fig="c8-play-digroot"><figcaption>Choose a and b. The three circles show the digital roots. Switch the answer to "off by 1" and the check fails; switch it to "off by 9" and the check wrongly passes.</figcaption></figure>

<div class="myth">

**“If the digital roots match, the answer is right.”** Not always. The check only catches mistakes that change the digital root. If two digits are swapped (1,081 written as 1,801) or the answer is off by 9, the check still passes. It is a quick filter, not a proof.

</div>

## 6. Magic squares

A **magic square** is a grid of different numbers where every row, every column and both diagonals add to the same number, the **magic constant**. In a 3 × 3 square using 1 to 9, the numbers add to 45, and three rows share it, so the constant is 45 ÷ 3 = 15. For an n × n square using 1 to n² it is n(n² + 1) ÷ 2.

<figure class="fig" data-fig="c8-play-magic"><figcaption>Tap one number and then another to swap them. The coloured numbers are the sums of each row, column and diagonal: green means 15. Can you make all eight green?</figcaption></figure>

**Why the centre is 5.** The middle number belongs to four lines (a row, a column and both diagonals), each adding to 15. Those four lines together count every number once, plus the centre three extra times: 4 × 15 = 60 = 45 + 3 × centre, so the centre is 5.

<div class="history">

<ul class="timeline">
<li><b>about 650 BCE</b> The Lo Shu 3 × 3 magic square appears in Chinese legend, said to be written on a turtle's shell.</li>
<li><b>about 1356 CE</b> Narayana Pandita of India writes about magic squares of every size in his Ganita Kaumudi.</li>
<li><b>1949</b> D. R. Kaprekar publishes his constant 6174 in Devlali, Maharashtra.</li>
</ul>

</div>

<div class="problem" data-problem="c8m-play-magic"></div>

Go further with prime factors, remainders and more number puzzles in the [Number theory toolkit](/science/number-theory-toolkit/).

<div class="keypoints">

- The sum of the first n odd numbers is n². Three consecutive numbers add to 3 times the middle one.
- A two-digit number plus its reverse is 11(a + b); the difference is 9(a − b).
- Kaprekar's routine ends at 6174 for 4-digit numbers (not all digits equal) and at 495 for 3-digit ones.
- Tests: 2 and 5 look at the last digit, 4 at the last two digits, 8 at the last three, 3 and 9 at the digit sum, 11 at the alternating sum.
- Combine tests only for co-prime divisors (for example 4 and 9 gives 36).
- A digital root is the remainder on dividing by 9. Casting out nines catches many mistakes but not all.
- A 3 × 3 magic square from 1 to 9 has constant 15 and 5 in the centre.

</div>
