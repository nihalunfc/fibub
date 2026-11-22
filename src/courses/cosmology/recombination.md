---
title: "Recombination: the universe becomes transparent"
seoTitle: "Recombination: when the universe became transparent"
summary: "For 380,000 years the universe was a glowing fog of free electrons. At about 3,000 K electrons joined nuclei to make atoms, the fog cleared and light flew free: the cosmic microwave background. Why it waited until 0.3 eV, not 13.6 eV."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "Hydrogen needs 13.6 eV to be ionised, yet atoms only survived once kT fell to about 0.3 eV. Why?"
    choices: ["There were about 1.6 billion photons per atom, so even the rare photons in the blackbody's high-energy tail outnumbered the atoms","Atoms were destroyed by neutrinos","Gravity pulled the electrons away"]
    ans: 0
    why: "The same crowd effect as the deuterium bottleneck: the energetic photons had to become rarer than atoms, which needed a temperature far below 13.6 eV."
  - q: "Last scattering happened at about:"
    choices: ["z ≈ 3,400, about 51,000 years after the start","z ≈ 10, about 500 million years after the start","z ≈ 1,090, about 3,000 K, about 380,000 years after the start"]
    ans: 2
    why: "That is where the chance of a photon reaching us without being scattered again rises through 1 in e (37%), and where most CMB photons scattered for the last time. z ≈ 3,400 is matter-radiation equality; z ≈ 10 is the era of the first galaxies."
  - q: "The CMB photons were mostly:"
    choices: ["Light given out by the new atoms as they formed","Light from the first stars","The light that was already there, set free when it stopped bouncing off electrons"]
    ans: 2
    why: "There are 1.6 billion photons per atom: far more than recombining atoms could make. Recombination simply cleared the fog the existing light was trapped in."
sources:
  - "M. N. Saha (1920), Ionization in the solar chromosphere, Philosophical Magazine 40, 472 https://doi.org/10.1080/14786441008636148"
  - "P. J. E. Peebles (1968), Recombination of the primeval plasma, ApJ 153, 1 https://doi.org/10.1086/149628"
  - "Ya. B. Zel'dovich, V. G. Kurt and R. A. Sunyaev (1968), Recombination of hydrogen in the hot model of the universe, Zh. Eksp. Teor. Fiz. 55, 278 (Soviet Physics JETP 28, 146, 1969)"
  - "S. Seager, D. D. Sasselov and D. Scott (2000), How exactly did the universe become neutral?, ApJS 128, 407 https://doi.org/10.1086/313388"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "B. Ryden (2017), Introduction to Cosmology, 2nd edition, chapter 8, Cambridge University Press https://doi.org/10.1017/9781316651087"
---

**Module 6 · about 16 minutes.** Read first: [6.3 Hotter in the past](/learn/courses/cosmology/temperature-and-time/) and [6.8 When matter took over from light](/learn/courses/cosmology/matter-radiation-equality/). After the first minutes the universe was a hot plasma of nuclei, electrons and light. Here it cools enough for atoms to form, and the light we now see as the cosmic microwave background sets off. By the end you will be able to explain why the universe was opaque, why atoms formed at 3,000 K rather than at the 150,000 K you might expect, and when the light last scattered.

<div class="bigidea">Free electrons make the young universe a glowing fog that light cannot cross. About 380,000 years after the start, at 3,000 K, the electrons settle into atoms, the fog clears, and the light flies free. We still see it today, stretched into microwaves.</div>

## 1. A glowing fog

Light bounces off free electrons (this is **Thomson scattering**). In the young universe every hydrogen and helium nucleus had lost its electrons, so a photon could travel only a short way before being knocked in a new direction. The universe was **opaque**, like the inside of a cloud or the Sun: bright everywhere, but you cannot see through it.

<div class="problem" data-problem="recombination-mfp"></div>

A few thousand light-years between bounces sounds far, but light had by then been travelling for hundreds of thousands of years, zig-zagging the whole time. Once electrons are captured into atoms, there is almost nothing left to bounce off: neutral hydrogen barely affects light of these wavelengths.

## 2. Why not at 13.6 eV?

Hydrogen needs 13.6 eV to lose its electron. That is kT at about 158,000 K, so you might expect atoms from about then. They had to wait until about 3,000 K, fifty times cooler. The reason is the same crowd as in the deuterium bottleneck (Lesson 6.6): there are about **1.6 billion photons for every atom**. A blackbody always has a tail of photons far more energetic than kT, and with so many photons, even a tiny fraction above 13.6 eV is enough to break every atom that forms.

<div class="problem" data-problem="recombination-photons"></div>

The balance between atoms forming and breaking is given by the **Saha equation**, worked out by the Indian astrophysicist Meghnad Saha in 1920 to read the spectra of stars. Written with η, the number of atoms per photon, it says:

```math
\frac{1 - x}{x^{2}} = 3.84\,\eta\left(\frac{kT}{m_e c^{2}}\right)^{3/2} e^{\,13.6\ \text{eV}/kT}
```

<div class="meaning">

<dl>
<dt>x</dt><dd>the fraction of hydrogen still ionised (free electrons per hydrogen nucleus)</dd>
<dt>η</dt><dd>atoms per photon, 6.1 × 10<sup>−10</sup> (Lesson 6.6): the tiny number that holds recombination back</dd>
<dt>m<sub>e</sub>c²</dt><dd>the electron's mass energy, 511,000 eV</dd>
<dt>e<sup>13.6 eV/kT</sup></dt><dd>the Boltzmann factor: how strongly cooling favours bound atoms</dd>
<dt>Physical meaning</dt><dd>The right side is tiny (η and (kT/m<sub>e</sub>c²)<sup>3/2</sup> are both small) unless the exponential is huge. Half the atoms form (x = 1/2) only when kT ≈ 0.32 eV, about 3,700 K, z ≈ 1,380.</dd>
</dl>

</div>

The real universe is a little slower than Saha's balance. An electron dropping straight into the lowest level gives out a photon of 13.6 eV or more, which promptly ionises another atom; one dropping to the lowest level from the next one up gives out a Lyman-alpha photon that is quickly absorbed again by another atom. Atoms mostly get to their ground state the slow way, by a rare two-photon decay or by the stretching of space moving a Lyman-alpha photon out of reach. Jim Peebles, and independently Yakov Zel'dovich, Vladimir Kurt and Rashid Sunyaev, worked this out in 1968.

## 3. Last scattering

<figure class="fig" data-fig="recombination"><figcaption>Slide time on (redshift down). Bottom: the share of hydrogen still ionised. Dashed: Saha's balance; solid: the full calculation (Peebles's three-level atom), which lags behind. The shaded hump shows where the CMB photons last scattered, peaking at z ≈ 1,090. Top: a patch of the young universe; the fog's thickness is the chance a photon is scattered again before it could reach us, and the red paths are photons, zig-zagging, then flying free.</figcaption></figure>

<div class="steps">
<div class="step"><b>Helium first.</b> Helium holds its electrons more tightly, so it becomes neutral first: helium nuclei catch one electron around z ≈ 6,000 and the second around z ≈ 2,000. The fog barely thins, because hydrogen supplies most of the electrons.</div>
<div class="step"><b>Hydrogen begins (z ≈ 1,500, about 4,000 K).</b> Atoms start to survive. The full calculation reaches half ionised near z ≈ 1,270, later than Saha's 1,380.</div>
<div class="step"><b>Last scattering (z ≈ 1,090, T ≈ 2,970 K, about 380,000 years).</b> About one electron in eight is still free, and that is no longer enough to stop the light. A photon from here has about a 37% chance (1 in e) of reaching us without another bounce, and the odds improve fast from then on. The CMB photons last scattered in a layer spread roughly from z = 1,000 to 1,200, peaking at 1,090.</div>
<div class="step"><b>Free light.</b> By z ≈ 800 under one electron in a hundred is free, and the light streams freely. A few electrons in ten thousand never find a partner, because the universe grew too thin for them to meet. The light carries on, stretching 1,090 times, into the microwave sky of Module 7.</div>
</div>

Planck measures last scattering at z = 1,089.9, or 377,700 years after the start, with the light at about 2,970 K, about as hot as the surface of a cool red dwarf star. (The rounded model in these figures gives 372,000 years.) Since then its wavelength has stretched about 1,090 times, from the near infrared to microwaves, and its temperature has fallen to 2.7255 K.

The place where this happened, seen from here, is a shell all around us at the edge of what light can show: the **surface of last scattering**. Whatever direction you look, you see the fog at the moment it cleared. That glowing wall, its discovery in 1965 and what its tiny ripples tell us, is Module 7, starting with [Lesson 7.1](/learn/courses/cosmology/cmb-discovery/).

<div class="history">

**A misleading name.** "Recombination" suggests electrons and nuclei joining again, but they had never been joined: before this, the universe had always been too hot for atoms. The name was borrowed from laboratory plasma physics. The Saha equation came from Meghnad Saha, working in Calcutta and London, who in 1920 used it to explain why stars of different temperatures show different spectral lines ([Astronomy: spectral lines](/learn/courses/astronomy/spectral-lines/)). Half a century later the same equation set the moment the cosmic microwave background was released.

</div>

<div class="myth">

**"The cosmic microwave background is the light given out by the first atoms as they formed."** Recombining atoms did give out some photons, but they were a tiny addition: there are 1.6 billion photons for every atom. The CMB is the light that had filled the universe since the first second, set free when the fog of electrons cleared. It is the leftover heat of the hot beginning.

</div>

<div class="keypoints">

- Free electrons scatter light (Thomson scattering): the young universe was an opaque, glowing fog.
- Hydrogen's 13.6 eV would suggest atoms at about 158,000 K, but with 1.6 billion photons per atom they survive only below about 0.3 eV. Saha's equation: half the atoms at about 3,700 K (z ≈ 1,380); the full calculation is slower.
- Last scattering: z ≈ 1,090, T ≈ 2,970 K, about 380,000 years after the start (Planck: 377,700).
- Helium went neutral first; a few electrons in 10,000 stay free afterwards.
- The released light, stretched 1,090 times, is the cosmic microwave background (Module 7).

</div>
