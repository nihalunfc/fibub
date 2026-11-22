---
title: 'Current Electricity: practice questions'
seoTitle: 'Current Electricity Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Current Electricity: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full worked answers.'
minutes: 65
updated: 2026-11-22
quiz:
  - q: 'The resistance of a wire is 8 Ω. It is cut into two equal pieces and the two pieces are connected in parallel. The resistance is:'
    choices: ['8 Ω', '4 Ω', '2 Ω', '16 Ω']
    ans: 2
    why: 'Each half has 4 Ω (half the length). Two 4 Ω in parallel give 2 Ω.'
  - q: 'A battery of emf E and internal resistance r is connected to a load R. The current is largest when:'
    choices: ['R = r', 'R = 0', 'R is very large', 'R = 2r']
    ans: 1
    why: 'I = E/(R + r) is largest when R is smallest, that is R = 0 (short circuit), where I = E/r. The maximum power, not the maximum current, comes at R = r.'
  - q: 'Kirchhoff’s loop rule is based on the conservation of:'
    choices: ['charge', 'energy', 'momentum', 'mass']
    ans: 1
    why: 'A charge that goes round a closed loop returns to the same potential, so its net energy change is zero. The junction rule is the charge conservation rule.'
sources:
  - 'CBSE Class 12 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Physics · Chapter 3.** Read the chapter lesson, [Current Electricity](/learn/courses/ncert-class-12-physics/current-electricity/), first. Try each question on paper before opening the answer. Board marks go for the law, the formula, the substitution with units and the final answer.

<div class="bigidea">Most circuit questions come down to three habits: reduce series and parallel parts one step at a time, remember V = E − Ir for a real cell, and for anything more complicated write the junction rule and one loop rule per independent loop.</div>

## How to set out a numerical

1. Redraw the circuit, label the currents with arrows, mark the junctions.
2. Write the law (Ohm, junction, loop, V = E − Ir) in symbols.
3. Substitute with units (convert mm² to m², kΩ to Ω, hours to seconds).
4. Solve and give the answer with unit; a negative current means the real direction is opposite to the arrow.

<div class="problem" data-problem="c12p-curr-terminal"></div>

<div class="problem" data-problem="c12p-curr-kirchhoff"></div>

## 1-mark questions

1. Define the drift velocity of electrons.

<details><summary>Answer</summary>The average velocity gained by the free electrons in a conductor, in the direction opposite to the applied electric field, v_d = eEτ/m.</details>

2. Name a material used for making standard resistance coils and give one reason.

<details><summary>Answer</summary>Manganin (or constantan): its resistivity is high and almost independent of temperature.</details>

3. What is the SI unit of resistivity?

<details><summary>Answer</summary>Ohm metre (Ω m).</details>

4. What happens to the resistivity of a semiconductor when it is heated?

<details><summary>Answer</summary>It decreases, because more charge carriers become free.</details>

## 2- and 3-mark questions

5. (2) Why does a wire’s resistance increase with temperature for a metal?

<details><summary>Answer</summary>The number of free electrons per unit volume stays nearly constant, but at a higher temperature the ions vibrate more and the electrons collide with them more often. The relaxation time τ decreases, and since ρ = m/(ne²τ), the resistivity and hence the resistance increase.</details>

6. (2) A 60 W, 220 V lamp is connected to 220 V mains. Find the current and the resistance of the filament when it glows.

<details><summary>Answer</summary>

`$I = P/V = 60/220 = 0.27$` A. `$R = V^2/P = 220^2/60 = 807$` Ω.

</details>

7. (3) Show that the drift velocity is related to the current by `$I = neAv_d$`.

<details><summary>Answer</summary>

Take a length `$v_d\,\Delta t$` of wire of area A: in a time Δt all the free electrons in it cross the end section. The number is `$nAv_d\Delta t$`, the charge is `$\Delta Q = nAv_d\Delta t\,e$`, so `$I = \Delta Q/\Delta t = neAv_d$`.

</details>

8. (3) A cell of emf 2 V and internal resistance 0.5 Ω is connected to a 4.5 Ω resistor. Find the current, the terminal voltage and the power wasted in the cell.

<details><summary>Answer</summary>

`$I = E/(R+r) = 2/5 = 0.4$` A. `$V = E - Ir = 2 - 0.4\times0.5 = 1.8$` V. Power wasted inside: `$I^2r = 0.16\times0.5 = 0.08$` W.

</details>

9. (3) Three resistors 6 Ω, 3 Ω and 2 Ω are connected in parallel to a 12 V cell with negligible internal resistance. Find the current through each and the total current.

<details><summary>Answer</summary>

Each has 12 V across it: `$I_1 = 12/6 = 2$` A, `$I_2 = 12/3 = 4$` A, `$I_3 = 12/2 = 6$` A. Total = 12 A. (Check: 1/R = 1/6 + 1/3 + 1/2 = 1 gives R = 1 Ω and I = 12/1 = 12 A.)

</details>

10. (3) State Kirchhoff’s two rules and name the conservation law behind each.

<details><summary>Answer</summary>

Junction rule: the sum of the currents entering a junction equals the sum leaving it (conservation of charge). Loop rule: the algebraic sum of the changes in potential round any closed loop is zero (conservation of energy).

</details>

## 5-mark questions (model answers)

11. (5) Using the idea of drift of electrons, derive Ohm’s law and the expression for the resistivity of a conductor.

<details><summary>Answer</summary>

Free electrons in a field E have acceleration `$a = eE/m$`. Between collisions their velocity changes by `$a\times$` time, and averaging over collisions (relaxation time τ) the random parts cancel, giving the drift velocity `$v_d = eE\tau/m$`.

The current in a wire of area A with n electrons per unit volume is `$I = neAv_d = \dfrac{ne^2\tau A}{m}E$`.

For a wire of length l, `$E = V/l$`, so `$V = \dfrac{ml}{ne^2\tau A}\,I$`.

The constant `$R = \dfrac{ml}{ne^2\tau A}$` does not depend on V or I (for constant temperature), so `$V = IR$`: Ohm’s law.

Comparing with `$R = \rho l/A$` gives the resistivity `$\rho = \dfrac{m}{ne^2\tau}$`, which depends only on the material (through n and τ) and temperature (through τ).

</details>

12. (5) Show that the maximum power delivered by a cell of emf E and internal resistance r to a load R is E²/4r, and find the efficiency at that point.

<details><summary>Answer</summary>

`$I = E/(R+r)$`, so `$P = I^2R = \dfrac{E^2R}{(R+r)^2}$`.

For the maximum, `$\dfrac{dP}{dR} = E^2\,\dfrac{(R+r)^2 - 2R(R+r)}{(R+r)^4} = 0$`, which gives `$(R+r) - 2R = 0$`, so `$R = r$`.

Then `$P_{max} = \dfrac{E^2r}{(2r)^2} = \dfrac{E^2}{4r}$`.

Efficiency = power in the load ÷ total power = `$I^2R/(I^2(R+r)) = R/(R+r) = \tfrac12$`, that is 50 %.

</details>

13. (5) Using Kirchhoff’s rules, find the current in each branch: a 10 V cell and 2 Ω in the left branch, a 4 V cell and 1 Ω in the right branch (opposing, joined to the same nodes) and a 3 Ω resistor in the middle branch connecting the nodes.

<details><summary>Answer</summary>

Let I₁ flow up the left branch (from the 10 V cell) and I₃ flow up the right branch (from the 4 V cell) to the top node, and I₂ = I₁ + I₃ down the 3 Ω resistor. (Both cells push current up, since each has its positive terminal on top.)

Left loop: `$10 - 2I_1 - 3(I_1+I_3) = 0 \Rightarrow 5I_1 + 3I_3 = 10$`.

Right loop: `$4 - 1\cdot I_3 - 3(I_1+I_3) = 0 \Rightarrow 3I_1 + 4I_3 = 4$`.

Solving: from the first, `$I_1 = (10 - 3I_3)/5$`. Put in the second: `$3(10-3I_3)/5 + 4I_3 = 4 \Rightarrow 30 - 9I_3 + 20I_3 = 20 \Rightarrow 11I_3 = -10$`, so `$I_3 = -0.91$` A and `$I_1 = (10+2.73)/5 = 2.55$` A.

`$I_2 = I_1 + I_3 = 1.64$` A. The negative sign of I₃ means current flows into the 4 V cell: it is being charged.

</details>

## Case-based question

14. **A torch that dims.** Rohan’s torch uses two 1.5 V cells in series with a small bulb of 5.8 Ω. When new, each cell has an internal resistance of 0.1 Ω. After several months each cell’s internal resistance has grown to 1.5 Ω, and the torch is dim, though a voltmeter across a cell (nothing else connected) still reads 1.5 V.

(a) (1) Find the current when the cells are new.

(b) (1) Find the current when the cells are old.

(c) (1) Why does the voltmeter still read 1.5 V on an old cell?

(d) (1) Find the voltage across the bulb in the old torch.

<details><summary>Answer</summary>

(a) Total emf 3 V, total internal resistance 0.2 Ω: `$I = 3/(5.8+0.2) = 0.5$` A.

(b) Total internal resistance 3 Ω: `$I = 3/(5.8+3) = 0.34$` A.

(c) The voltmeter draws almost no current, so the drop Ir is almost zero and it reads the emf. The emf of the chemicals has hardly changed, but the internal resistance has.

(d) `$V = IR = 0.34\times5.8 = 1.98$` V, well below the 2.9 V when new. The bulb gets less current and voltage, so it is dim.

</details>

## Assertion-reason questions

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

15. **A:** The drift velocity of electrons in a wire is much smaller than their random thermal velocity. **R:** The number of free electrons per unit volume in a metal is very large.

<details><summary>Answer</summary>(A) Both true and R explains A: because so many electrons carry the current, each needs to drift only a little (I = nAev_d).</details>

16. **A:** The resistance of a wire is doubled when it is stretched to double its length at constant volume. **R:** Resistance is proportional to length.

<details><summary>Answer</summary>(D) A is false: the resistance becomes four times, because the area also halves. R is true on its own (R ∝ l at fixed area) but does not give the correct result here.</details>

17. **A:** In a Wheatstone bridge, interchanging the positions of the cell and the galvanometer does not affect the balance condition. **R:** The balance condition is P/Q = R/S, which involves only the four resistances.

<details><summary>Answer</summary>(A) Both true and R explains A: the balance condition has no emf or galvanometer resistance in it, so swapping the cell and galvanometer leaves the condition unchanged.</details>

## Question set from the bank

New numbers and questions each time. Check your answer, read the hint if you are stuck, then compare with the full solution.

<div class="qbank" data-bank="ncert-class-12-physics" data-topics="current-electricity" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- v_d = eEτ/m, I = nAev_d, ρ = m/(ne²τ), R = ρl/A. Stretching ×s multiplies R by s².
- V = E − Ir; short-circuit current E/r; maximum power at R = r is E²/4r (50 % efficiency).
- Series: R adds; parallel: 1/R adds. Cells: series nE, nr; parallel E, r/m.
- Kirchhoff: ΣI = 0 at a junction; ΣE = ΣIR round a loop. Negative current: opposite direction.
- Wheatstone balance: P/Q = R/S.
- Set out: law, formula, numbers with units, answer.

</div>
