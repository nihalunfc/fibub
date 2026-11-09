---
name: Dimensional analysis checker
num: 978
shelf: science
section: general-physics-lab-helpers
title: "Dimensional analysis checker: does your equation balance in SI units?"
summary: "Type an equation and the unit of each symbol, and see whether both sides have the same SI dimensions, which added term or function argument breaks it, and what any unit is in SI base units (kg, m, s, A, K, mol, cd)."
status: live
ads: true
order: 14
icon: ruler
works: offline
updated: 2026-11-09
related: [physical-constants, sig-fig-checker, uncertainty-calculator]
sources:
  - "SI base units, derived units with special names and prefixes: BIPM, The International System of Units (SI brochure, 9th edition, 2019); dimensional homogeneity is a standard principle of physics."
  - "The dimensions of 46 units were compared with sympy.physics.units (no differences), written for the tests."
flow:
  - { icon: pencil, label: "Equation" }
  - { icon: ruler, label: "Units" }
  - { icon: check, label: "Balance" }
---

## What it does

Every correct physics equation is **dimensionally consistent**: both sides, and every term added together, have the same dimensions. You cannot add a length to a time, and the argument of exp, ln or sin must be a pure number. Checking this is the quickest way to catch an algebra slip, a missing square or a wrong formula from memory.

This checker turns each symbol's unit into powers of the seven **SI base units** (kg, m, s, A, K, mol, cd), works through your equation, and tells you whether it balances. If it does not, it points to the place: two terms that cannot be added, a dimensioned argument to a function, or two sides that differ.

## How to use it

1. Type the equation with = between the sides, for example `E = 1/2*m*v^2`. Use * for multiplication, / for division and ^ for powers. A chain like `E = F*x = m*v^2` checks all three; a formula without = just shows its dimensions.
2. List the unit of each symbol, one per line: `m = kg`, `v = m/s`, `rho = kg/m^3`, `C_d = 1` for a pure number. Units can use prefixes (km, µF, MPa), named units (N, J, W, Pa, V, Ω, T, eV, L, atm, kWh) and forms like `kg·m·s⁻²` or `J/(mol K)`.
3. Leave **common constants** ticked to use c, g, G, h, hbar, k_B, e, epsilon_0, mu_0, N_A, R and sigma without declaring them. Any unit you give a name yourself wins.
4. Read the verdict, the list of problems, and the dimensions of each side and each added term. Download the result as an image, PDF or Word file.

The last box converts any unit to SI base units: `V/m` is kg m s⁻³ A⁻¹, `Ω m` is kg m³ s⁻³ A⁻², `kWh` is a joule.

## Worked example

The page opens with **E = 1/2·m·v²** and E in J, m in kg, v in m/s. Both sides come out as **kg m² s⁻²** (the joule), so it balances. Pick the **drag force** example, written by mistake as F = ½ ρ v C_d A: the left side is kg m s⁻² (N) but the right side is kg s⁻¹, so it **does not balance**; the correct formula has v². The **pendulum** example T = 2π√(L/g) uses the built-in g and balances in seconds, and the **ideal gas law** pV = nRT balances in joules.

## Tips

- Dimensional analysis cannot see pure-number factors: E = m v² balances even though the ½ is missing.
- Angles (rad) and counts are dimensionless, so ω in rad/s works like 1/s.
- Temperatures in °C are treated as differences (the same dimension as K).

## FAQ

**Why does it say a power must be a fixed number?** x^n has a definite unit only when n is a number such as 2 or ½. A variable exponent is fine when the base is dimensionless.

**Can it convert between units?** It checks dimensions only; scale factors (such as km to m) do not change whether an equation balances.
