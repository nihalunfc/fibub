---
title: 'Time and work, pipes and cisterns'
seoTitle: 'Time and work, pipes and cisterns for CUET'
summary: 'Think in work per day: add rates when people work together, subtract for a leak, and use the LCM trick to avoid fractions. An animated tank, worked examples and practice with fresh numbers.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'A can do a job in 10 days and B in 15 days. Together they take:'
    choices: ['6 days', '12.5 days', '25 days']
    ans: 0
    why: 1/10 + 1/15 = 5/30 = 1/6 of the job a day, so 6 days.
  - q: 'A pipe fills a tank in 4 hours and a leak empties it in 12 hours. With both open, it fills in:'
    choices: ['6 hours', '3 hours', '8 hours']
    ans: 0
    why: 1/4 − 1/12 = 2/12 = 1/6 of the tank an hour.
  - q: 12 workers finish a wall in 10 days. How long would 15 workers take?
    choices: ['8 days', '12.5 days', '7 days']
    ans: 0
    why: Total work = 120 worker-days, so 15 workers take 120 ÷ 15 = 8 days.
sources:
  - 'National Testing Agency, CUET (UG) syllabus for the General Test (numerical ability) https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 3 · about 15 minutes.** By the end you will add and subtract rates, handle leaks and people leaving, and use worker-days.

<div class="bigidea">Do not add times; add rates. If A finishes a job in 10 days, A does 1/10 of it each day, and rates of people working together simply add.</div>

## 1. Rates add

```math
\frac{1}{T} = \frac{1}{a} + \frac{1}{b} - \frac{1}{c}
```

<div class="meaning">

<dl>
<dt>a, b</dt><dd>how long each worker (or filling pipe) takes alone</dd>
<dt>c</dt><dd>how long a leak (or emptying pipe) takes to undo the whole job: it counts as minus</dd>
<dt>T</dt><dd>how long they take together</dd>
<dt>Physical meaning</dt><dd>each one contributes a slice of the job per hour; the slices add up. Together is always faster than the fastest one alone, unless there is a leak.</dd>
</dl>

</div>

<figure class="fig" data-fig="tank"><figcaption>Two pipes and a drain. Change the times and watch the tank fill; open the drain and it slows down, or never fills.</figcaption></figure>

<div class="problem" data-problem="work-together"></div>

## 2. The LCM trick: no fractions

<div class="steps" data-title="A in 12 days, B in 18 days, A leaves after 4 days">
<div class="step">Call the job 36 units (the LCM of 12 and 18). A does 3 units a day, B does 2.</div>
<div class="step">Together for 4 days: 5 × 4 = 20 units done.</div>
<div class="step">16 units are left for B alone: 16 ÷ 2 = 8 more days.</div>
<div class="step">Total time: 4 + 8 = <b>12 days</b>. Not a single fraction needed.</div>
</div>

## 3. Worker-days

When the number of workers changes, the total work is **workers × days** (× hours a day, if given). 12 workers × 10 days = 120 worker-days, whoever does them.

<div class="myth">

**"A takes 10 days and B takes 15, so together 12.5 days (the average)."** Two people working together must be faster than either alone. Add rates, never average times: the answer is 6 days.

</div>

## 4. Practice

<div class="qbank" data-bank="cuet-general-test" data-topics="time-work" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Rate = 1/time. Rates add; leaks subtract.
- Two workers together: ab ÷ (a + b).
- Use the LCM of the times as the total units to avoid fractions.
- When workers change: total work = workers × days (× hours).

</div>
