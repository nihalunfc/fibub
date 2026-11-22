---
title: 'Chemical kinetics: question types and traps'
seoTitle: 'Kinetics questions for JEE and NEET: types and traps'
summary: 'Every way entrance exams ask about kinetics: rate and stoichiometry, order from data, units of k, integrated laws and half-life, gas-pressure kinetics, Arrhenius and temperature coefficient, radioactive dating, and parallel or consecutive reactions, each with a method and its trap. Then practise.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'For 2A → 3B, if A disappears at 0.4 M/min, B appears at:'
    choices: ['0.27 M/min', '0.4 M/min', '0.6 M/min', '1.2 M/min']
    ans: 2
    why: '(1/2)(0.4) = (1/3) d[B]/dt, so d[B]/dt = 0.6 M/min.'
  - q: 'For a zero-order reaction, doubling the initial concentration makes the half-life:'
    choices: ['half', 'the same', 'double', 'four times']
    ans: 2
    why: 't½ = [A]₀/2k for zero order, so it is proportional to the starting concentration.'
  - q: 'The rate of a reaction triples for every 10 °C rise. Going from 20 °C to 50 °C, the rate rises by a factor of:'
    choices: ['9', '27', '30', '81']
    ans: 1
    why: 'Three 10 °C steps: 3³ = 27.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Chemical kinetics; question patterns studied from published papers (no questions copied)'
---

**Chemistry · Class 12 · about 25 minutes.** Read [Chemical kinetics](/learn/courses/engineering-entrance/chemical-kinetics/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Kinetics questions are either "find the order" or "use the order". Once you know the order, one formula (integrated law or half-life) does the rest. Temperature questions use Arrhenius; everything else is careful bookkeeping of concentrations or pressures.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Rate and stoichiometry.</b> Divide each rate by its coefficient. <i>Trap:</i> forgetting the minus sign for reactants, or multiplying instead of dividing.</div>
<div class="step"><b>2. Order from initial rates or units.</b> Change one concentration at a time; unit of k = (mol/L)^(1−n) s⁻¹. <i>Trap:</i> a reactant with no effect on rate has order 0, not "missing".</div>
<div class="step"><b>3. First-order law and half-life.</b> k = (2.303/t) log([A]₀/[A]). <i>Trap:</i> "75% complete" means [A] = 25% of [A]₀, not 75%.</div>
<div class="step"><b>4. Half-life tells the order.</b> t½ ∝ [A]₀^(1−n). <i>Trap:</i> zero order half-life shrinks as the reaction goes on.</div>
<div class="step"><b>5. Gas pressure kinetics.</b> Make an ICE-style table in pressures. <i>Trap:</i> the total pressure is not the reactant's pressure.</div>
<div class="step"><b>6. Arrhenius and temperature coefficient.</b> log(k₂/k₁) = (Eₐ/2.303R)(ΔT/T₁T₂). <i>Trap:</i> T in kelvin, R = 8.314 J, answer in J then kJ.</div>
<div class="step"><b>7. Radioactive decay and dating.</b> First order; t = (2.303/λ) log(N₀/N). <i>Trap:</i> in rock dating, N₀ = N(parent) + N(daughter).</div>
<div class="step"><b>8. Complex reactions.</b> Parallel: ratio of products = k₁/k₂. Consecutive: maximum of the middle species. Pseudo first order. <i>Trap:</i> the overall k for parallel paths is k₁ + k₂.</div>
</div>

## Worked examples

**Example 1 (level 3, order from half-lives).** For a reaction of A, the half-life is 40 min when [A]₀ = 0.2 M and 20 min when [A]₀ = 0.4 M. Find the order. *Solution.* t½ ∝ [A]₀^(1−n): doubling [A]₀ halves t½, so 2^(1−n) = 1/2, 1 − n = −1, **n = 2**.

**Example 2 (level 4, gas pressure).** SO₂Cl₂(g) → SO₂(g) + Cl₂(g) is first order. Starting at 0.5 atm, the total pressure is 0.6 atm after 100 s. Find k. *Solution.* Let p decompose: total = 0.5 + p = 0.6, p = 0.1. p(SO₂Cl₂) = 0.4 atm. k = (2.303/100) log(0.5/0.4) = 0.02303 × 0.0969 = **2.23 × 10⁻³ s⁻¹**.

**Example 3 (level 4, Arrhenius with a catalyst).** A catalyst lowers Eₐ by 20 kJ/mol at 300 K. By what factor does the rate rise (same A)? *Solution.* k_cat/k = e^(ΔEₐ/RT) = e^(20 000/(8.314 × 300)) = e^(8.02) ≈ **3000**. A small drop in barrier makes a huge difference because it sits in an exponent.

**Example 4 (level 5, parallel reactions).** A → B (k₁ = 0.03 min⁻¹) and A → C (k₂ = 0.01 min⁻¹). Find the percentage of B among the products and the half-life of A. *Solution.* [B]/[C] = 3, so B is **75%** of the products at all times. A decays with k = 0.04 min⁻¹: t½ = 0.693/0.04 = **17.3 min**.

<div class="myth">

**"A fast reaction must have a large equilibrium constant."** Speed and extent are separate questions. Diamond turning into graphite has a favourable ΔG but is so slow that diamonds last for ever. A catalyst changes speed, never K.

</div>

<div class="meaning">
<dl>
<dt>t½ ∝ [A]₀^(1−n)</dt><dd>the fastest way to read order from half-life data</dd>
<dt>Temperature coefficient</dt><dd>k(T + 10)/k(T), usually 2 to 3 near room temperature</dd>
<dt>Physical meaning</dt><dd>Order says how strongly the rate depends on concentration; Eₐ says how strongly it depends on temperature.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-chemistry" data-topics="chemical-kinetics" data-mode="practice"></div>

<div class="keypoints">

- Rates divide by coefficients; reactants take a minus sign.
- Order from units, initial rates, half-life dependence or the straight-line plot.
- First order: x% done means [A]₀/[A] = 100/(100 − x).
- Gas kinetics: build a pressure table before using the formula.
- Arrhenius in kelvin and joules; catalysts and Eₐ changes act through an exponent.
- Parallel reactions: overall k = k₁ + k₂, product ratio = k₁/k₂.

</div>
