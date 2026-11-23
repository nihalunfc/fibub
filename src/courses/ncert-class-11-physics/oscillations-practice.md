---
title: 'Oscillations: practice questions'
seoTitle: 'Oscillations Class 11 questions with answers'
summary: 'Class 11 Oscillations practice: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full worked answers.'
minutes: 55
updated: 2026-11-23
quiz:
  - q: 'A particle in SHM has amplitude 5 cm and period 2 s. Its maximum speed is:'
    choices: ['5 cm/s', '5π cm/s', '10π cm/s', '2.5π cm/s']
    ans: 1
    why: 'ω = 2π/T = π rad/s, so v_max = ωA = π × 5 = 5π cm/s.'
  - q: 'The kinetic energy of a particle in SHM is equal to its potential energy when its displacement is:'
    choices: ['A/2', 'A/√2', 'A/4', 'A']
    ans: 1
    why: 'K = U means ½k(A² − x²) = ½kx², so x² = A²/2 and x = A/√2.'
  - q: 'A pendulum clock that keeps correct time on Earth is taken to a mountain top, where g is slightly smaller. It will:'
    choices: ['gain time', 'lose time', 'keep correct time', 'stop']
    ans: 1
    why: 'T = 2π√(L/g) rises when g falls, so each swing takes longer and the clock runs slow (loses time).'
sources:
  - 'CBSE Class 11 Physics question paper design (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 13.** Read the lesson, [Oscillations](/learn/courses/ncert-class-11-physics/oscillations/), first. Try each question on paper before opening the answer. Marks go for the law, the formula, the substitution with units and the final answer.

<div class="bigidea">Almost every SHM question is a three-step job: find ω (from T, f or √(k/m) or √(g/L)), choose the right equation (x = A cos ωt, v = ω√(A² − x²), a = −ω²x, E = ½kA²), then substitute. Check units, and use radians on the calculator.</div>

## How to set out a numerical

1. Write what is given (A, T or f, m, k, L, g) in SI units: cm to m, grams to kg.
2. Find ω = 2π/T = 2πf = √(k/m).
3. Pick the equation, substitute with units, and check the answer is sensible (v ≤ ωA, |x| ≤ A).

<div class="problem" data-problem="c11p-osc-period"></div>

<div class="problem" data-problem="c11p-osc-ke"></div>

## 1-mark questions

1. Define the time period of an oscillation.

<details><summary>Answer</summary>The time taken for one complete oscillation, after which the motion repeats itself.</details>

2. What is the phase difference between the displacement and the velocity of a particle in SHM?

<details><summary>Answer</summary>π/2 (90°): the velocity is a quarter of a cycle ahead of the displacement.</details>

3. Give one example of a periodic motion that is not simple harmonic.

<details><summary>Answer</summary>A ball bouncing elastically on the floor, or the Earth going round the Sun. The restoring force is not proportional to displacement.</details>

4. Does the time period of a simple pendulum depend on the mass of its bob?

<details><summary>Answer</summary>No: T = 2π√(L/g) has no mass in it.</details>

## 2- and 3-mark questions

5. (2) A body of mass 0.5 kg oscillates on a spring of stiffness 200 N/m. Find its frequency.

<details><summary>Answer</summary>

`$\omega = \sqrt{k/m} = \sqrt{200/0.5} = 20$` rad/s, so `$f = \omega/2\pi = 20/6.28 = 3.2$` Hz.

</details>

6. (2) A particle in SHM has amplitude 4 cm and time period 2 s. Find its maximum acceleration.

<details><summary>Answer</summary>

`$\omega = 2\pi/2 = \pi$` rad/s. `$a_{\max} = \omega^2A = \pi^2 \times 0.04 = 0.39$` m/s².

</details>

7. (3) Show that the motion of a simple pendulum for small angles is simple harmonic and find its time period.

<details><summary>Answer</summary>

The restoring force along the arc is `$-mg\sin\theta \approx -mg\theta$` for small θ. With arc displacement `$x = L\theta$` this is `$F = -(mg/L)x$`, proportional to x and opposite to it: SHM with `$k = mg/L$`. Hence `$T = 2\pi\sqrt{m/k} = 2\pi\sqrt{L/g}$`.

</details>

8. (3) Two identical springs of stiffness k are joined in series and carry a mass m. Find the period of its oscillation.

<details><summary>Answer</summary>

In series `$1/k_{\text{eff}} = 1/k + 1/k$`, so `$k_{\text{eff}} = k/2$`. Then `$T = 2\pi\sqrt{m/k_{\text{eff}}} = 2\pi\sqrt{2m/k}$`, which is `$\sqrt2$` times the period with one spring.

</details>

9. (3) At what displacement is the kinetic energy of a particle in SHM three times its potential energy?

<details><summary>Answer</summary>

`$K = 3U$` means `$\tfrac12k(A^2-x^2) = 3\cdot\tfrac12kx^2$`, so `$A^2 - x^2 = 3x^2$` and `$x = \pm A/2$`.

</details>

## 5-mark questions

10. (5) Show that simple harmonic motion is the projection of uniform circular motion, and obtain expressions for the displacement, velocity and acceleration.

<details><summary>Answer</summary>

A point P moves on a circle of radius A with constant angular speed ω; at time t its angle is `$\omega t + \varphi$`. Its projection on a diameter has displacement `$x = A\cos(\omega t + \varphi)$`.

The velocity of P is Aω tangent to the circle. Its component along the diameter is `$v = -A\omega\sin(\omega t+\varphi) = \mp\omega\sqrt{A^2-x^2}$`.

The acceleration of P is Aω² towards the centre; along the diameter `$a = -A\omega^2\cos(\omega t+\varphi) = -\omega^2 x$`.

Since a ∝ −x, the projection performs SHM with time period `$T = 2\pi/\omega$`.

</details>

11. (5) Derive an expression for the total energy of a particle in SHM and show that it is constant. Describe how K and U vary with displacement.

<details><summary>Answer</summary>

`$U = \tfrac12kx^2$` and `$v = \omega\sqrt{A^2-x^2}$`, so `$K = \tfrac12mv^2 = \tfrac12m\omega^2(A^2-x^2) = \tfrac12k(A^2-x^2)$` using `$k = m\omega^2$`.

Total: `$E = K+U = \tfrac12k(A^2-x^2)+\tfrac12kx^2 = \tfrac12kA^2$`: it does not contain x or t, so it is constant.

U is a parabola, zero at the middle and E at the ends; K is the inverted parabola, E at the middle and zero at the ends. Each averages E/2.

</details>

## Case-based question

12. (4) **A swing in the village fair.** A swing carrying a child is released from a small angle and returns to the same point every 4.0 s. The chain is 3.9 m long to the seat. The child’s mass is 30 kg.

(a) What is the frequency? (b) Check the period using T = 2π√(L/g) with g = 9.8 m/s². (c) The child’s older brother, of mass 45 kg, sits on the same swing. Does the period change? (d) A friend pushes the swing in time with its natural rhythm. What is this called, and why does the swing go high?

<details><summary>Answer</summary>

(a) f = 1/T = 0.25 Hz.

(b) `$T = 2\pi\sqrt{3.9/9.8} = 2\pi \times 0.63 = 3.96$` s, which matches 4.0 s.

(c) No: the period does not depend on the mass.

(d) **Resonance.** Each push is applied in phase with the motion, so the energy added in every push builds up the amplitude.

</details>

## Assertion and reason

13. **Assertion (A):** The time period of a spring-mass system does not change when the amplitude is changed. **Reason (R):** For SHM the restoring force is proportional to displacement.

<details><summary>Answer</summary>(a) Both true, R explains A: T = 2π√(m/k) depends only on m and k, which follows from F = −kx.</details>

14. **Assertion (A):** At the extreme position of SHM the acceleration of the particle is zero. **Reason (R):** At the extreme position the velocity is zero.

<details><summary>Answer</summary>(d) A is false: a = −ω²A is a maximum at the extremes. R is true.</details>

15. **Assertion (A):** A very lightly damped system shows a tall, sharp resonance peak. **Reason (R):** Less energy is lost to damping in each cycle, so the driver can build up a larger amplitude.

<details><summary>Answer</summary>(a) Both true and R explains A.</details>

## Mix of questions from the bank

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="oscillations" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- ω = 2π/T = √(k/m) = √(g/L); x = A cos(ωt + φ); v = ±ω√(A² − x²); a = −ω²x.
- E = ½kA²; K = ½k(A² − x²); U = ½kx²; K = U at x = A/√2.
- T = 2π√(m/k), T = 2π√(L/g). Springs: series 1/k₁ + 1/k₂, parallel k₁ + k₂.
- Damping: amplitude A e<sup>−bt/2m</sup>; critical b = 2√(km). Resonance at ω<sub>d</sub> = ω₀.

</div>
