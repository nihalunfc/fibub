---
title: 'Solid state and surface chemistry'
seoTitle: 'Solid state and surface chemistry: JEE chemistry'
summary: 'Crystalline and amorphous solids, unit cells, counting atoms, close packing, voids, packing efficiency, density from the unit cell, radius ratio, defects, electrical and magnetic properties, then adsorption isotherms, catalysis, colloids, coagulation and emulsions, for KEAM, CUSAT, COMEDK and JEE.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'In a ccp lattice of N atoms, how many octahedral and tetrahedral voids are there?'
    choices: ['N and N', 'N and 2N', '2N and N', '2N and 2N']
    ans: 1
    why: 'Any close-packed arrangement of N spheres has N octahedral and 2N tetrahedral voids. In one fcc cell (4 atoms): 4 octahedral, 8 tetrahedral.'
  - q: 'A Schottky defect in NaCl:'
    choices: ['raises its density', 'lowers its density', 'leaves density unchanged', 'makes it coloured']
    ans: 1
    why: 'Equal numbers of cations and anions are missing from the lattice, so the mass falls while the volume stays the same. Frenkel defects (an ion moved into a void) do not change density.'
  - q: 'Which is most effective at coagulating a negatively charged arsenic sulphide sol?'
    choices: ['NaCl', 'BaCl₂', 'AlCl₃', 'Na₃PO₄']
    ans: 2
    why: 'Hardy-Schulze rule: the ion of opposite charge does the work, and higher charge is far more effective. Al³⁺ beats Ba²⁺ beats Na⁺. Phosphate is negative, the same as the sol.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi; KEAM, CUSAT CAT and COMEDK chemistry syllabi (solid state and surface chemistry are not in the current NEET syllabus)'
  - 'IUPAC Gold Book: unit cell, coordination number, adsorption isotherm, colloid https://goldbook.iupac.org'
  - 'Lattice constants (Cu 361 pm, Na 429 pm, Fe 287 pm) from CRC Handbook of Chemistry and Physics, 97th edition'
---

**Chemistry · Class 12 · about 36 minutes.** By the end you will be able to count atoms in any cubic cell, link edge length to radius and density, place ions in voids, recognise defects, and explain adsorption, catalysis and colloids. This chapter is for KEAM, CUSAT, COMEDK and JEE; it was moved out of the NEET syllabus.

<div class="bigidea">A crystal is one small box of atoms, the unit cell, repeated in every direction. Know what is in one box and how big it is, and you know the density, the formula and how tightly the atoms pack. Surfaces are different: atoms there have unused bonds, so they grab molecules from outside. That one idea explains adsorption, catalysts and colloids.</div>

## Part A: the solid state

## 1. Crystalline and amorphous

**Crystalline** solids (NaCl, quartz, metals) have long-range order, a sharp melting point, and are **anisotropic** (properties differ with direction). **Amorphous** solids (glass, rubber, plastics) have only short-range order, soften over a range of temperatures, and are **isotropic**; glass is sometimes called a supercooled liquid.

| Type | Particles and forces | Examples | Properties |
|---|---|---|---|
| Molecular | molecules; London, dipole or H-bonds | I₂, ice, dry ice | soft, low melting, insulators |
| Ionic | ions; electrostatic | NaCl, MgO | hard, brittle, conduct only when molten or dissolved |
| Metallic | cations in a sea of electrons | Cu, Fe | malleable, conduct electricity |
| Covalent network | atoms; covalent bonds throughout | diamond, SiO₂, SiC | very hard, very high melting (graphite conducts) |

## 2. Unit cells and counting atoms

A corner atom is shared by 8 cells (counts 1/8), a face atom by 2 (1/2), an edge atom by 4 (1/4), a body atom belongs wholly to its cell (1).

<figure class="fig" data-fig="solid-unit-cell"><figcaption>Switch between simple, body-centred and face-centred cubic cells. The tally gives Z, the dashed line shows where atoms touch, and the sliders give the radius and density.</figcaption></figure>

| Cell | Z | Atoms touch along | Radius | Coordination number | Packing efficiency |
|---|---|---|---|---|---|
| Simple cubic | 1 | edge | a/2 | 6 | 52.4% |
| Body-centred (bcc) | 2 | body diagonal | √3a/4 | 8 | 68% |
| Face-centred (fcc = ccp) | 4 | face diagonal | a/(2√2) | 12 | 74% |

**Density** from one cell: the mass of Z atoms divided by the volume a³.

```math
d = \frac{Z\,M}{N_A\,a^3}
```

<div class="meaning">
<dl>
<dt>Z</dt><dd>number of atoms (or formula units) per unit cell</dd>
<dt>M</dt><dd>molar mass, g/mol</dd>
<dt>a</dt><dd>edge length; put it in cm (1 pm = 10⁻¹⁰ cm) to get g/cm³</dd>
<dt>r</dt><dd>atomic radius; r₊ and r₋ for cation and anion</dd>
<dt>x/m</dt><dd>mass of gas adsorbed per gram of adsorbent</dd>
<dt>Physical meaning</dt><dd>Density is just "how much mass fits in one box". The box's size and contents give it exactly.</dd>
</dl>
</div>

<div class="problem" data-problem="ss-density"></div>

<div class="problem" data-problem="ss-radius"></div>

## 3. Close packing and voids

Stack layers of touching spheres. The third layer can sit over the first (**ABAB**, hexagonal close packing, hcp: Mg, Zn) or over the gaps not used (**ABCABC**, cubic close packing = fcc: Cu, Al). Both fill 74% of space and give each sphere 12 neighbours.

The gaps are **voids**. A **tetrahedral** void is surrounded by 4 spheres, an **octahedral** void by 6. For N spheres there are **N octahedral and 2N tetrahedral** voids. In an fcc cell, octahedral voids sit at the body centre and the 12 edge centres (4 in all); the 8 tetrahedral voids lie inside, one near each corner.

**Formula from voids.** If oxide ions form ccp and a metal fills 2/3 of the octahedral voids: O = N, M = 2N/3, so the formula is M₂O₃.

**Ionic structures and radius ratio r₊/r₋:**

| r₊/r₋ | Void | Coordination | Example |
|---|---|---|---|
| 0.225 to 0.414 | tetrahedral | 4 | ZnS (zinc blende) |
| 0.414 to 0.732 | octahedral | 6 | NaCl (rock salt) |
| 0.732 and above | cubic | 8 | CsCl |

In NaCl, Cl⁻ forms fcc and Na⁺ fills all octahedral voids: 4 NaCl per cell, and a = 2(r₊ + r₋). In CsCl the ions touch along the body diagonal: √3a = 2(r₊ + r₋).

<div class="myth">

**"CsCl is body-centred cubic."** Its picture looks like it, but the body-centre ion (Cs⁺) is different from the corner ions (Cl⁻). Each set forms a **simple cubic** lattice, interpenetrating. True bcc needs the same atom at the corners and the centre.

</div>

**Try it:** switch between octahedral and tetrahedral voids, shrink the atoms to see the gaps, and drag the cell around.

<figure class="fig" data-fig="@chem-fcc-voids"><figcaption>Count them: 4 atoms, 4 octahedral voids, 8 tetrahedral voids in each fcc cell (voids = N and 2N). Each octahedral void touches six atoms and each tetrahedral one touches four.</figcaption></figure>

## 4. Defects and properties

- **Schottky:** equal numbers of cations and anions missing. Density falls. Ions of similar size: NaCl, KCl, CsCl, AgBr.
- **Frenkel:** a cation leaves its site for a void nearby. Density unchanged. Small cation, big anion: ZnS, AgCl, AgBr (AgBr shows both).
- **Metal excess (F-centres):** heating NaCl in sodium vapour leaves electrons trapped at anion vacancies; they absorb light and make the crystal yellow (KCl turns violet). ZnO turns yellow on heating as it loses oxygen.
- **Metal deficiency:** FeO is really about Fe₀.₉₅O: some Fe³⁺ makes up for missing Fe²⁺.
- **Doping:** adding As to Si gives an **n-type** semiconductor (extra electrons); adding B gives **p-type** (holes).
- **Magnetism:** paramagnetic (unpaired electrons, weakly attracted: O₂, Cu²⁺), diamagnetic (all paired, weakly repelled: NaCl, H₂O), **ferromagnetic** (domains line up permanently: Fe, Co, Ni, CrO₂), **antiferromagnetic** (moments cancel: MnO), **ferrimagnetic** (unequal opposite moments: Fe₃O₄).

## Part B: surface chemistry

## 5. Adsorption

**Adsorption** is molecules sticking to a surface (adsorbate on an adsorbent); **absorption** is soaking into the bulk. Adsorption is always **exothermic** and lowers entropy.

| | Physisorption | Chemisorption |
|---|---|---|
| Forces | van der Waals | chemical bonds |
| Enthalpy | low, 20 to 40 kJ/mol | high, 80 to 240 kJ/mol |
| Specific? | no | yes |
| Layers | many | one |
| With temperature | falls as T rises | first rises (needs activation), then falls |
| Reversible? | yes | usually not |

**Freundlich isotherm:** `$\dfrac{x}{m} = kP^{1/n}$` with n > 1, so `$\log\dfrac{x}{m} = \log k + \dfrac{1}{n}\log P$` is a straight line of slope 1/n. It fails at high pressure, where the surface fills up. The **Langmuir isotherm** (one layer) explains the levelling off: x/m = aP/(1 + bP).

<div class="problem" data-problem="ss-freundlich"></div>

**Catalysis.** **Homogeneous**: catalyst in the same phase (NO in the lead-chamber process). **Heterogeneous**: usually a solid surface (Fe in the Haber process, Pt in car converters, V₂O₅ in the contact process); reactants adsorb, react and leave. **Promoters** boost a catalyst (Mo for Fe); **poisons** block it (CO or S on Fe). **Zeolites** are shape-selective catalysts (ZSM-5 turns methanol into petrol). **Enzymes** are highly specific and work best near 37 °C and a particular pH.

## 6. Colloids

Particles of 1 to 1000 nm spread through a medium. Classified by phase (sol: solid in liquid; gel: liquid in solid; emulsion: liquid in liquid; foam: gas in liquid; aerosol: solid or liquid in gas), and by affinity: **lyophilic** (starch, gum, gelatin: stable, reversible) and **lyophobic** (gold, As₂S₃, Fe(OH)₃ sols: need stabilising, easily coagulated). **Micelles** form when soap molecules cluster above the critical micelle concentration (CMC) and Kraft temperature.

- **Tyndall effect:** colloidal particles scatter light (a visible beam). **Brownian motion:** random zig-zag from molecular hits, keeps the sol from settling.
- **Charge:** Fe(OH)₃ sol is positive; As₂S₃, gold and starch sols are negative. **Electrophoresis** moves particles in an electric field.
- **Hardy-Schulze rule:** the ion with charge opposite to the sol coagulates it, and its power rises steeply with charge (for a negative sol, Al³⁺ > Ba²⁺ > Na⁺). The **flocculation value** is the minimum concentration needed; smaller value, stronger coagulant.
- **Protective colloids:** a lyophilic colloid shields a lyophobic one. The **gold number** is the mg of protective colloid that stops 10 mL of gold sol coagulating with 1 mL of 10% NaCl; smaller gold number, better protector (gelatin is very good).
- **Emulsions:** oil in water (milk) or water in oil (butter), stabilised by emulsifiers like soap or proteins.

<div class="myth">

**"Physisorption always increases with temperature, like reaction rates."** Adsorption releases heat, so by Le Chatelier's principle, physisorption **falls** as temperature rises. Only chemisorption first rises (it needs activation energy) before falling.

</div>

<div class="keypoints">

- Z: sc 1, bcc 2, fcc 4. Coordination: 6, 8, 12. Packing: 52.4%, 68%, 74%.
- r = a/2 (sc), √3a/4 (bcc), a/(2√2) (fcc); d = ZM/(N_A a³) with a in cm.
- N close-packed spheres: N octahedral and 2N tetrahedral voids.
- Radius ratio: 0.225 to 0.414 tetrahedral, 0.414 to 0.732 octahedral, above 0.732 cubic.
- Schottky lowers density; Frenkel does not; F-centres give colour.
- Freundlich: log(x/m) = log k + (1/n) log P; adsorption is exothermic.
- Hardy-Schulze: higher charge of the opposite ion, stronger coagulation; smaller gold number, better protection.

</div>
