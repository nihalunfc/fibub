---
title: 'The hydrogen atom'
summary: 'Hydrogen solved properly: reduced mass and separation of variables, the radial equation and effective potential, why the series must stop, energies −13.6/n² eV with n² degeneracy, radial functions and nodes, radial probability, the expectation values of r, 1/r and 1/r², the virial theorem, densities at the nucleus and the hidden symmetry behind the l degeneracy.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'How many radial nodes does the 4d radial function have?'
    choices: ['1', '0', '2', '3']
    ans: 0
    why: 'n − l − 1 = 4 − 2 − 1 = 1. With l = 2 angular nodes, the total is n − 1 = 3.'
  - q: 'In the hydrogen ground state, where is the radial probability density r²|R|² largest?'
    choices: ['At r = a₀', 'At r = 0', 'At r = 1.5a₀', 'At r = 2a₀']
    ans: 0
    why: 'P(r) ∝ r²e^(−2r/a₀) peaks at a₀. The density |ψ|² itself is largest at the nucleus, and the mean ⟨r⟩ = 1.5a₀.'
  - q: 'Which expectation value is the same for every l and m of a given n?'
    choices: ['⟨1/r⟩ = 1/(n²a₀)', '⟨r⟩', '⟨1/r²⟩', '|ψ(0)|²']
    ans: 0
    why: 'The virial theorem gives ⟨V⟩ = 2E_n, and E_n depends only on n. ⟨r⟩, ⟨1/r²⟩ and the density at the origin all depend on l.'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), section 4.2: the hydrogen atom'
  - 'R. Shankar, Principles of Quantum Mechanics, 2nd ed. (1994), chapter 13: the hydrogen atom'
  - 'L. I. Schiff, Quantum Mechanics, 3rd ed. (1968), section 16: the hydrogen atom'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 50 minutes.** By the end you will be able to reduce hydrogen to a one-dimensional radial problem, derive the energy levels and their degeneracy, sketch and normalise the radial functions, find probabilities and expectation values in seconds, and use the virial theorem and the scaling with nuclear charge and reduced mass. The angular functions come from [lesson 4.5](/learn/courses/gate-physics/angular-momentum/); the Bohr model, spectral series and hydrogen-like ions are in [IIT JAM lesson 6.4](/learn/courses/iit-jam-physics/atoms-x-rays/), and here we only add what the Schrödinger equation changes.

<div class="bigidea">For any central potential the angular part is a spherical harmonic, and what is left is a 1D problem for u = rR in an effective potential. For the Coulomb potential the bound solutions exist only when a power series stops, which forces E = −13.6 eV/n², with every l from 0 to n − 1 sharing the same energy.</div>

## 1. From two bodies to one radial equation

The proton and electron interact through `$V(r) = -e^2/4\pi\epsilon_0 r$`, which depends only on their separation. Centre-of-mass and relative coordinates separate exactly; the relative motion is that of one particle with the **reduced mass** `$\mu = m_em_p/(m_e + m_p) = 0.99946\,m_e$`.

Since `$V$` is central, `$H$`, `$L^2$` and `$L_z$` commute, and `$\psi = R(r)Y_{lm}(\theta, \phi)$`. Writing `$R = u/r$` turns the radial part into a 1D equation on `$r > 0$`:

```math
-\frac{\hbar^2}{2\mu}\frac{d^2u}{dr^2} + \left[-\frac{e^2}{4\pi\epsilon_0r} + \frac{l(l+1)\hbar^2}{2\mu r^2}\right]u = Eu, \qquad u(0) = 0
```

The bracket is the **effective potential**: Coulomb attraction plus a centrifugal barrier `$L^2/2\mu r^2$`. The barrier keeps electrons with `$l \ge 1$` away from the nucleus, and the condition `$u(0) = 0$` acts like a hard wall at the origin (a non-zero `$u(0)$` would give `$\psi \propto 1/r$`, whose Laplacian is a delta function that nothing in `$H$` cancels).

## 2. Why the energies are −13.6 eV/n²

Measure lengths in `$a_0 = 4\pi\epsilon_0\hbar^2/\mu e^2 = 0.0529$` nm and energies in the Rydberg `$\text{Ry} = \hbar^2/2\mu a_0^2 = 13.6$` eV. For a bound state write `$E = -\text{Ry}/\nu^2$` with `$\nu > 0$` still unknown. Watch the quantisation appear.

<div class="steps">
<div class="step">

Pick n = 1 to 6 and count the wavelengths round the orbit, then switch to 'Any wavelength' and drag to a fraction.

<figure class="fig" data-fig="@qm-bohr-standing"><figcaption>Only a whole number of wavelengths closes up on itself, which is the same as L = nħ. Between the whole numbers the wave cancels itself and no orbit survives.</figcaption></figure>

**Dimensionless form.** With `$\rho = r/a_0$`: `$u'' = \left[\dfrac{1}{\nu^2} - \dfrac{2}{\rho} + \dfrac{l(l+1)}{\rho^2}\right]u$`.

</div>
<div class="step">

**The two ends.** Far out, `$u'' \approx u/\nu^2$`, so the normalisable solution decays as `$e^{-\rho/\nu}$`. Near the origin the centrifugal term wins: `$u \approx \rho^{l+1}$` (the other solution, `$\rho^{-l}$`, is not allowed).

</div>
<div class="step">

**Peel them off.** Put `$u = \rho^{l+1}e^{-\rho/\nu}v(\rho)$` and expand `$v = \sum_kc_k\rho^k$`. The equation gives the two-term recursion `$c_{k+1} = \dfrac{2[(k + l + 1)/\nu - 1]}{(k + 1)(k + 2l + 2)}\,c_k$`.

</div>
<div class="step">

**The series must stop.** For large `$k$`, `$c_{k+1}/c_k \to 2/(\nu k)$`, the ratio for `$e^{2\rho/\nu}$`. An endless series would turn the decaying solution into a growing one. So some `$c_{k+1}$` must vanish: `$k + l + 1 = \nu$` for a whole number `$k = n_r \ge 0$`.

</div>
<div class="step">

**The levels.** `$\nu = n = n_r + l + 1$` is a positive integer, `$l \le n - 1$`, and `$E_n = -\text{Ry}/n^2 = -13.6\ \text{eV}/n^2$`. The polynomial `$v$` has degree `$n_r = n - l - 1$` (it is an associated Laguerre polynomial), so the radial function has `$n - l - 1$` nodes.

</div>
</div>

```math
E_n = -\frac{\mu e^4}{2(4\pi\epsilon_0)^2\hbar^2n^2} = -\frac{13.6\ \text{eV}}{n^2}, \qquad R_{nl}(r) \propto r^l e^{-r/na_0}\,L_{n-l-1}^{2l+1}\!\left(\frac{2r}{na_0}\right)
```

<div class="meaning">

<dl>
<dt>n = n<sub>r</sub> + l + 1</dt><dd>the principal quantum number: radial nodes plus angular nodes plus one</dd>
<dt>l = 0, …, n − 1</dt><dd>for each n; each l has 2l + 1 values of m, so the level holds n² orbital states (2n² with spin)</dd>
<dt>e<sup>−r/na₀</sup></dt><dd>the outer tail: higher levels are bound more weakly and reach further out</dd>
<dt>r<sup>l</sup></dt><dd>the behaviour near the nucleus: only s states (l = 0) have non-zero density at r = 0</dd>
<dt>Physical meaning</dt><dd>Bound states exist only at energies where the decaying tail and the regular behaviour at the origin join smoothly. That happens at −13.6/n² eV: the Bohr energies, now with the right degeneracy and real wavefunctions.</dd>
</dl>

</div>

**Worked example.** Count the `$n = 3$` states with `$m = 1$`, ignoring spin. `$m = 1$` needs `$l \ge 1$`, so `$l = 1$` or `$2$`: two states. The whole level has `$1 + 3 + 5 = 9$` states.

## 3. Radial functions and probabilities

With `$a_0 = 1$`, the first few normalised radial functions are

```math
R_{10} = 2e^{-r}, \qquad R_{20} = \frac{1}{\sqrt2}\left(1 - \frac r2\right)e^{-r/2}, \qquad R_{21} = \frac{1}{2\sqrt6}\,r\,e^{-r/2}
```

so that `$\psi_{100} = e^{-r/a_0}/\sqrt{\pi a_0^3}$`. The probability of finding the electron between `$r$` and `$r + dr$` is `$P(r)\,dr = r^2|R_{nl}|^2dr$`. The factor `$r^2$` (the area of the shell) pushes the peak away from the nucleus even though `$|\psi|^2$` is largest there for `$s$` states.

<figure class="fig" data-fig="hydrogen-radial"><figcaption>Radial probability density r²|R_nl|² for n up to 4. Choose a state to see its nodes, its most probable radius and ⟨r⟩, or show all l of one n: the circular state l = n − 1 peaks exactly at n²a₀, while s states have an inner bump close to the nucleus.</figcaption></figure>

Click through 1s, 2s, 2p, 3s, 3p and the 3d shapes, and flip between density and sign, vertical and flat slices.

<figure class="fig" data-fig="@qm-orbital-slices"><figcaption>Count the rings (radial nodes, n − l − 1) and the flat nodal planes (l). Neighbouring lobes of a p or d orbital have opposite sign, drawn in the two colours.</figcaption></figure>

**Worked example.** The chance that the ground-state electron is inside `$r = a_0$`:

1. `$P = \int_0^{a_0}\dfrac{4r^2}{a_0^3}e^{-2r/a_0}dr$`. Put `$t = 2r/a_0$`: `$P = \tfrac12\int_0^2t^2e^{-t}dt$`.
2. `$\int_0^xt^2e^{-t}dt = 2 - e^{-x}(x^2 + 2x + 2)$`, so `$P = \tfrac12[2 - 10e^{-2}] = 1 - 5e^{-2} = 0.323$`.

Less than a third, although `$a_0$` is the most probable radius. The classical turning point of the ground state is at `$2a_0$` (where `$V = E$`), yet the electron is beyond it with probability `$13e^{-4} = 0.24$`.

<div class="problem" data-problem="hyd-inside"></div>

## 4. Expectation values and the virial theorem

These results are worth knowing by heart (lengths in `$a_0$`, nuclear charge `$Z$` scales every length by `$1/Z$`):

```math
\langle r\rangle = \frac{a_0}{2Z}\left[3n^2 - l(l+1)\right], \qquad \left\langle\frac1r\right\rangle = \frac{Z}{n^2a_0}, \qquad \left\langle\frac{1}{r^2}\right\rangle = \frac{Z^2}{n^3(l + \tfrac12)a_0^2}, \qquad \left\langle\frac{1}{r^3}\right\rangle = \frac{Z^3}{n^3l(l + \tfrac12)(l+1)a_0^3}
```

The `$1/r$` result needs no integral: for a `$1/r$` potential the **virial theorem** gives `$2\langle T\rangle = -\langle V\rangle$`, so `$\langle T\rangle = -E_n$` and `$\langle V\rangle = 2E_n$`. In the ground state the kinetic energy is `$+13.6$` eV and the potential energy `$-27.2$` eV. The `$1/r^2$` and `$1/r^3$` averages depend on `$l$`; they set the size of relativistic and spin-orbit corrections, which is why fine structure (module 6) lifts the `$l$` degeneracy.

**Worked example.** Compare `$2s$` and `$2p$`. `$\langle r\rangle_{2s} = \tfrac12(12)a_0 = 6a_0$` and `$\langle r\rangle_{2p} = \tfrac12(12 - 2)a_0 = 5a_0$`: at fixed `$n$`, larger `$l$` is more compact on average. Yet `$|\psi_{200}(0)|^2 = 1/(8\pi a_0^3)$` while `$\psi_{21m}(0) = 0$`: the `$2s$` electron also spends time right at the nucleus. In general `$|\psi_{n00}(0)|^2 = Z^3/(\pi a_0^3n^3)$`, the `$n^{-3}$` law of contact (hyperfine) interactions.

**Worked example.** The ground state's spread: `$\langle r^2\rangle = \tfrac{4}{a_0^3}\int_0^\infty r^4e^{-2r/a_0}dr = 3a_0^2$`, so `$\Delta r = \sqrt{3 - 2.25}\,a_0 = 0.87a_0$`, and `$\langle p^2\rangle = 2\mu\langle T\rangle = \hbar^2/a_0^2$`. The product `$\Delta r\,\Delta p \approx \hbar$` shows why the atom has the size it has: squeezing it raises the kinetic energy faster than the Coulomb energy falls.

## 5. Degeneracy, symmetry and scaling

- **Degeneracy `$n^2$`.** Rotational symmetry explains only the `$2l + 1$` values of `$m$`. The equality of `$2s$` and `$2p$` comes from an extra conserved vector special to `$1/r$`, the Runge-Lenz vector (the reason Kepler ellipses do not precess). Any departure from `$1/r$`, such as screening in alkali atoms, splits the `$l$` values.
- **Parity** of `$\psi_{nlm}$` is `$(-1)^l$`, so electric dipole transitions need `$\Delta l = \pm1$`; `$2s$` cannot decay to `$1s$` by one photon.
- **Scaling.** For nuclear charge `$Z$` and reduced mass `$\mu$`: lengths `$\propto 1/(Z\mu)$`, energies `$\propto Z^2\mu$`. A sudden change of `$Z$` (beta decay of the nucleus) leaves `$\psi$` unchanged, and the chance to stay in `$1s$` is the squared overlap `$[8(ZZ')^{3/2}/(Z + Z')^3]^2$`.
- **Exactly solvable cousins.** Adding `$\beta/r^2$` to the Coulomb potential just changes `$l(l+1)$` to `$s(s+1) = l(l+1) + 2\mu\beta/\hbar^2$`, and the levels become `$-\text{Ry}/(n_r + s + 1)^2$`.

The [Hydrogen orbital viewer](/science/hydrogen-orbitals/) draws `$|\psi_{nlm}|^2$` in 3D from these same radial and angular functions.

<div class="myth">

**"The ground-state electron is most likely found at the nucleus" and "it is most likely found at a₀" cannot both be true.** They are, for different questions. `$|\psi|^2$`, the probability per unit volume, is largest at `$r = 0$`. `$P(r) = 4\pi r^2|\psi|^2$`, the probability per unit radius, is largest at `$a_0$`, because a shell at larger `$r$` contains more volume.

**"Energy depends on l in hydrogen because larger l means faster orbiting."** In the Schrödinger theory of hydrogen, `$E$` depends only on `$n$`. The `$l$` dependence you see in sodium comes from screening by inner electrons, and the tiny one in hydrogen from relativity and spin.

</div>

<div class="keypoints">

- `$\psi = R_{nl}(r)Y_{lm}$`, `$u = rR$` obeys a 1D equation with `$V_{\text{eff}} = -e^2/4\pi\epsilon_0r + l(l+1)\hbar^2/2\mu r^2$` and `$u(0) = 0$`.
- `$E_n = -13.6Z^2/n^2$` eV (times `$\mu/m_e$`); `$l = 0, \dots, n - 1$`; degeneracy `$n^2$` (`$2n^2$` with spin).
- `$R_{nl} \propto r^le^{-Zr/na_0}\times$` polynomial of degree `$n - l - 1$`; nodes: `$n - l - 1$` radial, `$l$` angular.
- `$\langle r\rangle = \tfrac{a_0}{2Z}[3n^2 - l(l+1)]$`, `$\langle 1/r\rangle = Z/n^2a_0$`; `$l = n - 1$` states peak at `$n^2a_0/Z$`.
- Virial: `$\langle T\rangle = -E$`, `$\langle V\rangle = 2E$`. `$|\psi_{n00}(0)|^2 = Z^3/\pi a_0^3n^3$`.
- `$1s$`: `$P(r < a_0) = 1 - 5e^{-2} = 0.32$`, `$\langle r\rangle = 1.5a_0$`, `$\langle r^2\rangle = 3a_0^2$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [hydrogen atom practice page](/learn/courses/gate-physics/practice/hydrogen-atom/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="hydrogen-atom" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.7](/learn/courses/gate-physics/spin-addition/) adds the electron's spin and shows how to combine angular momenta. Back to the [GATE Physics course](/learn/courses/gate-physics/).
