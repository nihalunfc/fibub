---
title: 'Semiconductors and the Hall effect'
summary: 'Semiconductors at MSc level: effective densities of states and valley masses, the intrinsic level, freeze-out with and without compensation, the Mott transition, mobility and Matthiessen''s rule, the Hall factor, Hall effect with two carriers and its sign change, magnetoresistance, cyclotron resonance, Landau levels, Shubnikov-de Haas oscillations and the integer quantum Hall effect.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'An intrinsic semiconductor (n = p) with μ_e > μ_h has a Hall coefficient that is'
    choices: ['negative', 'zero', 'positive', 'dependent on the sign of B']
    ans: 0
    why: 'R_H = (pμ_h² − nμ_e²)/e(pμ_h + nμ_e)². With n = p the numerator is n(μ_h² − μ_e²) < 0: the faster electrons win.'
  - q: 'On the ν = 2 integer quantum Hall plateau, R_xy is about'
    choices: ['12.9 kΩ', '25.8 kΩ', '6.45 kΩ', '51.6 kΩ']
    ans: 0
    why: 'R_xy = h/νe² = 25.81 kΩ / 2 = 12.9 kΩ, while R_xx drops to zero.'
  - q: 'Cyclotron resonance at frequency ω in a field B measures'
    choices: ['the effective mass m* = eB/ω', 'the carrier density', 'the relaxation time', 'the band gap']
    ans: 0
    why: 'Carriers circle at ω_c = eB/m*. The resonance needs ω_cτ = μB > 1 but its position depends only on m*.'
sources:
  - 'N. W. Ashcroft and N. D. Mermin, Solid State Physics (1976), chapters 12, 14 and 28'
  - 'C. Kittel, Introduction to Solid State Physics, 8th ed. (2005), chapters 8 and 14'
  - 'S. M. Sze and K. K. Ng, Physics of Semiconductor Devices, 3rd ed. (2007), chapter 1'
  - 'GATE Physics (PH) syllabus, solid state physics section, published by the organising institute each year'
---

**Module 7 · about 55 minutes.** By the end you will be able to compute carrier densities with the right density-of-states masses, follow an n-type sample from freeze-out to intrinsic behaviour, explain the Mott transition, combine scattering rates, extract carrier type, density and mobility from Hall and magnetoresistance data (with one or two kinds of carrier), and read cyclotron resonance, Shubnikov-de Haas and quantum Hall measurements. Doping, the law of mass action, the Fermi level and the single-carrier Hall effect are in the [IIT JAM semiconductors lesson](/learn/courses/iit-jam-physics/semiconductors/), and junctions in the [JAM diodes lesson](/learn/courses/iit-jam-physics/diodes/); bands and effective masses come from [lesson 7.7](/learn/courses/gate-physics/band-theory/).

<div class="bigidea">A semiconductor's carriers sit at the edges of nearly empty or nearly full bands, so they behave like a dilute classical gas of particles with effective masses. A magnetic field bends their paths: the sideways Hall voltage counts them and gives their sign, the curving itself measures their mass, and in two dimensions at low temperature it quantises the Hall resistance to h/νe².</div>

## 1. Counting carriers properly

For a parabolic band, integrating `$g(E)f(E)$` with the Boltzmann tail gives

```math
n = N_ce^{-(E_c - E_F)/k_BT}, \qquad N_c = 2\left(\frac{m_d^*k_BT}{2\pi\hbar^2}\right)^{3/2} = 2.51\times10^{19}\left(\frac{m_d^*}{m_e}\right)^{3/2}\left(\frac{T}{300\text{ K}}\right)^{3/2}\text{ cm}^{-3}
```

and the same for holes with `$N_v$`. The **density-of-states mass** `$m_d^*$` must count every valley: for `$N_v$` ellipsoidal valleys `$m_d^* = N_v^{2/3}(m_lm_t^2)^{1/3}$`. Silicon (six valleys, `$m_l = 0.98$`, `$m_t = 0.19$`) has `$m_d^* = 6^{2/3}\times0.328 = 1.08m_e$`, while its conductivity mass is `$0.26m_e$`. Use the first for `$N_c$`, the second for mobility.

Setting `$n = p$` puts the intrinsic level slightly off centre:

```math
E_i = \frac{E_c + E_v}{2} + \frac34k_BT\ln\frac{m_h^*}{m_e^*}
```

For silicon (`$m_e^* = 1.08$`, `$m_h^* = 0.56$`) at 300 K, `$E_i$` lies 12.7 meV below mid-gap.

<div class="meaning">

<dl>
<dt>N_c, N_v</dt><dd>effective densities of states: the number of band-edge states that would give the same n or p; they grow as T<sup>3/2</sup></dd>
<dt>m_d*</dt><dd>density-of-states mass, includes valley degeneracy; it sets how many carriers fit near the edge</dd>
<dt>m_c*</dt><dd>conductivity mass, the average of inverse masses; it sets how fast carriers respond</dd>
<dt>Physical meaning</dt><dd>Heavier bands have more states near their edge, so they need less help from the Fermi level to hold the same number of carriers.</dd>
</dl>

</div>

## 2. From freeze-out to intrinsic

Follow an n-type sample (donors `$N_d$`, binding energy `$E_d$`) as it warms:

Heat the crystal in the picture and compare gaps to see why intrinsic carriers take over.

<figure class="fig" data-fig="@sx-band-fill"><figcaption>Raise T: n<sub>i</sub> ∝ T<sup>3/2</sup>e<sup>−E<sub>g</sub>/2kT</sup> climbs steeply. A bigger gap needs a much higher temperature to matter.</figcaption></figure>

<div class="steps">
<div class="step">

**Freeze-out.** Most electrons sit on donors. Uncompensated: `$n \approx \sqrt{N_cN_d/2}\,e^{-E_d/2k_BT}$` and `$E_F \to E_c - E_d/2$` as `$T \to 0$`. With a few compensating acceptors `$N_a$` and `$n \ll N_a$`: `$n \approx \dfrac{N_d - N_a}{2N_a}N_ce^{-E_d/k_BT}$`, the full `$E_d$`, because `$E_F$` is pinned at the donor level.

</div>
<div class="step">

**Saturation.** All donors are ionised: `$n \approx N_d - N_a$`, almost independent of `$T$`, and `$E_F = E_c - k_BT\ln(N_c/n)$` drifts down slowly.

</div>
<div class="step">

**Intrinsic.** `$n_i = \sqrt{N_cN_v}\,e^{-E_g/2k_BT}$` overtakes the doping; `$\ln n$` against `$1/T$` has slope `$-E_g/2k_B$` and `$E_F$` approaches `$E_i$`.

</div>
</div>

**The Mott transition.** Hydrogen-like donors have an effective Bohr radius `$a^* = a_0\varepsilon_r(m_e/m^*)$`, nanometres instead of 0.05 nm. When donor orbits overlap, at roughly `$n_c^{1/3}a^* = 0.26$`, the electrons no longer freeze out and the semiconductor conducts at `$T = 0$`. For germanium (`$\varepsilon_r = 16$`, `$m^* = 0.12m_e$`), `$a^* = 7.1$` nm and `$n_c = 5\times10^{16}$` cm⁻³.

## 3. Mobility and the Hall factor

Independent scattering processes add rates (Matthiessen's rule): `$1/\mu = 1/\mu_L + 1/\mu_I$`. Acoustic phonons give `$\mu_L \propto T^{-3/2}$` (more phonons, faster carriers); ionised impurities give `$\mu_I \propto T^{3/2}$` (fast carriers are deflected less). The total peaks in between.

When `$\tau$` depends on energy, the Hall coefficient picks up a factor `$r_H = \langle\tau^2\rangle/\langle\tau\rangle^2$`: `$R_H = -r_H/ne$`. For acoustic-phonon scattering `$r_H = 3\pi/8 = 1.18$`; for ionised impurities `$315\pi/512 = 1.93$`; for degenerate metals 1. So the **Hall mobility** `$\mu_H = |R_H|\sigma = r_H\mu$` overstates the drift mobility: a measured 1400 cm²/V s with phonon scattering means `$\mu = 1188$` cm²/V s.

## 4. The Hall effect with one and two kinds of carrier

Current `$I$` along `$x$`, field `$B$` along `$z$`. Electrons drifting along `$-x$` and holes along `$+x$` are both pushed towards `$-y$`; the sign of the charge that piles up there, and of the Hall voltage, tells you which carrier you have.

<figure class="fig" data-fig="hall-sign"><figcaption>A Hall bar with current to the right and B out of the page. Both electrons and holes are deflected to the bottom edge, so the bottom becomes negative for n-type and positive for p-type: the Hall voltage reverses sign. The readout gives V_H = IB/net for the chosen density. With both carriers present (b = μ_e/μ_h = 3) the electrons win even in equal numbers.</figcaption></figure>

Watch the Hall field build up and settle in the next picture.

<figure class="fig" data-fig="@sx-hall-bar"><figcaption>Charge piles up on one edge until the electric force cancels the magnetic force; then V<sub>H</sub> = IB/(nqt) stays. Change the carrier type and the sign flips.</figcaption></figure>

For one carrier, `$V_H = IB/(net)$` and in a 2D sheet `$V_H = IB/n_se$`, independent of the sample size. With electrons and holes together, adding the two conductivity tensors gives, at weak field,

```math
R_H = \frac{p\mu_h^2 - n\mu_e^2}{e(p\mu_h + n\mu_e)^2}
```

Each carrier counts with its mobility squared. Consequences examiners love:

- An intrinsic sample with `$b = \mu_e/\mu_h > 1$` has `$R_H = \dfrac{1 - b}{(1 + b)en_i} < 0$`.
- A p-type sample heated into the intrinsic range changes the sign of `$R_H$`, passing through zero when `$p = b^2n$`. With `$b = 3$` this happens at `$n_i = \tfrac38N_a$`.
- Holes can outnumber electrons four to one and still give a negative `$R_H$`.

**Worked example.** `$n = 10^{21}$` m⁻³ with `$\mu_e = 0.40$`, `$p = 4\times10^{21}$` m⁻³ with `$\mu_h = 0.10$` m²/V s. Numerator `$4\times10^{21}\times0.01 - 10^{21}\times0.16 = -1.2\times10^{20}$`; denominator `$e(8\times10^{20})^2 = 1.03\times10^{23}$`. `$R_H = -1.17\times10^{-3}$` m³/C.

<div class="problem" data-problem="shl-two-carrier"></div>

**Magnetoresistance.** With one carrier the Hall field exactly cancels the Lorentz force: no magnetoresistance. With two, it cannot cancel both, and `$\rho_{xx}$` rises; a compensated material (`$n = p$`) has `$\Delta\rho/\rho_0 = \mu_e\mu_hB^2$` without limit. In a Corbino disc no Hall field can form at all, and even one carrier gives `$R(B)/R(0) = 1 + (\mu B)^2$`, a neat way to measure mobility.

## 5. Quantised orbits: cyclotron resonance, Landau levels and the quantum Hall effect

Carriers circle at `$\omega_c = eB/m^*$`. Microwaves at `$\omega = \omega_c$` are absorbed (cyclotron resonance), provided the orbit completes before scattering: `$\omega_c\tau = \mu B > 1$`. With 24 GHz and resonance at 0.30 T, `$m^* = eB/\omega = 0.35m_e$`. For an ellipsoidal valley the cyclotron mass depends on direction: `$m_t$` with `$\mathbf B$` along the valley axis, `$\sqrt{m_lm_t}$` perpendicular to it.

Quantum mechanically the orbits are **Landau levels**:

```math
E = \left(j + \tfrac12\right)\hbar\omega_c + \frac{\hbar^2k_z^2}{2m^*}, \qquad \text{each 2D level holds } \frac{eB}{h} \text{ states per unit area per spin}
```

For GaAs at 10 T, `$\hbar\omega_c = 17$` meV. The filling factor `$\nu = n_sh/eB$` counts filled levels (per spin).

- **Shubnikov-de Haas.** As `$B$` changes, levels pass through `$E_F$` and the resistance oscillates periodically in `$1/B$`, with `$\Delta(1/B) = 2e/hn_s$` for spin-degenerate levels. A spacing of 0.050 T⁻¹ means `$n_s = 9.7\times10^{15}$` m⁻².
- **Integer quantum Hall effect.** In a clean 2D gas at low temperature, whenever `$E_F$` lies among localised states between levels, `$R_{xx} = 0$` and

```math
R_{xy} = \frac{h}{\nu e^2} = \frac{25\,812.8\ \Omega}{\nu}
```

to parts in `$10^{10}$`, whatever the sample's size or impurities. Disorder is needed: it supplies the localised states that make the plateaus wide. On a plateau both `$\rho_{xx}$` and `$\sigma_{xx}$` vanish, because the resistivity tensor is not diagonal.

**Worked example (Hall bar).** A 2D gas gives `$R_{xy} = 1.25$` kΩ at 2.0 T (classical regime) and 25 Ω per square at zero field. Then `$n_s = B/eR_{xy} = 1.0\times10^{16}$` m⁻² and `$\mu = R_{xy}/(BR_\square) = 25$` m²/V s, a high-mobility heterostructure.

<div class="myth">

**"The sign of the Hall coefficient tells you the majority carrier."** Only with one carrier. With two, the more mobile one wins, weighted by `$\mu^2$`.

**"Quantum Hall plateaus need a perfect sample."** A perfectly clean sample has no plateaus at all: `$E_F$` would jump from one Landau level to the next. Localised states from disorder hold `$E_F$` between levels over a range of field.

</div>

<div class="keypoints">

- `$n = N_ce^{-(E_c - E_F)/k_BT}$`, `$N_c \propto (m_d^*T)^{3/2}$`, `$m_d^* = N_v^{2/3}(m_lm_t^2)^{1/3}$`; `$E_i$` offset `$\tfrac34k_BT\ln(m_h^*/m_e^*)$`.
- Freeze-out slope `$E_d/2$` (uncompensated) or `$E_d$` (compensated); Mott `$n_c^{1/3}a^* \approx 0.26$`.
- Matthiessen `$1/\mu = \sum1/\mu_i$`; `$\mu_L \propto T^{-3/2}$`, `$\mu_I \propto T^{3/2}$`; `$\mu_H = r_H\mu$`, `$r_H = 3\pi/8$` for phonons.
- Two carriers: `$R_H = (p\mu_h^2 - n\mu_e^2)/e(p\mu_h + n\mu_e)^2$`; sign reversal at `$p = b^2n$`; compensated MR `$\mu_e\mu_hB^2$`.
- `$\omega_c = eB/m^*$`, resonance needs `$\mu B > 1$`; Landau levels `$(j + \tfrac12)\hbar\omega_c$` with `$eB/h$` states per area per spin.
- SdH period `$\Delta(1/B) = 2e/hn_s$`; quantum Hall `$R_{xy} = h/\nu e^2$`, `$R_{xx} = 0$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="semiconductors-hall" data-exam="gate" data-n="10"></div>

**Next:** [lesson 7.9](/learn/courses/gate-physics/magnetism/) turns from orbits to spins. The [Hall effect](/science/hall-effect/) tool converts real Hall data into carrier density and mobility, and the [Carrier concentration](/science/carrier-concentration/) calculator solves for n, p and E_F at any doping and temperature. Back to the [GATE Physics course](/learn/courses/gate-physics/).

**Going on to CSIR NET?** [The quantum Hall effect and low-dimensional systems](/learn/courses/csir-net-physics/quantum-hall/) takes the Hall effect to two dimensions and strong fields.
