---
title: Kinetic theory of transport
summary: 'Transport for CSIR NET: the free-path distribution and mean free path, viscosity, thermal conductivity and diffusion from kinetic theory, Chapman-Enskog corrections, Eucken, Prandtl and Schmidt numbers, the Knudsen regime and thermal transpiration, electrons in metals (Drude, Wiedemann-Franz, Matthiessen), phonon conduction, the Boltzmann equation, the H-theorem and Onsager reciprocity.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: At fixed temperature, how does the viscosity of a dilute gas change when the pressure is doubled?
    choices: ['It doubles', 'It halves', 'It does not change', 'It rises by √2']
    ans: 2
    why: "η ≈ ⅓nm v̄λ, and λ = 1/(√2 nπd²), so n cancels. Twice as many molecules carry momentum, but each carries it half as far. This holds while λ is much smaller than the apparatus and much larger than d."
  - q: What fraction of molecules travel farther than two mean free paths without a collision?
    choices: ['e⁻² ≈ 13.5%', '50%', '25%', 'e⁻¹ ≈ 36.8%']
    ans: 0
    why: "Collisions are a Poisson process in distance, so the survival probability is e^(−x/λ). At x = 2λ that is e⁻² = 0.135. The median free path is only λ ln 2 = 0.693λ."
  - q: For a metal, the Wiedemann-Franz law says κ/(σT) is a universal constant. Which value is right?
    choices: ['(3/2)(k_B/e)², the classical Drude value', '(π²/3)(k_B/e)² = 2.44 × 10⁻⁸ W Ω K⁻²', 'k_B/e', 'It depends on the electron density']
    ans: 1
    why: "Only electrons within k_BT of the Fermi level carry heat or charge. Fermi-Dirac statistics give the Lorenz number L₀ = (π²/3)(k_B/e)². Drude's classical value came out close only because two errors of order 100 cancelled."
sources:
  - 'F. Reif, Fundamentals of Statistical and Thermal Physics (1965), chapters 12 to 14'
  - 'S. Chapman and T. G. Cowling, The Mathematical Theory of Non-uniform Gases, 3rd ed. (1970), chapters 10 and 12'
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 1, 2, 16 and 25'
  - 'CSIR-UGC NET Physical Sciences syllabus, Thermodynamic and Statistical Physics unit, published by the National Testing Agency'
---

**Module 6 · about 50 minutes.** A gas out of equilibrium carries momentum, energy and molecules from where there are more to where there are fewer: that is viscosity, heat conduction and diffusion. Kinetic theory gets all three from one picture (molecules flying a mean free path between collisions), with a few surprises: the viscosity does not depend on pressure, heat conduction in a thin gap does, and electrons in a metal obey a universal ratio. The Maxwell distribution and the mean speed are in the IIT JAM lesson on [kinetic theory](/learn/courses/iit-jam-physics/kinetic-theory/), and viscous flow itself is in [fluids](/learn/courses/iit-jam-physics/fluids/).

<div class="bigidea">Every transport coefficient is (1/3) × (how much of the quantity a molecule carries) × (how fast it moves) × (how far it goes before handing it on). For a gas that gives η = ⅓nm v̄λ, κ = ⅓n c_v v̄λ and D = ⅓v̄λ; for electrons in a metal, the same idea with Fermi-surface electrons. The numerical factors change with better theory; the scaling with n, T and mass does not.</div>

## 1. Free paths

Picture a molecule of diameter `$d$` sweeping a cylinder of cross-section `$\sigma = \pi d^2$`. Any other molecule whose centre lies in the cylinder is hit. Allowing for the motion of the others (relative speed `$\sqrt2\bar v$` on average) gives

```math
\lambda = \frac{1}{\sqrt2\,n\pi d^2} = \frac{k_BT}{\sqrt2\,\pi d^2P}, \qquad \text{collision rate } \frac{\bar v}{\lambda}, \qquad \bar v = \sqrt{\frac{8k_BT}{\pi m}}
```

For nitrogen (`$d \approx 0.37$` nm) at 300 K, `$\lambda = 68$` nm at 1 atm and 6.8 mm at 1 Pa; a molecule at 476 m/s collides about `$7\times10^9$` times a second at 1 atm.

**The free-path law.** If the chance of a collision in `$dx$` is `$dx/\lambda$` regardless of history, the probability of flying a distance `$x$` without one is

```math
P(x) = e^{-x/\lambda}, \qquad \langle x\rangle = \lambda, \qquad x_{\rm median} = \lambda\ln2 = 0.693\lambda
```

The mean distance *since* the last collision is also `$\lambda$`, as is the mean distance to the next: a molecule picked at random sits in a path of average length `$2\lambda$`. Longer paths are more likely to be sampled (the same bias as the waiting-time paradox).

## 2. Viscosity, conduction and diffusion

Take a gradient along `$z$` of some quantity `$Q$` carried per molecule. Molecules crossing a plane arrive on average from a height about `$\tfrac23\lambda$` away, carrying `$Q$` from there. The net flux is `$-\tfrac13n\bar v\lambda\,dQ/dz$`. With `$Q = mu_x$`, `$Q = \epsilon$` (energy) or `$Q$` = labelled fraction:

```math
\eta = \tfrac13nm\bar v\lambda, \qquad \kappa = \tfrac13nc_v\bar v\lambda, \qquad D = \tfrac13\bar v\lambda
```

with `$c_v$` the heat capacity per molecule. Three consequences follow at once:

- **No pressure dependence.** Since `$n\lambda = 1/\sqrt2\pi d^2$`, `$\eta$` and `$\kappa$` are independent of `$n$`. Maxwell predicted this in 1860 and measured it himself; it holds from about 1 kPa to tens of atmospheres. `$D$` does depend on pressure, as `$1/P$`.
- **Temperature.** For hard spheres all three rise as `$\sqrt T$` (`$D$` as `$T^{3/2}$` at fixed `$P$`). Real gases rise faster, roughly `$T^{0.7}$`, because molecules are softer than hard spheres at high energy.
- **Ratios.** `$\kappa = \eta c_v/m$` and `$D = \eta/\rho$`. Light gases conduct heat best: helium beats argon by `$\sqrt{40/4} \approx 3$` from `$\bar v$` alone, and more because its atoms are smaller.

**Chapman-Enskog.** Solving the Boltzmann equation properly for hard spheres changes the numbers:

```math
\eta = \frac{5}{16}\frac{\sqrt{\pi mk_BT}}{\pi d^2}, \qquad \kappa = f\,\eta\frac{c_v}{m}, \qquad \rho D = \tfrac65\eta
```

The elementary formula's `$\tfrac13nm\bar v\lambda$` is about 1.5 times too small. For a monatomic gas `$f = \tfrac52$`, not 1: fast molecules carry more energy and also travel farther. For polyatomic gases, **Eucken's** correction treats internal energy as diffusing, `$f = (9\gamma - 5)/4$`. Dimensionless ratios used in heat transfer:

| Number | Definition | Hard-sphere monatomic | Eucken, `$\gamma = 1.4$` |
|---|---|---|---|
| Prandtl | `$\text{Pr} = c_p\eta/\kappa$` | `$\tfrac23$` | `$4\gamma/(9\gamma - 5) = 0.74$` |
| Schmidt | `$\text{Sc} = \eta/\rho D$` | `$\tfrac56$` | about 0.75 |

Measured: argon Pr = 0.67, nitrogen 0.72.

### Worked example: argon from first principles

<div class="steps">
<div class="step"><p><b>Data.</b> Argon, m = 39.95 u = 6.63 × 10⁻²⁶ kg, hard-sphere diameter 0.364 nm, T = 300 K.</p></div>
<div class="step"><p><b>Viscosity.</b> √(πmk<sub>B</sub>T) = 2.94 × 10⁻²³ kg m/s and πd² = 4.16 × 10⁻¹⁹ m², so η = (5/16)(2.94 × 10⁻²³)/(4.16 × 10⁻¹⁹) = 22.1 μPa s (measured 22.7).</p></div>
<div class="step"><p><b>Conductivity.</b> κ = (5/2) η c<sub>v</sub>/m with c<sub>v</sub> = (3/2)k<sub>B</sub>: κ = (15/4)(k<sub>B</sub>/m)η = 17.2 mW m⁻¹ K⁻¹ (measured 17.9).</p></div>
<div class="step"><p><b>Lesson.</b> One parameter, d, fitted to viscosity, predicts conductivity within 4%. The elementary formulas would have given 15 μPa s and, with f = 1, a conductivity nearly 4 times too small.</p></div>
</div>

<div class="problem" data-problem="gas-viscosity"></div>

## 3. The Knudsen regime

When `$\lambda$` exceeds the size `$L$` of the container (Knudsen number `$\text{Kn} = \lambda/L \gg 1$`), molecules fly wall to wall and the picture changes.

- **Heat conduction between plates** becomes proportional to pressure: each molecule carries energy across in one flight, and the number of molecules is `$\propto P$`. This is how a Pirani gauge measures vacuum, and why a vacuum flask needs `$\lambda$` much larger than its gap: below about 0.1 Pa for a 5 mm gap. An interpolation that captures both limits is `$q/q_{\rm continuum} \approx 1/(1 + 2\,\text{Kn})$`.
- **Effusion.** The flux through a small hole is `$\tfrac14n\bar v$` per unit area, and lighter molecules escape faster, in proportion to `$1/\sqrt m$` (Graham), the basis of gaseous isotope separation (`$\sqrt{352/349} = 1.0043$` per stage for uranium hexafluoride).
- **Thermal transpiration.** Two vessels at temperatures `$T_1$` and `$T_2$` joined by a tube narrower than `$\lambda$` reach equal fluxes, `$n_1\bar v_1 = n_2\bar v_2$`, so `$P_1/P_2 = \sqrt{T_1/T_2}$`, not equal pressures. A gauge at room temperature reading a cryostat at 4.2 K overestimates its pressure by `$\sqrt{300/4.2} = 8.5$` in this regime.

<figure class="fig" data-fig="knudsen-conduction"><figcaption>Heat carried by nitrogen across a gap, as a fraction of its continuum value, against pressure. At low pressure the flux rises in proportion to P (free-molecular); once λ is much smaller than the gap it levels off (continuum). Change the gap to shift the knee. The second view shows the exponential law of free paths.</figcaption></figure>

<div class="meaning">

<dl>
<dt>λ</dt><dd>mean free path, 1/(√2 nπd²)</dd>
<dt>η, κ, D</dt><dd>viscosity (Pa s), thermal conductivity (W m⁻¹ K⁻¹), diffusion coefficient (m² s⁻¹)</dd>
<dt>Kn</dt><dd>Knudsen number λ/L: below 0.01 continuum, above 10 free-molecular</dd>
<dt>τ</dt><dd>relaxation (collision) time; for electrons in a metal about 10⁻¹⁴ s</dd>
<dt>L₀</dt><dd>Lorenz number (π²/3)(k<sub>B</sub>/e)² = 2.44 × 10⁻⁸ W Ω K⁻²</dd>
<dt>Physical meaning</dt><dd>Transport is a random walk of whatever molecules carry. More carriers usually means shorter steps, which is why the gas coefficients do not care about density, until the walls become the main obstacle.</dd>
</dl>

</div>

## 4. Electrons and phonons in solids

**Drude.** Electrons accelerate in a field and lose their drift every `$\tau$`:

```math
\sigma = \frac{ne^2\tau}{m}, \qquad \mu = \frac{e\tau}{m}, \qquad \kappa_e = \tfrac13C_ev_F^2\tau
```

For copper (`$n = 8.5\times10^{28}$` m⁻³, `$\sigma = 5.96\times10^7$` S/m at 293 K), `$\tau = m\sigma/ne^2 = 2.5\times10^{-14}$` s and the mean free path `$v_F\tau = 1.57\times10^6 \times 2.5\times10^{-14} = 39$` nm, about 150 lattice spacings. Electrons are scattered by defects and lattice vibrations, not by the ions themselves (a perfect lattice does not scatter Bloch waves).

**Wiedemann-Franz law.** Using the Sommerfeld heat capacity `$C_e = \tfrac{\pi^2}{2}nk_B(T/T_F)$` (see [the Fermi gas](/learn/courses/gate-physics/fermi-gas/)):

```math
\frac{\kappa_e}{\sigma T} = L_0 = \frac{\pi^2}{3}\left(\frac{k_B}{e}\right)^2 = 2.44\times10^{-8}\ \text{W}\,\Omega\,\text{K}^{-2}
```

Copper: `$\kappa = L_0\sigma T = 426$` W m⁻¹ K⁻¹, against 401 measured. The law holds when the same collisions relax both currents (elastic scattering: high `$T$` and very low `$T$`); it fails at intermediate temperatures, where small-angle phonon scattering degrades heat current more than charge current.

**Matthiessen's rule.** Independent scattering rates add, so resistivities add: `$\rho(T) = \rho_0 + \rho_{\rm ph}(T)$`. The residual `$\rho_0$` from impurities is constant; the phonon part goes as `$T$` above the Debye temperature and as `$T^5$` far below it (Bloch-Grüneisen). The residual resistance ratio `$\rho(300\text{ K})/\rho(4\text{ K})$` measures purity.

**Phonon conduction.** In insulators heat is carried by phonons (see [phonons](/learn/courses/gate-physics/phonons/)): `$\kappa = \tfrac13Cv_s\ell$`. At high `$T$`, umklapp collisions limit `$\ell \propto 1/T$`; as `$T$` falls they freeze out (`$\ell \propto e^{\Theta_D/bT}$`) and `$\kappa$` peaks, often above copper's (diamond reaches 2000 W m⁻¹ K⁻¹ at room temperature); at the lowest temperatures `$\ell$` is the sample size and `$\kappa \propto C \propto T^3$`.

## 5. The Boltzmann equation, irreversibility and Onsager

All of the above follows from the **Boltzmann equation** for the distribution `$f(\vec r, \vec v, t)$`:

```math
\frac{\partial f}{\partial t} + \vec v\cdot\nabla_rf + \frac{\vec F}{m}\cdot\nabla_vf = \left(\frac{\partial f}{\partial t}\right)_{\rm coll} \approx -\frac{f - f_0}{\tau}
```

the last form being the relaxation-time approximation. Linearising about the local equilibrium `$f_0$` gives every coefficient in this lesson.

**H-theorem.** Boltzmann's `$H = \int f\ln f\,d^3v$` never increases under the collision term, `$dH/dt \le 0$`, with equality only for the Maxwell distribution. `$-k_BH$` is the entropy density, so this is the second law emerging from mechanics, with the irreversibility smuggled in by the assumption of uncorrelated colliding molecules (*Stosszahlansatz*). Loschmidt's reversal objection and Zermelo's recurrence objection are answered by that assumption and by recurrence times far longer than the age of the universe.

**Onsager reciprocity.** Near equilibrium, fluxes are linear in forces, `$J_i = \sum_jL_{ij}X_j$`, and microscopic time-reversal symmetry makes `$L_{ij} = L_{ji}$` (with `$\vec B \to -\vec B$` if a field is present). In thermoelectricity it gives the Kelvin relation `$\Pi = ST$` between the Peltier and Seebeck coefficients; in diffusion, the equality of cross coefficients in a ternary mixture.

<div class="myth">

**"A denser gas is more viscous because there are more molecules to rub against."** For a dilute gas the opposite reasoning cancels exactly: more molecules carry momentum, but each carries it a proportionally shorter distance. Gas viscosity is independent of density and *rises* with temperature, the reverse of liquids, whose viscosity falls with temperature because molecules must hop out of cages formed by their neighbours. Only when the gas is dense enough that molecules occupy a sizeable fraction of the volume (Enskog) does density start to matter.

</div>

<div class="keypoints">

- `$\lambda = 1/(\sqrt2n\pi d^2) = k_BT/(\sqrt2\pi d^2P)$`; survival `$e^{-x/\lambda}$`, median `$0.693\lambda$`.
- Elementary `$\eta = \tfrac13nm\bar v\lambda$`, `$\kappa = \tfrac13nc_v\bar v\lambda$`, `$D = \tfrac13\bar v\lambda$`; `$\eta$`, `$\kappa$` independent of `$P$`, `$\propto\sqrt T$`; `$D \propto T^{3/2}/P$`.
- Chapman-Enskog `$\eta = \tfrac5{16}\sqrt{\pi mk_BT}/\pi d^2$`; `$\kappa = \tfrac52\eta c_v/m$` (monatomic), Eucken `$f = (9\gamma - 5)/4$`; Pr = 2/3, `$\rho D = \tfrac65\eta$`.
- Knudsen: heat flux `$\propto P$`; effusion `$\tfrac14n\bar v$`, `$\propto 1/\sqrt m$`; transpiration `$P_1/P_2 = \sqrt{T_1/T_2}$`.
- Drude `$\sigma = ne^2\tau/m$`; Wiedemann-Franz `$L_0 = \tfrac{\pi^2}{3}(k_B/e)^2 = 2.44\times10^{-8}$` W Ω K⁻²; Matthiessen `$\rho = \rho_0 + \rho_{\rm ph}(T)$`, `$T^5$` low, `$T$` high.
- Phonons `$\kappa = \tfrac13Cv\ell$`: umklapp at high `$T$`, `$T^3$` at low `$T$`.
- Boltzmann equation, relaxation time; H-theorem `$dH/dt \le 0$`; Onsager `$L_{ij} = L_{ji}$`, Kelvin `$\Pi = ST$`.

</div>

## Practise: exam questions on this lesson

NET Part C style, each with a full solution. More on the [CSIR NET Physics practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="transport" data-exam="net" data-n="10"></div>

**Next:** the statistical physics module ends here; review it with mixed questions on the [CSIR NET practice page](/learn/courses/csir-net-physics/practice/) or a timed [mock test](/learn/courses/csir-net-physics/mock-test/). Back to [fluctuations and Brownian motion](/learn/courses/csir-net-physics/fluctuations-brownian/) for diffusion seen from a single particle.
