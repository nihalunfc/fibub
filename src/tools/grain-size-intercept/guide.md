---
name: Grain size by line intercept
num: 853
shelf: science
section: microscopy-and-image-analysis
title: "Grain size from a micrograph: line-intercept method, mean intercept and ASTM grain size number G"
summary: "Open an etched micrograph, calibrate the scale bar and lay test lines or circles over it. The page counts the grain boundaries along every line, lets you add or remove marks by tapping, and gives the mean lineal intercept, the ASTM grain size number G and a confidence interval. The image stays in your browser."
status: live
ads: false
order: 853
icon: ruler
works: offline
updated: 2026-11-09
related: [gel-densitometry, uncertainty-calculator]
sources:
  - "The line-intercept count, the test-line layouts and the statistics are written by fibub. The tests check the boundary counts against an independent Python count (SciPy and scikit-image) on a Voronoi grain image, Otsu's threshold against scikit-image, and the mean intercept of random Voronoi grains against the known value π / (4 √density)."
  - "G uses the ASTM E112 relation G = −6.6457 log10(ℓ) − 3.298 with ℓ in millimetres, a published formula. This page is not the standard and is not affiliated with ASTM; check the standard for test procedures."
  - "The example micrograph is drawn by the page: made-up grains from a random Voronoi pattern at 0.5 µm per pixel."
  - "An image you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Micrograph" }
  - { icon: ruler, label: "Scale" }
  - { icon: pointer, label: "Lines" }
  - { icon: sigma, label: "ℓ and G" }
---

## What it does

The line-intercept method (Heyn's method) measures grain size by laying straight lines or circles over a polished and etched section and counting how many grain boundaries they cross. The mean lineal intercept ℓ is the total length of the lines divided by the number of boundary crossings. It is the average length of line that falls inside one grain, and from it the **ASTM grain size number G** follows by the ASTM E112 relation

G = −6.6457 log₁₀(ℓ in mm) − 3.298.

A bigger G means finer grains; each step of 1 in G makes ℓ about 0.71 times as long.

This page does the counting for you:

- **Test lines.** Evenly spaced horizontal lines, vertical lines, both (good for grains that are a little elongated, since the two directions are averaged), or three concentric circles with radii in the ratio 3 : 2 : 1, which cross the structure in every direction.
- **Boundary finding.** The grey level along each line is read pixel by pixel. With *dark lines* each run of pixels at or below the threshold is one boundary (the usual etched look); *light lines* is the opposite; *a change of shade* counts a boundary wherever the shade steps by more than the threshold per pixel, for colour-etched or EBSD-like images with no boundary lines. The automatic threshold is Otsu's method.
- **Your corrections.** Tap a test line where a boundary was missed to add a green mark, or tap a mark (a twin boundary, a scratch, a spot of dirt) to remove it.
- **Statistics.** Each line gives its own crossings per unit length. The spread between lines gives a Student-t confidence interval and the relative accuracy (%RA) in the way ASTM E112 treats fields; about 10 % or better is usually enough.

## How to use it

1. **Open the micrograph** (PNG, JPEG or TIFF straight from the microscope).
2. **Calibrate.** Tap *Draw on the scale bar*, then tap both of its ends (or drag along it) and type the length written on it. If you know the pixel size from the microscope, type it instead.
3. **Set the area** with two taps so the scale bar and any data strip are left out.
4. **Choose the lines** and how the boundaries look. Check the orange marks on the image: they should sit on the boundaries.
5. **Fix the marks** by tapping. Then read ℓ, G and the interval, and download the table, the marks or a report.

## Worked example

The example is a made-up structure at 0.5 µm per pixel (the 100-pixel scale bar is 50 µm), with the data strip at the bottom left out of the area. With 5 horizontal and 5 vertical lines, dark boundaries and the automatic threshold of 71, the page counts 179.5 boundaries over 2.945 mm of line (two boundaries are cut by line ends and count ½), so

- ℓ = 2945 µm ÷ 179.5 = **16.41 µm**, and
- G = −6.6457 log₁₀(0.01641) − 3.298 = **8.56**.

The 95 % interval on ℓ is 15.62 to 17.28 µm (G 8.41 to 8.71), a relative accuracy of 5.1 %. Switch to three circles and the same image gives ℓ = 16.31 µm and G = 8.58, but only 3 lines, so a much wider interval. The made-up grains come from a random Voronoi pattern of 260 grains in 720 × 540 pixels, whose expected intercept is π ÷ (4 √density) ≈ 30.4 px = 15.2 µm; the count reads a few per cent high because boundaries two pixels wide merge near grain corners, which is why tapping to fix marks matters.

## Tips

- Use enough lines to cross at least 50 boundaries per field, and measure several fields of the specimen: one image only describes one place.
- Twin boundaries inside grains are not grain boundaries for most purposes; remove their marks with a tap.
- Where a line runs through a triple point the standard counts 1½ or 2; the automatic count gives 1, so tap to add a mark if you need it.
- A boundary cut by the end of a straight line counts ½ (hollow orange circle).
- Boundaries closer than the *join* distance count as one, which helps with noisy boundary lines but merges real boundaries near grain corners. Set it to 0 or 1 for clean images and check the marks.

## FAQ

**Is G the same as the planimetric (Jeffries) G?** For equiaxed grains the two methods agree to within about a quarter of a G number, but they are different measurements; report which one you used.

**Why does the result say "calibrate for G"?** G needs ℓ in millimetres. Without a scale the page gives ℓ in pixels.

**Does my image leave the computer?** No. It is read and measured inside this page and is never uploaded or stored.
