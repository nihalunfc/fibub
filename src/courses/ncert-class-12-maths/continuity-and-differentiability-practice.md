---
title: 'Continuity and Differentiability: practice questions'
seoTitle: 'Continuity and Differentiability Class 12 questions'
summary: 'Board-style practice for Class 12 Continuity and Differentiability: 1, 2, 3 and 5 mark questions, a case study and assertion-reason items with answers.'
minutes: 75
updated: 2026-11-23
quiz:
  - q: 'The derivative of tan⁻¹(x) is:'
    choices: ['1/(1 + x²)', '1/√(1 − x²)', '−1/(1 + x²)', 'sec²x']
    ans: 0
    why: 'From x = tan y: 1 = sec²y · dy/dx, so dy/dx = 1/(1 + tan²y) = 1/(1 + x²).'
  - q: 'The derivative of eˣ sin x is:'
    choices: ['eˣ(sin x + cos x)', 'eˣ cos x', 'eˣ sin x', 'eˣ(sin x − cos x)']
    ans: 0
    why: 'Product rule: (eˣ)(sin x)′ + (eˣ)′(sin x) = eˣ cos x + eˣ sin x.'
  - q: 'Rolle’s theorem cannot be used for f(x) = |x| on [−1, 1] because:'
    choices: ['f is not differentiable at 0', 'f(−1) ≠ f(1)', 'f is not continuous', 'f is not defined at 1']
    ans: 0
    why: 'f(−1) = f(1) = 1 and f is continuous, but there is a corner at x = 0 where the derivative does not exist.'
sources:
  - 'CBSE Class 12 Mathematics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Maths · Chapter 5.** Read the chapter lesson, [Continuity and Differentiability](/learn/courses/ncert-class-12-maths/continuity-and-differentiability/), first. Try each question on paper before opening the answer. Board marks come for the method, so show every step.

<div class="bigidea">Most questions here are the chain rule in disguise. Before you differentiate, name the outer function and the inner function. For continuity, always write the left-hand limit, the right-hand limit and the value, and compare the three.</div>

## How to set out the answers

1. Continuity at a point: write LHL, RHL and f(a) on separate lines, then compare.
2. Chain rule: write `$u =$` the inner function, differentiate the outer function in `$u$`, then multiply by `$du/dx$`.
3. Implicit: differentiate every term with respect to x (put `$dy/dx$` after every y term), then collect and solve.
4. Say which rule you used (product, quotient, chain, logarithmic) when marks depend on the method.

<div class="problem" data-problem="c12m-cont-findk"></div>

<div class="problem" data-problem="c12m-cont-second"></div>

## 1-mark questions

1. Write the derivative of `$\ln(3x)$`.

<details><summary>Answer</summary>

By the chain rule: `$\dfrac{1}{3x}\times3 = \dfrac1x$`.

</details>

2. State the condition for a function to be continuous at `$x = a$`.

<details><summary>Answer</summary>

`$\lim_{x\to a^-}f(x) = \lim_{x\to a^+}f(x) = f(a)$`.

</details>

3. Is `$f(x) = |x|$` differentiable at 0?

<details><summary>Answer</summary>No. The left derivative is −1 and the right derivative is +1, so there is a corner.</details>

4. Find `$\dfrac{d}{dx}(\sin^{-1}x)$` at `$x = 0$`.

<details><summary>Answer</summary>

`$\dfrac{1}{\sqrt{1-x^2}} = 1$` at `$x = 0$`.

</details>

## 2- and 3-mark questions

5. (2) Differentiate `$y = \sin(3x^2)$`.

<details><summary>Answer</summary>

Let `$u = 3x^2$`: `$dy/dx = \cos u \cdot 6x = 6x\cos(3x^2)$`.

</details>

6. (2) Find `$k$` so that `$f(x) = 2x + k$` for `$x \le 1$` and `$f(x) = 4 - x$` for `$x > 1$` is continuous at `$x = 1$`.

<details><summary>Answer</summary>

LHL = 2 + k, RHL = 4 − 1 = 3. For continuity 2 + k = 3, so k = 1.

</details>

7. (3) If `$x^2 + y^2 = 169$`, find `$\dfrac{dy}{dx}$` at `$(5, 12)$`.

<details><summary>Answer</summary>

`$2x + 2y\,y' = 0$` so `$y' = -x/y = -5/12$`.

</details>

8. (3) Differentiate `$y = x^{\sin x}$` with respect to `$x$`.

<details><summary>Answer</summary>

Take logs: `$\ln y = \sin x \ln x$`. Differentiate: `$\dfrac1y y' = \cos x\ln x + \dfrac{\sin x}{x}$`. So `$y' = x^{\sin x}\left(\cos x\ln x + \dfrac{\sin x}{x}\right)$`.

</details>

9. (3) If `$x = a\cos t$` and `$y = a\sin t$`, show that `$\dfrac{dy}{dx} = -\cot t$`.

<details><summary>Answer</summary>

`$dx/dt = -a\sin t$`, `$dy/dt = a\cos t$`. So `$\dfrac{dy}{dx} = \dfrac{a\cos t}{-a\sin t} = -\cot t$`.

</details>

10. (3) If `$y = \tan^{-1}(2x)$`, find `$\dfrac{d^2y}{dx^2}$`.

<details><summary>Answer</summary>

`$y' = \dfrac{2}{1+4x^2}$`. Differentiate again with the chain rule: `$y'' = \dfrac{-2\cdot8x}{(1+4x^2)^2} = \dfrac{-16x}{(1+4x^2)^2}$`.

</details>

## 5-mark questions

11. Verify the mean value theorem for `$f(x) = x^2 - 4x + 5$` on `$[1, 4]$` and find `$c$`.

<details><summary>Answer</summary>

`$f$` is a polynomial, so it is continuous on `$[1,4]$` and differentiable on `$(1,4)$`.

`$f(1) = 2$`, `$f(4) = 5$`. Chord slope = `$(5-2)/(4-1) = 1$`.

`$f'(c) = 2c - 4 = 1$` gives `$c = 2.5$`, which lies in `$(1, 4)$`. The theorem is verified.

</details>

12. Discuss the continuity and differentiability of `$f(x) = |x - 2|$` at `$x = 2$`.

<details><summary>Answer</summary>

`$f(x) = 2 - x$` for `$x < 2$` and `$x - 2$` for `$x \ge 2$`. LHL = RHL = `$f(2) = 0$`, so `$f$` is continuous at 2.

Left derivative: slope of `$2 - x$` is −1. Right derivative: slope of `$x - 2$` is +1. They differ, so `$f$` is not differentiable at `$x = 2$`.

</details>

## Case-based question

**A drone’s flight.** A delivery drone leaves a rooftop in Bengaluru. For its first 2 minutes it climbs so that its height in metres is `$h(t) = 15t^2 + k t$` and afterwards its height is `$h(t) = 60 + 20(t - 2)$` (for `$t > 2$`, `$t$` in minutes). The flight controller needs the height to have no sudden jump.

13. (a) What is the height at `$t = 2$` from the second formula? (b) For the height to be continuous at `$t = 2$`, find `$k$`. (c) With this `$k$`, is the climb speed continuous at `$t = 2$`? (d) Find the speed just before `$t = 2$`.

<details><summary>Answer</summary>

(a) 60 m.

(b) From the first formula `$h(2) = 60 + 2k$`; equate to 60: `$k = 0$`.

(c) With `$k = 0$`, the speed before is `$h'(t) = 30t$`, which is 60 m/min at `$t = 2$`. The speed after is 20 m/min. They differ, so the speed jumps, even though the height is continuous: `$h$` is continuous but not differentiable at 2.

(d) 60 m/min.

</details>

## Assertion and reason

For each pair choose: (a) both true and R explains A, (b) both true but R does not explain A, (c) A true, R false, (d) A false, R true.

14. **Assertion (A):** `$f(x) = |x|$` is continuous at 0. **Reason (R):** `$f(x) = |x|$` is differentiable at 0.

<details><summary>Answer</summary>(c). A is true (limit 0 from both sides and f(0) = 0). R is false: there is a corner, with slopes −1 and +1.</details>

15. **Assertion (A):** Every differentiable function is continuous. **Reason (R):** If a function has a tangent at a point, it cannot have a gap there.

<details><summary>Answer</summary>(a). Both are true and R explains A.</details>

16. **Assertion (A):** The derivative of `$x^x$` (for `$x > 0$`) is `$x^x(\ln x + 1)$`. **Reason (R):** When x appears in both the base and the exponent, taking logarithms first makes the differentiation possible.

<details><summary>Answer</summary>(a). Both are true and R explains A: `$\ln y = x\ln x$` gives `$y'/y = \ln x + 1$`.</details>

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="continuity-and-differentiability" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Continuity: LHL = RHL = f(a). Differentiable ⇒ continuous, not the reverse.
- Chain rule, implicit (add `$y'$` to every y term), parametric `$\dfrac{dy/dt}{dx/dt}$`, logarithmic for powers like `$x^x$`.
- `$(\sin^{-1}x)' = \dfrac{1}{\sqrt{1-x^2}}$`, `$(\tan^{-1}x)' = \dfrac{1}{1+x^2}$`.
- Rolle: `$f(a) = f(b) \Rightarrow f'(c) = 0$`; MVT: `$f'(c) = \dfrac{f(b)-f(a)}{b-a}$`; check both conditions first.

</div>
