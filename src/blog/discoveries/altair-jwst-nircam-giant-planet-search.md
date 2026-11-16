---
title: "JWST NIRCam coronagraphy finds no giant planets around Altair"
summary: "JWST looked for young giant planets around Altair, one of the nearest young bright stars, and found none down to sub-Jupiter masses beyond 5 au. We checked why 4.4 microns is the colour to look in."
tools: [blackbody-calculator, habitable-zone-calculator, parallax-reading]
updated: 2026-11-16
sources:
  - "Meshkat, T., Beichman, C., Llop-Sayson, J., Bryden, G. et al. (2026), Searching for Planets around Altair with JWST/NIRCam, The Astronomical Journal 172, 280; arXiv:2611.13132 (posted 9 November 2026). Licence CC BY 4.0, checked on the arXiv page, 2026-11-16. Values used here, from the abstract: distance 5.13 pc, age 88 ± 10 million years, F444W contrast of about 2 × 10⁻⁶ at 1 arcsecond, 1.5 × 10⁻⁷ at 2 arcseconds and a few × 10⁻⁸ beyond 4 arcseconds."
  - "Altair's temperature (about 7,700 K, rounded average of a hotter pole and cooler equator) and radius (about 1.8 solar radii, average of polar and equatorial): Monnier, J. D. et al. (2007), Imaging the Surface of Altair, Science 317, 342."
  - "Planck's law and the small-angle rule (1 arcsecond at 1 parsec is 1 astronomical unit): standard physics."
paper:
  title: "Searching for Planets around Altair with JWST/NIRCam"
  authors: "Meshkat, T.; Beichman, C.; Llop-Sayson, J.; Bryden, G. et al."
  journal: "The Astronomical Journal"
  year: 2026
  doi: "10.48550/arXiv.2611.13132"
  url: "https://arxiv.org/abs/2611.13132"
  licence: "CC BY 4.0"
  reviewed: true
---

Altair, the bright star in the constellation Aquila, is only about 17 light-years away and, at under 100 million years old, surprisingly young. Young giant planets are still warm from their birth, so they glow in infrared light. That makes Altair one of the best stars in the sky to look for planets by taking their picture directly. A team using the James Webb Space Telescope (JWST) did exactly that, twice, and found nothing orbiting it. The nothing is useful: it rules out planets bigger than Jupiter over most of the system. Below we use the [[blackbody-calculator]] to see why the search works best at a wavelength of 4.4 microns, and the [[habitable-zone-calculator]] to show that only a planet still warm from its birth could have been seen.

## What they found

The team pointed JWST's near-infrared camera, NIRCam, at Altair on two dates, with a small mask (a coronagraph) blocking the star's light. NIRCam can take two pictures at once, one in a red filter centred near 2.0 microns (F200W) and one in a longer-wave filter centred near 4.4 microns (F444W). After removing what was left of the starlight, the 4.4-micron images could show a planet two million times fainter than Altair at 1 arcsecond from the star, about seven million times fainter at 2 arcseconds, and around thirty million times fainter beyond 4 arcseconds.

The first pictures showed several faint dots. In the second pictures none of them had moved across the sky together with Altair, as a real planet would, and their colours matched distant background stars. So the team found no planets. Using models of how young giant planets cool, they turned the limits into masses: anything heavier than a little under Jupiter's mass beyond about 5 astronomical units (au), or a little under Saturn's mass beyond about 10 au, would have been seen.

The team also checked how Altair moves against the background stars, and found it should stay at least a few arcseconds from any background star for the next 10 to 20 years. That makes it a clean reference star for future instruments such as the coronagraph on NASA's Roman Space Telescope.

## Why it matters

Most known planets were found indirectly, by the dimming when they cross their star or by the star's wobble. Direct pictures are rarer, and they work best for big, young planets far from their star, exactly the region the indirect methods miss. Each deep search of a nearby young star, even an empty one, tells us how common wide giant planets are. Altair is an unusual case: it spins so fast that it is squashed, it has no known companion, no dusty disc and no family of stars born with it, and yet it is young. Knowing that it has no wide giants is a piece of the puzzle of how planets form around stars heavier than the Sun.

## How they did it

The coronagraph mask blocks most of Altair's light, but some leaks round its edge as a pattern of speckles. The team removed these speckles with image processing, comparing pictures taken at different telescope angles and of a reference star. They then planted fake planets in the data to measure how faint a planet could be and still be found, at each distance from the star. The two filters work together: a real cool planet is far brighter at 4.4 microns than at 2 microns, while a background star looks much the same in both, so the colours sort one from the other.

## Checked with the tools

We do not have the JWST images, so we checked the physics behind the search with fibub's maths, using the reach stated in the paper's abstract, the paper's distance of 5.13 parsecs, and rounded published values for Altair's temperature (7,700 K) and size (1.8 times the Sun). We treated both the star and the planet as perfect glowing bodies (black bodies) and assumed a planet 1.15 times the size of Jupiter, typical for a young giant. These are **our simplifications, not the paper's models**.

**Step 1: from arcseconds to au.** At 5.13 parsecs, 1 arcsecond on the sky is 5.13 au, because 1 arcsecond at 1 parsec is exactly 1 au; the [[parallax-reading]] activity shows where this rule comes from. So the reach at 1, 2 and 4 arcseconds applies at about 5.1, 10.3 and 20.5 au: roughly the distances of Jupiter, Saturn and Uranus from the Sun. The same black-body maths gives Altair a power output about **10 times the Sun's**.

**Step 2: why 4.4 microns?** Figure 1 shows how bright a planet looks next to Altair, for planets from 150 K to 1,050 K. A 500 K planet is about 3.5 millionths as bright as Altair at 4.4 microns, but only about 4 billionths as bright at 2.0 microns: around **900 times** better contrast at the longer wavelength. Cool planets give out most of their light in the infrared, while a 7,700 K star gives out most of its light at visible wavelengths. That is why the planet search uses F444W and why F200W is good for spotting background stars, which are bright in both.

<!-- fig:contrast -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 338" role="img" aria-label="Planet-to-star brightness ratio rises steeply with planet temperature, and is a hundred to a million times higher at 4.44 microns than at 2 microns." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How bright a planet looks next to Altair</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How bright a planet looks next to Altair</text><line x1="58" x2="546" y1="292" y2="292" style="stroke:var(--line)"/><text x="52" y="296" text-anchor="end" style="fill:var(--muted)">1e-14</text><line x1="58" x2="546" y1="248" y2="248" style="stroke:var(--line)"/><text x="52" y="252" text-anchor="end" style="fill:var(--muted)">1e-12</text><line x1="58" x2="546" y1="204" y2="204" style="stroke:var(--line)"/><text x="52" y="208" text-anchor="end" style="fill:var(--muted)">1e-10</text><line x1="58" x2="546" y1="160" y2="160" style="stroke:var(--line)"/><text x="52" y="164" text-anchor="end" style="fill:var(--muted)">1e-8</text><line x1="58" x2="546" y1="116" y2="116" style="stroke:var(--line)"/><text x="52" y="120" text-anchor="end" style="fill:var(--muted)">1e-6</text><line x1="58" x2="546" y1="72" y2="72" style="stroke:var(--line)"/><text x="52" y="76" text-anchor="end" style="fill:var(--muted)">1e-4</text><line x1="85.1" x2="85.1" y1="292" y2="296" style="stroke:var(--muted)"/><text x="85.1" y="309" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="193.6" x2="193.6" y1="292" y2="296" style="stroke:var(--muted)"/><text x="193.6" y="309" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="302" x2="302" y1="292" y2="296" style="stroke:var(--muted)"/><text x="302" y="309" text-anchor="middle" style="fill:var(--muted)">600</text><line x1="410.4" x2="410.4" y1="292" y2="296" style="stroke:var(--muted)"/><text x="410.4" y="309" text-anchor="middle" style="fill:var(--muted)">800</text><line x1="518.9" x2="518.9" y1="292" y2="296" style="stroke:var(--muted)"/><text x="518.9" y="309" text-anchor="middle" style="fill:var(--muted)">1000</text><line x1="58" x2="546" y1="292" y2="292" style="stroke:var(--muted)"/><text x="302" y="330" text-anchor="middle" style="fill:var(--ink)">Planet temperature (K)</text><text transform="translate(14 171) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Planet ÷ star brightness</text><line x1="58" x2="546" y1="109.4" y2="109.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="104.4" text-anchor="end" style="fill:var(--muted)">Reach at 1″</text><line x1="58" x2="546" y1="134.1" y2="134.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="129.1" text-anchor="end" style="fill:var(--muted)">Reach at 2″</text><line x1="58" x2="546" y1="149.5" y2="149.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="144.5" text-anchor="end" style="fill:var(--muted)">Reach at 4″</text><path d="M58 248.6L63.4 235.7L68.8 224.4L74.3 214.2L79.7 205.2L85.1 197L90.5 189.7L96 183L101.4 176.9L106.8 171.2L112.2 166.1L117.6 161.3L123.1 156.9L128.5 152.8L133.9 149L139.3 145.4L144.8 142.1L150.2 139L155.6 136L161 133.3L166.4 130.7L171.9 128.2L177.3 125.9L182.7 123.7L188.1 121.6L193.6 119.6L199 117.7L204.4 115.9L209.8 114.2L215.2 112.6L220.7 111L226.1 109.5L231.5 108.1L236.9 106.7L242.4 105.4L247.8 104.1L253.2 102.9L258.6 101.7L264 100.6L269.5 99.5L274.9 98.5L280.3 97.5L285.7 96.5L291.2 95.6L296.6 94.7L302 93.8L307.4 92.9L312.8 92.1L318.3 91.3L323.7 90.5L329.1 89.8L334.5 89.1L340 88.4L345.4 87.7L350.8 87L356.2 86.4L361.6 85.7L367.1 85.1L372.5 84.5L377.9 83.9L383.3 83.4L388.8 82.8L394.2 82.3L399.6 81.8L405 81.3L410.4 80.8L415.9 80.3L421.3 79.8L426.7 79.3L432.1 78.9L437.6 78.4L443 78L448.4 77.6L453.8 77.2L459.2 76.8L464.7 76.4L470.1 76L475.5 75.6L480.9 75.2L486.4 74.9L491.8 74.5L497.2 74.2L502.6 73.8L508 73.5L513.5 73.1L518.9 72.8L524.3 72.5L529.7 72.2L535.2 71.9L540.6 71.6L546 71.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M123.1 286.5L128.5 277.4L133.9 268.9L139.3 261L144.8 253.6L150.2 246.7L155.6 240.2L161 234L166.4 228.3L171.9 222.8L177.3 217.6L182.7 212.8L188.1 208.1L193.6 203.7L199 199.5L204.4 195.5L209.8 191.7L215.2 188.1L220.7 184.6L226.1 181.3L231.5 178.1L236.9 175.1L242.4 172.1L247.8 169.4L253.2 166.6L258.6 164.1L264 161.6L269.5 159.2L274.9 156.9L280.3 154.6L285.7 152.5L291.2 150.4L296.6 148.4L302 146.4L307.4 144.6L312.8 142.8L318.3 141L323.7 139.3L329.1 137.6L334.5 136L340 134.5L345.4 133L350.8 131.5L356.2 130.1L361.6 128.7L367.1 127.4L372.5 126L377.9 124.8L383.3 123.5L388.8 122.3L394.2 121.1L399.6 120L405 118.9L410.4 117.8L415.9 116.7L421.3 115.7L426.7 114.7L432.1 113.7L437.6 112.7L443 111.8L448.4 110.9L453.8 110L459.2 109.1L464.7 108.3L470.1 107.4L475.5 106.6L480.9 105.8L486.4 105L491.8 104.2L497.2 103.5L502.6 102.7L508 102L513.5 101.3L518.9 100.6L524.3 99.9L529.7 99.3L535.2 98.6L540.6 98L546 97.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">At 4.44 µm (F444W)</text><line x1="213.6" x2="225.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="229.6" y="40" style="fill:var(--muted)">At 2.0 µm (F200W)</text></svg><figcaption>Figure 1. Brightness of a 1.15 Jupiter-radius planet compared with Altair, both treated as perfect glowing bodies, at the two NIRCam filters. Dashed lines: the reach the paper reports at 1, 2 and 4 arcseconds. Made with the Blackbody calculator's maths.</figcaption></figure>
<!-- /fig:contrast -->

**Step 3: how warm would a planet have to be?** Reading across Figure 1, a planet of this size matches the paper's reach if it is about **460 K at 5 au, 340 K at 10 au and 290 K at 20 au**. Now compare that with the warmth Altair's light alone would give a planet at those distances, from the equilibrium temperature in the Habitable zone calculator: only about **200 K, 140 K and 100 K** (Figure 2). Starlight cannot heat a planet enough to be seen. Any planet found this way must still be glowing from the heat of its formation, which is why the search only works because Altair is young.

<!-- fig:warm -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="A planet must be about 460 K at 5 au, 340 K at 10 au and 290 K at 20 au to be seen, far warmer than the 100 to 200 K that Altair's light alone would give it." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Seen only if the planet is still warm from birth</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Seen only if the planet is still warm from birth</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="191.3" y2="191.3" style="stroke:var(--line)"/><text x="52" y="195.3" text-anchor="end" style="fill:var(--muted)">200</text><line x1="58" x2="546" y1="110.5" y2="110.5" style="stroke:var(--line)"/><text x="52" y="114.5" text-anchor="end" style="fill:var(--muted)">400</text><line x1="82.4" x2="82.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="82.4" y="289" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="204.4" x2="204.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="204.4" y="289" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="326.4" x2="326.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="326.4" y="289" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="448.4" x2="448.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="448.4" y="289" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Distance from Altair (au)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Temperature (K)</text><circle cx="85.6" cy="85.9" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="210.7" cy="136" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="461.1" cy="155.3" r="5" style="fill:var(--c-blog);opacity:1"/><path d="M58 180.1L70.2 185.3L82.4 189.7L94.6 193.6L106.8 196.9L119 199.9L131.2 202.5L143.4 204.8L155.6 207L167.8 208.9L180 210.7L192.2 212.3L204.4 213.8L216.6 215.2L228.8 216.5L241 217.8L253.2 218.9L265.4 220L277.6 221L289.8 221.9L302 222.8L314.2 223.7L326.4 224.5L338.6 225.3L350.8 226L363 226.7L375.2 227.4L387.4 228L399.6 228.6L411.8 229.3L424 229.8L436.2 230.3L448.4 230.9L460.6 231.4L472.8 231.9L485 232.3L497.2 232.8L509.4 233.2L521.6 233.7L533.8 234.1L546 234.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Needed to be seen</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">From starlight alone</text></svg><figcaption>Figure 2. Dots: the planet temperature that matches the paper's reported reach at 1, 2 and 4 arcseconds (5.1, 10.3 and 20.5 au). Line: the temperature Altair's light alone would give a planet (albedo 0.3), from the Habitable zone calculator's maths.</figcaption></figure>
<!-- /fig:warm -->

| Check | Paper | Our tool result |
|---|---|---|
| 1, 2, 4 arcseconds in au | 5.1, 10.3 and beyond 20 au | 5.1, 10.3 and 20.5 au |
| Best wavelength for cool planets | F444W (4.4 µm) | about 900 times better contrast than 2.0 µm for a 500 K planet |
| Temperature needed to be seen | (in mass terms, from cooling models) | about 460 K at 5 au, 340 K at 10 au, 290 K at 20 au |
| Warmth from starlight alone | not given | about 200 K, 140 K and 100 K |

The temperatures in Step 3 are a little higher than what the paper's models need. Real giant planets are not perfect black bodies: their atmospheres let extra light out near 4 to 5 microns, so a real planet at a given temperature is brighter there than our simple sum. Read our temperatures as rough upper values. The masses (sub-Jupiter beyond 5 au, sub-Saturn beyond 10 au) need models of how a young planet cools, which we have not done.

## How we made the graphs

Both charts come from `scripts/blog-figures/altair-jwst-nircam-giant-planet-search.mjs` in fibub's public code, which calls the tools' own functions rather than drawing by hand:

- `planckLam` and `star` from `src/lib/sci/blackbody.ts`, the maths behind the [[blackbody-calculator]], give the glow of the star and the planet at each wavelength, and Altair's power output.
- `tEq` from `src/lib/sci/habitable.ts`, the maths behind the [[habitable-zone-calculator]], gives the temperature starlight alone would give a planet.

The paper's numbers (distance and reach) and the literature values for Altair are labelled in the script; the planet size and albedo are marked as our assumptions. Running the script prints every number quoted here and redraws the charts.

## How we test the maths

These functions are checked against known results on every change to fibub (`tests/sci.mjs`):

- Planck's law must put the Sun's peak at 502 nm, matching Wien's law, and the whole spectrum must add up to exactly the Sun's power: one solar luminosity, absolute magnitude 4.82.
- The Sun's share of light between 400 and 700 nm must come out at 36.6%.
- The equilibrium temperature maths must give Earth 254 K, the textbook value, for an albedo of 0.306.

## Check it yourself

1. Open the [[blackbody-calculator]]. Under *I know*, choose **The temperature (K)** and type **7700**.
2. Type **1.8** in *Radius (Suns)* and **5.13** in *Distance (parsecs)*. The luminosity reads about **10 Suns**, and you can see where Altair's light peaks: around 376 nm, in the near ultraviolet.
3. Type **500** in *Compare with (K, optional)*. The two curves show at a glance why a cool planet is best seen far out in the infrared.
4. Now open the [[habitable-zone-calculator]]. Type **7700** in *Temperature (K)*, **10.3** in *Luminosity (Suns)* and **1.8** in *Mass (Suns)*.
5. Type **5.13** in *Distance from the star (AU)* and **0.3** in *Albedo*. The equilibrium temperature reads about **200 K**: far too cold to be seen by JWST at that distance, which is the point of Step 3 above.

## What researchers can use it for

- **Choose a filter:** compare a target star and a planet of a given temperature in the [[blackbody-calculator]] to see which wavelength gives the best contrast.
- **Turn an imaging limit into a temperature:** as in Step 3, before reaching for full atmosphere models.
- **Convert arcseconds to au:** multiply by the distance in parsecs; the [[parallax-reading]] activity explains why.
- **Teach direct imaging:** the two tools together show students why young stars are the best hunting grounds.

## The fine print

- Our checks treat star and planet as perfect black bodies, with an assumed planet size of 1.15 Jupiter radii and rounded values for Altair. The paper uses detailed planet atmosphere models (Sonora Flame Skimmer) instead.
- "A few × 10⁻⁸" beyond 4 arcseconds was taken as 3 × 10⁻⁸ for our sums.
- The limits apply to planets in the parts of the image the team could search; a planet hidden behind the mask, or passing very close to the star at the time, could be missed.
- No planet found is not the same as no planet there. Smaller or older, cooler planets would be too faint.
