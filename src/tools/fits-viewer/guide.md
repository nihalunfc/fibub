---
name: FITS viewer and header inspector
shelf: science
section: astrophotography
title: "FITS viewer online: open, stretch and inspect FITS images and headers in your browser"
summary: "Open a FITS image to view it with a proper stretch, read pixel values and sky coordinates, and see its full header. Or drop a whole night's files to list exposure, filter and temperature and total your time per filter. Nothing is uploaded."
status: live
ads: false
order: 64
icon: image
works: offline
updated: 2026-11-07
related: [telescope-calculator, observing-log, sky-coordinates]
flow:
  - { icon: file, label: "Open FITS" }
  - { icon: sliders, label: "Stretch" }
  - { icon: table, label: "Headers" }
  - { icon: download, label: "Save" }
---

## FITS files without installing anything

FITS is the file format astronomy cameras and observatories use. Your phone and computer can't open it, and a raw astro image looks almost completely black until it is **stretched**. This viewer opens FITS files right in your browser: it stretches the image so you can see it, reads pixel values and sky positions, and shows every header card. It never uploads anything, so it is safe for unpublished data.

## How to use it

1. **Choose FITS files** or drop them on the box. `.fits`, `.fit`, `.fts` and gzipped `.fits.gz` all work.
2. **One file** opens as an image:
   - **Stretch** chooses how faint detail is brought up. Asinh suits most deep-sky images, log pulls out very faint nebulosity, and linear shows true brightness.
   - **Black point** and **White point** clip the darkest and brightest pixels (as percentiles), and the histogram shows where they sit.
   - Move over the image to read **pixel values**. If the file has a plate solution (WCS), you also get **RA and Dec** under the cursor.
   - The summary shows key header values (object, exposure, filter, temperature, gain) and the plate scale. **Full header** lists every card, with a filter box.
3. **Several files** are listed by their headers only. Each file's header is read from its first few kilobytes, so even gigabytes of subframes are listed in seconds. You get exposure, filter, sensor temperature, gain and image type for each, plus **total integration time per filter** for your light frames. Click a column to sort, and download the table as CSV for your session log.
4. **Download** the stretched image and its summary as an image, PDF or Word file.

## What's supported

- 8, 16 and 32-bit integer and 32 and 64-bit floating point images, with BZERO and BSCALE applied (so 16-bit camera data shows true values).
- Colour FITS with three planes (RGB) and the first image extension when the main HDU is empty.
- TAN (gnomonic) WCS from CD or CDELT/CROTA/PC keywords, which is what plate solvers like ASTAP and astrometry.net write.
- Tile-compressed (fpack) files are not supported yet. Unpack them with `funpack` first.

## Worked example

Drop 120 light frames and 30 darks from a night on the Heart Nebula. The summary might read: Ha 5 h 0 min (60 frames), OIII 5 h 0 min (60 frames), sensor temperature −10 to −10 °C. The darks are listed but not counted, so you can see straight away that the night is balanced and the cooling held. Open one Ha frame with an asinh stretch to check focus and framing.

## Questions

**How big a file can it open?** Images up to about 100 megapixels open on most computers. Phones may run out of memory above 30 to 40 megapixels. Header-only listing has no practical limit.

**Are my files uploaded?** No. Everything happens in your browser, and the page works offline once it has loaded.
