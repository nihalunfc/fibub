---
title: 'Application of Derivatives: practice questions'
seoTitle: 'Application of Derivatives Class 12 questions'
summary: 'Board-style practice for Class 12 Application of Derivatives: 1, 2, 3 and 5 mark questions, a case study and assertion-reason items with worked answers.'
minutes: 70
updated: 2026-11-23
quiz:
  - q: 'The function f(x) = x² − 4x + 7 has its minimum value at x equal to:'
    choices: ['2', '4', '−2', '7']
    ans: 0
    why: 'f′(x) = 2x − 4 = 0 gives x = 2, and f″ = 2 > 0, so it is a minimum (f(2) = 3).'
  - q: 'The side of a square grows at 3 cm/s. The rate of change of its area when the side is 5 cm is:'
    choices: ['30 cm²/s', '15 cm²/s', '25 cm²/s', '10 cm²/s']
    ans: 0
    why: 'A = s², dA/dt = 2s ds/dt = 2 × 5 × 3 = 30 cm²/s.'
  - q: 'If f″(c) = 0 at a critical point c, then:'
    choices: ['the second derivative test fails', 'c is a maximum', 'c is a minimum', 'c is not a critical point']
    ans: 0
    why: 'The second derivative test gives no conclusion; use the first derivative test instead.'
sources:
  - 'CBSE Class 12 Mathematics sample question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Maths · Chapter 6.** Read the chapter lesson, [Application of Derivatives](/learn/courses/ncert-class-12-maths/application-of-derivatives/), first. Try each question on paper before opening the answer. Board marks come for the method, so show every step.

<div class="bigidea">Every question here starts with a function or an equation linking the quantities. Differentiate it, set `$f' = 0$` when you want turning points, and test what you find (second derivative or sign change). For related rates, differentiate first and put numbers in last.</div>

## How to set out the answers

1. Related rates: write the equation linking the quantities, differentiate with respect to `$t$`, then substitute.
2. Increasing or decreasing: find `$f'$`, factorise, make a sign table.
3. Maxima and minima: critical points, then second derivative or first derivative test, then the value of `$f$`.
4. Word problems: make a function of one variable, state its domain, check the end points as well, and give units.

<div class="problem" data-problem="c12m-appd-fence"></div>

<div class="problem" data-problem="c12m-appd-localmin"></div>

## 1-mark questions

1. If `$A = \pi r^2$`, write `$\dfrac{dA}{dt}$` in terms of `$\dfrac{dr}{dt}$`.

<details><summary>Answer</summary>

`$\dfrac{dA}{dt} = 2\pi r\dfrac{dr}{dt}$`.

</details>

2. State a condition for `$f$` to be increasing on an interval.

<details><summary>Answer</summary>

`$f'(x) > 0$` for every `$x$` in the interval.

</details>

3. What is the second derivative test for a maximum?

<details><summary>Answer</summary>

At a critical point `$c$` (`$f'(c) = 0$`), if `$f''(c) < 0$` then `$f$` has a local maximum at `$c$`.

</details>

4. Is `$f(x) = x^3$` increasing or decreasing on `$\mathbb{R}$`?

<details><summary>Answer</summary>

Increasing: `$f'(x) = 3x^2 \ge 0$`, zero only at `$x = 0$`.

</details>

## 2- and 3-mark questions

5. (2) The volume of a cube grows at 12 cm³/s. How fast is the edge growing when the edge is 2 cm?

<details><summary>Answer</summary>

`$V = a^3$`, so `$dV/dt = 3a^2\,da/dt$`. `$12 = 3(4)\,da/dt$`, so `$da/dt = 1$` cm/s.

</details>

6. (2) Find the intervals where `$f(x) = x^2 - 6x + 5$` is increasing.

<details><summary>Answer</summary>

`$f'(x) = 2x - 6 > 0$` for `$x > 3$`. So `$f$` is increasing on `$(3, \infty)$` (and decreasing on `$(-\infty, 3)$`).

</details>

7. (3) Find the local maximum and local minimum values of `$f(x) = x^3 - 3x + 2$`.

<details><summary>Answer</summary>

`$f'(x) = 3x^2 - 3 = 3(x-1)(x+1)$`, so the critical points are −1 and 1.

`$f''(x) = 6x$`: `$f''(-1) = -6 < 0$` (local maximum), `$f''(1) = 6 > 0$` (local minimum).

`$f(-1) = -1 + 3 + 2 = 4$` and `$f(1) = 1 - 3 + 2 = 0$`. Local maximum value 4, local minimum value 0.

</details>

8. (3) A stone dropped into still water makes a circular ripple whose radius grows at 4 cm/s. How fast is the area increasing when the radius is 10 cm?

<details><summary>Answer</summary>

`$dA/dt = 2\pi r\,dr/dt = 2\pi(10)(4) = 80\pi \approx 251$` cm²/s.

</details>

9. (3) Find the absolute maximum and minimum of `$f(x) = x^3 - 3x$` on `$[0, 2]$`.

<details><summary>Answer</summary>

`$f'(x) = 3x^2 - 3 = 0$` gives `$x = 1$` in `$[0, 2]$` (and −1, outside). Values: `$f(0) = 0$`, `$f(1) = -2$`, `$f(2) = 2$`.

Absolute maximum 2 (at `$x = 2$`), absolute minimum −2 (at `$x = 1$`).

</details>

10. (3) Show that `$f(x) = e^x - x$` is increasing for `$x > 0$`.

<details><summary>Answer</summary>

`$f'(x) = e^x - 1$`. For `$x > 0$`, `$e^x > 1$`, so `$f'(x) > 0$`: `$f$` is increasing.

</details>

## 5-mark questions

11. A ladder 13 m long leans against a wall. Its foot is pulled away at 2 m/s. How fast is the top sliding down when the foot is 5 m from the wall? At what rate is the angle with the ground changing at that moment?

<details><summary>Answer</summary>

`$x^2 + y^2 = 169$`, so `$x\dot x + y\dot y = 0$`. When `$x = 5$`, `$y = 12$`.

`$\dot y = -\dfrac{x}{y}\dot x = -\dfrac{5}{12}\times2 = -\dfrac56$` m/s: the top slides down at 5/6 m/s.

For the angle `$\theta$` with the ground, `$\cos\theta = x/13$`. Differentiating, `$-\sin\theta\,\dot\theta = \dot x/13 = 2/13$`. Since `$\sin\theta = 12/13$`, `$\dot\theta = -\dfrac{2}{13}\times\dfrac{13}{12} = -\dfrac16$` rad/s: the angle is decreasing at 1/6 rad/s.

</details>

12. A closed box with a square base must have volume 32 000 cm³. Find the dimensions that use the least material.

<details><summary>Answer</summary>

Let the base side be `$x$` and height `$h$`: `$x^2h = 32000$`, so `$h = 32000/x^2$`.

Surface area `$S = 2x^2 + 4xh = 2x^2 + \dfrac{128000}{x}$`.

`$S' = 4x - \dfrac{128000}{x^2} = 0$` gives `$x^3 = 32000$`, so `$x = 31.7$` cm approximately (`$\sqrt[3]{32000}$`), and `$h = 32000/x^2 = x$`. 

`$S'' = 4 + \dfrac{256000}{x^3} > 0$`, so it is a minimum. The best box is a **cube** of side about 31.7 cm.

</details>

## Case-based question

**A water tank for a society.** A housing society in Pune plans an open rectangular water tank with a square base of side `$x$` metres and height `$h$` metres. It must hold 32 cubic metres. The cost of the walls and base is ₹500 per square metre.

13. (a) Write `$h$` in terms of `$x$`. (b) Write the area of metal sheet (base plus four walls) as a function of `$x$`. (c) Find `$x$` that minimises the area and check it is a minimum. (d) Find the minimum cost.

<details><summary>Answer</summary>

(a) `$x^2h = 32$`, so `$h = 32/x^2$`.

(b) Area `$A = x^2 + 4xh = x^2 + \dfrac{128}{x}$`.

(c) `$A' = 2x - \dfrac{128}{x^2} = 0$` gives `$x^3 = 64$`, `$x = 4$`. `$A'' = 2 + \dfrac{256}{x^3} = 2 + 4 = 6 > 0$`: a minimum. Then `$h = 32/16 = 2$` m.

(d) `$A = 16 + 128/4 = 48$` m², so the cost is `$48 \times 500 = ₹24\,000$`.

</details>

## Assertion and reason

For each pair choose: (a) both true and R explains A, (b) both true but R does not explain A, (c) A true, R false, (d) A false, R true.

14. **Assertion (A):** `$f(x) = x^3$` has no local maximum or minimum. **Reason (R):** `$f'(0) = 0$` and `$f'$` does not change sign at 0.

<details><summary>Answer</summary>(a). The point x = 0 is critical, but `$f' = 3x^2$` is positive on both sides, so it is neither a maximum nor a minimum; R explains A.</details>

15. **Assertion (A):** A function that is increasing on `$\mathbb{R}$` must have `$f'(x) > 0$` at every point. **Reason (R):** `$f(x) = x^3$` is increasing on `$\mathbb{R}$`.

<details><summary>Answer</summary>(d). A is false: `$x^3$` is increasing yet `$f'(0) = 0$`. R is true (and is the counter-example).</details>

16. **Assertion (A):** The greatest value of a continuous function on `$[a, b]$` can occur at an end point. **Reason (R):** The maximum is always found where `$f' = 0$`.

<details><summary>Answer</summary>(c). A is true (for example `$f(x) = x$` on `$[0,1]$` has its maximum at 1). R is false: the ends must always be checked.</details>

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="application-of-derivatives" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Related rates: link equation, differentiate with respect to `$t$` first, then substitute numbers.
- `$f' > 0$` increasing, `$f' < 0$` decreasing; critical points `$f' = 0$`.
- Maximum: `$f'$` goes + to −, or `$f'' < 0$`. Minimum: `$f'$` goes − to +, or `$f'' > 0$`.
- On `$[a, b]$` check both ends and the critical points inside.
- Fixed-volume closed tin (cylinder) uses least metal when `$h = 2r$`; a closed box with a square base, when it is a cube.

</div>
