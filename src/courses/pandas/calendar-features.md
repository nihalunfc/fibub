---
title: 'Weekdays, months and fiscal periods'
summary: 'Pull calendar features out of dates with the .dt accessor: weekday names, weekends, month, quarter, week numbers, fiscal years that start in another month, and a sales-by-weekday table in the right order.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: "What does orders['date'].dt.dayofweek give for a Monday?"
    choices: ['0', '1', "'Mon'"]
    ans: 0
    why: 'Monday is 0 and Sunday is 6. Use .dt.day_name() for the name.'
  - q: 'Why do weekday names come out in alphabetical order after a groupby?'
    choices: ['Text sorts A to Z; make it an ordered category or group on the number', 'pandas does not know the week', 'Because of the index']
    ans: 0
    why: "Friday, Monday, Saturday... is alphabetical. An ordered Categorical keeps Monday first."
  - q: 'A fiscal year starts on 1 April. Which fiscal year is 15 February 2026 in?'
    choices: ['FY2026 (Apr 2025 to Mar 2026)', 'FY2025', 'FY2027']
    ans: 0
    why: "dt.to_period('Q-MAR') or a shifted month gives the year that ends in March 2026."
---

**Module 7 · about 15 minutes · uses Lesson 3.5.** You'll be able to slice sales by weekday, weekend, month and fiscal period.

## 1. The .dt accessor

A date column hides many useful columns. `.dt` pulls them out:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
cal = pd.DataFrame({
    'date': orders['date'],
    'weekday': orders['date'].dt.day_name(),
    'dow': orders['date'].dt.dayofweek,          # Monday 0 ... Sunday 6
    'weekend': orders['date'].dt.dayofweek >= 5,
    'month': orders['date'].dt.month,
    'quarter': orders['date'].dt.quarter,
    'iso_week': orders['date'].dt.isocalendar().week,
})
cal.drop_duplicates('date').head(8)
```

Think of the date as a label on a calendar page: the weekday, the month and the week number are all printed on the same page. `.dt` reads them off.

## 2. Sales by weekday, in the right order

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
orders['weekday'] = pd.Categorical(orders['date'].dt.day_name(), categories=days, ordered=True)
n_days = orders.groupby('weekday', observed=True)['date'].nunique()
units = orders.groupby('weekday', observed=True)['qty'].sum()
pd.DataFrame({'units': units, 'days': n_days, 'per_day': (units / n_days).round(1)})
```

Two habits here:

- An **ordered category** keeps Monday first instead of alphabetical order.
- Divide by the **number of each weekday** in the data. This data is exactly 78 weeks long, so every weekday appears 78 times, but most stretches of dates are not: a month can hold five Saturdays and four Mondays, so totals alone are not a fair comparison.

## 3. Fiscal years and periods

Many companies start their year in another month (1 April in India, Canada's federal government and the UK tax year; 1 February for many retailers). A **period with an anchor** does this in one line:

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['fq'] = orders['date'].dt.to_period('Q-MAR')     # fiscal quarters, year ends in March
orders['fy'] = orders['fq'].dt.qyear                     # fiscal year label
orders['ym'] = orders['date'].dt.to_period('M')          # calendar month as a period
orders.groupby(['fy', 'fq'])['qty'].sum()
```

`'Q-MAR'` means "quarters of a year that ends in March": April to June is Q1 of the year that ends next March. Check one date by hand whenever you set this up.

## 4. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
# Add a column weekend (True on Saturday and Sunday).
# Show average qty per order line for weekend vs weekday, rounded to 2 decimals.
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['weekend'] = orders['date'].dt.dayofweek >= 5
orders.groupby('weekend')['qty'].mean().round(2)
```
```python check
assert 'weekend' in orders.columns, 'Add a weekend column to orders.'
assert orders['weekend'].sum() == (orders['date'].dt.dayofweek >= 5).sum(), 'weekend should be dayofweek >= 5.'
exp = orders.groupby(orders['date'].dt.dayofweek >= 5)['qty'].mean().round(2)
assert isinstance(_, pd.Series) and len(_) == 2 and list(_.values) == list(exp.values), 'Group by weekend and take the mean of qty.'
```
```hint
orders['date'].dt.dayofweek >= 5 is True on Saturday (5) and Sunday (6). Then groupby('weekend')['qty'].mean().
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a date is a point on several cycles at once: the week (7 days), the month, the quarter and the year. Each `.dt` feature names the position on one cycle, so you can group by it and see that cycle's pattern.

**Fair comparison:** when you compare weekdays or months, compare **per day**, not totals, because the number of Mondays or the number of days in a month differs:

```math
\text{per day}_w = \frac{\text{total}_w}{\text{number of days of type } w}
```

**Week numbers:** ISO weeks start on Monday, and week 1 is the week with the year's first Thursday, so 1 January can fall in week 52 or 53 of the year before. Use `isocalendar()` for both the ISO year and the week together.
</details>

## 5. Practice

1. Which month of 2025 had the most units per day?
2. Label each date as "Q1", "Q2"... of a fiscal year starting 1 February.
3. Why might 2026-01-01 be in ISO week 1, but 2027-01-01 be in week 53?

<details>
<summary>Answers</summary>

1. `d = orders.groupby('date')['qty'].sum().loc['2025']; d.resample('MS').mean().idxmax()` (resample on a daily series averages per day).
2. `'Q' + orders['date'].dt.to_period('Q-JAN').dt.quarter.astype(str)`.
3. ISO week 1 holds the first Thursday. 1 Jan 2026 is a Thursday, so it starts week 1; 1 Jan 2027 is a Friday, so it still belongs to the last week of 2026.
</details>

**New words:** *.dt accessor*, *day of week*, *ordered category*, *fiscal year*, *anchored period*, *ISO week*.
