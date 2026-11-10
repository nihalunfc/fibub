---
name: Grade-tonnage calculator
num: 130
shelf: science
code: T130
section: mining-and-economic-geology
title: "Grade-tonnage curve and cut-off grade calculator: breakeven and marginal cut-offs, tonnes, grade and contained metal"
summary: "Paste or open block model or composite data (tonnes and grade, or volume and density). Get the grade-tonnage curve, breakeven and marginal cut-off grades from metal price, recovery, royalty and costs, contained and recovered metal and the operating margin at any cut-off."
status: live
ads: true
order: 1
icon: mountain
works: offline
updated: 2026-11-08
related: [ternary-plot-maker, radiometric-age-calculator, uncertainty-calculator, plot-maker, drill-hole-composites, rock-mass-classification, npv-irr-calculator]
sources:
  - "Grade-tonnage curves and breakeven and marginal cut-off grades: standard mining engineering, written by fibub from first principles (cut-off = cost per tonne ÷ (net value per unit grade × recovery))."
  - "Troy ounce 31.1034768 g and pound 0.45359237 kg are exact unit definitions."
  - "Example blocks, prices and costs are made up by fibub for illustration."
flow:
  - { icon: table, label: "Blocks" }
  - { icon: currency, label: "Economics" }
  - { icon: calculator, label: "Cut-off" }
  - { icon: chart, label: "Curve" }
---

## What it does

A mineral deposit is not ore until it pays to dig up and process. The **cut-off grade** is the line: rock above it is worth processing, rock below it is waste. Change the cut-off and the size and grade of the deposit change together. A higher cut-off gives fewer tonnes at a better grade. A **grade-tonnage curve** shows that trade-off at a glance.

This tool takes your blocks or composites and draws the curve. It works out the cut-off from the metal price and costs, and reports the tonnes, average grade, contained metal and operating margin at any cut-off.

Make length-weighted composites first with [[drill-hole-composites]], and put error bars on the totals with the [[uncertainty-calculator]].

## How to use it

1. Paste or open your data: a name, then **tonnes and grade**, or **volume (m³), density (t/m³) and grade**. Thousands of rows from a block model export are fine.
2. Choose the grade unit: % for base metals such as copper, zinc or nickel, or g/t (the same as ppm) for gold and silver.
3. Enter the economics: metal price, selling and refining costs, royalty, recovery, and the mining, processing and overhead costs per tonne.
4. Optionally list the cut-offs you want in the table.

## The cut-offs

- **Breakeven cut-off** = (mining + processing + overheads per tonne) ÷ (net value per tonne per unit of grade × recovery). At this grade a block pays for itself.
- **Marginal cut-off** leaves out the mining cost. It is for rock that has to be moved anyway, for example to reach better ore. Sending it to the mill rather than the waste dump makes money if it beats this lower grade.
- Net value is the price after royalty, minus selling and refining costs. For grades in %, one percent means 10 kg of metal in each tonne of rock.

## Worked example

All numbers are made up. Forty copper blocks of about 25,000 t each hold 1.00 Mt at 0.432 % Cu. With copper at 9000 per tonne, 500 selling costs, a 2 % royalty and 88 % recovery, each tonne of rock is worth 83.2 per percent of copper. Mining, processing and overheads cost 13.5 per tonne, so the **breakeven cut-off is 0.184 % Cu**. Above it are **929 kt at 0.454 % Cu**, holding about 4200 t of copper. The marginal cut-off is 0.150 %.

## Good to know

- This is a screening tool. It looks at each block on its own. Real pit or stope designs add dilution and ore loss, stripping of waste, timing, discounting and capital costs.
- Publicly reported resources and reserves must follow a code such as NI 43-101, JORC or S-K 1300, and be signed by a qualified person.
- Prices, costs and recoveries change. Run several cases to see how sensitive the result is.

## FAQ

**Why do the tonnes fall so fast at first?** Many deposits have a lot of low-grade material, so even a small cut-off removes plenty of tonnes.

**Can I use a net smelter return (NSR) value instead of grade?** Yes. Put the NSR per tonne in the grade column, and set price 100, recovery 100 % and no selling costs or royalty in % mode. The cut-off then comes out in the same money per tonne.
