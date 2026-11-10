---
title: "Physical constants: CODATA values, uncertainties and how to use them"
summary: "What the CODATA recommended values are, which constants are exact since 2019, how to read the bracket uncertainty, and worked examples weighing the Earth and checking the Rydberg constant."
tools: [physical-constants, uncertainty-calculator, dimensional-analysis, unit-converter, sig-fig-checker]
updated: 2026-11-10
sources:
  - "CODATA recommended values of the fundamental physical constants, 2018 and 2022 adjustments, published by NIST (public domain, physics.nist.gov/constants); the values used here are the tool's own copies."
  - "Earth's GM = 3.986004418 × 10¹⁴ m³ s⁻²: the standard geocentric gravitational constant (IERS Conventions 2010); it is not one of the tool's entries."
  - "The 2019 redefinition of the SI (fixed values of h, e, k, N_A and others): BIPM, The International System of Units, 9th edition (2019)."
---

The physical constants tool is a searchable, offline table of 70 fundamental constants, from the speed of light to the mass of a neutron, as recommended by CODATA (the international committee that publishes the agreed best values). Each entry shows its symbol, value, unit and uncertainty, and has a copy button that puts the number on your clipboard ready for a calculator, spreadsheet or program. It helps students doing homework, lab classes writing reports and programmers who want the right digits without hunting through tables. Once you have a value, carry its error through your sum with the [[uncertainty-calculator]], check your formula's units with [[dimensional-analysis]], and switch the answer to other units in the [[unit-converter]].

## What it is

A physical constant is a number that nature fixes, like the charge of an electron or the strength of gravity. Labs around the world measure them in many different ways. Every few years CODATA combines all those measurements in one big least-squares fit, called an **adjustment**, so the constants agree with each other as well as possible. The tool holds two editions: **2022**, the current one, and **2018**, which many textbooks and older papers still use.

Since 2019 some constants are no longer measured at all. The SI units were redefined by fixing the values of the Planck constant h, the elementary charge e, the Boltzmann constant k, the Avogadro constant N_A, the speed of light c, the caesium frequency and the luminous efficacy. These are **exact** by definition, and so is anything worked out from them alone, such as ħ = h / 2π or the gas constant R = N_A k. A value with "…" at the end is exact but has more digits than CODATA prints.

Every other constant has a **standard uncertainty**, an estimate of one standard deviation. It is written in brackets on the last digits:

6.674 30(15) × 10⁻¹¹ means 6.674 30 × 10⁻¹¹ ± 0.000 15 × 10⁻¹¹

The **relative uncertainty** is the uncertainty divided by the value. It tells you how well known a constant is, whatever its size. Constants can move between editions as new experiments arrive; in this tool 36 of the 70 changed from 2018 to 2022.

## How to use it

1. Type in the **Search** box: a name, symbol or unit, such as "rydberg", "m_p" or "MeV". Several words must all match.
2. Use **Group** to show only one of the five groups: universal, electromagnetic, atomic and nuclear, physico-chemical, or adopted values.
3. Choose **Values**: CODATA 2022 or CODATA 2018. In 2022, a tag "updated since 2018" marks constants that changed.
4. Set what the **Copy button copies**: just the number (in e-notation) or the number with its uncertainty and unit.
5. Press **Copy** beside a constant. A line under the search box confirms what was copied.
6. Download the constants on screen as CSV, or as an image, PDF or Word table.

## A worked example

**Weighing the Earth.** Satellite tracking measures Earth's GM (G times its mass M) far better than anyone can measure G alone: GM = 3.986004418 × 10¹⁴ m³ s⁻². Search "gravitation" and copy G = 6.67430e-11 m³ kg⁻¹ s⁻².

M = GM ÷ G = 3.986004418 × 10¹⁴ ÷ 6.67430 × 10⁻¹¹ = **5.97217 × 10²⁴ kg**

The tool shows G's relative uncertainty as 2.2 × 10⁻⁵. GM's is far smaller, so G sets the error on the answer: 5.97217 × 10²⁴ × 2.25 × 10⁻⁵ = **1.34 × 10²⁰ kg**. Earth's mass is known to about five significant figures, no better, because G is the least well known of all the constants.

**Checking the constants agree.** The Rydberg constant follows from others: R∞ = α² m_e c / (2h), where α is the fine-structure constant (no unit) and m_e the electron mass. With the 2022 values:

- α = 7.2973525643 × 10⁻³
- m_e = 9.1093837139 × 10⁻³¹ kg
- c = 299,792,458 m s⁻¹ and h = 6.62607015 × 10⁻³⁴ J Hz⁻¹ (both exact)

R∞ = (7.2973525643 × 10⁻³)² × 9.1093837139 × 10⁻³¹ × 299,792,458 ÷ (2 × 6.62607015 × 10⁻³⁴) = **10,973,731.568 04 m⁻¹**

The tool lists 10 973 731.568 157(12) m⁻¹. The two agree to about 1 part in 10¹¹, well inside the combined uncertainty of α and m_e (about 6 parts in 10¹⁰). The constants form one consistent set.

## Where it is used

- **School and university labs.** Comparing a measured value of e/m or Planck's constant with the CODATA value is a standard way to judge an experiment.
- **Scientific software.** Simulation and data-analysis code needs consistent digits; copying them from one edition avoids mixing 2018 and 2022 values.
- **Chemistry.** N_A, R, F and k turn up in every gas-law, electrochemistry and kinetics calculation.
- **Metrology.** Calibration labs work from the exact SI constants when they build their own standards.

## Common mistakes

- **Mixing editions.** Taking α from 2018 and m_e from 2022 can break relations that should hold to many digits. Pick one edition for a whole calculation.
- **Dropping the power of ten.** The bracket uncertainty shares the value's power of ten; 0.000 15 is × 10⁻¹¹, not on its own.
- **Using too many digits.** Your answer cannot be more precise than your own measurement; check how many figures to keep with the [[sig-fig-checker]].
- **Confusing h and ħ.** ħ is h divided by 2π. Formulas with angular frequency use ħ.
- **Calling g a constant of nature.** The standard acceleration of gravity, 9.80665 m s⁻², is an agreed value for unit conversions. Real gravity varies from place to place.

## Questions people ask

**Why does the electron mass change between editions when it is a fixed property of nature?** The electron's mass does not change; our best estimate of it does, as experiments improve. The 2022 value differs from 2018 by about four times the stated uncertainty.

**Why is μ₀ no longer exactly 4π × 10⁻⁷?** After 2019 the ampere is defined through e, so μ₀ now depends on the measured fine-structure constant. It is still extremely close to that old value.

**Can I cite this table?** Cite CODATA itself, naming the edition, for example "CODATA 2022 recommended values".
