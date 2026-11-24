---
title: "A Fried parameter of 3.1 cm in arcseconds: daytime seeing at Huairou"
summary: "A 2026 paper models 85 years of daytime turbulence over a Chinese solar observatory. We turn its Fried parameters into the star widths a camera would measure, with fibub's star FWHM checker."
tools: [star-fwhm-checker, telescope-calculator, fits-viewer]
updated: 2026-11-24
sources:
  - "Shikhovtsev AY (2026), Day-Time Seeing Changes at the Huairou Solar Observing Station Site, Universe 12(1): 11, doi:10.3390/universe12010011. Licence CC BY 4.0, checked on the Crossref record and the MDPI article page, 2026-11-24; no retraction or correction is recorded. Values used here: site at 40°20′ N, 116°30′ E; median Fried parameter 3.13 cm for total cloud cover ≤ 0.5 and 4.18 cm for ≤ 0.2; about 12 % seasonal peak-to-valley change in the modelled r₀; surface-layer Cn² about 20 % lower in January and about 40 % lower in July when 2000-2025 is compared with 1940-1969; calibration against the 600 mm Large Solar Vacuum Telescope; boundary-layer height rising about 27 m per decade in July; July cloud cover falling 0.015 per decade."
  - "Seeing from the Fried parameter, FWHM = 0.98 λ/r₀, and r₀ ∝ (∫Cn² dh)^(−3/5): Fried, D. L. (1966), J. Opt. Soc. Am. 56: 1372; Roddier, F. (1981), Progress in Optics 19: 281."
  - "Moffat star profile: Moffat, A. F. J. (1969), Astronomy and Astrophysics 3: 455."
paper:
  title: "Day-Time Seeing Changes at the Huairou Solar Observing Station Site"
  authors: "Shikhovtsev AY"
  journal: "Universe"
  year: 2026
  doi: "10.3390/universe12010011"
  url: "https://www.mdpi.com/2218-1997/12/1/11"
  licence: "CC BY 4.0"
  reviewed: true
---

Site papers talk about the **Fried parameter**, written r₀: the width of a patch of sky over which the air is still nearly undisturbed. Observers talk about **seeing**: how wide a star or a sunspot edge looks in the finished image. They are the same fact in two languages, and the translation is one line of arithmetic. A 2026 paper in *Universe* models 85 years of daytime turbulence above the Huairou Solar Observing Station near Beijing and reports median Fried parameters of **3.13 cm** and **4.18 cm**. This article turns those into arcseconds, then shows the [[star-fwhm-checker]] measuring exactly that width back out of simulated star images, so you can tell whether your own camera could even see the difference. For the optics side of the same question, see the [[telescope-calculator]] and [[fits-viewer]].

## The paper in brief

The author does not point a seeing monitor at the sky. Instead he reconstructs the **optical turbulence** profile, Cn²(h), above the station from ERA-5 atmospheric reanalysis for 1940 to 2025, calibrated against differential image motion from the 600 mm Large Solar Vacuum Telescope and against monochrome solar images from Huairou itself. From the modelled profiles he integrates the Fried parameter for daytime hours.

The headline numbers: the median daytime r₀ is **3.13 cm** when total cloud cover is at most 0.5, and **4.18 cm** on the clearest days (cover at most 0.2), with a seasonal peak-to-valley swing of about **12 %**. Over the decades, surface-layer turbulence has weakened: Cn² near the ground is about **20 % lower in January** and about **40 % lower in July** for 2000-2025 than for 1940-1969, while turbulence higher up has strengthened a little. The daytime boundary layer is getting deeper (about **27 m per decade** in July) and July cloud cover is falling (**0.015 per decade**). The paper's conclusion is that the air immediately above this site has been getting optically quieter.

## Checked with the tools

Everything here is a **recomputation** from the paper's stated values, plus **simulated** star images. We have none of the author's profiles or images.

**Step 1: from centimetres to arcseconds.** Long-exposure seeing is FWHM = 0.98 λ/r₀. At 500 nm, the paper's two medians become:

| Paper's value | Condition | Seeing at 500 nm | Seeing at 1.2 µm |
|---|---|---|---|
| r₀ = 3.13 cm | cloud cover ≤ 0.5 | **3.23″** | 2.71″ |
| r₀ = 4.18 cm | cloud cover ≤ 0.2 | **2.42″** | 2.03″ |

(The infrared column scales r₀ itself as λ^1.2, so the width falls only as λ^−0.2.) For scale, 1″ seeing needs r₀ = 10.1 cm and 2″ needs 5.1 cm. Huairou's daytime air is a long way from either: that is normal for a low-altitude continental site observing the Sun, when the ground is heating the first few hundred metres of air all day.

**Step 2: what that means for the 600 mm telescope.** The telescope the author calibrates against is 600 mm across, which is **19.2 times r₀** on a median day and **14.4 times** on a clear one. Its diffraction limit at 500 nm is 0.21″, so the atmosphere is throwing away a factor of about 15 in resolution, and a speckle or adaptive-optics correction has roughly 19² ≈ 370 cells of wavefront to fix. This is the number that decides whether a solar telescope needs adaptive optics, and it comes straight from the paper's r₀.

**Step 3: the star shape behind each number.** A seeing-limited star follows a Moffat profile, brightness ∝ (1 + (r/α)²)^−β. With β = 3.5 (**our assumption**, a typical seeing value), the paper's median seeing of 3.23″ means α = 3.45″; feeding that back through the checker's `moffatFwhm` returns 3.23″, which is the round trip the tool does on every star it measures. Figure 1 draws both medians: the clear-sky median is a quarter narrower.

<!-- fig:profiles -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Moffat profiles (beta 3.5) for the paper's two median Fried parameters, converted to seeing at 500 nm: 3.23 and 2.42 arcsec full width at half maximum." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Huairou's two median nights, as a star would look</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Huairou's two median nights, as a star would look</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="188.7" y2="188.7" style="stroke:var(--line)"/><text x="52" y="192.7" text-anchor="end" style="fill:var(--muted)">0.25</text><line x1="58" x2="546" y1="145.3" y2="145.3" style="stroke:var(--line)"/><text x="52" y="149.3" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="102" y2="102" style="stroke:var(--line)"/><text x="52" y="106" text-anchor="end" style="fill:var(--muted)">0.75</text><line x1="58" x2="546" y1="58.7" y2="58.7" style="stroke:var(--line)"/><text x="52" y="62.7" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="155.6" y="249" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="253.2" x2="253.2" y1="232" y2="236" style="stroke:var(--muted)"/><text x="253.2" y="249" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="350.8" x2="350.8" y1="232" y2="236" style="stroke:var(--muted)"/><text x="350.8" y="249" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="448.4" x2="448.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="448.4" y="249" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Radius from the star centre (″)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Relative brightness</text><line x1="58" x2="546" y1="145.3" y2="145.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="140.3" text-anchor="end" style="fill:var(--muted)">half maximum</text><path d="M58 58.7L62.9 58.8L67.8 59.2L72.6 59.8L77.5 60.7L82.4 61.8L87.3 63.2L92.2 64.8L97 66.6L101.9 68.6L106.8 70.8L111.7 73.2L116.6 75.8L121.4 78.6L126.3 81.5L131.2 84.5L136.1 87.7L141 91L145.8 94.3L150.7 97.8L155.6 101.3L160.5 104.9L165.4 108.5L170.2 112.1L175.1 115.8L180 119.4L184.9 123.1L189.8 126.7L194.6 130.3L199.5 133.9L204.4 137.4L209.3 140.9L214.2 144.3L219 147.7L223.9 151L228.8 154.2L233.7 157.4L238.6 160.4L243.4 163.4L248.3 166.3L253.2 169.1L258.1 171.9L263 174.5L267.8 177L272.7 179.5L277.6 181.9L282.5 184.1L287.4 186.3L292.2 188.5L297.1 190.5L302 192.4L306.9 194.3L311.8 196.1L316.6 197.8L321.5 199.4L326.4 201L331.3 202.5L336.2 203.9L341 205.3L345.9 206.6L350.8 207.9L355.7 209L360.6 210.2L365.4 211.2L370.3 212.3L375.2 213.2L380.1 214.2L385 215L389.8 215.9L394.7 216.7L399.6 217.4L404.5 218.2L409.4 218.8L414.2 219.5L419.1 220.1L424 220.7L428.9 221.3L433.8 221.8L438.6 222.3L443.5 222.8L448.4 223.2L453.3 223.6L458.2 224L463 224.4L467.9 224.8L472.8 225.2L477.7 225.5L482.6 225.8L487.4 226.1L492.3 226.4L497.2 226.6L502.1 226.9L507 227.1L511.8 227.4L516.7 227.6L521.6 227.8L526.5 228L531.4 228.2L536.2 228.4L541.1 228.5L546 228.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 58.7L62.9 58.9L67.8 59.6L72.6 60.7L77.5 62.3L82.4 64.2L87.3 66.6L92.2 69.4L97 72.5L101.9 75.9L106.8 79.6L111.7 83.6L116.6 87.8L121.4 92.2L126.3 96.7L131.2 101.4L136.1 106.2L141 111L145.8 115.9L150.7 120.8L155.6 125.7L160.5 130.5L165.4 135.3L170.2 139.9L175.1 144.5L180 149L184.9 153.3L189.8 157.6L194.6 161.6L199.5 165.5L204.4 169.3L209.3 172.9L214.2 176.4L219 179.7L223.9 182.8L228.8 185.8L233.7 188.6L238.6 191.3L243.4 193.8L248.3 196.2L253.2 198.5L258.1 200.6L263 202.6L267.8 204.5L272.7 206.3L277.6 208L282.5 209.5L287.4 211L292.2 212.4L297.1 213.6L302 214.8L306.9 216L311.8 217L316.6 218L321.5 218.9L326.4 219.8L331.3 220.6L336.2 221.3L341 222L345.9 222.7L350.8 223.3L355.7 223.8L360.6 224.4L365.4 224.9L370.3 225.3L375.2 225.7L380.1 226.1L385 226.5L389.8 226.9L394.7 227.2L399.6 227.5L404.5 227.8L409.4 228L414.2 228.3L419.1 228.5L424 228.7L428.9 228.9L433.8 229.1L438.6 229.3L443.5 229.5L448.4 229.6L453.3 229.7L458.2 229.9L463 230L467.9 230.1L472.8 230.2L477.7 230.3L482.6 230.4L487.4 230.5L492.3 230.6L497.2 230.7L502.1 230.8L507 230.8L511.8 230.9L516.7 231L521.6 231L526.5 231.1L531.4 231.1L536.2 231.2L541.1 231.2L546 231.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">r₀ 3.13 cm: 3.23″</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">r₀ 4.18 cm: 2.42″</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The star shape behind each of the paper's two median Fried parameters, at 500 nm. The clear-sky median (r₀ = 4.18 cm) is a quarter narrower than the all-sky one.</figcaption></figure>
<!-- /fig:profiles -->

**Step 4: could your camera measure it?** We built fields of 24 identical Moffat stars at seven seeing values, added sky and photon noise, and let the Star FWHM checker's own star finder and fitter measure them (Figure 2). At **0.5″ per pixel** the tool returns the input seeing to within 0.1 % at every width, so a 0.8″ change between a median and a clear day is easily measurable. At **1.5″ per pixel** it is still within 1 % for anything 3″ or wider, but at 1.5″ seeing — one pixel across the whole star — it reads **24 % too wide** and pushes the fitted β up to 7, the fitter's way of saying "this star is not resolved".

<!-- fig:recover -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Measured against true seeing for simulated Moffat star fields at 0.5 and 1.5 arcsec per pixel. The fine sampling recovers the input within about one per cent; the coarse one reads a little wide." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>What the checker gives back from simulated stars</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">What the checker gives back from simulated stars</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="207.1" y2="207.1" style="stroke:var(--line)"/><text x="52" y="211.1" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="162.2" y2="162.2" style="stroke:var(--line)"/><text x="52" y="166.2" text-anchor="end" style="fill:var(--muted)">3</text><line x1="58" x2="546" y1="117.3" y2="117.3" style="stroke:var(--line)"/><text x="52" y="121.3" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="72.4" y2="72.4" style="stroke:var(--line)"/><text x="52" y="76.4" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="166.4" x2="166.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="166.4" y="269" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="274.9" x2="274.9" y1="252" y2="256" style="stroke:var(--muted)"/><text x="274.9" y="269" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="383.3" x2="383.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="383.3" y="269" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="491.8" x2="491.8" y1="252" y2="256" style="stroke:var(--muted)"/><text x="491.8" y="269" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">True seeing FWHM (″)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Measured FWHM (″)</text><line x1="299.8" x2="299.8" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="303.8" y="62" text-anchor="start" style="fill:var(--muted)">3.23″</text><line x1="212" x2="212" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="208" y="76" text-anchor="end" style="fill:var(--muted)">2.42″</text><circle cx="112.2" cy="229.6" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="166.4" cy="207.1" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="212" cy="188.2" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="274.9" cy="162.2" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="299.8" cy="151.9" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="383.3" cy="117.3" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="491.8" cy="72.4" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="112.2" cy="213.6" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="166.4" cy="202.8" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="212" cy="184.2" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="274.9" cy="161.3" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="299.8" cy="151.3" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="383.3" cy="117.4" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="491.8" cy="72.5" r="3.4" style="fill:var(--c-tools);opacity:1"/><path d="M58 252L546 50" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">0.5″ per pixel</text><circle cx="189.8" cy="36" r="4" style="fill:var(--c-tools)"/><text x="200.8" y="40" style="fill:var(--muted)">1.5″ per pixel</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Simulated fields of Moffat stars, measured by the Star FWHM checker's own maths. Dots on the dashed line mean the measurement returns the seeing it was given. Simulated stars, not the paper's images.</figcaption></figure>
<!-- /fig:recover -->

| Check | Tool result (simulated stars) |
|---|---|
| Input 3.23″ at 0.5″/px | 3.231″ measured, HFR 1.93″, β 3.51 |
| Input 2.42″ at 0.5″/px | 2.422″ measured, HFR 1.46″, β 3.49 |
| Input 3.23″ at 1.5″/px | 3.243″ measured (+0.4 %) |
| Input 1.5″ at 1.5″/px | 1.856″ measured (+23.7 %), β 7.2 |

**Step 5: how much seeing did the last 80 years buy?** Because r₀ goes as the turbulence integral to the power −3/5, a fall in Cn² improves the seeing by less than you would guess. Taking the paper's surface-layer falls as if they applied to the whole integral (**our assumption** — the paper reports turbulence *rising* at some upper levels, so this is an upper bound):

| Fall in Cn² | r₀ from 3.13 cm | Seeing from 3.23″ | Improvement |
|---|---|---|---|
| 10 % | 3.33 cm | 3.03″ | 6.1 % |
| 20 % (the January figure) | 3.58 cm | 2.82″ | 12.5 % |
| 40 % (the July figure) | 4.25 cm | 2.38″ | 26.4 % |

So the paper's "20 % less turbulence" is worth about **0.4″** of star width, and the 12 % seasonal swing in r₀ is worth about **0.35″**. Both are far larger than the 0.01″ the checker's fit can resolve on a well-sampled image, which is the useful conclusion for anyone wanting to confirm this trend with their own data rather than with reanalysis.

## How we made the graphs

The charts and every number come from `scripts/blog-figures/huairou-daytime-fried-parameter-seeing-solar-site.mjs` in fibub's public code. It calls `moffatFwhm`, `findStars`, `measureStar`, `fieldSummary` and `plateScale` from `src/lib/sci/starfwhm.ts`, the maths behind the [[star-fwhm-checker]]: the same adaptive-moment centroid, Moffat fit and half-flux radius the tool runs on an uploaded image.

From the paper: the two median Fried parameters, the 12 % seasonal swing, the 20 % and 40 % falls in surface Cn², and the 600 mm aperture. **Our assumptions:** 500 nm light, a Moffat β of 3.5, the two plate scales (0.5″ and 1.5″ per pixel), 24 stars per simulated field, a sky of 800 counts with photon noise, and that the measured surface-layer change can be read as a change in the whole turbulence integral.

## How we test the maths

`node tests/sci.mjs` runs `tests/sci-tools/star-fwhm-checker.mjs` on every change to fibub:

- `moffatFwhm(3, 2.5)` must be 3.392 pixels, and `moffatFwhm(3.45, 3.5)` must be 3.229, the Moffat identity FWHM = 2α√(2^(1/β) − 1).
- `plateScale(3.76, 480)` must be 1.616″ per pixel and `plateScale(9, 3712)` must be 0.500″ (to three decimals), the formula 206.265 × pixel ÷ focal length.
- New with this article: a noiseless Moffat star of FWHM 6.46 px and β 3.5, dropped in the middle of a 61 × 61 patch, must measure back to 6.46 px (within 0.05 px), with an eccentricity under 0.05 and a half-flux radius near 3.86 px, and the same star stretched 20 % along one axis must come back with eccentricity 0.55 ± 0.05.

## Check it yourself

The Star FWHM checker needs an image, so this one uses its own demo field:

1. Open the [[star-fwhm-checker]] and press **Load the example** in the *Open a star image* card.
2. Type **9** in *Pixel size (µm)* and **3712** in *Focal length (mm)*. The page now works in **0.50″ per pixel**, the sampling we used above.
3. The *Star shapes* card's headline reads *Median FWHM … px (…″), HFR … px, from N stars*, and the facts under it give **FWHM**, **Half-flux radius (HFR)**, **Elongation**, **Corners vs centre** and **Moffat β** — the same five numbers our script read out of the simulated fields.
4. Look at *Median FWHM across the field*. The example frame is deliberately tilted, so corner values differ; a seeing measurement wants the median, never one corner.
5. To copy our Huairou arithmetic on your own frame, take the median FWHM in arcseconds and work out r₀ = 0.98 λ ÷ FWHM: 0.98 × 500 nm ÷ 3.23″ (in radians) gives **3.13 cm**, the paper's median back again.
6. On the [[telescope-calculator]], type **600** in *Aperture (mm)*, **7200** in *Focal length (mm)* and **3.2** in *Typical seeing (″)*: *Resolution (Dawes)* reads **0.19″**, against air 16 times wider.

## What researchers can use it for

- **Translate a site paper into your own units** before trusting it: r₀ in centimetres means nothing until it is arcseconds at your wavelength.
- **Check whether your camera can detect a seeing trend**: simulate stars at the two seeings you care about, measure them with the checker, and see whether the difference survives your plate scale.
- **Size an adaptive-optics system**: (D/r₀)² is the number of correction cells, and both numbers are in the paper.
- **Audit your own images for free**: the checker reports FWHM, half-flux radius, eccentricity and a field map, which separates seeing from focus, tilt and tracking before you blame the air.
- **Teach the λ^−1/5 rule**: the same r₀ gives 3.23″ in green light and 2.71″ at 1.2 µm, which is why infrared solar work is easier.

## The fine print

- The paper's Fried parameters are **modelled from reanalysis**, calibrated against instrument data; they are not a season of seeing-monitor readings.
- Our star fields are **simulated**. They test the measuring chain, not the paper's atmosphere.
- FWHM = 0.98 λ/r₀ is the long-exposure Kolmogorov result. Short exposures, a finite outer scale and dome seeing all change the number, usually in the observer's favour for the outer scale and against them for the dome.
- Reading the surface-layer Cn² change as a change in the whole integral is **our assumption** and an upper bound on the improvement.
- The paper reports several trends with p values above 0.05 (July cloud cover under the strictest clear-sky cut, for one). Those are not evidence of a trend, and we have not used them.
