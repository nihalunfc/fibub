---
title: "Why a finer DEM does not always give better slopes: truncation error against noise"
summary: "A 2019 Earth Surface Dynamics paper finds a best grid spacing for slope and aspect (4 m for one lidar survey). We simulate the trade-off on a smooth hill with fibub's DEM terrain maths."
tools: [dem-terrain, watershed-delineation, cross-section-profile, infinite-slope]
updated: 2026-11-24
sources:
  - "Smith T, Rheinwalt A and Bookhagen B (2019), Determining the optimal grid resolution for topographic analysis on an airborne lidar dataset, Earth Surface Dynamics 7: 475-489, doi:10.5194/esurf-7-475-2019. Licence CC BY 4.0, checked on the Copernicus page and in Crossref (no correction or retraction listed), 2026-11-24. Values used from the text: the two error sources (truncation error and propagated elevation uncertainty), the synthetic grids of 11, 101 and 1001 cells per side, the lidar point density of about 10 points per square metre, and the best spacing of 4 m for the Santa Cruz Island lidar. The paper has no closed formula for the best spacing; it finds it by search."
  - "Slope and aspect by Horn (1981), Proceedings of the IEEE 69: 14-49, as in fibub's DEM terrain tool. Error from noise in a weighted 3 x 3 difference: standard propagation of variance."
  - "The hill (a Gaussian, 100 m high, spread 150 m), the noise levels, the grid spacings and the random draws are our own simulation. The paper's data and figures are not used."
paper:
  title: "Determining the optimal grid resolution for topographic analysis on an airborne lidar dataset"
  authors: "Smith T, Rheinwalt A, Bookhagen B"
  journal: "Earth Surface Dynamics"
  year: 2019
  doi: "10.5194/esurf-7-475-2019"
  url: "https://esurf.copernicus.org/articles/7/475/2019/"
  licence: "CC BY 4.0"
  reviewed: true
---

Surely a finer elevation model gives a better slope map? Not always. Slope comes from height differences between neighbouring cells. If the cells are big, the grid is too coarse a picture of the ground and the slope is smoothed. If the cells are small, tiny errors in the heights are divided by a tiny distance and the slope turns noisy. A 2019 paper in *Earth Surface Dynamics* names the two errors, **truncation error** and **propagated elevation uncertainty**, and searches for the grid spacing where together they are smallest: 4 m for an airborne lidar survey on Santa Cruz Island, California. We rebuild the idea on a smooth made-up hill, with the same slope maths as the [[dem-terrain]] tool, so you can see why the optimum exists and how it moves. The next steps usually go to [[watershed-delineation]] for flow paths, the [[cross-section-profile]] for profiles and the [[infinite-slope]] tool for landslide stability, all of which inherit the slopes you choose.

## The paper in brief

Slope and aspect (the direction a slope faces) are worked out from a gridded elevation model. The authors test several methods on smooth synthetic surfaces, where the true answer is known, with grids of 11, 101 and 1001 cells per side. They define a function for the truncation error and one for the propagated elevation uncertainty, and combine them into a quality measure. Then they apply it to airborne lidar over Santa Cruz Island, with about 10 points per square metre. The finest grid tested was 1 m. At 1 m they report a slope truncation error of 0.3 degrees and an uncertainty from the height noise of 5.5 degrees; at 4 m, 0.25 and 5 degrees. The best compromise for that dataset is a 4 m grid. They note that the error from noise grows about in proportion to the inverse of the grid spacing, and that no formula for the best spacing exists; you find it by looking for the maximum of the quality measure.

## Checked with the tools

We cannot use the paper's lidar, but we can check the logic. **Our assumptions:** a Gaussian hill 100 m high with a spread of 150 m on an 800 m square, Horn's 3 x 3 method (the one in the tool; the paper used simpler finite differences), random height noise with a standard deviation of 0.05 m or 0.15 m, mean errors over the interior cells, and three noise draws per spacing. The truth is the exact slope of the hill at each cell.

**Truncation error.** With no noise at all, the slope from the grid still differs from the true slope. Figure 1 shows how it grows with spacing: 0.0002 degrees at 1 m, 0.0163 degrees at 10 m, 0.426 degrees at 50 m and 1.68 degrees at 100 m. Doubling the spacing multiplies the error by about four, as expected for a method whose error scales as spacing squared.

**Noise error.** With noise, the spread of the slope falls as the cells grow. For noise of 0.05 m it is 1.18 degrees at 1 m, 0.118 degrees at 10 m and 0.013 degrees at 100 m: ten times the spacing, one tenth of the error. A pencil check: Horn's gradient is a weighted sum of six heights divided by 8 cell widths, so the noise in one component is sqrt(12) / 8 = 0.433 times the height noise over the spacing, in radians. That is 24.8 degrees times (noise / spacing), and the simulation gives 23.7. Close enough for a hill with gentle slopes and a mean over cells.

<!-- fig:errors -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Slope error in degrees against grid spacing from 1 to 100 metres for a smooth Gaussian hill. The truncation error rises with spacing; the error spread by random height noise of 0.05 and 0.15 metres falls with spacing." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Slope errors on a smooth hill: two sources, opposite trends</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Slope errors on a smooth hill: two sources, opposite trends</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="216.5" y2="216.5" style="stroke:var(--line)"/><text x="52" y="220.5" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--line)"/><text x="52" y="165" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="105.5" y2="105.5" style="stroke:var(--line)"/><text x="52" y="109.5" text-anchor="end" style="fill:var(--muted)">3</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="155.6" y="289" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="253.2" x2="253.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="253.2" y="289" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="350.8" x2="350.8" y1="272" y2="276" style="stroke:var(--muted)"/><text x="350.8" y="289" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="448.4" x2="448.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="448.4" y="289" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Grid spacing (m)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Slope error (degrees)</text><path d="M62.9 272L67.8 272L77.5 271.9L82.4 271.8L97 271.4L106.8 271.1L136.1 269.7L155.6 268.3L180 266.2L253.2 257L302 248.4L448.4 211.2L546 178.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M62.9 72.6L67.8 173.3L77.5 222.9L82.4 232.8L97 247.4L106.8 252L136.1 259.5L155.6 262.2L180 264.2L253.2 267.1L302 268.2L448.4 269.6L546 269.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M62.9 206.3L67.8 239.2L77.5 255.6L82.4 258.8L97 263.7L106.8 265.5L136.1 267.9L155.6 268.7L180 269.3L253.2 270.3L302 270.6L448.4 271.2L546 271.3" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Truncation error (grid too coarse)</text><line x1="328.8" x2="340.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="344.8" y="40" style="fill:var(--muted)">Noise 0.15 m</text><line x1="441.2" x2="453.2" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2"/><text x="457.2" y="40" style="fill:var(--muted)">Noise 0.05 m</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Mean slope error from Horn's method on a synthetic Gaussian hill (100 m high, spread 150 m): the error caused by the grid itself (truncation) and the spread caused by random height noise, at grid spacings from 1 to 100 m. Our own simulation with the DEM terrain tool's maths, not data from the paper.</figcaption></figure>
<!-- /fig:errors -->

**The best spacing.** Adding the two errors in quadrature (square root of the sum of squares), the total has a clear minimum (Figure 2). For noise of 0.05 m the best spacing in our grid of trials is 16 m with a combined error of 0.085 degrees. For noise of 0.15 m, three times as noisy, the best moves to 25 m (0.175 degrees). Cleaner heights allow a finer grid. In a rougher real landscape the truncation error rises faster, so the best spacing shrinks; this is why the paper's 4 m for a lidar-based DEM of rugged island terrain is much smaller than our 16 to 25 m for a smooth hill. The numbers are not comparable, only the shape is.

<!-- fig:best -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Combined slope error, the square root of the sum of the squares of truncation error and noise error, against grid spacing, with its minimum marked for two noise levels." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Total slope error has a minimum</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Total slope error has a minimum</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="216.5" y2="216.5" style="stroke:var(--line)"/><text x="52" y="220.5" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--line)"/><text x="52" y="165" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="105.5" y2="105.5" style="stroke:var(--line)"/><text x="52" y="109.5" text-anchor="end" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="155.6" y="289" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="253.2" x2="253.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="253.2" y="289" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="350.8" x2="350.8" y1="272" y2="276" style="stroke:var(--muted)"/><text x="350.8" y="289" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="448.4" x2="448.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="448.4" y="289" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Grid spacing (m)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Combined error (degrees)</text><line x1="136.1" x2="136.1" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="140.1" y="62" text-anchor="start" style="fill:var(--muted)">best 16 m (0.05 m noise)</text><line x1="180" x2="180" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="184" y="76" text-anchor="start" style="fill:var(--muted)">best 25 m (0.15 m noise)</text><path d="M62.9 -126.8L67.8 74.5L77.5 173.9L82.4 193.5L97 222.7L106.8 232L136.1 246.6L155.6 251.1L180 252.6L253.2 240.4L302 224.2L448.4 150.3L546 85.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M62.9 140.7L67.8 206.4L77.5 239.3L82.4 245.7L97 255.5L106.8 258.8L136.1 262.6L155.6 262.1L180 259.2L253.2 241.8L302 224.6L448.4 150.5L546 85.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Noise 0.15 m</text><line x1="170.4" x2="182.4" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="186.4" y="40" style="fill:var(--muted)">Noise 0.05 m</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The two errors combined as the square root of the sum of squares. Cleaner heights allow a finer grid: the best spacing moves from a larger to a smaller value as the noise falls. Our simulation.</figcaption></figure>
<!-- /fig:best -->

| Spacing (m) | Truncation error (deg) | Noise 0.05 m (deg) | Combined (deg) |
|---|---|---|---|
| 2 | 0.0006 | 0.591 | 0.591 |
| 5 | 0.0040 | 0.237 | 0.237 |
| 10 | 0.0163 | 0.118 | 0.119 |
| 16 | 0.0420 | 0.074 | 0.085 |
| 25 | 0.1039 | 0.049 | 0.115 |
| 50 | 0.4260 | 0.025 | 0.427 |
| 100 | 1.6816 | 0.013 | 1.682 |

| Quantity | Paper says | Our simulation gives |
|---|---|---|
| Truncation error | falls as the grid is refined | about 4 times larger each time the spacing doubles |
| Noise error | about 1 / spacing | 1.18, 0.59, 0.30 degrees at 1, 2, 4 m (halves each time) |
| Best spacing | exists; 4 m for the lidar | 16 m (noise 0.05 m) and 25 m (noise 0.15 m) for our hill |

## How we made the graphs

The script `scripts/blog-figures/dem-slope-truncation-error-vs-elevation-noise-optimal-grid-spacing-horn.mjs` builds a grid of the hill at each spacing and calls `derive(grid, 'slope')` from `src/lib/sci/dem.ts`, the slope maths behind the [[dem-terrain]] tool. The exact slope is from the hill's derivative. The idea of the two errors, the 10 points per square metre and the 4 m best spacing come from the paper's text. The hill, its size, the noise levels, the spacings (1 to 100 m), the seed and the three draws per point are **our assumptions**. We use Horn's method, the paper uses its own four-neighbour differences, so only the shapes of the curves should be compared. No data or figure from the paper is used.

## How we test the maths

`tests/sci.mjs` runs `tests/sci-tools/dem-terrain.mjs` on every change. It compares slope, aspect, hillshade and curvature on a 6 x 5 grid with a gap, on a geographic GeoTIFF at 45 degrees north and on an ASCII grid with independent NumPy code, and slope, aspect and curvature with xarray-spatial on 11,528 cells. For this article we added the slope of a plane rising 3 m per 10 m cell (16.699 degrees, 30 per cent, facing 270) and with 40 m cells (4.289 degrees), and a check that white noise of 0.05 m on flat 1 m cells gives a gradient of about 0.0306 (sqrt(2) x 0.433 x 0.05), the propagation-of-variance result above.

## Check it yourself

On the [[dem-terrain]] page, save this as `plane.asc` (a 5 x 5 grid whose height rises 3 m per cell towards the east):

```
ncols 5
nrows 5
xllcorner 0
yllcorner 0
cellsize 10
NODATA_value -9999
100 103 106 109 112
100 103 106 109 112
100 103 106 109 112
100 103 106 109 112
100 103 106 109 112
```

1. Press **Open a DEM** and choose the file. Leave *Cell size unit* on **From the file** and *Elevation unit* on **metres**.
2. Choose **Slope** with *Slope as* **degrees**, then tap the middle cell. You should read about **16.70 degrees**; with **percent** it is **30.0**.
3. Choose **Aspect** and tap the same cell: **270** (the ground faces west, because it rises to the east).
4. Change the file's `cellsize` to **40** and open it again: the slope falls to about **4.29 degrees**. The same heights on bigger cells are gentler. That is why a wrong cell-size unit gives wrong slopes.

## What researchers can use it for

- **Choosing a resolution:** before resampling a lidar DEM, estimate the noise from flat roads or water and use the propagation rule (error about 24 degrees times noise / spacing) to see where noise overtakes smoothing.
- **Comparing studies:** two papers using different grid spacings will report different mean slopes; knowing the direction of the bias makes the comparison fair.
- **Landslide and erosion work:** slope thresholds in the [[infinite-slope]] tool are only as good as the DEM slopes behind them.
- **Teaching:** a smooth hill, a spacing and a noise level are enough to show a student why more detail is not always more truth.

## The fine print

- Our hill is smooth and our noise is white (uncorrelated). Real lidar noise is partly correlated and depends on vegetation and scan angle; real terrain has roughness at every scale.
- Horn's method already smooths a little. Methods with four neighbours or larger windows give different numbers.
- The best spacing we find (16 to 25 m) belongs to our hill and our noise levels. It says nothing about the 4 m the authors found for their dataset.
- Spacings are the cells of the DEM, not the density of the points that made it; sampling density and interpolation add their own error, which we leave out.
