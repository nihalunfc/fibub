---
name: File converter
num: 4
shelf: documents
section: convert-files
code: T4
title: "File converter: PDF to JPG, JPG to PDF, Excel to CSV, Word to text and more, free"
summary: "Convert pictures to PDF and back, PDF to text, Word to HTML or Markdown, and Excel, CSV and JSON between each other. Nothing is uploaded."
status: live
ads: false
order: 20
related: [prompt-pruner]
icon: convert
works: offline
updated: 2026-11-06
flow:
  - { icon: file, label: "Drop a file" }
  - { icon: convert, label: "Pick format" }
  - { icon: sliders, label: "Convert" }
  - { icon: download, label: "Download" }
---

## How to convert a file

1. Choose a file, or drop it on the box. For pictures, you can choose several at once.
2. Pick what to convert it to. Only the conversions that work for that file are shown.
3. Press **Convert**, then **Download**.

Your file is converted in your browser and never uploaded. The page keeps working with no internet once it is open.

To make the converted file smaller, use the [[compress-file|file compressor]]; to tidy text from a PDF before pasting it into an AI chat, the [[prompt-pruner]].

## What it can convert

| From | To |
| --- | --- |
| JPG, PNG, WebP, AVIF, GIF, BMP | JPG, PNG, WebP, AVIF (as your browser supports), or one PDF |
| Several pictures | One PDF with a page each, or a ZIP of converted pictures |
| PDF | JPG or PNG (one picture per page, 150 DPI), Markdown, plain text |
| Word (.docx) | Web page (HTML), Markdown, plain text |
| Excel (.xlsx) | CSV (one per sheet), JSON |
| CSV | Excel, JSON |
| JSON | CSV, Excel |

## What it can't do (yet)

Some conversions need a full office suite to lay pages out, which only a server can run. Because fibub never uploads your files, these are left out on purpose:

- PDF to an editable Word file with the same layout
- Word, Excel or PowerPoint to PDF with the same layout
- HEIC photos (from iPhones), unless your browser can open them

For those, use the "Save as" or "Export" option in Word, Excel, LibreOffice or Preview on your own computer. It is free and also keeps your file private.

## Good to know

- **PDF to text or Markdown** keeps the words, headings and lists, but not pictures, columns or tables. A scanned PDF has no text inside; convert it to JPG or PNG instead.
- **Excel to CSV** saves the values you see; formulas, colours and charts are not kept. Each sheet becomes its own CSV file, in one ZIP.
- **CSV to Excel** stores numbers as numbers, so you can add them up straight away. Numbers that start with 0 (phone numbers, postcodes) are kept as text so the 0 isn't lost.
- **JSON to CSV** turns a list of records into rows. Nested fields become columns such as `address.city`.
- **JPG has no transparency**, so transparent areas turn white.

## Example

A 12-page PDF statement to pictures: pick **JPG**, press Convert, and download one ZIP with `statement-page-01.jpg` to `statement-page-12.jpg`.
