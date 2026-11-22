---
title: 'AND, OR, IN, BETWEEN and LIKE'
seoTitle: 'SQL AND, OR, IN, BETWEEN and LIKE with examples'
summary: 'Combine conditions with AND and OR, test against a list with IN, a range with BETWEEN and a pattern with LIKE, and avoid the AND-before-OR trap that quietly inflates numbers.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'In WHERE a OR b AND c, which part is worked out first?'
    choices: ['a OR b', 'b AND c', 'They are worked out left to right']
    ans: 1
    why: AND binds tighter than OR, just as × binds tighter than +. Use brackets to say what you mean.
  - q: 'Does BETWEEN 10 AND 20 include 10 and 20?'
    choices: ['Yes, both ends', 'Neither end', 'Only 10']
    ans: 0
    why: BETWEEN is inclusive at both ends. It is shorthand for x >= 10 AND x <= 20.
  - q: 'Which product names does LIKE ''%pack'' match?'
    choices: ['Names that start with pack', 'Names that end with pack', 'Names with exactly four letters']
    ans: 1
    why: '% stands for any run of characters (even none), so %pack means anything, then pack at the very end.'
---

**Module 2 · about 30 minutes · read first: 2.2.** You'll be able to combine several conditions safely, test against lists, ranges and text patterns, and explain why brackets matter around OR.

## 1. Why this matters

Real filters are rarely one test: "completed online orders in Black Friday week, in Alberta or BC". A single missing bracket around an OR can double a number without any error message, and these mistakes are among the hardest to spot in a finished report. The operators here are short, but precision with them is what makes your numbers trusted.

## 2. AND: both must be true

`AND` keeps a row only if the conditions on both sides are true.

```sql
-- try
SELECT order_id, order_date, store_id
FROM orders
WHERE channel = 'online' AND status = 'cancelled'
```

29 online orders were cancelled. Each extra AND can only keep the same rows or fewer.

## 3. OR: either will do

`OR` keeps a row if at least one side is true. Run this, then press **Show how it runs** and watch which mini orders survive the WHERE step:

```sql
-- try
SELECT order_id, item, amount
FROM mini_orders
WHERE item = 'Kettle' OR amount < 10
```

Three rows pass: the two Kettles (by the first test) and the Bagels (by the second).

`NOT` flips a test: `WHERE NOT status = 'completed'` is the same as `WHERE status <> 'completed'`.

## 4. The AND-before-OR trap

*Question:* how many 2025 orders did store 4 (Ottawa) and store 8 (Winnipeg) take together?

```sql
-- try
SELECT COUNT(*) AS orders
FROM orders
WHERE store_id = 4 OR store_id = 8 AND order_date LIKE '2025%'
```

That says 455, and it is wrong. SQL works out `AND` before `OR`, the way maths does × before +, so it read the query as "store 4 (any year) OR (store 8 in 2025)". Store 4's 2024 orders sneaked in. Add brackets:

```sql
-- try
SELECT COUNT(*) AS orders
FROM orders
WHERE (store_id = 4 OR store_id = 8) AND order_date LIKE '2025%'
```

310. The rule: **whenever a WHERE mixes AND with OR, put brackets around the OR.**

## 5. IN: one of a list

`x IN (a, b, c)` is short for `x = a OR x = b OR x = c`, and it can't fall into the bracket trap.

```sql
-- try
SELECT order_id, item, amount
FROM mini_orders
WHERE item IN ('Kettle', 'Duvet')
```

`NOT IN` keeps rows whose value is none of the list:

```sql
-- try
SELECT store_name, city
FROM stores
WHERE city NOT IN ('Toronto', 'Ottawa')
```

You get 9 stores, not 10: Northbay Online has no city (NULL), and NULL is never "not in" anything. Lesson 2.4 explains why.

## 6. BETWEEN: a range, both ends included

`x BETWEEN a AND b` means `x >= a AND x <= b`. Both ends count.

```sql
-- try
SELECT product_name, unit_price
FROM products
WHERE unit_price BETWEEN 10 AND 20
```

With dates, BETWEEN is a neat way to say "this week". Black Friday 2025 ran from 24 to 30 November:

```sql
-- try
SELECT COUNT(*) AS black_friday_orders
FROM orders
WHERE order_date BETWEEN '2025-11-24' AND '2025-11-30'
```

70 orders. Be careful when a column holds a date *and a time* (common in SQL Server and PostgreSQL): `BETWEEN '2025-11-24' AND '2025-11-30'` then stops at midnight at the start of the 30th. The safe habit there is `>= '2025-11-24' AND < '2025-12-01'`.

## 7. LIKE: a text pattern

`LIKE` matches text against a pattern with two wildcards:

- `%` any run of characters, including none
- `_` exactly one character

```sql
-- try
SELECT product_name
FROM products
WHERE product_name LIKE '%pack%'
```

Seven product names contain "pack". Try `'B%'` (starts with B), `'%s'` (ends with s) and `'_____'` (exactly five characters).

In SQLite, LIKE ignores capitals for plain English letters, so `'b%'` finds "Bagels" too. PostgreSQL's LIKE does care about capitals (use `ILIKE` there to ignore them); SQL Server follows the database's collation, which usually ignores them.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** conditions combine with the rules of *Boolean algebra*. AND keeps the rows in both sets (intersection), OR keeps rows in either (union), and NOT keeps rows outside (complement).

**Equation:** σ<sub>p AND q</sub>(T) = σ<sub>p</sub>(T) ∩ σ<sub>q</sub>(T) and σ<sub>p OR q</sub>(T) = σ<sub>p</sub>(T) ∪ σ<sub>q</sub>(T). Precedence: NOT, then AND, then OR, so a OR b AND c = a OR (b AND c), like a + b × c = a + (b × c). De Morgan: NOT (p OR q) = (NOT p) AND (NOT q).

**Analogy:** a Venn diagram. AND is the overlap, OR is everything shaded. It breaks down a little with NULL, which belongs to neither the "true" circle nor the "false" one.

**Try it:** using De Morgan, rewrite NOT (store_id = 4 OR store_id = 8). (store_id <> 4 AND store_id <> 8, which is the same as store_id NOT IN (4, 8).)
</details>

## 8. Worked example

*Question:* during Black Friday week 2025 (24 to 30 November), which completed orders came through the two Alberta stores (9 Calgary, 10 Edmonton)?

1. The week: `order_date BETWEEN '2025-11-24' AND '2025-11-30'`.
2. Completed only: `AND status = 'completed'`.
3. Alberta stores: `AND store_id IN (9, 10)`. IN avoids the OR bracket trap.

```sql
-- try
SELECT order_id, order_date, store_id
FROM orders
WHERE order_date BETWEEN '2025-11-24' AND '2025-11-30'
  AND status = 'completed'
  AND store_id IN (9, 10)
```

There are 5. Now change `IN (9, 10)` to `= 12` to see the online orders for the same week.

## 9. Practice

```sql
-- exercise: List the name and price of products that cost between $30 and $40 (inclusive).
-- hint: unit_price BETWEEN 30 AND 40
SELECT product_name, unit_price
FROM products
WHERE unit_price > 30
-- answer:
SELECT product_name, unit_price
FROM products
WHERE unit_price BETWEEN 30 AND 40
```

```sql
-- exercise: Count customers who live in Alberta or British Columbia (province AB or BC).
-- hint: province IN ('AB', 'BC')
SELECT COUNT(*) AS customers
FROM customers
WHERE province = 'AB'
-- answer:
SELECT COUNT(*) AS customers
FROM customers
WHERE province IN ('AB', 'BC')
```

```sql
-- exercise: This query should count cancelled orders at store 1 or store 2, but the number is too big. Fix it.
-- hint: AND is worked out before OR. Put brackets around the OR (or use IN).
SELECT COUNT(*) AS cancelled
FROM orders
WHERE store_id = 1 OR store_id = 2 AND status = 'cancelled'
-- answer:
SELECT COUNT(*) AS cancelled
FROM orders
WHERE store_id IN (1, 2) AND status = 'cancelled'
```

```sql
-- exercise: Find every product whose name ends in "set". Show the name only.
-- hint: LIKE '%set' (the % goes before the word).
SELECT product_name
FROM products
WHERE product_name LIKE 'set%'
-- answer:
SELECT product_name
FROM products
WHERE product_name LIKE '%set'
```

**New words:** *Boolean*, *precedence*, *IN*, *BETWEEN*, *LIKE*, *wildcard*.
