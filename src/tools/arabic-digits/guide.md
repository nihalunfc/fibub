---
name: Arabic digits
num: 2258
shelf: documents
code: T994
section: text-tools
title: "Arabic digits converter: Eastern Arabic and Persian numerals to 0-9"
summary: "Convert Eastern Arabic digits (٠١٢٣٤٥٦٧٨٩) and Persian or Urdu-style digits (۰۱۲۳۴۵۶۷۸۹) to Western 0-9 and back, with Arabic decimal and thousands marks, in your browser."
status: live
ads: true
order: 2258
icon: convert
works: offline
updated: 2026-11-16
related: [text-cleaner, case-converter, unit-converter]
sources:
  - "Unicode Standard, Arabic block: Arabic-Indic digits U+0660 to U+0669, Extended Arabic-Indic (Persian and Urdu) digits U+06F0 to U+06F9, decimal separator U+066B, thousands separator U+066C, Arabic comma U+060C (checked 2026-11-16)."
flow:
  - { icon: pencil, label: "Paste text" }
  - { icon: convert, label: "Pick style" }
  - { icon: check, label: "Read it" }
  - { icon: copy, label: "Copy" }
---

## What it does

Numbers in Arabic, Persian and Urdu text often use their own digit shapes. Spreadsheets, forms and databases usually want plain 0-9. This tool swaps the digits in whatever you paste, and leaves every other letter alone. It also turns the Arabic decimal mark (٫) and thousands mark (٬) into a dot and a comma, and the Arabic comma (،) into a normal comma.

Everything happens on this page and nothing is uploaded. To tidy the text first use the [[text-cleaner]], or change letter case with the [[case-converter]]; for units after you have your numbers, try the [[unit-converter]].

## How to use it

1. Paste or type text in the box.
2. Choose a direction: **To Western digits**, **To Eastern Arabic digits** or **To Persian style digits**.
3. The result appears below as you type. Press **Copy** to copy it.
4. Under **Read a number**, type one number to see it grouped in thousands.

## What each setting does

- **To Western digits**: ٠-٩ and ۰-۹ become 0-9; ٫ becomes a dot, ٬ becomes a comma, ، becomes a comma.
- **To Eastern Arabic digits**: 0-9 become ٠-٩; a dot between digits becomes ٫ and a comma between digits becomes ٬.
- **To Persian style digits**: 0-9 become ۰-۹. Persian and Urdu use the same marks as Arabic.
- **Read a number**: shows the value in Western digits with commas every three digits.

## Worked example

Paste ١٢٣٤٥٫٦٧ and choose Western digits. You get 12345.67. Read a number groups it as 12,345.67. Going back with Eastern Arabic digits gives ١٢٬٣٤٥٫٦٧ when you start from 12,345.67. Note that the Arabic digits 4, 5 and 6 differ from Persian 4, 5 and 6 (٤٥٦ against ۴۵۶), so a number can look similar and still be different characters.

## FAQs

**Why do 4, 5 and 6 look different in Persian?** Persian uses its own shapes for those three: ۴ ۵ ۶. The others look the same but are different characters in Unicode.

**Does it change letters or words?** No, only digits and the three marks above.

**Do the numbers read right to left?** Digits within a number are shown left to right, even in right-to-left text. This tool keeps the order you typed.

**Is anything stored?** No. It all stays in your browser and works offline once the page has loaded.
