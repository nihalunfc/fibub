---
title: IN and EXISTS with subqueries
seoTitle: 'SQL IN vs EXISTS with subqueries, with examples'
summary: 'Filter one table by a list that another query makes: customers who bought tech, orders placed on Black Friday. Learn IN and EXISTS, why they beat a join for "has at least one", and when NOT IN goes wrong.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'What must a subquery used with IN return?'
    choices: ['Exactly one row', 'One column (any number of rows)', 'The same columns as the outer table']
    ans: 1
    why: IN checks whether a value is in a list, so the subquery must give one column. It can have any number of rows, including none.
  - q: 'Joining customers to their tech order lines gives 345 rows; IN gives 255 customers. Why the difference?'
    choices: ['IN is wrong', 'The join repeats a customer once per matching line; IN keeps each customer once', 'The join includes guests']
    ans: 1
    why: A join makes one row per match (fan-out). IN and EXISTS only ask whether there is a match, so each customer appears once.
  - q: 'Which is safe when the subquery column can be NULL?'
    choices: ['NOT IN', 'NOT EXISTS', 'Both are the same']
    ans: 1
    why: One NULL in a NOT IN list makes the test unknown for every row, so nothing comes back. NOT EXISTS is not affected.
---

**Module 5 · about 25 minutes · read first: 5.1 and 4.4.** You'll be able to filter rows with IN and EXISTS subqueries, pick between them, and avoid duplicates and the NOT IN NULL trap.

## 1. Why this matters

"Show me customers who bought electronics", "orders placed during a sale", "stores that sold anything in Boxing Week": the list you filter by comes from another table. IN and EXISTS let you say "keep rows whose value is on that list" in one readable line, without copying rows the way a join does. You will use them constantly in ad-hoc analysis.

## 2. IN with a list you type

You met `IN` in [Lesson 2.3](/learn/courses/sql/and-or-in-between-like/) with a typed list:

```sql
-- try
SELECT order_id, item, amount
FROM mini_orders
WHERE customer_id IN (1, 3)
```

`IN (1, 3)` is short for `customer_id = 1 OR customer_id = 3`.

## 3. IN with a subquery

Instead of typing the list, let a query make it. The subquery must return **one column**; it can return any number of rows.

*Question:* which mini customers bought a kettle?

```sql
-- try
SELECT id, name
FROM mini_customers
WHERE id IN (SELECT customer_id FROM mini_orders WHERE item = 'Kettle')
```

The inner query returns the list (1, 3); the outer query keeps Asha and Chen. Press **Show how it runs** to watch it.

On Northbay, the list often comes from a lookup table. *Question:* how many orders were placed during a Black Friday sale (there were two, in 2024 and 2025)?

```sql
-- try
SELECT COUNT(*) AS black_friday_orders
FROM orders
WHERE promo_id IN (SELECT promo_id FROM promotions WHERE promo_name = 'Black Friday')
```

135 orders. If next year's Black Friday is added to `promotions`, the query picks it up without changes.

## 4. IN vs a join: no copies

*Question:* how many customers have bought something from the Tech department? Tech is three steps away: order lines → products → categories.

```sql
-- try
SELECT COUNT(*) AS tech_customers
FROM customers
WHERE customer_id IN (
  SELECT o.customer_id
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  JOIN products p     ON p.product_id = oi.product_id
  JOIN categories c   ON c.category_id = p.category_id
  WHERE c.department = 'Tech'
)
```

**255** customers. A plain join from customers to those lines gives **345** rows, because a customer who bought tech three times appears three times; that is fan-out ([Lesson 4.5](/learn/courses/sql/fan-out/)). IN only asks "is this customer on the list?", so each customer counts once.

## 5. EXISTS: the same question, row by row

`EXISTS` asks whether a subquery returns any row at all. The subquery refers to the outer row, so it is checked for each customer:

```sql
-- try
SELECT COUNT(*) AS tech_customers
FROM customers cu
WHERE EXISTS (
  SELECT 1
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  JOIN products p     ON p.product_id = oi.product_id
  JOIN categories c   ON c.category_id = p.category_id
  WHERE c.department = 'Tech'
    AND o.customer_id = cu.customer_id
)
```

Also 255. So which should you use?

- **IN** reads most naturally when the subquery makes a simple list on its own ("promo ids called Black Friday").
- **EXISTS** suits conditions that tie the inner rows to the outer row, especially on more than one column (same customer *and* same store).
- For **NOT**, always prefer `NOT EXISTS`. `NOT IN` returns nothing if the list contains a NULL, as you saw in [Lesson 4.4](/learn/courses/sql/anti-join/). `orders.customer_id` has 482 NULLs, so `NOT IN (SELECT customer_id FROM orders)` is a trap.

Modern databases usually run IN and EXISTS the same way, so choose the one that reads best.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** IN tests set membership; EXISTS tests whether a set is non-empty. Both are semi-joins: they keep a row of the outer table at most once.

**Equation:** x IN S ⟺ x ∈ S, where S = π_col(subquery). EXISTS(S) ⟺ |S| > 0. In relational algebra both give Customers ⋉ TechLines, while a join gives Customers ⋈ TechLines, whose size is Σ (matches per customer). Here that is 345 versus 255.

**Analogy:** IN is checking a name against a printed guest list. EXISTS is asking the doorman, "has anyone with this name come through tonight?" Either way, you let the person in once, however many times their name appears.

**Try it:** `SELECT COUNT(*) FROM stores WHERE store_id IN (SELECT store_id FROM orders WHERE promo_id = 7)`. Did every store sell something in Boxing Week 2025? (Yes: all 12.)
</details>

## 6. Worked example: tech buyers by loyalty tier

*Question:* among customers who bought tech, how are loyalty tiers split?

```sql
-- try
SELECT COALESCE(loyalty_tier, '(none)') AS tier, COUNT(*) AS customers
FROM customers
WHERE customer_id IN (
  SELECT o.customer_id
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  JOIN products p     ON p.product_id = oi.product_id
  JOIN categories c   ON c.category_id = p.category_id
  WHERE c.department = 'Tech'
)
GROUP BY tier
ORDER BY customers DESC
```

Bronze **161**, Silver **56**, no tier **21**, Gold **17**: 255 in all. Because IN never copies a customer, the tier counts add up to the customer count, which is the check that tells you no fan-out crept in.

## 7. Practice

```sql
-- exercise: List the names of products that were returned at least once with the reason 'Damaged'.
-- hint: WHERE product_id IN (SELECT product_id FROM returns WHERE reason = 'Damaged').
SELECT product_name
FROM products
-- answer:
SELECT product_name
FROM products
WHERE product_id IN (SELECT product_id FROM returns WHERE reason = 'Damaged')
```

```sql
-- exercise: Count the orders placed at stores in the Prairies region. Use IN with a subquery on stores and regions, not a join in the outer query.
-- hint: WHERE store_id IN (SELECT s.store_id FROM stores s JOIN regions r ON r.region_id = s.region_id WHERE r.region_name = 'Prairies').
SELECT COUNT(*) AS orders
FROM orders
-- answer:
SELECT COUNT(*) AS orders
FROM orders
WHERE store_id IN (
  SELECT s.store_id
  FROM stores s
  JOIN regions r ON r.region_id = s.region_id
  WHERE r.region_name = 'Prairies'
)
```

```sql
-- exercise: List the first_name and last_name of Gold customers who have placed at least one online order. Use EXISTS.
-- hint: WHERE loyalty_tier = 'Gold' AND EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.channel = 'online').
SELECT c.first_name, c.last_name
FROM customers c
WHERE c.loyalty_tier = 'Gold'
-- answer:
SELECT c.first_name, c.last_name
FROM customers c
WHERE c.loyalty_tier = 'Gold'
  AND EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.channel = 'online')
```

**New words:** *IN subquery*, *membership*, *EXISTS subquery*.
