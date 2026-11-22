---
title: 'Vectors and motion in a plane: question types and traps'
seoTitle: 'Projectile and vector questions for JEE and NEET'
summary: 'Every way entrance exams ask about vectors, projectiles, relative velocity and circular motion: resultants, dot and cross products, trajectory equations, projectiles from heights and on inclines, rivers, rain, closest approach and non-uniform circular motion, each with a method and its trap.'
minutes: 28
updated: 2026-11-22
quiz:
  - q: 'A projectile''s trajectory is y = 2x − 0.2x² (metres). Its range is:'
    choices: ['5 m', '10 m', '20 m', '2 m']
    ans: 1
    why: 'Write it as y = x tan θ (1 − x/R): y = 2x(1 − x/10). So tan θ = 2 and R = 10 m.'
  - q: 'Rain falls vertically at 4 m/s. A man walks at 3 m/s. The rain seems to him to hit at what speed?'
    choices: ['1 m/s', '5 m/s', '7 m/s', '4 m/s']
    ans: 1
    why: 'Relative velocity of rain = v_rain − v_man: 4 down and 3 backwards, size √(16 + 9) = 5 m/s.'
  - q: 'Two vectors of equal size A have a resultant of size A. The angle between them is:'
    choices: ['60°', '90°', '120°', '180°']
    ans: 2
    why: 'A² = A² + A² + 2A² cos θ gives cos θ = −1/2, so θ = 120°.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Kinematics; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 28 minutes.** Read the lesson [Vectors and motion in a plane](/learn/courses/engineering-entrance/motion-plane/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Every question in this chapter becomes easy once the right axes are chosen. Ground problems use horizontal and vertical axes, incline problems use axes along and across the slope, and relative-motion problems sit on one of the moving bodies.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Resultants and components.</b> √(A² + B² + 2AB cos θ). <i>Trap:</i> θ is the angle between the tails, not the angle in the triangle drawn head to tail.</div>
<div class="step"><b>2. Dot and cross products.</b> Angle from cos θ = A·B/AB; perpendicular means dot = 0; area of parallelogram = |A × B|, triangle = half. <i>Trap:</i> the order in a cross product flips the sign.</div>
<div class="step"><b>3. Standard projectile numbers.</b> T, H, R from the three formulas; tan θ = 4H/R. <i>Trap:</i> using sin θ instead of sin 2θ in the range.</div>
<div class="step"><b>4. Trajectory equation.</b> Compare y = ax − bx² with y = x tan θ − gx²/(2u² cos²θ), or factor it as y = x tan θ (1 − x/R).</div>
<div class="step"><b>5. Projectile from a height.</b> Up positive, origin at the launch point, landing at y = −h; solve the quadratic for t. <i>Trap:</i> using R = u² sin 2θ/g, which is only for landing at the launch level.</div>
<div class="step"><b>6. Projectile on an incline.</b> Axes along and across the slope; g splits into g sin α and g cos α. <i>Trap:</i> measuring θ from the horizontal in one place and from the slope in another.</div>
<div class="step"><b>7. River crossing.</b> Least time: head across. Shortest path: head upstream with sin α = w/v. If w > v the shortest drift needs sin α = v/w. <i>Trap:</i> mixing up heading and actual path.</div>
<div class="step"><b>8. Rain, wind and aircraft.</b> Draw the vector triangle v_rel = v_A − v_B. The umbrella and the plane's nose point along the relative or air velocity.</div>
<div class="step"><b>9. Closest approach and meeting.</b> Sit on one body; the other moves straight with the relative velocity. The minimum distance is a perpendicular.</div>
<div class="step"><b>10. Circular motion.</b> a_c = v²/r, a_t = dv/dt, total by Pythagoras; angle with the velocity tan φ = a_c/a_t. <i>Trap:</i> calling the acceleration zero when the speed is constant.</div>
</div>

## Worked examples

**Example 1 (level 3, from a height).** A stone is thrown at 20 m/s at 30° above the horizontal from a cliff 25 m high. How far from the foot of the cliff does it land? (g = 10 m/s²)

*Solution.* u_x = 10√3 m/s, u_y = 10 m/s. Vertical with up positive: `$-25 = 10t - 5t^2$`, so `$t^2 - 2t - 5 = 0$` and `$t = 1 + \sqrt6 \approx 3.45$` s. Range = 10√3 × 3.45 ≈ **59.7 m**. *Trap:* u² sin 2θ/g gives 34.6 m, which is only where it would pass the launch height.

**Example 2 (level 4, incline).** A ball is projected at 10 m/s at 60° to the horizontal from the foot of a 30° incline, up the slope. Find the time of flight and the range along the slope. (g = 10 m/s²)

*Solution.* Angle with the slope = 60° − 30° = 30°. Across the slope: u sin 30° = 5 m/s, acceleration g cos 30° = 5√3. `$T = 2 \times 5/(5\sqrt3) = 2/\sqrt3 \approx 1.155$` s. Along the slope: u cos 30° = 5√3, deceleration g sin 30° = 5. Range = `$5\sqrt3 \cdot T - \tfrac12 \cdot 5 \cdot T^2 = 10 - 3.33$` = **6.67 m** (= 20/3 m).

**Example 3 (level 4, closest approach).** Ship A is 10 km due west of ship B. A sails east at 30 km/h, B sails north at 40 km/h. Find the least distance between them.

*Solution.* Sit on B. A's relative velocity = (30 east, 40 south), speed 50 km/h. A starts 10 km west of B. The distance from B to A's relative line is 10 × sin φ, where φ is the angle between the relative velocity and the line from A to B (east): sin φ = 40/50. Least distance = **8 km**, reached after (10 × 30/50)/50 = 0.12 h = 7.2 min.

**Example 4 (level 5, circular motion).** A particle moves on a circle of radius 1 m with angular position `$\theta = t^2$` (radians). When is its total acceleration at 45° to its velocity?

*Solution.* ω = 2t, α = 2. a_t = rα = 2, a_c = ω²r = 4t². At 45° the two parts are equal: 4t² = 2, so **t = 1/√2 ≈ 0.707 s**.

<div class="myth">

**"For greatest range from a cliff, throw at 45°."** Only on level ground. From a height the best angle is less than 45°; on an upward slope it is (90° + α)/2 from the horizontal.

</div>

<div class="meaning">
<dl>
<dt>Axes choice</dt><dd>ground: horizontal and vertical; incline: along and across the slope; two moving bodies: sit on one</dd>
<dt>Range factor</dt><dd>y = x tan θ (1 − x/R) reads the angle and the range off any trajectory equation</dd>
<dt>Physical meaning</dt><dd>The clock is shared by both directions; time from one direction is what you carry into the other.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="motion-plane" data-mode="practice"></div>

<div class="keypoints">

- Ten types: resultants, dot and cross, standard projectile, trajectory equation, from a height, on an incline, river, rain and wind, closest approach, circular motion.
- From a height, solve the vertical quadratic for t; do not use u² sin 2θ/g.
- On an incline, tilt the axes; g has parts g sin α and g cos α.
- Closest approach: relative velocity, then a perpendicular distance.
- Circular motion: compare a_c and a_t; equal parts mean 45° to the velocity.

</div>
