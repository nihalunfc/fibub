---
title: 'Centre of mass, momentum and collisions: question types and traps'
seoTitle: 'Centre of mass and collision questions: JEE, NEET'
summary: 'Every way entrance exams ask about systems of particles: centre of mass of shapes and cut-outs, the man on a boat, explosions, impulse, rockets and belts, elastic and inelastic collisions, restitution and bouncing balls, the ballistic pendulum and two-dimensional collisions, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'A 60 kg man walks 4 m along a 140 kg boat floating at rest on still water. How far does the boat move?'
    choices: ['4 m', '1.2 m', '1.71 m', '0.6 m']
    ans: 1
    why: 'The centre of mass stays put: boat moves mL/(m + M) = 60 × 4/200 = 1.2 m backwards.'
  - q: 'A bomb at rest explodes into pieces of 1 kg and 3 kg. The ratio of their kinetic energies (1 kg : 3 kg) is:'
    choices: ['1 : 3', '3 : 1', '1 : 9', '9 : 1']
    ans: 1
    why: 'Equal momenta, K = p²/2m, so K is inversely proportional to mass: 3 : 1.'
  - q: 'A ball dropped from 10 m rises to 6.4 m after one bounce. The coefficient of restitution is:'
    choices: ['0.64', '0.8', '0.4', '0.36']
    ans: 1
    why: 'Height goes as e²: e² = 6.4/10 = 0.64, so e = 0.8.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: System of particles and collisions; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 28 minutes.** Read the lesson [Centre of mass, momentum and collisions](/learn/courses/engineering-entrance/centre-of-mass-collisions/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Two laws do almost all the work: momentum is conserved when there is no outside impulse, and the centre of mass moves only under outside forces. Energy is kept only in elastic collisions, so check before you use it.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Centre of mass of particles and shapes.</b> Weighted average; standard results for arcs, discs, hemispheres and cones. <i>Trap:</i> 2R/π is for a semicircular wire, 4R/3π for a semicircular plate.</div>
<div class="step"><b>2. Cut-outs.</b> Subtract the removed piece as negative mass, using areas or volumes. <i>Trap:</i> forgetting to subtract the hole's mass from the total in the denominator.</div>
<div class="step"><b>3. Centre of mass stays put.</b> Man on a boat, frog on a plank, sliding block on a free wedge. <i>Trap:</i> giving the man's distance relative to the boat as relative to the ground.</div>
<div class="step"><b>4. Explosions and recoil.</b> Total momentum before = after; centre of mass keeps its path. <i>Trap:</i> for a shell splitting at the top, one piece falling straight down means the other lands farther away, not at the same spot.</div>
<div class="step"><b>5. Impulse.</b> Area under F-t; rebound doubles the change; average force = Δp/Δt.</div>
<div class="step"><b>6. Variable mass.</b> Thrust u dm/dt; rocket equation; belts and chains falling on a scale. <i>Trap:</i> a falling chain on a scale shows three times the weight of the part already on it.</div>
<div class="step"><b>7. One-dimensional collisions.</b> Momentum plus e. <i>Trap:</i> signs of velocities; write a direction first.</div>
<div class="step"><b>8. Bouncing and restitution.</b> Heights go as e², times as e. Total distance h(1 + e²)/(1 − e²).</div>
<div class="step"><b>9. Ballistic pendulum and block-spring hits.</b> Momentum across the hit, energy after it. <i>Trap:</i> using energy across a sticking collision.</div>
<div class="step"><b>10. Two-dimensional collisions.</b> Momentum in x and y separately; e along the line of centres only. Equal masses elastic glancing: 90°.</div>
</div>

## Worked examples

**Example 1 (level 3, explosion at the top).** A shell fired with range 120 m explodes at the top into two equal pieces. One falls straight down. Where does the other land?

*Solution.* The centre of mass lands at 120 m. One piece lands at 60 m (below the top). So `$\dfrac{60 + x}{2} = 120$` and **x = 180 m** from the gun. *Check by momentum:* the moving piece doubles its horizontal speed, so it covers twice the remaining 60 m.

**Example 2 (level 4, falling chain).** A uniform chain of mass M and length L is held vertically just above a scale and released. What does the scale read when a length x has landed?

*Solution.* Weight of the landed part = Mgx/L. The falling part hits at speed `$v = \sqrt{2gx}$`, bringing momentum at the rate `$\dfrac{M}{L}v^2 = \dfrac{M}{L}\,2gx$`. Total reading = **3Mgx/L**: three times the weight of what has landed.

**Example 3 (level 4, block and spring).** A 1 kg block moving at 6 m/s hits and sticks to a 2 kg block that is attached to a wall by a spring of k = 300 N/m. Find the greatest compression.

*Solution.* Sticking: V = 6/3 = 2 m/s. After that, energy is kept: `$\tfrac12(3)(4) = \tfrac12(300)x^2$`, so **x = 0.2 m**. *Trap:* using the 1 kg block's 18 J directly gives 0.35 m; but 12 J of it is lost in the sticking.

**Example 4 (level 5, oblique collision).** A smooth ball moving at 10 m/s hits an identical ball at rest so that the line of centres makes 30° with its velocity. e = 1/2. Find both velocities after.

*Solution.* Along the line of centres: approach part 10 cos 30° = 8.66 m/s. Equal masses: `$v_{1n} = \dfrac{1 - e}{2}(8.66) = 2.17$` and `$v_{2n} = \dfrac{1 + e}{2}(8.66) = 6.50$` m/s. Perpendicular: ball 1 keeps 10 sin 30° = 5 m/s, ball 2 gets none. **Ball 2: 6.50 m/s along the line of centres. Ball 1: √(2.17² + 5²) ≈ 5.45 m/s.**

<div class="myth">

**"Kinetic energy is kept whenever momentum is."** Momentum is kept in all collisions with no outside impulse; kinetic energy only in elastic ones. If a question says "stick", "lodge" or "coalesce", energy is lost.

</div>

<div class="meaning">
<dl>
<dt>Centre-of-mass frame</dt><dd>sit on the centre of mass: total momentum is zero, and in an elastic collision each body just reverses its velocity</dd>
<dt>Energy lost in a sticking hit</dt><dd>½ μ (u₁ − u₂)², where μ = m₁m₂/(m₁ + m₂)</dd>
<dt>Physical meaning</dt><dd>Only the relative motion can be turned into heat; the motion of the centre of mass has to carry on.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="centre-of-mass-collisions" data-mode="practice"></div>

<div class="keypoints">

- Ten types: centre of mass of shapes, cut-outs, centre of mass at rest, explosions, impulse, variable mass, 1D collisions, bouncing, ballistic pendulum, 2D collisions.
- Explosion in flight: the centre of mass lands where the shell would have.
- Chain falling on a scale: reading 3 × weight landed.
- Momentum across a hit, energy only after it.
- Energy lost when bodies stick = ½ μ (relative speed)².

</div>
