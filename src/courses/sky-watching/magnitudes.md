---
title: "How bright is it? The magnitude scale"
summary: "Astronomers measure brightness in magnitudes: smaller numbers are brighter, and 5 magnitudes is exactly 100 times in light. Learn to convert magnitudes to brightness ratios and back."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Star A is magnitude 1 and star B is magnitude 6. Which is brighter, and by how much?"
    choices: ["B, 5 times", "A, 100 times", "A, 5 times"]
    ans: 1
    why: "Smaller magnitude is brighter, and a difference of 5 magnitudes is a factor of exactly 100."
  - q: "One star gives 10 times the light of another. What is the magnitude difference?"
    choices: ["10", "2.5", "1"]
    ans: 1
    why: "Δm = 2.5 log10(10) = 2.5."
  - q: "Two stars of magnitude 3.0 are too close to separate by eye. What magnitude do they look together?"
    choices: ["6.0", "1.5", "about 2.25"]
    ans: 2
    why: "Twice the light is 2.5 log10(2) = 0.75 mag brighter: 3.0 − 0.75 = 2.25."
sources:
  - "Pogson's definition (1856): five magnitudes = factor 100 in flux"
  - "Reference magnitudes: Sun and Moon from NASA fact sheets (nssdc.gsfc.nasa.gov); Sirius and Polaris from the Yale Bright Star Catalogue"
---

**Module 1 · about 25 minutes · read first: [1.6 Constellations and star charts](/learn/courses/sky-watching/constellations/) · maths: logarithms (explained here).** You'll be able to read magnitudes, convert a magnitude difference into a brightness ratio and back, and combine the light of two stars.

<div class="bigidea">Brightness is measured in magnitudes: smaller numbers are brighter, and every 5 magnitudes is exactly 100 times in light, so each magnitude is about 2.5 times.</div>

## 1. Why this matters

Every star chart, telescope specification ("shows stars to magnitude 13"), variable-star report and research catalogue uses magnitudes. It is an odd scale, backwards and logarithmic, but once you know one formula it is easy, and it turns up again in photometry ([Astronomy 5.1](/learn/courses/astronomy/aperture-photometry/)) and the distance ladder (in the [cosmology course](/learn/courses/cosmology/)).

## 2. An old scale made exact

Around 130 BC Hipparchus sorted naked-eye stars into six classes, from first magnitude (the brightest) to sixth (the faintest he could see). In 1856 Norman Pogson noticed that first-magnitude stars give roughly 100 times the light of sixth-magnitude stars, and made it a rule:

> **A difference of 5 magnitudes is exactly a factor of 100 in brightness.**

So 1 magnitude is a factor of `$100^{1/5} = 2.512$`. Two things to remember:

- **Smaller (or more negative) numbers are brighter.** Sirius is −1.5; the full Moon −12.7; the Sun −26.7.
- **The scale is logarithmic.** Equal steps in magnitude are equal *ratios* of brightness, which roughly matches how the eye judges brightness.

<!--fig:magnitude-scale-->

Things to notice:

- Set A to 1 and B to 6: 100 times. Set them 10 magnitudes apart: 10,000 times.
- From the faintest naked-eye stars (about 6.5) to the faintest things a space telescope has recorded (about 31) is about 24 magnitudes: a factor of around 6 billion.

Climb down the magnitude ladder:

<div class="steps">
<div class="step"><b>Magnitude 1.</b> The brightest stars, like Spica and Antares. Sirius is even brighter, at −1.46.</div>
<div class="step"><b>Magnitude 2.</b> 2.5 times fainter: Polaris and most stars of the Big Dipper.</div>
<div class="step"><b>Magnitude 6.</b> 100 times fainter than magnitude 1: the faintest stars a person sees from a dark site.</div>
<div class="step"><b>Magnitude 11.</b> Another 100 times fainter: within reach of a 10 cm telescope.</div>
<div class="step"><b>Adding stars.</b> Two magnitude 3 stars together shine as one of magnitude 2.25. Add the light, not the magnitudes.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** magnitudes compare the *flux* `$F$` (light energy arriving per second per square metre) of two objects on a logarithmic scale.

**Equations (Pogson's relation):**

```math
m_1 - m_2 = -2.5 \log_{10}\!\left(\frac{F_1}{F_2}\right) \qquad\Longleftrightarrow\qquad \frac{F_1}{F_2} = 10^{-0.4\,(m_1 - m_2)}
```

**Logarithm reminder:** `$\log_{10} x$` is the power you raise 10 to in order to get `$x$`. `$\log_{10} 100 = 2$`, `$\log_{10} 2 \approx 0.301$`.

**Combining two stars:** add the fluxes, not the magnitudes:

```math
m_\text{total} = -2.5 \log_{10}\!\left(10^{-0.4 m_1} + 10^{-0.4 m_2}\right)
```

**Try it:** how many times brighter is Sirius (−1.5) than Polaris (2.0)? `$10^{0.4 \times 3.5} = 10^{1.4} \approx 25$` times.
</details>

## 3. Apparent and absolute magnitude

Everything above is **apparent magnitude** `$m$`: how bright an object *looks* from Earth. A nearby dim star can look brighter than a distant luminous one. To compare stars fairly astronomers also use **absolute magnitude** `$M$`: how bright the star would look from a standard distance of 10 parsecs (32.6 light-years). The two are linked by the **distance modulus**, `$m - M = 5\log_{10}(d / 10\ \text{pc})$`, which [Astronomy 1.5](/learn/courses/astronomy/flux-luminosity/) derives from the inverse square law.


<div class="meaning">

<dl>
<dt>m₁ − m₂ = −2.5 log₁₀(F₁/F₂)</dt><dd>Pogson's rule: magnitude difference from the ratio of fluxes.</dd>
<dt>F₁/F₂ = 10<sup>0.4(m₂ − m₁)</sup></dt><dd>Brightness ratio from a magnitude difference.</dd>
<dt>M</dt><dd>Absolute magnitude: how bright the star would look from 10 parsecs.</dd>
<dt>Physical meaning</dt><dd>The scale is backwards and logarithmic because it began with the eye. Hipparchus ranked stars from "first class" (brightest) to "sixth class", and our eyes judge brightness by ratios, not differences. Pogson in 1856 made it exact: 5 steps = 100 times.</dd>
</dl>

</div>

<div class="myth">

**"A magnitude 2 star is twice as faint as a magnitude 1 star."** It is about 2.5 times fainter. Magnitudes are a logarithmic scale: each step multiplies the brightness by 2.512, and 5 steps make exactly 100 times.

</div>

Choose a star and slide its distance. Watch where the black curve crosses the naked-eye, binocular and telescope lines.

<figure class="fig" data-fig="@astro-magnitude-reach"><figcaption>Every 5 magnitudes is a factor 100 in brightness and the apparent magnitude gets 5 larger for every ten times the distance. A star's absolute magnitude (its brightness at 10 pc) tells you how far away it can still be seen.</figcaption></figure>

## 4. Worked example

*How faint can a telescope go?* Your eye's pupil is at most about 7 mm wide when dark-adapted. A 200 mm telescope collects light over an area `$(200/7)^2 = 816$` times larger. The gain in magnitudes:

```math
\Delta m = 2.5 \log_{10}(816) = 2.5 \times 2.91 = 7.3
```

So if you can see stars to magnitude 6.5 by eye, the telescope shows stars to roughly `$6.5 + 7.3 = 13.8$`. Real limits depend on sky darkness, magnification and experience, but this is how telescope makers get their figures (Lesson 4.2).

## 5. Practice

<div class="problem" data-problem="mag-ratio"></div>

**More practice** (answers below):

1. How many times brighter is a magnitude 0 star than a magnitude 4 star?
2. A variable star brightens by a factor of 4. How many magnitudes is that?
3. Mizar (2.2) and its companion Alcor (4.0) are close together. What is their combined magnitude?

<details>
<summary>Answers</summary>

1. `$10^{0.4 \times 4} = 10^{1.6} \approx 40$` times.
2. `$2.5 \log_{10} 4 = 2.5 \times 0.602 = 1.5$` magnitudes.
3. `$-2.5\log_{10}(10^{-0.88} + 10^{-1.6}) = -2.5 \log_{10}(0.1318 + 0.0251) = -2.5 \times (-0.805) = 2.01$`.
</details>

<div class="keypoints">

- Smaller (even negative) magnitudes are brighter.
- 5 magnitudes = 100 times; 1 magnitude ≈ 2.512 times.
- F₁/F₂ = 10<sup>0.4(m₂ − m₁)</sup>.
- Combine stars by adding fluxes, then convert back to magnitudes.

</div>

**Try it with real numbers:** convert between magnitudes and fluxes, or add up several stars, with the [[magnitude-flux-converter]].

**New words:** *apparent magnitude*, *absolute magnitude*, *flux*, *Pogson's relation*, *logarithm*, *limiting magnitude*.
