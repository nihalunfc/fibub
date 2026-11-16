---
name: Integration technique coach
num: 1471
shelf: learn
code: L308
section: school-maths
title: "Integration technique coach: which method (substitution, parts, partial fractions) and why, with steps"
summary: "Type a school integral and the coach says which method fits and why: power rule, standard form, substitution, integration by parts with ILATE, partial fractions, or parts twice for eˣ sin x. Then it writes the steps, checks the answer by differentiating it back, and draws f with its antiderivative."
status: live
ads: false
order: 1471
icon: sigma
works: offline
updated: 2026-11-16
related: [derivative-steps, integral-properties, riemann-sums, symbolic-algebra]
sources:
  - "Standard school integration methods: the power rule, standard integrals, substitution, integration by parts with the ILATE order, partial fractions with linear and quadratic factors. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against sympy 1.14 (integrate): definite integrals from 1.2 to 1.9 of 27 school integrands, plus a check that every answer differentiates back to its integrand."
flow:
  - { icon: pencil, label: "Integrand" }
  - { icon: search, label: "Method" }
  - { icon: sigma, label: "Steps" }
  - { icon: check, label: "Check" }
---

## What it does

The hard part of integration is not the algebra but the first decision: *which method?* This coach looks at the integrand the way a teacher would and tells you which method fits and **why**, then works it through step by step.

- **Power rule** for polynomials and powers of x (with ln|x| for 1/x).
- **Standard forms**, including a linear inside such as sin(3x + 1) or 1/(2x + 3), where you divide by the inside's slope.
- **Substitution** when an inside function sits there and the rest is a constant times its derivative, as in 2x cos(x²) or ln x / x.
- **Integration by parts** for a product of two different kinds, such as x eˣ or x ln x, with u chosen by **ILATE** (Inverse trig, Log, Algebraic, Trig, Exponential). A lone ln x or tan⁻¹ x is done by parts with dv = dx.
- **Partial fractions** for a fraction of polynomials: divide first if the top is too big, factor the bottom, match coefficients.
- **Parts twice, then solve** for eˣ sin x and eˣ cos x, where the integral comes back.

Every answer is checked by differentiating it back. The graph then draws f and its antiderivative F + C, with the tangent to F at a point you choose: its slope is always the height of f.

It follows integrals in Class 12 maths (methods of integration). It is the reverse of differentiation, so [[derivative-steps]] is the best warm-up; afterwards, [[integral-properties]] turns these antiderivatives into definite integrals, and [[riemann-sums]] shows what the area really is.

## How to use it

1. **Type the integrand** between ∫ and dx, or tap an example. Examples are grouped by the method they need, so you can practise one method at a time.
2. Read the **method** and the **why**. Try to guess the method first, then compare.
3. Follow the **steps**. A sum is split into terms; each term's own working folds out underneath.
4. The **answer** ends in + C, and the green line confirms it differentiates back.
5. In the graph, slide **x** to move the tangent, and **C** to slide the whole antiderivative up and down: every C gives a correct answer.

## Definite integrals and limits

Open *Definite integral: put in limits* under the answer and type a lower and an upper limit (numbers, fractions or `pi`). The page works out F(b) − F(a) with the numbers shown, for example ∫ from 0 to 1 of x eˣ dx = [x eˣ − eˣ] = 0 − (−1) = 1, and checks the result with a numerical (Simpson's rule) estimate. Swap the limits and the sign flips, with a note saying so. The + C cancels in a definite integral, so it is left out.

If f is undefined or blows up between the limits (1/x from −1 to 1, ln x from −1 to 1) the page says the integral is improper and does not give a number, instead of a wrong one. If the antiderivative and the numerical check disagree, for example when tan x crosses its asymptote, you are told to split the range at that point.

Three more example buttons (sec² x, e²ˣ and x² + 1/x²) cover standard forms and splitting into terms.

Common mistakes: leaving out + C on an indefinite integral, not changing dx when you substitute (u = x² gives du = 2x dx), picking u for integration by parts by guesswork instead of ILATE, and putting the limits into only part of F.

## Worked example

∫ x eˣ dx. There are two different kinds of factor: x is algebraic, eˣ is exponential. In ILATE, A comes before E, so u = x and dv = eˣ dx. Then du = dx and v = eˣ, and

∫ x eˣ dx = x eˣ − ∫ eˣ dx = x eˣ − eˣ + C.

At x = 1.5 the graph shows F(1.5) = 1.5e^1.5 − e^1.5 = 0.5 × 4.4817 = 2.2408, and the slope of F there is 6.7225, which is exactly f(1.5) = 1.5 × 4.4817.

Now tap (3x + 5)/(x² + 3x + 2). The bottom factors as (x + 1)(x + 2); matching coefficients gives 2/(x + 1) + 1/(x + 2), so the answer is 2 ln|x + 1| + ln|x + 2| + C.

## FAQ

**How do I work out a definite integral by hand?** Find an antiderivative F (this page names the method and shows the steps), then compute F(b) − F(a); type your limits under *Definite integral* to see it done.

**Why did it choose substitution and not parts?** If an inside function and its derivative both appear, substitution is quicker. ∫ x e^(x²) dx by parts goes round in circles; with u = x² it is one line.

**What if it says no school method fits?** Some integrals, such as e^(x²) or sin(x)/x, have no answer in ordinary functions at all. Others need tricks beyond this coach; the [[symbolic-algebra]] tool tries a little more.

**Is this page part of NCERT?** No. fibub is independent. It follows the topics of the Class 12 maths syllabus and uses none of the textbook's text or exercises.
