---
title: 'Sets: practice questions'
seoTitle: 'Sets Class 11 questions with answers'
summary: 'Practice for Class 11 Sets: roster and set-builder form, subsets, intervals, union, intersection, De Morgan and counting, with 1 to 5 mark and case questions.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'How many subsets does {1, 2, 3, 4} have?'
    choices: ['16', '8', '15', '4']
    ans: 0
    why: '2⁴ = 16 (15 of them are proper subsets).'
  - q: 'If A ⊂ B, then A ∩ B equals:'
    choices: ['A', 'B', '∅', 'A ∪ B']
    ans: 0
    why: 'All of A is already inside B, so the common part is A.'
  - q: 'n(A) = 12, n(B) = 8, n(A ∩ B) = 3. Then n(A ∪ B) is:'
    choices: ['17', '20', '23', '11']
    ans: 0
    why: '12 + 8 − 3 = 17.'
sources:
  - 'CBSE Class 11 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 1.** Read the lesson, [Sets](/learn/courses/ncert-class-11-maths/sets/), first. Try each question on paper before you open the answer.

<div class="bigidea">For every set question, first name the sets and the universal set, then write what each region means. For counting, draw the Venn diagram and fill it from the middle outwards: the overlap first, then the rest of each set.</div>

## How to set out answers

1. Write each set in roster form when it is small.
2. For a proof, show element-wise reasoning: "let x be in the left side, then ... so x is in the right side", and the reverse.
3. For counting, draw the Venn diagram and write a number in every region, then check that the regions add to the total.
4. Write intervals with the right brackets: round for excluded ends, square for included ends.

## 1-mark questions

1. Write {x : x is a prime number less than 12} in roster form.
<details><summary>Answer</summary>{2, 3, 5, 7, 11}.</details>

2. How many subsets does the set {a, b, c, d} have?
<details><summary>Answer</summary>2⁴ = 16.</details>

3. If A ⊂ B, what is A ∪ B?
<details><summary>Answer</summary>B, because everything in A is already in B.</details>

4. Write −2 < x ≤ 5 in interval notation.
<details><summary>Answer</summary>(−2, 5]: round bracket at −2 (excluded), square at 5 (included).</details>

5. U = {1, 2, 3, 4, 5, 6} and A = {2, 4, 6}. Find A′.
<details><summary>Answer</summary>A′ = {1, 3, 5}.</details>

## 2-mark and 3-mark questions

6. A = {1, 2, 3, 4, 5} and B = {4, 5, 6, 7}. Find A ∪ B, A ∩ B, A − B and B − A. *(3 marks)*
<details><summary>Answer</summary>A ∪ B = {1, 2, 3, 4, 5, 6, 7}; A ∩ B = {4, 5}; A − B = {1, 2, 3}; B − A = {6, 7}.</details>

7. n(A) = 25, n(B) = 18 and n(A ∩ B) = 7. Find n(A ∪ B) and the number of elements in exactly one of the two sets. *(3 marks)*
<details><summary>Answer</summary>

`$n(A \cup B) = 25 + 18 - 7 = 36$`. Exactly one: `$(25 - 7) + (18 - 7) = 29$`, which is also `$36 - 7 = 29$`.

</details>

8. Verify De Morgan's law `$(A \cup B)' = A' \cap B'$` for U = {1, 2, 3, 4, 5}, A = {1, 2, 3}, B = {3, 4}. *(3 marks)*
<details><summary>Answer</summary>

`$A \cup B = \{1, 2, 3, 4\}$`, so `$(A \cup B)' = \{5\}$`. Also `$A' = \{4, 5\}$` and `$B' = \{1, 2, 5\}$`, so `$A' \cap B' = \{5\}$`. Both sides are `$\{5\}$`.

</details>

9. Write A ∩ B for A = [−3, 4) and B = (1, 6]. *(2 marks)*
<details><summary>Answer</summary>

Left end: the larger of −3 and 1 is 1, and 1 is not in B (open), so it is excluded. Right end: the smaller of 4 and 6 is 4, and 4 is not in A (open), so it is excluded. Answer `$(1, 4)$`.

</details>

10. A set has 7 elements. How many of its subsets are non-empty? *(2 marks)*
<details><summary>Answer</summary>

`$2^7 = 128$` subsets in all; remove the empty one: `$127$`.

</details>

## 5-mark questions (model answers)

11. In a survey of 100 students, 60 like cricket (C), 50 like football (F) and 40 like hockey (H); 25 like C and F, 20 like F and H, 15 like C and H, and 8 like all three. Find how many like (i) at least one game, (ii) none, (iii) exactly one game. *(5 marks)*
<details><summary>Answer</summary>

(i) `$n(C \cup F \cup H) = 60 + 50 + 40 - 25 - 20 - 15 + 8 = 98$`.

(ii) None: `$100 - 98 = 2$`.

(iii) Fill the Venn diagram from the middle: all three = 8; C and F only = 25 − 8 = 17; F and H only = 20 − 8 = 12; C and H only = 15 − 8 = 7. Then C only = 60 − 17 − 7 − 8 = 28; F only = 50 − 17 − 12 − 8 = 13; H only = 40 − 12 − 7 − 8 = 13. Exactly one game: 28 + 13 + 13 = **54**. Check: 54 + (17 + 12 + 7) + 8 = 98.

</details>

12. Prove that `$(A \cap B)' = A' \cup B'$` for any sets A and B. *(5 marks)*
<details><summary>Answer</summary>

Let `$x \in (A \cap B)'$`. Then `$x \notin A \cap B$`, so x is not in both A and B, which means `$x \notin A$` or `$x \notin B$`. So `$x \in A'$` or `$x \in B'$`, that is `$x \in A' \cup B'$`. Hence `$(A \cap B)' \subseteq A' \cup B'$`.

Conversely, let `$x \in A' \cup B'$`. Then `$x \notin A$` or `$x \notin B$`, so x cannot be in both, so `$x \notin A \cap B$` and `$x \in (A \cap B)'$`. Hence `$A' \cup B' \subseteq (A \cap B)'$`. The two sets contain each other, so they are equal.

</details>

## Case-based question

A school has 80 students in Classes 11 and 12 who joined clubs. 45 joined the Music club (M), 38 joined the Sports club (S) and 15 joined both.

13. (a) How many joined only the Music club? (b) How many joined at least one club? (c) How many joined neither? (d) How many joined exactly one club? *(4 marks)*
<details><summary>Answer</summary>

(a) `$45 - 15 = 30$`. (b) `$45 + 38 - 15 = 68$`. (c) `$80 - 68 = 12$`. (d) Only Music 30 plus only Sports `$38 - 15 = 23$`: `$53$`.

</details>

<div class="problem" data-problem="c11m-sets-neither"></div>

## Assertion and reason

14. **Assertion (A):** For any sets, A ∩ B ⊆ A. **Reason (R):** Every element that is in both A and B is in A.
<details><summary>Answer</summary>Both true and R explains A (option a).</details>

15. **Assertion (A):** A − B = B − A for any two sets. **Reason (R):** A − B and B − A are both subsets of A ∪ B.
<details><summary>Answer</summary>A is false (take A = {1}, B = {2}: A − B = {1} but B − A = {2}). R is true. Option (d).</details>

<div class="problem" data-problem="c11m-sets-contain"></div>

## Question set

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="sets" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Fill Venn diagrams from the middle (the overlap) outwards.
- n(A ∪ B) = n(A) + n(B) − n(A ∩ B); for three sets add back the triple overlap.
- De Morgan: (A ∪ B)′ = A′ ∩ B′, (A ∩ B)′ = A′ ∪ B′. Prove set equalities by showing each side is inside the other.
- Intervals: round bracket excludes an end, square includes it.

</div>
