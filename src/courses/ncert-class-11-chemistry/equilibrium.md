---
title: Equilibrium
seoTitle: 'Equilibrium Class 11 notes: Kc, Le Chatelier, pH, buffers'
summary: 'Class 11 Equilibrium with animations: Kc and Kp, Q against K, ICE tables, Le Chatelier, acids and bases, pH, buffers, hydrolysis and solubility product.'
minutes: 120
updated: 2026-11-23
quiz:
  - q: 'For N₂ + 3H₂ ⇌ 2NH₃ the equilibrium constant expression is:'
    choices: ['Kc = [NH₃]² / ([N₂][H₂]³)', 'Kc = [N₂][H₂]³ / [NH₃]²', 'Kc = [NH₃] / ([N₂][H₂])', 'Kc = 2[NH₃] / (3[H₂] + [N₂])']
    ans: 0
    why: 'Kc = (products raised to their coefficients) / (reactants raised to theirs): [NH₃]² on top, [N₂]¹ and [H₂]³ below.'
  - q: 'A buffer has 0.20 M ethanoic acid (pKa 4.76) and 0.20 M sodium ethanoate. Its pH is:'
    choices: ['4.76', '2.38', '7.00', '9.24']
    ans: 0
    why: 'pH = pKa + log([salt]/[acid]) = 4.76 + log 1 = 4.76.'
  - q: 'The pH of 0.001 M HCl at 25 °C is:'
    choices: ['3', '1', '11', '0.001']
    ans: 0
    why: 'HCl is a strong acid, so [H⁺] = 10⁻³ M and pH = −log 10⁻³ = 3.'
sources:
  - 'NCERT Class 11 Chemistry, Chapter 6 “Equilibrium” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Ka of ethanoic acid (1.8 × 10⁻⁵), Kb of ammonia (1.8 × 10⁻⁵), pKa values of methanoic, benzoic and nitrous acids, and Ksp values of AgCl, BaSO₄, CaF₂ and Ag₂CrO₄: CRC Handbook of Chemistry and Physics, 97th edition, “Dissociation constants” and “Solubility product constants”'
  - 'Kw = 1.0 × 10⁻¹⁴ at 25 °C and the van’t Hoff equation: CRC Handbook of Chemistry and Physics, 97th edition; Atkins, P. and de Paula, J., Physical Chemistry, 11th edition'
  - 'Le Chatelier, H. (1884), Comptes rendus 99, 786, and Guldberg, C. M. and Waage, P. (1864) (for the history box)'
---

**Chemistry · Class 11 · Chapter 6 · about 120 minutes.** By the end you will be able to write and use Kc and Kp, say which way a reaction will go from Q, predict the effect of changing concentration, pressure or temperature, solve an ICE table, work out the pH of acids, bases, salts and buffers, and use the solubility product.

<div class="bigidea">Equilibrium is not rest. It is a <b>balance of two opposite reactions running at the same speed</b>, so the amounts stop changing. K tells you where the balance lies, and Le Chatelier tells you how it moves when you push.</div>

## 1. Equilibrium in physical processes

Close a bottle that is half full of water. At first water molecules leave the liquid faster than they come back, but soon the air above fills with vapour, and the **rate of evaporation equals the rate of condensation**. The level stops changing, but molecules are still going both ways. That is a **dynamic equilibrium**.

Other examples: ice and water at 0 °C in a flask; sugar crystals sitting in a saturated sugar solution; CO₂ gas above an unopened soda bottle (dissolved ⇌ gas). All have the same features:

- It is reached only in a **closed** system.
- The observable properties (concentration, pressure, colour) stay **constant**.
- It is **dynamic**: both processes continue at equal rates.
- It can be reached from **either direction**.
- A **catalyst** speeds up both directions equally and does not change the position.

## 2. Chemical equilibrium and the equilibrium constant

For a reversible reaction `$aA + bB \rightleftharpoons cC + dD$`, the **law of mass action** says that at equilibrium, at a given temperature,

```math
K_c = \frac{[C]^c\,[D]^d}{[A]^a\,[B]^b}
```

<figure class="fig" data-fig="c11c-eqm-dynamic"><figcaption>A ⇌ B, started from only A (or only B). The forward rate falls while the reverse rate climbs until they are equal. Change the rate constants: the final amounts depend on kf/kr = K. Nothing stops at equilibrium, the bars show both reactions still running.</figcaption></figure>

<div class="meaning">

<dl>
<dt>[A]</dt><dd>concentration of A at equilibrium in mol/L; pure solids and pure liquids are left out (their "concentration" is constant)</dd>
<dt>a, b, c, d</dt><dd>coefficients of the balanced equation, which become powers</dd>
<dt>K<sub>c</sub></dt><dd>equilibrium constant; it depends on the reaction and the temperature only</dd>
<dt>Physical meaning</dt><dd>K is a ratio of products to reactants. A large K (≫ 1) means the mixture is mostly products; a small K (≪ 1) means mostly reactants. K says nothing about speed.</dd>
</dl>

</div>

<div class="problem" data-problem="c11c-eqm-kc"></div>

**For gases** we can use partial pressures: `$K_p = \dfrac{p_C^c\,p_D^d}{p_A^a\,p_B^b}$`. The two constants are linked by

```math
K_p = K_c\,(RT)^{\Delta n}
```

where Δn = moles of gaseous products − moles of gaseous reactants. They are equal when Δn = 0.

<div class="problem" data-problem="c11c-eqm-kp"></div>

**Working with K:**

- **Reverse the reaction:** K becomes 1/K.
- **Multiply the equation by n:** K becomes Kⁿ (halving the equation takes the square root).
- **Add two reactions:** multiply their K values.
- **Heterogeneous equilibria:** CaCO₃(s) ⇌ CaO(s) + CO₂(g) has Kc = [CO₂] only, because the solids are omitted.

<div class="myth">

**“At equilibrium the concentrations of reactants and products are equal.”** They are constant, not equal. If K = 50 the products are much more than the reactants; if K = 10⁻⁵ almost nothing has reacted. The only thing equal is the pair of **rates**.

</div>

### Which way will it go? Q against K

Take any mixture, not necessarily at equilibrium, and put the **current** concentrations into the same expression. The result is the **reaction quotient Q**. Compare it with K:

- **Q < K:** too few products, the **forward** reaction runs.
- **Q = K:** at equilibrium.
- **Q > K:** too many products, the **reverse** reaction runs.

<figure class="fig" data-fig="c11c-eqm-q"><figcaption>H₂ + I₂ ⇌ 2HI with K = 50. Set the three concentrations and read off Q, the arrow and the direction. Press "Run to equilibrium" and see the bars slide until Q equals K.</figcaption></figure>

### Finding equilibrium concentrations: the ICE table

**I**nitial, **C**hange, **E**quilibrium. Watch it for H₂ + I₂ ⇌ 2HI (K = 50) starting from 1.00 mol/L of each gas:

<div class="steps" data-fig="c11c-eqm-ice">
<div class="step">Write the balanced equation and its K. Here K = [HI]² / ([H₂][I₂]) = 50.</div>
<div class="step">Initial row: 1.00 mol/L of H₂, 1.00 mol/L of I₂, no HI.</div>
<div class="step">Change row: x mol/L of each reactant is used and 2x of HI forms, following the coefficients 1 : 1 : 2.</div>
<div class="step">Equilibrium row: add I and C. [H₂] = [I₂] = 1 − x and [HI] = 2x.</div>
<div class="step">Put the E row into K: (2x)² / (1 − x)² = 50. The left side is a perfect square, so take square roots: 2x/(1 − x) = 7.07, giving x = 0.780.</div>
<div class="step">So [H₂] = [I₂] = 0.22 mol/L and [HI] = 1.56 mol/L. Check: 1.56² / 0.22² = 50. ✓</div>
</div>

<div class="problem" data-problem="c11c-eqm-ice"></div>

If the equation is not a perfect square, you solve a quadratic; or, if K is very small, you may assume x ≪ the initial concentration (and then check that x really is under about 5 % of it).

## 3. Le Chatelier's principle

**If a system at equilibrium is disturbed, it shifts in the direction that reduces the disturbance.** It is the same Q-versus-K idea: a push makes Q ≠ K, and the reaction runs until Q = K again.

| Change | What happens | Does K change? |
|---|---|---|
| Add a reactant (or remove a product) | shifts forward | no |
| Add a product (or remove a reactant) | shifts backward | no |
| Increase pressure (squeeze) | shifts to the side with **fewer gas moles** | no |
| Raise temperature | shifts in the **endothermic** direction | **yes** |
| Add a catalyst | none, only reaches equilibrium faster | no |
| Add an inert gas at constant volume | none, partial pressures unchanged | no |

Play with all of these on N₂O₄ ⇌ 2NO₂ in the Le Chatelier tool and watch Q chase K:

<!--fig:tool le-chatelier-->

<figure class="fig" data-fig="c11c-eqm-temp"><figcaption>Temperature is the only change that alters K itself. Compare an exothermic and an endothermic reaction: heating makes K fall for the first and rise for the second.</figcaption></figure>

**Industrial example, ammonia (Haber process).** N₂ + 3H₂ ⇌ 2NH₃, ΔH = −92 kJ. Four gas moles become two, so **high pressure** favours NH₃ (about 200 atm). The reaction is exothermic, so **low temperature** favours NH₃, but a cold reaction is slow. A compromise of about 450 °C with an iron **catalyst** is used, and the NH₃ is removed as liquid to keep pulling the equilibrium forward.

<figure class="fig" data-fig="@chem-haber-conditions"><figcaption>Yield and speed of the Haber and contact processes against temperature, with pressure and a catalyst. High yield and high speed pull in opposite directions on temperature.</figcaption></figure>

<div class="history">

**A timeline of equilibrium.** 1864: Guldberg and Waage state the law of mass action. 1884: Henri Le Chatelier states his principle. 1909: Fritz Haber shows ammonia can be made from the air's nitrogen at high pressure; Carl Bosch scales it up by 1913, feeding the farms that today support half the world's people.

</div>

Equilibrium constants connect to energy: `$\Delta G^\circ = -RT\ln K$`. A negative ΔG° means K > 1 (see the Thermodynamics chapter).

## 4. Ionic equilibrium: acids and bases

An **electrolyte** conducts electricity in solution because it gives ions. **Strong electrolytes** (HCl, NaOH, NaCl) ionise fully; **weak electrolytes** (ethanoic acid, ammonia) ionise only a little, so an equilibrium forms between the molecules and ions.

Three ways of defining acids and bases:

- **Arrhenius:** an acid gives H⁺ in water; a base gives OH⁻.
- **Brønsted–Lowry:** an acid **donates** a proton; a base **accepts** one. Every acid has a **conjugate base** (what is left after losing H⁺) and every base has a **conjugate acid**: HCl/Cl⁻, NH₄⁺/NH₃, H₂O/OH⁻. The stronger the acid, the weaker its conjugate base.
- **Lewis:** an acid **accepts** an electron pair; a base **donates** one (BF₃ + :NH₃ → F₃B←NH₃).

**Water ionises slightly:** `$2H_2O \rightleftharpoons H_3O^+ + OH^-$`, with the **ionic product of water**

```math
K_w = [H^+][OH^-] = 1.0\times10^{-14}\quad (25\,^\circ\text{C})
```

In pure water `$[H^+]=[OH^-]=10^{-7}$` M. Define

```math
pH = -\log[H^+]\qquad pOH = -\log[OH^-]\qquad pH + pOH = 14
```

<div class="meaning">

<dl>
<dt>pH</dt><dd>minus the base-10 logarithm of the hydrogen-ion concentration (mol/L)</dd>
<dt>pH &lt; 7 / = 7 / &gt; 7</dt><dd>acidic / neutral / basic at 25 °C</dd>
<dt>Physical meaning</dt><dd>One pH unit is a factor of 10 in [H⁺]. Lemon juice (pH 2) has 100 000 times more H⁺ than pure water. Kw rises with temperature, so hot pure water has a pH a little below 7 but is still neutral.</dd>
</dl>

</div>

<div class="problem" data-problem="c11c-eqm-ph"></div>

Slide the pH and compare everyday liquids (from battery acid to bleach) on the scale:

<!--fig:tool ph-scale-explorer-->

### Weak acids and bases

For a weak acid HA ⇌ H⁺ + A⁻: `$K_a = \dfrac{[H^+][A^-]}{[HA]}$`. If the starting concentration is c and the **degree of ionisation** is α, then `$K_a = \dfrac{c\alpha^2}{1-\alpha}\approx c\alpha^2$`, so

```math
\alpha \approx \sqrt{\frac{K_a}{c}}\qquad [H^+] = c\alpha = \sqrt{K_a\,c}
```

(Ostwald's dilution law: **the more dilute the acid, the more it ionises**.) For a weak base `$K_b$` works the same way with [OH⁻]. A conjugate pair obeys `$K_a \times K_b = K_w$`.

<figure class="fig" data-fig="c11c-eqm-weak"><figcaption>Choose pKa and concentration: the dots show how many acid molecules split into ions, and the marker shows the pH against what a strong acid of the same concentration would give. Dilute it and watch the ionised share grow.</figcaption></figure>

<div class="problem" data-problem="c11c-eqm-weak"></div>

**Polyprotic acids** (H₂CO₃, H₃PO₄) give up protons one step at a time, and each step is much weaker than the last (K₁ ≫ K₂ ≫ K₃), because it is hard to pull a proton from an already negative ion. Nearly all the H⁺ comes from the first step.

### Common ion effect

Add a salt that shares an ion with a weak electrolyte, and the weak electrolyte ionises **less** (Le Chatelier). Adding sodium ethanoate to ethanoic acid pushes CH₃COOH ⇌ H⁺ + CH₃COO⁻ to the left.

<figure class="fig" data-fig="c11c-eqm-common"><figcaption>0.10 M ethanoic acid with sodium ethanoate added. The percent ionised and the pH change as you slide: with 0.10 M of the salt the acid is only 0.018 % ionised and the pH rises from 2.88 to 4.74.</figcaption></figure>

### Hydrolysis of salts

A salt can change the pH of water because one of its ions reacts with it (**hydrolysis**). The rule: the ion of a **strong** acid or base is a spectator; the ion of a **weak** acid or base reacts.

| Salt of | Example | Solution |
|---|---|---|
| strong acid + strong base | NaCl, KNO₃ | neutral, pH 7 |
| strong acid + weak base | NH₄Cl | acidic: NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺ |
| weak acid + strong base | CH₃COONa | basic: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻ |
| weak acid + weak base | CH₃COONH₄ | depends on Ka against Kb |

<figure class="fig" data-fig="c11c-eqm-salt"><figcaption>Pick a salt: see which ion reacts with water and where the solution lands on the pH scale. Slide the concentration and see how the pH changes for NH₄Cl and CH₃COONa.</figcaption></figure>

### Buffer solutions

A **buffer** resists a change in pH when small amounts of acid or base are added. It contains a weak acid and its conjugate base (or a weak base and its conjugate acid). Added H⁺ is mopped up by the base; added OH⁻ by the acid. The pH is given by the **Henderson–Hasselbalch equation**:

```math
pH = pK_a + \log\frac{[\text{salt}]}{[\text{acid}]}
```

<figure class="fig" data-fig="@chem-buffer-ph"><figcaption>The pH of a buffer against water as strong acid or base is added: the buffer barely moves until its acid or base is used up. Change the ratio and capacity with the sliders. Your blood is a buffer, held at pH 7.4 by HCO₃⁻/H₂CO₃.</figcaption></figure>

<div class="problem" data-problem="c11c-eqm-buffer"></div>

Design a buffer with the [buffer recipe calculator](/science/buffer-recipe-calculator/), and solve any equilibrium with the [equilibrium solver](/science/equilibrium-solver/).

## 5. Solubility equilibria

A sparingly soluble salt in water sets up an equilibrium between the solid and its ions: `$AgCl(s) \rightleftharpoons Ag^+ + Cl^-$`. The **solubility product** is

```math
K_{sp} = [Ag^+][Cl^-]\qquad\text{and for } A_xB_y:\; K_{sp} = [A^{y+}]^x[B^{x-}]^y
```

For a salt A<sub>x</sub>B<sub>y</sub> of solubility s, `$K_{sp} = x^x y^y s^{x+y}$` (for example 4s³ for Ca(OH)₂ or Ag₂CrO₄).

<div class="problem" data-problem="c11c-eqm-ksp"></div>

**Will a precipitate form?** Mix solutions and calculate the **ionic product** (like Q): if it is **greater than Ksp**, the salt precipitates; if less, it stays dissolved. This is how softener resins, medical kidney-stone tests and the salt-analysis table work. A common ion lowers the solubility (AgCl dissolves less in NaCl solution than in pure water).

<!--fig:tool ksp-precipitation-->

<div class="myth">

**“A salt with a smaller Ksp always has a smaller solubility.”** Only for salts of the same type (same x : y ratio). Ag₂CrO₄ has Ksp = 1.1 × 10⁻¹² and is **more** soluble (6.5 × 10⁻⁵ M) than AgCl with Ksp = 1.8 × 10⁻¹⁰ (1.3 × 10⁻⁵ M), because Ksp for A₂B has a cube in it.

</div>

<div class="keypoints">

- Dynamic equilibrium: forward rate = reverse rate; concentrations constant; reached from either side in a closed vessel; a catalyst changes the speed, not the position.
- Kc = [products]^coefficient / [reactants]^coefficient (solids and pure liquids left out). Kp = Kc(RT)^Δn. Reverse: 1/K; ×n: Kⁿ; add reactions: multiply K.
- Q < K: forward; Q > K: reverse; Q = K: equilibrium. ICE table: initial, change, equilibrium, then solve.
- Le Chatelier: the system opposes the change. More gas moles on one side: pressure shifts toward fewer. Only temperature changes K. Haber process: high pressure, moderate T, catalyst.
- Kw = [H⁺][OH⁻] = 10⁻¹⁴; pH = −log[H⁺]; pH + pOH = 14. Weak acid: [H⁺] = √(Ka c), α = √(Ka/c); Ka × Kb = Kw.
- Common ion effect lowers ionisation. Salt hydrolysis: strong acid + weak base is acidic; weak acid + strong base is basic.
- Buffer: pH = pKa + log([salt]/[acid]); best when the ratio is about 1.
- Ksp: ionic product > Ksp means precipitate. For A_xB_y, Ksp = x^x y^y s^(x+y).

</div>

Going further for JEE/NEET: the exam-level problems on Kp with degree of dissociation, mixed buffers, hydrolysis constants and selective precipitation are in [Chemical equilibrium (JEE)](/learn/courses/engineering-entrance/chemical-equilibrium/) and [Ionic equilibrium (JEE)](/learn/courses/engineering-entrance/ionic-equilibrium/), with extra practice in [Ionic equilibrium questions](/learn/courses/engineering-entrance/ionic-equilibrium-questions/); NEET asks the same chemistry.
