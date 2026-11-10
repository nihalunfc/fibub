---
name: Mineral formula calculator
num: 872
shelf: science
code: T608
section: mineralogy-and-petrology
title: "Mineral formula calculator: cations per formula unit from oxide wt%, Fe³⁺ by charge balance and end-members"
summary: "Paste or open electron-microprobe oxide analyses, one or hundreds. Get cations per formula unit on any oxygen basis, Fe³⁺ estimated by charge balance (Droop 1987), recalculated FeO and Fe2O3, Mg#, and end-members: Fo for olivine, Wo-En-Fs for pyroxene, An-Ab-Or for feldspar, Alm-Prp-Sps-Grs for garnet and Cr# for spinel."
status: live
ads: true
order: 872
icon: flask
works: offline
updated: 2026-11-09
related: [ternary-plot-maker, molar-mass-calculator, stereonet, cipw-norm, mineral-id-key, point-counter, xrd-peak-calculator]
sources:
  - "Oxygen-basis normalisation is the standard mineral formula recalculation; Fe³⁺ by charge balance follows Droop (1987), Mineralogical Magazine 51, 431 (F = 2X(1 − T/S)); pyroxene Wo-En-Fs with Fe²⁺ + Fe³⁺ + Mn as Fs follows Morimoto (1988). Oxide molar masses from standard atomic weights. fibub's code is its own, checked in the tests against pyrolite and an independent NumPy script."
  - "The example analyses are made up and rounded. Nothing you paste or open is sent or stored."
flow:
  - { icon: table, label: "Oxide wt%" }
  - { icon: sliders, label: "Basis" }
  - { icon: calculator, label: "Cations" }
  - { icon: chart, label: "End-members" }
---

## What it does

An electron microprobe reports a mineral as oxide weight percentages, but a mineralogist thinks in formulae: how many silicon, aluminium, magnesium and iron atoms sit in one formula unit. This page converts one analysis or a whole batch:

- **Cations per formula unit** on the oxygen basis you choose: each oxide's moles, times its oxygens, are scaled so the oxygens add up to the basis (6 for pyroxene, 12 for garnet and so on).
- **Fe³⁺ from charge balance** (Droop 1987). The probe measures total iron only. If a formula with all iron as Fe²⁺ has more cations than the ideal number T, some iron must be Fe³⁺: F = 2X(1 − T/S), where X is the oxygens and S the cation total. The formula is rescaled to T cations and F of the iron becomes Fe³⁺. The page also gives the FeO and Fe2O3 wt% that this split implies.
- **End-members and ratios**: Fo-Fa-Tep for olivine, Wo-En-Fs for pyroxene (Fs from Fe²⁺ + Fe³⁺ + Mn), An-Ab-Or for feldspar, Alm-Prp-Sps-Grs for garnet with the andradite and uvarovite shares of the Y-site, Cr# for spinel, and Mg# for all.
- **Checks**: cation and oxygen sums, the total charge, oxide totals outside 98 to 102 %, and analyses where charge balance asks for more Fe³⁺ than there is iron.
- A **ternary plot** for pyroxene and feldspar, a CSV of every number, and a report as an image, PDF or Word file.

Check the mineral by its properties with the [[mineral-id-key|mineral identification key]], and turn a whole-rock analysis into minerals with the [[cipw-norm|CIPW norm calculator]].

## How to use it

1. Pick the mineral: this fills in the oxygens, the ideal cation total and the iron option. Change them for any other mineral.
2. Paste your analyses with oxide names on top (SiO2, TiO2, Al2O3, Cr2O3, FeO, MnO, MgO, CaO, Na2O, K2O and others), one row per analysis and the sample name in the first column, or open a CSV or Excel file. Oxides down the first column with one analysis per column also works.
3. Read the table and download the results.

## Worked example

The pyroxene example has three made-up analyses. For Cpx-1 (SiO2 51.5, TiO2 0.6, Al2O3 3.2, Cr2O3 0.5, FeO 6.0, MnO 0.15, MgO 16.0, CaO 21.0, Na2O 0.5 wt%) on 6 oxygens with all iron as Fe²⁺, the cations add up to 4.018, a little more than 4. Charge balance gives **Fe³⁺ 0.055** and Fe²⁺ 0.130 per formula unit (Fe³⁺/ΣFe 0.296), with Si 1.897 and 4.000 cations. That split means 4.23 wt% FeO and 1.97 wt% Fe2O3. The end-members are **Wo 43.7, En 46.3, Fs 10.0**: a diopside-rich augite. Opx-1 plots near the En corner, as an orthopyroxene should.

## Tips

- Charge balance only works for minerals with no vacant sites and a fixed cation total. For amphiboles and micas, which have vacancies and hydrogen, use "all iron as Fe²⁺" or a dedicated scheme.
- Small errors in SiO2 move Fe³⁺ a lot. Treat Fe³⁺ estimates below about 0.02 per formula unit as zero within error.
- Totals well below 100 % in anhydrous minerals mean an unanalysed element, poor polish or a beam on a crack.

## FAQ

**Why do my cations not add up exactly to the ideal number?** Without charge balance the page fixes the oxygens, not the cations, so the sum shows how good the analysis is.

**Can I mix minerals in one paste?** The basis applies to every row, so paste one mineral group at a time.

**Is my data uploaded?** No. Everything runs in your browser.
