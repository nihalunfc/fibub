---
title: Boundary value problems and Laplace's equation
seoTitle: Boundary value problems in electrostatics for GATE Physics
summary: 'Uniqueness with Dirichlet, Neumann and mixed data, separation of variables in Cartesian, spherical and cylindrical coordinates, Legendre expansions on spheres and shells, spheres and cylinders in uniform fields, fields at corners and edges, and the symmetry tricks that solve a problem in one line.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: A thin spherical surface is held at V0 cos²θ and encloses no charge. What is the potential at its centre?
    choices: ['V0/3', 'V0/2', '0', '2V0/3']
    ans: 0
    why: "The centre value of a harmonic function is its average over the sphere, and the average of cos²θ over a sphere is 1/3. In Legendre form, cos²θ = 1/3 + (2/3)P2, and only the l = 0 part survives at r = 0."
  - q: Outside a sphere held at V0 P2(cos θ), with no charge outside, how does the potential fall off?
    choices: ['As 1/r³', 'As 1/r²', 'As 1/r', 'As r²']
    ans: 0
    why: "Each Legendre mode P_l carries r^l inside and r^-(l+1) outside. For l = 2 the outside solution is V0 (R/r)³ P2."
  - q: Near the sharp edge of a thin charged metal sheet, how does the surface charge density vary with distance s from the edge?
    choices: ['As s^(-1/2)', 'As 1/s', 'It stays finite', 'As s^(1/2)']
    ans: 0
    why: "The charge-free region round an edge spans 2π, so V grows as s^(π/2π) = s^(1/2) and E (and σ) as s^(-1/2): large but integrable."
sources:
  - 'J. D. Jackson, Classical Electrodynamics, 3rd ed. (1999), chapters 1 to 3'
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 3'
  - 'W. R. Smythe, Static and Dynamic Electricity, 3rd ed. (1968), chapters 4 and 5'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapters 9 and 15'
  - 'GATE Physics (PH) syllabus, Electromagnetic theory section, published by the organising institute each year'
---

**Module 3 · about 60 minutes.** This lesson turns Laplace's equation from a formula into a working tool. You will learn exactly which boundary data fix a solution, how to build solutions by separating variables in the three coordinate systems GATE uses, how to read off charges, dipole moments and fields from the coefficients, and the handful of symmetry tricks that save whole pages of algebra. Conductors, the basic uniqueness theorem and the simple slot problem are in the IIT JAM lesson on [conductors, Laplace's equation and images](/learn/courses/iit-jam-physics/conductors-images/); look there first if they are new.

<div class="bigidea">In a charge-free region the potential is fixed completely by what happens on the boundary. So any function that obeys Laplace's equation and fits the boundary is the answer, and separation of variables is a systematic way of building that function out of simple pieces.</div>

## 1. What data fix the answer

Poisson's equation `$\nabla^2V = -\rho/\epsilon_0$` holds inside a region; on its closed boundary `$S$` we may give:

- **Dirichlet data:** `$V$` itself on `$S$` (a conductor held at a known potential);
- **Neumann data:** the normal derivative `$\partial V/\partial n = -E_n$` on `$S$` (a known surface charge just inside a conductor, or a known flux);
- **mixed data:** `$V$` on part of `$S$` and `$\partial V/\partial n$` on the rest.

**Why any of these is enough.** Let `$V_1$` and `$V_2$` both solve the problem and put `$U = V_1 - V_2$`. Then `$\nabla^2U = 0$` inside, and Green's first identity with `$\nabla\cdot(U\nabla U) = |\nabla U|^2 + U\nabla^2U$` gives

```math
\int_{\rm region}|\nabla U|^2\,d\tau = \oint_S U\,\frac{\partial U}{\partial n}\,da
```

On each patch of `$S$` either `$U = 0$` (Dirichlet) or `$\partial U/\partial n = 0$` (Neumann), so the right side vanishes. A sum of squares that integrates to zero is zero everywhere: `$\nabla U = 0$`, so the two fields are identical. With pure Neumann data `$U$` can still be a constant; with any Dirichlet patch it is zero.

Two consequences matter in exams:

1. **Too much data is fatal.** Giving both `$V$` and `$\partial V/\partial n$` on all of `$S$` (Cauchy data) over-determines the problem: in general no solution exists.
2. **The second uniqueness theorem.** For a set of conductors, giving the *total charge* on each one (plus `$\rho$` between them) also fixes the field. The same identity, applied with each conductor an equipotential carrying zero net difference charge, does the job. How the charge spreads over each surface comes *out* of the solution.

Neumann data must also be consistent with Gauss's law: `$\oint\partial V/\partial n\,da = -Q_{\rm enc}/\epsilon_0$`.

<div class="meaning">

<dl>
<dt>Harmonic function</dt><dd>a solution of ∇²V = 0; it has no local maxima or minima, and its value at any point is the average over any sphere around it</dd>
<dt>Dirichlet / Neumann</dt><dd>the boundary gives the potential itself / the normal field</dd>
<dt>Uniqueness</dt><dd>one solution only, so a correct guess is the answer, however it was found</dd>
<dt>Separation of variables</dt><dd>try V as a product of functions of one coordinate each; Laplace's equation then splits into ordinary equations linked by separation constants</dd>
<dt>Physical meaning</dt><dd>The boundary is a set of instructions; the potential inside is the smoothest function that follows them. There is never a choice left over.</dd>
</dl>

</div>

Choose an electrode layout and press play. Then click a point to compare its potential with the average of its neighbours.

<figure class="fig" data-fig="@em-laplace-relax"><figcaption>Every free point settles to the average of its neighbours, the defining property of a solution of Laplace's equation; the picture relaxes towards the unique answer.</figcaption></figure>

## 2. Separation in Cartesian coordinates

Try `$V = X(x)Y(y)$` in two dimensions. Dividing `$\nabla^2V = 0$` by `$XY$`:

```math
\frac{X''}{X} + \frac{Y''}{Y} = 0 \quad\Rightarrow\quad \frac{X''}{X} = k^2, \qquad \frac{Y''}{Y} = -k^2
```

Each ratio depends on a different variable, so each is a constant, and the two constants are equal and opposite. **One direction oscillates, the other grows or decays.** The boundary decides which: the direction with two grounded walls gets the sines, because only `$\sin(n\pi y/a)$` vanishes at both `$y = 0$` and `$y = a$`.

**Worked example: one Fourier mode.** A rectangle `$0 \le x \le a$`, `$0 \le y \le b$` is grounded on three sides and held at `$V_0\sin(\pi x/a)$` on the side `$y = b$`. The sines must go along `$x$`; along `$y$` we need a function that vanishes at `$y = 0$`, so `$\sinh$`:

```math
V(x, y) = V_0\sin\frac{\pi x}{a}\,\frac{\sinh(\pi y/a)}{\sinh(\pi b/a)}
```

It is harmonic, it fits all four sides, so by uniqueness it is the answer. For a square, at the centre: `$V_0\sinh(\pi/2)/\sinh\pi = 0.199V_0$`. The potential sags far below the "straight line" guess of `$0.5V_0$`: harmonic functions are dominated by their largest boundary values only nearby.

**Any boundary function.** If the edge is held at a general `$f(x)$`, expand it in a Fourier sine series, `$f(x) = \sum c_n\sin(n\pi x/a)$` with `$c_n = \dfrac2a\displaystyle\int_0^af(x)\sin\dfrac{n\pi x}{a}dx$`, and give each term its own `$\sinh$`. For a constant `$V_0$`, `$c_n = 4V_0/n\pi$` for odd `$n$` and zero for even `$n$`. Higher modes die faster, as `$e^{-n\pi x/a}$`, so a few terms usually suffice away from the edge.

**Two equal walls.** If the walls `$x = \pm b$` are both at `$V_0$` (and `$y = 0, a$` grounded), the solution must be even in `$x$`: use `$\cosh(n\pi x/a)/\cosh(n\pi b/a)$`. Using `$\sinh$` there is the commonest slip.

**Three dimensions.** In a box, `$V = X(x)Y(y)Z(z)$` with `$X''/X = -\alpha^2$`, `$Y''/Y = -\beta^2$` forces `$Z''/Z = \alpha^2 + \beta^2$`. Two directions oscillate and the third decays *faster* than in 2D: for the face mode `$\sin(\pi x/a)\sin(\pi y/a)$` the decay constant is `$\pi\sqrt2/a$`, and in a cube the centre value is only `$0.107V_0$`.

<div class="problem" data-problem="rect-mode"></div>

## 3. Spherical coordinates: Legendre polynomials

With azimuthal symmetry, try `$V = R(r)\Theta(\theta)$`. The angular equation is Legendre's equation, whose solutions finite at both poles are the Legendre polynomials `$P_l(\cos\theta)$`: `$P_0 = 1$`, `$P_1 = \cos\theta$`, `$P_2 = \tfrac12(3\cos^2\theta - 1)$`, `$P_3 = \tfrac12(5\cos^3\theta - 3\cos\theta)$`. The radial equation `$\dfrac{d}{dr}\left(r^2\dfrac{dR}{dr}\right) = l(l+1)R$` is solved by `$r^l$` and `$r^{-(l+1)}$`. So

```math
V(r, \theta) = \sum_{l=0}^{\infty}\left(A_lr^l + \frac{B_l}{r^{l+1}}\right)P_l(\cos\theta)
```

Inside a sphere (origin included) only `$r^l$` survives; outside (potential going to zero) only `$r^{-(l+1)}$`. The coefficients come from orthogonality, `$\displaystyle\int_{-1}^{1}P_lP_{l'}\,dx = \dfrac{2}{2l+1}\delta_{ll'}$`.

**Rule of thumb: each Legendre mode on the surface travels on its own.** If the surface holds `$V_0P_l$`, the inside is `$V_0(r/R)^lP_l$` and the outside `$V_0(R/r)^{l+1}P_l$`. The jump in `$E_r$` at the surface gives the charge on it:

```math
\sigma = \epsilon_0\sum_l(2l+1)\frac{A_l}{R}P_l(\cos\theta) \qquad\Longleftrightarrow\qquad A_l = \frac{\sigma_lR}{(2l+1)\epsilon_0}
```

where `$A_l$` is the surface value of mode `$l$`. Read it either way: given the potential, find the charge; given a shell's charge `$\sigma_lP_l$`, find its potential. For `$\sigma = \sigma_0\cos\theta$` this gives the famous uniform field `$-\sigma_0/3\epsilon_0$` inside.

**Worked example.** A surface is held at `$V_0\cos^2\theta$`. First rewrite: `$\cos^2\theta = \tfrac13 + \tfrac23P_2$`. Then

```math
V_{\rm in} = \frac{V_0}{3} + \frac{2V_0}{3}\frac{r^2}{R^2}P_2(\cos\theta), \qquad V_{\rm out} = \frac{V_0}{3}\frac Rr + \frac{2V_0}{3}\frac{R^3}{r^3}P_2(\cos\theta)
```

The centre is at `$V_0/3$`, the surface carries total charge `$4\pi\epsilon_0RV_0/3$` (from the `$1/r$` term), and the far field is that of this charge plus a quadrupole. Forgetting that `$\cos^2\theta$` contains an `$l = 0$` piece is the classic error.

**Worked example: two hemispheres.** Northern hemisphere at `$+V_0$`, southern at `$-V_0$`. The boundary function is odd, so only odd `$l$` appear: `$c_l = (2l+1)V_0\int_0^1P_l\,dx$`, giving `$c_1 = \tfrac32V_0$`, `$c_3 = -\tfrac78V_0$`. Far away, the dipole term `$\tfrac32V_0(R/r)^2\cos\theta$` means `$p = 6\pi\epsilon_0R^2V_0$`.

<div class="problem" data-problem="sphere-legendre"></div>

### A sphere in a uniform field

The most-asked separation problem: a sphere (conductor or linear dielectric) in a uniform field `$E_0\hat z$`. Far away `$V \to -E_0r\cos\theta = -E_0rP_1$`, so only `$l = 1$` can appear anywhere.

<div class="steps" data-fig="sphere-in-field">
<div class="step"><p><b>Guess the form.</b> Outside: V = −E₀ r cos θ + B cos θ / r² (the uniform field plus an induced dipole). Inside: V = −A r cos θ (a uniform field, finite at the centre).</p></div>
<div class="step"><p><b>Match V at r = R.</b> −E₀R + B/R² = −AR.</p></div>
<div class="step"><p><b>Match the normal D.</b> For a dielectric, ε<sub>r</sub>∂V<sub>in</sub>/∂r = ∂V<sub>out</sub>/∂r at r = R: −ε<sub>r</sub>A = −E₀ − 2B/R³.</p></div>
<div class="step"><p><b>Solve.</b> A = 3E₀/(ε<sub>r</sub> + 2) and B = E₀R³(ε<sub>r</sub> − 1)/(ε<sub>r</sub> + 2). For a conductor (ε<sub>r</sub> → ∞, or simply V = 0 on the sphere) A = 0 and B = E₀R³: a dipole p = 4πε₀R³E₀ and σ = 3ε₀E₀ cos θ.</p></div>
</div>

Try the switch in the figure: as `$\epsilon_r$` rises the field inside weakens and the lines bend towards the sphere, until the metal swallows them completely, meeting its surface at right angles. The dipole part alone shows the `$r^{-2}$` term that decorates the uniform field. The polarisation side of the same problem, with bound charge, is in [fields in matter](/learn/courses/gate-physics/fields-in-matter/).

Choose a set of charges, then raise l one step at a time. Move r closer and see how many terms you need.

<figure class="fig" data-fig="@em-multipole-angles"><figcaption>Each extra multipole term improves the match; far from the charges only the first non-zero terms matter.</figcaption></figure>

## 4. Cylindrical problems in two dimensions

For long objects with no `$z$` dependence, separation in polar coordinates `$(s, \phi)$` gives

```math
V(s, \phi) = a_0 + b_0\ln s + \sum_{n\ge1}\left(a_ns^n + \frac{b_n}{s^n}\right)\left(c_n\cos n\phi + d_n\sin n\phi\right)
```

The `$n = 0$` pair is a constant and the line-charge potential `$\ln s$`; requiring single-valuedness makes `$n$` an integer.

**Worked example: a metal cylinder across a field.** Far away `$V \to -E_0s\cos\phi$`; on the cylinder `$V = 0$`. Only `$n = 1$` with `$\cos\phi$` is needed:

```math
V = -E_0\left(s - \frac{R^2}{s}\right)\cos\phi, \qquad \sigma = -\epsilon_0\frac{\partial V}{\partial s}\bigg|_R = 2\epsilon_0E_0\cos\phi
```

The induced charge integrates to zero, the outside picture is a 2D line dipole of strength `$2\pi\epsilon_0R^2E_0$` per length, and the surface field peaks at `$2E_0$` (against `$3E_0$` for a sphere). A surface held at `$V_0\cos2\phi$` gives `$V_0(s/R)^2\cos2\phi = V_0(x^2 - y^2)/R^2$` inside.

### Corners and edges

Two conducting planes at the same potential meet along an edge, enclosing a charge-free wedge of angle `$\beta$`. With `$V = 0$` on `$\phi = 0$` and `$\phi = \beta$`, the separated solutions are `$s^{n\pi/\beta}\sin(n\pi\phi/\beta)$`. Near the edge the `$n = 1$` term dominates:

```math
V \propto s^{\pi/\beta}, \qquad E \propto s^{\pi/\beta - 1}
```

Inside a right-angled corner (`$\beta = \pi/2$`) the field vanishes linearly; outside a right-angled metal corner (`$\beta = 3\pi/2$`) it diverges as `$s^{-1/3}$`; at the edge of a thin sheet (`$\beta = 2\pi$`) as `$s^{-1/2}$`. This is the quantitative reason charge piles up on sharp edges and lightning rods work, and why the [2D electrostatics solver](/science/electrostatics-solver/) needs a fine grid near corners.

<div class="myth">

**"A sphere held at `$V_0\cos^2\theta$` has `$V_0/2$` at its centre, because the average of `$\cos^2$` is one half."** One half is the average over the *angle* `$\theta$`. The centre value is the average over *solid angle*, and the `$\sin\theta$` in `$d\Omega = \sin\theta\,d\theta\,d\phi$` gives the equator, where `$\cos^2\theta$` is small, more weight. The right answer is `$V_0/3$`. In Legendre language, only the `$l = 0$` coefficient reaches the centre.

</div>

## 5. One-line tricks

Separation is the honest method; these shortcuts are what make GATE questions quick.

- **Mean value.** The potential at the centre of any charge-free sphere is the average over its surface.
- **Superposition by symmetry.** A cube with one face at `$V_0$` and five grounded: add the six rotated versions to get a cube entirely at `$V_0$`, so the centre is at `$V_0/6$`. A long square pipe with one wall at `$V_0$`: centre `$V_0/4$`. This even sums awkward Fourier series exactly.
- **The axis trick.** For an azimuthally symmetric problem, find `$V$` on the `$z$` axis (often easy), expand in powers of `$z$`, and replace `$z^l$` by `$r^lP_l(\cos\theta)$` (or `$z^{-(l+1)}$` by `$r^{-(l+1)}P_l$`). A ring of radius `$a$` gives `$V = \dfrac{Q}{4\pi\epsilon_0}\sum_l\dfrac{a^l}{r^{l+1}}P_l(0)P_l(\cos\theta)$` for `$r > a$`.
- **Green reciprocity.** The charge induced on grounded conductors by a point charge equals that induced by any distribution with the same symmetry-averaged position: smear the point into a shell or a sheet. A charge between grounded concentric spheres `$a < r < b$` induces `$-q\dfrac ar\dfrac{b - r}{b - a}$` on the inner one.
- **Fields of harmonic functions.** Each component of `$\vec E$` is harmonic too, but `$|\vec E|^2$` is subharmonic: the field strength is largest on the boundary.

**Worked example.** Two grounded concentric spheres of radii 1 cm and 3 cm have a charge `$q$` at `$r = 2$` cm. The inner sphere gets `$-q\cdot\tfrac12\cdot\tfrac12 = -0.25q$` and the outer `$-q\cdot\tfrac32\cdot\tfrac12 = -0.75q$`. No images, no series.

<div class="keypoints">

- Dirichlet, Neumann or mixed data each fix the solution (Neumann up to a constant); Cauchy data over-determine it. Total charges on conductors also fix the field.
- Cartesian: one direction oscillates, the other goes as `$\sinh$`/`$\cosh$`/exponentials. Fourier coefficients `$c_n = \tfrac2a\int f\sin(n\pi x/a)dx$`; a constant gives `$4V_0/n\pi$` for odd `$n$`. In 3D the decay constant is `$\sqrt{k_x^2 + k_y^2}$`.
- Spherical, azimuthal symmetry: `$\sum(A_lr^l + B_lr^{-(l+1)})P_l(\cos\theta)$`. Each surface mode travels alone; `$\sigma_l = (2l+1)\epsilon_0A_l/R$`.
- Sphere in `$E_0$`: inside `$3E_0/(\epsilon_r + 2)$`; conductor `$\sigma = 3\epsilon_0E_0\cos\theta$`, `$p = 4\pi\epsilon_0R^3E_0$`. Cylinder across `$E_0$`: `$\sigma = 2\epsilon_0E_0\cos\phi$`.
- 2D polar: `$a_0 + b_0\ln s + \sum(a_ns^n + b_ns^{-n})(\cos n\phi, \sin n\phi)$`. Wedge of angle `$\beta$`: `$E \propto s^{\pi/\beta - 1}$`.
- Tricks: mean value, symmetric superposition (`$V_0/6$`, `$V_0/4$`), the axis trick, Green reciprocity.

</div>

## Practise: exam questions on this lesson

These start at warm-up level and climb to top-rank questions. Check each answer, then read the full solution. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="boundary-value-problems" data-exam="gate" data-n="10"></div>

**Next:** [the method of images](/learn/courses/gate-physics/method-of-images/) builds solutions for spheres, cylinders and planes from fictitious charges instead of series. Then [multipole expansion](/learn/courses/gate-physics/multipoles/) reads the Legendre coefficients as charge, dipole and quadrupole moments. For the BSc foundations, see [potential and electrostatic energy](/learn/courses/iit-jam-physics/potential-energy/) and [Fourier series](/learn/courses/iit-jam-physics/fourier-series/).
