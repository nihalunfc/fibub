---
title: "Bacillus subtilis spores in soy milk: D-values, z-values and pressure"
summary: "A 2025 study shows mild high pressure makes Bacillus spores in soy milk easier to kill with heat. We refit its z-values and check its matched heat treatments with fibub's F0 tools."
tools: [f0-calculator, thermal-process-calculator, cfu-counter]
updated: 2026-11-24
sources:
  - "Morimatsu, K. (2025), Combination of Medium-High-Hydrostatic-Pressure Treatment with Post-/Pre-Heat Treatment for Pasteurization of Bacillus subtilis Spore Suspended in Soy Milk, Microorganisms 13(7): 1469, doi:10.3390/microorganisms13071469. Licence CC BY (Creative Commons Attribution), checked on the MDPI article page, 2026-11-24. Values used here: D-values of 300, 20 and 0.6 min (untreated) and 150, 10 and 0.5 min (after pressure) at 80, 87 and 100 °C; stated z-values 7.5 and 8.2 °C; pressure step 100 MPa at 65 °C for 30 min; pre-heats of 80 °C for 420 min, 90 °C for 30 min and 100 °C for 1.5 min, leaving 5.6, 5.8 and 5.7 log CFU/mL; starting count 7.4 log CFU/mL; 3.6 log CFU/mL after pressure; detection limit 1.0 log CFU/mL."
  - "D-value, z-value and equivalent lethality: Stumbo, C. R. (1973), Thermobacteriology in Food Processing, 2nd ed., Academic Press."
paper:
  title: "Combination of Medium-High-Hydrostatic-Pressure Treatment with Post-/Pre-Heat Treatment for Pasteurization of Bacillus subtilis Spore Suspended in Soy Milk"
  authors: "Morimatsu K"
  journal: "Microorganisms"
  year: 2025
  doi: "10.3390/microorganisms13071469"
  url: "https://www.mdpi.com/2076-2607/13/7/1469"
  licence: "CC BY"
  reviewed: true
---

Bacterial spores are the hardest thing a food maker has to kill. A *Bacillus subtilis* spore can sit through boiling water for minutes and then grow once the food cools. A 2025 paper in *Microorganisms* tests a gentler route for soy milk: squeeze the spores at a modest pressure first, which wakes many of them up (germination) and makes them easy to kill, then heat what is left. The paper's numbers are classic heat-kill numbers, **D-values** and **z-values**, which is exactly what the [[f0-calculator]] and the [[thermal-process-calculator]] work with. This article refits the z-values from the paper's D-values and checks how its heat steps compare. To count the survivors on plates yourself, use the [[cfu-counter]].

## The paper in brief

Spores of *B. subtilis* were mixed into soy milk at about 7.4 log CFU/mL (25 million living spores per millilitre; CFU means colony-forming units). Two kinds of samples were then heated at 80, 87 and 100 °C: untreated spores, and spores that had first been held at **100 MPa** (about 1,000 times air pressure, far below the 400 to 600 MPa used for cold-pressed juices) at 65 °C for 30 minutes.

Two terms carry the paper:

- The **D-value** is the time at one temperature that kills 90 % of the spores (one "log").
- The **z-value** is how many degrees hotter makes that kill ten times faster.

Pressure alone cut the count by about 3.6 to 3.9 logs. The spores that survived it were also easier to kill with heat: their D-value at 87 °C halved, from 20 to 10 minutes, and the z-value rose a little, from 7.5 to 8.2 °C. The order matters: heating before the pressure step made pressure work worse, because a heat shock left the spores harder to germinate. Hotter, shorter pre-heats did the most harm: after 4 minutes at 100 °C, pressure removed almost nothing. The author's suggestion is pressure first, mild heat after.

## Checked with the tools

All of this is a **recomputation from values stated in the paper**. We used no measured survivor curves.

**Step 1: the z-values.** The F-value calculator fits a straight line to the logarithm of D against temperature. From the three untreated D-values it gives **z = 7.54 °C** (R² 0.991); from the pressure-treated ones, **8.27 °C** (R² 0.980). The paper reports 7.5 and 8.2 °C. Figure 1 shows the points and lines. The pressure-treated line sits lower at every temperature, but the two lines come together near 100 °C (fitted D 0.53 against 0.43 minutes). That is the paper's point in one picture: pressure helps most at milder heat.

<!-- fig:dz -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="D-values of Bacillus subtilis spores in soy milk at 80, 87 and 100 °C from the paper, with the straight lines the F-value calculator's z-value fit puts through them: z 7.54 °C untreated and 8.27 °C after pressure." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Spore D-values against temperature (log scale)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Spore D-values against temperature (log scale)</text><line x1="58" x2="546" y1="239.4" y2="239.4" style="stroke:var(--line)"/><text x="52" y="243.4" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="220.4" y2="220.4" style="stroke:var(--line)"/><text x="52" y="224.4" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="176.3" y2="176.3" style="stroke:var(--line)"/><text x="52" y="180.3" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="157.3" y2="157.3" style="stroke:var(--line)"/><text x="52" y="161.3" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="113.2" y2="113.2" style="stroke:var(--line)"/><text x="52" y="117.2" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="94.2" y2="94.2" style="stroke:var(--line)"/><text x="52" y="98.2" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="64.1" y2="64.1" style="stroke:var(--line)"/><text x="52" y="68.1" text-anchor="end" style="fill:var(--muted)">300</text><line x1="98.7" x2="98.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="98.7" y="269" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="200.3" x2="200.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="200.3" y="269" text-anchor="middle" style="fill:var(--muted)">85</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">90</text><line x1="403.7" x2="403.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="403.7" y="269" text-anchor="middle" style="fill:var(--muted)">95</text><line x1="505.3" x2="505.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="505.3" y="269" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Temperature (°C)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">D-value (min)</text><circle cx="98.7" cy="64.1" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="241" cy="138.3" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="505.3" cy="234.5" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="98.7" cy="83.1" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="241" cy="157.3" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="505.3" cy="239.4" r="4" style="fill:var(--c-tools);opacity:1"/><path d="M58 53.5L70.2 58.5L82.4 63.5L94.6 68.6L106.8 73.5L119 78.6L131.2 83.6L143.4 88.6L155.6 93.7L167.8 98.7L180 103.7L192.2 108.8L204.4 113.8L216.6 118.8L228.8 123.9L241 128.8L253.2 133.9L265.4 138.9L277.6 143.9L289.8 149L302 154L314.2 159L326.4 164.1L338.6 169.1L350.8 174.1L363 179.1L375.2 184.1L387.4 189.2L399.6 194.2L411.8 199.2L424 204.2L436.2 209.3L448.4 214.3L460.6 219.3L472.8 224.4L485 229.4L497.2 234.4L509.4 239.4L521.6 244.4L533.8 249.5L546 254.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 76L70.2 80.6L82.4 85.2L94.6 89.8L106.8 94.3L119 98.9L131.2 103.5L143.4 108.1L155.6 112.6L167.8 117.2L180 121.8L192.2 126.4L204.4 130.9L216.6 135.5L228.8 140.1L241 144.7L253.2 149.2L265.4 153.8L277.6 158.4L289.8 163L302 167.6L314.2 172.1L326.4 176.8L338.6 181.3L350.8 185.9L363 190.5L375.2 195.1L387.4 199.6L399.6 204.2L411.8 208.8L424 213.4L436.2 217.9L448.4 222.5L460.6 227.1L472.8 231.7L485 236.2L497.2 240.8L509.4 245.4L521.6 250L533.8 254.5L546 259.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Untreated spores</text><circle cx="204.2" cy="36" r="4" style="fill:var(--c-tools)"/><text x="215.2" y="40" style="fill:var(--muted)">After pressure (100 MPa, 65 °C)</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The paper's D-values (dots, log scale) and the z-value lines fitted to them with the F-value calculator's maths. A steeper line means a smaller z: the kill speeds up faster with each degree.</figcaption></figure>
<!-- /fig:dz -->

**Step 2: is the line really straight?** Three points can still bend. Move the measured 100 °C D-value (0.6 min) down to 87 °C with z = 7.5 °C and the tool gives **32.5 minutes**, against 20 minutes measured. At 80 °C it gives 278 minutes, against 300 measured. So the 87 °C point sits below the line, and the fitted line (D 28.2 min at 87 °C) is a compromise. With only three temperatures this is normal scatter, but it shows why a z-value from three points should be quoted loosely.

**Step 3: the "matched" pre-heats.** To compare pre-heats fairly, the paper used three that should kill about the same: 420 min at 80 °C, 30 min at 90 °C and 1.5 min at 100 °C. The F0 tool's equivalent-time maths says 1.5 minutes at 100 °C matches **32.3 minutes at 90 °C** and **696 minutes at 80 °C** with z = 7.5 °C, or 24.9 and 412 minutes with z = 8.2 °C (Figure 2). So the 90 °C step fits the untreated z, while the 80 °C step is closer to the pressure-treated z. The measured counts agree that the three steps were similar: they fell by 1.8, 1.6 and 1.7 logs.

<!-- fig:equiv -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Equivalent time at each temperature for the lethality of 1.5 minutes at 100 °C. With z 7.5 °C it is 32.3 min at 90 °C and 696 min at 80 °C; with z 8.2 °C, 24.9 and 412 min." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Minutes that match 1.5 min at 100 °C</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Minutes that match 1.5 min at 100 °C</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="211.5" y2="211.5" style="stroke:var(--line)"/><text x="52" y="215.5" text-anchor="end" style="fill:var(--muted)">3</text><line x1="58" x2="546" y1="178" y2="178" style="stroke:var(--line)"/><text x="52" y="182" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="147.5" y2="147.5" style="stroke:var(--line)"/><text x="52" y="151.5" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="114" y2="114" style="stroke:var(--line)"/><text x="52" y="118" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="83.5" y2="83.5" style="stroke:var(--line)"/><text x="52" y="87.5" text-anchor="end" style="fill:var(--muted)">300</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1000</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="180" x2="180" y1="242" y2="246" style="stroke:var(--muted)"/><text x="180" y="259" text-anchor="middle" style="fill:var(--muted)">85</text><line x1="302" x2="302" y1="242" y2="246" style="stroke:var(--muted)"/><text x="302" y="259" text-anchor="middle" style="fill:var(--muted)">90</text><line x1="424" x2="424" y1="242" y2="246" style="stroke:var(--muted)"/><text x="424" y="259" text-anchor="middle" style="fill:var(--muted)">95</text><line x1="546" x2="546" y1="242" y2="246" style="stroke:var(--muted)"/><text x="546" y="259" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Hold temperature (°C)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Equivalent time (min)</text><path d="M58 60L70.2 64.3L82.4 68.6L94.6 72.8L106.8 77.1L119 81.4L131.2 85.6L143.4 89.9L155.6 94.2L167.8 98.4L180 102.7L192.2 107L204.4 111.2L216.6 115.5L228.8 119.8L241 124L253.2 128.3L265.4 132.6L277.6 136.8L289.8 141.1L302 145.4L314.2 149.6L326.4 153.9L338.6 158.2L350.8 162.4L363 166.7L375.2 171L387.4 175.2L399.6 179.5L411.8 183.8L424 188L436.2 192.3L448.4 196.6L460.6 200.8L472.8 205.1L485 209.4L497.2 213.6L509.4 217.9L521.6 222.2L533.8 226.4L546 230.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 74.6L70.2 78.5L82.4 82.4L94.6 86.4L106.8 90.3L119 94.2L131.2 98.1L143.4 102L155.6 105.9L167.8 109.8L180 113.7L192.2 117.6L204.4 121.5L216.6 125.4L228.8 129.3L241 133.2L253.2 137L265.4 140.9L277.6 144.8L289.8 148.8L302 152.7L314.2 156.6L326.4 160.5L338.6 164.4L350.8 168.3L363 172.2L375.2 176.1L387.4 180L399.6 183.9L411.8 187.8L424 191.7L436.2 195.6L448.4 199.5L460.6 203.4L472.8 207.3L485 211.2L497.2 215.1L509.4 219L521.6 222.9L533.8 226.8L546 230.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="58" cy="74.1" r="4" style="fill:var(--ink);opacity:1"/><circle cx="302" cy="147.5" r="4" style="fill:var(--ink);opacity:1"/><circle cx="546" cy="230.7" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">z = 7.5 °C</text><line x1="156" x2="168" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="172" y="40" style="fill:var(--muted)">z = 8.2 °C</text><circle cx="259" cy="36" r="4" style="fill:var(--ink)"/><text x="270" y="40" style="fill:var(--muted)">Pre-heats used in the paper</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How long a hold at 80 to 100 °C matches the lethality of 1.5 minutes at 100 °C, worked out by the Autoclave F0 tool's equivalent-time maths for the two z-values. Dots: the three pre-heats the paper used.</figcaption></figure>
<!-- /fig:equiv -->

**Step 4: predicted against measured kill.** Run each pre-heat as a steady hold through the tool's organism-kill maths (D 0.6 min at 100 °C, z 7.5 °C) and it predicts 1.51, 2.32 and 2.50 logs for the 80, 90 and 100 °C steps. With the fitted line instead, the predictions are 1.75, 2.66 and 2.82. The measured 1.6 to 1.8 logs sit at the low end, below the 90 and 100 °C predictions. One likely reason, and **our assumption**: a short pre-heat in a tube spends part of its time warming up, so 1.5 minutes "at 100 °C" delivers less than 1.5 minutes of full lethality. A logged temperature trace in the F0 tool would settle that.

**Step 5: what pressure buys at 87 °C.** To bring the count down to the detection limit (1.0 log CFU/mL, so 10 per mL), untreated spores need 6.4 logs of kill and pressure-treated ones only 2.6. At their own 87 °C D-values that is about **128 minutes** against **26 minutes**: five times shorter for the same end point.

| Check | Paper | Our tool result |
|---|---|---|
| z-value, untreated | 7.5 °C | 7.54 °C (R² 0.991) |
| z-value, after pressure | 8.2 °C | 8.27 °C (R² 0.980) |
| 1.5 min at 100 °C, as time at 90 °C | 30 min used | 32.3 min (z 7.5), 24.9 min (z 8.2) |
| 1.5 min at 100 °C, as time at 80 °C | 420 min used | 696 min (z 7.5), 412 min (z 8.2) |
| Kill in the matched pre-heats | 1.6 to 1.8 logs measured | 1.51 to 2.50 logs predicted (D 0.6, z 7.5) |
| Minutes at 87 °C to the detection limit | not stated | 128 untreated, 26 after pressure |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/bacillus-subtilis-spores-soy-milk-d-value-z-value-pressure.mjs` in fibub's public code. It calls `zValue` from `src/lib/sci/thermproc.ts` (the maths of the [[thermal-process-calculator]]) for the z-value lines, and `dAt`, `equivalentTime`, `organismKill`, `neededLR` and `timeFor` from `src/lib/sci/f0.ts` (the maths of the [[f0-calculator]]) for everything else.

The D-values, z-values, pre-heat times, counts and detection limit come from the paper's text and tables. Treating each pre-heat as a perfectly steady hold is **our assumption**; the paper does not give temperature traces.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/f0-calculator.mjs` and `tests/sci-tools/thermal-process-calculator.mjs`. Among their checks:

- F0 totals for a made-up autoclave log must match an independent NumPy script: **27.65 minutes** at the chamber probe and **22.10** at the load centre.
- A D-value of 1.5 min at 121.1 °C with z = 10 °C must move to **0.15 min** at 131.1 °C and **15 min** at 111.1 °C.
- The z-value fit on four made-up D-values must match NumPy's `polyfit`: **z 9.925 °C**.
- New with this article: 1.5 minutes at 100 °C with z = 7.5 °C must equal **32.32 minutes at 90 °C** and **696.2 at 80 °C**, a D-value of 0.6 min at 100 °C must move to **32.47 min** at 87 °C, and a 1.5-minute hold must give **2.5 logs**.

## Check it yourself

On the [[f0-calculator]]:

1. Clear the *Temperature log* box and paste three lines: **Minutes,Bath**, then **0,100**, then **1.5,100**.
2. Under *Settings*, set *Reference temperature (°C)* to **100**, *z-value (°C)* to **7.5**, *Hold from (°C)* to **100** and *Equivalent time at (°C)* to **90**. The *F0* card shows **1.5** minutes and an equivalent of about **32.32** minutes at 90 °C.
3. In *Kill of one organism*, type *D-value (min)* **0.6**, *D measured at (°C)* **100**, *Organism z (°C)* **7.5**, *Organisms per item at the start* **2.5e7** and *Target SAL* **10** (the detection limit, 10 per mL). It reads **2.5 log reduction**, about 79,100 left, and **6.398** logs needed.
4. Set *Plan at (°C)* to **87**: the D-value there is about **32.47** minutes and the hold for the target about **207.7** minutes. Change *D-value (min)* to **20** and *D measured at (°C)* to **87** (the measured value) and see how much the plan changes.

On the [[thermal-process-calculator]], in *z-value from D-values*, type **80, 300**, **87, 20** and **100, 0.6** (one per line): it gives a z-value of about **7.54 °C**.

## What researchers can use it for

- **Get a z-value with its fit quality** from your own D-values, and see which point pulls the line, with the [[thermal-process-calculator]].
- **Design matched heat treatments**: pick holds at different temperatures with the same lethality before an experiment, with the equivalent-time box of the [[f0-calculator]].
- **Turn a real temperature trace into a kill**: paste a logged water-bath or retort trace (several probes at once) and get each probe's log reduction for your organism.
- **Plan a hold time** for a target number of survivors at any temperature, then check it on plates with the [[cfu-counter]].
- **Teach thermal death time**: D, z and F side by side on one page, with numbers students can change.

## The fine print

- This is a recomputation from the paper's stated D-values and counts. We did not have the survivor curves.
- The z-value fits use three temperatures each, so a small change in one D-value moves z noticeably.
- Treating each pre-heat as a steady hold is our assumption; real tubes take time to warm up.
- The F0 tool's straight-line (log-linear) model ignores the shoulders and tails that spore survivor curves often show.
- This is general food science education, not a validated process. Real food processes are set by a qualified process authority.
