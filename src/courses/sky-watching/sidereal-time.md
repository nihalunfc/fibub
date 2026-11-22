---
title: "Sidereal time: why stars rise 4 minutes earlier each night"
summary: "A day measured by the stars is 23 h 56 min 4 s, about 4 minutes shorter than a day measured by the Sun. Sidereal time is star time: when it equals a star's right ascension, that star is due south."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "Why is a sidereal day shorter than a solar day?"
    choices: ["Earth spins faster at night", "Earth moves along its orbit, so it must turn a little extra to face the Sun again", "Leap seconds"]
    ans: 1
    why: "Each day Earth moves about 1° round the Sun, so it needs about 1° more spin (4 minutes) to bring the Sun back to the meridian."
  - q: "Your local sidereal time is 6h 00m. Which right ascension is crossing your meridian?"
    choices: ["0 h", "6 h", "18 h"]
    ans: 1
    why: "Local sidereal time equals the right ascension of whatever is on the meridian."
  - q: "A star is due south at 10 pm tonight. About when will it be due south one month later?"
    choices: ["10 pm", "8 pm", "midnight"]
    ans: 1
    why: "Stars run about 4 minutes a day, 2 hours a month, earlier."
sources:
  - "GMST formula: IAU 1982 expression as given in J. Meeus, Astronomical Algorithms, 2nd ed. (1998), chapter 12"
---

**Module 2 · about 25 minutes · read first: [2.2 Right ascension and declination: the sky's latitude and longitude](/learn/courses/sky-watching/right-ascension-declination/) · maths: a little algebra.** You'll be able to explain the sidereal day, use local sidereal time to find what is on your meridian, and work out an object's hour angle.

<div class="bigidea">A day measured by the stars is 23 h 56 min 4 s, about 4 minutes shorter than a solar day; sidereal time is star time, and when it equals a star's right ascension, that star is on your meridian.</div>

## 1. Why this matters

Sidereal time is how observatories have always scheduled the sky: "this galaxy transits at LST 13h". Old telescopes had a sidereal clock next to the ordinary one, and equatorial mounts use it to find objects from their RA. Once you know it, you can tell at a glance which part of the sky is best placed tonight.

## 2. Two kinds of day

- A **solar day** is from one noon to the next: 24 hours on average.
- A **sidereal day** is one turn of Earth relative to the distant stars: **23 h 56 min 4.1 s**.

The difference comes from Earth's orbit. In one day Earth moves about `$360^\circ / 365.25 \approx 0.986^\circ$` round the Sun. To bring the Sun back to the meridian, Earth must turn that extra degree, which takes about 3 min 56 s.

<!--fig:sidereal-day-->

Things to notice:

- After 30 days the stars rise about 2 hours earlier; after half a year, 12 hours earlier, so the night sky of December is the daytime sky of June.
- After a full year the two clocks agree again: a year holds 365.25 solar days but 366.25 sidereal days.

## 3. Local sidereal time and hour angle

**Local sidereal time (LST)** is the right ascension of the line in the sky that is crossing your meridian (the north-south line through the zenith) right now. It runs 24 sidereal hours per sidereal day, gaining about 3 min 56 s a day on your watch.

From LST and a star's RA you get its **hour angle**:

```math
H = \text{LST} - \alpha
```

- `$H = 0$`: the star is on the meridian, at its highest.
- `$H$` positive: it has passed the meridian and is heading west.
- `$H$` negative: it has not yet reached the meridian.

That hour angle is exactly what the alt-az formulas in Lesson 2.1 need.

See where the 4 minutes go:

<div class="steps">
<div class="step"><b>Day 1, noon.</b> The Sun and a distant star are both due south.</div>
<div class="step"><b>One full spin later, 23 h 56 m.</b> Earth has turned 360°: the star is due south again.</div>
<div class="step"><b>But not the Sun.</b> Earth has moved about 1° along its orbit, so it must turn about 1° more (4 minutes) to bring the Sun back south.</div>
<div class="step"><b>Over a year.</b> Those 4 minutes a day add up to a whole day: 366.25 star-days fit in 365.25 sun-days.</div>
<div class="step"><b>Using it.</b> If your local sidereal time is 5.9 h, Betelgeuse (RA 5.9 h) is crossing your meridian right now.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** count how far Earth has turned relative to the stars since a reference moment.

**Greenwich mean sidereal time** (IAU 1982 form, as in Meeus) for a Julian date `$JD$` (Lesson 2.4), with `$T = (JD - 2451545.0)/36525$`:

```math
\theta_0 = 280.46061837^\circ + 360.98564736629^\circ\,(JD - 2451545.0) + 0.000387933^\circ\,T^2 - \frac{T^3}{38\,710\,000}
```

Reduce `$\theta_0$` to 0 to 360°, then divide by 15 for hours.

**Local sidereal time:** add your east longitude `$\lambda$` (west is negative):

```math
\text{LST} = \text{GMST} + \frac{\lambda}{15^\circ}\ \text{h}
```

**The magic number:** `$360.98564736629^\circ$` per day is Earth's turn relative to the stars in one solar day: a full turn plus about 0.9856°.
</details>


<div class="meaning">

<dl>
<dt>Sidereal day</dt><dd>23 h 56 min 4 s: one turn of Earth relative to the stars.</dd>
<dt>LST</dt><dd>Local sidereal time: the RA currently on your meridian.</dd>
<dt>H = LST − α</dt><dd>Hour angle: how long since the star crossed the meridian.</dd>
<dt>Physical meaning</dt><dd>Walk once round a merry-go-round centre while it turns, and you see the centre pole one fewer time than you see the fairground around you. Earth circling the Sun loses one Sun-day per year compared with star-days for exactly that reason.</dd>
</dl>

</div>

<div class="myth">

**"Stars rise at the same clock time every night."** Each star rises about 4 minutes earlier every night, two hours earlier each month. That is why the winter stars of Orion appear in the evening only in winter.

</div>

This is the sky as a real 3D sphere around you. Drag to turn the view, slide your latitude, and press Play to let the sky turn.

<figure class="fig" data-fig="@astro-celestial-sphere"><figcaption>The north (or south) celestial pole stands as many degrees above the horizon as your latitude. Green stars are circumpolar and never set, orange ones never rise, and the rest rise and set. Switch the grid to see altitude and azimuth lines instead of RA and Dec.</figcaption></figure>

## 4. Worked example

*Toronto (longitude 79.4° W) at 03:30 UT on 22 November 2026 (10:30 pm the evening before, local time).*

- Julian date (Lesson 2.4): `$JD = 2461366.6458$`.
- GMST from the formula: about **7.576 h** (7h 34.6m).
- LST `$= 7.576 - 79.4/15 = 7.576 - 5.293 = 2.283$` h, about 2h 17m.

So RA 2h 17m is on the meridian. The Pleiades (RA about 3h 47m) have an hour angle of `$2.28 - 3.79 = -1.5$` h: they will be highest in an hour and a half, around midnight local time. Polaris's RA is 2h 32m, so it is almost exactly above the pole on the meridian at this moment.

## 5. Practice

<div class="problem" data-problem="transit-wait"></div>

**More practice** (answers below):

1. How much earlier does a star rise after one week?
2. LST is 14h 00m. What is the hour angle of Arcturus (RA 14h 16m)? Is it east or west of the meridian?
3. Why is there no "sidereal noon"?

<details>
<summary>Answers</summary>

1. `$7 \times 3.93 \approx 27.5$` minutes.
2. `$H = 14.00 - 14.27 = -0.27$` h, about −16 minutes: just east of the meridian, still climbing.
3. There is a reference point: sidereal time 0 h is when the vernal equinox point crosses the meridian. It just doesn't line up with anything you would notice in daily life; it falls at a different clock time every day.
</details>

<div class="keypoints">

- Sidereal day = 23 h 56 min 4 s; solar day = 24 h.
- Stars rise about 4 minutes earlier each night.
- Local sidereal time = the RA on your meridian.
- Hour angle H = LST − RA tells you where a star is in its daily circle.

</div>

**Try it with real numbers:** get the sidereal time, Julian date and time systems for any moment with [[astro-time]], and see when objects transit with [[object-altitude]].

**New words:** *sidereal day*, *solar day*, *local sidereal time*, *Greenwich mean sidereal time*, *hour angle*, *transit*.
