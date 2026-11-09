---
name: Life cycle comparison (LCA lite)
num: 162
shelf: science
section: carbon-and-energy-accounting
title: "LCA lite: compare the carbon footprint of two products over their life cycle, with break-even uses and uncertainty"
summary: "Compare two products, such as a reusable and a single-use one, across life stages (materials, manufacturing, transport, use, end of life) with your own emission factors. See the totals for any number of uses, the break-even point, a stacked bar by stage, which input would flip the result, and how sure the answer is when the factors are uncertain."
status: live
ads: true
order: 2
icon: chart
works: offline
updated: 2026-11-09
related: [tree-carbon, landfill-gas, uncertainty-calculator]
sources:
  - "Simple attributional life cycle arithmetic: impact = amount × factor, summed over stages, with once-per-product inputs repeated each time a product is replaced. Break-even, one-at-a-time sensitivity and Monte Carlo (factors spread evenly within ± their uncertainty, seeded random numbers) written by fibub."
  - "No emission factors are built in. The example amounts and factors are made up for illustration and are not data for any real product."
  - "Checked in the tests against an independent Python version, including the same random number stream for the Monte Carlo run."
flow:
  - { icon: table, label: "Inputs" }
  - { icon: sliders, label: "Factors" }
  - { icon: chart, label: "Compare" }
  - { icon: target, label: "Break-even" }
---

## What it does

Is a reusable bottle really better than single-use ones? A **life cycle assessment (LCA)** answers questions like this by adding up the impact of everything a product needs, from raw materials to the bin. A full LCA needs big licensed databases. This tool does the core arithmetic for two products using **factors you supply**, which is enough to see which stages matter, where the break-even point is, and how sure the answer is.

For each input, impact = amount × factor. An input is counted either **once** per product made (materials, manufacturing, transport, end of life) or **every use** (washing, electricity while running). When a product wears out after a set number of uses, a new one is made and its once-only inputs count again.

## How to use it

1. **Products.** Name A and B, say how many uses each lasts before it is replaced, and choose how many uses to compare over (the job both must do, such as 365 drinks).
2. **Inputs.** One row per input: product (A or B), stage, input name, amount, factor, counted (*once* or *use*) and ± % uncertainty in the factor. Factors must all be for the same impact, for example kg CO₂e per kg, per kWh or per tonne-kilometre. A negative factor is a credit, such as avoided material from recycling.
3. **Seed.** Fixes the random draws of the uncertainty run, so you get the same result again.

**No factors are built in, and the example factors are made up.** Take factors from a database, an environmental product declaration or a study you trust.

## What you get

- The total for each product, per use and over all uses, and how much lower the better one is.
- A **stacked bar** by stage, so you can see where the impact comes from.
- The **break-even** number of uses, where the better choice switches, and a chart of totals against uses.
- **Easiest flip**: for each input, how much its impact would need to change to make the two equal. A small number means the answer is fragile.
- An **uncertainty run** of 10,000 draws: how often A is lower, and the 90 % range of the difference.

## Worked example

With the made-up inputs, the reusable bottle (lasting 500 uses) costs 2.76 kg CO₂e to make and deliver, plus 0.02 kg per wash. A single-use bottle costs 0.11 kg. Over 365 uses the reusable bottle comes to **10.0 kg CO₂e** against **41.8 kg** for 365 single-use bottles, so **the reusable bottle is 76 % lower**. The break-even point is **29 uses**. In the uncertainty run the reusable bottle is lower in 100 % of draws. Over only 30 uses it would be lower in just 59 %, too close to call.

## FAQs

**Is this a real LCA?** No. It is a screening tool for one impact category, with no allocation rules, no system expansion, and no critical review. Use it to learn and to see what matters, not for public claims.

**Where do I get factors?** From life cycle databases, environmental product declarations, government greenhouse gas factor lists or published studies. Make sure they cover the same boundary (for example, cradle to gate).

**Does it upload my data?** No. Everything runs in your browser.
