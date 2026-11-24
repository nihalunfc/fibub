---
title: "The 8 April 2024 eclipse: station obscuration and the ionospheric drop"
summary: "A multi-instrument study finds the ionosphere's electron content fell further where more of the Sun was covered. We recompute the eclipse at its VLF station: contact times within four seconds, and the obscuration curve behind the result."
tools: [eclipse-finder, sun-position-calculator, object-altitude, sky-events-calendar]
updated: 2026-11-24
sources:
  - "Sanyal, A., Brawar, B., Maity, S.K., Jana, S., Polard, J.M., Newton, P., Williams, G.S., Potirakis, S.M., Haralambous, H., Balasis, G. et al. (2025), Investigation of the Ionospheric Effects of the Solar Eclipse of April 8, 2024 Using Multi-Instrument Measurements, Atmosphere 16(2): 161, doi:10.3390/atmos16020161. Licence CC BY 4.0, checked on the MDPI article page and in the Crossref record, 2026-11-24. Values used here: VLF receiver at 36.99° N, 76.95° W, 30 m elevation, with first contact 18:02:53 UT, maximum 19:19:19 UT, last contact 20:31:48 UT and an eclipse magnitude of 0.834; the global partial phase 15:42 to 20:52 UT and totality 16:38 to 19:55 UT; station obscurations of 100 % (NRC1), 94.29 % (HLFX), 90.67 % (INEG), 100 % (P777), 98.52 % (SA56), 92.59 % (P776) and 90.94 % (TNCU), with TEC depletions of 50.92 %, 63.56 %, 18.09 %, 25.95 %, 54.84 %, 59.36 % and 22.37 %; GNSS, GIM and DLR maps, Swarm and COSMIC-2 data over 7 to 9 April 2024."
  - "Sun and Moon positions, eclipse searches and contact times: astronomy-engine by Don Cross (MIT licence), as used by fibub's Eclipse finder."
paper:
  title: "Investigation of the Ionospheric Effects of the Solar Eclipse of April 8, 2024 Using Multi-Instrument Measurements"
  authors: "Sanyal A, Brawar B, Maity SK, Jana S, Polard JM, Newton P, Williams GS, Potirakis SM, Haralambous H, Balasis G et al."
  journal: "Atmosphere"
  year: 2025
  doi: "10.3390/atmos16020161"
  url: "https://www.mdpi.com/2073-4433/16/2/161"
  licence: "CC BY 4.0"
  reviewed: true
---

When the Moon's shadow crosses a continent, the ionosphere above it loses electrons, because the sunlight that makes them is switched off for a few minutes. A 2025 paper in *Atmosphere* studied that for the total solar eclipse of 8 April 2024, using GNSS total electron content, global ionospheric maps, two satellite missions and a very-low-frequency radio link, and found that the depletion grows with how much of the Sun was covered at each station. That makes the local obscuration the key number in the study, so it is worth checking: the [[eclipse-finder]] reproduces the paper's three contact times at its VLF station to within four seconds. Afterwards, the [[sun-position-calculator]] gives the Sun's height at that moment, and the [[object-altitude]] planner and [[sky-events-calendar]] help you set up for the next one.

## The paper in brief

The authors watched three days, 7 to 9 April 2024, so that the eclipse day could be compared with a quiet day either side. Geomagnetic indices were quiet, so changes in the ionosphere can be read as the eclipse's work rather than a storm's.

Two kinds of measurement matter here:

- **Total electron content (TEC)** from GNSS receivers, which counts the electrons in a column between satellite and receiver. Stations across Canada, the United States and Mexico show a clear drop around the eclipse, and the paper reports depletions from about 18 % to about 64 % at stations whose obscuration ran from about 90 % to 100 %. The stated pattern is that the deeper the eclipse, the deeper the drop.
- **A VLF radio path** recorded at a rural site in southeastern Virginia, at 36.99° N, 76.95° W, 30 m above sea level. For that station the paper gives the eclipse magnitude, 0.834, and the three contact times: first contact 18:02:53 UT, maximum 19:19:19 UT and last contact 20:31:48 UT. VLF amplitudes generally fell, with more irregular fluctuation, because the radio waves bounce off a layer that the eclipse changed.

The paper also gives the whole eclipse's span: a partial phase from 15:42 to 20:52 UT somewhere on Earth, with totality between 16:38 and 19:55 UT.

## Checked with the tools

The Eclipse finder works out, for one place on Earth, when an eclipse starts, peaks and ends there, how much of the Sun is covered, and how high the Sun stands. We gave it the paper's VLF station, to the 0.01° the paper states, and asked for April 2024.

| Check | Paper | Eclipse finder | Difference |
|---|---|---|---|
| First contact | 18:02:53 UT | 18:02:56 UT | 4 s |
| Maximum | 19:19:19 UT | 19:19:22 UT | 3 s |
| Last contact | 20:31:48 UT | 20:31:51 UT | 4 s |
| Eclipse magnitude at maximum | 0.834 | 0.8336 | 0.0004 |
| Sun's area covered at maximum | not stated | 80.08 % | — |
| Sun's height at maximum | not stated | 48.4° | — |
| Point of greatest eclipse on Earth | not stated | 25.29° N, 104.14° W (Durango, Mexico) | — |

Four seconds on a 149-minute eclipse is as close as these predictions get; it is within the second-level differences that come from the Moon's exact shape and the model of Earth's figure. The eclipse lasted **148.9 minutes** at that station.

**Magnitude is not obscuration.** This is the trap in reading a paper like this one. The paper's 0.834 is the *magnitude*: the share of the Sun's **diameter** the Moon covers. The quantity that matters for lost sunlight, and the one the GNSS station table reports, is the *obscuration*: the share of the Sun's **area**. At this station the tool gives 83.36 % of the diameter but only **80.08 %** of the area. The gap grows for shallower eclipses, so a table that mixes the two will show a scatter that looks physical and is not. Figure 1 shows the obscuration through the eclipse.

<!-- fig:curve -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 290" role="img" aria-label="Share of the Sun's area covered by the Moon at the paper's VLF station in southeastern Virginia, minute by minute, peaking at 80.1 per cent at 19:19:22 UT." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>The Sun covered, as the paper’s VLF station saw it</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">The Sun covered, as the paper’s VLF station saw it</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--line)"/><text x="52" y="248" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="196.9" y2="196.9" style="stroke:var(--line)"/><text x="52" y="200.9" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="149.8" y2="149.8" style="stroke:var(--line)"/><text x="52" y="153.8" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="102.7" y2="102.7" style="stroke:var(--line)"/><text x="52" y="106.7" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="55.6" y2="55.6" style="stroke:var(--line)"/><text x="52" y="59.6" text-anchor="end" style="fill:var(--muted)">80</text><line x1="75.4" x2="75.4" y1="244" y2="248" style="stroke:var(--muted)"/><text x="75.4" y="261" text-anchor="middle" style="fill:var(--muted)">18:00</text><line x1="162.6" x2="162.6" y1="244" y2="248" style="stroke:var(--muted)"/><text x="162.6" y="261" text-anchor="middle" style="fill:var(--muted)">18:30</text><line x1="249.7" x2="249.7" y1="244" y2="248" style="stroke:var(--muted)"/><text x="249.7" y="261" text-anchor="middle" style="fill:var(--muted)">19:00</text><line x1="336.9" x2="336.9" y1="244" y2="248" style="stroke:var(--muted)"/><text x="336.9" y="261" text-anchor="middle" style="fill:var(--muted)">19:30</text><line x1="424" x2="424" y1="244" y2="248" style="stroke:var(--muted)"/><text x="424" y="261" text-anchor="middle" style="fill:var(--muted)">20:00</text><line x1="511.1" x2="511.1" y1="244" y2="248" style="stroke:var(--muted)"/><text x="511.1" y="261" text-anchor="middle" style="fill:var(--muted)">20:30</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--muted)"/><text x="302" y="282" text-anchor="middle" style="fill:var(--ink)">Time on 8 April 2024 (UT, hours)</text><text transform="translate(14 138) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Sun’s area covered (%)</text><line x1="58" x2="546" y1="55.4" y2="55.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="50.4" text-anchor="end" style="fill:var(--muted)">80.1 % at maximum</text><line x1="84" x2="84" y1="32" y2="244" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="88" y="44" text-anchor="start" style="fill:var(--muted)">first contact 18:02:56</text><line x1="306" x2="306" y1="32" y2="244" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="310" y="58" text-anchor="start" style="fill:var(--muted)">maximum 19:19:22</text><line x1="516.6" x2="516.6" y1="32" y2="244" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="512.6" y="72" text-anchor="end" style="fill:var(--muted)">last contact 20:31:51</text><path d="M84 244L86.9 243.6L89.8 242.8L92.6 241.9L95.5 240.7L98.4 239.5L101.3 238L104.2 236.5L107.1 234.9L109.9 233.1L112.8 231.3L115.7 229.4L118.6 227.4L121.5 225.3L124.4 223.2L127.3 220.9L130.1 218.7L133 216.3L135.9 213.9L138.8 211.4L141.7 208.9L144.6 206.4L147.4 203.7L150.3 201.1L153.2 198.3L156.1 195.6L159 192.8L161.9 189.9L164.7 187.1L167.6 184.1L170.5 181.2L173.4 178.2L176.3 175.2L179.2 172.2L182 169.1L184.9 166L187.8 162.9L190.7 159.7L193.6 156.5L196.5 153.3L199.3 150.1L202.2 146.9L205.1 143.7L208 140.4L210.9 137.2L213.8 133.9L216.6 130.6L219.5 127.3L222.4 124.1L225.3 120.8L228.2 117.5L231.1 114.3L234 111L236.8 107.8L239.7 104.6L242.6 101.4L245.5 98.2L248.4 95.1L251.3 92L254.1 89L257 86L259.9 83.1L262.8 80.3L265.7 77.5L268.6 74.8L271.4 72.3L274.3 69.8L277.2 67.5L280.1 65.4L283 63.4L285.9 61.5L288.7 59.9L291.6 58.5L294.5 57.3L297.4 56.4L300.3 55.7L303.2 55.3L306 55.2L308.9 55.4L311.8 55.8L314.7 56.5L317.6 57.4L320.5 58.6L323.3 60.1L326.2 61.7L329.1 63.6L332 65.7L334.9 67.9L337.8 70.2L340.7 72.8L343.5 75.4L346.4 78.1L349.3 81L352.2 83.9L355.1 86.9L358 90L360.8 93.1L363.7 96.3L366.6 99.6L369.5 102.8L372.4 106.1L375.3 109.5L378.1 112.8L381 116.2L383.9 119.6L386.8 123L389.7 126.4L392.6 129.8L395.4 133.3L398.3 136.7L401.2 140.1L404.1 143.5L407 146.9L409.9 150.3L412.7 153.7L415.6 157.1L418.5 160.4L421.4 163.7L424.3 167L427.2 170.3L430 173.6L432.9 176.8L435.8 180L438.7 183.2L441.6 186.3L444.5 189.4L447.4 192.4L450.2 195.4L453.1 198.4L456 201.3L458.9 204.2L461.8 207L464.7 209.8L467.5 212.5L470.4 215.1L473.3 217.7L476.2 220.2L479.1 222.6L482 225L484.8 227.2L487.7 229.4L490.6 231.5L493.5 233.5L496.4 235.4L499.3 237.1L502.1 238.8L505 240.2L507.9 241.6L510.8 242.7L513.7 243.5L516.6 244" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="282" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The Sun's covered area through the eclipse at the paper's VLF station (36.99° N, 76.95° W), worked out with the Eclipse finder's maths. The dashed lines are the tool's own contact times, which land within four seconds of the three times the paper states.</figcaption></figure>
<!-- /fig:curve -->

**Why the stations ran from 90 % to 100 %.** The paper's finding is a relation between obscuration and depletion, and obscuration is pure geometry. Figure 2 runs the same calculation along the station's own meridian, 76.95° W, from Florida to Quebec. The covered area climbs from 40.9 % at 26° N through 54.5 % at 30° N, 83.9 % at 38° N and 98.3 % at 42° N, reaching 100 % where the path of totality crosses that meridian, between 43° and 44° N. A network spread over the eastern half of North America therefore samples the top of that curve, which is why the paper's obscurations cluster between 90 and 100 % while its depletions spread over a factor of three. The spread in depletion is not coming from the spread in obscuration alone.

<!-- fig:lat -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="Greatest obscuration against latitude along the longitude of the paper's VLF station. It climbs from under 50 per cent in Florida to 100 per cent on the path of totality near 43 to 44 degrees north." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Greatest obscuration along the 76.95° W meridian</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Greatest obscuration along the 76.95° W meridian</text><line x1="58" x2="546" y1="205.9" y2="205.9" style="stroke:var(--line)"/><text x="52" y="209.9" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="149.8" y2="149.8" style="stroke:var(--line)"/><text x="52" y="153.8" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="93.7" y2="93.7" style="stroke:var(--line)"/><text x="52" y="97.7" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="37.6" y2="37.6" style="stroke:var(--line)"/><text x="52" y="41.6" text-anchor="end" style="fill:var(--muted)">100</text><line x1="139.3" x2="139.3" y1="234" y2="238" style="stroke:var(--muted)"/><text x="139.3" y="251" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="241" x2="241" y1="234" y2="238" style="stroke:var(--muted)"/><text x="241" y="251" text-anchor="middle" style="fill:var(--muted)">35</text><line x1="342.7" x2="342.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="342.7" y="251" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="444.3" x2="444.3" y1="234" y2="238" style="stroke:var(--muted)"/><text x="444.3" y="251" text-anchor="middle" style="fill:var(--muted)">45</text><line x1="546" x2="546" y1="234" y2="238" style="stroke:var(--muted)"/><text x="546" y="251" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Latitude (°N)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Sun’s area covered at maximum (%)</text><line x1="58" x2="546" y1="37.6" y2="37.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="32.6" text-anchor="end" style="fill:var(--muted)">totality</text><line x1="281.5" x2="281.5" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="285.5" y="58" text-anchor="start" style="fill:var(--muted)">the VLF station</text><path d="M58 203.4L78.3 194.1L98.7 184.7L119 175L139.3 165.2L159.7 155.3L180 145.2L200.3 135L220.7 124.7L241 114.3L261.3 103.9L281.7 93.4L302 82.9L322.3 72.4L342.7 62L363 51.8L383.3 42.2L403.7 37.6L424 37.6L444.3 40.9L464.7 50.2L485 60.2L505.3 70.4L525.7 80.5L546 90.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="272" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How much of the Sun was covered at greatest eclipse, against latitude, along the station’s meridian. The paper’s result that the ionospheric depletion grows with obscuration is a statement about this curve.</figcaption></figure>
<!-- /fig:lat -->

**Our note of caution on the regression.** The seven stations the paper names pair obscurations of 90 to 100 % with depletions of 18 to 64 %, and two stations at exactly 100 % differ by a factor of two (50.92 % and 25.95 %). Our recomputation says the obscuration axis there is only 10 percentage points wide, and the deepest and shallowest depletions do not sit at its ends. That is a point about what the geometry can and cannot explain, not a criticism of the measurements; it is the sort of thing worth checking with the tool before fitting a line.

## How we made the graphs

Both charts and every recomputed number come from `scripts/blog-figures/april-2024-solar-eclipse-obscuration-tec-depletion-local-times.mjs` in fibub's public code. It uses:

- `solarEclipses` from `src/lib/astro/eclipses.ts`, the maths behind the [[eclipse-finder]]. It searches for eclipses at one observer's position, and returns the kind, the local contact times, the obscuration, the magnitude, the Sun's altitude at each contact and the point of greatest eclipse. Positions come from the open-source astronomy-engine library, which allows for the flattened shape of the Earth at the observer's own place.
- `sunMoon` and `overlap` from the same file, for the minute-by-minute curve: `sunMoon` gives the Moon's offset from the Sun in degrees and both discs' radii, and `overlap` is the exact area of two overlapping circles, as a share of the Sun's disc.
- `sunAltAz` from `src/lib/astro/sun.ts`, behind the [[sun-position-calculator]], for the Sun's altitude and azimuth at maximum.

The station coordinates (36.99° N, 76.95° W, 30 m), the three contact times and the magnitude come from the paper's text. The 76.95° W meridian profile in Figure 2 is **our own** extension, not in the paper: one eclipse search per degree of latitude from 26° N to 50° N. Nothing here is fitted; it is all geometry.

## How we test the maths

The same eclipse code is pinned in `tests/sci.mjs`, which `npm test` runs on every change:

- **This very eclipse, from Toronto.** It must come out partial there and total elsewhere, with an obscuration of 0.999 (tolerance 0.002), beginning at 18:04 UT and ending at 20:31 UT, each to within 2 minutes.
- **Niagara Falls, a little further south,** must come out total, with totality lasting 213 s to within 10 s.
- **The total lunar eclipse of 14 March 2025 from Toronto** must give the four umbral contacts at 05:09, 06:26, 07:31 and 08:47 UT, each within 1.5 minutes of NASA's published times, and an umbral magnitude of 1.178 (NASA's value) within 0.01.
- **New with this article**, in `tests/sci-tools/eclipse-finder.mjs`: the paper's own station. The eclipse must come out partial there and total elsewhere, its three contact times must land within 5 s of the published ones, the magnitude must be 0.834, the obscuration 80.08 %, the Sun 48.39° high, greatest eclipse at 25.29° N, 104.14° W, and the meridian profile must give 54.5 % at 30° N, 91.3 % at 40° N and totality at 43° N.
- **`overlap`, the circle-on-circle area,** is checked against exact values: 1 for concentric equal discs, 0 for touching discs, and (2π/3 − √3/2)/π for equal discs half a radius apart, to 1 part in 10⁹.

Those checks are the reason we can quote four seconds against a published value without hedging: the same code already lands within a minute or two of NASA's own numbers for several eclipses, including this one seen from another place.

## Check it yourself

The Eclipse finder lists eclipses from today onwards, so you cannot replay April 2024 on its page. Two checks are open to you instead.

**The Sun at the moment of maximum**, on the [[sun-position-calculator]]:

1. In the place card, set *Times in* to **UTC**, then type *Latitude* **36.99**, *Longitude* **-76.95** and *Height (m)* **30**.
2. In the *When* card set *Date* to **2024-04-08** and *Time* to **19:19**.
3. The headline reads **48.4° above the horizon, towards the south-west (azimuth 233.2°)**, and the facts list gives *Altitude* **48.44°**, *Azimuth* **233.16° (SW)** and *Distance* **1.00149 AU**. That is the geometry the eclipse happened in: a high Sun, so the shadow crossed a long, slanted column of ionosphere.

**The next eclipse at the same station**, on the [[eclipse-finder]]:

1. Type the same latitude, longitude and height, with *Times in* on **UTC**.
2. Set *Look ahead* to **10 years** and *Show* to **Solar only**.
3. The first row is **26 Jan 2028**, *Solar, partial here (annular elsewhere)*, **13:56–15:40**, **5 % of the Sun**, with the Sun **24°** high.
4. The row after it, **14 Jan 2029**, covers **38 %** of the Sun with the Sun 32° high: a far better test of an ionospheric instrument from that site than the 2028 one.

## What researchers can use it for

- **Get the local obscuration right before you correlate anything.** One search per station gives obscuration, magnitude and contact times from coordinates alone, and keeps the two "how much was covered" numbers apart.
- **Choose stations for the next eclipse.** Run the latitude or longitude profile for your own network and see where the curve is steep, which is where a relation between obscuration and response can actually be measured.
- **Timestamp an event.** Contact times to the second, for any place and any eclipse from 1700 to 2300, mean a data gap or an amplitude step can be tied to first contact rather than to a rounded minute.
- **Plan the instrument, not just the site.** The Sun's altitude at maximum, from the [[sun-position-calculator]], tells you the slant path through the ionosphere, the air mass for an optical measurement and whether a fixed antenna sees anything.
- **Teach the difference** between a 90 % eclipse by diameter and by area, with the numbers in front of the class.

## The fine print

- The paper measures the ionosphere. Everything we recompute is eclipse geometry: contact times, obscuration, magnitude and the Sun's position.
- Contact times from any almanac differ by a second or two depending on the Moon's assumed figure and the lunar ephemeris. Ours agree with the paper to within four seconds, which is all a comparison like this can claim.
- Figure 2 is a profile along one meridian, not a map of the eclipse path. Obscuration also changes along a line of latitude.
- We did not recompute the obscurations of the named GNSS stations, because the paper's table of their coordinates is an image that we could not read, and we will not guess a station's position.
- Nothing here checks the TEC or VLF measurements themselves, which need the authors' own data.
