---
name: Polymer molar mass
num: 100
shelf: science
section: polymer-chemistry
title: "Polymer molar mass"
summary: "Number- and weight-average molar mass, Mz, Mp, dispersity (PDI) and degree of polymerisation from a GPC/SEC trace with a calibration fitted to your standards, or from a list of chain masses. Paste the data or open a CSV or Excel file; see the distribution and the integration baseline."
status: live
ads: true
order: 1
icon: chart
works: offline
updated: 2026-11-08
related: [molar-mass-calculator, calibration-curve, chromatography-calculator, plot-maker]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
  - "Example: a simulated polymer and calibration standards made by fibub."
flow:
  - { icon: table, label: "Trace" }
  - { icon: ruler, label: "Calibration" }
  - { icon: sigma, label: "Mn, Mw" }
  - { icon: chart, label: "Distribution" }
---

## What it does

A polymer sample is a mixture of chains of many lengths, so it has no single molar mass. Instead it is described by averages:

- **Mn**, the number average: total mass divided by the number of chains. It controls properties that count molecules, such as osmotic pressure and end-group content.
- **Mw**, the weight average: each chain counted by its mass. It is always at least Mn and follows properties such as melt viscosity and toughness.
- **Mz**, weighted further towards the longest chains, and **Mp**, the molar mass at the peak.
- **Dispersity Đ = Mw/Mn** (often called PDI): 1 for identical chains, about 2 for typical step-growth and free-radical polymers, and 1.05 to 1.3 for living or controlled polymerisations.
- **Degree of polymerisation** DPn = Mn divided by the repeat unit mass, if you give its formula.

Two ways to enter data:

- **GPC / SEC trace.** Paste or open the chromatogram (retention time or volume against detector signal) and your calibration standards (retention against peak molar mass). The tool fits log M against retention with a straight line, quadratic or cubic, subtracts a straight baseline between the ends of your integration window, and uses the slice method: each slice's signal is taken as its mass, and its molar mass comes from the calibration. You see the molar mass distribution and the trace with the window and baseline drawn in.
- **List of chains.** Molar masses with the number of chains (or moles) or the mass of each, for textbook problems or blends.

For the formula mass of a repeat unit, use the [[molar-mass-calculator]]; to build the GPC calibration, the [[calibration-curve|calibration curve]] tool.

## How to use it

1. For a GPC run, paste the trace or open it as CSV, TSV or Excel (two columns). Do the same for the standards.
2. Pick the calibration fit. Cubic is usual for a set of 8 to 12 standards; the tool warns if the curve turns back up inside the window.
3. Set the window to start and end on flat baseline either side of the polymer peak, before the solvent and flow-marker peaks.
4. Type the repeat unit formula, such as C8H8 for polystyrene or C5H8O2 for PMMA, to get DPn.

## Worked example

The example data is a simulated polystyrene with Mw = 100,000 g/mol and Đ = 2, run on a column calibrated with thirteen standards from 500 to 5,000,000 g/mol, with a slowly drifting baseline. The tool gives **Mn 50,007 and Mw 99,925 g/mol, Đ 2.00**, and DPn of about 480. The small shortfall in Mw comes from the tail cut off by the window, just as in a real run.

For a list, an equal number of chains of 10,000 and 20,000 g/mol gives Mn = 15,000, Mw = 16,667 and Đ = 1.11. The same two masses in equal mass give Mn = 13,333 and Mw = 15,000.

## Questions

**Are my values absolute?** Only if the standards are the same polymer as the sample. Polystyrene standards give polystyrene-equivalent values for other polymers; universal calibration or light scattering is needed for absolute values.

**Which detector does this assume?** A concentration detector whose signal is proportional to mass, such as refractive index. With UV detection that is only true if every chain absorbs equally per unit mass.

**What size of file can I open?** The limits are shown under the button: up to 10 MB and 50,000 rows, two columns.

**Is anything sent anywhere?** No. Your data stays in your browser, and the page works offline once loaded.
