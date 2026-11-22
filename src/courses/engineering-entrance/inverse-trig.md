---
title: Inverse trigonometric functions
seoTitle: 'Inverse trigonometric functions: JEE maths'
summary: 'Why trigonometric functions need a restricted branch, the domains and principal ranges of all six inverses, the graphs of sin⁻¹(sin x) and its relatives, the complement and negative-argument properties, the sum formulas with their π corrections, double-angle forms, simplification by substitution, equations and telescoping sums.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'The principal value of cos⁻¹(−1/2) is:'
    choices: ['−π/3', 'π/3', '2π/3', '4π/3']
    ans: 2
    why: 'The range of cos⁻¹ is [0, π]. cos⁻¹(−x) = π − cos⁻¹x, so π − π/3 = 2π/3.'
  - q: 'sin⁻¹(sin 2π/3) equals:'
    choices: ['2π/3', 'π/3', '−π/3', 'π/6']
    ans: 1
    why: '2π/3 is outside [−π/2, π/2]. sin(2π/3) = sin(π − 2π/3) = sin(π/3), and π/3 is in range.'
  - q: 'tan⁻¹2 + tan⁻¹3 equals:'
    choices: ['π/4', '3π/4', '−π/4', 'π/2']
    ans: 1
    why: 'Here ab = 6 > 1 with a, b > 0, so the sum is π + tan⁻¹[(5)/(1 − 6)] = π + tan⁻¹(−1) = π − π/4 = 3π/4.'
sources:
  - 'NCERT Mathematics Class 12 (Inverse trigonometric functions): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Trigonometry; Inverse trigonometric functions'
---

**Maths · Class 12 · about 32 minutes.** By the end you will be able to find any principal value, sketch and use graphs like sin⁻¹(sin x), apply the sum and double-angle formulas with the correct π corrections, simplify expressions by a clever substitution, and solve inverse-trig equations and telescoping sums.

<div class="bigidea">sin x takes the same value again and again, so "the angle whose sine is ½" has infinitely many answers. To make an inverse function we agree on one stretch of angles, the principal branch, and always answer from that stretch. Every rule and every trap in this chapter comes from staying inside the agreed stretch.</div>

## 1. Why a branch is needed

A function has an inverse only if it is one-one and onto. sin x is neither on all of ℝ, so we restrict it to `$[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$`, where it rises from −1 to 1 exactly once. On that stretch it has an inverse, written sin⁻¹x or arcsin x. Note that sin⁻¹x is **not** 1/sin x; that is (sin x)⁻¹ = cosec x.

| Function | Domain | Principal range |
|---|---|---|
| sin⁻¹x | [−1, 1] | [−π/2, π/2] |
| cos⁻¹x | [−1, 1] | [0, π] |
| tan⁻¹x | ℝ | (−π/2, π/2) |
| cot⁻¹x | ℝ | (0, π) |
| sec⁻¹x | x ≤ −1 or x ≥ 1 | [0, π] except π/2 |
| cosec⁻¹x | x ≤ −1 or x ≥ 1 | [−π/2, π/2] except 0 |

A quick memory aid: sin, tan and cosec keep the **right half** of the circle (angles from −90° to 90°); cos, cot and sec keep the **upper half** (0° to 180°).

**Principal value example.** sin⁻¹(−√3/2) = −π/3 (in range). cos⁻¹(−√3/2) is not −π/6, because cos⁻¹ never gives a negative angle: it is π − π/6 = 5π/6.

<div class="myth">

**"sin⁻¹(sin x) = x always."** Only when x is already in [−π/2, π/2]. Outside that, the answer is the angle in range with the same sine. sin(sin⁻¹x) = x is true, but only for x in [−1, 1]; sin⁻¹2 does not exist.

</div>

## 2. The graphs and f⁻¹(f(x))

The graph of an inverse is the mirror image of the branch in the line y = x. Switch to the composite and drag x past π/2: the graph of sin⁻¹(sin x) climbs with slope 1, then turns and falls with slope −1, a zig-zag that never leaves [−π/2, π/2].

<figure class="fig" data-fig="itrig-branches"><figcaption>Left choice: the principal branch. Right choice: y = f⁻¹(f(x)), which agrees with y = x (dashed) only inside the principal range.</figcaption></figure>

To evaluate sin⁻¹(sin θ) for any θ: write θ = kπ + φ with |φ| ≤ π/2 (k the nearest whole number to θ/π); then the answer is (−1)ᵏφ. For cos⁻¹(cos θ) use cos θ = cos(2kπ ± θ) and pick the version in [0, π]. For tan⁻¹(tan θ), subtract the multiple of π that lands in (−π/2, π/2).

<div class="problem" data-problem="itrig-sinsin"></div>

## 3. The basic properties

```math
\sin^{-1}x + \cos^{-1}x = \frac{\pi}{2}, \qquad \tan^{-1}x + \cot^{-1}x = \frac{\pi}{2}, \qquad \sec^{-1}x + \operatorname{cosec}^{-1}x = \frac{\pi}{2}
```

```math
\sin^{-1}(-x) = -\sin^{-1}x, \quad \tan^{-1}(-x) = -\tan^{-1}x, \quad \cos^{-1}(-x) = \pi - \cos^{-1}x, \quad \cot^{-1}(-x) = \pi - \cot^{-1}x
```

Reciprocals: `$\operatorname{cosec}^{-1}x = \sin^{-1}(1/x)$` and `$\sec^{-1}x = \cos^{-1}(1/x)$` for |x| ≥ 1. But `$\cot^{-1}x = \tan^{-1}(1/x)$` only for x > 0; for x < 0 it is π + tan⁻¹(1/x).

**Converting between functions with a triangle.** For 0 < x < 1, let θ = sin⁻¹x. Draw a right triangle with opposite side x and hypotenuse 1; the adjacent side is √(1 − x²). Then cos θ = √(1 − x²), tan θ = x/√(1 − x²), and so on.

## 4. Sum and difference formulas

```math
\tan^{-1}a + \tan^{-1}b = \begin{cases} \tan^{-1}\dfrac{a+b}{1-ab}, & ab < 1 \\[4pt] \pi + \tan^{-1}\dfrac{a+b}{1-ab}, & a, b > 0,\ ab > 1 \\[4pt] -\pi + \tan^{-1}\dfrac{a+b}{1-ab}, & a, b < 0,\ ab > 1 \end{cases}
```

<div class="meaning">
<dl>
<dt>a, b</dt><dd>the two numbers whose inverse tangents are added</dd>
<dt>ab &lt; 1</dt><dd>the sum of the two angles stays inside (−π/2, π/2), so tan⁻¹ can report it directly</dd>
<dt>ab &gt; 1</dt><dd>the sum has crossed ±π/2; tan⁻¹ would report it shifted by π, so we add π back (or −π if both are negative)</dd>
<dt>ab = 1</dt><dd>the sum is exactly π/2 (or −π/2 if both are negative)</dd>
<dt>Physical meaning</dt><dd>tan repeats every π, so the formula gives the right tangent but may give an angle π off. The correction puts the angle where it really is.</dd>
</dl>
</div>

Difference: `$\tan^{-1}a - \tan^{-1}b = \tan^{-1}\dfrac{a-b}{1+ab}$` when ab > −1. Similar formulas for sin⁻¹a ± sin⁻¹b exist (`$\sin^{-1}\left(a\sqrt{1-b^2} \pm b\sqrt{1-a^2}\right)$` when a² + b² ≤ 1), but turning everything into tan⁻¹ with a triangle is usually faster.

<div class="problem" data-problem="itrig-tansum"></div>

## 5. Double and triple angles, and substitution

```math
2\tan^{-1}x = \sin^{-1}\frac{2x}{1+x^2} = \cos^{-1}\frac{1-x^2}{1+x^2} = \tan^{-1}\frac{2x}{1-x^2}
```

The first form holds for |x| ≤ 1, the second for x ≥ 0, the third for |x| < 1. Outside those, add or subtract π just as in section 4. Similarly `$2\sin^{-1}x = \sin^{-1}(2x\sqrt{1-x^2})$` for |x| ≤ 1/√2, and `$3\sin^{-1}x = \sin^{-1}(3x - 4x^3)$` for |x| ≤ 1/2.

**Simplify by substitution.** Spot the trig identity hiding in the algebra:

| You see | Put | Because |
|---|---|---|
| √(1 − x²) | x = sin θ or cos θ | 1 − sin²θ = cos²θ |
| 1 + x² | x = tan θ | 1 + tan²θ = sec²θ |
| √(x² − 1) | x = sec θ | sec²θ − 1 = tan²θ |
| √((1 − x)/(1 + x)) | x = cos 2θ | gives tan θ |

**Worked example.** Simplify tan⁻¹[(√(1 + x²) − 1)/x] for x ≠ 0. Put x = tan θ with θ in (−π/2, π/2). The fraction becomes (sec θ − 1)/tan θ = (1 − cos θ)/sin θ = tan(θ/2). Since θ/2 is in range, the answer is θ/2 = ½ tan⁻¹x.

<div class="problem" data-problem="itrig-compose"></div>

## 6. JEE Advanced level: equations, ranges and telescoping sums

**Equations.** Turn everything into one inverse function, take tan (or sin) of both sides, solve, then **check each root in the original equation**, since taking tan can add false roots. Example: tan⁻¹2x + tan⁻¹3x = π/4 gives 5x/(1 − 6x²) = 1, so 6x² + 5x − 1 = 0 and x = 1/6 or −1. At x = −1 both terms are negative, so the sum is negative and cannot be π/4. Only x = 1/6.

**Ranges.** Since sin⁻¹x + cos⁻¹x = π/2, expressions like (sin⁻¹x)² + (cos⁻¹x)² become a quadratic in t = sin⁻¹x over [−π/2, π/2]; its least value π²/8 is at t = π/4 and its greatest 5π²/4 at t = −π/2.

**Telescoping sums.** Write each term as a difference: `$\tan^{-1}\dfrac{1}{1 + k(k+1)} = \tan^{-1}(k+1) - \tan^{-1}k$`. Adding from k = 1 to n, everything cancels except tan⁻¹(n + 1) − tan⁻¹1. As n → ∞ the sum tends to π/2 − π/4 = π/4. The trick: look for a denominator of the form 1 + (product of two numbers whose difference is the numerator).

<div class="myth">

**"cot⁻¹x = tan⁻¹(1/x) always."** For negative x, tan⁻¹(1/x) is negative but cot⁻¹x lies in (0, π). The correct rule for x < 0 is cot⁻¹x = π + tan⁻¹(1/x).

</div>

Next: [Inverse trigonometric functions: question types and traps](/learn/courses/engineering-entrance/inverse-trig-questions/).

<div class="keypoints">

- Principal ranges: sin⁻¹, tan⁻¹, cosec⁻¹ in the right half (−π/2 to π/2); cos⁻¹, cot⁻¹, sec⁻¹ in the upper half (0 to π).
- sin(sin⁻¹x) = x for |x| ≤ 1; sin⁻¹(sin x) = x only for x in [−π/2, π/2]; otherwise use the zig-zag graph.
- sin⁻¹x + cos⁻¹x = tan⁻¹x + cot⁻¹x = π/2.
- cos⁻¹(−x) = π − cos⁻¹x; sin⁻¹ and tan⁻¹ are odd.
- tan⁻¹a + tan⁻¹b = tan⁻¹[(a + b)/(1 − ab)] for ab < 1; add π when a, b > 0 and ab > 1.
- Simplify by substituting x = sin θ, tan θ, sec θ or cos 2θ; check the range of θ before cancelling.
- In equations, test every root; in sums, write terms as tan⁻¹A − tan⁻¹B and telescope.

</div>
