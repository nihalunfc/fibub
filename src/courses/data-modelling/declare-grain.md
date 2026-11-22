---
title: 'Declare the grain'
seoTitle: 'Fact table grain: how to declare it, with examples'
summary: 'The grain says exactly what one row of a fact table stands for. Compare four possible grains for Northbay sales, see why the finest (atomic) grain wins, and catch the double counting that mixed grains cause.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: Which grain statement is best for Northbay's sales fact table?
    choices: ['One row per product on a completed order (an order line)', 'Sales data', 'One row per useful number']
    ans: 0
    why: A grain statement names exactly what one row is, in business words. The atomic order line is the finest grain the tills record.
  - q: 'You have a table at one row per store per day. Which question can it NOT answer?'
    choices: ['Sales by product', 'Sales by store per month', 'Sales on weekends vs weekdays']
    ans: 0
    why: Products were added up into the daily totals and can't be separated again. You can always roll up from a finer grain, never drill down below it.
  - q: An order-level total is copied onto every line of a line-grain table. What happens when you SUM it?
    choices: ['Orders with several lines are counted several times', 'You get the right total', 'SQL raises an error']
    ans: 0
    why: Mixing grains breaks additivity. An order with three lines adds its total three times. Keep every measure at the table's declared grain.
---

**Module 2 · about 30 minutes · read first: 2.1.** You'll be able to write a grain statement, choose the atomic grain, test a grain with SQL, and spot a measure stored at the wrong grain.

## 1. Why this matters

The grain is the single most important decision in a fact table. Get it right and every total adds up, whatever way a report slices it. Get it wrong, or leave it vague, and someone will sum a number that was never meant to be summed. Senior modellers write the grain down before they name a single column, and reviewers check it first. (If grain is new to you, [SQL for analysts 3.5](/learn/courses/sql/grain/) covers the basics.)

## 2. A grain statement

The *grain* of a fact table is what one row stands for. Write it as one sentence in business words, beginning "one row per":

> **Northbay sales:** one row per product on a completed order.

A good grain statement is about the real world (a product on an order), not about columns (order_id and product_id). The columns follow from it. A vague statement like "sales data" is not a grain.

## 3. Four candidate grains

The same selling process could be stored at many grains. Count the rows each would have:

```sql
-- try
SELECT 'order line' AS grain, COUNT(*) AS rows
FROM order_items i JOIN orders o ON o.order_id = i.order_id WHERE o.status = 'completed'
UNION ALL
SELECT 'order', COUNT(*) FROM orders WHERE status = 'completed'
UNION ALL
SELECT 'store per day', COUNT(*) FROM (SELECT DISTINCT store_id, order_date FROM orders WHERE status = 'completed')
UNION ALL
SELECT 'product per month', COUNT(*) FROM (
  SELECT DISTINCT i.product_id, strftime('%Y-%m', o.order_date)
  FROM order_items i JOIN orders o ON o.order_id = i.order_id WHERE o.status = 'completed')
```

Coarser grains are smaller, but each throws something away:

- **Order** (3,945 rows) loses which products were bought.
- **Store per day** (3,036 rows) loses products, customers and individual orders.
- **Product per month** (1,420 rows) loses stores, days and customers.
- **Order line** (7,112 rows) loses nothing the tills recorded.

## 4. Choose the atomic grain

The *atomic grain* is the finest level the source system captures. For Northbay sales that's the order line. Kimball's advice, and nearly every experienced modeller's, is to build the first fact table at the atomic grain, because:

1. You can always *roll up* (add up) a fine grain to any coarser one with GROUP BY.
2. You can never *drill down* below the grain you stored. The details are gone.
3. Unexpected questions ("which products sell together?") need the detail.

Watch a roll-up: the atomic lines summed to store per day, a coarser grain, in one GROUP BY.

```sql
-- try
SELECT o.store_id, o.order_date,
       COUNT(DISTINCT o.order_id) AS orders,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
WHERE o.status = 'completed' AND o.order_date = '2024-12-21'
GROUP BY o.store_id, o.order_date
ORDER BY sales DESC
```

On that Saturday before Christmas the online store led with 3 orders worth $116.23. The reverse is impossible: from a store-per-day total there is no query that recovers the products.

## 5. Test the grain

Once declared, the grain becomes a promise: no two rows share the same grain values. Test it by grouping on the columns that should identify a row and looking for groups bigger than one:

```sql
-- try
SELECT order_id, product_id, COUNT(*) AS copies
FROM order_items
GROUP BY order_id, product_id
HAVING COUNT(*) > 1
```

No rows: (order_id, product_id) really is one row per order line. Run this test after every load. An empty answer is a pass.

## 6. The mixed-grain trap

A tempting shortcut is to copy an order-level number onto each line, say the order's total, so reports can "just sum it". Watch what happens:

```sql
-- try
-- noviz
DROP TABLE IF EXISTS lines_mixed;
CREATE TABLE lines_mixed AS
SELECT i.order_id, i.product_id,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS line_amount,
       t.order_total
FROM order_items i
JOIN (SELECT order_id, ROUND(SUM(quantity * unit_price * (1 - discount)), 2) AS order_total
      FROM order_items GROUP BY order_id) t ON t.order_id = i.order_id
WHERE i.order_id IN (1038, 1040, 1041);
SELECT * FROM lines_mixed;
```

```sql
-- try
SELECT SUM(line_amount) AS sum_of_lines, SUM(order_total) AS sum_of_order_totals
FROM lines_mixed
```

The three orders are worth $167.60, the sum of their lines. Summing `order_total` gives $648.92, because it counts order 1038 four times, order 1040 four times and order 1041 twice. Every measure in a fact table must be true **at the declared grain**. An order-level number belongs in an order-grain table, or must be split across the lines (*allocated*) by a stated rule.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the grain is the *index set* of the fact table: the set of things that get exactly one row each.

**Equation:** let G = {(order, product) pairs on completed orders}. The fact table is a function from G to measures, and the key k: rows → G is *injective* (no two rows map to the same pair), which is what the HAVING test checks. A roll-up to a coarser grain H is a map r: G → H, such as (order, product) ↦ (store, day). Its total for each h is Σ over all g with r(g) = h. Many g map to one h, so r has no inverse: that is why drilling down is impossible.

**Analogy:** a photo's pixels. You can shrink a photo (roll up), but you can't enlarge a small photo back to its original detail.

**Try it:** the map from order lines to orders is a roll-up. Can two lines map to the same order? (Yes; order 1038 has four lines, so the map is not injective, and orders is a coarser grain.)
</details>

## 7. Worked example: write the grain for returns

*Question:* what is the grain of a returns fact table, and does the data respect it?

1. Event: a product brought back. Grain statement: **one row per product returned on an order**.
2. The columns that should identify a row: (order_id, product_id). In the data there are 204 returns.
3. Test it: count rows and distinct pairs. Both are **204**, so the grain holds (see the practice below).
4. Write down the business rule as well: if Northbay ever allows a second return of the same line (two of three kettles on different days), the grain must become "one row per return event", keyed by return_id. Decide the grain from the business, then test the data.

## 8. Practice

```sql
-- exercise: Test the grain of returns: show the number of rows and the number of distinct (order_id, product_id) pairs.
-- hint: COUNT(*) and COUNT(DISTINCT order_id || '-' || product_id). Equal numbers mean the grain holds.
SELECT COUNT(*) AS rows
FROM returns
-- answer:
SELECT COUNT(*) AS rows, COUNT(DISTINCT order_id || '-' || product_id) AS distinct_pairs
FROM returns
```

```sql
-- exercise: Roll the atomic grain up to one row per category per year: show category_name, year and sales (completed orders, rounded to 2 decimals).
-- hint: Join order_items, orders, products and categories; GROUP BY category_name and strftime('%Y', order_date).
SELECT c.category_name, COUNT(*) AS lines
FROM order_items i
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
GROUP BY c.category_name
-- answer:
SELECT c.category_name, strftime('%Y', o.order_date) AS year,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed'
GROUP BY c.category_name, year
```

```sql
-- exercise: Fix the mixed-grain total: from lines_mixed, get the true total of the three orders by summing each order's total only once.
-- hint: Take DISTINCT order_id, order_total in a subquery, then SUM the order_total.
SELECT SUM(order_total) AS total
FROM lines_mixed
-- answer:
SELECT SUM(order_total) AS total
FROM (SELECT DISTINCT order_id, order_total FROM lines_mixed)
```

**New words:** *grain*, *grain statement*, *atomic grain*, *roll up*, *drill down*, *mixed grain*, *allocation*.
