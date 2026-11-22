---
title: Quadratic equations and inequalities
seoTitle: 'Quadratic equations and inequalities: JEE maths'
summary: 'Roots and the discriminant, sum and product of roots, symmetric expressions, forming new equations, common roots, the location of roots with respect to a number, the range of quadratic expressions, sign schemes for inequalities, and equations with modulus and greatest integer.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'For which k does x² − 4x + k = 0 have two distinct real roots?'
    choices: ['k < 4', 'k > 4', 'k = 4', 'all k']
    ans: 0
    why: 'D = 16 − 4k > 0 gives k < 4. At k = 4 the roots are equal; above 4 they are complex.'
  - q: 'If α and β are the roots of x² − 5x + 6 = 0, what is α² + β²?'
    choices: ['13', '25', '37', '1']
    ans: 0
    why: 'α + β = 5, αβ = 6, so α² + β² = (α + β)² − 2αβ = 25 − 12 = 13. (The roots are 2 and 3: 4 + 9 = 13.)'
  - q: 'The solution of (x − 1)(x − 3) < 0 is:'
    choices: ['x < 1 or x > 3', '1 < x < 3', 'x < 3', 'no real x']
    ans: 1
    why: 'An upward parabola is negative only between its roots, so 1 < x < 3.'
sources:
  - 'NCERT Mathematics Class 10 and 11 (Quadratic equations; Complex numbers and quadratic equations; Linear inequalities): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Complex numbers and quadratic equations'
---

**Maths · Class 11 · about 34 minutes.** By the end you will be able to read the nature of roots from the coefficients, work with symmetric functions of roots, place roots relative to any number, find the range of a quadratic expression and solve quadratic inequalities, including the parameter questions JEE Advanced loves.

<div class="bigidea">A quadratic is a parabola. Its roots are where the parabola meets the x-axis, and almost every question in this chapter (nature of roots, location of roots, inequalities, range) is answered by picturing that parabola: which way it opens, where its vertex is, and where it crosses.</div>

## 1. Roots and the discriminant

For `$ax^2 + bx + c = 0$` (a ≠ 0), the roots are

```math
x = \frac{-b \pm \sqrt{D}}{2a}, \qquad D = b^2 - 4ac
```

| D | Roots (real coefficients) | Parabola |
|---|---|---|
| D > 0 | two different real roots | crosses the x-axis twice |
| D = 0 | one repeated real root −b/2a | touches the x-axis |
| D < 0 | two complex conjugate roots | never meets the x-axis |

Step through the pictures and then change b and x with the sliders.

<div class="steps" data-fig="@math-complete-square">
<div class="step"><p><b>The picture.</b> x² is a square of side x, and bx is a strip of area bx.</p></div>
<div class="step"><p><b>Cut and wrap.</b> Cut the strip in half and wrap the halves round two sides of the square.</p></div>
<div class="step"><p><b>The corner.</b> A small corner of area (b/2)² is missing; add it.</p></div>
<div class="step"><p><b>A perfect square.</b> The big square has side x + b/2, so x² + bx + (b/2)² = (x + b/2)².</p></div>
</div>

With rational coefficients, the roots are rational exactly when D is a perfect square; irrational roots come in pairs `$p \pm \sqrt{q}$`, and complex ones in pairs `$p \pm iq$` (for real coefficients).

Move the sliders and watch the roots, the vertex and the discriminant:

<figure class="fig" data-fig="parabola-roots"><figcaption>y = ax² + bx + c. The dots are the real roots, the black dot the vertex, and the dashed line x = k is for location-of-roots questions.</figcaption></figure>

## 2. Sum and product of roots

```math
\alpha + \beta = -\frac{b}{a}, \qquad \alpha\beta = \frac{c}{a}
```

<div class="meaning">
<dl>
<dt>α, β</dt><dd>the two roots (real or complex)</dd>
<dt>Symmetric expression</dt><dd>one that stays the same when α and β are swapped, such as α² + β² or 1/α + 1/β</dd>
<dt>Physical meaning</dt><dd>You never need the roots themselves to work out a symmetric expression: write it in terms of α + β and αβ, read straight off the coefficients.</dd>
</dl>
</div>

Useful forms: `$\alpha^2 + \beta^2 = (\alpha+\beta)^2 - 2\alpha\beta$`, `$(\alpha - \beta)^2 = (\alpha+\beta)^2 - 4\alpha\beta$`, `$\alpha^3 + \beta^3 = (\alpha+\beta)^3 - 3\alpha\beta(\alpha+\beta)$`. For powers, use the recurrence `$S_{n} = -\tfrac{b}{a} S_{n-1} - \tfrac{c}{a} S_{n-2}$` where `$S_n = \alpha^n + \beta^n$`.

<div class="problem" data-problem="root-sum"></div>

**New equations from old.** The equation with roots α and β is `$x^2 - (\alpha+\beta)x + \alpha\beta = 0$`. To get roots 1/α, 1/β, replace x by 1/x; for roots α + k, β + k, replace x by x − k; for kα, kβ, replace x by x/k.

**Common roots.** If `$a_1x^2 + b_1x + c_1 = 0$` and `$a_2x^2 + b_2x + c_2 = 0$` share exactly one root, then

```math
(c_1a_2 - c_2a_1)^2 = (b_1c_2 - b_2c_1)(a_1b_2 - a_2b_1)
```

and they share both roots when `$a_1/a_2 = b_1/b_2 = c_1/c_2$`.

## 3. Location of roots (JEE Main and Advanced)

Questions ask: for which values of a parameter do both roots exceed k, lie between k₁ and k₂, or lie on opposite sides of k? Picture the parabola with a > 0 (divide through by a if needed) and use three checks:

| Condition | Discriminant | Value at k | Vertex |
|---|---|---|---|
| Both roots greater than k | D ≥ 0 | f(k) > 0 | −b/2a > k |
| Both roots less than k | D ≥ 0 | f(k) > 0 | −b/2a < k |
| k between the roots | (automatic) | f(k) < 0 | (not needed) |
| Both roots in (k₁, k₂) | D ≥ 0 | f(k₁) > 0 and f(k₂) > 0 | k₁ < −b/2a < k₂ |
| Exactly one root in (k₁, k₂) | | f(k₁)·f(k₂) < 0 | |

(For a < 0, use a·f(k) instead of f(k).) Change the test line in the figure above and watch a·f(k) change sign as k passes a root.

<div class="myth">

**"If f(k) > 0, then both roots are on one side of k, so I'm done."** f(k) > 0 alone also happens when there are no real roots, or both roots are on the other side. You need all three checks: D ≥ 0, the sign of a·f(k), and the vertex.

</div>

## 4. Range and sign of a quadratic

- `$ax^2 + bx + c > 0$` for **all** real x ⇔ a > 0 and D < 0. It is ≥ 0 for all x ⇔ a > 0 and D ≤ 0.
- The extreme value is at the vertex: `$f(-b/2a) = -D/4a$`, a minimum if a > 0, a maximum if a < 0.
- **Range of a rational expression** `$y = \dfrac{p(x)}{q(x)}$` with quadratics: rearrange into a quadratic in x with y as a parameter, and require its discriminant ≥ 0 (x must be real).

Slide a, b, h and k to move, stretch and flip the graph of y = a·f(b(x − h)) + k, and try the |f(x)| and f(|x|) modes.

<figure class="fig" data-fig="@math-fn-transform"><figcaption>Notice that changes inside the brackets (b and h) act sideways and 'backwards', changes outside (a and k) act vertically and as you would expect.</figcaption></figure>

## 5. Inequalities: the sign scheme

To solve `$\dfrac{(x-1)(x+2)^2}{(x-3)} \le 0$`:

<div class="steps">
<div class="step"><b>Mark the critical points</b> on a number line: zeros of the top (1, −2) and of the bottom (3, never allowed).</div>
<div class="step"><b>Start on the far right</b> with the sign of the leading terms (here +), then move left, changing sign at each point that comes from an odd power.</div>
<div class="step"><b>Do not change sign at even powers</b>: (x + 2)² keeps the sign across −2, but x = −2 itself makes the expression zero.</div>
<div class="step"><b>Read off the answer.</b> Signs: + for x > 3, − on (1, 3), + on (−2, 1) and on (−∞, −2). So ≤ 0 holds on [1, 3) together with the single point x = −2.</div>
</div>

**Modulus and greatest integer.** For |x|, split into cases x ≥ 0 and x < 0 (or set t = |x| when the equation is in x² and |x|, since x² = |x|²). For [x], write x = n + f with integer n and 0 ≤ f < 1, or note that [x] = n means n ≤ x < n + 1.

<div class="keypoints">

- D = b² − 4ac decides the nature of roots; real-coefficient complex roots come in conjugate pairs.
- α + β = −b/a, αβ = c/a; rewrite every symmetric expression in these.
- New equation x² − (sum)x + product = 0; transform roots by substituting for x.
- Location of roots: check D ≥ 0, the sign of a·f(k) and the vertex −b/2a against k.
- ax² + bx + c > 0 for all x ⇔ a > 0, D < 0; extreme value −D/4a at x = −b/2a.
- Inequalities: sign scheme from the right; signs flip only at odd-power factors; exclude zeros of the denominator.

</div>
