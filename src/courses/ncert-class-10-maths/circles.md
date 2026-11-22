---
title: Circles
seoTitle: 'Circles Class 10 notes: tangents explained'
summary: 'Class 10 Circles with animations: secant and tangent, tangent perpendicular to the radius, equal tangents from a point, with proofs and practice.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'A point P is 13 cm from the centre of a circle of radius 5 cm. The length of the tangent from P is:'
    choices: ['12 cm', '8 cm', '18 cm', '√194 cm']
    ans: 0
    why: 'The tangent is perpendicular to the radius at its touching point, so PT² = OP² − r² = 169 − 25 = 144 and PT = 12 cm.'
  - q: 'Two tangents PA and PB are drawn from P to a circle with centre O. If ∠APB = 50°, then ∠AOB is:'
    choices: ['130°', '50°', '90°', '100°']
    ans: 0
    why: 'The angles at A and B are 90° each (tangent ⟂ radius), and the four angles of quadrilateral OAPB add up to 360°. So ∠AOB = 360° − 90° − 90° − 50° = 130°.'
  - q: 'How many tangents can be drawn to a circle from a point lying inside it?'
    choices: ['None', 'One', 'Two', 'Infinitely many']
    ans: 0
    why: 'Every line through a point inside a circle cuts the circle at two points, so none of them touches it at just one point.'
sources:
  - 'NCERT Class 10 Mathematics, Chapter 10 “Circles” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Euclid, Elements, Book III (circles and tangents), in the T. L. Heath translation, Cambridge University Press, 1908. The two theorems here are classical results with standard proofs, rewritten for fibub.'
---

**Maths · Class 10 · Chapter 10 · about 45 minutes.** By the end you will be able to tell a secant from a tangent, say how many tangents a point has, prove that a tangent is perpendicular to the radius and that the two tangents from a point are equal, and use both facts to find lengths and angles.

<div class="bigidea">A tangent is a line that just kisses a circle at one point. The radius to that point stands at exactly 90° to the tangent, and from any outside point you can draw two tangents of equal length. Almost every problem in this chapter is one right-angled triangle hiding in a circle.</div>

## 1. A line and a circle: three possible meetings

Take a circle and a straight line. There are only three things that can happen, depending on how far the line is from the centre.

| Distance of the line from the centre | What happens | Name of the line |
|---|---|---|
| less than the radius | the line cuts the circle at **two** points | **secant** |
| equal to the radius | the line touches the circle at **exactly one** point | **tangent** |
| more than the radius | the line and circle have **no** common point | non-intersecting |

Think of a plank of wood being pushed towards a round pot. Far away it misses. Come closer and it slices through the pot (secant). The moment it only just touches the side, that is the tangent. Slide the line below and watch the number of common points change.

<figure class="fig" data-fig="c10-circ-secant"><figcaption>A line moving towards a circle. When its distance d from the centre is less than r it is a secant (2 points); at exactly r it is a tangent (1 point); beyond r it misses the circle. Press Play, or drag the slider to stop at the tangent.</figcaption></figure>

The point where a tangent touches the circle is the **point of contact**. The word *tangent* comes from Latin *tangere*, "to touch". A *secant* comes from *secare*, "to cut".

**A tangent is the limit of secants.** Fix a point A on the circle and turn a secant about A. The second point B moves nearer to A. When B reaches A, the secant touches the circle at one point only: it has become the tangent at A.

<figure class="fig" data-fig="c10-circ-limit"><figcaption>A secant through A meets the circle again at B. As the angle α shrinks, the chord AB = 2r sin α shrinks to zero and B runs into A. The secant has become the tangent at A.</figcaption></figure>

**Where do you see tangents?** A road touching a wheel, a cricket ball resting on the pitch, a rope just touching a pulley, a coin standing on its edge on a table. A stone whirled on a string is a good one: let go, and see where it flies.

<figure class="fig" data-fig="c10-circ-stone"><figcaption>Whirl the stone, then press "Let go of the string". The stone leaves along the tangent at that point, at 90° to the string (the radius). A bicycle wheel throws mud sparks off in just the same way.</figcaption></figure>

<div class="myth">

**“A tangent is a line that stays outside the circle, or a line through the centre.”** A tangent never passes through the centre (a line through the centre cuts the circle twice, at both ends of a diameter). It touches the circle at one point, and every other point of the tangent lies *outside* the circle.

</div>

## 2. How many tangents from a point?

Where you stand, with respect to the circle, decides how many tangents you can draw from your position.

- **Point inside the circle:** every line through it cuts the circle twice. **No tangent.**
- **Point on the circle:** there is **one** tangent, touching at that very point.
- **Point outside the circle:** there are exactly **two** tangents, one on each side of the line to the centre.

Drag the point P below, from deep inside the circle to far outside, and watch the tangents appear and disappear.

<figure class="fig" data-fig="c10-circ-count"><figcaption>Drag P (or use the slider). Inside the circle: 0 tangents. On the circle: 1. Outside: 2, each of length √(OP² − r²).</figcaption></figure>

The tangents from an outside point P touch the circle at two points of contact, A and B. The segments PA and PB are the **lengths of the tangents** from P. The same tool below lets you drag a point outside a circle and see its two tangents. Try it now, then come back to find out why they are equal.

<!--fig:tool circle-sector-->

## 3. The tangent is perpendicular to the radius

**Theorem 1.** The tangent at any point of a circle is perpendicular to the radius through the point of contact.

Slide the point P round the circle. The tangent turns, but the right angle between it and the radius never changes. Then slide Q along the tangent: it is always farther from the centre O than P is.

<figure class="fig" data-fig="c10-circ-radius"><figcaption>Drag P round the circle. The tangent at P always makes 90° with the radius OP. The point Q on the tangent has OQ² = r² + PQ², so OQ is bigger than r and Q lies outside the circle.</figcaption></figure>

**Why is it true?** The proof is a nice piece of reasoning:

<div class="steps" data-fig="c10-circ-radproof">
<div class="step">A circle with centre O and a tangent touching it at P. We want to prove that OP is perpendicular to the tangent.</div>
<div class="step">Pick any other point Q on the tangent. A tangent meets the circle at only one point, P, so Q is outside the circle. Hence OQ is longer than the radius OP.</div>
<div class="step">This holds for every point Q we pick on the tangent, to the left or to the right of P: each OQ is longer than OP.</div>
<div class="step">So OP is the shortest of all segments from O to the tangent line.</div>
<div class="step">Of all segments from a point to a line, the shortest is the perpendicular. So OP is perpendicular to the tangent. That is Theorem 1.</div>
</div>

<div class="meaning">
<dl>
<dt>O, r</dt><dd>the centre and the radius of the circle.</dd>
<dt>P</dt><dd>the point of contact, where the tangent touches.</dd>
<dt>OP ⟂ tangent</dt><dd>the angle between the radius OP and the tangent at P is exactly 90°.</dd>
<dt>Physical meaning</dt><dd>a ball moving along a circle at any instant moves along the tangent, at right angles to the line to the centre. The string (radius) pulls sideways to its motion, so it bends the path without changing the speed.</dd>
</dl>
</div>

**Using Theorem 1.** It gives you a right angle for free. Whenever a problem mentions a tangent, draw the radius to the point of contact and mark 90°. In the triangle OPQ below, PQ is a tangent at P and ∠POQ is given: the angle at P is 90°, so the third angle follows.

<div class="problem" data-problem="c10m-circ-opq"></div>

**Length of a tangent.** Let a point P be at distance `$d$` from the centre O of a circle of radius `$r$`, and let PT be a tangent. Triangle OTP has a right angle at T (Theorem 1), so by Pythagoras

```math
PT = \sqrt{d^2 - r^2}
```

The hypotenuse is always OP, the line from the point to the centre. Set `$r$` and `$d$` below and see the triangle.

<figure class="fig" data-fig="c10-circ-length"><figcaption>The tangent PT, the radius OT and the line OP make a right triangle with the right angle at T. Make d equal to r and PT shrinks to zero: P is then on the circle.</figcaption></figure>

<div class="problem" data-problem="c10m-circ-tlen"></div>

<div class="problem" data-problem="c10m-circ-dist"></div>

<div class="myth">

**“The tangent length is `$d - r$`.”** That would be the distance from P to the *nearest point* of the circle, not along the tangent. The tangent is the leg of a right triangle, so use `$\sqrt{d^2 - r^2}$`. Check: 13 cm from the centre and radius 5 cm gives 12 cm, not 8 cm.

</div>

**A second use: tangents at the ends of a diameter.** Each tangent is perpendicular to the diameter. Two lines perpendicular to the same line are parallel. So the tangents at the two ends of a diameter are **parallel**.

<figure class="fig" data-fig="c10-circ-parallel"><figcaption>Turn the diameter AB. The tangents at A and B turn with it but stay parallel, always 2r apart.</figcaption></figure>

And a rolling wheel shows Theorem 1 in daily life: the road is a tangent to the wheel, and the spoke to the point where wheel meets road is always vertical.

<figure class="fig" data-fig="c10-circ-wheel"><figcaption>The road touches the rolling wheel at one point. The radius to that point is always perpendicular to the road.</figcaption></figure>

## 4. The two tangents from a point are equal

**Theorem 2.** The lengths of the tangents drawn from an external point to a circle are equal.

Drag P in the picture below and read the two lengths. Then slide *Fold along OP*: the lower half folds over the line OP and B lands exactly on A.

<figure class="fig" data-fig="c10-circ-equal"><figcaption>PA and PB stay equal wherever P is. Fold along OP and the picture matches itself: B lands on A. The angle APB and the angle AOB always add up to 180°.</figcaption></figure>

Now the proof, using only Theorem 1 and congruent triangles:

<div class="steps" data-fig="c10-circ-eqproof">
<div class="step">Two tangents PA and PB are drawn from an outside point P to a circle with centre O. We want to prove PA = PB.</div>
<div class="step">Join OA, OB and OP.</div>
<div class="step">A tangent is perpendicular to the radius at the point of contact, so ∠OAP = 90° and ∠OBP = 90°.</div>
<div class="step">OA = OB because both are radii. OP is a side common to both triangles, and it is the hypotenuse of each.</div>
<div class="step">Right angle, hypotenuse and one side are equal, so triangles OAP and OBP are congruent (the RHS rule).</div>
<div class="step">Corresponding sides of congruent triangles are equal, so PA = PB. Also ∠APO = ∠BPO: OP bisects the angle between the two tangents.</div>
</div>

<div class="meaning">
<dl>
<dt>PA, PB</dt><dd>the lengths of the two tangents from P.</dd>
<dt>PA = PB</dt><dd>the two tangent lengths are equal.</dd>
<dt>∠APB + ∠AOB = 180°</dt><dd>the quadrilateral OAPB has two right angles at A and B, so the other two angles add up to 180°.</dd>
<dt>Physical meaning</dt><dd>the whole picture is symmetric about the line OP, like a kite. A mirror along OP swaps the two tangents.</dd>
</dl>
</div>

**Angles from the kite.** Quadrilateral OAPB has angles 90° at A and 90° at B. Its angles add up to 360°, so the other two add up to 180°. If one is known, the other follows. And since OP bisects both ∠APB and ∠AOB, a given angle at P or O can be halved.

<div class="problem" data-problem="c10m-circ-aob"></div>

## 5. Using the two theorems

Most chapter problems fall into a few patterns. In each one, **draw the radius to every point of contact first**.

**Pattern 1: a circle inside a triangle (incircle).** A circle touching all three sides of triangle ABC has two tangents from each corner. Call the tangent lengths from A, B, C as x, y, z. Because tangents from a point are equal, the sides split like this: AB = x + y, BC = y + z, CA = z + x. Move x, y and z below and see the sides change.

<figure class="fig" data-fig="c10-circ-incircle"><figcaption>The incircle splits each side into two tangent segments. Equal letters mean equal lengths. The perimeter is 2(x + y + z), so x + y + z is the semi-perimeter.</figcaption></figure>

Adding two sides and removing the third gives `$AB + CA - BC = 2x$`, so `$x = \tfrac12(AB + CA - BC)$`.

<div class="problem" data-problem="c10m-circ-incircle"></div>

**Pattern 2: a quadrilateral round a circle.** If ABCD touches a circle on all four sides, the tangent lengths from A, B, C, D (call them p, q, r, s) give AB = p + q, BC = q + r, CD = r + s, DA = s + p. Add the opposite pairs:

```math
AB + CD = BC + DA
```

The sums of opposite sides are equal. This is a quick way to find a missing side.

<div class="problem" data-problem="c10m-circ-quad"></div>

**Pattern 3: concentric circles and a chord.** In two circles with the same centre, a chord of the big circle that touches the small one is perpendicular to the radius at the touching point M. A perpendicular from the centre to a chord bisects it, so M is the midpoint, and half the chord is `$\sqrt{R^2 - r^2}$`.

<figure class="fig" data-fig="c10-circ-concentric"><figcaption>The chord of the larger circle (R = 5) touches the smaller circle at M, its midpoint. Slide r: the chord is 2√(25 − r²). When r = 3 the chord is 8.</figcaption></figure>

<div class="problem" data-problem="c10m-circ-chord"></div>

**A worked example (circumscribed triangle).** A circle with centre O touches the sides AB and AC of a triangle at P and Q, and the tangents from A make ∠PAQ = 60°. Find ∠POQ and the shape of triangle APQ.

- AP = AQ (equal tangents), so triangle APQ is isosceles with the angle 60° at A. The other two angles are (180° − 60°) ÷ 2 = 60° each. So triangle APQ is **equilateral**.
- ∠POQ = 180° − 60° = **120°**, since the angles at P and Q are 90°.

**Exam checklist for any tangent question.**

1. Mark the centre. Join it to every point of contact.
2. Mark every 90° at those points.
3. Mark equal tangent lengths from each outside point.
4. Look for a right triangle (Pythagoras), a kite or an isosceles triangle.
5. Check your answer is sensible: tangent lengths are positive and shorter than the line to the centre.

You can build and drag these figures yourself in the [Interactive geometry construction](/science/geometry-construction/) tool: draw a circle, a point outside it and its tangents, and watch the measured lengths stay equal. The related chapter [Areas Related to Circles](/learn/courses/ncert-class-10-maths/areas-related-to-circles/) uses the same circle language, and [Circle sectors](/learn/circle-sector/) has more to explore.

<div class="history">

<ul class="timeline">
<li><b>about 300 BCE</b> Euclid devotes Book III of the Elements to circles. It defines a tangent and shows that it is perpendicular to the radius; the equal-tangent result follows from it by congruent triangles.</li>
<li><b>about 200 BCE</b> Apollonius of Perga studies tangents to the conic sections, extending the circle ideas to ellipses, parabolas and hyperbolas.</li>
<li><b>1600s</b> Fermat, Newton and Leibniz turn the problem of finding a tangent to a curve into calculus: the slope of the tangent is the derivative.</li>
</ul>

</div>

<div class="keypoints">

- A line meets a circle in 2 points (secant), 1 point (tangent) or none, depending on whether its distance from the centre is less than, equal to or more than the radius.
- A tangent is the limiting position of a secant when its two points of intersection come together.
- From a point inside a circle: 0 tangents. On the circle: 1. Outside: exactly 2.
- **Theorem 1:** the tangent at a point is perpendicular to the radius through that point.
- Tangent length from a point at distance `$d$` from the centre: `$PT = \sqrt{d^2 - r^2}$`.
- **Theorem 2:** the two tangents from an outside point are equal, and OP bisects the angle between them.
- In OAPB, `$\angle APB + \angle AOB = 180^\circ$`. Tangents at the ends of a diameter are parallel.
- A quadrilateral round a circle has `$AB + CD = BC + DA$`. In an incircle, `$x = \tfrac12(AB + CA - BC)$`.
- For a chord of the outer circle touching the inner: chord `$= 2\sqrt{R^2 - r^2}$`.

</div>

Ready for exam-style questions? Go to [Circles: practice questions](/learn/courses/ncert-class-10-maths/circles-practice/).
