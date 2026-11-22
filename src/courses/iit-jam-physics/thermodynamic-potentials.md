---
title: 'Thermodynamic potentials and Maxwell relations'
seoTitle: Thermodynamic potentials, Maxwell relations for IIT JAM
summary: 'The four energies U, H, F and G, their natural variables, how to write all four Maxwell relations in seconds, and how to use them for Cp − Cv, the energy equation, Joule and Joule–Thomson expansions, equilibrium, chemical potential and magnetic cooling.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: Which potential is a minimum at equilibrium for a system held at fixed temperature and volume?
    choices: ['Helmholtz energy F', 'Gibbs energy G', 'Enthalpy H', 'Internal energy U']
    ans: 0
    why: At fixed T and V the second law becomes dF ≤ 0, so F falls to a minimum. G plays that role at fixed T and P.
  - q: Which Maxwell relation follows from dF = −S dT − P dV?
    choices: ['(∂S/∂V)_T = (∂P/∂T)_V', '(∂S/∂V)_T = −(∂P/∂T)_V', '(∂S/∂P)_T = −(∂V/∂T)_P', '(∂T/∂V)_S = −(∂P/∂S)_V']
    ans: 0
    why: Equal mixed derivatives of F give −(∂S/∂V)_T = −(∂P/∂T)_V, and the two minus signs cancel. The third option comes from G, the fourth from U.
  - q: "Throttling (Joule–Thomson expansion): which quantity stays the same?"
    choices: ['Enthalpy', 'Internal energy', 'Entropy', 'Temperature']
    ans: 0
    why: The gas behind pushes with P₁V₁ and the gas in front is pushed with P₂V₂, with no heat flow, so U + PV is unchanged. Entropy rises because throttling is irreversible.
sources:
  - 'H. B. Callen, Thermodynamics and an Introduction to Thermostatistics, 2nd ed. (Wiley, 1985), chapters 5 to 7'
  - 'M. W. Zemansky and R. H. Dittman, Heat and Thermodynamics, 7th ed. (McGraw-Hill, 1997), chapters 9 and 10'
  - 'S. J. Blundell and K. M. Blundell, Concepts in Thermal Physics, 2nd ed. (Oxford, 2010), chapters 16 and 17'
  - 'IIT JAM Physics syllabus (Kinetic theory and thermodynamics section), published by the organising IIT each year'
---

**Module 5 · about 45 minutes.** By the end you will be able to write `$dU$`, `$dH$`, `$dF$` and `$dG$` from memory, read off temperature, pressure, entropy and volume as derivatives, produce all four Maxwell relations with the right signs, and use them to answer the standard JAM questions on `$C_P - C_V$`, free and throttled expansions, equilibrium and magnetic cooling.

<div class="bigidea">One energy, four ways of keeping its books. Pick the potential whose natural variables are the ones you control, and thermodynamics turns into ordinary calculus.</div>

## 1. Start from the fundamental relation

Combine the first law `$dQ = dU + P\,dV$` with the second `$dQ_{\rm rev} = T\,dS$`:

```math
dU = T\,dS - P\,dV
```

This holds between any two nearby equilibrium states, reversible path or not, because every term is a state function. It says `$U$` is naturally a function of `$S$` and `$V$`, and that

```math
\left(\frac{\partial U}{\partial S}\right)_V = T, \qquad \left(\frac{\partial U}{\partial V}\right)_S = -P
```

But nobody controls entropy in the lab. We control `$T$` and `$P$`. So we change the bookkeeping by subtracting products of conjugate pairs (`$T$` with `$S$`, `$P$` with `$V$`). This is a **Legendre transform**.

## 2. The four potentials

| Potential | Definition | Differential | Natural variables | Minimum at equilibrium when fixed |
|---|---|---|---|---|
| internal energy `$U$` | | `$T\,dS - P\,dV$` | `$S, V$` | `$S, V$` |
| enthalpy `$H$` | `$U + PV$` | `$T\,dS + V\,dP$` | `$S, P$` | `$S, P$` |
| Helmholtz `$F$` | `$U - TS$` | `$-S\,dT - P\,dV$` | `$T, V$` | `$T, V$` |
| Gibbs `$G$` | `$H - TS$` | `$-S\,dT + V\,dP$` | `$T, P$` | `$T, P$` |

<div class="meaning">

<dl>
<dt>H</dt><dd>heat taken in at constant pressure: dH = dQ when dP = 0</dd>
<dt>F</dt><dd>the most work a system can do at constant temperature: W ≤ −ΔF</dd>
<dt>G</dt><dd>the most useful (non-PV) work at constant T and P, e.g. from a battery or a cell: W<sub>other</sub> ≤ −ΔG</dd>
<dt>Physical meaning</dt><dd>Each potential is the energy that is "free" to use under its own conditions; the TS term is the part locked up as disorder.</dd>
</dl>

</div>

From the differentials you can read off derivatives directly: `$(\partial F/\partial V)_T = -P$`, `$(\partial G/\partial T)_P = -S$`, `$(\partial G/\partial P)_T = V$`, and so on. The last gives, for an ideal gas at constant `$T$`, `$\Delta G = nRT\ln(P_2/P_1)$`, even though `$\Delta U = \Delta H = 0$` there.

**Gibbs–Helmholtz.** Since `$S = -(\partial G/\partial T)_P$`, `$H = G + TS = G - T(\partial G/\partial T)_P$`. For a reaction with `$\Delta H = -50$` kJ and `$\Delta S = -100$` J/K, `$\Delta G = \Delta H - T\Delta S < 0$` only below `$T = 500$` K.

## 3. Maxwell relations in thirty seconds

For a smooth function, the order of mixed partial derivatives does not matter. Apply that to each potential:

<div class="steps">
<div class="step"><p><b>Pick a potential.</b> For example dF = −S dT − P dV, so (∂F/∂T)<sub>V</sub> = −S and (∂F/∂V)<sub>T</sub> = −P.</p></div>
<div class="step"><p><b>Cross-differentiate.</b> ∂/∂V of the first equals ∂/∂T of the second: −(∂S/∂V)<sub>T</sub> = −(∂P/∂T)<sub>V</sub>.</p></div>
<div class="step"><p><b>Tidy the signs.</b> The two minus signs cancel: (∂S/∂V)<sub>T</sub> = (∂P/∂T)<sub>V</sub>.</p></div>
<div class="step"><p><b>Sign rule.</b> Count the minus signs in the differential. An even number (F: two, H: none) gives a plus sign in the relation; an odd number (U, G: one each) gives a minus.</p></div>
</div>

```math
\left(\frac{\partial T}{\partial V}\right)_S = -\left(\frac{\partial P}{\partial S}\right)_V \quad
\left(\frac{\partial T}{\partial P}\right)_S = \left(\frac{\partial V}{\partial S}\right)_P \quad
\left(\frac{\partial S}{\partial V}\right)_T = \left(\frac{\partial P}{\partial T}\right)_V \quad
\left(\frac{\partial S}{\partial P}\right)_T = -\left(\frac{\partial V}{\partial T}\right)_P
```

Why bother? The right-hand sides are things you can measure (how pressure or volume change with temperature). The left-hand sides involve entropy, which you cannot measure directly. Maxwell relations trade the second for the first.

**Two calculus tools you will need.** The cyclic rule `$(\partial x/\partial y)_z(\partial y/\partial z)_x(\partial z/\partial x)_y = -1$`, and the response functions `$\alpha = \frac1V(\partial V/\partial T)_P$` (expansion) and `$\kappa_T = -\frac1V(\partial V/\partial P)_T$` (compressibility). Together: `$(\partial P/\partial T)_V = \alpha/\kappa_T$`. That is why a liquid sealed in a rigid vessel builds up enormous pressure when warmed: about 9 MPa for 2 K if `$\alpha = 1.8\times10^{-4}$` K⁻¹ and `$\kappa_T = 4\times10^{-11}$` Pa⁻¹.

## 4. What they buy you

**The energy equation.** From `$dU = T\,dS - P\,dV$` and the `$F$` relation:

```math
\left(\frac{\partial U}{\partial V}\right)_T = T\left(\frac{\partial P}{\partial T}\right)_V - P
```

For an ideal gas this is `$T(nR/V) - P = 0$`: `$U$` depends only on `$T$`, proved rather than assumed. For a van der Waals gas it is `$an^2/V^2$`, the "internal pressure" of the attractions.

**`$C_P - C_V$` for anything.**

```math
C_P - C_V = T\left(\frac{\partial P}{\partial T}\right)_V\left(\frac{\partial V}{\partial T}\right)_P = \frac{TV\alpha^2}{\kappa_T}
```

For an ideal gas it gives `$nR$`. For a liquid at 300 K with `$V = 1.8\times10^{-5}$` m³/mol, `$\alpha = 2.1\times10^{-4}$` K⁻¹, `$\kappa_T = 4.5\times10^{-10}$` Pa⁻¹, it is only 0.53 J mol⁻¹ K⁻¹, which is why tables of solids and liquids rarely bother to distinguish `$C_P$` from `$C_V$`. Since `$\alpha$` is squared, `$C_P \ge C_V$` always. A companion result: `$\kappa_T/\kappa_S = C_P/C_V = \gamma$`.

**Free (Joule) expansion.** `$U$` is constant. For one mole of a van der Waals gas `$U = C_VT - a/V$` (integrate the energy equation), so the gas *cools*: `$\Delta T = \frac{a}{C_V}\left(\frac1{V_2} - \frac1{V_1}\right) < 0$`. One mole with `$a = 0.14$` Pa m⁶ mol⁻², `$C_V = \tfrac52R$`, doubling from 1 L to 2 L, cools by about 3.4 K.

<div class="problem" data-problem="vdw-free-expansion"></div>

**Throttling (Joule–Thomson).** Gas forced steadily through a porous plug keeps its *enthalpy* constant. Its temperature change per unit pressure drop is

```math
\mu_{JT} = \left(\frac{\partial T}{\partial P}\right)_H = \frac{V}{C_P}\left(T\alpha - 1\right) \approx \frac{1}{C_P}\left(\frac{2a}{RT} - b\right)\ \text{(dilute van der Waals)}
```

`$\mu_{JT} = 0$` for an ideal gas (`$\alpha = 1/T$`). For a real gas it is positive (cooling on expansion) below the inversion temperature `$T_i \approx 2a/Rb$` and negative above it. Nitrogen inverts far above room temperature, so it cools when throttled; hydrogen and helium invert below room temperature and must be pre-cooled. This is how gases are liquefied.

<div class="myth">

**"A gas always cools when it expands."** It depends on the process. An ideal gas in a free expansion keeps its temperature; a real gas in a free expansion cools a little; a real gas throttled above its inversion temperature *warms*; and any gas cools in a reversible adiabatic expansion because it does work. Ask first: which quantity is constant, `$U$`, `$H$` or `$S$`?

</div>

## 5. Equilibrium, chemical potential and magnets

**Stability.** At equilibrium the right potential is a minimum. That forces `$C_V > 0$` and `$\kappa_T > 0$`, and hence `$C_P \ge C_V$`. But `$\alpha$` may be negative (water between 0 and 4 °C).

**Chemical potential.** With particle number allowed to change, `$dG = -S\,dT + V\,dP + \mu\,dN$`. Since `$G$` is extensive in `$N$` only, `$G = \mu N$`: the chemical potential is the Gibbs energy per particle. Differentiating gives the **Gibbs–Duhem** relation `$S\,dT - V\,dP + N\,d\mu = 0$`. For an ideal gas, `$\mu = \mu_0(T) + kT\ln(P/P_0)$`. Two phases coexist when their `$\mu$` are equal, which is the starting point of lesson 5.5.

**Magnetic systems.** For a paramagnet, replace `$-P\,dV$` by `$B\,dM$`. The Maxwell relation from `$G(T, B)$` is `$(\partial S/\partial B)_T = (\partial M/\partial T)_B$`. For Curie's law `$M = CB/T$` this is negative: magnetising at constant `$T$` orders the spins and releases heat. Then removing the field adiabatically keeps `$S$`, hence `$B/T$`, fixed: from 1 K at 2 T down to 0.05 T gives 0.025 K. This is adiabatic demagnetisation.

**Worked example (a fundamental relation).** If `$U = AS^3/(NV)$`, then `$T = (\partial U/\partial S)_V = 3U/S$` and `$P = -(\partial U/\partial V)_S = U/V$`. One potential in its natural variables contains every equation of state. Check numbers for real systems with fibub's [partition function explorer](/science/partition-function/) and the [real gas calculator](/science/real-gas-calculator/).

<div class="keypoints">

- `$dU = T\,dS - P\,dV$`, `$dH = T\,dS + V\,dP$`, `$dF = -S\,dT - P\,dV$`, `$dG = -S\,dT + V\,dP$`.
- At equilibrium: `$F$` minimum at fixed `$T, V$`; `$G$` minimum at fixed `$T, P$`. `$-\Delta G$` is the maximum useful work.
- Maxwell relations: cross-differentiate; an odd number of minus signs in the differential gives a minus sign.
- `$(\partial U/\partial V)_T = T(\partial P/\partial T)_V - P$`; `$C_P - C_V = TV\alpha^2/\kappa_T$`; `$\kappa_T/\kappa_S = \gamma$`.
- Joule expansion: `$U$` constant. Joule–Thomson: `$H$` constant, `$\mu_{JT} = \frac{V}{C_P}(T\alpha - 1)$`, inversion near `$2a/Rb$`.
- `$\mu = G/N$`; Gibbs–Duhem `$S\,dT - V\,dP + N\,d\mu = 0$`. Paramagnets: `$S = f(B/T)$`, so adiabatic demagnetisation cools in proportion to `$B$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [thermodynamic potentials practice page](/learn/courses/iit-jam-physics/practice/thermodynamic-potentials/).

<div class="qbank" data-bank="physics" data-topics="thermodynamic-potentials" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 5.3, the second law and entropy](/learn/courses/iit-jam-physics/second-law-entropy/). **Next:** lesson 5.5, phase changes and the Clausius–Clapeyron equation, which follows from equal chemical potentials. Going on to GATE? [Partition functions and free energy](/learn/courses/gate-physics/) computes `$F = -kT\ln Z$` directly from the energy levels.
