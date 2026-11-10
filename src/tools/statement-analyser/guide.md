---
name: Statement analyser
num: 1751
shelf: money
section: budgeting
title: "Statement analyser: see where your money goes and find subscriptions"
summary: "Open a bank or card export (CSV, OFX or QIF) and see spending by category and month, your top shops and charges that repeat. Nothing is uploaded."
status: live
ads: false
order: 1751
icon: chart
works: offline
updated: 2026-11-10
related: [budget-calculator, bill-calendar, debt-snowball, statement-to-csv]
sources:
  - "Categories come from an editable list of keywords. They are a starting point, not advice from your bank."
flow:
  - { icon: file, label: "Open export" }
  - { icon: table, label: "Sort" }
  - { icon: chart, label: "See totals" }
  - { icon: calendar, label: "Find repeats" }
---

## What it does

Download a few months of transactions from your bank, and this tool shows where the money went: spending by category, month by month, the places you spend most at, and the charges that come round again and again, such as streaming, a gym or an old insurance plan. For each repeating charge it shows what it costs over a year, which is often the number that makes people cancel.

Everything happens in your browser. The file is not uploaded and nothing is kept, so the page carries no ads. If you only have a PDF, turn it into a CSV first with [[statement-to-csv]]. Then use what you learn in the [[budget-calculator]], put the repeating bills on the [[bill-calendar]], and aim extra cash at debt with the [[debt-snowball]].

## How to use it

1. In your online banking, export transactions as CSV (OFX and QIF also work). Choose the file here, or paste its text. **Try an example** shows how it looks.
2. For a CSV, check the column choices: which column is the date, the description and the amount. Some banks have separate money out and money in columns; pick those instead of amount.
3. Read the results. Open **Categories and keywords** to teach it your own shops, for example add `Groceries: farm shop`. The results update as you type.

## What each setting does

- **Dates are day / month / year or month / day / year**: slash dates are ambiguous, so the tool guesses from your data. Change it if months look wrong.
- **My card shows spending as positive numbers**: some credit cards list purchases as plus numbers. Tick this to flip them.
- **Remember my category rules**: off by default. When ticked, only your rule list is kept in this browser, never the statement. Untick to erase it.
- **Transfers** (between your own accounts, card payments) are left out of income and spending so they do not count twice.

## Worked example

Three months of a small account: pay of 3,000 each month, rent of 1,100, groceries about 85, a bus pass and a streaming service at 15.99 on the 3rd of every month. The tool shows the streaming charge as a monthly repeat costing 191.88 a year, rent as the biggest category and about 1,800 left over each month.

## FAQs

**Why are some shops in Other?** The keyword list is short. Add the shop name to a category line and it moves.

**How does it spot a repeating charge?** The same shop, a similar amount, and a steady gap (weekly, monthly, quarterly or yearly), at least three times, or twice for quarterly and yearly.

**Is my data sent anywhere?** No. It works offline once the page has loaded.
