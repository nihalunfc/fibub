---
title: 'Motion in a Plane: practice questions'
seoTitle: 'Motion in a Plane Class 11 questions with answers'
summary: 'Board-style practice for Class 11 Motion in a Plane: vectors, projectile and circular motion, with 1, 2, 3 and 5 mark questions and a case study.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'The angle of projection for which the range equals four times the maximum height is:'
    choices: ['30°', '45°', '60°', '90°']
    ans: 1
    why: 'H/R = tanθ/4, so R = 4H when tanθ = 1, i.e. θ = 45°.'
  - q: 'The vectors A = 2î + 3ĵ and B = 3î − 2ĵ are:'
    choices: ['parallel', 'perpendicular', 'equal', 'antiparallel']
    ans: 1
    why: 'A·B = 6 − 6 = 0, so the angle between them is 90°.'
  - q: 'The period of a particle moving uniformly on a circle of radius 5 m at 10 m/s is:'
    choices: ['π s', '2π s', '5π s', '10π s']
    ans: 0
    why: 'T = 2πr/v = 2π × 5/10 = π s.'
sources:
  - 'CBSE Class 11 Physics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 3.** Read the chapter lesson, [Motion in a Plane](/learn/courses/ncert-class-11-physics/motion-in-a-plane/), first. Try each question on paper before opening the answer. Marks go for the diagram, the components, the formula, the substitution with units and the final answer.

<div class="bigidea">Draw first: a diagram with axes, components and angles catches most mistakes. In projectile questions treat x and y separately and join them only through time. In circular motion look for the centre and the acceleration v²/r pointing to it.</div>

## How to set out a numerical

1. Draw the situation, choose x and y axes, mark the angle from the axis you are using.
2. Resolve every vector into components.
3. Write the x equations and the y equations separately; the time t is the link.
4. Give the answer with unit and, for a vector, its direction.

<div class="problem" data-problem="c11p-plane-range"></div>

<div class="problem" data-problem="c11p-plane-circ"></div>

## 1-mark questions

1. Name a physical quantity that has magnitude and direction but is not a vector.

<details><summary>Answer</summary>Electric current (it follows the algebra of scalars, not the vector addition rule), or finite rotation angle.</details>

2. What is the angle between the velocity and acceleration of a particle in uniform circular motion?

<details><summary>Answer</summary>90°: the velocity is along the tangent, the acceleration is towards the centre.</details>

3. What is the value of î · ĵ and î × ĵ?

<details><summary>Answer</summary>î · ĵ = 0 and î × ĵ = k̂.</details>

4. Which component of a projectile’s velocity remains unchanged during flight (no air)?

<details><summary>Answer</summary>The horizontal component, u cosθ.</details>

## 2- and 3-mark questions

5. (2) State the triangle law of vector addition.

<details><summary>Answer</summary>If two vectors are drawn head to tail as two sides of a triangle, taken in order, their resultant is the third side drawn from the tail of the first to the head of the second.</details>

6. (2) Show that the range of a projectile is the same for angles θ and (90° − θ).

<details><summary>Answer</summary>

R = u² sin2θ/g. For 90° − θ: sin(180° − 2θ) = sin2θ, so the range is the same.

</details>

7. (3) A force F = 6î + 8ĵ N moves a body by d = 3î + 4ĵ m. Find the work done and the angle between F and d.

<details><summary>Answer</summary>

W = F·d = 6 × 3 + 8 × 4 = 50 J. |F| = 10 N, |d| = 5 m, so cosθ = 50/(10 × 5) = 1: θ = **0°**; the force and the displacement are parallel.

</details>

8. (3) A stone is whirled in a horizontal circle of radius 0.5 m with a period of 0.5 s. Find its speed and its centripetal acceleration.

<details><summary>Answer</summary>

v = 2πr/T = 2π × 0.5/0.5 = 2π = **6.28 m/s**. a = v²/r = (2π)²/0.5 = 4π²/0.5 = **79 m/s²** (about 8 g).

</details>

9. (3) A ball is thrown at 30 m/s at 53° above the horizontal (sin 53° = 0.8, cos 53° = 0.6; g = 10 m/s²). Find the time of flight, the maximum height and the range.

<details><summary>Answer</summary>

u_x = 18 m/s, u_y = 24 m/s. T = 2 × 24/10 = **4.8 s**. H = 24²/20 = **28.8 m**. R = 18 × 4.8 = **86.4 m**.

</details>

## 5-mark questions

10. (5) Derive the equation of the path of a projectile and show that it is a parabola. Obtain expressions for the time of flight and the maximum height.

<details><summary>Answer</summary>

Launch speed u at angle θ. x = (u cosθ)t (no horizontal acceleration); y = (u sinθ)t − ½gt² (vertical acceleration −g).

Eliminating t: `$y = x\tan\theta - \dfrac{g\,x^2}{2u^2\cos^2\theta}$`, of the form y = bx − cx², a parabola.

Time of flight: y = 0 gives T = 2u sinθ/g.

Maximum height: at the top v_y = u sinθ − gt = 0, so t = u sinθ/g, and `$H = \dfrac{u^2\sin^2\theta}{2g}$`.

</details>

11. (5) Derive an expression for the centripetal acceleration of a particle moving with constant speed v on a circle of radius r, using a diagram of velocities.

<details><summary>Answer</summary>

Let the particle move from P₁ to P₂ in time Δt, covering the arc Δs = vΔt. The velocity vectors v₁ and v₂ have equal magnitude v, but the angle between them is the same Δθ as between the radii OP₁ and OP₂.

The velocity triangle (sides v, v, Δv) is similar to triangle OP₁P₂ (sides r, r, chord ≈ Δs). Hence Δv/v = Δs/r, so Δv = vΔs/r.

Acceleration a = Δv/Δt = (v/r)(Δs/Δt) = v²/r. As Δt → 0, Δv becomes perpendicular to v and points towards the centre. Thus **a = v²/r = ω²r, directed to the centre**.

</details>

12. (5) A boat that moves at 4 m/s in still water is to cross a river 200 m wide that flows at 3 m/s. (a) Find the least time to cross and the drift. (b) At what angle upstream must it head to reach the point directly opposite, and how long does that take?

<details><summary>Answer</summary>

(a) Least time: head straight across. t = 200/4 = **50 s**. Drift = 3 × 50 = **150 m** downstream.

(b) Head upstream at θ from the perpendicular with sinθ = 3/4 = 0.75, θ = **48.6°**. The speed across = √(4² − 3²) = √7 = 2.65 m/s, so t = 200/2.65 = **75.6 s**.

</details>

## Case-based question

At a school sports day a javelin-like object is thrown at 20 m/s at an angle of 45° (take g = 10 m/s²). Another throw is made at 20 m/s at 60°.

(a) Find the range of the first throw. (b) Which throw stays in the air longer? (c) For which angle in the second throw would the range equal that of the first? (d) What is the ratio of the maximum heights?

<details><summary>Answer</summary>

(a) R = u²/g = 400/10 = **40 m** at 45°.

(b) T = 2u sinθ/g: at 45° 2.83 s; at 60° 3.46 s. The **60° throw** stays longer.

(c) The range at 60° is 400 × sin120°/10 = 34.6 m, so not equal. The complementary angle of 45° is 45° itself.

(d) H ∝ sin²θ: (sin²60°)/(sin²45°) = 0.75/0.5 = **1.5**.

</details>

## Assertion-reason questions

Choose: (A) both A and R true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

13. **A:** A body moving in a circle at constant speed has an acceleration. **R:** The direction of its velocity changes continuously.

<details><summary>Answer</summary>(A). Acceleration is the rate of change of the velocity vector, and a change of direction counts.</details>

14. **A:** The time of flight of a projectile does not depend on its horizontal velocity. **R:** The vertical and horizontal motions of a projectile are independent.

<details><summary>Answer</summary>(A). The time of flight is fixed by the vertical motion alone.</details>

15. **A:** The scalar product of two vectors can be zero even if neither vector is zero. **R:** The scalar product is AB cosθ, which vanishes for θ = 90°.

<details><summary>Answer</summary>(A). Perpendicular vectors such as î and ĵ show it.</details>

## Practise with fresh numbers

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="motion-in-a-plane" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Resolve into components first; add components, then recombine with Pythagoras and tan⁻¹.
- Projectile: x and y are independent; T = 2u sinθ/g, H = u² sin²θ/2g, R = u² sin2θ/g.
- Circular motion: a = v²/r = ω²r to the centre; T = 2πr/v.
- Relative velocity: v_AB = v_A − v_B; rain tilts forward, boats drift downstream unless steered upstream.

</div>
