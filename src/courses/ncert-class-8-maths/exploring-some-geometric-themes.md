---
title: 'Exploring Some Geometric Themes'
seoTitle: 'Symmetry and Solids Class 8 notes: tessellations'
summary: 'Class 8 Maths: line and rotational symmetry, tessellations, fractals, solids and Euler’s rule, and nets of a cube, with mirrors, turns and folding animations.'
minutes: 55
updated: 2026-11-23
quiz:
  - q: 'How many lines of symmetry does a regular hexagon have?'
    choices: ['6', '3', '12', '1']
    ans: 0
    why: 'A regular polygon with n sides has n lines of symmetry. Here n = 6.'
  - q: 'Regular pentagons alone do not tessellate because:'
    choices: ['108° does not divide 360° exactly', 'they have 5 sides', 'their sides are unequal', 'they have no lines of symmetry']
    ans: 0
    why: 'Three pentagons use 324° round a point and leave a gap of 36°; four would need 432°, which is too much.'
  - q: 'A solid has 8 vertices and 12 edges. By Euler’s rule it has how many faces?'
    choices: ['6', '4', '8', '10']
    ans: 0
    why: 'V − E + F = 2 gives F = 2 − 8 + 12 = 6 (a cube, for instance).'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 11 “Exploring Some Geometric Themes” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school geometry: symmetry groups of polygons, regular tilings, the Koch curve (von Koch, 1904), the Sierpinski triangle (Sierpinski, 1915) and Euler’s polyhedron formula (Euler, 1750). Every count was checked by computer.'
---

**Maths · Class 8 · Chapter 11 · about 55 minutes.** By the end you will be able to find lines of symmetry and the order of rotational symmetry of a shape, say which shapes tile a floor and why, build simple fractals, count the faces, edges and vertices of a solid and check Euler’s rule, and decide whether a pattern of squares folds into a cube.

<div class="bigidea">Patterns hide in shapes. If a shape looks the same after a flip or a turn, it has symmetry. If copies of a shape cover a floor with no gaps, it tessellates. If a shape repeats itself at smaller and smaller sizes, it is a fractal. And every solid with flat faces obeys one rule: vertices − edges + faces = 2.</div>

## 1. Line symmetry: the mirror test

A shape has a **line of symmetry** if, when you fold it along that line, the two halves match exactly. Think of the rangoli at a doorway or the wings of a butterfly. A line of symmetry is also called an axis. Put a mirror on the line, and the mirror image should fall exactly on the other half.

Try it. Choose a shape, then turn the mirror line with the slider. Whenever the dashed image fits exactly onto the shape, you have found a line of symmetry.

<figure class="fig" data-fig="c8-geo-mirror"><figcaption>The blue shape is fixed. The dashed orange shape is its mirror image across the black line. When they overlap exactly, the line is a line of symmetry. Square: 4 lines, rectangle: 2, rhombus: 2, kite: 1, parallelogram: 0.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Line of symmetry</dt><dd>a line that splits a shape into two mirror-image halves.</dd>
<dt>Regular polygon</dt><dd>all sides equal and all angles equal. A regular polygon with `$n$` sides has `$n$` lines of symmetry.</dd>
<dt>Physical meaning</dt><dd>a flip that leaves the shape looking unchanged.</dd>
</dl>
</div>

Notice some surprises. A rectangle that is not a square has only **two** lines of symmetry, not four: its diagonals are not lines of symmetry. A parallelogram that is not a rectangle or a rhombus has **none**.

## 2. Rotational symmetry: the turn test

A shape has **rotational symmetry** if a turn about its centre, by less than a full turn, makes it look exactly the same. The number of times it fits in one full turn is its **order**. The smallest turn that works is `$360^\circ \div \text{order}$`.

<figure class="fig" data-fig="c8-geo-rotate"><figcaption>Turn each shape about its centre. A green outline means it fits. Square: order 4, smallest turn 90°. Equilateral triangle: order 3, 120°. Parallelogram: order 2, 180°. Pinwheel: order 3 but no line of symmetry.</figcaption></figure>

Every shape fits after a full 360° turn, so “order 1” means no real rotational symmetry. A shape can have rotational symmetry without lines of symmetry (the pinwheel) and lines of symmetry without rotational symmetry (an isosceles triangle).

<div class="problem" data-problem="c8m-geo-turn"></div>

<div class="myth">

**“A shape with line symmetry also has rotational symmetry.”** Not so. An isosceles triangle has one line of symmetry and order 1 (only the full turn fits). And a parallelogram has order 2 but no line of symmetry. The two kinds of symmetry are separate tests.

</div>

## 3. Tessellations: tiling a floor

A **tessellation** is a pattern of shapes that covers a surface with no gaps and no overlaps, like the tiles on a floor or the cells of a honeycomb. Which regular shapes can do it alone? Put copies around one point. They tile only if their corners add up to exactly 360°.

A regular polygon with `$n$` sides has corner angle

```math
180^\circ - \frac{360^\circ}{n}
```

Slide the number of sides. The picture fits as many shapes as it can round one point and shows the gap.

<figure class="fig" data-fig="c8-geo-tess"><figcaption>Triangles (60° × 6), squares (90° × 4) and hexagons (120° × 3) fill 360° exactly. A pentagon’s 108° leaves a gap of 36°. An octagon’s 135° leaves 90°, exactly one more square’s worth: octagons and squares tile together.</figcaption></figure>

So only three regular polygons tile alone: the **equilateral triangle, square and regular hexagon**. Different shapes can also be mixed: 3 triangles and 2 squares make 180° + 180° = 360°. Any triangle, and any four-sided shape (even a slanted, non-regular one) tessellates, because their corners can be arranged to add up to 360°.

<div class="problem" data-problem="c8m-geo-tess"></div>

Make your own tilings with the studio below.

<!--fig:tool tessellation-studio-->

## 4. Fractals: patterns inside patterns

A **fractal** repeats the same rule on smaller and smaller copies. Two classics:

- **Koch snowflake.** Take an equilateral triangle. Cut each side in three and add a small triangle (a tent) on the middle third. Repeat on every new side.
- **Sierpinski triangle.** Take a triangle. Join the midpoints of the sides and remove the middle triangle. Repeat on each of the three corner triangles.

<div class="steps" data-fig="c8-geo-kochsteps">
<div class="step">Start with a line of length 1.</div>
<div class="step">Cut it in three, replace the middle third with a tent. 4 pieces of 1/3: length 4/3.</div>
<div class="step">Do it to each of the 4 pieces: 16 pieces of 1/9, length 16/9.</div>
<div class="step">Again: 64 pieces of 1/27, length 64/27.</div>
<div class="step">Again: 256 pieces, length 256/81. Each step multiplies the length by 4/3.</div>
</div>

Because the length is multiplied by 4/3 each time, the snowflake’s border gets longer without limit, yet the shape fits inside a circle. In the Sierpinski triangle the opposite happens: the filled area is multiplied by 3/4 each time and shrinks towards nothing.

<figure class="fig" data-fig="c8-geo-fractal"><figcaption>Choose a fractal and raise the level. Sierpinski: 3 to the power level triangles, with (3/4) to the power level of the area left. Koch: 3 × 4 to the power level sides, and a border 4/3 times longer each level.</figcaption></figure>

<div class="problem" data-problem="c8m-geo-koch"></div>

<div class="problem" data-problem="c8m-geo-sier"></div>

Zoom into fractals in the explorer and build your own in the builder.

<!--fig:tool fractal-explorer-->

Nature loves this idea: the branching of a tree, the veins of a leaf, and the florets of a cauliflower all look similar at different sizes. The [Fractal builder](/learn/fractal-builder/) lets you design your own rule.

## 5. Solids: faces, edges and vertices

A solid with flat faces has three things to count. A **face** is a flat surface. An **edge** is where two faces meet. A **vertex** (plural vertices) is a corner. A cube has 6 faces, 12 edges and 8 vertices.

<figure class="fig" data-fig="c8-geo-euler"><figcaption>Choose a solid and what to count. The dots mark vertices, or edges are thick, or numbers mark faces. The readout adds V − E + F: it is 2 for every one of them.</figcaption></figure>

This is **Euler’s rule**, named after Leonhard Euler:

```math
V - E + F = 2
```

It works for every solid with flat faces and no holes. It is a quick check: if you count V, E and F and the answer is not 2, you have miscounted. And it gives a missing number. A solid with 10 vertices and 15 edges has `$F = 2 - 10 + 15 = 7$` faces (a pentagonal prism).

<div class="meaning">
<dl>
<dt>V, E, F</dt><dd>the number of vertices, edges and faces.</dd>
<dt>Prism with an n-sided base</dt><dd>`$2n$` vertices, `$3n$` edges, `$n + 2$` faces.</dd>
<dt>Pyramid with an n-sided base</dt><dd>`$n + 1$` vertices, `$2n$` edges, `$n + 1$` faces.</dd>
</dl>
</div>

<div class="problem" data-problem="c8m-geo-euler"></div>

Spin more solids in the viewer.

<!--fig:tool polyhedron-viewer-->

## 6. Nets: flattening a solid

A **net** is what you get if you cut a solid along some edges and unfold it flat. A cube has 11 different nets, each made of 6 squares joined edge to edge. But not every pattern of 6 squares folds into a cube. How can you tell without paper? Roll an imaginary cube over the pattern. Start on one square and roll to a neighbour, always painting the square with the face that touches it. If every square gets a different face, the pattern is a net.

<figure class="fig" data-fig="c8-geo-roll"><figcaption>Pick a pattern and press the roll button. Each square gets a face number. In the cross, T and staircase all six numbers are different, so they fold into a cube. In the hook and the 2 by 3 block a face lands twice, so they are not nets.</figcaption></figure>

A good rule of thumb: a row of six squares never works, and a net never contains a 2 by 2 block of squares.

<div class="history">

**Euler and the bridges.** Leonhard Euler (1707-1783) found V − E + F = 2 around 1750. The same man solved the puzzle of the seven bridges of Königsberg, and started a new kind of geometry about connections instead of lengths.

</div>

<div class="keypoints">

- Line symmetry: a fold line with matching halves. A regular n-sided polygon has n lines. A rectangle has 2, a parallelogram 0.
- Rotational symmetry: the order is the number of fits in a full turn; the smallest turn is 360° ÷ order.
- A tessellation has no gaps and no overlaps; corners round a point must add up to exactly 360°. Alone, only triangles, squares and hexagons tile.
- A regular n-gon has corner angle `$180^\circ - 360^\circ / n$`.
- Fractals repeat a rule at smaller sizes. Koch: length × 4/3 each step. Sierpinski: area × 3/4 each step.
- Euler’s rule: `$V - E + F = 2$`. A prism with n-sided base: 2n, 3n, n + 2. A pyramid: n + 1, 2n, n + 1.
- A net is a flat pattern that folds into a solid. Rolling a cube over it tests whether each face lands once.

</div>

Other tools to explore: the [Fractal explorer](/science/fractal-explorer/), [Polyhedron viewer](/science/polyhedron-viewer/), [Fractal builder](/learn/fractal-builder/) and [Tessellation studio](/learn/tessellation-studio/) work on their own too. Ready for exam-style questions? Go to [Exploring Some Geometric Themes: practice questions](/learn/courses/ncert-class-8-maths/exploring-some-geometric-themes-practice/).
