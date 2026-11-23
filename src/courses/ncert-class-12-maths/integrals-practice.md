---
title: 'Integrals: practice questions'
seoTitle: 'Integrals Class 12 questions with answers'
summary: 'Board-style practice for Class 12 Integrals: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full worked answers.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'The value of ∫ from 0 to 1 of x e^(x²) dx is:'
    choices: ['(e − 1)/2', 'e − 1', 'e/2', '1/2']
    ans: 0
    why: 'Put u = x², du = 2x dx. The integral is ½ ∫₀¹ eᵘ du = ½(e − 1).'
  - q: 'The integral of 1/(x² + 9) dx is:'
    choices: ['(1/3) tan⁻¹(x/3) + C', '3 tan⁻¹(3x) + C', 'tan⁻¹(x/3) + C', '(1/9) tan⁻¹(x/9) + C']
    ans: 0
    why: 'With a = 3, ∫dx/(x² + a²) = (1/a) tan⁻¹(x/a) = (1/3) tan⁻¹(x/3).'
  - q: 'If f is an odd function, then ∫ from −a to a of f(x) dx equals:'
    choices: ['0', '2 ∫₀ᵃ f(x) dx', 'f(a)', 'a']
    ans: 0
    why: 'The area on the left of the y-axis is the negative of the area on the right, so they cancel.'
sources:
  - 'CBSE Class 12 Mathematics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Maths · Chapter 7.** Read the chapter lesson, [Integrals](/learn/courses/ncert-class-12-maths/integrals/), first. Try each question on paper before opening the answer. Marks go for choosing the right method, every step of the substitution or parts, the limits, and the final answer.

<div class="bigidea">Most integrals are solved by asking the same four questions in order: is it a standard form, is there a function and its derivative (substitution), is the denominator factorised (partial fractions), or is it a product of different kinds (parts)? For definite integrals, look for symmetry before you integrate.</div>

## How to set out an integral

1. Name the method in words ("put u = x²"), then write du in terms of dx.
2. For a definite integral change the limits with the variable, or return to x before using the old limits.
3. Show the antiderivative in square brackets with the limits: `$\Big[\ \Big]_a^b$`.
4. Check by differentiating (indefinite) or by a quick area estimate (definite).

<div class="problem" data-problem="c12m-int-power"></div>

<div class="problem" data-problem="c12m-int-parts"></div>

## 1-mark questions

1. Write `$\int \frac{1}{x}\,dx$`.

<details><summary>Answer</summary>ln |x| + C.</details>

2. Find `$\int \sec^2 x\,dx$`.

<details><summary>Answer</summary>tan x + C.</details>

3. What is `$\int_{-3}^{3} x^5\,dx$`?

<details><summary>Answer</summary>0, because x⁵ is an odd function.</details>

4. If `$\int_0^a f(x)\,dx = 7$` and `$\int_a^b f(x)\,dx = 5$`, find `$\int_0^b f(x)\,dx$`.

<details><summary>Answer</summary>7 + 5 = 12 (splitting the limits at a).</details>

## 2-mark and 3-mark questions

5. Evaluate `$\int (3x^2 - \frac{4}{x} + e^x)\,dx$`.

<details><summary>Answer</summary>

Integrate term by term: `$x^3 - 4\ln|x| + e^x + C$`.

</details>

6. Evaluate `$\int \frac{2x}{1 + x^2}\,dx$`.

<details><summary>Answer</summary>

The top is the derivative of the bottom. Put `$u = 1 + x^2$`, `$du = 2x\,dx$`: `$\int du/u = \ln|u| + C = \ln(1 + x^2) + C$` (no modulus needed since 1 + x² > 0).

</details>

7. Find `$\int x\ln x\,dx$`.

<details><summary>Answer</summary>

By parts with `$u = \ln x$`, `$dv = x\,dx$`, so `$du = dx/x$`, `$v = x^2/2$`.

`$\int x\ln x\,dx = \frac{x^2}{2}\ln x - \int \frac{x}{2}\,dx = \frac{x^2}{2}\ln x - \frac{x^2}{4} + C$`.

</details>

8. Evaluate `$\int_0^{1} \frac{dx}{1 + x^2}$`.

<details><summary>Answer</summary>

`$[\tan^{-1}x]_0^1 = \tfrac\pi4 - 0 = \tfrac\pi4$`.

</details>

9. Evaluate `$\int \frac{dx}{(x - 1)(x - 2)}$`.

<details><summary>Answer</summary>

Write `$\frac{1}{(x-1)(x-2)} = \frac{A}{x-1} + \frac{B}{x-2}$`. Cover-up: `$A = \frac{1}{1-2} = -1$`, `$B = \frac{1}{2-1} = 1$`.

The integral is `$-\ln|x-1| + \ln|x-2| + C = \ln\left|\frac{x-2}{x-1}\right| + C$`.

</details>

10. Using properties of definite integrals, evaluate `$\int_{-\pi/2}^{\pi/2} \sin^3 x\,dx$`.

<details><summary>Answer</summary>

`$\sin^3 x$` is odd (sin is odd, and an odd power of an odd function is odd), and the limits are symmetric, so the integral is 0.

</details>

## 5-mark questions

11. Evaluate `$\int_0^{\pi/2} \frac{\sin x}{\sin x + \cos x}\,dx$`.

<details><summary>Answer</summary>

Let `$I = \int_0^{\pi/2}\frac{\sin x}{\sin x + \cos x}dx$`. By the property `$\int_0^a f(x)dx = \int_0^a f(a - x)dx$` with `$a = \pi/2$`, and `$\sin(\pi/2 - x) = \cos x$`:

`$I = \int_0^{\pi/2}\frac{\cos x}{\cos x + \sin x}dx$`.

Add the two forms: `$2I = \int_0^{\pi/2}\frac{\sin x + \cos x}{\sin x + \cos x}dx = \int_0^{\pi/2}1\,dx = \frac\pi2$`.

So `$I = \frac\pi4$`.

</details>

12. Evaluate `$\int \frac{3x + 5}{(x + 1)(x + 3)}\,dx$`.

<details><summary>Answer</summary>

Write `$\frac{3x+5}{(x+1)(x+3)} = \frac{A}{x+1} + \frac{B}{x+3}$`.

Cover-up: `$A = \frac{3(-1) + 5}{-1 + 3} = 1$`, `$B = \frac{3(-3)+5}{-3+1} = 2$`.

Check at x = 0: left side 5/3, right side 1 + 2/3 = 5/3 ✓.

`$\int = \ln|x+1| + 2\ln|x+3| + C$`.

</details>

13. Evaluate `$\int_0^{1} x e^{2x}\,dx$`.

<details><summary>Answer</summary>

By parts: `$u = x$`, `$dv = e^{2x}dx$`, so `$du = dx$`, `$v = \tfrac12 e^{2x}$`.

`$\int x e^{2x}dx = \tfrac{x}{2}e^{2x} - \tfrac12\int e^{2x}dx = \tfrac{x}{2}e^{2x} - \tfrac14 e^{2x}$`.

From 0 to 1: `$\left(\tfrac{e^2}{2} - \tfrac{e^2}{4}\right) - \left(0 - \tfrac14\right) = \tfrac{e^2}{4} + \tfrac14 = \tfrac{e^2 + 1}{4}$`.

</details>

14. Evaluate `$\int \frac{dx}{x^2 + 4x + 13}$`.

<details><summary>Answer</summary>

Complete the square: `$x^2 + 4x + 13 = (x + 2)^2 + 9$`.

With `$t = x + 2$`, `$a = 3$`: `$\int\frac{dt}{t^2 + 3^2} = \frac13\tan^{-1}\frac t3$`.

So the integral is `$\frac13\tan^{-1}\frac{x+2}{3} + C$`.

</details>

15. Evaluate `$\int_0^{\pi/2} \sin^2 x\,dx$` and hence `$\int_0^{\pi/2} \cos^2 x\,dx$`.

<details><summary>Answer</summary>

`$\sin^2 x = \frac{1 - \cos 2x}{2}$`, so `$\int_0^{\pi/2}\sin^2 x\,dx = \left[\frac x2 - \frac{\sin 2x}{4}\right]_0^{\pi/2} = \frac\pi4$`.

By the property `$\int_0^a f(x) dx = \int_0^a f(a-x)dx$`, `$\int_0^{\pi/2}\cos^2 x\,dx = \int_0^{\pi/2}\sin^2 x\,dx = \frac\pi4$`.

</details>

## Case-based question

**The leaking tank.** A water tank in a Kerala village is losing water through a small crack. The rate of leak, in litres per minute, `$t$` minutes after noon, is measured as `$r(t) = 12 - 0.4t$` for `$0 \le t \le 20$`. At noon the tank holds 900 litres.

(a) Why does the total water lost between t = 0 and t = 20 equal `$\int_0^{20} r(t)\,dt$`?

(b) Evaluate that integral.

(c) How much water is left at t = 20?

(d) The crack is repaired when the leak has fallen to half its noon rate. At what time? How much water was lost up to that time?

<details><summary>Answer</summary>

(a) In a short time `$dt$` the loss is about `$r(t)\,dt$` litres (rate × time). Adding the pieces over all small intervals is exactly the definite integral.

(b) `$\int_0^{20}(12 - 0.4t)\,dt = [12t - 0.2t^2]_0^{20} = 240 - 80 = 160$` litres.

(c) 900 − 160 = 740 litres.

(d) Half of the noon rate 12 is 6: `$12 - 0.4t = 6$` gives `$t = 15$` minutes. The loss up to then is `$[12t - 0.2t^2]_0^{15} = 180 - 45 = 135$` litres.

</details>

## Assertion and reason

For each, choose: (A) both true and R explains A; (B) both true but R does not explain A; (C) A true, R false; (D) A false, R true.

16. **Assertion (A):** `$\int_{-2}^{2} x^2\sin x\,dx = 0$`. **Reason (R):** If f is an odd function then `$\int_{-a}^{a} f(x)\,dx = 0$`.

<details><summary>Answer</summary>(A). `$x^2 \sin x$` is even × odd = odd, so R applies and gives A.</details>

17. **Assertion (A):** `$\int \frac{dx}{x} = \ln x + C$` for all real x ≠ 0. **Reason (R):** The derivative of `$\ln|x|$` is `$1/x$` for x ≠ 0.

<details><summary>Answer</summary>(D). R is true. A is false: `$\ln x$` is not defined for negative x, so the formula must be `$\ln|x| + C$`.</details>

18. **Assertion (A):** In `$\int x\,e^x dx$` the choice `$u = x$` is better than `$u = e^x$`. **Reason (R):** Differentiating x gives 1, which makes the new integral simpler.

<details><summary>Answer</summary>(A). With u = x the second integral is `$\int e^x dx$`; with `$u = e^x$` it would be `$\int \tfrac{x^2}{2}e^x dx$`, worse.</details>

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="integrals" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Standard forms first, then substitution (a function and its derivative), partial fractions (factorised denominator), parts (product, ILATE).
- Definite integral: change limits with the variable, or return to x. F(b) − F(a): no +C.
- Symmetry first: odd over (−a, a) gives 0; ∫₀ᵃ f(x) = ∫₀ᵃ f(a−x) turns f/(f+g) type integrals into half the length.
- Check by differentiating, or estimate the area of a definite integral by a rough trapezoid.
- Units and meaning: ∫ rate dt is the total amount, such as litres lost or metres travelled.

</div>
