---
title: "Capric–lauric–myristic acid eutectic for heat storage: the 17 °C prediction rebuilt"
summary: "A 2026 study predicts a three-fatty-acid eutectic melting at 17.1 °C for storing heat in buildings and measures 16.0 °C. fibub's phase diagram maths rebuilds the prediction to the last digit."
tools: [phase-diagram-calculator, dsc-tga-analyser, heating-curve]
updated: 2026-11-24
sources:
  - "Zhou, D., Zhou, F., Yuan, J., Liu, Z. and Liu, Y. (2026), Phase Diagrams and Thermal Properties of Fatty Acid Ternary Eutectic Mixtures for Latent Heat Thermal Energy, Materials 19(2): 356, doi:10.3390/ma19020356. Licence CC BY (Creative Commons Attribution), checked on the MDPI page, 2026-11-24. Values used here (as they appear in the paper's worked equations): capric acid 303.65 K, 176.0 J/g, 172.26 g/mol; lauric acid 316.95 K, 182.0 J/g, 200.32 g/mol; myristic acid 325.45 K, 188.6 J/g, 228.37 g/mol. Predicted ternary eutectic 290.26 K (17.11 °C), mole ratio 57.45:28.03:14.52, mass ratio 52.58:29.81:17.61, latent heat 31,569.6 J/mol or 167.8 J/g; pseudo-binary prediction 82.4:17.6 by mass at 17.20 °C, 180.0 J/g; measured (DSC) eutectic 52.0:30.0:18.0 by mass, melting at 16.0 °C with 177.0 J/g."
  - "Ideal eutectic (Schröder–van Laar) equation: Schröder, I. (1893), Z. Phys. Chem. 11: 449; van Laar, J. J. (1903), Z. Phys. Chem. 63: 216; see Atkins, P. and de Paula, J., Physical Chemistry (ideal solubility)."
paper:
  title: "Phase Diagrams and Thermal Properties of Fatty Acid Ternary Eutectic Mixtures for Latent Heat Thermal Energy"
  authors: "Zhou D, Zhou F, Yuan J, Liu Z, Liu Y"
  journal: "Materials"
  year: 2026
  doi: "10.3390/ma19020356"
  url: "https://www.mdpi.com/1996-1944/19/2/356"
  licence: "CC BY"
  reviewed: true
---

A wall board that melts at about 17 °C soaks up heat on a warm afternoon and gives it back at night, smoothing a room's temperature without any power. Materials that do this are called **phase change materials** (PCMs), and mixtures of fatty acids, the same molecules found in coconut and palm oil, are cheap, safe and stable choices. No single fatty acid melts at the right temperature, but a **eutectic** mixture, the blend with the lowest melting point, can. A 2026 paper in *Materials* predicted the eutectic of three fatty acids from theory and then measured it. This article rebuilds that prediction with the [[phase-diagram-calculator]]. To read melting points and latent heats from your own scans use the [[dsc-tga-analyser]], and to see why the temperature stalls while a solid melts, the [[heating-curve]].

## The paper in brief

The authors mixed **capric acid** (C10, melts at 30.5 °C), **lauric acid** (C12, 43.8 °C) and **myristic acid** (C14, 52.3 °C). To find the eutectic before mixing anything, they used the **Schröder–van Laar equation**: in an ideal mixture where the solids do not dissolve in each other, each acid can stay dissolved in the melt down to a temperature set only by its own melting point and **latent heat** (the heat it takes to melt):

ln xᵢ = −(ΔHᵢ / R)(1/T − 1/Tᵢ)

where xᵢ is the acid's mole fraction in the liquid, ΔHᵢ its molar latent heat, Tᵢ its melting point in kelvin, and R = 8.314 J mol⁻¹ K⁻¹. With three acids, the eutectic is the temperature at which the three fractions add up to exactly 1.

Their prediction: **17.11 °C**, with a mass ratio of **52.58 : 29.81 : 17.61** (capric : lauric : myristic) and a latent heat of 167.8 J/g. They also predicted it in two steps: first the capric–lauric eutectic, then that blend treated as one substance mixed with myristic acid, giving 82.4 : 17.6 at 17.20 °C. Measured by **differential scanning calorimetry** (DSC, which records the heat a sample takes in as it warms), the real eutectic was **52.0 : 30.0 : 18.0, melting at 16.0 °C with 177.0 J/g**: close to the prediction, a little cooler and storing a little more heat.

## Checked with the tools

The phase diagram calculator's maths, `src/lib/sci/phase.ts`, holds exactly this ideal equation: `liqA` and `liqB` are the liquidus curves and `eutectic` finds where they meet. We used the paper's own inputs: melting points in kelvin, and molar latent heat = latent heat in J/g × molar mass (for capric acid 176.0 × 172.26 = 30,318 J/mol).

**Step 1: the capric–lauric pair.** The tool puts their eutectic at **20.54 °C with 33.44 mol % lauric acid** (36.88 % by mass). Figure 1 shows the two liquidus branches meeting there.

<!-- fig:binary -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Ideal Schröder–van Laar liquidus for capric and lauric acids; eutectic at 20.5 °C and 33.4 mol % lauric acid." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Capric acid + lauric acid: ideal phase diagram</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Capric acid + lauric acid: ideal phase diagram</text><line x1="58" x2="546" y1="211" y2="211" style="stroke:var(--line)"/><text x="52" y="215" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="149.1" y2="149.1" style="stroke:var(--line)"/><text x="52" y="153.1" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="87.2" y2="87.2" style="stroke:var(--line)"/><text x="52" y="91.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="242" y2="246" style="stroke:var(--muted)"/><text x="155.6" y="259" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="253.2" x2="253.2" y1="242" y2="246" style="stroke:var(--muted)"/><text x="253.2" y="259" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="350.8" x2="350.8" y1="242" y2="246" style="stroke:var(--muted)"/><text x="350.8" y="259" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="448.4" x2="448.4" y1="242" y2="246" style="stroke:var(--muted)"/><text x="448.4" y="259" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="546" x2="546" y1="242" y2="246" style="stroke:var(--muted)"/><text x="546" y="259" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Lauric acid (mol %)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Temperature (°C)</text><line x1="58" x2="546" y1="207.7" y2="207.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="202.7" text-anchor="end" style="fill:var(--muted)">solidus</text><path d="M58 146L62.9 207.7L67.8 207.7L72.6 207.7L77.5 207.7L82.4 207.7L87.3 207.7L92.2 207.7L97 207.7L101.9 207.7L106.8 207.7L111.7 207.7L116.6 207.7L121.4 207.7L126.3 207.7L131.2 207.7L136.1 207.7L141 207.7L145.8 207.7L150.7 146L155.6 146L160.5 146L165.4 146L170.2 146L175.1 146L180 146L184.9 146L189.8 146L194.6 146L199.5 146L204.4 146L209.3 146L214.2 146L219 146L223.9 63.6L228.8 63.6L233.7 63.6L238.6 63.6L243.4 63.6L248.3 63.6L253.2 63.6L258.1 63.6L263 63.6L267.8 63.6L272.7 63.6L277.6 63.6L282.5 63.6L287.4 63.6L292.2 63.6L297.1 63.6L302 63.6L306.9 63.6L311.8 63.6L316.6 63.6L321.5 63.6L326.4 63.6L331.3 63.6L336.2 63.6L341 63.6L345.9 63.6L350.8 207.7L355.7 207.7L360.6 207.7L365.4 207.7L370.3 207.7L375.2 207.7L380.1 207.7L385 207.7L389.8 207.7L394.7 207.7L399.6 207.7L404.5 207.7L409.4 207.7L414.2 207.7L419.1 207.7L424 207.7L428.9 207.7L433.8 207.7L438.6 207.7L443.5 207.7L448.4 207.7L453.3 207.7L458.2 207.7L463 207.7L467.9 207.7L472.8 207.7L477.7 207.7L482.6 207.7L487.4 207.7L492.3 207.7L497.2 207.7L502.1 207.7L507 207.7L511.8 207.7L516.7 207.7L521.6 207.7L526.5 207.7L531.4 207.7L536.2 207.7L541.1 207.7L546 63.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="221" cy="207.7" r="4" style="fill:var(--c-blog);opacity:1"/><text x="229" y="223.7" text-anchor="start" style="fill:var(--ink)">20.5 °C at 33.4 mol %</text><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Liquidus</text><circle cx="146.6" cy="36" r="4" style="fill:var(--c-blog)"/><text x="157.6" y="40" style="fill:var(--muted)">Eutectic</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The ideal capric–lauric acid phase diagram from the Phase diagram calculator's maths, using the melting points and latent heats in the paper. Each branch is the Schröder–van Laar liquidus of one acid; they meet at the eutectic.</figcaption></figure>
<!-- /fig:binary -->

**Step 2: add myristic acid.** Treating that blend as one component (melting at 20.54 °C, with a mole-weighted latent heat of 32,371 J/mol and molar mass 181.64 g/mol) and running the tool's eutectic again gives **17.11 °C at 17.6 % myristic acid by mass**, the paper's 82.4 : 17.6 (Figure 2). Our temperature is 0.09 °C below the paper's two-step 17.20 °C; the paper does not give the latent heat it used for the blend, and that is the likely cause.

<!-- fig:pseudo -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Pseudo-binary diagram: the predicted eutectic is 17.11 °C at 17.6 wt % myristic acid; the measured one is 16 °C at 18 wt %." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Adding myristic acid to the capric–lauric eutectic</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Adding myristic acid to the capric–lauric eutectic</text><line x1="58" x2="546" y1="196.8" y2="196.8" style="stroke:var(--line)"/><text x="52" y="200.8" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="140.4" y2="140.4" style="stroke:var(--line)"/><text x="52" y="144.4" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="83.9" y2="83.9" style="stroke:var(--line)"/><text x="52" y="87.9" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="139.3" y="259" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="220.7" x2="220.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="220.7" y="259" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="302" x2="302" y1="242" y2="246" style="stroke:var(--muted)"/><text x="302" y="259" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="383.3" x2="383.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="383.3" y="259" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="464.7" x2="464.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="464.7" y="259" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="546" x2="546" y1="242" y2="246" style="stroke:var(--muted)"/><text x="546" y="259" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Myristic acid (wt %)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Temperature (°C)</text><line x1="58" x2="546" y1="213.1" y2="213.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="208.1" text-anchor="end" style="fill:var(--muted)">predicted 17.11 °C</text><path d="M58 193.8L66.1 213.1L74.3 213.1L82.4 213.1L90.5 213.1L98.7 213.1L106.8 213.1L114.9 213.1L123.1 213.1L131.2 213.1L139.3 193.8L147.5 193.8L155.6 193.8L163.7 193.8L171.9 193.8L180 193.8L188.1 193.8L196.3 193.8L204.4 14.4L212.5 14.4L220.7 14.4L228.8 14.4L236.9 14.4L245.1 14.4L253.2 14.4L261.3 14.4L269.5 14.4L277.6 14.4L285.7 14.4L293.9 14.4L302 14.4L310.1 14.4L318.3 14.4L326.4 14.4L334.5 14.4L342.7 14.4L350.8 14.4L358.9 14.4L367.1 14.4L375.2 14.4L383.3 14.4L391.5 14.4L399.6 14.4L407.7 14.4L415.9 14.4L424 14.4L432.1 213.1L440.3 213.1L448.4 213.1L456.5 213.1L464.7 213.1L472.8 213.1L480.9 213.1L489.1 213.1L497.2 213.1L505.3 213.1L513.5 213.1L521.6 213.1L529.7 213.1L537.9 213.1L546 213.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="204.4" cy="219.4" r="4" style="fill:var(--c-blog);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Ideal liquidus</text><circle cx="189.8" cy="36" r="4" style="fill:var(--c-blog)"/><text x="200.8" y="40" style="fill:var(--muted)">Measured eutectic (DSC)</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The capric–lauric eutectic treated as a single component and mixed with myristic acid, again with the Phase diagram calculator's maths. The dot is the paper's measured three-acid eutectic (DSC), about 1 °C below the ideal prediction.</figcaption></figure>
<!-- /fig:pseudo -->

**Step 3: the full three-acid equation.** Summing the tool's three liquidus fractions and solving for a total of 1 gives:

| Quantity | Paper (predicted) | fibub's maths | Paper (measured, DSC) |
|---|---|---|---|
| Eutectic temperature | 290.26 K, 17.11 °C | 290.26 K, 17.11 °C | 16.0 °C |
| Mole ratio C10 : C12 : C14 | 57.45 : 28.03 : 14.52 | 57.46 : 28.02 : 14.52 | not given |
| Mass ratio C10 : C12 : C14 | 52.58 : 29.81 : 17.61 | 52.58 : 29.81 : 17.61 | 52.0 : 30.0 : 18.0 |
| Latent heat, T·Σ xᵢΔHᵢ/Tᵢ | 31,569.6 J/mol, 167.8 J/g | 31,585 J/mol, 167.8 J/g | 177.0 J/g |
| Latent heat, plain mass average | 180.0 J/g (two-step) | 180.0 J/g | |

Every predicted number comes back, to rounding. Two details stand out. The paper's 180.0 J/g for the two-step route is simply the mass-weighted average of the three acids' latent heats, while its 167.8 J/g uses a formula that scales each acid's latent heat by T/Tᵢ, a rough correction for melting below each acid's own melting point. The measured 177.0 J/g lies between the two. And the measured mixture, 52 : 30 : 18, is not quite the predicted eutectic: put through the same ideal model it would finish melting at 17.49 °C, yet it melted at 16.0 °C. Real fatty acids mix slightly better than ideal in the melt, which pulls the eutectic down by a degree or so; the ideal equation is a starting point, not the last word.

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/capric-lauric-myristic-acid-ternary-eutectic-phase-change-schroder-van-laar.mjs` in fibub's public code. It calls `eutectic`, `liqA`, `liqB` and `toMass` from `src/lib/sci/phase.ts`, the maths behind the [[phase-diagram-calculator]]. The three-acid step adds up three `liqB` curves and solves for a total of 1 with a short bisection in the script; the tool itself draws two-component diagrams.

The melting points, latent heats and molar masses are the paper's own values, so this is a **recomputation** of its prediction. Treating the capric–lauric eutectic as one substance with mole-weighted properties is **our assumption** for Step 2, as the paper does not say how it did it.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs the phase diagram checks, which pin the tool to published values:

- The ideal benzene–naphthalene eutectic must fall within 0.2 °C of the measured −3.5 °C, and the bismuth–cadmium eutectic must be 135.31 °C at 41.09 wt % cadmium.
- Copper–nickel at 35 wt % nickel must have its liquidus at 1237.06 °C and solidus at 1211.35 °C, and the lever rule must give 0.682 liquid for a textbook example (Callister).
- New with this article, in `tests/sci-tools/phase-diagram-calculator.mjs`: the capric–lauric eutectic must be 293.69 K at 33.44 mol % lauric acid, the three-acid eutectic must match the paper's 290.26 K and its mole and mass ratios to 0.02 %, and the two-step route must give 17.6 wt % myristic acid.

## Check it yourself

On the [[phase-diagram-calculator]], under *Phase diagram of a binary mixture*:

1. Set *System* to **Your own components** and *Type of diagram* to **Simple eutectic (solids do not mix)**.
2. Type *A name* **capric acid**, *A melting point (°C)* **30.5**, *A enthalpy of fusion (kJ/mol)* **30.318**, *A molar mass (g/mol)* **172.26**; *B name* **lauric acid**, **43.8**, **36.458**, **200.32**.
3. The *Eutectic* line reads **20.5 °C at 36.9 wt % lauric acid** (switch *Given as* to **mol %** to see 33.4).
4. Now make the blend component A: *A name* **C10–C12 eutectic**, **20.54** °C, **32.371** kJ/mol, **181.64** g/mol; and B *myristic acid*, **52.3** °C, **43.071** kJ/mol, **228.37** g/mol.
5. The *Eutectic* line reads **17.1 °C at 17.6 wt % myristic acid**. Set *Amount of B overall* to **18** wt % and *Temperature* to **25**: the *Liquidus* shows **17.5 °C**, the ideal melting end of the paper's measured blend.

## What researchers can use it for

- **Screen PCM blends before the lab**: predict the eutectic of any two candidate fatty acids, alcohols or salts from their melting points and latent heats with the [[phase-diagram-calculator]].
- **Build a three-component estimate in two steps**, as in Step 2, and see how close it gets to the full equation.
- **Measure the gap from ideal**: compare a DSC eutectic from the [[dsc-tga-analyser]] with the ideal one; a lower real eutectic means the liquids attract each other more than ideal.
- **Report latent heat with its rule**: say whether a predicted value is a mass average or the T/Tᵢ-scaled form, since they differ by 12 J/g here.
- **Teach phase diagrams** with a material students can melt in their hand, alongside the [[heating-curve]].

## The fine print

- This is a recomputation of the paper's prediction from its stated inputs; we did not have its DSC curves.
- The ideal equation assumes the solid acids do not mix at all. Fatty acids with similar chain lengths can form partial solid solutions, which the model ignores.
- We read the paper's numbers 176.0, 182.0 and 188.6 as latent heats in J/g and 172.26, 200.32 and 228.37 as molar masses; these agree with handbook values and reproduce every result.
- Storage performance in a building also depends on how much the PCM supercools and on heat transfer, which neither the paper's prediction nor this tool covers.
