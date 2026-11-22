---
title: 'Chemical equilibrium'
seoTitle: 'Chemical equilibrium, Kp, Kc and Le Chatelier: JEE and NEET'
summary: 'Dynamic equilibrium, the law of mass action, Kc and Kp and how they are linked, changing and combining equations, heterogeneous equilibria, the reaction quotient Q, ICE tables, degree of dissociation and vapour density, Le Chatelier''s principle (concentration, pressure, inert gas, temperature, catalyst), the van''t Hoff equation and ΔG° = −RT ln K.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), the relation between Kp and Kc is:'
    choices: ['Kp = Kc', 'Kp = Kc(RT)²', 'Kp = Kc(RT)⁻²', 'Kp = Kc(RT)⁻¹']
    ans: 2
    why: 'Δn = 2 − 4 = −2, and Kp = Kc(RT)^Δn.'
  - q: 'Argon is added to an equilibrium mixture of PCl₅, PCl₃ and Cl₂ at constant volume. The equilibrium:'
    choices: ['Shifts forward', 'Shifts backward', 'Does not shift', 'Depends on temperature']
    ans: 2
    why: 'At constant volume the partial pressures (and concentrations) of the reacting gases do not change, so Q still equals K. At constant pressure the volume would grow and the equilibrium would shift to the side with more gas moles.'
  - q: 'If K for A ⇌ B is 4, then K for 2B ⇌ 2A is:'
    choices: ['1/16', '1/4', '16', '1/2']
    ans: 0
    why: 'Reversing gives 1/4; doubling the coefficients squares it: (1/4)² = 1/16.'
sources:
  - 'IUPAC Gold Book: equilibrium constant, reaction quotient, Le Chatelier principle https://goldbook.iupac.org'
  - 'CODATA 2018: R = 8.314 462 618 J mol⁻¹ K⁻¹ https://physics.nist.gov/cuu/Constants/'
  - 'NEET (UG) and JEE Main / JEE Advanced 2026 syllabi: Equilibrium (chemical equilibrium part)'
---

**Chemistry · Class 11 · about 34 minutes.** By the end you will be able to write any equilibrium constant, convert between Kc and Kp, predict the direction of a reaction from Q, solve ICE tables and dissociation problems, and say exactly what any change of conditions does to an equilibrium.

<div class="bigidea">At equilibrium, reactions have not stopped: the forward and backward reactions run at the same rate, so nothing changes overall. The equilibrium constant K is a fixed ratio of products to reactants at a given temperature, and the system always moves to restore that ratio when disturbed.</div>

## 1. Dynamic equilibrium

In a closed container, a reversible reaction slows down in the forward direction as reactants are used up, while the backward reaction speeds up as products build up. When the two rates become equal, concentrations stop changing: **dynamic equilibrium**. The same state is reached from either side. Physical changes reach equilibrium too: a liquid and its vapour in a closed bottle, or a saturated solution with undissolved solid.

## 2. The law of mass action, Kc and Kp

For a general reaction aA + bB ⇌ cC + dD at equilibrium:

```math
K_c = \frac{[C]^c[D]^d}{[A]^a[B]^b} \qquad K_p = \frac{p_C^{\,c}\,p_D^{\,d}}{p_A^{\,a}\,p_B^{\,b}} \qquad K_p = K_c(RT)^{\Delta n}
```

<div class="meaning">
<dl>
<dt>[A]</dt><dd>equilibrium concentration of A in mol/L</dd>
<dt>p<sub>A</sub></dt><dd>equilibrium partial pressure of A (atm or bar)</dd>
<dt>Δn</dt><dd>moles of gaseous products − moles of gaseous reactants (c + d − a − b for all-gas reactions)</dd>
<dt>Q</dt><dd>reaction quotient: the same ratio as K, but for the mixture as it is right now</dd>
<dt>α</dt><dd>degree of dissociation: the fraction of a reactant that has broken up at equilibrium</dd>
<dt>Physical meaning</dt><dd>K is large (above about 10³) when the products win, small (below 10⁻³) when the reactants win. It depends only on temperature, never on starting amounts, pressure or a catalyst.</dd>
</dl>
</div>

R must match the units: 0.0821 L atm K⁻¹ mol⁻¹ when pressures are in atm. If Δn = 0 (H₂ + I₂ ⇌ 2HI), Kp = Kc and K has no units.

<div class="problem" data-problem="eq-kp-kc"></div>

**Changing the equation changes K.** Reverse it: K becomes 1/K. Multiply all coefficients by n: K becomes Kⁿ (halve them: √K). Add two equations: multiply their Ks.

## 3. Heterogeneous equilibria

When phases differ, **pure solids and pure liquids are left out** of K, because their "concentration" (density over molar mass) is constant. For CaCO₃(s) ⇌ CaO(s) + CO₂(g), Kp = p<sub>CO₂</sub>: at a given temperature the CO₂ pressure above the solids is fixed, however much solid is present. For NH₄HS(s) ⇌ NH₃(g) + H₂S(g) starting from the solid alone, each gas has pressure P/2, so Kp = P²/4.

## 4. The reaction quotient Q

Q has the same form as K but uses the current amounts. Compare it with K:

- **Q &lt; K**: too few products; the net reaction goes **forward**.
- **Q &gt; K**: too many products; it goes **backward**.
- **Q = K**: at equilibrium.

This links to thermodynamics: ΔG = ΔG° + RT ln Q, and at equilibrium ΔG = 0, so **ΔG° = −RT ln K**.

## 5. ICE tables and degree of dissociation

Most calculations use an **ICE** table: Initial amounts, Change (in terms of x, using the coefficients), Equilibrium amounts. Put the equilibrium row into K and solve for x.

<div class="problem" data-problem="eq-ice-hi"></div>

For a dissociation like PCl₅ ⇌ PCl₃ + Cl₂ starting with 1 mol, at equilibrium there are 1 − α, α and α mol: total 1 + α. With total pressure P, each partial pressure is its mole fraction times P, and

```math
K_p = \frac{\alpha^2 P}{1-\alpha^2} \quad\Rightarrow\quad \alpha = \sqrt{\frac{K_p}{K_p + P}}
```

**Vapour density method.** Mass is conserved but the number of moles grows, so the vapour density falls. If one molecule gives n particles: α = (D − d)/((n − 1)d), where D is the vapour density with no dissociation and d the measured one.

<div class="problem" data-problem="eq-alpha-vd"></div>

## 6. Le Chatelier's principle

If a system at equilibrium is disturbed, it shifts in the direction that **partly undoes** the disturbance.

| Change | Effect on position | Effect on K |
|---|---|---|
| Add a reactant or remove a product | forward | none |
| Raise pressure by compressing | towards fewer gas moles | none |
| Add inert gas at constant volume | no shift | none |
| Add inert gas at constant pressure | towards more gas moles (like lowering pressure) | none |
| Raise temperature | in the endothermic direction | rises if ΔH &gt; 0, falls if ΔH &lt; 0 |
| Add a catalyst | no shift; equilibrium is reached sooner | none |

<figure class="fig" data-fig="eq-pressure"><figcaption>PCl₅ ⇌ PCl₃ + Cl₂. Raising the total pressure pushes the equilibrium towards PCl₅ (1 gas mole instead of 2), so α falls. Raising Kp, which heating does for this endothermic reaction, pushes it forward.</figcaption></figure>

**The Haber process** (N₂ + 3H₂ ⇌ 2NH₃, ΔH = −92 kJ/mol) shows the trade-offs: high pressure (about 200 atm) favours ammonia; a low temperature would too, but the reaction would be far too slow, so about 700 K is used with an iron catalyst, and ammonia is removed as it forms.

<div class="myth">

**"Adding a catalyst gives more product."** A catalyst speeds up the forward and backward reactions by the same factor. It does not change K or the equilibrium amounts; it only gets you there faster.

</div>

**Try it:** press each disturbance in turn and watch the Q and K numbers: add N₂O₄, add NO₂, squeeze, expand, heat, cool. Predict the direction before you look.

<figure class="fig" data-fig="@chem-le-chatelier"><figcaption>After each push Q ≠ K and the system moves to make Q = K again. Heating changes K itself (forward reaction is endothermic), while changing concentration or volume does not: the position shifts but K stays the same.</figcaption></figure>

## 7. Temperature and K: the van't Hoff equation

Only temperature changes K. For ΔH roughly constant:

```math
\log\frac{K_2}{K_1} = \frac{\Delta H^\circ}{2.303R}\left(\frac{1}{T_1} - \frac{1}{T_2}\right)
```

For an endothermic reaction (ΔH° &gt; 0), K grows with T; for an exothermic one it falls. A plot of log K against 1/T is a straight line with slope −ΔH°/(2.303R).

<div class="myth">

**"Increasing the concentration of a reactant increases K."** It increases the amount of product, but the ratio K stays the same: the system adjusts until Q = K again. K moves only with temperature.

</div>

<div class="keypoints">

- K = products over reactants, each raised to its coefficient; leave out pure solids and liquids.
- Kp = Kc(RT)<sup>Δn</sup>, Δn counting gases only.
- Reverse: 1/K. Multiply by n: Kⁿ. Add equations: multiply Ks.
- Q &lt; K forward, Q &gt; K backward; ΔG° = −RT ln K.
- PCl₅-type: α = √(Kp/(Kp + P)); vapour density: α = (D − d)/((n − 1)d).
- Le Chatelier: pressure to fewer gas moles; inert gas at constant V does nothing; catalyst never shifts.
- Only T changes K; van't Hoff: log(K₂/K₁) = ΔH°/(2.303R) × (1/T₁ − 1/T₂).

</div>
