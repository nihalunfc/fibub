---
title: 'Organic Chemistry: Some Basic Principles and Techniques'
seoTitle: 'Organic Chemistry Basics Class 11 notes: IUPAC, GOC'
summary: 'Class 11 Organic Chemistry basics with animations: carbon shapes, IUPAC naming, isomers, inductive and resonance effects, purification, analysis.'
minutes: 110
updated: 2026-11-23
quiz:
  - q: 'What is the IUPAC name of CH₃–CH(CH₃)–CH₂–CH₂OH?'
    choices: ['3-methylbutan-1-ol', '2-methylbutan-4-ol', 'pentan-1-ol', '2-methylbutan-1-ol']
    ans: 0
    why: 'The longest chain with the –OH has 4 carbons (butane). Number from the end that gives –OH the lowest number (C1). The methyl sits on C3, so the name is 3-methylbutan-1-ol.'
  - q: 'Which carbocation is the most stable?'
    choices: ['(CH₃)₃C⁺', '(CH₃)₂CH⁺', 'CH₃CH₂⁺', 'CH₃⁺']
    ans: 0
    why: 'The more alkyl groups attached to the positive carbon, the more electrons are pushed to it (inductive effect and hyperconjugation), so 3° > 2° > 1° > methyl.'
  - q: 'In Lassaigne’s test, nitrogen and sulphur together give a blood-red colour with acidified FeCl₃ because they form:'
    choices: ['NaSCN', 'Na₂S', 'NaCN', 'Na₂SO₄']
    ans: 0
    why: 'Fusion with sodium turns N and S into thiocyanate ions, SCN⁻, which form the blood-red [Fe(SCN)]²⁺ with Fe³⁺.'
sources:
  - 'NCERT Class 11 Chemistry, Chapter 8 “Organic Chemistry: Some Basic Principles and Techniques” (topic list only; all text, figures and questions here are original fibub work)'
  - 'IUPAC, Nomenclature of Organic Chemistry: Recommendations and Preferred Names 2013 (naming rules)'
  - 'Typical pKa values of substituted ethanoic acids: CRC Handbook of Chemistry and Physics, 97th edition, “Dissociation constants of organic acids”'
  - 'Typical bond lengths (C–O in carboxylate, C–C in benzene): Allen et al., “Tables of bond lengths determined by X-ray and neutron diffraction”, J. Chem. Soc. Perkin Trans. 2 (1987)'
---

**Chemistry · Class 11 · Chapter 8 · about 110 minutes.** By the end you will be able to describe the shapes of carbon compounds, name them by IUPAC rules, spot every kind of isomer, explain why electrons shift in molecules (inductive, resonance and hyperconjugation), predict the stability of reaction intermediates, choose a way to purify a compound, and detect and estimate the elements in it.

<div class="bigidea">Organic chemistry has millions of compounds but only a few ideas. Carbon forms four bonds, so it builds chains, branches and rings. Where electrons sit in a molecule decides where a reaction happens, and the same few electron-pushing patterns explain nearly every reaction. Learn the language (names, isomers, arrows), and the rest of organic chemistry becomes pattern-spotting.</div>

## 1. General introduction

Organic chemistry is the chemistry of carbon compounds, mainly those that contain carbon bonded to hydrogen. Plastic, petrol, sugar, soap, medicines and DNA are all organic. Wöhler’s 1828 laboratory synthesis of urea (from ammonium cyanate) showed that they need no “vital force”, so organic compounds can be made in a flask.

Carbon is special because it is **tetravalent**, bonds strongly with other carbon atoms (**catenation**) and forms single, double and triple bonds. Think of carbon as a LEGO brick with four studs: you can build a straight road, a branched road or a roundabout (a ring).

<div class="history">

**A short timeline**
- **1828:** Wöhler makes urea from an inorganic salt.
- **1858:** Kekulé proposes that carbon is tetravalent and that carbon atoms link in chains.
- **1874:** van ’t Hoff and Le Bel propose the tetrahedral carbon.
- **1892:** the first international rules for naming organic compounds (Geneva), later developed into the IUPAC system.

</div>

## 2. Shapes of organic molecules and structure drawing

The shape of a carbon atom depends on its **hybridisation**:

- **sp³** carbon (four single bonds): tetrahedral, bond angle ~109.5°. Example: CH₄, the carbons of ethane.
- **sp²** carbon (one double bond): flat (trigonal planar), bond angle ~120°. Example: C₂H₄, C=O of carbonyls.
- **sp** carbon (one triple bond, or two double bonds): linear, bond angle 180°. Example: C₂H₂.

The more **s-character** in the hybrid orbital, the shorter and stronger the bond. A **sigma (σ) bond** is end-on overlap along the axis. A **pi (π) bond** is side-on overlap above and below the axis, and is weaker and more easily attacked. A double bond = 1σ + 1π; a triple bond = 1σ + 2π.

<figure class="fig" data-fig="@chem-hybrid-lobes"><figcaption>sp, sp² and sp³ hybrid orbitals in 3D. Turn them and compare how many lobes and what angles they make.</figcaption></figure>

**Ways to write a structure.**

- **Complete:** every atom and bond shown.
- **Condensed:** CH₃CH₂CH₂CH₃ (butane); groups such as CH₃CH(OH)CH₃.
- **Bond-line (skeletal):** each corner and end is a carbon, hydrogens on carbon are not drawn, only groups other than H (like OH, Cl) are written. The zigzag in the figures below is a bond-line structure.

For a given formula you can often draw more than one structure: that is where **isomers** (section 5) come from.

## 3. Classification and homologous series

**Classification of organic compounds**

- **Acyclic (open chain)** or **cyclic**. Cyclic compounds are **alicyclic** (cyclohexane) or **aromatic** (benzene and its relatives).
- **Saturated** (only single bonds) or **unsaturated** (a double or triple bond).
- **Homocyclic** (ring of carbon only) and **heterocyclic** (ring with another atom, as in pyridine).

A **functional group** is an atom or group of atoms that gives a compound its typical reactions: –OH (alcohol), –CHO (aldehyde), >C=O (ketone), –COOH (carboxylic acid), –NH₂ (amine), –X (halide), C=C and C≡C.

A **homologous series** is a family with the same functional group and the same general formula, each member differing by –CH₂– (14 mass units from the next). For alkanes the formula is CₙH₂ₙ₊₂, alkenes CₙH₂ₙ, alkynes CₙH₂ₙ₋₂, and the physical properties change smoothly along the series.

## 4. Nomenclature (naming)

IUPAC names tell you the structure. The skeleton of a name is **prefix(es) + parent + suffix**:

1. **Parent chain:** the longest continuous chain that contains the principal functional group: meth (1), eth (2), prop (3), but (4), pent (5), hex (6), hept (7), oct (8), non (9), dec (10).
2. **Suffix** (the principal group, in priority order): carboxylic acid (-oic acid) > aldehyde (-al) > ketone (-one) > alcohol (-ol) > amine (-amine); then double bond (-ene) and triple bond (-yne). Halogens, alkyl groups (methyl, ethyl) and –NO₂ are **only prefixes** (chloro, bromo, methyl, nitro).
3. **Numbering:** give the principal group the lowest possible number. If a tie remains, the double or triple bond, and then the substituents, get the lowest numbers.
4. **Prefixes in alphabetical order** with a number for each (di-, tri- are ignored in ordering): 3-chloro-2-methylpentane.

<div class="steps" data-fig="c11c-org-namesteps">
<div class="step">Draw the structure out so the whole carbon skeleton is visible: CH₃–CH(CH₃)–CH₂–CH(OH)–CH₃.</div>
<div class="step">Find the longest chain that includes the –OH: five carbons, so the parent is pentane and, with –OH, pentan-ol.</div>
<div class="step">Number from the end nearest the –OH. –OH is on C2 from the right but C4 from the left, so number from the right.</div>
<div class="step">The branch is a methyl group on C4: call it 4-methyl.</div>
<div class="step">Assemble branch, parent and suffix with the group’s number: 4-methylpentan-2-ol.</div>
</div>

Now build any name yourself. Change the chain length, the functional group and a methyl or chloro substituent. The figure also renumbers the chain from the other end when that gives a lower number:

<figure class="fig" data-fig="c11c-org-namer"><figcaption>A name builder. The drawing and the IUPAC name change together. Try putting –OH on carbon 4 of a six-carbon chain: the chain is renumbered from the other end and the name uses the lower number, 3.</figcaption></figure>

<div class="problem" data-problem="c11c-org-rf"></div>

The carbon chain namer tool applies the same rules and checks your name:

<!--fig:tool carbon-chain-namer-->

<div class="myth">

**“The longest chain is the one drawn in a straight line.”** The drawing may bend or zigzag, but the parent is the longest *continuous* chain, which can run round a corner. Always count the carbons, and make sure the principal group is on the chain you choose.

</div>

**Common names and cyclic compounds.** Ring compounds take the prefix *cyclo-* (cyclohexane). Benzene derivatives are named as substituted benzenes (chlorobenzene), with 1,2- (ortho), 1,3- (meta) and 1,4- (para) for two groups. Common names like acetic acid (ethanoic), acetone (propanone) and formaldehyde (methanal) are still widely used.

## 5. Isomerism

**Isomers** have the same molecular formula but different structures, so different properties.

- **Chain (skeletal) isomerism:** different carbon skeleton. C₄H₁₀: butane and 2-methylpropane.
- **Position isomerism:** the same skeleton, but the group (or double bond) sits at different positions. C₃H₈O: propan-1-ol and propan-2-ol.
- **Functional-group isomerism:** different functional group. C₂H₆O: ethanol (alcohol) and methoxymethane (ether); C₃H₆O: propanal and propanone.
- **Metamerism:** different alkyl groups on each side of the same functional group (an ether or ketone): diethyl ether and methyl propyl ether, both C₄H₁₀O.

(Stereoisomerism, where the atoms are joined the same way but arranged differently in space, is met again in alkenes as cis–trans, and in Class 12 as optical isomerism.)

<figure class="fig" data-fig="c11c-org-isomers"><figcaption>Isomers for six molecular formulas. Highlight one kind of relationship at a time (chain, position, functional, ring-chain) to see how each isomer relates to the first.</figcaption></figure>

Draw every isomer of a formula and compare them in the explorer:

<!--fig:tool isomer-explorer-->

## 6. Fundamental concepts in organic reaction mechanisms

A **mechanism** is the step-by-step story of how electrons move. We use **curved arrows**: a full-headed arrow moves a *pair* of electrons, a half-headed (fish-hook) arrow moves one electron.

### 6.1 Breaking a bond: fission

- **Heterolytic fission:** the shared pair goes to the more electronegative atom, giving ions: (CH₃)₃C–Br → (CH₃)₃C⁺ + Br⁻.
- **Homolytic fission:** each atom takes one electron, giving **free radicals** (species with an unpaired electron). It needs light or heat or a peroxide: Cl–Cl → 2Cl·.

<div class="steps" data-fig="c11c-org-fission">
<div class="step">A covalent bond is a shared pair. If one atom is more electronegative, the pair sits closer to it.</div>
<div class="step">Heterolytic fission: the pair leaves with one atom, one atom becomes a cation and the other an anion.</div>
<div class="step">Example: tert-butyl bromide gives the (CH₃)₃C⁺ carbocation and Br⁻.</div>
<div class="step">Homolytic fission: each atom keeps one electron. The two fish-hook arrows show one electron each.</div>
<div class="step">Example: chlorine in sunlight gives two chlorine radicals that start a chain reaction.</div>
<div class="step">A nucleophile (electron-pair donor) attacks an electron-poor (δ+) carbon and forms a new bond.</div>
</div>

**Reagents.** An **electrophile** (E⁺) is electron-loving: H⁺, NO₂⁺, carbocations, AlCl₃, and carbonyl carbon. A **nucleophile** (Nu⁻) is nucleus-loving and electron-rich: OH⁻, CN⁻, NH₃, H₂O. A useful cricket picture: the electrophile is the fielder running toward the ball; the nucleophile is the ball itself, heading for the positive stumps. Nucleophiles attack positive centres; electrophiles attack negative or electron-rich centres such as double bonds.

**Reactive intermediates.** Carbocations (C⁺, planar sp², six electrons), carbanions (C⁻, pyramidal), and free radicals (C·, one unpaired electron) are short-lived species formed in many mechanisms.

### 6.2 Electron displacement effects in covalent bonds

**Inductive effect (I).** In C–Cl, chlorine pulls the sigma pair toward itself, so C becomes δ+. That carbon pulls on the next, and the effect fades quickly along the chain (negligible after about three carbons). Groups that *pull* electrons (–NO₂, –F, –Cl, –OH, –COOH) show the **–I effect**; alkyl groups *push* electrons (**+I effect**). The pull makes ClCH₂COOH a stronger acid than CH₃COOH.

<figure class="fig" data-fig="c11c-org-induct"><figcaption>How far does the pull go? Choose the group X in X–CH₂COOH, or move Cl along butanoic acid. The δ+ sign shrinks at each bond and the pKa bar shows the acid getting stronger (lower pKa) when the pull is stronger or closer.</figcaption></figure>

**Resonance.** Sometimes one drawing cannot show where the electrons are. The carboxylate ion RCOO⁻ can be drawn with the C=O at either oxygen. Measurements show both C–O bonds are equal (about 127 pm). The true molecule, the **resonance hybrid**, is an average of the contributing structures and is more stable than any one of them. This extra stability is the **resonance energy**. The contributing structures are *not* real forms that switch back and forth; they are separate drawings of one molecule. Use a double-headed arrow ↔ between them.

<figure class="fig" data-fig="c11c-org-resonance"><figcaption>Draw the carboxylate ion, the allyl cation or benzene as structure A, structure B or the real hybrid. The hybrid has bonds in between (dashed) and the charge shared out.</figcaption></figure>

**Rules for resonance:** only electrons move, never atoms; every structure has the same number of paired and unpaired electrons and the same total charge; structures with complete octets and with negative charge on the more electronegative atom contribute more.

**Hyperconjugation.** The C–H bonds next to a positive carbon (or a double bond) overlap a little with the empty p orbital and spread the charge. The more α C–H bonds, the more stable the carbocation: CH₃⁺ (0) < CH₃CH₂⁺ (3) < (CH₃)₂CH⁺ (6) < (CH₃)₃C⁺ (9). It is often called “no-bond resonance”.

<figure class="fig" data-fig="c11c-org-carbocation"><figcaption>Choose a carbocation. Arrows show alkyl groups pushing electrons into the empty p orbital; the bar chart compares stability. Allyl and benzyl cations gain stability from resonance instead.</figcaption></figure>

<div class="myth">

**“A resonance hybrid flips quickly between its two structures.”** No: the molecule has one structure, one set of bond lengths and one energy. The drawings are our way of describing electrons that are spread out. Benzene is not “single, double, single, double” for a moment and the reverse a moment later; all six bonds are the same.

</div>

<div class="problem" data-problem="c11c-org-carbon"></div>

<div class="meaning">

<dl>
<dt>+I / −I</dt><dd>electron push or pull through σ bonds; fades with distance</dd>
<dt>Resonance (mesomeric effect)</dt><dd>delocalisation of π electrons or lone pairs through a conjugated system; does not fade like the inductive effect</dd>
<dt>Hyperconjugation</dt><dd>delocalisation of σ electrons of C–H into a neighbouring empty p orbital or π bond</dd>
<dt>Physical meaning</dt><dd>all three spread charge over more atoms. A spread-out charge is lower in energy, which makes the species more stable and its reactions easier</dd>
</dl>

</div>

<div class="myth">

**Beyond the syllabus (check your board).** The *electromeric effect* is a temporary shift of a π pair to one atom when a reagent attacks, and is described in some older books. The rationalised NCERT book for 2026-27 teaches inductive, resonance and hyperconjugation effects; if your school’s syllabus includes electromeric effect, learn it as a short extension of resonance.

</div>

### 6.3 Types of organic reactions

1. **Substitution:** one atom or group is replaced by another: CH₃Br + OH⁻ → CH₃OH + Br⁻ (nucleophilic substitution); CH₄ + Cl₂ → CH₃Cl + HCl (free radical substitution).
2. **Addition:** two reactants join across a double or triple bond: CH₂=CH₂ + HBr → CH₃CH₂Br.
3. **Elimination:** a small molecule leaves, forming a double bond: CH₃CH₂Br + KOH(alc) → CH₂=CH₂ + KBr + H₂O.
4. **Rearrangement:** the atoms rearrange within the molecule (for example, a carbocation rearranging to a more stable one).

By the attacking reagent, reactions are nucleophilic, electrophilic or free-radical.

## 7. Methods of purification of organic compounds

A new compound must be pure before its melting point, spectra or analysis mean anything. The choice of method depends on **what is different** between the compound and its impurity. A chemist looking at a mixture asks one question: *what property differs the most?*

- **Crystallisation:** for solids, using different solubility in a hot and a cold solvent. (Sugar and salt: dissolve in hot ethanol, filter, cool.)
- **Sublimation:** one solid sublimes and the other does not (camphor, naphthalene, iodine).
- **Distillation:** for liquids whose boiling points differ by about 40 K or more. **Fractional distillation** for liquids that differ less (acetone and methanol). **Distillation under reduced pressure** for liquids that decompose before boiling (glycerol). **Steam distillation** for liquids not mixable with water but volatile in steam (aniline, turpentine, essential oils).
- **Differential extraction:** shaking an aqueous solution with an organic solvent such as ether in a separating funnel. The compound goes mainly into the organic layer.
- **Chromatography:** the mixture is carried by a mobile phase over a stationary phase. Components that cling differently move at different speeds.

<figure class="fig" data-fig="c11c-org-sep"><figcaption>Pick a mixture and see which property differs and the method that uses it. The bars show the property that differs: the bigger the gap, the easier the separation.</figcaption></figure>

**Chromatography in detail.** In paper chromatography the stationary phase is water held in paper and the solvent climbs by capillary action. In **thin-layer chromatography (TLC)** the stationary phase is a thin layer of silica or alumina on a plate. Each component gets a **retention factor**:

```math
R_f = \frac{\text{distance moved by the compound}}{\text{distance moved by the solvent front}}
```

<figure class="fig" data-fig="c11c-org-chroma"><figcaption>A plate being developed. Change the mixture, the solvent strength and the time. Rf stays between 0 and 1 and depends on the compound and solvent, not on how long you wait.</figcaption></figure>

<div class="problem" data-problem="c11c-org-rf"></div>

Practise Rf calculations and compare your spots in [the TLC Rf calculator](/science/tlc-rf-calculator/).

## 8. Qualitative analysis: detecting the elements

**Carbon and hydrogen** are detected together by heating with copper(II) oxide: carbon gives CO₂ (turns lime water milky) and hydrogen gives water (turns anhydrous copper sulphate blue).

**Nitrogen, sulphur, halogens: Lassaigne’s test.** Fuse the compound with sodium metal. The elements become ionic salts: NaCN, Na₂S and NaX. Boil with distilled water and filter to get the **sodium extract**, then test it.

<figure class="fig" data-fig="c11c-org-lassaigne"><figcaption>Lassaigne’s tests. Choose the element, then press “Add the reagent” and watch the colour appear: Prussian blue (N), violet or black (S), blood red (N and S), white, pale yellow or yellow precipitate (Cl, Br, I).</figcaption></figure>

- **Nitrogen:** boil the extract with FeSO₄ and NaOH, then acidify with H₂SO₄: **Prussian blue**.
- **Sulphur:** sodium nitroprusside gives a **violet** colour; or acetic acid and lead acetate give a **black** precipitate of PbS.
- **Nitrogen and sulphur together:** acidified FeCl₃ gives a **blood-red** colour (SCN⁻).
- **Halogens:** boil the extract with dilute HNO₃ first (to remove CN⁻ and S²⁻ that would interfere), then add AgNO₃: white (AgCl, soluble in NH₃), pale yellow (AgBr, slightly soluble) or yellow (AgI, insoluble).
- **Phosphorus:** oxidise to phosphate, then boil with HNO₃ and add ammonium molybdate: a yellow precipitate or colouration.

## 9. Quantitative analysis: how much of each element?

**Carbon and hydrogen (combustion):** burn a known mass of compound in oxygen with CuO. CO₂ is absorbed in KOH solution and H₂O in anhydrous CaCl₂.

```math
\%\,\mathrm{C} = \frac{12}{44}\times\frac{m_{\mathrm{CO_2}}}{m}\times 100,\qquad \%\,\mathrm{H} = \frac{2}{18}\times\frac{m_{\mathrm{H_2O}}}{m}\times 100
```

<div class="problem" data-problem="c11c-org-carbon"></div>

**Nitrogen.** *Dumas method*: heat with CuO in CO₂; the nitrogen collects as N₂ over KOH solution.

```math
\%\,\mathrm{N} = \frac{28}{22400}\times\frac{V_{\mathrm{STP}}\,(\mathrm{mL})}{m}\times 100
```

<div class="problem" data-problem="c11c-org-dumas"></div>

*Kjeldahl’s method*: the compound is digested with hot concentrated H₂SO₄ to ammonium sulphate, made alkaline, and the NH₃ is distilled into a known amount of acid and titrated.

<div class="steps" data-fig="c11c-org-kjeldahl">
<div class="step">Digest the sample with hot, concentrated H₂SO₄ (with K₂SO₄ and CuSO₄): nitrogen becomes (NH₄)₂SO₄.</div>
<div class="step">Add excess NaOH and distil: the ammonia gas is driven off.</div>
<div class="step">Pass the ammonia into a measured volume of standard H₂SO₄ in a receiving flask.</div>
<div class="step">Titrate the unused acid with standard NaOH, and subtract to find the acid used by the NH₃.</div>
<div class="step">Work out % N = 1.4 × normality × volume of acid used (mL) ÷ mass of sample (g).</div>
</div>

Kjeldahl is not suitable for nitro and azo compounds or for nitrogen in a ring (such as pyridine). Try both methods in the tool:

<!--fig:tool nitrogen-estimation-->

<div class="problem" data-problem="c11c-org-kjeldahl"></div>

**Halogens (Carius method).** Heat with fuming HNO₃ and AgNO₃ in a sealed tube; the halogen forms AgX, which is filtered, washed, dried and weighed:

```math
\%\,X = \frac{\text{Ar of }X}{\text{M of AgX}}\times\frac{m_{\mathrm{AgX}}}{m}\times 100
```

<div class="problem" data-problem="c11c-org-carius"></div>

**Sulphur** is oxidised to H₂SO₄ and weighed as BaSO₄: % S = (32/233) × (mass of BaSO₄ ÷ mass of compound) × 100. **Phosphorus** is oxidised to phosphoric acid and weighed as Mg₂P₂O₇ (222 g/mol, 62 g of P): % P = (62/222) × (mass of Mg₂P₂O₇ ÷ m) × 100. **Oxygen** is usually found by difference: 100 minus the sum of the percentages of the other elements.

<div class="keypoints">

- Carbon is tetravalent: sp³ (tetrahedral, 109.5°), sp² (planar, 120°), sp (linear, 180°). A double bond = 1σ + 1π.
- IUPAC name = prefixes (alphabetical) + parent chain + suffix. Number to give the principal group the lowest locant; priority acid > aldehyde > ketone > alcohol > amine.
- Isomers: chain, position, functional group, metamerism. Same formula, different structure.
- Heterolytic fission gives ions; homolytic fission gives radicals. Nucleophiles attack δ+ centres, electrophiles attack electron-rich ones.
- Inductive effect fades with distance; resonance spreads charge by π electrons; hyperconjugation uses neighbouring C–H bonds. Carbocation stability: 3° > 2° > 1° > CH₃⁺.
- Reaction types: substitution, addition, elimination, rearrangement.
- Purification: crystallisation, sublimation, distillation (simple, fractional, reduced pressure, steam), extraction, chromatography. Rf = spot distance ÷ solvent distance.
- Lassaigne: Prussian blue (N), violet or black (S), blood red (N + S), halide precipitates (Cl, Br, I).
- % C = (12/44)(m of CO₂/m) × 100; Dumas % N = (28/22400)(V/m) × 100; Kjeldahl % N = 1.4 N V/m; Carius % X = (Ar/M of AgX)(m of AgX/m) × 100.

</div>

Going further for JEE/NEET: [General organic chemistry](/learn/courses/engineering-entrance/goc/) (the entrance lesson with exam-level problems).

Practice for this chapter: [Organic Chemistry: Some Basic Principles and Techniques: practice questions](/learn/courses/ncert-class-11-chemistry/organic-chemistry-some-basic-principles-and-practice/).
