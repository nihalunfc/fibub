---
title: Year, quarter and month to date
seoTitle: 'DAX TOTALYTD, DATESYTD, QTD and MTD with examples'
summary: Running totals that reset each year, quarter or month. Use TOTALYTD and DATESYTD, see which dates they keep for each cell, and handle fiscal years.
minutes: 15
updated: 2026-11-22
quiz:
  - q: On the March 2025 row, which dates does DATESYTD('Date'[Date]) return?
    choices: ['Only March 2025', '1 January 2025 to 31 March 2025', 'All of 2025']
    ans: 1
    why: DATESYTD takes the last visible date (31 March 2025) and returns every date from the start of that year up to it.
  - q: What is TOTALYTD([Total Sales], 'Date'[Date]) the same as?
    choices: ['SUM(Sales[Amount])', 'CALCULATE([Total Sales], DATESYTD(''Date''[Date]))', 'SAMEPERIODLASTYEAR']
    ans: 1
    why: TOTALYTD is shorthand for CALCULATE with DATESYTD as the filter. The CALCULATE form is more flexible (you can add filters).
  - q: Why must the Date table be marked as a date table for these functions?
    choices: ['For colours', 'So setting a filter on Date[Date] removes the other Date filters (like Month) that would otherwise still limit the result', 'It does not matter']
    ans: 1
    why: On a March row the visual filters Month too. Marking the date table makes the time intelligence filter replace all Date filters, so January and February can come back in.
---

**Module 6 · about 15 minutes · read first: 5.2 and 3.3.** You'll be able to write year-, quarter- and month-to-date measures and explain how they choose dates.

## 1. Why this matters

"Year to date" is on almost every sales dashboard and in nearly every BI job interview. It's also the gentlest introduction to time intelligence: CALCULATE with a table of dates as the filter.

## 2. See it climb

<!--fig:dax-pad ti-ytd-->

Trace March 2025: the visual's filter is the 31 days of March; CALCULATE replaces it with the dates from 1 January to 31 March, and the sum runs over those.

Try it: pick a time function and move the month, and see which months are selected.

<figure class="fig" data-fig="@biz-time-intel"><figcaption>Notice that YTD restarts every January and that last year's version is blank in the first year.</figcaption></figure>

## 3. The functions

| Measure | Code |
|---|---|
| Year to date | `TOTALYTD([Total Sales], 'Date'[Date])` or `CALCULATE([Total Sales], DATESYTD('Date'[Date]))` |
| Quarter to date | `TOTALQTD(…)` or `CALCULATE([Total Sales], DATESQTD('Date'[Date]))` |
| Month to date | `TOTALMTD(…)` or `CALCULATE([Total Sales], DATESMTD('Date'[Date]))` |
| Fiscal year to date (year ends 31 March) | `TOTALYTD([Total Sales], 'Date'[Date], "3-31")` |

<!--fig:dax-pad ti-qtd-->

Prefer the CALCULATE form in real models: you can add filters (`CALCULATE([Total Sales], DATESYTD('Date'[Date]), Store[Region] = "West")`) and it reads the same as every other measure.

## 4. Two things that trip people up

1. **The total row.** With no date filter, the last visible date is 31 December 2025, so YTD at the total shows 2025's full year. That's correct but surprising: consider hiding it or labelling it.
2. **Future dates.** A date table that runs to 31 December shows YTD rising flat through months that haven't happened yet. Limit it with `IF(MAX('Date'[Date]) <= TODAY(), …)` or a column marking dates with data.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** time intelligence functions are table functions that return a set of dates, computed from the dates visible in the current filter context. CALCULATE then uses that set as the filter on the date column (replacing every other Date filter, because the table is marked as a date table).

```math
\text{DATESYTD} = \{\, d : \text{year}(d) = \text{year}(d_{\max}) \text{ and } d \le d_{\max} \,\}
```

where `$d_{\max}$` is the last visible date.
</details>

## 5. Worked example

*Northbay, end of March 2025.* Sales: January 18,238, February 13,369, March 21,792. YTD on the March row: 18,238 + 13,369 + 21,792 = 53,400 (rounded), which matches the editor. On the April row the dates run to 30 April and the YTD grows by April's sales.

## 6. Practice

1. Write `Sales MTD`.
2. Write `West YTD`: year-to-date sales for the West region only.
3. Split by Year (not month). What does YTD show for 2024, and why?

<details>
<summary>Answers</summary>

1. `CALCULATE([Total Sales], DATESMTD('Date'[Date]))`.
2. `CALCULATE([Total Sales], DATESYTD('Date'[Date]), Store[Region] = "West")`.
3. 2024's full-year sales: the last visible date of 2024 is 31 December, so YTD covers the whole year.
</details>
