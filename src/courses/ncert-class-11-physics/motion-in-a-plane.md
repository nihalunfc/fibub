---
title: Motion in a Plane
seoTitle: 'Motion in a Plane Class 11 notes, vectors, projectile'
summary: 'Class 11 Motion in a Plane with animations: vectors and components, dot and cross products, projectile motion, relative velocity and circular motion.'
minutes: 95
updated: 2026-11-23
quiz:
  - q: 'A ball is thrown at 20 m/s at 30° above the horizontal. Taking g = 10 m/s², its time of flight is:'
    choices: ['1 s', '2 s', '3 s', '4 s']
    ans: 1
    why: 'T = 2u sinθ / g = 2 × 20 × 0.5 / 10 = 2 s.'
  - q: 'Two vectors of magnitudes 6 and 8 act at right angles. The magnitude of their resultant is:'
    choices: ['14', '2', '10', '48']
    ans: 2
    why: 'R = √(6² + 8²) = √100 = 10.'
  - q: 'A particle moves at constant speed on a circle of radius 2 m with a centripetal acceleration of 8 m/s². Its speed is:'
    choices: ['2 m/s', '4 m/s', '8 m/s', '16 m/s']
    ans: 1
    why: 'a = v²/r, so v = √(ar) = √(8 × 2) = 4 m/s.'
sources:
  - 'NCERT Class 11 Physics, Chapter 3 “Motion in a Plane” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard gravity g = 9.80665 m/s²: BIPM, SI Brochure, 9th edition (2019)'
  - 'Galileo Galilei, Discorsi e dimostrazioni matematiche intorno a due nuove scienze (1638), Fourth Day, on the parabolic path of projectiles (for the history box)'
---

**Physics · Class 11 · Chapter 3 · about 95 minutes.** By the end you will be able to add, subtract and resolve vectors, use the dot and cross products, solve projectile problems, find relative velocities in two dimensions, and explain why circular motion at constant speed needs an acceleration.

<div class="bigidea">Straight lines are a special case. In a plane, a motion has a direction as well as a size, and the great trick is to split every vector into two perpendicular parts, x and y, that can be handled completely separately. A ball in flight is two simple motions running side by side: constant speed sideways and free fall downwards.</div>

## 1. Scalars and vectors

A **scalar** has only a size: mass, time, distance, speed, temperature, energy. A **vector** has a size **and** a direction and follows special rules for adding: displacement, velocity, acceleration, force, momentum.

We write a vector in bold (**A**) or with an arrow, and its magnitude as `$|\vec A|$` or A. Some ideas to know:

- The **position vector** of a point locates it from the origin; the **displacement vector** joins the start to the end of a movement.
- Two vectors are **equal** if they have the same magnitude and the same direction, wherever they are drawn. A vector can be slid sideways without changing it.
- Multiplying by a number λ stretches the vector by λ (reverses it if λ is negative). `$-\vec A$` has the same size but the opposite direction.
- A **unit vector** has magnitude 1 and shows a direction only: `$\hat n = \vec A/|\vec A|$`. The unit vectors along x, y and z are î, ĵ and k̂.

A first example: if you walk 3 km east and then 4 km north, your path length is 7 km but your displacement is only 5 km (a 3-4-5 triangle) towards the north-east.

<div class="myth">

**“Vectors add like ordinary numbers.”** 3 m and 4 m add to 5 m, not 7 m, when they are at right angles. The direction decides everything: parallel vectors add to 7 m, opposite ones to 1 m.

</div>

## 2. Adding vectors and resolving them into components

**Triangle (head-to-tail) rule.** Draw A, then draw B starting at the tip of A. The resultant **R = A + B** runs from the tail of A to the tip of B. The **parallelogram rule** gives the same thing: draw both from one point and complete the parallelogram; the diagonal is R. For subtraction add the opposite: **A − B = A + (−B)**.

Two forces, F₁ and F₂, with an angle θ between their directions, give

```math
R = \sqrt{F_1^2 + F_2^2 + 2F_1F_2\cos\theta}, \qquad \tan\alpha = \frac{F_2\sin\theta}{F_1 + F_2\cos\theta}
```

(α is the angle of R from F₁). The resultant is largest, F₁ + F₂, when θ = 0°, and smallest, |F₁ − F₂|, when θ = 180°.

### Resolving a vector into components

A vector can be split into two perpendicular parts. If A makes an angle θ with the x-axis,

```math
A_x = A\cos\theta, \qquad A_y = A\sin\theta, \qquad \vec A = A_x\,\hat i + A_y\,\hat j, \qquad A = \sqrt{A_x^2 + A_y^2},\ \ \tan\theta = \frac{A_y}{A_x}
```

<figure class="fig" data-fig="c11p-plane-comps"><figcaption>Drag the tip of the vector, or use the two sliders. The dashed arrows are its components along x and y; the text below gives both descriptions of the same vector.</figcaption></figure>

<div class="meaning">

<dl>
<dt>A<sub>x</sub>, A<sub>y</sub></dt><dd>components: how much of the vector points along x and y. They can be negative</dd>
<dt>θ</dt><dd>angle from the positive x-axis; be careful which axis your angle is measured from before choosing sin or cos</dd>
<dt>Physical meaning</dt><dd>Walking north-east for 100 m is the same as walking 70.7 m east and 70.7 m north. The two perpendicular parts do not affect each other: the east part does not change how far north you got.</dd>
</dl>

</div>

### Adding by components: the method that always works

<div class="steps" data-fig="c11p-plane-addsteps">
<div class="step">Take A = 3î + 2ĵ and B = 1î + 4ĵ. We want A + B.</div>
<div class="step">Head-to-tail: slide B (without turning it) so that its tail sits on the tip of A.</div>
<div class="step">The resultant R is the arrow from the start of A to the tip of B.</div>
<div class="step">Or resolve each vector into its x and y components: A has (3, 2); B has (1, 4).</div>
<div class="step">Add the x-parts and the y-parts separately: R<sub>x</sub> = 3 + 1 = 4 and R<sub>y</sub> = 2 + 4 = 6, so R = 4î + 6ĵ.</div>
<div class="step">Magnitude |R| = √(4² + 6²) = √52 = 7.21; direction θ = tan⁻¹(6/4) = 56.3° from the x-axis.</div>
</div>

<div class="problem" data-problem="c11p-plane-vec"></div>

Draw your own vectors and add them head-to-tail here:

<!--fig:tool vector-adder-->

For the three-dimensional picture, see the [3D vector lab](/learn/vector-lab-3d/). To feel the difference between path length and displacement, try [Distance and displacement](/learn/distance-displacement/).

## 3. Products of vectors

**Scalar (dot) product** gives a number: `$\vec A\cdot\vec B = AB\cos\theta = A_xB_x + A_yB_y$`. It is the size of A times the part of B along A. Work is a dot product: `$W = \vec F\cdot\vec d$`. It is zero for perpendicular vectors, positive below 90° and negative above 90°.

**Vector (cross) product** gives a vector: its magnitude is `$|\vec A\times\vec B| = AB\sin\theta$`, the area of the parallelogram on A and B. Its direction is perpendicular to both, by the **right-hand rule** (curl your fingers from A towards B; the thumb points along A × B). It is zero for parallel vectors, and B × A = −(A × B). Torque `$\vec\tau = \vec r\times\vec F$` and the magnetic force are cross products.

<figure class="fig" data-fig="c11p-plane-products"><figcaption>Fix A and turn B. The green bar is the part of B along A (the dot product is A times that). The shaded parallelogram has area |A × B|; slide the angle to 0° and 180° and its area vanishes, while at 90° the dot product vanishes.</figcaption></figure>

Unit vectors give a handy table: î·î = 1, î·ĵ = 0; î × ĵ = k̂, ĵ × k̂ = î, k̂ × î = ĵ (and î × î = 0).

## 4. Motion in a plane: velocity and acceleration as vectors

The position vector `$\vec r = x\hat i + y\hat j$` changes with time. Then

```math
\vec v = \frac{d\vec r}{dt} = v_x\hat i + v_y\hat j, \qquad \vec a = \frac{d\vec v}{dt} = a_x\hat i + a_y\hat j
```

The velocity is always **tangent to the path**. And, importantly, the x and y motions are independent: for constant acceleration, each coordinate follows its own straight-line equations of Chapter 2: `$v_x = u_x + a_xt$`, `$x = u_xt + \tfrac12a_xt^2$`, and the same for y. A tiny change of velocity in either direction, in size or in direction, is an acceleration.

## 5. Projectile motion

A **projectile** is a body in flight under gravity alone: a thrown cricket ball, a kicked football, water from a fountain. Neglecting air, the horizontal acceleration is zero and the vertical acceleration is −g. The two motions run independently; the ball keeps moving sideways at the same rate while it is slowed and then sped up vertically.

<figure class="fig" data-fig="c11p-plane-proj"><figcaption>Change the speed and angle. The dashed grey line is where the ball would go with no gravity; gravity pulls it down ½gt² below that line at every moment. The orange arrow (vx) never changes; the green one (vy) shrinks, flips and grows.</figcaption></figure>

### Deriving the equations

<div class="steps" data-fig="c11p-plane-projsteps">
<div class="step">Launch from the origin with speed u at angle θ above the horizontal. Components: u<sub>x</sub> = u cosθ, u<sub>y</sub> = u sinθ.</div>
<div class="step">Horizontally nothing pushes the ball, so a<sub>x</sub> = 0, v<sub>x</sub> = u cosθ stays constant, and x = (u cosθ)t.</div>
<div class="step">Vertically a<sub>y</sub> = −g, so v<sub>y</sub> = u sinθ − gt and y = (u sinθ)t − ½gt².</div>
<div class="step">Eliminate t by putting t = x/(u cosθ): y = x tanθ − g x²/(2u² cos²θ). This has the form y = bx − cx², a **parabola**.</div>
<div class="step">The ball is back at ground level when y = 0, which gives the time of flight T = 2u sinθ/g.</div>
<div class="step">At the top v<sub>y</sub> = 0, which happens at t = T/2, so the maximum height is H = u² sin²θ/2g.</div>
<div class="step">The range is the horizontal distance in time T: R = (u cosθ)T = u² sin2θ/g.</div>
</div>

```math
T = \frac{2u\sin\theta}{g}, \qquad H = \frac{u^2\sin^2\theta}{2g}, \qquad R = \frac{u^2\sin 2\theta}{g}, \qquad \frac{H}{R} = \frac{\tan\theta}{4}
```

<div class="meaning">

<dl>
<dt>u, θ</dt><dd>launch speed and angle above the horizontal (ground-to-ground flight)</dd>
<dt>T, H, R</dt><dd>time of flight, greatest height and horizontal range</dd>
<dt>Maximum range</dt><dd>R is greatest, u²/g, at θ = 45°; angles θ and 90° − θ give the same range</dd>
<dt>Physical meaning</dt><dd>A footballer does not need a calculator: a flat, fast kick travels as far as a high, lobbed kick of the complementary angle, but the lob hangs in the air much longer.</dd>
</dl>

</div>

<figure class="fig" data-fig="c11p-plane-range"><figcaption>The range curve peaks at 45°. Move the angle and see the complementary angle’s dot share the same height. Below, the two paths land on the same spot, the steeper one reaching higher.</figcaption></figure>

<div class="problem" data-problem="c11p-plane-range"></div>

<div class="problem" data-problem="c11p-plane-height"></div>

For a stone thrown **horizontally** from a height h at speed v: the time to fall is `$\sqrt{2h/g}$` (exactly as if dropped) and the horizontal distance is `$v\sqrt{2h/g}$`.

<div class="problem" data-problem="c11p-plane-cliff"></div>

Fire a projectile yourself and compare the numbers:

<!--fig:tool projectile-launcher-->

Real balls feel air: see how drag changes the path in [Projectile with air drag](/science/projectile-drag/).

<div class="myth">

**“At the top of its flight the ball has no velocity and no acceleration.”** Only the vertical velocity is zero at the top. The ball is still moving sideways at u cosθ, and gravity still pulls it down at 9.8 m/s². A dropped ball and a thrown ball hit the ground together if released from the same height.

</div>

<div class="history">

<ul class="timeline">
<li><b>c. 350 BCE</b> Aristotle teaches that a thrown body is kept moving by the air rushing in behind it, and falls straight down when that push fades.</li>
<li><b>1638</b> Galileo shows that a projectile follows a parabola, by combining a steady horizontal motion with an accelerated vertical one.</li>
<li><b>1687</b> Newton explains both by one law of motion and one law of gravity.</li>
</ul>

</div>

## 6. Relative velocity in a plane

The velocity of A relative to B is `$\vec v_{AB} = \vec v_A - \vec v_B$`, both measured in the same frame. It is the velocity that B would see.

**Rain and umbrella.** Rain falls straight down at v_r. A person walks at v_p. In her frame the rain has velocity `$\vec v_r - \vec v_p$`: downward and also backwards. It seems to come from ahead, so she tilts the umbrella forward by an angle θ from the vertical with `$\tan\theta = v_p/v_r$`.

<figure class="fig" data-fig="@mech-relative-velocity"><figcaption>The same rain in two frames: the ground’s and the walker’s. The apparent direction of the rain changes with the walker’s speed.</figcaption></figure>

<div class="problem" data-problem="c11p-plane-rain"></div>

**Boat in a river.** A boat’s velocity relative to the ground is its velocity in still water plus the river’s velocity. Heading straight across gives the shortest time (width ÷ boat speed) but a drift downstream; to land exactly opposite, head upstream at an angle θ with `$\sin\theta = v_r/v_b$` (possible only if v_b > v_r).

<div class="problem" data-problem="c11p-plane-boat"></div>

<!--fig:tool river-crossing-->

## 7. Uniform circular motion

A body moving in a circle at constant speed is in **uniform circular motion**. Its speed does not change but its velocity does, because the direction keeps turning: it must have an acceleration.

Useful measures: the **period** T (time for one revolution), the **frequency** f = 1/T, and the **angular speed** ω = 2π/T (radians per second). The speed is `$v = r\omega$`. A wheel turning at 120 rpm has f = 2 Hz and ω = 4π rad/s.

<figure class="fig" data-fig="c11p-plane-circle"><figcaption>A body on a circle. The green arrow (velocity) is tangent to the path and always the same length; the orange arrow (acceleration) always points to the centre. Change r and v and read the period and the acceleration.</figcaption></figure>

### Deriving the centripetal acceleration

<div class="steps" data-fig="c11p-plane-circsteps">
<div class="step">A particle goes from P₁ to P₂ along a circle of radius r at constant speed v. In time Δt it covers the arc Δs = vΔt.</div>
<div class="step">At P₁ and P₂ the velocities v₁ and v₂ have the same length v but different directions: the velocity has changed.</div>
<div class="step">Draw both velocities from a common point. The change Δv = v₂ − v₁ closes a triangle with sides v, v and Δv.</div>
<div class="step">This triangle and the triangle formed by the two radii and the chord are similar (both isosceles, with the same apex angle Δθ). So Δv/v = Δs/r, i.e. Δv = vΔs/r.</div>
<div class="step">Divide by Δt: a = Δv/Δt = (v/r)(Δs/Δt) = v²/r. Also, since v = ωr, a = ω²r.</div>
<div class="step">As Δt becomes tiny, Δv becomes perpendicular to v and points to the centre: a **centripetal** (“centre-seeking”) acceleration of size v²/r.</div>
</div>

```math
a_c = \frac{v^2}{r} = \omega^2 r = \frac{4\pi^2 r}{T^2}, \qquad \text{directed towards the centre}
```

<div class="problem" data-problem="c11p-plane-circ"></div>

<div class="myth">

**“Centripetal force is a new kind of force.”** It is only the name for whatever force points to the centre: tension in a string, friction on a bend, gravity on a satellite. Chapter 4 shows how to use it (F = mv²/r), and the [vertical circle](/learn/vertical-circle/) tool applies it to a swinging bucket.

</div>

<div class="keypoints">

- Vectors have size and direction and add by the triangle or parallelogram rule. R² = A² + B² + 2AB cosθ. Subtract by adding the negative.
- Components: A_x = A cosθ, A_y = A sinθ; A = √(A_x² + A_y²). Add vectors by adding components.
- A·B = AB cosθ = A_xB_x + A_yB_y (scalar). |A × B| = AB sinθ (vector, right-hand rule); A × B = −B × A.
- In a plane v = dr/dt, a = dv/dt; the x and y motions are independent.
- Projectile (no air): T = 2u sinθ/g; H = u² sin²θ/2g; R = u² sin2θ/g; max range at 45°; θ and 90° − θ give equal range; path is a parabola; v_x constant.
- Relative velocity v_AB = v_A − v_B. Rain: tanθ = v_person/v_rain. Boat: head across for the least time; head upstream at sinθ = v_river/v_boat to land opposite.
- Circular motion: v = ωr, T = 2πr/v, a_c = v²/r = ω²r towards the centre.

</div>

Going further for JEE/NEET: projectiles on inclines, relative-motion chase problems and variable circular motion are in [Motion in a plane (JEE)](/learn/courses/engineering-entrance/motion-plane/).
