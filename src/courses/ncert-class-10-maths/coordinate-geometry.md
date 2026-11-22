---
title: Coordinate Geometry
seoTitle: 'Coordinate Geometry Class 10 notes and examples'
summary: 'Class 10 Coordinate Geometry with animations: the distance formula, collinear points, shapes from vertices, the section formula, midpoints and ratios.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'The distance between the points (2, 3) and (6, 6) is:'
    choices: ['5', '7', '25', '√7']
    ans: 0
    why: 'The gaps are 6 − 2 = 4 across and 6 − 3 = 3 up. Pythagoras gives √(16 + 9) = √25 = 5.'
  - q: 'The point that divides the segment from (0, 0) to (10, 5) in the ratio 2 : 3 is:'
    choices: ['(4, 2)', '(6, 3)', '(2, 3)', '(5, 2.5)']
    ans: 0
    why: 'x = (2×10 + 3×0)/5 = 4 and y = (2×5 + 3×0)/5 = 2. The point is 2 parts out of 5 along the way, so 2/5 of 10 is 4.'
  - q: 'The midpoint of the segment joining (−2, 7) and (6, 1) is:'
    choices: ['(2, 4)', '(4, 8)', '(−4, 6)', '(8, −6)']
    ans: 0
    why: 'Average the coordinates: ((−2 + 6)/2, (7 + 1)/2) = (2, 4).'
sources:
  - 'NCERT Class 10 Maths, Chapter 7 “Coordinate Geometry” (topic list only; all text, figures and questions here are original fibub work)'
  - 'René Descartes, La Géométrie (1637), the appendix to the Discours de la méthode, where algebra and geometry were joined on a plane with axes'
  - 'Heath, T. L., A History of Greek Mathematics (1921), on Pythagoras’ theorem, which gives the distance formula'
---

**Maths · Class 10 · Chapter 7 · about 45 minutes.** By the end you will be able to find the distance between any two points from their coordinates, test whether points lie on one line or form a particular triangle or quadrilateral, and find the point that divides a segment in a given ratio.

<div class="bigidea">A point on a grid is just two numbers. Because the grid has right angles everywhere, Pythagoras turns two pairs of numbers into a distance, and averaging two pairs of numbers turns them into a point part of the way between. Two formulas, the distance formula and the section formula, solve the whole chapter.</div>

## 1. Where is it? The coordinate plane

Two number lines cross at right angles at the **origin** O, the horizontal **x-axis** and the vertical **y-axis**. A point is named by an **ordered pair** (x, y): x says how far to go right (or left if negative), and y how far to go up (or down). The order matters: (3, 5) and (5, 3) are different places, like seat 3 of row 5 and seat 5 of row 3 in a cinema.

The axes cut the plane into four **quadrants**, numbered anticlockwise from the top right. The signs of x and y tell you which one a point is in. A point on the x-axis has y = 0, and a point on the y-axis has x = 0.

<figure class="fig" data-fig="c10-coord-plane"><figcaption>Drag P. The orange dashed line is its x (distance across from the y-axis) and the green one its y (distance up from the x-axis). The shaded quadrant changes with the signs. Try “Put it on an axis” and see what happens to one of the coordinates.</figcaption></figure>

<div class="myth">

**“(3, 5) and (5, 3) are the same point.”** They are two different points. The first number is always the x (across), the second the y (up). Swapping them reflects the point in the line y = x.

</div>

Where do coordinates come from? Around 1637 René Descartes had the idea of naming every point of a plane by two numbers, which let him turn geometry into algebra. This is why the plane is called **Cartesian**.

## 2. The distance formula

How far apart are A(x₁, y₁) and B(x₂, y₂)? Going from A to B you move **x₂ − x₁** across and **y₂ − y₁** up. Those two moves are at a right angle, so they are the two short sides of a right triangle whose longest side (the hypotenuse) is AB. Pythagoras does the rest.

<div class="steps" data-fig="c10-coord-diststeps">
<div class="step">Take A(1, 2) and B(7, 6). A ruler only gives a rough answer; the coordinates give an exact one.</div>
<div class="step">Draw a horizontal line from A and a vertical line from B. They meet at C(7, 2). The angle at C is a right angle, because the grid lines are perpendicular.</div>
<div class="step">AC is the horizontal gap: 7 − 1 = 6.</div>
<div class="step">BC is the vertical gap: 6 − 2 = 4.</div>
<div class="step">In the right triangle ABC, AB² = AC² + BC² = 36 + 16 = 52.</div>
<div class="step">So AB = √52 = 2√13, about 7.21 units.</div>
<div class="step">Doing exactly this with letters gives the formula below.</div>
</div>

```math
AB = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
```

<div class="meaning">
<dl>
<dt>x₂ − x₁, y₂ − y₁</dt><dd>how far apart the two points are across and up</dd>
<dt>Squares</dt><dd>they remove the sign, so it does not matter which point you call A or B: the distance is the same either way</dd>
<dt>AB</dt><dd>the straight-line distance, in the same unit as the grid</dd>
<dt>Physical meaning</dt><dd>Walking from A to B along the grid takes (x₂ − x₁) + (y₂ − y₁) steps, like a rickshaw going round the blocks. The distance formula gives the straight “as the crow flies” line, which is shorter.</dd>
</dl>
</div>

Drag A and B. Turn on the squares: the two small squares always fill exactly the big one, which is Pythagoras’ theorem made visible.

<figure class="fig" data-fig="c10-coord-dist"><figcaption>The legs of the triangle are the gaps in x and y. The readout works out AB² first and then the square root. A whole-number answer (like 3-4-5) appears when the legs form a Pythagorean triple.</figcaption></figure>

**Distance from the origin.** The origin is (0, 0), so the distance of P(x, y) from it is just **√(x² + y²)**. For example, the point (−5, 12) is √(25 + 144) = √169 = 13 units from the origin.

<div class="problem" data-problem="c10m-coord-dist"></div>

<div class="problem" data-problem="c10m-coord-origin"></div>

<div class="myth">

**“Subtract the squares”: (x₂² − x₁²).** The distance formula squares the *difference*, (x₂ − x₁)², not the numbers separately. For (1, 2) and (4, 6): the gaps are 3 and 4, so the distance is 5. Squaring first and subtracting gives nonsense.

</div>

## 3. Using the distance formula

Once you can measure any distance, a lot of geometry turns into arithmetic.

### 3.1 Is a point on a circle? Finding a radius

A circle is every point at the same distance, the **radius**, from the **centre**. So to find the radius, measure the distance from the centre to any point on it. The diameter is twice that.

<div class="problem" data-problem="c10m-coord-circle"></div>

### 3.2 Collinear points

Three points are **collinear** if they lie on one straight line. For a real triangle any two sides together are longer than the third (the “detour” rule). Points on a line are the exception: the detour through the middle point is no longer than the direct way. So

```math
A, B, C \text{ are collinear} \iff \text{the longest of } AB, BC, CA \text{ equals the sum of the other two.}
```

Drag the points to see it. Try the three examples under the picture, and watch what the readout says when the points do not make a line.

<figure class="fig" data-fig="c10-coord-collinear"><figcaption>If the three lengths show the shortest two adding up to exactly the longest, the points are collinear. Otherwise they make a triangle, and the squares of the sides tell you whether it is isosceles, equilateral or right-angled.</figcaption></figure>

### 3.3 Naming a triangle

Find the three sides with the distance formula and compare:

- **Equilateral:** all three equal.
- **Isosceles:** exactly two equal.
- **Right-angled:** the squares of two sides add up to the square of the third (the converse of Pythagoras).
- **Scalene:** all different. A right triangle with two equal sides is called a right isosceles triangle.

Work with the **squared** lengths whenever you can: you skip the square roots and the comparison is exact.

The triangle tool below does the measuring for you. Put in three corners and it gives the sides and the type.

<!--fig:tool coord-triangle-->

### 3.4 Naming a quadrilateral

Four points A, B, C, D in order make a quadrilateral. Find the four sides and the two diagonals AC and BD, then use this checklist:

1. **Parallelogram:** opposite sides equal (or the diagonals share a midpoint).
2. **Rhombus:** all four sides equal.
3. **Rectangle:** a parallelogram with equal diagonals.
4. **Square:** all four sides equal **and** equal diagonals.
5. **Kite:** two pairs of equal *adjacent* sides.

<figure class="fig" data-fig="c10-coord-quad"><figcaption>Pick a shape to start, then drag its corners. The readout lists the four sides and the two diagonals, whether the diagonals share a midpoint, and the name that fits. Notice how a single move turns a square into a general quadrilateral.</figcaption></figure>

<div class="myth">

**“Four equal sides make a square.”** A rhombus also has four equal sides. A square needs one more fact: equal diagonals (or a right angle). Check the diagonals as well as the sides.

</div>

### 3.5 A point equidistant from two points

A very common question: find the point on the x-axis (or y-axis) that is the same distance from two given points. Call it P(x, 0), write PA² = PB² with the distance formula and solve. The x² terms cancel, so you always get a simple equation, not a quadratic.

<figure class="fig" data-fig="c10-coord-equi"><figcaption>Slide P along an axis. PA and PB are equal at exactly one spot. Turn on the dashed perpendicular bisector of AB: every point on it is equally far from A and B, and the axis meets it at the answer.</figcaption></figure>

<div class="problem" data-problem="c10m-coord-equi"></div>

## 4. The section formula

Suppose a point P lies on AB so that **AP : PB = m : n**. Think of a rope from a pole A to a pole B being cut into m + n equal pieces, with P after the first m. We say P **divides AB internally in the ratio m : n**. What are P’s coordinates? Similar triangles answer it.

<div class="steps" data-fig="c10-coord-sectionsteps">
<div class="step">A(2, 1) and B(8, 7). P is on AB with AP : PB = 1 : 2. We want (x, y).</div>
<div class="step">Draw the horizontal lines through A and P, and the vertical lines through P and B. Two small right triangles appear, APQ and PBR.</div>
<div class="step">The two triangles have equal angles (the sides are parallel), so they are similar. Matching sides are in the same ratio as AP : PB, which is 1 : 2.</div>
<div class="step">The horizontal sides are x − 2 and 8 − x, so (x − 2)/(8 − x) = 1/2. Cross-multiplying, 2(x − 2) = 8 − x.</div>
<div class="step">So 3x = 12 and x = 4. With letters this works out to x = (m·x₂ + n·x₁)/(m + n).</div>
<div class="step">The vertical sides give y the same way: y = (1·7 + 2·1)/3 = 3. So P = (4, 3).</div>
<div class="step">Check: AP = √8 = 2√2 and PB = √32 = 4√2. Their ratio is 1 : 2, so P really divides AB in the ratio 1 : 2.</div>
</div>

```math
P = \left(\frac{m x_2 + n x_1}{m + n},\ \frac{m y_2 + n y_1}{m + n}\right)
```

<div class="meaning">
<dl>
<dt>m : n</dt><dd>the ratio AP : PB; m is the part next to A, n the part next to B</dd>
<dt>(x₁, y₁), (x₂, y₂)</dt><dd>the ends A and B</dd>
<dt>Crossing over</dt><dd>m multiplies the <i>far</i> end B and n multiplies the <i>near</i> end A. A good check: if m is large, P should be close to B, and the formula leans towards (x₂, y₂)</dd>
<dt>Physical meaning</dt><dd>P is a weighted average of A and B. The bigger m is compared with n, the more P is pulled towards B.</dd>
</dl>
</div>

Change m and n and drag A and B. The dots cut AB into m + n equal parts; P is where the first m end.

<figure class="fig" data-fig="c10-coord-section"><figcaption>Set m = 1 and n = 2, then switch on “Also mark the point at n : m”. You now see both <b>points of trisection</b> of AB, the two points that cut it into three equal parts.</figcaption></figure>

Try the section formula tool as well; it lets you move the ends and the ratio and shows the working.

<!--fig:tool section-formula-->

<div class="problem" data-problem="c10m-coord-section"></div>

<div class="myth">

**“Use m with A and n with B.”** It is the other way round: m is multiplied with the coordinates of B and n with those of A. Always run the sanity check: if m = 1 and n = 9, P should be very close to A.

</div>

## 5. The midpoint, a special case

When P is exactly halfway, the ratio is 1 : 1. Put m = n = 1 in the section formula and the 2s cancel to give the **midpoint**:

```math
M = \left(\frac{x_1 + x_2}{2},\ \frac{y_1 + y_2}{2}\right)
```

It is just the **average** of the x’s and the average of the y’s. This also works backwards: if you know the midpoint and one end, double the midpoint and subtract the known end to get the other end.

<figure class="fig" data-fig="c10-coord-mid"><figcaption>The dashed lines drop each point onto the two axes. On each axis, the foot of M lies exactly in the middle of the feet of A and B (the green bars). That is what “average of the coordinates” looks like.</figcaption></figure>

<div class="problem" data-problem="c10m-coord-mid"></div>

**A parallelogram’s fourth vertex.** The diagonals of a parallelogram cut each other in half. So the midpoint of AC and the midpoint of BD are the same point. If you know A, B and C, this gives D = A + C − B.

<figure class="fig" data-fig="c10-coord-para"><figcaption>Drag A, B and C. The point D that completes the parallelogram ABCD is found from the shared midpoint of the two diagonals (the dot where the dashed lines cross).</figcaption></figure>

<div class="problem" data-problem="c10m-coord-para"></div>

## 6. In what ratio does an axis (or a line) divide a segment?

Another favourite. Where AB meets the x-axis, y = 0. Put y = 0 in the section formula with the ratio **k : 1** and solve for k. You will always find that the ratio is simply the heights of A and B above and below the axis: **k = −y₁ / y₂**, or the plain ratio |y₁| : |y₂|. For the y-axis, use the x-coordinates instead.

<figure class="fig" data-fig="c10-coord-axisratio"><figcaption>Drag A and B across the axis. The two dashed drops are the heights, and the ratio AP : PB is their ratio. If A and B are on the same side of the axis, the line only meets the axis when extended and the axis does not divide the segment internally.</figcaption></figure>

<div class="problem" data-problem="c10m-coord-axis"></div>

**Where this shows up.** Maps and satellite navigation work in coordinates: the distance formula (with latitude and longitude, adjusted for the curved Earth) is how a cab app finds the nearest driver. Game designers use the same two formulas to detect when a character is close enough to a coin and to place an object part of the way along a path. In cricket, a fielder at (x, y) on a coordinate model of the ground and a ball at another point is a distance question.

<div class="history">

- **c. 300 BC:** Euclid writes the geometry the Greeks used, with no coordinates. Pythagoras’ theorem was already known.
- **1637:** René Descartes publishes his method of naming points by numbers, joining algebra to geometry.
- **1600s:** Pierre de Fermat develops the same idea independently.
- **Today:** every map, screen and video game uses coordinates and the distance formula thousands of times a second.

</div>

*Beyond the syllabus:* the [Section formula](/learn/section-formula/) and [Triangle from coordinates](/learn/coord-triangle/) tools above work with any numbers you like. Next you will meet angles and ratios in a right triangle in [Introduction to Trigonometry](/learn/courses/ncert-class-10-maths/introduction-to-trigonometry/).

<div class="keypoints">

- The distance between (x₁, y₁) and (x₂, y₂) is √[(x₂ − x₁)² + (y₂ − y₁)²]. From the origin it is √(x² + y²).
- Three points are collinear when the longest of the three distances equals the sum of the other two.
- Name triangles and quadrilaterals by comparing sides and diagonals worked out with the distance formula (work with squares).
- If P divides AB in the ratio m : n, then P = ((m x₂ + n x₁)/(m + n), (m y₂ + n y₁)/(m + n)): m goes with the far end B.
- The midpoint is the average of the coordinates (m = n = 1). The diagonals of a parallelogram share a midpoint.
- An axis divides the segment joining A and B in the ratio of the distances of A and B from that axis.

</div>
