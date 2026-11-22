---
title: 'A GATE strategy: what to attempt first and when to skip'
seoTitle: GATE Physics strategy, guessing and time management
summary: 'Exam strategy for GATE Physics worked out with numbers: marks per minute and triage, the expected value and the spread of MCQ guesses, how to choose an MSQ answer from your confidence in each statement, getting NATs inside the range, when to abandon a question, and a study plan driven by your own practice and mock results.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'On a 2-mark GATE MCQ you can rule out two options and guess between the other two. The expected mark is'
    choices: ['+2/3', '+1', '0', '+1/3']
    ans: 0
    why: 'p = 1/2: (1/2)(2) − (1/2)(2/3) = 1 − 1/3 = 2/3.'
  - q: 'For an MSQ you judge the four statements true with probabilities 0.9, 0.7, 0.4 and 0.2, independently. Which answer maximises your chance of full marks?'
    choices: ['Select the first two only', 'Select all four', 'Select the first only', 'Leave it blank']
    ans: 0
    why: 'Include a statement exactly when you think it more likely true than false. The chance of the exact set is then 0.9 × 0.7 × 0.6 × 0.8 ≈ 0.30, higher than for any other choice, and a blank scores zero for certain.'
  - q: 'Eight completely blind 1-mark MCQ guesses have an expected value of zero. Roughly how likely are they to lower your score?'
    choices: ['About 37%', 'About 5%', 'About 75%', 'Exactly 50%']
    ans: 0
    why: 'You lose marks if fewer than 2 of the 8 are right: 0.75⁸ + 8 × 0.25 × 0.75⁷ ≈ 0.10 + 0.27 = 0.37. Zero mean does not mean zero risk.'
sources:
  - 'GATE information brochure, published each year by the organising institute on the official GATE website (GATE 2027: IIT Madras)'
  - 'G. Pólya, How to Solve It, 2nd ed. (Princeton, 1957)'
  - 'S. Mahajan, Street-Fighting Mathematics (MIT Press, 2010; free under CC BY-NC-SA)'
  - 'W. Feller, An Introduction to Probability Theory and Its Applications, vol. 1, 3rd ed. (1968), chapter 6 on the binomial distribution'
---

**Module 10 · about 25 minutes.** [Lesson 10.1](/learn/courses/gate-physics/gate-exam-pattern/) set out the rules: 100 marks in 180 minutes, negative marks only on MCQs. Here those rules become decisions you can make in seconds during the exam, backed by a little probability. The JAM lesson on [problem-solving tricks](/learn/courses/iit-jam-physics/problem-solving-tricks/) covers the other half of strategy: raising your chance of being right with dimensions, limits and symmetry.

<div class="bigidea">Strategy is about two numbers per question: how many marks it is likely to give, and how many minutes it will take. Do the high marks-per-minute questions first, answer every MSQ and NAT, guess on MCQs only once you have ruled something out, and leave any question that has eaten its budget. Then use your mock results to decide what to study, not your feelings.</div>

## 1. Marks per minute and triage

At 1.8 minutes per mark, a 2-mark question has a budget of about 3.5 minutes. A question you can do in 1 minute is worth far more per minute than one that will take 8, even though both give 2 marks. So on the first pass, sort each question in a few seconds:

<div class="steps">
<div class="step"><p><b>Quick.</b> You see the method at once and it is short: answer it now.</p></div>
<div class="step"><p><b>Doable but long.</b> You know the method, but it needs a derivation or careful arithmetic: mark it for the second pass.</p></div>
<div class="step"><p><b>Unclear.</b> You do not see a way in: mark it and move on. Many become clear later, once you are warmed up or another question has reminded you of a result.</p></div>
</div>

**The abandon rule.** If a question has used one and a half times its budget and the end is not in sight, mark it and leave. The minutes are worth more elsewhere: five more minutes on a stuck question might raise its chance from 0.3 to 0.5 (0.4 expected marks on a 2-mark NAT), while the same five minutes on two quick 1-mark questions you have not reached yet could give nearly 2.

## 2. MCQs: when a guess pays

For an MCQ worth `$m$` with chance `$p$` of being right:

```math
\langle\text{marks}\rangle = p\,m - (1 - p)\frac m3 = \frac m3(4p - 1), \qquad \sigma = \sqrt{p(1 - p)}\,\frac{4m}3
```

<div class="meaning">

<dl>
<dt>`$p$`</dt><dd>your honest chance of being right after eliminating what you can; 1/4 for a blind guess among four options</dd>
<dt>`$\tfrac m3(4p - 1)$`</dt><dd>the average gain from answering; the penalty of `$m/3$` is chosen so that it is exactly zero at `$p = 1/4$`</dd>
<dt>`$\sigma$`</dt><dd>the spread of one guess: the gap between a right and a wrong answer is `$m + m/3 = 4m/3$`, times the binomial factor `$\sqrt{p(1 - p)}$`; for `$n$` guesses the mean grows as `$n$` but the spread only as `$\sqrt n$`</dd>
</dl>

</div>

| You can rule out | `$p$` | Expected, 1-mark | Expected, 2-mark |
|---|---|---|---|
| nothing (blind) | 1/4 | 0 | 0 |
| one option | 1/3 | +1/9 | +2/9 |
| two options | 1/2 | +1/3 | +2/3 |
| fairly sure | 0.8 | +0.73 | +1.47 |

**Expected value is not the whole story.** Each guess also adds spread. Eight blind 1-mark guesses have mean 0 but a standard deviation of 1.6 marks, and a 37% chance of lowering your score. Eight 2-mark guesses with one option ruled out each have mean +1.78 marks and still a 20% chance of a net loss; with two options ruled out, the mean is +5.33 and the chance of a loss falls to 3.5%. If you are comfortably above your target, skipping blind guesses reduces your risk at no cost on average; if you need a big jump, extra spread can help. Either way, the first job is to raise `$p$`.

<figure class="fig" data-fig="gate-expected-score"><figcaption>Top: expected marks per question against the chance p of being right, for 1-mark and 2-mark MCQs (which cross zero at p = 1/4) and for MSQs and NATs (dashed, never below zero). Bottom: the full distribution of marks from a batch of such answers, with its mean and, for MCQs, the bars that end below zero shaded. Change the number of options ruled out and the size of the batch.</figcaption></figure>

**Worked example.** At 170 minutes you have six 1-mark MCQs where you can rule out one option and four 2-mark MCQs where you can rule out two. Expected gain: `$6\times\frac19 + 4\times\frac23 = 0.67 + 2.67 = 3.33$` marks. Leaving them blank gives exactly zero.

<div class="problem" data-problem="gate-guess-value"></div>

## 3. MSQs: choose statement by statement

An MSQ pays only for the exact set, and never costs anything. So never leave one blank, and choose the set that maximises the chance of being exactly right. If you judge statement `$i$` true with probability `$p_i$`, and the judgements are roughly independent, the best answer is to **select every statement with `$p_i > 1/2$`**, and the chance of full marks is

```math
P(\text{exact set}) = \prod_i \max(p_i,\, 1 - p_i)
```

**Worked example.** Confidences 0.9, 0.8, 0.6 and 0.3: select the first three. The chance of exactly the right set is `$0.9\times0.8\times0.6\times0.7 = 0.30$`, worth 0.60 expected marks on a 2-mark MSQ. A blind pick among the 15 possible non-empty sets would give only 1/15. The practical rule: settle the statements you are sure of first, since each one you settle multiplies the chance by nearly 1 instead of a half, then spend the remaining time on the closest call.

## 4. NATs: get inside the range

A NAT is marked right if your number lies within the stated range, and wrong answers cost nothing. Three habits:

- **Keep full precision until the end.** Rounding an intermediate result to two figures can push the final answer out of a narrow range. Use the virtual calculator's memory or write intermediate values with an extra digit.
- **Check the requested form.** Units (eV or meV, nm or Å), powers of ten in the question ("in units of 10⁻³"), and the number of decimal places.
- **Always enter something.** A good estimate (an order-of-magnitude calculation, a limiting case) sometimes lands inside the range and never costs marks.

## 5. Plan your preparation from data

Strategy starts weeks before the exam. After every practice set or mock:

1. **Log each lost mark** as knowledge (did not know the physics), method (knew it, could not set it up), or craft (misread, ran out of time, bad guess).
2. **Fix knowledge gaps** by going back to the lesson and its live problems; fix method gaps with more [practice questions](/learn/courses/gate-physics/practice/) on that topic; fix craft with timed [mock tests](/learn/courses/gate-physics/mock-test/).
3. **Spend study time where the marks are cheapest.** A topic where you score 40% and that appears every year is worth more hours than polishing one where you already score 90%.
4. **One full mock a week** in the last two months, at the real time of day, with honest review, beats several in the final week.

<div class="myth">

**"A good strategy is to attempt only the questions you are sure of, to protect your score from negative marks."** That strategy throws away every MSQ and NAT you are not certain of, where an attempt can only help, and every MCQ where you can rule out an option, where the expected gain is positive. Toppers attempt most of the paper. What they avoid is blind MCQ guesses and time sinks.

</div>

<div class="keypoints">

- Triage on the first pass: quick now, long later, unclear later; abandon at 1.5 times the budget.
- MCQ guess: expected `$\tfrac m3(4p - 1)$`: zero blind, positive once one option is ruled out; spread `$\sqrt{p(1-p)}\cdot 4m/3$` per guess.
- MSQ: select every statement you think more likely true than false; never leave blank.
- NAT: full precision to the end, the units and form asked, and always enter an answer.
- Study by data: log each lost mark as knowledge, method or craft, and fix the cheapest marks first.

</div>

## Practise: exam questions on this lesson

Put the strategy to work on a hard mixed set (levels 3 to 5). Time yourself at 1.8 minutes per mark:

<div class="qbank" data-bank="physics" data-topics="linear-vector-spaces,hamiltonian-mechanics,potentials-gauges,harmonic-oscillator,fermi-gas,lasers,structure-factor,op-amp-circuits,adc-dac,sequential-logic" data-exam="gate" data-level="3,4,5" data-n="12"></div>

**Next:** that completes the course. Sit a full [GATE mock test](/learn/courses/gate-physics/mock-test/) under exam conditions, review it with the log above, and go back to any lesson your mistakes point to.

**Going on to CSIR NET?** [A 6-month study plan](/learn/courses/csir-net-physics/study-plan/) shows how to reuse these GATE lessons for NET.
