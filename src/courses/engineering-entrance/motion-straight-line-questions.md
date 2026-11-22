---
title: 'Motion in a straight line: question types and traps'
seoTitle: 'Kinematics in 1D questions for JEE and NEET'
summary: 'Every way entrance exams ask about straight-line motion: graph reading and conversion, constant-acceleration problems, free fall from towers and balloons, nth-second distances, chases and relative motion, and variable acceleration with calculus, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'A stone is dropped from a balloon rising at 5 m/s. Just after release, the stone''s velocity is:'
    choices: ['zero', '5 m/s upwards', '5 m/s downwards', '9.8 m/s downwards']
    ans: 1
    why: 'The stone shares the balloon''s velocity at the moment it is let go: 5 m/s upwards. Then gravity slows it, stops it and brings it down.'
  - q: 'A body starting from rest covers 10 m in the first second with constant acceleration. Distance in the third second is:'
    choices: ['30 m', '50 m', '90 m', '20 m']
    ans: 1
    why: 'Distances in successive seconds from rest go 1 : 3 : 5. 10 m × 5 = 50 m.'
  - q: 'The area under an acceleration-time graph from t = 0 to t = 4 s is 12 m/s. If the body started at 3 m/s, its velocity at 4 s is:'
    choices: ['12 m/s', '15 m/s', '9 m/s', '3 m/s']
    ans: 1
    why: 'The area under a-t is the change in velocity: 3 + 12 = 15 m/s.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Kinematics; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 28 minutes.** Read the lesson [Motion in a straight line](/learn/courses/engineering-entrance/motion-straight-line/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Straight-line motion questions come in nine types. In every one, the first two lines decide the answer: an origin with a positive direction, and a choice of graph or equation.</div>

## The nine question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Read a graph.</b> Velocity from the slope of x-t, acceleration from the slope of v-t, displacement and distance from areas. <i>Trap:</i> area below the axis is negative for displacement but positive for distance.</div>
<div class="step"><b>2. Convert one graph into another.</b> "Which v-t graph matches this x-t graph?" <i>Method:</i> go piece by piece: straight x-t → flat v-t; curving up → rising v-t. <i>Trap:</i> sudden jumps in x (impossible) or in v (infinite acceleration).</div>
<div class="step"><b>3. Constant acceleration with numbers.</b> Pick the equation that leaves out the quantity you are not given and not asked for.</div>
<div class="step"><b>4. Two-stage motion.</b> Accelerate, then brake; or a rocket whose fuel runs out. <i>Method:</i> the final velocity of stage 1 is the initial velocity of stage 2. A v-t sketch with areas is often fastest.</div>
<div class="step"><b>5. Free fall, towers and balloons.</b> <i>Method:</i> up positive, origin at the release point, the object starts with the balloon's or lift's velocity. <i>Trap:</i> taking u = 0 for an object released from something moving.</div>
<div class="step"><b>6. nth second and ratios.</b> s_n = u + a(2n − 1)/2; from rest 1 : 3 : 5 and 1 : 4 : 9. <i>Trap:</i> confusing "in the nth second" with "in n seconds".</div>
<div class="step"><b>7. Chases and meetings.</b> Write x(t) for each, set equal. Or use relative motion: relative speed, relative acceleration, relative distance.</div>
<div class="step"><b>8. Relative motion in free fall.</b> Two bodies in free fall have zero relative acceleration, so their separation changes at a constant rate.</div>
<div class="step"><b>9. Variable acceleration (calculus).</b> a(t): integrate twice. a(x): use v dv/dx. a(v): separate the variables. <i>Trap:</i> using v = u + at when a is not constant.</div>
</div>

## Worked examples

**Example 1 (level 2, two-stage motion).** A car starts from rest, accelerates at 2 m/s² for 10 s, then brakes at 4 m/s² to rest. Total distance?

*Solution.* Top speed = 2 × 10 = 20 m/s. Braking time = 20/4 = 5 s. On a v-t graph this is a triangle of base 15 s and height 20 m/s: distance = ½ × 15 × 20 = **150 m**. *Faster than two equations.*

**Example 2 (level 3, balloon).** A balloon rises at 10 m/s. When it is 75 m above the ground a packet is dropped. When does the packet land? (g = 10 m/s²)

*Solution.* Up positive, origin at the release point: u = +10, a = −10, landing at s = −75. `$-75 = 10t - 5t^2$`, so `$t^2 - 2t - 15 = 0$` and t = 5 s (t = −3 s is meaningless). **Answer: 5 s.** *Trap:* taking u = 0 gives √15 ≈ 3.9 s.

**Example 3 (level 3, statements).** Statement I: A body can have zero velocity and non-zero acceleration. Statement II: A body can have constant speed and non-zero acceleration in a straight line.

*Solution.* I is true (top of a vertical throw). II is false in a straight line: constant speed along a line means constant velocity, so zero acceleration (it is possible only on a curved path). **I true, II false.**

**Example 4 (level 4, relative motion in free fall).** Ball A is dropped from a 100 m tower. At the same instant ball B is thrown up from the ground at 25 m/s, directly below. When and where do they meet? (g = 10 m/s²)

*Solution.* Relative to A, B has zero relative acceleration and closes the 100 m gap at a constant 25 m/s: t = 100/25 = **4 s**. In 4 s, A falls ½ × 10 × 16 = 80 m, so they meet **20 m above the ground**. *Check with B:* 25 × 4 − 5 × 16 = 20 m. ✓

**Example 5 (level 4, graph conversion).** A particle's x-t graph is a parabola opening downwards with its vertex at t = 3 s. Which describes its v-t graph?

*Solution.* A downward parabola means `$x = -k(t-3)^2 + c$`, so `$v = -2k(t - 3)$`: a straight line with negative slope crossing zero at t = 3 s. Velocity positive before 3 s, negative after; constant negative acceleration throughout.

**Example 6 (level 5, variable acceleration).** A particle starts from rest at x = 0 with acceleration `$a = 6 - 2x$` (SI units). Find its maximum speed and the farthest point it reaches.

*Solution.* `$v\,\dfrac{dv}{dx} = 6 - 2x \Rightarrow \dfrac{v^2}{2} = 6x - x^2$`. Speed is greatest where a = 0, at x = 3 m: `$v^2 = 2(18 - 9) = 18$`, **v = 3√2 m/s ≈ 4.24 m/s**. It stops where `$6x - x^2 = 0$`, at **x = 6 m** (then it comes back: this is simple harmonic motion about x = 3 m).

<div class="myth">

**"At the top of its path a thrown ball has zero acceleration."** The single most common wrong option in this chapter. Gravity never switches off; the acceleration is g downwards at every point, including the top.

</div>

<div class="meaning">
<dl>
<dt>Equation choice</dt><dd>leave out what you neither know nor need: no t → v² = u² + 2as; no v → s = ut + ½at²; no s → v = u + at</dd>
<dt>Relative trick</dt><dd>in free fall both bodies accelerate equally, so relative to each other they move uniformly</dd>
<dt>Physical meaning</dt><dd>Most kinematics errors are sign errors. Writing the origin and the positive direction first removes most of them.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes graphs, numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="motion-straight-line" data-mode="practice"></div>

<div class="keypoints">

- Nine types: graph reading, graph conversion, constant-acceleration numbers, two-stage motion, free fall with towers and balloons, nth second, chases, relative motion in free fall, variable acceleration.
- A v-t sketch with areas solves most two-stage problems fastest.
- An object released from a moving balloon or lift starts with that velocity.
- Bodies in free fall have zero relative acceleration.
- For a(x) use v dv/dx; maximum speed is where a = 0.

</div>
