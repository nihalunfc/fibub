---
title: 'WHERE: choosing rows'
seoTitle: 'SQL WHERE clause explained with examples'
summary: 'Keep only the rows you want with WHERE: compare numbers, text and dates, and learn the small traps (quotes, capitals, stray spaces) that make a filter miss rows.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Which is the right way to filter on text?'
    choices: ['WHERE city = Toronto', 'WHERE city = ''Toronto''', 'WHERE city = "Toronto" in every database']
    ans: 1
    why: Text values go in single quotes. Without quotes SQL reads Toronto as a column name; double quotes mean a column name in standard SQL.
  - q: What does WHERE amount > 40 do to the rows where amount is 40?
    choices: ['Keeps them', 'Removes them', 'Turns them into NULL']
    ans: 1
    why: '> means strictly greater. Use >= to keep 40 as well.'
  - q: 'Why might WHERE city = ''Winnipeg'' miss some Winnipeg customers?'
    choices: ['Some are stored as ''Winnipeg '' with a trailing space', 'WHERE only returns 50 rows', 'Winnipeg is a reserved word']
    ans: 0
    why: '= needs an exact match, character for character. A trailing space makes a different value. TRIM(city) fixes it (Lesson 7.2).'
---

**Module 2 · about 25 minutes · read first: 2.1.** You'll be able to keep only the rows you need with WHERE, compare numbers, text and dates correctly, and spot a filter that silently misses rows.

## 1. Why this matters

Almost every business question starts with "only": only last month, only Ontario, only completed orders. WHERE is how you say "only". Getting it slightly wrong is the most common way an analyst's number disagrees with finance's, so it pays to know exactly what WHERE keeps and what it drops.

## 2. WHERE keeps rows that pass a test

WHERE goes after FROM. It holds a *condition*: a test that is true or false for each row. Rows where it is true are kept; the rest are dropped.

```sql
-- try
SELECT order_id, item, amount
FROM mini_orders
WHERE amount > 40
```

Press **Show how it runs**, then **Play**. At the WHERE step watch the Bagels ($5) and Puzzle ($20) rows fade out: 6 rows go in, 4 come out. Note that WHERE runs **before** SELECT, so it can test any column of the table, even one you don't show.

## 3. The comparison operators

| Operator | Means | Example |
|---|---|---|
| `=` | equal | `store_id = 12` |
| `<>` or `!=` | not equal | `status <> 'completed'` |
| `>` `>=` | greater, greater or equal | `unit_price >= 50` |
| `<` `<=` | less, less or equal | `quantity < 2` |

Change `>` to `>=` and the number to `45` below, and watch the row count change.

```sql
-- try
SELECT product_name, unit_price
FROM products
WHERE unit_price > 50
```

Four products cost more than $50.

## 4. Text goes in single quotes

Text values go in *single* quotes. Without quotes, SQL thinks `completed` is a column name and errors:

```sql
-- fails
SELECT order_id, status
FROM orders
WHERE status = completed
```

Fixed:

```sql
-- try
SELECT order_id, order_date, store_id
FROM orders
WHERE status = 'cancelled'
```

119 orders were cancelled. (Double quotes are for column names in standard SQL. SQLite is forgiving and may accept "cancelled", but SQL Server and PostgreSQL won't treat it as text, so get the habit right now.)

## 5. Exact means exact

`=` on text compares character by character. In SQLite, capitals count, and so do spaces you can't see.

```sql
-- try
SELECT COUNT(*) AS exact_match
FROM customers
WHERE city = 'Winnipeg'
```

That gives 59. But two more Winnipeg customers were typed as `'Winnipeg '` with a trailing space, so they're missed. Try `WHERE city = 'winnipeg'` (lowercase): 0 rows. A safer filter trims and lowercases first; you'll meet `TRIM` and `LOWER` properly in Lesson 7.2.

```sql
-- try
SELECT COUNT(*) AS all_winnipeg
FROM customers
WHERE LOWER(TRIM(city)) = 'winnipeg'
```

SQL Server usually ignores capitals in comparisons (it depends on the database's *collation*); PostgreSQL, like SQLite, does not.

## 6. Dates

Northbay's dates are text in `YYYY-MM-DD` form, which sorts in date order, so `<`, `>` and `=` work as you'd hope. Always write the full date in quotes.

```sql
-- try
SELECT store_name, opened_on
FROM stores
WHERE opened_on < '2018-01-01'
```

Three stores opened before 2018.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** WHERE is *selection*, written σ. It applies a predicate (a yes/no test) to each row on its own and keeps the rows where the answer is true. One row's fate never depends on another row.

**Equation:** σ<sub>p</sub>(T) = { r ∈ T : p(r) is true }. So |σ<sub>p</sub>(T)| ≤ |T|: a filter can only keep or remove rows, never add them. Two filters in a row are the same as one with both tests: σ<sub>p</sub>(σ<sub>q</sub>(T)) = σ<sub>p AND q</sub>(T).

**Analogy:** a sieve. Each grain (row) either falls through or stays, depending only on its own size. It breaks down a little with NULL, where the test can be neither true nor false (Lesson 2.4); such rows are dropped too.

**Try it:** σ<sub>amount > 40</sub>(mini_orders) has 4 rows. How many does σ<sub>amount > 100</sub> have? (0. An empty answer is still a valid table, with columns and no rows.)
</details>

## 7. Worked example

*Question:* how busy was Christmas Eve 2025, and which channel did those orders come through?

1. Filter to one day: `WHERE order_date = '2025-12-24'`.
2. Show the order, store and channel so you can read them.

```sql
-- try
SELECT order_id, store_id, channel, status
FROM orders
WHERE order_date = '2025-12-24'
```

3. Count: 8 rows, so 8 orders. Read down the channel column to see the split, then try `'2024-12-24'` for the year before.

## 8. Practice

```sql
-- exercise: List the order_id and order_date of every order placed at store 7 (Thunder Bay).
-- hint: WHERE store_id = 7. Numbers need no quotes.
SELECT order_id, order_date
FROM orders
-- answer:
SELECT order_id, order_date
FROM orders
WHERE store_id = 7
```

```sql
-- exercise: Find every product that costs less than $3 on the shelf. Show its name and unit_price.
-- hint: WHERE unit_price < 3
SELECT product_name, unit_price
FROM products
WHERE unit_price < 30
-- answer:
SELECT product_name, unit_price
FROM products
WHERE unit_price < 3
```

```sql
-- exercise: List the first name, last name and joined_on date of customers who joined on or after 1 December 2025.
-- hint: Dates are text in quotes: '2025-12-01'. On or after means >=.
SELECT first_name, last_name, joined_on
FROM customers
WHERE joined_on > '2025-12-31'
-- answer:
SELECT first_name, last_name, joined_on
FROM customers
WHERE joined_on >= '2025-12-01'
```

**New words:** *condition*, *selection*, *predicate*, *comparison operator*, *collation*.
