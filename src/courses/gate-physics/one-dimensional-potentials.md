---
title: 'One-dimensional potentials: wells, barriers and delta potentials'
seoTitle: '1D potentials: wells, barriers and delta wells for GATE'
summary: 'Exact solutions GATE asks for: the delta-function well and barrier, the finite square well with its even and odd states and graphical solution, counting bound states, transmission over barriers and wells (resonances and the Ramsauer effect), parity, and double delta wells.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'How many bound states does the potential V = −α δ(x) (α > 0) have?'
    choices: ['Exactly one', 'None', 'Two, one even and one odd', 'Infinitely many']
    ans: 0
    why: 'Only the even function e^(−κ|x|) can feel the delta, and the slope condition fixes κ = mα/ħ². Odd functions vanish at x = 0 and see no potential at all.'
  - q: 'A finite square well has z₀ = (a/2)√(2mV₀)/ħ = 4. How many bound states does it have?'
    choices: ['3', '2', '4', '1']
    ans: 0
    why: 'The count is 1 + ⌊2z₀/π⌋ = 1 + ⌊2.55⌋ = 3: two even (branches from 0 and π) and one odd (from π/2).'
  - q: 'Particles with E > V₀ cross a rectangular barrier. When is the transmission exactly 1?'
    choices: ['When a whole number of half-wavelengths fits over the barrier', 'Only when E = V₀', 'Never, some reflection always remains', 'Whenever E > 2V₀']
    ans: 0
    why: 'T = 1 when sin(k₂a) = 0, k₂a = nπ: the waves reflected at the two edges cancel.'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), sections 2.5 and 2.6'
  - 'C. Cohen-Tannoudji, B. Diu and F. Laloë, Quantum Mechanics, vol. 1 (1977), complements of chapter 1 (square potentials)'
  - 'E. Merzbacher, Quantum Mechanics, 3rd ed. (1998), chapter 6'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 50 minutes.** By the end you will be able to solve the delta well and barrier completely, find and count the bound states of a finite well (including which are even or odd), compute transmission over barriers and wells at any energy, and handle double wells and walls. Infinite wells, steps and tunnelling estimates are done in [IIT JAM lesson 6.3](/learn/courses/iit-jam-physics/schrodinger-equation/); read that first if `$R + T = 1$` or `$e^{-2\kappa a}$` is new to you.

<div class="bigidea">In one dimension, every problem with piecewise potentials is the same game: write sines or exponentials in each region, then join them with the right matching conditions. Bound states are the energies at which a decaying solution on the left can be joined to a decaying solution on the right.</div>

## 1. Rules of the game

In a region of constant `$V$`, the solutions of `$-\tfrac{\hbar^2}{2m}\psi'' + V\psi = E\psi$` are `$e^{\pm ikx}$` with `$k = \sqrt{2m(E - V)}/\hbar$` when `$E > V$`, and `$e^{\pm\kappa x}$` with `$\kappa = \sqrt{2m(V - E)}/\hbar$` when `$E < V$`. Then:

- `$\psi$` is continuous everywhere.
- `$\psi'$` is continuous where `$V$` is finite; at an infinite wall `$\psi = 0$` and the slope may jump.
- At `$V = \alpha\,\delta(x - x_0)$`, integrate the equation across `$x_0$`: `$\psi'(x_0^+) - \psi'(x_0^-) = \dfrac{2m\alpha}{\hbar^2}\psi(x_0)$`.
- Bound states in 1D are non-degenerate (two solutions with the same `$E$` that both vanish at infinity have zero Wronskian, so they are proportional), and for an even potential each is even or odd, alternating from an even ground state.

For electrons, `$\hbar^2/2m_e = 0.0381$` eV nm² turns every formula below into numbers.

## 2. The delta-function well

Take `$V = -\alpha\,\delta(x)$`, `$\alpha > 0$`, and look for `$E < 0$`. Away from the origin `$V = 0$`, so `$\psi = Ae^{-\kappa|x|}$` (the even choice; an odd function vanishes at the origin and feels nothing, so it cannot be bound). The slope jumps from `$+\kappa A$` to `$-\kappa A$`:

```math
-2\kappa A = -\frac{2m\alpha}{\hbar^2}A \quad\Rightarrow\quad \kappa = \frac{m\alpha}{\hbar^2}, \qquad E = -\frac{\hbar^2\kappa^2}{2m} = -\frac{m\alpha^2}{2\hbar^2}, \qquad \psi = \sqrt\kappa\,e^{-\kappa|x|}
```

There is exactly one bound state, however weak the well. Its energy goes as `$\alpha^2$`, so doubling the strength makes it four times as deep.

<div class="meaning">

<dl>
<dt>κ = mα/ħ²</dt><dd>inverse size of the bound state: a stronger well holds the particle closer</dd>
<dt>E = −mα²/2ħ²</dt><dd>the only bound energy; the whole line is classically forbidden, the particle is held by the kink at the origin</dd>
<dt>⟨V⟩ = 2E, ⟨T⟩ = −E</dt><dd>the virial theorem for a potential that scales like 1/x</dd>
<dt>Physical meaning</dt><dd>A delta well is the limit of any narrow, deep well whose area V₀a is fixed: a shallow well looks like a delta to a state much wider than the well.</dd>
</dl>

</div>

**Worked example.** An electron in `$-\alpha\delta(x)$` with `$\alpha = 0.381$` eV nm.

1. `$\kappa = \alpha/(2\times0.0381) = 5.0$` nm⁻¹, so the state spreads over `$1/\kappa = 0.20$` nm.
2. `$E = -0.0381\times25 = -0.95$` eV.
3. A sudden doubling to `$2\alpha$` leaves the particle bound with probability `$|\langle\psi_\alpha|\psi_{2\alpha}\rangle|^2 = \left(\tfrac{2\sqrt2}{3}\right)^2 = \tfrac89$`.

<div class="problem" data-problem="delta-binding"></div>

## 3. The delta barrier: scattering

Now `$V = +\alpha\,\delta(x)$` with particles of energy `$E = \hbar^2k^2/2m$` from the left: `$\psi = e^{ikx} + re^{-ikx}$` for `$x < 0$` and `$te^{ikx}$` for `$x > 0$`. Continuity gives `$1 + r = t$`; the slope jump gives `$ik(t - 1 + r) = \tfrac{2m\alpha}{\hbar^2}t$`. With `$\beta = m\alpha/\hbar^2k$`:

```math
t = \frac{1}{1 + i\beta}, \qquad r = \frac{-i\beta}{1 + i\beta}, \qquad T = |t|^2 = \frac{1}{1 + \dfrac{m\alpha^2}{2\hbar^2E}}
```

`$T$` rises from 0 at low energy to 1 at high energy and is the same for a well (`$\alpha \to -\alpha$`) as for a barrier, although the phases differ. For the well, `$t$` blows up at `$k = im\alpha/\hbar^2$`, which is exactly the bound-state energy: bound states are poles of the scattering amplitude.

Watch the packet hit the barrier, then lower the energy, thicken the barrier, and raise E above the top.

<figure class="fig" data-fig="@qm-packet-barrier"><figcaption>When E < V₀ part of the wave still gets through (tunnelling), and part reflects even when E > V₀. A thicker barrier cuts the transmission sharply.</figcaption></figure>

**Worked example.** Electrons of `$0.50$` eV on `$0.20$` eV nm `$\times\,\delta(x)$`: `$\dfrac{m\alpha^2}{2\hbar^2E} = \dfrac{\alpha^2}{4(0.0381)E} = \dfrac{0.04}{0.0762} = 0.525$`, so `$T = 1/1.525 = 0.656$`. Reflection and transmission are equal at `$E = \alpha^2/(4\times0.0381) = 0.262$` eV.

## 4. The finite square well

Let `$V = -V_0$` for `$|x| < a/2$` and `$0$` outside, with `$-V_0 < E < 0$`. Inside `$k = \sqrt{2m(E + V_0)}/\hbar$`, outside `$\kappa = \sqrt{-2mE}/\hbar$`. Even states are `$\cos kx$` inside, odd states `$\sin kx$`, each joined to `$e^{-\kappa|x|}$`. Matching `$\psi'/\psi$` at `$x = a/2$` and writing `$z = ka/2$`:

```math
\text{even: } \tan z = \sqrt{\frac{z_0^2}{z^2} - 1}, \qquad \text{odd: } -\cot z = \sqrt{\frac{z_0^2}{z^2} - 1}, \qquad z_0 = \frac a2\frac{\sqrt{2mV_0}}{\hbar}
```

The single number `$z_0$` (the well's "strength", proportional to `$a\sqrt{V_0}$`) decides everything. The right-hand side falls from infinity to zero at `$z = z_0$`; each branch of `$\tan z$` or `$-\cot z$` that starts below `$z_0$` meets it once. Branches start at `$0, \pi/2, \pi, 3\pi/2, \dots$`, alternately even and odd, so

```math
N_{\text{bound}} = 1 + \left\lfloor\frac{2z_0}{\pi}\right\rfloor, \qquad E_n = -V_0\left(1 - \frac{z_n^2}{z_0^2}\right)
```

<figure class="fig" data-fig="finite-well"><figcaption>First view: the graphical solution. Each dot is a bound state where a branch of tan z (even) or −cot z (odd) meets the falling curve. Second view: the same states drawn at their energies, leaking into the walls. Slide z₀ and watch a new state appear each time z₀ passes a multiple of π/2.</figcaption></figure>

- There is always at least one (even) bound state in 1D. The first odd state needs `$z_0 \ge \pi/2$`.
- Levels sit below the infinite-well values `$n^2\pi^2\hbar^2/2ma^2$` (measured from the bottom), and approach them from below as `$V_0 \to \infty$`.
- A well with a hard wall on one side (`$V = \infty$` for `$x < 0$`) keeps only the odd states of the doubled well, so it needs `$z_0 \ge \pi/2$` to bind at all, like an s-wave in 3D.
- A very shallow well (`$z_0 \ll 1$`) acts like a delta of area `$\alpha = V_0a$`: `$E \approx -m(V_0a)^2/2\hbar^2$`.

**Worked example.** An electron in a well 1.0 nm wide. How deep must it be to hold three states, and at what depth is the ground state exactly halfway down?

1. Three states need `$z_0 \ge \pi$`: `$\tfrac a2\sqrt{V_0/0.0381} \ge \pi$`, so `$V_0 \ge 0.0381(2\pi)^2 = 1.50$` eV.
2. Halfway, `$E = -V_0/2$`, means `$k = \kappa$`, so `$\tan z = 1$`, `$z = \pi/4$` and `$z_0 = \sqrt2\,z$`. Then `$V_0 = 0.0381(2z_0/a)^2 = 0.0381\,\pi^2/2 = 0.188$` eV.

Start at 50% with the pair 1 + 2 and press Play, then set the share to 0% or 100% and try other pairs.

<figure class="fig" data-fig="@qm-sloshing"><figcaption>A single energy state never changes, but two states beat at (Eₙ − Eₘ)/ħ and the probability sloshes. The lower graph follows ⟨x⟩ against time.</figcaption></figure>

## 5. Above the top: resonances and the Ramsauer effect

For `$E > V_0$` a rectangular barrier of width `$a$` transmits

```math
T = \left[1 + \frac{V_0^2\sin^2(k_2a)}{4E(E - V_0)}\right]^{-1}, \qquad k_2 = \frac{\sqrt{2m(E - V_0)}}{\hbar}
```

so `$T = 1$` whenever `$k_2a = n\pi$`: a whole number of half-wavelengths fits over the barrier and the two reflected waves cancel. At `$E = V_0$` exactly, `$T = [1 + mV_0a^2/2\hbar^2]^{-1}$` (the thick-barrier estimate is useless there because `$\kappa = 0$`).

A **well** does the same with `$k_2 = \sqrt{2m(E + V_0)}/\hbar$`. Slow electrons crossing noble-gas atoms show such a transmission peak: the Ramsauer-Townsend effect.

**Worked example.** Barrier 1.0 eV high, 0.50 nm wide: the first resonance is at `$E - V_0 = 0.0381(\pi/0.50)^2 = 1.50$` eV, i.e. `$E = 2.50$` eV. A well 1.0 eV deep and 0.50 nm wide: `$E + V_0 = 1.504$` eV, so `$E = 0.504$` eV.

Two delta barriers a distance apart behave like a Fabry-Perot etalon: at certain energies the multiply reflected waves cancel and `$T = 1$`, even though each barrier alone reflects. This is **resonant tunnelling**, used in the resonant tunnelling diode. The [1D Schrödinger solver](/science/schrodinger-solver/) finds bound states of any well you draw, and [Wave packet tunnelling](/science/wave-packet/) sends a real packet at a barrier.

## 6. Two deltas: bonding and antibonding

For `$V = -\alpha[\delta(x - d) + \delta(x + d)]$` the even state is `$\cosh\kappa x$` between the wells and the odd state `$\sinh\kappa x$`. With `$g = 2m\alpha/\hbar^2$`, the slope jumps give

```math
\text{even: } \kappa(1 + \tanh\kappa d) = g, \qquad \text{odd: } \kappa(1 + \coth\kappa d) = g
```

The even (bonding) state always exists and lies below the single-well level; as `$d \to 0$` it becomes a single delta of strength `$2\alpha$`, four times deeper. The odd (antibonding) state exists only if `$gd > 1$`, because `$\kappa(1 + \coth\kappa d)$` never drops below `$1/d$`. This is the 1D cartoon of the hydrogen molecule ion `$\text{H}_2^+$`.

<div class="myth">

**"A particle in the delta-well bound state spends most of its time inside the well."** The well has zero width. The energy is negative while `$V = 0$` at every other point, so the whole line is classically forbidden: the probability of being found in the forbidden region is 1.

**"Above a barrier there is no reflection."** Any sudden change in `$k$` reflects part of the wave, upwards or downwards, unless the special resonance condition `$k_2a = n\pi$` is met.

</div>

<div class="keypoints">

- At `$\alpha\delta(x)$`: `$\psi$` continuous, `$\Delta\psi' = (2m\alpha/\hbar^2)\psi(0)$`.
- Delta well: one bound state, `$\kappa = m\alpha/\hbar^2$`, `$E = -m\alpha^2/2\hbar^2$`, `$\langle V\rangle = 2E$`.
- Delta barrier or well: `$T = [1 + m\alpha^2/2\hbar^2E]^{-1}$`; bound states are poles of `$t$`.
- Finite well: `$z_0 = \tfrac a2\sqrt{2mV_0}/\hbar$`; even `$\tan z$`, odd `$-\cot z$` against `$\sqrt{z_0^2/z^2 - 1}$`; `$N = 1 + \lfloor2z_0/\pi\rfloor$`.
- Above a barrier `$T = 1$` at `$k_2a = n\pi$`; at `$E = V_0$`, `$T = [1 + mV_0a^2/2\hbar^2]^{-1}$`; wells show the Ramsauer effect.
- Double delta: bonding state always, antibonding only if `$2m\alpha d/\hbar^2 > 1$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [1D potentials practice page](/learn/courses/gate-physics/practice/one-dimensional-potentials/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="one-dimensional-potentials" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.4](/learn/courses/gate-physics/harmonic-oscillator/) solves the harmonic oscillator with ladder operators, without a single differential equation. Size-dependent levels also set the colour of quantum dots: try the [Quantum dot size calculator](/science/quantum-dot-size/). Back to the [GATE Physics course](/learn/courses/gate-physics/).
