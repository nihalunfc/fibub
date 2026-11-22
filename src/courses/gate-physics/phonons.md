---
title: Lattice vibrations and phonons
summary: 'Normal modes of a crystal: the monatomic chain with its dispersion, group and phase velocities and density of states; the diatomic chain with acoustic and optical branches and a gap; branches in 3D; crystal momentum and Umklapp processes; phonon statistics; neutron and Raman measurements; LO-TO splitting and the Lyddane-Sachs-Teller relation.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'For a diatomic chain with masses M₁ > M₂ and equal springs K, the frequencies at the zone boundary are'
    choices: ['√(2K/M₁) and √(2K/M₂)', '0 and √(2K(1/M₁ + 1/M₂))', '√(K/M₁) and √(K/M₂)', 'both equal to √(2K/(M₁ + M₂))']
    ans: 0
    why: 'At ka = π one kind of atom stays still in each mode: the heavy atoms move at √(2K/M₁) (acoustic top) and the light ones at √(2K/M₂) (optical bottom). The k = 0 pair is 0 and √(2K(1/M₁ + 1/M₂)).'
  - q: 'How many optical branches does a crystal with 5 atoms per primitive cell have?'
    choices: ['12', '15', '3', '10']
    ans: 0
    why: 'There are 3p = 15 branches in all, of which 3 are acoustic. That leaves 12 optical branches.'
  - q: 'In an Umklapp process between phonons,'
    choices: ['q₁ + q₂ = q₃ + G with G ≠ 0, which gives thermal resistance', 'crystal momentum is exactly conserved with G = 0', 'a phonon turns into a photon', 'the phonon number is conserved']
    ans: 0
    why: 'When q₁ + q₂ leaves the first zone, a reciprocal vector brings it back and the new phonon can travel backwards. This is what limits heat flow in insulators.'
sources:
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 4 and 5'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 22, 24 and 25'
  - 'M. T. Dove, Introduction to Lattice Dynamics (1993), chapters 3 to 6'
  - 'GATE Physics (PH) syllabus, Solid State Physics section, published by the organising IIT each year'
---

**Module 7 · about 50 minutes.** The [bonding lesson](/learn/courses/gate-physics/bonding/) gave each pair of atoms a spring constant `$k = U''(r_0)$`. Now let every atom move. Because the springs connect neighbours, atoms cannot vibrate alone: the motions organise into waves running through the whole crystal, labelled by a wave vector in the [Brillouin zone](/learn/courses/gate-physics/reciprocal-lattice/).

<div class="bigidea">A harmonic crystal of N atoms is exactly equivalent to 3N independent oscillators, its normal modes. Each mode is a wave with wave vector k and frequency ω(k). Quantised, each mode holds a whole number of phonons of energy ħω. Heat capacity, thermal conductivity, sound and infrared absorption are all statements about these modes.</div>

## 1. The monatomic chain

Atoms of mass `$m$`, spacing `$a$`, nearest-neighbour springs `$K$`. Newton's law for atom `$n$`:

```math
m\ddot u_n = K(u_{n+1} - u_n) - K(u_n - u_{n-1})
```

<div class="steps">
<div class="step"><p><b>Try a wave.</b> Put u_n = A exp[i(kna − ωt)]. Every atom does the same motion, shifted in phase by ka from its neighbour.</p></div>
<div class="step"><p><b>Substitute.</b> −mω² = K(e^{ika} + e^{−ika} − 2) = −2K(1 − cos ka) = −4K sin²(ka/2).</p></div>
<div class="step"><p><b>Dispersion.</b> ω = 2√(K/m) |sin(ka/2)|: linear at small k, flat at the zone edge, highest value ω_m = 2√(K/m).</p></div>
<div class="step"><p><b>Only the first zone matters.</b> k and k + 2π/a give identical displacements at every atom, so all distinct modes have −π/a < k ≤ π/a. With N atoms and periodic boundary conditions the allowed k are spaced by 2π/(Na): exactly N modes.</p></div>
</div>

```math
\omega(k) = 2\sqrt{\frac Km}\left|\sin\frac{ka}2\right|, \qquad v_g = \frac{d\omega}{dk} = a\sqrt{\frac Km}\cos\frac{ka}2, \qquad v_s = a\sqrt{\frac Km}
```

<div class="meaning">

<dl>
<dt>`$v_s$`</dt><dd>sound speed: the slope at small `$k$`, where phase and group velocities agree (no dispersion)</dd>
<dt>`$v_g$` at `$k = \pi/a$`</dt><dd>zero: neighbours move in exact opposition, a standing wave made by Bragg reflection</dd>
<dt>`$v_p = \omega/k$` at `$k = \pi/a$`</dt><dd>`$(2/\pi)v_s$`, not zero; in general `$v_p/v_g = \tan(ka/2)/(ka/2)$`</dd>
<dt>Density of states</dt><dd>modes are evenly spaced in `$k$`, so `$g(\omega) = \dfrac{2N}{\pi}\dfrac1{\sqrt{\omega_m^2 - \omega^2}}$`, which diverges at `$\omega_m$` (a van Hove singularity)</dd>
</dl>

</div>

**Worked example.** Atoms of 40 u, `$K = 15$` N/m, `$a = 3.0$` Å: `$\sqrt{K/m} = 1.50\times10^{13}$` s⁻¹, so `$v_s = 4.5$` km/s and `$\omega_m = 3.0\times10^{13}$` rad/s (`$\nu_m = 4.8$` THz). Modes below `$\omega_m/2$` fill `$|k| < \pi/3a$`: one third of all modes.

**Further neighbours** add terms: `$\omega^2 = \frac4m\sum_pK_p\sin^2(pka/2)$`. A second-neighbour spring counts four times in the sound speed, `$v_s = a\sqrt{(K_1 + 4K_2)/m}$`, because it is stretched twice as much.

<div class="problem" data-problem="chain-mode"></div>

## 2. The diatomic chain

Now alternate masses `$M_1 > M_2$` with equal springs, repeat distance `$a$`. Two equations, two amplitudes, and a 2×2 determinant give

```math
\omega_\pm^2 = K\left(\frac1{M_1} + \frac1{M_2}\right) \pm K\sqrt{\left(\frac1{M_1} + \frac1{M_2}\right)^2 - \frac{4\sin^2(ka/2)}{M_1M_2}}
```

| | `$k = 0$` | `$k = \pi/a$` |
|---|---|---|
| acoustic `$\omega_-$` | 0 (rigid translation) | `$\sqrt{2K/M_1}$`: only heavy atoms move |
| optical `$\omega_+$` | `$\sqrt{2K(1/M_1 + 1/M_2)}$`: the two atoms opposite, centre of mass fixed | `$\sqrt{2K/M_2}$`: only light atoms move |

Between `$\sqrt{2K/M_1}$` and `$\sqrt{2K/M_2}$` no wave propagates: a **gap**. It closes when the masses become equal (the chain then has period `$a/2$` and its single branch, folded, is all there is) and widens as `$M_1\to\infty$`, when the optical branch becomes flat at `$\sqrt{2K/M_2}$` (each light atom rattling between fixed heavy ones, an Einstein oscillator). Equal masses with alternating springs `$K_1, K_2$` also open a gap, between `$\sqrt{2K_2/m}$` and `$\sqrt{2K_1/m}$`: any doubling of the period does.

At small `$k$` the acoustic branch is `$\omega \approx a\sqrt{K/2(M_1 + M_2)}\,k$`, the sound speed of the total mass per repeat. In an ionic crystal the optical mode at `$k = 0$` moves positive and negative ions against each other, an oscillating dipole that absorbs infrared light: hence the name.

Watch it in the figure. Choose the optical branch near `$k = 0$`: neighbours move in opposition with amplitudes in the ratio `$M_2 : M_1$`. Move to the zone edge: in each branch one kind of atom stops.

<figure class="fig" data-fig="phonon-chain"><figcaption>Top: one normal mode of the chain (displacements drawn sideways and exaggerated; the real motion is along the chain). Bottom: the dispersion with the chosen mode marked and the gap shaded.</figcaption></figure>

<div class="problem" data-problem="diatomic-branches"></div>

## 3. Three dimensions

With `$p$` atoms per primitive cell and `$N$` cells there are `$3pN$` modes in `$3p$` branches: **3 acoustic** (one longitudinal LA, two transverse TA, usually lower because shear is softer) and **`$3p - 3$` optical**. Copper: 3 branches, no optical. Si, NaCl, CsCl, hcp metals: 6 (3 optical). Perovskite SrTiO₃ (5 atoms): 15 (12 optical).

In polar crystals the long-wavelength optical modes split. The longitudinal one carries a macroscopic electric field that stiffens it, and the **Lyddane-Sachs-Teller relation** fixes the split:

```math
\frac{\omega_{LO}^2}{\omega_{TO}^2} = \frac{\varepsilon(0)}{\varepsilon(\infty)}
```

For NaCl, `$\sqrt{5.9/2.25} = 1.62$`. Between `$\omega_{TO}$` and `$\omega_{LO}$` the dielectric function is negative and the crystal reflects infrared almost totally (the reststrahlen band). In non-polar Si there is no such field, so LO and TO are degenerate at `$k = 0$`; its optical phonon is Raman active (520 cm⁻¹, 64.5 meV) but not infrared active. In a displacive ferroelectric one TO mode **softens** towards zero as `$T \to T_c$`; by LST, `$\varepsilon(0)$` then diverges (the Curie-Weiss law).

## 4. Phonons: quanta, momentum, measurement

Quantising each mode gives energies `$(n + \tfrac12)\hbar\omega$`. A phonon is one quantum. Phonons are bosons whose number is not conserved, so their chemical potential is zero and the mean occupation is the Planck form

A bond is not a perfect spring. Raise the vibration energy and watch the mean separation grow.

<figure class="fig" data-fig="@sx-bond-well"><figcaption>The harmonic (parabola) well has no thermal expansion; the real, lopsided well does. The same anharmonic term lets phonons scatter each other and gives a finite thermal conductivity.</figcaption></figure>

```math
\langle n\rangle = \frac1{e^{\hbar\omega/k_BT} - 1}
```

(0.613 for a 25 meV mode at 300 K). A phonon carries **crystal momentum** `$\hbar\vec q$`, defined modulo `$\hbar\vec G$`; it is conserved in collisions only up to `$\hbar\vec G$`. When two phonons merge with `$\vec q_1 + \vec q_2$` outside the zone, the result is folded back by a `$\vec G$`: on a chain, `$0.7\pi/a + 0.6\pi/a = 1.3\pi/a \to -0.7\pi/a$`. These **Umklapp** processes reverse heat flow and give insulators their thermal resistance; **normal** processes (`$\vec G = 0$`) only shuffle energy. Both need anharmonic terms in the potential, which also cause thermal expansion; a perfectly harmonic crystal would neither expand nor resist heat flow.

Kinetic theory gives the lattice thermal conductivity `$\kappa = \tfrac13Cv\ell$`. At high temperature `$\ell\propto 1/T$` (more phonons to scatter from); well below `$\theta_D$`, Umklapp needs phonons with `$q\sim G/2$`, whose number falls as `$e^{-\theta_D/bT}$`, so `$\kappa$` rises steeply until `$\ell$` reaches the sample size, and then falls with `$C\propto T^3$`.

**Measuring dispersion.** Inelastic neutron scattering conserves energy and crystal momentum:

```math
E_i - E_f = \pm\hbar\omega(\vec q), \qquad \vec k_i - \vec k_f = \vec q + \vec G
```

Thermal neutrons (`$E = 81.8/\lambda^2$` meV with `$\lambda$` in Å) have energies comparable to phonons, so the energy change is easy to measure. A neutron of 2.000 Å (20.45 meV) that creates a 5.00 meV phonon leaves with 15.45 meV and 2.301 Å. Raman and infrared spectroscopy see only `$q\approx0$`, because a photon's wave vector is a thousandth of the zone.

<div class="myth">

**"A phonon is a tiny particle with momentum `$\hbar q$`, and the diatomic optical branch exists in every crystal."** A phonon is a collective excitation of the whole lattice; apart from `$q = 0$` it carries no physical momentum, only crystal momentum, which a reciprocal vector can change. And optical branches need at least two atoms per primitive cell: copper has none, and a "diatomic" chain of equal masses has none either, because its true period is half as long.

</div>

<div class="keypoints">

- Monatomic chain: `$\omega = 2\sqrt{K/m}|\sin(ka/2)|$`, `$v_s = a\sqrt{K/m}$`, `$v_g = v_s\cos(ka/2)$`, zero at the zone edge; `$N$` modes in the first zone.
- 1D density of states `$\frac{2N}\pi(\omega_m^2 - \omega^2)^{-1/2}$`; number below `$\omega$`: `$\frac{2N}\pi\arcsin(\omega/\omega_m)$`.
- Diatomic chain: optical `$\sqrt{2K(1/M_1 + 1/M_2)}$` at `$k = 0$`; gap from `$\sqrt{2K/M_1}$` to `$\sqrt{2K/M_2}$` at `$k = \pi/a$`; acoustic sound speed `$a\sqrt{K/2(M_1 + M_2)}$`.
- 3D: `$3p$` branches, 3 acoustic, `$3p - 3$` optical. LST: `$\omega_{LO}^2/\omega_{TO}^2 = \varepsilon(0)/\varepsilon(\infty)$`.
- Phonons: bosons with `$\mu = 0$`; crystal momentum modulo `$\hbar\vec G$`; Umklapp `$\vec q_1 + \vec q_2 = \vec q_3 + \vec G$` limits `$\kappa = \tfrac13Cv\ell$`.
- Neutrons measure `$\omega(\vec q)$` across the zone; light sees only `$q \approx 0$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="phonons" data-exam="gate" data-n="10"></div>

**Next:** [lesson 7.5](/learn/courses/gate-physics/heat-capacity/) puts thermal energy into these modes and gets the heat capacity of solids, from Dulong-Petit to the Debye `$T^3$` law. The [band structure explorer](/science/band-structure/) shows the same chain mathematics for electrons.
