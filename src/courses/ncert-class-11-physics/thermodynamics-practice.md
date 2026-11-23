---
title: 'Thermodynamics: practice questions'
seoTitle: 'Thermodynamics Class 11 questions with answers'
summary: 'Board-style practice for Class 11 Thermodynamics: 1 to 5 mark questions, a case study and assertion-reason questions with worked answers.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'In an isochoric process the heat absorbed by a gas is equal to:'
    choices: ['the work done by the gas', 'the change in its internal energy', 'zero', 'P times the change in volume']
    ans: 1
    why: 'With V fixed, W = 0, so Q = ΔU.'
  - q: 'A refrigerator with COP 4 removes 800 J from the cold space in one cycle. The work supplied is:'
    choices: ['3200 J', '200 J', '800 J', '1000 J']
    ans: 1
    why: 'W = Qc/COP = 800/4 = 200 J.'
  - q: 'The P–V diagram of a cyclic process is a loop. The net work done in one cycle is:'
    choices: ['zero', 'the area enclosed by the loop', 'the change in internal energy', 'the heat rejected']
    ans: 1
    why: 'W = ∮P dV equals the enclosed area. ΔU = 0 over a cycle, so net heat equals this work.'
sources:
  - 'CBSE Class 11 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 11.** Read the chapter lesson, [Thermodynamics](/learn/courses/ncert-class-11-physics/thermodynamics/), first. Try each question on paper before opening the answer.

<div class="bigidea">For any process write Q = ΔU + W first, then fill in what the process fixes: isochoric W = 0, isothermal ΔU = 0, adiabatic Q = 0, isobaric W = PΔV. Engines and fridges just count the energy that goes in and out per cycle.</div>

## How to set out a numerical

1. Name the process and write what it fixes (V, P, T or Q).
2. Write Q = ΔU + W and the formula for the quantity you need.
3. Use kelvin and SI units, substitute and give the answer with its unit and sign.

<div class="problem" data-problem="c11p-tdyn-isothermal"></div>

<div class="problem" data-problem="c11p-tdyn-carnot"></div>

## 1-mark questions

1. State the zeroth law of thermodynamics.

<details><summary>Answer</summary>If two systems are each in thermal equilibrium with a third, they are in thermal equilibrium with each other.</details>

2. What is the change in internal energy of an ideal gas in an isothermal process?

<details><summary>Answer</summary>Zero, since U depends only on temperature.</details>

3. Name the process in which no heat enters or leaves the system.

<details><summary>Answer</summary>Adiabatic.</details>

4. Is it possible to have an engine with 100 % efficiency?

<details><summary>Answer</summary>No. It would violate the Kelvin-Planck form of the second law.</details>

## 2- and 3-mark questions

5. (2) State the first law of thermodynamics and write it as an equation.

<details><summary>Answer</summary>The heat supplied to a system equals the increase in its internal energy plus the work done by it: Q = ΔU + W.</details>

6. (2) Why is a gas cooler after it expands adiabatically?

<details><summary>Answer</summary>No heat enters, so the work done by the gas comes from its internal energy: W = −ΔU, so U and hence T fall.</details>

7. (3) 2 mol of an ideal monatomic gas is heated at constant volume from 300 K to 400 K. Find the heat supplied. (R = 8.31 J/mol K.)

<details><summary>Answer</summary>

Q = nCvΔT = 2 × (3/2 × 8.31) × 100 = **2493 J**, since no work is done.

</details>

8. (3) A gas absorbs 600 J of heat and its internal energy rises by 250 J. Find the work done by the gas and say whether it expands or is compressed.

<details><summary>Answer</summary>

W = Q − ΔU = 600 − 250 = **350 J**, positive: the gas expands and does work.

</details>

## 5-mark questions

9. (5) Derive an expression for the work done by an ideal gas in an isothermal expansion from V₁ to V₂ and explain why the heat absorbed equals the work.

<details><summary>Answer</summary>

For n moles at constant T, P = nRT/V. The work is

`$W = \int_{V_1}^{V_2}P\,dV = nRT\int_{V_1}^{V_2}\dfrac{dV}{V} = nRT\ln\dfrac{V_2}{V_1}$`.

For an ideal gas U depends only on T, so ΔU = 0 at constant temperature. The first law Q = ΔU + W then gives Q = W: all the heat absorbed is converted into work.

</details>

10. (5) Describe the working of a Carnot engine in four steps, draw its P–V diagram and show that its efficiency is 1 − T₂/T₁.

<details><summary>Answer</summary>

Sketch: two isotherms (1→2 at T₁, 3→4 at T₂) joined by two adiabats (2→3, 4→1).

1→2: isothermal expansion; heat Q₁ = nRT₁ ln(V₂/V₁) absorbed.
2→3: adiabatic expansion; T falls from T₁ to T₂.
3→4: isothermal compression; heat Q₂ = nRT₂ ln(V₃/V₄) rejected.
4→1: adiabatic compression; T rises from T₂ to T₁.

For the adiabats T₁V₂^(γ−1) = T₂V₃^(γ−1) and T₁V₁^(γ−1) = T₂V₄^(γ−1), so V₂/V₁ = V₃/V₄. Dividing the heats, Q₂/Q₁ = T₂/T₁.

η = 1 − Q₂/Q₁ = **1 − T₂/T₁**.

</details>

## Case-based question

A power station boils water at 500 K and rejects waste heat to a river at 300 K. It takes 2 × 10⁹ J of heat per second from the boiler.

(a) Find the maximum possible efficiency. (b) Find the maximum power output. (c) The real plant delivers 6 × 10⁸ W. What is its efficiency? (d) How much heat per second goes to the river?

<details><summary>Answer</summary>

(a) η = 1 − 300/500 = **0.40** (40 %).

(b) P<sub>max</sub> = 0.40 × 2 × 10⁹ = **8 × 10⁸ W**.

(c) η = 6 × 10⁸ / 2 × 10⁹ = **0.30**, below the Carnot limit, as it must be.

(d) Heat to the river = 2 × 10⁹ − 6 × 10⁸ = **1.4 × 10⁹ J/s**.

</details>

## Assertion and reason

Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.

11. **A:** Heat given to a gas at constant pressure is greater than at constant volume for the same rise in temperature. **R:** At constant pressure the gas also does work in expanding.

<details><summary>Answer</summary>(a). Cp − Cv = R is the extra heat for that work.</details>

12. **A:** The efficiency of a Carnot engine can be increased by lowering the temperature of the cold reservoir. **R:** η = 1 − T꜀/Tₕ.

<details><summary>Answer</summary>(a). Lowering T꜀ reduces T꜀/Tₕ, so η increases.</details>

13. **A:** A refrigerator can cool a room if its door is left open. **R:** A refrigerator transfers heat from the cold space to the hot space.

<details><summary>Answer</summary>(d). A is false: the fridge rejects Qc + W into the room, warming it. R is true.</details>

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="thermodynamics" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Q = ΔU + W; ΔU = nCvΔT for any process of an ideal gas.
- Isothermal: Q = W = nRT ln(V₂/V₁). Adiabatic: Q = 0, PV^γ constant.
- Cycle: ΔU = 0, net work = loop area = Qh − Qc.
- η = 1 − Tc/Th (Carnot), COP = Tc/(Th − Tc).

</div>
