---
title: 'Chemical Kinetics: practice questions'
seoTitle: 'Chemical Kinetics Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Chemical Kinetics: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with worked answers.'
minutes: 65
updated: 2026-11-22
quiz:
  - q: 'The half-life of a first order reaction is 15 min. The fraction left after 45 min is:'
    choices: ['1/8', '1/4', '1/3', '1/6']
    ans: 0
    why: '45 min is 3 half-lives, and (1/2)³ = 1/8 remains.'
  - q: 'The rate constant of a reaction has units L mol⁻¹ s⁻¹. The order is:'
    choices: ['2', '1', '0', '3']
    ans: 0
    why: 'The unit of k is (mol/L)^(1−n) s⁻¹. For n = 2 this is (mol/L)⁻¹ s⁻¹ = L mol⁻¹ s⁻¹.'
  - q: 'The activation energy of a reaction is 50 kJ/mol. A catalyst lowers it to 40 kJ/mol. The change in ΔH of the reaction is:'
    choices: ['0', '−10 kJ/mol', '+10 kJ/mol', '−50 kJ/mol']
    ans: 0
    why: 'A catalyst changes the pathway, not the energy of the reactants and products, so ΔH is unchanged.'
sources:
  - 'CBSE Class 12 Chemistry sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Chemistry · Chapter 3.** Read the chapter lesson, [Chemical Kinetics](/learn/courses/ncert-class-12-chemistry/chemical-kinetics/), first. Try each question on paper before opening the answer. Marks go for the rate law or integrated equation, the substitution with units, and the final answer.

<div class="bigidea">Kinetics questions come in four kinds: get the order from data (compare experiments), use the first order or zero order formulas for concentration and time, use half-lives, and use the Arrhenius equation for temperature. Read the units of k first: they tell you the order.</div>

## How to set out a numerical

1. Decide the order (from the units of k, from the data, or from the question).
2. Write the right formula: zero `$[R]=[R]_0-kt$`; first `$k=\frac{2.303}{t}\log\frac{[R]_0}{[R]}$`.
3. Keep time in one unit throughout and keep the unit of k.
4. For temperature questions, T in kelvin and Ea converted to J/mol.

<div class="problem" data-problem="c12c-kin-first"></div>

<div class="problem" data-problem="c12c-kin-ea"></div>

## 1-mark questions

1. Define the rate constant of a reaction.

<details><summary>Answer</summary>The rate of the reaction when the concentration of every reactant is 1 mol/L.</details>

2. What is the order of a reaction whose rate does not depend on the concentration of the reactant?

<details><summary>Answer</summary>Zero order.</details>

3. Name the step that decides the rate of a multi-step reaction.

<details><summary>Answer</summary>The slowest step, called the rate-determining step.</details>

4. What does the slope of a graph of ln k against 1/T give?

<details><summary>Answer</summary>The value of −Ea/R, so Ea = −slope × R.</details>

## 2- and 3-mark questions

5. (2) Distinguish between the order and the molecularity of a reaction.

<details><summary>Answer</summary>Order is the sum of the powers of concentrations in the experimental rate law; it can be zero, a fraction or an integer, and applies to the whole reaction. Molecularity is the number of molecules colliding in one elementary step; it is always a whole number (1, 2, 3) and is not defined for a complex reaction as a whole.</details>

6. (2) For 2NO + O₂ → 2NO₂ the rate law found by experiment is rate = k[NO]²[O₂]. What is the order, and the unit of k?

<details><summary>Answer</summary>

Order = 2 + 1 = 3. The unit of k is `$\text{L}^2\,\text{mol}^{-2}\,\text{s}^{-1}$`.

</details>

7. (3) The rate of a reaction between A and B changes as follows. [A] = 0.1, [B] = 0.1, rate = 3 × 10⁻³; [A] = 0.3, [B] = 0.1, rate = 9 × 10⁻³; [A] = 0.1, [B] = 0.3, rate = 3 × 10⁻³ (mol/L and mol L⁻¹ s⁻¹). Find the rate law and k.

<details><summary>Answer</summary>

Tripling [A] triples the rate, so order 1 in A. Tripling [B] does not change the rate: order 0 in B. Rate = k[A]. `$k = 3\times10^{-3}/0.1 = 3\times10^{-2}\ \text{s}^{-1}$`.

</details>

8. (3) A first order reaction is 75 % complete in 30 minutes. Find the half-life and k.

<details><summary>Answer</summary>

75 % complete means 25 % is left = (1/2)², so two half-lives = 30 min, `$t_{1/2}=15$` min. `$k = 0.693/15 = 0.0462\ \text{min}^{-1}$`.

</details>

9. (3) What fraction of the molecules in a reaction with Ea = 50 kJ/mol have the minimum energy at 300 K? (R = 8.314 J K⁻¹ mol⁻¹; e<sup>−20</sup> = 2.1 × 10⁻⁹)

<details><summary>Answer</summary>

`$Ea/RT = 50000/(8.314\times300) = 20.05$`, so the fraction is `$e^{-20.05}\approx 2\times10^{-9}$`: only about two in a billion molecules have enough energy, which is why reactions with high Ea are slow at room temperature.

</details>

10. (3) A catalyst lowers the activation energy of a reaction from 75 to 60 kJ/mol. By what factor does the rate increase at 300 K? (R = 8.314 J K⁻¹ mol⁻¹, e⁶ ≈ 403)

<details><summary>Answer</summary>

`$\dfrac{k_{cat}}{k} = e^{\Delta E_a/RT} = e^{15000/(8.314\times300)} = e^{6.01}\approx 4\times10^{2}$`. The rate is about 400 times larger, assuming the same A.

</details>

## 5-mark questions (model answers)

11. (5) Derive the integrated rate equation for a first order reaction and show that its half-life does not depend on the initial concentration.

<details><summary>Answer</summary>

For `$R\to P$` the rate is `$-\dfrac{d[R]}{dt}=k[R]$`. Separating the variables, `$\dfrac{d[R]}{[R]}=-k\,dt$`. Integrating, `$\ln[R]=-kt+I$`.

At t = 0, [R] = [R]₀, so `$I=\ln[R]_0$`. Hence `$\ln\dfrac{[R]_0}{[R]}=kt$`, that is `$k=\dfrac{2.303}{t}\log\dfrac{[R]_0}{[R]}$`.

At t = t½, [R] = [R]₀/2, so `$kt_{1/2}=\ln 2$` and `$t_{1/2}=\dfrac{0.693}{k}$`. [R]₀ has cancelled, so the half-life is the same whatever the starting concentration.

</details>

12. (5) Explain collision theory. How does it explain the effect of temperature and of a catalyst on the rate?

<details><summary>Answer</summary>

Collision theory says that a reaction occurs only when molecules collide with (i) at least the threshold energy and (ii) the proper orientation. The extra energy needed over the average is the activation energy Ea. The rate is Z e<sup>−Ea/RT</sup> P, where Z is the collision frequency and P the orientation factor.

Temperature: a rise of 10 K increases the collision frequency only slightly, but greatly increases the fraction of molecules with energy of at least Ea (the tail of the energy distribution). The rate roughly doubles.

Catalyst: it gives a different path with lower Ea, so a larger fraction of collisions is effective. ΔH and the equilibrium constant do not change.

</details>

13. (5) The rate constant of a reaction is 2.0 × 10⁻³ s⁻¹ at 300 K and 8.0 × 10⁻³ s⁻¹ at 320 K. Find Ea. (R = 8.314 J K⁻¹ mol⁻¹, log 4 = 0.602)

<details><summary>Answer</summary>

`$\log\dfrac{k_2}{k_1}=\dfrac{E_a}{2.303R}\cdot\dfrac{T_2-T_1}{T_1T_2}$`, so `$0.602=\dfrac{E_a}{2.303\times8.314}\cdot\dfrac{20}{300\times320}$`.

`$E_a=\dfrac{0.602\times2.303\times8.314\times96000}{20}=5.53\times10^4$` J/mol ≈ 55.3 kJ/mol.

</details>

## Case-based question

14. **A fading medicine and a pressure cooker.** The medicine in a syrup decomposes by a first order reaction with half-life 12 months at 25 °C; the label says to discard it when 25 % has decomposed. Cooking dal takes less time in a pressure cooker (about 120 °C) than in an open pan (100 °C). Take log 2 = 0.30.

(a) (1) Find the rate constant of the decomposition of the medicine.

(b) (1) After how long has 25 % decomposed? (log 4/3 = 0.125)

(c) (1) Why does the dal cook faster at 120 °C?

(d) (1) What would happen to the shelf life if the syrup is kept in a hot place?

<details><summary>Answer</summary>

(a) `$k = 0.693/12 = 0.058\ \text{month}^{-1}$`.

(b) `$t = \dfrac{2.303}{k}\log\dfrac{100}{75} = \dfrac{2.303}{0.058}\times0.125 = 5.0$` months.

(c) The rate constant rises steeply with temperature (Arrhenius), as many more molecules have the activation energy; the higher temperature in the cooker (steam under pressure) makes the reactions in the dal much faster.

(d) The shelf life is shorter: k is larger, so 25 % decomposes sooner.

</details>

## Assertion-reason questions

Choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

15. **A:** The rate of a reaction increases when a catalyst is added. **R:** A catalyst lowers the activation energy.

<details><summary>Answer</summary>(A) Both true and R explains A: a lower barrier means a larger fraction of collisions are effective.</details>

16. **A:** The order of a reaction can be a fraction. **R:** Molecularity of a reaction cannot be a fraction.

<details><summary>Answer</summary>(B) Both true, but R does not explain A: order is found from experiment and so can be fractional, and molecularity (for an elementary step) is a whole number. The second statement does not give the reason for the first.</details>

17. **A:** For a zero order reaction the half-life is proportional to the initial concentration. **R:** For zero order the rate does not depend on the concentration.

<details><summary>Answer</summary>(A) Both true and R explains A: the reactant is used at a constant rate k, so a larger amount takes proportionally longer to half-finish: t½ = [R]₀/2k.</details>

## Question set from the bank

New numbers and questions each time. Check your answer, read the hint if you are stuck, then compare with the full solution.

<div class="qbank" data-bank="ncert-class-12-chemistry" data-topics="chemical-kinetics" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Rate law: rate = k[A]ˣ[B]ʸ from experiment; unit of k = (mol/L)^(1−n) s⁻¹.
- Zero order: [R] = [R]₀ − kt, t½ = [R]₀/2k. First order: k = (2.303/t) log([R]₀/[R]), t½ = 0.693/k.
- Fraction left after n half-lives is (1/2)ⁿ.
- Arrhenius: k = A e^(−Ea/RT); log(k₂/k₁) = Ea(T₂ − T₁)/(2.303 R T₁T₂).
- Catalyst: lowers Ea; does not change ΔH, K or yield.

</div>
