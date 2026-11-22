---
title: 'Angular momentum'
summary: 'Orbital angular momentum the GATE way: the commutation relations, the eigenvalues l(l+1)ħ² and mħ derived with ladder operators, L± matrix elements and the l = 1 matrices, spherical harmonics, the vector model, measurements of Lx and Lz, rigid rotors and central potentials.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'For l = 2, what is the smallest angle that L can make with the z-axis?'
    choices: ['35.3°', '0°', '45°', '60°']
    ans: 0
    why: 'cos θ = m/√(l(l+1)) = 2/√6 = 0.816, so θ = 35.3°. L can never lie along z, because then Lx and Ly would be sharp too.'
  - q: 'A particle has angular wavefunction ∝ sin θ cos φ. What can a measurement of L_z give?'
    choices: ['+ħ or −ħ, each with probability ½', '0 with certainty', '+ħ with certainty', '0, +ħ or −ħ, each with probability ⅓']
    ans: 0
    why: 'cos φ = ½(e^(iφ) + e^(−iφ)), an equal mix of m = +1 and m = −1. (The function is x/r, which has L_x = 0.)'
  - q: 'Which pair cannot both have definite values in a state with l ≥ 1?'
    choices: ['L_x and L_z', 'L² and L_z', 'L² and L_x', 'H and L² for a central potential']
    ans: 0
    why: '[L_x, L_z] = −iħL_y ≠ 0. L² commutes with every component, and with H when V depends only on r.'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), section 4.3: angular momentum'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (2021), chapter 3: theory of angular momentum'
  - 'R. Shankar, Principles of Quantum Mechanics, 2nd ed. (1994), chapter 12: rotational invariance and angular momentum'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 50 minutes.** By the end you will be able to use the commutation relations of `$\vec L$`, derive the allowed values of `$L^2$` and `$L_z$` with ladder operators, write the `$l = 1$` matrices, recognise the first spherical harmonics in Cartesian form, predict the results of measuring `$L_x$` or `$L_z$` on any angular state, and use rigid rotors and central potentials. The ladder method is the one from [lesson 4.4](/learn/courses/gate-physics/harmonic-oscillator/); the Bohr picture of quantised angular momentum is in [IIT JAM lesson 6.4](/learn/courses/iit-jam-physics/atoms-x-rays/).

<div class="bigidea">The three components of angular momentum do not commute, so only its length and one component can be sharp at once. The algebra alone then forces the length to be √(l(l+1)) ħ and the component to step in units of ħ from −l to l.</div>

## 1. Commutation relations

With `$\vec L = \vec r\times\vec p$` and `$[x_i, p_j] = i\hbar\delta_{ij}$` (from [lesson 4.2](/learn/courses/gate-physics/commutators-uncertainty/)):

```math
[L_x, L_y] = i\hbar L_z, \quad [L_y, L_z] = i\hbar L_x, \quad [L_z, L_x] = i\hbar L_y, \qquad [L^2, L_i] = 0
```

Also `$[L_z, x] = i\hbar y$`, `$[L_z, y] = -i\hbar x$`, `$[L_z, z] = 0$`: `$L_z$` rotates vectors about `$z$`. `$\vec L$` commutes with `$r^2$`, `$p^2$` and any `$V(r)$`, so for a **central potential** `$H$`, `$L^2$` and `$L_z$` form a commuting set and share eigenstates `$|n, l, m\rangle$`.

In spherical coordinates `$\hat L_z = -i\hbar\,\partial/\partial\phi$` and `$\hat L^2 = -\hbar^2\left[\dfrac{1}{\sin\theta}\dfrac{\partial}{\partial\theta}\left(\sin\theta\dfrac{\partial}{\partial\theta}\right) + \dfrac{1}{\sin^2\theta}\dfrac{\partial^2}{\partial\phi^2}\right]$`, the angular part of `$-\hbar^2r^2\nabla^2$`.

The uncertainty relation gives `$\Delta L_x\Delta L_y \ge \tfrac{\hbar}{2}|\langle L_z\rangle|$`. All three components can be sharp together only when `$l = 0$`.

## 2. Eigenvalues from the algebra

Define `$L_\pm = L_x \pm iL_y$`. Then `$[L_z, L_\pm] = \pm\hbar L_\pm$` and `$[L_+, L_-] = 2\hbar L_z$`, and

```math
L^2 = L_\mp L_\pm + L_z^2 \pm \hbar L_z
```

Watch the spectrum come out.

<div class="steps">
<div class="step">

**Common eigenstates.** Let `$L^2|\lambda, m\rangle = \lambda\hbar^2|\lambda, m\rangle$` and `$L_z|\lambda, m\rangle = m\hbar|\lambda, m\rangle$`.

</div>
<div class="step">

**Ladder.** `$L_z(L_\pm|\lambda, m\rangle) = (m \pm 1)\hbar\,L_\pm|\lambda, m\rangle$`, while `$L^2$` is unchanged because it commutes with `$L_\pm$`. So `$L_\pm$` move `$m$` up or down by one at fixed `$\lambda$`.

</div>
<div class="step">

**The ladder is finite.** `$\langle L_x^2 + L_y^2\rangle = (\lambda - m^2)\hbar^2 \ge 0$`, so `$|m| \le \sqrt\lambda$`. There is a top rung `$m = l$` with `$L_+|\lambda, l\rangle = 0$` and a bottom rung `$m = l'$` with `$L_-|\lambda, l'\rangle = 0$`.

</div>
<div class="step">

**Use the identity at the top and bottom.** At the top, `$L^2 = L_-L_+ + L_z^2 + \hbar L_z$` gives `$\lambda = l(l + 1)$`. At the bottom, `$L^2 = L_+L_- + L_z^2 - \hbar L_z$` gives `$\lambda = l'(l' - 1)$`. So `$l' = -l$`.

</div>
<div class="step">

**Whole steps.** Going from `$-l$` to `$l$` in whole steps means `$2l$` is a non-negative integer. For orbital angular momentum, single-valued wavefunctions `$e^{im\phi}$` need integer `$m$`, so `$l = 0, 1, 2, \dots$`; half-integers are left for spin.

</div>
</div>

```math
L^2|l, m\rangle = l(l+1)\hbar^2|l, m\rangle, \qquad L_z|l, m\rangle = m\hbar|l, m\rangle, \qquad m = -l, \dots, l
```

```math
L_\pm|l, m\rangle = \hbar\sqrt{l(l+1) - m(m\pm1)}\,|l, m\pm1\rangle
```

<div class="meaning">

<dl>
<dt>l(l+1)ħ²</dt><dd>the squared length of L; always more than the largest L_z², because L_x and L_y cannot both vanish</dd>
<dt>mħ</dt><dd>the component along the chosen axis, in whole steps: 2l + 1 values</dd>
<dt>L±</dt><dd>tilt the angular momentum up or down by ħ without changing its length</dd>
<dt>⟨L_x²⟩ = ½[l(l+1) − m²]ħ²</dt><dd>the sideways spread that never goes away</dd>
<dt>Physical meaning</dt><dd>In the vector model L precesses on a cone of height mħ around the axis: its length and its z part are sharp, its direction around the cone is completely unknown.</dd>
</dl>

</div>

## 3. Matrices for l = 1 and measurements

In the basis `$|1,1\rangle, |1,0\rangle, |1,-1\rangle$`, `$L_+$` has entries `$\sqrt2\hbar$` just above the diagonal, and `$L_x = \tfrac12(L_+ + L_-)$`, `$L_y = \tfrac{1}{2i}(L_+ - L_-)$`:

```math
L_z = \hbar\begin{pmatrix}1&0&0\\0&0&0\\0&0&-1\end{pmatrix}, \quad L_x = \frac{\hbar}{\sqrt2}\begin{pmatrix}0&1&0\\1&0&1\\0&1&0\end{pmatrix}, \quad L_y = \frac{\hbar}{\sqrt2}\begin{pmatrix}0&-i&0\\i&0&-i\\0&i&0\end{pmatrix}
```

`$L_x$` has the same eigenvalues `$\hbar, 0, -\hbar$` as `$L_z$`, with eigenvectors `$(\tfrac12, \tfrac{1}{\sqrt2}, \tfrac12)$`, `$(1, 0, -1)/\sqrt2$` and `$(\tfrac12, -\tfrac{1}{\sqrt2}, \tfrac12)$`.

**Worked example.** A particle is in `$|1,1\rangle$`. Measure `$L_x$`, then `$L_z$`.

1. `$P(L_x = \hbar) = |\tfrac12|^2 = \tfrac14$`, `$P(0) = \tfrac12$`, `$P(-\hbar) = \tfrac14$`: average zero, as it must be in any `$|l, m\rangle$`.
2. If `$L_x = 0$`, the state is `$(1, 0, -1)/\sqrt2$`, and a following `$L_z$` measurement gives `$+\hbar$` or `$-\hbar$` with probability `$\tfrac12$` each. The original `$L_z = \hbar$` has been erased.

**Worked example.** For `$\psi = \tfrac{1}{\sqrt6}(Y_{11} + 2Y_{10} + Y_{1,-1})$`: `$\langle L_z\rangle = 0$` and `$\langle L_z^2\rangle = \tfrac13\hbar^2$`. But `$\langle L_x\rangle = \mathrm{Re}\langle L_+\rangle = \tfrac16(1\cdot2 + 2\cdot1)\sqrt2\hbar = 0.943\hbar$`: a superposition of neighbouring `$m$` values can point sideways.

<div class="problem" data-problem="lx-spread"></div>

## 4. Spherical harmonics

The position-space eigenfunctions are the spherical harmonics `$Y_{lm}(\theta, \phi) \propto P_l^{|m|}(\cos\theta)e^{im\phi}$`. Learn the first few in Cartesian form, where `$r^lY_{lm}$` is a polynomial of degree `$l$`:

```math
Y_{00} = \frac{1}{\sqrt{4\pi}}, \qquad Y_{10} = \sqrt{\frac{3}{4\pi}}\cos\theta \propto \frac zr, \qquad Y_{1,\pm1} = \mp\sqrt{\frac{3}{8\pi}}\sin\theta\,e^{\pm i\phi} \propto \mp\frac{x \pm iy}{r}
```

```math
Y_{20} = \sqrt{\frac{5}{16\pi}}(3\cos^2\theta - 1), \qquad Y_{2,\pm2} \propto \sin^2\theta\,e^{\pm2i\phi} \propto \frac{(x \pm iy)^2}{r^2}
```

- Orthonormal on the sphere; parity `$(-1)^l$`; `$|Y_{lm}|^2$` does not depend on `$\phi$`.
- To analyse a function, rewrite it in `$x, y, z$`. `$x/r$` is an equal mix of `$m = \pm1$` (and is the `$L_x = 0$` state). `$xy/r^2 \propto e^{2i\phi} - e^{-2i\phi}$` has `$m = \pm2$`. `$x^2/r^2 = \tfrac13 + (x^2/r^2 - \tfrac13)$` hides an `$l = 0$` part, with probability `$5/9$`.

<figure class="fig" data-fig="angular-cones"><figcaption>Choose l and m. The vector model shows L of length √(l(l+1)) ħ on its cone at height mħ (never along the axis); the polar plot shows |Y_lm|² in the xz-plane, the same for every φ. Notice m = ±l crowding towards the equator and m = 0 lobes along z.</figcaption></figure>

The [Hydrogen orbital viewer](/science/hydrogen-orbitals/) draws these angular shapes in 3D, multiplied by the radial functions of hydrogen.

## 5. Rotors and rotations

A **rigid rotor** has `$H = L^2/2I$`, so `$E_l = \dfrac{\hbar^2}{2I}l(l+1)$` with degeneracy `$2l + 1$`. Absorption lines `$l \to l + 1$` sit at `$2(l + 1)\hbar^2/2I$`: equally spaced, as in the far-infrared spectrum of HCl. A particle on a ring has `$H = L_z^2/2I$` and `$E_m = m^2\hbar^2/2I$`, with `$\pm m$` degenerate.

**Worked example.** A ring rotor with `$\psi \propto \cos^2\phi = \tfrac12 + \tfrac14e^{2i\phi} + \tfrac14e^{-2i\phi}$`. Probabilities `$\tfrac23$` for `$m = 0$` and `$\tfrac16$` each for `$m = \pm2$`, so `$\langle E\rangle = \tfrac13\cdot4\cdot\tfrac{\hbar^2}{2I} = \tfrac43\,\dfrac{\hbar^2}{2I}$`.

`$\vec L$` generates rotations: `$e^{-i\beta L_y/\hbar}$` rotates a state by `$\beta$` about `$y$`, mixing the `$m$` values of one `$l$` but never changing `$l$`. The amplitudes are the Wigner `$d$` functions, for example `$d^1_{11}(\beta) = \tfrac12(1 + \cos\beta)$`, so `$|1,1\rangle$` tilted by `$60^\circ$` stays `$|1,1\rangle$` with probability `$0.75^2 = 0.5625$`.

<div class="myth">

**"In the state |l, m = l⟩ the angular momentum points along z."** Its length is `$\sqrt{l(l+1)}\hbar$` but its `$z$` part is only `$l\hbar$`; the rest, `$\sqrt l\,\hbar$`, lies sideways in an unknown direction. Pointing exactly along `$z$` would make `$L_x$` and `$L_y$` sharp, which the commutators forbid.

**"⟨L_x⟩ = 0, so L_x is zero."** In `$|l, m\rangle$` the average is zero but `$\langle L_x^2\rangle = \tfrac12[l(l+1) - m^2]\hbar^2 > 0$` for `$l \ge 1$`: a measurement of `$L_x$` gives one of `$-l\hbar, \dots, l\hbar$`.

</div>

<div class="keypoints">

- `$[L_i, L_j] = i\hbar\epsilon_{ijk}L_k$`, `$[L^2, L_i] = 0$`; central `$H$` commutes with `$L^2$` and every `$L_i$`.
- `$L^2 = l(l+1)\hbar^2$`, `$L_z = m\hbar$`, `$|m| \le l$`; orbital `$l$` integer by single-valuedness.
- `$L_\pm|l, m\rangle = \hbar\sqrt{l(l+1) - m(m\pm1)}|l, m\pm1\rangle$`; `$L_+|l, l\rangle = 0$`.
- `$\langle L_x\rangle = \langle L_y\rangle = 0$`, `$\langle L_x^2\rangle = \tfrac12[l(l+1) - m^2]\hbar^2$` in `$|l, m\rangle$`; angle `$\cos\theta = m/\sqrt{l(l+1)}$`.
- `$Y_{10} \propto z/r$`, `$Y_{1,\pm1} \propto (x \pm iy)/r$`; parity `$(-1)^l$`; rewrite functions in `$x, y, z$` to read off `$l$` and `$m$`.
- Rigid rotor `$E_l = \hbar^2l(l+1)/2I$`, lines spaced by `$2\hbar^2/2I$`; ring `$E_m = m^2\hbar^2/2I$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [angular momentum practice page](/learn/courses/gate-physics/practice/angular-momentum/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="angular-momentum" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.6](/learn/courses/gate-physics/hydrogen-atom/), the hydrogen atom, combines these angular functions with a radial equation. Back to the [GATE Physics course](/learn/courses/gate-physics/) for the rest of module 4.
