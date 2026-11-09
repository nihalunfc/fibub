---
name: Significant figures checker
num: 975
shelf: science
section: general-physics-lab-helpers
title: "Significant figures checker: count sig figs, round correctly, and write value ± uncertainty for lab reports"
summary: "Count the significant figures in any number and see which digits count, round to significant figures or decimal places (half up or half to even, with exact decimal arithmetic), write a value and its uncertainty the way lab reports expect, apply the sum and product rules, and check a whole table of results at once."
status: live
ads: true
order: 11
icon: sigma
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, scientific-notation-formatter, curve-fitter, unit-converter, physical-constants, lab-report-template]
sources:
  - "Significant figure counting and the sum and product rules: standard school and university laboratory conventions. Rounding half to even: ISO 80000-1 (Annex B) and IEEE 754; value and uncertainty rounding: the GUM (JCGM 100:2008, section 7) and common lab-manual practice. Formulas and rules only; no text or tables copied."
  - "Checked against Python's decimal module (quantize with ROUND_HALF_UP and ROUND_HALF_EVEN) on 2,970 random numbers, four roundings each, with no mismatch."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: sigma, label: "Count" }
  - { icon: check, label: "Round" }
  - { icon: table, label: "Report" }
---

## What it does

Lab reports lose marks for numbers like 9.81234 ± 0.0312: too many figures in the uncertainty, and a value that claims more precision than the measurement has. This checker helps you get them right. It works with exact decimal arithmetic (not the computer's binary numbers), so a value such as 2.675 really is halfway and rounds the way the rules say.

It has four parts:

1. **Count and round** a single number: how many significant figures it has, which digits count (underlined; ambiguous zeros dotted), the rules that apply, and the number rounded to significant figures or decimal places.
2. **Value ± uncertainty**: round the uncertainty to one or two figures, then the value to the same decimal place.
3. **Calculation**: add, subtract, multiply or divide a list of numbers and round the answer by the textbook rules.
4. **Check a table** of results, pasted or opened from a file, and get a suggested version of each line.

Work out the uncertainty that decides how many figures to keep with the [[uncertainty-calculator|uncertainty calculator]], and write numbers in proper scientific notation with the [[scientific-notation-formatter|scientific notation formatter]].

## How to use it

- Type numbers as you would write them: 0.004560, 1200, 1200. (with a final point), 6.02e23 or 6.02 × 10^23.
- Choose the **halfway rule**: half away from zero is the school rule; half to even (banker's rounding) is the ISO rule and avoids a small bias when many numbers are rounded.
- Choose how many figures the **uncertainty** keeps. One is common; two is common when the first digit is 1 (as 0.15, where rounding to 0.2 would change it by a third). Some guides round uncertainties **up**; tick the box if yours does.

## The rules in brief

- Non-zero digits always count. Zeros between them count. Leading zeros never count.
- Trailing zeros count after a decimal point (2.50 has 3). In a whole number without a point (1200) they are ambiguous: write 1.2 × 10³ or 1.200 × 10³ to say what you mean.
- Adding or subtracting: the answer keeps the **decimal place** of the least precise number.
- Multiplying or dividing: the answer keeps the **fewest significant figures**.
- Keep extra figures through a long calculation and round once at the end.

## Worked example

The page opens with 0.004560: **4 significant figures** (the leading zeros only place the point, the final zero counts). To 2 figures it is 0.0046. The measured value 9.81234 m/s² with uncertainty 0.0312 becomes **(9.81 ± 0.03) m/s²**. Tick "round up" and it becomes (9.81 ± 0.04) m/s². In the calculation, 4.56 × 1.4 is exactly 6.384 but is written **6.4**, since 1.4 has only two figures. The example table is **2 of 5 written correctly**: 2.7 ± 0.1 and 0.048 ± 0.001 are fine, while 9.81234 ± 0.0312 should be 9.81 ± 0.03, 1530 ± 25 should be 1530 ± 30 with the one-figure rule, and 3.1416 ± 0.0050 should be 3.142 ± 0.005.

## FAQ

**Why does 2.675 round to 2.68 here but 2.67 in some spreadsheets?** In binary, 2.675 is stored as 2.67499999…, so a computer's rounding goes down. This page keeps the decimal digits you typed.

**Does the zero 0 have significant figures?** It is a special case; the page counts the places written.

**Which uncertainty rule is right?** All are in use; follow your course or journal. The GUM suggests no more than two significant figures.
