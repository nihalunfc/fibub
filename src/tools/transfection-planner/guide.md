---
name: Transfection planner
num: 190
shelf: science
section: cell-biology-and-cell-culture
title: "Transfection planner"
summary: "Lay out your constructs, controls and replicates on a 6 to 384-well plate, automatically or by tapping wells. Get the DNA, reagent, diluent and medium for every tube and well from your amounts per well, with a spare margin, a printable colour plate map and a pipetting table."
status: live
ads: true
order: 12
icon: table
works: offline
updated: 2026-11-09
related: [plate-layout, pcr-master-mix, hemocytometer, cell-doubling-time, moi-calculator, fluorescence-image-analyser, fcs-viewer, plasmid-map, nucleic-acid-concentration]
sources:
  - "The arithmetic (amount per well × wells × spare, DNA volume = mass ÷ stock, reagent = ratio × DNA) is written by fibub and checked in the tests against a hand-worked example and an independent NumPy script."
  - "The starting amounts per well and the example stocks are rounded values made up by fibub. They are not from any kit insert or paper; type the amounts your reagent's instructions give."
flow:
  - { icon: sliders, label: "Plate" }
  - { icon: flask, label: "Conditions" }
  - { icon: target, label: "Map" }
  - { icon: table, label: "Pipette" }
---

## What it does

A transfection is easy to describe and fiddly to set up: six constructs in triplicate, a mock, an untransfected control, a plate that has to be mapped, and a pile of small volumes that all scale with the number of wells. This planner does the layout and the sums together. Pick a plate, list your conditions with their replicates, and you get a colour plate map you can print, one reagent master mix for everything, and a table that says exactly what goes in each tube.

It works for lipid and polymer reagents that are mixed with DNA in a diluent (often serum-free medium) and then added to cells. It does not hold any kit's numbers: the starting amounts are rounded values made up by fibub, so type in what your reagent's instructions say.

For a plain plate layout of standards and samples, use the [[plate-layout|plate layout designer]]; to count the cells you seed, the [[hemocytometer]].

## How to use it

1. **Plate and amounts per well.** Choose 6, 12, 24, 48, 96 or 384 wells. The amounts change to rounded starting values for that size. Then set:
   - **DNA per well (ng)**: how much plasmid each well gets.
   - **Reagent per µg DNA (µL)**: the reagent : DNA ratio. 3 means 3 µL of reagent for every µg of DNA.
   - **Diluent per well (µL)** and **Diluent in the DNA tube (%)**: the diluent is split between a DNA tube and a reagent tube, which are combined later. 50 % puts half in each. 100 % means the reagent goes in neat.
   - **Medium per well (µL)**: the medium already on the cells.
   - **Spare (%)**: extra in every tube so the last well is not short.
2. **Conditions.** Give each one a name, a type and replicates. A **construct** or **control plasmid** gets DNA and reagent and needs its **stock** in ng/µL. **Mock** gets the reagent and diluent but no DNA. **Untransfected** wells only get medium.
3. **Plate map.** Auto layout puts each condition's replicates side by side, across rows or down columns, and can keep the edge wells empty. To change it by hand, choose a condition in "Tapping a well puts" and tap wells; tap a well again to empty it. The amounts always follow the map.
4. **Pipetting plan.** Follow the steps: make the reagent mix, fill one DNA tube per condition, add the reagent mix to each tube, then add the complex to each well. Download the plan as an image, PDF or Word file, or the table and the well list as CSV.

## The maths

For every well with reagent: reagent = ratio × DNA (in µg). The DNA tube holds diluent × share, the reagent tube diluent × (1 − share) + reagent, and the complex per well is both together. A condition with n wells is made for n × (1 + spare). Its DNA volume is the DNA mass ÷ the stock, and diluent tops the DNA tube up to its volume. The shared reagent mix is made for everything the tubes take from it, plus the spare once more, since it is pipetted again.

## Worked example

The page opens with a made-up 24-well plan: Gene X (500 ng/µL), Gene X mutant (400 ng/µL), an empty vector (1000 ng/µL), GFP (200 ng/µL), a mock and an untransfected control, each in triplicate, with 500 ng DNA, 3 µL reagent per µg, 50 µL diluent split half and half, 500 µL medium and 10 % spare. That is 18 wells, rows A to C.

Each well gets 1.50 µL of reagent and 51.5 µL of complex. Gene X is made for 3.30 wells: 1.65 µg of DNA, which is 3.30 µL of stock, plus 79.2 µL of diluent, then 87.5 µL of reagent mix. The mutant needs 4.13 µL of DNA and GFP 8.25 µL. Five tubes take reagent mix, so the mix is 481 µL: 27.2 µL of reagent in 454 µL of diluent. The medium for 18 wells with spare is 9.90 mL.

## Tips

- Keep the reagent : DNA ratio the same across conditions, and change only the DNA, so the mock is a fair control.
- If a DNA volume is below about 0.5 µL, dilute the stock first; the page warns you.
- The complex is usually a small part of the well; the page warns when it is more than a quarter of the medium.
- For a co-transfection, premix the plasmids and enter the mix as one construct with its combined concentration.

## FAQ

**Why is there spare twice?** Each tube is made for its wells plus spare, and the reagent mix is made for all the tubes plus spare again, since every transfer loses a little.

**Can I mix plate sizes?** Plan each plate separately.

**Is anything saved or sent?** No. Everything runs in your browser and is gone when you close the page.
