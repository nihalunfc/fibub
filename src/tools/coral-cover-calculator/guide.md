---
name: Coral cover point count
num: 332
shelf: science
section: marine-and-freshwater-biology
title: "Coral cover calculator: photo quadrat random point count (CPCe-style)"
summary: "Place random, stratified random or grid points on reef quadrat photos, label each point with a category from your own list, and get percent cover per category pooled over all photos, with binomial confidence intervals, a per-photo table and CSV. Photos stay in your browser."
status: live
ads: false
order: 332
icon: target
works: offline
updated: 2026-11-09
related: [biodiversity-indices, field-sampling-planner, sample-size]
sources:
  - "Random point counts on photo quadrats as in Kohler, K. E. and Gill, S. M. (2006) Coral Point Count with Excel extensions (CPCe). Computers & Geosciences 32, 1259–1269. fibub's page is independent and uses none of CPCe's code or files."
  - "Wilson, E. B. (1927) Probable inference, the law of succession, and statistical inference. Journal of the American Statistical Association 22, 209–212 (the interval), checked in the tests against statsmodels 0.15 proportion_confint(method='wilson') to 1e-6."
  - "Point layouts (simple random, stratified random with one point per cell, regular grid) use a seeded random number generator (mulberry32), so the same seed gives the same points."
  - "The two example quadrats are drawn by the page from made-up shapes, and their points are labelled from the drawing."
  - "Photos you open are read on the page only. They are never uploaded or stored."
flow:
  - { icon: image, label: "Photos" }
  - { icon: target, label: "Points" }
  - { icon: pointer, label: "Label" }
  - { icon: table, label: "Cover" }
---

## What it does

Reef and benthic surveys often estimate cover by photographing quadrats along a transect and identifying what lies under a set of points on each photo, the method made popular by the program CPCe. This page does the same in your browser:

- **Points.** Each photo gets points laid out as *stratified random* (the photo is split into rows × columns and one point falls at random in each cell), *simple random* (n points anywhere) or a *regular grid* (cell centres). A border can be kept clear of the frame.
- **Labels.** You pick a point and tap its category. Categories are your own list, one per line; the first nine also have number keys.
- **Cover.** Cover of a category = its points ÷ all counted points × 100, pooled over every photo, with a Wilson binomial confidence interval. Categories such as shadow, tape or "can't tell" can be left out of the total. A second table gives each photo's own cover.

The photos stay on your device; nothing is uploaded.

## How to use it

1. **Photos.** Set the point layout, then press *Add photos* and choose one or several quadrat photos.
2. **Points.** Check the points on the first photo. *Place points again* gives that photo a fresh layout from the current settings.
3. **Label.** The highlighted point is circled. Tap its category (or press its number); the page jumps to the next unlabelled point. Tap any point on the photo to go back to it. Switch photos with the *Photo* list.
4. **Cover.** Read the tables as you go, and download the cover table, every point, or a report.

## What each option does

- **Points per photo / rows and columns.** More points narrow the interval. 25 to 50 per photo are common; the number of photos matters as much as the points per photo.
- **Border left clear.** Keeps points off the quadrat frame and the photo's edge.
- **Random seed.** Photo 1 uses the seed, photo 2 the seed + 1 and so on, so you or a colleague can recreate exactly the same points.
- **Left out of cover.** Points with these labels are not counted in the total, so cover is of the visible seabed.
- **Interval.** 90, 95 or 99 % Wilson interval. It treats every point as independent, which is optimistic when points on one photo are alike; for a transect, the spread of the per-photo covers is the more honest error.

## Worked example

The example has two made-up quadrats with 5 × 5 stratified random points each (seeds 1 and 2), already labelled from the drawing. One point falls on the tape and is left out, leaving 49 counted points. The page shows **Sand: 53.1 % (95 % CI 39.4 to 66.3 %)** as the largest category, and hard coral at **26.5 %** (13 of 49 points, 95 % CI 16.2 to 40.3 %), algae 14.3 % and rubble 6.1 %. Soft coral was missed by every point: 0 %, but with an upper limit of 7.3 %, a reminder that 50 points cannot rule out a rare category.

## Tips

- Photograph every quadrat from the same height, straight down, and include the frame so you can crop to it.
- Decide the category list and the rules for hard cases (bleached coral, turf on dead coral) before you start, and keep them for the whole survey.
- Stratified random points spread out more evenly than simple random ones and usually give a slightly more precise cover for the same work.
- Report the number of photos, points per photo and the layout with your cover values.

## FAQ

**Can I use it for seagrass, kelp, rocky shores or plant quadrats?** Yes. Type any categories; the method is the same for any photo quadrat.

**Are my labels saved?** Only on this page while it is open. Download the point CSV to keep your work.

**Why does cover come with an interval?** Points are a sample of the photo. With 50 points, a true cover of 25 % will often read anywhere from about 15 to 40 %.
