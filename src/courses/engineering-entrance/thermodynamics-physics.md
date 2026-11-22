---
title: Thermodynamics
seoTitle: 'Thermodynamics: JEE and NEET physics'
summary: 'The zeroth and first laws, internal energy and work on P-V diagrams, isothermal, adiabatic, isobaric, isochoric and polytropic processes, molar specific heats, cyclic processes, heat engines, the Carnot engine, refrigerators and heat pumps, the second law and entropy.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'In an adiabatic expansion of an ideal gas:'
    choices: ['the temperature rises', 'the temperature falls', 'the temperature stays the same', 'heat flows in']
    ans: 1
    why: 'No heat flows (Q = 0). The gas does work, so by the first law ΔU = −W is negative: its internal energy, and so its temperature, falls.'
  - q: 'In a complete cycle, the change in internal energy of the gas is:'
    choices: ['equal to the work done', 'equal to the heat absorbed', 'zero', 'negative']
    ans: 2
    why: 'Internal energy depends only on the state. A cycle returns to the starting state, so ΔU = 0 and the net heat in equals the net work out.'
  - q: 'A Carnot engine works between 500 K and 300 K. Its efficiency is:'
    choices: ['40%', '60%', '67%', '100%']
    ans: 0
    why: 'η = 1 − T_c/T_h = 1 − 300/500 = 0.4. No real engine between these temperatures can do better.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Thermodynamics'
  - 'Molar gas constant R = 8.314 462 618 J mol⁻¹ K⁻¹ (exact in the 2019 SI), CODATA 2018 via NIST https://physics.nist.gov/cgi-bin/cuu/Value?r'
---

**Physics · Class 11 · about 36 minutes.** By the end you will be able to apply the first law to any process, find work from a P-V graph, use the formulas for the four standard processes, analyse cycles, and work out the efficiency of engines and the performance of refrigerators.

<div class="bigidea">Heat and work are two ways of moving energy into a gas. What the gas keeps is its internal energy, which for an ideal gas depends only on its temperature. The first law is energy bookkeeping; the second law says you can never turn all the heat into work.</div>

## 1. The zeroth and first laws

**Zeroth law:** if A and B are each in thermal equilibrium with C, they are in equilibrium with each other. That is what lets a thermometer work, and it defines temperature.

**First law:**

```math
Q = \Delta U + W
```

<div class="meaning">
<dl>
<dt>Q</dt><dd>heat given to the gas (positive when heat flows in)</dd>
<dt>ΔU</dt><dd>change in internal energy; for an ideal gas ΔU = nC_vΔT in every process</dd>
<dt>W</dt><dd>work done by the gas, ∫P dV (positive when it expands)</dd>
<dt>γ</dt><dd>C_p/C_v: 5/3 for monatomic, 7/5 for diatomic gases</dd>
<dt>Physical meaning</dt><dd>Heat in either stays in the gas as faster molecules or leaves as work pushing a piston. Nothing is lost.</dd>
</dl>
</div>

Q and W depend on the path; U is a **state function** that depends only on the state (P, V, T). That is why `$\Delta U = nC_v\Delta T$` holds even when the volume is not constant.

## 2. Work on a P-V diagram

`$W = \int P\,dV$` is the **area under the curve** on a P-V graph. Expansion gives positive work, compression negative. Around a **cycle**, the net work is the area enclosed: clockwise means the gas does net work (an engine), anticlockwise means work is done on it (a refrigerator).

Pick a process below and watch the work area and the energy split.

<figure class="fig" data-fig="pv-processes"><figcaption>One mole of ideal gas starting at 300 K and 1 atm. The slider sets the end volume as a multiple of the start (the end pressure for the isochoric case). The shaded area is the work done by the gas; the readout splits the heat by the first law.</figcaption></figure>

## 3. The four standard processes

| Process | Constant | Work by gas W | Heat Q | ΔU |
|---|---|---|---|---|
| Isochoric | V | 0 | `$nC_v\Delta T$` | = Q |
| Isobaric | P | `$P\Delta V = nR\Delta T$` | `$nC_p\Delta T$` | `$nC_v\Delta T$` |
| Isothermal | T (PV = constant) | `$nRT\ln\dfrac{V_2}{V_1}$` | = W | 0 |
| Adiabatic | Q = 0 (`$PV^\gamma$` = constant) | `$\dfrac{P_1V_1 - P_2V_2}{\gamma - 1} = \dfrac{nR(T_1 - T_2)}{\gamma - 1}$` | 0 | = −W |

<div class="problem" data-problem="td-isothermal-work"></div>

- Adiabatic forms: `$PV^\gamma$`, `$TV^{\gamma - 1}$` and `$T^\gamma P^{1 - \gamma}$` are constant.
- On a P-V graph, an adiabatic curve is **steeper** than an isothermal one through the same point, by a factor γ (slope −γP/V against −P/V).
- **Polytropic** process `$PV^x$` = constant: `$W = \dfrac{nR\Delta T}{1 - x}$` with sign care, and molar heat `$C = C_v + \dfrac{R}{1 - x}$`. x = 0 is isobaric, 1 isothermal, γ adiabatic, ∞ isochoric.
- **Free expansion** into a vacuum: no work, no heat, so ΔU = 0 and T stays the same for an ideal gas.

<div class="problem" data-problem="td-adiabatic-temp"></div>

<div class="myth">

**"Heat and temperature are the same; if you add heat, the temperature must rise."** In an isothermal expansion, heat flows in and the temperature stays the same: all of it leaves as work. In an adiabatic compression, no heat flows in and the temperature still rises.

</div>

## 4. Molar specific heats of gases

At constant volume, all heat goes into U: `$C_v$`. At constant pressure, part goes into work too, so `$C_p > C_v$`. **Mayer's relation:** `$C_p - C_v = R$`.

| Gas | Degrees of freedom f | C_v | C_p | γ |
|---|---|---|---|---|
| Monatomic (He, Ar) | 3 | `$\tfrac32R$` | `$\tfrac52R$` | 5/3 ≈ 1.67 |
| Diatomic (O₂, N₂), room temperature | 5 | `$\tfrac52R$` | `$\tfrac72R$` | 7/5 = 1.4 |
| Rigid polyatomic | 6 | 3R | 4R | 4/3 |

In general `$C_v = \tfrac f2R$` and `$\gamma = 1 + \dfrac2f$`. For a mixture, add the n C_v values and divide by the total moles.

## 5. Heat engines and refrigerators

A **heat engine** takes heat Q_h from a hot source, does work W, and rejects Q_c to a cold sink: `$W = Q_h - Q_c$`, efficiency `$\eta = \dfrac{W}{Q_h} = 1 - \dfrac{Q_c}{Q_h}$`.

A **refrigerator** runs backwards: work W moves heat Q_c out of the cold space and dumps Q_h = Q_c + W outside. Its coefficient of performance `$\beta = \dfrac{Q_c}{W}$`. A **heat pump** warms a house: its performance is `$Q_h/W = \beta + 1$`.

**The Carnot engine** (two isothermals and two adiabatics, all reversible) is the best possible between two temperatures:

```math
\eta_{Carnot} = 1 - \frac{T_c}{T_h}, \qquad \beta_{Carnot} = \frac{T_c}{T_h - T_c}
```

with temperatures in kelvin. Its efficiency depends only on the two temperatures, not on the working gas.

<div class="problem" data-problem="td-carnot-fridge"></div>

Step through one full cycle of a petrol-engine-like (Otto) cycle, watching the piston and the loop on the P-V diagram together. Then try the Carnot cycle and compare efficiencies.

<div class="steps" data-fig="@wt-engine-cycle"><div class="step"><b>Compression (adiabatic).</b> The piston squeezes the gas with no heat flow, so the temperature and pressure rise.</div><div class="step"><b>Heat added at constant volume.</b> The spark raises the pressure sharply; the piston has not moved yet, so no work is done in this stroke.</div><div class="step"><b>Power stroke (adiabatic).</b> The hot gas pushes the piston out and does more work than was spent on compression.</div><div class="step"><b>Heat rejected at constant volume.</b> The exhaust carries away Q_c; the loop closes. The area inside the loop is the net work per cycle.</div></div>


## 6. The second law and entropy

- **Kelvin-Planck:** no engine working in a cycle can turn all the heat it takes in into work. So η < 1 always.
- **Clausius:** heat cannot flow by itself from a colder body to a hotter one; a refrigerator needs work.

**Entropy** S measures how spread out energy is. For a reversible change, `$dS = dQ/T$`. Melting m kg of ice at 0 °C: `$\Delta S = mL/273$`. In any real (irreversible) process in an isolated system, total entropy rises; in a reversible one, it stays the same. Heat flowing from hot to cold always increases total entropy.

<div class="myth">

**"A perfect engine just needs a perfect, friction-free design."** Even a perfect, reversible engine must throw some heat into a cold sink. Between 600 K and 300 K, no engine of any design can turn more than half the heat into work.

</div>

**Worked example (level 4, cycle).** One mole of a monatomic gas goes A → B at constant volume (P doubles from P₀), B → C at constant pressure (V doubles from V₀), and back to A along a straight line. Net work = area of the triangle = ½ × V₀ × P₀ = ½P₀V₀. Heat in: A → B, `$\tfrac32V_0P_0$`; B → C, `$\tfrac52 \times 2P_0V_0 = 5P_0V_0$`. So η = 0.5/6.5 ≈ **7.7%**, far below the Carnot value of 1 − T_A/T_C = 1 − 1/4 = 75%.

<div class="keypoints">

- Q = ΔU + W; ΔU = nC_vΔT for any process of an ideal gas; U is a state function.
- Work = area under P-V; net work of a cycle = enclosed area (clockwise: engine).
- Isothermal W = nRT ln(V₂/V₁); adiabatic PV^γ constant, W = nRΔT/(γ − 1) (with T₁ − T₂).
- Adiabatic curves are γ times steeper than isothermals on P-V.
- C_p − C_v = R; C_v = (f/2)R; γ = 1 + 2/f: 5/3 monatomic, 7/5 diatomic.
- Engine η = 1 − Q_c/Q_h; Carnot η = 1 − T_c/T_h; refrigerator β = T_c/(T_h − T_c).
- Second law: no engine is 100% efficient; entropy of an isolated system never falls; dS = dQ/T.

</div>
