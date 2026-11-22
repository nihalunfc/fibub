---
title: 'The quantum harmonic oscillator and ladder operators'
seoTitle: 'Quantum harmonic oscillator and ladder operators, GATE'
summary: 'The oscillator solved the algebraic way: raising and lowering operators, the spectrum (n + ½)ħω without a differential equation, matrix elements of x and p in seconds, Hermite functions, the classical limit, coherent states, sudden changes, and oscillators in 2D, 3D and in a field.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'What is a†|n⟩ for the oscillator raising operator?'
    choices: ['√(n+1) |n+1⟩', '√n |n+1⟩', '(n+1) |n+1⟩', '√(n+1) |n−1⟩']
    ans: 0
    why: 'The norm of a†|n⟩ is ⟨n|aa†|n⟩ = ⟨n|(N + 1)|n⟩ = n + 1, so the factor is √(n+1). Lowering gives a|n⟩ = √n |n−1⟩.'
  - q: 'In the oscillator state |3⟩, ⟨x²⟩ in units of ħ/2mω is'
    choices: ['7', '3.5', '3', '9']
    ans: 0
    why: 'x² ∝ (a + a†)², whose diagonal part is aa† + a†a = 2N + 1 = 7. In units of ħ/mω it would be 3.5.'
  - q: 'A coherent state |α⟩ is an eigenstate of which operator?'
    choices: ['The lowering operator a', 'The raising operator a†', 'The number operator N', 'The Hamiltonian H']
    ans: 0
    why: 'a|α⟩ = α|α⟩. It is not an energy eigenstate: its number of quanta is Poisson distributed with mean |α|².'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), section 2.3'
  - 'R. Shankar, Principles of Quantum Mechanics, 2nd ed. (1994), chapter 7: the harmonic oscillator'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (2021), sections 2.3 and 2.4'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 50 minutes.** By the end you will be able to build the whole oscillator spectrum from `$[a, a^\dagger] = 1$`, evaluate any matrix element of `$x$`, `$p$` or their powers in a few lines, sketch the eigenfunctions and compare them with the classical motion, and handle coherent states, sudden changes and 2D and 3D oscillators. The levels `$(n + \tfrac12)\hbar\omega$` and the Gaussian ground state were met in [IIT JAM lesson 6.3](/learn/courses/iit-jam-physics/schrodinger-equation/); the classical oscillator is in the [SHM lesson](/learn/courses/iit-jam-physics/simple-harmonic-motion/).

<div class="bigidea">Factor the oscillator Hamiltonian into two operators that lower and raise the energy by exactly one quantum ħω. The bottom of the ladder fixes the zero-point energy, and every state and matrix element follows from one commutator.</div>

## 1. Ladder operators

Start from `$\hat H = \dfrac{\hat p^2}{2m} + \tfrac12m\omega^2\hat x^2$` and define

```math
a = \sqrt{\frac{m\omega}{2\hbar}}\left(\hat x + \frac{i\hat p}{m\omega}\right), \qquad a^\dagger = \sqrt{\frac{m\omega}{2\hbar}}\left(\hat x - \frac{i\hat p}{m\omega}\right)
```

Using `$[\hat x, \hat p] = i\hbar$` from [lesson 4.2](/learn/courses/gate-physics/commutators-uncertainty/):

```math
[a, a^\dagger] = 1, \qquad \hat H = \hbar\omega\left(a^\dagger a + \tfrac12\right) = \hbar\omega\left(\hat N + \tfrac12\right)
```

and the inverse relations you will use constantly:

```math
\hat x = \sqrt{\frac{\hbar}{2m\omega}}\,(a + a^\dagger), \qquad \hat p = i\sqrt{\frac{m\hbar\omega}{2}}\,(a^\dagger - a)
```

Watch the spectrum fall out.

<div class="steps">
<div class="step">

**Ladder property.** `$[\hat N, a] = [a^\dagger, a]a = -a$` and `$[\hat N, a^\dagger] = a^\dagger$`. So if `$\hat N|\nu\rangle = \nu|\nu\rangle$`, then `$\hat N(a|\nu\rangle) = (\nu - 1)a|\nu\rangle$` and `$\hat N(a^\dagger|\nu\rangle) = (\nu + 1)a^\dagger|\nu\rangle$`.

</div>
<div class="step">

**No negative values.** `$\nu = \langle\nu|a^\dagger a|\nu\rangle = \|a|\nu\rangle\|^2 \ge 0$`. Lowering again and again would eventually go negative, unless the ladder stops.

</div>
<div class="step">

**The bottom rung.** It stops only if some state has `$a|0\rangle = 0$`. Then `$\hat N|0\rangle = 0$`, so the eigenvalues are `$\nu = n = 0, 1, 2, \dots$` and `$E_n = (n + \tfrac12)\hbar\omega$`.

</div>
<div class="step">

**Normalisation.** `$\|a|n\rangle\|^2 = n$` and `$\|a^\dagger|n\rangle\|^2 = \langle n|aa^\dagger|n\rangle = n + 1$`. Choosing real positive factors: `$a|n\rangle = \sqrt n\,|n-1\rangle$`, `$a^\dagger|n\rangle = \sqrt{n+1}\,|n+1\rangle$`.

</div>
<div class="step">

**All states from the ground state.** `$|n\rangle = \dfrac{(a^\dagger)^n}{\sqrt{n!}}|0\rangle$`. In position space `$a|0\rangle = 0$` is the first-order equation `$\left(x + \tfrac{\hbar}{m\omega}\tfrac{d}{dx}\right)\psi_0 = 0$`, so `$\psi_0 \propto e^{-m\omega x^2/2\hbar}$`.

</div>
</div>

<div class="meaning">

<dl>
<dt>a, a†</dt><dd>remove or add one quantum ħω; neither is Hermitian, so neither is an observable</dd>
<dt>N = a†a</dt><dd>counts the quanta (phonons, photons) in the state</dd>
<dt>½ħω</dt><dd>zero-point energy: the bottom rung, forced by [x, p] = iħ</dd>
<dt>x₀ = √(ħ/mω)</dt><dd>the natural length; for an electron x₀ = √(0.0762/ħω) nm with ħω in eV</dd>
<dt>Physical meaning</dt><dd>Energy enters and leaves the oscillator only in whole quanta, which is why a vibrating molecule or a mode of light absorbs and emits ħω at a time.</dd>
</dl>

</div>

## 2. Matrix elements in seconds

Write `$\ell = \sqrt{\hbar/2m\omega}$`. Then `$\langle m|\hat x|n\rangle = \ell(\sqrt n\,\delta_{m,n-1} + \sqrt{n+1}\,\delta_{m,n+1})$`: `$x$` connects only neighbours (the dipole rule `$\Delta n = \pm1$`), and the factor is the square root of the larger label. For powers, expand and keep only terms that return to where you started:

```math
\langle n|\hat x^2|n\rangle = \ell^2(2n + 1), \qquad \langle n|\hat p^2|n\rangle = \frac{m\hbar\omega}{2}(2n + 1), \qquad \Delta x\,\Delta p = \left(n + \tfrac12\right)\hbar
```

So `$\langle T\rangle = \langle V\rangle = \tfrac12E_n$` in every stationary state (the virial theorem for `$n = 2$`). For `$x^4$`, the diagonal part of `$(a + a^\dagger)^4$` gives `$\langle n|\hat x^4|n\rangle = \ell^4(6n^2 + 6n + 3)$`.

**Worked example.** At `$t = 0$` the oscillator is in `$(|0\rangle + |2\rangle)/\sqrt2$`. Find `$\langle T\rangle$`.

1. `$\hat T = \dfrac{\hat p^2}{2m} = \dfrac{\hbar\omega}{4}(2\hat N + 1 - a^2 - a^{\dagger2})$`.
2. `$\langle2\hat N + 1\rangle = \tfrac12(1 + 5) = 3$`. `$a^2|2\rangle = \sqrt2|0\rangle$`, so `$\langle a^2\rangle = \langle a^{\dagger2}\rangle = \sqrt2/2$`.
3. `$\langle T\rangle = \tfrac14(3 - \sqrt2)\hbar\omega = 0.396\hbar\omega$`, and `$\langle V\rangle = 1.104\hbar\omega$`. They add to `$1.5\hbar\omega$`, the mean of `$\tfrac12$` and `$\tfrac52$`; in this non-stationary state they slosh back and forth at `$2\omega$`.

<div class="problem" data-problem="oscillator-matrix"></div>

## 3. The eigenfunctions

With `$\xi = x/x_0$`, `$\psi_n(\xi) = (2^nn!\sqrt\pi)^{-1/2}H_n(\xi)e^{-\xi^2/2}$`, where the Hermite polynomials come from applying `$a^\dagger \propto \xi - d/d\xi$`: `$H_0 = 1$`, `$H_1 = 2\xi$`, `$H_2 = 4\xi^2 - 2$`, `$H_3 = 8\xi^3 - 12\xi$`. `$\psi_n$` has `$n$` nodes and parity `$(-1)^n$`.

<figure class="fig" data-fig="oscillator-states"><figcaption>The stationary states on their energy levels inside the parabola, or (third button) |ψₙ|² against the classical density of a particle with the same energy. Turning points are dashed; the readout gives the probability of being found where a classical particle never goes, 16% for n = 0 and shrinking slowly as n grows.</figcaption></figure>

Slide n from 0 up to 30 and switch between the density and ψ itself.

<figure class="fig" data-fig="@qm-ho-classical"><figcaption>The quantum density has n nodes and leaks past the classical turning points; at large n it averages out to the classical curve, which piles up at the ends where the ball moves slowest.</figcaption></figure>

For large `$n$` the wiggles average to the classical density `$1/(\pi\sqrt{A^2 - x^2})$`, largest near the turning points where the particle is slowest: the correspondence principle at work. The ground state is the opposite, largest at the centre.

A **half oscillator** (wall at `$x = 0$`) keeps only the odd states: energies `$\tfrac32\hbar\omega, \tfrac72\hbar\omega, \dots$`. An oscillator in a uniform force `$F$` is the same oscillator moved to `$x = F/m\omega^2$` and lowered by `$F^2/2m\omega^2$`, with unchanged spacing.

## 4. Coherent states

The closest quantum state to a classical swinging pendulum is the eigenstate of the lowering operator:

```math
a|\alpha\rangle = \alpha|\alpha\rangle, \qquad |\alpha\rangle = e^{-|\alpha|^2/2}\sum_n\frac{\alpha^n}{\sqrt{n!}}|n\rangle = e^{\alpha a^\dagger - \alpha^*a}|0\rangle
```

- The number of quanta is Poisson: `$P(n) = e^{-|\alpha|^2}|\alpha|^{2n}/n!$`, mean `$|\alpha|^2$`, spread `$|\alpha|$`. So `$\langle H\rangle = (|\alpha|^2 + \tfrac12)\hbar\omega$`.
- It is the ground-state Gaussian displaced in phase space, with `$\Delta x\Delta p = \hbar/2$` at all times, and `$\alpha(t) = \alpha e^{-i\omega t}$`: `$\langle x\rangle$` and `$\langle p\rangle$` follow the classical orbit.
- Different coherent states are not orthogonal: `$|\langle\beta|\alpha\rangle|^2 = e^{-|\alpha - \beta|^2}$`.

A laser mode is a coherent state of light; with `$|\alpha|^2 = 10^6$` photons the relative spread in photon number is only `$10^{-3}$`.

**Worked example (sudden changes).** An oscillator sits in its ground state.

1. The centre jumps by `$d = x_0$`: relative to the new centre the state is coherent with `$|\alpha|^2 = d^2/2x_0^2 = \tfrac12$`, so it stays in the ground state with probability `$e^{-1/2} = 0.607$`.
2. Instead `$\omega \to \omega'$`: the overlap of the two Gaussians gives `$P_0 = 2\sqrt{\omega\omega'}/(\omega + \omega')$`; for `$\omega' = \omega/4$`, `$P_0 = 0.80$`. The new first excited state is never reached (wrong parity), and the mean energy jumps because a sudden change does work.

## 5. More dimensions

A 3D oscillator separates into three 1D ones: `$E = \hbar(\omega_xn_x + \omega_yn_y + \omega_zn_z) + \tfrac12\hbar(\omega_x + \omega_y + \omega_z)$`. Isotropic:

```math
E_N = \left(N + \tfrac32\right)\hbar\omega, \qquad g_N = \frac{(N + 1)(N + 2)}{2} \quad (\text{2D: } E_N = (N + 1)\hbar\omega,\ g_N = N + 1)
```

In spherical terms the level `$N$` contains `$l = N, N - 2, \dots, 1$` or `$0$` (one parity only), linking to [lesson 4.5](/learn/courses/gate-physics/angular-momentum/): `$N = 2$` has `$l = 2$` (5 states) and `$l = 0$` (1 state), total 6. Nuclear shell-model magic numbers 2, 8, 20 come from filling exactly these levels.

<div class="myth">

**"The zero-point energy is there because the particle is jiggling at the bottom."** The ground state is stationary: nothing moves. `$\tfrac12\hbar\omega$` is the least `$\langle T\rangle + \langle V\rangle$` allowed by `$\Delta x\Delta p \ge \hbar/2$`; squeezing the Gaussian raises one term more than it lowers the other.

**"First-order perturbation theory gives the shift of an oscillator in an electric field."** It gives zero, because `$\langle n|x|n\rangle = 0$`. The true shift `$-F^2/2m\omega^2$` is second order, and exact.

</div>

<div class="keypoints">

- `$a = \sqrt{m\omega/2\hbar}(x + ip/m\omega)$`, `$[a, a^\dagger] = 1$`, `$H = \hbar\omega(N + \tfrac12)$`, `$E_n = (n + \tfrac12)\hbar\omega$`.
- `$a|n\rangle = \sqrt n|n-1\rangle$`, `$a^\dagger|n\rangle = \sqrt{n+1}|n+1\rangle$`; `$x = \sqrt{\hbar/2m\omega}(a + a^\dagger)$`, `$p = i\sqrt{m\hbar\omega/2}(a^\dagger - a)$`.
- `$\langle x^2\rangle_n = (2n + 1)\hbar/2m\omega$`, `$\Delta x\Delta p = (n + \tfrac12)\hbar$`, `$\langle T\rangle = \langle V\rangle$` in stationary states; `$x$` connects `$n \to n \pm 1$` only.
- `$\psi_n \propto H_n(\xi)e^{-\xi^2/2}$`: `$n$` nodes, parity `$(-1)^n$`; half oscillator keeps odd `$n$`.
- Coherent states: `$a|\alpha\rangle = \alpha|\alpha\rangle$`, Poisson numbers, minimum uncertainty, classical motion.
- 3D isotropic: `$(N + \tfrac32)\hbar\omega$`, degeneracy `$(N+1)(N+2)/2$`; 2D: `$N + 1$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [harmonic oscillator practice page](/learn/courses/gate-physics/practice/harmonic-oscillator/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="harmonic-oscillator" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.5](/learn/courses/gate-physics/angular-momentum/) uses the same ladder trick for angular momentum. The [1D Schrödinger solver](/science/schrodinger-solver/) draws oscillator states next to any other potential. Back to the [GATE Physics course](/learn/courses/gate-physics/).
