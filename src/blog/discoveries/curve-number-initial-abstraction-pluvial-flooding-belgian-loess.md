---
title: "Curve number initial abstraction and pluvial flooding on Belgian loess"
summary: "A 1 m flood model tested on 39 storms finds the standard SCS curve number rule misses most runoff from small storms. We show why with the Runoff calculator."
tools: [runoff-calculator, unit-hydrograph, flood-frequency]
updated: 2026-11-16
sources:
  - "Herpoel, M., Baert, P., Bielders, C., Swerts, G. and Degré, A. (2026), High-resolution mapping of pluvial flooding in ungauged agricultural catchments, Hydrology and Earth System Sciences 30, 6661-6699, doi:10.5194/hess-30-6661-2026. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here: outlets of 84 and 111 ha, longest flow path 2036 m, mean slope 3.8%, 98% arable land, 820 mm rain a year, 39 events from 2014 to 2024 (35 below a 2-year return period), initial abstraction ratios 0.2, 0.05 (with S0.05 = 1.42 S0.2) and Jain's 0.3 with exponent 1.5, volume bias of -91% (standard), about -71% (Woodward), about -60% (Hawkins) and +16% (Jain), median KGE 0.35 and 0.34 for the two routing methods, 5 to 10 m grids overestimating peaks by 25 to 28%."
  - "Curve number 78 for row crops on hydrologic soil group B: USDA Natural Resources Conservation Service (1986), Urban Hydrology for Small Watersheds, Technical Release 55, table 2-2 (a handbook value; our stand-in, not the paper's table)."
  - "S0.05 = 1.42 S0.2: Hawkins, R. H., Jiang, R., Woodward, D. E., Hjelmfelt, A. T. and Van Mullem, J. A. (2002), Runoff curve number method: examination of the initial abstraction ratio, Proceedings of the Second Federal Interagency Hydrologic Modeling Conference."
  - "Jain initial abstraction, Ia = λ S (P / (P + S))^α: Jain, M. K., Mishra, S. K. and Singh, V. P. (2006), Evaluation of AMC-dependent SCS-CN-based models using watershed characteristics, Water Resources Management 20, 531-552."
  - "Kirpich time of concentration, tc = 0.0195 L^0.77 S^-0.385 (minutes, L in metres): Kirpich, Z. P. (1940), Civil Engineering 10(6), 362."
paper:
  title: "High-resolution mapping of pluvial flooding in ungauged agricultural catchments"
  authors: "Herpoel, M.; Baert, P.; Bielders, C.; Swerts, G.; Degré, A."
  journal: "Hydrology and Earth System Sciences"
  year: 2026
  doi: "10.5194/hess-30-6661-2026"
  url: "https://hess.copernicus.org/articles/30/6661/2026/"
  licence: "CC BY 4.0"
  reviewed: true
---

Not all floods come from rivers. A short, heavy summer storm on bare farmland can send muddy water down a valley and into a village with no river nearby. This is **pluvial flooding**, and it is hard to predict where nobody measures the flow. A new peer-reviewed study tested a 1 m resolution model on a small Belgian farm catchment and found that one small choice in the classic curve number method decides whether the model sees most of the runoff or almost none. This article uses the [[runoff-calculator]] to show why, with the [[unit-hydrograph]] for the shape of the flood and [[flood-frequency]] for the design storm behind it.

## The paper in brief

The team studied a 111 ha catchment in the **Belgian loess belt**, gentle hills of fine wind-blown silt that is 98% ploughed fields. Rain gauges logged every 5 minutes, and two outlets (84 and 111 ha) measured the flow for **39 storms** between 2014 and 2024. Most were ordinary: 35 had a return period under 2 years.

Their model works out, for every 1 m square, how much rain becomes runoff and how fast it travels down the flow paths. The runoff part uses the **SCS curve number method**, the most widely used rule of thumb in small-catchment hydrology. A curve number (CN, from 30 to 100) describes how much rain a soil and land use can soak up. The method also needs an **initial abstraction**, Ia: the rain held by leaves, puddles and the first wetting of the soil before any water runs off. The classic rule sets Ia = 0.2 S, where S is the soil's maximum retention.

The team compared four ways to set Ia:

- the standard **0.2 S** underestimated runoff volume by **91%**;
- **0.05 S** (with S raised by 1.42, as Hawkins and colleagues proposed) was off by about 60 to 71%;
- the **Jain** rule, where Ia shrinks as the storm gets bigger, did best, with a bias of **+16%**.

Even so, the model's skill stayed modest. Runoff on these silty soils depends more on how intense the rain is than on how much falls. That is something a single fixed curve number cannot capture. Coarser grids of 5 to 10 m overestimated peak flows by 25 to 28%, so fine detail matters.

## Checked with the tools

The paper's curve number table is an image we did not read. We therefore used a stand-in: **CN 78**, the usual handbook value for row crops on soil group B. This is **our assumption**, not the paper's. All values below are **calculations** with the Runoff calculator's maths, not the paper's results. The tool has the 0.2 and 0.05 rules built in. The Jain rule is not in the tool, so we added it in two lines of our own that reuse the tool's retention and runoff equations.

**Step 1: the threshold.** With CN 78 the maximum retention is S = 25400/78 − 254 = **71.6 mm**. The standard rule holds back Ia = 0.2 × 71.6 = **14.3 mm** before any water runs off. The 0.05 rule first raises S to 102 mm, then holds back only **5.1 mm**. The Jain rule holds back even less in small storms: 2.2 mm for a 20 mm storm.

**Step 2: runoff from storms of every size.** Figure 1 shows the runoff from one storm of 0 to 80 mm. Under the standard rule a 10 mm storm gives no runoff at all, and a 20 mm storm gives just **0.42 mm**. The 0.05 rule gives 1.9 mm, and the Jain rule 3.6 mm.

<!-- fig:q -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="For a curve number of 78, the standard rule gives no runoff until 14 mm of rain, while the 0.05 rule and the Jain rule start much earlier and give more runoff from small and medium storms." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Runoff from one storm, CN 78, three ways to start runoff</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Runoff from one storm, CN 78, three ways to start runoff</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="216.5" y2="216.5" style="stroke:var(--line)"/><text x="52" y="220.5" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--line)"/><text x="52" y="165" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="105.5" y2="105.5" style="stroke:var(--line)"/><text x="52" y="109.5" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="272" y2="276" style="stroke:var(--muted)"/><text x="180" y="289" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="424" x2="424" y1="272" y2="276" style="stroke:var(--muted)"/><text x="424" y="289" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Storm rainfall P (mm)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Runoff depth Q (mm)</text><path d="M58 272L64.1 272L70.2 272L76.3 272L82.4 272L88.5 272L94.6 272L100.7 272L106.8 272L112.9 272L119 272L125.1 272L131.2 272L137.3 272L143.4 272L149.5 271.9L155.6 271.8L161.7 271.4L167.8 271L173.9 270.4L180 269.7L186.1 268.8L192.2 267.9L198.3 266.8L204.4 265.6L210.5 264.3L216.6 262.9L222.7 261.5L228.8 259.8L234.9 258.2L241 256.4L247.1 254.5L253.2 252.6L259.3 250.6L265.4 248.5L271.5 246.3L277.6 244.1L283.7 241.8L289.8 239.4L295.9 236.9L302 234.4L308.1 231.8L314.2 229.2L320.3 226.5L326.4 223.8L332.5 221L338.6 218.1L344.7 215.2L350.8 212.2L356.9 209.2L363 206.2L369.1 203.1L375.2 200L381.3 196.7L387.4 193.5L393.5 190.2L399.6 186.9L405.7 183.6L411.8 180.2L417.9 176.8L424 173.3L430.1 169.8L436.2 166.3L442.3 162.7L448.4 159.1L454.5 155.5L460.6 151.8L466.7 148.1L472.8 144.4L478.9 140.7L485 136.9L491.1 133.1L497.2 129.3L503.3 125.4L509.4 121.5L515.5 117.6L521.6 113.7L527.7 109.7L533.8 105.7L539.9 101.7L546 97.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 272L64.1 272L70.2 272L76.3 272L82.4 272L88.5 272L94.6 271.9L100.7 271.8L106.8 271.6L112.9 271.2L119 270.7L125.1 270.2L131.2 269.6L137.3 268.8L143.4 268L149.5 267.1L155.6 266.1L161.7 265.1L167.8 264L173.9 262.7L180 261.4L186.1 260.1L192.2 258.6L198.3 257.1L204.4 255.5L210.5 253.9L216.6 252.2L222.7 250.5L228.8 248.6L234.9 246.7L241 244.8L247.1 242.8L253.2 240.8L259.3 238.6L265.4 236.5L271.5 234.3L277.6 232L283.7 229.7L289.8 227.3L295.9 224.9L302 222.5L308.1 220L314.2 217.4L320.3 214.9L326.4 212.2L332.5 209.6L338.6 206.9L344.7 204.1L350.8 201.3L356.9 198.5L363 195.6L369.1 192.7L375.2 189.8L381.3 186.9L387.4 183.9L393.5 180.8L399.6 177.8L405.7 174.7L411.8 171.5L417.9 168.3L424 165.2L430.1 161.9L436.2 158.7L442.3 155.4L448.4 152.1L454.5 148.7L460.6 145.4L466.7 142L472.8 138.6L478.9 135.1L485 131.6L491.1 128.1L497.2 124.6L503.3 121.1L509.4 117.5L515.5 113.9L521.6 110.3L527.7 106.7L533.8 103.1L539.9 99.4L546 95.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 272L64.1 271.9L70.2 271.7L76.3 271.4L82.4 270.9L88.5 270.4L94.6 269.8L100.7 269.1L106.8 268.2L112.9 267.3L119 266.3L125.1 265.3L131.2 264.1L137.3 262.9L143.4 261.6L149.5 260.2L155.6 258.7L161.7 257.2L167.8 255.7L173.9 254L180 252.3L186.1 250.6L192.2 248.7L198.3 246.9L204.4 244.9L210.5 242.9L216.6 240.9L222.7 238.8L228.8 236.6L234.9 234.4L241 232.2L247.1 229.8L253.2 227.5L259.3 225.1L265.4 222.7L271.5 220.2L277.6 217.6L283.7 215.1L289.8 212.4L295.9 209.7L302 207.1L308.1 204.3L314.2 201.5L320.3 198.7L326.4 195.9L332.5 193L338.6 190L344.7 187L350.8 184L356.9 181L363 177.9L369.1 174.8L375.2 171.7L381.3 168.5L387.4 165.3L393.5 162.1L399.6 158.8L405.7 155.5L411.8 152.2L417.9 148.8L424 145.5L430.1 142.1L436.2 138.6L442.3 135.2L448.4 131.7L454.5 128.2L460.6 124.6L466.7 121.1L472.8 117.5L478.9 113.9L485 110.3L491.1 106.6L497.2 102.9L503.3 99.2L509.4 95.5L515.5 91.7L521.6 88L527.7 84.2L533.8 80.4L539.9 76.5L546 72.7" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Ia = 0.2 S (standard)</text><line x1="235.2" x2="247.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="251.2" y="40" style="fill:var(--muted)">Ia = 0.05 S, S × 1.42</text><line x1="412.4" x2="424.4" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/><text x="428.4" y="40" style="fill:var(--muted)">Jain (λ 0.3, α 1.5)</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Runoff depth against storm rainfall for a curve number of 78 (our assumption for arable loess), with the Runoff calculator's two initial-abstraction rules and our own lines for the Jain rule the paper found best. Calculated, not measured.</figcaption></figure>
<!-- /fig:q -->

**Step 3: small storms are where it matters.** Figure 2 shows the same results as a ratio. At 20 mm of rain the 0.05 rule gives **4.6 times** the standard runoff and Jain **8.5 times**. By 80 mm the three rules are within about 15%. The paper's storms were mostly small and common, so a model using the 0.2 rule would miss most of the runoff. That matches the 91% underestimate the paper found.

<!-- fig:ratio -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Near the 14 mm threshold the other two rules give several times the standard runoff; by 80 mm the three agree within about 10 to 30 percent." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How many times more runoff than the standard rule</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How many times more runoff than the standard rule</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="211.6" y2="211.6" style="stroke:var(--line)"/><text x="52" y="215.6" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="171.2" y2="171.2" style="stroke:var(--line)"/><text x="52" y="175.2" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="130.8" y2="130.8" style="stroke:var(--line)"/><text x="52" y="134.8" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="90.4" y2="90.4" style="stroke:var(--line)"/><text x="52" y="94.4" text-anchor="end" style="fill:var(--muted)">8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="139.3" x2="139.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="139.3" y="269" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="220.7" x2="220.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="220.7" y="269" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="383.3" x2="383.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="383.3" y="269" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="464.7" x2="464.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="464.7" y="269" text-anchor="middle" style="fill:var(--muted)">70</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Storm rainfall P (mm)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Runoff ÷ standard runoff</text><line x1="58" x2="546" y1="231.8" y2="231.8" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="226.8" text-anchor="end" style="fill:var(--muted)">Same as standard</text><path d="M58 159.5L66.1 175.4L74.3 186.4L82.4 194.2L90.5 199.9L98.7 204.3L106.8 208L114.9 210.8L123.1 213.2L131.2 215.2L139.3 216.9L147.5 218.3L155.6 219.5L163.7 220.5L171.9 221.5L180 222.3L188.1 223.1L196.3 223.7L204.4 224.3L212.5 224.9L220.7 225.3L228.8 225.9L236.9 226.3L245.1 226.5L253.2 227L261.3 227.4L269.5 227.6L277.6 227.8L285.7 228.2L293.9 228.4L302 228.6L310.1 228.8L318.3 229L326.4 229.2L334.5 229.4L342.7 229.4L350.8 229.6L358.9 229.8L367.1 230L375.2 230L383.3 230.2L391.5 230.2L399.6 230.4L407.7 230.4L415.9 230.6L424 230.6L432.1 230.8L440.3 230.8L448.4 230.8L456.5 231L464.7 231L472.8 231L480.9 231.2L489.1 231.2L497.2 231.2L505.3 231.4L513.5 231.4L521.6 231.4L529.7 231.4L537.9 231.6L546 231.6" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 79.9L66.1 114.6L74.3 137.9L82.4 154.2L90.5 166.4L98.7 175.4L106.8 182.7L114.9 188.6L123.1 193.2L131.2 197.1L139.3 200.5L147.5 203.3L155.6 205.7L163.7 207.8L171.9 209.6L180 211.2L188.1 212.6L196.3 214L204.4 215L212.5 216.2L220.7 217.1L228.8 217.9L236.9 218.7L245.1 219.5L253.2 220.1L261.3 220.7L269.5 221.3L277.6 221.7L285.7 222.3L293.9 222.7L302 223.1L310.1 223.5L318.3 223.9L326.4 224.1L334.5 224.5L342.7 224.9L350.8 225.1L358.9 225.3L367.1 225.7L375.2 225.9L383.3 226.1L391.5 226.3L399.6 226.5L407.7 226.8L415.9 227L424 227.2L432.1 227.2L440.3 227.4L448.4 227.6L456.5 227.8L464.7 227.8L472.8 228L480.9 228.2L489.1 228.2L497.2 228.4L505.3 228.4L513.5 228.6L521.6 228.6L529.7 228.8L537.9 228.8L546 229" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Ia = 0.05 S, S × 1.42</text><line x1="235.2" x2="247.2" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/><text x="251.2" y="40" style="fill:var(--muted)">Jain (λ 0.3, α 1.5)</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same three rules as a ratio to the standard Ia = 0.2 S runoff. Small storms are where the choice matters: near the threshold the other rules give several times as much runoff.</figcaption></figure>
<!-- /fig:ratio -->

**Step 4: what a 40 mm storm does to the 111 ha catchment.** Kirpich's formula with the 2036 m flow path and the 3.8% mean slope gives a time of concentration of **24 minutes**. For a 1-hour, 40 mm storm on the whole catchment, the tool gives:

- with the standard rule: **6.8 mm** of runoff, **7,520 m³** of water and a triangular-hydrograph peak of **2.1 m³/s**;
- with the 0.05 rule: **8.9 mm**, **9,900 m³** and **2.8 m³/s**.

| Storm rain | Standard 0.2 S | 0.05 S (S × 1.42) | Jain | What the paper found |
|---|---|---|---|---|
| 10 mm | 0 mm | 0.23 mm | 1.0 mm | Standard rule: −91% volume bias |
| 20 mm | 0.42 mm | 1.9 mm | 3.6 mm | 0.05 rules: about −60 to −71% |
| 40 mm | 6.8 mm | 8.9 mm | 11.7 mm | Jain: +16% |
| 80 mm | 31.4 mm | 31.8 mm | 35.9 mm | Errors grow with total rain for the fixed ratios |

The pattern in our numbers (standard far lowest, Jain highest, the gap shrinking for big storms) matches the order of the paper's biases. The exact percentages depend on the real curve numbers and storms, which we did not have.

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/curve-number-initial-abstraction-pluvial-flooding-belgian-loess.mjs` in fibub's public code. It imports from `src/lib/sci/runoff.ts`, the maths behind the [[runoff-calculator]]:

- `retention` gives S from the curve number, and `scsRunoff` gives the runoff depth for Ia = 0.2 S or 0.05 S (with the 1.42 conversion);
- `kirpich` gives the time of concentration, and `triangularHydrograph` gives the peak flow;
- `cnWet` and `cnDry` adjust the curve number for wet or dry ground (printed for reference).

Inputs from the paper: the catchment areas, the flow path length, the mean slope and the Jain parameters (0.3 and 1.5). Our assumptions: CN 78, the 40 mm, 1-hour storm, and using the mean slope along the flow path. The Jain function is our own code, labelled in the script.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the runoff maths against an independent Python calculation:

- 80 mm of rain on CN 69.4 must give Ia = **22.399 mm** and runoff **19.5636 mm**, and **22.4639 mm** with the 0.05 rule.
- 1 inch of rain on CN 80 must give exactly (1 − 0.5)² / 3 = **0.0833 inch**, the textbook hand calculation.
- Kirpich's formula must match Python's **12.1148 minutes** for the test catchment, and CN 69.4 must convert to **48.78** (dry) and **83.91** (wet).

## Check it yourself

**On the [[runoff-calculator]]:**

1. In the *Catchment* card, keep *Units* on **SI (ha, mm, m)**. In *Part 1*, type **111** in *Area (ha)*, clear *Runoff coefficient C*, and type **78** in *Curve number CN*. Clear the boxes in *Part 2*.
2. Type **2036** in *Longest flow path L (m)* and **0.038** in *Average slope along it (m per m)*. Leave *Time of concentration* blank. The card shows *Time of concentration* **24.2 min**.
3. In *SCS curve number runoff*, type **40** in *Storm rainfall P (mm)* and **1** in *Storm duration D (hours)*. Keep *Ground before the storm* on **Average (condition II)** and *Initial abstraction* on **Ia = 0.2 S (standard)**.
4. It reads **Runoff 6.77 mm of 40 mm rain (16.9 %)**, *Initial abstraction Ia* **14.3 mm**, *Runoff volume* **7520 m³** and *Triangular hydrograph peak* **2.11 m³/s**.
5. Switch *Initial abstraction* to **Ia = 0.05 S (S converted × 1.42)**. It now reads **8.92 mm (22.3 %)**, **9900 m³** and **2.78 m³/s**.
6. Try **20** mm of rain with each rule: 0.416 mm against 1.91 mm.

The Jain rule is not in the tool, so its column cannot be checked there.

## What researchers can use it for

- **Test the Ia choice** for a catchment before building a full model: a few storms in the [[runoff-calculator]] show whether the 0.2 or 0.05 rule changes the answer.
- **Shape the flood:** the [[unit-hydrograph]] turns the runoff into a flow-over-time curve, for comparison with a gauge.
- **Pick the design storm:** [[flood-frequency]] fits return periods to annual maxima, the first step towards the 25- and 100-year storms the paper mapped.
- **Teach** why small, common storms are where simple runoff rules fail.

## The fine print

- CN 78 is a handbook stand-in, not the paper's calibrated table, so our runoff depths are illustrations.
- The tool's condition I and III switches change the curve number for dry or wet ground; the paper used normal conditions (II) for every run.
- The paper's Jain rule was the best of the four, but its skill was still modest (NSE 0.17). A companion study found a locally calibrated ratio did far better. No fixed rule fits every storm.
- The triangular hydrograph is a lumped shortcut; the paper routes water along 1 m flow paths instead.
