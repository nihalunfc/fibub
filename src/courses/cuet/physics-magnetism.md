---
title: 'Physics: moving charges and magnetism'
seoTitle: 'Moving charges and magnetism for CUET Physics'
summary: 'The magnetic force on charges and wires, circular motion in a field, Biot-Savart and Ampere''s law, solenoids, the moving coil galvanometer, and magnetic materials, with a live force problem.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A charge moves parallel to a magnetic field. The magnetic force on it is:'
    choices: ['zero', 'qvB', 'maximum']
    ans: 0
    why: 'F = qvB sin θ and θ = 0, so the force vanishes. Only the part of the velocity across the field feels a force.'
  - q: 'Doubling the current in a long straight wire makes the field at a point:'
    choices: ['double', 'four times', 'unchanged']
    ans: 0
    why: 'B = μ₀I/(2πr) is directly proportional to I.'
  - q: 'Which material is weakly repelled by a magnet?'
    choices: ['Diamagnetic (e.g. bismuth)', 'Paramagnetic (e.g. aluminium)', 'Ferromagnetic (e.g. iron)']
    ans: 0
    why: 'Diamagnetic materials set up a tiny opposite magnetisation and are pushed out of strong fields.'
sources:
  - 'NCERT, Physics Part I (Class 12), Moving Charges and Magnetism; Magnetism and Matter'
  - 'National Testing Agency, CUET (UG) Physics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 6 · about 20 minutes.** By the end you will find magnetic forces and fields and explain how a galvanometer and magnetic materials work. Read first: [current electricity](/learn/courses/cuet/physics-current-electricity/).

<div class="bigidea">Moving charges make magnetic fields, and magnetic fields push sideways on moving charges. Sideways is the key word: the force is always at right angles to both the motion and the field.</div>

**Everyday picture:** a loudspeaker. A coil carrying music current sits in a magnet's field; the sideways push on the coil goes back and forth with the current and moves the paper cone that makes sound.

## 1. Force on a charge and on a wire

```math
\vec F = q\,\vec v \times \vec B \qquad F = BIL\sin\theta \qquad r = \frac{mv}{qB}
```

<div class="meaning">

<dl>
<dt>v × B</dt><dd>the force is perpendicular to both; use the right-hand rule (fingers along v, curl to B, thumb gives F for a + charge).</dd>
<dt>r = mv/qB</dt><dd>a charge moving across a uniform field goes round in a circle. Period T = 2πm/qB does not depend on speed, which is how a cyclotron works.</dd>
<dt>Physical meaning</dt><dd>the force never speeds a charge up or slows it down (it is always sideways), so a magnetic field does no work. It only bends paths.</dd>
</dl>

</div>

<div class="problem" data-problem="force-on-wire"></div>

## 2. Fields made by currents

<div class="steps" data-title="Four fields to know by heart">
<div class="step"><b>Long straight wire:</b> B = μ₀I/(2πr), circles round the wire (right-hand grip rule).</div>
<div class="step"><b>Centre of a circular loop:</b> B = μ₀I/(2R); for N turns multiply by N.</div>
<div class="step"><b>Long solenoid:</b> B = μ₀nI inside (n = turns per metre), almost zero outside. Like a bar magnet.</div>
<div class="step"><b>Toroid:</b> B = μ₀NI/(2πr) inside the ring, zero outside and in the hole.</div>
</div>

Ampere's law, ∮B·dl = μ₀I_enclosed, does for magnetism what Gauss's law does for electrostatics: with symmetry it gives the field in one line. Two parallel wires with currents in the same direction **attract**; opposite directions **repel**.

## 3. Galvanometer, ammeter, voltmeter

A coil in a radial field feels torque τ = NIAB, balanced by a spring kφ, so the deflection φ ∝ I. Add a small resistance in **parallel** (a shunt) to make an ammeter; add a large resistance in **series** to make a voltmeter.

| Material | Susceptibility χ | Behaviour |
|---|---|---|
| Diamagnetic | small, negative | weakly repelled (bismuth, copper, water) |
| Paramagnetic | small, positive | weakly attracted (aluminium, oxygen) |
| Ferromagnetic | large, positive | strongly attracted, can stay magnetised (iron, nickel, cobalt); paramagnetic above the Curie temperature |

<div class="myth">

**"A magnetic field can speed up an electron."** It cannot: the force is always perpendicular to the velocity, so the kinetic energy stays the same. Electric fields change speed; magnetic fields change direction.

</div>

## 4. Practice

<div class="qbank" data-bank="entrance-physics" data-topics="moving-charges-magnetism,magnetism-matter" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- F = qvB sin θ, F = BIL sin θ; magnetic force does no work.
- Circle radius r = mv/qB; period 2πm/qB is independent of speed.
- Wire μ₀I/2πr, loop μ₀I/2R, solenoid μ₀nI.
- Shunt in parallel → ammeter; big resistance in series → voltmeter.
- Dia (repelled), para (weakly attracted), ferro (strongly attracted).

</div>
