---
name: Reagent inventory
num: 811
shelf: science
section: lab-management
title: "Reagent inventory for the lab: expiry dates, low stock, lots and locations (CSV import and printable list)"
summary: "Keep a list of your lab's reagents with location, amount, lot, opened date and expiry. See what has expired, what expires soon and what is running low, search and filter, import or export a spreadsheet, and print the list. The list stays in your browser."
status: live
ads: false
order: 811
icon: flask
works: offline
updated: 2026-11-09
related: [plate-layout, solution-calculator, buffer-recipe-calculator, equipment-booking, protocol-timer, sample-label-maker, cryovial-inventory]
sources:
  - "Date handling, the expiry and low-stock rules, searching and the spreadsheet import are written by fibub and checked in the tests against Python's datetime on random dates and date formats."
  - "The example list is made up: no real supplier, lot or price. Its dates are set around today's date."
  - "Your list is saved only in this browser (localStorage), and only if you tick the box. It is never uploaded."
flow:
  - { icon: pencil, label: "Add" }
  - { icon: calendar, label: "Expiry" }
  - { icon: search, label: "Find" }
  - { icon: download, label: "CSV, print" }
---

## What it does

A shared fridge fills up with half-used bottles, and nobody knows which lot of trypsin is the old one. This page keeps a simple inventory of your reagents and tells you, every time you open it, what needs attention:

- **Expired**: the use-by date has passed. A reagent can still be used on its expiry day itself; it is flagged from the next day.
- **Expiring soon**: the use-by date falls within the number of days you choose (30 by default).
- **Low stock**: the amount left is at or below the *Reorder at* amount you set. **Empty**: the amount is zero.
- **Use within N days of opening**: media, peroxide-forming ethers, some antibodies and kits must be used within a set time after opening. Give the opening date and the number of days, and the use-by date becomes the opening date plus those days, whenever that comes before the date on the label. The table marks such dates "(opened + rule)".

You can search by any word (name, CAS or catalogue number, location, lot, supplier or notes), show only what needs attention, and sort by use-by date, name, location, or by how close each item is to its reorder level.

Print labels for new bottles with the [[sample-label-maker]], and keep frozen stocks in order with the [[cryovial-inventory]].

## How to use it

1. **Add a reagent.** Only the name is needed. Add the location, amount and unit, the reorder level, lot, supplier, the date you opened it and the expiry date from the label. Tap *Edit* on any row to change it, save a copy (handy for a new bottle from a new lot), or delete it.
2. **Or import a spreadsheet.** Paste rows from Excel or Google Sheets with a header row, or tap *Open a file* for a CSV, TSV or Excel file. Headers are matched by their usual names (Reagent, Qty, Batch, Exp. date, Use by, Vendor …), and the page lists which columns it used and any row it could not read. Choose whether dates like 03/04/2027 are day/month or month/day. A month with no day (2027-03, Mar 2027, 03/2027) means the last day of that month, as on most labels.
3. **Check the flags.** The summary at the top counts what is expired, expiring soon and low. Pick *Needs attention* to see only those.
4. **Print or download.** *Print list* prints the rows you are looking at as a plain table with an empty *Checked* column, ready for a stock check with a pen. *Download CSV* gives the same rows with a use-by and status column; the PDF, Word and image buttons make a tidy report.

## Worked example

Tap *Load the example list*. Its eight made-up reagents have dates set around today, so the summary always reads **8 reagents, 1 expired, 3 expiring within 30 days, 2 low stock or empty**:

- The Bradford reagent expired 15 days ago and its amount is 0, so it shows *Expired* and *Empty*, and it sorts to the top.
- The DMEM was opened 10 days ago with a 28-day rule, so it must be used within 18 days, long before the date on its label.
- The hydrogen peroxide was opened 170 days ago with a 180-day rule: 10 days left.
- Sodium chloride has 80 g left with a reorder level of 250 g: *Low stock*.

Set *Expiring soon* to 7 days and only the expired one is left needing attention for its date.

## Your data

Nothing is saved until you tick *Remember my list in this browser*. Ticked, the list stays in this browser on this device, so it is there the next time you open the page; untick it to remove the saved copy. Nothing is sent to fibub or anyone else, and the page works offline. Clearing your browser data removes the list, and another device will not see it, so use *Download backup (JSON)* now and then and *Open a backup* to restore it or move it. *Clear all* removes everything from this browser.

## Tips

- Give each bottle its own row when lots differ, so you always know which lot went into an experiment.
- Write locations the same way every time (the location box suggests the ones you have used) so sorting by location gives a walk-around order for stock checks.
- Use *Reorder at* for things that take weeks to arrive.

## FAQ

**Can the whole lab share one list?** Not live: the list lives in one browser. Keep one person's copy as the master and share the CSV or JSON backup, or print the list for the fridge door.

**Does it know the hazards or storage rules of a chemical?** No. It keeps only what you type. Check the safety data sheet from your supplier.

**Is "expires today" counted as expired?** No. Most labels mean "use by the end of this day", so a reagent is expired from the day after.
