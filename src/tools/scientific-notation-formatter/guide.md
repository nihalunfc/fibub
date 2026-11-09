---
name: Scientific notation formatter
num: 810
shelf: science
section: figures-and-data-presentation
title: "Scientific notation and value ± uncertainty formatter: significant figures, SI prefixes, LaTeX and siunitx"
summary: "Turn numbers into scientific, engineering or SI-prefix notation with the significant figures you want, and round a value with its uncertainty the standard way (1 or 2 figures on the uncertainty). Copy as Unicode, plain text, LaTeX or siunitx, for one number or a whole column."
status: live
ads: false
order: 810
icon: sigma
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, table-converter, equation-converter, plot-maker, sig-fig-checker, unit-converter, figure-checker, physical-constants]
sources:
  - "Rounding and formatting are written by fibub, rounding digit by digit with halves away from zero. The uncertainty rule follows the Particle Data Group's published rounding rule (Review of Particle Physics, introduction); SI prefixes follow the SI Brochure (BIPM, 9th edition, with the 2022 prefixes)."
  - "Checked in the tests against the Python packages uncertainties 3.2.3 (BSD licence) and quantiphy 2.23 (MIT licence) on 2,000 random values, and by typesetting the siunitx output with siunitx 3.3."
  - "The example lines are the defining values of the Avogadro constant and the speed of light, standard gravity, and made-up measurements."
flow:
  - { icon: pencil, label: "Numbers" }
  - { icon: sliders, label: "Rounding" }
  - { icon: sigma, label: "Notation" }
  - { icon: copy, label: "Copy" }
---

## What it does

Papers, lab reports and slides all want numbers written the same careful way: 1.23 × 10⁻⁴ rather than 0.000123456, and a result with its uncertainty rounded together, as (1.2 ± 0.4) × 10⁻⁴ m. This page does that for one number or a whole column, and gives you each result ready to paste:

- **Unicode**, for Word, PowerPoint, email and web pages: (1.2 ± 0.4) × 10⁻⁴ m.
- **Plain text**, for code and spreadsheets: (1.2 +/- 0.4)e-4 m.
- **LaTeX** maths: `$(1.2 \pm 0.4) \times 10^{-4}\,\mathrm{m}$`.
- **siunitx** (version 3): `\qty{1.2(4)e-4}{m}`, which also keeps the spacing and the multiplication sign consistent through a thesis.
- **Concise** form, as used for constants: 1.2(4) × 10⁻⁴ m, where the digits in brackets are the uncertainty in the last digits shown.

Round to the right number of figures with the [[sig-fig-checker]], and find the error to quote with the [[uncertainty-calculator]].

## How to use it

1. **Numbers.** Type or paste one number per line, or open a CSV or Excel file with one or two columns. An uncertainty can be written as `0.0123 ± 0.0004`, `12.3 +/- 0.4`, `1.234(12)`, `(6.674 ± 0.015) × 10^-11`, or as a second column. A unit after the numbers is kept.
2. **Rounding.** Numbers without an uncertainty are rounded to the *significant figures* you choose (0 keeps the figures as typed). With an uncertainty, the uncertainty is rounded first and the value to the same decimal place.
3. **Notation.** Scientific puts one digit before the point. Engineering uses powers of ten that are multiples of three. *SI prefix* turns those powers into prefixes such as k, M, m, µ and n; type the unit (if it already has a prefix, such as µm or kHz, it is converted first). Plain decimal writes the number out.
4. **Copy.** Copy any form for the first line, or a whole column for all lines, or download a CSV with every form.

## How many figures on the uncertainty?

An uncertainty is itself only known roughly, so it is quoted to one or two significant figures, and the value to match. The **PDG rule** (the default) looks at the uncertainty's first three digits: 100 to 354 keep two figures, 355 to 949 keep one, and 950 to 999 round up to 1000 and keep two. So 0.0119 becomes 0.012, 0.0827 becomes 0.08 and 0.0980 becomes 0.10. You can also choose two figures when the uncertainty starts with 1 or 2 and one otherwise (a common textbook rule), or always one or always two.

## Worked example

Press *Use the example*. The first line, 0.000123456 ± 0.0000356 m, has an uncertainty starting 356, so it keeps one figure, 0.00004, and the value is rounded to the same place: **(1.2 ± 0.4) × 10⁻⁴ m**. With *SI prefix* the same line reads (120 ± 40) µm and `\qty{120(40)}{\micro m}`. The third line, 9.80665 ± 0.0951, starts 951, so the uncertainty rounds up to 0.10 and the result is 9.81 ± 0.10. The Avogadro constant, 6.02214076e23 to three figures, is 6.02 × 10²³.

## FAQ

**Why is 1.005 rounded to 1.01, when my spreadsheet says 1.00?** The page rounds the number as you typed it, digit by digit, so a final 5 always rounds up (away from zero). Programs that store numbers in binary see 1.005 as 1.00499999… and round down.

**Why were zeros added to my value?** If the value has fewer decimals than the rounded uncertainty (1 ± 0.1), the page writes 1.00 ± 0.10 so both end at the same place, and says so.

**Does siunitx need a setting?** No. By default siunitx prints 1.2(4) × 10⁻⁴; add `\sisetup{uncertainty-mode = separate}` to print 1.2 ± 0.4 instead.

**Is anything sent anywhere?** No. Everything runs on this page and works offline.
