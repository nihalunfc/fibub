---
title: "Pore-free 3Y zirconia: bending strength doubles when residual pores go"
summary: "A 2026 study made 3 mol% yttria zirconia with no detectable pores and measured 2.3 GPa in four-point bending. Here is how fracture mechanics links strength to flaw size."
tools: [fracture-toughness-calculator, stress-strain-analyser, uncertainty-calculator]
updated: 2026-11-10
sources:
  - "Ikesue, A. and Aung, Y. L. (2026), Fracture Strength and Behavior of Pore-Free 3 mol% Y2O3:ZrO2 Ceramics, Ceramics 9(7), 64, published 23 June 2026. Open access under a Creative Commons Attribution (CC BY) licence. Details checked on the publisher's page, 2026-11-10."
  - "K = Yσ√(πa), Y = 1.12 for a shallow surface crack and 2/π for a buried penny crack: standard linear elastic fracture mechanics (for example Anderson, Fracture Mechanics, chapter 2)."
paper:
  title: "Fracture Strength and Behavior of Pore-Free 3 mol% Y2O3:ZrO2 Ceramics"
  authors: "Ikesue A, Aung YL"
  journal: "Ceramics"
  year: 2026
  doi: "10.3390/ceramics9070064"
  url: "https://www.mdpi.com/2571-6131/9/7/64"
  licence: "CC BY"
  reviewed: true
---

Zirconia stabilised with 3 mol% yttria (often written 3Y-TZP) is one of the toughest ceramics in use, found in dental crowns, hip joint heads, cutting blades and pump seals. A 2026 open-access paper in *Ceramics* shows that its strength depends far more on tiny leftover pores than on anything else: when the authors removed the pores they could detect, the bending strength roughly doubled, while the fracture toughness hardly changed. That is exactly the situation linear elastic fracture mechanics describes, and the [[fracture-toughness-calculator]] lets you see why a pore smaller than a red blood cell can decide when a ceramic part breaks.

## What they found

The authors made three kinds of 3Y zirconia. Sample A was a single tetragonal phase with no pores they could find. Sample B was also pore-free but had a little cubic phase and slightly bigger grains. Sample C was pressed at a lower pressure during the final step and kept pores of about 0.3 µm.

In four-point bending the paper reports about 2.29 GPa for sample A, 1.74 GPa for B and 1.11 GPa for C. In a three-point test sample A reached about 2.55 GPa. The fracture toughness of sample C was 4.8 MPa√m, and the authors describe the pore-free samples as similar, with no clear gain. So the material did not become tougher. It simply stopped carrying the small defects that start a crack.

## Why it matters

Ceramics do not bend or stretch before they break. They fail from the worst flaw in the most stressed place, so their strength is set by two things: how tough the material is, and how big that flaw is. This study points to the more direct route: take away the flaws.

## How they did it

Fine zirconia powder (particles of about 80 nm) was spray dried, pressed, pressed again from all sides, heated to burn out the binder, pre-sintered and then hot isostatically pressed in argon at 176 MPa (49 MPa for sample C). To hunt for pores the team used infrared transmission microscopy, which looks through the material, and electron microscopy of etched surfaces. Strength bars of 3 × 4 × 40 mm were broken following the Japanese bending standard JIS R1601. Toughness was measured with single-edge pre-cracked beams (JIS R1607), where a sharp crack is grown on purpose and then loaded until it runs.

## Check it yourself with fibub

The key relation is K = Yσ√(πa): the stress intensity K at the tip of a crack of size a under stress σ, with a shape factor Y. The part breaks when K reaches the fracture toughness K_IC. Turned around, it gives the largest flaw a part can carry at a given stress. The numbers below are **our own round values**, not the paper's data.

1. Open the [[fracture-toughness-calculator]] and choose the geometry **Edge crack, wide plate** (Y = 1.12), the usual model for a shallow flaw at a ground surface.
2. Type a crack depth of **0.002 mm** (2 µm), a stress of **1000 MPa** and a fracture toughness of **5 MPa√m**.
3. Zirconia barely yields before it breaks, so type a large yield strength such as **10000 MPa** to keep the plasticity notes out of the way, and a thickness of **3 mm**. Ignore the plane-strain check for this case: it is meant for metal test pieces.
4. Read the result: K is about **2.81 MPa√m**, a safety factor of about **1.78**. The critical stress for this crack is about **1779 MPa**, and the critical crack size at 1000 MPa is about **0.006327 mm**, so this flaw could grow to about 6.3 µm before the part breaks.
5. Change the stress to **2000 MPa**. Now the critical crack size falls to about **0.001582 mm**, only 1.6 µm. Doubling the stress cuts the tolerable flaw by four, since a depends on (K_IC/σ)².
6. Switch to **Buried round (penny) crack** (Y = 2/π) to model a pore deep inside. At 2000 MPa the critical radius is about **4.9 µm**: a buried flaw is less harmful than one at the surface.

You can check step 5 by hand: (5 ÷ (1.1215 × 2000))² ÷ π = 1.58 × 10⁻⁶ m. Real pores are rounded, not sharp cracks, so treat this as an upper-bound picture, not a prediction.

Bending strength comes from the breaking load and the bar's size, and the stress goes with one over the thickness squared. The [[uncertainty-calculator]] shows how much a 0.05 mm error in a 3 mm bar moves that stress (about 3 %). For metals tested in tension instead, the [[stress-strain-analyser]] gives the yield strength that the fracture page asks for.

## The fine print

- **"Pore-free" means none found** with the microscopes used. The authors say nanoscale pores cannot be ruled out, and the pore volume in sample C is their estimate rather than a measurement.
- **Few samples.** Only three specimens per sample were looked at for microstructure, and the paper does not report a Weibull modulus, so the spread in strength is not known.
- **Toughness numbers are thin.** Only sample C has a toughness value in the text; A and B are described in words.
- **Ground surfaces.** Bars were ground with a coarse wheel, and the authors note polishing might raise the strength further, so grinding scratches may also be fracture origins.
- The calculator treats a flaw as a sharp crack in an elastic body. Grain-scale effects, the transformation toughening of zirconia and the true shape of a pore are not in the formula.
