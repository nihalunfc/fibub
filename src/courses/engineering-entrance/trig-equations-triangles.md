---
title: Trigonometric equations and properties of triangles
seoTitle: 'Trigonometric equations and triangles: JEE maths'
summary: 'Principal values and general solutions, counting and adding solutions in an interval, equations that become quadratics, equations with parameters, trigonometric inequalities, then the sine, cosine and projection rules, half-angle formulae, area, circumradius, inradius and exradii, and heights and distances.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'The general solution of cos x = 1/2 is:'
    choices: ['x = nπ + π/3', 'x = 2nπ ± π/3', 'x = nπ + (−1)ⁿπ/3', 'x = 2nπ + π/3']
    ans: 1
    why: 'Cosine is even and repeats every 2π, so cos x = cos α gives x = 2nπ ± α. Here α = π/3.'
  - q: 'In a triangle, a = 5, b = 7 and C = 60°. Side c is:'
    choices: ['√39', '√109', '6', '√74']
    ans: 0
    why: 'c² = a² + b² − 2ab cos C = 25 + 49 − 35 = 39, so c = √39.'
  - q: 'A triangle with sides 3, 4, 5 has inradius:'
    choices: ['1', '2', '2.5', '1.5']
    ans: 0
    why: 'Area Δ = 6 and s = 6, so r = Δ/s = 1. (The circumradius is half the hypotenuse, 2.5.)'
sources:
  - 'NCERT Mathematics Class 11 (Trigonometric functions) and earlier classes (Applications of trigonometry): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Trigonometry (equations, properties of triangles)'
---

**Maths · Class 11 · about 36 minutes.** By the end you will be able to write the general solution of any standard trigonometric equation, count and add solutions in an interval, handle equations with a parameter, and use the sine, cosine and projection rules with the formulae for area and the three kinds of radius to solve any triangle.

<div class="bigidea">A trigonometric equation has infinitely many solutions because the functions repeat. Find one solution (the principal value), then let the period and the symmetry of the graph generate all the others. A triangle is the opposite case: its three angles add to π, which ties the sides and angles together in a handful of rules.</div>

## 1. Principal value and general solution

The **principal value** is the one solution in the standard range: [−π/2, π/2] for sin and tan, [0, π] for cos. The **general solution** lists every solution using an integer n.

| Equation | General solution (n any integer) |
|---|---|
| sin x = 0 | x = nπ |
| cos x = 0 | x = (2n + 1)π/2 |
| tan x = 0 | x = nπ |
| sin x = sin α | `$x = n\pi + (-1)^n\alpha$` |
| cos x = cos α | `$x = 2n\pi \pm \alpha$` |
| tan x = tan α | `$x = n\pi + \alpha$` |
| sin²x = sin²α (also cos², tan²) | `$x = n\pi \pm \alpha$` |

Why these patterns? Sine takes each value twice per turn, at α and π − α, and the two families join into nπ + (−1)ⁿα. Cosine is symmetric about 0, so the pair is ±α. Tangent takes each value once per π.

<figure class="fig" data-fig="trig-solutions"><figcaption>The curve meets the line y = k at every solution. Change k and the interval and count the crossings; when |k| > 1 the sine and cosine curves never reach the line.</figcaption></figure>

<div class="meaning">
<dl>
<dt>α</dt><dd>the principal value, one known solution</dd>
<dt>n</dt><dd>any integer (…, −2, −1, 0, 1, 2, …); each n gives one more solution</dd>
<dt>Period</dt><dd>2π for sin and cos, π for tan: the step after which the graph repeats</dd>
<dt>Physical meaning</dt><dd>Solving is two jobs: find where the line y = k first crosses the graph, then copy that crossing along the graph using its period and symmetry.</dd>
</dl>
</div>

## 2. Methods for harder equations

- **Factorise.** Move everything to one side and use sum-to-product: sin 5x + sin x = 0 becomes 2 sin 3x cos 2x = 0, so sin 3x = 0 or cos 2x = 0.
- **Quadratic in one function.** 2 sin²x − 3 sin x + 1 = 0 gives sin x = 1 or 1/2. Reject any root outside [−1, 1].
- **a sin x + b cos x = c.** Divide by `$\sqrt{a^2+b^2}$` to get `$\sin(x + \alpha) = c/\sqrt{a^2+b^2}$`. A solution exists only if `$|c| \le \sqrt{a^2+b^2}$`.
- **Equal powers.** For sin⁴x + cos⁴x and similar, use `$\sin^4 x + \cos^4 x = 1 - \tfrac12\sin^2 2x$`.
- **Bounds.** sin x + cos y = 2 forces sin x = 1 and cos y = 1, because neither can exceed 1.

<div class="myth">

**"Squaring both sides is safe."** Squaring sin x = −cos x gives sin²x = cos²x, which also holds when sin x = cos x. Every solution found after squaring must be checked in the original equation. Dividing by cos x without checking cos x = 0 loses solutions the other way.

</div>

**Counting and adding solutions in an interval.** Sketch the graph on the interval, as in the figure, and count crossings. For sums, use the symmetry: the two solutions of sin x = k in one turn add up to π (or 3π for negative k in [π, 2π]).

<div class="problem" data-problem="tri-count"></div>

**Inequalities.** Solve sin x > 1/2 by reading the graph over one period: π/6 < x < 5π/6, then add 2nπ.

**Parameters.** "For which k does sin²x + sin x = k have a solution?" Put t = sin x in [−1, 1]. Then k must lie in the range of t² + t on that interval, which is [−1/4, 2].

## 3. Rules for any triangle

Use the usual notation: angles A, B, C opposite sides a, b, c; R the circumradius; s = (a + b + c)/2 the semi-perimeter; Δ the area.

```math
\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R \qquad \text{(sine rule)}
```

Drag the three corners of the triangle and watch the sides, angles and both rules update.

<figure class="fig" data-fig="@math-triangle-solver"><figcaption>Notice that a/sin A, b/sin B and c/sin C always agree (they equal 2R, the circumdiameter), and that when C is a right angle the cosine rule becomes Pythagoras.</figcaption></figure>

```math
a^2 = b^2 + c^2 - 2bc\cos A \qquad \text{(cosine rule)}, \qquad a = b\cos C + c\cos B \qquad \text{(projection rule)}
```

The cosine rule is Pythagoras with a correction: the term −2bc cos A is zero for a right angle, positive (making a longer) for an obtuse one. The projection rule says side a is the sum of the shadows of b and c on it.

**Which rule when?** Two angles and a side, or two sides and an angle opposite one of them: sine rule. Three sides, or two sides and the angle between them: cosine rule.

<div class="problem" data-problem="tri-cosine"></div>

**The ambiguous case.** Given a, b and A with A acute, the sine rule gives sin B = b sin A / a. If b sin A < a < b, there are two triangles (B and 180° − B both work). If a ≥ b, only one. If a < b sin A, none.

## 4. Half angles, area and radii

```math
\sin\frac{A}{2} = \sqrt{\frac{(s-b)(s-c)}{bc}}, \quad \cos\frac{A}{2} = \sqrt{\frac{s(s-a)}{bc}}, \quad \tan\frac{A}{2} = \sqrt{\frac{(s-b)(s-c)}{s(s-a)}}
```

```math
\Delta = \tfrac12 bc\sin A = \sqrt{s(s-a)(s-b)(s-c)}, \qquad R = \frac{abc}{4\Delta}, \qquad r = \frac{\Delta}{s}, \qquad r_1 = \frac{\Delta}{s-a}
```

<div class="meaning">
<dl>
<dt>r</dt><dd>inradius, the radius of the circle touching all three sides from inside</dd>
<dt>r₁, r₂, r₃</dt><dd>exradii, radii of the circles touching one side and the other two sides extended</dd>
<dt>R</dt><dd>circumradius, the radius of the circle through the three vertices</dd>
<dt>Physical meaning</dt><dd>Joining the incentre to the vertices cuts the triangle into three pieces of height r, so Δ = r(a + b + c)/2 = rs. That is why r = Δ/s.</dd>
</dl>
</div>

Other useful forms: `$r = (s-a)\tan\tfrac{A}{2} = 4R\sin\tfrac A2\sin\tfrac B2\sin\tfrac C2$`, and `$r_1 = s\tan\tfrac A2$`. For a right triangle, R is half the hypotenuse.

**Worked example.** Sides 13, 14, 15. Then s = 21 and Δ = √(21 × 8 × 7 × 6) = 84. So r = 84/21 = 4, R = (13 × 14 × 15)/(4 × 84) = 65/8, and r₁ (opposite the side 13) = 84/8 = 10.5.

<div class="problem" data-problem="tri-inradius"></div>

## 5. Heights and distances

Angles of elevation (looking up) and depression (looking down) are measured from the horizontal. Draw the figure, mark every right angle, and write tan of each angle as height over distance. When two observations share an unknown height, eliminate it between the two equations. When the triangle has no right angle, use the sine rule in it.

<div class="myth">

**"The angle of depression from A to B differs from the angle of elevation from B to A."** They are equal, as alternate angles between two horizontal lines. Mark one, and you have the other.

</div>

<div class="keypoints">

- General solutions: sin, nπ + (−1)ⁿα; cos, 2nπ ± α; tan, nπ + α; squares, nπ ± α.
- Factorise with sum-to-product, reduce to a quadratic in one function, and reject roots outside [−1, 1].
- a sin x + b cos x = c has a solution only if |c| ≤ √(a² + b²).
- Check every root after squaring; never divide by a factor that can be zero.
- Sine rule a/sin A = 2R; cosine rule a² = b² + c² − 2bc cos A; projection a = b cos C + c cos B.
- Δ = ½bc sin A = √(s(s − a)(s − b)(s − c)); R = abc/4Δ; r = Δ/s; r₁ = Δ/(s − a).

</div>
