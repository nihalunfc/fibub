---
title: "Recycled concrete aggregate in foundations: strength loss, absorption and CO2"
summary: "A 2025 Buildings study tested recycled aggregate concrete for plain foundations. See how thirsty recycled stone changes the mix water, in your browser."
tools: [concrete-mix-design, hypothesis-tests]
updated: 2026-11-10
sources:
  - "Pavlů T, Pešta J, Fořtová K, Řepka J (2025), Buildings 15(8): 1237, the paper described here."
  - "Absolute volume method and moisture correction: general concrete technology textbooks (method only)."
  - "All mix inputs in the worked example, apart from the cement content and w/c ratio named as the paper's, are made up by fibub."
paper:
  title: "Recycled Concrete in Foundations: Mechanical and Environmental Insights"
  authors: "Pavlů T, Pešta J, Fořtová K, Řepka J"
  journal: "Buildings"
  year: 2025
  doi: "10.3390/buildings15081237"
  url: "https://www.mdpi.com/2075-5309/15/8/1237"
  licence: "CC BY"
  reviewed: true
---

Crushed old concrete can replace quarried stone in new concrete, but how far can you go before the mix stops doing its job? A team at the Czech Technical University in Prague made recycled aggregate concrete for plain foundations, at four cement contents and with up to all of the stone replaced, and reported strength, stiffness, water uptake and a life-cycle assessment in Buildings in 2025. This page explains the study and shows how the [[concrete-mix-design|concrete mix calculator]] handles the trickiest part of working with recycled stone: its thirst for water. To compare two sets of cube results, the [[hypothesis-tests|hypothesis test picker]] runs the t test.

## What they found

Recycled aggregate cost strength, and how much depended on the aggregate and the mix. The worst case, the richest mix (grade IV) with recycled aggregate, lost about 67 % of its compressive strength against the matching natural mix; the leanest mix with the single-crushed aggregate lost about 55 %. Aggregate crushed in two stages did better than aggregate crushed once. Flexural strength fell by up to 56 % with the weaker aggregate but stayed above the Eurocode values for the target classes. The modulus of elasticity fell by about 4 % at 30 % coarse replacement and more at higher levels.

Water absorption of the hardened concrete rose sharply, up to about 3.3 times for full replacement with the weaker aggregate, which the authors flag as a durability question. Fine recycled aggregate (recycled sand) performed poorly, and they advise against it for structural beams.

## Why it matters

Foundations use a lot of concrete and often need only modest strength, so they are a natural home for recycled stone. A study that ties the mechanical numbers to an environmental balance helps designers decide where recycled aggregate is good enough, rather than banning it or using it everywhere.

## How they did it

Natural aggregate concrete was made at four grades, from 240 kg of CEM I cement per m³ at an effective water/cement ratio of 1.00 up to 320 kg at 0.50, aiming at classes from C25/30 to C35/45. Coarse aggregate was replaced at 30, 50 and 100 %, and some mixes also replaced the sand. Two recycled aggregates were compared, one crushed in a single stage and one in two stages. The team tested compressive and flexural strength, modulus of elasticity, water absorption and capillary uptake, and ran a life-cycle assessment with a 50 km transport baseline.

## Check it yourself with fibub

The word "effective" in effective w/c ratio is the key. Recycled stone carries old mortar, which soaks up much more water than quarried rock. If the stockpile is drier than the stone's absorption, the stone drinks part of the mixing water, and the paste ends up stiffer and drier than planned. The mix calculator corrects for this.

We take a cement content of 300 kg/m³ at w/c 0.55, like the paper's grade III mix, so the free water is 165 kg/m³. Every other input is **made up**: 2 % air, coarse aggregate fraction 0.6, cement SG 3.15, sand SG 2.62 with 3 % moisture and 1 % absorption.

1. **Natural stone.** Enter a dry-rodded density of 1600 kg/m³, SG 2.68, 1 % moisture and 0.5 % absorption. The calculator gives 960 kg of stone and 947 kg of sand per m³, a fresh density of about 2372 kg/m³, and a field water of **141 kg**, because the damp aggregates bring about 24 kg of their own.
2. **Recycled stone.** Change the stone to a dry-rodded density of 1350 kg/m³, SG 2.35, absorption 6 % and stock moisture 2 %. Now the stone mass is 810 kg, the sand rises to 983 kg to fill the space, and the fresh density falls to about 2258 kg/m³. The field water jumps to **178 kg**: the stone soaks up 32.4 kg, so the mixer must add more water just to keep the free water at 165 kg.
3. **What if nobody corrects?** If the crew adds the usual 145 kg, the free water left for the cement is about 165 − 32 = 133 kg, an effective w/c of about 0.44. The concrete is harder to place and compact, and voids can cost more strength than the drier paste gains.
4. **Pre-wet the stone.** Set the recycled stone's moisture to 6 %, equal to its absorption. The field water drops back to 145 kg, and the stone itself now weighs 859 kg wet. Many producers pre-soak recycled aggregate for exactly this reason.
5. **Target strength.** Recycled mixes often scatter more. With f'c 25 MPa and k 1.65, a standard deviation of 4 MPa gives a target mean of 31.6 MPa; 6 MPa pushes it to 34.9 MPa. Wider scatter means more cement for the same characteristic strength, which eats into the CO2 saving.
6. **Compare test results.** Put your natural and recycled cube strengths into the hypothesis test picker as two separate groups to see whether the drop is larger than the scatter.

## The fine print

- Only plain foundations in mild exposure classes (X0 and XC1) were considered; aggressive environments and reinforced members were not assessed.
- Durability testing was limited to water absorption and capillary uptake.
- The aggregate properties come from one region's demolition waste; other sources can be much better or worse.
- The life-cycle results depend on Czech conditions, the 50 km transport assumption and generic database values.
- The authors suggest washing the aggregate and using blended cements as next steps, so the mixes here are not optimised.
