---
name: Pre-send check
num: 1715
shelf: documents
code: T749
section: doc-checks
title: "Pre-send check: find comments, hidden text and metadata before you send"
summary: "Check a Word, Excel, PowerPoint or PDF file for comments, tracked changes, hidden text, hidden sheets, notes, embedded files and size before you send it. Nothing is uploaded."
status: live
ads: false
order: 1715
icon: check
works: offline
updated: 2026-11-10
related: [metadata-cleaner, compress-file, compare-documents]
sources:
  - "Office files are ZIP packages of XML read with fflate; PDFs are read with pdf-lib. Both are open source. Nothing is sent anywhere."
flow:
  - { icon: file, label: "Add file" }
  - { icon: sliders, label: "Set limit" }
  - { icon: check, label: "Read report" }
---

## What it does

A file can say more than you meant it to. A reviewer's comment, a deleted paragraph still stored as a tracked change, a hidden sheet of salaries, a slide marked hidden, speaker notes, white text on a white page. This tool opens the file on your device and lists what it finds, so you can fix it before it goes out.

Each line is red (fix it), amber (check it) or green (fine). Clear names and companies with the [[metadata-cleaner]], shrink a heavy file with [[compress-file]], or see what changed between two drafts with [[compare-documents]].

## How to use it

1. Add your file. The report appears at once.
2. Optionally type a size limit, such as 10 MB for an email or a portal. The size line turns red when the file is over it.
3. Work through the red and amber lines in your own editor, then check the file again.

## What it looks for

- **Word**: comments, tracked changes, hidden text, white text, embedded files, macros.
- **Excel**: hidden sheets, very hidden sheets (these cannot be unhidden from the normal menu), hidden rows and columns, comments, links to other workbooks.
- **PowerPoint**: speaker notes, hidden slides, comments, white text.
- **PDF**: comments and markup, attached files, scripts, layers switched off.
- **All**: author and company in the properties, links to other files, embedded files, file size.

## Worked example

A workbook has a sheet called Costs set to very hidden. The report shows a red line "Very hidden sheets: 1 sheet cannot be unhidden from Excel's menu: Costs." You delete or move that sheet, save, and check again for all green.

## FAQs

**Does it change my file?** No. It only reads it.

**Can it promise a file is safe?** No. It checks the common places. Always open the file the way your reader will before sending.

**Why is white text amber?** White text is normal on dark shapes. It is a problem only on a white background.

**Is my file uploaded?** No. Everything runs in your browser.
