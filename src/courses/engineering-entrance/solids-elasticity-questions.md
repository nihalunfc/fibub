---
title: 'Elasticity of solids: question types and traps'
seoTitle: 'Elasticity questions for JEE and NEET physics'
summary: 'Every way entrance exams ask about elasticity: stress, strain and Young''s modulus, ratio questions, bulk and shear moduli, Poisson''s ratio, stress-strain graphs, elastic energy, wires in series and parallel, own weight, thermal stress, rotating rods and sudden loads, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'A wire stretches 1 mm under a load. The same load on a wire of the same material, twice as long and twice the diameter, stretches it by:'
    choices: ['0.5 mm', '1 mm', '2 mm', '4 mm']
    ans: 0
    why: 'ΔL ∝ L/d². Twice L and twice d: 2/4 = 1/2, so 0.5 mm.'
  - q: 'The energy stored per unit volume in a stretched wire is:'
    choices: ['stress × strain', '½ stress × strain', 'stress/strain', '½ Y × stress']
    ans: 1
    why: 'Energy density = ½ stress × strain = stress²/2Y = ½ Y strain².'
  - q: 'The bulk modulus of an ideal gas compressed slowly at constant temperature equals:'
    choices: ['its pressure P', 'γP', 'zero', 'RT']
    ans: 0
    why: 'PV = constant gives dP/dV = −P/V, so B = −V dP/dV = P. Quick (adiabatic) compression gives γP.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Properties of solids; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 26 minutes.** Read the lesson [Elasticity of solids](/learn/courses/engineering-entrance/solids-elasticity/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Elasticity questions reward one habit: write ΔL = FL/(AY) (or its cousins for B and η) and read off what changes. Then treat every wire as a spring of k = YA/L, and the harder problems become spring problems.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Direct Y = FL/(AΔL).</b> <i>Trap:</i> diameter instead of radius in A, or mm not converted to m.</div>
<div class="step"><b>2. Ratio questions.</b> ΔL ∝ FL/(d²Y). Same volume, twice the length: area halves, so ΔL becomes 4 times. <i>Trap:</i> missing the area change when the volume is fixed.</div>
<div class="step"><b>3. Bulk and shear.</b> ΔV/V = ΔP/B; shear angle = (F/A)/η. Compression at depth uses ΔP = ρgh.</div>
<div class="step"><b>4. Poisson's ratio.</b> Change in diameter or volume of a stretched wire; limits −1 to 0.5. <i>Trap:</i> sign of the sideways strain.</div>
<div class="step"><b>5. Stress-strain graphs.</b> Steeper line = larger Y; longer plastic region = more ductile; loop area = heat lost.</div>
<div class="step"><b>6. Elastic energy.</b> ½FΔL, ½ stress × strain × volume. <i>Trap:</i> using FΔL (that is the work by a constant load, twice the stored energy).</div>
<div class="step"><b>7. Wires in series and parallel.</b> k = YA/L. Two wires holding a rod level: equal extension means equal FL/(AY).</div>
<div class="step"><b>8. Own weight and accelerating wires.</b> Own weight: ρgL²/2Y. In a lift accelerating up at a: tension m(g + a). <i>Trap:</i> forgetting the wire's own weight adds half to the extension, not all.</div>
<div class="step"><b>9. Thermal stress.</b> YαΔT, force YAαΔT; with a small gap, only the part beyond the gap is squeezed.</div>
<div class="step"><b>10. Rotating bodies and composites.</b> Tension in a spinning rod or ring; composite rods share force in series or extension in parallel.</div>
</div>

## Worked examples

**Example 1 (level 3, same volume).** A wire is drawn out to twice its length, keeping its volume fixed. By what factor does its extension under the same load change?

*Solution.* Volume fixed: L doubles, so A halves. ΔL ∝ L/A, so ΔL becomes 2/(1/2) = **4 times**. *Trap:* answering 2.

**Example 2 (level 4, rod on two wires).** A light rod 1 m long hangs level from two wires at its ends: steel (Y = 2 × 10¹¹ Pa) and brass (Y = 1 × 10¹¹ Pa), same length and same area. Where on the rod should a load hang so that it stays level?

*Solution.* Equal extensions need `$F_s/Y_s = F_b/Y_b$`, so `$F_s = 2F_b$`. Torques about the load point: `$F_s x = F_b(1 - x)$`, so 2x = 1 − x and **x = 1/3 m from the steel wire**.

**Example 3 (level 4, thermal stress with a gap).** A 2 m steel rod (α = 1.2 × 10⁻⁵ /°C, Y = 2 × 10¹¹ Pa) is fixed at one end with a 0.6 mm gap before a rigid wall at the other. It is heated by 50 °C. Find the stress in it.

*Solution.* Free expansion = 2 × 1.2 × 10⁻⁵ × 50 = 1.2 mm. The gap takes 0.6 mm; the wall stops the other 0.6 mm. Strain = 0.6 mm/2 m = 3 × 10⁻⁴. **Stress = 6 × 10⁷ Pa.**

**Example 4 (level 5, rotating rod).** A uniform rod of length L, density ρ and Young's modulus Y spins about one end at ω in a horizontal plane. Find its total extension.

*Solution.* Tension at distance x from the axis: `$T(x) = \tfrac12\rho A\omega^2(L^2 - x^2)$`. Each piece dx stretches `$T\,dx/(AY)$`. Total: `$\Delta L = \dfrac{\rho\omega^2}{2Y}\int_0^L(L^2 - x^2)\,dx = \dfrac{\rho\omega^2 L^3}{3Y}$`.

<div class="myth">

**"Young's modulus of a wire changes if you change its length or thickness."** Y belongs to the material. Change the size and the extension changes, but Y stays the same. Only temperature (Y falls slightly as metals warm) and impurities change it.

</div>

<div class="meaning">
<dl>
<dt>Spring view</dt><dd>k = YA/L for stretching; series wires add 1/k, parallel wires add k</dd>
<dt>Varying tension</dt><dd>when tension changes along a wire, add up T dx/(AY)</dd>
<dt>Physical meaning</dt><dd>Stored energy is half of load × extension because the load grows from zero while the wire stretches.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="solids-elasticity" data-mode="practice"></div>

<div class="keypoints">

- Ten types: direct Y, ratios, bulk and shear, Poisson, graphs, energy, series and parallel, own weight, thermal stress, rotating and composite.
- Same volume and twice the length: four times the extension.
- Level rod on two wires: equal F/(Y A/L), then torques.
- Thermal stress with a gap: only the expansion beyond the gap is strain.
- Spinning rod: ΔL = ρω²L³/3Y.

</div>
