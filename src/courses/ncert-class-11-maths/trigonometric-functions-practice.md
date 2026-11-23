---
title: 'Trigonometric Functions: practice questions'
seoTitle: 'Trigonometric Functions Class 11 questions with answers'
summary: 'Practice for Class 11 Trigonometric Functions: radians, values, signs, identities, sum and difference formulae and trigonometric equations, 1 to 5 marks.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'The value of sin 75° is:'
    choices: ['(√6 + √2)/4', '(√6 − √2)/4', '(√3 + 1)/2', '1/2']
    ans: 0
    why: 'sin(45° + 30°) = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4.'
  - q: 'An arc of length 11 cm subtends an angle of 0.5 radian at the centre. The radius is:'
    choices: ['22 cm', '5.5 cm', '11.5 cm', '10.5 cm']
    ans: 0
    why: 'From s = rθ: r = s/θ = 11 / 0.5 = 22 cm.'
  - q: 'tan 225° equals:'
    choices: ['1', '−1', '0', 'not defined']
    ans: 0
    why: '225° is in quadrant III with reference angle 45°; tangent is positive there, so tan 225° = tan 45° = 1.'
sources:
  - 'CBSE Class 11 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 3.** Read the lesson, [Trigonometric Functions](/learn/courses/ncert-class-11-maths/trigonometric-functions/), first. Try each question on paper before you open the answer.

<div class="bigidea">Whenever a question gives you an angle, find its quadrant and reference angle first. Whenever it gives a ratio, draw a right triangle (or a point on the unit circle) and read the other ratios off it. Check signs last, using A S T C.</div>

## How to set out answers

1. Convert degrees to radians (× π/180) before using s = rθ.
2. For a value: quadrant, reference angle, exact value, then the sign.
3. For a proof, start from the more complicated side and simplify with known identities.
4. For equations, solve for the principal value(s) and then write the general solution with n an integer.

## 1-mark questions

1. Convert 150° to radians.
<details><summary>Answer</summary>150 × π/180 = 5π/6.</details>

2. Write the value of cos 90°.
<details><summary>Answer</summary>0.</details>

3. What is the period of cosec x?
<details><summary>Answer</summary>2π.</details>

4. State the sign of tan 200°.
<details><summary>Answer</summary>200° is in quadrant III, where tangent is positive.</details>

5. Find sin(−90°).
<details><summary>Answer</summary>sin(−90°) = −sin 90° = −1.</details>

## 2-mark and 3-mark questions

6. Find the length of an arc that subtends 45° at the centre of a circle of radius 14 cm (use π = 22/7). *(3 marks)*
<details><summary>Answer</summary>

`$\theta = 45 \times \pi/180 = \pi/4$` rad. `$s = r\theta = 14 \times \tfrac{22}{7} \times \tfrac14 = 11$` cm.

</details>

7. Find the value of sin 15°. *(3 marks)*
<details><summary>Answer</summary>

`$\sin(45° - 30°) = \sin 45°\cos 30° - \cos 45°\sin 30° = \tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt3}{2} - \tfrac{\sqrt2}{2}\cdot\tfrac12 = \tfrac{\sqrt6 - \sqrt2}{4}$`.

</details>

8. If sin θ = 3/5 and θ is in quadrant II, find cos θ and tan θ. *(3 marks)*
<details><summary>Answer</summary>

`$\cos^2\theta = 1 - \tfrac{9}{25} = \tfrac{16}{25}$`, so `$\cos\theta = \pm\tfrac45$`. Cosine is negative in quadrant II: `$\cos\theta = -\tfrac45$`. Then `$\tan\theta = \tfrac{3/5}{-4/5} = -\tfrac34$`.

</details>

9. Prove that `$\dfrac{\sin 2\theta}{1 + \cos 2\theta} = \tan\theta$`. *(3 marks)*
<details><summary>Answer</summary>

`$\sin 2\theta = 2\sin\theta\cos\theta$` and `$1 + \cos 2\theta = 2\cos^2\theta$`. So the left side is `$\dfrac{2\sin\theta\cos\theta}{2\cos^2\theta} = \dfrac{\sin\theta}{\cos\theta} = \tan\theta$`.

</details>

10. Solve `$2\cos x - 1 = 0$` and write the general solution. *(3 marks)*
<details><summary>Answer</summary>

`$\cos x = \tfrac12 = \cos\tfrac\pi3$`. The general solution of `$\cos x = \cos\alpha$` is `$x = 2n\pi \pm \alpha$`, so `$x = 2n\pi \pm \tfrac\pi3$`, where n is any integer.

</details>

## 5-mark questions (model answers)

11. Derive `$\tan(A + B) = \dfrac{\tan A + \tan B}{1 - \tan A\tan B}$` and use it to find tan 75°. *(5 marks)*
<details><summary>Answer</summary>

`$\tan(A + B) = \dfrac{\sin(A + B)}{\cos(A + B)} = \dfrac{\sin A\cos B + \cos A\sin B}{\cos A\cos B - \sin A\sin B}$`. Divide top and bottom by `$\cos A\cos B$` (assumed non-zero):

`$\tan(A + B) = \dfrac{\tan A + \tan B}{1 - \tan A\tan B}$`.

For 75° = 45° + 30°: `$\tan 75° = \dfrac{1 + \tfrac{1}{\sqrt3}}{1 - \tfrac{1}{\sqrt3}} = \dfrac{\sqrt3 + 1}{\sqrt3 - 1} = \dfrac{(\sqrt3 + 1)^2}{2} = \dfrac{4 + 2\sqrt3}{2} = 2 + \sqrt3$`.

</details>

12. Solve `$2\sin^2 x + \sin x - 1 = 0$` and give the general solution. *(5 marks)*
<details><summary>Answer</summary>

Factorise as a quadratic in `$\sin x$`: `$(2\sin x - 1)(\sin x + 1) = 0$`.

Case 1: `$\sin x = \tfrac12 = \sin\tfrac\pi6$` gives `$x = n\pi + (-1)^n\tfrac\pi6$`.

Case 2: `$\sin x = -1 = \sin\left(-\tfrac\pi2\right)$` gives `$x = n\pi + (-1)^n\left(-\tfrac\pi2\right)$`, which simplifies to `$x = 2n\pi - \tfrac\pi2$`.

The general solution is the union of both families, with n an integer.

</details>

## Case-based question

A Ferris wheel at a fair has radius 10 m and its centre is 12 m above the ground. It turns 3 times a minute, and a seat starting level with the centre has height `$h(t) = 12 + 10\sin(\omega t)$` metres after t seconds.

13. (a) Find ω in rad/s. (b) Find h at t = 5 s. (c) Find the greatest and least heights. (d) After how many seconds does the seat first return to its starting point? *(4 marks)*
<details><summary>Answer</summary>

(a) 3 turns a minute is `$3 \times 2\pi/60 = \pi/10$` rad/s. (b) `$\omega t = \pi/2$`, so `$h = 12 + 10 = 22$` m. (c) Sine runs from −1 to 1: greatest 22 m, least 2 m. (d) One full turn takes `$2\pi / (\pi/10) = 20$` s.

</details>

<div class="problem" data-problem="c11m-trig-compound"></div>

## Assertion and reason

14. **Assertion (A):** The equation sin x = 3 has no real solution. **Reason (R):** The sine of any real number lies between −1 and 1.
<details><summary>Answer</summary>Both true and R explains A (option a).</details>

15. **Assertion (A):** cos(−θ) = cos θ. **Reason (R):** Cosine is an odd function.
<details><summary>Answer</summary>A is true (cosine is an <b>even</b> function). R is false. Option (c).</details>

<div class="problem" data-problem="c11m-trig-radians"></div>

## Question set

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="trigonometric-functions" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Degrees to radians: × π/180. Arc length s = rθ with θ in radians.
- Find the quadrant and reference angle first; signs follow A S T C.
- sin(A ± B) = sin A cos B ± cos A sin B; cos(A ± B) = cos A cos B ∓ sin A sin B; tan(A + B) = (tan A + tan B)/(1 − tan A tan B).
- sin 2θ = 2 sin θ cos θ; cos 2θ = 2cos²θ − 1 = 1 − 2 sin²θ.
- General solutions: sin x = sin α: nπ + (−1)ⁿα; cos x = cos α: 2nπ ± α; tan x = tan α: nπ + α.

</div>
