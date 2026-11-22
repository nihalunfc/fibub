---
title: A proper date table
seoTitle: 'Create a date table in Power BI (DAX and Power Query)'
summary: Time intelligence needs one complete calendar table marked as the date table. Build one with CALENDAR and ADDCOLUMNS, add sort columns, and connect it to every fact table.
minutes: 15
updated: 2026-11-22
quiz:
  - q: Why must a date table have every day, with no gaps?
    choices: ['It looks tidier', 'Time intelligence functions shift and count days; missing days give wrong year-to-date and last-year results', 'Power BI refuses otherwise']
    ans: 1
    why: Functions like SAMEPERIODLASTYEAR move each date back a year. If a date is missing, the matching period is incomplete and the result is wrong.
  - q: The Month column sorts April, August, December… How do you fix it?
    choices: ['Rename the months', 'Sort Month by a MonthNo column (Column tools > Sort by column)', 'Use a different font']
    ans: 1
    why: Text sorts alphabetically. Sort by column tells Power BI to order Month by its number.
  - q: What does "Mark as date table" do?
    choices: ['Colours the table', 'Tells Power BI which column is the calendar, so time intelligence uses it and the hidden auto date tables are not needed', 'Deletes other dates']
    ans: 1
    why: Marking validates the column (unique, no gaps) and makes time intelligence functions behave correctly when you filter it.
---

**Module 3 · about 15 minutes · read first: 3.2.** You'll be able to build, mark and connect a date table.

## 1. Why this matters

Every business question is about time: this month, last year, year to date, the last 28 days. All of Module 6 depends on one good date table. Interviewers ask "how do you create a date table?" because it shows you know why it matters.

## 2. What a good date table has

- **One row per day**, no gaps, covering every date in your facts (whole years is easiest: 1 January to 31 December).
- A unique **Date** column of type Date, marked as the date table.
- **Attributes** people filter by: Year, Quarter, MonthNo, Month (name), YearMonth, Day, Weekday, and maybe Fiscal Year, Week and Holiday.
- **Sort columns**: Month sorted by MonthNo, Weekday sorted by a weekday number.
- **Relationships** from Date[Date] to the date column of every fact table.

## 3. Build it with DAX

**Modeling > New table**, then:

```
Date =
ADDCOLUMNS(
    CALENDAR(DATE(2024, 1, 1), DATE(2025, 12, 31)),
    "Year", YEAR([Date]),
    "MonthNo", MONTH([Date]),
    "Month", FORMAT([Date], "MMM"),
    "YearMonth", FORMAT([Date], "yyyy-MM"),
    "Weekday", FORMAT([Date], "ddd")
)
```

`CALENDAR` makes the list of days; `ADDCOLUMNS` adds a column for each attribute, worked out row by row (`[Date]` is the current row's date). Try a short version here, and add the Quarter:

<!--fig:dax-pad calendar-table-->

`CALENDARAUTO()` finds the first and last dates in your model and covers whole years, which saves updating the dates by hand.

You can also build the date table in **Power Query** (`List.Dates`) or bring it from the data warehouse. In companies with a warehouse, use the warehouse's date dimension so every report agrees on fiscal years and holidays.

## 4. Mark it and connect it

1. Select the table > **Table tools > Mark as date table** > choose Date.
2. **Model view:** drag `Sales[Date]` to `'Date'[Date]` (one-to-many).
3. Select Month > **Column tools > Sort by column > MonthNo**.
4. Turn off Auto date/time (Lesson 1.3) so Power BI stops making hidden date tables.
5. In visuals, use columns from the **Date** table, never `Sales[Date]`, so every fact table is filtered the same way.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** time is a dimension like any other, but time intelligence needs it to be continuous. Filtering 'Date'[Year] = 2025 then asking for "the same days one year earlier" only works if both sets of days exist in one table.

**Try it:** Northbay's data covers 2024 and 2025. What happens to "last year" for January 2024? (It is blank: there is no 2023 in the data, which is correct.)
</details>

## 5. Worked example

*Northbay's finance year starts on 1 April.* Add a fiscal year column: `"Fiscal Year", IF(MONTH([Date]) >= 4, YEAR([Date]) + 1, YEAR([Date]))`, so April 2025 to March 2026 is FY2026. Year-to-date in fiscal terms then uses `TOTALYTD([Total Sales], 'Date'[Date], "3-31")`, which tells DAX the year ends on 31 March (in Power BI; this course's editor uses calendar years).

## 6. Practice

1. Why use `'Date'[Month]` rather than the date column in Sales on a chart's axis?
2. Your Weekday column sorts Fri, Mon, Sat… What do you add?
3. A new 2026 file arrives. What must change in a CALENDAR-based date table, and what about CALENDARAUTO?

<details>
<summary>Answers</summary>

1. So the same filter reaches every fact table through the Date relationships, and time intelligence works.
2. A weekday number column (e.g. `WEEKDAY([Date], 2)`, Monday = 1) and Sort by column.
3. CALENDAR's end date must be changed to 2026-12-31. CALENDARAUTO extends itself on refresh.
</details>
