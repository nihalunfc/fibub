---
title: "Pro-am science: how amateurs contribute to research"
seoTitle: "Pro-am astronomy: how amateurs help research | Astronomy"
summary: "Amateurs discover comets and supernovae, time exoplanet transits and asteroid occultations, monitor variable stars and classify galaxies online. Networks spread around the world catch what one observer would miss."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "Why do observing campaigns want observers in many countries?"
    choices: ["To fill the gaps when it is daytime or cloudy at any one place", "To share the cost of telescopes", "Because each country sees different stars only"]
    ans: 0
    why: "Spreading observers in longitude and weather gives near-continuous coverage."
  - q: "Which of these do amateurs regularly contribute?"
    choices: ["Variable star brightness estimates", "Running the James Webb Space Telescope", "Building particle accelerators"]
    ans: 0
    why: "Organisations such as the AAVSO hold tens of millions of amateur observations used by professionals."
  - q: "What makes an amateur observation useful to researchers?"
    choices: ["A beautiful colour picture", "Accurate times, calibrated measurements and honest error bars, sent in a standard format", "Using the biggest telescope possible"]
    ans: 1
    why: "Science needs numbers others can trust and combine."
sources:
  - "AAVSO (aavso.org), IOTA occultation network (occultations.org), Zooniverse (zooniverse.org), ExoClock (exoclock.space): programmes described in words"
---

**Module 5 · about 20 minutes · read first: [5.1 Aperture photometry](/learn/courses/astronomy/aperture-photometry/), [Sky watching 5.4 Variable stars: making a brightness estimate](/learn/courses/sky-watching/variable-star-estimates/) · maths: coverage and timing.** You'll be able to name ways amateurs contribute to research, explain why networks matter, and get a measurement ready to submit.

<div class="bigidea">Amateurs make real discoveries, timing transits and occultations, monitoring variable stars and finding supernovae, because networks spread around the world catch what one observer alone would miss.</div>

## 1. Why this matters

Astronomy is one of the few sciences where amateurs still make discoveries. Professionals have big telescopes but little time on them; amateurs have many small telescopes, flexible schedules and wide spread across the globe. Together they cover the sky in ways neither could alone, and your skills from this course are exactly what is needed.

## 2. Ways to take part

- **Variable stars**: brightness estimates and photometry ([Sky watching 5.4](/learn/courses/sky-watching/variable-star-estimates/), Lesson 5.1), sent to the AAVSO.
- **Exoplanet transits**: timing known planets so their predicted transits stay accurate for space telescopes (Lesson 5.3).
- **Occultations**: timing when an asteroid blocks a star, from many sites, to map its shape.
- **Discoveries**: comets, novae and supernovae, by patrolling the sky.
- **Meteors and fireballs**: camera networks that track meteorites to the ground.
- **Online projects**: classifying galaxies, finding planets in light curves, spotting asteroids in survey images, from any computer.

<!--fig:coverage-->

Things to notice:

- One observer catches only their own night, and only when it's clear.
- Spreading observers around the world fills the gaps; adding more in one place helps much less.

See why a network beats a single observer:

<div class="steps">
<div class="step"><b>The event.</b> An asteroid will pass in front of a star for 4 seconds, along a shadow path 60 km wide.</div>
<div class="step"><b>One observer.</b> A 60% chance of clear sky, and if clouds come, the event is lost forever.</div>
<div class="step"><b>Four observers along the path.</b> The chance that all four are clouded out is 0.4⁴ = 0.026, so 97% that someone sees it.</div>
<div class="step"><b>Timing.</b> Each clear observer records when the star vanished and returned, to 0.1 s. The shadow moves at 5 km/s, so each chord is measured to 0.5 km.</div>
<div class="step"><b>Result.</b> Line up the chords and you have the asteroid's outline, from backyard telescopes.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Chance that at least one of `$n$` independent sites is clear**, if each is clear with probability `$p$`:

```math
P = 1 - (1 - p)^n
```

**Timing accuracy**: for an occultation, a shadow moving at `$v$` km/s timed to `$\Delta t$` seconds fixes the asteroid's edge to `$v\,\Delta t$` km.

**Try it:** four sites each 60% clear: `$1 - 0.4^4 = 0.97$`, a 97% chance someone sees it.
</details>

Click through the seven steps of a small project, from question to result.

<figure class="fig" data-fig="@astro-research-steps"><figcaption>Each box shows what you hold at that stage (the values are invented). Skipping the cleaning or the uncertainty step is the most common way to get a wrong answer.</figcaption></figure>

## 3. What it means physically

Time on Earth is local: when it's noon in one place it's midnight somewhere else, and weather is patchy. A network turns the planet itself into one big observatory that never closes. What makes it work is standards: everyone times with the same clock, uses comparison stars from the same catalogue and reports in the same format, so the measurements can be stitched together.


<div class="meaning">

<dl>
<dt>P = 1 − (1 − p)ⁿ</dt><dd>Chance at least one of n independent sites is clear.</dd>
<dt>v Δt</dt><dd>Distance accuracy from timing accuracy Δt for a shadow moving at v.</dd>
<dt>Coverage</dt><dd>Observers spread in longitude keep a target in view around the clock.</dd>
<dt>Physical meaning</dt><dd>The sky above any one place is cloudy, daylit or below the horizon most of the time. Spreading observers across the globe is like having many nets in the water instead of one: the chance of catching the fish grows quickly with every net.</dd>
</dl>

</div>

<div class="myth">

**"Amateur data are too poor to matter."** AAVSO light curves, occultation timings and amateur supernova discoveries are used in professional papers every year. Good method matters more than telescope size.

</div>

## 4. Worked example

*An asteroid's shadow crosses Earth at 8 km/s. Observers time the star's disappearance to ±0.1 s. How precisely does each chord measure the asteroid?*

```math
8\ \text{km/s}\times0.1\ \text{s} = 0.8\ \text{km}
```

With observers spaced a few km apart across the path, their chords outline the asteroid's shape to under a kilometre, better than many space-probe flybys manage for small asteroids.

## 5. Practice

<div class="problem" data-problem="network-clear"></div>

**More practice** (answers below):

1. Two sites, each 50% clear. What is the chance at least one sees an event?
2. Why should you report the time of an observation in UTC?
3. Name one online project you could join without a telescope.

<details>
<summary>Answers</summary>

1. `$1 - 0.5^2 = 0.75$`.
2. So observations from different time zones line up exactly.
3. Galaxy classification or planet hunting on Zooniverse (or similar).
</details>

<div class="keypoints">

- Amateurs contribute to variable stars (AAVSO), occultations (IOTA), transits, comets and supernovae.
- Networks beat clouds: P = 1 − (1 − p)ⁿ.
- Accurate timing (GPS) turns shadows into sizes: v Δt.
- Citizen science projects (Zooniverse) need only a web browser.

</div>

**Try it with real numbers:** keep standard records with the [[observing-log]] and [[variable-star-log]], and plan transits with the [[transit-planner]].

**New words:** *pro-am*, *observing campaign*, *occultation*, *chord*, *citizen science*, *AAVSO*.
