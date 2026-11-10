---
title: "How to stamp DRAFT or CONFIDENTIAL across PDF pages and photos"
summary: "Mark a PDF, JPG or PNG with see-through words across the page or a dated Received, Approved or Paid box in a corner. How size, angle and opacity work, with real numbers."
tools: [watermark-pdf, organise-pdf, page-numbers, redact-pdf]
updated: 2026-11-10
sources:
  - "Point sizes and the PDF unit (72 points to the inch, 25.4 mm to the inch) and A4 size (595.28 × 841.89 points) are standard values."
  - "Text widths are for the standard Helvetica Bold font that every PDF reader has, measured with pdf-lib."
---

A visible mark tells everyone how to treat a document: this quote is still a draft, this copy is only for the bank, this invoice has been paid. The [[watermark-pdf]] tool writes your words across PDF pages or onto a photo, or adds a small dated stamp in a corner, and saves a marked copy to your device. Nothing is uploaded. Put the pages in order first with [[organise-pdf]], take out anything private with [[redact-pdf]], and number the pages afterwards with [[page-numbers]].

## What it is

A **watermark** here is text drawn on top of each page, partly see-through so the page still shows beneath. Four settings control how it looks:

- **Size** is the letter height. On a PDF it is in **points**, the unit PDFs use: 72 points make an inch (25.4 mm). On a picture the tool treats the picture as 800 units wide, so a size of 40 on a photo 4,000 pixels wide gives letters 40 × 4,000 ÷ 800 = 200 pixels tall.
- **Angle** turns the text, in degrees. 0 is level, 45 climbs from bottom left to top right, and negative numbers slope the other way. The range is −90 to 90.
- **Opacity** is how solid the ink is, as a percentage: 100 hides what is under it, 5 is barely there.
- **Colour** is any colour from the picker; it starts on a dark red.

The tool always centres the text on the middle of the page, whatever the angle, by working out where the start of the line must go so that its midpoint lands in the centre.

The second kind of mark, the **stamp**, writes RECEIVED, APPROVED or PAID followed by today's date (year-month-day) in a box with a border. It goes in the corner you choose, about a third of an inch from the edges. On a PDF the stamp letters are a fixed 16 points.

## How to use it

1. Press **Choose a PDF, JPG or PNG**. A PDF shows its page count; a picture shows a live preview.
2. Under **Kind**, pick **Text across the page** or **Stamp with date in a corner**.
3. For text, type the **Words** (or pick DRAFT, CONFIDENTIAL, COPY or SAMPLE from the suggestions), then set **Size**, **Angle (degrees)**, **Opacity (%)** and **Colour**. For a stamp, choose the **Stamp** word and the **Corner**, plus opacity and colour.
4. For a PDF, type the pages to mark in **Pages (blank = all)**, such as `1-3,5`, or leave it empty.
5. Press **Add watermark and download**. You get a copy ending in "-marked"; the original is not changed.

## A worked example

**A confidential report.** You have a 6-page A4 report (595.28 × 841.89 points per page) and want CONFIDENTIAL across pages 2 to 6, leaving the cover clean.

1. Choose **Text across the page**, type CONFIDENTIAL, size 90, angle 45, opacity 25.
2. Will it fit? In Helvetica Bold at 90 points the word is about **670 points** long. Tilted at 45 degrees, it spans about 670 × cos 45° + 63 × sin 45° ≈ **518 points** across (63 points is the height the tool allows for the letters, 0.7 × 90). The page is 595 points wide, so it fits with room to spare.
3. Type `2-6` in **Pages** and press the button. The new file has 6 pages, and only 5 of them carry the mark.

**A paid invoice.** On a one-page invoice, choose **Stamp with date in a corner**, pick **Paid** and **Top right**. On 10 November 2026 the stamp reads "PAID  2026-11-10". The text is about 127 points long, so with 8 points of padding on each side the box is about 143 × 32 points, or **50.6 × 11.3 mm**, set 24 points (**8.5 mm**) in from the top and right edges.

**A copy of an ID.** For a photo of an ID card that a letting agent asked for, type "Copy for letting agent only, 2026-11-10", size 40, angle 30, opacity 35. On a photo 4,000 pixels wide the letters come out about 200 pixels tall. Watch the preview and lower the size if the line runs off the edges.

## Where it is used

- **Offices.** Mark drafts and internal copies so nobody mistakes them for the final version.
- **Bookkeeping.** Stamp supplier invoices Received or Paid with the date, ready for the files.
- **Teaching.** Put SAMPLE across answer sheets shared before an exam, or a school name across worksheets.
- **Personal admin.** Mark copies of ID with who they are for and the date, so a leaked copy cannot easily be reused.

## Common mistakes

- **Setting opacity too high.** At 100 the words cover the text below. Between 20 and 35 the page stays readable.
- **Using a long phrase at a big size.** Long words at 90 points can run off a narrow page. Lower the size, or shorten the words.
- **Typing letters the PDF font lacks.** Text on a PDF must use Latin letters, numbers and common symbols. Words in other scripts, or symbols like the rupee sign, are refused with a message.
- **Treating a watermark as protection.** It is drawn on the page, and a determined person can edit it out of a PDF. To hide something for good, use redaction instead.
- **Stamping late at night.** The stamp's date comes from the world clock (UTC), so close to midnight it can show a day before or after your local date. Check the stamp before you file it.

## Questions people ask

**Can I put two different marks on one file?** Yes. Mark it once, then open the marked copy and add the second mark, such as a stamp over a DRAFT watermark.

**Does a watermark make the PDF bigger?** Barely. Only a few words and a font reference are added; the pages are not redrawn.
