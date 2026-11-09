---
name: Practice problem generator
num: 825
shelf: science
section: teaching-and-outreach
title: "Practice problem generator: numeric science problems with worked steps, answer checking and a printable worksheet"
summary: "Pick topics (unit conversion, motion, free fall, energy, Ohm's law, waves, gas law, molarity, dilution, half-life, pH, density, mean and SD) and get a set of numeric problems. Check each answer with a tolerance and a significant-figure hint, open the worked steps, share the set with a code, and print a worksheet and answer key as PDF or Word."
status: live
ads: true
order: 825
icon: pencil
works: offline
updated: 2026-11-09
related: [solution-calculator, gas-law-calculator, decay-calculator, uncertainty-calculator]
sources:
  - "Every problem, its wording and its worked steps are written by fibub. The numbers are made up by a seeded random number generator."
  - "Formulas and constants are standard school science (v = u + at, pV = nRT, C1V1 = C2V2, pH = −log[H+], g = 9.81 m/s², R = 8.314 J/(mol·K)); molar masses come from the standard atomic weights."
  - "Checked against an independent Python script (numpy, decimal) on 10,400 generated problems."
flow:
  - { icon: check, label: "Topics" }
  - { icon: calculator, label: "Problems" }
  - { icon: pencil, label: "Check" }
  - { icon: download, label: "Worksheet" }
---

## What it does

This page writes numeric practice problems for school and first-year science, checks the answers you type, and shows how each one is worked out. It is meant for students who want more practice than the textbook gives, and for teachers who want a fresh worksheet and its answer key in a minute.

- **Thirteen topics** in four groups: unit conversion; motion with constant acceleration, free fall, kinetic and potential energy, Ohm's law and power, wave speed; the ideal gas law, molarity, dilution, half-life, pH of strong acids and bases, density; and the mean and standard deviation of a small data set. Most topics have two or three kinds of question.
- **Seeded sets.** A seed picks the numbers. The same seed, topics and number of problems always give the same set on any device, so a teacher can share a **set code** (such as `2026-6-units.kinematics.ohm.molarity.ph.stats`) or a link, and everyone sees the same questions.
- **Answer checking.** Type an answer such as `0.0250`, `2.5e-3` or `2.5 × 10^-3` (a unit after the number is fine). It is marked right if it is within the tolerance you choose (1 % by default) of the exact answer or of the correctly rounded one. If the value is right but the number of significant figures is not, you get an amber "right value" note with the properly rounded answer. If your answer is 1000 times too big or small, the page says so, as that is usually a unit slip.
- **Worked steps** under every problem: the formula, the numbers put in, the unrounded result and the rounding rule.
- **Worksheet and answer key** as PDF or Word, with optional name and date lines and optional worked steps in the key. Both show the set code.

## How the rounding works

The given values are rounded to a stated number of significant figures, and the answer is worked out from those rounded values. Then the usual school rules apply: when multiplying or dividing, keep as many significant figures as the least precise value; when adding or subtracting, keep as many decimal places as the least precise value; for pH, give as many decimal places as the concentration has significant figures (and the other way round for [H⁺] from pH). Exact numbers, such as 3.6 for km/h to m/s, the ½ in ½at² and 273.15, do not limit the answer. A mean and standard deviation are given to one more decimal place than the data. Halves round up (8.075 becomes 8.08). Whole numbers whose trailing zeros would be unclear are written in scientific notation, so 1110 J to three figures is shown as 1.11 × 10³ J (typing 1110 is still accepted as right).

pH answers are accepted within ±0.02, kelvin within ±0.2 K and means within ±0.01 s, because a percentage tolerance makes no sense for them.

## How to use it

1. **Topics.** Tick the topics you want. The problems are shared evenly between them and shuffled.
2. **Set.** Choose how many problems (up to 40). Press **New set** for new numbers, or type a seed. To open a set someone sent you, paste its code into **Open a set code**.
3. **Check.** Type each answer and press **Check** (or Enter). Open **Show the steps** when you are stuck. **Show all answers** opens every solution at once.
4. **Worksheet.** Set a title and download the worksheet and the answer key.

## Worked example

With set code `2026-6-units.kinematics.ohm.molarity.ph.stats`, problem 1 reads: "A car moving at 32.7 m/s brakes with a steady deceleration of 7.53 m/s². How far does it travel before it stops?" The steps show s = u² ÷ (2 × deceleration) = 1069.29 ÷ 15.06 = 71.002 m, rounded to three significant figures: **71.0 m**. Typing 71 gives "Right value. To the precision of the data, write it with 3 significant figures: 71.0 m." Problem 5 asks for the pH of 0.0384 mol/L hydrochloric acid: −log₁₀(0.0384) = 1.41567, so **1.416** (three decimal places, because the concentration has three significant figures). Problem 6 asks for the sample standard deviation of 14.2, 14.0, 15.3, 16.6, 14.3 and 14.6 s: **0.98 s** (dividing by n instead would give 0.89 s, which is marked wrong).

## Tips

- Students: work on paper first, then check. If you are marked wrong by a factor of 1000, look at mL and L, kPa and Pa, or kΩ and Ω.
- Teachers: send the set code or link rather than a file; the answer key you print matches what students see.
- Constants used: g = 9.81 m/s², R = 8.314 J/(mol·K), c = 3.00 × 10⁸ m/s, speed of sound 343 m/s, 1 atm = 101.325 kPa, 1 kcal = 4.184 kJ, 1 inch = 2.54 cm, pH + pOH = 14.00 at 25 °C. Each question names the constant it needs.

## FAQ

**Is anything saved or sent?** No. The problems are made in your browser from the seed, and your answers are never stored or sent. Leaving the page forgets them.

**Why was my right answer marked amber?** The value was right, but it had more or fewer significant figures (or decimal places) than the data support. Being right to the stated precision is part of the skill, so the page tells you the rounded form.

**Why does the PDF show 10^-3 instead of a raised −3?** The fonts built into every PDF reader do not have those characters. The Word download keeps them.

**Can I add my own question types?** Not yet. The topics are kept small so that every formula and rounding rule is tested.
