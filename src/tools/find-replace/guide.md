---
name: Find and replace
num: 1771
shelf: documents
code: T805
section: text-tools
title: "Find and replace text online: many pairs, whole word, regex, free"
summary: "Paste text and replace many words at once. Use several find and replace pairs, match case or whole words, optional patterns, with every match highlighted and counted."
status: live
ads: false
order: 1771
icon: search
works: offline
updated: 2026-11-16
related: [text-cleaner, mail-merge]
sources:
  - "Patterns use JavaScript regular expressions (MDN web docs). Everything else is plain find and replace."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: search, label: "Find" }
  - { icon: copy, label: "Copy" }
---

## What it does

Paste a text, type what to find and what to put in its place, and see the changed text straight away. You can add as many find and replace pairs as you need and they run from the top down. Every place that matches is highlighted in a preview of your original text, and a count tells you how many were replaced for each pair.

By default it looks for the exact letters you typed. Tick **Use patterns** if you know regular expressions. Your text never leaves your device. To fill the same letter for many people use [[mail-merge]], and to remove the usual mess from copied text first use [[text-cleaner]].

## How to use it

1. Paste your text.
2. Type the word in **Find** and its new form in **Replace with**. Leave Replace empty to delete the word.
3. Press **Add another pair** for more.
4. Check the highlights, then press **Copy the result**.

## What each setting does

- **Match case**: off by default, so "Cat" and "cat" match. Turn it on to match capitals exactly.
- **Whole word only**: "cat" will not match inside "concatenate".
- **Use patterns**: the find box is read as a regular expression. In the replace box, $1, $2 are the bracketed groups and $& is the whole match.
- **Use result as my text**: puts the result back in the top box so you can run more changes.

## More options (added 2026-11-16)

- **Common fixes**: open the box for ready-made patterns: many spaces to one, remove empty lines, trim line ends, dates 31/12/2026 to 2026-12-31, "Smith, John" to "John Smith", commas to tabs and remove numbers. A fix fills the first pair and turns on patterns; change it as you like.
- **Treat each line on its own**: makes ^ and $ match at every line.
- **New line and tab**: in "replace with" with patterns on, \n is a new line and \t is a tab.

## Worked example

Text "Cat cat concat" with find "cat", replace "dog" and whole word on gives "dog dog concat", with 2 matches. With patterns on, finding (\d+)-(\d+)-(\d+) and replacing with $3/$2/$1 turns 2026-11-10 into 10/11/2026.

## FAQs

**What if my pattern is wrong?** A message says it is not valid and the text is left unchanged.

**Why are special signs like a full stop matched literally?** Because patterns are off by default. Turn them on to use the full pattern language.

**Is my text stored?** No.
