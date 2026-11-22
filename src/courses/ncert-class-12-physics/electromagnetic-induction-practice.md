---
title: 'Electromagnetic Induction: practice questions'
seoTitle: 'Electromagnetic Induction Class 12 questions'
summary: 'Board-style practice for Class 12 Electromagnetic Induction: 1, 2, 3 and 5 mark questions, case-based and assertion-reason questions with worked answers.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'A conducting rod of length 0.5 m moves at 4 m/s at right angles to a field of 0.3 T, both at right angles to the rod. The induced emf is:'
    choices: ['0.6 V', '0.06 V', '6 V', '1.5 V']
    ans: 0
    why: 'ε = Blv = 0.3 × 0.5 × 4 = 0.6 V.'
  - q: 'The energy stored in an inductor of 2 H carrying 3 A is:'
    choices: ['9 J', '6 J', '18 J', '3 J']
    ans: 0
    why: 'U = ½LI² = ½ × 2 × 9 = 9 J.'
  - q: 'Laminated cores are used in transformers to reduce:'
    choices: ['eddy current loss', 'the primary current', 'the voltage', 'the frequency']
    ans: 0
    why: 'Thin insulated sheets break the metal into narrow paths, so the large eddy-current loops (and the heat they produce) are avoided.'
sources:
  - 'CBSE Class 12 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Physics · Chapter 6.** Read the chapter lesson, [Electromagnetic Induction](/learn/courses/ncert-class-12-physics/electromagnetic-induction/), first. Try each question on paper before opening the answer.

<div class="bigidea">Two questions solve most problems here: "how is the flux changing?" and "which way does the induced current have to push back?" Write Φ, find dΦ/dt, put in N, and use Lenz's law only for the direction. For a moving rod use ε = Blv; for a coil, L = μ₀N²A/l and U = ½LI².</div>

## How to set out a numerical

1. Write the flux Φ = BA cos θ in terms of the quantity that changes (B, A or θ) and find ΔΦ or dΦ/dt.
2. Use ε = N ΔΦ/Δt for the size; put in SI units (cm² to m², mWb to Wb).
3. Use Lenz's law for the direction: the induced current opposes the change in flux.
4. Give the answer with its unit.

## 1-mark questions

1. State Lenz's law.
<details><summary>Answer</summary>The direction of an induced current is such that it opposes the change in flux that produces it.</details>

2. Give the SI unit of inductance and say how it is defined.
<details><summary>Answer</summary>The henry (H). 1 H = 1 Wb/A = 1 V s/A: the inductance for which a current changing at 1 A/s induces an emf of 1 V.</details>

3. Name the conservation law on which Lenz's law is based.
<details><summary>Answer</summary>Conservation of energy.</details>

4. Why does a magnet at rest inside a coil induce no current?
<details><summary>Answer</summary>The flux through the coil is steady, so dΦ/dt = 0 and the emf is zero.</details>

## 2-mark and 3-mark questions

5. A coil of 200 turns has the flux through it fall from 4 mWb to 1 mWb in 0.05 s. Find the average emf. *(2 marks)*
<details><summary>Answer</summary>ε = N ΔΦ/Δt = 200 × 3×10⁻³ ÷ 0.05 = 12 V.</details>

6. A rod 60 cm long moves at 3 m/s at right angles to a field of 0.4 T. Find the emf across it. *(2 marks)*
<details><summary>Answer</summary>ε = Blv = 0.4 × 0.6 × 3 = 0.72 V.</details>

7. A circular coil of radius 10 cm and 50 turns is turned from a position where its plane is perpendicular to a field of 0.2 T to one where it is parallel to the field in 0.1 s. Find the average emf. *(3 marks)*
<details><summary>Answer</summary>

Area A = π(0.1)² = 3.14×10⁻² m². Initial flux = BA cos 0° = 0.2 × 3.14×10⁻² = 6.28×10⁻³ Wb; final flux = 0. ε = N ΔΦ/Δt = 50 × 6.28×10⁻³ ÷ 0.1 = 3.14 V.

</details>

8. Explain why a metal plate swinging between the poles of a magnet is quickly brought to rest, but one with slots cut in it is not. *(3 marks)*
<details><summary>Answer</summary>The changing flux induces eddy currents in the plate, and by Lenz's law they oppose its motion, braking it (its kinetic energy becomes heat). Slots cut the plate into narrow strips and break up the large current loops, so the eddy currents and their braking effect are much smaller.</details>

9. Find the self-inductance of a solenoid of 500 turns, length 25 cm and cross-section 4 cm². *(3 marks)*
<details><summary>Answer</summary>L = μ₀N²A/l = 4π×10⁻⁷ × 500² × 4×10⁻⁴ ÷ 0.25 = 5.0×10⁻⁴ H = 0.50 mH.</details>

10. A 50 mH inductor carries 4 A. How much energy is stored in it? *(2 marks)*
<details><summary>Answer</summary>U = ½LI² = ½ × 0.05 × 16 = 0.40 J.</details>

Fresh numbers every time: try these until you get three right in a row.

<div class="problem" data-problem="c12p-emi-faraday"></div>

<div class="problem" data-problem="c12p-emi-rl"></div>

## 5-mark questions

11. A rod of length l moves at speed v on rails in a field B perpendicular to the plane of the rails, with a resistance R across the rails. Derive expressions for (a) the emf, (b) the force needed to keep it moving at constant speed, and (c) show that the mechanical power supplied equals the electrical power dissipated. *(5 marks)*
<details><summary>Model answer</summary>

(a) In time dt the rod moves dx = v dt and the area of the loop changes by l dx, so Φ = Blx and ε = dΦ/dt = Blv.

(b) The current is I = Blv/R. The rod, carrying I in the field, feels a force F = BIl = B²l²v/R opposing its motion (Lenz's law), so an equal external force is needed.

(c) Mechanical power: P = Fv = B²l²v²/R. Electrical power in R: I²R = (Blv/R)²R = B²l²v²/R. They are equal: energy is conserved.

</details>

12. Derive an expression for the self-inductance of a long solenoid. Show how it changes if the solenoid is filled with an iron core. *(5 marks)*
<details><summary>Model answer</summary>

A solenoid of length l, area A and n turns per unit length carries current I. B = μ₀nI inside, so the flux through one turn is BA, and the flux linked with all N = nl turns is NBA = μ₀n²AlI. As Φ_linked = LI, L = μ₀n²Al = μ₀N²A/l.

With a core of relative permeability μr, B becomes μrμ₀nI, so L = μrμ₀n²Al: it is multiplied by μr, which can be hundreds or thousands for soft iron.

</details>

13. An AC generator has a coil of N turns and area A rotating at angular speed ω in a uniform field B. (a) Obtain the expression for the induced emf. (b) State the position of the coil when the emf is maximum and when it is zero. *(5 marks)*
<details><summary>Model answer</summary>

(a) If the normal makes an angle θ = ωt with B (taking θ = 0 at t = 0), the flux is Φ = NBA cos ωt. ε = −dΦ/dt = NBAω sin ωt = ε₀ sin ωt, with ε₀ = NBAω.

(b) The emf is maximum when sin ωt = ±1: the plane of the coil is parallel to the field (flux zero but changing fastest). It is zero when the plane is perpendicular to the field (flux maximum, but not changing at that moment).

</details>

14. Define mutual inductance. Two long coaxial solenoids, one inside the other, have the same length l. The inner has N₁ turns and radius r₁; the outer has N₂ turns. Find the mutual inductance. *(5 marks)*
<details><summary>Model answer</summary>

Mutual inductance M is defined by Φ₂ = MI₁: the flux linked with coil 2 per unit current in coil 1 (the emf induced in coil 2 is −M dI₁/dt). The inner solenoid carries I₁ and makes B₁ = μ₀(N₁/l)I₁ inside, and (nearly) zero outside it. The flux through each turn of the outer solenoid is B₁ × πr₁². The flux linked with all N₂ turns is N₂B₁πr₁² = μ₀N₁N₂πr₁²I₁/l. Therefore M = μ₀N₁N₂πr₁²/l.

</details>

## Case-based question

A bicycle dynamo has a coil of 400 turns, each of area 6 cm², spinning in a field of 0.1 T. Ravi pedals so that the coil turns at 20 revolutions per second. The lamp it lights has a resistance of 15 Ω.

15. (a) Find the angular speed. (b) Find the peak emf. (c) Find the peak current in the lamp (ignore the coil's own resistance). (d) What happens to the peak emf if Ravi pedals twice as fast?
<details><summary>Answer</summary>

(a) ω = 2πf = 2π × 20 = 126 rad/s.

(b) ε₀ = NBAω = 400 × 0.1 × 6×10⁻⁴ × 126 = 3.0 V.

(c) I₀ = ε₀/R = 3.0 ÷ 15 = 0.20 A.

(d) ε₀ ∝ ω, so it doubles to about 6 V (and the frequency doubles too, so the lamp flickers faster).

</details>

## Assertion and reason

16. **A:** An emf is induced in a coil when the magnetic field through it is changing. **R:** The flux through the coil changes when B changes.
<details><summary>Answer</summary>Both A and R are true, and R is the correct explanation of A: ε = −N dΦ/dt, and Φ = BA cos θ changes when B changes.</details>

17. **A:** A magnet dropped through a long closed copper tube falls slower than one dropped through a plastic tube. **R:** Eddy currents in the copper oppose the motion of the magnet.
<details><summary>Answer</summary>Both A and R are true, and R is the correct explanation of A. By Lenz's law the eddy currents make a field that opposes the magnet's motion. The plastic tube is an insulator, so no eddy currents flow.</details>

18. **A:** The emf of an AC generator is zero when the plane of its coil is perpendicular to the field. **R:** The flux through the coil is zero at that moment.
<details><summary>Answer</summary>A is true, R is false. The flux is at its <i>maximum</i> there, and it is momentarily not changing, so dΦ/dt = 0 and the emf is zero.</details>

## Question set: check yourself one by one

Answer each question, check it, and open the full solution. Questions start easy and get harder.

<div class="qbank" data-bank="ncert-class-12-physics" data-topics="electromagnetic-induction" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Φ = BA cos θ; ε = −N dΦ/dt; induced charge Δq = NΔΦ/R. Lenz: the induced current opposes the change.
- Moving rod: ε = Blv; F = B²l²v/R; mechanical power Fv = electrical power I²R.
- Eddy currents: brake motion, heat metal; laminations reduce them.
- ε₂ = −M dI₁/dt and ε = −L dI/dt; L = μ₀N²A/l; U = ½LI²; LR rise: I = (V/R)(1 − e^(−t/τ)), τ = L/R.
- AC generator: ε = NBAω sin ωt; zero when the coil faces the field, greatest when parallel to it.

</div>
