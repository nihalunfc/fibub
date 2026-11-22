---
title: Vectors and motion in a plane
seoTitle: 'Vectors and projectiles: JEE and NEET physics'
summary: 'Vectors and their components, dot and cross products, projectile motion from the ground, from a height and on an incline, relative velocity for rivers, rain and wind, and uniform and non-uniform circular motion.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'At the highest point of a projectile''s path (no air resistance), which statement is true?'
    choices: ['Velocity is zero', 'Acceleration is zero', 'Velocity is horizontal and acceleration is g downwards', 'Velocity and acceleration are both horizontal']
    ans: 2
    why: 'Only the vertical part of the velocity becomes zero at the top. The horizontal part u cos θ never changes, and gravity still pulls down at g.'
  - q: 'Two angles of projection give the same range for the same speed on level ground. They are:'
    choices: ['θ and 2θ', 'θ and 90° − θ', 'θ and 180° − θ', 'θ and 45° + θ']
    ans: 1
    why: 'R = u² sin 2θ / g, and sin 2θ = sin(180° − 2θ) = sin 2(90° − θ). So θ and 90° − θ give equal ranges, for example 30° and 60°.'
  - q: 'A body moves in a circle at constant speed. Its acceleration is:'
    choices: ['zero, since the speed is constant', 'v²/r towards the centre', 'v²/r along the motion', 'v/r towards the centre']
    ans: 1
    why: 'The direction of the velocity keeps turning, so the velocity changes even though the speed does not. That change needs an acceleration v²/r pointing to the centre.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Kinematics (motion in a plane, projectile motion, uniform circular motion, relative velocity)'
  - 'Standard gravity g = 9.806 65 m/s² (exact by definition), BIPM SI Brochure, 9th edition https://www.bipm.org/en/publications/si-brochure'
---

**Physics · Class 11 · about 34 minutes.** By the end you will be able to add and split vectors, use the dot and cross products, solve any projectile problem (level ground, from a height, on a slope), handle rivers, rain and wind with relative velocity, and find the acceleration in circular motion.

<div class="bigidea">Motion in a plane is two straight-line motions happening at the same time, one along x and one along y, linked only by the clock. Split every vector into components, solve each direction on its own, and join the answers at the end.</div>

## 1. Vectors: size, direction and components

A **vector** has a size (magnitude) and a direction: displacement, velocity, force. A **scalar** has only a size: mass, time, energy. Two vectors add by the **triangle rule**: put the tail of the second at the head of the first; the sum runs from the first tail to the last head.

For two vectors of sizes A and B with angle θ between them:

```math
|\vec A + \vec B| = \sqrt{A^2 + B^2 + 2AB\cos\theta}, \qquad \tan\alpha = \frac{B\sin\theta}{A + B\cos\theta}
```

Here α is the angle the sum makes with A. The sum is largest (A + B) at θ = 0 and smallest (|A − B|) at θ = 180°, so three forces can balance only if each is no bigger than the sum of the other two.

**Components.** A vector of size A at angle θ to the x axis is `$\vec A = A\cos\theta\,\hat i + A\sin\theta\,\hat j$`. Unit vectors `$\hat i, \hat j, \hat k$` have size 1 and point along x, y, z. To add vectors, add their components. A unit vector along any vector is `$\hat A = \vec A / A$`.

Drag the two round tips to change the vectors, then switch the view to see the parallelogram and the components. Notice that R = A + B is the same whichever way you draw it.

<figure class="fig" data-fig="@mech-vector-add"><figcaption>Head to tail: B starts where A ends, and R runs from the start of A to the end of B. In the components view Rx and Ry are just the sums of the x parts and the y parts.</figcaption></figure>

## 2. Dot and cross products

| Product | Formula | Result | Use |
|---|---|---|---|
| Dot | `$\vec A\cdot\vec B = AB\cos\theta = A_xB_x + A_yB_y + A_zB_z$` | scalar | work, angle between vectors, projection |
| Cross | `$\vec A\times\vec B = AB\sin\theta\,\hat n$` | vector, perpendicular to both | torque, area of a parallelogram |

The dot product is zero for perpendicular vectors; the cross product is zero for parallel ones. `$\vec A\times\vec B = -\vec B\times\vec A$`. The size of `$\vec A\times\vec B$` is the area of the parallelogram the two vectors make.

<div class="myth">

**"The resultant of two vectors is always bigger than each of them."** No. At 120° two equal vectors of size A have a resultant of exactly A, and beyond that it is smaller. At 180° the resultant is A − B.

</div>

## 3. Projectile motion

Once thrown, a body (with no air resistance) has acceleration g straight down and nothing sideways. So:

- **Horizontal:** constant velocity `$u_x = u\cos\theta$`, so `$x = u\cos\theta\,t$`.
- **Vertical:** constant acceleration −g, so `$v_y = u\sin\theta - gt$` and `$y = u\sin\theta\,t - \tfrac12 gt^2$`.

Play with speed, angle and launch height below. Watch the arrows: the horizontal one never changes.

<figure class="fig" data-fig="proj-path"><figcaption>A projectile path. The horizontal velocity arrow is the same everywhere; the vertical arrow shrinks to zero at the top and grows downwards after. The dashed path is the complementary angle 90° − θ, which lands at the same spot.</figcaption></figure>

```math
T = \frac{2u\sin\theta}{g}, \qquad H = \frac{u^2\sin^2\theta}{2g}, \qquad R = \frac{u^2\sin 2\theta}{g}, \qquad y = x\tan\theta - \frac{g x^2}{2u^2\cos^2\theta}
```

<div class="meaning">
<dl>
<dt>u</dt><dd>launch speed</dd>
<dt>θ</dt><dd>launch angle above the horizontal</dd>
<dt>T, H, R</dt><dd>time of flight, greatest height and horizontal range, all for landing at the launch level</dd>
<dt>y(x)</dt><dd>the trajectory equation: a parabola; written as y = x tan θ (1 − x/R) it gives the range at once</dd>
<dt>Physical meaning</dt><dd>The time in the air is set only by the vertical motion. The horizontal speed just decides how far the body drifts in that time.</dd>
</dl>
</div>

Useful results: the range is greatest at 45°, `$R_{max} = u^2/g$`, where H = R/4. In general `$\tan\theta = 4H/R$`. The speed at height h is `$\sqrt{u^2 - 2gh}$`, whatever the angle.

<div class="problem" data-problem="mp-projectile-height"></div>

**Thrown horizontally from a height h** at speed u: time `$\sqrt{2h/g}$` (the same as a dropped stone), range `$u\sqrt{2h/g}$`, landing speed `$\sqrt{u^2 + 2gh}$`.

**On an incline of angle α** (thrown at θ above the horizontal, up the slope), tilt the axes along the slope. Then g has parts g sin α along and g cos α into the slope. The time of flight is `$T = \dfrac{2u\sin(\theta - \alpha)}{g\cos\alpha}$` and the range up the slope is greatest when the launch direction bisects the angle between the slope and the vertical, giving `$R_{max} = \dfrac{u^2}{g(1 + \sin\alpha)}$`.

<div class="myth">

**"A bullet fired horizontally hits the ground later than one dropped from the same height."** They land together. The horizontal speed has no effect on the vertical motion, and both start with zero vertical velocity.

</div>

Compare the two paths for the same launch, then change the ground to a slope and move the angle to find the best range with and without air.

<figure class="fig" data-fig="@mech-projectile-drag"><figcaption>Air drag makes the path steeper on the way down and shortens the range, so the best angle falls below 45° for a level field. With the ground sloping down, the best angle rises.</figcaption></figure>

## 4. Relative velocity in two dimensions

The velocity of A as seen by B is `$\vec v_{AB} = \vec v_A - \vec v_B$`, now as vectors. Three classic settings:

- **River crossing** (width d, river speed w, swimmer speed v in still water). *Least time:* head straight across, t = d/v, drift = wd/v. *Shortest path:* head upstream at sin α = w/v, so you land opposite, t = `$d/\sqrt{v^2 - w^2}$` (possible only if v > w).
- **Rain and a moving person.** Rain falling straight down looks slanted to a walker. The umbrella must point along the rain's velocity relative to the walker, `$\vec v_{rain} - \vec v_{man}$`.
- **Aircraft and wind.** The plane's ground velocity = its air velocity + the wind's velocity. To fly due north in a westward wind, point the nose a little east.

<div class="problem" data-problem="mp-river"></div>

**Closest approach (JEE Advanced).** For two bodies moving at constant velocities, sit on one of them. The other moves in a straight line with the relative velocity. The closest distance is the perpendicular distance from you to that line, and it happens after time = (component of the initial separation along the relative velocity) ÷ (relative speed).

Try both pictures. On the river, set the heading to 0° (fastest crossing) and then press Straight across; in the rain picture, raise your walking speed and watch the tilt.

<figure class="fig" data-fig="@mech-relative-velocity"><figcaption>Ground velocity is always the vector sum of velocity in the medium and velocity of the medium. Fastest crossing and shortest path are different headings.</figcaption></figure>

## 5. Circular motion

Angle turned θ (radians), **angular velocity** `$\omega = d\theta/dt$`, **angular acceleration** `$\alpha = d\omega/dt$`. Linear and angular are linked by the radius: `$s = r\theta$`, `$v = r\omega$`, `$a_t = r\alpha$`. Time period T = 2π/ω, frequency f = 1/T.

**Uniform circular motion:** the speed is constant but the direction turns, so there is an acceleration towards the centre:

```math
a_c = \frac{v^2}{r} = \omega^2 r
```

**Non-uniform circular motion:** the speed also changes, adding a tangential part `$a_t = dv/dt$`. The two parts are at right angles, so `$a = \sqrt{a_c^2 + a_t^2}$`, and the total acceleration no longer points at the centre.

<div class="problem" data-problem="mp-circular-accel"></div>

<div class="myth">

**"Centripetal force is a new force that appears in circular motion."** It is not a new kind of force. It is the name for whatever real force (tension, friction, gravity, a normal force) points to the centre. Draw only real forces; their inward total must equal mv²/r.

</div>

**Worked example (level 4).** A particle moves on a circle of radius 2 m with speed `$v = 2t$` m/s. At t = 1 s, the tangential acceleration is 2 m/s² and the centripetal one is 2²/2 = 2 m/s². Total = 2√2 m/s², at 45° to the velocity.

<div class="keypoints">

- Split vectors into components; motion along x and along y are independent and share only the time.
- Resultant of A and B: √(A² + B² + 2AB cos θ); between |A − B| and A + B.
- Dot product AB cos θ (scalar, zero if perpendicular); cross product AB sin θ (vector, zero if parallel).
- Projectile: T = 2u sin θ/g, H = u² sin²θ/2g, R = u² sin 2θ/g; R is greatest at 45°; θ and 90° − θ give the same range.
- Thrown horizontally from height h: time √(2h/g), the same as a dropped body.
- Relative velocity v_A − v_B; river: least time heads across, shortest path heads upstream with sin α = w/v.
- Circular motion: a_c = v²/r inward; non-uniform adds a_t = dv/dt; total √(a_c² + a_t²).

</div>
