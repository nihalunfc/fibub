---
name: Racemisation age
num: 412
shelf: science
section: dating-methods
title: "Racemisation age"
summary: "Turn a D/L (or A/I) ratio into an age with reversible first-order kinetics. Type the rate constant or calibrate it from a sample of known age, adjust it to your sample's temperature with the Arrhenius equation, and get the uncertainty by propagation and Monte Carlo. Nothing is uploaded."
status: live
ads: true
order: 412
icon: clock
works: offline
updated: 2026-11-09
related: [radiocarbon-calibration, reaction-kinetics-fitter, uncertainty-calculator, radiometric-age-calculator, luminescence-age-calculator, age-depth-model]
sources:
  - "Reversible first-order racemisation kinetics, ln[(1 + D/L)/(1 − K′·D/L)] = (1 + K′)kt + constant, as set out by Bada and others (e.g. Bada, J. L. and Protsch, R., 1973, PNAS 70) and in standard geochronology texts; Arrhenius equation; GUM (JCGM 100:2008) and GUM Supplement 1 (JCGM 101:2008) for the uncertainty."
  - "Checked against scipy: the reversible reaction L ⇌ D integrated with scipy.integrate.solve_ivp and the age found with scipy.optimize.brentq (the calibrated rate constant found the same way), with scipy.constants.R. Ages agree to 1 part in 10⁹; the GUM uncertainty agrees with finite differences on that model; the Monte Carlo median and 68 % and 95 % ranges agree with a separate numpy run within 1 %."
  - "All example values (ratios, ages, temperatures, activation energy and rate constant) are made up."
flow:
  - { icon: flask, label: "D/L ratio" }
  - { icon: calculator, label: "Rate k" }
  - { icon: sliders, label: "Temperature" }
  - { icon: clock, label: "Age" }
---

## What it does

Living things build their proteins from L-amino acids. After death the amino acids slowly turn into their mirror images (D forms) until the two reach a balance. The **D/L ratio** in a shell, tooth, bone or eggshell therefore grows with age, and with a known rate it gives an age. The reaction runs both ways, so the ratio follows **reversible first-order kinetics**:

ln[(1 + D/L) / (1 − K′·D/L)] − C = (1 + K′)·k·t

Here k is the rate constant, t the time, K′ = 1 ÷ the equilibrium constant (1 for most amino acids, whose D/L levels off at 1; about 0.77 for the epimerisation of isoleucine, measured as A/I), and C is the same expression for the D/L at **time zero**: fresh material, or the small amount of racemisation that sample preparation causes.

Calibrate the rate constant against a date from the [[radiocarbon-calibration|radiocarbon calibration tool]], and compare the result with a [[luminescence-age-calculator|luminescence age]].

## How to use it

1. Pick the reaction (or type K′), then the sample's D/L with its uncertainty and the D/L at time zero.
2. Give the rate: either **calibrate** it from a sample of known age (from radiocarbon, for example) that has a D/L you measured, or type a **known k** (per year) with the temperature it is for.
3. Give the **effective temperature** of your sample and of the calibration site, and the **activation energy** Ea. The rate is moved between temperatures with k₂ = k₁ · exp[−(Ea/R)(1/T₂ − 1/T₁)]. The effective temperature is the steady temperature that would cause the same racemisation as the real, changing one; it is a little above the mean because warm spells count for more.
4. Leave **Monte Carlo** on: it draws every input many times from its normal spread and shows the real, lopsided spread of the age.

## Worked example

The made-up example calibrates the rate from a sample 8,000 ± 200 years old with D/L 0.20 ± 0.01 at 12 ± 1 °C, with a time-zero D/L of 0.02 ± 0.005. That gives k = 2.28 × 10⁻⁵ per year at 12 °C. The sample to date has D/L 0.35 ± 0.02 and lay at 10 ± 1 °C; with Ea = 120 ± 10 kJ/mol its k is 1.598 × 10⁻⁵ per year, and the age is **21,600 ± 5,850 years**. The Monte Carlo median is about 21,600 years with a 95 % range of about 12,500 to 37,600 years, longer on the old side.

The budget table shows why: the two temperatures give 44 % and 43 % of the variance, far more than the measured ratios. One degree is a lot. If both sites had the same temperature (set the sample to 12 °C), the age would be 15,100 ± 4,040 years.

## Tips

- D/L can only be dated below its equilibrium (1/K′). Close to it, small errors in D/L give huge errors in age.
- Rates differ between amino acids, materials and even species: calibrate within the same material and lab method.
- Older samples often deviate from simple first-order kinetics. Many labs use empirical fits (for example power functions) instead; this tool uses the classic model only.

## FAQ

**Which units?** Years throughout. A known k must be per year.

**Why do GUM and Monte Carlo differ?** The age depends on temperature exponentially and on D/L through a logarithm, so its spread is lopsided. The first-order figure treats it as straight; Monte Carlo does not.

**Is my data uploaded?** No. Everything runs in your browser and works offline. For study and planning: it is not a substitute for a lab's own calibration and judgement.
