---
title: "How to reduce photo size in KB (for example under 50 KB) for a form"
summary: "Make the photo fewer pixels wide first, then let the quality drop just enough to fit the KB limit. Steps, the maths behind it and a worked example."
tools: [image-resizer, passport-photo, compress-file, file-converter]
updated: 2026-11-10
sources:
  - "The search for quality and the pixel step come from fibub's own src/lib/image/edit.ts; sizes shown as in src/lib/compress/format.ts (1 KB = 1,024 bytes)."
  - "The photo sizes and KB figures in the example are illustrative. Each exam, job or visa portal sets its own rules: check the official source."
---

To bring a photo under a KB limit, cut its width and height in pixels to what the form needs, then save it as a JPG at the highest quality that still fits. The [[image-resizer]] does both: type a new size, tick **Make it smaller than**, enter the limit, and it finds the right quality for you, all inside your browser.

## What you need

- **The photo.** A phone picture, a scan or a screenshot. JPG, PNG, WebP and most other common types open; HEIC opens where your browser supports it.
- **The KB limit.** For example "under 50 KB" or "20 KB to 100 KB". Some forms also set a minimum.
- **Any pixel size the form asks for.** Some say "200 × 230 pixels"; others say nothing, and then any sensible size will do.

If the form is for an official photo with set head size and background, the [[passport-photo]] tool is built for that job.

## Step by step

A photo's file size depends mostly on two things:

**file size ≈ number of pixels × bytes per pixel**

- **Number of pixels** = width × height. A 4,000 × 3,000 phone photo has 12 million pixels.
- **Bytes per pixel** depends on the format and the quality setting. A JPG at lower quality throws away fine detail and needs fewer bytes for each pixel.

Because pixels are counted across *and* down, halving the width (with the height following) leaves only a quarter of the pixels. That makes resizing the strongest step, and lowering the quality the fine-tuning.

With the image resizer:

1. Choose the photo. The page shows its pixel size and file size.
2. Drag the crop box, or its corners, to cut away anything you do not need. A **Crop shape** such as Square 1:1 keeps the box in that shape.
3. Under **Size in pixels**, keep **Keep shape** ticked and type the new width. The height follows: new height = new width × old height ÷ old width. Or tap 25%, 50% or 75%.
4. Under **Save as**, pick **JPG** for a photo. PNG keeps every detail but is much heavier for photos.
5. Tick **Make it smaller than**, type the limit and choose **KB** or **MB**. The **Quality** slider greys out, because the tool will set it.
6. Press **Create image**. The status line shows each quality it tries. It narrows down between 30% and 95% quality until it finds the best one under your limit.
7. If even 30% quality is too big, it makes the picture a little smaller in pixels and tries again. Read the summary under the preview (format, pixel size, KB and quality used), then press **Download**.

## A worked example

Arjun needs a photo under 50 KB for an exam form. His phone photo is 4,000 × 3,000 pixels and 3.4 MB.

**Step 1: the limit in bytes.** 50 KB = 50 × 1,024 = 51,200 bytes.

**Step 2: resize.** He types 800 as the width. With **Keep shape** ticked, the height becomes 800 × 3,000 ÷ 4,000 = 600 pixels. The picture now has 800 × 600 = 480,000 pixels, which is 480,000 ÷ 12,000,000 = 4% of the original pixels.

**Step 3: fit the limit.** He chooses JPG, ticks **Make it smaller than**, types 50 and leaves the unit on KB. Suppose the best quality that fits gives a 46 KB file. The summary then shows the size and how much smaller it is than the original:

- (1 − 46 KB ÷ 3.4 MB) × 100 = (1 − 46 ÷ 3,481.6) × 100 ≈ **99% smaller**.

**What if it had not fitted?** Suppose that at 800 × 600, even 30% quality made a 72 KB file. The tool then shrinks each side by about the square root of how far over it is, with a small margin:

- √(50 ÷ 72) × 0.95 ≈ 0.79, so the next try is about 633 × 475 pixels.

It uses the square root because pixels grow in two directions, so a side 0.79 times as long holds about 0.63 times the pixels.

## Check your answer

- **Look at the KB in the summary.** It must be at or below the form's number. If the form also sets a minimum, check you are above it.
- **Check the pixel size.** If the form asks for an exact width and height, the summary must show those numbers. If the tool had to shrink the picture to fit, increase the limit or crop tighter instead.
- **Look at the face or text at full size.** Blocky patches or smeared edges mean the quality fell too low. A slightly smaller pixel size at higher quality usually looks better.
- **Quick maths.** A 50 KB JPG at 800 × 600 is about 51,200 ÷ 480,000 ≈ 0.1 bytes per pixel, which is normal for a JPG. If you need far less than that, the pixel size is probably too big.

## Questions people ask

**Why is the PNG version so large?** PNG never throws detail away, so every pixel of a photo is stored in full. Use JPG or WebP for photos and keep PNG for screenshots and logos.

**Can I shrink a photo that is inside a PDF or Word file?** Yes, with the [[compress-file|file compressor]], which makes the pictures inside the document lighter. To turn several photos into one PDF, use the [[file-converter]].

**Does the new file still hold my location?** No. The saved image is drawn fresh, so hidden details such as GPS position and camera model are not carried over. Your original file is not changed.
