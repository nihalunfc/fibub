---
title: "How to propagate uncertainty in a calculation (with a worked example)"
summary: "Combine the uncertainties of your measurements into the uncertainty of a calculated result, the GUM way, with a kinetic energy example and a Monte Carlo check."
tools: [uncertainty-calculator, sig-fig-checker, curve-fitter]
updated: 2026-11-10
sources:
  - "Propagation of uncertainty by first-order sensitivity coefficients, combined in quadrature: JCGM 100:2008 (GUM), free from BIPM."
  - "Monte Carlo propagation: JCGM 101:2008 (GUM Supplement 1)."
---

To propagate uncertainty, find how strongly the result changes with each input (its sensitivity), multiply each sensitivity by that input's standard uncertainty, then add the pieces in quadrature: square them, sum, and take the square root. The [[uncertainty-calculator]] does this for any formula you type, shows which input contributes most, and checks the answer with a Monte Carlo run.

## What you need

- **The formula** that turns your measurements into the result, for example E = ½mv².
- **A value for each measured quantity**, in consistent units.
- **An uncertainty for each one**, and what kind it is: a stated standard uncertainty (one standard deviation), a ± range from a scale reading, or a set of repeated readings.
- **A coverage level** for the final answer. Most lab reports quote 95 %.

## Step by step

1. Type the formula into the **What you calculate** box, with the result's name on the left, such as `E = 0.5 m v^2`. You can leave out the multiplication sign between a number and a name.
2. A row appears for each name the calculator found. For each row, pick the **Kind**:
   - **± standard uncertainty** if you already know u, for example from a certificate stated at k = 1;
   - **± half-width (even chance)** for a scale or display where the true value could be anywhere inside ± a; the calculator uses u = a/√3;
   - **± half-width (triangular)** when the middle of the range is more likely; u = a/√6;
   - **Repeated readings** to paste a list; the mean becomes the value and the standard error of the mean becomes u.
3. Type each value and its ±.
4. Pick 68 %, 95 % or 99 % from the **Coverage** menu, then read the big line, which is rounded ready for a report. **Copy result** puts it on your clipboard.
5. Look at the budget table to see each input's share, and at the Monte Carlo paragraph to see whether the quick method holds up.

The rule behind step 4, for a result y that depends on inputs x₁, x₂ and so on:

u(y)² = (∂y/∂x₁ · u₁)² + (∂y/∂x₂ · u₂)² + …

Each ∂y/∂x is the sensitivity: how much y moves for a small change in that input, with the others held still. The expanded uncertainty is U = k · u(y), where k is about 2 for 95 % when the inputs are well known.

For a formula made only of products, quotients and powers there is a handy shortcut. Relative uncertainties add in quadrature, each multiplied by its power. For E = ½mv²:

u(E)/E = √[(u(m)/m)² + (2 · u(v)/v)²]

## A worked example

A trolley of mass m = 0.250 ± 0.002 kg rolls past a light gate at v = 3.20 ± 0.05 m/s. Both are standard uncertainties. What is its kinetic energy?

- E = 0.5 × 0.250 kg × (3.20 m/s)² = 1.280 J
- Relative uncertainty of m: 0.002 ÷ 0.250 = 0.80 %
- Relative uncertainty of v, doubled because v is squared: 2 × 0.05 ÷ 3.20 = 3.125 %
- Combined: √(0.80² + 3.125²) = 3.23 %, so u(E) = 0.0323 × 1.280 J = 0.041 J
- At 95 % (k = 2.00): U = 0.083 J

Typed into the calculator, the result reads **E = 1.280 ± 0.083**, which is in joules because the inputs were in kilograms and metres per second, with a standard uncertainty of 0.041 J. The budget table shows the sensitivities 5.12 J/kg for m and 0.80 J per m/s for v. The speed carries about 94 % of the squared uncertainty and the mass only 6 %. So a better light gate is worth buying; a better balance is not.

The Monte Carlo check draws 200,000 random trolleys and gives a 95 % interval of about 1.199 to 1.364 J. The formula method gives 1.197 to 1.363 J. They agree, so the quick method is good enough here.

## Check your answer

- **The total is never smaller than the biggest single piece.** Here the speed alone gives 0.040 J, and the total is 0.041 J. If your total is below any one contribution, a term went missing.
- **It is never larger than the plain sum of the pieces.** 0.010 J + 0.040 J = 0.050 J is the upper limit. Adding the percentages straight, as some old textbooks do, gives that larger, too-cautious answer.
- **Round the uncertainty to one or two significant figures, and the value to the same decimal place.** The [[sig-fig-checker]] does this pairing for you if you are unsure.
- **Read the Monte Carlo line.** If it says the two methods differ by more than 5 %, quote the Monte Carlo interval instead.

## Questions people ask

**What if my input came from a fitted line?** Use the parameter and its standard uncertainty from the [[curve-fitter]] as an input with kind "± standard uncertainty". If two fitted parameters both enter the formula, be careful: this calculator treats inputs as independent, and fitted parameters are often strongly correlated.

**Why is k bigger than 2 sometimes?** When an input comes from only a few repeated readings, its standard error is itself uncertain. The calculator then uses Student's t with the effective degrees of freedom, which makes k larger, for example about 2.8 with only five readings.

**Should I use the standard deviation of my readings or the standard error?** For the value you put into a formula, the standard error of the mean (s/√n) is the right one. The calculator works it out when you paste the readings.
