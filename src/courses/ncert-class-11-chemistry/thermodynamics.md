---
title: Thermodynamics
seoTitle: 'Thermodynamics Class 11 notes: enthalpy, entropy, Gibbs'
summary: 'Class 11 Thermodynamics with animations: first law, work, enthalpy, Hess law, bond enthalpy, entropy, Gibbs energy and the link between delta G and K.'
minutes: 110
updated: 2026-11-23
quiz:
  - q: 'A gas absorbs 150 J of heat and does 40 J of work on its surroundings. The change in its internal energy is:'
    choices: ['+110 J', '+190 J', '−110 J', '−190 J']
    ans: 0
    why: 'q = +150 J (absorbed). Work done BY the gas is negative: w = −40 J. ΔU = q + w = 150 − 40 = +110 J.'
  - q: 'For a reaction with ΔH = +50 kJ/mol and ΔS = +100 J/(K mol), the reaction becomes spontaneous above:'
    choices: ['500 K', '5 K', '50 K', '5000 K']
    ans: 0
    why: 'ΔG = ΔH − TΔS = 0 at T = ΔH/ΔS = 50 000 J / 100 J/K = 500 K. Above this, TΔS is bigger than ΔH and ΔG is negative.'
  - q: 'Hess’s law is a direct result of the fact that enthalpy is:'
    choices: ['a state function', 'an extensive property only', 'always negative', 'equal to heat at constant volume']
    ans: 0
    why: 'A state function depends only on the start and end states, so ΔH is the same whichever route is taken.'
sources:
  - 'NCERT Class 11 Chemistry, Chapter 5 “Thermodynamics” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard enthalpies of formation and standard molar entropies (CO₂, CO, H₂O, CH₄, CaCO₃, NH₃): CRC Handbook of Chemistry and Physics, 97th edition, “Standard thermodynamic properties of chemical substances”; NIST Chemistry WebBook'
  - 'Average bond enthalpies (C–H 414, O=O 498, C=O in CO₂ 799, O–H 463 kJ/mol): CRC Handbook of Chemistry and Physics, 97th edition, “Bond dissociation energies”'
  - 'Hess, G. H. (1840), Bulletin de la classe physico-mathématique de l’Académie impériale des sciences de Saint-Pétersbourg 8, 257 (for the history box)'
---

**Chemistry · Class 11 · Chapter 5 · about 110 minutes.** By the end you will be able to track heat and work with the first law, calculate enthalpy changes with Hess's law and bond enthalpies, explain entropy as freedom of particles, and use ΔG = ΔH − TΔS to say when a reaction will go by itself and where it will stop.

<div class="bigidea">Energy is conserved (first law), but it tends to <b>spread out</b> (entropy). A change happens by itself when the combined effect of energy released and freedom gained is favourable: that balance is Gibbs energy.</div>

## 1. Basic terms: system, surroundings and state

**Thermodynamics** studies energy changes in matter. You choose a **system** (the part you look at: the reaction mixture in a flask) and everything else is the **surroundings**. The wall between them is the **boundary**.

<figure class="fig" data-fig="c11c-thermo-system"><figcaption>Three kinds of system. Open: matter and heat both cross (tea in an open cup). Closed: only heat crosses (a sealed pressure-cooker). Isolated: nothing crosses (an ideal thermos). In the open cup you can see the particles leave.</figcaption></figure>

The **state** of a system is described by its measurable properties: pressure p, volume V, temperature T, amount n. A **state function** depends only on the present state, not on how it got there: U, H, S, G, p, V and T are state functions. **Heat q and work w are not**: they depend on the path. Climbing from Chennai to Ooty: your height gain (a state function) is fixed, but the distance you walked (a path function) depends on the road.

Properties are **extensive** (depend on the amount: mass, V, U, H) or **intensive** (do not: T, p, density).

<div class="myth">

**“Heat and temperature are the same thing.”** Temperature measures how hot something is (an intensive property). Heat is energy in transit between a hotter and a colder body. A lit match is far hotter than a bucket of warm water, but the bucket holds far more heat.

</div>

## 2. The first law and internal energy

The **internal energy U** is the total energy stored in a system: motion of molecules, vibration, chemical bonds. We cannot measure it in absolute terms, only its **change**. The **first law** says energy is never created or destroyed, only moved:

```math
\Delta U = q + w
```

<div class="meaning">

<dl>
<dt>ΔU</dt><dd>change in internal energy of the system (joules)</dd>
<dt>q</dt><dd>heat added TO the system: + if absorbed, − if given out</dd>
<dt>w</dt><dd>work done ON the system: + if the surroundings do work on it (squeezing), − if the system does work (expanding)</dd>
<dt>Physical meaning</dt><dd>The system's energy is like a bank balance: heat and work are the deposits and withdrawals, and ΔU is the net change. An isolated system has q = 0 and w = 0, so its U stays fixed.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11c-thermo-first"><figcaption>A gas in a cylinder. Slide the heat q and the work w and watch the internal-energy bar change. Try the presets: squeezing an insulated gas warms it (like a bicycle pump), and letting it expand against a piston cools it.</figcaption></figure>

<div class="problem" data-problem="c11c-thermo-firstlaw"></div>

### Work of expansion

When a gas expands against an external pressure `$p_{ext}$` from V₁ to V₂, the work done **on** the gas is

```math
w = -p_{ext}\,(V_2 - V_1)
```

The minus sign says the gas **loses** energy when it pushes. If it expands into a vacuum, `$p_{ext}=0$` and w = 0 (**free expansion**). In the **reversible** limit (so slowly that p_ext is always almost equal to the gas pressure) at constant temperature:

```math
w_{rev} = -2.303\,nRT\log\frac{V_2}{V_1}
```

<figure class="fig" data-fig="c11c-thermo-pv"><figcaption>The shaded area under the path on a p–V graph is the work done by the gas. Compare expanding into a vacuum (zero area), in one step against the final pressure (a rectangle) and reversibly (the whole area under the curve). The reversible path gives the most work.</figcaption></figure>

For an ideal gas at constant temperature U does not change (it depends only on T), so ΔU = 0 and q = −w: all the heat absorbed is turned into work.

## 3. Enthalpy

Most lab and factory reactions happen in open vessels at constant pressure. Then the heat exchanged is not ΔU but the **enthalpy change**. Enthalpy is defined as

```math
H = U + pV \qquad \Delta H = \Delta U + p\Delta V = \Delta U + \Delta n_g RT
```

<div class="meaning">

<dl>
<dt>ΔH</dt><dd>heat exchanged at constant pressure (q<sub>p</sub>)</dd>
<dt>ΔU</dt><dd>heat exchanged at constant volume (q<sub>v</sub>), as in a bomb calorimeter</dd>
<dt>Δn<sub>g</sub></dt><dd>moles of gaseous products minus moles of gaseous reactants</dd>
<dt>Physical meaning</dt><dd>ΔH is ΔU plus the energy the system spends pushing the atmosphere back when gas is made. If no gas moles change, ΔH ≈ ΔU.</dd>
</dl>

</div>

<div class="problem" data-problem="c11c-thermo-dhdu"></div>

- **Exothermic** (ΔH < 0): heat flows out, the surroundings warm up (burning LPG, quicklime in water).
- **Endothermic** (ΔH > 0): heat flows in, the surroundings cool (a cold pack of dissolving ammonium nitrate, melting ice).

<figure class="fig" data-fig="c11c-thermo-enthalpy"><figcaption>Enthalpy as height. Pick a real reaction or set your own ΔH. Downhill reactions release heat and the surroundings warm up; uphill ones take heat in and the surroundings get colder.</figcaption></figure>

### Heat capacity and calorimetry

The **heat capacity** C is the heat needed to raise the temperature by 1 K; the **specific heat** is per gram. For heating: `$q = m\,c\,\Delta T$`. At constant volume `$q_v=\Delta U$` and at constant pressure `$q_p=\Delta H$`; for gases `$C_p - C_v = R$` (per mole), because at constant pressure some heat also goes into expansion work.

In a **bomb calorimeter** a sample burns in a strong sealed steel vessel (constant volume) inside a water bath; the temperature rise gives `$q_v$` = ΔU. A coffee-cup calorimeter open to the air measures ΔH.

<div class="problem" data-problem="c11c-thermo-calorimeter"></div>

<!--fig:tool bomb-calorimeter-->

## 4. Hess's law and enthalpies of reaction

**Hess's law:** the total enthalpy change of a reaction is the same whether it takes place in one step or in several. This is not a new law: it follows because H is a state function.

<div class="steps" data-fig="c11c-thermo-hess">
<div class="step">Burn graphite straight to CO₂: C + O₂ → CO₂. A calorimeter measures ΔH = −393.5 kJ/mol.</div>
<div class="step">Take another route: first C + ½O₂ → CO (ΔH₁), then CO + ½O₂ → CO₂ (ΔH₂ = −283.0 kJ/mol, easy to measure).</div>
<div class="step">Add the steps: the CO cancels and we are back to C + O₂ → CO₂. The enthalpy changes add up too.</div>
<div class="step">Same start, same end, so ΔH₁ + ΔH₂ = ΔH(direct), whichever road is taken.</div>
<div class="step">Now use it: carbon never burns cleanly to CO only, so ΔH₁ cannot be measured directly. But ΔH₁ = −393.5 − (−283.0) = −110.5 kJ/mol.</div>
</div>

<div class="problem" data-problem="c11c-thermo-hess"></div>

Rules for combining equations: **reversing** an equation changes the sign of ΔH; **multiplying** by a number multiplies ΔH by it; add the equations and the ΔH values.

<div class="history">

**A timeline of heat.** 1840: Germain Hess, a Swiss-Russian chemist, publishes the law of constant heat summation, years before the first law is stated. 1847: Joule's paddle-wheel experiments show heat and work are equivalent. 1850s: Clausius and Kelvin state the second law. 1876: Gibbs defines his free energy.

</div>

### Types of enthalpy change

| Name | Meaning | Example |
|---|---|---|
| Enthalpy of formation, ΔH<sub>f</sub>° | one mole of compound from its elements in standard states | C + O₂ → CO₂, −393.5 |
| Enthalpy of combustion | one mole burnt completely in oxygen | CH₄: −890 kJ/mol |
| Enthalpy of atomisation | one mole of gaseous atoms from the element or compound | CH₄(g) → C(g) + 4H(g) |
| Bond enthalpy | breaking one mole of a bond in the gas phase | H–H: 436 kJ/mol |
| Enthalpy of solution | one mole dissolving in a lot of solvent | NaOH: −44.5 kJ/mol |
| Enthalpy of fusion, vaporisation, sublimation | phase changes | ice → water: +6.0 kJ/mol |

By definition ΔH<sub>f</sub>° of an element in its standard state is zero. Then, for any reaction:

```math
\Delta H^\circ_{reaction} = \sum \Delta H_f^\circ(\text{products}) - \sum \Delta H_f^\circ(\text{reactants})
```

(multiply each term by its coefficient in the balanced equation).

<div class="problem" data-problem="c11c-thermo-dhf"></div>

Add up any reaction from stored ΔH<sub>f</sub> values in the calculator:

<!--fig:tool thermochemistry-calculator-->

### Bond enthalpies

Breaking bonds **costs** energy, making bonds **releases** it. So for gas-phase reactions:

```math
\Delta H \approx \sum (\text{bond enthalpies broken}) - \sum (\text{bond enthalpies formed})
```

<div class="steps" data-fig="c11c-thermo-bondsteps">
<div class="step">Burn methane: CH₄ + 2O₂ → CO₂ + 2H₂O(g). Reactants have 4 C–H and 2 O=O bonds; products have 2 C=O and 4 O–H bonds.</div>
<div class="step">Breaking costs energy: 4 × 414 (C–H) = 1656 and 2 × 498 (O=O) = 996. Total +2652 kJ.</div>
<div class="step">Making releases energy: 2 × 799 (C=O in CO₂) = 1598 and 4 × 463 (O–H) = 1852. Total −3450 kJ.</div>
<div class="step">ΔH = 2652 − 3450 = −798 kJ. Negative: the new bonds are stronger overall, so heat comes out.</div>
<div class="step">The measured value is −802 kJ. Bond values are <b>averages</b> over many molecules, so the estimate is close but not exact.</div>
</div>

Compare many bonds in the [bond enthalpy tool](/learn/bond-enthalpy/).

## 5. Spontaneity and entropy

A **spontaneous** process goes by itself once started (a ball rolling downhill, ice melting in a warm room, iron rusting). It says nothing about speed. Many spontaneous processes are exothermic, but not all: ice melts spontaneously above 0 °C although it takes in heat. Energy lowering cannot be the whole story.

**Entropy (S)** measures how many ways the particles and their energy can be arranged: the **disorder** or spreading-out. Order → disorder raises S. For a reversible change at temperature T:

```math
\Delta S = \frac{q_{rev}}{T}
```

<div class="meaning">

<dl>
<dt>ΔS</dt><dd>entropy change, in J/(K mol)</dd>
<dt>q<sub>rev</sub></dt><dd>heat absorbed reversibly (e.g. at the melting point)</dd>
<dt>T</dt><dd>kelvin temperature at which the heat is exchanged</dd>
<dt>Physical meaning</dt><dd>A given amount of heat creates more extra disorder in a cold system than in a hot one, so heat divided by T measures how much the spread-out-ness grows.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11c-thermo-entropy"><figcaption>Water at different temperatures. In ice the particles are locked on a lattice and jiggle; in the liquid they tumble; in steam they fly free. The entropy bars show S jumping at melting and boiling.</figcaption></figure>

<figure class="fig" data-fig="@chem-entropy-spread"><figcaption>Free expansion of a gas: the particles spread into the whole box and never return by chance. The histogram counts the arrangements (microstates), and S = k ln W grows as the gas spreads.</figcaption></figure>

Entropy rises when: a solid melts or boils, a gas expands, a solute dissolves, the temperature rises, or a reaction makes more gas moles. The **second law**: the total entropy of the system plus surroundings increases in every spontaneous change. The **third law**: the entropy of a perfect crystal is zero at 0 K, so absolute entropies can be listed.

## 6. Gibbs energy

Following the entropy of the surroundings is awkward, so Gibbs combined everything in the system's own quantities:

```math
\Delta G = \Delta H - T\Delta S
```

<div class="meaning">

<dl>
<dt>ΔG</dt><dd>Gibbs energy change: ΔG &lt; 0 spontaneous, ΔG = 0 at equilibrium, ΔG &gt; 0 not spontaneous (the reverse is)</dd>
<dt>ΔH</dt><dd>the energy term: exothermic helps</dd>
<dt>TΔS</dt><dd>the disorder term: more entropy helps, and it matters more at high T</dd>
<dt>Physical meaning</dt><dd>ΔG is the useful work you can get at constant T and p, and the "driving force" of the change. Energy lowering and spreading out compete; temperature is the referee.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11c-thermo-gibbs"><figcaption>ΔG against temperature is a straight line with slope −ΔS. Choose a reaction or set ΔH and ΔS: the four sign combinations give "always", "never", "only when cold" and "only when hot". The green zone is where it is spontaneous.</figcaption></figure>

| ΔH | ΔS | ΔG | Spontaneous? | Example |
|---|---|---|---|---|
| − | + | always − | at every T | burning methane |
| + | − | always + | never | making ozone from O₂ |
| − | − | − at low T | only cold | N₂ + 3H₂ → 2NH₃ |
| + | + | − at high T | only hot | CaCO₃ → CaO + CO₂ (lime kiln) |

<div class="problem" data-problem="c11c-thermo-gibbsT"></div>

Check any combination, with your own numbers and temperature, in the Gibbs explorer:

<!--fig:tool gibbs-explorer-->

### Gibbs energy and equilibrium

The standard Gibbs energy change ΔG° and the equilibrium constant K are linked:

```math
\Delta G^\circ = -RT\ln K = -2.303\,RT\log K
```

If ΔG° is negative, K > 1 and products are favoured at equilibrium; if positive, K < 1. Every 5.7 kJ/mol shift of ΔG° at 298 K changes K by a factor of 10.

<figure class="fig" data-fig="c11c-thermo-gk"><figcaption>Slide ΔG° and the temperature. The bar shows the equilibrium mixture of reactant A and product B, and the marker shows K on a log scale. A small change in ΔG° makes a huge difference to K.</figcaption></figure>

<div class="problem" data-problem="c11c-thermo-gk"></div>

<div class="myth">

**“ΔG° negative means the reaction is fast.”** ΔG tells you only whether a change can happen and where equilibrium lies, never how fast. Diamond turning into graphite has a negative ΔG at room temperature, yet a diamond ring lasts for generations because the rate is almost zero.

</div>

<div class="keypoints">

- System, surroundings, boundary. Open: matter and energy cross; closed: only energy; isolated: neither. State functions (U, H, S, G) depend only on the state; q and w depend on the path.
- First law: ΔU = q + w. Heat absorbed +, work done on the system +. Free expansion: w = 0. Isothermal ideal gas: ΔU = 0.
- Work of expansion: w = −p_ext ΔV; reversible: w = −2.303 nRT log(V₂/V₁), the maximum work.
- Enthalpy H = U + pV; ΔH = ΔU + Δn_g RT. ΔH < 0 exothermic, ΔH > 0 endothermic. q_v = ΔU, q_p = ΔH. C_p − C_v = R.
- Hess's law: ΔH is path-independent because H is a state function. Reverse: change sign; multiply: scale ΔH.
- ΔH° = ΣΔH_f°(products) − ΣΔH_f°(reactants); ΔH ≈ Σ(bonds broken) − Σ(bonds formed).
- Entropy: disorder, ΔS = q_rev/T. It rises on melting, boiling, expansion and dissolving. Second law: total entropy increases in a spontaneous change. Third law: S = 0 for a perfect crystal at 0 K.
- ΔG = ΔH − TΔS. ΔG < 0 spontaneous; ΔG = 0 equilibrium. Switch temperature T = ΔH/ΔS.
- ΔG° = −2.303 RT log K. It tells where equilibrium lies, not how fast.

</div>

Going further for JEE/NEET: the exam-level problems on work in different processes, calorimetry with phase changes and ΔG–K calculations are in [Chemical thermodynamics (JEE)](/learn/courses/engineering-entrance/chemical-thermodynamics/), with extra practice in [Chemical thermodynamics questions](/learn/courses/engineering-entrance/chemical-thermodynamics-questions/); NEET asks the same chemistry.
