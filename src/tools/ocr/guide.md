---
name: Image to text
num: 1789
shelf: documents
code: T824
section: images-scans
title: "Image to text (OCR): copy text from a photo, screenshot or scanned PDF, free"
seoTitle: "Image to text (OCR): free, private, in your browser"
summary: "Pull the text out of a photo, screenshot or scanned PDF so you can copy, edit or save it. English, Hindi, Malayalam and Arabic. The reader runs in your browser; nothing is uploaded."
status: live
ads: false
order: 1789
icon: search
works: offline
updated: 2026-11-10
related: [scan-to-pdf, text-cleaner, word-counter, file-converter]
sources:
  - "Text reading by Tesseract OCR (Apache License 2.0) through tesseract.js 7.0.0 (Apache License 2.0); language models are Tesseract's tessdata_best integer models (Apache License 2.0), from the @tesseract.js-data packages. All files are served from fibub.com itself."
  - "Clean-up filter (grey, shadow levelling, contrast) and the word boxes are fibub's own code."
flow:
  - { icon: camera, label: "Picture" }
  - { icon: search, label: "Read" }
  - { icon: pencil, label: "Fix" }
  - { icon: copy, label: "Copy" }
---

## What it does

Image to text reads the words in a picture and gives them back as text you can copy, edit or save. Add a phone photo of a page, a screenshot, a photo of a sign or receipt, or a scanned PDF with no selectable text, and the tool reads every page in turn. This is called OCR (optical character recognition).

The reader is Tesseract, the open-source OCR engine, running inside your browser. Your pictures are never uploaded. The first time you use it, your browser downloads the reader (about 4 MB) and the language you picked (1.4 to 2.9 MB) from fibub.com; after that the browser keeps them, so it works again with no internet. Before you read a paper page, flatten it with [[scan-to-pdf]]; afterwards, tidy the text with [[text-cleaner]] or count it with [[word-counter]].

## How to use it

1. Choose **Add images or a PDF** (you can pick several), **Take a photo**, or paste a picture with Ctrl+V (⌘+V on a Mac).
2. Pick the **Language** of the text. Wait while the reader loads (first time only) and reads each page; the bar shows progress.
3. Check the text in the box against the picture. Word boxes in orange are words the reader was unsure about, so look at those first. Edit the text right in the box.
4. **Copy text** or **Download .txt**.

## What each setting does

- **Language**: which language model the reader uses. Pick the language the text is written in; English reads numbers and Latin letters best. Arabic text is shown right to left.
- **Clean up first**: turns the picture grey, evens out shadows and raises contrast before reading. It helps with phone photos taken under a lamp. Untick it for clean screenshots, or if letters come out broken.
- **Show word boxes**: draws a box around every word found (blue when sure, orange when under 60% sure), so you can see what was read and what was missed.
- **Turn and read again**: turns the page showing a quarter turn and reads all pages again. Use it when a photo was taken sideways and the text comes out as nonsense.
- **Previous / Next**: with several pages, moves the picture between pages. The text box has every page, each starting with a "--- Page N ---" line.

## Worked example

A screenshot shows two lines in a plain black font on white: "INVOICE 2026" and "Total due 450.75". Add it and leave the language on English. After a few seconds the box shows:

```
INVOICE 2026
Total due 450.75
```

The message says 5 words on 1 page, and the reader is over 80% sure. Copy it into your spreadsheet, or into [[percentage-calculator]] to work out a tip or tax.

## Tips for good results

- Take the photo straight on, in even light, with the text filling most of the picture. Blurry, tiny or curved text reads badly.
- Printed text works best. Handwriting is read only now and then; for joined-up handwriting, expect to retype most of it.
- Tables come out as lines of text with spaces between the cells. For a bank statement PDF that already has selectable text, [[statement-to-csv]] keeps the columns.
- Very large pictures are made smaller (longest side 2,600 pixels) before reading, which keeps phones from running out of memory.

## FAQs

**Is my picture uploaded anywhere?** No. The reader, its files and your pictures stay in your browser. The only downloads are the reader's own files, which come from fibub.com, not from any other site.

**Why is the first read slow?** Your browser is downloading the reader and the language file, about 7 MB in all for English. Later reads start in a second or two.

**Can it read a PDF?** Yes, scanned PDFs: each page is turned into a picture and read. If the PDF already has text you can select, copying it straight from the PDF is more accurate.

**Which languages can it read?** English, Hindi, Malayalam and Arabic for now. Each language is a separate file that loads only when you pick it.

**How accurate is it?** On a clean screenshot, nearly every word is right. On a photo of a page, expect a few mistakes per page, mostly in small print, numbers next to letters (0 and O, 1 and l) and words at the edges. Always check names, amounts and dates before you rely on them.

**Does it keep my text?** No. Close the page and the text is gone, unless you copied or saved it.
