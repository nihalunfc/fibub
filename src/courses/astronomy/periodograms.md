---
title: "Periodograms: finding periods in messy data"
seoTitle: "Periodograms and finding periods in data | Astronomy"
summary: "Real observations come on scattered nights with noise. A periodogram tries every possible period and scores how well a repeating wave fits; the tallest honest peak is the period, but beware aliases caused by the daily gaps."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A periodogram shows:"
    choices: ["Brightness against time", "How well a repeating signal fits at each trial period", "The star's spectrum"]
    ans: 1
    why: "It scores each trial period; peaks mark periods that fit well."
  - q: "Why do night-only observations create false peaks near 1 day?"
    choices: ["Sampling once a day can't tell f from f ± 1 cycle per day", "The Moon changes the star", "Cameras cool at night"]
    ans: 0
    why: "Regular daily gaps make some periods look alike: these are aliases."
  - q: "Folding data on the right period gives:"
    choices: ["A scattered cloud", "A clean repeating curve", "A straight line"]
    ans: 1
    why: "Each point lands at its true phase, so the light curve's shape appears."
sources:
  - "Lomb, N. R. (1976), Ap&SS 39, 447; Scargle, J. D. (1982), ApJ 263, 835; VanderPlas, J. T. (2018), ApJS 236, 16"
---

**Module 5 · about 25 minutes · read first: [5.1 Aperture photometry](/learn/courses/astronomy/aperture-photometry/), [3.5 Pulsating stars and the period-luminosity law](/learn/courses/astronomy/variable-stars/) · maths: sine waves and phase.** You'll be able to fold a light curve on a trial period, read a periodogram, and recognise aliases.

<div class="bigidea">Real observations come on scattered nights with noise; a periodogram tries every possible period and scores how well a repeating wave fits, but daily gaps create false peaks called aliases.</div>

## 1. Why this matters

Many things in the sky repeat: pulsating stars, eclipsing binaries, spinning asteroids, planets crossing stars, stars wobbling as planets tug them. Finding the period is usually the first scientific result from a set of observations, and it can be done from a backyard or entirely from archive data.

## 2. Folding and scoring

**Folding**: pick a trial period `$P$` and replace each time with its **phase**, the fraction of a cycle since some start time. If `$P$` is right, all points line up into one clean curve. If it's wrong, they scatter.

**Periodogram**: do that for thousands of trial periods and give each a score: how much of the variation a sine wave at that period explains. Plot score against period. The **Lomb-Scargle periodogram** is the standard version for unevenly spaced data.

<!--fig:periodogram-->

Things to notice:

- The highest peak folds the data into a clean wave.
- Smaller peaks near the main one are aliases: periods that also fit fairly well because of the daily gaps.
- Halving or doubling the period can look almost as good for some stars (an eclipsing binary with two similar eclipses, for example).

Find the period of a variable star from 40 scattered nights:

<div class="steps">
<div class="step"><b>Raw data.</b> Plotted against date, the brightness looks like random dots: the nights are too far apart to see the cycle.</div>
<div class="step"><b>Guess a period and fold.</b> Take each time's remainder after dividing by the guessed period (its phase) and plot brightness against phase.</div>
<div class="step"><b>Wrong guess.</b> The folded dots stay a scattered cloud.</div>
<div class="step"><b>Right guess.</b> The dots line up into a clean light curve. The periodogram's score shoots up at this period.</div>
<div class="step"><b>Beware aliases.</b> Because data come once a night, f ± 1 cycle per day fit almost as well. Check the shape and, if possible, observe twice in one night.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Phase** of an observation at time `$t$`, for period `$P$` and start time `$t_0$`:

```math
\phi = \frac{t - t_0}{P} - \left\lfloor\frac{t - t_0}{P}\right\rfloor
```

**Sine model** at frequency `$f = 1/P$`: `$y(t) = a\sin(2\pi f t) + b\cos(2\pi f t) + c$`. Fit `$a, b, c$` by least squares (Lesson 5.7); the score is the fraction of the variance explained.

**Aliases**: data taken once a day can't tell frequency `$f$` from `$f \pm 1$` cycle per day, so false peaks appear at `$|f \pm 1|$`.

**Try it:** a true period of 0.5 day (`$f = 2$`/day) has aliases at `$f = 1$` and 3/day: periods of 1 day and 0.333 days.
</details>

## 3. What it means physically

A periodogram is like tuning a radio: you sweep through frequencies and listen for where the signal comes through loud. The gaps in your data (daytime, cloudy nights, the Moon) act like a comb laid over the signal, and the comb's own rhythm adds ghost stations. The cure is more varied sampling: observers in other countries (Lesson 5.9) or data from space.


<div class="meaning">

<dl>
<dt>φ = frac((t − t₀)/P)</dt><dd>Phase: how far through its cycle the star was at time t, from 0 to 1.</dd>
<dt>f = 1/P</dt><dd>Frequency: cycles per day.</dd>
<dt>|f ± 1|</dt><dd>Alias frequencies created by sampling once per day.</dd>
<dt>Physical meaning</dt><dd>It is like a strobe light on a spinning wheel. Flash at the right rhythm and the spokes stand still; flash at the wrong one and they blur. Folding the data is the strobe, and the periodogram tries every rhythm. A strobe once a day can also make a wheel look as if it turns at a different speed: that is an alias.</dd>
</dl>

</div>

<div class="myth">

**"The tallest peak in a periodogram is always the true period."** Daily, monthly and yearly gaps make alias peaks that can be taller than the real one. Check the folded light curve and test with data at different times of night.

</div>

## 4. Worked example

*A star's periodogram peaks at 0.833 days, with a second peak at 5.0 days. Are they related?*

```math
f_1 = \frac{1}{0.833} = 1.20\ \text{per day}, \qquad f_2 = \frac{1}{5.0} = 0.20\ \text{per day}
```

`$f_1 - f_2 = 1.00$` per day exactly: one is an alias of the other. Fold on both. The true period gives a smoother curve with less scatter; extra nights at different times of night settle it.

## 5. Practice

<div class="problem" data-problem="alias-period"></div>

**More practice** (answers below):

1. Find the phase of an observation at `$t = 10.7$` days for `$P = 3$` days and `$t_0 = 0$`.
2. A true period is 2 days. Where would the 1-day aliases fall?
3. Why are space telescopes like TESS less troubled by aliases?

<details>
<summary>Answers</summary>

1. `$10.7/3 = 3.567$`, so `$\phi = 0.567$`.
2. `$f = 0.5$`/day, so the aliases are at `$0.5 + 1 = 1.5$`/day (a period of 0.667 days) and `$|0.5 - 1| = 0.5$`/day, which is the true peak again.
3. They observe almost without gaps for weeks, so there is no daily comb.
</details>

<div class="keypoints">

- Folding at a trial period lines the data up only when the period is right.
- A periodogram scores every trial frequency; peaks mark likely periods.
- Once-a-day sampling makes aliases at f ± 1 cycle per day.
- Confirm a period by folding and by observing at varied times.

</div>

**Try it with real numbers:** run a periodogram on your own data with the [[period-finder]], and fit the solar cycle with the [[solar-cycle-fitter]].

**New words:** *periodogram*, *Lomb-Scargle*, *phase*, *folding*, *alias*, *frequency*.
