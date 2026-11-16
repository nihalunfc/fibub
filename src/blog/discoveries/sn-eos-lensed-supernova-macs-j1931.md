---
title: "SN Eos: a supernova from the young universe, seen several times through a galaxy cluster"
summary: "A galaxy cluster bends the light of a supernova that exploded 12.7 billion years ago into five images, some arriving decades apart. We use fibub's cosmology, redshift and magnitude tools to check the distances, the stretched light and the brightening."
tools: [cosmology-calculator, redshift-calculator, magnitude-flux-converter]
updated: 2026-11-16
sources:
  - "Allingham, J. F. V., Zitrin, A., Kokorev, V., Yanagisawa, H., Diego, J. M., et al. (55 authors) (2026), VENUS: Strong-lensing Model of MACS J1931.8-2635: Revealing the Farthest Multiply Imaged Supernova, The Astrophysical Journal 1005, 215, published 7 July 2026, doi:10.3847/1538-4357/ae7a59; arXiv:2602.14074. Licence CC BY 4.0 (checked in the Crossref record, 2026-11-16). Values used here, from the abstract: cluster redshift 0.35, SN Eos redshift 5.13, 19 multiple-image systems (10 new, 9 with spectroscopic redshifts), five predicted images of SN Eos, observed pair magnified about 25 to 30 times and less than 5 days apart, three earlier images with delays of 3.6 ± 0.7, 3.4 ± 0.7 and 53.9 ± 10.8 years and magnifications of 14.5 ± 2.9, 11.9 ± 2.4 and 2.2 ± 0.4, model r.m.s. 0.44 arcseconds, a triply imaged spiral galaxy candidate at z ≈ 3.65."
  - "Cosmology: Planck Collaboration (2020), Planck 2018 results VI, A&A 641, A6, Table 2 (H0 = 67.66 km/s/Mpc, Ωm = 0.3111), the Cosmology calculator's default."
  - "Local distance-ladder Hubble constant of about 73 km/s/Mpc: Riess, A. G. et al. (2022), ApJL 934, L7 (73.04 ± 1.04)."
  - "Rest wavelengths of Lyman α (121.567 nm) and Hα (656.281 nm): the Redshift calculator's line list (standard values)."
  - "Peak absolute magnitude of −17 for a core-collapse supernova: our assumption, a typical round number, used only for the brightness example."
paper:
  title: "VENUS: Strong-lensing Model of MACS J1931.8-2635: Revealing the Farthest Multiply Imaged Supernova"
  authors: "Allingham, J. F. V.; Zitrin, A.; Kokorev, V.; Yanagisawa, H.; Diego, J. M.; et al."
  journal: "The Astrophysical Journal"
  year: 2026
  doi: "10.3847/1538-4357/ae7a59"
  url: "https://doi.org/10.3847/1538-4357/ae7a59"
  licence: "CC BY 4.0"
  reviewed: true
---

A galaxy cluster is so heavy that it bends light passing near it, like a giant, uneven lens. Behind the cluster MACS J1931.8-2635, a star exploded when the universe was barely a billion years old. The cluster splits its light into several images that take different paths, so the same explosion reaches us more than once, years apart. A team has now built a detailed model of this lens with the James Webb Space Telescope. This article shows how the [[cosmology-calculator]], the [[redshift-calculator]] and the [[magnitude-flux-converter]] let anyone check what such a distant, magnified supernova means.

## The paper in brief

The cluster sits at redshift **0.35**. Redshift, *z*, says how much the universe has stretched since the light left: wavelengths arrive 1 + *z* times longer. The supernova, named **SN Eos**, is at **z = 5.13**, which makes it the farthest supernova ever seen in more than one image.

Using JWST images from the VENUS survey, the team found 10 new sets of multiple images of background galaxies, for 19 in all. They fitted a mass model of the cluster that reproduces the image positions to 0.44 arcseconds on average. The model predicts **five images** of SN Eos. Two are the ones seen, very close together, each magnified about **25 to 30 times** and less than 5 days apart. Three more should have reached Earth earlier: about **3.6 and 3.4 years** before, and one about **54 years** before, each less magnified.

Why it matters: the time between images depends on the lens and on the size of the universe, set by the Hubble constant H0. Lensed supernovae with measured delays are one of the few independent ways to measure H0.

## Checked with the tools

We used the paper's redshifts, magnifications and delays, and the Planck 2018 cosmology that the calculators use by default.

**Step 1: how far back in time.** The Cosmology calculator puts SN Eos's light on a journey of **12.65 billion years**. The universe was **1.13 billion years** old when the star exploded, 8% of its age now (Figure 1). The cluster's light left 4.0 billion years ago. At z = 5.13, one arcsecond on the sky spans **6.34 kiloparsecs** (about 20,700 light years), so the 0.44-arcsecond accuracy of the model is about 2.8 kiloparsecs at the supernova's distance.

<!-- fig:age -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 290" role="img" aria-label="The age of the universe falls from 13.8 billion years nearby to 1.13 billion years at the supernova's redshift of 5.13." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How old the universe was when the light left</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How old the universe was when the light left</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--line)"/><text x="52" y="248" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="214.8" y2="214.8" style="stroke:var(--line)"/><text x="52" y="218.8" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="185.5" y2="185.5" style="stroke:var(--line)"/><text x="52" y="189.5" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="156.3" y2="156.3" style="stroke:var(--line)"/><text x="52" y="160.3" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="127" y2="127" style="stroke:var(--line)"/><text x="52" y="131" text-anchor="end" style="fill:var(--muted)">8</text><line x1="58" x2="546" y1="97.8" y2="97.8" style="stroke:var(--line)"/><text x="52" y="101.8" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="68.6" y2="68.6" style="stroke:var(--line)"/><text x="52" y="72.6" text-anchor="end" style="fill:var(--muted)">12</text><line x1="58" x2="546" y1="39.3" y2="39.3" style="stroke:var(--line)"/><text x="52" y="43.3" text-anchor="end" style="fill:var(--muted)">14</text><line x1="58" x2="58" y1="244" y2="248" style="stroke:var(--muted)"/><text x="58" y="261" text-anchor="middle" style="fill:var(--muted)">0.01</text><line x1="220.7" x2="220.7" y1="244" y2="248" style="stroke:var(--muted)"/><text x="220.7" y="261" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="383.3" x2="383.3" y1="244" y2="248" style="stroke:var(--muted)"/><text x="383.3" y="261" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="546" x2="546" y1="244" y2="248" style="stroke:var(--muted)"/><text x="546" y="261" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--muted)"/><text x="302" y="282" text-anchor="middle" style="fill:var(--ink)">Redshift z</text><text transform="translate(14 138) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Age of the universe then (billion years)</text><path d="M58 44.5L63.4 44.7L68.9 44.9L74.3 45.1L79.6 45.3L85.2 45.5L90.5 45.7L95.9 46L101.4 46.3L106.8 46.6L112.2 46.9L117.7 47.3L123.1 47.6L128.4 48.1L134 48.5L139.3 49L144.7 49.5L150.2 50L155.6 50.6L161 51.2L166.5 51.9L171.9 52.7L177.2 53.4L182.8 54.3L188.1 55.2L193.5 56.1L199 57.2L204.4 58.3L209.8 59.5L215.3 60.7L220.7 62.1L226 63.6L231.6 65.1L236.9 66.8L242.3 68.5L247.8 70.4L253.2 72.4L258.6 74.5L264.1 76.7L269.5 79.1L274.8 81.6L280.4 84.2L285.7 87L291.1 90L296.6 93L302 96.3L307.4 99.6L312.9 103.1L318.3 106.8L323.6 110.6L329.2 114.5L334.5 118.5L339.9 122.7L345.4 127L350.8 131.3L356.2 135.7L361.7 140.2L367.1 144.8L372.4 149.3L378 153.9L383.3 158.5L388.7 163L394.2 167.5L399.6 171.9L405 176.2L410.5 180.4L415.9 184.5L421.2 188.5L426.8 192.3L432.1 196L437.5 199.5L443 202.8L448.4 206L453.8 209L459.3 211.8L464.7 214.5L470 216.9L475.6 219.2L480.9 221.4L486.3 223.4L491.8 225.2L497.2 226.9L502.6 228.5L508.1 229.9L513.5 231.3L518.8 232.5L524.4 233.6L529.7 234.6L535.1 235.5L540.6 236.4L546 237.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="309.2" cy="100.7" r="4" style="fill:var(--ink);opacity:1"/><text x="317.2" y="94.7" text-anchor="start" style="fill:var(--ink)">Cluster, z = 0.35: 9.8 billion years</text><circle cx="498.8" cy="227.5" r="4" style="fill:var(--ink);opacity:1"/><text x="490.8" y="219.5" text-anchor="end" style="fill:var(--ink)">SN Eos, z = 5.13: 1.13 billion years</text><text class="fibub-mark" x="546" y="282" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Age of the universe when the light we see left, from the Cosmology calculator's maths with Planck 2018 values (flat, with radiation). The redshift axis is logarithmic.</figcaption></figure>
<!-- /fig:age -->

**Step 2: stretched light and slow clocks.** At z = 5.13 every wavelength is **6.13 times** longer. Lyman α, an ultraviolet line of hydrogen at 121.6 nm, arrives at **745 nm**, at the red edge of what eyes can see. Hα, the red hydrogen line at 656.3 nm, arrives at **4.02 µm**, deep in the infrared, where only JWST can catch it. Time is stretched by the same factor: anything that lasts 100 days at the supernova lasts **613 days** for us. This is why such a faint, distant explosion stays visible long enough to study.

**Step 3: how faint, and how much the lens helps.** The luminosity distance is **49,100 megaparsecs**, giving a distance modulus of **48.46 magnitudes**. If we assume a supernova peaking at absolute magnitude −17 (our round number, not the paper's), it would appear at about AB **29.5** without the lens, about **6 nanojanskys**. A magnification of 25 to 30 is **3.49 to 3.69 magnitudes** brighter, giving about AB **25.8 to 26.0**, or **145 to 175 nanojanskys**. The earlier images, magnified 14.5, 11.9 and 2.2 times, would have been 2.90, 2.69 and 0.86 magnitudes brighter than unlensed. All of these numbers rest on the assumed −17 and ignore the shape of the spectrum; they show the size of the effect, not the paper's measurements.

**Step 4: delays and the Hubble constant.** For a fixed lens model, every time delay scales with the **time-delay distance**, built from the distances to the cluster, to the supernova and between them. The Cosmology calculator's maths gives about **1,720 megaparsecs** for Planck's cosmology. This distance is inversely proportional to H0. So if the true H0 were 73 km/s/Mpc, as local measurements suggest, the same lens model would predict about **50 years** for the longest delay instead of 53.9 (Figure 2). The model's own uncertainty, ± 10.8 years, is still larger than this, which is why the paper treats cosmology from SN Eos as future work.

<!-- fig:h0 -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="With the same lens model, the predicted 53.9-year delay would be about 60.8 years if H0 were 60 and about 48 years if it were 76: delays scale as one over the Hubble constant." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>The 53.9-year delay depends on the Hubble constant</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">The 53.9-year delay depends on the Hubble constant</text><line x1="58" x2="546" y1="183.5" y2="183.5" style="stroke:var(--line)"/><text x="52" y="187.5" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="120.4" y2="120.4" style="stroke:var(--line)"/><text x="52" y="124.4" text-anchor="end" style="fill:var(--muted)">55</text><line x1="58" x2="546" y1="57.3" y2="57.3" style="stroke:var(--line)"/><text x="52" y="61.3" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="58" y1="234" y2="238" style="stroke:var(--muted)"/><text x="58" y="251" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="210.5" x2="210.5" y1="234" y2="238" style="stroke:var(--muted)"/><text x="210.5" y="251" text-anchor="middle" style="fill:var(--muted)">65</text><line x1="363" x2="363" y1="234" y2="238" style="stroke:var(--muted)"/><text x="363" y="251" text-anchor="middle" style="fill:var(--muted)">70</text><line x1="515.5" x2="515.5" y1="234" y2="238" style="stroke:var(--muted)"/><text x="515.5" y="251" text-anchor="middle" style="fill:var(--muted)">75</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Hubble constant H0 (km/s/Mpc)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Predicted delay (years)</text><line x1="291.6" x2="291.6" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="287.6" y="44" text-anchor="end" style="fill:var(--muted)">Planck 67.7</text><line x1="454.5" x2="454.5" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="458.5" y="44" text-anchor="start" style="fill:var(--muted)">Local ladder ~73</text><path d="M58 47.4L73.3 53.7L88.5 60L103.8 66.1L119 72.1L134.3 78.1L149.5 83.9L164.8 89.7L180 95.3L195.3 100.9L210.5 106.4L225.8 111.8L241 117.1L256.3 122.4L271.5 127.6L286.8 132.6L302 137.7L317.3 142.6L332.5 147.5L347.8 152.3L363 157L378.3 161.7L393.5 166.3L408.8 170.8L424 175.3L439.3 179.7L454.5 184L469.8 188.3L485 192.6L500.3 196.7L515.5 200.9L530.8 204.9L546 208.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="272" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How the paper's longest predicted delay, 53.9 years for Planck's H0, would change with a different Hubble constant if the lens model stayed the same. Time-delay distance from the Cosmology calculator's maths; our illustration, not a result of the paper.</figcaption></figure>
<!-- /fig:h0 -->

| Check | Paper | Our tool result |
|---|---|---|
| Supernova redshift | 5.13 | wavelengths and times stretched 6.13× |
| Age of the universe at the explosion | (not in abstract) | 1.13 billion years |
| Light travel time | (not in abstract) | 12.65 billion years |
| Brightening of the observed pair | magnification 25 to 30 | 3.49 to 3.69 magnitudes |
| Longest delay | 53.9 ± 10.8 years | about 50 years if H0 were 73 |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/sn-eos-lensed-supernova-macs-j1931.mjs` in fibub's public code. It calls the tools' own functions:

- `cosmology`, `omegaR` and `presets` from `src/lib/sci/cosmo.ts`, the maths behind the [[cosmology-calculator]]: ages, light travel time, the distances and the angular scale.
- `LINES` and `velocity` from `src/lib/sci/redshift.ts`, the [[redshift-calculator]]'s line list and conversions.
- `toJy` and `fromJy` from `src/lib/sci/photometry.ts`, the [[magnitude-flux-converter]]'s conversions between AB magnitudes and janskys.

Where the inputs come from: redshifts, magnifications and delays are the paper's; H0 and Ωm are Planck 2018; the H0 of 73 is the local distance-ladder value; the −17 peak magnitude is our assumption, used only in Step 3. The time-delay distance uses the standard formula for a flat universe, (1 + *z*ₗ) *D*ₗ *D*ₛ / *D*ₗₛ, written in the script from the calculator's distances.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks these functions against exact solutions and published numbers:

- The cosmology maths must give the exact comoving distance and age of an Einstein–de Sitter universe, and with Planck 2018 values an age of **13.787 billion years** and **7.883 kpc per arcsecond** at z = 3.
- The redshift maths must give a relativistic velocity of **179,875.47 km/s** at z = 1 and put the hydrogen 21 cm line at **1.420405752 GHz**.
- The magnitude converter must turn AB 0 into **3,631 Jy** and V = 0 into **3,636 Jy**.

## Check it yourself

**The distances, on the [[cosmology-calculator]]:**

1. Type **5.13** in *Redshift z* and leave *Cosmology* on **Planck 2018 (flat)**.
2. *Age at redshift z* reads **1.133 Gyr**, *Lookback (light travel) time* **12.653 Gyr**, *Luminosity distance* about **49,129 Mpc**, *Scale* **6.339 kpc per arcsecond** and *Distance modulus* **48.46 mag**.
3. Type **0.35** for the cluster: *Lookback (light travel) time* reads **3.987 Gyr**.

**The stretched light, on the [[redshift-calculator]]:** leave *I know* on **The redshift z** and type **5.13** in *Redshift z*. *Wavelengths stretched by* reads **6.13 times**, and the line table shows Lyman α at about **745 nm** and Hα at about **4,023 nm**.

**The brightness, on the [[magnitude-flux-converter]]:** type **25.8** in *Value*, choose **magnitude (AB)** as the *Unit* and **Any wavelength** as the *Band*. The table reads about **0.174 µJy**, that is 174 nanojanskys. Type **29.49** for the unlensed case: about **0.0058 µJy**.

The time-delay distance in Step 4 is not a field in the Cosmology calculator; it needs the script, or the three angular diameter distances combined by hand.

## What researchers can use it for

- **Check a redshift table**: ages, light travel times and distances for any *z* and any flat or curved cosmology.
- **Plan spectroscopy**: see in which instrument band each emission line lands for a given redshift.
- **Convert magnitudes to fluxes** (AB or Vega, any band) when comparing a lensed source with survey depths.
- **Estimate angular scales**: how many kiloparsecs an arcsecond covers at the lens and at the source.
- **Teach** gravitational lensing and the expanding universe with real numbers from a JWST discovery.

## The fine print

- All paper values come from its abstract. The paper's own cosmology and methods may differ slightly from the Planck 2018 values we used.
- The brightness numbers in Step 3 depend on our assumed peak magnitude of −17; the real supernova may have been brighter or fainter, and we ignore the shape of its spectrum.
- Figure 2 is our illustration of how delays scale with H0 for a fixed lens model; the paper does not make this calculation in its abstract, and a real H0 measurement also refits the lens.
- Magnification makes a source brighter and bigger on the sky; it does not change its colour or its redshift.
