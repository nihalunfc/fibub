---
title: "The CMB dipole: our motion through the universe"
seoTitle: "What is the CMB dipole? How fast are we moving?"
summary: "One half of the sky is 3.36 thousandths of a degree warmer than the other. The CMB dipole is the Doppler effect of our own motion: the Sun moves at 370 km/s, the Local Group at about 620 km/s, relative to the universe's oldest light."
minutes: 13
updated: 2026-11-22
quiz:
  - q: "What causes the CMB dipole?"
    choices: ["Our own motion through the CMB, which Doppler shifts the light ahead of us to slightly higher temperature", "A hot region near the edge of the universe", "The Milky Way's own microwave glow"]
    ans: 0
    why: "Moving towards a source blueshifts it. Light ahead looks warmer by T × v/c and light behind cooler by the same amount."
  - q: "The dipole is 3.36 mK on a 2.7255 K background. How fast is the Sun moving relative to the CMB?"
    choices: ["About 3.4 km/s", "About 370 km/s", "About 30,000 km/s"]
    ans: 1
    why: "v = c × ΔT/T = 299,792 km/s × 0.00336 ÷ 2.7255 ≈ 370 km/s."
  - q: "Does the CMB's rest frame break Einstein's relativity?"
    choices: ["Yes: it is an absolute frame of rest", "Yes: it lets us measure absolute time", "No: it is just the frame of the stuff in the universe, like the air's frame for sound; the laws of physics are the same in every frame"]
    ans: 2
    why: "Relativity says no frame has different laws, not that the universe's contents cannot be at rest in some frame. Measuring your speed through the CMB is like measuring your speed through the air."
sources:
  - "Planck Collaboration (2020), Planck 2018 results. I. Overview and the cosmological legacy of Planck, A&A 641, A1 https://doi.org/10.1051/0004-6361/201833880"
  - "G. F. Smoot, M. V. Gorenstein and R. A. Muller (1977), Detection of anisotropy in the cosmic blackbody radiation, Physical Review Letters 39, 898 https://doi.org/10.1103/PhysRevLett.39.898"
  - "A. Kogut et al. (1993), Dipole anisotropy in the COBE differential microwave radiometers first-year sky maps, ApJ 419, 1 https://doi.org/10.1086/173453"
  - "Planck Collaboration (2014), Planck 2013 results. XXVII. Doppler boosting of the CMB: eppur si muove, A&A 571, A27 https://doi.org/10.1051/0004-6361/201321556"
---

**Module 7 · about 13 minutes.** Read first: [7.2 The most perfect blackbody](/learn/courses/cosmology/cmb-blackbody/), and the astronomy course's [Doppler shift](/learn/courses/astronomy/doppler-shift/). The CMB is the same in every direction, almost. The biggest difference across the sky has nothing to do with the early universe: it is caused by us. By the end you will be able to turn the dipole into a speed and say who is moving.

<div class="bigidea">The CMB is slightly warmer in the direction we are heading and cooler behind us. That pattern measures how fast we are moving through the universe: 370 km/s for the Sun.</div>

## 1. Hot ahead, cold behind

Ride a bicycle through still air and you feel a wind on your face, though the air is not moving. Move through the CMB and you meet its photons head-on in front, which blueshifts them a little, and chase them from behind, which redshifts them. A blueshifted blackbody looks like a hotter blackbody. So the sky ahead looks warmer and the sky behind cooler, smoothly in between: half the sky hot, half cold. It is called a **dipole** (two poles).

<figure class="fig" data-fig="cmb-dipole"><figcaption>The whole sky in microwaves (galactic coordinates, the Milky Way's plane across the middle). Slide your speed or pick who is moving: the hot pole is where you are heading. At the Sun's 370 km/s the difference is ±3.36 thousandths of a kelvin.</figcaption></figure>

For speeds much smaller than light, the temperature seen at an angle θ from the direction of motion is

```math
T(\theta) \approx T_0 \left(1 + \frac{v}{c}\cos\theta\right), \qquad \Delta T = T_0\,\frac{v}{c}
```

<div class="meaning">

<dl>
<dt>T<sub>0</sub></dt><dd>the average CMB temperature, 2.7255 K</dd>
<dt>v</dt><dd>our speed relative to the CMB (the frame in which it looks the same in every direction)</dd>
<dt>θ</dt><dd>the angle between a direction on the sky and the direction we are moving: cos θ is +1 straight ahead, 0 at the sides, −1 straight behind</dd>
<dt>ΔT</dt><dd>the size of the dipole: how much hotter it is straight ahead, and colder straight behind</dd>
<dt>Physical meaning</dt><dd>A speed of a thousandth of light speed changes the temperature by a thousandth. Measure the temperature difference and you have measured your speed.</dd>
</dl>

</div>

Planck measured ΔT = 3.362 mK (thousandths of a kelvin) towards galactic longitude 264°, latitude 48°, in the constellation Crater, next to Leo. That is about 1 part in 800 of the CMB's temperature, a hundred times bigger than the true ripples from the early universe.

<div class="problem" data-problem="cmb-dipole-speed"></div>

## 2. Who is moving?

The answer, 369.8 km/s for the Sun, is the sum of many motions:

- the Earth goes round the Sun at about 30 km/s (this changes direction through the year);
- the Sun goes round the centre of the Milky Way at about 230 km/s;
- the Milky Way falls towards the Andromeda galaxy and moves within our small cluster, the Local Group;
- the whole Local Group moves at about **620 km/s** relative to the CMB, towards the constellations Hydra and Centaurus.

That last motion is the one that matters for cosmology. The Local Group is being pulled by the uneven spread of matter around us: the Virgo Cluster, the "Great Attractor" region about 200 million light-years away, the much more distant Shapley Supercluster, and the push from emptier regions behind us. Adding up the pull of the galaxies mapped around us explains much of the 620 km/s (how much comes from very distant structures is still argued over), a check that gravity from ordinary-looking galaxies (and their dark matter) moves us around.

<div class="problem" data-problem="cmb-dipole-earth"></div>

## 3. A useful nuisance

To see the faint ripples of the early universe ([next lesson](/learn/courses/cosmology/cmb-anisotropies/)), the dipole must be subtracted, and it is known so well that this is easy. The yearly change from the Earth's orbit, about 0.27 mK, is even more useful: since the Earth's speed is known almost perfectly, WMAP and Planck used it to calibrate their detectors.

How do we know the dipole is our motion and not a real hot side of the universe? Motion has a second, subtle effect: it squeezes the pattern of small ripples ahead of us and spreads it out behind, like stars bunching up ahead of a fast spaceship. In 2014 the Planck team detected exactly this squeezing, at the size expected for 370 km/s. They titled the paper "eppur si muove", "and yet it moves", Galileo's legendary words about the Earth.

<div class="history">

**Measuring our speed.** Hints of a dipole appeared in 1969 and the early 1970s. In 1976 George Smoot, Marc Gorenstein and Richard Muller flew a microwave receiver in a U-2 spy plane, above most of the air, and found it clearly in 1977: about 3.5 mK, a speed of about 400 km/s.

<ul class="timeline">
<li><b>1977</b> U-2 flights detect the dipole</li>
<li><b>1993</b> COBE DMR: 3.365 ± 0.027 mK; Local Group speed 627 ± 22 km/s</li>
<li><b>2014</b> Planck sees the aberration of the small ripples: the dipole is our motion</li>
<li><b>2018</b> Planck final: 3.362 mK, the Sun moving at 369.8 km/s</li>
</ul>

</div>

<div class="myth">

**"The CMB's rest frame is an absolute rest frame that disproves relativity."** Relativity says the laws of physics are the same for everyone moving steadily; it never said the universe's contents could not have an average rest frame. The CMB frame is like the frame of the air for sound: real, useful, and no more special in its laws than any other.

</div>

<div class="keypoints">

- Moving through the CMB makes it warmer ahead and cooler behind by ΔT = T<sub>0</sub> v/c: a dipole.
- Measured: 3.362 mK, so the Sun moves at about 370 km/s, towards Crater and Leo; the Local Group moves at about 620 km/s.
- The motion comes from the pull of the uneven matter around us; the dipole is subtracted before studying the early universe.
- Planck confirmed it is motion by seeing the small ripples squeezed ahead of us.

</div>
