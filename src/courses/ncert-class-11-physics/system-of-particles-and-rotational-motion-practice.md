---
title: 'System of Particles and Rotational Motion: practice questions'
seoTitle: 'Rotational Motion Class 11 questions with answers'
summary: 'Board-style practice for Class 11 Rotational Motion: centre of mass, torque, moment of inertia, angular momentum and rolling, with worked answers.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'The moment of inertia of a uniform disc about an axis through its centre perpendicular to its plane is ½MR². About a tangent in its plane it is:'
    choices: ['¼MR²', '½MR²', '5/4 MR²', '3/2 MR²']
    ans: 2
    why: 'About a diameter I = ¼MR² (perpendicular-axis theorem). The tangent is parallel to a diameter at distance R, so I = ¼MR² + MR² = 5/4 MR².'
  - q: 'A torque of 6 N m acts on a wheel of moment of inertia 2 kg m² for 3 s from rest. The final angular speed is:'
    choices: ['3 rad/s', '6 rad/s', '9 rad/s', '12 rad/s']
    ans: 2
    why: 'α = τ/I = 3 rad/s², so ω = αt = 9 rad/s.'
  - q: 'The kinetic energy of a solid sphere rolling without slipping is made up of translational and rotational parts in the ratio:'
    choices: ['1 : 1', '5 : 2', '2 : 5', '7 : 2']
    ans: 1
    why: 'Translational ½Mv², rotational ½(⅖MR²)(v/R)² = ⅕Mv². Ratio ½ : ⅕ = 5 : 2.'
sources:
  - 'CBSE Class 11 Physics sample paper design (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 6.** Read the chapter lesson, [System of Particles and Rotational Motion](/learn/courses/ncert-class-11-physics/system-of-particles-and-rotational-motion/), first. Try each question on paper before opening the answer.

<div class="bigidea">Rotation questions become easy when you translate: write the straight-line version, then swap in the twin (F to τ, m to I, v to ω, p to L). Always say about which axis or point you take torque, angular momentum and I.</div>

## How to set out a numerical

1. Draw the body, the axis, and mark every distance from the axis.
2. Choose the law: centre-of-mass formula, τ = rF sin θ, τ = Iα, L = Iω conserved, or energy for rolling.
3. Substitute with units (metres, kg) and give the answer with its unit.

<div class="problem" data-problem="c11p-rot-moi"></div>

<div class="problem" data-problem="c11p-rot-roll"></div>

## 1-mark questions

1. Define the centre of mass of a system of particles.

<details><summary>Answer</summary>The point whose position is the mass-weighted average of the positions of all the particles, X = Σmᵢxᵢ/Σmᵢ, where the whole mass can be imagined to be concentrated for describing the translation.</details>

2. What is the SI unit of torque, and is it the same as the unit of energy?

<details><summary>Answer</summary>N m. It has the same dimensions as energy (joule) but torque is a vector and is not energy, so we do not call it a joule.</details>

3. Write the formula for the moment of inertia of a thin ring about an axis through its centre perpendicular to its plane.

<details><summary>Answer</summary>I = MR².</details>

4. What is the angular momentum of a body when no external torque acts on it?

<details><summary>Answer</summary>It is constant (conserved) in magnitude and direction.</details>

5. Name the quantity in rotation that plays the role of mass.

<details><summary>Answer</summary>Moment of inertia.</details>

## 2- and 3-mark questions

6. (2) A force of 10 N acts along a line passing through the hinge of a door. What is the torque about the hinge? Why?

<details><summary>Answer</summary>Zero. The line of the force passes through the axis, so the lever arm is zero (θ = 0° and sin 0° = 0).</details>

7. (2) Why does a skater spin faster when she pulls her arms in?

<details><summary>Answer</summary>There is no external torque, so L = Iω is constant. Pulling in the arms reduces I, so ω increases.</details>

8. (3) State the principle of moments and use it to find where a 60 kg man must stand on a light 4 m plank resting on a pivot at its centre, to balance a 40 kg boy sitting at one end.

<details><summary>Answer</summary>

For equilibrium the clockwise moments equal the anticlockwise moments about the pivot. The boy’s moment is 40 g × 2 (his end is 2 m from the centre). The man at distance x on the other side: 60 g × x = 40 g × 2, so x = 80/60 = 1.33 m from the pivot.

</details>

9. (3) Find the centre of mass of three particles of 1 kg, 2 kg and 3 kg at the points (0, 0), (3, 0) and (0, 4) in metres.

<details><summary>Answer</summary>

X = (1×0 + 2×3 + 3×0)/6 = 1 m. Y = (1×0 + 2×0 + 3×4)/6 = 2 m. The centre of mass is at (1 m, 2 m).

</details>

10. (3) Why is it easier to turn a nut with a long spanner? Express it with a formula.

<details><summary>Answer</summary>The torque is τ = F r sin θ. With the same force, a longer spanner (larger r) gives a larger torque, so the nut loosens more easily.</details>

11. (2) A ring and a disc of equal mass and radius roll from the top of an incline. Which reaches the bottom first? Give the reason in one line.

<details><summary>Answer</summary>The disc. Its I/MR² = ½ is less than the ring’s 1, so a = g sin θ/(1 + I/MR²) is larger.</details>

12. (3) A wheel of moment of inertia 0.4 kg m² is rotating at 30 rad/s. Find its kinetic energy and its angular momentum.

<details><summary>Answer</summary>

K = ½ I ω² = 0.5 × 0.4 × 900 = 180 J. L = I ω = 0.4 × 30 = 12 kg m²/s.

</details>

## 5-mark questions

13. (5) State and prove the theorem of parallel axes.

<details><summary>Answer</summary>

**Statement.** The moment of inertia of a body about any axis equals its moment of inertia about a parallel axis through the centre of mass plus M d², where d is the distance between the axes: I = I_CM + M d².

**Proof.** Take the CM as the origin and let the axes be perpendicular to the page, the second one at a distance d along the x-axis. A particle mᵢ at (xᵢ, yᵢ) is at distance² rᵢ² = xᵢ² + yᵢ² from the CM axis and (xᵢ − d)² + yᵢ² from the other axis. So

I = Σ mᵢ[(xᵢ − d)² + yᵢ²] = Σ mᵢ(xᵢ² + yᵢ²) − 2d Σ mᵢxᵢ + d² Σ mᵢ.

The first sum is I_CM. Σ mᵢxᵢ = 0, because the origin is the centre of mass. Σ mᵢ = M. Hence I = I_CM + M d².

</details>

14. (5) Derive the moment of inertia of a uniform disc about its axis, and then of a thin ring.

<details><summary>Answer</summary>

**Ring.** All the mass M is at the same distance R from the axis, so I = ΣmR² = MR².

**Disc.** Divide the disc into thin rings of radius r and width dr. Mass per area is M/πR², so the ring’s mass is dm = (M/πR²)(2πr dr) = (2M/R²) r dr, and dI = r² dm = (2M/R²) r³ dr. Then

I = ∫₀ᴿ (2M/R²) r³ dr = (2M/R²)(R⁴/4) = ½ M R².

</details>

15. (5) Obtain the acceleration of a solid cylinder rolling without slipping down an incline of angle θ. Compare it with a block sliding without friction.

<details><summary>Answer</summary>

Forces: weight mg, normal N and static friction f up the slope. Along the slope: m a = m g sin θ − f. About the centre: f R = I α = I a/R, so f = I a/R². Then m a (1 + I/mR²) = m g sin θ, so

a = g sin θ/(1 + I/mR²).

For a solid cylinder I = ½ m R², so a = g sin θ/(1.5) = (2/3) g sin θ. A frictionless block slides with a = g sin θ, which is 1.5 times larger: the cylinder uses part of the energy for spinning.

</details>

## Case-based question

**The potter’s wheel.** A potter’s wheel is a uniform disc of mass 10 kg and radius 0.30 m, spinning at 5 rad/s. The potter places a lump of clay of mass 2 kg on the wheel at a distance 0.20 m from the axis. Treat the clay as a point mass.

(a) Find the moment of inertia of the wheel.

<details><summary>Answer</summary>

I = ½ M R² = 0.5 × 10 × 0.09 = 0.45 kg m².

</details>

(b) What is the initial angular momentum of the wheel?

<details><summary>Answer</summary>

L = I ω = 0.45 × 5 = 2.25 kg m²/s.

</details>

(c) After the clay sticks, what is the new moment of inertia?

<details><summary>Answer</summary>

Clay: m r² = 2 × 0.04 = 0.08 kg m². Total I = 0.45 + 0.08 = 0.53 kg m².

</details>

(d) Find the new angular speed and say whether the kinetic energy changes.

<details><summary>Answer</summary>

Angular momentum is conserved: ω = 2.25/0.53 = 4.25 rad/s. Kinetic energy falls from ½ × 0.45 × 25 = 5.6 J to ½ × 0.53 × 4.25² = 4.8 J: some energy is lost, as in an inelastic collision.

</details>

## Assertion and reason

For each, choose: (a) both true and R explains A; (b) both true but R does not explain A; (c) A true, R false; (d) A false, R true.

16. **A:** The moment of inertia of a body is not a fixed number. **R:** It depends on the position of the axis of rotation.

<details><summary>Answer</summary>(a). I = Σmr² uses distances from the chosen axis, so a different axis gives a different I.</details>

17. **A:** The centre of mass of a body always lies inside the body. **R:** The centre of mass is the average position of the mass.

<details><summary>Answer</summary>(d). A is false: a ring’s centre of mass is in its empty middle. R is true.</details>

18. **A:** A hollow sphere takes longer than a solid sphere to roll down an incline. **R:** The hollow sphere has the larger moment of inertia about its diameter for the same M and R.

<details><summary>Answer</summary>(a). I = ⅔MR² against ⅖MR², so I/MR² is bigger and the acceleration is smaller; it takes longer.</details>

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="system-of-particles-and-rotational-motion" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- X = Σmx/M; M a_CM = F_ext.
- τ = r F sin θ = F × lever arm; L = r p sin θ; τ = dL/dt.
- Equilibrium: ΣF = 0 and Στ = 0.
- I = Σmr²; use I_CM + Md² and I_z = I_x + I_y (flat bodies).
- τ = Iα, K = ½Iω², L = Iω conserved without external torque.
- Rolling: a = g sin θ/(1 + I/MR²); order down a slope: solid sphere, disc, hollow sphere, ring.

</div>
