---
title: 'Quadrilaterals'
seoTitle: 'Quadrilaterals Class 9 notes: parallelogram, mid-point'
summary: 'Class 9 Quadrilaterals with animations: angle sum, parallelograms, rectangle, rhombus, square, tests for a parallelogram and the mid-point theorem.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'Two angles of a parallelogram next to each other are in the ratio 2 : 3. The larger one is:'
    choices: ['108°', '72°', '120°', '90°']
    ans: 0
    why: 'Neighbouring angles add up to 180°. Split 180° in the ratio 2 : 3: the parts are 72° and 108°.'
  - q: 'The diagonals of a quadrilateral cut each other in half. What can we say for sure?'
    choices: ['It is a parallelogram', 'It is a rectangle', 'It is a rhombus', 'It is a square']
    ans: 0
    why: 'Diagonals that bisect each other are enough for a parallelogram. We would need equal diagonals for a rectangle, or perpendicular diagonals for a rhombus.'
  - q: 'In triangle ABC, D and E are the mid-points of AB and AC. If BC = 18 cm, then DE is:'
    choices: ['9 cm', '18 cm', '36 cm', '6 cm']
    ans: 0
    why: 'By the mid-point theorem, DE is parallel to BC and half as long: 18 ÷ 2 = 9 cm.'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 12 “Quadrilaterals” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Euclid’s Elements, Book I (properties of parallelograms, around 300 BCE); the mid-point theorem is standard school geometry. Every example was checked on coordinates.'
---

**Maths · Class 9 · Chapter 12 · about 55 minutes.** By the end you will be able to name every kind of four-sided shape, prove why a parallelogram has equal opposite sides, angles and bisecting diagonals, decide whether a given shape is a parallelogram, a rectangle, a rhombus or a square, and use the mid-point theorem.

<div class="bigidea">A quadrilateral is two triangles stuck together along a diagonal. That one cut gives its angle sum, the properties of a parallelogram, the tests for a parallelogram, and the mid-point theorem.</div>

## 1. Four sides, four corners, 360°

A **quadrilateral** has four sides, four corners (vertices) and two diagonals. A cricket pitch seen from above, a window, a kite and a field are all quadrilaterals. We name the corners in order round the shape, A, B, C, D, so the sides are AB, BC, CD and DA, and the diagonals are AC and BD.

Whatever the shape, the four angles add up to **360°**. The reason is the diagonal. Watch it happen.

<div class="steps" data-fig="c9-quad-anglesum">
<div class="step">Any four-sided shape ABCD. Its four angles are marked.</div>
<div class="step">Draw the diagonal AC. It splits ABCD into two triangles, ABC and ACD.</div>
<div class="step">Triangle ABC has angles adding to 180°.</div>
<div class="step">Triangle ACD also adds to 180°.</div>
<div class="step">Together they use all four angles of ABCD: 180° + 180° = 360°.</div>
</div>

<div class="problem" data-problem="c9m-quad-angle"></div>

Now meet the family. Each member is a quadrilateral with more and more rules:

- **Trapezium**: one pair of parallel sides.
- **Kite**: two pairs of equal sides that sit next to each other (the shape of a flying kite).
- **Parallelogram**: both pairs of opposite sides parallel.
- **Rectangle**: a parallelogram with four right angles.
- **Rhombus**: a parallelogram with four equal sides.
- **Square**: both a rectangle and a rhombus.

Drag the corners below. A list tells you in real time which rules your shape follows, and what it is called. Press the buttons to jump to each member, then drag one corner and see which rules break.

<figure class="fig" data-fig="c9-quad-family"><figcaption>Drag the corners of ABCD (they snap to the grid, so the checks are exact). The list shows which properties are true. Start from the Rectangle button, drag one corner, and see that it becomes a general parallelogram or worse.</figcaption></figure>

<div class="myth">

**“A square is not a rectangle.”** It is. A rectangle needs only four right angles, and a square has them. Every square is a rectangle, a rhombus and a parallelogram. The reverse is not true: most rectangles are not squares.

</div>

Spend a few minutes with the explorer tool, which adds angle and diagonal readouts. For the angle sum of shapes with more sides, see the [polygon angle sum tool](/learn/polygon-angle-sum/).

<!--fig:tool quadrilateral-explorer-->

## 2. The parallelogram and why its properties are true

Take a rectangular tile and push the top sideways. You get a parallelogram: opposite sides stay parallel, but the corners are no longer 90°. A railway gate, a pantograph and a tilted bookshelf all use this shape.

Three properties show up again and again:

1. **Opposite sides are equal.**
2. **Opposite angles are equal.**
3. **The diagonals cut each other in half.**

We do not simply accept them. We prove them with one cut.

<div class="steps" data-fig="c9-quad-paraprops">
<div class="step">A parallelogram ABCD: AB ∥ DC and AD ∥ BC.</div>
<div class="step">Draw the diagonal AC. It splits the shape into triangles ABC and CDA.</div>
<div class="step">Because AB ∥ DC, the marked angles at A and C are equal (alternate angles). Because AD ∥ BC, the other two marked angles are equal as well.</div>
<div class="step">The two triangles share the side AC and have two equal angle pairs. So they are exact copies (ASA).</div>
<div class="step">Matching parts of copies are equal: AB = DC and AD = BC. Opposite sides are equal.</div>
<div class="step">Also ∠B = ∠D, and ∠A (made of two parts) = ∠C. Opposite angles are equal.</div>
</div>

<div class="meaning">
<dl>
<dt>AB ∥ DC</dt><dd>sides AB and DC never meet however far you extend them.</dd>
<dt>Alternate angles</dt><dd>when a line (here AC) crosses two parallel lines, the angles on opposite sides of it, between the parallels, are equal.</dd>
<dt>ASA</dt><dd>two triangles are copies if two angles and the side between them match.</dd>
<dt>Physical meaning</dt><dd>a parallelogram looks the same after turning it half a circle: the opposite sides and angles swap places.</dd>
</dl>
</div>

Neighbouring angles are different: they lie between the same two parallel lines, so they add up to **180°**. In a parallelogram with one angle 70°, the angles go 70°, 110°, 70°, 110° round the shape.

<div class="problem" data-problem="c9m-quad-alg"></div>

**The diagonals bisect each other.** Let the diagonals AC and BD meet at O. Triangles AOB and COD have AB = DC, and equal alternate angles at A and C and at B and D. So they are copies, and OA = OC and OB = OD. Try it with turning: spin a copy of the parallelogram about O by a half-turn and it lands exactly on itself.

<figure class="fig" data-fig="c9-quad-diagbisect"><figcaption>Turn the copy about O. At 180° it sits exactly on the original, with A going to C and B going to D. Change the shape and the half-turn still works: this is the diagonals-bisect property seen as a symmetry.</figcaption></figure>

<div class="myth">

**“The diagonals of a parallelogram are equal.”** Only in a rectangle. In a leaning parallelogram one diagonal is clearly longer. What is always true is that they cut each other in half.

</div>

## 3. Is it a parallelogram? The tests

Often we are given a shape and must decide if it is a parallelogram. We do not check everything. Each of these **alone** is enough:

- both pairs of opposite sides are equal;
- both pairs of opposite angles are equal;
- the diagonals bisect each other;
- **one** pair of opposite sides is both equal **and** parallel.

The last one is the surprising shortcut. Think of the bars of a folding gate. Two bars that are equal and parallel make the gate a parallelogram, so the other pair has to be equal and parallel too.

Be careful with a weaker test. One pair of equal opposite sides is **not** enough: a trapezium with two equal slanting sides (an isosceles trapezium) has one equal pair but is not a parallelogram.

Here is the diagonal test in action. Choose the lengths of two diagonals and the angle they make, with each cut exactly in half by the crossing point. Whatever you choose, the result is a parallelogram.

<figure class="fig" data-fig="c9-quad-builder"><figcaption>Two diagonals that bisect each other always make a parallelogram. Press the buttons to make the diagonals equal (a rectangle), perpendicular (a rhombus), or both (a square).</figcaption></figure>

## 4. Rectangle, rhombus, square

Each special parallelogram has an extra property, and it shows in the diagonals.

| Shape | Extra rule | What happens to the diagonals |
|---|---|---|
| Rectangle | all four angles 90° | the diagonals are **equal** |
| Rhombus | all four sides equal | the diagonals cross at **right angles**, and each bisects the angles at its ends |
| Square | both | equal, perpendicular and bisecting the corners |

Why are a rectangle’s diagonals equal? Triangles ABC and DCB have AB = DC, the shared side BC, and both angles at B and C are 90°. They are copies, so AC = DB. Why does a rhombus have perpendicular diagonals? Its four sides are all equal, so triangles AOB and AOD have equal sides AB = AD, OB = OD and a shared OA. They are copies, so the two angles at O are equal and, being on a straight line, each is 90°.

The converse is also true. If the diagonals of a parallelogram are equal, it is a rectangle. If they are perpendicular, it is a rhombus.

<div class="problem" data-problem="c9m-quad-rhombus"></div>

<div class="problem" data-problem="c9m-quad-rect"></div>

A carpenter’s trick: to check that a door frame is a rectangle, measure both diagonals. If they are equal (and the frame is a parallelogram) the corners are all right angles.

## 5. The mid-point theorem

Take any triangle ABC. Mark the **mid-point** D of AB and the mid-point E of AC, and join them. The small line DE seems to run parallel to the base BC, and to be exactly half as long. The theorem says this is always true.

> **Mid-point theorem.** The line joining the mid-points of two sides of a triangle is parallel to the third side and equal to half of it.

Follow the proof. It uses a parallelogram, which is why it lives in this chapter.

<div class="steps" data-fig="c9-quad-midpoint">
<div class="step">Triangle ABC. D is the mid-point of AB, and E is the mid-point of AC. We want to show DE ∥ BC and DE = ½ BC.</div>
<div class="step">Extend DE beyond E to F so that EF = DE. Join C to F.</div>
<div class="step">Triangles AED and CEF: AE = CE (E is a mid-point), DE = FE (we made it so), and the angles at E are equal (vertically opposite). So they are copies (SAS).</div>
<div class="step">So CF = AD, and CF ∥ AB. Since AD = DB, CF = DB too.</div>
<div class="step">DB and CF are equal and parallel, so DBCF is a parallelogram. Its opposite sides DF and BC are parallel and equal.</div>
<div class="step">DF = BC and DE is half of DF. So DE ∥ BC and DE = ½ BC.</div>
</div>

Now drag a triangle and see the theorem hold everywhere.

<!--fig:tool midpoint-theorem-->

<div class="problem" data-problem="c9m-quad-mid"></div>

**An everyday use.** A surveyor wants the width of a pond. She stands at a corner A, picks the points D and E half-way to the two far banks B and C, and measures DE across land. The pond’s width BC is simply 2 × DE. You can find a distance you cannot measure directly.

**The converse.** If a line is drawn through the mid-point of one side of a triangle, parallel to another side, it passes through the mid-point of the third side. So in triangle ABC a line from the mid-point of AB parallel to BC cuts AC exactly in half.

## 6. Mid-points of any quadrilateral

Here is a surprise built from the theorem. Mark the mid-points of the four sides of **any** quadrilateral, even a very lopsided one, and join them in order. The inner shape is always a parallelogram.

The reason: draw the diagonal AC. In triangle ABC, the line joining the mid-points of AB and BC is parallel to AC and half of it. In triangle ACD, the line joining the mid-points of CD and DA is also parallel to AC and half of it. So one pair of opposite sides of the inner shape is equal and parallel, and by Section 3 that is enough for a parallelogram.

<figure class="fig" data-fig="c9-quad-varignon"><figcaption>Drag the corners of ABCD anywhere. The shape PQRS made by the mid-points of the sides is a parallelogram every time, and its sides are half the diagonals AC and BD.</figcaption></figure>

If the outer shape has equal diagonals, the inner parallelogram has four equal sides (a rhombus). If its diagonals are perpendicular, the inner one is a rectangle. Try making each happen with the drag.

For a taste of building these shapes with ruler and compass, try the [geometry construction tool](/science/geometry-construction/).

<div class="keypoints">

- A quadrilateral has four sides, and its four angles add up to 360° (two triangles).
- Parallelogram: opposite sides equal and parallel, opposite angles equal, neighbouring angles add up to 180°, diagonals bisect each other.
- A shape is a parallelogram if: both pairs of opposite sides are equal, or both pairs of opposite angles are equal, or the diagonals bisect each other, or one pair of opposite sides is equal and parallel.
- Rectangle: parallelogram with a right angle (so all four); the diagonals are equal. Rhombus: parallelogram with equal sides; the diagonals are perpendicular. Square: both.
- Mid-point theorem: the line joining the mid-points of two sides of a triangle is parallel to the third side and half as long. Its converse holds too.
- The mid-points of the sides of any quadrilateral form a parallelogram.

</div>

Other tools to explore: the [Quadrilateral explorer](/learn/quadrilateral-explorer/), the [Mid-point theorem tool](/learn/midpoint-theorem/) and the [Geometry construction tool](/science/geometry-construction/). Ready for exam-style questions? Go to [Quadrilaterals: practice questions](/learn/courses/ncert-class-9-maths/quadrilaterals-practice/).
