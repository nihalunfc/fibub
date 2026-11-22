---
title: 'Commutators and the uncertainty relation'
summary: 'Commutator algebra and the canonical relation [x, p] = iħ, compatible and incompatible observables, the general (Robertson) uncertainty relation derived step by step, which states reach the minimum, the energy-time relation, and fast uncertainty estimates of ground-state energies.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'In a state |l, m⟩ we have ΔL_z = 0 but ΔL_x > 0. Why is this allowed?'
    choices: ['The bound ½|⟨[L_z, L_x]⟩| = ½ħ|⟨L_y⟩| is zero in that state', 'L_x is not Hermitian', 'Uncertainty relations apply only to x and p', 'ΔL_x is in fact also zero']
    ans: 0
    why: 'Robertson gives ΔL_z ΔL_x ≥ ½ħ|⟨L_y⟩|, and ⟨L_y⟩ = 0 in any |l, m⟩. A zero bound allows a zero product.'
  - q: 'Which wavefunction has Δx Δp = ħ/2 exactly?'
    choices: ['A Gaussian, possibly multiplied by e^(ik₀x)', 'e^(−|x|/a)', 'The ground state of an infinite well', 'Any real wavefunction']
    ans: 0
    why: 'Only Gaussians with a real width saturate the bound. e^(−|x|/a) gives 0.707ħ and the box ground state 0.568ħ.'
  - q: 'The trace of the commutator of two finite matrices is always'
    choices: ['zero', 'iħ', 'equal to the size of the matrices', 'the product of the two traces']
    ans: 0
    why: 'Tr(AB) = Tr(BA), so Tr[A, B] = 0. Since Tr(iħ·1) is not zero, x and p cannot be finite matrices.'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), section 3.5: the uncertainty principle'
  - 'R. Shankar, Principles of Quantum Mechanics, 2nd ed. (1994), chapter 9: the Heisenberg uncertainty relations'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (2021), sections 1.4 and 2.2'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 45 minutes.** By the end you will be able to evaluate commutators quickly with a few identities, decide which observables can be known together, derive and use the general uncertainty relation, recognise minimum-uncertainty states, read the energy-time relation correctly, and estimate ground-state energies in two lines. The wave-packet picture of uncertainty is in [IIT JAM lesson 6.2](/learn/courses/iit-jam-physics/matter-waves/); this lesson derives it from the operators of [lesson 4.1](/learn/courses/gate-physics/postulates-operators/).

<div class="bigidea">Two observables can be sharp together only if measuring one leaves the other alone, and that happens exactly when their operators commute. When they do not, the commutator sets a floor under the product of their spreads.</div>

## 1. Commutator algebra

The commutator `$[\hat A, \hat B] = \hat A\hat B - \hat B\hat A$` measures how much the order matters. Four identities do almost every calculation:

```math
[A, B] = -[B, A], \qquad [A, BC] = [A, B]C + B[A, C], \qquad [AB, C] = A[B, C] + [A, C]B
```

```math
[A, [B, C]] + [B, [C, A]] + [C, [A, B]] = 0 \quad\text{(Jacobi)}
```

The operator you pass over stays where it was: in `$[A, BC]$`, `$B$` stays on the left and `$C$` on the right. For Hermitian `$A$` and `$B$`, `$[A, B]^\dagger = [B, A] = -[A, B]$`: the commutator is anti-Hermitian, so `$i[A, B]$` is Hermitian.

The canonical commutator follows from acting on a test function:

```math
[\hat x, \hat p] = i\hbar, \qquad [\hat x_i, \hat p_j] = i\hbar\,\delta_{ij}, \qquad [\hat x_i, \hat x_j] = [\hat p_i, \hat p_j] = 0
```

From it, by induction, come the two rules for functions:

```math
[\hat x, f(\hat p)] = i\hbar\,f'(\hat p), \qquad [f(\hat x), \hat p] = i\hbar\,f'(\hat x)
```

So `$[\hat x, \hat p^2] = 2i\hbar\hat p$` and `$[\hat x, \hat H] = i\hbar\hat p/m$` for `$\hat H = \hat p^2/2m + V$`.

Because `$\mathrm{Tr}(AB) = \mathrm{Tr}(BA)$`, every commutator of finite matrices is traceless, while `$i\hbar\,\hat 1$` is not. Position and momentum therefore live only in infinite-dimensional spaces.

**Worked example.** Find `$[\hat H, [\hat H, \hat x]]$` for the oscillator `$\hat H = \hat p^2/2m + \tfrac12m\omega^2\hat x^2$`.

1. `$[\hat H, \hat x] = \tfrac{1}{2m}[\hat p^2, \hat x] = -\tfrac{i\hbar}{m}\hat p$`.
2. `$[\hat H, \hat p] = \tfrac12m\omega^2[\hat x^2, \hat p] = i\hbar m\omega^2\hat x$`.
3. `$[\hat H, [\hat H, \hat x]] = -\tfrac{i\hbar}{m}\cdot i\hbar m\omega^2\hat x = \hbar^2\omega^2\hat x$`. With the Heisenberg equation `$\ddot{\hat x} = -\hbar^{-2}[\hat H, [\hat H, \hat x]]$` this is `$\ddot x = -\omega^2x$`: the operator oscillates classically.

A useful exponential identity (Baker-Campbell-Hausdorff) is `$e^{A}Be^{-A} = B + [A, B] + \tfrac{1}{2!}[A, [A, B]] + \dots$`. With `$A = ia\hat p/\hbar$` the series stops after one term: `$e^{ia\hat p/\hbar}\hat xe^{-ia\hat p/\hbar} = \hat x + a$`. Momentum generates translations.

## 2. Compatible observables

If `$[\hat A, \hat B] = 0$`, the two operators have a complete set of **common eigenvectors**. Measuring `$\hat A$` then `$\hat B$` then `$\hat A$` gives the same `$A$` value both times, so both can be sharp at once: they are **compatible**. A complete set of commuting observables labels states uniquely, like `$\hat H$`, `$\hat L^2$`, `$\hat L_z$` for an electron in a central potential (spin aside).

Two cautions. Commuting observables share *a* basis, but if a level of `$\hat A$` is degenerate, not every eigenvector of `$\hat A$` is an eigenvector of `$\hat B$`. And in a single energy eigenstate, `$\langle[\hat H, \hat Q]\rangle = (E - E)\langle Q\rangle = 0$` for any `$\hat Q$`; with `$\hat Q = \hat x$` this proves `$\langle p\rangle = 0$` in every bound stationary state, even a complex one.

<div class="meaning">

<dl>
<dt>[A, B] = 0</dt><dd>compatible: a common eigenbasis exists, both can be sharp, measuring one does not disturb the other</dd>
<dt>[x, p] = iħ</dt><dd>canonically conjugate: never both sharp; momentum generates shifts in x and vice versa</dd>
<dt>σ_A σ_B ≥ ½|⟨[A, B]⟩|</dt><dd>a floor under the product of spreads, which can depend on the state</dd>
<dt>Physical meaning</dt><dd>Non-commuting operators describe measurements that disturb each other: preparing a sharp value of one necessarily spreads the other.</dd>
</dl>

</div>

## 3. The general uncertainty relation

For any observables `$A$`, `$B$` and any state, with spreads `$\sigma_A$`, `$\sigma_B$`:

```math
\sigma_A\,\sigma_B \ge \frac12\left|\langle[\hat A, \hat B]\rangle\right|
```

For `$x$` and `$p$` this gives `$\sigma_x\sigma_p \ge \hbar/2$` in every state. Here is where it comes from.

<div class="steps">
<div class="step">

Drag the time slider (or press Play) for the electron, then choose the dust grain and compare the time unit τ.

<figure class="fig" data-fig="@qm-wavepacket-spread"><figcaption>The packet widens but its momentum spread stays fixed, so Δx·Δp starts at its minimum ħ/2 and only grows. A heavy grain spreads so slowly we never notice.</figcaption></figure>

**Shifted vectors.** Let `$|f\rangle = (\hat A - \langle A\rangle)|\psi\rangle$` and `$|g\rangle = (\hat B - \langle B\rangle)|\psi\rangle$`. Then `$\sigma_A^2 = \langle f|f\rangle$` and `$\sigma_B^2 = \langle g|g\rangle$`.

</div>
<div class="step">

**Schwarz inequality.** `$\langle f|f\rangle\langle g|g\rangle \ge |\langle f|g\rangle|^2$`, with equality only when `$|f\rangle \propto |g\rangle$`.

</div>
<div class="step">

**Keep the imaginary part.** For any complex number `$|z|^2 \ge (\mathrm{Im}\,z)^2 = \left(\tfrac{z - z^*}{2i}\right)^2$`. So `$\sigma_A^2\sigma_B^2 \ge \left(\tfrac{1}{2i}(\langle f|g\rangle - \langle g|f\rangle)\right)^2$`.

</div>
<div class="step">

**Spot the commutator.** `$\langle f|g\rangle = \langle AB\rangle - \langle A\rangle\langle B\rangle$` and `$\langle g|f\rangle = \langle BA\rangle - \langle A\rangle\langle B\rangle$`, so `$\langle f|g\rangle - \langle g|f\rangle = \langle[\hat A, \hat B]\rangle$`.

</div>
<div class="step">

**Result.** `$\sigma_A^2\sigma_B^2 \ge \left(\tfrac{1}{2i}\langle[\hat A, \hat B]\rangle\right)^2$`, a positive number because the commutator's expectation value is imaginary. Taking the square root gives the relation. Keeping the real part we threw away gives the stronger Schrödinger form, with the covariance `$\left(\tfrac12\langle\{A, B\}\rangle - \langle A\rangle\langle B\rangle\right)^2$` added on the right.

</div>
</div>

Two things to notice. The bound for most pairs depends on the state: for `$L_x$` and `$L_y$` it is `$\tfrac{\hbar}{2}|\langle L_z\rangle|$`, which is zero for `$m = 0$`. And the product can be far above the bound: for the two-level state `$(\cos\theta, \sin\theta)^T$`, `$\Delta\sigma_z\Delta\sigma_x = \tfrac12|\sin4\theta|$`, while the bound `$|\langle\sigma_y\rangle|$` is zero.

**Worked example.** Find `$\Delta x\,\Delta p$` for `$\psi = a^{-1/2}e^{-|x|/a}$`.

1. Real and even, so `$\langle x\rangle = \langle p\rangle = 0$`.
2. `$\langle x^2\rangle = \tfrac{2}{a}\int_0^\infty x^2e^{-2x/a}dx = \tfrac{a^2}{2}$`.
3. `$\langle p^2\rangle = \hbar^2\int|\psi'|^2dx = \hbar^2/a^2$` (here `$|\psi'| = |\psi|/a$`).
4. `$\Delta x\Delta p = \tfrac{a}{\sqrt2}\cdot\tfrac{\hbar}{a} = 0.707\hbar$`, comfortably above `$0.5\hbar$`.

## 4. Who reaches the minimum?

Equality needs both steps of the proof to be tight: `$|g\rangle \propto |f\rangle$` (Schwarz) and `$\mathrm{Re}\langle f|g\rangle = 0$`. Together they say `$(\hat A - \langle A\rangle)\psi = i\lambda(\hat B - \langle B\rangle)\psi$` with `$\lambda$` real. For `$x$` and `$p$` this is a first-order differential equation whose solutions are the **Gaussians**:

```math
\psi(x) \propto \exp\!\left[-\frac{(x - x_0)^2}{4\sigma^2} + ik_0x\right], \qquad \Delta x = \sigma, \quad \Delta p = \frac{\hbar}{2\sigma}
```

The oscillator ground state is one of them. A Gaussian with a complex width, a "chirp" `$e^{icx^2}$`, is not: it has `$\Delta x\Delta p = \hbar\sqrt{\tfrac14 + 4c^2\sigma^4}$`, because position and momentum are now correlated (it does saturate the Schrödinger form). A free packet that starts at the minimum develops exactly such a chirp as it spreads, so its product grows with time even though `$\Delta p$` stays fixed.

<div class="problem" data-problem="packet-momentum"></div>

## 5. Energy and time

There is no time operator: a Hermitian `$\hat T$` with `$[\hat T, \hat H] = i\hbar$` would let you shift any energy by any amount, contradicting a ground state. The energy-time relation is something else. Put `$\hat B = \hat H$` and any `$\hat Q$` in Robertson's relation and use Ehrenfest:

```math
\Delta E\,\Delta Q \ge \frac{\hbar}{2}\left|\frac{d\langle Q\rangle}{dt}\right| \quad\Rightarrow\quad \Delta E\,\Delta t \ge \frac{\hbar}{2}, \qquad \Delta t = \frac{\Delta Q}{|d\langle Q\rangle/dt|}
```

`$\Delta t$` is the time it takes `$\langle Q\rangle$` to move by one standard deviation: how quickly the state visibly changes. A stationary state has `$\Delta E = 0$`, and indeed nothing in it ever changes; a decaying level of lifetime `$\tau$` has a width `$\Gamma \approx \hbar/\tau$`.

**Worked example.** `$(|1\rangle + |2\rangle)/\sqrt2$` with `$E_2 - E_1 = 0.50$` eV. The overlap with the initial state is `$|\cos((E_2 - E_1)t/2\hbar)|$`, which first vanishes at `$t = \pi\hbar/(E_2 - E_1) = h/(2\times0.50\text{ eV}) = 4.14$` fs. With `$\Delta E = (E_2 - E_1)/2$` this is `$t = \pi\hbar/2\Delta E$`, the quantum speed limit.

## 6. Estimates from uncertainty

For a quick ground-state energy, take a minimum-uncertainty Gaussian of width `$\sigma$`, so `$\langle p^2\rangle = \hbar^2/4\sigma^2$`, and minimise `$\langle H\rangle$` over `$\sigma$`. Any trial state gives an upper bound to the true ground energy (this is the variational method, [lesson 4.9](/learn/courses/gate-physics/variational-wkb/)).

Press Play and watch electrons arrive one at a time, then change the slit gap and wavelength and switch on 'Watch which slit'.

<figure class="fig" data-fig="@qm-double-slit"><figcaption>Each electron makes one dot, yet the pile of dots draws fringes of spacing λL/d. Looking at which slit it used washes the fringes out.</figcaption></figure>

- Oscillator: `$\langle H\rangle = \dfrac{\hbar^2}{8m\sigma^2} + \tfrac12m\omega^2\sigma^2 \ge \tfrac12\hbar\omega$`, exact because the ground state is this Gaussian.
- Quartic `$\lambda x^4$` (with `$\langle x^4\rangle = 3\sigma^4$`): minimum `$0.681(\hbar^4\lambda/m^2)^{1/3}$`, against the exact `$0.668$`.

The [Uncertainty calculator](/science/uncertainty-calculator/) handles the different job of propagating measurement errors; for quantum spreads you now have the formulas.

<div class="myth">

**"The uncertainty principle is about clumsy measurements disturbing the particle."** The relation is a property of the state itself: no state, however prepared, has `$\sigma_x\sigma_p < \hbar/2$`. Disturbance by measurement is a related but separate story.

**"If ⟨[A, B]⟩ = 0 the two spreads must be small."** A zero bound allows a zero product but does not force it. In `$(\cos\theta, \sin\theta)^T$` the bound for `$\sigma_z$` and `$\sigma_x$` is zero while the product is up to `$\tfrac12$`.

</div>

<div class="keypoints">

- `$[A, BC] = [A, B]C + B[A, C]$`; `$[x, f(p)] = i\hbar f'(p)$`, `$[f(x), p] = i\hbar f'(x)$`; `$e^{A}Be^{-A} = B + [A, B] + \dots$`
- Commuting observables share an eigenbasis and can be sharp together; finite matrices cannot satisfy `$[x, p] = i\hbar$`.
- `$\sigma_A\sigma_B \ge \tfrac12|\langle[A, B]\rangle|$`; for `$x$`, `$p$`: `$\ge \hbar/2$` always; for other pairs the bound depends on the state.
- Equality only for Gaussians with real width (any centre, any `$k_0$`); chirped Gaussians and exponentials sit above.
- `$\Delta E\,\Delta t \ge \hbar/2$` with `$\Delta t$` a time of change, not an operator spread; orthogonalisation time `$\pi\hbar/(E_2 - E_1)$`.
- Uncertainty estimate: minimise `$\hbar^2/8m\sigma^2 + \langle V\rangle_\sigma$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [commutators practice page](/learn/courses/gate-physics/practice/commutators-uncertainty/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="commutators-uncertainty" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.3](/learn/courses/gate-physics/one-dimensional-potentials/) solves delta wells, finite wells and barriers exactly. Back to the [GATE Physics course](/learn/courses/gate-physics/).
