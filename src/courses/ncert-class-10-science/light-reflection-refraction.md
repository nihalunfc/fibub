---
title: Light – Reflection and Refraction
seoTitle: 'Light Reflection and Refraction Class 10 notes'
summary: 'Class 10 Light with ray-diagram animations: laws of reflection, mirrors and lenses for every object position, sign convention, refraction, formulas and power.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'An object is placed 30 cm in front of a concave mirror of focal length 10 cm. Where is the image?'
    choices: ['15 cm in front of the mirror', '15 cm behind the mirror', '30 cm in front of the mirror', '7.5 cm in front of the mirror']
    ans: 0
    why: '1/v = 1/f − 1/u = −1/10 + 1/30 = −2/30, so v = −15 cm. The minus sign means the image is in front of the mirror (real and inverted).'
  - q: 'A ray of light passes from air into glass. Which statement is correct?'
    choices: ['It speeds up and bends away from the normal', 'It slows down and bends towards the normal', 'It slows down and bends away from the normal', 'It keeps its speed and direction']
    ans: 1
    why: 'Glass is optically denser: light travels slower there (v = c/n), and the ray bends towards the normal.'
  - q: 'A lens has a focal length of −25 cm. Its power and type are:'
    choices: ['+4 D, convex', '−4 D, concave', '−0.25 D, concave', '+25 D, convex']
    ans: 1
    why: 'P = 1/f with f in metres = 1/(−0.25) = −4 D. A negative power means a concave (diverging) lens.'
sources:
  - 'NCERT Class 10 Science, Chapter 9 “Light – Reflection and Refraction” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Refractive indices (sodium D line, room temperature): CRC Handbook of Chemistry and Physics, 97th edition (2016), table “Index of refraction of inorganic and organic liquids and solids”'
  - 'Speed of light in vacuum, 299 792 458 m/s: SI Brochure, 9th edition (BIPM, 2019)'
---

**Science · Class 10 · Chapter 9 · about 60 minutes.** By the end you will be able to draw the image made by any mirror or lens, say what it will be like without drawing, use the mirror and lens formulae with the correct signs, explain how light bends when it changes medium, and find the power of a lens.

<div class="bigidea">Light travels in straight lines until it meets something. A mirror sends it back (reflection); a new medium bends it (refraction). Curved surfaces make that bending or bouncing depend on where the light lands, and that is how mirrors and lenses build images.</div>

## 1. Reflection of light

When light hits a polished surface it bounces back. This is **reflection**, and it follows two simple laws:

1. The **angle of incidence (i)** equals the **angle of reflection (r)**.
2. The incident ray, the reflected ray and the **normal** (a line at 90° to the surface, at the point where the ray hits) all lie in the **same plane**.

Angles are always measured from the normal, not from the surface. Think of a cricket ball bouncing off a smooth floor: it leaves at the same slant at which it arrived.

<figure class="fig" data-fig="c10-light-reflection"><figcaption>Switch between three pictures. On a <b>smooth mirror</b> drag the angle: i and r stay equal. On <b>rough paper</b> every tiny facet still obeys i = r, but they all face different ways, so the light scatters. In <b>image in mirror</b>, the object and its image are the same distance from the mirror.</figcaption></figure>

A rough surface like a page, a wall or your shirt gives **diffuse reflection**: that is why you can see them from every side. A mirror gives **regular reflection**, which is why you can see an image in it.

<div class="problem" data-problem="c10s-light-angle"></div>

**The image in a plane mirror** is virtual (it cannot be caught on a screen, because light only *seems* to come from it), erect, the same size as the object, as far behind the mirror as the object is in front, and **laterally inverted**: your right hand looks like a left hand. That is why AMBULANCE is written reversed on the front of the vehicle: drivers read it correctly in their rear-view mirror.

<div class="problem" data-problem="c10s-light-plane"></div>

More to try: the [Plane mirror lab](/learn/plane-mirror-lab/) lets you place objects and see exactly where the images appear.

<div class="myth">

**“The angle of incidence is the angle the ray makes with the mirror.”** It is the angle with the *normal*. A ray that skims the surface at 10° has an angle of incidence of 80°.

</div>

## 2. Spherical mirrors: the words you must know

A **spherical mirror** is part of the surface of a hollow sphere. If the inside is the shiny face it is a **concave mirror** (it “caves in”, like the bowl of a spoon); if the outside is shiny it is a **convex mirror** (like the back of the spoon).

- **Pole (P)**: the centre of the mirror surface.
- **Centre of curvature (C)**: the centre of the sphere the mirror was cut from. **Radius of curvature (R)** is the distance PC.
- **Principal axis**: the straight line through P and C.
- **Principal focus (F)**: where rays parallel to the axis meet (concave) or seem to come from (convex). **Focal length (f)** is the distance PF.

For a mirror with a small opening, the focus is halfway between the pole and the centre of curvature:

```math
f = \frac{R}{2}
```

<div class="problem" data-problem="c10s-light-focal"></div>

## 3. Ray diagrams: how to find an image

An image forms where rays from the same point of the object meet again (a **real** image, which a screen can catch) or seem to come from (a **virtual** image). To locate the tip of the image you only need two of these three rays:

1. A ray **parallel to the principal axis**: after reflection it passes through F (concave) or appears to come from F (convex).
2. A ray **through F** (or directed towards F): after reflection it goes **parallel** to the axis.
3. A ray **towards C**: it hits the mirror at 90°, so it bounces straight back along itself. (Or a ray to the pole P, which reflects with i = r.)

Drag the object along the axis and watch the rays. Everything you will learn about concave mirrors is in this one picture:

<figure class="fig" data-fig="c10-light-mirror"><figcaption>Drag the object (or use the slider) in front of a concave or a convex mirror with f = 10 cm. The coloured rays are the three principal rays. Solid lines are real rays; dashed lines are the “seem to come from” lines behind the mirror. The readout gives v and m from the formulae.</figcaption></figure>

Now walk through **every standard position** of the object, one at a time, for a concave mirror and then a convex one:

<div class="steps" data-fig="c10-light-mirror-cases">
<div class="step">Object very far away (at infinity), like the Sun: the rays are parallel, so the mirror brings them together at F. The image is a bright point at F. This is how a solar cooker or a magnifying burn works.</div>
<div class="step">Object beyond C: the image is between F and C, real, inverted and smaller than the object. This is like the image on a screen when the mirror is far from you.</div>
<div class="step">Object at C: the image is also at C, real, inverted and exactly the same size (m = −1). Object distance and image distance are equal to R.</div>
<div class="step">Object between C and F: the image moves beyond C. It is real, inverted and enlarged. As the object gets closer to F, the image runs away and grows.</div>
<div class="step">Object at F: the reflected rays are exactly parallel, so they never meet: the image is at infinity, highly enlarged. This is a torch: the bulb sits at F to send out a parallel beam.</div>
<div class="step">Object between F and P: the rays spread out after reflection, but they seem to come from a point behind the mirror. The image is virtual, erect and enlarged. This is a shaving or make-up mirror.</div>
<div class="step">Convex mirror: wherever the object is, the image is virtual, erect and smaller, between P and F behind the mirror. The mirror always makes things look small, but it shows a wide area.</div>
</div>

| Object position (concave) | Image position | Size | Nature |
|---|---|---|---|
| At infinity | At F | Point, highly diminished | Real, inverted |
| Beyond C | Between F and C | Diminished | Real, inverted |
| At C | At C | Same size | Real, inverted |
| Between C and F | Beyond C | Enlarged | Real, inverted |
| At F | At infinity | Highly enlarged | Real, inverted |
| Between F and P | Behind the mirror | Enlarged | Virtual, erect |

Try the construction for yourself with the full ray-diagram tool:

<!--fig:tool mirror-ray-diagram-->

## 4. Uses of spherical mirrors

The shape of the mirror decides the job it does. Try all three:

<figure class="fig" data-fig="c10-light-uses"><figcaption>A bulb at the focus of a concave reflector sends out a parallel beam (torch, car headlamp); move it off the focus and the beam spreads. Parallel sunlight meets at the focus of a concave mirror (solar cooker); tilt the sun and the hot spot slides. A convex mirror gives a much wider view than a plane one, so it is used as the rear-view mirror.</figcaption></figure>

- **Concave mirrors:** torches, headlights, searchlights (bulb at F); shaving and make-up mirrors (close object, erect and enlarged image); dentists’ mirrors for a magnified view of teeth; solar furnaces (to focus sunlight).
- **Convex mirrors:** rear-view mirrors of cars and bikes, and the big mirrors at blind corners on narrow roads and in shops, because they cover a wide area and always give an upright image.

## 5. The sign convention

To use formulae for every mirror and lens with one rule, scientists use the **New Cartesian sign convention**:

- The pole of the mirror (or the optical centre of the lens) is the **origin**.
- The principal axis is the **x-axis**, and the object is placed on the **left**.
- Distances measured **in the direction of the incident light** (to the right) are **positive**; those measured **against** it (to the left) are **negative**.
- Heights **above** the axis are positive, **below** are negative.

So for a real object, u is always negative. A concave mirror has a negative f; a convex mirror a positive f. Check each sign below:

<figure class="fig" data-fig="c10-light-sign"><figcaption>Pick a device and slide the object. u, v and f are read from the pole (or centre) with the sign rule. A dashed image is virtual. For a mirror, a negative v means the image is in front of it (real); for a lens, a positive v means the image is on the far side (real).</figcaption></figure>

<div class="myth">

**“Put in the numbers as they are given.”** Most wrong answers in this chapter come from forgetting the signs. Write u, v, f *with* their signs before you put them in a formula: a concave mirror’s f is −10 cm, not 10 cm.

</div>

## 6. The mirror formula and magnification

For any spherical mirror, with the sign convention above:

```math
\frac{1}{v} + \frac{1}{u} = \frac{1}{f}
```

The **magnification** compares the size of the image to the size of the object:

```math
m = \frac{h'}{h} = -\frac{v}{u}
```

<div class="meaning">
<dl>
<dt>u</dt><dd>object distance from the pole (negative for a real object)</dd>
<dt>v</dt><dd>image distance from the pole (negative: real image in front; positive: virtual image behind)</dd>
<dt>f</dt><dd>focal length (negative for concave, positive for convex)</dd>
<dt>h, h′</dt><dd>height of the object and of the image</dd>
<dt>m</dt><dd>magnification. Negative: inverted. Positive: erect. More than 1 in size: enlarged. Less than 1: diminished</dd>
<dt>Physical meaning</dt><dd>The formula tells you where the reflected rays meet if you know where the object is and how strongly the mirror bends light. m = −v/u says that an image farther from the mirror than the object is bigger, in the same ratio.</dd>
</dl>
</div>

**Worked example.** An object 4 cm tall is 30 cm in front of a concave mirror of focal length 10 cm. Here u = −30 cm, f = −10 cm.

1/v = 1/f − 1/u = −1/10 + 1/30 = −2/30, so v = −15 cm. The image is 15 cm in front of the mirror (real). m = −v/u = −(−15)/(−30) = −0.5, so h′ = −0.5 × 4 = −2 cm: inverted, 2 cm tall.

<div class="problem" data-problem="c10s-light-mirror"></div>

<div class="problem" data-problem="c10s-light-mag"></div>

## 7. Refraction of light

When light goes from one transparent medium into another, it **changes direction** at the boundary. This is **refraction**. A pencil in a glass of water looks bent; a coin at the bottom of a bucket looks closer to the surface; a swimming pool looks shallower than it is. All of these are refraction.

The reason is speed. Light travels fastest in vacuum (about 3 × 10⁸ m/s) and slower in water, glass or diamond. Picture a line of soldiers marching from a firm road onto soft mud at a slant: the soldier who reaches the mud first slows down while the others are still on the road, so the whole line swings round.

<div class="steps" data-fig="c10-light-bend">
<div class="step">The lines are wavefronts of light, always at right angles to the ray. In air they move at the speed of light, all together.</div>
<div class="step">Now the lower half is glass. The left end of each front enters the glass first and slows down, while the right end is still in air and runs ahead. The front starts to swivel.</div>
<div class="step">Once the whole front is in the glass it moves in a new direction, still at right angles to the new ray. The ray has bent towards the normal, and sin i / sin r = 1.5.</div>
<div class="step">In diamond, light is slower still (n = 2.4). The swivel is bigger, so the ray bends even more towards the normal.</div>
<div class="step">Run the film backwards: going from glass into air, the part that leaves first speeds up, and the ray bends away from the normal.</div>
</div>

**The two rules of refraction:**

1. Light going into an **optically denser** medium (where it is slower, like glass or water) **bends towards the normal**. Going into a **rarer** medium it bends **away from the normal**.
2. A ray that falls **along the normal** (i = 0°) goes straight on, because the whole wavefront slows at once.

**The laws of refraction (Snell’s law):**

1. The incident ray, the refracted ray and the normal are all in the **same plane**.
2. For light of a given colour passing between two given media, **sin i / sin r is constant**.

```math
\frac{\sin i}{\sin r} = n
```

The constant n is the **refractive index** of the second medium with respect to the first.

<figure class="fig" data-fig="c10-light-snell"><figcaption>Choose water, glass or diamond and move the angle of incidence. The ray bends towards the normal on the way in; flip to “Medium → air” and it bends away. The little dot moves slower in the denser medium. For large angles on the way out there is no refracted ray at all (total internal reflection, which you will meet in Class 12).</figcaption></figure>

<div class="problem" data-problem="c10s-light-snell"></div>

## 8. Refractive index

The **absolute refractive index** of a medium is how many times faster light is in vacuum than in that medium:

```math
n = \frac{c}{v}
```

<div class="meaning">
<dl>
<dt>n</dt><dd>refractive index of the medium (no unit; always 1 or more)</dd>
<dt>c</dt><dd>speed of light in vacuum, 3 × 10⁸ m/s</dd>
<dt>v</dt><dd>speed of light in the medium</dd>
<dt>Physical meaning</dt><dd>n = 1.5 means light moves 1.5 times slower in that glass than in vacuum. A bigger n means a slower speed and a bigger bend. “Optically denser” means larger n; it does not mean heavier.</dd>
</dl>
</div>

| Medium | n | Speed of light (× 10⁸ m/s) |
|---|---|---|
| Air | 1.0003 | 3.00 |
| Water | 1.33 | 2.26 |
| Crown glass | 1.52 | 1.97 |
| Diamond | 2.42 | 1.24 |

<figure class="fig" data-fig="c10-light-speed"><figcaption>A race between four light pulses that start together. The pulse in diamond is slowest, so diamond has the largest refractive index. v = c/n.</figcaption></figure>

<div class="problem" data-problem="c10s-light-index"></div>

### Refraction through a rectangular glass slab

A ray goes through a slab in two steps. On entering (air to glass) it bends **towards** the normal; on leaving (glass to air) it bends **away** by the same amount. Because the two faces are parallel, the angle of emergence e equals the angle of incidence i: the emergent ray is **parallel** to the incident ray, but **shifted sideways**. That shift is the **lateral displacement**.

<figure class="fig" data-fig="c10-light-slab"><figcaption>Change the angle, the thickness and the material. The lateral shift grows with the thickness and with the angle of incidence (and is zero at i = 0°). The dashed line shows where the ray would have gone without the slab.</figcaption></figure>

Explore Snell’s law with real readings and a graph of sin i against sin r:

<!--fig:tool snell-law-->

## 9. Spherical lenses

A **lens** is a piece of transparent material with two curved surfaces. A **convex lens** is thicker in the middle and **converges** parallel rays to a point, so it is called a converging lens. A **concave lens** is thinner in the middle and **diverges** them. Each has two principal foci (one on each side) at the same distance f from the **optical centre (O)**.

Three rays for drawing images:

1. A ray **parallel to the axis** goes through the far focus (convex) or seems to come from the near focus (concave).
2. A ray **through the optical centre** goes straight on, undeviated.
3. A ray **through the near focus** (or aimed at the far focus) emerges parallel to the axis.

<figure class="fig" data-fig="c10-light-lens"><figcaption>Drag the object in front of a convex or concave lens, f = 10 cm. Real images (solid) form on the other side; virtual images (dashed) on the object’s side. 2F marks are at 20 cm.</figcaption></figure>

Now every standard position for a convex lens, then a concave lens:

<div class="steps" data-fig="c10-light-lens-cases">
<div class="step">Object at infinity: parallel rays meet at the far focus F. The image is a point, real, inverted, highly diminished.</div>
<div class="step">Object beyond 2F: the image is between F and 2F on the other side, real, inverted and diminished. This is a camera: a far-away scene is shrunk onto the film or sensor.</div>
<div class="step">Object at 2F: the image is at 2F on the other side, real, inverted and exactly the same size (m = −1).</div>
<div class="step">Object between F and 2F: the image is beyond 2F, real, inverted and enlarged. This is a projector: the slide is just beyond F and the screen is far away.</div>
<div class="step">Object at F: the emerging rays are parallel, so the image is at infinity, highly enlarged.</div>
<div class="step">Object between F and O: the rays still spread after the lens, but seem to come from a point on the object’s side. The image is virtual, erect and enlarged. This is a magnifying glass.</div>
<div class="step">Concave lens: wherever the object is, the image is virtual, erect and diminished, between O and F on the object’s side.</div>
</div>

| Object position (convex lens) | Image position | Size | Nature |
|---|---|---|---|
| At infinity | At F | Point | Real, inverted |
| Beyond 2F | Between F and 2F | Diminished | Real, inverted |
| At 2F | At 2F | Same size | Real, inverted |
| Between F and 2F | Beyond 2F | Enlarged | Real, inverted |
| At F | At infinity | Highly enlarged | Real, inverted |
| Between F and O | Same side as object | Enlarged | Virtual, erect |

Build your own ray diagrams with the lens tool:

<!--fig:tool lens-ray-diagram-->

## 10. The lens formula and magnification

With the same sign convention (object on the left, optical centre as the origin):

```math
\frac{1}{v} - \frac{1}{u} = \frac{1}{f} \qquad\qquad m = \frac{h'}{h} = \frac{v}{u}
```

Notice two small differences from the mirror: the lens formula has a **minus** between 1/v and 1/u, and the magnification is **v/u** (no minus sign). A convex lens has a positive f; a concave lens a negative f. A positive m means an erect image, a negative m an inverted one.

**Worked example.** A candle 4 cm tall is 30 cm from a convex lens of focal length 10 cm. u = −30 cm, f = +10 cm. 1/v = 1/f + 1/u = 1/10 − 1/30 = 2/30, so v = +15 cm (real, on the far side). m = v/u = 15/(−30) = −0.5, so h′ = −2 cm: inverted and half the size.

<div class="problem" data-problem="c10s-light-lens"></div>

## 11. Power of a lens

A short focal length lens bends light a lot; a long one barely bends it. The **power** of a lens measures this bending:

```math
P = \frac{1}{f} \quad (f \text{ in metres})
```

The unit is the **dioptre (D)**: 1 D is the power of a lens of focal length 1 m. A convex lens has positive power; a concave lens negative. An optician’s prescription of −2.5 means a concave lens of power −2.5 D, so f = 1/(−2.5) = −0.4 m = −40 cm.

When thin lenses are put **in contact**, their powers add:

```math
P = P_1 + P_2 + P_3 + \cdots
```

So a +3 D lens and a −1 D lens together act like one +2 D lens (f = 50 cm). Doctors and opticians use this to combine lenses when a single one cannot give the power needed.

<figure class="fig" data-fig="c10-light-power"><figcaption>Change the power of a lens and see the focus move: +10 D means f = 10 cm, +1 D means f = 100 cm. Switch to “Two lenses touching” to see the powers add, even when one lens is concave.</figcaption></figure>

<div class="problem" data-problem="c10s-light-power"></div>

<div class="history">

<ul class="timeline">
<li><b>about 1015</b> Ibn al-Haytham (Alhazen) writes the <i>Book of Optics</i>, showing that we see because light enters the eye, and studies reflection and refraction.</li>
<li><b>1608-1610</b> The telescope is invented in the Netherlands; Galileo uses it to see the moons of Jupiter.</li>
<li><b>1621</b> Willebrord Snell finds the law of refraction (published later by Descartes).</li>
<li><b>1676</b> Ole Rømer uses Jupiter’s moons to show that light has a finite speed.</li>
</ul>

</div>

<div class="keypoints">

- Laws of reflection: i = r (measured from the normal); incident ray, reflected ray and normal are in one plane.
- Plane mirror image: virtual, erect, same size, as far behind as the object is in front, laterally inverted.
- Spherical mirror: f = R/2. Mirror formula 1/v + 1/u = 1/f; m = h′/h = −v/u.
- Concave mirror images: real and inverted for u beyond F; virtual, erect and enlarged for u between F and P. Convex mirror: always virtual, erect, diminished.
- Sign convention: distances from the pole or optical centre, positive along the incident light; u is negative; heights above the axis positive.
- Refraction: bends towards the normal in a denser medium, away in a rarer one. Snell’s law sin i / sin r = n. n = c/v.
- Glass slab: emergent ray is parallel to the incident ray but displaced sideways.
- Lens formula 1/v − 1/u = 1/f; m = v/u. Convex lens: converging, f positive. Concave lens: diverging, f negative.
- Power P = 1/f (f in metres), in dioptres; powers of lenses in contact add.

</div>
