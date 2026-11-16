---
title: "Two-stage small satellite launcher from Nuri: staging, delta-v and sizing"
summary: "A 2026 study sizes a two-stage rocket, built from Korea's Nuri, for 500 kg to a 500 km sun-synchronous orbit. We check its delta-v budget and mass with fibub's rocket equation calculator."
tools: [rocket-equation, orbit-transfer-calculator, model-rocket-simulator]
updated: 2026-11-16
sources:
  - "Seo, D. and Kim, H. (2026), Nuri-Derived SmallSat-Dedicated Launch Vehicle: Staging Design, Vehicle Sizing, and MDO-Based Feasibility Assessment, Aerospace 13(9), 801, doi:10.3390/aerospace13090801 (also posted as a preprint, preprints.org 202608.0260). Licence CC BY, as stated by the publisher, checked 2026-11-16. Values used here: specific impulse 299.8 s (first stage) and 360 s (second stage); delta-v budget 10,500 m/s split 4,830 and 5,670 m/s, built from 10,197 m/s plus a 303 m/s margin; losses assumed in the budget of 2,000 m/s (gravity), 300 m/s (steering), 200 m/s (drag) and 85 m/s (dog-leg); first-stage dry mass 4,000 kg at a structural index of 8.6%; second stage 677 kg dry and 4,700 kg propellant (index 12.6%); fairing 300 kg; payload 500 kg target, 530 kg after optimisation; optimised dry masses 4,051 kg (8.7%) and 648 kg (12.1%); thrust-to-weight limit giving at most 53,240 kg at lift-off; optimised delta-v 4,750 m/s at first-stage burnout and 10,344 m/s at second-stage burnout."
  - "Earth's gravitational parameter 398,600.4418 km³/s² and equatorial radius 6,378.137 km (standard values, WGS 84)."
paper:
  title: "Nuri-Derived SmallSat-Dedicated Launch Vehicle: Staging Design, Vehicle Sizing, and MDO-Based Feasibility Assessment"
  authors: "Seo, D.; Kim, H."
  journal: "Aerospace"
  year: 2026
  doi: "10.3390/aerospace13090801"
  url: "https://doi.org/10.3390/aerospace13090801"
  licence: "CC BY"
  reviewed: true
---

Small satellites need rides of their own, to the orbit they want and when they want it. A 2026 study asks whether Korea's three-stage Nuri rocket could be cut down to a dedicated two-stage launcher for a 500 kg satellite. The heart of any such study is the rocket equation: how much speed each stage can give, and how much the whole rocket must weigh. This article uses the [[rocket-equation]] calculator to rebuild the paper's staging design from its published numbers. The [[orbit-transfer-calculator]] covers the burns after orbit is reached, and the [[model-rocket-simulator]] shows the same physics on a hobby rocket, with drag and gravity included.

## The paper in brief

The proposed vehicle keeps Nuri's 75-tonne-force kerosene and liquid oxygen engine for its first stage and adds a new 3-tonne-force upper-stage engine still in development. The target is a 500 km **sun-synchronous orbit**, a near-polar orbit that passes over each place at the same local time. To fly south from the Naro Space Center without passing over other countries, the rocket must turn partway up, a **dog-leg**, which costs extra speed.

The authors first set a **delta-v budget**, the total change of speed the rocket must give, including losses to gravity, drag and steering: **10,500 m/s**, split **4,830 m/s** for the first stage and **5,670 m/s** for the second. From that they sized the stages using **structural indexes**, the share of each stage's mass that is not propellant: 8.6% for the first, 12.6% for the second. Then a **multidisciplinary design optimisation** (MDO) in the ASTOS software flew the trajectory and refined the masses together. The optimised vehicle reaches orbit with **530 kg**, 6% above the target. The authors present this as a feasibility study under their assumptions, not a detailed design.

## Checked with the tools

The Rocket equation calculator applies Tsiolkovsky's equation stage by stage: each stage's ideal delta-v is its **exhaust speed** (Isp × 9.80665 m/s²) times the natural log of its **mass ratio**, mass at ignition over mass at burnout. We used the paper's engines, dry masses, second-stage propellant, fairing and payload. The paper's first-stage propellant was in a table we could not read, so we worked it out from its structural index: 4,000 ÷ 0.086 − 4,000 = **42,512 kg**. We let the 300 kg fairing drop with the first stage, a simplification.

**Step 1: the budget itself.** Circular speed at 500 km is √(μ/r) = **7,613 m/s**. Adding the paper's assumed losses (2,000 + 300 + 200 + 85 m/s) gives 10,198 m/s, matching its 10,197 m/s before the 303 m/s margin.

**Step 2: each stage's delta-v.** The second stage starts at 677 + 4,700 + 500 = 5,877 kg and burns out at 1,177 kg, a mass ratio of 4.99. With an exhaust speed of 3,530 m/s that gives **5,677 m/s**, against the paper's 5,670. The first stage carries everything above it plus the fairing: 52,689 kg at lift-off, 10,177 kg at burnout, a mass ratio of 5.18 and **4,834 m/s** against the paper's 4,830. Total: **10,511 m/s**.

**Step 3: lift-off mass and payload.** The vehicle weighs **52.7 tonnes** at lift-off, inside the 53,240 kg limit the paper sets from the need for a thrust-to-weight ratio of at least 1.3. Its **payload fraction**, payload over lift-off mass, is 0.95%, typical of small launchers. Figure 1 shows how delta-v falls with payload: the curve crosses 10,500 m/s at about **504 kg**.

<!-- fig:payload -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="Delta-v falls as payload grows; the curve crosses the 10.5 km/s budget at about 504 kg." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Delta-v against payload, staging-design vehicle</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Delta-v against payload, staging-design vehicle</text><line x1="58" x2="546" y1="183.5" y2="183.5" style="stroke:var(--line)"/><text x="52" y="187.5" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="120.4" y2="120.4" style="stroke:var(--line)"/><text x="52" y="124.4" text-anchor="end" style="fill:var(--muted)">10.5</text><line x1="58" x2="546" y1="57.2" y2="57.2" style="stroke:var(--line)"/><text x="52" y="61.2" text-anchor="end" style="fill:var(--muted)">11</text><line x1="58" x2="58" y1="234" y2="238" style="stroke:var(--muted)"/><text x="58" y="251" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="234" y2="238" style="stroke:var(--muted)"/><text x="139.3" y="251" text-anchor="middle" style="fill:var(--muted)">250</text><line x1="220.7" x2="220.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="220.7" y="251" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="302" x2="302" y1="234" y2="238" style="stroke:var(--muted)"/><text x="302" y="251" text-anchor="middle" style="fill:var(--muted)">750</text><line x1="383.3" x2="383.3" y1="234" y2="238" style="stroke:var(--muted)"/><text x="383.3" y="251" text-anchor="middle" style="fill:var(--muted)">1e+3</text><line x1="464.7" x2="464.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="464.7" y="251" text-anchor="middle" style="fill:var(--muted)">1.25e+3</text><line x1="546" x2="546" y1="234" y2="238" style="stroke:var(--muted)"/><text x="546" y="251" text-anchor="middle" style="fill:var(--muted)">1.5e+3</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Payload (kg)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Total delta-v (km/s)</text><line x1="58" x2="546" y1="120.4" y2="120.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="115.4" text-anchor="end" style="fill:var(--muted)">budget 10.5 km/s</text><line x1="220.7" x2="220.7" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="224.7" y="44" text-anchor="start" style="fill:var(--muted)">500 kg</text><path d="M58 -103.1L66.1 -88.2L74.3 -73.9L82.4 -60.1L90.5 -46.8L98.7 -33.9L106.8 -21.5L114.9 -9.5L123.1 2.2L131.2 13.5L139.3 24.4L147.5 35.1L155.6 45.4L163.7 55.5L171.9 65.3L180 74.8L188.1 84.1L196.3 93.1L204.4 101.9L212.5 110.5L220.7 118.9L228.8 127.2L236.9 135.2L245.1 143L253.2 150.7L261.3 158.2L269.5 165.5L277.6 172.7L285.7 179.8L293.9 186.7L302 193.5L310.1 200.1L318.3 206.6L326.4 213L334.5 219.3L342.7 225.4L350.8 231.5L358.9 237.4L367.1 243.3L375.2 249L383.3 254.6L391.5 260.2L399.6 265.6L407.7 271L415.9 276.3L424 281.5L432.1 286.6L440.3 291.6L448.4 296.6L456.5 301.5L464.7 306.3L472.8 311L480.9 315.7L489.1 320.3L497.2 324.8L505.3 329.3L513.5 333.8L521.6 338.1L529.7 342.4L537.9 346.6L546 350.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/></svg><figcaption>Figure 1. Total ideal delta-v of the paper's staging-design vehicle against payload, from the Rocket equation calculator's staging maths. First-stage propellant worked out from the paper's structural index; fairing dropped with the first stage.</figcaption></figure>
<!-- /fig:payload -->

**Step 4: the optimised vehicle.** With the optimised dry masses (4,051 and 648 kg), a first-stage propellant again from its index (42,512 kg, the same to within a kilogram) and a 530 kg payload, the calculator gives **10,497 m/s**: a lighter upper stage buys the extra 30 kg of payload at almost exactly the same delta-v. The paper's trajectory optimisation reports 10,344 m/s at second-stage burnout; we cannot tell from the text how that figure accounts for losses, so we do not compare the two directly.

**Step 5: was the split a good one?** Keeping the paper's engines, structural indexes, fairing and 500 kg payload, we sized the stages for every split of the 10,500 m/s and checked each with the calculator (Figure 2). The lightest rocket, **51.7 tonnes**, gives the second stage 5,450 m/s. The paper's 5,670 m/s split needs **52.3 tonnes**, only 1.2% more. The bottom of the curve is flat, so a designer can move the split for other reasons, such as reusing an existing stage or where the spent first stage falls, at very little cost in mass.

<!-- fig:split -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="Lift-off mass is lowest, about 51.7 tonnes, when the second stage gives 5.45 km/s; the paper's 5.67 km/s split needs 52.3 tonnes." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Lift-off mass for each way of splitting 10.5 km/s</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Lift-off mass for each way of splitting 10.5 km/s</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--line)"/><text x="52" y="238" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="170.9" y2="170.9" style="stroke:var(--line)"/><text x="52" y="174.9" text-anchor="end" style="fill:var(--muted)">55</text><line x1="58" x2="546" y1="107.8" y2="107.8" style="stroke:var(--line)"/><text x="52" y="111.8" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="44.6" y2="44.6" style="stroke:var(--line)"/><text x="52" y="48.6" text-anchor="end" style="fill:var(--muted)">65</text><line x1="180" x2="180" y1="234" y2="238" style="stroke:var(--muted)"/><text x="180" y="251" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="332.5" x2="332.5" y1="234" y2="238" style="stroke:var(--muted)"/><text x="332.5" y="251" text-anchor="middle" style="fill:var(--muted)">5.5</text><line x1="485" x2="485" y1="234" y2="238" style="stroke:var(--muted)"/><text x="485" y="251" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Delta-v given to the second stage (km/s)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Lift-off mass (tonnes)</text><line x1="58" x2="546" y1="193.1" y2="193.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="188.1" text-anchor="end" style="fill:var(--muted)">limit 53.2 t</text><line x1="384.3" x2="384.3" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="388.3" y="44" text-anchor="start" style="fill:var(--muted)">paper 5.67</text><path d="M58 79.5L73.3 96.8L88.5 112.6L103.8 126.8L119 139.6L134.2 151.1L149.5 161.5L164.8 170.8L180 179L195.3 186.2L210.5 192.5L225.8 198L241 202.5L256.3 206.2L271.5 209.1L286.7 211.2L302 212.4L317.3 212.9L332.5 212.6L347.7 211.4L363 209.4L378.3 206.6L393.5 202.8L408.8 198.2L424 192.5L439.2 185.8L454.5 178L469.8 168.9L485 158.6L500.2 146.8L515.5 133.5L530.8 118.5L546 101.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/></svg><figcaption>Figure 2. Lift-off mass needed for 10.5 km/s and a 500 kg payload, for each split of the delta-v between the stages, at the paper's engines and structural indexes (each design checked with the calculator's staging maths).</figcaption></figure>
<!-- /fig:split -->

| Check | Paper | Our tool result |
|---|---|---|
| Orbital speed plus losses | 10,197 m/s | 7,613 + 2,585 = 10,198 m/s |
| First-stage delta-v | 4,830 m/s | 4,834 m/s |
| Second-stage delta-v | 5,670 m/s | 5,677 m/s |
| Lift-off mass | at most 53,240 kg | 52,689 kg |
| Payload for 10,500 m/s | 500 kg target | 504 kg |
| Optimised vehicle with 530 kg | reaches orbit | 10,497 m/s ideal |
| Lightest split for 10,500 m/s | 5,670 m/s to stage 2 | 5,450 m/s (51.7 t); paper's split 52.3 t |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/nuri-derived-smallsat-launch-vehicle-staging-delta-v.mjs` in fibub's public code. It calls the Rocket equation calculator's own functions from `src/lib/sci/orbit.ts`:

- `staging` for each stage's mass ratio and delta-v, the lift-off mass and the payload fraction;
- `BODIES` and `G0` for Earth's gravitational parameter and radius and standard gravity.

The engines, masses, structural indexes, budget and limits are the paper's. The first-stage propellant (from the structural index), dropping the fairing with the first stage, and the stage-sizing formula in Step 5 are ours, labelled in the script; every design in Figure 2 is re-checked with `staging`. Nothing is simulated. Run the script and it prints every number and redraws both charts.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the rocket maths against textbook results (Curtis, *Orbital Mechanics for Engineering Students*):

- A stage with a mass ratio of exactly e must give a delta-v equal to its exhaust speed, **300 × 9.80665 = 2,942.0 m/s**.
- A two-stage test rocket (22 t dry and 400 t propellant at 300 s, then 4 t and 100 t at 340 s, with 10 t of payload) must weigh **536,000 kg** and give **11,027.30 m/s**.
- Propellant worked out for 3,000 m/s must give back exactly 3,000 m/s, and the low Earth orbit to geostationary Hohmann transfer must need **2.426** and **1.467 km/s**.

## Check it yourself

On the [[rocket-equation]] calculator:

1. Replace the stage list with these two lines (name, dry mass in kg, propellant in kg, Isp in s):
   `Stage 1 4300 42512 299.8` and `Stage 2 677 4700 360`. The first stage's 4,300 kg includes the 300 kg fairing.
2. Type **500** in *Payload (kg)*.
3. Set *Compare with* to **My own figure** and type **10500** in *Delta-v needed (m/s)*.
4. The headline reads **10.51 km/s in total**. *Mass at ignition* is **52,689 kg** and *Payload fraction* **0.95 %**; *Against the budget* shows **11 m/s to spare**.
5. In the table, the stages' *Delta-v* reads **4,834 m/s** and **5,677 m/s**, with mass ratios 5.177 and 4.993.
6. Change the second line to `Stage 2 648 4700 360`, the first to `Stage 1 4351 42512 299.8`, and *Payload (kg)* to **530**: the total becomes **10.50 km/s**.

## What researchers can use it for

- **Check a staging table in minutes:** paste the stages into the [[rocket-equation]] calculator and see whether the quoted delta-v and masses agree, as in Steps 2 and 3.
- **Trade payload against margin:** the calculator's delta-v against payload chart shows at once how many kilograms each 100 m/s of margin costs.
- **Explore the split:** change one stage's propellant and watch the lift-off mass and delta-v move, to see how flat the optimum is.
- **Plan the burns after orbit:** the [[orbit-transfer-calculator]] gives Hohmann and bi-elliptic transfer costs for raising or changing an orbit.
- **Teach** why rockets have stages, with a real, published vehicle whose numbers students can rebuild.

## The fine print

- The paper's first-stage propellant mass was not available to us; we derived 42,512 kg from its stated dry mass and structural index. The close match in Steps 2 and 4 suggests it is near the paper's value.
- We let the fairing fall with the first stage; in flight it is usually dropped early in the second stage's burn, which would add a little delta-v.
- The rocket equation gives **ideal** delta-v; the losses to gravity, drag and steering are in the paper's budget, not in the calculator.
- Step 5 holds the structural indexes fixed as the stages change size; in a real design they change with size too.
