---
title: 'Physics: current electricity'
seoTitle: 'Current electricity for CUET Physics: Ohm, Kirchhoff, cells'
summary: 'Drift velocity, Ohm''s law and resistivity, series and parallel resistors, cells with internal resistance, Kirchhoff''s rules and the Wheatstone bridge, with a live circuit problem.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A wire is stretched to twice its length (volume unchanged). Its resistance becomes:'
    choices: ['4 times', '2 times', 'half']
    ans: 0
    why: 'R = ρL/A. Doubling L halves A (same volume), so R goes up by 2 × 2 = 4.'
  - q: 'Kirchhoff''s junction rule is a statement of conservation of:'
    choices: ['charge', 'energy', 'momentum']
    ans: 0
    why: 'Charge cannot pile up at a junction, so current in = current out. The loop rule is conservation of energy.'
  - q: 'A Wheatstone bridge is balanced when:'
    choices: ['P/Q = R/S and no current flows through the galvanometer', 'all four resistors are equal only', 'the battery current is zero']
    ans: 0
    why: 'Balance needs only the ratio P/Q = R/S; then both ends of the galvanometer are at the same potential.'
sources:
  - 'NCERT, Physics Part I (Class 12), Current Electricity'
  - 'National Testing Agency, CUET (UG) Physics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 6 · about 20 minutes.** By the end you will solve any resistor network in CUET and handle cells with internal resistance.

<div class="bigidea">A battery is a pump for charge and a resistor is a narrow pipe. Voltage is the push, current is the flow, and resistance is how hard the pipe fights the flow.</div>

**Everyday picture:** a crowded corridor. People (electrons) drift slowly towards the exit, bumping into others all the time, yet the moment the doors open the whole corridor starts moving at once. That is why a lamp lights instantly even though electrons drift at only about a millimetre a second.

## 1. Ohm's law and resistivity

```math
V = IR \qquad R = \rho\frac{L}{A} \qquad I = neAv_d
```

<div class="meaning">

<dl>
<dt>ρ (resistivity)</dt><dd>a property of the material, not the shape. Copper ~1.7 × 10⁻⁸ Ω m; it rises with temperature for metals and falls for semiconductors.</dd>
<dt>v_d (drift velocity)</dt><dd>the slow average speed of electrons along the wire, set by the field and the time between collisions: v_d = eEτ/m.</dd>
<dt>Physical meaning</dt><dd>a long thin wire is like a long thin straw: harder to push through. That is why heater wires are thin and power cables are thick.</dd>
</dl>

</div>

## 2. Combining resistors

<div class="steps" data-title="Shrink any network step by step">
<div class="step"><b>Series</b> (one path): R = R₁ + R₂ + ... The same current flows through each.</div>
<div class="step"><b>Parallel</b> (side by side): 1/R = 1/R₁ + 1/R₂. Two in parallel: R₁R₂/(R₁ + R₂). The same voltage is across each.</div>
<div class="step"><b>Work inward:</b> combine the innermost parallel group first, then the series around it, until one resistor is left.</div>
<div class="step"><b>Then go back out:</b> I = V/R_total from the battery, and share it out branch by branch.</div>
</div>

<div class="problem" data-problem="parallel-resistors"></div>

## 3. Cells and Kirchhoff's rules

A real cell of emf ε has internal resistance r, so the terminal voltage is V = ε − Ir and the current is I = ε/(R + r). Cells in series add emfs and resistances; n identical cells in parallel keep the emf ε and give resistance r/n.

| Rule | Says | Conserves |
|---|---|---|
| Junction | Σ I in = Σ I out | charge |
| Loop | Σ (emf) = Σ (IR) around any closed loop | energy |
| Wheatstone bridge | balanced when P/Q = R/S | used in the metre bridge to find an unknown resistance |
| Power | P = VI = I²R = V²/R | the rate at which electrical energy turns to heat |

<div class="myth">

**"A battery supplies a fixed current."** A battery supplies a (nearly) fixed emf. The current depends on what you connect: I = ε/(R + r). A short circuit (R ≈ 0) gives the largest current, ε/r, and heats the cell.

</div>

**Try it:** Watch the bridge balance.

<figure class="fig" data-fig="@sx-wheatstone-strain"><figcaption>The bridge reads zero when the ratios match.</figcaption></figure>

## 4. Practice

<div class="qbank" data-bank="entrance-physics" data-topics="current-electricity" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- V = IR, R = ρL/A; stretching a wire n times raises R by n².
- Series add R; parallel add 1/R.
- Terminal voltage V = ε − Ir; I = ε/(R + r).
- Kirchhoff: junction (charge), loop (energy). Bridge balanced at P/Q = R/S.

</div>
