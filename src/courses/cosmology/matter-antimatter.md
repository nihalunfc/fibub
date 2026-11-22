---
title: "Why is there matter at all?"
seoTitle: "Why is there more matter than antimatter? Baryogenesis"
summary: "The Big Bang should have made equal amounts of matter and antimatter, which would have destroyed each other. One extra particle in about a billion survived. Sakharov's three conditions and the search for why."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "What is the baryon-to-photon ratio η, and why does it matter?"
    choices: ["About 6 × 10⁻¹⁰: one proton or neutron per 1.6 billion CMB photons, the leftover of matter's tiny head start over antimatter","About 1: equal numbers of atoms and photons","The fraction of the universe that is dark energy"]
    ans: 0
    why: "Nearly all the matter and antimatter turned into light. The few survivors, compared with that light, measure how big the original imbalance was."
  - q: "Which of these is one of Sakharov's three conditions?"
    choices: ["The universe must be closed","Processes that do not stay in thermal balance, so a lopsided result is not undone","Dark energy must exist"]
    ans: 1
    why: "The three are: baryon number can change; C and CP symmetry are broken; and things fall out of thermal equilibrium."
  - q: "Why can't the Standard Model of particle physics explain the matter excess on its own?"
    choices: ["Its CP violation is far too weak, and with the measured Higgs mass the early universe passed through no sharp out-of-balance transition","It has no antimatter in it","It does not allow protons to exist"]
    ans: 0
    why: "It has all three ingredients in principle, but in amounts billions of times too small. Some new physics, such as heavy neutrinos (leptogenesis), is needed."
sources:
  - "A. D. Sakharov (1967), Violation of CP invariance, C asymmetry, and baryon asymmetry of the universe, JETP Letters 5, 24; reprinted in Soviet Physics Uspekhi 34, 392 (1991) https://doi.org/10.1070/PU1991v034n05ABEH002497"
  - "M. Fukugita and T. Yanagida (1986), Baryogenesis without grand unification, Physics Letters B 174, 45 https://doi.org/10.1016/0370-2693(86)91126-3"
  - "J. H. Christenson, J. W. Cronin, V. L. Fitch and R. Turlay (1964), Evidence for the 2π decay of the K₂⁰ meson, Physical Review Letters 13, 138 https://doi.org/10.1103/PhysRevLett.13.138"
  - "L. Canetti, M. Drewes and M. Shaposhnikov (2012), Matter and antimatter in the universe, New Journal of Physics 14, 095012 https://doi.org/10.1088/1367-2630/14/9/095012"
  - "A. G. Cohen, A. De Rújula and S. L. Glashow (1998), A matter-antimatter universe?, Astrophysical Journal 495, 539 https://doi.org/10.1086/305328"
  - "E. K. Anderson et al. (ALPHA Collaboration) (2023), Observation of the effect of gravity on the motion of antimatter, Nature 621, 716 https://doi.org/10.1038/s41586-023-06527-1"
  - "T2K Collaboration (2020), Constraint on the matter-antimatter symmetry-violating phase in neutrino oscillations, Nature 580, 339 https://doi.org/10.1038/s41586-020-2177-0"
---

**Module 11 · about 16 minutes.** Read first: [3.3 E = mc²](/learn/courses/cosmology/e-equals-mc2/) and [6.4 The first second](/learn/courses/cosmology/first-second/). Every particle has an antiparticle with the same mass and opposite charge. When they meet, both turn into light. Energy turns into matter only in matched pairs, so a hot Big Bang should have made exactly equal amounts, and they should have wiped each other out. Yet here we are. By the end you will be able to say how big the imbalance was, how we measure it, and what it would take to explain it.

<div class="bigidea">For roughly every billion antiquarks in the early universe there were a billion and one quarks. Everything else annihilated into light. Every atom in every galaxy is made of those one-in-a-billion survivors, and nobody yet knows why they were there.</div>

## 1. Where is all the antimatter?

Antimatter is real and well understood: positrons are used in hospital PET scans, and at CERN antihydrogen atoms have been made, trapped and even dropped (in 2023 the ALPHA-g experiment showed they fall down, like ordinary matter). But the universe around us is matter:

- Cosmic rays contain a few antiprotons, a few for every 10,000 protons, about as many as collisions between cosmic rays and gas in space are expected to make.
- If some galaxies or clusters were antimatter, the gas where matter and antimatter regions touched would glow with gamma rays of a particular energy. We see no such glow. Andrew Cohen, Alvaro De Rújula and Sheldon Glashow showed in 1998 that any antimatter domains would have to be about as large as the observable universe.

So the imbalance is real and universal.

## 2. Measuring the leftover

When the universe cooled, nearly every particle found an antiparticle and turned into light. The survivors are counted against that light, the CMB photons:

```math
\eta = \frac{n_b}{n_\gamma} \approx 6.1 \times 10^{-10}
```

<div class="meaning">

<dl>
<dt>n<sub>b</sub></dt><dd>the number of baryons (protons and neutrons) per cubic metre: about 0.25 today, one in every four cubic metres</dd>
<dt>n<sub>γ</sub></dt><dd>the number of CMB photons per cubic metre: about 411 million today</dd>
<dt>η</dt><dd>both numbers fall as 1/a³ as space grows, so their ratio has stayed the same since the light elements formed</dd>
<dt>Physical meaning</dt><dd>About 1.6 billion photons for every baryon. The excess of matter over antimatter, before the annihilation, was of the same tiny size: roughly one part in a billion.</dd>
</dl>

</div>

η is measured two independent ways that agree: from the amount of deuterium made in the first minutes ([Lesson 6.6](/learn/courses/cosmology/big-bang-nucleosynthesis/)) and from the heights of the CMB's acoustic peaks ([Lesson 7.5](/learn/courses/cosmology/acoustic-peaks/)), which give Ω<sub>b</sub>h² = 0.0224.

<div class="problem" data-problem="matter-antimatter-eta"></div>

<div class="steps" data-fig="matter-antimatter">
<div class="step">The hot soup. Light is energetic enough to make particle-antiparticle pairs, and pairs annihilate back into light, in balance.</div>
<div class="step">The universe cools. Light can no longer make the heavy pairs, so matter and antimatter meet and annihilate, flooding space with photons.</div>
<div class="step">The leftover: one particle of matter from roughly every billion pairs, plus about two billion photons.</div>
<div class="step">Today: η ≈ 6 × 10<sup>−10</sup>. The photons have cooled into the CMB; the survivors are the atoms of every star, planet and person.</div>
</div>

<div class="problem" data-problem="matter-antimatter-leftover"></div>

## 3. Sakharov's three conditions

Could the universe simply have started with a little extra matter? Possibly, but inflation (Lesson 11.2) would have diluted any starting excess to nothing. The excess must have been made afterwards. In 1967 Andrei Sakharov, the Soviet physicist later famous as a human-rights campaigner, listed what any process needs to make more matter than antimatter from an even start:

1. **Baryon number must be able to change.** Some reaction must make or destroy baryons; otherwise their total can never move away from zero.
2. **C and CP symmetry must be broken.** C swaps particles for antiparticles; CP also swaps left and right, like a mirror. If nature treated the mirror-antimatter version of every reaction exactly the same, every process making extra baryons would be cancelled by one making extra antibaryons.
3. **Out of balance.** In perfect thermal equilibrium, every reaction runs as often backwards as forwards and any excess is undone. Something must happen too fast to be reversed, such as a rapid cooling or a sudden phase change.

## 4. The Standard Model is not enough

The known laws of particle physics have all three ingredients, in principle. At very high temperatures, rare processes called **sphalerons** change baryon number (with lepton number). CP violation exists: it was discovered in 1964 in the decays of K mesons by James Cronin and Val Fitch (Nobel Prize 1980), and is now measured in B mesons too. But:

- the CP violation in the quark sector is far too weak, by a factor of billions or more;
- with the Higgs mass measured at 125 GeV, the electroweak transition at about 10<sup>−11</sup> s was smooth, not the sudden out-of-balance event needed.

So the existence of matter is evidence for **physics beyond the Standard Model**.

## 5. The leading ideas

- **Leptogenesis** (Masataka Fukugita and Tsutomu Yanagida, 1986). Very heavy partners of the neutrinos, which would also explain why ordinary neutrinos are so light, decay slightly more often into leptons than antileptons. Sphalerons then turn about a third of that lepton excess into a baryon excess. It needs CP violation among neutrinos, which experiments are now hunting: in 2020 T2K in Japan reported a first hint, and the DUNE and Hyper-Kamiokande experiments aim to settle it.
- **Electroweak baryogenesis.** New particles, such as extra Higgs bosons, could make the electroweak transition sudden and add CP violation. The LHC and measurements of the electron's electric dipole moment are squeezing this idea hard.
- **Grand-unified baryogenesis.** The original idea of the late 1970s: very heavy particles decay unevenly. It struggles if inflation and reheating happened at lower temperatures than those particles need.

None is confirmed. This is one of the biggest open questions in physics.

<div class="history">

**From the positron to the matter puzzle.**

<ul class="timeline">
<li><b>1928</b> Paul Dirac's equation predicts antimatter.</li>
<li><b>1932</b> Carl Anderson finds the positron in cosmic rays.</li>
<li><b>1955</b> The antiproton is made at Berkeley.</li>
<li><b>1964</b> Cronin and Fitch discover CP violation.</li>
<li><b>1967</b> Sakharov states the three conditions.</li>
<li><b>1985</b> Vadim Kuzmin, Valery Rubakov and Mikhail Shaposhnikov show that electroweak processes can change baryon number in the hot early universe.</li>
<li><b>1986</b> Fukugita and Yanagida propose leptogenesis.</li>
<li><b>2023</b> ALPHA-g: antihydrogen falls down.</li>
</ul>

</div>

<div class="myth">

**"Somewhere out there must be an antimatter half of the universe."** It would be lovely and symmetric, but the evidence says no. Where matter and antimatter regions met, the annihilation would light up the boundary in gamma rays, and we see no such boundaries anywhere in the observable universe. The excess is everywhere we can look.

</div>

<div class="keypoints">

- Matter and antimatter are made in equal pairs, yet the universe is made of matter; antimatter domains, if any, would have to be as large as the observable universe.
- The leftover is measured as η = n<sub>b</sub>/n<sub>γ</sub> ≈ 6.1 × 10<sup>−10</sup>, from deuterium and from the CMB, which agree: roughly a one-in-a-billion excess.
- Sakharov (1967): making the excess needs baryon-number change, C and CP violation, and departure from thermal equilibrium.
- The Standard Model's CP violation is far too weak and its electroweak transition too smooth, so new physics is needed.
- Leading ideas: leptogenesis (heavy neutrinos), electroweak baryogenesis with new particles, and grand-unified baryogenesis. None is confirmed yet.

</div>
