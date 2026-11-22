---
title: 'ORDER BY and LIMIT'
seoTitle: 'SQL ORDER BY and LIMIT explained with examples'
summary: 'Sort results with ORDER BY (up, down, by several columns), keep the top few with LIMIT and OFFSET, and handle ties and NULLs so your top-10 lists are right.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Without ORDER BY, in what order do rows come back?
    choices: ['The order they were inserted', 'Alphabetical order', 'No guaranteed order']
    ans: 2
    why: A table has no built-in order. The database may return rows in any order it finds convenient, and that can change. Only ORDER BY guarantees an order.
  - q: 'What does ORDER BY unit_price DESC, product_name do?'
    choices: ['Sorts by price, highest first, and breaks ties by name A to Z', 'Sorts by name, then price', 'Sorts both columns from highest to lowest']
    ans: 0
    why: Rows are sorted by the first column; the second only decides between rows that tie on the first. DESC applies only to the column it follows.
  - q: 'Where do NULLs go in ORDER BY size_sqft in SQLite?'
    choices: ['First (smallest)', 'Last (largest)', 'They are left out']
    ans: 0
    why: SQLite and SQL Server treat NULL as smaller than any value, so NULLs come first going up and last going down. PostgreSQL does the opposite. NULLS FIRST / NULLS LAST says it explicitly.
---

**Module 2 · about 25 minutes · read first: 2.2.** You'll be able to sort results by one or more columns, take the top or bottom few rows, page through results, and handle ties and NULLs on purpose.

## 1. Why this matters

"Top 10 products", "the 5 biggest stores", "most recent orders first": ranked lists are among the most requested things in any business. They are also easy to get subtly wrong: a tie at position 10, a NULL that floats to the top, or a LIMIT without ORDER BY that returns different rows each time.

## 2. ORDER BY sorts the answer

ORDER BY goes near the end of a query and names the column (or columns) to sort by. Smallest first is the default, also written `ASC` (ascending). `DESC` (descending) puts the biggest first.

```sql
-- try
SELECT item, amount
FROM mini_orders
ORDER BY amount DESC
```

Press **Show how it runs**. The ORDER BY step comes after SELECT: the six rows slide into their new places. Nothing is added or removed, only moved.

Text sorts alphabetically, and ISO dates sort by date:

```sql
-- try
SELECT first_name, last_name, joined_on
FROM customers
ORDER BY joined_on DESC
LIMIT 10
```

## 3. No ORDER BY, no order

A table is a set of rows, not a list, so without ORDER BY the database may hand rows back in any order. Today it might look like the order they were added; after an update or on a bigger server, it may not. If order matters, say so with ORDER BY.

## 4. Sorting by several columns

List several columns, separated by commas. The second only matters for rows that tie on the first, the third for rows that tie on both, and so on. ASC or DESC applies to each column separately.

```sql
-- try
SELECT province, city, store_name
FROM stores
ORDER BY province, city DESC
```

Provinces A to Z, and within each province, cities Z to A.

You can sort by an alias from SELECT, because ORDER BY runs after SELECT:

```sql
-- try
SELECT product_name, unit_price - unit_cost AS margin
FROM products
ORDER BY margin DESC
LIMIT 5
```

## 5. LIMIT: keep the first few

`LIMIT n` keeps the first n rows of the answer. With ORDER BY, that's a top-n list:

```sql
-- try
SELECT product_name, unit_price
FROM products
ORDER BY unit_price
LIMIT 5
```

The five cheapest products. `OFFSET k` skips the first k rows first, which is how apps show page 2, page 3 and so on:

```sql
-- try
SELECT product_name, unit_price
FROM products
ORDER BY unit_price, product_name
LIMIT 5 OFFSET 5
```

Dialects: SQL Server writes `SELECT TOP 5 ...` or `ORDER BY ... OFFSET 5 ROWS FETCH NEXT 5 ROWS ONLY`; PostgreSQL and MySQL use `LIMIT` like SQLite.

## 6. Ties

Look at the top 5 prices:

```sql
-- try
SELECT product_name, unit_price
FROM products
ORDER BY unit_price DESC
LIMIT 5
```

Queen sheet set and Bluetooth speaker both cost $59.99. Which is listed first is up to the database, unless you add a *tie-breaker*: `ORDER BY unit_price DESC, product_name`. Worse, if a tie falls exactly at the LIMIT line, one of the tied rows is cut and the other kept, for no reason. Always check the row just past your limit, and add a tie-breaker so the result is the same every time. (Ranking functions in Lesson 6.2 handle ties properly.)

## 7. Where NULLs go

In SQLite and SQL Server, NULL sorts as smaller than everything:

```sql
-- try
SELECT store_name, size_sqft
FROM stores
ORDER BY size_sqft
```

Northbay Online (no size) comes first. Going `DESC`, it would come last. PostgreSQL does the reverse. To be explicit, SQLite and PostgreSQL accept `ORDER BY size_sqft NULLS LAST`; in SQL Server, sort on a test first: `ORDER BY CASE WHEN size_sqft IS NULL THEN 1 ELSE 0 END, size_sqft`.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a relation is a set, and sets have no order. ORDER BY turns the final answer into a *list* (a sequence), so it is the one step that is not a set operation. That's why it runs last, just before LIMIT, and why ordering inside a subquery means nothing.

**Equation:** sorting by (a, b) uses *lexicographic order*: row r comes before row s if r.a < s.a, or r.a = s.a and r.b < s.b. This is exactly how a dictionary orders words: first letter, then second. LIMIT n then keeps the first n elements of the list.

**Analogy:** a pile of exam papers (a set) versus the same papers stacked by mark (a list). It breaks down a little because the database often sorts only as much as it needs: for LIMIT 5 it can keep a running top 5 instead of sorting everything.

**Try it:** sorted by (province, city), does ('AB', 'Edmonton') come before ('BC', 'Calgary')? (Yes: AB < BC decides it, and the cities are never compared.)
</details>

## 8. Worked example

*Question:* which three physical stores have the most floor space?

1. Biggest first: `ORDER BY size_sqft DESC`. The online store's NULL size goes to the bottom in SQLite, so it can't sneak in.
2. Top three: `LIMIT 3`.
3. Check the fourth row for a tie: Northbay Downtown has 18,000, below third place, so no tie.

```sql
-- try
SELECT store_name, city, size_sqft
FROM stores
ORDER BY size_sqft DESC
LIMIT 3
```

Answer: Lakeshore in Mississauga (22,000 sq ft), Stampede in Calgary (20,000) and Pacific in Vancouver (19,000). Change LIMIT to 4 to see the check for yourself.

## 9. Practice

```sql
-- exercise: List the 3 customers who joined most recently: first name, last name and joined_on, newest first.
-- hint: ORDER BY joined_on DESC, then LIMIT 3.
SELECT first_name, last_name, joined_on
FROM customers
ORDER BY joined_on
LIMIT 3
-- answer:
SELECT first_name, last_name, joined_on
FROM customers
ORDER BY joined_on DESC
LIMIT 3
```

```sql
-- exercise: List every employee's name and salary, highest salary first, with ties broken by name A to Z. Show only the top 5.
-- hint: ORDER BY salary DESC, name ... LIMIT 5
SELECT name, salary
FROM employees
LIMIT 5
-- answer:
SELECT name, salary
FROM employees
ORDER BY salary DESC, name
LIMIT 5
```

```sql
-- exercise: Show the stores sorted by province A to Z, and within each province by size, biggest first. Show store_name, province and size_sqft.
-- hint: Two sort columns: province, then size_sqft DESC.
SELECT store_name, province
FROM stores
ORDER BY province
-- answer:
SELECT store_name, province, size_sqft
FROM stores
ORDER BY province, size_sqft DESC
```

**New words:** *ascending*, *descending*, *tie-breaker*, *OFFSET*, *lexicographic order*.
