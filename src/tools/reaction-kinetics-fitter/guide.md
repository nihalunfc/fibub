---
name: Reaction kinetics fitter
num: 81
shelf: science
code: T81
section: physical-chemistry
title: "Reaction kinetics fitter: rate order, rate constant, half-life and Arrhenius activation energy"
summary: "Paste concentration against time to find the reaction order, the rate constant with its uncertainty and the half-life; paste k at several temperatures for the activation energy, A, ΔH‡ and ΔS‡."
status: live
ads: true
order: 5
icon: curve
works: offline
updated: 2026-11-08
related: [equation-balancer, calibration-curve, plot-maker, uncertainty-calculator, molar-mass-calculator]
flow:
  - { icon: table, label: "Paste data" }
  - { icon: curve, label: "Fit order" }
  - { icon: chart, label: "Arrhenius" }
---

## What it does

How fast a reactant disappears depends on its concentration through the **rate law**, rate = k[A]ⁿ. Integrating it gives a different curve for each order: a straight fall for zero order, an exponential decay for first order and a 1/t shape for second order. This tool fits all three to your data and tells you which one the data prefer.

- **Each law is fitted directly to [A] against time** by non-linear least squares. This is better than fitting the straight-line plots, which stretch the errors of small concentrations.
- **Support** is the Akaike weight: the chance that each law is the best of the three, given your data.
- **k with its standard error**, [A]₀ and the **half-life** come with every fit.
- **A free-order fit** lets n take any value, to check that the winning order is really a whole number.
- **The classic straight-line plots** ([A], ln [A] and 1/[A] against time) are one tap away, as in a textbook.
- **Arrhenius analysis** turns rate constants at several temperatures into the activation energy Ea, with a 95 % range, and the pre-exponential factor A. The **Eyring** equation gives ΔH‡, ΔS‡ and ΔG‡, and you can predict k at any temperature.

For enzyme rates with Km and Vmax, use the [[enzyme-kinetics-fitter]]; to turn absorbance into concentration first, the [[beer-lambert-calculator]].

## How to use it

1. Paste time and concentration as two columns, or press **Load an example**. Use the reactant that is consumed. Absorbance works if it is proportional to concentration.
2. Set the time and concentration units so k gets the right unit.
3. Read the best order and k. Check the plot: the points should scatter evenly around the solid curve, with no pattern.
4. For the activation energy, paste temperature and k pairs below, in °C or K.

## Worked example

The example is a simulated run of dinitrogen pentoxide decomposing at 45 °C, 2 N₂O₅ → 4 NO₂ + O₂, with 1 % noise. The tool finds first order with k = (6.17 ± 0.03) × 10⁻⁴ s⁻¹ and a half-life of about 1,120 s (ln 2 ÷ k). The first-order support is 100 %, and the free-order fit gives n close to 1. The ln [A] plot is a straight line, while [A] and 1/[A] curve.

The Arrhenius example uses the textbook data for methyl isonitrile isomerising to acetonitrile: k = 2.52 × 10⁻⁵ s⁻¹ at 189.7 °C up to 3.16 × 10⁻³ s⁻¹ at 251.2 °C. The slope of ln k against 1/T is −Ea/R, which gives Ea ≈ 158 kJ/mol (textbooks quote 160 kJ/mol to two figures) and A ≈ 1.8 × 10¹³ s⁻¹.

## Questions

**Why fit [A] directly and not the straight-line plots?** Taking logs or reciprocals gives the smallest, least certain concentrations the most weight. A direct fit treats every point evenly, the way the measurement errors really are. The straight-line plots are still shown because they make the order easy to see.

**How many points do I need?** At least three, but use more than five spread over two or three half-lives. Over a short time all three laws look alike.

**What about reactions with two reactants?** Use a large excess of one (pseudo-first-order conditions): its concentration barely changes, so the other behaves as first order with k′ = k[B].

**Is my data sent anywhere?** No, every fit runs in your browser.
