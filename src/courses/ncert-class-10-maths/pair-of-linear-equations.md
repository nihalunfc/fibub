---
title: Pair of Linear Equations in Two Variables
seoTitle: 'Pair of Linear Equations Class 10 notes: methods'
summary: 'Class 10 Pair of Linear Equations with animations: graphs of two lines, consistent and inconsistent pairs, substitution, elimination and word problems.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'The pair x + 2y = 5 and 2x + 4y = 12 has:'
    choices: ['no solution', 'exactly one solution', 'infinitely many solutions', 'exactly two solutions']
    ans: 0
    why: 'a₁/a₂ = 1/2 and b₁/b₂ = 2/4 = 1/2, but c₁/c₂ = 5/12 is different. The lines are parallel, so the pair is inconsistent: no solution.'
  - q: 'Solving x + y = 9 and x − y = 3 gives:'
    choices: ['x = 6, y = 3', 'x = 3, y = 6', 'x = 5, y = 4', 'x = 7, y = 2']
    ans: 0
    why: 'Adding the equations gives 2x = 12, so x = 6. Then y = 9 − 6 = 3. Check: 6 − 3 = 3.'
  - q: 'If the graphs of two linear equations are coincident lines, the pair has:'
    choices: ['infinitely many solutions', 'one solution', 'no solution', 'two solutions']
    ans: 0
    why: 'Coincident lines share every point, and each point is a solution of both equations.'
sources:
  - 'NCERT Class 10 Maths, Chapter 3 “Pair of Linear Equations in Two Variables” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Chiu Chang Suan Shu (The Nine Chapters on the Mathematical Art), chapter 8 “Fangcheng”, earliest known elimination of unknowns (about 200 BCE to 100 CE)'
  - 'Brahmagupta, Brahmasphutasiddhanta (628 CE), for early Indian treatment of simultaneous linear equations'
---

**Maths · Class 10 · Chapter 3 · about 50 minutes.** By the end you will be able to draw a pair of linear equations as two lines, say whether the pair has one solution, none or infinitely many, solve it by substitution and elimination, and turn a word problem into a pair of equations.

<div class="bigidea">One equation in two unknowns has endless answers, a whole line of them. Two equations are two lines, and the answer to both at once is where the lines meet. The lines can meet once, never (parallel) or everywhere (the same line), and the numbers a, b, c tell you which.</div>

## 1. One equation, many solutions

An equation like 2x + y = 8 has two unknowns, x and y. A **solution** is a pair of values that makes it true: x = 2, y = 4 works because 2(2) + 4 = 8. So does x = 3, y = 2, and x = 0, y = 8, and x = 1.5, y = 5. There are endlessly many, and every one is a point on a straight line. That is why it is called a **linear** equation: the general form is ax + by = c.

<figure class="fig" data-fig="c10-pair-oneline"><figcaption>Choose a, b and c, then slide x. For each x the matching y is found, and the point lands on the line. Every point on the line (the grey dots are the whole-number ones) is a solution: one equation alone cannot give one answer. Set b to 0 to get a vertical line.</figcaption></figure>

One equation is not enough to decide the two unknowns. If I tell you only “a notebook and a pen together cost ₹12”, you cannot tell the price of each. Add a second fact, and the answer can become exact.

## 2. A pair of linear equations: the graphical method

A **pair of linear equations in two variables** is two equations like

```math
a_1x + b_1y = c_1, \qquad a_2x + b_2y = c_2
```

A solution of the pair is a point that lies on **both** lines. So we draw both lines and look at where they meet. Try the guessing game first: you are told the prices through two facts about a shopping bill, and you try prices until both facts are true.

<figure class="fig" data-fig="c10-pair-guess"><figcaption>“2 notebooks and 1 pen cost ₹19. 1 notebook and 3 pens cost ₹22.” Slide the prices (or click the graph) and read the ticks. A point on the blue line satisfies the first fact; a point on the orange line the second. Only where the lines cross are both ticks true.</figcaption></figure>

### Three possible pictures

Two straight lines on a flat page can be in only three positions:

1. **They cross at one point.** One solution. The pair is called **consistent**.
2. **They are parallel** and never meet. No solution. The pair is **inconsistent**.
3. **They lie exactly on top of each other** (coincident). Infinitely many solutions. The pair is **consistent** and **dependent**.

<figure class="fig" data-fig="c10-pair-lines"><figcaption>Change any of a₁, b₁, c₁, a₂, b₂, c₂, or press a preset. The readout shows the three ratios and which case it is. When the lines cross, a dot marks the solution.</figcaption></figure>

The ratios of the coefficients tell you the case without drawing:

<div class="meaning">
<dl>
<dt>a₁/a₂ ≠ b₁/b₂</dt><dd>the lines intersect: exactly one solution (consistent)</dd>
<dt>a₁/a₂ = b₁/b₂ ≠ c₁/c₂</dt><dd>the lines are parallel: no solution (inconsistent)</dd>
<dt>a₁/a₂ = b₁/b₂ = c₁/c₂</dt><dd>the lines coincide: infinitely many solutions (dependent)</dd>
<dt>Physical meaning</dt><dd>a₁/a₂ and b₁/b₂ compare how steep the two lines are. Different steepness means they must cross somewhere. Same steepness means they are parallel, and then the c-ratio decides whether they are separate lines or the same line.</dd>
</dl>
</div>

Watch the second line move so that the pair goes through all three cases, and keep an eye on the ratios:

<figure class="fig" data-fig="c10-pair-cases"><figcaption>Press Play. The fixed line is x + y = 6; the moving line starts crossing it, then lands on top of it (coincident), slides away parallel (no solution), then tilts and crosses again. The ratios are shown at every moment.</figcaption></figure>

<div class="myth">

**“Two lines always meet somewhere, so every pair has a solution.”** Parallel lines never meet. A pair such as x + y = 6 and x + y = 10 asks for numbers whose sum is 6 and also 10, which is impossible: no solution.

</div>

Draw any pair you like and see the three cases, and read off the answer, with the pair solver tool:

<!--fig:tool linear-pair-solver-->

**Drawing the lines by hand.** For each equation, find two or three points: put x = 0 to get y, then y = 0 to get x, then one more point as a check. Plot, join with a ruler, and read where they cross. For x + y = 7: (0, 7), (7, 0) and (3, 4). For 2x − y = 5: (0, −5), (2.5, 0) and (4, 3). They cross at (4, 3).

## 3. Algebraic methods

Graphs are slow, and you can only read an answer to the accuracy of your ruler. Algebra gives exact answers. There are two main methods; both turn two unknowns into one.

### 3.1 Substitution method

Solve one equation for one variable, then **substitute** that into the other.

<div class="steps" data-fig="c10-pair-subst">
<div class="step">Solve x + y = 7 and 2x − y = 5.</div>
<div class="step">From the first equation, make y the subject: y = 7 − x.</div>
<div class="step">Put “7 − x” in place of y in the second equation: 2x − (7 − x) = 5. Mind the bracket: the minus changes both signs.</div>
<div class="step">Simplify: 2x − 7 + x = 5, so 3x = 12 and x = 4.</div>
<div class="step">Back-substitute into y = 7 − x: y = 7 − 4 = 3.</div>
<div class="step">Check in the second equation: 2(4) − 3 = 5. It works. The graph shows the two lines crossing at (4, 3).</div>
</div>

<div class="problem" data-problem="c10m-pair-solve"></div>

### 3.2 Elimination method

Make the coefficients of one variable equal (or opposite) by multiplying, then add or subtract the equations so that variable disappears.

<div class="steps" data-fig="c10-pair-elim">
<div class="step">Solve 3x + 2y = 16 and x − y = 2.</div>
<div class="step">The y terms are +2y and −y. Multiply the second equation by 2 so it becomes 2x − 2y = 4: now the y terms are +2y and −2y.</div>
<div class="step">Add the two equations. The y terms cancel: 3x + 2x = 16 + 4, so 5x = 20.</div>
<div class="step">Divide: x = 4.</div>
<div class="step">Put x = 4 in x − y = 2: 4 − y = 2, so y = 2.</div>
<div class="step">Check in the first equation: 3(4) + 2(2) = 16. The lines meet at (4, 2).</div>
</div>

<div class="myth">

**“After multiplying one equation, I can leave the other side alone.”** Multiply *every* term, including the number on the right. Multiplying 2x − 2y = 4 gives 4 on the right because 2 × 2 = 4; writing 2 would give a different line.

</div>

**What happens in the other cases?** If, while eliminating, **both** variables vanish and you get a true statement such as 0 = 0, the lines coincide (infinitely many solutions). If you get a false one such as 0 = 7, the lines are parallel (no solution).

<div class="problem" data-problem="c10m-pair-k"></div>

**Which method?** Use substitution when one equation already has a variable with coefficient 1 or −1 (like y = 7 − x). Use elimination when the coefficients line up easily. Both give the same answer; choose the one with less arithmetic.

## 4. Word problems: from story to two lines

Most real problems hide a pair of linear equations. The recipe is always the same:

1. Read the story and name the two unknowns (x and y), with units.
2. Write one equation for each fact in the story.
3. Solve by substitution or elimination.
4. Put the answer back into the story to check, and answer in words.

<div class="steps" data-fig="c10-pair-model">
<div class="step">A 4 km auto ride costs ₹70, and a 7 km ride costs ₹115. What are the fixed charge and the rate per km?</div>
<div class="step">Name the unknowns: x = the fixed (meter-down) charge in ₹, y = the charge per km in ₹.</div>
<div class="step">The first ride is the fixed charge plus 4 km: x + 4y = 70.</div>
<div class="step">The second ride: x + 7y = 115.</div>
<div class="step">Draw the first equation: every (x, y) that matches the first ride lies on this line.</div>
<div class="step">Draw the second: every pair matching the second ride lies on this one.</div>
<div class="step">They cross at only one point, (10, 15): a fixed charge of ₹10 and ₹15 per km. Check: 10 + 4(15) = 70 and 10 + 7(15) = 115.</div>
</div>

Practise turning stories into equations with the word-problem tool, which gives you the story and checks your equations:

<!--fig:tool linear-word-problems-->

<div class="problem" data-problem="c10m-pair-fare"></div>

<div class="problem" data-problem="c10m-pair-numbers"></div>

<div class="problem" data-problem="c10m-pair-age"></div>

**Common types you will meet.**

- **Numbers:** “The sum of two numbers is 40 and their difference is 12.” Equations: x + y = 40, x − y = 12.
- **Ages:** “A father is 24 years older than his son. After 4 years their ages add up to 60.” Add the same years to both.
- **Money:** “Five notebooks and two pens cost ₹58.” Costs are price × number.
- **Boats and streams:** speed downstream = boat + stream; upstream = boat − stream.
- **Digits and fractions:** a two-digit number is 10x + y. Careful: it is 10 times the tens digit, not just x.

<div class="history">

<ul class="timeline">
<li><b>about 200 BCE to 100 CE</b> The Chinese text Nine Chapters on the Mathematical Art solves several equations in several unknowns by a method just like elimination.</li>
<li><b>628 CE</b> Brahmagupta writes about simultaneous equations and their solutions in Brahmasphutasiddhanta.</li>
<li><b>1637</b> Descartes joins algebra and geometry, so each equation becomes a line and its solution a point.</li>
</ul>

</div>

<div class="keypoints">

- ax + by = c has infinitely many solutions; its graph is a straight line.
- A pair of linear equations has one solution (intersecting lines), none (parallel lines) or infinitely many (coincident lines).
- a₁/a₂ ≠ b₁/b₂: one solution. a₁/a₂ = b₁/b₂ ≠ c₁/c₂: none. All three ratios equal: infinitely many.
- Substitution: solve one equation for a variable, put it in the other.
- Elimination: multiply so one variable has equal (or opposite) coefficients, then add or subtract to remove it.
- For a word problem: name unknowns, write one equation per fact, solve, and check in the story.

</div>
