---
name: Fertiliser blend calculator
num: 381
shelf: science
section: agronomy-and-soil-science
title: "Fertiliser blend calculator: turn N, P2O5 and K2O needs into kg of each product, with cost"
summary: "Type the nitrogen, phosphate, potash (and sulphur) your field needs and the fertiliser grades you can buy, such as 46-0-0, 18-46-0 and 0-0-60. Get the amount of each product per hectare or acre, what is over or under supplied, totals and bags for the field, and the cost if you type prices."
status: live
ads: true
order: 381
icon: calculator
works: offline
updated: 2026-11-09
related: []
sources:
  - "Mass balance of nutrients from product grades (percent by weight, the usual N-P2O5-K2O label convention) and the oxide-to-element factors worked out from standard atomic weights (general chemistry facts)."
  - "Closest blend by non-negative least squares (Lawson and Hanson, Solving Least Squares Problems, 1974) and least-cost blend by linear programming, both solved exactly by visiting every basic solution."
  - "Checked against scipy.optimize.nnls and scipy.optimize.linprog on 300 random product sets and needs, and the worked examples in the tests. The example needs, products' prices and field are made up; the grades are common generic ones."
flow:
  - { icon: target, label: "Needs" }
  - { icon: table, label: "Products" }
  - { icon: calculator, label: "Blend" }
  - { icon: currency, label: "Cost" }
---

## What it does

A soil test or a nutrient plan tells you how much **nitrogen (N), phosphate (P₂O₅) and potash (K₂O)** a field needs, in kg per hectare or lb per acre. Fertilisers are sold as **grades**: three numbers on the bag giving the percent of N, P₂O₅ and K₂O by weight. Urea is 46-0-0, diammonium phosphate (DAP) is 18-46-0 and muriate of potash is 0-0-60. A fourth number, as in 21-0-0-24 for ammonium sulphate, is read as sulphur (S).

This calculator works out how much of each product to spread so the field gets what it needs. Because one product often carries two nutrients (DAP brings N as well as P₂O₅), the sums are a small system of equations, and the tool solves it for you.

Find what the field needs first with the [[soil-test-interpreter]], and set the sowing rate with the [[seeding-rate-calculator]].

## How to use it

1. Choose **kg per hectare** or **lb per acre**, and whether your needs are written as oxides (P₂O₅, K₂O, as on the bag) or as the elements P and K. Element needs are converted with P × 2.2913 = P₂O₅ and K × 1.2046 = K₂O.
2. Type the **needs**. Leave a need blank to ignore that nutrient; type 0 if you want as little of it as possible.
3. List the **products** you can buy, one per line: a name, the grade, and optionally a price per tonne (per ton of 2,000 lb in US units).
4. Give the **field area** and, if you like, the **bag size**.

## The two blends

- **Closest to the needs** finds the amounts that come nearest to every need at once (non-negative least squares: no product can be negative). If the products can meet the needs exactly, they are met exactly. If they cannot, for example with no straight nitrogen product, the table shows which nutrients are over or under.
- **Meet every need, least cost** finds the cheapest blend that gives at least each need, so a nutrient may be over. Without prices for every product it finds the lightest blend instead.

When several blends are equally close, the cheapest (or lightest) is shown.

## Worked example

Press **Use the example**: made-up needs of 150 kg N, 60 kg P₂O₅ and 90 kg K₂O per hectare on a 12 ha field, with urea, DAP, potash and ammonium sulphate at made-up prices. DAP covers the phosphate (60 ÷ 0.46 = 130.4 kg/ha) and brings 23.5 kg of N, potash covers the K₂O (90 ÷ 0.60 = 150.0 kg/ha), and urea makes up the rest of the N (126.5 ÷ 0.46 = 275.0 kg/ha). Every need is met exactly: 555.5 kg of product per hectare, costing 353.27 per hectare and 4,239.22 for the field. With 50 kg bags you buy 67 bags of urea, 32 of DAP and 36 of potash.

If you remove urea and ammonium sulphate, DAP and potash alone cannot give 150 kg N without far too much phosphate. The closest blend then leaves N under and P₂O₅ over; choose **Meet every need** to see the blend that reaches 150 kg N at the cost of extra phosphate.

## FAQ

**Where do I get the needs?** From a soil test and the advice of your agronomist, lab or extension service. This tool does the arithmetic; it does not recommend rates.

**Does it account for losses or timing?** No. Split applications, losses and nutrients from manure are up to your plan; type the amounts you want this application to supply.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
