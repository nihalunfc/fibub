---
title: "Variable-speed pumping stations: CFD, junction losses and the affinity laws"
summary: "A CFD study of a pumping station run at 0.8 to 1.0 of rated speed found the losses at the pipe junction grow with the square of the flow. We show what slowing a pump does to the operating point with fibub's Pump and system curve tool."
tools: [pump-system-curve]
updated: 2026-11-16
sources:
  - "Li, Y., Lin, J., Lu, Y., Liu, Z., Qu, L., Jiao, F., Wang, Z. and Meng, Q. (2025), Operational Mechanisms and Energy Analysis of Variable-Speed Pumping Stations, Water 17(17), 2620, doi:10.3390/w17172620. Licence CC BY, checked on the journal page, 2026-11-16. Values used here: pump speeds from 0.8 to 1.0 of rated speed; losses at the junction fitted as a quadratic in flow."
  - "Pump affinity laws (flow in proportion to speed, head to speed squared), as used by the Pump and system curve tool, src/lib/sci/pumpsys.ts."
paper:
  title: "Operational Mechanisms and Energy Analysis of Variable-Speed Pumping Stations"
  authors: "Li, Y.; Lin, J.; Lu, Y.; Liu, Z.; Qu, L.; Jiao, F.; Wang, Z.; Meng, Q."
  journal: "Water"
  year: 2025
  doi: "10.3390/w17172620"
  url: "https://www.mdpi.com/2073-4441/17/17/2620"
  licence: "CC BY"
  reviewed: true
---

Many water and wastewater pumping stations no longer run their pumps flat out. A **variable-speed drive** lets the pump turn slower when less water is needed, which saves energy. But where several pumps feed one main through a **junction**, the water meeting there loses energy too, and that loss changes with the flow. A study in the journal *Water* used computer flow modelling (CFD) to look at exactly this. This article shows the idea with the [[pump-system-curve]] tool, which draws a pump curve, slows it with the affinity laws and finds where it meets the system curve.

## The paper in brief

The team modelled a pumping station with **computational fluid dynamics** (CFD), which solves the equations of water flow on a fine 3D grid. They ran the pumps at speeds from **0.8 to 1.0 of the rated speed** and looked at how much head was lost where the pump branches join the main.

The findings, in short:

- The **loss at the junction rose with the square of the flow**, so a simple quadratic, loss = k × Q², described it well over the speeds studied.
- That means the junction behaves like any other pipe loss and can be added into the **system curve** used to pick an operating point.
- Running slower lowers the flow, so the junction loss falls quickly (to about two thirds when flow drops 20 %).

## Checked with the tools

We did not have the paper's pump curves or station data, so we did not redo its CFD. What we **simulated** is the idea it relies on: a pump slowed by the affinity laws meeting a quadratic system curve. We used the tool's own sample pump (the points already typed into the tool) and its default system: **15 m static head plus 12 m friction at 40 L/s**, rising with flow squared, just like the paper's junction loss.

**Step 1: the curves.** The affinity laws say flow scales with speed and head with speed squared. So the shut-off head falls from **41.9 m** at full speed to **34.0 m** at 90 % and **26.8 m** at 80 % (41.9 × 0.64).

<!-- fig:curves -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 338" role="img" aria-label="Simulated. Pump curves shrink by the affinity laws from 100 % to 80 % speed; the operating point slides down the quadratic system curve from 40.33 to 26.82 L/s." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Slowing the pump: five speeds against one system curve</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Slowing the pump: five speeds against one system curve</text><line x1="58" x2="546" y1="292" y2="292" style="stroke:var(--line)"/><text x="52" y="296" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="238.2" y2="238.2" style="stroke:var(--line)"/><text x="52" y="242.2" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="184.4" y2="184.4" style="stroke:var(--line)"/><text x="52" y="188.4" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="130.7" y2="130.7" style="stroke:var(--line)"/><text x="52" y="134.7" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="76.9" y2="76.9" style="stroke:var(--line)"/><text x="52" y="80.9" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="292" y2="296" style="stroke:var(--muted)"/><text x="58" y="309" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="146.7" x2="146.7" y1="292" y2="296" style="stroke:var(--muted)"/><text x="146.7" y="309" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="235.5" x2="235.5" y1="292" y2="296" style="stroke:var(--muted)"/><text x="235.5" y="309" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="324.2" x2="324.2" y1="292" y2="296" style="stroke:var(--muted)"/><text x="324.2" y="309" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="412.9" x2="412.9" y1="292" y2="296" style="stroke:var(--muted)"/><text x="412.9" y="309" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="501.6" x2="501.6" y1="292" y2="296" style="stroke:var(--muted)"/><text x="501.6" y="309" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="292" y2="292" style="stroke:var(--muted)"/><text x="302" y="330" text-anchor="middle" style="fill:var(--ink)">Flow (L/s)</text><text transform="translate(14 171) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Head (m)</text><path d="M58 66.6L66.9 66.6L75.7 66.6L84.6 66.7L93.5 67L102.4 67.3L111.2 67.8L120.1 68.4L129 69L137.9 69.8L146.7 70.6L155.6 71.6L164.5 72.7L173.3 73.9L182.2 75.1L191.1 76.5L200 78L208.8 79.6L217.7 81.3L226.6 83.1L235.5 85L244.3 87L253.2 89L262.1 91.3L270.9 93.6L279.8 96L288.7 98.5L297.6 101.1L306.4 103.8L315.3 106.6L324.2 109.5L333.1 112.6L341.9 115.7L350.8 118.9L359.7 122.3L368.5 125.7L377.4 129.2L386.3 132.9L395.2 136.6L404 140.4L412.9 144.4L421.8 148.5L430.7 152.6L439.5 156.9L448.4 161.2L457.3 165.7L466.1 170.2L475 174.9L483.9 179.7L492.8 184.6L501.6 189.5L510.5 194.6L519.4 199.8L528.3 205.1L537.1 210.5L546 216" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 88.6L66.9 88.5L75.7 88.6L84.6 88.7L93.5 89L102.4 89.3L111.2 89.8L120.1 90.4L129 91L137.9 91.8L146.7 92.7L155.6 93.7L164.5 94.7L173.3 95.9L182.2 97.2L191.1 98.6L200 100.1L208.8 101.7L217.7 103.3L226.6 105.1L235.5 107L244.3 109L253.2 111.1L262.1 113.4L270.9 115.7L279.8 118.1L288.7 120.6L297.6 123.2L306.4 125.9L315.3 128.8L324.2 131.7L333.1 134.7L341.9 137.8L350.8 141.1L359.7 144.4L368.5 147.9L377.4 151.4L386.3 155L395.2 158.8L404 162.6L412.9 166.6L421.8 170.7L430.7 174.8L439.5 179.1L448.4 183.4L457.3 187.9L466.1 192.5L475 197.1L483.9 201.9L492.8 206.8L501.6 211.8L510.5 216.9L519.4 222.1L528.3 227.3L537.1 232.7L546 238.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 109.4L66.9 109.4L75.7 109.4L84.6 109.6L93.5 109.9L102.4 110.2L111.2 110.7L120.1 111.3L129 111.9L137.9 112.7L146.7 113.6L155.6 114.6L164.5 115.6L173.3 116.8L182.2 118.1L191.1 119.5L200 121L208.8 122.6L217.7 124.3L226.6 126.1L235.5 128L244.3 130L253.2 132.1L262.1 134.3L270.9 136.6L279.8 139.1L288.7 141.6L297.6 144.2L306.4 146.9L315.3 149.8L324.2 152.7L333.1 155.7L341.9 158.9L350.8 162.1L359.7 165.5L368.5 168.9L377.4 172.4L386.3 176.1L395.2 179.8L404 183.7L412.9 187.7L421.8 191.7L430.7 195.9L439.5 200.2L448.4 204.5L457.3 209L466.1 213.6L475 218.3L483.9 223L492.8 227.9L501.6 232.9L510.5 238L519.4 243.2L528.3 248.5L537.1 253.9L546 259.4" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><path d="M58 129.2L66.9 129.1L75.7 129.2L84.6 129.3L93.5 129.6L102.4 130L111.2 130.4L120.1 131L129 131.7L137.9 132.5L146.7 133.4L155.6 134.3L164.5 135.4L173.3 136.6L182.2 137.9L191.1 139.3L200 140.8L208.8 142.4L217.7 144.1L226.6 145.9L235.5 147.8L244.3 149.8L253.2 152L262.1 154.2L270.9 156.5L279.8 158.9L288.7 161.4L297.6 164.1L306.4 166.8L315.3 169.6L324.2 172.6L333.1 175.6L341.9 178.8L350.8 182L359.7 185.4L368.5 188.8L377.4 192.4L386.3 196L395.2 199.8L404 203.6L412.9 207.6L421.8 211.7L430.7 215.8L439.5 220.1L448.4 224.5L457.3 229L466.1 233.6L475 238.2L483.9 243L492.8 247.9L501.6 252.9L510.5 258L519.4 263.2L528.3 268.5L537.1 273.9L546 279.4" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/><path d="M58 147.8L66.9 147.7L75.7 147.8L84.6 148L93.5 148.2L102.4 148.6L111.2 149.1L120.1 149.7L129 150.3L137.9 151.1L146.7 152L155.6 153L164.5 154.1L173.3 155.3L182.2 156.6L191.1 158L200 159.5L208.8 161.1L217.7 162.8L226.6 164.6L235.5 166.5L244.3 168.6L253.2 170.7L262.1 172.9L270.9 175.2L279.8 177.7L288.7 180.2L297.6 182.8L306.4 185.6L315.3 188.4L324.2 191.3L333.1 194.4L341.9 197.5L350.8 200.8L359.7 204.1L368.5 207.6L377.4 211.2L386.3 214.8L395.2 218.6L404 222.4L412.9 226.4L421.8 230.5L430.7 234.7L439.5 238.9L448.4 243.3L457.3 247.8L466.1 252.4L475 257.1L483.9 261.9L492.8 266.8L501.6 271.8L510.5 276.9L519.4 282.1L528.3 287.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 211.3L66.9 211.3L75.7 211.2L84.6 211L93.5 210.7L102.4 210.3L111.2 209.9L120.1 209.4L129 208.8L137.9 208.1L146.7 207.3L155.6 206.5L164.5 205.5L173.3 204.5L182.2 203.4L191.1 202.3L200 201L208.8 199.7L217.7 198.3L226.6 196.8L235.5 195.2L244.3 193.5L253.2 191.8L262.1 190L270.9 188.1L279.8 186.1L288.7 184.1L297.6 181.9L306.4 179.7L315.3 177.4L324.2 175L333.1 172.6L341.9 170L350.8 167.4L359.7 164.7L368.5 161.9L377.4 159.1L386.3 156.1L395.2 153.1L404 150L412.9 146.8L421.8 143.5L430.7 140.2L439.5 136.8L448.4 133.2L457.3 129.7L466.1 126L475 122.2L483.9 118.4L492.8 114.5L501.6 110.5L510.5 106.4L519.4 102.3L528.3 98L537.1 93.7L546 89.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="415.8" cy="145.7" r="4" style="fill:var(--ink);opacity:1"/><circle cx="387.7" cy="155.6" r="4" style="fill:var(--ink);opacity:1"/><circle cx="358.6" cy="165" r="4" style="fill:var(--ink);opacity:1"/><circle cx="328.2" cy="174" r="4" style="fill:var(--ink);opacity:1"/><circle cx="296" cy="182.3" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">100 % speed</text><line x1="163.2" x2="175.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="179.2" y="40" style="fill:var(--muted)">95 % speed</text><line x1="261.2" x2="273.2" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="277.2" y="40" style="fill:var(--muted)">90 % speed</text><line x1="359.2" x2="371.2" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2"/><text x="375.2" y="40" style="fill:var(--muted)">85 % speed</text><line x1="457.2" x2="469.2" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="473.2" y="40" style="fill:var(--muted)">80 % speed</text><line x1="555.2" x2="567.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="571.2" y="40" style="fill:var(--muted)">System (simulated)</text><circle cx="715.8" cy="36" r="4" style="fill:var(--ink)"/><text x="726.8" y="40" style="fill:var(--muted)">Operating point</text><text class="fibub-mark" x="546" y="330" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The tool's sample pump at 100, 95, 90, 85 and 80 % speed (affinity laws) against a quadratic system curve: 15 m static head plus 12 m friction at 40 L/s. Simulated with the tool's maths; not the paper's pumps or data.</figcaption></figure>
<!-- /fig:curves -->

**Step 2: the operating point.** Where each pump curve crosses the system curve is where the station actually runs. In our simulation it moves from **40.3 L/s at 27.2 m** (100 %) to **33.9 L/s at 23.6 m** (90 %) and **26.8 L/s at 20.4 m** (80 %).

**Step 3: flow does not follow speed.** Because 15 m of the head is static (lifting water, not friction), cutting the speed by 20 % cut the flow by about **33 %**, not 20 %. Figure 2 shows the gap. This is why stations with a large static lift cannot be slowed as far as stations that mostly fight friction.

<!-- fig:flow -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="With 15 m of static head, flow falls faster than speed: 40.33 L/s at 100 % to 26.82 L/s at 80 %." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Flow delivered at each speed (simulated)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Flow delivered at each speed (simulated)</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="207.1" y2="207.1" style="stroke:var(--line)"/><text x="52" y="211.1" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="162.2" y2="162.2" style="stroke:var(--line)"/><text x="52" y="166.2" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="117.3" y2="117.3" style="stroke:var(--line)"/><text x="52" y="121.3" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="72.4" y2="72.4" style="stroke:var(--line)"/><text x="52" y="76.4" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="180" x2="180" y1="252" y2="256" style="stroke:var(--muted)"/><text x="180" y="269" text-anchor="middle" style="fill:var(--muted)">85</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">90</text><line x1="424" x2="424" y1="252" y2="256" style="stroke:var(--muted)"/><text x="424" y="269" text-anchor="middle" style="fill:var(--muted)">95</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Speed (% of rated)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Flow (L/s)</text><path d="M546 71L424 85.2L302 99.9L180 115.3L58 131.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M546 71L424 80L302 89.1L180 98.1L58 107.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Operating flow</text><line x1="184.8" x2="196.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="200.8" y="40" style="fill:var(--muted)">Flow × speed (no static head)</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Operating flow against speed for the same simulated system, beside a line where flow simply follows speed. Simulated; no paper data.</figcaption></figure>
<!-- /fig:flow -->

| Check | Paper | Our tool result (simulated) |
|---|---|---|
| Junction loss grows with flow squared | quadratic fit to CFD | system curve uses friction × (Q / 40 L/s)² |
| Speed range studied | 0.8 to 1.0 of rated | 80 % to 100 % in 5 % steps |
| Head falls with speed squared | affinity laws | shut-off 41.9 m to 26.8 m (× 0.64) |
| Slower pump, lower flow | yes | 40.3 to 26.8 L/s |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/variable-speed-pumping-station-cfd-junction-loss-affinity-laws.mjs` in fibub's public code. It calls `fitPump`, `setHead`, `maxFlow`, `quadSystem`, `operatingPoint` and `setEff` from `src/lib/sci/pumpsys.ts`, the maths behind the Pump and system curve tool.

Where the inputs come from: the 0.8 to 1.0 speed range and the quadratic loss are from the paper. The pump points and the system (15 m static, 12 m at 40 L/s) are the **tool's defaults, a simulated example**, not the paper's station. We copied no tables or figures from the paper.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/pump-system-curve.mjs`, which checks the tool against an independent Python check:

- The head, efficiency and NPSHr curve fits must match `numpy.polyfit`.
- Operating points for one pump, two in parallel, two in series, **90 % speed** and three pumps in parallel at **80 % speed** must match SciPy's `brentq` root finder.
- The affinity laws must scale the shut-off head by r² and the run-out flow by r.
- A Colebrook pipe system curve must match SciPy, and NPSH available must match a value from the `iapws` package.

## Check it yourself

On the [[pump-system-curve]] tool:

1. Leave the sample points in *Points read off the maker's curve* and *Flow unit* on **L/s**.
2. Leave *Static head (m)* at **15**, *Friction from* on **A known loss at one flow**, *Friction loss (m)* at **12** and *at flow* at **40**.
3. Read the operating point: about **40.3 L/s at 27.2 m**.
4. Set *Change* to **Speed (affinity laws)**, leave *Speed on the curve (rpm)* at **1450** and type **1160** (80 %) in *New speed (rpm)*: the point moves to about **26.8 L/s at 20.4 m**.
5. Try **1305** (90 %) to see about **33.9 L/s**.

## What researchers can use it for

- **Add a junction or fitting loss** found by CFD or tests to a system curve as a known loss at one flow, then see the new operating point.
- **Plan variable-speed ranges**: find the lowest speed that still beats the static head.
- **Compare parallel pumps** at reduced speed before running a full CFD model.
- **Teach** the affinity laws and why flow falls faster than speed when static head is large.

## The fine print

- Our curves are simulated from the tool's sample pump, not the pumps in the paper.
- The affinity laws hold best for modest speed changes, like the 0.8 to 1.0 range here; efficiency shifts a little at low speed.
- A quadratic loss is a fit; CFD shows details (swirl, uneven flow) that one number cannot.
- Check pump choices with the manufacturer's data and a qualified engineer.
