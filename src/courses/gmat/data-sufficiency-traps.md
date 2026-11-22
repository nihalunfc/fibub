---
title: Data Sufficiency traps and testing numbers
seoTitle: 'GMAT Data Sufficiency traps: test numbers, beat the C trap'
summary: 'How to test numbers to prove a statement is not sufficient, the usual traps (the C trap, hidden constraints, squares, repeated equations, yes-no confusion), and a checklist for every statement.'
minutes: 14
updated: 2026-11-22
quiz:
  - q: 'Is x > 0? (1) x² = 16. Is (1) sufficient?'
    choices: ['No: x could be 4 or −4', 'Yes: x = 4', 'Yes: squares are positive']
    ans: 0
    why: 'Two values with different signs give "yes" and "no". Not sufficient.'
  - q: '(1) x + y = 10. (2) 2x + 2y = 20. What is x?'
    choices: ['E: the second equation is the first one doubled', 'C: two equations, two unknowns', 'D']
    ans: 0
    why: 'Doubling an equation adds no information. Together you still have only x + y = 10.'
  - q: 'To show a statement is not sufficient, how many cases that fit do you need?'
    choices: ['Two that give different answers', 'One that gives a wrong answer', 'Every possible case']
    ans: 0
    why: 'Two allowed cases with different answers prove the answer is not fixed.'
sources:
  - 'GMAC, GMAT exam structure, Data Insights section (checked 2026-11-22): https://www.mba.com/exams/gmat-exam/about/exam-structure'
  - 'OpenStax, College Algebra 2e (CC BY 4.0), section 2.6 Other types of equations (absolute value and squares): https://openstax.org/books/college-algebra-2e/pages/2-6-other-types-of-equations'
---

**Module 8 · about 14 minutes.** By the end you will prove or disprove any statement by testing numbers, and spot the five traps the test likes best.

<div class="bigidea">To prove a statement is not sufficient, find two numbers that fit it and give different answers. To trust that it is sufficient, try hard to find those two numbers and fail.</div>

## 1. Testing numbers

Pick numbers that **fit the statement**, then answer the question with them. Choose a range on purpose: a positive and a negative, zero, a fraction, a big and a small number.

<figure class="fig" data-fig="ds-tester"><figcaption>Choose a question. Each dot is a number that fits the statement you pick; its colour shows the answer it gives. One colour means sufficient; two colours mean not.</figcaption></figure>

<div class="steps" data-title="Worked example: testing numbers">
<div class="step">Is n odd? (1) n is a prime number.</div>
<div class="step">Try primes: 3 → yes, 5 → yes, 7 → yes… it looks sufficient.</div>
<div class="step">Don't stop at the easy numbers. The smallest prime is 2, which is even → no.</div>
<div class="step">Two answers: <b>not sufficient</b>. The first numbers you think of are rarely the ones that break a statement.</div>
</div>

## 2. The five traps

| Trap | What it looks like | Defence |
|---|---|---|
| **The C trap** | Both statements together obviously work, so you pick C without checking each alone. | Always test each statement alone first. Often one alone is enough (A, B or D). |
| **Repeated equations** | (1) x + y = 10, (2) 2x + 2y = 20. Looks like two equations. | One is a multiple of the other: still one equation. |
| **Squares and absolute values** | x² = 9 or \|x\| = 3. | Two values, 3 and −3. Ask whether the sign matters to the question. |
| **Hidden facts in the question** | "n is a positive integer", "x and y are integers", "a price in whole dollars". | Read the question stem first; the stem can turn a "not sufficient" into "sufficient". |
| **Yes-or-no confusion** | A statement gives "always no", and you mark it not sufficient. | A definite no is an answer. |

<div class="myth">

**"If both statements together are needed, the answer is C, so C must be common."** The test knows that C is tempting. Trap questions are written so that one statement alone already works, or so that even both fail.

</div>

## 3. A checklist for every statement

1. What exactly does the question need: one value, or always yes/no?
2. Have I used the facts in the stem (integers, positive)?
3. Have I tried a negative, zero and a fraction (when allowed)?
4. Am I judging this statement alone?

<div class="keypoints">

- Not sufficient = two allowed cases with different answers. Look for them on purpose.
- Test 0, 1, a negative, a fraction and a big number when the stem allows them.
- Check each statement alone before you even think about C.
- A multiple of an equation adds nothing. A square leaves two signs.
- The stem's facts (integer, positive) are part of every statement.

</div>

## Practise: the traps in action

These sets are built so all five answers come up evenly. Read the solution's cases even when you are right.

<div class="qbank" data-bank="gmat-di" data-topics="ds-algebra,ds-numbers" data-exam="gmat" data-mode="practice" data-n="10"></div>

**Next:** lesson 8.3 moves to tables, where the skill is reading and sorting fast.
