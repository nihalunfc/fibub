---
name: Compare documents
num: 1713
shelf: documents
code: T747
section: doc-checks
title: "Compare documents: see what changed between two versions, free"
summary: "Compare two versions of a PDF, Word file, text file or pasted text. New words are underlined in green, removed words struck through in red. Nothing is uploaded."
status: live
ads: false
order: 1713
icon: search
works: offline
updated: 2026-11-10
related: [send-check, file-converter]
sources:
  - "Word-level comparison uses the Myers shortest-edit method written for fibub. Word files are read with fflate, PDFs with PDF.js and pdf-lib. All open source."
flow:
  - { icon: file, label: "Add two" }
  - { icon: search, label: "Compare" }
  - { icon: download, label: "Redline" }
---

## What it does

When someone sends back "the final version", this tool shows exactly what is different from the one you sent. It compares word by word, so a changed number or a deleted "not" stands out. New words are underlined in green and removed words are struck through in red, like a lawyer's redline.

Add a PDF, a Word file or a text file on each side, or paste text. Everything stays in your browser, so it is fine for contracts and offers. Before you send your own version out, run [[send-check]]; to turn a file into another format first, use [[file-converter]].

## How to use it

1. Put the older version under **Original** and the newer one under **New version**. A file fills the text box, and you can still edit it.
2. Press **Compare**. The count tells you how many separate changes there are, plus words added and removed.
3. Switch between one column and side by side.
4. Press **Download redline PDF** to save the marked-up result, or **Print** to print it or save it as a PDF from your browser.

## What each setting does

- **Ignore capital letters**: "Agreement" and "agreement" count as the same word.
- **One column**: shows removed and added words together in reading order.
- **Side by side**: the original on the left with removals, the new version on the right with additions.

## Worked example

Original: "The cat sat on the mat". New: "The dog sat on the red mat". The result shows 2 changes: "cat" replaced by "dog" (one change) and "red" added (another). That is 2 words added and 1 removed.

## FAQs

**Does it compare layout, fonts or pictures?** No. It compares the words only.

**Why do I see odd breaks from a PDF?** PDFs do not store paragraphs, so line breaks are guessed. They never count as changes; only words do.

**Can it read scanned PDFs?** No. A scan is a picture. The text has to be real text.

**Tracked changes in a Word file?** Deleted text is left out and inserted text is included, so you compare the document as it would read if accepted.

**Is my file uploaded?** No. Everything runs in your browser.
