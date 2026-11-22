---
title: 'Physics: semiconductor electronics'
seoTitle: 'Semiconductors, p-n junction and diodes for CUET Physics'
summary: 'Energy bands, intrinsic and doped semiconductors, the p-n junction in forward and reverse bias, and the diode as a rectifier, in plain words with a step-by-step junction animation and the exact scope of the current syllabus.'
minutes: 18
updated: 2026-11-22
quiz:
  - q: 'Adding a pentavalent impurity such as phosphorus to silicon makes:'
    choices: ['an n-type semiconductor', 'a p-type semiconductor', 'an insulator']
    ans: 0
    why: 'Each phosphorus atom has one extra electron that is free to move, so electrons are the majority carriers.'
  - q: 'A full-wave rectifier fed with 50 Hz AC gives ripple at:'
    choices: ['100 Hz', '50 Hz', '25 Hz']
    ans: 0
    why: 'Both halves of each cycle are turned into pulses in the same direction, so there are two pulses per cycle.'
  - q: 'The width of the depletion layer in reverse bias:'
    choices: ['increases', 'decreases', 'stays the same']
    ans: 0
    why: 'Reverse bias pulls the majority carriers away from the junction, so more fixed ions are uncovered and the layer widens.'
sources:
  - 'NCERT, Physics Part II (Class 12), Semiconductor Electronics: Materials, Devices and Simple Circuits'
  - 'National Testing Agency, CUET (UG) Physics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 6 · about 18 minutes.** By the end you will explain doping, the p-n junction and rectifiers. Read first: [current electricity](/learn/courses/cuet/physics-current-electricity/).

<div class="bigidea">A semiconductor is a material whose ability to conduct we can control, by adding a pinch of impurity or by applying a small voltage. That control is what every chip, LED and solar cell is built on.</div>

**Everyday picture:** a car park. In a full car park (valence band) nobody can move; in an empty one above (conduction band) cars move freely. A semiconductor has a small ramp between them (the band gap, ~1.1 eV for silicon) that heat or light can push a few cars up. Each car that leaves also leaves a gap (a hole) that other cars can shuffle into.

## 1. Bands and doping

| Material | Band gap | Example |
|---|---|---|
| Conductor | bands overlap | copper |
| Semiconductor | small, under ~3 eV | silicon 1.1 eV, germanium 0.7 eV |
| Insulator | large, over ~3 eV | diamond 5.5 eV |

**n-type**: add a group 15 atom (P, As); extra electrons are the majority carriers. **p-type**: add a group 13 atom (B, Al, In); holes are the majority carriers. The material stays electrically neutral either way.

**Try it:** Change the gap and temperature.

<figure class="fig" data-fig="@sx-band-fill"><figcaption>The gap decides whether a material is a conductor, semiconductor or insulator.</figcaption></figure>

## 2. The p-n junction

<div class="steps" data-title="How the junction forms and works">
<div class="step"><b>Diffusion:</b> electrons from the n side wander into the p side and fill holes, and holes wander the other way.</div>
<div class="step"><b>Depletion layer:</b> a thin zone left with fixed ions and no free carriers. Its field sets up a barrier potential (~0.7 V for silicon).</div>
<div class="step"><b>Forward bias</b> (p to +): the barrier falls, the layer thins, and current flows easily once V exceeds ~0.7 V.</div>
<div class="step"><b>Reverse bias</b> (p to −): the barrier grows and only a tiny leakage current flows, until breakdown.</div>
<div class="step"><b>Rectifier:</b> because a diode conducts one way only, it turns AC into pulsing DC. Half-wave uses one diode; full-wave uses two (centre-tap) or four (bridge).</div>
</div>

**Try it:** Step through how the junction forms.

<figure class="fig" data-fig="@sx-pn-junction"><figcaption>Diffusion leaves a depletion region and a built-in field.</figcaption></figure>

## 3. What is in the syllabus, and what is not

The rationalised NCERT chapter that CUET follows covers bands, intrinsic and extrinsic semiconductors, the p-n junction, its I-V curve, and the diode as a rectifier. Transistors, Zener and other special diodes, and logic gates were taken out of the Class 12 book in 2023, so CUET should not test them. If your state board still teaches them, they are worth knowing for the board exam, but do not spend CUET time there.

| Rectifier | Diodes | Output pulses per AC cycle |
|---|---|---|
| Half-wave | 1 | 1 (half of each cycle is lost) |
| Full-wave, centre-tap | 2 | 2 |
| Full-wave, bridge | 4 | 2 |

A capacitor across the output (a filter) charges on each pulse and fills the gaps, giving a smoother DC.

<div class="myth">

**"Holes are just empty space, not real carriers."** A hole behaves exactly like a positive charge moving the other way, and you can measure it (the Hall effect has opposite sign in p-type). Treating it as a carrier makes the physics simple.

</div>

## 4. Practice

<div class="qbank" data-bank="entrance-physics" data-topics="semiconductors" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Band gap: conductor 0, semiconductor small, insulator large.
- n-type: group 15 dopant, electrons majority; p-type: group 13 dopant, holes majority.
- Forward bias conducts after ~0.7 V (Si); reverse bias blocks.
- Full-wave ripple at twice the supply frequency; a capacitor filter smooths it.
- Transistors and logic gates are out of the current syllabus.

</div>
