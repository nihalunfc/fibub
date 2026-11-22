---
title: "The first second: from quarks to protons"
seoTitle: "What happened in the first second after the Big Bang?"
summary: "In its first second the universe went from a soup of free quarks to protons and neutrons, lost almost all its antimatter, and fixed the balance of neutrons to protons at about 1 to 6. That one number decides how much helium exists."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "Below about 2 × 10¹² K (about 10 microseconds after the start), what happened to the quarks?"
    choices: ["They were locked, three at a time, into protons and neutrons","They all decayed into electrons","They turned into atoms"]
    ans: 0
    why: "Above about 150 MeV quarks and gluons roam free (a quark-gluon plasma); as it cools, the strong force traps them inside protons, neutrons and short-lived mesons."
  - q: "Why are there neutrons at all, when free neutrons decay in about 15 minutes?"
    choices: ["Weak reactions kept turning protons into neutrons and back until about 1 second; then the swaps stopped and about 1 neutron per 6 protons was left","Neutrons were made in stars","Neutrons never decay in space"]
    ans: 0
    why: "While the swaps were fast, n/p = e^(−Q/kT). When they became slower than the expansion, the ratio froze; decay then slowly reduced it until the neutrons were locked into nuclei."
  - q: "How big was the surplus of matter over antimatter?"
    choices: ["About one extra particle for every billion or so pairs","Half and half, then matter won","There was never any antimatter"]
    ans: 0
    why: "Today there are about 1.6 billion photons per proton or neutron: the leftovers of a tiny surplus. Why there was a surplus is unsolved (Lesson 11.5)."
sources:
  - "C. Hayashi (1950), Proton-neutron concentration ratio in the expanding universe at the stages preceding the formation of the elements, Progress of Theoretical Physics 5, 224 https://doi.org/10.1143/ptp/5.2.224"
  - "R. A. Alpher, J. W. Follin and R. C. Herman (1953), Physical conditions in the initial stages of the expanding universe, Physical Review 92, 1347 https://doi.org/10.1103/PhysRev.92.1347"
  - "J. Bernstein, L. S. Brown and G. Feinberg (1989), Cosmological helium production simplified, Reviews of Modern Physics 61, 25 https://doi.org/10.1103/RevModPhys.61.25"
  - "HotQCD Collaboration, A. Bazavov et al. (2019), Chiral crossover in QCD at zero and non-zero chemical potentials, Physics Letters B 795, 15 https://doi.org/10.1016/j.physletb.2019.05.013"
  - "S. Navas et al. (Particle Data Group) (2024), Review of Particle Physics (neutron mean life 878.4 ± 0.5 s), Physical Review D 110, 030001 https://doi.org/10.1103/PhysRevD.110.030001"
  - "E. W. Kolb and M. S. Turner (1990), The Early Universe, Addison-Wesley"
---

**Module 6 · about 16 minutes.** Read first: [6.3 Hotter in the past: temperature and time](/learn/courses/cosmology/temperature-and-time/). The first second sounds impossibly short, but the universe changed more in it than in the billions of years since. Here we follow it from a soup of quarks to the neutrons and protons that would become every nucleus. By the end you will be able to explain why matter survived, and work out the neutron-to-proton balance from the temperature.

<div class="bigidea">In its first second the universe turned quarks into protons and neutrons, annihilated almost all its antimatter, and then, as it cooled through about 10 billion degrees, froze the balance of neutrons to protons at about 1 to 6. That number decides how much helium the universe will ever have.</div>

## 1. Five scenes

<div class="steps" data-fig="first-second">
<div class="step"><b>Quark soup.</b> Earlier than about 10 microseconds, above about 2 × 10<sup>12</sup> K (kT ≈ 150 MeV), protons and neutrons cannot exist: they melt into a <b>quark-gluon plasma</b>, quarks and the gluons that carry the strong force, roaming free among electrons, muons, neutrinos and light.</div>
<div class="step"><b>Quarks lock up.</b> As the soup cools through about 150 MeV, the strong force traps the quarks in threes, making protons and neutrons, and in quark-antiquark pairs (short-lived mesons such as pions). Calculations of the strong force on supercomputers show this is a smooth change, like fog condensing, not a sudden one.</div>
<div class="step"><b>Matter meets antimatter.</b> Every kind of particle came with its antiparticle. As the temperature falls below a particle's mass energy, pairs are no longer made, and the ones that exist annihilate into light. Protons and antiprotons had mostly gone by about 10<sup>11</sup> K. For every billion antiparticles there had been about a billion and one particles; the one extra in each billion is all the matter we have.</div>
<div class="step"><b>Neutrons and protons swap.</b> Collisions with electrons, positrons and neutrinos keep turning neutrons into protons and back: n + ν ⇄ p + e⁻ and n + e⁺ ⇄ p + ν̄. While these are fast, the balance follows the temperature.</div>
<div class="step"><b>About one second: the swaps stop.</b> The swaps run on the weak force, and they slow down far faster than the universe cools. Near kT ≈ 0.8 MeV (about 10<sup>10</sup> K) they can no longer keep up, and the ratio is left at about 1 neutron for every 6 protons.</div>
</div>

## 2. Made from light, unmade into light

A photon pair can turn into a particle and its antiparticle when the energy available is at least twice the particle's mass energy, and the reverse happens all the time. In a hot soup with kT well above mc², pairs are made and destroyed in balance. Once kT falls well below mc², creation dies away (the rare high-energy photons in the blackbody's tail keep making a few pairs for a while, until kT is about a tenth of mc²), and annihilation wins.

<div class="problem" data-problem="first-second-threshold"></div>

If matter and antimatter had been exactly equal, they would have annihilated almost completely and left a universe of light with no atoms in it. Instead about one particle per billion pairs survived. We can count it today: there are about 1.6 billion photons in the cosmic background for every proton or neutron (Lesson 6.6). Why the surplus existed is one of the great open questions ([Lesson 11.5](/learn/courses/cosmology/matter-antimatter/)).

## 3. The neutron-to-proton balance

A neutron is slightly heavier than a proton: its mass energy is greater by Q = 1.293 MeV. In a hot soup, heavier things are rarer by the Boltzmann factor e<sup>−energy/kT</sup> (the same rule that makes the air thinner high up), so while the swaps are fast:

```math
\frac{n}{p} = e^{-Q/kT}, \qquad Q = (m_n - m_p)c^2 = 1.293\ \text{MeV}
```

<div class="meaning">

<dl>
<dt>n/p</dt><dd>neutrons per proton</dd>
<dt>Q</dt><dd>the extra mass energy of a neutron: the energy it costs to turn a proton into a neutron</dd>
<dt>kT</dt><dd>the typical energy of a particle in the soup (Lesson 6.3)</dd>
<dt>Physical meaning</dt><dd>When kT is much bigger than Q, the cost hardly matters and neutrons and protons are equally common. As the soup cools, the cost matters more and neutrons become rarer. If the swaps had gone on forever, there would be no neutrons left, and no helium.</dd>
</dl>

</div>

<div class="problem" data-problem="first-second-ratio"></div>

**Freeze-out.** The weak swaps slow as T⁵, while the expansion rate falls only as T² (Lesson 6.3), so their ratio falls as T³. Near kT ≈ 0.8 MeV, about 1 second in, a neutron or proton has less than one chance to swap in the time it takes the universe to grow noticeably, and the ratio stops following the formula. It settles near 1/6 over the next ten seconds or so.

<figure class="fig" data-fig="first-second-2"><figcaption>Neutrons per proton through the first minutes. Dashed: the balance e<sup>−Q/kT</sup> the soup would keep if swaps were instant. Solid: a calculation with the real weak-reaction rates and free neutron decay. The ratio freezes near 1/6, then decay lowers it to about 1/7 when deuterium finally survives, about 3 minutes in. Press Play or slide through time.</figcaption></figure>

**Then decay.** A free neutron decays into a proton, an electron and an antineutrino, with a mean lifetime of about 879 seconds (just under 15 minutes). For the next few minutes the frozen neutrons slowly decay, until they are safely locked inside nuclei. That race between decay and nucleus-building is [Lesson 6.6](/learn/courses/cosmology/big-bang-nucleosynthesis/).

<div class="history">

**Recreating the soup.** In 1950 Chushiro Hayashi realised that the early universe sets the neutron-to-proton ratio by these swaps, and Alpher, Follin and Herman worked out the freeze-out in 1953. The idea that hot nuclear matter melts into free quarks came in the 1970s. Experiments at CERN announced evidence for a new state of matter in 2000, and in 2005 the Relativistic Heavy Ion Collider in New York reported that the quark-gluon plasma made by smashing gold nuclei flows like an almost perfect liquid. The Large Hadron Collider studies it today, a few trillion degrees, for a tiny fraction of a second.

</div>

<div class="myth">

**"Matter and antimatter were made equally, and matter won a battle."** If they had been exactly equal, both would have vanished into light. Annihilation removed antimatter and nearly all matter together; what is left is the tiny surplus of about one part in a billion that was there before. Something earlier must have made that surplus, and we do not yet know what.

</div>

<div class="keypoints">

- Above about 2 × 10<sup>12</sup> K (150 MeV), before about 10 microseconds: a quark-gluon plasma. Cooling locks quarks into protons and neutrons.
- Pairs are made freely while kT ≫ mc²; as the universe cools they annihilate, leaving a surplus of about one particle per billion pairs: 1.6 billion photons per proton or neutron today.
- Fast weak swaps keep n/p = e<sup>−Q/kT</sup>, Q = 1.293 MeV.
- Near kT ≈ 0.8 MeV (about 1 second) the swaps freeze: n/p ≈ 1/6. Free neutron decay (mean life 879 s) brings it to about 1/7 by the time nuclei form.

</div>
