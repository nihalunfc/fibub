---
title: Differential equations
seoTitle: 'Differential equations: JEE maths'
summary: 'Order and degree, general and particular solutions, forming an equation by eliminating constants, variable separable, homogeneous and linear first-order equations, Bernoulli and exact-looking forms, and the models the exams love: growth and decay, Newton''s law of cooling, mixing, curves from tangent properties and orthogonal trajectories.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'The order and degree of (d²y/dx²)³ + (dy/dx)⁴ + y = 0 are:'
    choices: ['order 2, degree 3', 'order 2, degree 4', 'order 3, degree 2', 'order 1, degree 4']
    ans: 0
    why: 'The highest derivative is d²y/dx² (order 2), and its power, once the equation is free of fractional powers, is 3 (degree 3).'
  - q: 'The integrating factor of dy/dx + y tan x = sec x is:'
    choices: ['sec x', 'cos x', 'tan x', 'e^(tan x)']
    ans: 0
    why: 'IF = e^(∫ tan x dx) = e^(log sec x) = sec x.'
  - q: 'How many arbitrary constants does the general solution of a third-order equation have?'
    choices: ['1', '2', '3', 'it depends on the degree']
    ans: 2
    why: 'Each integration brings one constant, and a third-order equation needs three integrations: three constants. The degree does not matter.'
sources:
  - 'NCERT Mathematics Class 12 (Differential equations): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Ordinary differential equations'
---

**Maths · Class 12 · about 36 minutes.** By the end you will be able to find the order and degree of any equation, form an equation from a family of curves, recognise and solve the four standard first-order types, and build and solve models of growth, decay, cooling and geometric curves.

<div class="bigidea">A differential equation does not tell you what a quantity is; it tells you how fast it changes. At every point it gives a slope, so solving the equation means finding curves that follow those slopes everywhere. There is a whole family of such curves; one starting value picks out the one you want.</div>

## 1. Order, degree and solutions

The **order** is the order of the highest derivative present. The **degree** is the power of that highest derivative after the equation has been made free of fractional powers and roots of the derivatives. If a derivative sits inside sin, log or eˣ (for example sin(dy/dx)), the degree is **not defined**.

<div class="meaning">
<dl>
<dt>General solution</dt><dd>contains as many arbitrary constants as the order: a whole family of curves</dd>
<dt>Particular solution</dt><dd>one member of the family, fixed by given values such as y(0) = 1</dd>
<dt>Arbitrary constant</dt><dd>independent constants only: y = (A + B)eˣ really has just one constant, A + B</dd>
<dt>Physical meaning</dt><dd>The equation is a rule for the slope at each point. Each solution curve threads its way along those slopes, and the starting point decides which curve you are on.</dd>
</dl>
</div>

<figure class="fig" data-fig="de-slope-field"><figcaption>The dashes are the slopes the equation demands. The bold curve is the particular solution through your starting point; move it to move between members of the family.</figcaption></figure>

<div class="myth">

**"Degree is the highest power anywhere in the equation."** It is the power of the **highest-order derivative** only. In y″ + (y′)⁵ = 0 the degree is 1, not 5. And clear any roots first: y″ = √(1 + y′) becomes (y″)² = 1 + y′, so the degree is 2.

</div>

## 2. Forming a differential equation

To find the equation of a family with n arbitrary constants, differentiate n times and eliminate the constants. Example: the circles x² + y² = 2ax (one constant). Differentiating gives 2x + 2yy′ = 2a. Put a back: x² + y² = x(2x + 2yy′), so **2xyy′ = y² − x²**. Order equals the number of independent constants.

**Verifying a solution**: put the proposed y and its derivatives into the equation and check that both sides agree.

## 3. Variable separable

If dy/dx = f(x)g(y), separate and integrate both sides:

```math
\int \frac{dy}{g(y)} = \int f(x)\,dx + C
```

Example: dy/dx = (1 + y²)/(1 + x²) gives tan⁻¹y = tan⁻¹x + C. Sometimes a substitution makes it separable: for dy/dx = f(ax + by + c), put t = ax + by + c.

**Growth and decay.** dN/dt = kN separates to N = N₀eᵏᵗ: growth for k > 0, decay for k < 0. For decay with half-life T, k = (log 2)/T, and after time t the fraction left is (1/2)^(t/T).

<div class="problem" data-problem="de-decay"></div>

**Newton's law of cooling.** dT/dt = −k(T − Tₛ), where Tₛ is the surrounding temperature. Solution: T − Tₛ = (T₀ − Tₛ)e^(−kt). The **excess** temperature decays exponentially, not the temperature itself.

<div class="problem" data-problem="de-cooling"></div>

## 4. Homogeneous equations

dy/dx = F(x, y) is **homogeneous** when F(λx, λy) = F(x, y), so it depends only on y/x. Put y = vx, so dy/dx = v + x dv/dx, and the equation separates in v and x.

**Worked example.** dy/dx = (x + y)/x = 1 + y/x. With y = vx: v + x dv/dx = 1 + v, so dv = dx/x and v = log|x| + C. **y = x log|x| + Cx.** (This is the fourth choice in the figure.)

For dy/dx = (ax + by + c)/(Ax + By + C) with aB ≠ bA, shift the origin to where the two lines meet (x = X + h, y = Y + k) to make it homogeneous.

## 5. Linear first-order equations

```math
\frac{dy}{dx} + P(x)\,y = Q(x), \qquad \text{IF} = e^{\int P\,dx}, \qquad y \cdot \text{IF} = \int Q \cdot \text{IF}\,dx + C
```

Why it works: multiplying by IF makes the left side exactly the derivative of y·IF, so one integration solves it. Example: dy/dx + y = eˣ has IF = eˣ, so (yeˣ)′ = e²ˣ, giving yeˣ = e²ˣ/2 + C.

If the equation is linear in x instead (dx/dy + P(y)x = Q(y)), swap the roles of x and y. **Bernoulli**: dy/dx + Py = Qyⁿ becomes linear with z = y¹⁻ⁿ.

<div class="problem" data-problem="de-linear"></div>

**Exact-looking forms.** Spot these and integrate at once: x dy + y dx = d(xy); (x dy − y dx)/x² = d(y/x); (x dy − y dx)/(x² + y²) = d(tan⁻¹(y/x)); (x dx + y dy)/(x² + y²) = ½ d(log(x² + y²)).

<div class="myth">

**"The integrating factor of dy/dx + Py = Q is e^P."** It is e^(∫P dx): integrate P first. Also, write the equation in the standard form with coefficient 1 on dy/dx before reading off P. For x dy/dx + 2y = x², divide by x: P = 2/x and IF = x².

</div>

## 6. Curves from tangent properties and orthogonal trajectories

Geometry questions describe a curve by a property of its tangent or normal. Translate with: slope = dy/dx; the tangent at (x, y) meets the x-axis at x − y/y′ and the y-axis at y − xy′; the length of the subnormal is |yy′|.

**Example.** A curve through (1, 2) has the property that its tangent's y-intercept equals the x-coordinate of the point of contact. In symbols, y − xy′ = x. This is linear: y′ − y/x = −1, IF = 1/x, so (y/x)′ = −1/x, giving y/x = −log x + C. At (1, 2), C = 2: **y = x(2 − log x)**.

**Orthogonal trajectories** are curves that cut every member of a family at right angles. Form the family's equation, replace dy/dx by −dx/dy, and solve. For the family y = cx² (with 2y = xy′), the trajectories satisfy 2y = −x/y′, that is 2y dy = −x dx: the ellipses x² + 2y² = k.

## 7. JEE Advanced level: mixing and tanks

**Mixing.** A tank holds V litres of brine; pure water flows in and mixture flows out at r L/min, keeping V fixed. The salt S obeys dS/dt = −(r/V)S, so S = S₀e^(−rt/V). If inflow and outflow rates differ, V changes with time and the equation becomes linear.

**Draining tank** (Torricelli): the outflow speed is √(2gh), so A dh/dt = −a√(2gh), which separates: the time to empty is proportional to √h₀.

Next: [Differential equations: question types and traps](/learn/courses/engineering-entrance/differential-equations-questions/).

<div class="keypoints">

- Order: highest derivative; degree: its power once roots are cleared; undefined if a derivative is inside sin, log, exp.
- The general solution has as many independent constants as the order.
- Form an equation: differentiate once per constant and eliminate.
- Separable: ∫dy/g(y) = ∫f(x)dx. Homogeneous: y = vx. Linear: IF = e^(∫P dx).
- Decay: N = N₀e^(−kt), k = log 2/half-life. Cooling: the excess T − Tₛ decays.
- Tangent intercepts: x − y/y′ and y − xy′.
- Orthogonal trajectories: replace dy/dx by −dx/dy.

</div>
