---
title: Analytic functions and Cauchy's theorem
seoTitle: Analytic functions and Cauchy's theorem | GATE Physics
summary: 'Complex differentiability and the Cauchy-Riemann equations, harmonic functions, contour integrals, Cauchy''s theorem and integral formula, Liouville and maximum modulus, Taylor and Laurent series, poles, essential singularities and branch points, Rouche and the argument principle, with GATE-style traps.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: Where is f(z) = |z|² complex-differentiable?
    choices: ['Only at z = 0', 'Everywhere', 'Nowhere', 'On the real axis']
    ans: 0
    why: "With u = x² + y², v = 0, the Cauchy-Riemann equations give 2x = 0 and 2y = 0, true only at the origin. Differentiable at one point is not analytic: |z|² is analytic nowhere."
  - q: What is the value of the integral of e^z/(z − 1) round the circle |z| = 2, anticlockwise?
    choices: ['2πie', '0', '2πi', 'e']
    ans: 0
    why: "Cauchy's integral formula: the integral of f(z)/(z − a) round a curve enclosing a equals 2πi f(a). Here f = e^z and a = 1 is inside, giving 2πie."
  - q: Which of these has a branch point at z = 0?
    choices: ['z^(1/2)', 'e^(1/z)', 'sin z / z', '1/z²']
    ans: 0
    why: "Going once round the origin multiplies z^(1/2) by e^(iπ) = −1, so it does not come back to its starting value. e^(1/z) has an essential singularity, but it is single-valued."
sources:
  - 'R. V. Churchill and J. W. Brown, Complex Variables and Applications, 9th ed. (2013), chapters 2 to 7'
  - 'T. Needham, Visual Complex Analysis (1997), chapters 4, 7 to 9'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 14'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapter 11'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 55 minutes.** By the end you will be able to test a function for analyticity, build an analytic function from its real part, evaluate contour integrals with Cauchy's theorem and integral formula, expand functions in Taylor and Laurent series in the right region, classify singularities (including branch points, which are not singularities you can take residues at), and count zeros with Rouché's theorem. The algebra of complex numbers, Euler's formula and roots are in the IIT JAM lesson on [complex numbers](/learn/courses/iit-jam-physics/complex-numbers/); this lesson starts where it ends.

<div class="bigidea">A complex function that has a derivative in a region is extraordinarily rigid: its values on any closed curve fix its values inside, it has derivatives of every order, and its integral round a loop only notices the singular points the loop encloses.</div>

## 1. Complex differentiability and the Cauchy-Riemann equations

`$f(z) = u(x, y) + iv(x, y)$` is **differentiable** at `$z$` if `$\lim_{h\to0}[f(z + h) - f(z)]/h$` exists, the same for every direction in which the complex number `$h$` shrinks to zero. Approaching along the real and the imaginary axis and demanding the same answer gives the **Cauchy-Riemann (CR) equations**:

```math
\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}, \qquad \frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}, \qquad f'(z) = u_x + iv_x
```

Drag z₁ and z₂ on the Argand plane and press Animate to watch multiplication turn and stretch.

<figure class="fig" data-fig="@math-complex-mult"><figcaption>Notice that |z₁z₂| = |z₁||z₂| and arg(z₁z₂) = arg z₁ + arg z₂: multiplying by z₂ rotates by its argument and scales by its modulus.</figcaption></figure>

With continuous partial derivatives, CR is also sufficient. In polar form `$z = re^{i\theta}$`: `$u_r = \tfrac1r v_\theta$`, `$v_r = -\tfrac1r u_\theta$` (an angle is not a length, hence the `$1/r$`).

`$f$` is **analytic** at a point if it is differentiable in a whole neighbourhood of it, and **entire** if analytic everywhere: polynomials, `$e^z$`, `$\sin z$`, `$\cos z$` and their sums, products and compositions. A quick test: anything that genuinely depends on `$\bar z$` fails. `$\bar z$` itself fails CR everywhere (`$u_x = 1$`, `$v_y = -1$`); `$\lvert z\rvert^2 = z\bar z$` satisfies CR only at `$z = 0$`, so it is differentiable there but analytic nowhere. A non-constant real-valued function is never analytic.

**Harmonic functions.** Differentiating CR once more gives `$\nabla^2u = \nabla^2v = 0$`: the real and imaginary parts of an analytic function are **harmonic** (`$x^2 - y^2$`, `$e^x\sin y$`, `$x^3 - 3xy^2$`; but not `$x^2 + y^2$`). Given a harmonic `$u$`, CR fixes its **harmonic conjugate** `$v$` up to a constant.

**Worked example.** Find analytic `$f$` with `$v = 2xy + y$` and `$f(0) = 0$`.

1. `$u_x = v_y = 2x + 1$`, so `$u = x^2 + x + h(y)$`.
2. `$u_y = h'(y) = -v_x = -2y$`, so `$h = -y^2 + C$`, with `$C = 0$` from `$f(0) = 0$`.
3. `$u = x^2 - y^2 + x$` and `$f = z^2 + z$`. Shortcut (Milne-Thomson): `$f'(z) = v_y + iv_x$` evaluated at `$y = 0$`, `$x = z$`, gives `$2z + 1$`, so `$f = z^2 + z$` at once.

<div class="meaning">

<dl>
<dt>Analytic f</dt><dd>has a complex derivative throughout a region, and then derivatives of every order and a convergent Taylor series</dd>
<dt>u, v harmonic</dt><dd>solve Laplace's equation: 2D electrostatic potentials, steady temperatures and ideal fluid flow</dd>
<dt>Level curves of u and v</dt><dd>cross at right angles (where f′ ≠ 0): equipotentials and field lines</dd>
<dt>Singularity</dt><dd>a point where f stops being analytic; contour integrals only feel these</dd>
<dt>Physical meaning</dt><dd>Analytic functions package a pair of solutions of Laplace's equation into one complex number, which is why complex methods solve 2D field problems and evaluate the integrals of wave physics.</dd>
</dl>

</div>

## 2. Contour integrals

Along a curve `$z(t)$`, `$\int_C f\,dz = \int f(z(t))\,z'(t)\,dt$`. The one integral to remember, round the circle `$z = a + Re^{i\theta}$`:

```math
\oint_{|z - a| = R}(z - a)^n\,dz = \int_0^{2\pi}R^ne^{in\theta}\,iRe^{i\theta}\,d\theta = \begin{cases} 2\pi i & n = -1 \\ 0 & n \ne -1 \end{cases}
```

Every other power has an antiderivative that returns to its starting value; `$1/(z - a)$` does not, because its antiderivative `$\ln(z - a)$` gains `$2\pi i$` per turn. For estimates, the **ML inequality** `$\lvert\int_Cf\,dz\rvert \le \max_C\lvert f\rvert\times\text{length}(C)$` is the standard tool.

## 3. Cauchy's theorem

**Cauchy's theorem.** If `$f$` is analytic on and inside a simple closed curve `$C$`, then

```math
\oint_C f(z)\,dz = 0
```

(Proof sketch: Green's theorem turns the integral into `$\iint(-v_x - u_y) + i(u_x - v_y)\,dA$`, and CR makes both brackets vanish.) Consequences:

- Integrals of analytic functions are **path independent**: `$\int_0^{1+i}z^2\,dz = (1 + i)^3/3 = (-2 + 2i)/3$` along any path.
- A contour can be **deformed** freely as long as it does not cross a singularity. A loop round several singular points equals the sum of small loops round each one.

Drag the circle over the three poles below. The figure adds up `$f(z)\,dz$` numerically: the result is zero whenever no pole is inside, and otherwise depends only on which poles are enclosed, not on the size or position of the circle.

<figure class="fig" data-fig="contour-poles"><figcaption>A circular contour over a function with three simple poles, integrated numerically. The value changes only when a pole crosses the contour; for the entire function e^z it is always zero.</figcaption></figure>

The hypothesis matters: `$\oint_{|z|=1}\bar z\,dz = \oint dz/z = 2\pi i$` (on the unit circle `$\bar z = 1/z$`), not zero, because `$\bar z$` is not analytic.

## 4. Cauchy's integral formula

If `$f$` is analytic on and inside `$C$` and `$a$` is inside,

```math
f(a) = \frac{1}{2\pi i}\oint_C\frac{f(z)}{z - a}\,dz, \qquad f^{(n)}(a) = \frac{n!}{2\pi i}\oint_C\frac{f(z)}{(z - a)^{n+1}}\,dz
```

The values on the boundary determine everything inside, and an analytic function automatically has derivatives of every order.

**Worked example.** `$\oint_{|z|=2}\frac{e^{2z}}{(z + 1)^4}\,dz$`.

1. `$a = -1$` is inside `$\lvert z\rvert = 2$`; `$f = e^{2z}$` is entire; `$n = 3$`.
2. `$f'''(z) = 8e^{2z}$`, so `$f'''(-1) = 8e^{-2}$`.
3. The integral is `$\frac{2\pi i}{3!}\cdot8e^{-2} = \frac{8\pi i}{3e^2} \approx 0.361\,\pi i$`.

Always check first which points are inside: `$\oint_{|z-1|=1}\frac{dz}{z^2 - 1}$` encloses only `$z = 1$`, giving `$2\pi i\cdot\frac{1}{1 + 1} = \pi i$`.

<div class="problem" data-problem="cax-cauchy"></div>

**Big consequences.**

- **Liouville:** a bounded entire function is constant (estimate `$f'(a)$` on a huge circle). So `$\sin z$` must be unbounded: `$\sin(iy) = i\sinh y$`. Applied to `$1/p(z)$`, it proves every non-constant polynomial has a root. Variants: if `$\lvert f\rvert \le C\lvert z\rvert^n$`, `$f$` is a polynomial of degree at most `$n$`; if `$\text{Re}f < 1$` everywhere, apply Liouville to `$e^f$`.
- **Maximum modulus:** a non-constant analytic `$\lvert f\rvert$` has no maximum inside a region; it is reached on the boundary. On `$\lvert z\rvert \le 1$`, `$\lvert z^2 + 2z\rvert$` peaks at `$z = 1$` with value 3. If `$f$` has no zeros, the minimum is on the boundary too.

## 5. Taylor and Laurent series

An analytic function equals its Taylor series in the largest disc around the centre that avoids all singularities: **the radius of convergence is the distance to the nearest singularity**, even one off the real axis. `$1/(z^2 + 4)$` is smooth on the whole real line, yet its Taylor series about `$z = 1$` has radius `$\lvert 1 - 2i\rvert = \sqrt5$`.

In an **annulus** `$r < \lvert z - a\rvert < R$` free of singularities, `$f$` has a **Laurent series** with negative powers too:

```math
f(z) = \sum_{n=-\infty}^{\infty}c_n(z - a)^n, \qquad c_n = \frac{1}{2\pi i}\oint\frac{f(z)}{(z - a)^{n+1}}dz
```

The same function has different Laurent series in different annuli. For `$\frac{1}{(z - 1)(z - 2)} = \frac{1}{z - 2} - \frac{1}{z - 1}$`:

- `$\lvert z\rvert < 1$`: both parts in positive powers (a Taylor series).
- `$1 < \lvert z\rvert < 2$`: `$\frac{1}{z - 2} = -\sum_{n\ge0}\frac{z^n}{2^{n+1}}$` but `$-\frac{1}{z - 1} = -\sum_{n\ge1}z^{-n}$`, because `$\lvert 1/z\rvert < 1$` there. The coefficient of `$z^2$` is `$-\tfrac18$`; every negative power has coefficient `$-1$`.
- `$\lvert z\rvert > 2$`: both parts in powers of `$1/z$`.

In practice you rarely use the coefficient integral; you build Laurent series from geometric series and known Taylor series. The coefficient `$c_{-1}$` is the **residue**, the subject of the [next lesson](/learn/courses/gate-physics/residues/).

## 6. Zeros and singularities

Zeros of a non-zero analytic function are isolated, each with a finite order. An isolated singularity at `$a$` is classified by the principal part (negative powers) of the Laurent series in `$0 < \lvert z - a\rvert < r$`:

- **Removable:** no negative powers. `$\sin z/z$` (define its value at 0 as 1).
- **Pole of order m:** negative powers stop at `$(z - a)^{-m}$`. Count orders of zeros on top and bottom: `$\frac{1}{z^2\sin z}$` has a pole of order 3 at 0; `$\frac{1 - \cos z}{z^3}$` (top order 2) has a simple pole.
- **Essential:** infinitely many negative powers. `$e^{1/z} = \sum z^{-n}/n!$`. Near an essential singularity `$f$` takes every value, with at most one exception, infinitely often (Picard): along the positive real axis `$e^{1/x} \to \infty$`, along the negative one it tends to 0.

**Branch points are different.** At a branch point the function is not single-valued: going once round it, `$z^{1/2}$` changes sign and `$\ln z$` gains `$2\pi i$`. There is no Laurent series there and no residue. To work with such functions you draw a **branch cut**, a line the contour may not cross, joining branch points (possibly via infinity). Check infinity too: `$\sqrt z$` has branch points at 0 and `$\infty$`, but `$\sqrt{z(z - 1)}$` has them only at 0 and 1 (a loop enclosing both changes the phase by `$2\pi$`, no net effect), so one cut from 0 to 1 suffices.

## 7. Counting zeros: the argument principle and Rouché

For `$f$` analytic inside `$C$` except for poles, and with no zeros or poles on `$C$`:

```math
\frac{1}{2\pi i}\oint_C\frac{f'(z)}{f(z)}\,dz = N - P
```

Move and resize the loop in the z-plane, and press Play to follow a point round both pictures.

<figure class="fig" data-fig="@math-winding"><figcaption>Notice that the image curve winds round the origin once for each zero inside the loop and backwards once for each pole inside: winding = Z − P.</figcaption></figure>

(zeros minus poles inside, with multiplicity). For `$f = \frac{z^2 + 1}{z^3(z - 3)}$` on `$\lvert z\rvert = 2$`: `$N = 2$`, `$P = 3$`, so the answer is `$-1$`.

**Rouché's theorem:** if `$\lvert g\rvert > \lvert h\rvert$` on `$C$`, then `$g$` and `$g + h$` have the same number of zeros inside. For `$z^5 + 6z + 1$`: on `$\lvert z\rvert = 1$`, `$\lvert 6z\rvert = 6 > \lvert z^5 + 1\rvert$`, so one zero in the unit disc; on `$\lvert z\rvert = 2$`, `$\lvert z^5\rvert = 32 > \lvert 6z + 1\rvert$`, so all five are inside radius 2. The annulus `$1 < \lvert z\rvert < 2$` holds four.

**Conformal maps.** Where `$f' \ne 0$`, an analytic map preserves angles. `$w = z^2$` doubles angles at the origin (the first quadrant opens to the upper half-plane) and is two-to-one; `$w = 1/z$` sends circles through the origin to straight lines (`$\lvert z - 1\rvert = 1$` becomes `$\text{Re}\,w = \tfrac12$`). Plot real and imaginary parts of any function with fibub's [graphing calculator](/science/function-grapher/).

<div class="myth">

**"Cauchy's theorem says a closed contour integral is always zero."** Only for a function analytic on and inside the contour. `$\oint dz/z = 2\pi i$` round the origin, `$\oint\bar z\,dz = 2\pi i$` round the unit circle (`$\bar z$` is analytic nowhere), and a loop round a branch point does not even have a well-defined integrand unless a cut is chosen. Before writing 0, check two things: is the function analytic, and is every singular point outside the curve?

</div>

<div class="keypoints">

- CR: `$u_x = v_y$`, `$u_y = -v_x$` (polar: `$u_r = v_\theta/r$`, `$v_r = -u_\theta/r$`). Analytic = differentiable in a neighbourhood. Functions of `$\bar z$` and real non-constant functions are not analytic.
- Real and imaginary parts of analytic functions are harmonic; Milne-Thomson rebuilds `$f$` from `$u$` or `$v$`.
- `$\oint(z - a)^n dz = 2\pi i$` for `$n = -1$`, else 0. Cauchy: analytic inside means `$\oint f\,dz = 0$`, and contours deform past regular points.
- `$f^{(n)}(a) = \frac{n!}{2\pi i}\oint\frac{f}{(z - a)^{n+1}}dz$`. Liouville: bounded entire means constant. Maximum modulus on the boundary.
- Radius of convergence = distance to nearest singularity. Laurent series depend on the annulus; build them from geometric series.
- Removable, pole of order `$m$`, essential (infinite principal part). Branch points are not poles: no residue, need a cut. Check infinity.
- Argument principle: `$\frac{1}{2\pi i}\oint f'/f = N - P$`. Rouché compares a dominant term on each circle.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level. More on the [complex analysis practice page](/learn/courses/gate-physics/practice/complex-analysis/).

<div class="qbank" data-bank="physics" data-topics="complex-analysis" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 1.2, Hermitian and unitary matrices](/learn/courses/gate-physics/matrices-eigenvalues/). **Next:** [lesson 1.4, the residue theorem and real integrals](/learn/courses/gate-physics/residues/). Back to the [GATE Physics course home](/learn/courses/gate-physics/).
