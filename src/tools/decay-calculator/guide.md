---
name: Decay calculator
num: 99
shelf: science
code: T99
section: nuclear-and-radiochemistry
title: "Decay calculator"
summary: "Activity of F-18, Tc-99m, I-131, C-14, P-32 and 28 more nuclides (or any half-life) at any date and time, a printable decay table, when it falls to a given activity, carrier-free specific and molar activity, and the labelled fraction of your sample. Bq, MBq, GBq, µCi, mCi and Ci."
status: live
ads: true
order: 1
icon: clock
works: offline
updated: 2026-11-08
related: [radiocarbon-calibration, molar-mass-calculator, isotope-pattern-calculator, reaction-kinetics-fitter]
sources:
  - "Half-lives: NNDC (ENSDF, US Brookhaven National Laboratory) and DDEP recommended values."
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
flow:
  - { icon: flask, label: "Nuclide" }
  - { icon: calendar, label: "Date, time" }
  - { icon: curve, label: "Decay" }
  - { icon: table, label: "Table" }
---

## What it does

Every radioactive sample loses the same fraction of its activity in the same time. After one half-life half is left, after two a quarter, and so on:

A = A₀ × 2^(−t / T½) = A₀ × e^(−λt), with λ = ln 2 / T½.

Labs use this all day: to know what a vial of F-18 will read at injection time on a scanner, how much P-32 is left in a stock from last month, or what a check source reads this year. This tool does it from dates and times, so you never have to count the hours by hand.

- **Decay correction** from a reference activity and time to any other date and time, forwards or backwards.
- **Decay factor**, time elapsed in hours or days, and how many half-lives that is.
- **When it falls to** a given activity, as a date and time.
- **Decay table** at any step (every 15 min, every day) for up to 200 rows, ready to print or download.
- **Specific activity** of the pure isotope in Bq/g and Ci/g, and **molar activity** in GBq/µmol and Ci/mmol.
- **Your sample's molar activity and the labelled fraction**, from its activity and amount.

The list holds 33 nuclides used in research, imaging, teaching sources and natural radioactivity, with half-lives from the NNDC and DDEP evaluations. Choose "Your own half-life" for anything else.

To date organic material from its carbon-14, use [[radiocarbon-calibration]]; to date rocks, the [[radiometric-age-calculator]].

## How to use it

1. Pick the nuclide.
2. Type the activity on the label or certificate and its unit, and the reference date and time.
3. Pick the date and time you want the activity for. A time before the reference works too.
4. Optionally type an activity to find when the sample will fall to it.
5. Set the decay table step and number of rows, and download it as a PDF, Word file or image.

## Worked example: F-18

A vial holds 370 MBq (10 mCi) of F-18 at 08:00. The half-life is 109.77 minutes.

- At 10:00, 120 minutes later, that is 1.093 half-lives, so the activity is 370 × 2^(−120/109.77) = **173.4 MBq**, 46.9 % of the reference.
- It falls to 100 MBq at 3 h 27 min after the reference, at about 11:27.

For C-14 (half-life 5,700 years) the carrier-free molar activity is **62.7 mCi/mmol**, and for tritium **29.0 Ci/mmol**, the familiar upper limits for labelled compounds. A sample of a C-14 compound with 50 mCi/mmol is therefore about 80 % labelled.

## Questions

**Which half-life values are used?** The recommended values of the US National Nuclear Data Center and the Decay Data Evaluation Project, rounded as shown in the list. A year here is 365.25 days.

**Why does the specific activity use the mass number?** The exact isotopic mass differs from the mass number by less than 0.1 %, far below other uncertainties in a real sample.

**Can I use this for patient doses?** No. It is for lab work, teaching and checking numbers. Clinical activities must come from a calibrated dose calibrator and your local procedures.

**Is anything sent anywhere?** No. It all runs in your browser and works offline once the page has loaded.
