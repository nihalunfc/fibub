---
title: Triangles
seoTitle: 'Triangles Class 10 notes: similarity, BPT, AA, SSS, SAS'
summary: 'Class 10 Triangles with animations: similar figures, basic proportionality theorem and its proof, AA, SSS and SAS similarity, and shadow-height problems.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'In triangle ABC, DE is parallel to BC with D on AB and E on AC. If AD = 3, DB = 6 and AE = 2, then EC is:'
    choices: ['4', '1', '3', '9']
    ans: 0
    why: 'AD/DB = AE/EC gives 3/6 = 2/EC, so EC = 2 × 6 ÷ 3 = 4.'
  - q: 'Triangle ABC has angles 40° and 70°. Triangle PQR has angles 70° and 70°. Are they similar?'
    choices: ['Yes, by AA', 'No', 'Yes, by SSS', 'Only if the sides are known']
    ans: 0
    why: 'ABC has angles 40°, 70°, 70° (the third is 180 − 110). PQR has 70°, 70° and 40°. All three angles match, so they are similar (AA).'
  - q: 'A 2 m stick casts a 3 m shadow. At the same time a building casts a 45 m shadow. The building is:'
    choices: ['30 m tall', '67.5 m tall', '22.5 m tall', '45 m tall']
    ans: 0
    why: 'The sun makes similar triangles, so height ÷ shadow is the same: 2/3 = h/45, so h = 30.'
sources:
  - 'NCERT Class 10 Mathematics, Chapter 6 “Triangles” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Euclid, Elements Book VI (proportional division of sides and similar figures); Thales of Miletus is traditionally credited with the shadow method, reported by Diogenes Laertius and Plutarch'
---

**Maths · Class 10 · Chapter 6 · about 55 minutes.** By the end you will be able to say when two figures are similar, use the basic proportionality theorem to find lengths, decide whether two triangles are similar using AA, SSS or SAS, and measure tall things by their shadows.

<div class="bigidea">Similar figures have the same shape but not necessarily the same size, like a photo and its enlargement. For triangles, “same shape” is easy to test: equal angles, or sides in the same ratio. A line parallel to one side of a triangle cuts a smaller triangle that is similar to the big one, and that is why it cuts the other two sides in the same ratio.</div>

## 1. Similar figures

Think of a photograph and its enlargement at the studio, or a map and the town. Everything is bigger or smaller, but nothing is bent out of shape. Two figures with the same shape are **similar**.

For polygons (figures with straight sides), two things must both be true:

1. all **corresponding angles are equal**, and
2. all **corresponding sides are in the same ratio**. That ratio is the **scale factor** `$k$`.

Use the figure below. Scale the house evenly and both the width and height change by the same factor, and the roof angle stays the same. Switch to a “stretched” copy and watch the shape go wrong.

<figure class="fig" data-fig="c10-tri-simfig"><figcaption>An evenly scaled copy keeps every angle and multiplies every length by k, so it is similar. A copy stretched only sideways changes the roof angle and the width and height ratios no longer match: not similar.</figcaption></figure>

<div class="meaning">
<dl>
<dt>∼</dt><dd>the symbol for “is similar to”. ABC ∼ PQR means the angles at A, B, C equal the angles at P, Q, R, in that order.</dd>
<dt>Corresponding</dt><dd>sitting in the same place in the two figures: A matches P, B matches Q, C matches R.</dd>
<dt>Scale factor k</dt><dd>how many times longer each side of the copy is: PQ/AB = QR/BC = RP/CA = k.</dd>
</dl>
</div>

<div class="myth">

**“If the angles are equal the polygons are similar.”** Only for triangles. A square and a long thin rectangle have all angles 90°, but their sides are not in the same ratio. For figures with four or more sides both conditions are needed. Similarly, equal sides ratios alone do not make a square and a rhombus similar.

</div>

Some similar figures always: any two circles, any two squares, any two equilateral triangles.

<div class="problem" data-problem="c10m-tri-photo"></div>

## 2. Similar triangles

Triangles are special: you only need to check **one** of the two conditions, and the other follows. That is why we will have three short tests in section 4. First we look at the most important way similar triangles appear: a line parallel to one side.

## 3. The basic proportionality theorem

Draw any triangle ABC and a line DE across it parallel to BC, meeting AB at D and AC at E. The line slices off a small triangle ADE at the top. Move D up and down and watch the two ratios, AD/DB and AE/EC.

<figure class="fig" data-fig="c10-tri-bpt"><figcaption>With DE parallel to BC, the two ratios are always equal, whatever the position of D. Tilt the line and they split apart, and the figure tells you DE is no longer parallel. That second fact is the converse of the theorem.</figcaption></figure>

> **Basic proportionality theorem (Thales’ theorem).** If a line is drawn parallel to one side of a triangle to meet the other two sides at distinct points, it divides those two sides in the same ratio.

```math
DE \parallel BC \;\Longrightarrow\; \frac{AD}{DB} = \frac{AE}{EC}
```

**Converse.** If a line divides two sides of a triangle in the same ratio, it is parallel to the third side. So the equal ratio is a test for parallel lines, as in a carpenter’s check that a shelf is level with the base.

**Why it is true.** Here is a proof using only areas of triangles (area = ½ × base × height):

<div class="steps" data-fig="c10-tri-bptproof">
<div class="step">Given: in triangle ABC, DE ∥ BC. To prove: AD/DB = AE/EC.</div>
<div class="step">Join B to E and C to D. We now have triangles ADE, BDE and CDE to compare.</div>
<div class="step">Triangles ADE and BDE both have their top vertex at E, and their bases AD and DB lie on the same line AB. So they have the same height (from E to AB), and their areas are in the ratio of their bases: ar(ADE)/ar(BDE) = AD/DB.</div>
<div class="step">In the same way, triangles ADE and CDE have the same height from D to AC, so ar(ADE)/ar(CDE) = AE/EC.</div>
<div class="step">Triangles BDE and CDE have the same base DE. Their other vertices B and C are on the line BC, parallel to DE, so they are at the same distance from DE: the same height. So ar(BDE) = ar(CDE). Then the two ratios above are equal: AD/DB = AE/EC.</div>
</div>

<div class="myth">

**“DE has to cut the sides in halves.”** It can cut them anywhere. Only the *ratios* must agree. The mid-point case, where each ratio is 1, is a special case: a line through the mid-point of one side, parallel to a second, passes through the mid-point of the third.

</div>

Now a worked example, step by step:

<div class="steps" data-fig="c10-tri-bptexample">
<div class="step">In triangle ABC, DE is parallel to BC. AD = 3 cm, DB = 2 cm and AE = 4.5 cm. We want EC.</div>
<div class="step">Because DE ∥ BC, the theorem applies: AD/DB = AE/EC.</div>
<div class="step">Put in the numbers: 3/2 = 4.5/EC.</div>
<div class="step">Cross multiply: 3 × EC = 2 × 4.5 = 9.</div>
<div class="step">Divide by 3: EC = 3 cm. Check: AE/EC = 4.5/3 = 1.5 and AD/DB = 3/2 = 1.5.</div>
</div>

<div class="problem" data-problem="c10m-tri-bpt"></div>

Sometimes you are asked for a whole side. Find the missing piece first, then add, or use the equivalent form `$\dfrac{AD}{AB} = \dfrac{AE}{AC}$`.

<div class="problem" data-problem="c10m-tri-sides-bpt"></div>

And with algebra: if the sides are given in terms of `$x$`, set up AD/DB = AE/EC, cross multiply, and the `$x^2$` terms usually cancel.

<div class="problem" data-problem="c10m-tri-parallel"></div>

## 4. Criteria for similarity of triangles

How little do you need to know to say two triangles are similar? Just one of these.

### AA (angle-angle)

If two angles of one triangle equal two angles of another, the third angles are equal too, because the angles of a triangle add up to 180°. So the shapes match: the triangles are similar. (This is why this test is also called AAA.) Set the angles below. The second triangle can be any size, and all three side ratios come out equal.

<figure class="fig" data-fig="c10-tri-aa"><figcaption>Fix two angles and the whole shape is fixed. The second triangle is just an enlargement, so every pair of corresponding sides is in the same ratio k.</figcaption></figure>

### SSS (side-side-side)

If the three sides of one triangle are proportional to the three sides of another, the triangles are similar. The first triangle here has sides 3, 4, 5. The second has 3k, 4k and 5k. Now spoil the longest side a little: the angles change, and the triangle is no longer similar.

<figure class="fig" data-fig="c10-tri-sss"><figcaption>When all three ratios are equal the angles match. Change just one side and the ratios disagree, and so do the angles. Notice you must compare all three pairs.</figcaption></figure>

### SAS (side-angle-side)

If one angle of a triangle equals one angle of another, and the sides **around** those angles are in the same ratio, the triangles are similar. The angle must be the one *between* the two sides. Make the two stretch factors different and the shape changes.

<figure class="fig" data-fig="c10-tri-sas"><figcaption>Both triangles have a 50° angle at A. When AB and AC are stretched by the same factor (m = n) it is just an enlargement. If m and n differ, the other two angles change.</figcaption></figure>

<div class="myth">

**“Two sides proportional and one angle equal is enough.”** The angle has to be the *included* angle, between those two sides. An equal angle somewhere else can give two different triangles, and they need not be similar.

</div>

<div class="problem" data-problem="c10m-tri-side"></div>

<div class="problem" data-problem="c10m-tri-sss"></div>

Try the three tests, and the parallel-line theorem, on triangles of your own with the explorer:

<!--fig:tool similar-triangles-->

To build exact copies and parallels yourself with ruler and compass moves, with live lengths and angles, use the construction tool:

<!--fig:tool geometry-construction-->

## 5. Using similar triangles: shadows and heights

How do you find the height of a coconut tree without climbing it? Thales, the Greek thinker, is said to have measured the height of a pyramid by waiting for the time when his own shadow equalled his height. Do it for any time of day: the sun’s rays are parallel, so a person and a tree both make a right-angled triangle with the ground and its shadow, with the **same sun angle**. By AA the triangles are similar, so

```math
\frac{\text{tree height}}{\text{person height}} = \frac{\text{tree shadow}}{\text{person shadow}}
```

Slide the sun or press Play. The shadows grow and shrink together, but the ratio never changes.

<figure class="fig" data-fig="c10-tri-shadow"><figcaption>Tree 8 m, person 1.6 m. In the early morning both shadows are long, at noon both are short, but tree shadow ÷ person shadow is always 5, the same as tree height ÷ person height.</figcaption></figure>

<div class="problem" data-problem="c10m-tri-shadow"></div>

The same idea finds the width of a river, the height of a mobile tower, or the distance across a pond: build a small similar triangle you can measure, and scale it up.

<div class="history">

<ul class="timeline">
<li><b>about 600 BCE</b> Thales of Miletus is said to measure the height of an Egyptian pyramid by its shadow, using similar triangles.</li>
<li><b>about 300 BCE</b> Euclid’s Elements, Book VI, gives the theorem on parallel lines cutting sides in proportion, and the criteria for similar triangles.</li>
<li><b>5th to 12th century CE</b> Indian mathematicians Aryabhata, Brahmagupta and Bhaskara II use similar triangles for shadow and height problems, in the gnomon (shadow stick) problems of their books.</li>
</ul>

</div>

<div class="keypoints">

- Similar figures have equal corresponding angles and corresponding sides in the same ratio (scale factor `$k$`). For triangles, one of the two conditions is enough.
- Basic proportionality theorem: `$DE \parallel BC \Rightarrow \dfrac{AD}{DB} = \dfrac{AE}{EC}$`. Converse: equal ratios mean DE is parallel to BC.
- The proof compares areas: triangles with the same height have areas in the ratio of their bases; triangles on the same base between the same parallels have equal area.
- AA: two equal angles (so all three) mean similar triangles.
- SSS: all three side ratios equal means similar. SAS: one equal angle with the **included** sides in proportion means similar.
- Write similarity in order: ABC ∼ PQR means A↔P, B↔Q, C↔R. Use that order to pair the sides.
- Shadows: at the same moment, height ÷ shadow is the same for every upright object.

</div>

Ready for exam-style questions? Go to [Triangles: practice questions](/learn/courses/ncert-class-10-maths/triangles-practice/).
