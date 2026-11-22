---
title: 'Solid state and surface chemistry: question types and traps'
seoTitle: 'Solid state and surface questions for JEE: types and traps'
summary: 'Every way KEAM, CUSAT, COMEDK and JEE ask about solids and surfaces: counting atoms, formula from lattice sites and voids, density, radius and edge length, packing, radius ratio, defects, adsorption isotherms and colloids, each with a method and its trap. Then practise.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'Atoms of A sit at the corners and atoms of B at the face centres of a cube. The formula is:'
    choices: ['AB', 'AB₃', 'A₃B', 'AB₂']
    ans: 1
    why: 'A: 8 × 1/8 = 1. B: 6 × 1/2 = 3. Formula AB₃.'
  - q: 'In the same compound, if all the atoms from one face centre are removed, the formula becomes:'
    choices: ['AB₃', 'A₂B₅', 'AB₂', 'A₂B₃']
    ans: 1
    why: 'Removing one face atom removes 1/2 per cell: B = 3 − 1/2 = 5/2. A : B = 1 : 2.5 = 2 : 5.'
  - q: 'The packing efficiency of a bcc lattice is about:'
    choices: ['52%', '68%', '74%', '90%']
    ans: 1
    why: 'Two spheres of r = √3a/4 in a cube of side a: 2 × (4/3)π r³ / a³ = √3π/8 = 0.68.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi; KEAM, CUSAT CAT and COMEDK chemistry syllabi; question patterns studied from published papers (no questions copied)'
---

**Chemistry · Class 12 · about 24 minutes.** Read [Solid state and surface chemistry](/learn/courses/engineering-entrance/solid-state-surface/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Solid state questions reduce to two moves: count what is in one cell (with the 1/8, 1/4, 1/2, 1 shares), and find the line where atoms touch. Surface chemistry questions test a handful of rules: exothermic adsorption, Freundlich's straight line and Hardy-Schulze.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Counting atoms (Z).</b> Corner 1/8, edge 1/4, face 1/2, body 1. <i>Trap:</i> in an hcp cell (hexagonal prism) the corner share is 1/6, giving 6 atoms.</div>
<div class="step"><b>2. Formula from sites and voids.</b> Count each kind of atom per cell, or use N octahedral and 2N tetrahedral voids. <i>Trap:</i> "removed along one body diagonal" removes 2 corners and the body centre.</div>
<div class="step"><b>3. Density, edge, molar mass, N_A.</b> d = ZM/(N_A a³). <i>Trap:</i> pm to cm is 10⁻¹⁰, and cube it.</div>
<div class="step"><b>4. Radius and edge.</b> Touching line: edge, face diagonal or body diagonal. <i>Trap:</i> for NaCl, a = 2(r₊ + r₋); for CsCl, √3a = 2(r₊ + r₋).</div>
<div class="step"><b>5. Packing efficiency and voids.</b> 52.4, 68, 74%. Void sizes: tetrahedral 0.225r, octahedral 0.414r.</div>
<div class="step"><b>6. Defects and properties.</b> Which defect changes density; colour centres; n- and p-type; kinds of magnetism.</div>
<div class="step"><b>7. Adsorption isotherms.</b> Freundlich slope 1/n; physisorption vs chemisorption with temperature. <i>Trap:</i> the slope is 1/n, not n.</div>
<div class="step"><b>8. Colloids.</b> Charge of common sols, Hardy-Schulze order, flocculation value and gold number. <i>Trap:</i> smaller flocculation value or gold number means more effective.</div>
</div>

## Worked examples

**Example 1 (level 3, formula from voids).** Oxide ions form ccp. A²⁺ ions fill 1/8 of the tetrahedral voids and B³⁺ ions fill 1/2 of the octahedral voids. Find the formula. *Solution.* Per N oxide ions: A = (1/8)(2N) = N/4, B = (1/2)(N) = N/2. A : B : O = 1/4 : 1/2 : 1 = 1 : 2 : 4, so **AB₂O₄** (a spinel; check charge: 2 + 6 − 8 = 0).

**Example 2 (level 4, Avogadro number from a crystal).** Copper is fcc with a = 361 pm and density 8.92 g/cm³ (M = 63.5). Find N_A. *Solution.* a³ = (3.61 × 10⁻⁸)³ = 4.70 × 10⁻²³ cm³. N_A = ZM/(d a³) = 4 × 63.5/(8.92 × 4.70 × 10⁻²³) = **6.06 × 10²³ mol⁻¹**.

**Example 3 (level 4, Schottky defects).** A NaCl crystal has density 2.165 g/cm³ by X-ray (from a) but 2.160 g/cm³ by measurement. Find the fraction of sites vacant. *Solution.* The missing mass fraction = (2.165 − 2.160)/2.165 = **0.23%** of the ion pairs are missing.

**Example 4 (level 4, coagulation).** Flocculation values for a negative sol: NaCl 52, BaCl₂ 0.69, AlCl₃ 0.093 mmol/L. Rank coagulating power. *Solution.* Power is the inverse of flocculation value: **AlCl₃ > BaCl₂ > NaCl**, roughly 560 : 75 : 1, showing the steep charge effect.

<div class="myth">

**"Packing efficiency depends on the size of the atom."** It is pure geometry. Any fcc metal fills 74%, whether its atoms are big or small. Only mixed structures with two sizes (ionic crystals) depend on the radius ratio.

</div>

<div class="meaning">
<dl>
<dt>Share counts</dt><dd>corner 1/8, edge 1/4, face 1/2, body 1 (cubic cells)</dd>
<dt>Void sizes</dt><dd>tetrahedral fits a sphere of 0.225r, octahedral 0.414r</dd>
<dt>Physical meaning</dt><dd>The cell is the repeating tile; every bulk property is its contents divided by its size.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-chemistry" data-topics="solid-state-surface" data-mode="practice"></div>

<div class="keypoints">

- Count shares carefully; check charge balance on the final formula.
- d = ZM/(N_A a³) can be turned round to find N_A, M, a or Z.
- Know the touching line for sc, bcc, fcc, NaCl and CsCl.
- Schottky lowers density; Frenkel keeps it; metal excess gives F-centres and colour.
- Freundlich slope = 1/n; physisorption falls with temperature.
- Hardy-Schulze: charge opposite to the sol, higher is stronger; smaller gold number, better protector.

</div>
