---
title: 'Nuclei and radioactivity'
seoTitle: 'Nuclei and radioactivity: JEE and NEET physics'
summary: 'Nuclear size and density, isotopes and isobars, the nuclear force, mass defect and binding energy with the binding energy curve, Q-values, alpha, beta and gamma decay, the decay law with half-life, mean life and activity, successive and parallel decay, fission, chain reactions and reactors, and fusion in stars.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'After three half-lives, the fraction of a radioactive sample that has decayed is:'
    choices: ['1/8', '3/8', '7/8', '1/3']
    ans: 2
    why: 'The fraction left is (½)³ = 1/8, so 7/8 has decayed. Read whether the question asks for "left" or "decayed".'
  - q: 'In β⁻ decay, the mass number A and atomic number Z of the nucleus change by:'
    choices: ['A − 4, Z − 2', 'A same, Z + 1', 'A same, Z − 1', 'A + 1, Z same']
    ans: 1
    why: 'A neutron turns into a proton, an electron and an antineutrino. The nucleon count is unchanged and the proton count rises by one.'
  - q: 'The density of nuclear matter, compared across light and heavy nuclei, is:'
    choices: ['larger for heavy nuclei', 'larger for light nuclei', 'about the same for all nuclei', 'zero for hydrogen']
    ans: 2
    why: 'R = R₀A^(1/3), so volume ∝ A and mass ∝ A: density is the same, about 2.3 × 10¹⁷ kg/m³, for every nucleus.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Atoms and nuclei'
  - 'Atomic masses: AME2020 atomic mass evaluation, IAEA Nuclear Data Services https://www-nds.iaea.org/amdc/'
  - 'Half-lives (carbon-14 5730 years and others): NuDat database, Brookhaven National Laboratory https://www.nndc.bnl.gov/nudat3/'
---

**Physics · Class 12 · about 34 minutes.** By the end you will be able to work out nuclear sizes and binding energies, balance decays and find Q-values, use the decay law for half-lives, dating and activity, and explain fission and fusion.

<div class="bigidea">A nucleus weighs less than its separate protons and neutrons. The missing mass is the binding energy, by E = mc². Nuclei in the middle of the periodic table are the most tightly bound, so energy is released both by splitting heavy nuclei (fission) and by joining light ones (fusion).</div>

## 1. Size, composition and the nuclear force

A nucleus `$^{A}_{Z}\text{X}$` has Z protons and N = A − Z neutrons. **Isotopes:** same Z (¹²C, ¹⁴C). **Isobars:** same A (¹⁴C, ¹⁴N). **Isotones:** same N.

- Radius `$R = R_0A^{1/3}$`, R₀ ≈ 1.2 fm (1 fm = 10⁻¹⁵ m). So volume ∝ A and **density is the same for all nuclei**, about 2.3 × 10¹⁷ kg/m³.
- The **nuclear force** holds nucleons together against proton repulsion. It is much stronger than the electric force, very short range (a few fm), almost the same between p-p, n-n and n-p, and repulsive at very short distances.

## 2. Mass defect and binding energy

```math
\Delta m = Zm_p + (A - Z)m_n - M_{\text{nucleus}}, \qquad B = \Delta m\,c^2, \qquad 1\ \text{u} \to 931.5\ \text{MeV}
```

With atomic masses, use m(¹H) in place of m_p so the electron masses cancel.

<div class="meaning">
<dl>
<dt>u</dt><dd>atomic mass unit, 1/12 of a carbon-12 atom = 1.6605 × 10⁻²⁷ kg</dd>
<dt>B</dt><dd>binding energy: the energy needed to pull the nucleus completely apart</dd>
<dt>B/A</dt><dd>binding energy per nucleon, the measure of stability</dd>
<dt>Q</dt><dd>energy released in a reaction = (mass before − mass after) × c² = (B after − B before)</dd>
<dt>Physical meaning</dt><dd>The tighter nucleons are bound, the more mass they have lost. Any change that moves nucleons into more tightly bound nuclei releases energy.</dd>
</dl>
</div>

<div class="problem" data-problem="nu-binding"></div>

**The binding energy curve.** B/A rises steeply for light nuclei (with a bump at ⁴He, 7.07 MeV), peaks near iron-56 at about 8.8 MeV, and falls slowly to about 7.6 MeV for uranium. Heavy nuclei gain by splitting; light ones by fusing. The flat middle shows the nuclear force **saturates**: each nucleon binds only to its near neighbours.

## 3. Radioactive decay

| Decay | What leaves | Change | Notes |
|---|---|---|---|
| Alpha (α) | ⁴He nucleus | A − 4, Z − 2 | heavy nuclei; fixed energies; alpha takes most of Q |
| Beta minus (β⁻) | electron + antineutrino | Z + 1 | n → p; continuous electron energies |
| Beta plus (β⁺) | positron + neutrino | Z − 1 | p → n; needs Q > 1.022 MeV in atomic masses |
| Electron capture | (neutrino) | Z − 1 | an inner electron is absorbed |
| Gamma (γ) | photon | none | nucleus drops from an excited state |

Charge, nucleon number, energy and momentum are always conserved. The continuous beta spectrum led Pauli to predict the **neutrino**, which carries off the missing energy. In alpha decay, momentum conservation shares Q as `$K_\alpha = Q\,\dfrac{A - 4}{A}$`.

Penetrating power: α (stopped by paper), β (a few mm of aluminium), γ (cm of lead). Ionising power is the other way round.

## 4. The decay law

Each nucleus has the same chance of decaying per second, λ, whatever its age. So the decay rate is proportional to the number present:

```math
\frac{dN}{dt} = -\lambda N, \qquad N = N_0e^{-\lambda t}, \qquad T_{1/2} = \frac{\ln 2}{\lambda} = \frac{0.693}{\lambda}, \qquad \tau = \frac1\lambda = 1.44\,T_{1/2}
```

**Activity** A = λN (decays per second, becquerel Bq; 1 curie = 3.7 × 10¹⁰ Bq) falls the same way. Watch individual nuclei decay at random while the total follows the curve.

<figure class="fig" data-fig="radioactive-decay"><figcaption>400 identical nuclei decaying at random. Which one goes next is pure chance, but the number left follows N₀e^(−λt) closely, halving every half-life.</figcaption></figure>

<div class="problem" data-problem="nu-remaining"></div>

**Carbon dating.** Living things keep the same ¹⁴C to ¹²C ratio as the air; after death the ¹⁴C decays with T = 5730 years. Measuring the remaining activity gives the age: `$t = \dfrac{T_{1/2}}{\ln 2}\ln\dfrac{A_0}{A}$`.

<div class="problem" data-problem="nu-dating"></div>

**Harder cases (JEE Advanced).**
- **Parallel decay** through two routes: λ = λ₁ + λ₂, so `$\dfrac{1}{T} = \dfrac1{T_1} + \dfrac1{T_2}$`.
- **Constant production** at rate R: `$N = \dfrac R\lambda(1 - e^{-\lambda t})$`, levelling off at R/λ.
- **Chain A → B → C:** B is largest when its production equals its decay. If A lives much longer than B, they reach **secular equilibrium**: λ_AN_A = λ_BN_B.

<div class="myth">

**"After two half-lives a sample has completely decayed."** Each half-life halves what is left: after two, a quarter remains; after ten, about 0.1%. The decay never quite finishes. Nor can you predict when any one nucleus will decay; half-life is a statement about large numbers.

</div>

## 5. Fission, chain reactions and reactors

A slow neutron absorbed by ²³⁵U makes it split into two medium nuclei, 2 or 3 neutrons, and about **200 MeV**, roughly 0.9 MeV per nucleon. Those neutrons can split more nuclei: a **chain reaction**. If each fission leads to k more (multiplication factor), the reaction dies (k < 1), runs steadily (k = 1, a reactor) or runs away (k > 1, a bomb).

A reactor has: fuel (enriched uranium), a **moderator** (water, heavy water or graphite) to slow neutrons (fast neutrons are rarely captured by ²³⁵U; light nuclei take the most energy per collision), **control rods** (cadmium or boron) to absorb neutrons, a **coolant**, and shielding. Fission of 1 kg of ²³⁵U gives about 8 × 10¹³ J.

## 6. Fusion

Joining light nuclei (deuterium and tritium, or four protons into helium) releases more energy per nucleon than fission. The nuclei must get close enough to overcome their electric repulsion, which needs temperatures of about 10⁷ to 10⁸ K: **thermonuclear fusion**. The Sun turns hydrogen into helium by the proton-proton cycle: net `$4\,^1\text{H} \to {}^4\text{He} + 2e^+ + 2\nu + 26.7\ \text{MeV}$`.

**Worked example (level 4).** Radium-226 (atomic mass 226.0254 u) decays to radon-222 (222.0176 u) plus helium-4 (4.0026 u). Q = (226.0254 − 222.0176 − 4.0026) × 931.5 = 0.0052 × 931.5 ≈ **4.84 MeV**. The alpha carries Q × 222/226 ≈ 4.76 MeV; the recoiling radon takes the rest.

<div class="keypoints">

- R = 1.2A^(1/3) fm; nuclear density the same for all, about 2.3 × 10¹⁷ kg/m³.
- Nuclear force: strong, short range, charge-independent, saturating.
- B = Δm × 931.5 MeV; B/A peaks near ⁵⁶Fe (8.8 MeV): fission and fusion both release energy.
- α: A − 4, Z − 2; β⁻: Z + 1 (with antineutrino); β⁺: Z − 1; γ: no change.
- N = N₀e^(−λt); T = 0.693/λ; τ = 1/λ = 1.44T; A = λN.
- Parallel decay λ = λ₁ + λ₂; constant production N → R/λ.
- Fission about 200 MeV; k = 1 for a reactor; moderator slows neutrons, control rods absorb them.
- Fusion needs about 10⁷ K; the Sun: 4 ¹H → ⁴He + 26.7 MeV.

</div>
