---
title: "The lithium problem"
seoTitle: "The cosmological lithium problem explained"
summary: "Big Bang nucleosynthesis gets helium and deuterium right, but predicts about three times more lithium-7 than the oldest stars contain. What the Spite plateau is, why changing the density of atoms cannot fix it, and the leading explanations."
minutes: 13
updated: 2026-11-22
quiz:
  - q: "What is the lithium problem?"
    choices: ["There is too much lithium in the universe","Old halo stars hold about three times less lithium-7 than Big Bang nucleosynthesis predicts","Lithium cannot be made in the Big Bang at all"]
    ans: 1
    why: "The prediction is about 5 × 10⁻¹⁰ lithium atoms per hydrogen atom; the Spite plateau of old stars shows about 1.6 × 10⁻¹⁰."
  - q: "Why can't we fix it by choosing a different density of atoms (η)?"
    choices: ["η cannot be changed in the equations","The η that would match lithium gives far too much deuterium and disagrees with the CMB","Lithium does not depend on η"]
    ans: 1
    why: "Deuterium and the CMB both pin η ≈ 6.1 × 10⁻¹⁰. Lowering η enough for lithium would roughly double or triple the deuterium."
  - q: "Which explanation is currently the most popular?"
    choices: ["The stars have slowly destroyed some of their own lithium, which burns at about 2.5 million K","Lithium decays radioactively in a few years","The measurements of helium are wrong"]
    ans: 0
    why: "Lithium is fragile. Mixing and the slow sinking of elements in a star's outer layers can lower the surface lithium; how much is still debated, and new physics is not ruled out."
sources:
  - "F. Spite and M. Spite (1982), Abundance of lithium in unevolved halo stars and old disk stars: interpretation and consequences, A&A 115, 357"
  - "L. Sbordone et al. (2010), The metal-poor end of the Spite plateau. I. Stellar parameters, metallicities, and lithium abundances, A&A 522, A26 https://doi.org/10.1051/0004-6361/200913282"
  - "B. D. Fields (2011), The primordial lithium problem, Annual Review of Nuclear and Particle Science 61, 47 https://doi.org/10.1146/annurev-nucl-102010-130445"
  - "B. D. Fields, K. A. Olive, T.-H. Yeh and C. Young (2020), Big-Bang nucleosynthesis after Planck, JCAP 03 (2020) 010 https://doi.org/10.1088/1475-7516/2020/03/010"
  - "A. J. Korn et al. (2006), A probable stellar solution to the cosmological lithium discrepancy, Nature 442, 657 https://doi.org/10.1038/nature05011"
  - "M. Barbagallo et al. (n_TOF Collaboration) (2016), ⁷Be(n,α)⁴He reaction and the cosmological lithium problem, Physical Review Letters 117, 152701 https://doi.org/10.1103/PhysRevLett.117.152701"
  - "J. C. Howk, N. Lehner, B. D. Fields and G. J. Mathews (2012), Observation of interstellar lithium in the low-metallicity Small Magellanic Cloud, Nature 489, 121 https://doi.org/10.1038/nature11407"
---

**Module 6 · about 13 minutes.** Read first: [6.6 Big Bang nucleosynthesis](/learn/courses/cosmology/big-bang-nucleosynthesis/). The theory of the first minutes predicts four light nuclei. Three agree with the sky. The fourth, lithium-7, does not, and the disagreement has lasted more than forty years. By the end you will be able to explain what is measured, how big the mismatch is, and what could cause it.

<div class="bigidea">The Big Bang should have left about 5 lithium atoms for every 10 billion hydrogen atoms. The oldest stars show about 1.6. Either the stars have destroyed most of their lithium, or something in the first minutes was different from what we think.</div>

## 1. Where the lithium comes from

At the measured density of atoms, most Big Bang lithium-7 is made indirectly: helium-3 and helium-4 fuse into **beryllium-7**, which later grabs an electron and turns into lithium-7 (a little is made directly from tritium plus helium-4). The calculation, using nuclear reaction rates measured in laboratories, gives:

```math
\left(\frac{\text{Li}}{\text{H}}\right)_\text{BBN} \approx (4.7\ \text{to}\ 5.6)\times10^{-10}, \qquad A(\text{Li}) = 12 + \log_{10}\frac{\text{Li}}{\text{H}} \approx 2.7
```

<div class="meaning">

<dl>
<dt>Li/H</dt><dd>lithium-7 atoms for every hydrogen atom (number, not mass)</dd>
<dt>A(Li)</dt><dd>astronomers' log scale: hydrogen is 12, and each step of 1 is ten times more or less. A difference of 0.5 is a factor of 10<sup>0.5</sup> ≈ 3.2</dd>
<dt>Physical meaning</dt><dd>The prediction is fixed once η is fixed by deuterium and the CMB (Lesson 6.6). There is no free knob left to turn.</dd>
</dl>

</div>

## 2. The Spite plateau

Lithium is measured from a dark line at 670.8 nm in the spectra of stars. To see lithium from the Big Bang you need stars made from gas that had barely been touched by earlier stars. The best are old, small stars in the Milky Way's halo, with as little as a thousandth of the Sun's iron.

In 1982 the French astronomers **François and Monique Spite** found something striking: the warmer of these stars all show nearly the same lithium, whatever their iron content. Since then hundreds have been measured. The flat level, the **Spite plateau**, is at A(Li) ≈ 2.2, or Li/H ≈ 1.6 × 10<sup>−10</sup>. A flat plateau looks like a primordial value: if stars were adding lithium, the richer ones would have more.

But it is about **three times lower** than the prediction.

<figure class="fig" data-fig="lithium-problem"><figcaption>Lithium in old halo stars against their iron content: a flat plateau at A(Li) ≈ 2.2 (dots are illustrative, drawn to match published surveys), with more scatter in the very poorest stars. The red band is the Big Bang prediction. Slide η: lowering it enough to bring the prediction down to the plateau makes deuterium disagree badly.</figcaption></figure>

<div class="problem" data-problem="lithium-problem-factor"></div>

## 3. Can we just change the density of atoms?

Near the measured density, predicted lithium grows roughly as η², so a lower η means less lithium. But deuterium goes the other way, as η<sup>−1.6</sup>, and the CMB measures η independently. Lowering η enough to fix lithium would leave two to three times as much deuterium as is measured, and disagree with the CMB. (At even lower η lithium rises again, as it is then made directly, so there is no clean way out.)

<div class="problem" data-problem="lithium-problem-eta"></div>

## 4. Three kinds of answer

**The stars destroyed it.** Lithium burns at about 2.5 million K, a temperature reached not far below a star's surface. Over 12 billion years, slow mixing and the gradual sinking of heavier elements in a star's outer layers could lower the lithium we see on its surface. In 2006 Andreas Korn and colleagues found that stars at different stages in the globular cluster NGC 6397 show different surface lithium, as such sinking predicts. The difficulty is explaining why the result is so uniform from star to star.

**The nuclear physics is off.** Perhaps some reaction that destroys beryllium-7 is faster than thought. Laboratories have now measured the key reactions; for example the n_TOF experiment at CERN measured beryllium-7 plus a neutron in 2016 and found it far too slow to help. This answer is now considered unlikely.

**New physics.** A particle that decays during or after the first minutes, or a change in the fundamental constants, could alter beryllium-7 without spoiling deuterium and helium. Such ideas are possible but tightly squeezed by other data.

There is also a hint from elsewhere: in 2012 Christopher Howk and colleagues measured lithium in gas in the Small Magellanic Cloud, a neighbouring galaxy with a quarter of the Sun's metals, and found a value close to the Big Bang prediction (allowing for some made since by cosmic rays and stars). If gas keeps the primordial value, the stars may be the ones that lost it.

<div class="history">

<ul class="timeline">
<li><b>1982</b> François and Monique Spite discover the lithium plateau in old halo stars.</li>
<li><b>2003</b> The first WMAP results fix η precisely, and the lithium mismatch becomes sharp.</li>
<li><b>2006</b> Korn and colleagues: evidence of lithium sinking in the stars of NGC 6397.</li>
<li><b>2010</b> Sbordone and colleagues: in the very poorest stars the plateau breaks up (a "meltdown").</li>
<li><b>2012</b> Lithium in Small Magellanic Cloud gas near the Big Bang value.</li>
<li><b>2016</b> CERN's n_TOF rules out the main nuclear-physics fix.</li>
</ul>

</div>

<div class="myth">

**"The lithium problem shows Big Bang nucleosynthesis is wrong."** The same calculation predicts helium-4 and deuterium correctly, both measured to a few percent, and gets η in agreement with the CMB from a completely different era. Lithium is the one fragile element whose measured value could easily have been changed since. The problem is real and unsolved, but it is a puzzle inside a successful theory, not a crack through it.

</div>

<div class="keypoints">

- Big Bang lithium-7 (mostly made as beryllium-7): Li/H ≈ 5 × 10<sup>−10</sup>, A(Li) ≈ 2.7.
- Old halo stars sit on the flat Spite plateau (1982): A(Li) ≈ 2.2, Li/H ≈ 1.6 × 10<sup>−10</sup>, about three times lower.
- Changing η cannot fix it: deuterium (∝ η<sup>−1.6</sup>) and the CMB pin η ≈ 6.1 × 10<sup>−10</sup>.
- Candidates: lithium destroyed in stars (most favoured), nuclear rates (largely ruled out), new physics (possible, constrained).

</div>
