---
title: 'Heat capacity: Einstein and Debye'
summary: 'Why solids lose heat capacity at low temperature: Dulong-Petit and its failure, the Einstein model, the Debye model with its density of states, cutoff and T³ law, the Debye temperature from sound speeds, heat and entropy at low T, zero-point energy, the dimension rule C ∝ T^d, and the electronic γT term with the C/T against T² plot.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'At low temperature the Einstein model predicts a heat capacity that'
    choices: ['falls exponentially, faster than experiment', 'falls as T³, as observed', 'stays at 3R', 'falls linearly']
    ans: 0
    why: 'One frequency means no low-energy modes, so C ∝ (θ_E/T)² exp(−θ_E/T). Real crystals have acoustic phonons down to ω = 0, which give the slower T³ law.'
  - q: 'Low-temperature data on a metal fall on a straight line when plotted as'
    choices: ['C/T against T²', 'C against T', 'C against T³', 'ln C against 1/T']
    ans: 0
    why: 'C = γT + βT³, so C/T = γ + βT²: the intercept is γ (electrons) and the slope β gives θ_D.'
  - q: 'The Debye cutoff frequency is chosen so that'
    choices: ['the total number of modes is 3N', 'ħω_D = k_B T at room temperature', 'ω_D equals the Einstein frequency', 'the shortest wavelength equals the crystal size']
    ans: 0
    why: 'Debye integrates g(ω) ∝ ω² up to ω_D and fixes ω_D by requiring 3N modes, which keeps the high-temperature limit 3Nk_B.'
sources:
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 5 and 6'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapter 23'
  - 'P. Debye, "Zur Theorie der spezifischen Wärmen", Annalen der Physik 39 (1912) 789'
  - 'A. Einstein, "Die Plancksche Theorie der Strahlung und die Theorie der spezifischen Wärme", Annalen der Physik 22 (1907) 180'
---

**Module 7 · about 45 minutes.** With the [phonon modes](/learn/courses/gate-physics/phonons/) in hand, the heat capacity of a solid is just bookkeeping: put thermal energy into each mode with the Planck occupation and differentiate. Two famous approximations to the spectrum, Einstein's single frequency and Debye's continuum, bracket the truth and are what GATE and NET test. The classical background (equipartition) is in the [JAM kinetic theory lesson](/learn/courses/iit-jam-physics/kinetic-theory/).

<div class="bigidea">Each mode of frequency ω holds about k_BT of energy when k_BT ≫ ħω and almost nothing when k_BT ≪ ħω. The heat capacity at temperature T therefore counts the modes with ħω below about k_BT. At high T that is all 3N of them (Dulong-Petit); at low T it is only the long-wavelength acoustic phonons, whose number in 3D grows as T³.</div>

## 1. Dulong-Petit and its failure

Classically each atom is a 3D oscillator with mean energy `$3k_BT$`, so a mole has `$U = 3RT$` and

```math
C = 3R = 24.9\ \text{J mol}^{-1}\,\text{K}^{-1}
```

per mole of atoms (NaCl: `$6R$` per mole of formula units). Most elements obey this near room temperature, but diamond has only about a quarter of it, and every solid's `$C$` falls to zero as `$T\to0$`, as the third law requires. The cure is quantum: an oscillator of frequency `$\omega$` has mean thermal energy

```math
\langle\varepsilon\rangle = \frac{\hbar\omega}{e^{\hbar\omega/k_BT} - 1}
```

which is `$k_BT$` when `$\hbar\omega \ll k_BT$` and exponentially small when `$\hbar\omega \gg k_BT$`. (The zero-point energy `$\tfrac12\hbar\omega$` does not depend on `$T$` and adds nothing to `$C$`.)

## 2. The Einstein model

Einstein (1907) gave all `$3N$` oscillators one frequency `$\omega_E$`, defining `$\theta_E = \hbar\omega_E/k_B$`. Then `$U = 3N\hbar\omega_E/(e^{\theta_E/T} - 1)$` and

```math
C = 3R\,\frac{x^2e^x}{(e^x - 1)^2}, \qquad x = \frac{\theta_E}{T}
```

At `$T = \theta_E$` this is still 92% of `$3R$`; it drops to half at `$T = 0.34\theta_E$`. At high `$T$`, `$C \approx 3R(1 - x^2/12)$`. At low `$T$`, `$C \approx 3R\,x^2e^{-x}$`: exponential. That is too fast. Real crystals have acoustic modes of arbitrarily low frequency that keep absorbing heat. The Einstein model is still the right description for flat optical branches.

**Worked example.** With `$\theta_E = 240$` K (`$\nu_E = k_B\theta_E/h = 5.0$` THz), at 120 K `$x = 2$`: `$C/3R = 4e^2/(e^2 - 1)^2 = 29.56/40.82 = 0.724$`, `$C = 18.1$` J mol⁻¹ K⁻¹.

The Einstein oscillators freeze out at low T; so do the rotations and vibrations of a gas molecule. Compare the steps.

<figure class="fig" data-fig="@wt-dof-freeze"><figcaption>Same physics as the Einstein solid: a mode switches on once kT is comparable to its spacing. Notice C_v/R = 3/2, 5/2, 7/2 for a diatomic gas, against 3R for a solid at high T.</figcaption></figure>


## 3. The Debye model

Debye (1912) replaced the true spectrum by that of an elastic continuum: three acoustic branches with `$\omega = vk$`. Counting `$\vec k$` in a sphere gives `$3\times\frac{V}{(2\pi)^3}\frac43\pi k^3$` modes below `$k$`, so

```math
g(\omega) = \frac{3V\omega^2}{2\pi^2v^3}, \qquad \int_0^{\omega_D}g(\omega)\,d\omega = 3N \ \Rightarrow\ \omega_D = v\,(6\pi^2n)^{1/3}, \qquad g(\omega) = \frac{9N\omega^2}{\omega_D^3}
```

with `$n = N/V$`, `$k_D = (6\pi^2n)^{1/3}$` (a sphere with the volume of the [Brillouin zone](/learn/courses/gate-physics/reciprocal-lattice/)) and `$\theta_D = \hbar\omega_D/k_B$`. If longitudinal and transverse speeds differ, use `$3/v_D^3 = 1/v_L^3 + 2/v_T^3$` (the slow transverse waves dominate). The heat capacity is

```math
\frac C{3R} = 3\left(\frac T{\theta_D}\right)^3\int_0^{\theta_D/T}\frac{x^4e^x}{(e^x - 1)^2}\,dx
```

<div class="meaning">

<dl>
<dt>`$\theta_D$`</dt><dd>Debye temperature: Pb 105 K, Na 158 K, Cu 343 K, Si 645 K, diamond 2230 K; high for stiff, light solids (`$\theta_D\propto v$`)</dd>
<dt>High `$T$`</dt><dd>`$C\to3R$`, with a correction `$-\tfrac1{20}(\theta_D/T)^2$`; already 0.952 × 3R at `$T = \theta_D$` and 0.90 × 3R at `$0.68\theta_D$`</dd>
<dt>Low `$T$`</dt><dd>the upper limit goes to infinity, the integral becomes `$4\pi^4/15$`, and `$C = \tfrac{12\pi^4}5R\left(\tfrac T{\theta_D}\right)^3 = 1944\left(\tfrac T{\theta_D}\right)^3$` J mol⁻¹ K⁻¹</dd>
</dl>

</div>

<div class="steps">
<div class="step"><p><b>Low-T energy.</b> U = ∫ g(ω) ħω/(e^{ħω/k_BT} − 1) dω with g = 9Nω²/ω_D³. Substitute x = ħω/k_BT.</p></div>
<div class="step"><p><b>Pull out the temperature.</b> U = 9N k_B T⁴/θ_D³ ∫₀^{θ_D/T} x³/(eˣ − 1) dx. For T ≪ θ_D the upper limit is effectively infinite and the integral is π⁴/15.</p></div>
<div class="step"><p><b>Differentiate.</b> U = (3π⁴/5) N k_B T⁴/θ_D³, so C = dU/dT = (12π⁴/5) N k_B (T/θ_D)³. Per mole, 12π⁴R/5 = 1944 J mol⁻¹ K⁻¹.</p></div>
<div class="step"><p><b>Where it holds.</b> The T³ law needs the ω² spectrum to be accurate for all excited modes, which is true only for T ≲ θ_D/50. At θ_D/10 it already overestimates by about 3%.</p></div>
</div>

**Worked example (Debye temperature from sound).** A solid with `$n = 6.0\times10^{28}$` m⁻³ and `$v_D = 3500$` m/s: `$k_D = (6\pi^2n)^{1/3} = 1.53\times10^{10}$` m⁻¹, `$\omega_D = 5.34\times10^{13}$` rad/s, `$\theta_D = \hbar\omega_D/k_B = 408$` K. Its heat capacity at 10 K is `$1944\times(10/408)^3 = 0.029$` J mol⁻¹ K⁻¹.

Compare the two models in the figure. On log-log axes the Debye curve becomes the straight `$T^3$` line at low `$T$` while the Einstein curve plunges away below it.

<figure class="fig" data-fig="heat-capacity-models"><figcaption>C/3R against T/θ_D for the Debye model, the Einstein model (θ_E adjustable) and the T³ law. The markers read off both models at the chosen temperature.</figcaption></figure>

<div class="problem" data-problem="einstein-debye-c"></div>

## 4. Consequences at low temperature

- **Ratios.** `$C\propto T^3$`: warming from 10 K to 20 K multiplies `$C$` by 8 (an Einstein solid with `$\theta_E/T$` going from 10 to 5 would multiply it by 38).
- **Heat.** `$Q = \int aT^3dT = \tfrac a4(T_2^4 - T_1^4)$` with `$a = 1944/\theta_D^3$` per mole.
- **Entropy.** `$S = \int_0^T C/T'\,dT' = C/3$`.
- **Zero-point energy.** `$E_0 = \tfrac12\int\hbar\omega\,g\,d\omega = \tfrac98Nk_B\theta_D$` (Debye) or `$\tfrac32Nk_B\theta_E$` (Einstein); it lowers the cohesive energy but not `$C$`.
- **Compounds.** With `$p$` atoms per formula unit, `$C\to3pR$` at high `$T$` and `$\beta = p\times1944/\theta_D^3$` per mole of formula units. A good model uses Debye for the 3 acoustic branches and Einstein oscillators for the `$3p - 3$` optical ones, which freeze out exponentially.
- **Dimension.** In `$d$` dimensions `$g(\omega)\propto\omega^{d-1}$`, so `$C\propto T^d$`: a chain gives `$C/N = \tfrac{2\pi}3k_B(T/\theta_m)$`, a sheet with linear in-plane modes gives `$T^2$`.

## 5. Electrons and magnons

In a metal the conduction electrons add `$C_e = \gamma T$` with `$\gamma = \tfrac{\pi^2}3k_B^2g(E_F)$`. Only electrons within about `$k_BT$` of the Fermi level can be excited, so `$C_e$` is about 1% of the lattice value at room temperature, which is why classical theory's `$\tfrac32R$` per electron was never seen. But `$\gamma T$` falls more slowly than `$\beta T^3$`, so electrons win below

```math
T^* = \sqrt{\gamma/\beta}
```

For copper (`$\gamma = 0.695$` mJ mol⁻¹ K⁻², `$\beta = 0.0484$` mJ mol⁻¹ K⁻⁴), `$T^* = 3.8$` K, and at 2 K electrons give 78% of `$C$`. Plotting `$C/T = \gamma + \beta T^2$` against `$T^2$` gives `$\gamma$` as the intercept and `$\theta_D = (1944/\beta)^{1/3} = 342$` K from the slope. In a ferromagnetic insulator, magnons with `$\omega\propto k^2$` add `$bT^{3/2}$`, separated by plotting `$C/T^{3/2}$` against `$T^{3/2}$`.

<div class="myth">

**"The `$T^3$` law holds for any temperature below `$\theta_D$`."** It holds well only below about `$\theta_D/50$`. At `$\theta_D/2$` the `$T^3$` formula gives `$77.9\times0.125 = 9.7\times3R$`, an impossible value far above the classical limit, while the full Debye function gives `$0.825\times3R$`. Use the `$T^3$` law at genuinely low temperatures, and the full function (or a table) elsewhere.

</div>

The [heat capacity fitter](/science/heat-capacity-fitter/) fits measured data with the Debye and Einstein models plus an electronic term and returns `$\theta_D$`, `$\theta_E$` and `$\gamma$`.

<div class="keypoints">

- Dulong-Petit `$C = 3R$` per mole of atoms (`$3pR$` per mole of formula units); quantum freezing makes `$C\to0$` as `$T\to0$`.
- Einstein: `$C = 3R\,x^2e^x/(e^x - 1)^2$`, `$x = \theta_E/T$`; 0.92 × 3R at `$\theta_E$`; exponential fall at low `$T$` (too fast).
- Debye: `$g = 9N\omega^2/\omega_D^3$`, `$\omega_D = v(6\pi^2n)^{1/3}$`, `$3/v_D^3 = 1/v_L^3 + 2/v_T^3$`; low-`$T$` law `$C = 1944(T/\theta_D)^3$` J mol⁻¹ K⁻¹, valid for `$T\lesssim\theta_D/50$`.
- Low `$T$`: `$S = C/3$`, `$Q = \tfrac a4(T_2^4 - T_1^4)$`; zero-point energy `$\tfrac98R\theta_D$` per mole; `$C\propto T^d$` in `$d$` dimensions.
- Metals: `$C = \gamma T + \beta T^3$`; plot `$C/T$` against `$T^2$`; crossover `$T^* = \sqrt{\gamma/\beta}$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="heat-capacity" data-exam="gate" data-n="10"></div>

**Back to:** [phonons](/learn/courses/gate-physics/phonons/) for the modes behind these curves, or [the reciprocal lattice](/learn/courses/gate-physics/reciprocal-lattice/) for where they live.

**Next:** lesson 7.6, [the free electron model](/learn/courses/gate-physics/free-electron-model/).
