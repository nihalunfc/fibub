---
title: Some Basic Concepts of Chemistry
seoTitle: 'Mole Concept Class 11 notes and stoichiometry'
summary: 'Class 11 Chemistry chapter 1 with animations: matter, significant figures, laws of combination, the mole, empirical formulas, limiting reagent, molarity.'
minutes: 85
updated: 2026-11-22
quiz:
  - q: 'How many molecules are in 9.0 g of water (H₂O = 18 g/mol)?'
    choices: ['3.01 × 10²³', '6.022 × 10²³', '9.0 × 10²³', '1.5 × 10²³']
    ans: 0
    why: 'Moles = 9.0/18 = 0.50 mol. Molecules = 0.50 × 6.022 × 10²³ = 3.01 × 10²³.'
  - q: 'A compound has the empirical formula CH₂O and a molar mass of 60 g/mol. Its molecular formula is:'
    choices: ['C₂H₄O₂', 'CH₂O', 'C₃H₆O₃', 'C₂H₂O']
    ans: 0
    why: 'The empirical formula mass is 12 + 2 + 16 = 30. 60/30 = 2, so multiply every subscript by 2: C₂H₄O₂.'
  - q: '10 g of H₂ and 10 g of O₂ are mixed to make water (2H₂ + O₂ → 2H₂O). The limiting reagent is:'
    choices: ['O₂', 'H₂', 'neither', 'water']
    ans: 0
    why: 'n(H₂) = 5 mol needs 2.5 mol O₂. We have only 10/32 = 0.31 mol O₂, so O₂ runs out first.'
sources:
  - 'NCERT Class 11 Chemistry, Chapter 1 “Some Basic Concepts of Chemistry” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Avogadro constant (6.02214076 × 10²³ mol⁻¹, exact) and SI base units: BIPM, The International System of Units (SI), 9th edition (2019)'
  - 'Atomic weights and isotopic abundances: IUPAC Commission on Isotopic Abundances and Atomic Weights, “Atomic weights of the elements 2021”, Pure and Applied Chemistry'
  - 'Molar volume of an ideal gas (22.711 L/mol at 273.15 K and 1 bar): CODATA recommended values'
  - 'Lavoisier (1789), Proust (1799), Dalton (1808), Gay-Lussac (1808), Avogadro (1811) for the history box'
---

**Chemistry · Class 11 · Chapter 1 · about 85 minutes.** By the end you will be able to classify matter, use SI units and significant figures, state the laws of chemical combination, count atoms by weighing them with the mole, find empirical and molecular formulae, balance equations, solve stoichiometry and limiting-reagent problems, and work with molarity, molality and mole fraction.

<div class="bigidea">Atoms are far too small to count, so chemists <b>weigh</b> them. The mole is a counting number, like a “dozen”, but huge: one mole of anything is 6.022 × 10²³ pieces. Because every element has a known mass per mole, a kitchen-balance reading turns into a count of atoms. Every chemistry calculation in this book begins with that one switch: grams to moles.</div>

## 1. Why chemistry, and what is matter?

Chemistry is the study of matter and the changes it goes through. Medicines, fertilisers for the kharif crop, the steel in a train, the soap in your bathroom and the plastic in a water bottle were all designed by chemists who knew how atoms combine.

**Matter** is anything that has mass and takes up space. It exists in three common states: **solid** (fixed shape and volume), **liquid** (fixed volume, takes the shape of the pot) and **gas** (fills the whole container). Particles in a solid are packed and only vibrate; in a gas they are far apart and fly about.

Matter is sorted by what it is made of. A **pure substance** has a fixed composition; it is an **element** (one kind of atom: iron, oxygen) or a **compound** (different atoms joined in a fixed ratio: water, sugar). A **mixture** has parts in any amount; it is **homogeneous** if it is uniform (salt solution, air) and **heterogeneous** if you can see the parts (muddy water, dal with rice). Mixtures are separated by physical methods such as filtering, evaporation or distillation; compounds only by chemical changes.

<figure class="fig" data-fig="c11c-basic-classify"><figcaption>Pick a sample and follow the lit-up path through the tree of matter. Ask yourself: can I separate it by a physical method (mixture) or only by a chemical reaction (compound)?</figcaption></figure>

<div class="myth">

**“Air is a compound because it is clear and uniform.”** It is a homogeneous *mixture*: nitrogen, oxygen and argon are simply mixed and keep their own properties. Their share can change (the air on a hill has less oxygen), which a compound’s fixed ratio never does.

</div>

## 2. Measurement: SI units, mass, weight and significant figures

Chemistry needs numbers, and numbers need units. The seven SI base quantities that chemists meet most are length (metre, m), mass (kilogram, kg), time (second, s), temperature (kelvin, K), amount of substance (**mole, mol**), electric current (ampere, A) and luminous intensity (candela, cd). Everything else is derived: volume in m³ (but chemists use the litre, 1 L = 1 dm³ = 1000 mL), density in kg m⁻³ (or g mL⁻¹), pressure in pascal.

| Prefix | Symbol | Meaning |
|---|---|---|
| kilo | k | 10³ |
| centi | c | 10⁻² |
| milli | m | 10⁻³ |
| micro | µ | 10⁻⁶ |
| nano | n | 10⁻⁹ |
| pico | p | 10⁻¹² |

**Mass** is how much matter a body has; it is the same on Earth or the Moon. **Weight** is the pull of gravity on that mass, so it changes from place to place. A balance in a lab measures mass. Temperature is converted by `$T(\text{K}) = t(^\circ\text{C}) + 273.15$`.

**Precision and accuracy.** Precision is how close repeated readings are to *each other*; accuracy is how close they are to the *true value*. A bowler who always lands the ball on the same wrong spot is precise but not accurate.

**Significant figures** are the digits that carry real information: all the digits you are sure of and the first uncertain one. The rules are short:

1. All non-zero digits count (426 has 3).
2. Zeros between non-zero digits count (5004 has 4).
3. Leading zeros never count (0.0042 has 2).
4. Trailing zeros count only if there is a decimal point (4.200 has 4; 1200 is unclear, so write 1.2 × 10³ or 1.20 × 10³).

<figure class="fig" data-fig="c11c-basic-sigfig"><figcaption>Choose a number and see which digits are coloured (significant) and which are grey place-holders. Notice that 1200 and 1.20 × 10³ are different claims about how well you measured.</figcaption></figure>

When you **add or subtract**, keep as many *decimal places* as the least precise number. When you **multiply or divide**, keep as many *significant figures* as the least precise number. Round at the end, not in the middle.

**Dimensional analysis** (the factor-label method) converts units by multiplying by fractions equal to 1. To change 72 km/h to m/s: `$72\ \dfrac{\text{km}}{\text{h}} \times \dfrac{1000\ \text{m}}{1\ \text{km}} \times \dfrac{1\ \text{h}}{3600\ \text{s}} = 20\ \text{m/s}$`. If the units cancel to what you want, the setup is right.

## 3. Laws of chemical combination

Four laws, found by careful weighing between 1780 and 1811, led to the atomic theory.

1. **Law of conservation of mass (Lavoisier, 1789).** In a chemical reaction mass is neither created nor destroyed. Burn 24 g of magnesium in oxygen and the white ash weighs exactly the mass of the metal plus the oxygen it took from the air.
2. **Law of constant (definite) proportions (Proust, 1799).** A pure compound always contains the same elements in the same proportion by mass, wherever it comes from. Water from the Ganga and from a tap both have 8 g of oxygen for every 1 g of hydrogen.
3. **Law of multiple proportions (Dalton, 1803).** If two elements form more than one compound, the masses of one that combine with a fixed mass of the other are in a ratio of small whole numbers. Carbon monoxide has 16 g of oxygen per 12 g of carbon, carbon dioxide has 32 g: 16 : 32 = 1 : 2.
4. **Gay-Lussac’s law of gaseous volumes (1808).** Gases react in volumes that are small whole-number ratios, at the same temperature and pressure: 2 L H₂ + 1 L O₂ → 2 L steam.

<figure class="fig" data-fig="c11c-basic-laws"><figcaption>Four demonstrations. Switch between the laws; for conservation of mass slide the amount of magnesium and watch the “before” and “after” bars stay equal.</figcaption></figure>

**Avogadro’s law (1811)** explained Gay-Lussac: equal volumes of all gases at the same temperature and pressure hold the same number of molecules. That is why gas volumes come in whole-number ratios: they are whole-number ratios of molecules. Explore the first three laws with real data in [Constant proportions](/learn/constant-proportions/).

<div class="history">

<ul class="timeline">
<li><b>1789</b> Antoine Lavoisier weighs reactants and products carefully and states conservation of mass.</li>
<li><b>1799</b> Joseph Proust shows that copper carbonate has the same composition from any source.</li>
<li><b>1808</b> John Dalton publishes his atomic theory: elements are made of indivisible atoms, atoms of one element are identical, compounds form from atoms in fixed whole-number ratios, and atoms are only rearranged in reactions. Gay-Lussac finds his law of volumes.</li>
<li><b>1811</b> Amedeo Avogadro proposes that equal volumes of gases hold equal numbers of molecules.</li>
<li><b>2019</b> The mole is redefined by fixing N<sub>A</sub> = 6.02214076 × 10²³ exactly.</li>
</ul>

</div>

## 4. Dalton’s atomic theory and atomic mass

Dalton’s picture still holds in the main (although we now know atoms are made of smaller particles and an element can have atoms of slightly different mass, the **isotopes**). Atoms are far too light to weigh in grams (a carbon atom is 1.99 × 10⁻²³ g), so we weigh them against a standard: the **unified atomic mass unit**, `$1\ \text{u} = \tfrac{1}{12}$` of the mass of one carbon-12 atom = 1.66 × 10⁻²⁷ kg.

The **atomic mass** of an element on the periodic table is an *average* over its isotopes, weighted by how common each is. Chlorine has two isotopes, ³⁵Cl (75.8 %) and ³⁷Cl (24.2 %), so

```math
\bar{A} = \frac{75.8}{100}(34.969) + \frac{24.2}{100}(36.966) = 35.45\ \text{u}
```

That is why no single chlorine atom weighs 35.45 u. The **molecular mass** is the sum of the atomic masses in the formula: H₂O = 2(1.008) + 16.00 = 18.02 u. For ionic solids such as NaCl, where there are no separate molecules, we say **formula mass** (58.44 u).

<figure class="fig" data-fig="c11c-basic-isotope"><figcaption>Choose an element and drag the abundance of its lighter isotope. The weighted average moves between the two isotope masses; set it to the real value to recover the periodic-table number.</figcaption></figure>

<div class="problem" data-problem="c11c-basic-avgmass"></div>

## 5. The mole and molar mass

One **mole** is the amount of substance that contains as many elementary entities (atoms, molecules, ions) as there are atoms in exactly 12 g of carbon-12. That number is the **Avogadro constant**, `$N_A = 6.022\times10^{23}\ \text{mol}^{-1}$`. Think of it as a “chemist’s dozen”: a dozen eggs is 12 eggs; a mole of eggs would cover India many times over.

The **molar mass** M of a substance is the mass of one mole of it, in g/mol. It equals the atomic, molecular or formula mass in u, written in grams. So the molar mass of water is 18.02 g/mol, of CO₂ 44.01 g/mol, of NaCl 58.44 g/mol.

```math
n = \frac{m}{M}, \qquad N = n\,N_A, \qquad V_{\text{gas}} = n \times 22.7\ \text{L (273.15 K, 1 bar)}
```

<div class="meaning">

<dl>
<dt>n</dt><dd>amount of substance in moles</dd>
<dt>m, M</dt><dd>mass in grams, molar mass in g/mol</dd>
<dt>N</dt><dd>number of particles</dd>
<dt>22.7 L</dt><dd>molar volume of any ideal gas at 273.15 K (0 °C) and 1 bar. At 1 atm it is 22.4 L, the value many older books use. Check which one your question wants.</dd>
<dt>Physical meaning</dt><dd>The molar mass is the bridge between the world you can weigh and the world you cannot see. 18 g of water (one small sip) holds 6.022 × 10²³ molecules.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11c-basic-mole"><figcaption>The mole bridge. Choose a substance, slide the mass and watch the amount in moles and the number of particles. Each dot stands for a round number of particles, since the real count has 20 or more digits.</figcaption></figure>

<div class="problem" data-problem="c11c-basic-particles"></div>

Try any substance or formula, with the working shown, in the Mole Bridge:

<!--fig:tool mole-bridge-->

You can also get the molar mass of any formula from the [Molar mass calculator](/science/molar-mass-calculator/).

<div class="myth">

**“A mole of oxygen is 16 g.”** Oxygen gas is O₂, so one mole of molecules is 32 g, while one mole of oxygen *atoms* is 16 g. Always say what the entity is: “1 mol of O atoms” or “1 mol of O₂ molecules”.

</div>

## 6. Percentage composition, empirical and molecular formulae

The **mass percent** of an element in a compound is `$\dfrac{\text{mass of the element in 1 mol}}{\text{molar mass}}\times100$`. For calcium carbonate CaCO₃ (100 g/mol): Ca is 40/100 = 40 %, C is 12 %, O is 48 %.

<div class="problem" data-problem="c11c-basic-percent"></div>

The **empirical formula** gives the simplest whole-number ratio of atoms; the **molecular formula** gives the actual numbers. Glucose is C₆H₁₂O₆ (molecular) but CH₂O (empirical). The molecular formula is a whole-number multiple of the empirical one: `$\text{molecular formula} = (\text{empirical formula})\times n$` with `$n = \dfrac{\text{molar mass}}{\text{empirical formula mass}}$`.

To find the empirical formula from percent composition, follow the steps below.

<div class="steps" data-fig="c11c-basic-empirical">
<div class="step">Start with the data: a compound is 40.0 % carbon, 6.7 % hydrogen and 53.3 % oxygen by mass.</div>
<div class="step">Assume 100 g of compound, so the percentages become grams: 40.0 g C, 6.7 g H, 53.3 g O.</div>
<div class="step">Divide each mass by its atomic mass to get moles: C = 3.33, H = 6.70, O = 3.33.</div>
<div class="step">Divide all by the smallest (3.33): C = 1.00, H = 2.01, O = 1.00.</div>
<div class="step">Round to whole numbers (if you get 1.5 or 1.33, multiply every number by 2 or 3): CH₂O. With a molar mass of 180 g/mol, n = 180/30 = 6, so the molecular formula is C₆H₁₂O₆.</div>
</div>

<div class="problem" data-problem="c11c-basic-empirical"></div>

## 7. Chemical equations and stoichiometry

A **balanced equation** has the same number of each kind of atom on both sides, because atoms are only rearranged (conservation of mass). The big numbers in front are **coefficients**; you may change them, but never the small subscripts inside a formula (that would change the substance).

<div class="steps" data-fig="c11c-basic-balance">
<div class="step">Write the formulae and count each atom: Fe + O₂ → Fe₂O₃ has 1 Fe and 2 O on the left, 2 Fe and 3 O on the right.</div>
<div class="step">Fix iron first: put 2 in front of Fe so both sides have 2 Fe.</div>
<div class="step">Oxygen is 2 per O₂ (always even) against 3 per Fe₂O₃ (odd). The smallest common amount is 6 O: 3 O₂ on the left and 2 Fe₂O₃ on the right.</div>
<div class="step">Fe now needs to be 4 on the left to match 2 × 2 on the right. Check every atom: 4 Fe, 6 O each side. Balanced: 4Fe + 3O₂ → 2Fe₂O₃.</div>
</div>

**Stoichiometry** is the arithmetic of balanced equations. The coefficients are the **mole ratio**. In `$2\,\text{H}_2 + \text{O}_2 \to 2\,\text{H}_2\text{O}$`, 2 mol of H₂ makes 2 mol of water and needs 1 mol of O₂. Always follow the same four hops: *grams of A → moles of A → moles of B → grams of B*.

<div class="steps" data-fig="c11c-basic-stoich">
<div class="step">Question: how much water comes from 8.0 g of hydrogen burning in plenty of oxygen? Equation: 2 H₂ + O₂ → 2 H₂O.</div>
<div class="step">Hop 1: grams to moles. 8.0 g ÷ 2.0 g/mol = 4.0 mol of H₂.</div>
<div class="step">Hop 2: mole ratio. The equation says 2 mol H₂ gives 2 mol H₂O, so 4.0 mol H₂ gives 4.0 mol H₂O.</div>
<div class="step">Hop 3: moles to grams. 4.0 mol × 18 g/mol = 72 g of water. Check: 8 g H₂ + 64 g O₂ = 72 g, so mass is conserved.</div>
</div>

Practise the mole-ratio step with the [Reaction equivalents](/science/reaction-equivalents/) tool, or try the mixed-quantity version here:

<!--fig:tool reaction-equivalents-->

### Limiting reagent and percentage yield

Reactants are rarely mixed in exactly the right ratio. The reactant that runs out first is the **limiting reagent**; it decides how much product forms, and the other is **in excess**. A cook with 10 rotis and 3 bowls of sabzi can serve only 3 plates; sabzi is limiting. In chemistry: find the moles of each, divide each by its coefficient, and the **smaller** number is the limiting reagent.

<figure class="fig" data-fig="@chem-limiting-reagent"><figcaption>N₂ + 3H₂ → 2NH₃ with real dots. Set the moles of each reactant, press React, and see which one runs out and what is left over.</figcaption></figure>

<div class="problem" data-problem="c11c-basic-limiting"></div>

The amount you calculate is the **theoretical yield**. In real life some product is lost (side reactions, spills), so `$\%\ \text{yield} = \dfrac{\text{actual yield}}{\text{theoretical yield}}\times100$`. Industrial chemists celebrate 90 %.

<div class="myth">

**“The reactant with the smaller mass is the limiting reagent.”** Mass alone tells you nothing. 4 g of hydrogen is 2 mol, while 32 g of oxygen is 1 mol: hydrogen has the smaller mass but the larger number of moles. Compare moles divided by coefficients.

</div>

## 8. Reactions in solutions: concentration

Most laboratory reactions happen in solution. The **solute** is dissolved in the **solvent**. The concentration units to know:

```math
\text{mass \%} = \frac{\text{mass of solute}}{\text{mass of solution}}\times100,\quad
M = \frac{n_{\text{solute}}}{V_{\text{solution in L}}},\quad
m = \frac{n_{\text{solute}}}{\text{kg of solvent}},\quad
x_A = \frac{n_A}{n_A+n_B}
```

Molarity (M, mol/L) is the most used but depends on temperature because volume does. Molality (m) and mole fraction (x) use masses and moles only, so they do not change on heating. The mole fractions in a mixture add to 1.

**Dilution.** Adding solvent does not add or remove solute, so the moles stay the same: `$M_1V_1 = M_2V_2$`. To make 500 mL of 0.1 M acid from a 10 M stock, you need 0.1 × 500/10 = 5 mL of stock, then water to 500 mL (always add acid to water, never the reverse).

<figure class="fig" data-fig="c11c-basic-dilution"><figcaption>Dilute a solution. The solute dots never change in number; only the volume grows and the colour fades. Note how M₂ follows M₁V₁/V₂.</figcaption></figure>

<div class="problem" data-problem="c11c-basic-dilute"></div>

Convert between every unit with the working shown:

<!--fig:tool concentration-converter-->

Two solutions can be mixed in a reaction by counting the moles in each: moles = M × V(litres). For example, 25 mL of 0.1 M HCl neutralises exactly 25 mL of 0.1 M NaOH (HCl + NaOH → NaCl + H₂O, a 1 : 1 ratio) because both hold 0.0025 mol.

<div class="keypoints">

- Matter: pure substance (element or compound) or mixture (homogeneous or heterogeneous). Mixtures separate physically.
- Significant figures: leading zeros never count; trailing zeros count after a decimal point. Add by decimal places, multiply by significant figures.
- Four laws: conservation of mass, constant proportions, multiple proportions, Gay-Lussac’s volumes; Avogadro’s law explains the last.
- 1 mol = 6.022 × 10²³ entities; `$n = m/M$`; `$N = nN_A$`; 22.7 L per mole of gas at 273.15 K and 1 bar.
- Empirical formula: percent to grams to moles to whole-number ratio; molecular = empirical × (M / empirical mass).
- Stoichiometry always goes grams, moles, mole ratio, moles, grams. The limiting reagent has the smallest moles divided by coefficient.
- Molarity needs volume of solution; molality needs mass of solvent; M₁V₁ = M₂V₂ on dilution.

</div>

Going further for JEE/NEET: the exam-level problems on equivalent concept, average molar mass, successive reactions and concentration of mixed solutions are in [Some basic concepts: moles and stoichiometry (JEE and NEET)](/learn/courses/engineering-entrance/mole-concept/).
