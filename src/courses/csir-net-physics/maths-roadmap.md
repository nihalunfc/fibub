---
title: 'Mathematical methods: what NET asks and where to study it'
seoTitle: CSIR NET Physics mathematical methods roadmap
summary: 'What CSIR NET asks from mathematical physics in Part B (linear algebra, complex analysis, transforms, special functions, probability) and Part C (Green''s functions, PDEs, numerical methods, tensors, group theory), the order to study it, the GATE and JAM lessons that teach each topic, a self-check list and a worked contour-integral example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'The integral of 1/(x² + a²)² over the whole real line (a > 0) is'
    choices: ['π/(2a³)', 'π/a', 'π/(4a³)', '2π/a³']
    ans: 0
    why: 'Close in the upper half plane; the double pole at z = ia has residue 1/(4ia³), so the integral is 2πi/(4ia³) = π/(2a³).'
  - q: 'A real symmetric 3 × 3 matrix has trace 6 and determinant 0, and one eigenvalue is 2. The other two are'
    choices: ['4 and 0', '2 and 2', '3 and 1', '6 and 0']
    ans: 0
    why: 'The eigenvalues add to the trace (6) and multiply to the determinant (0). With 2 given, the other two add to 4 and one of them is 0.'
  - q: 'Which NET maths topic is asked only in Part C?'
    choices: ['Numerical methods such as Simpson''s rule and Runge-Kutta', 'Eigenvalues of matrices', 'Fourier series', 'Residues']
    ans: 0
    why: 'The syllabus puts computational techniques, Green''s functions, PDEs in 2 and 3 dimensions, tensors and group theory in the advanced part; the others are core.'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus: Mathematical Methods of Physics (core and advanced), CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (Academic Press, 2012)'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (Wiley, 2006)'
  - 'K. F. Riley, M. P. Hobson and S. J. Bence, Mathematical Methods for Physics and Engineering, 3rd ed. (Cambridge, 2006)'
---

**Module 2 · about 30 minutes to read, 3 weeks to work through.** This roadmap tells you what NET asks from mathematical methods, the order to learn it, where each topic is taught on fibub, and how to check you are ready. Maths questions are a steady source of marks in both Parts B and C, and every other unit uses these tools.

<div class="bigidea">NET maths is a toolkit, not a theory course. Each question asks you to use one tool cleanly: diagonalise a matrix, close a contour, expand in Legendre polynomials, apply a transform. Learn each tool with one worked example you can redo from memory.</div>

## 1. What NET asks

Described from the published syllabus (check the current one on the official site):

**Part B (core):**
- Dimensional analysis; vector algebra and vector calculus.
- Linear algebra: matrices, the Cayley-Hamilton theorem, eigenvalues and eigenvectors.
- First- and second-order linear ODEs; special functions (Legendre, Hermite, Bessel, Laguerre).
- Fourier series; Fourier and Laplace transforms.
- Complex analysis: analytic functions, Taylor and Laurent series, poles, residues and real integrals.
- Probability: random variables, binomial, Poisson and normal distributions, the central limit theorem.

**Part C (advanced):**
- Green's functions; Laplace, wave and heat equations in two and three dimensions.
- Numerical methods: roots, interpolation, trapezoid and Simpson's rules, Runge-Kutta, finite differences.
- Tensors; introductory group theory (SU(2) and O(3)).

Typical Part B questions take one step (an eigenvalue, a residue, a transform pair). Part C questions chain two: a Green's function then an integral, a symmetry argument then a matrix element, an error estimate for a numerical rule.

<div class="meaning">

<dl>
<dt>Eigenvalue problem</dt><dd>Mv = λv; for any square matrix, the eigenvalues add to the trace and multiply to the determinant</dd>
<dt>Residue theorem</dt><dd>∮f dz = 2πi × (sum of residues inside); a simple pole at a has residue lim (z − a)f(z)</dd>
<dt>Green's function</dt><dd>the response to a point source; the solution for any source is its integral against the source</dd>
<dt>Physical meaning</dt><dd>Most of physics is linear: superpose simple solutions (eigenvectors, Fourier modes, Legendre terms, point responses) to build any solution.</dd>
</dl>

</div>

## 2. The order to study it

1. **Linear algebra** first, because quantum mechanics is written in it: [vector spaces and Dirac notation](/learn/courses/gate-physics/linear-vector-spaces/), then [Hermitian and unitary matrices](/learn/courses/gate-physics/matrices-eigenvalues/). Refresher: JAM [matrices](/learn/courses/iit-jam-physics/matrices/).
2. **Complex analysis**: [analytic functions and Cauchy's theorem](/learn/courses/gate-physics/complex-analysis/), then [residues and real integrals](/learn/courses/gate-physics/residues/). Refresher: JAM [complex numbers](/learn/courses/iit-jam-physics/complex-numbers/).
3. **ODEs and special functions**: JAM [differential equations](/learn/courses/iit-jam-physics/differential-equations/), then GATE [series solutions: Legendre, Bessel, Hermite](/learn/courses/gate-physics/special-functions/).
4. **Fourier methods**: JAM [Fourier series](/learn/courses/iit-jam-physics/fourier-series/), then GATE [Fourier and Laplace transforms](/learn/courses/gate-physics/fourier-laplace-transforms/).
5. **PDEs and Green's functions** (Part C): [separation of variables](/learn/courses/gate-physics/partial-differential-equations/) and [the delta function and Green's functions](/learn/courses/gate-physics/delta-greens-functions/).
6. **Probability**: [probability and statistics for physicists](/learn/courses/gate-physics/probability/), then lesson 2.3 of this course (random variables and distributions).
7. **Tensors**: [tensors](/learn/courses/gate-physics/tensors/).
8. **NET extras in this course**: lesson 2.2 (group theory for physicists) and lesson 2.4 (numerical methods: roots, integration and ODEs).

Vector calculus and dimensional analysis are usually already strong; if not, use JAM [vector calculus](/learn/courses/iit-jam-physics/vector-calculus/) and [integral theorems](/learn/courses/iit-jam-physics/integral-theorems/).

## 3. Where each topic is taught

| Topic | Learn it from | NET emphasis |
|---|---|---|
| Matrices, eigenvalues, Cayley-Hamilton | [GATE 1.2](/learn/courses/gate-physics/matrices-eigenvalues/), [JAM matrices](/learn/courses/iit-jam-physics/matrices/) | functions of matrices, `$e^{i\theta\sigma}$`, trace and determinant tricks |
| Vector spaces, Dirac notation | [GATE 1.1](/learn/courses/gate-physics/linear-vector-spaces/) | projectors, commuting operators |
| Complex analysis, residues | [GATE 1.3](/learn/courses/gate-physics/complex-analysis/), [GATE 1.4](/learn/courses/gate-physics/residues/) | branch cuts, principal values, Laurent series coefficients |
| Special functions | [GATE 1.6](/learn/courses/gate-physics/special-functions/) | generating functions, orthogonality integrals, recurrence relations |
| Fourier and Laplace transforms | [GATE 1.5](/learn/courses/gate-physics/fourier-laplace-transforms/) | convolution, solving ODEs with Laplace transforms |
| PDEs, Green's functions | [GATE 1.7](/learn/courses/gate-physics/partial-differential-equations/), [GATE 1.8](/learn/courses/gate-physics/delta-greens-functions/) | Green's function of `$d^2/dx^2 + k^2$`, heat kernel |
| Tensors | [GATE 1.9](/learn/courses/gate-physics/tensors/) | Levi-Civita identities, rank counting |
| Probability | [GATE 1.10](/learn/courses/gate-physics/probability/), lesson 2.3 | Poisson and Gaussian limits, central limit theorem |
| Group theory | lesson 2.2 | group tables, SU(2) and O(3), representations |
| Numerical methods | lesson 2.4 | error of trapezoid versus Simpson, Newton-Raphson, Runge-Kutta steps |

## 4. A worked NET-style example

**Question (Part C style).** For `$a > 0$`, the value of `$\displaystyle\int_{-\infty}^{\infty}\frac{dx}{(x^2 + a^2)^2}$` is (a) `$\pi/a^3$` (b) `$\pi/(2a^3)$` (c) `$\pi/(4a^3)$` (d) `$2\pi/a$`.

**Solution.**

1. The integrand falls like `$1/x^4$`, so the integral over a large semicircle in the upper half plane vanishes and the real integral equals `$2\pi i$` times the residues in the upper half plane.
2. `$f(z) = \frac{1}{(z - ia)^2(z + ia)^2}$` has a double pole at `$z = ia$`. For a double pole, the residue is the derivative of `$(z - ia)^2f(z)$`:

```math
\text{Res} = \frac{d}{dz}(z + ia)^{-2}\Big|_{z = ia} = -2(2ia)^{-3} = \frac{-2}{-8ia^3} = \frac{1}{4ia^3}
```

3. Integral `$= 2\pi i\cdot\frac{1}{4ia^3} = \frac{\pi}{2a^3}$`: option (b).

**Check by dimensions and a limit.** The integrand has dimensions `$[x]^{-4}$`, so the answer goes like `$a^{-3}$`, which rules out (d). Differentiating the known result `$\int dx/(x^2 + a^2) = \pi/a$` with respect to `$a$` gives `$-2a\int dx/(x^2 + a^2)^2 = -\pi/a^2$`, the same answer, without any contour.

**A Part B companion.** For a real symmetric 2 × 2 matrix the eigenvalues are `$\frac{\text{tr}}{2} \pm \sqrt{\frac{\text{tr}^2}{4} - \det}$`. Try it:

<div class="problem" data-problem="net-sym-eigen"></div>

## 5. Self-check before moving on

You are ready for mechanics when you can, without notes:

- find eigenvalues and eigenvectors of a 3 × 3 matrix, and use trace and determinant to check them;
- write `$e^{i\theta\hat n\cdot\vec\sigma}$` as `$\cos\theta + i\hat n\cdot\vec\sigma\sin\theta$` and say why;
- decide whether a function is analytic from the Cauchy-Riemann equations;
- evaluate a real integral by residues, including a double pole and a semicircle argument;
- write the first three Legendre polynomials and the orthogonality integral;
- state the Fourier transform of a Gaussian and of `$e^{-a|x|}$`, and the convolution theorem;
- solve a linear ODE with a Laplace transform;
- write the Green's function for `$y'' = f(x)$` with `$y(0) = y(L) = 0$`;
- give the mean and variance of the binomial, Poisson and normal distributions;
- state the error order of the trapezoid and Simpson rules.

<div class="myth">

**"Maths questions are free marks, so skip practising them."** They are fast marks only if the method is automatic. A residue slip or a forgotten factor of `$2\pi i$` costs as much as a hard physics question, and the options are built around exactly those slips.

</div>

<div class="keypoints">

- Part B: linear algebra, ODEs and special functions, Fourier and Laplace, complex analysis, probability.
- Part C: Green's functions and PDEs, numerical methods, tensors, group theory.
- Order: linear algebra, complex analysis, ODEs and special functions, transforms, PDEs and Green's functions, probability, tensors, then the NET extras (lessons 2.2 to 2.4).
- Learn every tool through one worked example you can redo from memory, and check answers with dimensions and limits.

</div>

## Practise: a mixed maths set

<div class="qbank" data-bank="physics" data-topics="linear-vector-spaces,matrices-eigenvalues,complex-analysis,residues,fourier-laplace-transforms,special-functions,partial-differential-equations,delta-greens-functions,tensors,probability" data-exam="net" data-n="10"></div>

**Next:** [classical mechanics roadmap](/learn/courses/csir-net-physics/mechanics-roadmap/).
