---
title: "Field of view and mosaics"
summary: "Your camera's field of view decides which targets fit in one frame. Big nebulae and galaxies may need a mosaic of overlapping panels; small galaxies need long focal lengths."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "An APS-C sensor 23.5 mm wide on a 500 mm telescope sees about how wide a field?"
    choices: ["0.5°", "2.7°", "27°"]
    ans: 1
    why: "57.3 × 23.5 / 500 ≈ 2.7°."
  - q: "Why do mosaic panels overlap?"
    choices: ["So software can match stars between panels and blend the seams", "To double the exposure", "Because the sky moves"]
    ans: 0
    why: "Overlap of 10% to 20% gives shared stars for alignment and smooth blending."
  - q: "Which target needs the longest focal length to fill the frame?"
    choices: ["The Andromeda Galaxy", "The Whirlpool Galaxy M51", "The Pleiades"]
    ans: 1
    why: "M51 is only about a third of a degree across, much smaller than the others."
sources:
  - "Approximate target sizes: SEDS Messier database and NASA"
---

**Module 6 · about 20 minutes · read first: [6.1 Cameras, pixels and image scale](/learn/courses/sky-watching/image-scale/), [6.5 Tracking, guiding and star trails](/learn/courses/sky-watching/tracking-guiding/) · maths: small angles.** You'll be able to compute your field of view, decide whether a target fits, and plan a mosaic.

<div class="bigidea">Your camera's field of view decides which targets fit in one frame; big nebulae and galaxies may need a mosaic of overlapping panels, and small galaxies need long focal lengths.</div>

## 1. Why this matters

Framing is the first creative decision in astrophotography and a practical one in research: survey telescopes trade field for depth, and planning a mosaic is how large areas get covered (the Sloan survey, [Astronomy 5.6](/learn/courses/astronomy/open-archives/), is effectively a giant mosaic).

## 2. Field of view

The field along each side of the sensor is set by its size and the focal length (Lesson 6.1). Some typical fields on an APS-C sensor (23.5 × 15.6 mm):

- 135 mm lens: about 10° × 6.6°: whole constellations.
- 500 mm: about 2.7° × 1.8°: Andromeda Galaxy, the Pleiades with nebulosity.
- 2,000 mm: about 0.67° × 0.45°: small galaxies and planetary nebulae.

<!--fig:fov-frame-->

Things to notice:

- Andromeda (about 3° long) only fits whole below about 420 mm on APS-C; at longer focal lengths you need a mosaic.
- A small planetary camera at long focal length suits the Whirlpool Galaxy, not big nebulae.

Plan a mosaic of the North America Nebula (about 2° × 2°):

<div class="steps">
<div class="step"><b>Your field.</b> A 23.5 mm sensor on a 530 mm refractor: 57.3 × 23.5 / 530 = 2.54° wide.</div>
<div class="step"><b>Width fits.</b> The 2° width fits in one panel across.</div>
<div class="step"><b>Height.</b> The 15.6 mm side gives 1.69°, short of 2°.</div>
<div class="step"><b>Two panels tall.</b> With 15% overlap, each extra panel adds 1.69 × 0.85 = 1.43°: two panels cover 3.1°.</div>
<div class="step"><b>Stitch.</b> Software matches stars in the overlaps and blends the panels into one image.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Field of view** along a side of length `$L$` (mm) at focal length `$F$` (mm):

```math
\theta = 2\arctan\frac{L}{2F} \approx 57.3^\circ \times \frac{L}{F}
```

**Mosaic panels** to cover a target `$W$` wide with a field `$\theta$` and overlap fraction `$o$`:

```math
n = 1 + \left\lceil \frac{W - \theta}{\theta(1 - o)} \right\rceil \quad (\text{or } 1 \text{ if } W \le \theta)
```

and the same for the height. `$\lceil x \rceil$` means "round up".

**Try it:** a 3.2° × 1° target with a 1.34° × 0.9° field and 15% overlap: across `$1 + \lceil 1.86/1.14 \rceil = 3$`; up `$1 + \lceil 0.1/0.765 \rceil = 2$`: a 3 × 2 mosaic.
</details>

## 3. Worked example

*Imaging the Andromeda Galaxy (about 3.2° × 1°) with a 1,000 mm telescope and an APS-C camera.*

- Field: `$57.3 \times 23.5/1000 = 1.35^\circ$` by `$57.3 \times 15.6/1000 = 0.89^\circ$`.
- Panels at 15% overlap: 3 across, 2 up (the 1° height just misses one frame), so 6 panels.
- Rotating the camera to line the long side of the frame along the galaxy's long axis reduces wasted sky.
- With 2 hours per panel, that is 12 hours: a multi-night project. A 400 mm lens fits it in one frame in 2 hours, at lower resolution. A real trade.


<div class="meaning">

<dl>
<dt>θ ≈ 57.3° × L / F</dt><dd>Field of view along a sensor side of L mm.</dd>
<dt>Overlap o</dt><dd>Shared fraction between panels, for stitching.</dd>
<dt>n = 1 + ⌈(W − θ) / (θ(1 − o))⌉</dt><dd>Panels needed to cover a target W wide.</dd>
<dt>Physical meaning</dt><dd>A mosaic is a panorama of the sky, like the phone photos you sweep across a landscape, but taken one patient tile at a time. The overlaps are where the software lines the stars up so the seams vanish.</dd>
</dl>

</div>

<div class="myth">

**"A bigger telescope is always better for astrophotography."** Big nebulae like the Veil or Andromeda need wide fields, which short focal lengths give. A long-focus telescope frames only a corner of them unless you build a mosaic.

</div>

## 4. Practice

<div class="problem" data-problem="mosaic-panels"></div>

**More practice** (answers below):

1. What is the field of a full-frame sensor (36 mm side) at 200 mm?
2. How many panels (one direction) cover a 6° strip with a 2.5° field and 20% overlap?
3. Why do survey telescopes often have very wide fields?

<details>
<summary>Answers</summary>

1. `$57.3 \times 36/200 = 10.3^\circ$`.
2. `$1 + \lceil 3.5/2.0 \rceil = 1 + 2 = 3$`.
3. To cover large areas of sky quickly: a wide field maps more sky per exposure.
</details>

<div class="keypoints">

- Field of view θ ≈ 57.3° × sensor size / focal length.
- Match focal length to the target's size.
- Mosaics cover big targets with overlapping panels (10 to 20% overlap).
- Panels: n = 1 + ⌈(W − θ)/(θ(1 − o))⌉.

</div>

**Try it with real numbers:** plan panels and overlap for any target with the [[mosaic-planner]], and work out field and image scale with the [[telescope-calculator]].

**New words:** *field of view*, *framing*, *mosaic*, *overlap*, *panel*.
