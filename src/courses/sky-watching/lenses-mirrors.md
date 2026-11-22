---
title: "How lenses and mirrors make an image"
summary: "A telescope's main lens or mirror bends parallel starlight to a single point, the focus. The distance to it is the focal length. Learn the lens equation and why mirrors took over big telescopes."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "Where does light from a very distant star come to a focus?"
    choices: ["At twice the focal length", "At the focal point, one focal length away", "It never focuses"]
    ans: 1
    why: "Parallel rays from a distant object meet at the focal point."
  - q: "An object sits at 3 focal lengths from a lens. Where is its image?"
    choices: ["At 1.5 f", "At 3 f", "At 0.75 f"]
    ans: 0
    why: "1/v = 1/f − 1/u = 1 − 1/3 = 2/3, so v = 1.5 f."
  - q: "Why are all the world's largest telescopes reflectors?"
    choices: ["Mirrors are cheaper to make in small sizes", "A mirror can be supported from behind and shows no colour fringing", "Lenses can't focus starlight"]
    ans: 1
    why: "A large lens sags under its own weight and can only be held at its edge; it also splits colours. A mirror avoids both."
sources: []
---

**Module 4 · about 20 minutes · algebra with fractions.** You'll be able to explain how a lens and a curved mirror focus light, use the lens equation, and say why big telescopes use mirrors.

## 1. Why this matters

Every telescope, camera lens and pair of binoculars works by forming an image at a focus. Knowing where that image forms explains focal length, why a camera needs "back focus" (the distance from the last optic to the sensor), and why you sometimes can't reach focus with a new accessory.

## 2. Bending light

Light changes direction when it passes from air into glass at an angle (**refraction**), because it travels more slowly in glass. A lens with curved faces bends rays near its edge more than rays near its centre, so parallel rays come together at one point: the **focal point**. A concave mirror does the same by **reflection**: its curve turns every parallel ray towards the focal point.

The distance from the lens or mirror to the focal point is the **focal length** `$f$`.

<!--fig:lens-rays-->

Things to notice:

- With the slider at the right end (a star), the rays arrive parallel and meet at F: a point image.
- Move the object closer: the image moves away from the lens, gets bigger, and stays upside down. At 2 f, image and object are the same size.

<details class="maths" open>
<summary>Maths and principle</summary>

**Thin lens (or mirror) equation:** an object at distance `$u$` makes an image at distance `$v$` where

```math
\frac{1}{u} + \frac{1}{v} = \frac{1}{f}
```

**Magnification of the image:** `$m = -v/u$` (the minus sign means upside down).

**For a star** `$u \to \infty$`, so `$1/v = 1/f$` and the image forms exactly at the focus.

**For a mirror,** a spherical or parabolic mirror of radius of curvature `$R$` has `$f = R/2$`. Telescopes use a **parabola**, which sends every parallel ray to exactly the same point; a sphere blurs the edge rays (spherical aberration).

**Try it:** a 1,000 mm lens focused on a tree 20 m away: `$1/v = 1/1000 - 1/20000$`, so `$v = 1052.6$` mm. The image is 52.6 mm behind the star focus, which is why the focuser needs extra travel for daytime targets.
</details>

## 3. Lenses versus mirrors

**Lenses** split colours slightly, because glass bends blue light more than red (**chromatic aberration**). Pairs or triplets of different glasses (achromats, apochromats) correct most of it. A lens can only be held at its edge, and a big one sags; the largest refractor ever used for research is 1.02 m across (Yerkes Observatory, 1897).

**Mirrors** reflect all colours to the same focus and can be supported across their whole back. Today's largest telescopes have mirrors 8 to 10 m across, or many hexagonal segments acting as one mirror, and the Extremely Large Telescope under construction in Chile will be 39 m.

## 4. Worked example

*Where is the focus of a 150 mm f/5 mirror?* The focal ratio (Lesson 4.3) is focal length ÷ aperture, so `$f = 5 \times 150 = 750$` mm. The image of the Moon (0.52° across) at the focus has size

```math
s = f \times \theta = 750 \times 0.52 \times \frac{\pi}{180} = 6.8\ \text{mm}
```

That 6.8 mm Moon image is what the eyepiece magnifies, or what falls on a camera sensor.

## 5. Practice

1. An object is 4 f from a lens. Where is the image and how big is it?
2. A 2,000 mm telescope images the Moon. How big is the Moon's image at the focus?
3. Why does a single simple lens show a coloured halo around bright stars?

<details>
<summary>Answers</summary>

1. `$1/v = 1 - 1/4 = 3/4$`, `$v = 1.33$` f; magnification `$1.33/4 = 0.33$`, upside down.
2. `$2000 \times 0.52 \times \pi / 180 = 18.2$` mm.
3. Glass bends each colour by a different amount, so each colour has a slightly different focus (chromatic aberration).
</details>

**Try it with real numbers:** work out focal ratio, image scale and back focus for your own optics with the [[telescope-calculator]] and the [[backfocus-calculator]].

**New words:** *refraction*, *focal point*, *focal length*, *lens equation*, *chromatic aberration*, *spherical aberration*, *parabolic mirror*.
