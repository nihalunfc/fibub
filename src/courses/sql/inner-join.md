---
title: INNER JOIN
seoTitle: 'SQL INNER JOIN explained with examples'
summary: 'An inner join glues each row of one table to its matching rows in another, and drops rows with no match. Watch it pair orders with customers row by row, then join three tables on Northbay.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'mini_orders has 6 rows. Order 106 points at customer 9, who does not exist. How many rows does mini_orders INNER JOIN mini_customers return?'
    choices: ['6', '5', '11']
    ans: 1
    why: An inner join keeps only pairs that match. Order 106 has no partner, so it is dropped and 5 rows are left.
  - q: Why do Dina and Eli not appear in the inner join result?
    choices: ['They have no orders, so nothing matches them', 'Their names are too short', 'Inner joins only keep the first 3 customers']
    ans: 0
    why: Unmatched rows on either side are dropped. Customers with no orders vanish, just as orders with no customer do.
  - q: 'What does o.customer_id mean in FROM mini_orders o?'
    choices: ['A column called o.customer_id', 'The customer_id column of the table nicknamed o', 'The customer_id of the first row']
    ans: 1
    why: The letter after the table name is an alias, a short nickname. o.customer_id is the customer_id column of mini_orders.
---

**Module 4 · about 25 minutes · read first: 4.1.** You'll be able to write an inner join, predict which rows survive it, and join three or four tables to answer a real business question.

## 1. Why this matters

Almost no real question lives in one table. "Revenue by store" needs orders and stores; "revenue by department" needs order lines, products and categories. The join is the tool that answers them, and the inner join is the one you will write most often. It is also where quiet mistakes start, so it pays to know exactly which rows it keeps.

## 2. The idea: pair rows whose keys match

An **inner join** takes two tables and, for every pair of rows where the join condition is true, makes one combined row. Rows with no partner are dropped. The **join condition** goes after `ON` and almost always says "this foreign key equals that primary key".

Press **Run**, then **Show how it runs** and **Play**. Watch each order look for its customer.

```sql
-- try
SELECT o.order_id, o.item, c.name, c.city
FROM mini_orders o
JOIN mini_customers c ON o.customer_id = c.id
```

Things to notice:

- Asha (id 1) has two orders, so she appears twice. A join repeats a row once for every match.
- Order 106 points at customer 9. There is no customer 9, so the order disappears.
- Dina and Eli have no orders, so they disappear too.

`JOIN` on its own means `INNER JOIN`; both spellings work everywhere. The letters `o` and `c` are **aliases**: short nicknames so you can write `o.order_id` instead of `mini_orders.order_id`. Once a query has two tables, prefix every column with its alias, even when the name is unique. Readers (and you, next month) will thank you.

## 3. When the columns share a name: USING

If both tables call the key column the same thing, `USING` is a shorter way to say it. In Northbay, `orders.store_id` and `stores.store_id` match:

```sql
-- try
SELECT s.store_name, COUNT(*) AS orders
FROM orders o
JOIN stores s USING (store_id)
GROUP BY s.store_name
ORDER BY orders DESC
```

`USING (store_id)` means `ON o.store_id = s.store_id`. Northbay Online is far ahead with 1,059 orders; the busiest shop, Northbay Bytown in Ottawa, has 310. SQL Server does not support `USING`, so write the `ON` version there.

## 4. Joining three or more tables

Each extra `JOIN` adds one more table to the rows built so far. To get revenue by department you walk the pointers: order line → product → category.

```sql
-- try
SELECT c.department,
       ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 2) AS revenue
FROM order_items oi
JOIN products p   ON p.product_id = oi.product_id
JOIN categories c ON c.category_id = p.category_id
GROUP BY c.department
ORDER BY revenue DESC
```

Press **Show how it runs** to see the second join add the department to rows that already have the product. Grocery leads with $49,790.69.

A habit worth building: before you add a join, ask "how many rows on the right will match each row on the left?" If the answer is "exactly one" (many lines to one product), the row count stays the same. If it could be more than one, rows will multiply; that is [Lesson 4.5](/learn/courses/sql/fan-out/).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a join is a filtered pairing. Take every possible pair of rows, one from each table, and keep the pairs where the condition is true.

**Equation:** A ⋈_θ B = σ_θ(A × B). The **Cartesian product** A × B has |A| · |B| pairs; the selection σ_θ keeps those that satisfy θ (here `o.customer_id = c.id`). For mini_orders and mini_customers that is 6 × 5 = 30 pairs, of which 5 survive.

**Analogy:** a school dance. Every student from class A could stand with every student from class B, but only pairs holding matching ticket numbers get onto the floor. Anyone whose number nobody else holds sits out.

**Try it:** if every order matched exactly one customer, how many rows would the join have? (Exactly as many as there are orders: each order pairs once.) Databases never really build all 30 pairs; they use the condition to jump straight to matches, but the answer is the same.
</details>

## 5. Worked example: orders by region

*Question:* how many orders did each sales region take?

Regions live in `regions`, and orders point at stores, which point at regions. So the path is orders → stores → regions:

```sql
-- try
SELECT r.region_name, COUNT(*) AS orders
FROM orders o
JOIN stores s  ON s.store_id = o.store_id
JOIN regions r ON r.region_id = s.region_id
GROUP BY r.region_name
ORDER BY orders DESC
```

Ontario South has 1,364, Prairies 835, Ontario North 529 and West Coast 277. Add them up: 3,005. But Northbay has 4,064 orders. Where did 1,059 go? They are the online orders: store 12 has no region (`region_id` is NULL), so the inner join dropped every one of them, with no warning. The numbers look fine; a quarter of the business is missing. [Lesson 4.3](/learn/courses/sql/left-join/) shows how to keep them.

## 6. Practice

```sql
-- exercise: List every mini order with the customer's name and city, but only for customers in Toronto.
-- hint: Join mini_orders to mini_customers on customer_id = id, then add WHERE c.city = 'Toronto'.
SELECT o.order_id, o.item
FROM mini_orders o
-- answer:
SELECT o.order_id, o.item, c.name, c.city
FROM mini_orders o
JOIN mini_customers c ON o.customer_id = c.id
WHERE c.city = 'Toronto'
```

```sql
-- exercise: Count completed orders per province. Join orders to stores and group by the store's province.
-- hint: JOIN stores s ON s.store_id = o.store_id, WHERE o.status = 'completed', GROUP BY s.province.
SELECT store_id, COUNT(*) AS orders
FROM orders
GROUP BY store_id
-- answer:
SELECT s.province, COUNT(*) AS orders
FROM orders o
JOIN stores s ON s.store_id = o.store_id
WHERE o.status = 'completed'
GROUP BY s.province
```

```sql
-- exercise: Show revenue per product category name, biggest first, rounded to 2 decimal places.
-- hint: order_items → products → categories. Revenue is quantity × unit_price × (1 − discount).
SELECT oi.product_id, SUM(oi.quantity) AS units
FROM order_items oi
GROUP BY oi.product_id
-- answer:
SELECT c.category_name,
       ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 2) AS revenue
FROM order_items oi
JOIN products p   ON p.product_id = oi.product_id
JOIN categories c ON c.category_id = p.category_id
GROUP BY c.category_name
ORDER BY revenue DESC
```

**Try it on your own data:** two CSV files with a shared id column? Join them in [[sql-playground]], or line them up without SQL in [[merge-csv]].

**New words:** *inner join*, *join condition*, *alias*, *USING*, *Cartesian product*.
