---
title: 'Chemical equilibrium: question types and traps'
seoTitle: 'Equilibrium constant questions for JEE and NEET: traps'
summary: 'Every way entrance exams ask about chemical equilibrium: writing K and its units, Kp and Kc, changing equations, heterogeneous equilibria, Q against K, ICE tables, degree of dissociation, vapour density, Le Chatelier with inert gases, the van''t Hoff equation and simultaneous equilibria, each with a method and its trap. Then practise.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'For NH₄HS(s) ⇌ NH₃(g) + H₂S(g), the total pressure at equilibrium (starting from the solid only) is 0.6 atm. Kp is:'
    choices: ['0.09 atm²', '0.36 atm²', '0.3 atm²', '0.18 atm²']
    ans: 0
    why: 'Each gas is half the total: 0.3 atm. Kp = 0.3 × 0.3 = 0.09 atm² (the solid is left out).'
  - q: 'At 500 K, Kc for a reaction is 10 and Q for a mixture is 25. The reaction:'
    choices: ['Is at equilibrium', 'Moves forward', 'Moves backward', 'Stops']
    ans: 2
    why: 'Q > K: there is more product than at equilibrium, so the net reaction runs backward until Q falls to 10.'
  - q: 'The units of Kc for 2SO₂(g) + O₂(g) ⇌ 2SO₃(g) are:'
    choices: ['mol L⁻¹', 'L mol⁻¹', 'L² mol⁻²', 'no units']
    ans: 1
    why: '(mol/L)² ÷ (mol/L)³ = (mol/L)⁻¹ = L mol⁻¹.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Equilibrium; question patterns studied from published papers (no questions copied)'
---

**Chemistry · Class 11 · about 25 minutes.** Read [Chemical equilibrium](/learn/courses/engineering-entrance/chemical-equilibrium/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Every equilibrium question is one of two kinds: a number (set up an ICE table and put it into K) or a direction (compare Q with K, or apply Le Chatelier). Decide which kind first.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Writing K and its units.</b> Products over reactants, powers = coefficients. <i>Trap:</i> pure solids and liquids are left out; units are (mol/L)<sup>Δn</sup>.</div>
<div class="step"><b>2. Kp and Kc.</b> Kp = Kc(RT)<sup>Δn</sup>. <i>Trap:</i> Δn from gases only; R = 0.0821 for atm.</div>
<div class="step"><b>3. Changing equations.</b> Reverse 1/K, scale Kⁿ, add multiply. <i>Trap:</i> halving the equation gives √K, not K/2.</div>
<div class="step"><b>4. Q against K.</b> Q &lt; K forward. <i>Trap:</i> use concentrations (moles ÷ volume), not moles, unless Δn = 0.</div>
<div class="step"><b>5. ICE tables.</b> Change row from coefficients. <i>Trap:</i> check x is smaller than the starting amount; pick the sensible root.</div>
<div class="step"><b>6. Degree of dissociation and pressure.</b> α = √(Kp/(Kp + P)) for one-to-two dissociation. <i>Trap:</i> total moles are 1 + α, not 1.</div>
<div class="step"><b>7. Vapour density.</b> α = (D − d)/((n − 1)d). <i>Trap:</i> D is the theoretical value (M/2), d the observed.</div>
<div class="step"><b>8. Le Chatelier.</b> Concentration, pressure, inert gas, temperature, catalyst. <i>Trap:</i> inert gas at constant V: no shift; at constant P: towards more gas moles.</div>
<div class="step"><b>9. van't Hoff and ΔG° (JEE Advanced).</b> log(K₂/K₁) = ΔH°/(2.303R)(1/T₁ − 1/T₂); ΔG° = −2.303RT log K. <i>Trap:</i> R = 8.314 J here, not 0.0821.</div>
<div class="step"><b>10. Simultaneous equilibria.</b> One substance in two reactions has a single concentration shared by both. <i>Trap:</i> do not give it two different values.</div>
</div>

## Worked examples

**Example 1 (level 3, ICE with N₂O₄).** 1 mol of N₂O₄ in a 1 L flask is 20% dissociated at equilibrium (N₂O₄ ⇌ 2NO₂). Find Kc. *Solution.* N₂O₄: 0.8 mol/L; NO₂: 0.4 mol/L. Kc = 0.4²/0.8 = **0.2 mol/L**.

**Example 2 (level 4, Kp from α).** PCl₅ is 50% dissociated at 2 atm total pressure. Find Kp and α at 8 atm. *Solution.* Kp = α²P/(1 − α²) = 0.25 × 2/0.75 = **0.667 atm**. At 8 atm: α = √(0.667/8.667) = **0.277**. Four times the pressure, but α falls only from 0.5 to 0.28.

**Example 3 (level 4, van't Hoff).** K for a reaction doubles when T rises from 300 K to 310 K. Estimate ΔH°. *Solution.* log 2 = ΔH°/(2.303 × 8.314) × (1/300 − 1/310). 0.301 = ΔH°/19.15 × 1.075 × 10⁻⁴, so ΔH° = 0.301 × 19.15/1.075 × 10⁻⁴ = **53.6 kJ/mol** (endothermic, since K rose).

**Example 4 (level 5, simultaneous equilibria).** Two solids share one gas in a single flask: A(s) ⇌ X(g) + Y(g) with Kp = 4 atm² and B(s) ⇌ X(g) + Z(g) with Kp = 5 atm², starting from both solids only. Find the total pressure. *Solution.* Let p<sub>Y</sub> = a, p<sub>Z</sub> = b; then p<sub>X</sub> = a + b. (a + b)a = 4 and (a + b)b = 5. Adding: (a + b)² = 9, so a + b = 3, a = 4/3, b = 5/3. Total = p<sub>X</sub> + p<sub>Y</sub> + p<sub>Z</sub> = 3 + 3 = **6 atm**.

<div class="myth">

**"Doubling the pressure by compressing doubles every partial pressure, so nothing changes."** Q changes by 2<sup>Δn</sup>. For PCl₅ ⇌ PCl₃ + Cl₂ (Δn = +1), Q doubles and becomes bigger than K, so the reaction runs backward. Nothing changes only when Δn = 0.

</div>

<div class="meaning">
<dl>
<dt>D, d</dt><dd>vapour density before dissociation (M/2) and of the equilibrium mixture</dd>
<dt>n</dt><dd>particles formed from one molecule</dd>
<dt>Physical meaning</dt><dd>Dissociation adds molecules without adding mass, so the gas gets lighter per mole: that is what vapour density measures.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-chemistry" data-topics="chemical-equilibrium" data-mode="practice"></div>

<div class="keypoints">

- Units of Kc = (mol/L)<sup>Δn</sup>; Kp = Kc(RT)<sup>Δn</sup>.
- Solid giving two gases equally: Kp = (P/2)².
- One-to-two dissociation: Kp = α²P/(1 − α²).
- Le Chatelier with inert gas: constant V no shift; constant P shift to more moles.
- van't Hoff uses R = 8.314 J K⁻¹ mol⁻¹; K rises with T only for endothermic reactions.
- Simultaneous equilibria: one shared species, one value.

</div>
