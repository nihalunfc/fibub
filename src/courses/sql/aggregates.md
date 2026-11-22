---
title: 'COUNT, SUM, AVG, MIN and MAX'
seoTitle: 'SQL aggregate functions: COUNT, SUM, AVG, MIN, MAX'
summary: 'Squeeze a whole table into one row of totals with the five aggregate functions, and learn how each one treats NULL, which is where most wrong averages come from.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'What is the difference between COUNT(*) and COUNT(email)?'
    choices: ['None', 'COUNT(*) counts every row; COUNT(email) counts rows where email is not NULL', 'COUNT(email) counts different emails only']
    ans: 1
    why: COUNT(*) counts rows. COUNT(column) skips NULLs in that column. Counting different values needs COUNT(DISTINCT ...).
  - q: Store sizes are 11 numbers and one NULL. What does AVG(size_sqft) divide by?
    choices: ['12', '11', '0']
    ans: 1
    why: AVG ignores NULLs, so it is SUM of the 11 sizes divided by 11.
  - q: 'What does SUM(amount) give when every amount is NULL (or there are no rows)?'
    choices: ['0', 'NULL', 'An error']
    ans: 1
    why: SUM of nothing is NULL in SQL, not 0. COALESCE(SUM(amount), 0) turns it into 0 when you need it.
---

**Module 3 · about 30 minutes · read first: 2.6.** You'll be able to total, count, average and find the smallest and largest values in a table, and say exactly how each function treats NULL.

## 1. Why this matters

Every dashboard tile is an aggregate: total sales, number of orders, average basket, latest order date. Analysts write these more than any other kind of query. The functions are simple; the skill is knowing exactly what each one counts, especially when some values are missing.

## 2. From many rows to one

An *aggregate function* takes a whole column of values and returns one value. Without GROUP BY (next lesson), the whole table becomes one row.

```sql
-- try
SELECT COUNT(*) AS orders,
       SUM(amount) AS total,
       AVG(amount) AS average,
       MIN(amount) AS smallest,
       MAX(amount) AS largest
FROM mini_orders
```

Press **Show how it runs** and watch the aggregate step: six rows squeeze into one. 6 orders, $265 in total, an average of $44.17, smallest $5, largest $90.

| Function | Gives | Ignores NULL? |
|---|---|---|
| `COUNT(*)` | number of rows | counts every row |
| `COUNT(col)` | number of non-NULL values | yes |
| `SUM(col)` | total | yes |
| `AVG(col)` | SUM ÷ COUNT(col) | yes |
| `MIN(col)`, `MAX(col)` | smallest, largest | yes |

## 3. COUNT(*) vs COUNT(column)

`COUNT(*)` counts rows. `COUNT(email)` counts rows where email has a value. The gap between them is the number of NULLs, which makes a quick data-quality check:

```sql
-- try
SELECT COUNT(*) AS customers,
       COUNT(email) AS with_email,
       COUNT(loyalty_tier) AS with_tier
FROM customers
```

603 customers, 566 with an email, 545 with a tier.

## 4. SUM and AVG on expressions

The money in Northbay is per order line: quantity × unit_price × (1 − discount). You can aggregate any expression, not just a column:

```sql
-- try
SELECT COUNT(*) AS lines,
       SUM(quantity) AS units,
       ROUND(SUM(quantity * unit_price * (1 - discount)), 2) AS revenue,
       ROUND(AVG(quantity * unit_price * (1 - discount)), 2) AS avg_line
FROM order_items
```

7,310 lines, 11,019 units, $129,777.78 of revenue (this still includes cancelled orders; Lesson 4.2 joins to `orders` to remove them), and an average line of $17.75. Note: `ROUND` goes *outside* the SUM. Rounding every line first and then adding gives a slightly different total.

## 5. AVG skips NULLs

Store 12 (online) has no size. AVG skips it, so it divides by 11, not 12:

```sql
-- try
SELECT AVG(size_sqft) AS avg_skipping_null,
       SUM(size_sqft) / 12.0 AS avg_over_all_12,
       COUNT(size_sqft) AS stores_with_size
FROM stores
```

16,409 vs 15,042. Which is right depends on the question: the average size of a physical store is the first. If a NULL really means zero, say so: `AVG(COALESCE(x, 0))`.

## 6. MIN and MAX work on text and dates too

MIN and MAX use the same order as ORDER BY, so they work on any type. On ISO dates they give the earliest and latest date:

```sql
-- try
SELECT MIN(joined_on) AS first_signup,
       MAX(joined_on) AS latest_signup,
       MIN(last_name) AS first_alphabetically
FROM customers
```

## 7. Aggregates and WHERE together

WHERE runs first, so it decides which rows get aggregated:

```sql
-- try
SELECT COUNT(*) AS cancelled_2025
FROM orders
WHERE status = 'cancelled' AND order_date LIKE '2025%'
```

But you can't put an aggregate *inside* WHERE (a WHERE tests one row; a SUM needs many):

```sql
-- fails
SELECT product_id
FROM order_items
WHERE SUM(quantity) > 100
```

That condition belongs in HAVING, after GROUP BY (Lesson 3.3).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an aggregate is a function from a *bag* of values to a single value. In relational algebra it is written γ (gamma); with no grouping columns, γ turns the whole table into one row. NULLs are removed from the bag before the function is applied, except by COUNT(*), which counts rows, not values.

**Equation:** for the bag of non-NULL values x<sub>1</sub>, ..., x<sub>n</sub>: SUM = Σ x<sub>i</sub>, COUNT = n, AVG = Σ x<sub>i</sub> / n, MIN = min x<sub>i</sub>. When n = 0, SUM, AVG, MIN and MAX are NULL (there is no value to report) while COUNT is 0.

**Analogy:** a till receipt's last line. All the items squeeze into "TOTAL". It breaks down a little because SUM of nothing is NULL rather than the 0.00 a till would print.

**Try it:** the bag {45, 5, NULL, 90}. What are COUNT(*), COUNT(x) and AVG(x)? (4, 3, and (45 + 5 + 90) / 3 ≈ 46.67.)
</details>

## 8. Worked example

*Question:* how much Electronics has Northbay sold, and what is the average line worth?

1. Electronics products are ids 56 to 61 (`SELECT product_id FROM products WHERE category_id = 10`). Joining tables would be neater; that comes in Module 4.
2. Filter order lines to those products: `WHERE product_id BETWEEN 56 AND 61`.
3. Aggregate:

```sql
-- try
SELECT COUNT(*) AS lines,
       SUM(quantity) AS units,
       ROUND(SUM(quantity * unit_price * (1 - discount)), 2) AS revenue
FROM order_items
WHERE product_id BETWEEN 56 AND 61
```

4. Result: 390 lines, 569 units, **$21,096.22**. Average per line: 21,096.22 / 390 ≈ **$54.09**, about three times the $17.75 average across all products, which makes sense for earbuds and speakers.

## 9. Practice

```sql
-- exercise: Find the lowest, highest and average salary at Northbay (round the average to a whole number).
-- hint: MIN(salary), MAX(salary), ROUND(AVG(salary)).
SELECT salary FROM employees
-- answer:
SELECT MIN(salary), MAX(salary), ROUND(AVG(salary))
FROM employees
```

```sql
-- exercise: How many units of product 1 (Apples 1 kg) have been sold? Return one number.
-- hint: SUM(quantity) with WHERE product_id = 1. COUNT(*) would count lines, not units.
SELECT COUNT(*) AS units
FROM order_items
WHERE product_id = 1
-- answer:
SELECT SUM(quantity) AS units
FROM order_items
WHERE product_id = 1
```

```sql
-- exercise: Count the orders that have a customer (customer_id not NULL) and the orders in total, in one row, without using WHERE.
-- hint: COUNT(customer_id) skips NULLs; COUNT(*) does not.
SELECT COUNT(*) AS all_orders
FROM orders
-- answer:
SELECT COUNT(customer_id) AS member_orders, COUNT(*) AS all_orders
FROM orders
```

**New words:** *aggregate function*, *γ (gamma)*, *bag*.
