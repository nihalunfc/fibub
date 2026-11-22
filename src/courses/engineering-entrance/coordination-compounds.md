---
title: 'Coordination compounds'
seoTitle: 'Coordination compounds: JEE and NEET chemistry'
summary: 'Werner''s theory, ligands and denticity, coordination number, IUPAC names, structural and stereo isomerism, valence bond theory, crystal field theory with CFSE, colour and magnetism, the spectrochemical series, metal carbonyls and the EAN rule, stability constants and uses, from basics to JEE Advanced depth.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'The oxidation state and coordination number of Co in [Co(en)₂Cl₂]⁺ are:'
    choices: ['+1 and 4', '+3 and 6', '+2 and 6', '+3 and 4']
    ans: 1
    why: 'en is neutral and bidentate; Cl⁻ is −1. x + 0 − 2 = +1, so x = +3. Two en give 4 donor atoms and two Cl give 2: coordination number 6.'
  - q: '[Fe(CN)₆]⁴⁻ is diamagnetic but [Fe(H₂O)₆]²⁺ is paramagnetic because:'
    choices: ['Fe has different oxidation states in them', 'CN⁻ is a strong-field ligand that pairs the d electrons', 'water is a strong-field ligand', 'cyanide complexes are tetrahedral']
    ans: 1
    why: 'Both contain Fe²⁺ (d⁶). CN⁻ splits the d orbitals widely, so all six electrons pair in t₂g (0 unpaired). Water is weak field: t₂g⁴ e_g² with 4 unpaired.'
  - q: 'How many geometrical isomers does [Pt(NH₃)₂Cl₂] (square planar) have?'
    choices: ['1', '2', '3', '0']
    ans: 1
    why: 'cis (the two Cl side by side) and trans (opposite). cis-platin is an anticancer drug; the trans isomer is not.'
sources:
  - 'NEET (UG), JEE Main and JEE Advanced 2026 syllabi: Coordination compounds'
  - 'IUPAC Nomenclature of Inorganic Chemistry, Recommendations 2005 (ligand names such as chlorido, cyanido) https://iupac.org/what-we-do/books/redbook/'
  - 'CODATA 2018 values of h, c and N_A https://physics.nist.gov/cuu/Constants/'
---

**Chemistry · Class 12 · about 38 minutes.** By the end you will be able to name any complex, find its oxidation state and coordination number, count its isomers, predict its shape, magnetism and colour with valence bond and crystal field theory, and use the EAN rule and stability constants.

<div class="bigidea">A coordination compound is a metal ion holding a set of molecules or ions (ligands) by their lone pairs. The metal is the Lewis acid, the ligands are Lewis bases. How many ligands it holds and how strongly they push on its d electrons decide the shape, colour and magnetism.</div>

## 1. Werner's theory and the words you need

Werner studied CoCl₃·xNH₃ salts and saw that the number of Cl⁻ precipitated by AgNO₃ changed with x. He proposed two kinds of valence: **primary** (ionisable, the oxidation state; satisfied by anions outside the bracket) and **secondary** (non-ionisable, the coordination number; satisfied by ligands inside, pointing in fixed directions).

| Formula | Werner's formula | Cl⁻ precipitated | Ions in solution |
|---|---|---|---|
| CoCl₃·6NH₃ | [Co(NH₃)₆]Cl₃ | 3 | 4 |
| CoCl₃·5NH₃ | [Co(NH₃)₅Cl]Cl₂ | 2 | 3 |
| CoCl₃·4NH₃ | [Co(NH₃)₄Cl₂]Cl | 1 | 2 |

- **Ligand**: a donor of an electron pair. **Denticity**: how many donor atoms it uses. Monodentate (NH₃, H₂O, Cl⁻, CN⁻), bidentate (en = ethane-1,2-diamine, ox²⁻ = oxalate), hexadentate (EDTA⁴⁻). A ligand binding through two atoms in a ring is a **chelate**, much more stable than separate ligands.
- **Ambidentate** ligands can bind through either of two atoms: NO₂⁻ (nitrito-N through N, nitrito-O through O), SCN⁻ (through S or N), CN⁻.
- **Coordination number** = number of donor atoms bonded to the metal (not the number of ligands).

<div class="problem" data-problem="cc-werner"></div>

## 2. IUPAC names

Cation first, then anion. Inside the bracket: ligands in **alphabetical order** (ignoring di-, tri-), then the metal with its oxidation state in Roman numerals. Anionic ligands end in -o (chlorido, cyanido, hydroxido, oxalato); neutral ones keep their names except **aqua** (H₂O), **ammine** (NH₃), **carbonyl** (CO), **nitrosyl** (NO). If the complex is an anion, the metal ends in **-ate** (cobaltate; ferrate for Fe, cuprate for Cu, argentate for Ag, aurate for Au).

Examples: [Co(NH₃)₅Cl]Cl₂ is pentaamminechloridocobalt(III) chloride. K₄[Fe(CN)₆] is potassium hexacyanidoferrate(II). [Pt(NH₃)₂Cl₂] is diamminedichloridoplatinum(II).

## 3. Isomerism

**Structural isomers** (different bonds):
- **Ionisation**: a ligand and a counter-ion swap: [Co(NH₃)₅Br]SO₄ and [Co(NH₃)₅SO₄]Br.
- **Hydrate (solvate)**: water inside or outside: [Cr(H₂O)₆]Cl₃ (violet) and [Cr(H₂O)₅Cl]Cl₂·H₂O (green).
- **Linkage**: an ambidentate ligand binds through a different atom: -NO₂ vs -ONO.
- **Coordination**: ligands swap between a complex cation and anion: [Co(NH₃)₆][Cr(CN)₆] and [Cr(NH₃)₆][Co(CN)₆].

**Stereoisomers** (same bonds, different arrangement in space):
- **Geometrical (cis-trans)**: square planar MA₂B₂ (2 isomers); octahedral MA₄B₂ (2: cis, trans); MA₃B₃ (2: fac, with the three B on one face, and mer, around a meridian). Tetrahedral complexes show none.
- **Optical**: mirror images that cannot be superimposed. Common with chelates: [Co(en)₃]³⁺ has a d and an l form; cis-[Co(en)₂Cl₂]⁺ is optically active, the trans form is not (it has a mirror plane).

<div class="myth">

**"A tetrahedral complex MA₂B₂ has cis and trans forms, like the square planar one."** In a tetrahedron every corner is next to every other corner, so there is only one arrangement. Geometrical isomerism needs square planar or octahedral shapes.

</div>

## 4. Valence bond theory

The metal mixes empty orbitals into hybrids that take the ligands' lone pairs:

| Coordination number | Hybridisation | Shape | Example |
|---|---|---|---|
| 4 | sp³ | tetrahedral | [NiCl₄]²⁻, [Ni(CO)₄] |
| 4 | dsp² | square planar | [Ni(CN)₄]²⁻, [PtCl₄]²⁻ |
| 6 | d²sp³ (inner orbital, low spin) | octahedral | [Fe(CN)₆]³⁻, [Co(NH₃)₆]³⁺ |
| 6 | sp³d² (outer orbital, high spin) | octahedral | [CoF₆]³⁻, [Fe(H₂O)₆]²⁺ |

VBT predicts shape and magnetism but cannot explain colour or why some ligands pair electrons. Crystal field theory does.

## 5. Crystal field theory

Treat ligands as negative charges. In an **octahedral** field, the two d orbitals pointing at the ligands (d_x²−y², d_z², the **e_g** set) are pushed up by 0.6Δo; the three pointing between them (d_xy, d_yz, d_xz, the **t₂g** set) drop by 0.4Δo. In a **tetrahedral** field the order flips (e below t₂), and the gap is small: Δt ≈ (4/9)Δo.

When the 4th electron arrives, it can go up into e_g (costing Δo) or pair in t₂g (costing the **pairing energy P**). **Weak field** (Δo < P): high spin. **Strong field** (Δo > P): low spin. The **spectrochemical series** ranks ligands by field strength:

I⁻ < Br⁻ < SCN⁻ < Cl⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < NCS⁻ < NH₃ < en < NO₂⁻ < CN⁻ < CO

<figure class="fig" data-fig="coord-cfse"><figcaption>Choose a shape, a field strength and the d count. The electrons fill the split levels; the readout gives the unpaired electrons, the spin-only moment and the CFSE. Strong-field octahedral d⁴ to d⁷ complexes are where low spin changes everything.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Δo, Δt</dt><dd>energy gap between the two sets of d orbitals in octahedral and tetrahedral fields</dd>
<dt>P</dt><dd>pairing energy: the cost of putting two electrons in one orbital</dd>
<dt>CFSE</dt><dd>crystal field stabilisation energy = (−0.4 × t₂g electrons + 0.6 × e_g electrons) Δo, plus P for each extra pair</dd>
<dt>EAN</dt><dd>effective atomic number = electrons on the metal ion + 2 per donor bond</dd>
<dt>β</dt><dd>overall stability constant; larger β, more stable complex</dd>
<dt>Physical meaning</dt><dd>Ligand lone pairs repel the metal's d electrons. Electrons sit in the d orbitals that avoid the ligands, and that lowers the energy.</dd>
</dl>
</div>

<div class="problem" data-problem="cc-cfse"></div>

**Colour.** A d electron absorbs a photon of energy Δo and jumps from t₂g to e_g; the complex shows the complementary colour. [Ti(H₂O)₆]³⁺ absorbs green-yellow (about 500 nm) and looks purple. Stronger ligands absorb shorter wavelengths: [Ni(H₂O)₆]²⁺ is green, [Ni(en)₃]²⁺ violet.

<div class="problem" data-problem="cc-wavelength"></div>

<div class="myth">

**"Since NH₃ is a stronger ligand than H₂O, all ammine complexes are low spin."** Low spin needs Δo > P, which also depends on the metal. Co³⁺ (high charge) with NH₃ is low spin, but [Co(NH₃)₆]²⁺ is high spin. Higher charge and heavier metals (4d, 5d) raise Δo: almost all Pt and Pd complexes are low spin.

</div>

## 6. Carbonyls, EAN and stability

**Metal carbonyls** (Ni(CO)₄ tetrahedral, Fe(CO)₅ trigonal bipyramidal, Cr(CO)₆ octahedral, Mn₂(CO)₁₀ and Co₂(CO)₈ with metal-metal bonds) are held by **synergic bonding**: CO gives a σ pair to the metal, and the metal gives d electrons back into CO's empty π* orbital. This back bonding strengthens M-C and weakens C≡O (longer C-O, lower stretching frequency).

**EAN rule**: stable carbonyls often reach the next noble gas count. Ni(CO)₄: Ni has 28 electrons, + 4 × 2 = 36 (krypton). Fe(CO)₅: 26 + 10 = 36.

**Stability constant**: for M + 4L ⇌ ML₄, β₄ = [ML₄]/([M][L]⁴) = K₁K₂K₃K₄. Chelates are much more stable (the **chelate effect**, driven by entropy: one en frees two waters).

**Uses**: EDTA titrations measure water hardness; [Ag(CN)₂]⁻ and [Au(CN)₂]⁻ in extraction and electroplating; Mond process (Ni(CO)₄) purifies nickel; cis-platin treats cancer; haemoglobin (Fe), chlorophyll (Mg) and vitamin B₁₂ (Co) are natural complexes; Wilkinson's catalyst [RhCl(PPh₃)₃] hydrogenates alkenes.

<div class="keypoints">

- Oxidation state: charge of complex minus sum of ligand charges. CN = number of donor atoms.
- Name ligands alphabetically, then metal (-ate if the complex is an anion) with its oxidation state.
- Isomers: ionisation, hydrate, linkage, coordination; geometrical (cis/trans, fac/mer); optical (chelates).
- VBT: sp³ tetrahedral, dsp² square planar, d²sp³ inner (low spin), sp³d² outer (high spin).
- CFT: t₂g −0.4Δo, e_g +0.6Δo; Δt ≈ 4/9 Δo, always high spin.
- Spectrochemical series: I⁻ weakest, CO and CN⁻ strongest.
- Carbonyls: synergic bonding; EAN often 36 (Ni(CO)₄, Fe(CO)₅).

</div>
