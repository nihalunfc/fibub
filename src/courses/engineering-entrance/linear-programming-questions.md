---
title: 'Linear programming: question types and traps'
seoTitle: 'Linear programming questions: types and traps'
summary: 'Every way entrance exams ask about linear programming: formulation of word problems, graphing constraints, identifying the feasible region, the corner point method, bounded and unbounded regions, multiple optimal solutions, empty regions, lattice points and the area of the region, each with a method and its trap.'
minutes: 22
updated: 2026-11-22
quiz:
  - q: 'Which point is in the region x + y ≤ 5, x − y ≥ 1, x, y ≥ 0?'
    choices: ['(1, 2)', '(3, 1)', '(0, 0)', '(2, 4)']
    ans: 1
    why: '(3, 1): 3 + 1 = 4 ≤ 5 and 3 − 1 = 2 ≥ 1. (1, 2) fails x − y ≥ 1; (0, 0) fails it too; (2, 4) fails both.'
  - q: 'Z = px + qy (p, q > 0) has the same maximum at (2, 3) and (5, 1). Then:'
    choices: ['p = q', '2p = 3q', '3p = 2q', 'p = 2q']
    ans: 2
    why: '2p + 3q = 5p + q gives 2q = 3p.'
  - q: 'How many points with whole-number coordinates satisfy x + 2y ≤ 6, x ≥ 0, y ≥ 0?'
    choices: ['12', '14', '16', '18']
    ans: 2
    why: 'y = 0: x = 0 to 6 (7 points); y = 1: 0 to 4 (5); y = 2: 0 to 2 (3); y = 3: x = 0 (1). Total 16.'
sources:
  - 'KEAM, CUET and other state engineering entrance syllabi 2026: Linear programming; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 22 minutes.** Read [Linear programming](/learn/courses/engineering-entrance/linear-programming/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Linear programming questions are short if the picture is right. Draw each line by its two intercepts, shade carefully, list the corners in order, and the rest is arithmetic. The traps are all in the special cases: unbounded regions, ties and empty regions.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Formulation.</b> Turn a factory, diet or transport story into constraints and Z. <i>Trap:</i> writing ≤ for "at least" or forgetting x, y ≥ 0.</div>
<div class="step"><b>2. Graphing constraints and feasible region.</b> Which region a set of inequalities describes, or which point is feasible. <i>Method:</i> test the origin for each line.</div>
<div class="step"><b>3. Corner point method.</b> Max or min of Z on a bounded region. <i>Trap:</i> missing the corner where two slanted lines meet.</div>
<div class="step"><b>4. Bounded and unbounded regions.</b> Does an optimum exist? <i>Method:</i> the half-plane test Z &lt; m (or Z &gt; M).</div>
<div class="step"><b>5. Multiple optimal solutions.</b> Two corners tie; conditions on p and q so they do. <i>Trap:</i> answering "two solutions" instead of "infinitely many".</div>
<div class="step"><b>6. Objective function questions.</b> Find p, q from where the optimum occurs. <i>Method:</i> equate Z at the given points.</div>
<div class="step"><b>7. Lattice points and area.</b> Count whole-number points row by row; area by shoelace or triangles.</div>
<div class="step"><b>8. Infeasible problems.</b> Contradictory constraints. <i>Trap:</i> evaluating Z at "corners" that are not in any region.</div>
</div>

## Worked examples

**Example 1 (level 3, corner point).** Maximise Z = 5x + 3y subject to 3x + 5y ≤ 15, 5x + 2y ≤ 10, x, y ≥ 0. *Solution.* Corners: (0, 0), (2, 0), (0, 3), and the meeting point of the two lines, (20/19, 45/19). Z = 0, 10, 9 and 235/19 ≈ 12.37. **Maximum 235/19 at (20/19, 45/19).**

**Example 2 (level 4, manufacturing).** A unit of A needs 2 machine hours and 1 labour hour; a unit of B needs 1 machine hour and 2 labour hours. 10 machine hours and 11 labour hours are available. Profit is Rs 40 per A and Rs 50 per B. *Solution.* Maximise Z = 40x + 50y with 2x + y ≤ 10, x + 2y ≤ 11, x, y ≥ 0. Corners: (0, 0), (5, 0), (0, 5.5), (3, 4). Z = 0, 200, 275, 320. **Make 3 of A and 4 of B for Rs 320.**

**Example 3 (level 4, unbounded with a tie).** Minimise Z = x + 2y subject to 2x + y ≥ 3, x + 2y ≥ 6, x, y ≥ 0. *Solution.* The two slanted lines meet at (0, 3), so the corners are (0, 3) and (6, 0), both giving Z = 6. The half-plane x + 2y < 6 contains no feasible point. **Minimum 6 at every point of the segment from (0, 3) to (6, 0)**: infinitely many optimal points. There is no maximum.

**Example 4 (level 5, parameter).** For the region with corners (0, 0), (4, 0), (3, 2), (0, 3), find the condition on p, q > 0 for Z = px + qy to be maximised only at (3, 2). *Solution.* Need Z(3, 2) > Z(4, 0) and Z(3, 2) > Z(0, 3): 3p + 2q > 4p gives q > p/2, and 3p + 2q > 3q gives q < 3p. **p/2 < q < 3p.**

<div class="myth">

**"If the region is unbounded, just report the best corner."** For a minimum on a region that runs away from the origin this is often right, but you must check: if the half-plane Z &lt; m contains feasible points, Z has no minimum at all. An exam option "no optimal solution" is there for this reason.

</div>

<div class="meaning">
<dl>
<dt>Corner</dt><dd>a vertex of the feasible region; where two boundary lines meet and every constraint holds</dd>
<dt>Half-plane test</dt><dd>for a candidate minimum m on an unbounded region, check that ax + by &lt; m has no feasible points</dd>
<dt>Tie</dt><dd>equal Z at two adjacent corners means the whole edge is optimal</dd>
<dt>Physical meaning</dt><dd>Sliding the profit line outwards, the last point of the region it touches is the best plan. If it leaves along an edge, every plan on that edge earns the same.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="linear-programming" data-mode="practice"></div>

<div class="keypoints">

- "At least" means ≥, "at most" means ≤; always add x, y ≥ 0.
- Draw lines by intercepts; test the origin to choose the side.
- List every corner, including slanted-line intersections; evaluate Z at each.
- Unbounded region: confirm with the half-plane test before reporting an optimum.
- Two tying corners: infinitely many optimal solutions along the edge.
- Optimum only at a given corner: Z there must beat Z at both neighbours.

</div>
