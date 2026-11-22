---
title: "Why the sky turns: daily motion and circumpolar stars"
summary: "Earth spins once a day, so the whole sky seems to turn around the celestial pole at 15° an hour. Stars close enough to the pole never set: they are circumpolar."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "How many degrees does the sky turn in 4 hours?"
    choices: ["15°", "60°", "90°"]
    ans: 1
    why: "The sky turns 360° in about 24 hours, so 15° per hour; 4 × 15° = 60°."
  - q: "From 50° N, which declination is the smallest a star can have and still be circumpolar?"
    choices: ["Above +40°", "Above +50°", "Above 0°"]
    ans: 0
    why: "A star is circumpolar when its declination is greater than 90° minus your latitude: 90 − 50 = 40°."
  - q: "Facing south from the Northern Hemisphere, which way do stars move?"
    choices: ["Left to right (east to west)", "Right to left (west to east)", "Straight up"]
    ans: 0
    why: "Stars rise in the east and set in the west. Facing south, east is on your left, so they move left to right."
sources:
  - "Sidereal rotation period of Earth (23 h 56 min 4 s): IERS, iers.org"
---

**Module 1 · about 20 minutes · a little arithmetic.** You'll be able to explain the sky's daily turning, work out how far it turns in a given time, and decide which stars never set from your latitude.

## 1. Why this matters

Every observing plan, every long-exposure photo and every telescope mount has to deal with one fact: the sky never stands still. Knowing how it turns tells you when an object will be highest, which ones you can see all year, and why a camera on a fixed tripod draws arcs instead of points.

## 2. It is us that turns

Earth spins west to east once a day. From the ground it looks the other way round: the Sun, Moon and stars rise in the east, climb, cross the south (from the Northern Hemisphere) and set in the west. The whole celestial sphere seems to pivot about the celestial poles.

Relative to the stars Earth turns once every **23 hours 56 minutes** (a *sidereal day*; the 4-minute difference from 24 hours is Lesson 2.3). So the sky turns

```math
\frac{360^\circ}{24\ \text{h}} \approx 15^\circ \text{ per hour}
```

That is about one and a half fist-widths at arm's length every hour, or the Moon's own width every 2 minutes.

## 3. Star trails

Point a camera north, lock the shutter open, and every star draws an arc centred on the pole. Each arc has the same angle: 15° for every hour of exposure. Arcs close to the pole are small; arcs far from it are long and dip below the horizon.

<!--fig:star-trails-->

Things to notice:

- Push the exposure to 12 hours: stars near the pole draw complete rings and never touch the horizon.
- Lower your latitude: the pole sinks, the rings shrink and more stars dip below the horizon.

## 4. Circumpolar, rising and never seen

From latitude `$\varphi$` (north), every star falls in one of three groups:

| Declination `$\delta$` | What it does |
|---|---|
| `$\delta > 90^\circ - \varphi$` | **Circumpolar**: always above the horizon, circling the pole |
| `$\varphi - 90^\circ < \delta < 90^\circ - \varphi$` | Rises and sets each day |
| `$\delta < \varphi - 90^\circ$` | Never rises: you must travel south to see it |

From Toronto (44° N), stars north of +46° are circumpolar (the Big Dipper and Cassiopeia among them), and stars south of −46° never rise (the Southern Cross is at about −60°). From Singapore (1° N) almost the whole sky rises and sets, and almost nothing is circumpolar.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a star at declination `$\delta$` circles the pole at an angular distance of `$90^\circ - \delta$`. The pole is `$\varphi$` above the horizon. If the circle's radius is smaller than the pole's height, the star never reaches the horizon.

**Equation:** circumpolar when `$90^\circ - \delta < \varphi$`, that is `$\delta > 90^\circ - \varphi$`.

**Hours above the horizon:** the hour angle `$H_0$` at which a star sets satisfies

```math
\cos H_0 = -\tan\varphi \, \tan\delta, \qquad \text{hours up} = \frac{2 H_0}{15^\circ}
```

**Try it:** a star on the celestial equator (`$\delta = 0$`): `$\cos H_0 = 0$`, so `$H_0 = 90^\circ$` and it is up for `$2 \times 90 / 15 = 12$` hours, from any latitude.
</details>

## 5. Worked example

*From 40° N.* Vega has declination +38.8°.

- Circumpolar needs `$\delta > 90 - 40 = 50^\circ$`. Vega is not; it sets, briefly.
- Hours up: `$\cos H_0 = -\tan 40^\circ \tan 38.8^\circ = -0.839 \times 0.804 = -0.675$`, so `$H_0 = 132.4^\circ$`. Hours up `$= 2 \times 132.4 / 15 = 17.7$` hours.
- Highest altitude: `$90 - |40 - 38.8| = 88.8^\circ$`, almost overhead.

## 6. Practice

1. How long does the sky take to turn 45°?
2. From 60° N, is Capella (declination +46°) circumpolar?
3. From 30° S, which declinations never rise?

<details>
<summary>Answers</summary>

1. 45 ÷ 15 = 3 hours.
2. Circumpolar needs `$\delta > 30^\circ$`: yes.
3. In the south everything flips: stars with declination above `$90 - 30 = +60^\circ$` never rise.
</details>

**Try it on the real sky:** plan a star-trail photo with the [[star-trail-exposure]] tool, or see how high any object climbs tonight with [[object-altitude]].

**New words:** *daily (diurnal) motion*, *sidereal day*, *circumpolar*, *star trails*.
