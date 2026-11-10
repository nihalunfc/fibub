---
name: Reaction order
num: 1090
shelf: learn
code: L45
section: school-chemistry
title: "Reaction order"
summary: "See [A], ln[A] and 1/[A] against time side by side for zero, first and second order reactions: only one is a straight line, and that tells you the order. Half-lives are marked as you change [A]₀ and k. A second card shows the Arrhenius equation and an energy profile with and without a catalyst. Ends with fresh practice questions."
status: live
ads: false
order: 1090
icon: chart
works: offline
updated: 2026-11-09
related: [reaction-kinetics-fitter, le-chatelier, thermochemistry-calculator]
sources:
  - "Integrated rate laws, half-lives and the Arrhenius equation: general chemistry facts, written fresh for fibub. Gas constant R from CODATA (NIST)."
  - "The pre-exponential factor (10¹¹ s⁻¹) and ΔH (−40 kJ/mol) used to draw the energy profile are example values."
flow:
  - { icon: sliders, label: "Order, k" }
  - { icon: chart, label: "3 graphs" }
  - { icon: clock, label: "Half-life" }
  - { icon: curve, label: "Arrhenius" }
---

## What it does

How fast a reaction goes depends on how much reactant is left, and the way it depends is the order of the reaction. This page draws what each order looks like.

- **Three graphs.** Choose zero, first or second order and set the starting concentration [A]₀ and the rate constant k. The page plots [A], ln[A] and 1/[A] against time. Only one of the three is a straight line: [A] for zero order, ln[A] for first order and 1/[A] for second order. That graph is outlined and marked "straight", and its slope is given.
- **Half-lives.** Dotted lines on the [A] graph mark each successive half-life. For first order they are evenly spaced; for second order each is twice as long as the last; for zero order each is half as long, and [A] reaches zero at a definite time.
- **Formulas.** The rate law, the integrated rate law and the half-life, with your numbers filled in.
- **Temperature and catalysts.** Set an activation energy Ea and a temperature T. The page shows k from the Arrhenius equation, how many times faster the reaction is 10 K warmer, the fraction of collisions with enough energy, and an energy profile. Tick the catalyst and a second, lower hump appears: Ea drops, ΔH does not change, and k goes up.

It follows Class 12 Chemistry (chemical kinetics: rate of a reaction, rate law and order, integrated rate equations for zero and first order reactions, half-life, temperature dependence and the Arrhenius equation, the effect of a catalyst, collision theory). To find the order and k from your own measurements, use the [[reaction-kinetics-fitter]]; to see how a catalyst leaves an equilibrium unchanged, try the [[le-chatelier]] sandbox.

## How to use it

1. Pick the order.
2. Move the [A]₀ and k sliders and watch the graphs and the half-life.
3. In the second card, move Ea and T, and tick the catalyst.
4. Try the **Check yourself** questions; **New questions** gives a fresh set.

## Worked example: a first-order reaction

First order, [A]₀ = 1 mol/L, k = 0.01 s⁻¹.

- t½ = 0.693 / k = 0.693 / 0.01 = 69.3 s. The page reads "t½ = 69.3 s".
- After 69.3 s, [A] = 0.5 mol/L; after 138.6 s, 0.25 mol/L; the dotted lines are evenly spaced.
- The ln[A] graph is the straight one, with slope −k = −0.01.
- Change [A]₀ to 2 mol/L: the half-life stays 69.3 s. That is the mark of first order.

Now switch to second order with the same numbers: t½ = 1 / (k[A]₀) = 100 s, and the next half-life is 200 s.

Arrhenius: with Ea = 75 kJ/mol at 300 K, going to 310 K makes the reaction about 2.6 times faster. Ticking the catalyst lowers Ea to 45 kJ/mol, and k rises by a factor of about 170 000.

## Tips

- The units of k tell you the order: mol L⁻¹ s⁻¹ (zero), s⁻¹ (first), L mol⁻¹ s⁻¹ (second).
- Radioactive decay is first order, so it has a constant half-life.
- The "doubles every 10 K" rule only holds for Ea near 50 kJ/mol around room temperature.

## FAQ

**Can a real reaction be zero order?** Yes, for example a reaction on a metal surface that is fully covered: adding more gas does not speed it up.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
