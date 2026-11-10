---
name: Nitrogen estimation
num: 1364
shelf: learn
code: L211
section: school-chemistry
title: "Nitrogen estimation"
summary: "Work out the percent nitrogen in an organic compound by the Dumas method (volume of N₂ gas reduced to STP, with aqueous tension) or the Kjeldahl method (ammonia caught in H₂SO₄ or HCl, by direct or back titration). Every step is shown with your numbers, beside a sketch of the apparatus and known compounds to compare."
status: live
ads: false
order: 1364
icon: calculator
works: offline
updated: 2026-11-09
related: [mole-bridge, formula-writer, carbon-chain-namer, kinetic-theory]
sources:
  - "Standard quantitative analysis: Dumas method (V₀ = P₁V₁ × 273 / (760 T₁), 28 g of N₂ in 22 400 mL at STP) and Kjeldahl method (% N = 1.4 × basicity × M × V / m, with back titration). School atomic masses (N = 14). Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against independent hand calculations in Python (Dumas dry and over water; Kjeldahl direct, back titration and with HCl; % N of urea and glycine from their formulas)."
flow:
  - { icon: flask, label: "Method" }
  - { icon: pencil, label: "Readings" }
  - { icon: calculator, label: "Steps" }
  - { icon: percent, label: "% N" }
---

## What it does

To find how much nitrogen is in an organic compound, chemists turn the nitrogen into something easy to measure.

- **Dumas method:** heat the compound with copper(II) oxide. Its nitrogen comes off as **N₂ gas**, which is collected and measured. Convert the volume to STP (273 K and 760 mm Hg), and 22 400 mL of N₂ weighs 28 g.
- **Kjeldahl method:** heat the compound with concentrated sulfuric acid so its nitrogen becomes ammonium sulfate, then drive off **ammonia** with NaOH and catch it in a known amount of acid. The acid used up tells you how much NH₃ there was. If extra acid is used, the leftover is titrated with NaOH (a **back titration**).

The page works through every step with your numbers and draws the apparatus.

It follows the quantitative analysis part of Class 11 chemistry (organic chemistry: some basic principles and techniques). The [[mole-bridge]] page practises the mass–mole–volume steps used here, the [[formula-writer]] helps with formulas, and the [[carbon-chain-namer]] names the compounds you analyse.

## How to use it

1. **Pick a method.**
2. **Dumas:** type the mass of compound, the volume of nitrogen and the temperature and pressure it was measured at. If the gas was collected over water, type the **aqueous tension** (the pressure of water vapour at that temperature) and it is taken off the pressure.
3. **Kjeldahl:** type the mass, choose the acid (H₂SO₄ catches two NH₃ per formula, HCl one), its molarity and volume. Tick **Back titration** and type the NaOH used if the acid was in excess.
4. Read the steps and the answer, and compare it with the known compounds.

## Worked example

**Dumas.** 0.30 g of compound gives 50 mL of dry N₂ at 300 K and 715 mm Hg.
V₀ = 715 × 50 × 273 ÷ (760 × 300) = **42.81 mL** at STP. Mass of N₂ = 28 × 42.81 ÷ 22 400 = 0.05351 g. % N = 0.05351 ÷ 0.30 × 100 = **17.84%**.

**Kjeldahl, direct.** The ammonia from 0.50 g of compound neutralises 10 mL of 0.5 M H₂SO₄: H⁺ = 2 × 0.5 × 10 = 10 mmol = 10 mmol NH₃ = 0.14 g N, so % N = **28%**.

**Kjeldahl, back titration.** 1.0 g of compound; ammonia passed into 50 mL of 0.5 M H₂SO₄ (50 mmol H⁺); the leftover acid needs 60 mL of 0.5 M NaOH (30 mmol). Ammonia used 20 mmol, so N = 0.28 g and % N = **28%**.

## Check yourself

Three questions with fresh numbers: a Dumas calculation, a Kjeldahl calculation and which compounds Kjeldahl cannot handle. Nothing is saved.

## FAQ

**Why multiply by 273 and divide by 760?** That is the gas law P₁V₁/T₁ = P₀V₀/T₀ rearranged to give the volume at STP.

**Why does H₂SO₄ count twice?** Each H₂SO₄ gives two H⁺, and each NH₃ takes one.

**Is this from my textbook?** It covers the standard school topic with its own examples and pictures. It is an independent study aid, not part of NCERT.
