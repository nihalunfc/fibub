---
title: 'Area'
seoTitle: 'Area Class 8 notes: trapezium, circle, Pick'
summary: 'Class 8 Maths: area of a parallelogram, triangle, trapezium and circle by cutting and rearranging, paths round gardens, and Pick’s theorem on a dot grid.'
minutes: 55
updated: 2026-11-23
quiz:
  - q: 'The parallel sides of a trapezium are 10 cm and 14 cm and the distance between them is 6 cm. Its area is:'
    choices: ['72 cm²', '84 cm²', '144 cm²', '60 cm²']
    ans: 0
    why: 'Area = ½ × (10 + 14) × 6 = 72 cm².'
  - q: 'The area of a circle of radius 7 cm (π = 22/7) is:'
    choices: ['154 cm²', '44 cm²', '49 cm²', '308 cm²']
    ans: 0
    why: 'π r² = 22/7 × 7 × 7 = 154 cm². (44 cm is the circumference.)'
  - q: 'A shape on a dot grid has 6 dots inside and 8 on its boundary. By Pick’s theorem its area is:'
    choices: ['9', '13', '14', '10']
    ans: 0
    why: 'Area = I + B/2 − 1 = 6 + 4 − 1 = 9 square units.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 14 “Area” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school geometry (areas by dissection), Pick’s theorem (Georg Pick, 1899). Every worked example was checked a second way, for instance by coordinates (shoelace formula).'
---

**Maths · Class 8 · Chapter 14 · about 55 minutes.** By the end you will be able to find the area of a parallelogram, triangle, trapezium and circle, explain each formula by cutting and rearranging shapes, find the area of a path round a garden, and use Pick’s theorem to find an area by counting dots.

<div class="bigidea">Every area formula comes from one trick: cut a shape into pieces and rearrange them into a shape you already know. A parallelogram becomes a rectangle, a trapezium becomes a parallelogram, and a circle becomes almost a rectangle. If you can see the rearrangement you never need to memorise.</div>

## 1. Where we start: the rectangle

The area of a rectangle is length × breadth: count the unit squares inside. Area is measured in square units (cm², m²). Two quick facts will help all through the chapter. First, area is *added*: if you cut a shape into pieces, the areas of the pieces add up to the area of the shape. Second, area does not change when you move or turn the pieces.

## 2. Parallelogram: slide a triangle

A parallelogram has a base `$b$` and a **height** `$h$`: the straight-up distance between the base and the opposite side (not the slanting side). Cut a right triangle from the left end and slide it to the right end. The pieces fit exactly and make a rectangle `$b$` by `$h$`.

<figure class="fig" data-fig="c8-area-shear"><figcaption>Slide the orange triangle to the other end of the parallelogram: a rectangle b × h appears. Change the lean: the slant changes but the base and the height do not, so the area does not either.</figcaption></figure>

```math
\text{Area of parallelogram} = b \times h
```

<div class="meaning">
<dl>
<dt>Base b</dt><dd>any side you choose to stand the shape on.</dd>
<dt>Height h</dt><dd>the perpendicular distance from that base to the opposite side. A parallelogram has two bases and two heights, but the area is the same either way.</dd>
<dt>Physical meaning</dt><dd>the amount of floor the shape covers, in square units.</dd>
</dl>
</div>

<div class="myth">

**“Use the slanting side as the height.”** The height is measured at a right angle to the base. In a parallelogram with a 10 cm base, a 6 cm slant and a 5 cm perpendicular height, the area is 10 × 5 = 50 cm², not 10 × 6.

</div>

<div class="problem" data-problem="c8m-area-para"></div>

## 3. Triangle: half a parallelogram

Two copies of a triangle, one turned upside down, fit together into a parallelogram with the same base and height. So a triangle is half of it:

```math
\text{Area of triangle} = \tfrac{1}{2} \times b \times h
```

Slide the top corner along a line parallel to the base. The triangle changes shape, but the base and the height stay the same, so the area stays the same too. **Triangles on the same base between the same parallel lines have equal area.**

<figure class="fig" data-fig="c8-area-between"><figcaption>Move the top corner along the upper line. The sides and perimeter change; the area stays ½ × 6 × 4 = 12 m².</figcaption></figure>

## 4. Trapezium: two copies make a parallelogram

A **trapezium** has one pair of parallel sides, `$a$` and `$b$`, with distance `$h$` between them. Make a copy, turn it upside down and join it to the original along a slanting side. The two pieces make a parallelogram with base `$a + b$` and height `$h$`. One trapezium is half of that.

<div class="steps" data-fig="c8-area-trapsteps">
<div class="step">A trapezium with parallel sides 4 m and 8 m, height 4 m.</div>
<div class="step">Make a copy and turn it upside down.</div>
<div class="step">Join the copy along the slanting side. We get a parallelogram.</div>
<div class="step">Base = 4 + 8 = 12 m, height 4 m. Parallelogram area = 12 × 4 = 48 m².</div>
<div class="step">One trapezium is half: ½ × 12 × 4 = 24 m².</div>
</div>

```math
\text{Area of trapezium} = \tfrac{1}{2} \times (a + b) \times h
```

A **rhombus** (or a kite) can be found from its diagonals `$d_1$` and `$d_2$`, which cross at right angles: area `$= \tfrac{1}{2} d_1 d_2$`.

<div class="problem" data-problem="c8m-area-trap"></div>

Explore the shear idea in the tool below.

<!--fig:tool area-shear-->

## 5. Circle: slices into a rectangle

How do we find the area of something with no straight sides? Cut the circle into thin, equal slices and lay them in a row with points alternately up and down. The more slices you cut, the more the row looks like a rectangle. Its height is the radius `$r$`. Its width is half the circumference, because half the curved edges are on the top and half on the bottom: `$\tfrac{1}{2} \times 2\pi r = \pi r$`.

<figure class="fig" data-fig="c8-area-circle"><figcaption>Choose the number of slices (4 to 64) and slide “Rearrange”. With few slices the row is bumpy. With 64 it is almost a rectangle of height r and width π r.</figcaption></figure>

So the area of the circle is the area of that rectangle:

```math
\text{Area} = \pi r \times r = \pi r^2
```

<div class="meaning">
<dl>
<dt>r</dt><dd>the radius, the distance from the centre to the edge.</dd>
<dt>π (pi)</dt><dd>about 3.14, or 22/7. It is the circumference divided by the diameter for every circle.</dd>
<dt>Circumference</dt><dd>`$2\pi r$`, the length round the circle. It is a length, not an area.</dd>
</dl>
</div>

<div class="myth">

**“Doubling the radius doubles the area.”** The area is proportional to `$r^2$`. Double r and the area becomes 2² = 4 times as big. Triple r and it is 9 times as big.

</div>

<div class="problem" data-problem="c8m-area-circle"></div>

See the idea again, with the slices you can rotate, in the circle tool.

<!--fig:tool circle-slices-->

## 6. Paths round gardens and other combined shapes

Many real problems join shapes together or take one from another. The method: find the area of each simple part, then add or subtract. For a **path** round a garden, find the area of the big rectangle (garden plus path) and subtract the garden.

A garden 10 m by 6 m has a path 1 m wide all round the outside. The big rectangle is (10 + 2) × (6 + 2) = 12 × 8 = 96 m². The garden is 60 m². The path is 96 − 60 = 36 m². Try other widths.

<figure class="fig" data-fig="c8-area-path"><figcaption>A 10 m by 6 m garden with a path of adjustable width round it. Path area = outer rectangle − garden. The readout also gives the cost of paving at ₹ 80 per m².</figcaption></figure>

<div class="problem" data-problem="c8m-area-path"></div>

When a path runs **inside** the garden, the inner rectangle is *smaller*: subtract 2 widths from each side, and the path is outer minus inner. Shapes like “a rectangle with a triangle on top” are found by adding, and “a rectangle with a circular pond cut out” by subtracting.

## 7. Pick’s theorem: counting dots

On a dot grid, draw a shape whose corners are on dots. Count the dots **inside** (`$I$`) and the dots **on the boundary** (`$B$`). Then

```math
\text{Area} = I + \frac{B}{2} - 1
```

in square units (one unit is the square joining four neighbouring dots). Drag the corners of the shape below. The picture counts the dots and also checks the answer another way.

<figure class="fig" data-fig="c8-area-pick"><figcaption>Drag the four corners (they snap to dots). Blue dots are inside, orange dots are on the edge. Pick’s formula gives the same area as the shoelace check, for any shape whose sides do not cross.</figcaption></figure>

Test it on a 4 by 3 rectangle. Inside: 3 × 2 = 6 dots. Boundary: 2 × (4 + 3) = 14 dots. Area = 6 + 7 − 1 = 12 = 4 × 3.

<div class="problem" data-problem="c8m-area-pick"></div>

Try the full tool, with many more shapes.

<!--fig:tool picks-theorem-->

<div class="history">

**Georg Pick and a forgotten theorem.** Georg Alexander Pick published his theorem in 1899. It was almost forgotten until the Polish mathematician Hugo Steinhaus included it in a popular book in 1969, and it has been a favourite in school contests ever since.

</div>

<div class="keypoints">

- Parallelogram: `$b \times h$`, with the height at a right angle to the base.
- Triangle: `$\tfrac{1}{2} b h$`. Triangles on the same base between the same parallel lines have equal areas.
- Trapezium: `$\tfrac{1}{2}(a + b)h$`. Rhombus or kite by diagonals: `$\tfrac{1}{2} d_1 d_2$`.
- Circle: `$\pi r^2$` (and circumference `$2\pi r$`). Doubling r makes the area 4 times as big.
- Path round a garden: area of outer rectangle − area of garden.
- Pick: area `$= I + B/2 - 1$` for a polygon with corners on grid dots.
- Cutting and rearranging never changes area.

</div>

Other tools to explore: the [Area shear](/learn/area-shear/), [Pick’s theorem](/learn/picks-theorem/), [Circle slices](/learn/circle-slices/), [Heron’s formula](/learn/herons-formula/) and [Geometry construction](/learn/geometry-construction/) tools work on their own too. Ready for exam-style questions? Go to [Area: practice questions](/learn/courses/ncert-class-8-maths/area-practice/).
