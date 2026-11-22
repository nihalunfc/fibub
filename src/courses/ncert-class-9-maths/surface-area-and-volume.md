---
title: 'Math of Space: Surface Area and Volume'
seoTitle: 'Surface Area and Volume Class 9 notes: cone, sphere'
summary: 'Class 9 Surface Area and Volume with animations: cuboid, cylinder, cone, sphere, hemisphere, combined solids and melting one solid into another.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'A cube has edge 5 cm. Its total surface area is:'
    choices: ['150 cm²', '125 cm²', '100 cm²', '30 cm²']
    ans: 0
    why: 'A cube has 6 faces, each 5 × 5 = 25 cm². 6 × 25 = 150 cm².'
  - q: 'A cone and a cylinder have the same radius and the same height. The volume of the cone is:'
    choices: ['one-third of the cylinder', 'half of the cylinder', 'equal to the cylinder', 'two-thirds of the cylinder']
    ans: 0
    why: 'Three cones of water fill the cylinder, so a cone is one-third of it: ⅓πr²h.'
  - q: 'The radius of a sphere is doubled. Its volume becomes:'
    choices: ['8 times', '2 times', '4 times', '6 times']
    ans: 0
    why: 'Volume is proportional to r³, and 2³ = 8. (Its surface area becomes 4 times, as it goes with r².)'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 14 “Math of Space: Surface Area and Volume” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Archimedes, On the Sphere and Cylinder (about 225 BCE), for the sphere and cylinder results; the slicing picture is the standard school version. Every worked example was recomputed a second way.'
---

**Maths · Class 9 · Chapter 14 · about 60 minutes.** By the end you will be able to find the surface area and volume of a cube, cuboid, cylinder, cone, sphere and hemisphere, see where each formula comes from, handle solids joined together, and work out what happens when one solid is melted into another.

<div class="bigidea">Surface area is the “skin” of a solid, measured in square units. Volume is the space inside, measured in cubic units. Open any solid flat and its skin becomes simple shapes, and stack thin slices and its volume becomes base × height. Cones and spheres are just clever fractions of a cylinder.</div>

## 1. Skin and space

Think of a cricket ball and a water tank. To paint the tank you need its **surface area** (how much outside to cover). To know how much water it holds you need its **volume** (how much space inside). Units tell the two apart: surface area in cm² or m², volume in cm³ or m³. A solid that holds 1 litre has a volume of 1000 cm³, and 1 m³ holds 1000 litres.

For a solid with flat faces, the surface area is the sum of the areas of all its faces. We also use two words for solids with a “side wall”: the **lateral** (or **curved**) **surface area** is the sides only, without the top and bottom, and the **total surface area** includes the top and bottom too. A pot with no lid needs only the curved side plus the bottom.

<div class="myth">

**“Surface area and volume are the same kind of number.”** They are not. 1 m² is a flat square on the floor; 1 m³ is a box you can fill. A bigger surface area does not mean a bigger volume: a flat sheet has lots of skin and almost no space inside.

</div>

## 2. Cube and cuboid

A **cuboid** has six rectangular faces in three matching pairs, like a matchbox or a brick. With length l, breadth b and height h:

```math
\text{Volume} = l \times b \times h, \qquad \text{TSA} = 2(lb + bh + hl), \qquad \text{LSA} = 2h(l + b)
```

A **cube** is a cuboid with all edges equal to a, so volume `$a^3$`, total surface area `$6a^2$` and lateral surface area `$4a^2$`.

To see why the surface area formula works, unfold the box. Its net is six rectangles, three pairs of equals. Switch between the solid and its net, and change the size.

<figure class="fig" data-fig="c9-vol-cuboid"><figcaption>Switch to “Net” to unfold the box into six rectangles; each face shows its area. The four side faces in the middle row make the lateral surface, and the two end faces add to the total. Change l, b and h and read the surface area and volume.</figcaption></figure>

<div class="meaning">
<dl>
<dt>l, b, h</dt><dd>length, breadth and height, in the same unit.</dd>
<dt>Volume l × b × h</dt><dd>the number of unit cubes that fit: a layer of l × b cubes, stacked h layers high.</dd>
<dt>TSA</dt><dd>the sum of the six face areas, in square units.</dd>
<dt>Physical meaning</dt><dd>doubling every edge makes the surface area 4 times larger and the volume 8 times larger.</dd>
</dl>
</div>

<div class="problem" data-problem="c9m-vol-cuboid"></div>

<div class="problem" data-problem="c9m-vol-cube"></div>

Explore the shapes in 3D, turning them with your finger, in the solids lab below.

<!--fig:tool solids-lab-->

## 3. Cylinder

A tin of oil, a drum, a water pipe, a roller: all cylinders. A cylinder has radius r and height h. Its volume is the area of the base times the height, like a stack of circular coins: 

```math
V = \pi r^2 h
```

For the surface, open it up.

<div class="steps" data-fig="c9-vol-cylnet">
<div class="step">A cylinder of radius r and height h, like a tin of ghee. Its surface has three parts: a curved side and two flat circles.</div>
<div class="step">Take off the top and bottom lids. They are circles of radius r.</div>
<div class="step">Cut the curved part straight down one side, and open it out.</div>
<div class="step">Flattened, it is a rectangle. Its height is h, and its width is the distance round the circle, 2πr.</div>
<div class="step">Curved surface 2πrh, plus two circles 2 × πr²: total surface area = 2πrh + 2πr² = 2πr(h + r).</div>
</div>

<div class="meaning">
<dl>
<dt>r, h</dt><dd>base radius and height of the cylinder.</dd>
<dt>2πr</dt><dd>the circumference of the base: how far you go once round.</dd>
<dt>Curved surface 2πrh</dt><dd>the label on a tin: a rectangle that wraps once round.</dd>
<dt>Physical meaning</dt><dd>if r is doubled, the volume becomes 4 times (r² grows 4 times); if h is doubled, the volume doubles.</dd>
</dl>
</div>

<div class="problem" data-problem="c9m-vol-tank"></div>

<div class="myth">

**“The diameter and the radius are interchangeable in the formulas.”** The formulas use the radius. If a question gives a diameter, halve it first. A pipe of diameter 14 cm has r = 7 cm.

</div>

## 4. Cone

A cone has a circular base of radius r, a height h (straight up from the centre of the base to the tip), and a **slant height** l (down the sloping side). The three make a right triangle, so

```math
l = \sqrt{r^2 + h^2}
```

**Volume.** Take a cone and a cylinder with the same base radius and the same height. Fill the cone with water and pour it into the cylinder. It takes exactly **three** cones to fill the cylinder. Watch it.

<figure class="fig" data-fig="c9-vol-conefill"><figcaption>Press Play. The cone’s water goes into the cylinder three times, and the cylinder is exactly full. So the cone is one-third of the cylinder. Notice how the level in the cone drops quickly at first: the wide top empties faster.</figcaption></figure>

```math
V_{\text{cone}} = \tfrac{1}{3}\pi r^2 h
```

**Surface.** Cut a cone from the tip down the slant and open it out. You get a piece of a circle (a sector).

<div class="steps" data-fig="c9-vol-conenet">
<div class="step">A cone with base radius r, height h and slant height l (the distance from the tip down the side to the rim). A party hat, an ice-cream cone.</div>
<div class="step">Cut along a slant line from the tip to the rim.</div>
<div class="step">Open it out flat: a sector of a circle of radius l. Its curved edge is the old base rim, so its length is 2πr.</div>
<div class="step">A thin sector is almost a triangle with base = arc 2πr and height l. So its area is ½ × 2πr × l = πrl.</div>
<div class="step">Add the base circle πr²: total surface area = πrl + πr² = πr(l + r). And l = √(r² + h²) from the right triangle.</div>
</div>

<div class="problem" data-problem="c9m-vol-conecsa"></div>

<div class="myth">

**“Use the height h in the curved surface formula.”** The curved surface is πrl with the **slant** height l, not the straight-up height h. The height h is for the volume. A tent that is 4 m high with a base radius of 3 m has a slant side of 5 m.

</div>

## 5. Sphere and hemisphere

A sphere is the shape of a ball: every point on its surface is the same distance r from the centre. A hemisphere is half of it, like a bowl or a dome.

```math
\text{Sphere: } V = \tfrac{4}{3}\pi r^3, \quad S = 4\pi r^2 \qquad \text{Hemisphere: } V = \tfrac{2}{3}\pi r^3, \quad \text{CSA} = 2\pi r^2, \quad \text{TSA} = 3\pi r^2
```

The surface of a sphere is exactly **four times the area of its largest flat circle**, πr². Peel an orange and press all the peel flat: it covers four circles of the same radius as the orange.

The hemisphere’s total surface adds the flat circle on top: `$2\pi r^2 + \pi r^2 = 3\pi r^2$`.

<div class="problem" data-problem="c9m-vol-sphere"></div>

**Where does 4⁄3 πr³ come from? (a look behind the formula)** Archimedes found it more than 2,200 years ago. Take a cylinder with radius r and height r. Put a cone inside, with its tip at the centre of the bottom and its wide end on the top. Put a hemisphere in as well, flat side down. Slice everything at the same height y. The ring between the cylinder and the cone has the same area as the hemisphere’s slice, every time, so the volumes match. Slide to see it.

<figure class="fig" data-fig="c9-vol-archimedes"><figcaption>Slide y. The ring “cylinder minus cone” always has the same area as the hemisphere’s slice: π(r² − y²). So the hemisphere = cylinder − cone = πr³ − ⅓πr³ = ⅔πr³, and a whole sphere is twice that. Beyond the syllabus, but it makes the formula believable.</figcaption></figure>

<div class="myth">

**“Doubling the radius doubles the volume.”** The volume goes with r³: doubling r makes it 8 times as large. The surface goes with r²: 4 times as large. A ball with twice the radius needs 8 times the air but only 4 times the leather.

</div>

See the Platonic solids and other shapes in 3D with the [polyhedron viewer](/science/polyhedron-viewer/).

## 6. Solids joined together

Real objects are often combinations: a capsule, an ice-cream cone with a scoop on top, a toy rocket, a round-bottomed flask. The recipe is always:

1. **Break** the object into simple solids.
2. **Volume**: add the volumes of the parts.
3. **Surface**: add only the faces on the **outside**. A face where two parts are joined is inside the object, so it does not count.

<div class="steps" data-fig="c9-vol-capsule">
<div class="step">A medicine capsule: a cylinder with a half-sphere (hemisphere) fixed at each end. Here r = 3 cm and the cylinder part is 8 cm long.</div>
<div class="step">Split it into three simple solids: one cylinder and two hemispheres.</div>
<div class="step">Two hemispheres of the same radius make one sphere: volume 4⁄3 πr³ = 4⁄3 × π × 27 = 36π cm³.</div>
<div class="step">Cylinder: πr²h = π × 9 × 8 = 72π cm³. Total volume = 72π + 36π = 108π ≈ 339 cm³.</div>
<div class="step">Surface: only the outside counts. Cylinder side 2πrh = 48π, plus sphere 4πr² = 36π: total 84π ≈ 264 cm². The joined circles are inside, so they are not counted.</div>
</div>

<div class="myth">

**“Add the total surface areas of the parts.”** That counts the joined circles twice, though they are hidden inside. For a capsule use the curved side of the cylinder and the curved surfaces of the hemispheres only.

</div>

## 7. Melting and recasting

When a goldsmith melts a gold ball to make wire, or a potter reshapes clay, the **material is the same, so the volume is the same**; only the shape changes. So the rule is: *volume before = volume after*. The surface area changes, though.

Choose the size of the small balls. One ball of radius 6 cm gives (6 ÷ r)³ small balls: halve the radius and you get 8 times as many. The total skin grows as the balls get smaller, which is why powdered sugar dissolves faster than a lump, and why crushed ice cools a drink quicker.

<figure class="fig" data-fig="c9-vol-recast"><figcaption>One ball of radius 6 cm is melted into small balls. The number is (6 ÷ r)³ because the volume is the same. The total surface area becomes 6 ÷ r times the original: smaller pieces mean more skin.</figcaption></figure>

<div class="problem" data-problem="c9m-vol-recast"></div>

Another common case: a sphere melted into a wire (a long thin cylinder). Equate `$\tfrac{4}{3}\pi R^3 = \pi r^2 L$` and solve for the length L.

<div class="keypoints">

- Surface area is in square units; volume is in cubic units. 1 m³ = 1000 litres.
- Cuboid: V = lbh; TSA = 2(lb + bh + hl); LSA = 2h(l + b). Cube: V = a³; TSA = 6a²; LSA = 4a².
- Cylinder: V = πr²h; curved surface 2πrh; total 2πr(h + r).
- Cone: l = √(r² + h²); V = ⅓πr²h; curved surface πrl; total πr(l + r). Three cones fill a cylinder of the same base and height.
- Sphere: V = 4⁄3 πr³; S = 4πr². Hemisphere: V = ⅔πr³; curved 2πr²; total 3πr².
- Doubling a length multiplies surface by 4 and volume by 8.
- Joined solids: add the volumes; add only the outside faces.
- Melting and recasting keeps the volume the same.

</div>

Other tools to explore: the [Solids lab](/learn/solids-lab/) and the [Polyhedron viewer](/science/polyhedron-viewer/). Ready for exam-style questions? Go to [Math of Space: Surface Area and Volume: practice questions](/learn/courses/ncert-class-9-maths/surface-area-and-volume-practice/).
