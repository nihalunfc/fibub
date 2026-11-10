---
name: Colour vision simulator
num: 497
shelf: science
code: T348
section: audiology-and-vision-science
title: "Colour blindness simulator: see an image with protanopia, deuteranopia, tritanopia or achromatopsia"
summary: "Open an image and see roughly how it looks with red, green or blue colour vision deficiency at any severity, or with no colour vision at all. Side by side, all four at once, pixel colours before and after, PNG download. Nothing is uploaded."
status: live
ads: false
order: 37
icon: eye
works: offline
updated: 2026-11-09
related: [image-resizer, plot-maker, compress-file, file-converter, contrast-checker, science-colour-palette, figure-checker, visual-acuity-converter]
sources:
  - "Method: Viénot F, Brettel H, Mollon JD (1999), Digital video colourmaps for checking the legibility of displays by dichromats, Color Research and Application 24(4):243-252. Matrices computed in the page from that method's definition, not copied."
  - "sRGB transfer function, primaries and D65 white: IEC 61966-2-1 (the sRGB standard). Cone responses: the Hunt-Pointer-Estevez transform, a standard colour-science matrix. Checked in the tests against an independent NumPy implementation."
  - "Weaker forms (anomalous trichromacy) are approximated by mixing normal and dichromat vision by severity; Machado, Oliveira and Fernandes (2009, IEEE TVCG 15(6):1291-1298) model them from shifted cone sensitivities, which needs spectral data this page does not use."
  - "The sample picture (swatches, a made-up dot plate, a chart and a hue bar) is drawn by the page. The dot plate is not a clinical test."
flow:
  - { icon: image, label: "Open image" }
  - { icon: eye, label: "Choose type" }
  - { icon: sliders, label: "Severity" }
  - { icon: download, label: "Save PNG" }
---

## What it does

Most people see colour with three kinds of cone cell in the eye, sensitive to long (red), medium (green) and short (blue) wavelengths. About 1 man in 12 and 1 woman in 200 has a red-green colour vision deficiency, and blue-yellow and complete colour loss are much rarer. This tool shows roughly how an image looks with each of them, so you can check that a chart, map, slide, website or teaching material still works for everyone. Your image is processed in the page and never uploaded.

To check that text on your design is readable, use the [[contrast-checker|contrast and readability checker]]; to resize the image first, the [[image-resizer]].

## How to use it

1. **Choose an image** or drop it on the box (PNG, JPEG, WebP, GIF or BMP, up to 40 MB). Large images are scaled so the long side is at most 2000 pixels. Or keep the **sample picture**.
2. Pick the **Type**:
   - **Protan**: the red (long-wavelength) cones are missing or shifted. Reds look darker and close to greens.
   - **Deutan**: the green (medium-wavelength) cones are missing or shifted. The most common type. Reds and greens look alike.
   - **Tritan**: the blue (short-wavelength) cones are missing or shifted. Blue and green, and yellow and pink, are confused.
   - **Achromatopsia**: no working cones, only brightness. The image turns grey.
3. Set the **Severity**. At 100 % the cone type is missing (protanopia, deuteranopia, tritanopia). Lower values show the weaker forms (protanomaly, deuteranomaly, tritanomaly), which are more common than the complete forms.
4. Choose a layout: **Side by side** with the original, **Simulated only**, or **All four types** at once.
5. Move over a picture to read a colour before and after as hex codes. **Download** the simulated image as a PNG, or all the pictures as a PNG, PDF or Word report.

## How it works

Each pixel's sRGB values are turned into linear light (the sRGB standard's formula), then into the responses of the three cone types. For a missing cone type, its response is replaced by a mix of the other two, chosen so that white and one more colour (blue for protan and deutan, red for tritan) look unchanged: these are colours that dichromats are known to see the same way as everyone else. The result goes back to sRGB. This is the method of Viénot, Brettel and Mollon (1999), done with one 3 by 3 matrix, shown under **Matrix used**. For weaker forms the page mixes the normal and dichromat matrices by severity, a common approximation. Achromatopsia keeps only the relative luminance.

Simulations are approximate: different cone models give slightly different numbers, and real people vary.

## Worked example

In the sample's bar chart, sales are red (#d62728) and costs green (#2ca02c). With **Deutan** at 100 % (deuteranopia), red becomes #85850a and green #878734: two olive colours that are almost the same, so the chart cannot be read. With **Protan** at 100 % they become #666625 and #94942d: easier, because red turns darker. With **Tritan**, red stays #d62727 while green turns teal, #499797. The made-up dot plate shows the same problem: the number 6 fades into the background for protan and deutan vision. The fix is to use colours that also differ in lightness (for example dark blue and orange), or add labels and patterns.

## Tips

- Check every chart in a report with Deutan and Protan at 100 %. If two series look alike, change one colour's lightness, not only its hue.
- Use the contrast checker to test text colours, including how they look under each type.

## FAQ

**Is this what a colour-blind person sees?** It is a model of what information is lost, not an exact picture of anyone's experience.

**Can it diagnose colour blindness?** No. The sample dot plate is made up and is not a test. An eye care professional can test colour vision properly.

**Is my image uploaded?** No. It is read and changed in your browser only.
