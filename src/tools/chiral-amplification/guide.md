---
name: Chiral amplification lab
num: 3056
shelf: science
code: T1050
section: organic-chemistry
title: "Chiral amplification lab: non-linear effects and asymmetric autocatalysis"
summary: "See how a catalyst's purity passes to its product (Kagan's ML2 model, with a fit to your own ee data) and how a self-copying reaction turns a tiny excess into almost one hand (Soai-type autocatalysis)."
status: live
ads: false
order: 3056
icon: curve
works: offline
updated: 2026-11-19
related: [chirality-checker, reaction-kinetics-fitter, racemisation-age, ode-solver]
sources:
  - "ML2 model: Guillaneux D, Zhao S-H, Samuel O, Rainford D, Kagan HB (1994), J. Am. Chem. Soc. 116: 9430-9439; first report of non-linear effects: Puchot C et al. (1986), J. Am. Chem. Soc. 108: 2353-2357."
  - "Asymmetric autocatalysis: Soai K, Shibata T, Morioka H, Choji K (1995), Nature 378: 767-768; dimer picture as discussed by Blackmond DG and others. The autocatalysis model here is a simplified teaching model written for fibub, not a fit to any paper's data."
  - "Example data in the box are made up for practice."
flow:
  - { icon: curve, label: "Set" }
  - { icon: curve, label: "See" }
  - { icon: check, label: "Check" }
---

## What it does

Many catalysts that make one mirror-image form of a molecule carry two chiral pieces (ligands). If the ligand is not perfectly pure, the catalyst exists as three kinds of pair: two "homochiral" ones (RR and SS) and a mixed, "meso" one (RS). Henri Kagan found in 1986 that the product's purity then need not follow the ligand's purity in a straight line: it can bow above it (a positive non-linear effect) or sag below it (a negative one). This lab draws that curve with Kagan's ML2 model, and fits the model to your own pairs of ligand ee and product ee.

The second mode follows Kenso Soai's discovery: a reaction whose product is its own catalyst. If mixed RS pairs sit idle while RR makes more R and SS makes more S, a tiny excess grows batch after batch until almost only one hand is left. Both ideas earned the 2026 Nobel Prize in Chemistry; the [[blog:nobel/chemistry-2026-kagan-non-linear-effects|Nobel series on the prize]] explains the history. To check which hand a molecule is, use the [[chirality-checker]]; to fit rate data from your own runs, the [[reaction-kinetics-fitter]].

## How to use it

1. Pick **Non-linear effect (Kagan)** or **Autocatalysis (Soai)**.
2. For the non-linear effect, set **K**, **g** and **ee with a pure catalyst**. The curve and table update as you type.
3. Paste your own results (ligand ee and product ee in %, one pair per line) into the box. With four or more pairs the lab fits K and g, shows R² and plots your points on the curve.
4. For autocatalysis, set the **starting ee** (it can be tiny), the **seed share** carried into each batch, **K** and the number of **batches**.
5. Read the result, the facts and the table; download the CSV, or a PNG, PDF or Word report.

## What each setting does

- **Mixed-pair constant K**: K = z²/(x·y) for the shares of RR (x), SS (y) and RS (z). K = 4 is what pure chance gives; larger K means mixed pairs are favoured.
- **Mixed-pair reactivity g**: how fast an RS pair turns over compared with a homochiral pair. 0 means idle; above 1 means busier.
- **ee with a pure catalyst**: the best ee the reaction gives with an enantiopure ligand.
- **Ligand ee to read off**: the point reported in the headline.
- **Starting ee, seed share, batches**: the first batch's excess, how much of each batch is the previous product, and how many batches to run.

## Worked example

Paste the example pairs (0→0, 10→25, 20→44, 40→71, 60→86, 80→94, 100→98, all in %) with ee_max = 98 %. The lab fits **K ≈ 32** and **g ≈ 0.18** with R² ≈ 0.9998, and reads off **44 % product ee from a 20 % pure ligand**: a strong positive non-linear effect. The table also shows the price: at 20 % ligand ee the catalyst runs at only about a quarter of the speed of a pure one, because most of it is locked in idle mixed pairs.

In autocatalysis mode the defaults (starting ee 0.00005 %, seed 5 %, K = 50) give about 1.3 %, then 89 %, then 99.5 % after three batches: the same three-batch climb that Soai's group reported.

## FAQs

**Is the autocatalysis model the real mechanism?** It is a simplified teaching model built on the dimer idea that kinetic studies of the Soai reaction support. Real systems have more species, so treat its K as a knob, not a measured constant.

**Can I fit negative effects?** Yes. g above 1 gives a curve below the line; the fit searches g from 0 upwards.

**Does anything leave my device?** No. All the maths runs in your browser.
