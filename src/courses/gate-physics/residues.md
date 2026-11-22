---
title: The residue theorem and real integrals
seoTitle: The residue theorem and real integrals | GATE Physics
summary: 'Computing residues at simple, multiple and essential singularities, the residue theorem, trigonometric integrals on the unit circle, rational and Fourier-type integrals with Jordan''s lemma, poles on the real axis and principal values, keyhole, wedge and rectangular contours, branch points, and summing series with π cot πz.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: "To evaluate the integral of e^(−3ix)/(x² + 1) over the real line, where should you close the contour?"
    choices: ['In the lower half-plane', 'In the upper half-plane', 'Either half-plane', 'It cannot be done with residues']
    ans: 0
    why: "|e^(−3iz)| = e^(3 Im z) decays only when Im z < 0, so the big arc vanishes in the lower half-plane. That contour runs clockwise, so the result is −2πi times the residue at z = −i, which gives πe^(−3)."
  - q: A simple pole lies on the real axis, and you take the principal value. How does it contribute?
    choices: ['πi times its residue (half of 2πi)', '2πi times its residue', 'Nothing', 'Its residue squared']
    ans: 0
    why: A small semicircle round a simple pole contributes ±πi times the residue as its radius shrinks. Together with the poles strictly inside, the principal value picks up πi Res for each simple pole on the axis.
  - q: Why can you not take a residue at z = 0 for √z/(z² + 1)?
    choices: ['z = 0 is a branch point, not an isolated pole', 'The residue there is infinite', 'The residue is zero', 'z = 0 is outside every contour']
    ans: 0
    why: "√z changes sign when you go round z = 0, so the function has no Laurent series there. Use a keyhole contour that hugs a branch cut instead of encircling the point."
sources:
  - 'R. V. Churchill and J. W. Brown, Complex Variables and Applications, 9th ed. (2013), chapters 6 and 7'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapter 11'
  - 'M. J. Ablowitz and A. S. Fokas, Complex Variables: Introduction and Applications, 2nd ed. (2003), chapter 4'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 14'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 60 minutes.** By the end you will be able to compute residues quickly at any kind of pole, turn a real integral into a contour integral and choose the right contour for it, justify dropping the big arc (including with Jordan's lemma), handle poles on the axis with principal values, use keyhole, wedge and rectangular contours, and recognise branch points where residues cannot be used. It builds directly on [lesson 1.3, analytic functions and Cauchy's theorem](/learn/courses/gate-physics/complex-analysis/).

<div class="bigidea">A contour integral sees only the singular points it encloses, each through one number, its residue. Real integrals that are hard on the real line become a sum of residues once you close the path in the complex plane.</div>

## 1. The residue theorem and how to compute residues

The **residue** of `$f$` at an isolated singularity `$a$` is the coefficient `$c_{-1}$` of `$(z - a)^{-1}$` in its Laurent series. It is the only term that survives a loop, so for a closed curve `$C$` traversed anticlockwise:

```math
\oint_C f(z)\,dz = 2\pi i\sum_{\text{poles inside } C}\text{Res}\,f
```

Fast ways to get residues:

- **Simple pole:** `$\text{Res}_af = \lim_{z\to a}(z - a)f(z)$`. If `$f = p/q$` with `$q(a) = 0 \ne q'(a)$`: `$\text{Res} = p(a)/q'(a)$`. So `$\cot z$` has residue 1 at every `$n\pi$`, and at a root of `$z^4 = -1$`, `$\frac{1}{4z^3} = -\frac z4$`.
- **Pole of order m:**

```math
\text{Res}_af = \frac{1}{(m - 1)!}\lim_{z\to a}\frac{d^{m-1}}{dz^{m-1}}\Big[(z - a)^mf(z)\Big]
```

- **Essential singularity or awkward cases:** expand. `$z\cos(1/z) = z - \frac{1}{2z} + \cdots$` has residue `$-\tfrac12$`; `$\frac{1}{z^2\sin z} = \frac{1}{z^3}(1 + \frac{z^2}{6} + \cdots)$` has residue `$\tfrac16$`.
- **Residue at infinity:** `$\text{Res}_\infty f = -c_{-1}$` of the expansion in powers of `$1/z$` for large `$\lvert z\rvert$`. All residues, including the one at infinity, add to zero. So if `$f \sim c/z$` at large `$\lvert z\rvert$`, the finite residues add to `$c$`; if `$f$` falls like `$1/z^2$` or faster, they add to 0.

**Worked example.** `$\oint_{|z|=2}\frac{3z + 1}{z(z - 1)}dz$`: `$\text{Res}_0 = \frac{1}{-1} = -1$`, `$\text{Res}_1 = \frac{4}{1} = 4$`. The integral is `$2\pi i(3) = 6\pi i$`. Check with infinity: `$f \approx 3/z$` for large `$z$`, and indeed `$-1 + 4 = 3$`.

<div class="meaning">

<dl>
<dt>Res f at a</dt><dd>the coefficient of 1/(z − a): the only part of f that a loop round a can detect</dd>
<dt>2πi</dt><dd>the integral of 1/(z − a) once round a; every residue is weighted by it</dd>
<dt>Closing the contour</dt><dd>adding a path (usually a big arc) whose contribution is known, mostly zero</dd>
<dt>Principal value</dt><dd>the symmetric limit that cancels the two infinite halves on either side of a pole on the path</dd>
<dt>Physical meaning</dt><dd>Residues are how physicists evaluate Fourier integrals of response functions and propagators: the poles of a response are its resonances, and their positions decide causality and decay.</dd>
</dl>

</div>

## 2. Integrals over a full period: the unit circle

For `$\int_0^{2\pi}R(\cos\theta, \sin\theta)\,d\theta$`, put `$z = e^{i\theta}$`:

```math
\cos\theta = \frac{z + z^{-1}}{2}, \qquad \sin\theta = \frac{z - z^{-1}}{2i}, \qquad d\theta = \frac{dz}{iz}
```

and the integral becomes a contour integral round `$\lvert z\rvert = 1$`. Only poles **inside the unit circle** count.

**Worked example.** `$\int_0^{2\pi}\frac{d\theta}{2 + \cos\theta} = \oint\frac{2\,dz}{i(z^2 + 4z + 1)}$`. The roots `$-2 \pm \sqrt3$` multiply to 1, so exactly one, `$z_+ = -2 + \sqrt3$`, is inside. Its residue is `$\frac{2}{i(z_+ - z_-)} = \frac{1}{\sqrt3\,i}$`, and the integral is `$2\pi/\sqrt3$`. In general `$\int_0^{2\pi}\frac{d\theta}{a + b\cos\theta} = \frac{2\pi}{\sqrt{a^2 - b^2}}$` for `$a > \lvert b\rvert$`.

For `$\cos n\theta$` in the numerator, write it as `$\text{Re}\,z^n$` rather than `$(z^n + z^{-n})/2$`: the second form adds a pole of order `$n$` at the origin. So `$\int_0^{2\pi}\frac{\cos2\theta}{5 - 4\cos\theta}d\theta = \text{Re}\oint\frac{-z^2\,dz}{i(2z - 1)(z - 2)} = \frac{\pi}{6}$` (only `$z = \tfrac12$` is inside).

## 3. Rational functions on the real line

For `$\int_{-\infty}^{\infty}\frac{P(x)}{Q(x)}dx$` with `$\deg Q \ge \deg P + 2$` and no real zeros of `$Q$`, close with a large semicircle in the upper half-plane. On the arc `$\lvert f\rvert \lesssim C/R^2$` and the length is `$\pi R$`, so the arc contributes at most `$\pi C/R \to 0$`:

```math
\int_{-\infty}^{\infty}\frac{P(x)}{Q(x)}dx = 2\pi i\sum_{\text{Im}\,a > 0}\text{Res}_a\frac{P}{Q}
```

**Worked example.** `$\int\frac{dx}{x^4 + 1}$`: the upper poles are `$e^{i\pi/4}$` and `$e^{3i\pi/4}$`, with residues `$-\frac z4$`. Sum `$-\frac14(e^{i\pi/4} + e^{3i\pi/4}) = -\frac{i\sqrt2}{4}$`, times `$2\pi i$`: `$\frac{\pi}{\sqrt2}$`. Double poles need the derivative formula: `$\int_0^\infty\frac{dx}{(x^2 + a^2)^2} = \frac{\pi}{4a^3}$` (half the full-line value, as the integrand is even).

<div class="problem" data-problem="res-two-poles"></div>

## 4. Fourier-type integrals and Jordan's lemma

For `$\int_{-\infty}^{\infty}f(x)e^{ikx}dx$`, use `$e^{ikz}$` on the contour (never `$\cos kz$` or `$\sin kz$`, which grow in both half-planes) and take real or imaginary parts at the end. The sign of `$k$` picks the half-plane, because `$\lvert e^{ikz}\rvert = e^{-k\,\text{Im}z}$`:

- `$k > 0$`: close **above**; the result is `$+2\pi i\sum\text{Res}$` (upper half-plane).
- `$k < 0$`: close **below**; the contour runs clockwise, so the result is `$-2\pi i\sum\text{Res}$` (lower half-plane).

Here the decay of `$f$` alone can be too slow: `$\frac{x}{x^2 + 4}$` falls only like `$1/x$`. The exponential rescues it:

<div class="steps">
<div class="step">On the upper arc z = Re^(iθ), |e^(ikz)| = e^(−kR sin θ). The arc length element is R dθ.</div>
<div class="step">So |arc integral| ≤ max|f| × R ∫₀^π e^(−kR sin θ) dθ = 2 max|f| × R ∫₀^(π/2) e^(−kR sin θ) dθ.</div>
<div class="step">On 0 ≤ θ ≤ π/2, sin θ ≥ 2θ/π (the sine curve lies above its chord). So the integral is at most ∫₀^(π/2) e^(−2kRθ/π) dθ < π/(2kR).</div>
<div class="step">Hence |arc integral| < (π/k) × max|f| on the arc. If f → 0 as R → ∞, even as slowly as 1/R, the arc vanishes. That is Jordan's lemma.</div>
</div>

The figure integrates each piece numerically. Compare the three integrands: without an exponential, `$z/(z^2 + 1)$` leaves an arc contribution of `$\pi i$` that never dies; with `$e^{iz}$` it does.

<figure class="fig" data-fig="jordan-arc"><figcaption>The closed contour (real segment plus upper arc) and a graph of |arc integral| against R. Segment plus arc always equals 2πi times the residue at i; the real integral follows only when the arc tends to zero.</figcaption></figure>

**Worked example.** `$\int_{-\infty}^{\infty}\frac{x\sin x}{x^2 + 4}dx = \text{Im}\int\frac{xe^{ix}}{x^2 + 4}dx$`. Close above (Jordan). Residue at `$2i$`: `$\frac{2ie^{-2}}{4i} = \frac{e^{-2}}{2}$`. So the complex integral is `$i\pi e^{-2}$` and the answer is `$\pi e^{-2} \approx 0.425$`. Similarly `$\int\frac{\cos kx}{x^2 + a^2}dx = \frac{\pi}{a}e^{-\lvert k\rvert a}$`, even in `$k$` because each sign closes on its own side.

## 5. Poles on the axis: principal values

If `$f$` has a simple pole at a real point `$x_0$`, the ordinary integral diverges, but the **Cauchy principal value**

```math
\text{PV}\int_{-\infty}^{\infty}f\,dx = \lim_{\varepsilon\to0}\left(\int_{-\infty}^{x_0 - \varepsilon} + \int_{x_0 + \varepsilon}^{\infty}\right)f\,dx
```

can be finite. Indent the contour with a small semicircle of radius `$\varepsilon$` round `$x_0$`. On a small arc round a simple pole, `$\int f\,dz \to i\,\Delta\theta\,\text{Res}$`, where `$\Delta\theta$` is the angle swept: `$-\pi$` for an arc passing above the pole (clockwise), `$+\pi$` below. Either way, the final rule is

```math
\text{PV}\int_{-\infty}^{\infty}f\,dx = 2\pi i\sum_{\text{upper half-plane}}\text{Res} + \pi i\sum_{\text{real axis}}\text{Res}
```

(for contours closed above, with the arc vanishing).

**Worked example.** `$\text{PV}\int\frac{dx}{(x - 1)(x^2 + 1)}$`. `$\text{Res}_1 = \frac12$`; `$\text{Res}_i = \frac{1}{(i - 1)2i} = -\frac{1 - i}{4}$`. PV `$= 2\pi i\left(-\frac{1 - i}{4}\right) + \pi i\cdot\frac12 = -\frac\pi2$`. The imaginary parts cancel, as they must for a real integrand: a leftover imaginary part means a pole was given the wrong weight.

The classic case: `$\text{PV}\int\frac{e^{ix}}{x}dx = i\pi$`, whose imaginary part gives `$\int_{-\infty}^{\infty}\frac{\sin ax}{x}dx = \pi$` for every `$a > 0$`, and whose real part gives `$\text{PV}\int\frac{\cos x}{x}dx = 0$`. The same idea gives `$\int_0^\infty\frac{\sin^2x}{x^2}dx = \frac\pi2$`.

<div class="myth">

**"A pole on the real axis counts like any other pole inside the contour."** It sits *on* the contour, so it is neither inside nor outside. For a principal value it contributes `$\pi i\,\text{Res}$`, half the usual weight, because the small semicircle sweeps half a turn. Giving it `$2\pi i\,\text{Res}$` (or 0) leaves an imaginary part in the answer to a real integral, which is the quickest check that something went wrong.

</div>

## 6. Other contours: keyhole, wedge, rectangle

Choose the contour so that the extra sides either vanish or reproduce the original integral times a known factor.

- **Keyhole** for `$\int_0^\infty x^{a-1}R(x)\,dx$` (non-integer power). Cut along the positive axis; below the cut `$z^{a-1}$` carries an extra factor `$e^{2\pi i(a-1)}$`. Result for `$0 < a < 1$`: `$\int_0^\infty\frac{x^{a-1}}{1 + x}dx = \frac{\pi}{\sin\pi a}$`. With `$a = \tfrac23$`, `$\int_0^\infty\frac{dx}{x^{1/3}(1 + x)} = \frac{2\pi}{\sqrt3}$`.
- **Wedge** for integrands with rotational symmetry. On the ray `$\arg z = 2\pi/n$`, `$z^n$` is real again, so `$\int_0^\infty\frac{dx}{1 + x^n} = \frac{\pi/n}{\sin(\pi/n)}$` (one pole inside, at `$e^{i\pi/n}$`). On the ray `$\arg z = \pi/4$`, `$e^{iz^2} = e^{-r^2}$`: the Fresnel integrals `$\int_0^\infty\sin x^2\,dx = \int_0^\infty\cos x^2\,dx = \sqrt{\pi/8}$`.
- **Rectangle** for periodic pieces such as `$e^x$`: shifting by `$2\pi i$` leaves `$1 + e^z$` unchanged, giving `$\int_{-\infty}^{\infty}\frac{e^{ax}}{1 + e^x}dx = \frac{\pi}{\sin\pi a}$` for `$0 < a < 1$`.

**Warning: branch points.** A branch point (of `$\sqrt z$`, `$z^a$`, `$\ln z$`) is not an isolated singularity: the function has no Laurent series there and **no residue**. Never draw a closed contour that winds round a branch point without a cut; the integrand would not come back to its starting value. On the keyhole, track the branch carefully: with the cut on the positive axis, `$0 < \arg z < 2\pi$`, so `$\sqrt{-i} = e^{3i\pi/4}$`, not the principal value `$e^{-i\pi/4}$`. With that branch, `$\int_0^\infty\frac{\sqrt x}{x^2 + 1}dx = \frac{\pi}{\sqrt2}$`, and the two sides of the cut add rather than cancel.

## 7. Summing series with residues

`$\pi\cot(\pi z)$` has a simple pole with residue 1 at every integer. For `$f$` falling at least like `$1/z^2$`, the integral of `$\pi\cot(\pi z)f(z)$` round large squares vanishes, so

```math
\sum_{n=-\infty}^{\infty}f(n) = -\sum_{\text{poles of } f}\text{Res}\big[\pi\cot(\pi z)f(z)\big]
```

For `$f = \frac{1}{z^2 + a^2}$`: `$\sum_n\frac{1}{n^2 + a^2} = \frac{\pi}{a}\coth\pi a$` (use `$\cot(ix) = -i\coth x$`). With `$f = 1/z^4$` the pole at 0 is of order 5 and gives `$\sum_{n\ge1}n^{-4} = \pi^4/90$`.

<div class="keypoints">

- `$\oint f\,dz = 2\pi i\sum\text{Res}$` inside. Simple pole: `$p(a)/q'(a)$`. Order `$m$`: `$(m-1)$`th derivative of `$(z - a)^mf$` over `$(m-1)!$`. Essential: expand. All residues including infinity add to 0.
- Period integrals: `$z = e^{i\theta}$`, only poles inside `$\lvert z\rvert = 1$`; `$\int_0^{2\pi}\frac{d\theta}{a + b\cos\theta} = \frac{2\pi}{\sqrt{a^2 - b^2}}$`. Use `$\text{Re}\,z^n$` for `$\cos n\theta$`.
- Rational integrands with degree gap at least 2: close in either half-plane, the arc vanishes.
- `$e^{ikx}$`: close above for `$k > 0$`, below (with `$-2\pi i$`) for `$k < 0$`. Jordan's lemma needs only `$f \to 0$`. Never put `$\cos kz$` on a big arc.
- Poles on the axis: principal value, `$\pi i\,\text{Res}$` each. `$\int\frac{\sin ax}{x}dx = \pi$` for `$a > 0$`.
- Keyhole for `$x^{a-1}$` and `$\ln x$`, wedge for `$1/(1 + x^n)$` and Fresnel, rectangle for `$e^{ax}/(1 + e^x)$`. Branch points have no residue: cut, and track the branch.
- `$\sum f(n) = -\sum\text{Res}[\pi\cot(\pi z)f]$` at the poles of `$f$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [residues practice page](/learn/courses/gate-physics/practice/residues/).

<div class="qbank" data-bank="physics" data-topics="residues" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 1.3, analytic functions and Cauchy's theorem](/learn/courses/gate-physics/complex-analysis/). **Next:** [lesson 1.5, Fourier and Laplace transforms](/learn/courses/gate-physics/fourier-laplace-transforms/), where residues invert transforms. Back to the [GATE Physics course home](/learn/courses/gate-physics/).
