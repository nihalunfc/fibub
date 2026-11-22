---
title: "Galaxy types: spirals, ellipticals and irregulars"
seoTitle: "Types of galaxies: spiral, elliptical, irregular | Astronomy"
summary: "Edwin Hubble sorted galaxies by shape: ellipticals, spirals with or without a bar, and irregulars. Shape goes with colour and age: spirals are still making stars, ellipticals mostly stopped long ago."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "An elliptical galaxy is mostly:"
    choices: ["Young blue stars and lots of gas", "Old reddish stars with little gas", "Only dark matter"]
    ans: 1
    why: "Ellipticals used up or lost their gas long ago, so few new stars form."
  - q: "What does the 'B' mean in an SBb galaxy?"
    choices: ["Bright", "Barred", "Blue"]
    ans: 1
    why: "SB means a barred spiral; the letter after it describes the arms and bulge."
  - q: "The Andromeda Galaxy is about 2.5 million light-years away. When we look at it we see light that left it:"
    choices: ["Today", "2.5 million years ago", "2.5 billion years ago"]
    ans: 1
    why: "Light takes 2.5 million years to cross that distance, so we see it as it was then."
sources: []
---

**Module 4 · about 20 minutes · looking back in time.** You'll be able to sort galaxies by type, link shape to colour and star formation, and explain why looking far is looking back.

## 1. Why this matters

Galaxies are the building blocks of the universe. Their shapes are clues to their histories: quiet spirals that have grown slowly, giant ellipticals built by mergers, and irregulars shaken up by close encounters. Volunteers have sorted millions of galaxy images by eye in projects like Galaxy Zoo (Lesson 5.9), and the same skill trains machine-learning classifiers.

## 2. Hubble's sequence

- **Ellipticals (E0 to E7)**: smooth balls or rugby-ball shapes, the number showing how flattened they look.
- **Spirals (Sa, Sb, Sc)**: a disc with arms around a central bulge. Sa have big bulges and tightly wound arms; Sc small bulges and loose arms.
- **Barred spirals (SBa, SBb, SBc)**: the arms start from the ends of a bar of stars. The Milky Way is one.
- **Lenticulars (S0)**: a disc but no arms.
- **Irregulars**: no clear shape, like the Magellanic Clouds.

<!--fig:galaxy-shapes-->

Things to notice:

- A bigger bulge comes with more tightly wound arms in Hubble's scheme.
- Ellipticals glow yellow-red; spiral arms glow blue-white.

<details class="maths" open>
<summary>Maths and principle</summary>

**Look-back time**: light travelling a distance `$d$` takes `$t = d/c$`. For nearby galaxies that is simple:

```math
t\ (\text{years}) = d\ (\text{light-years})
```

For very distant galaxies the universe expanded while the light travelled, so distance and look-back time need a cosmological model (the [[cosmology-calculator]]).

**Apparent size**: a galaxy of diameter `$D$` at distance `$d$` spans an angle `$\theta \approx D/d$` radians ([Sky watching 5.2](/learn/courses/sky-watching/deep-sky/)).

**Try it:** Andromeda, about 150,000 ly across at 2.5 million ly: `$\theta = 0.06$` rad `$= 3.4°$`, about seven full Moons (though only the bright core shows to the eye).
</details>

## 3. What it means physically

Colour tells you about age, because blue stars are heavy and short-lived (Lesson 3.3). A galaxy full of blue light must have made stars recently, which needs cold gas; a red galaxy has run out. Galaxies also collide: when two spirals merge, their discs are scrambled and their gas burns in a burst of star formation, often leaving an elliptical. The Milky Way and Andromeda are expected to merge in several billion years.

## 4. Worked example

*A spiral galaxy 100,000 light-years across appears 2 arcminutes wide. How far is it, and when did its light leave?*

```math
\theta = \frac{2}{60}\times\frac{\pi}{180} = 5.8\times10^{-4}\ \text{rad}, \qquad d = \frac{D}{\theta} = \frac{100{,}000}{5.8\times10^{-4}} = 1.7\times10^{8}\ \text{ly}
```

About 170 million light-years. Its light left when dinosaurs walked on Earth.

## 5. Practice

1. Classify: a disc galaxy with a bar, a small bulge and loose arms.
2. Why do ellipticals look reddish?
3. A galaxy is 10 million light-years away. How old is the light we see?

<details>
<summary>Answers</summary>

1. SBc.
2. They have stopped forming stars, so the short-lived blue stars have died, leaving long-lived red and yellow ones.
3. 10 million years.
</details>

**Try it with real numbers:** practise sorting galaxies with [[galaxy-morphology-practice]].

**Go deeper:** how galaxies formed and grew is told in the [cosmology course](/learn/courses/cosmology/).

**New words:** *Hubble sequence*, *elliptical galaxy*, *spiral galaxy*, *barred spiral*, *lenticular*, *irregular galaxy*, *look-back time*, *galaxy merger*.
