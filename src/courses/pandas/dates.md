---
title: 'Dates and times'
summary: 'Turn text into real dates with to_datetime, handle mixed formats, pull out year, month and weekday with .dt, do date arithmetic with Timedelta, and filter by date ranges.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: "Why convert a date column from text to datetime?"
    choices: ['It looks nicer', 'So it sorts correctly, can be filtered by range, and gives year, month and weekday', 'pandas requires it']
    ans: 1
    why: "Text dates sort alphabetically ('Apr' before 'Jan') and can't be subtracted."
  - q: "How do you get the weekday name from a datetime column?"
    choices: ["df['date'].dt.day_name()", "df['date'].weekday", "df['date'].str.day()"]
    ans: 0
    why: 'Date parts live under .dt, just as text methods live under .str.'
  - q: 'What is (date2 − date1).dt.days?'
    choices: ['The number of whole days between them', 'The day of the month', 'An error']
    ans: 0
    why: 'Subtracting dates gives a Timedelta; .dt.days turns it into a number.'
---

**Module 3 · about 20 minutes · uses Lesson 3.3.** You'll be able to read dates in any format, take them apart, and calculate with them.

## 1. Text to dates

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv')
print(orders['date'].dtype)
orders['date'] = pd.to_datetime(orders['date'])            # ISO dates like 2025-07-04 need no help
print(orders['date'].dtype, orders['date'].min(), orders['date'].max())
```

For other layouts, give the **format**: `%Y` year, `%m` month, `%d` day, `%b` month name (Jan), `%H:%M` time.

## 2. Mixed formats

The messy export mixes `2025-07-04`, `04/07/2025` (day first) and `Jul 04 2025`. Parse each known format, then combine:

```python data=orders_messy.csv
import pandas as pd

messy = pd.read_csv('orders_messy.csv')
raw = messy['order date']
iso = pd.to_datetime(raw, format='%Y-%m-%d', errors='coerce')
dmy = pd.to_datetime(raw, format='%d/%m/%Y', errors='coerce')
mon = pd.to_datetime(raw, format='%b %d %Y', errors='coerce')
messy['date'] = iso.fillna(dmy).fillna(mon)
print('unparsed:', messy['date'].isna().sum())
messy[['order date', 'date']].sample(6, random_state=3)
```

Each `errors='coerce'` turns values in other formats into NaT; `fillna` takes the first that worked. This is safer than letting pandas guess, which can swap day and month on dates like `04/07/2025`.

## 3. Taking dates apart

```python data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['year'] = orders['date'].dt.year
orders['month'] = orders['date'].dt.month
orders['weekday'] = orders['date'].dt.day_name()
orders['week_start'] = orders['date'].dt.to_period('W').dt.start_time
orders['is_weekend'] = orders['date'].dt.dayofweek >= 5
orders[['date', 'year', 'month', 'weekday', 'week_start', 'is_weekend']].drop_duplicates().head()
```

## 4. Date arithmetic

```python data=customers.csv
import pandas as pd

customers = pd.read_csv('customers.csv', parse_dates=['signup_date'])
as_of = pd.Timestamp('2026-06-30')
customers['days_since_signup'] = (as_of - customers['signup_date']).dt.days
customers['first_renewal'] = customers['signup_date'] + pd.DateOffset(years=1)
customers[['customer_id', 'signup_date', 'days_since_signup', 'first_renewal']].head()
```

`pd.Timedelta(days=30)` is a fixed length; `pd.DateOffset(months=1)` follows the calendar (Jan 31 + 1 month = Feb 28).

## 5. Your turn

```python exercise data=orders.csv
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
# Add a column 'weekday' with the day name, then show how many order lines fell on each weekday (value_counts).
```
```python solution
import pandas as pd

orders = pd.read_csv('orders.csv', parse_dates=['date'])
orders['weekday'] = orders['date'].dt.day_name()
orders['weekday'].value_counts()
```
```python check
assert 'weekday' in orders.columns, "Add a column called 'weekday'."
assert _.index[0] == 'Saturday', f'Show weekday value_counts(); the busiest day should be Saturday, got {_.index[0]}.'
```
```hint
orders['date'].dt.day_name() gives the names; then orders['weekday'].value_counts().
```

```python exercise
import pandas as pd

s = pd.Series(['03/01/2026', '15/02/2026', '28/02/2026'])
# These are day/month/year. Convert them to dates and show the latest one.
```
```python solution
import pandas as pd

s = pd.Series(['03/01/2026', '15/02/2026', '28/02/2026'])
pd.to_datetime(s, format='%d/%m/%Y').max()
```
```python check
assert str(_)[:10] == '2026-02-28', f'Got {_}; use format="%d/%m/%Y" and .max().'
```
```hint
pd.to_datetime(s, format='%d/%m/%Y') reads day first; then .max().
```

<details class="maths" open>
<summary>How it works</summary>

**Principle:** a datetime is stored as a number: nanoseconds since 1 January 1970. That's why dates sort, subtract and compare correctly, and why `.dt` can compute the weekday or month instantly for millions of rows.

**Time zones:** dates without a zone are "naive". For data from several zones, convert with `.dt.tz_localize('America/Toronto')` and `.dt.tz_convert('UTC')` before comparing.
</details>

## 6. Practice

1. Keep orders from March 2026.
2. Number of days between each customer's signup and their first order (merge comes in Module 5; describe the steps).
3. Why is `format=` safer than letting pandas guess?

<details>
<summary>Answers</summary>

1. `orders[(orders['date'] >= '2026-03-01') & (orders['date'] < '2026-04-01')]` or `orders[orders['date'].dt.to_period('M') == '2026-03']`.
2. Find each customer's first order date (`groupby('customer_id')['date'].min()`), join it to customers, subtract `signup_date`, take `.dt.days`.
3. Guessing can read `04/07/2025` as April 7 or 4 July depending on the rest of the column; an explicit format is never ambiguous.
</details>

**Try it on your own data:** the [[timestamp-converter]] tool turns timestamps into readable dates.

**New words:** *datetime*, *to_datetime*, *format codes*, *NaT*, *.dt accessor*, *Timedelta*, *DateOffset*, *period*.
