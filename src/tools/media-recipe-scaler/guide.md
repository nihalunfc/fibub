---
name: Stock solution and media recipe scaler
num: 183
shelf: science
section: biochemistry
title: "Media and buffer recipe scaler: any volume, N× stocks, weigh-outs and C1V1 = C2V2"
summary: "Type a recipe once, as final concentrations or amounts per litre, and scale it to any volume or to a 5× or 10× stock. Get the mass to weigh for every solid (from molarity and molar mass), the volume of every stock to add, a warning when a stock is too dilute, and a printable recipe card."
status: live
ads: true
order: 5
icon: flask
works: offline
updated: 2026-11-09
related: [solution-calculator, buffer-recipe-calculator, pcr-master-mix]
sources:
  - "Unit conversions, mass = molarity × volume × molar mass and C1V1 = C2V2 are standard lab arithmetic, written by fibub and checked in the tests against hand-worked examples and an independent Python script."
  - "Molar masses from a formula use the standard atomic weights already on the site (the formula calculator)."
  - "Both examples (a wash buffer and a simple bacterial broth) are made up with plain round amounts, not copied from any published recipe. Check every amount against your own protocol."
flow:
  - { icon: table, label: "Recipe" }
  - { icon: sliders, label: "Scale" }
  - { icon: calculator, label: "Amounts" }
  - { icon: download, label: "Card" }
---

## What it does

Most lab solutions are written once as a recipe (20 mM Tris, 150 mM salt, 10 % glycerol) and then made again and again in different volumes. This page does the arithmetic for every line at once:

- **Scale to any volume.** Type the final volume in L, mL or µL and every amount follows.
- **N× stocks.** Set the strength to 5 or 10 and every component becomes five or ten times stronger, so you can keep a concentrated stock and dilute it on the day. The page tells you how to dilute it back.
- **Weigh-outs.** For a solid given as a molarity, the mass is molarity × volume × molar mass. Type the molar mass from the bottle, or a formula such as `MgCl2·6H2O`, and the page works it out. Amounts in g/L, mg/mL, µg/mL or % w/v need no molar mass.
- **Stock volumes.** For a component that comes from a stock you already have, the volume to add comes from C1V1 = C2V2. The stock can be in other units than the target (a stock in g/L for a target in mM, using the molar mass).
- **Checks.** A warning appears when a stock is too dilute to reach the target, when the liquids add up to more than the final volume, when a neat liquid would have to be over 100 %, or when a volume is too small to pipette well.

Units: g/L, mg/L, µg/L, mg/mL, µg/mL, % w/v, M, mM, µM, % v/v, mL/L, µL/mL and X (as in a 10X buffer).

## How to use it

1. **Recipe.** Start from an example or *Start empty*. For each component, type its name, its final amount and unit, and how it is added: *Weigh* (a solid, or anything you weigh), *Neat* (a liquid measured by volume, such as glycerol) or *Stock* (a solution you already have; then give its strength and unit).
2. **Scale.** Type the final volume and the strength (1 for ready to use).
3. **Amounts.** Follow the numbered steps, or read the table.
4. **Card.** Download the recipe card as an image, PDF or Word file to print and stick on the bench, or the CSV. The CSV opens again here with *Open a recipe CSV*, so you can keep your recipes as files.

## Worked example

The page opens with a made-up wash buffer, 500 mL at 1×: 20 mM Tris base (typed as the formula C4H11NO3, 121.1 g/mol), 150 mM sodium chloride from a 5 M stock, 2 mM magnesium chloride hexahydrate (MgCl2·6H2O, 203.3 g/mol), 1 mM EDTA from a 0.5 M stock, 10 % v/v neat glycerol and 0.05 % v/v Tween 20 from a 10 % stock.

- Tris: 0.020 mol/L × 0.5 L × 121.1 g/mol = **1.211 g** (10 mmol).
- Magnesium chloride: 0.002 × 0.5 × 203.3 = **203.3 mg**.
- Sodium chloride: 0.15 M × 500 mL ÷ 5 M = **15 mL** of stock (1 in 33.33). EDTA: **1 mL**. Tween 20: **2.5 mL**. Glycerol: **50 mL**.

The liquids add up to 68.5 mL, so you dissolve the solids in about 345.2 mL of water, add the liquids and make up to 500 mL. Set the strength to 5 and the same 500 mL becomes a 5× stock: 6.057 g Tris, 75 mL salt stock and 250 mL glycerol (342.5 mL of liquids), used as 100 mL + 400 mL water. At 20× the glycerol would have to be 200 % v/v, and the page says so.

The *Bacterial broth* example, 1 L, gives 10 g tryptone, 5 g yeast extract, 10 g sodium chloride, 10 mL of a 20 % glucose stock and 1 mL of a 100 mg/mL ampicillin stock (1 in 1000).

## Tips

- Use the molar mass of the form on your bottle: a hydrate weighs more per mole than the dry salt.
- Add heat-sensitive things such as antibiotics after the medium has been autoclaved and cooled.
- Very concentrated stocks may not dissolve or may change pH; a 10× buffer is usual, 50× is often too much.
- Set the pH before the final make-up to volume.

## FAQ

**Why is the water only "about"?** Solids take up some room once dissolved, so dissolve in less water and make up to the mark at the end.

**Is anything saved?** No. Your recipe stays on the page until you close it; download the CSV to keep it.

**Can it make a 1X solution from a 10X stock?** Yes: give the target as 1 X and the stock as 10 X.
