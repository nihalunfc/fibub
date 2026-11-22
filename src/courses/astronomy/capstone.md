---
title: "Capstone: your own research project"
seoTitle: "Capstone: an amateur astronomy research project | Astronomy"
summary: "Put the course together in one small, real project: measure a variable star's period, time an exoplanet transit, or weigh a galaxy from archive data. Plan it, measure it, fit it with error bars and write it up."
minutes: 30
updated: 2026-11-22
quiz:
  - q: "The first step of any research project is:"
    choices: ["A clear question you can answer with the data you can get", "Buying a bigger telescope", "Writing the conclusion"]
    ans: 0
    why: "A sharp question decides what to measure, how much and how precisely."
  - q: "Why compare your result with a catalogue value?"
    choices: ["To check your method; agreement within errors builds trust", "To copy it", "It isn't useful"]
    ans: 0
    why: "Recovering a known answer shows your pipeline works before you trust it on something new."
  - q: "A good write-up includes:"
    choices: ["Only the final number", "Data, method, result with uncertainty, and what could be wrong", "Only pictures"]
    ans: 1
    why: "Others must be able to understand, check and repeat it."
sources:
  - "Exoplanet Transit Database (ETD), Czech Astronomical Society, var2.astro.cz/ETD"
  - "AAVSO, American Association of Variable Star Observers, observing guides, aavso.org"
  - "MAST, Mikulski Archive for Space Telescopes (TESS light curves), archive.stsci.edu"
---

**Module 5 · about 30 minutes · read first: [5.1 Aperture photometry](/learn/courses/astronomy/aperture-photometry/), [5.2 Time series and periodograms](/learn/courses/astronomy/periodograms/), [5.3 Finding exoplanets: transits and radial velocity](/learn/courses/astronomy/exoplanet-methods/), [5.7 Fitting models and honest error bars](/learn/courses/astronomy/fitting-errors/) · maths: everything so far.** You'll be able to plan and carry out a small research project from question to write-up, using the methods of this course and fibub's tools.

<div class="bigidea">A real project ties the course together: ask one clear question, get the data, measure it with error bars, fit a model, and write it up so someone else could repeat it.</div>

## 1. Why this matters

Doing one project end to end teaches more than reading ten lessons. It shows where time really goes (calibration, checking, writing) and turns the methods into habits. And the result is real: a period, a transit time or a galaxy's mass that you measured and can defend.

## 2. Choose a project

<!--fig:capstone-plan-->

Things to notice:

- Each project starts with planning and ends with a check against known values.
- The galaxy project needs no telescope at all; it uses open archive data (Lesson 5.6).

## 3. What it means physically

Every project here measures something physical from light: how a star's size changes (its period), how big a planet is (its shadow), how much matter a galaxy holds (its spin). The steps are the same as professional research, only smaller: a question, data, calibration, a model, uncertainties and an honest write-up.

Run a transit-timing project from start to finish:

<div class="steps">
<div class="step"><b>Question.</b> "Is the period of this hot Jupiter still what the discovery paper said?"</div>
<div class="step"><b>Data.</b> Your own images of one transit, or a TESS light curve from MAST.</div>
<div class="step"><b>Measure.</b> Differential aperture photometry against 3 comparison stars; magnitude errors from SNR.</div>
<div class="step"><b>Fit.</b> Fit the transit shape to get its mid-time with an uncertainty. Combine with the published time: period = gap ÷ number of orbits.</div>
<div class="step"><b>Write up.</b> Question, data, method, result with error bars, and a χ² check. Submit to ETD or an AAVSO section so it joins the professional record.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**The pieces you will use:**

- magnitudes and fluxes: `$m_1 - m_2 = -2.5\log_{10}(F_1/F_2)$` ([Sky watching 1.7](/learn/courses/sky-watching/magnitudes/))
- signal-to-noise: `$\sigma_m \approx 1.086/\text{SNR}$` (Lesson 5.1)
- phase folding and periodograms (Lesson 5.2)
- transit depth `$\delta = (R_p/R_\star)^2$` (Lesson 5.3)
- orbital mass `$M = v^2 r/G$` (Lesson 2.2)
- χ² and error propagation (Lesson 5.7)
</details>


<div class="meaning">

<dl>
<dt>Question</dt><dd>One measurable thing, with a yes/no or a number as the answer.</dd>
<dt>σ</dt><dd>Every number reported with its uncertainty.</dd>
<dt>Reproducible</dt><dd>Enough detail that someone else could repeat it and get the same answer.</dd>
<dt>Physical meaning</dt><dd>A capstone is a full round trip of science: from a question, through photons on a detector, to a number with honest error bars that others can check. Doing it once by yourself teaches more than reading about it ten times.</dd>
</dl>

</div>

<div class="myth">

**"You need a big telescope to do real research."** Transit timing, variable-star periods and archive projects can be done with a small telescope or with no telescope at all, using free archive data and Python.

</div>

## 4. Worked example: a transit project in outline

1. **Question**: when exactly does the next transit of a known hot Jupiter happen, and how deep is it?
2. **Plan**: the transit planner gives the predicted time; the target must be above 30° for the whole event plus an hour either side ([Sky watching 2.6](/learn/courses/sky-watching/airmass/)).
3. **Data**: 300 exposures of 60 s, with darks and flats; three comparison stars of similar colour.
4. **Measure**: differential photometry gives a light curve with 0.004 mag scatter per point.
5. **Fit**: the transit fitter gives a depth of `$1.10 \pm 0.06\%$` and a mid-time 2.1 ± 0.8 minutes later than predicted.
6. **Check**: the catalogue depth is 1.07%: agreement within the error bar. The timing shift is under 3σ, so report it but don't claim a discovery.
7. **Share**: send the light curve to a transit-timing network (Lesson 5.9).

## 5. Practice

<div class="problem" data-problem="transit-period"></div>

**More practice** (answers below):

1. Write a one-sentence question for a variable star project.
2. Your depth comes out 1.40 ± 0.05% against a catalogue 1.07%. What would you check first?
3. What three things should every write-up state about the data?

<details>
<summary>Answers</summary>

1. For example: "What is the period of this RR Lyrae star to 0.001 days, and does it match the catalogue?"
2. Comparison stars (one may be variable or of a very different colour), the sky subtraction, and whether a nearby star leaked into the aperture.
3. When and where it was taken, with what instrument and settings, and how it was calibrated.
</details>

<div class="keypoints">

- Start from one clear, measurable question.
- Use the full chain: calibrate, measure, fit, propagate errors.
- Timing many orbits apart gives very precise periods.
- Write it up reproducibly and share it with a pro-am network.

</div>

**Try it with real numbers:** start with the [[transit-planner]], the [[period-finder]] or the [[rotation-curve-fitter]].

**New words:** *research question*, *pipeline*, *validation*, *write-up*.
