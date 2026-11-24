---
title: "Curve radius and operating speed on two-lane highways in India"
summary: "A 2024 study of 48 sites finds drivers' speed on highway curves rises with 1/√R up to about 600 m. We rebuild the model and work out the side friction it implies."
tools: [road-curve-design, stopping-distance, traffic-flow]
updated: 2026-11-24
sources:
  - "Tottadi, K. K. and Mehar, A. (2024), Influence of horizontal alignment elements on operating speed of vehicles on two-lane highways, Frontiers in Future Transportation 5: 1260051, doi:10.3389/ffutr.2024.1260051. Licence CC BY 4.0, checked on the Frontiers article page, 2026-11-24. Values used here: 48 sites (24 curves, 24 tangents) on two-lane rural highways in southern India; radii 98 to 672 m; curve lengths 80 to 473 m; degree of curvature 2.6° to 17.5°; mixed-traffic curve model V85 = 78.5 − 215.19/√R (R² 0.843); speed sensitive to radius up to about 600 m; tangent model V85 = 70.2 − 2.441 G."
  - "Design side friction 0.15 and superelevation of up to 7 % for plain and rolling terrain: Indian Roads Congress, IRC:73-1980, Geometric Design Standards for Rural (Non-Urban) Highways. Check the current edition for design work."
  - "Side friction f = v²/(gR) − e: the standard point-mass curve equation, for example AASHTO (2018), A Policy on Geometric Design of Highways and Streets, chapter 3."
paper:
  title: "Influence of horizontal alignment elements on operating speed of vehicles on two-lane highways"
  authors: "Tottadi KK, Mehar A"
  journal: "Frontiers in Future Transportation"
  year: 2024
  doi: "10.3389/ffutr.2024.1260051"
  url: "https://www.frontiersin.org/journals/future-transportation/articles/10.3389/ffutr.2024.1260051/full"
  licence: "CC BY 4.0"
  reviewed: true
---

Road designers choose a **design speed** and build curves to suit it, but drivers choose their own speed, and on many rural roads they drive curves faster than the design assumed. Engineers measure what drivers really do with the **operating speed** V85, the speed that 85 % of free-moving vehicles do not exceed. A 2024 study in *Frontiers in Future Transportation* measured it on 24 curves and 24 straights of two-lane highways in southern India, among cars, two-wheelers, auto-rickshaws, vans and trucks, and found that the curve radius explains most of the change in speed, through 1/√R, and stops mattering above about 600 m. We rebuilt the model with the [[road-curve-design]] tool's maths and asked a follow-up question it makes possible: how much **side friction** do drivers need at that speed? For the braking side of the same curve, use the [[stopping-distance|stopping distance tool]], and to see how speed and spacing set a road's capacity, the [[traffic-flow]] tool.

## The paper in brief

The authors filmed traffic at 48 sites on two-lane highways with 7 to 7.7 m carriageways and recorded the speed of free-moving vehicles, those not held up by the vehicle in front. On curves they tried radius, curve length, deflection angle and degree of curvature as explanations; on straights, the gradient.

For mixed traffic on curves the best model is **V85 = 78.5 − 215.19/√R**, with V85 in km/h and R in metres, explaining 84 % of the variation between curves (R² 0.843). Each vehicle type has its own version, with cars fastest and auto-rickshaws slowest. On straights the gradient matters most: **V85 = 70.2 − 2.441 G**, with G the gradient in percent. The authors conclude that operating speed is sensitive to radius up to about 600 m, so that is the range where geometry controls speed.

## Checked with the tools

The model is a single formula, so we **recomputed** it across the radii the paper studied, and then used the [[road-curve-design]] tool's maths to work out what those speeds mean for the curve. The paper does not state the curves' **superelevation** e, the cross-slope that tilts the road towards the inside of the bend, so we tried 4 % and 7 % (**our assumption**; 7 % is the usual upper limit for plain terrain in India).

**Step 1: where radius stops mattering.** Figure 1 draws the model. On the sharpest curve studied, 98 m, it gives **56.8 km/h**; on the gentlest, 672 m, **70.2 km/h**. The rate of change tells the story of the paper's 600 m claim. The slope of the model is 107.6/R^1.5 km/h per metre, so an extra 100 m of radius adds **11.1 km/h** at 98 m, **2.1 km/h** at 300 m, but only **0.73 km/h** at 600 m. Above 600 m, any change is smaller than the scatter in the measured speeds.

<!-- fig:speed -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 250" role="img" aria-label="The paper's mixed-traffic model rises from 56.8 km/h at 98 m to 70.2 km/h at 672 m; past 600 m another 100 m of radius adds only 0.73 km/h." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Operating speed on two-lane highway curves</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Operating speed on two-lane highway curves</text><line x1="58" x2="546" y1="204" y2="204" style="stroke:var(--line)"/><text x="52" y="208" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="169.6" y2="169.6" style="stroke:var(--line)"/><text x="52" y="173.6" text-anchor="end" style="fill:var(--muted)">55</text><line x1="58" x2="546" y1="135.2" y2="135.2" style="stroke:var(--line)"/><text x="52" y="139.2" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="100.8" y2="100.8" style="stroke:var(--line)"/><text x="52" y="104.8" text-anchor="end" style="fill:var(--muted)">65</text><line x1="58" x2="546" y1="66.4" y2="66.4" style="stroke:var(--line)"/><text x="52" y="70.4" text-anchor="end" style="fill:var(--muted)">70</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">75</text><line x1="58" x2="58" y1="204" y2="208" style="stroke:var(--muted)"/><text x="58" y="221" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="197.4" x2="197.4" y1="204" y2="208" style="stroke:var(--muted)"/><text x="197.4" y="221" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="336.9" x2="336.9" y1="204" y2="208" style="stroke:var(--muted)"/><text x="336.9" y="221" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="476.3" x2="476.3" y1="204" y2="208" style="stroke:var(--muted)"/><text x="476.3" y="221" text-anchor="middle" style="fill:var(--muted)">600</text><line x1="58" x2="546" y1="204" y2="204" style="stroke:var(--muted)"/><text x="302" y="242" text-anchor="middle" style="fill:var(--ink)">Curve radius R (m)</text><text transform="translate(14 118) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">V85 (km/h)</text><line x1="476.3" x2="476.3" y1="32" y2="204" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="480.3" y="44" text-anchor="start" style="fill:var(--muted)">600 m</text><path d="M126.3 157.5L133.3 150.4L139.6 144.8L146.5 139.3L153.5 134.4L160.5 130L166.8 126.5L173.7 122.8L180.7 119.5L187.7 116.5L193.9 113.9L200.9 111.3L207.9 108.9L214.2 106.9L221.1 104.7L228.1 102.7L235.1 100.8L241.3 99.2L248.3 97.5L255.3 95.9L262.3 94.4L268.5 93.1L275.5 91.7L282.5 90.4L288.8 89.3L295.7 88.1L302.7 87L309.7 85.9L315.9 84.9L322.9 83.9L329.9 82.9L336.9 81.9L343.1 81.1L350.1 80.2L357.1 79.4L364 78.6L370.3 77.9L377.3 77.1L384.3 76.4L390.5 75.7L397.5 75L404.5 74.3L411.5 73.7L417.7 73.1L424.7 72.5L431.7 71.8L438.6 71.3L444.9 70.7L451.9 70.2L458.9 69.6L465.1 69.2L472.1 68.7L479.1 68.2L486 67.6L492.3 67.2L499.3 66.7L506.3 66.3L513.2 65.8L519.5 65.4L526.5 65" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="126.3" cy="157.5" r="3.5" style="fill:var(--ink);opacity:1"/><circle cx="162.6" cy="128.8" r="3.5" style="fill:var(--ink);opacity:1"/><circle cx="197.4" cy="112.6" r="3.5" style="fill:var(--ink);opacity:1"/><circle cx="267.1" cy="93.4" r="3.5" style="fill:var(--ink);opacity:1"/><circle cx="336.9" cy="81.9" r="3.5" style="fill:var(--ink);opacity:1"/><circle cx="476.3" cy="68.4" r="3.5" style="fill:var(--ink);opacity:1"/><circle cx="526.5" cy="65" r="3.5" style="fill:var(--ink);opacity:1"/><text class="fibub-mark" x="546" y="242" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The paper's mixed-traffic operating-speed model across the radii it studied (98 to 672 m), with the points used in the text. The dashed line marks 600 m, where the paper says radius stops mattering.</figcaption></figure>
<!-- /fig:speed -->

**Step 2: the side friction drivers use.** A car going round a curve needs a sideways push of v²/R per kilogram. Part comes from the tilt of the road (e) and the rest from the tyres' grip, the **side friction** f = v²/(gR) − e. Indian design standards allow f = 0.15. At the modelled V85, a 98 m curve needs **0.189** with 7 % superelevation and **0.219** with 4 %, well above 0.15 (Figure 2). The demand falls below 0.15 only on curves wider than about **126 m** (with 7 %) or **155 m** (with 4 %). By 600 m, the tilt alone is almost enough (f −0.006 with 7 %).

<!-- fig:friction -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Side friction demand v²/(gR) − e at the modelled 85th-percentile speed. It passes the design value 0.15 below 126 m with 7 % superelevation and below 155 m with 4 %." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Side friction drivers need at their own speed</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Side friction drivers need at their own speed</text><line x1="58" x2="546" y1="201.7" y2="201.7" style="stroke:var(--line)"/><text x="52" y="205.7" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="141" y2="141" style="stroke:var(--line)"/><text x="52" y="145" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="80.3" y2="80.3" style="stroke:var(--line)"/><text x="52" y="84.3" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="197.4" x2="197.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="197.4" y="249" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="336.9" x2="336.9" y1="232" y2="236" style="stroke:var(--muted)"/><text x="336.9" y="249" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="476.3" x2="476.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="476.3" y="249" text-anchor="middle" style="fill:var(--muted)">600</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Curve radius R (m)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Side friction f</text><line x1="58" x2="546" y1="110.7" y2="110.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="105.7" text-anchor="end" style="fill:var(--muted)">design f 0.15</text><line x1="58" x2="546" y1="201.7" y2="201.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="145.8" x2="145.8" y1="50" y2="232" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="149.8" y="102" text-anchor="start" style="fill:var(--muted)">126 m</text><line x1="166.1" x2="166.1" y1="50" y2="232" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="170.1" y="118" text-anchor="start" style="fill:var(--muted)">155 m</text><path d="M126.3 69L133.3 78.3L139.6 85.9L146.5 93.3L153.5 100L160.5 106.1L166.8 111.1L173.7 116.1L180.7 120.8L187.7 125L193.9 128.5L200.9 132.1L207.9 135.5L214.2 138.3L221.1 141.3L228.1 144L235.1 146.6L241.3 148.7L248.3 151L255.3 153.1L262.3 155.1L268.5 156.8L275.5 158.7L282.5 160.4L288.8 161.9L295.7 163.4L302.7 164.9L309.7 166.3L315.9 167.5L322.9 168.8L329.9 170L336.9 171.2L343.1 172.2L350.1 173.3L357.1 174.3L364 175.3L370.3 176.2L377.3 177.1L384.3 178L390.5 178.8L397.5 179.6L404.5 180.4L411.5 181.2L417.7 181.9L424.7 182.6L431.7 183.3L438.6 184L444.9 184.6L451.9 185.2L458.9 185.8L465.1 186.4L472.1 186.9L479.1 187.5L486 188.1L492.3 188.6L499.3 189L506.3 189.5L513.2 190L519.5 190.5L526.5 190.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M126.3 87.2L133.3 96.5L139.6 104.1L146.5 111.5L153.5 118.3L160.5 124.3L166.8 129.3L173.7 134.3L180.7 139L187.7 143.2L193.9 146.7L200.9 150.3L207.9 153.7L214.2 156.5L221.1 159.5L228.1 162.2L235.1 164.8L241.3 166.9L248.3 169.2L255.3 171.3L262.3 173.3L268.5 175L275.5 176.9L282.5 178.6L288.8 180.1L295.7 181.6L302.7 183.1L309.7 184.5L315.9 185.7L322.9 187L329.9 188.2L336.9 189.4L343.1 190.4L350.1 191.5L357.1 192.5L364 193.5L370.3 194.4L377.3 195.3L384.3 196.2L390.5 197L397.5 197.8L404.5 198.6L411.5 199.4L417.7 200.1L424.7 200.8L431.7 201.5L438.6 202.2L444.9 202.8L451.9 203.4L458.9 204L465.1 204.6L472.1 205.1L479.1 205.7L486 206.3L492.3 206.8L499.3 207.2L506.3 207.7L513.2 208.2L519.5 208.7L526.5 209.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">e = 0.04</text><line x1="141.6" x2="153.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="157.6" y="40" style="fill:var(--muted)">e = 0.07</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Side friction needed to hold the curve at the modelled 85th-percentile speed, from the Road curve tool's v²/(gR) − e, for 4 % and 7 % superelevation (our assumptions; the paper does not give them). Dashed: a design side friction of 0.15.</figcaption></figure>
<!-- /fig:friction -->

Seen the other way, the tool's minimum radius for 56.8 km/h with e = 0.07 and f = 0.15 is **115.3 m**: the sharpest curves in the study are tighter than their own drivers' speed calls for. This does not mean they are unsafe (tyres on dry roads can give far more than 0.15, which is a comfort and wet-weather margin), but it shows why speed on sharp curves is where design and behaviour part ways.

**Step 3: a units check.** The paper gives degree of curvature as 2.6° to 17.5°. The tool states degree of curve on a 20 m arc: 1.71° for 672 m and 11.69° for 98 m. Multiplied by 1.5 for a 30 m arc, they become **2.56°** and **17.54°**, matching the paper's range. So the paper's degree of curvature is on a 30 m arc, worth knowing before comparing it with other studies.

| Check | Paper | Road curve maths |
|---|---|---|
| V85 on a 98 m and a 672 m curve | from the model | 56.8 and 70.2 km/h |
| Speed gained per 100 m of radius at 600 m | "sensitive up to 600 m" | 0.73 km/h (11.1 at 98 m) |
| Side friction at V85 on 98 m, e = 0.07 | not stated | 0.189 (design 0.15) |
| Radius where demand reaches 0.15, e = 0.07 | not stated | 126 m |
| Degree of curvature range | 2.6° to 17.5° | 2.56° to 17.54° (30 m arc) |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/two-lane-highway-curve-operating-speed-radius-side-friction-demand.mjs` in fibub's public code. It calls `frictionNeeded` (v²/(gR) − e), `minRadius` (v²/(g(e + f))) and `circularCurve` (curve elements and degree of curve) from `src/lib/sci/eng-road.ts`, the maths behind the [[road-curve-design]] tool.

The speed model, the radius range and the degree-of-curvature range come from the paper's text. The 4 % and 7 % superelevations are **our assumptions**, and the 0.15 design side friction comes from the Indian Roads Congress standard. Speeds come from the model, not from the paper's measured data.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/road-curve-design.mjs`, which checks the tool against an independent Python calculation:

- The minimum radius for 80 km/h with e = 0.06 and f = 0.14 must be 251.696 m, and the side friction needed on that radius must come back as exactly 0.14.
- A 300 m curve with a 40° deflection must have a tangent length of 109.191 m and a curve length of 209.440 m, and its setting-out deflections must match coordinates of points on the arc.
- New with this article: 56.8 km/h on a 98 m curve with 7 % superelevation must need side friction 0.1889, the minimum radius with f = 0.15 must be 115.35 m, and the degree of curve 11.69° per 20 m.

## Check it yourself

On the [[road-curve-design]] tool, in the *Horizontal curve* card:

1. Type *Design speed V (km/h)* **56.8**, the model's V85 for a 98 m curve.
2. Type *Superelevation e* **0.07**, *Side friction factor f* **0.15** and *Curve radius R (m)* **98**. Leave *Deflection angle Δ* at 40 and *PI chainage* at 1250.
3. The headline reads *Minimum radius* about **115.3 m**: R = 98 m is too tight.
4. *Side friction used at R* reads about **0.189**, more than the f = 0.15 you gave; *Curve length L* shows the degree of curve **11.69°** per 20 m.
5. Now type the model's speed for a 600 m curve, **69.7** km/h, and *Curve radius* **600**: the minimum radius drops well below 600 m and the side friction used is slightly below zero (**−0.006**), so the tilt alone holds the car.

## What researchers can use it for

- **Turn speed models into friction demand**: feed any V85 model through v²/(gR) − e to see which curves ask more of tyres than the design allows.
- **Check consistency between design speed and operating speed** on existing roads, curve by curve.
- **Sanity-check units in a paper**: degree of curvature on a 20 m, 30 m or 100 ft arc changes the numbers by large factors.
- **Plan treatments**: find the radius below which warning signs, extra superelevation or better surfacing are most needed.
- **Add the stopping side**: check sight distance round the same curve with the [[stopping-distance|stopping distance tool]].

## The fine print

- The paper does not give superelevation for its curves; our side friction values depend on the 4 % and 7 % we assumed.
- We used only the mixed-traffic curve model. The vehicle-type models in the paper use the same idea, but we could not confirm their exact form from the text.
- Speeds are from the fitted model, which has scatter (R² 0.843); single curves can differ by several km/h.
- The point-mass formula ignores vehicle roll, trucks' higher centre of gravity and the path drivers really take, which is usually flatter than the lane centre line.
