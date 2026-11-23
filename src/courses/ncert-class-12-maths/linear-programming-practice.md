---
title: 'Linear Programming: practice questions'
seoTitle: 'Linear Programming Class 12 questions with answers'
summary: 'Class 12 Linear Programming practice: 1, 2, 3 and 5 mark questions, a case study and assertion-reason, with full answers and live problems.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'The corner points of a bounded feasible region are (0, 0), (5, 0), (3, 4) and (0, 6). The maximum of Z = 2x + y is:'
    choices: ['10', '12', '6', '16']
    ans: 0
    why: 'Z = 0, 10, 10, 6. The maximum is 10 (reached at both (5, 0) and (3, 4), so along the whole edge between them).'
  - q: 'The constraints x + y ≥ 8 and x + y ≤ 5 give:'
    choices: ['an empty feasible region', 'a bounded region', 'an unbounded region', 'a single point']
    ans: 0
    why: 'No number is at least 8 and at most 5.'
  - q: 'To shade x + 2y ≤ 6, test the origin: 0 ≤ 6 is true, so shade:'
    choices: ['the side containing the origin', 'the side away from the origin', 'only the line', 'above the line only']
    ans: 0
    why: 'A true test point means its side is the solution side.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 12 “Linear Programming” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Questions follow the CBSE board pattern (1, 2, 3 and 5 mark, case-based and assertion-reason) as in the CBSE sample question papers; all numbers and stories are original and every answer was checked a second way, by scanning the boundary of the region on a fine grid.'
---

Back to the chapter: [Linear Programming](/learn/courses/ncert-class-12-maths/linear-programming/).

## How to set out answers

1. Name the variables and write the objective function Z.
2. Write every constraint (with the units the same) and `$x \ge 0,\ y \ge 0$`.
3. Draw the lines, shade the feasible region, and list the corner points (work out the meeting points by solving the two equations).
4. Make a table of Z at each corner. For an unbounded region add the open half-plane check.
5. State the answer in words: how much of each to make and the maximum profit or minimum cost.

## 1-mark questions

**Q1.** What is the name for the function `$Z = px + qy$` that is to be maximised or minimised?

<details><summary>Answer</summary>

The objective function.

</details>

**Q2.** Is the point `$(3, 2)$` in the region `$x + y \le 4,\ x \ge 0,\ y \ge 0$`?

<details><summary>Answer</summary>

No: `$3 + 2 = 5 > 4$`.

</details>

**Q3.** The feasible region has the corner points `$(0, 0)$`, `$(4, 0)$` and `$(0, 3)$`. Is it bounded?

<details><summary>Answer</summary>

Yes. It is the triangle with those corners, closed in on all sides.

</details>

**Q4.** A shop can stock at most 40 items, `$x$` shirts and `$y$` jeans. Write this as an inequality.

<details><summary>Answer</summary>

`$x + y \le 40$`.

</details>

## 2-mark and 3-mark questions

**Q5.** Maximise `$Z = 3x + 2y$` subject to `$x + y \le 6$`, `$x \le 4$`, `$x, y \ge 0$`.

<details><summary>Answer</summary>

The corner points are `$(0, 0)$`, `$(4, 0)$`, `$(4, 2)$` (where `$x = 4$` meets `$x + y = 6$`) and `$(0, 6)$`.

| Corner | Z = 3x + 2y |
|---|---|
| (0, 0) | 0 |
| (4, 0) | 12 |
| (4, 2) | 16 |
| (0, 6) | 12 |

The maximum is 16 at `$(4, 2)$`.

</details>

**Q6.** Minimise `$Z = 2x + 3y$` subject to `$x + y \ge 5$`, `$x, y \ge 0$`.

<details><summary>Answer</summary>

The region is unbounded (it lies on or above the line `$x + y = 5$`). Corner points: `$(5, 0)$` and `$(0, 5)$`. `$Z = 10$` and `$15$`.

The smallest is 10 at `$(5, 0)$`. Check the open half-plane `$2x + 3y < 10$`: any feasible point has `$2x + 3y \ge 2(x + y) \ge 10$`, so it has no point in the region. The minimum is 10.

</details>

**Q7.** Find the corner points of the region `$2x + y \le 8$`, `$x + 2y \le 8$`, `$x, y \ge 0$`.

<details><summary>Answer</summary>

On the axes: `$(0, 0)$`, `$(4, 0)$` (from `$2x + y = 8$`) and `$(0, 4)$` (from `$x + 2y = 8$`). The two lines meet where `$2x + y = 8$` and `$x + 2y = 8$`: subtract to get `$x - y = 0$`, so `$x = y = \dfrac83$`.

Corner points: `$(0, 0)$`, `$(4, 0)$`, `$\left(\dfrac83, \dfrac83\right)$`, `$(0, 4)$`.

</details>

**Q8.** Does `$Z = x + y$` have a maximum on the region `$x - y \le 1$`, `$x, y \ge 0$`? Explain.

<details><summary>Answer</summary>

The region is unbounded (take `$y$` as large as you like with `$x = y$`). For any value `$M$`, the points `$(M, M)$` satisfy `$x - y = 0 \le 1$` and give `$Z = 2M > M$`. The open half-plane `$x + y > M$` always has points in the region, so there is no maximum.

</details>

**Q9.** Maximise `$Z = 2x + 2y$` subject to `$x + y \le 5$`, `$x, y \ge 0$`. How many optimal points are there?

<details><summary>Answer</summary>

Corners `$(0, 0)$`, `$(5, 0)$`, `$(0, 5)$` give `$Z = 0, 10, 10$`. Two corners tie at the maximum 10, so every point on the line segment between `$(5, 0)$` and `$(0, 5)$` is optimal: there are infinitely many optimal points.

</details>

## 5-mark questions

**Q10.** A farmer has 20 hectares. Wheat needs 2 workers per hectare and rice 3 workers per hectare, and 48 workers are available. The profit is ₹4000 per hectare of wheat and ₹5000 per hectare of rice. How much of each should be grown for the maximum profit?

<details><summary>Answer</summary>

Let `$x$` hectares of wheat and `$y$` of rice. Maximise `$Z = 4000x + 5000y$` subject to `$x + y \le 20$`, `$2x + 3y \le 48$`, `$x, y \ge 0$`.

Corner points: `$(0, 0)$`; `$(20, 0)$`; `$(0, 16)$` (from `$3y = 48$`); and the meeting point of `$x + y = 20$` with `$2x + 3y = 48$`: substitute `$y = 20 - x$` to get `$2x + 60 - 3x = 48$`, so `$x = 12$`, `$y = 8$`.

| Corner | Z (₹) |
|---|---|
| (0, 0) | 0 |
| (20, 0) | 80000 |
| (0, 16) | 80000 |
| (12, 8) | 88000 |

The maximum profit is ₹88,000 with 12 hectares of wheat and 8 of rice.

</details>

**Q11.** Food A costs ₹20 per kg and gives 2 units of vitamin and 1 unit of iron. Food B costs ₹30 per kg and gives 1 unit of vitamin and 3 units of iron. A diet needs at least 8 units of vitamin and 9 units of iron. Find the cheapest mix.

<details><summary>Answer</summary>

Let `$x$` kg of A and `$y$` kg of B. Minimise `$Z = 20x + 30y$` subject to `$2x + y \ge 8$`, `$x + 3y \ge 9$`, `$x, y \ge 0$`.

The region is unbounded. Corner points: `$(0, 8)$` (on the y-axis from `$y = 8$`); `$(9, 0)$` (on the x-axis from `$x = 9$`); and the meeting point of the two lines: `$2x + y = 8$` and `$x + 3y = 9$` give `$5y = 10$`, `$y = 2$`, `$x = 3$`.

| Corner | Z (₹) |
|---|---|
| (0, 8) | 240 |
| (9, 0) | 180 |
| (3, 2) | 120 |

The smallest is 120 at `$(3, 2)$`. Check `$20x + 30y < 120$`, i.e. `$2x + 3y < 12$`: it has no point in the region (since `$2x + 3y = \tfrac35(2x + y) + \tfrac45(x + 3y) \ge \tfrac35\cdot8 + \tfrac45\cdot9 = 12$` for every feasible point). So the minimum cost is ₹120 with 3 kg of A and 2 kg of B.

</details>

**Q12.** Show that the problem of maximising `$Z = x + y$` subject to `$x + y \le 3$` and `$2x + 2y \ge 10$` with `$x, y \ge 0$` has no solution.

<details><summary>Answer</summary>

Divide the second constraint by 2: `$x + y \ge 5$`. The first says `$x + y \le 3$`. No point can have `$x + y$` both at most 3 and at least 5, so the shaded half-planes do not overlap and the feasible region is empty. There is no feasible solution, so there is nothing to maximise.

</details>

## Case-based question

**Q13.** A potter makes pots (`$x$` a day) and plates (`$y$` a day). The oven allows `$x + 2y \le 16$` hours and shaping allows `$3x + y \le 18$` hours. The profit is ₹40 per pot and ₹50 per plate.

(i) Write the linear programme. (ii) Find the corner points. (iii) Find the maximum profit. (iv) Keeping plates at ₹50, at what profit per pot would the corners `$(6, 0)$` and `$(4, 6)$` tie?

<details><summary>Answer</summary>

(i) Maximise `$Z = 40x + 50y$` subject to `$x + 2y \le 16$`, `$3x + y \le 18$`, `$x, y \ge 0$`.

(ii) `$(0, 0)$`; `$(6, 0)$` (from `$3x = 18$`); `$(0, 8)$` (from `$2y = 16$`); and the meeting point of the lines: `$x = 16 - 2y$` in `$3x + y = 18$` gives `$48 - 5y = 18$`, so `$y = 6$` and `$x = 4$`: `$(4, 6)$`.

(iii) `$Z$` at the corners: 0, 240, 400 and `$460$`. The maximum profit is ₹460 at `$(4, 6)$`.

(iv) With profit `$p$` per pot: at `$(6, 0)$` `$Z = 6p$`, at `$(4, 6)$` `$Z = 4p + 300$`. They tie when `$6p = 4p + 300$`, so `$p = 150$`. Then both give ₹900 and every point on the edge between them is optimal.

</details>

## Assertion and reason

**Q14.** **Assertion (A):** The maximum of a linear function over a bounded feasible region is at a corner point. **Reason (R):** The line `$Z = c$` leaves a many-sided region last at a corner (or along an edge parallel to it). Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.

<details><summary>Answer</summary>

(a). Both are true, and R is the geometric reason for the corner point theorem.

</details>

**Q15.** **Assertion (A):** An LPP with an unbounded feasible region never has a minimum. **Reason (R):** The region extends to infinity. Choose (a) to (d) as above.

<details><summary>Answer</summary>

(d). A is false: for example minimising `$2x + 3y$` over `$x + y \ge 5$` has the minimum 10 at `$(5, 0)$`. R is true but does not decide the matter: what matters is whether the open half-plane `$Z < m$` meets the region.

</details>

## Live problems

<div class="problem" data-problem="c12m-lp-corner"></div>

<div class="problem" data-problem="c12m-lp-profit"></div>

<div class="problem" data-problem="c12m-lp-diet"></div>

## More questions

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="linear-programming" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Set out: variables, objective Z, constraints, `$x, y \ge 0$`; draw, shade (test the origin), list corners, tabulate Z.
- Bounded region: the maximum and minimum are at corner points; a tie means the whole edge is optimal.
- Unbounded region: for a maximum check that `$Z > M$` misses the region; for a minimum check that `$Z < m$` misses it. Otherwise there is no maximum (minimum).
- Contradictory constraints give an empty region: no solution.

</div>
