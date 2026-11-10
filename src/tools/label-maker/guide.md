---
name: Label maker
num: 1760
shelf: documents
code: T794
section: templates
title: "Label maker: print address and product labels from a list to PDF"
summary: "Turn a list of addresses or product names into label sheets (30-up Letter, 21-up A4 or your own grid) and download a PDF. Nothing is uploaded."
status: live
ads: false
order: 1760
icon: table
works: offline
updated: 2026-11-10
related: [image-resizer, mail-merge, invoice-maker]
sources:
  - "Sheet layouts are the common grids sold for sticky label paper (Letter 3 x 10 at 2.625 x 1 in, A4 3 x 7 at 63.5 x 38.1 mm). Names such as 5160 are used only to describe the size. Check your pack for exact measures."
flow:
  - { icon: pencil, label: "Add list" }
  - { icon: table, label: "Pick sheet" }
  - { icon: download, label: "Download" }
---

## What it does

Paste or open a list of addresses, product names or name tags and get a PDF where each entry fills one label on a sheet of sticky labels. The page shows a small picture of the first sheet so you can see where everything lands.

Everything is made on your device. Your list is not uploaded or kept. If your list lives in a spreadsheet, save it as CSV first. To fill labels from columns with extra wording, try [[mail-merge]]; for a logo or product photo on a label, shrink the picture first with [[image-resizer]]; and for billing paperwork see [[invoice-maker]].

## How to use it

1. Type one label per line, or open a CSV file. A comma starts a new line on the label, so "Asha Rao, 12 Park Road, Pune" prints on three lines.
2. Choose the sheet that matches your pack, or choose Custom grid and type the measures from the pack.
3. Set the text size, how many copies of each, and which labels on the sheet are already used.
4. Download the PDF and print it at 100% (actual size).

## What each setting does

- **One label per line / blank-line blocks**: how your text is split into labels.
- **Skip used labels**: leaves the first few spots empty, to use up a part-used sheet.
- **Copies of each**: prints every label several times, for a return address.
- **Text size**: the largest size to try; longer text shrinks until it fits.
- **Draw outlines**: boxes around each label, handy for a test print on plain paper held up to a sheet of labels.

## Worked example

A list of 31 names on the Letter 30-up sheet needs 2 pages: 30 labels on the first and 1 on the second. With "Skip used labels" set to 5, 26 names fit on the first page.

## FAQs

**The text is slightly off the labels.** Printers often shrink a page. Print at 100% or "actual size" and turn off "fit to page".

**Can I print only a few labels?** Yes. Use "Skip used labels" to start part-way down the sheet.

**Does it work offline?** Yes, once the page has loaded.

**Which letters are supported?** The standard PDF fonts, so Latin letters with accents work; other scripts are replaced with a question mark.
