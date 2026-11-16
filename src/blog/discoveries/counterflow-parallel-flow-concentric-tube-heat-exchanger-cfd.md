---
title: "Counterflow vs parallel flow in a concentric tube heat exchanger: CFD at equal Reynolds number"
summary: "A 2026 CFD study finds counterflow moves 3 to 4% more heat than parallel flow in a double-pipe exchanger. We rework its outlet temperatures with fibub's effectiveness-NTU maths."
tools: [heat-exchanger-sizing, heat-conduction, dimensionless-numbers]
updated: 2026-11-16
sources:
  - "Dogan, B. (2026), Controlled Conjugate CFD Comparison of Counter-Flow and Parallel-Flow Concentric Tube Heat Exchangers Under Identical Reynolds Conditions for Engine Cooling and Waste Heat Recovery, Processes 14, 1641, doi:10.3390/pr14101641. Licence CC BY, checked on the article, 2026-11-16. Values used here: inlet temperatures 350 K (hot, inner tube) and 300 K (cold, annulus); cold flow 0.042 kg/s; tube length 1,000 mm; inner tube 18/20 mm and outer tube 40/44 mm diameter; Reynolds numbers 1,000 to 2,000; outlet temperatures for both arrangements at five Reynolds numbers; heat duties 504.69 and 598.01 W (counterflow) and 483.91 and 579.66 W (parallel) at Re 1,000 and 2,000; counterflow gain 3.17 to 4.29%; equal pressure drop in both arrangements."
  - "Specific heat of liquid water, about 4,180 J/kg·K near room temperature (our assumption for the cold stream; the paper does not print its fluid properties)."
  - "Effectiveness-NTU relations for counterflow and parallel flow: Kays, W. M. and London, A. L., Compact Heat Exchangers (standard textbook relations)."
paper:
  title: "Controlled Conjugate CFD Comparison of Counter-Flow and Parallel-Flow Concentric Tube Heat Exchangers Under Identical Reynolds Conditions for Engine Cooling and Waste Heat Recovery"
  authors: "Dogan, B."
  journal: "Processes"
  year: 2026
  doi: "10.3390/pr14101641"
  url: "https://www.mdpi.com/2227-9717/14/10/1641"
  licence: "CC BY"
  reviewed: true
---

Every engineering student learns that counterflow beats parallel flow: when two fluids run past each other in opposite directions, more heat crosses between them. But by how much, in a real-sized pipe, with everything else held fixed? A 2026 computer simulation study answers that for a small double-pipe exchanger and finds a modest **3 to 4%**. This article shows how the [[heat-exchanger-sizing]] tool lets anyone rework the paper's numbers from its published outlet temperatures, and what the classic effectiveness-NTU theory says the gap should be. For the wall itself, the [[heat-conduction]] tool works out conduction through a pipe wall, and [[dimensionless-numbers]] turns a flow into a Reynolds number.

## The paper in brief

A **concentric tube** (or double-pipe) heat exchanger is one pipe inside another. Here a hot fluid enters the inner tube (18 mm inside, 1 m long) at 350 K, and a cold fluid flows through the gap around it, the **annulus**, at 300 K and 0.042 kg/s. In **counterflow** the two streams run in opposite directions; in **parallel flow** they run the same way.

The author used **conjugate CFD**, a computer simulation that solves the fluid flow and the heat flow through the solid tube wall together. Everything was kept identical except the flow direction, and the inner flow was run at five **Reynolds numbers** from 1,000 to 2,000 (the Reynolds number compares a flow's momentum with its stickiness; below about 2,300 pipe flow is smooth, or laminar).

The result: counterflow moves **3.17 to 4.29% more heat**, the advantage shrinking as the flow speeds up, with exactly the same pressure drop. The author calls this "thermally significant but hydraulically neutral": a free gain, since no extra pumping is needed. The study is a clean benchmark, not a model of a real engine's cooling channels.

## Checked with the tools

We took the paper's inlet temperatures, cold flow and the outlet temperatures it lists for all ten runs, and put them through the effectiveness-NTU maths behind the Heat exchanger sizing tool. The one number we had to assume is the cold fluid's specific heat (4,180 J/kg·K, water). Everything else follows from energy balances.

**Step 1: the heat duty from temperatures alone.** The cold stream's **capacity rate**, C = flow × specific heat, is 0.042 × 4,180 = **175.6 W/K**. At Re 1,000 in counterflow it warms by 2.87 K, so it picks up **504 W**. The paper's simulation reports 504.69 W: agreement to 0.2%, which also tells us the cold fluid really behaves like water.

**Step 2: the hot stream and the effectiveness.** The hot stream gives up the same 504 W while cooling by 9.74 K, so its capacity rate is **51.7 W/K**. It is the smaller of the two (C<sub>min</sub>), and the **capacity ratio** C<sub>r</sub> = C<sub>min</sub>/C<sub>max</sub> = **0.295**. The **effectiveness**, the heat moved divided by the most that could ever move, C<sub>min</sub> × (350 − 300) K, is **0.195**. As the Reynolds number rises the hot flow grows, C<sub>r</sub> climbs to 0.59, and effectiveness falls to 0.115.

**Step 3: UA and NTU.** The **log-mean temperature difference** (LMTD), the average driving temperature gap along the exchanger, is **43.6 K** for that first run. Duty ÷ LMTD gives **UA = 11.6 W/K**, the exchanger's overall heat transfer conductance. Divided by C<sub>min</sub> that is an **NTU** (number of transfer units, a measure of how "big" the exchanger is thermally) of just **0.22**. Spread over the inner tube's outer surface (0.063 m², our choice of reference area) it is an overall U of about **184 W/m²·K**, a sensible value for laminar water flow.

Figure 1 places all ten runs on the tool's effectiveness curves. They sit right on the lines, as they must, and they all lie at the low-NTU end, between 0.12 and 0.22.

<!-- fig:eps -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Effectiveness rises with NTU; at the paper's small NTU values (0.10 to 0.22) the counterflow and parallel-flow curves almost touch, and the ten CFD runs sit on them." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Effectiveness against NTU at the paper's capacity ratio</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Effectiveness against NTU at the paper's capacity ratio</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="222.7" y2="222.7" style="stroke:var(--line)"/><text x="52" y="226.7" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="173.3" y2="173.3" style="stroke:var(--line)"/><text x="52" y="177.3" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="124" y2="124" style="stroke:var(--line)"/><text x="52" y="128" text-anchor="end" style="fill:var(--muted)">0.3</text><line x1="58" x2="546" y1="74.7" y2="74.7" style="stroke:var(--line)"/><text x="52" y="78.7" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="139.3" y="289" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="220.7" x2="220.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="220.7" y="289" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">0.3</text><line x1="383.3" x2="383.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="383.3" y="289" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="464.7" x2="464.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="464.7" y="289" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">NTU (U A / Cmin)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Effectiveness ε</text><path d="M58 272L66.1 267.1L74.3 262.3L82.4 257.5L90.5 252.8L98.7 248.1L106.8 243.5L114.9 238.9L123.1 234.5L131.2 230.1L139.3 225.7L147.5 221.4L155.6 217.1L163.7 212.9L171.9 208.7L180 204.6L188.1 200.6L196.3 196.5L204.4 192.6L212.5 188.6L220.7 184.8L228.8 180.9L236.9 177.2L245.1 173.4L253.2 169.7L261.3 166.1L269.5 162.5L277.6 158.9L285.7 155.4L293.9 151.9L302 148.5L310.1 145.1L318.3 141.7L326.4 138.4L334.5 135.1L342.7 131.8L350.8 128.6L358.9 125.4L367.1 122.3L375.2 119.2L383.3 116.1L391.5 113L399.6 110L407.7 107L415.9 104.1L424 101.2L432.1 98.3L440.3 95.4L448.4 92.6L456.5 89.9L464.7 87.1L472.8 84.4L480.9 81.7L489.1 79L497.2 76.3L505.3 73.7L513.5 71.2L521.6 68.6L529.7 66L537.9 63.6L546 61.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 272L66.1 267.1L74.3 262.3L82.4 257.5L90.5 252.8L98.7 248.1L106.8 243.5L114.9 239L123.1 234.5L131.2 230.1L139.3 225.7L147.5 221.4L155.6 217.2L163.7 213L171.9 208.9L180 204.8L188.1 200.7L196.3 196.7L204.4 192.8L212.5 188.9L220.7 185.1L228.8 181.3L236.9 177.6L245.1 173.9L253.2 170.2L261.3 166.6L269.5 163.1L277.6 159.6L285.7 156.1L293.9 152.7L302 149.4L310.1 146.1L318.3 142.7L326.4 139.5L334.5 136.3L342.7 133.2L350.8 130L358.9 127L367.1 124L375.2 120.9L383.3 118L391.5 115.1L399.6 112.2L407.7 109.3L415.9 106.5L424 103.7L432.1 101L440.3 98.3L448.4 95.6L456.5 93L464.7 90.4L472.8 87.8L480.9 85.3L489.1 82.8L497.2 80.3L505.3 77.9L513.5 75.5L521.6 73.1L529.7 70.8L537.9 68.5L546 66.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:true"/><circle cx="239.7" cy="175.9" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="215.3" cy="187.7" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="189.4" cy="200.7" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="170.9" cy="210.1" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="161.4" cy="215.1" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="231.9" cy="179.8" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="209" cy="191" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="184.6" cy="203.2" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="167.2" cy="212.1" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="158.1" cy="216.8" r="2.2" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Counterflow (tool)</text><line x1="213.6" x2="225.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:true"/><text x="229.6" y="40" style="fill:var(--muted)">Parallel flow (tool)</text><circle cx="388.6" cy="36" r="4" style="fill:var(--ink)"/><text x="399.6" y="40" style="fill:var(--muted)">CFD runs (paper)</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Effectiveness against NTU from the Heat exchanger sizing tool's maths at Cr = 0.29, with the ten CFD runs placed from the paper's outlet temperatures.</figcaption></figure>
<!-- /fig:eps -->

**Step 4: what theory predicts for the switch.** Here is the useful part. At such small NTU, the counterflow and parallel-flow curves nearly touch. We gave a parallel-flow exchanger the *same* UA and streams as each counterflow run and asked the tool for its duty. At Re 1,000 it predicts **501.7 W** against counterflow's 503.9 W: a gain of only **0.4%**. Across the five runs the ideal gain is 0.3 to 0.4%.

**Step 5: where the rest comes from.** The paper's own runs show 3 to 4.4%. Working back from its outlet temperatures, the two arrangements have almost the same LMTD (43.6 and 43.7 K at Re 1,000), but the parallel-flow run's UA comes out about **4% lower** (11.05 against 11.56 W/K). So in these simulations most of the counterflow advantage shows up as a higher heat transfer conductance, not as a bigger temperature driving force. One possible reason is how the developing laminar temperature profiles at each tube's entrance line up in the two arrangements, but this is our reading of the numbers, not a finding of the paper; the paper itself credits the gain to a higher LMTD.

<!-- fig:gain -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="The CFD gives counterflow 3 to 4.4 percent more heat, while the effectiveness-NTU prediction at equal UA gives only 0.3 to 0.4 percent." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How much more heat counterflow moves</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How much more heat counterflow moves</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="184.7" y2="184.7" style="stroke:var(--line)"/><text x="52" y="188.7" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="117.3" y2="117.3" style="stroke:var(--line)"/><text x="52" y="121.3" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">1e+3</text><line x1="155.6" x2="155.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="155.6" y="269" text-anchor="middle" style="fill:var(--muted)">1.2e+3</text><line x1="253.2" x2="253.2" y1="252" y2="256" style="stroke:var(--muted)"/><text x="253.2" y="269" text-anchor="middle" style="fill:var(--muted)">1.4e+3</text><line x1="350.8" x2="350.8" y1="252" y2="256" style="stroke:var(--muted)"/><text x="350.8" y="269" text-anchor="middle" style="fill:var(--muted)">1.6e+3</text><line x1="448.4" x2="448.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="448.4" y="269" text-anchor="middle" style="fill:var(--muted)">1.8e+3</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">2e+3</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Reynolds number in the inner tube</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Counterflow gain over parallel (%)</text><circle cx="58" cy="105.2" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="155.6" cy="124.7" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="302" cy="120.7" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="448.4" cy="136.9" r="2.2" style="fill:var(--ink);opacity:1"/><circle cx="546" cy="150" r="2.2" style="fill:var(--ink);opacity:1"/><path d="M58 237.5L155.6 238.9L302 240.6L448.4 241.6L546 242.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--ink)"/><text x="74" y="40" style="fill:var(--muted)">Paper (CFD, from its outlet temperatures)</text><line x1="379.2" x2="391.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="395.2" y="40" style="fill:var(--muted)">Tool (ε-NTU at the same UA)</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Extra heat moved by counterflow over parallel flow: the paper's CFD (dots, worked out from its published outlet temperatures) and the tool's ε-NTU prediction for the same UA and streams (line).</figcaption></figure>
<!-- /fig:gain -->

| Check | Paper | Our tool result |
|---|---|---|
| Duty, counterflow, Re 1,000 | 504.69 W | 503.9 W from the cold side's temperatures |
| Duty, parallel, Re 1,000 | 483.91 W | 482.8 W |
| Counterflow gain, Re 1,000 to 2,000 | 4.29% to 3.17% | 4.4% to 3.0% from the outlet temperatures |
| Effectiveness, counterflow | (not given) | 0.195 at Re 1,000 to 0.115 at Re 2,000 |
| NTU, counterflow | (not given) | 0.22 to 0.13 |
| Gain predicted by ε-NTU at equal UA | (not given) | 0.3 to 0.4% |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/counterflow-parallel-flow-concentric-tube-heat-exchanger-cfd.mjs` in fibub's public code. It calls the Heat exchanger sizing tool's own functions from `src/lib/sci/eng-hx.ts`:

- `ends` and `lmtd` for the log-mean temperature difference of each run;
- `effectiveness` for the counterflow and parallel-flow curves, and `ntuFor` to confirm each run's NTU by inverting the curve;
- `rate`, the tool's rating mode, for the parallel-flow duty at the counterflow UA.

Inputs: the inlet temperatures, cold flow, tube sizes and ten pairs of outlet temperatures are the paper's. The water specific heat (4,180 J/kg·K) and the reference area for U (outer surface of the inner tube) are our assumptions, labelled in the script. Nothing is simulated. Run the script and it prints every value and redraws both charts.

## How we test the maths

On every change to fibub, `tests/sci-tools/heat-exchanger-sizing.mjs` pins the tool against independent results:

- Every effectiveness relation is checked against SciPy numerical integration of the two streams' energy balances; at NTU 2 and C<sub>r</sub> 0.5 counterflow must give **0.774600** and parallel flow **0.633475**, to nine decimal places.
- The LMTD of end differences 60 and 20 K must equal 40 / ln 3 = **36.41 K**, and equal ends must give the plain difference.
- The NTU solver must invert the curve: counterflow with ε = 0.9 and C<sub>r</sub> = 1 must give NTU **9**, and parallel flow must report that ε = 0.7 at C<sub>r</sub> = 1 is out of reach. A rating run must balance the hot and cold energy to 1e-9.

## Check it yourself

On the [[heat-exchanger-sizing]] tool, rebuild the paper's first counterflow run (Re 1,000) and then flip it to parallel flow:

1. Under *Streams*, type **76.85** in *Hot inlet (°C)* (350 K), **0.01238** in *Hot flow (kg/s)* and **4.18** in *Hot cp (kJ/kg·K)*. Together these give the hot capacity rate of 51.7 W/K found in Step 2.
2. Type **26.85** in *Cold inlet (°C)* (300 K), **0.042** in *Cold flow (kg/s)* and **4.18** in *Cold cp (kJ/kg·K)*.
3. Under *Exchanger*, set *Arrangement* to **Counterflow (double pipe)** and type **184** in *Overall U (W/m²·K)*.
4. Set *Find* to **Outlets for an area (rating)** and type **0.0628** in *Area (m²)*.
5. The headline should read about **0.5039 kW: hot leaves at 67.11 °C, cold at 29.72 °C** (340.26 and 302.87 K, the paper's values). *NTU* reads 0.2233 and *Effectiveness ε* 0.1947.
6. Change *Arrangement* to **Parallel flow**. The duty drops only to about **0.5017 kW**: the ideal 0.4% gap from Step 4.

## What researchers can use it for

- **Sanity-check a CFD or test-rig table:** turn published outlet temperatures into duty, effectiveness, LMTD, UA and NTU in a minute with the [[heat-exchanger-sizing]] tool, and see whether the energy balances close.
- **Separate the two causes of a performance gap:** compare the measured gain with the ε-NTU gain at equal UA, as in Step 4, to see how much comes from flow arrangement alone and how much from a change in heat transfer coefficient.
- **Decide when arrangement matters:** at NTU below about 0.3 counterflow and parallel flow are nearly equal; above NTU 1 the gap grows quickly. The effectiveness chart in the tool shows this for any C<sub>r</sub>.
- **Estimate the wall's share of U:** the [[heat-conduction]] tool gives conduction through a cylindrical wall, the third resistance alongside the two fluid films.
- **Teach** effectiveness-NTU and LMTD with a clean, published benchmark whose numbers students can reproduce.

## The fine print

- All ten runs' inlet and outlet temperatures, the cold flow and the geometry are the paper's. The specific heat of 4,180 J/kg·K is our assumption; the paper does not print its fluid properties. The near-perfect match of the duty in Step 1 supports it.
- The outlet temperatures are given to 0.01 K, and the cold stream warms by only about 3 K, so values worked out from them carry an uncertainty of a few tenths of a percent. That is small next to the 4% UA difference in Step 5.
- The U value depends on which area you choose; we used the inner tube's outer surface. UA and NTU do not depend on that choice.
- The paper's simulations are laminar and steady with fixed properties, as it says; real engine coolant loops are often turbulent, where the picture can differ.
