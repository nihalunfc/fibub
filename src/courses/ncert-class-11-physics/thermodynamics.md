---
title: Thermodynamics
seoTitle: 'Thermodynamics Class 11 notes, first and second law'
summary: 'Class 11 Thermodynamics with animations: zeroth and first law, P-V processes, adiabatic relation, heat engines, refrigerators and the Carnot cycle.'
minutes: 90
updated: 2026-11-23
quiz:
  - q: 'A gas is compressed adiabatically. Its temperature:'
    choices: ['falls', 'rises', 'stays constant', 'first falls then rises']
    ans: 1
    why: 'Q = 0, so ΔU = −W. Work done on the gas (W negative) increases the internal energy, so the temperature rises.'
  - q: 'A Carnot engine works between 600 K and 300 K. Its efficiency is:'
    choices: ['25 %', '50 %', '75 %', '100 %']
    ans: 1
    why: 'η = 1 − Tc/Th = 1 − 300/600 = 0.5.'
  - q: 'For an ideal gas undergoing an isothermal expansion, the heat absorbed equals:'
    choices: ['the change in internal energy', 'the work done by the gas', 'zero', 'the work done on the gas']
    ans: 1
    why: 'The temperature is constant, so ΔU = 0 and the first law gives Q = W.'
sources:
  - 'NCERT Class 11 Physics, Chapter 11 “Thermodynamics” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Carnot, S. (1824), Réflexions sur la puissance motrice du feu (for the history box)'
  - 'Heat capacities of gases (monatomic 3R/2, diatomic 5R/2 at room temperature): Atkins, Physical Chemistry, 11th edition, Chapter 2'
---

**Physics · Class 11 · Chapter 11 · about 90 minutes.** By the end you will be able to state the zeroth, first and second laws, calculate work, heat and internal energy in each standard process of an ideal gas, and find the efficiency of a heat engine and the performance of a refrigerator.

<div class="bigidea">Thermodynamics is bookkeeping for energy that can change form as heat and as work. The first law says the books always balance: heat put in = rise in internal energy + work done. The second law says there is a direction: heat flows downhill by itself, and no engine can turn all its heat into work. Every engine, fridge and power station has to live within these two rules.</div>

## 1. Thermal equilibrium and the zeroth law

Two bodies in contact with no net heat flow between them are in **thermal equilibrium** and have the same temperature. The **zeroth law**: if A is in equilibrium with C and B is in equilibrium with C, then A and B are in equilibrium with each other. This is what makes a thermometer possible: it reaches equilibrium with your body, and reads the temperature that your body shares with it.

A **system** is the part of the universe we study (a gas in a cylinder); everything else is the **surroundings**. The state of a gas is described by **state variables**: pressure P, volume V, temperature T and amount n, linked by the equation of state `$PV = nRT$` for an ideal gas. A quantity that depends only on the state (not on how it got there) is a **state function**: internal energy U is one; heat and work are not, because they depend on the path.

## 2. Heat, work and internal energy

**Internal energy** U is the total energy of the molecules inside the system (kinetic energy of motion, plus potential energy of the bonds). For an ideal gas it depends on the temperature alone: `$U = \dfrac{f}{2}nRT$` (f = 3 for a monatomic gas, 5 for a diatomic gas at room temperature).

Heat Q and work W are two ways of moving energy across the boundary. A gas that expands against a piston does **work**:

```math
W = \int_{V_1}^{V_2} P\,dV = \text{area under the } P\text{–}V \text{ curve}
```

<div class="myth">

**“A gas contains heat.”** A gas contains internal energy. Heat is energy in transit: it exists only while moving because of a temperature difference. You can raise the temperature of a gas with no heat at all, just by compressing it quickly.

</div>

## 3. The first law of thermodynamics

Energy is conserved. The heat supplied to a system goes partly into raising its internal energy and partly into work done by it:

```math
Q = \Delta U + W
```

Sign convention: Q is **positive** when heat flows **into** the system; W is **positive** when the system does work **on** the surroundings (expands).

<div class="meaning">

<dl>
<dt>Q</dt><dd>heat added to the gas (J), negative if heat leaves</dd>
<dt>ΔU</dt><dd>change in internal energy: positive means warmer, since U = (f/2)nRT</dd>
<dt>W</dt><dd>work done by the gas: positive when it expands, negative when it is compressed</dd>
<dt>Physical meaning</dt><dd>Think of a bank account: Q is money deposited, W is money you spend, and ΔU is what is left in the account. A deposit of ₹100 with ₹40 spent leaves ₹60.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11p-tdyn-first"><figcaption>A gas in a cylinder. Choose the set-up: with the piston locked all the heat goes into internal energy; with a free piston part of it becomes work; with an insulated cylinder, pushing the piston in heats the gas. The bars show Q, W and ΔU, always obeying Q = ΔU + W.</figcaption></figure>

<div class="problem" data-problem="c11p-tdyn-first"></div>

## 4. Specific heat capacities of a gas

The heat needed depends on how the gas is heated.

- **At constant volume**, no work is done, so `$Q = \Delta U = nC_v\Delta T$`.
- **At constant pressure** the gas also expands and does work `$P\Delta V = nR\Delta T$`, so `$Q = nC_p\Delta T = nC_v\Delta T + nR\Delta T$`.

Hence **Mayer’s relation**

```math
C_p - C_v = R,\qquad \gamma = \frac{C_p}{C_v}
```

For a monatomic gas Cv = 3R/2, Cp = 5R/2, γ = 5/3. For a diatomic gas Cv = 5R/2, Cp = 7R/2, γ = 7/5.

<figure class="fig" data-fig="c11p-tdyn-heatcap"><figcaption>Warming one mole from one isotherm to the next. The vertical path (constant volume) needs only CᵥΔT. The horizontal path (constant pressure) needs extra heat RΔT for the work of pushing the piston out.</figcaption></figure>

<div class="problem" data-problem="c11p-tdyn-isobaric"></div>

## 5. Thermodynamic processes

A **quasi-static** process is so slow that the system is always in equilibrium, so P and T have a definite value at each step and the path can be drawn on a P–V diagram. Four standard ones:

| Process | What is fixed | Work W | ΔU | Heat Q |
|---|---|---|---|---|
| Isochoric | V | 0 | nCvΔT | nCvΔT |
| Isobaric | P | PΔV = nRΔT | nCvΔT | nCpΔT |
| Isothermal | T | nRT ln(V₂/V₁) | 0 | = W |
| Adiabatic | Q = 0 | (P₁V₁ − P₂V₂)/(γ − 1) | −W | 0 |

<figure class="fig" data-fig="c11p-tdyn-pv"><figcaption>From one start point, choose a process and how far to go. The shaded area is the work done by the gas. The readout shows W, ΔU and Q. In the adiabatic case Q = 0 and the work comes from the gas’s internal energy, so it cools.</figcaption></figure>

<div class="problem" data-problem="c11p-tdyn-isothermal"></div>

### The adiabatic relation

In an adiabatic process no heat enters or leaves (an insulated cylinder, or a very rapid change such as a bicycle pump or the sound wave in air). Derive the relation between P and V:

<div class="steps" data-fig="c11p-tdyn-adiabat">
<div class="step">Adiabatic means dQ = 0 in every small step.</div>
<div class="step">The first law dQ = dU + dW becomes 0 = nCv dT + P dV.</div>
<div class="step">Replace P by nRT/V: 0 = nCv dT + (nRT/V) dV. Divide by nT: Cv dT/T = −R dV/V.</div>
<div class="step">Integrate: Cv ln T = −R ln V + constant, so ln T + (R/Cv) ln V = constant.</div>
<div class="step">Since R = Cp − Cv, R/Cv = γ − 1, so **TV^(γ−1) = constant**. With T = PV/nR this is the same as **PV^γ = constant**.</div>
<div class="step">Because γ is greater than 1, an adiabat is steeper than an isotherm: the pressure falls faster, as the gas cools on expansion as well as spreading out.</div>
</div>

```math
PV^{\gamma} = \text{constant},\qquad TV^{\gamma-1} = \text{constant},\qquad W = \frac{P_1V_1 - P_2V_2}{\gamma-1}
```

<div class="problem" data-problem="c11p-tdyn-adiabatic"></div>

**Cyclic process.** A system that returns to its starting state has ΔU = 0, so the net heat equals the net work, which is the area enclosed by the loop on the P–V diagram. A clockwise loop is an engine.

Compare cycles on a P–V diagram with a sliding piston:

<!--fig:tool heat-engine-cycles-->

## 6. Second law of thermodynamics

The first law would allow a ship to run by cooling the sea and driving the propeller with the heat taken out. We never see it. The second law says why, in two equivalent forms:

- **Kelvin-Planck:** no process is possible whose *only* result is the absorption of heat from a reservoir and its complete conversion into work. So no heat engine has 100 % efficiency.
- **Clausius:** no process is possible whose *only* result is the transfer of heat from a colder body to a hotter body. So a refrigerator needs work.

**Reversible and irreversible processes.** A process is **reversible** if it can be retraced exactly, returning both the system and the surroundings to their original states. This needs it to be quasi-static, with no friction, no sudden expansion and no heat flow across a finite temperature difference. A gas mixing, ice melting in a warm room, sliding with friction, a stirred liquid: all irreversible. Real processes are all irreversible, and the second law gives them a direction (the “arrow of time”).

<figure class="fig" data-fig="@wt-mixing-entropy"><figcaption>Remove the partition and two gases mix. They never un-mix by themselves: the mixed arrangement can occur in vastly more ways, so it is overwhelmingly probable. That is an irreversible change.</figcaption></figure>

## 7. Heat engines

A **heat engine** takes heat Qh from a hot reservoir, converts part of it to work W and rejects heat Qc to a cold reservoir. The cycle returns to its start, so W = Qh − Qc. The **efficiency**

```math
\eta = \frac{W}{Q_h} = 1 - \frac{Q_c}{Q_h}
```

A **refrigerator** (or air-conditioner) runs the engine backwards: using work W it takes Qc from the cold space and rejects Qh = Qc + W to the hot surroundings. Its **coefficient of performance** is

```math
\text{COP} = \frac{Q_c}{W}
```

<figure class="fig" data-fig="c11p-tdyn-engine"><figcaption>Energy flows, with arrow widths in proportion to the energy. Engine: only part of Qh becomes work, the rest must go to the cold reservoir. Refrigerator: work lifts Qc to the hot side. Change the temperatures and the quality of the device and read η or COP.</figcaption></figure>

<div class="myth">

**“Leaving the fridge door open will cool the kitchen.”** The fridge dumps Qh = Qc + W into the room, more heat than it takes out of the fridge. The room warms.

</div>

## 8. The Carnot engine

Sadi Carnot asked: what is the best an engine can do? His ideal engine works between two reservoirs, with a gas going round four reversible steps. Follow them on the P–V diagram:

<div class="steps" data-fig="c11p-tdyn-carnot">
<div class="step">Two isotherms (at Tₕ and T꜀) joined by two adiabats form the Carnot cycle. The gas starts at point 1 at the hot temperature.</div>
<div class="step">**1 → 2, isothermal expansion at Tₕ.** The gas touches the hot reservoir, expands slowly and absorbs Qh = nRTₕ ln(V₂/V₁). Its internal energy does not change.</div>
<div class="step">**2 → 3, adiabatic expansion.** Insulated, it keeps expanding, does work and cools from Tₕ to T꜀.</div>
<div class="step">**3 → 4, isothermal compression at T꜀.** It touches the cold reservoir and is compressed slowly, rejecting Qc = nRT꜀ ln(V₃/V₄).</div>
<div class="step">**4 → 1, adiabatic compression.** Insulated, it is compressed back to the start, warming from T꜀ to Tₕ.</div>
<div class="step">The loop area is the net work W = Qh − Qc. Because V₃/V₄ = V₂/V₁, Qc/Qh = T꜀/Tₕ, so η = 1 − T꜀/Tₕ.</div>
</div>

```math
\eta_{\text{Carnot}} = 1 - \frac{T_c}{T_h},\qquad \text{COP}_{\text{Carnot fridge}} = \frac{T_c}{T_h - T_c}
```

**Carnot’s theorem:** no engine working between two given temperatures can be more efficient than a Carnot engine, and all reversible engines between the same two temperatures have the same efficiency, whatever the working substance. Real engines fall well short: a petrol engine reaches about 30 % and a large power station about 40 %.

Try the Carnot engine by changing the temperatures:

<!--fig:tool carnot-engine-->

<div class="problem" data-problem="c11p-tdyn-carnot"></div>

<div class="problem" data-problem="c11p-tdyn-fridge"></div>

For a real piston engine (Otto cycle) with the strokes one by one, see:

<figure class="fig" data-fig="@wt-engine-cycle"><figcaption>An engine going round a cycle: the shaded P–V loop is the net work per cycle. Step through each stroke and see where the heat goes in and out.</figcaption></figure>

To get the numbers for any gas state use the [Gas law calculator](/science/gas-law-calculator/).

<div class="history">

**1824.** The young French engineer Sadi Carnot publishes his only book, *Reflections on the motive power of fire*, showing that the efficiency of an ideal engine depends only on the temperatures of the hot and cold bodies. He died of cholera at 36, before the first law was understood. Joule and Clausius later put his ideas on firm ground.

**Beyond the syllabus.** The 2023 rationalised book does not teach entropy as a state function; it is an extension of the second law (dS = dQ/T for a reversible process, and the entropy of an isolated system never decreases).

</div>

<div class="keypoints">

- Zeroth law: bodies in equilibrium with a third are in equilibrium with each other, so temperature exists.
- First law: Q = ΔU + W (Q in positive, W by the gas positive). U of an ideal gas depends only on T.
- C<sub>p</sub> − C<sub>v</sub> = R; γ = C<sub>p</sub>/C<sub>v</sub> (5/3 monatomic, 7/5 diatomic).
- Isothermal: W = nRT ln(V₂/V₁), ΔU = 0. Adiabatic: PV^γ constant, Q = 0, W = (P₁V₁ − P₂V₂)/(γ − 1). Isobaric: W = PΔV. Isochoric: W = 0.
- Second law: no engine converts all heat to work (Kelvin-Planck); heat does not flow cold to hot by itself (Clausius).
- Engine: η = W/Q<sub>h</sub> = 1 − Q<sub>c</sub>/Q<sub>h</sub>. Fridge: COP = Q<sub>c</sub>/W. Carnot: η = 1 − T<sub>c</sub>/T<sub>h</sub>, COP = T<sub>c</sub>/(T<sub>h</sub> − T<sub>c</sub>).

</div>

Going further for JEE/NEET: polytropic processes, mixtures of gases, heat-capacity of a process and cycle efficiency problems are in [Thermodynamics (JEE)](/learn/courses/engineering-entrance/thermodynamics-physics/). Next, practise this chapter with [Thermodynamics: practice questions](/learn/courses/ncert-class-11-physics/thermodynamics-practice/).
