---
title: The Ising model and Landau theory
summary: 'Exact and approximate Ising results for CSIR NET: small clusters, the one-dimensional chain by transfer matrix with its correlation length, why 1D cannot order and 2D can (Peierls), Onsager and Kramers-Wannier duality, mean field against Bethe, Metropolis Monte Carlo, and Landau theory beyond the basics: first-order and tricritical points, Ginzburg-Landau and the Ginzburg criterion.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: For the zero-field Ising chain, how does the spin-spin correlation ⟨s₀s_r⟩ depend on distance r?
    choices: ['It is constant, tanh K, for every r', 'It falls as (tanh K)^r, exponentially with correlation length −1/ln tanh K', 'It falls as a power law r^(−1/4)', 'It vanishes for r ≥ 2']
    ans: 1
    why: "With bond variables, each bond along the path contributes a factor tanh K, so ⟨s₀s_r⟩ = tanh^r K = e^(−r/ξ). ξ is finite at every T > 0 and diverges only as T → 0: no transition in 1D."
  - q: On the square lattice, Kramers-Wannier duality relates couplings K and K* by sinh 2K sinh 2K* = 1. What follows if the transition is unique?
    choices: ['T_c is where K = 0', 'The model has no transition', 'sinh(2J/k_BT_c) = 1, so k_BT_c = 2J/ln(1 + √2)', 'k_BT_c = 4J, the mean-field value']
    ans: 2
    why: "Duality maps high T to low T. A single critical point must be self-dual, K = K*, so sinh 2K_c = 1 and K_c = ½ ln(1 + √2) = 0.4407, k_BT_c = 2.269J. Onsager's exact solution confirmed it."
  - q: A Landau free energy F = αm² − βm⁴ + γm⁶ with β, γ > 0 and α = a(T − T₀). What kind of transition occurs and where?
    choices: ['Continuous, at T = T₀', 'None, since the quartic term is negative', 'Continuous, at T₀ + β/(2aγ)', 'First order, at T = T₀ + β²/(4aγ), with a jump m² = β/(2γ)']
    ans: 3
    why: "Setting F = 0 and F′ = 0 at the same non-zero m gives m² = β/2γ and α = β²/4γ. The order parameter jumps above T₀, before the m = 0 state becomes unstable at T₀ (its spinodal)."
sources:
  - 'R. J. Baxter, Exactly Solved Models in Statistical Mechanics (1982), chapters 2, 3 and 7'
  - 'N. Goldenfeld, Lectures on Phase Transitions and the Renormalization Group (1992), chapters 2 to 5'
  - 'L. Onsager, "Crystal statistics. I. A two-dimensional model with an order-disorder transition", Physical Review 65, 117 (1944)'
  - 'C. N. Yang, "The spontaneous magnetization of a two-dimensional Ising model", Physical Review 85, 808 (1952)'
  - 'CSIR-UGC NET Physical Sciences syllabus, Thermodynamic and Statistical Physics unit, published by the National Testing Agency'
---

**Module 6 · about 55 minutes.** The basics are in the GATE lesson on [phase transitions](/learn/courses/gate-physics/phase-transitions/): Landau's `$m^2 + m^4$` free energy, the mean-field Ising model with `$k_BT_c = zJ$`, and the table of critical exponents. CSIR NET Part C goes further and asks for exact results: partition functions of small clusters and chains, correlation lengths, why one dimension cannot order, the exact 2D critical temperature, and Landau theories with a first-order or tricritical point. That is this lesson. The partition-function machinery is in [partition functions](/learn/courses/gate-physics/partition-functions/).

<div class="bigidea">Order is a contest between energy, which wants all spins aligned, and entropy, which wants them random. In one dimension a single domain wall costs a fixed energy but gains entropy k_B ln N, so entropy always wins at T > 0. In two dimensions a wall's cost grows with its length, so order survives up to a finite T_c. Mean-field theory gets the existence right and the numbers wrong; exact solutions and Landau's symmetry argument get the rest.</div>

## 1. The model and small clusters

Spins `$s_i = \pm1$` on a lattice, nearest neighbours coupled:

```math
H = -J\sum_{\langle ij\rangle}s_is_j - h\sum_is_i, \qquad Z = \sum_{\{s\}}e^{-\beta H}, \qquad K = \beta J
```

For a handful of spins, just list the states. Two spins: `$Z = 2e^K + 2e^{-K} = 4\cosh K$` at `$h = 0$`, so `$\langle s_1s_2\rangle = \tanh K$` and `$\langle E\rangle = -J\tanh K$`. Three spins on a triangle: 2 aligned states with `$E = -3J$` and 6 with `$E = +J$`, so `$Z = 2e^{3K} + 6e^{-K}$`. With **antiferromagnetic** coupling (`$J < 0$`) on the triangle, no state satisfies all three bonds: the ground state is 6-fold degenerate and keeps entropy `$k_B\ln6$` at `$T = 0$`. That is **frustration**, and on the full triangular lattice it leaves a residual entropy of `$0.323k_B$` per spin (Wannier).

## 2. The one-dimensional chain, exactly

Write `$Z$` for a ring of `$N$` spins as a trace of a product of 2 × 2 **transfer matrices**:

```math
Z = \text{Tr}\,T^N, \qquad T = \begin{pmatrix} e^{K + \beta h} & e^{-K} \\ e^{-K} & e^{K - \beta h} \end{pmatrix}, \qquad \lambda_\pm = e^K\cosh\beta h \pm\sqrt{e^{2K}\sinh^2\beta h + e^{-2K}}
```

So `$Z = \lambda_+^N + \lambda_-^N$`, and for large `$N$` only `$\lambda_+$` matters: `$f = -k_BT\ln\lambda_+$`. At `$h = 0$`, `$\lambda_\pm = 2\cosh K, 2\sinh K$`, and

```math
m(h) = \frac{\sinh\beta h}{\sqrt{\sinh^2\beta h + e^{-4K}}}, \qquad \langle s_0s_r\rangle = \tanh^rK = e^{-r/\xi}, \qquad \xi = -\frac{1}{\ln\tanh K}
```

- `$m \to 0$` as `$h \to 0$` at every `$T > 0$`: **no spontaneous magnetisation**. The zero-field susceptibility per spin is `$\chi = \beta e^{2K}$`, large but finite.
- The correlation length is finite at every `$T > 0$`: `$\xi = 3.7$` lattice spacings at `$K = 1$`, 1.3 at `$K = 0.5$`. At low temperature `$\xi \approx \tfrac12e^{2K}$` grows exponentially but diverges only at `$T = 0$`.
- For a short ring the second eigenvalue still counts: the nearest-neighbour correlation is `$(t + t^{N-1})/(1 + t^N)$` with `$t = \tanh K$`.

**Why 1D cannot order (Landau's argument).** Start from all spins up and flip a block, creating two walls. Each wall costs `$2J$` and can sit at any of about `$N$` places, so the free energy change of one wall is `$\Delta F = 2J - k_BT\ln N$`, negative for large `$N$` at any `$T > 0$`. Walls proliferate and destroy order. Their density is about `$e^{-2K}$`, so the typical domain is about `$e^{2K}$` long, matching `$\xi$`.

<div class="problem" data-problem="ising-ring"></div>

## 3. Two dimensions: Peierls, duality and Onsager

**Peierls' argument.** In 2D, a domain of up spins inside a down sea is bounded by a closed wall of length `$L$`, costing `$2JL$`. The number of such walls grows at most as `$3^L$` (a walk that cannot immediately backtrack), so the free energy is roughly `$L(2J - k_BT\ln3)$`: walls are suppressed below `$k_BT \approx 2J/\ln3 = 1.82J$`, and long-range order exists at low `$T$`. This is a rigorous lower bound on `$T_c$`.

**Kramers-Wannier duality.** The high-temperature expansion of `$Z$` (in powers of `$\tanh K$`, counting closed loops of bonds) equals the low-temperature expansion (in powers of `$e^{-2K^*}$`, counting domain walls on the dual lattice) when

```math
\tanh K^* = e^{-2K} \iff \sinh2K\,\sinh2K^* = 1
```

The square lattice is its own dual. If there is one critical point, it is self-dual: `$\sinh2K_c = 1$`, so

```math
K_c = \tfrac12\ln(1 + \sqrt2) = 0.4407, \qquad k_BT_c = \frac{2J}{\ln(1 + \sqrt2)} = 2.269J
```

**Onsager and Yang.** Onsager solved the zero-field 2D model exactly in 1944; Yang derived the spontaneous magnetisation in 1952:

```math
m = \left[1 - \sinh^{-4}(2\beta J)\right]^{1/8}\ \ (T < T_c), \qquad C \sim -\ln|T - T_c|
```

so `$\beta = 1/8$` and `$\alpha = 0$` (logarithmic). At `$T = 0.9T_c$`, `$m = 0.896$`, much larger than mean field's 0.525 at the same reduced temperature, because the exact curve is so steep (`$\beta = 1/8$`). The other exponents are `$\gamma = 7/4$`, `$\nu = 1$`, `$\eta = 1/4$`, `$\delta = 15$`. No exact solution exists in 3D or in 2D with a field.

<div class="meaning">

<dl>
<dt>K = J/k<sub>B</sub>T</dt><dd>reduced coupling; large K is low temperature</dd>
<dt>Transfer matrix</dt><dd>T<sub>ss′</sub> = e<sup>Kss′ + βh(s + s′)/2</sup>; Z = Tr T<sup>N</sup>; the largest eigenvalue gives f, the ratio of the two gives ξ</dd>
<dt>ξ</dt><dd>correlation length: ⟨s<sub>0</sub>s<sub>r</sub>⟩ − m² ~ e<sup>−r/ξ</sup>; diverges at a critical point</dd>
<dt>Duality</dt><dd>exact map between the high- and low-temperature expansions of Z</dd>
<dt>Physical meaning</dt><dd>Whether a system orders is decided by how the energy cost of a domain wall grows with its size compared with its entropy. Dimension and symmetry decide it; the details of the lattice only shift T<sub>c</sub>.</dd>
</dl>

</div>

## 4. Approximations compared

Mean field replaces neighbours by their average, `$m = \tanh[\beta(zJm + h)]$`, giving `$k_BT_c = zJ$` and `$\beta = \tfrac12$`, `$\gamma = 1$`, `$\delta = 3$`. It ignores fluctuations, so it overestimates `$T_c$` and predicts a transition even in 1D. The **Bethe approximation** treats one spin and its `$z$` neighbours exactly, with the rest as a field on the neighbours:

```math
k_BT_c^{\rm Bethe} = \frac{2J}{\ln\dfrac{z}{z - 2}}
```

| Lattice | `$z$` | Mean field | Bethe | Exact |
|---|---|---|---|---|
| chain | 2 | `$2J$` | 0 (correct) | 0 |
| square | 4 | `$4J$` | `$2.885J$` | `$2.269J$` |
| simple cubic | 6 | `$6J$` | `$4.933J$` | `$4.511J$` (numerical) |

Bethe is exact on a tree (Bethe lattice) and gets 1D right, but its exponents are still mean-field.

**Monte Carlo.** For anything not solvable, simulate. The **Metropolis** rule: pick a spin, compute the energy change `$\Delta E = 2Js_i\sum_js_j + 2hs_i$` of flipping it, flip if `$\Delta E \le 0$`, otherwise flip with probability `$e^{-\beta\Delta E}$`. This obeys detailed balance, so the spins sample the Boltzmann distribution. On the square lattice in zero field, `$\Delta E \in \{-8J, -4J, 0, 4J, 8J\}$`, and only `$e^{-4K}$` and `$e^{-8K}$` need computing. Near `$T_c$` domains become huge and decorrelate slowly (**critical slowing down**, relaxation time `$\sim\xi^z$` with `$z \approx 2.17$` for Metropolis); cluster algorithms (Wolff, Swendsen-Wang) flip whole domains and avoid it. Finite lattices round the transition; the **Binder cumulant** `$U = 1 - \langle m^4\rangle/3\langle m^2\rangle^2$` goes from 0 (disordered, Gaussian `$m$`) to `$\tfrac23$` (ordered), and its curves for different sizes cross at `$T_c$`.

<figure class="fig" data-fig="ising-mc"><figcaption>A 64 × 64 Ising lattice updated by the Metropolis rule. Move the temperature slider and watch |m| settle against the exact Onsager-Yang curve (dashed). Near kT<sub>c</sub> = 2.269 J domains of every size appear and the simulation slows down; well above it the lattice looks like noise.</figcaption></figure>

## 5. Landau theory beyond the basics

Landau's free energy is a power series in the order parameter allowed by symmetry. With `$m \to -m$` symmetry and `$b > 0$`, the transition is continuous (see the GATE lesson). Three extensions come up in NET.

**A cubic term** (no `$m \to -m$` symmetry, for example the nematic-isotropic transition or a three-state Potts model): `$F = am^2 - cm^3 + bm^4$`. A non-zero minimum appears before `$a$` reaches zero, and the transition is first order at `$a = c^2/4b$` with jump `$m = c/2b$`.

**Negative quartic term:** `$F = \alpha m^2 - \beta m^4 + \gamma m^6$`, `$\alpha = a(T - T_0)$`.

<div class="steps">
<div class="step"><p><b>Coexistence.</b> The ordered minimum is level with m = 0 when F(m) = 0 and F′(m) = 0 together: α − βm² + γm⁴ = 0 and α − 2βm² + 3γm⁴ = 0.</p></div>
<div class="step"><p><b>Solve.</b> Subtracting gives m² = β/2γ, and then α = β²/4γ.</p></div>
<div class="step"><p><b>Transition.</b> First order at T₁ = T₀ + β²/(4aγ), where m jumps from 0 to √(β/2γ) and a latent heat T₁ΔS = aT₁β/(2γ) is released.</p></div>
<div class="step"><p><b>Spinodals.</b> The m = 0 state stays metastable down to T₀ (supercooling limit), and the ordered state up to T₀ + β²/(3aγ) (superheating limit), so hysteresis spans that range.</p></div>
</div>

When the quartic coefficient passes through zero, the line of continuous transitions turns first order at a **tricritical point**. There `$F = \alpha m^2 + \gamma m^6$` and `$m \propto (T_c - T)^{1/4}$`: `$\beta = \tfrac14$`, `$\gamma = 1$`, `$\delta = 5$`, `$\alpha = \tfrac12$`. Helium-3/helium-4 mixtures show one.

**Ginzburg-Landau.** Let `$m$` vary in space and charge for gradients:

```math
F = \int d^dr\left[\tfrac12\kappa(\nabla m)^2 + am^2 + bm^4 - hm\right]
```

A small field `$h(\vec r)$` gives the Ornstein-Zernike correlation `$G(k) \propto 1/(k^2 + \xi^{-2})$` with `$\xi = \sqrt{\kappa/2a} \propto |T - T_c|^{-1/2}$`, so `$\nu = \tfrac12$` and `$\eta = 0$`. Below `$T_c$`, `$\xi = \sqrt{\kappa/4|a|}$`, a factor `$\sqrt2$` shorter at the same `$|T - T_c|$`. The same functional, with complex `$\psi$` and a vector potential, is the Ginzburg-Landau theory of superconductors.

**When does mean field fail? (Ginzburg criterion).** The mean square fluctuation of `$m$` averaged over a correlation volume, `$k_BT\chi/\xi^d$`, compared with `$m^2$` itself, scales as `$|t|^{d\nu - \gamma - 2\beta} = |t|^{(d - 4)/2}$` with mean-field exponents. For `$d > 4$` they vanish at the transition and mean field is exact; for `$d < 4$` they win close enough to `$T_c$`. `$d = 4$` is the **upper critical dimension**. In conventional superconductors the window where fluctuations matter is only about `$10^{-14}$` of `$T_c$` wide, which is why BCS mean field works so well there.

<div class="myth">

**"Mean-field theory is a rough guess that is wrong everywhere."** It is wrong near `$T_c$` in low dimensions, where fluctuations dominate. But it is exact above four dimensions, exact for infinite-range interactions, accurate far from `$T_c$`, and nearly exact for conventional superconductors and many structural transitions with a long interaction range. Its predictions of `$T_c$` are upper bounds, and its exponents are the starting point for the renormalisation group.

</div>

<div class="keypoints">

- Small clusters: enumerate. Pair `$Z = 4\cosh K$`; triangle `$2e^{3K} + 6e^{-K}$`; antiferromagnetic triangle is frustrated, ground-state entropy `$k_B\ln6$`.
- 1D: `$Z = \lambda_+^N + \lambda_-^N$`, `$\lambda_\pm = 2\cosh K, 2\sinh K$` at `$h = 0$`; `$f = -k_BT\ln(2\cosh K)$`; `$\langle s_0s_r\rangle = \tanh^rK$`, `$\xi = -1/\ln\tanh K$`; no order at `$T > 0$` (one wall: `$2J - k_BT\ln N$`).
- 2D: Peierls proves order; duality `$\sinh2K\sinh2K^* = 1$` gives `$k_BT_c = 2J/\ln(1 + \sqrt2) = 2.269J$`; `$m = [1 - \sinh^{-4}2K]^{1/8}$`; `$\beta = 1/8$`, `$\gamma = 7/4$`, `$\nu = 1$`, `$\eta = 1/4$`, `$\delta = 15$`, `$\alpha = 0$` (log).
- `$T_c$`: mean field `$zJ$` > Bethe `$2J/\ln[z/(z - 2)]$` > exact.
- Metropolis: accept with `$\min(1, e^{-\beta\Delta E})$`; critical slowing down; Binder cumulant 0 to 2/3, crossing at `$T_c$`.
- Landau: cubic term or negative quartic gives first order (`$\alpha = \beta^2/4\gamma$`, `$m^2 = \beta/2\gamma$`); tricritical `$\beta = 1/4$`; Ginzburg-Landau `$\xi \propto |t|^{-1/2}$`, Ornstein-Zernike; upper critical dimension 4.

</div>

## Practise: exam questions on this lesson

NET Part C style, each with a full solution. More on the [CSIR NET Physics practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="ising-landau" data-exam="net" data-n="10"></div>

**Next:** [the kinetic theory of transport](/learn/courses/csir-net-physics/transport/), from mean free paths to viscosity, conductivity and the Boltzmann equation. Watch domains grow on a larger lattice in fibub's [Ising model simulator](/science/ising-model/).
