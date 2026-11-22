---
title: "Precession: the pole star changes"
summary: "Earth's axis wobbles like a slowing spinning top, tracing a circle on the sky every 25,800 years or so. The pole star changes, the equinoxes slide along the zodiac, and every catalogue must say which epoch its coordinates are for."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What causes precession of Earth's axis?"
    choices: ["The Sun's and Moon's gravity pulling on Earth's equatorial bulge", "Earthquakes", "The solar wind"]
    ans: 0
    why: "Earth bulges at the equator; the pull of the Sun and Moon on that bulge tries to tip the axis, which makes it precess like a top."
  - q: "About how long is one cycle of precession?"
    choices: ["365 years", "2,600 years", "25,800 years"]
    ans: 2
    why: "General precession is about 50.3 arcseconds a year, giving a cycle of about 25,800 years."
  - q: "Which star will be close to the north celestial pole around 14,000 AD?"
    choices: ["Sirius", "Vega", "Polaris"]
    ans: 1
    why: "The pole's circle passes within a few degrees of Vega in about 12,000 years."
sources:
  - "General precession 50.29 arcseconds per year and obliquity 23.44°: IAU 2006 precession model (Capitaine et al. 2003)"
---

**Module 2 · about 20 minutes · read first: [2.2 Right ascension and declination: the sky's latitude and longitude](/learn/courses/sky-watching/right-ascension-declination/) · maths: angles.** You'll be able to explain precession, estimate how much it shifts coordinates over a few decades, and say why the zodiac signs no longer match the constellations.

<div class="bigidea">Earth's axis wobbles like a slowing spinning top, tracing a circle on the sky every 25,800 years; the pole star changes, the equinoxes slide, and every catalogue must say which epoch its coordinates are for.</div>

## 1. Why this matters

If you type the RA and Dec of a star from a 1950 catalogue into a modern mount, you'll miss by up to about a Moon's width. Precession is why catalogues name an **epoch** (B1950, J2000) and why go-to mounts and planetarium apps convert coordinates to "of date". It is also a beautiful piece of physics: the same effect that makes a spinning top's axis circle around.

## 2. A spinning top

Earth is not a perfect sphere: spin makes it bulge about 21 km wider at the equator than pole to pole. The Sun and Moon pull harder on the near side of the bulge than the far side, which tries to straighten Earth's tilt. Because Earth is spinning, it doesn't straighten; instead the axis slowly swings round in a cone, keeping its tilt of about 23.4°. That is **precession**.

On the sky, the north celestial pole moves in a circle of radius 23.4° around the **ecliptic pole** (in Draco), once every **25,800 years** or so.

<!--fig:precession-circle-->

Things to notice:

- Polaris is a good pole star only for a few centuries: it is closest, about 0.45°, around 2100.
- About 2700 BC, Thuban in Draco was near the pole.
- Around 14,000 AD bright Vega will be the "pole star", though about 5° from the pole.

## 3. Sliding equinoxes

The equinox points, where the ecliptic crosses the celestial equator, slide westward along the ecliptic by about 50″ a year. Over 2,000 years that is about 28°, roughly one zodiac constellation. That is why the March equinox, once in Aries (hence "First Point of Aries"), is now in Pisces. It is also why the astrological "sign" for a birthday no longer matches the constellation the Sun is actually in: astrology froze the signs about 2,000 years ago. (This course is about astronomy; astrology has no scientific basis.)

Because RA is measured from the equinox, every star's RA and Dec slowly change. Hence the epoch.

Follow the north celestial pole through time:

<div class="steps">
<div class="step"><b>Why.</b> The Sun and Moon pull on Earth's equatorial bulge, trying to straighten its tilt. Instead, like a spinning top, the axis swings round slowly.</div>
<div class="step"><b>About 2700 BC.</b> The pole was near Thuban in Draco when the Egyptian pyramids were built.</div>
<div class="step"><b>Today.</b> It is within 1° of Polaris, and will be closest around 2100.</div>
<div class="step"><b>AD 14,000.</b> Vega, one of the brightest stars, will be near the pole.</div>
<div class="step"><b>For your charts.</b> Every star's RA and Dec slowly change, so catalogues say J2000 (coordinates for the year 2000) and software corrects them to today.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Rate:** the general precession in ecliptic longitude is about

```math
p \approx 50.29'' \text{ per year} \quad\Rightarrow\quad T = \frac{360 \times 3600''}{50.29''} \approx 25\,770 \text{ years}
```

**Effect on RA and Dec** over `$\Delta t$` years (the usual first-order formulas, with `$m \approx 3.075$` s/yr and `$n \approx 1.336$` s/yr `$= 20.04''$`/yr):

```math
\Delta\alpha \approx (m + n \sin\alpha \tan\delta)\,\Delta t, \qquad \Delta\delta \approx n \cos\alpha\, \Delta t
```

(`$\Delta\alpha$` in seconds of time, `$\Delta\delta$` in arcseconds when `$n = 20.04''$`.)

**In ecliptic coordinates** it is simple: every star's ecliptic latitude stays the same and its longitude grows by `$p$` a year. The figure uses exactly this.
</details>


<div class="meaning">

<dl>
<dt>50.29″ per year</dt><dd>Rate at which the equinoxes slide along the ecliptic.</dd>
<dt>~25,800 years</dt><dd>One full precession circle.</dd>
<dt>Epoch (J2000)</dt><dd>The date a set of coordinates is valid for.</dd>
<dt>Physical meaning</dt><dd>Spin a top and tip it slightly: gravity tries to pull it over, but instead its axis sweeps slowly round in a cone. Earth is the top, the Sun and Moon pulling on its bulging middle provide the twist, and the cone takes about 26,000 years.</dd>
</dl>

</div>

<div class="myth">

**"Polaris has always been the pole star."** Polaris has been near the pole only for the last few centuries. In ancient Greece there was no good pole star; in 12,000 years the honour passes to Vega.

</div>

## 4. Worked example

*How far has a star on the celestial equator at RA 0 h moved between B1950 and J2000 (50 years)?*

- `$\Delta\alpha = (3.075 + 1.336 \sin 0 \tan 0) \times 50 = 153.8$` s of time `$= 2.56$` min of RA, which is `$153.8 \times 15'' = 2307'' = 38.4'$`.
- `$\Delta\delta = 20.04'' \times \cos 0 \times 50 = 1002'' = 16.7'$`.

So the old coordinates are off by about `$\sqrt{38.4^2 + 16.7^2} \approx 42'$`, more than the Moon's diameter. A telescope with a 30′ field of view would miss the target completely.

## 5. Practice

<div class="problem" data-problem="precession-shift"></div>

**More practice** (answers below):

1. How many degrees does the equinox move along the ecliptic in 1,000 years?
2. Why don't stars' ecliptic latitudes change with precession?
3. In about what year was the pole halfway round its circle from today's position?

<details>
<summary>Answers</summary>

1. `$50.29'' \times 1000 = 50290'' = 14.0^\circ$`.
2. Precession is the equator swinging round; the ecliptic (Earth's orbit) stays almost fixed, and ecliptic latitude is measured from it.
3. About 12,900 years ago (half of 25,800), around 10,900 BC.
</details>

<div class="keypoints">

**Key points**

- Precession: Earth's axis circles the ecliptic pole every ~25,800 years.
- The equinoxes slide 50.29″ a year along the ecliptic.
- The pole star changes over centuries: Thuban, Polaris, then Vega.
- Catalogues give coordinates for an epoch such as J2000.

</div>

**Try it with real numbers:** convert coordinates between J2000 and today's epoch, or between equatorial and ecliptic, with [[sky-coordinates]].

**New words:** *precession*, *equatorial bulge*, *ecliptic pole*, *epoch* (J2000, B1950), *coordinates of date*.
