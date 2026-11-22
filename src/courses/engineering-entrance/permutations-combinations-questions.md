---
title: 'Permutations and combinations: question types and traps'
seoTitle: 'Permutations and combinations JEE questions: traps'
summary: 'Every way entrance exams test counting: arrangements with restrictions, together and apart, identical objects, forming numbers, rank of a word, circular arrangements, selections, geometry, divisors, distributions, stars and bars, derangements and inclusion-exclusion, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'How many 3-digit numbers with all digits different can be formed from 0, 1, 2, 3, 4?'
    choices: ['60', '48', '64', '100']
    ans: 1
    why: 'The first digit cannot be 0: 4 choices. Then 4 choices remain for the second digit (0 is now allowed) and 3 for the third: 4 × 4 × 3 = 48.'
  - q: 'In how many ways can 4 letters be put in their 4 addressed envelopes so that no letter is in the right one?'
    choices: ['9', '11', '23', '6']
    ans: 0
    why: 'D₄ = 4!(1 − 1 + 1/2 − 1/6 + 1/24) = 24 − 24 + 12 − 4 + 1 = 9.'
  - q: 'The number of divisors of 360 is:'
    choices: ['24', '20', '18', '12']
    ans: 0
    why: '360 = 2³ × 3² × 5, so the number of divisors is (3 + 1)(2 + 1)(1 + 1) = 24.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Permutations and combinations; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Permutations and combinations](/learn/courses/engineering-entrance/permutations-combinations/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Most counting mistakes are one of two kinds: counting the same thing twice (forgetting to divide), or splitting into cases that overlap or leave a gap. Before you multiply, ask what one finished arrangement looks like and whether your method makes each one exactly once.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Plain arrangements and selections.</b> Decide if order matters. <i>Trap:</i> using nPr for a team or nCr for a ranked list.</div>
<div class="step"><b>2. Restrictions.</b> Fill restricted places first. Together: block. Apart: gaps. <i>Trap:</i> forgetting to arrange the objects inside the block.</div>
<div class="step"><b>3. Identical objects and words.</b> n!/(p! q! …). <i>Trap:</i> in "vowels together" words, the vowels may repeat too, so divide inside the block as well.</div>
<div class="step"><b>4. Forming numbers.</b> First digit not 0; divisibility rules. <i>Trap:</i> one case for numbers ending in 0 and another for the rest, because 0 cannot lead.</div>
<div class="step"><b>5. Rank of a word.</b> Count arrangements starting with each smaller letter, then add 1. <i>Trap:</i> with repeated letters, divide each count by the factorials of the letters still left.</div>
<div class="step"><b>6. Circles and necklaces.</b> (n − 1)!; half for necklaces. <i>Trap:</i> seats that are numbered make it a row, not a circle.</div>
<div class="step"><b>7. Selections with conditions.</b> At least, at most, a particular person in or out. <i>Trap:</i> "choose one woman first, then the rest freely" counts some committees twice.</div>
<div class="step"><b>8. Geometry and divisors.</b> Lines, triangles, diagonals, rectangles; (a + 1)(b + 1)…. <i>Trap:</i> collinear points give one line, not C(k, 2), and no triangles.</div>
<div class="step"><b>9. Distributions.</b> Identical into different boxes: stars and bars. Different into unnamed equal groups: divide by k!. <i>Trap:</i> mixing up identical and different objects.</div>
<div class="step"><b>10. Derangements and inclusion-exclusion.</b> Dₙ; "exactly k right" = C(n, k)Dₙ₋ₖ. <i>Trap:</i> stopping the alternating sum early.</div>
</div>

## Worked examples

**Example 1 (level 3, the overcount trap).** A committee of 3 from 4 men and 3 women must have at least one woman. *Wrong method:* choose a woman (3 ways), then any 2 of the other 6 (15 ways): 45. *Right method:* all committees minus all-men: C(7, 3) − C(4, 3) = 35 − 4 = **31**. The wrong method counts a committee with two women twice, once for each woman picked "first".

**Example 2 (level 4, rank).** Find the rank of SCHOOL among its arrangements in dictionary order. *Solution.* Letters C, H, L, O, O, S. Words starting with C: 5!/2! = 60; with H: 60; with L: 60; with O: 5! = 120. That is 300 words before any word starting with S. After S, the next letters C and H are already the smallest available, so nothing comes before them. After SCH the letters L, O, O are left and the next letter is O: the words starting SCHL come first, and there is 2!/2! = 1 of them. After SCHO the letters L, O are left: SCHOLO comes before SCHOOL, 1 more. Rank = 300 + 1 + 1 + 1 = **303**.

**Example 3 (level 4, distribution).** In how many ways can 6 different books be split into 3 piles of 2 each? *Solution.* C(6, 2) × C(4, 2) × C(2, 2) = 90 orders the piles; the piles have no names, so divide by 3!: **15**. If the piles go to 3 named students, it is 90.

**Example 4 (level 5, inclusion-exclusion).** How many onto functions are there from a set of 5 elements to a set of 3? *Solution.* All functions 3⁵ = 243. Subtract those missing at least one element of the codomain: 3 × 2⁵ − 3 × 1⁵ = 96 − 3 = 93. Onto = 243 − 93 = **150**.

<div class="myth">

**"Identical or different does not change much."** It changes everything. 5 identical balls into 3 boxes: C(7, 2) = 21 ways. 5 different balls into 3 boxes: 3⁵ = 243 ways. Read the question for the word "identical" or "alike" before you start.

</div>

<div class="meaning">
<dl>
<dt>Gaps</dt><dd>k objects in a row leave k + 1 gaps, ends included</dd>
<dt>Dₙ</dt><dd>derangements: arrangements with nothing in its own place</dd>
<dt>Physical meaning</dt><dd>Each formula is a way of making every arrangement exactly once. When a method makes some twice, divide or subtract; when it misses some, add a case.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="permutations-combinations" data-mode="practice"></div>

<div class="keypoints">

- "At least one" is easiest as total minus none.
- Together: block and arrange inside; apart: gaps method.
- Rank of a word: count words starting with each smaller letter, divide by repeat factorials, add 1.
- Unnamed equal groups: divide by k!; named groups: do not.
- Onto functions from n to 3: 3ⁿ − 3·2ⁿ + 3.
- Dₙ: 0, 1, 2, 9, 44, 265 for n = 1 to 6.

</div>
