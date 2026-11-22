---
title: Elementary particles and quarks
summary: 'The particle zoo sorted out: leptons, hadrons and gauge bosons, the range of a force from the mass it exchanges, quark flavours and their quantum numbers, isospin and the Gell-Mann-Nishijima relation, the baryon octet and decuplet with the Omega-minus prediction, meson nonets, colour (the Delta++ puzzle and the R ratio), quark-model magnetic moments, widths and lifetimes, decay kinematics and invariant mass, and the Standard Model.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'The Δ⁺⁺ (uuu) has spin 3/2 and is the lightest state with this content. Why does it need a new quantum number?'
    choices: ['three identical u quarks with parallel spins in an s state would be symmetric, against the Pauli principle; an antisymmetric colour part fixes it', 'its charge is +2', 'it decays strongly', 'it has strangeness']
    ans: 0
    why: 'Space (all l = 0), spin (all up) and flavour (uuu) are each symmetric, so the total would be symmetric for identical fermions. Giving each quark a different colour, in the antisymmetric colour singlet, restores overall antisymmetry.'
  - q: 'Using Q = I₃ + Y/2 with Y = B + S, a baryon with I₃ = −½ and S = −2 has charge'
    choices: ['−1', '0', '+1', '−2']
    ans: 0
    why: 'Y = 1 + (−2) = −1, so Q = −½ − ½ = −1. This is the Ξ⁻ (dss).'
  - q: 'The ratio R = σ(e⁺e⁻ → hadrons)/σ(e⁺e⁻ → μ⁺μ⁻) well above the b-quark threshold but below the top threshold is about'
    choices: ['11/3', '2', '10/3', '5']
    ans: 0
    why: 'R = N_c Σ Q_q² over the quarks that can be made: u, d, s, c, b give 3 × (4/9 + 1/9 + 1/9 + 4/9 + 1/9) = 11/3. Without the factor of 3 for colour it would be 11/9, far below the data.'
sources:
  - 'D. Griffiths, Introduction to Elementary Particles, 2nd ed. (2008), chapters 1, 2, 5 and 9'
  - 'B. R. Martin and G. Shaw, Particle Physics, 4th ed. (2017), chapters 3 to 6'
  - 'Particle Data Group, Review of Particle Physics, Progress of Theoretical and Experimental Physics 2024, 083C01'
  - 'GATE Physics (PH) syllabus, Nuclear and Particle Physics section, published by the organising IIT each year'
---

**Module 8 · about 55 minutes.** By the 1960s accelerators had found hundreds of "elementary" particles. This lesson shows how they fall into patterns, why those patterns point to quarks, and how the Standard Model organises everything we know into a dozen matter particles and a handful of force carriers. The [conservation laws](/learn/courses/gate-physics/conservation-laws/) that decide which processes happen come in lesson 8.7.

<div class="bigidea">Matter is made of two kinds of spin-½ fermions: leptons, which feel no strong force, and quarks, which come in three colours and are never seen alone. Quarks combine into colourless hadrons: baryons (qqq) and mesons (qq̄). Forces come from exchanging spin-1 bosons: photon, W and Z, and eight gluons. The patterns of hadron charges, masses and moments follow from the quark contents, and the lifetimes tell which force is acting.</div>

## 1. Classification and the range of forces

| Family | Members | Spin | Feels |
|---|---|---|---|
| leptons | `$e, \mu, \tau$` and `$\nu_e, \nu_\mu, \nu_\tau$` | ½ | weak, and EM if charged |
| quarks | `$u, d, s, c, b, t$`, each in 3 colours | ½ | strong, EM, weak |
| gauge bosons | `$\gamma$`; `$W^\pm, Z^0$`; 8 gluons | 1 | they carry the forces |
| Higgs boson | `$H$` (125 GeV) | 0 | gives masses to W, Z and fermions |

**Hadrons** are bound states of quarks: **baryons** (three quarks, half-integer spin, baryon number 1) and **mesons** (quark and antiquark, integer spin, baryon number 0). The proton is the only stable hadron; the free neutron lives 15 minutes.

**Yukawa's argument.** A force carried by a particle of mass `$m$` can borrow energy `$mc^2$` for a time `$\hbar/mc^2$`, so it reaches about

```math
R \approx \frac{\hbar}{mc} = \frac{\hbar c}{mc^2}
```

For the nuclear force, `$R \approx 1.4$` fm gave Yukawa (1935) a predicted mass near 140 MeV: the pion, found in 1947. The photon is massless, so electromagnetism has infinite range; the W (80.4 GeV) gives the weak force a range of `$2.5\times10^{-3}$` fm, which is why it looks weak at low energy. (Gluons are massless too, but confinement cuts the strong force off at about 1 fm in a different way.)

## 2. Quarks and their quantum numbers

| Quark | Charge | Flavour number | Mass (approx.) |
|---|---|---|---|
| `$u$`, `$d$` | `$+\tfrac23$`, `$-\tfrac13$` | isospin `$I_3 = \pm\tfrac12$` | 2 to 5 MeV (bare) |
| `$s$` | `$-\tfrac13$` | strangeness `$S = -1$` | 95 MeV |
| `$c$` | `$+\tfrac23$` | charm `$C = +1$` | 1.27 GeV |
| `$b$` | `$-\tfrac13$` | bottomness `$B' = -1$` | 4.18 GeV |
| `$t$` | `$+\tfrac23$` | topness `$T = +1$` | 173 GeV |

Each quark has baryon number `$\tfrac13$`; antiquarks have every additive number reversed. Inside a light hadron, quarks act as **constituent quarks** of about 340 MeV (`$u, d$`) and 500 MeV (`$s$`), the bare mass dressed by the gluon field.

**Isospin and the Gell-Mann-Nishijima relation.** The strong force treats `$u$` and `$d$` alike, so hadrons come in charge multiplets of nearly equal mass: (p, n) with `$I = \tfrac12$`, `$(\pi^+, \pi^0, \pi^-)$` with `$I = 1$`, four `$\Delta$` states with `$I = \tfrac32$`. Within a multiplet the charge is fixed by `$I_3$` and the hypercharge `$Y = B + S$` (plus `$C + B' + T$` for heavy flavours):

```math
Q = I_3 + \frac Y2
```

**Worked example.** The `$\Sigma^-$` has `$Q = -1$`, `$B = 1$`, `$S = -1$`: `$Y = 0$`, so `$I_3 = -1$`, the bottom member of an `$I = 1$` triplet (`$\Sigma^+, \Sigma^0, \Sigma^-$` = uus, uds, dds). Each `$d$` replacing a `$u$` lowers `$I_3$` by 1 and `$Q$` by 1.

<figure class="fig" data-fig="quark-builder"><figcaption>Build a hadron from up to three quarks and antiquarks. The readout adds up charge, baryon number and the flavour numbers, says whether the combination can be a colour singlet, and names the known hadron with that content.</figcaption></figure>

## 3. The eightfold way

Plotting light hadrons of the same `$J^P$` by strangeness against `$I_3$` gives the patterns of SU(3) flavour symmetry (Gell-Mann and Ne'eman, 1961):

- **Baryon octet** `$\tfrac12^+$`: p, n; `$\Lambda$`, `$\Sigma^{+,0,-}$`; `$\Xi^0, \Xi^-$`.
- **Baryon decuplet** `$\tfrac32^+$`: four `$\Delta$` (S = 0), three `$\Sigma^*$` (−1), two `$\Xi^*$` (−2) and one `$\Omega^-$` (−3).
- **Meson nonets**: pseudoscalar `$0^-$` (`$\pi$`, K, `$\bar K$`, `$\eta$`, `$\eta'$`) and vector `$1^-$` (`$\rho$`, `$K^*$`, `$\omega$`, `$\phi$`); `$q\bar q$` from three flavours gives `$3\times3 = 8 + 1$`.

**Worked example: the `$\Omega^-$` prediction.** Decuplet masses rise by nearly equal steps per unit of strangeness: `$\Delta$` 1232, `$\Sigma^*$` 1385, `$\Xi^*$` 1533 MeV (steps of about 150 MeV, the extra mass of an `$s$` quark). In 1962 Gell-Mann predicted the missing corner at about 1680 MeV, with `$S = -3$`, charge `$-1$` and a weak decay (nothing lighter with `$S = -3$` exists for it to decay into strongly). It was found at Brookhaven in 1964 at 1672 MeV, via `$K^-p \to \Omega^-K^+K^0$`.

## 4. Colour

Two puzzles demanded a new quantum number with three values:

- **The `$\Delta^{++}$`** (uuu, `$J = \tfrac32$`) has three identical quarks with parallel spins in a spatially symmetric ground state, which the Pauli principle forbids. If each quark carries a different **colour** and the colour wave function is antisymmetric (the colour singlet `$\epsilon_{ijk}q^iq^jq^k$`), the total is antisymmetric.
- **The R ratio.** In `$e^+e^- \to q\bar q$` each quark type contributes in proportion to its charge squared, once per colour:

```math
R = \frac{\sigma(e^+e^- \to \text{hadrons})}{\sigma(e^+e^- \to \mu^+\mu^-)} = N_c\sum_qQ_q^2 = \begin{cases}2 & u, d, s\\ \tfrac{10}3 & +\,c\\ \tfrac{11}3 & +\,b\end{cases}
```

The data sit on the `$N_c = 3$` steps (with small QCD corrections). All free hadrons are colour singlets: that is why we see `$qqq$` and `$q\bar q$` but never `$qq$` or a lone quark. The force between colour charges is carried by eight coloured gluons (SU(3) has `$3^2 - 1 = 8$` generators); because gluons themselves carry colour, the force grows with distance (confinement) and weakens at short distance (asymptotic freedom).

## 5. Magnetic moments from quarks

In the ground-state baryons the quarks are in s waves, so the moment is the sum of the quark spin moments, weighted by the spin-flavour wave function. For the proton and neutron:

```math
\mu_p = \tfrac13(4\mu_u - \mu_d), \qquad \mu_n = \tfrac13(4\mu_d - \mu_u), \qquad \mu_q = \frac{Q_qe\hbar}{2m_q}
```

With equal `$u$` and `$d$` masses, `$\mu_u = -2\mu_d$`, so `$\mu_p = -3\mu_d$`, `$\mu_n = 2\mu_d$` and **`$\mu_p/\mu_n = -\tfrac32$`**. Measured: `$2.793/(-1.913) = -1.46$`. A constituent mass of 336 MeV gives `$\mu_p = 2.79\,\mu_N$` exactly. This was one of the first strong signs that quarks are real.

## 6. Widths, lifetimes and decays

A state that decays has an energy width `$\Gamma = \hbar/\tau$`. Strong decays give `$\Gamma$` of tens to hundreds of MeV (`$\Delta$`: 117 MeV, `$\tau = 5.6\times10^{-24}$` s), seen as a bump in an invariant-mass plot. Electromagnetic decays live `$10^{-20}$` to `$10^{-16}$` s; weak decays `$10^{-13}$` s and longer, seen as tracks.

**Kinematics.** For a decay at rest `$M \to m_1 + m_2$`, each product has momentum

```math
p^* = \frac{\sqrt{[M^2 - (m_1 + m_2)^2][M^2 - (m_1 - m_2)^2]}}{2M}c, \qquad M^2c^4 = (E_1 + E_2)^2 - |\vec p_1 + \vec p_2|^2c^2
```

<div class="meaning">

<dl>
<dt>`$p^*$`</dt><dd>fixed by the three masses alone: a two-body decay at rest gives a single sharp momentum, unlike three-body decays such as beta decay</dd>
<dt>`$m_2 = 0$`</dt><dd>the formula reduces to `$p^* = (M^2 - m_1^2)c/2M$` (for example `$\pi \to \mu\nu$`: 29.8 MeV/c)</dd>
<dt>`$M$` from products</dt><dd>`$(E_1 + E_2)^2 - |\vec p_1 + \vec p_2|^2c^2$` is Lorentz invariant, so it equals `$M^2c^4$` in the lab as well as at rest</dd>
</dl>

</div>

The second formula, the **invariant mass**, works in any frame: combine the measured energies and momenta of the decay products and a resonance shows up as a peak at its mass, however fast it was moving.

**Worked example.** `$\Lambda \to p\pi^-$` at rest (1115.7 → 938.3 + 139.6 MeV): `$p^* = 100.6$` MeV/c. The proton takes `$E_p = \sqrt{938.3^2 + 100.6^2} = 943.6$` MeV, the pion 172.0 MeV: unequal energies, equal momenta.

<div class="problem" data-problem="invariant-mass"></div>

**Patterns worth knowing.** The `$\phi$` (`$s\bar s$`, 1019 MeV) decays 83% to `$K\bar K$` though `$3\pi$` has far more phase space: the **OZI rule** suppresses decays where the quark lines of the initial state must annihilate. The same rule makes the `$J/\psi$` (`$c\bar c$`, below the `$D\bar D$` threshold) narrow, 93 keV. Weak decays change flavour through the W, most easily within a generation; changing generation costs `$\sin\theta_C$` in amplitude (Cabibbo angle `$\theta_C \approx 13°$`), which is why strange particles decay slowly. Neutrinos of definite flavour are mixtures of mass states and oscillate, `$P = \sin^22\theta\sin^2(1.27\,\Delta m^2L/E)$` (`$\Delta m^2$` in eV², L in km, E in GeV), which shows that neutrinos have mass.

<div class="myth">

**"The proton's mass is the sum of its three quark masses."** The bare `$u$` and `$d$` masses add up to about 9 MeV, 1% of the proton mass. The other 99% is the energy of the gluon field and the motion of the confined quarks, `$E = mc^2$` at work. Constituent masses of about 340 MeV are a useful bookkeeping device for this, not the quarks' true masses.

</div>

<div class="keypoints">

- Leptons (no strong force), quarks (3 colours, confined), gauge bosons (spin 1), Higgs (spin 0); baryons `$qqq$`, mesons `$q\bar q$`.
- Range `$R = \hbar c/mc^2$`: pion 1.41 fm, W `$2.5\times10^{-3}$` fm.
- `$Q = I_3 + Y/2$`, `$Y = B + S$` (+ heavy flavours); `$s$` has `$S = -1$`, antiquarks reverse everything.
- Octet `$\tfrac12^+$`, decuplet `$\tfrac32^+$` with equal spacing and the `$\Omega^-$` (sss, 1672 MeV); nonets `$0^-$`, `$1^-$`.
- Colour: `$\Delta^{++}$` and Pauli; `$R = N_c\sum Q_q^2$` = 2, 10/3, 11/3; 8 gluons; only colour singlets are free.
- `$\mu_p/\mu_n = -\tfrac32$` in the quark model (measured −1.46).
- `$\tau = \hbar/\Gamma$`; strong `$10^{-23}$` s, EM `$10^{-20}$`–`$10^{-16}$` s, weak `$\ge10^{-13}$` s; `$p^*$` and invariant mass formulas.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="particles-quarks" data-exam="gate" data-n="10"></div>

**Next:** [lesson 8.7](/learn/courses/gate-physics/conservation-laws/) collects the conservation laws and symmetries that decide which of all these processes can happen, and through which force.
