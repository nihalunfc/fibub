---
title: 'Hydrocarbons'
seoTitle: 'Hydrocarbons and aromaticity: JEE and NEET chemistry'
summary: 'Alkanes (preparation, free radical halogenation and its selectivity, combustion, conformations), alkenes (preparation, Markovnikov and anti-Markovnikov addition, rearrangements, hydration methods, ozonolysis, oxidation), alkynes (acidity, partial reduction, hydration) and aromatic hydrocarbons (benzene, Hückel''s rule, electrophilic substitution and directing groups).'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'HBr adds to propene in the presence of a peroxide to give mainly:'
    choices: ['2-bromopropane', '1-bromopropane', '1,2-dibromopropane', 'propane']
    ans: 1
    why: 'With peroxide, HBr adds by a free radical chain: Br• adds to the end carbon to give the more stable 2° radical, so Br ends up on C1 (anti-Markovnikov). This works only for HBr.'
  - q: 'Which is aromatic?'
    choices: ['Cyclobutadiene', 'Cyclooctatetraene', 'Cyclopentadienyl anion', 'Cyclopentadiene']
    ans: 2
    why: 'The cyclopentadienyl anion is cyclic, planar, fully conjugated and has 6 π electrons (4n + 2 with n = 1). Cyclobutadiene has 4 (anti-aromatic) and cyclooctatetraene is tub-shaped.'
  - q: 'Nitration of toluene gives mainly:'
    choices: ['m-nitrotoluene', 'o- and p-nitrotoluene', 'only p-nitrotoluene', 'nitrobenzene']
    ans: 1
    why: 'CH₃ is an activating, ortho and para directing group (by +I and hyperconjugation), so the ortho and para products dominate.'
sources:
  - 'IUPAC (2013), Nomenclature of Organic Chemistry: IUPAC Recommendations and Preferred Names https://iupac.qmul.ac.uk/BlueBook/'
  - 'Torsional energies of ethane and butane: Pitzer K. S. (1951), Discussions of the Faraday Society 10, 66, and standard physical organic chemistry data'
  - 'NEET (UG) and JEE Main / JEE Advanced 2026 syllabi: Hydrocarbons'
---

**Chemistry · Class 11 · about 40 minutes.** By the end you will be able to make and convert alkanes, alkenes, alkynes and arenes, predict the main product of any addition or substitution, explain conformations, and decide whether a ring is aromatic and where a new group will enter a benzene ring.

<div class="bigidea">Alkanes have only strong σ bonds, so they react only by free radical substitution. Alkenes and alkynes have exposed π electrons, so they add electrophiles. Benzene also has π electrons, but they are locked in an especially stable ring, so it prefers substitution, which keeps the ring intact.</div>

## 1. Alkanes: making them

- **Hydrogenation** of alkenes or alkynes with H₂ over Ni, Pt or Pd.
- **Wurtz reaction**: 2RX + 2Na → R-R + 2NaX in dry ether. The carbon count doubles, so it makes symmetric alkanes with an even number of carbons; two different halides give a messy mixture. Methane cannot be made this way.
- **Decarboxylation**: heating a sodium carboxylate with soda lime (NaOH + CaO) gives an alkane with **one carbon fewer**: CH₃COONa → CH₄.
- **Kolbe electrolysis**: electrolysis of sodium carboxylate solution gives R-R at the anode (2RCOO⁻ → R-R + 2CO₂ + 2e⁻).

## 2. Alkanes: reactions and conformations

**Free radical halogenation** in light: initiation (Cl₂ → 2Cl•), propagation (Cl• + CH₄ → HCl + CH₃•, then CH₃• + Cl₂ → CH₃Cl + Cl•) and termination (two radicals join). The order of reactivity of hydrogens is 3° &gt; 2° &gt; 1°, matching radical stability. Chlorine is fast and unselective (about 5 : 3.8 : 1 per H); bromine is slow and very selective (about 1600 : 82 : 1), so it nearly always takes the tertiary H. Iodination is reversible and fluorination explosive.

<div class="problem" data-problem="hc-halo-ratio"></div>

**Combustion**: CₓHᵧ + (x + y/4) O₂ → x CO₂ + (y/2) H₂O. Gas volume problems use this ratio directly at the same temperature and pressure.

<div class="problem" data-problem="hc-combustion"></div>

**Conformations** are the shapes made by turning about a C-C single bond. In ethane, the **staggered** form is 12 kJ/mol lower than the **eclipsed** form (the C-H bonds repel when lined up). In butane (looking along C2-C3), **anti** is lowest, **gauche** (CH₃ groups 60° apart) is 3.8 kJ/mol higher, and the **fully eclipsed** form is highest. These barriers are small, so at room temperature the forms swap rapidly and cannot be separated. Cyclohexane prefers the strain-free **chair** shape over the **boat**.

<figure class="fig" data-fig="butane-conformers"><figcaption>Turn the back carbon with the slider. The Newman projection shows the front bonds (from the centre) and the back bonds (from the circle); the dot follows the energy curve. Compare ethane's simple three-fold curve with butane's anti, gauche and eclipsed forms.</figcaption></figure>

<div class="meaning">
<dl>
<dt>C<sub>x</sub>H<sub>y</sub></dt><dd>a hydrocarbon with x carbons and y hydrogens</dd>
<dt>Dihedral angle</dt><dd>the angle between a bond on the front carbon and a bond on the back carbon, seen along the C-C bond</dd>
<dt>Markovnikov's rule</dt><dd>in HX addition, H goes to the double bond carbon that already has more H, because that route passes through the more stable carbocation</dd>
<dt>4n + 2</dt><dd>Hückel's rule: a cyclic, planar, fully conjugated ring with 2, 6, 10... π electrons is aromatic</dd>
<dt>Physical meaning</dt><dd>Every addition and substitution product in this chapter is decided by which intermediate (carbocation or radical) is more stable. Find the intermediate and you have the product.</dd>
</dl>
</div>

**Try it:** press Play (or slide) to turn the back carbon of ethane, then jump to the staggered and eclipsed forms.

<figure class="fig" data-fig="@chem-newman-ethane"><figcaption>Staggered (60°, 180°, 300°) is lowest in energy. The three-fold curve has a barrier of about 12 kJ/mol, small enough that rotation about the C–C single bond is fast at room temperature.</figcaption></figure>

**Try it:** drag to look at the chair from several sides, then slide the ring flip from 0 to 100%. Watch the orange methyl group go from equatorial to axial.

<figure class="fig" data-fig="@chem-chair-flip"><figcaption>Every axial bond becomes equatorial after a flip and vice versa. A substituent prefers the equatorial position because an axial one is crowded by the two axial H atoms on the same side (1,3-diaxial strain).</figcaption></figure>

## 3. Alkenes

**Preparation**: dehydration of alcohols with hot concentrated H₂SO₄ (or Al₂O₃), and **dehydrohalogenation** of alkyl halides with alcoholic KOH. When two alkenes can form, the more substituted (more stable) one usually wins: **Saytzeff (Zaitsev) rule**. A bulky base like (CH₃)₃CO⁻ gives the less substituted **Hofmann** product. Partial reduction of alkynes also gives alkenes (section 4).

**Electrophilic addition.**

- **H₂** over Ni: alkane. The heat released is smaller for more stable alkenes (trans less than cis).
- **Br₂** in CCl₄: the red-brown colour disappears (test for unsaturation); the two Br add **anti** through a bromonium ion.
- **HX**: **Markovnikov** product via the more stable carbocation; reactivity HI &gt; HBr &gt; HCl. A carbocation may **rearrange** by a hydride or methyl shift to a more stable one, giving an unexpected product.
- **HBr with peroxide** (**Kharasch effect**): **anti-Markovnikov**, through radicals. Only HBr does this; HCl and HI do not.
- **Hydration**: dilute H₂SO₄ gives the Markovnikov alcohol (rearrangements possible); **oxymercuration-demercuration** (Hg(OAc)₂/H₂O, then NaBH₄) gives the Markovnikov alcohol with no rearrangement; **hydroboration-oxidation** (BH₃, then H₂O₂/OH⁻) gives the **anti-Markovnikov** alcohol by syn addition.

**Oxidation**: cold, dilute, alkaline KMnO₄ (**Baeyer's reagent**) gives a diol and loses its purple colour. Hot acidic KMnO₄ cuts the double bond: =CH₂ becomes CO₂, =CHR becomes RCOOH, =CR₂ becomes a ketone. **Ozonolysis** (O₃, then Zn/H₂O) cuts the double bond into two carbonyl compounds; working back from the products locates the double bond. Alkenes also **polymerise** (ethene to polythene).

<div class="myth">

**"Markovnikov's rule is about where the X goes."** The rule is really about the carbocation. H⁺ adds first, to whichever carbon leaves the more stable carbocation; X⁻ then joins the positive carbon. When a group like CF₃ makes the "Markovnikov" cation unstable, the product goes the other way.

</div>

**Try it:** pick an alkene and compare the two energy paths with and without peroxide. Which path is lower? Which product does it lead to?

<figure class="fig" data-fig="@chem-markovnikov"><figcaption>The lower barrier belongs to the more stable carbocation (polar) or radical (with peroxide). H⁺ goes to the carbon with more H atoms in the polar reaction; with peroxide Br• goes to the less substituted carbon, so the product reverses.</figcaption></figure>

## 4. Alkynes

Ethyne is made from calcium carbide and water (CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂) or by double dehydrohalogenation of a vicinal dihalide with alcoholic KOH then NaNH₂. A hydrogen on a triple bond carbon is weakly **acidic** (sp carbon holds the electron pair well): terminal alkynes react with Na or NaNH₂ and give a white precipitate with ammoniacal AgNO₃ (a test that tells but-1-yne from but-2-yne).

- **Reduction**: H₂ with **Lindlar's catalyst** (poisoned Pd) gives the **cis** alkene; **Na in liquid NH₃** gives the **trans** alkene; excess H₂/Ni gives the alkane.
- **Hydration** with dilute H₂SO₄ and HgSO₄: an enol forms first and tautomerises to a carbonyl. Ethyne gives ethanal; other alkynes give ketones (propyne gives propanone).
- **Addition of HX** twice gives a geminal dihalide (both X on the same carbon).
- Red-hot iron tube: three ethyne molecules join into **benzene**.

<div class="problem" data-problem="hc-hydrogenation"></div>

## 5. Aromatic hydrocarbons

**Benzene** C₆H₆ is a flat regular hexagon; all six C-C bonds are equal (139 pm, between single and double). The six π electrons are spread over the whole ring, which makes it about 150 kJ/mol more stable than a ring with three separate double bonds (the **resonance energy**). That is why benzene resists addition.

**Aromaticity (Hückel's rule)**: a molecule is aromatic if it is cyclic, planar, fully conjugated (every ring atom has a p orbital) and has **4n + 2 π electrons**. Benzene (6), the cyclopentadienyl anion (6), the cycloheptatrienyl (tropylium) cation (6), pyridine and furan are aromatic. A planar conjugated ring with 4n π electrons (cyclobutadiene) is **anti-aromatic** and very unstable. Cyclooctatetraene avoids this by folding into a tub: non-aromatic.

**Electrophilic substitution.** An electrophile attacks the ring to form a carbocation (the **σ complex** or arenium ion), which then loses H⁺ to restore the aromatic ring.

| Reaction | Reagents | Electrophile |
|---|---|---|
| Nitration | conc. HNO₃ + conc. H₂SO₄ | NO₂⁺ |
| Halogenation | Cl₂ or Br₂ with FeCl₃ or FeBr₃ | Cl⁺ (Br⁺) |
| Sulfonation | fuming H₂SO₄ | SO₃ |
| Friedel-Crafts alkylation | RCl + anhydrous AlCl₃ | R⁺ (may rearrange) |
| Friedel-Crafts acylation | RCOCl + anhydrous AlCl₃ | RCO⁺ |

**Directing effects.** A group already on the ring decides where the next one goes.

- **Ortho and para directors, activating**: -OH, -NH₂, -OR, -NHCOCH₃ (lone pair donated by resonance), -CH₃ and other alkyl groups (+I, hyperconjugation).
- **Ortho and para directors, deactivating**: halogens (−I outweighs +R for the rate, but +R still steers to o and p).
- **Meta directors, deactivating**: -NO₂, -CN, -CHO, -COR, -COOH, -SO₃H, -NR₃⁺ (they pull electrons out and make the o and p positions most positive).

Friedel-Crafts reactions fail on rings with strong meta directors such as nitrobenzene. **Side-chain oxidation**: hot KMnO₄ turns any alkyl group with at least one benzylic H into -COOH (toluene to benzoic acid); tert-butylbenzene is not oxidised.

**Watch it happen:** nitration of benzene, step by step, and then the directing effect of a group already on the ring.

<div class="steps" data-fig="@chem-eas-nitration" data-title="Electrophilic substitution" data-ms="7000">
<div class="step"><b>Make the electrophile.</b> The nitrating mixture produces NO₂⁺.</div>
<div class="step"><b>The ring attacks.</b> Two π electrons form a bond to N: the slow step.</div>
<div class="step"><b>The arenium ion.</b> The + is spread over the o and p carbons.</div>
<div class="step"><b>Lose H⁺.</b> Aromaticity returns: nitrobenzene.</div>
<div class="step"><b>Directing effects.</b> Pick OH, CH₃, Cl or NO₂ to see where the next NO₂ goes.</div>
</div>

<div class="myth">

**"Every cyclic molecule with alternating double bonds is aromatic."** It must also be planar and have 4n + 2 π electrons. Cyclobutadiene (4 π electrons) is anti-aromatic and cyclooctatetraene (8, tub-shaped) is non-aromatic. Count the π electrons, including lone pairs or charges that join the ring system.

</div>

<div class="keypoints">

- Wurtz doubles the carbons; decarboxylation removes one; Kolbe gives R-R at the anode.
- Halogenation selectivity per H: Cl 5 : 3.8 : 1, Br 1600 : 82 : 1 (3° : 2° : 1°).
- Butane: anti 0, gauche 3.8, fully eclipsed highest; ethane barrier 12 kJ/mol.
- Markovnikov through the more stable carbocation; anti-Markovnikov with HBr + peroxide or hydroboration.
- Lindlar gives cis alkenes, Na/NH₃ trans; alkyne hydration gives ethanal or ketones.
- Ozonolysis cuts C=C into carbonyls; Baeyer's reagent gives diols (purple colour lost).
- Aromatic: cyclic, planar, conjugated, 4n + 2 π electrons.
- o/p directors: OH, NH₂, OR, alkyl, halogens (deactivating); meta: NO₂, CN, CHO, COOH, SO₃H.

</div>
