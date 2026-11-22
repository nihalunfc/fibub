---
title: "Moon phases and eclipses"
summary: "Half the Moon is always lit by the Sun. Phases show how much of that lit half faces us as the Moon orbits. Eclipses happen only when the Sun, Earth and Moon line up exactly, which the Moon's tilted orbit makes rare."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Why does the Moon have phases?"
    choices: ["Earth's shadow covers part of it", "We see different amounts of its sunlit half as it orbits", "The Moon makes its own light, which varies"]
    ans: 1
    why: "Earth's shadow only falls on the Moon during a lunar eclipse. Phases are about viewing angle."
  - q: "Roughly when does a full Moon rise?"
    choices: ["At sunrise", "At noon", "At sunset"]
    ans: 2
    why: "A full Moon is opposite the Sun in the sky, so it rises as the Sun sets."
  - q: "Why is there not a solar eclipse every new Moon?"
    choices: ["The Moon's orbit is tilted about 5° to Earth's", "The Moon is too small", "The Sun is too bright"]
    ans: 0
    why: "Most months the new Moon passes a little above or below the Sun. Eclipses need the Moon to be near a node of its orbit."
sources:
  - "Synodic month 29.530589 days, sidereal month 27.321662 days, orbital inclination 5.145°: NASA Moon Fact Sheet, nssdc.gsfc.nasa.gov"
---

**Module 1 · about 25 minutes · a little geometry.** You'll be able to explain Moon phases, predict roughly when the Moon rises in each phase, and say why eclipses are rare.

## 1. Why this matters

The Moon is the first thing most people look at through a telescope, and also the biggest enemy of deep-sky observing: a bright Moon washes out faint galaxies. Knowing the phase cycle lets you plan dark nights, catch the best lunar detail along the terminator, and understand eclipse predictions.

## 2. Half is always lit

The Moon makes no light; it reflects sunlight. At any moment the half facing the Sun is lit and the other half is dark. As the Moon orbits Earth, we see that lit half from different angles:

- **New Moon:** the Moon is between Earth and Sun. Its lit half faces away; we see nothing.
- **Crescent, first quarter, gibbous:** as it moves round, more of the lit half turns towards us.
- **Full Moon:** the Moon is on the far side of Earth from the Sun, and we see the whole lit half.
- Then it **wanes** back through gibbous, last quarter and crescent.

<!--fig:moon-phases-->

Things to notice:

- At first quarter the Moon is 90° from the Sun in the sky, and exactly half its disc is lit.
- The Moon rises about 50 minutes later each day. A first-quarter Moon rises around noon and is high at sunset; a full Moon rises at sunset; a last-quarter Moon rises around midnight.

## 3. Two kinds of month

The Moon goes round Earth once relative to the stars in **27.32 days** (the *sidereal month*). But in that time Earth has moved about 27° along its orbit, so the Sun's direction has shifted. The Moon needs about two more days to catch up to the same phase: the **synodic month**, new Moon to new Moon, is **29.53 days**.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** two clock hands moving at different rates line up again after a time set by the difference of their rates. The Moon goes round at `$360^\circ/27.32$` per day, the Sun's direction at `$360^\circ/365.26$` per day.

**Equation:**

```math
\frac{1}{S} = \frac{1}{P_\text{Moon}} - \frac{1}{P_\text{Earth}} \quad\Rightarrow\quad S = \frac{1}{1/27.32 - 1/365.26} = 29.53\ \text{days}
```

**Fraction lit:** if the Moon is at an angle `$\psi$` from the Sun as seen from Earth (its *elongation*, 0° at new, 180° at full), the fraction of the disc lit is about

```math
k = \frac{1 - \cos\psi}{2}
```

**Try it:** at first quarter `$\psi = 90^\circ$`, so `$k = (1 - 0)/2 = 0.5$`: half lit.
</details>

## 4. Eclipses

A **solar eclipse** happens when the new Moon passes exactly in front of the Sun; a **lunar eclipse** when the full Moon passes through Earth's shadow. If the Moon's orbit lay in the same plane as Earth's, we would get both every month. In fact it is tilted by about **5.1°**, so usually the new Moon slips above or below the Sun and the full Moon misses Earth's shadow.

Eclipses can only happen when a new or full Moon falls near one of the two **nodes**, the points where the Moon's orbit crosses Earth's orbital plane. That lines up during two "eclipse seasons" a year, each about 35 days long, so there are at least four eclipses a year (some of them faint partial ones), but any one place sees a total solar eclipse only every few hundred years on average.

A coincidence makes total solar eclipses possible: the Sun is about 400 times wider than the Moon but also about 400 times further away, so both look about half a degree across. When the Moon is near its furthest point it looks slightly smaller, and the eclipse is **annular**: a ring of Sun stays visible.

## 5. Worked example

*Rough planning.* A full Moon falls on the 5th of a month. When is the next new Moon, and when is the Moon out of the evening sky?

- Next new Moon: half a synodic month later, `$29.53 / 2 \approx 14.8$` days, so around the 20th.
- In the week around new Moon (roughly the 16th to 24th) the Moon is either a thin crescent near the Sun or absent: the darkest evenings for galaxies.
- The fraction lit 4 days after full (elongation about `$180 - 4 \times 12.2 = 131^\circ$`): `$k = (1 - \cos 131^\circ)/2 = 0.83$`.

## 6. Practice

1. What phase rises around midnight?
2. How much of the disc is lit at elongation 60°?
3. Why can a lunar eclipse be seen from half the Earth at once, but a total solar eclipse only from a narrow strip?

<details>
<summary>Answers</summary>

1. Last quarter.
2. `$k = (1 - 0.5)/2 = 0.25$`: a crescent, a quarter lit.
3. During a lunar eclipse the Moon itself goes dark, so anyone who can see the Moon sees it. In a solar eclipse the Moon's small shadow (at most about 270 km wide for totality) sweeps over just a strip of Earth.
</details>

**Try it on the real sky:** find upcoming eclipses for your town with the [[eclipse-finder]], and see Moon-free dark nights in the [[dark-sky-calendar]].

**New words:** *waxing*, *waning*, *gibbous*, *terminator*, *synodic month*, *sidereal month*, *node*, *annular eclipse*.
