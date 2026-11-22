---
title: 'The grain trap: what one row means'
seoTitle: 'Data grain in SQL: what one row means and why it matters'
summary: 'Every table has a grain: what a single row stands for. Count or average at the wrong grain and the numbers look fine but are wrong. Learn to name the grain, test it, and change it with GROUP BY.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'What is the grain of order_items?'
    choices: ['One row per order', 'One row per product within an order', 'One row per product']
    ans: 1
    why: An order with three products has three rows in order_items, one for each product in it.
  - q: 'Why is COUNT(*) FROM order_items the wrong way to count orders?'
    choices: ['It counts order lines, and many orders have several lines', 'COUNT(*) skips NULLs', 'order_items has no order_id']
    ans: 0
    why: 'The table''s grain is the line, so COUNT(*) counts lines (7,310). Count orders with COUNT(DISTINCT order_id) (4,064), or count rows in orders.'
  - q: How do you check that order_id really is one row per order in a table?
    choices: ['GROUP BY order_id HAVING COUNT(*) > 1 should return no rows', 'SELECT DISTINCT order_id', 'ORDER BY order_id']
    ans: 0
    why: If any order_id appears more than once, that query shows it. An empty answer means the column is unique, so the grain holds.
---

**Module 3 · about 30 minutes · read first: 3.4.** You'll be able to state the grain of any table in one sentence, test it with a query, spot answers computed at the wrong grain, and use GROUP BY to change grain on purpose.

## 1. Why this matters

The most dangerous wrong numbers in BI are the ones that look reasonable. "Average order value: $17.75" sounds plausible, but it's the average **line**, and the real average order is nearly twice that. Almost every such mistake comes from losing track of the *grain*: what one row of the table stands for. Senior analysts ask "what's the grain?" before they look at anything else, and data modellers build whole designs around it.

## 2. Say the grain in one sentence

The *grain* of a table is the sentence "one row per ...". For Northbay:

| Table | Grain: one row per ... |
|---|---|
| orders | checkout (order) |
| order_items | product within an order |
| customers | loyalty sign-up |
| returns | product brought back |
| stores | store (and one for the website) |

Look at three small orders in `order_items`:

```sql
-- try
SELECT order_id, product_id, quantity, unit_price
FROM order_items
WHERE order_id BETWEEN 1006 AND 1008
```

Three orders, but five rows: order 1006 has two products, 1007 has two, 1008 has one. Same sales, two grains: orders would show 3 rows, order_items shows 5.

## 3. Counting at the wrong grain

"How many orders included a Bakery product?" Bakery is products 9 to 14.

```sql
-- try
SELECT COUNT(*) AS wrong_orders,
       COUNT(DISTINCT order_id) AS right_orders
FROM order_items
WHERE product_id BETWEEN 9 AND 14
```

`COUNT(*)` gives 820, which is the number of **Bakery lines**. Some orders had two Bakery products (bagels and croissants, say), so they're counted twice. The number of orders is 767. The question's noun ("orders") must match what you count; when the table's grain is finer than the noun, count distinct keys.

## 4. Averaging at the wrong grain

Average order value is a headline number in retail. Here are two attempts:

```sql
-- try
SELECT ROUND(AVG(quantity * unit_price * (1 - discount)), 2) AS avg_line,
       ROUND(SUM(quantity * unit_price * (1 - discount)) / COUNT(DISTINCT order_id), 2) AS avg_order
FROM order_items
```

AVG over order_items averages **lines**: $17.75. Total revenue divided by the number of orders gives the average **order**: $31.93. Both are correct answers to different questions; only the second is "average order value".

## 5. Changing grain with GROUP BY

GROUP BY changes the grain on purpose: group order_items by order_id and you get one row per order.

```sql
-- try
SELECT order_id,
       COUNT(*) AS lines,
       SUM(quantity) AS units,
       ROUND(SUM(quantity * unit_price * (1 - discount)), 2) AS order_value
FROM order_items
WHERE order_id BETWEEN 1006 AND 1008
GROUP BY order_id
```

Press **Show how it runs**. Watch the GROUP BY step colour the five lines into three groups, and the aggregate step squeeze each group to one row. Five rows at line grain become three rows at order grain. Now an average over *these* rows is an average per order.

You can feed that order-grain result into a second query. (Putting a query inside FROM is a *subquery*, covered in Lesson 5.1; for now just read the inner part as "the table of orders above, for every order".)

```sql
-- try
SELECT COUNT(*) AS orders,
       ROUND(AVG(order_value), 2) AS avg_order_value
FROM (
  SELECT order_id, SUM(quantity * unit_price * (1 - discount)) AS order_value
  FROM order_items
  GROUP BY order_id
) AS per_order
```

4,064 orders, average $31.93: the same as section 4, worked out the clearer way.

## 6. Test the grain, don't trust it

A grain is a promise; check it. If `order_id` is one row per order in `orders`, no id should appear twice:

```sql
-- try
SELECT order_id, COUNT(*) AS copies
FROM orders
GROUP BY order_id
HAVING COUNT(*) > 1
```

No rows: the grain holds. Run the same test on `order_items` and 1,900 order ids come back, because the grain there is the line, not the order. The true key of order_items is the *pair* (order_id, product_id); test it by grouping on both:

```sql
-- try
SELECT order_id, product_id, COUNT(*) AS copies
FROM order_items
GROUP BY order_id, product_id
HAVING COUNT(*) > 1
```

Empty again: each product appears at most once per order.

Sometimes the grain you *think* you have is not the one the business means. `customers` is one row per sign-up, but three people signed up twice, so it is not quite one row per person:

```sql
-- try
SELECT LOWER(email) AS email, COUNT(*) AS signups
FROM customers
WHERE email IS NOT NULL
GROUP BY LOWER(email)
HAVING COUNT(*) > 1
```

Counting customers as `COUNT(*)` would overstate people by three. Lesson 7.4 removes such duplicates.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the grain is the table's *index set*: the set of things each row stands for, one row per element. A table at a given grain is a function from that index set to the other columns. GROUP BY maps a fine grain onto a coarser one, and aggregates say how to combine the values that land together.

**Equation:** order_items is a function (order_id, product_id) → (quantity, unit_price, discount). Grouping by order_id maps 7,310 lines onto 4,064 orders: Σ<sub>k</sub> n<sub>k</sub> = 7,310, where n<sub>k</sub> is the number of lines in order k. An average depends on the index set: AVG over lines = 129,777.78 / 7,310; AVG over orders = 129,777.78 / 4,064. Same numerator, different denominator.

**Analogy:** a class's marks. "Average mark per test" and "average student's overall mark" use the same marks but different denominators. It breaks down a little when a grain is not unique in practice, like the duplicate customers: then the table is not a true function of its supposed key.

**Try it:** one order with 3 lines worth $10, $10 and $40. What is the average line, and what is the order value? ($20 per line; $60 for the order.)
</details>

## 7. Worked example

*Question:* how many lines does a typical Northbay order have?

1. Change grain to orders: `GROUP BY order_id` with `COUNT(*) AS lines`.
2. Change grain again, to "number of lines": group those results by `lines` and count orders in each.

```sql
-- try
SELECT lines, COUNT(*) AS orders
FROM (
  SELECT order_id, COUNT(*) AS lines
  FROM order_items
  GROUP BY order_id
) AS per_order
GROUP BY lines
ORDER BY lines
```

3. Result: 2,164 orders with 1 line, 986 with 2, 556 with 3, 284 with 4 and 74 with 5. Check: these add to 4,064, every order once.
4. So over half of orders (2,164 of 4,064, about 53%) are a single product, and the average of 1.8 lines per order is pulled up by bigger baskets. The grain changed twice: line → order → basket size.

## 8. Practice

```sql
-- exercise: How many different orders contain at least one Electronics product (product_id 56 to 61)? Return one number.
-- hint: The table's grain is the line; count distinct order_id.
SELECT COUNT(*) AS orders
FROM order_items
WHERE product_id BETWEEN 56 AND 61
-- answer:
SELECT COUNT(DISTINCT order_id) AS orders
FROM order_items
WHERE product_id BETWEEN 56 AND 61
```

```sql
-- exercise: Change order_items to one row per order for orders 1006 to 1010: order_id and the number of units (total quantity) in each.
-- hint: WHERE for the range, GROUP BY order_id, SUM(quantity).
SELECT order_id, quantity
FROM order_items
WHERE order_id BETWEEN 1006 AND 1010
-- answer:
SELECT order_id, SUM(quantity) AS units
FROM order_items
WHERE order_id BETWEEN 1006 AND 1010
GROUP BY order_id
```

```sql
-- exercise: Test the grain of returns: does any order_id appear more than once? List those order ids with their count.
-- hint: GROUP BY order_id HAVING COUNT(*) > 1. (Rows here are returned products, so an order can appear twice.)
SELECT order_id, COUNT(*) AS returned
FROM returns
GROUP BY order_id
-- answer:
SELECT order_id, COUNT(*) AS returned
FROM returns
GROUP BY order_id
HAVING COUNT(*) > 1
```

**Try it on your own data:** before you analyse a new CSV in [[sql-playground]], write one line saying its grain, then test it with the GROUP BY ... HAVING COUNT(*) > 1 check.

**New words:** *grain*, *index set*, *key*, *average order value*, *subquery*.
