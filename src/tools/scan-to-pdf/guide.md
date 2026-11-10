---
name: Scan to PDF
num: 1708
shelf: documents
section: images-scans
title: "Scan to PDF: turn phone photos of paper into a clean PDF, free"
summary: "Photograph a page, let the tool find its edges, straighten it, clean it up and save one or many pages as a PDF. Nothing leaves your device."
status: live
ads: false
order: 1708
icon: camera
works: offline
updated: 2026-11-10
related: [compress-file, organise-pdf, file-converter, sign-pdf]
sources:
  - "Page flattening, edge finding and clean-up filters are fibub's own code (homography and local-average thresholding). PDF made with pdf-lib (open source)."
flow:
  - { icon: camera, label: "Photo" }
  - { icon: crop, label: "Corners" }
  - { icon: sliders, label: "Clean up" }
  - { icon: download, label: "PDF" }
---

## What it does

Scan to PDF turns a photo of paper into a flat, tidy page. You take a picture with your phone camera (or add pictures you already have), the tool looks for the page edges, and you can drag four corners to fix them. It then straightens the page as if you had looked at it from straight above, and cleans up the shadows.

Add as many pages as you need and save them as one PDF. Everything runs in your browser; the pictures are never uploaded. After saving, shrink the file with [[compress-file]], reorder pages with [[organise-pdf]], or change formats with [[file-converter]].

## How to use it

1. Press **Take a photo** on a phone, or **Add images** to pick files. Put the page on a darker table for the best edge finding.
2. Drag the four round corners onto the corners of the page. **Find page edges** tries again by itself; **Use whole photo** skips straightening.
3. Pick a look and a page size. Add more pages the same way; use the arrows to reorder and the cross to delete.
4. Press **Download PDF**.

## What each setting does

- **Original**: keeps the colours as photographed.
- **Grey**: removes colour, which makes smaller files.
- **Black and white**: compares each spot with its surroundings, so text stays black even in uneven light.
- **Whiten background**: lifts shadows and grey paper to white but keeps colour ink and stamps.
- **Page size**: A4 or Letter put the scan on a standard page with a small margin; Fit the page makes each PDF page the shape of the scan.
- **Turn page**: rotates the page a quarter turn.

## Worked example

You photograph a 2-page rental form on a dark desk. The tool outlines each sheet; you nudge one corner that caught a shadow. Choose Black and white and A4, add the second sheet, and press Download: you get a 2-page A4 PDF.

## FAQs

**Why are the edges wrong?** Edge finding looks for the largest bright shape. A white table or a cluttered background confuses it, so drag the corners by hand.

**Why is the file big?** Colour photos are large. Choose Grey or Black and white, then use compress-file.

**Is the text searchable?** No. The PDF holds pictures of the pages, not typed text.

**Is it stored anywhere?** No. Close the tab and it is gone.
