---
title: 'Maths: inverse trigonometric functions'
seoTitle: 'Inverse trigonometric functions for CUET Maths'
summary: 'Why sine needs a restricted domain to have an inverse, the principal value branches of all six inverse functions, and the identities CUET tests, with a live principal value problem.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: 'The principal value of sin⁻¹(−½) is:'
    choices: ['−π/6', '7π/6', '5π/6']
    ans: 0
    why: 'The range of sin⁻¹ is [−π/2, π/2]; the angle there with sine −½ is −π/6.'
  - q: 'cos⁻¹(−x) equals:'
    choices: ['π − cos⁻¹x', '−cos⁻¹x', 'cos⁻¹x']
    ans: 0
    why: 'cos⁻¹ has range [0, π]; reflecting x to −x reflects the angle about π/2.'
  - q: 'sin⁻¹x + cos⁻¹x equals:'
    choices: ['π/2', 'π', '0']
    ans: 0
    why: 'If sin θ = x then cos(π/2 − θ) = x, so the two angles add to π/2 (for x in [−1, 1]).'
sources:
  - 'NCERT, Mathematics Part I (Class 12), Inverse Trigonometric Functions'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 16 minutes.** By the end you will give principal values quickly and use the standard identities. Read first: [relations and functions](/learn/courses/cuet/maths-relations-functions/), for why a function needs to be one-one to have an inverse.

<div class="bigidea">Sine repeats forever, so it is not one-one and has no inverse on all of R. Cut it down to one stretch where it rises from −1 to 1 exactly once, and on that stretch it does have an inverse. That stretch is the principal value branch.</div>

**Everyday picture:** a clock's hand. "The hand points at 3" does not tell you how many full turns it has made. Agreeing to give the answer within one fixed turn makes the reading unique, which is what principal values do for angles.

## 1. The six branches

| Function | Domain | Principal range |
|---|---|---|
| sin⁻¹x | [−1, 1] | [−π/2, π/2] |
| cos⁻¹x | [−1, 1] | [0, π] |
| tan⁻¹x | R | (−π/2, π/2) |
| cot⁻¹x | R | (0, π) |
| sec⁻¹x | \|x\| ≥ 1 | [0, π] − {π/2} |
| cosec⁻¹x | \|x\| ≥ 1 | [−π/2, π/2] − {0} |

<div class="steps" data-title="Finding sin⁻¹(sin 150°)">
<div class="step"><b>Trap:</b> the answer is not 150°, because 150° is outside [−90°, 90°].</div>
<div class="step"><b>Find another angle with the same sine:</b> sin 150° = sin(180° − 150°) = sin 30°.</div>
<div class="step"><b>Check the range:</b> 30° is inside [−90°, 90°].</div>
<div class="step"><b>Answer:</b> 30°, that is π/6.</div>
</div>

<div class="problem" data-problem="inverse-trig-value"></div>

## 2. Identities to know

```math
\sin^{-1}x + \cos^{-1}x = \tfrac{\pi}{2} \qquad \tan^{-1}x + \cot^{-1}x = \tfrac{\pi}{2} \qquad \sin^{-1}(-x) = -\sin^{-1}x \qquad \cos^{-1}(-x) = \pi - \cos^{-1}x
```

<div class="meaning">

<dl>
<dt>Odd functions</dt><dd>sin⁻¹, tan⁻¹ and cosec⁻¹: f(−x) = −f(x).</dd>
<dt>The others</dt><dd>cos⁻¹, cot⁻¹ and sec⁻¹: f(−x) = π − f(x), because their ranges are centred on π/2.</dd>
<dt>Reciprocals</dt><dd>cosec⁻¹x = sin⁻¹(1/x), sec⁻¹x = cos⁻¹(1/x).</dd>
</dl>

</div>

<div class="myth">

**"sin⁻¹x means 1/sin x."** It means the angle whose sine is x. The reciprocal is (sin x)⁻¹ = cosec x.

</div>

## 3. Practice

Practice for this chapter comes from the trigonometry set while the dedicated inverse-trig questions are being written.

<div class="qbank" data-bank="entrance-maths" data-topics="trigonometry" data-level="1,2,3" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Ranges: sin⁻¹ [−π/2, π/2], cos⁻¹ [0, π], tan⁻¹ (−π/2, π/2).
- sin⁻¹(sin x) = x only when x is in the principal range.
- sin⁻¹x + cos⁻¹x = tan⁻¹x + cot⁻¹x = π/2.
- f(−x) = −f(x) for sin⁻¹, tan⁻¹; π − f(x) for cos⁻¹, cot⁻¹.

</div>
