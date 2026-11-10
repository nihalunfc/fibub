---
title: "How date maths works: exact ages, day counts and month ends"
summary: "Why counting days, months and birthdays is trickier than it looks, and how the date calculator handles leap years, short months and the end-day question."
tools: [date-calculator, document-expiry, citizenship-days, timestamp-converter]
updated: 2026-11-10
sources:
  - "Gregorian calendar rules: a leap year is divisible by 4, except century years not divisible by 400."
  - "The month-end rule (a date that does not exist in the target month moves back to that month's last day) is the convention most spreadsheets and date libraries follow."
---

The date calculator answers three everyday questions about the calendar: how old someone is to the day, how many days (and working days) sit between two dates, and what date you land on after adding or taking away days, weeks, months or years. It suits anyone filling in a form that asks for an exact age, a teacher counting school days in a term, or a freelancer working out when a 90-day invoice falls due. If the date you care about is a passport or permit running out, the [[document-expiry]] tracker keeps an eye on it for you, [[citizenship-days]] adds up days spent in a country, and the [[timestamp-converter]] turns a date into the numbers computers use.

## What it is

A calendar is not a ruler. Days are all the same length, but months run from 28 to 31 days and years from 365 to 366. That makes two kinds of date sums.

**Day sums** are simple. The tool stores every date as a whole number of days and subtracts. Two dates one week apart are always 7 apart, whatever the month.

**Month and year sums** need a rule. "One month after 31 January" has no exact answer, because February has no 31st. The calculator keeps the same day of the month when it can, and otherwise steps back to the last day of the shorter month.

An **exact age** combines both. The tool counts how many whole months fit between the birth date and the chosen day, splits those into years and months, then counts the leftover days.

A **leap year** has 366 days, with 29 February. The Gregorian rule is: divisible by 4, except century years, which must also divide by 400.

**Weekdays** here means Monday to Friday. Public holidays are not removed, because they differ from one region to the next.

## How to use it

1. Pick one of the three tabs at the top: **Age**, **Days between** or **Add or subtract**.
2. In **Age**, set the **Date of birth**. **Age on** starts as today; change it to see an age on any other day, such as the closing date of an application.
3. In **Days between**, set **From** and **To**. Tick **Count the end day too** if both the first and last day should count, as for a booking or a holiday.
4. In **Add or subtract**, set the **Start date**, choose **Add** or **Subtract**, type a whole number in **How many**, and pick **Days**, **Weeks**, **Months** or **Years** as the **Unit**.
5. Read the answer in large type and the sentence under it, which spells out the working and any adjustment the tool made.
6. Press **Reset** to bring back the example dates.

## A worked example

**Age of a leap-day baby.** Someone was born on 29 February 2008. On 10 November 2026 the Age tab gives **18 years, 8 months, 12 days**. That is **6,829 days**, or about **975 weeks**. Since 2027 is not a leap year, the tool marks the next birthday on **Sunday 28 February 2027**, **110 days** away, when they turn 19.

**Days in a school term.** A term runs from Tuesday 8 September 2026 to Friday 18 December 2026. With the box unticked the answer is **101 days**: 14 weeks and 3 days, or 3 months and 10 days, with **73 weekdays**. Tick **Count the end day too** and it becomes **102 days** with **74 weekdays**, because the final Friday is now counted.

**Payment terms.** An invoice dated 30 November 2026 is due in 3 months. Add 3 months and the answer is **Sunday 28 February 2027**; February 2027 has no 30th, so the tool steps back to its last day. Working the other way, a bill due on 15 March 2027 with 90-day terms was issued on **Tuesday 15 December 2026** (15 March 2027 minus 90 days).

## Where it is used

- **Forms and eligibility:** school admissions, sports age groups and pension rules often ask for age on a fixed cut-off date, not today.
- **Contracts and notice periods:** a 30-day notice and a one-month notice can end on different days. Run both and see.
- **Project planning:** count weekdays between a kick-off and a deadline to see how many working days you really have.
- **Travel:** days between arrival and departure, with the end day ticked, match how many days you are actually there.

## Common mistakes

- **Mixing nights and days.** A hotel stay from Friday to Sunday is 2 nights but 3 days. Decide which you mean, then set the end-day box to match.
- **Adding months one at a time.** 31 January plus 1 month is 28 February, and plus another month is 28 March. But 31 January plus 2 months in one go is 31 March. If the rule says "two months", add 2 in one step.
- **Treating a month as 30 days.** A month after 1 February is 1 March, only 28 days later in 2026. If a rule says "30 days", use the Days unit, not Months.
- **Forgetting holidays.** The weekday count is Monday to Friday only. Subtract your local public holidays yourself.
- **Using a far-past date.** Countries switched to the Gregorian calendar at different times, some as late as the 20th century, so old dates in records may be on another calendar.

## Questions people ask

**Does a time zone or a clock change ever shift the answer?** No. The calculator treats each date as a whole calendar day, so a daylight saving change cannot add or lose a day.

**Why does the Days between tab show months and days as well as weeks?** Because both are useful. Weeks and days are exact; months and days follow the same month-end rule as the Age tab, which reads more naturally for longer spans.

**Can I count backwards from a deadline?** Yes. In **Add or subtract**, choose **Subtract**, put the deadline as the start date, and type how far back you need to start.
