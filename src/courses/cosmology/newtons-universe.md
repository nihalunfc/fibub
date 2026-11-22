---
title: 'Newton''s universe: endless, and in trouble'
seoTitle: "Newton's universe and the problem of gravity"
summary: 'Newton showed one law of gravity rules apples and the Moon. But it raised a puzzle: why doesn''t gravity pull all the stars together? Watch a still universe collapse.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: The Moon is about 60 Earth radii from the Earth's centre. How much weaker is Earth's gravity there?
    choices: ['3,600 times weaker', '60 times weaker', '120 times weaker']
    ans: 0
    why: Gravity weakens as 1/distance², and 60² = 3,600.
  - q: What did Richard Bentley ask Newton in 1692?
    choices: ['If every star pulls on every other, why haven''t they all fallen together?', 'Why is the sky blue?', 'How far away is the Sun?']
    ans: 0
    why: An evenly spread, still universe held together only by attraction is unstable. Newton argued an infinite universe might balance, but that balance is knife-edge.
  - q: In the simulation, what happens if the stars start moving apart fast enough?
    choices: ['Gravity slows them but cannot stop them, so they keep spreading', 'They stop and stay still forever', 'They collapse faster']
    ans: 0
    why: Like a ball thrown faster than escape speed, an expanding cloud can outrun its own gravity. This is the seed of the expanding universe in Module 4.
sources:
  - 'I. Newton (1687), Philosophiæ Naturalis Principia Mathematica, Book III (the Moon test)'
  - 'I. Newton, letters to Richard Bentley (1692-93), in The Correspondence of Isaac Newton, vol. III, Cambridge'
  - 'Astronomy course on fibub: Newton''s gravity and orbits https://fibub.com/learn/courses/astronomy/newtons-gravity/'
---

**Module 1 · about 16 minutes.** By the end you will be able to explain Newton's "Moon test", say why a still universe held together by gravity cannot last, and see why that puzzle points towards an expanding universe.

<div class="bigidea">Newton's law of gravity works everywhere, from apples to galaxies. But applied to the whole universe it raised a question that took 250 years to answer: why hasn't everything fallen together?</div>

## 1. The same gravity for the apple and the Moon

Newton's great insight was that the force that makes an apple fall is the same force that holds the Moon in its orbit. He checked it with a calculation known as the **Moon test**. (How orbits work in detail is covered in the Astronomy course: [Newton's gravity](/learn/courses/astronomy/newtons-gravity/). Here we only need the idea.)

<div class="steps" data-fig="moon-falls">
<div class="step"><p><b>The Moon goes round the Earth</b> about once every 27.3 days, at about 60 Earth radii from the Earth's centre (that 60 came from Lesson 1.3).</p></div>
<div class="step"><p><b>With no gravity</b>, the Moon would fly off in a straight line. In one second it moves about 1 km along its path.</p></div>
<div class="step"><p><b>To stay on its curved path</b>, it must fall towards the Earth by about 1.36 mm in that second. The Moon is falling all the time; it just keeps missing.</p></div>
<div class="step"><p><b>An apple near the ground</b> falls 4.9 m in its first second.</p></div>
<div class="step"><p><b>The check.</b> If gravity weakens as 1/distance², at 60 times the distance it is 60² = 3,600 times weaker: 4.9 m ÷ 3,600 = 1.36 mm. It matches. One law rules the sky and the ground.</p></div>
</div>

```math
F = \frac{G\,M\,m}{r^2}
```

<div class="meaning">

<dl>
<dt>F</dt><dd>the pull between two masses, in newtons</dd>
<dt>M, m</dt><dd>the two masses, in kg; double either and the pull doubles</dd>
<dt>r</dt><dd>the distance between their centres; double it and the pull drops to a quarter</dd>
<dt>G</dt><dd>Newton's gravitational constant, 6.674 × 10<sup>−11</sup> N m² kg<sup>−2</sup>: tiny, which is why you don't feel the pull of the person next to you</dd>
</dl>

Gravity only ever **attracts**, and it never switches off with distance; it just gets weaker. That combination is what causes trouble for the universe as a whole.

</div>

<div class="problem" data-problem="moon-fall"></div>

## 2. Bentley's question

In 1692 a young clergyman, Richard Bentley, wrote to Newton with a sharp question: if every star attracts every other star, why haven't they all fallen together into one great lump?

Newton's answer was that if the stars went on **forever, evenly spread** in every direction, each star would be pulled equally from all sides and could stay put. But he admitted the balance would be extremely delicate, "as hard as to make the sharpest needle stand upright on its point". Nudge one star and its neighbours start falling towards it.

Watch what gravity does to a ball of stars that starts at rest:

<figure class="fig" data-fig="static-collapse"><figcaption>200 stars start at rest in a ball. Gravity pulls them all inwards, and the ball falls in on itself in about one "free-fall time". Now give them an outward start with the slider: a gentle push only delays the collapse, but a big enough push lets them keep spreading for ever.</figcaption></figure>

The time it takes depends only on how dense the cloud is:

```math
t_{\text{ff}} = \sqrt{\frac{3\pi}{32\,G\,\rho}}
```

<div class="meaning">

<dl>
<dt>t<sub>ff</sub></dt><dd>the free-fall time: how long a still cloud takes to collapse</dd>
<dt>ρ (rho)</dt><dd>the average density, in kg per cubic metre</dd>
</dl>

Denser clouds collapse faster: four times the density halves the time. Notice that the size of the cloud doesn't appear at all, only its density. For a cloud as dense as a galaxy, the answer is a few tens of millions of years, a tiny fraction of the age of the universe.

</div>

<div class="problem" data-problem="free-fall-time"></div>

## 3. Why this matters

Newton, and almost everyone after him until the 1920s, believed the universe as a whole was **static**: eternal and unchanging. Bentley's question shows that a static universe full of matter is like a pencil balanced on its tip. Even Einstein in 1917 had to add an extra term to his equations to hold his universe still (Lesson 5.7).

The simulation hints at the way out: a universe that is **expanding** doesn't need to balance. Gravity slows the expansion, but it doesn't have to make everything collapse. In Module 4 you'll see that this is exactly what the real universe is doing.

<div class="myth">

**"Gravity stops working far from Earth."** Astronauts on the space station feel weightless because they are falling around the Earth, like the Moon, not because gravity has vanished. Up there it is still about 90% as strong as on the ground.

</div>

<div class="keypoints">

- Newton's Moon test: the Moon falls 1.36 mm each second, exactly 4.9 m ÷ 60², so gravity weakens as 1/distance².
- Gravity always attracts and never switches off, so a still, evenly filled universe is unstable.
- A still cloud collapses in a free-fall time that depends only on its density: tens of millions of years for galaxy-like densities.
- An expanding universe escapes this problem, which is the idea behind modern cosmology.

</div>
