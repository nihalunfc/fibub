---
title: "Trionda World Cup ball: drag crisis at the lowest Reynolds number yet"
summary: "Wind-tunnel tests put the 2026 Trionda ball's drag crisis at 11.9 m/s, Re 1.7 × 10⁵. We work out the Reynolds numbers and fly the ball with fibub's drag maths."
tools: [dimensionless-numbers, projectile-drag, boundary-layer]
updated: 2026-11-24
sources:
  - "Goff, J. E., Hong, S., Liu, R. and Asai, T. (2026), Trionda: Enhanced Surface Roughness Relative to Previous FIFA World Cup Match Balls, Applied Sciences 16(6): 2808, doi:10.3390/app16062808. Licence CC BY (Creative Commons Attribution), checked on the MDPI page, 2026-11-24. Values used here: ball diameter 0.22 m and area 0.038 m²; air density 1.2 kg/m³ and kinematic viscosity 1.55 × 10⁻⁵ m²/s; wind-tunnel speeds 7 to 35 m/s on non-spinning balls; critical speeds 11.9 m/s for Trionda, about 14 to 18 m/s for Al Rihla, Telstar 18 and Brazuca, 21.9 and 26.9 m/s for Jabulani; drag coefficient at the critical speed about 0.15 to 0.17 (Jabulani about 0.11 to 0.12); trajectories at 25° and 15 to 35 m/s with no spin, g = 9.8 m/s²; Trionda groove widths 9.04, 6.08 and 3.26 mm."
  - "Ball mass 410 to 450 g: IFAB Laws of the Game, Law 2 (The Ball)."
paper:
  title: "Trionda: Enhanced Surface Roughness Relative to Previous FIFA World Cup Match Balls"
  authors: "Goff JE, Hong S, Liu R, Asai T"
  journal: "Applied Sciences"
  year: 2026
  doi: "10.3390/app16062808"
  url: "https://www.mdpi.com/2076-3417/16/6/2808"
  licence: "CC BY"
  reviewed: true
---

Every World Cup brings a new ball, and every new ball brings complaints that it flies strangely. The physics behind those complaints is the **drag crisis**: as a ball speeds up, the thin layer of air hugging its surface turns turbulent, clings on further round the back, and the drag suddenly drops. The speed where this happens depends on how rough the surface is. A 2026 paper in *Applied Sciences* measured the 2026 World Cup ball, **Trionda**, in a wind tunnel and found its drag crisis at a lower speed than any of the four World Cup balls before it. This article turns their speeds into **Reynolds numbers** with the [[dimensionless-numbers]] calculator and flies the ball with [[projectile-drag]]. For the skin of air where the crisis starts, see the [[boundary-layer]] tool.

## The paper in brief

The authors mounted five match balls (Jabulani from 2010, Brazuca 2014, Telstar 18, Al Rihla 2022 and Trionda 2026) on a rod in a wind tunnel and measured drag, lift and side forces from 7 to 35 m/s, without spin, in two orientations each. The **critical speed**, where the drag coefficient bottoms out, was **11.9 m/s for Trionda** in both orientations, against roughly 14 to 18 m/s for Brazuca, Telstar 18 and Al Rihla, and **21.9 and 26.9 m/s for Jabulani**, the notoriously smooth 2010 ball. They link Trionda's early crisis to its deep surface grooves, up to 9 mm wide and 1.3 mm deep.

The drag coefficient at the crisis was about 0.15 to 0.17 for the four modern balls. Above it, Trionda's drag was a little higher than its three predecessors'. In simulated flights at 25° and 15 to 35 m/s, Trionda went **less far than the earlier balls at most speeds**.

## Checked with the tools

**Step 1: the Reynolds numbers.** The Reynolds number, Re = UD/ν (speed times diameter over the air's kinematic viscosity), compares the air's inertia with its stickiness, and it is what really decides when a boundary layer turns turbulent. With the paper's own diameter and air values, the [[dimensionless-numbers]] calculator gives:

| Ball | Critical speed (paper) | Critical Re, tool | Tool's note for a sphere |
|---|---|---|---|
| Trionda | 11.9 m/s | 168,903 | Newton regime, drag roughly constant |
| Brazuca era, lower end | 14 m/s | 198,710 | Newton regime |
| Brazuca era, upper end | 18 m/s | 255,484 | Newton regime |
| Jabulani, orientation A | 21.9 m/s | 310,839 | drag crisis region |
| Jabulani, orientation B | 26.9 m/s | 381,806 | drag crisis region |

The tool's regime note is written for a **smooth** sphere, whose crisis sits near Re 3 × 10⁵. Jabulani, nearly smooth, lands right there. Trionda reaches its crisis at about **half that Reynolds number**, which is exactly what the paper means by enhanced roughness: the grooves trip the boundary layer early, as dimples do on a golf ball.

**Step 2: is a kicked Trionda ever below its crisis?** We flew a 0.43 kg ball (**our assumption**; the rules allow 410 to 450 g) with a constant drag coefficient of 0.20 (**our assumption**, just above the paper's crisis values) at the paper's 25° and 15, 25 and 35 m/s. The slowest point of each flight is **12.3, 17.3 and 19.9 m/s** (Figure 1). All three stay above 11.9 m/s for the whole flight, so a Trionda in open play is always past its drag crisis. A Jabulani kicked at 25 m/s, by contrast, would spend about 83 % of its flight below its 21.9 m/s crisis speed, in the high-drag regime.

<!-- fig:speed -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Speed against time for kicks at 15, 25 and 35 m/s and 25 degrees. The slowest point of each flight is 12.3, 17.3, 19.9 m/s, all above the Trionda's 11.9 m/s drag-crisis speed, while the 15 and 25 m/s kicks spend most or all of their flight below the Jabulani's 21.9 m/s." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Ball speed during the flight (Cd 0.20, 25° kick)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Ball speed during the flight (Cd 0.20, 25° kick)</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="188.7" y2="188.7" style="stroke:var(--line)"/><text x="52" y="192.7" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="135.3" y2="135.3" style="stroke:var(--line)"/><text x="52" y="139.3" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="82" y2="82" style="stroke:var(--line)"/><text x="52" y="86" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="145.1" x2="145.1" y1="242" y2="246" style="stroke:var(--muted)"/><text x="145.1" y="259" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="232.3" x2="232.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="232.3" y="259" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="319.4" x2="319.4" y1="242" y2="246" style="stroke:var(--muted)"/><text x="319.4" y="259" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="406.6" x2="406.6" y1="242" y2="246" style="stroke:var(--muted)"/><text x="406.6" y="259" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="493.7" x2="493.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="493.7" y="259" text-anchor="middle" style="fill:var(--muted)">2.5</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Time after the kick (s)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Speed (m/s)</text><line x1="58" x2="546" y1="178.5" y2="178.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="173.5" text-anchor="end" style="fill:var(--muted)">Trionda crisis 11.9</text><line x1="58" x2="546" y1="125.2" y2="125.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="120.2" text-anchor="end" style="fill:var(--muted)">Jabulani crisis 21.9</text><path d="M58 162L62.5 162.9L67.1 163.8L71.6 164.6L76 165.4L80.5 166.2L85 166.9L89.5 167.7L94.1 168.3L98.6 169L103.1 169.7L107.7 170.3L112 170.9L116.6 171.4L121.1 172L125.6 172.5L130.2 172.9L134.7 173.4L139.2 173.8L143.7 174.2L148.1 174.5L152.6 174.9L157.2 175.1L161.7 175.4L166.2 175.7L170.8 175.9L175.3 176L179.8 176.2L184.2 176.3L188.7 176.4L193.2 176.5L197.8 176.5L202.3 176.5L206.8 176.5L211.4 176.5L215.9 176.4L220.3 176.3L224.8 176.2L229.3 176L233.9 175.9L238.4 175.7L242.9 175.4L247.4 175.2L252 175L256.3 174.6L260.9 174.4L265.4 174.1L269.9 173.7L274.5 173.3L276.6 173.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 108.7L65.5 111.1L73 113.5L80.5 115.7L88 117.9L95.6 120L103.1 122L110.6 124L118.1 125.8L125.6 127.6L133.1 129.3L140.6 131L148.1 132.5L155.8 134L163.3 135.4L170.8 136.8L178.3 138.1L185.8 139.3L193.2 140.4L200.7 141.5L208.2 142.5L215.9 143.4L223.4 144.3L230.9 145.1L238.4 145.8L245.9 146.5L253.4 147.1L260.9 147.7L268.4 148.1L276 148.6L283.5 148.9L291 149.2L298.5 149.5L306 149.7L313.5 149.8L321 149.9L328.5 149.9L336.2 149.9L343.7 149.8L351.1 149.7L358.6 149.6L366.1 149.4L373.6 149.1L381.1 148.9L388.6 148.6L396.3 148.2L403.8 147.8L404.7 147.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 55.3L68.5 60.7L79.1 65.8L89.5 70.6L100 75.2L110.6 79.6L121.1 83.8L131.7 87.7L142.2 91.4L152.6 95L163.3 98.4L173.7 101.5L184.2 104.6L194.8 107.4L205.3 110.1L215.9 112.6L226.4 115L236.8 117.2L247.4 119.3L257.9 121.3L268.4 123.1L279 124.7L289.5 126.3L300.1 127.7L310.5 129L321 130.2L331.6 131.2L342.1 132.1L352.5 133L363.2 133.7L373.6 134.3L384.3 134.9L394.7 135.2L405.2 135.5L415.8 135.8L426.3 136L436.7 136L447.4 136L457.8 135.9L468.4 135.8L478.9 135.5L489.4 135.3L500 134.9L510.4 134.5L514.3 134.4" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Kicked at 15 m/s</text><line x1="199.2" x2="211.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="215.2" y="40" style="fill:var(--muted)">Kicked at 25 m/s</text><line x1="340.4" x2="352.4" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="356.4" y="40" style="fill:var(--muted)">Kicked at 35 m/s</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Speed along the flight for three kicks at 25°, from the Projectile drag tool's maths with a constant drag coefficient of 0.20 and a 0.43 kg ball (our assumptions). Dashed lines: the drag-crisis speeds measured in the paper for Trionda and for Jabulani (orientation A).</figcaption></figure>
<!-- /fig:speed -->

**Step 3: why a little more drag matters.** Because Trionda lives above its crisis, its range is set by its **post-crisis drag**, and the paper found that a little higher than the older balls'. Figure 2 shows how sensitive range is to it: at 25 m/s and 25°, the tool gives **38.9 m** with Cd 0.15, **36.6 m** with 0.20 and **34.6 m** with 0.25. At 35 m/s the spread is wider, 64.7 to 54.2 m. Without air the same kicks would go 48.9 and 95.8 m, so drag takes a quarter to over a third of the distance. A modest rise in drag above the crisis is enough for the shorter ranges the paper reports.

<!-- fig:range -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Range on level ground for a 0.43 kg, 22 cm ball kicked at 25 degrees. At 25 m/s it is 38.9, 36.6 and 34.6 m for drag coefficients 0.15, 0.20 and 0.25." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Range of a 25° kick for three drag coefficients</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Range of a 25° kick for three drag coefficients</text><line x1="58" x2="546" y1="201.7" y2="201.7" style="stroke:var(--line)"/><text x="52" y="205.7" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="141" y2="141" style="stroke:var(--line)"/><text x="52" y="145" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="80.3" y2="80.3" style="stroke:var(--line)"/><text x="52" y="84.3" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="180" x2="180" y1="232" y2="236" style="stroke:var(--muted)"/><text x="180" y="249" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="302" x2="302" y1="232" y2="236" style="stroke:var(--muted)"/><text x="302" y="249" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="424" x2="424" y1="232" y2="236" style="stroke:var(--muted)"/><text x="424" y="249" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">35</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Launch speed (m/s)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Range (m)</text><path d="M58 213.6L82.4 207.6L106.8 201.2L131.2 194.7L155.6 188L180 181L204.4 173.9L228.8 166.7L253.2 159.4L277.6 151.9L302 144.3L326.4 136.6L350.8 128.9L375.2 121.2L399.6 113.3L424 105.5L448.4 97.7L472.8 89.8L497.2 81.9L521.6 74L546 66.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 215L82.4 209.2L106.8 203.3L131.2 197.2L155.6 190.9L180 184.6L204.4 178.1L228.8 171.5L253.2 164.8L277.6 158.1L302 151.4L326.4 144.6L350.8 137.8L375.2 131L399.6 124.1L424 117.3L448.4 110.5L472.8 103.8L497.2 97L521.6 90.4L546 83.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 216.2L82.4 210.8L106.8 205.2L131.2 199.5L155.6 193.7L180 187.7L204.4 181.8L228.8 175.8L253.2 169.7L277.6 163.6L302 157.5L326.4 151.4L350.8 145.3L375.2 139.2L399.6 133.2L424 127.2L448.4 121.3L472.8 115.3L497.2 109.5L521.6 103.7L546 97.9" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Cd 0.15</text><line x1="134.4" x2="146.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="150.4" y="40" style="fill:var(--muted)">Cd 0.20</text><line x1="210.8" x2="222.8" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="226.8" y="40" style="fill:var(--muted)">Cd 0.25</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How far a 25° kick goes for three constant drag coefficients, from the same maths. A small rise in post-crisis drag costs metres at match speeds.</figcaption></figure>
<!-- /fig:range -->

These are **simulations with a constant drag coefficient**, not the paper's measured drag curves, which change with speed and are given only in its figures.

## How we made the graphs

The charts and every number come from `scripts/blog-figures/trionda-world-cup-ball-drag-crisis-critical-reynolds-number-range.mjs` in fibub's public code. It calls `dimensionless` from `src/lib/sci/phdimless.ts` (the [[dimensionless-numbers]] calculator) for the Reynolds numbers and regime notes, and `simulate` and `vacuum` from `src/lib/sci/phprojectile.ts` (the [[projectile-drag]] tool: quadratic drag integrated with fourth-order Runge-Kutta) for the flights.

The diameter, air density, viscosity, gravity, launch angle and speeds, and the critical speeds come from the paper's text. The mass of 0.43 kg and the constant drag coefficients of 0.15, 0.20 and 0.25 are **our assumptions**. The flights have no spin, so no lift or swerve, as in the paper's own trajectory runs.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs the tool checks:

- `tests/sci-tools/dimensionless-numbers.mjs` pins all 13 numbers for water at 1 m/s in a 5 cm pipe against an independent NumPy script (Re 49,900, Prandtl 6.990, Rayleigh 1.792 × 10⁷), and the mean free path of air at 64.94 nm.
- `tests/sci-tools/projectile-drag.mjs` pins the tool's example flight against SciPy's ODE solver: a range of 94.850 m, 4.1019 s in the air and a landing speed of 24.826 m/s, and the ranges with a 5 m/s headwind (84.413 m) and tailwind (104.911 m).
- New with this article: a 22 cm ball in the paper's air must give Re 168,903 at 11.9 m/s, labelled Newton regime, and Re 310,839 at 21.9 m/s, labelled drag crisis.

## Check it yourself

On the [[dimensionless-numbers]] calculator:

1. Choose *Fluid* **Air, 20 °C, 1 atm**, set *Shape* to **Past a sphere or drop**, *Speed U* to **11.9** m/s and *Sphere diameter* L to **22** cm.
2. Open *Fluid properties* and set *Density ρ* to **1.2** and *Viscosity μ* to **1.86e-5** (1.2 × 1.55 × 10⁻⁵, the paper's air).
3. *Reynolds Re* reads **168903**. Change the speed to **21.9** for Jabulani: **310839**, and the note switches to the drag crisis region.

On [[projectile-drag]]:

1. Choose *Object* **Custom**, then type *Launch speed* **25**, *Launch angle* **25**, *Launch height* **0**, *Mass* **0.43**, *Diameter* **22**, *Drag coefficient Cd* **0.2**, *Wind* **0**, *Air density* **1.2** and *Gravity* **9.8**.
2. *Range* shows **36.58 m**, *Time of flight* **1.99 s** and *Landing speed* **17.7 m/s**, above Trionda's crisis speed. *Without air* gives **48.85 m**: drag takes **25.1 %** off.
3. Raise *Drag coefficient Cd* to **0.25**: the range falls to **34.56 m**.

## What researchers can use it for

- **Compare balls fairly** by turning wind-tunnel speeds into Reynolds numbers, so tests at different temperatures or with different ball sizes line up, with the [[dimensionless-numbers]] calculator.
- **Check whether a shot ever crosses the crisis**: fly it in [[projectile-drag]] and compare its slowest speed with the measured critical speed.
- **Bound a range effect**: rerun a kick with the lowest and highest plausible drag coefficients to see how many metres are at stake.
- **Teach the drag crisis** with a sphere, a golf ball and a football side by side: same flow, different roughness, different critical Re. The [[boundary-layer]] tool shows where a laminar layer turns turbulent on a flat surface.
- **Scale a model test**: match Re between a small model in water and a full-size ball in air.

## The fine print

- Our flights use one constant drag coefficient for the whole flight. Real drag changes with speed, most sharply through the crisis, and a spinning ball also feels lift and side forces.
- The ball masses the paper measured are not given in its text; 0.43 kg is our choice within the rules.
- Critical speeds were measured on non-spinning balls held on a rod; spin and the rod can both shift the crisis a little.
- The tool's sphere notes assume a smooth sphere. For rough balls the crisis comes earlier, as this paper shows.
