---
title: "Kepler's three laws of planetary motion"
seoTitle: "Kepler's three laws explained simply | Astronomy"
summary: "Planets move on ellipses with the Sun at one focus, sweep equal areas in equal times, and take longer to go round the further out they are: P² = a³ with P in years and a in AU."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Where in its orbit does a planet move fastest?"
    choices: ["At aphelion, furthest from the Sun", "At perihelion, closest to the Sun", "It always moves at the same speed"]
    ans: 1
    why: "Equal areas in equal times means it must cover more distance per day when close to the Sun."
  - q: "An asteroid orbits with a = 4 AU. Its period is:"
    choices: ["4 years", "8 years", "16 years"]
    ans: 1
    why: "P = a^1.5 = 4^1.5 = 8 years."
  - q: "An orbit with eccentricity 0 is:"
    choices: ["A circle", "A straight line", "A very long ellipse"]
    ans: 0
    why: "e measures how stretched the ellipse is; e = 0 is a perfect circle."
sources:
  - "Halley's comet orbit (rounded a and e): JPL Small-Body Database, ssd.jpl.nasa.gov"
---

**Module 2 · about 25 minutes · read first: [Sky watching 1.5 Planets that wander](/learn/courses/sky-watching/wandering-planets/) · maths: ellipses and powers.** You'll be able to state Kepler's three laws, use P² = a³ to find a period or an orbit size, and work out the closest and furthest points of an orbit.

<div class="bigidea">Planets move on ellipses with the Sun at one focus, sweep out equal areas in equal times, and the further out they are the longer their year: P² = a³ in years and AU.</div>

## 1. Why this matters

Johannes Kepler spent years fitting Tycho Brahe's naked-eye measurements of Mars. In 1609 and 1619 he published three rules that describe every orbit in the solar system, and around other stars too. They let you predict where a planet, comet or spacecraft will be, and with Newton's help (Lesson 2.2) they let us weigh the Sun.

## 2. The three laws

1. **Orbits are ellipses** with the Sun at one focus (not the centre). An ellipse is a stretched circle; how stretched is its **eccentricity** `$e$`, from 0 (circle) towards 1 (very long).
2. **Equal areas in equal times.** A line from the Sun to the planet sweeps out the same area every day. So the planet speeds up when close and slows down when far.
3. **Period and size are linked.** The square of the time to go round equals the cube of the orbit's size.

<!--fig:kepler-orbit-->

Things to notice:

- At e = 0.5 the planet races through perihelion and crawls at aphelion. Press Play and watch.
- The two wedges cover equal time and equal area, even though their shapes are very different.
- Earth's orbit (e = 0.017) is so close to a circle that you couldn't tell it apart by eye.

Follow a comet round one orbit:

<div class="steps">
<div class="step"><b>Far out (aphelion).</b> The comet is at its furthest from the Sun and moving slowest, crawling along its path.</div>
<div class="step"><b>Falling in.</b> The Sun's pull speeds it up as it comes closer, like a ball rolling downhill.</div>
<div class="step"><b>Closest (perihelion).</b> Fastest point. In one week it sweeps a short, fat slice of area.</div>
<div class="step"><b>Equal areas.</b> At aphelion one week sweeps a long, thin slice. The two slices have exactly the same area: that is Kepler's second law.</div>
<div class="step"><b>The year.</b> If the orbit's semi-major axis is 4 AU, one lap takes √(4³) = 8 years.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Ellipse sizes.** `$a$` is the semi-major axis (half the longest width), the "size" of the orbit:

```math
r_\text{peri} = a(1 - e), \qquad r_\text{aph} = a(1 + e)
```

**Third law** for anything orbiting the Sun, with `$P$` in years and `$a$` in AU:

```math
P^2 = a^3 \qquad\Rightarrow\qquad P = a^{3/2}
```

For a star of `$M$` solar masses, `$P^2 = a^3 / M$` (Newton's version, Lesson 2.2).

**Try it:** Mars, `$a = 1.524$` AU: `$P = 1.524^{1.5} = 1.88$` years.
</details>

## 3. What it means physically

The equal-areas law is a rule about spin: nothing twists a planet round the Sun, so its "amount of turning" (angular momentum) stays fixed. Close in, the planet must swing faster to carry the same turning, like a skater pulling in their arms. The third law says outer planets are slower in two ways: they have further to go, and the Sun's pull is weaker out there, so they move more slowly along the way.


<div class="meaning">

<dl>
<dt>a</dt><dd>Semi-major axis: half the longest width of the ellipse, the orbit's "size".</dd>
<dt>e</dt><dd>Eccentricity: 0 is a circle, close to 1 is a long thin ellipse.</dd>
<dt>P² = a³</dt><dd>Third law for the Sun: P in years, a in AU.</dd>
<dt>Physical meaning</dt><dd>A planet trades height for speed like a skateboarder in a bowl: it speeds up as it falls towards the Sun and slows as it climbs away. The equal-area rule is that trade written down, and it holds because nothing twists the planet sideways (angular momentum is conserved).</dd>
</dl>

</div>

<div class="myth">

**"Earth has seasons because it is closer to the Sun in summer."** Earth is closest to the Sun in early January, during northern winter. Its orbit is nearly a circle (e = 0.017); seasons come from the tilt of its axis.

</div>

## 4. Worked example

*Halley's comet has a = 17.8 AU and e = 0.967. Find its period and its closest and furthest distances.*

```math
P = 17.8^{1.5} = 75.1\ \text{years}
```

```math
r_\text{peri} = 17.8\times(1 - 0.967) = 0.59\ \text{AU}, \qquad r_\text{aph} = 17.8\times1.967 = 35.0\ \text{AU}
```

It dips inside Venus's orbit, then swings out beyond Neptune. It last passed the Sun in 1986, so the next visit is due around 2061.

## 5. Practice

<div class="problem" data-problem="kepler-period"></div>

**More practice** (answers below):

1. Jupiter takes 11.86 years to orbit the Sun. What is its `$a$`?
2. A comet has perihelion 1 AU and aphelion 9 AU. Find `$a$`, `$e$` and `$P$`.
3. Earth's e is 0.017. How much closer to the Sun is Earth at perihelion than at aphelion, in percent?

<details>
<summary>Answers</summary>

1. `$a = 11.86^{2/3} = 5.20$` AU.
2. `$a = (1 + 9)/2 = 5$` AU; `$e = (9 - 1)/(9 + 1) = 0.8$`; `$P = 5^{1.5} = 11.2$` years.
3. `$r_\text{peri}/r_\text{aph} = 0.983/1.017 = 0.967$`, about 3.3% closer.
</details>

<div class="keypoints">

**Key points**

- Orbits are ellipses with the Sun at one focus (first law).
- A planet moves fastest at perihelion and slowest at aphelion (second law, equal areas).
- P² = a³ for anything orbiting the Sun (third law).
- Perihelion = a(1 − e), aphelion = a(1 + e).

</div>

**Try it with real numbers:** set up any orbit with the [[orbit-elements]] tool, and look up the planets in the [[planet-data-explorer]].

**New words:** *ellipse*, *focus*, *eccentricity*, *semi-major axis*, *perihelion*, *aphelion*, *angular momentum*.
