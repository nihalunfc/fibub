---
name: Fatigue S-N calculator
num: 847
shelf: science
section: mechanical-behaviour
title: "Fatigue S-N calculator: Basquin fit, endurance limit, Goodman, Gerber, Soderberg and Morrow, Miner's rule"
summary: "Paste or open stress-life (S-N) test results and fit Basquin's law on log-log axes, with run-outs left out. Estimate the endurance strength, correct for mean stress with Goodman, Gerber, Soderberg or Morrow on a Haigh diagram, and add up fatigue damage for a load spectrum with Miner's rule."
status: live
ads: true
order: 847
icon: chart
works: offline
updated: 2026-11-09
related: [stress-strain-analyser, reliability-analysis, plot-maker, fracture-toughness-calculator, shaft-bearing-life, bolt-torque-calculator, larson-miller-calculator, spring-designer]
sources:
  - "Basquin's law, the mean-stress lines, the load-line safety factors and Miner's rule follow the usual textbook forms (Shigley's Mechanical Engineering Design, chapter 6; Dowling, Mechanical Behavior of Materials, chapters 9 and 10), written by fibub and checked in the tests against SciPy."
  - "The example S-N data and load spectrum are made up by the page (σa = 900 N^−0.09 with random scatter); they are not data for any real material."
  - "Your data is read on the page only. It is never uploaded or stored."
flow:
  - { icon: table, label: "S-N data" }
  - { icon: curve, label: "Basquin" }
  - { icon: chart, label: "Haigh" }
  - { icon: sigma, label: "Miner" }
---

## What it does

Metal parts that see a load go up and down can crack and break far below their tensile strength. The stress-life (S-N) method predicts how many cycles a part survives. This page does the three standard steps:

1. **Basquin fit.** Paste stress amplitude and cycles to failure from fatigue tests. The page fits a straight line on log-log axes, σa = A·N^b, and also gives it in the reversals form σa = σf'(2N)^b that strain-life books use. Specimens marked as run-outs (they did not break) are plotted with an open triangle and left out of the fit.
2. **Mean stress correction.** Most test data is fully reversed (mean stress zero), but real parts often carry a steady load as well. A tensile mean stress shortens life. The page turns your amplitude and mean stress into an equivalent fully reversed amplitude σar with four classic lines, gives the life from your fit and a safety factor, and draws them on a Haigh diagram.
3. **Miner's rule.** For a spectrum of load blocks, each block uses up a fraction n/N of the life. When the fractions add up to 1, the part is expected to fail.

Get the ultimate strength from a tensile test with the [[stress-strain-analyser|stress-strain curve analyser]], and follow a crack once it starts with the [[fracture-toughness-calculator]].

## How to use it

1. Paste stress amplitude and cycles (and optionally a run-out flag: 1, yes or runout), or open a CSV or Excel file. Use one stress unit on the whole page.
2. Pick the fit. *log N on log S* treats life as the uncertain quantity, as ASTM E739 recommends for stress-controlled tests; *log S on log N* is the older habit and gives a slightly steeper line.
3. Set the endurance life Nₑ (often 10⁶ or 10⁷ cycles, the dashed line on the plot) and the tensile and yield strength.
4. In the second card type your stress amplitude and mean stress. Leave Se and σf' empty to take them from the fit, or type your own corrected values.
5. In the third card paste the load blocks and pick the mean-stress method and whether stresses below the endurance limit do damage.

## What each line means

- **Goodman**: straight line from Se to Su. The usual choice for design.
- **Gerber**: a parabola from Se to Su. Closer to test data for ductile metals, less conservative.
- **Soderberg**: straight line from Se to the yield strength Sy. Very conservative.
- **Morrow**: straight line from Se to σf', the fatigue strength coefficient.
- **Langer (yield)**: σa + σm = Sy. Above it the part yields on the first cycle.

## Worked example

The example has 14 made-up failures and 2 run-outs at 10⁷ cycles. With log N on log S the fit is **σa = 832.9 · N^−0.0837** (r² 0.9766), so σf' = 882.7 and the strength at 10⁷ cycles is **216.2**. With Su = 600 and Sy = 450, a load of σa = 150 and σm = 100 gives an equivalent amplitude of 180 (Goodman), 154.3 (Gerber), 192.9 (Soderberg) and 169.2 (Morrow), and load-line safety factors of **1.16**, 1.37, 1.09 and 1.24. All are below the endurance limit, so the life is unlimited.

For the four-block spectrum with Goodman and no damage below Se, the blocks at 300, 250 and 200 (with their mean stresses) use up 0.50, 0.32 and 0.10 of the life, the 120 block does nothing, and **D = 0.925**: the spectrum can be repeated 1.08 times.

## Tips

- Fit only one failure mode and one test condition (same R ratio, surface and environment).
- Real parts have rougher surfaces, larger sizes and stress raisers. Multiply the test-bar endurance limit by the Marin factors before using it for design.
- Aluminium and copper alloys have no true endurance limit; choose *extend the S-N line* for them in Miner's rule.

## FAQ

**Why is Gerber's safety factor not 1 ÷ (σa/Se + ...)?** Because the Gerber line is curved. The page uses Shigley's closed form for where the load line meets the parabola.

**What does a compressive mean stress do?** Goodman, Soderberg and Morrow give a lower equivalent amplitude, but the safety factor is then taken as Se ÷ σa, ignoring that benefit, as most design codes do.

**Does my data leave my computer?** No. Everything is worked out on this page.
