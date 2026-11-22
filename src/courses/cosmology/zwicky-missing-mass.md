---
title: "Zwicky's missing mass"
seoTitle: "Who discovered dark matter? Zwicky and the Coma cluster"
summary: "In 1933 Fritz Zwicky found the Coma cluster's galaxies far too fast for the mass that shines. How the virial theorem weighs a cluster, and why dark matter stayed."
minutes: 14
updated: 2026-11-22
quiz:
  - q: "What did Zwicky measure in the Coma cluster in 1933?"
    choices: ["How fast its galaxies move, from their redshifts", "The temperature of its hot gas", "Its distance, with Cepheid stars"]
    ans: 0
    why: "He used the redshifts of a handful of Coma galaxies. Their speeds differed by about a thousand km/s or more, far too much for the gravity of the visible galaxies to hold them."
  - q: "The virial theorem links which two things in a cluster that has settled down?"
    choices: ["The energy of motion of its galaxies and their gravitational energy", "Its brightness and its colour", "Its age and its distance"]
    ans: 0
    why: "For a settled group of orbiting bodies, twice the energy of motion plus the (negative) gravitational energy is zero on average. Measure the speeds and the size, and you get the mass."
  - q: "Zwicky's mass-to-light ratio was too big partly because Hubble's expansion rate was about 8 times too high. Did the missing mass go away once that was fixed?"
    choices: ["No: corrected, clusters still hold far more mass than their stars and gas", "Yes: there is no missing mass in clusters", "Nobody has checked since 1933"]
    ans: 0
    why: "With today's H0 his ratio drops about 8-fold, but it is still many times what stars give. X-ray gas found later adds several times the stars, and still most of the mass is dark."
sources:
  - "F. Zwicky (1933), Die Rotverschiebung von extragalaktischen Nebeln, Helvetica Physica Acta 6, 110 https://ui.adsabs.harvard.edu/abs/1933AcHPh...6..110Z"
  - "F. Zwicky (1937), On the masses of nebulae and of clusters of nebulae, ApJ 86, 217 https://doi.org/10.1086/143864"
  - "S. Smith (1936), The mass of the Virgo cluster, ApJ 83, 23 https://doi.org/10.1086/143697"
  - "G. Bertone and D. Hooper (2018), History of dark matter, Reviews of Modern Physics 90, 045002 https://doi.org/10.1103/RevModPhys.90.045002"
---

**Module 8 · about 14 minutes.** Read first: [5.3 Critical density and Omega](/learn/courses/cosmology/critical-density/). That lesson said only about 5% of the universe is atoms and about 26% is "dark matter". Module 8 is the story of how we found that out, what the dark matter might be, and how people are hunting for it. It starts in 1933 with one stubborn astronomer and a cluster of galaxies. By the end you will be able to weigh a galaxy cluster from the speeds of its galaxies, and explain why the answer was such a shock.

<div class="bigidea">Things that orbit fast need a strong pull to keep them in. The galaxies in a cluster move so fast that the cluster must weigh far more than everything that shines in it.</div>

## 1. A swarm of galaxies

The **Coma cluster** is a swarm of more than a thousand galaxies about 320 million light-years away, held together by their own gravity. In 1933 the Swiss astronomer **Fritz Zwicky**, working at Caltech, looked at the redshifts of a few of its galaxies (the [Doppler shift](/learn/courses/astronomy/doppler-shift/) of their light). The cluster as a whole moves away from us with the expansion of the universe, but the galaxies also move about inside it, so their speeds differ from the average. Zwicky found differences of well over a thousand kilometres per second.

Think of a playground roundabout. The faster it spins, the harder the children must grip to stay on. Gravity is the cluster's grip. Zwicky asked how much grip the galaxies he could see provided, and found it was hopelessly too weak: at those speeds the cluster should fly apart in far less time than its age. Yet there it is.

<figure class="fig" data-fig="zwicky-missing-mass"><figcaption>A toy cluster. The galaxies always start with the same, measured speeds; you choose how much the whole cluster weighs. With only the stars' mass, almost every galaxy escapes. Adding the hot gas found much later (about 7 times the stars in total) is still not enough. The cluster holds together only with roughly 50 times the mass of its stars.</figcaption></figure>

## 2. Weighing with the virial theorem

Zwicky used a rule from the physics of gases and orbits, the **virial theorem**. In any group of bodies that has settled down under its own gravity, the energy of motion and the gravitational energy keep a fixed balance on average:

```math
2\,K + U = 0
```

For a ball of galaxies of total mass *M* and radius *R*, with a measured spread of speeds σ along our line of sight, it gives

```math
M \approx \frac{5\,\sigma^{2} R}{G}
```

<div class="meaning">

<dl>
<dt>K</dt><dd>the total energy of motion of the galaxies, ½ M ⟨v²⟩. Speeds along the line of sight are one of three directions, so ⟨v²⟩ ≈ 3σ²</dd>
<dt>U</dt><dd>the gravitational energy, negative. For a uniform ball U = −(3/5) G M² / R</dd>
<dt>σ</dt><dd>the velocity dispersion: the typical difference between a galaxy's speed and the cluster's average speed, measured from redshifts</dd>
<dt>R, G</dt><dd>the radius of the cluster and Newton's gravitational constant</dd>
<dt>Physical meaning</dt><dd>Fast-moving galaxies need a deep gravitational well. Measure the speeds and the size, and the mass follows, whether that mass shines or not. Double σ and the mass is four times bigger.</dd>
</dl>

</div>

Put in modern values for Coma, σ ≈ 1,000 km/s and R ≈ 1.5 Mpc (about 5 million light-years), and the mass comes out near 2 × 10<sup>15</sup> suns. The galaxies' stars add up to only a small fraction of that.

<div class="problem" data-problem="zwicky-missing-mass-virial"></div>

## 3. Hundreds of times more mass than light

Astronomers compare a mass with the light it gives out, the **mass-to-light ratio**, in units where the Sun is 1. Ordinary stellar populations come out at a few: some stars are heavier and dimmer than the Sun, some lighter and brighter. In his fuller 1937 analysis, Zwicky's Coma cluster came out at about **500**. Already in his 1933 paper, written in German, he concluded that if this held up, the cluster's average density would have to be at least 400 times what the visible galaxies supply, and he called the extra *dunkle Materie*: **dark matter**.

His number was too big, for a reason nobody could know in 1933. He found the cluster's distance from Hubble's law, using Hubble's value of the expansion rate, 558 km/s per Mpc, about 8 times today's (Lesson 4.2). That put Coma about 8 times too close. The virial mass grows in step with the distance (M ∝ R), but the light grows as the distance squared, so the mass-to-light ratio was about 8 times too high. Correct for that and it is still dozens to hundreds, far above what stars give.

<div class="problem" data-problem="zwicky-missing-mass-hubble"></div>

## 4. The gas that was not enough

In the 1970s X-ray satellites found that clusters are filled with gas at tens of millions of degrees, glowing in X-rays. It holds several times more mass than the stars in the galaxies. Could that be Zwicky's missing mass? Weigh it, and it falls well short. Today's census of a big cluster is roughly: stars about 2% of the mass, hot gas about 12%, and dark matter about 85%. The hot gas is itself a second weighing scale: it is so hot that the cluster needs all that extra gravity to keep it from boiling away. Lensing, the third scale (Lesson 3.8), agrees.

<div class="history">

**A mystery that waited 40 years.** Zwicky was famously combative, and his result was largely set aside for decades: perhaps clusters were not settled, or galaxies were heavier than thought.

<ul class="timeline">
<li><b>1922</b> Jacobus Kapteyn uses the motions of stars near the Sun to weigh the Milky Way's disc and uses the phrase "dark matter" for matter we cannot see.</li>
<li><b>1932</b> Jan Oort does the same, more carefully: the disc may hold some unseen mass (later work found little).</li>
<li><b>1933</b> Zwicky finds the Coma cluster's galaxies far too fast for its visible mass.</li>
<li><b>1936</b> Sinclair Smith finds the same in the Virgo cluster: about 200 billion suns per galaxy, far more than estimates from their light.</li>
<li><b>1937</b> Zwicky publishes the full analysis in English, and suggests that galaxies and clusters could act as gravitational lenses to weigh them.</li>
<li><b>1970s</b> Galaxy rotation curves (next lesson) and X-ray gas in clusters make the problem impossible to ignore.</li>
</ul>

</div>

<div class="myth">

**"Zwicky's dark matter was just the hot gas we had not seen yet."** The gas is real and heavier than all the stars, but it is still only about one sixth of a cluster's mass. Every way of weighing clusters (speeds, hot gas, lensing) finds most of the mass is something else.

</div>

<div class="keypoints">

- In 1933 Zwicky found the galaxies of the Coma cluster moving far too fast to be held by the mass that shines.
- The virial theorem, 2K + U = 0, turns speeds and size into a mass: M ≈ 5σ²R/G.
- His mass-to-light ratio, about 500, was too big by about 8 because of Hubble's expansion rate, but the missing mass survives the correction.
- Clusters are about 2% stars, 12% hot gas and 85% dark matter.

</div>
