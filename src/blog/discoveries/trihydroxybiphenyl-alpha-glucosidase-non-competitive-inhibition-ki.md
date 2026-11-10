---
title: "α-Glucosidase inhibition by 3,4,5-trihydroxybiphenyl: non-competitive, Ki about 26 µM"
summary: "A biphenyl from rowan leaves slows the starch-splitting enzyme α-glucosidase without competing with its substrate. Here is how to fit Km, Vmax and Ki and tell inhibition types apart."
tools: [enzyme-kinetics-fitter, dose-response, binding-curve-fitter]
updated: 2026-11-10
sources:
  - "Guo R et al. (2025), Frontiers in Pharmacology 16: 1584264, CC BY, the paper described here."
  - "Michaelis–Menten kinetics and the rate laws for competitive, uncompetitive, non-competitive and mixed inhibition, with model choice by AICc: standard enzymology, worked here with the enzyme kinetics fitter's own code."
  - "Cheng and Prusoff (1973), Biochem. Pharmacol. 22: 3099-3108, for how IC50 relates to Ki in each inhibition type."
paper:
  title: "Exploring the inhibitory effect and mechanism of 3,4,5-trihydroxybiphenyl on α-glucosidase: an integrated experimental and computational approach"
  authors: "Guo R, Yu G, Li Y, Wang Y, Fan H, Zhang S, Wang C, Zhou J, Yang J, Gao F, Luo Z"
  journal: "Frontiers in Pharmacology"
  year: 2025
  doi: "10.3389/fphar.2025.1584264"
  url: "https://www.frontiersin.org/articles/10.3389/fphar.2025.1584264/full"
  licence: "CC BY"
  reviewed: true
---

α-Glucosidase is the enzyme that cuts the last sugar off short starch fragments, so that glucose can be taken up. Slowing it is a long-studied way to flatten the rise in blood sugar after a meal, which is why new inhibitors keep being tested. A team in China isolated 3,4,5-trihydroxybiphenyl (THB) from the leaves of a rowan tree, *Sorbus pohuashanensis*. They report that it blocks the enzyme strongly and does not compete with the substrate for the active site. Telling inhibition types apart is exactly what the [[enzyme-kinetics-fitter]] does, so you can rehearse their analysis with it.

## What they found

THB cut the enzyme's activity by half at 11.52 µM (the IC50) and by 96.5 % at 50 µM, in a test-tube assay. Rate plots at several substrate and THB levels led the authors to call the inhibition reversible and non-competitive. In that type, the inhibitor can sit on the free enzyme or on the enzyme-substrate complex equally well. It lowers the top speed, Vmax, but leaves Km, the substrate level that gives half that speed, unchanged. They give Km as 0.69 mM, Vmax falling from 2.99 to 2.60 µM/min, and an inhibition constant Ki of 26.26 ± 4.95 µM.

Surface plasmon resonance gave a dissociation constant of 39.1 µM for THB on the enzyme. Circular dichroism showed the enzyme's shape changing, and computer docking and dynamics suggested a binding pocket. THB combined with acarbose, a known α-glucosidase inhibitor, gave combination indices of 0.32 to 1.05 (below 1 means the two work better together than expected). A short mouse test is also reported.

## Why it matters

How an inhibitor works matters as much as how strong it is. A competitive inhibitor is pushed aside when a lot of substrate is present. A non-competitive one keeps working however much starch arrives. A natural product that acts the second way, and that adds to acarbose, is a reasonable lead for further lab study. This is early research, not a treatment.

## How they did it

1. THB was isolated from the leaves and its structure confirmed.
2. The enzyme was mixed with THB for 15 minutes, then with the colourless substrate pNPG. Its product, p-nitrophenol, is yellow and was read at 405 nm.
3. Rates at several pNPG and THB levels were drawn as Lineweaver–Burk plots (1/rate against 1/substrate). The slopes were plotted against THB to get Ki.
4. Binding and shape changes were checked by surface plasmon resonance and circular dichroism.
5. Docking and a 200 ns molecular dynamics run modelled where THB sits.

## Check it yourself with fibub

The rates below are made up by us to show the method, not taken from the paper. We built them from a non-competitive model with Vmax 3.0 µM/min, Km 0.7 mM and Ki 0.025 mM (25 µM), then nudged each one by up to 2 % to mimic scatter.

**Step 1: paste three columns.** Use substrate (mM), inhibitor (mM) and rate (µM/min), one row per measurement: 24 rows in all. Take six substrate levels (0.2, 0.4, 0.7, 1.4, 2.8 and 5.6 mM) at each of four inhibitor levels, with these rates in µM/min, listed in substrate order:

| Inhibitor (mM) | Rates at 0.2, 0.4, 0.7, 1.4, 2.8, 5.6 mM substrate |
|---|---|
| 0 | 0.680, 1.075, 1.515, 1.980, 2.436, 2.613 |
| 0.01 | 0.471, 0.795, 1.055, 1.443, 1.706, 1.943 |
| 0.025 | 0.337, 0.535, 0.765, 0.990, 1.206, 1.313 |
| 0.05 | 0.219, 0.369, 0.495, 0.673, 0.784, 0.893 |

So the first row you type is `0.2 0 0.680` and the last is `5.6 0.05 0.893`. Set the concentration unit to mM and the rate unit to µM/min. Clear the enzyme box unless you know the enzyme concentration.

**Step 2: read the verdict.** On "Best supported", the tool picks **non-competitive inhibition: Vmax 2.98 ± 0.019 µM/min, Km 0.693 ± 0.013 mM, Ki 0.0252 ± 0.00037 mM**, so 25.2 µM. The model table gives it about 78 % of the weight. Mixed inhibition comes next, about 2.6 AICc units behind, and its two constants are almost equal (Ki′/Ki about 1.05), which is just non-competitive again. Competitive and uncompetitive are ruled out, about 112 and 76 units behind. On the Lineweaver–Burk plot the four lines meet on the x-axis, the textbook picture of non-competitive inhibition.

**Step 3: compare IC50 with Ki.** For a purely non-competitive inhibitor, the IC50 equals Ki at any substrate level. For a competitive one it grows as Ki × (1 + [S]/Km). With the paper's Ki of 26.26 µM, Km of 0.69 mM and 10 mM pNPG, a competitive inhibitor would show an IC50 near 407 µM. The reported 11.52 µM therefore fits non-competitive behaviour far better. But it is less than half of Ki, and the simple model predicts about 66 % inhibition at 50 µM rather than 96.5 %. To fit an IC50 from your own percentage-inhibition series, use the [[dose-response]] page. To fit a Kd from surface plasmon resonance or a titration, try the [[binding-curve-fitter]].

## The fine print

- The kinetic constants come from Lineweaver–Burk lines. That plot stretches the least accurate low-substrate rates, so a direct non-linear fit of the raw rates would be a useful cross-check.
- The paper does not name the organism the assay enzyme came from. The docking used a yeast enzyme structure. Yeast and human gut enzymes respond to inhibitors differently.
- The gap between IC50 and Ki, and between 96.5 % and the model's 66 % at 50 µM, suggests the inhibition is not purely non-competitive, or that the enzyme and pre-incubation conditions differed between experiments.
- The circular dichroism used 3 mM THB, far above the IC50, so the shape change may not reflect assay conditions.
- The upper combination index of 1.05 means an additive effect, not a synergistic one.
- This page explains a lab study. It is not medical advice.
