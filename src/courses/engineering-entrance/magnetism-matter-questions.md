---
title: 'Magnetism and matter: question types and traps'
seoTitle: 'Magnetism and matter questions for JEE and NEET'
summary: 'Every way entrance exams ask about magnetism and matter: dipole fields, cut and bent magnets, combinations, torque, energy and oscillations, Earth''s field, dip and neutral points, B, H, M and susceptibility, classifying materials, Curie''s law and hysteresis, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'Two identical short magnets of moment m are placed to form a plus sign (crossed at their centres). The net moment is:'
    choices: ['2m', '√2 m', 'zero', 'm/√2']
    ans: 1
    why: 'Magnetic moments add as vectors. Two equal moments at 90° give √(m² + m²) = √2 m.'
  - q: 'The susceptibility of a paramagnetic salt is 2 × 10⁻⁴ at 300 K. At 150 K it is:'
    choices: ['1 × 10⁻⁴', '4 × 10⁻⁴', '2 × 10⁻⁴', '8 × 10⁻⁴']
    ans: 1
    why: 'Curie''s law χ ∝ 1/T. Halving the temperature doubles χ.'
  - q: 'At a place the dip is 60° and the horizontal component is 30 µT. The total field is:'
    choices: ['30 µT', '60 µT', '52 µT', '15 µT']
    ans: 1
    why: 'B_H = B cos δ, so B = 30/cos 60° = 60 µT.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Magnetism and matter; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 12 · about 26 minutes.** Read the lesson [Magnetism and matter](/learn/courses/engineering-entrance/magnetism-matter/) first. Here you meet every question type, with the method and the trap, then practise.

<div class="bigidea">Treat every magnet as a vector arrow m and every material as a number χ. Arrow questions (fields, torques, combinations, oscillations) copy the electric dipole; number questions (classification, Curie, hysteresis) need the table of materials.</div>

## The nine question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Dipole fields.</b> Axis 2× equator at the same distance. Point at angle θ: (μ₀/4π)(m/r³)√(1 + 3cos²θ). <i>Trap:</i> using 1/r² as for a single pole.</div>
<div class="step"><b>2. Cutting, bending, combining.</b> Moments add as vectors; cut across keeps pole strength; bend into an arc of angle θ: m' = m × (chord/length). <i>Trap:</i> adding magnitudes of crossed magnets.</div>
<div class="step"><b>3. Torque, work and energy.</b> τ = mB sin θ, W = mB(cos θ₁ − cos θ₂). <i>Trap:</i> stable is θ = 0 with U = −mB; unstable is θ = 180°.</div>
<div class="step"><b>4. Oscillation magnetometer.</b> T = 2π√(I/mB); compare fields or moments by T². Two magnets tied like poles together oscillate faster (m₁ + m₂), unlike poles slower (m₁ − m₂). <i>Trap:</i> forgetting that I also changes when a magnet is cut.</div>
<div class="step"><b>5. Earth's field and dip.</b> B_H = B cos δ, B_V = B sin δ. Apparent dip in a plane at angle α to the meridian: tan δ' = tan δ / cos α; true dip from two perpendicular planes: cot²δ = cot²δ₁ + cot²δ₂. <i>Trap:</i> mixing up the angle with the vertical and with the horizontal.</div>
<div class="step"><b>6. Neutral points.</b> N pointing north: equatorial line, (μ₀/4π)m/r³ = B_H. N pointing south: axis, (μ₀/4π)2m/r³ = B_H. <i>Trap:</i> putting the neutral point on the wrong line.</div>
<div class="step"><b>7. B, H, M and χ.</b> H = nI; M = χH; B = μ₀(H + M). <i>Trap:</i> H in a solenoid does not depend on the core; B does.</div>
<div class="step"><b>8. Classifying materials.</b> Sign and size of χ, behaviour in a non-uniform field, effect of temperature. <i>Trap:</i> diamagnetism exists in all materials but is hidden when para- or ferromagnetism is present.</div>
<div class="step"><b>9. Hysteresis and energy loss.</b> Energy per cycle per volume = loop area; power loss = area × volume × frequency. Choose soft iron for cores, steel for magnets. <i>Trap:</i> wanting high retentivity for an electromagnet; it should lose its magnetism when switched off.</div>
</div>

## Worked examples

**Example 1 (level 3, bent magnet).** A thin magnet of moment m and length L is bent at its middle to make an L shape (90°). New moment?

*Solution.* The poles are now at the ends of two arms of length L/2 at right angles: separation `$\sqrt{(L/2)^2 + (L/2)^2} = L/\sqrt2$`. Pole strength unchanged, so **m' = m/√2**.

**Example 2 (level 4, oscillations in two arrangements).** Two magnets with moments m₁ and m₂ (m₁ > m₂) and equal moments of inertia are tied together, first with like poles together, then with unlike. The periods are T₁ and T₂ with T₂ = 3T₁. Find m₁/m₂.

*Solution.* `$\dfrac{T_2^2}{T_1^2} = \dfrac{m_1 + m_2}{m_1 - m_2} = 9$`, so m₁ + m₂ = 9m₁ − 9m₂ and **m₁/m₂ = 10/8 = 1.25**.

**Example 3 (level 4, true dip).** In two vertical planes at right angles to each other, a dip needle shows 30° and 45°. Find the true dip.

*Solution.* `$\cot^2\delta = \cot^2 30° + \cot^2 45° = 3 + 1 = 4$`, so cot δ = 2 and **δ = tan⁻¹(1/2) ≈ 26.6°**. *Check:* the true dip is less than both apparent dips, as it must be.

**Example 4 (level 5, hysteresis loss).** An iron core of volume 500 cm³ has a hysteresis loop of area 300 J/m³ per cycle and runs on 50 Hz. Power lost?

*Solution.* P = 300 × (500 × 10⁻⁶) × 50 = **7.5 W**, all turned into heat in the core.

<div class="myth">

**"A diamagnet has no atomic magnets, so it cannot respond to a field."** Its atoms have zero net moment, but an applied field changes the electrons' orbital motion (Lenz's law at the atomic scale) and induces a small moment opposite to the field. That is diamagnetism.

</div>

<div class="meaning">
<dl>
<dt>Combination</dt><dd>like poles together: m₁ + m₂; unlike: m₁ − m₂; at 90°: √(m₁² + m₂²)</dd>
<dt>Apparent dip</dt><dd>tan δ' = tan δ / cos α, where α is the plane's angle with the magnetic meridian</dd>
<dt>Physical meaning</dt><dd>Only the horizontal part of the Earth's field turns a compass in a flat plane; the vertical part is why a dip needle tilts.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="magnetism-matter" data-mode="practice"></div>

<div class="keypoints">

- Nine types: dipole fields, cut and bent magnets, torque and energy, oscillations, dip, neutral points, B-H-M, materials, hysteresis.
- Moments add as vectors; L-bend gives m/√2, semicircle 2m/π.
- T² ∝ 1/(mB); like poles together oscillate faster.
- True dip from two planes: cot²δ = cot²δ₁ + cot²δ₂.
- H = nI does not depend on the core.
- Hysteresis power = loop area × volume × frequency.

</div>
