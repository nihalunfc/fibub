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
related: [document-expiry, timestamp-converter, jet-lag-planner, citizenship-days]
sources:
  - "Business-day holidays are calculated from published rules, not copied lists: US federal holidays (5 U.S.C. 6103, observed on the Friday or Monday for weekend dates, per US OPM); Canada's federal statutory holidays (Canada Labour Code, Part III, with Victoria Day the Monday before 25 May); UK bank holidays for England and Wales (GOV.UK, with substitute days for New Year's Day, Christmas Day and Boxing Day); India's three fixed national holidays. Easter is the standard Gregorian computation. One-off days (such as a special royal bank holiday) and regional days are not included: add them as your own days off, and check the official source for the year you need."
  - "Gregorian calendar arithmetic; the month-end rule (31 January plus 1 month is 28 February) is the common convention used by spreadsheets and most date libraries. fibub's own working."
flow:
  - { icon: calendar, label: "Pick dates" }
  - { icon: calculator, label: "Count" }
  - { icon: check, label: "Answer" }
---

## What it does

Four small date calculators in tabs. **Age** gives an exact age in years, months and days, the days lived and the next birthday. **Days between** counts days, weeks, months, hours and weekdays (Monday to Friday) between two dates. **Add or subtract** moves a date by days, business days, weeks, months or years. **Countdown** shows how many days, weeks and business days remain until a date (or have passed since it).

Each tab has an example filled in, and the answer updates as you type. Everything runs in your browser and nothing is sent anywhere. To get a reminder before a passport or permit runs out, use [[document-expiry]]; to turn a date into a Unix time, try [[timestamp-converter]].

## How to use it

1. Pick a tab.
2. Choose the dates with the date boxes (and, for adding, the number and unit). In Countdown, tap New Year's Day, Christmas Day or End of this year to fill the date.
3. Read the answer and the sentence under it.
4. For business days, open **Business days and holidays** under the tabs: pick your weekend and a region, and add your own days off.

## What each setting does

- **Date of birth / Age on**: the age is worked out on the second date, which starts as today.
- **From / To**: if To is before From, the two are swapped and the page says so.
- **Count the end day too**: off, it counts nights (1 January to 2 January is 1 day); on, both days count (2 days).
- **Add or subtract, How many, Unit**: whole numbers only. Weeks are 7 days. Business days skip your weekend and holidays, and the start day itself is not counted.
- **Countdown**: the From date starts as today; change it to count from any day. A date in the past reads as "days ago". "Sleeps" is the same as the days to go.
- **Weekend**: Saturday and Sunday, Friday and Saturday (the weekend in several Gulf states), or Sunday only.
- **Public holidays to skip**: none, United States (the 11 federal holidays, moved to Friday or Monday when they fall on a weekend), Canada (federal), United Kingdom (England and Wales bank holidays, with Christmas and Boxing Day moved to the next weekday) or India (only the three fixed national days: Republic Day, Independence Day and Gandhi Jayanti, because festival dates change every year). Regional, religious and one-off holidays are not included: type those in **Your own days off**, as year-month-day dates.

## Worked example

Someone born on 15 May 1990 is **36 years, 5 months, 26 days** old on 10 November 2026: 13,328 days. Their next birthday is Saturday 15 May 2027, 186 days later.

From 1 January 2026 to 31 December 2026 is **364 days**, or 365 with the end day counted. That span has 260 weekdays, or 261 with the end day, which is a Thursday.

Adding 1 month to 31 January 2026 gives **28 February 2026**.

## FAQs

**What happens when the month is shorter?** Adding months keeps the same day of the month, but when that day does not exist the answer moves back to the last day of the month. So 31 January plus 1 month is 28 February (29 February in a leap year), and 31 March minus 1 month is 28 February.

**When is the next birthday for someone born on 29 February?** In common years the page uses 28 February.

**Are public holidays taken off the weekday count?** Not unless you choose a region or type your own days off; then the page also shows the business-day count and lists the holidays it skipped. Holidays are worked out from each region's rules, so check the official source for the year you need, especially for one-off days.

**Why does the business-day count differ from the weekday count?** Weekdays are just Monday to Friday. Business days also remove the holidays and use the weekend you chose.

