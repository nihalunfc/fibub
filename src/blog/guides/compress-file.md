---
title: "How to make a PDF, photo or Office file smaller for upload or email"
summary: "Why files get big, what each compression method does to PDFs, images, Word, Excel and ZIP files, and how to hit an upload limit like 200 KB."
tools: [compress-file, image-resizer, zip-checker, file-converter]
updated: 2026-11-10
sources:
  - "A4 paper is 210 x 297 mm (ISO 216); a PDF point is 1/72 of an inch; 1 inch = 25.4 mm."
  - "The tool counts 1 KB as 1,024 bytes and 1 MB as 1,024 KB, as computers usually do."
---

Email boxes cap attachments, and job, visa and exam portals often refuse anything over a few hundred kilobytes. The [[compress-file]] tool takes one file of almost any kind, works out what it is, and makes a smaller copy inside your browser, so private papers never leave your device. It is for anyone stuck at an upload box: students sending scans, staff mailing reports, families filing forms. To change a picture's pixel size or crop it first, use the [[image-resizer]]; to see whether a ZIP has room to shrink, try the [[zip-checker]]; and to change a file's type, reach for the [[file-converter]].

## What it is

A file is big because of what is inside it. Text is tiny. Pictures are large, because every **pixel** (one coloured dot) needs storing. So most heavy files are heavy because of photos or scanned pages.

There are two ways to shrink data.

- **Lossless** compression finds repeats and writes them more briefly. Nothing changes when you open it. ZIP and the "Light" PDF setting work this way.
- **Lossy** compression throws away detail the eye barely notices, as JPG does. It saves far more, but the change cannot be undone.

For a scanned PDF, the tool redraws each page as a JPG picture at a set **DPI** (dots per inch). The pixel width of a page is:

pixels = page width in points ÷ 72 × DPI

where a **point** is 1/72 of an inch. Fewer dots per inch means fewer pixels, and a smaller file.

The saving shown at the end is (1 − after ÷ before) × 100, rounded to a whole percent. If nothing gets smaller, you get the original back.

## How to use it

1. Press **Choose a file**, or drop one on the box. The tool shows its name, size and what it found, for example "Detected: PDF document".
2. If there is more than one way to treat it, pick one under **What should we do with it?** For a PDF that is **Compress the PDF** or **Pack into a ZIP**; for Word, Excel or PowerPoint, **Shrink the pictures inside** or **Pack into a ZIP**.
3. Under **How much to compress**, choose **Light**, **Recommended** or **Smallest**. The line under each says what it does to your type of file.
4. For a PDF or an image with a size cap, turn on **Fit an upload limit**. Tap 100 KB, 200 KB, 500 KB, 1 MB or 2 MB, or type your own number of KB in the box.
5. Press **Compress** (or **Pack into ZIP** or **Repack ZIP**, depending on the file). A ring shows progress, and you can pop bubbles while you wait.
6. Read the Before, After and percent smaller, then press **Download**. **Compress another file** starts again.

## A worked example

Arjun has a 6-page scanned A4 PDF of his school certificates. It is 4.8 MB, and the college portal accepts no more than 1 MB.

**How big are the pages?** An A4 page is 595.28 points wide and 841.89 points tall. With **Recommended** (150 DPI), each page becomes 595.28 ÷ 72 × 150 ≈ **1240 px** by 841.89 ÷ 72 × 150 ≈ **1754 px**, about 2.17 million pixels. With **Smallest** (100 DPI), it is about **827 × 1169 px**, roughly 0.97 million pixels. That is (100 ÷ 150)² ≈ 44% of the pixels, so it is usually much lighter.

**Fitting the limit.** He turns on **Fit an upload limit** and taps **1 MB**, which the tool reads as 1,024 KB, or 1,048,576 bytes. It first checks whether a lossless repack already fits. If not, it tries page pictures at 150, then 130, then 110 DPI, each a little lighter, and stops at the first that fits.

**Reading the result.** Suppose the result is 820 KB. The saving is (1 − 820 ÷ (4.8 × 1,024)) × 100 ≈ **83% smaller**, and the file fits. If even 110 DPI were too big, the tool would say so and offer **Go below anyway**, which lowers quality further, his choice.

## Where it is used

- **Government, visa and job portals.** Size caps of 100 KB to 2 MB are common for scans and photos.
- **Email.** Many mail services stop attachments at around 20 to 25 MB, and smaller files arrive faster.
- **Reports and slide decks.** Office files full of phone photos can shrink a lot when only the pictures inside are made lighter. The words, formulas and slides stay as they were.
- **Data sharing.** A large CSV or log file packed into a ZIP often drops to a fraction of its size.
- **Phone storage.** Photos re-saved at screen size free up space while still looking the same on a phone.

## Common mistakes

- **Choosing Recommended or Smallest for a form you still need to fill.** These turn pages into pictures, so text cannot be selected and fill-in boxes and links are lost. Use **Light** for those.
- **Deleting the original.** Lossy changes cannot be undone. Keep the first copy in case you need it sharper later.
- **Expecting a ZIP to shrink much.** JPG photos and most ZIPs are already compressed, so repacking saves little.
- **Mixing up KB and MB.** 1 MB is 1,024 KB, not 100 KB. Read the portal's limit carefully before you choose.
- **Trying a locked file.** Password-protected PDFs and documents cannot be opened. Save an unlocked copy in its own app first.

## Questions people ask

**Why did my PNG come back as a JPG?** With Recommended or Smallest, a PNG with no see-through parts may be saved as JPG, which is much lighter for photos. Choose Light to keep PNG.

**Do I need to unzip the packed file?** Yes. Whoever receives a file made with **Pack into a ZIP** has to open the ZIP to use it. Most computers and phones do this with a tap.

**What is the biggest file it takes?** About 200 MB on a computer and 50 MB on a phone or tablet, because the whole file is held in memory while it works.
