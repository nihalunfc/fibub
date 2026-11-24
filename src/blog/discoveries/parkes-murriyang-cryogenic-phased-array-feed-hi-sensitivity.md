---
title: "Murriyang cryogenic phased array feed: HI noise and beam checked"
summary: "A 72-beam cooled receiver on the 64 m Parkes dish maps hydrogen in the LMC. We rebuild its noise, beam and column-density limit with the radiometer equation."
tools: [radio-telescope-calculator, hydrogen-line-analyser, redshift-calculator]
updated: 2026-11-24
sources:
  - "Staveley-Smith, L. et al. (2026), Murriyang cryogenic phased array feed: spectral-line results and noise-reduction methods, Publications of the Astronomical Society of Australia 43: e057, doi:10.1017/pasa.2026.10164. Licence CC BY 4.0 (Creative Commons Attribution), checked on the Cambridge Core page, 2026-11-24. Values used here: system temperature about 17 K at 1.4 GHz; aperture efficiency about 0.7 and main-beam efficiency about 0.8; Tsys over efficiency 25 K (aperture) and 21 K (main beam); up to 72 dual-polarisation beams spaced 0.14° apart, each about 0.24° wide at 1.4 GHz; band 0.7 to 2 GHz; LMC map of 49 pointings of about 80 s, 5 kHz (1.1 km/s) channels, mean spatial weight 2.5, 28 mK per beam and about 18 mK in the cube, column density noise 3.6 × 10¹⁶ cm⁻²; NGC 6744 flux 5.07 ± 0.25 Jy MHz against 4.88 ± 0.27 Jy MHz (1031 ± 57 Jy km/s) from HIPASS."
  - "Dish diameter of 64 m: the telescope's published size (CSIRO, Murriyang, the Parkes radio telescope)."
  - "Radiometer equation and the HI column density factor 1.823 × 10¹⁸ cm⁻² per K km/s: Wilson, Rohlfs and Hüttemeister (2013), Tools of Radio Astronomy, Springer."
paper:
  title: "Murriyang cryogenic phased array feed: spectral-line results and noise-reduction methods"
  authors: "Staveley-Smith L, Barker S, Berangi R et al."
  journal: "Publications of the Astronomical Society of Australia"
  year: 2026
  doi: "10.1017/pasa.2026.10164"
  url: "https://www.cambridge.org/core/journals/publications-of-the-astronomical-society-of-australia/article/murriyang-cryogenic-phased-array-feed-spectralline-results-and-noisereduction-methods/DBE6FFB08D33379E825DC9F07DB3B71C"
  licence: "CC BY 4.0"
  reviewed: true
---

A big radio dish normally looks at one patch of sky at a time. A **phased array feed** (PAF) puts a grid of small antennas at the focus and combines their signals in a computer to form many beams at once, so the dish maps the sky many times faster. A 2026 paper describes the first spectral-line results from a **cooled** (cryogenic) PAF on Murriyang, the 64 m Parkes telescope in Australia: 72 beams, a low-noise receiver, and maps of the neutral hydrogen (HI) in the Large Magellanic Cloud (LMC) and the galaxy NGC 6744. This article rebuilds the paper's stated noise levels and beam size from four numbers with the [[radio-telescope-calculator]], then turns the noise into a hydrogen column density as the [[hydrogen-line-analyser]] does. To change between frequency and velocity widths, use the [[redshift-calculator]].

## The paper in brief

Neutral hydrogen gives out a faint radio line at 1420.4 MHz, the **21 cm line**. Its strength tells you how much gas lies along each line of sight and its Doppler shift tells you how the gas moves. Mapping it over big areas is slow, so survey speed matters.

The new receiver covers 0.7 to 2 GHz and is cooled so that its **system temperature** (Tsys, the total noise of receiver and sky, written as a temperature) is about **17 K** at 1.4 GHz. The team reports an **aperture efficiency**, the share of the dish's area that really collects signal, of about **0.7**, and a main-beam efficiency of about **0.8**. Each of the 72 beams is about **0.24°** wide, and neighbours are **0.14°** apart.

They mapped an 8° × 8° field of the LMC in 66 minutes with 49 pointings of about **80 s**, in **5 kHz** channels (1.1 km/s). They expected **28 mK** of noise per beam and **18 mK** in the final cube, and measured about 18 mK, a column density noise of **3.6 × 10¹⁶ atoms per cm²**. A short look at NGC 6744 gave a total HI flux of 5.07 ± 0.25 Jy MHz, in line with the older HIPASS survey's 4.88 ± 0.27. The paper also tests new ways of removing radio interference and continuum, which we do not check here.

## Checked with the tools

This is a **recomputation** from values stated in the paper's text, with the dish's published 64 m diameter. Nothing here is the paper's data.

**Step 1: gain and SEFD.** With a 64 m dish and an efficiency of 0.7, the tool's maths gives an effective area of 2252 m² and a **gain of 0.816 K/Jy**: a source of 1 jansky (Jy, 10⁻²⁶ W m⁻² Hz⁻¹) raises the antenna temperature by 0.816 K. Dividing Tsys by the gain gives the **system equivalent flux density** (SEFD), the source brightness that would equal the system's own noise: **20.8 Jy**.

**Step 2: noise per beam.** The radiometer equation says the noise falls with the square root of bandwidth times time: σ = SEFD / √(2 × B × t), the 2 for the two polarisations. For a 5 kHz channel and 80 s this is **23.3 mJy**, or 19.0 mK of antenna temperature. Survey work quotes noise as a sky brightness, so divide by the efficiency. With the aperture efficiency (17 / 0.7 = 24.3 K) we get **27.2 mK**; with the paper's measured 25 K exactly, **27.95 mK**, the paper's 28 mK. With the main-beam efficiency (21 K) it would be only 23.8 mK. So the paper's 28 mK uses the more cautious aperture value (Figure 1).

<!-- fig:noise -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Radiometer-equation noise per beam against integration time for a 64 m dish with Tsys 17 K and 5 kHz channels. At 80 s it is 27.2 mK for Tsys/eta 25 K, matching the paper's 28 mK." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Murriyang PAF: HI noise per beam in a 5 kHz channel</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Murriyang PAF: HI noise per beam in a 5 kHz channel</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="165.2" y2="165.2" style="stroke:var(--line)"/><text x="52" y="169.2" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="88.4" y2="88.4" style="stroke:var(--line)"/><text x="52" y="92.4" text-anchor="end" style="fill:var(--muted)">100</text><line x1="127.7" x2="127.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="127.7" y="259" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="267.1" x2="267.1" y1="242" y2="246" style="stroke:var(--muted)"/><text x="267.1" y="259" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="406.6" x2="406.6" y1="242" y2="246" style="stroke:var(--muted)"/><text x="406.6" y="259" text-anchor="middle" style="fill:var(--muted)">1000</text><line x1="546" x2="546" y1="242" y2="246" style="stroke:var(--muted)"/><text x="546" y="259" text-anchor="middle" style="fill:var(--muted)">10000</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Integration time per beam (s, log scale)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Noise (mK, log scale)</text><line x1="253.6" x2="253.6" y1="50" y2="242" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="257.6" y="62" text-anchor="start" style="fill:var(--muted)">80 s</text><path d="M58 78L66.1 80.2L74.3 82.5L82.4 84.7L90.5 87L98.7 89.2L106.8 91.4L114.9 93.7L123.1 95.9L131.2 98.2L139.3 100.4L147.5 102.6L155.6 104.9L163.7 107.1L171.9 109.4L180 111.6L188.1 113.8L196.3 116.1L204.4 118.3L212.5 120.6L220.7 122.8L228.8 125L236.9 127.3L245.1 129.5L253.2 131.8L261.3 134L269.5 136.3L277.6 138.5L285.7 140.7L293.9 143L302 145.2L310.1 147.4L318.3 149.7L326.4 151.9L334.5 154.2L342.7 156.4L350.8 158.6L358.9 160.9L367.1 163.1L375.2 165.4L383.3 167.6L391.5 169.8L399.6 172.1L407.7 174.3L415.9 176.6L424 178.8L432.1 181L440.3 183.3L448.4 185.5L456.5 187.8L464.7 190L472.8 192.3L480.9 194.5L489.1 196.7L497.2 199L505.3 201.2L513.5 203.4L521.6 205.7L529.7 207.9L537.9 210.1L546 212.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 82.5L66.1 84.7L74.3 86.9L82.4 89.2L90.5 91.4L98.7 93.7L106.8 95.9L114.9 98.1L123.1 100.4L131.2 102.6L139.3 104.9L147.5 107.1L155.6 109.3L163.7 111.6L171.9 113.8L180 116.1L188.1 118.3L196.3 120.5L204.4 122.8L212.5 125L220.7 127.3L228.8 129.5L236.9 131.7L245.1 134L253.2 136.2L261.3 138.5L269.5 140.7L277.6 142.9L285.7 145.2L293.9 147.4L302 149.6L310.1 151.9L318.3 154.1L326.4 156.4L334.5 158.6L342.7 160.9L350.8 163.1L358.9 165.3L367.1 167.6L375.2 169.8L383.3 172.1L391.5 174.3L399.6 176.5L407.7 178.8L415.9 181L424 183.3L432.1 185.5L440.3 187.7L448.4 190L456.5 192.2L464.7 194.5L472.8 196.7L480.9 198.9L489.1 201.2L497.2 203.4L505.3 205.7L513.5 207.9L521.6 210.1L529.7 212.4L537.9 214.7L546 216.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><circle cx="253.6" cy="130.9" r="4.5" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Tsys/η = 25 K (aperture)</text><line x1="256.8" x2="268.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="272.8" y="40" style="fill:var(--muted)">Tsys/η = 21 K (main beam)</text><circle cx="467.8" cy="36" r="4" style="fill:var(--ink)"/><text x="478.8" y="40" style="fill:var(--muted)">Paper: 28 mK at 80 s</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Noise per beam in one 5 kHz channel against integration time, from the radiometer equation in the Radio telescope calculator (64 m dish, Tsys 17 K, both polarisations), shown as a sky brightness temperature with the two efficiencies the paper gives. The dot is the paper's stated 28 mK for an 80 s pointing.</figcaption></figure>
<!-- /fig:noise -->

**Step 3: from one beam to the map.** Neighbouring beams and pointings overlap, so each spot in the map is measured about 2.5 times. Noise falls by √2.5: 27.95 / 1.58 = **17.7 mK**, the paper's "about 18 mK" (17.2 mK if you start from the rounded 17 K and 0.7).

**Step 4: column density.** For optically thin gas, the column density is 1.823 × 10¹⁸ times the area under the line in K km/s, the formula in the Hydrogen line analyser. One 5 kHz channel at 1420.4 MHz is **1.055 km/s** wide (radio convention). With 18 mK and 1.1 km/s, as the paper rounds them, the limit is **3.61 × 10¹⁶ cm⁻²**, the paper's value; with 17.2 mK and 1.055 km/s it is 3.30 × 10¹⁶.

**Step 5: beam size.** A tapered dish has a half-power beam of about 1.2 λ/D. At 1420 MHz (λ = 21.1 cm) that is **0.227°**, or 13.6 arcmin, a little under the paper's 0.24° (Figure 2). A PAF beam is formed electronically and its effective taper differs from a horn's, so a few per cent wider is expected. The 0.14° spacing is about 0.6 of a beam, which is why beams overlap.

<!-- fig:beam -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 268" role="img" aria-label="Half-power beam width 1.2 lambda over D for a 64 m dish: 0.46 degrees at 0.7 GHz, 0.230 at 1.4 GHz and 0.16 at 2 GHz." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Beam width of a 64 m dish across 0.7 to 2 GHz</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Beam width of a 64 m dish across 0.7 to 2 GHz</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--line)"/><text x="52" y="226" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="187.6" y2="187.6" style="stroke:var(--line)"/><text x="52" y="191.6" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="153.2" y2="153.2" style="stroke:var(--line)"/><text x="52" y="157.2" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="118.8" y2="118.8" style="stroke:var(--line)"/><text x="52" y="122.8" text-anchor="end" style="fill:var(--muted)">0.3</text><line x1="58" x2="546" y1="84.4" y2="84.4" style="stroke:var(--line)"/><text x="52" y="88.4" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="76.8" x2="76.8" y1="222" y2="226" style="stroke:var(--muted)"/><text x="76.8" y="239" text-anchor="middle" style="fill:var(--muted)">0.75</text><line x1="170.6" x2="170.6" y1="222" y2="226" style="stroke:var(--muted)"/><text x="170.6" y="239" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="264.5" x2="264.5" y1="222" y2="226" style="stroke:var(--muted)"/><text x="264.5" y="239" text-anchor="middle" style="fill:var(--muted)">1.25</text><line x1="358.3" x2="358.3" y1="222" y2="226" style="stroke:var(--muted)"/><text x="358.3" y="239" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="452.2" x2="452.2" y1="222" y2="226" style="stroke:var(--muted)"/><text x="452.2" y="239" text-anchor="middle" style="fill:var(--muted)">1.75</text><line x1="546" x2="546" y1="222" y2="226" style="stroke:var(--muted)"/><text x="546" y="239" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--muted)"/><text x="302" y="260" text-anchor="middle" style="fill:var(--ink)">Frequency (GHz)</text><text transform="translate(14 136) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Half-power beam width (°)</text><line x1="58" x2="546" y1="173.8" y2="173.8" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="168.8" text-anchor="end" style="fill:var(--muted)">beam spacing 0.14°</text><path d="M58 63.7L67.4 69.2L76.8 74.3L86.2 79L95.5 83.5L104.9 87.7L114.3 91.7L123.7 95.4L133.1 98.9L142.5 102.2L151.8 105.4L161.2 108.4L170.6 111.2L180 113.9L189.4 116.5L198.8 118.9L208.2 121.3L217.5 123.5L226.9 125.6L236.3 127.7L245.7 129.7L255.1 131.6L264.5 133.4L273.8 135.1L283.2 136.8L292.6 138.4L302 139.9L311.4 141.4L320.8 142.9L330.2 144.3L339.5 145.6L348.9 146.9L358.3 148.1L367.7 149.3L377.1 150.5L386.5 151.7L395.8 152.8L405.2 153.8L414.6 154.9L424 155.8L433.4 156.8L442.8 157.8L452.2 158.7L461.5 159.6L470.9 160.5L480.3 161.3L489.7 162.1L499.1 162.9L508.5 163.7L517.8 164.4L527.2 165.2L536.6 165.9L546 166.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="320.8" cy="139.4" r="4.5" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Tool: 1.2 λ/D</text><circle cx="182.6" cy="36" r="4" style="fill:var(--ink)"/><text x="193.6" y="40" style="fill:var(--muted)">Paper: about 0.24° at 1.4 GHz</text><text class="fibub-mark" x="546" y="260" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Half-power beam width of a 64 m dish across the receiver's 0.7 to 2 GHz range, from the tool's 1.2 λ/D rule. The dot is the paper's stated beam of about 0.24° at 1.4 GHz; the dashed line is the 0.14° spacing between neighbouring beams.</figcaption></figure>
<!-- /fig:beam -->

**Step 6: the NGC 6744 flux in familiar units.** At 1420.4 MHz, 1 MHz of bandwidth is 211.06 km/s of velocity. The cryoPAF's 5.07 ± 0.25 Jy MHz is therefore **1070 ± 53 Jy km/s**, and HIPASS's 4.88 Jy MHz is **1030 Jy km/s**, the 1031 the paper quotes. The two agree within their errors.

| Check | Paper | Our tool result |
|---|---|---|
| Tsys over aperture efficiency | 25 K | 24.3 K (17 ÷ 0.7) |
| Noise per beam, 80 s, 5 kHz | 28 mK | 27.95 mK (from 25 K), 27.2 mK (from 17 K and 0.7) |
| Noise in the LMC cube | about 18 mK | 17.7 mK (√2.5 weighting) |
| Column density noise | 3.6 × 10¹⁶ cm⁻² | 3.61 × 10¹⁶ (18 mK, 1.1 km/s) |
| Beam at 1.4 GHz | about 0.24° | 0.227° (1.2 λ/D) |
| NGC 6744 HI flux | 5.07 Jy MHz | 1070 Jy km/s |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/parkes-murriyang-cryogenic-phased-array-feed-hi-sensitivity.mjs` in fibub's public code. It calls `scope` from `src/lib/sci/radiotel.ts` (gain, SEFD, beam width and the radiometer equation), the maths behind the [[radio-telescope-calculator]], and `velRadio`, `F0` and `columnDensity` from `src/lib/astro/hline.ts`, the maths behind the [[hydrogen-line-analyser]].

Tsys, both efficiencies, the beam width and spacing, the 80 s pointings, the 5 kHz channels, the 2.5 weighting and the NGC 6744 fluxes come from the paper's text. The 64 m diameter is the telescope's published size. Treating each 80 s pointing as one beam's integration time is **our reading** of the paper's noise budget; it reproduces the stated 28 mK.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the radio telescope maths:

- A 100 m dish with 70 % efficiency must give a gain of 1.991 K/Jy, as the Green Bank Telescope quotes, an SEFD of 10.05 Jy for Tsys 20 K, and a beam of 8.83 arcmin at 1.4 GHz.
- An array of 27 dishes must use N(N−1) = 702 pairs in the radiometer equation.
- New with this article, in `tests/sci-tools/radio-telescope-calculator.mjs`: a 64 m dish with efficiency 0.7 and Tsys 17 K at 1420 MHz must give 0.816 K/Jy, an SEFD of 20.8 Jy, 23.3 mJy of noise in 80 s and 5 kHz (19.0 mK, which is Tsys/√(2Bt)), and a 13.6 arcmin beam.

## Check it yourself

On the [[radio-telescope-calculator]]:

1. Type **1420** in *Frequency (MHz)*, **64** in *Dish diameter (m)*, **0.7** in *Aperture efficiency* and **17** in *System temperature (K)*. Leave *Number of dishes* at **1** and *Polarisations* on **Two**.
2. Type **0.005** in *Bandwidth (MHz)* (one 5 kHz channel) and **80** in *Integration time*, with the unit set to **seconds**.
3. The headline reads **Noise 23.3 mJy after 80 seconds**. *Gain* shows **0.816 K/Jy**, *System equivalent flux density* **20.8 Jy** and *Beam width* **13.6 arcmin**.
4. Multiply the noise by the gain and divide by 0.7: 0.0233 × 0.816 ÷ 0.7 = 0.0272 K, the 27 to 28 mK per beam of the paper.
5. Change *Integration time* to **1** minute: the noise becomes **26.9 mJy**. Four times the time halves the noise, which is why 72 beams at once matter so much for survey speed.

## What researchers can use it for

- **Plan an HI survey**: put in your dish, Tsys and channel width, and find the time per pointing for a target noise in mK with the [[radio-telescope-calculator]].
- **Turn noise into a column density limit** with the 1.823 × 10¹⁸ factor, as the [[hydrogen-line-analyser]] does for a measured line.
- **Check a paper's noise budget** quickly: if the radiometer equation and the stated Tsys disagree, look for the efficiency or weighting that was used.
- **Convert line widths and fluxes** between MHz, km/s and redshift with the [[redshift-calculator]] (radio convention).
- **Teach** why cooled receivers and many beams change what a telescope can do: halve Tsys and you need a quarter of the time.

## The fine print

- This is a recomputation from the paper's rounded values, not a reanalysis of its data.
- The tool's beam uses the 1.2 λ/D rule for a tapered dish; a PAF's formed beams can be a little wider or narrower and change shape across the field.
- The radiometer equation is the ideal case. Real data lose a little to channel weighting, interference flagging and baseline fitting.
- The column density assumes optically thin gas; in the densest LMC clouds the true value is higher.
