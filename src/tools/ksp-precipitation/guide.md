---
name: Ksp precipitation predictor
num: 1363
shelf: learn
code: L210
section: school-chemistry
title: "Ksp precipitation predictor: mix two solutions, compare Q with Ksp, and see the common ion effect"
seoTitle: "Ksp precipitation predictor: Q vs Ksp and common ion"
summary: "Mix a solution of silver, barium, lead, calcium or magnesium ions with one of chloride, sulfate, iodide, fluoride, hydroxide or carbonate ions. The page works out the concentrations after mixing, the ionic product Q against Ksp, whether a solid forms and how much, and the molar solubility in pure water and with a common ion."
status: live
ads: false
order: 1363
icon: flask
works: offline
updated: 2026-11-09
related: [le-chatelier, ph-scale-explorer, equilibrium-solver, mole-bridge]
sources:
  - "Standard ionic equilibrium: Ksp = [M]^a[X]^b, ionic product Q, dilution on mixing c₁V₁/(V₁ + V₂), molar solubility s = (Ksp / aᵃbᵇ)^(1/(a+b)) and the common ion effect. Ksp values are rounded typical values near 25 °C, labelled as such and editable. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against NumPy: closed forms and polynomial roots for the solubility of AgCl, CaF₂ and Ag₂CrO₄, PbI₂ in 0.1 M iodide and AgCl in 0.01 M chloride, and the amount of AgCl and PbI₂ that comes out of solution on mixing."
flow:
  - { icon: flask, label: "Pick salt" }
  - { icon: sliders, label: "Mix" }
  - { icon: target, label: "Q vs Ksp" }
  - { icon: check, label: "Solid?" }
---

## What it does

A "sparingly soluble" salt such as silver chloride dissolves only a tiny bit. In a saturated solution the solid and its ions are at equilibrium, AgCl(s) ⇌ Ag⁺ + Cl⁻, and the product of the ion concentrations is a constant, the **solubility product Ksp** = [Ag⁺][Cl⁻]. For a salt like PbI₂ the iodide counts twice: Ksp = [Pb²⁺][I⁻]².

When you mix two solutions, work out the same product with the concentrations you actually have. That is the **ionic product Q**. If **Q > Ksp** there are more ions than the water can hold, and a solid (a precipitate) comes out until Q falls to Ksp. If Q ≤ Ksp, nothing happens.

It follows ionic equilibrium in Class 11 chemistry (solubility product and the common ion effect), and the precipitation reactions of Class 10. Use the [[le-chatelier]] sandbox to see why adding a common ion pushes the equilibrium back, the [[ph-scale-explorer]] for the acid–base side of the same chapter, and the [[equilibrium-solver]] for any K you like.

## How to use it

1. **Pick a salt.** Its Ksp fills in; you can type your own book's value (for example 1.8e-10).
2. **Mix solutions.** Set the concentration (a log slider from 10⁻⁷ to 1 mol/L) and volume of each solution. The beaker shows the ions, and a pile of solid if one forms. The scale under it marks Q and Ksp: if Q is to the right of Ksp, a solid forms.
3. The facts give Q, how much solid forms (mol/L and mol), and what is left in solution.
4. **Solubility.** See the molar solubility s in pure water, then add some extra cation or anion and watch s fall.

## Worked example

Mix 10 mL of 1 × 10⁻⁴ mol/L silver nitrate with 10 mL of 1 × 10⁻⁴ mol/L sodium chloride. The volume doubles, so each ion is now **5 × 10⁻⁵ mol/L**.

Q = (5 × 10⁻⁵)² = **2.5 × 10⁻⁹**. Ksp(AgCl) ≈ 1.8 × 10⁻¹⁰, so Q > Ksp and a white solid forms. Solving (5 × 10⁻⁵ − x)² = 1.8 × 10⁻¹⁰ gives **x = 3.66 × 10⁻⁵ mol/L** of AgCl coming out.

In pure water, s(AgCl) = √(1.8 × 10⁻¹⁰) = **1.34 × 10⁻⁵ mol/L**. For PbI₂, Ksp = s(2s)² = 4s³; in water s ≈ 1.21 × 10⁻³ mol/L, but in 0.1 mol/L potassium iodide s ≈ 7.1 × 10⁻⁹ ÷ 0.01 = **7.1 × 10⁻⁷ mol/L**.

## Check yourself

Three questions with fresh numbers: does a solid form on mixing, the molar solubility from Ksp, and the solubility with a common ion. Type small numbers like 4e-5. Nothing is saved.

## FAQ

**Why does mixing matter?** Each solution dilutes the other, so the concentrations in the beaker are smaller than in the bottles.

**Is a bigger Ksp always more soluble?** Only for salts of the same type (AB with AB). Compare AB₂ salts by working out s.

**Is this from my textbook?** It covers the standard school topic with its own examples and pictures. It is an independent study aid, not part of NCERT.
