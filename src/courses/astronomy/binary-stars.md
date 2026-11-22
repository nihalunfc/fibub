---
title: "Binary stars: weighing the stars"
seoTitle: "Binary stars and how to weigh a star | Astronomy"
summary: "Most stars have a partner. Two stars orbit their shared centre of mass, and Kepler's third law turns their orbit into their total mass. Radial velocities split it between them."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "In a binary, the heavier star:"
    choices: ["Moves in the bigger orbit", "Moves in the smaller orbit, more slowly", "Stays still"]
    ans: 1
    why: "Both circle the centre of mass, which lies closer to the heavier star."
  - q: "Two stars orbit with a = 4 AU and P = 4 years. Their total mass is:"
    choices: ["1 Sun", "4 Suns", "16 Suns"]
    ans: 1
    why: "M = a³/P² = 64/16 = 4 solar masses."
  - q: "An eclipsing binary is especially useful because:"
    choices: ["We see the orbit edge-on, so the full speeds and the star sizes can be measured", "It is always bright", "It doesn't move"]
    ans: 0
    why: "Eclipses only happen when the orbit is nearly edge-on, which removes the unknown tilt."
sources:
  - "Sirius A-B orbit (rounded) from published orbit solutions; values used in words only"
---

**Module 3 · about 25 minutes · Kepler's third law.** You'll be able to name the kinds of binary star, find a pair's total mass from its orbit, and split it using their speeds.

## 1. Why this matters

Mass is the most important number about a star: it decides its power, colour, lifetime and fate (Lesson 3.3). But you can't put a star on a scale. The only direct way to weigh it is to watch something orbit it, and for stars that means a partner star. Every mass-luminosity rule you have used was calibrated with binaries.

## 2. Three ways to spot a pair

- **Visual binaries**: both stars seen through a telescope, slowly orbiting over years or centuries ([Sky watching 5.3](/learn/courses/sky-watching/double-stars/)).
- **Spectroscopic binaries**: too close to split, but the spectral lines shift back and forth as the stars move towards and away from us (Lesson 1.4).
- **Eclipsing binaries**: the orbit is edge-on, so the stars take turns blocking each other and the total light dips regularly (Lesson 3.5).

<!--fig:binary-rv-->

Things to notice:

- The heavier star swings in a smaller circle and moves more slowly.
- The two velocity curves are mirror images; the ratio of their heights is the inverse of the mass ratio.
- Closer pairs orbit faster: shrink the separation and watch the period drop.

<details class="maths" open>
<summary>Maths and principle</summary>

**Kepler's third law with masses** (Lesson 2.2), with `$a$` in AU, `$P$` in years and masses in Suns:

```math
M_A + M_B = \frac{a^3}{P^2}
```

**Centre of mass:** each star's distance from it, and its speed, is in inverse ratio to its mass:

```math
\frac{M_A}{M_B} = \frac{a_B}{a_A} = \frac{v_B}{v_A}
```

**Visual binary distance:** if the orbit spans `$\alpha$` arcseconds at `$d$` parsecs, then `$a = \alpha\times d$` AU.
</details>

## 3. What it means physically

Each star pulls the other, so neither stays still: they balance like two children on a seesaw, the heavier one sitting closer to the middle. Gravity needs a certain amount of mass to keep a pair of a given size going round in a given time; that is all Kepler's law says. Measuring the size and the time therefore weighs the pair, and the seesaw balance tells you how the weight is shared.

## 4. Worked example

*Sirius B orbits Sirius A in 50.1 years. The orbit's size appears as 7.5″ at a distance of 2.64 pc. Weigh the pair.*

```math
a = 7.5\times2.64 = 19.8\ \text{AU}, \qquad M_A + M_B = \frac{19.8^3}{50.1^2} = \frac{7762}{2510} = 3.1\ M_\odot
```

Sirius A's orbit around the centre of mass is about half the size of B's, so `$M_A \approx 2M_B$`: about 2.1 and 1.0 Suns. Sirius B has the Sun's mass packed into a white dwarf the size of Earth (Lesson 3.6).

## 5. Practice

1. Two stars orbit each other with a = 10 AU in 20 years. What is their total mass?
2. In a spectroscopic binary, star A moves at 30 km/s and star B at 60 km/s. Which is heavier, and by how much?
3. Why can't a single spectroscopic binary usually give each star's exact mass?

<details>
<summary>Answers</summary>

1. `$1000/400 = 2.5$` Suns.
2. A is twice as heavy as B (it moves half as fast).
3. We don't know the tilt of the orbit, so we only measure part of the speed. Eclipses fix the tilt.
</details>

**Try it with real numbers:** measure pairs with the [[double-star-calculator]], and fit velocity curves with the [[radial-velocity-fitter]].

**New words:** *binary star*, *centre of mass*, *visual binary*, *spectroscopic binary*, *eclipsing binary*.
