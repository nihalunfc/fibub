---
title: "Karstic bauxite chemistry: a ternary plot and rare earth enrichment"
summary: "A 2025 Minerals paper reports rare earth enrichment and a negative europium anomaly in Greek karstic bauxite. We replot its bulk chemistry and enrichment factors with fibub's ternary and spider tool."
tools: [ternary-plot-maker, point-counter, mixing-model-calculator]
updated: 2026-11-24
sources:
  - "Sofis, N., Ntouros, E. P. and Kalaitzidis, S. (2025), REE Mineralogy and Geochemistry of the Lower Karstic Bauxite Strata (b1), in the Parnassos-Ghiona Unit, Greece, Minerals 15(8): 804, doi:10.3390/min15080804. Licence CC BY 4.0 (recorded in the publisher's Crossref deposit; the article page says only \"open access Creative Common CC BY\"), checked 2026-11-24. Values used here, all from the paper's running text: 66 XRF analyses from seven sites plus 27 bauxites by ICP-MS; bauxite Al2O3 27.4 to 63.90 wt % (mean 42.80), Fe2O3 0.47 to 28.8 (mean 17.33), SiO2 1.25 to 23.9 (mean 7.43), TiO2 0.02 to 3.92 (mean 2.67), CaO 0.14 to 17.56; a mean TiO2/Al2O3 of 0.06; the transitional sample PR1-2 with Al2O3 27.39, SiO2 23.97, Fe2O3 11.13 wt %; the clay-rich sample PR1-11 with Al2O3 57.98, SiO2 4.75, Fe2O3 2.06 wt % and 800.27 mg/kg total REE; total REE 182.65 to 2781.62 mg/kg with means given as 527 and 647 mg/kg, LREE mean 496 and HREE mean 151 mg/kg; mean Sc 45, V 324, Cr 355, Ni 217, Zr 468, Ga 65, La 131, Ce 230, Nd 80 mg/kg; Eu/Eu* 0.56 to 0.69 (mean 0.62), Ce/Ce* 0.41 to 7.43, LaN/YbN 3.15 to 59.87; continental-crust averages quoted from Mason and Moore of Sc 22, V 135, Cr 100, Ni 75, Zr 165, La 30, Ce 60 mg/kg."
  - "Compositional data practice (closure, and the geometric centre as the mean of a composition): Aitchison, J. (1986), The Statistical Analysis of Compositional Data, Chapman and Hall. Eu/Eu* = Eu_N / sqrt(Sm_N x Gd_N), the usual geometric-mean definition."
paper:
  title: "REE Mineralogy and Geochemistry of the Lower Karstic Bauxite Strata (b1), in the Parnassos-Ghiona Unit, Greece"
  authors: "Sofis N, Ntouros EP, Kalaitzidis S"
  journal: "Minerals"
  year: 2025
  doi: "10.3390/min15080804"
  url: "https://www.mdpi.com/2075-163X/15/8/804"
  licence: "CC BY 4.0"
  reviewed: true
---

Karst bauxite forms when limestone-derived and windblown clays weather in sinkholes until almost everything but aluminium, iron and titanium has washed away. What is left behind is a candidate rare earth resource, and a record of where the original dust came from. A 2025 paper in *Minerals* analysed the lowest bauxite horizon of the Parnassos-Ghiona unit in central Greece: 66 whole-rock analyses, rare earth contents up to 2782 mg/kg, and a negative europium anomaly that points at a felsic source. Most of that evidence is three-part composition and normalised ratios, which is what the [[ternary-plot-maker]] draws. This article replots the paper's bulk chemistry, recomputes its enrichment factors, and checks its internal arithmetic. For the mineral side of the same rock see the [[point-counter]], and for two-source mixing of the clays, the [[mixing-model-calculator]].

## The paper in brief

The b1 bauxites average **42.80 wt % Al₂O₃**, **17.33 % Fe₂O₃**, **7.43 % SiO₂** and **2.67 % TiO₂**, with wide ranges (Al₂O₃ 27.4 to 63.9 %, Fe₂O₃ 0.47 to 28.8 %). Total rare earth contents, counting Y and Sc, run from **183 to 2782 mg/kg**, and trace metals are several times the average continental crust.

The provenance argument rests on normalised ratios: **Eu/Eu* of 0.56 to 0.69** (mean 0.62), a clear negative europium anomaly, **LaN/YbN from 3.15 to 59.87**, so light rare earths strongly enriched over heavy ones, and **Ce/Ce* from 0.41 to 7.43**, a very wide swing that records oxidation and remobilisation of cerium inside the deposit. A low TiO₂/Al₂O₃ ratio and Zr/Cr above 1 separate this horizon from the higher, more basic-sourced b3 bauxites.

## Checked with the tools

Everything below is **recomputed from numbers in the paper's running text**. The individual rare earth concentrations behind Eu/Eu* sit in tables we could not read, so we check the arithmetic around the anomaly rather than the anomaly itself, and say where that limit bites.

**Step 1: the bulk chemistry as a composition.** Scaling the three main oxides of each lithology to 100 % (closure, what the tool does to every row) gives the mean bauxite **63.4 % Al₂O₃ / 11.0 % SiO₂ / 25.7 % Fe₂O₃**, the transitional sample PR1-2 **43.8 / 38.4 / 17.8**, and the clay-rich PR1-11 **89.5 / 7.3 / 3.2**. Figure 1 puts them on the triangle: the bauxite sits where karst bauxites belong, aluminous with substantial iron, and the two other lithologies pull away along the silica and alumina edges, which is the paper's own distinction between bauxite, transitional rocks and clay.

<!-- fig:ternary -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 360" role="img" aria-label="Ternary diagram of alumina, silica and iron oxide. The mean b1 bauxite plots at 63 per cent alumina, 11 per cent silica and 26 per cent iron oxide; the transitional sample is richer in silica and the clay-rich sample richer in alumina." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Bauxite bulk chemistry on the Al₂O₃–SiO₂–Fe₂O₃ triangle</title><text x="14" y="20" style="fill:var(--ink);font-weight:600;font-size:14px">Bauxite bulk chemistry: Al₂O₃–SiO₂–Fe₂O₃</text><line x1="170.0" y1="266.0" x2="410.0" y2="266.0" style="stroke:var(--line)"/><line x1="260.0" y1="110.2" x2="380.0" y2="318.0" style="stroke:var(--line)"/><line x1="320.0" y1="110.2" x2="200.0" y2="318.0" style="stroke:var(--line)"/><line x1="200.0" y1="214.1" x2="380.0" y2="214.1" style="stroke:var(--line)"/><line x1="230.0" y1="162.1" x2="320.0" y2="318.0" style="stroke:var(--line)"/><line x1="350.0" y1="162.1" x2="260.0" y2="318.0" style="stroke:var(--line)"/><line x1="230.0" y1="162.1" x2="350.0" y2="162.1" style="stroke:var(--line)"/><line x1="200.0" y1="214.1" x2="260.0" y2="318.0" style="stroke:var(--line)"/><line x1="380.0" y1="214.1" x2="320.0" y2="318.0" style="stroke:var(--line)"/><line x1="260.0" y1="110.2" x2="320.0" y2="110.2" style="stroke:var(--line)"/><line x1="170.0" y1="266.0" x2="200.0" y2="318.0" style="stroke:var(--line)"/><line x1="410.0" y1="266.0" x2="380.0" y2="318.0" style="stroke:var(--line)"/><path d="M290.0 58.2L140.0 318.0L440.0 318.0Z" style="fill:none;stroke:var(--muted);stroke-width:1.5"/><text x="290" y="48.1923788646684" text-anchor="middle" style="fill:var(--ink)">Al₂O₃</text><text x="134" y="336" text-anchor="middle" style="fill:var(--ink)">SiO₂</text><text x="446" y="336" text-anchor="middle" style="fill:var(--ink)">Fe₂O₃</text><circle cx="312.0" cy="153.4" r="5" style="fill:var(--c-blog)"/><text x="14" y="44" style="fill:var(--c-blog)">■</text><text x="30" y="44" style="fill:var(--muted)">Bauxite (mean of 66): 63.4 / 11 / 25.7 %</text><circle cx="259.2" cy="204.1" r="5" style="fill:var(--c-tools)"/><text x="14" y="62" style="fill:var(--c-tools)">■</text><text x="30" y="62" style="fill:var(--muted)">Transitional PR1-2: 43.8 / 38.4 / 17.8 %</text><circle cx="283.8" cy="85.5" r="5" style="fill:var(--ink)"/><text x="14" y="80" style="fill:var(--ink)">■</text><text x="30" y="80" style="fill:var(--muted)">Clay-rich PR1-11: 89.5 / 7.3 / 3.2 %</text><circle cx="284.5" cy="134.0" r="4" style="fill:none;stroke:var(--ink);stroke-width:1.6"/><text x="292.5" y="138.0" style="fill:var(--muted)">geometric centre</text><text class="fibub-mark" x="554" y="354" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The paper's mean bauxite and its two other lithologies on the Al₂O₃–SiO₂–Fe₂O₃ triangle, placed with the Ternary plot tool's own closure and triangle coordinates. The open circle is the geometric (compositional) centre of the three.</figcaption></figure>
<!-- /fig:ternary -->

**Step 2: the average of a composition is not the average of its parts.** Averaging the three closed rows one oxide at a time gives **65.6 / 18.9 / 15.5 %**; the geometric centre, the mean that compositional statistics recommends and that the tool prints in its table, gives **70.8 / 16.4 / 12.8 %**. More than five percentage points of Al₂O₃ hangs on which mean you use, because closed data live on a simplex, not on a line. Any bauxite "average composition" is worth checking for this.

**Step 3: enrichment against average crust.** The paper quotes crustal averages (Mason and Moore) beside its own means, so the enrichment factors can be computed with the tool's normalise function, the same code as its spider diagram:

| Element | Bauxite mean (mg/kg) | Crustal average (mg/kg) | Enrichment |
|---|---|---|---|
| La | 131 | 30 | **4.37×** |
| Ce | 230 | 60 | 3.83× |
| Cr | 355 | 100 | 3.55× |
| Ni | 217 | 75 | 2.89× |
| Zr | 468 | 165 | 2.84× |
| V | 324 | 135 | 2.40× |
| Sc | 45 | 22 | 2.05× |

So the light rare earths are the most enriched elements in the list, about four times crust, while the immobile and ferromagnesian metals cluster at two to three times. That is the residual-enrichment signature the paper describes, and it is what a reader should check before reading a rare earth resource into a bauxite: a factor of four on 30 mg/kg is not an ore grade.

<!-- fig:enrich -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 290" role="img" aria-label="Each element's mean in the b1 bauxites divided by the continental-crust average the paper quotes. Lanthanum is enriched 4.37 times and cerium 3.83 times; chromium 3.55 times." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Bauxite trace elements against average continental crust</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Bauxite trace elements against average continental crust</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--line)"/><text x="52" y="248" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="201.6" y2="201.6" style="stroke:var(--line)"/><text x="52" y="205.6" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="159.2" y2="159.2" style="stroke:var(--line)"/><text x="52" y="163.2" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="116.8" y2="116.8" style="stroke:var(--line)"/><text x="52" y="120.8" text-anchor="end" style="fill:var(--muted)">3</text><line x1="58" x2="546" y1="74.4" y2="74.4" style="stroke:var(--line)"/><text x="52" y="78.4" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">5</text><line x1="92.9" x2="92.9" y1="244" y2="248" style="stroke:var(--muted)"/><text x="92.9" y="261" text-anchor="middle" style="fill:var(--muted)">Sc</text><line x1="162.6" x2="162.6" y1="244" y2="248" style="stroke:var(--muted)"/><text x="162.6" y="261" text-anchor="middle" style="fill:var(--muted)">V</text><line x1="232.3" x2="232.3" y1="244" y2="248" style="stroke:var(--muted)"/><text x="232.3" y="261" text-anchor="middle" style="fill:var(--muted)">Cr</text><line x1="302" x2="302" y1="244" y2="248" style="stroke:var(--muted)"/><text x="302" y="261" text-anchor="middle" style="fill:var(--muted)">Ni</text><line x1="371.7" x2="371.7" y1="244" y2="248" style="stroke:var(--muted)"/><text x="371.7" y="261" text-anchor="middle" style="fill:var(--muted)">Zr</text><line x1="441.4" x2="441.4" y1="244" y2="248" style="stroke:var(--muted)"/><text x="441.4" y="261" text-anchor="middle" style="fill:var(--muted)">La</text><line x1="511.1" x2="511.1" y1="244" y2="248" style="stroke:var(--muted)"/><text x="511.1" y="261" text-anchor="middle" style="fill:var(--muted)">Ce</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--muted)"/><text x="302" y="282" text-anchor="middle" style="fill:var(--ink)">Element</text><text transform="translate(14 138) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Bauxite ÷ crustal average</text><line x1="58" x2="546" y1="201.6" y2="201.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="196.6" text-anchor="end" style="fill:var(--muted)">crustal average</text><circle cx="92.9" cy="157.1" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="162.6" cy="142.2" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="232.3" cy="93.5" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="121.5" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="371.7" cy="123.6" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="441.4" cy="58.7" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="511.1" cy="81.6" r="5" style="fill:var(--c-blog);opacity:1"/><text class="fibub-mark" x="546" y="282" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The bauxite means divided by the continental-crust averages the paper quotes, worked out with the tool's normalise function. Values above the dashed line are enrichments.</figcaption></figure>
<!-- /fig:enrich -->

**Step 4: the paper's two different REE means.** The text gives the mean total REE once as **527** and once as **647 mg/kg**, which looks like a slip. It is not: the stated LREE mean (496) plus the stated HREE mean (151) is **exactly 647**, so 647 is the mean of the full ICP-MS set and 527 belongs to a different subset. Simple addition settles a reader's doubt, and the closure of those two parts puts **76.7 % of the rare earth budget in the light rare earths**.

**Step 5: what the europium anomaly says, and what it needs.** Eu/Eu* = Eu_N ÷ √(Sm_N × Gd_N) compares the measured europium with a smooth line drawn between its neighbours. The paper's range of 0.56 to 0.69 therefore means the europium is **31 to 44 % below** that line (mean 38 % below), the fingerprint of a source whose feldspars took the europium away, that is a felsic igneous rock.

Two properties of this ratio are worth knowing, and both can be shown on the tool. First, it does not care about dilution: multiply every concentration in a sample by three and Eu/Eu* is unchanged (we checked it, 0.6896 either way on an illustrative sample). Second, the normalising set enters only as a single constant: Eu/Eu* equals the raw ratio Eu/√(Sm × Gd) multiplied by √(Sm_ref × Gd_ref)/Eu_ref. With the illustrative reference values we used, that constant is 3.1914, so the paper's Eu/Eu* range pins the **raw** ratio Eu/√(Sm × Gd) between 0.176 and 0.216. Change the reference table and every Eu/Eu* in the literature moves by the same factor, which is why papers must name the normalising set. (Those reference values are **made up for illustration**: fibub bundles no chondrite table, by design, so you paste the values from the source you cite.)

| Check | Paper | Our tool result |
|---|---|---|
| Mean TiO₂/Al₂O₃ | 0.06 | 2.67 ÷ 42.80 = 0.0624 ✔ |
| Mean total REE | 527 and 647 mg/kg | LREE 496 + HREE 151 = 647 ✔ |
| Light share of the REE budget | not stated | 76.7 % |
| Mean bauxite, three main oxides closed | not stated | 63.4 / 11.0 / 25.7 % |
| Centre of the three lithologies | not stated | 70.8 / 16.4 / 12.8 % (geometric), 65.6 / 18.9 / 15.5 % (arithmetic) |
| La enrichment over crust | "enriched" | 4.37 times |
| Europium shortfall from Eu/Eu* | 0.56 to 0.69 | 31 to 44 % below the smooth line |

## How we made the graphs

Both figures and every number above come from `scripts/blog-figures/karstic-bauxite-bulk-composition-ree-eu-anomaly-ternary.mjs` in fibub's public code. It calls `closure`, `toXY`, `centres`, `normalise` and `anomaly` from `src/lib/sci/ternary.ts`, the maths behind the [[ternary-plot-maker]]: `closure` scales each analysis to 100 %, `toXY` places it in the triangle, `centres` gives the arithmetic and geometric centres, `normalise` divides a sample by a reference and `anomaly` is the Eu/Eu* formula.

The oxide means, the single-sample analyses, the trace-element means, the crustal averages, the REE means and the Eu/Eu* range are from the paper's running text. The reference values in step 5 are **made up for illustration**. No table or figure from the paper was copied, and we measured nothing.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the ternary and spider maths, and `tests/sci-tools/ternary-plot-maker.mjs` adds this article's numbers:

- Closure: (2, 3, 5) becomes 0.2, 0.3, 0.5, and a row with a negative or all-zero value is refused rather than plotted.
- Triangle coordinates: the three corners land at (0.5, √3/2), (0, 0) and (1, 0), the equal mixture at the centroid, and `fromXY` undoes `toXY` to 1e-12.
- The geometric centre of two compositions equals the closed geometric mean worked out by hand, and rows containing a zero are left out of it.
- The Eu anomaly: 10 normalised against √(25 × 16) gives exactly 0.5, and a missing neighbour gives "not a number" rather than a wrong value.
- New with this article: the mean b1 bauxite (42.80, 7.43, 17.33 wt %) must close to 63.4 / 11.0 / 25.7 %; the three lithologies must give a geometric centre of 70.8 / 16.4 / 12.8 % and an arithmetic centre of 65.6 / 18.9 / 15.5 %; and Eu/Eu* must be unchanged when every concentration in a sample is trebled.

## Check it yourself

On the [[ternary-plot-maker]] page there are two cards. First the *Ternary diagram*:

1. Replace the text in *Data with a header row: a name column, three or more number columns, and an optional group column* with four lines (tabs or commas both work): `sample, Al2O3, SiO2, Fe2O3`; `Bauxite mean, 42.80, 7.43, 17.33`; `Transitional PR1-2, 27.39, 23.97, 11.13`; `Clay-rich PR1-11, 57.98, 4.75, 2.06`.
2. Set *Top corner* to **Al2O3**, *Bottom left* to **SiO2** and *Bottom right* to **Fe2O3**.
3. The heading reads **3 points**, and the table under the plot, captioned *Centre of each group (geometric mean, closed to 100 %)*, shows **70.8 / 16.4 / 12.8**. The three plotted points are the percentages in step 1 above.

Then the *Spider diagram (normalised elements)* card:

4. Replace its data with three lines: `sample, Sc, V, Cr, Ni, Zr, La, Ce`; `Bauxite b1 mean, 45, 324, 355, 217, 468, 131, 230`; `Continental crust, 22, 135, 100, 75, 165, 30, 60`.
5. *Normalise by the row* should already say **Continental crust** (the tool recognises a reference row by its name). The plot now shows the bauxite line sitting between 2 and 4.4 on a logarithmic axis, rising to the right: La **4.37** and Ce **3.83** at the end, Sc **2.05** at the start.
6. Add `Eu` and `Gd` and `Sm` columns of your own data to the same card and it will print *Eu/Eu\** and *(La/Yb)N* for each sample under the plot.

## What researchers can use it for

- **Replot a published bulk chemistry** on the triangle your field uses, from the numbers in the text, before deciding whether a new sample belongs with it.
- **Report a compositional average honestly**: give the geometric centre, or say which mean you used, since the two differ by several percentage points on real bauxite data.
- **Build a normalised diagram with your own reference table**, cited, instead of whatever a plotting package happens to bundle.
- **Audit the arithmetic in a paper** you are about to cite: ratios like TiO₂/Al₂O₃, LREE + HREE sums and enrichment factors can all be checked in a minute, and they do sometimes explain a puzzling pair of numbers.
- **Teach closure**: three oxides that only add up to two-thirds of a rock still make a valid ternary diagram, as long as everyone knows it shows proportions among the three, not of the whole rock.

## The fine print

- Al₂O₃ + SiO₂ + Fe₂O₃ is only about 68 % of these bauxites; the rest is loss on ignition, TiO₂, CaO and minor oxides. The triangle shows the balance between the three, not the rock's full composition.
- We could **not** recompute Eu/Eu* or LaN/YbN from the paper's own data: the individual Sm, Eu, Gd and Yb concentrations are in tables that our reading of the page did not return. Step 5 checks the formula and what the published ratios imply, not the measurements.
- The reference values in step 5 are invented for illustration. Use a real, cited normalising set for any published figure, and name it.
- The crustal averages are the ones the paper itself quotes from Mason and Moore; other compilations differ by tens of per cent, which moves every enrichment factor.
- Means hide the ranges here: total REE spans 183 to 2782 mg/kg, so a single enrichment factor describes no individual sample.
