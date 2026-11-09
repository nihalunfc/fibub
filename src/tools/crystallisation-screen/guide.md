---
name: Crystallisation screen designer
num: 187
shelf: science
section: structural-biology
title: "Crystallisation screen designer: grid screens for 24- and 96-well plates with stock volumes per well"
summary: "Design a protein crystallisation grid screen: run precipitant, pH or salt across the columns, down the rows or the same in every well, and get the microlitres of each stock and water for every well (C1V1, with buffer pH mixed from two stocks), the total of each stock to make with spare, a coloured plate map, a pipetting table, CSV and a printable report. Nothing is uploaded."
status: live
ads: true
order: 3
icon: table
works: offline
updated: 2026-11-09
related: [plate-layout, solution-calculator, buffer-recipe-calculator, protein-calculator]
sources:
  - "Grids, C1V1 volumes, rounding, totals and the two-stock pH mix are written by fibub and checked in the tests against an independent NumPy implementation (linspace and geomspace grids, and the pH mix found by bisection on the forward Henderson–Hasselbalch pH of the mixed stocks) on the example and three other screens, agreeing to better than 0.0000001 µL."
  - "The Henderson–Hasselbalch equation and C1V1 dilution are general textbook science. The pH mix assumes ideal behaviour; the page says to check real wells with a meter."
  - "The example screen (PEG 8 to 30 % against pH 6.6 to 8.0 with 0.2 M salt) and its stock strengths are made up for this tool, not copied from any commercial or published screen, and every value is editable."
flow:
  - { icon: sliders, label: "Plate" }
  - { icon: flask, label: "Factors" }
  - { icon: table, label: "Map" }
  - { icon: download, label: "Pipetting" }
---

## What it does

Finding crystallisation conditions for a protein usually starts with a broad commercial screen. Once a hit appears, you refine it with a **grid screen**: one plate where the precipitant rises across the columns and the pH (or salt) rises down the rows, so the best spot shows up as a patch on the plate. Working out the pipetting for 96 different wells by hand is slow and easy to get wrong. This page does it for you:

- **Factors.** Add up to six. A *concentration* factor (PEG, salt, MPD, an additive) comes from one stock, and the volume is the classic C1V1 = C2V2: final value ÷ stock × well volume. A *pH* factor comes from two stocks of the same buffer at the same strength, one at a low pH and one at a high pH, mixed in the ratio that gives each well its pH.
- **Runs.** Each factor runs *across the columns* (1 to 6 or 1 to 12), *down the rows* (A to D or A to H), or is the *same in every well* (a fixed additive). Two factors may run the same way if you want them to rise together.
- **Steps.** *Even steps* add the same amount each time (8, 10, 12 … %). *Even ratios (log)* multiply by the same amount each time, which suits salts and additives spread over a wide range.
- **Mixing.** *By the pKa* uses the Henderson–Hasselbalch equation: the share of the base form in the mix is the volume-weighted mean of the two stocks' shares, so the page finds the mix whose share matches the target pH. *Straight line* mixes in proportion to pH, which is close only when the two stocks sit near the pKa.
- **Water** tops every well up to the volume you chose. A well whose stocks alone add up to more than the well volume gets a red ring and a warning.
- **Totals.** The volume of each stock and water for the whole plate, plus a spare percentage for what is lost in tips and tubes.

## How to use it

1. **Plate.** Choose 24 or 96 wells and the volume per well (the reservoir). Pick how finely to round volumes, the smallest volume your pipette handles, and the spare.
2. **Factors.** Edit the example or add your own. For each one, type the range and the stock; the line under it lists every level.
3. **Map.** Check the plate map. *Colour by* switches which factor colours the wells; tap a well to see what goes in it.
4. **Pipetting.** Read the stocks to make, then pipette from the table: every well in one list, or one stock at a time laid out as a plate (handy for a multichannel pipette). Download the well list or stocks as CSV, or the map and tables as an image, PDF or Word file.

## Worked example

The example is a made-up 96-well screen with 100 µL per well: PEG 3350 from 8 to 30 % w/v across the 12 columns (step 2) from a 50 % stock, buffer pH 6.6 to 8.0 down the 8 rows (step 0.2) at 0.1 M from two 1 M stocks at pH 6.5 and 8.5 (pKa 7.5), and 0.2 M sodium chloride in every well from a 4 M stock. The page shows **96 conditions on a 96-well plate, 4 stocks**.

Well H12 (30 % PEG, pH 8.0) gets 60 µL of PEG (30 ÷ 50 × 100), 10 µL of buffer split as 1.8 µL of the pH 6.5 stock and 8.2 µL of the pH 8.5 stock, 5 µL of salt and 25.0 µL of water. By hand: at pH 8.0 the base share is 1 ÷ (1 + 10^−0.5) = 0.760; the stocks have 0.091 and 0.909, so the high-pH stock is (0.760 − 0.091) ÷ (0.909 − 0.091) = 82 % of the buffer.

For the plate you need 3.65 mL of PEG stock (4.01 mL with 10 % spare), 585.6 µL of the pH 6.5 stock, 374.4 µL of the pH 8.5 stock, 480.0 µL of salt and 4.51 mL of water. The page warns that 24 wells (rows A and B) need less than 1 µL of the pH 8.5 stock: B1 needs 0.9 µL. Switch to a 24-well plate and the volume becomes 500 µL, the smallest volume is 1.3 µL, and the warning goes away.

## Tips

- Put the factor you expect to matter most across the 12 columns, where it gets the most steps.
- For tiny volumes, dilute that stock (for example tenfold) and type the weaker strength, or make a bigger volume per well.
- Add the viscous precipitant last and mix well; PEG and MPD stick to tips, so pipette slowly.
- The drop starts at a fraction of each condition (half for 1 µL protein + 1 µL reservoir) and concentrates as water leaves it by vapour diffusion.

## FAQ

**Is the pH exactly right?** It is close for an ideal buffer. Salt, PEG and temperature shift real pKa values, so measure the pH of a few wells (or a test mix) and adjust the stocks if needed.

**Can I use a stock I made in another unit?** Yes, as long as the stock and the final values use the same unit: % with %, M with M, mM with mM.

**Is anything saved or sent?** No. The page works in your browser and keeps nothing when you close it.
