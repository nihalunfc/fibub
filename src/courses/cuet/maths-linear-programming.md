---
title: 'Maths: linear programming'
seoTitle: 'Linear programming for CUET Maths: the corner point method'
summary: 'Turning a word problem into a linear programming problem, drawing the feasible region, and finding the best value with the corner point method, including unbounded regions, with a live problem.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: 'In the corner point method, the optimal value of Z occurs:'
    choices: ['at a corner point of the feasible region', 'at the centre of the region', 'only at the origin']
    ans: 0
    why: 'A linear objective is a flat slope over the region; its highest and lowest points on a polygon are always at corners.'
  - q: 'The constraints x ≥ 0 and y ≥ 0 are called:'
    choices: ['non-negativity constraints', 'objective constraints', 'optimal constraints']
    ans: 0
    why: 'They say you cannot make a negative number of items.'
  - q: 'If the feasible region is unbounded, a maximum:'
    choices: ['may not exist, and must be checked with an extra inequality', 'always exists at a corner', 'is always zero']
    ans: 0
    why: 'Check whether the half-plane Z > M (M the largest corner value) overlaps the region. If it does, there is no maximum.'
sources:
  - 'NCERT, Mathematics Part II (Class 12), Linear Programming'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 16 minutes.** A short, scoring chapter. By the end you will set up and solve any two-variable LPP.

<div class="bigidea">Linear programming finds the best plan when resources are limited. Draw every limit as a straight line, the allowed plans form a polygon, and the best plan is always at one of its corners.</div>

**Everyday picture:** a tiffin service with 20 kg of rice and 8 hours of cooking time, making veg and chicken meals that earn different profits. How many of each should it cook? Every limit is a line; the answer sits at a corner where two limits meet.

## 1. Setting up

| Part | Meaning | Example |
|---|---|---|
| Decision variables | what you choose | x veg meals, y chicken meals |
| Objective function | what you maximise or minimise | Z = 40x + 60y (profit) |
| Constraints | the limits | x + y ≤ 20, x ≤ 12, y ≤ 15 |
| Non-negativity | no negative amounts | x ≥ 0, y ≥ 0 |

## 2. The corner point method

<div class="steps" data-title="Solving an LPP graphically">
<div class="step"><b>Draw each constraint</b> as a line (replace ≤ with =) and shade the side that satisfies it (test (0, 0)).</div>
<div class="step"><b>The feasible region</b> is where all the shadings overlap.</div>
<div class="step"><b>List the corners:</b> the axes' intercepts and where boundary lines cross (solve their equations together).</div>
<div class="step"><b>Evaluate Z</b> at every corner.</div>
<div class="step"><b>Bounded region:</b> the largest is the maximum and the smallest the minimum. <b>Unbounded:</b> check the extra half-plane before you claim one.</div>
</div>

<div class="problem" data-problem="lp-corner"></div>

<div class="meaning">

<dl>
<dt>Feasible solution</dt><dd>any point in the region: a plan that breaks no rule.</dd>
<dt>Optimal solution</dt><dd>the feasible point that gives the best Z. If two corners tie, every point on the edge between them is optimal too.</dd>
<dt>Physical meaning</dt><dd>moving the line Z = constant parallel to itself until it last touches the region shows why corners win.</dd>
</dl>

</div>

<div class="myth">

**"The best answer is where all constraints are used up exactly."** Often one resource is left over. The optimum is at a corner where some constraints are tight, not necessarily all of them.

</div>

## 3. Practice

Do the live problem above until you get five right in a row, then try the question set.

<div class="qbank" data-bank="entrance-maths" data-topics="linear-programming" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Variables, objective, constraints, non-negativity.
- Feasible region = overlap of all constraints.
- Evaluate Z at every corner; bounded → max and min exist.
- Unbounded: check Z &gt; M (or Z &lt; m) has no point in the region.

</div>
