---
title: 'Solutions and colligative properties'
seoTitle: 'Solutions and colligative properties: JEE and NEET chemistry'
summary: 'Concentration terms, Henry''s law, Raoult''s law, ideal and non-ideal solutions, azeotropes, the four colligative properties, molar mass from each, and the van''t Hoff factor for dissociation and association, from basics to JEE Advanced depth.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'Which 0.1 mol/kg aqueous solution has the lowest freezing point?'
    choices: ['Glucose', 'NaCl', 'CaCl₂', 'Urea']
    ans: 2
    why: 'Freezing point depression depends on the number of particles. CaCl₂ gives 3 ions (i ≈ 3), NaCl 2, glucose and urea 1. The biggest depression means the lowest freezing point.'
  - q: 'A mixture of acetone and chloroform shows a negative deviation from Raoult''s law. Which is true?'
    choices: ['ΔH_mix > 0 and the volume grows', 'ΔH_mix < 0 and the volume shrinks', 'ΔH_mix = 0', 'It forms a minimum-boiling azeotrope']
    ans: 1
    why: 'A hydrogen bond forms between chloroform''s H and acetone''s O, so A-B attraction is stronger than A-A and B-B. Heat is released, the liquids pack closer, the vapour pressure drops and a maximum-boiling azeotrope forms.'
  - q: 'Acetic acid dimerises completely in benzene. Its van''t Hoff factor there is:'
    choices: ['2', '1', '0.5', '0.25']
    ans: 2
    why: 'Two molecules join into one dimer, so the number of particles halves: i = 1/2. The measured molar mass comes out doubled, about 120 g/mol.'
sources:
  - 'NEET (UG), JEE Main and JEE Advanced 2026 syllabi: Solutions'
  - 'Cryoscopic and ebullioscopic constants of water (K_f 1.86, K_b 0.52 K kg/mol), CRC Handbook of Chemistry and Physics, 97th edition'
  - 'IUPAC Gold Book: colligative properties, van''t Hoff factor, azeotrope https://goldbook.iupac.org'
---

**Chemistry · Class 12 · about 34 minutes.** By the end you will be able to choose the right concentration unit, use Henry's and Raoult's laws, tell ideal from non-ideal solutions, calculate any colligative property and find a molar mass from it, and correct for dissociation or association with the van't Hoff factor.

<div class="bigidea">Dissolved particles get in the way of the solvent. They cut down how fast solvent molecules escape into the vapour, how easily they freeze, and how freely they cross a membrane. For dilute solutions the effect depends only on how many particles there are, not on what they are: that is what "colligative" means.</div>

## 1. Concentration terms you will use here

A **solution** is a uniform mixture; the part present in the largest amount is the **solvent**, the rest are **solutes**. Colligative formulas use **molality** m (moles of solute per kg of solvent) and **mole fraction** x, because both stay the same when the temperature changes. Molarity (per litre of solution) is used in osmotic pressure. Revise all units in [Some basic concepts: moles and stoichiometry](/learn/courses/engineering-entrance/mole-concept/).

## 2. Gases in liquids: Henry's law

At a fixed temperature, the amount of a gas that dissolves is proportional to its partial pressure above the liquid:

```math
p = K_H\, x
```

A **larger K_H means a less soluble gas** (you need more pressure for the same mole fraction). Gas solubility **falls as temperature rises**, because dissolving a gas releases heat. Everyday links: soda bottles are sealed under high CO₂ pressure and fizz when opened; deep-sea divers breathe air diluted with helium to avoid "the bends" (nitrogen dissolved in blood bubbling out on rising); climbers at altitude get less oxygen into the blood (low partial pressure).

## 3. Liquids in liquids: Raoult's law

For a solution of two volatile liquids A and B, each one's partial vapour pressure equals its mole fraction times its pure vapour pressure:

```math
p_A = x_A\,p_A^\circ,\qquad p_B = x_B\,p_B^\circ,\qquad P_{total} = p_A + p_B
```

The total pressure is a straight line between p°_B (at x_A = 0) and p°_A (at x_A = 1). The **vapour** is always richer in the more volatile liquid: y_A = p_A / P_total. That is why distillation can separate them.

<figure class="fig" data-fig="sol-vapour-pressure"><figcaption>Move x_A to see the two partial pressures and the total. Switch to positive or negative deviation: the total curve bows above or below the ideal straight line.</figcaption></figure>

<div class="meaning">
<dl>
<dt>p°_A</dt><dd>vapour pressure of pure A at that temperature</dd>
<dt>x_A, y_A</dt><dd>mole fraction of A in the liquid, and in the vapour</dd>
<dt>K_H</dt><dd>Henry's constant of a gas in a solvent (pressure units)</dd>
<dt>m</dt><dd>molality, mol of solute per kg of solvent</dd>
<dt>K_f, K_b</dt><dd>freezing point and boiling point constants of the solvent (K kg/mol); water 1.86 and 0.52</dd>
<dt>π</dt><dd>osmotic pressure; C is molarity, R the gas constant, T in kelvin</dd>
<dt>i</dt><dd>van't Hoff factor: particles actually present ÷ formula units dissolved</dd>
<dt>Physical meaning</dt><dd>Each formula says the same thing: the more solute particles crowd the solvent, the bigger the change.</dd>
</dl>
</div>

<div class="problem" data-problem="sol-vapour-y"></div>

## 4. Ideal and non-ideal solutions

An **ideal solution** obeys Raoult's law at every composition. That happens when A-B attractions are just like A-A and B-B ones: **ΔH_mix = 0, ΔV_mix = 0**. Benzene with toluene, and n-hexane with n-heptane, come close.

| | Positive deviation | Negative deviation |
|---|---|---|
| A-B attraction | weaker than A-A, B-B | stronger than A-A, B-B |
| Vapour pressure | higher than Raoult predicts | lower than Raoult predicts |
| ΔH_mix, ΔV_mix | both positive (cools, expands) | both negative (warms, shrinks) |
| Examples | ethanol + water, acetone + CS₂, ethanol + cyclohexane | acetone + chloroform, HNO₃ + water, HCl + water, phenol + aniline |
| Azeotrope | minimum-boiling (ethanol-water, 95.6% ethanol) | maximum-boiling (HNO₃-water, about 68% HNO₃) |

An **azeotrope** boils at a fixed temperature with vapour of the same composition as the liquid, so simple distillation cannot separate it further. This is why rectified spirit stops at about 95.6% ethanol.

<div class="myth">

**"Negative deviation means the mixture boils at a lower temperature."** The reverse. Lower vapour pressure means the liquid must be heated more to reach atmospheric pressure, so negative deviation gives a **maximum**-boiling azeotrope. Positive deviation (higher vapour pressure) gives a **minimum**-boiling one.

</div>

## 5. The four colligative properties

For a **non-volatile** solute in a dilute solution:

| Property | Formula | What you measure |
|---|---|---|
| Relative lowering of vapour pressure | `$\dfrac{p^\circ - p}{p^\circ} = x_{solute}$` | vapour pressure |
| Elevation of boiling point | `$\Delta T_b = K_b\, m$` | boiling point rises |
| Depression of freezing point | `$\Delta T_f = K_f\, m$` | freezing point falls |
| Osmotic pressure | `$\pi = C R T$` | pressure to stop osmosis |

**Why boiling rises and freezing falls.** The solute lowers the solvent's vapour pressure at every temperature, so the liquid must get hotter to reach 1 atm (boiling point up). At the other end, the solid solvent (pure ice) and the solution now have equal vapour pressures only at a lower temperature (freezing point down).

**Osmosis** is the flow of solvent through a semipermeable membrane from the dilute side to the concentrated side. The osmotic pressure π is the extra pressure that stops it. Solutions with equal π are **isotonic** (0.9% NaCl, "normal saline", is isotonic with blood). A cell in a **hypotonic** solution swells; in a **hypertonic** one it shrinks. Pressing harder than π pushes solvent the other way: **reverse osmosis**, used to purify sea water.

**Molar mass from any of them.** Put m = (w₂/M₂) × 1000/W₁ (w₂ g of solute, W₁ g of solvent) and solve for M₂. For example `$M_2 = \dfrac{1000\,K_f\,w_2}{\Delta T_f\,W_1}$`. Osmotic pressure is the best method for **proteins and polymers**: their molar masses are huge, so ΔT_f would be too small to read, but π is measurable at room temperature.

<div class="problem" data-problem="sol-fp-molar-mass"></div>

**Worked example (level 3).** 18 g of glucose in 1 kg of water: m = 0.1 mol/kg, so ΔT_b = 0.52 × 0.1 = 0.052 K (boils at 100.052 °C) and ΔT_f = 1.86 × 0.1 = 0.186 K (freezes at −0.186 °C). The relative lowering of vapour pressure is x = 0.1/(0.1 + 55.5) = 0.0018.

**Try it:** let the solution take in water, then push on the piston with a pressure larger than π (reverse osmosis).

<figure class="fig" data-fig="@chem-osmosis"><figcaption>Water crosses the membrane toward the more concentrated side until the piston pressure matches π = CRT. Push harder than that and the flow reverses: this is how reverse-osmosis plants make fresh water from seawater.</figcaption></figure>

## 6. The van't Hoff factor: dissociation and association

Electrolytes split into ions; some solutes stick together. Colligative properties count the **actual** particles, so every formula gets a factor i:

```math
\Delta T_f = i\,K_f\,m,\qquad \Delta T_b = i\,K_b\,m,\qquad \pi = i\,C R T
```

- **Dissociation** into ν ions with degree α: `$i = 1 + \alpha(\nu - 1)$`. NaCl fully ionised: i = 2; K₄[Fe(CN)₆]: ν = 5.
- **Association** of n molecules into one with degree α: `$i = 1 - \alpha\left(1 - \tfrac{1}{n}\right)$`. Acetic acid in benzene forms dimers (n = 2), so i is near 0.5.
- i = (normal molar mass) / (observed molar mass) = (observed colligative effect) / (calculated effect). Dissociation makes the observed molar mass **too small**; association makes it **too large**.

<div class="problem" data-problem="sol-vant-hoff"></div>

<div class="myth">

**"Two 0.1 M solutions are always isotonic."** Only if they give the same number of particles. 0.1 M glucose and 0.1 M NaCl are not isotonic: the salt solution has nearly twice the osmotic pressure. Compare i × C, not C.

</div>

**JEE Advanced touch.** For a volatile solute, Raoult's law for both components replaces the colligative formula. For a solution where the solute is not dilute, use `$\dfrac{p^\circ - p}{p^\circ} = \dfrac{n_2}{n_1 + n_2}$` exactly, or in the convenient form `$\dfrac{p^\circ - p}{p} = \dfrac{n_2}{n_1}$`. When ice separates on cooling a solution, the remaining solution gets more concentrated, so its freezing point keeps falling.

<div class="keypoints">

- Henry: p = K_H x; bigger K_H, less soluble; gas solubility falls with heat.
- Raoult: p_A = x_A p°_A; vapour is richer in the more volatile liquid.
- Ideal: ΔH_mix = ΔV_mix = 0. Positive deviation: weaker A-B forces, minimum-boiling azeotrope. Negative: stronger A-B forces, maximum-boiling azeotrope.
- Colligative: Δp/p° = x₂; ΔT_b = iK_b m; ΔT_f = iK_f m; π = iCRT.
- Molar mass: put m = (w₂/M₂)(1000/W₁) and solve; osmotic pressure for polymers and proteins.
- i = 1 + α(ν − 1) for dissociation; i = 1 − α(1 − 1/n) for association.
- Abnormal molar mass: too small means dissociation, too large means association.

</div>
