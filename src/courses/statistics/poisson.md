---
title: 'The Poisson: orders per hour and rare events'
summary: 'The Poisson distribution counts events in a fixed window of time or space: orders per hour, calls per minute, defects per metre. Its one parameter λ, why mean equals variance, and how to staff for busy hours.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A shop gets 6 orders an hour on average. Which distribution describes the count in one hour?'
    choices: ['Binomial with n = 6', 'Poisson with λ = 6', 'Normal with mean 6 and SD 6']
    ans: 1
    why: 'Events arriving one at a time, independently, at a steady average rate, counted in a fixed window: that is the Poisson. There is no fixed number of tries.'
  - q: 'If the average is 4 calls per 10 minutes, what is λ for a 30-minute window?'
    choices: ['4', '12', '1.33']
    ans: 1
    why: 'λ scales with the window: 4 per 10 minutes is 12 per 30 minutes.'
  - q: 'Count data has mean 5 and variance 14. What does that suggest?'
    choices: ['A perfect Poisson', 'Overdispersion: events cluster (busy and quiet periods), so a plain Poisson understates the spread', 'The data has an error']
    ans: 1
    why: 'A Poisson has variance equal to its mean. Variance much bigger than the mean means the rate is not steady, for example lunch rushes, so plan for wider swings.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 4.5 Poisson distribution https://www.openintro.org/book/os/'
  - 'NIST/SEMATECH e-Handbook, 1.3.6.6.19 Poisson Distribution https://www.itl.nist.gov/div898/handbook/eda/section3/eda366j.htm'
---

**Module 3 · about 20 minutes · school maths.** You'll be able to recognise a Poisson situation, compute Poisson probabilities, scale λ to a window, and spot when counts are more spread out than Poisson.

<div class="bigidea">Events that happen independently at a steady average rate (orders per hour, calls per minute) give Poisson counts, and one number λ describes everything.</div>

**In everyday terms:** raindrops on a paving stone: you know about how many land per minute on average, but each minute the count is a bit different, and you cannot know which minute gets more.

## 1. Counts with no fixed number of tries

How many orders arrive in the next hour? Calls in the next 10 minutes? Website errors today? There's no "number of tries", just events arriving at some average rate. When events

1. happen **one at a time**,
2. **independently** of each other,
3. at a **steady average rate** over the window,

the count in a fixed window follows a **Poisson distribution** with parameter `$\lambda$` (lambda), the average count per window:

```math
P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}, \qquad k = 0, 1, 2, \ldots
```

## 2. One number does everything

The Poisson's mean and variance are both `$\lambda$`:

```math
E[X] = \lambda \qquad \text{Var}(X) = \lambda \qquad \text{SD}(X) = \sqrt{\lambda}
```

So a store averaging 100 orders an hour usually sees 100 ± 10 (`$\sqrt{100}$`), while one averaging 4 sees 4 ± 2: relatively much bumpier. Small counts are noisy, which is why a small branch's daily numbers jump around so much.

`$\lambda$` scales with the window: 6 orders an hour is 1 per 10 minutes, or 48 in an 8-hour day.

<!--fig:poisson-bars-->

Set λ to 8 and the team's limit to 12: about 1 hour in 16 is over the limit. Over a 10-hour day about half of all days have at least one busy hour, even though the average is far below 12. Staffing to the average leaves you short in exactly the hours customers notice.

## 3. Checking the fit: overdispersion

Real counts often vary **more** than Poisson, because the rate isn't steady (lunch rush, weekends, campaigns) or events come in clusters (one customer files three tickets). Compare the sample variance with the mean:

- variance ≈ mean: Poisson is a fair model;
- variance ≫ mean: **overdispersion**. Model hours separately (λ for 12–1 pm, λ for 3–4 pm), or use a wider distribution (the negative binomial).

## 4. Link to the binomial

A binomial with large `$n$` and small `$p$` looks like a Poisson with `$\lambda = np$`: 10,000 visitors each with a 0.03 % chance of reporting a bug is close to Poisson with λ = 3. This "law of rare events" is why the Poisson fits so many rare counts.

<div class="meaning">

<dl>
<dt>λ</dt><dd>The average count in the window (2 urgent tickets per hour).</dd>
<dt>P(X = k) = e^(−λ) λ^k ÷ k!</dt><dd>The chance of exactly k events in one window.</dd>
<dt>Mean = variance = λ</dt><dd>The SD is √λ, so busier windows wobble more in counts but less as a share.</dd>
<dt>Physical meaning</dt><dd>Poisson is what independent, steady arrivals look like: no memory, no planning. If your counts spread out much more than λ (overdispersion), arrivals are clumping, such as lunch rushes or one customer placing many orders.</dd>
</dl>

</div>

<div class="myth">

**"An average of 2 an hour means 2 every hour."** With λ = 2, about 14 % of hours have none at all and about 14 % have 4 or more. Staffing for the average leaves you short one hour in seven.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The rate.</b> On average 2 urgent tickets an hour; one person handles 3 an hour.</div>
<div class="step"><b>0 and 1.</b> P(0) = e⁻² ≈ 0.135; P(1) = 2e⁻² ≈ 0.271.</div>
<div class="step"><b>2 and 3.</b> P(2) = 4e⁻²/2 ≈ 0.271; P(3) = 8e⁻²/6 ≈ 0.180.</div>
<div class="step"><b>Add the manageable hours.</b> P(3 or fewer) ≈ 0.857.</div>
<div class="step"><b>Turn it round.</b> About 14 % of hours bring 4 or more: in a 40-hour week, about 6 overloaded hours.</div>
</div>

<div class="problem" data-problem="poisson-overload"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** chop the window into a huge number of tiny slices, each with a tiny chance of one event. The count is then binomial with enormous `$n$` and tiny `$p$`, which tends to the Poisson formula.

**Equations:** `$P(X=k) = \lambda^k e^{-\lambda}/k!$`, `$E[X] = \text{Var}(X) = \lambda$`. P(no events) = `$e^{-\lambda}$`.

**In code:** Excel `POISSON.DIST(k, λ, FALSE)` (exactly) or `TRUE` (k or fewer); Python `scipy.stats.poisson.pmf(k, lam)`.

**Try it:** λ = 3. P(0) = `$e^{-3}$` ≈ 0.050; P(1) = 3`$e^{-3}$` ≈ 0.149; P(2) = 9`$e^{-3}$`/2 ≈ 0.224.
</details>

## 5. Worked example

*Made-up numbers.* A help desk gets on average 2 urgent tickets per hour. One person can handle up to 3 an hour.

- P(0) = `$e^{-2}$` ≈ 0.135; P(1) = 2`$e^{-2}$` ≈ 0.271; P(2) = 4`$e^{-2}$`/2 ≈ 0.271; P(3) = 8`$e^{-2}$`/6 ≈ 0.180.
- P(X ≤ 3) ≈ 0.135 + 0.271 + 0.271 + 0.180 = **0.857**.
- P(more than 3) ≈ **14.3 %** of hours, about 1 hour in 7.
- Over a 40-hour week, expect about 40 × 0.143 ≈ **6 overloaded hours**.

If the target is "fewer than 1 overloaded hour a week", one person isn't enough at peak times, though the average (2 an hour) looks comfortable.

## 6. Practice

1. Errors average 0.5 a day. What is the chance of an error-free day?
2. Calls average 90 an hour. About what range covers most hours (± 2 SD)?
3. Daily complaints: mean 3.1, variance 3.0. Poisson or overdispersed?

<details>
<summary>Answers</summary>

1. `$e^{-0.5}$` ≈ 0.607, about 61 %.
2. SD = √90 ≈ 9.5, so about 71 to 109.
3. Variance ≈ mean, so a Poisson model is reasonable.
</details>

**Try it on your own data:** the [[distribution-explorer]] draws the Poisson for any λ and gives exact tail probabilities.

**New words:** *Poisson distribution*, *rate λ*, *overdispersion*, *law of rare events*.

<div class="keypoints">

- Poisson counts events in a fixed window at a steady average rate λ.
- P(X = k) = e^(−λ) λ^k ÷ k!; mean and variance are both λ.
- Scale λ with the window: 2 per hour is 16 per 8-hour shift.
- Variance far above the mean (overdispersion) means clumped events, so Poisson underestimates busy periods.

</div>
