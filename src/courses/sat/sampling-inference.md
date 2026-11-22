---
title: 'Samples, margins of error and what a study can prove'
seoTitle: 'SAT sampling, margin of error and study design'
summary: 'Random samples, scaling a sample up to a population, margins of error, bias, and when a study can claim cause and effect: the SAT''s reasoning-about-data questions.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'An estimate is 52% with a margin of error of 3 points. A reasonable conclusion is that the true value is:'
    choices: ['likely between 49% and 55%', 'exactly 52%', 'certainly above 50%']
    ans: 0
    why: 'The margin gives a range of plausible values for the population.'
  - q: 'What allows a study to conclude cause and effect?'
    choices: ['Random assignment to treatment groups', 'A very large sample', 'Random sampling alone']
    ans: 0
    why: 'Random assignment balances other differences between groups.'
  - q: 'A larger random sample usually gives:'
    choices: ['a smaller margin of error', 'a larger margin of error', 'no change']
    ans: 0
    why: 'More data means a more precise estimate.'
sources:
  - 'College Board, SAT Math content domains: Problem-solving and data analysis (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, sampling and inference (original questions) https://fibub.com/learn/courses/sat/sampling-inference/'
---

**Module 4 · about 15 minutes · read first: [4.5 Probability](/learn/courses/sat/probability/).** By the end you will judge what a survey or experiment can and cannot conclude.

<div class="bigidea">Two questions decide what a study can claim. Who was studied (a random sample lets you generalise to the population)? How were they split into groups (random assignment lets you claim cause)?</div>

## 1. From a sample to a population

If 18 of 120 randomly chosen students cycle to school, the best estimate for a school of 1,500 is 18/120 × 1,500 = 225.

<div class="problem" data-problem="si-g01"></div>

## 2. Margin of error

A sample estimate is rarely exactly right. A margin of error says how far off it plausibly is: 52% ± 3 means the true population value is plausibly between 49% and 55%. Bigger random samples give smaller margins.

<div class="meaning">

<dl>
<dt>Population</dt><dd>everyone the question is about</dd>
<dt>Random sample</dt><dd>chosen so everyone in the population has the same chance of being picked</dd>
<dt>Bias</dt><dd>a sampling method that leans one way, like surveying gym-goers about exercise</dd>
<dt>Random assignment</dt><dd>the experimenter decides by chance who gets the treatment, so the groups match in everything else</dd>
<dt>Physical meaning</dt><dd>A poll of 1,000 random people can describe a country of millions, while a poll of a million volunteers can still be badly wrong if they are not random.</dd>
</dl>

</div>

## 3. Cause and effect

<div class="steps">
<div class="step">Observational study: people who drink tea have lower blood pressure. Maybe tea drinkers also exercise more. No cause can be claimed.</div>
<div class="step">Experiment: volunteers are randomly assigned to tea or water. Chance balances exercise, diet and everything else between the groups.</div>
<div class="step">Now a difference can be credited to the tea, but only for people like the volunteers, since they were not a random sample of everyone.</div>
</div>

<details class="try"><summary>Try it: a school surveys the first 50 students to arrive in the morning about sleep. What is wrong?</summary>

Early arrivers may sleep differently from others (they may go to bed earlier, or have long commutes). The sample is not random, so its average may be biased.

</details>

<div class="myth">

**"A bigger sample fixes everything."** Size cuts random error, not bias. A huge sample of the wrong people gives a precise answer to the wrong question.

</div>

## Practice set

Questions on this lesson, from warm-up to hard, in the SAT's own formats. Every question has a full worked solution.

<div class="qbank" data-bank="sat" data-topics="sampling-inference" data-exam="sat" data-n="8"></div>

<div class="keypoints">

- Random sampling lets you generalise to the population; scale by the sample proportion.
- A margin of error gives a plausible range for the population value.
- Random assignment lets you claim cause, for people like those studied.
- Larger samples reduce random error but never fix bias.

</div>
