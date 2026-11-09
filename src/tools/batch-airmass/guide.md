---
name: Batch airmass planner
num: 833
shelf: science
section: research
title: "Batch airmass calculator: altitude, airmass, transit and Moon distance for a whole target list"
summary: "Paste or open a list of targets (name, RA, Dec), pick your site and night, and get each target's transit, best time, lowest airmass, hours below an airmass limit and distance from the Moon, in a sortable table with one altitude chart and CSV downloads. Choose the airmass formula: sec z, Hardie, Kasten and Young, or Pickering."
status: live
ads: true
order: 833
icon: telescope
works: offline
updated: 2026-11-09
related: [object-altitude, sky-coordinates, astro-time, sky-tonight, dark-sky-calendar]
sources:
  - "Positions from the astronomy-engine library (MIT licence) with annual aberration added by fibub, checked against astropy's AltAz frame to within 2 arcseconds."
  - "Airmass formulas: Hardie, R. H. 1962, in Astronomical Techniques (ed. W. A. Hiltner), p. 184; Kasten, F. and Young, A. T. 1989, Applied Optics 28, 4735; Pickering, K. A. 2002, DIO 12, 3. Formulas only; no tables are copied."
  - "The example list uses rounded positions of well-known objects; type your own."
flow:
  - { icon: table, label: "Targets" }
  - { icon: calendar, label: "Site, night" }
  - { icon: telescope, label: "Airmass" }
  - { icon: download, label: "CSV" }
---
## What it does

Planning a night of observing, or a proposal, starts with a target list and one question: when is each target high enough? This page takes a whole list at once. For each target, inside the span of the night you choose, it works out:

- **Transit**: when the target crosses the meridian (its hour angle is zero), and how high it is then.
- **Best time** and **maximum altitude** inside the span, and the **lowest airmass**.
- **Time at or below the airmass limit**, and the first and last moments it is that high.
- **The Moon's distance** from the target at its best time, and the closest it comes during the span.

The results are a table you can sort by any column, an altitude chart of up to ten targets with the night shaded by the Sun's height, a step-by-step table of altitude and airmass, and two CSV files.

## Airmass formulas

Airmass X is the path length through the atmosphere compared with straight up. The page offers four formulas:

- **sec z**: a flat (plane-parallel) atmosphere, X = 1 / cos z. Fine above about 30°, too large near the horizon.
- **Hardie (1962)**: a polynomial in sec z − 1, the classic choice for photometry, usable to about z = 85°.
- **Kasten and Young (1989)**: X = 1 / [cos z + 0.50572 (96.07995° − z)^−1.6364], about 38 at the horizon (the default).
- **Pickering (2002)**: X = 1 / sin(h + 244 / (165 + 47 h^1.1)), written for the apparent altitude h, about 38.75 at the horizon.

Above 30° they agree to better than 0.01. Tick "apparent altitude" to apply standard refraction first (the default); untick it to use the true, airless altitude. The difference only matters below about 15°.

## How to use it

1. Set your place and the night in the bar at the top (times are shown in your chosen time zone).
2. Paste the targets or open a CSV or Excel file: name, RA, Dec in J2000. Sexagesimal RA is hours; a plain decimal RA is degrees unless you tick "Decimal RA is in hours".
3. Choose the span (dark time by default), the table step, the formula and the airmass limit.
4. Sort the table by tapping a column, and download the summary or the step-by-step CSV.

## Worked example

Load the example list, set the place to Toronto (43.65°, −79.38°) and the night of 14 January 2026, and choose "Sunset to sunrise". The Orion Nebula (05 35 17, −05 23 28) transits at about 22:15 local time (03:15:43 UTC) at 41.0°. With Kasten and Young, an airmass limit of 2 is 29.90° up, and the target spends about 5 h 08 min at airmass 2 or better. The Moon, a thin crescent, is about 145° away.

## Tips

- An airmass limit of 1.5 (about 42° up) is a common choice for spectroscopy; 2 (30°) for imaging.
- The span "Dark" ends at astronomical twilight; high-latitude summer nights may have none, so pick nautical twilight or your own times.
- For many targets, a longer table step keeps the step table small; transit, best time and hours are always found to the minute or better.

## FAQ

**How accurate are the positions?** Within about 2 arcseconds of astropy for fixed stars, enough for planning. Proper motion is ignored, so for fast-moving stars use positions for the current epoch.

**Does it know the horizon at my site?** No; use the object altitude tool to draw your own horizon.

**Is my target list sent anywhere?** No. It is read and worked out in your browser.
