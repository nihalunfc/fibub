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
sources: []
---

**Module 5 · about 30 minutes · everything so far.** You'll be able to plan and carry out a small research project from question to write-up, using the methods of this course and fibub's tools.

## 1. Why this matters

Doing one project end to end teaches more than reading ten lessons. It shows where time really goes (calibration, checking, writing) and turns the methods into habits. And the result is real: a period, a transit time or a galaxy's mass that you measured and can defend.

## 2. Choose a project

<!--fig:capstone-plan-->

Things to notice:

- Each project starts with planning and ends with a check against known values.
- The galaxy project needs no telescope at all; it uses open archive data (Lesson 5.6).

## 3. What it means physically

Every project here measures something physical from light: how a star's size changes (its period), how big a planet is (its shadow), how much matter a galaxy holds (its spin). The steps are the same as professional research, only smaller: a question, data, calibration, a model, uncertainties and an honest write-up.

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

## 4. Worked example: a transit project in outline

1. **Question**: when exactly does the next transit of a known hot Jupiter happen, and how deep is it?
2. **Plan**: the transit planner gives the predicted time; the target must be above 30° for the whole event plus an hour either side ([Sky watching 2.6](/learn/courses/sky-watching/airmass/)).
3. **Data**: 300 exposures of 60 s, with darks and flats; three comparison stars of similar colour.
4. **Measure**: differential photometry gives a light curve with 0.004 mag scatter per point.
5. **Fit**: the transit fitter gives a depth of `$1.10 \pm 0.06\%$` and a mid-time 2.1 ± 0.8 minutes later than predicted.
6. **Check**: the catalogue depth is 1.07%: agreement within the error bar. The timing shift is under 3σ, so report it but don't claim a discovery.
7. **Share**: send the light curve to a transit-timing network (Lesson 5.9).

## 5. Practice

1. Write a one-sentence question for a variable star project.
2. Your depth comes out 1.40 ± 0.05% against a catalogue 1.07%. What would you check first?
3. What three things should every write-up state about the data?

<details>
<summary>Answers</summary>

1. For example: "What is the period of this RR Lyrae star to 0.001 days, and does it match the catalogue?"
2. Comparison stars (one may be variable or of a very different colour), the sky subtraction, and whether a nearby star leaked into the aperture.
3. When and where it was taken, with what instrument and settings, and how it was calibrated.
</details>

**Try it with real numbers:** start with the [[transit-planner]], the [[period-finder]] or the [[rotation-curve-fitter]].

**New words:** *research question*, *pipeline*, *validation*, *write-up*.
