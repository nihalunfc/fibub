---
title: 'Rotational motion: question types and traps'
seoTitle: 'Rotational motion questions for JEE and NEET'
summary: 'Every way entrance exams ask about rotation: torque and equilibrium, ladders, moments of inertia and the axis theorems, pulleys with mass, angular momentum conservation, rolling races and friction, sliding balls that start to roll, falling rods and toppling, each with a method and its trap.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'The moment of inertia of a thin uniform rod of mass M and length L about an axis through one end, perpendicular to the rod, is:'
    choices: ['ML²/12', 'ML²/3', 'ML²/2', 'ML²']
    ans: 1
    why: 'Parallel axis: ML²/12 + M(L/2)² = ML²/12 + ML²/4 = ML²/3.'
  - q: 'A disc spinning at ω is gently placed on an identical disc at rest on the same axis. They end up spinning together at:'
    choices: ['ω', 'ω/2', 'ω/4', '2ω']
    ans: 1
    why: 'Angular momentum is kept: Iω = 2Iω''. So ω'' = ω/2, and half the kinetic energy becomes heat.'
  - q: 'For a solid cylinder rolling without slipping, the fraction of its kinetic energy that is rotational is:'
    choices: ['1/2', '1/3', '2/3', '1/4']
    ans: 1
    why: 'Rotational ½Iω² = ¼mv², translational ½mv². Rotational share = (1/4)/(3/4) = 1/3.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Rotational motion; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 30 minutes.** Read the lesson [Rotational motion](/learn/courses/engineering-entrance/rotational-motion/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Pick the right point to take torques about, and the right quantity to conserve. Hinges, contact points and centres of mass are the usual choices; angular momentum is the quantity whenever friction or a collision acts through that point.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Torque and couples.</b> τ = r × F, or force × moment arm. <i>Trap:</i> using the distance to the point of application instead of the perpendicular distance to the line of the force.</div>
<div class="step"><b>2. Equilibrium and ladders.</b> Net force zero in two directions, torques about the foot or top. <i>Trap:</i> a smooth wall gives only a horizontal push.</div>
<div class="step"><b>3. Moment of inertia and theorems.</b> Table values, parallel and perpendicular axes. <i>Trap:</i> the perpendicular axis theorem works only for flat bodies.</div>
<div class="step"><b>4. τ = Iα with pulleys.</b> Block plus massive pulley: a = mg/(m + I/R²). <i>Trap:</i> tension is different on the two sides of a pulley with mass.</div>
<div class="step"><b>5. Angular momentum conservation.</b> Skaters, turntables, people walking on platforms, discs joining. <i>Trap:</i> assuming kinetic energy is kept too.</div>
<div class="step"><b>6. Rolling energy and races.</b> K = ½mv²(1 + k²/R²); order sphere, disc, hollow sphere, ring. <i>Trap:</i> thinking the heavier body wins.</div>
<div class="step"><b>7. Friction in rolling.</b> Static, up the slope, f = mg sin θ/(1 + R²/k²); least μ for pure rolling. <i>Trap:</i> writing f = μN when it rolls without slipping.</div>
<div class="step"><b>8. Rolling with slipping.</b> Angular momentum about the contact point is conserved; final v = v₀/(1 + k²/R²). Time to start rolling from kinetic friction.</div>
<div class="step"><b>9. Rods: falling, hinged, collisions.</b> Energy for ω, τ = Iα for α, angular momentum about the hinge for a bullet hitting a rod.</div>
<div class="step"><b>10. Toppling vs sliding.</b> A block pushed at height h topples if the torque about the front edge beats mg × half-width before friction gives way.</div>
</div>

## Worked examples

**Example 1 (level 3, ladder).** A uniform 5 m ladder of weight 200 N leans against a smooth wall with its foot 3 m from the wall. Find the friction at the foot.

*Solution.* Height of the top = 4 m. Torques about the foot: wall push N_w × 4 = 200 × 1.5, so N_w = 75 N. Horizontal balance: **friction = 75 N** (towards the wall). The floor push is 200 N, so the ladder needs μ ≥ 0.375.

**Example 2 (level 4, pulley with mass).** A 2 kg block hangs from a string wound on a 4 kg disc pulley of radius 0.1 m. Find the block's acceleration and the tension. (g = 10 m/s²)

*Solution.* `$a = \dfrac{mg}{m + M/2} = \dfrac{20}{2 + 2}$` = **5 m/s²**. Tension `$T = m(g - a)$` = **10 N**. *Check:* `$TR = I\alpha = \tfrac12(4)(0.01)(a/0.1)$` gives T = 2a = 10 N. ✓

**Example 3 (level 4, sliding ball).** A solid sphere is thrown along a floor with speed 7 m/s and no spin. μ = 0.2. When does it start rolling, and at what speed? (g = 10 m/s²)

*Solution.* Final speed = 7/(1 + 2/5) = **5 m/s**. Friction slows the centre at μg = 2 m/s², so the time is (7 − 5)/2 = **1 s**.

**Example 4 (level 5, bullet into a rod).** A rod of mass M and length L hangs from a hinge at its top. A bullet of mass m (much less than M) moving horizontally at u hits and sticks at the bottom end. Find the rod's angular speed just after.

*Solution.* The hinge pushes during the impact, so linear momentum is not kept. Its torque about the hinge is zero, so take angular momentum about the hinge: `$muL = \left(\tfrac{ML^2}{3} + mL^2\right)\omega$`, so `$\omega = \dfrac{3mu}{(M + 3m)L} \approx \dfrac{3mu}{ML}$`.

<div class="myth">

**"Momentum is conserved when a bullet hits a hinged rod."** The hinge exerts a big force during the impact, so linear momentum changes. Angular momentum about the hinge is the conserved quantity.

</div>

<div class="meaning">
<dl>
<dt>Best torque point</dt><dd>the point through which the most unknown forces act (hinge, foot of a ladder, contact point)</dd>
<dt>Effective mass</dt><dd>a pulley or rolling wheel behaves like extra mass I/R² that must also be speeded up</dd>
<dt>Physical meaning</dt><dd>Angular momentum about a point is kept whenever every unknown force passes through that point, even if those forces are huge.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="rotational-motion" data-mode="practice"></div>

<div class="keypoints">

- Ten types: torque, ladders, moment of inertia, pulleys, L conservation, rolling races, friction in rolling, rolling with slipping, rods, toppling.
- Take torques about the point that removes the most unknowns.
- Massive pulley: a = mg/(m + I/R²); tensions differ on its two sides.
- Sliding sphere: final speed 5v₀/7, from angular momentum about the contact point.
- Bullet into a hinged rod: angular momentum about the hinge, not linear momentum.

</div>
