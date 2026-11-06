---
name: ZIP checker
shelf: documents
title: "ZIP checker: is my ZIP file compressed as much as it can be?"
summary: See what is inside a ZIP, how well each file is packed, and whether it can get smaller. Nothing is uploaded.
status: live
ads: false
order: 15
updated: 2026-11-06
---

## How to check a ZIP

1. Choose a ZIP file, or drop it on the box above.
2. fibub reads its table of contents and test-packs it with the strongest setting, all inside your browser.
3. You get a clear answer: **already as small as it gets**, or **can be X% smaller**. If it can, one tap sends it to the [File compressor](/documents/compress-file/), still without uploading anything.

## What the report shows

| Item | What it means |
| --- | --- |
| Unpacked size | How much space the files take once unzipped |
| Saved by zipping | How much smaller the ZIP is than the files inside |
| Packing | **Deflate** is normal compression. **Stored** means the file was added without compression. |
| Could shrink | A file that was stored without compression but would get smaller if packed |

## Why can't my ZIP get any smaller?

Photos (JPG, PNG), videos (MP4), music (MP3), PDFs and Office files (DOCX, XLSX) are already compressed inside. Zipping them again saves almost nothing. To make those smaller, compress the files themselves with the [File compressor](/documents/compress-file/) or the [Image resizer](/documents/image-resizer/), then zip them.

## Password-protected ZIPs

fibub can list what is in a locked ZIP but can't test or repack it, and it never removes passwords.
