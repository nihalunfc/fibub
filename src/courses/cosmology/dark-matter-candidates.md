---
title: "What could dark matter be?"
seoTitle: "What is dark matter made of? WIMPs, axions and more"
summary: "Dark matter must be dark, cold, stable and not atoms. The suspects, from WIMPs and axions to primordial black holes, and why neutrinos and dead stars are out."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "Why can ordinary neutrinos not be most of the dark matter?"
    choices: ["They do not exist","They are too light and moved too fast early on, which would have smeared out galaxy-sized lumps","They give off too much light"]
    ans: 1
    why: "Neutrinos are hot dark matter: racing at nearly light speed, they stream out of small lumps. Their masses are also too small; they make up at most about 1% of the dark matter."
  - q: "What did the MACHO and EROS microlensing surveys find?"
    choices: ["Far too few dark compact objects to make up the Milky Way's halo","That the halo is made of brown dwarfs","That dark matter is axions"]
    ans: 0
    why: "Watching millions of stars for years, they saw very few of the brief brightenings that dim stars and planets in the halo would cause: at most a small fraction of the halo, over a wide range of masses."
  - q: "What is the 'WIMP miracle'?"
    choices: ["WIMPs were found at the LHC","WIMPs can travel faster than light","A particle about as heavy as an atom's nucleus, interacting about as weakly as neutrinos, would be left over in just the right amount"]
    ans: 2
    why: "In the hot early universe such particles were made and destroyed in pairs. When the universe cooled, the survivors' density comes out close to the measured dark matter density, if the interaction strength is about that of the weak force."
sources:
  - "G. Bertone, D. Hooper and J. Silk (2005), Particle dark matter: evidence, candidates and constraints, Physics Reports 405, 279 https://doi.org/10.1016/j.physrep.2004.08.031"
  - "P. Tisserand et al. (EROS-2) (2007), Limits on the Macho content of the Galactic Halo from the EROS-2 Survey of the Magellanic Clouds, A&A 469, 387 https://doi.org/10.1051/0004-6361:20066017"
  - "R. D. Peccei and H. R. Quinn (1977), CP conservation in the presence of pseudoparticles, Physical Review Letters 38, 1440 https://doi.org/10.1103/PhysRevLett.38.1440"
  - "B. Carr and F. Kühnel (2020), Primordial black holes as dark matter: recent developments, Annual Review of Nuclear and Particle Science 70, 355 https://doi.org/10.1146/annurev-nucl-050520-125911"
  - "G. R. Blumenthal, S. M. Faber, J. R. Primack and M. J. Rees (1984), Formation of galaxies and large-scale structure with cold dark matter, Nature 311, 517 https://doi.org/10.1038/311517a0"
---

**Module 8 · about 16 minutes.** Read first: [8.4 Dark matter in the first light](/learn/courses/cosmology/dark-matter-cmb/). We know how much dark matter there is and where it sits. We do not know what it is. By the end you will be able to list what any candidate must do, describe the main suspects, and explain why some once-popular ones have been ruled out.

<div class="bigidea">Dark matter is something with mass that does not shine, does not collide much, is not made of atoms and has lasted 13.8 billion years. Physics offers several candidates, ranging in mass by a factor of 10⁹⁰.</div>

## 1. The job description

Like detectives with a suspect's profile, we can write down what dark matter must be from Lessons 8.1 to 8.4:

- **Dark:** it neither gives out nor absorbs light (it has no electric charge, or almost none).
- **Not atoms:** nucleosynthesis and the CMB say atoms are only about a sixth of all matter (Lesson 8.4).
- **Collisionless:** it passes through itself and through ordinary matter almost freely (the Bullet Cluster, Lesson 8.3).
- **Stable:** it has lasted at least the age of the universe.
- **Cold, or at most warm:** it moved slowly compared with light when galaxies began to form, so that small lumps could survive.

The last point needs a word. **Hot** dark matter, particles moving at nearly the speed of light, would stream out of small lumps and wipe them out, the way a strong wind scatters a sandcastle: only huge structures would form first, and break up into galaxies late. **Cold** dark matter, slow and heavy, lets small lumps form first and merge into bigger ones, bottom up. Computer simulations in the early 1980s showed that hot dark matter makes a universe that looks wrong, and cold dark matter one that looks right. That is why the standard model of cosmology is called ΛCDM: Λ for dark energy, CDM for **cold dark matter** (Lesson 12.1).

## 2. The line-up

<figure class="fig" data-fig="dark-matter-candidates"><figcaption>Dark matter candidates on one mass scale (as energy, in electronvolts: a proton is about 10⁹ eV, the Sun about 10⁶⁶ eV). Each tick is a factor of ten billion. Green: still open; amber: squeezed by experiments; red: ruled out as most of the dark matter. Tap a name to read about it.</figcaption></figure>

- **WIMPs** (weakly interacting massive particles), about 10 to 10,000 times the mass of a proton. Many extensions of particle physics, such as supersymmetry, predict particles like this. For decades they were the favourite, because of a coincidence called the WIMP miracle (below).
- **Axions**, extremely light, perhaps a millionth to a thousandth of an electronvolt. They were proposed in 1977-78 to explain why the strong nuclear force treats matter and its mirror image the same way (the "strong CP problem"). If they exist, the early universe would naturally have made a cold sea of them.
- **Sterile neutrinos**, a heavier and even shyer cousin of the known neutrinos, around a few thousand eV: warm dark matter.
- **Ultralight "fuzzy" dark matter**, around 10⁻²² eV, so light that each particle's quantum wave is thousands of light-years long.
- **Primordial black holes**, formed in the first second from dense patches, not from dead stars, so they are not counted among the atoms. Most masses are ruled out; a window around the mass of an asteroid is still open.

<div class="problem" data-problem="dark-matter-candidates-count"></div>

## 3. The WIMP miracle

In the hot early universe, WIMPs would have been made and destroyed in pairs, all the time. As the universe cooled and thinned, the pairs could no longer find each other, and the survivors "froze out". The amount left depends on how easily they destroy each other:

```math
\Omega_\chi h^{2} \approx \frac{3\times10^{-27}\ \text{cm}^3\,\text{s}^{-1}}{\langle\sigma v\rangle}
```

<div class="meaning">

<dl>
<dt>Ω<sub>χ</sub>h²</dt><dd>the density of the leftover particles (χ, "chi", is the usual symbol for a WIMP), in the units the CMB uses: dark matter has 0.12</dd>
<dt>⟨σv⟩</dt><dd>how readily two of them destroy each other: their target area σ times their speed v, averaged</dd>
<dt>Physical meaning</dt><dd>The more easily they destroy each other, the fewer are left. To leave 0.12 you need ⟨σv⟩ ≈ 3 × 10⁻²⁶ cm³/s, about what the weak nuclear force gives a particle of 100 GeV. Physics invented for other reasons seemed to hand over the dark matter for free.</dd>
</dl>

</div>

That coincidence drove forty years of searching (next lesson). Experiments have now ruled out the simplest WIMPs over much of the expected range, so physicists are looking wider, but WIMPs are not dead.

## 4. The suspects ruled out

**Ordinary neutrinos** are real particles with mass, and there are about 336 of them in every cubic centimetre of space, left over from the Big Bang ([Lesson 6.5](/learn/courses/cosmology/cosmic-neutrinos/)). They are dark matter, but **hot**, and far too light: laboratory and cosmological limits put each mass below about half an electronvolt (the KATRIN experiment, 2025) and the three together below about 0.1 eV (from cosmology). That makes them at most about 1% of the dark matter.

<div class="problem" data-problem="dark-matter-candidates-neutrino"></div>

**MACHOs** (massive compact halo objects) are the "ordinary" answer: faint stars, brown dwarfs, planets or dead stars in the halo. When one passes in front of a background star it briefly brightens it by **microlensing** ([Lesson 3.8](/learn/courses/cosmology/gravitational-lensing/)). In the 1990s and 2000s the MACHO and EROS teams watched millions of stars in the Magellanic Clouds for years. If the halo were made of such objects, they should have seen many events; they saw very few. EROS-2 found that objects from a ten-millionth of the Sun's mass up to 15 suns make up less than about 8% of the halo. And nucleosynthesis already said there are not enough atoms.

<div class="history">

<ul class="timeline">
<li><b>1977-78</b> Roberto Peccei and Helen Quinn propose a new symmetry; Steven Weinberg and Frank Wilczek show it predicts a particle, the axion.</li>
<li><b>1980</b> A Russian experiment claims the electron neutrino weighs about 30 eV, which would make neutrinos the dark matter. Later experiments did not confirm it.</li>
<li><b>1982-84</b> Peebles, and Blumenthal, Faber, Primack and Rees, set out cold dark matter; simulations by Davis, Efstathiou, Frenk and White (1983-85) favour it over hot dark matter.</li>
<li><b>1990s-2000s</b> MACHO and EROS rule out dark compact objects as most of the halo.</li>
<li><b>2016</b> LIGO's first black hole merger, of two black holes about 30 times the Sun, revives interest in primordial black holes; later limits rule them out as most of the dark matter at those masses.</li>
</ul>

</div>

<div class="myth">

**"Dark matter is just ordinary stuff that does not shine: dead stars, dust, cold gas or black holes."** Gas and dust absorb and give out light, and we see them. Dead stars and black holes from stars are made of atoms, and the atoms add up to only a sixth of the matter (Lesson 8.4). Microlensing surveys found far too few dark compact objects anyway. Only black holes made in the first second could escape the atom count, and only in a narrow mass window.

</div>

<div class="keypoints">

- Dark matter must be dark, not atoms, nearly collisionless, stable, and cold or at most warm.
- Hot dark matter (fast particles like neutrinos) erases small lumps; cold dark matter builds galaxies bottom up, as observed.
- Candidates: WIMPs (about 10 GeV to 10 TeV), axions (about μeV to meV), sterile neutrinos (keV), fuzzy dark matter (10⁻²² eV), primordial black holes.
- Ordinary neutrinos are at most about 1% of it; MACHOs (dim stars, dead stars) are ruled out as most of it.

</div>
