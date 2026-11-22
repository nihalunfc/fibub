---
title: 'Tables, rows, columns and types'
seoTitle: 'SQL data types explained: INTEGER, REAL, TEXT and dates'
summary: 'What a row and a column really are, the handful of data types you need, why dates are stored as text in SQLite, and the integer-division trap that catches everyone once.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: What does typeof(order_date) return in SQLite for Northbay?
    choices: ['date', 'text', 'integer']
    ans: 1
    why: SQLite has no separate date type. Dates are stored as text in YYYY-MM-DD form, which still sorts in date order.
  - q: What is 7 / 2 in SQLite?
    choices: ['3.5', '3', '4']
    ans: 1
    why: Two whole numbers give whole-number division, which drops the remainder. Write 7 / 2.0 or multiply by 1.0 to get 3.5.
  - q: 'Why does ''2024-12-01'' < ''2025-01-15'' give the right answer, even though both are text?'
    choices: ['SQLite secretly converts them to dates', 'Year-month-day text sorts in the same order as the dates, character by character', 'It is a lucky accident']
    ans: 1
    why: Text is compared one character at a time from the left. With the biggest unit (year) first and zero-padded months and days, text order equals date order.
---

**Module 1 · about 20 minutes · read first: 1.2.** You'll be able to say what one row and one column of a table mean, check the type of any value, and avoid two classic type traps.

## 1. Why this matters

A surprising number of wrong numbers in reports come from types, not logic: an average that rounds down to a whole number, a "10" that sorts before a "9", a date stored as text in a format that doesn't sort. Analysts who check the types of their columns first catch these before their manager does.

## 2. Rows and columns

A *column* is one kind of fact, with a name and a type: `order_date`, `channel`, `status`. Every value in a column is the same kind of thing.

A *row* is one thing the table records, with one value for each column. In `orders`, one row is one checkout.

```sql
-- try
SELECT order_id, order_date, channel, status
FROM orders
LIMIT 4
```

Unlike a spreadsheet, a table has no "row 1" or "cell B7". Rows have no built-in order (you'll ask for one with ORDER BY in Lesson 2.5), and you find a row by its values, such as `order_id = 1010`, not by its position.

## 3. The types you need

SQLite stores every value as one of five *storage classes*. Four matter here:

| Type | Holds | Northbay example |
|---|---|---|
| INTEGER | whole numbers | `quantity`, `store_id` |
| REAL | numbers with decimals | `unit_price`, `discount` |
| TEXT | words, codes, dates | `city`, `status`, `order_date` |
| NULL | no value at all | store 12's `city` |

The function `typeof()` tells you which one a value is. Run this and read each column:

```sql
-- try
SELECT store_id, typeof(store_id),
       city, typeof(city),
       size_sqft, typeof(size_sqft)
FROM stores
WHERE store_id IN (1, 12)
```

Store 12 (online) shows `null` for its city and size: no value, not an empty word.

To list a table's columns and declared types, SQLite has a special command:

```sql
-- noviz
PRAGMA table_info(order_items)
```

SQL Server uses `EXEC sp_columns 'order_items'` and PostgreSQL uses `\d order_items` (or the `information_schema.columns` view, which works in both).

## 4. Dates are text here

SQLite has no date type, so Northbay stores dates as TEXT in the form `YYYY-MM-DD`. That form is chosen on purpose: because the year comes first and months and days always have two digits, comparing the text character by character gives the same answer as comparing the dates.

```sql
-- try
SELECT '2024-12-01' < '2025-01-15' AS iso_dates,
       '01/12/2024' < '15/01/2023' AS day_first
```

Both answers are 1 (true), but the second is wrong: 1 December 2024 is not before 15 January 2023. Text in day/month/year order doesn't sort as dates. SQL Server and PostgreSQL have real `DATE` types, so there you'd write `DATE '2025-01-15'`.

## 5. Text that looks like a number

Text is compared letter by letter, so `'10'` comes before `'9'` (because "1" comes before "9"). Numbers are compared by size.

```sql
-- try
SELECT '10' < '9' AS as_text,
       10 < 9 AS as_numbers
```

If a column of numbers was loaded as text, sorting and MAX will quietly go wrong. `typeof()` is how you find out.

## 6. The integer-division trap

When both sides of `/` are INTEGER, SQLite (and SQL Server) gives a whole number and drops the remainder. PostgreSQL does the same.

```sql
-- try
SELECT 7 / 2 AS whole, 7 / 2.0 AS decimal, 7 * 1.0 / 2 AS also_decimal
```

The fix is to make one side REAL: write `2.0`, multiply by `1.0`, or use `CAST(x AS REAL)`.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each column has a *domain*: the set of values it may hold. A row is one choice from each domain, so a table is a subset of the product of its columns' domains.

**Equation:** for orders, a row is a tuple (order_id, customer_id, store_id, order_date, channel, status, promo_id) taken from D<sub>id</sub> × D<sub>cust</sub> × ... × D<sub>promo</sub>. Integer division is the floor (for positive numbers): 7 / 2 = ⌊3.5⌋ = 3.

**Analogy:** a paper form. Each box (column) only accepts one kind of answer, and each filled-in form is a row. It breaks down a little in SQLite, which lets you write text into an INTEGER column; stricter databases refuse.

**Try it:** what is 11019 / 7310 in SQLite? (1, because both are whole numbers. With 11019 * 1.0 / 7310 it is about 1.51.)
</details>

## 7. Worked example

*Question:* on average, how many units does one order line hold?

1. Units sold: `SUM(quantity)` over order_items is 11,019.
2. Lines: `COUNT(*)` is 7,310.
3. Divide: 11,019 / 7,310. As whole numbers SQLite says **1**, which hides the answer. With `* 1.0` it says **1.51**.

```sql
-- try
SELECT SUM(quantity) AS units,
       COUNT(*) AS lines,
       SUM(quantity) / COUNT(*) AS wrong_avg,
       ROUND(SUM(quantity) * 1.0 / COUNT(*), 2) AS right_avg
FROM order_items
```

In fact about one line in four (25%) has more than one unit. A report showing "1" would have hidden that.

## 8. Practice

```sql
-- exercise: Show each product's name and the type of its unit_price column (use typeof). First 5 products only.
-- hint: SELECT product_name, typeof(unit_price) FROM products LIMIT 5
SELECT product_name, unit_price
FROM products
LIMIT 5
-- answer:
SELECT product_name, typeof(unit_price)
FROM products
LIMIT 5
```

```sql
-- exercise: Work out the average store size: SUM(size_sqft) divided by COUNT(size_sqft), with decimals.
-- hint: Both are whole numbers, so multiply one by 1.0 first.
SELECT SUM(size_sqft) / COUNT(size_sqft) AS avg_size
FROM stores
-- answer:
SELECT SUM(size_sqft) * 1.0 / COUNT(size_sqft) AS avg_size
FROM stores
```

**New words:** *column*, *row*, *storage class*, *domain*, *integer division*, *ISO date*.
