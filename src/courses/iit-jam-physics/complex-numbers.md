---
title: Complex numbers and Euler's formula
seoTitle: Complex numbers and Euler's formula for IIT JAM Physics
summary: 'Complex numbers as points and arrows, modulus and argument, polar form and Euler formula, De Moivre, roots of unity, complex logarithms and powers, and phasors for oscillations and AC circuits, with the quadrant and branch traps JAM sets.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: What does multiplying a complex number by i do to its point on the complex plane?
    choices: ['Rotates it by 90° anticlockwise about the origin', 'Reflects it in the real axis', 'Doubles its distance from the origin', 'Rotates it by 180°']
    ans: 0
    why: i = e^(iπ/2) has modulus 1 and argument 90°, so multiplying by it keeps the length and adds 90° to the angle.
  - q: What is the principal argument of −1 − i?
    choices: ['−135°', '45°', '225°', '−45°']
    ans: 0
    why: The point (−1, −1) is in the third quadrant. Its reference angle is 45°, so the argument is −(180° − 45°) = −135°. The principal value lies between −180° and 180°, so 225° is not it.
  - q: How many distinct complex solutions does z⁵ = 1 have, and where do they lie?
    choices: ['Five, at the corners of a regular pentagon on the unit circle', 'One, z = 1', 'Five, all on the real axis', 'Two, z = ±1']
    ans: 0
    why: The solutions are e^(2πik/5) for k = 0 to 4, equally spaced by 72° round the unit circle.
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 2'
  - 'R. V. Churchill and J. W. Brown, Complex Variables and Applications, 9th ed. (2013), chapters 1 to 3'
  - 'T. Needham, Visual Complex Analysis (1997), chapter 1'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 40 minutes.** By the end you will be able to move between the `$x + iy$` and `$re^{i\theta}$` forms without slips, raise complex numbers to any power and find all their roots, take logarithms and complex powers correctly, and use phasors to add oscillations and analyse AC circuits.

<div class="bigidea">A complex number is an arrow in a plane. Adding arrows is adding complex numbers; multiplying them rotates and stretches. Euler's formula, e^(iθ) = cos θ + i sin θ, is the bridge that turns trigonometry into simple algebra.</div>

## 1. Numbers that live in a plane

Start from `$i^2 = -1$`. A complex number `$z = x + iy$` has a real part `$x = \operatorname{Re}z$` and an imaginary part `$y = \operatorname{Im}z$`, and you can draw it as the point `$(x, y)$`, or the arrow from the origin to that point.

- **Adding** is adding arrows tip to tail: `$(1 + 2i) + (3 - i) = 4 + i$`.
- **Multiplying** uses `$i^2 = -1$`: `$(1 + i)(2 - 3i) = 2 - 3i + 2i - 3i^2 = 5 - i$`.
- **Conjugate** `$\bar z = x - iy$`: the mirror image in the real axis. `$z\bar z = x^2 + y^2$` is always real.
- **Dividing**: multiply top and bottom by the conjugate of the bottom. `$\dfrac{1}{1 + i} = \dfrac{1 - i}{(1 + i)(1 - i)} = \dfrac{1 - i}{2}$`.
- **Powers of i** repeat every 4: `$i, -1, -i, 1$`. So `$i^{103} = i^{3} = -i$` (103 leaves remainder 3 on division by 4).

## 2. Modulus and argument: the polar form

The length of the arrow is the **modulus**, and its angle from the positive real axis is the **argument**:

```math
|z| = r = \sqrt{x^2 + y^2}, \qquad \arg z = \theta, \quad x = r\cos\theta,\ y = r\sin\theta
```

**The quadrant trap.** A calculator's `$\tan^{-1}(y/x)$` cannot tell `$1 + i$` from `$-1 - i$`: both have `$y/x = 1$`. Always find the reference angle `$\tan^{-1}|y/x|$` and then place it using the signs of `$x$` and `$y$`. The **principal argument** `$\operatorname{Arg}z$` is the value in `$(-\pi, \pi]$`.

| Point | Quadrant | Principal argument |
|---|---|---|
| `$1 + i\sqrt3$` | first | `$60^\circ$` |
| `$-1 + i\sqrt3$` | second | `$180^\circ - 60^\circ = 120^\circ$` |
| `$-1 - i$` | third | `$-(180^\circ - 45^\circ) = -135^\circ$` |
| `$1 - i$` | fourth | `$-45^\circ$` |

<div class="meaning">

<dl>
<dt>|z|</dt><dd>the length of the arrow: distance of the point from 0</dd>
<dt>arg z</dt><dd>the direction of the arrow, measured anticlockwise from the positive real axis</dd>
<dt>z̄</dt><dd>the mirror image across the real axis (same length, opposite angle)</dd>
<dt>|z − a|</dt><dd>the distance between the points z and a</dd>
<dt>Physical meaning</dt><dd>An oscillation A cos(ωt + φ) is the shadow of an arrow of length A turning at rate ω: its complex amplitude Ae^(iφ) holds both the size and the phase in one number.</dd>
</dl>

</div>

That last meaning of `$|z - a|$` turns many locus questions into pictures: `$|z - 1| = |z + 1|$` is the set of points equally far from 1 and `$-1$`, the imaginary axis; `$|z - 2i| = 3$` is a circle of radius 3 about `$2i$`.

## 3. Euler's formula

The single most useful formula in mathematical physics:

```math
e^{i\theta} = \cos\theta + i\sin\theta
```

You can see why from the Taylor series ([lesson 1.1](/learn/courses/iit-jam-physics/calculus-and-series/)): put `$x = i\theta$` in `$e^x = 1 + x + x^2/2! + \dots$` and collect the real terms (`$1 - \theta^2/2! + \dots = \cos\theta$`) and the imaginary ones (`$\theta - \theta^3/3! + \dots = \sin\theta$`). So every complex number can be written

```math
z = r\,e^{i\theta}
```

and the rules of exponents do the rest:

```math
z_1z_2 = r_1r_2\,e^{i(\theta_1 + \theta_2)}, \qquad \frac{z_1}{z_2} = \frac{r_1}{r_2}\,e^{i(\theta_1 - \theta_2)}
```

**Multiplying multiplies the lengths and adds the angles.** Multiplying by `$i = e^{i\pi/2}$` is a quarter turn; multiplying by `$-1 = e^{i\pi}$` is a half turn (that is `$e^{i\pi} + 1 = 0$`). To rotate a point `$z$` by `$90^\circ$` about another point `$c$`, shift, turn, shift back: `$(z - c)\,i + c$`.

Euler's formula also gives cosine and sine as exponentials, which turns hard trigonometry into algebra:

```math
\cos\theta = \frac{e^{i\theta} + e^{-i\theta}}{2}, \qquad \sin\theta = \frac{e^{i\theta} - e^{-i\theta}}{2i}
```

Compare `$\cosh x = (e^x + e^{-x})/2$`: so `$\cos(ix) = \cosh x$` and `$\cosh(ix) = \cos x$`. A complex cosine can exceed 1: `$\cos i = \cosh1 \approx 1.543$`, and `$\sin z = 2$` has solutions (with imaginary part `$\pm\cosh^{-1}2$`).

## 4. De Moivre: powers made easy

Raising `$re^{i\theta}$` to the power `$n$` just raises `$r$` and multiplies the angle:

```math
(re^{i\theta})^n = r^n e^{in\theta}, \qquad (\cos\theta + i\sin\theta)^n = \cos n\theta + i\sin n\theta
```

Move the sliders: with `$|z| = 1$` the powers walk round the unit circle in equal steps; with `$|z| > 1$` they spiral out.

<figure class="fig" data-fig="complex-powers"><figcaption>Each multiplication by z turns by arg z and scales by |z|. Switch to "Roots" to see the n solutions of zⁿ = 1 as a regular polygon.</figcaption></figure>

**Worked example.** Find `$(1 + i\sqrt3)^5$`.

1. Polar form: `$r = \sqrt{1 + 3} = 2$`, `$\theta = 60^\circ$`, so `$1 + i\sqrt3 = 2e^{i\pi/3}$`.
2. Fifth power: `$2^5e^{i5\pi/3} = 32(\cos300^\circ + i\sin300^\circ)$`.
3. `$= 32\left(\tfrac12 - i\tfrac{\sqrt3}{2}\right) = 16 - 16\sqrt3\,i$`.

Expanding with the binomial theorem would take six terms; De Moivre takes one line.

<div class="problem" data-problem="complex-power"></div>

**Multiple-angle formulas for free.** Take the real part of `$(\cos\theta + i\sin\theta)^3$`: `$\cos3\theta = \cos^3\theta - 3\cos\theta\sin^2\theta = 4\cos^3\theta - 3\cos\theta$`. Going the other way, `$\cos^4\theta = \tfrac1{16}(e^{i\theta} + e^{-i\theta})^4 = \tfrac18(\cos4\theta + 4\cos2\theta + 3)$`, which is how averages like `$\langle\cos^4\theta\rangle = \tfrac38$` are found.

## 5. Roots: n answers, not one

An equation `$z^n = w$` has exactly `$n$` solutions. Write `$w = Re^{i\phi}$`, remembering that the angle is only fixed up to whole turns, `$\phi + 2\pi k$`:

```math
z_k = R^{1/n}\,e^{i(\phi + 2\pi k)/n}, \qquad k = 0, 1, \dots, n - 1
```

They sit at the corners of a regular `$n$`-gon of radius `$R^{1/n}$`. The **`$n$`th roots of unity** `$\omega^k$` with `$\omega = e^{2\pi i/n}$` solve `$z^n = 1$`, and:

- they add up to zero: `$1 + \omega + \omega^2 + \dots + \omega^{n-1} = 0$` (so, for example, `$\sum_k\cos(2\pi k/n) = 0$`);
- the cube roots `$1, \omega, \omega^2$` satisfy `$1 + \omega + \omega^2 = 0$` and `$\omega^2 = \bar\omega$`;
- `$\prod_{k=1}^{n-1}(1 - \omega^k) = n$`, from `$z^n - 1 = (z - 1)(1 + z + \dots + z^{n-1})$`.

**Worked example.** The cube roots of `$8i$`: `$8i = 8e^{i\pi/2}$`, so `$z_k = 2e^{i(\pi/6 + 2\pi k/3)}$`: `$\sqrt3 + i$`, `$-\sqrt3 + i$` and `$-2i$`. Note that `$2i$` is **not** one of them: `$(2i)^3 = -8i$`.

## 6. Logarithms and complex powers

Because `$e^{i\theta}$` repeats every `$2\pi$`, the logarithm has infinitely many values:

```math
\log z = \ln|z| + i(\operatorname{Arg}z + 2\pi k), \qquad \operatorname{Log}z = \ln|z| + i\operatorname{Arg}z \ \text{(principal)}
```

So `$\operatorname{Log}(-2) = \ln2 + i\pi$`: negative numbers do have logarithms once complex values are allowed. Complex powers are defined through the logarithm, `$a^b = e^{b\log a}$`:

```math
i^{\,i} = e^{i\operatorname{Log}i} = e^{i\cdot i\pi/2} = e^{-\pi/2} \approx 0.208
```

which is a real number. Rules you may *not* carry over from real numbers: `$\operatorname{Log}(z_1z_2) = \operatorname{Log}z_1 + \operatorname{Log}z_2$` can fail by `$2\pi i$`, and `$\operatorname{Log}(e^z) = z$` only when `$-\pi < \operatorname{Im}z \le \pi$`. What always holds is `$e^{\operatorname{Log}z} = z$`.

<div class="myth">

**"|e^(iz)| is always 1."** Only when `$z$` is real. For `$z = 2 + 3i$`, `$iz = -3 + 2i$`, and `$|e^{iz}| = e^{-3}$`. The rule is: **the real part of the exponent sets the size, the imaginary part sets the angle**: `$|e^{a + ib}| = e^a$`. The same idea explains damped waves: `$e^{i(kx - \omega t)}$` with a complex `$k$` decays in space.

</div>

## 7. Phasors: oscillations as turning arrows

Any oscillation `$A\cos(\omega t + \phi)$` is the real part of `$Ae^{i\phi}e^{i\omega t}$`. The time factor `$e^{i\omega t}$` is shared, so all you need to keep is the **phasor** `$Ae^{i\phi}$`. Then:

- **Adding oscillations** of the same frequency is adding arrows. `$2\cos\omega t + 2\cos(\omega t + \pi/3)$` has phasor `$2 + 2e^{i\pi/3} = 3 + i\sqrt3$`, amplitude `$\sqrt{12} = 2\sqrt3$`. In general `$A = \sqrt{A_1^2 + A_2^2 + 2A_1A_2\cos\phi}$`, the formula behind interference.
- **Differentiating** is multiplying by `$i\omega$`, so a differential equation becomes algebra. This is exactly how the forced oscillator of [lesson 1.7](/learn/courses/iit-jam-physics/differential-equations/) is solved.
- **AC circuits:** resistors, inductors and capacitors have impedances `$R$`, `$i\omega L$` and `$1/(i\omega C)$`, and they combine like resistors. For `$Z = 3 + 4i\ \Omega$` the size of the current is set by `$|Z| = 5\ \Omega$` and it lags the voltage by `$\arg Z = \tan^{-1}(4/3) = 53.13^\circ$`.

Try it in fibub's [circuit simulator](/science/circuit-simulator/), and see sums of many turning arrows in the [Fourier visualiser](/science/fourier-visualiser/).

<div class="keypoints">

- `$z = x + iy = re^{i\theta}$` with `$r = |z|$` and `$\theta = \arg z$`; place the angle using the signs of `$x$` and `$y$`, principal value in `$(-\pi, \pi]$`.
- Euler: `$e^{i\theta} = \cos\theta + i\sin\theta$`. Multiplying multiplies moduli and adds arguments; multiplying by `$i$` turns by `$90^\circ$`.
- De Moivre: `$(re^{i\theta})^n = r^ne^{in\theta}$`; it gives multiple-angle formulas and powers in one line.
- `$z^n = w$` has `$n$` roots on a regular polygon; the `$n$`th roots of unity add to zero.
- `$\operatorname{Log}z = \ln|z| + i\operatorname{Arg}z$`; `$a^b = e^{b\log a}$`, so `$i^i = e^{-\pi/2}$`. `$|e^{a + ib}| = e^a$`.
- Phasors turn oscillations into arrows: add them for interference, use impedances `$R$`, `$i\omega L$`, `$1/(i\omega C)$` for AC circuits.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [complex numbers practice page](/learn/courses/iit-jam-physics/practice/complex-numbers/).

<div class="qbank" data-bank="physics" data-topics="complex-numbers" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 1.8, matrices and eigenvalues](/learn/courses/iit-jam-physics/matrices/). **Next:** [lesson 1.10](/learn/courses/iit-jam-physics/fourier-series/), Fourier series, where Euler's formula writes any periodic signal as a sum of turning arrows. For GATE and CSIR NET, continue with [analytic functions and Cauchy's theorem](/learn/courses/gate-physics/complex-analysis/) in the GATE Physics course.
