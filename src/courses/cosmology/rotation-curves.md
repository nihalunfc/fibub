---
title: "Vera Rubin and galaxy rotation curves"
seoTitle: "Galaxy rotation curves: Vera Rubin's dark matter evidence"
summary: "Stars far out in spiral galaxies orbit as fast as those near the middle. How Vera Rubin and radio astronomers showed every spiral sits in a dark matter halo."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "If all of a galaxy's mass were in its bright middle, how would orbital speeds change far out?"
    choices: ["They would stay the same","They would fall, as 1 over the square root of the distance, like the planets","They would rise"]
    ans: 1
    why: "Outside the mass, v = √(GM/r): four times farther out, half the speed. That is how the planets move round the Sun."
  - q: "A galaxy's rotation curve stays flat at 200 km/s from 10 kpc out to 40 kpc. How does the mass inside 40 kpc compare with the mass inside 10 kpc?"
    choices: ["The same","About 4 times bigger","Half as big"]
    ans: 1
    why: "M = v²r/G. With v the same, the mass inside grows in step with r: four times the radius, four times the mass, though there is little light out there."
  - q: "Why did radio telescopes matter so much for rotation curves?"
    choices: ["Radio waves travel faster than light","Cold hydrogen gas, seen in the 21 cm line, reaches far beyond the visible stars","Radio telescopes can see dark matter directly"]
    ans: 1
    why: "The hydrogen gas disc extends two or more times beyond the stars, so its Doppler shifts track orbits where there is almost no starlight, and they stay fast."
sources:
  - "V. C. Rubin and W. K. Ford (1970), Rotation of the Andromeda nebula from a spectroscopic survey of emission regions, ApJ 159, 379 https://doi.org/10.1086/150317"
  - "V. C. Rubin, W. K. Ford and N. Thonnard (1980), Rotational properties of 21 SC galaxies with a large range of luminosities and radii, ApJ 238, 471 https://doi.org/10.1086/158003"
  - "A. Bosma (1981), 21-cm line studies of spiral galaxies. II, AJ 86, 1825 https://ui.adsabs.harvard.edu/abs/1981AJ.....86.1825B"
  - "Y. Sofue and V. Rubin (2001), Rotation curves of spiral galaxies, Annual Review of Astronomy and Astrophysics 39, 137 https://doi.org/10.1146/annurev.astro.39.1.137"
---

**Module 8 · about 15 minutes.** Read first: [8.1 Zwicky's missing mass](/learn/courses/cosmology/zwicky-missing-mass/). Zwicky's clusters were far away and hard to measure. In the 1970s the same puzzle turned up in single galaxies, measured so cleanly that it could no longer be set aside. By the end you will be able to read a rotation curve, explain why a flat one means unseen mass, and work out how much.

<div class="bigidea">If a galaxy's mass were where its light is, stars far from the middle would orbit slowly, like the outer planets. Instead they orbit just as fast as stars closer in, so the mass keeps growing far beyond the light.</div>

## 1. What we expected: Kepler's fall-off

A **rotation curve** is a graph of how fast stars and gas orbit against their distance from a galaxy's centre. We measure it with the [Doppler shift](/learn/courses/astronomy/doppler-shift/): in a tilted spinning disc, one side comes towards us (blueshift) and the other goes away (redshift). The same trick weighed spirals for distances in [Lesson 2.5](/learn/courses/cosmology/galaxy-rulers/).

For a circular orbit, gravity must supply exactly the pull that bends the path into a circle ([Newton's gravity](/learn/courses/astronomy/newtons-gravity/)):

```math
\frac{G\,M(<r)}{r^{2}} = \frac{v^{2}}{r} \quad\Longrightarrow\quad v = \sqrt{\frac{G\,M(<r)}{r}}, \qquad M(<r) = \frac{v^{2}\,r}{G}
```

<div class="meaning">

<dl>
<dt>v</dt><dd>the orbital speed at distance r from the centre</dd>
<dt>M(&lt;r)</dt><dd>the mass inside radius r. For a round distribution, only the mass inside pulls you on average</dd>
<dt>G</dt><dd>Newton's gravitational constant</dd>
<dt>Physical meaning</dt><dd>Speed tells you mass. Outside nearly all the mass, M stops growing and v falls as 1/√r: the "Kepler fall-off" of the planets (<a href="/learn/courses/astronomy/keplers-laws/">Kepler's laws</a>). If v stays the same, M(&lt;r) must keep growing in step with r.</dd>
</dl>

</div>

A spiral's starlight fades steeply with distance from the centre. If light traced mass, the rotation curve would rise, peak a few kiloparsecs out and then fall like the planets' speeds.

<div class="problem" data-problem="rotation-curves-kepler"></div>

## 2. What we found: flat

They do not fall. From a few kiloparsecs out to the last point anyone can measure, the speeds stay roughly constant: the curve is **flat**. Try to fit it yourself:

<figure class="fig" data-fig="rotation-curves"><figcaption>Made-up measurements of a Milky Way-like spiral (not real data, but shaped like real curves). Slide the stars and gas up and down: you can fit the middle, but never the outside. Add a dark halo and the total matches, with most of the mass inside 30 kpc dark. Speeds add as squares: v² = v<sub>stars</sub>² + v<sub>halo</sub>².</figcaption></figure>

A flat curve means M(&lt;r) ∝ r: twice as far out, twice the mass inside, though there is almost no light there. The simplest picture is a roughly round **halo** of dark matter around the disc, reaching many times farther than the stars, whose density falls off about as 1/r². For a galaxy like the Milky Way, the halo holds most of the mass: about a trillion suns in all, against some 60 billion in stars and gas. Our own Galaxy's rotation is harder to measure from inside it, but it tells the same story ([the Milky Way](/learn/courses/astronomy/milky-way/)).

<div class="problem" data-problem="rotation-curves-mass"></div>

Slide the galactic longitude and watch the velocity along the line of sight.

<figure class="fig" data-fig="@astro-galactic-los"><figcaption>Gas speeds along a line of sight depend on distance, and the largest value is at the tangent point, where the line gets closest to the centre. Reading that peak at each longitude gives the rotation speed at each radius: a flat rotation curve.</figcaption></figure>

## 3. Why radio telescopes clinched it

Optical spectra, like Rubin's, follow bright clouds of glowing gas around young stars, which fade out near the visible edge. Cold hydrogen gas glows at a radio wavelength of 21 cm, and it reaches two or more times farther than the stars. In the 1970s radio astronomers, notably Albert Bosma in the Netherlands and Morton Roberts in the United States, followed it far out. The curves stayed flat where there was almost no starlight at all: the mass could not be hiding in faint stars.

At the same time, theorists Jeremiah Ostriker, Jim Peebles and Amos Yahil in the US, and Jaan Einasto's group in Estonia, argued in 1973 and 1974 that spiral discs would be unstable, and galaxies too light for their groups, without massive halos. Galaxies, groups and clusters all pointed the same way.

<div class="history">

**Vera Rubin (1928-2016).** Rubin was turned away from Princeton's graduate programme, which did not admit women in astronomy at the time, and earned her PhD at Georgetown. At the Carnegie Institution in Washington she teamed up with Kent Ford, who had built a very sensitive image-tube spectrograph.

<ul class="timeline">
<li><b>1939</b> Horace Babcock finds the outer parts of Andromeda turning surprisingly fast.</li>
<li><b>1970</b> Rubin and Ford measure Andromeda's rotation from 67 glowing gas clouds, out to about 24 kpc: no fall-off.</li>
<li><b>1975</b> Roberts and Whitehurst follow Andromeda's hydrogen at 21 cm out to about 30 kpc: still flat.</li>
<li><b>1978-80</b> Rubin, Ford and Norbert Thonnard publish flat curves for dozens of spirals of every size. Bosma's 21 cm curves (1978 thesis, 1981 papers) reach far beyond the stars.</li>
<li><b>1980s</b> Most astronomers accept that spirals sit in dark halos.</li>
</ul>

The Vera C. Rubin Observatory in Chile, which began mapping the sky in 2025, is named after her.

</div>

<div class="myth">

**"A flat rotation curve means the galaxy turns like a solid wheel."** A wheel or a vinyl record has speeds that grow with distance (v ∝ r), so every part goes round in the same time. On a flat curve the speed is the same at every distance, so an outer star takes much longer to go round than an inner one, and spiral arms wind and shear. Flat means constant speed, not constant spin.

</div>

<div class="keypoints">

- A rotation curve plots orbital speed against distance from a galaxy's centre, measured by Doppler shifts.
- Newton: v = √(GM(&lt;r)/r), so M(&lt;r) = v²r/G. Mass only where the light is would make speeds fall far out.
- Measured curves stay flat, so M(&lt;r) grows in step with r: each spiral sits in a dark halo several times heavier than its stars.
- Rubin and Ford (optical, 1970-80) and radio astronomers following 21 cm hydrogen (1970s) made the case.

</div>
