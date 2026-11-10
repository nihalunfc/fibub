---
title: "How to reduce PDF size for an upload limit (under 2 MB, 500 KB or 200 KB)"
summary: "Turn on Fit an upload limit, pick the size the portal allows, and the PDF is shrunk on your own device. The maths of DPI and page images, with a worked example."
tools: [compress-file, organise-pdf, scan-to-pdf, image-resizer]
updated: 2026-11-10
sources:
  - "A4 is 595 × 842 points (1 point = 1/72 inch), from ISO 216. DPI steps and size limits from fibub's own src/lib/compress/pdf.ts and src/components/Compressor.astro."
  - "File sizes in the example are illustrative; your own file will give its own numbers. Sizes worked with fibub's src/lib/compress/format.ts."
---

To get a PDF under an upload limit, rebuild its pages at a lower resolution until the file fits, but no lower than you need. The [[compress-file|file compressor]] does this in your browser: switch on **Fit an upload limit**, choose the size the portal allows, and press **Compress**. Nothing is uploaded while it works.

## What you need

- **The PDF.** Up to 200 MB on a computer or 50 MB on a phone, because the browser holds the whole file in memory.
- **The exact limit.** Job, visa, college and exam portals say it on the upload page, often as 200 KB, 500 KB, 1 MB or 2 MB.
- **A copy of the original.** The smallest settings turn pages into pictures, so keep the first file in case you need to select or search its text later.

## Step by step

A PDF is mostly big for one reason: pictures. A scanned page is a photo of paper, and a photo's size depends on how many pixels it has. The number of pixels comes from the page size and the DPI (dots per inch):

**pixels across = page width in inches × DPI**
**pixels down = page height in inches × DPI**

PDF pages are measured in points, and 72 points make an inch, so width in inches = points ÷ 72. An A4 page is about 595 × 842 points.

The key idea is that pixel count grows with the **square** of the DPI. Dropping from 150 to 100 DPI keeps (100 ÷ 150)² ≈ 0.44 of the pixels, so each page image holds less than half as much to store. That is why a small change of DPI makes a large change in size.

With the compressor:

1. Choose your PDF, or drop it onto the box. The tool shows its name, size and the type it detected.
2. Turn on the **Fit an upload limit** switch.
3. Tap a size chip (100 KB, 200 KB, 500 KB, 1 MB or 2 MB), or type any number of kilobytes in **Or exactly** (10 KB or more).
4. Press **Compress**. The tool first tries a light repack that keeps the text selectable. If that is still too big, it rebuilds the pages as images, starting at 150 DPI and stepping down.
5. Read the result: the **Before** and **After** sizes and how much smaller the file got. Then press **Download**.
6. If the file cannot fit without a visible drop in quality, the tool stops at the best clean version and says so. You then choose: keep that version, or press **Go below anyway** to accept softer pages.

Without the switch, you pick a level yourself: **Light** (text, links and form fields stay), **Recommended** (pages as images at 150 DPI) or **Smallest** (pages as images at 100 DPI).

## A worked example

Maya scanned a 6-page set of certificates on her phone. The PDF is 4.8 MB, and the college portal allows 2 MB.

First, what does 2 MB mean in bytes? Computers count 1 KB as 1,024 bytes and 1 MB as 1,024 KB, so:

- 2 MB = 2 × 1,024 = 2,048 KB = 2,097,152 bytes.

Spread across 6 pages, each page can use about 2,048 ÷ 6 ≈ 341 KB.

Now the page pictures. For an A4 page:

- At 150 DPI: 595 × 150 ÷ 72 ≈ 1,240 pixels across and 842 × 150 ÷ 72 ≈ 1,754 down, about 2.17 million pixels.
- At 100 DPI: about 826 × 1,169, roughly 0.97 million pixels.

So the 100 DPI page has about 44% of the pixels of the 150 DPI page.

Maya taps **2 MB** and presses **Compress**. Suppose the result reads 1.62 MB. The saving shown is:

- (1 − 1.62 ÷ 4.8) × 100 ≈ **66% smaller**.

That fits with room to spare, and she uploads it. Your own file will give different numbers, because a page of dense handwriting packs less well than a page of clean type.

## Check your answer

- **Look at the After figure, not the file name.** It must be at or below the portal's number. Some portals count 1 MB as 1,000,000 bytes, so if a file sits right on the edge, aim a little lower.
- **Zoom in on the smallest text.** Signatures, dates and roll numbers must still be readable at 100% zoom. If they are blurry, try again without **Go below anyway**.
- **Count the pages.** The number of pages should match the original.
- **Rough size check.** Six pages under 2 MB is about 340 KB a page, which is plenty for a clear scan. A 40-page file under 200 KB is only 5 KB a page and will rarely look good.

## Questions people ask

**Why can I no longer select the text?** At **Recommended**, **Smallest** or a tight upload limit, each page becomes a picture of itself. Choose **Light** to keep text, links and fill-in fields, if the limit allows.

**What if it still will not fit?** Split the file and upload the parts, if the portal allows more than one file. The [[organise-pdf]] tool splits, reorders and removes pages, so you can also drop a blank back page or two.

**How do I make a smaller scan in the first place?** Photograph each page in good light and turn the photos into one PDF with [[scan-to-pdf]]. For a single picture rather than a PDF, the [[image-resizer]] can shrink it under a limit too.
