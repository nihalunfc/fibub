---
title: "How to resize, crop and shrink a photo without losing quality"
summary: "Pixels, aspect ratio, file formats and upload limits explained, with a worked example that turns a phone photo into a light web banner and a print-size ID photo."
tools: [image-resizer, compress-file, passport-photo, file-converter]
updated: 2026-11-10
sources:
  - "1 inch = 25.4 mm (exact, by international agreement). Print sizes in pixels use 300 dots per inch, a common photo-print setting."
  - "The photo sizes in the example are made up for teaching; passport and visa rules change, so check the official source."
---

A photo straight off a phone is often far bigger than anything needs: too many pixels for a web page, too many megabytes for an upload form, and the wrong shape for a banner or an ID card. The [[image-resizer]] crops, turns, scales and re-saves a picture inside your browser, so it never leaves your device. For a full ID photo with head-size checks, try [[passport-photo]], to bundle several pictures into one PDF use the [[file-converter]], and to shrink other kinds of file reach for [[compress-file]].

## What it is

A digital picture is a grid of tiny coloured squares called **pixels**. A size such as 4032 × 3024 px means 4032 pixels across and 3024 down, about 12.2 million pixels (12.2 megapixels).

- **Aspect ratio** is width ÷ height. A 16:9 banner has a ratio of 16 ÷ 9 ≈ 1.78. Scale both sides by the same factor and nothing looks stretched. With width W, height H and a new width W′, the matching new height is H′ = W′ × H ÷ W.
- **Print size.** Pixels = millimetres ÷ 25.4 × DPI, where DPI (dots per inch) is how many pixels are printed in each inch. At 300 DPI, 35 mm becomes 35 ÷ 25.4 × 300 ≈ 413 px.
- **File size** depends on the pixel count and on the format. JPG, WebP and AVIF are **lossy**: they throw away fine detail you rarely notice, and a quality setting decides how much. PNG is **lossless**: it keeps every pixel exactly, which suits screenshots and logos but makes photos heavy.

When you ask for a file under a size limit, the tool searches for the highest quality that fits. It tries a quality halfway between 30% and 95%, keeps the upper or lower half depending on whether the file fitted, and repeats seven times. If even the lowest quality is too big, it scales the picture down a step and searches again.

## How to use it

1. Press **Choose an image**, or drop a file on the box. JPG, PNG, WebP, GIF, BMP and AVIF all open; HEIC opens where the browser can read it, such as Safari.
2. Use **Rotate left**, **Rotate right** and the two **Flip** buttons first. Turning resets the crop box, so do it before cropping.
3. Pick a **Crop shape** (free, original, square, 4:3, 3:4, 16:9, 9:16 or one of three ID photo sizes), then drag the box or its corners. Arrow keys nudge it too.
4. Under **Size in pixels**, type a width or height, or press 25%, 50%, 75% or 100%. Leave **Keep shape** ticked so the other side follows.
5. Under **Save as**, choose a format. For lossy formats, set the **Quality** slider (10% to 100%). For JPG, also pick a background colour to fill any see-through areas.
6. To meet a cap, tick **Make it smaller than** and enter a number in KB or MB. The quality slider is then set for you.
7. Press **Create image**. A preview appears with its format, size and how much smaller it is than the original. Press **Download** to save a copy ending in "-resized".

## A worked example

Lena runs a small bakery blog and takes a landscape phone photo of 4032 × 3024 px. She wants a wide banner for the top of a post, and the blog's upload box refuses anything over 200 KB.

**Crop.** She picks **16:9 (widescreen)**. The widest box of that shape fills the full width: 4032 px across and 4032 ÷ 1.7778 ≈ **2268 px** down.

**Resize.** Her blog shows banners 1600 px wide. She types 1600 in the width box; with Keep shape ticked, the height becomes 1600 × 2268 ÷ 4032 = **900 px**.

**Format and limit.** She picks **WebP**, ticks **Make it smaller than** and enters 200 KB. The status line shows the search at work, starting at "Trying quality 63% at 1600 × 900", because 63% is halfway between 30% and 95%. When it finishes, the summary line gives the final quality and file size, and she downloads it.

**A print photo too.** Her new staff card needs a 35 × 45 mm photo. Choosing that crop shape sets the output to 35 ÷ 25.4 × 300 ≈ **413 px** by 45 ÷ 25.4 × 300 ≈ **531 px**, ready to print at 300 DPI.

## Where it is used

- **Job and exam portals.** Many want a photo and signature under a set size, often in JPG only.
- **Online shops.** Product photos cropped to a square look tidy in a grid and load faster for buyers on mobile data.
- **Websites and blogs.** A banner sized to the width the page shows, saved as WebP, loads much faster.
- **Social media.** 9:16 suits stories and phone screens, while 4:3 and square work for most feed posts.

## Common mistakes

- **Making a picture bigger to make it sharper.** Scaling up only spreads the same detail over more pixels. Start from the largest original you have.
- **Saving a screenshot as JPG.** Text and sharp lines get fuzzy edges in lossy formats. Use PNG for screenshots, charts and logos.
- **Unticking Keep shape by accident.** Faces and circles stretch. If a picture looks odd, tick the box and type the width again.
- **Rotating after cropping.** The crop box resets when you turn the picture, so rotate and flip first.
- **Expecting a tiny file from a huge PNG.** Lossless files can only get smaller by losing pixels. Switch to JPG or WebP, or lower the size in pixels.

## Questions people ask

**Will my original photo change?** No. The tool makes a new file and leaves the original as it was.

**Does it remove location data?** The new picture is drawn fresh from the pixels, so hidden details such as GPS position and camera model are not carried over.

**Is there a size limit?** Files up to 50 MB open on phones and tablets, and up to 100 MB on computers. The output can be up to 16,000 px on each side.
