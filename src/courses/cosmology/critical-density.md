---
title: "Critical density and Omega"
seoTitle: "Critical density of the universe and Omega, explained"
summary: "The critical density is the amount of stuff that makes the universe exactly flat: about 5 hydrogen atoms per cubic metre. How it follows from the Friedmann equation, what the density parameter Omega means, and how the universe's budget adds up."
minutes: 13
updated: 2026-11-22
quiz:
  - q: "Roughly how much is the critical density of our universe?"
    choices: ["About 5 hydrogen atoms per cubic metre","About 5 grams per cubic metre","About 5 atoms per cubic kilometre"]
    ans: 0
    why: "For H0 near 70 km/s per Mpc it is about 9 × 10⁻²⁷ kg/m³, the mass of about 5 to 6 hydrogen atoms in each cubic metre."
  - q: "What does Ω = 1 mean?"
    choices: ["The universe is one year old","Only one kind of matter exists","The universe holds exactly the critical density, so space is flat"]
    ans: 2
    why: "Ω is the actual density divided by the critical density. At exactly 1 the curvature term vanishes."
  - q: "Ordinary atoms make up about 5% of the critical density. What makes up the rest?"
    choices: ["Stars and planets","Light","About 26% dark matter and 69% dark energy"]
    ans: 2
    why: "The full budget adds to almost exactly 1, so space is flat, but most of it is not atoms. Modules 8 and 9 look at the dark parts."
sources:
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "M. Fukugita and P. J. E. Peebles (2004), The cosmic energy inventory, ApJ 616, 643 https://doi.org/10.1086/425155"
  - "Particle Data Group (2024), Review of Particle Physics: Astrophysical constants and parameters https://pdg.lbl.gov/2024/reviews/rpp2024-rev-astrophysical-constants.pdf"
---

**Module 5 · about 13 minutes.** Read first: [5.2 The Friedmann equation](/learn/courses/cosmology/friedmann-equation/). The Friedmann equation says that the expansion rate and the amount of stuff are tied together. Here we find the amount that makes space exactly flat. By the end you will be able to work out the critical density from H<sub>0</sub> and read the universe's budget in Ω.

<div class="bigidea">For any expansion rate there is one "just right" density that makes space flat. It is astonishingly small: a few atoms in each cubic metre.</div>

## 1. Just right

Set the curvature term in the Friedmann equation to zero, flat space, and solve for the density:

```math
\rho_c = \frac{3 H^2}{8 \pi G} \approx 9.2 \times 10^{-27}\ \text{kg/m}^3 \quad (H_0 = 70)
```

<div class="meaning">

<dl>
<dt>ρ<sub>c</sub></dt><dd>the critical density: the density that makes space flat for a given expansion rate</dd>
<dt>H</dt><dd>the expansion rate at that time (today H<sub>0</sub>, turned into "per second")</dd>
<dt>Physical meaning</dt><dd>It is the balance point of the thrown ball: the density at which gravity exactly matches the expansion. Double H<sub>0</sub> and you need four times the density.</dd>
</dl>

</div>

<figure class="fig" data-fig="critical-density"><figcaption>A cubic metre at the critical density holds only about 5 or 6 hydrogen atoms. Slide H₀ to change it, and slide Ω to see what a universe of matter alone would do with more or less than the critical amount.</figcaption></figure>

How empty is that? Per cubic metre, the air you breathe holds about 25 million million million million molecules, and the best vacuum made in a laboratory still holds about 10 billion atoms. The universe on average holds about 5 atoms' worth of stuff, and most of that is not even atoms.

<div class="problem" data-problem="critical-density"></div>

## 2. Omega: the universe's budget

Cosmologists measure each ingredient as a fraction of the critical density, called **Ω** (omega):

```math
\Omega = \frac{\rho}{\rho_c}, \qquad \Omega_{\text{total}} = \Omega_m + \Omega_r + \Omega_\Lambda, \qquad \Omega_k = 1 - \Omega_{\text{total}}
```

Today's budget, from the Planck satellite and other surveys (rounded):

<ul class="timeline">
<li><b>Ω<sub>Λ</sub> ≈ 0.69</b> dark energy (Module 9)</li>
<li><b>Ω<sub>m</sub> ≈ 0.31</b> matter, of which about 0.26 is dark matter (Module 8) and about 0.05 is ordinary atoms</li>
<li><b>Ω<sub>r</sub> ≈ 0.00009</b> radiation: the cosmic microwave background and neutrinos</li>
<li><b>Ω<sub>k</sub> ≈ 0.001 ± 0.002</b> curvature: zero within the errors. Space is flat (next lesson)</li>
</ul>

Stars make up less than 1% of the critical density. Everything you can see in a telescope is a thin froth on top of the universe's real contents.

<div class="history">

**Missing mass.** In the 1970s and 1980s cosmologists added up galaxies and clusters and found Ω<sub>m</sub> of only 0.2 to 0.3, while the favourite theory (inflation, Module 11) predicted a total of exactly 1. Either inflation was wrong or something was missing. In 1998 the missing 70% turned up, not as matter but as dark energy.

</div>

<div class="myth">

**"Ω = 1 means the universe is exactly balanced and will stop expanding."** That was true for a universe of matter alone. With dark energy, flatness and fate come apart: our universe is flat and will expand forever, faster and faster (Lesson 5.6).

</div>

<div class="keypoints">

- Critical density ρ<sub>c</sub> = 3H²/(8πG), about 9 × 10⁻²⁷ kg/m³ today: 5 to 6 hydrogen atoms per cubic metre.
- Ω = density ÷ critical density; Ω<sub>total</sub> = 1 means flat space.
- Today: dark energy 0.69, matter 0.31 (atoms only 0.05), radiation 0.00009, curvature about 0.
- With dark energy, Ω no longer decides the fate on its own.

</div>
