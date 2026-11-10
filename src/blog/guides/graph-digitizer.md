---
title: "How to get numbers out of a graph image (graph digitizing)"
summary: "Turn a picture of a graph into x and y numbers: calibrate the axes, click or trace the points, and copy a table. Includes a worked example and common mistakes."
tools: [graph-digitizer, plot-maker, calibration-curve]
updated: 2026-11-10
sources:
  - "Linear and logarithmic axis calibration from two reference points per axis: standard coordinate geometry, written by fibub."
---

Sometimes the only copy of a result is a picture: a figure in an old report, a chart on a slide, a plot in a scanned paper. The graph digitizer turns that picture back into numbers you can paste into a spreadsheet. It is for students, researchers, engineers and anyone who needs the data behind a plot. Once you have the numbers, you can redraw them with the [[plot-maker]], or fit a line to them with the [[calibration-curve]] tool.

## What it is

A picture knows only pixels: "this dot is 340 pixels from the left and 220 from the top". A graph knows values: "this dot is at 20 seconds and 7.2 mg/L". Digitizing is the translation between the two.

To translate, the tool needs a ruler. You give it two points on each axis, with the value of each point. The tool then works out how many pixels equal one unit. On a straight (linear) axis the rule is:

value = v1 + (p − p1) × (v2 − v1) ÷ (p2 − p1)

Here p is the pixel position you want to convert, p1 and p2 are the two pixel positions you marked, and v1 and v2 are the values you typed for them. On a logarithmic axis the same rule is applied to the logarithm of the value, then turned back with 10 to the power. The x and y rulers are worked out separately, along the line between your own two marks, so a picture that is turned a little still reads correctly.

## How to use it

1. Open the image: choose a file, drop it on the box, or paste a screenshot.
2. Tap two far-apart labelled ticks on the x axis and type their values. Do the same for the y axis. Tick Log scale if an axis is logarithmic.
3. Get the points. Either tap each one (on a phone, drag and watch the magnifier, then lift your finger), or tap the curve to pick its colour and press Find points.
4. For a line, choose how many pixels apart the samples are. For markers, pick the separate-markers shape. Raise the colour tolerance if the curve is faint or the scan is noisy.
5. If the plot has several curves, press Add a series and repeat step 3.
6. Copy the table, or download the CSV file. Use Undo, the cross beside a row, or Zoom for crowded plots.

## A worked example

You have a screenshot of a drug concentration plot. The x axis shows time, with the tick for 0 s at pixel 100 and the tick for 50 s at pixel 700. The y axis shows concentration, with 0 mg/L at pixel 400 and 12 mg/L at pixel 100 (pixel counts go downward, so the tool flips the direction for you).

You tap a point at x pixel 340 and y pixel 220.

- Time: (340 − 100) × 50 ÷ 600 = 20 s.
- Concentration: (400 − 220) × 12 ÷ 300 = 7.2 mg/L.

How good is that? If you are off by half a pixel in x, the error is 0.5 × 50 ÷ 600 = about 0.04 s. That is under 0.1 % of the axis range, which is why far-apart calibration points matter.

Now a log axis. Suppose the x ticks 1 and 100 sit at pixels 100 and 500, so one decade (a factor of 10) is 200 pixels. A point at pixel 300 is one decade along, so x = 10. A point at pixel 400 is 1.5 decades along, so x = 10^1.5 = 31.6.

## Where it is used

- **Research:** pull data from older papers to compare with your own, or to build a meta-analysis. Name the paper you took them from, and make clear the values were read off a picture.
- **Engineering:** read values off a manufacturer's chart, such as a pump or motor curve, when only the picture is given.
- **Medicine and biology:** recover concentration-time or dose-response curves, then fit them with the [[dose-response]] tool.
- **Teaching:** let students rebuild a famous historical graph and test a claim for themselves.
- **Finance and news:** recover the numbers behind a chart in a report so you can check a trend.

## Common mistakes

- **Marking close-together ticks.** A small slip in placing a mark matters less the farther apart the two marks are, so use ticks near both ends of the axis.
- **Forgetting log scale.** On a log axis the value halfway along is not the average of the ends. Tick Log scale whenever the tick labels jump by factors of 10.
- **Typing the wrong tick value.** Re-read the labels, including units like thousands or percentages, before you type.
- **Using an angled or curled photo.** Perspective and a bent page stretch one part of the graph more than another, which a two-point ruler cannot undo. Hold the phone straight above a flat page, or use a screenshot when you can.
- **Treating the result as exact.** A digitised value is an estimate. Report it with fewer digits than the tool shows.

## Questions people ask

**Can it read bar charts?** Yes. Tap the top of each bar. The x axis is then only a label, so calibrate the y axis carefully.

**What if the curve and the gridlines share a colour?** Click the points by hand, or zoom to 4× and pick the colour from a spot that has no gridline under it.

**How many points should I take from a curve?** Enough to follow every bend. For a smooth line, 20 to 50 points usually describe it well. A straight line needs only a handful.
