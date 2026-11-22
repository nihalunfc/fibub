---
title: 'Oscillations and simple harmonic motion: question types and traps'
seoTitle: 'SHM and oscillations questions for JEE and NEET'
summary: 'Every way entrance exams ask about oscillations: is it SHM, equations and phase, time between positions, speed and energy, spring combinations and cutting, pendulums in lifts, cars and liquids, physical pendulums, floating bodies and tunnels, collisions during SHM, superposition and damping, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'x = 3 sin ωt + 4 cos ωt describes SHM with amplitude:'
    choices: ['7', '5', '1', '12']
    ans: 1
    why: 'Two SHMs of the same frequency 90° apart combine to amplitude √(3² + 4²) = 5.'
  - q: 'A pendulum clock is taken from the Earth to the Moon (g about one-sixth). Its period:'
    choices: ['stays the same', 'becomes √6 times longer', 'becomes 6 times longer', 'becomes shorter']
    ans: 1
    why: 'T ∝ 1/√g. One-sixth the g gives √6 ≈ 2.45 times the period, so the clock runs slow.'
  - q: 'The shortest time for a particle in SHM (period T) to go from the centre to half the amplitude is:'
    choices: ['T/4', 'T/8', 'T/12', 'T/6']
    ans: 2
    why: 'x = A sin ωt = A/2 gives ωt = π/6, which is one-twelfth of a full cycle (2π).'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Oscillations; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 28 minutes.** Read the lesson [Oscillations and simple harmonic motion](/learn/courses/engineering-entrance/oscillations/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Every SHM question reduces to two numbers: ω (from the restoring force per unit displacement per unit mass) and A (from the energy or the starting conditions). Find the effective k and the effective m, and the period is 2π√(m/k).</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Is it SHM?</b> Need a = −ω²x about some centre. <i>Trap:</i> sin² ωt is SHM (at 2ω); sin ωt + sin 2ωt is periodic but not SHM; e^(−ωt) is not periodic.</div>
<div class="step"><b>2. Equation and phase.</b> Read A, ω, φ; combine a sin + b cos into one sine; phase difference between two SHMs.</div>
<div class="step"><b>3. Time between positions.</b> Use the circle: centre to A/2 is T/12, A/2 to A is T/6, centre to A/√2 is T/8.</div>
<div class="step"><b>4. Speed, acceleration and energy.</b> v = ω√(A² − x²), K = U at A/√2. <i>Trap:</i> K and U oscillate at twice the frequency of x.</div>
<div class="step"><b>5. Springs.</b> Series, parallel, cutting, two-body (reduced mass), vertical springs. <i>Trap:</i> a block between two springs is parallel, not series.</div>
<div class="step"><b>6. Pendulums in frames.</b> g_eff = g − a (vector). Lift up: g + a; car: √(g² + a²); free fall: no oscillation.</div>
<div class="step"><b>7. Physical pendulums and rolling with springs.</b> T = 2π√(I/mgd). A rolling cylinder on a spring has effective mass (3/2)m.</div>
<div class="step"><b>8. Other systems.</b> Floating bodies, U-tubes, tunnels through planets, charged pendulums in fields.</div>
<div class="step"><b>9. Changes during motion.</b> Mass added or a collision mid-swing: momentum kept in the hit, then new ω and A. <i>Trap:</i> the centre of oscillation moves if the hanging mass changes on a vertical spring.</div>
<div class="step"><b>10. Damping, forcing, resonance.</b> A ∝ e^(−bt/2m), E ∝ e^(−bt/m); forced motion at the driver's frequency.</div>
</div>

## Worked examples

**Example 1 (level 3, pendulum in a car).** A 1 m pendulum hangs in a car accelerating at 7.5 m/s² on a level road. Find its period. (g = 10 m/s²)

*Solution.* `$g_{eff} = \sqrt{10^2 + 7.5^2} = 12.5$` m/s². `$T = 2\pi\sqrt{1/12.5}$` ≈ **1.78 s** (at rest it would be 1.99 s). It hangs tilted at tan θ = 0.75, about 37°.

**Example 2 (level 4, vertical spring, mass removed).** Two blocks of 1 kg each hang at rest from a spring of k = 100 N/m. The lower block is cut free. Find the amplitude of the upper block's motion. (g = 10 m/s²)

*Solution.* Before: stretch = 2 × 10/100 = 0.2 m. New centre (1 kg): 0.1 m. The block starts at rest 0.1 m below its new centre, so **A = 0.1 m = 10 cm**, with ω = 10 rad/s.

**Example 3 (level 4, physical pendulum).** A uniform disc of radius R swings about a horizontal axis through a point on its rim, perpendicular to its face. Find the period.

*Solution.* I about the rim = ½mR² + mR² = (3/2)mR², d = R. `$T = 2\pi\sqrt{\dfrac{3R}{2g}}$`, the same as a simple pendulum of length 1.5R.

**Example 4 (level 5, rolling with a spring).** A solid cylinder of mass m rolls without slipping on a floor, with its axle tied to a wall by a spring of constant k. Find ω for small oscillations.

*Solution.* Energy: `$\tfrac12mv^2 + \tfrac12\cdot\tfrac12mR^2\cdot\dfrac{v^2}{R^2} + \tfrac12kx^2 = \tfrac12\cdot\tfrac32m\,v^2 + \tfrac12kx^2$`. Effective mass (3/2)m, so **ω = √(2k/3m)**.

<div class="myth">

**"A heavier bob makes a pendulum swing slower."** The bob's mass cancels in T = 2π√(L/g). Only for a physical pendulum, where the mass distribution changes I and d, does the shape matter.

</div>

<div class="meaning">
<dl>
<dt>Effective k</dt><dd>restoring force per metre of displacement, from F = −k_eff x</dd>
<dt>Effective m</dt><dd>from the kinetic energy written as ½m_eff v²: adds I/R² for rolling, m_s/3 for a spring's own mass</dd>
<dt>Physical meaning</dt><dd>ω² = k_eff/m_eff for any SHM: the energy method finds both without drawing forces.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="oscillations" data-mode="practice"></div>

<div class="keypoints">

- Ten types: is it SHM, phase, time between positions, speed and energy, springs, frames, physical pendulums, other systems, changes mid-motion, damping and resonance.
- Use the reference circle for times: T/12, T/8, T/6.
- g_eff = g − a as vectors for pendulums in moving frames.
- Mass removed from a vertical spring: amplitude = shift of the centre.
- ω² = k_eff/m_eff; rolling cylinder on a spring: ω = √(2k/3m).

</div>
