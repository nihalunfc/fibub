---
title: 'CASE: if-then inside a query'
seoTitle: 'SQL CASE WHEN explained with examples'
summary: 'Use CASE WHEN to label rows, sort them into bands, fix messy values and count things conditionally, with live examples on a store database.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'In a CASE with several WHEN lines, which one is used for a row?'
    choices: ['The last one that is true', 'The first one that is true', 'All the true ones, joined together']
    ans: 1
    why: CASE checks the WHEN lines from the top and stops at the first true one. Order your bands with that in mind.
  - q: What does CASE give when no WHEN is true and there is no ELSE?
    choices: ['0', 'An error', 'NULL']
    ans: 2
    why: Without an ELSE, rows that match nothing get NULL. Add ELSE to give them a label.
  - q: 'What does SUM(CASE WHEN channel = ''online'' THEN 1 ELSE 0 END) count?'
    choices: ['Online orders', 'All orders', 'Online revenue']
    ans: 0
    why: Each online row adds 1 and every other row adds 0, so the sum is the number of online rows.
---

**Module 2 · about 30 minutes · read first: 2.4.** You'll be able to write CASE expressions that label rows, group numbers into bands, tidy messy values, and count only the rows you care about.

## 1. Why this matters

Business people think in labels, not raw numbers: "small, medium, large orders", "Ontario vs the rest", "new vs returning customers". CASE is how you turn the data's values into the business's categories, right inside the query. It also powers one of the most useful analyst tricks: counting several different things in a single pass.

## 2. The shape of CASE

CASE is an *expression*: it works out one value per row, so it can go anywhere a column can (SELECT, WHERE, ORDER BY, GROUP BY).

```
CASE
  WHEN condition1 THEN result1
  WHEN condition2 THEN result2
  ELSE fallback
END
```

```sql
-- try
SELECT order_id, item, amount,
       CASE
         WHEN amount >= 50 THEN 'Large'
         WHEN amount >= 20 THEN 'Medium'
         ELSE 'Small'
       END AS size
FROM mini_orders
```

Press **Show how it runs** and stop at the SELECT step: the new `size` column is worked out row by row. The Duvet ($90) and Speaker ($60) are Large, the Kettles ($45) and Puzzle ($20) are Medium, the Bagels ($5) are Small.

## 3. First true WHEN wins

CASE reads the WHEN lines from the top and stops at the first one that is true. The Duvet at $90 passes `>= 50` and is labelled Large straight away; it never reaches the second test. A Kettle at $45 fails `>= 50`, moves on, and is caught by `>= 20`. So the second line really means "from 20 up to (not including) 50", without you writing the upper limit.

That's why bands go from one end to the other. Swap the two WHEN lines in the box above and run it: now everything $20 and over is "Medium", and nothing is ever "Large", because the broader test catches them first.

## 4. ELSE, and what happens without it

Rows that match no WHEN get the ELSE value. Without an ELSE they get NULL:

```sql
-- try
SELECT product_name, unit_price,
       CASE
         WHEN unit_price < 5 THEN 'Under $5'
         WHEN unit_price < 20 THEN '$5 to $20'
       END AS band
FROM products
ORDER BY unit_price DESC
LIMIT 8
```

The expensive products show a blank band. Add `ELSE '$20 and up'` before END and run it again. A good habit: always write an ELSE, even if it's `ELSE 'Check me'`, so surprises show up instead of hiding as NULL.

## 5. Labelling and tidying

CASE is handy for turning codes into words and NULLs into something readable:

```sql
-- try
SELECT store_name,
       CASE
         WHEN city IS NULL THEN 'Online'
         WHEN province = 'ON' THEN 'Ontario'
         ELSE 'Outside Ontario'
       END AS area
FROM stores
```

Note the test `city IS NULL` comes first. If it came after `province = 'ON'`, it would still work here, but putting the NULL test first is a safe habit, since a NULL fails every other comparison.

There is also a short form when you compare one column with fixed values:

```sql
-- try
SELECT customer_id, loyalty_tier,
       CASE loyalty_tier
         WHEN 'Gold' THEN 3
         WHEN 'Silver' THEN 2
         WHEN 'Bronze' THEN 1
         ELSE 0
       END AS tier_rank
FROM customers
LIMIT 10
```

## 6. CASE in ORDER BY

Sorting by a CASE puts rows in a business order instead of alphabetical order. Here Gold members come first, then Silver, then Bronze, then no tier:

```sql
-- try
SELECT first_name, last_name, loyalty_tier
FROM customers
WHERE customer_id <= 15
ORDER BY CASE loyalty_tier WHEN 'Gold' THEN 1 WHEN 'Silver' THEN 2 WHEN 'Bronze' THEN 3 ELSE 4 END,
         last_name
```

## 7. Counting with CASE

Put a CASE that gives 1 or 0 inside SUM and you count the rows that pass the test. Several of these side by side count several things in one pass. (SUM gets its own lesson next module; here, just read it as "add up".)

```sql
-- try
SELECT SUM(CASE WHEN channel = 'online' THEN 1 ELSE 0 END) AS online_orders,
       SUM(CASE WHEN channel = 'store' THEN 1 ELSE 0 END) AS store_orders,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled
FROM orders
WHERE order_date LIKE '2025%'
```

This *conditional aggregation* pattern returns in Lesson 8.6 for turning rows into columns. SQL Server also has `IIF(test, a, b)`, and PostgreSQL has `COUNT(*) FILTER (WHERE test)`; CASE works in all of them.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** CASE defines a *piecewise function* of each row, exactly like the piecewise functions in maths class. Because it looks at one row at a time, it adds a column without changing the number of rows.

**Equation:** size(r) = 'Large' if r.amount ≥ 50; 'Medium' if 20 ≤ r.amount < 50; 'Small' otherwise. The "first true WHEN wins" rule is what makes the second piece mean 20 ≤ amount < 50, without writing the < 50. For counting, the CASE is an *indicator function*: 1<sub>p</sub>(r) = 1 if p(r) is true, else 0, and Σ 1<sub>p</sub>(r) = |σ<sub>p</sub>(T)|.

**Analogy:** a sorting machine for parcels with a row of gates. Each parcel goes through the first gate that fits it. It breaks down a little with NULL: a NULL fails every gate, so it always ends up at ELSE.

**Try it:** with bands "< 5", "< 20", ELSE, which band does a $5.00 product fall into? ('$5 to $20': 5 < 5 is false, 5 < 20 is true.)
</details>

## 8. Worked example

*Question:* how are Northbay's 61 products spread across price bands: under $5, $5 to $20, and $20 and up?

1. Band each product with CASE: `< 5`, then `< 20`, then ELSE.
2. Count the products per band. That needs GROUP BY, which you'll meet in Lesson 3.2, so here we use the counting trick from section 7 instead:

```sql
-- try
SELECT SUM(CASE WHEN unit_price < 5 THEN 1 ELSE 0 END) AS under_5,
       SUM(CASE WHEN unit_price >= 5 AND unit_price < 20 THEN 1 ELSE 0 END) AS from_5_to_20,
       SUM(CASE WHEN unit_price >= 20 THEN 1 ELSE 0 END) AS from_20_up
FROM products
```

3. Result: **19** under $5, **25** from $5 to $20, **17** at $20 and up. Check: 19 + 25 + 17 = 61, every product counted once. Always do that check: if the bands overlap or leave a gap, the total won't match.

## 9. Practice

```sql
-- exercise: Label each employee's salary: 'Senior' for 100000 or more, 'Mid' for 60000 or more, otherwise 'Entry'. Show name, salary and the label (call it level).
-- hint: Start with the highest band: WHEN salary >= 100000 THEN 'Senior' WHEN salary >= 60000 THEN 'Mid' ELSE 'Entry'.
SELECT name, salary
FROM employees
-- answer:
SELECT name, salary,
       CASE WHEN salary >= 100000 THEN 'Senior'
            WHEN salary >= 60000 THEN 'Mid'
            ELSE 'Entry' END AS level
FROM employees
```

```sql
-- exercise: This query should put each mini order into 'Large' (50 or more) or 'Medium' (20 or more), else 'Small', but nothing comes out Large. Fix it.
-- hint: The first true WHEN wins, so the broad test is catching everything. Swap the WHEN lines.
SELECT order_id, amount,
       CASE WHEN amount >= 20 THEN 'Medium'
            WHEN amount >= 50 THEN 'Large'
            ELSE 'Small' END AS size
FROM mini_orders
-- answer:
SELECT order_id, amount,
       CASE WHEN amount >= 50 THEN 'Large'
            WHEN amount >= 20 THEN 'Medium'
            ELSE 'Small' END AS size
FROM mini_orders
```

```sql
-- exercise: Count in one row how many customers have a NULL email and how many have a NULL loyalty tier.
-- hint: SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END), and the same for loyalty_tier.
SELECT SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) AS no_email
FROM customers
-- answer:
SELECT SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) AS no_email,
       SUM(CASE WHEN loyalty_tier IS NULL THEN 1 ELSE 0 END) AS no_tier
FROM customers
```

**New words:** *CASE expression*, *band*, *piecewise function*, *indicator function*, *conditional aggregation*.
