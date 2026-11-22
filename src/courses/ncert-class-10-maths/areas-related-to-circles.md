---
title: Areas Related to Circles
seoTitle: 'Areas Related to Circles Class 10 notes'
summary: 'Class 10 Areas Related to Circles with animations: sector area and arc length, segment of a circle, and combined figures like tracks, with practice.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'The area of a sector of angle 60° in a circle of radius 6 cm is:'
    choices: ['6π cm²', '12π cm²', '36π cm²', '3π cm²']
    ans: 0
    why: 'A 60° sector is 60/360 = 1/6 of the circle. Area = (1/6) × π × 6² = 6π cm².'
  - q: 'The area of the minor segment cut off by a chord that subtends 90° at the centre of a circle of radius r is:'
    choices: ['πr²/4 − r²/2', 'πr²/4 + r²/2', 'πr²/4', 'πr²/2 − r²']
    ans: 0
    why: 'Segment = sector − triangle. The sector is πr²/4 and the right-angled triangle OAB has area ½ × r × r = r²/2.'
  - q: 'A track has two straight sides of 80 m and semicircular ends of radius 14 m. One lap along the inner edge is (π = 22/7):'
    choices: ['248 m', '160 m', '204 m', '336 m']
    ans: 0
    why: 'The two semicircles make one full circle: 2πr = 2 × 22/7 × 14 = 88 m. Lap = 2 × 80 + 88 = 248 m.'
sources:
  - 'NCERT Class 10 Mathematics, Chapter 11 “Areas Related to Circles” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Circle area and circumference formulas (πr², 2πr) are standard school geometry. π is taken as 22/7 or 3.14 as the board papers specify. Examples checked by working each number out twice.'
---

**Maths · Class 10 · Chapter 11 · about 50 minutes.** By the end you will be able to find the area and the arc length of a sector, the area of a minor or major segment, and the area or perimeter of figures made from circles, squares and triangles, such as running tracks and wiper sweeps.

<div class="bigidea">A sector is just a fraction of a circle, and the fraction is always the angle divided by 360. Multiply that fraction by the whole circle's circumference to get the arc, or by its area to get the sector. A segment is the sector with a triangle removed.</div>

**What is in this chapter (2023 rationalised book).** Area of sectors and segments of a circle, and problems on areas and perimeters of figures that combine triangles, simple quadrilaterals and circles. In segment problems the central angle is only 60°, 90° or 120°.

## 1. Quick recap: circumference and area

For a circle of radius `$r$` (and diameter `$d = 2r$`):

```math
\text{circumference} = 2\pi r, \qquad \text{area} = \pi r^2
```

Use `$\pi = \tfrac{22}{7}$` when the radius is a multiple of 7 (for example 7, 14, 21), and `$\pi = 3.14$` otherwise, unless the question says what to use. **Circumference is a length, in cm or m. Area is a surface, in cm² or m².**

Why is the area `$\pi r^2$`? Cut a circle into thin slices like a pizza and lay them side by side, one pointing up and the next pointing down. With more and more slices the shape becomes a rectangle. Its length is half the circumference, `$\pi r$`, and its width is `$r$`, so the area is `$\pi r \times r$`.

<figure class="fig" data-fig="c10-arc-unroll"><figcaption>Cut the circle into n thin sectors and rearrange them. With more pieces the wavy shape becomes a rectangle πr long and r wide, so the area is πr × r = πr². Press Play, then raise the number of pieces.</figcaption></figure>

<div class="meaning">
<dl>
<dt>r</dt><dd>the radius, from the centre to the edge.</dd>
<dt>2πr</dt><dd>the circumference, the distance once round the edge.</dd>
<dt>πr²</dt><dd>the area, the amount of surface inside.</dd>
<dt>Physical meaning</dt><dd>doubling the radius doubles the distance round but makes the area four times as big. A 14-inch pizza is not twice a 7-inch one but four times.</dd>
</dl>
</div>

<div class="myth">

**“Circumference and area are the same thing.”** `$2\pi r$` is how far you walk round; `$\pi r^2$` is how much grass you cover. For r = 7 cm they are 44 cm and 154 cm². Different units, different ideas.

</div>

## 2. Sector of a circle

A **sector** is the part of a circle between two radii and the arc they cut. The angle between the radii is the **angle of the sector**, `$\theta$`. A slice of pizza, a paper fan, the part of a clock face swept by a hand: all sectors.

The small sector is the **minor sector** (angle less than 180°) and the large one is the **major sector** (angle more than 180°). Together they make the whole circle. Drag the dot below. The sector is always the fraction `$\theta/360$` of the circle, so both its arc and its area are that fraction of the whole circle's circumference and area.

<figure class="fig" data-fig="c10-arc-sector"><figcaption>Drag the dot (or use the slider) to change θ. Toggle "Other sector" to see the major sector. Arc length = θ/360 × 2πr and area = θ/360 × πr², with the numbers worked out for you.</figcaption></figure>

```math
\text{Arc length } l = \frac{\theta}{360} \times 2\pi r, \qquad \text{Area of sector} = \frac{\theta}{360} \times \pi r^2
```

<div class="meaning">
<dl>
<dt>θ</dt><dd>the angle of the sector at the centre, in degrees.</dd>
<dt>θ/360</dt><dd>the fraction of the circle taken by the sector: 90° gives ¼, 60° gives ⅙, 180° gives ½.</dd>
<dt>l</dt><dd>the length of the arc (the curved edge) of the sector, in the same unit as r.</dd>
<dt>Physical meaning</dt><dd>if you take a quarter of a pizza, you get a quarter of the crust and a quarter of the cheese. Everything scales by the same fraction.</dd>
</dl>
</div>

The pizza makes it concrete. Change the number of slices and the number eaten:

<figure class="fig" data-fig="c10-arc-pizza"><figcaption>A pizza of radius 14 cm (area 616 cm², crust 88 cm) cut into equal slices. Each slice is a sector of angle 360/n. Eat some slices and read the area and crust left behind.</figcaption></figure>

**Doubling the angle doubles both.** Arc length and sector area are proportional to the angle, so on a graph they are straight lines through the origin.

<figure class="fig" data-fig="c10-arc-graph"><figcaption>Both lines are straight: 60° gives one sixth of the full arc and one sixth of the full area. Change the radius and the lines tilt, but they still start at zero.</figcaption></figure>

**Worked example.** Find the arc length and area of a sector of angle 60° in a circle of radius 21 cm (π = 22/7).

- Fraction `$= 60/360 = 1/6$`.
- Arc `$= \tfrac16 \times 2 \times \tfrac{22}{7} \times 21 = \tfrac16 \times 132 = 22$` cm.
- Area `$= \tfrac16 \times \tfrac{22}{7} \times 21^2 = \tfrac16 \times 1386 = 231$` cm².

<div class="problem" data-problem="c10m-arc-sector"></div>

<div class="problem" data-problem="c10m-arc-arc"></div>

**Working backwards.** If you know the area or arc length, find the angle: `$\theta = \dfrac{\text{area} \times 360}{\pi r^2}$`. The fraction is a ratio, so you can also compare directly: a sector with one-third of the full circle's area has an angle of 120°.

<div class="problem" data-problem="c10m-arc-angle"></div>

**Perimeter of a sector.** Its boundary has the arc and the two radii: `$P = l + 2r$`. Do not forget the radii.

<div class="myth">

**“The perimeter of a sector is just the arc length.”** The curved edge is only the arc. The boundary of the slice also includes the two straight edges, so `$P = \dfrac{\theta}{360} \times 2\pi r + 2r$`. For a 90° sector of radius 14: arc = 22 cm, perimeter = 22 + 28 = 50 cm.

</div>

### Real life: the clock hand

A minute hand turns 360° in 60 minutes, so 6° every minute. The hour hand turns 0.5° every minute. A hand of length r sweeps a sector, so the area swept in t minutes is `$\frac{6t}{360}\pi r^2$` for the minute hand.

<figure class="fig" data-fig="c10-arc-clock"><figcaption>The hand sweeps a sector as time passes. Press Play, switch between the minute and hour hands, or change the hand length. Compare the swept area in 15 minutes for a 7 cm and a 14 cm hand: the long one sweeps four times the area.</figcaption></figure>

<div class="problem" data-problem="c10m-arc-clock"></div>

Try the sector tool, where you can drag the edge of a sector and see its area, arc length and segment area with different values of π:

<!--fig:tool circle-sector-->

### Real life: car wipers and grazing animals

A windscreen wiper whose blade runs from a to b centimetres from the pivot, swinging through an angle θ, clears **part of a ring**: the bigger sector (radius b) minus the smaller sector (radius a). Its area is `$\dfrac{\theta}{360}\pi(b^2 - a^2)$`.

<figure class="fig" data-fig="c10-arc-wiper"><figcaption>The wiper clears the blue patch. Its area is the sector of radius b minus the sector of radius a, both with the same angle θ.</figcaption></figure>

A goat tied with a rope grazes a sector too, and the angle depends on where it is tied. At the corner of a field the free angle is 90°, at the middle of a straight wall it is 180°, and at the outside corner of a shed it is 270°.

<figure class="fig" data-fig="c10-arc-graze"><figcaption>The rope of length r sweeps a sector whose angle is set by the walls. Change the post position: the angle becomes 90°, 180° or 270°, and the grass area is angle/360 × πr² (the rope is not longer than a wall).</figcaption></figure>

## 3. Segment of a circle

A chord AB divides a circle into two parts, each called a **segment**. The smaller is the **minor segment**; the larger is the **major segment**. A segment is bounded by a chord and an arc (a sector by two radii and an arc).

If the central angle is θ, then the area of the minor segment is the sector OAB with the triangle OAB removed:

```math
\text{Minor segment} = \text{Sector OAB} - \text{Triangle OAB} = \frac{\theta}{360}\pi r^2 - \frac12 r^2 \sin\theta
```

and the **major segment = whole circle − minor segment**.

<figure class="fig" data-fig="c10-arc-segment"><figcaption>Choose 60°, 90° or 120° (the angles the board syllabus uses) and a radius. The shaded part is the minor segment (or the major segment if you switch); the numbers show sector, triangle and segment.</figcaption></figure>

Here is the whole method on one example: a chord subtending 90° in a circle of radius 14 cm (π = 22/7).

<div class="steps" data-fig="c10-arc-segsteps">
<div class="step">The chord AB cuts a minor segment from the circle of radius 14 cm. The angle AOB at the centre is 90°.</div>
<div class="step">Shade the sector OAB, which is a quarter of the circle.</div>
<div class="step">Sector area = 90/360 × 22/7 × 14² = ¼ × 616 = 154 cm².</div>
<div class="step">Triangle OAB has a right angle at O and two sides of 14 cm, so its area is ½ × 14 × 14 = 98 cm².</div>
<div class="step">The segment is what remains of the sector after the triangle is taken out.</div>
<div class="step">Segment area = 154 − 98 = 56 cm².</div>
</div>

**The triangle for 60°, 90° and 120°.** The board gives only these three angles so that the triangle is easy:

<div class="steps" data-fig="c10-arc-triangle">
<div class="step">The triangle OAB has two radii as sides, OA = OB = r, and the chord AB as base.</div>
<div class="step">For 60°: the two base angles are equal, so each is (180° − 60°) ÷ 2 = 60°. The triangle is equilateral with side r.</div>
<div class="step">Its area is (√3/4) r².</div>
<div class="step">For 90°: the right angle is at O, and the two legs are r, so the area is ½ × r × r = ½ r².</div>
<div class="step">For 120°: draw OM perpendicular to AB. M is the midpoint of AB, and ∠AOM = 60°.</div>
<div class="step">OM = r cos 60° = r/2 and AM = r sin 60° = (√3/2) r, so AB = √3 r.</div>
<div class="step">Area = ½ × AB × OM = ½ × √3 r × r/2 = (√3/4) r², the same as for 60°.</div>
</div>

| Central angle θ | Triangle OAB | Minor segment |
|---|---|---|
| 60° | `$\dfrac{\sqrt3}{4}r^2$` | `$\dfrac{\pi r^2}{6} - \dfrac{\sqrt3}{4}r^2$` |
| 90° | `$\dfrac12 r^2$` | `$\dfrac{\pi r^2}{4} - \dfrac12 r^2$` |
| 120° | `$\dfrac{\sqrt3}{4}r^2$` | `$\dfrac{\pi r^2}{3} - \dfrac{\sqrt3}{4}r^2$` |

<div class="problem" data-problem="c10m-arc-segment"></div>

**Major segment.** For the example above, the circle is 616 cm² and the minor segment is 56 cm², so the major segment is 616 − 56 = **560 cm²**. Always check that your minor segment is smaller than half the circle.

<div class="myth">

**“Segment = sector + triangle.”** The triangle is *inside* the sector, so you subtract it. If you add it you get a shape bigger than the sector, which cannot be the part of the sector outside the triangle. Check: the segment must be a thin sliver, smaller than the sector.

</div>

## 4. Areas of combined figures

Many questions join squares, rectangles, triangles, semicircles and sectors. The method is always the same: **split the figure into simple shapes, find each area (or length), then add or subtract.**

**A tile with cut corners.** A square of side 14 cm has a quarter circle of radius 7 cm cut from each corner. The four quarter circles together make one full circle, so the area left is the square minus a circle:

<div class="steps" data-fig="c10-arc-combo">
<div class="step">A square tile of side 14 cm. Its area is 14 × 14 = 196 cm².</div>
<div class="step">Cut a quarter circle of radius 7 cm from each corner.</div>
<div class="step">The four quarters are pieces of one circle of radius 7: slide them together to see the full circle.</div>
<div class="step">The circle's area is 22/7 × 7² = 154 cm².</div>
<div class="step">The shaded area left is 196 − 154 = 42 cm².</div>
</div>

**A running track.** A track is a rectangle with a semicircle on each end. Its two straight sides each have length `$L$`; the two semicircles together make one circle of radius `$r$`. So one lap along the inner edge is `$2L + 2\pi r$` and the area inside is `$2rL + \pi r^2$`.

<figure class="fig" data-fig="c10-arc-track"><figcaption>Change the straight length L and the end radius r, then press Play to run a lap. Lap = 2L + 2πr; area = 2rL + πr².</figcaption></figure>

<div class="problem" data-problem="c10m-arc-track"></div>

**A path round a circular park.** If the path is w wide, the outer circle has radius r + w. The path is the ring between the circles: area `$= \pi(r+w)^2 - \pi r^2 = \pi w (2r + w)$`.

<figure class="fig" data-fig="c10-arc-path"><figcaption>The path is the ring between two circles. Make the path wider and watch the area grow faster than the width: the outer edge is longer.</figcaption></figure>

<div class="problem" data-problem="c10m-arc-ring"></div>

**Exam checklist.**

1. Write which circle values you will use: r, and π = 22/7 or 3.14.
2. Name each piece: sector, segment, triangle, rectangle, ring.
3. Write the fraction `$\theta/360$` first, then multiply.
4. Segment: sector − triangle (never plus).
5. Combined figure: split, calculate each part, then add or subtract.
6. Units: cm for lengths, cm² for areas. Round only at the end.

Move on to solids in [Surface Areas and Volumes](/learn/courses/ncert-class-10-maths/surface-areas-and-volumes/), or review the circle language in [Circles](/learn/courses/ncert-class-10-maths/circles/).

<div class="history">

<ul class="timeline">
<li><b>about 250 BCE</b> Archimedes proves that the area of a circle equals that of a right triangle with legs r and 2πr and shows that π lies between 3 10/71 and 3 1/7.</li>
<li><b>499 CE</b> Aryabhata gives 62832/20000 = 3.1416 as the ratio of circumference to diameter and calls it approximate.</li>
<li><b>about 1400 CE</b> Madhava of Sangamagrama (Kerala) finds infinite series for π and computes it to 11 decimal places.</li>
</ul>

</div>

<div class="keypoints">

- Circle: circumference `$2\pi r$`, area `$\pi r^2$`. Use `$\pi = \tfrac{22}{7}$` for radii like 7, 14, 21 and 3.14 otherwise.
- A sector with angle θ is the fraction `$\theta/360$` of the circle.
- Arc length `$l = \dfrac{\theta}{360} \times 2\pi r$`. Area of sector `$= \dfrac{\theta}{360} \times \pi r^2$`. Perimeter of a sector `$= l + 2r$`.
- Minor segment = sector − triangle OAB. Major segment = circle − minor segment.
- Triangle OAB: `$\tfrac12 r^2$` for 90°; `$\tfrac{\sqrt3}{4}r^2$` for 60° and for 120°.
- Clock hand: minute hand turns 6° per minute, hour hand 0.5° per minute.
- Combined figures: split into simple shapes, then add or subtract. Track lap `$= 2L + 2\pi r$`; path area `$= \pi w(2r + w)$`; wiper `$= \tfrac{\theta}{360}\pi(b^2 - a^2)$`.

</div>

Ready for exam-style questions? Go to [Areas Related to Circles: practice questions](/learn/courses/ncert-class-10-maths/areas-related-to-circles-practice/).
