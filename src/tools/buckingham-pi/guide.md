---
name: Buckingham Pi
num: 551
shelf: science
code: T379
section: applied-mathematics
title: "Buckingham Pi"
summary: "List your variables with their dimensions (M L T Θ I N J) and get the dimension matrix, its rank, an integer null-space basis and the dimensionless Π groups for the repeating variables you choose. Exact arithmetic, in your browser."
status: live
ads: true
order: 551
icon: ruler
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, ode-solver, plot-maker, dimensional-analysis, dimensionless-numbers, unit-converter, physical-constants]
sources:
  - "Method: Buckingham's Π theorem (1914), exact rational row reduction. Example problems are classic textbook cases (pipe flow, drag, pendulum, convection, ship resistance, Taylor's blast wave, pumps); no data are used."
flow:
  - { icon: pencil, label: "Variables" }
  - { icon: table, label: "Matrix" }
  - { icon: target, label: "Repeating" }
  - { icon: sigma, label: "Π groups" }
---

## What it does

Any physical law must work in every system of units, so it can always be written in terms of **dimensionless groups**. The Buckingham Π theorem says how many: the number of variables minus the rank of their dimension matrix. This tool does the bookkeeping exactly:

- reads each variable's dimensions in mass M, length L, time T, temperature Θ, current I, amount N and luminous intensity J;
- builds the **dimension matrix** and finds its **rank** by exact row reduction (fractions, no rounding);
- gives an **integer basis of the null space**: every dimensionless product of your variables is a combination of these;
- forms the **Π groups** with the **repeating variables** you tick, each written as a formula with whole-number powers, and the relation Π₁ = φ(Π₂, Π₃, ...).

Check that each equation balances with the [[dimensional-analysis|dimensional analysis checker]], and look up named groups such as the Reynolds number in [[dimensionless-numbers]].

## How to use it

1. Pick an example, or type your variables, one per line: name, dimensions, and a note. For example `V, L T^-1, speed`. Powers can be written L^-1, L⁻¹ or with a slash, L/T^2. Write 1 for a pure number such as an angle.
2. Put the quantity you want to predict first. It is then kept out of the repeating variables, so it appears in just one group.
3. Not sure of a dimension? Choose it from **Add a common quantity** (force, pressure, viscosity, thermal conductivity, voltage and more) and give it a name.
4. Tick other repeating variables if you like. You need as many as the rank, and together they must contain every dimension. The tool says so if your choice does not work.

## Worked example

The pressure drop ΔP in a pipe depends on the diameter D, length l, mean velocity V, density ρ, viscosity μ and wall roughness ε. That is 7 variables in M, L and T with rank 3, so the page shows "7 variables − rank 3 = 4 dimensionless groups". With D, V and ρ repeating it gives

ΔP / (V^2 ρ) = φ(l / D, μ / (D V ρ), ε / D),

which is the Euler number as a function of the length ratio, one over the Reynolds number, and the relative roughness: exactly the variables of the Moody chart. Tick μ instead of ρ and the third group becomes D V ρ / μ, the Reynolds number itself.

For the simple pendulum, the mass of the bob is the only variable with M, so it cannot appear in any group: the period cannot depend on it. The groups are P^2 g / l and θ0.

## How the maths was checked

For every example, the rank and the null space were compared with SymPy's Matrix.rank() and Matrix.nullspace() (scaled to whole numbers), and every group was checked to be dimensionless.

## Good to know

- Dimensional analysis tells you which groups matter, not the shape of φ: that needs experiments or theory.
- Leaving out a variable that matters (or adding one that does not) gives wrong groups; the arithmetic cannot catch that.
- Angles and ratios are already dimensionless and form groups by themselves.
- Treating a temperature difference or a heat amount as its own dimension is sometimes useful; here every quantity is broken into the seven SI base dimensions.

## Frequently asked questions

**Is anything uploaded?** No. All the work happens in your browser and nothing is stored.

**Why are the groups different from my textbook's?** Any set of independent groups is valid, and a group can be replaced by a power of itself or a product with other groups. Choose the same repeating variables as the book to get the same form.

**Can I use units like kg or N?** Use dimensions instead: kg is M, a newton is M L T^-2. The common quantity list fills these in.
