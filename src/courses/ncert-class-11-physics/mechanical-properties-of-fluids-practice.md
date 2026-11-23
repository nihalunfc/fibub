---
title: 'Mechanical Properties of Fluids: practice questions'
seoTitle: 'Mechanical Properties of Fluids Class 11 questions answers'
summary: 'Board-style practice for Class 11 Mechanical Properties of Fluids: 1 to 5 mark questions, a case study and assertion-reason questions with worked answers.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'A hydraulic lift has pistons of area 5 cm² and 500 cm². A force of 20 N on the small piston can lift a load of:'
    choices: ['200 N', '2000 N', '2 N', '100 N']
    ans: 1
    why: 'F₂ = F₁ × A₂/A₁ = 20 × 500/5 = 2000 N.'
  - q: 'Two soap bubbles have radii r and 2r. The excess pressure inside the smaller one compared with the larger is:'
    choices: ['the same', 'twice as large', 'half as large', 'four times as large']
    ans: 1
    why: 'ΔP = 4S/r, so halving the radius doubles the excess pressure.'
  - q: 'The terminal velocity of a small sphere in a viscous fluid is proportional to:'
    choices: ['r', 'r²', 'r³', '1/r']
    ans: 1
    why: 'v_t = 2r²(ρ − σ)g/(9η) is proportional to r².'
sources:
  - 'CBSE Class 11 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 9.** Read the chapter lesson, [Mechanical Properties of Fluids](/learn/courses/ncert-class-11-physics/mechanical-properties-of-fluids/), first. Try each question on paper before opening the answer.

<div class="bigidea">Fluid numericals come in four families: pressure at depth (ρgh), forces on pistons (equal pressure), flow (A₁v₁ = A₂v₂ then Bernoulli) and surface effects (S, r, θ). Decide the family first, then write its formula.</div>

## How to set out a numerical

1. Write the given data in SI units (cm to m, cm² to m², g/cm³ to kg/m³).
2. Name the principle: Pascal, hydrostatic pressure, continuity, Bernoulli, Stokes, capillary rise.
3. Write the formula in symbols, substitute with units, and give the answer with its unit.

<div class="problem" data-problem="c11p-fluid-depth"></div>

<div class="problem" data-problem="c11p-fluid-stokes"></div>

## 1-mark questions

1. State Pascal’s law.

<details><summary>Answer</summary>Pressure applied to an enclosed fluid is transmitted undiminished to every part of the fluid and to the walls of the container.</details>

2. What is the SI unit of the coefficient of viscosity?

<details><summary>Answer</summary>Pascal second (Pa s), equivalent to N s/m².</details>

3. Why is mercury, not water, used in a barometer?

<details><summary>Answer</summary>Mercury is 13.6 times denser, so the column is only about 76 cm instead of 10.3 m.</details>

4. What happens to the surface tension of water as the temperature rises?

<details><summary>Answer</summary>It decreases.</details>

## 2- and 3-mark questions

5. (2) State the equation of continuity and name the principle behind it.

<details><summary>Answer</summary>A₁v₁ = A₂v₂ for an incompressible fluid in steady flow. It expresses conservation of mass.</details>

6. (2) Why does a small rain-drop fall more slowly than a big one?

<details><summary>Answer</summary>The terminal velocity is proportional to r², so a smaller radius gives a much smaller terminal speed.</details>

7. (3) A tank of water is 4 m deep. Find the gauge pressure and the total pressure at the bottom. (ρ = 1000 kg/m³, g = 10 m/s², P₀ = 1 × 10⁵ Pa.)

<details><summary>Answer</summary>

Gauge pressure = ρgh = 1000 × 10 × 4 = 4 × 10⁴ Pa. Total = 1 × 10⁵ + 0.4 × 10⁵ = **1.4 × 10⁵ Pa**.

</details>

8. (3) Water flows at 2 m/s in a pipe of diameter 8 cm. The pipe narrows to 4 cm. Find the speed in the narrow part and the fall in pressure. (ρ = 1000 kg/m³.)

<details><summary>Answer</summary>

Area ratio A₁/A₂ = (8/4)² = 4, so v₂ = 2 × 4 = **8 m/s**.

ΔP = ½ρ(v₂² − v₁²) = 500 × (64 − 4) = 30 000 Pa = **30 kPa** (lower in the narrow part).

</details>

## 5-mark questions

9. (5) Derive Bernoulli’s equation from the work-energy theorem.

<details><summary>Answer</summary>

Take a steady, non-viscous, incompressible flow in a pipe, from section 1 (area A₁, speed v₁, pressure P₁, height h₁) to section 2. In time dt a volume dV = A₁v₁dt = A₂v₂dt enters at 1 and the same leaves at 2.

Work by pressure forces: P₁A₁(v₁dt) − P₂A₂(v₂dt) = (P₁ − P₂)dV.

Change in kinetic energy: ½ρdV(v₂² − v₁²). Change in potential energy: ρdVg(h₂ − h₁).

Work = total change in energy:

`$(P_1-P_2)\,dV = \tfrac12\rho\,dV(v_2^2-v_1^2) + \rho\,dV\,g(h_2-h_1)$`

Divide by dV and rearrange: `$P_1 + \tfrac12\rho v_1^2 + \rho g h_1 = P_2 + \tfrac12\rho v_2^2 + \rho g h_2$`.

</details>

10. (5) Obtain an expression for the height to which a liquid rises in a capillary tube. Why does mercury behave differently?

<details><summary>Answer</summary>

Let the tube of radius r be dipped in a liquid of surface tension S and angle of contact θ. The liquid rises to h.

Upward force from surface tension on the circle of contact: 2πr S cos θ.

Weight of the column above the outside level: πr²hρg (the meniscus volume is ignored).

For equilibrium 2πrS cos θ = πr²hρg, so `$h = \dfrac{2S\cos\theta}{r\rho g}$`.

For mercury on glass θ is about 140°, so cos θ is negative and h is negative: the mercury is depressed below the outside level, because its cohesion is stronger than its adhesion to glass.

</details>

## Case-based question

A school lab has a glass tube of inner radius 0.5 mm. Water (S = 0.07 N/m, θ ≈ 0°) rises in it. A mercury barometer in the same lab reads 75 cm. Take ρ(water) = 1000 kg/m³, ρ(Hg) = 13 600 kg/m³, g = 10 m/s².

(a) Find the capillary rise in the tube. (b) What would it be in a tube of radius 0.25 mm? (c) Find the atmospheric pressure in pascal. (d) A student says water would also work in the barometer. How tall would it need to be?

<details><summary>Answer</summary>

(a) h = 2S cos θ/(rρg) = 2 × 0.07 / (0.5 × 10⁻³ × 1000 × 10) = 0.14/5 = 0.028 m = **2.8 cm**.

(b) h ∝ 1/r, so for half the radius h = **5.6 cm**.

(c) P₀ = ρgh = 13600 × 10 × 0.75 = **1.02 × 10⁵ Pa**.

(d) h = P₀/(ρg) = 1.02 × 10⁵ / (1000 × 10) = **10.2 m**, far too tall to be practical.

</details>

## Assertion and reason

Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.

11. **A:** A person standing in a bus feels pressure on the eardrums from the inside equal to the outside. **R:** In a fluid at rest, pressure at the same level is the same in all directions.

<details><summary>Answer</summary>(b). Both statements are true, but the ear equalises because of the air passage (the Eustachian tube), not because of the directional property of pressure.</details>

12. **A:** Two boats moving side by side close together may collide. **R:** The speed of water between them is greater, so the pressure there is lower.

<details><summary>Answer</summary>(a). Bernoulli’s principle: the faster water between the boats has lower pressure, so the higher pressure outside pushes them together.</details>

13. **A:** The surface tension of a liquid is the same at all temperatures. **R:** Surface tension depends on the intermolecular forces.

<details><summary>Answer</summary>(d). A is false: S falls as temperature rises (the molecules move more and pull less). R is true.</details>

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="mechanical-properties-of-fluids" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Pressure at depth: P = P₀ + ρgh. Pistons: F₁/A₁ = F₂/A₂.
- Continuity A₁v₁ = A₂v₂ and Bernoulli P + ½ρv² + ρgh = constant: fast means low pressure.
- Stokes: F = 6πηrv, v_t = 2r²(ρ − σ)g/(9η).
- Excess pressure: 2S/r (drop), 4S/r (bubble). Capillary rise h = 2S cos θ/(rρg).

</div>
