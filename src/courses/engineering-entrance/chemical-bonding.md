---
title: 'Chemical bonding and molecular structure'
seoTitle: 'Chemical bonding and VSEPR: JEE and NEET chemistry'
summary: 'Why atoms bond: Lewis structures and formal charge, ionic bonds and the Born-Haber cycle, Fajans rules, bond parameters and resonance, dipole moments, VSEPR shapes, hybridisation, molecular orbital theory with bond order and magnetism, and hydrogen bonding, up to JEE Advanced depth.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'Which molecule has a zero dipole moment?'
    choices: ['NH₃', 'H₂O', 'BF₃', 'SO₂']
    ans: 2
    why: 'BF₃ is trigonal planar: three equal B-F dipoles at 120° cancel. NH₃ and H₂O have lone pairs and are not symmetric; SO₂ is bent.'
  - q: 'The shape of XeF₄ is:'
    choices: ['Tetrahedral', 'Square planar', 'See-saw', 'Octahedral']
    ans: 1
    why: 'Xe has 4 bonds and 2 lone pairs: 6 electron pairs, octahedral arrangement. The two lone pairs sit opposite each other, leaving the four F atoms in a square.'
  - q: 'Which species is paramagnetic?'
    choices: ['N₂', 'O₂', 'F₂', 'CO']
    ans: 1
    why: 'O₂ has 16 electrons; the last two go one each into the two π*2p orbitals (Hund''s rule), giving 2 unpaired electrons. The others have all electrons paired.'
sources:
  - 'IUPAC Gold Book: bond order, dipole moment, hydrogen bond https://goldbook.iupac.org'
  - 'Gillespie R. J. and Nyholm R. S. (1957), Inorganic stereochemistry (VSEPR), Quarterly Reviews of the Chemical Society 11, 339'
  - 'Experimental bond angles and dipole moments: NIST Computational Chemistry Comparison and Benchmark Database https://cccbdb.nist.gov'
  - 'NEET (UG) and JEE Main / JEE Advanced 2026 syllabi: Chemical bonding and molecular structure'
---

**Chemistry · Class 11 · about 36 minutes.** By the end you will be able to draw a Lewis structure with formal charges, predict any shape and hybridisation, decide whether a molecule is polar, work out bond order and magnetism from molecular orbitals and explain boiling points with hydrogen bonds.

<div class="bigidea">Atoms bond because the bonded arrangement has lower energy. Electrons either move across (ionic bond) or are shared (covalent bond). Once bonded, electron pairs push each other as far apart as possible, and that push decides the shape.</div>

## 1. Lewis structures and formal charge

Atoms of the main groups tend to reach eight outer electrons (the **octet rule**). In a **Lewis structure**, each line is a shared pair, and dots are lone pairs. Steps: count all valence electrons (add one for each negative charge, take one away for each positive), join the atoms with single bonds, complete the outer atoms' octets, then put leftovers on the central atom and make multiple bonds if it is short.

The octet rule fails in three ways: **incomplete octets** (BeCl₂ has 4, BF₃ has 6), **odd electron molecules** (NO, NO₂) and **expanded octets** in period 3 and beyond (PCl₅ has 10, SF₆ has 12).

**Formal charge** = valence electrons − lone pair electrons − ½ (bonding electrons). The best structure has formal charges closest to zero, with any negative charge on the more electronegative atom. In O₃, the central O has +1 and one end O has −1.

## 2. The ionic bond and the Born-Haber cycle

An ionic bond forms when one atom gives electrons to another, then the ions attract. Low ionisation enthalpy of the metal, very negative electron gain enthalpy of the non-metal and a large **lattice enthalpy** all help. Lattice enthalpy is larger for **smaller and more highly charged ions** (MgO far above NaCl).

Lattice enthalpy cannot be measured directly, so we use a **Born-Haber cycle**: the enthalpy of formation equals the sum of sublimation, ionisation, atomisation, electron gain and the energy released when the gaseous ions form the solid (Hess's law).

<div class="problem" data-problem="cb-born-haber"></div>

**Fajans rules** tell when an ionic bond gains covalent character: the cation polarises (distorts) the anion's electron cloud more when the **cation is small and highly charged**, the **anion is large**, or the cation has a **pseudo noble gas (18 electron) shell** like Cu⁺ or Ag⁺. So LiI is more covalent than LiF, AlCl₃ more than NaCl, and CuCl more than NaCl.

## 3. Bond parameters, resonance and dipole moments

**Bond length** falls and **bond enthalpy** rises as **bond order** rises: C-C 154 pm, C=C 134 pm, C≡C 120 pm. When one Lewis structure is not enough, the real molecule is a **resonance hybrid** of several. In CO₃²⁻ every C-O bond is the same, with bond order 4/3 (4 bonds shared over 3 positions).

A bond between atoms of different electronegativity is **polar**. Its **dipole moment** μ = q × d, measured in debye (1 D = 3.336 × 10⁻³⁰ C m). For a molecule, add the bond dipoles as vectors, including the effect of lone pairs. NH₃ (1.47 D) is far more polar than NF₃ (0.24 D): in NH₃ the lone pair's dipole points the same way as the N-H bond dipoles; in NF₃ it opposes the N-F dipoles.

<div class="problem" data-problem="cb-ionic-character"></div>

## 4. VSEPR: shapes from electron pairs

Count the electron pairs (bonds as one each, whatever their order, plus lone pairs) round the central atom. The pairs spread out to minimise repulsion; the **shape** is named from the atoms only. Repulsion order: **lone pair-lone pair > lone pair-bond pair > bond pair-bond pair**, so lone pairs squeeze bond angles: CH₄ 109.5°, NH₃ 107°, H₂O 104.5°.

<figure class="fig" data-fig="vsepr-shapes"><figcaption>Choose the number of electron pairs and lone pairs. The sketch shows where the bonded atoms (X) and lone pairs sit round the central atom A; the readout gives the shape, angle, hybridisation and an example.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Steric number</dt><dd>bonded atoms + lone pairs on the central atom; it sets the electron arrangement</dd>
<dt>μ</dt><dd>dipole moment = charge × distance, in debye (D)</dd>
<dt>N<sub>b</sub>, N<sub>a</sub></dt><dd>electrons in bonding and antibonding molecular orbitals</dd>
<dt>Bond order</dt><dd>(N<sub>b</sub> − N<sub>a</sub>)/2: the number of net bonds between two atoms</dd>
<dt>Physical meaning</dt><dd>Steric number 2, 3, 4, 5, 6 gives sp, sp², sp³, sp³d, sp³d². Lone pairs are fatter than bonds because they are held by one nucleus only, so they need more room.</dd>
</dl>
</div>

## 5. Hybridisation, sigma and pi bonds

Mixing atomic orbitals of one atom gives equal **hybrid orbitals** pointing in the VSEPR directions. Hybrid orbitals overlap end on to make **σ bonds**. Unhybridised p orbitals overlap side by side to make **π bonds**. Every single bond is one σ; a double bond is σ + π; a triple bond σ + 2π. Ethene (sp²) is flat; ethyne (sp) is linear.

Example: in CH₂=CH-C≡N there are 6 σ bonds and 3 π bonds; the carbons are sp², sp², sp.

**Try it:** compare "Before mixing" and "After mixing" for sp, sp² and sp³, then add lone pairs to sp³ to see NH₃ and H₂O.

<figure class="fig" data-fig="@chem-hybrid-lobes"><figcaption>The hybrid lobes are all alike and point at the corners of a line, triangle or tetrahedron. The tiny back lobe is the opposite-sign part. Lone pairs sit in fatter lobes, which push the bond angle below 109.5°.</figcaption></figure>

## 6. Molecular orbital theory

In MO theory, atomic orbitals combine into **bonding** orbitals (lower energy, electron density between the nuclei) and **antibonding** orbitals (marked *, higher energy). Filling order for up to 14 electrons: σ1s, σ*1s, σ2s, σ*2s, **π2p (two orbitals), σ2p**, π*2p, σ*2p. From O₂ onwards (more than 14 electrons) σ2p drops below π2p, because the 2s-2p mixing that pushes it up becomes weak.

Bond order = (N<sub>b</sub> − N<sub>a</sub>)/2. **Unpaired electrons** make a species **paramagnetic** (drawn into a magnet). O₂: bond order 2, two unpaired electrons in π*2p, which Lewis structures cannot explain. B₂ is also paramagnetic (two unpaired in π2p). Removing an antibonding electron raises the bond order: O₂⁺ (2.5) > O₂ (2) > O₂⁻ (1.5) > O₂²⁻ (1).

<div class="problem" data-problem="cb-bond-order"></div>

<div class="myth">

**"Removing an electron always weakens a bond."** Only if it comes from a bonding orbital. N₂ → N₂⁺ loses a bonding electron (bond order 3 → 2.5), but O₂ → O₂⁺ loses an antibonding one, so O₂⁺ has the stronger, shorter bond.

</div>

**Try it:** step through H₂ to Ne₂. Read off the bond order and the number of unpaired electrons, then add or remove an electron with the charge buttons (O₂⁺, O₂⁻, N₂⁺).

<figure class="fig" data-fig="@chem-mo-diagram"><figcaption>Bond order peaks at N₂ (3) and falls to 0 at Be₂ and Ne₂. O₂ has two unpaired π* electrons, so it is paramagnetic; look for the σ2p and π2p levels swapping order after N₂.</figcaption></figure>

## 7. Hydrogen bonding and beyond

A **hydrogen bond** forms when H joined to a small, very electronegative atom (F, O or N) is attracted to a lone pair on another such atom. It is much weaker than a covalent bond (roughly 10 to 40 kJ/mol) but much stronger than other attractions between molecules. **Intermolecular** H-bonds raise boiling points (H₂O 373 K against H₂S 212 K) and make ice less dense than water. **Intramolecular** H-bonds, inside one molecule such as o-nitrophenol, lower the boiling point and the solubility in water compared with the para isomer, which bonds to its neighbours.

**For JEE Advanced:** in N(SiH₃)₃ the lone pair of N spreads into empty orbitals of Si (**back bonding**), so the molecule is planar and a weak base. Diborane B₂H₆ has two **three-centre, two-electron** B-H-B "banana" bonds, because boron has too few electrons for ordinary bonds.

<div class="myth">

**"A molecule with polar bonds must be polar."** CO₂, BF₃, CH₄, CCl₄, PCl₅ and SF₆ all have polar bonds but zero dipole moment, because their symmetric shapes make the bond dipoles cancel. Always draw the shape first.

</div>

<div class="keypoints">

- Formal charge = valence − lone pair electrons − ½ bonding electrons; prefer charges near zero.
- Lattice enthalpy grows with charge and shrinks with size; find it from a Born-Haber cycle.
- Fajans: small, highly charged cation and large anion give covalent character.
- Bond order up: shorter, stronger bond. Resonance spreads bond order (CO₃²⁻: 4/3).
- VSEPR: lp-lp > lp-bp > bp-bp; steric number 2 to 6 gives sp to sp³d².
- σ in every bond, π in each extra bond of a multiple bond.
- MO: π2p below σ2p up to N₂; bond order = (N<sub>b</sub> − N<sub>a</sub>)/2; O₂ and B₂ are paramagnetic.
- H-bonds need H on F, O or N; intramolecular H-bonds lower boiling points.

</div>
