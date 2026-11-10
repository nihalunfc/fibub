---
title: "How temperature, pH and inhibitors change enzyme activity"
summary: "A guide to enzyme rates: the spot test, rate = 1 ÷ time, temperature and pH curves, Vmax and Km, and competitive versus non-competitive inhibitors, with a worked example."
tools: [enzyme-activity, enzyme-kinetics-fitter, buffer-recipe-calculator]
updated: 2026-11-10
sources:
  - "Q10 temperature rule, bell-shaped pH curves, heat denaturation and the Michaelis-Menten equation with competitive and non-competitive inhibition: standard biochemistry ideas, written by fibub."
  - "All numbers in the worked example are made-up round values for teaching."
---

The enzyme activity lab lets you run a classic practical on screen: digest starch or egg white, change the conditions, and time how long it takes. It is for Class 10 and 11 biology students, teachers who want a quick demonstration, and anyone getting ready for a real practical. If you have real measurements to analyse, try the [[enzyme-kinetics-fitter]]. To prepare a solution that holds a fixed pH, use the [[buffer-recipe-calculator]].

## What it is

An enzyme is a molecule, usually a protein, that speeds up one reaction and is not used up. The substance it works on is its **substrate**. The substrate fits into a pocket on the enzyme called the **active site**.

The **rate** is how fast the substrate is used up. In the spot test you cannot see the substrate directly. You take a drop at regular times and see if it still gives the colour. The first time the test is negative is the time taken, and:

rate = 1 ÷ time

A shorter time means a faster enzyme.

Four things change the rate:

- **Temperature.** Heat speeds up molecule movement, so the rate roughly doubles for every 10 °C (a Q10 of 2). Past the enzyme's limit, it denatures: it loses its shape for good.
- **pH.** Each enzyme has a best pH. Away from it, the active site changes shape.
- **Substrate.** The rate rises, then levels off at Vmax, when every active site is busy. Km is the substrate level that gives half of Vmax.
- **Inhibitors.** A competitive inhibitor blocks the active site, so Km rises but Vmax is unchanged. A non-competitive one binds elsewhere, so Vmax falls and Km stays the same.

The Michaelis-Menten equation ties it together: v = Vmax × S ÷ (Km + S), where S is the substrate concentration.

## How to use it

1. Choose Class 10 for rate = 1 ÷ time, or Class 11 to add substrate, inhibitors, Vmax and Km.
2. Pick amylase (starch), pepsin or trypsin (egg white).
3. Move the temperature and pH sliders. In Class 11, set the substrate concentration and choose None, Competitive or Non-competitive, then the inhibitor amount.
4. Watch the spot tile. Press Record this run to add a row to your table.
5. Change only one thing at a time, and record again.
6. Read the rate graph, then download the CSV or use Check yourself.

## A worked example

These are made-up numbers, not real enzyme data. Suppose an enzyme has Vmax = 80 units a minute and Km = 2 mM, and you use S = 6 mM.

- No inhibitor: v = 80 × 6 ÷ (2 + 6) = 60 units a minute.
- Competitive inhibitor that doubles the apparent Km to 4 mM: v = 80 × 6 ÷ (4 + 6) = 48 units a minute. Vmax is still 80.
- Non-competitive inhibitor that halves Vmax to 40: v = 40 × 6 ÷ (2 + 6) = 30 units a minute. Km is still 2 mM.

Now a time-based case. Drops are taken every half minute. If the last blue-black drop is at 4.5 minutes and the first brown drop at 5, the time taken is 5 minutes, and the rate is 1 ÷ 5 = 0.2 per minute. Warm by 10 °C and, below the denaturing limit, you expect about double: 0.4 per minute, a time of 2.5 minutes.

## Where it is used

- **Medicine:** many drugs are enzyme inhibitors. Competitive inhibition is why a large dose of substrate can sometimes overcome a drug.
- **Food:** brewing, baking and cheese-making depend on holding the right temperature and pH.
- **Washing powders:** enzymes are chosen to work in cool water at an alkaline pH.
- **Diagnosis:** blood tests measure enzyme activity to check organs.
- **Biotechnology:** engineers choose enzymes that stay active at high heat.

## Common mistakes

- **Changing two things at once.** Then you cannot tell which one caused the change. Keep all but one variable fixed.
- **Thinking a fridge kills an enzyme.** A chilled enzyme keeps its shape and speeds up again as it warms. Only strong heat changes its shape for good, so test the two cases separately.
- **Mixing up Km and Vmax.** Vmax is the top rate. Km is a concentration, not a rate.
- **Reading rate as time.** A longer time means a lower rate. Use 1 ÷ time.
- **Treating the model as real data.** The numbers are for teaching. Real practicals vary with the enzyme batch and the room.

## Questions people ask

**Why does the curve fall faster than it rises?** The rise is gentle because heating only speeds collisions. The fall is steep because denaturing destroys more enzyme with each degree.

**Can adding more substrate beat a non-competitive inhibitor?** No. The inhibitor removes working enzyme, so Vmax stays lower.

**Why use a spot tile?** Each drop is a sample taken at a known time. The iodine already on the tile shows at once whether starch was still there, and the row of drops keeps a record you can read back.
