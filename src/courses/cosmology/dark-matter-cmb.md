---
title: "Dark matter in the first light"
seoTitle: "How the CMB proves dark matter: 5 times more than atoms"
summary: "The CMB weighs dark matter and atoms separately: about 5.4 times more dark matter. Without it, the early universe's tiny lumps could not have become galaxies."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "Why could lumps of ordinary matter not grow before recombination?"
    choices: ["The atoms' nuclei and electrons were tied to light, whose pressure pushed back against clumping", "Gravity did not work yet", "There were no atoms at all, only dark matter"]
    ans: 0
    why: "Until about 380,000 years, light kept bouncing off the free electrons. The light and matter moved as one fluid with a huge pressure, so lumps bounced as sound waves instead of growing."
  - q: "According to Planck, how much more dark matter than ordinary matter is there?"
    choices: ["About 5.4 times", "About the same amount", "About 100 times"]
    ans: 0
    why: "Ω_c h² ≈ 0.120 and Ω_b h² ≈ 0.0224, and 0.120 ÷ 0.0224 ≈ 5.4. Dark matter is about 84% of all matter."
  - q: "Two independent methods give the amount of ordinary matter. Which ones?"
    choices: ["The CMB peaks and the amount of deuterium made in Big Bang nucleosynthesis", "Counting stars and counting planets", "Rotation curves and the Bullet Cluster"]
    ans: 0
    why: "Both say atoms are only about 5% of the critical density, far less than the total matter (31%). So dark matter cannot be made of atoms."
sources:
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "W. Hu and S. Dodelson (2002), Cosmic microwave background anisotropies, Annual Review of Astronomy and Astrophysics 40, 171 https://doi.org/10.1146/annurev.astro.40.060401.093926"
  - "R. J. Cooke, M. Pettini and C. C. Steidel (2018), One percent determination of the primordial deuterium abundance, ApJ 855, 102 https://doi.org/10.3847/1538-4357/aaab53"
  - "P. J. E. Peebles (1982), Large-scale background temperature and mass fluctuations due to scale-invariant primeval perturbations, ApJ 263, L1 https://doi.org/10.1086/183911"
---

**Module 8 · about 15 minutes.** Read first: [7.5 Sound waves in the early universe](/learn/courses/cosmology/acoustic-peaks/). Galaxies and clusters show dark matter today. The cosmic microwave background shows it 13.8 billion years ago, before any galaxy existed, and weighs it more precisely than anything else. By the end you will be able to explain why the universe needed dark matter to make galaxies, and how the CMB tells dark matter and atoms apart.

<div class="bigidea">Before the first light was set free, atoms could not clump: light kept pushing them apart. Dark matter ignores light, so it had been gathering into lumps all along, ready for the atoms to fall into.</div>

## 1. Atoms were stuck to light

Until [recombination](/learn/courses/cosmology/recombination/), about 380,000 years after the start, the universe was a hot glowing fog of nuclei, electrons and light. Light bounced off the free electrons so often that light and ordinary matter moved together as one fluid, with the enormous pressure of the light. Squeeze a region and the pressure pushes back: lumps did not grow, they **bounced**, as sound waves. Those sound waves are the peaks in the CMB ([Lesson 7.5](/learn/courses/cosmology/acoustic-peaks/)).

Dark matter feels gravity but not light. Since [matter took over from light](/learn/courses/cosmology/matter-radiation-equality/), about 50,000 years after the start, its lumps had been growing steadily, with nothing to push back. Picture a trampoline with heavy bowling balls and light marbles on it, while someone keeps shaking it hard. The marbles (atoms) are kept bouncing and cannot settle; the bowling balls (dark matter) sink in and make dips that get deeper and deeper. When the shaking stops (recombination, when the light let go), the marbles roll straight into the dips that are already there.

<figure class="fig" data-fig="dark-matter-cmb"><figcaption>How lumpy one small region gets as the universe grows (a simplified model). Dark matter's lump grows from early on. Atoms only oscillate, at about 1 part in 10,000, until recombination; then they fall in and catch up. Switch to "Atoms only": the lump starts growing only at recombination and never reaches 1, the point where it would collapse into a galaxy.</figcaption></figure>

## 2. Not enough time without it

After recombination a lump grows, at best, in step with the size of the universe *a*. In a universe of matter alone, the density contrast δ (how much denser the lump is than average) grows as

```math
\delta \propto a = \frac{1}{1+z}
```

<div class="meaning">

<dl>
<dt>δ</dt><dd>the density contrast: (density of the lump − average density) ÷ average density. A lump collapses into a galaxy or cluster once δ grows to about 1</dd>
<dt>a, z</dt><dd>the scale factor (today a = 1) and redshift. Recombination is at z ≈ 1100, so a grew about 1,100 times since then</dd>
<dt>Physical meaning</dt><dd>Gravity makes the rich get richer: a lump pulls in more matter in proportion to how much extra it already has. But it is slow, only as fast as the universe grows, and dark energy slows it further late on.</dd>
</dl>

</div>

The CMB shows that the atoms were smooth to about 1 part in 10,000 to 100,000 at recombination. Grow that by 1,100 and you reach only about 0.01 to 0.1 today. With atoms alone there would be no galaxies, no stars and no us. Dark matter's lumps were already some tens of times bigger at recombination; that head start is what made galaxies possible. Jim Peebles made this argument in 1982, and it is one of the strongest reasons cosmologists think dark matter is real.

<div class="problem" data-problem="dark-matter-cmb-growth"></div>

## 3. The CMB weighs dark matter and atoms separately

The sound waves happened inside the gravitational wells of dark matter, and atoms and dark matter affect the pattern of peaks in different ways:

- **Atoms** add weight to the light-and-matter fluid, so it sinks deeper into each well before bouncing back. That makes the compressions stronger than the rarefactions: the odd-numbered peaks (1st, 3rd) are boosted against the even ones (2nd). The contrast measures the atoms.
- **Dark matter** does not oscillate. It sets how deep and how steady the wells are. The heights of the peaks, especially the third compared with the first two, measure how much there is. The third peak came out high, as tall as dark matter predicts; with atoms alone it would be much lower.

Fitting the whole pattern, Planck found (in units where h = H<sub>0</sub> / 100 km/s/Mpc):

```math
\Omega_c h^2 = 0.120 \pm 0.001, \qquad \Omega_b h^2 = 0.0224 \pm 0.0002, \qquad \frac{\Omega_c}{\Omega_b} \approx 5.4
```

<div class="meaning">

<dl>
<dt>Ω<sub>c</sub>, Ω<sub>b</sub></dt><dd>the densities of cold dark matter and of baryons (atoms), as fractions of the critical density (<a href="/learn/courses/cosmology/critical-density/">Lesson 5.3</a>)</dd>
<dt>h²</dt><dd>the CMB measures physical densities, which come with h², so the peak pattern pins Ω h² directly. With h = 0.674: Ω<sub>c</sub> ≈ 0.26 and Ω<sub>b</sub> ≈ 0.049</dd>
<dt>Physical meaning</dt><dd>For every kilogram of atoms there are about 5.4 kilograms of dark matter: dark matter is about 84% of all matter, 26% of everything.</dd>
</dl>

</div>

<div class="problem" data-problem="dark-matter-cmb-ratio"></div>

## 4. Two clocks agree: dark matter is not atoms

A completely separate measurement gives the amount of atoms: [Big Bang nucleosynthesis](/learn/courses/cosmology/big-bang-nucleosynthesis/). How much deuterium the first three minutes made depends on the density of atoms, and measurements of deuterium in distant gas clouds give Ω<sub>b</sub>h² ≈ 0.022, the same as the CMB. Two different physical processes, 380,000 years apart, agree that atoms are only about 5% of the universe. Yet clusters, lensing and the CMB all say matter is about 31%. Whatever dark matter is, it is **not made of atoms**: not faint stars, not gas, not black holes made from dead stars.

<div class="history">

<ul class="timeline">
<li><b>1982</b> Peebles shows that cold dark matter would let galaxies grow from the small ripples that the CMB must have, where atoms alone could not.</li>
<li><b>1992</b> COBE finds the ripples at about 1 part in 100,000 (Lesson 7.4): too small to make galaxies without dark matter.</li>
<li><b>2003</b> WMAP measures the first peaks and weighs dark matter and atoms separately.</li>
<li><b>2013-18</b> Planck pins Ω<sub>c</sub>h² to within 1%.</li>
</ul>

</div>

<div class="myth">

**"Dark matter was invented for galaxies, and the CMB just assumes it."** The CMB is a separate test, at a time before any galaxy existed, using different physics (sound waves in a hot gas, not orbits). It could have shown no dark matter. It shows 5.4 times more than atoms, the same amount that clusters and lensing need.

</div>

<div class="keypoints">

- Before recombination, atoms were tied to light and could only oscillate; dark matter's lumps grew from about 50,000 years on.
- Lumps grow only about as fast as the universe expands, so atoms alone, starting at 10⁻⁵ to 10⁻⁴, could not make galaxies by today.
- The CMB peaks weigh atoms and dark matter separately: Ω<sub>c</sub>h² ≈ 0.120, Ω<sub>b</sub>h² ≈ 0.0224, about 5.4 times more dark matter.
- Big Bang nucleosynthesis agrees on the atoms, so dark matter cannot be ordinary matter.

</div>
