---
name: Text cleaner
num: 1770
shelf: documents
code: T804
section: text-tools
title: "Text cleaner: fix text copied from a PDF, remove line breaks, free"
summary: "Fix text copied from PDFs and emails: join broken lines, remove extra spaces and blank lines, undo line-end hyphens, fix quotes, strip bullets and numbers, remove emojis and hidden characters."
status: live
ads: false
order: 1770
icon: scissors
works: offline
updated: 2026-11-10
related: [case-converter, compare-documents, word-counter]
sources:
  - "Unicode character ranges for the hidden characters, emojis and quotes. Rules are fibub's own; always read the result before you use it."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: scissors, label: "Clean" }
  - { icon: copy, label: "Copy" }
---

## What it does

Text copied from a PDF often arrives with a line break at the end of every line, words cut in half by hyphens, double spaces and odd symbols. This tool tidies it up. Paste the text, tick what you want fixed, and the clean version appears below, ready to copy. Each option has a one-line explanation, and the before and after counts show what changed.

Nothing is uploaded; the cleaning runs on your device. After cleaning, you can count the result with [[word-counter]], change its case with [[case-converter]], or check two versions side by side with [[compare-documents]].

## How to use it

1. Paste your text in the top box.
2. Tick or untick the fixes. The result updates at once.
3. Press **Copy the clean text**, or **Use as my text** to run a second pass.

## What each option does

- **Join broken lines**: single line breaks become spaces, blank lines stay as paragraph breaks.
- **Remove hyphenation**: "docu-" then "ment" on the next line becomes "document". A word that is meant to have a hyphen at a line end, such as "well-known", may be joined too, so read the result.
- **Remove extra spaces** and **extra blank lines**: tidy the gaps.
- **Strip bullets** and **list numbers**: remove the signs at the start of lines.
- **Straight or curly quotes**: pick one style for all quotes and apostrophes.
- **Remove emojis** and **hidden characters**: deletes pictures, zero-width marks and control characters, and turns non-breaking spaces into normal ones.

## Worked example

The pasted text "This is a docu-" / "ment that wraps" / "over  two lines." becomes "This is a document that wraps over two lines." with joining, hyphenation and spaces turned on.

## FAQs

**Can it keep my paragraphs?** Yes. Turn on **Join broken lines** and blank lines between paragraphs are kept.

**Will it fix tables?** No. Tables copied from PDFs lose their layout; clean the text and rebuild the table by hand.

**Is my text kept?** No, it stays in your browser tab.
