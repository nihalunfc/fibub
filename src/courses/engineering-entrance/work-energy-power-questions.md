---
title: 'Work, energy and power: question types and traps'
seoTitle: 'Work, energy and power questions: JEE and NEET'
summary: 'Every way entrance exams ask about work and energy: sign of work, area under F-x, the work-energy theorem with friction, springs, conservative forces, potential energy curves, power at constant speed and constant power, and the vertical circle, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'A force F = 3x² N acts on a body along x. The work done from x = 0 to x = 2 m is:'
    choices: ['12 J', '8 J', '6 J', '24 J']
    ans: 1
    why: 'W = ∫3x² dx from 0 to 2 = x³ from 0 to 2 = 8 J. Using F × distance with F at the end gives 24 J, which is wrong because F changes.'
  - q: 'A spring is stretched 2 cm, which needs 4 J. Stretching it a further 2 cm needs:'
    choices: ['4 J', '8 J', '12 J', '16 J']
    ans: 2
    why: 'Energy grows as x². At 4 cm it stores 4 × 4 = 16 J, so the extra 2 cm needs 16 − 4 = 12 J.'
  - q: 'A car''s engine gives constant power. As it speeds up on a level road, its acceleration:'
    choices: ['stays the same', 'increases', 'decreases', 'is zero']
    ans: 2
    why: 'F = P/v, so the driving force falls as v rises, and so does the acceleration.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Work, energy and power; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 28 minutes.** Read the lesson [Work, energy and power](/learn/courses/engineering-entrance/work-energy-power/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Energy methods skip the middle of a motion. Fix two moments, list every energy at each, account for the work of friction and of any outside force, and the speed or distance falls out in one line.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Sign and size of work.</b> W = Fs cos θ. <i>Trap:</i> the normal force and a string in uniform circular motion do zero work; friction on a block placed on a moving belt does positive work on the block.</div>
<div class="step"><b>2. Variable force.</b> Integrate F dx or find the area under F-x. <i>Trap:</i> multiplying the final force by the distance.</div>
<div class="step"><b>3. Work-energy theorem.</b> Sum of all work = ΔK. Good when friction acts over a known distance.</div>
<div class="step"><b>4. K and p.</b> K = p²/2m. "p up by 10%": K up by 21%. "K up by 300%": p doubles. <i>Trap:</i> treating percentages as linear.</div>
<div class="step"><b>5. Springs.</b> ½kx²; cut a spring in half and k doubles; series and parallel springs. <i>Trap:</i> energy from x₁ to x₂ is ½k(x₂² − x₁²), not ½k(x₂ − x₁)².</div>
<div class="step"><b>6. Conservative forces.</b> Path independence, F = −dU/dx, work round a loop. <i>Trap:</i> gravity's work depends only on the change in height, not on the path.</div>
<div class="step"><b>7. Potential energy curves.</b> Equilibrium where dU/dx = 0; stable where d²U/dx² > 0; turning points where E = U.</div>
<div class="step"><b>8. Power.</b> P = Fv; steady speed means driving force = resistance; pumps and lifts with efficiency. <i>Trap:</i> forgetting the kinetic energy given to the water.</div>
<div class="step"><b>9. Vertical circle and hemisphere.</b> Energy for speed, F = mv²/r for tension or normal force; leaving the surface means N = 0.</div>
<div class="step"><b>10. Chains and ropes.</b> Lifting a hanging chain: use the rise of its centre of mass. <i>Trap:</i> a hanging part of length L/n rises only L/(2n) on average.</div>
</div>

## Worked examples

**Example 1 (level 3, chain).** A uniform chain of mass 2 kg and length 1.2 m lies on a smooth table with one-third of it hanging over the edge. How much work pulls it all back on the table? (g = 10 m/s²)

*Solution.* The hanging part has mass 2/3 kg and its centre is 0.2 m below the edge. Work = mgh = (2/3) × 10 × 0.2 = **1.33 J**. *Trap:* using the whole mass or the full 0.4 m.

**Example 2 (level 4, spring and friction).** A 1 kg block moving at 4 m/s on a floor with μ = 0.2 hits a spring of k = 100 N/m. Find the greatest compression. (g = 10 m/s²)

*Solution.* Energy: `$\tfrac12(1)(16) = \tfrac12(100)x^2 + 0.2 \times 10 \times x$`, so `$50x^2 + 2x - 8 = 0$`. `$x = \dfrac{-2 + \sqrt{4 + 1600}}{100}$` = **0.38 m**. Without friction it would be 0.4 m.

**Example 3 (level 4, potential energy curve).** A particle has `$U(x) = x^3 - 6x^2 + 9x$` (joules, metres). Find the points of equilibrium and their type.

*Solution.* `$dU/dx = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)$`, zero at x = 1 and x = 3. `$d^2U/dx^2 = 6x - 12$`: at x = 1 it is −6 (a hill, **unstable**), at x = 3 it is +6 (a valley, **stable**).

**Example 4 (level 5, constant power).** A car of mass m starts from rest with constant power P. Find its speed after time t and the distance in that time, ignoring resistance.

*Solution.* All the work goes into kinetic energy: `$Pt = \tfrac12 mv^2$`, so `$v = \sqrt{2Pt/m}$`, which grows as √t. Then `$x = \int v\,dt = \tfrac23\sqrt{2P/m}\,t^{3/2}$`. So distance grows as t^(3/2): doubling the time gives 2.83 times the distance.

<div class="myth">

**"The work done by friction is always negative."** Friction from a moving belt or a truck floor does positive work on a box it carries forward. Only the total work of a friction pair between two sliding surfaces is always negative (it makes heat).

</div>

<div class="meaning">
<dl>
<dt>Two-moment method</dt><dd>K₁ + U₁ + work of outside forces = K₂ + U₂ + heat from friction</dd>
<dt>Percent changes</dt><dd>K ∝ p²: a small change of x% in p changes K by about 2x%</dd>
<dt>Physical meaning</dt><dd>Energy bookkeeping avoids forces that do no work (normal forces, strings in circles), which is why it is often shorter than F = ma.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="work-energy-power" data-mode="practice"></div>

<div class="keypoints">

- Ten types: sign of work, variable force, work-energy theorem, K and p, springs, conservative forces, U curves, power, vertical circle, chains.
- Area under F-x for a varying force; ½k(x₂² − x₁²) for springs.
- Friction heat = μN × distance slid; it enters the energy equation as a loss.
- U curve: dU/dx = 0 for equilibrium; the sign of d²U/dx² tells stable or unstable.
- Constant power from rest: v ∝ √t, x ∝ t^(3/2).

</div>
