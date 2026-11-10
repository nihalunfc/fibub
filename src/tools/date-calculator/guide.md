---
name: Date calculator
num: 2050
shelf: everyday
code: T933
section: reminders-travel
title: "Date calculator: age, days between dates and adding days, weeks or months"
summary: "Work out an exact age in years, months and days with the next birthday, count the days and weekdays between two dates, or add and subtract days, weeks, months or years."
status: live
ads: false
order: 2050
icon: calendar
works: offline
updated: 2026-11-10
related: [document-expiry, timestamp-converter, jet-lag-planner]
sources:
  - "Gregorian calendar arithmetic; the month-end rule (31 January plus 1 month is 28 February) is the common convention used by spreadsheets and most date libraries. fibub's own working."
flow:
  - { icon: calendar, label: "Pick dates" }
  - { icon: calculator, label: "Count" }
  - { icon: check, label: "Answer" }
---

## What it does

Three small date calculators in tabs. **Age** gives an exact age in years, months and days, the days lived and the next birthday. **Days between** counts days, weeks, months and weekdays (Monday to Friday) between two dates. **Add or subtract** moves a date by days, weeks, months or years.

Each tab has an example filled in, and the answer updates as you type. Everything runs in your browser and nothing is sent anywhere. To get a reminder before a passport or permit runs out, use [[document-expiry]]; to turn a date into a Unix time, try [[timestamp-converter]].

## How to use it

1. Pick a tab.
2. Choose the dates with the date boxes (and, for adding, the number and unit).
3. Read the answer and the sentence under it.

## What each setting does

- **Date of birth / Age on**: the age is worked out on the second date, which starts as today.
- **From / To**: if To is before From, the two are swapped and the page says so.
- **Count the end day too**: off, it counts nights (1 January to 2 January is 1 day); on, both days count (2 days).
- **Add or subtract, How many, Unit**: whole numbers only. Weeks are 7 days.

## Worked example

Someone born on 15 May 1990 is **36 years, 5 months, 26 days** old on 10 November 2026: 13,328 days. Their next birthday is Saturday 15 May 2027, 186 days later.

From 1 January 2026 to 31 December 2026 is **364 days**, or 365 with the end day counted. That span has 260 weekdays, or 261 with the end day, which is a Thursday.

Adding 1 month to 31 January 2026 gives **28 February 2026**.

## FAQs

**What happens when the month is shorter?** Adding months keeps the same day of the month, but when that day does not exist the answer moves back to the last day of the month. So 31 January plus 1 month is 28 February (29 February in a leap year), and 31 March minus 1 month is 28 February.

**When is the next birthday for someone born on 29 February?** In common years the page uses 28 February.

**Are public holidays taken off the weekday count?** No. They differ by region.

