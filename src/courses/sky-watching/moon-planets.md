---
title: "The Moon and the planets"
summary: "The Moon, planets and their moons are the brightest and most detailed sights in a small telescope. Learn when each is best, what you can see, and why apparent size and phase change through the year."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Where on the Moon do craters show the most relief?"
    choices: ["Near the terminator, the line between day and night", "At the centre of the full Moon", "On the limb"]
    ans: 0
    why: "Near the terminator the Sun is low on the Moon's surface, so shadows are long."
  - q: "Jupiter is 142,984 km across and 4.2 AU away. About how big does it look?"
    choices: ["5″", "47″", "30′"]
    ans: 1
    why: "Angular size ≈ 206,265″ × 142,984 / (4.2 × 149.6 million) ≈ 47″."
  - q: "Why does Venus look largest when it is a thin crescent?"
    choices: ["It is closest to Earth then, near inferior conjunction", "Its atmosphere expands", "The Sun magnifies it"]
    ans: 0
    why: "The crescent phase happens when Venus is between us and the Sun, at its nearest."
sources:
  - "Planet diameters and distances: NASA Planetary Fact Sheet, nssdc.gsfc.nasa.gov"
---

**Module 5 · about 25 minutes · read first: [4.3 Focal length, f-ratio and magnification](/learn/courses/sky-watching/focal-length-magnification/), [1.5 Planets that wander](/learn/courses/sky-watching/wandering-planets/) · maths: the small-angle formula.** You'll be able to plan views of the Moon and planets, work out their apparent sizes, and explain why each changes through the year.

<div class="bigidea">The Moon, planets and their moons are the brightest and most detailed sights in a small telescope; how big they look changes with distance and phase, so timing matters.</div>

## 1. Why this matters

The Moon and planets are bright enough to observe from any city, they show detail even in small telescopes, and they change from night to night: a new storm on Jupiter, a moon's shadow, a dust storm on Mars. They are also where amateurs still contribute real science, from impact flashes on Jupiter to timing lunar features.

## 2. The Moon

- Best **not** at full Moon: the Sun is overhead for us and shadows vanish. Look along the **terminator**, where sunrise or sunset shadows make crater walls and mountain ranges stand out.
- Lunar maps label **maria** (dark lava plains), **craters**, **rilles** and **mountains**. Through a month the terminator sweeps across every feature twice.
- Always the same face: the Moon spins once per orbit (tidal locking). Slight wobbles (**libration**) let us see about 59% of its surface over time.

## 3. The planets

| Planet | What a small telescope shows |
|---|---|
| Mercury | A tiny phase, always in twilight near the Sun |
| Venus | Phases from gibbous to big crescent (no surface detail; cloud-covered) |
| Mars | Polar caps and dark markings for a few months around opposition |
| Jupiter | Cloud belts, the Great Red Spot, four bright moons that move night to night |
| Saturn | The rings, Titan and a few smaller moons |
| Uranus, Neptune | Small greenish or bluish discs |

Planets show discs, so use high magnification on steady nights (Lesson 3.3), and observe them high in the sky (Lesson 2.6).

<!--fig:venus-phases-->

Things to notice:

- Venus's size swings from about 10″ (full, far side of the Sun) to about 60″ (crescent, nearest us).
- Galileo saw this full set of phases in 1610. Only a Venus that goes round the Sun can show a full phase, which ruled out the old Earth-centred model in which Venus stayed between Earth and the Sun.

A tour of the Solar System through a 150 mm telescope:

<div class="steps">
<div class="step"><b>The Moon.</b> Best along the terminator, where shadows are long. Full Moon is flat and glaring.</div>
<div class="step"><b>Jupiter.</b> About 45″ at opposition: two dark belts at 50×, four moons in a line changing nightly, the Great Red Spot at 150×.</div>
<div class="step"><b>Saturn.</b> Rings at any power above 30×. The Cassini division on a steady night.</div>
<div class="step"><b>Mars.</b> Only 25″ even at a close opposition, and much smaller most of the time: catch it near opposition for the polar cap and dark markings.</div>
<div class="step"><b>Venus.</b> Shows phases like the Moon, from a big thin crescent to a small gibbous disc.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Small-angle formula:** an object of diameter `$d$` at distance `$r$` looks

```math
\theta \approx \frac{d}{r}\ \text{radians} = 206\,265'' \times \frac{d}{r}
```

**Opposition distance** of an outer planet with a circular orbit of radius `$a$` (AU): `$r = a - 1$`; at conjunction `$r = a + 1$`.

**Try it:** Mars (6,779 km across, `$a = 1.524$` AU) at a close opposition `$r \approx 0.524$` AU `$= 78.4$` million km: `$\theta = 206265 \times 6779 / 78.4\times10^6 = 17.8''$`. At conjunction (2.524 AU) only 3.7″.
</details>


<div class="meaning">

<dl>
<dt>θ ≈ 206,265″ × d / r</dt><dd>Apparent size of an object of diameter d at distance r.</dd>
<dt>r = a − 1 AU</dt><dd>Distance of an outer planet at opposition (circular orbits).</dd>
<dt>Terminator</dt><dd>Line between day and night on the Moon.</dd>
<dt>Physical meaning</dt><dd>How big a planet looks depends on its true size divided by its distance. Mars is small and swings from 0.4 AU to 2.6 AU away, so it changes size six-fold. Jupiter is huge and changes less, which is why it always rewards a look.</dd>
</dl>

</div>

<div class="myth">

**"Planets look like the colourful NASA pictures through a backyard telescope."** They look small, crisp and paler, with subtle detail that grows as your eye learns. Spacecraft images are taken up close and processed. The thrill is seeing the real thing with your own eye.

</div>

## 4. Worked example

*Is tonight good for Jupiter?* Suppose Jupiter is at opposition (`$r = 5.20 - 1 = 4.20$` AU, 628 million km), at altitude 55° from your site.

- Apparent size: `$206265 \times 142984 / 628\times10^6 = 47''$`.
- To make it look as big as the full Moon to the naked eye (1,870″), you'd need `$1870/47 \approx 40\times$`; for detail in the belts, 150× to 200× (Lesson 4.3).
- Airmass at 55°: `$1/\sin 55^\circ = 1.22$` (Lesson 2.6): low, good.

If the stars are twinkling hard, the seeing is poor and you'll see more at 120× than at 250×.

## 5. Practice

<div class="problem" data-problem="planet-size"></div>

**More practice** (answers below):

1. How big does Saturn's globe (120,536 km) look at 8.5 AU?
2. At which phases is the Moon best for viewing craters, and why?
3. Why can Mercury never be seen high in a dark sky?

<details>
<summary>Answers</summary>

1. `$206265 \times 120536 / (8.5 \times 149.6\times10^6) = 19.6''$`.
2. Crescent to gibbous, near the terminator, where shadows are long. At full Moon the Sun is straight overhead on the Moon, so there are few shadows.
3. It never gets more than about 28° from the Sun, so it is always low in twilight.
</details>

<div class="keypoints">

**Key points**

- Observe the Moon near the terminator, not at full.
- Outer planets are biggest at opposition: r = a − 1 AU.
- Apparent size θ = 206,265″ × d / r.
- Steady air matters more than aperture for planets.

</div>

**Try it on the real sky:** see which planets are up tonight with [[sky-tonight]], check positions of Jupiter's moons with the [[jupiter-moons]] tool, and compare planet sizes and orbits with the [[planet-data-explorer]].

**New words:** *terminator*, *maria*, *libration*, *tidal locking*, *opposition*, *apparent diameter*, *small-angle formula*.
