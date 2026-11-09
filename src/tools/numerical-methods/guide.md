---
name: Numerical methods teacher
num: 550
shelf: science
section: applied-mathematics
title: "Numerical methods calculator: bisection, Newton, secant, Simpson, Gauss, Romberg, Lagrange and spline interpolation, with tables"
summary: "See numerical methods work step by step: root finding by bisection, false position, Newton and secant with iteration tables; integration by the trapezoid, Simpson, Gauss-Legendre and Romberg rules with error plots; and Lagrange, Newton divided-difference and cubic spline interpolation. Checked against scipy."
status: live
ads: true
order: 550
icon: curve
works: offline
updated: 2026-11-09
related: [symbolic-algebra, matrix-calculator, plot-maker]
sources:
  - "Methods: the standard textbook algorithms (bisection, regula falsi, Newton-Raphson, secant; composite trapezoid, midpoint and Simpson rules, Gauss-Legendre by Newton iteration on Legendre polynomials, Romberg extrapolation; Lagrange in barycentric form, Newton divided differences, natural cubic spline)."
  - "Checked against scipy 1.18: optimize.brentq and optimize.newton, integrate.trapezoid, integrate.simpson, integrate.quad and special.roots_legendre, interpolate.lagrange, BarycentricInterpolator and CubicSpline (natural), on several functions, plus the textbook iterates worked in plain Python."
  - "The example functions and points are made up for this tool, apart from Runge's classic 1/(1 + 25x²)."
flow:
  - { icon: pencil, label: "Type f(x)" }
  - { icon: sliders, label: "Method" }
  - { icon: table, label: "Steps" }
  - { icon: chart, label: "Error plot" }
---

## What it does

A teaching tool for a first course in numerical methods or numerical analysis. Type a function and watch each method work, step by step, next to the others.

- **Roots**: solve f(x) = 0 by **bisection**, **false position** (regula falsi), **Newton-Raphson** (the derivative is worked out for you) or the **secant** method. You get the full iteration table, why it stopped, the estimated order of convergence, a graph of f with the numbered iterates, and a log-scale plot of the error of all four methods side by side.
- **Integrals**: the **midpoint**, **trapezoid** and **Simpson** rules with n intervals, **Gauss-Legendre** with 2 to 20 points and the **Romberg** table, each with its error against an exact value (worked out symbolically when possible) or a high-accuracy reference. A log-log plot shows the error against the number of function values, so you can read off the orders h² and h⁴.
- **Interpolation**: through points you type, or points sampled from a function (equal or Chebyshev spacing): the **Lagrange** polynomial (by the barycentric formula), the **Newton divided-difference** table with the Newton and expanded forms, and the **natural cubic spline** with each piece's coefficients. When a function is given, an error plot compares the polynomial and the spline.

## How to use it

1. Pick **Roots**, **Integrals** or **Interpolation**.
2. Type the function in x, such as `x^3 - 2x - 5`, `cos(x) - x` or `e^x`. Angles are in radians.
3. For roots, bisection and false position need an interval [a, b] where f changes sign; Newton starts from x₀ (the second point is used by the other methods for the comparison table); the secant method needs two starting points. Choose the tolerance for the change between steps.
4. For integrals, give a, b, the number of intervals n (even for Simpson) and the number of Gauss points.
5. Download the table as CSV, or the whole result as an image, PDF or Word file.

## Worked examples

Newton's method on f(x) = x³ − 2x − 5 from x₀ = 2 (Newton's own example) gives 2.1, 2.094568121, 2.094551482 and stops after **5 iterations** at x ≈ 2.094551482. With a tolerance of 10⁻¹⁰ the secant method takes 7 iterations, false position 22 and bisection 34: the estimated orders come out near 2, 1.6 and 1.

For ∫₀¹ eˣ dx = e − 1 ≈ 1.718281828 with n = 8, the trapezoid rule gives 1.720518592, Simpson 1.718284155 and 3-point Gauss 1.718281004; Romberg reaches the exact value to 15 digits with 33 function values.

The points (0, 1), (1, 3), (2, 2), (4, 5), (5, 4) give the polynomial −0.2x⁴ + 1.98333x³ − 6.05x² + 6.26667x + 1, which is 2.7 at x = 3; the natural spline gives 3.32172.

**Runge's example** (the Runge button) samples 1/(1 + 25x²) at 11 equally spaced points on [−1, 1]: the polynomial swings wildly near the ends (largest error about 1.92), while Chebyshev spacing cuts it to about 0.11 and the spline to about 0.022.

## Tips

- If Newton's method "runs away" (try atan(x) from 1.5), start nearer the root or bracket it with bisection first.
- Bisection's error bound (b − a)/2 tells you in advance how many steps you need: each step gains one binary digit.
- A high-degree polynomial through many equally spaced points is usually a bad idea; use a spline or Chebyshev points.

## Frequently asked questions

**Why does Simpson beat the trapezoid rule so easily?** Its error falls like h⁴ instead of h², so halving h cuts the error 16 times instead of 4.

**What does it not do?** Systems of equations, complex roots, ordinary differential equations, adaptive integration and other spline end conditions are not included.

**Is my work sent anywhere?** No. Everything runs on your device.
