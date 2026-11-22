---
title: 'Fluids: question types and traps'
seoTitle: 'Fluids and surface tension questions: JEE, NEET'
summary: 'Every way entrance exams ask about fluids: pressure and U-tubes, hydraulic machines, buoyancy and floating, accelerating and rotating containers, continuity and Bernoulli, efflux and range, viscosity and terminal speed, Poiseuille, bubbles and drops, and capillary rise, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'An ice cube floats in a glass of water. When it melts, the water level:'
    choices: ['rises', 'falls', 'stays the same', 'first rises then falls']
    ans: 2
    why: 'The floating ice pushes aside exactly its own weight of water. When it melts it becomes that same weight of water, which fills the space it displaced.'
  - q: 'The terminal speed of a small ball in oil is 2 cm/s. A ball of the same material with twice the radius has terminal speed:'
    choices: ['2 cm/s', '4 cm/s', '8 cm/s', '1 cm/s']
    ans: 2
    why: 'v_t ∝ r². Twice the radius gives four times the speed: 8 cm/s.'
  - q: 'Water rises 6 cm in a capillary tube. In a tube of half the radius it would rise:'
    choices: ['3 cm', '6 cm', '12 cm', '24 cm']
    ans: 2
    why: 'h ∝ 1/r, so halving r doubles h: 12 cm.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Mechanical properties of fluids; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 28 minutes.** Read the lesson [Fluids](/learn/courses/engineering-entrance/fluids/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Fluid statics is one rule (pressure grows by ρgh going down, and is equal at equal levels in one connected liquid). Fluid flow is two rules (continuity and Bernoulli). Surface tension adds one more (excess pressure 2T/r per surface). Name the rule, and the question is half done.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Pressure and U-tubes.</b> Equate pressures at the same level in the same liquid. <i>Trap:</i> equating across two different liquids at a level that is not the interface.</div>
<div class="step"><b>2. Hydraulic machines and barometers.</b> F₂/F₁ = A₂/A₁. <i>Trap:</i> using diameters directly instead of their squares.</div>
<div class="step"><b>3. Floating and apparent weight.</b> Fraction under = ρ_body/ρ_fluid; bodies in two liquid layers share the buoyancy. <i>Trap:</i> melting ice and changing levels.</div>
<div class="step"><b>4. Buoyancy with acceleration.</b> In a lift, floating depth does not change; a tied ball's string tension does.</div>
<div class="step"><b>5. Accelerating and rotating containers.</b> tan θ = a/g; paraboloid ω²r²/2g. <i>Trap:</i> spilling questions need the tilted surface to reach the rim.</div>
<div class="step"><b>6. Continuity and Bernoulli.</b> Pipes, Venturi meters, wings. <i>Trap:</i> forgetting the height term when the pipe is not level.</div>
<div class="step"><b>7. Efflux, range and emptying.</b> v = √(2gh); range 2√(h(H − h)); time to empty a tank ∝ √H. <i>Trap:</i> treating the outflow speed as constant while the level falls.</div>
<div class="step"><b>8. Viscosity and terminal speed.</b> v_t ∝ r²(ρ − σ)/η. A bubble rising in water has σ > ρ, so its terminal velocity points up.</div>
<div class="step"><b>9. Poiseuille and Reynolds.</b> Q ∝ Pr⁴/(ηL); pipes in series add resistance like resistors.</div>
<div class="step"><b>10. Surface tension, drops and capillaries.</b> Work = TΔA (double for films), excess pressure 2T/r or 4T/r, h = 2T cos θ/(ρgr). <i>Trap:</i> a soap film has two surfaces.</div>
</div>

## Worked examples

**Example 1 (level 3, two liquids).** A U-tube holds mercury (13.6 g/cm³). 13.6 cm of water is poured into one arm. How much higher does the water surface stand than the mercury surface in the other arm?

*Solution.* At the level of the water-mercury interface: `$1 \times 13.6 = 13.6 \times h$`, so the mercury in the other arm stands h = 1 cm above that interface. The water surface is 13.6 cm above it, so the difference is **12.6 cm**.

**Example 2 (level 4, emptying a tank).** A tank of area A has water to height H and a small hole of area a at the bottom. How long does it take to empty?

*Solution.* `$-A\,\dfrac{dh}{dt} = a\sqrt{2gh}$`. Separate and integrate from H to 0: `$t = \dfrac{A}{a}\sqrt{\dfrac{2H}{g}}$`. Half the time empties three-quarters of the tank, because the flow is fastest at the start.

**Example 3 (level 4, rotating liquid).** A cylinder of radius 10 cm holds water and spins about its axis at 10 rad/s. How much higher is the water at the rim than at the centre? (g = 10 m/s²)

*Solution.* `$\Delta y = \dfrac{\omega^2R^2}{2g} = \dfrac{100 \times 0.01}{20}$` = **5 cm**.

**Example 4 (level 5, merging drops).** 1000 tiny water drops, each of radius 0.01 mm, combine into one drop. Find the energy released. (T = 0.07 N/m)

*Solution.* R = 1000^(1/3) × 0.01 mm = 0.1 mm. Area change = `$4\pi(1000r^2 - R^2) = 4\pi(10^{-7} - 10^{-8}) = 4\pi \times 9\times10^{-8}$` m². Energy = T × ΔA ≈ **7.9 × 10⁻⁸ J**.

<div class="myth">

**"Bernoulli's equation works for any flow."** Only for steady, streamline flow of an incompressible, non-viscous fluid, along a streamline. Viscous flow in a long pipe loses pressure along the pipe even when it is level and its speed is constant.

</div>

<div class="meaning">
<dl>
<dt>Same-level rule</dt><dd>equal pressures only at equal levels in one connected, still body of the same liquid</dd>
<dt>Flow resistance</dt><dd>8ηL/(πr⁴): pipes in series add, in parallel combine like parallel resistors</dd>
<dt>Physical meaning</dt><dd>Surface tension always tries to shrink a surface; a curved surface can only stay curved if the pressure on its inner side is higher.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="fluids" data-mode="practice"></div>

<div class="keypoints">

- Ten types: U-tubes, hydraulics, floating, buoyancy with acceleration, tilted and spinning surfaces, Bernoulli, efflux, terminal speed, Poiseuille, surface tension.
- U-tube: equate pressures at the lower interface level.
- Tank empties in (A/a)√(2H/g); half the time empties three-quarters.
- Spinning liquid rises ω²R²/2g at the rim.
- Merging drops release T × (loss of area) as heat.

</div>
