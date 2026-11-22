---
title: "Hotter in the past: temperature and time"
seoTitle: "How hot was the early universe? Temperature and time"
summary: "The universe's temperature goes as one over its size, so the past was hotter. In the radiation era, time and temperature are locked together: about 1 second at 10 billion K, 3 minutes at 1 billion K. A thermometer and clock for cosmic history."
minutes: 15
updated: 2026-11-22
quiz:
  - q: "When the universe was half its present size, the cosmic background was:"
    choices: ["Half as hot, about 1.4 K","Eight times as hot","Twice as hot, about 5.5 K"]
    ans: 2
    why: "T goes as 1/a: half the size means double the temperature, 2 × 2.7255 K."
  - q: "Roughly how old was the universe when it was at 10 billion K (kT ≈ 1 MeV)?"
    choices: ["About 1 second","About 1 year","About 380,000 years"]
    ans: 0
    why: "In the radiation era t ≈ (2.42 s / √g*) × (1 MeV / kT)². With g* ≈ 10.75, that is 0.74 s: about a second."
  - q: "Why does a hotter universe mean different things exist?"
    choices: ["Heat makes things expand","When the typical energy kT exceeds a binding energy or a particle's mass energy, those bonds break or those particles are made freely","Particles only exist at one temperature"]
    ans: 1
    why: "Atoms are split above a few thousand kelvin (helped by the huge number of photons), nuclei above about a billion kelvin, and protons melt into quarks above about 2 × 10¹² K."
sources:
  - "R. C. Tolman (1934), Relativity, Thermodynamics and Cosmology, Oxford: Clarendon Press"
  - "S. Weinberg (1977), The First Three Minutes: A Modern View of the Origin of the Universe, Basic Books"
  - "E. W. Kolb and M. S. Turner (1990), The Early Universe, Addison-Wesley"
  - "D. J. Fixsen (2009), The temperature of the cosmic microwave background, ApJ 707, 916 https://doi.org/10.1088/0004-637X/707/2/916"
  - "Particle Data Group (2024), Review of Particle Physics: Big-Bang cosmology https://pdg.lbl.gov/2024/reviews/rpp2024-rev-bbang-cosmology.pdf"
---

**Module 6 · about 15 minutes.** Read first: [5.1 The scale factor](/learn/courses/cosmology/scale-factor/) and [5.5 How matter, radiation and dark energy thin out](/learn/courses/cosmology/matter-radiation-dark-energy/). Every lesson in this module happens at a temperature. Here we build the thermometer and the clock that go with it. By the end you will be able to turn a redshift into a temperature, a temperature into an energy, and an energy into a time after the start.

<div class="bigidea">The universe is a cooling oven. Its temperature goes as one over its size, and early on its age is fixed by its temperature alone: about one second at ten billion degrees, three minutes at one billion.</div>

## 1. The thermometer: T ∝ 1/a

The light left over from the hot beginning has a blackbody spectrum ([Astronomy: blackbody radiation](/learn/courses/astronomy/blackbody-radiation/)). As space stretches, every wavelength stretches by the same factor ([Lesson 4.5](/learn/courses/cosmology/cosmological-redshift/)), and a stretched blackbody is still a perfect blackbody, just cooler. Richard Tolman showed this in the 1930s. So:

```math
T = \frac{T_0}{a} = T_0\,(1+z), \qquad T_0 = 2.7255\ \text{K}
```

<div class="meaning">

<dl>
<dt>T<sub>0</sub></dt><dd>the temperature of the cosmic microwave background today, 2.7255 K (measured by the COBE satellite)</dd>
<dt>a, z</dt><dd>the size of the universe compared with today, and the redshift, 1 + z = 1/a</dd>
<dt>Physical meaning</dt><dd>Halve the size of the universe and its light is twice as hot. Look back to z = 1,000 and space glowed at almost 3,000 K, like a cool star.</dd>
</dl>

</div>

<div class="problem" data-problem="temperature-and-time-redshift"></div>

## 2. Temperature is energy

Physicists measure the heat of the early universe as the typical energy of one particle, **kT**, in electronvolts (eV). One eV is the energy an electron gains crossing one volt; kT = 1 eV at about 11,600 K.

```math
kT = 8.617\times10^{-5}\ \text{eV/K} \times T \qquad (1\ \text{MeV} \leftrightarrow 1.16\times10^{10}\ \text{K})
```

This tells you what can survive. When kT approaches the energy that holds something together, collisions start to break it. When kT exceeds a particle's mass energy mc² ([Lesson 3.3](/learn/courses/cosmology/e-equals-mc2/)), collisions make that particle and its antiparticle freely:

<ul class="timeline">
<li><b>~1 eV</b> (thousands of K): atoms break apart. Hydrogen needs 13.6 eV, yet atoms survive only below about 3,000 K (0.26 eV), because there are 1.6 billion photons for every atom (Lesson 6.9).</li>
<li><b>~0.1 MeV</b> (about 10<sup>9</sup> K): atomic nuclei break apart. Deuterium needs 2.2 MeV, and the same photon crowd pushes the limit down (Lesson 6.6).</li>
<li><b>0.5 MeV</b>: electron-positron pairs are made freely (an electron's mc² is 0.511 MeV).</li>
<li><b>~150 MeV</b> (about 2 × 10<sup>12</sup> K): protons and neutrons melt into quarks and gluons (Lesson 6.4).</li>
</ul>

## 3. The clock: time from temperature

Early on, radiation outweighed matter ([Lesson 5.5](/learn/courses/cosmology/matter-radiation-dark-energy/)). Radiation's energy density goes as T⁴, and the Friedmann equation ([Lesson 5.2](/learn/courses/cosmology/friedmann-equation/)) says H² is proportional to that density, so H ∝ T². In a radiation universe a ∝ t<sup>1/2</sup>, which gives H = 1/(2t). Put it together and time and temperature are locked:

```math
t \approx \frac{2.42\ \text{s}}{\sqrt{g_*}}\left(\frac{1\ \text{MeV}}{kT}\right)^{2}
```

<div class="meaning">

<dl>
<dt>t</dt><dd>time since the start (counting from the time the formula would give zero; the true first instant does not matter for anything after it)</dd>
<dt>g<sub>*</sub></dt><dd>"how many kinds of particle are in the soup": 2 for photons, 7/8 × their states for each kind of fermion. About 10.75 from 100 MeV down to 1 MeV (photons, electrons and positrons, three kinds of neutrino), about 3.36 after electrons and positrons are gone</dd>
<dt>2.42 s</dt><dd>a number made of G, ħ and c; it would be the age at kT = 1 MeV if g<sub>*</sub> were exactly 1</dd>
<dt>Physical meaning</dt><dd>Twice as hot means four times younger. At 1 MeV (10 billion K) the universe was about 0.74 s old; a handy rule of thumb is <b>t ≈ 1 s × (10<sup>10</sup> K / T)²</b>, good to a factor of about 2 in the radiation era.</dd>
</dl>

</div>

So at 10<sup>9</sup> K, ten times cooler than 10<sup>10</sup> K, the universe was about a hundred times older: a couple of minutes. That is why the elements were made in "the first three minutes", the title of Steven Weinberg's 1977 book.

<div class="problem" data-problem="temperature-and-time-clock"></div>

## 4. A dial through cosmic history

<figure class="fig" data-fig="temperature-and-time"><figcaption>Slide the temperature down from 10<sup>13</sup> K to 2,970 K. The coloured strip shows the stage of history (numbered as in this module); the curve is the clock, from a calculation that follows g<sub>*</sub> as particles disappear, and joins the matter era after about 51,000 years. Read the time, the energy kT and what exists at each moment.</figcaption></figure>

Notice how the curve bends. It is almost a straight line of slope −2 (t ∝ 1/T²) while radiation rules, and steeper (t ∝ T<sup>−3/2</sup>) after matter takes over near 9,300 K (Lesson 6.8). On the dial, cooling from 10<sup>13</sup> K to 10<sup>10</sup> K takes less than a second; cooling from 10<sup>10</sup> K to 3,000 K takes the next 380,000 years.

<div class="history">

**How far back can we trust the clock?** The physics of everything from about 10<sup>12</sup> K down is tested in laboratories: particle colliders reach those energies, and nuclear reactors and accelerators measure the reactions of the first minutes. The predictions of the first minutes (helium, deuterium) have been checked against the sky since the 1960s. Earlier than about a millionth of a second we rely on theories tested less directly (Module 11).

</div>

<div class="myth">

**"The young universe was a hot fireball sitting in cold, empty space."** There was no outside. Every place in the universe was hot at once, including the place that is now here, and every place cooled together as space stretched ([Lesson 4.4](/learn/courses/cosmology/not-an-explosion/)). The cosmic background comes from all directions because the heat was everywhere.

</div>

<div class="keypoints">

- T = T<sub>0</sub>(1 + z) = 2.7255 K / a: a stretched blackbody stays a blackbody, just cooler.
- kT measures the typical particle energy: 1 eV ↔ 11,600 K; 1 MeV ↔ 1.16 × 10<sup>10</sup> K. When kT passes a binding energy or a mass energy, the contents of the universe change.
- Radiation era clock: t ≈ (2.42 s / √g<sub>*</sub>)(1 MeV/kT)², with g<sub>*</sub> ≈ 10.75 near 1 MeV: about 1 s at 10<sup>10</sup> K, a few minutes at 10<sup>9</sup> K.
- Matter takes over near 9,300 K (51,000 years); atoms form near 3,000 K (about 380,000 years).

</div>
