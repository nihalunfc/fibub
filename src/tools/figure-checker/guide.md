---
name: Figure checker
num: 805
shelf: science
section: figures-and-data-presentation
title: "Figure checker: DPI, print size and colour-blind check for journal figures"
summary: "Open a figure and see its pixel size, the DPI stored in the file and how big it can print. Check it against column widths and a minimum DPI, fix a wrong stored DPI without touching the pixels, and see it as people with colour blindness and a greyscale printer would. Nothing is uploaded."
status: live
ads: false
order: 805
icon: image
works: offline
updated: 2026-11-09
related: [plot-maker, graph-digitizer, image-resizer]
sources:
  - "File reading (PNG pHYs, JPEG JFIF and EXIF, TIFF resolution tags, SVG and PDF sizes), print sizes and the DPI rewrite are written by fibub and checked in the tests against the sizes and DPI that Pillow reads from test files."
  - "Colour-blind simulation follows the method of Viénot, Brettel and Mollon (1999), built from the sRGB standard and the Smith and Pokorny (1975) cone space; the tests check it against DaltonLens-Python to within one colour level."
  - "Column widths and DPI values are rounded examples, not any journal's rules. The example figure is drawn by the page from made-up numbers."
  - "A file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Figure" }
  - { icon: ruler, label: "Size & DPI" }
  - { icon: eye, label: "Colour check" }
  - { icon: check, label: "Ready" }
---

## What it does

Journals reject figures for three common reasons: too few pixels for the printed size, a wrong DPI stored in the file, and colours that people with colour blindness cannot tell apart. This page checks all three before you submit, in your browser.

- **Size and DPI.** It reads the pixel size and the resolution stored in the file: the pHYs chunk of a PNG, the JFIF header and EXIF block of a JPEG, and the resolution tags of a TIFF (per inch or per cm). It shows the print size at that DPI and the largest size the figure can print at the journal's minimum.
- **Widths.** For each column width you list, it works out the DPI the figure would have at that width (keeping its shape), the height it would take, and the pixels you would need. An optional maximum height flags figures that are too tall for the page.
- **Fix the stored DPI.** A screenshot or a plot saved at "72 dpi" may have plenty of pixels but opens tiny or huge. *Download with this DPI* rewrites only the resolution field of a PNG or JPEG. The pixels are not changed or re-compressed.
- **Colour vision.** Side-by-side previews for deuteranopia, protanopia and tritanopia (no green, red or blue cones), with a strength slider, and a greyscale preview for black-and-white printing.
- **Vector files.** SVG and PDF figures stay sharp at any size, so DPI does not apply. The page shows the size set in the file and notes embedded pictures.

## How to use it

1. **Open a figure** (PNG, JPEG, TIFF, GIF, WebP, BMP, SVG or PDF), or look at the example that opens with the page.
2. **Figure type and minimum DPI.** Pick a type to fill in an example minimum, then type the number from the journal's guide for authors.
3. **Widths.** Edit the list: one line per width, as *name, width in mm* and optionally *, maximum height in mm*. The defaults are rounded examples.
4. **Read the table.** *OK* means enough pixels at that width. *Too few pixels* means you need a larger export (the table says how many pixels wide). *Too tall* means it fits the width but not the page height.
5. **Colour check.** Look at each panel: can you still tell every line, bar and legend entry apart? If not, change colours (blue with orange is a safe start), add markers, line styles or direct labels.
6. **Download** the report (PNG, PDF or Word), the comparison picture, or the figure with a corrected DPI.

## Worked example

The example is a bar chart 1200 × 800 pixels, saved as a PNG that says 150 dpi. The page shows:

- **Stored resolution:** 150 dpi, so it prints 203 × 135 mm by default.
- **Largest print at 300 dpi:** 102 × 67.7 mm.
- **Single column, 85 mm:** 359 dpi there, 56.7 mm tall: *OK*.
- **One and a half columns, 120 mm:** 254 dpi: *Too few pixels* (1418 wide needed).
- **Full page width, 175 mm:** 174 dpi: *Too few pixels* (2067 wide needed).

So the headline reads *Passes at 1 of 3 widths: up to 102 mm wide at 300 dpi*. Setting the stored DPI to 300 would make it open at 102 mm wide, the right size for a single column. In the deuteranopia and protanopia panels the red *Treated* and green *Control* bars turn into similar olive shades: a classic problem, fixed by using blue and orange or adding hatching.

## Tips

- **Pixels, not DPI, are what count.** A 3000-pixel-wide image is 3000 pixels whether the file says 72 or 600 dpi.
- **Line art needs more.** Thin lines and small text need far more pixels than photos. Export graphs as vector PDF, EPS or SVG when the journal allows it.
- **Never scale up to pass.** Enlarging a small image in an editor adds pixels but no detail; reviewers notice the blur. Export again from the original data.
- **Red and green together** is the most common colour-blindness problem. Blue with orange, or the Okabe-Ito colours, works for almost everyone.

## Questions

**Is my figure uploaded?** No. The file is read by the page in your browser and is never sent anywhere.

**Why do the CMYK previews look odd?** Browsers show CMYK JPEGs and TIFFs differently. The size checks are still right.

**How accurate is the colour-blind simulation?** It follows a well-tested model of dichromacy (a missing cone type), which suits protanopia and deuteranopia best; tritanopia is rarer and more approximate. Lower strengths mix in normal vision as a rough guide to milder forms.

**Why is there no preview for my TIFF?** Previews work for greyscale and RGB TIFFs at 8 or 16 bits. One-bit line art, palette and CMYK TIFFs get the size checks only.
