---
name: PCR master mix calculator
num: 31
shelf: science
section: molecular-biology
title: "PCR master mix calculator with a printable checklist (free)"
summary: "Type your stocks and final concentrations, the reaction volume and the number of reactions. Get the volume of every component for one reaction and for the whole mix with spare, plus water, as a tick-off list."
status: live
ads: true
order: 10
icon: flask
works: offline
updated: 2026-11-08
related: [solution-calculator, plate-layout, calibration-curve]
flow:
  - { icon: sliders, label: "Stocks" }
  - { icon: calculator, label: "Volumes" }
  - { icon: check, label: "Tick off" }
---

## What it does

A master mix saves pipetting and keeps every reaction the same: you mix everything that is common to all tubes once, then share it out. This calculator works out how much of each stock goes into one reaction and into the whole mix, adds a spare margin for liquid lost in tips, and fills the rest with water. It works for PCR, qPCR, RT-PCR, restriction digests, or any reaction built from stocks.

It starts with New England Biolabs' standard 50 µL Taq protocol: 1X buffer, 200 µM of each dNTP, 0.2 µM of each primer, 1.25 units of Taq, and the template added to each tube. Change any line to match your kit's manual.

Check the primers first with the [[primer-checker]], and lay out the wells with the [[plate-layout]].

## How to use it

1. Set the **reaction volume**, the **number of reactions** (samples plus controls) and the **spare** percentage.
2. For each component, type the **stock** concentration and the **final** amount in the reaction, each with its unit:
   - **X** for buffers (10X stock to 1X final).
   - **M, mM, µM, nM** for dNTPs, primers, MgCl₂ and probes. The stock and final can use different units: 10 mM to 200 µM works.
   - **ng/µL, µg/mL, mg/mL** for mass concentrations such as BSA.
   - **U** per reaction with a **U/µL** stock, for enzymes.
   - **µL** for a fixed volume, such as 1 µL of template or enhancer.
3. Untick **In the mix** for anything added to each tube separately, usually the template.
4. Read the table. The last column is what you pipette into one tube for the master mix. Tick each line as you add it, then share out the mix and add the template.
5. **Print or save** the list as PDF, an image or a Word file to take to the bench.

## Worked example

Ten reactions of 50 µL with 10 % spare make 11 reactions' worth. Per reaction you need 5 µL of 10X buffer, 1 µL each of 10 mM dNTPs and the two 10 µM primers, 0.25 µL of Taq at 5 U/µL, and 40.75 µL of water. That makes 49 µL of mix per tube, with 1 µL of template added. The whole mix is 55 µL buffer, 11 µL dNTPs, 11 µL of each primer, 2.75 µL Taq and 448.25 µL water: 539 µL in total.

## Frequently asked questions

**Why add water first and enzyme last?** Enzymes are sensitive to concentrated salts and glycerol and should go into a mostly complete, cold mix. Mix gently, because vortexing can denature some polymerases.

**The calculator says the components add up to more than the reaction.** Your stocks are too weak for the final amounts asked, or a fixed volume is too large. Use stronger stocks or a bigger reaction.

**Does it save my recipe?** No. Nothing is stored or sent anywhere. Save the PDF to keep a record.

Prepare stocks with the [solutions and dilutions calculator](/science/solution-calculator/) and map your tubes or wells with the [plate layout designer](/science/plate-layout/).
