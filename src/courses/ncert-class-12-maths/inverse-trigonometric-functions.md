---
title: Inverse Trigonometric Functions
seoTitle: 'Inverse Trigonometric Functions Class 12 notes'
summary: 'Class 12 Inverse Trigonometric Functions with animations: principal value branches, graphs as mirror images, sin⁻¹(sin x), sum and double-angle formulas.'
minutes: 75
updated: 2026-11-22
quiz:
  - q: 'The principal value of sin⁻¹(sin 5π/6) is:'
    choices: ['π/6', '5π/6', '−π/6', '−5π/6']
    ans: 0
    why: 'sin(5π/6) = 1/2, and the angle in [−π/2, π/2] with sine 1/2 is π/6. The input 5π/6 is outside the principal range, so it is not returned.'
  - q: 'sin⁻¹x + cos⁻¹x, for x in [−1, 1], equals:'
    choices: ['π/2', 'π', '0', 'x']
    ans: 0
    why: 'The two angles are the acute angles of a right triangle, which add up to π/2 (a right angle).'
  - q: 'The range of cos⁻¹ (its principal value branch) is:'
    choices: ['[0, π]', '[−π/2, π/2]', '(0, π)', '[0, 2π]']
    ans: 0
    why: 'Cosine is one-one and takes every value in [−1, 1] on [0, π], so that interval is chosen.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 2 “Inverse Trigonometric Functions” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Principal value branches and identities: standard results in trigonometry (e.g. Abramowitz and Stegun, Handbook of Mathematical Functions, section 4.4); every numerical example was recomputed in code.'
---

**Maths · Class 12 · Chapter 2 · about 75 minutes.** By the end you will be able to explain why the inverse trigonometric functions need a restricted branch, state the domain and range of all six, find principal values, simplify `$\sin^{-1}(\sin x)$` and similar expressions, and use the sum, complement and double-angle properties.

<div class="bigidea">Sine, cosine and the others repeat, so they are not one-one and have no inverse function. Cut each one down to a single piece where it is one-one and covers all its values (the principal branch), and the reflected piece is a genuine function. The six inverse functions are those reflected pieces. Every rule in this chapter comes from that picture or from a right triangle.</div>

## 1. Why we need a branch

The inverse trig functions answer "which angle has this sine?" But many angles share one sine: `$30°$`, `$150°$`, `$390°$` and so on all give `$1/2$`. A function must give **one** answer, so we cannot invert sine on the whole real line. Slide the horizontal line across the sine curve and count how many times it meets it. Then restrict the domain to `$[-\pi/2, \pi/2]$` and try again.

<figure class="fig" data-fig="c12m-itrig-onetoone"><figcaption>On all of ℝ the line meets sine many times: not one-one. On [−π/2, π/2] it meets once: one-one, so an inverse exists. Cut the domain, then invert.</figcaption></figure>

If a satnav had to give "the" road from Delhi to Jaipur and there were six equally good ones, it would pick a convention. The principal branch is mathematicians' convention: pick the piece around the origin when possible, and pick it so every value in `$[-1, 1]$` (or every real) is reached once.

## 2. The six functions and their principal branches

For each trigonometric function we choose an interval on which it is one-one and onto its range. The inverse then has that interval as its **range** and the original range as its **domain**.

| Function | Domain | Range (principal value branch) |
|---|---|---|
| `$\sin^{-1}x$` | `$[-1, 1]$` | `$[-\pi/2, \pi/2]$` |
| `$\cos^{-1}x$` | `$[-1, 1]$` | `$[0, \pi]$` |
| `$\tan^{-1}x$` | `$\mathbb{R}$` | `$(-\pi/2, \pi/2)$` |
| `$\cot^{-1}x$` | `$\mathbb{R}$` | `$(0, \pi)$` |
| `$\sec^{-1}x$` | `$\lvert x \rvert \ge 1$` | `$[0, \pi] \setminus \{\pi/2\}$` |
| `$\operatorname{cosec}^{-1}x$` | `$\lvert x \rvert \ge 1$` | `$[-\pi/2, \pi/2] \setminus \{0\}$` |

Pick a function in the figure below. The pale curve is the whole trig function, the bold blue piece is the principal branch, and the reflect slider swings it over the line `$y = x$` into its inverse. (Graph of `$f^{-1}$` is always the mirror image of the graph of `$f$`, exactly as in Chapter 1.)

<figure class="fig" data-fig="c12m-itrig-branch"><figcaption>The principal branch of each trigonometric function and its reflection in y = x. Slide Reflect from 0 to 100% to turn the branch into the inverse function.</figcaption></figure>

<div class="meaning">
<dl>
<dt>`$y = \sin^{-1}x$`</dt><dd>means `$\sin y = x$` with `$y$` in the principal range. It is an **angle** in radians, never a ratio.</dd>
<dt>Principal value</dt><dd>the one value in the principal range. Other angles with the same sine are not the answer.</dd>
<dt>Domain and range swap</dt><dd>the inputs of the inverse are the outputs of the original, and vice versa.</dd>
</dl>
</div>

A memory trick: the ranges for sin, tan and cosec are centred on 0 (`$-\pi/2$` to `$\pi/2$`); the ranges for cos, cot and sec are measured from 0 up to π.

<div class="myth">

**"sin⁻¹x means 1/sin x."** Never. `$\sin^{-1}x$` is the inverse function (an angle); `$1/\sin x$` is `$\operatorname{cosec}x$`, a ratio. Compare the two graphs: one lives on `$[-1, 1]$` and rises gently, the other blows up near 0. Write `$(\sin x)^{-1}$` when you mean the reciprocal.

</div>

<figure class="fig" data-fig="c12m-itrig-wrong"><figcaption>sin⁻¹x and 1/sin x are different functions. Slide x to compare their values; sin⁻¹ has no value past 1.</figcaption></figure>

## 3. Finding principal values

The method is the same each time: ask "which angle in the principal range has this value?" The unit circle makes it concrete. Drag the value and switch the function: the bold radius is the principal angle, and the faded one is the other angle with the same sine (or cosine, or tangent), which is *not* the answer because it lies outside the shaded half.

<figure class="fig" data-fig="c12m-itrig-circle"><figcaption>The principal angle for sin⁻¹, cos⁻¹ and tan⁻¹ on the unit circle. Shaded: the half of the circle allowed as the answer. Faded point: the other angle with the same value.</figcaption></figure>

Worked examples:

- `$\sin^{-1}\left(-\tfrac{\sqrt3}{2}\right) = -\tfrac{\pi}{3}$`, since `$\sin(-\pi/3) = -\sqrt3/2$` and `$-\pi/3 \in [-\pi/2, \pi/2]$`.
- `$\cos^{-1}\left(-\tfrac12\right) = \tfrac{2\pi}{3}$`, because cosine is negative in the second quadrant and the range is `$[0, \pi]$`.
- `$\tan^{-1}(-1) = -\tfrac{\pi}{4}$`, not `$\tfrac{3\pi}{4}$`.
- `$\cot^{-1}(\sqrt3) = \tfrac{\pi}{6}$`, using the range `$(0, \pi)$`.
- `$\sec^{-1}(2) = \tfrac{\pi}{3}$`, since `$\cos\theta = 1/2$`; and `$\operatorname{cosec}^{-1}(-2) = -\tfrac{\pi}{6}$`.

The tricky ones are when a trig function sits *inside* the inverse and the angle is outside the branch. Evaluate `$\sin^{-1}(\sin\tfrac{5\pi}{6})$`:

<div class="steps" data-fig="c12m-itrig-evalsteps">
<div class="step">Start with the angle 5π/6 (150°), in the upper left of the circle.</div>
<div class="step">Its sine is the height of the point: sin(5π/6) = 1/2.</div>
<div class="step">Now ask for the angle in [−π/2, π/2] with sine 1/2. The same height is also reached at π/6 on the right half.</div>
<div class="step">π/6 is in the shaded range, so sin⁻¹(sin 5π/6) = π/6, not 5π/6.</div>
<div class="step">Rule for x in [π/2, 3π/2]: sin⁻¹(sin x) = π − x. Here π − 5π/6 = π/6.</div>
</div>

<div class="problem" data-problem="c12m-itrig-sinsin"></div>

<div class="problem" data-problem="c12m-itrig-coscos"></div>

Practise with the interactive calculator, which shows the branch and the principal value together. It works well with the [Unit Circle](/learn/unit-circle/) tool.

<!--fig:tool inverse-trig-->

## 4. Properties of inverse trigonometric functions

### 4.1 Function and its inverse

Because inverse functions undo each other, `$\sin(\sin^{-1}x) = x$` for `$x \in [-1, 1]$`, and `$\sin^{-1}(\sin x) = x$` for `$x \in [-\pi/2, \pi/2]$`. In the same way `$\cos(\cos^{-1}x) = x$` on `$[-1, 1]$`, `$\cos^{-1}(\cos x) = x$` on `$[0, \pi]$`, `$\tan(\tan^{-1}x) = x$` for all real `$x$` and `$\tan^{-1}(\tan x) = x$` on `$(-\pi/2, \pi/2)$`. Outside these intervals one of them breaks. Pick a composite and drag the probe to see where the graph follows `$y = x$` and where it zig-zags.

<figure class="fig" data-fig="c12m-itrig-compose"><figcaption>Graphs of six composites. sin⁻¹(sin x) is a saw-tooth that equals x only inside [−π/2, π/2]. sin(sin⁻¹x) is the line y = x but exists only on [−1, 1].</figcaption></figure>

<div class="myth">

**"sin(sin⁻¹ 2) = 2."** `$\sin^{-1}2$` does not exist (2 is outside `$[-1, 1]$`), so the whole expression is undefined. The "cancel" works only on the domain of the inner function.

</div>

### 4.2 Negative inputs

Sine, tangent and cosecant are odd functions, so their inverses are odd; cosine, cotangent and secant flip about `$\pi/2$`:

```math
\sin^{-1}(-x) = -\sin^{-1}x,\quad \tan^{-1}(-x) = -\tan^{-1}x,\quad \operatorname{cosec}^{-1}(-x) = -\operatorname{cosec}^{-1}x
```

```math
\cos^{-1}(-x) = \pi - \cos^{-1}x,\quad \cot^{-1}(-x) = \pi - \cot^{-1}x,\quad \sec^{-1}(-x) = \pi - \sec^{-1}x
```

For example `$\cos^{-1}(-\tfrac12) = \pi - \tfrac{\pi}{3} = \tfrac{2\pi}{3}$`.

### 4.3 Reciprocals

For `$\lvert x \rvert \ge 1$`: `$\sin^{-1}\tfrac1x = \operatorname{cosec}^{-1}x$`, `$\cos^{-1}\tfrac1x = \sec^{-1}x$`. For `$x > 0$`: `$\tan^{-1}\tfrac1x = \cot^{-1}x$`. They follow from `$\operatorname{cosec}\theta = 1/\sin\theta$`: if `$\sin\theta = 1/x$` then `$\operatorname{cosec}\theta = x$`.

### 4.4 Complementary angles

```math
\sin^{-1}x + \cos^{-1}x = \frac{\pi}{2}\ (x \in [-1, 1]),\qquad \tan^{-1}x + \cot^{-1}x = \frac{\pi}{2}\ (x \in \mathbb{R}),\qquad \sec^{-1}x + \operatorname{cosec}^{-1}x = \frac{\pi}{2}\ (\lvert x \rvert \ge 1)
```

The first: if `$\theta = \sin^{-1}x$` then `$x = \sin\theta = \cos(\pi/2 - \theta)$`, and `$\pi/2 - \theta$` is in `$[0, \pi]$`, so `$\cos^{-1}x = \pi/2 - \theta$`. Slide `$x$` below; the two curves are mirror images about the level `$\pi/4$`, so their sum is always `$\pi/2$`.

<figure class="fig" data-fig="c12m-itrig-complement"><figcaption>sin⁻¹x and cos⁻¹x add to π/2 for every x in [−1, 1]. The sum curve is a flat line.</figcaption></figure>

<div class="problem" data-problem="c12m-itrig-compl"></div>

### 4.5 Using a right triangle

To find `$\cos(\sin^{-1}\tfrac45)$`, let `$\theta = \sin^{-1}\tfrac45$`. Then `$\sin\theta = 4/5$`: draw a right triangle with opposite side 4 and hypotenuse 5, so the adjacent side is 3 and `$\cos\theta = 3/5$`. This works whenever the angle is in the first quadrant; for negative inputs use the principal range to choose signs.

<div class="problem" data-problem="c12m-itrig-cossin"></div>

### 4.6 Sum and difference of inverse tangents

```math
\tan^{-1}x + \tan^{-1}y = \tan^{-1}\frac{x + y}{1 - xy}\quad (xy < 1)
```

```math
\tan^{-1}x - \tan^{-1}y = \tan^{-1}\frac{x - y}{1 + xy}\quad (xy > -1)
```

If `$xy > 1$` with `$x, y > 0$` the sum passes `$\pi/2$`, and the formula gives a negative angle that is too small by `$\pi$`: add `$\pi$`. With `$x, y < 0$` subtract `$\pi$`. The picture shows why: the numbers `$1 + ix$` and `$1 + iy$` point at angles `$\tan^{-1}x$` and `$\tan^{-1}y$`; multiplying them gives `$(1 - xy) + i(x + y)$`, which points at the *sum* of the angles. When `$xy > 1$` the real part `$1 - xy$` turns negative.

<figure class="fig" data-fig="c12m-itrig-tansum"><figcaption>Two arrows 1 + ix and 1 + iy and their product, whose angle is the sum. Push xy above 1 and the arrow swings into the second quadrant, so the formula needs ±π.</figcaption></figure>

Worked example. `$\tan^{-1}\tfrac12 + \tan^{-1}\tfrac13$`: here `$xy = \tfrac16 < 1$` and `$\tfrac{x+y}{1-xy} = \tfrac{5/6}{5/6} = 1$`, so the sum is `$\tan^{-1}1 = \tfrac{\pi}{4}$`. And `$\tan^{-1}2 + \tan^{-1}3$` has `$xy = 6 > 1$`: the formula gives `$\tan^{-1}(-1) = -\tfrac{\pi}{4}$`, so add `$\pi$` to get `$\tfrac{3\pi}{4}$`.

<div class="problem" data-problem="c12m-itrig-tansum"></div>

### 4.7 Double angle forms

Let `$\theta = \tan^{-1}x$`, so `$x = \tan\theta$`. Build the right triangle for `$2\theta$` using the identities `$\sin 2\theta = \tfrac{2x}{1+x^2}$`, `$\cos 2\theta = \tfrac{1-x^2}{1+x^2}$` and `$\tan 2\theta = \tfrac{2x}{1-x^2}$`:

<div class="steps" data-fig="c12m-itrig-double">
<div class="step">Let θ = tan⁻¹x, so tan θ = x: a right triangle with legs 1 and x (drawn for x = 0.75).</div>
<div class="step">sin θ = x/√(1+x²) and cos θ = 1/√(1+x²). So sin 2θ = 2 sin θ cos θ = 2x/(1+x²).</div>
<div class="step">The triangle for 2θ has hypotenuse 1 + x², opposite side 2x and adjacent side 1 − x². Check with Pythagoras.</div>
<div class="step">So sin 2θ = 2x/(1+x²), cos 2θ = (1−x²)/(1+x²) and tan 2θ = 2x/(1−x²).</div>
<div class="step">For |x| ≤ 1, 2θ is in [−π/2, π/2], so 2tan⁻¹x = sin⁻¹(2x/(1+x²)). For x ≥ 0, it is also cos⁻¹((1−x²)/(1+x²)).</div>
</div>

Summary, with the conditions that keep `$2\theta$` in the right branch:

```math
2\tan^{-1}x = \sin^{-1}\frac{2x}{1+x^2}\ (\lvert x\rvert \le 1) = \cos^{-1}\frac{1-x^2}{1+x^2}\ (x \ge 0) = \tan^{-1}\frac{2x}{1-x^2}\ (\lvert x\rvert < 1)
```

<div class="problem" data-problem="c12m-itrig-double"></div>

### 4.8 Simplifying by substitution

A trick that powers many board questions: replace `$x$` by a trig function that makes the root or fraction collapse. Simplify `$\tan^{-1}\dfrac{\sqrt{1+x^2} - 1}{x}$`, `$x \ne 0$`. Put `$x = \tan\theta$` with `$\theta \in (-\pi/2, \pi/2)$`. Then `$\sqrt{1+x^2} = \sec\theta$` (positive here) and

```math
\frac{\sec\theta - 1}{\tan\theta} = \frac{1 - \cos\theta}{\sin\theta} = \tan\frac{\theta}{2}
```

so the expression is `$\tan^{-1}(\tan\tfrac{\theta}{2}) = \tfrac{\theta}{2} = \tfrac12\tan^{-1}x$`, since `$\theta/2$` lies in the principal range. Other substitutions: `$x = \sin\theta$` for `$\sqrt{1 - x^2}$`, `$x = \cos\theta$` likewise, `$x = \tan\theta$` for `$1 + x^2$`.

<div class="history">

- **Name:** "arc sine" means the arc of the unit circle (the angle) whose sine is x; that is why spreadsheets write ASIN, ACOS and ATAN.
- **1813:** John Herschel introduces the notation `$\sin^{-1}$` for the inverse function, which still causes the reciprocal mix-up today.
- **Today:** calculators label these keys `$\sin^{-1}$`; programming languages write `asin`.

</div>

<div class="keypoints">

- sin, cos and the rest are not one-one on ℝ; each is cut to a principal branch where it is one-one and onto, and the inverse is the mirror image of that branch.
- Branches: sin⁻¹ in [−π/2, π/2]; cos⁻¹ in [0, π]; tan⁻¹ in (−π/2, π/2); cot⁻¹ in (0, π); sec⁻¹ in [0, π] except π/2; cosec⁻¹ in [−π/2, π/2] except 0.
- sin⁻¹x is an angle; it is not 1/sin x.
- sin(sin⁻¹x) = x only for x in [−1, 1]; sin⁻¹(sin x) = x only for x in [−π/2, π/2]. For other x, shift to the principal range first.
- sin⁻¹(−x) = −sin⁻¹x; cos⁻¹(−x) = π − cos⁻¹x; tan⁻¹(−x) = −tan⁻¹x.
- sin⁻¹x + cos⁻¹x = π/2; tan⁻¹x + cot⁻¹x = π/2.
- tan⁻¹x + tan⁻¹y = tan⁻¹((x+y)/(1−xy)) when xy < 1; add or subtract π when xy > 1.
- 2tan⁻¹x = sin⁻¹(2x/(1+x²)) for |x| ≤ 1.

</div>

Going further for JEE/NEET: [Inverse trigonometric functions](/learn/courses/engineering-entrance/inverse-trig/) covers the harder equations and the multi-case simplifications asked in the exams.
