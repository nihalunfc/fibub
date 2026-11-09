---
name: Pathway ODE builder
num: 986
shelf: science
section: systems-biology
title: "Pathway ODE model builder: write reactions, simulate (mass action, Michaelis-Menten, Hill) and fit rate constants to data"
summary: "Type a pathway as reactions (mass action, reversible, Michaelis-Menten or Hill) and get its differential equations, a simulated time course from an adaptive Runge-Kutta solver, and a least-squares fit of chosen rate constants to your own measured time courses, with standard errors."
status: live
ads: true
order: 1
icon: curve
works: offline
updated: 2026-11-09
related: [enzyme-kinetics-fitter, reaction-kinetics-fitter]
sources:
  - "Mass-action, Michaelis-Menten and Hill rate laws as in standard biochemistry and systems biology texts; the Dormand-Prince 5(4) Runge-Kutta pair (Dormand, J. R. and Prince, P. J., 1980, J. Comput. Appl. Math. 6, 19 to 26); Levenberg-Marquardt least squares: used as methods, written by fibub."
  - "Checked against SciPy (scipy.integrate.solve_ivp with DOP853 at rtol 1e-12, and scipy.optimize.curve_fit for the fitted values, standard errors and sum of squares). The example model and data are made up."
flow:
  - { icon: pencil, label: "Reactions" }
  - { icon: sigma, label: "Equations" }
  - { icon: curve, label: "Simulate" }
  - { icon: target, label: "Fit" }
---
## What it does

Many questions in biochemistry and systems biology come down to "how do the amounts change over time?" Write a pathway as a list of reactions and this page turns it into a set of **ordinary differential equations** (ODEs), one per species, solves them, and draws the time course. If you have measurements, it can also **fit** chosen rate constants so the model passes as close as possible to your data.

Everything runs in your browser. Nothing you type or paste is sent anywhere.

## How to use it

1. Write one **reaction** per line, with its rate after a colon:
   - `A + B -> C : k1` is mass action: the rate is k1·[A]·[B].
   - `A <-> B : kf, kr` is reversible: kf·[A] − kr·[B].
   - `S -> P : MM(Vmax, Km)` is Michaelis–Menten: Vmax·[S]/(Km + [S]).
   - `X -> X + Y : Hill(Vmax, K, n)` is a Hill law, for example X switching on the production of Y.
   - `-> A : k0` makes A at a constant rate, and `A -> : kd` removes it.
   - A number in front of a species is its stoichiometry: `2 B -> C : kd` uses two B and runs at kd·[B]².
2. Give a **value** for every rate constant (`k1 = 0.5`) and a **starting amount** for any species that does not start at 0 (`S = 10`).
3. Set **Simulate until time**. The page shows the equations it built, the starting and final amount of each species with its peak, and the time course. Download it as CSV.
4. To fit, paste or open your **data**: a time column, then one column per measured species, named as in the model. Tick the **parameters to fit** and press **Fit**. The values in the model are the starting guesses.
5. Read the fitted values, their standard errors, the sum of squares and R², and the chart of fitted lines over your points. **Put the fitted values into the model** writes them back into the reaction text.

## Worked example

The example is a made-up three-step pathway: a substrate S is converted to an intermediate I by an enzyme (Michaelis–Menten, Vmax1 = 1, Km1 = 2), I turns into the product P (k2 = 0.5), and P is cleared (k3 = 0.1). S starts at 10.

The page writes the equations as d[S]/dt = −Vmax1·[S]/(Km1 + [S]), d[I]/dt = Vmax1·[S]/(Km1 + [S]) − k2·[I] and d[P]/dt = k2·[I] − k3·[P]. Simulated to t = 30, S falls from 10 to 0.0004539, I peaks at 1.449 near t = 6, and P peaks at 4.489 near t = 13.8 before it is cleared to 1.41.

The example data (made up, with a little noise) have I and P at ten times. Fitting Vmax1 and k2 gives **Vmax1 = 1.17** (standard error 0.01001) and **k2 = 0.4012** (standard error 0.005686), a sum of squares of 0.05361 over 20 points and R² = 0.9986. SciPy's solve_ivp and curve_fit give the same numbers.

## Tips

- Use one time unit throughout. If k2 is per minute, the data times are minutes.
- Fit only the parameters the data can tell apart. If a standard error is as large as the value itself, fix that parameter and fit fewer.
- If a fit stops before converging, start from values closer to the truth: simulate, compare by eye, adjust, then fit.
- A species that is never measured can still be in the model; only the columns you paste are fitted.

## FAQ

**Which solver is used?** The Dormand–Prince 5(4) Runge–Kutta pair with adaptive steps, the method behind SciPy's default RK45, with a relative tolerance of 10⁻⁸. Very stiff models (rates that differ by many orders of magnitude) may be slow or stop with a message.

**How are standard errors worked out?** From the Jacobian of the residuals at the best fit, scaled by the residual variance, as SciPy's curve_fit does. They assume the errors in the data are independent and of similar size.

**Can I fit starting amounts?** Not yet; only rate constants. Put the measured starting amount in the model.

**Is my data uploaded?** No. The model, the solver and the fit all run in this page, and it keeps working offline. For study and planning, not a substitute for professional judgement.
