---
title: 'Band theory'
summary: 'Why a periodic lattice turns free electrons into bands and gaps: Bloch''s theorem and crystal momentum, counting states, the Kronig-Penney model, nearly free electrons with gaps of 2|U_G|, tight binding in one, two and three dimensions, effective mass and holes, Brillouin zones, metals versus insulators, and Bloch oscillations.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'In the nearly-free-electron model, the gap at the Bragg plane of reciprocal lattice vector G is'
    choices: ['2|U_G|', '|U_G|', '|U_G|²/E', '4|U_G|']
    ans: 0
    why: 'At the plane the plane waves k and k − G are degenerate. The 2×2 matrix with off-diagonal U_G has eigenvalues E⁰ ± |U_G|, so the gap is 2|U_G|.'
  - q: 'For E = E₀ − 2t cos ka, the effective mass at the band bottom is'
    choices: ['ħ²/2ta²', 'ħ²/ta²', '2ħ²/ta²', 'ħ²/4ta²']
    ans: 0
    why: 'Near k = 0, E ≈ E₀ − 2t + ta²k². Matching ħ²k²/2m* gives m* = ħ²/2ta².'
  - q: 'A crystal with an odd number of electrons per primitive cell is, in independent-electron band theory,'
    choices: ['always a metal', 'always an insulator', 'a metal or insulator depending on band overlap', 'always a semiconductor']
    ans: 0
    why: 'Each band holds exactly 2 electrons per primitive cell, so an odd number always leaves a band partly filled.'
sources:
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 8 to 10 and 12'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 7 and 9'
  - 'S. H. Simon, The Oxford Solid State Basics (2013), chapters 11, 15 and 16'
  - 'GATE Physics (PH) syllabus, solid state physics section, published by the organising institute each year'
---

**Module 7 · about 55 minutes.** By the end you will be able to state and use Bloch's theorem, count the states in a band, solve the Kronig-Penney model graphically, find gaps and effective masses for nearly free and tightly bound electrons, sketch Brillouin zones, decide from electron counting whether a crystal can be an insulator, and describe how an electron moves in a band under a force. You need the free electron gas of [lesson 7.6](/learn/courses/gate-physics/free-electron-model/), lattices and reciprocal lattices from the [JAM crystal structure lesson](/learn/courses/iit-jam-physics/crystal-structure/) and the [JAM X-ray diffraction lesson](/learn/courses/iit-jam-physics/x-ray-diffraction/), and potential wells from [lesson 4.3](/learn/courses/gate-physics/one-dimensional-potentials/).

<div class="bigidea">An electron wave in a crystal is Bragg reflected whenever its wave vector reaches a zone boundary. There the forward and backward waves combine into two standing waves of different energy, and a gap opens. Away from the boundaries the electron moves almost freely, but with an effective mass set by the curvature of its band.</div>

## 1. Bloch's theorem

The potential has the period of the lattice, `$V(\mathbf r + \mathbf R) = V(\mathbf r)$`, so the Hamiltonian commutes with every lattice translation. Eigenstates can be chosen to be eigenstates of the translations too, which forces

```math
\psi_{n\mathbf k}(\mathbf r) = e^{i\mathbf k\cdot\mathbf r}u_{n\mathbf k}(\mathbf r), \qquad u_{n\mathbf k}(\mathbf r + \mathbf R) = u_{n\mathbf k}(\mathbf r)
```

or equivalently `$\psi(\mathbf r + \mathbf R) = e^{i\mathbf k\cdot\mathbf R}\psi(\mathbf r)$`.

<div class="meaning">

<dl>
<dt>k</dt><dd>crystal wave vector, defined only up to a reciprocal lattice vector G; ħk is crystal momentum, not true momentum</dd>
<dt>n</dt><dd>band index: for each k there is a ladder of energies E₁(k) &lt; E₂(k) &lt; ...</dd>
<dt>u(r)</dt><dd>the part with the lattice period: atomic-like wiggles inside each cell</dd>
<dt>Physical meaning</dt><dd>A Bloch electron is a travelling wave dressed by the lattice. It is a stationary state, so a perfect, motionless lattice never scatters it: resistance comes only from defects and vibrations.</dd>
</dl>

</div>

**Counting.** With `$N$` primitive cells and periodic boundary conditions there are exactly `$N$` allowed `$\mathbf k$` in the first Brillouin zone, so each band holds `$2N$` electrons: 2 per primitive cell. All energies are periodic, `$E_n(\mathbf k + \mathbf G) = E_n(\mathbf k)$`, so we can draw everything in the first zone (the reduced zone scheme) by shifting `$\mathbf k$` by `$\mathbf G$`. A free state with `$k = 3\pi/2a$` in 1D appears at `$k = -\pi/2a$` in the second band.

**Brillouin zones.** The first zone is the Wigner-Seitz cell of the reciprocal lattice: a cube for sc, a rhombic dodecahedron for bcc (reciprocal fcc) and a truncated octahedron for fcc (reciprocal bcc). Every zone has the same volume, `$(2\pi)^3/V_{\rm cell}$`.

## 2. The Kronig-Penney model

A 1D chain of delta-function barriers `$V(x) = \sum_n\tfrac{\hbar^2P}{ma}\delta(x - na)$` can be solved exactly. Inside a cell the electron is free with `$E = \hbar^2\alpha^2/2m$`; matching across a delta and applying Bloch's theorem gives

```math
\cos ka = \cos\alpha a + P\,\frac{\sin\alpha a}{\alpha a}
```

The left side lies between `$-1$` and `$1$`; the right side does not always. Energies where `$|{\rm RHS}| > 1$` have no real `$k$`: they are gaps.

<figure class="fig" data-fig="kronig-penney"><figcaption>The Kronig-Penney condition. In the first view the shaded strips are the allowed bands, where the curve lies between −1 and 1. In the second the same bands are drawn as E(k) in the reduced zone, with the free-electron parabola folded back (dashed). Slide P from 0 (free electrons) to large values (narrow bands, the tight-binding limit). Every band ends exactly at the free-electron energy at the zone boundary.</figcaption></figure>

What to read off:

- At `$\alpha a = n\pi$`, `$\sin = 0$` and `$\cos = \pm1$`: the upper edge of every band sits at the free-electron energy `$n^2\hbar^2\pi^2/2ma^2$`, whatever `$P$` is.
- The lower edges move up as `$P$` grows. For `$P = 3\pi/2$` the second band starts at `$\alpha a = 3\pi/2$` exactly, so the first gap is `$\tfrac54\cdot\hbar^2\pi^2/2ma^2$`.
- `$P \to 0$`: free electrons. `$P \to \infty$`: bands shrink (width `$\propto 1/P$`) to the levels of a box of width `$a$`.
- At higher energy `$P\sin(\alpha a)/\alpha a$` gets smaller, so bands widen and gaps take up less of the energy axis.

## 3. Nearly free electrons

Now take a weak potential `$V(\mathbf r) = \sum_{\mathbf G}U_{\mathbf G}e^{i\mathbf G\cdot\mathbf r}$`. Away from zone boundaries, perturbation theory changes free energies only at second order. But on a Bragg plane, where `$|\mathbf k| = |\mathbf k - \mathbf G|$`, the two plane waves are degenerate and mix strongly:

```math
\begin{pmatrix} E^0_{\mathbf k} & U_{\mathbf G}^* \\ U_{\mathbf G} & E^0_{\mathbf k - \mathbf G}\end{pmatrix}, \qquad E_\pm = \frac{E^0_{\mathbf k} + E^0_{\mathbf k - \mathbf G}}{2} \pm \sqrt{\left(\frac{E^0_{\mathbf k} - E^0_{\mathbf k - \mathbf G}}{2}\right)^2 + |U_{\mathbf G}|^2}
```

<div class="steps">
<div class="step">

**On the plane.** The square root becomes `$|U_{\mathbf G}|$`: the gap is `$2|U_{\mathbf G}|$`, set by one Fourier component of the potential.

</div>
<div class="step">

**Standing waves.** In 1D at `$k = \pi/a$` the eigenstates are `$\cos(\pi x/a)$` and `$\sin(\pi x/a)$`. The cosine piles charge on the ions; with attractive ions it is the lower state. The difference in potential energy is the gap.

</div>
<div class="step">

**Near the plane.** Write `$k = \pi/a + q$` and `$\lambda = \dfrac{\hbar^2}{2m}\left(\dfrac\pi a\right)^2$`. Expanding the square root: `$E_\pm = \lambda \pm |U| + \dfrac{\hbar^2q^2}{2m}\left(1 \pm \dfrac{2\lambda}{|U|}\right)$`.

</div>
<div class="step">

**Effective masses.** The upper band has `$m^*/m = 1/(1 + 2\lambda/|U|)$`, the lower `$1/(1 - 2\lambda/|U|)$`, negative when `$2\lambda > |U|$`. Small gaps make light carriers: InSb with a gap of 0.17 eV has `$m^* = 0.014m_e$`.

</div>
</div>

**Worked example.** For `$V(x) = 0.60\cos(2\pi x/a) + 0.20\cos(4\pi x/a)$` eV, `$U_{2\pi/a} = 0.30$` eV and `$U_{4\pi/a} = 0.10$` eV. The first gap (at `$k = \pi/a$`) is 0.60 eV and the second (at `$k = 2\pi/a$`, the plane of `$G = 4\pi/a$`) is 0.20 eV. A pure cosine potential opens only the first gap at first order.

In 2D and 3D the free-electron sphere is cut by many Bragg planes. Constant-energy surfaces meet each plane at right angles, the pieces outside the first zone are folded back by `$\mathbf G$`, and the enclosed volume stays fixed by the electron count. A divalent square lattice has `$k_F = \sqrt{4\pi}/a = 1.13\,\pi/a$`: the circle crosses the zone edges, so electrons spill into the second zone and leave holes in the first.

## 4. Tight binding

The opposite limit starts from atomic orbitals `$\phi(\mathbf r - \mathbf R)$` and lets electrons hop between neighbours with amplitude `$t$`. The Bloch combination `$\sum_{\mathbf R}e^{i\mathbf k\cdot\mathbf R}\phi(\mathbf r - \mathbf R)$` has energy

```math
E(\mathbf k) = E_0 - t\sum_{\boldsymbol\delta}e^{i\mathbf k\cdot\boldsymbol\delta} \quad\Rightarrow\quad E = E_0 - 2t\cos ka \ \ (\text{chain})
```

| lattice | neighbours `$z$` | bandwidth | `$m^*$` at `$\Gamma$` |
| --- | --- | --- | --- |
| chain | 2 | `$4t$` | `$\hbar^2/2ta^2$` |
| square | 4 | `$8t$` | `$\hbar^2/2ta^2$` |
| simple cubic | 6 | `$12t$` | `$\hbar^2/2ta^2$` |
| bcc | 8 | `$16t$` | `$\hbar^2/2ta^2$` (with cube side `$a$`) |
| fcc | 12 | `$16t$` (not `$24t$`) | `$\hbar^2/2ta^2$` (with cube side `$a$`) |

On lattices where every neighbour phase can be `$-1$` at once (bipartite), the width is `$2zt$`; on fcc and triangular lattices it is less. Narrow overlap means small `$t$`, narrow bands and heavy electrons: the 4f bands of rare earths are almost flat, the 3d bands of iron a few eV wide.

**Worked example.** A square lattice with `$a = 0.40$` nm and `$m^* = 0.50m_e$` at the band bottom has `$t = \hbar^2/2m^*a^2 = 0.0381/(0.50\times0.16) = 0.48$` eV and bandwidth `$8t = 3.8$` eV.

<div class="problem" data-problem="bth-tight-binding"></div>

## 5. Electrons, holes and fields

A wave packet built from one band moves at the group velocity and responds to an external force through its crystal momentum:

```math
\mathbf v = \frac1\hbar\nabla_{\mathbf k}E, \qquad \hbar\dot{\mathbf k} = \mathbf F = -e(\mathbf E + \mathbf v\times\mathbf B), \qquad \left(\frac1{m^*}\right)_{ij} = \frac1{\hbar^2}\frac{\partial^2E}{\partial k_i\partial k_j}
```

- At a zone boundary `$v = 0$` (standing waves); for `$E_0 - 2t\cos ka$`, `$v$` is largest at `$ka = \pi/2$`, where `$m^*$` is infinite.
- Near a band top `$m^* < 0$`. A nearly full band is best described by its few empty states, **holes**: wave vector `$-\mathbf k_e$`, charge `$+e$`, positive mass `$-m_e^*$`. A full band carries no current.
- **Bloch oscillations.** In a constant field `$k$` sweeps across the zone in time `$T = h/eEa$` and the electron oscillates instead of accelerating. For `$a = 0.5$` nm and `$10^6$` V/m, `$T = 8$` ps, much longer than `$\tau \sim 10^{-14}$` s; they are seen only in superlattices.
- **Anisotropic masses.** Silicon's six conduction valleys have `$m_l = 0.98m_e$`, `$m_t = 0.19m_e$`. Averaging inverse masses gives the conductivity mass `$3/(1/m_l + 2/m_t) = 0.26m_e$`.

**Metals and insulators.** Each band takes 2 electrons per primitive cell. An odd number per cell always gives a metal (Na, Cu, Al). An even number allows an insulator (diamond, Si, NaCl), but bands may overlap in 3D and give a metal anyway (Mg, Zn, Ca). Semiconductors are insulators with a small gap: [lesson 7.8](/learn/courses/gate-physics/semiconductors-hall/).

<div class="myth">

**"The electron's momentum is ħk."** A Bloch state mixes plane waves `$\mathbf k + \mathbf G$`, so it has no definite momentum. `$\hbar\mathbf k$` is conserved only up to `$\hbar\mathbf G$` and changes only with external forces.

**"Negative effective mass means the electron is weird."** It means the lattice takes up momentum: near the band top a push brings the electron closer to Bragg reflection, and the lattice kicks it back harder than you pushed.

</div>

<div class="keypoints">

- Bloch: `$\psi = e^{i\mathbf k\cdot\mathbf r}u_{\mathbf k}$`; `$N$` values of `$\mathbf k$` per band, 2 electrons per primitive cell; `$E(\mathbf k + \mathbf G) = E(\mathbf k)$`.
- Kronig-Penney: `$\cos ka = \cos\alpha a + P\sin\alpha a/\alpha a$`; band tops at `$\alpha a = n\pi$`; large `$P$` gives narrow bands.
- Nearly free: gap `$2|U_{\mathbf G}|$` on each Bragg plane; standing waves; `$m^*/m = 1/(1 \pm 2\lambda/|U|)$` near the gap.
- Tight binding: `$E = E_0 - 2t\cos ka$`, width `$4t$` (`$2zt$` on bipartite lattices, `$16t$` for fcc), `$m^* = \hbar^2/2ta^2$`.
- `$v = \hbar^{-1}\nabla_kE$`, `$\hbar\dot{\mathbf k} = \mathbf F$`, `$1/m^* = \hbar^{-2}E''$`; holes have `$+e$` and `$m_h > 0$`; Bloch period `$h/eEa$`.
- Odd electrons per cell: metal. Even: insulator only if no bands overlap.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="band-theory" data-exam="gate" data-n="10"></div>

**Next:** [lesson 7.8](/learn/courses/gate-physics/semiconductors-hall/) fills these bands with electrons and holes and measures them with the Hall effect. The [Band structure explorer](/science/band-structure/) draws bands for simple lattice models. Back to the [GATE Physics course](/learn/courses/gate-physics/).
