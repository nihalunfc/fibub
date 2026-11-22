---
title: 'Physics: electric charges, fields and capacitors'
seoTitle: 'Electrostatics and capacitors for CUET Physics'
summary: 'Coulomb''s law, electric field and potential, Gauss''s law in one picture, and capacitors in series and parallel, with the physical meaning of each and a live capacitor problem.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'The distance between two charges is doubled. The force between them becomes:'
    choices: ['one quarter', 'one half', 'double']
    ans: 0
    why: 'Coulomb''s law is an inverse-square law: F ∝ 1/r², so doubling r divides F by 4.'
  - q: 'Two 6 µF capacitors in series give:'
    choices: ['3 µF', '12 µF', '6 µF']
    ans: 0
    why: 'In series 1/C = 1/6 + 1/6 = 1/3, so C = 3 µF. Series capacitors combine like parallel resistors.'
  - q: 'Inside a charged hollow metal sphere, the electric field is:'
    choices: ['zero', 'largest at the centre', 'the same as just outside']
    ans: 0
    why: 'Gauss''s law: a closed surface inside encloses no charge, so the field there is zero. This is why a car shields you from lightning.'
sources:
  - 'NCERT, Physics Part I (Class 12), Electric Charges and Fields; Electrostatic Potential and Capacitance'
  - 'National Testing Agency, CUET (UG) Physics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 6 · about 20 minutes.** By the end you will use Coulomb's law, the field and the potential, and combine capacitors. Read first: [How to choose your subjects](/learn/courses/cuet/choosing-subjects/) if you have not decided on Physics yet.

<div class="bigidea">Charges push and pull through a field that fills the space around them. Potential is the energy per unit charge in that field, and a capacitor is simply a place to store charge, and so energy, in a field.</div>

**Everyday picture:** a balloon rubbed on your hair sticks to the wall. Rubbing moved electrons; the charged balloon makes the wall's charges shift slightly, and opposite charges, now a little closer, win the pull.

## 1. Coulomb's law and the field

```math
F = \frac{1}{4\pi\varepsilon_0}\,\frac{q_1 q_2}{r^2} \qquad E = \frac{F}{q_0} = \frac{1}{4\pi\varepsilon_0}\,\frac{q}{r^2}
```

<div class="meaning">

<dl>
<dt>1/4πε₀</dt><dd>9 × 10⁹ N m² C⁻² in vacuum. In a medium of dielectric constant K the force is K times smaller.</dd>
<dt>E</dt><dd>force on a tiny +1 C test charge, in N/C (same as V/m). It points away from + charges and towards − charges.</dd>
<dt>Physical meaning</dt><dd>the field is a map of "what would happen to a charge placed here". Field lines never cross and start on + and end on −; where they crowd, the field is strong.</dd>
</dl>

</div>

<div class="steps" data-title="Gauss's law in four pictures">
<div class="step"><b>Flux</b> counts field lines crossing a surface: Φ = E·A cos θ.</div>
<div class="step"><b>Gauss:</b> total flux through any closed surface = charge inside ÷ ε₀. Charges outside add nothing.</div>
<div class="step"><b>Long wire:</b> a cylinder around it gives E = λ/(2πε₀r), falling as 1/r.</div>
<div class="step"><b>Infinite sheet:</b> E = σ/(2ε₀), the same at every distance. Two opposite sheets (a capacitor) give σ/ε₀ between them and zero outside.</div>
<div class="step"><b>Charged shell:</b> outside it acts like a point charge at the centre; inside, E = 0.</div>
</div>

## 2. Potential and potential energy

Potential V = kq/r is a number, not an arrow, so potentials from many charges simply add. Work done moving charge q from A to B is q(V_B − V_A). Along an equipotential surface no work is done, so field lines always cross equipotentials at right angles. A dipole (±q a distance 2a apart, moment p = q·2a) in a field feels torque τ = pE sin θ.

## 3. Capacitors

| Idea | Formula | Meaning |
|---|---|---|
| Capacitance | C = Q/V | charge stored per volt |
| Parallel plates | C = Kε₀A/d | bigger plates, closer together, or a dielectric: more C |
| Series | 1/C = 1/C₁ + 1/C₂ | same charge on each; total C is less than the smallest |
| Parallel | C = C₁ + C₂ | same voltage on each; capacities add |
| Energy | U = ½CV² = Q²/2C | energy is stored in the field between the plates |

<div class="problem" data-problem="capacitor-energy"></div>

<div class="myth">

**"A dielectric lets current flow through a capacitor."** A dielectric is an insulator. Its molecules line up slightly (polarise), which weakens the field inside and lets the plates hold K times more charge at the same voltage.

</div>

## 4. Practice

<div class="qbank" data-bank="entrance-physics" data-topics="potential-capacitance" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- F ∝ q₁q₂/r²; field E = F/q₀, potential V = kq/r (a scalar, so it adds simply).
- Gauss: flux = q_inside/ε₀. Wire 1/r, sheet constant, inside a shell zero.
- C = Kε₀A/d; series capacitors like parallel resistors and the reverse.
- U = ½CV²; a dielectric raises C by K.

</div>
