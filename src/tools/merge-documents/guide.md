---
name: Merge Documents
num: 3094
shelf: documents
code: T1075
section: pdf-pages
title: "Merge PDF and images: combine PDFs, JPGs and PNGs into one PDF, free"
seoTitle: "Merge PDF and images into one PDF, free online tool"
summary: "Put several PDFs and photos in the order you want and save them as one PDF. The limits for your device are shown before you start, and nothing is uploaded."
status: live
ads: false
order: 3094
icon: file
works: offline
updated: 2026-11-23
related: [organise-pdf, file-converter, compress-file, scan-to-pdf, page-numbers]
sources:
  - "PDF pages are copied and pictures placed with pdf-lib (MIT licence); first-page previews use PDF.js (Apache 2.0). Both run in your browser."
  - "Limits were measured in Chromium on 2026-11-23: a merge needed 3 to 5 times the files' size in memory at its peak (812 MB of files peaked at 2.5 GB). Phone browsers close a tab at around 1 GB, older phones sooner."
  - "Page sizes: A4 is 210 x 297 mm (ISO 216); US Letter is 8.5 x 11 in."
flow:
  - { icon: file, label: "Add files" }
  - { icon: sliders, label: "Order" }
  - { icon: convert, label: "Merge" }
  - { icon: download, label: "Download" }
---

## What it does

Merge Documents joins whole files into one PDF. Add PDFs, photos and scans in any mix, put them in order, and save one PDF you can email, upload to a form or print. Each PDF keeps all its pages exactly as they were; each picture becomes one page of its own.

Before you add anything, the tool shows the limits for the device you are on: how many files, how many megabytes in total and how many pages it can merge at a time. A counter under the box shows how much of each you have used, so you know before the merge starts, not after it fails. Everything happens in your browser, so nothing is uploaded and it keeps working with no internet once the page has loaded.

To move, delete or turn single pages after merging, open the result in [[organise-pdf]]; to make it small enough for an email or an upload limit, use [[compress-file|Compress file]]; to photograph paper pages first, use [[scan-to-pdf]].

## How to use it

1. Read the limits box at the top. They depend on your device (see below).
2. Press **Add PDFs and pictures**, or drop files onto the box on a computer. You can add more files at any time; new ones go at the end.
3. Put the files in order with the up and down arrows, or drag a file onto another on a computer. **Sort A to Z** orders them by name, counting numbers properly (page 2 comes before page 10). **Reverse order** flips the list.
4. Use the turn arrow to rotate a file a quarter turn clockwise. For a PDF this turns every page of that file.
5. If you added pictures, choose the page size and margin for them.
6. Type a file name and press **Merge into one PDF**. The PDF downloads, and the page count and file size are shown.

## The limits, and why there are any

The tool works in your browser's memory. While merging, it holds the files you added, the new PDF as it is built, and the saved copy, which came to 3 to 5 times the files' total size at the peak when we measured it (812 MB of files needed about 2.5 GB). Browsers close a tab that uses too much memory, so the tool stops you before that happens.

| | Phones, tablets and low-memory computers | Computers |
|---|---|---|
| Files at a time | 50 | 200 |
| Total size | 150 MB | 600 MB |
| One file | 75 MB | 300 MB |
| Pages in the result | 1,000 | 5,000 |

The tool counts a device as a phone when its main pointer is a finger, or when the browser reports 4 GB of memory or less. If you need more, merge in parts and then merge the parts: a 450 MB job on a phone can be three merges of 150 MB, and on a computer the three parts can then be merged into one.

## What each setting does

- **Page size** (pictures only): A4 or US Letter put each picture on a standard page, ready to print. **Same shape as the picture** makes the page match the picture, with no white bands.
- **Margin**: the white border around each picture. None runs the picture to the edge of the page.
- **Turn**: changes the page's turn setting, not the picture itself, so nothing loses quality.
- **File name**: the name the PDF downloads with.

Phone photos are often stored sideways with a note saying which way is up. The tool reads that note, so photos come out the right way up without you turning them.

## Worked example

You are applying for a rental and need one PDF of: a 3-page application form (PDF), a photo of your ID card (JPG) and two pay slips (a 1-page PDF each). Add all four files. The counter reads "4 files of 50 · 6.2 MB of 150 MB · 6 pages of 1,000" on a phone. Move the ID photo to the end with the down arrow, keep A4 and a small margin, name it "rental-application" and merge. You get a 6-page PDF of about 6 MB: pages 1 to 3 are the form, pages 4 and 5 the pay slips and page 6 the ID card centred on an A4 page. If the landlord's upload limit is 5 MB, run it through Compress file.

## FAQs

**Is anything uploaded?** No. The files are read and joined in your browser and the PDF is saved straight to your device. You can switch off the internet after the page loads and it still works.

**Which files can I add?** PDF, JPG and PNG are placed as they are. WebP, GIF, BMP and AVIF are turned into JPG first if your browser can open them. iPhone HEIC photos usually arrive as JPG when you pick them in Safari; if not, share them as JPG.

**Why can I not add a password-protected PDF?** Its pages are scrambled until the password is entered, so they cannot be copied. Save a copy without the password in the app that opens it, then add that copy.

**Are pictures re-compressed?** JPG and PNG pictures go into the PDF unchanged, so they keep their full quality. That also means a PDF of ten 4 MB phone photos is about 40 MB; use Compress file to make it smaller.

**Are links and bookmarks kept?** Page content and links on the pages are kept. Bookmarks (the outline) of the separate files are not joined into one, and form fields may stop being fillable.

**What if the merge stops?** The browser ran out of memory even within the limits, which can happen with many other tabs open. Close other tabs or merge in two parts.
