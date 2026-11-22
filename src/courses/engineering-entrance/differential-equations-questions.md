---
title: 'Differential equations: question types and traps'
seoTitle: 'Differential equations JEE questions: types and traps'
summary: 'Every way entrance exams ask about differential equations: order and degree, forming equations and counting constants, variable separable, homogeneous, linear and Bernoulli equations, exact-looking forms, growth, decay and cooling, curves from tangent properties and orthogonal trajectories, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'The degree of y″ = √(1 + (y′)²) is:'
    choices: ['1', '2', '1/2', 'not defined']
    ans: 1
    why: 'Square both sides to clear the root: (y″)² = 1 + (y′)². The highest derivative y″ now has power 2.'
  - q: 'The family y = Ae^(2x) + Be^(−2x) satisfies:'
    choices: ['y″ = 4y', 'y″ = −4y', 'y′ = 2y', 'y″ = 2y']
    ans: 0
    why: 'y″ = 4Ae^(2x) + 4Be^(−2x) = 4y. Two constants, so the equation has order 2.'
  - q: 'A quantity decays with half-life 5 years. The fraction left after 15 years is:'
    choices: ['1/3', '1/8', '1/6', '1/16']
    ans: 1
    why: '15 years is 3 half-lives: (1/2)³ = 1/8.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Ordinary differential equations; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 26 minutes.** Read [Differential equations](/learn/courses/engineering-entrance/differential-equations/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Solving a first-order equation is a sorting job: decide which of four types it is (separable, homogeneous, linear, exact-looking) and each type has a fixed recipe. Most mistakes come from forcing the wrong recipe, so spend your first ten seconds on the sorting.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Order and degree.</b> <i>Trap:</i> taking the highest power anywhere instead of the power of the highest derivative; forgetting to clear roots; degree undefined when a derivative is inside sin or log.</div>
<div class="step"><b>2. Forming equations and counting constants.</b> Differentiate once per independent constant. <i>Trap:</i> constants that merge into one, such as A + B, or Ae^(x + B) = (Ae^B)eˣ.</div>
<div class="step"><b>3. Variable separable.</b> Including substitution t = ax + by + c. <i>Method:</i> get all y with dy and all x with dx.</div>
<div class="step"><b>4. Homogeneous.</b> F(λx, λy) = F(x, y); put y = vx. <i>Trap:</i> stopping at an answer in v.</div>
<div class="step"><b>5. Linear and Bernoulli.</b> IF = e^(∫P dx); z = y¹⁻ⁿ for Bernoulli. <i>Trap:</i> P read off before dividing by the coefficient of dy/dx.</div>
<div class="step"><b>6. Exact-looking forms.</b> d(xy), d(y/x), d(tan⁻¹(y/x)), d(log(x² + y²)). <i>Method:</i> regroup terms to match one of these.</div>
<div class="step"><b>7. Models.</b> Growth and decay, cooling, mixing, draining. <i>Trap:</i> in cooling, the excess over the room temperature decays, not the temperature.</div>
<div class="step"><b>8. Curves and trajectories.</b> Tangent or normal properties; orthogonal trajectories. <i>Method:</i> translate to an equation in y′, then sort it into a type.</div>
</div>

## Worked examples

**Example 1 (level 3, forming).** Form the equation of y = A cos x + B sin x. *Solution.* y′ = −A sin x + B cos x, y″ = −A cos x − B sin x = −y. **y″ + y = 0**, order 2 for two constants.

**Example 2 (level 4, homogeneous).** Solve x dy/dx = y + √(x² + y²) for x > 0. *Solution.* Put y = vx: v + x dv/dx = v + √(1 + v²), so dv/√(1 + v²) = dx/x. Integrating: log(v + √(1 + v²)) = log x + c. Back to y: **y + √(x² + y²) = Cx²**.

**Example 3 (level 4, linear with a value).** dy/dx + 2y/x = x² with y(1) = 1. Find y(2). *Solution.* IF = x². (x²y)′ = x⁴, so x²y = x⁵/5 + C, and C = 4/5. At x = 2: 4y = 32/5 + 4/5 = 36/5, so **y(2) = 9/5**.

**Example 4 (level 5, Bernoulli).** Solve dy/dx + y/x = y². *Solution.* Divide by y²: y⁻²y′ + (1/x)y⁻¹ = 1. With z = 1/y, z′ = −y⁻²y′, so z′ − z/x = −1. IF = 1/x: (z/x)′ = −1/x, so z/x = C − log x. **1/y = x(C − log x).**

**Example 5 (level 5, cooling time).** A body cools from 80 °C to 60 °C in 10 minutes in a room at 20 °C. When will it reach 40 °C? *Solution.* The excess falls from 60 to 40, a factor 2/3 every 10 minutes. We need the excess to fall from 60 to 20: (2/3)^(t/10) = 1/3, so t = 10 log 3/log 1.5 ≈ **27.1 minutes**. (Not 20 minutes: cooling slows as the body nears room temperature.)

<div class="myth">

**"Equal temperature drops take equal times."** The rate of cooling is proportional to the excess temperature, so each degree takes longer than the last. 80 → 60 takes 10 minutes but 60 → 40 takes about 17 more.

</div>

<div class="meaning">
<dl>
<dt>P, Q</dt><dd>coefficients in dy/dx + Py = Q, read after making the coefficient of dy/dx equal to 1</dd>
<dt>v</dt><dd>y/x in homogeneous equations</dd>
<dt>z</dt><dd>y¹⁻ⁿ in Bernoulli equations, which makes them linear</dd>
<dt>Physical meaning</dt><dd>Each type is a different way to undo the derivative: separate the variables, change to a ratio, or multiply by a factor that turns the left side into a single derivative.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="differential-equations" data-mode="practice"></div>

<div class="keypoints">

- Degree belongs to the highest derivative; clear roots first; undefined inside sin, log, exp.
- Constants that merge (A + B) count once; order = number of independent constants.
- Sort first: separable, homogeneous (y = vx), linear (IF), exact-looking (regroup).
- Bernoulli: divide by yⁿ and put z = y¹⁻ⁿ.
- Cooling: the excess T − Tₛ shrinks by the same factor in equal times.
- Orthogonal trajectories: form the family's equation, swap y′ for −1/y′, solve.

</div>
