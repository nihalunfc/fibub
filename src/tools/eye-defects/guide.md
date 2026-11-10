---
name: Eye defects
num: 1005
shelf: learn
code: L5
section: school-physics
title: "Eye defects"
summary: "See how the eye lens changes its power to focus near and far, what goes wrong in short sight, long sight and presbyopia, and which lens fixes each one, with the power in dioptres worked out."
status: live
ads: false
order: 1005
icon: eye
works: offline
updated: 2026-11-09
related: [lens-ray-diagram, prism-dispersion]
sources:
  - "Simplified eye (teaching model, not anatomy): lens-to-retina distance 2.5 cm, accommodation up to 4 dioptres for a young eye, least distance of distinct vision 25 cm; lens formula 1/v − 1/u = 1/f and P = 1/f. Standard school optics as taught in Class 10 science; all example numbers are made up. Not an eye test or medical advice."
  - "Checked against an independent Python calculation of the corrective lens powers (−1/far point, 1/0.25 − 1/near point) and hand-worked examples."
flow:
  - { icon: eye, label: "Pick an eye" }
  - { icon: sliders, label: "Move object" }
  - { icon: target, label: "Focus" }
  - { icon: calculator, label: "Fix it" }
---

## What it does

Your eye focuses light onto the **retina** at the back, like a camera focusing onto its sensor. The distance from the eye lens to the retina cannot change, so to see near and far things sharply, the eye changes the **power of its lens** instead: the ciliary muscles squeeze it fatter for near objects. This is **accommodation**.

This tool shows a simplified eye, light from an object you can move, and where that light comes to a focus: on the retina (sharp), in front of it, or behind it (blurred). Choose a short-sighted, long-sighted or ageing eye, then put on the **correcting glasses** to see the light land on the retina again, with the lens power in dioptres worked out.

It follows the Class 10 Science chapter on the human eye and the colourful world (power of accommodation, near point and far point, myopia, hypermetropia, presbyopia and their correction). The lens maths is the same as in [[lens-ray-diagram]]; the same chapter's prism and spectrum are in [[prism-dispersion]].

This is a **teaching model only**: real eyes differ, and it cannot test anyone's eyesight.

## How to use it

1. Choose an eye: **Normal**, **Short-sighted** (myopia), **Long-sighted** (hypermetropia) or **Presbyopia**.
2. Move the **object** slider from 10 cm up to very far away (the right end).
3. For short sight, set the **far point**, the furthest distance seen clearly. For long sight and presbyopia, set the **near point**, the closest distance seen clearly.
4. Read where the focus falls, the eye lens power needed against the range this eye can manage, and the correcting lens.
5. Tick **Wear the correcting glasses** and watch the focus move onto the retina.

## The defects

- **Myopia (short sight)**: the eye is too strong for distant light (often the eyeball is a little long). Far things focus in front of the retina. A **concave** lens of focal length equal to minus the far point fixes it: P = −1/far point.
- **Hypermetropia (long sight)**: the eye cannot get strong enough for near light (often the eyeball is a little short). Near things focus behind the retina. A **convex** lens that makes an object at 25 cm appear at the near point fixes it.
- **Presbyopia**: with age the lens loses its flexibility, so the near point moves away. Reading glasses (convex) help; people who also have short sight may need **bifocals**.

## Worked example

Choose **Short-sighted** with a far point of 80 cm, and look at something far away. The eye's weakest power is 40 + 100/80 = 41.25 D, but parallel light needs only 40 D, so the focus falls **in front of the retina**. The correcting lens has f = −80 cm, so **P = 100/(−80) = −1.25 D**. Tick the glasses: the focus lands on the retina.

Choose **Long-sighted** with a near point of 100 cm and a book at 25 cm: the focus falls behind the retina. To read at 25 cm the lens must make the page seem 100 cm away: 1/f = −1/100 + 1/25, so **P = 4 − 1 = +3 D**, a convex lens.

## Check yourself

Four questions with fresh numbers each time: the lens for a given far point or near point, and the focal length from a prescription. **Show working** reveals the steps. Nothing is saved or sent anywhere.

## FAQ

**What does a prescription of −2.5 mean?** A concave lens of power −2.5 dioptres, focal length 100/(−2.5) = −40 cm: short sight with a far point of about 40 cm.

**Why do older people hold books further away?** Presbyopia: their near point has moved out, so close print blurs.

**Is this how opticians test eyes?** No. Opticians measure eyes with proper instruments and account for many things this simple model leaves out. Always see a qualified eye-care professional about your eyesight.

This is a teaching model for school optics. It is not connected to NCERT or any exam board.
