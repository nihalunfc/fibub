---
title: 'Galaxy rulers: spin, water masers and bent light'
seoTitle: 'Tully-Fisher, masers and lens delays: galaxy distances'
summary: 'How a galaxy''s spin tells you how bright it is, how a ring of water clouds in NGC 4258 gave a distance by pure geometry, and how delays in lensed images measure the universe. Simple language, live problems.'
minutes: 14
updated: 2026-11-22
quiz:
  - q: What does the Tully-Fisher relation link?
    choices: ["How fast a spiral galaxy spins and how much light it gives out","A galaxy's colour and its age","A star's mass and its lifetime"]
    ans: 0
    why: Faster spinning spirals hold more mass and so more stars, so they are brighter. Measure the spin, get the true brightness, compare with how bright it looks, and you have the distance.
  - q: Why is the water maser distance to NGC 4258 so valuable?
    choices: ["It is the farthest distance ever measured","It needs no telescope","It uses pure geometry, with no assumption about how bright any star is"]
    ans: 2
    why: Clouds orbiting the galaxy's central black hole give both a speed and a sideways drift. Comparing the two gives the distance directly, which checks the Cepheid scale.
  - q: If one image of a lensed quasar flickers 30 days after another, what does the delay depend on?
    choices: ["The size of the universe, so it measures the expansion rate","Only the colour of the quasar","The weather on Earth"]
    ans: 0
    why: The two light paths differ in length by an amount that scales with cosmic distances. A bigger universe (smaller Hubble constant) means a longer delay.
sources:
  - 'R. B. Tully and J. R. Fisher (1977), A new method of determining distances to galaxies, A&A 54, 661 https://ui.adsabs.harvard.edu/abs/1977A%26A....54..661T'
  - 'J. R. Herrnstein et al. (1999), A geometric distance to the galaxy NGC 4258 from orbital motions in a nuclear gas disk, Nature 400, 539 https://doi.org/10.1038/22972'
  - 'S. Refsdal (1964), On the possibility of determining Hubble''s parameter and the masses of galaxies from the gravitational lens effect, MNRAS 128, 307 https://doi.org/10.1093/mnras/128.4.307'
  - 'NASA Science: Gravitational lensing https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-gravitational-lenses/'
---

**Module 2 · about 14 minutes.** By the end you will be able to explain three distance methods that do not need single stars: a galaxy's spin, a disc of water clouds, and the timing of bent light. Each one checks the main ladder of Cepheids and supernovae.

<div class="bigidea">When single stars are too faint to see, the galaxy itself becomes the ruler: how fast it spins, how its gas moves, and how it bends light behind it.</div>

## 1. Spin tells you brightness (Tully-Fisher)

A spiral galaxy is a giant spinning disc. Gravity holds it together, so the more mass it has, the faster its outer parts must move to stay in orbit. More mass usually means more stars, and more stars mean more light.

In 1977 Brent Tully and Richard Fisher showed that a spiral's light grows roughly as its **rotation speed to the fourth power**. Double the spin, and the galaxy is about 16 times as bright.

```math
L \propto v_{\text{rot}}^{4}
```

<div class="meaning">

<dl>
<dt>L</dt><dd>the galaxy's true light output (luminosity)</dd>
<dt>v<sub>rot</sub></dt><dd>how fast its outer disc spins, in km/s</dd>
<dt>Physical meaning</dt><dd>Spin is set by mass, mass by the number of stars, and stars make the light. So you can read a galaxy's power off its speed, then use the inverse square law for distance.</dd>
</dl>

</div>

How do you measure spin from millions of light-years away? Hydrogen gas gives off radio waves at exactly 21 cm. One side of the disc comes towards us and one side moves away, so the line is stretched to both sides by the Doppler shift (explained in the [Astronomy course](/learn/courses/astronomy/doppler-shift/)). The wider the smear, the faster the spin.

<figure class="fig" data-fig="tully-fisher"><figcaption>A spinning galaxy and its 21 cm hydrogen line. Speed it up and the line smears wider, and the galaxy's true brightness climbs as the fourth power of the speed.</figcaption></figure>

<div class="problem" data-problem="tully-fisher"></div>

Tully-Fisher gives distances good to about 15-20% per galaxy, worse than a supernova, but it works on any spiral, any time, with no need to wait for an explosion. It needs calibrating with spirals whose Cepheid distances are known. Elliptical galaxies, which do not spin as a disc, have a cousin rule using the random speeds of their stars.

## 2. Water clouds round a black hole (NGC 4258)

The galaxy NGC 4258 (also called Messier 106), about 25 million light-years away, has a thin disc of gas orbiting its central black hole. Water molecules in the disc act like natural radio lasers, called **masers**, which shine as sharp, bright points.

Radio telescopes spread across the Earth, working together as one dish the size of the planet, tracked these points for years. Two things were measured:

- the clouds' **speed** in km/s from the Doppler shift, and
- their **drift across the sky** in tiny fractions of an arcsecond per year.

The same motion, once in km/s and once as an angle per year, gives the distance by simple geometry, just like the [parallax](/learn/courses/astronomy/parallax/) of a nearby star. No guess about how bright anything is goes in. The result is good to about 1.5%, and it is used to check the Cepheid scale.

<div class="steps" data-fig="maser-disc">
<div class="step">Clouds at the two edges of the disc move straight towards us and straight away. Their Doppler shifts give the orbit speed: about 1,000 km/s.</div>
<div class="step">A cloud on the near side moves sideways instead. In one year it travels 1,000 km/s × 1 year: about 3.2 × 10¹⁰ km.</div>
<div class="step">From Earth that trip is a drift of only about 28 micro-arcseconds: the size of a coin seen from halfway to the Moon. Earth-sized radio arrays can measure it.</div>
<div class="step">Distance = distance travelled ÷ angle (in radians). That gives about 7.6 million parsecs, or 25 million light-years: geometry alone, like a surveyor's triangle.</div>
</div>

## 3. Bent light keeps time (lens time delays)

A massive galaxy bends light passing near it, like a lens (Einstein's idea, Module 3). A quasar far behind it can appear as two or four images round the lens. The light for each image takes a different path, and the paths have different lengths.

Quasars flicker. When one image brightens, the others brighten days or weeks later. In 1964 Sjur Refsdal pointed out that this **delay** measures the size of the universe: every length in the set-up scales with cosmic distance, so a bigger universe means a longer delay. Measure the delay and model the lens's mass, and you get the expansion rate directly, skipping every rung of the ladder.

<div class="myth">

**"Each new method replaces the last."** Astronomers keep all of them because they fail in different ways. If spin, masers, lens delays and Cepheids all agree, the answer is solid. When they disagree, as they partly do today, it points to something new (Lesson 12.2, the Hubble tension).

</div>

<div class="history">

**Supernova Refsdal.** In 2014 a supernova behind a galaxy cluster appeared as four images. Astronomers predicted a fifth image would appear about a year later in another place, and it did, in 2015. Its delay gave a measure of the expansion rate, named after Refsdal, who had proposed the idea fifty years earlier.

</div>

<div class="keypoints">

- Tully-Fisher: a spiral's light grows about as its spin to the fourth power, so spin gives brightness and brightness gives distance (about 15-20%).
- Spin is measured from the Doppler smear of hydrogen's 21 cm radio line.
- Water masers orbiting the black hole in NGC 4258 give a geometric distance good to about 1.5%, which anchors the Cepheid scale.
- Delays between lensed images of a flickering quasar measure the expansion rate without the ladder.

</div>
