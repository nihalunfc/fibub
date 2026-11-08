---
name: Stereonet plotter
num: 33
shelf: science
section: structural-geology
title: "Stereonet plotter: strike and dip, poles, Fisher mean and rose diagrams (free, online)"
summary: "Plot planes and lines on an equal-area (Schmidt) or equal-angle (Wulff) stereonet. Get great circles, poles, the mean orientation with its 95 % cone and a rose diagram, and download SVG or PNG."
status: live
ads: true
order: 10
icon: compass
works: offline
updated: 2026-11-08
related: [plot-maker, graph-digitizer, uncertainty-calculator]
flow:
  - { icon: table, label: "Strike, dip" }
  - { icon: compass, label: "Stereonet" }
  - { icon: download, label: "SVG / PNG" }
---

## What it does

A stereonet shows the orientation of planes (bedding, joints, foliation, faults) and lines (lineations, fold axes) in three dimensions on a flat circle. This plotter draws them on a lower-hemisphere net, the standard in structural geology, works out the average orientation, and draws a rose diagram. It is made for field courses and quick checks in the field or lab.

## How to use it

1. Type your **planes**, one per line, as **strike and dip** using the right-hand rule, or as **dip direction and dip**. Pick the format at the top.
2. Type any **lines** as **plunge and trend** (for example 35 118), or trend then plunge.
3. Choose an **equal-area (Schmidt)** net for counting and statistics, or **equal-angle (Wulff)** for angle constructions.
4. Show or hide **great circles**, **poles** and the **10° grid**.
5. Read the **mean pole**, the mean plane, and how tightly the data cluster. Download the net as **SVG** for a report, as **PNG**, or the poles as a CSV file.

## The right-hand rule

Face along the strike direction: the plane dips to your right. The dip direction is then the strike plus 90°. A bed striking 030 and dipping 40° to the south-east is written 030 40. If your notebook uses dip direction (120/40 for the same bed), choose "Dip direction, dip". Quadrant notation such as N30E is not read: convert it to azimuths first.

## The statistics

Poles are averaged as vectors, following Fisher (1953). Because a pole and its opposite are the same line, every vector is first turned into the same hemisphere. **R̄** is the length of the mean vector divided by the number of poles: 1 means all identical. **k** is Fisher's concentration: above about 50 is a tight cluster. **α95** is the radius of the 95 % cone of confidence around the mean. When the data form two or more clusters, such as two joint sets, the overall mean means little: plot each set on its own.

## Worked example

The sample holds a set of beds striking about 030 and dipping 40 to 50, a steep joint set striking about 210, a gently dipping bed, and three lineations plunging about 35° to the south-east. The bedding poles cluster in the north-west, the joints plot near the edge of the net, and the lineations sit close to the bedding's great circles. To see the bedding statistics alone, delete the joints and the gentle bed. The mean pole then plunges 47° towards 299, so the mean bedding plane is 029 / 43, with α95 about 7°.

## Frequently asked questions

**Equal area or equal angle?** Use equal area for anything involving counting or density. Equal angle keeps angles and small circles true, which suits textbook constructions.

**Is my field data uploaded?** No. Everything is drawn in your browser and nothing is sent anywhere. The page keeps working offline in the field once it has loaded.

Redraw other data for a report with the [publication plot maker](/science/plot-maker/).
