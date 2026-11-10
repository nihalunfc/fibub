---
name: Medical bill checker
num: 1970
shelf: money
code: T845
section: medical-bills
title: "Medical bill checker: find duplicate and wrong charges"
summary: "Open or paste an itemised medical bill and get a list of questions to ask: repeated lines, sums that do not add up, dates outside the stay. Then get a polite letter."
status: live
ads: false
order: 1970
icon: search
works: offline
updated: 2026-11-10
related: [claim-packet, medical-expense-tax, debt-snowball]
sources:
  - "The checks are simple arithmetic and date comparisons written by fibub. No billing codes, price lists or coding books are used or copied."
  - "Your bill never leaves your device; there is no lookup of any kind."
flow:
  - { icon: file, label: "Open bill" }
  - { icon: check, label: "Check lines" }
  - { icon: pencil, label: "Mark items" }
  - { icon: download, label: "Get letter" }
---

## What it does

Medical bills are long and hard to read. This tool takes the itemised bill you already have, lines it up in a table you can fix, and runs a few plain checks: the same line twice, quantity times price not matching the amount, lines that do not add up to the printed total, and dates outside the hospital stay. Each one becomes a question, never an accusation. There can be good reasons for all of them.

It then writes a polite letter you can edit, asking the billing office for an itemised bill and an explanation of the lines you flagged. Everything happens in your browser. Next steps: sort the paperwork with the [[claim-packet|claim packet builder]], see what counts for tax in the [[medical-expense-tax|medical expense tax helper]], or plan payments with the [[debt-snowball]] planner.

## How to use it

1. Open a PDF with selectable text, a CSV or an Excel file, or paste the lines. Press **Read the lines**.
2. Check the table. Fix any date, quantity or amount that was read wrongly, or add and remove lines.
3. Type the admission and discharge dates and the total printed on the bill, if you have them.
4. Tick **Not sure** on a line you do not think you received.
5. Read the questions, edit the letter, and download it as PDF or Word.

## What each option does

- **Dates are written**: day first or month first, so 03/04/2026 is read the way you write it.
- **Currency**: only changes how amounts are shown.
- **Admission and discharge**: lines dated outside them become a question.
- **Total printed on the bill**: compared with the sum of the lines.
- **Not sure**: adds a "what was this for?" question for that line.

Scanned paper or a photo has no text for the tool to read yet. Type or paste the lines for now.

## Worked example

Use the example button. It has a room charge listed twice (3 x 400.00), a blood panel of 2 x 45.00 shown as 80.00, and a dressing pack dated 9 March, after a discharge on 5 March. The tool lists three questions, and the letter names those three lines.

## FAQs

**Does it say my bill is wrong?** No. It lists things to ask about. The billing office can explain them.

**Is my bill uploaded?** No. Nothing leaves your device.

**Why is a round amount flagged?** Round-number and "misc" lines are worth asking about. It is only a question.

**Can it look up what a procedure should cost?** No. It only compares the numbers on your own bill.

This is not tax, billing or legal advice.
