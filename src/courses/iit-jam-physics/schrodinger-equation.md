---
title: 'The Schrödinger equation: wells, steps and tunnelling'
seoTitle: Schrödinger equation, wells and tunnelling for IIT JAM
summary: 'What the Schrödinger equation says, what makes a wavefunction acceptable, and how to solve the problems JAM asks: the infinite and finite square well, the harmonic oscillator, potential steps, barriers and tunnelling, probabilities and expectation values.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An electron in a 1D infinite well has ground-state energy 0.4 eV. What is the energy of its second excited state?'
    choices: ['3.6 eV', '1.2 eV', '1.6 eV', '0.8 eV']
    ans: 0
    why: 'E_n = n²E₁. The second excited state is n = 3, so E₃ = 9 × 0.4 = 3.6 eV. (1.6 eV is n = 2, the first excited state.)'
  - q: 'A particle meets a barrier higher than its energy. If the barrier is made twice as wide, the tunnelling probability (thick barrier) becomes about'
    choices: ['the square of the old value', 'half the old value', 'a quarter of the old value', 'twice the old value']
    ans: 0
    why: 'T ≈ e^(−2κa). Doubling a gives e^(−4κa) = (e^(−2κa))², the square: if T was 10⁻⁴ it becomes 10⁻⁸.'
  - q: 'Which condition does NOT have to hold for a wavefunction in a region where the potential is finite?'
    choices: ['ψ must be real', 'ψ must be continuous', 'dψ/dx must be continuous', 'ψ must not blow up']
    ans: 0
    why: 'Wavefunctions are in general complex. Continuity of ψ and of its slope (where V is finite) and finiteness are required.'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), chapters 1 and 2'
  - 'A. Beiser, Concepts of Modern Physics, 6th ed. (2003), chapter 5: quantum mechanics'
  - 'R. Eisberg and R. Resnick, Quantum Physics of Atoms, Molecules, Solids, Nuclei and Particles, 2nd ed. (1985), chapters 5 and 6'
  - 'IIT JAM Physics syllabus (Modern Physics section), published by the organising IIT each year'
---

**Module 6 · about 45 minutes.** By the end you will be able to write down and separate the Schrödinger equation, check whether a wavefunction is acceptable, normalise it and compute probabilities and averages, and solve the infinite well, finite well, harmonic oscillator, step and barrier problems that make up most JAM quantum questions.

<div class="bigidea">A particle's wave obeys one equation: kinetic energy plus potential energy equals total energy, written for a wave. Where the wave is trapped, only certain wavelengths fit, and the energy comes out in levels; where it meets a wall it is too weak to climb, it leaks through.</div>

## 1. The equation

[Lesson 6.2](/learn/courses/iit-jam-physics/matter-waves/) gave a free particle the wave `$e^{i(kx - \omega t)}$` with `$p = \hbar k$`, `$E = \hbar\omega$`. On this wave, `$-i\hbar\,\partial/\partial x$` gives `$p$` and `$i\hbar\,\partial/\partial t$` gives `$E$`. Write `$E = p^2/2m + V$` with those substitutions and you have the **time-dependent Schrödinger equation**:

```math
i\hbar\frac{\partial\Psi}{\partial t} = -\frac{\hbar^2}{2m}\frac{\partial^2\Psi}{\partial x^2} + V(x)\Psi
```

When `$V$` does not depend on time, try `$\Psi = \psi(x)e^{-iEt/\hbar}$`. The time part cancels and leaves the **time-independent** equation, which is the one you solve in almost every problem:

```math
-\frac{\hbar^2}{2m}\psi'' + V(x)\psi = E\psi
```

Such a solution is a **stationary state**: `$|\Psi|^2 = |\psi|^2$` does not change in time. A sum of stationary states with different energies is not stationary: its density sloshes at the angular frequency `$(E_2 - E_1)/\hbar$`.

<div class="meaning">

<dl>
<dt>ψ(x)</dt><dd>the wavefunction: its square |ψ|² dx is the probability of finding the particle between x and x + dx</dd>
<dt>−(ħ²/2m)ψ″</dt><dd>the kinetic energy term: a tightly curved wave (short wavelength) has a lot of kinetic energy</dd>
<dt>E &gt; V</dt><dd>classically allowed: ψ curves towards the axis and oscillates</dd>
<dt>E &lt; V</dt><dd>classically forbidden: ψ curves away from the axis, and for a sensible solution it decays exponentially</dd>
</dl>

</div>

### What makes ψ acceptable

- **Normalisable:** `$\int|\psi|^2dx = 1$` (for a bound state). So `$\psi$` must die away at infinity and not blow up anywhere.
- **Continuous** everywhere, and `$d\psi/dx$` continuous wherever `$V$` is finite. (At an infinite wall, or a delta function, the slope may jump.)
- It may be complex; only `$|\psi|^2$` is a probability.

Averages (expectation values) come from sandwiching the operator: `$\langle x\rangle = \int x|\psi|^2dx$`, `$\langle p\rangle = \int\psi^*(-i\hbar\,d/dx)\psi\,dx$`. For any real bound wavefunction `$\langle p\rangle = 0$`.

**Worked example.** Normalise `$\psi = Ae^{-|x|/a}$` and find the probability that the particle is within `$a$` of the origin.

1. `$\int A^2e^{-2|x|/a}dx = 2A^2\cdot a/2 = A^2a = 1$`, so `$A = 1/\sqrt a$`.
2. `$P(|x| < a) = (2/a)\int_0^a e^{-2x/a}dx = 1 - e^{-2} = 0.865$`.

## 2. The infinite square well

A particle trapped between `$x = 0$` and `$x = L$` by walls it can never cross. Inside, `$V = 0$` and `$\psi'' = -k^2\psi$`, so `$\psi = A\sin kx + B\cos kx$`. The walls force `$\psi(0) = 0$` (so `$B = 0$`) and `$\psi(L) = 0$` (so `$kL = n\pi$`). A whole number of half-wavelengths must fit:

```math
\psi_n = \sqrt{\frac2L}\sin\frac{n\pi x}{L}, \qquad E_n = \frac{n^2\pi^2\hbar^2}{2mL^2} = \frac{n^2h^2}{8mL^2}, \quad n = 1, 2, 3, \dots
```

For an electron, `$h^2/8m_e = 0.376$` eV nm², so a 1 nm box has `$E_1 = 0.376$` eV.

<figure class="fig" data-fig="box-states"><figcaption>The five lowest states, each drawn on its own energy line. Energy grows as n², the n-th state has n − 1 nodes inside, and the ground state crowds into the middle. Change the box width to see the energies and the emitted wavelength.</figcaption></figure>

- `$E_1 \ne 0$`: the **zero-point energy**. A particle in a box can never be still (the uncertainty principle again).
- Levels spread out as `$n^2$`: `$E_2 = 4E_1$`, `$E_3 = 9E_1$`. The fractional gap `$(2n + 1)/n^2$` shrinks at large `$n$`, which is how the classical continuum returns.
- Different states are orthogonal: `$\int\psi_m\psi_n dx = 0$` for `$m \ne n$`.
- Each state is symmetric or antisymmetric about the centre, so `$\langle x\rangle = L/2$` always.

**Worked example.** A particle is in the ground state. What is the probability of finding it in the middle third?

1. `$P = \dfrac2L\displaystyle\int_{L/3}^{2L/3}\sin^2\frac{\pi x}{L}dx = \left[\frac xL - \frac{1}{2\pi}\sin\frac{2\pi x}{L}\right]_{L/3}^{2L/3}$`.
2. `$= \tfrac13 - \tfrac{1}{2\pi}(\sin240^\circ - \sin120^\circ) = \tfrac13 + \tfrac{\sqrt3}{2\pi} = 0.609$`.
3. Classically it would be `$1/3$`: the quantum ground state prefers the middle.

**Superpositions.** If `$\psi = c_1\psi_1 + c_2\psi_2$`, an energy measurement gives `$E_1$` with probability `$|c_1|^2$` or `$E_2$` with probability `$|c_2|^2$`, never anything in between; the average is `$\langle E\rangle = |c_1|^2E_1 + |c_2|^2E_2$`.

In three dimensions a cubic box has `$E = E_0(n_x^2 + n_y^2 + n_z^2)$`, and different triples with the same sum give **degenerate** states: `$(2,1,1)$`, `$(1,2,1)$`, `$(1,1,2)$` share the first excited level.

<div class="problem" data-problem="box-photon"></div>

## 3. The finite well and the harmonic oscillator

If the walls have finite height `$V_0$`, the wave leaks into them as `$e^{-\kappa|x|}$`, with `$\kappa = \sqrt{2m(V_0 - E)}/\hbar$`. The wave is effectively a little longer, so every level is a little **lower** than in the infinite well of the same width. There are only finitely many bound states: with `$z_0 = (a/2)\sqrt{2mV_0}/\hbar$` for a well of width `$a$`, the number is `$1 + \lfloor 2z_0/\pi\rfloor$`. In one dimension there is always at least one, however shallow the well.

For a potential `$V = \tfrac12m\omega^2x^2$` (any smooth minimum, close enough to the bottom, as in the [SHM lesson](/learn/courses/iit-jam-physics/simple-harmonic-motion/)):

```math
E_n = \left(n + \tfrac12\right)\hbar\omega, \quad n = 0, 1, 2, \dots, \qquad \psi_0 \propto e^{-m\omega x^2/2\hbar}
```

The levels are equally spaced, and the ground state has energy `$\tfrac12\hbar\omega$`. About 16% of the time a ground-state particle is found outside the classical turning points, where classically it could never be. The [1D Schrödinger solver](/science/schrodinger-solver/) computes levels and wavefunctions for these and other potentials, including ones you draw yourself.

## 4. Steps: reflection without a wall

A beam of particles with energy `$E$` travels right and meets a step up to `$V_0$` at `$x = 0$`.

**If `$E > V_0$`**, classically every particle carries on. The wave number drops from `$k_1 = \sqrt{2mE}/\hbar$` to `$k_2 = \sqrt{2m(E - V_0)}/\hbar$`, and matching `$\psi$` and `$\psi'$` at the step needs a reflected wave:

```math
R = \left(\frac{k_1 - k_2}{k_1 + k_2}\right)^2, \qquad T = \frac{4k_1k_2}{(k_1 + k_2)^2}, \qquad R + T = 1
```

**Worked example.** `$E = \tfrac43V_0$`. Then `$k_2/k_1 = \sqrt{1/4} = 1/2$`, `$R = (1/2 \div 3/2)^2 = 1/9$`: one particle in nine bounces back from a step it could easily climb. (The same `$R$` comes from a step *down*: only the mismatch of `$k$` matters.)

**If `$E < V_0$`**, inside the step `$\psi = Ce^{-\kappa x}$`. Everything is eventually reflected (`$R = 1$`), but the particle penetrates a distance about `$1/\kappa$`. For an electron 0.5 eV short of the top, `$1/\kappa = \sqrt{0.0381/0.5} = 0.28$` nm, using `$\hbar^2/2m_e = 0.0381$` eV nm².

## 5. Barriers: tunnelling

Now make the step a **barrier** of height `$V_0$` and width `$a$`. Inside, the wave decays but has not reached zero when it arrives at the far side, so a weaker wave continues beyond. The exact result for `$E < V_0$` is

```math
T = \left[1 + \frac{V_0^2\sinh^2(\kappa a)}{4E(V_0 - E)}\right]^{-1} \;\approx\; 16\frac{E}{V_0}\left(1 - \frac{E}{V_0}\right)e^{-2\kappa a} \quad (\kappa a \gg 1)
```

For rough work, `$T \approx e^{-2\kappa a}$`: **exponential** in the width and in the square root of mass times energy deficit.

<figure class="fig" data-fig="barrier-tunnel"><figcaption>The exact stationary wave for an electron meeting a rectangular barrier. Make the barrier wider or taller and watch the transmitted wave fade exponentially; raise the energy above the top and some of the wave is still reflected.</figcaption></figure>

**Worked example.** An electron of 1.0 eV meets a 5.0 eV barrier 0.50 nm wide.

1. `$\kappa = \sqrt{(5.0 - 1.0)/0.0381} = 10.25$` nm⁻¹; `$\kappa a = 5.1$`, so the thick-barrier estimate is fine.
2. `$T \approx e^{-2\times10.25\times0.50} = e^{-10.25} = 3.5\times10^{-5}$`.
3. Make it 1.0 nm wide: `$T \approx e^{-20.5} = 1.3\times10^{-9}$`, the old value squared.

Because `$\kappa \propto \sqrt m$`, a proton tunnels through the same barrier with an exponent 43 times larger: practically never. Tunnelling explains alpha decay, fusion in the Sun, the tunnel diode, flash memory and the scanning tunnelling microscope. The [Wave packet tunnelling](/science/wave-packet/) tool sends a real packet at a barrier and splits it in two before your eyes.

<div class="problem" data-problem="tunnel-estimate"></div>

<div class="myth">

**"Tunnelling means the particle borrows energy and gives it back."** No energy is borrowed: the particle's energy is `$E$` all the time. Inside the barrier the kinetic energy `$E - V$` is "negative" only in the sense that the wavefunction there decays instead of oscillating. The particle is never *found* inside with negative kinetic energy; it is simply found on the far side with some probability.

**"The ground state of a box has the particle sitting still in the middle."** The ground state has energy `$h^2/8mL^2$` and a spread of momenta `$\pm\hbar\pi/L$`. Zero energy would mean `$\psi = 0$` everywhere: no particle at all.

</div>

<div class="keypoints">

- `$-\tfrac{\hbar^2}{2m}\psi'' + V\psi = E\psi$`; stationary states `$\psi e^{-iEt/\hbar}$` have time-independent densities; superpositions oscillate at `$(E_2 - E_1)/\hbar$`.
- Acceptable `$\psi$`: normalisable, continuous, with continuous slope where `$V$` is finite. `$\langle p\rangle = 0$` for real bound states.
- Infinite well: `$E_n = n^2h^2/8mL^2$` (electron: `$0.376n^2/L^2$` eV with `$L$` in nm), `$\psi_n = \sqrt{2/L}\sin(n\pi x/L)$`, `$n - 1$` nodes, `$\langle x\rangle = L/2$`.
- Finite well: lower levels, finitely many (at least one in 1D). Oscillator: `$(n + \tfrac12)\hbar\omega$`, equally spaced.
- Step with `$E > V_0$`: `$R = [(k_1 - k_2)/(k_1 + k_2)]^2$`. With `$E < V_0$`: `$R = 1$`, penetration depth `$1/\kappa$`.
- Barrier: `$T \approx e^{-2\kappa a}$`, `$\kappa = \sqrt{2m(V_0 - E)}/\hbar$`. Check `$\kappa a$` is large before using it; doubling the width squares `$T$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [Schrödinger equation practice page](/learn/courses/iit-jam-physics/practice/schrodinger-equation/).

<div class="qbank" data-bank="physics" data-topics="schrodinger-equation" data-exam="jam" data-n="10"></div>

**Next:** [lesson 6.4](/learn/courses/iit-jam-physics/atoms-x-rays/) applies these ideas to the hydrogen atom, its spectral lines and X-rays. Size-dependent levels are also how quantum dots get their colour: the [Quantum dot size calculator](/science/quantum-dot-size/) does the sums. The [GATE Physics course](/learn/courses/gate-physics/) solves the delta well, ladder operators and WKB in depth.
