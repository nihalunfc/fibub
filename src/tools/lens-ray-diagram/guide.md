---
name: Lens ray diagram
num: 1002
shelf: learn
section: school-physics
title: "Lens ray diagram: convex and concave lenses, the lens formula and power in dioptres"
summary: "Drag an object in front of a convex or concave lens and watch the principal rays find the image: where it forms, how big it is, real or virtual, with the lens formula, magnification and power worked out with signs."
status: live
ads: false
order: 1002
icon: eye
works: offline
updated: 2026-11-09
related: [mirror-ray-diagram, lens-ray-tracer, telescope-calculator]
sources:
  - "Lens formula 1/v − 1/u = 1/f, magnification m = v/u, power P = 1/f in dioptres, P = P₁ + P₂ for thin lenses in contact, and the New Cartesian sign convention: standard school optics, as taught in Class 10 and Class 12 physics. All numbers in the examples and questions are made up."
  - "Checked against an independent Python calculation of the lens formula (exact fractions) for every standard position and against hand-worked examples."
flow:
  - { icon: sliders, label: "Pick lens" }
  - { icon: pointer, label: "Move object" }
  - { icon: eye, label: "See rays" }
  - { icon: calculator, label: "Formula" }
---

## What it does

A lens bends light as it passes through. A **convex** lens (thicker in the middle) brings rays together and can make a **real** image you can catch on a screen; a **concave** lens (thinner in the middle) spreads them apart and only ever makes a **virtual** image you see by looking through it. This tool draws the principal rays to scale, so you can watch the image move, grow, shrink and flip as you drag the object along the axis.

It follows the Class 10 Science chapter on light (refraction by spherical lenses, the image table, the lens formula, magnification and power) and the Class 12 Physics chapter on ray optics (sign convention, thin lenses in contact). Before this, try the same with curved mirrors in [[mirror-ray-diagram]]; after it, see how two lenses make a telescope in [[telescope-calculator]] or trace real thick lenses in [[lens-ray-tracer]].

## How to use it

1. Pick **Convex** or **Concave**.
2. Tap a standard position (for a convex lens: at infinity, beyond 2F₁, at 2F₁, between F₁ and 2F₁, at F₁, between F₁ and O) or **drag the object** in the picture. It snaps onto F₁ and 2F₁ when you get close.
3. Change the **focal length** with its slider, or type exact numbers. Type "infinity" for a very distant object.
4. Read the image's nature, size and position, the signed numbers and the worked lens formula. The table highlights the row for your object's position.
5. **Class 12** adds the image height for an object height you choose and a box for **two lenses in contact**.

## The rays it draws

- A ray **parallel to the axis** bends through F₂ (convex) or bends away as if it came from F₁ (concave).
- A ray **through the optical centre O** goes straight on without bending.
- A ray **through F₁** (convex), or heading for F₂ (concave), comes out parallel to the axis.

Solid lines are real light; dashed lines show where rays only seem to come from. A dashed image arrow is a virtual image.

## Sign convention and power

Distances are measured from the optical centre O. The object is on the left, where light comes from, so u is negative; anything to the right of the lens is positive. A convex lens has a positive f, a concave lens a negative f. Then **1/v − 1/u = 1/f** and **m = v/u** work for every case. The **power** P = 1/f with f in metres, measured in dioptres (D): a convex lens of 50 cm is +2 D, a concave lens of 25 cm is −4 D. Lenses in contact simply add their powers.

## Worked example

The page opens with a convex lens of focal length 10 cm and the object 20 cm away, which is at 2F₁. With signs, u = −20 cm and f = +10 cm. Then 1/v = 1/10 + 1/(−20) = 0.05, so **v = 20 cm**: the image is at 2F₂ on the other side. The magnification is m = v/u = 20/(−20) = **−1**: same size, upside down, real. The power is 1/0.1 m = **+10 D**.

Drag the object to 5 cm (inside F₁) and the formula gives v = −10 cm and m = +2: an upright image twice as tall, on the same side as the object. That is a magnifying glass. In Class 12 mode, put a −20 cm concave lens against the 10 cm lens: P = 10 + (−5) = +5 D, so the pair acts like one convex lens of 20 cm.

## Check yourself

Four short questions with fresh numbers each time: image distance, magnification, focal length and power. Type your answer with its sign and press **Check**; **Show working** reveals the steps. Nothing is saved or sent anywhere.

## FAQ

**Why does the ray bend only once, in the middle of the lens?** For a thin lens the two bends at the front and back surfaces add up to one bend, so school diagrams (and this tool) draw it at the centre line.

**Why is f positive for a convex lens but negative for a concave mirror, which also brings light together?** In the sign convention, a converging lens's focus F₂ is to the right (positive), while a concave mirror's focus is in front of it, to the left (negative).

**What do opticians' prescriptions like −1.5 mean?** That is the power in dioptres: −1.5 D is a concave lens of focal length 1/1.5 m, about 67 cm.

This is a teaching model for school optics. It is not connected to NCERT or any exam board.
