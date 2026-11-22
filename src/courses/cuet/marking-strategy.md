---
title: 'Plus five, minus one: when to guess and when to skip'
seoTitle: 'CUET negative marking: when to guess and when to skip'
summary: 'With +5 for a right answer and −1 for a wrong one, a guess pays as soon as you are at least 1 in 6 sure. The maths of guessing, a three-round plan for the 60 minutes, and how to use accuracy to aim for a target score.'
minutes: 14
updated: 2026-11-22
quiz:
  - q: At +5/−1 with four options, how many marks is a completely blind guess worth on average?
    choices: ['+0.5', '0', '−0.25']
    ans: 0
    why: Average = 5 × 1/4 − 1 × 3/4 = 1.25 − 0.75 = +0.5. Even a blind guess is slightly positive.
  - q: What is the break-even chance of being right at +5/−1?
    choices: ['1 in 6', '1 in 4', '1 in 2']
    ans: 0
    why: 5p − (1 − p) = 0 gives 6p = 1, so p = 1/6. Above that, answering pays on average.
  - q: To score at least 200 with about 5 wrong answers, how many must you get right?
    choices: ['41', '40', '39']
    ans: 0
    why: 5R − 5 ≥ 200 gives R ≥ 41.
sources:
  - 'National Testing Agency, CUET (UG) information bulletin, marking scheme https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Expected value: Statistics for analysts course on fibub https://fibub.com/learn/courses/statistics/'
---

**Module 1 · about 14 minutes.** By the end you will know exactly when a guess helps you, how to split your 60 minutes, and how to turn a target score into the number of questions you must get right.

<div class="bigidea">At +5/−1, a wrong answer costs one-fifth of what a right answer earns, so you should answer every question where you can rule out even one option, and still skip the ones you truly know nothing about only if time is better spent elsewhere.</div>

## 1. The maths of a guess

Imagine you answer a question you are not sure about. If your chance of being right is *p*, then on average the answer earns:

```math
E = 5p - 1\,(1-p) = 6p - 1
```

<div class="meaning">

<dl>
<dt>p</dt><dd>your chance of being right (1/4 for a blind guess among four options)</dd>
<dt>E</dt><dd>the average marks the answer is worth: positive means answering helps over many questions</dd>
<dt>6p − 1 = 0</dt><dd>break-even at p = 1/6, about 17%, which is <em>below</em> a blind guess</dd>
<dt>Physical meaning</dt><dd>the penalty is too small to scare you off. Even a pure guess (p = 1/4) is worth +0.5 on average, and ruling out one option makes it +1.0; ruling out two makes it +2.0.</dd>
</dl>

</div>

<figure class="fig" data-fig="guess-ev"><figcaption>Average marks per answered question. Slide how sure you are of your best pick: anything above one in six is a green bar.</figcaption></figure>

<div class="problem" data-problem="guess-value"></div>

<div class="myth">

**"Negative marking means never guess."** Where a wrong answer costs as much as a right one earns, blind guessing does hurt. At +5/−1 the penalty is so light that leaving a question blank throws away marks on average whenever you can eliminate anything. The one caution: averages work over many questions, so do not guess wildly on *every* question you skipped; use your 60 minutes to make your guesses better.

</div>

## 2. A three-round plan for 60 minutes

You have 72 seconds per question on average. Do not spend them evenly.

<div class="steps" data-title="Three rounds through the paper">
<div class="step"><b>Round 1 (about 30 minutes): the sure ones.</b> Go through all 50. Answer every question you can do in under a minute. Mark anything slow or doubtful for review and move on. Aim to finish 30 to 35 questions here.</div>
<div class="step"><b>Round 2 (about 20 minutes): the workable ones.</b> Return to marked questions that need working: a calculation, a longer passage, a tricky option. Rule out what you can before you commit.</div>
<div class="step"><b>Round 3 (about 8 minutes): the educated guesses.</b> For what is left, eliminate one or two options and pick the best remaining one. As the bars above show, each of these is worth +1 to +2 marks on average.</div>
<div class="step"><b>Last 2 minutes: check the answer sheet.</b> Make sure nothing you meant to answer is still only "marked for review" without an answer. Check the bulletin each year: in past years a question marked for review counted only if an answer was also selected.</div>
</div>

**Try it:** Press Play to run the clock and set your own seconds per question.

<figure class="fig" data-fig="@tp-pacing-clock" data-test="cuet"><figcaption>Compare the green even-pace ring with your inner ring: are you ahead or behind at each checkpoint?</figcaption></figure>

## 3. Turn a target into a number of right answers

Universities rank you by score, so set a target from last year's cut-offs for your course (each university publishes its own), then work backwards:

```math
R \ge \frac{\text{target} + W}{5}
```

<div class="problem" data-problem="cuet-target"></div>

A target of 200 with about 5 slips means 41 right. That leaves 9 questions you can get wrong or leave, which is why **accuracy** in practice matters more than speed: if your practice accuracy is 80%, you need to attempt about 41 ÷ 0.8 ≈ 51 questions, more than the paper has. Raise accuracy first, speed second.

<div class="keypoints">

- At +5/−1 the average value of an answer is 6p − 1: positive whenever you are more than 1 in 6 sure.
- A blind guess is worth +0.5 on average; ruling out one option makes it +1, two options +2.
- Use three rounds: sure ones, workable ones, educated guesses; keep 2 minutes to check the sheet.
- Work backwards from a target: right answers needed = (target + expected wrong) ÷ 5, rounded up.
- Accuracy in practice is the number to raise first.

</div>
