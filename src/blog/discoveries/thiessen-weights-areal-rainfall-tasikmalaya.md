---
title: "Thiessen weights for eight rain gauges, and what one missing gauge costs"
summary: "A 2025 study builds a monthly areal rainfall series for Tasikmalaya, Indonesia from eight rain gauges and Thiessen polygons. We recheck its weights and its areal mean, and measure what happens when a gauge drops out."
tools: [rain-gauge-average, runoff-calculator, flood-frequency]
updated: 2026-11-24
sources:
  - "Hamidi, M. R., Mukhaiyar, U., Sri Rezeki, E., Dianti, N. R. and Rohat, A. M. (2025), The Linear Combination of ARIMA Models in Constructing the Areal Rainfall Using Thiessen Polygon Weighted Method, ITM Web of Conferences 75: 04004, doi:10.1051/itmconf/20257504004. Licence: \"This is an Open Access article distributed under the terms of the Creative Commons Attribution License 4.0\", read in the article PDF on itm-conferences.org, checked 2026-11-24. Values used here: the eight station names, their monthly rainfall minimum, maximum, mean and standard deviation (Table 1); their Thiessen polygon areas in m² and weights (Table 4), total 2,699,916,716 m²; the areal rainfall series statistics (Table 5: mean 234.36 mm, standard deviation 145.54 mm, range 4.92 to 667.36 mm); and the areal AR(1) model coefficient 0.45035 (Equation 14)."
  - "Thiessen polygon (Voronoi) method for areal rainfall: Thiessen, A. H. (1911), Monthly Weather Review 39: 1082."
paper:
  title: "The Linear Combination of ARIMA Models in Constructing the Areal Rainfall Using Thiessen Polygon Weighted Method"
  authors: "Hamidi MR, Mukhaiyar U, Sri Rezeki E, Dianti NR, Rohat AM"
  journal: "ITM Web of Conferences"
  year: 2025
  doi: "10.1051/itmconf/20257504004"
  url: "https://www.itm-conferences.org/articles/itmconf/abs/2025/06/itmconf_iconmaa25_04004/itmconf_iconmaa25_04004.html"
  licence: "CC BY 4.0"
  reviewed: true
---

Rain gauges measure points; floods, reservoirs and crops answer to whole catchments. The usual bridge between the two is the **Thiessen polygon**: every part of the catchment is given to the nearest gauge, and each gauge's share of the area becomes its weight in the catchment average. A 2025 paper in *ITM Web of Conferences* builds a monthly rainfall series for the Tasikmalaya area of West Java from eight gauges that way, then models it with ARIMA. Because the paper prints its polygon areas, its weights and its station statistics, almost every step can be rechecked with fibub's [[rain-gauge-average]]. Carry the result forward into runoff with the [[runoff-calculator]] or into design storms with the [[flood-frequency]].

## The paper in brief

The authors take monthly rainfall from eight gauges around Tasikmalaya (Taraju, Gn. Satria, Singaparna, Kawalu, Cikunten, Karangnunggal, Cigede and Cimulu), fit an AR(1) model to each station, and build the catchment ("areal") series as the Thiessen-weighted sum of the eight. Their point is a statistical one: because each station follows an AR(1) process, the weighted sum is itself close to an AR(1) process, and the fitted areal model (coefficient 0.45035) sits comfortably inside the range of the eight station coefficients (0.278 to 0.550).

The station records differ a lot. Mean monthly rainfall runs from 182 mm at Singaparna to 298 mm at Cigede, and single months reach 1,077 mm at Karangnunggal. The polygons differ even more: Karangnunggal stands for 821 km² of the 2,700 km² total, while Cikunten stands for 52 km².

## Checked with the tools

Two different things can be checked here, and it is worth keeping them apart.

**First, the paper's own arithmetic, from its own numbers.** The eight polygon areas add to 2,699,916,716 m², exactly the total the paper states, and dividing each area by that total reproduces all eight published weights to within 5 × 10⁻⁶. The weights add to 1.00000. That sounds trivial, but a published weight table that does not close is a common and silent error, and this one closes perfectly.

Next, the areal mean. A Thiessen-weighted series built from complete records must have a mean equal to the weighted sum of the station means. That sum is **236.03 mm**; the paper's areal series has a mean of **234.36 mm**. The 1.67 mm gap (0.7 %) cannot come from the rounded weights, which would move the answer by less than 0.01 mm, so it is telling us that the station records are not all complete over the same months: whenever a station is missing, the weighted sum for that month is built from a different mix. That is normal in gauge networks and worth stating in a paper, because it is also the reason the series minimum (4.92 mm) is not zero even though five of the eight stations recorded a dry month.

The spread is informative too. If the eight stations varied independently, the weighted series would have a standard deviation of **77.3 mm**; if they moved in perfect lockstep, **172.6 mm**. The paper reports **145.54 mm**, which implies an average between-station correlation of about **0.64** — a convincing number for monsoon monthly rainfall over 2,700 km², and a quick sanity check on any areal series.

| Check | Paper | Recomputed here |
|---|---|---|
| Sum of the eight polygon areas | 2,699,916,716 m² | 2,699,916,716 m² (exact) |
| Eight Thiessen weights | 0.23582 … 0.30422 | area ÷ total, all within 5 × 10⁻⁶ |
| Mean of the areal series | 234.36 mm | 236.03 mm from the station means (0.7 % apart) |
| Thiessen mean versus plain average | not reported | 236.03 against 233.67 mm (2.4 mm) |
| Standard deviation of the areal series | 145.54 mm | 77.3 mm if independent, 172.6 if identical: implies r ≈ 0.64 |

**Second, the geometry the paper does not publish.** Gauge coordinates are not given, so the polygons cannot be redrawn from the paper alone. Instead we drew **our own** catchment outline with the same total area and searched for eight gauge positions (keeping them at least 9 km apart) whose Thiessen cells reproduce the paper's eight weights. The tool's maths does the cell clipping; a short pattern search moves the gauges. It lands within 5 × 10⁻⁵ of every published weight.

<!-- fig:map -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 330" role="img" aria-label="A made-up catchment of the same total area as the paper's, divided into eight Thiessen cells whose weights match the paper's eight gauge weights. Each cell is labelled with its gauge and weight." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:12px system-ui,sans-serif"><title>Thiessen cells of a demonstration catchment</title><path d="M283.3 268.5L350.0 224.0L392.0 140.0L364.0 56.0L323.1 35.6L301.7 59.0L258.3 218.0Z" style="fill:var(--c-tools);fill-opacity:.07;stroke:var(--line)"/><path d="M28.0 252.0L48.7 258.9L92.2 152.6L42.5 119.9L14.0 154.0Z" style="fill:var(--c-tools);fill-opacity:.07;stroke:var(--line)"/><path d="M117.2 53.4L84.0 70.0L42.5 119.9L92.2 152.6L129.0 139.7Z" style="fill:var(--c-tools);fill-opacity:.07;stroke:var(--line)"/><path d="M258.3 218.0L301.7 59.0L209.0 61.5L204.8 64.6L180.8 149.2Z" style="fill:var(--c-tools);fill-opacity:.07;stroke:var(--line)"/><path d="M217.0 18.5L182.0 21.0L158.2 32.9L204.8 64.6L209.0 61.5Z" style="fill:var(--c-tools);fill-opacity:.07;stroke:var(--line)"/><path d="M48.7 258.9L154.0 294.0L266.0 280.0L283.3 268.5L258.3 218.0L180.8 149.2L129.0 139.7L92.2 152.6Z" style="fill:var(--c-tools);fill-opacity:.07;stroke:var(--line)"/><path d="M158.2 32.9L117.2 53.4L129.0 139.7L180.8 149.2L204.8 64.6Z" style="fill:var(--c-tools);fill-opacity:.07;stroke:var(--line)"/><path d="M301.7 59.0L323.1 35.6L280.0 14.0L217.0 18.5L209.0 61.5Z" style="fill:var(--c-tools);fill-opacity:.07;stroke:var(--line)"/><path d="M28.0 252.0L154.0 294.0L266.0 280.0L350.0 224.0L392.0 140.0L364.0 56.0L280.0 14.0L182.0 21.0L84.0 70.0L14.0 154.0Z" style="fill:none;stroke:var(--ink);stroke-width:2"/><text x="324.6" y="143.0" text-anchor="middle" style="fill:var(--muted)">Taraju 23.6%</text><text x="45.1" y="187.5" text-anchor="middle" style="fill:var(--muted)">Gn. Satria 8.2%</text><text x="93.0" y="107.1" text-anchor="middle" style="fill:var(--muted)">Singaparna 6.4%</text><text x="230.9" y="110.5" text-anchor="middle" style="fill:var(--muted)">Kawalu 15.1%</text><text x="194.2" y="39.7" text-anchor="middle" style="fill:var(--muted)">Cikunten 1.9%</text><text x="176.5" y="220.1" text-anchor="middle" style="fill:var(--muted)">Karangnunggal 30.4%</text><text x="158.0" y="88.0" text-anchor="middle" style="fill:var(--muted)">Cigede 9.1%</text><text x="266.2" y="37.7" text-anchor="middle" style="fill:var(--muted)">Cimulu 5.3%</text><circle cx="335.8" cy="116.4" r="3.5" style="fill:var(--c-blog)"/><circle cx="19.0" cy="172.3" r="3.5" style="fill:var(--c-blog)"/><circle cx="81.3" cy="77.6" r="3.5" style="fill:var(--c-blog)"/><circle cx="243.1" cy="91.2" r="3.5" style="fill:var(--c-blog)"/><circle cx="190.0" cy="20.5" r="3.5" style="fill:var(--c-blog)"/><circle cx="130.6" cy="217.9" r="3.5" style="fill:var(--c-blog)"/><circle cx="158.3" cy="67.1" r="3.5" style="fill:var(--c-blog)"/><circle cx="241.4" cy="30.0" r="3.5" style="fill:var(--c-blog)"/><text x="14" y="324" style="fill:var(--muted)">Catchment 2700 km², eight gauges (our layout, not the paper's)</text><text class="fibub-mark" x="554" y="324" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. A demonstration catchment of the same total area as the paper’s (2,699.9 km²), with eight gauge positions chosen so that the Rain gauge average tool’s Thiessen weights reproduce the paper’s eight published weights to five decimal places. The outline and the positions are ours: the paper does not publish gauge coordinates.</figcaption></figure>
<!-- /fig:map -->

That layout is not unique, and it is certainly not the real one. What it buys us is a working copy of the paper's weighting that we can experiment on. The most useful experiment is the one every hydrologist meets: **a gauge fails**. The tool treats a missing reading by redrawing the polygons without that gauge, which is the right thing to do and not what a fixed weight table can do.

<!-- fig:drop -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 520 290" role="img" aria-label="For each of the eight gauges, the change in the catchment rainfall when that gauge is left out and the polygons are redrawn, against the gauge’s own weight. The largest shifts come from the two gauges whose readings are furthest from the catchment mean, not from the gauge with the largest area." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>A missing gauge: weight is not importance</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">A missing gauge: weight is not importance</text><line x1="58" x2="506" y1="187.5" y2="187.5" style="stroke:var(--line)"/><text x="52" y="191.5" text-anchor="end" style="fill:var(--muted)">-10</text><line x1="58" x2="506" y1="116.8" y2="116.8" style="stroke:var(--line)"/><text x="52" y="120.8" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="506" y1="46.1" y2="46.1" style="stroke:var(--line)"/><text x="52" y="50.1" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="58" y1="244" y2="248" style="stroke:var(--muted)"/><text x="58" y="261" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="189.8" x2="189.8" y1="244" y2="248" style="stroke:var(--muted)"/><text x="189.8" y="261" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="321.5" x2="321.5" y1="244" y2="248" style="stroke:var(--muted)"/><text x="321.5" y="261" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="453.3" x2="453.3" y1="244" y2="248" style="stroke:var(--muted)"/><text x="453.3" y="261" text-anchor="middle" style="fill:var(--muted)">0.3</text><line x1="58" x2="506" y1="244" y2="244" style="stroke:var(--muted)"/><text x="282" y="282" text-anchor="middle" style="fill:var(--ink)">Gauge's Thiessen weight</text><text transform="translate(14 138) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Change in areal rainfall (mm per month)</text><line x1="58" x2="506" y1="116.8" y2="116.8" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="502" y="111.8" text-anchor="end" style="fill:var(--muted)">all eight gauges</text><circle cx="368.7" cy="223.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="165.5" cy="118.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="142.3" cy="81" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="256.6" cy="53.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="83.6" cy="104.1" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="458.9" cy="80" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="177.9" cy="181.1" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="128.2" cy="142" r="4" style="fill:var(--c-blog);opacity:1"/><text class="fibub-mark" x="506" y="282" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same catchment with one gauge missing at a time. The tool redraws the polygons each time, so every weight changes; the shift in catchment rainfall depends on how wet the missing gauge was, not just on how much area it held.</figcaption></figure>
<!-- /fig:drop -->

With all eight gauges our copy gives 236.04 mm. Leaving one out:

| Gauge left out | Its weight | Catchment rainfall | Change |
|---|---|---|---|
| Taraju | 0.236 | 220.98 mm | −15.06 |
| Cigede | 0.091 | 226.94 mm | −9.10 |
| Cimulu | 0.053 | 232.47 mm | −3.56 |
| Gn. Satria | 0.082 | 235.82 mm | −0.22 |
| Cikunten | 0.019 | 237.84 mm | +1.80 |
| Singaparna | 0.064 | 241.10 mm | +5.06 |
| Karangnunggal | 0.304 | 241.25 mm | +5.21 |
| Kawalu | 0.151 | 244.98 mm | +8.95 |

The gauge with the largest area, Karangnunggal, is not the one that matters most: losing it moves the answer by 5.2 mm, while losing Taraju moves it by 15.1 mm, three times as much with three quarters of the area. What counts is the weight **times** how far that gauge's rainfall sits from the catchment mean, and then which neighbours inherit the orphaned area. Both parts are geometry, and both are what the tool works out for you.

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/thiessen-weights-areal-rainfall-tasikmalaya.mjs` in fibub's public code. It calls `cells`, `area` and `arealMean` from `src/lib/sci/thiessen.ts`, the maths behind the [[rain-gauge-average]]: `cells` clips the catchment polygon with the perpendicular bisector to every other gauge, `area` is the shoelace area, and `arealMean` drops gauges with no reading and redraws the rest.

The station statistics, polygon areas, weights and areal series statistics are the paper's stated values. The catchment outline, the eight gauge positions and the 9 km minimum spacing are **ours**; the readings used in the missing-gauge test are the paper's station mean monthly rainfalls, which stand in for one typical month.

## How we test the maths

The Thiessen maths is pinned in `tests/sci-tools/rain-gauge-average.mjs`, run by `tests/sci.mjs` on every change:

- A square catchment with four symmetric gauges must give four weights of exactly 0.25, and two gauges either side of a square must split it 50:50.
- A gauge outside the catchment must still own the part of the catchment nearest to it, and a gauge whose cell is entirely cut away must get weight 0.
- The weights must always add to 1 and the cells must tile the catchment: the sum of the cell areas equals the shoelace area of the boundary.
- New with this article: the eight areas of this paper must give its eight published weights to 5 × 10⁻⁶, and the published weights with the published station means must give an areal mean of 236.03 mm, 2.36 mm above the plain eight-station average.

## Check it yourself

On the [[rain-gauge-average]] page, you can repeat the missing-gauge test exactly:

1. Set *Coordinates* to **x and y in kilometres**.
2. In *Catchment boundary, one corner per row (x, y)*, paste our outline: **0, 0** / **23.368, -7.789** / **44.139, -5.193** / **59.718, 5.193** / **67.507, 20.771** / **62.314, 36.35** / **46.735, 44.139** / **28.561, 42.841** / **10.386, 33.753** / **-2.596, 18.175**.
3. In *Gauges: name (optional), x, y, then one or more rain columns*, paste one gauge per row: **Taraju, 57.09, 25.14, 285.6** / **Gn. Satria, -1.66, 14.79, 197.9** / **Singaparna, 9.89, 32.34, 181.9** / **Kawalu, 39.89, 29.83, 219.7** / **Cikunten, 30.05, 42.94, 199.0** / **Karangnunggal, 19.02, 6.32, 202.6** / **Cigede, 24.16, 34.29, 298.2** / **Cimulu, 39.58, 41.17, 284.4**.
4. The weights read **0.236, 0.082, 0.064, 0.151, 0.019, 0.304, 0.091, 0.053**, the catchment area about **2,700 km²**, and *Catchment rainfall* about **236 mm** against a plain average of **234 mm**.
5. Now delete Taraju's reading (leave the row, remove the last number) and watch the polygons redraw: the answer falls to about **221 mm**. Put it back and delete Kawalu's instead: it rises to about **245 mm**.
6. *Download weights and means (CSV)* if you want the areas and weights for a report.

## What researchers can use it for

- **Audit a published weight table** in a minute: do the areas add to the stated total, and does each weight equal its area over that total?
- **Check an areal series' mean** against the weighted sum of the station means. A gap means missing station-months, which belongs in the paper.
- **Plan for gauge failure.** Drop each gauge in turn and record the shift; the gauges with the biggest shifts are the ones to maintain first.
- **Decide whether Thiessen is worth it.** If the Thiessen mean and the plain average agree to a fraction of a per cent, as they nearly do here, the weighting is not what limits your model.
- **Feed catchment rainfall onward** to runoff with the [[runoff-calculator]], or to a return-period analysis with the [[flood-frequency]].

## The fine print

- The paper does not publish gauge coordinates, so our catchment and gauge positions are made up. They reproduce the published weights, but they are not the real network, and the real polygons would redistribute a missing gauge's area differently.
- The missing-gauge test uses each station's long-run mean as its reading, so the shifts shown are typical, not the shifts in any one month.
- Our between-station correlation of 0.64 is an average implied by the published standard deviations; it is not a measured correlation matrix.
- We did not check the ARIMA part of the paper. The [[trend-analyser]] can fit and test trends in a series, but the paper's AR(1) linear-combination argument is outside what a rainfall tool does.
- Thiessen weights assume rain gauges are equally good and that nearest-gauge is the best guess. In steep terrain a rainfall-elevation relation usually beats it.
