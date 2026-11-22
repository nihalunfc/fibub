---
title: 'SELECT: choosing columns'
seoTitle: 'SQL SELECT statement explained with examples'
summary: 'Pick the columns you want, rename them, work out new ones with arithmetic, and remove repeated rows with DISTINCT, all on a live store database.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'What does SELECT * mean?'
    choices: ['Every row', 'Every column', 'Every table']
    ans: 1
    why: The star stands for all columns. Which rows you get is decided by FROM and WHERE.
  - q: 'What does AS do in SELECT unit_price - unit_cost AS margin?'
    choices: ['Saves a new column in the products table', 'Gives the result column a name', 'Filters the rows']
    ans: 1
    why: AS names a column in the answer only. The table itself does not change.
  - q: 'SELECT DISTINCT channel FROM orders returns how many rows?'
    choices: ['4,064, one per order', '2, one per different channel', '1']
    ans: 1
    why: DISTINCT keeps each different value once. Northbay has two channels, store and online.
---

**Module 2 · about 25 minutes · read first: 1.4.** You'll be able to choose and rename columns, work out new columns from old ones, and remove repeated rows.

## 1. Why this matters

Real tables have dozens of columns and most of a report needs only a few. Choosing columns, naming them clearly and working out new ones (margin, full name, price with tax) is the first thing you do in almost every query. Clean column names also matter downstream: a Power BI or Tableau report shows them to the people reading it.

## 2. Choose columns by name

After SELECT, list the columns you want, separated by commas, in the order you want them shown.

```sql
-- try
SELECT product_name, unit_price
FROM products
```

Press **Show how it runs**. FROM brings in every column of `products`; at the SELECT step all but two are faded out. Rows are not touched: there are still 61.

Change the order to `unit_price, product_name` and run again: the columns swap. You can also list a column twice, though there is rarely a reason to.

## 3. SELECT * and when not to use it

`*` means every column. It is perfect for a quick look, but in saved queries list the columns: the query is easier to read, faster on wide tables, and doesn't change shape when someone adds a column to the table.

```sql
-- try
SELECT * FROM categories
```

## 4. Work out new columns

A column in SELECT can be any *expression*: arithmetic with `+ - * /`, a function like `ROUND(x, 2)`, or text joined with `||`.

```sql
-- try
SELECT product_name,
       unit_price,
       unit_cost,
       unit_price - unit_cost AS margin,
       ROUND(unit_price * 1.13, 2) AS price_with_tax
FROM products
WHERE category_id = 7
```

`AS margin` is an *alias*: a name for the result column. Without it the column would be called `unit_price - unit_cost`. Aliases exist only in the answer; the `products` table is unchanged. If an alias has a space, put it in double quotes: `AS "price with tax"`.

Joining text uses `||` (two vertical bars):

```sql
-- try
SELECT customer_id,
       first_name || ' ' || last_name AS full_name,
       city
FROM customers
LIMIT 5
```

SQL Server uses `+` or `CONCAT(first_name, ' ', last_name)`; PostgreSQL and SQLite accept both `||` and `CONCAT` (SQLite from version 3.44).

## 5. A column that is the same on every row

You can SELECT a fixed value, called a *literal*. It repeats on every row, which is handy for labelling results.

```sql
-- try
SELECT 'Bedding' AS shelf, product_name, unit_price
FROM products
WHERE category_id = 7
```

## 6. DISTINCT: each different row once

`SELECT DISTINCT` removes rows that are exact repeats of each other in the columns you chose.

```sql
-- try
SELECT DISTINCT department
FROM categories
```

Press **Show how it runs**. Ten category rows go in; at the DISTINCT step the repeats (five Grocery rows, three Home rows) collapse, leaving 4.

With two columns, DISTINCT keeps each different *pair*:

```sql
-- try
SELECT DISTINCT channel, status
FROM orders
```

Four pairs: every channel has some completed and some cancelled orders.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** choosing columns is *projection*, written π. It keeps some columns of every row and throws the rest away. Pure projection on a set also removes repeats; SQL's SELECT does not unless you add DISTINCT, because SQL tables are *bags* (multisets) where a row may appear more than once.

**Equation:** SELECT department FROM categories is the bag π<sub>department</sub>(categories) with 10 elements. SELECT DISTINCT department is the set δ(π<sub>department</sub>(categories)) = {Grocery, Home, Kids, Tech}, with 4. A computed column is a function applied to each row: margin(r) = r.unit_price − r.unit_cost.

**Analogy:** photocopying a spreadsheet with some columns folded under. Every row is still there, just narrower. DISTINCT is crossing out lines that look identical on the copy. It breaks down a little because the database doesn't really fold: it never reads columns it doesn't need.

**Try it:** how many rows does SELECT DISTINCT province FROM stores return? (5: ON, MB, AB, BC, and NULL for the online store. DISTINCT treats NULLs as one value.)
</details>

## 7. Worked example

*Question:* for each Bedding product, what is the profit on one unit and the margin as a percentage of the price?

1. Bedding is category 7, so filter `WHERE category_id = 7` (WHERE gets its own lesson next).
2. Profit per unit = `unit_price - unit_cost`. For the Duvet: 89.99 − 45.44 = 44.55.
3. Margin % = profit / price × 100. For the Duvet: 44.55 / 89.99 × 100 = 49.5.

```sql
-- try
SELECT product_name,
       ROUND(unit_price - unit_cost, 2) AS profit,
       ROUND((unit_price - unit_cost) / unit_price * 100, 1) AS margin_pct
FROM products
WHERE category_id = 7
```

The Pillow 2 pack has the highest margin (54%), even though the Duvet makes the most dollars per unit. Two columns, two different stories.

## 8. Practice

```sql
-- exercise: List every store's name and size (size_sqft), with the size column renamed to square_feet.
-- hint: SELECT store_name, size_sqft AS square_feet FROM stores
SELECT * FROM stores
-- answer:
SELECT store_name, size_sqft AS square_feet
FROM stores
```

```sql
-- exercise: Show each Electronics product (category_id = 10) with its name and its price after a 25% discount, rounded to 2 decimals.
-- hint: 25% off means multiply by 0.75. ROUND(x, 2) rounds.
SELECT product_name, unit_price
FROM products
WHERE category_id = 10
-- answer:
SELECT product_name, ROUND(unit_price * 0.75, 2) AS sale_price
FROM products
WHERE category_id = 10
```

```sql
-- exercise: List each different brand Northbay sells, once each.
-- hint: SELECT DISTINCT brand ...
SELECT brand FROM products
-- answer:
SELECT DISTINCT brand FROM products
```

**New words:** *projection*, *expression*, *alias*, *literal*, *DISTINCT*, *bag*.
