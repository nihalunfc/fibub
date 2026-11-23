---
title: Chemical Bonding and Molecular Structure
seoTitle: 'Chemical Bonding Class 11 notes: VSEPR, hybridisation, MO'
summary: 'Class 11 Chemical Bonding with animations: ionic and covalent bonds, Lewis structures, VSEPR shapes, hybridisation, molecular orbital theory and hydrogen bonds.'
minutes: 100
updated: 2026-11-23
quiz:
  - q: 'The shape of the NH₃ molecule is trigonal pyramidal, not trigonal planar, because:'
    choices: ['the nitrogen atom has one lone pair that repels the three bond pairs', 'nitrogen uses sp² hybrid orbitals', 'the N–H bond is non-polar', 'NH₃ has four bond pairs']
    ans: 0
    why: 'N has 4 electron pairs (3 bond pairs + 1 lone pair), so the pairs point to the corners of a tetrahedron. Only the three atoms are named in the shape, so it is pyramidal. The lone pair pushes the H–N–H angle down to about 107°.'
  - q: 'Using molecular orbital theory, the bond order of O₂⁻ (13 valence electrons) is:'
    choices: ['1.5', '2', '2.5', '1']
    ans: 0
    why: 'Fill σ2s² σ*2s² σ2pz² π2p⁴ π*2p³: bonding = 8, antibonding = 5, so bond order = (8 − 5)/2 = 1.5.'
  - q: 'Which molecule has polar bonds but is a non-polar molecule?'
    choices: ['CO₂', 'H₂O', 'NH₃', 'CHCl₃']
    ans: 0
    why: 'Each C=O bond is polar, but CO₂ is linear, so the two equal dipoles point opposite ways and cancel. In H₂O, NH₃ and CHCl₃ the shape stops them cancelling.'
sources:
  - 'NCERT Class 11 Chemistry, Chapter 4 “Chemical Bonding and Molecular Structure” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Bond lengths and bond dissociation energies of H₂, HCl, N₂ and F₂: CRC Handbook of Chemistry and Physics, 97th edition, “Bond dissociation energies” and “Spectroscopic constants of diatomic molecules”'
  - 'Boiling points of the group 14 to 17 hydrides: CRC Handbook of Chemistry and Physics, 97th edition, “Physical constants of inorganic compounds”'
  - 'Dipole moments of H₂O, NH₃ and CHCl₃: CRC Handbook of Chemistry and Physics, 97th edition, “Dipole moments”'
  - 'Pauling, L. (1932), “The nature of the chemical bond. IV”, Journal of the American Chemical Society 54, 3570 (electronegativity and ionic character); Gillespie, R. J. and Nyholm, R. S. (1957), Quarterly Reviews 11, 339 (VSEPR)'
---

**Chemistry · Class 11 · Chapter 4 · about 100 minutes.** By the end you will be able to explain why atoms join, draw Lewis structures with formal charges, predict the shape of a molecule with VSEPR, name its hybridisation, fill a molecular orbital diagram and find the bond order, and say why water boils at 100 °C when H₂S boils at −60 °C.

<div class="bigidea">Atoms bond because the joined pair has <b>lower energy</b> than the two apart. The shape of the result comes from electrons repelling each other; the strength and magnetism come from how the orbitals overlap.</div>

## 1. Why do atoms bond? The octet idea

Only the noble gases (He, Ne, Ar ...) are happy alone. Their outer shell is full: 8 electrons (2 for helium). In 1916 Kössel and Lewis suggested that other atoms bond to reach the same full shell, by **giving**, **taking** or **sharing** electrons. This is the **octet rule**.

A **Lewis symbol** shows only the valence electrons as dots round the atom's letter. Chlorine has 7, so Cl has one unpaired dot and wants one more. Sodium has 1 dot and wants to lose it.

Think of two cricketers sharing a bat in the nets: neither owns it, both use it. That is a covalent bond. If one hands the bat over for good, that is an ionic bond.

## 2. The ionic bond

An ionic bond forms when a metal gives electrons to a non-metal: Na → Na⁺ + e⁻ and Cl + e⁻ → Cl⁻. The oppositely charged ions then attract each other and pack into a **crystal lattice**, each Na⁺ surrounded by six Cl⁻ and each Cl⁻ by six Na⁺. A molecule of NaCl does not exist in the solid; the whole crystal is one giant arrangement.

Making Na⁺ from Na costs energy (ionisation enthalpy) and making Cl⁻ gives back a little (electron gain enthalpy). The real payoff is the **lattice enthalpy**: the energy released when gaseous ions fall together into the lattice (or, read the other way, the energy needed to pull one mole of the solid into gaseous ions). Ionic bonds form easily when:

- the metal has a **low ionisation enthalpy**,
- the non-metal has a **high negative electron gain enthalpy**,
- the lattice enthalpy is **large**, which means small ions with large charges (MgO is far harder to melt than NaCl).

Properties: high melting and boiling points, hard but brittle, conduct electricity only when molten or dissolved (ions are free to move), usually soluble in water.

Try the electron hand-over yourself in the [ionic bond dots tool](/learn/ionic-bond-dots/).

## 3. The covalent bond and Lewis structures

When two non-metals meet, neither can pull an electron away from the other, so they **share** pairs. One shared pair is a single bond (H–H), two pairs a double bond (O=O), three a triple bond (N≡N).

**Drawing a Lewis structure** always works in the same order. Watch it for the carbonate ion:

<div class="steps" data-fig="c11c-bond-lewissteps">
<div class="step">Count the valence electrons of every atom, add one for each negative charge and remove one for each positive charge. CO₃²⁻: 4 + 18 + 2 = 24 electrons, which is 12 pairs.</div>
<div class="step">Put the least electronegative atom (not hydrogen) in the middle, join the others to it with single bonds. That uses 3 bonds = 6 electrons, so 18 are left.</div>
<div class="step">Give every outer atom a full octet with lone pairs. The three O atoms take all 18, but now carbon has only 6 electrons round it.</div>
<div class="step">Carbon is short, so one lone pair from an O atom is moved into the C–O bond, making it C=O. Now carbon has 8.</div>
<div class="step">Check the formal charges. C and the double-bonded O are 0; each single-bonded O is −1. They add to −2, the charge on the ion.</div>
</div>

**Formal charge** is the charge an atom would have if every bond were shared perfectly equally:

```math
\text{formal charge} = (\text{valence electrons}) - (\text{lone-pair electrons}) - \tfrac{1}{2}(\text{bonding electrons})
```

<div class="meaning">

<dl>
<dt>Valence electrons</dt><dd>electrons the free atom has in its outer shell (N = 5, O = 6)</dd>
<dt>Lone-pair electrons</dt><dd>dots that stay on this atom alone</dd>
<dt>Bonding electrons / 2</dt><dd>the number of bonds, because each shared pair gives the atom one electron</dd>
<dt>Physical meaning</dt><dd>It is a bookkeeping check. The best Lewis structure has formal charges as small as possible, and any negative charge sits on the more electronegative atom.</dd>
</dl>

</div>

<div class="problem" data-problem="c11c-bond-formalcharge"></div>

Build and test more structures, atom by atom, in the Lewis structure tool:

<!--fig:tool lewis-structures-->

**Exceptions to the octet rule** (all in the syllabus):

- **Fewer than 8:** BeCl₂ (4 electrons round Be) and BF₃ (6 round B). These "electron-deficient" molecules grab a lone pair eagerly, as BF₃ does from NH₃.
- **More than 8 (expanded octet):** PCl₅ has 10 and SF₆ has 12. This is possible for atoms of period 3 and beyond, which have empty d orbitals available.
- **Odd number of electrons:** NO has 11 and NO₂ has 17, so no structure can give every atom an octet.

<div class="myth">

**“Every atom in every molecule must have exactly eight electrons.”** The octet rule is a very useful guide for the second period (C, N, O, F) but it has the three exceptions above. Boron in BF₃ is perfectly stable with six.

</div>

## 4. Bond parameters

These numbers describe a bond.

- **Bond length:** the distance between the two nuclei when the energy is lowest. It is measured in pm (1 pm = 10⁻¹² m). Triple bonds are shorter than double, double shorter than single (C≡C 120 pm, C=C 134 pm, C–C 154 pm).
- **Bond enthalpy:** the energy needed to break one mole of that bond in gaseous molecules. A larger value means a stronger bond. Compare N≡N (945 kJ/mol) with F–F (159 kJ/mol).
- **Bond order:** the number of bonds between the two atoms (1, 2, 3, or fractions in resonance and MO theory). Higher order means shorter and stronger.
- **Bond angle:** the angle between two bonds at the same central atom, such as 104.5° in H₂O.

<figure class="fig" data-fig="c11c-bond-curve"><figcaption>Two atoms, one curve. Drag the distance from far apart to squeezed together and watch the energy fall to a minimum, then shoot up. The distance at the minimum is the bond length and the depth is the bond enthalpy. Compare H–H, H–Cl, N≡N and F–F.</figcaption></figure>

### Resonance

For some molecules one Lewis structure is not enough. In ozone, a single structure suggests one long O–O bond and one short O=O bond, but measurements show **two identical bonds**. We draw two structures and say the real molecule is the **resonance hybrid** of them.

<figure class="fig" data-fig="c11c-bond-resonance"><figcaption>The forms of CO₃²⁻ or O₃ in turn, then the real hybrid. The molecule never flips between forms: the forms are only pictures, and the truth is one steady structure with all bonds equal and the charge spread out.</figcaption></figure>

Resonance makes the molecule **more stable** than any single form would be (the extra stability is the resonance energy).

<div class="history">

**Beyond the syllabus.** Pauling's 1932 idea of electronegativity and Mulliken's alternative scale are used in the polarity figure below. The Fajans rules (how much a cation distorts an anion and makes a bond partly covalent) are no longer in the NCERT text, but they explain why AgCl is less soluble than NaCl.

</div>

## 5. Polarity of bonds and molecules

When two different atoms share electrons, the **more electronegative** one pulls the pair closer and gains a partial negative charge δ−; the other becomes δ+. This gives a **polar covalent bond**. Equal atoms (H–H, Cl–Cl) share equally, so the bond is non-polar.

The size of the effect is the **dipole moment**:

```math
\mu = q \times d
```

<div class="meaning">

<dl>
<dt>μ</dt><dd>dipole moment in debye (D); 1 D = 3.34 × 10⁻³⁰ C m</dd>
<dt>q</dt><dd>the partial charge on each end (a fraction of the electron charge)</dd>
<dt>d</dt><dd>the distance between the two charges, close to the bond length</dd>
<dt>Physical meaning</dt><dd>A bigger μ means the electrons are pulled further to one side. Dipole moment is a vector, drawn from + to − (chemists put a small cross on the + end).</dd>
</dl>

</div>

<figure class="fig" data-fig="c11c-bond-polar"><figcaption>First, "one bond": slide the electronegativities of A and B and watch the electron cloud lean and the percent ionic character grow. Then "whole molecule": add the bond dipoles as arrows. CO₂, BF₃ and CCl₄ have polar bonds but cancel to zero; H₂O, NH₃ and CHCl₃ do not.</figcaption></figure>

<div class="problem" data-problem="c11c-bond-ionic"></div>

A molecule is polar only if the bond dipoles **do not cancel**, which depends on the **shape**. That is why we study shape next. Water, with μ = 1.85 D, dissolves salt and sugar; CCl₄, with μ = 0, does not mix with water.

<div class="myth">

**“A molecule with polar bonds is always polar.”** CO₂ is the standard counter-example: two polar C=O bonds, linear shape, zero net dipole.

</div>

## 6. VSEPR theory: the shape of molecules

**VSEPR** stands for Valence Shell Electron Pair Repulsion. The idea is simple: electron pairs (bond pairs and lone pairs) are all negative, so around one central atom they spread out as far as possible. Count the pairs, and the geometry follows.

1. Count the **electron pairs** round the central atom (the **steric number**): bond pairs (a double bond counts as one pair-direction) + lone pairs.
2. Arrange them in the best spread-out shape: 2 linear, 3 trigonal planar, 4 tetrahedral, 5 trigonal bipyramidal, 6 octahedral.
3. Name the **shape** by the atoms only. A lone pair is invisible in the shape name but still takes space.

Lone pairs repel more than bond pairs, which gives the order **lp–lp > lp–bp > bp–bp**. That is why the angle falls from 109.5° in CH₄ to 107° in NH₃ and 104.5° in H₂O.

<figure class="fig" data-fig="c11c-bond-vsepr"><figcaption>Slide the number of electron pairs from 2 to 6, then the number that are lone pairs, and watch the shape change and turn. Lone pairs (orange) go to the roomiest places: the equator of a bipyramid and opposite sides of an octahedron.</figcaption></figure>

<div class="problem" data-problem="c11c-bond-steric"></div>

Explore every standard shape and compare with real molecules in the VSEPR tool:

<!--fig:tool vsepr-shapes-->

| Pairs | Lone pairs | Shape | Example |
|---|---|---|---|
| 2 | 0 | linear | BeCl₂, CO₂ |
| 3 | 0 | trigonal planar | BF₃ |
| 3 | 1 | bent | SO₂ |
| 4 | 0 / 1 / 2 | tetrahedral / pyramidal / bent | CH₄ / NH₃ / H₂O |
| 5 | 0 / 1 / 2 / 3 | trigonal bipyramidal / see-saw / T-shaped / linear | PCl₅ / SF₄ / ClF₃ / XeF₂ |
| 6 | 0 / 1 / 2 | octahedral / square pyramidal / square planar | SF₆ / BrF₅ / XeF₄ |

<div class="myth">

**“NH₃ is tetrahedral.”** Its four electron pairs are arranged tetrahedrally, but the **shape** counts only the three atoms: it is trigonal pyramidal. The same goes for bent H₂O.

</div>

## 7. Valence bond theory and hybridisation

**Valence bond theory** says a covalent bond forms when half-filled orbitals of two atoms **overlap**, and the electrons pair up in the overlap region. More overlap means a stronger bond.

- A **sigma (σ) bond** forms by head-on overlap along the line joining the nuclei (s–s, s–p, p–p head on). It is strong and allows rotation.
- A **pi (π) bond** forms by sideways overlap of two parallel p orbitals above and below the axis. It is weaker and locks the molecule against rotation. A double bond is 1σ + 1π and a triple bond is 1σ + 2π.

A carbon atom has the configuration 2s² 2p², which suggests two bonds at 90°. In fact methane has four equal C–H bonds at 109.5°. **Hybridisation** explains it: one s orbital and some p orbitals of the same atom **mix** to form the same number of equal **hybrid orbitals** with a new shape, a big lobe pointing outwards for strong overlap.

<figure class="fig" data-fig="c11c-bond-hybrid"><figcaption>Choose how many p orbitals mix with the s orbital, then slide "mixing". The levels move to one average energy and the new equal hybrids appear. The p orbitals left over are the ones that make π bonds.</figcaption></figure>

<figure class="fig" data-fig="@chem-hybrid-lobes"><figcaption>The hybrid lobes in 3D: drag to turn them, and compare sp, sp² and sp³ before and after mixing, including the lone pairs of NH₃ and H₂O.</figcaption></figure>

| Hybridisation | Orbitals mixed | Shape | Angle | Examples |
|---|---|---|---|---|
| sp | 1 s + 1 p | linear | 180° | BeCl₂, C₂H₂ |
| sp² | 1 s + 2 p | trigonal planar | 120° | BF₃, C₂H₄ |
| sp³ | 1 s + 3 p | tetrahedral | 109.5° | CH₄, NH₃, H₂O |
| sp³d | 1 s + 3 p + 1 d | trigonal bipyramidal | 90°, 120° | PCl₅ |
| sp³d² | 1 s + 3 p + 2 d | octahedral | 90° | SF₆ |

Ethene shows it all: each C is sp² (three σ bonds in a plane, 120° apart) and its left-over p orbitals overlap sideways to make one π bond. Ethyne: each C is sp (two σ bonds along a line) with two left-over p orbitals giving two π bonds.

The **number of hybrid orbitals equals the steric number** from VSEPR: that is why the two ideas fit together. NH₃ has 4 pairs, so sp³; in NH₃ one of the four sp³ orbitals holds the lone pair.

## 8. Molecular orbital theory

Valence bond theory cannot explain why O₂ is attracted by a magnet. **Molecular orbital (MO) theory** treats the whole molecule at once. The atomic orbitals combine as waves (LCAO, linear combination of atomic orbitals):

- **Adding** the waves gives a **bonding MO** (σ or π): electron density piles up between the nuclei, energy goes **down**.
- **Subtracting** gives an **antibonding MO** (σ* or π*): a node between the nuclei, energy goes **up**.

The rules for filling are the same as for atoms: lowest energy first (Aufbau), a maximum of 2 electrons per orbital with opposite spins (Pauli), one in each of the equal orbitals before pairing (Hund). For the second period the order is:

- **Up to N₂** (B₂, C₂, N₂): σ2s < σ*2s < π2p = π2p < σ2pz < π*2p = π*2p < σ*2pz
- **O₂, F₂**: σ2s < σ*2s < σ2pz < π2p = π2p < π*2p = π*2p < σ*2pz

```math
\text{bond order} = \tfrac{1}{2}\,(N_b - N_a)
```

<div class="meaning">

<dl>
<dt>N_b</dt><dd>number of electrons in bonding MOs</dd>
<dt>N_a</dt><dd>number of electrons in antibonding MOs</dd>
<dt>Physical meaning</dt><dd>Each bond is a pair in a bonding orbital that is not undone by a pair in an antibonding one. Order 0 means no bond (He₂, Ne₂); a larger order means a shorter and stronger bond.</dd>
</dl>

</div>

Fill the 12 valence electrons of O₂ yourself, step by step:

<div class="steps" data-fig="c11c-bond-mosteps">
<div class="step">Set out the ladder. Each oxygen brings a 2s and three 2p atomic orbitals; they combine into 8 molecular orbitals (4 bonding, 4 antibonding).</div>
<div class="step">The first 4 electrons go into σ2s and σ*2s. One bonding pair and one antibonding pair cancel, so they add no bond.</div>
<div class="step">Next 6 electrons: σ2pz (2) and the two π2p orbitals (2 each). That makes 8 electrons in bonding levels in total.</div>
<div class="step">Two electrons are left for the two equal π*2p orbitals. Hund's rule puts one in each, with parallel spins, not a pair in one.</div>
<div class="step">Bond order = (8 − 4)/2 = 2. The two unpaired electrons make O₂ <b>paramagnetic</b>, which a single Lewis structure cannot show. Liquid oxygen really does stick to a strong magnet.</div>
</div>

<div class="problem" data-problem="c11c-bond-moorder"></div>

Fill any diatomic from H₂ to Ne₂ and read off its bond order and magnetism:

<!--fig:tool mo-diagram-->

What the MO picture tells you: N₂ (order 3) is very stable and unreactive; O₂ (order 2) has two unpaired electrons; O₂⁺ (order 2.5) has a shorter, stronger bond than O₂; He₂ (order 0) does not exist. A species with **no unpaired electrons is diamagnetic** (slightly repelled by a magnet).

## 9. Hydrogen bonding

When hydrogen is bonded to a very small, very electronegative atom (**F, O or N**), the H is strongly δ+ and is attracted to a lone pair on a neighbouring molecule. This pull is the **hydrogen bond**, written X–H···Y. It is much weaker than a covalent bond (about 10 to 40 kJ/mol) but much stronger than the ordinary attractions between molecules.

- **Intermolecular** H bonds join separate molecules (water, HF, alcohols). They raise melting and boiling points and viscosity.
- **Intramolecular** H bonds are inside one molecule (o-nitrophenol). They keep it from joining to others, so it is more volatile than the para form.

<figure class="fig" data-fig="c11c-bond-hydrides"><figcaption>Boiling points of the hydrides of groups 14 to 17. Group 14 climbs smoothly with size. NH₃, H₂O and HF are far above the trend because of hydrogen bonds. Without them, water would boil near −80 °C and life on Earth would look very different.</figcaption></figure>

Ice floats because hydrogen bonds hold the molecules in an open, hexagonal cage that is less dense than liquid water. Study it in the [hydrogen bonding tool](/learn/hydrogen-bonding/), see the molecules in 3D in the [molecule viewer](/science/molecule-viewer/), and compare the polarity of molecules in the [dipole polarity tool](/learn/dipole-polarity/).

<div class="keypoints">

- Octet rule: atoms give, take or share electrons to get 8 in the outer shell. Exceptions: BeCl₂, BF₃ (fewer), PCl₅, SF₆ (more), NO, NO₂ (odd).
- Ionic bonds favour low ionisation enthalpy, high electron gain enthalpy and high lattice enthalpy. Ionic solids have high melting points and conduct only when molten or dissolved.
- Lewis structure: count electrons, join atoms, complete octets, form multiple bonds if needed. Formal charge = V − L − bonds.
- Bond length falls and bond enthalpy rises as bond order rises (single < double < triple). Resonance gives equal bonds and extra stability.
- Polar bond: electronegativity difference gives δ+ and δ−. μ = q × d. A molecule is non-polar if the dipoles cancel (CO₂, BF₃, CCl₄).
- VSEPR: count electron pairs, spread them out; order lp–lp > lp–bp > bp–bp. NH₃ pyramidal 107°, H₂O bent 104.5°.
- Hybridisation: sp (180°), sp² (120°), sp³ (109.5°), sp³d, sp³d². Number of hybrid orbitals = number of electron pairs. σ is head-on, π is sideways.
- MO theory: bonding MOs lower energy, antibonding raise it. Bond order = (N_b − N_a)/2. O₂ is paramagnetic with bond order 2; N₂ has bond order 3.
- Hydrogen bonds (F, O, N) raise boiling points: H₂O, HF and NH₃ are unusually high. Ice is less dense than water.

</div>

Going further for JEE/NEET: the exam-level problems on bond angles, MO diagrams with ions and comparing bond lengths are in [Chemical bonding (JEE)](/learn/courses/engineering-entrance/chemical-bonding/), with extra practice in [Chemical bonding questions](/learn/courses/engineering-entrance/chemical-bonding-questions/); NEET asks the same chemistry.
