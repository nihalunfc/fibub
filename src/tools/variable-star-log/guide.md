---
name: Variable star log
num: 77
shelf: science
section: stellar-astrophysics
title: "Variable star observation log: AAVSO visual and extended file maker with light curves"
summary: "Log your variable star estimates or camera magnitudes, see each star's light curve, work out estimates by the step method, and export AAVSO Visual or Extended files ready to upload to WebObs."
status: live
ads: true
order: 22
icon: star
works: offline
updated: 2026-11-08
related: [period-finder, magnitude-flux-converter, observing-log, star-fwhm-checker, image-stacker, transit-light-curve-fitter]
sources:
  - "File formats: the AAVSO Visual and Extended File Format specifications (formats only, no AAVSO data)."
flow:
  - { icon: pencil, label: "Observe" }
  - { icon: curve, label: "Light curve" }
  - { icon: download, label: "AAVSO file" }
---

## What it does

Amateur observers have sent hundreds of millions of variable star measurements to the AAVSO (the American Association of Variable Star Observers), and professionals use them to time outbursts, trigger satellite observations and follow stars over a century. To be accepted, each observation has to be sent in an exact text format. This tool is a notebook that keeps your observations, draws a light curve for each star, and writes those files for you.

- **Visual estimates** follow the AAVSO Visual File Format: star, Julian Date, magnitude (with "<" for "fainter than"), comment codes, the two comparison stars, the chart ID and notes.
- **Camera measurements** (CCD, DSLR or photoelectric) follow the AAVSO Extended File Format, with the error, filter, transformed or not, the comparison and check stars, airmass and chart.
- **Light curves** plot every star you have logged, brighter upwards as astronomers draw them, one marker shape per filter and open markers for "fainter than" limits.

Everything stays on this page. Nothing is uploaded; you send the file to the AAVSO yourself.

## How to use it

1. Pick **Visual estimate** or **Camera**. Type the star's name as the AAVSO knows it (such as SS Cyg, R Leo or Mira), the date and time in **UTC**, and the magnitude. The Julian Date appears as you type. If you looked but could not see the star, tick "Not seen" and give the faintest comparison star you could see.
2. For visual work, add the comparison labels from the chart, the chart ID and any condition codes (B for a bright sky, U for cloud, and so on). For camera work, add the comparison star's AUID and catalogue magnitude, and the check star.
3. Press **Add observation**. Observations appear in the table, newest first, and the light curve updates. Delete a wrong one with its button.
4. Type your observer code and download the **visual** or **extended** file, then upload it at aavso.org through WebObs, "Submit observations", "File upload".

**Work out the magnitude** has two helpers. Between two stars uses Argelander's step method: if the variable is one step fainter than an 11.0 star and two steps brighter than an 11.3 star, it is 11.0 + 0.3 × 1/3 = 11.1. From measured brightness does differential photometry: with the variable at 15,200 counts and a comparison of magnitude 11.034 at 21,800 counts, the variable is 11.034 − 2.5 log₁₀(15,200/21,800) = 11.426. "Use this magnitude" copies the result into the form.

## Worked example

Press **Load an example**. It loads twenty nights of SS Cygni, a dwarf nova that sits near magnitude 12 and every month or two brightens to about 8.3 in a day. The light curve shows the quiet spell, the sudden rise, the slow fade and four green-channel DSLR points on the rise. One night was cloudy, so it is a "fainter than 12.4" limit, drawn as an open marker.

## Keeping your log

Your log lasts until you close the page, unless you tick **Keep my observations in this browser**. Then the list and your observer code are saved only in this browser, on this device, and are here next time. They never leave the device. **Clear all** removes them. You can also download a CSV, and open AAVSO files or a CSV (star, Julian Date, magnitude) to add earlier observations.

## Questions

**Why UTC and Julian Dates?** Observers all over the world add to the same light curves, so times must share one clock. The Julian Date counts days since 4713 BC, so the gap between two observations is a simple subtraction.

**How precise should I be?** Visual estimates are given to 0.1 magnitude, camera magnitudes to 0.001 with their error. Never round the time to the nearest night for fast variables.

**Is this the official format?** The files follow the AAVSO Visual and Extended File Format specifications as published by the AAVSO (checked November 2026). Check the official source if WebObs reports a problem.
