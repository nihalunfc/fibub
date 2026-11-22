---
title: 'Dia-, para- and ferromagnetism'
seoTitle: 'Dia-, para- and ferromagnetism in solids, GATE'
summary: 'Magnetism of solids at MSc level: Langevin diamagnetism, Hund''s rules, Landé g and effective moments, quenching in 3d ions, Curie and Brillouin paramagnetism, Pauli and Landau susceptibility, Van Vleck paramagnetism, Weiss mean-field theory and the Curie-Weiss law, antiferro- and ferrimagnets, exchange, spin waves and the Bloch law, ferromagnetic resonance and domains.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'The ground term of Gd³⁺ (4f⁷) is'
    choices: ['⁸S₇/₂', '⁷F₆', '⁶H₁₅/₂', '⁸F₁₃/₂']
    ans: 0
    why: 'A half-filled shell has all 7 spins parallel (S = 7/2) and one electron in each m_l, so L = 0 and J = S = 7/2.'
  - q: 'Above its ordering temperature, an antiferromagnet has 1/χ that extrapolates to zero at'
    choices: ['a negative temperature, −θ', 'T_N', 'zero', 'a positive temperature above T_N']
    ans: 0
    why: 'χ = C/(T + θ) with θ > 0, so 1/χ = (T + θ)/C crosses zero at T = −θ. A ferromagnet crosses at +T_C.'
  - q: 'The Pauli spin susceptibility of a metal'
    choices: ['is nearly independent of temperature', 'follows a Curie law', 'is negative', 'diverges at the Fermi temperature']
    ans: 0
    why: 'Only electrons within about μ_B B of E_F can flip, so χ_P = μ₀μ_B² g(E_F), which hardly depends on T as long as T ≪ T_F.'
sources:
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 31 to 33'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 11 and 12'
  - 'S. Blundell, Magnetism in Condensed Matter (2001), chapters 2 to 6'
  - 'GATE Physics (PH) syllabus, solid state physics section, published by the organising institute each year'
---

**Module 7 · about 55 minutes.** By the end you will be able to find the ground term and moment of any 3d or 4f ion, calculate diamagnetic, Curie, Pauli and mean-field susceptibilities, read 1/χ plots to tell ferro- from antiferromagnets, explain why exchange and not dipolar forces orders magnets, and use spin waves, resonance and domains. Fields H, B and M, bound currents, the three classes of material and the hysteresis loop are in the [IIT JAM magnetic materials lesson](/learn/courses/iit-jam-physics/magnetic-materials/); angular momentum coupling is in [lesson 4.5](/learn/courses/gate-physics/angular-momentum/).

<div class="bigidea">Every atom responds to a field by bending its electron orbits a little (diamagnetism). Atoms with unfilled shells also carry permanent moments that a field tries to line up against thermal disorder (paramagnetism). In some solids the moments line up by themselves, not because of their magnetic forces, which are far too weak, but because quantum exchange makes parallel (or antiparallel) spins cheaper in Coulomb energy.</div>

## 1. Diamagnetism

Switching on `$\mathbf B$` adds a Larmor precession to every orbit and, by Lenz's law, a moment `$-e^2B\langle x^2 + y^2\rangle/4m$` per electron. Averaging over directions (`$\langle x^2 + y^2\rangle = \tfrac23\langle r^2\rangle$`):

```math
\chi_{\rm dia} = -\frac{\mu_0nZe^2\langle r^2\rangle}{6m}
```

It is small (`$-10^{-6}$` to `$-10^{-5}$`), negative, independent of temperature, and present in all matter. For `$n = 5\times10^{28}$` m⁻³, `$Z = 10$` and `$\langle r^2\rangle = 0.010$` nm², `$\chi = -3.0\times10^{-5}$`.

## 2. Atomic moments: Hund's rules and the Landé factor

An ion with a partly filled shell has a ground multiplet fixed by **Hund's rules**: (1) maximise `$S$`; (2) then maximise `$L$`; (3) `$J = |L - S|$` if the shell is less than half full, `$J = L + S$` if more. Its moment along `$\mathbf J$` is `$-g\mu_B\mathbf J$` with

```math
g = 1 + \frac{J(J+1) + S(S+1) - L(L+1)}{2J(J+1)}, \qquad \mu_{\rm eff} = g\sqrt{J(J+1)}\,\mu_B
```

<div class="steps">
<div class="step">

**Ce³⁺ (4f¹).** `$S = \tfrac12$`, `$L = 3$` (F), less than half full: `$J = \tfrac52$`. `$g = 1 + (8.75 + 0.75 - 12)/17.5 = 6/7$`. `$\mu_{\rm eff} = \tfrac67\sqrt{8.75} = 2.54\,\mu_B$`. Term `$^2F_{5/2}$`.

</div>
<div class="step">

**Gd³⁺ (4f⁷).** Half full: `$S = \tfrac72$`, `$L = 0$`, `$J = \tfrac72$`, `$g = 2$`. Term `$^8S_{7/2}$`, `$\mu_{\rm eff} = 7.94\,\mu_B$`.

</div>
<div class="step">

**Dy³⁺ (4f⁹).** Seven spins up fill every `$m_l$`; two more go spin down into `$m_l = 3, 2$`: `$S = \tfrac52$`, `$L = 5$` (H). More than half full: `$J = \tfrac{15}{2}$`, `$g = \tfrac43$`, `$\mu_{\rm eff} = 10.65\,\mu_B$`. Term `$^6H_{15/2}$`.

</div>
<div class="step">

**3d ions: quenching.** The outer 3d shell feels the crystal field more strongly than its spin-orbit coupling. Crystal-field states have `$\langle L_z\rangle = 0$`, so only spin survives: `$\mu_{\rm eff} = 2\sqrt{S(S+1)}\,\mu_B$`. Mn²⁺ (3d⁵, `$S = \tfrac52$`) gives 5.92 `$\mu_B$`. The 4f shell is buried, so rare earths keep `$J$`.

</div>
</div>

## 3. Paramagnetism: Curie, Brillouin, Pauli and Van Vleck

`$N$` independent moments per volume in a field: the magnetisation is `$M = Ng\mu_BJ\,B_J(x)$` with `$x = g\mu_BJB/k_BT$`. For `$J = \tfrac12$`, `$B_J = \tanh x$`. In weak fields `$B_J \approx \dfrac{J+1}{3J}x$`, giving the **Curie law**

```math
\chi = \frac{C}{T}, \qquad C = \frac{\mu_0N\mu_{\rm eff}^2}{3k_B}
```

<div class="meaning">

<dl>
<dt>C</dt><dd>Curie constant in kelvin (SI χ is dimensionless); 0.9 K for 10²⁸ ions per m³ with 5.92 μ_B</dd>
<dt>μ_eff = g√(J(J+1)) μ_B</dt><dd>what the Curie law measures; larger than the saturation moment gJμ_B</dd>
<dt>B_J(x)</dt><dd>Brillouin function: linear for small x, saturates to 1 when μB ≫ k_BT</dd>
<dt>Physical meaning</dt><dd>A field orders the moments, temperature disorders them; at low fields the net alignment is the ratio of the two, μB/k_BT.</dd>
</dl>

</div>

**Worked example.** Spin-½ ions at 4.2 K in 1 T: `$\mu_BB/k_BT = 0.160$` and `$M/M_s = \tanh0.160 = 0.159$`. To reach half saturation in 5 T needs `$\tanh^{-1}0.5 = 0.549$`, i.e. `$T = 6.1$` K.

**Conduction electrons** are not free moments: only those within `$\sim\mu_BB$` of `$E_F$` can flip. The result is the temperature-independent **Pauli susceptibility** `$\chi_P = \mu_0\mu_B^2g(E_F) = \tfrac32n\mu_0\mu_B^2/E_F$`, about `$10^{-5}$`, plus a **Landau diamagnetism** `$-\tfrac13(m/m^*)^2\chi_P$` from the orbits. Light carriers (`$m^* = 0.5m$`) make the total negative.

**Van Vleck paramagnetism.** An ion with `$J = 0$` (Eu³⁺, `$^7F_0$`) has no first-order moment, but the field mixes in excited multiplets and gives a temperature-independent positive `$\chi$`; at room temperature those multiplets are also thermally occupied.

## 4. Order: the Weiss molecular field

Weiss assumed each moment feels, besides the applied field, a field proportional to the magnetisation, `$\mu_0\lambda M$`. Then `$M = (C/T)(H + \lambda M)$` and

```math
\chi = \frac{C}{T - T_C}\ \ (T > T_C), \qquad T_C = \lambda C
```

Below `$T_C$` the self-consistent equation `$M/M_s = B_J(\dots M\dots)$` has a non-zero solution: spontaneous magnetisation. For spin ½, `$m = \tanh(mT_C/T)$`, `$k_BT_C = \mu_BB_E$`, and near `$T_C$`, `$m \approx \sqrt3(1 - T/T_C)^{1/2}$`.

The numbers expose the physics. For `$T_C = 1000$` K the molecular field is `$B_E = k_BT_C/\mu_B = 1500$` T, and `$\lambda \sim 10^3$` to `$10^4$`, while a dipolar (Lorentz) field would give `$\lambda = \tfrac13$`. The dipolar energy of two `$\mu_B$` moments 0.25 nm apart is only `$\mu_0\mu_B^2/4\pi a^3 \approx 0.04$` K. The real cause is **exchange**: the Pauli principle ties the spatial symmetry of two electrons to their spin, and the Coulomb energy differs by up to 0.1 eV between the two. It is written `$-2J\,\mathbf S_i\cdot\mathbf S_j$` (Heisenberg); in metals the Stoner criterion `$Ug_\sigma(E_F) > 1$` plays the same role.

<figure class="fig" data-fig="susceptibility"><figcaption>Susceptibility of a paramagnet, a ferromagnet and an antiferromagnet in mean-field theory, drawn as 1/χ (the way data are analysed) or χ, with a common Curie constant. The intercept of 1/χ gives the sign of the interactions: through the origin, at +T_C, or at −θ. Below T_N the antiferromagnet's χ⊥ stays flat while χ∥ falls to zero. The third view is the mean-field magnetisation of a spin-½ ferromagnet.</figcaption></figure>

Cool a grid of spins through the critical temperature to watch the order set in.

<figure class="fig" data-fig="@sx-ising"><figcaption>At low T neighbouring spins line up (ferromagnet) or alternate (antiferromagnet); above T<sub>c</sub> = 2.27 J/k the order melts and M falls to zero. A field h favours up spins and lets you see the susceptibility.</figcaption></figure>

**Antiferromagnets** order with two opposite sublattices below the Néel temperature. Above it `$\chi = C/(T + \theta)$`, so 1/χ extrapolates to a negative temperature; at `$T_N$`, `$\chi$` has a cusp; below, `$\chi_\perp$` is constant and `$\chi_\parallel \to 0$`, so a powder ends at `$\tfrac23\chi(T_N)$`. Simple mean field gives `$\theta = T_N$`; real materials have `$\theta/T_N$` of 1.5 to 5. **Ferrimagnets** (magnetite, ferrites) have unequal sublattices and a net moment.

**Worked example.** `$\chi = 5.0\times10^{-3}$` at 200 K and `$2.5\times10^{-3}$` at 300 K. From `$\chi_1(T_1 - \theta) = \chi_2(T_2 - \theta)$`: `$\theta = +100$` K (ferromagnetic interactions) and `$C = 0.50$` K.

<div class="problem" data-problem="mgx-curie-weiss"></div>

## 5. Beyond mean field: spin waves, resonance and domains

- **Critical behaviour.** Mean field gives `$\beta = \tfrac12$`, `$\gamma = 1$`, `$\delta = 3$`; real 3D magnets have `$\beta \approx 0.33$` to `$0.37$`, and a 1D chain does not order at all.
- **Spin waves.** Low-energy excitations are magnons: `$\hbar\omega \approx 2JSa^2k^2$` in a ferromagnet, linear in `$k$` in an antiferromagnet. Their thermal population gives the **Bloch law** `$M_s(0) - M_s(T) \propto T^{3/2}$` (mean field wrongly predicts an exponential), so a 1% drop at 100 K becomes 8% at 400 K.
- **Ferromagnetic resonance.** The `$k = 0$` magnon precesses at `$hf = g\mu_BB$`: 9.8 GHz at 0.35 T for `$g = 2$`.
- **Domains and hysteresis.** A uniformly magnetised block has a large stray-field energy; domains cancel it at the cost of wall energy. Wall motion and rotation give the hysteresis loop (see the [JAM hysteresis figure](/learn/courses/iit-jam-physics/magnetic-materials/)): its area is the energy lost per cycle; soft magnets for transformers, hard magnets for motors.

<div class="myth">

**"Ferromagnets order because neighbouring magnetic moments attract like bar magnets."** Dipolar energies are below 1 K. Iron stays ordered to 1043 K because of exchange, an electrostatic effect made spin-dependent by the Pauli principle.

**"μ_eff is the moment you get at saturation."** The Curie law measures `$g\sqrt{J(J+1)}\mu_B$`; saturation gives `$gJ\mu_B$`, which is smaller (5.92 against 5 `$\mu_B$` for Mn²⁺).

</div>

<div class="keypoints">

- Diamagnetism: `$\chi = -\mu_0nZe^2\langle r^2\rangle/6m$`, small, negative, `$T$`-independent.
- Hund's rules: max `$S$`, max `$L$`, `$J = |L - S|$` below half filling, `$L + S$` above; `$g$` (Landé), `$\mu_{\rm eff} = g\sqrt{J(J+1)}\mu_B$`; 3d ions spin only.
- Curie `$\chi = C/T$`, `$C = \mu_0N\mu_{\rm eff}^2/3k_B$`; Brillouin `$B_J$`, `$\tanh x$` for spin ½.
- Pauli `$\chi_P = \mu_0\mu_B^2g(E_F)$`, Landau `$-\tfrac13(m/m^*)^2\chi_P$`; Van Vleck for `$J = 0$`.
- Weiss: `$\chi = C/(T - T_C)$`, `$T_C = \lambda C$`, `$k_BT_C = \mu_BB_E$`; antiferro `$C/(T + \theta)$`, cusp at `$T_N$`.
- Exchange, not dipoles; magnons `$k^2$` (ferro), `$k$` (antiferro); Bloch `$T^{3/2}$`; FMR `$hf = g\mu_BB$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="magnetism" data-exam="gate" data-n="10"></div>

**Next:** [lesson 7.10](/learn/courses/gate-physics/superconductivity/) meets the perfect diamagnet, `$\chi = -1$`. The [Magnetic materials](/learn/magnetic-materials/) tool compares real materials. Back to the [GATE Physics course](/learn/courses/gate-physics/).
