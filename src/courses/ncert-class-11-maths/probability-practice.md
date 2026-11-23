---
title: 'Probability: practice questions'
seoTitle: 'Probability Class 11 questions with answers'
summary: 'Practice for Class 11 Probability: sample space, events, addition rule, complements and axioms, with 1 to 5 mark, case-based and assertion-reason questions.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'Two dice are thrown. The probability that the sum is 5 is:'
    choices: ['1/9', '1/6', '5/36', '1/12']
    ans: 0
    why: 'The pairs are (1,4), (2,3), (3,2), (4,1): 4 outcomes out of 36, so 4/36 = 1/9.'
  - q: 'If P(A) = 0.6, then P(not A) is:'
    choices: ['0.4', '0.6', '1.6', '0']
    ans: 0
    why: 'P(A′) = 1 − P(A) = 0.4.'
  - q: 'A, B are mutually exclusive with P(A) = 0.25 and P(B) = 0.35. Then P(A or B) is:'
    choices: ['0.6', '0.1', '0.0875', '0.4']
    ans: 0
    why: 'For mutually exclusive events P(A ∪ B) = P(A) + P(B) = 0.25 + 0.35 = 0.6.'
sources:
  - 'CBSE Class 11 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 14.** Read the lesson, [Probability](/learn/courses/ncert-class-11-maths/probability/), first. Try each question on paper before you open the answer.

<div class="bigidea">Write the sample space first (or say how many outcomes it has and why they are equally likely). Then write the event as a set, count it, and divide. If the event is awkward ("at least one", "neither"), count its complement instead.</div>

## How to set out answers

1. State the experiment and write `$S$`, or give `$n(S)$` with a reason that its outcomes are equally likely.
2. Write the event as a set `$E = \{\dots\}$` and give `$n(E)$`.
3. Write `$P(E) = n(E)/n(S)$` and simplify the fraction.
4. For combined events name the rule you use: complement or addition.

## 1-mark questions

1. Write the sample space when a coin is tossed once.
<details><summary>Answer</summary>

`$S = \{H, T\}$`.

</details>

2. A die is thrown once. Write the event "a prime number".
<details><summary>Answer</summary>

`$\{2, 3, 5\}$`.

</details>

3. What is the probability of the impossible event?
<details><summary>Answer</summary>0.</details>

4. If `$P(A) = 0.35$`, find `$P(A')$`.
<details><summary>Answer</summary>

`$1 - 0.35 = 0.65$`.

</details>

5. A card is drawn from a pack of 52. Find the probability that it is a spade.
<details><summary>Answer</summary>

`$\dfrac{13}{52} = \dfrac14$`.

</details>

<div class="problem" data-problem="c11m-prob-dice"></div>

## 2-mark and 3-mark questions

6. Two coins are tossed. Find the probability of getting at least one tail. *(2 marks)*
<details><summary>Answer</summary>

`$S = \{HH, HT, TH, TT\}$`. Only HH has no tail, so `$P = \dfrac34$`.

</details>

7. A die is thrown once. Find the probability of getting an even number or a number greater than 4. *(3 marks)*
<details><summary>Answer</summary>

`$A = \{2, 4, 6\}$`, `$B = \{5, 6\}$`, `$A \cap B = \{6\}$`. So `$P(A \cup B) = \dfrac36 + \dfrac26 - \dfrac16 = \dfrac46 = \dfrac23$`.

</details>

8. A bag has 4 red, 5 blue and 3 green balls. One ball is drawn. Find the probability that it is not green. *(2 marks)*
<details><summary>Answer</summary>

`$P(\text{green}) = \dfrac{3}{12} = \dfrac14$`, so `$P(\text{not green}) = 1 - \dfrac14 = \dfrac34$`.

</details>

9. `$P(A) = 0.5$`, `$P(B) = 0.4$` and `$P(A \cap B) = 0.15$`. Find `$P(A \cup B)$` and the probability that neither happens. *(3 marks)*
<details><summary>Answer</summary>

`$P(A \cup B) = 0.5 + 0.4 - 0.15 = 0.75$`. `$P(\text{neither}) = 1 - 0.75 = 0.25$`.

</details>

10. Two dice are thrown. Find the probability that the product of the numbers is 12. *(3 marks)*
<details><summary>Answer</summary>

Pairs with product 12: `$(2, 6), (3, 4), (4, 3), (6, 2)$`: 4 outcomes. `$P = \dfrac{4}{36} = \dfrac19$`.

</details>

<div class="problem" data-problem="c11m-prob-cards"></div>

11. Three coins are tossed. Find the probability of exactly one head. *(2 marks)*
<details><summary>Answer</summary>

`$S$` has 8 outcomes. Exactly one head: HTT, THT, TTH. `$P = \dfrac38$`.

</details>

12. Can the following be a probability distribution on `$\{a, b, c, d\}$`: `$0.3, 0.2, 0.4, 0.2$`? Give a reason. *(2 marks)*
<details><summary>Answer</summary>

No. Each number is between 0 and 1, but the total is `$0.3 + 0.2 + 0.4 + 0.2 = 1.1 \ne 1$`, which violates the axiom `$P(S) = 1$`.

</details>

## 5-mark questions

13. A card is drawn from a well-shuffled pack of 52. Find the probability that it is (a) a face card (J, Q, K), (b) a red card or an ace, (c) neither a heart nor a king. *(5 marks)*
<details><summary>Answer</summary>

(a) 12 face cards: `$P = \dfrac{12}{52} = \dfrac{3}{13}$`.

(b) 26 red cards and 4 aces, with 2 red aces in both: `$\dfrac{26 + 4 - 2}{52} = \dfrac{28}{52} = \dfrac{7}{13}$`.

(c) Hearts or kings: `$13 + 4 - 1 = 16$` cards, so neither: `$\dfrac{52 - 16}{52} = \dfrac{36}{52} = \dfrac{9}{13}$`.

</details>

14. Two dice are thrown. Find the probability that (a) the sum is 7 or 11, (b) both dice show the same number, (c) the sum is at least 10. *(5 marks)*
<details><summary>Answer</summary>

(a) Sum 7 has 6 outcomes and sum 11 has 2, and they cannot both occur: `$\dfrac{6 + 2}{36} = \dfrac29$`.

(b) Doubles: `$(1,1), \dots, (6,6)$`, 6 outcomes: `$\dfrac{6}{36} = \dfrac16$`.

(c) Sums 10, 11, 12 have 3, 2, 1 outcomes: `$\dfrac{6}{36} = \dfrac16$`.

</details>

15. Prove that `$P(A \cup B) = P(A) + P(B) - P(A \cap B)$` using the axioms. *(5 marks)*
<details><summary>Answer</summary>

Write `$A \cup B$` as the union of three mutually exclusive events: `$A - B$`, `$A \cap B$` and `$B - A$`.

By the third axiom, `$P(A \cup B) = P(A - B) + P(A \cap B) + P(B - A)$`.

Also `$P(A) = P(A - B) + P(A \cap B)$` and `$P(B) = P(B - A) + P(A \cap B)$`.

Adding the last two: `$P(A) + P(B) = P(A - B) + P(B - A) + 2P(A \cap B)$`.

Subtract `$P(A \cap B)$`: `$P(A) + P(B) - P(A \cap B) = P(A - B) + P(B - A) + P(A \cap B) = P(A \cup B)$`.

</details>

<div class="problem" data-problem="c11m-prob-atleast"></div>

## Case-based question

A school fair has a spinner game with a disc divided into 8 equal sectors numbered 1 to 8. A player spins once. A prize is won if the spinner stops on a multiple of 3 (event A) or on a number greater than 5 (event B).

(a) Write the sample space and events A and B.
<details><summary>Answer</summary>

`$S = \{1, 2, \dots, 8\}$`, `$A = \{3, 6\}$`, `$B = \{6, 7, 8\}$`.

</details>

(b) Find `$P(A)$`, `$P(B)$` and `$P(A \cap B)$`.
<details><summary>Answer</summary>

`$P(A) = 2/8 = 1/4$`, `$P(B) = 3/8$`, `$A \cap B = \{6\}$` so `$P(A \cap B) = 1/8$`.

</details>

(c) Find the probability of winning a prize.
<details><summary>Answer</summary>

`$P(A \cup B) = \dfrac28 + \dfrac38 - \dfrac18 = \dfrac48 = \dfrac12$`. (Check: `$\{3, 6, 7, 8\}$` has 4 outcomes.)

</details>

(d) Are A and B mutually exclusive? Explain.
<details><summary>Answer</summary>

No. They share the outcome 6, so `$A \cap B \ne \varnothing$`.

</details>

## Assertion and reason

Options: (A) Both A and R are true and R explains A. (B) Both true but R does not explain A. (C) A is true, R is false. (D) A is false, R is true.

16. **Assertion:** `$P(E) + P(E') = 1$` for every event `$E$`. **Reason:** `$E$` and `$E'$` are mutually exclusive and together make up `$S$`.
<details><summary>Answer</summary>

(A). Both true; the reason, with the axioms `$P(S) = 1$` and addition for exclusive events, gives A.

</details>

17. **Assertion:** A fair coin that has landed heads 5 times in a row is more likely to show tails next. **Reason:** The relative frequency of heads must settle near 1/2.
<details><summary>Answer</summary>(D). A is false: each toss is 50-50 whatever happened before. R is true (in the long run), but it does not mean the coin "makes up" a run.</details>

18. **Assertion:** The probability of an event can be 1.2. **Reason:** Every probability lies between 0 and 1.
<details><summary>Answer</summary>(D). A is false and R is true.</details>

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="probability" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- List the sample space so that every outcome is equally likely, then `$P(E) = n(E)/n(S)$`.
- `$P(A') = 1 - P(A)$`; use it for "at least one" and "neither".
- `$P(A \cup B) = P(A) + P(B) - P(A \cap B)$`; for mutually exclusive events just add.
- Probabilities lie between 0 and 1, and the outcome probabilities add up to 1.

</div>
