---
title: "Counting sunspot groups automatically: how the grouping rule sets the sunspot number"
summary: "A 2024 study grouped sunspots on SDO/HMI images by machine and got the relative sunspot number to within 0.91 correlation of the official series. We rebuild its arithmetic and show why grouping, not spot finding, is the hard part."
tools: [sunspot-counter, solar-cycle-fitter, sun-position-calculator, fits-viewer]
updated: 2026-11-24
sources:
  - "Zhao, C., Yang, S., Wang, T., Zhao, H., Liu, S., He, F. and Hu, Z. (2024), An Automatic Approach for Grouping Sunspots and Calculating Relative Sunspot Number on SDO/HMI Continuum Images, The Astronomical Journal 167(2): 51, doi:10.3847/1538-3881/ad11e2. Licence CC BY 4.0 (version of record), checked on the Crossref record for the DOI, 2026-11-24; no correction or retraction is recorded. Values used here: 507 daily SDO/HMI continuum images at 08:45 UT from January 2022 to May 2023; the worked example of 14 January 2022 with 15 spots in 9 groups giving R = 105; grouping accuracy 85.3 %; correlation 0.91 with the international series; scaling factor K = 1.03 for HMI continuum images. The full text was read from the author version at ar5iv (arXiv:2401.08949)."
  - "The relative (Wolf) sunspot number R = k (10 g + s): Wolf, R. (1856), Mittheilungen über die Sonnenflecken, Astronomische Mittheilungen 1; still the definition used by the international series."
paper:
  title: "An Automatic Approach for Grouping Sunspots and Calculating Relative Sunspot Number on SDO/HMI Continuum Images"
  authors: "Zhao C, Yang S, Wang T, Zhao H, Liu S, He F, Hu Z"
  journal: "The Astronomical Journal"
  year: 2024
  doi: "10.3847/1538-3881/ad11e2"
  url: "https://doi.org/10.3847/1538-3881/ad11e2"
  licence: "CC BY 4.0"
  reviewed: true
---

The relative sunspot number is the longest-running measurement in astronomy, and it is not a count of spots. It is R = k (10 g + s), where g is the number of **spot groups**, s the number of individual spots and k a factor that matches one observer to the standard. A group is worth ten spots, which means that whoever draws the boundaries around the groups decides the answer. A 2024 paper in *The Astronomical Journal* built an automatic pipeline that finds, segments and groups spots on daily SDO/HMI continuum images of the Sun and reports R without a human in the loop. This article rebuilds that arithmetic with the [[sunspot-counter]], which does the same four steps in your browser on your own photograph, and shows how far R moves when only the grouping rule changes. To go further, fit the counts over a cycle with the [[solar-cycle-fitter]] and plan your own white-light session with the [[sun-position-calculator]].

## The paper in brief

The authors took one SDO/HMI continuum image a day at 08:45 UT, 507 of them, from January 2022 to May 2023, near the rise of solar cycle 25. Their pipeline is deliberately simple. A morphological closing with a disc-shaped element removes the spots and leaves a clean solar surface; subtracting that from the original leaves the dark regions. A fixed grey-level threshold (a lower one near the limb, to allow for limb darkening) turns those into candidate spots, and candidates that are too small or too shallow are thrown away. Nearby spots are then merged by **erosion**: shrinking each region until neighbours touch, so that one bounding box holds one group.

Their worked example is the image of 14 January 2022: **15 spots in 9 groups**, so R = 10 × 9 + 15 = **105**. Over the whole run they report a grouping and detection accuracy of **85.3 %**, a correlation of **0.91** with the international (SILSO) series, and a scaling factor **K = 1.03** for HMI continuum images, which is the k of Wolf's formula for this particular "observer". The honest part of the paper is that it says where the error lives: grouping. An earlier automatic method they cite reached only 44 % group-recognition accuracy, and another differed from the Wolf number by about 10 %.

## Checked with the tools

The paper publishes no spot positions, so we cannot re-run its images. Instead we **made our own synthetic white-light Sun** with exactly the make-up of its worked example: 15 umbrae arranged in 9 groups on a limb-darkened disc (limb-darkening coefficient 0.6, penumbrae at 0.75 and umbrae at 0.3 of the local surface brightness, as the tool's own demo image uses). The positions are **our assumption**. Then we ran the Sunspot counter's real pipeline over it: `findDisc`, `findSpots`, `groupSpots`, `wolfNumber`.

**Step 1: the detection.** The tool found the disc at a radius of 314.2 pixels in a 700-pixel image and picked out **11 dark regions holding 15 umbral cores**. That is the situation a real counter faces: the number of *regions* is not the number of *spots*, because several umbrae can share one penumbra, and the Wolf number counts umbrae (a region with none, a pore, counts as one).

**Step 2: the grouping, and the paper's number.** At the page's default grouping distance of 10° on the Sun, the tool reports **g = 9, s = 15, R = 105** — the paper's own figure, from an independent pipeline. With the paper's HMI factor K = 1.03 it becomes **108.2**.

**Step 3: how much the rule matters.** Figure 1 sweeps the grouping distance from 2° to 30°. Below about 8° our sprawling first group breaks into three and R climbs to 125; above about 18° two separate groups merge and R falls to 85, then to 65 by 25°. The answer is flat at 105 only between **8.5° and 18°**. In other words, one image can legitimately give R from 65 to 125 depending on a single setting — a spread of nearly a factor of two.

<!-- fig:grouping -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Relative sunspot number from the tool's own pipeline on our synthetic Sun, against the grouping distance from 2 to 30 degrees. It is 125 at 4 degrees, settles on 105 from about 6 to 17 degrees, and falls to 65 at 25 degrees." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>One image, one grouping rule: the sunspot number moves</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">One image, one grouping rule: the sunspot number moves</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="198.1" y2="198.1" style="stroke:var(--line)"/><text x="52" y="202.1" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="144.3" y2="144.3" style="stroke:var(--line)"/><text x="52" y="148.3" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="90.4" y2="90.4" style="stroke:var(--line)"/><text x="52" y="94.4" text-anchor="end" style="fill:var(--muted)">120</text><line x1="110.3" x2="110.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="110.3" y="269" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="197.4" x2="197.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="197.4" y="269" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="284.6" x2="284.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="284.6" y="269" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="371.7" x2="371.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="371.7" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="458.9" x2="458.9" y1="252" y2="256" style="stroke:var(--muted)"/><text x="458.9" y="269" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Grouping distance (degrees on the Sun)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Relative sunspot number R</text><line x1="58" x2="546" y1="130.8" y2="130.8" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="125.80000000000001" text-anchor="end" style="fill:var(--muted)">the paper’s R = 105</text><line x1="197.4" x2="197.4" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="201.4" y="62" text-anchor="start" style="fill:var(--muted)">10° default</text><path d="M58 76.9L66.7 76.9L75.4 76.9L84.1 76.9L92.9 76.9L101.6 76.9L110.3 76.9L119 76.9L127.7 76.9L136.4 76.9L145.1 103.9L153.9 103.9L162.6 103.9L171.3 130.8L180 130.8L188.7 130.8L197.4 130.8L206.1 130.8L214.9 130.8L223.6 130.8L232.3 130.8L241 130.8L249.7 130.8L258.4 130.8L267.1 130.8L275.9 130.8L284.6 130.8L293.3 130.8L302 130.8L310.7 130.8L319.4 130.8L328.1 130.8L336.9 130.8L345.6 157.7L354.3 184.7L363 184.7L371.7 184.7L380.4 184.7L389.1 184.7L397.9 211.6L406.6 211.6L415.3 211.6L424 211.6L432.7 238.5L441.4 238.5L450.1 238.5L458.9 238.5L467.6 238.5L476.3 238.5L485 238.5L493.7 238.5L502.4 238.5L511.1 292.4L519.9 319.3L528.6 319.3L537.3 319.3L546 319.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 66.8L66.7 66.8L75.4 66.8L84.1 66.8L92.9 66.8L101.6 66.8L110.3 66.8L119 66.8L127.7 66.8L136.4 66.8L145.1 94.6L153.9 94.6L162.6 94.6L171.3 122.3L180 122.3L188.7 122.3L197.4 122.3L206.1 122.3L214.9 122.3L223.6 122.3L232.3 122.3L241 122.3L249.7 122.3L258.4 122.3L267.1 122.3L275.9 122.3L284.6 122.3L293.3 122.3L302 122.3L310.7 122.3L319.4 122.3L328.1 122.3L336.9 122.3L345.6 150.1L354.3 177.8L363 177.8L371.7 177.8L380.4 177.8L389.1 177.8L397.9 205.5L406.6 205.5L415.3 205.5L424 205.5L432.7 233.3L441.4 233.3L450.1 233.3L458.9 233.3L467.6 233.3L476.3 233.3L485 233.3L493.7 233.3L502.4 233.3L511.1 288.8L519.9 316.5L528.6 316.5L537.3 316.5L546 316.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">k = 1 (Zurich)</text><line x1="184.8" x2="196.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="200.8" y="40" style="fill:var(--muted)">K = 1.03 (the paper’s HMI factor)</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The relative sunspot number the Sunspot counter gets from one synthetic white-light image that holds 15 spots in 9 groups, as the grouping distance is changed. The plateau is the paper’s R = 105. Our image, not the paper’s.</figcaption></figure>
<!-- /fig:grouping -->

| Grouping distance | Tool: g | Tool: s | Tool: R (k = 1) | Tool: R (K = 1.03) |
|---|---|---|---|---|
| 4° | 11 | 15 | 125 | 128.8 |
| 6° | 11 | 15 | 125 | 128.8 |
| **10° (default)** | **9** | **15** | **105** | **108.2** |
| 15° | 9 | 15 | 105 | 108.2 |
| 20° | 7 | 15 | 85 | 87.5 |
| 25° | 5 | 15 | 65 | 67.0 |

**Step 4: where an 85 % accuracy lands.** Figure 2 is the simple consequence of the formula. Get one group wrong and R moves by 10 k; get one spot wrong and it moves by 1. On the paper's example, miscounting a single group out of nine is a **9.5 % error in R**, which is the same size as the ~10 % discrepancy the paper quotes for earlier automatic methods. Miscounting a single spot out of fifteen is a 0.95 % error. An automatic counter can afford to be sloppy about spots and must not be sloppy about groups.

<!-- fig:errors -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Two straight lines showing that miscounting one group changes the relative sunspot number by 10, while miscounting one spot changes it by 1." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Why grouping, not spot finding, sets the error</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Why grouping, not spot finding, sets the error</text><line x1="58" x2="546" y1="206" y2="206" style="stroke:var(--line)"/><text x="52" y="210" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="154" y2="154" style="stroke:var(--line)"/><text x="52" y="158" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="102" y2="102" style="stroke:var(--line)"/><text x="52" y="106" text-anchor="end" style="fill:var(--muted)">120</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">140</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">-3</text><line x1="139.3" x2="139.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="139.3" y="249" text-anchor="middle" style="fill:var(--muted)">-2</text><line x1="220.7" x2="220.7" y1="232" y2="236" style="stroke:var(--muted)"/><text x="220.7" y="249" text-anchor="middle" style="fill:var(--muted)">-1</text><line x1="302" x2="302" y1="232" y2="236" style="stroke:var(--muted)"/><text x="302" y="249" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="383.3" x2="383.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="383.3" y="249" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="464.7" x2="464.7" y1="232" y2="236" style="stroke:var(--muted)"/><text x="464.7" y="249" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Miscount (groups or spots) away from the truth</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Relative sunspot number R</text><line x1="58" x2="546" y1="141" y2="141" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="136" text-anchor="end" style="fill:var(--muted)">R = 105</text><path d="M58 219L139.3 193L220.7 167L302 141L383.3 115L464.7 89L546 63" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 148.8L139.3 146.2L220.7 143.6L302 141L383.3 138.4L464.7 135.8L546 133.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">wrong by n groups</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">wrong by n spots</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. In R = k (10 g + s), one group counted wrongly moves R by 10, one spot by 1. This is why an automatic method is judged on its grouping.</figcaption></figure>
<!-- /fig:errors -->

| Check | Paper | Our tool result |
|---|---|---|
| Worked example, 14 January 2022 | 15 spots, 9 groups, R = 105 | g = 9, s = 15, **R = 105** from our synthetic image at the default 10° |
| HMI scaling factor applied | K = 1.03 | R = **108.2** |
| Cost of one grouping mistake | ~10 % quoted for earlier methods | **9.5 %** (105 → 95 or 115) |
| Cost of one spot mistake | not quoted | **0.95 %** (105 → 104 or 106) |
| Range over plausible grouping rules | one rule only (erosion, fixed element) | **65 to 125** for the same image, 2° to 30° |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/sunspot-grouping-hmi-automatic-relative-sunspot-number.mjs` in fibub's public code. It calls `findDisc`, `findSpots`, `groupSpots`, `wolfNumber` and `spotCount` from `src/lib/sci/sunspots.ts`, the maths behind the [[sunspot-counter]], and converts the page's "degrees on the Sun" to the chord the clustering uses exactly as the tool page does: link = 2 sin(degrees / 2), in units of the disc radius, measured in three dimensions on the sphere so that spots squeezed together near the limb are not merged too eagerly.

From the paper: the 9 groups, 15 spots and R = 105 of the 14 January 2022 example, and K = 1.03. **Our assumptions:** the spot positions, the umbra and penumbra sizes, the limb-darkening coefficient of 0.6, the 700-pixel image and the pixel noise. The image is **ours, not the paper's**, and nothing here is a reanalysis of SDO/HMI data.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs the sunspot checks:

- On the tool's own demo Sun, `findDisc` must put the disc centre within 1 pixel and the radius within 2 pixels of the planted values (304 px and 264 px), and grouping at 10° must give g = 3, s = 7 and R = 37 — the number the tool page shows for its example.
- A browser test in `tests/run.mjs` drives the live page: it reads "R = 37: 3 groups and 7 spots", taps the lone spot to get "R = 26: 2 groups and 6 spots", adds one by hand to get "R = 48: 4 groups and 8 spots", and with k = 0.6 checks the page prints "R = 0.6 × (10 × 4 + 8) = 28.8".
- New with this article, in `tests/sci-tools/sunspot-counter.mjs`: our synthetic Sun built to the paper's worked example must give 11 regions holding 15 umbrae, g = 9, s = 15 and R = 105 at 10°, R = 108.15 with K = 1.03, and the grouping plateau must run from 8.5° to 18°, with R = 125 at 4° and 65 at 25°.

## Check it yourself

On the [[sunspot-counter]] page you can repeat the group-sensitivity test in under a minute:

1. Press **Load the example**. The *Sunspot count* panel reads **R = 37: 3 groups and 7 spots**.
2. Leave *Spot sensitivity* on **normal** and *Group spots closer than* on **10° on the Sun**.
3. Type **1.03** into *Your k factor*, the paper's HMI value. R becomes **38.1**, and the panel spells the arithmetic out as 1.03 × (10 × 3 + 7).
4. Set *Group spots closer than* to **15° on the Sun**: on this well-separated example g stays 3, so R does not move. On a real image with a sprawling group it will.
5. Put *Your k factor* back to **1** and tap the lone spot near the limb to leave it out. The count drops to **R = 26: 2 groups and 6 spots** — one group gone is 10 points, one spot is 1.
6. Tap that spot again to bring it back (R = 37), then tap an empty part of the disc to add a spot by hand: it starts a group of its own, and the count goes to **R = 48: 4 groups and 8 spots**, a jump of 11, not 1.

## What researchers can use it for

- **Audit an automatic count**: run your own image through the tool at three grouping distances and quote the spread, not a single R, as the paper's 85.3 % accuracy implies you should.
- **Find your personal k factor**: count for a few months, then divide the international numbers by your own; the tool's k field applies it straight away.
- **Teach why R is not a spot count**: the "tap to remove a group" step makes the factor of ten obvious in a way no formula does.
- **Feed a cycle fit**: export the daily counts as CSV and model the rise of cycle 25 with the [[solar-cycle-fitter]] or the [[time-series-analyser]].
- **Work from FITS**: solar frames from a hydrogen-alpha or white-light rig open in the [[fits-viewer]] first, so you can check the exposure before counting.

## The fine print

- Our image is **synthetic**. It carries the paper's spot and group totals, not its pixels, and the detection step on real HMI data has to cope with plage, intensity gradients and dust that our image does not have.
- The tool groups by single-linkage distance on the sphere; the paper groups by morphological erosion. These are different rules and will disagree on borderline cases, which is the whole point of Figure 1.
- Heliographic positions need the Sun's P, B₀ and L₀ angles and a known image orientation. The tool reports positions relative to the disc centre only, so it cannot yet reproduce the paper's group coordinates.
- The international series applies its own observer weighting and a 13-month smoothing. A single-image R, from any pipeline, is not directly comparable to a published monthly number.
