---
title: 'Orienting Yourself: The Use of Coordinates'
seoTitle: 'Coordinate Geometry Class 9 notes: Cartesian plane'
summary: 'Class 9 Coordinates with games and animations: the Cartesian plane, quadrants, plotting, reading map grids, and distance on and off the axes with Pythagoras.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'Which point lies in the third quadrant?'
    choices: ['(−4, −1)', '(4, −1)', '(−4, 1)', '(0, −3)']
    ans: 0
    why: 'The third quadrant has both x and y negative. (4, −1) is in quadrant IV, (−4, 1) is in II, and (0, −3) is on the y-axis, so it is in no quadrant.'
  - q: 'The distance between (−3, 5) and (4, 5) is:'
    choices: ['7', '1', '5', '12']
    ans: 0
    why: 'The y-coordinates match, so the points lie on a horizontal line and the distance is |4 − (−3)| = 7. The points are on opposite sides of the y-axis, so you add 3 and 4.'
  - q: 'What is the distance between (1, 2) and (4, 6)?'
    choices: ['5', '7', '25', '3']
    ans: 0
    why: 'Across 3, up 4. By Pythagoras d² = 3² + 4² = 25, so d = 5.'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 1 “Orienting Yourself: The Use of Coordinates” (topic list only; all text, figures and questions here are original fibub work)'
  - 'René Descartes, La Géométrie (1637), for the idea of describing points by numbers measured from two axes'
---

**Maths · Class 9 · Chapter 1 · about 45 minutes.** By the end you will be able to plot and read any point on the Cartesian plane, name its quadrant, read a map grid, and find the distance between two points, both along a line parallel to an axis and across the slant using Pythagoras.

<div class="bigidea">Two numbers are enough to say exactly where something is on a flat surface: how far across, then how far up or down. Once every point has an address (x, y), geometry becomes arithmetic: distances turn into subtraction and Pythagoras.</div>

## 1. Why we need an address for a point

How do you tell a friend where your seat is in a cinema? “Row F, seat 12” is two numbers, and nobody needs to see the hall to find it. A chess player says “knight to e5”. A cricket commentator says the fielder is “at deep square leg”. All of these are **addresses** built from fixed reference lines.

In maths the reference lines are two number lines that cross at right angles. The horizontal one is the **x-axis**, the vertical one is the **y-axis**, and they cross at the **origin O**. Together they make the **Cartesian plane**, named after René Descartes, who is said to have thought of it while lying in bed watching a fly on the ceiling: two numbers could say exactly where the fly was.

## 2. The Cartesian plane and ordered pairs

A point is written as an **ordered pair** (x, y).

- The **x-coordinate** (the abscissa) says how far the point is to the right (+) or left (−) of the y-axis.
- The **y-coordinate** (the ordinate) says how far it is above (+) or below (−) the x-axis.

“Ordered” matters: (3, 5) and (5, 3) are different places, just as seat 5 of row 3 is not seat 3 of row 5.

<div class="steps" data-fig="c9-coord-plotsteps">
<div class="step">To plot (4, −3) begin at the origin O (0, 0), where the two axes cross.</div>
<div class="step">The first number is x = +4. Positive means right, so walk 4 steps along the x-axis to the right.</div>
<div class="step">The second number is y = −3. Negative means down, so walk 3 steps down, parallel to the y-axis.</div>
<div class="step">Mark the dot. This is the point (4, −3). Its x is positive and its y is negative, so it is in quadrant IV.</div>
<div class="step">Now (−2, 3). Negative x, so first walk 2 steps to the left.</div>
<div class="step">Then 3 steps up, because y = +3. You are at (−2, 3), in quadrant II. Walking y first would have landed you somewhere else: order matters.</div>
</div>

Try your own points. Click the grid or drag the sliders and watch the two moves.

<figure class="fig" data-fig="c9-coord-plane"><figcaption>Click any crossing of the grid. The blue dashed line is the x-move along the x-axis; the green one is the y-move up or down. The dot lands where the two moves meet. The readout says it in words.</figcaption></figure>

<div class="myth">

**“The point (2, 5) is the same as (5, 2).”** They are different points. The first number always belongs to the x-axis. A good habit: say “across, then up”, or “walk to the lift, then take the lift”.

</div>

## 3. The four quadrants

The two axes cut the plane into four regions called **quadrants**, numbered **anticlockwise** starting from the top right.

| Quadrant | x | y | Example |
|---|---|---|---|
| I (top right) | + | + | (3, 2) |
| II (top left) | − | + | (−3, 2) |
| III (bottom left) | − | − | (−3, −2) |
| IV (bottom right) | + | − | (3, −2) |

A point **on an axis** belongs to no quadrant. On the x-axis the y-coordinate is 0, as in (4, 0). On the y-axis the x-coordinate is 0, as in (0, −2). The origin is (0, 0).

<figure class="fig" data-fig="c9-coord-quad"><figcaption>In <b>Explore</b> mode, click anywhere and read the signs. Switch to <b>Game</b>: a pair appears in the title, and you click the quadrant (or the axis, for pairs with a zero) where it belongs. Try to beat your own score.</figcaption></figure>

<div class="problem" data-problem="c9m-coord-quad"></div>

## 4. Treasure hunting with coordinates

Pirates in stories always follow a map. Our map has a grid. Each clue gives a pair, and you click the crossing it names. The last clue is a puzzle: the treasure has the same x as one place and the same y as another, which makes sure you really understand what each number means.

<figure class="fig" data-fig="c9-coord-treasure"><figcaption>Click the grid point named in the clue. A wrong click tells you which point you clicked and what the clue wanted. The final dashed lines show how the treasure’s x comes from the well and its y from the boat.</figcaption></figure>

Here is a tool that hides a target on the plane and lets you hunt for it with guesses. It is good for building the habit of reading both numbers.

<!--fig:tool coordinate-hunt-->

## 5. Reading a map grid

Real maps use the same idea. A road atlas puts letters along the top and numbers down the side, so “C4” names a whole **square**. A coordinate grid names an exact **crossing**. A square has an area; a point has none, so coordinates are more precise.

<figure class="fig" data-fig="c9-coord-map"><figcaption>A small town with five places. Switch between <b>cell names</b> (a column letter and row number name the whole square) and <b>coordinates</b> (an exact crossing). Choose a From and a To: the dashed blue path is the walk along the streets, the straight green line is the shortest possible distance.</figcaption></figure>

Walking along streets in a city like Chennai or Kochi, you cannot cut through buildings, so the distance you walk is (across) + (up). The straight “as the crow flies” distance is shorter. You will learn to find that one in section 7.

<div class="problem" data-problem="c9m-coord-taxi"></div>

## 6. Distance when the points share an x or a y

Two points on the same **horizontal** line have the same y. Their distance is the difference of their x-coordinates, always taken as a positive number:

```math
d = |x_2 - x_1|
```

Two points on the same **vertical** line have the same x, and the distance is |y₂ − y₁|.

<div class="meaning">
<dl>
<dt>|a − b|</dt><dd>the absolute value: the size of the difference, ignoring its sign, so the distance is never negative</dd>
<dt>(x₁, y₁), (x₂, y₂)</dt><dd>the coordinates of the first and the second point</dd>
<dt>Physical meaning</dt><dd>The distance is the number of unit steps you walk along the grid line from one point to the other. If the points are on opposite sides of an axis, you walk to the axis first and then on, so you add the two distances from the axis.</dd>
</dl>
</div>

<figure class="fig" data-fig="c9-coord-parallel"><figcaption>Choose horizontal or vertical, then slide the two points. When they are on opposite sides of an axis the readout reminds you to add the two distances: the points (−3, 2) and (4, 2) are 3 + 4 = 7 apart, not 1.</figcaption></figure>

<div class="myth">

**“The distance between (−3, 2) and (4, 2) is 4 − 3 = 1.”** That throws away the minus sign. Always subtract the whole numbers: 4 − (−3) = 7. If you are unsure, count the steps on the grid.

</div>

<div class="problem" data-problem="c9m-coord-parallel"></div>

## 7. Distance between any two points

What if the points are neither on a horizontal nor a vertical line? Make them so. From A draw a horizontal line, from B a vertical one, and let them meet at C. You now have a right triangle with the right angle at C. Its two short sides are easy: |x₂ − x₁| and |y₂ − y₁|. The slanting side AB is the distance we want, and **Pythagoras** gives it.

<div class="steps" data-fig="c9-coord-diststeps">
<div class="step">Take A (1, 1) and B (5, 4). The line AB slants, so the distance is not a simple subtraction.</div>
<div class="step">Draw a horizontal line from A to C (5, 1). Its length is the difference of the x-values: 5 − 1 = 4.</div>
<div class="step">Draw a vertical line from C up to B. Its length is the difference of the y-values: 4 − 1 = 3.</div>
<div class="step">The corner C is a right angle, because one line is horizontal and the other vertical. So ABC is a right triangle and AB is its longest side.</div>
<div class="step">Pythagoras: AB² = 4² + 3² = 16 + 9 = 25.</div>
<div class="step">AB = √25 = 5 units. The 3-4-5 triangle is a famous one: carpenters use it to make perfect right angles.</div>
</div>

In general:

```math
d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
```

The squares remove any minus signs, so it does not matter which point you call first. Slide the four numbers below and watch the triangle follow.

<figure class="fig" data-fig="c9-coord-dist"><figcaption>Change the two points. The shaded triangle shows the across and up legs; the readout works out d² and d. Look for combinations such as 3-4-5, 6-8-10 or 5-12-13 that give a whole-number distance. Move the points to the same x or the same y, and the triangle flattens into section 6.</figcaption></figure>

<div class="problem" data-problem="c9m-coord-dist"></div>

This formula is the starting point for Class 10 coordinate geometry, where you will also find the point that divides a segment in a given ratio: try the [Section formula tool](/learn/section-formula/) after this chapter. Plot any equation too, with the [Graphing calculator](/science/function-grapher/).

<!--fig:tool function-grapher-->

## 8. Shapes on the plane

Coordinates let you prove things about shapes without drawing them. Three corners of a parallelogram are known; what is the fourth? Use this fact: the **diagonals of a parallelogram cut each other in half**, so they share a mid-point. The mid-point of (x₁, y₁) and (x₂, y₂) is the average of each coordinate:

```math
M = \left(\frac{x_1 + x_2}{2},\ \frac{y_1 + y_2}{2}\right)
```

<figure class="fig" data-fig="c9-coord-fourth"><figcaption>A and B are fixed; slide C. The fourth corner D is found so that the mid-point of AC and the mid-point of BD are the same dot. Move C and the whole parallelogram follows.</figcaption></figure>

<div class="problem" data-problem="c9m-coord-fourth"></div>

A rectangle with sides parallel to the axes is even easier: two opposite corners (x₁, y₁) and (x₂, y₂) give the other two corners as (x₁, y₂) and (x₂, y₁), and the sides are |x₂ − x₁| and |y₂ − y₁|.

<div class="problem" data-problem="c9m-coord-perim"></div>

## 9. Mirror images on the plane

Reflect a point in a mirror line and the coordinates change in a simple way. A mirror in the **x-axis** keeps x and flips the sign of y. A mirror in the **y-axis** keeps y and flips the sign of x. Turning the point through a half-turn about the **origin** flips both.

<figure class="fig" data-fig="c9-coord-reflect"><figcaption>Choose a mirror and move the point. The dashed line joins the point to its image and always cuts the mirror at right angles, so the point and its image are the same distance from it.</figcaption></figure>

<div class="problem" data-problem="c9m-coord-mirror"></div>

<div class="history">

<ul class="timeline">
<li><b>about 150 BCE</b> Hipparchus describes places on Earth by two numbers, latitude and longitude: an early coordinate system.</li>
<li><b>1637</b> René Descartes publishes La Géométrie, joining algebra and geometry with axes.</li>
<li><b>today</b> Every phone map, video game screen and GPS fix uses coordinates to say where things are.</li>
</ul>

</div>

<div class="keypoints">

- The x-axis (horizontal) and y-axis (vertical) cross at the origin (0, 0) and make the Cartesian plane.
- A point is an ordered pair (x, y): x is the distance right (+) or left (−), y is up (+) or down (−). Order matters.
- Quadrants are numbered anticlockwise from the top right: I (+, +), II (−, +), III (−, −), IV (+, −). A point on an axis is in no quadrant.
- Distance on a line parallel to an axis is |x₂ − x₁| or |y₂ − y₁|.
- For any two points, d = √((x₂ − x₁)² + (y₂ − y₁)²), from the right triangle with legs parallel to the axes.
- The mid-point of two points is the average of the coordinates; the diagonals of a parallelogram share a mid-point.
- A mirror in the x-axis changes the sign of y, a mirror in the y-axis changes the sign of x, and the origin changes both.

</div>
