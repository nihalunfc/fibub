---
title: Data Sufficiency, the method
seoTitle: 'GMAT Data Sufficiency: the AD/BCE method, step by step'
summary: 'What a Data Sufficiency question asks, the five fixed answer choices, the AD/BCE method that sorts them in two steps, value questions versus yes-or-no questions, and why you should never finish the maths.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: Statement (1) alone is sufficient. Which answers are still possible?
    choices: ['A or D', 'B, C or E', 'C or E']
    ans: 0
    why: 'If (1) works alone, the answer is A (only (1)) or D (each alone). B, C and E all say (1) alone fails.'
  - q: 'A yes-or-no question gets the answer "always no" from a statement. Is that statement sufficient?'
    choices: ['Yes: a definite no is an answer', 'No: sufficient means the answer is yes', 'Only if the other statement agrees']
    ans: 0
    why: 'Sufficient means one definite answer. "Always no" settles the question just as well as "always yes".'
  - q: 'The question asks for x. Statement (1) gives 2x + 3 = 11. Do you need to find x = 4?'
    choices: ['No: one linear equation in one unknown gives one value, so it is sufficient', 'Yes: you must solve it to know', 'No, and it is not sufficient']
    ans: 0
    why: 'You only need to know that a single value exists. Stop as soon as you are sure.'
sources:
  - 'GMAC, GMAT exam structure, Data Insights section (checked 2026-11-22): https://www.mba.com/exams/gmat-exam/about/exam-structure'
  - 'OpenStax, College Algebra 2e (CC BY 4.0), section 7.1 Systems of linear equations: two variables: https://openstax.org/books/college-algebra-2e/pages/7-1-systems-of-linear-equations-two-variables'
---

**Module 8 · about 15 minutes.** By the end you will answer any Data Sufficiency question with the same two-step method, without doing more maths than you need.

<div class="bigidea">Data Sufficiency does not ask for the answer. It asks whether you <i>could</i> find one definite answer, first with each statement alone and then with both together.</div>

## 1. What the question looks like

You get a question and two statements, (1) and (2). The five answer choices are always the same, in the same order, so learn them once:

| Choice | Meaning |
|---|---|
| **A** | Statement (1) alone is sufficient; (2) alone is not. |
| **B** | Statement (2) alone is sufficient; (1) alone is not. |
| **C** | Neither alone is sufficient, but both together are. |
| **D** | Each statement alone is sufficient. |
| **E** | Even both together are not sufficient. |

Both statements are always true. They never contradict each other, so you never have to ask whether they are right: only whether they are **enough**.

## 2. The AD/BCE method

<div class="steps" data-title="Two steps sort every question">
<div class="step"><b>Step 1: look at statement (1) alone.</b> Cover statement (2) with your hand. Is (1) enough?</div>
<div class="step">If <b>yes</b>, the answer is <b>A or D</b>. If <b>no</b>, the answer is <b>B, C or E</b>.</div>
<div class="step"><b>Step 2: look at statement (2) alone</b>, forgetting (1) completely. If you were on AD: yes → D, no → A.</div>
<div class="step">If you were on BCE: yes → B. If no, put both together: enough → C, still not enough → E.</div>
</div>

<figure class="fig" data-fig="ds-flow"><figcaption>Press yes or no for each step. The tree shows which letters are still alive, and the answer once only one is left.</figcaption></figure>

The commonest mistake is letting statement (1) leak into step 2. When you judge (2) alone, pretend you never saw (1).

## 3. Two kinds of question

- **Value questions** ("What is x?", "How many men work there?"): a statement is sufficient when it gives **exactly one value**.
- **Yes-or-no questions** ("Is n even?", "Is x > y?"): a statement is sufficient when the answer is **always yes** or **always no**. A definite no is as good as a definite yes. "Sometimes yes, sometimes no" is not sufficient.

<div class="steps" data-title="Worked example: a value question">
<div class="step">Question: what is the value of x? (1) 3x − 4 = 11. (2) x² = 25.</div>
<div class="step">Statement (1) alone: one linear equation, one unknown, so one value (x = 5). <b>Sufficient: A or D.</b></div>
<div class="step">Statement (2) alone: x could be 5 or −5. Two values. <b>Not sufficient.</b></div>
<div class="step">Answer <b>A</b>. Notice that knowing x = 5 from (1) does not help (2): each statement is judged alone.</div>
</div>

<div class="steps" data-title="Worked example: a yes-or-no question">
<div class="step">Question: n is a positive integer. Is n divisible by 6? (1) n is divisible by 12. (2) n is divisible by 3.</div>
<div class="step">(1): every multiple of 12 is a multiple of 6. Always yes. <b>Sufficient: A or D.</b></div>
<div class="step">(2): n = 6 gives yes, n = 3 gives no. <b>Not sufficient.</b></div>
<div class="step">Answer <b>A</b>.</div>
</div>

## 4. Never finish the maths

You only need to know that one answer exists, not what it is. Two different linear equations in two unknowns have one solution: stop there. Stopping early saves a minute on many questions, and that minute pays for the hard ones.

<div class="myth">

**"If I can't work out the number, the statement isn't sufficient."** Sufficiency is about whether the number is fixed, not whether you have time to compute it. A messy equation with one solution is sufficient.

</div>

<div class="meaning">

**In plain words:** you are a manager deciding whether a report would let you make a decision. You don't make the decision; you just say "this report is enough" or "I need the other one as well".

</div>

<div class="keypoints">

- The five choices never change: A (1 only), B (2 only), C (together), D (each), E (not even together).
- AD/BCE: judge (1) alone, then (2) alone, and only then both together.
- Value question: sufficient means one value. Yes-or-no question: sufficient means always yes or always no.
- Statements are always true and never contradict each other.
- Stop as soon as you know an answer exists; don't solve to the end.

</div>

## Practise: Data Sufficiency

New questions every time, with the cases that prove each step written out in the solution.

<div class="qbank" data-bank="gmat-di" data-topics="ds-numbers,ds-algebra,ds-word" data-exam="gmat" data-mode="practice" data-n="10"></div>

**Next:** lesson 8.2 shows the traps the test sets inside Data Sufficiency, and how testing numbers beats them.
