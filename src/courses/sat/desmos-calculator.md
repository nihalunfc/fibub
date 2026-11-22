---
title: 'Using the built-in Desmos calculator well'
seoTitle: 'Desmos on the digital SAT: tricks that save time'
summary: 'The digital SAT has a Desmos graphing calculator built in for every Math question. Learn the five moves that solve equations, systems and quadratics in seconds, and when doing it by hand is faster.'
minutes: 14
updated: 2026-11-22
quiz:
  - q: You want to solve 3x − 7 = x + 5 with Desmos. What do you type?
    choices: ['y = 3x − 7 and y = x + 5, then click where the lines cross', 'Only 3x − 7', 'x = 3x − 7 + 5']
    ans: 0
    why: 'Graph each side as its own line. The x-value of the crossing point is the solution (x = 6).'
  - q: In Desmos, where do you read the solutions of x² − x − 6 = 0?
    choices: ['Where the graph of y = x² − x − 6 crosses the x-axis', 'At the y-intercept', 'At the vertex']
    ans: 0
    why: 'Solutions of f(x) = 0 are the x-intercepts of y = f(x): here x = −2 and x = 3.'
  - q: When is solving by hand usually faster than Desmos?
    choices: ['Simple one-step or two-step equations', 'Systems of equations', 'Finding a vertex']
    ans: 0
    why: 'If you can see the answer in a step or two, typing takes longer. Use Desmos for messy numbers, systems, quadratics and checking.'
sources:
  - 'College Board, Using the Desmos graphing calculator on the digital SAT https://satsuite.collegeboard.org/digital/what-to-bring-do/calculator'
  - 'Desmos, Graphing calculator user guide https://help.desmos.com/'
---

**Module 1 · about 14 minutes · read first: [1.1](/learn/courses/sat/how-the-digital-sat-works/).** By the end you will know five Desmos moves that answer common SAT question types, and when to put the calculator away.

<div class="bigidea">Almost every equation question is a question about where graphs meet. Desmos draws the graphs for you, so you can read off answers instead of grinding through algebra, as long as you know what to type.</div>

## 1. Where it is and how to practise

In the Math section, the calculator button opens a full Desmos graphing calculator next to the question. You can make it wider and drag it around. It is the same as the free calculator at desmos.com, so you can practise with it at home. You may also bring your own approved calculator, but most students find Desmos faster for graphs.

## 2. Five moves worth knowing

**Move 1: Solve an equation by graphing both sides.** Type the left side as `y = ...` and the right side as another `y = ...`. Click the crossing point; its x-value is the solution. Play with it below: the solution of "line 1 = line 2" is where they cross.

<figure class="fig" data-fig="graph" data-mode="system" data-m="3" data-b="-6" data-m2="1" data-b2="2"><figcaption>Desmos-style view of a system. Change the slopes and intercepts: one crossing means one solution; parallel lines mean none; the same line means infinitely many.</figcaption></figure>

**Move 2: Solve a quadratic by finding x-intercepts.** Type `y = 2x^2 − 3x − 9`. Grey dots appear where the graph crosses the x-axis; click them to see the solutions (here x = −1.5 and x = 3). The vertex appears as a dot too.

**Move 3: Systems of equations.** Type each equation exactly as given, even in a form like `3x + 2y = 12`. Desmos graphs it without you solving for y. Click the crossing.

**Move 4: Sliders for unknown constants.** If a question says "k is a constant" and asks which k gives no solution, type the equation with k; Desmos offers a slider. Drag it and watch when the lines become parallel or the parabola stops touching the axis.

**Move 5: Lists and statistics.** Type `L = [3, 7, 7, 10, 18]`, then `mean(L)`, `median(L)` or `stdev(L)`. For a line of best fit from a table, enter the table and type `y1 ~ m x1 + b`.

<div class="meaning">

<dl>
<dt>Crossing point</dt><dd>the (x, y) that makes both equations true: the solution of a system</dd>
<dt>x-intercept</dt><dd>where y = 0: the solution of "expression = 0"</dd>
<dt>Slider</dt><dd>a letter Desmos lets you change by dragging, to see how a constant changes the graph</dd>
<dt>Physical meaning</dt><dd>An equation asks "for which x are these two things equal?". On a graph, "equal" means "at the same height", which is where the graphs meet.</dd>
</dl>

</div>

## 3. Worked example

<div class="steps">
<div class="step"><b>Question:</b> y = x² − 4x + 1 and y = 2x − 7. What is the sum of the x-coordinates of the solutions?</div>
<div class="step">Type both equations into Desmos as written.</div>
<div class="step">Two crossing points appear. Click each: (2, −3) and (4, 1).</div>
<div class="step">Sum of x-coordinates: 2 + 4 = <b>6</b>. (By hand: x² − 6x + 8 = 0, and the sum of the solutions is 6.)</div>
</div>

<div class="myth">

**"Desmos is always faster."** Typing a long expression takes time and one typo gives a wrong graph. For 2x + 3 = 11, just think: 2x = 8, x = 4. Use Desmos for messy numbers, systems, quadratics, finding a vertex, statistics and checking an answer you got by hand.

</div>

## 4. Typing tips

- Use `^` for powers and `sqrt` for square roots; type `pi` for π.
- Brackets matter: `1/(x+2)` is not `1/x+2`.
- Zoom out (or use the home button) if you see no crossing point; it may be off screen.
- Answers like 1.333 are probably 4/3. The SAT accepts either in typed answers, but a fraction may be needed to match an option.

<div class="keypoints">

- Graph each side of an equation and click the crossing to solve it.
- Solutions of "expression = 0" are the x-intercepts of y = expression.
- Type systems exactly as given; drag sliders for "k is a constant" questions.
- Use lists for mean, median and standard deviation, and `~` for a best-fit line.
- For one- and two-step equations, solving by hand is faster.

</div>
