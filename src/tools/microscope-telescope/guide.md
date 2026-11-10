---
name: Microscope and telescope
num: 1006
shelf: learn
code: L6
section: school-physics
title: "Microscope and telescope: magnifying glass, compound microscope and refracting telescope ray diagrams and magnification"
summary: "Set the focal lengths of a magnifying glass, a compound microscope or a refracting telescope and see the rays, the images and the magnification, with the final image at infinity (normal adjustment) or at the near point."
status: live
ads: false
order: 1006
icon: telescope
works: offline
updated: 2026-11-09
related: [lens-ray-diagram, eye-defects, telescope-calculator]
sources:
  - "Simple microscope M = D/f or 1 + D/f; compound microscope M = m_o × m_e with the lens formula for the objective; refracting telescope M = −f_o/f_e (normal adjustment) or −(f_o/f_e)(1 + f_e/D), length f_o + f_e; near point D = 25 cm. Standard school optics as taught in Class 12 physics. All example numbers are made up."
  - "Checked against an independent Python calculation of each instrument (lens formula for the objective and eyepiece) and hand-worked examples."
flow:
  - { icon: telescope, label: "Instrument" }
  - { icon: sliders, label: "Focal length" }
  - { icon: eye, label: "See rays" }
  - { icon: calculator, label: "Magnify" }
---

## What it does

A single convex lens held close to the eye is a **magnifying glass** (a simple microscope). Two convex lenses in a row make a **compound microscope** (a very short-focus objective near a tiny object, then an eyepiece) or a **refracting telescope** (a long-focus objective facing a distant object, then an eyepiece). This tool draws the rays through each one, marks the first image made by the objective and the final image you see, and works out the magnification.

You can put the final image **at infinity** (normal adjustment, comfortable for a relaxed eye) or **at the near point**, 25 cm away, which gives a little more magnification.

It follows the Class 12 Physics chapter on ray optics and optical instruments (simple and compound microscope, refracting telescope). The image-forming rules come from [[lens-ray-diagram]], the near point from [[eye-defects]]; for real telescopes with eyepieces and cameras, see [[telescope-calculator]].

## How to use it

1. Choose **Magnifying glass**, **Compound microscope** or **Telescope**.
2. Choose where the final image goes: **at infinity** or **at the near point**.
3. Move the sliders for the focal lengths (and, for the microscope, the distance L between the lenses).
4. Read the magnification and each step of the working. Along the axis the drawing is to scale; heights are stretched so the tiny object can be seen.

## The formulas

- **Magnifying glass**: M = D/f with the image at infinity, M = 1 + D/f at the near point (D = 25 cm).
- **Compound microscope**: the objective makes a real, inverted, enlarged image (m_o = −v_o/u_o); the eyepiece magnifies that like a magnifying glass (m_e = D/f_e or 1 + D/f_e). The total is M = m_o × m_e.
- **Telescope**: M = −f_o/f_e in normal adjustment, with the tube f_o + f_e long. With the final image at the near point, M = −(f_o/f_e)(1 + f_e/D).

## Worked example

The page opens with a compound microscope: objective f_o = 1 cm, eyepiece f_e = 5 cm, lenses L = 20 cm apart, final image at infinity. The eyepiece needs the first image at its focus, 5 cm in front of it, so v_o = 20 − 5 = 15 cm. From the lens formula the object sits u_o = 1.07 cm in front of the objective. Then m_o = −15/1.07 = **−14** and m_e = 25/5 = **5**, so the total is **−70×**: seventy times bigger, upside down. Switch to the near point and it becomes **−89×**.

For a telescope with f_o = 100 cm and f_e = 5 cm, normal adjustment gives **M = −20×** with a tube **105 cm** long.

## Check yourself

Four questions with fresh numbers each time: magnifying glass, microscope total magnification, telescope magnification and length. **Show working** reveals the steps. Nothing is saved or sent anywhere.

## FAQ

**Why is the magnification negative?** The final image is upside down. In a microscope it hardly matters; for a telescope used on land, binoculars add prisms to turn it the right way up.

**Why are microscope objectives so short in focal length?** The objective's magnification is roughly L/f_o, so a tiny focal length gives a big first image.

**Why does a telescope need a big objective?** Its width gathers light and sets the finest detail it can show; its focal length sets the magnification together with the eyepiece.

This is a teaching model for school optics. It is not connected to NCERT or any exam board.
