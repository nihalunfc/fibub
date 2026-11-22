---
title: 'Solutions and colligative properties: question types and traps'
seoTitle: 'Solutions questions for JEE and NEET: types and traps'
summary: 'Every way entrance exams ask about solutions: Henry''s law, Raoult''s law and vapour composition, deviations and azeotropes, colligative properties, molar mass, and van''t Hoff factor for dissociation and association, each with a method and its trap. Then practise.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'Two liquids A (p° = 120 kPa) and B (p° = 40 kPa) form an ideal solution with x_A = 0.5. The mole fraction of A in the vapour is:'
    choices: ['0.50', '0.67', '0.75', '0.33']
    ans: 2
    why: 'p_A = 60, p_B = 20, total 80 kPa. y_A = 60/80 = 0.75: the vapour is richer in the more volatile A.'
  - q: 'The observed molar mass of NaCl from a freezing point experiment comes out near 30 g/mol. The best explanation is:'
    choices: ['Association of NaCl', 'Dissociation into ions', 'Experimental error only', 'NaCl is volatile']
    ans: 1
    why: 'Dissociation doubles the number of particles, so the effect looks twice as large and the molar mass looks half its real 58.5 g/mol.'
  - q: 'Which pair are isotonic at the same temperature?'
    choices: ['0.1 M urea and 0.1 M NaCl', '0.1 M glucose and 0.05 M NaCl (fully ionised)', '0.1 M sucrose and 0.1 M CaCl₂', '0.2 M glucose and 0.1 M urea']
    ans: 1
    why: 'Osmotic pressure follows i × C. Glucose: 1 × 0.1 = 0.1. NaCl: 2 × 0.05 = 0.1. Equal, so isotonic.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Solutions; question patterns studied from published papers (no questions copied)'
---

**Chemistry · Class 12 · about 24 minutes.** Read [Solutions and colligative properties](/learn/courses/engineering-entrance/solutions/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Almost every solutions question is a particle count. Find how many moles of particles are in how much solvent, multiply by the right constant, and remember that ions and dimers change the count.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Concentration conversions.</b> Molality, molarity, mole fraction, with density. <i>Trap:</i> per kg of solvent vs per litre of solution.</div>
<div class="step"><b>2. Henry's law.</b> p = K_H x. <i>Trap:</i> a larger K_H means the gas is less soluble; gas solubility falls with temperature.</div>
<div class="step"><b>3. Raoult's law and vapour composition.</b> p_A = x_A p°_A, y_A = p_A/P. <i>Trap:</i> using x where y is asked; when the vapour is condensed, the new liquid has composition y.</div>
<div class="step"><b>4. Deviations and azeotropes.</b> Match the pair to positive or negative and the sign of ΔH and ΔV. <i>Trap:</i> negative deviation gives a maximum-boiling azeotrope.</div>
<div class="step"><b>5. Relative lowering of vapour pressure.</b> Δp/p° = x₂, or Δp/p = n₂/n₁ for a stronger solution. <i>Trap:</i> it is the solute's mole fraction, not the solvent's.</div>
<div class="step"><b>6. ΔT_b, ΔT_f and molar mass.</b> m = (w₂/M₂)(1000/W₁). <i>Trap:</i> grams of solvent, not of solution; K_f of benzene is 5.12, not 1.86.</div>
<div class="step"><b>7. Osmotic pressure and isotonic solutions.</b> π = iCRT with R = 0.0821 L atm/(mol K). <i>Trap:</i> T in kelvin; compare iC for isotonic.</div>
<div class="step"><b>8. van't Hoff factor.</b> Dissociation, association, abnormal molar mass, degree α. <i>Trap:</i> complex salts like K₄[Fe(CN)₆] give 5 ions, not 11.</div>
</div>

## Worked examples

**Example 1 (level 3, ordering).** Arrange by freezing point, highest first: 0.1 m glucose, 0.1 m NaCl, 0.05 m Al₂(SO₄)₃, 0.04 m K₄[Fe(CN)₆] (all fully ionised). *Solution.* Particle molality i × m: glucose 0.1; NaCl 0.2; Al₂(SO₄)₃ 5 × 0.05 = 0.25; K₄[Fe(CN)₆] 5 × 0.04 = 0.20. Smallest depression freezes highest: **glucose > NaCl = K₄[Fe(CN)₆] > Al₂(SO₄)₃**.

**Example 2 (level 4, degree of association).** 2 g of benzoic acid (M = 122) in 25 g of benzene lowers the freezing point by 1.62 K. K_f of benzene = 4.9 K kg/mol. Find the percentage of acid that dimerises. *Solution.* Expected m = (2/122)/0.025 = 0.656 mol/kg; expected ΔT_f = 4.9 × 0.656 = 3.21 K. i = 1.62/3.21 = 0.504. For dimers, i = 1 − α/2, so α = 2(1 − 0.504) = **0.99, about 99%**.

**Example 3 (level 4, vapour then liquid).** Liquids A (p° = 90 kPa) and B (p° = 30 kPa) form an ideal solution with x_A = 0.25. The vapour is condensed and the liquid allowed to reach equilibrium again. Find the new mole fraction of A in the vapour. *Solution.* First vapour: p_A = 22.5, p_B = 22.5, y_A = 0.5. The condensed liquid has x_A = 0.5: p_A = 45, p_B = 15, so the new **y_A = 0.75**. Each step of evaporation and condensation enriches A: this is fractional distillation.

**Example 4 (level 5, osmotic pressure of a polymer).** 1.0 g of a protein in 100 mL of water gives an osmotic pressure of 0.0025 atm at 27 °C. Find the molar mass. *Solution.* C = π/RT = 0.0025/(0.0821 × 300) = 1.015 × 10⁻⁴ mol/L. In 0.1 L that is 1.015 × 10⁻⁵ mol, so M = 1.0/1.015 × 10⁻⁵ ≈ **98 500 g/mol**. The freezing point depression for the same solution would be about 0.0002 K: far too small to measure, which is why osmotic pressure is used.

<div class="myth">

**"A more concentrated vapour means the liquid becomes richer in the volatile part."** The opposite. The vapour takes away more of the volatile liquid, so the liquid left behind gets richer in the less volatile one, and its boiling point slowly rises during distillation.

</div>

<div class="meaning">
<dl>
<dt>Particle molality</dt><dd>i × m: the number that every colligative property follows</dd>
<dt>Abnormal molar mass</dt><dd>observed M = normal M ÷ i</dd>
<dt>Physical meaning</dt><dd>The solvent does not care what the particles are, only how many get in its way.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-chemistry" data-topics="solutions" data-mode="practice"></div>

<div class="keypoints">

- Use molality for ΔT_b and ΔT_f, molarity for π, mole fraction for vapour pressure.
- y_A = x_A p°_A / P: vapour is richer in the more volatile liquid.
- Negative deviation: stronger A-B forces, heat out, volume shrinks, maximum-boiling azeotrope.
- Compare i × m (or i × C), never m alone.
- Dissociation: i > 1, molar mass looks smaller. Association: i < 1, molar mass looks larger.
- Osmotic pressure is the method of choice for proteins and polymers.

</div>
