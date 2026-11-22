---
title: Tensors
seoTitle: 'Tensors: index notation and the metric | GATE Physics'
summary: 'Index notation and the summation convention, the Kronecker delta and Levi-Civita symbol with the epsilon-delta identity, how tensors transform under rotations, invariants, symmetric and antisymmetric parts, counting components, isotropic tensors and the quotient law, the inertia, stress and elasticity tensors, the metric with upper and lower indices, and Christoffel symbols in curvilinear coordinates.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: How many free indices does ε_ijk A_j B_k have, and what is it?
    choices: ['One: it is the i-th component of A × B', 'None: it is a scalar', 'Two: it is a rank-2 tensor', 'Three: it is a rank-3 tensor']
    ans: 0
    why: j and k are repeated, so they are summed. Only i is free, so the result is a vector, the cross product.
  - q: Which of these is unchanged by every rotation of the axes for a rank-2 tensor T?
    choices: ['The trace T_ii', 'The component T_11', 'The component T_12', 'The sum T_11 + T_22 in 3D']
    ans: 0
    why: "T′ = RTRᵀ is a similarity transformation, so eigenvalues, trace and determinant are invariant. Individual components and partial sums change."
  - q: In plane polar coordinates, which Christoffel symbol equals −r?
    choices: ['Γ^r_θθ', 'Γ^θ_rθ', 'Γ^r_rr', 'Γ^θ_θθ']
    ans: 0
    why: "Γ^r_θθ = −½ ∂_r(g_θθ) = −½ ∂_r(r²) = −r. It is the centripetal term in r̈ − rθ̇² = 0. Γ^θ_rθ = 1/r; the others vanish."
sources:
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapter 4'
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 10'
  - 'K. F. Riley, M. P. Hobson and S. J. Bence, Mathematical Methods for Physics and Engineering, 3rd ed. (2006), chapter 26'
  - 'B. F. Schutz, A First Course in General Relativity, 2nd ed. (2009), chapters 3 and 5'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 60 minutes.** By the end you will be able to read and simplify index expressions with the summation convention, use the epsilon-delta identity to prove vector identities in a line, rotate a tensor and find its principal axes, count independent components, recognise invariants and isotropic tensors, and work with a metric: raising and lowering indices, line elements, volume factors and Christoffel symbols. Matrices and eigenvalues are in [lesson 1.2](/learn/courses/gate-physics/matrices-eigenvalues/); the vector calculus behind it in the JAM lesson on [vector calculus](/learn/courses/iit-jam-physics/vector-calculus/).

<div class="bigidea">A tensor is a physical quantity whose components change with the axes in a fixed, linear way, one rotation matrix per index. The object stays the same; only its description changes. Contractions that leave no free index are the same in every frame.</div>

## 1. Index notation

A repeated index is summed (**summation convention**); an unrepeated index is **free**, and the number of free indices is the **rank**. `$A_iB_i = \mathbf A\cdot\mathbf B$` (rank 0), `$T_{ij}v_j$` (rank 1), `$A_iB_j$` (rank 2, the outer product). A repeated index is a dummy: rename it freely, but never use the same letter three times in one term.

Two special symbols:

- **Kronecker delta** `$\delta_{ij}$`: 1 if `$i = j$`, else 0. It renames indices, `$\delta_{ij}A_j = A_i$`, and `$\delta_{ii} = n$` (3 in space).
- **Levi-Civita** `$\varepsilon_{ijk}$`: `$+1$` for even permutations of 123, `$-1$` for odd ones, 0 if any two indices are equal. `$(\mathbf A\times\mathbf B)_i = \varepsilon_{ijk}A_jB_k$` and `$\mathbf A\cdot(\mathbf B\times\mathbf C) = \varepsilon_{ijk}A_iB_jC_k$` (the determinant).

The one identity that does most of the work:

```math
\varepsilon_{ijk}\varepsilon_{imn} = \delta_{jm}\delta_{kn} - \delta_{jn}\delta_{km}
```

Contracting further: `$\varepsilon_{ijk}\varepsilon_{ijn} = 2\delta_{kn}$` and `$\varepsilon_{ijk}\varepsilon_{ijk} = 6$`. In `$n$` dimensions, contracting `$n - 1$` pairs gives `$(n - 1)!\,\delta$`.

**Worked example.** `$[\nabla\times(\nabla\times\mathbf A)]_i = \varepsilon_{ijk}\partial_j\varepsilon_{klm}\partial_lA_m = (\delta_{il}\delta_{jm} - \delta_{im}\delta_{jl})\partial_j\partial_lA_m = \partial_i(\partial_mA_m) - \nabla^2A_i$`. And `$(\mathbf A\times\mathbf B)\cdot(\mathbf C\times\mathbf D) = (\mathbf A\cdot\mathbf C)(\mathbf B\cdot\mathbf D) - (\mathbf A\cdot\mathbf D)(\mathbf B\cdot\mathbf C)$`, with no cross products computed.

A symmetric and an antisymmetric pair always contract to zero: `$\varepsilon_{ijk}\delta_{ij} = 0$`, `$S_{ij}A_{ij} = 0$`.

## 2. How tensors transform

Under a rotation `$x'_i = R_{ij}x_j$` (with `$RR^{\mathsf T} = 1$`), each index gets one factor of `$R$`:

```math
v'_i = R_{ij}v_j, \qquad T'_{ij} = R_{ik}R_{jl}T_{kl} \;\;(T' = RTR^{\mathsf T}), \qquad T'_{ijk} = R_{il}R_{jm}R_{kn}T_{lmn}
```

So a rank-`$r$` tensor in `$n$` dimensions has `$n^r$` components. The **quotient law** turns this around: if `$T_{ij}B_j$` is a vector for every vector `$B$`, then `$T$` is a rank-2 tensor. That is how we know the inertia tensor is a tensor (`$L_i = I_{ij}\omega_j$`), and the conductivity (`$J_i = \sigma_{ij}E_j$`).

**Invariants.** `$T' = RTR^{-1}$` is a similarity transformation, so the eigenvalues, the trace `$T_{ii}$` and the determinant do not change. Single components do.

**Worked example (2D rotation).** `$T = \text{diag}(3, 1)$`. In axes rotated by `$\theta$`, `$T'_{11} = 3\cos^2\theta + \sin^2\theta$`: at `$30°$`, `$2.5$`; and `$T'_{22} = 1.5$`, so the trace stays 4. In general, for a symmetric `$2\times2$` tensor the off-diagonal part vanishes when

```math
\tan2\theta = \frac{2T_{12}}{T_{11} - T_{22}}
```

For `$\begin{pmatrix}3 & 1\\ 1 & 1\end{pmatrix}$`, `$\tan2\theta = 1$`, `$\theta = 22.5°$`, principal values `$2 \pm \sqrt2$`. The off-diagonal component peaks at `$45°$` from the principal axes, at half the difference of the principal values (the maximum shear of Mohr's circle).

<figure class="fig" data-fig="tensor-rotation"><figcaption>A symmetric 2D tensor drawn as the image of the unit circle, its principal axes (dotted) and a rotated frame. The readout gives T′ = RTRᵀ: the components change with θ, the trace and determinant do not.</figcaption></figure>

<div class="problem" data-problem="tns-principal"></div>

<div class="meaning">

<dl>
<dt>Free index</dt><dd>an index that appears once in a term; there is one equation per value of it</dd>
<dt>Contraction</dt><dd>setting two indices equal and summing; it lowers the rank by two</dd>
<dt>Invariant</dt><dd>a number built from a tensor that is the same in every frame (trace, determinant, eigenvalues)</dd>
<dt>Isotropic tensor</dt><dd>one whose components are the same in every rotated frame (δ, ε and products of δs)</dd>
<dt>Metric g_ij</dt><dd>the tensor that turns coordinate steps into lengths, ds² = g_ij dx^i dx^j</dd>
<dt>Physical meaning</dt><dd>A tensor is a machine that takes directions in and gives physical quantities out: the inertia tensor takes the spin axis and returns angular momentum, the stress tensor takes a surface normal and returns the force per area on it.</dd>
</dl>

</div>

## 3. Symmetry, counting and isotropy

Any rank-2 tensor splits as `$T_{ij} = S_{ij} + A_{ij}$` with `$S = \frac12(T + T^{\mathsf T})$` and `$A = \frac12(T - T^{\mathsf T})$`. The trace is all in `$S$`. In 3D the antisymmetric part has 3 components and is equivalent to an axial vector `$v_k = \frac12\varepsilon_{kij}A_{ij}$` (the rotation part of a velocity gradient, or `$\mathbf B$` inside the field tensor).

Counting independent components of rank `$r$` in `$n$` dimensions:

| kind | count | examples |
|---|---|---|
| general | `$n^r$` | rank 3 in 4D: 64 |
| symmetric rank 2 | `$\frac{n(n + 1)}{2}$` | inertia, stress (3D): 6; metric (4D): 10 |
| antisymmetric rank 2 | `$\frac{n(n - 1)}{2}$` | field tensor (4D): 6 |
| totally symmetric rank `$r$` | `$\binom{n + r - 1}{r}$` | rank 3 in 4D: 20 |
| totally antisymmetric rank `$r$` | `$\binom nr$` | rank 3 in 3D: 1 (that is `$\varepsilon$`) |

Elastic stiffness `$C_{ijkl}$` with its pair symmetries has 21; an isotropic solid needs only 2 (the Lamé constants), because the only isotropic tensors are built from `$\delta_{ij}$` (and `$\varepsilon_{ijk}$`): `$C_{ijkl} = \lambda\delta_{ij}\delta_{kl} + \mu(\delta_{ik}\delta_{jl} + \delta_{il}\delta_{jk})$`. There is no isotropic vector.

**Pseudotensors.** If `$\varepsilon_{ijk}$` is to keep its values in every frame, including reflected ones, it must pick up a factor `$\det R = -1$` under parity. So the cross product of two polar vectors (angular momentum, `$\mathbf B$`) is an axial vector.

**Physical tensors.** Inertia `$I_{ij} = \sum m(r^2\delta_{ij} - x_ix_j)$`: a mass 2 kg at `$(1, 1, 0)$` has `$I_{xy} = -2$` kg m², so `$z$`-spin alone is not a principal motion (the JAM lesson on [rotation and angular momentum](/learn/courses/iit-jam-physics/rigid-body-rotation/) shows why). Stress: the traction on a plane of unit normal `$\mathbf n$` is `$t_i = \sigma_{ij}n_j$` and the normal stress is `$n_i\sigma_{ij}n_j$`.

## 4. The metric, upper and lower indices

In general coordinates the line element is `$ds^2 = g_{ij}dx^idx^j$`. Polar: `$g = \text{diag}(1, r^2)$`. Spherical: `$\text{diag}(1, r^2, r^2\sin^2\theta)$`. A unit sphere: `$d\theta^2 + \sin^2\theta\,d\phi^2$`, so the circle `$\theta = 60°$` has length `$2\pi\sin60° = 5.44$`.

Components with upper indices (**contravariant**, like `$dx^i$`) and lower indices (**covariant**, like `$\partial_i\phi$`) transform oppositely; the metric converts one into the other: `$A_i = g_{ij}A^j$`, `$A^i = g^{ij}A_j$`. A contraction of an upper with a lower index, `$A^iB_i$`, is invariant. In Cartesian coordinates with `$g_{ij} = \delta_{ij}$` the two kinds coincide, which is why the distinction never mattered in vector analysis. In relativity `$\eta = \text{diag}(1, -1, -1, -1)$`, `$\eta_{\mu\nu}\eta^{\mu\nu} = 4$`, and `$F_{\mu\nu}F^{\mu\nu} = 2(B^2 - E^2/c^2)$` is the same in every inertial frame.

**Volumes and Laplacians.** The volume element is `$\sqrt g\,d^nx$` (`$r^2\sin\theta$` in spherical coordinates), and

```math
\nabla^2f = \frac{1}{\sqrt g}\,\partial_i\!\left(\sqrt g\,g^{ij}\partial_jf\right)
```

**Worked example.** In polar coordinates `$\nabla^2r^3 = \frac1r\frac{d}{dr}(r\cdot3r^2) = 9r$`, which is 18 at `$r = 2$`. In `$d$` dimensions `$\nabla^2r^n = n(n + d - 2)r^{n-2}$`; with `$n = -1$`, `$d = 3$` it vanishes: the Coulomb potential is harmonic away from the origin.

**Christoffel symbols** say how the basis vectors turn from point to point:

```math
\Gamma^k_{ij} = \tfrac12g^{kl}\left(\partial_ig_{jl} + \partial_jg_{il} - \partial_lg_{ij}\right)
```

Polar: `$\Gamma^r_{\theta\theta} = -r$`, `$\Gamma^\theta_{r\theta} = \frac1r$`. Sphere: `$\Gamma^\theta_{\phi\phi} = -\sin\theta\cos\theta$`, `$\Gamma^\phi_{\theta\phi} = \cot\theta$`. In the geodesic equation `$\ddot x^k + \Gamma^k_{ij}\dot x^i\dot x^j = 0$`, the polar ones reproduce `$\ddot r - r\dot\theta^2 = 0$` for a free particle. They are not tensors: they vanish in Cartesian coordinates of flat space and not in polar ones. Curvature is measured by the Riemann tensor, which is zero for the plane in any coordinates and non-zero for the sphere.

<div class="myth">

**"Non-zero Christoffel symbols mean the space is curved."** Polar coordinates on a flat sheet already have `$\Gamma^r_{\theta\theta} = -r$`. Christoffel symbols describe the coordinates, not the space; they can be made to vanish at any point by a good choice of coordinates. Curvature is what survives every change of coordinates: the Riemann tensor, a true tensor, built from derivatives and products of the `$\Gamma$`s.

</div>

<div class="keypoints">

- Repeated index summed, free indices give the rank. `$\delta_{ii} = 3$`; `$(\mathbf A\times\mathbf B)_i = \varepsilon_{ijk}A_jB_k$`; `$\varepsilon_{ijk}\varepsilon_{imn} = \delta_{jm}\delta_{kn} - \delta_{jn}\delta_{km}$`, `$\varepsilon_{ijk}\varepsilon_{ijn} = 2\delta_{kn}$`, `$\varepsilon_{ijk}\varepsilon_{ijk} = 6$`.
- `$T'_{ij} = R_{ik}R_{jl}T_{kl}$`; invariants: trace, determinant, eigenvalues. Principal axes of a 2D symmetric tensor: `$\tan2\theta = 2T_{12}/(T_{11} - T_{22})$`.
- Counting: `$n^r$`, `$\frac{n(n\pm1)}{2}$`, `$\binom{n + r - 1}{r}$`, `$\binom nr$`. Elastic: 21 in general, 2 if isotropic. Isotropic tensors: `$\delta$`, `$\varepsilon$` and their products.
- Quotient law; `$\varepsilon$` is a pseudotensor; symmetric times antisymmetric contracts to 0.
- `$ds^2 = g_{ij}dx^idx^j$`, `$A_i = g_{ij}A^j$`, `$\sqrt g$` in volumes and in `$\nabla^2$`. Christoffel symbols are not tensors; curvature lives in the Riemann tensor.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. More on the [tensors practice page](/learn/courses/gate-physics/practice/tensors/).

<div class="qbank" data-bank="physics" data-topics="tensors" data-exam="gate" data-n="10"></div>

The [Matrix transform](/learn/matrix-transform/) tool shows how a 2×2 matrix stretches and rotates the plane. **Before this:** [lesson 1.8, the Dirac delta and Green's functions](/learn/courses/gate-physics/delta-greens-functions/). **Next:** [lesson 1.10, probability and statistics](/learn/courses/gate-physics/probability/). Back to the [GATE Physics course home](/learn/courses/gate-physics/).
