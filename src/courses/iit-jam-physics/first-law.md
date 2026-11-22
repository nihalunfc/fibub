---
title: 'The first law: work, heat and processes'
seoTitle: First law of thermodynamics for IIT JAM Physics
summary: 'Internal energy, heat and work, the sign convention, and how an ideal gas behaves in isothermal, adiabatic, isobaric, isochoric and polytropic processes, with PV diagrams, cycles, free expansion and the irreversible-process traps JAM sets.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: An ideal gas is compressed quickly in an insulated cylinder. Taking W as the work done by the gas, which is right?
    choices: ['W < 0 and the gas gets hotter', 'W > 0 and the gas gets colder', 'W = 0 and nothing changes', 'W < 0 and the temperature stays the same']
    ans: 0
    why: The surroundings push on the gas, so the work done by the gas is negative. With no heat flow, ΔU = −W > 0 and the temperature rises.
  - q: From the same starting state, a gas doubles its volume isothermally or adiabatically (both reversible). In which case does it do more work?
    choices: ['Isothermal', 'Adiabatic', 'The same in both', 'It depends on the gas']
    ans: 0
    why: Work is the area under the curve. The adiabat falls more steeply (slope γ times the isotherm's), so it encloses less area.
  - q: "Free expansion of an ideal gas into vacuum: what happens to its temperature?"
    choices: ['It stays the same', 'It falls because the gas expands', 'It rises', 'It falls to absolute zero']
    ans: 0
    why: No heat (insulated) and no work (nothing to push against), so ΔU = 0. For an ideal gas U depends only on T, so T is unchanged.
sources:
  - 'M. W. Zemansky and R. H. Dittman, Heat and Thermodynamics, 7th ed. (McGraw-Hill, 1997), chapters 3 and 4'
  - 'S. J. Blundell and K. M. Blundell, Concepts in Thermal Physics, 2nd ed. (Oxford, 2010), chapters 11 and 12'
  - 'H. B. Callen, Thermodynamics and an Introduction to Thermostatistics, 2nd ed. (Wiley, 1985), chapter 1'
  - 'IIT JAM Physics syllabus (Kinetic theory and thermodynamics section), published by the organising IIT each year'
---

**Module 5 · about 40 minutes.** By the end you will be able to keep the books of any process with `$Q = \Delta U + W$`, read work off a PV diagram, find the heat, work and temperature change for every standard process of an ideal gas, work with polytropic processes and negative heat capacities, and spot when a formula needs the process to be reversible.

<div class="bigidea">Energy is conserved. Heat put into a system either raises its internal energy or leaves as work done on the surroundings.</div>

## 1. Internal energy, heat and work

A gas has an **internal energy** `$U$`: the total kinetic and potential energy of its molecules. `$U$` belongs to the state (pressure, volume, temperature), not to the history. Energy can cross the boundary in two ways:

- **heat** `$Q$`, flowing because of a temperature difference;
- **work** `$W$`, a force acting through a distance, for a gas `$W = \int P\,dV$`.

```math
Q = \Delta U + W \qquad\text{or, for a small step,}\qquad dQ = dU + P\,dV
```

<div class="meaning">

<dl>
<dt>Q</dt><dd>heat given to the gas (positive when it flows in)</dd>
<dt>W</dt><dd>work done by the gas on its surroundings (positive when the gas expands)</dd>
<dt>ΔU</dt><dd>change of internal energy; for an ideal gas ΔU = nC<sub>V</sub>ΔT in any process</dd>
<dt>Physical meaning</dt><dd>Q and W are energy in transit and depend on the path. Only their difference, ΔU, is fixed by the end states.</dd>
</dl>

</div>

**Sign warning.** Chemists often define `$W$` as the work done *on* the system and write `$\Delta U = Q + W$`. It is the same law. In every question, first find out which `$W$` is meant.

## 2. Work is an area

On a `$P$`–`$V$` diagram, `$W = \int P\,dV$` is the area under the path. Going to the right (expansion), the gas does positive work; to the left, negative. Two different paths between the same states have different areas, so different `$W$`, and (since `$\Delta U$` is the same) different `$Q$`.

For a **cycle**, `$\Delta U = 0$`, so the net heat in equals the net work out, which equals the area enclosed. A clockwise cycle (with `$P$` up and `$V$` to the right) is an engine, `$W > 0$`; anticlockwise is a refrigerator.

<figure class="fig" data-fig="pv-processes"><figcaption>All four processes start at (P₀, V₀). The shaded area is the work. The readout keeps the books Q = ΔU + W; notice that the adiabat is always steeper than the isotherm.</figcaption></figure>

## 3. The four standard processes of an ideal gas

For `$n$` moles of an ideal gas, `$PV = nRT$`, `$\Delta U = nC_V\Delta T$`, and `$C_P - C_V = R$` (Mayer's relation: at constant pressure the gas also pushes the piston back, which costs an extra `$R$` per kelvin per mole).

| Process | Constant | Work by gas `$W$` | Heat `$Q$` | `$\Delta U$` |
|---|---|---|---|---|
| isochoric | `$V$` | 0 | `$nC_V\Delta T$` | `$nC_V\Delta T$` |
| isobaric | `$P$` | `$P\Delta V = nR\Delta T$` | `$nC_P\Delta T$` | `$nC_V\Delta T$` |
| isothermal | `$T$` | `$nRT\ln(V_2/V_1)$` | `$= W$` | 0 |
| adiabatic (reversible) | `$PV^{\gamma}$` | `$\frac{P_1V_1 - P_2V_2}{\gamma - 1} = nC_V(T_1 - T_2)$` | 0 | `$-W$` |

**Deriving the adiabat.** With `$dQ = 0$`: `$nC_V\,dT = -P\,dV = -nRT\,dV/V$`. So `$\frac{dT}{T} = -\frac{R}{C_V}\frac{dV}{V} = -(\gamma - 1)\frac{dV}{V}$`, which integrates to `$TV^{\gamma-1} = $` constant, and with `$T \propto PV$`, `$PV^{\gamma} = $` constant. The slope `$dP/dV = -\gamma P/V$` is `$\gamma$` times the isotherm's: the adiabat is steeper, which is why the adiabatic bulk modulus is `$\gamma P$` and the isothermal one `$P$`.

**Worked example (isothermal).** One mole at 300 K expands from 10 L to 30 L: `$W = RT\ln 3 = 8.314\times300\times1.0986 \approx 2.74$` kJ, all supplied as heat. Using `$P\Delta V$` here is the classic slip: the pressure falls all the way.

**Worked example (adiabatic).** Air (`$\gamma = 1.4$`) at 300 K is compressed to a tenth of its volume: `$T_2 = 300\times10^{0.4} \approx 754$` K, hot enough to ignite diesel fuel. The pressure grows by `$10^{1.4} \approx 25$`, not 10.

<div class="problem" data-problem="isothermal-adiabatic-work"></div>

## 4. Polytropic processes and negative heat capacity

Many real processes follow `$PV^n = $` constant for some `$n$`: `$n = 0$` is isobaric, `$n = 1$` isothermal, `$n = \gamma$` adiabatic, `$n \to \infty$` isochoric. Per mole:

```math
W = \frac{R(T_1 - T_2)}{n - 1}, \qquad C = C_V - \frac{R}{n - 1} = \frac{R(n - \gamma)}{(\gamma - 1)(n - 1)}
```

For `$1 < n < \gamma$` the heat capacity is **negative**: the gas absorbs heat yet cools, because it does more work than the heat it takes in.

**Worked example.** A rigid diatomic gas along `$PV^{1.2} = $` const: `$C = 2.5R - R/0.2 = -2.5R$`. Another: the straight line `$P \propto V$` is `$n = -1$`, giving `$C = C_V + R/2$`.

## 5. When the formulas need reversibility

`$Q = \Delta U + W$` always holds. But `$W = \int P\,dV$` with the gas's own pressure, and `$PV^{\gamma} = $` constant, need the gas to pass through equilibrium states (quasi-static). Three standard situations break this:

- **Free expansion** into vacuum: `$Q = 0$`, `$W = 0$`, so `$\Delta U = 0$` and an ideal gas keeps its temperature. It is adiabatic, but `$PV^{\gamma}$` is *not* constant.
- **Sudden compression** against a fixed external pressure `$P_{\rm ext}$`: the work done on the gas is `$P_{\rm ext}\Delta V$`. More work is done than in the slow compression to the same volume, so the gas ends up hotter.
- **Filling an empty tank** from a supply line at `$T_0$`: the line pushes each parcel in, so each brings its enthalpy `$C_PT_0$`, and the tank ends at `$\gamma T_0$`.

<div class="myth">

**"An adiabatic process always obeys `$PV^{\gamma} = $` constant."** Only a *reversible* adiabatic process does. A free expansion is adiabatic and keeps `$PV$` constant instead. For a sudden compression, work it out from `$\Delta U = -W$` with the external pressure, as in the example below.

</div>

**Worked example (sudden compression).** One mole of monatomic gas at 300 K and `$P_0$` is squeezed by a constant `$4P_0$`. First law: `$\tfrac32R(T_f - T_0) = 4P_0(V_0 - V_f) = R(4T_0 - T_f)$`, so `$T_f = 2.2T_0 = 660$` K. The reversible route to `$4P_0$` would give only 522 K.

## 6. Heat capacities, enthalpy and one cycle

**Enthalpy** `$H = U + PV$` is the natural energy at constant pressure: there `$Q = \Delta H$`. For an ideal gas `$\Delta H = nC_P\Delta T$` in any process, so in an adiabat `$\Delta H = \gamma\Delta U$`.

**Worked example (a cycle).** One mole of monatomic gas runs round the rectangle `$(P_0, V_0) \to (2P_0, V_0) \to (2P_0, 2V_0) \to (P_0, 2V_0) \to (P_0, V_0)$`. Net work = area `$= P_0V_0$`. Heat goes in only on the first two legs: `$\tfrac32P_0V_0 + \tfrac52(2P_0V_0) = 6.5P_0V_0$`. Efficiency `$= 1/6.5 \approx 15\%$`. Dividing by the *net* heat instead of the heat taken in is the trap. See many more cycles in fibub's [heat engine cycles tool](/science/heat-engine-cycles/).

<div class="keypoints">

- `$Q = \Delta U + W$` with `$W$` done by the gas; check the sign convention in every question.
- `$U$` and `$H$` are state functions; `$Q$` and `$W$` depend on the path. For an ideal gas `$\Delta U = nC_V\Delta T$` for any process.
- Work is the area under the `$P$`–`$V$` path; for a cycle it is the enclosed area, positive when clockwise.
- Isothermal: `$W = Q = nRT\ln(V_2/V_1)$`. Adiabatic: `$TV^{\gamma-1}$` and `$PV^{\gamma}$` constant, `$W = nC_V(T_1 - T_2)$`.
- Polytropic `$PV^n$`: `$C = C_V - R/(n-1)$`, negative for `$1 < n < \gamma$`.
- `$PV^{\gamma}$` needs a reversible process. For sudden or free processes, use the first law with the external pressure.

</div>

Run a heat engine round its loop and compare the net work with the heat taken in.

<figure class="fig" data-fig="@wt-engine-cycle"><figcaption>Over one cycle ΔU = 0, so net work W = Q_h − Q_c, which is the area of the loop. Notice how the loop and the efficiency change as you change the compression ratio or the hot temperature.</figcaption></figure>


## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [first law practice page](/learn/courses/iit-jam-physics/practice/first-law/).

<div class="qbank" data-bank="physics" data-topics="first-law" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 5.1, kinetic theory](/learn/courses/iit-jam-physics/kinetic-theory/), for where `$C_V$` and `$\gamma$` come from. **Next:** [lesson 5.3, the second law and entropy](/learn/courses/iit-jam-physics/second-law-entropy/), which says how much of the heat an engine can turn into work. Going on to GATE? The GATE Physics course builds the same ideas from [statistical mechanics](/learn/courses/gate-physics/ensembles/) in its thermodynamics module.
