---
name: Medical records organiser
num: 1965
shelf: documents
code: T840
section: records-files
title: "Organise medical records into one PDF"
summary: "Drop lab reports, scans, bills and prescriptions, check the dates and types, then save one sorted PDF with a contents page, a ZIP of renamed files or an index CSV."
status: live
ads: false
order: 1965
icon: file
works: offline
updated: 2026-11-10
related: [organise-pdf, compress-file, medical-terms, file-converter]
sources:
  - "Dates are read from the file's own text, its name or its file date; types are guessed from common words. Files are merged with pdf-lib and zipped with fflate, both open source."
flow:
  - { icon: file, label: "Drop files" }
  - { icon: check, label: "Check dates" }
  - { icon: sliders, label: "Sort" }
  - { icon: download, label: "Download" }
---

## What it does

Medical papers pile up as PDFs, phone photos and scans with names like IMG_2041. Drop them all here and the tool finds a date for each, guesses what kind of record it is, and lets you sort them by date. Then it saves everything as one PDF with a contents page at the front, or as a ZIP of files with clear names such as "2026-03-14 Lab - report.pdf".

The date and type are only guesses, so check them. You can change any date, type or title. Nothing is uploaded and nothing is stored: close the page and the list is gone. When the merged file is too large to send, shrink it with [[compress-file]], rearrange pages with [[organise-pdf]], or look up unfamiliar words with [[medical-terms]].

## How to use it

1. Add PDFs and JPG or PNG photos. HEIC photos need converting first with the [[file-converter]].
2. Check the **Date** and **Type** of each row. Small grey text says where the date came from.
3. Pick the order, and tick **Group by type first** if you want labs, scans and bills together.
4. Save the PDF, the ZIP or the index CSV.

## What each option does

- **Dates like 03/04/2026 mean**: day first or month first. It re-reads dates you have not typed yourself.
- **Sort by date**: oldest first or newest first.
- **Group by type first**: Lab, Imaging, Bill, Prescription, Letter, Other, each sorted by date inside.
- **Title in contents**: the line shown on the contents page; it starts as the file name.

## Worked example

You drop a blood test PDF containing "14/03/2026", an invoice PDF containing "2026-01-05" and a photo named "chest xray 2026-02-10.png". The rows sort as 5 January (Bill), 10 February (Imaging) and 14 March (Lab). If the blood test has 2 pages, the invoice 1 and the photo 1, the merged PDF has 5 pages: the contents page and then every page in order.

## FAQs

**Does it read text in photos?** Yes, if you tick **Read the words in photos and scans** before adding files. It reads the first page on your device (the reader, about 4 MB, loads once) to find a date and a type. Without it, photos use the date in the file name or the file date. Check them either way.

**Are my files uploaded?** No. Everything happens in your browser.

**Why is a date wrong?** The first date-like text in the file is used, which may be a birth date. Type the right one.
