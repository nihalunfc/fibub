---
title: Surface Areas and Volumes
seoTitle: 'Surface Areas and Volumes Class 10 notes'
summary: 'Class 10 Surface Areas and Volumes with animations: combinations of solids, hidden faces, capsules, toys, tents and hollows, with worked examples and practice.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'A toy is a cone on a hemisphere, both of radius 3 cm, cone height 4 cm. Its total surface area is:'
    choices: ['33π cm²', '51π cm²', '15π cm²', '27π cm²']
    ans: 0
    why: 'Slant height 5 cm. Cone side πrl = 15π, hemisphere side 2πr² = 18π. The joined circles are hidden, so total = 33π cm².'
  - q: 'A capsule is 9 cm long overall, with hemispherical ends of radius 2 cm. The cylindrical part is:'
    choices: ['5 cm long', '9 cm long', '7 cm long', '3 cm long']
    ans: 0
    why: 'Total length = h + r + r, so h = 9 − 4 = 5 cm.'
  - q: 'A cylinder of radius r and height h has a hemispherical hollow of radius r scooped from one end. The volume left is:'
    choices: ['πr²h − ⅔πr³', 'πr²h + ⅔πr³', 'πr²h − ⁴⁄₃πr³', '⅓πr²h − ⅔πr³']
    ans: 0
    why: 'Subtract the hollow, a hemisphere of volume ⅔πr³, from the whole cylinder πr²h.'
sources:
  - 'NCERT Class 10 Mathematics, Chapter 12 “Surface Areas and Volumes” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard mensuration formulas for the cuboid, cylinder, cone, sphere and hemisphere (Archimedes, On the Sphere and Cylinder, c. 225 BCE). Examples checked by working each number out twice.'
---

**Maths · Class 10 · Chapter 12 · about 55 minutes.** By the end you will be able to find the surface area and the volume of solids built by joining cubes, cuboids, cylinders, cones, spheres and hemispheres, deciding which faces are hidden and which show.

<div class="bigidea">Every combined solid is a few simple solids stuck together. Volumes simply add. Surface areas do not: where two solids touch, the faces disappear inside, so you add only the outside surfaces.</div>

**What is in this chapter (2023 rationalised book).** Surface areas and volumes of *combinations* of any two of: cube, cuboid, sphere, hemisphere, right circular cylinder and cone. The frustum of a cone and the conversion of one solid into another (melting and recasting) were dropped from the Class 10 book, so they are not taught here. If your teacher or an old paper asks for them, treat them as beyond the syllabus.

## 1. The basic solids, quickly

You know these from Class 9. The curved surface area (CSA) is only the curved part. The total surface area (TSA) adds the flat faces. Slide the sizes and turn the wireframe.

<figure class="fig" data-fig="c10-sav-wire"><figcaption>Each solid is made by spinning a profile curve about an axis. Pick a solid, change r and h, and the volume, curved surface and total surface update. The cylinder, cone, sphere and hemisphere all use the same radius r.</figcaption></figure>

| Solid | Curved surface (CSA) | Total surface (TSA) | Volume |
|---|---|---|---|
| Cuboid `$l \times b \times h$` | `$2h(l+b)$` (four walls) | `$2(lb + bh + hl)$` | `$lbh$` |
| Cube, edge `$a$` | `$4a^2$` | `$6a^2$` | `$a^3$` |
| Cylinder | `$2\pi r h$` | `$2\pi r(r+h)$` | `$\pi r^2 h$` |
| Cone | `$\pi r l$` | `$\pi r(r+l)$` | `$\tfrac13\pi r^2 h$` |
| Sphere | `$4\pi r^2$` | `$4\pi r^2$` | `$\tfrac43\pi r^3$` |
| Hemisphere | `$2\pi r^2$` | `$3\pi r^2$` | `$\tfrac23\pi r^3$` |

<div class="meaning">
<dl>
<dt>r, h</dt><dd>the radius of the circular base and the vertical height.</dd>
<dt>l</dt><dd>the slant height of a cone: the length along its sloping side, `$l = \sqrt{r^2 + h^2}$`.</dd>
<dt>CSA, TSA</dt><dd>curved surface area (only the curved part) and total surface area (curved part plus flat faces).</dd>
<dt>Physical meaning</dt><dd>surface area is how much paint or cloth you need to cover the outside. Volume is how much water or sand fits inside. They have different units: cm² and cm³.</dd>
</dl>
</div>

**Why `$\pi r l$` and `$2\pi r h$`?** Cut a curved surface and flatten it. A cylinder gives a rectangle `$2\pi r$` wide and `$h$` tall. A cone gives a sector of radius `$l$` whose arc is the base circumference `$2\pi r$`, with area `$\tfrac12 \times l \times 2\pi r = \pi r l$`.

<figure class="fig" data-fig="c10-sav-unroll"><figcaption>Cut the curved side along the red line and unroll it. The cylinder becomes a rectangle 2πr by h; the cone becomes a sector of radius l and arc 2πr.</figcaption></figure>

**Use the slant height in the cone's surface.** The height, radius and slant height form a right triangle:

<figure class="fig" data-fig="c10-sav-slant"><figcaption>The height h is straight up, the radius r lies along the base, and l runs down the slope: l² = r² + h². Use l in πrl, and h in the volume.</figcaption></figure>

<div class="problem" data-problem="c10m-sav-cone"></div>

<div class="myth">

**“Use the height h in the cone's surface area.”** The curved surface is the sloping side, so it needs the slant height `$l$`. Use `$h$` only for the volume `$\tfrac13\pi r^2 h$`. For r = 3 and h = 4, l = 5, not 4.

</div>

**Volumes of the cone and hemisphere relative to a cylinder.** Take a cone and a cylinder with the same base and height equal to r. Two cones of water fill a hemisphere of that radius, and three fill the cylinder. So volumes are in the ratio `$1 : 2 : 3$`.

<figure class="fig" data-fig="c10-sav-pour"><figcaption>The cone (⅓πr³) is poured into the hemisphere (⅔πr³) or the cylinder (πr³). Two cones fill the hemisphere exactly and three fill the cylinder.</figcaption></figure>

Explore all six basic solids in 3D, with nets and pouring:

<!--fig:tool solids-lab-->

**The cuboid and the cube** (Class 9 recap) are in the table. In a room, the four walls are the lateral surface `$2h(l+b)$`; the floor and ceiling are the other two faces. The longest straight line inside is the space diagonal `$\sqrt{l^2 + b^2 + h^2}$`.

<figure class="fig" data-fig="c10-sav-cuboid"><figcaption>Change l, b and h and choose what to show: all six faces (TSA), the four walls (lateral surface) or the space diagonal.</figcaption></figure>

## 2. Surface area of a combination of solids

When two solids are joined, the faces where they touch are no longer on the outside. Slide "Join" below and watch the two circles vanish into the interior.

<figure class="fig" data-fig="c10-sav-join"><figcaption>Cone on a hemisphere and cylinder on a hemisphere (r = 3, h = 4). Apart, the touching circles count; joined, they are hidden. Total surface of the joined solid = sum of the separate total surfaces − 2πr².</figcaption></figure>

**Method for any combined solid.**

1. Name the parts (cone, hemisphere, cylinder ...) and write r and h for each.
2. For each part list only the surfaces that are on the **outside**.
3. Add those areas. (Do not add areas of faces that are glued together or covered.)
4. Use the slant height for cone parts. Check units.

### Example 1: a toy, cone on a hemisphere

A toy is a cone on a hemisphere. Both have radius 3 cm and the cone is 4 cm tall. Find the surface area and volume.

<div class="steps" data-fig="c10-sav-toy">
<div class="step">The toy is a cone sitting on a hemisphere, both of radius 3 cm, cone height 4 cm.</div>
<div class="step">Take it apart: a cone and a hemisphere. The circle where they were joined is hidden in the toy.</div>
<div class="step">Only the outside is painted: the cone's curved side and the hemisphere's curved side.</div>
<div class="step">Slant height l = √(3² + 4²) = 5 cm. Cone side = πrl = π × 3 × 5 = 15π cm².</div>
<div class="step">Hemisphere side = 2πr² = 2π × 9 = 18π cm². Total surface = 15π + 18π = 33π ≈ 103.6 cm² (π = 3.14).</div>
<div class="step">Volume: cone ⅓πr²h = ⅓π × 9 × 4 = 12π; hemisphere ⅔πr³ = ⅔π × 27 = 18π. Total 30π ≈ 94.2 cm³.</div>
</div>

<div class="problem" data-problem="c10m-sav-toy"></div>

<div class="problem" data-problem="c10m-sav-toyvol"></div>

<div class="myth">

**“Add the total surface areas of both solids.”** If you add the cone's total surface (which includes its base) and the hemisphere's total surface (which includes its flat top), you count two circles that are glued together inside the toy. Use curved surface + curved surface, here 15π + 18π = 33π, not 24π + 27π = 51π.

</div>

### Example 2: a capsule or gulab jamun

A capsule is a cylinder with a hemisphere on each end. Two hemispheres make one sphere, so its surface is the cylinder's side plus a sphere's surface. **Watch the length:** the overall length is `$h + 2r$`, so the cylinder part is shorter than the whole.

<div class="steps" data-fig="c10-sav-capsule">
<div class="step">A capsule: cylinder with a hemisphere at each end. Total length 9 cm, radius 2 cm.</div>
<div class="step">Total length = h + r + r, so the cylinder part is h = 9 − 2 × 2 = 5 cm, not 9.</div>
<div class="step">Break it into a cylinder and two hemispheres. Together the hemispheres form one sphere of radius 2 cm.</div>
<div class="step">Surface: cylinder side 2πrh = 2π × 2 × 5 = 20π, plus sphere 4πr² = 16π. Total 36π ≈ 113.1 cm².</div>
<div class="step">Volume: cylinder πr²h = 20π and sphere ⁴⁄₃πr³ = 32π/3.</div>
<div class="step">Total volume = 20π + 32π/3 = 92π/3 ≈ 96.3 cm³.</div>
</div>

A neat fact: since TSA `$= 2\pi r h + 4\pi r^2 = 2\pi r(h + 2r)$`, the surface of a capsule is `$2\pi r \times$` its *overall length*.

<div class="problem" data-problem="c10m-sav-capsule"></div>

### Example 3: a tent

A circus tent is a cylinder (the walls) topped by a cone (the roof). There is no cloth on the floor, and the cylinder's top and the cone's base are not cloth either: the roof covers them.

<div class="steps" data-fig="c10-sav-tent">
<div class="step">A tent: a cylinder with a cone on top. r = 3 m, wall height 4 m, roof height 4 m.</div>
<div class="step">Split it into the walls (cylinder) and the roof (cone).</div>
<div class="step">The walls need cloth: cylinder side 2πrh = 2π × 3 × 4 = 24π m². No floor, no top.</div>
<div class="step">Slant height of the roof l = √(3² + 4²) = 5 m, so the roof cloth is πrl = π × 3 × 5 = 15π m².</div>
<div class="step">Canvas = 24π + 15π = 39π ≈ 122.5 m². At ₹120 per m² that costs about ₹14,700.</div>
<div class="step">Air inside the tent = πr²h + ⅓πr²H = 36π + 12π = 48π ≈ 150.8 m³.</div>
</div>

<div class="problem" data-problem="c10m-sav-tent"></div>

### Example 4: a cube topped by a hemisphere

A hemisphere of the largest possible radius sits on a cube of edge `$a$`. Its radius is `$a/2$`. The cube loses a circle `$\pi r^2$` of its top face and the hemisphere adds its curved surface `$2\pi r^2$`, so the net change is `$+\pi r^2$`:

```math
\text{TSA} = 6a^2 - \pi r^2 + 2\pi r^2 = 6a^2 + \pi r^2, \quad r = \tfrac a2
```

<div class="problem" data-problem="c10m-sav-cube"></div>

Try a few combinations yourself: pick an ice-cream cone, a capsule, a rocket or a dome, then slide the sizes and see which surfaces are counted:

<!--fig:tool combined-solids-->

## 3. Volume of a combination of solids

For volume there is no hiding: when two solids are joined, the volume of the whole is simply the **sum of the volumes**. When a solid is scooped out of another, **subtract**.

- **Joined:** `$V = V_1 + V_2$` (toy: cone + hemisphere; capsule: cylinder + sphere).
- **Hollowed:** `$V = V_{\text{whole}} - V_{\text{hollow}}$`.

### Example 5: a pen stand with a hollow

A wooden cylinder of radius 3 cm and height 8 cm has a hemispherical hollow of radius 3 cm scooped from the top. Surface area and volume of the wood?

<div class="steps" data-fig="c10-sav-hollow">
<div class="step">A solid wooden cylinder, radius 3 cm and height 8 cm. We look at its cross-section.</div>
<div class="step">Scoop out a hemispherical hollow of radius 3 cm from the top.</div>
<div class="step">Outside surfaces: the curved side 2πrh = 2π × 3 × 8 = 48π and the base πr² = 9π.</div>
<div class="step">The hollow is as wide as the whole top, so no flat top face is left: it contributes 0.</div>
<div class="step">The inside bowl is now a surface you can touch: a hemisphere's curved surface 2πr² = 18π.</div>
<div class="step">Total surface = 48π + 9π + 18π = 75π ≈ 235.5 cm².</div>
<div class="step">Volume = whole cylinder − hollow = πr²h − ⅔πr³ = 72π − 18π = 54π ≈ 169.6 cm³.</div>
</div>

<div class="problem" data-problem="c10m-sav-hollow"></div>

**Exam checklist.**

1. Draw the solid and label r and h of every part.
2. If a part is a cone, find l from `$l^2 = r^2 + h^2$`.
3. For surface: list exactly which surfaces are outside. Cross out joined faces.
4. For volume: add joined parts, subtract hollows.
5. Use `$\pi = \tfrac{22}{7}$` for radii multiples of 7, otherwise 3.14, unless told.
6. Write the unit: cm² for area and cm³ for volume.

You can also look at flat-faced solids in the [Polyhedron viewer](/science/polyhedron-viewer/), and go back to the circle formulas in [Areas Related to Circles](/learn/courses/ncert-class-10-maths/areas-related-to-circles/).

<div class="history">

<ul class="timeline">
<li><b>about 225 BCE</b> Archimedes proves that a sphere has two-thirds the volume of the cylinder that just holds it. He asked for a sphere inside a cylinder to be carved on his tomb.</li>
<li><b>1150 CE</b> Bhaskara II, in the Lilavati, gives rules for the surface area and volume of a sphere, with worked examples in verse.</li>
</ul>

</div>

<div class="keypoints">

- Cylinder: CSA `$2\pi r h$`, TSA `$2\pi r(r+h)$`, V `$\pi r^2 h$`. Cone: CSA `$\pi r l$`, TSA `$\pi r(r+l)$`, V `$\tfrac13\pi r^2 h$`, with `$l = \sqrt{r^2 + h^2}$`.
- Sphere: surface `$4\pi r^2$`, V `$\tfrac43\pi r^3$`. Hemisphere: CSA `$2\pi r^2$`, TSA `$3\pi r^2$`, V `$\tfrac23\pi r^3$`.
- Combined solid, **surface**: add only outside surfaces. Faces that are joined or covered are left out.
- Combined solid, **volume**: add the volumes of the parts. For a hollow, subtract.
- Toy (cone on hemisphere): `$\pi r l + 2\pi r^2$`. Capsule: `$2\pi r h + 4\pi r^2$`, with overall length `$h + 2r$`. Tent: cylinder side + cone side.
- Cone : hemisphere : cylinder (same r, height r) volumes are 1 : 2 : 3.
- Frustums and recasting one solid into another are not in the current Class 10 book.

</div>

Ready for exam-style questions? Go to [Surface Areas and Volumes: practice questions](/learn/courses/ncert-class-10-maths/surface-areas-and-volumes-practice/).
