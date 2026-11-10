---
name: Metadata cleaner
num: 1707
shelf: documents
section: privacy-clean
title: "Metadata cleaner: remove author, GPS and hidden details from files, free"
summary: "See and remove the hidden details in PDF, Word, Excel, PowerPoint, JPG and PNG files: author, company, edit history and photo location. Nothing is uploaded."
status: live
ads: false
order: 1707
icon: lock
works: offline
updated: 2026-11-10
related: [send-check, compress-file, redact-pdf]
sources:
  - "Office files are ZIP packages read and rewritten with fflate. PDFs use pdf-lib. JPEG and PNG are edited by dropping the metadata blocks, without re-encoding. All open source."
flow:
  - { icon: file, label: "Add files" }
  - { icon: eye, label: "See details" }
  - { icon: lock, label: "Clean" }
  - { icon: download, label: "Download" }
---

## What it does

Files carry more than you see. A Word file remembers who wrote it, which company the copy of Word was registered to, who saved it last and how many minutes it was edited. A phone photo can hold the exact place it was taken. A PDF stores its author, the program that made it and extra XMP data.

This tool shows what it finds and then saves a clean copy. Files never leave your browser. Before you send the result on, run [[send-check]] for comments and tracked changes, or shrink it with [[compress-file]].

## How to use it

1. Add one or more files. Each one shows a card listing what was found. Names and places are in bold.
2. Press **Clean and download**. One file gives you that file back as `name-clean.ext`. Several files give you one ZIP.
3. Open the clean copy to check it looks the same.

## What gets removed

- **Word, Excel, PowerPoint**: author, last modified by, title, subject, keywords, comments field, revision count, dates, company, manager, editing time, custom properties, the preview picture and the reviewer name list.
- **PDF**: the information fields (title, author, creator, producer, dates) and the XMP block.
- **JPG**: EXIF (camera, date, GPS), XMP, IPTC and comment blocks. The picture itself is not re-compressed, so quality does not change. If the photo was turned by the camera, a tiny block that only says "turn this way" is kept so it does not appear sideways.
- **PNG**: text blocks, EXIF and the modified-time block.

## Worked example

A photo from your phone shows GPS location 43.65330, -79.38333 and the camera model. After cleaning, adding the same file again shows no hidden details.

## FAQs

**Does it remove comments and tracked changes?** No. Those are visible to readers and you may want them. [[send-check]] finds them so you can deal with them in your own editor.

**Does it remove text hidden in the page itself?** No. It only clears the details about the file.

**Will the file still open?** Yes. The text and pictures are untouched.

**Is anything uploaded?** No. Everything runs in your browser.
