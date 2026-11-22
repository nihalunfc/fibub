---
title: 'Systems of two linear equations'
seoTitle: 'SAT systems of equations: substitution and elimination'
summary: 'Solve two equations at once by substitution, elimination or graphing, tell when a system has no solution or infinitely many, and turn word problems into systems, with live practice.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'x + y = 10 and x − y = 4. What is x?'
    choices: ['7', '3', '14']
    ans: 0
    why: 'Add the equations: 2x = 14, so x = 7 (and y = 3).'
  - q: 'What does it mean when two lines in a system are parallel?'
    choices: ['The system has no solution', 'The system has one solution', 'The system has infinitely many solutions']
    ans: 0
    why: 'Parallel lines never meet, so no (x, y) is on both.'
  - q: '2x + 3y = 7 and 4x + 6y = c. For which c are there infinitely many solutions?'
    choices: ['14', '7', '28']
    ans: 0
    why: 'The second left side is twice the first, so the equations are the same line when c = 2 × 7 = 14.'
sources:
  - 'College Board, SAT Math content domains: Algebra (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, systems of equations (original questions) https://fibub.com/learn/courses/sat/systems-of-equations/'
---

**Module 2 · about 20 minutes · read first: [2.1](/learn/courses/sat/linear-equations/), [2.2](/learn/courses/sat/linear-functions/).** By the end you will solve any system of two linear equations three ways and know how many solutions it has before you start.

<div class="bigidea">A system asks for the one pair of numbers that makes two equations true at the same time. On a graph, that pair is where the two lines cross.</div>

## 1. What a solution looks like

Two friends buy snacks. Asha buys 2 juices and 1 sandwich for $9; Ben buys 1 juice and 1 sandwich for $6.50. Each purchase alone has many possible prices, but only one pair of prices fits both: juice $2.50, sandwich $4. That pair is the solution of the system.

<figure class="fig" data-fig="graph" data-mode="system" data-m="2" data-b="-1" data-m2="-1" data-b2="5"><figcaption>Each equation is a line. One crossing point means exactly one solution. Make the slopes equal to see the other two cases.</figcaption></figure>

| Lines | Slopes and intercepts | Solutions |
|---|---|---|
| Cross once | different slopes | **exactly one** |
| Parallel | same slope, different intercepts | **none** |
| Same line | same slope, same intercept (one equation is a multiple of the other) | **infinitely many** |

## 2. Method 1: elimination (usually fastest)

Add or subtract whole equations so one letter disappears.

<div class="steps">
<div class="step"><b>Solve:</b> 3x + 2y = 16 and x − 2y = 0.</div>
<div class="step">The y terms are +2y and −2y. <b>Add</b> the equations: 4x = 16.</div>
<div class="step">So x = 4.</div>
<div class="step">Put x = 4 into x − 2y = 0: 4 = 2y, so y = 2. Check in the first: 12 + 4 = 16. ✓</div>
</div>

If no terms match, multiply one equation (or both) first: to eliminate x from 2x + 3y = 8 and 5x + 4y = 13, multiply the first by 5 and the second by 2, then subtract.

<div class="problem" data-problem="sy-g01"></div>

## 3. Method 2: substitution

Best when one equation already says "y = ..." or "x = ...". Put that expression into the other equation.

y = 3x − 1 and 2x + y = 14 → 2x + (3x − 1) = 14 → 5x = 15 → x = 3, y = 8.

## 4. Method 3: graph it

In Desmos, type both equations exactly as given and click the crossing point ([Lesson 1.3](/learn/courses/sat/desmos-calculator/)). Great for ugly numbers.

<div class="meaning">

<dl>
<dt>Solution (x, y)</dt><dd>the pair that makes both equations true</dd>
<dt>Elimination</dt><dd>add or subtract equations to remove one letter</dd>
<dt>Substitution</dt><dd>replace a letter with what it equals from the other equation</dd>
<dt>Physical meaning</dt><dd>Each equation alone has endless solutions (every point on its line). Two independent facts pin down one point, which is why you need two equations to find two unknowns.</dd>
</dl>

</div>

## 5. The "x + y" shortcut

If a question asks for x + y or x − y, try adding or subtracting the two equations straight away. For 5x + 3y = 31 and 3x + 5y = 33, adding gives 8x + 8y = 64, so x + y = 8. No need for x and y separately.

<div class="problem" data-problem="sy-g05"></div>

## 6. Constants that change the number of solutions

"For which value of c does the system have no solution?" Make the left sides proportional (same slope) but the right sides not. "Infinitely many?" Make the whole second equation a multiple of the first.

<div class="problem" data-problem="sy-g03"></div>

## 7. Word problems

Name the two unknowns, then write one equation for each fact. Usually one fact counts things and one adds up money, weight or points.

<div class="problem" data-problem="sy-g04"></div>

<div class="myth">

**"I found x, so I'm done."** Many SAT questions ask for y, or for x + y, or for the price of one item. Read the last line again before you choose an answer: the option that equals x is often there as a trap.

</div>

<div class="keypoints">

- The solution of a system is the point where the two lines cross.
- Different slopes: one solution. Same slope, different intercepts: none. Same line: infinitely many.
- Elimination (add or subtract equations) is usually fastest; substitution suits "y = ..." equations; Desmos suits ugly numbers.
- For x + y or x − y, try adding or subtracting the equations directly.
- In word problems, write one equation per fact, and answer the question actually asked.

</div>
