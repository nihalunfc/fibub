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

**Module 1 · about 25 minutes · read first: [1.2 Why the sky turns: daily motion and circumpolar stars](/learn/courses/sky-watching/turning-sky/) · maths: a little geometry.** You'll be able to explain Moon phases, predict roughly when the Moon rises in each phase, and say why eclipses are rare.

<div class="bigidea">Half the Moon is always lit by the Sun; its phases show how much of that lit half faces us as it orbits, and eclipses happen only when Sun, Earth and Moon line up exactly.</div>

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

Drag the Moon's age to any phase, then turn the Earth with the time slider (or press Play). The flag is you.

<figure class="fig" data-fig="@astro-moon-clock"><figcaption>Full Moon rises as the Sun sets and is high at midnight; a first-quarter Moon is high at sunset and sets around midnight. The phase decides when the Moon is up, and each night it rises about 50 minutes later.</figcaption></figure>

## 3. Two kinds of month

The Moon goes round Earth once relative to the stars in **27.32 days** (the *sidereal month*). But in that time Earth has moved about 27° along its orbit, so the Sun's direction has shifted. The Moon needs about two more days to catch up to the same phase: the **synodic month**, new Moon to new Moon, is **29.53 days**.

Follow the Moon through one month:

<div class="steps">
<div class="step"><b>New Moon.</b> The Moon is between Earth and the Sun. Its lit half faces away: we see nothing.</div>
<div class="step"><b>Waxing crescent, then first quarter.</b> A week later it is 90° from the Sun: we see half the disc lit, high in the evening sky.</div>
<div class="step"><b>Full Moon.</b> Two weeks in, Earth is between: we see the whole lit half, rising at sunset.</div>
<div class="step"><b>Last quarter.</b> 270° round: the other half lit, rising around midnight.</div>
<div class="step"><b>Back to new.</b> 29.5 days after the start (the synodic month), slightly longer than the Moon's 27.3-day orbit because Earth has moved round the Sun meanwhile.</div>
</div>

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


<div class="meaning">

<dl>
<dt>ψ (elongation)</dt><dd>Angle between the Moon and the Sun in our sky: 0° new, 180° full.</dd>
<dt>k = (1 − cos ψ)/2</dt><dd>Fraction of the disc that is lit.</dd>
<dt>1/S = 1/27.32 − 1/365.26</dt><dd>Synodic month S = 29.53 days.</dd>
<dt>Physical meaning</dt><dd>Hold a ball at arm's length in a room with one lamp and turn slowly round. The ball always has a lit side facing the lamp, but you see it go from dark to crescent to full and back. The Moon does the same with the Sun as the lamp and you on Earth in the middle.</dd>
</dl>

</div>

<div class="myth">

**"The phases are caused by Earth's shadow."** Earth's shadow touches the Moon only during a lunar eclipse, at full Moon. Phases are simply our changing view of the Moon's sunlit half.

</div>

Choose a Moon age and press Play: the Earth turns under the two bulges, and the curve shows the tide at your place.

<figure class="fig" data-fig="@astro-tides"><figcaption>Two high tides a day because there is a bulge on the Moon side and one opposite. At new and full Moon the Sun's smaller bulges add up (spring tides); at the quarters they cross (neap tides). Bulges are drawn hugely exaggerated.</figcaption></figure>

## 4. Eclipses

A **solar eclipse** happens when the new Moon passes exactly in front of the Sun; a **lunar eclipse** when the full Moon passes through Earth's shadow. If the Moon's orbit lay in the same plane as Earth's, we would get both every month. In fact it is tilted by about **5.1°**, so usually the new Moon slips above or below the Sun and the full Moon misses Earth's shadow.

Eclipses can only happen when a new or full Moon falls near one of the two **nodes**, the points where the Moon's orbit crosses Earth's orbital plane. That lines up during two "eclipse seasons" a year, each about 35 days long, so there are at least four eclipses a year (some of them faint partial ones), but any one place sees a total solar eclipse only every few hundred years on average.

A coincidence makes total solar eclipses possible: the Sun is about 400 times wider than the Moon but also about 400 times further away, so both look about half a degree across. When the Moon is near its furthest point it looks slightly smaller, and the eclipse is **annular**: a ring of Sun stays visible.

Press Play to run a year and then switch the Moon's orbit between tilted and not tilted. Watch the strip of new and full Moons.

<figure class="fig" data-fig="@astro-eclipse-nodes"><figcaption>With a flat orbit every new Moon would eclipse the Sun. The real orbit is tilted 5.1°, so only when a new or full Moon happens near a node does an eclipse happen: two clumps (eclipse seasons) a year, giving 4 to 7 eclipses in total.</figcaption></figure>

## 5. Worked example

*Rough planning.* A full Moon falls on the 5th of a month. When is the next new Moon, and when is the Moon out of the evening sky?

- Next new Moon: half a synodic month later, `$29.53 / 2 \approx 14.8$` days, so around the 20th.
- In the week around new Moon (roughly the 16th to 24th) the Moon is either a thin crescent near the Sun or absent: the darkest evenings for galaxies.
- The fraction lit 4 days after full (elongation about `$180 - 4 \times 12.2 = 131^\circ$`): `$k = (1 - \cos 131^\circ)/2 = 0.83$`.

## 6. Practice

<div class="problem" data-problem="moon-lit"></div>

**More practice** (answers below):

1. What phase rises around midnight?
2. How much of the disc is lit at elongation 60°?
3. Why can a lunar eclipse be seen from half the Earth at once, but a total solar eclipse only from a narrow strip?

<details>
<summary>Answers</summary>

1. Last quarter.
2. `$k = (1 - 0.5)/2 = 0.25$`: a crescent, a quarter lit.
3. During a lunar eclipse the Moon itself goes dark, so anyone who can see the Moon sees it. In a solar eclipse the Moon's small shadow (at most about 270 km wide for totality) sweeps over just a strip of Earth.
</details>

<div class="keypoints">

- Half the Moon is always lit; phases are how much of it faces us.
- Synodic month: 29.53 days from new Moon to new Moon.
- Fraction lit k = (1 − cos ψ)/2.
- Eclipses need an exact line-up; the Moon's orbit is tilted 5°, so most months miss.

</div>

**Try it on the real sky:** find upcoming eclipses for your town with the [[eclipse-finder]], and see Moon-free dark nights in the [[dark-sky-calendar]].

**New words:** *waxing*, *waning*, *gibbous*, *terminator*, *synodic month*, *sidereal month*, *node*, *annular eclipse*.
