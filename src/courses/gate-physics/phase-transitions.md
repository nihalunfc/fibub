---
title: 'Phase transitions'
seoTitle: Phase transitions and critical phenomena for GATE Physics
summary: 'How matter changes phase: Ehrenfest classification, the Clausius-Clapeyron and Ehrenfest relations, the phase rule, order parameters and symmetry breaking, Landau theory for continuous and first-order transitions, the mean-field Ising model, critical exponents, scaling and universality.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: In Landau theory the order parameter below T_c grows as
    choices: ['(T_c − T)^{1/2}', '(T_c − T)', '(T_c − T)^{1/8}', 'e^{−T_c/T}']
    ans: 0
    why: "Minimising a(T − T_c)m² + bm⁴ gives m² = a(T_c − T)/2b, so β = 1/2. The exact 2D Ising value is 1/8."
  - q: Which transition has a latent heat?
    choices: ['Water boiling at 1 atm', 'Iron at its Curie point in zero field', 'Tin becoming superconducting in zero field', 'A fluid at its critical point']
    ans: 0
    why: "Boiling is first order: entropy and volume jump. The others are continuous transitions with no latent heat."
  - q: Mean-field theory gives kT_c = zJ for the Ising model. Compared with the exact result, this is
    choices: ['too high', 'too low', 'exact in two dimensions', 'exact in one dimension']
    ans: 0
    why: "Mean field ignores the fluctuations that oppose ordering, so it overestimates T_c (4J versus 2.27J on the square lattice) and wrongly predicts ordering in 1D."
sources:
  - 'R. K. Pathria and P. D. Beale, Statistical Mechanics, 4th ed. (Academic Press, 2021), chapters 12 and 13'
  - 'K. Huang, Statistical Mechanics, 2nd ed. (Wiley, 1987), chapters 14 to 17'
  - 'J. M. Yeomans, Statistical Mechanics of Phase Transitions (Oxford, 1992), chapters 1 to 5'
  - 'H. E. Stanley, Introduction to Phase Transitions and Critical Phenomena (Oxford, 1971)'
  - 'GATE Physics (PH) syllabus, Statistical Physics section, published by the organising institute each year'
---

**Module 5 · about 45 minutes.** By the end you will be able to classify a transition, use the Clapeyron and Ehrenfest equations, set up and minimise a Landau free energy for continuous and first-order cases, solve the mean-field Ising model, and use critical exponents with the scaling relations. Thermodynamic potentials and `$G$` minimisation come from the JAM lesson on [thermodynamic potentials](/learn/courses/iit-jam-physics/thermodynamic-potentials/); the van der Waals critical point is in [kinetic theory](/learn/courses/iit-jam-physics/kinetic-theory/).

<div class="bigidea">A phase transition is a competition between energy, which favours order, and entropy, which favours disorder. Near a continuous transition the details of the material stop mattering: only dimension and symmetry decide how quantities diverge.</div>

## 1. Classifying transitions

At a transition the phases coexist with equal Gibbs energy per particle, so `$G$` is continuous. Ehrenfest classified transitions by the first derivative of `$G$` that jumps:

| | First order | Continuous (second order) |
|---|---|---|
| `$S = -\partial G/\partial T$`, `$V = \partial G/\partial P$` | jump (latent heat `$L = T\Delta S$`) | continuous |
| `$C_P$`, `$\kappa_T$`, `$\alpha$` | finite on each side | jump or diverge |
| order parameter | jumps | grows continuously from zero |
| examples | melting, boiling, ferromagnet with reversed field | Curie point, critical point, superconductor in zero field, lambda point of ⁴He |

**Coexistence curves.** Equal chemical potentials along a line give the **Clausius-Clapeyron equation**

```math
\frac{dP}{dT} = \frac{L}{T\,\Delta v}
```

Ice is less dense than water, so its melting line slopes backwards: `$dP/dT = 3.34\times10^5/(273.15\times(-9.1\times10^{-5})) = -13.4$` MPa/K. For a vapour (ideal, `$v_{\rm liquid}$` negligible) it integrates to `$P \propto e^{-L/RT}$`. For a continuous transition both `$\Delta S$` and `$\Delta V$` vanish and their derivatives give the **Ehrenfest relations**, `$dP/dT = \Delta\alpha/\Delta\kappa_T = \Delta C_P/(TV\Delta\alpha)$`.

**Phase rule.** With `$C$` components and `$P$` coexisting phases, `$F = C - P + 2$` intensive variables are free: for a pure substance a triple point has `$F = 0$`.

<div class="problem" data-problem="stat-clapeyron"></div>

## 2. Order parameters and Landau theory

An order parameter `$m$` is zero in the symmetric (high-`$T$`) phase and non-zero in the ordered phase: magnetisation, `$\rho_l - \rho_g$`, the superconducting gap. Landau expanded the free energy near `$T_c$` in powers of `$m$`, keeping only terms the symmetry allows (for a ferromagnet, `$m \to -m$` forbids odd powers):

```math
F(m) = F_0 + a(T - T_c)m^2 + bm^4 - hm, \qquad a, b > 0
```

<div class="meaning">

<dl>
<dt>Above T<sub>c</sub></dt><dd>the m² coefficient is positive: one minimum at m = 0</dd>
<dt>Below T<sub>c</sub></dt><dd>it is negative: two minima at m = ±√(a(T<sub>c</sub> − T)/2b); the system picks one (spontaneous symmetry breaking)</dd>
<dt>Results</dt><dd>β = 1/2; χ = 1/2a(T − T<sub>c</sub>) above and 1/4a(T<sub>c</sub> − T) below (γ = 1, amplitude ratio 2); at T<sub>c</sub>, m ∝ h<sup>1/3</sup> (δ = 3); heat capacity jump a²T<sub>c</sub>/2b (α = 0)</dd>
<dt>Physical meaning</dt><dd>The shape of F(m) changes from a bowl to a double well as T crosses T<sub>c</sub>. Nothing jumps in F, but its curvature at m = 0 changes sign.</dd>
</dl>

</div>

**First-order transitions in Landau theory.** If a cubic term is allowed (no `$m \to -m$` symmetry, as for nematic liquid crystals), or if the quartic coefficient is negative with a positive `$m^6$` term, a second minimum appears and reaches the height of `$F(0)$` before the `$m^2$` coefficient vanishes. Then `$m$` jumps. For `$F = \alpha(T - T_0)m^2 - Bm^4 + Dm^6$` the transition is at `$T^* = T_0 + B^2/4\alpha D$` with a jump `$m^2 = B/2D$`, and there is hysteresis between the spinodals.

## 3. The Ising model in mean field

The simplest model with a transition: spins `$s_i = \pm1$` on a lattice, `$H = -J\sum_{\langle ij\rangle}s_is_j - h\sum_is_i$`. Replace each neighbour by the average `$m$`: every spin feels a field `$zJm + h$`, and

```math
m = \tanh\left(\frac{zJm + h}{kT}\right) \quad\Rightarrow\quad kT_c = zJ \ (h = 0)
```

Graphically, `$y = m$` meets `$y = \tanh(mT_c/T)$` away from zero only when the slope of the tanh at the origin, `$T_c/T$`, exceeds 1. Near `$T_c$`, expanding the tanh gives `$m \approx \sqrt{3(1 - T/T_c)}$`, the Landau result; the heat capacity jumps by `$\tfrac32k$` per spin, and above `$T_c$` the susceptibility follows the Curie-Weiss law `$\chi = C/(T - T_c)$`.

<figure class="fig" data-fig="order-parameter"><figcaption>Mean-field ordering. In the graphical view the non-zero crossing exists only below T<sub>c</sub>. In the m(T) view the mean-field magnetisation (β = 1/2) is compared with Onsager and Yang's exact 2D Ising result (β = 1/8), each against its own T<sub>c</sub>.</figcaption></figure>

**What mean field gets wrong.** It ignores fluctuations, which oppose order. So it overestimates `$T_c$` (square lattice: `$4J$` versus Onsager's exact `$2.269J$`) and predicts ordering in 1D, where the exact transfer-matrix solution shows none: the free energy `$-kT\ln(2\cosh\beta J)$` is smooth and the correlation length `$\xi = -a/\ln\tanh\beta J$` stays finite at every `$T > 0$`. A domain wall costs only `$2J$` but gains entropy `$k\ln N$`.

## 4. Critical exponents, scaling and universality

With `$t = (T - T_c)/T_c$`:

| Exponent | Definition | Mean field | 2D Ising | 3D Ising |
|---|---|---|---|---|
| `$\alpha$` | `$C \sim |t|^{-\alpha}$` | 0 (jump) | 0 (log) | 0.110 |
| `$\beta$` | `$m \sim (-t)^\beta$` | 1/2 | 1/8 | 0.326 |
| `$\gamma$` | `$\chi \sim |t|^{-\gamma}$` | 1 | 7/4 | 1.237 |
| `$\delta$` | `$m \sim h^{1/\delta}$` at `$T_c$` | 3 | 15 | 4.79 |
| `$\nu$` | `$\xi \sim |t|^{-\nu}$` | 1/2 | 1 | 0.630 |

They are linked by scaling relations that follow from the divergence of the correlation length: Rushbrooke `$\alpha + 2\beta + \gamma = 2$`, Widom `$\gamma = \beta(\delta - 1)$`, and hyperscaling `$d\nu = 2 - \alpha$` (mean field satisfies it only at `$d = 4$`, the upper critical dimension).

**Universality.** Exponents depend only on the dimension, the symmetry of the order parameter and the range of the forces. The liquid-gas critical point and a uniaxial magnet share the 3D Ising exponents; a lattice gas maps exactly onto the Ising model. Discrete symmetries order for `$d \ge 2$`; continuous symmetries need `$d > 2$` (Mermin-Wagner).

<div class="myth">

**"A continuous transition has nothing discontinuous about it."** The order parameter and entropy are continuous, but response functions are singular: the heat capacity jumps (mean field) or diverges (3D Ising), and the susceptibility and correlation length diverge. And the free energy is non-analytic at `$T_c$`, which is exactly what makes it a phase transition rather than a smooth crossover.

</div>

<div class="keypoints">

- First order: `$S$`, `$V$`, order parameter jump; `$dP/dT = L/T\Delta v$`. Continuous: no latent heat; Ehrenfest relations; singular response functions.
- Phase rule `$F = C - P + 2$`.
- Landau `$F = a(T - T_c)m^2 + bm^4$`: `$m \propto (T_c - T)^{1/2}$`, `$\chi$` ratio 2, `$\delta = 3$`, `$\Delta C = a^2T_c/2b$`. Cubic or negative quartic term → first order.
- Mean-field Ising: `$m = \tanh(zJm/kT)$`, `$kT_c = zJ$` (too high); exact: no transition in 1D, `$kT_c = 2.269J$` on the square lattice.
- Scaling: `$\alpha + 2\beta + \gamma = 2$`, `$\gamma = \beta(\delta - 1)$`, `$d\nu = 2 - \alpha$`; universality classes set by dimension and symmetry.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [GATE practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="phase-transitions" data-exam="gate" data-n="10"></div>

**Module 5 complete.** Review the whole module with mixed questions on the [GATE practice page](/learn/courses/gate-physics/practice/). Watch domains form and critical fluctuations grow in fibub's [Ising model simulator](/science/ising-model/), and explore coexistence curves with the [phase diagram calculator](/science/phase-diagram-calculator/). **Next:** Module 6 begins with [hydrogen spectra and fine structure](/learn/courses/gate-physics/fine-structure/).

**Going on to CSIR NET?** [The Ising model and Landau theory](/learn/courses/csir-net-physics/ising-landau/) adds exact results and more Landau extensions.
