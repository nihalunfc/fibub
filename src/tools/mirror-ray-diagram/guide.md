---
name: Mirror ray diagram
num: 1001
shelf: learn
section: school-physics
title: "Spherical mirror ray diagram: concave and convex mirrors, image position and the mirror formula"
summary: "Drag an object in front of a concave or convex mirror and watch the principal rays find the image: where it forms, how big it is, real or virtual, with the mirror formula and magnification worked out with signs."
status: live
ads: false
order: 1001
icon: eye
works: offline
updated: 2026-11-09
related: [lens-ray-tracer, telescope-calculator]
sources:
  - "Mirror formula 1/v + 1/u = 1/f, magnification m = −v/u, R = 2f and the New Cartesian sign convention: standard school optics, as taught in Class 10 and Class 12 physics. All numbers in the examples and questions are made up."
  - "Checked against an independent Python calculation of the mirror formula for every standard position and against hand-worked examples."
flow:
  - { icon: sliders, label: "Pick mirror" }
  - { icon: pointer, label: "Move object" }
  - { icon: eye, label: "See rays" }
  - { icon: calculator, label: "Formula" }
---

## What it does

A curved mirror makes an image wherever the reflected rays from one point of an object meet again (a **real** image, which you could catch on a screen) or seem to come from (a **virtual** image, which you only see in the mirror). This tool draws that for a **concave** mirror (curved in, like the inside of a spoon) and a **convex** mirror (curved out, like the back of a spoon). Move the object and the principal rays, the image, its size and the mirror formula all update at once.

It follows the Class 10 Science chapter on light (reflection by spherical mirrors, the image table, the mirror formula and magnification) and the Class 12 Physics chapter on ray optics (sign convention, R = 2f, paraxial rays). Next, try the same with lenses in [[lens-ray-tracer]], or see how mirrors and lenses become a [[telescope-calculator]].

## How to use it

1. Pick **Concave** or **Convex**.
2. Tap a standard position (for a concave mirror: at infinity, beyond C, at C, between C and F, at F, between F and P) or **drag the object** along the axis in the picture. It snaps onto C and F when you get close.
3. Change the **focal length** with its slider, or type exact numbers in the boxes. Type "infinity" for a very distant object.
4. Read the image's nature, size and position, the numbers with their signs, and the worked mirror formula below the picture. The table shows the row for where your object is.
5. **Class 12** adds a fourth ray (the one that hits the pole), the radius of curvature, the power, and the image height for an object height you choose.

## The rays it draws

- A ray **parallel to the axis** reflects through F (concave) or seems to come from F behind the mirror (convex).
- A ray **through F** (or heading towards F, for a convex mirror) reflects parallel to the axis.
- A ray **through C**, the centre of curvature, hits the mirror head-on and comes straight back.
- Class 12: a ray to the **pole P** reflects at the same angle on the other side of the axis.

Solid lines are real light. Dashed lines show where reflected rays only appear to come from, and a dashed image arrow is a virtual image.

## Sign convention

Distances are measured from the pole. The object sits on the left, where light comes from, so its distance u is negative. Anything in front of the mirror is negative, anything behind it is positive, heights above the axis are positive. That makes a concave mirror's f negative and a convex mirror's f positive. Then one formula works for every case: **1/v + 1/u = 1/f** and **m = −v/u**.

## Worked example

The page opens with a concave mirror of focal length 15 cm and the object 30 cm away, which is at C. With signs, u = −30 cm and f = −15 cm. Then 1/v = 1/(−15) − 1/(−30) = −0.03333, so **v = −30 cm**: the image is also at C, in front of the mirror. The magnification is m = −v/u = −(−30)/(−30) = **−1**, so the image is the same size and upside down: real and inverted.

Now drag the object to 10 cm (between F and P). The formula gives v = +30 cm and m = +3: the image is behind the mirror, three times as tall and upright. This is how a shaving or make-up mirror works.

## Check yourself

At the bottom are four short questions with fresh numbers every time. Type your answer with its sign and press **Check**; **Show working** reveals the steps. Nothing is saved or sent anywhere.

## FAQ

**Why do the rays not hit the curve exactly where a textbook shows?** The tool draws rays to scale for an object close to the axis, which is when the mirror formula holds. Real mirrors with wide openings blur the image a little (spherical aberration).

**Why is the image "at infinity" when the object is at F?** The reflected rays come out parallel, so they never meet. A torch or a car headlight puts its bulb at F of a concave mirror for this reason.

**Can a convex mirror ever make a real image of a real object?** No. Its image is always virtual, upright and smaller, between P and F behind the mirror.

This is a teaching model for school optics. It is not connected to NCERT or any exam board.
