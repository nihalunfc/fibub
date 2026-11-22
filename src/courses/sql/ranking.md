---
title: 'ROW_NUMBER, RANK and DENSE_RANK'
seoTitle: 'SQL ROW_NUMBER vs RANK vs DENSE_RANK, with examples'
summary: 'Three ways to number rows in order, and they only differ when there are ties. See the difference row by row on six orders, then rank stores and staff on Northbay.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Scores 90, 60, 45, 45, 20. What does RANK() give the 20?'
    choices: ['4', '5', '6']
    ans: 1
    why: The two 45s share rank 3, and RANK skips the next number, so the 20 is 5th. DENSE_RANK would give 4. ROW_NUMBER would also give 5 here, but only by luck of position.
  - q: Which function always gives every row a different number?
    choices: ['RANK', 'DENSE_RANK', 'ROW_NUMBER']
    ans: 2
    why: ROW_NUMBER numbers rows 1, 2, 3 ... with no repeats, even when the ORDER BY values tie. RANK and DENSE_RANK give ties the same number.
  - q: Two rows tie and you use ROW_NUMBER. Which one gets the lower number?
    choices: ['The one with the lower id, always', 'Whichever the database meets first, unless you add a tie-breaker to ORDER BY', 'Both get the same number']
    ans: 1
    why: With a tie, the order is not defined, so the result can change between runs or databases. Add a second ORDER BY column, such as an id, to make it repeatable.
---

**Module 6 · about 25 minutes · read first: 6.1.** You'll be able to number and rank rows with ROW_NUMBER, RANK and DENSE_RANK, choose the right one when there are ties, and rank inside groups.

## 1. Why this matters

"Top 10 products", "best store in each region", "the customer's first order": they all start by putting rows in order and numbering them. The three ranking functions look alike, and the classic interview question is to explain how they differ. They only differ when two rows tie, and real data is full of ties.

## 2. Three ways to number rows

Ranking functions are window functions with an ORDER BY **inside** the OVER brackets. That ORDER BY says what "first" means; it does not sort the output.

- *ROW_NUMBER()*: 1, 2, 3, 4 ... every row a new number, ties or not.
- *RANK()*: ties share a number, then the next number is skipped (1, 2, 3, 3, 5), like a race with two runners in third place.
- *DENSE_RANK()*: ties share a number, no gaps (1, 2, 3, 3, 4).

`mini_orders` has two orders of $45, so all three show up:

```sql
-- try
SELECT order_id, amount,
       RANK() OVER (ORDER BY amount DESC) AS rnk,
       ROW_NUMBER() OVER (ORDER BY amount DESC) AS row_num,
       DENSE_RANK() OVER (ORDER BY amount DESC) AS dense
FROM mini_orders
```

Press **Show how it runs** and step to **OVER**. The animation draws the first window column, `rnk`. What to watch: the window for each row grows from the top of the ordered list down to that row, and orders 101 and 105 (both $45) both get 3, so the $20 order gets 5. Move `ROW_NUMBER()` to the first column and run the animation again to see 3 and 4 instead.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** ranking counts how many rows come before you in an order. The three functions count slightly different things.

**Equation:** for row r ordered by x descending:
RANK(r) = 1 + |{ s : s.x > r.x }| (rows strictly ahead).
DENSE_RANK(r) = 1 + |{ distinct s.x : s.x > r.x }| (distinct values ahead).
ROW_NUMBER(r) = position of r in one chosen total order, so it is a bijection from n rows onto {1, ..., n}.

**Analogy:** an exam. RANK is how a school reports places: two people tie for 3rd, nobody is 4th. DENSE_RANK is "which grade band are you in": the bands are numbered without gaps. ROW_NUMBER is the seat number when everyone lines up, and with a tie someone has to pick who stands first. It breaks down a little because a school has rules for that choice, and SQL does not unless you give it one.

**Try it:** values 90, 60, 45, 45, 20, 5. What is DENSE_RANK of the 5? (Distinct values ahead: 90, 60, 45, 20, so 5.)
</details>

## 3. Make ROW_NUMBER repeatable

When two rows tie, which gets row number 3 is up to the database. It may change after an update or on another server. Add a *tie-breaker*, a second ORDER BY column that is unique, so the answer is always the same:

```sql
-- try
SELECT order_id, amount,
       ROW_NUMBER() OVER (ORDER BY amount DESC, order_id) AS row_num
FROM mini_orders
```

Now order 101 always comes before 105. Use the table's key as the last tie-breaker by habit.

## 4. Rank inside groups with PARTITION BY

Add PARTITION BY and the numbering starts again at 1 in each group. Here staff at stores 1 and 2 are ranked by salary within their own store:

```sql
-- try
SELECT name, store_id, salary,
       RANK() OVER (PARTITION BY store_id ORDER BY salary DESC) AS pay_rank
FROM employees
WHERE store_id IN (1, 2)
```

Press **Show how it runs**: at the OVER step, the two stores are separate coloured partitions, and the count restarts at 1 when the window moves into store 2. Both store managers come out as rank 1.

## 5. Worked example

*Question:* rank the Ontario stores (store_id 1 to 7) by completed orders in 2025.

```sql
-- try
WITH s AS (
  SELECT store_id, COUNT(*) AS orders_2025
  FROM orders
  WHERE status = 'completed'
    AND order_date BETWEEN '2025-01-01' AND '2025-12-31'
    AND store_id <= 7
  GROUP BY store_id
)
SELECT store_id, orders_2025,
       RANK() OVER (ORDER BY orders_2025 DESC) AS rnk
FROM s
ORDER BY rnk, store_id
```

1. The CTE gives one row per store: 7 rows.
2. Store 4 (Ottawa) leads with 161, then store 2 with 158.
3. Stores 5 and 7 both have 127, so both are **5th**, and store 1 (121) is **7th**: no store is 6th.
4. With DENSE_RANK, store 1 would be 6th. With ROW_NUMBER and no tie-breaker, one of stores 5 and 7 would be 6th, and you could not say which.

Which is right? If a manager asks "how many stores beat store 1?", RANK answers it: 6 stores, so 7th place.

## 6. Practice

```sql
-- exercise: Rank the Kitchen products (category_id = 6) from most to least expensive with DENSE_RANK, in a column called price_rank.
-- hint: DENSE_RANK() OVER (ORDER BY unit_price DESC).
SELECT product_name, unit_price
FROM products
WHERE category_id = 6
-- answer:
SELECT product_name, unit_price,
       DENSE_RANK() OVER (ORDER BY unit_price DESC) AS price_rank
FROM products
WHERE category_id = 6
```

```sql
-- exercise: Number the orders of each customer in mini_orders from biggest to smallest (1 = biggest), breaking ties by order_id.
-- hint: ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, order_id).
SELECT order_id, customer_id, amount,
       ROW_NUMBER() OVER (ORDER BY amount DESC) AS n
FROM mini_orders
-- answer:
SELECT order_id, customer_id, amount,
       ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, order_id) AS n
FROM mini_orders
```

```sql
-- exercise: Rank all head office and online staff (store_id IS NULL or store_id = 12) by salary, highest = 1.
-- hint: Filter in WHERE first, then RANK() OVER (ORDER BY salary DESC).
SELECT name, role, salary
FROM employees
-- answer:
SELECT name, role, salary,
       RANK() OVER (ORDER BY salary DESC) AS pay_rank
FROM employees
WHERE store_id IS NULL OR store_id = 12
```

**New words:** *ROW_NUMBER*, *RANK*, *DENSE_RANK*, *tie-breaker*.
