---
title: 'Probability: practice questions'
seoTitle: 'Probability Class 10 questions with answers'
summary: 'Board-style practice for Class 10 Probability: coins, dice, cards, marbles and spinners, 1 to 5 mark questions, a case study and assertion-reason, with answers.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'A bag has 3 red and 7 blue marbles. P(blue) is:'
    choices: ['7/10', '3/10', '7/3', '1/2']
    ans: 0
    why: 'There are 7 favourable marbles out of 10 equally likely marbles, so P(blue) = 7/10.'
  - q: 'The probability of an event that cannot happen is:'
    choices: ['0', '1', '1/2', 'it depends']
    ans: 0
    why: 'An impossible event has no favourable outcomes, so its probability is 0.'
  - q: 'A card is drawn from a pack of 52. P(a black queen) is:'
    choices: ['1/26', '1/13', '1/52', '2/13']
    ans: 0
    why: 'There are 2 black queens (spades and clubs): 2/52 = 1/26.'
sources:
  - 'CBSE Class 10 Mathematics (Standard) question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 10 Maths · Chapter 14.** Read the chapter lesson, [Probability](/learn/courses/ncert-class-10-maths/probability/), first. Try each question on paper before you open the answer.

<div class="bigidea">Every question is: list or count the equally likely outcomes, count the favourable ones, divide. When the event sounds like “at least” or “not”, try the complement.</div>

## How to set out an answer

1. Say what the experiment is and how many equally likely outcomes there are in total.
2. Name the event and list or count the favourable outcomes.
3. Write `$P(E) = \dfrac{\text{favourable}}{\text{total}}$` and reduce the fraction.
4. Check that the answer lies between 0 and 1.
5. For “not E” or “at least one”, use `$1 - P$`.

## 1-mark questions

1. What is the probability of an event that is certain to happen?
<details>
<summary>Answer</summary>

1.

</details>

2. A fair die is thrown once. Find the probability of a number greater than 4.
<details>
<summary>Answer</summary>

The favourable numbers are 5 and 6, so `$P = \dfrac{2}{6} = \dfrac13$`.

</details>

3. If `$P(E) = 0.62$`, find `$P(\text{not } E)$`.
<details>
<summary>Answer</summary>

`$1 - 0.62 = 0.38$`.

</details>

4. How many outcomes are there when two dice are thrown together?
<details>
<summary>Answer</summary>

6 × 6 = 36.

</details>

5. Can the probability of an event be 1.2? Why?
<details>
<summary>Answer</summary>

No. A probability is favourable ÷ total, and favourable can never exceed the total, so it lies between 0 and 1.

</details>

## 2-mark and 3-mark questions

6. A bag has 4 red, 6 white and 5 green marbles. One is drawn at random. Find the probability that it is (i) white, (ii) not green. *(2 marks)*
<details>
<summary>Answer</summary>

Total = 15. (i) `$P(\text{white}) = \dfrac{6}{15} = \dfrac25$`. (ii) Not green means 4 + 6 = 10 marbles: `$P = \dfrac{10}{15} = \dfrac23$`.

</details>

7. Two coins are tossed together. Find the probability of getting at least one tail. *(2 marks)*
<details>
<summary>Answer</summary>

The outcomes are HH, HT, TH, TT. Only HH has no tail, so 3 outcomes are favourable: `$P = \dfrac34$`.

</details>

8. Two dice are thrown. Find the probability that (i) the sum is 9, (ii) the sum is at least 10. *(3 marks)*
<details>
<summary>Answer</summary>

(i) Sum 9: (3,6), (4,5), (5,4), (6,3), so `$P = \dfrac{4}{36} = \dfrac19$`.

(ii) Sum 10: (4,6), (5,5), (6,4); sum 11: (5,6), (6,5); sum 12: (6,6). That is 6 outcomes, `$P = \dfrac{6}{36} = \dfrac16$`.

</details>

9. A card is drawn from a pack of 52. Find the probability that it is (i) a red king, (ii) a black face card. *(2 marks)*
<details>
<summary>Answer</summary>

(i) Red kings: king of hearts and diamonds, `$P = \dfrac{2}{52} = \dfrac{1}{26}$`.

(ii) Black face cards: J, Q, K of spades and of clubs = 6, `$P = \dfrac{6}{52} = \dfrac{3}{26}$`.

</details>

10. A ticket is drawn from tickets numbered 1 to 20. Find the probability that the number is (i) prime, (ii) a multiple of 3. *(3 marks)*
<details>
<summary>Answer</summary>

Total = 20. (i) Primes: 2, 3, 5, 7, 11, 13, 17, 19 = 8, so `$P = \dfrac{8}{20} = \dfrac25$`. (ii) Multiples of 3: 3, 6, 9, 12, 15, 18 = 6, so `$P = \dfrac{6}{20} = \dfrac{3}{10}$`.

</details>

11. A bag has 6 red marbles and some blue marbles. The probability of drawing blue is twice that of drawing red. How many blue marbles are there? *(3 marks)*
<details>
<summary>Answer</summary>

Let there be `$x$` blue marbles. Total = `$6 + x$`. `$P(\text{red}) = \dfrac{6}{6+x}$` and `$P(\text{blue}) = \dfrac{x}{6+x}$`.

`$\dfrac{x}{6+x} = 2 \times \dfrac{6}{6+x}$`, so `$x = 12$`. There are 12 blue marbles.

Check: P(red) = 6/18 = 1/3 and P(blue) = 12/18 = 2/3, which is twice 1/3.

</details>

## 5-mark questions (with model answers)

12. **Two dice are thrown together. Find the probability that (i) the sum is 8, (ii) the product is 12, (iii) both numbers are odd, (iv) the sum is a prime number.** *(5 marks)*
<details>
<summary>Answer</summary>

There are 36 equally likely outcomes.

(i) Sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5, so `$P = \dfrac{5}{36}$`.

(ii) Product 12: (2,6), (3,4), (4,3), (6,2) = 4, so `$P = \dfrac{4}{36} = \dfrac19$`.

(iii) Odd numbers are 1, 3, 5 on each die: 3 × 3 = 9 outcomes, so `$P = \dfrac{9}{36} = \dfrac14$`.

(iv) Prime sums are 2, 3, 5, 7, 11 with 1, 2, 4, 6, 2 ways: 15 outcomes, so `$P = \dfrac{15}{36} = \dfrac{5}{12}$`.

</details>

13. **Three coins are tossed together. Find the probability of getting (i) exactly two heads, (ii) at most one head, (iii) all coins showing the same face.** *(5 marks)*
<details>
<summary>Answer</summary>

The 8 outcomes are HHH, HHT, HTH, HTT, THH, THT, TTH, TTT.

(i) Exactly two heads: HHT, HTH, THH = 3, so `$P = \dfrac38$`.

(ii) At most one head (0 or 1): TTT, HTT, THT, TTH = 4, so `$P = \dfrac48 = \dfrac12$`.

(iii) All the same: HHH and TTT = 2, so `$P = \dfrac28 = \dfrac14$`.

</details>

14. **A box has 90 cards numbered 1 to 90. One card is drawn at random. Find the probability that it is (i) a two-digit number, (ii) a perfect square, (iii) not a multiple of 7.** *(5 marks)*
<details>
<summary>Answer</summary>

Total = 90.

(i) One-digit numbers are 1 to 9 (9 of them), so two-digit numbers number 81: `$P = \dfrac{81}{90} = \dfrac{9}{10}$`.

(ii) Perfect squares up to 90: 1, 4, 9, 16, 25, 36, 49, 64, 81 = 9, so `$P = \dfrac{9}{90} = \dfrac{1}{10}$`.

(iii) Multiples of 7 up to 90: 7 × 1 to 7 × 12 = 12 of them, so P(multiple of 7) = 12/90 = 2/15. Then `$P(\text{not a multiple of 7}) = 1 - \dfrac{2}{15} = \dfrac{13}{15}$`.

</details>

## Case-based question

**The school raffle.** At the annual day, 50 tickets numbered 1 to 50 are put in a drum. One ticket is drawn at random for the first prize.

(a) Find the probability that the number is divisible by 10.
(b) Find the probability that it is a perfect cube.
(c) Find the probability that it is a prime number.
(d) Use your answer to (c) to find the probability that it is not a prime number, and say what rule you used.

<details>
<summary>Answer</summary>

(a) Multiples of 10: 10, 20, 30, 40, 50 = 5, so `$P = \dfrac{5}{50} = \dfrac{1}{10}$`.

(b) Perfect cubes up to 50: 1, 8, 27 = 3, so `$P = \dfrac{3}{50}$`.

(c) Primes up to 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47 = 15, so `$P = \dfrac{15}{50} = \dfrac{3}{10}$`.

(d) `$P(\text{not prime}) = 1 - \dfrac{3}{10} = \dfrac{7}{10}$`, using `$P(\text{not } E) = 1 - P(E)$`.

</details>

## Assertion and reason

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

15. **Assertion:** The probability of getting a sum of 1 when two dice are thrown is 0. **Reason:** The smallest possible sum of two dice is 2.
<details>
<summary>Answer</summary>

(A). A sum of 1 cannot happen, so P = 0, and the reason (smallest sum is 2) explains why.

</details>

16. **Assertion:** A coin shows heads three times in a row, so tails is more likely on the next toss. **Reason:** Each toss of a fair coin is independent of earlier tosses.
<details>
<summary>Answer</summary>

(D). The next toss still has P(tails) = 1/2, so A is false; R is true and explains why.

</details>

17. **Assertion:** For a fair coin, P(head) = 1/2. **Reason:** The sun rises in the east.
<details>
<summary>Answer</summary>

(B). Both statements are true but they have nothing to do with each other.

</details>

18. **Assertion:** `$P(E) + P(\text{not } E) = 1$` for every event E. **Reason:** E and not E together contain every outcome, with none in common.
<details>
<summary>Answer</summary>

(A). Together they use all the equally likely outcomes exactly once.

</details>

## Try live problems

<div class="problem" data-problem="c10m-prob-dice"></div>

<div class="problem" data-problem="c10m-prob-cards"></div>

## More questions

<div class="qbank" data-bank="ncert-class-10-maths" data-topics="probability" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- `$P(E) = \dfrac{\text{favourable}}{\text{total}}$` for equally likely outcomes; always reduce the fraction.
- 0 ≤ P(E) ≤ 1; impossible = 0, certain = 1.
- `$P(\text{not } E) = 1 - P(E)$`: use it for “at least one” and “not” questions.
- Two coins: 4 outcomes; three coins: 8; two dice: 36 (a 6 × 6 grid); a pack: 52 cards.
- Count each outcome once: a king of hearts is both a king and a heart.
- Spinner: P = sector angle ÷ 360°.

</div>
