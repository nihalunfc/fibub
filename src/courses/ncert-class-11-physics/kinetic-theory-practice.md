---
title: 'Kinetic Theory: practice questions'
seoTitle: 'Kinetic Theory Class 11 questions with answers'
summary: 'Class 11 Kinetic Theory practice: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full worked answers.'
minutes: 50
updated: 2026-11-23
quiz:
  - q: 'At the same temperature, which gas has the larger rms speed of molecules?'
    choices: ['oxygen', 'nitrogen', 'hydrogen', 'carbon dioxide']
    ans: 2
    why: 'v_rms = √(3kT/m) is largest for the smallest molecular mass, which is hydrogen.'
  - q: 'The internal energy of 2 mol of a monatomic ideal gas at temperature T is:'
    choices: ['3RT', '3RT/2', 'RT', '5RT']
    ans: 0
    why: 'U = (f/2) n R T = (3/2) × 2 × RT = 3RT.'
  - q: 'The mean free path of the molecules of a gas is doubled when:'
    choices: ['the pressure is halved at constant T', 'the pressure is doubled at constant T', 'the molecular diameter is doubled', 'the temperature is halved at constant P']
    ans: 0
    why: 'λ = k_BT/(√2 π d² P): at fixed T, halving the pressure doubles λ.'
sources:
  - 'CBSE Class 11 Physics question paper design (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 12.** Read the lesson, [Kinetic Theory](/learn/courses/ncert-class-11-physics/kinetic-theory/), first. Try each question on paper, then open the answer. Marks go for the law, the formula, the substitution with units and the answer.

<div class="bigidea">Kinetic theory questions nearly always need three steps: change to kelvin and SI units, pick the right link (PV = nRT, ½mv² = 3kT/2, U = fnRT/2 or λ = 1/√2πd²n), and then compare gases by what changes (mass, temperature, number of molecules).</div>

## How to set out a numerical

1. Convert: °C to K (add 273), litres to m³ (÷ 1000), g/mol to kg/mol (÷ 1000), atm to Pa (× 1.01 × 10⁵).
2. Write the formula in symbols first, then substitute with units.
3. For comparisons, write the ratio formula (for example v_rms ∝ √(T/M)) and cancel what is the same.

<div class="problem" data-problem="c11p-kin-rms"></div>

<div class="problem" data-problem="c11p-kin-cv"></div>

## 1-mark questions

1. State Boyle’s law.

<details><summary>Answer</summary>At constant temperature the pressure of a fixed mass of gas is inversely proportional to its volume: PV = constant.</details>

2. What is the SI unit of the Boltzmann constant?

<details><summary>Answer</summary>Joule per kelvin (J/K).</details>

3. How many degrees of freedom has a monatomic gas molecule?

<details><summary>Answer</summary>Three, all translational.</details>

4. Why do molecules of a gas fill the whole container?

<details><summary>Answer</summary>The intermolecular forces are negligible and the molecules move freely and randomly in all directions, so they spread out until they meet the walls.</details>

## 2- and 3-mark questions

5. (2) Write the four assumptions about molecules made in the kinetic theory of an ideal gas.

<details><summary>Answer</summary>(i) Very many identical molecules moving randomly in all directions at all speeds. (ii) The molecules’ own volume is negligible compared with the container. (iii) No forces between molecules except during collisions, so straight-line motion between them. (iv) All collisions are elastic and of negligible duration.</details>

6. (2) Does the pressure of a gas depend on the shape of its container? Explain.

<details><summary>Answer</summary>No. The pressure is the force per area from molecular impacts, P = ⅓ρ⟨v²⟩, which depends only on the density and the mean square speed, not on the shape.</details>

7. (3) Show that the average kinetic energy of a molecule is proportional to the absolute temperature.

<details><summary>Answer</summary>

From kinetic theory `$PV = \tfrac13 Nm\langle v^2\rangle$`. For an ideal gas `$PV = Nk_BT$`. Equating, `$\tfrac13 m\langle v^2\rangle = k_BT$`, so the mean kinetic energy per molecule is `$\tfrac12 m\langle v^2\rangle = \tfrac32 k_BT$`. It is proportional to T and does not depend on the mass or the kind of gas.

</details>

8. (3) The rms speed of hydrogen molecules at a certain temperature is v. What is the rms speed of oxygen molecules (M = 32) at the same temperature, if hydrogen has M = 2?

<details><summary>Answer</summary>

`$v_{\text{rms}} \propto 1/\sqrt{M}$` at fixed T, so `$v_{O}/v_{H} = \sqrt{2/32} = 1/4$`. The rms speed of oxygen is **v/4**.

</details>

9. (3) Calculate the total internal energy of 3 mol of a diatomic gas at 300 K (rigid molecules, R = 8.31 J/(mol K)).

<details><summary>Answer</summary>

f = 5, so `$U = \tfrac f2 nRT = \tfrac52 \times 3 \times 8.31 \times 300 = 18{,}700$` J (about 18.7 kJ).

</details>

## 5-mark questions

10. (5) Derive an expression for the pressure of an ideal gas from kinetic theory.

<details><summary>Answer</summary>

Take N molecules, each of mass m, in a cube of side L. A molecule with velocity component `$v_x$` hits the right wall and rebounds with `$-v_x$`. Momentum given to the wall per hit: `$2mv_x$`. It crosses the box and returns in `$2L/v_x$`, so hits per second `$= v_x/2L$`. Average force from this molecule: `$2mv_x \times v_x/2L = mv_x^2/L$`.

For all molecules, `$F = \dfrac mL\sum v_x^2 = \dfrac{Nm\langle v_x^2\rangle}{L}$`. By symmetry `$\langle v_x^2\rangle = \tfrac13\langle v^2\rangle$`. Pressure `$P = F/L^2$`:

`$P = \dfrac{Nm\langle v^2\rangle}{3L^3} = \dfrac13\dfrac NV m\langle v^2\rangle = \dfrac13\rho\langle v^2\rangle$`.

</details>

11. (5) State the law of equipartition of energy. Use it to find C<sub>v</sub>, C<sub>p</sub> and γ for (a) a monatomic and (b) a rigid diatomic gas.

<details><summary>Answer</summary>

**Law:** in equilibrium at temperature T, every degree of freedom contributes on average ½k<sub>B</sub>T of energy per molecule (½RT per mole).

(a) Monatomic, f = 3: `$U = \tfrac32RT$`, `$C_v = \tfrac32R$`, `$C_p = C_v + R = \tfrac52R$`, `$\gamma = 5/3$`.

(b) Rigid diatomic, f = 5 (3 translational + 2 rotational): `$U = \tfrac52RT$`, `$C_v = \tfrac52R$`, `$C_p = \tfrac72R$`, `$\gamma = 7/5$`.

</details>

## Case-based question

12. (4) **The air in a bicycle tyre.** A student measures a tyre. Its volume is 2.0 litres. The gauge shows the air at 3 atm (absolute) and 27 °C. After a long ride the tyre warms to 57 °C. (Take the volume as fixed.)

(a) How many moles of air are in the tyre? (R = 0.0821 L atm/(mol K)) (b) What is the new pressure? (c) Why does the pressure rise, in terms of molecules? (d) What happens to the average kinetic energy of a molecule?

<details><summary>Answer</summary>

(a) `$n = PV/RT = 3 \times 2/(0.0821 \times 300) = 0.24$` mol.

(b) V and n fixed, so `$P/T$` is constant: `$P' = 3 \times 330/300 = 3.3$` atm.

(c) The molecules move faster, so each hits the wall harder and more often.

(d) It increases in the ratio 330/300 = 1.1, because the mean kinetic energy is 3k<sub>B</sub>T/2.

</details>

## Assertion and reason

13. **Assertion (A):** The pressure of a gas in a closed vessel is the same on all the walls. **Reason (R):** Molecules move randomly, so on average no direction is preferred.

<details><summary>Answer</summary>(a) Both true and R explains A. Random motion makes ⟨vx²⟩ = ⟨vy²⟩ = ⟨vz²⟩, so every wall receives the same average force per area.</details>

14. **Assertion (A):** Hydrogen molecules at 300 K have a greater average kinetic energy than oxygen molecules at 300 K. **Reason (R):** Hydrogen molecules are lighter and move faster.

<details><summary>Answer</summary>(d) A is false (both have 3k<sub>B</sub>T/2), R is true (the lighter molecules are faster). Equal energy needs the lighter ones to move faster.</details>

15. **Assertion (A):** The ratio C<sub>p</sub>/C<sub>v</sub> of a monatomic gas is greater than that of a diatomic gas. **Reason (R):** A monatomic molecule has fewer degrees of freedom.

<details><summary>Answer</summary>(a) Both true and R explains A: γ = 1 + 2/f, so smaller f gives larger γ (5/3 against 7/5).</details>

## Mix of questions from the bank

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="kinetic-theory" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- PV = nRT = Nk<sub>B</sub>T; use kelvin; P = P₁ + P₂ + … for non-reacting mixtures.
- P = ⅓ρ⟨v²⟩; mean KE = 3k<sub>B</sub>T/2; v<sub>rms</sub> = √(3RT/M).
- U = (f/2) nRT; C<sub>v</sub> = (f/2)R; C<sub>p</sub> = C<sub>v</sub> + R; γ = 1 + 2/f.
- λ = 1/(√2 π d² n) = k<sub>B</sub>T/(√2 π d² P).

</div>
