---
title: "Planets that wander"
summary: "Planets drift slowly against the stars along the ecliptic, and now and then seem to loop backwards. That retrograde loop is Earth overtaking an outer planet, and it gave the first strong clue that Earth goes round the Sun."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "What causes Mars's retrograde loop?"
    choices: ["Mars really reverses its orbit", "Earth, moving faster on its inner orbit, overtakes Mars", "The Moon's gravity pulls Mars back"]
    ans: 1
    why: "From the faster-moving Earth, Mars appears to drift backwards against the far stars while we pass it."
  - q: "When is an outer planet best placed for viewing?"
    choices: ["At conjunction, near the Sun", "At opposition, opposite the Sun", "At greatest elongation"]
    ans: 1
    why: "At opposition the planet is closest to Earth, brightest, and up all night."
  - q: "Mars's orbital period is 687 days. About how often does Mars reach opposition?"
    choices: ["Every 365 days", "Every 687 days", "Every 780 days"]
    ans: 2
    why: "The synodic period is 1 / (1/365.26 − 1/687) ≈ 780 days, about every 2 years and 2 months."
sources:
  - "Planetary orbital periods and distances: NASA Planetary Fact Sheet, nssdc.gsfc.nasa.gov"
---

**Module 1 · about 25 minutes · a little algebra.** You'll be able to tell planets from stars, explain retrograde motion, and work out how often a planet returns to its best position.

## 1. Why this matters

"Planet" comes from the Greek for *wanderer*. Watching the planets move is the oldest piece of astronomical data analysis, and understanding their dance is how astronomers moved from an Earth-centred to a Sun-centred picture. For observers it answers practical questions: when is Jupiter best this year, and why is Venus only ever seen near sunrise or sunset?

## 2. Telling a planet from a star

- **Planets stay near the ecliptic**, the Sun's yearly path across the constellations (Lesson 2.2), because all the planets orbit in nearly the same plane.
- **Planets shine steadily** while stars twinkle. A star is a point, so every gust of air bends all its light at once; a planet is a tiny disc whose many points average out.
- **Planets move**: over a few weeks a planet visibly shifts against the background stars.

## 3. Inner and outer planets

**Mercury and Venus** orbit inside Earth's orbit, so from Earth they never stray far from the Sun. Venus reaches at most about 47° from the Sun (its *greatest elongation*), which is why it is the "evening star" or "morning star" and never seen at midnight.

**Mars, Jupiter, Saturn, Uranus and Neptune** orbit outside. They can be anywhere along the ecliptic, including opposite the Sun. That point, **opposition**, is when an outer planet is closest, brightest and up all night.

## 4. Retrograde loops

Most of the time an outer planet drifts eastward against the stars, as it moves along its orbit. But around opposition it seems to stop, drift *westward* for a few weeks, stop again, and resume. Ancient astronomers built complicated systems of circles on circles to copy this.

The simple explanation: Earth's inner orbit is shorter and faster. Around opposition we overtake the planet, just as a fast car on a motorway passing a slow one makes the slow one appear to slide backwards against distant hills.

<!--fig:retrograde-->

Things to notice:

- Retrograde motion happens only around opposition, when Earth passes between the Sun and Mars.
- Mars's loop lasts about 10 weeks. Jupiter and Saturn, further away and slower, loop for about 4 months each year.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** opposition repeats when Earth has gained one full lap on the planet. It is the same "two clock hands" sum as the synodic month in Lesson 1.4.

**Equation:** for an outer planet with orbital period `$P$` and Earth's year `$E$`,

```math
\frac{1}{S} = \frac{1}{E} - \frac{1}{P}
```

(for an inner planet swap the two terms, since it is the one lapping Earth).

**Try it:** Jupiter, `$P = 11.86$` years: `$1/S = 1 - 1/11.86 = 0.9157$`, so `$S = 1.092$` years: opposition comes about 33 days later each year.
</details>

## 5. Worked example

*Mars.* Orbital period 687 days, Earth 365.26 days.

```math
S = \frac{1}{1/365.26 - 1/687} = \frac{1}{0.0027378 - 0.0014556} = \frac{1}{0.0012822} \approx 780\ \text{days}
```

So Mars reaches opposition about every 2 years and 50 days. Between oppositions it sinks into the evening twilight, passes behind the Sun (conjunction) and is lost for months. Because Mars's orbit is noticeably oval, some oppositions are much closer than others: the closest ones, every 15 or 17 years, show Mars at nearly twice the apparent size of the farthest ones.

## 6. Practice

1. Saturn's period is 29.46 years. How many days between oppositions?
2. Venus's period is 224.7 days. How often does it return to the same phase in our sky?
3. Why can Venus never be seen opposite the Sun at midnight?

<details>
<summary>Answers</summary>

1. `$1/S = 1 - 1/29.46 = 0.9661$`, `$S = 1.035$` years, about 378 days.
2. Inner planet: `$1/S = 1/224.7 - 1/365.26$`, giving `$S \approx 584$` days.
3. Its orbit is inside ours, so from Earth it can never appear more than about 47° from the Sun.
</details>

**Try it on the real sky:** see where every planet is tonight with [[sky-tonight]], or compare their sizes, orbits and moons in the [[planet-data-explorer]].

**New words:** *ecliptic*, *opposition*, *conjunction*, *greatest elongation*, *retrograde motion*, *synodic period*.
