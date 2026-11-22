---
title: Linear programming
seoTitle: 'Linear programming: JEE maths'
summary: 'Turning a word problem into constraints and an objective function, drawing the feasible region, the corner point method and why it works, bounded and unbounded regions, multiple optimal solutions, empty regions, integer (lattice) points, and the standard diet, manufacturing and transportation problems.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'In the corner point method, the optimal value of Z = ax + by over a bounded feasible region occurs:'
    choices: ['at the centre of the region', 'at a corner point', 'on the x-axis', 'anywhere inside']
    ans: 1
    why: 'Z grows steadily in one direction, so the level line leaves the region last at a corner. (It may also touch a whole edge, but then the corners of that edge are optimal too.)'
  - q: 'Maximise Z = x + y subject to x + y ≤ 4, x ≥ 0, y ≥ 0. The number of optimal points is:'
    choices: ['1', '2', 'infinitely many', '0']
    ans: 2
    why: 'Z is constant (4) along the whole edge x + y = 4, which is parallel to the level lines. Every point of that edge is optimal.'
  - q: 'The feasible region of x + y ≥ 6, x + y ≤ 4, x, y ≥ 0 is:'
    choices: ['a triangle', 'unbounded', 'empty', 'a single point']
    ans: 2
    why: 'No point can have x + y both at least 6 and at most 4. There is no feasible solution.'
sources:
  - 'NCERT Mathematics Class 12 (Linear programming): topics followed, no text copied'
  - 'KEAM, CUET and other state engineering entrance syllabi 2026: Linear programming'
---

**Maths · Class 12 · about 30 minutes.** By the end you will be able to write any small optimisation word problem as a linear programme, draw its feasible region, find the optimum by the corner point method, and handle the special cases: unbounded regions, multiple optima and empty regions. (Linear programming carries the most weight in KEAM, CUET and other state exams; check whether your own exam's current syllabus lists it. The graphing skills help everywhere.)

<div class="bigidea">Every constraint cuts the plane in half and keeps one side. What survives all the cuts is the feasible region, a polygon. The objective Z = ax + by has straight level lines, all parallel; sliding them across the polygon, the best value is where the line is about to leave, and that is always at a corner.</div>

## 1. The parts of a linear programme

<div class="meaning">
<dl>
<dt>Decision variables</dt><dd>the quantities you choose, usually x and y (how many of each product); almost always x ≥ 0, y ≥ 0</dd>
<dt>Constraints</dt><dd>linear inequalities from limited resources: machine hours, money, raw material</dd>
<dt>Objective function</dt><dd>Z = ax + by, the profit to maximise or the cost to minimise</dd>
<dt>Feasible region</dt><dd>the set of points satisfying every constraint; each point in it is a feasible solution</dd>
<dt>Optimal solution</dt><dd>a feasible point giving the best Z</dd>
<dt>Physical meaning</dt><dd>The region is everything you can afford to do; Z ranks those choices; the corner is where you use your scarce resources fully.</dd>
</dl>
</div>

## 2. Formulation

<div class="steps">
<div class="step"><b>Name the variables</b> with units: let x be the number of chairs and y the number of tables made per day.</div>
<div class="step"><b>Write one inequality per resource.</b> If a chair takes 1 hour of carpentry and a table 2 hours, and 14 hours are available: x + 2y ≤ 14.</div>
<div class="step"><b>Add the sign conditions</b> x ≥ 0, y ≥ 0 (and any "at least" requirements, written with ≥).</div>
<div class="step"><b>Write the objective</b>: profit Rs 30 per chair and Rs 40 per table gives Z = 30x + 40y, to be maximised.</div>
</div>

**Diet problems** minimise cost with "at least" constraints on nutrients (≥), so the feasible region is usually unbounded. **Transportation problems** move goods from depots to shops; writing the amount from one depot as x and y, the others follow from the totals, and every shipped amount must be ≥ 0.

## 3. Drawing the feasible region

For each constraint, draw the line (replace ≤ by =, find the two intercepts) and test a point, usually the origin: if (0, 0) satisfies the inequality, keep the origin's side. The region is the overlap of all kept sides.

<figure class="fig" data-fig="lp-corner"><figcaption>The shaded region satisfies x + 2y ≤ c₁, 3x + y ≤ c₂, x, y ≥ 0. The dashed level line passes through the optimal corner. Try p = 1, q = 2: the level lines become parallel to the first edge and two corners tie.</figcaption></figure>

## 4. The corner point method

1. Draw the feasible region and list its corner points. A corner where two slanted lines meet needs solving two equations.
2. Evaluate Z at every corner.
3. **Bounded region**: the largest value is the maximum and the smallest is the minimum. Both always exist.
4. **Unbounded region**: the candidate from the corners is only the answer if it passes the half-plane test below.

**Why corners?** Moving along any edge, Z = ax + by changes at a steady rate (it is linear), so on each edge the best point is an end of the edge. Since the best point of the whole polygon is on its boundary, it is at a corner.

Press Play to slide the dashed profit line outwards, then change the profit weights a and b.

<figure class="fig" data-fig="@math-lp-iso"><figcaption>Notice that the line leaves the region at a corner (the best point), and that changing a and b changes which corner it is, or makes a whole edge optimal.</figcaption></figure>

<div class="problem" data-problem="lp-max"></div>

## 5. Unbounded regions

Suppose the region is unbounded and the smallest corner value of Z is m. Draw the half-plane ax + by < m. If **no** point of the feasible region lies in it, m is the minimum. If some point does, there is no minimum (Z can be made as small as you like). The same test with ax + by > M decides a maximum.

**Example.** Minimise Z = 3x + 2y with x + y ≥ 8, 3x + 5y ≥ 30, x ≥ 0, y ≥ 0. Corners: (10, 0), (5, 3), (0, 8). Z: 30, 21, 16. Smallest is 16 at (0, 8). The half-plane 3x + 2y < 16 meets no feasible point (every feasible point has x + y ≥ 8 and so 3x + 2y ≥ 2(x + y) ≥ 16). So **minimum 16 at (0, 8)**. There is no maximum, since Z grows without limit as x grows.

<div class="myth">

**"An unbounded region has no optimum."** It may still have one in one direction. A diet problem's region runs off to infinity, yet its minimum cost is perfectly well defined; only its maximum fails to exist. Use the half-plane test to decide each one.

</div>

## 6. Special cases

- **Multiple optimal solutions.** If two adjacent corners give the same best Z, the level lines are parallel to that edge, and **every point** of the edge is optimal: infinitely many solutions with one optimal value. Test: Z = ax + by is parallel to the constraint line px + qy = r exactly when a/p = b/q.
- **No feasible region.** Contradictory constraints (x + y ≥ 6 and x + y ≤ 4) leave nothing, so there is no solution at all.
- **Redundant constraint.** One that does not change the region; you can ignore it once you have checked.
- **Integer (lattice) points.** If x and y must be whole numbers (chairs, people), the optimum is the best lattice point in the region near the LP corner, which may not be the rounded corner. Count lattice points row by row when asked.

## 7. Area of the feasible region

Some questions ask for the area of the region. List the corners in order around the polygon and use the shoelace formula, or split it into triangles and rectangles along the axes.

<div class="problem" data-problem="lp-area"></div>

Next: [Linear programming: question types and traps](/learn/courses/engineering-entrance/linear-programming-questions/).

<div class="keypoints">

- Variables with units, one inequality per resource, x, y ≥ 0, then Z.
- Draw each line by intercepts; test the origin to pick the side.
- Corner point method: Z at every corner; on a bounded region the best corner wins.
- Unbounded region: check the half-plane Z < m (or Z > M) for feasible points before accepting a corner.
- Two corners tie: the whole edge between them is optimal (level lines parallel to the edge).
- Contradictory constraints give an empty region: no solution.
- Area of the region: shoelace formula on the corners.

</div>
