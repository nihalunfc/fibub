---
title: "Speeding up or slowing down: the acceleration equation"
seoTitle: "Why is the universe's expansion speeding up? Explained"
summary: "The second Friedmann equation says what speeds the expansion up or slows it down. Why pressure adds to gravity, how a strange negative pressure makes gravity push, the deceleration parameter q0, and the 1998 discovery that the expansion is accelerating."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "In general relativity, what does pressure do to gravity?"
    choices: ["Positive pressure adds to gravity's pull; negative pressure pushes", "Nothing", "Pressure always cancels gravity"]
    ans: 0
    why: "The source of gravity's pull is ρ + 3p/c². Light's pressure makes it pull harder than matter; dark energy's negative pressure makes it push."
  - q: "What does a negative deceleration parameter q0 mean?"
    choices: ["The expansion is speeding up", "The universe is shrinking", "The expansion is slowing down"]
    ans: 0
    why: "q0 measures slowing; negative slowing is speeding up. Today q0 ≈ −0.53."
  - q: "Who found the accelerating expansion in 1998, and how?"
    choices: ["Two teams, by finding distant Type Ia supernovae fainter than expected", "One team, with a gravitational wave detector", "Astronauts on the Moon"]
    ans: 0
    why: "The Supernova Cosmology Project and the High-z Supernova Search Team; Perlmutter, Schmidt and Riess shared the 2011 Nobel Prize."
sources:
  - "A. G. Riess et al. (1998), Observational evidence from supernovae for an accelerating universe and a cosmological constant, AJ 116, 1009 https://doi.org/10.1086/300499"
  - "S. Perlmutter et al. (1999), Measurements of Ω and Λ from 42 high-redshift supernovae, ApJ 517, 565 https://doi.org/10.1086/307221"
  - "The Nobel Prize in Physics 2011, NobelPrize.org https://www.nobelprize.org/prizes/physics/2011/summary/"
---

**Module 5 · about 15 minutes.** Read first: [5.2 The Friedmann equation](/learn/courses/cosmology/friedmann-equation/) and [5.5 How each ingredient thins out](/learn/courses/cosmology/matter-radiation-dark-energy/). The Friedmann equation gives the speed of expansion; a second equation gives its acceleration. By the end you will be able to work out from the universe's contents whether its expansion is speeding up or slowing down.

<div class="bigidea">Ordinary matter and light always slow the expansion. Dark energy, with its negative pressure, does the opposite: it makes gravity push. Since about 6 billion years ago the push has been winning.</div>

## 1. The acceleration equation

The second of Friedmann's equations gives ä, the acceleration of the scale factor:

```math
\frac{\ddot a}{a} = -\frac{4\pi G}{3}\left(\rho + \frac{3p}{c^2}\right)
```

<div class="meaning">

<dl>
<dt>ä/a</dt><dd>the acceleration of the expansion: positive means speeding up, negative means slowing down</dd>
<dt>ρ</dt><dd>the density of everything (energy ÷ c²)</dd>
<dt>p</dt><dd>the pressure. In general relativity pressure has weight: it pulls too</dd>
<dt>Physical meaning</dt><dd>For matter p ≈ 0; for light p = ρc²/3, so light pulls twice as hard as matter of the same density. Anything with p below −ρc²/3 makes the bracket negative, and gravity becomes a push.</dd>
</dl>

</div>

## 2. Negative pressure: gravity that pushes

Dark energy, if it is a cosmological constant, has **p = −ρc²**: a tension, like a stretched rubber band. Put it in the bracket: ρ + 3(−ρ) = −2ρ. Gravity's pull becomes a push. The more space there is, the more dark energy, the stronger the push. That is why, once it takes over, the expansion speeds up without end.

Cosmologists sum it up in one number, the **deceleration parameter** q<sub>0</sub>, for today:

```math
q_0 = \frac{\Omega_m}{2} + \Omega_r - \Omega_\Lambda \approx \frac{0.31}{2} - 0.69 = -0.53
```

<figure class="fig" data-fig="deceleration"><figcaption>The size of the universe around today. The dashed line is a steady expansion rate. Slide matter and dark energy: with mostly matter the curve sags below the line (slowing); with today's mix it bends above it (speeding up). The readout gives q₀.</figcaption></figure>

<div class="problem" data-problem="q-zero"></div>

## 3. The 1998 surprise

Everyone expected the expansion to be slowing; the question was by how much. Two teams set out to measure it with distant Type Ia supernovae ([Lesson 2.4](/learn/courses/cosmology/type-ia-supernovae/)), standard candles visible across billions of light-years. A slowing universe would make distant supernovae a little brighter than a steady one. They found them about **25% fainter**: farther away than expected. The expansion is speeding up.

<div class="history">

**Two rival teams, one answer.** The Supernova Cosmology Project, led by Saul Perlmutter, and the High-z Supernova Search Team, led by Brian Schmidt with Adam Riess, raced each other with different methods and reached the same result in 1998. That gave it credibility fast. The three leaders shared the 2011 Nobel Prize in Physics. Riess has recalled that his first fits, without dark energy, asked for a negative amount of matter, and he assumed he had made a mistake.

</div>

Later checks agree: the cosmic microwave background, the size of the "sound ruler" in galaxy maps (Module 10) and the age of the oldest stars all need dark energy. The switch from slowing down to speeding up happened at redshift about 0.6, roughly 6 billion years ago.

<div class="myth">

**"Dark energy pushes galaxies apart like a wind."** It does not push on galaxies; it makes the expansion rate of space grow. Bound things like galaxies, stars and you are not affected. And "dark" only means we cannot see it; it is not dark matter (Module 8).

</div>

<div class="keypoints">

- The acceleration equation: ä/a = −(4πG/3)(ρ + 3p/c²). Pressure gravitates.
- Matter and radiation always slow the expansion; anything with pressure below −ρc²/3 speeds it up.
- A cosmological constant has p = −ρc²: gravity pushes, and the push grows as space grows.
- q<sub>0</sub> = Ω<sub>m</sub>/2 + Ω<sub>r</sub> − Ω<sub>Λ</sub> ≈ −0.53 today: speeding up.
- Found in 1998 from faint distant supernovae (Nobel 2011); speeding up for about the last 6 billion years.

</div>
