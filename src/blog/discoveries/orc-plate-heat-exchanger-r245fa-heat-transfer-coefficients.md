---
title: "R245fa in a plate evaporator: measured heat-transfer coefficients for an organic Rankine cycle"
summary: "A test rig boiled R245fa in a brazed plate heat exchanger heated by silicone oil and found that existing correlations miss the measured heat transfer. We show what the overall U does to an evaporator with fibub's Heat exchanger sizing tool."
tools: [heat-exchanger-sizing]
updated: 2026-11-16
sources:
  - "Chen, Y., Wen, C., Zhang, J. and Sakai, H. (2025), Experimental Investigation of Heat Transfer Coefficients in a Plate Heat Exchange for an Organic Rankine Cycle, Energies 18(24), 6573, doi:10.3390/en18246573. Licence CC BY 3.0, checked on the publisher's page, 2026-11-16. Values used here: brazed plate evaporator with 30 chevron plates; R245fa heated by silicone oil; saturation temperature 62.8 to 86.2 °C; mass flux 5.0 to 16.6 kg/(m²·s); heat flux 3.1 to 9.2 kW/m²; heat source 100 to 130 °C; new correlation with a mean absolute error of 15.9 %."
  - "Effectiveness-NTU and LMTD relations as used by the Heat exchanger sizing tool (standard heat-transfer textbook forms)."
paper:
  title: "Experimental Investigation of Heat Transfer Coefficients in a Plate Heat Exchange for an Organic Rankine Cycle"
  authors: "Chen, Y.; Wen, C.; Zhang, J.; Sakai, H."
  journal: "Energies"
  year: 2025
  doi: "10.3390/en18246573"
  url: "https://www.mdpi.com/1996-1073/18/24/6573"
  licence: "CC BY 3.0"
  reviewed: true
---

An **organic Rankine cycle** (ORC) turns low-temperature heat, such as factory waste heat or geothermal water, into electricity. It works like a steam engine, but boils a fluid with a low boiling point, such as **R245fa**, instead of water. The heart of the cycle is the **evaporator**, where hot oil or water boils the fluid. How well heat crosses its plates, the **heat-transfer coefficient**, sets how big and how costly it must be. A team in the UK and Japan measured that coefficient in a small plate evaporator and compared it with the formulas engineers use. This article puts the idea into numbers with the [[heat-exchanger-sizing]] tool.

## The paper in brief

The team built an ORC test rig with a **brazed plate heat exchanger** of 30 chevron plates as the evaporator. Silicone oil at **100 to 130 °C** heated R245fa, which entered as cold liquid (30 to 54 °C below boiling), boiled at **62.8 to 86.2 °C**, and left as superheated vapour. Mass flux ran from 5.0 to 16.6 kg/(m²·s) and heat flux from 3.1 to 9.2 kW/m², both low by refrigeration standards.

The findings, in short:

- Both the overall and the refrigerant-side coefficients **rose with hotter oil and with more flow**, peaked at moderate conditions, and fell when the superheated part of the plates was squeezed.
- Existing correlations (Amalfi, Han and Zheng for boiling; Hsieh et al. for subcooled boiling; Longo et al. for boiling plus superheat) showed **pronounced deviations** from the measurements at these low flows.
- The authors fitted a **new correlation** covering the subcooled, boiling and superheated zones, with a mean absolute error of **15.9 %**. Measurement uncertainty in the refrigerant coefficient was 5.2 to 14.8 %.

## Checked with the tools

We did not have the paper's per-test data, so we did not refit its correlation. What we show is why the coefficient matters, with the exact functions behind the Heat exchanger sizing tool and an **illustrative, simulated** evaporator.

**Step 1: effectiveness and NTU.** The tool's ε-NTU maths says how much of the possible heat a given exchanger delivers. A boiling stream stays at one temperature, so its heat-capacity ratio Cr is 0. Figure 1 shows that at NTU = 1 a counterflow unit reaches ε = **0.632** with a boiling stream, **0.565** for a liquid preheat at Cr = 0.5, and only **0.518** in parallel flow.

<!-- fig:entu -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Effectiveness rises with NTU and levels off; a boiling stream (Cr = 0) gives the highest effectiveness for the same NTU." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Effectiveness against NTU, counterflow</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Effectiveness against NTU, counterflow</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="227.6" y2="227.6" style="stroke:var(--line)"/><text x="52" y="231.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="183.2" y2="183.2" style="stroke:var(--line)"/><text x="52" y="187.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="138.8" y2="138.8" style="stroke:var(--line)"/><text x="52" y="142.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="94.4" y2="94.4" style="stroke:var(--line)"/><text x="52" y="98.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="272" y2="276" style="stroke:var(--muted)"/><text x="180" y="289" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="424" x2="424" y1="272" y2="276" style="stroke:var(--muted)"/><text x="424" y="289" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">NTU = UA / Cmin</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Effectiveness ε</text><path d="M58 272L70.2 250.9L82.4 231.8L94.6 214.5L106.8 198.8L119 184.6L131.2 171.8L143.4 160.2L155.6 149.7L167.8 140.3L180 131.7L192.2 123.9L204.4 116.9L216.6 110.5L228.8 104.7L241 99.5L253.2 94.8L265.4 90.6L277.6 86.7L289.8 83.2L302 80L314.2 77.2L326.4 74.6L338.6 72.3L350.8 70.1L363 68.2L375.2 66.5L387.4 64.9L399.6 63.5L411.8 62.2L424 61.1L436.2 60L448.4 59.1L460.6 58.2L472.8 57.4L485 56.7L497.2 56.1L509.4 55.5L521.6 55L533.8 54.5L546 54.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 272L70.2 251.4L82.4 233.4L94.6 217.7L106.8 203.9L119 191.6L131.2 180.6L143.4 170.8L155.6 161.9L167.8 153.9L180 146.6L192.2 140L204.4 134L216.6 128.4L228.8 123.3L241 118.6L253.2 114.3L265.4 110.3L277.6 106.7L289.8 103.2L302 100L314.2 97.1L326.4 94.3L338.6 91.8L350.8 89.4L363 87.1L375.2 85L387.4 83.1L399.6 81.2L411.8 79.5L424 77.9L436.2 76.4L448.4 74.9L460.6 73.6L472.8 72.3L485 71.1L497.2 70L509.4 68.9L521.6 67.9L533.8 67L546 66.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 272L70.2 251.4L82.4 233.6L94.6 218.4L106.8 205.2L119 193.9L131.2 184.2L143.4 175.8L155.6 168.6L167.8 162.4L180 157L192.2 152.4L204.4 148.5L216.6 145.1L228.8 142.1L241 139.6L253.2 137.4L265.4 135.6L277.6 133.9L289.8 132.6L302 131.4L314.2 130.3L326.4 129.5L338.6 128.7L350.8 128L363 127.5L375.2 127L387.4 126.6L399.6 126.2L411.8 125.9L424 125.6L436.2 125.4L448.4 125.2L460.6 125.1L472.8 124.9L485 124.8L497.2 124.7L509.4 124.6L521.6 124.5L533.8 124.4L546 124.4" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Boiling zone (Cr = 0)</text><line x1="235.2" x2="247.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="251.2" y="40" style="fill:var(--muted)">Liquid preheat (Cr = 0.5)</text><line x1="441.2" x2="453.2" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="457.2" y="40" style="fill:var(--muted)">Parallel, Cr = 0.5</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Counterflow effectiveness against NTU from the tool's maths, for a boiling stream (Cr = 0) and a liquid preheat (Cr = 0.5), with parallel flow for comparison. Textbook relations; no paper data.</figcaption></figure>
<!-- /fig:entu -->

**Step 2: a simulated ORC evaporator.** Our own example, inside the paper's ranges: silicone oil at **120 °C**, **0.5 kg/s**, cp **1.6 kJ/kg·K**, boiling R245fa at **75 °C**, and **2 m²** of plate. We model only the boiling zone, so the cold stream is given a huge flow (Cr ≈ 0). Figure 2 sweeps the overall U. At U = 500 W/m²·K the duty is **25.7 kW**, the oil leaves at **87.9 °C** and the LMTD is **25.7 K**. Lower U to 400 (20 % less, about the spread the new correlation still leaves) and the duty falls to **22.8 kW**; raise it to 600 and it climbs to **28.0 kW**. A 15 to 20 % error in U is roughly a 9 to 11 % error in duty here, or the same share of plate area when sizing.

<!-- fig:duty -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="With 2 m² of plate, duty rises from about 8 kW at U = 100 to about 35 kW at U = 1500, flattening as the oil outlet nears the boiling temperature." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Simulated ORC evaporator: heat taken from the oil</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Simulated ORC evaporator: heat taken from the oil</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--line)"/><text x="52" y="238" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="177.9" y2="177.9" style="stroke:var(--line)"/><text x="52" y="181.9" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="121.8" y2="121.8" style="stroke:var(--line)"/><text x="52" y="125.8" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="65.7" y2="65.7" style="stroke:var(--line)"/><text x="52" y="69.7" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="58" y1="234" y2="238" style="stroke:var(--muted)"/><text x="58" y="251" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="234" y2="238" style="stroke:var(--muted)"/><text x="139.3" y="251" text-anchor="middle" style="fill:var(--muted)">250</text><line x1="220.7" x2="220.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="220.7" y="251" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="302" x2="302" y1="234" y2="238" style="stroke:var(--muted)"/><text x="302" y="251" text-anchor="middle" style="fill:var(--muted)">750</text><line x1="383.3" x2="383.3" y1="234" y2="238" style="stroke:var(--muted)"/><text x="383.3" y="251" text-anchor="middle" style="fill:var(--muted)">1e+3</text><line x1="464.7" x2="464.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="464.7" y="251" text-anchor="middle" style="fill:var(--muted)">1.25e+3</text><line x1="546" x2="546" y1="234" y2="238" style="stroke:var(--muted)"/><text x="546" y="251" text-anchor="middle" style="fill:var(--muted)">1.5e+3</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Overall U (W/m²·K)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Duty (kW)</text><path d="M90.5 189.3L123.1 154.5L155.6 127.4L188.1 106.3L220.7 89.9L253.2 77.1L318.3 59.3L383.3 48.6L448.4 42L546 36.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="272" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Simulated: silicone oil at 120 °C, 0.5 kg/s, heating R245fa boiling at 75 °C across 2 m² of plate, for a range of overall U. Our illustration, not the study's measurements.</figcaption></figure>
<!-- /fig:duty -->

| Check | Paper | Our tool result (simulated) |
|---|---|---|
| More heat transfer with hotter oil | measured | duty grows with the oil-to-boiling temperature difference (LMTD) |
| Correlation error matters | old correlations deviate; new one 15.9 % mean error | U 400 vs 500 vs 600 gives 22.8, 25.7, 28.0 kW |
| Boiling side behaves as Cr = 0 | boiling at fixed saturation temperature | ε = 1 − e^(−NTU): 0.632 at NTU 1 |

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/orc-plate-heat-exchanger-r245fa-heat-transfer-coefficients.mjs` in fibub's public code. It calls `effectiveness`, `rate` and `lmtd` from `src/lib/sci/eng-hx.ts`, the maths behind the Heat exchanger sizing tool.

Where the inputs come from: the oil temperature range and the boiling temperature range are from the paper. The 120 °C oil, 0.5 kg/s, 75 °C boiling point, 2 m² and the U values are **our own simulated example**, not the paper's rig. We copied none of the paper's tables or figures.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/heat-exchanger-sizing.mjs`, which checks:

- every effectiveness relation (counterflow, parallel, shell and tube, three crossflow types) against SciPy numerical integration of the stream energy balances;
- that Cr = 0 (boiling or condensing) gives 1 − e^(−NTU) for every type, the case used in Figure 2;
- the LMTD formula, the 1-2 shell correction factor F, NTU from ε, and that a rating run balances energy on both sides.

## Check it yourself

On the [[heat-exchanger-sizing]] tool:

1. Set *Hot inlet (°C)* to **120**, *Hot flow (kg/s)* to **0.5** and *Hot cp (kJ/kg·K)* to **1.6**.
2. Set *Cold inlet (°C)* to **75**, *Cold flow (kg/s)* to **1000** and leave *Cold cp (kJ/kg·K)* at **4.18** (a huge flow stands in for boiling).
3. Choose *Arrangement* **Counterflow (double pipe)** and *Overall U (W/m²·K)* **500**.
4. Set *Find* to **Outlets for an area (rating)** and *Area (m²)* to **2**.
5. The tool should give about **25.7 kW** with the hot outlet near **87.9 °C**. Try U = 400 and 600 to see the duty move.

## What researchers can use it for

- **Turn a correlation's error into kilowatts**: rate an evaporator at U ± the correlation's error to see how much duty or area is at stake.
- **Size first-cut ORC evaporators and preheaters** with the sizing mode before detailed plate design.
- **Teach ε-NTU and LMTD** with a boiling stream (Cr = 0) next to a liquid preheat.
- **Check reported duties** in test-rig papers from the stated temperatures, flows and area.

## The fine print

- Our example is simulated and models only the boiling zone; a real ORC evaporator also has a subcooled and a superheated zone with different U values, which the paper treats separately.
- A plate exchanger is close to, but not exactly, counterflow; the tool has no plate-specific option.
- The paper's results hold for its low mass and heat fluxes and one plate design; other plates and fluids may differ.
- Use measured or vendor data and the paper itself for any real design.
