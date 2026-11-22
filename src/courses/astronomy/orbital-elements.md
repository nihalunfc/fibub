---
title: "Orbital elements: six numbers that pin down an orbit"
seoTitle: "The six orbital elements explained | Astronomy"
summary: "Size, shape, tilt, where it crosses the reference plane, where the closest point lies, and where the body is at a chosen time: six numbers describe any orbit and let you work out a position for any date."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Which element sets how tilted an orbit is against the ecliptic?"
    choices: ["Eccentricity e", "Inclination i", "Semi-major axis a"]
    ans: 1
    why: "Inclination is the angle between the orbit's plane and the reference plane."
  - q: "The ascending node is where the body:"
    choices: ["Is closest to the Sun", "Crosses the reference plane going north", "Is furthest from the Sun"]
    ans: 1
    why: "The orbit crosses the plane twice; going north (up) is the ascending node."
  - q: "Why do eclipses only happen in certain seasons?"
    choices: ["The Moon's orbit is tilted, so the Sun must be near a node", "The Moon is closer in some months", "Earth's tilt blocks them"]
    ans: 0
    why: "The Moon's orbit is tilted 5°; only when the Sun lines up with the nodes can a new or full Moon line up exactly."
sources:
  - "Moon's orbital inclination 5.145°: NASA Moon Fact Sheet; Pluto's orbit (rounded): JPL Small-Body Database"
---

**Module 2 · about 25 minutes · read first: [2.1 Kepler's laws](/learn/courses/astronomy/keplers-laws/), [2.2 Newton's gravity and orbital speed](/learn/courses/astronomy/newtons-gravity/) · maths: angles in 3D.** You'll be able to name the six orbital elements, picture what each one does, and see how they turn into a position on a chosen date.

<div class="bigidea">Six numbers pin down any orbit: two for its size and shape, three for how it is tilted and turned in space, and one for where the body is at a chosen moment.</div>

## 1. Why this matters

Every satellite, comet and asteroid catalogue lists the same six numbers. They are the language of orbits: with them, a telescope can be pointed at a newly found asteroid tomorrow night, a satellite pass can be predicted for your town, and a planetary defence team can check whether a rock will miss Earth.

## 2. Size, shape, tilt and turn

- **Size `$a$`** and **shape `$e$`** (Lesson 2.1): how big and how stretched.
- **Inclination `$i$`**: the tilt of the orbit's plane against a reference plane. For the solar system that is the **ecliptic**, Earth's orbital plane.
- **Longitude of the ascending node `$\Omega$`**: the orbit crosses the ecliptic at two points, the nodes. `$\Omega$` says which direction the "going up" crossing faces, measured from the vernal equinox direction (♈).
- **Argument of perihelion `$\omega$`**: within the orbit's own plane, the angle from the ascending node round to the closest point.
- **Where the body is**: the **mean anomaly** `$M_0$` at a chosen date (the epoch), or the date it passes perihelion.

<!--fig:orbit-elements-->

Things to notice:

- With `$i = 0$` the orbit lies flat in the ecliptic, and `$\Omega$` stops meaning anything.
- `$\Omega$` swings the whole tilted orbit around; `$\omega$` turns the ellipse within its own tilted plane.
- Turn the view: the orbit is the same, only your viewpoint changes.

Build an orbit one number at a time:

<div class="steps">
<div class="step"><b>Size, a.</b> Draw an ellipse whose half-length is a, say 2.8 AU, like a main-belt asteroid.</div>
<div class="step"><b>Shape, e.</b> Squash it to eccentricity 0.08, nearly a circle.</div>
<div class="step"><b>Tilt, i.</b> Lift it 10° out of the plane of Earth's orbit (the ecliptic).</div>
<div class="step"><b>Turn, Ω and ω.</b> Ω says where the orbit crosses the ecliptic going north (the ascending node); ω says where perihelion lies within the orbit.</div>
<div class="step"><b>Timing, M₀.</b> Finally say where the asteroid is on a chosen date. Now its position can be worked out for any date, past or future.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Step 1: where in the orbit.** The mean anomaly grows steadily with time, `$M = M_0 + 2\pi (t - t_0)/P$`. Solve **Kepler's equation** for the eccentric anomaly `$E$` (by trial, or Newton's method):

```math
M = E - e\sin E
```

**Step 2: position in the orbit's plane** (x towards perihelion, in units of `$a$`):

```math
x = \cos E - e, \qquad y = \sqrt{1 - e^2}\,\sin E
```

**Step 3: turn into 3D.** Rotate by `$\omega$` in the plane, tilt by `$i$`, then rotate by `$\Omega$` about the ecliptic pole. The result is the position in ecliptic coordinates.

**Try it:** e = 0.5, a quarter of the way round in time (`$M = 90°$`): `$E \approx 2.02$` rad (115.7°), since `$2.02 - 0.5\sin 2.02 = 1.570 \approx \pi/2$`.
</details>

## 3. What it means physically

Only two of the six numbers (`$a$` and `$e$`) are about the orbit's energy and spin; the other four are just about how it is placed and where the body is on it. Gravity from the Sun alone never changes them. Small tugs from other planets slowly do, which is why catalogues give a date (the epoch) with each set. Earth-orbiting satellites drift faster because Earth's bulging equator pulls on them.


<div class="meaning">

<dl>
<dt>a, e</dt><dd>Size and shape of the ellipse.</dd>
<dt>i</dt><dd>Inclination: tilt from the reference plane.</dd>
<dt>Ω, ω</dt><dd>Longitude of the ascending node and argument of perihelion: which way the orbit is turned.</dd>
<dt>M = E − e sin E</dt><dd>Kepler's equation: links steady time (M) to position on the ellipse (E).</dd>
<dt>Physical meaning</dt><dd>It is like giving directions to a racetrack: how big it is, how stretched, how tilted the ground is, which way it faces, and where the runner was when the clock started. With those six facts, anyone can tell where the runner is at any time.</dd>
</dl>

</div>

<div class="myth">

**"An orbit needs a computer simulation to predict."** For two bodies (the Sun and one planet), six numbers and Kepler's equation give the position exactly. Simulations are only needed when planets tug on each other over long times.

</div>

## 4. Worked example

*The Moon's orbit is tilted 5.1° to the ecliptic. How far above or below the ecliptic can the Moon appear, as seen from Earth, and why does that make eclipses rare?*

The Moon can be up to about 5.1° north or south of the ecliptic, ten Moon-widths. The Sun is always on the ecliptic. For a solar eclipse, the new Moon must be within about 1.5° of the Sun's path, so it must be near a node. Twice a year the Sun lines up with the nodes: these **eclipse seasons**, about 173 days apart, are the only times eclipses can happen ([Sky watching 5.6](/learn/courses/sky-watching/eclipses-occultations/)).

## 5. Practice

<div class="problem" data-problem="perihelion-distance"></div>

**More practice** (answers below):

1. An orbit has i = 90°. What does it look like from far above the ecliptic?
2. Pluto's orbit has i = 17° and e = 0.25. What do those two numbers say about it?
3. Which elements would you need to change to move an orbit's perihelion to the opposite side of the Sun, keeping everything else?

<details>
<summary>Answers</summary>

1. It stands on edge: from above the ecliptic you would see it as a straight line through the Sun.
2. It is tilted well out of the planets' plane and quite stretched (perihelion `$0.75a$`, aphelion `$1.25a$`).
3. Add 180° to `$\omega$` (the argument of perihelion).
</details>

<div class="keypoints">

**Key points**

- Six orbital elements: a, e, i, Ω, ω and a time or mean anomaly.
- a and e give size and shape; i, Ω and ω give orientation.
- Kepler's equation M = E − e sin E turns time into position.
- Minor planet catalogues publish these six numbers for every asteroid.

</div>

**Try it with real numbers:** enter any asteroid or comet's elements in the [[orbit-elements]] tool, and plan a meeting between two orbits with the [[porkchop-plot]].

**New words:** *orbital elements*, *inclination*, *ascending node*, *argument of perihelion*, *mean anomaly*, *Kepler's equation*, *epoch*.
