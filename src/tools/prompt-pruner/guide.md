---
name: Prompt pruner
num: 8
shelf: documents
title: "Prompt pruner: turn PDFs and code into lean Markdown for ChatGPT, Claude and Gemini"
summary: "Strip repeated headers, page numbers, legal footers and extra spaces from PDFs, Word files, web pages and code, and get clean Markdown that uses fewer AI tokens."
status: live
ads: false
order: 18
icon: scissors
works: offline
updated: 2026-11-06
related: [file-converter, compress-file, readability-checker, table-converter]
flow:
  - { icon: file, label: "Drop a file" }
  - { icon: search, label: "Find clutter" }
  - { icon: scissors, label: "Strip it" }
  - { icon: copy, label: "Copy .md" }
---

## How to prune a document for an AI chat

1. Drop a PDF, Word file (.docx), saved web page, text file, code file, or a ZIP of a whole code folder. You can also paste text.
2. The clean Markdown appears with the token count before and after.
3. Press **Copy Markdown** and paste it into ChatGPT, Claude, Gemini or any other assistant, or **Download .md** to keep it.

Everything happens in your browser. Your document is never uploaded, and the page keeps working with no internet once it is open.

To get the text out of a PDF or Word file first, use the [[file-converter]]; to make a file small enough to upload, the [[compress-file|file compressor]].

## Why this saves tokens

AI chats charge, and limit you, by tokens: roughly four characters of text each. A long PDF wastes many of them on things that carry no meaning: the same header and footer on every page, page numbers, copyright lines, "confidential" notices and runs of spaces. Many chats also read each uploaded PDF page as an image, which costs far more than its text. Pasting clean Markdown instead keeps the meaning and drops the rest, so you can fit more into one conversation and hit usage limits later.

## What each option removes

- **Repeated headers and footers**: lines that appear at the top or bottom of most pages, even when the page number inside them changes.
- **Page numbers**: "Page 3 of 10", "- 4 -" and lone numbers.
- **Copyright, confidentiality and legal lines**: "© 2026 …", "All rights reserved", email disclaimers, "Unsubscribe" lines, and LICENSE files in code folders.
- **Extra spaces and blank lines**: trailing spaces, tabs and runs of empty lines.
- **Licence headers in code**: the licence comment block at the top of a source file.
- **All code comments** (off by default): whole-line and block comments. Leave it off when you want the AI to understand why the code does what it does.

For a ZIP of a code folder, dependency folders (node_modules, vendor, .venv), build output, lock files, minified files and binaries are skipped, and the result starts with a list of the files it kept.

## What it keeps

Headings (from font size in PDFs and from heading styles in Word), bullet and numbered lists, bold text in Word, tables in web pages, and code in fenced blocks with the language named. This is a cleaner, not a summary: the content is all still there, so the AI can still answer detailed questions.

## Questions

**My PDF came out empty.** It is probably a scan: pictures of pages with no text inside. Run it through a text-recognition (OCR) tool first.

**How exact are the token counts?** They are estimates based on about four characters per token, which is close for English. Code and other languages vary.
