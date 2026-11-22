---
title: 'Measuring Space: Perimeter and Area'
seoTitle: 'Perimeter and Area Class 9 notes: Heron’s formula'
summary: 'Class 9 Perimeter and Area with animations: triangles, quadrilaterals, Heron’s formula, fields split into triangles, and same perimeter with different area.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'A triangle has sides 6 m, 8 m and 10 m. Its area by Heron’s formula is:'
    choices: ['24 m²', '48 m²', '12 m²', '240 m²']
    ans: 0
    why: 's = 12. Area = √(12 × 6 × 4 × 2) = √576 = 24 m². (It is a right triangle: ½ × 6 × 8 = 24.)'
  - q: 'A rectangular plot has perimeter 36 m and length 10 m. Its area is:'
    choices: ['80 m²', '360 m²', '46 m²', '26 m²']
    ans: 0
    why: 'Breadth = 36 ÷ 2 − 10 = 8 m. Area = 10 × 8 = 80 m².'
  - q: 'A fence is fixed at 40 m for a rectangular pen. Which pen holds the most area?'
    choices: ['10 m by 10 m', '15 m by 5 m', '18 m by 2 m', '12 m by 8 m']
    ans: 0
    why: 'The areas are 100, 75, 36 and 96 m². For a fixed perimeter the square gives the largest area.'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 6 “Measuring Space: Perimeter and Area” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Heron of Alexandria’s formula for the area of a triangle from its three sides (first century CE); standard school geometry, every worked example was recomputed a second way (base × height or coordinates).'
---

**Maths · Class 9 · Chapter 6 · about 55 minutes.** By the end you will be able to find the perimeter and area of triangles and four-sided shapes, use Heron’s formula when you only know the three sides, find the area of an odd-shaped field by splitting it into triangles, and explain why two plots with the same fence can hold different amounts of land.

<div class="bigidea">Perimeter measures the way round, area measures the space inside. Every straight-sided shape can be cut into triangles, and a triangle’s area comes from its base and height, or, if you know only the sides, from Heron’s formula. So every field can be measured.</div>

## 1. Perimeter and area: two different questions

Imagine a school ground. If you ask “how far do I walk to go once round the boundary?”, you want the **perimeter**: a length, in metres. If you ask “how much grass do I need to cover it?”, you want the **area**: a surface, in **square metres (m²)**. One square metre is a square of side 1 m, and the area counts how many of these squares fit inside.

Change the length and breadth of the rectangle below. Switch between counting the tiles (area) and walking round the edge (perimeter).

<figure class="fig" data-fig="c9-area-units"><figcaption>Area: the number of unit squares inside, so length × breadth. Perimeter: the distance walked round the edge, so 2 × (length + breadth). Notice the units: m for perimeter, m² for area.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Perimeter</dt><dd>the total length of all the sides, a length (m, cm, km). It decides the cost of a fence, a border, a lace.</dd>
<dt>Area</dt><dd>the amount of flat surface inside, in square units (m², cm², hectares). It decides the cost of tiles, paint, turf, seeds.</dd>
<dt>Rectangle</dt><dd>perimeter `$2(l + b)$` and area `$l \times b$`. A square of side `$a$`: `$4a$` and `$a^2$`.</dd>
<dt>Physical meaning</dt><dd>perimeter is one-dimensional (a line you can walk), area is two-dimensional (a surface you can cover).</dd>
</dl>
</div>

<div class="myth">

**“A bigger perimeter means a bigger area.”** Not always. A thin strip 20 m by 1 m has perimeter 42 m but area only 20 m². A 6 m by 6 m square has a smaller perimeter, 24 m, and a bigger area, 36 m². We look at this closely in Section 6.

</div>

<div class="problem" data-problem="c9m-area-fence"></div>

## 2. Triangles: half of a rectangle

Take any rectangle and cut it along a diagonal. You get two triangles that match exactly, so each is half of the rectangle. That gives the area of a triangle with base `$b$` and height `$h$` (the straight-up distance from the base to the opposite corner):

```math
\text{Area} = \tfrac{1}{2} \times b \times h
```

The height is always measured at a right angle to the base, not along a slanting side. You can slide the top corner anywhere along a line parallel to the base and neither the base nor the height changes, so the area does not either.

<div class="steps" data-fig="c9-area-trisplit">
<div class="step">A rectangle with base b and height h has area b × h.</div>
<div class="step">Cut it along a diagonal. The two triangles are exact copies, so each is half of the rectangle.</div>
<div class="step">So the area of one triangle is ½ × b × h.</div>
<div class="step">Slide the top corner along the top edge. The base and the height have not changed, so the area is still half of the rectangle.</div>
<div class="step">Even if the top corner is beyond the end of the base, the height is the straight-down distance to the line of the base, and the area is still ½ × b × h.</div>
</div>

<div class="problem" data-problem="c9m-area-tri"></div>

<div class="myth">

**“Use the slanting side as the height.”** The height must be perpendicular to the base. In a triangle with sides 13, 14 and 15 and base 14, the height is 12, not 13 or 15. Only in a right triangle is one of the sides itself a height.

</div>

## 3. Four-sided shapes: from triangles and rectangles

All the common four-sided shapes follow from the rectangle and the triangle. Choose a shape below, set its measurements with the sliders, and read off area and perimeter. A check from the corners at the bottom confirms the formula.

<figure class="fig" data-fig="c9-area-shapes"><figcaption>Rectangle l × b; parallelogram base × height; triangle ½ × base × height; rhombus ½ × d₁ × d₂ (the diagonals); trapezium ½ × (sum of parallel sides) × height. The grey “check” number is the area worked out another way, from the coordinates of the corners.</figcaption></figure>

**Parallelogram.** Cut a triangle off one slanting end and slide it to the other end. The result is a rectangle with the same base and the same height, so the area is **base × height**. Lean the shape over and the slanting sides get longer, so the perimeter grows, but the area does not change:

<figure class="fig" data-fig="c9-area-para"><figcaption>A parallelogram leaning more and more. The base (8 m) and height (5 m) never change, so the area stays 40 m², but the perimeter keeps growing because the slanting sides get longer.</figcaption></figure>

**Rhombus.** Its diagonals cross at right angles, so it is made of four equal right triangles. Its area is `$\tfrac{1}{2} d_1 d_2$`. **Trapezium.** Draw a diagonal. The two triangles have the two parallel sides as their bases and the same height `$h$` (the gap between the parallel sides), so the area is `$\tfrac{1}{2}(a + b)h$`.

<div class="problem" data-problem="c9m-area-rhombus"></div>

## 4. Any four-sided field: cut it along a diagonal

For an odd four-sided plot we have no ready formula, but we do not need one. Cut it along a diagonal. Now we have two triangles with the diagonal as a common base. If we measure the perpendicular distances `$h_1$` and `$h_2$` from the other two corners to the diagonal, then

```math
\text{Area} = \tfrac{1}{2} \times AC \times h_1 + \tfrac{1}{2} \times AC \times h_2 = \tfrac{1}{2} \times AC \times (h_1 + h_2)
```

This is how land surveyors have measured fields for centuries: a rope along the diagonal, and a measure at right angles from each corner. In some old Indian land records you will see this called measuring by “offsets”.

<div class="steps" data-fig="c9-area-quadsteps">
<div class="step">A four-sided plot ABCD. We have no ready formula for this shape.</div>
<div class="step">Draw the diagonal AC. The plot is now two triangles, ABC and ACD, that share the side AC.</div>
<div class="step">Drop a perpendicular from B onto AC (3 m) and from D onto AC (4 m).</div>
<div class="step">Triangle ABC is ½ × 10 × 3 = 15 m². Triangle ACD is ½ × 10 × 4 = 20 m².</div>
<div class="step">Add: 15 + 20 = 35 m². In one go, ½ × AC × (h₁ + h₂) = ½ × 10 × 7 = 35 m².</div>
</div>

<div class="problem" data-problem="c9m-area-quad"></div>

## 5. Heron’s formula: the area from the three sides alone

Sometimes you can measure the three sides of a triangle (with a rope or a tape) but it is awkward to measure a height, for instance across a pond. **Heron of Alexandria**, about 2,000 years ago, found a formula that needs only the sides. Let the sides be `$a$`, `$b$`, `$c$` and let `$s$` be **half the perimeter**:

```math
s = \frac{a + b + c}{2}, \qquad \text{Area} = \sqrt{s(s - a)(s - b)(s - c)}
```

<div class="meaning">
<dl>
<dt>a, b, c</dt><dd>the three sides of the triangle, in the same unit.</dd>
<dt>s</dt><dd>the semi-perimeter: half of a + b + c.</dd>
<dt>s − a, s − b, s − c</dt><dd>how far each side falls short of s. Each must be positive, or no triangle exists.</dd>
<dt>Physical meaning</dt><dd>the formula is symmetric: it does not matter which side you call a, b or c, because the area belongs to the triangle, not to a particular base.</dd>
</dl>
</div>

Follow it on the triangle with sides 13 m, 14 m and 15 m:

<div class="steps" data-fig="c9-area-heronsteps">
<div class="step">A triangle with sides a = 13 m, b = 14 m and c = 15 m. We do not know a height.</div>
<div class="step">Half the perimeter: s = (13 + 14 + 15) ÷ 2 = 21 m.</div>
<div class="step">s − a = 8, s − b = 7, s − c = 6.</div>
<div class="step">Multiply s and the three differences: 21 × 8 × 7 × 6 = 7056.</div>
<div class="step">Take the square root: √7056 = 84. The area is 84 m².</div>
<div class="step">Check by another route: drop a height of 12 m on the base 14 m: ½ × 14 × 12 = 84 m². The two methods agree.</div>
</div>

<div class="problem" data-problem="c9m-area-heron"></div>

Now try it yourself with real triangles. Drag the corners, and watch Heron’s formula and base × height give the same area every time.

<figure class="fig" data-fig="c9-area-herondrag"><figcaption>Drag the three dots. The sides change, and Heron’s area and the base × height area stay equal. Make the three corners lie on a straight line: the triangle goes flat and the area becomes 0.</figcaption></figure>

<!--fig:tool herons-formula-->

**When is there a triangle at all?** The two short sides must together be longer than the long side. If not, they cannot reach across, and one of the numbers `$s - a$`, `$s - b$`, `$s - c$` is zero or negative, so the square root is not a real number. Set the sides yourself below and find where the triangle disappears.

<figure class="fig" data-fig="c9-area-sides"><figcaption>Choose three sides. If the shortest two add to more than the longest, a triangle appears and Heron gives its area. Push the longest side up to the sum of the other two and the triangle flattens and the area drops to zero.</figcaption></figure>

<div class="myth">

**“Any three lengths make a triangle.”** Try 3 m, 4 m and 8 m. A rope of 3 m and a rope of 4 m, tied end to end, only reach 7 m, so they can never join the ends of an 8 m rope. The sum of any two sides must be greater than the third.

</div>

**A special case.** For an equilateral triangle of side `$a$`, `$s = \tfrac{3a}{2}$` and every `$s - a = \tfrac{a}{2}$`, so the area is `$\sqrt{\tfrac{3a}{2} \cdot \tfrac{a}{2} \cdot \tfrac{a}{2} \cdot \tfrac{a}{2}} = \tfrac{\sqrt{3}}{4}a^2$`.

<div class="problem" data-problem="c9m-area-equi"></div>

## 6. Fields: splitting into triangles

Real fields are not neat rectangles. The method is always the same: cut the field into triangles, find each area, add them up. When the sides of the triangles are known, Heron’s formula does the job. Here is Meena’s field, measured with a measuring tape and one rope along a diagonal.

<div class="steps" data-fig="c9-area-fieldsteps">
<div class="step">Meena’s field ABCD has sides 13 m, 14 m, 8 m and 17 m. A rope pulled along the diagonal AC measures 15 m.</div>
<div class="step">The rope cuts the field into two triangles. For each we now know all three sides, so Heron’s formula works.</div>
<div class="step">Triangle ABC has sides 13, 14, 15. s = 21, area = √(21 × 8 × 7 × 6) = 84 m².</div>
<div class="step">Triangle ACD has sides 15, 8, 17. s = 20, area = √(20 × 5 × 12 × 3) = √3600 = 60 m².</div>
<div class="step">The field’s area is 84 + 60 = 144 m².</div>
<div class="step">At ₹ 50 per m², levelling the field costs 144 × 50 = ₹ 7,200. Fencing it needs the perimeter, 13 + 14 + 8 + 17 = 52 m of wire.</div>
</div>

Notice the two different jobs. **Levelling, ploughing, sowing** are about area: how much ground. **Fencing, a wall, a border** are about perimeter: how long. Mixing them up is the commonest mistake in these questions.

Use the field tool to build your own field, split it, and read off the area.

<!--fig:tool field-area-->

<div class="problem" data-problem="c9m-area-field"></div>

## 7. Same perimeter, different area

A farmer has exactly 24 m of fencing and wants the largest rectangular pen. She can make 1 m by 11 m, 2 m by 10 m, 3 m by 9 m, and so on. They all use the same fence. Do they hold the same amount of land? No. Slide the length and watch the area change.

<figure class="fig" data-fig="c9-area-same"><figcaption>Each bar is the area of one rectangle made with the same fence. The tallest bar is the square. A square is the “roundest” rectangle: it wastes the least fence on the edge.</figcaption></figure>

With a fixed fence `$P$` and length `$l$`, breadth `$= \tfrac{P}{2} - l$` and area `$= l(\tfrac{P}{2} - l)$`. It is biggest when the length equals the breadth, `$l = \tfrac{P}{4}$`, a square of area `$\left(\tfrac{P}{4}\right)^2$`. A triangle behaves the same way: with a fixed 30 m of rope, the equilateral triangle holds the most.

<figure class="fig" data-fig="c9-area-isosceles"><figcaption>Isosceles triangles with perimeter 30 m. The bars show their areas by Heron’s formula. The biggest is the equilateral triangle with base 10 m.</figcaption></figure>

The reverse is also true: the **same area** can need very different fences. A 36 m² plot is 6 m × 6 m (24 m round), or 36 m × 1 m (74 m round). That is why a compact plot is cheaper to fence.

<div class="keypoints">

- Perimeter is the length round the edge (m); area is the surface inside (m²). Rectangle: `$2(l+b)$` and `$lb$`.
- Triangle: area `$\tfrac{1}{2}bh$`, with the height at a right angle to the base. Parallelogram: `$bh$`. Rhombus: `$\tfrac{1}{2}d_1d_2$`. Trapezium: `$\tfrac{1}{2}(a+b)h$`.
- Any four-sided field: cut along a diagonal; area `$= \tfrac{1}{2} \times \text{diagonal} \times (h_1 + h_2)$`.
- Heron’s formula: `$s = \tfrac{a+b+c}{2}$` and area `$= \sqrt{s(s-a)(s-b)(s-c)}$`. It needs only the three sides, which must satisfy: the sum of any two is greater than the third.
- For a field, split it into triangles, find each area, then add. Use area for levelling and sowing, and perimeter for fencing.
- With a fixed perimeter, the square (for rectangles) and the equilateral triangle (for triangles) enclose the most area.

</div>

Other tools to explore: the [Heron’s formula tool](/learn/herons-formula/) and the [Field area tool](/learn/field-area/) work on their own too. Ready for exam-style questions? Go to [Measuring Space: Perimeter and Area: practice questions](/learn/courses/ncert-class-9-maths/perimeter-and-area-practice/).
