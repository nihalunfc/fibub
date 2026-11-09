---
name: Supply and demand
num: 738
shelf: science
section: economics
title: "Supply and demand calculator: equilibrium, elasticity, consumer and producer surplus, tax incidence, price ceilings and floors"
summary: "Enter a demand and a supply curve (straight lines or constant elasticity) and see the market price and quantity, price elasticities, consumer and producer surplus, and what a per-unit tax, subsidy, price ceiling or price floor does: who pays, the shortage or surplus and the deadweight loss, with a chart."
status: live
ads: true
order: 738
icon: chart
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, plot-maker, trend-analyser, inflation-calculator, nash-equilibrium-solver]
sources:
  - "Standard microeconomics formulas (Marshallian surplus, point and midpoint elasticity, tax incidence); no tables copied."
  - "Written by fibub. Checked in the tests against an independent SciPy calculation (brentq for prices, numerical integration of the inverse curves for surplus and deadweight loss) and the textbook closed forms."
  - "The example market is made up."
flow:
  - { icon: curve, label: "Curves" }
  - { icon: target, label: "Equilibrium" }
  - { icon: percent, label: "Tax or cap" }
  - { icon: chart, label: "Surplus" }
---

## What it does

This calculator works through the supply and demand questions from a first economics course, and the ones policy analysts ask for real. You describe how much buyers want at each price (demand) and how much sellers offer (supply). The tool finds where they meet, the **equilibrium price and quantity**, and then shows:

- the **price elasticity** of demand and of supply at that point, and whether each is elastic or inelastic;
- **consumer surplus** (what buyers would have paid above the price) and **producer surplus** (what sellers get above the least they would accept);
- what a **per-unit tax**, **subsidy**, **price ceiling** or **price floor** does to prices, quantity, each side's surplus, the government budget and the **deadweight loss**;
- the **arc (midpoint) elasticity** between any two observed price and quantity points.

Everything is worked out in your browser. Nothing is sent anywhere.

## How to use it

1. Choose the curve shape. **Straight lines** use demand Q = a − b·P and supply Q = c + d·P: enter the quantity at a price of 0 and how much the quantity changes for each 1 rise in price. A negative supply quantity at price 0 simply means sellers start offering only above some price. **Constant elasticity** uses Q = A·P^e: enter the quantity at a price of 1 and the elasticity, handy when you have elasticities from a study.
2. Pick a policy and its amount: tax or subsidy per unit, or the legal maximum or minimum price.
3. Read the result, the chart (price up the side, quantity along the bottom) and the before-and-after table. The dashed outline on the chart is the deadweight loss.
4. Download the table as CSV, or the whole report as an image, PDF or Word file.

## Worked example (made-up market)

Demand is Q = 100 − 2P and supply is Q = −20 + 4P. They meet at a price of **$20** and a quantity of **60**. Demand elasticity there is −0.667 (inelastic) and supply elasticity 1.33 (elastic). Consumer surplus is $900 and producer surplus $450, a total of $1,350.

Add a **tax of $6 per unit**. Buyers now pay **$24**, sellers keep **$18**, and 52 units are sold. Buyers carry 66.7 % of the tax because demand is less elastic than supply. Consumer surplus falls to $676 and producer surplus to $338; the government collects $312. The total, $1,326, is **$24** less than before: that is the deadweight loss, the trades worth making that no longer happen.

A **price ceiling of $16** instead leaves sellers offering 44 while buyers want 68: a shortage of 24 and a deadweight loss of $96.

## Tips

- Elasticities matter more than the exact curves for who pays a tax: the side that can less easily walk away pays more.
- With constant-elasticity demand between −1 and 0, consumer surplus is unbounded (the curve never reaches zero), but changes in surplus and the deadweight loss are still finite and shown.
- The ceiling result assumes the goods go to the buyers who value them most. Queues, rationing by luck and black markets make the real loss larger.

## FAQ

**Which side of the market pays the tax legally?** It does not matter for the result. A tax on sellers and the same tax on buyers give the same prices and quantity.

**Why is the arc elasticity different from the simple percentage change?** The simple version depends on which point you start from. The midpoint formula divides by the average price and quantity, so it is the same in both directions.

**Can I use real data?** Yes. Fit or estimate the curves elsewhere, then enter the numbers here. The example is made up.
