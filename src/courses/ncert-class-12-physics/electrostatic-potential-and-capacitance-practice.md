---
title: 'Electrostatic Potential and Capacitance: practice questions'
seoTitle: 'Potential and Capacitance Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Potential and Capacitance: 1, 2, 3 and 5 mark questions, a case study and assertion-reason, with full worked answers.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'A 10 µF capacitor is charged to 20 V. The energy stored is:'
    choices: ['2 mJ', '4 mJ', '0.2 J', '200 J']
    ans: 0
    why: 'U = ½CV² = 0.5 × 10×10⁻⁶ × 400 = 2×10⁻³ J = 2 mJ. Check with ½QV: Q = 200 µC, so 0.5 × 200×10⁻⁶ × 20 = 2 mJ.'
  - q: 'The work done in moving a charge q around a closed path in an electrostatic field is:'
    choices: ['qV', 'zero', 'q E d', 'depends on the path']
    ans: 1
    why: 'The electrostatic force is conservative: the work depends only on the end points, and for a closed path they are the same point, so W = 0.'
  - q: 'The plates of a charged, isolated capacitor are pulled further apart. The energy stored:'
    choices: ['decreases', 'stays the same', 'increases', 'becomes zero']
    ans: 2
    why: 'Q is fixed and C = ε₀A/d falls, so U = Q²/2C rises. The extra energy is the work you did pulling against the attraction of the plates.'
sources:
  - 'CBSE Class 12 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Physics · Chapter 2.** Read the chapter lesson, [Electrostatic Potential and Capacitance](/learn/courses/ncert-class-12-physics/electrostatic-potential-and-capacitance/), first. Try each question on paper before opening the answer, and write the formula, the numbers with units and the answer.

<div class="bigidea">Remember three habits: potential adds as plain numbers (with signs), work equals charge times potential difference, and for capacitors always ask first “is the battery still connected?” That tells you whether V or Q stays fixed.</div>

## How to set out a numerical

1. Draw the circuit or the charges and mark what stays constant.
2. Write the formula in symbols (V = kq/r, C = ε₀A/d, U = ½CV²…).
3. Convert to SI: µF to 10⁻⁶ F, cm to 10⁻² m, nC to 10⁻⁹ C.
4. Give the answer with a unit, and check its size.

<div class="problem" data-problem="c12p-cap-pointv"></div>

<div class="problem" data-problem="c12p-cap-combo"></div>

## 1-mark questions

1. What is the SI unit of capacitance in terms of base units of charge and potential?

<details><summary>Answer</summary>The farad: 1 F = 1 coulomb per volt.</details>

2. What is the potential at a point on the perpendicular bisector of an electric dipole?

<details><summary>Answer</summary>Zero (the potentials of +q and −q cancel there).</details>

3. What is the work done in moving a charge along an equipotential surface?

<details><summary>Answer</summary>Zero, because the potential difference between any two points of it is zero.</details>

4. By what factor does the capacitance of a parallel-plate capacitor change if the distance between the plates is halved?

<details><summary>Answer</summary>It doubles, since C = ε₀A/d.</details>

## 2- and 3-mark questions

5. (2) Why is the electric field always perpendicular to an equipotential surface?

<details><summary>Answer</summary>If E had a component along the surface, a charge moved along it would be acted on by a force along the motion, so work would be done and the potential would change. But the potential on the surface is constant, so E has no component along it: E is perpendicular.</details>

6. (2) Three capacitors of 2 µF, 3 µF and 6 µF are connected in parallel. What is the equivalent capacitance and the charge on each at 10 V?

<details><summary>Answer</summary>

Parallel: C = 2 + 3 + 6 = 11 µF. Each has 10 V: Q = CV gives 20 µC, 30 µC and 60 µC (total 110 µC).

</details>

7. (3) A charge of 2 µC is moved from a point at 100 V to a point at 40 V. Find the work done by the field and say whether the charge was positive or negative at the start for the field to do positive work.

<details><summary>Answer</summary>

Work done by the field `$W = q(V_i - V_f) = 2\times10^{-6}\times(100-40) = 1.2\times10^{-4}$` J. A positive charge moves from higher to lower potential by itself, so the field does positive work on a positive charge.

</details>

8. (3) Find the potential energy of a system of three charges +2 µC, +2 µC and −4 µC at the corners of an equilateral triangle of side 10 cm.

<details><summary>Answer</summary>

Pairs: (2)(2), (2)(−4) and (2)(−4) in µC², each at 0.1 m.

`$U = \dfrac{9\times10^9\times10^{-12}}{0.1}\,[\,4 - 8 - 8\,] = 90\times(-12)\times10^{-3} = -1.08$` J.

The negative sign shows the system is bound.

</details>

9. (3) Two capacitors of 4 µF and 6 µF are joined in series across 100 V. Find the charge and the voltage across each.

<details><summary>Answer</summary>

`$C = \dfrac{4\times6}{4+6} = 2.4$` µF, `$Q = CV = 240$` µC on each. `$V_1 = 240/4 = 60$` V, `$V_2 = 240/6 = 40$` V, which add to 100 V.

</details>

10. (3) A parallel-plate capacitor is charged and the battery removed. A dielectric slab of constant 5 is slipped in. Find the changes in the capacitance, the voltage and the energy.

<details><summary>Answer</summary>

Q is fixed. C becomes 5C. `$V = Q/C$` falls to V/5. `$U = Q^2/2C$` falls to U/5. (The field pulls the slab in, and the lost energy is the work it does.)

</details>

## 5-mark questions (model answers)

11. (5) Derive the expression for the potential at a point due to an electric dipole, at a distance r from its centre, in a direction making an angle θ with the dipole axis (r ≫ a). Find the potential on the axis and on the equatorial line.

<details><summary>Answer</summary>

Let the dipole be ±q at distance a on either side of O, with p = 2qa. P is at distance r from O at angle θ to the axis.

Distances: `$r_1 = PA \approx r - a\cos\theta$` (to +q) and `$r_2 = PB \approx r + a\cos\theta$` (to −q), valid for r ≫ a.

`$V = kq\left(\dfrac1{r_1}-\dfrac1{r_2}\right) = kq\,\dfrac{r_2-r_1}{r_1r_2} = kq\,\dfrac{2a\cos\theta}{r^2-a^2\cos^2\theta}$`

For r ≫ a: `$V = \dfrac{kp\cos\theta}{r^2}$`.

On the axis (θ = 0 or 180°): `$V = \pm kp/r^2$` (positive on the +q side). On the equatorial line (θ = 90°): V = 0.

</details>

12. (5) Derive the capacitance of a parallel-plate capacitor with a dielectric filling the space between the plates. How does the energy stored change if a dielectric is inserted with the battery connected?

<details><summary>Answer</summary>

Plates of area A, separation d, charge ±Q, so surface density σ = Q/A. Without a dielectric `$E_0 = \sigma/\varepsilon_0$`. The slab’s bound charges reduce this to `$E = E_0/\kappa = Q/(\kappa\varepsilon_0A)$`.

`$V = Ed = \dfrac{Qd}{\kappa\varepsilon_0A}$`, so `$C = \dfrac{Q}{V} = \dfrac{\kappa\varepsilon_0A}{d}$`.

With the battery connected V is fixed. C becomes κC, so `$U = \tfrac12CV^2$` becomes κ times larger: the battery supplies extra charge (Q → κQ) and extra energy.

</details>

13. (5) Show that the energy stored in a capacitor is `$\tfrac12CV^2$`. A 12 µF capacitor charged to 50 V is connected across an uncharged 8 µF capacitor. Find the common voltage and the loss of energy.

<details><summary>Answer</summary>

When charge q is on the plates the voltage is q/C. Moving a further dq needs work dW = (q/C) dq. Total work (area of the triangle) `$U = \int_0^Q \dfrac qC dq = \dfrac{Q^2}{2C} = \tfrac12CV^2$`.

Numerical: initial charge `$Q = 12\times50 = 600$` µC. After joining, `$V = 600/(12+8) = 30$` V.

Initial energy `$U_i = \tfrac12\times12\times10^{-6}\times50^2 = 15$` mJ. Final energy `$U_f = \tfrac12\times20\times10^{-6}\times30^2 = 9$` mJ.

Loss = 15 − 9 = 6 mJ, converted to heat and radiation (and a spark) in the connecting wires.

</details>

## Case-based question

14. **The camera flash.** A camera flash uses a 100 µF capacitor charged by a small battery circuit to 300 V. When you press the button the capacitor discharges through the flash tube in about 1 ms. The charging takes a few seconds, which is why the flash is not ready at once.

(a) (1) Calculate the energy stored.

(b) (1) Estimate the average power delivered during the flash.

(c) (1) Why is a capacitor, not the battery itself, used to give the flash?

(d) (1) The same capacitor is charged to only 150 V. By what factor does the stored energy change?

<details><summary>Answer</summary>

(a) `$U = \tfrac12CV^2 = 0.5\times100\times10^{-6}\times300^2 = 4.5$` J.

(b) `$P = U/t = 4.5/10^{-3} = 4500$` W (4.5 kW), far more than a small battery can supply at once.

(c) A capacitor can store the energy slowly (low power while charging) and release it very quickly (high power), but a small battery has too much internal resistance to give such a large current.

(d) U ∝ V², so halving V makes the energy one quarter.

</details>

## Assertion-reason questions

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

15. **A:** The electric field at the centre of a charged ring is zero but the potential is not. **R:** Potential is a scalar and the potentials of all the pieces of the ring add.

<details><summary>Answer</summary>(A) Both true and R explains A: pieces on opposite sides give equal and opposite fields, which cancel, while their potentials have the same sign and add.</details>

16. **A:** The capacitance of a capacitor increases when a dielectric is placed between its plates. **R:** The dielectric increases the potential difference between the plates.

<details><summary>Answer</summary>(C) A is true. R is false: the dielectric reduces the field and so the potential difference (for a given charge), which is why C = Q/V increases.</details>

17. **A:** No work is done in moving a test charge over an equipotential surface. **R:** The electric field at every point of an equipotential surface is zero.

<details><summary>Answer</summary>(C) A is true. R is false: the field is generally not zero on an equipotential surface; it is perpendicular to the surface, so the force does no work along it.</details>

## Question set from the bank

New numbers and questions each time. Check your answer, read the hint if you are stuck, then compare with the full solution.

<div class="qbank" data-bank="ncert-class-12-physics" data-topics="electrostatic-potential-and-capacitance" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- V = kq/r, add as numbers; W = qΔV; E = −dV/dl; uniform field ΔV = Ed.
- Equipotentials: no work along them, E perpendicular, never cross.
- U(pair) = kq₁q₂/r; system = sum over pairs; dipole U = −pE cos θ.
- Conductor: E = 0 inside, one potential, E = σ/ε₀ outside.
- C = ε₀A/d, with dielectric κε₀A/d. Series 1/C adds (same Q); parallel C adds (same V).
- U = ½CV² = Q²/2C. Battery on: V fixed. Battery off: Q fixed.

</div>
