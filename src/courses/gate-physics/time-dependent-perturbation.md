---
title: "Time-dependent perturbation theory and Fermi's golden rule"
seoTitle: 'Time-dependent perturbation and the golden rule | GATE'
summary: "How a perturbation that depends on time moves a system between levels: amplitudes in the interaction picture, the first-order transition probability, constant and harmonic perturbations, Fermi's golden rule, exact Rabi oscillations of a driven two-level system, sudden and adiabatic changes, and electric dipole selection rules and lifetimes."
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'A two-level atom is driven exactly on resonance with Rabi frequency Ω. After what time is it certainly in the upper state?'
    choices: ['π/Ω', '2π/Ω', 'π/2Ω', 'It never is: the probability is at most ½']
    ans: 0
    why: 'On resonance P = sin²(Ωt/2), which reaches 1 when Ωt = π: a π pulse. At 2π/Ω it is back in the lower state.'
  - q: "Fermi's golden rule gives a transition rate proportional to what?"
    choices: ['|V_fi|² times the density of final states at the energy E_i (+ ħω for absorption)', '|V_fi| times the time elapsed', '|V_fi|² divided by the energy gap squared', 'The density of initial states']
    ans: 0
    why: 'Γ = (2π/ħ)|V_fi|²ρ(E_f), with energy conserved by the delta function. The rate is constant, so the probability grows linearly in time.'
  - q: 'Which electric dipole transition is allowed in hydrogen?'
    choices: ['3d → 2p', '2s → 1s', '3d → 1s', '3p → 2p']
    ans: 0
    why: 'Electric dipole transitions need Δl = ±1 (parity changes). 3d → 2p has Δl = −1. 2s → 1s and 3p → 2p have Δl = 0; 3d → 1s has Δl = −2.'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), chapters 10 and 11: the adiabatic approximation and quantum dynamics'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (2021), sections 5.5 to 5.8: time-dependent potentials and the interaction picture'
  - 'L. D. Landau and E. M. Lifshitz, Quantum Mechanics (Non-relativistic Theory), 3rd ed. (1977), sections 40 to 43'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 55 minutes.** By the end you will be able to write the first-order transition amplitude for any time-dependent perturbation, work out probabilities for pulses and steps, use Fermi's golden rule for decay into a continuum, solve the driven two-level system exactly, decide between sudden and adiabatic changes, and apply dipole selection rules. You need stationary states and matrix elements from [lesson 4.4](/learn/courses/gate-physics/harmonic-oscillator/) and [lesson 4.6](/learn/courses/gate-physics/hydrogen-atom/), and the two-level algebra of [lesson 4.8](/learn/courses/gate-physics/perturbation-theory/).

<div class="bigidea">A perturbation that changes in time does not just shift levels: it moves the system between them. To first order, the amplitude to land in a new state is the Fourier component of the perturbation at the transition frequency. Into a continuum of states this becomes a steady rate, Fermi's golden rule.</div>

## 1. Amplitudes and the first-order formula

Let `$H = H_0 + V(t)$` and expand `$|\psi(t)\rangle = \sum_n c_n(t)e^{-iE_nt/\hbar}|n\rangle$`. Taking out the fast phases leaves the slow amplitudes `$c_n$`, which change only because of `$V$`.

<div class="steps">
<div class="step">

**Exact equations.** Put the expansion into `$i\hbar\partial_t\psi = H\psi$` and project on `$\langle f|$`: `$i\hbar\dot c_f = \sum_n V_{fn}(t)e^{i\omega_{fn}t}c_n$`, with `$\omega_{fn} = (E_f - E_n)/\hbar$`.

</div>
<div class="step">

**Start in one state.** At `$t = 0$`, `$c_i = 1$` and all other `$c_n = 0$`. If `$V$` is weak, the right side is dominated by `$n = i$` for short times.

</div>
<div class="step">

**Integrate.** For `$f \ne i$`:

```math
c_f(t) \approx \frac{1}{i\hbar}\int_0^t V_{fi}(t')\,e^{i\omega_{fi}t'}\,dt', \qquad P_{i\to f}(t) = |c_f(t)|^2
```

</div>
<div class="step">

**Read it.** The amplitude is the Fourier transform of `$V_{fi}(t)$` at the frequency `$\omega_{fi}$`. A slow, smooth perturbation has little Fourier weight at high frequency, so it rarely causes jumps across a big gap. The formula is valid while `$P_{i\to f} \ll 1$`.

</div>
</div>

<div class="meaning">
<dl>
<dt>`$c_f(t)$`</dt><dd>the amplitude to be found in state f, after the free phase is removed</dd>
<dt>`$V_{fi}(t) = \langle f|V(t)|i\rangle$`</dt><dd>the matrix element of the perturbation; if it is zero, there is no first-order transition (a selection rule)</dd>
<dt>`$\omega_{fi}$`</dt><dd>the Bohr frequency of the transition, positive for going up</dd>
</dl>
</div>

**Worked example (a pulse on an oscillator).** A charged oscillator in its ground state is hit by a field pulse `$V = -q\mathcal Ex\,e^{-t^2/\tau^2}$` (from `$t = -\infty$` to `$\infty$`). Since `$x$` only connects `$|0\rangle$` to `$|1\rangle$`, with `$\langle1|x|0\rangle = \sqrt{\hbar/2m\omega}$`, the Gaussian integral `$\int e^{-t^2/\tau^2}e^{i\omega t}dt = \sqrt\pi\,\tau e^{-\omega^2\tau^2/4}$` gives

```math
P_{0\to1} = \frac{\pi q^2\mathcal E^2\tau^2}{2m\hbar\omega}\,e^{-\omega^2\tau^2/2}, \qquad P_{0\to2} = 0 \text{ at first order}
```

A slow pulse (`$\omega\tau \gg 1$`) leaves the oscillator in its ground state: the change is adiabatic. A very short pulse (`$\omega\tau \ll 1$`) acts as a sudden kick; the probability then depends only on the impulse `$\int q\mathcal E\,dt$`.

## 2. Constant and harmonic perturbations

**Switched-on constant perturbation.** `$V$` turned on at `$t = 0$` and then held fixed:

```math
P_{i\to f}(t) = \frac{4|V_{fi}|^2}{\hbar^2}\,\frac{\sin^2(\omega_{fi}t/2)}{\omega_{fi}^2}
```

For a fixed `$\omega_{fi} \ne 0$` this oscillates and stays small. For final states near `$\omega_{fi} = 0$` it grows as `$|V_{fi}|^2t^2/\hbar^2$`, and the peak narrows: its first zeros are at `$\omega_{fi} = \pm2\pi/t$`. Energy is conserved only to within about `$h/t$`, the energy-time trade-off.

**Harmonic perturbation.** For `$V(t) = F e^{-i\omega t} + F^\dagger e^{i\omega t}$`, the same formula holds with `$\omega_{fi}$` replaced by `$\omega_{fi} - \omega$` (absorption, `$E_f = E_i + \hbar\omega$`) or `$\omega_{fi} + \omega$` (stimulated emission, `$E_f = E_i - \hbar\omega$`). Away from these two resonances the probability stays tiny.

## 3. Fermi's golden rule

Real final states often form a continuum: an electron ejected into free space, a photon emitted into any direction, a nucleus decaying. Then we add `$P$` over the final states with a density `$\rho(E)$` per unit energy.

<div class="steps">
<div class="step">

**The key limit.** As `$t$` grows, `$\dfrac{\sin^2(xt/2)}{x^2} \to \dfrac{\pi t}{2}\,\delta(x)$`: the peak's height grows as `$t^2$` while its width shrinks as `$1/t$`, so its area grows as `$t$`.

</div>
<div class="step">

**Sum over states.** `$\sum_f P \to \int \rho(E_f)\dfrac{4|V_{fi}|^2}{\hbar^2}\dfrac{\pi t}{2}\delta(\omega_{fi})\,dE_f$`. With `$\delta(\omega_{fi}) = \hbar\,\delta(E_f - E_i)$` this is `$\dfrac{2\pi}{\hbar}|V_{fi}|^2\rho(E_i)\,t$`.

</div>
<div class="step">

**A rate.** The total probability grows linearly, so the transition has a constant rate:

```math
\Gamma_{i\to f} = \frac{2\pi}{\hbar}\,|V_{fi}|^2\,\rho(E_f), \qquad E_f = E_i \;(\text{constant } V) \text{ or } E_i \pm \hbar\omega \;(\text{harmonic } V)
```

</div>
</div>

A constant rate means the initial state decays exponentially, `$e^{-\Gamma t}$`, with lifetime `$\tau = 1/\Gamma$` and an energy width `$\hbar\Gamma$`. The rule needs `$t$` long compared with `$\hbar$` over the width of the continuum (so the peak is narrower than the spread of final states) while the derivation also assumes the initial state is not yet depleted, `$\Gamma t \ll 1$`.

**Worked example (a rate from numbers).** A level is coupled with `$|V_{fi}| = 1.0\ \mu$`eV to a band of states with `$\rho = 2.0\times10^{3}$` per eV. Then `$\Gamma = 2\pi(1.0\times10^{-6})^2(2.0\times10^3)/\hbar = 1.26\times10^{-8}\text{ eV}/(6.58\times10^{-16}\text{ eV s}) = 1.9\times10^{7}$` s⁻¹, a lifetime of about 52 ns and a width `$\hbar\Gamma = 12.6$` neV.

## 4. The driven two-level system, solved exactly

For two levels with gap `$\hbar\omega_0$`, driven at frequency `$\omega$` with coupling `$\hbar\Omega/2$` (keeping only the near-resonant term, the rotating-wave approximation), the equations for `$c_1, c_2$` become constant-coefficient and can be solved exactly. With the detuning `$\Delta = \omega - \omega_0$` and `$W = \sqrt{\Omega^2 + \Delta^2}$`:

```math
P_{1\to2}(t) = \frac{\Omega^2}{\Omega^2 + \Delta^2}\,\sin^2\!\left(\frac{Wt}{2}\right) \qquad \text{(Rabi's formula)}
```

On resonance the atom swings fully between the levels at the Rabi frequency `$\Omega$`. A **π pulse** (`$\Omega t = \pi$`) inverts it; a **π/2 pulse** makes an equal superposition, the basic step of NMR, MRI and quantum gates. Off resonance the swings are faster and smaller, with maximum `$\Omega^2/W^2$`.

In free precession change B and the tilt; then switch to the RF pulse view, set 90° and press Pulse.

<figure class="fig" data-fig="@qm-spin-bloch"><figcaption>Precession keeps the angle to B and runs at ω = γB. In the rotating frame a pulse simply tips the spin away from z, and the coil signal (largest after 90°) dies away as the spins dephase.</figcaption></figure>

For short times `$P \approx \Omega^2t^2/4$`, exactly the first-order result with `$|V_{fi}| = \hbar\Omega/2$`. First-order theory keeps growing as `$t^2$` and passes 1; the exact answer turns back. Perturbation theory works only while `$P$` is small.

<figure class="fig" data-fig="rabi-oscillation"><figcaption>Left choice: the upper-state probability against time, exact (solid) and first order (dashed), for a chosen detuning. On resonance the first-order curve shoots past 1 while the exact one oscillates. Right choice: the probability against detuning after a fixed pulse, the sin²-shaped line whose central peak narrows as the pulse gets longer.</figcaption></figure>

<div class="problem" data-problem="rabi-detuned"></div>

## 5. Sudden and adiabatic changes

**Sudden.** If `$H$` changes in a time much shorter than `$\hbar/\Delta E$`, the state has no time to change: the old wavefunction is simply re-expanded in the new eigenstates, `$P_n = |\langle n_{\text{new}}|\psi_{\text{old}}\rangle|^2$`.

**Worked example (a well that suddenly doubles).** A particle sits in the ground state of an infinite well of width `$a$`; the right wall jumps to `$2a$`. Then

```math
\langle\phi_1|\psi_1\rangle = \frac{\sqrt2}{a}\int_0^a\sin\frac{\pi x}{a}\sin\frac{\pi x}{2a}\,dx = \frac{4\sqrt2}{3\pi}, \qquad P = \frac{32}{9\pi^2} = 0.360
```

Here the average energy does not change (the wavefunction is the same, and the potential is unchanged where it lives), even though only 36% of the probability lands in the new ground state, which lies four times lower.

**Worked example (beta decay of tritium).** The nucleus turns from `$Z = 1$` to `$Z = 2$` in much less than an atomic period. The `$1s$` overlap of hydrogen-like states with charges `$Z_1, Z_2$` is `$\left(\dfrac{2\sqrt{Z_1Z_2}}{Z_1 + Z_2}\right)^3$`, so the electron ends in the `$\text{He}^+$` ground state with probability `$(2\sqrt2/3)^6 = 512/729 = 0.70$`.

**Adiabatic.** If `$H$` changes slowly compared with `$\hbar/\Delta E$` (the gap to the nearest level), a system that starts in the `$n$`th eigenstate stays in the `$n$`th eigenstate of the instantaneous `$H$`, picking up only a phase. Slowly widening the well from `$a$` to `$2a$` leaves the particle in the ground state, with energy reduced by a factor 4. In an avoided crossing ([lesson 4.8](/learn/courses/gate-physics/perturbation-theory/)) a slow sweep follows the curved level and swaps the character of the state; a fast sweep jumps across the gap.

## 6. Light and atoms: dipole selection rules

For light of wavelength much longer than the atom, `$V = e\mathcal E\cdot\mathbf r\cos\omega t$`, so transitions need `$\langle f|\mathbf r|i\rangle \ne 0$`. Because `$\mathbf r$` is odd and is a vector (angular momentum one), electric dipole transitions obey

```math
\Delta l = \pm1, \qquad \Delta m = 0, \pm1, \qquad \text{parity changes}, \qquad \Delta s = 0
```

**Spontaneous emission.** An excited atom decays even with no applied field, at the rate `$A = \dfrac{\omega^3|\mathbf d_{fi}|^2}{3\pi\epsilon_0\hbar c^3}$` with `$\mathbf d = e\langle f|\mathbf r|i\rangle$`. For hydrogen `$2p \to 1s$` this gives `$A = 6.3\times10^8$` s⁻¹, a lifetime of 1.6 ns. The `$2s$` state cannot decay by a single dipole photon (`$\Delta l = 0$`) and lives about 0.12 s, decaying by two photons. The `$\omega^3$` factor is why X-ray transitions are fast and microwave ones extremely slow, and why lasers are harder to build at short wavelengths.

<div class="myth">

**"A transition happens when the frequency matches exactly."** It happens whenever the perturbation has Fourier weight at the Bohr frequency. A short pulse has a broad spectrum and can drive a transition well off its nominal frequency; the line has width about `$2\pi/t$`.

**"Perturbation theory says the probability grows as t², so a long pulse always inverts the atom."** The `$t^2$` growth is first order only. The exact two-level answer oscillates, and into a continuum the growth becomes linear (the golden rule) and then exponential decay of the initial state.

**"Sudden changes keep the energy, adiabatic ones keep the state, so both keep everything."** A sudden change keeps the wavefunction, so the new energy is just `$\langle\psi_{\text{old}}|H_{\text{new}}|\psi_{\text{old}}\rangle$`, spread over many new levels. An adiabatic change keeps the label but not the energy.

</div>

<div class="keypoints">

- `$c_f \approx \dfrac{1}{i\hbar}\int_0^tV_{fi}e^{i\omega_{fi}t'}dt'$`: the Fourier component at the transition frequency.
- Constant `$V$` switched on: `$P = 4|V_{fi}|^2\sin^2(\omega_{fi}t/2)/\hbar^2\omega_{fi}^2$`; harmonic `$V$`: resonance at `$E_f = E_i \pm \hbar\omega$`.
- Golden rule: `$\Gamma = (2\pi/\hbar)|V_{fi}|^2\rho(E_f)$`; exponential decay, width `$\hbar\Gamma$`.
- Rabi: `$P = (\Omega^2/W^2)\sin^2(Wt/2)$`, `$W = \sqrt{\Omega^2 + \Delta^2}$`; a π pulse inverts on resonance.
- Sudden: `$P_n = |\langle n_{\text{new}}|\psi_{\text{old}}\rangle|^2$` (well doubled: `$32/9\pi^2$`). Adiabatic: stays in the `$n$`th instantaneous eigenstate.
- Dipole rules: `$\Delta l = \pm1$`, `$\Delta m = 0, \pm1$`, parity changes; `$A \propto \omega^3|d|^2$`; hydrogen `$2p$` lives 1.6 ns.

</div>

Start at 50% with the pair 1 + 2 and press Play, then set the share to 0% or 100% and try other pairs.

<figure class="fig" data-fig="@qm-sloshing"><figcaption>A single energy state never changes, but two states beat at (Eₙ − Eₘ)/ħ and the probability sloshes. The lower graph follows ⟨x⟩ against time.</figcaption></figure>

To see two-level dynamics on a sphere, try the [Bloch sphere](/science/bloch-sphere/); the same Rabi physics drives the [MRI Bloch simulator](/science/mri-bloch-simulator/).

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [time-dependent perturbation theory practice page](/learn/courses/gate-physics/practice/time-dependent-perturbation/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="time-dependent-perturbation" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.11](/learn/courses/gate-physics/identical-particles/) asks what changes when two particles cannot be told apart: symmetric and antisymmetric states, the Pauli principle and exchange. Back to the [GATE Physics course](/learn/courses/gate-physics/).
