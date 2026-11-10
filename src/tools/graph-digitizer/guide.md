---
name: Graph digitiser
num: 26
shelf: science
code: T26
section: figures-and-data-presentation
title: "Graph digitizer: extract data points from a plot image (free, works offline)"
summary: "Open a picture or screenshot of a graph, mark the axes, then click the points or let it trace a curve by colour. Get the numbers as a table to copy or download. The image never leaves your device."
status: live
ads: false
order: 10
icon: pointer
works: offline
updated: 2026-11-08
related: [plot-maker, calibration-curve, dose-response, image-resizer]
flow:
  - { icon: image, label: "Open image" }
  - { icon: ruler, label: "Set axes" }
  - { icon: pointer, label: "Click points" }
  - { icon: table, label: "Get numbers" }
---

## What it does

Papers, old reports and data sheets often show results only as a graph. This tool turns a picture of the graph back into numbers: x and y values you can paste into a spreadsheet, refit, or compare with your own data. It reads screenshots, scans and phone photos of printed pages. The picture stays on your device: nothing is uploaded.

Once you have the numbers, redraw them with the [[plot-maker]] or fit them with the [[calibration-curve|calibration curve]] tool.

## How to use it

1. **Open the image.** Choose a file, drop it on the box, or paste a screenshot with Ctrl+V (⌘V on a Mac).
2. **Set the axes.** Tap two points on the x axis, ideally labelled ticks far apart, then two on the y axis. Type the value of each. Tick **Log scale** for a logarithmic axis. The axes may be slightly tilted or skewed, as in a phone photo, because each axis gets its own direction.
3. **Get the points**, in one of two ways:
   - **Click points:** tap each data point. On a phone, touch and drag: a magnifier shows exactly where the point will go, and it is placed when you lift your finger. On a computer the magnifier follows the mouse.
   - **Find them by colour:** tap the curve or a marker to pick its colour, choose **A line** or **Separate markers**, and press **Find points**. A line is sampled every few pixels across the plot. Markers are found as separate blobs, and the centre of each is used. Only the area inside your axis points is searched, so the legend and labels are skipped.
4. **Several curves?** Press **Add a series** for each one.
5. **Copy** the table and paste it into Excel or Google Sheets, or **download a CSV** with every series.

Undo removes the last step, whether it was one click or a whole colour search. The **×** next to a row removes that point. **Zoom** to 2× or 4× for crowded plots.

## How accurate is it?

The accuracy depends on the picture. On a clean screenshot, each point is usually within about half a pixel of the line. For a plot 600 pixels wide, that is better than 0.1 % of the axis range. Phone photos add perspective, so keep the camera square to the page and fill the frame. Put the axis points far apart: errors in placing them are divided by the distance between them.

## Worked example

A figure shows enzyme activity against temperature, with x from 0 to 80 °C and y from 0 to 1.2. Tap the 0 and 80 ticks on the x axis and type 0 and 80. Tap the 0 and 1.2 ticks on the y axis and type 0 and 1.2. Then switch to Find by colour, tap the red curve, and press Find points: about 100 points across the curve appear in the table, sorted by temperature. Paste them into the [publication plot maker](/science/plot-maker/) to redraw the figure, or fit them with the [dose-response tool](/science/dose-response/).

## Frequently asked questions

**Is the image uploaded?** No. It is opened inside your browser and never sent anywhere. The tool keeps working offline.

**Which image formats work?** Any format your browser can show: PNG, JPG, GIF, WebP, BMP and usually HEIC on iPhones. For a PDF figure, take a screenshot first.

**Can I use the numbers in my paper?** Data read from someone else's figure is an approximation of their data. Cite the original source, and say that the values were digitised.
