---
name: Organise PDF
num: 1701
shelf: documents
section: pdf-pages
title: "Organise PDF: merge, split, reorder, rotate and delete pages, free"
summary: "Merge PDFs, split one into parts, reorder, rotate or delete pages and pull out the pages you need. It all happens on your device; nothing is uploaded."
status: live
ads: false
order: 1701
icon: scissors
works: offline
updated: 2026-11-10
related: [file-converter, compress-file, page-numbers, watermark-pdf]
sources:
  - "Pages are copied with pdf-lib and previewed with PDF.js (both open source). Nothing else is used."
flow:
  - { icon: file, label: "Add PDFs" }
  - { icon: sliders, label: "Arrange" }
  - { icon: scissors, label: "Split" }
  - { icon: download, label: "Download" }
---

## What it does

Organise PDF is a small page desk. Add one PDF or several, and every page shows as a picture. Move pages, turn them, delete the ones you do not want, then save everything as one PDF, split it into parts, or pull out only the pages you picked.

Your files stay in your browser. They are never uploaded, so it is fine for contracts, statements and forms, and it keeps working with no internet once the page has loaded. Shrink the result with [[compress-file]], or add numbers with [[page-numbers]] and a stamp with [[watermark-pdf]].

## How to use it

1. Choose your PDFs. Adding more files puts their pages after the ones you already have.
2. Use the arrows under a page to move it earlier or later, the turn arrow to rotate it a quarter turn, and the cross to delete it.
3. Tap a page picture to select it. Selected pages have a coloured border.
4. Press **Download all pages as one PDF** to merge, or **Download selected pages** to extract.
5. To split, set "every N pages" or type ranges, then press **Split to ZIP**.

## What each setting does

- **Split every N pages**: cuts the current order into equal parts; the last may be shorter.
- **Split by ranges**: `1-3,5` makes two PDFs, one with pages 1 to 3 and one with page 5. Page numbers follow the order on screen.
- **Rotate**: turns the page in the saved file, not only in the preview.

## Worked example

You have a 4-page contract and a 2-page appendix. Add both, so you see 6 pages. Delete page 2 of the contract, then press merge: the new PDF has 5 pages. Typing `1-1,2-2` into the ranges box and splitting gives a ZIP with 2 one-page PDFs.

## FAQs

**Is there a size limit?** Only your device's memory. Very large scans may be slow on a phone.

**Does it keep links and form fields?** Page content and links are kept in most files. Interactive form fields may be flattened when pages are copied; use a form tool for those.

**Why does my PDF not open?** It may be locked with a password or damaged. Remove the password in the app that made it and try again.

**Does rotating lose quality?** No. Only the page's turn setting changes; nothing is re-drawn.
