---
name: Equilibrium solver
num: 89
shelf: science
code: T89
section: physical-chemistry
title: "Equilibrium solver: ICE table, Kc and Kp, reaction quotient Q and Le Chatelier's principle"
summary: "Type any reaction and K: the exact ICE table, Q and which way it goes, conversion, Kp ↔ Kc and pH for acids and bases; then add or remove a species, squeeze the volume or change the temperature and watch the equilibrium shift."
status: live
ads: true
order: 6
icon: flask
works: offline
updated: 2026-11-08
related: [titration-curve, gas-law-calculator, reaction-kinetics-fitter, equation-balancer]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
  - "Examples: textbook problems with standard equilibrium constants."
flow:
  - { icon: pencil, label: "Reaction" }
  - { icon: table, label: "ICE table" }
  - { icon: target, label: "Equilibrium" }
  - { icon: sliders, label: "Disturb" }
---

## What it does

At equilibrium, a reaction still runs both ways but the amounts stop changing, and K = [products]/[reactants] (each raised to its coefficient) is fixed for a given temperature. The textbook way to find the amounts is an ICE table: Initial, Change, Equilibrium. This tool fills it in exactly, for any reaction.

- **Any reaction**: type it with coefficients and state symbols, such as `2SO2(g) + O2(g) ⇌ 2SO3(g)`. Pure solids and liquids (s, l) are left out of K automatically, so solubility products (Ksp) and acid constants (Ka) with water work too.
- **Exact answer, no approximations.** The tool finds the extent of reaction x that makes the quotient equal K. It does not use the "x is small" shortcut, and it stays exact for K as small as 10⁻³⁰ or as large as 10³⁰.
- **Q and the direction**: the reaction quotient for your starting amounts, and whether the reaction moves forward or back.
- **Conversion** of the reactant that would run out first.
- **Kp and Kc**: when only gases take part, the other constant is shown, Kp = Kc(RT)^Δn.
- **pH** when H⁺, H₃O⁺ or OH⁻ appears.
- **Le Chatelier**: add or remove any species, change the volume, or change the temperature (with ΔH°, through the van 't Hoff equation), and see the new equilibrium next to the old one.

Balance the reaction first with the [[equation-balancer]]; for acid and base equilibria along a titration, use the [[titration-curve]].

## How to use it

1. Type the reaction, or load an example.
2. Type K and say whether it is Kc (amounts in mol/L) or Kp (partial pressures in bar). Give the temperature for the Kp ↔ Kc conversion.
3. Type the starting amount of each species. Zero is fine for products.
4. Read the ICE table, the direction and the checks.
5. In the second card, disturb the equilibrium and compare the new amounts.

## Worked example

0.500 mol/L each of H₂ and I₂ at 430 °C, with Kc = 54.3 (Chang's textbook example). The ICE table gives (2x)²/(0.500 − x)² = 54.3, so x = 0.393. At equilibrium [H₂] = [I₂] = 0.107 mol/L and [HI] = 0.787 mol/L, and 78.7 % of the hydrogen has reacted. Kp equals Kc here, because there are two gas moles on each side.

Add 0.200 mol/L of H₂ to that equilibrium and it shifts right: [H₂] = 0.256, [I₂] = 0.056 and [HI] = 0.887 mol/L.

For N₂O₄ ⇌ 2NO₂ (Kc = 4.63 × 10⁻³ at 25 °C), 0.0500 mol/L of N₂O₄ gives 0.0141 mol/L of NO₂. Halving the volume pushes it back towards N₂O₄, the side with fewer gas moles.

0.10 mol/L acetic acid with Ka = 1.8 × 10⁻⁵ gives [H⁺] = 1.33 × 10⁻³ mol/L, pH 2.88.

## Questions

**Why is my answer slightly different from the book?** Books often assume x is small compared with the starting amount. This tool solves exactly, so the two differ when the reaction goes a fair way.

**Does a catalyst change anything?** No. It speeds up both directions equally, so the equilibrium amounts stay the same.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
