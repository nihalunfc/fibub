---
title: "Spaltiite's two unit cells: which one fits its powder lines?"
summary: "A new thallium sulfosalt from Switzerland is described with two slightly different monoclinic cells. We recompute its eight strongest powder spacings from both with fibub's Miller index calculator."
tools: [miller-index-calculator, xrd-peak-calculator, cif-viewer, electron-diffraction-indexer]
updated: 2026-11-24
sources:
  - "Graeser, S., Topa, D., Effenberger, H. S., Makovicky, E., Paar, W. H. and Dincă, G. (2026), Spaltiite, Tl₂Cu₂As₂S₅, one more new thallium sulfosalt mineral from Lengenbach quarry, Binn, Switzerland, European Journal of Mineralogy 38: 27-37, doi:10.5194/ejm-38-27-2026. Licence CC BY 4.0, stated on the article page and checked there on 2026-11-24. Values used here: space group P2₁/c; single-crystal cell a = 15.791(8), b = 10.000(5), c = 6.323(3) Å, β = 99.25(8)°, V = 985.5(8) Å³, Z = 4; the cell refined from the Gandolfi powder film a = 15.821(9), b = 10.023(6), c = 6.334(4) Å, β = 99.21(6)°; the eight strongest powder lines (d in Å, relative intensity, indices) 3.914/40/021, 3.646/34/−221, 3.496/45/311, 2.988/63/510, 2.869/45/−511, 2.762/26/202, 2.652/36/−331, 2.506/29/040; refinement R1 = 12.18 % for 4753 data with Fo > 4σ(Fo); ideal formula Tl₂Cu₂As₂S₅."
  - "Cu Kα1 wavelength 1.5406 Å (the tool's default), used only to turn spacings into 2θ."
paper:
  title: "Spaltiite, Tl₂Cu₂As₂S₅, one more new thallium sulfosalt mineral from Lengenbach quarry, Binn, Switzerland"
  authors: "Graeser S, Topa D, Effenberger HS, Makovicky E, Paar WH, Dincă G"
  journal: "European Journal of Mineralogy"
  year: 2026
  doi: "10.5194/ejm-38-27-2026"
  url: "https://ejm.copernicus.org/articles/38/27/2026/"
  licence: "CC BY 4.0"
  reviewed: true
---

Describing a new mineral means pinning down its unit cell: the box of atoms that repeats through the crystal. A 2026 paper in the *European Journal of Mineralogy* names **spaltiite**, Tl₂Cu₂As₂S₅, a thallium sulfosalt from the Lengenbach quarry in Switzerland, and gives it a monoclinic cell in space group P2₁/c. It actually gives **two** cells: one from a single crystal and one refined from a powder film, differing by about 0.2 % in each edge. That difference is exactly the kind of thing the [[miller-index-calculator]] settles, because a cell makes a hard prediction for every plane spacing in the pattern. For the next steps, turn those spacings into peak positions with the [[xrd-peak-calculator]] or read a published structure file with the [[cif-viewer]].

## The paper in brief

Spaltiite is a new species, approved and then described in full here. The authors worked out its composition by electron microprobe (ideal Tl₂Cu₂As₂S₅, about 48 wt % thallium), solved its structure from a single crystal in space group P2₁/c with Z = 4, and reported a final R1 of 12.18 % for 4753 strong reflections, which is high and reflects a small, twinned, imperfect grain. They also recorded a Gandolfi powder film and list its lines with relative intensities and indices.

The two cells they give are:

| | a (Å) | b (Å) | c (Å) | β (°) |
|---|---|---|---|---|
| Single crystal | 15.791(8) | 10.000(5) | 6.323(3) | 99.25(8) |
| Powder film | 15.821(9) | 10.023(6) | 6.334(4) | 99.21(6) |

Published quoted uncertainties are a few thousandths of an ångström, so a 0.03 Å gap in *a* is far larger than the stated errors. Which cell describes the powder pattern?

## Checked with the tools

Everything below is a **recomputation from the paper's own numbers**: the two cells, the eight strongest measured spacings and the indices the authors assign to them. No new data and no fitting.

**Step 1: the cell volume checks out.** From the single-crystal cell the tool's metric tensor gives **V = 985.48 Å³**, which matches the paper's V = 985.5(8) Å³. The powder cell gives 991.46 Å³, 0.6 % larger. This is the cheapest possible check on any published cell, and it catches typing mistakes in a table.

**Step 2: the powder-film cell wins, clearly.** For each of the eight strongest lines we computed d(hkl) from both cells with the same metric-tensor formula the tool uses, 1/d² = **h**ᵀG\***h**, where G\* is the reciprocal metric tensor of the cell. The powder cell lands within **0.29 %** of every measured line, with a mean absolute difference of **0.12 %**. The single-crystal cell is low on every single line, by **0.20 to 0.50 %**, mean 0.33 %.

<!-- fig:resid -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="For each of the eight strongest powder lines, the per cent difference between the d-spacing calculated from each published cell and the measured one. The powder-film cell sits within 0.3 per cent of every line; the single-crystal cell is 0.2 to 0.5 per cent low throughout." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Measured minus calculated spacing, eight strongest lines</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Measured minus calculated spacing, eight strongest lines</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">-0.6</text><line x1="58" x2="546" y1="194" y2="194" style="stroke:var(--line)"/><text x="52" y="198" text-anchor="end" style="fill:var(--muted)">-0.4</text><line x1="58" x2="546" y1="146" y2="146" style="stroke:var(--line)"/><text x="52" y="150" text-anchor="end" style="fill:var(--muted)">-0.2</text><line x1="58" x2="546" y1="98" y2="98" style="stroke:var(--line)"/><text x="52" y="102" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="87.6" x2="87.6" y1="242" y2="246" style="stroke:var(--muted)"/><text x="87.6" y="259" text-anchor="middle" style="fill:var(--muted)">2.5</text><line x1="235.5" x2="235.5" y1="242" y2="246" style="stroke:var(--muted)"/><text x="235.5" y="259" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="383.3" x2="383.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="383.3" y="259" text-anchor="middle" style="fill:var(--muted)">3.5</text><line x1="531.2" x2="531.2" y1="242" y2="246" style="stroke:var(--muted)"/><text x="531.2" y="259" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Measured d-spacing (Å)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Calculated − measured (%)</text><line x1="58" x2="546" y1="98" y2="98" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="93" text-anchor="end" style="fill:var(--muted)">perfect agreement</text><circle cx="505.8" cy="171" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="426.5" cy="146.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="382.2" cy="217.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="231.9" cy="195.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="196.7" cy="154.9" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="165.1" cy="216.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="132.5" cy="150.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="89.4" cy="155.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="505.8" cy="120.1" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="426.5" cy="100.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="382.2" cy="164" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="231.9" cy="146.5" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="196.7" cy="113.6" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="165.1" cy="166.6" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="132.5" cy="102.3" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="89.4" cy="100.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Single-crystal cell</text><circle cx="225.8" cy="36" r="4" style="fill:var(--c-tools)"/><text x="236.8" y="40" style="fill:var(--muted)">Powder-film cell</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. How far each published cell is from the eight strongest measured lines, in per cent. Calculated with the Miller index calculator's metric-tensor d-spacings from the two cells the paper gives; the measured spacings and the indices are the paper's.</figcaption></figure>
<!-- /fig:resid -->

**Step 3: the error is a uniform shrink, not a wrong shape.** Because the single-crystal cell misses low on all eight lines, the fault is one of scale. One uniform factor fits best: multiplying every single-crystal spacing by **1.00326** brings the whole set into line. In other words the two cells agree on the *shape* of the box and disagree on its *size* by about a third of a per cent, the size of a temperature difference or an uncalibrated camera length, not a misindexed pattern.

| Line (hkl) | Measured d (Å) | Single-crystal cell | Powder-film cell |
|---|---|---|---|
| 021 | 3.914 | 3.9021 (−0.30 %) | 3.9104 (−0.09 %) |
| −221 | 3.646 | 3.6386 (−0.20 %) | 3.6456 (−0.01 %) |
| 311 | 3.496 | 3.4786 (−0.50 %) | 3.4864 (−0.28 %) |
| 510 | 2.988 | 2.9759 (−0.40 %) | 2.9820 (−0.20 %) |
| −511 | 2.869 | 2.8622 (−0.24 %) | 2.8671 (−0.07 %) |
| 202 | 2.762 | 2.7483 (−0.49 %) | 2.7541 (−0.29 %) |
| −331 | 2.652 | 2.6462 (−0.22 %) | 2.6515 (−0.02 %) |
| 040 | 2.506 | 2.5000 (−0.24 %) | 2.5057 (−0.01 %) |

**Step 4: the indices are self-consistent.** Two sanity checks that need no software: 040 must be exactly b/4, and 10.023/4 = **2.50575 Å**, which is what the tool returns and what the paper measured (2.506). And in P2₁/c the systematic absences require k even for 0k0 and l even for h0l; all eight indices obey them, so the list contains no forbidden reflection.

**Step 5: where those lines sit, and how crowded the pattern is.** With copper Kα1 radiation the eight lines fall between 2θ = 22.7° and 35.8° (Figure 2). Using the measured spacing or the powder cell moves a peak by at most 0.10° in 2θ, a shift a laboratory diffractometer would see easily and a Gandolfi film would not. The same cell also warns you how hard the pattern is: with indices up to 5 the tool lists 365 distinct spacings, **348 reflections below 2θ = 40°**, so almost every measured line is a blend of several.

<!-- fig:sticks -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="The eight strongest spaltiite powder lines placed on a 2θ axis for copper radiation, drawn from the d-spacings the Miller index calculator gives for the powder-film cell, with the intensities the paper reports." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Where the eight lines fall with Cu Kα1 (λ = 1.5406 Å)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Where the eight lines fall with Cu Kα1 (λ = 1.5406 Å)</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="180" y2="180" style="stroke:var(--line)"/><text x="52" y="184" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="128" y2="128" style="stroke:var(--line)"/><text x="52" y="132" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="76" y2="76" style="stroke:var(--line)"/><text x="52" y="80" text-anchor="end" style="fill:var(--muted)">60</text><line x1="74.3" x2="74.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="74.3" y="249" text-anchor="middle" style="fill:var(--muted)">22.5</text><line x1="155.6" x2="155.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="155.6" y="249" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="236.9" x2="236.9" y1="232" y2="236" style="stroke:var(--muted)"/><text x="236.9" y="249" text-anchor="middle" style="fill:var(--muted)">27.5</text><line x1="318.3" x2="318.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="318.3" y="249" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="399.6" x2="399.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="399.6" y="249" text-anchor="middle" style="fill:var(--muted)">32.5</text><line x1="480.9" x2="480.9" y1="232" y2="236" style="stroke:var(--muted)"/><text x="480.9" y="249" text-anchor="middle" style="fill:var(--muted)">35</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">2θ (°)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Relative intensity</text><path d="M81.5 232L81.5 128" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M136 232L136 143.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M172.8 232L172.8 115" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M316.3 232L316.3 68.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M356.3 232L356.3 115" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M399.1 232L399.1 164.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M441.1 232L441.1 138.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M507.2 232L507.2 156.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="81.5" cy="128" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="136" cy="143.6" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="172.8" cy="115" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="316.3" cy="68.2" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="356.3" cy="115" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="399.1" cy="164.4" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="441.1" cy="138.4" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="507.2" cy="156.6" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="80.8" cy="128" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="135.9" cy="143.6" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="170.5" cy="115" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="314.3" cy="68.2" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="355.6" cy="115" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="396" cy="164.4" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="440.9" cy="138.4" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="507.1" cy="156.6" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Calculated from the powder cell</text><circle cx="312.2" cy="36" r="4" style="fill:var(--c-tools)"/><text x="323.2" y="40" style="fill:var(--muted)">From the measured spacing</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same eight lines as a stick pattern for copper Kα1 radiation: blue dots are 2θ from the powder-film cell, the second colour is 2θ worked out straight from the measured spacing. Heights are the paper's relative intensities.</figcaption></figure>
<!-- /fig:sticks -->

**Step 6: geometry between planes.** Two of the strong lines, (510) and (−511), have normals **136.15°** apart in the powder cell, and their zone axis, the direction both planes contain, is **[1 −5 10]**. (021) and (040) are at **38.71°** with zone axis **[−100]**. These are the numbers you need to decide whether two spots on a diffraction pattern can belong to one crystal.

| Check | Paper | Tool gives |
|---|---|---|
| Single-crystal cell volume | 985.5(8) Å³ | 985.48 Å³ |
| Mean miss over the 8 strongest lines, single-crystal cell | not stated | 0.33 % (all low) |
| Mean miss, powder-film cell | not stated | 0.12 % |
| d(040) | 2.506 Å | 2.50575 Å = b/4 |
| P2₁/c absence rules for the listed indices | assumed | all eight allowed |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/spaltiite-monoclinic-cell-powder-d-spacings.mjs` in fibub's public code. It calls `cellFor`, `volume`, `dSpacing`, `planeAngle`, `zoneAxis`, `fmtIdx` and `reflections` from `src/lib/sci/miller.ts`, the maths behind the [[miller-index-calculator]].

The two cells, the eight measured spacings, their relative intensities and their indices all come from the paper. The Cu Kα1 wavelength of 1.5406 Å is the tool's default and only converts spacings into 2θ; the Gandolfi film itself used a different radiation, so treat Figure 2 as "where these spacings would appear on a modern copper diffractometer", not as the paper's film. The uniform scale factor and the P2₁/c absence check are **our additions**, not the paper's.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/miller-index-calculator.mjs`, which pins the metric-tensor maths against NumPy, where the reciprocal vectors are built from cross products instead:

- A triclinic cell (5.1, 6.3, 7.7 Å, 82, 97, 104°) must have volume 236.71233 Å³ and d(123) = 1.7638584 Å.
- In that cell the angle between (123) and (−211) must be 95.91923°, and the zone axis of two planes must sit at exactly 90° to both normals.
- A monoclinic cell with β = 110° must give d(101) = 3.3233087 Å, and a hexagonal cell a = 3.21, c = 5.21 Å must give d(101) = 2.4526404 Å, the same as the textbook four-thirds formula.
- New with this article: spaltiite's powder-film cell must give d(040) = 2.50575 Å (exactly b/4), d(510) = 2.9820 Å and d(−511) = 2.8671 Å, a (510)–(−511) angle of 136.154° and a zone axis of [1 −5 10], and its volume must be 991.459 Å³.

## Check it yourself

On the [[miller-index-calculator]]:

1. In the *Crystal* card set *Crystal system* to **Monoclinic (b unique)**, then type **a (Å)** 15.821, **b (Å)** 10.023, **c (Å)** 6.334 and **β (°)** 99.21.
2. In *Planes and directions* put **5 1 0** in *Plane 1 (hkl)* and **−5 1 1** in *Plane 2 (hkl)* (a plain hyphen works: type `-5 1 1`). Leave *Wavelength for 2θ (Å)* at **1.5406**.
3. *Results* reads **d(510) = 2.9820 Å** with 2θ = 29.941°, **d(−511) = 2.8671 Å** with 2θ = 31.170°, an *Angle between the planes* of **136.15°** and a *Zone axis* of **[1 −5 10]**.
4. Change *Plane 1 (hkl)* to **0 4 0**: it gives **2.5058 Å**, one quarter of b, and 2θ = 35.807°.
5. Now retype the single-crystal cell (15.791, 10.000, 6.323, 99.25). d(040) falls to **2.5000 Å** and the volume under *In the unit cell* drops from 991.46 to **985.48 Å³**, the value printed in the paper.
6. Set *Largest index* to **5** under *Reflection list* to see how many spacings crowd the first 40° of the pattern.

## What researchers can use it for

- **Decide between two published cells** for the same phase by recomputing the strongest lines from each, as above, instead of refitting the whole pattern.
- **Check a new-mineral powder table before submitting it**: every d must follow from the cell and its index, and no line may break the space group's absence rules.
- **Index a single spot or a spot pair** on an electron diffraction pattern: get candidate spacings here, then take the pattern geometry to the [[electron-diffraction-indexer]].
- **Plan a diffraction scan**: see which 2θ range holds the strongest lines, with the [[xrd-peak-calculator]] for peak widths and crystallite size.
- **Teach the metric tensor** in a non-orthogonal cell, where the simple 1/d² = h²/a² + k²/b² + l²/c² formula no longer holds.

## The fine print

- Our figures use the measured spacings and indices as printed in the paper; we did not re-measure the film or refine a cell.
- A mean miss of 0.33 % does not make the single-crystal cell wrong. Single-crystal and film measurements are calibrated differently, and the paper gives both on purpose.
- Figure 2 places the lines on a copper Kα1 axis for comparison only; the original film used other conditions.
- Relative intensities are the paper's; the tool makes no attempt to calculate intensities, which need the atom positions.
- Spaltiite contains thallium and arsenic. Mineral specimens of this kind are handled as toxic material.
