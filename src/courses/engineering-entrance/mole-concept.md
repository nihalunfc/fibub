---
title: 'Some basic concepts: moles and stoichiometry'
seoTitle: 'Mole concept and stoichiometry: JEE and NEET chemistry'
summary: 'The mole, molar mass, percentage composition, empirical and molecular formulae, balanced equations, limiting reagent, percentage yield and every concentration unit (molarity, molality, mole fraction, ppm, normality), from basics to JEE Advanced depth.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'How many atoms are in 0.5 mol of ammonia, NH₃?'
    choices: ['3.01 × 10²³', '6.022 × 10²³', '1.204 × 10²⁴', '2.41 × 10²⁴']
    ans: 2
    why: '0.5 mol of molecules = 3.011 × 10²³ molecules, and each NH₃ has 4 atoms: 4 × 3.011 × 10²³ = 1.204 × 10²⁴ atoms.'
  - q: 'Which concentration unit does not change when the solution is heated?'
    choices: ['Molarity', 'Molality', 'Normality', 'Grams per litre']
    ans: 1
    why: 'Molality is moles per kilogram of solvent: both are amounts of matter, unaffected by temperature. The others divide by a volume, which expands on heating.'
  - q: 'A compound has the empirical formula CH₂O and molar mass 180 g/mol. Its molecular formula is:'
    choices: ['CH₂O', 'C₂H₄O₂', 'C₆H₁₂O₆', 'C₃H₆O₃']
    ans: 2
    why: 'CH₂O has mass 30 g/mol. 180/30 = 6, so the molecular formula is (CH₂O)₆ = C₆H₁₂O₆.'
sources:
  - 'IUPAC (2019), the mole is defined by fixing N_A = 6.022 140 76 × 10²³ mol⁻¹ exactly; BIPM SI Brochure, 9th edition https://www.bipm.org/en/publications/si-brochure'
  - 'IUPAC Gold Book: standard conditions for gases (STP 273.15 K and 1 bar, molar volume 22.711 L/mol) https://goldbook.iupac.org'
  - 'NEET (UG) and JEE Main / JEE Advanced 2026 syllabi: Some basic concepts in chemistry'
---

**Chemistry · Class 11 · about 32 minutes.** By the end you will be able to move between grams, moles, particles and gas volumes, find formulae from analysis data, solve any stoichiometry problem and convert between every concentration unit.

<div class="bigidea">Chemists cannot count atoms one by one, so they count them in packs of 6.022 × 10²³, called a mole. A mole of any substance weighs its formula mass in grams. Every calculation in this chapter is a trip through moles.</div>

## 1. Atoms, molecules and the mole

The **atomic mass unit** (u) is 1/12 of the mass of a carbon-12 atom. A sodium atom has a mass of about 23 u, an oxygen molecule 32 u.

A **mole** is exactly 6.022 140 76 × 10²³ particles (the **Avogadro number** N_A, fixed exactly since 2019). The trick that makes it useful: **one mole of a substance has a mass in grams equal to its formula mass in u.** So 1 mol of water (18 u per molecule) weighs 18 g.

<figure class="fig" data-fig="mole-map"><figcaption>The mole is the hub: divide a mass by the molar mass to get moles, multiply moles by the Avogadro number to get particles, or by 22.4 L/mol to get a gas volume at STP.</figcaption></figure>

<div class="meaning">
<dl>
<dt>n</dt><dd>amount of substance in moles</dd>
<dt>m</dt><dd>mass in grams</dd>
<dt>M</dt><dd>molar mass in g/mol (formula mass in u, as a number)</dd>
<dt>N</dt><dd>number of particles = n × N_A</dd>
<dt>Physical meaning</dt><dd>n = m/M = N/N_A = V/22.4 (gas at STP). A mole is a counting pack like a dozen, only much larger, chosen so that grams and atomic masses use the same numbers.</dd>
</dl>
</div>

<div class="myth">

**"22.4 L is the volume of a mole of anything."** Only of an ideal **gas** at 0 °C and 1 atm. IUPAC's newer standard (0 °C and 1 bar) gives 22.7 L. Most entrance questions still use 22.4 L at "STP": use whatever the question says. A mole of water is only 18 mL.

</div>

## 2. Laws of chemical combination

| Law | What it says | Example |
|---|---|---|
| Conservation of mass (Lavoisier) | Mass is neither created nor destroyed in a reaction | Mass of reactants = mass of products |
| Definite proportions (Proust) | A compound always has the same elements in the same mass ratio | Water is always 1 : 8 hydrogen to oxygen by mass |
| Multiple proportions (Dalton) | When two elements form several compounds, the masses of one combining with a fixed mass of the other are in small whole-number ratios | CO and CO₂: 16 g and 32 g of O per 12 g C, ratio 1 : 2 |
| Gay-Lussac's gaseous volumes | Gases react in simple whole-number volume ratios (same T and P) | H₂ + Cl₂ → 2HCl: 1 : 1 : 2 by volume |
| Avogadro's law | Equal volumes of gases at the same T and P contain equal numbers of molecules | Explains Gay-Lussac's ratios |

## 3. Formulae from analysis

**Percentage composition** = (mass of element in one mole / molar mass) × 100.

<div class="steps">
<div class="step"><b>Empirical formula from percentages.</b> Take 100 g, so each percentage becomes grams. Example: C 40%, H 6.7%, O 53.3%.</div>
<div class="step"><b>Change grams to moles.</b> C: 40/12 = 3.33; H: 6.7/1 = 6.7; O: 53.3/16 = 3.33.</div>
<div class="step"><b>Divide by the smallest.</b> 3.33 : 6.7 : 3.33 → 1 : 2 : 1. If you get 1.5 or 1.33, multiply all by 2 or 3 to reach whole numbers.</div>
<div class="step"><b>Empirical formula</b> CH₂O (mass 30). <b>Molecular formula</b> = (empirical)ₙ, with n = molar mass / empirical mass. With M = 60, n = 2: C₂H₄O₂ (acetic acid).</div>
</div>

## 4. Stoichiometry and the limiting reagent

A balanced equation is a recipe in **moles**: N₂ + 3H₂ → 2NH₃ means 1 mol N₂ needs 3 mol H₂ and gives 2 mol NH₃. To solve any problem: grams → moles → use the equation's ratio → moles → grams.

The **limiting reagent** is the one that runs out first. Divide each reactant's moles by its coefficient; the smallest result is limiting and sets how much product forms. The other reactant is left in **excess**.

<div class="problem" data-problem="limiting-reagent"></div>

**Percentage yield** = (actual product / theoretical product) × 100. For **reactions in sequence** (A → B → C), multiply the yields of each step. For **simultaneous reactions**, write one equation per reaction and share out the reactant.

<div class="myth">

**"The reactant with the smaller mass is the limiting reagent."** Mass is not the test. Mix 28 g of N₂ (1 mol) with 9 g of H₂ (4.5 mol): hydrogen is the smaller mass, but 1 mol of N₂ needs only 3 mol of H₂, so hydrogen is in excess and the heavier nitrogen runs out first. Always compare moles divided by coefficients.

</div>

## 5. Concentration units

| Unit | Definition | Changes with temperature? |
|---|---|---|
| Mass percent (w/w) | (mass of solute / mass of solution) × 100 | No |
| Mole fraction x | moles of a component / total moles (sum of all = 1) | No |
| Molality m | moles of solute / kg of **solvent** | No |
| Molarity M | moles of solute / litre of **solution** | Yes |
| ppm | parts of solute per million parts of solution (by mass unless stated) | No (by mass) |
| Normality N (JEE Advanced) | gram-equivalents of solute / litre of solution = M × n-factor | Yes |

Useful links: **dilution** `$M_1 V_1 = M_2 V_2$`; **mixing** `$M = \dfrac{M_1V_1 + M_2V_2}{V_1 + V_2}$`; molarity to molality with density d (g/mL) and solute molar mass M₂:

```math
m = \frac{1000\,M}{1000\,d - M\,M_2}
```

<div class="problem" data-problem="molarity-mix"></div>

<div class="problem" data-problem="molality-from-molarity"></div>

**n-factor** (for equivalents): acids, the number of H⁺ given per molecule (H₂SO₄ 2, H₃PO₃ 2 because one H is bonded to P); bases, OH⁻ given; in redox, the electrons gained or lost per formula unit (KMnO₄ in acid 5, in neutral 3, in strong base 1).

<div class="keypoints">

- 1 mol = 6.022 × 10²³ particles; its mass in grams equals the formula mass in u.
- n = m/M = N/N_A = V/22.4 L (ideal gas at STP; 22.7 L at 0 °C and 1 bar).
- Empirical formula: % → grams in 100 g → moles → divide by the smallest → whole numbers.
- Molecular formula = (empirical)ₙ with n = molar mass / empirical formula mass.
- Limiting reagent: smallest moles ÷ coefficient; it decides the product.
- Molality, mole fraction and mass % do not change with temperature; molarity and normality do.
- Dilution M₁V₁ = M₂V₂; normality = molarity × n-factor.

</div>
