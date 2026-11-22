---
title: Solutions
seoTitle: 'Solutions Class 12 notes: Raoult, colligative properties'
summary: 'Class 12 Solutions with animations: concentration units, Henry and Raoult laws, colligative properties, osmosis, molar mass and the van''t Hoff factor.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: '9.0 g of glucose (180 g/mol) is dissolved in 500 g of water. The molality is:'
    choices: ['0.10 mol/kg', '0.018 mol/kg', '0.050 mol/kg', '1.0 mol/kg']
    ans: 0
    why: 'Moles = 9.0/180 = 0.050 mol. Mass of solvent = 0.500 kg. Molality = 0.050/0.500 = 0.10 mol/kg.'
  - q: 'A mixture of two liquids shows a NEGATIVE deviation from Raoult''s law. This means that:'
    choices: ['A–B attractions are stronger than A–A and B–B, and ΔH(mixing) is negative', 'A–B attractions are weaker than A–A and B–B, and ΔH(mixing) is positive', 'the vapour pressure is higher than Raoult predicts', 'the solution is ideal']
    ans: 0
    why: 'Stronger A–B attractions hold the molecules in the liquid, so the vapour pressure is lower than the ideal value, and the mixing gives out heat (ΔH < 0, ΔV < 0).'
  - q: 'Which 0.1 molal aqueous solution has the lowest freezing point (assume complete dissociation)?'
    choices: ['glucose', 'NaCl', 'K₂SO₄', 'urea']
    ans: 2
    why: 'Depression of freezing point is ΔTf = i Kf m. K₂SO₄ gives 3 particles (i = 3), NaCl gives 2, glucose and urea give 1. The largest i gives the largest depression.'
sources:
  - 'NCERT Class 12 Chemistry, Chapter 1 “Solutions” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Ebullioscopic and cryoscopic constants of solvents: CRC Handbook of Chemistry and Physics, 97th edition, “Cryoscopic and ebullioscopic constants”'
  - 'Henry''s law constants of gases in water: Sander, R. (2015), “Compilation of Henry''s law constants (version 4.0) for water as solvent”, Atmospheric Chemistry and Physics 15, 4399–4981'
  - 'Vapour pressure of water at 25 °C (23.8 mmHg): CRC Handbook of Chemistry and Physics, 97th edition, “Vapor pressure of water”'
  - 'Raoult, F.-M. (1887), Comptes rendus 104, and van''t Hoff, J. H. (1887), Zeitschrift für physikalische Chemie 1, 481 (for the history box)'
---

**Chemistry · Class 12 · Chapter 1 · about 90 minutes.** By the end you will be able to express the concentration of a solution in every common unit, use Henry’s and Raoult’s laws, explain why some mixtures deviate from Raoult’s law, calculate the four colligative properties, find molar masses from them, and correct them with the van’t Hoff factor.

<div class="bigidea">Dissolve something in a liquid and the liquid’s own molecules have less “room” to escape, boil or freeze. How much less depends only on <b>how many</b> solute particles there are, not on what they are. That is why a pinch of salt on an icy road, a spoonful of sugar in boiling water and a drop of seawater against a fish’s cell all follow one idea: counting particles.</div>

## 1. What is a solution, and how do we say how much is in it?

A **solution** is a homogeneous mixture of two or more substances: you cannot see its parts, and every drop is the same. The part present in larger amount is the **solvent**; the others are **solutes**. Solutions can be solid, liquid or gas (air is a gas solution, brass a solid one, sugar in water a liquid one), but this chapter is about **liquid solutions of a solid, liquid or gas in a liquid**.

The same solution can be described in different ways. Which one you pick depends on whether temperature matters and what you are measuring.

```math
\text{mass \%} = \frac{\text{mass of solute}}{\text{mass of solution}}\times100, \qquad \text{ppm} = \frac{\text{mass of solute}}{\text{mass of solution}}\times10^6
```

```math
x_2 = \frac{n_2}{n_1+n_2}, \qquad m = \frac{n_2}{\text{kg of solvent}}, \qquad M = \frac{n_2}{\text{litres of solution}}
```

<div class="meaning">

<dl>
<dt>n₁, n₂</dt><dd>moles of solvent (1) and solute (2)</dd>
<dt>x₂</dt><dd>mole fraction of the solute: a pure number between 0 and 1. The mole fractions of all parts add to 1.</dd>
<dt>m (molality)</dt><dd>moles of solute per kilogram of SOLVENT, mol/kg</dd>
<dt>M (molarity)</dt><dd>moles of solute per litre of SOLUTION, mol/L</dd>
<dt>Physical meaning</dt><dd>Molality and mole fraction count in masses and moles, so they never change with temperature. Molarity uses a volume, and a liquid expands when warmed, so molarity falls a little as the solution gets hotter. Colligative-property formulas use molality for exactly this reason.</dd>
</dl>

</div>

<figure class="fig" data-fig="c12c-sol-conc"><figcaption>One beaker, five ways to describe it. Change the solute, its mass, the mass of water and the density, and watch every unit update. Two strips show the same mixture by mass and by moles: a heavy solute can be a large share of the mass and a tiny share of the moles.</figcaption></figure>

Most exam questions give a mass percent and a density and ask for molarity or molality. The trick is to **choose 100 g of solution**, and everything follows.

<div class="steps" data-fig="c12c-sol-concsteps">
<div class="step">Choose 100 g of solution. For concentrated HCl that is 37 % by mass with a density of 1.19 g/mL, the picture is a 100 g sample.</div>
<div class="step">The percent gives the masses at once: 37 g HCl and 100 − 37 = 63 g water (0.063 kg of solvent).</div>
<div class="step">Change masses to moles: n(HCl) = 37/36.5 = 1.014 mol, n(water) = 63/18 = 3.50 mol.</div>
<div class="step">Molality = 1.014 mol / 0.063 kg = 16.1 mol/kg. Mole fraction of HCl = 1.014 / (1.014 + 3.50) = 0.225.</div>
<div class="step">Molarity needs the volume of the solution: 100 g / 1.19 g/mL = 84.0 mL = 0.0840 L, so M = 1.014 / 0.0840 = 12.1 mol/L.</div>
</div>

<div class="problem" data-problem="c12c-sol-molality"></div>

<div class="problem" data-problem="c12c-sol-molarity"></div>

Convert between any of these units, with the working shown, in the converter below:

<!--fig:tool concentration-converter-->

<div class="myth">

**“Molarity and molality are the same thing.”** They are not. Molality divides by the kilograms of **solvent**; molarity divides by the litres of the whole **solution**. For dilute water solutions the numbers are close, but for 37 % HCl they are 16.1 and 12.1.

</div>

## 2. Solubility and Henry’s law

**Solubility** is the maximum amount of solute that dissolves in a given amount of solvent at a given temperature. When no more dissolves, the solution is **saturated**: dissolving and crystallising go on at equal rates (dynamic equilibrium). “Like dissolves like”: polar solutes dissolve in polar solvents (salt, sugar in water), non-polar in non-polar (grease in petrol).

**Gases in liquids.** More gas dissolves when the pressure above the liquid is higher. **Henry’s law:** the mole fraction of a gas dissolved in a liquid is proportional to the partial pressure of the gas above it:

```math
p = K_H\,x \qquad\Longleftrightarrow\qquad x = \frac{p}{K_H}
```

A **larger** K<sub>H</sub> means a **less** soluble gas at the same pressure. K<sub>H</sub> rises with temperature, so gases are **less** soluble in warm water. Dissolving a gas gives out heat, so by Le Chatelier’s principle heating pushes it back out.

<figure class="fig" data-fig="c12c-sol-henry"><figcaption>Gas above water. Choose the gas, raise the pressure, then warm the water. Dissolved dots grow in proportion to the pressure and fade as the temperature rises. CO₂ (K<sub>H</sub> small) dissolves hundreds of times more than N₂ or He at the same pressure.</figcaption></figure>

<div class="problem" data-problem="c12c-sol-henry"></div>

**Everyday uses.** Soda bottles are sealed under high CO₂ pressure; opening one lowers the pressure and the gas fizzes out. Scuba divers breathe air at high pressure, so more nitrogen dissolves in the blood; if they rise too fast, the nitrogen bubbles out (the bends). Divers therefore breathe helium–oxygen mixtures at great depth because helium is much less soluble. People at high altitude have low oxygen in the blood because the partial pressure of oxygen is low, so they feel weak and confused (altitude sickness). Fish in warm ponds gasp more because the warmer water holds less oxygen.

Try Henry’s law with real data for many gases: [Henry’s law tool](/learn/henrys-law/).

## 3. Vapour pressure and Raoult’s law

A liquid in a closed container evaporates until the vapour above it is in equilibrium with the liquid. The pressure of this vapour is the **vapour pressure** p°; it rises with temperature.

When two **volatile** liquids A and B are mixed, each has a **partial pressure** in the vapour. **Raoult’s law:** the partial pressure of each component is its mole fraction in the liquid times its pressure when pure:

```math
p_A = x_A\,p_A^{\circ},\qquad p_B = x_B\,p_B^{\circ},\qquad p_{total} = p_A + p_B = p_A^{\circ} + (p_B^{\circ}-p_A^{\circ})\,x_B
```

The total is a straight line from p°<sub>A</sub> (pure A) to p°<sub>B</sub> (pure B). A mixture that obeys this at every composition is called an **ideal solution**.

**A non-volatile solute** (sugar, salt) does not appear in the vapour, so only the solvent counts: `$p_1 = x_1\,p_1^{\circ}$`. Since x₁ = 1 − x₂, the vapour pressure is lowered:

```math
\frac{p_1^{\circ}-p_1}{p_1^{\circ}}=x_2 \qquad\text{(relative lowering of vapour pressure)}
```

<div class="steps" data-fig="c12c-sol-vpsurface">
<div class="step">In pure solvent, molecules at the surface that have enough energy escape into the vapour. The rate of escape sets the vapour pressure p°.</div>
<div class="step">Dissolve a non-volatile solute (green dots). It does not evaporate, and it spreads through the liquid including the surface.</div>
<div class="step">Solute particles take up some of the surface places. A fraction x₂ of the places is no longer available to solvent molecules.</div>
<div class="step">So only a fraction x₁ = 1 − x₂ of the escape sites remain: the rate of escape, and so the vapour pressure, falls to p = x₁p°.</div>
<div class="step">Rearranging gives (p° − p)/p° = x₂. The lowering depends on how many solute particles there are (x₂), not on what they are.</div>
</div>

Use the slider in the figure above to add more solute and watch the surface fill up.

<div class="problem" data-problem="c12c-sol-raoult"></div>

<div class="history">

<ul class="timeline">
<li><b>1803</b> William Henry finds that the amount of gas dissolved in water grows with pressure.</li>
<li><b>1886</b> François-Marie Raoult measures the lowering of vapour pressure and the freezing-point depression of solutions in many solvents, and states his law.</li>
<li><b>1887</b> Jacobus van’t Hoff shows that dilute solutions behave like gases (π = CRT) and meets the puzzle of salts, which have “too many” particles. He receives the first Nobel Prize in Chemistry (1901).</li>
<li><b>1887</b> Svante Arrhenius explains the extra particles: salts dissociate into ions in water.</li>
</ul>

</div>

## 4. Ideal and non-ideal solutions

An ideal solution obeys Raoult’s law at all concentrations and all temperatures. For this to happen the attraction between unlike molecules (A–B) must equal the average of A–A and B–B. Then mixing gives **no heat change (ΔH<sub>mix</sub> = 0) and no volume change (ΔV<sub>mix</sub> = 0)**. Hexane + heptane, benzene + toluene and bromoethane + chloroethane are close to ideal.

Many solutions are **non-ideal** and **deviate** from the law:

- **Positive deviation.** A–B attraction is **weaker** than A–A and B–B (ethanol + hexane, acetone + carbon disulphide). Molecules escape more easily, so the vapour pressure is **higher** than Raoult predicts. Mixing absorbs heat (ΔH > 0) and the volume expands (ΔV > 0).
- **Negative deviation.** A–B attraction is **stronger** (acetone + chloroform, where a hydrogen bond forms; HNO₃ + water). Molecules are held in the liquid, so the vapour pressure is **lower**. Mixing gives out heat (ΔH < 0) and the volume shrinks (ΔV < 0).

<figure class="fig" data-fig="c12c-sol-raoult"><figcaption>Two liquids A and B at one temperature. Switch between ideal, positive and negative deviation and slide the composition. Dashed lines are Raoult’s law; solid lines are what the mixture really does. The total pressure curve bends up (positive) or down (negative) away from the straight line.</figcaption></figure>

<div class="history">

**Beyond the syllabus (trimmed from the rationalised Class 12 book; check your board’s list).** *Azeotropes* are mixtures that boil at one fixed composition and cannot be separated by simple distillation. Strong positive deviation gives a minimum-boiling azeotrope (ethanol + water, 95.6 % ethanol, boils at 78.2 °C); strong negative deviation gives a maximum-boiling one (HNO₃ + water, 68 %, boils at 120.5 °C). Likewise the details of solubility of solids against temperature and the units volume % and mass-by-volume % may be skipped by your board.

</div>

## 5. Colligative properties

Four properties of a **dilute** solution of a **non-volatile** solute depend only on the number of solute particles and not on what the particles are. They are called **colligative properties** (Latin, “bound together”): relative lowering of vapour pressure, elevation of boiling point, depression of freezing point and osmotic pressure. They work only for dilute solutions, because we assume the solute particles do not attract each other much.

### Elevation of boiling point and depression of freezing point

A liquid boils when its vapour pressure equals the outside pressure. A non-volatile solute lowers the vapour pressure, so the solution must be heated **more** to reach the outside pressure: the boiling point is **raised**. In the same way the solution’s vapour-pressure curve meets the solid’s curve at a **lower** temperature: the freezing point is **depressed**.

```math
\Delta T_b = K_b\, m, \qquad \Delta T_f = K_f\, m, \qquad m=\frac{1000\,w_2}{M_2\,w_1}
```

<div class="meaning">

<dl>
<dt>K<sub>b</sub>, K<sub>f</sub></dt><dd>molal elevation and depression constants (K kg/mol). They belong to the SOLVENT: water 0.52 and 1.86; benzene 2.53 and 5.12; camphor 5.95 and 39.7.</dd>
<dt>m</dt><dd>molality of the solute</dd>
<dt>w₂, w₁</dt><dd>masses of solute and solvent in grams; M₂ the molar mass of the solute</dd>
<dt>Physical meaning</dt><dd>K is the rise or fall caused by one mole of particles in 1 kg of solvent. It is large for solvents whose molecules are held weakly in the liquid (camphor): a little solute changes the temperature a lot, which is why camphor is used in molar mass experiments.</dd>
</dl>

</div>

<figure class="fig" data-fig="c12c-sol-bpfp"><figcaption>Vapour pressure curves (schematic) for a solvent and a solution. The solution curve sits lower, so it reaches 1 atm at a higher temperature. Change the solvent and the molality; the bars show how far the boiling point rises and the freezing point falls.</figcaption></figure>

<div class="problem" data-problem="c12c-sol-bp"></div>

**Where you see it.** Salt on icy roads lowers the freezing point of water, so ice melts at −5 °C or below. Antifreeze (ethylene glycol) in a car radiator stops the water freezing in winter and boiling in summer. Sugar makes a syrup boil above 100 °C, which is how candy-makers judge the stage.

### Molar mass from a colligative property

Because the effect depends on the number of moles of solute, measuring it gives the **moles** and so the **molar mass**. Here is the standard method for a freezing-point experiment.

<div class="steps" data-fig="c12c-sol-molmass">
<div class="step">Weigh 5.0 g of the unknown solute and 100 g of benzene (K<sub>f</sub> = 5.12 K kg/mol). Pure benzene freezes at 5.50 °C.</div>
<div class="step">Measure the freezing point of the solution: 4.70 °C. So ΔT<sub>f</sub> = 5.50 − 4.70 = 0.80 K.</div>
<div class="step">Use ΔT<sub>f</sub> = K<sub>f</sub> m to get the molality: m = 0.80/5.12 = 0.156 mol/kg.</div>
<div class="step">Moles of solute = molality × kilograms of solvent = 0.156 × 0.100 = 0.0156 mol.</div>
<div class="step">Molar mass = mass ÷ moles = 5.0 g / 0.0156 mol ≈ 320 g/mol.</div>
</div>

<div class="problem" data-problem="c12c-sol-molmass"></div>

Run your own numbers for all four colligative properties with the working shown:

<!--fig:tool colligative-properties-->

### Osmosis and osmotic pressure

A **semipermeable membrane** lets small solvent molecules through but blocks solute particles. If pure solvent and a solution are on the two sides, solvent flows into the solution: this is **osmosis**. The flow can be stopped by pressing on the solution side; the extra pressure needed is the **osmotic pressure π**. For a dilute solution:

```math
\pi = C\,R\,T = \frac{n_2}{V}\,RT \qquad\text{so}\qquad M_2=\frac{w_2\,R\,T}{\pi\,V}
```

This looks exactly like the gas law (πV = nRT): the solute particles behave like a gas filling the volume of the solution. π is the best property for finding the molar mass of large molecules like proteins and polymers, because the effect is large even for very small molalities (the others would be too tiny to measure at 0.001 m).

<figure class="fig" data-fig="@chem-osmosis"><figcaption>Water and a solution on two sides of a membrane with a piston. Watch the solvent move into the solution until the pressure applied on that side balances it (π = CRT), then push harder than π and reverse osmosis pushes water out of the solution.</figcaption></figure>

<div class="problem" data-problem="c12c-sol-osmotic"></div>

- Solutions with the **same** osmotic pressure are **isotonic**. A 0.9 % NaCl solution (saline) is isotonic with blood, so drips use it.
- A **hypotonic** solution has lower π than the cell: water enters and the cell swells. A **hypertonic** solution has higher π: water leaves and the cell shrinks (raisins in water swell; a slug in salt shrivels).
- **Reverse osmosis.** If a pressure **larger than π** is applied on the solution side, solvent flows out of the solution through the membrane. This is how sea water is made drinkable (π of sea water is about 25–30 atm, so plants use 40–60 atm) and how a home water purifier works.

<div class="myth">

**“Colligative properties depend on the kind of particle.”** They do not: 0.1 m glucose and 0.1 m urea in water give the same ΔT<sub>f</sub>, though the molecules look very different. What matters is only how many particles are present per kilogram of solvent.

</div>

## 6. Abnormal molar masses and the van’t Hoff factor

Sometimes the molar mass worked out from a colligative property is not the real one. The reason is that the solute particles may **associate** (join up) or **dissociate** (split) in the solvent, which changes the **number** of particles.

- **Dissociation:** KCl in water gives K⁺ and Cl⁻; one formula unit gives two particles, so the colligative effect is nearly **double** and the calculated molar mass is nearly **half** the true one.
- **Association:** ethanoic acid in benzene pairs up into dimers by hydrogen bonds; two molecules count as one particle, so the effect is **smaller** than expected and the calculated molar mass is nearly **double**.

The **van’t Hoff factor i** corrects for this:

```math
i=\frac{\text{observed colligative property}}{\text{value calculated with no dissociation or association}}=\frac{\text{normal molar mass}}{\text{observed molar mass}}=\frac{\text{particles actually present}}{\text{formula units dissolved}}
```

Put i into each formula: `$\dfrac{\Delta p}{p^\circ}= i\,x_2$`, `$\Delta T_b = i K_b m$`, `$\Delta T_f = i K_f m$`, `$\pi = i\,CRT$`. For complete dissociation of a salt giving n ions, i = n. For partial dissociation with degree of dissociation α, `$i = 1 + (n-1)\alpha$`. For dimerisation with degree of association α, `$i = 1-\alpha/2$`.

<figure class="fig" data-fig="c12c-sol-ivant"><figcaption>Twelve formula units of different solutes. Slide α and see them split into ions (NaCl, K₂SO₄) or pair into dimers (ethanoic acid in benzene). Glucose never changes, so i = 1. The readout shows how the freezing-point depression follows i.</figcaption></figure>

<div class="problem" data-problem="c12c-sol-ivant"></div>

<div class="history">

**Beyond the syllabus.** For real salts i is a little less than the whole number (0.1 m NaCl has i ≈ 1.87, not 2) because oppositely charged ions in solution attract each other, a point explained by the Debye–Hückel theory. You may meet it in higher classes.

</div>

<div class="keypoints">

- Concentration: mass % and ppm (by mass); mole fraction x = n/Σn; molality m = mol per kg of solvent (no change with T); molarity M = mol per litre of solution (changes with T). Use 100 g of solution for percent-and-density questions.
- Henry’s law: p = K_H x. Higher K_H, lower solubility. Gases dissolve less when the temperature rises.
- Raoult’s law: p_A = x_A p°_A. For a non-volatile solute, (p° − p)/p° = x₂.
- Ideal: A–B = A–A, B–B, ΔH = ΔV = 0. Positive deviation: A–B weaker, p higher, ΔH > 0. Negative deviation: A–B stronger, p lower, ΔH < 0.
- Colligative properties: ΔT_b = K_b m, ΔT_f = K_f m, π = CRT. They depend on the number of particles, for dilute solutions of non-volatile solutes.
- Molar mass: M₂ = 1000 K_f w₂ / (ΔT_f w₁). Osmotic pressure suits large molecules.
- Isotonic = same π; reverse osmosis needs pressure above π.
- van’t Hoff factor i = observed / calculated effect. Dissociation: i = 1 + (n − 1)α (i > 1). Association: i < 1.

</div>

Going further for JEE: the exam-level problems on vapour composition, abnormal molar mass and combined colligative effects are in [Solutions (JEE)](/learn/courses/engineering-entrance/solutions/); NEET asks the same chemistry, so the same lesson serves both.
