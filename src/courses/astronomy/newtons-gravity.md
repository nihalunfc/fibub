---
title: "Newton's gravity: why orbits work"
seoTitle: "Newton's law of gravity and orbits | Astronomy"
summary: "One force explains falling apples and orbiting moons. Gravity falls off as one over distance squared; an orbit is falling forever while moving sideways fast enough to keep missing the ground."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Astronauts float on the space station because:"
    choices: ["There is no gravity in space", "They and the station are falling together around Earth", "The station is above the air"]
    ans: 1
    why: "Gravity up there is still about 90% of surface gravity. Everything falls together, so nothing presses on anything."
  - q: "Double the distance between two bodies and gravity becomes:"
    choices: ["Half as strong", "A quarter as strong", "Twice as strong"]
    ans: 1
    why: "F ∝ 1/r², so 2² = 4 times weaker."
  - q: "Escape speed is how many times the circular orbit speed at the same distance?"
    choices: ["√2 ≈ 1.41", "2", "π"]
    ans: 0
    why: "v_esc = √(2GM/r) and v_circ = √(GM/r), so the ratio is √2."
sources:
  - "G (CODATA 2018), GM of the Sun and Earth (IAU 2015 nominal values)"
---

**Module 2 · about 25 minutes · read first: [2.1 Kepler's laws](/learn/courses/astronomy/keplers-laws/) · maths: square roots.** You'll be able to use Newton's law of gravity, explain why an orbit is a kind of falling, and work out orbital and escape speeds.

<div class="bigidea">The force that drops an apple also holds the Moon: gravity falls as one over distance squared, and an orbit is simply falling forever while moving sideways fast enough to keep missing the ground.</div>

## 1. Why this matters

Kepler's laws say *how* planets move; Isaac Newton (1687) explained *why*. His one law of gravity explains planets, moons, tides, satellites and the paths of space probes. Better still, it turns orbits into scales: from how fast something orbits you can weigh what it orbits, from the Sun to distant galaxies (in the [cosmology course](/learn/courses/cosmology/)).

## 2. Falling around the world

Newton imagined a cannon on a very tall mountain. Fire a ball slowly and it curves to the ground. Fire it faster and it lands further away. Fire it fast enough and the ground curves away beneath it as fast as it falls: it never lands. That is an orbit, and it is why astronauts feel weightless. They are falling all the time, along with their station.

<!--fig:orbit-speed-->

Things to notice:

- Below about 7.7 km/s (at this height) the ball always hits the ground.
- At the circular speed the path is a circle; a bit faster and it becomes an ellipse, rising high on the far side.
- At √2 times the circular speed the ellipse opens out completely and the ball escapes.

Newton's cannon on a very tall mountain:

<div class="steps">
<div class="step"><b>A slow shot.</b> Fire a ball sideways at 1 km/s. Gravity bends its path and it lands a few hundred kilometres away.</div>
<div class="step"><b>Faster.</b> At 5 km/s it lands thousands of kilometres away; Earth's surface curves away beneath it as it falls.</div>
<div class="step"><b>Just right: 7.9 km/s.</b> The ground curves away exactly as fast as the ball falls. It never lands: it is in orbit.</div>
<div class="step"><b>Faster still.</b> At 10 km/s it swings out on an ellipse and comes back round.</div>
<div class="step"><b>11.2 km/s.</b> Escape speed: the ball leaves Earth for good.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Newton's law of gravity** between masses `$M$` and `$m$` a distance `$r$` apart, with `$G = 6.674\times10^{-11}$` N m² kg⁻²:

```math
F = \frac{G M m}{r^2}
```

**Circular orbit:** gravity supplies exactly the pull needed to bend the path into a circle, `$GMm/r^2 = m v^2/r$`:

```math
v_\text{circ} = \sqrt{\frac{GM}{r}}, \qquad v_\text{esc} = \sqrt{\frac{2GM}{r}}
```

**Kepler's third law, Newton's version:**

```math
P^2 = \frac{4\pi^2}{G M}\,a^3
```

**Try it:** Earth around the Sun, `$GM_\odot = 1.327\times10^{20}$` m³/s², `$r = 1.496\times10^{11}$` m: `$v = \sqrt{1.327\times10^{20}/1.496\times10^{11}} = 29.8$` km/s.
</details>

## 3. What it means physically

Gravity weakens with distance squared for the same reason light does (Lesson 1.5): its influence spreads over a sphere. The small mass `$m$` cancels out of the orbit formula, which is why a feather and a space station at the same height orbit at the same speed. And because only the central mass `$M$` is left, measuring `$a$` and `$P$` of any orbiting thing weighs the central body.


<div class="meaning">

<dl>
<dt>F = GMm / r²</dt><dd>Gravity between two masses; double the distance, a quarter of the pull.</dd>
<dt>v = √(GM / r)</dt><dd>Speed for a circular orbit at distance r from the centre.</dd>
<dt>v<sub>esc</sub> = √(2GM / r)</dt><dd>Speed needed to escape completely; always √2 times the circular speed.</dd>
<dt>Physical meaning</dt><dd>Astronauts in the space station float not because there is no gravity there (it is 90% as strong as on the ground) but because they and the station are falling together around Earth. Orbit is free fall with a sideways head start.</dd>
</dl>

</div>

<div class="myth">

**"There is no gravity in space."** Gravity reaches everywhere, just weaker with distance. The Sun's gravity holds Neptune 4.5 billion km away. Astronauts feel weightless because they are falling freely, not because gravity has stopped.

</div>

## 4. Worked example

*Weigh the Sun from Earth's orbit: a = 1.496 × 10¹¹ m, P = 365.26 days.*

```math
M = \frac{4\pi^2 a^3}{G P^2} = \frac{39.48\times(1.496\times10^{11})^3}{6.674\times10^{-11}\times(3.156\times10^{7})^2} = 1.99\times10^{30}\ \text{kg}
```

About 333,000 Earths. The same sum with the Moon's orbit weighs Earth.

## 5. Practice

<div class="problem" data-problem="orbit-speed"></div>

**More practice** (answers below):

1. The space station orbits about 420 km up (r = 6,800 km from Earth's centre; `$GM_\oplus = 3.986\times10^{14}$` m³/s²). How fast does it go, and how long is one orbit?
2. What is the escape speed from Earth's surface (r = 6,371 km)?
3. A moon orbits a planet at four times the distance of another moon. How do their periods compare?

<details>
<summary>Answers</summary>

1. `$v = \sqrt{3.986\times10^{14}/6.8\times10^6} = 7.66$` km/s; `$P = 2\pi r/v = 5{,}580$` s, about 93 minutes.
2. `$\sqrt{2\times3.986\times10^{14}/6.371\times10^6} = 11.2$` km/s.
3. `$P \propto a^{1.5}$`: `$4^{1.5} = 8$` times longer.
</details>

<div class="keypoints">

- Gravity: F = GMm / r², an inverse square law.
- Circular orbit speed v = √(GM / r); higher orbits are slower.
- Escape speed is √2 times the circular speed at the same place.
- Newton's form of Kepler's third law, P² = 4π²a³ / GM, weighs the central body.

</div>

**Try it with real numbers:** follow real satellites with the [[satellite-tracker]], and see how fast Jupiter's moons circle it with the [[jupiter-moons]] tool.

**New words:** *gravitational constant*, *inverse-square law*, *circular speed*, *escape speed*, *weightlessness*.
