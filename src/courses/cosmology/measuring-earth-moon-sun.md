---
title: Measuring the Earth, Moon and Sun with shadows
seoTitle: How Eratosthenes and Aristarchus measured the sky
summary: 'With sticks, shadows and geometry, Greek scientists measured the size of the Earth and compared the distances to the Moon and Sun. Redo their measurements yourself.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: Why did Eratosthenes need sunlight to arrive in parallel rays?
    choices: ["So the shadows are darker","So the shadow angle at Alexandria equals the angle between the towns at the Earth's centre","So noon happens at the same time everywhere"]
    ans: 1
    why: Because the Sun is very far away, its rays are parallel. Then the shadow angle in one town, relative to a town where the Sun is overhead, is the same as the angle between the towns seen from the Earth's centre.
  - q: If the noon shadow angle were 9° instead of 7.2°, with the same 800 km between towns, how big would the Earth be?
    choices: ["40,000 km around","32,000 km around","50,000 km around"]
    ans: 1
    why: 9° is 1/40 of a circle, so the circumference would be 40 × 800 km = 32,000 km.
  - q: Why did Aristarchus get the Sun's distance wrong by a factor of 20?
    choices: ["He used the wrong Moon","The angle at half moon is so close to 90° that a tiny measuring error makes a huge difference","Shadows were longer in ancient times"]
    ans: 1
    why: The ratio is 1 ÷ cos(angle). Near 90° the cosine changes very fast, so 87° gives 19 and 89.85° gives about 390.
sources:
  - 'Cleomedes, On the Circular Motions of the Celestial Bodies (about 1st century CE), the surviving account of Eratosthenes'' method'
  - 'Aristarchus of Samos, On the Sizes and Distances of the Sun and Moon (3rd century BCE); T. L. Heath (1913), Aristarchus of Samos, Oxford'
  - 'NASA Earth Fact Sheet (Earth''s circumference, Moon''s distance) https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html'
---

**Module 1 · about 16 minutes.** By the end you will be able to repeat Eratosthenes' measurement of the Earth, use Aristarchus's half-moon triangle, and explain why small angle errors can ruin big measurements.

<div class="bigidea">The first step out into the universe was measuring our own planet, using nothing more than a stick, a shadow and some geometry.</div>

## 1. Eratosthenes measures the Earth (about 240 BCE)

Eratosthenes ran the great library at Alexandria in Egypt. He heard that at noon on midsummer's day in the town of Syene (modern Aswan), the Sun shone straight down a deep well: it was exactly overhead. On the same day in Alexandria, about 800 km to the north, a vertical stick still cast a small shadow. Step through his reasoning:

<div class="steps" data-fig="eratosthenes">
<div class="step"><p><b>The Sun is very far away</b>, so its rays arrive at the Earth practically parallel.</p></div>
<div class="step"><p><b>At Syene</b>, the Sun is straight overhead at noon. A stick casts no shadow, and sunlight reaches the bottom of a well.</p></div>
<div class="step"><p><b>At Alexandria</b>, at the same moment, a vertical stick casts a shadow. The angle between the stick and the Sun's rays is about 7.2°.</p></div>
<div class="step"><p><b>The same angle at the centre.</b> Both sticks point at the Earth's centre. Because the rays are parallel, the angle between the two sticks, measured at the centre, is also 7.2°.</p></div>
<div class="step"><p><b>The sum.</b> 7.2° is 1/50 of a full 360° circle. So the Earth's circumference is 50 times the 800 km between the towns: about 40,000 km. The modern value is 40,075 km at the equator.</p></div>
</div>

```math
\text{circumference} = \frac{360^\circ}{\theta} \times d
```

<div class="meaning">

<dl>
<dt>θ</dt><dd>the shadow angle at the second town, in degrees: how far the Sun is from straight overhead</dd>
<dt>d</dt><dd>the distance between the two towns along the ground</dd>
<dt>360°/θ</dt><dd>how many times that slice fits into a full circle</dd>
</dl>

Double the distance between the towns and the shadow angle doubles too, so the answer stays the same: that is how you know the method is measuring the Earth, not the towns.

</div>

<div class="problem" data-problem="eratosthenes"></div>

## 2. Aristarchus and the half moon

Aristarchus wanted to know how much farther away the Sun is than the Moon. He noticed something clever: at the exact moment of **half moon**, the Sun lights exactly half of the face we see. That means the angle at the Moon, between the Earth and the Sun, is a right angle (90°).

So Earth, Moon and Sun form a right-angled triangle. Measure the angle at the Earth, between the Moon and the Sun, and the shape of the triangle is fixed:

```math
\frac{\text{Earth–Sun distance}}{\text{Earth–Moon distance}} = \frac{1}{\cos\theta}
```

<figure class="fig" data-fig="aristarchus"><figcaption>Slide the angle towards 90°. The closer it gets, the farther the Sun has to be. The triangle is drawn with the Sun fixed at the right edge, so it is the Moon's distance that shrinks.</figcaption></figure>

Aristarchus measured about 87° and concluded that the Sun is about 19 times farther away than the Moon. The true angle is about 89.85°, which gives about 390. His method was perfect; his angle was off by just 3°, and near 90° that changes everything.

<div class="problem" data-problem="aristarchus"></div>

<div class="meaning">

**Why tiny errors explode near 90°.** cos θ is the length of the short side compared with the long side. When θ is near 90°, the short side is almost nothing, so a small change in θ changes it by a large *fraction*. This is a lesson every cosmologist learns: some measurements are naturally fragile, and you must know how your errors grow.

</div>

## 3. The Moon's distance, from an eclipse

Aristarchus also watched lunar eclipses. The Earth's shadow on the Moon is curved, and he could compare the size of the shadow with the size of the Moon. Together with Eratosthenes' Earth size, that put the Moon at about 60 Earth radii away, close to the modern 60.3. This "60" will matter again in Lesson 1.5, when Newton uses it to show that the same gravity pulls apples and the Moon.

<div class="myth">

**"The Sun and Moon are about the same size, because they look the same size."** They look the same because the Sun is about 400 times wider and also about 400 times farther away. That coincidence is why total solar eclipses can happen at all.

</div>

<div class="keypoints">

- Eratosthenes used the noon shadow angle (7.2°) and the distance between two towns (800 km) to find the Earth's circumference: about 40,000 km.
- The method works because the Sun's rays are parallel, so the shadow angle equals the angle between the towns at the Earth's centre.
- Aristarchus used the right-angled triangle at half moon: Sun distance ÷ Moon distance = 1 ÷ cos(angle).
- Near 90°, a tiny angle error makes a huge distance error: Aristarchus got 19 instead of about 390.

</div>
