---
title: "Neutrinos let go"
seoTitle: "The cosmic neutrino background explained simply"
summary: "About one second after the start, neutrinos stopped colliding and flew free. They are still here: 336 in every cubic centimetre, at 1.95 K, slightly colder than the microwave background. Why they let go, why they are colder, and how we know they exist."
minutes: 14
updated: 2026-11-22
quiz:
  - q: "When did the cosmic neutrinos stop interacting with the rest of the universe?"
    choices: ["About 380,000 years after the start","When the first stars formed","About 1 second after the start, near 10 billion K (kT ≈ 1 MeV)"]
    ans: 2
    why: "Weak-force collisions slow as T⁵ while the expansion rate falls only as T², so below about 1 MeV the neutrinos stopped colliding."
  - q: "Why are the relic neutrinos (1.95 K) colder than the microwave background (2.73 K)?"
    choices: ["Electrons and positrons annihilated after the neutrinos had let go, and their energy heated only the light","Neutrinos lose energy by decaying","Neutrinos are heavier, so they move more slowly"]
    ans: 0
    why: "The annihilation energy went to the photons alone, raising their temperature by (11/4)^(1/3) ≈ 1.40 compared with the neutrinos."
  - q: "About how many relic neutrinos (all kinds, with antineutrinos) are in each cubic centimetre of space?"
    choices: ["About 1","About 336","About 336 million"]
    ans: 1
    why: "112 for each of the three kinds, which is 3/11 of the 411 photons per cubic centimetre."
sources:
  - "S. Weinberg (1962), Universal neutrino degeneracy, Physical Review 128, 1457 https://doi.org/10.1103/PhysRev.128.1457"
  - "B. Follin, L. Knox, M. Millea and Z. Pan (2015), First detection of the acoustic oscillation phase shift expected from the cosmic neutrino background, Physical Review Letters 115, 091301 https://doi.org/10.1103/PhysRevLett.115.091301"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "J. Lesgourgues and S. Pastor (2006), Massive neutrinos and cosmology, Physics Reports 429, 307 https://doi.org/10.1016/j.physrep.2006.04.001"
  - "C. L. Cowan, F. Reines, F. B. Harrison, H. W. Kruse and A. D. McGuire (1956), Detection of the free neutrino: a confirmation, Science 124, 103 https://doi.org/10.1126/science.124.3212.103"
---

**Module 6 · about 14 minutes.** Read first: [6.4 The first second](/learn/courses/cosmology/first-second/). Neutrinos barely notice ordinary matter: trillions from the Sun pass through you every second. In the first second, though, the universe was so dense that even neutrinos collided constantly. By the end you will be able to explain when they let go, why they are now colder than the cosmic microwave background, and how many are around you.

<div class="bigidea">At about one second, the universe thinned out enough for neutrinos to fly free. They have travelled untouched ever since, a second "afterglow" older than the microwave background, slightly colder and almost impossible to catch.</div>

## 1. Letting go

<div class="steps">
<div class="step"><b>Before 1 second.</b> The universe is a hot soup of photons, electrons, positrons and three kinds of neutrino (electron, muon and tau), all at the same temperature. Neutrinos feel only the weak force and gravity, but the soup is so dense that they still collide many times as the universe doubles in size.</div>
<div class="step"><b>The race.</b> The weak collision rate falls as T⁵ as the soup cools; the expansion rate falls only as T² (Lesson 6.3). Their ratio falls as T³: roughly (kT / 1 MeV)³.</div>
<div class="step"><b>About 1 second, 10<sup>10</sup> K.</b> Near kT ≈ 1 MeV the rate drops below the expansion rate. Neutrinos <b>decouple</b>: they stop colliding and fly in straight lines (along the curves of spacetime) for the rest of time.</div>
<div class="step"><b>After.</b> Each neutrino's wavelength stretches with space, just like light's, so the neutrinos keep a thermal spectrum that cools as 1/a. They are a <b>cosmic neutrino background</b> filling all space.</div>
</div>

Imagine a crowded dance floor where everyone keeps bumping into everyone. As the room grows and the crowd spreads out, a shy dancer who only rarely bumps into anyone stops meeting people altogether, long before the others do. Neutrinos are the shy dancers.

## 2. Why they are colder than the light

Just after the neutrinos let go, the temperature fell below the mass energy of the electron (0.511 MeV), and electrons and positrons annihilated into photons. The neutrinos were no longer listening, so all of that energy went to the light. The light cooled more slowly for a while, and ended up warmer than the neutrinos.

How much warmer follows from a careful count. Before annihilation, photons (2 states) plus electrons and positrons (7/8 × 4 states = 3.5) shared the heat: 5.5 units. Afterwards only photons (2) held it, and the total heat (strictly, the entropy) in a stretching volume stays fixed. So (T a)³ for the light grew by 5.5/2 = 11/4 compared with the neutrinos:

```math
T_\nu = \left(\frac{4}{11}\right)^{1/3} T_\gamma = 0.714 \times 2.7255\ \text{K} = 1.95\ \text{K}
```

<div class="meaning">

<dl>
<dt>T<sub>γ</sub></dt><dd>the photon (microwave background) temperature, 2.7255 K today</dd>
<dt>T<sub>ν</sub></dt><dd>the temperature of the relic neutrinos</dd>
<dt>4/11</dt><dd>2 (photon states) divided by 2 + 3.5 (photons plus electrons and positrons): the light received the electron-positron share of the heat</dd>
<dt>Physical meaning</dt><dd>Neutrinos are a "fossil" of the universe before electrons and positrons annihilated. Their lower temperature is a direct record of that annihilation, which happened a few seconds after the start.</dd>
</dl>

</div>

<figure class="fig" data-fig="cosmic-neutrinos"><figcaption>Temperature times size of the universe, scaled to today, through the first minutes. Anything that simply cools as 1/a draws a flat line. The neutrinos (blue) let go near 1 second and stay flat at 1.95 K. The light (orange) is lifted by electron-positron annihilation, mostly between about 2 and 100 seconds, to today's 2.73 K.</figcaption></figure>

<div class="problem" data-problem="cosmic-neutrinos-temperature"></div>

## 3. How many?

Today each cubic centimetre holds 411 photons from the microwave background. For neutrinos the count per kind (neutrinos plus antineutrinos) is 3/4 × 4/11 of that: 3/4 because neutrinos are fermions, which by the Pauli rule fill their states less densely than photons do, and 4/11 because of their lower temperature (cubed). That makes 112 per kind and **336 per cubic centimetre** for all three kinds: <span class="count" data-to="336"></span> in every sugar cube of space.

<div class="problem" data-problem="cosmic-neutrinos-count"></div>

Neutrinos have small masses (oscillation experiments prove it). The relic neutrinos have typical energies of only about 0.0005 eV today, so at least two of the three kinds are now slow-moving, and together they are a tiny part of the dark matter: well under 1% of the critical density. The Planck satellite's measurements of the microwave background, with galaxy maps, limit the sum of the three neutrino masses to below about 0.12 eV.

## 4. How do we know they are there?

Catching one is beyond any current detector: their energy is a billion times less than that of the Sun's neutrinos. The PTOLEMY project aims to catch them on tritium, an idea from Steven Weinberg in 1962. But their effects are already measured:

- **Helium.** More kinds of relic neutrino would speed up the early expansion and make more helium (Lesson 6.6). The measured helium fits three.
- **The microwave background.** The neutrinos' gravity tugs on the sound waves of the young universe (Module 7), shifting the acoustic peaks slightly. In 2015 Brent Follin and colleagues found that shift in the Planck data. Cosmologists express the result as N<sub>eff</sub>, the effective number of neutrino kinds: Planck finds 2.99 ± 0.17, and the Standard Model predicts 3.044 (a touch above 3 because the neutrinos had not quite let go when the annihilation began).

<div class="history">

**The ghost particle.** Wolfgang Pauli proposed the neutrino in 1930 to rescue energy conservation in radioactive decay, and apologised for suggesting a particle that could never be detected. Clyde Cowan and Frederick Reines caught neutrinos from a nuclear reactor in 1956. The cosmic background of neutrinos is a firm prediction of the hot Big Bang, and its effects on helium and the microwave background have been seen; seeing the neutrinos themselves remains a challenge for the future.

</div>

<div class="myth">

**"The cosmic neutrinos are the same as the neutrinos from the Sun."** Solar neutrinos are made in nuclear fusion today, with energies of about a million electronvolts, and about 60 billion of them cross each square centimetre of you every second. The relic neutrinos were set free in the first second and now have energies a billion times smaller. They are far more numerous in space, but far gentler.

</div>

<div class="keypoints">

- Weak collisions slow as T⁵, expansion as T²: neutrinos decoupled near kT ≈ 1 MeV, 10<sup>10</sup> K, about 1 second after the start.
- Electron-positron annihilation then heated only the light: T<sub>ν</sub> = (4/11)<sup>1/3</sup> T<sub>γ</sub> ≈ 1.95 K today.
- 112 per cubic centimetre for each of three kinds, 336 in all (3/11 of the photons per kind).
- Not yet caught directly, but seen through helium and the microwave background: N<sub>eff</sub> = 2.99 ± 0.17 (Planck) against 3.044 expected.

</div>
