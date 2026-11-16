---
name: Magnification
num: 2265
shelf: learn
code: L351
section: school-biology
title: "Microscope magnification: image size, actual size and field of view"
summary: "Look through a virtual light microscope, pick a specimen and lens, measure the image with a ruler and work out the real size of the cell, then compare light and electron microscope resolution."
status: live
ads: false
order: 2265
icon: eye
works: offline
updated: 2026-11-16
related: [virtual-microscope, cell-explorer, microscope-telescope]
sources:
  - "Magnification = image size ÷ actual size is the standard rule used in GCSE Biology B1 cell biology (required practical on microscopy), Ontario SNC2D and Grade 8 cells, and NGSS MS-LS1-1. Cell sizes are typical rounded values (onion 250 µm, cheek 60 µm, stoma 30 µm, red blood cell 7 µm, rod bacterium 2 µm). Field number 18 mm is a common eyepiece value. Resolution figures are the usual textbook limits (about 200 nm light, 0.2 nm electron). Checked in tests/curr-geo.mjs. Pictures are fibub's own."
flow:
  - { icon: eye, label: "Look" }
  - { icon: ruler, label: "Measure" }
  - { icon: calculator, label: "Work out" }
  - { icon: check, label: "Quiz" }
---

## What it does

A light microscope has two lenses that both magnify. The eyepiece is usually ×10 and the objective is ×4, ×10, ×40 or ×100, so the total magnification is eyepiece × objective: ×40, ×100, ×400 or ×1000. Because cells are tiny, we measure the image and divide by the magnification to find the real size.

Choose a specimen and a lens, then drag the red ruler across one cell. The page shows the image length in mm, divides by the magnification and gives the actual size in mm, µm or nm. It also shows how the field of view shrinks as you magnify, a calibration step with a graticule, and why electron microscopes see far smaller detail. To explore more cells and instruments, try [[virtual-microscope]], [[cell-explorer]] and [[microscope-telescope]].

## How to use it

1. Pick a specimen and an objective lens.
2. Drag the ruler ends so the ruler spans one cell.
3. Read the actual size; change the unit to see mm, µm or nm.
4. Change the lens and measure again: the image changes, the actual size does not.
5. Try the calibration sliders, then the quiz.

## What each setting does

- **Objective:** ×4, ×10, ×40 or ×100 (oil). Higher power shows more detail but a smaller field.
- **Field of view:** 18 mm ÷ objective power. At ×4 it is 4.5 mm, at ×100 only 0.18 mm.
- **Calibration:** one eyepiece division = (stage divisions × 10 µm) ÷ eyepiece divisions.
- **Unit:** 1 mm = 1,000 µm = 1,000,000 nm.

## Worked example

An onion cell is drawn at total magnification ×100. Its image measures 25 mm. Actual size = 25 ÷ 100 = 0.25 mm = 250 µm. For calibration, if 40 eyepiece divisions line up with 10 stage divisions, one division is 10 × 10 ÷ 40 = 2.5 µm, so a cell 6 divisions long is 15 µm.

## FAQs

**Why is the field of view smaller at high power?** The lens shows a smaller patch of the slide, magnified more.

**Why can't a light microscope show a virus?** Details closer than about 200 nm blur together. Electron beams have a much shorter wavelength, so they resolve about 0.2 nm.

**Is magnification the same as resolution?** No. Magnification makes the image bigger; resolution is how much detail you can tell apart.
