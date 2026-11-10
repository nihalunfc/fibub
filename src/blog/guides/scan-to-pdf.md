---
title: "How to scan documents with your phone camera and save them as a PDF"
summary: "Photograph paper, set the four corners, flatten the page and clean up shadows, then save every page as one PDF on your device. How the straightening and clean-up work, with numbers."
tools: [scan-to-pdf, compress-file, organise-pdf, ocr]
updated: 2026-11-10
sources:
  - "Perspective correction with a homography (a mapping between two four-cornered shapes) and Otsu's method for picking a brightness threshold (Otsu, 1979, IEEE Trans. Systems, Man and Cybernetics 9: 62-66) are standard image processing methods, explained in fibub's own words."
  - "Page sizes: A4 is 210 × 297 mm (595.28 × 841.89 points); US Letter is 8.5 × 11 in (612 × 792 points). One point is 1/72 inch."
---

You do not need a scanner to send a signed form, a receipt or a school certificate as a PDF. The [[scan-to-pdf]] tool takes photos from your phone camera or your files, finds the edges of the paper, flattens the page as if seen from straight above, cleans up the background and saves all the pages as one PDF. The photos stay on your device the whole time. Afterwards, shrink the file with [[compress-file]], move or merge pages with [[organise-pdf]], or turn the picture of the text into typed text with [[ocr]].

## What it is

A photo of a page taken by hand is never quite square. The near edge looks wider than the far edge, and the page is a slanted four-sided shape instead of a rectangle. Three steps fix that.

**1. Finding the page.** The tool shrinks the photo to 200 pixels on its long side and turns it grey. It then picks a brightness cut-off with **Otsu's method**, which chooses the level that best splits the pixels into a dark group and a bright group. The largest joined patch of bright pixels is taken to be the paper, and its four outermost points become the corners. If that patch covers less than 15% of the photo, the tool gives up and puts the corners just inside the photo's edges for you to drag.

**2. Flattening.** A **homography** is a formula that maps any four-cornered shape onto any other. The tool works one out from your four corners to a plain rectangle, then fills each pixel of the flat page by looking up where it came from in the photo. The flat page's sides are the average lengths of the opposite sides in the photo, capped at 1,800 pixels on the long side.

**3. Cleaning up.** Each look treats brightness differently:

- **Original** keeps the photo's colours.
- **Grey** drops colour.
- **Black and white** compares each pixel with the average brightness of a square around it (about 1/16 of the page's short side in each direction). A pixel darker than 88% of that local average turns black; everything else turns white. Because the comparison is local, a shadow across one corner does not swallow the text.
- **Whiten background** multiplies each pixel by 245 ÷ (local average), so plain paper lands near white while coloured ink and stamps keep their colour.

## How to use it

1. Press **Take a photo** on a phone, or **Add images** to choose pictures you already have. You can add several at once.
2. On the left, drag the four round corners onto the paper's corners. The flattened result shows beside it (below it on a phone). **Find page edges** tries the automatic search again; **Use whole photo** keeps the photo as it is, uncropped.
3. Press **Turn page** if the flat page is on its side.
4. Choose a **Look** and a **Page size** (A4, Letter or **Fit the page**). These apply to every page in the set.
5. Add the next sheet the same way. In the strip of small pages, tap one to edit it, use the arrows to move it and the cross to remove it.
6. Press **Download PDF**. The file is saved as `scan.pdf`.

## A worked example

You photograph a one-page A4 lease form on a dark wooden table with a phone that takes 3,024 × 4,032 pixel photos.

1. The tool first scales the photo so its long side is at most 2,400 pixels: it becomes **1,800 × 2,400 pixels**.
2. Edge finding outlines the sheet. One corner has caught a shadow, so you drag it out to the real corner. In the photo the page now measures about 1,500 pixels across and 2,120 pixels down.
3. The flat page would be 1,500 × 2,120, but its long side is capped at 1,800, so it is scaled by 1,800 ÷ 2,120 ≈ 0.849 to **1,274 × 1,800 pixels**.
4. You pick **Black and white**. The local square reaches 1,274 ÷ 16 ≈ **80 pixels** each way. Where the paper around a letter averages a brightness of 180, any pixel darker than 0.88 × 180 = **158** turns black.
5. With **A4**, the tool keeps a 12-point margin on each side and scales the picture to fit: the smaller of (595.28 − 24) ÷ 1,274 and (841.89 − 24) ÷ 1,800 is about **0.448**. The page picture is drawn about 571 × 807 points, or roughly **202 × 285 mm**, which works out to about **161 dots per inch**, sharp enough to read and print.

If you had chosen **Whiten background**, a patch of paper at brightness 180 would be lifted by 245 ÷ 180 ≈ 1.36 to **245**, while dark ink at 60 would only rise to about **82**: the paper whitens and the writing stays dark.

## Where it is used

- **Forms and contracts.** Return a signed form by email the same day.
- **Expenses.** Keep receipts as one PDF per trip for a claim.
- **School and university.** Hand in handwritten homework or lab notebook pages where a PDF upload is required.

## Common mistakes

- **Shooting white paper on a white desk.** The page and the table look the same, so edge finding cannot see the sheet. Use a darker surface, or drag the corners yourself.
- **Choosing Black and white for photos or colour stamps.** Pictures turn into hard black blobs. Use **Whiten background** for pages with colour or photos.
- **Expecting searchable text.** The PDF holds pictures of the pages. Run it through a text reader if you need to copy words out.

## Questions people ask

**How many pages can I add?** As many as your device's memory allows. Each page is held as a picture until you save, so very long sets may slow down an older phone.

**Why does the flat page look stretched?** One of the corners is in the wrong place. Drag each corner onto the very tip of the paper and the proportions come back.
