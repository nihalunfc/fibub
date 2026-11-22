---
title: 'Chemical thermodynamics'
seoTitle: 'Chemical thermodynamics: JEE and NEET chemistry'
summary: 'Systems and state functions, the first law with heat and work, work of expansion (reversible, irreversible, adiabatic), enthalpy and ΔH = ΔU + Δn(g)RT, heat capacity and calorimetry, Hess''s law and bond enthalpies, entropy and the second and third laws, Gibbs energy, spontaneity and the link ΔG° = −RT ln K.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'For CaCO₃(s) → CaO(s) + CO₂(g) at constant pressure, how do ΔH and ΔU compare?'
    choices: ['ΔH = ΔU', 'ΔH > ΔU', 'ΔH < ΔU', 'Cannot say']
    ans: 1
    why: 'Δn(g) = +1, so ΔH = ΔU + RT: the system must also do work pushing back the atmosphere to make room for the CO₂.'
  - q: 'A reaction with ΔH > 0 and ΔS > 0 is spontaneous:'
    choices: ['At all temperatures', 'At high temperatures only', 'At low temperatures only', 'Never']
    ans: 1
    why: 'ΔG = ΔH − TΔS. The positive ΔH works against it, but at high enough T the −TΔS term wins and ΔG becomes negative.'
  - q: 'Which of these is not a state function?'
    choices: ['Enthalpy', 'Entropy', 'Work', 'Internal energy']
    ans: 2
    why: 'Work and heat depend on the path taken. U, H, S and G depend only on the start and end states.'
sources:
  - 'IUPAC Green Book (Quantities, Units and Symbols in Physical Chemistry, 3rd edition): sign convention for work and heat https://iupac.org/what-we-do/books/greenbook/'
  - 'Standard enthalpies of formation: NIST Chemistry WebBook https://webbook.nist.gov'
  - 'CODATA 2018: R = 8.314 462 618 J mol⁻¹ K⁻¹ https://physics.nist.gov/cuu/Constants/'
  - 'NEET (UG) and JEE Main / JEE Advanced 2026 syllabi: Chemical thermodynamics'
---

**Chemistry · Class 11 · about 36 minutes.** By the end you will be able to apply the first law with the right signs, find work for any expansion, switch between ΔH and ΔU, use Hess's law and bond enthalpies, calculate entropy changes and decide whether a reaction goes, and at what temperature.

<div class="bigidea">Energy is never lost, only moved around as heat and work (first law). But energy alone does not decide which way a change goes: the total entropy of the universe must rise (second law). Gibbs energy rolls both into one test for a reaction at constant temperature and pressure.</div>

## 1. Systems, surroundings and state functions

The **system** is the part we study; everything else is the **surroundings**. An **open** system swaps matter and energy, a **closed** one energy only, an **isolated** one neither. A **state function** depends only on the present state, not on how it was reached: U, H, S, G, P, V, T. Heat q and work w are **path functions**. **Extensive** properties grow with the amount (mass, V, U, H); **intensive** ones do not (T, P, density, molar quantities).

## 2. The first law, heat and work

The **first law**: ΔU = q + w. We use the IUPAC sign convention: q and w are **positive when energy goes into the system**. Gas expanding against a constant outside pressure does work w = −P<sub>ext</sub>ΔV (negative, because the gas loses energy). Expansion into a vacuum (**free expansion**) does no work.

For a **reversible isothermal** expansion of an ideal gas, the outside pressure is always just below the gas pressure, so the gas does the most work possible:

```math
w_{rev} = -2.303\,nRT\log\frac{V_2}{V_1} = -2.303\,nRT\log\frac{P_1}{P_2}
```

For an ideal gas at constant T, ΔU = 0, so q = −w.

<div class="problem" data-problem="th-iso-work"></div>

In an **adiabatic** process q = 0, so w = ΔU = nC<sub>v</sub>ΔT: a gas that expands adiabatically cools. For a reversible adiabatic change, PV<sup>γ</sup> and TV<sup>γ−1</sup> stay constant (γ = C<sub>p</sub>/C<sub>v</sub>: 5/3 for a monatomic gas, 7/5 for a diatomic one).

## 3. Enthalpy and heat capacity

Most reactions happen at constant pressure, so we use **enthalpy** H = U + PV. At constant pressure, q<sub>p</sub> = ΔH; at constant volume, q<sub>v</sub> = ΔU. For reactions with gases:

```math
\Delta H = \Delta U + \Delta n_g RT
```

<div class="meaning">
<dl>
<dt>U, H</dt><dd>internal energy and enthalpy (H = U + PV)</dd>
<dt>q, w</dt><dd>heat and work, positive when they flow into the system</dd>
<dt>Δn<sub>g</sub></dt><dd>moles of gaseous products − moles of gaseous reactants</dd>
<dt>S, G</dt><dd>entropy (J/K) and Gibbs energy (G = H − TS)</dd>
<dt>C<sub>p</sub>, C<sub>v</sub></dt><dd>molar heat capacities at constant pressure and volume; C<sub>p</sub> − C<sub>v</sub> = R for an ideal gas</dd>
<dt>Physical meaning</dt><dd>ΔH is ΔU plus the work needed to push the atmosphere back. If a reaction makes gas, ΔH is bigger than ΔU by RT per extra mole of gas.</dd>
</dl>
</div>

<div class="problem" data-problem="th-dh-du"></div>

**Calorimetry.** A **bomb calorimeter** (sealed, constant volume) measures ΔU; a coffee cup calorimeter (open, constant pressure) measures ΔH. Heat q = C ΔT, where C is the heat capacity of the calorimeter and its contents.

## 4. Hess's law and kinds of enthalpy

Because H is a state function, the enthalpy change for a reaction is the same whether it happens in one step or many (**Hess's law**). So reaction equations can be added like algebra, with their ΔH values. Two very useful forms:

- From enthalpies of formation: ΔH°<sub>r</sub> = Σ ΔH°<sub>f</sub>(products) − Σ ΔH°<sub>f</sub>(reactants). Elements in their standard states have ΔH°<sub>f</sub> = 0.
- From bond enthalpies (gases only): ΔH<sub>r</sub> = Σ (bonds broken) − Σ (bonds formed).

Other named enthalpies: **combustion** (1 mol burnt completely in O₂, always negative), **atomisation**, **sublimation**, **neutralisation** (strong acid and strong base: −57.1 kJ per mol of water, less for weak ones because some energy goes into ionising them), and **solution**. The **Born-Haber cycle** is Hess's law applied to forming an ionic solid.

## 5. Entropy and the second law

**Entropy** S measures how many ways the energy and particles of a system can be arranged. It rises from solid to liquid to gas, when gas moles increase, on mixing and on heating. The **second law**: in any spontaneous change, the total entropy of system plus surroundings increases.

- Reversible heat flow: ΔS = q<sub>rev</sub>/T.
- Phase change at its transition temperature: ΔS = ΔH/T (for boiling of many liquids about 85 to 88 J K⁻¹ mol⁻¹, **Trouton's rule**).
- Surroundings at temperature T absorbing the reaction's heat: ΔS<sub>surr</sub> = −ΔH<sub>sys</sub>/T.
- Ideal gas expanding at constant T: ΔS = 2.303 nR log(V₂/V₁), the same whether the path is reversible or not, because S is a state function.

The **third law**: the entropy of a perfect crystal at 0 K is zero. That gives absolute entropies, unlike H.

<div class="myth">

**"Exothermic reactions are always spontaneous."** Many are, but dissolving ammonium nitrate in water is endothermic and still happens, because the entropy gain wins. And water freezing is exothermic, yet it does not happen at 25 °C. Spontaneity needs ΔG, not ΔH alone.

</div>

**Try it:** with N = 20, press "Remove partition" and watch the histogram. Then reset with N = 100 and ask how likely it is that all the particles gather on one side.

<figure class="fig" data-fig="@chem-entropy-spread"><figcaption>Entropy is a count of arrangements: S = k ln W. The even split has overwhelmingly more arrangements than "all on the left", so a spreading gas never un-spreads on its own. The larger N is, the surer this becomes.</figcaption></figure>

## 6. Gibbs energy and spontaneity

At constant T and P, the test for spontaneity is the **Gibbs energy change**:

```math
\Delta G = \Delta H - T\Delta S
```

ΔG &lt; 0 spontaneous, ΔG = 0 at equilibrium, ΔG &gt; 0 not spontaneous (the reverse goes). −ΔG is also the maximum useful (non-expansion) work the reaction can do.

| ΔH | ΔS | Spontaneous when |
|---|---|---|
| − | + | always |
| + | − | never |
| − | − | low T (below ΔH/ΔS) |
| + | + | high T (above ΔH/ΔS) |

<figure class="fig" data-fig="gibbs-temp"><figcaption>ΔG against T is a straight line: it starts at ΔH and slopes down by ΔS for every kelvin. Below the axis (shaded) the reaction is spontaneous; the crossing point is T = ΔH/ΔS.</figcaption></figure>

<div class="problem" data-problem="th-crossover"></div>

**Gibbs energy and equilibrium.** The standard Gibbs energy change fixes the equilibrium constant: ΔG° = −RT ln K = −2.303 RT log K. A negative ΔG° means K &gt; 1 (products favoured). At 298 K, every 5.7 kJ/mol of ΔG° changes K by a factor of 10.

<div class="myth">

**"ΔG° tells you whether a reaction happens."** ΔG° is for everything at standard concentrations. The real driving force is ΔG = ΔG° + RT ln Q, which depends on how much product and reactant are present. A reaction with positive ΔG° still makes some product, just with K &lt; 1.

</div>

<div class="keypoints">

- ΔU = q + w, with q and w positive into the system; w = −P<sub>ext</sub>ΔV; free expansion does no work.
- Reversible isothermal: w = −2.303 nRT log(V₂/V₁); ideal gas ΔU = 0 at constant T.
- Adiabatic: q = 0, w = nC<sub>v</sub>ΔT; PV<sup>γ</sup> constant if reversible.
- q<sub>p</sub> = ΔH, q<sub>v</sub> = ΔU; ΔH = ΔU + Δn<sub>g</sub>RT; C<sub>p</sub> − C<sub>v</sub> = R.
- Hess: ΔH° = ΣΔH°<sub>f</sub>(products) − ΣΔH°<sub>f</sub>(reactants) = Σ bonds broken − Σ bonds formed.
- ΔS = q<sub>rev</sub>/T; phase change ΔS = ΔH/T; ΔS<sub>surr</sub> = −ΔH/T.
- ΔG = ΔH − TΔS; crossover T = ΔH/ΔS; ΔG° = −2.303 RT log K.

</div>
