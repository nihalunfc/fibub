---
title: 'Laws of motion and friction: question types and traps'
seoTitle: 'Newton''s laws and friction questions: JEE, NEET'
summary: 'Every way entrance exams ask about forces: free-body diagrams, pulleys and constraints, lifts, pseudo forces, static and kinetic friction, blocks on blocks, impulse and recoil, banked roads, conical pendulums and the vertical circle, each with a method and its trap.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'A 2 kg block on a table (μs = 0.5) is pushed sideways with 6 N. The friction on it is: (g = 10 m/s²)'
    choices: ['10 N', '6 N', '5 N', '4 N']
    ans: 1
    why: 'The most static friction can give is 0.5 × 20 = 10 N. Only 6 N is needed to stop it moving, so friction is 6 N.'
  - q: 'A ball of 0.2 kg hits a wall at 10 m/s and rebounds at 10 m/s. The impulse on it has size:'
    choices: ['0', '2 N s', '4 N s', '1 N s']
    ans: 2
    why: 'Momentum changes from +2 to −2 kg m/s: a change of 4 N s. Forgetting the reversal gives zero.'
  - q: 'A bob hangs from the roof of a car accelerating at g/√3. The string makes an angle with the vertical of:'
    choices: ['30°', '45°', '60°', '0°']
    ans: 0
    why: 'tan θ = a/g = 1/√3, so θ = 30°.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Laws of motion; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 30 minutes.** Read the lesson [Laws of motion and friction](/learn/courses/engineering-entrance/laws-of-motion/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Each force question is solved in three moves: choose the body (or system), draw only the real forces on it, and write F = ma along well-chosen axes. Friction questions add one check first: does it slip or not?</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Newton's laws and inertial frames.</b> Statement and assertion questions. <i>Trap:</i> thinking action-reaction pairs cancel, or that a moving body needs a force to keep moving.</div>
<div class="step"><b>2. Impulse and momentum.</b> Impulse = area under F-t = change in momentum (with direction). <i>Trap:</i> a rebound doubles the change.</div>
<div class="step"><b>3. Recoil and momentum conservation.</b> Total momentum before = after. <i>Trap:</i> the bullet's speed given relative to the gun.</div>
<div class="step"><b>4. Pulleys and constraints.</b> One equation per body plus the string-length rule. <i>Trap:</i> a movable pulley halves the block's acceleration and doubles the tension it carries.</div>
<div class="step"><b>5. Contact forces and springs.</b> System first for a, then one block for the contact force. <i>Trap:</i> a spring force cannot change at the instant a string is cut; a string force can.</div>
<div class="step"><b>6. Lifts and pseudo forces.</b> N = m(g + a); pendulum in a car tan θ = a/g. <i>Trap:</i> slowing down while going up means a points down.</div>
<div class="step"><b>7. Does it slip?</b> Find the friction needed and compare with μs N. If needed is smaller, friction equals needed. <i>Trap:</i> writing f = μN for a body at rest.</div>
<div class="step"><b>8. Blocks on blocks and on slopes.</b> Assume they move together, find the friction needed on the top block, check against μN. <i>Trap:</i> the top block's greatest acceleration is μg, set by friction alone.</div>
<div class="step"><b>9. Circular motion on roads.</b> Flat: v = √(μrg). Banked: tan θ = v²/rg. <i>Trap:</i> using N = mg on a banked road; it is larger.</div>
<div class="step"><b>10. Vertical circle.</b> Top: T + mg = mv²/r. Energy links top and bottom. <i>Trap:</i> a rod needs only zero speed at the top, a string needs √(gr).</div>
</div>

## Worked examples

**Example 1 (level 3, movable pulley).** Block A (4 kg) on a smooth table is tied by a string that passes over a fixed pulley at the edge, then down round a light movable pulley carrying block B (6 kg), and up to a fixed hook. Find B's acceleration. (g = 10 m/s²)

*Solution.* If A moves x, B falls x/2, so `$a_B = a_A/2$`. A: `$T = 4a_A$`. B: `$60 - 2T = 6a_B$`. Put `$a_A = 2a_B$`: `$60 - 16a_B = 6a_B$`, so **a_B = 30/11 ≈ 2.73 m/s²** (T ≈ 21.8 N). *Trap:* taking equal accelerations.

**Example 2 (level 4, block on block).** A 2 kg block sits on a 4 kg block on a smooth floor; μ between them is 0.3. A force of 24 N pulls the lower block. Find both accelerations. (g = 10 m/s²)

*Solution.* Together: a = 24/6 = 4 m/s², which would need friction 2 × 4 = 8 N on the top block. The limit is 0.3 × 20 = 6 N, so they slip. Top: **a = 6/2 = 3 m/s²**. Bottom: (24 − 6)/4 = **4.5 m/s²**.

**Example 3 (level 4, least force).** What is the least force needed to drag a 10 kg box on a floor with μ = 0.75, and at what angle? (g = 10 m/s²)

*Solution.* Least force `$= \mu mg/\sqrt{1 + \mu^2} = 75/1.25$` = **60 N**, pulling at `$\tan\alpha = 0.75$`, so α ≈ **37°** above the horizontal. Pulling horizontally needs 75 N.

**Example 4 (level 5, vertical circle).** A 0.5 kg stone on a 1 m string just completes a vertical circle. Find the tension when the string is horizontal. (g = 10 m/s²)

*Solution.* At the bottom `$v^2 = 5gr = 50$`. At the side it has risen r: `$v^2 = 50 - 2 \times 10 \times 1 = 30$`. Horizontal string: only tension points to the centre, `$T = mv^2/r = 0.5 \times 30$` = **15 N** (= 3mg).

<div class="myth">

**"On an incline, N = mg."** Only on level ground. On a slope N = mg cos θ, pulling up at an angle lowers it, pushing down raises it, and on a banked road N = mg/cos θ (larger). Always find N from the perpendicular direction first.

</div>

<div class="meaning">
<dl>
<dt>System or one body</dt><dd>use the whole system to find a common acceleration; use one body to find a force between bodies</dd>
<dt>Slip test</dt><dd>friction needed ≤ μs N means no slipping and f = needed; otherwise f = μk N</dd>
<dt>Physical meaning</dt><dd>Internal forces (tension inside the system, friction between blocks) cancel only when you treat the whole system as one body.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="laws-of-motion" data-mode="practice"></div>

<div class="keypoints">

- Ten types: laws and frames, impulse, recoil, pulleys, contact and springs, lifts and pseudo forces, slip test, blocks on blocks, roads, vertical circle.
- Always check whether a body slips before writing f = μN.
- Constraints: a movable pulley halves the acceleration.
- Top block's greatest acceleration is μg; above that they slip.
- Vertical circle on a string: √(gr) at top, √(5gr) at bottom, tension 3mg at the side.

</div>
