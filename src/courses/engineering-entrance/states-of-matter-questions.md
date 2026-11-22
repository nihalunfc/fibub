---
title: 'Gases and liquids: question types and traps'
seoTitle: 'Gas laws and real gas questions for JEE: types and traps'
summary: 'Every way JEE asks about gases and liquids: gas law changes, density and molar mass, partial pressures and gas over water, effusion, molecular speeds, compressibility factor and van der Waals corrections, critical constants and liquid properties, each with a method and its trap. Then practise.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'Equal masses of H₂ and O₂ are mixed. The fraction of the total pressure due to H₂ is:'
    choices: ['1/2', '1/17', '16/17', '1/16']
    ans: 2
    why: 'Take 32 g of each: 16 mol H₂ and 1 mol O₂. Mole fraction of H₂ = 16/17, and partial pressure follows mole fraction.'
  - q: 'The r.m.s. speed of a gas at 300 K is u. At what temperature is it 2u?'
    choices: ['600 K', '900 K', '1200 K', '150 K']
    ans: 2
    why: 'u ∝ √T, so doubling u needs four times T: 1200 K.'
  - q: 'In the van der Waals equation, the constant b has units of:'
    choices: ['L mol⁻¹', 'atm L² mol⁻²', 'mol L⁻¹', 'no units']
    ans: 0
    why: 'nb is subtracted from V, so b is a volume per mole (L mol⁻¹). a has units atm L² mol⁻².'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: States of matter; question patterns studied from published papers (no questions copied)'
---

**Chemistry · Class 11 · about 24 minutes.** Read [Gases and liquids](/learn/courses/engineering-entrance/states-of-matter/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Gas questions reward one habit: write PV = nRT (or its corrected form), circle what is fixed, and cancel it. Most traps are units: kelvin, litres against cubic metres, grams against kilograms.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Gas law changes.</b> Write P₁V₁/(n₁T₁) = P₂V₂/(n₂T₂) and cancel what is fixed. <i>Trap:</i> temperature in °C; an open flask heated loses gas (n changes, P fixed).</div>
<div class="step"><b>2. Density and molar mass.</b> d = PM/RT; vapour density = M/2. <i>Trap:</i> density in g/L with R in L atm.</div>
<div class="step"><b>3. Mixtures and Dalton.</b> p = xP. <i>Trap:</i> equal masses are not equal moles.</div>
<div class="step"><b>4. Gas over water.</b> Dry pressure = total − aqueous tension; then PV = nRT. <i>Trap:</i> using the total pressure.</div>
<div class="step"><b>5. Effusion.</b> r ∝ P/√M; time ∝ √M; for a mixture, the escaping gas is richer in the lighter one. <i>Trap:</i> "rate" in volume per time versus moles per time (same at fixed T and P).</div>
<div class="step"><b>6. Speeds and kinetic energy.</b> All ∝ √(T/M); KE per mole (3/2)RT. <i>Trap:</i> M in kg/mol for m/s.</div>
<div class="step"><b>7. Compressibility factor.</b> Z = PV/nRT = V<sub>real</sub>/V<sub>ideal</sub>. <i>Trap:</i> Z &lt; 1 means attractions, not "smaller molecules".</div>
<div class="step"><b>8. Van der Waals and critical constants.</b> V<sub>c</sub> = 3b, P<sub>c</sub> = a/27b², T<sub>c</sub> = 8a/27Rb. <i>Trap:</i> larger a, easier liquefaction; T<sub>B</sub> = a/Rb.</div>
<div class="step"><b>9. Liquids.</b> Vapour pressure, boiling point with altitude, surface tension and viscosity order. <i>Trap:</i> both fall with temperature.</div>
</div>

## Worked examples

**Example 1 (level 3, open vessel).** An open flask contains air at 27 °C. To what temperature must it be heated so that one fifth of the air escapes? *Solution.* P and V fixed, so n₁T₁ = n₂T₂. n₂ = 0.8 n₁, so T₂ = 300/0.8 = **375 K** (102 °C).

**Example 2 (level 4, effusion of a mixture).** An equimolar mixture of He and CH₄ effuses through a pinhole. Find the mole ratio He : CH₄ in the first gas to escape. *Solution.* Ratio = (n<sub>He</sub>/n<sub>CH₄</sub>) × √(16/4) = 1 × 2 = **2 : 1**. The escaping gas is enriched in the lighter gas.

**Example 3 (level 4, compressibility).** One mole of a gas at 273 K and 100 atm occupies 0.2 L. Find Z and say which force dominates. *Solution.* Z = PV/nRT = (100 × 0.2)/(1 × 0.0821 × 273) = 20/22.4 = **0.89**. Z &lt; 1, so attractions dominate at this pressure.

**Example 4 (level 5, critical constants).** A gas has a = 3.6 L² atm mol⁻² and b = 0.043 L mol⁻¹. Find T<sub>c</sub> and the Boyle temperature. *Solution.* T<sub>c</sub> = 8a/(27Rb) = (8 × 3.6)/(27 × 0.0821 × 0.043) = 28.8/0.0953 = **302 K**. T<sub>B</sub> = a/(Rb) = 3.6/(0.0821 × 0.043) = **1020 K**. Note T<sub>B</sub> = 27T<sub>c</sub>/8 for any van der Waals gas.

<div class="myth">

**"At the same temperature, lighter molecules have more kinetic energy because they are faster."** They are faster, but they are lighter by exactly the right amount: ½mu² comes out the same. Kinetic energy depends only on temperature.

</div>

<div class="meaning">
<dl>
<dt>Aqueous tension</dt><dd>vapour pressure of water at the collection temperature (about 24 mm Hg at 25 °C)</dd>
<dt>Z</dt><dd>PV/nRT = actual molar volume ÷ ideal molar volume</dd>
<dt>Physical meaning</dt><dd>Z tells you whether the molecules are pulling together (Z &lt; 1) or crowding each other out (Z &gt; 1).</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-chemistry" data-topics="states-of-matter" data-mode="practice"></div>

<div class="keypoints">

- Cancel what is fixed in P₁V₁/(n₁T₁) = P₂V₂/(n₂T₂); always kelvin.
- Equal masses: convert to moles before Dalton's law.
- Dry gas pressure = total − aqueous tension.
- Effusion enriches the lighter gas by √(M<sub>heavy</sub>/M<sub>light</sub>) each pass.
- Speeds ∝ √(T/M); KE per mole (3/2)RT.
- T<sub>c</sub> = 8a/27Rb, T<sub>B</sub> = a/Rb = (27/8)T<sub>c</sub>.

</div>
