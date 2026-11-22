---
title: Type I and type II errors, and power
summary: 'Every test can go wrong two ways: a false alarm (type I, rate α) or a missed effect (type II, rate β). Power, 1 − β, is the chance of catching a real effect. What sets it, why 80 % is the usual target, and why underpowered tests mislead.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'A test declares a new page better when it truly makes no difference. Which error is that?'
    choices: ['Type I error (false positive)', 'Type II error (false negative)', 'Sampling bias']
    ans: 0
    why: 'Rejecting a true null is a type I error. Its rate is α, the significance level you chose.'
  - q: 'A test has 30 % power for the effect you care about. What does that mean?'
    choices: ['30 % of results will be false alarms', 'If the effect is real, the test has only a 30 % chance of detecting it', 'The effect is 30 % big']
    ans: 1
    why: 'Power is the chance of rejecting the null when a specific effect is real. At 30 %, the test usually misses it.'
  - q: 'Which change raises power without raising the false alarm rate?'
    choices: ['Raising α from 0.05 to 0.10', 'More people per group, or less noisy measurements', 'Stopping the test early when it looks good']
    ans: 1
    why: 'More data and less noise shrink the standard error. Raising α buys power with more false alarms, and stopping early inflates false alarms (Lesson 7.4).'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 7.4 Power calculations for a difference of means https://www.openintro.org/book/os/'
  - 'Cohen, J. (1992), A Power Primer, Psychological Bulletin 112(1), 155-159 https://doi.org/10.1037/0033-2909.112.1.155'
---

**Module 6 · about 25 minutes · school maths.** You'll be able to name the two kinds of test error, explain power and what sets it, and see why underpowered studies mislead.

<div class="bigidea">A test can raise a false alarm or miss a real effect; power is the chance it catches an effect of the size you care about.</div>

**In everyday terms:** a metal detector on a beach. Set it too sensitive and it beeps at bottle caps (type I errors). Set it too dull, or sweep too fast, and you walk past the gold ring (type II errors). Power is how often it beeps when a ring is really there.

## 1. Two ways to be wrong

| | Truth: no effect | Truth: real effect |
|---|---|---|
| Test says "significant" | **Type I error** (false positive), rate α | Correct: **power** = 1 − β |
| Test says "not significant" | Correct | **Type II error** (false negative), rate β |

You choose α directly (usually 5 %). β depends on the effect size, the noise and the sample size, so you control it by planning.

Business costs differ: a false positive ships a useless change (wasted build, possible harm); a false negative throws away a good idea. Neither is free.

## 2. Picturing power

<!--fig:power-curves-->

Left curve: where your measured difference lands if there's no effect. Right curve: where it lands if the effect is real. The cut-off is set by α on the left curve. Power is the share of the right curve beyond the cut-off. Pull the curves apart (bigger effect) or make them narrower (more people, less noise) and power rises.

## 3. What sets power

1. **Effect size** (bigger is easier to detect). You don't choose the truth, but you choose the **smallest effect worth detecting**.
2. **Noise** (σ): cleaner metrics, paired designs (Lesson 6.3) and adjusting for pre-period behaviour all cut noise.
3. **Sample size** `$n$`: power rises with `$\sqrt{n}$`.
4. **α**: a looser threshold gives more power but more false alarms.

Convention: plan for **80 % power** at α = 5 %, so a real effect of the size you care about is missed only 1 time in 5.

## 4. Why underpowered tests mislead

With low power:

- You'll usually miss real effects, and "not significant" gets misread as "no effect".
- When you *do* get significance, the estimate is usually **exaggerated**: only lucky, oversized results cross the line (the "winner's curse"). A test with 20 % power that finds +8 % lift may be looking at a true +3 %.
- A larger share of your "wins" are false positives (Bayes again, Lesson 2.2: if few ideas truly work and power is low, most significant results are flukes).

<div class="meaning">

<dl>
<dt>Type I error (α)</dt><dd>Calling an effect real when there is none: a false alarm.</dd>
<dt>Type II error (β)</dt><dd>Missing an effect that is real.</dd>
<dt>Power = 1 − β</dt><dd>Chance of detecting an effect of a given size.</dd>
<dt>What raises power</dt><dd>Bigger effect, bigger sample, less noise, larger α.</dd>
<dt>Physical meaning</dt><dd>An underpowered test is a coin toss dressed as science: even when the change works, it will usually say "no difference", and when it does say "win" the effect looks bigger than it really is.</dd>
</dl>

</div>

<div class="myth">

**"We found no significant effect, so the feature does nothing."** With 23 % power, a feature that works exactly as hoped is missed 3 times in 4. Check the power before reading anything into a null result.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The goal.</b> Orders average $60 (SD $30). A widget is worth it only for +$3 or more.</div>
<div class="step"><b>Effect in SDs.</b> d = 3 ÷ 30 = 0.1.</div>
<div class="step"><b>The plan.</b> 300 orders per group. SE of the difference = 30 × √(2/300) ≈ 2.45.</div>
<div class="step"><b>Signal over noise.</b> 3 ÷ 2.45 ≈ 1.22 SEs, short of the 1.96 needed.</div>
<div class="step"><b>Power.</b> Φ(1.22 − 1.96) = Φ(−0.74) ≈ 23 %. You need about 1,600 per group for 80 %.</div>
</div>

<div class="problem" data-problem="power-two-means"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** power is the probability that the test statistic lands beyond the cut-off when the true effect is `$\delta$`.

**Equation (two groups, means, two-sided, normal approximation):** with SE `$= \sigma\sqrt{2/n}$` for `$n$` per group,

```math
\text{power} \approx \Phi\!\left(\frac{|\delta|}{\text{SE}} - z_{1-\alpha/2}\right)
```

Solving for 80 % power at α = 0.05 (`$z$` values 1.96 and 0.84) gives the planning formula

```math
n \text{ per group} = \frac{2\,(1.96 + 0.84)^2\,\sigma^2}{\delta^2} \approx \frac{16\,\sigma^2}{\delta^2}
```

**Lehr's rule:** about `$16/d^2$` per group, where `$d = \delta/\sigma$`. For d = 0.5: 64 per group; d = 0.2: 400; d = 0.1: 1,600.
</details>

## 5. Worked example

*Made-up numbers.* Average order is $60 with SD $30. A new recommendation widget is worth building only if it lifts the average by at least $3 (5 %).

- d = 3 ÷ 30 = 0.1. Per group ≈ 16 ÷ 0.01 = **1,600 orders** (exact formula: 1,570).
- The team planned 300 per group. Power then is Φ(3 ÷ (30 × √(2/300)) − 1.96) = Φ(1.22 − 1.96) = Φ(−0.74) ≈ **23 %**.
- So even if the widget works exactly as hoped, a 300-per-group test misses it more than 3 times in 4. Either run longer, cut noise (compare each customer's order with their own past average), or accept that only a bigger effect would be detectable.

## 6. Practice

1. α = 0.05, power = 0.9. What is β?
2. Using Lehr's rule, how many per group for d = 0.25?
3. A test with 25 % power finds a significant +12 % lift. Why be cautious?

<details>
<summary>Answers</summary>

1. 0.1.
2. 16 ÷ 0.0625 = 256.
3. With low power, only unusually large estimates reach significance, so +12 % likely overstates the true effect, and the chance it's a false positive is higher than with a well-powered test.
</details>

**Try it on your own data:** the [[sample-size]] calculator plans n for a chosen power, and the [[hypothesis-tests]] tool reports power for a finished test.

**New words:** *type I error*, *type II error*, *false positive*, *false negative*, *power*, *β*, *minimum detectable effect*, *winner's curse*.

<div class="keypoints">

- α = false-alarm rate; β = miss rate; power = 1 − β.
- Power grows with effect size, sample size and lower noise.
- Plan for 80 % power at the smallest effect worth acting on.
- Low power makes both misses and exaggerated "wins" more likely.

</div>
