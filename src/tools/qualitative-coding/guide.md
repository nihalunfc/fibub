---
name: Qualitative coding
num: 750
shelf: science
section: sociology-and-survey-research
title: "Qualitative coding tool for interviews and texts: code book, highlight and tag passages, code counts, co-occurrence, retrieve, CSV/JSON"
summary: "Open your own interview transcripts or texts, tag passages with codes from a colour-coded code book, and see counts per document, a code co-occurrence matrix and every passage for a code. Export CSV or JSON. Nothing is uploaded."
status: live
ads: false
order: 750
icon: pencil
works: offline
updated: 2026-11-09
related: [reliability-analysis, data-cleaner, plot-maker, field-note-organiser]
sources:
  - "Methods: thematic coding as described in qualitative research textbooks; the c-coefficient n12/(n1 + n2 − n12) as used in qualitative analysis software. Example interviews made up for this tool."
flow:
  - { icon: file, label: "Your texts" }
  - { icon: pencil, label: "Tag" }
  - { icon: table, label: "Counts" }
  - { icon: download, label: "Export" }
---

## What it does

Qualitative researchers **code** their data: they mark passages of interviews, open survey answers, field notes or documents with short labels (codes) such as "Support" or "Cost of living", then look across the data for patterns. Dedicated software for this is often expensive. This tool covers the core of the work in your browser: a **code book** with colours, tagging passages by selecting them, **counts** per code and document, a **co-occurrence matrix** of codes that appear together, and **retrieval** of every passage for a code. Your texts never leave your device.

## How to use it

1. **Add documents.** Press **Open .txt files** to open one or more plain text files (up to 5 MB each), or use **Paste a document**. Pick the document to work on in the Document list. The page starts with three short made-up interviews so you can try it; press **Clear all** to start your own project.
2. **Build the code book.** Type a code name, pick a colour and press **Add code**. Delete a code with Delete under its button (its passages go too).
3. **Tag passages.** Select a passage in the text with the mouse or your finger, then press a code. Spaces at either end are trimmed. A passage can carry several codes, and passages can overlap. Coded text is tinted with the colour of its first code and underlined once per code. Click or tap coded text to see its codes and remove one.
4. **Read the results.** The counts table shows how many passages each code has in each document, the total, and in how many documents it appears. The co-occurrence matrix shows which codes go together: either **overlapping passages** (a passage with one code shares text with a passage with the other) or **documents with both codes**. Switch to the **c-coefficient**, n₁₂ ÷ (n₁ + n₂ − n₁₂), to compare pairs of codes of different sizes (0 = never together, 1 = always together). **Retrieve passages** lists every passage with a chosen code, with its document, position and any other codes on it.
5. **Export** the passages (one row per coded passage, with document, code, start and end positions and the text), the counts or the matrix as CSV, or the whole project as **JSON**, which you can import again later or on another device.

## Keeping your work

By default the project lives only on the open page. Tick **Keep my project in this browser** to save it in this browser on this device; it is never sent anywhere. Untick it or press **Clear all** to remove it. Export JSON regularly as a backup.

## Worked example

The made-up project has 3 interviews, 4 codes and 13 coded passages. **Support** has the most passages: **5**, across all **3** documents. In the overlap matrix, **Staying or leaving** overlaps **Cost of living** once and **Support** once, both in Interview 1, where "The rent is high, but my neighbours help with childcare, so I stay." carries all three codes; the c-coefficient for Cost of living and Staying or leaving is 1 ÷ (3 + 3 − 1) = **0.20**. Counting by document instead, Cost of living and Support appear together in all **3** interviews. Retrieve **Staying or leaving** and you get its 3 passages, the first marked "also Cost of living, Support".

## Tips

- Write a short definition for each code in your own notes and apply it the same way every time. For team projects, two coders can code the same texts separately and compare agreement with the reliability tool.
- Code generously at first, then merge or split codes as themes become clear.
- Character positions in the CSV count from the first character of the document, so passages can be found again in the original file.

## FAQ

**Are my transcripts uploaded?** No. Everything stays in your browser.

**Can I code PDFs or Word files?** Save them as plain text (.txt) first, then open them here.

**Is this a replacement for full qualitative analysis software?** It covers coding, counting, co-occurrence and retrieval. It does not do memos linked to passages, hierarchies of codes or audio and video.
