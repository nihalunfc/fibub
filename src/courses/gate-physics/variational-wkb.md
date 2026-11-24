---
title: 'The variational method and WKB'
summary: 'Two approximation methods for problems with no small parameter: the variational principle and its upper bound, Gaussian and exponential trial functions, helium with a screened charge, linear trial combinations, then the WKB wavefunction, Bohr-Sommerfeld quantisation with the right half and quarter phases, and tunnelling through smooth barriers.'
minutes: 50
updated: 2026-11-24
quiz:
  - q: 'A trial function gives ⟨H⟩ = −12.9 eV for a system whose true ground state is unknown. What can you say for sure?'
    choices: ['E₀ ≤ −12.9 eV', 'E₀ ≥ −12.9 eV', 'E₀ = −12.9 eV to within 1%', 'Nothing, without the exact wavefunction']
    ans: 0
    why: 'Any normalised trial state has ⟨H⟩ ≥ E₀, so the true ground state lies at or below every variational estimate.'
  - q: 'What is the WKB quantisation rule for a smooth potential well with two ordinary turning points?'
    choices: ['∫p dx = (n + ½)πħ between the turning points', '∫p dx = nπħ between the turning points', '∫p dx = (n + ¾)πħ between the turning points', '∫p dx = (n + 1)πħ between the turning points']
    ans: 0
    why: 'Each smooth turning point adds a phase of π/4, so two of them give the extra ½. Two hard walls give (n + 1)πħ, one wall and one smooth point (n + ¾)πħ.'
  - q: 'In the WKB tunnelling formula T ≈ exp(−2∫κ dx), what is κ?'
    choices: ['√(2m(V(x) − E))/ħ, integrated over the forbidden region', '√(2mE)/ħ, integrated over the barrier width', '√(2mV(x))/ħ, integrated over all x', '2m(V − E)/ħ², integrated over the forbidden region']
    ans: 0
    why: 'Inside the barrier the WKB wave decays as exp(−∫κ dx) with the local decay constant κ(x) = √(2m(V − E))/ħ; T is the square of the amplitude ratio.'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), chapters 8 and 9: the variational principle and the WKB approximation'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (2021), sections 2.5 and 5.4: WKB and variational methods'
  - 'L. D. Landau and E. M. Lifshitz, Quantum Mechanics (Non-relativistic Theory), 3rd ed. (1977), sections 46 to 50: the quasi-classical case'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 50 minutes.** By the end you will be able to bound a ground-state energy from above with a trial function and get the best value of its parameter, treat helium with a screened charge, set up a linear trial combination, write a WKB wavefunction, quantise a well with Bohr-Sommerfeld and the correct phase, and estimate tunnelling through a smooth barrier. You need expectation values from [lesson 4.1](/learn/courses/gate-physics/postulates-operators/), the oscillator of [lesson 4.4](/learn/courses/gate-physics/harmonic-oscillator/) and hydrogen from [lesson 4.6](/learn/courses/gate-physics/hydrogen-atom/). Perturbation theory ([lesson 4.8](/learn/courses/gate-physics/perturbation-theory/)) needs a small term; these two methods do not.

<div class="bigidea">Any guess for the ground state gives an energy that is too high, so the best guess in a family is the one with the lowest energy: that is the variational method. When the potential changes slowly compared with the wavelength, the particle behaves almost classically and its phase is just ∫p dx/ħ: that is WKB.</div>

## 1. The variational principle

<div class="steps">
<div class="step">

**Expand the trial state.** Write a normalised trial state as `$|\psi\rangle = \sum_n c_n|n\rangle$` in the (unknown) eigenstates of `$H$`, with `$\sum_n|c_n|^2 = 1$`.

</div>
<div class="step">

**Average the energy.** `$\langle\psi|H|\psi\rangle = \sum_n|c_n|^2E_n \ge E_0\sum_n|c_n|^2 = E_0$`, because every `$E_n \ge E_0$`.

</div>
<div class="step">

**Use it.** Pick a family `$\psi(x;\alpha)$`, compute `$E(\alpha) = \langle H\rangle$`, and set `$dE/d\alpha = 0$`. The minimum is the best upper bound in the family. If `$\psi$` is not normalised, use `$\langle\psi|H|\psi\rangle/\langle\psi|\psi\rangle$`.

</div>
<div class="step">

**Excited states.** If the trial function is orthogonal to the ground state (for example odd, when the ground state is even), the same argument gives `$\langle H\rangle \ge E_1$`.

</div>
</div>

```math
E_0 \le \frac{\langle\psi|H|\psi\rangle}{\langle\psi|\psi\rangle} \quad \text{for every trial } \psi; \qquad \text{an error } \epsilon \text{ in } \psi \text{ gives an error of order } \epsilon^2 \text{ in } E
```

The last point is why the method is so good: the energy is stationary at the true eigenstate, so a rough wavefunction still gives a sharp energy. The wavefunction itself, and averages such as `$\langle x^2\rangle$`, are far less reliable.

<div class="meaning">
<dl>
<dt>`$\psi(x;\alpha)$`</dt><dd>the trial function, a guess with an adjustable parameter; it must satisfy the boundary conditions (vanish at hard walls, be normalisable)</dd>
<dt>`$E(\alpha) = \langle H\rangle$`</dt><dd>the trial energy; always at or above the true ground-state energy</dd>
<dt>`$dE/d\alpha = 0$`</dt><dd>the condition for the best member of the family</dd>
</dl>
</div>

## 2. Trial functions that come up again and again

**Oscillator with a Gaussian.** `$\psi = e^{-bx^2}$` gives `$\langle T\rangle = \hbar^2b/2m$` and `$\langle V\rangle = m\omega^2/8b$`. Minimising, `$b = m\omega/2\hbar$` and `$E = \tfrac12\hbar\omega$`: exact, because the true ground state is in the family.

**Oscillator with an exponential.** `$\psi = e^{-\alpha|x|}$` has `$\langle T\rangle = \hbar^2\alpha^2/2m$` and `$\langle x^2\rangle = 1/2\alpha^2$`, so `$E(\alpha) = \dfrac{\hbar^2\alpha^2}{2m} + \dfrac{m\omega^2}{4\alpha^2}$`. A sum `$A\alpha^2 + B/\alpha^2$` has minimum `$2\sqrt{AB}$`, giving `$E = \hbar\omega/\sqrt2 = 0.707\hbar\omega$`, 41% too high. The kink at the origin costs kinetic energy.

**Worked example (infinite well).** For a well `$0 < x < a$`, try `$\psi = x(a - x)$`, which vanishes at both walls. Then `$\langle\psi|\psi\rangle = a^5/30$` and `$\langle\psi|T|\psi\rangle = \dfrac{\hbar^2}{2m}\int_0^a(a - 2x)^2dx = \dfrac{\hbar^2a^3}{6m}$`, so `$E = \dfrac{5\hbar^2}{ma^2}$`. The exact value is `$\pi^2\hbar^2/2ma^2 = 4.935\,\hbar^2/ma^2$`: only 1.3% high, from a parabola with no free parameter at all.

**Hydrogen with a Gaussian.** `$\psi = e^{-br^2}$` gives `$E(b) = \dfrac{3\hbar^2b}{2m} - \dfrac{e^2}{4\pi\epsilon_0}\sqrt{\dfrac{8b}{\pi}}$`, with minimum `$-\dfrac{8}{3\pi}\times13.6$` eV `$= -11.5$` eV against the exact `$-13.6$` eV. The Gaussian has the wrong shape at the nucleus (no cusp) and decays too fast far away.

<figure class="fig" data-fig="variational-energy"><figcaption>The trial energy as a function of the parameter for four cases. The dashed line is the exact ground-state energy; every curve stays above it, and its minimum is the variational estimate. Drag the slider to see how far off a poor parameter puts you.</figcaption></figure>

## 3. Helium, the classic test

Helium has two electrons and `$Z = 2$`. Ignoring the electron-electron repulsion gives `$-2Z^2 \times 13.6$` eV `$= -108.8$` eV; adding it as a first-order term with the unscreened `$1s^2$` state gives `$+\tfrac54Z \times 13.6 = 34.0$` eV, so `$-74.8$` eV. Measured: `$-79.0$` eV.

<div class="steps">
<div class="step">

**Trial state.** Both electrons in hydrogen-like `$1s$` orbitals with an effective charge `$\zeta$`: `$\psi = \dfrac{\zeta^3}{\pi a_0^3}e^{-\zeta(r_1 + r_2)/a_0}$`. Each electron partly shields the other, so expect `$\zeta < 2$`.

</div>
<div class="step">

**Average energy.** In units of the Rydberg (13.6 eV): kinetic `$2\zeta^2$`, nuclear attraction `$-4Z\zeta$`, repulsion `$\tfrac54\zeta$`. So `$E(\zeta) = 2\zeta^2 - 4Z\zeta + \tfrac54\zeta$`.

</div>
<div class="step">

**Minimise.** `$4\zeta - 4Z + \tfrac54 = 0$` gives `$\zeta = Z - \tfrac{5}{16} = \tfrac{27}{16} = 1.69$`.

</div>
<div class="step">

**Result.** `$E = -2\zeta^2 = -2(27/16)^2 \times 13.6$` eV `$= -77.5$` eV, within 2% of the measured value and, as promised, above it.

</div>
</div>

**Linear trial functions (Rayleigh-Ritz).** Take `$\psi = \sum_i c_i\phi_i$` with fixed `$\phi_i$` and the `$c_i$` as parameters. Minimising gives the secular equation `$\det(H_{ij} - ES_{ij}) = 0$`, with `$S_{ij} = \langle\phi_i|\phi_j\rangle$`. Its lowest root bounds `$E_0$`, and each higher root bounds the next level. With an orthonormal basis this is just diagonalising `$H$` in a truncated basis, which is how most numerical solvers work. To check a trial answer against a numerical one, try the [Schrödinger equation solver](/science/schrodinger-solver/).

<div class="myth">

**"A lower trial energy means the method has failed."** It cannot happen. If your `$\langle H\rangle$` comes out below the exact `$E_0$`, there is an algebra error, or the trial function breaks a boundary condition (for example it does not vanish at a hard wall), or it was not normalised.

**"The best trial energy means the best wavefunction for everything."** The energy is accurate to second order in the error of `$\psi$`; other averages only to first order. The Gaussian trial for hydrogen gets the energy within 15%, yet its `$|\psi(0)|^2$` (which sets the hyperfine splitting) is four times too small.

</div>

## 4. The WKB approximation

*Not in the GATE 2027 syllabus (WKB; sections 4 and 5): kept as background; skip it if you are short of time.*

In a region where `$E > V$`, write `$p(x) = \sqrt{2m(E - V(x))}$`. If `$V$` were constant, `$\psi = e^{\pm ipx/\hbar}$`. When `$V$` changes slowly, keep the local momentum:

```math
\psi(x) \approx \frac{C}{\sqrt{p(x)}}\exp\!\left(\pm\frac{i}{\hbar}\int^x p(x')\,dx'\right), \qquad \psi(x) \approx \frac{C'}{\sqrt{\hbar\kappa(x)}}\exp\!\left(\pm\int^x\kappa(x')\,dx'\right) \text{ where } E < V
```

with `$\kappa = \sqrt{2m(V - E)}/\hbar$`. The amplitude `$1/\sqrt p$` is classical: `$|\psi|^2 \propto 1/v$`, the particle is found more often where it moves slowly. The approximation needs the de Broglie wavelength to change little over one wavelength, `$|d\lambda/dx| \ll 1$`, which fails at turning points where `$p = 0$`. There, the connection formulas (from the exact Airy-function solution of a linear potential) join the two sides and fix a phase of `$\pi/4$` at each smooth turning point.

Slide n from 0 up to 30 and switch between the density and ψ itself.

<figure class="fig" data-fig="@qm-ho-classical"><figcaption>The quantum density has n nodes and leaks past the classical turning points; at large n it averages out to the classical curve, which piles up at the ends where the ball moves slowest.</figcaption></figure>

**Quantisation.** Matching the waves from the two turning points `$x_1, x_2$` of a well:

```math
\int_{x_1}^{x_2}p(x)\,dx = \left(n + \tfrac12\right)\pi\hbar \;\text{(two smooth points)}, \quad \left(n + \tfrac34\right)\pi\hbar \;\text{(one hard wall)}, \quad (n + 1)\pi\hbar \;\text{(two hard walls)}
```

with `$n = 0, 1, 2, \dots$`. Equivalently `$\oint p\,dx = (n + \tfrac12)h$` for a smooth well: the Bohr-Sommerfeld rule with the half-quantum that the old quantum theory missed.

**Worked example (oscillator).** `$\int p\,dx$` between turning points is half the area of the phase-space ellipse, `$\pi E/\omega$`. Setting it to `$(n + \tfrac12)\pi\hbar$` gives `$E_n = (n + \tfrac12)\hbar\omega$`, exact. The infinite square well with the `$(n + 1)$` rule is exact too.

**Worked example (V = F|x|).** Turning points at `$\pm E/F$`. `$\int_{-E/F}^{E/F}\sqrt{2m(E - F|x|)}\,dx = \dfrac43\sqrt{2m}\,\dfrac{E^{3/2}}{F}$`. Setting this to `$(n + \tfrac12)\pi\hbar$`:

```math
E_n = \left[\frac{3\pi\hbar F(n + \tfrac12)}{4\sqrt{2m}}\right]^{2/3}, \qquad E_n \propto \left(n + \tfrac12\right)^{2/3}
```

**Worked example (the quantum bouncer).** A particle on a hard floor in gravity, `$V = mgx$` for `$x > 0$`. One wall and one smooth point: `$\dfrac23\sqrt{2m}\dfrac{E^{3/2}}{mg} = (n + \tfrac34)\pi\hbar$`, so `$E_n = \left[\tfrac{9\pi^2}{8}m g^2\hbar^2(n + \tfrac34)^2\right]^{1/3}$`. For `$n = 0$` this is `$1.842\,(mg^2\hbar^2)^{1/3}$`, against the exact `$1.856$` from the first Airy zero: 0.8% off, even for the ground state. Ultracold neutrons above a mirror show exactly these levels, about 1.4 peV for the lowest.

**Counting states.** Inverting the rule, the number of bound states of a well with energies below `$E$` is about `$\dfrac{1}{\pi\hbar}\int p\,dx + \tfrac12$`, a quick way to estimate how many levels a finite well holds.

## 5. Tunnelling through a smooth barrier

Inside a barrier the WKB wave decays as `$e^{-\int\kappa\,dx}$`. For a thick barrier, the transmission is

```math
T \approx \exp\!\left(-2\int_{x_1}^{x_2}\kappa(x)\,dx\right), \qquad \kappa(x) = \frac{\sqrt{2m(V(x) - E)}}{\hbar}
```

taken between the two turning points. For a rectangular barrier this is `$e^{-2\kappa L}$`, the leading factor of the exact result.

Watch the packet hit the barrier, then lower the energy, thicken the barrier, and raise E above the top.

<figure class="fig" data-fig="@qm-packet-barrier"><figcaption>When E < V₀ part of the wave still gets through (tunnelling), and part reflects even when E > V₀. A thicker barrier cuts the transmission sharply.</figcaption></figure>

**Worked example (rectangular).** An electron 1 eV below the top of a barrier 1 nm wide: `$\kappa = \sqrt{2m_e(1\text{ eV})}/\hbar = 5.12$` nm⁻¹, `$2\kappa L = 10.25$`, `$T \approx 3.6\times10^{-5}$`. Double the width and `$T$` falls to about `$10^{-9}$`: tunnelling is exponentially sensitive to width and to `$\sqrt{V - E}$`.

**Worked example (field emission).** A metal surface with work function `$W$` in a field `$\mathcal E$`: outside, `$V - E = W - e\mathcal Ex$`, a triangle of height `$W$` and width `$L = W/e\mathcal E$`. Since `$\int_0^L\sqrt{1 - x/L}\,dx = 2L/3$`, the exponent is `$\dfrac43\kappa_0L = \dfrac{4\sqrt{2m}W^{3/2}}{3\hbar e\mathcal E}$`, with `$\kappa_0 = \sqrt{2mW}/\hbar$`. This is the Fowler-Nordheim law: current grows as `$e^{-\text{const}/\mathcal E}$`. Alpha decay is the same idea with a Coulomb barrier, and the Gamow factor explains why half-lives range over more than 20 orders of magnitude for alpha energies between 4 and 9 MeV.

<div class="problem" data-problem="wkb-barrier"></div>

<div class="myth">

**"WKB only works for highly excited states."** It is derived for large `$n$`, but it is exact for the oscillator and the square well, and within 1% for the bouncer's ground state. It does fail where the potential changes sharply on the scale of a wavelength, for example a step.

**"Use the (n + ½) rule for every well."** The phase depends on the kind of turning point. Hard walls do not give the `$\pi/4$` shift, so a half-oscillator (wall at `$x = 0$`) has the rule `$(n + \tfrac34)$` and keeps only the odd oscillator levels, `$E = (2n + \tfrac32)\hbar\omega$`, which is again exact.

</div>

<div class="keypoints">

- Variational: `$\langle H\rangle \ge E_0$` for any trial state; minimise over parameters; energy error is second order in the wavefunction error.
- Oscillator: Gaussian gives `$\tfrac12\hbar\omega$` (exact); `$e^{-\alpha|x|}$` gives `$\hbar\omega/\sqrt2$`. Well with `$x(a - x)$`: `$5\hbar^2/ma^2$` (1.3% high). Hydrogen with a Gaussian: `$-11.5$` eV.
- Helium: `$\zeta = Z - 5/16 = 27/16$`, `$E = -2\zeta^2\times13.6$` eV `$= -77.5$` eV (measured `$-79.0$`).
- WKB wave `$\propto p^{-1/2}e^{\pm i\int p\,dx/\hbar}$`; valid when the wavelength changes slowly; breaks at turning points.
- `$\int p\,dx = (n + \tfrac12)\pi\hbar$` (smooth-smooth), `$(n + \tfrac34)\pi\hbar$` (wall-smooth), `$(n + 1)\pi\hbar$` (wall-wall). For `$V \propto |x|$`, `$E_n \propto (n + \tfrac12)^{2/3}$`.
- Tunnelling: `$T \approx e^{-2\int\kappa\,dx}$`; a triangular barrier gives `$\tfrac43\kappa_0L$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [variational method and WKB practice page](/learn/courses/gate-physics/practice/variational-wkb/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="variational-wkb" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.10](/learn/courses/gate-physics/time-dependent-perturbation/) lets the perturbation depend on time: transitions, Rabi oscillations and Fermi's golden rule. Back to the [GATE Physics course](/learn/courses/gate-physics/).
