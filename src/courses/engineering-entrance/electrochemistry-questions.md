---
title: 'Electrochemistry: question types and traps'
seoTitle: 'Electrochemistry questions for JEE and NEET: types and traps'
summary: 'Every way entrance exams ask about electrochemistry: cell emf and spontaneity, Nernst equation with pH and concentration cells, ΔG and K from emf, combining half-cell potentials, conductivity and Kohlrausch''s law, Faraday''s laws and electrolysis products, each with a method and its trap. Then practise.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'E°(Fe³⁺/Fe²⁺) = +0.77 V and E°(Fe²⁺/Fe) = −0.44 V. E°(Fe³⁺/Fe) is about:'
    choices: ['+0.33 V', '−0.04 V', '+1.21 V', '−0.11 V']
    ans: 1
    why: 'Add ΔG° values, not potentials: −3F·E = −1F(0.77) − 2F(−0.44) = −0.77F + 0.88F, so E = −0.11/3 ≈ −0.037 V.'
  - q: 'In the electrolysis of aqueous CuSO₄ with copper electrodes, the anode:'
    choices: ['gives off O₂', 'gives off SO₂', 'dissolves as Cu²⁺', 'gains mass']
    ans: 2
    why: 'Copper is easier to oxidise than water or sulphate, so the anode itself dissolves while copper deposits on the cathode. The solution''s concentration stays the same.'
  - q: 'A hydrogen electrode in a solution has E = −0.177 V against the SHE at 298 K. The pH is:'
    choices: ['1', '2', '3', '4']
    ans: 2
    why: 'E = −0.0591 × pH, so pH = 0.177/0.0591 = 3.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Electrochemistry; question patterns studied from published papers (no questions copied)'
---

**Chemistry · Class 12 · about 25 minutes.** Read [Electrochemistry](/learn/courses/engineering-entrance/electrochemistry/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Electrochemistry questions use four tools: E° tables to decide direction, the Nernst equation for real concentrations, ΔG = −nFE to link to energy and K, and Q = It with n electrons per ion for electrolysis. Most traps come from getting n wrong.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Which way does it go?</b> Spontaneous if E°cell > 0. <i>Trap:</i> E°cell = E°cathode − E°anode, both as reduction potentials; do not flip a sign and also subtract.</div>
<div class="step"><b>2. Nernst equation.</b> Write the balanced cell reaction first, then Q. <i>Trap:</i> coefficients become powers in Q (2Ag⁺ gives [Ag⁺]²); solids drop out.</div>
<div class="step"><b>3. pH and concentration cells.</b> E = (0.0591/n) log(c_cathode/c_anode). <i>Trap:</i> the more dilute side is the anode.</div>
<div class="step"><b>4. ΔG° and K from E°.</b> ΔG° = −nFE° (J if F in C), log K = nE°/0.0591. <i>Trap:</i> J vs kJ.</div>
<div class="step"><b>5. Combining half-cells.</b> A new half-reaction from two others: add nE° values. <i>Trap:</i> adding E° directly.</div>
<div class="step"><b>6. Conductivity.</b> κ = G*/R, Λm = 1000κ/c. <i>Trap:</i> units (S cm² mol⁻¹ needs κ in S/cm and c in mol/L).</div>
<div class="step"><b>7. Kohlrausch, α, Ka and Ksp.</b> Build Λ° of a weak electrolyte from strong ones. <i>Trap:</i> for Ksp from conductance, subtract the water's κ first.</div>
<div class="step"><b>8. Faraday and products.</b> m = MIt/(nF); volumes of gases; current efficiency. <i>Trap:</i> O₂ needs 4 electrons per molecule, H₂ and Cl₂ need 2.</div>
</div>

## Worked examples

**Example 1 (level 3, pH from emf).** The cell Pt | H₂(1 bar) | H⁺(x M) || H⁺(1 M) | H₂(1 bar) | Pt has emf 0.236 V at 298 K. Find the pH of the left side. *Solution.* Concentration cell with n = 2 for 2H⁺ → H₂: E = (0.0591/2) log(1²/x²) = 0.0591 × pH. pH = 0.236/0.0591 = **4.0**.

**Example 2 (level 4, Ksp from conductance).** A saturated AgCl solution has κ = 3.40 × 10⁻⁶ S/cm, and the water used had κ = 1.60 × 10⁻⁶ S/cm. λ°(Ag⁺) = 61.9 and λ°(Cl⁻) = 76.3 S cm² mol⁻¹. Find Ksp. *Solution.* κ(AgCl) = 1.80 × 10⁻⁶ S/cm. Λ° = 138.2. s = 1000κ/Λ° = 1000 × 1.80 × 10⁻⁶/138.2 = 1.30 × 10⁻⁵ mol/L. Ksp = s² = **1.7 × 10⁻¹⁰**.

**Example 3 (level 4, gases in electrolysis).** A current of 2 A flows for 965 s through dilute H₂SO₄. Find the total volume of gas at STP. *Solution.* Q = 1930 C = 0.02 F. H₂: 2 e⁻ per molecule, 0.01 mol = 224 mL. O₂: 4 e⁻ per molecule, 0.005 mol = 112 mL. Total **336 mL**.

**Example 4 (level 5, emf with a complex).** E°(Ag⁺/Ag) = 0.80 V. Silver is dipped in a solution where [Ag⁺] is held at 10⁻⁸ M by adding ammonia. Find the electrode potential. *Solution.* Ag⁺ + e⁻ → Ag, n = 1: E = 0.80 − 0.0591 log(1/10⁻⁸) = 0.80 − 0.473 = **0.327 V**. Complexing the ion makes the metal easier to oxidise: this is why gold dissolves in cyanide solution even though it ignores acids.

<div class="myth">

**"A bigger cell gives a bigger emf."** The emf depends only on the reaction and concentrations, not on the size of the electrodes. A bigger cell stores more charge (more ampere-hours), not more volts.

</div>

<div class="meaning">
<dl>
<dt>n</dt><dd>electrons in the balanced overall reaction, the same number in ΔG = −nFE and in Nernst</dd>
<dt>1 F</dt><dd>96 500 C, one mole of electrons</dd>
<dt>Physical meaning</dt><dd>Volts tell you the push; faradays tell you how many electrons were pushed. Energy needs both.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-chemistry" data-topics="electrochemistry" data-mode="practice"></div>

<div class="keypoints">

- Balance the cell reaction first; n and Q come from it.
- E° values add only through nE° (that is, through ΔG°).
- Concentration cell: dilute side is the anode; E = (0.0591/n) log(c₂/c₁).
- Λm = 1000κ/c; α = Λm/Λ°m; s = 1000κ/Λ° for sparingly soluble salts.
- Electrons per molecule: H₂ 2, Cl₂ 2, O₂ 4; per ion: Ag⁺ 1, Cu²⁺ 2, Al³⁺ 3.
- Complexing or precipitating the ion lowers the electrode potential through Nernst.

</div>
