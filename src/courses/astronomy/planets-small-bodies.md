---
title: "Planets, moons and small bodies of the solar system"
seoTitle: "Planets, asteroids and comets explained | Astronomy"
summary: "Rocky planets near the Sun, giant planets of gas and ice further out, and countless asteroids, comets and dwarf planets. Density and temperature, worked out from simple measurements, explain why."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Why are the inner planets rocky and the outer ones giant?"
    choices: ["Close to the young Sun only rock and metal could stay solid; further out ices froze too, and big cores grabbed gas", "The giants formed later", "The Sun's gravity crushed the inner planets"]
    ans: 0
    why: "Beyond the frost line, ice added extra solid material, so cores grew big enough to capture hydrogen and helium."
  - q: "Saturn's density is about 0.7 g/cm³. This tells us:"
    choices: ["It is mostly hydrogen and helium", "It has a large iron core only", "It is hollow"]
    ans: 0
    why: "Rock is about 3 g/cm³ and iron 8; such a low average means mostly light gases."
  - q: "Earth's equilibrium temperature is about 255 K, but its average surface is about 288 K. The difference is due to:"
    choices: ["The greenhouse effect of the atmosphere", "Heat from the Moon", "Earth's core only"]
    ans: 0
    why: "Gases such as water vapour and CO₂ trap outgoing infrared, warming the surface."
sources:
  - "Planet masses, radii, distances and Bond albedos (rounded): NASA Planetary Fact Sheet, nssdc.gsfc.nasa.gov"
  - "IAU 2006 Resolution B5 (definition of a planet)"
---

**Module 2 · about 25 minutes · read first: [2.1 Kepler's laws](/learn/courses/astronomy/keplers-laws/), [1.2 Blackbody radiation: colour is temperature](/learn/courses/astronomy/blackbody-radiation/) · maths: density and a temperature formula.** You'll be able to sort the planets into families, work out a planet's density and a simple temperature, and tell asteroids, comets and dwarf planets apart.

<div class="bigidea">Rocky planets formed near the Sun where only rock and metal could stay solid; giants formed further out where ice was plentiful; and density and temperature, worked out from simple measurements, tell the story.</div>

## 1. Why this matters

The solar system is the only planetary system we can visit. Its patterns, rocky worlds inside and giants outside, are the template we compare with thousands of exoplanets (Lesson 5.3). And the small bodies, asteroids and comets, are leftover building blocks that still carry the chemistry of the time the planets formed.

## 2. Families of worlds

- **Rocky planets**: Mercury, Venus, Earth and Mars. Small, dense, made of rock and metal.
- **Gas giants**: Jupiter and Saturn, mostly hydrogen and helium.
- **Ice giants**: Uranus and Neptune, with more water, ammonia and methane "ices" inside.
- **Dwarf planets**: round, orbiting the Sun, but not massive enough to clear their path (Ceres, Pluto, Eris).
- **Asteroids**: rocky and metallic bodies, mostly between Mars and Jupiter.
- **Comets**: icy bodies from the cold outer system. Near the Sun their ice turns to gas and they grow a glowing head and tails.

<!--fig:planets-compare-->

Things to notice:

- Density splits the planets cleanly into two groups.
- On log axes, the periods fall on a straight line of slope 1.5: Kepler's third law (Lesson 2.1).
- The simple temperature falls steadily with distance; real Venus and Earth are warmer because of their air.

Walk outwards through the Solar System:

<div class="steps">
<div class="step"><b>Mercury to Mars.</b> Small, dense worlds (4 to 5.5 g/cm³) of rock and iron, close enough to the Sun that ice boiled away.</div>
<div class="step"><b>The asteroid belt.</b> Rocky leftovers between Mars and Jupiter that never formed a planet.</div>
<div class="step"><b>The snow line.</b> Beyond about 3 AU it is cold enough for water ice. Solid material is suddenly plentiful and cores grow fast.</div>
<div class="step"><b>Jupiter and Saturn.</b> Big cores grabbed hydrogen and helium gas. Saturn's density, 0.69 g/cm³, is less than water.</div>
<div class="step"><b>Uranus, Neptune and beyond.</b> Ice giants, then the Kuiper belt of icy bodies like Pluto, and far out the source of comets.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Density** from mass and radius:

```math
\rho = \frac{M}{\tfrac{4}{3}\pi R^3}
```

**Equilibrium temperature**: a planet absorbs sunlight on its disc and radiates heat from its whole surface. With the Sun's temperature `$T_\odot$` and radius `$R_\odot$`, distance `$d$`, and albedo `$A$` (the fraction of light reflected):

```math
T_\text{eq} = T_\odot\sqrt{\frac{R_\odot}{2d}}\,(1 - A)^{1/4}
```

**Try it:** Earth, `$d = 1$` AU, `$A = 0.31$`: `$T_\text{eq} = 5772\times\sqrt{6.96\times10^8/(2\times1.496\times10^{11})}\times0.69^{1/4} = 5772\times0.0482\times0.911 = 254$` K.
</details>

Pick a planet and press Play. Compare how far from the Sun it can appear in our sky, and how much of it is lit.

<figure class="fig" data-fig="@astro-synodic"><figcaption>An inner planet (Mercury, Venus) never strays far from the Sun: it has a largest elongation and shows phases. An outer planet can stand opposite the Sun (opposition), when it is closest, brightest and up all night. The time between repeats (the synodic period) is longer than the planet's year.</figcaption></figure>

## 3. What it means physically

Near the young Sun it was too warm for ice, so only rock and metal could clump into solid lumps, and there was not much of them: the inner planets stayed small. Beyond the **frost line**, a little outside Mars's orbit today, water froze too, giving far more solid material. Cores grew to several Earth masses, heavy enough to pull in the abundant hydrogen and helium, and the giants were born. The temperature formula is energy balance: sunlight in equals infrared out.


<div class="meaning">

<dl>
<dt>ρ = M / (4/3 πR³)</dt><dd>Density: mass per volume, a clue to what a planet is made of.</dd>
<dt>A (albedo)</dt><dd>Fraction of sunlight a surface reflects.</dd>
<dt>T<sub>eq</sub> ∝ (1 − A)<sup>1/4</sup> / √d</dt><dd>Equilibrium temperature: falls with the square root of distance from the Sun.</dd>
<dt>Physical meaning</dt><dd>Density sorts worlds the way weight sorts luggage: a heavy small case is full of books, a light big one is full of clothes. Iron is about 8 g/cm³, rock 3, ice 1 and hydrogen gas much less, so one number says roughly what a planet is made of.</dd>
</dl>

</div>

<div class="myth">

**"Asteroid belts are crowded fields of rocks you must dodge."** Asteroids in our belt are typically hundreds of thousands of kilometres apart. Spacecraft cross the belt without steering around anything.

</div>

## 4. Worked example

*Earth has mass 5.97 × 10²⁴ kg and radius 6,371 km. What is its average density, and what does it say?*

```math
\rho = \frac{5.97\times10^{24}}{\tfrac{4}{3}\pi\times(6.371\times10^{6})^3} = \frac{5.97\times10^{24}}{1.083\times10^{21}} = 5{,}510\ \text{kg/m}^3 = 5.5\ \text{g/cm}^3
```

Surface rocks are about 2.7 to 3 g/cm³, so the inside must be much denser: an iron-nickel core.

## 5. Practice

<div class="problem" data-problem="planet-density"></div>

**More practice** (answers below):

1. Jupiter is 5.2 AU from the Sun with albedo 0.34. Estimate its equilibrium temperature using Earth's 254 K.
2. A small moon has mass 1 × 10¹⁶ kg and radius 11 km. What is its density, and what might it be made of?
3. What is the difference between a dwarf planet and an asteroid?

<details>
<summary>Answers</summary>

1. `$T \propto d^{-1/2}(1 - A)^{1/4}$`: `$254\times5.2^{-1/2}\times(0.66/0.69)^{1/4} = 254\times0.4385\times0.989 = 110$` K.
2. `$\rho = 10^{16}/(\tfrac{4}{3}\pi\times(1.1\times10^4)^3) = 1{,}790$` kg/m³, about 1.8 g/cm³: rock mixed with ice, or loose rubble with gaps (Mars's moon Phobos is like this).
3. A dwarf planet is massive enough for its gravity to pull it round; most asteroids are too small and stay lumpy.
</details>

<div class="keypoints">

- Inner planets are small, rocky and dense; outer planets are giant, gassy and icy.
- The snow line, about 3 AU, divides the two kinds.
- Density ρ = M / (4/3 πR³) tells rock from gas; Earth is 5.5 g/cm³.
- Equilibrium temperature falls as 1/√d and depends on albedo.

</div>

**Try it with real numbers:** compare the planets in the [[planet-data-explorer]], estimate impact craters with the [[impact-crater-calculator]], and keep Mars time with [[mars-time]].

**New words:** *rocky planet*, *gas giant*, *ice giant*, *dwarf planet*, *asteroid*, *comet*, *frost line*, *albedo*, *equilibrium temperature*.
