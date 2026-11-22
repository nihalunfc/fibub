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

**Module 1 · about 25 minutes · read first: [1.1 The celestial sphere: a map painted on a dome](/learn/courses/sky-watching/celestial-sphere/), [1.2 Why the sky turns: daily motion and circumpolar stars](/learn/courses/sky-watching/turning-sky/) · maths: some trigonometry.** You'll be able to explain the seasons, find the Sun's noon altitude on any date, and say why days are long in summer and why the far north gets midnight Sun.

<div class="bigidea">Seasons come from Earth's 23.4° tilt, not its distance from the Sun: the tilt changes how high the noon Sun climbs and how long it stays up, and so how much warmth each square metre gets.</div>

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


<div class="meaning">

<dl>
<dt>23.4°</dt><dd>Tilt of Earth's axis to its orbit.</dd>
<dt>δ☉</dt><dd>The Sun's declination: +23.4° in June to −23.4° in December.</dd>
<dt>h<sub>noon</sub> = 90° − |φ − δ☉|</dt><dd>Height of the Sun at local noon.</dd>
<dt>∝ sin h</dt><dd>Sunlight energy per square metre of flat ground.</dd>
<dt>Physical meaning</dt><dd>Shine a torch straight down at a table and you get a small bright circle; tilt it and the same light spreads over a long, dim oval. Winter sunlight is the tilted torch: low, spread out, and also on for fewer hours.</dd>
</dl>

</div>

<div class="myth">

**"It is summer when Earth is closest to the Sun."** Earth is closest in early January, during northern winter and southern summer. The distance changes by only 3%. When it is summer in Canada it is winter in Australia, which distance could never explain.

</div>

## 4. High Sun, long days

Two effects make summer warm:

1. **The noon Sun is higher**, so its light hits the ground more squarely. A beam spread over twice the area delivers half the warmth per square metre.
2. **The Sun is up longer**, so there are more hours of heating than hours of cooling.

Move the sliders and compare your chosen day (thick line) with the solstices and equinox (thin lines).

<!--fig:sun-path-->

Things to notice:

- At the equator the noon Sun is always high and the day always about 12 hours: little seasonal change.
- Above about 66.6° N in June, the curve never dips below the horizon: the **midnight Sun**. In December the same place gets **polar night**.

Follow the noon Sun through one year at 45° N:

<div class="steps">
<div class="step"><b>June solstice.</b> The northern half tilts towards the Sun. The Sun's declination is +23.4°, and at noon it climbs to 90 − |45 − 23.4| = 68°. Days last about 15.5 hours.</div>
<div class="step"><b>September equinox.</b> No tilt towards or away. Declination 0°, noon Sun at 45°, 12-hour days everywhere.</div>
<div class="step"><b>December solstice.</b> Tilted away. Declination −23.4°, noon Sun only 21.6° up, days about 8.6 hours.</div>
<div class="step"><b>Spread-out light.</b> At 21.6°, a beam of sunlight spreads over 2.7 times more ground than when overhead, so each square metre gets much less heat.</div>
<div class="step"><b>And the distance?</b> Earth is actually closest to the Sun in early January, during northern winter.</div>
</div>

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

<div class="problem" data-problem="noon-sun"></div>

**More practice** (answers below):

1. Find the noon Sun's altitude at 20° N on the June solstice.
2. At what latitude is the noon Sun overhead on the December solstice?
3. Why does the Sun at the North Pole circle the sky at the same height all day in June?

<details>
<summary>Answers</summary>

1. `$90 - |20 - 23.44| = 86.6^\circ$`.
2. At 23.44° S, the Tropic of Capricorn.
3. At the pole the celestial equator lies along the horizon, and all daily circles are parallel to it. The Sun circles 23.4° up.
</details>

<div class="keypoints">

**Key points**

- Seasons come from the 23.4° tilt of Earth's axis.
- The Sun's declination swings from +23.4° (June) to −23.4° (December).
- Noon altitude h = 90° − |φ − δ☉|; heat per square metre ∝ sin h.
- The two hemispheres have opposite seasons.

</div>

**Try it on the real sky:** get the Sun's exact position, sunrise and sunset for any place and date with the [[sun-position-calculator]], or see the solstices and equinoxes in the [[sky-events-calendar]].

**New words:** *obliquity* (axial tilt), *solstice*, *equinox*, *solar declination*, *midnight Sun*, *polar night*.
