---
name: Stomatal density counter
num: 327
shelf: science
section: botany-and-plant-science
title: "Stomatal density and stomatal index counter from a microscope photo"
summary: "Tap the stomata (and epidermal cells) on a microscope photo of a leaf peel or nail-varnish impression, or let the page suggest them, and get stomata per mm² and the stomatal index. Field of view from a scale line, the field number or typed. The photo stays in your browser."
status: live
ads: false
order: 327
icon: pointer
works: offline
updated: 2026-11-09
related: [hemocytometer, biodiversity-indices, sample-size, leaf-area-analyser, spore-size-measurer, cfu-counter, photosynthesis-curve-fitter]
sources:
  - "Salisbury, E. J. (1928) On the causes and ecological significance of stomatal frequency, with special reference to the woodland flora. Philosophical Transactions of the Royal Society B 216, 1–65 (stomatal index = stomata ÷ (stomata + epidermal cells) × 100)."
  - "Field of view diameter = eyepiece field number ÷ (objective × any extra magnification), the standard microscope relation."
  - "Otsu, N. (1979) A threshold selection method from gray-level histograms. IEEE Transactions on Systems, Man, and Cybernetics 9, 62–66 (the automatic threshold for suggestions)."
  - "Threshold and patch finding are checked in the tests against scikit-image 0.26 and SciPy ndimage.label (see the leaf area tool); the example epidermis is drawn by the page with 23 made-up stomata, and the tests check that all 23 are found at their drawn centres."
  - "A photo you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Photo" }
  - { icon: pointer, label: "Tap" }
  - { icon: ruler, label: "Field" }
  - { icon: table, label: "Density" }
---

## What it does

Stomatal density is the number of stomata per square millimetre of leaf surface; the stomatal index is the share of epidermal cells that are stomata. Both are standard measures in plant physiology, ecology and palaeoclimate work. This page turns a microscope photo into both numbers:

- **Tap to count.** Tap each stoma on the photo; switch to *Epidermal cell* and tap the ordinary cells too if you want the stomatal index. *Remove* takes away the mark nearest your tap, and *Undo* steps back.
- **Automatic suggestion.** *Suggest stomata* marks every dark (or light) patch of the size you give, so you only need to fix its mistakes.
- **Field of view.** The page needs the area you counted. It can come from a scale line you draw on the photo (the whole photo is the field), from the microscope's field number and objective (a round field), or typed.
- **Several fields.** Add each photo to the list and the page gives the mean and standard deviation across fields.

The photo is read on this page only and is never uploaded.

Relate stomatal density to gas exchange with the [[photosynthesis-curve-fitter|photosynthesis curve fitter]], and measure the leaves themselves with the [[leaf-area-analyser|leaf area analyser]].

## How to use it

1. **Photo.** Make an impression of the leaf surface with clear nail varnish and tape, or peel the epidermis, and photograph it through the microscope. Open the photo here.
2. **Tap.** Tap every stoma. For the index, choose *Epidermal cell* and tap every other cell in the same field. Or press *Suggest stomata* first and correct it.
3. **Field.** Pick how the area is known. For a scale line, tap *Draw the scale line*, tap both ends of the scale bar (or of a stage micrometer photographed at the same settings) and type its length in µm.
4. **Density.** Read the density and index, press *Add this field to the list*, and repeat for more photos. Download the fields or the marks as CSV, or a report as an image, PDF or Word file.

## What each option does

- **Stomata look darker / lighter.** Which side of the threshold counts as a stoma for the suggestion.
- **Threshold.** Blank uses Otsu's automatic threshold on the photo's brightness; type 0 to 255 to set your own.
- **Smallest and largest stoma (px).** Patches outside this size are ignored, which keeps out specks, cell walls and air bubbles. Patches cut by the photo's edge are left out.
- **Field number and objective.** The eyepiece field number (mm) divided by the objective (and any extra magnifier) gives the diameter of the round field; count only the stomata inside it.

## Worked example

The made-up example is an epidermis photographed at 2 px per µm (480 × 320 px, so 240 × 160 µm). The automatic suggestion finds all **23 stomata**, and the 37 other epidermal cells are already tapped. The field is 0.0384 mm², so the page shows **Stomatal density: 599 per mm²** and a stomatal index of 23 ÷ (23 + 37) = **38.3 %**.

For a round field instead: an eyepiece of field number 22 with a 40× objective sees a circle 550 µm across, an area of 0.2376 mm².

## Tips

- Count at least five fields per leaf, away from the midrib and the leaf edge, and report the mean with its spread.
- Use the same leaf side, leaf age and position for every plant you compare; densities differ a lot between the upper and lower surface.
- A common rule for stomata cut by the edge of a field is to count those on two sides (for example top and left) and not the other two, so they are not counted twice across fields.
- Check every automatic suggestion; guard-cell pairs that touch, dirt and trichome bases fool simple thresholds.

## FAQ

**What is the difference between density and index?** Density depends on how big the epidermal cells are, which changes with light and water. The index divides by all cells, so it changes less with leaf expansion and is used to compare growing conditions and CO₂.

**Do epidermal cells include the stomata?** In the index the denominator is stomata plus epidermal cells, where a stoma (its pair of guard cells) counts as one. Tap only the ordinary cells as epidermal cells; the page adds the stomata itself.

**Does it work with subsidiary cells?** Count them as epidermal cells or not, as your method says, and do it the same way every time.
