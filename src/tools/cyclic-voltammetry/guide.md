---
name: Cyclic voltammetry analyser
num: 90
shelf: science
code: T90
section: electrochemistry-and-battery-science
title: "Cyclic voltammetry analyser: peak potentials, ΔEp, E½ and the Randles–Sevcik equation"
summary: "Paste or open a cyclic voltammogram for peak potentials and currents with a baseline, ΔEp, E½, Ep − Ep/2 and Nicholson's peak ratio; solve the Randles–Sevcik equation for D, concentration or area; and fit a scan-rate study."
status: live
ads: true
order: 1
icon: curve
works: offline
updated: 2026-11-08
related: [titration-curve, equilibrium-solver, calibration-curve, plot-maker]
flow:
  - { icon: table, label: "Data" }
  - { icon: curve, label: "Peaks" }
  - { icon: calculator, label: "Randles" }
  - { icon: chart, label: "Scan rates" }
---

## What it does

Cyclic voltammetry (CV) sweeps an electrode's potential up and back while recording the current. A redox couple gives a pair of peaks, and their positions, sizes and spacing tell you the formal potential, whether electron transfer is fast, whether the product survives, and how fast the species diffuses. This tool reads those numbers from your data.

**Peaks of a voltammogram**

- **Peak potentials and currents** for the forward and return sweeps. The forward peak current is measured from a straight baseline through the first 10 % of the sweep, which removes the charging current.
- **ΔEp**, the gap between the peaks. A fast (reversible) one-electron couple gives about 57 mV at 25 °C; larger gaps mean slower electron transfer.
- **E½**, the midpoint, which equals the formal potential E°′ for a reversible couple.
- **Ep − Ep/2**, the width of the forward peak, 56.5/n mV for a reversible couple, so it also estimates n.
- **Peak ratio** by Nicholson's method, which needs no baseline for the return peak. Close to 1 means the product is stable; below 1 means a following chemical step uses it up (an EC mechanism).

**Randles–Sevcik equation**

ip = 0.4463 nFAC √(nFvD/RT), or 2.69 × 10⁵ n^1.5 A √D C √v at 25 °C. Fill in all but one of peak current, area, concentration, diffusion coefficient and scan rate, and the tool works out the missing one.

**Scan-rate study**

Peak currents at several scan rates are fitted against √v. A straight line through the origin means diffusion control, and its slope gives D. The slope of log ip against log v is 0.5 for a diffusing species and 1 for one adsorbed on the electrode.

For the equilibrium potential behind the peaks, use the [[nernst-calculator]]; for the same electrode's impedance, the [[impedance-fitter|impedance (EIS) fitter]].

## How to use it

1. Paste potential and current in two columns, or open a CSV or Excel file (up to 10 MB). Say whether the potential is in V or mV, the current unit, and the sign convention: IUPAC (anodic positive) or the older US one (cathodic positive).
2. Give n, the number of electrons.
3. Press **Use the peak from the voltammogram** to send the peak current to the Randles–Sevcik card, then give the electrode area and concentration to get D.
4. For a scan-rate study, paste scan rates and peak currents.

## Worked example

The example is a simulated reversible one-electron couple: 1.0 mmol/L, D = 1.0 × 10⁻⁵ cm²/s, a 3 mm disc (0.0707 cm²), 100 mV/s, E°′ = 200 mV, with a small charging current and noise added. The tool finds Ep = 228 mV and 170 mV (the points are 2 mV apart), so ΔEp = 58 mV and E½ = 199 mV, a peak ratio of 1.02, and a forward peak of 18.9 µA above the baseline. Randles–Sevcik predicts 2.69 × 10⁵ × 0.0707 × √(10⁻⁵) × 10⁻⁶ × √0.1 = 19.0 µA, and working backwards from the measured peak gives D = 0.99 × 10⁻⁵ cm²/s, within 1 % of the true value.

## Questions

**Why is my ΔEp larger than 57 mV even for ferrocene?** Uncompensated solution resistance stretches the peaks apart, more at higher currents and scan rates. Use iR compensation, a smaller electrode or a lower concentration.

**Which reference electrode does E½ refer to?** Whatever you used. Report it, for example versus Ag/AgCl or versus ferrocene.

**Is my data sent anywhere?** No. Everything is worked out in your browser.
