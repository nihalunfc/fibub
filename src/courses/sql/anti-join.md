---
title: 'Anti-joins and semi-joins: NOT EXISTS and EXISTS'
seoTitle: 'SQL NOT EXISTS vs NOT IN vs LEFT JOIN IS NULL'
summary: 'Find rows that have no match (anti-join) or at least one match (semi-join) without copying rows. Compare NOT EXISTS, LEFT JOIN ... IS NULL and NOT IN, and see the NULL trap that makes NOT IN return nothing.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What does a semi-join return?
    choices: ['Rows from the left table that have at least one match, each once', 'Every matching pair, like an inner join', 'Rows with no match']
    ans: 0
    why: A semi-join only asks "is there a match?". Each left row comes back once, however many matches it has, and no right-table columns are added.
  - q: 'customer_id NOT IN (SELECT customer_id FROM orders) returns 0 rows on Northbay. Why?'
    choices: ['Every customer has ordered', 'orders.customer_id contains NULLs (guests), and NOT IN with a NULL is never true', 'NOT IN only works on text']
    ans: 1
    why: x NOT IN (1, 2, NULL) means x <> 1 AND x <> 2 AND x <> NULL. The last test is unknown, so the whole thing is never true.
  - q: Which anti-join form is safe with NULLs and does not copy rows?
    choices: ['NOT IN', 'NOT EXISTS', 'INNER JOIN']
    ans: 1
    why: NOT EXISTS only asks whether a matching row exists, so NULLs in the other table cannot spoil it, and each left row appears at most once.
---

**Module 4 · about 25 minutes · read first: 4.3.** You'll be able to find rows with no match and rows with at least one match, choose between NOT EXISTS, LEFT JOIN and NOT IN, and avoid the NOT IN NULL trap.

## 1. Why this matters

"Customers who never bought", "products never returned", "stores that sold nothing last week": these questions come up every week in analyst work. They are not really joins, because you don't want any columns from the other table; you only want to know whether a match exists. SQL has a clean way to ask exactly that, and one popular way that quietly breaks.

## 2. Two questions, two names

- An **anti-join** keeps rows from table A that have **no** match in table B.
- A **semi-join** keeps rows from table A that have **at least one** match in table B, each row once.

Neither adds columns from B, and neither repeats rows. That is the difference from an inner join, which repeats a customer once per order.

## 3. NOT EXISTS: the anti-join

`EXISTS (subquery)` is true when the subquery returns at least one row. `NOT EXISTS` is true when it returns none. Inside the subquery you refer to the outer row (`c.id`), so it is checked once for each customer:

```sql
-- try
SELECT c.id, c.name
FROM mini_customers c
WHERE NOT EXISTS (
  SELECT 1 FROM mini_orders o WHERE o.customer_id = c.id
)
```

Dina and Eli, the customers with no orders. The `SELECT 1` doesn't matter; EXISTS only cares whether any row comes back, so people write `1` or `*`.

On Northbay, the same pattern finds products that were never returned:

```sql
-- try
SELECT p.product_id, p.product_name
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM returns r WHERE r.product_id = p.product_id
)
```

Four products out of 61: strawberries, sourdough, eggs and salted cashews. All cheap groceries, which makes sense.

## 4. EXISTS: the semi-join

Swap to `EXISTS` and you get the customers who *do* have a match. Compare it with an inner join:

```sql
-- try
SELECT c.id, c.name
FROM mini_customers c
WHERE EXISTS (
  SELECT 1 FROM mini_orders o WHERE o.customer_id = c.id
)
```

Asha, Ben and Chen, each once. An inner join would show Asha and Chen twice (two orders each), and you would need DISTINCT to undo it.

## 5. Three ways to write an anti-join

You met the first one in [Lesson 4.3](/learn/courses/sql/left-join/). All three ask "which customers have never ordered?":

```sql
-- try
-- 1. LEFT JOIN ... IS NULL
SELECT c.customer_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL
```

```sql
-- try
-- 2. NOT EXISTS
SELECT c.customer_id
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)
```

Both return customers 601, 602 and 603. Now the third:

```sql
-- try
-- 3. NOT IN
SELECT c.customer_id
FROM customers c
WHERE c.customer_id NOT IN (SELECT customer_id FROM orders)
```

**No rows at all.** This is the **NOT IN trap**. `orders.customer_id` is NULL for the 482 guest orders. `x NOT IN (list)` means "x is different from every item", and "different from NULL" is never true or false, only unknown. One NULL in the list makes NOT IN fail for every row. No error, just an empty answer that looks believable.

If you must use NOT IN, filter the NULLs out: `NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL)`. Better: make NOT EXISTS your habit. It is NULL-safe, it never copies rows, and every major database runs it efficiently.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a semi-join keeps the rows of A that have a partner in B; an anti-join keeps the rest. Together they split A into two parts with no overlap.

**Equation:** semi-join A ⋉ B = π_A(A ⋈ B), and anti-join A ▷ B = A − (A ⋉ B). So |A ⋉ B| + |A ▷ B| = |A|. For mini_customers: 3 + 2 = 5. NOT IN fails because SQL uses three-valued logic: TRUE, FALSE and UNKNOWN. x ≠ NULL is UNKNOWN, TRUE AND UNKNOWN is UNKNOWN, and WHERE keeps only TRUE.

**Analogy:** a guest list at the door. EXISTS asks "is your name on the list?"; it doesn't matter if it is written three times. NOT IN asks "is your name different from every name on the list?" If one line is smudged and unreadable, the doorman can never say yes.

**Try it:** Northbay has 603 customers and 3 never ordered. How many does EXISTS return? (600.)
</details>

## 6. Worked example: loyal customers who returned something

*Question:* how many loyalty members have returned at least one item?

Returns point at orders, and orders point at customers. A semi-join asks for customers where such a pair exists:

```sql
-- try
SELECT COUNT(*) AS customers_with_returns
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  JOIN returns r ON r.order_id = o.order_id
  WHERE o.customer_id = c.customer_id
)
```

The answer is **153**. With an inner join and `COUNT(*)` you would count return rows, not customers, and get a bigger, wrong number.

## 7. Practice

```sql
-- exercise: List the customer_id, first_name and last_name of customers who have ordered online but never in a store.
-- hint: Two tests in WHERE: EXISTS an order with channel = 'online', AND NOT EXISTS an order with channel = 'store'.
SELECT c.customer_id, c.first_name, c.last_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.channel = 'online')
-- answer:
SELECT c.customer_id, c.first_name, c.last_name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.channel = 'online')
  AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.channel = 'store')
```

```sql
-- exercise: List the names of categories where no product was ever returned with the reason 'Not as described'.
-- hint: NOT EXISTS with a subquery that joins returns to products and checks p.category_id = c.category_id and r.reason = 'Not as described'.
SELECT c.category_name
FROM categories c
-- answer:
SELECT c.category_name
FROM categories c
WHERE NOT EXISTS (
  SELECT 1
  FROM returns r
  JOIN products p ON p.product_id = r.product_id
  WHERE p.category_id = c.category_id
    AND r.reason = 'Not as described'
)
```

```sql
-- exercise: Fix the NOT IN query so it finds the 3 customers who never ordered.
-- hint: Keep NOT IN, but remove the NULLs from the subquery with WHERE customer_id IS NOT NULL. Or rewrite it with NOT EXISTS.
SELECT c.customer_id
FROM customers c
WHERE c.customer_id NOT IN (SELECT customer_id FROM orders)
-- answer:
SELECT c.customer_id
FROM customers c
WHERE c.customer_id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL)
```

**New words:** *anti-join*, *semi-join*, *EXISTS*, *NOT EXISTS*, *NOT IN trap*, *three-valued logic*.
