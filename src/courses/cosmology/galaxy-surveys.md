---
title: "Mapping millions of galaxies"
seoTitle: "Galaxy redshift surveys: how we map the universe in 3D"
summary: "From 1,100 galaxies in the CfA slice to tens of millions with DESI: how redshift surveys map the universe in 3-D, what fingers of God are and what maps measure."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "Why does a 3-D map of galaxies need redshifts?"
    choices: ["Redshifts make galaxies brighter","A picture gives only directions; the redshift gives each galaxy's distance through Hubble's law","Redshifts give the galaxies' masses"]
    ans: 1
    why: "Photos are flat: they show where on the sky, not how far. Measuring each galaxy's redshift with a spectrum adds the third dimension."
  - q: "What are the 'fingers of God' in a redshift map?"
    choices: ["Clusters stretched along our line of sight, because their galaxies' fast motions add to their redshifts","Real chains of galaxies pointing at the Milky Way","Errors in the telescope"]
    ans: 0
    why: "Galaxies in a cluster swarm at about 1,000 km/s. Turning redshift into distance with Hubble's law smears the cluster out along the line of sight into a finger pointing at us. Nothing is special about our place."
  - q: "What lets modern surveys measure millions of redshifts?"
    choices: ["Faster film","Fibres or slits that take spectra of thousands of galaxies at once","Bigger mirrors alone"]
    ans: 1
    why: "2dF took 400 spectra at a time, SDSS 640 to 1,000, DESI 5,000 with robot-positioned fibres. Multiplexing turned years of work into nights."
sources:
  - "V. de Lapparent, M. J. Geller and J. P. Huchra (1986), A slice of the universe, ApJ 302, L1 https://doi.org/10.1086/184625"
  - "M. Colless et al. (2001), The 2dF Galaxy Redshift Survey: spectra and redshifts, MNRAS 328, 1039 https://doi.org/10.1046/j.1365-8711.2001.04902.x"
  - "D. G. York et al. (2000), The Sloan Digital Sky Survey: technical summary, AJ 120, 1579 https://doi.org/10.1086/301513"
  - "K. S. Dawson et al. (2013), The Baryon Oscillation Spectroscopic Survey of SDSS-III, AJ 145, 10 https://doi.org/10.1088/0004-6256/145/1/10"
  - "N. Kaiser (1987), Clustering in real space and in redshift space, MNRAS 227, 1 https://doi.org/10.1093/mnras/227.1.1"
  - "DESI Collaboration (2016), The DESI Experiment Part I: science, targeting, and survey design, arXiv:1611.00036 https://arxiv.org/abs/1611.00036"
---

**Module 10 · about 15 minutes.** Read first: [10.4 The cosmic web](/learn/courses/cosmology/cosmic-web/). A photograph of the sky is flat: it shows directions but not distances. To see the cosmic web, astronomers measure a redshift for every galaxy and place it in three dimensions. By the end you will be able to explain how these surveys work, recognise the illusions in their maps, and say what they measure.

<div class="bigidea">A redshift survey turns a flat picture into a 3-D map by measuring the redshift, and so the distance, of each galaxy. From a thousand galaxies in 1986 to tens of millions today, these maps revealed the cosmic web and now measure the expansion and growth of the universe.</div>

## 1. Redshift as distance

Spread a galaxy's light into a spectrum, find a known line, and its shift gives the redshift z ([Lesson 4.5](/learn/courses/cosmology/cosmological-redshift/)). Nearby, Hubble's law turns that into distance ([Lesson 4.2](/learn/courses/cosmology/hubble-law/)); farther away, the full calculation of [Lesson 5.8](/learn/courses/cosmology/cosmological-distances/) does:

```math
d \approx \frac{c\,z}{H_0} \quad (z \ll 1), \qquad V = \frac{\Omega_{\rm sky}}{4\pi} \cdot \frac{4\pi}{3} D_C^{3}
```

<div class="meaning">

<dl>
<dt>d, z, H<sub>0</sub></dt><dd>distance, redshift and the Hubble constant; c z is the apparent speed of recession</dd>
<dt>Ω<sub>sky</sub>/4π</dt><dd>the fraction of the whole sky the survey covers (the whole sky is 41,253 square degrees)</dd>
<dt>D<sub>C</sub></dt><dd>the comoving distance to the survey's farthest redshift</dd>
<dt>V</dt><dd>the comoving volume mapped</dd>
<dt>Physical meaning</dt><dd>Wide and deep is what matters: the volume grows as the cube of the depth. More volume means more independent pieces of the web to average over, so smaller statistical noise in anything measured from it, such as the BAO ruler.</dd>
</dl>

</div>

<div class="problem" data-problem="galaxy-surveys-volume"></div>

The slow part was always the spectra. A galaxy's spectrum needs far more light than its picture. The trick that changed everything is **multiplexing**: drilling a plate, or moving robot arms, so that optical fibres sit on hundreds or thousands of galaxies at once, each feeding its own spectrum.

## 2. A history in maps

<figure class="fig" data-fig="galaxy-surveys"><figcaption>Wedge (cone) maps like the ones the real surveys published: we sit at the point at the bottom, and each dot is a galaxy, placed by its direction and its redshift. Pick a survey to see how deep it reached. The dots are drawn from a toy cosmic web, not from the surveys' data; depths and numbers follow the real surveys. In the DESI view, colours mark the kinds of target it uses at each depth.</figcaption></figure>

- **CfA (1977 onwards).** At the Center for Astrophysics in Cambridge, Massachusetts, Marc Davis, John Huchra and colleagues measured redshifts one galaxy at a time. In 1986 Valérie de Lapparent, Margaret Geller and John Huchra published "A slice of the universe": about 1,100 galaxies in a thin strip of sky, out to 15,000 km/s. Instead of an even spread, galaxies lay on the walls of bubbles, with the Coma cluster forming the body of a "stick man". In 1989 the CfA2 survey revealed the Great Wall.
- **2dF Galaxy Redshift Survey (1997-2002).** The Anglo-Australian Telescope's Two-degree Field instrument took 400 spectra at a time: 221,414 galaxy redshifts out to z ≈ 0.3.
- **Sloan Digital Sky Survey (2000 onwards).** A dedicated 2.5 m telescope in New Mexico imaged a third of the sky and measured nearly a million nearby galaxies; its BOSS (2009-14) and eBOSS (2014-19) stages added about 1.5 million luminous galaxies to z ≈ 0.7, then emission-line galaxies and quasars to z ≈ 2.2. SDSS found the Sloan Great Wall and the BAO bump ([Lesson 10.7](/learn/courses/cosmology/baryon-acoustic-oscillations/)).
- **DESI (2021 onwards).** The Dark Energy Spectroscopic Instrument on the 4 m Mayall telescope in Arizona has 5,000 robot-positioned fibres. It is designed to measure about 40 million galaxies and quasars over five years, using different kinds of target at different depths: bright galaxies nearby, luminous red galaxies to z ≈ 1, star-forming galaxies to z ≈ 1.6, and quasars beyond. What its map says about dark energy is [Lesson 9.6](/learn/courses/cosmology/desi-dark-energy/).

Next come the space telescopes Euclid and Roman and the ground-based Rubin Observatory, which will map billions of galaxies, mostly using colours (photometric redshifts) instead of spectra ([Lesson 12.5](/learn/courses/cosmology/new-surveys/)).

## 3. Illusions in the map: fingers and squashing

A redshift is not quite a distance. Galaxies also move through space, and that motion adds to their redshift. A survey that turns every redshift into distance with Hubble's law makes two tell-tale distortions:

- **Fingers of God.** In a cluster, galaxies swarm about at around 1,000 km/s. Their redshifts are scattered, so the cluster is smeared out into a long finger pointing at the observer. (The name is a joke: the fingers point at us, but only because we are the ones measuring.)
- **The Kaiser squashing.** On large scales, matter is falling into walls and filaments. Galaxies on the near side fall away from us, and on the far side towards us, so walls look thinner along the line of sight than they are. Nick Kaiser showed in 1987 how to read the infall speed from this squashing.

<div class="problem" data-problem="galaxy-surveys-fingers"></div>

These distortions are not just a nuisance. The squashing measures how fast structure is growing, the growth rate of Lesson 10.2, which tests gravity itself on the largest scales: dark energy should slow it by a known amount, and a change to Einstein's gravity would change it differently ([Lesson 12.3](/learn/courses/cosmology/s8-tension/)).

<div class="history">

<ul class="timeline">
<li><b>1977-82</b> The first CfA survey: about 2,400 redshifts, one galaxy at a time.</li>
<li><b>1986</b> "A slice of the universe": galaxies on bubble walls, and the stick man.</li>
<li><b>1989</b> The CfA2 Great Wall.</li>
<li><b>1997-2002</b> The 2dF survey: 221,414 redshifts with 400 fibres at a time.</li>
<li><b>2000-14</b> SDSS and BOSS: millions of spectra; the BAO detected in 2005.</li>
<li><b>2021</b> DESI begins its main survey with 5,000 robotic fibres.</li>
</ul>

</div>

<div class="myth">

**"The fingers of God show that the Milky Way is at the centre."** Every observer anywhere would see clusters pointing at themselves, because the stretch comes from turning speeds along the line of sight into distances. It is an effect of how we measure, not of where we are ([the cosmological principle](/learn/courses/cosmology/cosmological-principle/)).

</div>

<div class="keypoints">

- Redshift surveys measure a spectrum for each galaxy, turning its redshift into a distance to build a 3-D map.
- Multiplexing (hundreds to thousands of fibres at once) took surveys from about 1,100 galaxies (CfA slice, 1986) to 221,414 (2dF), millions (SDSS, BOSS) and a planned 40 million (DESI).
- The maps revealed bubbles, walls and great walls: the cosmic web.
- Galaxy motions distort the maps: fingers of God in clusters, squashing on large scales. The squashing measures how fast structure grows.
- Wide, deep maps give the BAO ruler and the growth of structure, the two main tests of dark energy from galaxies.

</div>
