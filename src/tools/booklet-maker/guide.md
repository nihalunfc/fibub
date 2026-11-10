---
name: Booklet maker
num: 1767
shelf: documents
code: T801
section: pdf-pages
title: "Booklet maker: print a PDF as a folded booklet, N-up sheets or a tiled poster"
summary: "Rearrange a PDF so it prints as a staple-and-fold booklet, with 2 or 4 pages per sheet, or as a poster over several sheets with cut marks. Nothing is uploaded."
seoTitle: "Booklet maker: PDF booklet, N-up and poster printing"
status: live
ads: false
order: 1767
icon: file
works: offline
updated: 2026-11-10
related: [organise-pdf, page-numbers, file-converter]
sources:
  - "The booklet order is the standard saddle-stitch layout: each sheet carries four pages, so the page count is padded to a multiple of four with blanks. Paper sizes are ISO A4 (210 x 297 mm) and US Letter (8.5 x 11 in)."
flow:
  - { icon: file, label: "Add PDF" }
  - { icon: sliders, label: "Choose" }
  - { icon: download, label: "Download" }
---

## What it does

Printing pages 1, 2, 3 in order does not give you a booklet. For a folded booklet each sheet must carry pages from both ends of the document, such as 8 and 1 on one side and 2 and 7 on the back. This tool rearranges your PDF into that order, two pages per landscape side, so you can print double-sided, fold the stack in half and staple the fold.

It also puts 2 or 4 pages on each sheet in normal reading order to save paper, and it can enlarge one page over a grid of sheets as a poster, with overlap and cut marks for taping. Number the pages first with [[page-numbers]], and reorder or remove pages with [[organise-pdf]] before you start.

## How to use it

1. Choose a PDF. The page count shows.
2. Pick Booklet, Several pages per sheet, or Poster.
3. Set the paper size and the options for that mode.
4. Press Make PDF, then print the result at 100% (not "fit to page").

## What each setting does

- **Booklet, flips on**: choose long edge for most printers. Pick short edge if the back sides come out upside down.
- **Pages per sheet**: 2 (landscape) or 4 (2 by 2). A thin border can mark each page.
- **Poster**: the page to enlarge, sheets across and down, overlap in millimetres, and cut marks at the printable corners. Each sheet is labelled with its row and column.

## Worked example

A 6-page PDF is padded with 2 blank pages to 8. That makes 2 sheets, or 4 printed sides: side 1 has the blank and page 1, side 2 has pages 2 and a blank, side 3 has pages 6 and 3, and side 4 has pages 4 and 5. Fold the two sheets together and the pages read 1 to 6.

## FAQs

**Why are there blank pages at the end?** A booklet needs a multiple of four pages. The blanks go at the back.

**My back sides are upside down.** Switch "flips on" to the other edge and make the PDF again.

**Will rotated pages work?** Pages that are stored rotated may sit sideways. Fix them first with the organise tool.

**Is my PDF uploaded?** No, it is rearranged in your browser.
