---
title: 'Redox reactions'
seoTitle: 'Redox reactions and n-factor: JEE and NEET chemistry'
summary: 'Oxidation and reduction as electron transfer, oxidation number rules with the tricky cases (peroxides, superoxides, average values, structure-based values), types of redox reaction including disproportionation, balancing by the ion-electron and oxidation number methods, n-factor and equivalent weight, redox titrations and iodometry, and the electrochemical series.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'The oxidation number of oxygen in KO₂ is:'
    choices: ['−2', '−1', '−1/2', '+1/2']
    ans: 2
    why: 'K is +1 and the compound is neutral, so the two O share −1: each is −1/2. KO₂ is a superoxide (O₂⁻ ion).'
  - q: 'In 2H₂O₂ → 2H₂O + O₂, hydrogen peroxide is:'
    choices: ['Only oxidised', 'Only reduced', 'Both oxidised and reduced', 'Neither']
    ans: 2
    why: 'O goes from −1 to −2 in water (reduced) and from −1 to 0 in O₂ (oxidised): a disproportionation.'
  - q: 'The n-factor of KMnO₄ in acidic solution (giving Mn²⁺) is:'
    choices: ['1', '3', '5', '7']
    ans: 2
    why: 'Mn goes from +7 to +2: 5 electrons gained per formula unit. In neutral solution (to MnO₂, +4) it is 3, in strongly basic solution (to MnO₄²⁻, +6) it is 1.'
sources:
  - 'IUPAC Gold Book: oxidation state, oxidation, reduction https://goldbook.iupac.org'
  - 'Standard electrode potentials: CRC Handbook of Chemistry and Physics, Electrochemical series'
  - 'NEET (UG) and JEE Main / JEE Advanced 2026 syllabi: Redox reactions'
---

**Chemistry · Class 11 · about 34 minutes.** By the end you will be able to assign any oxidation number, spot what is oxidised and reduced, balance any redox equation in acid or base, find n-factors and equivalent weights, solve titration problems and use the electrochemical series to predict reactions.

<div class="bigidea">Oxidation is loss of electrons; reduction is gain. They always happen together: electrons lost by one substance are gained by another. Oxidation numbers are a bookkeeping system that lets us follow electrons even when they are only shared.</div>

## 1. What oxidation and reduction mean

Older ideas: oxidation is adding oxygen or removing hydrogen; reduction is the reverse. The modern, more general idea: **oxidation = loss of electrons, reduction = gain of electrons**. In Zn + Cu²⁺ → Zn²⁺ + Cu, zinc loses 2 electrons (oxidised) and copper ions gain them (reduced). The substance that is reduced is the **oxidising agent** (Cu²⁺ here); the one oxidised is the **reducing agent** (Zn).

## 2. Oxidation numbers

The **oxidation number** (ON) is the charge an atom would carry if every bond were fully ionic, with shared electrons given to the more electronegative atom. Rules, in order of priority:

1. An element in its free state: 0 (Na, O₂, P₄, S₈).
2. A simple ion: its charge (Na⁺ +1, Cl⁻ −1).
3. Fluorine always −1. Group 1 metals +1, group 2 metals +2 in compounds.
4. Hydrogen +1, except −1 in metal hydrides (NaH, CaH₂).
5. Oxygen −2, except −1 in peroxides (H₂O₂, Na₂O₂, BaO₂), −1/2 in superoxides (KO₂) and +2 in OF₂.
6. The ONs in a species add up to its charge.

**Average and structure-based values.** Formula counting gives an average. In Fe₃O₄, Fe is +8/3 on average (really one Fe²⁺ and two Fe³⁺). In S₄O₆²⁻ the average S is +2.5; in the structure the two end S atoms are +5 and the two bridging S atoms 0. In CrO₅, counting all O as −2 gives an impossible +10; the structure has two peroxide groups (four O at −1) and one oxide O (−2), so **Cr is +6**. Whenever counting gives more than the group number, look for O-O bonds.

<div class="meaning">
<dl>
<dt>ON</dt><dd>oxidation number: the charge an atom would have if all its bonds were ionic</dd>
<dt>n-factor</dt><dd>electrons gained or lost per formula unit in the reaction (for acids and bases: H⁺ or OH⁻ given per formula unit)</dd>
<dt>E (equivalent weight)</dt><dd>molar mass ÷ n-factor</dd>
<dt>N (normality)</dt><dd>equivalents per litre = molarity × n-factor</dd>
<dt>E°</dt><dd>standard reduction potential of a half-cell, in volts, against the hydrogen electrode (0 V)</dd>
<dt>Physical meaning</dt><dd>An equivalent is the amount that gives or takes one mole of electrons. That is why equivalents of oxidant always equal equivalents of reductant at the end of a titration.</dd>
</dl>
</div>

## 3. Types of redox reaction

- **Combination**: C + O₂ → CO₂. **Decomposition**: 2KClO₃ → 2KCl + 3O₂ (an intramolecular redox: Cl is reduced, O oxidised in the same compound).
- **Displacement**: a more reactive metal pushes a less reactive one out of solution (Zn + CuSO₄), or a halogen higher up pushes out a lower one (Cl₂ + 2KBr → 2KCl + Br₂).
- **Disproportionation**: one element in one oxidation state goes both up and down. Examples: 2H₂O₂ → 2H₂O + O₂; Cl₂ + 2OH⁻ → Cl⁻ + ClO⁻ + H₂O; 3HNO₂ → HNO₃ + 2NO + H₂O. An element at its **highest or lowest** possible state cannot disproportionate (F₂ cannot, since F has no positive states; ClO₄⁻ cannot).
- **Comproportionation**: the reverse, two states meeting in the middle: IO₃⁻ + 5I⁻ + 6H⁺ → 3I₂ + 3H₂O.

## 4. Balancing redox equations

<div class="steps">
<div class="step"><b>Ion-electron method, example in acid.</b> MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺. Split into half-reactions: MnO₄⁻ → Mn²⁺ and Fe²⁺ → Fe³⁺.</div>
<div class="step"><b>Balance atoms other than O and H, then O with H₂O, then H with H⁺.</b> MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O.</div>
<div class="step"><b>Balance charge with electrons.</b> Left +7, right +2: add 5e⁻ on the left. MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O. And Fe²⁺ → Fe³⁺ + e⁻.</div>
<div class="step"><b>Make electrons equal and add.</b> Multiply the iron half by 5: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. Check: charge +17 on both sides.</div>
<div class="step"><b>In basic solution.</b> Balance as if acidic, then add as many OH⁻ to both sides as there are H⁺; each H⁺ + OH⁻ becomes H₂O; cancel water.</div>
</div>

The **oxidation number method** does the same with ON changes: the total increase must equal the total decrease.

**Watch it happen:** the same equation as above, balanced with a ledger that checks atoms and charge at every stage.

<div class="steps" data-fig="@chem-redox-steps" data-title="Balance it with a ledger" data-ms="6000">
<div class="step"><b>Skeleton.</b> MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺. Mn goes +7 → +2 (reduced), Fe goes +2 → +3 (oxidised).</div>
<div class="step"><b>Split</b> into an oxidation and a reduction half-reaction.</div>
<div class="step"><b>Balance O with H₂O.</b> Four O atoms need four H₂O.</div>
<div class="step"><b>Balance H with H⁺</b> (acid solution): eight H⁺.</div>
<div class="step"><b>Balance charge with e⁻:</b> 5 electrons on the left of the reduction half; Fe²⁺ → Fe³⁺ + e⁻.</div>
<div class="step"><b>Multiply</b> the iron half by 5 so the electrons lost equal those gained.</div>
<div class="step"><b>Add</b> the halves; the electrons cancel. Check atoms and charge: both +17.</div>
</div>

## 5. n-factor, equivalents and normality

The **n-factor** of an oxidant or reductant is the total change in ON per formula unit. K₂Cr₂O₇ → 2Cr³⁺: 2 × 3 = 6. C₂O₄²⁻ → 2CO₂: 2 × 1 = 2. FeC₂O₄ → Fe³⁺ + 2CO₂: 1 + 2 = 3. The n-factor depends on the reaction, not just the substance: KMnO₄ is 5 in acid, 3 in neutral and 1 in strongly basic solution. For a disproportionation, use n = (n<sub>up</sub> × n<sub>down</sub>)/(n<sub>up</sub> + n<sub>down</sub>) per molecule.

The **law of equivalence**: in any reaction, equivalents of oxidant = equivalents of reductant, where equivalents = moles × n-factor = N × V(L).

<div class="problem" data-problem="rx-eq-mass"></div>

## 6. Redox titrations

- **Permanganometry**: KMnO₄ in dilute H₂SO₄ is its own indicator (the first permanent pink colour marks the end point). HCl is avoided because MnO₄⁻ oxidises Cl⁻ to Cl₂. Oxalic acid needs warming (about 60 °C) because the reaction is slow at first.
- **Dichrometry**: K₂Cr₂O₇ is a primary standard (pure and stable); an indicator such as diphenylamine is needed. It can be used in HCl.
- **Iodometry**: an oxidant frees I₂ from excess KI; the I₂ is titrated with thiosulfate (I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻), with starch added near the end (blue to colourless). In **iodimetry**, a standard I₂ solution is titrated directly against a reductant.

<div class="problem" data-problem="rx-titration"></div>

<div class="myth">

**"In a titration the moles of oxidant equal the moles of reductant."** Only if their n-factors are equal. It is equivalents (moles × n-factor) that match. 1 mol of MnO₄⁻ in acid takes 5 electrons, so it reacts with 5 mol of Fe²⁺.

</div>

## 7. Electrode potentials and the electrochemical series

A metal dipped in a solution of its ions forms a **half-cell** with a tendency to gain electrons, measured as the **standard reduction potential** E° against the standard hydrogen electrode (defined as 0 V) at 25 °C, 1 M and 1 bar. Listing couples by E° gives the **electrochemical series**. The more positive E°, the stronger the oxidised form as an **oxidising agent** (F₂ is the strongest); the more negative, the stronger the reduced form as a **reducing agent** (Li is the strongest in water).

In a cell, the couple with the higher E° is reduced (cathode) and the other is oxidised (anode): E°<sub>cell</sub> = E°<sub>cathode</sub> − E°<sub>anode</sub>. A positive E°<sub>cell</sub> means the reaction goes on its own. Metals below hydrogen (negative E°) displace H₂ from dilute acids; copper and silver do not.

<figure class="fig" data-fig="redox-series"><figcaption>The electrochemical series as a ladder. Choose two half-cells: electrons flow from the lower couple (oxidised, anode) to the higher one (reduced, cathode), and the gap between them is E°<sub>cell</sub>.</figcaption></figure>

<div class="problem" data-problem="rx-emf"></div>

<div class="myth">

**"When a half-reaction is multiplied by 2, its E° doubles."** E° is an intensive property, like temperature: it does not depend on how much reacts. Balance the electrons, but never multiply the potentials.

</div>

<div class="keypoints">

- Oxidation = loss of electrons (ON up); reduction = gain (ON down); the oxidising agent is itself reduced.
- O is −1 in peroxides, −1/2 in superoxides, +2 in OF₂; H is −1 in metal hydrides.
- Impossible ON from counting (CrO₅): look for peroxide links; Cr there is +6.
- Disproportionation needs an intermediate oxidation state.
- Ion-electron method: atoms, O with H₂O, H with H⁺, charge with e⁻; in base add OH⁻ to both sides.
- n-factor = electrons per formula unit; KMnO₄ 5 (acid), 3 (neutral), 1 (strong base); K₂Cr₂O₇ 6.
- Equivalents of oxidant = equivalents of reductant (n × M × V).
- E°<sub>cell</sub> = E°<sub>cathode</sub> − E°<sub>anode</sub>; never multiply E° when balancing.

</div>
