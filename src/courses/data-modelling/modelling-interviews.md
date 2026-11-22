---
title: 'Data modelling interview questions, answered'
seoTitle: 'Data modelling interview questions and answers (2026)'
summary: 'Twenty-eight data modelling and warehousing interview questions with short model answers: grain, facts and dimensions, keys, SCDs, Kimball vs Inmon, Data Vault, testing and Power BI, plus live SQL exercises on Northbay for the questions interviewers ask you to solve on screen.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: An interviewer asks "what is the grain of this table?" What are they asking?
    choices: ['How big the table is', 'What exactly one row represents, such as one product on one order', 'Which database it is in']
    ans: 1
    why: Grain is the meaning of a row. Everything else (which dimensions and measures fit) follows from it, which is why good answers start there.
  - q: Which measure is semi-additive?
    choices: ['Sales amount', 'Stock on hand at month end', 'Unit price']
    ans: 1
    why: 'Stock on hand adds up across products and stores, but not across months: you take the closing (or average) balance over time. Sales add across everything; a unit price should not be summed at all.'
  - q: A design interview asks you to model inventory. What fact table type fits first?
    choices: ['Transaction fact of every sale', 'Periodic snapshot: one row per product per store per day (or week) with quantity on hand', 'Factless fact']
    ans: 1
    why: Inventory is a level measured at points in time, which is what a periodic snapshot holds. Movements in and out can be a separate transaction fact.
---

**Module 8 · about 35 minutes · read first: the whole course.** You'll be able to answer the data modelling questions that come up in analyst, BI developer and data engineer interviews, in a minute or less each, and solve the common live exercises in SQL.

## 1. Why this matters

Modelling interviews follow a pattern: a few definitions to check you know the words, a "how would you handle..." question about history or keys, a live SQL task, and a design question where you think out loud. The answers below are short on purpose: say the idea, give one example, name the trade-off. Then stop and let the interviewer ask more. Each answer links to the lesson that goes deeper.

**How to answer a design question.** Use Kimball's four steps out loud: (1) which business process, (2) declare the grain, (3) the dimensions, (4) the facts (measures). Then mention history (SCDs), the unknown member and how you would test it. That structure alone puts you ahead of most candidates.

## 2. Set up for the live exercises

Run this once. It builds a small Northbay star, a tiny inventory snapshot and a customer history table for the exercises below.

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
DROP TABLE IF EXISTS dim_product;
DROP TABLE IF EXISTS dim_customer;
DROP TABLE IF EXISTS dim_customer_hist;
DROP TABLE IF EXISTS fact_inventory;
CREATE TABLE dim_product AS
SELECT p.product_id AS product_key, p.product_name, c.category_name, c.department
FROM products p JOIN categories c ON c.category_id = p.category_id;
CREATE TABLE dim_customer AS
SELECT -1 AS customer_key, 'Guest' AS customer_name, 'Unknown' AS loyalty_tier
UNION ALL SELECT customer_id, first_name || ' ' || last_name, COALESCE(loyalty_tier, 'None') FROM customers;
CREATE TABLE fact_sales AS
SELECT o.order_id, o.order_date, i.product_id AS product_key, COALESCE(o.customer_id, -1) AS customer_key,
       o.store_id, i.quantity, ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed';
CREATE TABLE fact_inventory (snapshot_date TEXT, product_key INTEGER, store_id INTEGER, on_hand INTEGER);
INSERT INTO fact_inventory VALUES
  ('2025-10-31', 38, 1, 12), ('2025-10-31', 38, 2, 8), ('2025-10-31', 56, 1, 20), ('2025-10-31', 56, 2, 15),
  ('2025-11-30', 38, 1, 9),  ('2025-11-30', 38, 2, 5), ('2025-11-30', 56, 1, 14), ('2025-11-30', 56, 2, 11),
  ('2025-12-31', 38, 1, 4),  ('2025-12-31', 38, 2, 2), ('2025-12-31', 56, 1, 6),  ('2025-12-31', 56, 2, 3);
CREATE TABLE dim_customer_hist (customer_key INTEGER, customer_id INTEGER, loyalty_tier TEXT,
                                valid_from TEXT, valid_to TEXT, is_current INTEGER);
INSERT INTO dim_customer_hist VALUES
  (1001, 2, 'Bronze', '1900-01-01', '2025-06-30', 0),
  (1002, 2, 'Silver', '2025-07-01', '9999-12-31', 1);
SELECT (SELECT COUNT(*) FROM fact_sales) AS sales_rows, (SELECT COUNT(*) FROM fact_inventory) AS inventory_rows,
       (SELECT COUNT(*) FROM dim_customer_hist) AS history_rows
```

## 3. Foundations

**Q1. What is the difference between OLTP and OLAP?**
OLTP systems run the business: many small reads and writes, normalised tables, current data (a till or a web shop). OLAP systems analyse it: few, large reads over history, denormalised tables (a warehouse). You model them differently because they're optimised for opposite jobs. ([Lesson 1.1](/learn/courses/data-modelling/oltp-vs-olap/))

**Q2. Explain 1NF, 2NF and 3NF in one breath.**
1NF: one value per cell, no repeating groups. 2NF: every non-key column depends on the whole key, not part of it. 3NF: non-key columns depend only on the key, not on other non-key columns. The aim is each fact stored once, so updates can't contradict each other. ([Lesson 1.2](/learn/courses/data-modelling/normal-forms/))

**Q3. Why do warehouses denormalise?**
Analytics reads far more than it writes. Fewer joins make queries simpler and faster, and business users understand a star. The price, repeated attributes, is controlled because the warehouse is loaded by one process rather than edited by many users. ([Lesson 1.3](/learn/courses/data-modelling/why-denormalise/))

**Q4. What are facts and dimensions?**
Facts are the measurements of a business event (quantity, amount), usually numeric and additive, at a declared grain. Dimensions are the context you filter and group by (who, what, where, when). Rule of thumb: if you SUM it, it's a fact; if you GROUP BY it, it's a dimension attribute. ([Lesson 2.3](/learn/courses/data-modelling/facts-and-dimensions/))

**Q5. What is grain, and why declare it first?**
Grain is what one row of a fact table represents, such as "one product on one completed order". Declaring it first decides which dimensions fit (anything that has one value per row) and which measures are valid, and it stops the classic mistake of mixing order-level and line-level numbers. ([Lesson 2.2](/learn/courses/data-modelling/declare-grain/))

Interviewers often follow with "prove it". Do that now:

```sql
-- exercise: Prove that (order_id, product_key) is the grain of fact_sales: return the number of rows and the number of distinct (order_id, product_key) pairs side by side.
-- hint: COUNT(*) and COUNT(DISTINCT order_id || '-' || product_key). If they match, the pair is unique.
SELECT COUNT(*) AS rows
FROM fact_sales
-- answer:
SELECT COUNT(*) AS rows,
       COUNT(DISTINCT order_id || '-' || product_key) AS distinct_pairs
FROM fact_sales
```

**Q6. Star or snowflake?**
A star keeps each dimension in one flat table; a snowflake normalises dimensions into sub-tables (product → category → department). Prefer the star for BI: fewer joins and simpler models, which is also what Power BI wants. Snowflake only where a sub-dimension is large and shared, or a tool needs it. ([Lesson 4.6](/learn/courses/data-modelling/snowflakes/))

**Q7. Why use surrogate keys instead of the source system's keys?**
They protect the warehouse from source changes (reused or changed codes), allow several sources to be merged, make SCD type 2 possible (one customer, many versions, each with its own key), allow an unknown member (-1), and are small integers that join fast. ([Lesson 4.1](/learn/courses/data-modelling/surrogate-keys/))

**Q8. What is a conformed dimension?**
A dimension shared by several fact tables with the same keys and the same attribute values, built once. Conformed dimensions let you compare processes (sales vs returns by product) and are what makes many marts one warehouse. ([Lesson 4.3](/learn/courses/data-modelling/conformed-dimensions/))

**Q9. What is a bus matrix?**
A grid of business processes (rows) against dimensions (columns), with a tick where a process uses a dimension. It's the plan for the whole warehouse: it shows which dimensions must be conformed and in what order to build the stars. ([Lesson 2.5](/learn/courses/data-modelling/bus-matrix/))

## 4. Facts in depth

**Q10. Name the three main types of fact table.**
Transaction (one row per event, e.g. per order line), periodic snapshot (one row per thing per period, e.g. stock per product per day), and accumulating snapshot (one row per process instance, updated as it passes milestones, e.g. an order's placed, shipped and delivered dates). ([Lessons 3.1](/learn/courses/data-modelling/transaction-facts/)–[3.3](/learn/courses/data-modelling/accumulating-snapshots/))

**Q11. What is a factless fact table? Give an example.**
A fact table with keys but no measures, recording that something happened or was possible: student attendance, or which products were on promotion each day. You count rows. Promotion coverage plus sales lets you find products on promotion that didn't sell. ([Lesson 3.4](/learn/courses/data-modelling/factless-facts/))

**Q12. Additive, semi-additive and non-additive: examples?**
Additive: sums across every dimension (sales amount). Semi-additive: sums across some dimensions but not time (stock on hand, account balance). Non-additive: never summed (unit price, ratios, percentages); store the parts and compute the ratio. ([Lesson 3.5](/learn/courses/data-modelling/additivity/))

Here is the trap in SQL. Summing stock over three month-ends counts the same items three times:

```sql
-- try
SELECT SUM(on_hand) AS wrong_total_over_time,
       SUM(CASE WHEN snapshot_date = '2025-12-31' THEN on_hand END) AS closing_stock
FROM fact_inventory
```

```sql
-- exercise: For each month-end, show total stock on hand across all products and stores. (Summing across products and stores is fine; it's summing across dates that is wrong.)
-- hint: GROUP BY snapshot_date, SUM(on_hand), ORDER BY snapshot_date.
SELECT snapshot_date, on_hand
FROM fact_inventory
-- answer:
SELECT snapshot_date, SUM(on_hand) AS stock_on_hand
FROM fact_inventory
GROUP BY snapshot_date
ORDER BY snapshot_date
```

**Q13. What is a degenerate dimension?**
A dimension key with no dimension table, kept on the fact: the order number or invoice number. It's useful for grouping lines into orders and for tracing back to the source. ([Lesson 4.5](/learn/courses/data-modelling/junk-degenerate/))

**Q14. What is a junk dimension?**
A single small dimension that combines low-cardinality flags and codes (channel, payment type, is_gift) instead of putting many tiny columns or tables on the fact. One key on the fact, one row per combination that occurs. ([Lesson 4.5](/learn/courses/data-modelling/junk-degenerate/))

**Q15. What is a role-playing dimension?**
One dimension used several times by the same fact in different roles: order date, ship date and return date all point at dim_date. In SQL you join it under different aliases; in Power BI, Microsoft recommends a separate date table per role. ([Lesson 4.4](/learn/courses/data-modelling/role-playing/))

## 5. History

**Q16. Explain SCD types 1, 2 and 3.**
Type 1 overwrites (no history; fix typos). Type 2 adds a new row with a new surrogate key and valid_from/valid_to dates for each change (full history; the standard for things like customer tier or address). Type 3 keeps a "previous value" column (one step of history). Type 6 combines 1, 2 and 3: versioned rows plus a current-value column on every row. ([Lesson 5.1](/learn/courses/data-modelling/scd-types/))

**Q17. How do you load an SCD type 2 dimension?**
Compare the incoming snapshot to the current rows (by a hash of the tracked columns). For changed customers: close the current row (set valid_to to the day before and is_current = 0), then insert a new row valid from the change date to 9999-12-31. Insert brand-new customers. Facts then look up the version whose date range contains the event date. ([Lesson 5.2](/learn/courses/data-modelling/scd2-by-hand/))

The point-in-time lookup is a favourite live task:

```sql
-- exercise: Customer 2 was Bronze until 30 June 2025 and Silver after. Using dim_customer_hist, return each of customer 2's orders (once each) with its order_date, and the customer_key and loyalty_tier valid on that date, ordered by order_date.
-- hint: Join fact_sales to dim_customer_hist on h.customer_id = f.customer_key AND f.order_date BETWEEN h.valid_from AND h.valid_to. An order has several lines, so use SELECT DISTINCT.
SELECT f.order_id, f.order_date
FROM fact_sales f
WHERE f.customer_key = 2
-- answer:
SELECT DISTINCT f.order_id, f.order_date, h.customer_key, h.loyalty_tier
FROM fact_sales f
JOIN dim_customer_hist h ON h.customer_id = f.customer_key
                        AND f.order_date BETWEEN h.valid_from AND h.valid_to
WHERE f.customer_key = 2
ORDER BY f.order_date
```

**Q18. What is a late-arriving dimension, and how do you handle it?**
A fact arrives before its dimension row (a sale for a customer the CRM hasn't sent yet). Insert an **inferred member**: a placeholder dimension row with the natural key and "Unknown" attributes, so the fact gets a real key. When the CRM catches up, update that row in place (type 1) rather than adding a version. ([Lesson 5.3](/learn/courses/data-modelling/late-arriving/))

Look at the history table the exercise uses: two versions of one customer, each with its own key and date range.

```sql
-- try
SELECT customer_key, customer_id, loyalty_tier, valid_from, valid_to, is_current
FROM dim_customer_hist
ORDER BY valid_from
```

**Q19. "As was" versus "as is" reporting?**
"As was" groups facts by the attribute values valid when the event happened (join on the fact's own surrogate key). "As is" restates all history with today's values (join through the natural key to the current row). Both are valid; the business must say which a report uses. SCD2 supports both. ([Lesson 5.4](/learn/courses/data-modelling/point-in-time/))

## 6. Architecture

**Q20. Kimball or Inmon?**
Inmon: build an integrated, normalised enterprise warehouse first, then dependent marts. Kimball: build conformed star schemas process by process; the warehouse is their union. Kimball is faster to first value; Inmon suits many messy sources and strong integration needs. Most modern stacks are hybrids: a normalised or vault core with star marts. ([Lesson 6.1](/learn/courses/data-modelling/inmon/))

**Q21. When would you choose Data Vault?**
Many changing sources, strict audit ("what did system X say on date Y?"), parallel loading by large teams. It splits data into hubs (business keys), links (relationships) and satellites (history), insert-only. It isn't for direct reporting: build stars on top. ([Lesson 6.2](/learn/courses/data-modelling/data-vault/))

**Q22. One big table or star schema?**
An OBT pre-joins the star into one wide table: no joins, great for tools and people that can't join, and fine in columnar warehouses. Costs: repeated attributes, expensive changes and the risk of mixing grains. Build it as a mart on top of the star, not instead of it. ([Lesson 6.3](/learn/courses/data-modelling/one-big-table/))

**Q23. What is a medallion architecture?**
Layers in a lakehouse: bronze (raw, as landed), silver (cleaned, de-duplicated, conformed), gold (business-ready, often stars). The same idea as staging, core and marts. ([Lesson 6.4](/learn/courses/data-modelling/lakehouse/))

## 7. Building and running it

**Q24. What makes a load idempotent, and why does it matter?**
Running it twice gives the same result as once. Use delete-then-insert for the batch window inside a transaction, or an upsert/MERGE on the grain key. It matters because loads are retried and re-run; a plain INSERT doubles the data. ([Lesson 7.3](/learn/courses/data-modelling/audit-columns/))

**Q25. How do you test a warehouse?**
After every load: unique keys on dimensions, no null foreign keys in facts, no orphans (every fact key exists in its dimension), accepted values on codes, and reconciliation of counts and totals to the source. Each test returns the failing rows; zero rows passes. ([Lesson 7.4](/learn/courses/data-modelling/testing/))

```sql
-- exercise: Write an orphan test: count fact_sales rows whose product_key has no row in dim_product.
-- hint: LEFT JOIN dim_product and keep rows where the dimension key IS NULL.
SELECT COUNT(*) AS orphans
FROM fact_sales
-- answer:
SELECT COUNT(*) AS orphans
FROM fact_sales f
LEFT JOIN dim_product p ON p.product_key = f.product_key
WHERE p.product_key IS NULL
```

(It returns 0, a pass. A test that passes is still the right answer; what matters is that it would catch an orphan.)

**Q26. How do you model a many-to-many relationship, such as a sale credited to several salespeople?**
With a **bridge table** between the fact and the dimension (one row per sale per salesperson, often with an allocation weight that sums to 1 per sale). Without weights, totals across salespeople double count; with them, allocated sales add up to the real total. Order 2685 ($93.48) shared by two people:

```sql
-- try
WITH bridge(order_id, salesperson, weight) AS (
  VALUES (2685, 'Ana', 0.6), (2685, 'Raj', 0.4)
)
SELECT b.salesperson,
       ROUND(SUM(f.sales_amount), 2) AS credited_in_full,
       ROUND(SUM(f.sales_amount * b.weight), 2) AS allocated
FROM fact_sales f
JOIN bridge b ON b.order_id = f.order_id
GROUP BY b.salesperson
```

Credited in full, the two rows add to $186.96, twice the sale. Allocated, they add to $93.48.

**Q27. What does Power BI want from your model?**
A star: separate fact and dimension tables, one-to-many relationships from dimension to fact, single-direction filtering, one active relationship between two tables (so a date table per role), explicit measures for ratios and anything not summed, and SCD2 built upstream in the warehouse. ([Lesson 7.5](/learn/courses/data-modelling/semantic-layer/))

**Q28. How would you partition a large fact table?**
By the date column most queries filter on (usually the event date), at a size that gives reasonably large partitions (daily or monthly), then cluster by the next most common filter (store or customer). Make sure queries filter the partition column directly so pruning works. ([Lesson 7.6](/learn/courses/data-modelling/cost-partitioning/))

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** most modelling answers are statements about **functions and cardinality**. A dimension attribute is a function of its key. A relationship is one-to-many when each fact row maps to exactly one dimension row. A grain is valid when the grain columns form an injective map onto rows. Additivity is linearity: a measure m is additive over a dimension if m(A ∪ B) = m(A) + m(B) for disjoint groups A and B.

**Equation:** stock on hand is linear over products (stock of A and B = stock of A + stock of B) but not over time: stock(Oct ∪ Nov) ≠ stock(Oct) + stock(Nov). Here the three month-ends sum to 109 units, while closing stock is 15.

**Analogy:** money in your wallet. Your wallet plus your friend's wallet adds up; Monday's wallet plus Tuesday's wallet doesn't tell you how much you have.

**Try it:** is "number of distinct customers" additive across months? (No. A customer who buys in both months is counted once in the two-month total, so you can't add the monthly counts.)
</details>

## 8. Worked example: a design question, out loud

*"Northbay wants to report stock levels and stock-outs by store and product. Design it."*

1. **Process:** inventory. Two related processes: stock levels (a state) and stock movements (events).
2. **Grain:** fact_inventory_daily, one row per product per store per day with closing on-hand quantity. Northbay has 61 products and 11 physical stores plus online, so about 61 × 12 × 365 ≈ 267,000 rows a year. Small for any warehouse.
3. **Dimensions:** dim_date, dim_product, dim_store, all conformed with fact_sales so stock and sales sit side by side.
4. **Facts:** on_hand_qty (semi-additive: sum across stores and products, take the closing or average value over time), plus a stock-out flag (on_hand = 0) whose count of days is additive.
5. **History and keys:** -1 unknown members; products type 1.
6. **Tests:** one row per product, store and day (no gaps, a check like the snapshot test in part 2); on_hand never negative.
7. **Extension:** a transaction fact of stock movements (receipts, sales, write-offs) whose sum per day reconciles with the change in closing stock.

Saying the numbers out loud (267,000 rows a year) shows you think about scale. Saying how you would test it shows you have shipped things before.

## 9. Practice

```sql
-- exercise: A classic: "Which customers bought in both 2024 and 2025?" Return the count of customers (not guests) with completed orders in both years.
-- hint: INTERSECT the customer keys of 2024 with those of 2025, excluding -1, then count.
SELECT COUNT(DISTINCT customer_key) AS customers
FROM fact_sales
WHERE customer_key <> -1
-- answer:
SELECT COUNT(*) AS customers
FROM (SELECT customer_key FROM fact_sales WHERE order_date LIKE '2024-%' AND customer_key <> -1
      INTERSECT
      SELECT customer_key FROM fact_sales WHERE order_date LIKE '2025-%' AND customer_key <> -1)
```

```sql
-- exercise: Show the fan-out trap: join fact_sales to a dimension that accidentally has product 28 twice, and return the true total and the joined total of sales_amount side by side.
-- hint: Build the bad dimension inline: (SELECT product_key FROM dim_product UNION ALL SELECT 28). Join it and SUM.
SELECT ROUND(SUM(sales_amount), 2) AS true_total
FROM fact_sales
-- answer:
SELECT (SELECT ROUND(SUM(sales_amount), 2) FROM fact_sales) AS true_total,
       ROUND(SUM(f.sales_amount), 2) AS joined_total
FROM fact_sales f
JOIN (SELECT product_key FROM dim_product UNION ALL SELECT 28) d ON d.product_key = f.product_key
```

**Try it on your own data:** paste any two CSV extracts into [[sql-playground]] and check their grain and keys the same way.

**New words:** *inferred member*, *bridge table*, *allocation weight*, *four-step design*.
