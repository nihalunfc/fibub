---
name: Markdown to PDF
num: 1790
shelf: documents
section: convert-files
title: "Markdown to PDF: turn Markdown into a clean PDF or HTML page, free"
summary: "Write or paste Markdown, see the page live, then save it as a PDF or an HTML file. Headings, lists, tables, code and local pictures work, and nothing is uploaded."
status: live
ads: false
order: 1790
icon: pencil
works: offline
updated: 2026-11-10
related: [file-converter, organise-pdf]
sources:
  - "The Markdown reader is fibub's own small parser (common CommonMark and GitHub-style tables and task lists). The PDF is made by your browser's own print feature."
flow:
  - { icon: pencil, label: "Write" }
  - { icon: eye, label: "Preview" }
  - { icon: sliders, label: "Page" }
  - { icon: download, label: "Save PDF" }
---

## What it does

Markdown is a way to write headings, lists and tables with plain keys, the kind used in README files, notes apps and many text editors. This tool shows your Markdown as a finished page and lets you save it as a PDF, so a README, a report or a set of notes can be shared or printed.

Everything happens in your browser. Your text and pictures are never uploaded, and it keeps working with no internet once the page has loaded. To tidy the finished PDF, use [[organise-pdf]], or turn other files into PDF with [[file-converter]].

## How to use it

1. Type or paste Markdown on the left, or press **Open a .md file**.
2. Check the preview. If you used pictures, press **Add pictures** and choose the files with the same names as in your text.
3. Pick the page size, text size and margins. Tick **Table of contents** to add a list of headings at the start.
4. Press **Save as PDF (print)**. In the window that opens, choose **Save as PDF** as the printer, and turn off "Headers and footers".
5. Or press **Download HTML** to keep a web page version.

## What each setting does

- **Page size**: A4, Letter, Legal or A5. It is passed to the print window.
- **Text size**: scales the body text; headings follow.
- **Margins**: the white space around the page.
- **Table of contents**: lists the headings with links, on its own first page.
- **Add pictures**: pictures are only shown when you choose the file here. Web addresses in `![](https://...)` are not fetched, so opening a document never sends anything to another site.

## Worked example

Typing `# Report` then `- one` and `- two` gives a large heading and a two-item bullet list. A table written as `| Item | Qty |`, a line of dashes, and `| Pens | 3 |` becomes a table with a shaded header row.

## FAQs

**Why does it use the print window?** Your browser already makes accurate PDFs with selectable text, fonts and page breaks, so there is nothing to upload or install.

**Which Markdown is supported?** Headings, paragraphs, bold, italic, strikethrough, inline and fenced code, links, lists (also nested and task lists), block quotes, tables and horizontal lines. Raw HTML is shown as plain text for safety.

**Why is my picture missing?** Add the file with **Add pictures**; the name must match the one in the Markdown.
