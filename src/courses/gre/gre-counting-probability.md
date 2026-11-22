---
title: Counting and probability for the GRE
seoTitle: 'GRE counting and probability: a guided route with practice'
summary: 'Counting and probability as the GRE asks them: the multiplication principle, permutations and combinations, "and" and "or" probabilities, complements, and the comparison traps, with links to the full shared lessons.'
minutes: 11
updated: 2026-11-22
quiz:
  - q: 'How many ways can 3 of 5 people be chosen for a committee?'
    choices: ['10', '60', '15']
    ans: 0
    why: 'Order does not matter: 5C3 = 10.'
  - q: 'P(at least one head in 3 coin tosses) is...'
    choices: ['7/8', '3/8', '1/2']
    ans: 0
    why: '1 − P(no heads) = 1 − 1/8.'
  - q: 'A: number of ways to arrange 4 books in a row. B: 4². Which is greater?'
    choices: ['A: 24 > 16', 'B', 'Equal']
    ans: 0
    why: '4! = 24.'
sources:
  - 'OpenStax, Contemporary Mathematics (CC BY 4.0), chapter 7 Probability (counting, permutations, combinations): https://openstax.org/books/contemporary-mathematics/pages/7-introduction'
---

**Module 5 · about 11 minutes, plus the linked lessons.** The full teaching is in the shared [counting](/learn/courses/gmat/counting/) and [probability](/learn/courses/gmat/probability/) lessons. This lesson adds the GRE angle.

<div class="bigidea">Ask two questions first: does order matter, and is it "and" or "or"? The answers pick the formula.</div>

## 1. The four tools

| Situation | Tool |
|---|---|
| a choice, then another | multiply the counts |
| arrange all n | n! |
| choose k of n, order matters | n! ÷ (n − k)! |
| choose k of n, order does not matter | n! ÷ (k!(n − k)!) |

<figure class="fig" data-fig="count-tree"><figcaption>From the shared counting lesson: a tree of choices. Each level multiplies the number of branches.</figcaption></figure>

## 2. Probability in one line each

- P = favourable ÷ total, when outcomes are equally likely.
- "And" (independent): multiply. "Or" (cannot both happen): add.
- "At least one": 1 − P(none).

<div class="steps" data-title="Worked example: a comparison">
<div class="step">A bag has 3 red and 2 blue balls. Two are drawn without replacement. A: P(both red). B: P(one of each colour).</div>
<div class="step">A: P(both red) = 3/5 × 2/4 = 3/10.</div>
<div class="step">B: P(one of each) = P(red then blue) + P(blue then red) = 3/5 × 2/4 + 2/5 × 3/4 = 3/10 + 3/10 = 6/10.</div>
<div class="step">B (0.6) is greater than A (0.3): answer <b>B</b>.</div>
</div>

<div class="myth">

**"Without replacement and with replacement give the same answer."** After a draw, the bag has changed. Always update the counts.

</div>

<div class="keypoints">

- Order matters: permutations. Order does not: combinations.
- "And" multiplies, "or" adds (when the events cannot overlap).
- "At least one" = 1 − P(none).
- Without replacement, update the counts after each draw.

</div>

## Practise: counting and probability

<div class="qbank" data-bank="grad-quant" data-topics="counting,probability" data-exam="gre" data-mode="practice" data-n="10"></div>

**Next:** lesson 5.4 is a mixed, timed quant review.
