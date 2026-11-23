---
title: 'Inverse Trigonometric Functions: practice questions'
seoTitle: 'Inverse Trigonometric Functions Class 12 questions'
summary: 'Practice for Class 12 Inverse Trigonometric Functions: principal values, sin⁻¹(sin x), sum formulas and simplification, with 1 to 5 mark and case questions.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'The value of cos⁻¹(−1/2) is:'
    choices: ['2π/3', 'π/3', '−π/3', '−2π/3']
    ans: 0
    why: 'cos(2π/3) = −1/2 and 2π/3 lies in [0, π], the range of cos⁻¹.'
  - q: 'tan⁻¹ 1 + tan⁻¹ 2 + tan⁻¹ 3 equals:'
    choices: ['π', 'π/2', '3π/4', '2π']
    ans: 0
    why: 'tan⁻¹2 + tan⁻¹3 = 3π/4 (xy = 6 > 1, so add π to −π/4), and tan⁻¹1 = π/4. The total is π.'
  - q: 'Which statement is true?'
    choices: ['tan⁻¹(tan x) = x for x in (−π/2, π/2)', 'sin⁻¹(sin x) = x for all real x', 'cos⁻¹(cos x) = x for x in [π, 2π]', 'sin(sin⁻¹ 3) = 3']
    ans: 0
    why: 'Only inside the principal branch does applying the inverse after the function return x. sin⁻¹3 does not exist, and the other two fail outside their ranges.'
sources:
  - 'CBSE Class 12 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Maths · Chapter 2.** Read the lesson, [Inverse Trigonometric Functions](/learn/courses/ncert-class-12-maths/inverse-trigonometric-functions/), first. Try each question on paper before you open the answer.

<div class="bigidea">Before any answer, write the principal branch of the function you are using. Check the answer lies in it. If a trigonometric function sits inside an inverse, first bring the angle into the branch, then read off the answer.</div>

## How to set out answers

1. Write the principal range of the inverse function you use.
2. For `$\sin^{-1}(\sin x)$` style questions, find the angle in the range with the same value, and state it.
3. For sums, check the condition (for example `$xy < 1$`) before using the formula, and add or subtract `$\pi$` if it fails.
4. Give answers in radians in terms of `$\pi$` unless asked otherwise.

## 1-mark questions

1. Write the domain and range of `$\sin^{-1}$`.
<details><summary>Answer</summary>Domain `$[-1, 1]$`; range `$[-\pi/2, \pi/2]$`.</details>

2. Find `$\cos^{-1}(-1)$`.
<details><summary>Answer</summary>`$\pi$`, since `$\cos\pi = -1$` and `$\pi \in [0, \pi]$`.</details>

3. Find `$\tan^{-1}(\sqrt3)$`.
<details><summary>Answer</summary>`$\pi/3$`.</details>

4. Is `$\sin(\sin^{-1}2) = 2$`?
<details><summary>Answer</summary>No. `$\sin^{-1}2$` is not defined because 2 is outside `$[-1, 1]$`.</details>

5. Find `$\sin^{-1}x + \cos^{-1}x$` for `$x \in [-1, 1]$`.
<details><summary>Answer</summary>`$\pi/2$`.</details>

## 2-mark and 3-mark questions

6. Find the principal value of `$\sin^{-1}\left(\sin\dfrac{2\pi}{3}\right)$`. *(2 marks)*
<details><summary>Answer</summary>

`$\sin\frac{2\pi}{3} = \sin\frac{\pi}{3}$`, and `$\frac{\pi}{3}$` lies in `$[-\frac{\pi}{2}, \frac{\pi}{2}]$`. So the value is `$\frac{\pi}{3}$`.

</details>

7. Find `$\cos^{-1}\left(\cos\dfrac{7\pi}{6}\right)$`. *(2 marks)*
<details><summary>Answer</summary>

`$\cos\frac{7\pi}{6} = \cos\left(2\pi - \frac{7\pi}{6}\right) = \cos\frac{5\pi}{6}$` and `$\frac{5\pi}{6} \in [0, \pi]$`. So the value is `$\frac{5\pi}{6}$`.

</details>

8. Evaluate `$\cos\left(\sin^{-1}\dfrac{5}{13}\right)$`. *(2 marks)*
<details><summary>Answer</summary>

A right triangle with opposite side 5 and hypotenuse 13 has adjacent side `$\sqrt{169 - 25} = 12$`. So `$\cos\theta = \frac{12}{13}$`.

</details>

9. Evaluate `$\tan^{-1}\dfrac13 + \tan^{-1}\dfrac12$`. *(3 marks)*
<details><summary>Answer</summary>

`$xy = \frac16 < 1$`, so the sum is `$\tan^{-1}\frac{1/3 + 1/2}{1 - 1/6} = \tan^{-1}\frac{5/6}{5/6} = \tan^{-1}1 = \frac{\pi}{4}$`.

</details>

10. Prove `$\sin^{-1}\dfrac35 + \sin^{-1}\dfrac45 = \dfrac{\pi}{2}$`. *(3 marks)*
<details><summary>Answer</summary>

Let `$\theta = \sin^{-1}\frac45$`. A right triangle with opposite 4 and hypotenuse 5 has adjacent 3, so `$\cos\theta = \frac35$` and `$\theta = \cos^{-1}\frac35$`. Hence the sum is `$\sin^{-1}\frac35 + \cos^{-1}\frac35 = \frac{\pi}{2}$`.

</details>

11. Write `$\tan^{-1}\dfrac{x}{\sqrt{1 - x^2}}$`, for `$-1 < x < 1$`, in the simplest form. *(3 marks)*
<details><summary>Answer</summary>

Put `$x = \sin\theta$`, `$\theta \in (-\frac{\pi}{2}, \frac{\pi}{2})$`. Then `$\sqrt{1 - x^2} = \cos\theta$` (positive) and the fraction is `$\tan\theta$`. So the expression is `$\tan^{-1}\tan\theta = \theta = \sin^{-1}x$`.

</details>

<div class="problem" data-problem="c12m-itrig-tansum"></div>

<div class="problem" data-problem="c12m-itrig-double"></div>

## 5-mark questions

12. Prove that `$2\tan^{-1}\dfrac12 = \tan^{-1}\dfrac43$`, and hence evaluate `$2\tan^{-1}\dfrac12 + \tan^{-1}\dfrac17$`. *(5 marks)*
<details><summary>Answer</summary>

With `$x = \frac12$`, `$\lvert x \rvert < 1$`, so `$2\tan^{-1}x = \tan^{-1}\frac{2x}{1 - x^2} = \tan^{-1}\frac{1}{3/4} = \tan^{-1}\frac43$`.

Now `$\tan^{-1}\frac43 + \tan^{-1}\frac17$`: `$xy = \frac{4}{21} < 1$`, so the sum is `$\tan^{-1}\frac{4/3 + 1/7}{1 - 4/21} = \tan^{-1}\frac{31/21}{17/21} = \tan^{-1}\frac{31}{17}$`.

So the value is `$\tan^{-1}\frac{31}{17}$`.

</details>

13. Show that `$\tan^{-1}2 + \tan^{-1}3 = \dfrac{3\pi}{4}$`. Why does the formula `$\tan^{-1}\frac{x+y}{1-xy}$` alone not work? *(5 marks)*
<details><summary>Answer</summary>

Here `$x = 2$`, `$y = 3$`, `$xy = 6 > 1$`. The formula gives `$\tan^{-1}\frac{5}{-5} = \tan^{-1}(-1) = -\frac{\pi}{4}$`.

But `$\tan^{-1}2$` and `$\tan^{-1}3$` are both positive (about 63.4° and 71.6°), so their sum is positive and larger than `$\frac{\pi}{2}$`. The formula's answer lies in `$(-\frac{\pi}{2}, \frac{\pi}{2})$`, so it is short by `$\pi$`. Adding `$\pi$`: `$\pi - \frac{\pi}{4} = \frac{3\pi}{4}$`, about 135°, which matches 63.4° + 71.6°.

</details>

## Case-based question

14. A student draws the graph of `$y = \sin^{-1}(\sin x)$` for `$x$` from `$-2\pi$` to `$2\pi$` using a graphing tool and gets a zig-zag line between `$-\frac{\pi}{2}$` and `$\frac{\pi}{2}$`. *(4 marks)*

(a) What is the value of `$y$` at `$x = \frac{\pi}{6}$`? (b) What is it at `$x = \frac{5\pi}{6}$`? (c) For which `$x$` in `$[-\pi, \pi]$` does the graph coincide with `$y = x$`? (d) Why is the graph not a straight line?

<details><summary>Answer</summary>

(a) `$\frac{\pi}{6}$`, since it is in the principal range.

(b) `$\sin\frac{5\pi}{6} = \frac12$`, and the principal angle is `$\frac{\pi}{6}$`. So `$y = \frac{\pi}{6}$`.

(c) For `$x \in [-\frac{\pi}{2}, \frac{\pi}{2}]$`.

(d) Sine repeats and `$\sin^{-1}$` can only return an angle in `$[-\frac{\pi}{2}, \frac{\pi}{2}]$`, so after `$\frac{\pi}{2}$` the graph turns back down (`$y = \pi - x$`) and keeps zig-zagging with period `$2\pi$`.

</details>

## Assertion and reason

For each, choose: (A) both true and R explains A, (B) both true but R does not explain A, (C) A true and R false, (D) A false and R true.

15. **Assertion:** `$\sin^{-1}(\sin\frac{5\pi}{6}) = \frac{\pi}{6}$`. **Reason:** The range of `$\sin^{-1}$` is `$[-\frac{\pi}{2}, \frac{\pi}{2}]$`.
<details><summary>Answer</summary>(A). The answer must lie in the range, and `$\frac{\pi}{6}$` is the only angle there with sine `$\frac12$`.</details>

16. **Assertion:** `$\cos^{-1}(\cos x) = x$` for every real `$x$`. **Reason:** `$\cos^{-1}(\cos x) = x$` only when `$x \in [0, \pi]$`.
<details><summary>Answer</summary>(D). The assertion is false (for example `$\cos^{-1}(\cos 2\pi) = 0$`); the reason is true.</details>

17. **Assertion:** `$\tan^{-1}x + \tan^{-1}y = \tan^{-1}\frac{x+y}{1-xy}$` for all `$x, y$`. **Reason:** `$\tan(A + B) = \frac{\tan A + \tan B}{1 - \tan A\tan B}$`.
<details><summary>Answer</summary>(D). The assertion is false when `$xy > 1$` (the left side can exceed the range of `$\tan^{-1}$`); the reason is a true identity.</details>

## Question set

Mix of 1-mark to 5-mark problems from the chapter's bank, with fresh numbers:

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="inverse-trigonometric-functions" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Always name the principal branch first; the answer must lie in it.
- For `$\sin^{-1}(\sin x)$`, move `$x$` into `$[-\frac{\pi}{2}, \frac{\pi}{2}]$` by using `$\pi - x$` or `$x - 2\pi$` and so on.
- `$\sin^{-1}x + \cos^{-1}x = \frac{\pi}{2}$`; `$\tan^{-1}x + \cot^{-1}x = \frac{\pi}{2}$`.
- `$\tan^{-1}x + \tan^{-1}y$` needs the `$xy < 1$` check; otherwise add or subtract `$\pi$`.
- Substitute `$x = \tan\theta$`, `$\sin\theta$` or `$\cos\theta$` to simplify roots and fractions.

</div>
