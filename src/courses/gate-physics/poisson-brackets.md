---
title: Poisson brackets and canonical transformations
seoTitle: Poisson brackets and canonical maps for GATE Physics
summary: 'The Poisson bracket and its rules, time evolution and constants of motion, angular momentum brackets, canonical transformations and how to test one, the four generating functions, generators of symmetries, and the bridge to quantum commutators and the Hamilton-Jacobi equation.'
minutes: 50
updated: 2026-11-24
quiz:
  - q: 'With {f, g} = ∂f/∂q ∂g/∂p − ∂f/∂p ∂g/∂q, the transformation Q = q², P = p/(2q) is'
    choices: ['Not canonical, because {Q, P} = 2', 'Not canonical, because it mixes q and p', 'Canonical only when q > 1', 'Canonical, because {Q, P} = 1']
    ans: 3
    why: '{Q, P} = (2q)(1/(2q)) − (0)(−p/(2q²)) = 1, so the bracket is preserved. It comes from the generating function F₂ = q²P.'
  - q: 'If L_x and L_y are both constants of motion for some system, then'
    choices: ['L_z must also be a constant of motion', 'L_z must be zero', 'The energy cannot be conserved', 'Nothing follows about L_z']
    ans: 0
    why: 'Poisson''s theorem: the bracket of two constants of motion is a constant of motion (by the Jacobi identity). Since {L_x, L_y} = L_z, L_z is conserved too.'
  - q: 'The quantity that generates an infinitesimal rotation about the z-axis, through δf = ε{f, G}, is'
    choices: ['The Hamiltonian', 'The z-component of angular momentum', 'The z-component of linear momentum', 'The z-coordinate']
    ans: 1
    why: '{x, L_z} = −y and {y, L_z} = x, so δx = −εy and δy = εx: a turn through ε about z. Linear momentum generates translations and the Hamiltonian generates time evolution.'
sources:
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapters 9 and 10'
  - 'L. D. Landau and E. M. Lifshitz, Mechanics, 3rd ed. (1976), chapter 7'
  - 'P. A. M. Dirac, The Principles of Quantum Mechanics, 4th ed. (1958), chapter 4'
  - 'GATE Physics syllabus (Classical Mechanics), IIT organising institute; CSIR-UGC NET Physical Sciences syllabus, Part A Classical Mechanics'
---

**Module 2 · about 50 minutes.** By the end you will be able to compute Poisson brackets quickly, use them to find how any quantity changes and whether it is conserved, test whether a change of variables is canonical, find and use generating functions, and see why quantum mechanics replaces brackets with commutators.

This lesson uses Hamilton's equations from lesson 2.2, [Hamiltonian mechanics](/learn/courses/gate-physics/hamiltonian-mechanics/).

<div class="bigidea">One operation, the Poisson bracket, tells you how anything changes in time, which quantities are conserved, and which changes of variables keep Hamilton's equations intact.</div>

## 1. The bracket and its rules

For two functions `$f(q, p, t)$` and `$g(q, p, t)$` on phase space,

```math
\{f, g\} = \sum_j\left(\frac{\partial f}{\partial q_j}\frac{\partial g}{\partial p_j} - \frac{\partial f}{\partial p_j}\frac{\partial g}{\partial q_j}\right)
```

Some books define it with the opposite sign; GATE and NET follow the one above. Check the fundamental brackets to be sure which convention a question uses:

```math
\{q_j, q_k\} = 0, \qquad \{p_j, p_k\} = 0, \qquad \{q_j, p_k\} = \delta_{jk}
```

The rules make most brackets quick to evaluate without writing out derivatives:

| Rule | Formula |
|---|---|
| antisymmetry | `$\{f, g\} = -\{g, f\}$`, so `$\{f, f\} = 0$` |
| linearity | `$\{af + bg, h\} = a\{f, h\} + b\{g, h\}$` |
| product (Leibniz) | `$\{fg, h\} = f\{g, h\} + \{f, h\}g$` |
| chain rule | `$\{f, g(p)\} = g'(p)\,\partial f/\partial q$`, `$\{f(q), g\} = f'(q)\,\partial g/\partial p$` |
| Jacobi identity | `$\{f, \{g, h\}\} + \{g, \{h, f\}\} + \{h, \{f, g\}\} = 0$` |

**Worked example.** `$\{q^2p, qp^2\}$`. Using derivatives: `$(2qp)(2qp) - (q^2)(p^2) = 3q^2p^2$`. For monomials `$\{q^ap^b, q^cp^d\} = (ad - bc)\,q^{a+c-1}p^{b+d-1}$`, here `$(4 - 1)q^2p^2$`, the same.

<div class="problem" data-problem="pb-monomial"></div>

## 2. Time evolution and constants of motion

By the chain rule and Hamilton's equations, any function `$f(q, p, t)$` changes along the motion as

```math
\frac{df}{dt} = \{f, H\} + \frac{\partial f}{\partial t}
```

Hamilton's equations themselves are the special cases `$\dot q = \{q, H\}$`, `$\dot p = \{p, H\}$`. A quantity with no explicit `$t$` is a **constant of motion** exactly when its bracket with `$H$` vanishes.

<div class="meaning">

<dl>
<dt>{f, H}</dt><dd>the rate at which f changes because the system moves</dd>
<dt>∂f/∂t</dt><dd>the change because f itself is defined with a clock in it</dd>
<dt>{f, H} = 0</dt><dd>f is conserved (if it has no explicit t); also, H is unchanged by the transformation f generates</dd>
<dt>{q<sub>j</sub>, p<sub>k</sub>} = δ<sub>jk</sub></dt><dd>the structure of phase space: each coordinate is paired with exactly one momentum</dd>
<dt>Physical meaning</dt><dd>The bracket measures how much moving along the flow of one quantity changes another. If H does not change along the flow of f, then f does not change along the flow of H: symmetry and conservation are the same statement.</dd>
</dl>

</div>

**Poisson's theorem.** If `$f$` and `$g$` are both constants of motion, so is `$\{f, g\}$`, by the Jacobi identity with `$h = H$`. Sometimes this gives a new constant, sometimes only a trivial one (a number, or a function of the ones you had).

**Worked example: a constant that depends on time.** For a free particle, `$H = p^2/2m$`, take `$G = q - pt/m$`. Then `$\{G, H\} = p/m$` and `$\partial G/\partial t = -p/m$`, so `$dG/dt = 0$`. `$G$` is the starting position, conserved even though it contains `$t$`. For a boost in three dimensions the same idea gives the conserved centre-of-mass motion.

## 3. Angular momentum brackets

With `$\vec L = \vec r\times\vec p$`, the product rule gives

```math
\{L_i, L_j\} = \epsilon_{ijk}L_k, \qquad \{x_i, L_j\} = \epsilon_{ijk}x_k, \qquad \{p_i, L_j\} = \epsilon_{ijk}p_k, \qquad \{L_i, L^2\} = 0
```

So `$\{L_x, L_y\} = L_z$` and its cyclic versions. Any scalar built from `$\vec r$` and `$\vec p$` (such as `$r^2$`, `$p^2$`, `$\vec r\cdot\vec p$`) has zero bracket with every `$L_i$`, because `$L_i$` generates rotations and scalars do not change under rotations. Hence, for any central potential `$H = p^2/2m + V(r)$`, every component of `$\vec L$` is conserved.

The components of `$\vec L$` cannot all be used as canonical momenta at once, because their brackets with one another are not zero. In quantum mechanics this becomes the statement that `$L_x$`, `$L_y$` and `$L_z$` cannot all be sharp, while `$L^2$` and one component can.

**Worked example.** `$\{L_z, x^2 + y^2\} = 0$`, and `$\{L_z, p_x\} = -\{p_x, L_z\} = -\epsilon_{xzk}p_k = p_y$`. A force with a non-zero `$x$`-component but symmetric about `$z$` still conserves `$L_z$`.

## 4. Canonical transformations

A change of variables `$(q, p) \to (Q, P)$` is **canonical** if, for some new Hamiltonian `$K(Q, P, t)$`, the motion obeys Hamilton's equations in the new variables too. The practical test (for a transformation with no explicit time dependence, or at each instant) is that the fundamental brackets are kept:

```math
\{Q_j, Q_k\}_{q,p} = 0, \qquad \{P_j, P_k\}_{q,p} = 0, \qquad \{Q_j, P_k\}_{q,p} = \delta_{jk}
```

For one degree of freedom, `$\{Q, P\}$` is the Jacobian `$\partial(Q, P)/\partial(q, p)$`, so a canonical map **keeps phase-space area**. That is Liouville's theorem again: time evolution itself is a canonical transformation. A canonical map then keeps every Poisson bracket, so brackets can be worked out in whichever variables are easiest.

<figure class="fig" data-fig="canonical-maps"><figcaption>A square patch of phase space under different maps. The rotation, shear and squeeze keep its area and give {Q, P} = 1; the uniform scaling does not. The pendulum's own time evolution bends the patch into a curl but keeps the area exactly.</figcaption></figure>

**Worked example.** Is `$Q = q\cos\alpha + p\sin\alpha$`, `$P = -q\sin\alpha + p\cos\alpha$` canonical? `$\{Q, P\} = \cos\alpha\cos\alpha - \sin\alpha(-\sin\alpha) = 1$`, yes, for every `$\alpha$`. At `$\alpha = \pi/2$` it is `$Q = p$`, `$P = -q$`: coordinates and momenta can be swapped (with a sign), so in Hamiltonian mechanics there is nothing special about which is which. Without the minus sign, `$Q = p$`, `$P = q$` gives `$\{Q, P\} = -1$` and is not canonical.

Press Play and watch the blob of starting states stretch, then switch on friction.

<figure class="fig" data-fig="@mech-liouville"><figcaption>The shape distorts enormously, but with no friction its area stays the same. This is Liouville's theorem; friction compresses phase space.</figcaption></figure>

## 5. Generating functions

Canonical transformations can be built from one function of one old and one new variable. Requiring `$p\dot q - H$` and `$P\dot Q - K$` to differ by a total time derivative `$dF/dt$` gives four types:

| Type | Relations | New Hamiltonian |
|---|---|---|
| `$F_1(q, Q, t)$` | `$p = \partial F_1/\partial q$`, `$P = -\partial F_1/\partial Q$` | `$K = H + \partial F/\partial t$` |
| `$F_2(q, P, t)$` | `$p = \partial F_2/\partial q$`, `$Q = \partial F_2/\partial P$` | (same for all four) |
| `$F_3(p, Q, t)$` | `$q = -\partial F_3/\partial p$`, `$P = -\partial F_3/\partial Q$` | |
| `$F_4(p, P, t)$` | `$q = -\partial F_4/\partial p$`, `$Q = \partial F_4/\partial P$` | |

Three examples worth knowing:

- `$F_2 = \sum q_jP_j$` is the identity, `$Q = q$`, `$P = p$`.
- `$F_2 = \sum f_j(q)P_j$` is a **point transformation**: `$Q_j = f_j(q)$`, and the momenta change to match. Every change of coordinates, such as Cartesian to polar, is canonical.
- `$F_1 = \sum q_jQ_j$` swaps them: `$p = Q$`, `$P = -q$`.

**Worked example: the oscillator made trivial.** Take `$F_1 = \tfrac12m\omega q^2\cot Q$` for `$H = p^2/2m + \tfrac12m\omega^2q^2$`:

<div class="steps">
<div class="step"><p><b>Old momentum.</b> p = ∂F₁/∂q = mωq cot Q.</p></div>
<div class="step"><p><b>New momentum.</b> P = −∂F₁/∂Q = ½mωq² csc²Q.</p></div>
<div class="step"><p><b>Solve for q and p.</b> q = √(2P/mω) sin Q and p = √(2mωP) cos Q.</p></div>
<div class="step"><p><b>New Hamiltonian.</b> K = H = ωP cos²Q + ωP sin²Q = ωP. Q is cyclic.</p></div>
<div class="step"><p><b>Solve.</b> P = E/ω is constant and Q̇ = ∂K/∂P = ω, so Q = ωt + φ: the motion follows at once.</p></div>
</div>

Here `$P$` is `$J/2\pi$`, the action of [lesson 2.2](/learn/courses/gate-physics/hamiltonian-mechanics/) divided by `$2\pi$`, and `$Q$` is the angle variable.

## 6. Generators and symmetries

An **infinitesimal canonical transformation** is generated by a function `$G$`: `$F_2 = qP + \epsilon\,G(q, P)$` gives

```math
\delta q = \epsilon\,\frac{\partial G}{\partial p}, \qquad \delta p = -\epsilon\,\frac{\partial G}{\partial q}, \qquad \delta f = \epsilon\,\{f, G\}
```

| Generator G | Transformation |
|---|---|
| `$p_x$` | translation along `$x$` |
| `$L_z$` | rotation about `$z$` |
| `$H$` (with `$\epsilon = dt$`) | evolution in time |

The change in `$H$` under the transformation generated by `$G$` is `$\epsilon\{H, G\} = -\epsilon\{G, H\} = -\epsilon\,\dot G$`. So `$H$` is unchanged exactly when `$G$` is conserved: **Noether's theorem in one line**.

## 7. From brackets to commutators

Dirac noticed that the commutator of quantum operators obeys the same rules as the Poisson bracket (antisymmetry, linearity, product rule, Jacobi identity). The rule

```math
\{A, B\} \;\longrightarrow\; \frac{1}{i\hbar}\,[\hat A, \hat B]
```

turns `$\{q, p\} = 1$` into `$[\hat x, \hat p] = i\hbar$`, `$df/dt = \{f, H\}$` into the Heisenberg equation `$d\hat A/dt = [\hat A, \hat H]/i\hbar$`, and `$\{L_x, L_y\} = L_z$` into `$[\hat L_x, \hat L_y] = i\hbar\hat L_z$`. Canonical transformations become unitary transformations.

<div class="myth">

**"A transformation is canonical if it keeps the Hamiltonian the same."** Canonical is about keeping the bracket structure, not `$H$`. The oscillator map above changes `$H$` from a quadratic in `$q$` and `$p$` to `$\omega P$`, and is canonical. A scaling `$Q = 2q$`, `$P = 2p$` has `$\{Q, P\} = 4$`, so it is not canonical. Hamilton's equations survive it only if the new Hamiltonian is taken as 4 times the old one written in `$Q, P$`; such scale changes are sometimes called extended canonical transformations, and exams count them as not canonical.

</div>

## 8. The Hamilton-Jacobi equation

*Not in the GATE 2027 syllabus (Hamilton-Jacobi theory): kept as background; skip it if you are short of time.*

The most ambitious canonical transformation makes the new Hamiltonian zero, so every new variable is constant. Its type-2 generating function `$S(q, P, t)$`, Hamilton's principal function, must satisfy

```math
H\!\left(q, \frac{\partial S}{\partial q}, t\right) + \frac{\partial S}{\partial t} = 0
```

For a time-independent `$H$`, `$S = W(q) - Et$`, and `$W$` solves `$H(q, \partial W/\partial q) = E$`. For a free particle `$W = \sqrt{2mE}\,q$`. The equation is the short-wavelength limit of the Schrödinger equation, with `$\psi \approx e^{iS/\hbar}$`, which is how the WKB method arises.

<div class="keypoints">

- `$\{f, g\} = \sum(\partial_q f\,\partial_p g - \partial_p f\,\partial_q g)$`; `$\{q_j, p_k\} = \delta_{jk}$`; antisymmetric, Leibniz, Jacobi.
- `$df/dt = \{f, H\} + \partial f/\partial t$`; conserved if this is zero. Poisson's theorem: brackets of constants are constants.
- `$\{L_i, L_j\} = \epsilon_{ijk}L_k$`, `$\{L_i, L^2\} = 0$`; scalars commute with every `$L_i$`.
- Canonical test: `$\{Q, P\} = 1$` (for one degree of freedom, area kept); `$Q = p,\ P = -q$` is canonical, `$Q = p,\ P = q$` is not.
- Generating functions: `$F_1$`: `$p = \partial_q F_1$`, `$P = -\partial_Q F_1$`; `$F_2$`: `$p = \partial_q F_2$`, `$Q = \partial_P F_2$`; `$K = H + \partial F/\partial t$`.
- Generators: `$p$` translates, `$L_z$` rotates, `$H$` evolves; `$\{G, H\} = 0$` means `$G$` conserved and `$H$` symmetric.
- Quantum: `$\{A, B\} \to [\hat A, \hat B]/i\hbar$`. Hamilton-Jacobi: `$H(q, \partial S/\partial q) + \partial S/\partial t = 0$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [Poisson brackets practice page](/learn/courses/gate-physics/practice/poisson-brackets/).

<div class="qbank" data-bank="physics" data-topics="poisson-brackets" data-exam="gate" data-n="10"></div>

**Before this:** lesson 2.2, [Hamiltonian mechanics](/learn/courses/gate-physics/hamiltonian-mechanics/). **Next:** lesson 2.4, [central forces and scattering](/learn/courses/gate-physics/central-force-scattering/).

**Going on to CSIR NET?** [Canonical transformations and Hamilton-Jacobi theory](/learn/courses/csir-net-physics/hamilton-jacobi/) builds on these generating functions.
