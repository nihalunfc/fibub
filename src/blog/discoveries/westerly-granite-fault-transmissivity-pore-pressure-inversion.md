---
title: "Fault permeability in Westerly granite mapped from pore pressures"
summary: "A lab fault in granite gets its permeability mapped in 3-D from six pore-pressure sensors. We use the Darcy flow calculator to turn the transmissivities into permeability and flow rates."
tools: [darcy-flow-calculator, pump-test-analyser]
updated: 2026-11-16
sources:
  - "Farsi, A., Aben, F. M. and Brantut, N. (2026), Heterogeneous and episodic permeability evolution and correlation with acoustic emission activity during faulting in granite, arXiv:2611.13272 (posted 9 November 2026; preprint). Licence CC BY 4.0, checked on the arXiv page, 2026-11-16. Values used here: sample 40 mm by 100 mm, confining pressure 85 MPa, pore pressure 5 MPa, pressure difference 4.988 MPa, viscosity 1e-3 Pa·s, fault-zone thickness 10 mm, bulk permeability 1e-18 m², intact-rock calibration 2.09e-20 m², notches 15 mm deep at 30° to the axis, sample-average transmissivities 2.38e-20, 7.93e-20, 9.83e-20 and 1.05e-19 m³ at 0.06, 0.35, 0.90 and 1.41 mm of slip, highest local value about 1.6e-19 m³, final-stage range 6.85e-20 to 1.55e-19 m³, synthetic-test errors 7 to 9%, thickness sensitivity about 16%, 3-D to 1-D ratio 0.81."
  - "Water density and viscosity at 20 °C (998.2 kg/m³, about 1.00 mPa·s): standard property values, from the approximate formulas in the Darcy flow calculator."
  - "One darcy = 9.869233e-13 m²: standard definition."
paper:
  title: "Heterogeneous and episodic permeability evolution and correlation with acoustic emission activity during faulting in granite"
  authors: "Farsi, A.; Aben, F. M.; Brantut, N."
  journal: "arXiv preprint"
  year: 2026
  doi: "10.48550/arXiv.2611.13272"
  url: "https://arxiv.org/abs/2611.13272"
  licence: "CC BY 4.0"
  reviewed: false
---

When rock breaks, water can suddenly find a path through it. That matters for earthquakes, for geothermal wells and for anywhere fluids move through the crust. A new lab study (a preprint, not yet peer-reviewed) watched a fault grow inside a granite cylinder and mapped how easily water could flow along it, cell by cell, from six pressure sensors placed inside the rock. This article shows how the [[darcy-flow-calculator]] turns the paper's numbers into permeability, hydraulic conductivity and real flow rates, and how the [[pump-test-analyser]] covers the field-scale version of the same idea.

## The paper in brief

The team squeezed a 40 mm by 100 mm cylinder of **Westerly granite**, a fine-grained rock often used as a standard in rock mechanics, under 85 MPa of confining pressure, roughly the weight of 3 km of rock. Two notches cut at 30° to the axis guided a fault between them. Water was pushed through at a pressure difference of about 5 MPa while the fault grew and slipped by 1.41 mm.

Most lab tests measure only the total flow through the sample. Here six small sensors read the water pressure inside the rock. A 3-D computer model of the sample then worked out which pattern of permeability along the fault best explains those six pressures and the total flow. The fault was split into 10 cells.

The key quantity is **transmissivity**, here permeability times fault-zone thickness (k·t, in m³). It says how much flow the fault can carry, without needing to know exactly how thick the broken zone is. The results:

- Flow along the fault did not grow smoothly. It rose in bursts and sometimes fell back, cell by cell.
- The highest local value was about **1.6 × 10⁻¹⁹ m³**, 16 times what the unbroken rock contributes.
- By the end, values along the fault differed by a factor of **2.3** from cell to cell.
- Tests with made-up data showed the method recovers the cells to within 7 to 9%.
- The count of tiny cracking sounds (acoustic emissions) followed the overall rise in flow, but not reliably cell by cell.

## Checked with the tools

We took the paper's stated values and ran them through the Darcy flow calculator's maths. Everything in this section is a **calculation from the paper's numbers**, not the paper's measured data. Where we had to choose something (water temperature, the length and width of the flow path), we say so.

**Step 1: from transmissivity to permeability.** The paper's model uses a fault zone 10 mm thick, so permeability is transmissivity divided by 0.01 m. The highest local value becomes **1.6 × 10⁻¹⁷ m²**. Permeability is often quoted in darcys (1 darcy = 9.87 × 10⁻¹³ m²), so this is about **16 microdarcys**, against about 1 microdarcy for the bulk rock in the model. The sample-average value grows from 2.4 to 10.5 times the bulk value as slip increases (Figure 1). Granite before failure, at 2.09 × 10⁻²⁰ m², sits about 50 times lower still.

<!-- fig:perm -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 290" role="img" aria-label="Sample-average fault-zone permeability rises from about 2.4e-18 to 1.05e-17 square metres as slip grows from 0.06 to 1.41 mm, above the bulk rock value of 1e-18." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Fault-zone permeability as the fault slips</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Fault-zone permeability as the fault slips</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--line)"/><text x="52" y="248" text-anchor="end" style="fill:var(--muted)">1e-20</text><line x1="58" x2="546" y1="183.4" y2="183.4" style="stroke:var(--line)"/><text x="52" y="187.4" text-anchor="end" style="fill:var(--muted)">1e-19</text><line x1="58" x2="546" y1="122.9" y2="122.9" style="stroke:var(--line)"/><text x="52" y="126.9" text-anchor="end" style="fill:var(--muted)">1e-18</text><line x1="58" x2="546" y1="62.3" y2="62.3" style="stroke:var(--line)"/><text x="52" y="66.3" text-anchor="end" style="fill:var(--muted)">1e-17</text><line x1="58" x2="58" y1="244" y2="248" style="stroke:var(--muted)"/><text x="58" y="261" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="244" y2="248" style="stroke:var(--muted)"/><text x="139.3" y="261" text-anchor="middle" style="fill:var(--muted)">0.25</text><line x1="220.7" x2="220.7" y1="244" y2="248" style="stroke:var(--muted)"/><text x="220.7" y="261" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="302" x2="302" y1="244" y2="248" style="stroke:var(--muted)"/><text x="302" y="261" text-anchor="middle" style="fill:var(--muted)">0.75</text><line x1="383.3" x2="383.3" y1="244" y2="248" style="stroke:var(--muted)"/><text x="383.3" y="261" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="464.7" x2="464.7" y1="244" y2="248" style="stroke:var(--muted)"/><text x="464.7" y="261" text-anchor="middle" style="fill:var(--muted)">1.25</text><line x1="546" x2="546" y1="244" y2="248" style="stroke:var(--muted)"/><text x="546" y="261" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--muted)"/><text x="302" y="282" text-anchor="middle" style="fill:var(--ink)">Slip on the fault (mm)</text><text transform="translate(14 138) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Permeability (m², log scale)</text><line x1="58" x2="546" y1="49.9" y2="49.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="44.9" text-anchor="end" style="fill:var(--muted)">Highest local value</text><line x1="58" x2="546" y1="122.9" y2="122.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="117.9" text-anchor="end" style="fill:var(--muted)">Bulk rock in the model</text><line x1="58" x2="546" y1="224.6" y2="224.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="219.6" text-anchor="end" style="fill:var(--muted)">Intact rock, before failure</text><path d="M77.5 100L171.9 68.4L350.8 62.7L516.7 61" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="77.5" cy="100" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="171.9" cy="68.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="350.8" cy="62.7" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="516.7" cy="61" r="4" style="fill:var(--c-tools);opacity:1"/></svg><figcaption>Figure 1. Fault-zone permeability worked out from the paper's sample-average transmissivities (k·t) and its 10 mm fault-zone thickness, against slip. Log scale. The dashed lines are the paper's highest local value, its bulk rock value and the intact rock before failure.</figcaption></figure>
<!-- /fig:perm -->

**Step 2: from permeability to hydraulic conductivity.** Hydrologists usually work with **hydraulic conductivity** K, which also depends on the fluid: K = k ρ g / μ, where ρ is the water's density, g gravity and μ its viscosity. The paper uses μ = 1.0 mPa·s, the value for water at about 20 °C, so we used 20 °C. The tool gives:

- highest local value: K = **1.56 × 10⁻¹⁰ m/s** (about 0.013 mm per day);
- final sample-average: K = **1.03 × 10⁻¹⁰ m/s**;
- bulk rock: K = **9.8 × 10⁻¹² m/s**;
- intact granite: K = **2.0 × 10⁻¹³ m/s**.

Even the broken fault is close to the "practically watertight" end of the range for rock. Faults in nature are much wider and rougher, and field values are usually far higher.

**Step 3: how much water flows?** A pressure difference of 4.988 MPa is the same as a column of water **509.5 m** high. We assumed the water runs along a strip of fault 40 mm wide (the sample's diameter) and 50 mm long. That is the 80 mm long fault plane, minus the two 15 mm notches. This geometry is our simplification, not the paper's 3-D mesh. Darcy's law then gives the flow along the strip at each stage (Figure 2). Note that the 10 mm thickness drops out: a thicker zone means lower permeability but a bigger flow area, and the two cancel. That is why transmissivity is the robust number, and why the paper finds its results change by only about 16% when the assumed thickness changes by 50%.

<!-- fig:flow -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 290" role="img" aria-label="Calculated flow along a 40 mm wide fault strip rises from about 6 to 25 microlitres per minute with slip; the whole intact cylinder at the bulk permeability passes about 4." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Water flow along the fault and through the rock</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Water flow along the fault and through the rock</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--line)"/><text x="52" y="248" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="193.5" y2="193.5" style="stroke:var(--line)"/><text x="52" y="197.5" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="143" y2="143" style="stroke:var(--line)"/><text x="52" y="147" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="92.6" y2="92.6" style="stroke:var(--line)"/><text x="52" y="96.6" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="42.1" y2="42.1" style="stroke:var(--line)"/><text x="52" y="46.1" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="244" y2="248" style="stroke:var(--muted)"/><text x="58" y="261" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="244" y2="248" style="stroke:var(--muted)"/><text x="139.3" y="261" text-anchor="middle" style="fill:var(--muted)">0.25</text><line x1="220.7" x2="220.7" y1="244" y2="248" style="stroke:var(--muted)"/><text x="220.7" y="261" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="302" x2="302" y1="244" y2="248" style="stroke:var(--muted)"/><text x="302" y="261" text-anchor="middle" style="fill:var(--muted)">0.75</text><line x1="383.3" x2="383.3" y1="244" y2="248" style="stroke:var(--muted)"/><text x="383.3" y="261" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="464.7" x2="464.7" y1="244" y2="248" style="stroke:var(--muted)"/><text x="464.7" y="261" text-anchor="middle" style="fill:var(--muted)">1.25</text><line x1="546" x2="546" y1="244" y2="248" style="stroke:var(--muted)"/><text x="546" y="261" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--muted)"/><text x="302" y="282" text-anchor="middle" style="fill:var(--ink)">Slip on the fault (mm)</text><text transform="translate(14 138) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Flow (microlitres per minute)</text><line x1="58" x2="546" y1="225" y2="225" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="220" text-anchor="end" style="fill:var(--muted)">Whole cylinder at the bulk value</text><line x1="58" x2="546" y1="51" y2="51" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="46" text-anchor="end" style="fill:var(--muted)">Strip at the highest local value</text><path d="M77.5 215.3L171.9 148.3L350.8 125.4L516.7 117.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="77.5" cy="215.3" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="171.9" cy="148.3" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="350.8" cy="125.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="516.7" cy="117.3" r="4" style="fill:var(--c-tools);opacity:1"/></svg><figcaption>Figure 2. Flow of water at 20 °C worked out with the Darcy flow calculator's maths for the paper's 4.988 MPa pressure difference: along a 40 mm wide, 10 mm thick fault strip 50 mm long (our assumed geometry), and through the whole 40 × 100 mm cylinder at the bulk permeability. A calculation, not the measured flow.</figcaption></figure>
<!-- /fig:flow -->

| Check | Paper | Our tool result |
|---|---|---|
| Highest local value vs unbroken rock | about 16 times | 1.6 × 10⁻¹⁷ m² ÷ 1 × 10⁻¹⁸ m² = 16 |
| Spread along the fault at the end | factor of 2.3 | 1.55 ÷ 0.685 = 2.26 |
| Fault-zone permeability, final average | 1.05 × 10⁻¹⁹ m³ ÷ 10 mm | 1.05 × 10⁻¹⁷ m², K = 1.03 × 10⁻¹⁰ m/s |
| Viscosity of the fluid | 1 × 10⁻³ Pa·s | 1.002 mPa·s for water at 20 °C |
| Flow along the fault strip, end of test | (measured, not stated) | about 25 microlitres per minute (our geometry) |
| Flow through the whole cylinder at the bulk value | (not stated) | about 3.8 microlitres per minute |

The flow numbers show why the inner sensors matter. Our simple strip carries 6 to 25 microlitres a minute, a few times what the whole unbroken cylinder would pass. A single total-flow reading cannot say where along the fault that extra water goes. Six pressures inside the rock can.

One honest difference: from the first to the last stage, the stated sample-average values grow by a factor of 4.4 (2.38 to 10.5 × 10⁻²⁰ m³). The paper describes the growth as roughly threefold, probably measured from a different starting point; we could not check which.

## How we made the graphs

The numbers and charts come from `scripts/blog-figures/westerly-granite-fault-transmissivity-pore-pressure-inversion.mjs` in fibub's public code. It imports from `src/lib/sci/darcy.ts`, the maths behind the [[darcy-flow-calculator]]:

- `KFromk` and `kFromK` convert between permeability and hydraulic conductivity, with `waterDensity` and `waterViscosity` at the chosen temperature.
- `darcy` gives the flux and discharge, Q = K × i × A.

Where the inputs come from: the sample size, pressure difference, viscosity, fault-zone thickness, bulk and intact permeabilities and all transmissivities are from the paper. The water temperature (20 °C), the 50 mm flow path and the 40 mm strip width are our assumptions, labelled in the script. Run it and it prints every number above and redraws both charts.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the Darcy maths against hand-worked answers:

- K = 1 × 10⁻⁴ m/s, a gradient of 0.002, 50 m² and porosity 0.25 must give a flux of 2 × 10⁻⁷ m/s, a discharge of 1 × 10⁻⁵ m³/s and a seepage velocity of 8 × 10⁻⁷ m/s.
- Water's viscosity at 20 °C must come out at 1.002 mPa·s, and its density at 4 °C at 1,000 kg/m³.
- Converting K = 3 × 10⁻⁵ m/s to permeability and back at 15 °C must return the same K.

## Check it yourself

**The final fault-zone flow, on the [[darcy-flow-calculator]]:**

1. In the *Darcy flow* card, leave *K comes from* on **the value typed here**.
2. Type **1.03e-10** in *Hydraulic conductivity K* and set *K unit* to **m/s**.
3. Leave *Gradient comes from* on **a head drop over a distance**. Type **509.5** in *Head drop Δh (m)* and **0.05** in *Over a distance (m)*.
4. Type **0.0004** in *Flow area A (m², thickness × width)* (10 mm × 40 mm), **0.01** in *Effective porosity ne* and **20** in *Water temperature (°C)*.
5. The tool shows *Gradient i* **10190**, *Discharge Q = K·i·A* about **3.63 × 10⁻⁵ m³/day** (4.2 × 10⁻⁷ L/s, or 25 microlitres a minute), and *Intrinsic permeability* **1.05 × 10⁻¹⁷ m²** (1.07 × 10⁻⁵ darcy): the paper's final transmissivity divided by 10 mm.

**The whole unbroken cylinder:** change *Hydraulic conductivity K* to **9.77e-12**, *Over a distance (m)* to **0.1** and *Flow area A* to **0.001257** (a 40 mm circle). *Discharge* reads about **5.4 × 10⁻⁶ m³/day**, and *Intrinsic permeability* **1 × 10⁻¹⁸ m²**, the paper's bulk value.

The seepage velocity and travel time the tool also shows depend on the porosity you type; for a tight fault they are not meaningful, so ignore them here.

## What researchers can use it for

- **Convert units in a hurry:** permeability in m² or darcys to hydraulic conductivity at the right water temperature, with the [[darcy-flow-calculator]].
- **Sanity-check a lab table:** does the reported permeability match the flow rate, pressure and sample size? One Darcy calculation tells you.
- **Plan an experiment:** before a test, estimate how many microlitres per minute your pump must measure, so you choose the right flow meter.
- **Scale up to the field:** the [[pump-test-analyser]] gives transmissivity from a pumping test in a real aquifer, the field version of the k·t the paper maps in the lab.
- **Teach** why transmissivity, not permeability alone, is what a thin fault or aquifer layer really controls.

## The fine print

- This is a **preprint, not yet peer-reviewed**. Values may change in the published version.
- Our flow rates use a simple straight strip, not the paper's 3-D model, and are an order-of-magnitude illustration. The paper's own measured flow rates are not quoted in the text we used.
- The paper writes transmissivity as permeability times thickness (m³). Hydrogeologists often use transmissivity in m²/s (K times thickness). Multiply k·t by ρg/μ to convert.
- The water temperature of 20 °C is our choice to match the paper's viscosity. At 10 °C the same permeability gives a K about 23% lower.
