---
title: "Seasons and the Sun's path"
summary: "Seasons come from Earth's 23.4° tilt, not its distance from the Sun. The tilt changes how high the noon Sun climbs and how long it stays up, and that sets how much warmth each square metre gets."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "What causes the seasons?"
    choices: ["Earth being closer to the Sun in summer", "Earth's axis being tilted 23.4° to its orbit", "The Sun getting hotter and cooler"]
    ans: 1
    why: "Earth is actually closest to the Sun in early January, during northern winter. The tilt is the cause."
  - q: "At 40° N, how high is the Sun at noon on the June solstice?"
    choices: ["50°", "73.4°", "26.6°"]
    ans: 1
    why: "Noon altitude = 90° − latitude + declination = 90 − 40 + 23.4 = 73.4°."
  - q: "On the equinoxes, how long is the day everywhere on Earth (ignoring the atmosphere)?"
    choices: ["12 hours", "It depends on latitude", "24 hours"]
    ans: 0
    why: "With the Sun on the celestial equator (declination 0°) it is up for exactly half a turn of the sky from any latitude."
sources:
  - "Earth's obliquity 23.44° and perihelion date: NASA Earth Fact Sheet, nssdc.gsfc.nasa.gov"
---

**Module 1 · about 25 minutes · some trigonometry.** You'll be able to explain the seasons, find the Sun's noon altitude on any date, and say why days are long in summer and why the far north gets midnight Sun.

## 1. Why this matters

Seasons decide when you can observe and for how long. A June night at 50° N may never get fully dark (Lesson 3.4), while a December night gives 14 hours of darkness. The same geometry tells a solar-panel owner how to tilt a panel and a photographer when the Milky Way's core is up.

## 2. The tilt, not the distance

Earth's axis is tilted **23.44°** from the perpendicular to its orbit, and it keeps pointing the same way (at Polaris) all year. So for half the year the Northern Hemisphere leans towards the Sun, and for the other half away.

A common mistake is to blame distance. Earth's orbit is nearly a circle: it is closest to the Sun (perihelion) in early January and furthest in early July, only about 3% different. And the hemispheres have opposite seasons at the same moment, which distance could never explain.

## 3. The Sun's declination through the year

Seen from Earth, the tilt makes the Sun slide north and south on the celestial sphere. Its declination swings between:

- **+23.44°** at the June solstice (about 21 June): Sun over the Tropic of Cancer.
- **0°** at the March and September equinoxes: Sun on the celestial equator.
- **−23.44°** at the December solstice (about 21 December): Sun over the Tropic of Capricorn.

A simple formula, good to about 1°, gives the declination on day `$n$` of the year:

```math
\delta_\odot \approx -23.44^\circ \cos\!\left( \frac{360^\circ}{365.25} (n + 10) \right)
```

## 4. High Sun, long days

Two effects make summer warm:

1. **The noon Sun is higher**, so its light hits the ground more squarely. A beam spread over twice the area delivers half the warmth per square metre.
2. **The Sun is up longer**, so there are more hours of heating than hours of cooling.

Move the sliders and compare your chosen day (thick line) with the solstices and equinox (thin lines).

<!--fig:sun-path-->

Things to notice:

- At the equator the noon Sun is always high and the day always about 12 hours: little seasonal change.
- Above about 66.6° N in June, the curve never dips below the horizon: the **midnight Sun**. In December the same place gets **polar night**.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the Sun is just a star whose declination changes slowly. Lesson 1.1's rule for a star's highest altitude applies.

**Noon altitude:**

```math
h_\text{noon} = 90^\circ - |\varphi - \delta_\odot|
```

**Day length:** from Lesson 1.2, with the Sun's declination,

```math
\cos H_0 = -\tan\varphi\,\tan\delta_\odot, \qquad \text{day length} = \frac{2H_0}{15^\circ}\ \text{hours}
```

**Energy per square metre:** proportional to `$\sin h$`, the sine of the Sun's altitude (sunlight at 30° spreads over twice the ground area as sunlight overhead).

**Try it:** at 50° N on the December solstice, `$h_\text{noon} = 90 - |50 - (-23.44)| = 16.6^\circ$`. Compare June: `$63.4^\circ$`.
</details>

## 5. Worked example

*Toronto, 43.7° N, June and December solstices.*

- June: `$h_\text{noon} = 90 - |43.7 - 23.44| = 69.7^\circ$`. `$\cos H_0 = -\tan 43.7^\circ \tan 23.44^\circ = -0.956 \times 0.434 = -0.414$`, `$H_0 = 114.5^\circ$`, day `$= 15.3$` h.
- December: `$h_\text{noon} = 22.9^\circ$`. `$\cos H_0 = +0.414$`, `$H_0 = 65.5^\circ$`, day `$= 8.7$` h.
- Warmth at noon: `$\sin 69.7^\circ / \sin 22.9^\circ = 0.938 / 0.389 = 2.4$` times more per square metre in June, before even counting the longer day.

Real day lengths are a few minutes longer than these, because the atmosphere bends sunlight over the horizon and sunrise is counted from the Sun's top edge.

## 6. Practice

1. Find the noon Sun's altitude at 20° N on the June solstice.
2. At what latitude is the noon Sun overhead on the December solstice?
3. Why does the Sun at the North Pole circle the sky at the same height all day in June?

<details>
<summary>Answers</summary>

1. `$90 - |20 - 23.44| = 86.6^\circ$`.
2. At 23.44° S, the Tropic of Capricorn.
3. At the pole the celestial equator lies along the horizon, and all daily circles are parallel to it. The Sun circles 23.4° up.
</details>

**Try it on the real sky:** get the Sun's exact position, sunrise and sunset for any place and date with the [[sun-position-calculator]], or see the solstices and equinoxes in the [[sky-events-calendar]].

**New words:** *obliquity* (axial tilt), *solstice*, *equinox*, *solar declination*, *midnight Sun*, *polar night*.
