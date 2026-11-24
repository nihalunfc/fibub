---
title: "Canopy openness, gap fraction and LAI: do the three agree?"
summary: "A 2025 study follows a Turkish deciduous forest canopy through the year and reports openness, gap fraction, light transmission and LAI at each stage. Two of the four columns cannot describe the same photographs."
tools: [canopy-gap-analyser, leaf-area-analyser, spectral-index-calculator]
updated: 2026-11-24
sources:
  - "Öztürk, M., Biricik, T. and Ağlarcı, A. V. (2025), Intra-Annual Course of Canopy Parameters and Phenological Patterns for a Mixed and Diverse Deciduous Forest Ecosystem Along the Altitudinal Gradients Within a Dam Reservoir Landscape, Diversity 17(5): 331, doi:10.3390/d17050331. Licence CC BY 4.0, checked on the Crossref record for the DOI, 2026-11-24 (licence start 2025-05-04). Values used here, for five phenological stages in order (leafless, budburst, climax leaf period, senescence, next leafless): leaf area index 0.51, 0.89, 3.60, 1.38 and 0.50; canopy openness 65, 62, 9, 37 and 75 %; light transmission 64, 61, 9, 36 and 74 %; gap fraction 18, 14, 1, 8 and 14 %; ten altitudinal gradients and 21 field visits."
  - "Methods: J. B. Miller (1967), Australian Journal of Botany 15: 141-144, for LAI = 2 ∫ −ln T(θ) cos θ sin θ dθ; J. M. Welles and J. M. Norman (1991), Agronomy Journal 83: 818-825, for ring sums weighted by sin θ Δθ; N. Otsu (1979), IEEE Transactions on Systems, Man, and Cybernetics 9: 62-66, for the sky threshold."
paper:
  title: "Intra-Annual Course of Canopy Parameters and Phenological Patterns for a Mixed and Diverse Deciduous Forest Ecosystem Along the Altitudinal Gradients Within a Dam Reservoir Landscape"
  authors: "Öztürk M, Biricik T, Ağlarcı AV"
  journal: "Diversity"
  year: 2025
  doi: "10.3390/d17050331"
  url: "https://www.mdpi.com/1424-2818/17/5/331"
  licence: "CC BY 4.0"
  reviewed: true
---

Point a camera with a fisheye lens straight up in a forest and you get one picture that answers several questions at once: how much of the sky is open, how much light reaches the ground, and how much leaf is in the way. A 2025 paper in *Diversity* did this through a whole year in a mixed deciduous forest around a dam reservoir in Turkey, and reported four numbers for each stage of the canopy's year: **leaf area index**, **canopy openness**, **light transmission** and **gap fraction**. Those four are not independent — they all come out of the same pixels — so they can be checked against each other. This article does that with the [[canopy-gap-analyser]], which reads a fisheye photo the same way. For the leaf side of the story, [[leaf-area-analyser]] measures the leaves themselves, and [[spectral-index-calculator]] follows the same seasonal greening from satellite bands.

## The paper in brief

The authors photographed the canopy repeatedly over a year (21 field visits across ten altitudinal gradients) and summarised its year as five stages. Leaf area index, **LAI**, the area of leaf above each square metre of ground, runs 0.51 when the trees are bare, 0.89 at budburst, **3.60 at the climax of the leafy period**, 1.38 during senescence and back to 0.50 when the leaves have gone. Canopy openness follows the mirror image: 65, 62, **9**, 37 and 75 %. Light transmission tracks openness within a point: 64, 61, 9, 36 and 74 %. Gap fraction is reported as 18, 14, 1, 8 and 14 %.

The seasonal story is clean and is the paper's main result. It is the relationship between the four columns that a tool can test.

## Checked with the tools

Two definitions first. **Gap fraction** is the share of the sky hemisphere that is sky rather than canopy, counted straight off the picture. **Canopy openness** is the same thing with each pixel weighted by the slice of solid angle it stands for, which in an equidistant fisheye projection means a weight of sin θ ÷ θ. The two therefore have to be close. **Effective LAI** comes from Miller's formula, which turns the gap fraction in each ring of zenith angle into leaf area: LAI = 2 ∫ −ln T(θ) cos θ sin θ dθ.

**Step 1: openness and gap fraction are near-twins.** We built fisheye sky masks in which the gaps are spread evenly over the whole circle, at twelve levels from 90 % sky down to 2 %, and ran the tool's maths on each. Openness came out equal to gap fraction to **two decimal places** at every level: 65.00 % against 65.00 %, 18.00 % against 18.00 %, 9.00 % against 9.00 %. For the tool's own example photo, drawn as a real canopy with spherical leaves, they part a little: gap fraction **9.18 %** against openness **10.34 %**, because that canopy's gaps are commoner near the zenith, which the solid-angle weighting favours.

**Step 2: how far apart can they possibly be?** To put a limit on it, we built the two extreme masks for each gap fraction: all the sky packed into a disc around the zenith, and all of it packed into a ring at the horizon. Every real photograph lies between them.

| Gap fraction | Openness, sky at the horizon | Openness, sky at the zenith |
|---|---|---|
| 1 % | 0.8 % | 1.2 % |
| 8 % | 6.4 % | 9.7 % |
| 14 % | 11.4 % | 16.8 % |
| 18 % | 14.8 % | 21.4 % |
| 37 % | 31.8 % | 42.3 % |

The paper pairs a gap fraction of **18 %** with an openness of **65 %**, 14 % with 62 %, 1 % with 9 %, 8 % with 37 % and 14 % with 75 %. The largest openness that 18 % of sky can give is **21.4 %**. The two columns cannot come from the same photographs. Whatever the paper's "gap fraction" is — most likely gaps above some size, counted separately from the general sky seen between leaves — it is not the gap fraction that goes into Miller's formula, and a reader who treated it as one would get leaf areas three times too large.

<!-- fig:gap -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Canopy openness against gap fraction. The two curves are the extreme cases, all the sky packed around the zenith or all of it around the horizon; every real photograph lies between them. The paper five pairs lie far above both." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Openness and gap fraction cannot differ much</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Openness and gap fraction cannot differ much</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="216.5" y2="216.5" style="stroke:var(--line)"/><text x="52" y="220.5" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--line)"/><text x="52" y="165" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="105.5" y2="105.5" style="stroke:var(--line)"/><text x="52" y="109.5" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="272" y2="276" style="stroke:var(--muted)"/><text x="180" y="289" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="424" x2="424" y1="272" y2="276" style="stroke:var(--muted)"/><text x="424" y="289" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Gap fraction (%)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Canopy openness (%)</text><path d="M64.1 268.7L106.8 245.1L143.4 225.4L167.8 212.6L283.7 154.6L454.5 77.8L515.5 52.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M64.1 269.8L106.8 254.2L143.4 240.4L167.8 230.9L283.7 183.8L454.5 106.1L515.5 75.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="167.8" cy="91.6" r="4" style="fill:var(--ink);opacity:1"/><circle cx="143.4" cy="99.9" r="4" style="fill:var(--ink);opacity:1"/><circle cx="64.1" cy="247" r="4" style="fill:var(--ink);opacity:1"/><circle cx="106.8" cy="169.3" r="4" style="fill:var(--ink);opacity:1"/><circle cx="143.4" cy="63.9" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">All sky at the zenith</text><line x1="235.2" x2="247.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="251.2" y="40" style="fill:var(--muted)">All sky at the horizon</text><circle cx="424.6" cy="36" r="4" style="fill:var(--ink)"/><text x="435.6" y="40" style="fill:var(--muted)">The paper</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Canopy openness against gap fraction for masks in which all the sky is packed at the zenith (upper curve) or at the horizon (lower curve). Every real photograph lies between them, and the paper's five pairs lie far above both.</figcaption></figure>
<!-- /fig:gap -->

**Step 3: light transmission, on the other hand, fits.** Diffuse light reaching the floor under an overcast sky is close to openness, and the paper's transmission column is **exactly one point below openness** in four of the five stages (64 against 65, 61 against 62, 36 against 37, 74 against 75) and equal in the fifth. That column behaves.

**Step 4: does the LAI follow from the openness?** Only loosely, and that is worth knowing. For a mask with evenly spread gaps the tool returns LAI = k × (−ln openness), where k depends on how far out the rings reach: **1.004** for the whole hemisphere, **1.262** to 75° (the tool's and the LAI-2000's usual choice) and **1.502** to 60°, matching the integrals 1, 1.2588 and 1.5 exactly. On a real canopy the ring reach barely matters, because Miller's formula is built to be exact: the tool's example, drawn at LAI 2.5, comes back as **2.517, 2.511 and 2.314** for rings to 60°, 75° and 90°.

What changes between canopies is the ratio of LAI to −ln(openness). For the example canopy it is **1.11**. For the paper's five stages it is **1.18, 1.86, 1.50, 1.39 and 1.74**. So the paper's leaf areas are 1.2 to 1.9 times what an evenly gapped canopy of the same openness would give, which is the signature of sky concentrated overhead and dense cover towards the horizon: exactly what a closed deciduous stand on a slope looks like. The numbers are consistent with a real canopy; they simply cannot be recovered from openness alone, and no paper should be read as if they could.

<!-- fig:lai -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Effective leaf area index that the canopy tool returns for an evenly gapped fisheye photo, against its canopy openness, for rings reaching 60, 75 and 90 degrees of zenith angle. The five values the paper reports fall between the 75 and 60 degree curves." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Effective LAI against canopy openness</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Effective LAI against canopy openness</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="198" y2="198" style="stroke:var(--line)"/><text x="52" y="202" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="124" y2="124" style="stroke:var(--line)"/><text x="52" y="128" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="164.1" x2="164.1" y1="272" y2="276" style="stroke:var(--muted)"/><text x="164.1" y="289" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="270.2" x2="270.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="270.2" y="289" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="376.3" x2="376.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="376.3" y="289" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="482.3" x2="482.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="482.3" y="289" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Canopy openness (%)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Effective LAI</text><path d="M535.4 266.2L455.8 256L402.8 248.1L386.9 245.4L323.2 233.4L254.3 216.7L190.6 194.9L153.5 176.7L121.7 154.2L105.7 138.1L84.5 105.5L68.6 54.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M535.4 267.1L455.8 258.6L402.8 251.9L386.9 249.7L323.2 239.6L254.3 225.6L190.6 207.3L153.5 191.9L121.7 173L105.7 159.6L84.5 132.1L68.6 89.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M535.4 268.1L455.8 261.3L402.8 256L386.9 254.2L323.2 246.2L254.3 235.1L190.6 220.5L153.5 208.3L121.7 193.3L105.7 182.6L84.5 160.7L68.6 126.7" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="402.8" cy="253.1" r="4" style="fill:var(--ink);opacity:1"/><circle cx="386.9" cy="239.1" r="4" style="fill:var(--ink);opacity:1"/><circle cx="105.7" cy="138.8" r="4" style="fill:var(--ink);opacity:1"/><circle cx="254.3" cy="220.9" r="4" style="fill:var(--ink);opacity:1"/><circle cx="455.8" cy="253.5" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Rings to 60°</text><line x1="170.4" x2="182.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="186.4" y="40" style="fill:var(--muted)">Rings to 75°</text><line x1="282.8" x2="294.8" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="298.8" y="40" style="fill:var(--muted)">Rings to 90°</text><circle cx="400.2" cy="36" r="4" style="fill:var(--ink)"/><text x="411.2" y="40" style="fill:var(--muted)">The paper</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Effective LAI the Canopy gaps tool returns for a fisheye mask whose gaps are spread evenly over the sky, against that mask's canopy openness, for the three ring reaches the tool offers. The black dots are the five stages the paper reports: all five sit above the whole-hemisphere curve, which is what gaps concentrated overhead look like.</figcaption></figure>
<!-- /fig:lai -->

| Check | Paper | Tool |
|---|---|---|
| Openness against gap fraction, evenly spread gaps | 65 % against 18 % | identical to 2 decimals |
| Largest openness for 18 % sky | — | **21.4 %** (all sky at the zenith) |
| Light transmission against openness | 1 point below, four of five stages | as expected for diffuse light |
| LAI from openness, evenly gapped mask | 3.60 at 9 % openness | 2.42 (90°), 3.04 (75°), 3.62 (60°) |
| LAI ÷ −ln(openness) | 1.18 to 1.86 across stages | 1.11 for a spherical-leaf canopy at LAI 2.5 |
| Miller's formula on a known canopy | — | 2.5 drawn, **2.51** recovered |

## How we made the graphs

Every number and both charts come from `scripts/blog-figures/canopy-openness-gap-fraction-lai-phenology-miller-check.mjs` in fibub's public code. It calls, from `src/lib/sci/plantimg.ts`, the maths behind the [[canopy-gap-analyser]]:

- `hemi()`, which walks a sky mask, works out the gap fraction in each zenith ring, the whole-circle gap fraction, the solid-angle-weighted canopy openness and the effective LAI by Miller's formula with sin θ Δθ ring weights;
- `exampleFisheye()`, `channel()`, `histogram()`, `otsu()` and `threshold()`, which draw the tool's example canopy and separate sky from leaf exactly as the tool does with a real photo.

From the paper we took the four reported columns for the five stages. The masks are ours: **our assumptions** are the two idealised cases (gaps spread evenly, by a stable dither; and all the sky packed into one zenith band) on a 601-pixel circle of radius 300, and the example canopy drawn at LAI 2.5. **None of these are the paper's photographs**, which are not published; they are the reference cases that any real photograph must sit between.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/canopy-gap-analyser.mjs`, which pins the canopy maths against an independent NumPy version and against algebra:

- on a drawn canopy of spherical leaves at LAI 2.5, five rings to 75° must give an effective LAI of **2.5185439145**, a gap fraction of **0.09153051** and an openness of **0.10310332**, all matching NumPy to 1e-9, with ring gap fractions 0.28329, 0.2505, 0.2053, 0.12489 and 0.03831;
- nine rings to 90° on the same picture must give **2.3317377**, lower because the horizon rings are coarse;
- a canopy built so that every ring has exactly the gap fraction exp(−0.5 × 3 ÷ cos θ) must give LAI **3.00** back, whatever the rings: the test that Miller's formula is implemented right;
- an all-sky picture must give LAI 0 and openness 100 %, and a picture with no sky at all must be flagged rather than returning an infinite LAI.

New with this article: an evenly gapped mask must return openness equal to its gap fraction to within 1e-4, and its LAI must be 1.0040, 1.2625 and 1.5025 times −ln(openness) for rings reaching 90°, 75° and 60°; and a mask with 18 % of its area as sky must give an openness no higher than **0.2138** however the sky is placed.

## Check it yourself

The [[canopy-gap-analyser]] needs a photo, and it ships with one.

1. Open the tool and press **Use the example**. It draws a fisheye photo of a canopy with spherical leaves at LAI 2.5, finds the circle for you and picks the sky threshold by Otsu's method (it lands on 31 for this picture).
2. Leave *Zenith rings* at **5** and *Rings reach (zenith angle)* at **75° (LAI-2000 style)**. You should read a gap fraction of **9.18 %**, canopy openness **10.34 %** and effective LAI **2.51**, against the 2.5 the picture was drawn with.
3. The ring table should show gap fractions falling from **27.5 %** in the ring around the zenith to **3.9 %** in the outermost ring. That fall is what Miller's formula feeds on, and it is why one openness number cannot stand in for it.
4. Change *Rings reach* to **60°**: LAI barely moves, to **2.52**. Change it to **90° (whole hemisphere)** and it drops to **2.31**, because the last rings before the horizon are thin and noisy. This is the setting to state in any methods section.
5. Note that openness (10.34 %) is close to, but above, gap fraction (9.18 %), because this canopy's sky sits mostly overhead. The gap between the two is about a point, not fifty.
6. Press **Download rings (CSV)** to keep the per-ring gap fractions.

## What researchers can use it for

- **Check a canopy table for consistency** before using it: openness and gap fraction must agree within a few points, and light transmission should sit beside openness.
- **State the ring reach.** As step 4 shows, LAI from 90° rings is a few per cent below LAI from 60° rings on the same picture; readers cannot compare numbers without it.
- **Read your own hemispherical photos** in the browser with [[canopy-gap-analyser]], with the threshold, the circle and the rings all visible, instead of trusting a closed program.
- **Watch a canopy through a year** as this paper did, and use the LAI-to-openness ratio as a crude measure of how the gaps are arranged, not just how many there are.
- **Join the ground and the satellite:** the same seasonal curve shows up in vegetation indices, which [[spectral-index-calculator]] works out from band values.

## The fine print

- We did not analyse the paper's photographs, which are not published. Our masks are reference cases, chosen to bracket what any photograph can do.
- Our idealised "evenly spread gaps" canopy is not a real canopy; it is the case in which openness, gap fraction and −ln of either line up, which makes it a useful yardstick and nothing more.
- Effective LAI assumes leaves are spread at random. Real foliage is clumped, so effective LAI runs below true leaf area index, in this paper as in every hemispherical-photo study.
- The paper reports its values as stage summaries across ten altitudinal gradients; we treated each as a single number, as the abstract presents it.
- The gap fraction column may well be a size-threshold gap measure, which would be a legitimate quantity under a different name. Our point is only that it cannot be read as the gap fraction in Miller's formula.
