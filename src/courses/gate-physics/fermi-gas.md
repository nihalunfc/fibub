---
title: 'The Fermi gas'
seoTitle: The degenerate Fermi gas for GATE Physics
summary: 'The ideal Fermi gas from T = 0 upwards: the Fermi sphere, Fermi energy, temperature and velocity, ground-state energy and degeneracy pressure, the Sommerfeld expansion for the chemical potential and heat capacity, Pauli paramagnetism, the 2D electron gas, liquid helium-3, white dwarfs and neutron stars.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: At T = 0 the mean kinetic energy per particle of an ideal 3D Fermi gas is
    choices: ['3E_F/5', 'E_F/2', 'E_F', '3kT/2']
    ans: 0
    why: "With g(E) ∝ √E filled up to E_F, ⟨E⟩ = ∫E^{3/2}dE/∫E^{1/2}dE = (3/5)E_F."
  - q: Why is the electronic heat capacity of a metal so much smaller than (3/2)Nk at room temperature?
    choices: ['Only electrons within about kT of E_F can be excited', 'Electrons are bound to the ions', 'Electrons have a large effective mass', 'The lattice absorbs the heat first']
    ans: 0
    why: "Pauli blocking: deeper electrons have no empty states within reach. About N T/T_F electrons gain about kT each, so C = (π²/2)Nk T/T_F, about 1% of the classical value."
  - q: How does the degeneracy pressure of an ultra-relativistic Fermi gas scale with density?
    choices: ['n^{4/3}', 'n^{5/3}', 'n', 'n²']
    ans: 0
    why: "E_F = ħck_F ∝ n^{1/3} and P = nE_F/4, so P ∝ n^{4/3}, the same scaling as gravity in a star: the origin of the Chandrasekhar limit."
sources:
  - 'R. K. Pathria and P. D. Beale, Statistical Mechanics, 4th ed. (Academic Press, 2021), chapter 8'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (Saunders, 1976), chapter 2'
  - 'C. Kittel and H. Kroemer, Thermal Physics, 2nd ed. (W. H. Freeman, 1980), chapter 7'
  - 'K. Huang, Statistical Mechanics, 2nd ed. (Wiley, 1987), chapter 11'
  - 'GATE Physics (PH) syllabus, Statistical Physics section, published by the organising institute each year'
---

**Module 5 · about 45 minutes.** By the end you will be able to compute `$E_F$`, `$T_F$`, `$v_F$` and `$g(E_F)$` for any Fermi system, find its energy, pressure and bulk modulus at `$T = 0$`, use the Sommerfeld results for `$\mu(T)$`, `$C$` and `$S$`, explain Pauli paramagnetism, and estimate the physics of white dwarfs and neutron stars. You need the Fermi-Dirac occupation from [lesson 5.4](/learn/courses/gate-physics/quantum-statistics/).

<div class="bigidea">Fermions cannot share states, so even at absolute zero they fill every level up to the Fermi energy. That sea of fast particles has energy, pressure and stiffness without any heat, and only its thin surface responds to temperature.</div>

## 1. The Fermi sphere

At `$T = 0$` the lowest `$N$` single-particle states are full. In `$k$`-space they fill a sphere of radius `$k_F$`; with `$g_s = 2$` spin states per `$\mathbf k$`:

```math
N = 2\cdot\frac{V}{(2\pi)^3}\cdot\frac43\pi k_F^3 \;\Rightarrow\; k_F = (3\pi^2n)^{1/3}, \qquad E_F = \frac{\hbar^2}{2m}(3\pi^2n)^{2/3}
```

<div class="meaning">

<dl>
<dt>k<sub>F</sub></dt><dd>Fermi wavevector, about 3.1/(spacing between particles); depends on n only</dd>
<dt>E<sub>F</sub>, T<sub>F</sub> = E<sub>F</sub>/k, v<sub>F</sub> = ħk<sub>F</sub>/m</dt><dd>for copper (n = 8.47×10²⁸ m⁻³): 7.0 eV, 8.2×10⁴ K, 1.6×10⁶ m/s</dd>
<dt>g(E<sub>F</sub>) = 3N/2E<sub>F</sub></dt><dd>density of states at the Fermi level: it controls heat capacity, spin susceptibility and screening</dd>
<dt>Physical meaning</dt><dd>T ≪ T<sub>F</sub> means degenerate: metals at room temperature (T/T<sub>F</sub> ≈ 0.004), liquid ³He below 1 K (T<sub>F</sub> ≈ 5 K), white dwarfs (T<sub>F</sub> ~ 10⁹ K) and neutron stars (E<sub>F</sub> ≈ 60 MeV).</dd>
</dl>

</div>

**Worked example.** Sodium, `$n = 2.65\times10^{28}$` m⁻³: `$k_F = 9.22\times10^9$` m⁻¹, `$E_F = 3.24$` eV, `$T_F = 3.8\times10^4$` K. Note the scalings `$E_F \propto n^{2/3}/m$`; spinless fermions at the same density would have `$E_F$` larger by `$2^{2/3}$`. In 2D, `$k_F^2 = 2\pi n_s$` and `$E_F = \pi\hbar^2n_s/m$`, linear in density.

<div class="problem" data-problem="stat-fermi-energy"></div>

Fill the lowest states with two electrons each and watch the Fermi sphere grow.

<div class="steps" data-fig="@wt-fermi-sphere"><div class="step"><b>2 electrons.</b> One state (n = 0) holds both, spin up and down. The Pauli principle forbids a third.</div><div class="step"><b>8 electrons.</b> The next shell of states fills; each grid point still holds just two electrons.</div><div class="step"><b>40 electrons.</b> The filled points form a sphere. The edge is the Fermi surface and its energy is E_F.</div><div class="step"><b>200 electrons.</b> k_F = (3π²n)^(1/3): the radius grows only as N^(1/3), so E_F ∝ n^(2/3). The density of states plot shows the filled area up to E_F.</div></div>


## 2. Energy, pressure and stiffness at T = 0

With `$g(E) \propto \sqrt E$` filled to `$E_F$`:

```math
E_0 = \tfrac35NE_F, \qquad P = -\frac{\partial E_0}{\partial V} = \tfrac25nE_F, \qquad B = -V\frac{\partial P}{\partial V} = \tfrac23nE_F
```

because `$E_F \propto V^{-2/3}$`. For copper `$P = 3.8\times10^{10}$` Pa, held in by the ions; for sodium the electron-gas bulk modulus is 9.2 GPa against the measured 6.3 GPa, so alkali metals are soft because their electron gas is. The mean speed at `$T = 0$` is `$\tfrac34v_F$` and the entropy is zero.

## 3. Finite temperature: the Sommerfeld expansion

Heating smears the step over a few `$kT$`. Integrals of the form `$\int H(E)f(E)dE$` can be expanded in `$(kT/E_F)^2$` because `$-\partial f/\partial E$` is a narrow peak at `$\mu$`:

```math
\mu = E_F\left[1 - \frac{\pi^2}{12}\left(\frac{T}{T_F}\right)^2\right], \qquad U = \tfrac35NE_F\left[1 + \frac{5\pi^2}{12}\left(\frac{T}{T_F}\right)^2\right], \qquad C = S = \frac{\pi^2}{2}Nk\frac{T}{T_F}
```

The chemical potential falls because `$g(E)$` increases with energy: smearing would otherwise put more electrons above `$\mu$` than it takes from below. (In 1D, where `$g$` falls, `$\mu$` rises; in 2D, with constant `$g$`, there is no `$T^2$` term at all.) The heat capacity is linear in `$T$` and tiny: about `$N(T/T_F)$` electrons gain about `$kT$` each.

<figure class="fig" data-fig="fermi-smearing"><figcaption>Filled states g(E)f(E) of an ideal 3D Fermi gas. At low T only a sliver around μ is disturbed; μ drops slightly (compare the Sommerfeld formula in the readout). By T ≈ T<sub>F</sub> the step has gone and μ is near zero, on its way to the negative classical value.</figcaption></figure>

**Worked example (γT + βT³).** A metal at low temperature has `$C = \gamma T + \beta T^3$`. Plot `$C/T$` against `$T^2$`: the intercept is `$\gamma$`, the slope `$\beta$`. For copper (`$\gamma = 0.69$` mJ mol⁻¹ K⁻², `$\theta_D = 343$` K) the two terms are equal at `$T = \sqrt{\gamma/\beta} = 3.8$` K. Interactions renormalise `$\gamma \propto m^*$`, which is how heavy-fermion metals reveal effective masses of hundreds of electron masses.

## 4. Pauli paramagnetism

A field `$B$` shifts the spin-up and spin-down bands by `$\mp\mu_BB$`. Only electrons within `$\mu_BB$` of `$E_F$` can flip, so

```math
M = \mu_B^2\,\frac{g(E_F)}{V}\,B, \qquad \chi_P = \mu_0\mu_B^2\frac{g(E_F)}{V} = \frac{3\mu_0n\mu_B^2}{2E_F}
```

nearly independent of temperature, unlike Curie's `$1/T$`. For sodium `$\chi_P = 8.3\times10^{-6}$`. (Orbital motion adds Landau diamagnetism, `$-\tfrac13\chi_P$` for free electrons.)

## 5. Degenerate stars

- **White dwarfs.** About a solar mass in the volume of the Earth; electron density `$\sim10^{36}$` m⁻³, so `$p_Fc = \hbar ck_F \approx 0.6$` MeV, comparable to `$m_ec^2$`. Non-relativistic degeneracy pressure `$\propto n^{5/3} \propto R^{-5}$` balances gravity `$\propto M^2/R^4$` and gives `$R \propto M^{-1/3}$`: heavier white dwarfs are smaller.
- **Relativistic limit.** For `$\varepsilon = pc$`, `$\langle\varepsilon\rangle = \tfrac34E_F$` and `$P = \tfrac14nE_F \propto n^{4/3} \propto R^{-4}$`, the same scaling as gravity. The balance then fixes the mass: the Chandrasekhar limit, about `$1.4M_\odot$`.
- **Neutron stars.** At nuclear density `$n = 0.16$` fm⁻³ the neutron `$E_F \approx 58$` MeV (non-relativistic estimate), far above `$kT \sim 0.1$` MeV: cold degenerate matter, supported by neutron degeneracy plus the nuclear repulsion.

Electrons, not nuclei, hold up a white dwarf because at equal density `$P \propto 1/m$`: the electron gas pushes 1839 times harder than a neutron gas would.

<div class="myth">

**"At absolute zero the electrons in a metal are at rest."** At `$T = 0$` the electrons at the Fermi surface move at about `$10^6$` m/s, and the average kinetic energy is several eV, far more than the thermal `$\tfrac32kT = 0.04$` eV at room temperature. Pauli exclusion, not heat, sets their motion; temperature only ruffles the surface of the Fermi sea.

</div>

<div class="keypoints">

- `$k_F = (3\pi^2n)^{1/3}$`, `$E_F = \hbar^2k_F^2/2m \propto n^{2/3}/m$`, `$g(E_F) = 3N/2E_F$`; 2D: `$E_F = \pi\hbar^2n_s/m$`.
- `$T = 0$`: `$E_0 = \tfrac35NE_F$`, `$P = \tfrac25nE_F$`, `$B = \tfrac23nE_F$`, `$\langle v\rangle = \tfrac34v_F$`, `$S = 0$`.
- Sommerfeld: `$\mu = E_F[1 - \tfrac{\pi^2}{12}(T/T_F)^2]$`, `$C = S = \tfrac{\pi^2}{2}Nk\,T/T_F$`; metals: `$C = \gamma T + \beta T^3$`.
- Pauli `$\chi = \tfrac32\mu_0n\mu_B^2/E_F$`, temperature independent.
- Relativistic: `$P = \tfrac14nE_F \propto n^{4/3}$`; white dwarfs `$R \propto M^{-1/3}$` up to the Chandrasekhar mass.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [GATE practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="fermi-gas" data-exam="gate" data-n="10"></div>

**Next:** [lesson 5.7, phase transitions](/learn/courses/gate-physics/phase-transitions/). For electrons in semiconductors, where the Fermi level sits in a gap, see the JAM lesson on [semiconductors](/learn/courses/iit-jam-physics/semiconductors/), and plot Fermi-Dirac curves with fibub's [quantum statistics plotter](/science/quantum-statistics/).
