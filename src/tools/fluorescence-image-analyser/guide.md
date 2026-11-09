---
name: Fluorescence image analyser
num: 191
shelf: science
section: cell-biology-and-cell-culture
title: "Fluorescence image analyser: count nuclei and measure area and intensity in a microscope image"
summary: "Open a fluorescence microscope image, pick the channel, take away the background, set a threshold and split touching nuclei. Get the count, each object's area, mean and integrated intensity, a histogram, an outlined and numbered overlay, a CSV and a report. The image stays in your browser."
status: live
ads: false
order: 13
icon: image
works: offline
updated: 2026-11-09
related: [gel-densitometry, hemocytometer, fcs-viewer, transfection-planner, calcium-imaging-dff, particle-size-image, cell-doubling-time]
sources:
  - "Rolling-ball background (done exactly as a grey-scale opening with a paraboloid), Otsu and triangle thresholds, hole filling, 8-connected labelling, the distance map and the watershed are written by fibub and checked in the tests against SciPy and scikit-image."
  - "Otsu, N. (1979) and Zack, Rogers and Latt (1977) for the two automatic thresholds; Felzenszwalb and Huttenlocher (2012) for the distance transform. Methods only, no numbers are copied."
  - "The example image is drawn by the page from 30 made-up nuclei (3 touching pairs, 8 also green, 1 with a dark nucleolus) and 3 specks of dust, and the tests check that the page counts 30."
  - "An image you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: image, label: "Image" }
  - { icon: sliders, label: "Settings" }
  - { icon: target, label: "Count" }
  - { icon: table, label: "Measure" }
---

## What it does

Counting nuclei and measuring how bright they are is one of the most common jobs with a fluorescence microscope. The usual tool is ImageJ or Fiji with a short recipe: pick the channel, subtract the background, threshold, fill holes, watershed, analyse particles. This page runs the same recipe inside your browser, with nothing to install:

- **Channel.** Blue for DAPI or Hoechst, green for GFP or FITC, red for mCherry or Texas Red, or grey (all colours mixed). For a stained bright-field image, choose *Dark on light* and the page flips it.
- **Background.** The *rolling ball* rolls a ball of the chosen radius under the image and takes away the surface it traces, which removes uneven illumination but keeps anything narrower than the ball. *Constant level* takes away one number (automatic: the most common grey level). *None* measures raw values.
- **Threshold.** *Otsu* splits the histogram into two groups as cleanly as possible and suits bright, clear nuclei. *Triangle* suits images that are mostly dark background with dim objects, and keeps more of each object's faint edge. Or type your own level.
- **Fill holes and split.** Fill holes closes dark spots (such as nucleoli) inside a nucleus. *Split touching nuclei* uses a distance map and a watershed: two round nuclei joined at a narrow waist are cut there.
- **Size limits.** Objects smaller than the smallest size (dust, debris) or bigger than the largest (clumps) are left out of the count. You can also leave out objects cut off by the edge of the image.
- **Measurements.** For every object: centre, area (in µm² if you give the pixel size), mean, integrated (sum) and maximum intensity after background. A log-scale histogram shows where the threshold falls.

For bands on a gel or blot rather than cells, use [[gel-densitometry|gel and western blot densitometry]]; to count cells by hand, the [[hemocytometer]].

## How to use it

1. **Image.** Open the original image from the microscope (a PNG or JPEG export is fine; a TIFF works if your browser can show it). Avoid screenshots and do not change contrast first. Large images are scaled to 1000 px on the long side.
2. **Settings.** Pick the channel, then check the yellow outlines over the image. Use *Show* to view the chosen channel in grey or the threshold mask.
3. **Count.** Read the number of objects. If touching nuclei are counted as one, tick *Split touching nuclei*; if dust is counted, raise *Smallest object*.
4. **Measure.** Read the table, then download the objects CSV, the overlay as a PNG, or a PNG, PDF or Word report.

## Worked example

The example is a made-up image, 400 × 300 px, drawn by the page: 30 blue nuclei on a background that gets brighter to the right, with a little noise. Three pairs of nuclei touch, 8 nuclei are also green, one has a dark nucleolus, and there are 3 tiny specks of dust.

With the default settings (blue channel, rolling ball of 50 px, Otsu, fill holes, split touching nuclei, smallest object 50 px) the page finds **30 objects** with a threshold of 67. The mean area is 281.8 px, the objects cover 7.04 % of the image, the mean intensity is 127 and the 3 specks are left out. Object 1, top left, is 254 px with a mean of 90.6.

Untick *Split touching nuclei* and the count drops to **27**, because each touching pair is counted once. Switch to the triangle threshold and the count stays at 30, but the threshold drops to 14 and the mean area grows to 411.1 px, since the dim edges are now included. Choose the green channel and the page finds the **8** green nuclei.

## Tips

- Take every image you compare with the same exposure, gain and objective, and keep the brightest nuclei below the top of the range (255).
- Make the ball radius larger than the biggest nucleus, or the middle of large nuclei is taken away as background.
- Check the outlines. Nuclei that are cut in two by the watershed are usually elongated or lobed; untick the split for those images.
- Intensities are on the 0 to 255 scale of the image file. Only compare them between images taken the same way.

## FAQ

**Does my image get uploaded?** No. It is read and analysed on this page only and is never sent or stored.

**Why does the count differ a little from ImageJ?** The steps are the same, but ImageJ shrinks the image for its rolling ball and draws one-pixel lines between split nuclei. Counts usually agree; areas can differ by a few pixels.

**Can I use 16-bit images?** Browsers read images as 8-bit, so a 16-bit TIFF is shown with 256 levels at most. Export an 8-bit copy with the same display range for every image you compare.

**What is integrated intensity?** The sum of the pixel values over the object, which is the mean times the area. It follows the total amount of stain, for example DNA content per nucleus.
