---
title: 'Haloalkanes and haloarenes'
seoTitle: 'Haloalkanes and haloarenes: JEE and NEET chemistry'
summary: 'Naming and classifying alkyl and aryl halides, the C-X bond, preparation from alcohols, alkenes and diazonium salts, SN1 and SN2 mechanisms with stereochemistry, elimination and Saytzeff''s rule, Grignard and Wurtz reactions, why aryl halides resist substitution, and polyhalogen compounds, from basics to JEE Advanced depth.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'Which reacts fastest by SN2 with NaI in acetone?'
    choices: ['(CH₃)₃CCl', '(CH₃)₂CHCl', 'CH₃CH₂Cl', 'CH₃Cl']
    ans: 3
    why: 'SN2 needs the nucleophile to reach the back of the carbon. Methyl is least crowded; tertiary is so crowded that SN2 hardly happens.'
  - q: 'An optically active 2-bromobutane is hydrolysed by an SN1 path. The product is:'
    choices: ['the alcohol with retained configuration only', 'the alcohol with inverted configuration only', 'a mostly racemic alcohol', 'no alcohol, only alkene']
    ans: 2
    why: 'The flat carbocation can be attacked from either face, so both configurations form, roughly equally (a little extra inversion, since Br⁻ partly shields one face).'
  - q: 'Chlorobenzene resists nucleophilic substitution mainly because:'
    choices: ['the C-Cl bond has partial double-bond character from resonance', 'chlorine is a poor leaving group in all compounds', 'benzene is not polar', 'it forms a stable carbocation']
    ans: 0
    why: 'A lone pair on Cl is shared with the ring, giving the C-Cl bond some double-bond character. The carbon is also sp² (shorter, stronger bond), and a phenyl cation is very unstable.'
sources:
  - 'NEET (UG), JEE Main and JEE Advanced 2026 syllabi: Haloalkanes and haloarenes'
  - 'IUPAC Nomenclature of Organic Chemistry, Recommendations 2013 https://iupac.org/what-we-do/books/bluebook/'
  - 'Montreal Protocol on ozone-depleting substances (CFCs), UN Environment Programme https://ozone.unep.org'
---

**Chemistry · Class 12 · about 36 minutes.** By the end you will be able to name and classify halides, make them, predict SN1 or SN2 and the stereochemistry, choose between substitution and elimination, and explain why aryl halides behave so differently.

<div class="bigidea">Carbon bonded to a halogen carries a small positive charge, so electron-rich species (nucleophiles) attack it and push the halide out. Whether that happens in one step (SN2) or two (SN1), and whether the attacker takes a hydrogen instead (elimination), depends on how crowded the carbon is, how stable a carbocation would be, and what the solvent and reagent are.</div>

## 1. Classes, names and the C-X bond

**Alkyl halides** are primary (1°), secondary (2°) or tertiary (3°) by how many carbons are on the C-X carbon. **Allylic** (X next to C=C) and **benzylic** (X on a carbon next to a ring) halides are very reactive; **vinylic** (X on C=C) and **aryl** (X on a ring) halides are not.

IUPAC names: 2-bromobutane, 1-chloro-2-methylpropane, 1,2-dichloroethane. Common names: methylene chloride CH₂Cl₂, chloroform CHCl₃, iodoform CHI₃, carbon tetrachloride CCl₄, benzyl chloride C₆H₅CH₂Cl. Dihalides on one carbon are **gem**; on neighbouring carbons **vic**.

**Trends.** Bond length C-F < C-Cl < C-Br < C-I; bond strength the reverse, so reactivity is **R-I > R-Br > R-Cl > R-F**. Boiling point rises with halogen size and with chain length; among isomers, more branching lowers it. Density: bromides and iodides are denser than water.

## 2. Making halides

- **From alcohols:** HCl with anhydrous ZnCl₂ (Groves; Lucas reagent for 3° fastest), PCl₅, PCl₃, or **SOCl₂** (best: SO₂ and HCl escape as gases, leaving pure product). HBr, or red P with Br₂ or I₂.
- **From alkenes:** HX adds by **Markovnikov's rule** (H to the carbon with more H). HBr with peroxide adds the other way (**anti-Markovnikov**, the Kharasch effect, free radical, only for HBr).
- **Halogen exchange:** **Finkelstein** (R-Cl + NaI in dry acetone → R-I; NaCl precipitates and drives it) and **Swarts** (R-Br + AgF or Hg₂F₂ → R-F).
- **Aryl halides:** electrophilic substitution with Cl₂/FeCl₃; or from diazonium salts by **Sandmeyer** (CuCl/HCl or CuBr/HBr), **Gattermann** (Cu powder with HX) or KI (aryl iodide, no catalyst needed). See [Amines and diazonium salts](/learn/courses/engineering-entrance/amines/).

## 3. Nucleophilic substitution: SN2 and SN1

<figure class="fig" data-fig="halo-sn-profile"><figcaption>Switch between SN2 and SN1 and between substrates. SN2 has one crowded transition state, so bulk raises its barrier; SN1 passes through a carbocation, so alkyl groups that stabilise it lower the barrier. The readout gives typical relative rates.</figcaption></figure>

| | SN2 | SN1 |
|---|---|---|
| Steps | one, concerted | two: slow ionisation, fast attack |
| Rate law | k[RX][Nu⁻], second order | k[RX], first order |
| Best substrate | CH₃X > 1° > 2° ≫ 3° | 3° > 2° ≫ 1° > CH₃X (also allylic, benzylic) |
| Stereochemistry | complete **inversion** (Walden) | mostly **racemisation** |
| Favoured by | strong nucleophile, polar aprotic solvent (acetone, DMSO, DMF) | weak nucleophile, polar protic solvent (water, alcohols) |
| Rearrangement | never | possible (carbocation shifts H or CH₃ to become more stable) |

<div class="meaning">
<dl>
<dt>Nu⁻</dt><dd>nucleophile, an electron-pair donor that attacks carbon (OH⁻, CN⁻, I⁻, NH₃, H₂O)</dd>
<dt>RX</dt><dd>alkyl halide; X⁻ is the leaving group (I⁻ best, F⁻ worst)</dd>
<dt>k</dt><dd>rate constant; SN2 rate = k[RX][Nu⁻], SN1 rate = k[RX]</dd>
<dt>Inversion, racemisation</dt><dd>the product's 3D arrangement is the mirror of the start; or a 50 : 50 mix of both mirror forms</dd>
<dt>Physical meaning</dt><dd>SN2 is a crowded doorway: bulky groups block it. SN1 waits for the halide to leave on its own: only a stable cation lets that happen.</dd>
</dl>
</div>

<div class="problem" data-problem="ha-sn2-rate"></div>

**Ambident nucleophiles** give two products: KCN gives mostly alkyl **cyanides** (R-CN, attack through C), AgCN mostly **isocyanides** (R-NC, the Ag-C bond is covalent so N attacks). KNO₂ gives alkyl nitrites (R-ONO), AgNO₂ nitroalkanes (R-NO₂).

<div class="myth">

**"SN1 and SN2 differ only in speed."** They differ in mechanism, rate law and stereochemistry. Doubling [OH⁻] doubles an SN2 rate but leaves an SN1 rate unchanged, and SN2 inverts a chiral centre while SN1 scrambles it. Exams test exactly these differences.

</div>

## 4. Elimination and other reactions

With **alcoholic KOH** (strong base, heat), a halide loses HX to give an alkene (**β-elimination**, E2 for most cases). **Saytzeff (Zaitsev) rule:** the more substituted alkene is the major product (2-bromobutane gives mainly but-2-ene). Aqueous KOH favours substitution (alcohol); alcoholic KOH and higher temperature favour elimination; 3° halides eliminate most easily.

- **Wurtz:** 2R-X + 2Na (dry ether) → R-R. With two different halides you get three alkanes (R-R, R-R′, R′-R′), so it is useful only for symmetric products. **Wurtz-Fittig:** aryl + alkyl halide + Na gives an alkylbenzene; **Fittig:** two aryl halides give biphenyl.
- **Grignard reagent:** R-X + Mg (dry ether) → R-MgX. The carbon becomes strongly nucleophilic and basic. It reacts with any acidic H (water, alcohols, amines, terminal alkynes) to give the alkane R-H, so everything must be dry. With carbonyl compounds it gives alcohols (see [Aldehydes, ketones and carboxylic acids](/learn/courses/engineering-entrance/aldehydes-ketones-acids/)).
- **Reduction:** R-X with Zn/HCl or H₂/Pd gives R-H.

<div class="problem" data-problem="ha-grignard-methane"></div>

## 5. Haloarenes

Aryl halides resist nucleophilic substitution because (i) resonance gives C-X partial double-bond character, (ii) the carbon is sp², making the bond shorter and stronger, (iii) the phenyl cation is unstable, and (iv) the electron-rich ring repels nucleophiles. Chlorobenzene is turned into phenol only at 623 K and 300 atm with NaOH (Dow process).

**Electron-withdrawing groups at ortho or para** (NO₂) make substitution easy: they hold the negative charge of the intermediate. Reactivity rises with more nitro groups: chlorobenzene < 4-nitrochlorobenzene < 2,4-dinitrochlorobenzene < 2,4,6-trinitrochlorobenzene (hydrolysed by warm water). A meta nitro group helps far less.

In **electrophilic** substitution, halogens are **deactivating** (inductive pull) yet **ortho-para directing** (lone pairs donated by resonance). Chlorobenzene gives mainly 4-chloronitrobenzene on nitration.

## 6. Polyhalogen compounds

- **CH₂Cl₂**: solvent, paint stripper; harms the nervous system in high doses.
- **CHCl₃**: once an anaesthetic; in air and light it forms poisonous **phosgene** COCl₂, so it is stored in dark bottles, full, with a little ethanol added.
- **CHI₃**: yellow antiseptic (releases iodine).
- **CCl₄**: once used in fire extinguishers and dry cleaning; toxic to the liver, ozone-depleting.
- **Freons (CFCs)**: inert refrigerants and aerosol propellants; in the stratosphere UV light frees Cl atoms that destroy ozone. Phased out under the Montreal Protocol.
- **DDT**: the first chlorinated insecticide; it builds up in food chains because it is fat-soluble and breaks down slowly.

<div class="problem" data-problem="ha-carius"></div>

<div class="keypoints">

- Reactivity of R-X: I > Br > Cl > F (weaker bond, better leaving group).
- SOCl₂ is the cleanest way to make R-Cl from an alcohol; Finkelstein (NaI/acetone) and Swarts (AgF) exchange halogens.
- SN2: one step, second order, inversion, CH₃ > 1° > 2° > 3°, polar aprotic solvent.
- SN1: two steps, first order, racemisation, 3° > 2° > 1°, polar protic solvent, rearrangements.
- KCN gives nitriles, AgCN isocyanides; aqueous KOH substitutes, alcoholic KOH eliminates (Saytzeff).
- Grignard reagents are destroyed by any O-H or N-H; keep everything dry.
- Aryl halides: partial double bond, resist SN; o/p nitro groups activate; halogens are o/p directing but deactivating.

</div>
