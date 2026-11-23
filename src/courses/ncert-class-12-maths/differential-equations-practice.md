---
title: 'Differential Equations: practice questions'
seoTitle: 'Differential Equations Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Differential Equations: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full answers.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'The general solution of dy/dx = 3x² is:'
    choices: ['y = x³ + C', 'y = 6x + C', 'y = x³', 'y = 3x³ + C']
    ans: 0
    why: 'Integrate both sides with respect to x: y = ∫3x² dx = x³ + C.'
  - q: 'The solution of dy/dx = y/x (x > 0, y > 0) is:'
    choices: ['y = Cx', 'y = C/x', 'y = x + C', 'y = Cx²']
    ans: 0
    why: 'Separate: dy/y = dx/x, so ln y = ln x + ln C, giving y = Cx. These are straight lines through the origin.'
  - q: 'A radioactive substance decays so that dN/dt = −kN. After one half-life the amount is:'
    choices: ['N₀/2', 'N₀/e', 'N₀/4', 'N₀ − k']
    ans: 0
    why: 'The half-life is by definition the time in which the amount falls to half. Solving N = N₀e^(−kt) gives T = ln 2/k.'
sources:
  - 'CBSE Class 12 Mathematics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Maths · Chapter 9.** Read the chapter lesson, [Differential Equations](/learn/courses/ncert-class-12-maths/differential-equations/), first. Try each question on paper before opening the answer. Marks go for naming the type, the substitution or integrating factor, each integration, and using the initial condition.

<div class="bigidea">Identify the type first: can the variables be separated, does the slope depend only on y/x, or is it linear (dy/dx + Py = Q)? The type tells you the method. Then integrate, add the constant, and use the starting value last.</div>

## How to set out a solution

1. Write the equation, name its type ("variable separable", "homogeneous", "linear").
2. Do the method: separate and integrate, or put y = vx, or find the integrating factor.
3. Write the general solution with the constant, then use the initial condition to find it.
4. Check by differentiating your solution.

<div class="problem" data-problem="c12m-de-sep"></div>

<div class="problem" data-problem="c12m-de-linear"></div>

## 1-mark questions

1. Write the order and degree of `$\dfrac{d^2y}{dx^2} + \left(\dfrac{dy}{dx}\right)^3 = 0$`.

<details><summary>Answer</summary>Order 2, degree 1 (the highest derivative `$y''$` has power 1).</details>

2. How many arbitrary constants does the general solution of a first-order equation have?

<details><summary>Answer</summary>One.</details>

3. Is `$y = Ce^{x}$` a solution of `$dy/dx = y$`?

<details><summary>Answer</summary>Yes: `$dy/dx = Ce^x = y$`, for every C. It is the general solution.</details>

4. Write the integrating factor of `$\dfrac{dy}{dx} + 3y = e^{x}$`.

<details><summary>Answer</summary>`$e^{\int 3\,dx} = e^{3x}$`.</details>

## 2-mark and 3-mark questions

5. Find the order and degree: `$\dfrac{dy}{dx} = \sqrt{1 + \left(\dfrac{d^2y}{dx^2}\right)^2}$`.

<details><summary>Answer</summary>

Square both sides to remove the root: `$\left(\dfrac{dy}{dx}\right)^2 = 1 + \left(\dfrac{d^2y}{dx^2}\right)^2$`. The highest derivative is `$y''$`, with power 2. Order 2, degree 2.

</details>

6. Solve `$\dfrac{dy}{dx} = e^{x + y}$`.

<details><summary>Answer</summary>

Write `$e^{x+y} = e^x e^y$` and separate: `$e^{-y}dy = e^x dx$`.

Integrate: `$-e^{-y} = e^x + C$`, or `$e^x + e^{-y} = K$`.

</details>

7. Solve `$\dfrac{dy}{dx} = y\sin x$` with `$y(0) = 1$`.

<details><summary>Answer</summary>

`$\dfrac{dy}{y} = \sin x\,dx$`, so `$\ln y = -\cos x + C$`, i.e. `$y = Ae^{-\cos x}$`.

`$y(0) = 1$`: `$A e^{-1} = 1$`, so `$A = e$`. The solution is `$y = e^{1 - \cos x}$`.

</details>

8. Solve `$x\dfrac{dy}{dx} = y$` for `$x > 0, y > 0$` with `$y(1) = 3$`.

<details><summary>Answer</summary>

`$\dfrac{dy}{y} = \dfrac{dx}{x}$`, so `$\ln y = \ln x + \ln C$`, `$y = Cx$`. `$y(1) = 3$` gives `$C = 3$`: `$y = 3x$`.

</details>

9. Find the integrating factor and solve `$\dfrac{dy}{dx} + \dfrac{y}{x} = x$` (for `$x > 0$`).

<details><summary>Answer</summary>

`$P = 1/x$`, so `$\text{IF} = e^{\ln x} = x$`.

`$\dfrac{d}{dx}(xy) = x^2$`, so `$xy = \dfrac{x^3}{3} + C$` and `$y = \dfrac{x^2}{3} + \dfrac Cx$`.

</details>

10. A bank account grows so that `$dA/dt = 0.08A$`. If it starts with ₹5000, find A after 10 years in terms of e.

<details><summary>Answer</summary>

`$A = 5000e^{0.08t}$`, so at `$t = 10$`, `$A = 5000e^{0.8} \approx 5000 \times 2.2255 \approx$` ₹11 128.

</details>

## 5-mark questions

11. Find the general solution of the homogeneous equation `$\dfrac{dy}{dx} = \dfrac{x + y}{x - y}$`.

<details><summary>Answer</summary>

Replacing `$x, y$` by `$\lambda x, \lambda y$` leaves the right side unchanged, so it is homogeneous. Put `$y = vx$`, `$\dfrac{dy}{dx} = v + x\dfrac{dv}{dx}$`:

`$v + x\dfrac{dv}{dx} = \dfrac{1 + v}{1 - v}$`, so `$x\dfrac{dv}{dx} = \dfrac{1 + v}{1 - v} - v = \dfrac{1 + v^2}{1 - v}$`.

Separate: `$\dfrac{1 - v}{1 + v^2}\,dv = \dfrac{dx}{x}$`. Integrate: `$\tan^{-1}v - \tfrac12\ln(1 + v^2) = \ln|x| + C$`.

Put back `$v = y/x$`: `$\tan^{-1}\dfrac yx = \tfrac12\ln(x^2 + y^2) + C$`.

</details>

12. Solve `$\dfrac{dy}{dx} + 2y = 4x$` with `$y(0) = 1$`.

<details><summary>Answer</summary>

`$\text{IF} = e^{2x}$`. Then `$\dfrac{d}{dx}(ye^{2x}) = 4xe^{2x}$`.

By parts, `$\int 4xe^{2x}dx = 2xe^{2x} - e^{2x}$`. So `$ye^{2x} = 2xe^{2x} - e^{2x} + C$` and `$y = 2x - 1 + Ce^{-2x}$`.

`$y(0) = 1$`: `$1 = -1 + C$`, `$C = 2$`. The solution is `$y = 2x - 1 + 2e^{-2x}$`.

</details>

13. Solve `$(1 + x^2)\dfrac{dy}{dx} = 1 + y^2$` with `$y(0) = 0$`.

<details><summary>Answer</summary>

Separate: `$\dfrac{dy}{1 + y^2} = \dfrac{dx}{1 + x^2}$`. Integrate: `$\tan^{-1}y = \tan^{-1}x + C$`.

`$y(0) = 0$` gives `$C = 0$`, so `$\tan^{-1}y = \tan^{-1}x$` and `$y = x$`.

</details>

14. The rate at which a population of bacteria grows is proportional to the number present. If it doubles in 3 hours, find how long it takes to become 8 times.

<details><summary>Answer</summary>

`$N = N_0e^{kt}$`. Doubling in 3 h: `$e^{3k} = 2$`, so `$k = \tfrac{\ln 2}{3}$`.

For 8 times: `$e^{kt} = 8$`, so `$kt = \ln 8 = 3\ln 2$` and `$t = \dfrac{3\ln 2}{k} = 9$` hours (three doublings: 3 × 3 h).

</details>

## Case-based question

**A cup of chai.** A cup of chai at 90 °C is left in a room at 30 °C. Its temperature `$T$` (°C) after `$t$` minutes satisfies Newton's law of cooling, `$\dfrac{dT}{dt} = -k(T - 30)$`. After 10 minutes the chai is at 60 °C.

(a) Write the differential equation's general solution.

(b) Find `$k$`.

(c) How hot is the chai after 20 minutes?

(d) Will the chai ever fall below 30 °C? Explain.

<details><summary>Answer</summary>

(a) Separate: `$\dfrac{dT}{T - 30} = -k\,dt$`, so `$\ln|T - 30| = -kt + C$` and `$T = 30 + Ae^{-kt}$`. With `$T(0) = 90$`, `$A = 60$`: `$T = 30 + 60e^{-kt}$`.

(b) `$T(10) = 60$`: `$30 + 60e^{-10k} = 60$`, so `$e^{-10k} = \tfrac12$` and `$k = \dfrac{\ln 2}{10} \approx 0.0693$` per minute.

(c) `$T(20) = 30 + 60\left(\tfrac12\right)^2 = 30 + 15 = 45$` °C.

(d) No. `$60e^{-kt}$` is always positive and tends to 0, so `$T$` approaches 30 °C from above but never goes below it.

</details>

## Assertion and reason

For each, choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

15. **Assertion (A):** The degree of `$\left(\dfrac{d^2y}{dx^2}\right)^2 + \left(\dfrac{dy}{dx}\right)^5 = 0$` is 2. **Reason (R):** The degree is the power of the highest-order derivative.

<details><summary>Answer</summary>(A). The highest derivative is `$y''$`, with power 2; the power 5 is on a lower derivative.</details>

16. **Assertion (A):** `$\dfrac{dy}{dx} = \dfrac{y}{x} + 1$` is a homogeneous equation. **Reason (R):** The right side depends only on `$y/x$`.

<details><summary>Answer</summary>(A). `$\dfrac yx + 1$` is a function of `$y/x$` only, so the substitution `$y = vx$` works.</details>

17. **Assertion (A):** The solution of `$\dfrac{dy}{dx} + y = 0$` with `$y(0) = 5$` approaches 0 as `$x \to \infty$`. **Reason (R):** The general solution is `$y = Ce^{-x}$`.

<details><summary>Answer</summary>(A). R is true (`$P = 1$`, IF = `$e^x$`), and `$5e^{-x} \to 0$`, which is why A holds.</details>

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="differential-equations" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Identify the type: separable, homogeneous (function of y/x), or linear (dy/dx + Py = Q).
- Separable: g(y)dy = f(x)dx. Homogeneous: y = vx. Linear: IF = e^(∫P dx), y·IF = ∫Q·IF dx + C.
- Order = highest derivative; degree = its power after removing roots and fractions of derivatives.
- Growth and decay: y = y₀e^(kt); half-life or doubling time ln 2/|k|. Cooling: T = Tᵣ + (T₀ − Tᵣ)e^(−kt).
- Use the initial condition last, and check by differentiating.

</div>
