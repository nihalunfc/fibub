---
name: Flow cytometry FCS viewer
num: 192
shelf: science
section: cell-biology-and-cell-culture
title: "Flow cytometry FCS file viewer: density plots, histograms, nested gates and percentages"
summary: "Open an FCS 2.0, 3.0 or 3.1 file from any flow cytometer, compensate it with its own spillover matrix, plot any two channels on linear, log or arcsinh axes, and tap the plot to draw rectangle, polygon, quadrant and range gates inside each other. Counts and percentages update at once; download gate stats and gated events as CSV. The file stays in your browser."
status: live
ads: false
order: 14
icon: chart
works: offline
updated: 2026-11-09
related: [hemocytometer, plate-layout, plot-maker, gel-densitometry]
sources:
  - "File reading follows the FCS 3.1 data file standard (International Society for Advancement of Cytometry): HEADER, TEXT and DATA segments, $PnB, $PnR, $PnE, $BYTEORD, $DATATYPE and $SPILLOVER. The code is written by fibub."
  - "Reading, compensation, arcsinh scales, binning and gating are checked in the tests against FlowIO (an independent Python FCS reader), NumPy and matplotlib on test files built byte by byte."
  - "The example sample is made up by the page from invented populations (12 % debris; of the cells 50 % unstained, 25 % marker A only, 10 % both, 15 % marker B only) with an invented spillover of 15 % FITC into PE. It is not real data."
  - "An FCS file you open is read on this page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "Open FCS" }
  - { icon: chart, label: "Plot" }
  - { icon: target, label: "Gate" }
  - { icon: table, label: "Percentages" }
---

## What it does

A flow cytometer measures thousands of single cells, one after another, and saves every event in an FCS file. This page opens that file in your browser and lets you do the first steps of an analysis without installing anything:

- **Read the file.** FCS 2.0, 3.0 and 3.1 list-mode files (and FCS 3.2 files whose channels share one data type): integer data of 8 to 32 bits (with the bit mask from $PnR and log amplification from $PnE for older instruments), 32-bit and 64-bit floats, ASCII data, either byte order, and the supplemental TEXT segment. Every keyword in the file is listed under *Channels and all keywords*.
- **Compensate.** When the file carries a spillover matrix ($SPILLOVER, SPILL or $SPILL), the values are compensated: each event's row of fluorescence values is multiplied by the inverse of the matrix. Untick the box to see the values as recorded.
- **Plot.** A density plot of any two channels, coloured by how many events fall on each spot, or a histogram of one channel. Each channel has its own scale: *Linear* for scatter, *Log* for old log-amplified data, and *Arcsinh* for fluorescence. Arcsinh(value ÷ cofactor) behaves like a log scale for bright events but stays linear around zero, so negative values after compensation are shown rather than piled on the axis. A cofactor of about 150 suits most flow cytometers; mass cytometry data usually uses 5.
- **Gate.** Press *Rectangle gate*, *Polygon gate* or *Quadrants* and tap the plot; on a histogram, press *Range gate* and tap the two ends. Each new gate goes inside the population shown in *Show events in*, so gates can be nested as deep as you like.
- **Count.** The table lists every gate with its events, the percentage of its parent and the percentage of all events. Download the gate stats (with the median and mean of every channel inside each gate), the events in the shown gate, or a PNG, PDF or Word report.

## How to use it

1. **Open an FCS file**, or keep the example. Check the facts: the number of events, channels and whether a spillover matrix was found.
2. **Plot.** Pick the X and Y channels and their scales. Start with forward against side scatter on linear axes.
3. **Gate.** Draw a gate around the cells, choose it in *Show events in*, switch to the fluorescence channels and draw the next gate inside it. Rename gates in the table; *Show* opens a gate's population and *Delete* removes a gate with the gates inside it.
4. **Read and download** the percentages.

## Worked example

The example is a made-up sample of 20,000 events with three gates already drawn. *Cells* is a polygon on FSC-A against SSC-A and holds **17,540 events, 87.70 %** of all events. Inside it, *Marker A+* is a range on FITC-A from 1,500 upwards: **6,144 events, 35.03 % of Cells**. Inside that, *Marker A+ B+* takes events with PE-A above 1,000: **1,754 events, 28.55 % of Marker A+** and 8.77 % of all events.

Now untick *Compensate*. Marker A+ B+ jumps to **4,979 events, 81.04 %**, because 15 % of the bright FITC signal spills into the PE detector and makes marker A cells look PE positive. That is why compensation matters.

Tick the box again, show *Cells* and press *Quadrants*, then tap where FITC-A is 1,500 and PE-A is 1,000. The four quadrants come out close to the made-up mix: about 50 % with neither marker, 25 % marker A only, 10 % both and 15 % marker B only.

## Tips

- Gate out debris and doublets first (FSC-A against SSC-A, then FSC-A against FSC-H when your file has it), then look at the markers.
- Use single-stained controls to check the spillover matrix. This page applies the matrix in the file; it cannot build one from controls.
- Gates are kept on the scale they were drawn on. If you change a channel's scale, the gate's outline is redrawn on the new axes but the events inside do not change.

## FAQ

**Is my file uploaded?** No. It is read by your browser on this page. Nothing about it is sent anywhere or kept after you close the page.

**My file will not open.** The page names the problem, such as a file cut short or a histogram-mode file. Files up to 400 MB and 3 million events can be opened. For a file with several data sets (some .lmd files), the first is shown.

**Why are my numbers a little different from FlowJo or FCS Express?** Gates drawn by hand never match exactly, and programs differ in scales and in how they treat events on a gate's edge. Here an event on the edge counts as inside.
