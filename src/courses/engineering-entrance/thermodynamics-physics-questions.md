---
title: 'Thermodynamics: question types and traps'
seoTitle: 'Thermodynamics questions for JEE and NEET physics'
summary: 'Every way entrance exams ask about thermodynamics: first-law sign problems, work from P-V graphs, the four standard processes, comparing isothermal and adiabatic curves, polytropic processes, specific heats of mixtures, cycles and their efficiency, Carnot engines, refrigerators and entropy, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'A gas absorbs 500 J of heat and does 200 J of work. Its internal energy:'
    choices: ['rises by 700 J', 'rises by 300 J', 'falls by 300 J', 'stays the same']
    ans: 1
    why: 'ΔU = Q − W = 500 − 200 = 300 J, an increase.'
  - q: 'Equal amounts of a gas expand from the same state to the same final volume, once isothermally and once adiabatically. More work is done:'
    choices: ['isothermally', 'adiabatically', 'equally in both', 'it depends on the gas only']
    ans: 0
    why: 'The adiabatic curve falls more steeply, so it lies below the isothermal one during expansion. Less area under it means less work.'
  - q: 'A refrigerator has a coefficient of performance of 4. To remove 400 J from the inside, it needs:'
    choices: ['1600 J of work', '100 J of work', '400 J of work', '500 J of work']
    ans: 1
    why: 'β = Q_c/W, so W = 400/4 = 100 J, and it releases 500 J into the room.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Thermodynamics; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 28 minutes.** Read the lesson [Thermodynamics](/learn/courses/engineering-entrance/thermodynamics-physics/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">For every process, fill in a three-column table: Q, ΔU and W. ΔU comes from the temperature change, W from the area under the P-V curve, and Q from the first law. Most questions are just one cell of that table.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. First-law signs.</b> Q = ΔU + W with Q in and W by the gas. <i>Trap:</i> chemistry books use W on the gas, which flips the sign.</div>
<div class="step"><b>2. Work from a P-V graph.</b> Area under the curve; cycle area for net work. <i>Trap:</i> on a V-P graph (axes swapped) clockwise means the opposite.</div>
<div class="step"><b>3. Standard processes.</b> Isochoric, isobaric, isothermal, adiabatic: know W, Q, ΔU for each. <i>Trap:</i> ΔU = nC_vΔT even in an isobaric process.</div>
<div class="step"><b>4. Isothermal vs adiabatic.</b> Adiabatic is γ times steeper; for the same expansion it does less work and ends colder.</div>
<div class="step"><b>5. Other graphs.</b> P-T, V-T and T-S diagrams: redraw on P-V first. On V-T, a line through the origin is isobaric.</div>
<div class="step"><b>6. Polytropic and P ∝ V processes.</b> C = C_v + R/(1 − x). For P ∝ V, x = −1 and C = C_v + R/2.</div>
<div class="step"><b>7. Specific heats and mixtures.</b> C_v of a mixture = Σn C_v/Σn; γ from the mixture's C_p/C_v, not the average of the γs.</div>
<div class="step"><b>8. Cycles and efficiency.</b> η = net work/heat absorbed (only the positive Q's). <i>Trap:</i> dividing by the net heat.</div>
<div class="step"><b>9. Carnot, refrigerators, heat pumps.</b> 1 − T_c/T_h; β = T_c/(T_h − T_c); heat pump β + 1. <i>Trap:</i> Celsius instead of kelvin.</div>
<div class="step"><b>10. Second law and entropy.</b> Statement questions; ΔS = Q/T for phase changes and reservoirs; entropy of an isolated system never falls.</div>
</div>

## Worked examples

**Example 1 (level 3, isobaric).** 2 mol of a diatomic gas is heated at constant pressure from 300 K to 400 K. Find Q, ΔU and W. (R = 8.3 J/mol K)

*Solution.* ΔU = nC_vΔT = 2 × 2.5 × 8.3 × 100 = **4150 J**. W = nRΔT = **1660 J**. Q = nC_pΔT = 2 × 3.5 × 8.3 × 100 = **5810 J**. Check: 4150 + 1660 = 5810. ✓ The fraction of heat that becomes work is R/C_p = 2/7.

**Example 2 (level 4, mixture).** 1 mol of helium is mixed with 1 mol of oxygen. Find γ of the mixture.

*Solution.* C_v = (1.5R + 2.5R)/2 = 2R. C_p = C_v + R = 3R. **γ = 1.5**. *Trap:* averaging 1.67 and 1.4 gives 1.53.

**Example 3 (level 4, two Carnot engines).** Engine A works between 800 K and T; engine B uses A's rejected heat and works between T and 200 K. Find T if both have the same efficiency, and if both do the same work.

*Solution.* Same efficiency: `$1 - T/800 = 1 - 200/T$`, so T² = 160 000 and **T = 400 K** (the geometric mean). Same work: each takes the same share of the temperature drop, so T = (800 + 200)/2 = **500 K** (the arithmetic mean).

**Example 4 (level 5, P ∝ V).** An ideal monatomic gas expands so that P ∝ V, from V₀ to 2V₀ starting at temperature T₀. Find the heat absorbed per mole.

*Solution.* PV ∝ V², so T ends at 4T₀, ΔT = 3T₀. Molar heat C = C_v + R/(1 − x) with x = −1: C = 1.5R + 0.5R = 2R. **Q = 2R × 3T₀ = 6RT₀**. *Check:* W = area of trapezium = ½(P₀ + 2P₀)V₀ = 1.5RT₀, ΔU = 4.5RT₀, total 6RT₀. ✓

<div class="myth">

**"In a cycle the gas gains no energy, so the engine does no work."** ΔU is zero over a cycle, but the net heat in is not. The net work out equals the net heat in, and it is the area of the loop.

</div>

<div class="meaning">
<dl>
<dt>Q-ΔU-W table</dt><dd>one row per step of a process; ΔU column adds to zero over a cycle</dd>
<dt>Heat absorbed</dt><dd>for efficiency, add only the steps where Q is positive</dd>
<dt>Physical meaning</dt><dd>Engines are limited by the second law, not by engineering: some heat must always be dumped at the cold side.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="thermodynamics-physics" data-mode="practice"></div>

<div class="keypoints">

- Ten types: signs, P-V areas, standard processes, isothermal vs adiabatic, other graphs, polytropic, mixtures, cycles, Carnot and refrigerators, entropy.
- ΔU = nC_vΔT always for an ideal gas; W = nRΔT at constant pressure.
- Mixture γ from total C_p/C_v, never by averaging γ.
- Cycle efficiency = net work/heat absorbed.
- Two Carnot engines in series: equal efficiency at √(T₁T₂), equal work at (T₁ + T₂)/2.

</div>
