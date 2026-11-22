---
title: Definite integrals and area
seoTitle: 'Definite integrals and area: JEE maths'
summary: 'The definite integral as the limit of a sum, the fundamental theorem, the properties that make hard integrals easy (King''s rule, even and odd, periodic), integrands with modulus and greatest integer, Leibniz rule, Wallis formula, limits of sums as integrals, estimation, and areas under and between curves.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: '∫ from −1 to 1 of x³ cos x dx equals:'
    choices: ['0', '2 cos 1', '1', 'it cannot be found']
    ans: 0
    why: 'x³ cos x is odd (changing x to −x changes its sign), and the integral of an odd function over [−a, a] is 0.'
  - q: '∫ from 0 to π/2 of sin x / (sin x + cos x) dx equals:'
    choices: ['π/2', 'π/4', '1', '0']
    ans: 1
    why: 'King''s rule turns it into the same integral with cos on top. Adding the two gives ∫ 1 dx = π/2, so each is π/4.'
  - q: 'The area between y = x² and y = x is:'
    choices: ['1/2', '1/3', '1/6', '1']
    ans: 2
    why: 'They meet at x = 0 and 1, where the line is on top. ∫ (x − x²) dx from 0 to 1 = 1/2 − 1/3 = 1/6.'
sources:
  - 'NCERT Mathematics Class 12 (Integrals; Application of integrals): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Integral calculus'
---

**Maths · Class 12 · about 38 minutes.** By the end you will be able to evaluate definite integrals with the fundamental theorem, use the properties that turn impossible-looking integrals into one line, handle modulus and greatest-integer integrands, differentiate integrals with variable limits, write limits of sums as integrals, and find areas between curves.

<div class="bigidea">A definite integral is a total built from many tiny pieces: slice the region under a curve into thin strips, add their areas, and let the strips get infinitely thin. The fundamental theorem says this total is just the change in any antiderivative, F(b) − F(a). Most of the clever tricks are ways to see the same region differently: reflected, folded in half, or repeated.</div>

## 1. The limit of a sum and the fundamental theorem

Split [a, b] into n strips of width h = (b − a)/n. Then

```math
\int_a^b f(x)\,dx = \lim_{n \to \infty} \sum_{r=1}^{n} h\, f(a + rh) = F(b) - F(a), \qquad F' = f
```

<figure class="fig" data-fig="di-riemann"><figcaption>Rectangles below the axis count as negative. Increase n and watch the sum close in on F(b) − F(a), whichever height rule you choose.</figcaption></figure>

<div class="meaning">
<dl>
<dt>a, b</dt><dd>lower and upper limits; swapping them changes the sign</dd>
<dt>h</dt><dd>width of each strip, (b − a)/n</dd>
<dt>F</dt><dd>any antiderivative of f; the constant C cancels in F(b) − F(a)</dd>
<dt>Physical meaning</dt><dd>The integral is signed area: parts above the axis add, parts below subtract. If f is a velocity, the integral is the displacement.</dd>
</dl>
</div>

**Substitution in a definite integral**: change the limits along with the variable, and never go back to x. ∫₀¹ 2x eˣ² dx with t = x² becomes ∫₀¹ eᵗ dt = e − 1.

## 2. The properties

| Property | Use it when |
|---|---|
| `$\int_a^b f(x)\,dx = \int_a^b f(a + b - x)\,dx$` (King's rule) | replacing x by a + b − x gives something that adds nicely to the original |
| `$\int_{-a}^{a} f = 2\int_0^a f$` (f even), `$= 0$` (f odd) | symmetric limits |
| `$\int_0^{2a} f = 2\int_0^a f$` if f(2a − x) = f(x), and 0 if f(2a − x) = −f(x) | limits like 0 to π |
| `$\int_0^{nT} f = n\int_0^T f$` (f with period T) | sin, cos, {x}, \|sin x\| over many periods |
| `$\int_a^b f = \int_a^c f + \int_c^b f$` | the integrand changes formula at c |

**King's rule example.** I = ∫₀^π x sin x/(1 + cos²x) dx. Replacing x by π − x gives I = ∫₀^π (π − x) sin x/(1 + cos²x) dx. Adding: 2I = π∫₀^π sin x/(1 + cos²x) dx = π[−tan⁻¹(cos x)]₀^π = π · π/2. So I = π²/4.

<div class="myth">

**"I can integrate first and use symmetry later; the answer will come out the same."** It will, but for many JEE integrals there is no antiderivative in simple functions at all. The property is not a shortcut there: it is the only way. When the limits are symmetric or of the form 0 to a, try a property before anything else.

</div>

Standard results from King's rule: ∫₀^(π/2) log sin x dx = −(π/2) log 2, and ∫₀^(π/2) sinⁿx/(sinⁿx + cosⁿx) dx = π/4 for every n.

## 3. Modulus and greatest integer

**Modulus**: find where the inside changes sign, split there, and drop the modulus with the correct sign on each piece.

<div class="problem" data-problem="di-modulus"></div>

**Greatest integer** [x]: it is constant between integers, so split at every integer (or at every point where the inside reaches an integer). ∫₀³ [x] dx = 0 + 1 + 2 = 3. For [x²] on [0, 2], split at 1, √2 and √3. The fractional part {x} = x − [x] has period 1, so ∫₀ⁿ {x} dx = n/2.

## 4. Leibniz rule and integral equations

```math
\frac{d}{dx}\int_{u(x)}^{v(x)} f(t)\,dt = f(v(x))\,v'(x) - f(u(x))\,u'(x)
```

Use it for limits like `$\lim_{x\to 0} \dfrac{1}{x^2}\int_0^{x} t\cos t\,dt$`, which is 0/0: L'Hôpital and Leibniz give x cos x/(2x) → 1/2. **Integral equations** such as f(x) = x + ∫₀¹ t f(t) dt: the integral is a number k, so f(x) = x + k; put this back to find k.

<div class="problem" data-problem="di-leibniz"></div>

## 5. Wallis formula, parts and estimation

For n ≥ 2, ∫₀^(π/2) sinⁿx dx = ∫₀^(π/2) cosⁿx dx = `$\dfrac{n-1}{n}\cdot\dfrac{n-3}{n-2}\cdots$`, ending in `$\tfrac12\cdot\tfrac{\pi}{2}$` if n is even and in `$\tfrac23 \cdot 1$` if n is odd. So ∫₀^(π/2) sin⁴x dx = (3/4)(1/2)(π/2) = 3π/16.

By parts works as usual, with the limits applied to the uv term: `$\int_a^b uv' = [uv]_a^b - \int_a^b u'v$`.

**Estimation.** If m ≤ f(x) ≤ M on [a, b], then m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a). This bounds integrals you cannot evaluate, such as ∫₀¹ e^(x²) dx, which lies between 1 and e.

## 6. Limits of sums as integrals (JEE favourite)

To evaluate `$\lim_{n\to\infty} \sum_{r=1}^{n} \dfrac{1}{n} f\!\left(\dfrac{r}{n}\right)$`: replace r/n by x, 1/n by dx, and the sum by ∫₀¹. Example:

```math
\lim_{n\to\infty} \sum_{r=1}^{n} \frac{n}{n^2 + r^2} = \lim \sum \frac{1}{n}\cdot\frac{1}{1 + (r/n)^2} = \int_0^1 \frac{dx}{1 + x^2} = \frac{\pi}{4}
```

If r runs from 1 to 2n, the upper limit becomes 2.

## 7. Area under and between curves

- Area between y = f(x), the x-axis and x = a, x = b: `$\int_a^b |f(x)|\,dx$`. Split where f changes sign; area is never negative.
- Area between two curves: find where they meet, then `$\int (\text{upper} - \text{lower})\,dx$`. If the region is easier in horizontal strips, integrate (right − left) dy.
- Useful results: area between y² = 4ax and its latus rectum is 8a²/3; between y² = 4ax and x² = 4by is 16ab/3; inside an ellipse is πab; between y = x² and y = kx is k³/6.

<div class="problem" data-problem="di-area"></div>

<div class="myth">

**"Area = ∫ f dx from end to end."** If f dips below the axis, the plain integral subtracts that part and gives less than the area (even zero, as with sin x on [0, 2π], whose area is 4). Integrate |f|, or split at the crossings.

</div>

Next: [Definite integrals and area: question types and traps](/learn/courses/engineering-entrance/definite-integrals-questions/).

<div class="keypoints">

- ∫ₐᵇ f = F(b) − F(a); change the limits when you substitute.
- King's rule: ∫ₐᵇ f(x) = ∫ₐᵇ f(a + b − x); add the two forms.
- Odd function over [−a, a] gives 0; even gives twice the half.
- Periodic: ∫₀^(nT) f = n∫₀^T f; split [x] and |f| at the break points.
- Leibniz: d/dx ∫ᵤᵛ f(t)dt = f(v)v′ − f(u)u′.
- Wallis: ∫₀^(π/2) sinⁿx = (n − 1)/n · (n − 3)/(n − 2) ⋯ (× π/2 for even n).
- Limit of a sum: r/n → x, 1/n → dx, Σ → ∫₀¹.
- Area: ∫ (upper − lower), always positive; split at crossings.

</div>
