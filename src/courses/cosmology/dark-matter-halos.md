---
title: "Dark matter halos"
seoTitle: "What is a dark matter halo? Collapse and the NFW profile"
summary: "How a lump of dark matter stops expanding, falls back and settles into a halo about 200 times denser than average, and the NFW shape that every halo shares."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "In the simple spherical-collapse picture, what radius does a halo settle at?"
    choices: ["About half the radius it reached at turnaround","Zero: it collapses to a point","Twice its turnaround radius"]
    ans: 0
    why: "Energy is conserved, and a settled (virialised) cloud has a fixed balance of motion and gravity: the virial theorem then puts it at half the turnaround radius."
  - q: "What does M200 mean for a halo?"
    choices: ["A halo of 200 galaxies","The mass inside the radius where the average density is 200 times the critical density","A mass of 200 suns"]
    ans: 1
    why: "Halos have no sharp edge, so astronomers draw one: r200 encloses an average density 200 times the critical density, and M200 is the mass inside it. Other choices (like 200 times the mean matter density) are also used, so check which."
  - q: "How does the density of an NFW halo change with distance from the middle?"
    choices: ["It is the same everywhere","Roughly as 1/r near the middle and 1/r³ far out","It rises with distance"]
    ans: 1
    why: "Navarro, Frenk and White found this two-slope shape in simulated halos of every mass, from dwarf galaxies to clusters; the bend sits at the scale radius r_s."
sources:
  - "J. E. Gunn and J. R. Gott (1972), On the infall of matter into clusters of galaxies and some effects on their evolution, ApJ 176, 1 https://doi.org/10.1086/151605"
  - "W. H. Press and P. Schechter (1974), Formation of galaxies and clusters of galaxies by self-similar gravitational condensation, ApJ 187, 425 https://doi.org/10.1086/152650"
  - "J. F. Navarro, C. S. Frenk and S. D. M. White (1996), The structure of cold dark matter halos, ApJ 462, 563 https://doi.org/10.1086/177173"
  - "J. F. Navarro, C. S. Frenk and S. D. M. White (1997), A universal density profile from hierarchical clustering, ApJ 490, 493 https://doi.org/10.1086/304888"
  - "G. L. Bryan and M. L. Norman (1998), Statistical properties of X-ray clusters: analytic and numerical comparisons, ApJ 495, 80 https://doi.org/10.1086/305262"
---

**Module 10 · about 16 minutes.** Read first: [10.2 Gravity makes lumps](/learn/courses/cosmology/gravitational-instability/). Rotation curves showed that every spiral galaxy sits in a dark halo ([Lesson 8.2](/learn/courses/cosmology/rotation-curves/)). Here we see how such halos form, how dense they are, and what shape they take. By the end you will be able to follow a lump from expansion to collapse, give a halo its size from its mass, and read the NFW profile.

<div class="bigidea">A slightly dense ball of dark matter expands with the universe, slows, stops, falls back and settles into a halo about 200 times denser than average. Halos of every mass then share one shape: dense in the middle, thinning out ever faster outwards.</div>

## 1. Up, stop, down: spherical collapse

Picture a ball of matter a little denser than its surroundings. Like a ball thrown upwards ([Lesson 5.2](/learn/courses/cosmology/friedmann-equation/)), it expands with the universe but slows more than the average, because its extra mass pulls harder. If it is dense enough it stops growing, **turns around**, and falls back. In 1972 James Gunn and Richard Gott worked this out exactly for a perfectly round ball in a universe of matter alone.

<div class="steps" data-fig="dark-matter-halos">
<div class="step">The dense ball (blue) expands along with the universe, but a little slower than an average patch with the same mass (dashed grey). The gap between them grows.</div>
<div class="step">Turnaround: the ball reaches its biggest size and stops. It is now about 5.55 times denser than the average universe around it.</div>
<div class="step">It falls back in. A perfectly smooth ball would fall to a point, at exactly twice the turnaround time.</div>
<div class="step">A real lump is never perfect: its bits fly past each other, swirl about and settle (virialise) at half the turnaround radius. At that moment it is about 178 times denser than the average universe: a halo.</div>
</div>

Why half? Once settled, a swarm held by its own gravity obeys the **virial theorem**: its energy of motion is half the size of its gravitational energy. At turnaround the ball is momentarily still, so all its energy is gravitational; energy is conserved, and the only way to have the same total energy with motion included is to shrink to half the radius. Half the radius means eight times the density of the ball at turnaround; and while it collapsed the universe kept expanding and thinning, which takes the contrast from 5.55 to 18π² ≈ 178.

```math
\Delta_{\rm vir} = 18\pi^{2} \approx 178, \qquad \delta_{\rm lin} = 1.686 \text{ at collapse}
```

<div class="meaning">

<dl>
<dt>Δ<sub>vir</sub></dt><dd>the settled halo's density divided by the average density of the universe at that time, for a universe of matter only</dd>
<dt>δ<sub>lin</sub> = 1.686</dt><dd>what the simple growing picture of Lesson 10.2 (δ ∝ a) says the lump's density contrast would be at the moment of collapse, if it had kept growing gently. The real contrast is 178; the 1.686 is a handy threshold: a ripple collapses when its linear δ reaches it</dd>
<dt>Physical meaning</dt><dd>Halos are dense, settled clouds a couple of hundred times denser than the cosmic average. With the threshold 1.686 one can count how many halos of each mass exist at any time, as William Press and Paul Schechter did in 1974.</dd>
</dl>

</div>

<div class="problem" data-problem="dark-matter-halos-collapse"></div>

## 2. Where does a halo end?

A halo fades smoothly into its surroundings, so astronomers draw an edge by agreement. The commonest choice is **r<sub>200</sub>**: the radius inside which the average density is 200 times the **critical** density ([Lesson 5.3](/learn/courses/cosmology/critical-density/)), with M<sub>200</sub> the mass inside it. Other papers use 200 times the mean matter density (a bigger radius), or the "virial" contrast, which with dark energy today is about 100 times the critical density (Bryan and Norman 1998). The numbers differ by tens of percent, so always check which is meant.

```math
M_{200} = \frac{4\pi}{3}\, r_{200}^{3} \times 200\,\rho_c
```

<div class="meaning">

<dl>
<dt>M<sub>200</sub>, r<sub>200</sub></dt><dd>the halo's mass and its edge</dd>
<dt>ρ<sub>c</sub></dt><dd>the critical density today, about 1.3 × 10¹¹ suns per cubic megaparsec (for a halo seen at redshift z, the critical density then)</dd>
<dt>Physical meaning</dt><dd>Mass sets size: r<sub>200</sub> grows as the cube root of the mass. The Milky Way's halo, about 10¹² suns, reaches some 200 kpc, more than ten times the radius of its star disc. A rich cluster of 10¹⁵ suns reaches about 2 Mpc.</dd>
</dl>

</div>

<div class="problem" data-problem="dark-matter-halos-r200"></div>

## 3. One shape for every halo

When computers could follow millions of particles, Julio Navarro, Carlos Frenk and Simon White looked at the halos that formed, from dwarf galaxies to rich clusters. In 1996 and 1997 they found that all of them had the same shape, now called the **NFW profile**:

```math
\rho(r) = \frac{\rho_s}{(r/r_s)\,(1 + r/r_s)^{2}}, \qquad c = \frac{r_{200}}{r_s}
```

<div class="meaning">

<dl>
<dt>r<sub>s</sub></dt><dd>the scale radius, where the profile bends</dd>
<dt>ρ<sub>s</sub></dt><dd>a density that sets the overall level (fixed by the mass and c)</dd>
<dt>c</dt><dd>the concentration: how compact the middle is compared with the edge. Small halos have higher c (about 10 to 20) because they formed earlier, when the universe was denser; clusters have c of about 4 to 6</dd>
<dt>Physical meaning</dt><dd>Inside r<sub>s</sub> the density rises as 1/r towards the middle (a "cusp"); far outside it falls as 1/r³. In between it falls about as 1/r², which is exactly what makes a rotation curve flat.</dd>
</dl>

</div>

<figure class="fig" data-fig="dark-matter-halos-2"><figcaption>Top: an NFW halo's density, on scales that multiply by 10. Bottom: the speed of a circular orbit, √(GM(&lt;r)/r): it rises, peaks at 2.16 r<sub>s</sub>, then falls only gently, nearly flat across the range where a galaxy's disc lies. Change the mass from a dwarf galaxy (10⁹ suns) to a cluster (10¹⁵), and the concentration.</figcaption></figure>

Halos are not perfectly round, either: they are slightly squashed, like a rugby ball, and they are full of smaller **subhalos**, the remains of halos that fell in earlier, some hosting satellite galaxies such as the Magellanic Clouds. The NFW cusp also leads to one of the open puzzles: many small galaxies seem to have smooth "cores" instead ([Lesson 8.8](/learn/courses/cosmology/dark-matter-today/)).

<div class="history">

<ul class="timeline">
<li><b>1972</b> Gunn and Gott: spherical infall and collapse in an expanding universe.</li>
<li><b>1974</b> Press and Schechter: how many halos of each mass, from the 1.686 threshold.</li>
<li><b>1985</b> Davis, Efstathiou, Frenk and White's computer models of cold dark matter make halos and galaxy clustering like the real ones.</li>
<li><b>1996-97</b> Navarro, Frenk and White find one profile for halos of every mass.</li>
<li><b>2008</b> The Aquarius and Via Lactea simulations resolve Milky Way halos with about a billion particles each, and find tens of thousands of subhalos.</li>
</ul>

</div>

<div class="myth">

**"A dark matter halo is a ring around the galaxy, like an angel's halo."** It is a huge, roughly round cloud, densest in the middle, with the visible galaxy sitting deep in its centre. Most of the galaxy's mass is in the halo, spread far beyond the stars; the stars are like the yolk in an egg many times bigger than the yolk.

</div>

<div class="keypoints">

- A slightly dense ball expands, turns around (5.55 times denser than average), falls back and settles at half its turnaround radius, about 178 times denser than average.
- A ripple collapses when its linear density contrast reaches about 1.686: the threshold for counting halos.
- Halo edges are a convention; r<sub>200</sub> encloses 200 times the critical density. M<sub>200</sub> = (4π/3) r<sub>200</sub>³ × 200ρ<sub>c</sub>.
- Halos of every mass share the NFW shape: density ∝ 1/r inside r<sub>s</sub>, 1/r³ far outside; c = r<sub>200</sub>/r<sub>s</sub>.
- The Milky Way's halo: about 10¹² suns, reaching some 200 kpc, full of subhalos.

</div>
