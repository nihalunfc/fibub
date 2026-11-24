---
title: Alpha, beta and gamma decay
summary: 'The physics behind each decay mode: alpha Q values and recoil, Gamow tunnelling and the Geiger-Nuttall law; beta decay in its three forms, Q values from atomic masses, the continuous spectrum, Fermi theory, Kurie plots, ft values and the allowed and forbidden selection rules; gamma multipolarity, selection rules, Weisskopf estimates, internal conversion, isomers and the Mössbauer effect.'
minutes: 55
updated: 2026-11-24
quiz:
  - q: 'Why does a 1 MeV increase in alpha-decay Q value shorten the half-life by many orders of magnitude?'
    choices: ['the tunnelling probability depends exponentially on the Gamow factor, which goes as Z/√Q', 'the alpha particle hits the barrier more often', 'the nucleus becomes smaller', 'the daughter recoils more']
    ans: 0
    why: 'The barrier penetration factor is exp(−2G) with 2G ≈ 2πZ_dα√(2m_αc²/Q) minus a radius correction. A small change in Q changes 2G by several units, so the probability changes by powers of ten; the knocking frequency changes only slightly.'
  - q: 'An allowed Gamow-Teller beta decay has'
    choices: ['ΔJ = 0 or ±1 (not 0 → 0) and no parity change', 'ΔJ = 0 only and a parity change', 'ΔJ = ±2 and a parity change', 'any ΔJ and no parity change']
    ans: 0
    why: 'Allowed decays carry no orbital angular momentum (l = 0), so parity is unchanged. The electron and neutrino spins couple to S = 1 for Gamow-Teller (ΔJ = 0, ±1, with 0 → 0 forbidden) or S = 0 for Fermi (ΔJ = 0).'
  - q: 'A 2⁺ excited state of an even-even nucleus decays to the 0⁺ ground state. The gamma ray is'
    choices: ['pure E2', 'E1', 'M1', 'a mixture of E1 and M2']
    ans: 0
    why: 'Angular momentum: L must be 2 exactly (|2 − 0| ≤ L ≤ 2 + 0). No parity change: an L = 2 electric transition has parity (−1)² = +, while M2 would need a parity change. So pure E2.'
sources:
  - 'K. S. Krane, Introductory Nuclear Physics (1988), chapters 8, 9 and 10'
  - 'G. Gamow, Zur Quantentheorie des Atomkernes, Zeitschrift für Physik 51, 204 (1928)'
  - 'E. Fermi, Versuch einer Theorie der β-Strahlen, Zeitschrift für Physik 88, 161 (1934)'
  - 'National Nuclear Data Center, NuDat 3 (decay data), Brookhaven National Laboratory'
  - 'GATE Physics (PH) syllabus, Nuclear and Particle Physics section, published by the organising IIT each year'
---

**Module 8 · about 55 minutes.** The decay law `$N = N_0e^{-\lambda t}$`, half-lives, activity and decay chains are in the [JAM lesson on radioactivity](/learn/courses/iit-jam-physics/nuclei-radioactivity/). This lesson asks why each decay happens at the rate it does. The three modes are governed by three different forces, and that is why their half-lives range from `$10^{-17}$` s to `$10^{17}$` years.

<div class="bigidea">Alpha decay is quantum tunnelling through the Coulomb barrier, so its rate depends exponentially on the energy. Beta decay is the weak interaction turning a neutron into a proton (or back) and creating an electron and an antineutrino, which share the energy; its rate goes as the fifth power of the energy and is slowed by angular momentum the leptons must carry. Gamma decay is an electromagnetic transition between nuclear states, with selection rules on angular momentum and parity.</div>

## 1. Alpha decay: energy and tunnelling

`$^A_ZX \to {}^{A-4}_{Z-2}Y + \alpha$` is possible when `$Q_\alpha = [M_X - M_Y - M_{\text{He}}]c^2 > 0$` (atomic masses). From the [mass formula](/learn/courses/gate-physics/binding-energy-semf/), this holds for most nuclei above A ≈ 150, because `$^4$`He is so tightly bound (28.3 MeV). Momentum conservation shares `$Q$` between the alpha and the recoiling daughter:

```math
T_\alpha = Q_\alpha\frac{A-4}{A}, \qquad T_Y = Q_\alpha\frac{4}{A}
```

Alpha lines are sharp (two-body decay); several lines from one emitter reveal excited states of the daughter.

Watch the packet hit the barrier, then lower the energy, thicken the barrier, and raise E above the top.

<figure class="fig" data-fig="@qm-packet-barrier"><figcaption>When E < V₀ part of the wave still gets through (tunnelling), and part reflects even when E > V₀. A thicker barrier cuts the transmission sharply.</figcaption></figure>

**Gamow's theory (1928).** Inside the nucleus the alpha particle rattles back and forth; outside, it feels the Coulomb potential `$V(r) = 2Z_de^2/(4\pi\varepsilon_0r)$`, which at the nuclear surface is about 28 MeV, far above `$T_\alpha \approx 4$`–`$9$` MeV. Classically it can never escape; quantum mechanically it [tunnels](/learn/courses/gate-physics/one-dimensional-potentials/). The WKB transmission through the barrier from `$R$` to the turning point `$b = 2Z_de^2/(4\pi\varepsilon_0T_\alpha)$` is

```math
P = e^{-2G}, \qquad 2G = \frac2\hbar\int_R^b\sqrt{2m_\alpha\left[V(r) - T_\alpha\right]}\,dr = 2kb\left[\arccos\sqrt x - \sqrt{x(1-x)}\right], \quad x = \frac Rb,\ k = \frac{\sqrt{2m_\alpha T_\alpha}}\hbar
```

The decay constant is `$\lambda = fP$`, with knocking frequency `$f = v/2R \sim 10^{21}$` s⁻¹. For a thick barrier (`$x \ll 1$`), `$2G \approx 2\pi Z_d\alpha\sqrt{2m_\alpha c^2/T_\alpha} - 8\sqrt{Z_de^2m_\alpha R/(4\pi\varepsilon_0\hbar^2)}$`, which gives the **Geiger-Nuttall law**:

```math
\log_{10}t_{1/2} = a\,\frac{Z_d}{\sqrt{Q_\alpha}} + b
```

**Worked example.** `$^{238}$`U: `$Q_\alpha = 4.270$` MeV, so `$T_\alpha = 4.270\times234/238 = 4.198$` MeV and the recoil takes 72 keV. With `$R = 1.2(234^{1/3} + 4^{1/3}) = 9.30$` fm, the barrier peaks at `$2\times90\times1.44/9.30 = 27.9$` MeV and the turning point is at `$b = 61.7$` fm. Then `$2G = 90.2$` and `$P = 7\times10^{-40}$`. With `$f = 7.7\times10^{20}$` s⁻¹, `$t_{1/2} = \ln2/(fP) \approx 4\times10^{10}$` years, within a factor of ten of the measured `$4.47\times10^9$` years, from a model with no free parameters. Raising `$Q$` by 1 MeV would cut the half-life by a factor of about `$3\times10^7$`.

<figure class="fig" data-fig="gamow-alpha"><figcaption>The Geiger-Nuttall plot. Lines: Gamow-model half-lives against Q^(−1/2) for three parent elements; dots: measured half-lives of seven emitters, from ²¹²Po (0.3 μs) to ²³²Th (14 billion years). Slide Q to see the barrier, the Gamow factor and the half-life change.</figcaption></figure>

**Angular momentum.** If the alpha carries orbital angular momentum `$\ell$`, the centrifugal barrier `$\hbar^2\ell(\ell+1)/2mr^2$` adds to the Coulomb barrier and slows the decay: a few units of `$\ell$` cost a factor of ten or more. Parity requires `$\pi_i = \pi_f(-1)^\ell$`, so a `$0^+ \to 2^+$` alpha decay needs `$\ell = 2$`, and `$0^+ \to 1^+$` is forbidden altogether.

<div class="problem" data-problem="alpha-gamow"></div>

## 2. Beta decay

Three processes change Z by one at fixed A:

| Process | Basic step | Q value (atomic masses) |
|---|---|---|
| `$\beta^-$` | `$n \to p + e^- + \bar\nu_e$` | `$[M(Z) - M(Z+1)]c^2$` |
| `$\beta^+$` | `$p \to n + e^+ + \nu_e$` (only in nuclei) | `$[M(Z) - M(Z-1) - 2m_e]c^2$` |
| electron capture | `$p + e^- \to n + \nu_e$` | `$[M(Z) - M(Z-1)]c^2 - B_e$` |

**Worked example.** Tritium: `$Q = [3.016049 - 3.016029]\times931.494 = 18.6$` keV. The electron's end point is 18.6 keV (the recoil takes almost nothing), and the shape of the spectrum right at the end point is where experiments like KATRIN look for the neutrino mass.

**The continuous spectrum** puzzled physicists for years: a two-body decay would give one electron energy. Pauli (1930) proposed a light neutral particle sharing the energy and carrying spin ½ (also needed for angular momentum: `$n \to p + e^-$` alone would change total spin by ½). **Fermi's theory** (1934) treats the decay as a contact interaction of four fermions. Golden-rule rate with the lepton phase space:

```math
N(p)\,dp \propto |M_{fi}|^2\,F(Z, E_e)\,p^2(Q - T_e)^2\,dp, \qquad K(T_e) = \sqrt{\frac{N(p)}{p^2F(Z, E_e)}} \propto (Q - T_e)
```

<div class="meaning">

<dl>
<dt>`$p^2(Q - T_e)^2$`</dt><dd>the number of ways to share the energy: electron momentum states times neutrino momentum states (massless neutrino)</dd>
<dt>`$F(Z, E_e)$`</dt><dd>the Fermi function: the nuclear charge pulls electrons back (more slow electrons) and pushes positrons away (fewer slow positrons)</dd>
<dt>Kurie plot</dt><dd>`$K$` against `$T_e$` is a straight line hitting zero at `$Q$` for allowed decays; a neutrino mass would bend the last few eV</dd>
<dt>Sargent rule</dt><dd>integrating the spectrum gives a total rate `$\lambda \propto Q^5$` for `$Q \gg m_ec^2$`</dd>
</dl>

</div>

**Comparative half-lives.** The rate is `$\lambda = (\ln2/t_{1/2}) \propto |M_{fi}|^2 f(Z, Q)$`, where `$f$` is the integrated phase-space factor. So `$ft_{1/2}$` measures the inverse squared matrix element, free of the strong energy dependence. Values span many decades, quoted as `$\log_{10}ft$` (with `$t$` in seconds):

| Type | `$\Delta J$` | Parity change | `$\log ft$` |
|---|---|---|---|
| superallowed (`$0^+ \to 0^+$`, mirror) | 0 | no | 3 to 3.5 |
| allowed (Fermi or Gamow-Teller) | 0, ±1 | no | 4 to 6 |
| first forbidden | 0, ±1, ±2 | yes | 6 to 9 |
| second forbidden | ±2, ±3 | no | 10 to 13 |

**Allowed decays** carry no orbital angular momentum. If the electron and neutrino spins are antiparallel (S = 0), it is a **Fermi** transition: `$\Delta J = 0$`. If parallel (S = 1), **Gamow-Teller**: `$\Delta J = 0, \pm1$`, but not `$0 \to 0$`. Each unit of orbital angular momentum the leptons must carry suppresses the rate by about `$(pR/\hbar)^2 \sim 10^{-3}$`, because the lepton waves are much longer than the nucleus. The free neutron (`$\tfrac12^+ \to \tfrac12^+$`, mixed Fermi and Gamow-Teller) has `$\log ft \approx 3.0$`.

Press Play with 'One kind', then try 'Parent → daughter' and change the half-lives.

<figure class="fig" data-fig="@qm-decay-atoms"><figcaption>Every square decays at random, yet the counts trace the exponential. In a chain the daughter first rises and then follows the parent when the parent lives longer.</figcaption></figure>

**Parity violation.** In 1957 Wu's group polarised `$^{60}$`Co nuclei in a magnetic field and found electrons emitted mostly opposite to the nuclear spin: the mirror image of the experiment would give the opposite result, so the weak interaction is not mirror symmetric. Neutrinos are left-handed ([lesson 8.7](/learn/courses/gate-physics/conservation-laws/)).

## 3. Gamma decay

An excited nucleus drops to a lower state by emitting a photon of energy `$E_\gamma \approx E_i - E_f$` (minus a tiny recoil `$E_\gamma^2/2Mc^2$`). The photon carries angular momentum `$L \ge 1$` (no monopole photons) and has a definite character:

```math
|J_i - J_f| \le L \le J_i + J_f,\ L \ge 1; \qquad \text{E}L:\ \pi_i\pi_f = (-1)^L, \qquad \text{M}L:\ \pi_i\pi_f = (-1)^{L+1}
```

The lowest allowed multipole dominates, except that E(L+1) can compete with ML. **Weisskopf single-particle estimates** (E in MeV, rates in s⁻¹) show how steeply the rates fall with L:

```math
\lambda(\text{E1}) \approx 1.0\times10^{14}A^{2/3}E^3, \quad \lambda(\text{E2}) \approx 7.3\times10^{7}A^{4/3}E^5, \quad \lambda(\text{M1}) \approx 5.6\times10^{13}E^3
```

Each extra unit of L costs a factor of about `$(kR)^2 \sim 10^{-5}$` at 1 MeV. For A = 150 and a 100 keV transition: E1 `$3\times10^{12}$` s⁻¹, M1 `$6\times10^{10}$` s⁻¹, E2 `$6\times10^5$` s⁻¹. Real E2 rates in deformed nuclei are 100 times faster than the estimate (collective motion), and E1 rates are often slower.

**Worked example.** A `$\tfrac32^-$` state decays to a `$\tfrac12^+$` ground state. Possible L: 1 or 2. Parity changes, so L = 1 is E1 and L = 2 is M2. The transition is almost pure E1. If instead the levels were `$\tfrac92^+$` and `$\tfrac12^-$`, the lowest allowed multipole would be L = 4 with a parity change: M4, which at low energy takes seconds to years. That is an **isomer**, and section 3 of the [shell-model lesson](/learn/courses/gate-physics/shell-model/) shows why they cluster below magic numbers.

**Internal conversion.** The nucleus can instead give its energy directly to an atomic electron, which leaves with `$E_i - E_f - B_e$`. The conversion coefficient `$\alpha = \lambda_e/\lambda_\gamma$` grows with Z and L and falls with energy. A `$0^+ \to 0^+$` transition cannot emit a single photon at all; it goes by conversion (or pair creation above 1.022 MeV).

**The Mössbauer effect.** A free `$^{57}$`Fe nucleus emitting the 14.4 keV gamma recoils with `$E_\gamma^2/2Mc^2 = 2$` meV, far more than the line width `$\hbar/\tau = 5\times10^{-9}$` eV, so emission and absorption lines do not overlap. Bound in a crystal, a fraction of decays transfer the recoil to the whole lattice (no phonon created), and the line is unshifted. Its sharpness (one part in `$10^{12}$`) measures hyperfine fields, chemical shifts and even the gravitational red shift over 22.5 m (Pound and Rebka, 1960).

The fraction of recoil-free events is the **Lamb-Mössbauer factor** `$f = \exp(-k^2\langle x^2\rangle)$`, with `$k = E_\gamma/\hbar c$` and `$\langle x^2\rangle$` the mean square vibration of the nucleus along the beam. It is large for tightly bound atoms, low temperatures and low-energy gammas (which is why only a few isotopes work). In practice the source is moved with velocity `$v$` to Doppler-shift its line by `$E_\gamma v/c$` and scan across the absorber's line. The spectrum then shows the isomer (chemical) shift, the electric quadrupole splitting (2 lines for ⁵⁷Fe, spin ³⁄₂ to ¹⁄₂) and the magnetic splitting (6 lines in a ferromagnet such as iron, where the internal field is about 33 T).

**Worked example.** The numbers for ⁵⁷Fe (14.4 keV, mean life 141 ns, `$Mc^2 = 57\times931.5$` MeV `$= 53.1$` GeV).

1. Free recoil: `$E_R = E_\gamma^2/2Mc^2 = (14.4\times10^3)^2/(2\times53.1\times10^9) = 1.95\times10^{-3}$ eV`.
2. Natural width: `$\Gamma = \hbar/\tau = 6.58\times10^{-16}\ \text{eV s}/1.41\times10^{-7}\ \text{s} = 4.67\times10^{-9}$ eV`. So `$E_R/\Gamma = 4\times10^5$`: in a free atom the emission and absorption lines miss each other by 400 000 line widths.
3. A velocity that shifts the line by one width: `$v = c\,\Gamma/E_\gamma = 3\times10^8\times4.67\times10^{-9}/14\,400 = 0.097$ mm/s`. Lines are scanned with speeds of a few mm/s, which is why the method needs only a moving carriage.
4. Gravity: over `$h = 22.5$` m, `$\Delta E/E = gh/c^2 = 9.81\times22.5/(3\times10^8)^2 = 2.5\times10^{-15}$`, only 0.8 % of `$\Gamma/E_\gamma = 3.2\times10^{-13}$`. Pound and Rebka measured this tiny fraction of a line width.

<div class="myth">

**"A heavier nucleus or a bigger Q always means a faster beta decay, and gamma decay is always instant."** Beta rates depend on the matrix element as much as on Q: a forbidden transition with large Q can be slower than an allowed one with small Q, which is why the ft value is used. And gamma decay is fast only for low multipolarity: an M4 or E5 transition at low energy can last for years (`$^{180m}$`Ta has never been seen to decay at all).

</div>

<div class="keypoints">

- Alpha: `$T_\alpha = Q(A-4)/A$`; `$\lambda = (v/2R)e^{-2G}$`, `$2G \approx 2\pi Z_d\alpha\sqrt{2m_\alpha c^2/T}$` minus a radius term; Geiger-Nuttall `$\log t_{1/2} = aZ_d/\sqrt Q + b$`; parity `$(-1)^\ell$`.
- Beta Q values (atomic masses): `$\beta^-$` `$\Delta M c^2$`, `$\beta^+$` `$\Delta Mc^2 - 2m_ec^2$`, EC `$\Delta Mc^2$`.
- Spectrum `$\propto F(Z, E)p^2(Q - T)^2$`; Kurie plot linear for allowed decays; total rate `$\propto Q^5$`.
- Allowed: no parity change, Fermi `$\Delta J = 0$`, Gamow-Teller `$\Delta J = 0, \pm1$` (no `$0 \to 0$`); `$\log ft$` 3 to 6; each forbiddenness order adds about 3 to `$\log ft$`.
- Gamma: `$|J_i - J_f| \le L \le J_i + J_f$`, `$L \ge 1$`; EL parity `$(-1)^L$`, ML `$(-1)^{L+1}$`; rates fall by about `$10^{-5}$` per unit of L.
- Internal conversion competes with gamma emission, and is the only way for `$0^+ \to 0^+$`; Mössbauer: recoil-free emission in a lattice.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="radioactive-decays" data-exam="gate" data-n="10"></div>

**Next:** [lesson 8.5](/learn/courses/gate-physics/nuclear-reactions/) moves from nuclei that fall apart on their own to nuclei we hit with beams: Q values, thresholds, cross-sections and resonances.
