---
title: 'Heat, expansion, calorimetry and heat transfer: question types and traps'
seoTitle: 'Calorimetry and heat transfer questions: JEE, NEET'
summary: 'Every way entrance exams ask about thermal properties: scale conversions, expansion and density, pendulum clocks and thermal stress, calorimetry with ice and steam, heating curves, conduction in series and parallel, ice on ponds, radiation laws and Newton''s law of cooling, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'Two rods of equal length and area but conductivities k and 2k are joined end to end. Their equivalent conductivity is:'
    choices: ['1.5k', '4k/3', '3k', '2k/3']
    ans: 1
    why: 'Equal lengths in series: 2k₁k₂/(k₁ + k₂) = 2 × 2k²/3k = 4k/3.'
  - q: 'The peak wavelength of a star''s spectrum halves. Its surface temperature:'
    choices: ['halves', 'doubles', 'becomes four times', 'is unchanged']
    ans: 1
    why: 'Wien: λ_m T = constant. Half the peak wavelength means twice the temperature (and 16 times the power per area).'
  - q: '10 g of steam at 100 °C is passed into a large amount of ice at 0 °C. How much ice melts? (L_v = 540 cal/g, L_f = 80 cal/g, c = 1 cal/g °C)'
    choices: ['67.5 g', '80 g', '54 g', '6.4 g']
    ans: 1
    why: 'Steam gives 10 × 540 + 10 × 1 × 100 = 6400 cal on condensing and cooling to 0 °C. Ice melted = 6400/80 = 80 g.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Thermal properties of matter; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 28 minutes.** Read the lesson [Heat, expansion, calorimetry and heat transfer](/learn/courses/engineering-entrance/thermal-properties/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Thermal questions are energy bookkeeping (calorimetry), fractional changes (expansion) or flow through resistances (conduction). Radiation adds the T⁴ law, and cooling adds the rule that hotter things cool faster.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Temperature scales.</b> (X − lower)/(upper − lower) is the same on every scale. <i>Trap:</i> converting a temperature change with the +32 offset.</div>
<div class="step"><b>2. Linear, area and volume expansion.</b> β = 2α, γ = 3α; holes and cavities grow. <i>Trap:</i> using α for a volume change.</div>
<div class="step"><b>3. Expansion effects.</b> Pendulum clocks, measuring tapes reading short, bimetallic strips, thermal stress, liquids overflowing (apparent expansion).</div>
<div class="step"><b>4. Density and floating with temperature.</b> ρ' = ρ/(1 + γΔT); a floating body sinks deeper in a warmer liquid.</div>
<div class="step"><b>5. Calorimetry with mixing.</b> Heat lost = heat gained. <i>Trap:</i> not checking whether all the ice melts; then the answer is 0 °C with ice left.</div>
<div class="step"><b>6. Heating curves.</b> Slope ∝ 1/(mc); flat lengths ∝ mL. Ratios of specific or latent heats from a graph.</div>
<div class="step"><b>7. Conduction in series and parallel.</b> R = L/kA; junction temperatures. <i>Trap:</i> adding conductivities for slabs in series.</div>
<div class="step"><b>8. Special shapes and ice on ponds.</b> Spherical and cylindrical shells use logarithms or 1/r₁ − 1/r₂; ice time ∝ x₂² − x₁².</div>
<div class="step"><b>9. Radiation.</b> P = eσAT⁴, net loss σA(T⁴ − T₀⁴), Wien. <i>Trap:</i> using °C in T⁴.</div>
<div class="step"><b>10. Newton's law of cooling.</b> Average form for two intervals; exponential form for exact values. <i>Trap:</i> assuming equal drops take equal times.</div>
</div>

## Worked examples

**Example 1 (level 3, not all ice melts).** 100 g of ice at 0 °C is put into 200 g of water at 30 °C. Find the final state. (c = 4.2 J/g °C, L_f = 336 J/g)

*Solution.* Water cooling to 0 °C gives 200 × 4.2 × 30 = 25 200 J. Melting all the ice needs 100 × 336 = 33 600 J, which is more. So the final temperature is **0 °C**, and the ice melted is 25 200/336 = 75 g, leaving **25 g of ice**.

**Example 2 (level 4, three slabs).** A wall has three layers of equal area: 2 cm of brick (k = 0.6), 1 cm of foam (k = 0.03) and 2 cm of brick. Inside is 25 °C, outside 5 °C. What fraction of the temperature drop is across the foam?

*Solution.* Per unit area, R = L/k: brick 0.0333 each, foam 0.333. Total 0.4. Foam share = 0.333/0.4 = **83%**, a drop of about 16.7 °C. The thin foam does most of the insulating.

**Example 3 (level 4, radiation of two spheres).** Two black spheres of radii 1 cm and 2 cm are at 2000 K and 1000 K. Compare the power they radiate.

*Solution.* P ∝ r²T⁴: `$\dfrac{1 \times 2000^4}{4 \times 1000^4} = \dfrac{16}{4}$` = **4 : 1**. The small hot sphere radiates four times as much.

**Example 4 (level 5, ice on a pond).** Air above a pond is at −10 °C. Ice is 5 cm thick. How long until it is 10 cm thick? (k = 2.2 W/m K, ρ = 917 kg/m³, L = 3.34 × 10⁵ J/kg)

*Solution.* `$t = \dfrac{\rho L}{2k\theta}(x_2^2 - x_1^2) = \dfrac{917 \times 3.34\times10^5}{2 \times 2.2 \times 10}(0.01 - 0.0025)$` ≈ 5.2 × 10⁴ s ≈ **14.5 h**.

<div class="myth">

**"A thermos keeps tea hot by blocking radiation only."** It fights all three: the vacuum stops conduction and convection, and the silvered walls (low emissivity) cut radiation. A stopper stops convection out of the top.

</div>

<div class="meaning">
<dl>
<dt>Thermal resistance</dt><dd>R = L/(kA); temperature drops share out in proportion to R, like voltages in series resistors</dd>
<dt>Mixture check</dt><dd>compare "heat available down to 0 °C" with "heat needed to melt all the ice" before writing the equation</dd>
<dt>Physical meaning</dt><dd>Radiation grows as T⁴, so it dominates at high temperatures, while conduction and convection dominate near room temperature.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="thermal-properties" data-mode="practice"></div>

<div class="keypoints">

- Ten types: scales, expansion, expansion effects, density, calorimetry, heating curves, conduction, special shapes, radiation, cooling.
- In ice problems, check whether all the ice melts before solving for T.
- Slabs in series: the layer with the largest L/k takes most of the temperature drop.
- P ∝ r²T⁴ with T in kelvin.
- Newton's law: use (T₁ − T₂)/t = k(average − T₀).

</div>
