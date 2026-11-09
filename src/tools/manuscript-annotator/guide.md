---
name: "Manuscript image annotator"
num: 416
shelf: science
section: digital-humanities
title: "Manuscript image annotator: draw regions, transcribe and export W3C Web Annotations (IIIF-ready)"
summary: "Open photos or scans of a manuscript from your device, draw rectangles and polygons on lines, words or damage, type a transcription and a note for each, and export them as W3C Web Annotation JSON or CSV. Reads a local IIIF manifest. Nothing is uploaded."
status: live
ads: false
order: 416
icon: image
works: offline
updated: 2026-11-09
related: [graph-digitizer, image-resizer, stylometry-delta, colour-difference-calculator, historic-calendar-converter, correspondence-network, topic-modeller, artefact-scale-tool, light-exposure-budget]
sources:
  - "Formats: W3C Web Annotation Data Model (W3C Recommendation, 23 February 2017), W3C Media Fragments URI 1.0 (xywh=), IIIF Presentation API 2.1 and 3.0."
  - "Checked by round trips in tests (export then re-import gives the same regions, including scaling to IIIF canvas pixels, quotes, line breaks and special characters) and by reading annotations written in other common shapes (#xywh targets, SVG rect and path selectors, IIIF 2 annotation lists)."
  - "The example page is drawn by the tool; its text is made up."
flow:
  - { icon: image, label: "Open image" }
  - { icon: pointer, label: "Draw region" }
  - { icon: pencil, label: "Transcribe" }
  - { icon: download, label: "Export" }
---

## What it does

Transcribing a manuscript, a charter or an account book usually means linking each piece of text to the place on the page where it is written. This annotator lets you do that in your browser:

- **Open images** of pages from your device: photos, scans, or images you have downloaded from a library's IIIF viewer.
- **Draw regions**: rectangles for lines and words, polygons for marginal notes, decorations, stains or tears.
- **Transcribe and annotate**: each region gets its own transcription and a note.
- **Export** everything as a W3C Web Annotation page (JSON-LD), the format IIIF viewers such as Mirador use, or as a CSV table for a spreadsheet.
- **Re-open** an exported file later to keep working, or open annotations made elsewhere.

Your images and transcriptions never leave your device. The page does not fetch anything, not even the images a manifest points to.

Convert any old dates you find with the [[historic-calendar-converter|historic calendar converter]], and compare the style of the texts with [[stylometry-delta|stylometry]].

## How to use it

1. Press **Open images** and pick one or more page images. Choose which one to work on in the **Image** list.
2. Optional: press **Open a IIIF manifest** and pick a manifest .json file you have saved. Each image is linked to a canvas, first by file name (for example, `f1r.jpg` matches a canvas whose image ends in `f1r.jpg`), then in order. You can change the link in the **IIIF canvas** list. With a canvas, exported coordinates are scaled to the canvas size and the annotation targets the canvas, so it can be shown on top of the library's own image.
3. Choose **Rectangle** and drag across the image, or **Polygon** and tap each corner, then tap the first point or press **Finish polygon**. Esc or **Cancel** drops an unfinished polygon; **Undo point** removes the last corner.
4. Type the **Transcription** and a **Note** in the region's box. Tap a region's title to highlight it on the image.
5. Use **Zoom** for small script; the image scrolls inside its frame.
6. Press **Export Web Annotation (JSON)** to save your work, or **Export CSV**. Annotations are not kept when you close the page, so export before you leave.

## Worked example

Press **Use the example**. The page draws a made-up account page, 900 × 1200 pixels, with three regions already in place:

1. a rectangle on the heading at 120, 110, size 660 × 70 px, transcribed "Accompt of the Mill at Ashford", with the note "Heading, larger hand.";
2. a rectangle on the first entry, "Item rec. of Thomas Hale for grinding ij s";
3. a five-point polygon around the stain in the lower margin, with only a note.

The JSON export of the first region has the target selector `xywh=120,110,660,70`, a "transcribing" body and a "commenting" body. The CSV has one row per region with the bounding box, the polygon points, the transcription and the note.

## FAQ

**Which annotation files can it open?** Web Annotation pages and collections, single annotations, and IIIF 2 annotation lists, with rectangles given as `xywh=` in pixels or shapes as SVG polygons, rectangles or straight-line paths. Circles, curves and percentage coordinates are skipped and counted.

**Can I load images straight from a IIIF server?** No, on purpose: this tool never connects to other sites. Save the images first (many viewers have a download button), then open them here.

**Are my images uploaded?** No. Everything stays in your browser.
