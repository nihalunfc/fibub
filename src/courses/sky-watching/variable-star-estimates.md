---
title: "Variable stars: making a brightness estimate"
summary: "Thousands of stars change brightness. With nothing but your eyes and a chart of comparison stars you can estimate a variable's magnitude to about a tenth, and your estimates join a century-long record used by professionals."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "In the fractional method, V is 2 steps fainter than comparison star A (5.2) and 1 step brighter than B (6.0). What is V?"
    choices: ["5.47", "5.73", "5.60"]
    ans: 1
    why: "V = 5.2 + (6.0 − 5.2) × 2/3 = 5.2 + 0.53 = 5.73."
  - q: "Why does averaging many observers' estimates help?"
    choices: ["Random errors partly cancel, falling as 1 over the square root of the number of estimates", "Experienced observers overrule beginners", "It makes the star brighter"]
    ans: 0
    why: "Independent random errors average down as 1/√n."
  - q: "Which organisation collects variable star observations from amateurs worldwide?"
    choices: ["AAVSO", "IAU", "ESA"]
    ans: 0
    why: "The American Association of Variable Star Observers runs the International Database used by researchers."
sources:
  - "American Association of Variable Star Observers (AAVSO), aavso.org: charts, comparison star sequences and the International Database"
---

**Module 5 · about 25 minutes · read first: [1.7 How bright is it? The magnitude scale](/learn/courses/sky-watching/magnitudes/), [5.3 Double stars](/learn/courses/sky-watching/double-stars/) · maths: ratios.** You'll be able to make a visual brightness estimate with two comparison stars, explain why light curves need many observers, and report an estimate in a useful form.

<div class="bigidea">With nothing but your eyes and a chart of comparison stars you can estimate a variable star's magnitude to about a tenth, and your estimates join a century-long record used by professionals.</div>

## 1. Why this matters

Variable stars are one of the few places where visual observers with modest gear still add data that professionals use: long records of Mira stars, outbursts of cataclysmic variables, and fades of R Coronae Borealis stars. It is also the gentlest introduction to photometry ([Astronomy 5.1](/learn/courses/astronomy/aperture-photometry/)).

## 2. Kinds of variable

- **Pulsating:** stars that swell and shrink. Mira-type variables change by 2.5 to 10 magnitudes over 80 to 1,000 days; Cepheids by about 1 magnitude over days ([Astronomy 3.5](/learn/courses/astronomy/variable-stars/)).
- **Eclipsing binaries:** two stars passing in front of each other, like Algol, which dims every 2.87 days.
- **Eruptive and cataclysmic:** sudden outbursts (novae, dwarf novae).

## 3. The method

Use a chart (for example from the AAVSO) that marks **comparison stars** with known magnitudes, written without decimal points so they aren't confused with stars: "52" means 5.2.

1. Find two comparison stars, one a bit brighter (A) and one a bit fainter (B) than the variable (V).
2. Judge where V falls between them, as a fraction: "V is 2 steps from A and 1 step from B".
3. Work out the magnitude; record the time (UT and JD, Lesson 2.4), the comparison stars used and the chart ID.

Keep the stars at similar altitudes (Lesson 2.6) and similar positions in the field; look at them in turn rather than at once.

Make one estimate of a variable star:

<div class="steps">
<div class="step"><b>Find the field.</b> Use an AAVSO chart; it marks comparison stars with their magnitudes (without decimal points, so 72 means 7.2).</div>
<div class="step"><b>Pick two.</b> One comparison a little brighter (A, 7.2) and one a little fainter (B, 8.0).</div>
<div class="step"><b>Judge the steps.</b> The variable looks 3 steps fainter than A and 1 step brighter than B.</div>
<div class="step"><b>Interpolate.</b> 7.2 + 0.8 × 3/4 = 7.8.</div>
<div class="step"><b>Report.</b> Send the estimate with the time in JD and the chart used. Averages of many observers are good to a few hundredths.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Fractional (interpolation) method:** if V is judged `$a$` steps from A and `$b$` steps from B,

```math
m_V = m_A + (m_B - m_A)\,\frac{a}{a+b}
```

**Why many observers:** each estimate has a random error of typically 0.1 to 0.3 mag. The average of `$n$` independent estimates has error about

```math
\sigma_{\bar m} = \frac{\sigma}{\sqrt n}
```

**Try it:** 16 observers each good to ±0.2 mag: average good to `$0.2/\sqrt{16} = 0.05$` mag.
</details>

<!--fig:variable-curve-->

Things to notice:

- With 1 observer the curve is ragged; with 20 the average follows the true curve closely.
- Halving each observer's error helps as much as quadrupling the number of observers.


<div class="meaning">

<dl>
<dt>m<sub>V</sub> = m<sub>A</sub> + (m<sub>B</sub> − m<sub>A</sub>) a/(a + b)</dt><dd>Fractional method: interpolate between two comparison stars.</dd>
<dt>σ / √n</dt><dd>Uncertainty of the average of n independent estimates.</dd>
<dt>JD</dt><dd>Julian date of the estimate (Lesson 2.4).</dd>
<dt>Physical meaning</dt><dd>Your eye is poor at saying how bright a star is on its own but very good at saying which of two nearby stars is brighter. Comparing with known stars right next to the variable cancels the sky, the air and your own eye.</dd>
</dl>

</div>

<div class="myth">

**"Visual estimates are useless now that cameras exist."** The AAVSO archive holds tens of millions of observations going back over a century, and visual estimates still fill gaps and catch outbursts that no robot telescope is watching.

</div>

## 4. Worked example

*A made-up estimate.* Comparison stars "62" (6.2) and "69" (6.9). The variable looks closer to the brighter: 1 step from 6.2, 3 steps from 6.9.

```math
m_V = 6.2 + (6.9 - 6.2) \times \frac{1}{1+3} = 6.2 + 0.175 = 6.4
```

(Round to one decimal: visual estimates aren't better than about 0.1 mag.) Report: date and time in UT, magnitude 6.4, comparison stars 62 and 69, chart ID, and any notes (Moon nearby, haze).

## 5. Practice

<div class="problem" data-problem="fraction-estimate"></div>

**More practice** (answers below):

1. V is exactly halfway between 7.4 and 8.0. What is its magnitude?
2. V is 3 steps from 4.8 and 2 steps from 5.3. What is V?
3. Why should you avoid comparison stars much lower in the sky than the variable?

<details>
<summary>Answers</summary>

1. 7.7.
2. `$4.8 + 0.5 \times 3/5 = 5.1$`.
3. They suffer more extinction (higher airmass), so they look fainter than their catalogue values, biasing your estimate.
</details>

<div class="keypoints">

- Compare the variable with charted stars just brighter and just fainter.
- Fractional method: m<sub>V</sub> = m<sub>A</sub> + (m<sub>B</sub> − m<sub>A</sub>) a/(a + b).
- Report to 0.1 mag with the JD and chart ID.
- Many observers average to much better precision: σ/√n.

</div>

**Try it with real numbers:** log your own estimates and plot a light curve with the [[variable-star-log]], and find a period from your data with the [[period-finder]].

**New words:** *variable star*, *comparison star*, *fractional method*, *light curve*, *Mira variable*, *eclipsing binary*, *AAVSO*.
