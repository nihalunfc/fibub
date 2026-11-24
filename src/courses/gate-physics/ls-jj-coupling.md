---
title: 'Many-electron atoms: LS and jj coupling'
seoTitle: LS and jj coupling and Hund's rules for GATE Physics
summary: 'Helium and exchange, the central-field picture, term symbols from LS (Russell-Saunders) coupling, terms of equivalent electrons, Hund''s rules for the ground term, the Landé interval rule, jj coupling for heavy atoms and how the two schemes match level by level, and the selection rules that decide which lines appear.'
minutes: 55
updated: 2026-11-24
quiz:
  - q: 'Which terms does the configuration np² allow?'
    choices: ['¹S, ¹D and ³P', '¹S, ¹P, ¹D, ³S, ³P and ³D', '³P only', '¹D and ³P']
    ans: 0
    why: 'For two equivalent p electrons the Pauli principle removes every term in which L + S is odd. That leaves ¹S, ¹D and ³P: 1 + 5 + 9 = 15 states, which is the 6-choose-2 count of ways to place two electrons in six spin-orbitals.'
  - q: 'The ground term of an atom with a 3d⁶ configuration (as in Fe²⁺) is'
    choices: ['⁵D₄', '⁵D₀', '¹S₀', '³F₂']
    ans: 0
    why: 'Five electrons fill one of each m_l with spin up and the sixth pairs in m_l = 2: S = 2, L = 2. The shell is more than half full, so J = L + S = 4.'
  - q: 'In a ³P multiplet obeying the Landé interval rule, what is the ratio of the spacing E(³P₂) − E(³P₁) to E(³P₁) − E(³P₀)?'
    choices: ['2 : 1', '1 : 2', '1 : 1', '3 : 2']
    ans: 0
    why: 'E(J) − E(J − 1) = AJ, so the gaps are 2A and 1A. The interval rule is a quick test of whether LS coupling holds.'
sources:
  - 'B. H. Bransden and C. J. Joachain, Physics of Atoms and Molecules, 2nd ed. (2003), chapters 7 and 8'
  - 'C. J. Foot, Atomic Physics (2005), chapters 3 and 5'
  - 'H. Haken and H. C. Wolf, The Physics of Atoms and Quanta, 7th ed. (2005), chapters 17 and 19'
  - 'R. Eisberg and R. Resnick, Quantum Physics of Atoms, Molecules, Solids, Nuclei and Particles, 2nd ed. (1985), chapters 9 and 10'
  - 'GATE Physics syllabus (Atomic and Molecular Physics), published by the organising IIT each year'
---

**Module 6 · about 55 minutes.** By the end you will be able to estimate helium's ground-state energy, explain why triplets lie below singlets, list the terms of any configuration, find the ground term with Hund's rules, use the Landé interval rule, switch between LS and jj coupling, and say which lines are allowed.

<div class="bigidea">With many electrons there are two extra interactions: the repulsion between electrons and each electron's spin-orbit coupling. Which one is larger decides how the angular momenta add up, and that decides the labels of every level.</div>

## 1. Helium: repulsion and exchange

Two electrons round a nucleus of charge `$Ze$`. Ignore the repulsion and each electron is hydrogen-like: the ground state 1s² has energy `$-2Z^2(13.6)$` eV, `$-108.8$` eV for helium. The measured value is `$-79.0$` eV, so the repulsion is a big effect, not a small one.

Switch the type between distinguishable particles, bosons and fermions for the orbital pair 1 and 2.

<figure class="fig" data-fig="@qm-exchange-2d"><figcaption>Fermions avoid the diagonal x₁ = x₂ (the Pauli hole) and bosons gather on it, changing the average separation of the pair.</figcaption></figure>

**First-order perturbation.** The expectation value of `$e^2/(4\pi\varepsilon_0 r_{12})$` in the 1s² state is `$\tfrac54 Z(13.6)$` eV = 34 eV for helium, giving `$-74.8$` eV.

**Variational estimate.** Each electron screens the nucleus from the other. Try hydrogen-like orbitals with an effective charge `$Z'$` and minimise the energy: `$Z' = Z - \tfrac{5}{16}$`, and

```math
E_{\text{var}} = -2\left(Z - \tfrac{5}{16}\right)^2(13.6\ \text{eV})
```

For helium, `$Z' = 1.6875$` and `$E = -77.5$` eV, within 2% of experiment. The first ionisation energy is the difference between the ion He⁺ (`$-54.4$` eV) and the atom: measured 24.6 eV, variational 23.1 eV.

<div class="problem" data-problem="helium-like-energy"></div>

**Excited states and exchange.** In 1s2s the total wavefunction must be antisymmetric. Either the spin part is the singlet (`$S = 0$`, antisymmetric) and the space part symmetric, or the spin part is a triplet (`$S = 1$`, symmetric) and the space part antisymmetric. The antisymmetric space part vanishes when the electrons meet, so they repel less:

```math
E = E_1 + E_2 + J \pm K, \qquad +\ \text{singlet},\ -\ \text{triplet}
```

`$J$` is the direct Coulomb integral and `$K > 0$` the exchange integral. Triplets lie lower. Spin has no force of its own here; the energy difference comes from electrostatics plus the Pauli principle. Since E1 transitions do not change spin, helium's singlets (parahelium) and triplets (orthohelium) form two almost separate spectra, and 1s2s ³S₁ is metastable.

## 2. The central-field picture

For many electrons, each one moves in the average field of the nucleus and the others: a spherical potential that is `$-Ze^2/r$` close in and `$-e^2/r$` far out. Orbitals keep the labels `$n, l, m_l, m_s$`, the `$l$` degeneracy is lifted (penetrating s orbitals lie lowest), and a **configuration** such as `$1s^22s^22p^2$` lists the occupation. What is left over after the central field is:

1. the **residual electrostatic interaction** (the part of the repulsion that is not spherical), and
2. **spin-orbit coupling** of each electron, `$\sum_i \xi(r_i)\,\mathbf l_i\cdot\mathbf s_i$`.

Closed shells and subshells have `$L = S = J = 0$` and can be ignored; only the open subshell matters.

## 3. LS (Russell-Saunders) coupling

When the residual electrostatic term is larger, as in light atoms, the orbital momenta add to `$\mathbf L$` and the spins to `$\mathbf S$` first; the electrostatic energy depends on `$L$` and `$S$`, which gives **terms**. Spin-orbit coupling, smaller, then splits each term into **levels** of total `$\mathbf J = \mathbf L + \mathbf S$`, with `$J = |L-S|, \dots, L+S$`. The label is

```math
{}^{2S+1}L_J, \qquad L = 0, 1, 2, 3, 4, 5 \to S, P, D, F, G, H
```

and each level has `$2J+1$` states. The superscript `$2S+1$` is the multiplicity; when `$L < S$` the term has only `$2L+1$` levels, but the name keeps `$2S+1$`.

Pick l, s, j and m_j, switch the field on and off, and drag the picture to turn it.

<figure class="fig" data-fig="@qm-vector-model"><figcaption>L and S circle quickly about J while J circles slowly about B. Only the lengths √(x(x+1)) and the z-component m_j are fixed, and g_J sets the Zeeman splitting.</figcaption></figure>

**Non-equivalent electrons** (different `$n$` or `$l$`) combine freely. For `$np\,n'p$`: `$L = 0, 1, 2$` and `$S = 0, 1$`, all six terms ¹S, ¹P, ¹D, ³S, ³P, ³D, with 36 states.

**Equivalent electrons** (same `$n$` and `$l$`) must respect Pauli. Count the states first: `$N$` electrons in a subshell of `$2(2l+1)$` spin-orbitals give `$\binom{2(2l+1)}{N}$` states. Then list the allowed terms:

| Configuration | States | Terms |
|---|---|---|
| `$p^1$`, `$p^5$` | 6 | ²P |
| `$p^2$`, `$p^4$` | 15 | ¹S, ¹D, ³P |
| `$p^3$` | 20 | ⁴S, ²P, ²D |
| `$d^2$`, `$d^8$` | 45 | ¹S, ¹D, ¹G, ³P, ³F |

A subshell with `$N$` electrons and one with `$N$` holes have the same terms. For two equivalent electrons the rule is simple: `$L + S$` must be even.

<div class="meaning">

<dl>
<dt>configuration</dt><dd>which orbitals are occupied, e.g. 1s²2s²2p²; ignores how momenta couple</dd>
<dt>term</dt><dd>²ˢ⁺¹L: all the states with one L and one S, split from other terms by electrostatics (eV)</dd>
<dt>level</dt><dd>²ˢ⁺¹L_J: one J inside a term, split from its neighbours by spin-orbit coupling (meV in light atoms)</dd>
<dt>state</dt><dd>one M_J value inside a level; there are 2J + 1, split only by an outside field</dd>
<dt>equivalent electrons</dt><dd>electrons with the same n and l, so the Pauli principle removes some terms</dd>
</dl>

</div>

## 4. Hund's rules for the ground term

For the ground configuration, the lowest level is found by three rules (reliable for the ground term only):

1. **Largest `$S$`.** Parallel spins keep electrons apart (exchange), lowering the repulsion.
2. **Then the largest `$L$`.** Electrons orbiting the same way meet less often.
3. **Then `$J = |L - S|$` if the subshell is less than half full, `$J = L + S$` if more than half full.** For exactly half full, `$L = 0$` and `$J = S$`.

The quick method: put electrons into `$m_l = l, l-1, \dots, -l$` with spin up, then down. Add the `$m_l$` to get `$L$` and the `$m_s$` to get `$S$`.

**Worked example.** Find the ground terms of carbon (2p²), nitrogen (2p³), oxygen (2p⁴) and Nd³⁺ (4f³).

1. C: `$m_l = 1, 0$`, both up: `$S = 1$`, `$L = 1$`, less than half full, `$J = 0$`: ³P₀.
2. N: `$m_l = 1, 0, -1$` up: `$S = \tfrac32$`, `$L = 0$`: ⁴S₃/₂.
3. O: four electrons, the fourth pairs in `$m_l = 1$`: `$S = 1$`, `$L = 1$`, more than half full, `$J = 2$`: ³P₂.
4. Nd³⁺: `$m_l = 3, 2, 1$` up: `$S = \tfrac32$`, `$L = 6$` (I), less than half of 14, `$J = 6 - \tfrac32 = \tfrac92$`: ⁴I₉/₂.

## 5. Spin-orbit splitting and the interval rule

Within one LS term the spin-orbit energy is `$A\,\mathbf L\cdot\mathbf S/\hbar^2$`:

```math
E_J = \frac A2\left[J(J+1) - L(L+1) - S(S+1)\right], \qquad E_J - E_{J-1} = AJ
```

This is the **Landé interval rule**: the gap between neighbouring levels is proportional to the larger `$J$`. For ³P the gaps are in ratio 1 : 2, for ³D 2 : 3, for ⁴F (`$J = \tfrac32$` to `$\tfrac92$`) 5 : 7 : 9. The centre of gravity, weighting each level by `$2J+1$`, stays at the unperturbed term energy. When `$A > 0$` (less than half full) the multiplet is **normal**, lowest `$J$` at the bottom; when `$A < 0$` (more than half full) it is **inverted**. That is the origin of Hund's third rule.

**Worked example.** A ³D term has levels with `$E(^3D_2) - E(^3D_1) = 30$` cm⁻¹. Predict the next gap and the total width.

1. `$AJ$` with `$J = 2$`: `$2A = 30$`, so `$A = 15$` cm⁻¹.
2. `$E(^3D_3) - E(^3D_2) = 3A = 45$` cm⁻¹; total width 75 cm⁻¹.

<div class="problem" data-problem="lande-interval"></div>

Real multiplets drift from the interval rule as atoms get heavier, a sign that LS coupling is breaking down.

## 6. jj coupling

In heavy atoms `$\xi(r)$` grows fast with `$Z$` and spin-orbit coupling wins over the residual electrostatic term. Each electron first forms its own `$j_i = l_i \pm \tfrac12$`, and the `$j_i$` then add to `$J$`. Levels are labelled `$(j_1, j_2)_J$`.

**Worked example.** List the jj levels of `$np\,n'p$` and match them with LS.

1. Each electron has `$j = \tfrac12$` or `$\tfrac32$`. The pairs: `$(\tfrac12,\tfrac12)$`: `$J = 0, 1$`; `$(\tfrac12,\tfrac32)$`: `$J = 1, 2$`; `$(\tfrac32,\tfrac12)$`: `$J = 1, 2$`; `$(\tfrac32,\tfrac32)$`: `$J = 0, 1, 2, 3$`.
2. Ten levels: `$J = 0$` twice, `$J = 1$` four times, `$J = 2$` three times, `$J = 3$` once.
3. LS gives ¹S₀, ¹P₁, ¹D₂, ³S₁, ³P₀,₁,₂, ³D₁,₂,₃: the same list of `$J$` values. The number of levels of each `$J$` never depends on the coupling scheme, only their grouping and spacing.

The group-14 elements show the change: carbon's lowest configuration 2p² is a clean LS pattern (³P well below ¹D and ¹S), while lead's 6p² groups into jj pairs. Most real atoms sit in between (intermediate coupling).

## 7. Selection rules

For electric dipole transitions in LS coupling, with one electron jumping:

```math
\Delta S = 0, \quad \Delta L = 0, \pm1, \quad \Delta J = 0, \pm1, \quad \text{no } 0 \leftrightarrow 0 \text{ for } L \text{ or } J, \quad \text{parity changes } (\Delta l = \pm1)
```

`$\Delta J$` and parity are exact for E1. `$\Delta S = 0$` holds only as well as LS coupling holds: **intercombination lines** with `$\Delta S = 1$` are very weak in light atoms but strong in heavy ones. Mercury's 253.7 nm line (6s6p ³P₁ → 6s² ¹S₀) is the main ultraviolet line of mercury lamps.

## 8. X-ray spectra and Moseley's law

Fire electrons of energy `$eV$` at a metal target and two kinds of X-rays come out.

- **Continuous spectrum (bremsstrahlung).** Electrons decelerated in the target radiate a smooth range of wavelengths with a sharp short-wavelength cut-off, because no photon can carry more than the whole electron energy: the **Duane-Hunt law**
  `$\lambda_{\min} = hc/eV = 12.398/V\,(\text{kV})$` Å. It depends on the voltage only, not on the target.
- **Characteristic lines.** If the electron energy is above the **absorption edge** of an inner shell, it can knock an electron out of it. An electron from a higher shell then falls in and emits a photon of one fixed energy. A hole in the K shell (`$n = 1$`) gives the **K series**: `$K_\alpha$` when the electron falls from L (`$n = 2$`), `$K_\beta$` from M (`$n = 3$`). The lines are sharp and belong to the element. `$K_\alpha$` is a close doublet, `$K_{\alpha1}$` and `$K_{\alpha2}$` (from `$2p_{3/2}$` and `$2p_{1/2}$`); a `$2s \to 1s$` jump is forbidden because it does not change `$l$`.

**Moseley's law.** The photon energy is the difference of two hydrogen-like levels in which the other electrons screen the nuclear charge. Moseley (1913) found that the square root of the line frequency rises in a straight line with the atomic number:

```math
\sqrt{\nu} = a\,(Z - \sigma), \qquad \text{K}\alpha:\ \ h\nu = \tfrac34\,Ry\,(Z - 1)^2, \quad Ry = 13.606\ \text{eV}
```

Here `$\sigma \approx 1$` for `$K_\alpha$`: the one other 1s electron screens the nucleus from the electron falling in. (Compare the Bohr formula with `$Z_{\text{eff}} = Z - 1$` and `$1 - 1/4 = 3/4$` from `$n = 2 \to 1$`.) Moseley's graph put the elements in order of `$Z$` rather than atomic weight and showed gaps where undiscovered elements (technetium, promethium and others) belonged.

**Worked example.** (a) The `$K_\alpha$` line of copper (`$Z = 29$`), and what a tube needs to excite it. (b) Identify an unknown target with `$K_\alpha$` at 0.709 Å.

1. Copper: `$h\nu = 0.75\times13.606\times28^2 = 8000$` eV `$= 8.00$` keV, so `$\lambda = 12.398/8.000 = 1.55$` Å. The measured value is 8.05 keV, 1.54 Å, so the simple formula is good to about 1 %.
2. The copper K absorption edge is at 8.98 keV, so the tube voltage must exceed about 9 kV to produce K lines. At 30 kV the continuous spectrum starts at `$\lambda_{\min} = 12.398/30 = 0.413$` Å, and the Cu K lines appear as sharp peaks on top of it.
3. Unknown target: `$E = 12.398\ \text{keV Å}/0.709\ \text{Å} = 17.49$` keV. Then `$(Z - 1)^2 = 17\,487/(0.75\times13.606) = 1714$`, so `$Z - 1 = 41.4$` and `$Z \approx 42$`: molybdenum, whose real `$K_\alpha$` is 17.48 keV.

An atom with a K hole can also lose its energy by ejecting an outer electron (the **Auger effect**) instead of emitting a photon; light atoms prefer it. The X-ray tube, absorption edges and Bragg reflection are in the JAM lesson on [atoms and X-rays](/learn/courses/iit-jam-physics/atoms-x-rays/).

<div class="myth">

**"Triplets are lower because parallel spins attract."** The magnetic interaction between spins is far too small. Triplets are lower because their spatial wavefunction is antisymmetric, the electrons stay apart, and their Coulomb repulsion is smaller: the exchange energy is electrostatic.

**"Hund's rules give the order of all the terms."** They pick the ground term reliably. For carbon they happen to give ³P < ¹D < ¹S, but in general the order of the excited terms has to be calculated or measured.

</div>

<div class="keypoints">

- Helium: no repulsion `$-108.8$` eV; perturbation `$-74.8$` eV; variational `$Z' = Z - 5/16$`, `$-77.5$` eV; experiment `$-79.0$` eV. Ionisation energy 24.6 eV.
- Exchange: `$E = J \pm K$`, triplet lower; para- and orthohelium hardly connect.
- LS coupling (light atoms): terms `$^{2S+1}L$` split by spin-orbit into levels `$J = |L-S|..L+S$`, each `$2J+1$` states.
- Equivalent electrons: `$\binom{2(2l+1)}{N}$` states; `$p^2$`: ¹S ¹D ³P; `$p^3$`: ⁴S ²D ²P; `$d^2$`: ¹S ¹D ¹G ³P ³F. Holes = electrons.
- Hund: max `$S$`, max `$L$`, `$J = |L-S|$` (less than half), `$L+S$` (more than half).
- Interval rule `$E_J - E_{J-1} = AJ$`; normal (`$A > 0$`) or inverted (`$A < 0$`) multiplets.
- jj coupling (heavy atoms): `$j_i = l_i \pm \tfrac12$` first; same number of levels per `$J$` as LS.
- E1: `$\Delta S = 0$`, `$\Delta L, \Delta J = 0, \pm1$` (no 0 to 0), parity changes; intercombination lines show LS breaking.
- X-rays: Duane-Hunt `$\lambda_{\min} = 12.398/V$` (kV) Å; Moseley `$\sqrt\nu \propto Z - \sigma$`; K\(\alpha\): `$h\nu = \tfrac34Ry(Z-1)^2$`, so Cu is 8.0 keV.

</div>

## Practise: exam questions on this lesson

They start at the definitions and climb to GATE top-rank level. Check each answer, then read the full solution. There are more on the [LS and jj coupling practice page](/learn/courses/gate-physics/practice/ls-jj-coupling/).

<div class="qbank" data-bank="physics" data-topics="ls-jj-coupling,atoms-x-rays" data-exam="gate" data-n="10"></div>

**Next:** [lesson 6.3](/learn/courses/gate-physics/zeeman-stark/) puts these levels in a magnetic or electric field and splits each one into its `$2J+1$` states. The basics are in [lesson 6.1](/learn/courses/gate-physics/fine-structure/).
