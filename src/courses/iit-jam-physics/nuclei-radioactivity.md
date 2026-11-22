---
title: Nuclei, binding energy and radioactivity
seoTitle: Nuclei, binding energy and radioactivity for IIT JAM
summary: 'How big and how dense nuclei are, where binding energy comes from and why the binding energy per nucleon curve peaks near iron, the liquid-drop mass formula, alpha, beta and gamma decay with their Q values, the decay law, half-life and activity, decay chains and radioactive dating.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A sample has a half-life of 8 days. What fraction of it remains after 24 days?'
    choices: ['1/8', '1/3', '0', '1/24']
    ans: 0
    why: '24 days is three half-lives, so (1/2)³ = 1/8 remains. Decay is exponential, so the sample never quite runs out.'
  - q: 'Why do both the fission of uranium and the fusion of hydrogen release energy?'
    choices: ['Both make products with a larger binding energy per nucleon, closer to the peak near iron', 'Both destroy some protons', 'Both convert neutrons into energy', 'Fission releases energy, but fusion really absorbs it']
    ans: 0
    why: 'The binding energy per nucleon rises from light nuclei to a peak near A ≈ 60 and falls slowly beyond. Moving towards the peak from either side releases the difference as energy.'
  - q: 'Using atomic masses, what must M(Z, A) − M(Z − 1, A) exceed for β⁺ decay to be possible?'
    choices: ['2mₑc² = 1.022 MeV', 'zero', 'mₑc² = 0.511 MeV', '931.5 MeV']
    ans: 0
    why: 'A positron is created and the daughter atom has one electron too many, so two electron masses must be supplied. Electron capture needs only a positive difference.'
sources:
  - 'K. S. Krane, Introductory Nuclear Physics (Wiley, 1988), chapters 3, 6 to 10'
  - 'A. Beiser, Concepts of Modern Physics, 6th ed. (2003), chapters 11 and 12'
  - 'B. R. Martin, Nuclear and Particle Physics: An Introduction, 2nd ed. (2009), chapters 2 and 7'
  - 'Atomic masses: the Atomic Mass Evaluation (AME 2020), M. Wang et al., Chinese Physics C 45, 030003 (2021)'
  - 'IIT JAM Physics syllabus (Modern Physics section), published by the organising IIT each year'
---

**Module 6 · about 50 minutes.** By the end you will be able to estimate the size and density of any nucleus, compute binding energies from atomic masses without the electron-mass slip, read the binding energy curve and explain it with the liquid-drop model, work out Q values and energies for alpha and beta decays, and handle the decay law, activities, branching, decay chains and dating problems.

<div class="bigidea">A nucleus weighs less than the protons and neutrons in it; that missing mass is the binding energy, and nuclei rearrange themselves (by decay, fission or fusion) whenever they can become more tightly bound.</div>

## 1. What a nucleus is made of

A nucleus has `$Z$` protons and `$N$` neutrons, `$A = Z + N$` nucleons in all, written `${}^A_Z\text{X}$`. Nuclei with the same `$Z$` are **isotopes** (same element), with the same `$A$` **isobars**, with the same `$N$` **isotones**.

Scattering experiments show that nuclei are nearly uniform spheres whose volume grows in proportion to `$A$`:

```math
R = R_0A^{1/3}, \qquad R_0 \approx 1.2\text{ fm} \;(1\text{ fm} = 10^{-15}\text{ m})
```

So the density is the same for all nuclei:

```math
\rho = \frac{Au}{\tfrac43\pi R_0^3A} = \frac{1.66\times10^{-27}}{\tfrac43\pi(1.2\times10^{-15})^3} \approx 2.3\times10^{17}\ \text{kg/m}^3
```

A teaspoon of nuclear matter would weigh about a billion tonnes. Constant density tells us something about the force: each nucleon keeps its own space, as in a drop of liquid.

**Worked example.** Find the radius of ¹²⁵Te and the mass number of a nucleus twice as wide.

1. `$R = 1.2\times125^{1/3} = 1.2\times5 = 6.0$` fm.
2. Twice the radius means `$2^3 = 8$` times the volume, so `$A = 8\times125 = 1000$`: no such nucleus exists. Doubling the radius of ²⁷Al (`$A = 27$`) gives `$A = 216$`, which does.

## 2. Mass defect and binding energy

Weigh a ⁴He atom and it comes out lighter than two hydrogen atoms plus two neutrons. The **binding energy** is the energy that would be needed to pull the nucleus apart into free nucleons, and by `$E = mc^2$` it equals the missing mass:

```math
B = \left[Z\,M({}^1\text{H}) + N\,m_n - M({}^A\text{X})\right]c^2, \qquad 1\text{ u}\cdot c^2 = 931.5\text{ MeV}
```

Always pair **atomic** masses with **atomic** masses: use the mass of the hydrogen ATOM (proton plus electron) with the atomic mass of the nucleus you study, and the `$Z$` electrons cancel. Mixing a bare proton mass with an atomic mass leaves `$Z$` electron masses (0.511 MeV each) in the answer.

**Worked example.** ⁴He has atomic mass 4.002603 u; `$M({}^1\text{H}) = 1.007825$` u and `$m_n = 1.008665$` u.

1. `$\Delta m = 2(1.007825) + 2(1.008665) - 4.002603 = 0.030377$` u.
2. `$B = 0.030377\times931.5 = 28.3$` MeV.
3. Per nucleon: `$28.3/4 = 7.07$` MeV, unusually high for such a light nucleus. The alpha particle is a very tightly bound little unit, which is why it is what heavy nuclei emit.

<div class="problem" data-problem="binding-per-nucleon"></div>

## 3. The binding energy curve

Plot `$B/A$` against `$A$` and one of the most important graphs in physics appears.

<figure class="fig" data-fig="binding-curve"><figcaption>Binding energy per nucleon rises steeply for light nuclei, peaks at about 8.8 MeV near iron and nickel, and falls slowly to about 7.6 MeV for uranium. Switch to "Terms" to see how the surface and Coulomb terms of the liquid-drop formula carve this shape out of a flat line.</figcaption></figure>

Read it like a landscape where higher means more tightly bound:

- **The plateau.** Above `$A \approx 20$`, `$B/A$` stays near 8 MeV. If every nucleon attracted every other one, `$B$` would grow like `$A^2$`. It grows only like `$A$`, because the nuclear force has a range of about 1 to 2 fm: a nucleon feels only its neighbours. The force **saturates**.
- **Light nuclei** have a large fraction of their nucleons on the surface, with fewer neighbours, so they are less tightly bound. Joining them (**fusion**) climbs the curve and releases energy: the Sun's power source.
- **Heavy nuclei** are pushed apart by the Coulomb repulsion of many protons. Splitting them (**fission**) also climbs the curve: about 0.9 MeV per nucleon, around 200 MeV per uranium nucleus.
- **The peak** near ⁵⁶Fe and ⁶²Ni is the end of the line: neither fusing nor splitting iron releases energy.

## 4. The liquid-drop model

Treating the nucleus as a charged drop of incompressible liquid gives the **semi-empirical mass formula** (Weizsäcker, 1935) for the binding energy:

```math
B = a_vA - a_sA^{2/3} - a_c\frac{Z(Z-1)}{A^{1/3}} - a_a\frac{(A - 2Z)^2}{A} + \delta
```

with typical values `$a_v \approx 15.8$`, `$a_s \approx 18.3$`, `$a_c \approx 0.71$`, `$a_a \approx 23.2$` MeV, and the pairing term `$\delta = +a_p/\sqrt A$` for even-even nuclei, `$-a_p/\sqrt A$` for odd-odd, 0 for odd `$A$` (`$a_p \approx 12$` MeV).

<div class="meaning">

<dl>
<dt>a_v A (volume)</dt><dd>each nucleon is bound to its neighbours by about the same amount, so binding grows with the number of nucleons</dd>
<dt>−a_s A^(2/3) (surface)</dt><dd>nucleons on the surface have fewer neighbours; the surface area grows as R² ∝ A^(2/3)</dd>
<dt>−a_c Z(Z−1)/A^(1/3) (Coulomb)</dt><dd>every pair of protons repels; the typical distance grows as R ∝ A^(1/3)</dd>
<dt>−a_a (N−Z)²/A (asymmetry)</dt><dd>the Pauli principle makes unequal numbers of neutrons and protons cost energy</dd>
<dt>δ (pairing)</dt><dd>nucleons of the same kind bind extra strongly in pairs</dd>
<dt>Physical meaning</dt><dd>Five simple pictures reproduce the whole binding curve to about 1%. The surface term explains why light nuclei are loose, the Coulomb term why heavy ones are, and the asymmetry and Coulomb terms together fix which isobar is stable.</dd>
</dl>

</div>

**The valley of stability.** For fixed `$A$`, the asymmetry term wants `$Z = A/2$` and the Coulomb term wants fewer protons. Setting `$\partial B/\partial Z = 0$` (and ignoring the small neutron-proton mass difference) gives the most stable charge:

```math
Z_0 \approx \frac{A}{2 + (a_c/2a_a)A^{2/3}} \approx \frac{A}{2 + 0.015A^{2/3}}
```

So light stable nuclei have `$N \approx Z$`, while lead has `$N/Z \approx 1.5$`. Nuclei with too many neutrons for their `$A$` lie above the valley and undergo `$\beta^-$` decay; those with too many protons undergo `$\beta^+$` decay or electron capture.

**Worked example.** Estimate `$B/A$` for ⁵⁶Fe (`$Z = 26$`) from the formula.

1. `$A^{1/3} = 3.826$`, `$A^{2/3} = 14.64$`.
2. Volume `$15.8\times56 = 884.8$`; surface `$18.3\times14.64 = 267.9$`; Coulomb `$0.714\times26\times25/3.826 = 121.3$`; asymmetry `$23.2\times16/56 = 6.6$`; pairing `$+12/\sqrt{56} = +1.6$` MeV.
3. `$B = 490.6$` MeV, `$B/A = 8.76$` MeV, against a measured 8.79 MeV.

## 5. Radioactive decay: what comes out

An unstable nucleus moves towards the valley of stability by emitting particles. In every decay, charge, nucleon number, energy, momentum and angular momentum are conserved.

| Decay | What happens | Change in `$Z$` | Change in `$A$` | Q value (atomic masses) |
|---|---|---|---|---|
| `$\alpha$` | a ⁴He nucleus is emitted | `$-2$` | `$-4$` | `$[M_P - M_D - M({}^4\text{He})]c^2$` |
| `$\beta^-$` | `$n \to p + e^- + \bar\nu_e$` | `$+1$` | 0 | `$[M_P - M_D]c^2$` |
| `$\beta^+$` | `$p \to n + e^+ + \nu_e$` | `$-1$` | 0 | `$[M_P - M_D - 2m_e]c^2$` |
| electron capture | `$p + e^- \to n + \nu_e$` | `$-1$` | 0 | `$[M_P - M_D]c^2$` (less the electron's binding) |
| `$\gamma$` | excited nucleus emits a photon | 0 | 0 | the energy gap between levels |

A decay can happen only if `$Q > 0$`. The electron bookkeeping explains the odd `$2m_e$` for `$\beta^+$`: with atomic masses the daughter atom has one electron too many, and a positron must also be created.

**Alpha decay.** The alpha and the daughter fly apart with equal and opposite momenta, so the lighter alpha takes most of the energy:

```math
K_\alpha = Q\,\frac{A - 4}{A}, \qquad K_{\text{recoil}} = Q\,\frac{4}{A}
```

Alphas from one nuclide therefore come out with sharp, fixed energies (4 to 9 MeV). Inside the nucleus the alpha meets a Coulomb barrier of about 25 MeV, far above its energy, and escapes only by **quantum tunnelling**. The tunnelling probability depends exponentially on the energy, so a small rise in `$Q$` shortens the half-life enormously: the **Geiger-Nuttall rule**, which spans half-lives from microseconds to `$10^{17}$` years.

**Beta decay.** The electron's energy is spread continuously from zero to `$Q$`, because the antineutrino takes a varying share. This continuous spectrum led Pauli to propose the neutrino in 1930.

**Worked example.** ²¹⁰Po (209.982874 u) alpha decays to ²⁰⁶Pb (205.974465 u). Find the alpha energy.

1. `$Q = (209.982874 - 205.974465 - 4.002603)\times931.494 = 0.005806\times931.494 = 5.41$` MeV. (The electron counts balance: 84 = 82 + 2.)
2. `$K_\alpha = 5.41\times206/210 = 5.31$` MeV.
3. The lead recoils with 0.10 MeV, enough to knock it out of a surface: polonium sources contaminate their surroundings this way.

## 6. The decay law

Every unstable nucleus has the same chance `$\lambda\,dt$` of decaying in the next instant `$dt$`, whatever its age. For a large number of them:

<div class="steps">
<div class="step"><p><b>Rate proportional to number.</b> In time dt, a fraction λ dt of the N nuclei decays: dN = −λN dt.</p></div>
<div class="step"><p><b>Separate and integrate.</b> dN/N = −λ dt, so ln N = −λt + constant.</p></div>
<div class="step"><p><b>Exponential.</b> N = N₀e^(−λt): the same fraction decays in every equal stretch of time.</p></div>
<div class="step"><p><b>Half-life.</b> Set N = N₀/2: e^(−λT) = 1/2, so T½ = ln 2/λ = 0.693/λ.</p></div>
<div class="step"><p><b>Mean life.</b> The average lifetime of a nucleus is τ = 1/λ = T½/ln 2 = 1.44 T½. After one mean life, 1/e = 37% remain.</p></div>
</div>

```math
N = N_0e^{-\lambda t} = N_0\,2^{-t/T_{1/2}}, \qquad A = \lambda N = A_0e^{-\lambda t}, \qquad T_{1/2} = \frac{\ln2}{\lambda}, \qquad \tau = \frac1\lambda
```

The **activity** `$A$` is the number of decays per second, measured in becquerel (1 Bq = 1 decay/s) or curie (1 Ci = `$3.7\times10^{10}$` Bq, roughly the activity of 1 g of radium). A plot of `$\ln A$` against time is a straight line of slope `$-\lambda$`.

If a nuclide can decay in two ways, the decay constants add: `$\lambda = \lambda_1 + \lambda_2$`, so `$1/T = 1/T_1 + 1/T_2$`, and the fraction going each way (the **branching ratio**) is `$\lambda_1/\lambda$`.

**Worked example.** Find the activity of 1 μg of ⁶⁰Co (half-life 5.27 years).

1. `$N = (10^{-6}/60)\times6.022\times10^{23} = 1.00\times10^{16}$` nuclei.
2. `$\lambda = 0.693/(5.27\times3.156\times10^7\text{ s}) = 4.17\times10^{-9}$` s`$^{-1}$`.
3. `$A = \lambda N = 4.18\times10^7$` Bq `$= 41.8$` MBq, about 1.1 mCi, from a speck you could not see.

<div class="problem" data-problem="activity-left"></div>

<div class="myth">

**"After two half-lives a sample has completely decayed."** No: each half-life removes half of what is LEFT, so after two half-lives a quarter remains, after ten about a thousandth. A second confusion is that a half-life is how long each nucleus lives. A single nucleus does not age: one that has survived a million years is exactly as likely to decay in the next second as a freshly made one. The half-life describes a large population, not an individual.

</div>

## 7. Decay chains

Often the daughter is radioactive too: parent (1) → daughter (2) → stable (3). Starting from pure parent, the numbers are

```math
N_1 = N_0e^{-\lambda_1t}, \qquad N_2 = \frac{\lambda_1N_0}{\lambda_2 - \lambda_1}\left(e^{-\lambda_1t} - e^{-\lambda_2t}\right)
```

The daughter builds up, peaks at `$t_{max} = \dfrac{\ln(\lambda_2/\lambda_1)}{\lambda_2 - \lambda_1}$` (when the two activities are equal) and then follows the slower of the two.

<figure class="fig" data-fig="decay-chain"><figcaption>Make the parent much longer-lived than the daughter and the daughter's activity climbs to match the parent's: secular equilibrium. Make them comparable and the daughter's activity ends a fixed factor above the parent's: transient equilibrium. Make the parent short-lived and there is no equilibrium at all.</figcaption></figure>

- **Secular equilibrium** (`$T_1 \gg T_2$`): after several daughter half-lives the activities are equal, `$\lambda_1N_1 = \lambda_2N_2$`, so `$N_2/N_1 = T_2/T_1$`. Radium (1600 years) and radon (3.8 days) are the classic pair. Growth to equilibrium follows `$A_2 = A_1(1 - e^{-\lambda_2t})$`: 99% after 6.6 daughter half-lives.
- **Transient equilibrium** (`$T_1 > T_2$` but comparable): the ratio settles at `$A_2/A_1 = \lambda_2/(\lambda_2 - \lambda_1)$`. Medical technetium generators work this way.
- **No equilibrium** (`$T_1 < T_2$`): the parent disappears first; later the daughter decays with its own half-life.

**Worked example.** How many radon nuclei are there per radium nucleus in old, sealed radium ore? Take 1600 years and 3.82 days.

1. Secular equilibrium: `$N_2/N_1 = T_2/T_1 = 3.82/(1600\times365.25)$`.
2. `$= 3.82/584\,400 = 6.5\times10^{-6}$`.
3. Equal activities, but very unequal numbers: the short-lived member is always rare.

## 8. Radioactive dating

Living things keep the ¹⁴C fraction of their carbon equal to the atmosphere's. After death the ¹⁴C (half-life 5730 years) decays, so the age follows from the remaining activity per gram:

```math
t = \frac{T_{1/2}}{\ln2}\ln\frac{A_0}{A}
```

**Worked example.** Old wood shows 30% of the ¹⁴C activity of living wood.

1. `$\ln(1/0.30) = 1.204$`.
2. `$t = 5730\times1.204/0.693 = 9950$` years.
3. That is 1.74 half-lives; carbon dating works up to about 50 000 years, and rocks are dated the same way with much longer-lived nuclides (uranium-lead, potassium-argon).

For more practice with real numbers, the [binding energy](/learn/binding-energy/) tool plots the curve and splits the liquid-drop formula into its terms, the [radioactive decay dice](/learn/decay-dice/) show a half-life emerge from pure chance, the [decay calculator](/science/decay-calculator/) gives the activity of real nuclides at any date, the [decay chain simulator](/science/decay-chain/) follows a parent and up to seven daughters, and the [radiometric age calculator](/science/radiometric-age-calculator/) dates rocks from isotope ratios. The differential equation `$dN/dt = -\lambda N$` and its chain version are solved in general in the [differential equations lesson](/learn/courses/iit-jam-physics/differential-equations/).

<div class="keypoints">

- `$R = 1.2A^{1/3}$` fm; nuclear density `$\approx 2.3\times10^{17}$` kg/m³, the same for all nuclei.
- `$B = [ZM({}^1\text{H}) + Nm_n - M]c^2$` with atomic masses; `$1\text{ u} = 931.5$` MeV. `$B/A$` peaks at about 8.8 MeV near `$A \approx 60$`, so fission and fusion both release energy.
- Liquid-drop formula: volume, surface, Coulomb, asymmetry and pairing terms; most stable `$Z_0 \approx A/(2 + 0.015A^{2/3})$`.
- α: `$Z - 2$`, `$A - 4$`, `$K_\alpha = Q(A - 4)/A$`, tunnelling (Geiger-Nuttall). β⁻: `$Z + 1$`; β⁺: `$Z - 1$`, needs `$\Delta M > 2m_e$`; EC: `$Z - 1$`, needs `$\Delta M > 0$`. γ: no change in `$Z$` or `$A$`.
- `$N = N_0e^{-\lambda t}$`, `$T_{1/2} = 0.693/\lambda$`, `$\tau = 1/\lambda = 1.44T_{1/2}$`, `$A = \lambda N$`; 1 Ci `$= 3.7\times10^{10}$` Bq; decay constants of competing modes add.
- Chains: daughter peaks at `$\ln(\lambda_2/\lambda_1)/(\lambda_2 - \lambda_1)$`; secular equilibrium `$\lambda_1N_1 = \lambda_2N_2$`.
- Dating: `$t = (T_{1/2}/\ln2)\ln(A_0/A)$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [nuclei and radioactivity practice page](/learn/courses/iit-jam-physics/practice/nuclei-radioactivity/).

<div class="qbank" data-bank="physics" data-topics="nuclei-radioactivity" data-exam="jam" data-n="10"></div>

**Next:** [lesson 6.6](/learn/courses/iit-jam-physics/nuclear-reactions/) turns from spontaneous decay to nuclear reactions, fission and fusion, where the same Q-value bookkeeping applies. The [GATE Physics course](/learn/courses/gate-physics/) goes deeper into nuclear size, spin and moments, the shell model and the nuclear force.
