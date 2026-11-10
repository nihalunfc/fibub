---
name: Mixing model calculator
num: 123
shelf: science
code: T123
section: geochemistry-and-geochronology
title: "End-member mixing model calculator: source fractions from tracers and isotopes (2 or 3 sources)"
summary: "Unmix water, sediment or rock samples into two or three sources (end-members) from several tracers at once, including δ isotope values weighted by concentration. Least-squares fractions that stay between 0 and 100 %, a misfit check and a tracer plot with curved mixing lines."
status: live
ads: true
order: 3
icon: flask
works: offline
updated: 2026-11-08
related: [isotope-delta-converter, radiometric-age-calculator, solution-calculator, uncertainty-calculator]
sources:
  - "End-member mixing analysis and isotope mass balance: standard hydrology and geochemistry methods, written from the mass-balance equations."
  - "Example data are made up by fibub for illustration."
flow:
  - { icon: table, label: "Sources" }
  - { icon: flask, label: "Samples" }
  - { icon: calculator, label: "Unmix" }
  - { icon: percent, label: "Fractions" }
---

## What it does

A stream after rain is a blend of rainwater, water from the soil and groundwater. A sediment is a blend of material eroded from different rocks. If each source has its own **fingerprint**, such as chloride, sulfate or an isotope ratio, you can work backwards from a sample to how much of each source it holds. That is an **end-member mixing model**.

For simple tracers the mass balance is linear: the sample's value is the fraction-weighted average of the sources. Isotope δ values are different. They mix in proportion to how much of the element each source carries, so a source rich in carbon pulls δ¹³C towards itself and the mixing line curves. This tool handles both kinds together.

Convert isotope ratios into δ values first with the [[isotope-delta-converter]]; to plot three end members, use the [[ternary-plot-maker]].

## How to use it

1. Paste or open the **sources**: a header row of tracer names, then one row per source with its name and values. Use two or three sources.
2. Paste or open the **samples** with the same tracer columns. Thousands of rows are fine.
3. If you have δ columns (named like d18O, δ13C or delta2H), choose which concentration column they should be **weighted by**, or none. For δ¹⁸O and δ²H of the water itself, use none. For the δ¹³C of dissolved carbon, weight it by the carbon concentration.
4. Pick two tracers for the plot.

## What you get

- A table of **fractions** for each sample, as percentages that add up to 100.
- A **misfit** for each sample: the root mean square of the tracer errors, each divided by that tracer's spread between the sources. With more tracers than strictly needed (for three sources you need two), the misfit tells you whether the sources really explain the sample.
- A note when a sample sits **outside** the sources' triangle (or beyond the ends of a two-source line). The tool then gives the closest possible mix and shows the unbounded fractions, which go below zero. That usually means a missing source or a tracer that reacts rather than simply mixing.
- A plot of two tracers with the sources and the mixing lines between them, curved where δ weighting applies.

## Worked example

All numbers are made up. The three sources are rain (Cl 1, SO₄ 2, δ¹⁸O −12 ‰), soil water (15, 40, −8 ‰) and groundwater (60, 10, −5 ‰).

Stream 1 has Cl 35, SO₄ 17 and δ¹⁸O −7.25 ‰. The tool gives **20.1 % rain, 28.8 % soil water and 51.1 % groundwater**, with a misfit of 0.003. Three tracers for three sources leave one check, and this sample passes it easily.

Change Stream 1's δ¹⁸O to −13 ‰, lighter than any source. The tool marks the sample as outside and gives the nearest mix it can.

## Good to know

- Tracers must be **conservative**: they mix without being added or removed by reactions. Chloride and water isotopes usually are; nitrate and sulfate often are not.
- Sources vary in real life. If their values are uncertain, try the edges of their ranges to see how much the fractions move.
- With noisy data and nearly identical sources, fractions can swing a lot. Choose tracers that separate the sources well.

## FAQ

**Can I use four sources?** This tool stops at three, which is where a single plot can still show the result. Four sources need at least three good tracers and a more careful statistical treatment.

**Why do my fractions sum to exactly 100 %?** That is built in: the mixture contains only the sources you listed.
