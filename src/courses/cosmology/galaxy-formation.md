---
title: "How galaxies form"
seoTitle: "How do galaxies form? Halos, cooling, mergers and feedback"
summary: "Small halos form first and merge; gas cools into discs of stars; supernovae and black holes push back. The bottom-up story of how galaxies like ours were built."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "In the cold dark matter picture, which form first?"
    choices: ["Small halos, which merge over time into bigger ones (bottom-up)","Giant superclusters, which break up into galaxies (top-down)","Clusters and galaxies at the same moment"]
    ans: 0
    why: "Cold dark matter has power on small scales, and small ripples reach collapse first. Galaxy clusters are still assembling today."
  - q: "Why does cooling gas in a halo end up in a spinning disc?"
    choices: ["Magnetic fields pull it flat","The gas has a little spin; as it sinks inwards it keeps its angular momentum, so it spins faster and flattens","Dark matter forms a disc first"]
    ans: 1
    why: "Like a skater pulling in their arms, gas that falls inwards spins faster. It can lose energy by radiating, but not its spin, so it settles into a thin rotating disc."
  - q: "Which halos are best at turning their atoms into stars?"
    choices: ["The smallest ones","The biggest clusters","Those of about 10¹² suns, near the Milky Way's mass, and even they convert only about a fifth"]
    ans: 2
    why: "In small halos, supernova winds blow gas out of a shallow well; in big ones, the gas stays hot and the central black hole keeps heating it. The sweet spot is near the Milky Way's mass."
sources:
  - "S. D. M. White and M. J. Rees (1978), Core condensation in heavy halos: a two-stage theory for galaxy formation and clustering, MNRAS 183, 341 https://doi.org/10.1093/mnras/183.3.341"
  - "M. J. Rees and J. P. Ostriker (1977), Cooling, dynamics and fragmentation of massive gas clouds: clues to the masses and radii of galaxies and clusters, MNRAS 179, 541 https://doi.org/10.1093/mnras/179.4.541"
  - "S. M. Fall and G. Efstathiou (1980), Formation and rotation of disc galaxies with haloes, MNRAS 193, 189 https://doi.org/10.1093/mnras/193.2.189"
  - "A. Dekel and J. Silk (1986), The origin of dwarf galaxies, cold dark matter, and biased galaxy formation, ApJ 303, 39 https://doi.org/10.1086/164050"
  - "B. P. Moster, T. Naab and S. D. M. White (2013), Galactic star formation and accretion histories from matching galaxies to dark matter haloes, MNRAS 428, 3121 https://doi.org/10.1093/mnras/sts261"
  - "P. Madau and M. Dickinson (2014), Cosmic star-formation history, Annual Review of Astronomy and Astrophysics 52, 415 https://doi.org/10.1146/annurev-astro-081811-125615"
  - "A. Helmi et al. (2018), The merger that led to the formation of the Milky Way's inner stellar halo and thick disk, Nature 563, 85 https://doi.org/10.1038/s41586-018-0625-x"
---

**Module 10 · about 16 minutes.** Read first: [10.3 Dark matter halos](/learn/courses/cosmology/dark-matter-halos/). Halos are the scaffolding; galaxies are what the gas builds inside them. By the end you will be able to tell the bottom-up story of how a galaxy like ours was assembled, explain why its stars sit in a disc, and say why galaxies turn so little of their gas into stars.

<div class="bigidea">Galaxies grow from the bottom up: small halos form first and merge into bigger ones. Inside each, gas cools, sinks and spins into a disc of stars, while exploding stars and black holes push back, so most of the gas never becomes stars at all.</div>

## 1. Small first, big later

Cold dark matter has ripples on every scale, and the small ones reach collapse first ([Lesson 10.3](/learn/courses/cosmology/dark-matter-halos/)). So small halos form first, and bigger ones are built by swallowing and merging with them: **hierarchical**, or bottom-up, growth. The record of who merged with whom is called a **merger tree**. Clusters of galaxies, the biggest settled objects, are still being assembled today, with groups still falling in along the filaments of the cosmic web ([Lesson 10.4](/learn/courses/cosmology/cosmic-web/)). The rival top-down picture, in which giant pancakes form first and break up into galaxies, goes with hot dark matter and was ruled out in the 1980s ([Lesson 8.5](/learn/courses/cosmology/dark-matter-candidates/)).

<div class="steps" data-fig="galaxy-formation">
<div class="step">First, many small dark matter halos, each perhaps a million suns, collapse around z ≈ 20 on the rare high peaks.</div>
<div class="step">Over billions of years they merge, two by two and many at a time, into ever bigger halos. Time runs down the page; the bottom is a Milky Way-sized halo of about 10¹² suns.</div>
<div class="step">Gas that falls in is heated by the collision. The part that can radiate its heat away cools, sinks to the middle and, keeping its spin, settles into a thin rotating disc where stars form.</div>
<div class="step">Feedback: exploding stars drive winds out of the disc, and the black hole in the middle shoots out jets and heats the gas around it. Both stop the gas turning into stars too fast.</div>
</div>

## 2. Cooling: the gas must lose its heat

Gas falling into a halo is heated by shocks to about the halo's "virial temperature": around a million degrees for the Milky Way's halo. Hot gas holds itself up with its pressure. To sink and make stars it must radiate that heat away, and it can only collapse when it cools faster than it would fall in:

```math
t_{\rm cool} < t_{\rm ff}, \qquad t_{\rm ff} = \sqrt{\frac{3\pi}{32\, G\rho}}
```

<div class="meaning">

<dl>
<dt>t<sub>cool</sub></dt><dd>the cooling time: how long the gas takes to radiate away its heat (shorter for denser gas)</dd>
<dt>t<sub>ff</sub></dt><dd>the free-fall time: how long a ball of density ρ, with nothing holding it up, takes to collapse completely</dd>
<dt>ρ</dt><dd>the density of the cloud</dd>
<dt>Physical meaning</dt><dd>If gas cools faster than it falls, it collapses and can fragment into stars. If not, it sits in the halo as a hot atmosphere. In 1977 Martin Rees and Jeremiah Ostriker, and Joseph Silk, showed this sets the largest masses of galaxies: about 10¹² suns of gas. Bigger halos, like clusters, keep most of their gas hot.</dd>
</dl>

</div>

In 1978 Simon White and Martin Rees put it together: dark matter halos form hierarchically, and galaxies are the gas that cooled and condensed in their middles. That two-stage picture is still the basis of galaxy formation theory.

<div class="problem" data-problem="galaxy-formation-freefall"></div>

## 3. Discs and ellipticals

Every halo gets a little spin from the tugs of its neighbours. When gas cools and sinks inwards it can radiate away energy but not its spin (angular momentum), so, like a spinning skater pulling in their arms, it spins faster and flattens into a thin disc. Mike Fall and George Efstathiou showed in 1980 that this naturally gives discs the sizes we see, but only if the disc sits inside a much heavier halo: another quiet piece of evidence for dark matter.

When two big galaxies of similar size collide, their discs are wrecked and the stars end up on random orbits: a round or egg-shaped **elliptical galaxy** ([galaxy types](/learn/courses/astronomy/galaxy-types/)). The Milky Way has had no such major merger for about 10 billion years; its last big meal, a galaxy called Gaia-Enceladus, was found in 2018 from the motions of stars measured by the Gaia satellite.

## 4. Feedback, and why galaxies waste their gas

Without something holding it back, cooling gas would turn into stars far too fast, and galaxies would be much bigger and redder than they are. Something pushes back: **feedback**.

- In small halos, the winds from **supernovae** blow gas out of the shallow gravity well (Avishai Dekel and Joseph Silk, 1986).
- In big halos, the **supermassive black hole** in the middle swallows gas and releases enormous energy as jets and radiation, heating the gas around it so it cannot cool ([black holes](/learn/courses/cosmology/black-holes/)).

<figure class="fig" data-fig="galaxy-formation-2"><figcaption>How much of a halo's mass ends up in stars today, from matching galaxy counts to halo counts (Moster, Naab and White 2013). The dashed line is the most possible: all of the halo's fair share of atoms, 15.7%. Even at the peak, near the Milky Way's mass, only about a fifth of those atoms became stars.</figcaption></figure>

<div class="problem" data-problem="galaxy-formation-efficiency"></div>

All this is written in the **cosmic star formation history**: the universe made stars fastest at about redshift 2, some 10 billion years ago ("cosmic noon"), and today makes them roughly ten times more slowly (Piero Madau and Mark Dickinson's review, 2014).

<div class="history">

<ul class="timeline">
<li><b>1972</b> Alar and Juri Toomre show colliding disc galaxies make tails and bridges, and suggest mergers make ellipticals.</li>
<li><b>1977</b> Rees and Ostriker, and Silk: cooling sets the masses of galaxies.</li>
<li><b>1978</b> White and Rees: galaxies form by gas cooling in hierarchically growing dark matter halos.</li>
<li><b>1980</b> Fall and Efstathiou: discs from spinning, cooling gas inside heavy halos.</li>
<li><b>1986</b> Dekel and Silk: supernova winds explain why small galaxies are so faint.</li>
<li><b>2018</b> Gaia data reveal Gaia-Enceladus, a galaxy the Milky Way swallowed about 10 billion years ago.</li>
</ul>

</div>

<div class="myth">

**"A galaxy is mostly stars."** By mass, a galaxy like ours is mostly dark matter: about 10¹² suns in the halo against some 6 × 10¹⁰ in stars. And even of its ordinary atoms, much is not in stars but in thin, hot gas spread through the halo, or was blown out long ago by feedback.

</div>

<div class="keypoints">

- Galaxies form bottom-up: small halos first, merging into bigger ones (a merger tree); clusters are still forming.
- Gas is heated as it falls in and must cool (t<sub>cool</sub> &lt; t<sub>ff</sub>) before it can sink and form stars.
- Cooling gas keeps its spin and flattens into a disc; major mergers make ellipticals.
- Feedback from supernovae (small halos) and black holes (big halos) stops most gas becoming stars: at best about a fifth, near 10¹² suns.
- The universe made stars fastest about 10 billion years ago (z ≈ 2).

</div>
