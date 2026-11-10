---
name: Page numbers
num: 1702
shelf: documents
section: pdf-edit
title: "Add page numbers to a PDF: Page 1 of N, Bates numbers, header and footer, free"
summary: "Number the pages of a PDF, with Bates numbers for legal files and optional header and footer text. It runs on your device; nothing is uploaded."
status: live
ads: false
order: 1702
icon: pencil
works: offline
updated: 2026-11-10
related: [organise-pdf, watermark-pdf, compress-file]
sources:
  - "Numbers are drawn with pdf-lib using the standard Helvetica font. Bates numbering follows the common prefix plus zero-padded sequence used in legal discovery."
flow:
  - { icon: file, label: "Add PDF" }
  - { icon: sliders, label: "Choose" }
  - { icon: pencil, label: "Number" }
  - { icon: download, label: "Download" }
---

## What it does

Page numbers adds a number to every page of a PDF, in any of six places. Pick the style (1, Page 1, or Page 1 of N), the number to start from, how many opening pages to skip (a cover page, say) and the text size. Legal and records teams can switch to Bates numbers, which add a prefix and a fixed number of digits, such as `ABC-000001`.

You can also add header and footer text. Write `{date}` for today's date and `{file}` for the file name. Your file is not uploaded, and the original is never changed; you get a new copy. To put pages in order first, use [[organise-pdf]], and to add a DRAFT or Paid mark afterwards, [[watermark-pdf]].

## How to use it

1. Choose your PDF.
2. Pick where the number goes and which style you want.
3. Set "Start at" and "Skip first pages" if the first pages should not be counted.
4. Read the preview line under the form; it shows the first and last label.
5. Press **Add and download**.

## What each setting does

- **Start at**: the number on the first numbered page.
- **Skip first pages**: leaves these pages blank. Numbering starts on the next page.
- **Page 1 of N**: N is the last number used, so with a skipped cover it counts only numbered pages.
- **Bates numbers**: prefix plus a zero-padded number, in the position you chose.
- **Header and footer**: centred text; if a number sits in the same spot, the text moves in.

## Worked example

A 10-page report with a cover page: skip 1, start at 1, style "Page 1 of N". The cover stays blank, page 2 reads "Page 1 of 9" and the last page reads "Page 9 of 9".

## FAQs

**Can I use Arabic or other scripts?** Not yet. The text must use Latin letters, numbers and common symbols.

**Will the file get bigger?** Only by a few hundred bytes per page.

**Is the PDF changed in place?** No. Your original stays as it was.
