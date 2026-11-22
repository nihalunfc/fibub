---
title: 'Junk and degenerate dimensions: where the leftovers go'
seoTitle: 'Junk dimension and degenerate dimension explained'
summary: 'Small flags like channel, status and promotion go together in one junk dimension, and the order number stays on the fact table as a degenerate dimension. Build both and see what each is for.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is a junk dimension?
    choices: ['A dimension full of bad data', 'One small table holding every combination of several low-cardinality flags, with one key', 'A dimension nobody uses']
    ans: 1
    why: Channel (2 values) × status (2) × promotion (2) gives 8 combinations. One 8-row table with a flags_key replaces three columns or three tiny dimensions.
  - q: 'Why does order_id stay on the fact table with no dimension table of its own?'
    choices: ['Because it is the primary key of orders', 'Because everything else about the order (date, customer, store) already lives in its own dimension, so there is nothing left to describe', 'Because ids can''t be joined']
    ans: 1
    why: An order's attributes have all moved to other dimensions. The bare number is still useful for grouping lines into baskets and counting orders, so it stays as a degenerate dimension.
  - q: 'At order-line grain, how do you count orders?'
    choices: ['COUNT(*)', 'COUNT(DISTINCT order_id)', 'SUM(order_id)']
    ans: 1
    why: Each order has one or more lines, so COUNT(*) counts lines. COUNT(DISTINCT order_id) counts each order once.
---

**Module 4 · about 25 minutes · read first: 4.1 and 2.3.** You'll be able to fold several small flags into one junk dimension, keep an order number as a degenerate dimension, and use it to count orders and baskets correctly.

## 1. Why this matters

Once you have built dimensions for date, product, customer and store, there are always a few bits left over: "was this online?", "was it cancelled?", "was a sale running?", and the receipt number itself. They don't belong to any of the big dimensions. Left loose on the fact table they make it wide and messy; given a tiny table each they clutter the model with dimensions of two rows. Kimball's answer has two parts, and both come up in design reviews and interviews.

## 2. The leftovers

Look at what is left on a Northbay order once date, customer and store have their own dimensions:

```sql
-- try
SELECT order_id, channel, status,
       CASE WHEN promo_id IS NULL THEN 'No promotion' ELSE 'On promotion' END AS on_promo
FROM orders
WHERE order_id BETWEEN 1001 AND 1006
```

Three **low-cardinality** columns (few possible values: 2 each) and one number, `order_id`, that is different on every order. They need different treatment.

## 3. A junk dimension for the flags

A **junk dimension** is a single small table that holds every combination of a few unrelated flags, with one surrogate key. The fact table then carries one key, `flags_key`, instead of three text columns.

With 2 × 2 × 2 = 8 combinations, you can build every one up front with `CROSS JOIN`:

```sql
-- noviz
DROP TABLE IF EXISTS dim_order_flags;
CREATE TABLE dim_order_flags AS
WITH ch(channel)  AS (VALUES ('store'), ('online')),
     st(status)   AS (VALUES ('completed'), ('cancelled')),
     pr(on_promo) AS (VALUES ('No promotion'), ('On promotion'))
SELECT ROW_NUMBER() OVER (ORDER BY ch.channel DESC, st.status DESC, pr.on_promo) AS flags_key,
       ch.channel, st.status, pr.on_promo
FROM ch CROSS JOIN st CROSS JOIN pr;

SELECT * FROM dim_order_flags;
```

Eight rows, keys 1 to 8. Notice the flag values are words ("On promotion"), not 1 and 0: a report filter that says "On promotion" needs no explaining.

When the flags have many values, the full cross product gets big (10 × 10 × 20 = 2,000 rows, most never used). Then build the junk dimension from the combinations that actually occur, with `SELECT DISTINCT channel, status, ...` from the source, and add new combinations as they appear.

## 4. Loading the fact with a flags key

The fact load looks up the one row whose three columns match the order:

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT oi.order_id,
       o.order_date,
       oi.product_id,
       fl.flags_key,
       oi.quantity,
       ROUND(oi.quantity * oi.unit_price * (1 - oi.discount), 2) AS sales_amount
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
JOIN dim_order_flags fl
  ON fl.channel = o.channel
 AND fl.status = o.status
 AND fl.on_promo = CASE WHEN o.promo_id IS NULL THEN 'No promotion' ELSE 'On promotion' END;

SELECT COUNT(*) AS fact_rows FROM fact_sales;
```

All 7,310 lines found a flags row, because every combination exists. (If one didn't, the inner join would drop lines: a row count check after each load catches that, as you'll see in [Lesson 7.4](/learn/courses/data-modelling/testing/).)

Now slice by any flag, or any mix of them:

```sql
-- try
SELECT fl.channel, fl.status, fl.on_promo,
       COUNT(*) AS lines,
       ROUND(SUM(f.sales_amount), 2) AS sales
FROM dim_order_flags fl
LEFT JOIN fact_sales f ON f.flags_key = fl.flags_key
GROUP BY fl.flags_key, fl.channel, fl.status, fl.on_promo
```

Store, completed, no promotion is the big group: 4,481 lines and $82,980.71. Online cancelled orders during a promotion are the smallest: 12 lines, $151.14. Starting from the junk dimension with a LEFT JOIN means a combination with no sales would still show, with 0.

Why not just leave the three columns on the fact table? You can, and many modern wide tables do ([Lesson 6.3](/learn/courses/data-modelling/one-big-table/)). The junk dimension wins when there are many flags, when the fact table is huge (one small integer is cheaper than three text columns on millions of rows), and when users want one tidy "Order flags" folder in the report tool instead of three stray fields.

## 5. A degenerate dimension for the order number

Now `order_id`. Everything that describes an order (its date, customer, store, flags) already sits in a dimension. What is left is a bare number with no attributes. Kimball calls this a **degenerate dimension**: a dimension key that lives on the fact table with no dimension table behind it.

It stays because it is still useful:

- **Counting orders** at line grain: `COUNT(DISTINCT order_id)`, never `COUNT(*)`.
- **Baskets:** grouping lines by `order_id` gives each receipt, for basket size and "bought together" analysis.
- **Tracing:** a support person can look up receipt 3305 and find its lines.

Press **Run**, then **Show how it runs** to watch the lines of three orders fold into one row each:

```sql
-- try
SELECT order_id, COUNT(*) AS lines, ROUND(SUM(sales_amount), 2) AS order_total
FROM fact_sales
WHERE order_id IN (1001, 1002, 1003)
GROUP BY order_id
```

Other common degenerate dimensions are invoice numbers, ticket numbers, cheque numbers and transaction ids: any "header" number whose header has been split up among the other dimensions.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a junk dimension replaces several small attributes with one key for their **combination**. A degenerate dimension is a grouping label for the grain: it names which lines belong together, and nothing more.

**Equation:** with flag sets A, B, C, the junk dimension is the Cartesian product A × B × C, and flags_key is a bijection from it to {1, …, |A|·|B|·|C|} = {1, …, 8}. For the degenerate key, orders partition the lines: each line belongs to exactly one order, so Σ over orders of (lines per order) = total lines. COUNT(*) measures the lines; COUNT(DISTINCT order_id) measures the number of blocks in the partition.

**Analogy:** a junk dimension is the combination lock on a bike: three dials of 2 positions give 8 settings, each with one number. The degenerate dimension is the receipt number stapled to each item in a bag: it tells you which items came through the till together.

**Try it:** a fourth flag "gift wrapped" (yes/no) is added. How many rows does the full junk dimension need? (2 × 2 × 2 × 2 = 16.)
</details>

## 6. Worked example: online vs store baskets

*Question:* do online and in-store shoppers buy differently? Use completed orders only.

1. The channel and status come from the junk dimension.
2. Orders are counted with the degenerate dimension: `COUNT(DISTINCT order_id)`.
3. Average order value = sales ÷ orders, and lines per order = lines ÷ orders.

```sql
-- try
SELECT fl.channel,
       COUNT(DISTINCT f.order_id) AS orders,
       COUNT(*) AS lines,
       ROUND(1.0 * COUNT(*) / COUNT(DISTINCT f.order_id), 2) AS lines_per_order,
       ROUND(SUM(f.sales_amount) / COUNT(DISTINCT f.order_id), 2) AS avg_order_value
FROM fact_sales f
JOIN dim_order_flags fl ON fl.flags_key = f.flags_key
WHERE fl.status = 'completed'
GROUP BY fl.channel
```

Online: 1,030 orders, 1.80 lines each, $31.71 average. Store: 2,915 orders, 1.80 lines each, $32.22 average. Northbay's two channels behave almost the same per basket; the difference is in volume. Had you divided by `COUNT(*)` you would have reported a "per order" figure that was really per line, about 45% too small.

## 7. Practice

```sql
-- exercise: For completed orders, compare average order value with and without a promotion (2 decimal places), plus the number of orders.
-- hint: Same shape as the worked example, but GROUP BY fl.on_promo.
SELECT fl.on_promo, ROUND(AVG(f.sales_amount), 2) AS avg_value
FROM fact_sales f
JOIN dim_order_flags fl ON fl.flags_key = f.flags_key
WHERE fl.status = 'completed'
GROUP BY fl.on_promo
-- answer:
SELECT fl.on_promo,
       COUNT(DISTINCT f.order_id) AS orders,
       ROUND(SUM(f.sales_amount) / COUNT(DISTINCT f.order_id), 2) AS avg_order_value
FROM fact_sales f
JOIN dim_order_flags fl ON fl.flags_key = f.flags_key
WHERE fl.status = 'completed'
GROUP BY fl.on_promo
```

```sql
-- exercise: Find the 3 biggest baskets: order_id, number of lines and order total, biggest total first.
-- hint: GROUP BY order_id on fact_sales, SUM(sales_amount), ORDER BY the total DESC, LIMIT 3.
SELECT order_id, sales_amount
FROM fact_sales
ORDER BY sales_amount DESC
LIMIT 3
-- answer:
SELECT order_id, COUNT(*) AS lines, ROUND(SUM(sales_amount), 2) AS order_total
FROM fact_sales
GROUP BY order_id
ORDER BY order_total DESC
LIMIT 3
```

```sql
-- exercise: How many orders were cancelled, and how much would they have been worth? Return one row.
-- hint: Filter the junk dimension on status = 'cancelled'; count distinct order_id and sum sales_amount.
SELECT COUNT(*) AS cancelled_lines
FROM fact_sales f
JOIN dim_order_flags fl ON fl.flags_key = f.flags_key
WHERE fl.status = 'cancelled'
-- answer:
SELECT COUNT(DISTINCT f.order_id) AS cancelled_orders, ROUND(SUM(f.sales_amount), 2) AS value
FROM fact_sales f
JOIN dim_order_flags fl ON fl.flags_key = f.flags_key
WHERE fl.status = 'cancelled'
```

**New words:** *low cardinality*, *junk dimension*, *degenerate dimension*, *basket*.
