---
title: "A new mineral's density, rebuilt from its cell and site occupancies"
summary: "Plumbogottlobite, described in 2026, is reported with a calculated density of 5.359 g/cm³. We rebuild that number from its published cell and formula with fibub's CIF viewer, and show which measurement it really depends on."
tools: [cif-viewer, mineral-formula, miller-index-calculator, molar-mass-calculator]
updated: 2026-11-24
sources:
  - "Kampf, A. R., Désor, J. and Ma, C. (2026), Plumbogottlobite, PbMg(VO4)(OH), the Pb analogue of gottlobite and the Mg analogue of descloizite, European Journal of Mineralogy 38(2): 209-216, doi:10.5194/ejm-38-209-2026. Licence CC BY 4.0, checked on the article page (ejm.copernicus.org) and in the Crossref record, 2026-11-24. Values used here: space group Pnma; single-crystal cell a = 7.6104(7), b = 6.1091(6), c = 9.3968(8) Å, V = 436.88(7) Å³, Z = 4; powder cell a = 7.599(12), b = 6.118(10), c = 9.394(15) Å, V = 436.7(10) Å³; calculated density 5.359 g/cm³; empirical formula (Pb0.89□0.11)(Mg0.77Cu0.19Mn0.09)(VO4)(OH) with 0.12 extra H for charge balance; refined occupancies Pb 0.941(12) and Mg0.700(17)Cu0.300(17); Pb-O distances 2.37-2.47 Å (three) and 2.73-3.23 Å (six). The paper's coordinate, bond and powder-line tables are published as images and were not used."
  - "Atomic weights: fibub's own element table (src/lib/sci/chem.ts), as used by the CIF viewer."
paper:
  title: "Plumbogottlobite, PbMg(VO4)(OH), the Pb analogue of gottlobite and the Mg analogue of descloizite"
  authors: "Kampf AR, Désor J, Ma C"
  journal: "European Journal of Mineralogy"
  year: 2026
  doi: "10.5194/ejm-38-209-2026"
  url: "https://ejm.copernicus.org/articles/38/209/2026/"
  licence: "CC BY 4.0"
  reviewed: true
---

Every new mineral description ends with a line like "calculated density 5.359 g cm⁻³". It is not measured: it comes from the unit cell, the chemical formula and the number of formula units in the cell, and it is the one number in the description that ties the chemistry and the crystallography together. A 2026 paper in the *European Journal of Mineralogy* describes **plumbogottlobite**, PbMg(VO₄)(OH), a new member of the descloizite group from a mine in Thuringia, Germany. This article rebuilds its calculated density from the published cell and formula with the [[cif-viewer]], and shows that the number is almost entirely a statement about lead vacancies. For the steps either side, work the analysis into atoms per formula unit with the [[mineral-formula]] calculator and turn the cell into diffraction lines with the [[xrd-peak-calculator]].

## The paper in brief

The authors found plumbogottlobite at the Glücksstern mine, Friedrichroda, and had it approved as a new species (IMA 2025-075). It is orthorhombic, space group **Pnma**, with a cell of a = 7.6104(7), b = 6.1091(6), c = 9.3968(8) Å, a volume of 436.88(7) Å³ and Z = 4 formula units in the cell. Chemically it is the lead analogue of gottlobite, CaMg(VO₄)(OH), and the magnesium analogue of descloizite, PbZn(VO₄)(OH).

The electron-microprobe analysis does not come out as the clean ideal formula. Normalised to five oxygen atoms per formula unit, the abstract gives **(Pb₀.₈₉□₀.₁₁)(Mg₀.₇₇Cu₀.₁₉Mn₀.₀₉)(VO₄)(OH)**, where □ is a vacancy, with 0.12 extra hydrogen for charge balance: the lead site is about a ninth empty, and roughly a fifth of the magnesium site is copper. The structure refinement, which sees electrons rather than elements, puts 0.941(12) atoms on the lead site and Mg₀.₇₀₀Cu₀.₃₀₀ on the M site. The reported calculated density is **5.359 g cm⁻³**.

A small, honest wrinkle: the formula printed in the abstract and the one in the paper's chemistry section allot manganese to different sites (the second puts Mn₀.₀₅ on the lead site), so they look different. In bulk composition they are the same, which is why, as we show below, they give exactly the same density.

## Checked with the tools

The CIF viewer reads a Crystallographic Information File, applies the space group's symmetry operations, counts what is really in the cell, and reports the cell volume, the formula, Z and the density. The paper publishes no CIF in its text, so we **wrote one** from the numbers above: the cell, the eight general-position operations of Pnma, and one site per element with the paper's occupancies, each placed on a Wyckoff position of the right multiplicity (4c at x, ¼, z and 4a at 0, 0, 0). The coordinates themselves are **our placeholders**, because the paper's coordinate table is an image. That is fine for this job and for no other: a density depends only on the cell volume and on what is inside the cell, never on where inside it the atoms sit. Bond lengths from such a file would be meaningless, so we do not report any.

**What the tool gives.** Fed that file, the viewer's *Structure* card reads V = 436.883 Å³, Z = 4 × Pb₀.₈₉Mg₀.₇₇Cu₀.₁₉Mn₀.₀₉VO₅H₁.₁₂, a cell content of 1408.828 g/mol and a density of **5.355 g cm⁻³**: 0.08 % below the published 5.359. With the ideal formula PbMg(VO₄)(OH) instead, the same cell gives **5.526 g cm⁻³**, 3.1 % too high. So the published density is not the ideal-formula density; it carries the measured vacancies and substitutions, and reproducing it is a real check that the chemistry and the cell in a description belong together.

| Check | Paper | CIF viewer's maths |
|---|---|---|
| Cell volume from a, b, c (Pnma) | 436.88(7) Å³ | 436.883 Å³ |
| Formula units in the cell | Z = 4 | Z = 4, from the cell contents and the formula sum |
| Density, empirical formula | 5.359 g cm⁻³ | 5.355 g cm⁻³ |
| Density, ideal PbMg(VO₄)(OH) | not given | 5.526 g cm⁻³ (+3.1 %) |
| Density, refinement occupancies (Pb 0.941, Mg₀.₇Cu₀.₃) | not given | 5.519 g cm⁻³ |
| Density with the powder cell (436.7 Å³) | not given | 5.357 g cm⁻³ (+0.03 %) |

**Which measurement the density really tests.** Lead is 207.2 g/mol out of a 352 g/mol formula unit, so the lead site does nearly all the work. Figure 1 runs the whole calculation again for lead-site occupancies from 0.80 to 1.00. The slope is **3.15 g cm⁻³ per unit of occupancy**, so 0.01 of lead occupancy is worth 0.032 g cm⁻³, about 0.6 %. Reading the curve backwards, the occupancy that reproduces 5.359 g cm⁻³ exactly is **0.891**, within rounding of the analysed 0.89 and clearly not the refined 0.941. A published calculated density is, in effect, a statement about the heavy-atom site.

<!-- fig:density -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="Density worked out by the CIF viewer for the published cell as the Pb-site occupancy changes from 0.80 to 1.00, for three fillings of the M site. The published value of 5.359 g per cubic centimetre is met at a Pb occupancy of about 0.891." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Calculated density against Pb-site occupancy</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Calculated density against Pb-site occupancy</text><line x1="58" x2="546" y1="231.7" y2="231.7" style="stroke:var(--line)"/><text x="52" y="235.7" text-anchor="end" style="fill:var(--muted)">5.2</text><line x1="58" x2="546" y1="171.1" y2="171.1" style="stroke:var(--line)"/><text x="52" y="175.1" text-anchor="end" style="fill:var(--muted)">5.4</text><line x1="58" x2="546" y1="110.6" y2="110.6" style="stroke:var(--line)"/><text x="52" y="114.6" text-anchor="end" style="fill:var(--muted)">5.6</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">5.8</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="180" x2="180" y1="262" y2="266" style="stroke:var(--muted)"/><text x="180" y="279" text-anchor="middle" style="fill:var(--muted)">0.85</text><line x1="302" x2="302" y1="262" y2="266" style="stroke:var(--muted)"/><text x="302" y="279" text-anchor="middle" style="fill:var(--muted)">0.9</text><line x1="424" x2="424" y1="262" y2="266" style="stroke:var(--muted)"/><text x="424" y="279" text-anchor="middle" style="fill:var(--muted)">0.95</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Occupancy of the Pb site (atoms per site)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Density (g cm⁻³)</text><line x1="58" x2="546" y1="183.6" y2="183.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="178.6" text-anchor="end" style="fill:var(--muted)">paper: 5.359 g cm⁻³</text><line x1="277.6" x2="277.6" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="281.6" y="62" text-anchor="start" style="fill:var(--muted)">0.89</text><path d="M58 270.7L70.2 265.9L82.4 261.2L94.6 256.4L106.8 251.6L119 246.9L131.2 242.1L143.4 237.3L155.6 232.5L167.8 227.8L180 223L192.2 218.2L204.4 213.5L216.6 208.7L228.8 203.9L241 199.2L253.2 194.4L265.4 189.6L277.6 184.8L289.8 180.1L302 175.3L314.2 170.5L326.4 165.8L338.6 161L350.8 156.2L363 151.5L375.2 146.7L387.4 141.9L399.6 137.1L411.8 132.4L424 127.6L436.2 122.8L448.4 118.1L460.6 113.3L472.8 108.5L485 103.7L497.2 99L509.4 94.2L521.6 89.4L533.8 84.6L546 79.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 323.3L70.2 318.5L82.4 313.8L94.6 309L106.8 304.2L119 299.5L131.2 294.7L143.4 289.9L155.6 285.2L167.8 280.4L180 275.6L192.2 270.8L204.4 266.1L216.6 261.3L228.8 256.5L241 251.8L253.2 247L265.4 242.2L277.6 237.5L289.8 232.7L302 227.9L314.2 223.1L326.4 218.4L338.6 213.6L350.8 208.8L363 204.1L375.2 199.3L387.4 194.5L399.6 189.7L411.8 185L424 180.2L436.2 175.4L448.4 170.7L460.6 165.9L472.8 161.1L485 156.4L497.2 151.6L509.4 146.8L521.6 142L533.8 137.3L546 132.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 269.1L70.2 264.3L82.4 259.6L94.6 254.8L106.8 250L119 245.3L131.2 240.5L143.4 235.7L155.6 231L167.8 226.2L180 221.4L192.2 216.6L204.4 211.9L216.6 207.1L228.8 202.3L241 197.6L253.2 192.8L265.4 188L277.6 183.3L289.8 178.5L302 173.7L314.2 168.9L326.4 164.2L338.6 159.4L350.8 154.6L363 149.9L375.2 145.1L387.4 140.3L399.6 135.6L411.8 130.8L424 126L436.2 121.2L448.4 116.5L460.6 111.7L472.8 106.9L485 102.2L497.2 97.4L509.4 92.6L521.6 87.9L533.8 83.1L546 78.3" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">M = Mg0.77Cu0.19Mn0.09 (paper)</text><line x1="300" x2="312" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="316" y="40" style="fill:var(--muted)">M = Mg (ideal)</text><line x1="426.8" x2="438.8" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="442.8" y="40" style="fill:var(--muted)">M = Mg0.70Cu0.30 (refined)</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Density worked out by the CIF viewer's maths from the published cell (436.88 Å³, Z = 4) as the lead-site occupancy changes, for three fillings of the magnesium site. The dashed line is the paper's calculated density of 5.359 g cm⁻³; the paper's own occupancy of 0.89 is marked.</figcaption></figure>
<!-- /fig:density -->

**What hardly matters.** Figure 2 holds the lead site at 0.89 and swaps magnesium for copper or manganese on the M site. Replacing half the site changes the density by 0.30 g cm⁻³ at most (5.6 %), and the paper's own copper content of 0.19 moves it by only about 0.11 g cm⁻³. The difference between the microprobe's Mg₀.₇₇Cu₀.₁₉Mn₀.₀₉ and the refinement's Mg₀.₇₀Cu₀.₃₀ is far less important to the density than the lead vacancies are, which is worth knowing before anyone argues about the M site on the strength of a density.

<!-- fig:msite -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Density for the same cell with the Pb site held at 0.89, as magnesium on the M site is replaced by copper or by manganese. Half the site swapped changes the density by less than 3 per cent." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>The M site hardly moves the density</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">The M site hardly moves the density</text><line x1="58" x2="546" y1="231.8" y2="231.8" style="stroke:var(--line)"/><text x="52" y="235.8" text-anchor="end" style="fill:var(--muted)">5.3</text><line x1="58" x2="546" y1="181.3" y2="181.3" style="stroke:var(--line)"/><text x="52" y="185.3" text-anchor="end" style="fill:var(--muted)">5.35</text><line x1="58" x2="546" y1="130.8" y2="130.8" style="stroke:var(--line)"/><text x="52" y="134.8" text-anchor="end" style="fill:var(--muted)">5.4</text><line x1="58" x2="546" y1="80.3" y2="80.3" style="stroke:var(--line)"/><text x="52" y="84.3" text-anchor="end" style="fill:var(--muted)">5.45</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="155.6" y="269" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="253.2" x2="253.2" y1="252" y2="256" style="stroke:var(--muted)"/><text x="253.2" y="269" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="350.8" x2="350.8" y1="252" y2="256" style="stroke:var(--muted)"/><text x="350.8" y="269" text-anchor="middle" style="fill:var(--muted)">0.3</text><line x1="448.4" x2="448.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="448.4" y="269" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Fraction of the M site taken by the heavier metal</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Density (g cm⁻³)</text><line x1="58" x2="546" y1="172.2" y2="172.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="167.2" text-anchor="end" style="fill:var(--muted)">paper: 5.359</text><line x1="243.4" x2="243.4" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="247.4" y="62" text-anchor="start" style="fill:var(--muted)">paper: Cu 0.19</text><path d="M58 352L67.8 345.9L77.5 339.9L87.3 333.9L97 327.9L106.8 321.8L116.6 315.8L126.3 309.8L136.1 303.7L145.8 297.8L155.6 291.7L165.4 285.6L175.1 279.7L184.9 273.6L194.6 267.6L204.4 261.6L214.2 255.5L223.9 249.5L233.7 243.5L243.4 237.5L253.2 231.4L263 225.4L272.7 219.4L282.5 213.3L292.2 207.4L302 201.3L311.8 195.2L321.5 189.3L331.3 183.2L341 177.2L350.8 171.2L360.6 165.1L370.3 159.1L380.1 153.1L389.8 147.1L399.6 141L409.4 135L419.1 129L428.9 122.9L438.6 117L448.4 110.9L458.2 104.9L467.9 98.9L477.7 92.8L487.4 86.9L497.2 80.8L507 74.7L516.7 68.8L526.5 62.7L536.2 56.7L546 50.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 352L67.8 347.2L77.5 342.5L87.3 337.8L97 333.1L106.8 328.5L116.6 323.7L126.3 319.1L136.1 314.3L145.8 309.6L155.6 304.9L165.4 300.2L175.1 295.5L184.9 290.8L194.6 286.1L204.4 281.4L214.2 276.6L223.9 272L233.7 267.3L243.4 262.6L253.2 257.9L263 253.2L272.7 248.5L282.5 243.7L292.2 239.1L302 234.3L311.8 229.7L321.5 224.9L331.3 220.3L341 215.5L350.8 210.8L360.6 206.1L370.3 201.4L380.1 196.8L389.8 192L399.6 187.4L409.4 182.6L419.1 177.9L428.9 173.2L438.6 168.5L448.4 163.8L458.2 159.1L467.9 154.4L477.7 149.7L487.4 144.9L497.2 140.3L507 135.5L516.7 130.9L526.5 126.2L536.2 121.4L546 116.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Mg replaced by Cu</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">Mg replaced by Mn</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same calculation with the lead site fixed at 0.89, swapping magnesium for copper or manganese on the M site. The M site is a much weaker lever on the density than the lead vacancies.</figcaption></figure>
<!-- /fig:msite -->

**The two cells agree.** The powder cell (436.7 Å³) and the single-crystal cell (436.88 Å³) differ by 0.03 % in volume, which moves the density by 0.002 g cm⁻³, far inside the published rounding. Cell uncertainty is not what limits a calculated density; the chemistry is.

## How we made the graphs

The charts and every number come from `scripts/blog-figures/plumbogottlobite-calculated-density-site-occupancy-cif.mjs` in fibub's public code. It builds the CIF text described above, then calls `readStructure`, `expand` and `summary` from `src/lib/sci/cif.ts`, the maths behind the [[cif-viewer]]: `expand` applies the Pnma operations to each site and merges the duplicates, and `summary` adds the occupancies into cell contents, finds Z against the formula sum, totals the atomic weights and divides by Avogadro's number times the volume.

Inputs from the paper: the cell (single-crystal and powder), the space group, Z, the empirical formula with its occupancies, the refined occupancies and the published density. **Our own:** the eight symmetry operations (standard for Pnma), the placeholder fractional coordinates, and the choice to put the extra 0.12 H on the hydrogen site. Atomic weights are fibub's element table.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/cif-viewer.mjs`, which pins the reader, the symmetry expansion and the density against **gemmi 0.7.5** and NumPy:

- rock salt expands to 8 atoms, V = 179.406 Å³, Z = 4 and a density of 2.164 g cm⁻³, with six Na–Cl contacts at 2.82 Å;
- rutile expands to 6 atoms, V = 62.3616 Å³, formula O₂Ti with Z = 2, density 4.2533 g cm⁻³, and Ti–O distances of 1.94747 Å (four) and 1.97983 Å (two);
- a made-up monoclinic P2₁/c test file gives 12 atoms, V = 241.815 Å³ and 1.9798 g cm⁻³, and its neighbour distances match gemmi to 10⁻⁵ Å;
- partial occupancies are counted by occupancy, not by site, and the uncertainties in brackets are read (5.2140(3) → 5.214 ± 0.0003).
- New with this article: the plumbogottlobite file above must give V = 436.883 Å³, Z = 4 and 5.3548 g cm⁻³, the ideal formula 5.5257 g cm⁻³, and the lead-occupancy slope 3.15 g cm⁻³ per unit occupancy.

## Check it yourself

On the [[cif-viewer]] page, in the *CIF file* card, paste this text into *Or paste the CIF text* (it is the file described above; the coordinates are placeholders):

```
data_plumbogottlobite
_chemical_name_mineral 'plumbogottlobite'
_cell_length_a 7.6104
_cell_length_b 6.1091
_cell_length_c 9.3968
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 90
_symmetry_space_group_name_H-M 'P n m a'
_chemical_formula_sum 'Pb0.89 Mg0.77 Cu0.19 Mn0.09 V1 O5 H1.12'
loop_
_symmetry_equiv_pos_as_xyz
'x,y,z'
'-x+1/2,-y,z+1/2'
'-x,y+1/2,-z'
'x+1/2,-y+1/2,-z+1/2'
'-x,-y,-z'
'x+1/2,y,-z+1/2'
'x,-y+1/2,z'
'-x+1/2,y+1/2,z+1/2'
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
_atom_site_occupancy
Pb1 Pb 0.1 0.25 0.4 0.89
M1 Mg 0 0 0 0.77
M2 Cu 0 0 0 0.19
M3 Mn 0 0 0 0.09
V1 V 0.42 0.25 0.12 1
O1 O 0.3 0.25 0.25 1
O2 O 0.55 0.25 0.25 1
O3 O 0.35 0.25 0.05 1
O4 O 0.15 0.25 0.75 1
O5 O 0.65 0.25 0.65 1
H1 H 0.2 0.25 0.8 1.12
```

1. The headline line under *Structure* should read **Pb0.89Mg0.77Cu0.19Mn0.09VO5H1.12, Z = 4; 5.355 g/cm³**, with *Cell volume* **436.883 Å³** and *Density* **5.355 g/cm³** in the facts below it.
2. Change the Pb1 occupancy from **0.89** to **1**, and the Mg, Cu, Mn and H occupancies to **1, 0, 0, 1** (or just delete the M2, M3 lines and set `_chemical_formula_sum` to `Pb1 Mg1 V1 O5 H1`). The density rises to **5.526 g/cm³**: the ideal formula.
3. Put the refinement's numbers in instead, Pb1 **0.941**, Mg **0.7**, Cu **0.3**, H **1**: **5.519 g/cm³**.
4. Swap the cell for the powder one, a **7.599**, b **6.118**, c **9.394**, with the first occupancies back: the volume becomes **436.733 Å³** and the density **5.357 g/cm³**.
5. Ignore the 3D cell and the *Bond lengths* table for this file. The coordinates are placeholders, so the picture and the distances mean nothing; with a real coordinate table they would be the most useful part of the page.

## What researchers can use it for

- **Check a published calculated density** before you cite it: a value that only matches the ideal formula is a sign that the vacancies in the analysis were left out.
- **See how much a site occupancy is worth**: run the density with the occupancy moved by 0.01 and compare it with the published rounding, as we did for the lead site.
- **Decide what a measured density can settle**: with a slope of 3 g cm⁻³ per unit of lead occupancy, a pycnometer good to 1 % pins the heavy site to about 0.015 atoms, and says nothing useful about Mg against Cu.
- **Read anyone's CIF in the browser** (nothing is uploaded), get the cell volume, Z and coordination numbers, and compare them with the paper's table.
- **Go from the cell to a pattern** with the [[xrd-peak-calculator]] or the [[electron-diffraction-indexer]], and from an oxide analysis to atoms per formula unit with the [[mineral-formula]] calculator, then feed the result back in as occupancies.

## The fine print

- The CIF we read is **ours, not the paper's**: the cell, the space group, Z and the occupancies are the paper's, the coordinates are placeholders on correct Wyckoff positions. We use the file only for cell contents and density.
- Our 5.355 g cm⁻³ sits 0.08 % below the published 5.359, well inside the difference made by rounding the occupancies and by which table of atomic weights is used.
- The paper's coordinate, bond-length and powder-pattern tables are published as images, so none of their values appear here, and we make no claim about bond lengths or diffraction lines.
- The hydrogen position and the 0.12 extra hydrogen affect the density by under 0.01 %; hydrogen is the one element a density calculation barely notices.
- A calculated density is not a measured one. For a mineral in grains this small, the paper reports no measured value, so there is nothing here to compare against experiment.
