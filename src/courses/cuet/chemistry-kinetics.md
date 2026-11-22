---
title: 'Chemistry: chemical kinetics'
seoTitle: 'Chemical kinetics for CUET Chemistry: rate, order, half-life'
summary: 'Rate of reaction, rate law, order and molecularity, zero and first-order integrated equations and half-lives, the Arrhenius equation and catalysts, with a live half-life problem.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'The half-life of a first-order reaction:'
    choices: ['does not depend on the starting concentration', 'doubles when concentration doubles', 'halves when concentration doubles']
    ans: 0
    why: 't½ = 0.693/k has no concentration in it, which is why radioactive decay (first order) has a fixed half-life.'
  - q: 'The units of k for a zero-order reaction are:'
    choices: ['mol L⁻¹ s⁻¹', 's⁻¹', 'L mol⁻¹ s⁻¹']
    ans: 0
    why: 'For zero order, rate = k, so k has the units of rate.'
  - q: 'A catalyst speeds up a reaction by:'
    choices: ['providing a path with lower activation energy', 'raising the temperature', 'changing ΔH of the reaction']
    ans: 0
    why: 'It lowers Eₐ for both forward and back reactions; ΔH and the equilibrium position stay the same.'
sources:
  - 'NCERT, Chemistry Part I (Class 12), Chemical Kinetics'
  - 'National Testing Agency, CUET (UG) Chemistry syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 7 · about 20 minutes.** By the end you will find order from data, use the first-order equation and half-life, and apply the Arrhenius equation.

<div class="bigidea">Kinetics asks how fast, not how far. Rate depends on concentration (through the rate law) and on temperature (through how many collisions have enough energy to get over the hill).</div>

**Everyday picture:** milk goes sour in a day on a hot counter but lasts a week in the fridge. Lower temperature means far fewer molecules with enough energy to react, so the souring reactions slow down a lot.

## 1. Rate law, order and molecularity

For aA + bB → products, rate = k[A]^x[B]^y. The order (x + y) comes from experiment, not from the equation. Molecularity is the number of species colliding in one elementary step: always a whole number (1, 2 or rarely 3), and only defined for elementary steps.

<div class="steps" data-title="Finding order from initial rates">
<div class="step"><b>Pick two runs</b> where only [A] changes.</div>
<div class="step"><b>Compare:</b> if doubling [A] doubles the rate, x = 1; if it quadruples the rate, x = 2; if no change, x = 0.</div>
<div class="step"><b>Repeat for B.</b></div>
<div class="step"><b>Add</b> the powers for the overall order, then put one run into the law to find k.</div>
</div>

## 2. Integrated rate laws

| Order | Integrated law | Half-life | Units of k |
|---|---|---|---|
| Zero | [A] = [A]₀ − kt | [A]₀/2k | mol L⁻¹ s⁻¹ |
| First | k = (2.303/t) log([A]₀/[A]) | 0.693/k | s⁻¹ |

<div class="problem" data-problem="first-order"></div>

Pseudo first order: when one reactant is in huge excess (water in the hydrolysis of an ester or of sucrose), the reaction behaves as first order in the other.

## 3. Temperature and catalysts

```math
k = A\,e^{-E_a/RT} \qquad \log\frac{k_2}{k_1} = \frac{E_a}{2.303R}\left(\frac{1}{T_1} - \frac{1}{T_2}\right)
```

<div class="meaning">

<dl>
<dt>Eₐ (activation energy)</dt><dd>the energy hill reacting molecules must climb. Only collisions with at least this much energy (and the right orientation) react.</dd>
<dt>e^(−Eₐ/RT)</dt><dd>the fraction of collisions with enough energy. A 10 K rise near room temperature often roughly doubles the rate.</dd>
<dt>Catalyst</dt><dd>offers a lower hill. Same start, same finish, same ΔH; it just gets there faster.</dd>
</dl>

</div>

<div class="myth">

**"Order and molecularity are the same thing."** Order is measured and can be zero or a fraction; molecularity is a count of colliding particles in one step. For a multi-step reaction, the slowest step sets the rate law.

</div>

## 4. Practice

<div class="qbank" data-bank="entrance-chemistry" data-topics="chemical-kinetics" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Rate = k[A]^x[B]^y; order from experiment, molecularity from the step.
- First order: k = (2.303/t) log([A]₀/[A]), t½ = 0.693/k (constant).
- Zero order: t½ = [A]₀/2k.
- Arrhenius k = Ae^(−Eₐ/RT); a catalyst lowers Eₐ, not ΔH.

</div>
