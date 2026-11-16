---
title: "Barnard's Star planets: a broken resonant chain explained by a merger"
summary: "Barnard's Star has four small planets whose orbits almost, but not quite, keep step. A new study suggests a fifth planet once merged into planet c. We checked the spacing with Kepler's law."
tools: [habitable-zone-calculator, kepler-orbits, exoplanet-mass-calculator]
updated: 2026-11-16
sources:
  - "Yi, T., Huang, Q., Huang, S. and Ormel, C. W. (2026), Breaking the Chain: The Dynamical History of the Barnard's Star Planetary System, arXiv:2611.13771 (posted 10 November 2026; resubmitted to Research in Astronomy and Astrophysics after minor revision). Preprint, not yet peer-reviewed. Licence CC BY 4.0, checked on the arXiv page, 2026-11-16."
  - "Orbital periods (2.34, 3.15, 4.12 and 6.74 days), minimum masses (0.19 to 0.34 Earth masses), star mass (about 0.16 solar masses) and the habitable zone at periods of about 10 to 42 days: Basant, R. et al. (2025), Four Sub-Earth Planets Orbiting Barnard's Star from MAROON-X and ESPRESSO, ApJ Letters 982, L1, as summarised by AAS Nova, 11 March 2025."
  - "Barnard's Star temperature (about 3,200 K) and power output (about 0.0035 times the Sun's): rounded literature values, used only for the temperature and habitable-zone checks."
  - "Habitable zone limits: Kopparapu, R. K. et al. (2014), ApJ 787, L29."
paper:
  title: "Breaking the Chain: The Dynamical History of the Barnard's Star Planetary System"
  authors: "Yi, T.; Huang, Q.; Huang, S.; Ormel, C. W."
  journal: "arXiv preprint (submitted to Research in Astronomy and Astrophysics)"
  year: 2026
  doi: "10.48550/arXiv.2611.13771"
  url: "https://arxiv.org/abs/2611.13771"
  licence: "CC BY 4.0"
  reviewed: false
---

Barnard's Star, a small red dwarf six light-years away, is the closest single star to the Sun. In 2025 astronomers confirmed that it has four planets, each lighter than Earth, all circling the star in under a week. Their orbits almost fall into a neat pattern, then don't. A new study (a preprint, not yet peer-reviewed) asks why, and suggests that there were once five planets, and two of them collided and merged to make today's planet c. Below we use the Kepler's-law maths in the [[habitable-zone-calculator]] to check the spacing of the orbits and what a merger would need; the [[kepler-orbits]] activity shows the same law for school students.

## What they found

Planets that form in a disc of gas around a young star tend to drift inwards and get caught in **resonances**: one planet goes round exactly 4 times while its outer neighbour goes round 3 times (a 4:3 resonance), or 3 times for every 2, and so on. Several such pairs in a row make a **resonant chain**. Over time many chains break, leaving planets close to simple ratios but not on them.

At Barnard's Star the inner two planets sit just outside a 4:3 ratio, but the next step breaks the pattern. The authors tested whether the system started as a five-planet chain in which two neighbours, which they call c1 and c2, later became unstable and merged into the planet c we see now. They found two ways to push the chain apart enough for this to happen: slow tidal effects from the star over billions of years, or, more likely, pushes from the gas disc while the planets were still forming, which move the two outermost planets apart. Either way the merger can happen.

They also looked at 14 other compact systems of four planets with similar broken chains. In ten of them it is the third planet that breaks the pattern, as it is here. That fits the disc-push route, which tends to break a chain at that point.

## Why it matters

Resonant chains are a fossil record of how planets moved while they were forming. A perfect chain, like the one around TRAPPIST-1, says the planets moved gently. A broken one says something disturbed them later. If merging planets is a common way for chains to break, then many small planets we see today may be the result of two smaller ones colliding, which would affect their make-up and how much water or air they kept. Barnard's Star is close enough that its planets will be studied for decades, so knowing their history matters.

## How they did it

The team ran computer simulations of planets in a gas disc, letting them migrate into a chain, then switching on either the disc's pushes or the star's tides, and following the orbits until planets crossed paths and collided. They then compared the final period ratios with the four planets seen today, and with other known compact four-planet systems.

## Checked with the tools

We cannot repeat the team's simulations here, so we did two simpler checks with Kepler's third law and the published orbits. The periods are rounded values from the 2025 discovery paper; the star's mass is about 0.16 times the Sun's. The second check is **our own sketch** of a merger, not the paper's model.

**Step 1: where the planets are.** Kepler's third law turns each period into a distance from the star. With the habitable zone calculator's maths, the four planets sit at **0.019, 0.023, 0.027 and 0.038 au**: all far closer to their star than Mercury is to the Sun (0.39 au). Barnard's Star is dim, giving out only about 0.0035 times the Sun's power, but even so the planets would be roughly **450 K, 410 K, 375 K and 320 K** if they reflect 30% of the light, too hot for liquid water. The same calculator puts the habitable zone between about 0.049 and 0.128 au, or periods of about **10 to 42 days**, matching the range quoted by the discovery team. No known planet is there.

**Step 2: how close to resonance.** Figure 1 shows the ratio of each pair of neighbouring periods.

<!-- fig:ratios -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="The first pair sits just outside 4:3, the second sits between 4:3 and 5:4, and the third between 3:2 and 5:3: the chain is broken after planet b." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Period ratio of each neighbouring pair</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Period ratio of each neighbouring pair</text><line x1="58" x2="546" y1="235.5" y2="235.5" style="stroke:var(--line)"/><text x="52" y="239.5" text-anchor="end" style="fill:var(--muted)">1.2</text><line x1="58" x2="546" y1="161.5" y2="161.5" style="stroke:var(--line)"/><text x="52" y="165.5" text-anchor="end" style="fill:var(--muted)">1.4</text><line x1="58" x2="546" y1="87.5" y2="87.5" style="stroke:var(--line)"/><text x="52" y="91.5" text-anchor="end" style="fill:var(--muted)">1.6</text><line x1="139.3" x2="139.3" y1="254" y2="258" style="stroke:var(--muted)"/><text x="139.3" y="271" text-anchor="middle" style="fill:var(--muted)">d to b</text><line x1="302" x2="302" y1="254" y2="258" style="stroke:var(--muted)"/><text x="302" y="271" text-anchor="middle" style="fill:var(--muted)">b to c</text><line x1="464.7" x2="464.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="464.7" y="271" text-anchor="middle" style="fill:var(--muted)">c to e</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Pair (inner to outer)</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Outer period ÷ inner period</text><line x1="58" x2="546" y1="235.5" y2="235.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="230.5" text-anchor="end" style="fill:var(--muted)">6:5</text><line x1="58" x2="546" y1="186.2" y2="186.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="181.2" text-anchor="end" style="fill:var(--muted)">4:3</text><line x1="58" x2="546" y1="124.5" y2="124.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="119.5" text-anchor="end" style="fill:var(--muted)">3:2</text><line x1="58" x2="546" y1="62.8" y2="62.8" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="57.8" text-anchor="end" style="fill:var(--muted)">5:3</text><circle cx="139.3" cy="181.5" r="6" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="195.5" r="6" style="fill:var(--c-blog);opacity:1"/><circle cx="464.7" cy="74.2" r="6" style="fill:var(--c-blog);opacity:1"/><text class="fibub-mark" x="546" y="292" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Period ratios of the three neighbouring pairs (periods from Basant et al. 2025, rounded), with simple ratios as dashed lines.</figcaption></figure>
<!-- /fig:ratios -->

| Pair | Period ratio | Nearest simple ratio | Offset | Spacing (mutual Hill radii) |
|---|---|---|---|---|
| d to b | 1.346 | 4:3 | 1.0% wide | about 13 |
| b to c | 1.308 | 9:7 | 1.7% wide | about 11 |
| c to e | 1.636 | 5:3 | 1.8% narrow | about 21 |

Pairs caught in resonance usually sit just *wide* of the exact ratio, by around a percent, as d and b do. The b to c ratio falls between the common first-order ratios (5:4 and 4:3) and only matches a weaker 9:7, while c to e sits on the narrow side of 5:3. So the chain is intact for the first pair and broken after planet b: planet c, the third planet, is the odd one out, as the paper says.

The last column measures how far apart neighbours are compared with the reach of their gravity (the **mutual Hill radius**, for planets of about 0.3 Earth masses). Systems packed closer than about 10 of these tend to become unstable over billions of years. The pairs around planet c are spaced about 11 to 21, so today's system is comfortably stable, but a fifth planet squeezed into the c to e gap would not have been.

**Step 3: what would merge into planet c?** When two planets collide and merge, their combined orbital angular momentum stays the same. For two planets of equal mass on round orbits, that gives a simple rule: the square root of the new orbit's size is the average of the square roots of the old ones. Figure 2 shows every pair of equal planets that would merge into a planet at 4.12 days. For example, planets at **3.6 and 4.7 days** (period ratio 1.30) would do it, as would planets at 3.4 and 4.9 days. Both pairs fit between planet b at 3.15 days and planet e at 6.74 days. So a five-planet layout with two half-size planets in the gap now held by planet c is possible on orbital grounds, which is the starting point of the paper's story. Each half would be about 0.17 Earth masses, since planet c has at least 0.34.

<!-- fig:merge -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="Equal-mass pairs whose merger would leave a planet at 4.12 days: the inner one between planet b and 4.1 days, the outer one between 4.1 days and planet e." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Two planets that would merge into planet c</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Two planets that would merge into planet c</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--line)"/><text x="52" y="258" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="184.6" y2="184.6" style="stroke:var(--line)"/><text x="52" y="188.6" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="115.3" y2="115.3" style="stroke:var(--line)"/><text x="52" y="119.3" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="45.9" y2="45.9" style="stroke:var(--line)"/><text x="52" y="49.9" text-anchor="end" style="fill:var(--muted)">7</text><line x1="58" x2="58" y1="254" y2="258" style="stroke:var(--muted)"/><text x="58" y="271" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="139.3" x2="139.3" y1="254" y2="258" style="stroke:var(--muted)"/><text x="139.3" y="271" text-anchor="middle" style="fill:var(--muted)">3.2</text><line x1="220.7" x2="220.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="220.7" y="271" text-anchor="middle" style="fill:var(--muted)">3.4</text><line x1="302" x2="302" y1="254" y2="258" style="stroke:var(--muted)"/><text x="302" y="271" text-anchor="middle" style="fill:var(--muted)">3.6</text><line x1="383.3" x2="383.3" y1="254" y2="258" style="stroke:var(--muted)"/><text x="383.3" y="271" text-anchor="middle" style="fill:var(--muted)">3.8</text><line x1="464.7" x2="464.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="464.7" y="271" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="546" x2="546" y1="254" y2="258" style="stroke:var(--muted)"/><text x="546" y="271" text-anchor="middle" style="fill:var(--muted)">4.2</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Inner planet's period (days)</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Outer planet's period (days)</text><line x1="58" x2="546" y1="63.9" y2="63.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="58.9" text-anchor="end" style="fill:var(--muted)">Planet e (6.74 d)</text><line x1="119" x2="119" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="123" y="44" text-anchor="start" style="fill:var(--muted)">Planet b</text><path d="M58 150.7L65.7 152.6L73 154.5L80.8 156.5L88.5 158.3L95.8 160.2L103.5 162.1L111.3 163.9L118.6 165.8L126.3 167.6L133.6 169.4L141.4 171.2L149.1 172.9L156.4 174.7L164.1 176.4L171.9 178.2L179.2 179.9L186.9 181.6L194.6 183.3L202 185L209.7 186.7L217.4 188.4L224.7 190L232.5 191.7L239.8 193.3L247.5 195L255.2 196.6L262.6 198.2L270.3 199.7L278 201.3L285.3 202.9L293.1 204.5L300.8 206L308.1 207.5L315.8 209L323.6 210.6L330.9 212.1L338.6 213.6L345.9 215.1L353.6 216.5L361.4 218.1L368.7 219.5L376.4 221L384.1 222.4L391.5 223.8L399.2 225.3L406.9 226.7L414.2 228.1L422 229.4L429.7 230.8L437 232.2L444.7 233.6L452.1 235L459.8 236.3L467.5 237.7L474.8 239L482.6 240.3L490.3 241.7L497.6 243L505.3 244.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="292" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Line: pairs of equal-mass planets whose merger, keeping orbital angular momentum, leaves one planet at planet c's 4.12 days. Made with the Kepler's-law maths in the Habitable zone calculator; a sketch, not the paper's simulation.</figcaption></figure>
<!-- /fig:merge -->

To go further, the [[exoplanet-mass-calculator]] turns a star's wobble into a planet's minimum mass, the method used to find these four planets.

## How we made the graphs

Both charts come from `scripts/blog-figures/barnards-star-broken-resonant-chain-merger.mjs` in fibub's public code. It uses `auForPeriod`, `periodDays`, `tEq` and `habitableZone` from `src/lib/sci/habitable.ts`, the maths behind the [[habitable-zone-calculator]]: Kepler's third law in both directions, the equilibrium temperature, and the Kopparapu habitable zone limits. The period ratios, Hill spacings and the merger line are a few lines of arithmetic on top. The periods and star mass are labelled in the script with their source; the typical planet mass of 0.3 Earth masses is our choice.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks this maths against known answers:

- Earth must come out at 254 K for an albedo of 0.306, and a tidally locked planet that keeps its heat on the day side must be exactly 2^¼ times warmer.
- The Sun's habitable zone must come out at 0.95 to 1.68 au (conservative) and 0.75 to 1.77 au (optimistic), as Kopparapu and colleagues published; it must move inward for a heavier planet, and the tool must warn when a star is too cool for those formulas.

## Check it yourself

1. Open the [[habitable-zone-calculator]]. Under *Star*, type **3200** in *Temperature (K)*, **0.0035** in *Luminosity (Suns)* and **0.16** in *Mass (Suns)*. The habitable zone appears: about **0.06 to 0.12 AU** (conservative) and **0.05 to 0.13 AU** (optimistic).
2. Under *Planet*, leave the distance empty and type **4.12** in *or orbital period (days)* for planet c, and **0.3** in *Albedo*.
3. The distance reads about **0.027 AU** and the equilibrium temperature about **375 K**, well inside the inner edge of the habitable zone.
4. Try **2.34**, **3.15** and **6.74** days for the other three planets, then a period of about **20 days** to see what a habitable-zone planet here would need.
5. For the period ratios, divide neighbouring periods: 3.15 ÷ 2.34 = 1.346, close to 4 ÷ 3 = 1.333.

## What researchers can use it for

- **Place new planets quickly:** turn a list of periods into distances and temperatures in a minute.
- **Spot resonances:** divide neighbouring periods and compare with simple ratios, as in Step 2.
- **Check habitable zone claims** in a paper or press release against the Kopparapu limits.
- **Teach Kepler's third law** with real, nearby planets: the [[kepler-orbits]] activity does it for school classes.

## The fine print

- This is a **preprint, not yet peer-reviewed**. The merger is a proposed history that fits the data, not an observation.
- Our periods are rounded to two decimal places and our planet masses are a typical 0.3 Earth masses, so the offsets and spacings are approximate.
- Step 3 assumes equal masses, round orbits and a perfect merger that keeps all the mass. Real collisions can lose material, and the paper's simulations follow the full motion.
- The masses are minimum masses: if we see the orbits tilted, the true masses are larger.
