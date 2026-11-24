---
title: "A radio-bright little red dot: one flux density, four luminosities"
summary: "A 2026 paper reports the first bright radio detection of a nearby little-red-dot analogue, 3.0 mJy at 3 GHz. We turn that one number into a luminosity, and test whether a twin at redshift 7 would show."
tools: [magnitude-flux-converter, cosmology-calculator, redshift-calculator]
updated: 2026-11-24
sources:
  - "Rodríguez, L. F., Mirabel, I. F., González-Lópezlira, R. A. and Loinard, L. (2026), A Radio-bright Local Little Red Dot Analog, The Astrophysical Journal 1009(2), doi:10.3847/1538-4357/ae9b01. Licence CC BY 4.0, checked on the publisher's Crossref record, 2026-11-24 (iopscience.org blocks automated reading of the article page). Values used here: the source J204837.26−002437.2 at redshift z = 0.4332; a 3.0 GHz flux density of 3.0 ± 0.2 mJy; a spectral index α = −0.39 ± 0.04; a radio luminosity of 1.2 × 10⁴¹ erg s⁻¹; about two orders of magnitude brighter than the two earlier local analogues; radio-loud giant ellipticals and quasars at 10⁴¹ to 10⁴⁶ erg s⁻¹; and the claim that a redshift above 4 twin would still be reachable with the VLA in moderately long integrations."
  - "Planck 2018 cosmology (H0 = 67.66 km/s/Mpc, Ωm = 0.3111, flat, radiation included), the Cosmology calculator's default; distances follow Hogg (1999), Distance measures in cosmology."
  - "AB magnitude zero point 3631 Jy (Oke and Gunn 1983), as used by the Magnitude converter."
paper:
  title: "A Radio-bright Local Little Red Dot Analog"
  authors: "Rodríguez LF, Mirabel IF, González-Lópezlira RA, Loinard L"
  journal: "The Astrophysical Journal"
  year: 2026
  doi: "10.3847/1538-4357/ae9b01"
  url: "https://doi.org/10.3847/1538-4357/ae9b01"
  licence: "CC BY 4.0"
  reviewed: true
---

**Little red dots** are small, very red sources that JWST found in large numbers in the early universe. One of their defining traits is that radio telescopes do not see them. A 2026 paper in *The Astrophysical Journal* breaks that pattern: it reports a nearby little-red-dot analogue, J204837.26−002437.2 at redshift 0.4332, detected at **3.0 ± 0.2 mJy at 3 GHz**, about a hundred times brighter in the radio than the two local analogues found before it. One measured flux density and one redshift are enough to work out what that means, and this article does it with fibub's [[magnitude-flux-converter]] for the flux units and the [[cosmology-calculator]] for the distance. If you only want to know where the light was stretched to, start at the [[redshift-calculator]].

## The paper in brief

The authors observed a local analogue of a little red dot with the Karl G. Jansky Very Large Array at 3 GHz and detected it clearly. Three numbers carry the result: the flux density **3.0 ± 0.2 mJy**, the **spectral index α = −0.39 ± 0.04** (the slope of flux density against frequency, S ∝ ν^α; a shallow slope like this points to partly self-absorbed synchrotron emission from a compact source), and a radio luminosity of **1.2 × 10⁴¹ erg s⁻¹**, which they place at the low end of radio-loud giant ellipticals and quasars (10⁴¹ to 10⁴⁶ erg s⁻¹). They argue the black hole should be an order of magnitude louder in the radio than it is, so something suppresses the emission, and they point out that a twin at redshift above 4 would still be within the VLA's reach.

## Checked with the tools

Everything here is a **recomputation** from those three numbers plus a standard cosmology. Nothing is fitted and nothing is simulated.

**Step 1: the flux density in every unit.** The converter takes 3.0 mJy at a wavelength of 99,930 µm (3 GHz) and gives **3.0 × 10⁻²⁹ W m⁻² Hz⁻¹**, **3.0 × 10⁻²⁶ erg s⁻¹ cm⁻² Hz⁻¹** and **3,000 µJy**. It also gives the AB magnitude: **15.21**. That is a useful mental anchor. On the AB scale, which is defined so that 3631 Jy is magnitude zero at any wavelength, this radio source is as bright as a fifteenth-magnitude star — easy for a small telescope, if only our eyes worked at 10 cm.

**Step 2: the distance.** At z = 0.4332 the cosmology calculator (Planck 2018, flat) gives a **luminosity distance of 2,461 Mpc**, a lookback time of **4.687 billion years** and a distance modulus of **41.96**. One arcsecond on the sky is 5.81 kpc there, so the VLA's A-configuration beam at 3 GHz covers a few kpc: the emission is from the nucleus, not the whole galaxy.

**Step 3: the spectral luminosity.** Combining the two, with the K-correction a power law needs,

L_ν = 4π d_L² S_ν / (1+z)^(1+α)

gives **log L_ν = 24.24** in W Hz⁻¹ at the rest frequency of **4.30 GHz** (3 GHz × 1.4332), or 1.75 × 10²⁴ W Hz⁻¹. Shifted along the measured spectral index to the 1.4 GHz that radio catalogues use, that is **log L₁.₄ = 24.43 W Hz⁻¹**. This is the number to compare with surveys, and it sits squarely in the radio-loud AGN range, which supports the paper's framing.

**Step 4: the luminosity in erg s⁻¹ depends on the band, and by a lot.** The paper quotes 1.2 × 10⁴¹ erg s⁻¹ without stating the band in the part of the text we could read. Our arithmetic gives:

| Definition | Our value (erg s⁻¹) |
|---|---|
| ν L_ν at the observed band (rest 4.30 GHz) | **7.5 × 10⁴⁰** (7.0 to 8.0 × 10⁴⁰ for ±0.2 mJy) |
| ν L_ν at rest 5 GHz | 8.2 × 10⁴⁰ |
| Integrated over rest 1 to 10 GHz | 1.6 × 10⁴¹ |
| Integrated over rest 10 MHz to 100 GHz | 8.4 × 10⁴¹ |
| Paper's stated value | 1.2 × 10⁴¹ |

The paper's number falls between ν L_ν at the observed band and a 1-to-10 GHz integral: within a factor of 1.6 of ours either way, which is exactly what the choice of band and K-correction is worth. The lesson is the one Figure 2 makes: **a radio luminosity in erg s⁻¹ means little without its band**, and the shallow spectrum here makes the whole-band integral wander by a factor of ten. The spectral luminosity in W Hz⁻¹, with its frequency stated, does not have that problem.

<!-- fig:band -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="Two ways of turning the measured flux into a luminosity. The solid line integrates the power-law spectrum from 10 MHz up to the frequency on the axis; the dashed line is nu times the spectral luminosity at that frequency. The paper's 1.2e41 erg per second sits between them near the observed band." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Radio luminosity depends on the band you choose</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Radio luminosity depends on the band you choose</text><line x1="58" x2="546" y1="212.6" y2="212.6" style="stroke:var(--line)"/><text x="52" y="216.6" text-anchor="end" style="fill:var(--muted)">1e40</text><line x1="58" x2="546" y1="141.9" y2="141.9" style="stroke:var(--line)"/><text x="52" y="145.9" text-anchor="end" style="fill:var(--muted)">1e41</text><line x1="58" x2="546" y1="71.3" y2="71.3" style="stroke:var(--line)"/><text x="52" y="75.3" text-anchor="end" style="fill:var(--muted)">1e42</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="210.5" x2="210.5" y1="262" y2="266" style="stroke:var(--muted)"/><text x="210.5" y="279" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="363" x2="363" y1="262" y2="266" style="stroke:var(--muted)"/><text x="363" y="279" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="515.5" x2="515.5" y1="262" y2="266" style="stroke:var(--muted)"/><text x="515.5" y="279" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Upper edge of the band (GHz), log scale</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Luminosity (erg s⁻¹), log scale</text><line x1="58" x2="546" y1="136.3" y2="136.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="131.3" text-anchor="end" style="fill:var(--muted)">paper's 1.2e41</text><line x1="307.1" x2="307.1" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="303.1" y="76" text-anchor="end" style="fill:var(--muted)">4.3 GHz rest</text><path d="M58 214.6L62.1 213.1L66.2 211.6L70.3 210.1L74.4 208.6L78.5 207.2L82.6 205.7L86.7 204.3L90.8 202.9L94.9 201.4L99 200L103.1 198.7L107.2 197.3L111.3 195.9L115.4 194.5L119.5 193.2L123.6 191.9L127.7 190.5L131.8 189.2L135.9 187.9L140 186.6L144.1 185.3L148.2 184L152.3 182.7L156.4 181.4L160.5 180.1L164.6 178.8L168.7 177.5L172.8 176.3L176.9 175L181 173.7L185.1 172.5L189.2 171.2L193.3 170L197.4 168.7L201.5 167.5L205.6 166.2L209.7 165L213.8 163.8L217.9 162.6L222 161.3L226.1 160.1L230.2 158.9L234.3 157.7L238.4 156.4L242.5 155.2L246.6 154L250.7 152.8L254.8 151.6L258.9 150.4L263 149.2L267.1 148L271.2 146.8L275.3 145.6L279.4 144.4L283.5 143.2L287.6 142L291.7 140.8L295.8 139.6L299.9 138.4L304.1 137.2L308.2 136L312.3 134.8L316.4 133.7L320.5 132.5L324.6 131.3L328.7 130.1L332.8 128.9L336.9 127.7L341 126.6L345.1 125.4L349.2 124.2L353.3 123L357.4 121.8L361.5 120.7L365.6 119.5L369.7 118.3L373.8 117.1L377.9 116L382 114.8L386.1 113.6L390.2 112.4L394.3 111.3L398.4 110.1L402.5 108.9L406.6 107.8L410.7 106.6L414.8 105.4L418.9 104.2L423 103.1L427.1 101.9L431.2 100.7L435.3 99.6L439.4 98.4L443.5 97.2L447.6 96.1L451.7 94.9L455.8 93.7L459.9 92.6L464 91.4L468.1 90.2L472.2 89.1L476.3 87.9L480.4 86.7L484.5 85.6L488.6 84.4L492.7 83.2L496.8 82.1L500.9 80.9L505 79.8L509.1 78.6L513.2 77.4L517.3 76.3L521.4 75.1L525.5 73.9L529.6 72.8L533.7 71.6L537.8 70.4L541.9 69.3L546 68.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 221.2L62.1 220L66.2 218.8L70.3 217.7L74.4 216.5L78.5 215.4L82.6 214.2L86.7 213L90.8 211.9L94.9 210.7L99 209.6L103.1 208.4L107.2 207.2L111.3 206.1L115.4 204.9L119.5 203.8L123.6 202.6L127.7 201.4L131.8 200.3L135.9 199.1L140 198L144.1 196.8L148.2 195.7L152.3 194.5L156.4 193.3L160.5 192.2L164.6 191L168.7 189.9L172.8 188.7L176.9 187.5L181 186.4L185.1 185.2L189.2 184.1L193.3 182.9L197.4 181.7L201.5 180.6L205.6 179.4L209.7 178.3L213.8 177.1L217.9 175.9L222 174.8L226.1 173.6L230.2 172.5L234.3 171.3L238.4 170.1L242.5 169L246.6 167.8L250.7 166.7L254.8 165.5L258.9 164.4L263 163.2L267.1 162L271.2 160.9L275.3 159.7L279.4 158.6L283.5 157.4L287.6 156.2L291.7 155.1L295.8 153.9L299.9 152.8L304.1 151.6L308.2 150.4L312.3 149.3L316.4 148.1L320.5 147L324.6 145.8L328.7 144.6L332.8 143.5L336.9 142.3L341 141.2L345.1 140L349.2 138.9L353.3 137.7L357.4 136.5L361.5 135.4L365.6 134.2L369.7 133.1L373.8 131.9L377.9 130.7L382 129.6L386.1 128.4L390.2 127.3L394.3 126.1L398.4 124.9L402.5 123.8L406.6 122.6L410.7 121.5L414.8 120.3L418.9 119.1L423 118L427.1 116.8L431.2 115.7L435.3 114.5L439.4 113.3L443.5 112.2L447.6 111L451.7 109.9L455.8 108.7L459.9 107.6L464 106.4L468.1 105.2L472.2 104.1L476.3 102.9L480.4 101.8L484.5 100.6L488.6 99.4L492.7 98.3L496.8 97.1L500.9 96L505 94.8L509.1 93.6L513.2 92.5L517.3 91.3L521.4 90.2L525.5 89L529.6 87.8L533.7 86.7L537.8 85.5L541.9 84.4L546 83.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 3"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Integrated from 10 MHz up</text><line x1="264" x2="276" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 3"/><text x="280" y="40" style="fill:var(--muted)">ν L_ν at that frequency</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same measurement turned into a luminosity two ways. Which number you quote depends on the band: the paper's 1.2 × 10⁴¹ erg s⁻¹ is what you get near the observed band, not what a 10 MHz to 100 GHz integral gives.</figcaption></figure>
<!-- /fig:band -->

**Step 5: would a twin at redshift 7 still be seen?** This is the paper's forward-looking claim, and it is the cleanest thing to check. Take the same source, put it at redshift z′, and the observed 3 GHz flux density scales as (d_L(z)/d_L(z′))² × ((1+z′)/(1+z))^(1+α). The tools give:

| Redshift | Observed 3 GHz flux | rms needed for a 5σ detection |
|---|---|---|
| 0.4332 (measured) | 3.0 mJy | – |
| 4 | **29.0 µJy** | 5.8 µJy |
| 5 | 19.1 µJy | 3.8 µJy |
| 6 | 13.8 µJy | 2.8 µJy |
| 7 | 10.4 µJy | 2.1 µJy |

A few µJy of rms noise at 3 GHz is within reach of the VLA in integrations of roughly an hour to a few hours, so the paper's claim stands, and the table says what depth to aim for. Notice how slowly the flux falls beyond z = 4: between redshift 4 and 7 it drops only by a factor of three, because the luminosity distance grows slowly while the K-correction pushes back. That flatness is why radio searches for high-redshift sources are worth doing at all.

<!-- fig:zscale -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="The observed 3 GHz flux density of the same radio source if it sat at other redshifts, K-corrected for a spectral index of -0.39. It falls from 3.0 mJy at z = 0.4332 to about 29 µJy at z = 4 and 10 µJy at z = 7." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>The same radio source, moved back in redshift</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">The same radio source, moved back in redshift</text><line x1="58" x2="546" y1="227.2" y2="227.2" style="stroke:var(--line)"/><text x="52" y="231.2" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="156.9" y2="156.9" style="stroke:var(--line)"/><text x="52" y="160.9" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="86.7" y2="86.7" style="stroke:var(--line)"/><text x="52" y="90.7" text-anchor="end" style="fill:var(--muted)">1000</text><line x1="165.7" x2="165.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="165.7" y="251" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="292.5" x2="292.5" y1="234" y2="238" style="stroke:var(--muted)"/><text x="292.5" y="251" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="419.2" x2="419.2" y1="234" y2="238" style="stroke:var(--muted)"/><text x="419.2" y="251" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="546" x2="546" y1="234" y2="238" style="stroke:var(--muted)"/><text x="546" y="251" text-anchor="middle" style="fill:var(--muted)">8</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Redshift z</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Flux density at 3 GHz (µJy), log scale</text><line x1="58" x2="546" y1="194.7" y2="194.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="189.7" text-anchor="end" style="fill:var(--muted)">29 µJy</text><line x1="58" x2="546" y1="225.9" y2="225.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="220.9" text-anchor="end" style="fill:var(--muted)">10 µJy</text><line x1="292.5" x2="292.5" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="296.5" y="44" text-anchor="start" style="fill:var(--muted)">z = 4</text><line x1="482.6" x2="482.6" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="486.6" y="60" text-anchor="start" style="fill:var(--muted)">z = 7</text><path d="M58 28.8L62.1 41.8L66.2 52.7L70.4 62L74.5 70.3L78.6 77.6L82.7 84.2L86.8 90.3L91 95.7L95.1 100.8L99.2 105.5L103.3 109.9L107.4 113.9L111.6 117.8L115.7 121.4L119.8 124.8L123.9 128L128 131L132.2 133.9L136.3 136.7L140.4 139.3L144.5 141.9L148.6 144.3L152.7 146.6L156.9 148.8L161 151L165.1 153L169.2 155L173.3 156.9L177.5 158.8L181.6 160.6L185.7 162.3L189.8 164L193.9 165.7L198.1 167.3L202.2 168.8L206.3 170.3L210.4 171.8L214.5 173.2L218.7 174.6L222.8 175.9L226.9 177.2L231 178.5L235.1 179.8L239.3 181L243.4 182.2L247.5 183.4L251.6 184.5L255.7 185.7L259.9 186.8L264 187.8L268.1 188.9L272.2 189.9L276.3 190.9L280.5 191.9L284.6 192.9L288.7 193.9L292.8 194.8L296.9 195.7L301 196.6L305.2 197.5L309.3 198.4L313.4 199.2L317.5 200.1L321.6 200.9L325.8 201.7L329.9 202.6L334 203.3L338.1 204.1L342.2 204.9L346.4 205.7L350.5 206.4L354.6 207.1L358.7 207.9L362.8 208.6L367 209.3L371.1 210L375.2 210.7L379.3 211.3L383.4 212L387.6 212.7L391.7 213.3L395.8 214L399.9 214.6L404 215.2L408.2 215.8L412.3 216.5L416.4 217.1L420.5 217.7L424.6 218.2L428.8 218.8L432.9 219.4L437 220L441.1 220.5L445.2 221.1L449.4 221.6L453.5 222.2L457.6 222.7L461.7 223.3L465.8 223.8L469.9 224.3L474.1 224.8L478.2 225.3L482.3 225.8L486.4 226.3L490.5 226.8L494.7 227.3L498.8 227.8L502.9 228.3L507 228.8L511.1 229.2L515.3 229.7L519.4 230.2L523.5 230.6L527.6 231.1L531.7 231.5L535.9 232L540 232.4L544.1 232.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="272" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. What the same radio source would look like at higher redshift: the observed 3 GHz flux density, K-corrected for the measured spectral index. The horizontal lines mark the values at z = 4 and z = 7, the range the paper says the VLA could still reach.</figcaption></figure>
<!-- /fig:zscale -->

## How we made the graphs

The charts and every number come from `scripts/blog-figures/radio-bright-little-red-dot-analog-radio-luminosity-from-3ghz-flux.mjs` in fibub's public code. It calls `toJy` and `fromJy` from `src/lib/sci/photometry.ts`, the maths behind the [[magnitude-flux-converter]], and `cosmology` and `omegaR` from `src/lib/sci/cosmo.ts`, the maths behind the [[cosmology-calculator]]. The K-correction and the band integrals are three lines of arithmetic on top of those two.

The flux density, its error, the redshift and the spectral index come from the paper's abstract. The cosmology (Planck 2018, flat, radiation included) is **our choice**, because the part of the paper we could read does not state one; a round H0 = 70, Ωm = 0.3 universe gives a luminosity distance of 2,387 Mpc instead of 2,461, which moves every luminosity down by 6 %. The band definitions in the Step 4 table are **ours**, chosen to bracket what papers normally mean.

## How we test the maths

`npm test` runs `tests/sci.mjs` on every change, and it pins both tools against published values:

- The magnitude converter must put Vega magnitude 0 in Johnson V at **3,636 Jy** and AB magnitude 0 at **3,631 Jy**, give an AB−Vega offset of **1.84 mag** in 2MASS Ks, turn 1 Jy into 10⁻²³ erg s⁻¹ cm⁻² Hz⁻¹, and round-trip f_λ and photon flux back to the same flux density.
- The cosmology calculator must reproduce three exact solutions: the Einstein–de Sitter comoving distance and age, the empty-universe luminosity distance, and the closed-form age of a flat ΛCDM universe. For Planck 2018 it must give an age today of **13.787 Gyr** (the published value) and an angular scale at z = 3 of **7.883 kpc per arcsecond**.
- New with this article, in `tests/sci-tools/magnitude-flux-converter.mjs`: 3.0 mJy at 3 GHz must come out as 3.0 × 10⁻²⁹ W m⁻² Hz⁻¹ and AB magnitude 15.207, and the Planck 2018 luminosity distance at z = 0.4332 must be 2,461.3 Mpc, so that log L_ν = 24.242 W Hz⁻¹ and ν L_ν = 7.5 × 10⁴⁰ erg s⁻¹.

## Check it yourself

First the flux units, on the [[magnitude-flux-converter]] page, in the *Convert* card:

1. Set *Band* to **Any wavelength** and type **99930** in *Wavelength (µm)*. That is 3 GHz; the help line underneath switches to "AB magnitudes and flux units only".
2. Put **3** in *Value* and set *Unit* to **mJy**.
3. The table *Same brightness in every unit* reads **0.0030000 Jy**, **3000 µJy**, **3 × 10⁻²⁹ W m⁻² Hz⁻¹**, **3 × 10⁻²⁶ erg s⁻¹ cm⁻² Hz⁻¹** and, on the *magnitude (AB)* row, **15.207**. Tap any value to copy it.

Then the distance, on the [[cosmology-calculator]] page:

4. Leave *Start from* on **Redshift z**, *Cosmology* on **Planck 2018 (flat)** and *Distances in* on **Mpc**. Type **0.4332** in *Redshift z*.
5. The headline says *Light left 4.687 billion years ago*. In the facts list, *Luminosity distance* reads **2,461 Mpc (8.028 billion light years)** and *Scale* reads **5.809 kpc per arcsecond**.
6. Change *Cosmology* to **H0 = 70, Ωm = 0.3 (flat)** and watch the luminosity distance drop to **2,387 Mpc**: that 3 % in distance is 6 % in every luminosity you derive.
7. Put **4** in *Redshift z* to get a luminosity distance of **36,657 Mpc**, then **7** for **70,487 Mpc**. The ratio of those squares, with the K-correction, is the whole of Step 5.

## What researchers can use it for

- **Turn a catalogue flux into a luminosity** in the unit a referee expects, with the band written down beside it, using the [[magnitude-flux-converter]] and the [[cosmology-calculator]] together.
- **Check a published luminosity** before you build on it: a factor of two usually means a different band or a missing K-correction, not an error.
- **Plan a follow-up observation**: scale a detection to the redshift you care about and read off the rms your proposal needs.
- **Cross-match catalogues at different frequencies** by shifting a flux along a measured spectral index to the 1.4 GHz or 3 GHz of the survey you are comparing with.
- **Teach the AB system**: showing a radio source at AB 15 makes the point that magnitudes are just a logarithmic flux scale, not something optical.

## The fine print

- The paper's article page at the publisher refuses automated reading, so our quoted values come from its abstract and from the publisher's own Crossref record, which states the CC BY 4.0 licence. We could not read its cosmology or its exact luminosity definition, which is why Step 4 gives a range rather than a single comparison.
- The K-correction assumes the single power law the paper fits, extended across the whole band. A real synchrotron spectrum turns over at both ends, so the widest-band integrals in the Step 4 table are upper limits.
- The redshift-scaling in Step 5 keeps the source's intrinsic luminosity fixed. It is a thought experiment about detectability, not a claim that high-redshift little red dots are the same objects.
- Flux densities are from the paper's text; we have not re-reduced the VLA data, and we make no statement about the detection itself.
