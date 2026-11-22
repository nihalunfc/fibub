---
name: End-of-day close assistant
num: 3089
shelf: money
code: T1070
section: small-business
title: "End-of-day close assistant: a checklist, balanced takings and a daily report"
summary: "A guided checklist for closing the day, balancing each cashier's takings against the system, and producing the daily report with month and year to date."
status: live
ads: false
order: 3089
icon: check
works: offline
updated: 2026-11-22
related: [kpi-dashboard, task-board, revenue-dashboard, invoice-maker]
sources:
  - "Over and short are counted minus expected, per line. Month and year to date add the closed days kept in this session to today, and ratios are worked out from the totals, not by averaging daily ratios."
  - "The example steps are common closing routines (hotel night audit, restaurant cash-up, shop closing). Change them to match your business. The example numbers are made up. Not accounting or tax advice."
flow:
  - { icon: check, label: "Checklist" }
  - { icon: coin, label: "Balance" }
  - { icon: table, label: "Figures" }
  - { icon: curve, label: "Report" }
---

## What it does

Closing the day is a routine job that is easy to get wrong when you are tired: a step forgotten, a till that does not balance, a figure typed into the wrong place. This assistant puts the whole job on one page. You tick through your own checklist (each tick is time-stamped), balance every cashier and every way of paying against what the system expected, enter the day's figures, and get a one-page report with today, month to date and year to date. It was built for a hotel night audit, but it works for any business that balances takings each day: a restaurant, shop, clinic, salon or market stall.

The balancing table is the heart of it. For each cashier and payment type you enter what the system says was taken and what you counted. The difference is shown as an over or a short, with amber for a difference inside your tolerance and red for one outside it, so you know which lines to recount before you leave. Then close the day to add it to the history. The month and year to date totals build up from there, and you can compare the picture with the [[kpi-dashboard]] or plan tomorrow's work on the [[task-board]].

## How to use it

1. **Step 1:** choose an example, set the day and your name, and work through the checklist. Add or remove steps to match your routine.
2. **Step 2:** enter expected and counted for each cashier and way of paying. Set the tolerance, the amount you accept as a rounding difference.
3. **Step 3:** enter the number sold, the places available, the main sales, tax and any other sales.
4. **Read the report,** then press Close this day. Download the report or the history as a CSV, or print it.

## What each setting does

- **Tolerance per line**: differences up to this amount show amber; larger ones show red.
- **Number you could have sold**: the places for the day, used to work out use of capacity. Leave it blank if it does not apply.
- **Remember**: off by default. When ticked, your steps, lines and closed days stay in this browser only. There is a Clear button. Without it, closed days live only in this tab, so download the history.

## Worked example

A cashier's cash line expected 1,000.00 and counted 998.50: the difference is -1.50, short, which is inside a tolerance of 5, so it shows amber. A second cashier's cash line expected 500.00 and counted 530.00: +30.00, over and outside the tolerance, so it is red and should be recounted. The total over or short for the night is -1.50 + 30.00 = +28.50. If the month so far has sales of 40,000 over 4 closed days and today is 10,000, month to date is 50,000.

## FAQs

**Does it post to my system?** No. It checks and records. Keep running your own end-of-day reports.

**What is over and short?** Over means you counted more than the system expected; short means less.

**Are my numbers uploaded?** No. Everything stays on your device, and nothing is saved unless you tick the box.

**Why are month and year to date wrong?** They only include days you closed here. Close earlier days or enter them to build the history.

**Can I use it for a business that sells nothing by the unit?** Yes. Leave the places blank and use the number sold for transactions.
