---
title: Some Applications of Trigonometry
seoTitle: 'Heights and Distances Class 10 notes and examples'
summary: 'Class 10 heights and distances with animations: angles of elevation and depression, shadows, ladders, kites and two-angle tower problems solved step by step.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'From a point 20 m from the foot of a tower the angle of elevation of its top is 45°. Ignoring eye height, the tower is:'
    choices: ['20 m high', '10 m high', '20√3 m high', '40 m high']
    ans: 0
    why: 'tan 45° = height / 20 = 1, so the height is 20 m.'
  - q: 'From the top of a cliff the angle of depression of a boat is 30°. The angle of elevation of the cliff top from the boat is:'
    choices: ['30°', '60°', '45°', '90°']
    ans: 0
    why: 'The horizontal from the cliff top is parallel to the sea, so the angle of depression and the angle of elevation are alternate angles and are equal.'
  - q: 'A 12 m ladder leans against a wall at 60° to the ground. How high up the wall does it reach?'
    choices: ['6√3 m', '6 m', '12√3 m', '12 m']
    ans: 0
    why: 'Height = 12 sin 60° = 12 × √3/2 = 6√3 m, about 10.4 m.'
sources:
  - 'NCERT Class 10 Maths, Chapter 9 “Some Applications of Trigonometry” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Keay, J., The Great Arc: The Dramatic Tale of How India Was Mapped and Everest Was Named (2000), on the Great Trigonometrical Survey of India and its use of theodolites and angles'
  - 'Heath, T. L., A History of Greek Mathematics, volume 1 (1921), on Thales and the height of a pyramid from its shadow'
---

**Maths · Class 10 · Chapter 9 · about 45 minutes.** By the end you will be able to find the height of a tower, a tree or a hill, or the distance of a ship, using only an angle you can measure and a distance you can pace out.

<div class="bigidea">You cannot climb a tower with a tape measure, but you can stand on the ground, measure how far away you are and what angle you look up at. In the right triangle that appears, one side and one angle are enough to find every other side: that is trigonometry doing real work.</div>

## 1. Line of sight, elevation and depression

The **line of sight** is the straight line from your eye to the object you are looking at. Two angles are measured from the **horizontal**, the flat line level with your eye:

- **Angle of elevation:** the angle you tilt your head **up** from the horizontal to see something above you (a bird, a tower top, the Moon).
- **Angle of depression:** the angle you tilt your head **down** from the horizontal to see something below you (a boat from a lighthouse, a car from a bridge).

Both angles are measured from the horizontal, never from the vertical. Move the sliders: the closer you stand, the larger the angle of elevation. A taller tower also gives a larger angle.

<figure class="fig" data-fig="c10-hd-elev"><figcaption>Your eye is 1.5 m above the ground. The dashed line is the horizontal; the blue line is the line of sight to the top. The angle between them is the angle of elevation, found from tan θ = (tower − eye height) ÷ distance.</figcaption></figure>

Now look down from a lighthouse. The horizontal line from the lighthouse top is parallel to the sea. A line crossing two parallel lines makes equal alternate angles, so **the angle of depression of the boat equals the angle of elevation of the lighthouse top, seen from the boat**. Turn on “Show the boat’s view” to see the equal angle appear.

<figure class="fig" data-fig="c10-hd-depr"><figcaption>The angle of depression at the lighthouse top and the angle of elevation at the boat are equal. Slide the boat farther away and both shrink. This equal-angle fact lets you always draw the right triangle at the ground, where it is easiest.</figcaption></figure>

<div class="myth">

**“The angle of depression is measured from the vertical wall.”** It is measured from the **horizontal** line through the eye, downwards. The same goes for elevation. If you measure from the vertical you will use 90° minus the correct angle and swap sin and cos.

</div>

## 2. The method: draw, find the triangle, pick the ratio

Every problem in this chapter is solved the same way. The only skill is to turn the story into a right triangle.

<div class="steps" data-fig="c10-hd-method">
<div class="step">Problem: a boy whose eyes are 1.5 m above the ground stands 20 m from a tower. The angle of elevation of the top is 60°. How tall is the tower?</div>
<div class="step">Draw: the ground, the tower, the horizontal at eye level, and the line of sight. Put 60° at the eye.</div>
<div class="step">Find the right triangle. Its horizontal side is 20 m and its vertical side is x, the part of the tower above the eye level.</div>
<div class="step">Choose the ratio. The sides you know and want are adjacent and opposite to 60°, so use tan: tan 60° = x / 20.</div>
<div class="step">Solve: x = 20 tan 60° = 20√3 ≈ 34.64 m.</div>
<div class="step">Add the height of the eye: tower = 34.64 + 1.5 ≈ 36.14 m.</div>
</div>

The ratio you need depends on which two sides are involved. If you are unsure, remember SOH-CAH-TOA from the last chapter: **opposite and adjacent** use tan, **opposite and hypotenuse** use sin, **adjacent and hypotenuse** use cos. Practise choosing the ratio below, with no calculation needed.

<figure class="fig" data-fig="c10-hd-pick"><figcaption>Each story gives one side (blue) and asks for another (orange). Pick the ratio, then press “Next story”. After a few you will do it without thinking.</figcaption></figure>

<div class="problem" data-problem="c10m-hd-tower"></div>

<div class="myth">

**“Forget the observer’s height; it is only a small number.”** When a problem says the eyes (or the hand holding a kite string) are 1.5 m above the ground, add that to the height you find with trigonometry. Leaving it out gives an answer 1.5 m too short.

</div>

The 2023 syllabus keeps the angles to the special values **30°, 45° and 60°**, so the answers use √3 and √2 exactly. In real life you may measure any angle and use a calculator.

## 3. Everyday situations

### 3.1 Shadows and the sun

When the sun’s rays make an angle θ with the ground, a pole of height H casts a shadow of length H ÷ tan θ. Morning and evening the sun is low, θ is small and shadows are long. At noon in summer, θ is large and shadows are short. At 45° the shadow is exactly as long as the pole, which is how people used to tell the time and measure tall things before calculators.

<figure class="fig" data-fig="c10-hd-shadow"><figcaption>Press Play to run the sun across the sky. The pole is always 6 m. Watch the shadow grow when the sun is low and shrink when it is high. At 45° the shadow equals the pole.</figcaption></figure>

<div class="problem" data-problem="c10m-hd-shadow"></div>

### 3.2 Ladders against a wall

A ladder is the hypotenuse. Its height on the wall is **L sin θ** and its foot is **L cos θ** from the wall, where θ is the angle with the ground. A safe rule of thumb for putting up a ladder is about 75° (one metre out for every four up): too flat and the foot slips; too steep and it tips backwards.

<figure class="fig" data-fig="c10-hd-ladder"><figcaption>Change the angle and the length. The green band shows the safe range of angles. A longer ladder reaches higher at the same angle, and a steeper ladder reaches higher but its foot is closer to the wall.</figcaption></figure>

<div class="problem" data-problem="c10m-hd-ladder"></div>

### 3.3 A kite on a string

When the string is pulled straight, it is the hypotenuse of a right triangle, and the kite’s height is the opposite side: **string × sin θ**. As the kite swings in the wind, its angle changes and its height follows the sine.

<figure class="fig" data-fig="c10-hd-kite"><figcaption>Press Play and the kite swings. For a fixed string the height is biggest when the string is steep. At 30° the kite is at half the string length (sin 30° = 1/2); at 90° it would be directly overhead, at the full length.</figcaption></figure>

<div class="problem" data-problem="c10m-hd-kite"></div>

### 3.4 Looking down: lighthouse and boats

For a boat seen from a lighthouse H metres high at angle of depression θ, the boat’s distance is H ÷ tan θ. Use the equal alternate angle so the triangle sits on the sea.

<div class="problem" data-problem="c10m-hd-depression"></div>

## 4. Two angles, two triangles

Sometimes you cannot measure the distance to the foot of the tower (it may be on the other side of a river, or in a courtyard). Then you measure the angle of elevation from **two** points in a line with the tower, and the distance between the two points. This gives two right triangles that share the height h. Call the nearer distance x. Then the two angles give two equations in h and x, and you solve them together.

<figure class="fig" data-fig="c10-hd-walk"><figcaption>Choose the two angles and how far you walked. The tower height comes out of h = d ÷ (cot first − cot second). Notice that a bigger angle means the point is nearer: the 60° sighting is closer than the 30° one.</figcaption></figure>

Here is the full method, with the algebra shown one line at a time.

<div class="steps" data-fig="c10-hd-twoangle">
<div class="step">A tower. From B the angle of elevation of its top is 45°. From A, 40 m farther back in the same line, it is 30°. Find the height.</div>
<div class="step">Call the tower h and the distance from B to the foot x. Then A is x + 40 from the foot. Two right triangles share the height h.</div>
<div class="step">Triangle at B: tan 45° = h/x. Since tan 45° = 1, x = h.</div>
<div class="step">Triangle at A: tan 30° = h/(x + 40), and tan 30° = 1/√3. So √3 h = x + 40.</div>
<div class="step">Put x = h: √3 h = h + 40, so (√3 − 1) h = 40.</div>
<div class="step">h = 40/(√3 − 1). Multiply top and bottom by (√3 + 1): h = 40(√3 + 1)/2 = 20(√3 + 1) ≈ 54.6 m.</div>
<div class="step">Check: x = 54.6 and x + 40 = 94.6. The ratio 54.6/94.6 ≈ 0.577 is tan 30° exactly. ✓</div>
</div>

<div class="problem" data-problem="c10m-hd-walk"></div>

<div class="myth">

**“Add the two angles together or take their average.”** Angles of elevation from two different points belong to two different triangles. Never add or average them. Write one equation for each triangle and solve for h.

</div>

### 4.1 A building and a tower

A common variation: from the top of a building you look down at the base of a tower (angle of depression) and up at its top (angle of elevation). The depression triangle gives the distance between the two; the elevation triangle gives the part of the tower above the building.

<figure class="fig" data-fig="c10-hd-both"><figcaption>The observer is on the building top. Orange: angle of depression to the tower’s foot. Blue: angle of elevation to its top. Tower = building height + (distance × tan of the elevation angle).</figcaption></figure>

<div class="problem" data-problem="c10m-hd-both"></div>

## 5. Measuring the angle yourself

Surveyors use an instrument called a **theodolite**. In the 1800s the Great Trigonometrical Survey of India measured the heights of Himalayan peaks from the plains, hundreds of kilometres away, using angles of elevation and exactly this chapter’s methods. You can make a simple **clinometer** at home from a drinking straw, a protractor, a string and a small weight (a nut works). Sight the top of the object through the straw and read where the string crosses the protractor.

<figure class="fig" data-fig="c10-hd-clino"><figcaption>As you tilt the straw up by θ, the plumb string stays vertical, so the angle between the string and the protractor’s 90° mark is also θ. Measure how far you stand from the object, then height = distance × tan θ + the height of your eyes.</figcaption></figure>

Try the heights and distances tool, which draws the scene and lets you change the angle and the distance:

<!--fig:tool heights-distances-->

Your phone can do the same job: the [Phone clinometer](/science/phone-clinometer/) uses its tilt sensor to read the angle of elevation, and you can then work out the height of a tree or a building. Check your answer against a measured one.

<div class="history">

- **c. 600 BC:** Thales of Miletus is said to have found the height of a pyramid by waiting until his shadow equalled his height.
- **499 CE:** Aryabhata’s sine table lets Indian astronomers compute heights and distances.
- **1802 onwards:** the Great Trigonometrical Survey of India begins, measuring the country with a chain of triangles, a method that later found the height of the Himalayas.
- **Today:** a phone’s tilt sensor and GPS combine the same trigonometry to give the height of a building.

</div>

<div class="keypoints">

- Angles of elevation and depression are measured from the horizontal line through the eye.
- The angle of depression of an object equals the angle of elevation of the observer, seen from that object (alternate angles).
- Draw the picture, find the right triangle, choose sin, cos or tan from the two sides involved, then solve. Add the observer’s eye height if it is given.
- A shadow of length s and an object of height H satisfy tan θ = H / s, where θ is the sun’s altitude.
- For a ladder or a kite string of length L at angle θ: height = L sin θ and ground distance = L cos θ.
- With two angles from two points, write one equation per triangle (both involve the same height) and solve them together.

</div>
