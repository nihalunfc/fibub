---
title: "The vacuum energy puzzle"
seoTitle: "Vacuum energy and the cosmological constant problem"
summary: "Quantum theory says empty space holds energy that acts like a cosmological constant, but the estimate is about 10¹²⁰ times too big. The worst mismatch in physics."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "Why would vacuum energy act like a cosmological constant?"
    choices: ["Empty space looks the same to every moving observer, which forces its pressure to be −ρc², so w = −1", "Because it is made of dark matter", "Because it slowly decays"]
    ans: 0
    why: "Only an energy with p = −ρc² looks identical whichever way you move through it. That is exactly Λ's equation of state."
  - q: "Roughly how far off is the simplest quantum estimate of the vacuum energy?"
    choices: ["About 120 orders of magnitude too big with a Planck-energy cut-off, still about 60 with a TeV cut-off", "About a factor of 2", "It matches perfectly"]
    ans: 0
    why: "The estimate grows as the cut-off energy to the 4th power. Even the lowest cut-off that particle physics allows leaves an enormous gap."
  - q: "What did Steven Weinberg argue in 1987?"
    choices: ["If the vacuum energy were much bigger than about a few hundred times the matter density, galaxies could not form, so observers can only find a small value", "That the vacuum energy must be exactly zero", "That dark energy is made of neutrinos"]
    ans: 0
    why: "This anthropic bound predicted a small but non-zero value a decade before the 1998 measurement. Whether it is the right explanation is still argued."
sources:
  - "S. Weinberg (1989), The cosmological constant problem, Reviews of Modern Physics 61, 1 https://doi.org/10.1103/RevModPhys.61.1"
  - "S. Weinberg (1987), Anthropic bound on the cosmological constant, Physical Review Letters 59, 2607 https://doi.org/10.1103/PhysRevLett.59.2607"
  - "S. K. Lamoreaux (1997), Demonstration of the Casimir force in the 0.6 to 6 μm range, Physical Review Letters 78, 5 https://doi.org/10.1103/PhysRevLett.78.5"
  - "S. M. Carroll (2001), The cosmological constant, Living Reviews in Relativity 4, 1 https://doi.org/10.12942/lrr-2001-1"
  - "J. Martin (2012), Everything you always wanted to know about the cosmological constant problem (but were afraid to ask), Comptes Rendus Physique 13, 566 https://doi.org/10.1016/j.crhy.2012.04.008"
---

**Module 9 · about 16 minutes.** Read first: [9.2 Einstein's cosmological constant returns](/learn/courses/cosmology/cosmological-constant/) and [3.3 E = mc²](/learn/courses/cosmology/e-equals-mc2/). Lesson 9.2 described Λ as an energy of empty space. Quantum physics says empty space really does hold energy. The trouble is how much. By the end you will be able to make the famous estimate yourself and explain why it is called the worst prediction in physics.

<div class="bigidea">Quantum theory says the vacuum is never perfectly still, and its jitter carries energy that should gravitate exactly like a cosmological constant. Add it up and you get a number about 10<sup>120</sup> times too big. Something we do not understand cancels almost all of it.</div>

## 1. Empty space is not empty

Take a pendulum and remove every bit of energy you can. Classically it would hang perfectly still. Quantum mechanics forbids that: a position known exactly and a speed known exactly cannot go together (the uncertainty principle). So even in its lowest state the pendulum keeps a little jitter, and a little energy, the **zero-point energy**:

```math
E_0 = \tfrac12 \hbar\, \omega
```

<div class="meaning">

<dl>
<dt>ħ</dt><dd>the reduced Planck constant, 1.055 × 10<sup>−34</sup> J s: the size of quantum effects</dd>
<dt>ω</dt><dd>how fast the oscillator swings (angular frequency)</dd>
<dt>Physical meaning</dt><dd>The lowest possible energy is not zero. Every way something can wobble keeps half a "quantum" of energy for ever.</dd>
</dl>

</div>

In modern physics every particle is a ripple in a **field** that fills space: the electromagnetic field for light, the electron field, and so on. Each field is like a mattress of countless tiny springs, one for every possible wave, and each keeps its zero-point jitter. So "empty" space should hold energy in every cubic metre.

And it would be exactly the right kind. Empty space must look the same to everyone, however they move (if the vacuum had a "rest frame", you could measure your speed against nothing). The only energy and pressure that look identical to every moving observer have **p = −ρc²**. So vacuum energy behaves exactly like Einstein's Λ. On paper, dark energy is explained. Then you try to work out how much.

## 2. Adding it up

Each wave with frequency ω contributes ½ħω, and there are more and more possible waves at higher frequencies. Counting all of them up to some highest energy E<sub>c</sub>, a "cut-off" beyond which we do not trust our theories, gives roughly:

```math
\rho_{\text{vac}}c^2 \approx \frac{E_c^4}{16\pi^2\,(\hbar c)^3}
```

<div class="meaning">

<dl>
<dt>E<sub>c</sub></dt><dd>the cut-off: the highest energy the theory is trusted to. The natural top end is the Planck energy, 1.22 × 10<sup>28</sup> eV, where gravity itself needs a quantum theory</dd>
<dt>Power of 4</dt><dd>three powers from counting waves in three dimensions, one from the energy of each wave. Ten times the cut-off gives ten thousand times the energy</dd>
<dt>Physical meaning</dt><dd>This is one field's share; real fields add more, with different signs. It is an order-of-magnitude estimate, not a precise prediction, but no known physics makes it small.</dd>
</dl>

</div>

<figure class="fig" data-fig="vacuum-energy"><figcaption>The rough quantum estimate of vacuum energy (rising line) against the cut-off energy, and the measured dark energy (flat line). Slide the cut-off. They meet only near a few thousandths of an electronvolt, far below the energy of any particle we know.</figcaption></figure>

With the Planck energy as the cut-off, the estimate is about 10<sup>111</sup> J/m³. Dark energy is measured at about 5 × 10<sup>−10</sup> J/m³. The gap is **about 120 orders of magnitude**. Even if new physics cuts the counting off at around 1 TeV, the energy reached by the Large Hadron Collider, the gap is still **about 60 orders of magnitude**.

<div class="problem" data-problem="vacuum-energy-mismatch"></div>

Turn it round: the measured dark energy corresponds to an energy scale of only about **2 milli-electronvolts**, hundreds of millions of times less than the energy locked in an electron's mass. Nothing in particle physics lives there.

<div class="problem" data-problem="vacuum-energy-scale"></div>

## 3. Is vacuum energy real?

Its effects are measured. Put two smooth metal plates very close together in a vacuum. Between them only waves that fit the gap are allowed; outside, all waves are. The difference in zero-point energy pulls the plates together: the **Casimir effect**, predicted by Hendrik Casimir in 1948 and measured accurately by Steve Lamoreaux in 1997. Vacuum jitter also shifts the energy levels of hydrogen slightly (the Lamb shift, measured in 1947).

So the jitter is real. What nobody knows is how the vacuum's energy **gravitates**. Laboratories only ever measure energy differences, which do not care about a constant added everywhere. Gravity is the one thing that feels the total, and the total it feels is tiny.

## 4. Ways out

None of these is settled. They are the main ideas people work on:

- **Something cancels it.** Some unknown symmetry could force the total to exactly zero, with dark energy something else (Lesson 9.4). Supersymmetry would cancel matter fields against force fields, but if it exists at all it is broken above about a TeV, which still leaves the 60 orders.
- **It is huge elsewhere, and we live where it is small (anthropic).** In 1987 Steven Weinberg showed that if the vacuum energy were bigger than about a few hundred times the density of matter today, the expansion would have sped up before gravity could pull matter into galaxies, and nobody would be here to measure it. If many regions of a larger universe had different values (Lesson 11.7), observers would find a small one. He predicted a small, non-zero value a decade before the supernovae.
- **Gravity is different on the largest scales.** Some theories change general relativity so that a constant vacuum energy stops curving space-time. None works fully yet.

<div class="history">

**The worst prediction in physics.**

<ul class="timeline">
<li><b>1948</b> Hendrik Casimir predicts the force between plates from vacuum energy.</li>
<li><b>1967-68</b> Yakov Zel'dovich points out that quantum vacuum energy should act as a cosmological constant, and that the estimate is absurdly large.</li>
<li><b>1987</b> Steven Weinberg's anthropic bound.</li>
<li><b>1989</b> Weinberg's review "The cosmological constant problem" makes it famous.</li>
<li><b>1997</b> Lamoreaux measures the Casimir force to about 5%.</li>
<li><b>1998</b> Dark energy is measured: not zero, but 10<sup>120</sup> times below the estimate.</li>
</ul>

</div>

<div class="myth">

**"Quantum theory predicted dark energy and got the number wrong by 10<sup>120</sup>."** It is fairer to say we have no prediction at all. The estimate shows that the natural size is enormous; nobody knows the right calculation. Before 1998 most physicists expected the true answer to be exactly zero, by some unknown cancellation. Finding a small value that is not zero made the puzzle harder, not easier.

</div>

<div class="keypoints">

- Quantum fields keep a zero-point jitter, E<sub>0</sub> = ½ħω per wave, so empty space holds energy.
- Vacuum energy must look the same to every observer, so p = −ρc²: it acts exactly like a cosmological constant.
- The rough estimate ρc² ≈ E<sub>c</sub>⁴/(16π²(ħc)³) overshoots the measured value by about 120 orders of magnitude with a Planck cut-off, about 60 with a TeV cut-off.
- The measured dark energy corresponds to an energy of only about 2 meV.
- Vacuum effects (Casimir force, Lamb shift) are real; how the vacuum's total energy gravitates is the unsolved part. Weinberg's 1987 anthropic bound foresaw a small, non-zero value.

</div>
