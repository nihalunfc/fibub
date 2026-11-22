---
title: 'UNION, INTERSECT and EXCEPT'
seoTitle: 'SQL UNION vs UNION ALL, INTERSECT and EXCEPT explained'
summary: 'Joins put tables side by side; UNION stacks them on top of each other. Learn UNION vs UNION ALL, find rows in both lists with INTERSECT and in one but not the other with EXCEPT, on Northbay customers and orders.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is the difference between UNION and UNION ALL?
    choices: ['UNION removes duplicate rows; UNION ALL keeps every row', 'UNION ALL removes duplicates', 'There is none']
    ans: 0
    why: UNION treats the result as a set and drops repeats. UNION ALL just stacks the rows, which is faster and keeps true repeats.
  - q: What must the two queries in a UNION have in common?
    choices: ['The same table', 'The same number of columns, in a matching order and type', 'The same WHERE clause']
    ans: 1
    why: Rows are stacked column by column, so the queries need the same number of columns. The names come from the first query.
  - q: 'Customer cities EXCEPT store cities returns "Toronto " and 10 more. Why, when every customer city has a store?'
    choices: ['Those city names have a stray space at the end, so they do not equal the store city', 'EXCEPT is broken', 'Those stores are closed']
    ans: 0
    why: Set operations compare values exactly. 'Toronto ' with a trailing space is a different value from 'Toronto'. TRIM fixes it.
---

**Module 4 · about 25 minutes · read first: 4.2.** You'll be able to stack two results with UNION and UNION ALL, and compare two lists with INTERSECT and EXCEPT.

## 1. Why this matters

Analysts often need to combine lists rather than match them: this year's customers with last year's, sales with returns in one activity log, the same report from two regions' databases. Set operations answer "who is in both?", "who is new?" and "who is gone?" in one short line, and they are the quickest way to compare two query results when you are checking your own work.

## 2. Joins go sideways, set operations go down

A join adds **columns**: each row gets wider. A **set operation** adds **rows**: one result goes underneath the other. The two queries must return the same number of columns, in the same order, with compatible types. The column names come from the first query.

```sql
-- try
SELECT name, city FROM mini_customers WHERE city = 'Toronto'
UNION ALL
SELECT name, city FROM mini_customers WHERE city = 'Ottawa'
```

Press **Show how it runs**: the Toronto rows, then the Ottawa rows stacked under them.

## 3. UNION ALL vs UNION

`UNION ALL` keeps every row. `UNION` also removes duplicate rows from the combined result. Compare:

```sql
-- try
SELECT city FROM mini_customers
UNION ALL
SELECT city FROM mini_customers WHERE id <= 2
```

```sql
-- try
SELECT city FROM mini_customers
UNION
SELECT city FROM mini_customers WHERE id <= 2
```

The first gives 7 rows (5 + 2); the second gives 3, one per different city. Removing duplicates costs time on big tables, so use `UNION ALL` unless you really want duplicates gone. A common bug is UNION throwing away genuine repeats, such as two orders with the same date and amount.

A useful UNION ALL pattern is an **activity log**: different events from different tables, in one list with a label column. Here are Northbay's orders and returns in December 2025:

```sql
-- try
SELECT kind, COUNT(*) AS events
FROM (
  SELECT 'order'  AS kind, order_date  AS day FROM orders
  UNION ALL
  SELECT 'return' AS kind, return_date AS day FROM returns
) AS activity
WHERE day LIKE '2025-12%'
GROUP BY kind
```

304 orders and 11 returns. The stacked query sits inside FROM; that is a subquery, coming up in [Lesson 5.1](/learn/courses/sql/subqueries/).

## 4. INTERSECT: in both lists

`INTERSECT` keeps rows that appear in both results. *Question:* how many loyalty members bought in both 2024 and 2025?

```sql
-- try
SELECT COUNT(*) AS bought_both_years
FROM (
  SELECT customer_id FROM orders WHERE order_date LIKE '2024%' AND customer_id IS NOT NULL
  INTERSECT
  SELECT customer_id FROM orders WHERE order_date LIKE '2025%'
) AS both_years
```

545. Note the `customer_id IS NOT NULL`: set operations treat two NULLs as equal (unlike `=` in a join), so without it the guests' NULL would count as one extra "customer".

## 5. EXCEPT: in the first list but not the second

`EXCEPT` keeps rows from the first result that are not in the second. (Oracle calls it `MINUS`; SQL Server and PostgreSQL say `EXCEPT`.) *Question:* do we have customers in cities without a store?

```sql
-- try
SELECT city FROM customers
EXCEPT
SELECT city FROM stores
```

Eleven cities, and they all look like store cities. Look closely: each ends in a space, like `'Toronto '`. A few customer records were typed with a trailing space, and set operations compare values exactly. Trim them and the answer becomes empty:

```sql
-- try
SELECT TRIM(city) FROM customers
EXCEPT
SELECT city FROM stores
```

No rows: every customer lives in a store city. Set operations are a fast way to find this kind of dirty data.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** UNION, INTERSECT and EXCEPT are the set operations from school maths, applied to whole rows. They need **union-compatible** inputs: same number of columns, matching types.

**Equation:** A ∪ B, A ∩ B and A − B. In SQL, UNION, INTERSECT and EXCEPT return **sets** (duplicates removed), while UNION ALL returns a **bag**, so |A ∪ALL B| = |A| + |B| and |A ∪ B| ≤ |A| + |B|. Venn rules carry over: |A ∪ B| = |A| + |B| − |A ∩ B|.

**Analogy:** two class registers. UNION is everyone in either class; INTERSECT is students taking both; EXCEPT is students in the first class who are not in the second. UNION ALL is stapling the two registers together, so a student in both appears twice.

**Try it:** 561 customers bought in 2024, 584 in 2025, and 545 in both. How many bought in at least one year? (561 + 584 − 545 = 600.)
</details>

## 6. Worked example: new, kept and lost customers

*Question:* compare 2024's customers with 2025's.

1. `INTERSECT` gives the customers who bought in both years: **545**.
2. 2025 `EXCEPT` 2024 gives the **new** customers: **39**.
3. 2024 `EXCEPT` 2025 gives the **lost** customers: **16**.
4. Check with the Venn rule: 545 + 39 = 584 bought in 2025 and 545 + 16 = 561 in 2024. Both match `COUNT(DISTINCT customer_id)` for each year.

Customer retention is mostly this calculation, done month by month; [Lesson 8.2](/learn/courses/sql/cohorts/) builds it properly.

## 7. Practice

```sql
-- exercise: Count the customers who bought in 2025 but not in 2024 (new customers). Leave out guests.
-- hint: Inside FROM: the 2025 customer_ids (IS NOT NULL) EXCEPT the 2024 customer_ids. Then COUNT(*) outside.
SELECT COUNT(DISTINCT customer_id) AS customers
FROM orders
WHERE order_date LIKE '2025%'
-- answer:
SELECT COUNT(*) AS new_customers
FROM (
  SELECT customer_id FROM orders WHERE order_date LIKE '2025%' AND customer_id IS NOT NULL
  EXCEPT
  SELECT customer_id FROM orders WHERE order_date LIKE '2024%'
) AS new_ones
```

```sql
-- exercise: Make one list of names with a column saying who they are: every employee's name labelled 'staff' and every mini customer's name labelled 'customer'. Keep every row.
-- hint: SELECT name, 'staff' AS who FROM employees UNION ALL SELECT name, 'customer' FROM mini_customers.
SELECT name, 'staff' AS who
FROM employees
-- answer:
SELECT name, 'staff' AS who FROM employees
UNION ALL
SELECT name, 'customer' FROM mini_customers
```

```sql
-- exercise: List the product_ids that were sold in December 2025 and also returned in December 2025.
-- hint: The product_ids from order_items joined to orders with order_date LIKE '2025-12%', INTERSECT the product_ids from returns with return_date LIKE '2025-12%'.
SELECT product_id FROM returns WHERE return_date LIKE '2025-12%'
-- answer:
SELECT oi.product_id
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
WHERE o.order_date LIKE '2025-12%'
INTERSECT
SELECT product_id FROM returns WHERE return_date LIKE '2025-12%'
```

**Try it on your own data:** two exports of the same list from different months? Load both into [[sql-playground]] and use EXCEPT both ways to see what was added and what was removed.

**New words:** *set operation*, *UNION ALL*, *INTERSECT*, *EXCEPT*, *union-compatible*, *activity log*.
