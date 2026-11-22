---
title: 'Organic chemistry basics (GOC) and isomerism'
seoTitle: 'GOC and isomerism: JEE and NEET chemistry'
summary: 'IUPAC naming, structural and stereoisomerism (geometrical with E-Z, optical with chirality and meso forms, counting stereoisomers), bond fission and reactive intermediates, electrophiles and nucleophiles, inductive, resonance, hyperconjugation and electromeric effects with acidity, basicity and stability orders, reaction types, purification and chromatography, and qualitative and quantitative analysis of organic compounds.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'Which carbocation is the most stable?'
    choices: ['CH₃⁺', 'CH₃CH₂⁺', '(CH₃)₂CH⁺', '(CH₃)₃C⁺']
    ans: 3
    why: 'The tertiary cation has three electron-releasing methyl groups (+I) and 9 α-hydrogens for hyperconjugation, which spread the positive charge most.'
  - q: 'How many stereoisomers does CH₃CH(OH)CH(OH)CH₃ (butane-2,3-diol) have?'
    choices: ['2', '3', '4', '1']
    ans: 1
    why: 'Two chiral centres would allow 4, but the two halves are identical, so one form (R,S) has a mirror plane: a meso compound. Total = a pair of enantiomers + meso = 3.'
  - q: 'Which is the strongest acid?'
    choices: ['CH₃COOH', 'ClCH₂COOH', 'FCH₂COOH', 'CH₃CH₂COOH']
    ans: 2
    why: 'Fluorine has the strongest −I effect, which pulls electron density from O-H and stabilises the carboxylate ion (pKa 2.59 against 2.87 for the chloro acid and 4.76 for acetic acid).'
sources:
  - 'IUPAC (2013), Nomenclature of Organic Chemistry: IUPAC Recommendations and Preferred Names (the Blue Book) https://iupac.qmul.ac.uk/BlueBook/'
  - 'Acid dissociation constants of haloacetic and chlorobutanoic acids: CRC Handbook of Chemistry and Physics, Dissociation constants of organic acids and bases'
  - 'Cahn R. S., Ingold C. K. and Prelog V. (1966), Specification of molecular chirality, Angewandte Chemie International Edition 5, 385'
  - 'NEET (UG) and JEE Main / JEE Advanced 2026 syllabi: Organic chemistry, some basic principles and techniques; purification and characterisation of organic compounds'
---

**Chemistry · Class 11 · about 40 minutes.** By the end you will be able to name organic compounds, count and classify isomers, rank carbocations, carbanions and radicals, order acids and bases using electronic effects, and calculate percentages of elements from analysis data.

<div class="bigidea">Organic reactions are electrons moving from where they are plentiful to where they are scarce. Four electronic effects decide where electrons are plentiful: the inductive effect, resonance, hyperconjugation and the electromeric effect. Learn them once and every stability, acidity and basicity order in organic chemistry follows.</div>

## 1. Carbon and how we draw it

Carbon forms four bonds, with sp³ (single bonds, 109.5°), sp² (one double bond, 120°) or sp (triple bond or two double bonds, 180°) hybridisation. The more s character, the more electronegative the carbon: sp > sp² > sp³. Structures can be written as complete, condensed (CH₃CH₂OH) or bond-line formulas, where every corner and line end is a carbon carrying enough H to make four bonds. A carbon joined to one, two, three or four other carbons is primary (1°), secondary (2°), tertiary (3°) or quaternary (4°).

## 2. IUPAC naming

A name is prefix (substituents) + word root (number of carbons in the main chain: meth, eth, prop, but, pent, hex...) + suffix (the principal functional group). Steps: pick the longest chain containing the principal group and the most multiple bonds; number it to give the principal group the lowest number, then multiple bonds, then substituents; list substituents alphabetically.

| Priority (high to low) | Suffix | Prefix |
|---|---|---|
| Carboxylic acid -COOH | -oic acid | carboxy |
| Ester -COOR | alkyl -oate | alkoxycarbonyl |
| Amide -CONH₂ | -amide | carbamoyl |
| Nitrile -CN | -nitrile | cyano |
| Aldehyde -CHO | -al | formyl or oxo |
| Ketone >C=O | -one | oxo |
| Alcohol -OH | -ol | hydroxy |
| Amine -NH₂ | -amine | amino |

Halogens (chloro, bromo), nitro and alkoxy groups are always prefixes. Example: CH₃CH(OH)CH₂CHO is 3-hydroxybutanal.

## 3. Isomerism

**Structural isomers** have the same molecular formula but different connections: **chain** (butane and 2-methylpropane), **position** (propan-1-ol and propan-2-ol), **functional** (ethanol and methoxymethane), **metamerism** (different alkyl groups round the same functional group: diethyl ether and methyl propyl ether) and **tautomerism** (fast-swapping isomers, mainly keto and enol forms, which need an α-hydrogen).

**Stereoisomers** have the same connections but a different arrangement in space.

- **Geometrical (cis-trans)** isomerism needs restricted rotation (a C=C or a ring) and two different groups on each end. When cis and trans are unclear, use **E/Z**: rank the two groups on each carbon by atomic number (the **CIP rules**); higher priorities on the same side is Z, opposite is E.
- **Optical** isomerism comes from **chirality**: a molecule that cannot be laid on its mirror image, usually because of a carbon with four different groups. The two mirror forms are **enantiomers**: same physical properties, but they rotate plane-polarised light in opposite directions. Stereoisomers that are not mirror images are **diastereomers**. A molecule with chiral centres but a mirror plane is **meso** and optically inactive. An equal mixture of enantiomers (**racemic** mixture) does not rotate light.

**Counting stereoisomers.** With n different chiral centres (and no symmetry), there are 2ⁿ stereoisomers. Symmetry lowers the count: tartaric acid has 2 centres but only 3 stereoisomers (d, l and meso). Each C=C that can show cis-trans also doubles the count.

**Try it:** choose a molecule, press "H at the back" so the lowest priority group points away, then read 1 → 2 → 3. Press "Swap 1 and 2" to see the mirror image flip the label.

<figure class="fig" data-fig="@chem-stereo-rs"><figcaption>Clockwise is R, anticlockwise is S. Swapping any two groups gives the enantiomer, so R becomes S: the two mirror images are different molecules even though every bond and angle is the same.</figcaption></figure>

## 4. Breaking bonds and reactive intermediates

A covalent bond can break **homolytically** (one electron to each atom, giving **free radicals**) or **heterolytically** (both to one atom, giving ions). Heterolysis at carbon gives a **carbocation** (6 electrons, sp², planar) or a **carbanion** (8 electrons, sp³, pyramidal). A **carbene** (:CH₂) has a carbon with two bonds and two non-bonding electrons.

**Electrophiles** are electron-seeking (H⁺, NO₂⁺, carbocations, BF₃, AlCl₃). **Nucleophiles** are electron-rich and seek a positive centre (OH⁻, CN⁻, NH₃, H₂O, ROH).

## 5. Electronic effects

<div class="meaning">
<dl>
<dt>−I and +I</dt><dd>inductive effect: permanent pull (−I: NO₂, CN, F, Cl, COOH) or push (+I: alkyl groups) of electrons through σ bonds; fades quickly with distance</dd>
<dt>−R and +R (or −M, +M)</dt><dd>resonance (mesomeric) effect: π or lone pair electrons spread through a conjugated system; +R groups give (OH, OR, NH₂, halogens), −R groups take (NO₂, CHO, COOH, CN)</dd>
<dt>Hyperconjugation</dt><dd>σ electrons of C-H bonds on the carbon next to a cation, radical or double bond spread into it; more α-hydrogens, more stabilisation</dd>
<dt>Electromeric effect</dt><dd>temporary full shift of π electrons to one atom when an attacking reagent comes near; disappears when it leaves</dd>
<dt>pK<sub>a</sub></dt><dd>−log K<sub>a</sub>: the lower it is, the stronger the acid</dd>
<dt>Physical meaning</dt><dd>Anything that spreads out a charge stabilises it. A spread-out negative charge makes the acid stronger; a spread-out positive charge makes a carbocation more stable.</dd>
</dl>
</div>

**Stability orders.** Carbocations and radicals: 3° &gt; 2° &gt; 1° &gt; CH₃ (more +I groups and more α-H for hyperconjugation); allyl and benzyl cations are especially stable because resonance spreads the charge. Carbanions go the other way: CH₃⁻ &gt; 1° &gt; 2° &gt; 3° (alkyl groups push more electron density onto an already negative carbon), and resonance or −I groups stabilise them.

**Acidity.** An acid is strong when its conjugate base is stable. −I groups strengthen carboxylic acids, more strongly when there are more of them and when they are closer to COOH. Phenol (pK<sub>a</sub> 10) is far more acidic than ethanol (about 16) because the phenoxide charge spreads into the ring; nitro groups at ortho or para make it stronger still. Among hydrocarbons: ethyne (sp) &gt; ethene (sp²) &gt; ethane (sp³).

<figure class="fig" data-fig="goc-inductive"><figcaption>The inductive effect in numbers: measured pK<sub>a</sub> values for chloroacetic acids, haloacetic acids and chlorobutanoic acids. More halogen, a more electronegative halogen, or a closer halogen all make a stronger acid.</figcaption></figure>

**Basicity of amines** depends on how available the nitrogen lone pair is. Alkyl groups (+I) raise basicity, so in the gas phase 3° &gt; 2° &gt; 1° &gt; NH₃; in water, solvation reverses part of this and (CH₃)₂NH &gt; CH₃NH₂ &gt; (CH₃)₃N &gt; NH₃. Aniline is much weaker than ammonia, because its lone pair spreads into the ring.

<div class="myth">

**"Hyperconjugation and the inductive effect are the same thing."** The inductive effect is a pull or push through σ bonds caused by electronegativity. Hyperconjugation is σ electrons of a C-H bond overlapping with an empty p orbital or a π system next door. Both make 3° cations more stable, but only hyperconjugation explains why CH₃ groups stabilise a double bond (more substituted alkenes are more stable).

</div>

## 6. Types of organic reaction

**Substitution** (one group replaces another: CH₃Cl + OH⁻ → CH₃OH + Cl⁻), **addition** (to a multiple bond: ethene + Br₂), **elimination** (removing a small molecule to form a multiple bond: dehydration of ethanol) and **rearrangement** (atoms shift within a molecule, as when a 2° carbocation turns into a more stable 3° one by a hydride or methyl shift).

## 7. Purification and analysis

**Purification**: crystallisation (solubility differences), sublimation (camphor, naphthalene), simple distillation (boiling points far apart), fractional distillation (close boiling points), distillation under reduced pressure (liquids that decompose at their boiling point, such as glycerol), steam distillation (steam-volatile, water-insoluble liquids like aniline), differential extraction and chromatography. In thin layer or paper chromatography, the **retardation factor** R<sub>f</sub> = distance moved by the substance ÷ distance moved by the solvent front.

**Detecting elements (Lassaigne's test).** Fusing with sodium turns N, S and halogens into NaCN, Na₂S and NaX. Nitrogen gives Prussian blue with FeSO₄ and acid; sulfur gives a violet colour with sodium nitroprusside; halogens give precipitates with AgNO₃ (white AgCl soluble in ammonia, pale yellow AgBr, yellow AgI). If N and S are both present, a blood-red colour with Fe³⁺ shows thiocyanate.

**Quantitative analysis.**
- Carbon and hydrogen (**Liebig**): %C = (12/44) × (mass of CO₂/mass of compound) × 100; %H = (2/18) × (mass of H₂O/mass of compound) × 100.
- Nitrogen by **Dumas**: the N₂ volume is converted to STP; %N = (28/22 400) × V₀(mL) × 100/w.
- Nitrogen by **Kjeldahl**: %N = 1.4 × N × V/w (N and V of the acid used up by the ammonia). It does not work for nitro, azo compounds or N in a ring like pyridine.
- Halogens and sulfur by **Carius**: weigh AgX or BaSO₄ and use their formula masses.

<div class="problem" data-problem="goc-dumas"></div>

<div class="problem" data-problem="goc-carius"></div>

**Degree of unsaturation.** From a molecular formula, the number of rings plus π bonds is DBE = C − (H + X)/2 + N/2 + 1. Benzene C₆H₆ has DBE 4 (one ring, three π bonds).

<div class="problem" data-problem="goc-dbe"></div>

<div class="keypoints">

- Principal group sets the suffix: acid > ester > amide > nitrile > aldehyde > ketone > alcohol > amine.
- Geometrical isomers need restricted rotation and two different groups on each end; E/Z by CIP priority.
- 2ⁿ stereoisomers for n different chiral centres; meso forms lower the count.
- Carbocations and radicals: 3° > 2° > 1° > CH₃; carbanions the reverse.
- −I groups strengthen acids: more, more electronegative and closer.
- Phenol is acidic by resonance; aniline is weakly basic by resonance.
- Dumas %N = 28V₀ × 100/(22 400 w); Kjeldahl %N = 1.4NV/w; DBE = C − (H + X)/2 + N/2 + 1.

</div>
