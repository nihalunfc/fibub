---
title: 'Superconductivity'
summary: 'Superconductivity at MSc level: zero resistance and the Meissner effect, the critical field and critical current, London equations and the penetration depth, thermodynamics of the transition, coherence length and type-I versus type-II behaviour, vortices and flux quantisation, BCS theory with the gap and the isotope effect, Josephson effects, SQUIDs and the cuprates.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'The magnetic flux through a superconducting ring is quantised in units of'
    choices: ['h/2e', 'h/e', 'e/h', 'h/4e']
    ans: 0
    why: 'The pair wavefunction must be single-valued around the ring and the carriers have charge 2e, so Φ = n h/2e = n × 2.07 × 10⁻¹⁵ Wb.'
  - q: 'A superconductor is type II when κ = λ/ξ is'
    choices: ['greater than 1/√2', 'less than 1/√2', 'exactly 1', 'zero']
    ans: 0
    why: 'For κ > 1/√2 the energy of a normal-superconducting interface is negative, so flux enters as vortices between H_c1 and H_c2.'
  - q: 'In weak-coupling BCS theory, 2Δ(0) equals'
    choices: ['3.52 k_B T_c', '1.76 k_B T_c', 'k_B T_c', '7.04 k_B T_c']
    ans: 0
    why: 'The gap equation gives Δ(0) = 1.764 k_BT_c, so breaking a pair costs 2Δ = 3.53 k_BT_c.'
sources:
  - 'M. Tinkham, Introduction to Superconductivity, 2nd ed. (1996), chapters 1 to 4 and 6'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapter 10'
  - 'J. F. Annett, Superconductivity, Superfluids and Condensates (2004), chapters 2 to 6'
  - 'GATE Physics (PH) syllabus, solid state physics section, published by the organising institute each year'
---

**Module 7 · about 55 minutes.** By the end you will be able to tell a superconductor from a perfect conductor, use the critical-field curve, the London penetration depth and the two-fluid model, work out condensation energies and heat-capacity jumps, classify a material as type I or II from λ and ξ, count vortices and flux quanta, apply the BCS gap and isotope relations, and use the Josephson relations and SQUIDs. You will use the free electron gas of [lesson 7.6](/learn/courses/gate-physics/free-electron-model/), the diamagnetism of [lesson 7.9](/learn/courses/gate-physics/magnetism/), and Maxwell's equations from the [JAM lesson](/learn/courses/iit-jam-physics/maxwell-em-waves/).

<div class="bigidea">Below T_c, electrons near the Fermi surface bind into Cooper pairs and condense into one coherent quantum state, a single wavefunction spread over the whole sample. That one fact explains zero resistance, the expulsion of magnetic fields, flux in units of h/2e, an energy gap of a few k_BT_c, and currents that tunnel through thin barriers as Josephson currents.</div>

## 1. Zero resistance and the Meissner effect

Many metals lose all resistance below a critical temperature `$T_c$` (Hg 4.2 K, Pb 7.2 K, Nb 9.2 K). But a superconductor is more than a perfect conductor. Inside a perfect conductor `$\partial\mathbf B/\partial t = 0$`, so it would keep whatever field it had when it became perfect. A superconductor cooled in a field **expels** it (Meissner and Ochsenfeld, 1933): `$B = 0$` inside, `$\chi = -1$`, whatever the history. So superconductivity is a true thermodynamic phase.

Slide the temperature and field across the transition to see the electrons switch from scattering to gliding.

<figure class="fig" data-fig="@sx-sc-resistance"><figcaption>Below T<sub>c</sub> (and below B<sub>c</sub>(T)) the electrons move as Cooper pairs and nothing scatters them, so the resistance is exactly zero; above it the ions scatter normally.</figcaption></figure>

A strong enough field destroys it. For a type-I material

```math
B_c(T) = B_c(0)\left[1 - \left(\frac{T}{T_c}\right)^2\right]
```

and a wire fails when its own surface field `$\mu_0I/2\pi a$` reaches `$B_c$` (Silsbee's rule): `$I_c = 2\pi aB_c/\mu_0$`, 75 A for a 0.5 mm radius and 30 mT.

<figure class="fig" data-fig="meissner"><figcaption>The phase diagram: move the dot with the sliders to see which state a type-I or type-II superconductor is in at temperature T and field B. Below B_c (type I) or B_c1 (type II) the field is expelled; between B_c1 and B_c2 it enters as vortices. The second view shows how far an applied field leaks in: B falls as e^(−x/λ), and λ grows as T approaches T_c (two-fluid model). A perfect conductor cooled in the field would keep it inside (dashed).</figcaption></figure>

<div class="problem" data-problem="scd-silsbee"></div>

## 2. London equations and the penetration depth

The Londons (1935) wrote two equations for a superfluid of density `$n_s$`:

```math
\frac{\partial\mathbf J_s}{\partial t} = \frac{n_se^2}{m}\mathbf E, \qquad \nabla\times\mathbf J_s = -\frac{n_se^2}{m}\mathbf B
```

The first is free acceleration (zero resistance). The second, combined with `$\nabla\times\mathbf B = \mu_0\mathbf J_s$`, gives `$\nabla^2\mathbf B = \mathbf B/\lambda_L^2$`:

```math
B(x) = B_0e^{-x/\lambda_L}, \qquad \lambda_L = \sqrt{\frac{m}{\mu_0n_se^2}}
```

<div class="meaning">

<dl>
<dt>λ_L</dt><dd>London penetration depth: how far fields and screening currents reach in; 53 nm for n_s = 10²⁸ m⁻³</dd>
<dt>n_s</dt><dd>superfluid density, zero at T_c; two-fluid model n_s/n = 1 − (T/T_c)⁴</dd>
<dt>λ(T)</dt><dd>λ(0)/√(1 − t⁴): 50 nm at T = 0 becomes 65 nm at 0.8 T_c and diverges at T_c</dd>
<dt>Physical meaning</dt><dd>The superfluid responds to a field rigidly, by flowing, rather than to its rate of change. The screening currents run in a skin about λ thick.</dd>
</dl>

</div>

At depth `$3\lambda$` the field is down to 5%. A slab of thickness `$d$` in a parallel field has `$B = B_0\cosh(x/\lambda)/\cosh(d/2\lambda)$` from its centre, so films thinner than `$\lambda$` are only partly screened.

## 3. Thermodynamics of the transition

Expelling a field costs magnetic energy `$B^2/2\mu_0$` per volume, so at `$B_c$` that equals the gain in free energy:

```math
g_n(T) - g_s(T) = \frac{B_c^2(T)}{2\mu_0}
```

For `$B_c = 0.20$` T this is 15.9 kJ/m³. Differentiating along the curve gives the entropy difference `$S_n - S_s = -\dfrac{B_c}{\mu_0}\dfrac{dB_c}{dT} > 0$`: the superconducting state is more ordered.

<div class="steps">
<div class="step">

**In a field** (`$0 < T < T_c$`), `$S_n \ne S_s$`: the transition is first order with latent heat `$L = T(S_n - S_s)$`.

</div>
<div class="step">

**At zero field** (`$T = T_c$`), `$B_c = 0$`, so `$L = 0$`: second order. Differentiating once more gives a jump in heat capacity, Rutgers' formula `$\Delta C = \dfrac{T_c}{\mu_0}\left(\dfrac{dB_c}{dT}\right)^2_{T_c}$`.

</div>
<div class="step">

**With the parabolic curve**, `$dB_c/dT = -2B_c(0)/T_c$` at `$T_c$`, so `$\Delta C = 4B_c(0)^2/\mu_0T_c$`: 770 J m⁻³ K⁻¹ for tin.

</div>
<div class="step">

**Far below `$T_c$`**, the electronic heat capacity falls as `$e^{-\Delta/k_BT}$`: the signature of an energy gap.

</div>
</div>

## 4. Type I, type II and flux quanta

A second length enters: the **coherence length** `$\xi$`, the distance over which the superconducting order can change. The ratio `$\kappa = \lambda/\xi$` decides how the material reacts to a field. A boundary between normal and superconducting regions costs about `$\tfrac12\mu_0H_c^2(\xi - \lambda)$` per area:

- `$\kappa < 1/\sqrt2$` (**type I**: Al, Sn, Pb): positive wall energy, full Meissner effect up to `$B_c$`, then normal.
- `$\kappa > 1/\sqrt2$` (**type II**: Nb, NbTi, Nb₃Sn, cuprates): negative wall energy. Above `$B_{c1}$` flux enters as **vortices**, each a normal core of radius `$\xi$` wrapped in currents of range `$\lambda$` and carrying exactly one flux quantum, until

```math
B_{c2} = \frac{\Phi_0}{2\pi\xi^2} = \sqrt2\,\kappa B_c, \qquad \Phi_0 = \frac{h}{2e} = 2.068\times10^{-15}\ \text{Wb}
```

For `$\xi = 5$` nm, `$B_{c2} = 13$` T, which is why magnets use type-II wire. Vortices form a triangular lattice with spacing `$a = \sqrt{2\Phi_0/\sqrt3B}$`: 69 nm at 0.5 T. A transport current pushes them sideways; if they move they dissipate, so practical conductors need pinning.

**Flux quantisation** follows from the single-valued pair wavefunction: the flux through a thick ring is `$n\,h/2e$`. The measured `$2e$` (1961) proved the carriers are pairs. A ring of radius 10 μm cooled in 0.10 mT holds `$\pi r^2B/\Phi_0 = 15.2$`, so traps 15 quanta.

## 5. BCS theory

Bardeen, Cooper and Schrieffer (1957): the lattice responds slowly to a passing electron and leaves a positive wake that attracts a second electron. This attraction binds electrons `$(\mathbf k\uparrow, -\mathbf k\downarrow)$` near the Fermi surface into singlet **Cooper pairs**, which condense into one state. Key results:

```math
2\Delta(0) = 3.52\,k_BT_c, \qquad k_BT_c = 1.13\,\hbar\omega_De^{-1/N(0)V}, \qquad \frac{\Delta C}{\gamma T_c} = 1.43, \qquad \xi_0 = \frac{\hbar v_F}{\pi\Delta}
```

- **The gap.** Quasiparticles have `$E_k = \sqrt{\xi_k^2 + \Delta^2} \ge \Delta$`; photons are absorbed only above `$2\Delta$` (88 GHz for aluminium, `$T_c = 1.2$` K). Near `$T_c$`, `$\Delta \approx 3.06k_BT_c(1 - T/T_c)^{1/2}$`.
- **Isotope effect.** `$T_c \propto \omega_D \propto M^{-1/2}$`: mercury with mass 204 instead of 200 has `$T_c$` lower by 1%. This pointed to phonons.
- **Condensation energy** `$\tfrac12N(0)\Delta^2 = B_c^2/2\mu_0$`: only electrons within `$\Delta$` of `$E_F$` gain energy.
- **Coherence length.** For aluminium `$\xi_0 \approx 1.7$` μm, far longer than `$\lambda$`: strongly type I.

**Worked example.** Niobium, `$T_c = 9.2$` K: `$2\Delta = 3.52\times8.617\times10^{-5}\times9.2$` eV `$= 2.79$` meV, so radiation below 675 GHz cannot break pairs.

## 6. Josephson effects and SQUIDs

Two superconductors separated by a barrier a few nanometres thick share their pair wavefunctions. With phase difference `$\delta$`:

```math
I = I_c\sin\delta \ \ (\text{DC}), \qquad \frac{d\delta}{dt} = \frac{2eV}{\hbar} \ \ (\text{AC: } f = \frac{2e}{h}V = 483.6\ \text{GHz/mV})
```

- A DC voltage of 10 μV gives a 4.84 GHz alternating supercurrent.
- Microwaves at `$f$` produce constant-voltage **Shapiro steps** at `$V_n = nhf/2e$` (20.7 μV per 10 GHz), the basis of the volt standard.
- A **SQUID** (two junctions in a loop) has a critical current `$2I_c|\cos(\pi\Phi/\Phi_0)|$`, periodic in flux with period `$\Phi_0$`. With 1 mm² that is 2 nT per period, and a small fraction of a period can be resolved.

**Cuprates** (YBa₂Cu₃O₇, `$T_c = 92$` K, above liquid nitrogen) are extreme type II (`$\xi \sim 1.5$` nm, `$\kappa \sim 100$`) with a d-wave gap that has nodes, giving power-law rather than exponential low-temperature behaviour, and only a weak isotope effect.

<div class="myth">

**"A superconductor is just a metal with zero resistance."** Zero resistance alone would freeze whatever field was inside. The Meissner effect, active expulsion, shows a new thermodynamic phase.

**"Cooper pairs are tightly bound molecules."** In a conventional superconductor a pair extends over `$\xi_0$`, hundreds of nanometres, overlapping millions of other pairs. It is a correlation in momentum space, not a little molecule.

</div>

<div class="keypoints">

- Meissner: `$B = 0$` inside (`$\chi = -1$`); `$B_c(T) = B_c(0)[1 - (T/T_c)^2]$`; Silsbee `$I_c = 2\pi aB_c/\mu_0$`.
- London: `$\lambda_L = \sqrt{m/\mu_0n_se^2}$`, `$B = B_0e^{-x/\lambda}$`; two-fluid `$\lambda(T) = \lambda(0)/\sqrt{1 - t^4}$`.
- `$g_n - g_s = B_c^2/2\mu_0$`; first order in a field, second order at `$B = 0$`; Rutgers `$\Delta C = (T_c/\mu_0)(dB_c/dT)^2$`.
- `$\kappa = \lambda/\xi$`: type II if `$> 1/\sqrt2$`; `$B_{c2} = \Phi_0/2\pi\xi^2 = \sqrt2\kappa B_c$`; `$\Phi_0 = h/2e$`.
- BCS: `$2\Delta = 3.52k_BT_c$`, `$\Delta C = 1.43\gamma T_c$`, `$T_c \propto M^{-1/2}$`, `$C \propto e^{-\Delta/k_BT}$`, `$\xi_0 = \hbar v_F/\pi\Delta$`.
- Josephson: `$I = I_c\sin\delta$`, `$f = 2eV/h$`, steps at `$nhf/2e$`; SQUID period `$\Phi_0$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="superconductivity" data-exam="gate" data-n="10"></div>

**Next:** module 8 turns to the nucleus, starting with [nuclear size, spin and moments](/learn/courses/gate-physics/nuclear-properties/). The [Superconductor calculator](/science/superconductor-calculator/) works out critical fields, penetration depths and gaps for real materials. Back to the [GATE Physics course](/learn/courses/gate-physics/).
