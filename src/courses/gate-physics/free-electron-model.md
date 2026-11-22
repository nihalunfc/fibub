---
title: 'The free electron model'
summary: 'Metals as a gas of free electrons: the Drude model and where it fails, the Sommerfeld gas with its Fermi sphere, density of states in one, two and three dimensions, Fermi energy, velocity and temperature, the chemical potential at finite temperature, the linear electronic heat capacity, degeneracy pressure, Wiedemann-Franz, plasma reflection and thin-film subbands.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'In a 2D free electron gas, the density of states per unit area'
    choices: ['is constant, m/πħ²', 'grows as √E', 'falls as 1/√E', 'grows linearly with E']
    ans: 0
    why: 'In d dimensions g ∝ E^(d/2 − 1). For d = 2 the power is zero, so g = m/πħ² (spin included) at every energy above the band bottom, and E_F is proportional to n.'
  - q: 'The electronic heat capacity of a free electron gas at T ≪ T_F is'
    choices: ['(π²/2) n k_B (T/T_F)', '(3/2) n k_B', '(π²/3) n k_B', 'proportional to T³']
    ans: 0
    why: 'Only a fraction of order T/T_F of the electrons, those within k_BT of E_F, can be excited, each by about k_BT. The exact coefficient from the Sommerfeld expansion is π²/2.'
  - q: 'Doubling the free electron density of a metal multiplies its Fermi energy by'
    choices: ['2^(2/3) ≈ 1.59', '2', '2^(1/3) ≈ 1.26', '4']
    ans: 0
    why: 'E_F = (ħ²/2m)(3π²n)^(2/3), so E_F ∝ n^(2/3). The Fermi wave vector and velocity grow as n^(1/3), the degeneracy pressure as n^(5/3).'
sources:
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 1 and 2'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapter 6'
  - 'S. H. Simon, The Oxford Solid State Basics (2013), chapters 3 and 4'
  - 'GATE Physics (PH) syllabus, solid state physics section, published by the organising institute each year'
---

**Module 7 · about 50 minutes.** By the end you will be able to find the Fermi energy, wave vector, velocity and temperature of any simple metal from its density and valence, count states in one, two and three dimensions, explain why electrons add almost nothing to a metal's heat capacity at room temperature, and use the Drude and Sommerfeld pictures for conductivity, thermal conductivity, optical reflection and Hall effect. The Fermi-Dirac function and its use in semiconductors were met in [IIT JAM lesson on semiconductors](/learn/courses/iit-jam-physics/semiconductors/); particles in a box are in the [JAM Schrödinger equation lesson](/learn/courses/iit-jam-physics/schrodinger-equation/).

<div class="bigidea">Treat the valence electrons of a metal as free particles in a box. Classically (Drude) this explains Ohm's law but gets the heat capacity wrong by a factor of a hundred. Add the Pauli principle (Sommerfeld): the electrons fill a sphere in momentum space up to the Fermi energy, a few electronvolts, so at room temperature only a thin skin of them near the Fermi surface can do anything.</div>

## 1. The Drude model

Drude (1900) treated conduction electrons as a classical gas of density `$n$` that collides randomly, with a mean time `$\tau$` between collisions. Between collisions an electron accelerates freely; after one it forgets its velocity. On average:

```math
m\frac{d\mathbf v}{dt} = -e(\mathbf E + \mathbf v\times\mathbf B) - \frac{m\mathbf v}{\tau}
```

In a steady field `$\mathbf E$` this gives the drift velocity `$\mathbf v = -e\tau\mathbf E/m$`, the current `$\mathbf J = -ne\mathbf v$` and

```math
\sigma = \frac{ne^2\tau}{m}, \qquad \mu = \frac{e\tau}{m}
```

<div class="meaning">

<dl>
<dt>n</dt><dd>conduction electrons per m³ (valence × atoms per m³), about 10²⁸ to 10²⁹ in metals</dd>
<dt>τ</dt><dd>relaxation time, about 10⁻¹⁴ s at room temperature; it is the only fitted parameter</dd>
<dt>μ = eτ/m</dt><dd>mobility, drift speed per unit field; tens of cm²/V s in metals</dd>
<dt>Physical meaning</dt><dd>The field keeps pushing, collisions keep resetting, so the electrons settle into a slow drift (millimetres per second) proportional to the field: Ohm's law.</dd>
</dl>

</div>

**Worked example.** Copper has `$\rho = 1.7\times10^{-8}$` Ω m and `$n = 8.5\times10^{28}$` m⁻³. Then `$\tau = m/\rho ne^2 = 9.11\times10^{-31}/(1.7\times10^{-8}\times8.5\times10^{28}\times2.57\times10^{-38}) = 2.5\times10^{-14}$` s.

The same equation handles two more cases you must know:

- **A magnetic field** (steady state, one kind of carrier): `$\rho_{xx}$` does not change with `$B$` and `$\rho_{xy} = B/n(-e)$`, so `$R_H = -1/ne$`, independent of `$\tau$` and `$B$`. Measuring `$R_H$` counts the carriers. The Hall angle is `$\tan\theta_H = \omega_c\tau$`.
- **An AC field** `$\propto e^{-i\omega t}$`: `$\sigma(\omega) = \sigma_0/(1 - i\omega\tau)$`. For `$\omega\tau \gg 1$` the permittivity is `$\varepsilon(\omega) = 1 - \omega_p^2/\omega^2$` with `$\omega_p^2 = ne^2/\varepsilon_0m$`. Below `$\omega_p$`, `$\varepsilon < 0$` and light is reflected; above it the metal is transparent. For alkali metals `$\lambda_p \approx 200$` to `$300$` nm: shiny in the visible, transparent in the ultraviolet.

**Where Drude fails.** Classical equipartition gives each electron `$\tfrac32k_BT$`, so electrons should add `$\tfrac32R$` per mole to the heat capacity. Experiment shows about 1% of that at room temperature. The mean free path `$\ell = v\tau$` with a thermal speed `$v \sim 10^5$` m/s comes out shorter than an atomic spacing, which makes no sense for electrons moving through a perfect lattice. And some metals have a positive Hall coefficient. The first two are cured by quantum statistics; the third needs band theory ([lesson 7.7](/learn/courses/gate-physics/band-theory/)).

## 2. The Sommerfeld gas: filling the Fermi sphere

Put `$N$` electrons in a cube of side `$L$` with periodic boundary conditions. The states are plane waves `$e^{i\mathbf k\cdot\mathbf r}$` with `$k_i = 2\pi n_i/L$`, so each allowed `$\mathbf k$` occupies a volume `$(2\pi/L)^3$` of `$k$`-space and holds 2 electrons (spin). At `$T = 0$` the lowest states fill a sphere of radius `$k_F$`:

```math
2\cdot\frac{\tfrac43\pi k_F^3}{(2\pi/L)^3} = N \quad\Rightarrow\quad k_F = (3\pi^2n)^{1/3}, \qquad E_F = \frac{\hbar^2k_F^2}{2m} = \frac{\hbar^2}{2m}(3\pi^2n)^{2/3}
```

with `$v_F = \hbar k_F/m$` and `$T_F = E_F/k_B$`.

**Worked example (copper, one electron per atom).** `$n = 8.47\times10^{28}$` m⁻³ `$= 84.7$` nm⁻³. `$k_F = (3\pi^2\times84.7)^{1/3} = 13.6$` nm⁻¹ `$= 1.36$` Å⁻¹. With `$\hbar^2/2m = 0.0381$` eV nm²: `$E_F = 0.0381\times13.6^2 = 7.0$` eV, `$v_F = 1.57\times10^6$` m/s and `$T_F = 8.2\times10^4$` K. Room temperature is `$T/T_F \approx 0.004$`: the electron gas is deeply degenerate.

Two consequences follow at once. The mean energy per electron is `$\tfrac35E_F$`, not zero, so the gas pushes outwards even at `$T = 0$`:

```math
P = \frac25nE_F, \qquad B = -V\frac{\partial P}{\partial V} = \frac23nE_F
```

For sodium this is 9 GPa, close to the measured bulk modulus of 6 GPa: the Pauli principle, not ion repulsion, makes alkali metals stiff. And the mean free path is `$\ell = v_F\tau \approx 40$` nm, many lattice spacings: electrons are scattered by imperfections and vibrations, not by the ions of a perfect lattice.

<div class="problem" data-problem="fem-fermi-gas"></div>

## 3. Density of states in 1, 2 and 3 dimensions

The density of states `$g(E)$` counts states per unit energy (per unit length, area or volume). In `$d$` dimensions the states below `$E$` fill a ball of radius `$k \propto E^{1/2}$`, so `$N(E) \propto E^{d/2}$` and `$g(E) \propto E^{d/2 - 1}$`. Including spin:

```math
g_{3D} = \frac{1}{2\pi^2}\left(\frac{2m}{\hbar^2}\right)^{3/2}E^{1/2}, \qquad g_{2D} = \frac{m}{\pi\hbar^2}, \qquad g_{1D} = \frac{1}{\pi\hbar}\sqrt{\frac{2m}{E}}
```

Useful results that follow:

- 3D: `$g(E_F) = \dfrac{3n}{2E_F}$` and `$\langle E\rangle = \tfrac35E_F$`.
- 2D: `$E_F = \pi\hbar^2n/m$` (linear in `$n$`) and `$\langle E\rangle = \tfrac12E_F$`. A GaAs electron gas with `$n = 10^{16}$` m⁻² and `$m^* = 0.067m_e$` has `$E_F = 36$` meV.
- 1D: `$k_F = \pi n/2$`, `$\langle E\rangle = \tfrac13E_F$`, and `$g$` diverges at the band bottom.
- General: `$\langle E\rangle = \dfrac{d}{d + 2}E_F$`.

A metal film a nanometre thick is 3D in the plane but quantised across: subbands start at `$E_j = \dfrac{\hbar^2}{2m}\left(\dfrac{j\pi}{L}\right)^2$`, each with the constant 2D density of states, so `$g(E)$` is a staircase. For `$L = 1$` nm, `$E_j = 0.376j^2$` eV, and a Fermi energy of 5 eV fills three subbands.

## 4. Finite temperature: who can move?

At temperature `$T$` the occupation is the Fermi-Dirac function `$f(E) = 1/(e^{(E - \mu)/k_BT} + 1)$`, which drops from 1 to 0 over a few `$k_BT$` around the chemical potential `$\mu$`. Play with the figure: the occupied states `$g(E)f(E)$` change only in a band of width `$\sim k_BT$` about `$E_F$`.

<figure class="fig" data-fig="fermi-occupation"><figcaption>The density of states g(E) (dashed), the occupation f(E) and the occupied states g(E)f(E) (shaded) for a free electron gas in 1, 2 or 3 dimensions. The chemical potential is recomputed so the number of electrons stays fixed: it falls slightly in 3D, stays almost exactly at E_F in 2D, and rises in 1D, because g(E) rises, is flat, or falls through E_F.</figcaption></figure>

The **Sommerfeld expansion** turns this into formulas. For any smooth `$H(E)$`,

```math
\int_0^\infty H(E)f(E)\,dE = \int_0^\mu H(E)\,dE + \frac{\pi^2}{6}(k_BT)^2H'(\mu) + O(T^4)
```

Applying it to `$N$` and `$U$` gives, in 3D,

```math
\mu = E_F\left[1 - \frac{\pi^2}{12}\left(\frac{T}{T_F}\right)^2\right], \qquad C_{el} = \frac{\pi^2}{2}nk_B\frac{T}{T_F} = \gamma T
```

<div class="steps">
<div class="step">

**Estimate first.** About `$g(E_F)k_BT$` electrons lie within `$k_BT$` of `$E_F$`; each gains about `$k_BT$`. So `$\Delta U \sim g(E_F)(k_BT)^2$` and `$C \sim g(E_F)k_B^2T$`, linear in `$T$`.

</div>
<div class="step">

**Exact coefficient.** The Sommerfeld expansion gives `$C = \dfrac{\pi^2}{3}g(E_F)k_B^2T$`. With `$g(E_F) = 3n/2E_F$` this is `$\dfrac{\pi^2}{2}nk_B\dfrac{T}{T_F}$`.

</div>
<div class="step">

**Compare with Drude.** The ratio to `$\tfrac32nk_B$` is `$\dfrac{\pi^2}{3}\dfrac{T}{T_F}$`; for `$T_F = 8\times10^4$` K at 300 K it is 0.012. Electrons are almost frozen.

</div>
<div class="step">

**Per mole.** `$\gamma = \dfrac{\pi^2}{2}\dfrac{ZR}{T_F}$`, a fraction of a mJ mol⁻¹ K⁻². Experiment divided by this value gives the thermal effective mass `$m^*/m$`.

</div>
</div>

**Worked example (separating electrons and phonons).** At low temperature `$C = \gamma T + AT^3$`. Plot `$C/T$` against `$T^2$`: the intercept is `$\gamma$`, the slope `$A = \tfrac{12\pi^4}{5}R/\theta_D^3$`. For `$\gamma = 0.70$` mJ mol⁻¹ K⁻² and `$A = 0.050$` mJ mol⁻¹ K⁻⁴ the two are equal at `$T = \sqrt{\gamma/A} = 3.7$` K; below that the electrons dominate.

## 5. Transport with the Fermi sphere

In a field the whole Fermi sphere shifts by `$\delta\mathbf k = -e\mathbf E\tau/\hbar$`, so `$\sigma = ne^2\tau/m$` survives, with `$\tau$` now the relaxation time of electrons at the Fermi surface. Heat is carried by the same electrons, with `$\kappa = \tfrac13c_vv_F^2\tau$`. Dividing:

```math
\frac{\kappa}{\sigma T} = L = \frac{\pi^2}{3}\left(\frac{k_B}{e}\right)^2 = 2.44\times10^{-8}\ \text{W}\,\Omega\,\text{K}^{-2}
```

This is the Wiedemann-Franz law. Drude got `$\tfrac32(k_B/e)^2$`, close by luck: its heat capacity was 100 times too big and its `$\langle v^2\rangle$` 100 times too small. A metal with `$\sigma = 5.9\times10^7$` S/m at 300 K should have `$\kappa = 2.44\times10^{-8}\times5.9\times10^7\times300 = 430$` W m⁻¹ K⁻¹; copper is measured at 400.

**Thermionic emission.** Electrons in the Fermi tail with enough momentum to climb the work function `$W$` (measured from `$E_F$`) escape: `$J = A_0T^2e^{-W/k_BT}$` with `$A_0 = 4\pi mek_B^2/h^3 = 1.2\times10^6$` A m⁻² K⁻². A plot of `$\ln(J/T^2)$` against `$1/T$` gives `$W$`.

<div class="myth">

**"Electrons in a metal move slowly, at the drift speed."** The drift speed is millimetres per second, but each electron at the Fermi surface moves at `$v_F \sim 10^6$` m/s even at absolute zero. A current is a tiny imbalance between huge numbers of fast electrons going each way.

**"The free electron model explains the sign of the Hall coefficient."** It always gives `$R_H = -1/ne$`. Positive `$R_H$` in Be, Zn, Cd or Al at high fields comes from hole-like orbits in the band structure.

</div>

<div class="keypoints">

- Drude: `$\sigma = ne^2\tau/m$`, `$\mu = e\tau/m$`, `$R_H = -1/ne$`, `$\sigma(\omega) = \sigma_0/(1 - i\omega\tau)$`, `$\varepsilon = 1 - \omega_p^2/\omega^2$`, `$\omega_p^2 = ne^2/\varepsilon_0m$`.
- Sommerfeld: `$k_F = (3\pi^2n)^{1/3}$`, `$E_F = \hbar^2k_F^2/2m$` (2 to 12 eV), `$v_F \sim 10^6$` m/s, `$T_F \sim 10^4$` to `$10^5$` K.
- `$g \propto E^{d/2 - 1}$`; 3D `$g(E_F) = 3n/2E_F$`; 2D `$g = m/\pi\hbar^2$`, `$E_F = \pi\hbar^2n/m$`; `$\langle E\rangle = \tfrac{d}{d + 2}E_F$`.
- `$P = \tfrac25nE_F$`, `$B = \tfrac23nE_F$`; `$\mu = E_F[1 - \tfrac{\pi^2}{12}(T/T_F)^2]$`.
- `$C_{el} = \tfrac{\pi^2}{2}nk_BT/T_F$`; `$C/T = \gamma + AT^2$` separates electrons from phonons.
- Wiedemann-Franz `$L = \tfrac{\pi^2}{3}(k_B/e)^2$`; Richardson `$J = A_0T^2e^{-W/k_BT}$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="free-electron-model" data-exam="gate" data-n="10"></div>

**Next:** [lesson 7.7](/learn/courses/gate-physics/band-theory/) puts the lattice back and shows how gaps open at the zone boundaries. The [Quantum statistics plotter](/science/quantum-statistics/) draws Fermi-Dirac against Bose-Einstein and Maxwell-Boltzmann. Back to the [GATE Physics course](/learn/courses/gate-physics/).
