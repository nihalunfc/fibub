---
name: Slope field
num: 1474
shelf: learn
section: school-maths
title: "Slope field"
summary: "See dy/dx = f(x, y) as a field of little slopes and tap anywhere to draw the solution through that point. Growth and decay, Newton's cooling and a mixing tank as stories, plus linear and separable examples with the hand working (separating variables or the integrating factor) and the particular solution for your point."
status: live
ads: false
order: 1474
icon: curve
works: offline
updated: 2026-11-09
related: [derivative-slope, riemann-sums, ode-solver, population-growth-models]
sources:
  - "Standard school mathematics: first-order differential equations, slope (direction) fields, separation of variables and linear equations solved with an integrating factor; Newton's law of cooling and a well-stirred mixing tank as models. Written for fibub; no textbook text, figures or exercises are used, and the story numbers are made up."
  - "Checked against scipy solve_ivp (rtol 1e-12) for every ready-made equation, and the general solutions of the two linear equations against sympy 1.14 dsolve. The numerical curves use the classical fourth-order Runge-Kutta method."
flow:
  - { icon: pencil, label: "Pick dy/dx" }
  - { icon: curve, label: "See slopes" }
  - { icon: pointer, label: "Tap a point" }
  - { icon: check, label: "Solve it" }
---

## What it shows

A differential equation such as dy/dx = x + y does not tell you y; it tells you the **slope** of the graph of y at every point. Draw a short dash with that slope at many points and you get a **slope field** (direction field). Every solution is a curve that follows the dashes, and a starting point picks one particular solution out of the whole family.

This page draws the field, lets you tap to trace solutions through any point, and for the ready-made equations shows how to solve them by hand, either by **separating the variables** or with an **integrating factor**, with the constant C worked out for the point you tapped. A dashed green curve shows the formula's answer on top of the numerical one, so you can see that they agree.

It follows differential equations in Class 12 maths (order, general and particular solutions, variables separable, linear equations). Slopes and gradients come from the [[derivative-slope]] tool and areas under curves from [[riemann-sums]]; for systems of equations, phase portraits and more methods, go on to the [[ode-solver]].

## How to use it

1. Pick an **equation**. The stories (growth and decay, Newton's cooling, a mixing tank) have sliders for their numbers; the linear and separable examples are pure maths. *My own…* lets you type dy/dx as a formula in x and y, such as `x - y` or `y*(1 - y)`, with your own window.
2. Look at the dashes. Where they are flat, dy/dx = 0; where they are steep, y changes fast.
3. **Tap** the picture to draw the solution through that point. Each tap adds a curve (the newest is blue). **Clear curves** starts again.
4. Under the picture: the start point, the slope there, y further along by Runge-Kutta, and the formula's value for comparison.
5. **Solve it by hand** shows the working for the newest point and the particular solution.

## Worked example

Pick growth and decay with k = 0.3: dy/dt = 0.3 y, starting at (0, 2). Separating the variables gives dy/y = 0.3 dt, so ln|y| = 0.3t + c and **y = C e^(0.3 t)**. At t = 0, y = 2, so C = 2 and the answer is **y = 2 e^(0.3 t)**. The page shows y at t = 3 as **4.9192** from Runge-Kutta, and the formula gives the same 4.9192.

Pick the cooling story: tea at 90 °C in a 25 °C room with k = 0.08 per minute follows T = 25 + 65 e^(−0.08 t), which is about 38.1 °C after 20 minutes. In the mixing tank (2 litres a minute of water with 1 g of salt per litre into 100 litres), the salt follows y = 100 − 100 e^(−0.02 t): about 69.9 g after an hour, heading for 100 g.

## Separable or linear?

- **Separable**: dy/dx = g(x) h(y). Divide by h(y), multiply by dx, integrate both sides.
- **Linear**: dy/dx + P(x) y = Q(x). Multiply by the integrating factor e^(∫P dx); the left side becomes the derivative of y × (integrating factor), so you can integrate.
- dy/dt = k y and the cooling law are both at once; dy/dx = x + y is linear but not separable.

## Check yourself

Five fresh questions on growth, cooling, reading a slope from f(x, y), integrating factors and spotting a separable equation. Nothing is saved.

## FAQ

**Why does a curve stop?** Where the slope becomes undefined or the curve turns vertical (for dy/dx = −x/y, on the x-axis), a solution y(x) cannot continue, so the drawing stops there.

**How accurate are the curves?** They use the fourth-order Runge-Kutta method with small steps; for the ready-made equations the page compares with the exact formula, and the difference is usually under 0.0001.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid and is not part of NCERT.
