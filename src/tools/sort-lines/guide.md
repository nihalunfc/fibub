---
name: Sort lines
num: 2008
shelf: everyday
code: T856
section: dev-text
title: "Sort lines: sort a list alphabetically, naturally or by length, and remove duplicates"
summary: "Paste a list to sort it A to Z, Z to A, naturally (9 before 10) or by length, reverse or shuffle it, remove duplicate and blank lines, trim spaces and add line numbers, with counts before and after."
status: live
ads: false
order: 2008
icon: table
works: offline
updated: 2026-11-10
related: [text-cleaner, find-replace, data-cleaner]
sources:
  - "Sorting uses the browser's Unicode collation (Intl.Collator, English rules). fibub's own working."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: sliders, label: "Choose" }
  - { icon: copy, label: "Copy" }
---

## What it does

Paste any list, one item per line: names, email addresses, file names, keywords, IDs. This page puts the lines in order, tidies them and tells you how many it removed. Nothing leaves your device.

Before sorting, the [[text-cleaner]] can strip odd spaces and line breaks from pasted text; after it, [[find-replace]] can change every line at once.

## How to use it

1. Paste or type your lines in the top box.
2. Pick an **Order** and tick the clean-up boxes you want.
3. Read the count line, then press **Copy** or **Download .txt**. **Clear** empties the box.

## What each setting does

- **A to Z / Z to A**: dictionary order. Upper and lower case sort together; on a tie, the lower case line comes first. Digits are compared as text, so 10 comes before 9.
- **Natural (numbers by value)**: like A to Z, but a run of digits is read as a number, so "item 9" comes before "item 10". Numbers come before letters. **Natural, reversed** is the same order backwards.
- **Shortest first / Longest first**: by number of characters. Lines of equal length keep their order.
- **Reverse the order**: flips the list without sorting it.
- **Shuffle**: a random order from your browser's secure random generator. **Shuffle again** makes a new one.
- **Trim spaces**: removes spaces and tabs at the start and end of each line.
- **Remove blank lines**: drops empty lines and lines of only spaces.
- **Remove duplicates**: keeps the first copy of each line. With **Duplicates ignore case**, "Apple" and "apple" count as the same.
- **Add line numbers**: puts "1. ", "2. " and so on in front, after sorting.

The clean-up runs first (trim, blanks, duplicates), then the sort, then the numbering.

## Worked example

The five lines b, a, B, 10, 9 sorted **Natural** give 9, 10, a, b, B: the numbers first by value, then the letters, with lower case b before capital B. With **A to Z** they give 10, 9, a, b, B, because "1" sorts before "9" as text.

Tick **Remove duplicates** and **Duplicates ignore case**: b and B are the same, so 4 lines are left and the count says "1 duplicate removed".

## FAQs

**Does it handle accents?** Yes. é sorts next to e, not after z.

**Is there a line limit?** No fixed limit.
