---
title: 'Chemical kinetics'
seoTitle: 'Chemical kinetics: JEE and NEET chemistry'
summary: 'Rate of reaction, rate law, order and molecularity, integrated rate laws for zero, first and second order, half-life, pseudo first order, the Arrhenius equation, collision theory and catalysts, plus parallel, consecutive and opposing reactions for JEE Advanced.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'The half-life of a first-order reaction is 10 min. What fraction is left after 30 min?'
    choices: ['1/3', '1/6', '1/8', '1/9']
    ans: 2
    why: '30 min is 3 half-lives. Each halves what is left: (1/2)³ = 1/8.'
  - q: 'The unit of the rate constant is L mol⁻¹ s⁻¹. The order of the reaction is:'
    choices: ['0', '1', '2', '3']
    ans: 2
    why: 'For order n, the unit of k is (mol/L)^(1−n) s⁻¹. (mol/L)⁻¹ s⁻¹ = L mol⁻¹ s⁻¹ means 1 − n = −1, so n = 2.'
  - q: 'A catalyst speeds up a reaction because it:'
    choices: ['raises the average kinetic energy of molecules', 'lowers the activation energy by giving a new path', 'shifts the equilibrium to the products', 'makes ΔH more negative']
    ans: 1
    why: 'A catalyst offers a different route with a lower barrier. It speeds the forward and backward reactions equally, so it does not change ΔH, ΔG or the equilibrium position.'
sources:
  - 'NEET (UG), JEE Main and JEE Advanced 2026 syllabi: Chemical kinetics'
  - 'IUPAC Gold Book: order of reaction, molecularity, rate constant, half-life https://goldbook.iupac.org'
---

**Chemistry · Class 12 · about 34 minutes.** By the end you will be able to write a rate law, find order from data, use the integrated rate laws and half-life, find activation energy from the Arrhenius equation, and handle pseudo first-order, parallel and consecutive reactions.

<div class="bigidea">Thermodynamics tells you whether a reaction can happen; kinetics tells you how fast. Speed depends on how often molecules collide, how many collisions have enough energy to cross the barrier, and whether they hit the right way round. Concentration changes the first, temperature mostly the second, a catalyst lowers the barrier itself.</div>

## 1. Rate of reaction

For aA + bB → cC + dD, the rate is the same number whichever species you track, once you divide by the coefficient:

```math
\text{rate} = -\frac{1}{a}\frac{d[A]}{dt} = -\frac{1}{b}\frac{d[B]}{dt} = \frac{1}{c}\frac{d[C]}{dt}
```

Reactants carry a minus sign because their concentrations fall. Example: for 2N₂O₅ → 4NO₂ + O₂, the NO₂ forms 4 times as fast as O₂, and N₂O₅ disappears twice as fast as O₂ appears. The **average rate** is Δ[ ]/Δt over an interval; the **instantaneous rate** is the slope of the concentration-time curve at one moment.

## 2. Rate law, order and molecularity

The **rate law** is found by experiment, not from the balanced equation:

```math
\text{rate} = k[A]^x[B]^y
```

**Order** = x + y; it can be 0, a fraction or even negative. **Molecularity** is the number of particles colliding in **one elementary step**: 1, 2 or rarely 3, always a whole number. For a multi-step reaction, the **slowest step** controls the rate (the rate-determining step), and only that step's molecularity is meaningful.

| Order | Unit of k | Example |
|---|---|---|
| 0 | mol L⁻¹ s⁻¹ | NH₃ decomposing on hot platinum (surface saturated) |
| 1 | s⁻¹ | N₂O₅ decomposition, radioactive decay |
| 2 | L mol⁻¹ s⁻¹ | 2NO₂ → 2NO + O₂ |

General rule: unit of k = (mol L⁻¹)^(1 − n) s⁻¹.

**Pseudo first order.** When one reactant is in huge excess (often the solvent), its concentration hardly changes, so the reaction looks first order. Acid hydrolysis of an ester in water and the inversion of cane sugar (sucrose + H₂O → glucose + fructose) are true second-order reactions that behave as first order.

**Finding order from data (initial rate method).** Change one concentration, keep the others fixed, and compare rates. If doubling [A] multiplies the rate by 4 = 2², the order in A is 2.

<div class="problem" data-problem="kin-initial-rate"></div>

## 3. Integrated rate laws and half-life

| | Zero order | First order | Second order (one reactant) |
|---|---|---|---|
| Integrated law | [A] = [A]₀ − kt | ln([A]₀/[A]) = kt | 1/[A] − 1/[A]₀ = kt |
| Straight line | [A] vs t, slope −k | ln[A] vs t, slope −k | 1/[A] vs t, slope +k |
| Half-life | [A]₀/2k | 0.693/k | 1/(k[A]₀) |
| t½ and [A]₀ | proportional | independent | inversely proportional |

The first-order law is the one you will use most, in the base-10 form:

```math
k = \frac{2.303}{t}\log\frac{[A]_0}{[A]},\qquad t_{1/2} = \frac{0.693}{k}
```

After n half-lives a first-order reactant falls to (1/2)ⁿ of its start. Time for 75% reaction = 2 half-lives; 87.5% = 3; 99.9% ≈ 10. Radioactive decay is always first order, which is why carbon-14 dating works.

<figure class="fig" data-fig="kin-order-plots"><figcaption>Pick an order, then try the three y-axes. Only one gives a straight line for each order. On the [A] plot, the dots mark successive half-lives: equal for first order, growing for second, shrinking for zero.</figcaption></figure>

<div class="meaning">
<dl>
<dt>[A]₀, [A]</dt><dd>concentration of A at the start and at time t (mol/L)</dd>
<dt>k</dt><dd>rate constant; depends on temperature and catalyst, not on concentration</dd>
<dt>t½</dt><dd>half-life, time for [A] to halve</dd>
<dt>Eₐ</dt><dd>activation energy, the minimum extra energy colliding molecules need (J/mol)</dd>
<dt>A</dt><dd>Arrhenius (frequency) factor: rate of collisions with the right orientation</dd>
<dt>Physical meaning</dt><dd>e^(−Eₐ/RT) is the fraction of collisions energetic enough to react; a small rise in T increases it a lot.</dd>
</dl>
</div>

<div class="problem" data-problem="kin-first-order-time"></div>

**Gas-phase first order (level 4).** For A(g) → B(g) + C(g) in a closed vessel, the total pressure rises as A breaks up. If P₀ is the initial pressure and P_t the total at time t, then p_A = 2P₀ − P_t, and k = (2.303/t) log[P₀/(2P₀ − P_t)]. Always write a pressure table first.

<div class="myth">

**"The order equals the coefficient in the balanced equation."** Only for a single elementary step. 2N₂O₅ → 4NO₂ + O₂ has a coefficient of 2 but is first order. H₂ + Br₂ → 2HBr has order 3/2. Order is found from experiment.

</div>

## 4. Temperature and the Arrhenius equation

Most rates roughly double or triple for a 10 K rise near room temperature (the **temperature coefficient**, k(T+10)/k(T) ≈ 2 to 3). Arrhenius explained why:

```math
k = A\,e^{-E_a/RT},\qquad \log\frac{k_2}{k_1} = \frac{E_a}{2.303\,R}\left(\frac{T_2 - T_1}{T_1 T_2}\right)
```

A plot of ln k against 1/T is a straight line with slope −Eₐ/R. A **higher Eₐ** means k is **more sensitive** to temperature. On an energy diagram, Eₐ(forward) − Eₐ(backward) = ΔH.

<div class="problem" data-problem="kin-arrhenius"></div>

**Collision theory.** Rate = Z × P × e^(−Eₐ/RT): Z is the collision frequency, e^(−Eₐ/RT) the fraction of collisions with enough energy, and P (the steric factor) the fraction with the right orientation. Raising T by 10 K raises Z by only about 2%, but it can double the fraction of energetic molecules: that is why heat speeds reactions so much.

**Catalysts** give an alternative path with a lower Eₐ. They are not used up, do not change ΔH or ΔG, and do not shift equilibrium: they only help it arrive sooner. Enzymes are biological catalysts.

<div class="myth">

**"Raising the temperature speeds up only the endothermic direction."** Heat speeds up both directions. It speeds the direction with the higher activation energy more, which for an endothermic reaction is the forward one; that is how the equilibrium constant changes with temperature.

</div>

## 5. Complex reactions (JEE Advanced)

- **Parallel:** A → B (k₁) and A → C (k₂). A decays with k₁ + k₂; the product ratio [B]/[C] = k₁/k₂ at every moment. Overall t½ = 0.693/(k₁ + k₂).
- **Consecutive:** A → B → C. [B] rises, reaches a maximum, then falls. The slower step controls how fast C appears.
- **Opposing (reversible):** A ⇌ B. The approach to equilibrium is first order with k_f + k_b, and at equilibrium k_f/k_b = K.
- **Effective Eₐ** for parallel paths: Eₐ = (k₁Eₐ₁ + k₂Eₐ₂)/(k₁ + k₂).

<div class="keypoints">

- Rate = −(1/a) d[A]/dt; same value whichever species is tracked.
- Order comes from experiment; molecularity is for one elementary step and is a whole number.
- Unit of k = (mol/L)^(1−n) s⁻¹.
- First order: k = (2.303/t) log([A]₀/[A]), t½ = 0.693/k, independent of [A]₀.
- Straight lines: [A] (zero), ln[A] (first), 1/[A] (second) against t.
- Arrhenius: log(k₂/k₁) = (Eₐ/2.303R)(T₂ − T₁)/(T₁T₂); higher Eₐ, more temperature sensitive.
- A catalyst lowers Eₐ for both directions and leaves ΔH, ΔG and K unchanged.

</div>
