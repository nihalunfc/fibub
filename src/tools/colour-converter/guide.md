---
name: Colour converter
num: 2009
shelf: everyday
code: T857
section: web-colours
title: "Colour converter: HEX to RGB, HSL, CMYK and CSS colour names"
summary: "Type or pick a colour and get HEX, RGB, HSL, CMYK and its CSS name, with tints, shades and WCAG contrast against white and black."
status: live
ads: false
order: 2009
icon: pointer
works: offline
updated: 2026-11-10
related: [contrast-checker, favicon-maker, photo-palette]
sources:
  - "CSS Color Module Level 4 (W3C): named colours, RGB and HSL syntax."
  - "WCAG 2.2 (W3C): relative luminance and contrast ratio formulas, AA and AAA levels."
  - "CMYK here is the simple device-free formula, fibub's own working; printers use colour profiles."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: convert, label: "Convert" }
  - { icon: copy, label: "Copy" }
---

## What it does

Type a colour as HEX, RGB, HSL, CMYK or one of the 148 CSS colour names, or use the colour picker, and this page shows all the other forms at once, each with a Copy button.

It also gives six tints (mixed with white) and six shades (mixed with black), and the WCAG contrast ratio of your colour on white and on black. Everything runs in your browser. To test two colours of your own against each other, use the [[contrast-checker]]; to pull colours out of a photo, try [[photo-palette]], and to turn a colour into a site icon, [[favicon-maker]].

## How to use it

1. Type a colour in the box, for example `#1e90ff`, `rgb(30, 144, 255)`, `hsl(210, 100%, 56%)`, `cmyk(88%, 44%, 0%, 0%)` or `tomato`. Or tap the colour square to pick one.
2. Read the HEX, RGB, HSL, CMYK and Name rows, and press Copy next to the one you need.
3. Tap a tint or shade to make it the current colour. Reset goes back to the example.

## What each part does

- **HEX**: six-digit web code. Three-digit (#09f) and eight-digit codes are read too; the alpha part is ignored.
- **RGB**: red, green and blue from 0 to 255. Plain numbers like `30, 144, 255` work.
- **HSL**: hue in degrees, saturation and lightness in percent, rounded to whole numbers.
- **CMYK**: a simple conversion for a rough guide. Real print colours depend on the printer's colour profile.
- **Name**: the exact CSS name if there is one, otherwise the nearest name.
- **Contrast**: the WCAG 2 ratio on white and black, with pass or fail for AA (4.5:1 normal text, 3:1 large text) and AAA (7:1 and 4.5:1). The ratio is cut, not rounded, to two decimals.

## Worked example

Type `#1e90ff`. The page shows `rgb(30, 144, 255)`, `hsl(210, 100%, 56%)` and the name `dodgerblue`. On white the contrast is 3.23:1: fine for large headings (AA large passes) but too low for body text. On black it is 6.48:1, which passes AA for normal text but not AAA.

## FAQs

**Why does a picked colour have no name?** Only 148 colours have CSS names, so most show "none" and the closest name.

**What does "Could not read that colour" mean?** The text is not a colour format the page knows.
