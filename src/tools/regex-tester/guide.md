---
name: Regex tester
num: 2005
shelf: everyday
code: T853
section: dev-text
title: "Regex tester: test regular expressions online with groups and replace"
summary: "Type a regular expression and some text to see every match highlighted, each numbered and named group listed, and a live preview of a replacement with $1."
status: live
ads: false
order: 2005
icon: search
works: offline
updated: 2026-11-10
related: [find-replace, regex-fsm-visualiser, sort-lines]
sources:
  - "Regular expression syntax as defined in ECMAScript (ECMA-262), run by your browser's own engine. fibub's own working."
flow:
  - { icon: pencil, label: "Pattern" }
  - { icon: sliders, label: "Flags" }
  - { icon: search, label: "Matches" }
  - { icon: convert, label: "Replace" }
---

## What it does

A regular expression (regex) is a short pattern that describes text: "three digits, a dash, four digits" is `(\d{3})-(\d{4})`. This tester runs your pattern against your text as you type, highlights every match, lists each one with its position and its capture groups, and shows what the text would look like after a replacement.

It uses the JavaScript regex engine built into your browser, so what works here works in JavaScript code too. Nothing is sent anywhere. To apply a pattern to a long document, use [[find-replace]]; to see how a pattern works step by step, try the [[regex-fsm-visualiser]].

## How to use it

1. Type the pattern in the box between the slashes. Leave out the slashes themselves.
2. Tick the flags you want.
3. Paste or type your test text. Matches are marked as you type.
4. Optionally type a replacement to see the result in "Replace preview".

**Clear** empties everything; **Example** brings back the phone number example.

## What each setting does

- **g (all)**: find every match. Without it only the first match is shown and replaced.
- **i (case)**: ignore the difference between upper and lower case.
- **m (lines)**: `^` and `$` match at the start and end of each line, not only of the whole text.
- **s (dot-all)**: a dot `.` also matches a new line.
- **u (unicode)**: treat the text as full Unicode, so `\p{L}` (any letter) and emoji work.
- **Replace with**: `$1`, `$2` insert numbered groups, `$<name>` a named group, `$&` the whole match.

The match list shows up to 1,000 matches. A pattern that cannot be read, such as a lone `(`, shows a plain error message instead.

## Worked example

Pattern `(\d{3})-(\d{4})` with flag g, on the text "call 555-1234 or 555-9876":

- 2 matches: "555-1234" at position 5 and "555-9876" at position 17.
- In the first match, group 1 is "555" and group 2 is "1234".
- Replace with `$2` gives "call 1234 or 9876".

## FAQs

**Why does my pattern from another language behave differently?** Engines differ a little: Python, PHP and .NET have extras JavaScript lacks, and the reverse. Open "Cheat sheet" for the JavaScript basics.

**How do I match a dot or a bracket literally?** Put a backslash before it: `\.` or `\(`.

**What does "(not matched)" mean in the groups?** That group is optional and took no part in this match.
