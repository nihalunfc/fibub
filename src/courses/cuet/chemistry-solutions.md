---
title: 'Chemistry: solutions'
seoTitle: 'Solutions and colligative properties for CUET Chemistry'
summary: 'Ways to express concentration, Henry''s and Raoult''s laws, ideal and non-ideal solutions, the four colligative properties and the van''t Hoff factor, with a live boiling point problem.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Which concentration unit does not change with temperature?'
    choices: ['Molality', 'Molarity', 'Normality']
    ans: 0
    why: 'Molality uses the mass of solvent, which does not change when the liquid expands; molarity uses volume, which does.'
  - q: 'The van''t Hoff factor of NaCl in dilute water solution is close to:'
    choices: ['2', '1', '3']
    ans: 0
    why: 'Each NaCl gives two ions (Na⁺ and Cl⁻), so it has about twice the colligative effect of a non-electrolyte.'
  - q: 'Why do we add salt to icy roads in cold countries?'
    choices: ['Dissolved salt lowers the freezing point of water', 'Salt raises the boiling point', 'Salt reacts with ice to make heat']
    ans: 0
    why: 'Depression of freezing point is a colligative property: the more dissolved particles, the lower the freezing point.'
sources:
  - 'NCERT, Chemistry Part I (Class 12), Solutions'
  - 'National Testing Agency, CUET (UG) Chemistry syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 7 · about 20 minutes.** By the end you will convert between concentration units and solve every colligative property question in CUET.

<div class="bigidea">Colligative properties depend on how many solute particles there are, not what they are. Dissolved particles get in the way of the solvent escaping or freezing, and that shifts vapour pressure, boiling point, freezing point and osmosis.</div>

**Everyday picture:** a crowded doorway. If some people in a room are not trying to leave (solute particles at the surface), fewer of the people who want to leave (solvent molecules) reach the door per second. Vapour pressure drops in the same way.

## 1. Concentration

| Unit | Definition | Note |
|---|---|---|
| Molarity (M) | mol solute per litre of solution | changes with temperature |
| Molality (m) | mol solute per kg of solvent | temperature independent |
| Mole fraction (x) | mol of one part ÷ total mol | all fractions add to 1 |
| ppm | parts per million by mass | for tiny amounts, e.g. fluoride in water |

## 2. Henry's and Raoult's laws

Henry: the solubility of a gas is proportional to its pressure, p = K_H x. That is why a soda fizzes when opened, and why divers breathe helium-diluted air (nitrogen dissolving in blood at depth causes the bends).

Raoult: in an ideal solution each volatile component's vapour pressure is p = p° x. Positive deviation (weaker attractions between unlike molecules, e.g. ethanol + acetone) raises the vapour pressure; negative deviation (stronger attractions, e.g. chloroform + acetone) lowers it. Strongly deviating mixtures can form azeotropes that boil without changing composition.

## 3. The four colligative properties

```math
\frac{p^\circ - p}{p^\circ} = x_{\text{solute}} \qquad \Delta T_b = iK_b m \qquad \Delta T_f = iK_f m \qquad \pi = iCRT
```

<div class="meaning">

<dl>
<dt>K_b, K_f</dt><dd>properties of the solvent. Water: K_b = 0.52, K_f = 1.86 K kg/mol.</dd>
<dt>i (van't Hoff factor)</dt><dd>particles per formula unit actually present: 1 for glucose or urea, ~2 for NaCl, ~3 for CaCl₂, ~½ for acetic acid that pairs up (dimerises) in benzene.</dd>
<dt>π (osmotic pressure)</dt><dd>the pressure needed to stop solvent flowing through a membrane into the solution. Large even for dilute solutions, so it is the best way to find molar masses of proteins. Reverse osmosis pushes harder than π to purify sea water.</dd>
</dl>

</div>

<div class="steps" data-title="Finding a molar mass from a colligative property">
<div class="step"><b>Measure</b> the effect: ΔT_f, ΔT_b or π.</div>
<div class="step"><b>Find molality</b> (or molarity): m = ΔT / (iK).</div>
<div class="step"><b>Moles of solute</b> = m × kg of solvent.</div>
<div class="step"><b>Molar mass</b> = grams of solute ÷ moles. If it comes out half the expected value, the solute dissociated (i = 2); if double, it associated.</div>
</div>

<div class="problem" data-problem="boiling-elevation"></div>

<div class="myth">

**"A 1 m sugar solution and a 1 m salt solution freeze at the same temperature."** Salt splits into two ions, so it has about twice as many particles and lowers the freezing point about twice as much.

</div>

**Try it:** Change the two strengths and the litres, press Pour, then try Hit a target.

<figure class="fig" data-fig="@tp-mixture-vessel"><figcaption>The mixture always lands between the two strengths, nearer the one you used more of.</figcaption></figure>

**Try it:** Change the concentration and watch the solvent move.

<figure class="fig" data-fig="@chem-osmosis"><figcaption>Solvent moves to the more concentrated side; the pressure needed to stop it is π = CRT.</figcaption></figure>

## 4. Practice

<div class="qbank" data-bank="entrance-chemistry" data-topics="solutions" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Molality is temperature independent; molarity is not.
- Henry p = K_H x; Raoult p = p°x.
- ΔT_b = iK_b m, ΔT_f = iK_f m, π = iCRT, relative lowering = x_solute.
- i: 1 non-electrolyte, ~2 NaCl, ~3 CaCl₂, below 1 if molecules pair up.

</div>
