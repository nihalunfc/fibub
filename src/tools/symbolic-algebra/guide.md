---
name: Symbolic algebra
num: 542
shelf: science
code: T370
section: pure-mathematics
title: "Symbolic algebra"
summary: "Type an expression and simplify, expand or factor it, differentiate it, integrate it (with definite integrals), or substitute values. Exact fractions, answers you can copy as SymPy or LaTeX, and an honest 'could not integrate' when it is out of reach. Checked against sympy."
status: live
ads: true
order: 542
icon: sigma
works: offline
updated: 2026-11-09
related: [plot-maker, uncertainty-calculator, matrix-calculator, function-grapher, numerical-methods, ode-solver, lagrangian-helper, dimensional-analysis, number-theory-toolkit]
sources:
  - "Methods: standard algebra and calculus rules (sum, product, quotient and chain rules; power rule, partial fractions, substitution and integration by parts), Yun's square-free factorisation and Kronecker's factor search, written for fibub."
  - "Checked against sympy 1.x on 88 expressions: values, simplify, expand, factor_list, diff and integrate (up to a constant), plus exact values, definite integrals and printing."
  - "The example expressions are made up for this tool."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: sliders, label: "Pick a job" }
  - { icon: sigma, label: "Answer" }
  - { icon: copy, label: "Copy" }
---

## What it does

A small computer algebra system (CAS) that runs in your browser, for homework, checking your own working and writing up. Type an expression such as `x^2 e^(-x)` and choose:

- **Simplify**: collects like terms, cancels common factors in a fraction, uses sin² + cos² = 1 and keeps the shortest form.
- **Expand**: multiplies out brackets and powers of sums.
- **Factor**: factors a polynomial in one variable completely over the whole numbers, such as x⁶ − 1 = (x − 1)(x + 1)(x² − x + 1)(x² + x + 1), and lists its roots that are fractions. Fractions of polynomials are cancelled and factored top and bottom.
- **Differentiate**, up to 5 times, with respect to any letter.
- **Integrate**: polynomials, fractions of polynomials (by partial fractions), standard forms such as sin(3x + 1), e^(2x), 1/(4x − 1) and 1/(x² + 1), simple substitutions such as 2x·cos(x²), and integration by parts such as x²·e^x and x·ln(x). Give **From** and **To** for a definite integral.
- **Substitute**: put in values such as `x = 2` or `x = t + 1`, and get a decimal value when every letter has a number.

Every answer is exact (1/3 stays 1/3, √2 stays √2) and can be copied as SymPy/Python code or LaTeX for a report. When there is a graph, the expression is the solid line and its derivative or antiderivative the dashed one.

Graph the result in the [[function-grapher|graphing calculator]], and solve equations with no neat answer in [[numerical-methods]].

## How to type expressions

Use `^` for powers, `*` or a space for multiplication (2x and x y work too), `/` for division and brackets as usual. Functions: sqrt, sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, ln, exp, abs (or |x|), plus sec, csc, cot and log10, which are rewritten. `log` means the natural log, as in SymPy. `pi` is π and `e` is Euler's number. Letters written together are multiplied, so `xy` is x·y; Greek names such as theta work. `sin^2(x)` means sin(x)². The line **Read as** shows how your input was understood.

## Worked examples

- Integrate (x³ + 1)/(x² − 3x + 2): **x²/2 + 3x − 2ln|x − 1| + 9ln|x − 2|**, found by dividing and then partial fractions. SymPy gives the same with log(x − 1).
- Differentiate x² sin(x): **x²·cos(x) + 2x·sin(x)** by the product rule.
- Simplify (x³ − 8)/(x² − 4): **(x² + 2x + 4)/(x + 2)**, after cancelling x − 2.
- The integral of sin(x) from 0 to pi is exactly **2**; of 1/(1 + x²) from 0 to 1 it is **π/4**.

## Honest limits

This is a lite CAS. Integrals are only shown after a check: the answer is differentiated and must give back your expression. When none of its methods works it says **Could not integrate** rather than guess; some integrals, like e^(x²) or sin(x)/x, have no answer in ordinary functions at all. It does not solve equations, find limits or series, work with complex numbers or matrices of symbols, or factor polynomials in several letters beyond taking out a common factor. Definite integrals across a point where the expression is undefined (an improper integral) are refused. Square roots of negative numbers are not simplified. For matrices of numbers use the [matrix calculator](/science/matrix-calculator/).

## Frequently asked questions

**Why ln|x| and not ln(x)?** Both are correct antiderivatives where x > 0; ln|x| also works for negative x. SymPy writes log(x).

**Why does my answer look different from my textbook's?** Antiderivatives can differ by a constant, and equal expressions can be written in several ways. Use Simplify, or Substitute a value into both.

**Is anything sent to a server?** No. Everything is worked out on your device, and it keeps working offline.
