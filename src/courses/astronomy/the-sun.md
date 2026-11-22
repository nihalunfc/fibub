---
title: "The Sun: our nearest star"
seoTitle: "The Sun, sunspots and the solar cycle | Astronomy"
summary: "The Sun turns 4 million tonnes of mass into energy every second by fusing hydrogen into helium. Its magnetic field drives an 11-year cycle of sunspots, flares and storms that reach Earth."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Sunspots look dark because they are:"
    choices: ["Holes in the Sun", "Cooler than the surface around them", "Shadows of planets"]
    ans: 1
    why: "At about 3,800 K against 5,800 K they give out only about a fifth as much light per area, so they look dark by contrast."
  - q: "The Sun's energy comes from:"
    choices: ["Burning, like coal", "Fusing hydrogen into helium in its core", "Slowly shrinking"]
    ans: 1
    why: "Nuclear fusion in the core turns a small amount of mass into a large amount of energy (E = mc²)."
  - q: "The safe way to look at sunspots with a telescope is:"
    choices: ["Through dark sunglasses", "With a certified solar filter over the front, or by projection", "Only at sunset"]
    ans: 1
    why: "Only a certified full-aperture solar filter or projection is safe. Never look at the Sun through an unfiltered telescope."
sources:
  - "IAU 2015 nominal solar values; sunspot number series: SILSO, Royal Observatory of Belgium (described, not copied)"
---

**Module 2 · about 25 minutes · E = mc² and the T⁴ law.** You'll be able to describe the Sun's layers, work out how much mass it turns into energy, and explain sunspots and the 11-year solar cycle.

**Safety first:** never look at the Sun through binoculars or a telescope without a certified solar filter fitted over the front. Even a moment can cause permanent eye damage. Projecting the image onto card is a safe alternative.

## 1. Why this matters

The Sun is the only star we can see as a disc, with weather on its surface. Everything we learn about it, its size, temperature, energy source and magnetic moods, is the key to understanding other stars (Module 3). And its storms can knock out satellites and power grids, so watching it has become practical "space weather" work, with a big role for amateurs counting sunspots.

## 2. Inside and outside the Sun

- **Core**: 15 million K, where hydrogen fuses into helium.
- **Radiative zone**: energy creeps outward as light bouncing from particle to particle, taking tens of thousands of years or more.
- **Convection zone**: hot gas rises and cool gas sinks, like a boiling pot.
- **Photosphere**: the visible surface, about 5,800 K, speckled with granules.
- **Chromosphere and corona**: thin outer layers, the corona at over a million K, seen during total eclipses.

Sunspots are places where tangled magnetic fields poke through the surface and block the rising heat. Their number rises and falls on a cycle of about 11 years.

<!--fig:solar-cycle-->

Things to notice:

- The record rises fast to a peak, then fades more slowly.
- Each cycle has a different height, so a model with one height can't match them all.
- Adjust the length and start: the typical miss drops sharply when the period is right, near 11 years.

<details class="maths" open>
<summary>Maths and principle</summary>

**Mass into energy** (Einstein): the Sun's power `$L_\odot = 3.83\times10^{26}$` W means it loses mass at

```math
\frac{\Delta m}{\Delta t} = \frac{L_\odot}{c^2} = \frac{3.83\times10^{26}}{(3.00\times10^{8})^2} = 4.26\times10^{9}\ \text{kg/s}
```

**Fusion in one line:** four hydrogen nuclei become one helium nucleus. Helium is 0.7% lighter than the four protons, and that missing mass is the energy released.

**Sunspot brightness** from the Stefan-Boltzmann law (Lesson 1.2): a spot at 3,800 K compared with 5,772 K gives out

```math
\left(\frac{3800}{5772}\right)^4 = 0.19
```

of the light per area: still very bright, just dark next to the rest.
</details>

## 3. What it means physically

The Sun is a balance. Gravity squeezes it inward; the heat from fusion pushes outward. If fusion sped up, the core would expand, cool and slow it down again, so the Sun is a self-regulating furnace that has shone steadily for 4.6 billion years. Its outer layers spin faster at the equator than near the poles, which winds up its magnetic field like an elastic band until it bursts out as spots, flares and mass ejections. Each cycle the field flips, so the full magnetic cycle is about 22 years.

## 4. Worked example

*How much hydrogen does the Sun fuse each second?*

Only 0.7% of the fused mass becomes energy, so the hydrogen used each second is

```math
\frac{4.26\times10^{9}\ \text{kg/s}}{0.007} = 6.1\times10^{11}\ \text{kg/s}
```

about 600 million tonnes of hydrogen per second. Even so, the Sun has enough hydrogen in its core for about another 5 billion years.

## 5. Practice

1. The full record shows peaks in roughly 2001, 2014 and 2025. What is the average cycle length from these?
2. How much mass has the Sun lost to radiation in a year (`$3.16\times10^7$` s)?
3. A spot at 4,200 K: what fraction of the normal surface brightness per area does it give?

<details>
<summary>Answers</summary>

1. 24 years over 2 cycles: about 12 years. (Cycle lengths vary between about 9 and 14 years; the average is about 11.)
2. `$4.26\times10^9\times3.16\times10^7 = 1.35\times10^{17}$` kg, tiny next to the Sun's `$2\times10^{30}$` kg.
3. `$(4200/5772)^4 = 0.28$`.
</details>

**Try it with real numbers:** count spots on a solar image with the [[sunspot-counter]], fit real cycles with the [[solar-cycle-fitter]], and find where the Sun is in your sky with the [[sun-position-calculator]].

**New words:** *photosphere*, *corona*, *nuclear fusion*, *convection zone*, *sunspot*, *solar cycle*, *space weather*.
