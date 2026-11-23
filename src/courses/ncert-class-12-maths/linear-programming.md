---
title: Linear Programming
seoTitle: 'Linear Programming Class 12 notes: graphical method'
summary: 'Class 12 Linear Programming with animations: forming the problem, the feasible region, corner points, maximising and minimising, unbounded and impossible cases.'
minutes: 75
updated: 2026-11-22
quiz:
  - q: 'In a linear programming problem, the maximum value of Z = px + qy over a bounded feasible region occurs:'
    choices: ['at a corner point', 'at the centre of the region', 'only at the origin', 'at a point outside the region']
    ans: 0
    why: 'The corner point theorem: Z is linear, so its extreme values over a bounded feasible region occur at corner points (and when two corners tie, along the edge between them).'
  - q: 'The feasible region has corner points (0, 0), (6, 0), (4, 3) and (0, 5). The maximum of Z = 3x + 4y is:'
    choices: ['24', '18', '20', '15']
    ans: 0
    why: 'Z = 0, 18, 24 and 20 at the four corners. The maximum is 24 at (4, 3).'
  - q: 'The constraints x + y ≤ 3 and x + y ≥ 6 together give:'
    choices: ['an empty feasible region: no solution', 'a bounded region', 'an unbounded region', 'one corner point']
    ans: 0
    why: 'No point can have x + y at most 3 and at least 6 at the same time, so no point is feasible.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 12 “Linear Programming” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Dantzig, G. B., Linear Programming and Extensions (Princeton University Press, 1963), chapters 1 to 3: the origin of the problem and the corner-point (extreme point) idea.'
  - 'Every worked example was recomputed a second way, by scanning the boundary of the region on a fine grid instead of listing corner points.'
---

**Maths · Class 12 · Chapter 12 · about 75 minutes.** By the end you will be able to turn a word problem into inequalities and an objective function, draw the feasible region, find its corner points, pick the best one for a maximum or a minimum, and recognise problems with no best answer or no possible answer at all.

<div class="bigidea">A shopkeeper, a farmer or a factory has limited time, money and ingredients and wants the most profit or the least cost. If everything is a straight-line relationship, the possible plans fill a many-sided region of the graph, and the best plan is always at one of its corners. So instead of trying infinitely many plans you check a handful of corner points.</div>

## 1. Forming a linear programming problem

A **linear programming problem (LPP)** has three parts:

- **Decision variables** `$x, y$`: the quantities you choose (plates of idli and dosa, hectares of wheat and rice).
- An **objective function** `$Z = px + qy$`: the profit or cost to make as big or as small as possible. It is linear (no `$x^2$` or `$xy$`).
- **Constraints**: linear inequalities from the limits (time, money, materials), plus the **non-negativity** conditions `$x \ge 0,\ y \ge 0$` (you cannot make a negative number of thalis).

Here is the way to form a problem from a story, step by step:

<div class="steps" data-fig="c12m-lp-setup">
<div class="step">A tiffin service sells veg thalis (₹30 profit) and non-veg thalis (₹50). Cooking takes 20 and 30 minutes each; there are 12 hours of cooking and at most 30 thalis can be packed.</div>
<div class="step">Decide the variables: x = number of veg thalis, y = number of non-veg thalis.</div>
<div class="step">The objective: maximise Z = 30x + 50y rupees.</div>
<div class="step">The limits in the same unit (minutes): cooking 20x + 30y ≤ 720; packing x + y ≤ 30.</div>
<div class="step">Non-negativity: x ≥ 0 and y ≥ 0.</div>
<div class="step">That is a linear programme: its corners are (0, 0), (30, 0), (0, 24) and (18, 12), and Z = 0, 900, 1200, 1140 there, so 24 non-veg thalis and no veg ones is best.</div>
</div>

<div class="meaning">

<dl>
<dt>Feasible solution</dt><dd>Any point (x, y) that satisfies **all** the constraints.</dd>
<dt>Feasible region</dt><dd>The set of all feasible solutions: the overlap of the half-planes.</dd>
<dt>Optimal solution</dt><dd>A feasible point where Z is largest (or smallest).</dd>
<dt>Physical meaning</dt><dd>Each point of the region is a plan you could actually carry out. The objective function tells you which plan earns the most.</dd>
</dl>

</div>

## 2. Drawing the feasible region

### One inequality at a time

The inequality `$ax + by \le c$` is a **half-plane**: the line `$ax + by = c$` splits the plane into two sides and the inequality picks one. To choose the side, **test a point**: put the origin (0, 0) in. If it makes the inequality true, shade the side with the origin; if false, shade the other side (when the line does not pass through the origin).

<figure class="fig" data-fig="c12m-lp-halfplane"><figcaption>Change a, b, c and the sign. The shaded half-plane is the set of solutions. Drag the test point: green means it satisfies the inequality, red means it does not. The readout does the arithmetic.</figcaption></figure>

<div class="problem" data-problem="c12m-lp-meet"></div>

### All the constraints together

The feasible region is where **every** shaded half-plane overlaps, together with the first quadrant. Switch the three constraints below on and off one at a time: each can only shrink the region. The corner points are where two boundary lines meet and the point still satisfies everything else.

<figure class="fig" data-fig="c12m-lp-region"><figcaption>Three constraints plus x, y ≥ 0. Toggle each one. The dots are corner points; their coordinates are listed in the readout. A region that is closed in on all sides is bounded.</figcaption></figure>

<div class="myth">

**“Shade the part that is outside all the lines.”** The feasible region is the common part (the overlap) of the shaded sides, not the leftover part. And do not forget the first quadrant: x and y cannot be negative.

</div>

## 3. The corner point method

The objective `$Z = px + qy$` for a chosen value of Z is a straight line; different values of Z give **parallel lines**. As Z increases the line slides across the graph. The best point is the last place the line touches the feasible region as it leaves, and a straight line leaves a many-sided region at a **corner** (or along a whole edge if it is parallel to it).

<div class="bigidea">**Corner point theorem.** If the feasible region is bounded, Z has a maximum and a minimum, and each is at a corner point. If two corner points both give the best value, every point on the line segment between them gives it too.</div>

The recipe:

1. Draw the feasible region and find its corner points.
2. Work out Z at each corner.
3. The largest value is the maximum and the smallest is the minimum.

Slide Z up, press “Slide to the optimum”, and change the profit numbers p and q to tilt the line:

<figure class="fig" data-fig="c12m-lp-corner"><figcaption>The line Z = px + qy sweeps across the region and stops at the best corner. Try p = q: the line is parallel to an edge and two corners tie. Change “largest” to “smallest” to hunt for the minimum.</figcaption></figure>

See the whole method in one worked example: a dhaba makes x plates of samosa and y plates of kachori, subject to `$x + y \le 8$`, `$x + 3y \le 18$`, `$3x + y \le 18$` and `$x, y \ge 0$`, with profit `$Z = 40x + 30y$` rupees.

<div class="steps" data-fig="c12m-lp-steps">
<div class="step">Set up the axes: x for samosa plates, y for kachori plates. Only the first quadrant makes sense.</div>
<div class="step">Draw each boundary line by finding two points on it: x + y = 8 through (8, 0) and (0, 8); x + 3y = 18 through (18, 0) and (0, 6); 3x + y = 18 through (6, 0) and (0, 18).</div>
<div class="step">Test the origin: every inequality is true at (0, 0), so shade towards the origin. The feasible region is the five-sided shape.</div>
<div class="step">Find the corner points. (0, 0), (6, 0) and (0, 6) are on the axes. The other two come from pairs of lines: x + y = 8 with 3x + y = 18 gives (5, 3); x + y = 8 with x + 3y = 18 gives (3, 5).</div>
<div class="step">Z = 40x + 30y at the corners: (0, 0) gives 0; (6, 0) gives 240; (5, 3) gives 290; (3, 5) gives 270; (0, 6) gives 180.</div>
<div class="step">The largest is 290 at (5, 3): 5 plates of samosa and 3 of kachori earn the most, ₹290.</div>
</div>

<div class="problem" data-problem="c12m-lp-corner"></div>

<div class="problem" data-problem="c12m-lp-profit"></div>

<div class="myth">

**“The best point is where the two biggest constraints meet.”** You cannot guess: you must check Z at every corner. Changing the profit numbers can move the best corner to a completely different place, as the sliding line shows.

</div>

## 4. Unbounded regions, no solution and ties

Not every problem has one neat answer. The picture tells you which case you are in.

- **Bounded region:** a maximum and a minimum both exist, at corners.
- **Unbounded region** (it runs off to infinity): a maximum or minimum may or may not exist. For a **maximum**, if the open half-plane `$px + qy > M$` has points in the feasible region (where M is the largest corner value), there is no maximum. For a **minimum**, if the open half-plane `$px + qy < m$` has **no** point in the region (m being the smallest corner value), m is the minimum; otherwise there is none.
- **Infeasible:** the constraints clash and there is no feasible point at all.
- **Many optimal solutions:** the objective line is parallel to an edge, so two corners tie.

<figure class="fig" data-fig="c12m-lp-types"><figcaption>Pick each case in turn: one best corner, a tie along an edge, an unbounded region with no maximum, an empty region and a minimum on an open region.</figcaption></figure>

Minimising on an unbounded region is the typical diet problem (“at least this much of each nutrient, as cheaply as possible”). The extra check is the open half-plane:

<div class="steps" data-fig="c12m-lp-minsteps">
<div class="step">Minimise Z = 3x + 2y subject to 2x + y ≥ 8, x + 2y ≥ 8, x ≥ 0, y ≥ 0. The ≥ signs give an unbounded region that goes on up and to the right.</div>
<div class="step">Corner points: (0, 8), where the lines meet at (8/3, 8/3), and (8, 0).</div>
<div class="step">Z = 3x + 2y at them: 16, 40/3 ≈ 13.33 and 24.</div>
<div class="step">The smallest corner value is 40/3, at (8/3, 8/3). But the region is unbounded, so we must check it is really the minimum.</div>
<div class="step">Draw the open half-plane 3x + 2y < 40/3. It has no point in common with the feasible region, so 40/3 is the minimum.</div>
</div>

<div class="problem" data-problem="c12m-lp-diet"></div>

Compare with the ready-made tool, which draws all of this and also warns when the region is unbounded or empty:

<figure class="fig" data-fig="@math-lp-iso"><figcaption>A feasible region with a sliding iso-profit line. Change the profit weights and the best corner follows.</figcaption></figure>

<!--fig:tool lpp-solver-->

Another tool: the [LP solver](/science/lp-solver/) handles any number of variables, as used in industry.

### Kinds of problems you will meet

- **Manufacturing:** make two products from limited machine time, labour and material; maximise profit.
- **Diet:** mix two foods to meet minimum nutrient needs; minimise cost.
- **Transportation and allocation:** send goods from godowns to shops at the least freight; assign areas to crops.

All of them are done the same way: name the variables, write Z and the constraints, draw, check corners.

<div class="history">

- **1939:** Leonid Kantorovich in the USSR shows how to plan production with linear equations.
- **1947:** George Dantzig, working for the US Air Force, invents the simplex method that solves linear programmes with thousands of variables.
- **Now:** airlines, Indian Railways timetabling, fertiliser blending and power-grid planning all run on linear programmes.

</div>

<div class="keypoints">

- An LPP has an objective function `$Z = px + qy$` (maximise or minimise), linear constraints and `$x, y \ge 0$`.
- Feasible region = overlap of all the half-planes in the first quadrant. Shade by testing the origin. Corner points come from pairs of boundary lines.
- Corner point theorem: for a bounded region the maximum and minimum of Z are at corner points; if two corners tie, the whole edge between them is optimal.
- Method: draw the region, list corners, compute Z at each, compare.
- Unbounded region: for a maximum, check that `$px + qy > M$` has no point in the region; for a minimum, that `$px + qy < m$` has none. Otherwise there is no maximum (or no minimum).
- No point satisfying all the constraints: the problem is infeasible and has no solution.

</div>

Going further for JEE/NEET: the exam-style problems with several constraints and tied or unbounded outcomes are in [Linear programming (JEE)](/learn/courses/engineering-entrance/linear-programming/).
