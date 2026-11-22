---
title: 'Types and CAST'
seoTitle: 'SQL CAST and data types: integer division, text numbers'
summary: 'Why 7 / 2 gives 3, why the text 10 sorts before 9, and why a query can silently return nothing. Learn to check a value''s type and change it with CAST.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What does SELECT 29 / 1059 return in SQLite, SQL Server or PostgreSQL?
    choices: ['0.0274', '0', 'An error']
    ans: 1
    why: Both numbers are integers, so the division is whole-number division and the fraction is thrown away. Write 29 * 1.0 / 1059 or CAST one side to a decimal type.
  - q: "Which is true in SQL: '10' < '9' (both as text)?"
    choices: ['False, because 10 is bigger', 'True, because text is compared character by character and 1 comes before 9', 'It is an error']
    ans: 1
    why: Text comparison looks at the first character first, and '1' sorts before '9'. CAST to INTEGER to compare as numbers.
  - q: "strftime('%m', order_date) = 3 returns no rows in SQLite. Why?"
    choices: ['There are no March orders', "strftime returns the text '03', which is not equal to the number 3", 'strftime only works on timestamps']
    ans: 1
    why: "The month comes back as text with a leading zero. Compare with '03', or CAST(strftime('%m', order_date) AS INTEGER) = 3."
---

**Module 7 · about 25 minutes · read first: 1.3.** You'll be able to check a value's type, change it with CAST, avoid whole-number division, and spot comparisons between text and numbers that silently go wrong.

## 1. Why this matters

Type problems rarely cause errors. They cause wrong answers that look fine: a conversion rate of 0%, a month filter that finds nothing, product codes sorted 1, 10, 11, 2. Files loaded from CSV often arrive with every column as text. Knowing what type a value really has, and how to change it, is everyday BI work.

## 2. Every value has a type

The main types you will see:

- *INTEGER*: whole numbers, such as `order_id` and `quantity`.
- *REAL* (also called float or decimal): numbers with a fraction, such as `unit_price`.
- *TEXT*: strings, including Northbay's dates.
- *NULL*: no value.

SQLite's `typeof(x)` tells you what a value is right now:

```sql
-- try
SELECT o.order_id, typeof(o.order_id) AS id_type,
       typeof(o.order_date) AS date_type,
       typeof(i.unit_price) AS price_type,
       typeof(o.customer_id) AS customer_type
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.customer_id IS NULL
LIMIT 3
```

These are guest orders, so `customer_id` is NULL and its type is `null`. SQLite is relaxed about types: a column declared INTEGER can hold text if someone puts text in it. SQL Server and PostgreSQL are strict, and refuse to store or compare mismatched types without a CAST.

## 3. Whole-number division

When both sides of `/` are integers, the answer is an integer and the fraction is dropped:

```sql
-- noviz
SELECT 7 / 2 AS whole, 7 / 2.0 AS decimal, CAST(7 AS REAL) / 2 AS cast_first
```

`7 / 2` is 3. Any decimal on either side fixes it. This is the most common reason a rate comes out as 0. SQL Server and PostgreSQL behave the same; MySQL and BigQuery's `/` always give a decimal.

## 4. CAST: changing a type

`CAST(x AS type)` turns a value into another type: `CAST('12' AS INTEGER)` is the number 12, `CAST(3.99 AS TEXT)` is the text '3.99'. Text and numbers compare differently:

```sql
-- noviz
SELECT '10' < '9' AS as_text,
       CAST('10' AS INTEGER) < CAST('9' AS INTEGER) AS as_numbers,
       CAST('12.7' AS INTEGER) AS cut_down,
       CAST('abc' AS INTEGER) AS not_a_number
```

- As text, '10' < '9' is true (1), because '1' comes before '9'.
- CAST to INTEGER drops the fraction: 12.7 becomes 12. Use ROUND first if you want 13.
- SQLite turns text that is not a number into 0. SQL Server raises an error (use `TRY_CAST`, which gives NULL instead); PostgreSQL raises an error too. Count how many rows would fail before you trust a CAST.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a type is the set a value belongs to, and every operator is defined on particular sets. The same symbol can mean different functions on different sets: `/` on integers is division with the remainder thrown away; `<` on text is dictionary order, not size.

**Equation:** on integers, a / b = ⌊a / b⌋ for positive values, so 7 / 2 = 3 and 29 / 1059 = 0. On text, '10' < '9' because the first characters compare '1' < '9' (lexicographic order). CAST is a function from one set to another, and it can lose information: CAST(12.7 AS INTEGER) = 12, so CAST back gives 12.0, not 12.7.

**Analogy:** money in two currencies. 10 dollars and 9 euros cannot be compared until you convert one; comparing the numbers alone gives nonsense. It breaks down a little because SQLite sometimes converts for you without saying so, which is helpful until it guesses wrong.

**Try it:** what is 100 * 29 / 1059? And 100.0 * 29 / 1059? (2, because 2900 / 1059 = 2 with the fraction dropped; then 2.74.)
</details>

## 5. The silent filter

`strftime` returns text. Compare it with a number and SQLite finds no match, with no error:

```sql
-- try
SELECT COUNT(*) AS march_orders
FROM orders
WHERE strftime('%m', order_date) = 3
```

Zero. Compare with the text `'03'`, or CAST the text to a number; both give the real answer, 288:

```sql
-- try
SELECT COUNT(*) AS march_orders
FROM orders
WHERE CAST(strftime('%m', order_date) AS INTEGER) = 3
```

When a filter returns nothing and you are sure it should not, check the types on both sides first.

## 6. Decimals are not exact

REAL numbers are stored in binary, so some decimals cannot be stored exactly:

```sql
-- noviz
SELECT 0.1 + 0.2 AS total, 0.1 + 0.2 = 0.3 AS is_equal, ROUND(0.1 + 0.2, 2) = 0.3 AS rounded_equal
```

`0.1 + 0.2` is 0.30000000000000004, so the equality test is false (0). ROUND before comparing money, or store cents as integers. Warehouses offer an exact `DECIMAL(10, 2)` type for money; SQLite does not.

## 7. Worked example

*Question:* what share of orders were cancelled in each channel?

```sql
-- try
SELECT channel, COUNT(*) AS orders,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*) AS wrong_rate,
       ROUND(100.0 * SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*), 2) AS pct_cancelled
FROM orders
GROUP BY channel
```

1. Online had 1,059 orders and 29 cancelled; stores had 3,005 and 90.
2. `wrong_rate` is integer ÷ integer, so both show 0.
3. With `100.0` first: **2.74%** online and **3.00%** in stores.
4. Where the bottom of a fraction can be 0, wrap it as `NULLIF(x, 0)`: dividing by NULL gives NULL instead of an error. SQLite gives NULL for `/ 0` anyway, but SQL Server and PostgreSQL stop with an error.

## 8. Practice

```sql
-- exercise: Show the share of order_items rows that have a discount (discount > 0), as a percentage to 1 decimal place.
-- hint: 100.0 * SUM(CASE WHEN discount > 0 THEN 1 ELSE 0 END) / COUNT(*).
SELECT SUM(CASE WHEN discount > 0 THEN 1 ELSE 0 END) / COUNT(*) AS pct_discounted
FROM order_items
-- answer:
SELECT ROUND(100.0 * SUM(CASE WHEN discount > 0 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_discounted
FROM order_items
```

```sql
-- exercise: Count the December orders (any year) with a filter that works: the month from strftime as a number equal to 12.
-- hint: CAST(strftime('%m', order_date) AS INTEGER) = 12, or compare with the text '12'.
SELECT COUNT(*) AS december_orders
FROM orders
WHERE strftime('%m', order_date) = 1
-- answer:
SELECT COUNT(*) AS december_orders
FROM orders
WHERE CAST(strftime('%m', order_date) AS INTEGER) = 12
```

```sql
-- exercise: For the 11 physical stores (store_id 1 to 11), show store_name and size_sqft divided by 1,000 as a decimal (size_k), so 16500 gives 16.5.
-- hint: size_sqft / 1000.0, or CAST(size_sqft AS REAL) / 1000.
SELECT store_name, size_sqft / 1000 AS size_k
FROM stores
WHERE store_id <= 11
-- answer:
SELECT store_name, size_sqft / 1000.0 AS size_k
FROM stores
WHERE store_id <= 11
```

**Try it on your own data:** [[csv-profiler]] shows which columns of a CSV are really numbers, dates or text before you load it.

**New words:** *data type*, *CAST*, *whole-number division*, *TRY_CAST*, *floating point*.
