---
title: "GPR pipe hyperbolas: depth, diameter and crossing angle by deep learning"
summary: "A 2025 study trains neural networks to read buried pipes' depth, size and crossing angle from GPR hyperbolas. We show with fibub's GPR viewer why the angle matters so much."
tools: [gpr-viewer, ves-inversion, magnetic-anomaly]
updated: 2026-11-24
sources:
  - "Štifanić, D., Štifanić, J., Anđelić, N. and Car, Z. (2025), An Automated System for Underground Pipeline Parameter Estimation from GPR Recordings, Remote Sensing 17(20): 3493, doi:10.3390/rs17203493. Licence CC BY 3.0, checked on the MDPI article page, 2026-11-24. Values used here: GSSI UtilityScan with a 350 MHz antenna, transmitter-receiver separation 0.16 m, 60 traces per metre, survey lines 0.5 to 1.5 m apart; hyperbola apex two-way times about 9 to 43 ns; burial depths 0.4 to 2.0 m; pipe diameters 0.025 to 0.6 m; angles between survey line and pipe 19 to 90°; YOLOv11x detection, EfficientNetV2L regression best, R² above 0.94 for two-way time and depth, diameter and angle only moderately accurate."
  - "Relative permittivity from wave speed, ε = (c/v)², and the point-reflector hyperbola t = (2/v)√((x − x₀)² + d²): standard GPR texts, e.g. Jol, H. M. (ed.) (2009), Ground Penetrating Radar: Theory and Applications, Elsevier."
paper:
  title: "An Automated System for Underground Pipeline Parameter Estimation from GPR Recordings"
  authors: "Štifanić D, Štifanić J, Anđelić N, Car Z"
  journal: "Remote Sensing"
  year: 2025
  doi: "10.3390/rs17203493"
  url: "https://www.mdpi.com/2072-4292/17/20/3493"
  licence: "CC BY 3.0"
  reviewed: true
---

**Ground-penetrating radar** (GPR) sends short radio pulses into the ground and records the echoes. A buried pipe shows up not as a line but as an upside-down U, a **hyperbola**, because the antenna "sees" the pipe before it is over it and after it has passed. The shape of that hyperbola holds the wave speed in the soil, and so the depth. A 2025 paper in *Remote Sensing* trained neural networks to find these hyperbolas and read off four things at once: the echo time, the burial depth, the pipe's diameter and the angle at which the survey line crossed it. This article uses the maths of fibub's [[gpr-viewer|GPR radargram viewer]] to show why the last two are hard, and why getting the angle wrong can make wet soil look like air. For other ways to see under the surface, try the [[ves-inversion]] for resistivity soundings and the [[magnetic-anomaly|magnetic anomaly modeller]] for buried iron.

## The paper in brief

The authors surveyed real utility pipes with a 350 MHz GSSI UtilityScan, whose transmitter and receiver sit 0.16 m apart, recording 60 traces per metre on lines 0.5 to 1.5 m apart. The pipes were 0.4 to 2.0 m deep and 0.025 to 0.6 m across, and the lines crossed them at angles from 19 to 90°. The tops of the hyperbolas came back after about 9 to 43 nanoseconds (two-way time: down and back).

Their system works in two steps. A detector network (YOLOv11x did best) draws a box around each hyperbola in the radargram. A second network (EfficientNetV2L did best) looks inside the box and estimates the two-way time, depth, diameter and crossing angle. Time and depth came out well (R² above 0.94); diameter and angle were only moderately accurate.

## Checked with the tools

The paper gives its per-pipe values only as images, so we did not use its measurements. Instead we **simulated** one pipe from the paper's stated ranges and fitted it with the GPR viewer's own hyperbola maths, the same least-squares fit you run when you tap points on a radargram. **Our assumptions**: soil with a wave speed of 0.09 m/ns, a pipe whose top is 1.0 m down, picks every 1/60 m (the paper's trace spacing) over 0.8 m either side of the top.

**Step 1: what the ranges imply.** If the shallowest pipe (0.4 m) gave the shortest time (9 ns) and the deepest (2.0 m) the longest (43 ns), the wave speed would be 2 × depth ÷ time = **0.089** and **0.093 m/ns**, a relative permittivity of about **11**: moist soil. That pairing is **our assumption**; the paper only gives the two ranges. Our 0.09 m/ns sits in the middle, and the top of our pipe echoes at **22.2 ns**.

**Step 2: a point target is easy.** For a reflector with no size, crossed at right angles, the fit returns exactly 0.09 m/ns and a depth of 1.00 m. This is the textbook case the viewer's fit is built for.

**Step 3: pipe size biases the speed.** A real pipe is a circle, not a point. The echo comes from the nearest point of the pipe, so its hyperbola is flatter than a point's. Fitted as a point:

| Pipe diameter | Fitted speed | Permittivity | Depth the fit finds |
|---|---|---|---|
| 0.025 m | 0.0905 m/ns | 11.0 | 1.006 m |
| 0.3 m | 0.0959 m/ns | 9.8 | 1.065 m |
| 0.6 m | 0.1015 m/ns | 8.7 | 1.128 m |
| true | 0.09 m/ns | 11.1 | top 1.0 m |

For the largest pipes in the paper the speed comes out about 13 % too fast. The apex time stays at 22.2 ns whatever the size: the time to the top is right, only the speed (and so the depth scale) shifts. This is one reason diameter is hard to estimate: it changes the hyperbola's shape only a little, and in the same way as a faster soil.

**Step 4: the crossing angle.** If the survey line crosses the pipe at an angle θ, each step along the line moves the antenna only sin θ as far from the pipe. The hyperbola stretches sideways, and a fit that assumes 90° reads that as a faster wave. For our 0.3 m pipe:

| Crossing angle | Fitted speed | Permittivity | Depth the fit finds |
|---|---|---|---|
| 90° | 0.096 m/ns | 9.8 | 1.07 m |
| 45° | 0.136 m/ns | 4.9 | 1.51 m |
| 30° | 0.193 m/ns | 2.4 | 2.14 m |
| 19° | 0.296 m/ns | 1.0 | 3.29 m |

At the paper's shallowest angle, 19°, the fit returns almost the speed of light in air (0.30 m/ns), and puts the pipe more than three times too deep. Multiply the fitted speed by sin θ and you get back **0.096 m/ns** at every angle (Figure 2). So the angle is not a detail: without it, depth from a single line is unreliable. That is why the paper's choice to predict the angle matters, and why its "moderately accurate" angle limits everything downstream.

<!-- fig:hyper -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Simulated two-way times over a 0.3 m pipe whose top is 1.0 m down in soil with a wave speed of 0.09 m/ns, crossed at 90, 45 and 19 degrees. The apex is at 22.22 ns in every case; the shallower the angle, the flatter the hyperbola." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>One pipe, three crossing angles</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">One pipe, three crossing angles</text><line x1="58" x2="546" y1="101.2" y2="101.2" style="stroke:var(--line)"/><text x="52" y="105.2" text-anchor="end" style="fill:var(--muted)">25</text><line x1="58" x2="546" y1="165.2" y2="165.2" style="stroke:var(--line)"/><text x="52" y="169.2" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="229.2" y2="229.2" style="stroke:var(--line)"/><text x="52" y="233.2" text-anchor="end" style="fill:var(--muted)">35</text><line x1="149.5" x2="149.5" y1="242" y2="246" style="stroke:var(--muted)"/><text x="149.5" y="259" text-anchor="middle" style="fill:var(--muted)">-0.5</text><line x1="302" x2="302" y1="242" y2="246" style="stroke:var(--muted)"/><text x="302" y="259" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="454.5" x2="454.5" y1="242" y2="246" style="stroke:var(--muted)"/><text x="454.5" y="259" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Distance along the survey line (m)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Two-way time (ns)</text><path d="M58 137L73.3 129.1L88.5 121.4L103.8 114.3L119 107.5L134.3 101.1L149.5 95.2L164.8 89.8L180 84.8L195.3 80.5L210.5 76.6L225.8 73.3L241 70.6L256.3 68.4L271.5 66.9L286.8 66L302 65.6L317.3 66L332.5 66.9L347.8 68.4L363 70.6L378.3 73.3L393.5 76.6L408.7 80.5L424 84.8L439.3 89.8L454.5 95.2L469.8 101.1L485 107.5L500.3 114.3L515.5 121.4L530.8 129.1L546 137" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 103.1L73.3 98.8L88.5 94.7L103.8 90.8L119 87.2L134.3 83.8L149.5 80.7L164.8 77.9L180 75.3L195.3 73.2L210.5 71.1L225.8 69.5L241 68L256.3 67L271.5 66.3L286.8 65.7L302 65.6L317.3 65.7L332.5 66.3L347.8 67L363 68L378.3 69.5L393.5 71.1L408.7 73.2L424 75.3L439.3 77.9L454.5 80.7L469.8 83.8L485 87.2L500.3 90.8L515.5 94.7L530.8 98.8L546 103.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 73.9L73.3 72.9L88.5 72L103.8 71.1L119 70.4L134.3 69.6L149.5 68.9L164.8 68.3L180 67.8L195.3 67.3L210.5 66.8L225.8 66.5L241 66.1L256.3 66L271.5 65.7L286.8 65.6L302 65.6L317.3 65.6L332.5 65.7L347.8 66L363 66.1L378.3 66.5L393.5 66.8L408.7 67.3L424 67.8L439.3 68.3L454.5 68.9L469.8 69.6L485 70.4L500.3 71.1L515.5 72L530.8 72.9L546 73.9" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Crossed at 90°</text><line x1="184.8" x2="196.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="200.8" y="40" style="fill:var(--muted)">Crossed at 45°</text><line x1="311.6" x2="323.6" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="327.6" y="40" style="fill:var(--muted)">Crossed at 19°</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Simulated reflection times over one buried pipe (0.3 m wide, top 1.0 m down, soil wave speed 0.09 m/ns: our assumptions), for three angles between the survey line and the pipe. Not the paper's data.</figcaption></figure>
<!-- /fig:hyper -->

<!-- fig:angle -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Wave speed found by fitting a hyperbola to a 0.3 m pipe in soil of 0.09 m/ns, as the survey line turns from 90 to 19 degrees to the pipe. At 19 degrees the fit gives 0.2962 m/ns, faster than is possible in soil; multiplying by sin(angle) gives back about 0.0964." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Speed from a hyperbola fit, against crossing angle</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Speed from a hyperbola fit, against crossing angle</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="182" y2="182" style="stroke:var(--line)"/><text x="52" y="186" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="122" y2="122" style="stroke:var(--line)"/><text x="52" y="126" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="62" y2="62" style="stroke:var(--line)"/><text x="52" y="66" text-anchor="end" style="fill:var(--muted)">0.3</text><line x1="90.5" x2="90.5" y1="242" y2="246" style="stroke:var(--muted)"/><text x="90.5" y="259" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="220.7" x2="220.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="220.7" y="259" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="350.8" x2="350.8" y1="242" y2="246" style="stroke:var(--muted)"/><text x="350.8" y="259" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="480.9" x2="480.9" y1="242" y2="246" style="stroke:var(--muted)"/><text x="480.9" y="259" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Angle between survey line and pipe (°)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Fitted wave speed (m/ns)</text><line x1="58" x2="546" y1="188" y2="188" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="183" text-anchor="end" style="fill:var(--muted)">true soil speed, 0.09</text><line x1="58" x2="546" y1="62" y2="62" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="57" text-anchor="end" style="fill:var(--muted)">speed of light in air, 0.30</text><path d="M84 64.3L123.1 105.1L155.6 126.4L220.7 152.2L253.2 160.4L285.7 166.7L350.8 175.5L415.9 180.7L480.9 183.6L546 184.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M84 184.2L123.1 184.2L155.6 184.2L220.7 184.3L253.2 184.3L285.7 184.3L350.8 184.4L415.9 184.5L480.9 184.5L546 184.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Fitted as if at 90°</text><line x1="220.8" x2="232.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="236.8" y="40" style="fill:var(--muted)">Multiplied by sin(angle)</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The wave speed the GPR viewer's hyperbola fit returns for the same pipe, as the crossing angle changes, and the same speed multiplied by the sine of the angle. The fit is exact only at 90°.</figcaption></figure>
<!-- /fig:angle -->

**Step 5: antenna separation.** With the transmitter and receiver 0.16 m apart, the 0.3 m pipe at 90° gives 0.0960 m/ns instead of 0.0959 and an apex of 22.28 ns instead of 22.21: at 1 m depth the separation hardly matters. It matters more for the shallowest pipes.

## How we made the graphs

Every number and both charts come from `scripts/blog-figures/gpr-pipe-hyperbola-velocity-crossing-angle-burial-depth.mjs` in fibub's public code. It calls `fitHyperbola` (least-squares fit of t² = a x² + b x + c, giving the speed, apex and depth), `depthOf` and `epsOf` from `src/lib/sci/gpr.ts`, the maths behind the [[gpr-viewer|GPR radargram viewer]].

From the paper: the 0.16 m separation, 60 traces per metre, and the ranges of times, depths, diameters and angles. **Our assumptions**: the soil speed of 0.09 m/ns, the 1.0 m depth, the ±0.8 m pick window, and a cylinder echo taken from the nearest point of the pipe. All curves are **simulated**, not the paper's radargrams.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/gpr-viewer.mjs`:

- 60 picked hyperbolas are fitted and must equal NumPy's `polyfit` of t² against x to 1.5 × 10⁻⁹; noise-free ones must give back the true speed and depth.
- On the built-in made-up profile, the pipe's hyperbola must give 0.1 m/ns, a depth of 0.7 m and a permittivity of 8.99.
- New with this article: a 0.3 m pipe in 0.09 m/ns soil, fitted as a point, gives 0.0959 m/ns and 1.065 m; crossed at 19° it gives 0.296 m/ns, and times sin 19° gives 0.0964.

## Check it yourself

On the [[gpr-viewer|GPR radargram viewer]]:

1. Press **Use the made-up example**. It is a 12 m line over two pipes in soil with a wave speed of 0.1 m/ns; *Trace spacing (m, empty for trace numbers)* is filled in for you.
2. Press **Pick a hyperbola** and tap at least three points on one pipe's hyperbola: its top and a point on each arm.
3. The result card shows *Wave speed from the hyperbola* of about **0.1 m/ns** and a relative permittivity of about **9**.
4. Now suppose that line had crossed the pipe at 45°. Multiply the speed by sin 45° = 0.707: about **0.071 m/ns**, a permittivity of about **18**. Type 0.071 in *Wave speed v (m/ns)* and watch the depth axis on the right shrink: the same echo, a shallower pipe.
5. Try sin 19° = 0.326 to see how far off a fit at a shallow angle would be.

## What researchers can use it for

- **Check a hyperbola speed before trusting a depth**: a result near 0.3 m/ns in soil means a shallow crossing angle, not dry ground ([[gpr-viewer|GPR radargram viewer]]).
- **Plan survey grids**: lines that cross pipes near right angles give honest speeds; a second, perpendicular set of lines gives the angle.
- **Build training data for a detector**: the forward formulas in the script make hyperbolas for any size, depth and angle, to test a network on cases it has not seen.
- **Turn speed into water content**: the permittivity the viewer gives can go into a soil-moisture relation of your choice.
- **Combine methods**: confirm a pipe's depth with a [[magnetic-anomaly|magnetic model]] if it is iron, or a resistivity sounding for the soil layers.

## The fine print

- Our hyperbolas are **simulated**; the paper's per-pipe numbers are in images we did not use.
- We took the echo from the nearest point of a round pipe and ignored the antenna's footprint, the pipe's contents and layered soil.
- The 0.09 m/ns soil speed and the pairing of the shortest time with the shallowest pipe are **our assumptions**.
- The viewer's fit treats the target as a point crossed at right angles. Correct for the angle yourself, as above.
