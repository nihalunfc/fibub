---
title: Trigonometric functions and identities
seoTitle: 'Trigonometric functions and identities: JEE maths'
summary: 'Radian measure, the six ratios on the unit circle, signs by quadrant, allied angles, graphs and periods, compound, multiple and half angles, sum-to-product formulae, identities in a triangle, greatest and least values, and the product and series tricks JEE Advanced uses.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'What is the value of cos 240°?'
    choices: ['1/2', '−1/2', '√3/2', '−√3/2']
    ans: 1
    why: '240° = 180° + 60° is in the third quadrant, where cosine is negative. The reference angle is 60°, so cos 240° = −cos 60° = −1/2.'
  - q: 'The smallest positive period of sin 3x is:'
    choices: ['3π', 'π/3', '2π/3', '2π']
    ans: 2
    why: 'sin repeats every 2π. sin 3x repeats when 3x grows by 2π, that is when x grows by 2π/3.'
  - q: 'The greatest value of 5 sin x − 12 cos x is:'
    choices: ['17', '13', '7', '12']
    ans: 1
    why: 'a sin x + b cos x swings between −√(a² + b²) and √(a² + b²). Here √(25 + 144) = 13.'
sources:
  - 'NCERT Mathematics Class 11 (Trigonometric functions): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Trigonometry'
---

**Maths · Class 11 · about 36 minutes.** By the end you will be able to move between degrees and radians, find any ratio of any angle without a table, draw and read the graphs of the six functions, use the compound, multiple and sum-to-product formulae fluently, and find greatest and least values, which is where most JEE trigonometry marks are won.

<div class="bigidea">Trigonometry is the geometry of a point going round a circle of radius 1. Its x-coordinate is cos θ and its y-coordinate is sin θ. Every sign rule, every allied-angle formula and every period comes from watching that point move.</div>

## 1. Measuring angles: radians

One radian is the angle at the centre of a circle when the arc is as long as the radius. A full turn holds 2π radians, so

```math
\pi \text{ rad} = 180^\circ, \qquad 1 \text{ rad} \approx 57.3^\circ, \qquad s = r\theta \;(\theta \text{ in radians})
```

Radians are not just another unit. They make the arc formula `$s = r\theta$` and the area of a sector `$\tfrac12 r^2\theta$` work with no extra factors, and calculus needs them (the limit `$\sin x / x \to 1$` is true only in radians).

<div class="problem" data-problem="trg-arc"></div>

## 2. The six functions on the unit circle

Put a point P on the circle `$x^2 + y^2 = 1$`, at angle θ measured anticlockwise from the positive x-axis. Then

```math
\cos\theta = x, \quad \sin\theta = y, \quad \tan\theta = \frac{y}{x}, \quad \sec\theta = \frac1x, \quad \operatorname{cosec}\theta = \frac1y, \quad \cot\theta = \frac{x}{y}
```

Since P is on the circle, `$\sin^2\theta + \cos^2\theta = 1$`. Dividing by `$\cos^2\theta$` and by `$\sin^2\theta$` gives `$1 + \tan^2\theta = \sec^2\theta$` and `$1 + \cot^2\theta = \operatorname{cosec}^2\theta$`.

<figure class="fig" data-fig="unit-circle"><figcaption>P goes round the unit circle. Its height is sin θ, its horizontal position is cos θ, and the point where OP meets the line x = 1 gives tan θ. On the right the angle is unrolled into the graphs.</figcaption></figure>

<div class="meaning">
<dl>
<dt>θ</dt><dd>the angle, measured anticlockwise from the positive x-axis (clockwise angles are negative)</dd>
<dt>sin θ, cos θ</dt><dd>the y and x coordinates of P on the circle of radius 1, so both stay between −1 and 1</dd>
<dt>tan θ</dt><dd>the slope of OP; it is not defined when OP is vertical (θ = 90°, 270°)</dd>
<dt>Reference angle</dt><dd>the acute angle OP makes with the x-axis; it fixes the size of every ratio</dd>
<dt>Physical meaning</dt><dd>Two angles with the same reference angle give ratios of the same size. Only the quadrant decides the sign.</dd>
</dl>
</div>

**Signs by quadrant.** In quadrant I all ratios are positive; in II only sin (and cosec); in III only tan (and cot); in IV only cos (and sec). Drag the slider in the figure and watch the coloured bars flip.

**Allied angles.** For angles like 90° ± θ, 180° ± θ, 270° ± θ, 360° − θ: write the sign the original function has in that quadrant (treat θ as small and acute), then keep the function name for 180° and 360°, and switch it to its co-function (sin ↔ cos, tan ↔ cot, sec ↔ cosec) for 90° and 270°. So `$\sin(180^\circ + \theta) = -\sin\theta$` and `$\cos(270^\circ - \theta) = -\sin\theta$`.

<div class="myth">

**"sin 2θ is twice sin θ."** No. The function is not a multiplier: sin 60° = 0.866, but 2 sin 30° = 1. The correct rule is sin 2θ = 2 sin θ cos θ.

</div>

## 3. Graphs, ranges and periods

| Function | Range | Period | Not defined at |
|---|---|---|---|
| sin x, cos x | [−1, 1] | 2π | nowhere |
| tan x, cot x | all reals | π | tan: odd multiples of π/2; cot: multiples of π |
| sec x, cosec x | (−∞, −1] ∪ [1, ∞) | 2π | where cos or sin is zero |

Rules for periods: sin(kx) has period 2π/|k|. |sin x| and sin²x have period π, because the negative half becomes a copy of the positive half. The period of a sum is the LCM of the periods, but check for a smaller one: |sin x| + |cos x| has period π/2, not π.

## 4. Compound angles

```math
\sin(A \pm B) = \sin A\cos B \pm \cos A\sin B, \qquad \cos(A \pm B) = \cos A\cos B \mp \sin A\sin B
```

```math
\tan(A \pm B) = \frac{\tan A \pm \tan B}{1 \mp \tan A\tan B}
```

Two handy results: `$\sin(A+B)\sin(A-B) = \sin^2 A - \sin^2 B$` and `$\cos(A+B)\cos(A-B) = \cos^2 A - \sin^2 B$`. From these come exact values such as `$\sin 15^\circ = \tfrac{\sqrt6 - \sqrt2}{4}$` and `$\tan 75^\circ = 2 + \sqrt3$`.

<div class="problem" data-problem="trg-compound"></div>

## 5. Multiple and half angles

```math
\sin 2A = 2\sin A\cos A = \frac{2\tan A}{1+\tan^2 A}, \qquad \cos 2A = \cos^2 A - \sin^2 A = 1 - 2\sin^2 A = 2\cos^2 A - 1
```

```math
\sin 3A = 3\sin A - 4\sin^3 A, \qquad \cos 3A = 4\cos^3 A - 3\cos A, \qquad \tan 3A = \frac{3\tan A - \tan^3 A}{1 - 3\tan^2 A}
```

Read `$1 - \cos 2A = 2\sin^2 A$` and `$1 + \cos 2A = 2\cos^2 A$` backwards whenever you see 1 ± cos: they turn a sum into a square. Also `$\sin 18^\circ = \tfrac{\sqrt5 - 1}{4}$` and `$\cos 36^\circ = \tfrac{\sqrt5 + 1}{4}$`, which come from 2θ = 90° − 3θ with θ = 18°.

## 6. Sum to product and back

```math
\sin C + \sin D = 2\sin\frac{C+D}{2}\cos\frac{C-D}{2}, \qquad \cos C + \cos D = 2\cos\frac{C+D}{2}\cos\frac{C-D}{2}
```

```math
\sin C - \sin D = 2\cos\frac{C+D}{2}\sin\frac{C-D}{2}, \qquad \cos C - \cos D = -2\sin\frac{C+D}{2}\sin\frac{C-D}{2}
```

Going the other way, `$2\sin A\cos B = \sin(A+B) + \sin(A-B)$` and `$2\sin A\sin B = \cos(A-B) - \cos(A+B)$`. Use sum-to-product to factor an equation; use product-to-sum to add up a series.

**Worked example.** Show that `$\cos 20^\circ \cos 40^\circ \cos 80^\circ = \tfrac18$`. Multiply and divide by `$2\sin 20^\circ$` and use `$2\sin A\cos A = \sin 2A$` three times: the top becomes `$\sin 160^\circ / 4 = \sin 20^\circ / 4$` over `$2\sin 20^\circ$`, which is 1/8. In general

```math
\cos A\cos 2A\cos 4A\cdots\cos 2^{n-1}A = \frac{\sin 2^n A}{2^n \sin A}
```

## 7. Identities in a triangle (conditional identities)

When A + B + C = π, each angle is π minus the other two, so `$\sin(A+B) = \sin C$`, `$\cos(A+B) = -\cos C$`, and

```math
\tan A + \tan B + \tan C = \tan A\tan B\tan C, \qquad \sin 2A + \sin 2B + \sin 2C = 4\sin A\sin B\sin C
```

Prove such identities by changing the first two terms with sum-to-product, then replacing A + B by π − C.

## 8. Greatest and least values (JEE favourite)

- `$a\sin x + b\cos x$` lies between `$-\sqrt{a^2+b^2}$` and `$\sqrt{a^2+b^2}$`, because it equals `$\sqrt{a^2+b^2}\,\sin(x+\alpha)$`.
- For expressions in one ratio, substitute t = sin x (with −1 ≤ t ≤ 1) and find the range of the resulting quadratic on that interval, not on all reals.
- `$a^2\sec^2 x + b^2\operatorname{cosec}^2 x \ge (a+b)^2$` and `$\tan^2 x + \cot^2 x \ge 2$` follow from AM ≥ GM.
- In a triangle, products like cos A cos B cos C are largest (1/8) when the triangle is equilateral.

<div class="problem" data-problem="trg-maxmin"></div>

<div class="myth">

**"sin²x + sin x has least value 0, because squares are never negative."** With t = sin x, t² + t = (t + 1/2)² − 1/4, and t = −1/2 is allowed, so the least value is −1/4. Always find the vertex and check it lies in [−1, 1].

</div>

**Series in AP angles.** For angles in arithmetic progression,

```math
\sum_{k=0}^{n-1}\sin(\alpha + k\beta) = \frac{\sin\frac{n\beta}{2}}{\sin\frac{\beta}{2}}\,\sin\!\left(\alpha + \frac{(n-1)\beta}{2}\right)
```

and the same with cos on both sides. It comes from multiplying by `$2\sin\tfrac\beta2$` and letting product-to-sum telescope.

<div class="keypoints">

- π rad = 180°; s = rθ and the sector area ½r²θ need θ in radians.
- cos θ and sin θ are the coordinates of a point on the unit circle; sin²θ + cos²θ = 1.
- Signs: all, sin, tan, cos in quadrants I to IV. Allied angles keep the name at 180° and 360°, switch to the co-function at 90° and 270°.
- sin kx has period 2π/|k|; |sin x| and sin²x have period π.
- Learn the compound, double, triple and sum-to-product formulae both ways.
- a sin x + b cos x ranges over [−√(a² + b²), √(a² + b²)]; for one-ratio expressions, keep the variable inside [−1, 1].
- Products cos A cos 2A … cos 2ⁿ⁻¹A: multiply by 2 sin A and fold.

</div>
