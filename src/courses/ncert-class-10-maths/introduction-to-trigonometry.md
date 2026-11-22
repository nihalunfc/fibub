---
title: Introduction to Trigonometry
seoTitle: 'Trigonometry Class 10 notes: ratios, identities'
summary: 'Class 10 Introduction to Trigonometry with animations: sin, cos, tan from a right triangle, values of 0, 30, 45, 60, 90 degrees, and the three identities.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'In a right triangle ABC, right-angled at B, AB = 12 and BC = 5. What is sin A?'
    choices: ['5/13', '12/13', '5/12', '13/5']
    ans: 0
    why: 'AC = √(144 + 25) = 13. The side opposite A is BC = 5, so sin A = 5/13.'
  - q: 'The value of sin 30° + cos 60° is:'
    choices: ['1', '1/2', '√3', '0']
    ans: 0
    why: 'sin 30° = 1/2 and cos 60° = 1/2, so the sum is 1.'
  - q: 'Which expression is equal to 1 + tan²θ?'
    choices: ['sec²θ', 'cosec²θ', 'cot²θ', 'sin²θ']
    ans: 0
    why: 'Divide sin²θ + cos²θ = 1 by cos²θ: tan²θ + 1 = 1/cos²θ = sec²θ.'
sources:
  - 'NCERT Class 10 Maths, Chapter 8 “Introduction to Trigonometry” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Aryabhata, Aryabhatiya (499 CE), the sine table (jya) in the Ganitapada; and Varahamihira, Pancha-siddhantika (c. 575 CE), for the early sine tables of Indian astronomy'
  - 'Katz, V. J., A History of Mathematics: An Introduction, 3rd edition (2009), the chapter on trigonometry, for the origin of the word “sine”'
---

**Maths · Class 10 · Chapter 8 · about 50 minutes.** By the end you will be able to name the sides of a right triangle, find sin, cos, tan and their reciprocals of an angle, know the values for 0°, 30°, 45°, 60° and 90°, and use the three identities to simplify and prove expressions.

<div class="bigidea">In a right triangle the ratio of two sides is fixed by the angle alone, however big the triangle is. Trigonometry gives those ratios names: sin, cos and tan. Once you know the ratio, you can find a length without measuring it.</div>

## 1. Why ratios? Right triangles of every size

“Trigonometry” comes from the Greek for “triangle measure”, but the idea is much older and Indian astronomers like Aryabhata (around 499 CE) built the first tables of the half-chord, which they called *jya*. That word travelled to Arabic and then to Latin as **sinus**, and became our “sine”.

Think of a ramp. A gentle ramp and a steep ramp have different slopes, but a small steep ramp and a big steep ramp have the same slope: the same shape, only a different size. In a right triangle the angle is the “steepness”, and the ratio of two sides measures it. Change the size and the sides all stretch by the same factor, so every ratio of sides stays exactly the same.

<figure class="fig" data-fig="c10-trig-triangle"><figcaption>Move the angle slider and the three ratios change. Move the size slider (the hypotenuse) and the sides change but sin, cos and tan do not move at all. That is the whole reason trigonometry works: the ratio belongs to the <b>angle</b>, not to the triangle.</figcaption></figure>

## 2. Naming the sides, and the three main ratios

A **right triangle** has one 90° angle. Its longest side, across from the right angle, is the **hypotenuse**. Pick one of the other two angles, call it θ (theta). The side directly across from θ is the **opposite** side. The remaining side, which touches θ, is the **adjacent** side.

Careful: “opposite” and “adjacent” depend on which angle you are looking at. Stand at the other angle and they swap.

<figure class="fig" data-fig="c10-trig-sides"><figcaption>The same 3-4-5 triangle, seen from two angles. The hypotenuse (green) never changes. The orange and blue sides swap their roles when you change from angle A to angle B.</figcaption></figure>

<div class="myth">

**“Opposite is always the vertical side.”** Opposite means across from the angle you are using, whichever way the triangle is turned. Tilt the triangle or choose the other angle and the opposite side is a different side.

</div>

Now the three main ratios of the angle θ:

```math
\sin\theta = \frac{\text{opposite}}{\text{hypotenuse}},\qquad \cos\theta = \frac{\text{adjacent}}{\text{hypotenuse}},\qquad \tan\theta = \frac{\text{opposite}}{\text{adjacent}}
```

A way to remember them is **SOH-CAH-TOA**: **S**ine = **O**pposite over **H**ypotenuse, **C**osine = **A**djacent over **H**ypotenuse, **T**angent = **O**pposite over **A**djacent.

<div class="meaning">
<dl>
<dt>sin θ</dt><dd>how tall the triangle is compared with its slanted side</dd>
<dt>cos θ</dt><dd>how wide the triangle is compared with its slanted side</dd>
<dt>tan θ</dt><dd>how tall it is compared with how wide it is, in other words the steepness (slope)</dd>
<dt>Physical meaning</dt><dd>sin and cos are always between 0 and 1, because the hypotenuse is the longest side. tan has no limit: a very steep ramp has a huge tan. Cricket pitches, ramps and roofs are all described by one of these.</dd>
</dl>
</div>

The three flipped versions are the **reciprocals**: cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ. Be careful with the names: sec goes with cos and cosec with sin.

<div class="steps" data-fig="c10-trig-define">
<div class="step">A right triangle ABC with the right angle at C. We will study angle A.</div>
<div class="step">The hypotenuse is the longest side, across from the right angle: AB = 5.</div>
<div class="step">The side opposite A is BC = 3.</div>
<div class="step">The side adjacent to A (touching it) is AC = 4.</div>
<div class="step">sin A = 3/5 (opposite over hypotenuse) and cos A = 4/5 (adjacent over hypotenuse).</div>
<div class="step">tan A = 3/4. Notice that it also equals sin A divided by cos A.</div>
<div class="step">The flipped ones: cosec A = 5/3, sec A = 5/4, cot A = 4/3. Six ratios from one triangle.</div>
</div>

<div class="problem" data-problem="c10m-trig-ratio"></div>

### 2.1 Finding all the ratios from one

Often a question gives you one ratio and asks for the others. The method never changes: draw a right triangle with the given ratio as its sides, find the third side with Pythagoras, then read every ratio off the triangle. Try it below: choose the opposite and adjacent sides and see the hypotenuse and all six ratios.

<figure class="fig" data-fig="c10-trig-six"><figcaption>Pick the opposite and adjacent sides; the hypotenuse is √(opp² + adj²). Choose 3 and 4 and you get the 3-4-5 triangle. Try 5 and 12, then 8 and 15, which also give whole-number hypotenuses (Pythagorean triples).</figcaption></figure>

<div class="problem" data-problem="c10m-trig-given"></div>

<div class="myth">

**“sin 2θ means 2 × sin θ”, or “sin means sin × θ”.** sin θ is a single number belonging to the angle; it is not “sin times θ”. And sin A + sin B is not sin (A + B). Never cancel or take out “sin” like a common factor.

</div>

## 3. The unit circle: seeing the ratios as lengths

Draw a circle of radius 1 centred at the origin, and a point P on it at angle θ. Drop a perpendicular from P to the x-axis. The right triangle you get has hypotenuse 1, so its sides are simply **cos θ** (across) and **sin θ** (up). The tangent is the length cut off on the vertical line touching the circle at (1, 0). Watch all three as θ sweeps from 0° to 90°.

<figure class="fig" data-fig="c10-trig-unit"><figcaption>Press Play. The blue height is sin θ, the orange width is cos θ and the green length on the vertical line at x = 1 is tan θ. At 0° sin is 0 and cos is 1. At 90° sin is 1, cos is 0 and the green line runs off the page: tan has no value.</figcaption></figure>

Play with the full trig ratio explorer and the unit circle tool as well:

<!--fig:tool trig-ratios-->

<!--fig:tool unit-circle-->

## 4. The special angles: 0°, 30°, 45°, 60° and 90°

For a few angles the sides are simple enough that you can work out the ratios exactly, with no calculator. These come up in almost every exam question.

### 4.1 45°, from a square

Take a square of side 1 and draw its diagonal. The diagonal splits a 90° corner into two 45° angles, and by Pythagoras its length is √2.

<div class="steps" data-fig="c10-trig-s45">
<div class="step">A square of side 1. We want a right triangle with a 45° angle.</div>
<div class="step">Draw a diagonal. It cuts the square into two equal triangles and splits the 90° corner into 45° and 45°.</div>
<div class="step">Pythagoras: diagonal² = 1² + 1² = 2, so the diagonal is √2.</div>
<div class="step">One triangle: angle 45°, opposite 1, adjacent 1, hypotenuse √2.</div>
<div class="step">sin 45° = 1/√2 and cos 45° = 1/√2.</div>
<div class="step">tan 45° = 1/1 = 1, because the two legs are equal.</div>
</div>

### 4.2 30° and 60°, from an equilateral triangle

Take an equilateral triangle of side 2 (all angles 60°). Drop the altitude from the top. It cuts the base into 1 and 1, the top angle into 30° and 30°, and by Pythagoras its length is √(4 − 1) = √3. Now one half has sides 1, √3, 2 and angles 30°, 60°, 90°.

<div class="steps" data-fig="c10-trig-s3060">
<div class="step">An equilateral triangle: every side 2, every angle 60°.</div>
<div class="step">Draw the altitude from the top. It cuts the base into two pieces of 1 and the top angle into 30° and 30°.</div>
<div class="step">Pythagoras: height² = 2² − 1² = 3, so the height is √3.</div>
<div class="step">The half triangle has sides 1, √3, 2 and angles 30°, 60°, 90°.</div>
<div class="step">At 30°: opposite 1, adjacent √3, hypotenuse 2. So sin 30° = 1/2, cos 30° = √3/2, tan 30° = 1/√3.</div>
<div class="step">At 60° the roles swap: opposite √3, adjacent 1. So sin 60° = √3/2, cos 60° = 1/2, tan 60° = √3.</div>
</div>

### 4.3 0° and 90°, the edges

As θ shrinks towards 0°, the opposite side shrinks to nothing and the adjacent side becomes as long as the hypotenuse: sin 0° = 0, cos 0° = 1, tan 0° = 0. As θ grows towards 90° the adjacent side shrinks to nothing: sin 90° = 1, cos 90° = 0, and tan 90° = 1/0, which is **not defined**.

Pick an angle below to see its triangle and the whole table of values.

<figure class="fig" data-fig="c10-trig-special"><figcaption>The table of special values. Memory trick: for sin, write √0, √1, √2, √3, √4 each over 2 (that is 0, 1/2, 1/√2, √3/2, 1). Cos is the same list backwards. Tan is sin divided by cos.</figcaption></figure>

<div class="myth">

**“tan 90° = ∞, so we can use it.”** Dividing by zero is not allowed, so tan 90° is simply not defined. Questions that would need it are written to avoid it.

</div>

<div class="problem" data-problem="c10m-trig-special"></div>

<div class="problem" data-problem="c10m-trig-angle"></div>

<div class="problem" data-problem="c10m-trig-side"></div>

Here is the big picture: how the three ratios grow and shrink between 0° and 90°.

<figure class="fig" data-fig="c10-trig-curves"><figcaption>sin rises from 0 to 1, cos falls from 1 to 0, and they meet at 45° where both are 1/√2 (about 0.707). tan climbs from 0, passes 1 at 45° and shoots up towards 90°. Notice sin and cos never go above 1.</figcaption></figure>

**Using the special values.** An equilateral triangle of side 12 cm has height 12 × sin 60° = 6√3 ≈ 10.39 cm. Ladders, towers and kites, where the angle is measured outdoors, come next in [Some Applications of Trigonometry](/learn/courses/ncert-class-10-maths/applications-of-trigonometry/).

<div class="problem" data-problem="c10m-trig-height"></div>

## 5. Trigonometric identities

An **identity** is an equation that is true for every value of the angle (unlike an equation, which is true only for some). Three of them are the heart of this chapter. All come from Pythagoras.

**Identity 1.** In a right triangle with opposite o, adjacent a and hypotenuse h we have o² + a² = h². Divide both sides by h²:

```math
\sin^2\theta + \cos^2\theta = 1
```

<figure class="fig" data-fig="c10-trig-pyth"><figcaption>Take a triangle whose hypotenuse is 1. Its legs are sin θ and cos θ. The squares on the two legs have areas sin²θ and cos²θ, and together they exactly fill the square on the hypotenuse, whose area is 1. Slide θ: one square grows as the other shrinks, but the total stays 1.</figcaption></figure>

**Identities 2 and 3.** Divide Identity 1 by cos²θ, then by sin²θ:

```math
1 + \tan^2\theta = \sec^2\theta \qquad\qquad 1 + \cot^2\theta = \text{cosec}^2\theta
```

<div class="meaning">
<dl>
<dt>sin²θ</dt><dd>means (sin θ)², the square of the number sin θ</dd>
<dt>sec²θ, cosec²θ</dt><dd>(1/cos θ)² and (1/sin θ)²</dd>
<dt>Physical meaning</dt><dd>The identities are Pythagoras’ theorem in disguise, written with ratios instead of lengths. They let you swap one ratio for another: if you know sin θ you can always find cos θ, because the two are linked by sin² + cos² = 1.</dd>
</dl>
</div>

Check all three at any angle. The left side (stacked in two colours) and the right side are always the same length.

<figure class="fig" data-fig="c10-trig-ident"><figcaption>Choose an identity, drag the angle and compare the two bars. Because an identity is true for every angle, the bars always match. (An equation like sin θ = 1/2 would match only at one angle.)</figcaption></figure>

<div class="problem" data-problem="c10m-trig-expr"></div>

### 5.1 Proving an identity

To prove that two sides are equal, work on **one side only** until it turns into the other. Pick the more complicated side. Useful moves: write everything in terms of sin and cos; add fractions over a common denominator; replace 1 − sin² by cos² (and 1 − cos² by sin²); factorise; cancel.

<div class="steps" data-fig="c10-trig-prove">
<div class="step">Prove sinθ/(1 + cosθ) + (1 + cosθ)/sinθ = 2 cosecθ. Start with the left side, since it has more to simplify.</div>
<div class="step">Add the fractions over a common denominator.</div>
<div class="step">Expand (1 + cosθ)² on the top.</div>
<div class="step">Use sin²θ + cos²θ = 1 to turn two terms into 1.</div>
<div class="step">Take 2 out of the top: 2(1 + cosθ).</div>
<div class="step">Cancel the common factor (1 + cosθ). What is left is 2/sinθ = 2 cosecθ, the right side. Done.</div>
</div>

<div class="myth">

**“Move terms across the equals sign to prove it.”** In a proof you do not know the two sides are equal yet, so you may not do the same thing to both sides. Change only one side until it matches the other.

</div>

If you ever want to see the sine used in real life, the [Ferris wheel height](/learn/ferris-wheel/) tool shows how the height of a rider above the ground is a sine wave.

<div class="history">

- **c. 150 BC:** Hipparchus of Nicaea builds a table of chords; trigonometry begins in Greek astronomy.
- **499 CE:** Aryabhata gives a table of half-chords (jya) in the Aryabhatiya, at 3.75° steps.
- **c. 1400:** Madhava of Sangamagrama in Kerala finds series for sine and cosine, centuries before they were rediscovered in Europe.
- **Today:** every phone uses sine and cosine for screens, sound and GPS.

</div>

<div class="keypoints">

- sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent (SOH-CAH-TOA). Their reciprocals are cosec, sec and cot.
- The ratios depend only on the angle, not on the size of the triangle. Opposite and adjacent depend on which angle you stand at.
- tan θ = sin θ / cos θ. sin and cos are never more than 1.
- sin 0°, 30°, 45°, 60°, 90° = 0, 1/2, 1/√2, √3/2, 1. cos is the same list reversed. tan = 0, 1/√3, 1, √3, not defined.
- sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ.
- To prove an identity, change one side until it matches the other.

</div>
