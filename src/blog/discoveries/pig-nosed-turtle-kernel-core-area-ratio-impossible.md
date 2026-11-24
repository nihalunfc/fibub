---
title: "A core area that cannot be: checking kernel home ranges"
summary: "A 2025 study tracks pig-nosed turtles in a Papuan river and reports a 50 per cent core of 7.51 ha inside a 95 per cent range of 12.44 ha. No utilisation distribution can give that ratio, and the home range tool shows why."
tools: [home-range-analyser, distance-sampling, field-sampling-planner]
updated: 2026-11-24
sources:
  - "Sawaki, M. W. L., Kusrini, M. D., Prasetyo, L. B. and Manurung, R. (2025), Short-term movements of the Pig-Nosed Turtle (Carrettochelys insculpta) in the Kao River, South Papua, Indonesia, Jurnal Pengelolaan Sumberdaya Alam dan Lingkungan 15(4): 554, doi:10.29244/jpsl.15.3.554. Licence CC BY 4.0, checked on the Crossref record for the DOI, 2026-11-24. Values used here: six adult turtles (one male, five females) tracked over three days in November to December 2023 with low-cost GPS units; daily movements 84.95 to 648.77 m; mean home range 18.03 ha by minimum convex polygon, 7.51 ha for the 50 % kernel and 12.44 ha for the 95 % kernel; 76.16 ha of hotspot movement area."
  - "Methods: B. J. Worton (1989), Ecology 70: 164-168, for the fixed kernel home range and the reference bandwidth; C. O. Mohr (1947), American Midland Naturalist 37: 223-249, for the minimum convex polygon; the adehabitatHR package's definitions of mcp() and kernelUD() isopleths, which fibub's maths follows."
paper:
  title: "Short-term movements of the Pig-Nosed Turtle (Carrettochelys insculpta) in the Kao River, South Papua, Indonesia"
  authors: "Sawaki MWL, Kusrini MD, Prasetyo LB, Manurung R"
  journal: "Jurnal Pengelolaan Sumberdaya Alam dan Lingkungan"
  year: 2025
  doi: "10.29244/jpsl.15.3.554"
  url: "https://doi.org/10.29244/jpsl.15.3.554"
  licence: "CC BY 4.0"
  reviewed: true
---

The pig-nosed turtle, *Carettochelys insculpta*, lives in the rivers of southern New Guinea and northern Australia, and its eggs are collected faster than it can replace them. Knowing how far it moves is the first step in protecting it, so a 2025 study in the *Jurnal Pengelolaan Sumberdaya Alam dan Lingkungan* put low-cost GPS units on six adults in the Kao River, South Papua, and followed them for three days. It reports a mean **home range of 18.03 ha** from minimum convex polygons, with a **95 % kernel of 12.44 ha** and a **50 % core of 7.51 ha**. That last pair of numbers cannot both be right, and seeing why is a short lesson in what a kernel home range is. This article walks through it with the [[home-range-analyser]], the tool that works out both estimators. For the planning that comes before fieldwork, [[field-sampling-planner]] lays out where to look and [[distance-sampling]] turns sightings into densities.

## The paper in brief

Six adults (one male, five females) carried GPS units in November and December 2023. Daily movements ran from **84.95 m to 648.77 m**. The authors report three measures of space use per turtle and average them: the **minimum convex polygon** (MCP), the smallest convex shape that holds all the fixes; and the **50 % and 95 % kernel density** areas, which come from spreading a small bump of probability over each fix, adding the bumps into a smooth surface called a **utilisation distribution**, and then finding the smallest area that holds 50 % or 95 % of it. A hotspot analysis adds 76.16 ha of key movement area, linked to sandbanks and nearby forest.

The ecological message — these turtles use a few hectares of river and the sandbanks beside it, and three days of tracking already shows overlap between individuals — is useful and new for the region. It is the arithmetic of the two kernel areas that will not stand.

## Checked with the tools

**Step 1: a ceiling that every home range obeys.** Take any utilisation distribution at all. The 50 % area is the smallest region holding half the probability, so it is made of the densest ground; the 95 % area adds thinner ground around it. The average probability density inside the 50 % area is therefore at least as high as inside the 95 % area:

0.5 ÷ A₅₀ ≥ 0.95 ÷ A₉₅, which rearranges to **A₅₀ ÷ A₉₅ ≤ 0.5 ÷ 0.95 = 0.526**.

Equality needs a perfectly flat utilisation distribution — an animal equally likely to be anywhere inside a hard boundary, and nowhere outside it. Any real animal, and any kernel estimate of one, comes in below. The published areas give **7.51 ÷ 12.44 = 0.604**, which is above the ceiling. Whatever those two numbers are, they are not the 50 % and 95 % isopleths of one utilisation distribution.

**Step 2: what the ratio really looks like.** For a round normal utilisation distribution the areas follow A(p) ∝ −ln(1 − p), so the ratio is ln 2 ÷ ln 20 = **0.231**. We fed 400 fixes drawn from a normal cloud of 300 m standard deviation to the tool's maths: with the reference bandwidth (115 m) it gives a 95 % area of 217.50 ha, a 50 % area of 45.16 ha and a ratio of **0.208**, as expected (the kernel widens both areas, and the grid rounds the edges).

Real tracks are not round clouds, so we also simulated a three-day river track — a wandering line, which is the hardest shape for a kernel — and recomputed the ratio across 25 bandwidths, from a third of the reference value to nearly three times it. The ratio moves only between **0.239 and 0.316**. Narrow bandwidths push it up a little, because the core breaks into separate blobs along the channel; wide ones push it down. It never gets near 0.526.

<!-- fig:ratio -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="The ratio of the 50 per cent kernel area to the 95 per cent kernel area for a simulated three-day turtle track, over a wide range of bandwidths. It stays near 0.23 and never approaches the ceiling of 0.526 that any utilisation distribution obeys, let alone the published 0.604." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Core area ÷ home range, against bandwidth</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Core area ÷ home range, against bandwidth</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--line)"/><text x="52" y="258" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="190.6" y2="190.6" style="stroke:var(--line)"/><text x="52" y="194.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="127.1" y2="127.1" style="stroke:var(--line)"/><text x="52" y="131.1" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="63.7" y2="63.7" style="stroke:var(--line)"/><text x="52" y="67.7" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="145.5" x2="145.5" y1="254" y2="258" style="stroke:var(--muted)"/><text x="145.5" y="271" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="293.8" x2="293.8" y1="254" y2="258" style="stroke:var(--muted)"/><text x="293.8" y="271" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="442.2" x2="442.2" y1="254" y2="258" style="stroke:var(--muted)"/><text x="442.2" y="271" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Kernel bandwidth h (m)</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">50 % area ÷ 95 % area</text><line x1="58" x2="546" y1="62.5" y2="62.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="57.5" text-anchor="end" style="fill:var(--muted)">the paper: 0.604</text><line x1="58" x2="546" y1="87.1" y2="87.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="82.1" text-anchor="end" style="fill:var(--muted)">flat utilisation: 0.526, the ceiling</text><line x1="58" x2="546" y1="180.6" y2="180.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="175.6" text-anchor="end" style="fill:var(--muted)">normal utilisation: 0.231</text><path d="M58 153.8L78.8 154.4L98 155.9L118.8 158L139.6 160.1L160.3 162L179.6 163.7L200.4 165.3L221.2 166.8L240.4 168.1L261.2 169.4L282 170.6L301.3 171.5L322 172.5L342.8 173.4L363.6 174.1L382.8 174.8L403.6 175.4L424.4 176L443.7 176.4L464.4 176.9L485.2 177.3L504.5 177.6L525.2 177.9L546 178.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="292" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The 50 % kernel area divided by the 95 % kernel area, for a simulated three-day river track, over bandwidths from a third to nearly three times the reference value. The upper dashed line is the ceiling that holds for every utilisation distribution; the published pair of areas sits above it.</figcaption></figure>
<!-- /fig:ratio -->

**Step 3: which of the two published numbers is the odd one?** A clue sits in the MCP. A 95 % kernel is usually *larger* than the MCP for a short track, because the kernel spreads probability outside the fixes: in our simulated tracks, with the reference bandwidth, the 95 % kernel came out at 32 to 153 ha against MCPs of 3 to 15 ha. The paper's 95 % kernel (12.44 ha) is *smaller* than its MCP (18.03 ha), which happens only with a narrow bandwidth. At the narrowest bandwidth we tried (41 m) the tool gives a 95 % area of 18.07 ha and a 50 % area of 5.71 ha. So a small bandwidth can land a 95 % area near the published one; the matching core would then be about 5.7 ha, not 7.51. A 50 % core of 7.51 ha inside a 12.44 ha range would be 60 % of it, which is the shape of a flat plateau with a sharp edge, not of a kernel surface.

| Check | Paper | Tool |
|---|---|---|
| 50 % area ÷ 95 % area | 7.51 ÷ 12.44 = **0.604** | at most **0.526** for any utilisation distribution |
| Same ratio, normal utilisation | — | 0.231 in theory, **0.208** from 400 simulated fixes |
| Same ratio, simulated river track | — | **0.239 to 0.316** over 25 bandwidths |
| 95 % kernel against MCP | 12.44 ha against 18.03 ha | 95 % kernel larger than the MCP at the reference bandwidth; equal at about h = 41 m |

**Step 4: is the 18.03 ha polygon plausible?** Yes, at the fast end of the turtles' movement. We simulated three-day tracks with the same travel per day and measured the MCP with the tool: 0.8 ha at 100 m a day, 2.0 ha at 200 m, 8.9 ha at 350 m, 22.4 ha at 500 m and 30.3 ha at 650 m (four fixes a day; with hourly fixes, 0.5, 2.3, 11.8, 17.2 and 44.9 ha). A mean of 18 ha over three days needs turtles travelling roughly 450 to 500 m a day, near the top of the paper's own range, which fits a sample in which one animal moved 648.77 m a day.

<!-- fig:fixes -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Minimum convex polygon area of a simulated three-day river track against how far the turtle travels a day, at four and twenty-four fixes a day. Reaching 18 hectares in three days takes travel near the top of the range the paper reports." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How far must a turtle swim for 18 ha?</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How far must a turtle swim for 18 ha?</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="222.7" y2="222.7" style="stroke:var(--line)"/><text x="52" y="226.7" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="173.3" y2="173.3" style="stroke:var(--line)"/><text x="52" y="177.3" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="124" y2="124" style="stroke:var(--line)"/><text x="52" y="128" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="74.7" y2="74.7" style="stroke:var(--line)"/><text x="52" y="78.7" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="146.7" x2="146.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="146.7" y="289" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="235.5" x2="235.5" y1="272" y2="276" style="stroke:var(--muted)"/><text x="235.5" y="289" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="324.2" x2="324.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="324.2" y="289" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="412.9" x2="412.9" y1="272" y2="276" style="stroke:var(--muted)"/><text x="412.9" y="289" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="501.6" x2="501.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="501.6" y="289" text-anchor="middle" style="fill:var(--muted)">600</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Travel a day (m)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Minimum convex polygon (ha)</text><line x1="58" x2="546" y1="183.1" y2="183.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="178.1" text-anchor="end" style="fill:var(--muted)">the paper's mean MCP: 18.03 ha</text><path d="M58 268.2L146.7 262.2L279.8 227.9L412.9 161.5L546 122.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 269.4L146.7 260.7L279.8 213.7L412.9 187.2L546 50.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">4 fixes a day</text><line x1="177.6" x2="189.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="193.6" y="40" style="fill:var(--muted)">24 fixes a day</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Minimum convex polygon of a simulated three-day river track against how far the turtle moves a day, at two fix rates, with the paper's mean of 18.03 ha marked. A few fixes always give a smaller polygon than the same track sampled often.</figcaption></figure>
<!-- /fig:fixes -->

**Step 5: three days is three days.** Both estimators grow as you add fixes and as you track for longer, because a longer record finds more ground. In our simulation the same three-day track gave an MCP of 2.7 ha at one fix a day and 14.9 ha at eight fixes a day. An area from a short record is a **lower bound** on a home range, not an estimate of one, and it should be reported as "space used over three days" rather than as a home range. The paper is careful to call its data short-term; the numbers deserve the same care.

## How we made the graphs

Every number and both charts come from `scripts/blog-figures/pig-nosed-turtle-kernel-core-area-ratio-impossible.mjs` in fibub's public code. It calls, from `src/lib/sci/homerange.ts`, the maths behind the [[home-range-analyser]]:

- `project()` to turn latitude and longitude into metres, `mcp()` for the minimum convex polygon and its area, `steps()` for step lengths;
- `href()` for Worton's reference bandwidth √((var x + var y) ÷ 2) × n^(−1/6);
- `kde()` for the fixed kernel on a 200-cell grid, and `isopleth()` for the smallest area holding a given share of the density, which is where the 50 % and 95 % areas come from.

From the paper we took the three published areas, the six turtles, the three days and the 84.95 to 648.77 m range of daily movement. The tracks themselves are **simulated** and are **not the paper's data**, which is not published fix by fix: **our assumption** is a correlated random walk along a river channel with a turn of about 0.35 radians between fixes and step lengths spread over ±40 % of the average. The ceiling of 0.526 and the normal-case 0.231 are algebra, not simulation, and hold whatever the track looks like.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/home-range-analyser.mjs`, which pins the estimators against an independent Python check (shapely convex hulls on an azimuthal equidistant projection, a geodesic polygon area, a NumPy kernel density on a 600 × 600 grid) of 180 made-up collar fixes, plus the algebra of a single kernel:

- the 100 % minimum convex polygon must have 10 corners and an area of 2,323,684.83 m², both from shapely and from the geodesic area; the 95 % polygon must keep 171 of the 180 fixes and cover 1,817,149.63 m²;
- the reference bandwidth must be 194.45167 m, and the 50 % and 95 % kernel areas 866,196 and 3,152,023 m², as NumPy gives them;
- for a **single** fix the isopleths must match the exact formula 2πh²ln(1/(1 − p)), so the 50 % and 95 % areas are 2πh²ln2 and 2πh²ln20. Their ratio is ln 2 ÷ ln 20 = 0.231, the number this article leans on, checked against algebra rather than another program;
- the density must integrate to 1 over the grid, and mean step length (469.92179 m), longest step (1616.7897 m) and mean absolute turning angle (94.744911°) must match NumPy.

New with this article: the 13 fixes of the simulated turtle below must give a reference bandwidth of **177.32 m**, a minimum convex polygon of **18.885 ha**, a 95 % kernel of **128.97 ha**, a 50 % kernel of **35.475 ha** and a core ratio of **0.27506**, and that ratio must stay below the 0.5263 ceiling at bandwidths of 40, 100, 200 and 400 m (0.3043, 0.3006, 0.2691 and 0.2417).

## Check it yourself

On the [[home-range-analyser]] page:

1. Clear the *GPS fixes* box and paste these 13 fixes of one simulated turtle (time, latitude, longitude), three days at four fixes a day:

```
2023-11-26 12:00	-6.30000	139.60000
2023-11-26 18:00	-6.30001	139.60078
2023-11-27 00:00	-6.30001	139.60193
2023-11-27 06:00	-6.29899	139.60272
2023-11-27 12:00	-6.29825	139.60298
2023-11-27 18:00	-6.29757	139.60369
2023-11-28 00:00	-6.29695	139.60379
2023-11-28 06:00	-6.29655	139.60443
2023-11-28 12:00	-6.29579	139.60525
2023-11-28 18:00	-6.29546	139.60647
2023-11-29 00:00	-6.29543	139.60742
2023-11-29 06:00	-6.29562	139.60856
2023-11-29 12:00	-6.29601	139.60982
```

2. Leave *Kernel bandwidth* on **Reference (h ref)**, *Kernel grid* on **Normal (200 cells)** and *Area unit* on hectares.
3. Under *Home range* you should see a 100 % MCP of **18.89 ha**, a *Kernel 95 %* of **128.97 ha** and a *Kernel 50 %* of **35.48 ha**, with the bandwidth shown as **177 m**. Divide the last two: **0.275**, comfortably under the 0.526 ceiling.
4. Switch *Kernel bandwidth* to **Set it (metres)** and type **40** in *Bandwidth h (m)*. Both kernel areas shrink sharply, the 95 % one towards the size of the polygon, and the ratio rises only to **0.304**. Try 200 m and it is 0.269; at 400 m the areas balloon and the ratio falls to 0.242. No bandwidth produces 0.604.
5. Under *Movement*, the step list should show **12 steps** between **69 m** and **146 m**, about **1,347 m** of travel in three days: roughly 450 m a day, in the paper's range.
6. Press **Download summary (CSV)** to keep the areas and bandwidth for your notes.

## What researchers can use it for

- **Sanity-check published home ranges** in seconds: the 50 % area divided by the 95 % area must be below 0.526, and for most animals it lands between 0.15 and 0.35. Anything else means a different method, a different definition, or a slip.
- **Report the bandwidth.** Kernel areas are meaningless without it, as step 4 shows; the [[home-range-analyser]] prints the reference value and lets you fix your own.
- **Give MCP and kernel together.** When the 95 % kernel is far smaller than the MCP, the bandwidth is narrow; when it is far bigger, the record is short. Both are useful warnings.
- **Judge how long to track.** Simulate a track with your species' daily movement, thin it to the fix rate your tags can manage, and see how much the area is still growing before committing to a field season — then plan the fieldwork with [[field-sampling-planner]].
- **Separate space use from abundance.** A home range says where one animal goes; for how many there are, [[distance-sampling]] on transect sightings is the matching tool.

## The fine print

- The tracks here are **simulated**. We are not re-estimating the turtles' home ranges, which would need the published fixes.
- The 0.526 ceiling assumes the two areas come from the same utilisation distribution, as "50 % and 95 % kernel" implies. If the 7.51 ha were a core measured some other way — a hotspot patch, or a polygon around the densest fixes — the comparison would not apply, but it would also not be a 50 % kernel.
- Our simulation uses a two-dimensional wandering track. A turtle confined to a narrow channel is closer to one-dimensional, which lowers the ratio further, so the conclusion only gets stronger.
- Kernel areas also depend on the grid: a coarse grid rounds isopleth edges. We used the tool's normal 200-cell grid throughout, and refining it changes our ratios in the third decimal.
- We have not checked the paper's hotspot analysis, its habitat classes or its overlap between individuals.
