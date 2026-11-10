---
name: Timesheet
num: 1775
shelf: money
section: pay
title: "Timesheet calculator: weekly hours, breaks, overnight shifts and overtime pay"
summary: "Enter start and end times for a week to get total and decimal hours, unpaid breaks, overnight shifts, overtime and pay. Download as CSV or print."
status: live
ads: false
order: 1775
icon: clock
works: offline
updated: 2026-11-10
related: [hourly-salary, shift-scheduler]
sources:
  - "Overtime rules: ontario.ca (Employment Standards Act guide), canada.ca (federal labour standards, hours of work), US Department of Labor Fact Sheet 23, gov.uk (Overtime: your rights), all checked 2026-11-10. Other provinces and India are not confirmed on an official page: check the official source."
flow:
  - { icon: clock, label: "Add times" }
  - { icon: scissors, label: "Breaks" }
  - { icon: calculator, label: "Overtime" }
  - { icon: download, label: "CSV or print" }
---

## What it does

A timesheet turns a week of start and end times into hours you can pay or be paid for. This one takes away the breaks you did not get paid for, handles shifts that end after midnight, and shows your total in hours and minutes and in decimal hours, which is what most payroll forms ask for. It then splits the week into regular and overtime hours using a rule you choose and works out the pay before tax.

Keep the same page for each week and download the result as a CSV for a spreadsheet, or print it to sign. To check your rate, try the [[hourly-salary|salary converter]]; to test the overtime rules on their own, use the [[overtime-calculator]]; to plan who works when, see the [[shift-scheduler]].

## How to use it

1. Pick the first day of your week (optional) and type your hourly pay.
2. For each day you worked, enter the start time, the end time and your unpaid break in minutes.
3. Choose the overtime rule for your place, or set your own thresholds.
4. Read the totals, then download the CSV or print the page.

## What each setting does

- **Round each day to:** rounds every day to the nearest 5, 6 or 15 minutes, as some employers do. Choose No rounding to see exact time.
- **Overtime after, per day / per week:** hours above these count as overtime. Use 0 for no limit. When both apply, the higher overtime total is used (British Columbia adds weekly overtime on top of daily overtime).
- **Overtime pays:** 1.5 means time and a half.
- **Double time after:** hours beyond this in one day pay the double-time rate (British Columbia, after 12 hours).

## Worked example

You work 9:00 to 18:00 with a 30 minute break, Monday to Friday. Each day is 8.5 hours, so the week is 42.5 hours (42:30). With the United States rule at 20 an hour, 40 hours are regular and 2.5 are overtime: 40 x 20 + 2.5 x 30 = 875.

## FAQs

**How do I enter a night shift?** Type the start (22:00) and the end (06:00). Because the end is earlier, the tool counts it as the next morning, and the hours go to the day you started.

**Are these overtime rules exact?** They are short summaries. Ontario, federal Canada, the US and the UK were checked on official pages; the others say "check the official source". Your contract or a union agreement may be better than the law.

**What are decimal hours?** Minutes as a fraction of an hour: 7 hours 30 minutes is 7.50.

**Is my timesheet saved?** No. It stays on this page and disappears when you close it, so download the CSV if you need it.
