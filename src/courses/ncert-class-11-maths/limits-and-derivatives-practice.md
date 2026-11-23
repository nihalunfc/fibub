---
title: 'Limits and Derivatives: practice questions'
seoTitle: 'Limits and Derivatives Class 11 questions with answers'
summary: 'Practice for Class 11 Limits and Derivatives: limits, sin x / x, first principles, product and quotient rules, with 1 to 5 mark and case questions.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'The limit of (x³ − 8)/(x − 2) as x → 2 is:'
    choices: ['12', '8', '0', '6']
    ans: 0
    why: 'x³ − 8 = (x − 2)(x² + 2x + 4); after cancelling, substitute x = 2: 4 + 4 + 4 = 12.'
  - q: 'The derivative of x² sin x is:'
    choices: ['2x sin x + x² cos x', '2x cos x', 'x² cos x', '2x sin x − x² cos x']
    ans: 0
    why: 'Product rule: (x²)′ sin x + x² (sin x)′ = 2x sin x + x² cos x.'
  - q: 'The slope of the tangent to y = x² − 4x at x = 3 is:'
    choices: ['2', '5', '−3', '0']
    ans: 0
    why: 'y′ = 2x − 4, and at x = 3 this is 6 − 4 = 2.'
sources:
  - 'CBSE Class 11 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Maths · Chapter 12.** Read the lesson, [Limits and Derivatives](/learn/courses/ncert-class-11-maths/limits-and-derivatives/), first. Try each question on paper before you open the answer.

<div class="bigidea">For a limit, substitute first. If you get 0/0, factorise or rationalise to remove the troublemaking factor and substitute again. For a derivative, decide whether it is a sum, a product or a quotient before you start, and write the rule you use.</div>

## How to set out answers

1. For a limit, write the first substitution (so the marker sees where 0/0 appears), then the rewritten expression, then the value.
2. For trigonometric limits, adjust the expression so that the angle in the sine equals the quantity underneath, and say that `$\sin u / u \to 1$`.
3. For a derivative from first principles, write the difference quotient, simplify, cancel `$h$`, then take `$h \to 0$`.
4. For product and quotient rules, write `$u$`, `$v$`, `$u'$` and `$v'$` on separate lines first.

## 1-mark questions

1. Find `$\displaystyle\lim_{x \to 3}(2x^2 - x + 1)$`.
<details><summary>Answer</summary>

A polynomial: substitute `$x = 3$` to get `$18 - 3 + 1 = 16$`.

</details>

2. What is the derivative of `$x^{10}$`?
<details><summary>Answer</summary>

`$10x^9$`.

</details>

3. Find `$\dfrac{d}{dx}(\cos x)$`.
<details><summary>Answer</summary>

`$-\sin x$`.

</details>

4. Find `$\displaystyle\lim_{x \to 0}\dfrac{\sin 7x}{x}$`.
<details><summary>Answer</summary>

`$7$`.

</details>

5. True or false: if `$f$` is differentiable at `$a$`, it is continuous at `$a$`.
<details><summary>Answer</summary>

True. (The converse is false: `$|x|$` is continuous at 0 but not differentiable there.)

</details>

<div class="problem" data-problem="c11m-lim-cube"></div>

## 2-mark and 3-mark questions

6. Evaluate `$\displaystyle\lim_{x \to 4}\dfrac{x^2 - 16}{x - 4}$`. *(2 marks)*
<details><summary>Answer</summary>

Substituting gives 0/0. Factorise: `$\dfrac{(x - 4)(x + 4)}{x - 4} = x + 4$` for `$x \ne 4$`. So the limit is `$8$`.

</details>

7. Evaluate `$\displaystyle\lim_{x \to 0}\dfrac{\sqrt{4 + x} - 2}{x}$`. *(3 marks)*
<details><summary>Answer</summary>

It is 0/0. Multiply top and bottom by `$\sqrt{4 + x} + 2$`: the top becomes `$(4 + x) - 4 = x$`, so the fraction is `$\dfrac{x}{x(\sqrt{4 + x} + 2)} = \dfrac{1}{\sqrt{4 + x} + 2}$`.

At `$x = 0$` this is `$\dfrac{1}{4}$`. The limit is `$\dfrac14$`.

</details>

8. Evaluate `$\displaystyle\lim_{x \to 0}\dfrac{\sin 3x}{\sin 5x}$`. *(3 marks)*
<details><summary>Answer</summary>

`$\dfrac{\sin 3x}{\sin 5x} = \dfrac{3x}{5x}\cdot\dfrac{\sin 3x}{3x}\cdot\dfrac{5x}{\sin 5x} = \dfrac35 \cdot \dfrac{\sin 3x}{3x}\cdot\dfrac{5x}{\sin 5x}$`.

The two fractions tend to 1 as `$x \to 0$`, so the limit is `$\dfrac35$`.

</details>

9. Show that `$\displaystyle\lim_{x \to 0}\dfrac{|x|}{x}$` does not exist. *(2 marks)*
<details><summary>Answer</summary>

For `$x > 0$`, `$|x|/x = 1$`, so the right-hand limit is 1. For `$x < 0$`, `$|x|/x = -1$`, so the left-hand limit is `$-1$`. The two one-sided limits differ, so the limit does not exist.

</details>

10. Find `$f'(x)$` for `$f(x) = 3x^4 - 2x^2 + 5x - 7$` and then `$f'(1)$`. *(2 marks)*
<details><summary>Answer</summary>

`$f'(x) = 12x^3 - 4x + 5$`. At `$x = 1$`: `$12 - 4 + 5 = 13$`.

</details>

<div class="problem" data-problem="c11m-lim-deriv"></div>

11. Differentiate `$\sin x \cos x$` using the product rule. *(3 marks)*
<details><summary>Answer</summary>

`$u = \sin x$`, `$v = \cos x$`, `$u' = \cos x$`, `$v' = -\sin x$`. So `$(uv)' = \cos x\cos x + \sin x(-\sin x) = \cos^2 x - \sin^2 x$` (which equals `$\cos 2x$`).

</details>

12. Differentiate `$\dfrac{1}{x^2 + 1}$` using the quotient rule. *(3 marks)*
<details><summary>Answer</summary>

`$u = 1$`, `$v = x^2 + 1$`, `$u' = 0$`, `$v' = 2x$`. So the derivative is `$\dfrac{0\cdot(x^2 + 1) - 1\cdot 2x}{(x^2 + 1)^2} = \dfrac{-2x}{(x^2 + 1)^2}$`.

</details>

<div class="problem" data-problem="c11m-lim-quad"></div>

## 5-mark questions

13. Find the derivative of `$f(x) = x^3$` from first principles. *(5 marks)*
<details><summary>Answer</summary>

`$f'(x) = \lim_{h \to 0}\dfrac{(x + h)^3 - x^3}{h}$`.

Expand: `$(x + h)^3 = x^3 + 3x^2h + 3xh^2 + h^3$`, so the top is `$3x^2h + 3xh^2 + h^3 = h(3x^2 + 3xh + h^2)$`.

Cancel `$h$` (as `$h \ne 0$`): `$3x^2 + 3xh + h^2$`.

Let `$h \to 0$`: `$f'(x) = 3x^2$`.

</details>

14. Find `$\displaystyle\lim_{x \to 0}\dfrac{1 - \cos 4x}{x^2}$`, showing every step. *(5 marks)*
<details><summary>Answer</summary>

Use `$1 - \cos u = 2\sin^2\dfrac{u}{2}$` with `$u = 4x$`: `$1 - \cos 4x = 2\sin^2 2x$`.

So the fraction is `$\dfrac{2\sin^2 2x}{x^2} = 2\cdot 4\cdot\left(\dfrac{\sin 2x}{2x}\right)^2 = 8\left(\dfrac{\sin 2x}{2x}\right)^2$`.

As `$x \to 0$`, `$\dfrac{\sin 2x}{2x} \to 1$`, so the limit is `$8$`.

</details>

15. Prove that `$\dfrac{d}{dx}(\sin x) = \cos x$` from first principles. *(5 marks)*
<details><summary>Answer</summary>

`$f'(x) = \lim_{h \to 0}\dfrac{\sin(x + h) - \sin x}{h}$`.

Use `$\sin A - \sin B = 2\cos\dfrac{A + B}{2}\sin\dfrac{A - B}{2}$`: the top is `$2\cos\left(x + \dfrac h2\right)\sin\dfrac h2$`.

So the quotient is `$\cos\left(x + \dfrac h2\right)\cdot\dfrac{\sin(h/2)}{h/2}$`.

As `$h \to 0$`, `$\cos(x + h/2) \to \cos x$` and `$\dfrac{\sin(h/2)}{h/2} \to 1$`. So `$f'(x) = \cos x$`.

</details>

<div class="problem" data-problem="c11m-lim-product"></div>

## Case-based question

A ball is thrown straight up from a balcony. Its height in metres after `$t$` seconds is `$s(t) = 20t - 5t^2 + 15$`.

(a) Find the velocity `$v(t) = s'(t)$`.
<details><summary>Answer</summary>

`$s'(t) = 20 - 10t$` m/s.

</details>

(b) Find the velocity at `$t = 1$` and `$t = 3$`, and say what the signs mean.
<details><summary>Answer</summary>

`$v(1) = 10$` m/s (moving up); `$v(3) = -10$` m/s (moving down).

</details>

(c) When is the ball momentarily at rest, and what is the highest point?
<details><summary>Answer</summary>

`$v = 0$` gives `$t = 2$` s. Height `$s(2) = 40 - 20 + 15 = 35$` m.

</details>

(d) Why must the derivative be zero at the highest point?
<details><summary>Answer</summary>At the top the height graph has a flat tangent: the ball stops rising before it starts falling, so the rate of change of height is zero.</details>

## Assertion and reason

Options: (A) Both A and R are true and R explains A. (B) Both true but R does not explain A. (C) A is true, R is false. (D) A is false, R is true.

16. **Assertion:** `$\displaystyle\lim_{x \to 2}\dfrac{x^2 - 4}{x - 2} = 4$` even though the expression is not defined at `$x = 2$`. **Reason:** A limit depends on values near the point, not at the point.
<details><summary>Answer</summary>

(A). Cancelling gives `$x + 2 \to 4$`. Both statements are true and R explains A.

</details>

17. **Assertion:** `$f(x) = |x|$` is not differentiable at 0. **Reason:** The slopes from the left and from the right at 0 are `$-1$` and `$1$`.
<details><summary>Answer</summary>(A). Both true: the two one-sided slopes differ, so there is no single tangent.</details>

18. **Assertion:** `$\displaystyle\lim_{x \to 0}\dfrac{\sin x}{x} = 1$` when `$x$` is in degrees. **Reason:** The inequality `$\sin x < x < \tan x$` holds for small positive `$x$` in radians.
<details><summary>Answer</summary>

(D). A is false: in degrees the limit is `$\pi/180$`. R is true, and it is the reason the proof needs radians.

</details>

<div class="qbank" data-bank="ncert-class-11-maths" data-topics="limits-and-derivatives" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Substitute first; if 0/0, factorise or rationalise, then substitute again.
- The limit exists only when the left and right limits are equal.
- `$\sin x / x \to 1$` in radians; `$\sin kx / x \to k$`; `$(1 - \cos kx)/x^2 \to k^2/2$`.
- First principles: write `$[f(x + h) - f(x)]/h$`, simplify, cancel `$h$`, then let `$h \to 0$`.
- `$(uv)' = u'v + uv'$` and `$(u/v)' = (u'v - uv')/v^2$`.

</div>
