---
title: 'Slowly changing dimensions: types 0, 1, 2, 3 and 6'
seoTitle: 'SCD types 0, 1, 2, 3 and 6 explained with examples'
summary: 'A customer moves city and changes loyalty tier. Follow one timeline through each slowly changing dimension type, see what each keeps and loses, and watch the same sales report give different answers.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'Asha moves from Toronto to Ottawa. Under SCD type 1, which city do her 2024 Toronto purchases show?'
    choices: ['Toronto', 'Ottawa', 'Both']
    ans: 1
    why: Type 1 overwrites the old value. There is only one row, and it now says Ottawa, so every past sale is reported as Ottawa.
  - q: What does SCD type 2 do when a tracked attribute changes?
    choices: ['Overwrites the value', 'Closes the current row and adds a new row with a new surrogate key and new valid dates', 'Adds a previous_value column']
    ans: 1
    why: Type 2 keeps every version as its own row. Facts point at the version that was true when they happened.
  - q: Type 6 combines which ideas?
    choices: ['Types 1, 2 and 3: new rows for history, plus current-value columns overwritten on every row', 'Types 0 and 1 only', 'Type 2 with no dates']
    ans: 0
    why: 1 + 2 + 3 = 6. Rows are versioned like type 2, and each row also carries current_city and current_tier, overwritten like type 1, so one query can show both "then" and "now".
---

**Module 5 · about 30 minutes · read first: 4.1.** You'll be able to name the five common ways to handle a changing dimension attribute, say what each keeps and loses, and pick one per column.

## 1. Why this matters

Dimensions change. Customers move, products change category, stores get new managers, sales regions are redrawn. Every time, someone has to decide: should last year's sales follow the customer to their new city, or stay where they happened? The answer changes real numbers on real dashboards, and "how do you handle slowly changing dimensions?" is asked in almost every BI and data engineering interview. The changes are called **slowly changing** because they happen now and then, not on every transaction.

## 2. One customer's timeline

We'll follow one made-up customer, Asha:

- **10 May 2023:** joins in Toronto, Bronze tier.
- **1 March 2025:** moves to Ottawa.
- **15 September 2025:** upgraded to Gold.

She bought six things along the way. Load her orders:

```sql
-- noviz
DROP TABLE IF EXISTS asha_orders;
CREATE TABLE asha_orders (order_date TEXT, item TEXT, amount INTEGER);
INSERT INTO asha_orders VALUES
  ('2024-11-29', 'Kettle', 45), ('2025-01-15', 'Bagels', 5), ('2025-04-12', 'Duvet', 90),
  ('2025-07-20', 'Puzzle', 20), ('2025-10-05', 'Speaker', 60), ('2025-12-20', 'Kettle', 45);
SELECT * FROM asha_orders;
```

$265 in all: $50 while she lived in Toronto, $215 after she moved. Keep those numbers in mind; each type below reports them differently.

## 3. Type 0: never change

**Type 0** keeps the original value forever and ignores changes. It suits attributes that are true by definition at one moment: date of birth, `joined_on`, "city at sign-up", the original credit score. If Asha's row has `signup_city`, it says Toronto for ever, and that is correct, because it answers "where did she sign up?", not "where does she live?".

## 4. Type 1: overwrite

**Type 1** overwrites the old value. There is one row per customer, always showing today's truth. Simple and cheap, but history is gone.

```sql
-- noviz
DROP TABLE IF EXISTS cust_t1;
CREATE TABLE cust_t1 (customer_key INTEGER, customer_id INTEGER, name TEXT, city TEXT, tier TEXT);
INSERT INTO cust_t1 VALUES (1, 1, 'Asha', 'Toronto', 'Bronze');
UPDATE cust_t1 SET city = 'Ottawa' WHERE customer_id = 1;   -- 1 March 2025
UPDATE cust_t1 SET tier = 'Gold'   WHERE customer_id = 1;   -- 15 September 2025
SELECT * FROM cust_t1;
```

Now ask "sales by city":

```sql
-- try
SELECT c.city, SUM(o.amount) AS sales
FROM asha_orders o
JOIN cust_t1 c ON c.customer_id = 1
GROUP BY c.city
```

All $265 lands in Ottawa, including the kettle she bought in Toronto in 2024. Last year's Toronto report, rerun today, shows less than it did when it was first published. Type 1 is right for corrections (a misspelt name, a fixed typo in an email) and for attributes nobody analyses over time. It is wrong for anything people slice history by.

## 5. Type 2: add a new row

**Type 2** keeps every version as its own row. Each change closes the current row and opens a new one with a **new surrogate key**. Three columns manage the versions:

- `valid_from`: the first day this version was true.
- `valid_to`: the day the next version took over. The open row uses a far-future date, `9999-12-31`.
- `is_current`: 1 on the latest version, 0 on the others, for quick filtering.

In this course the range is **half-open**: a version covers a day d when `valid_from <= d AND d < valid_to`. The next version starts on the same date the last one ends, so there are no gaps and no overlaps.

<!--fig:scd2-timeline-->

```sql
-- noviz
DROP TABLE IF EXISTS cust_t2;
CREATE TABLE cust_t2 (customer_key INTEGER, customer_id INTEGER, name TEXT, city TEXT, tier TEXT,
                      valid_from TEXT, valid_to TEXT, is_current INTEGER);
INSERT INTO cust_t2 VALUES
  (1, 1, 'Asha', 'Toronto', 'Bronze', '2023-05-10', '2025-03-01', 0),
  (2, 1, 'Asha', 'Ottawa',  'Bronze', '2025-03-01', '2025-09-15', 0),
  (3, 1, 'Asha', 'Ottawa',  'Gold',   '2025-09-15', '9999-12-31', 1);
SELECT * FROM cust_t2;
```

Facts get the key of the version that was true on their date. Press **Run**, then **Show how it runs**: each order finds exactly one version in the join.

```sql
-- try
SELECT o.order_date, o.item, o.amount, c.customer_key, c.city, c.tier
FROM asha_orders o
JOIN cust_t2 c
  ON c.customer_id = 1
 AND o.order_date >= c.valid_from
 AND o.order_date <  c.valid_to
```

Group that by city and Toronto keeps its $50 and Ottawa gets $215: history is reported as it happened. The cost: more rows, a more careful load ([Lesson 5.2](/learn/courses/data-modelling/scd2-by-hand/)), and a choice every report must make between "then" and "now" ([Lesson 5.4](/learn/courses/data-modelling/point-in-time/)). Type 2 is the default for attributes people analyse history by: city, region, tier, segment, product category.

## 6. Type 3: keep the previous value in a column

**Type 3** keeps one row but adds a column for the previous value: `city` and `previous_city`. It supports "compare with before the change" without new rows, but holds only one step of history. A second move would push Toronto out.

```sql
-- noviz
SELECT 1 AS customer_key, 'Asha' AS name,
       'Ottawa' AS city, 'Toronto' AS previous_city, '2025-03-01' AS city_changed_on,
       'Gold' AS tier, 'Bronze' AS previous_tier
```

It is used for one-off, everyone-at-once changes, like a redrawn set of sales regions, where people want to report "new region" and "old region" side by side for a while.

## 7. Type 6: types 1 + 2 + 3 together

**Type 6** (1 + 2 + 3 = 6) is type 2 rows, plus columns holding the **current** value, overwritten on every version of that customer. Each row then knows both what was true then and what is true now:

```sql
-- noviz
DROP TABLE IF EXISTS cust_t6;
CREATE TABLE cust_t6 AS
SELECT t.*, cur.city AS current_city, cur.tier AS current_tier
FROM cust_t2 t
JOIN cust_t2 cur ON cur.customer_id = t.customer_id AND cur.is_current = 1;
SELECT customer_key, city, tier, current_city, current_tier, valid_from, valid_to FROM cust_t6;
```

```sql
-- try
SELECT c.city AS city_then, c.current_city AS city_now, SUM(o.amount) AS sales
FROM asha_orders o
JOIN cust_t6 c
  ON c.customer_id = 1 AND o.order_date >= c.valid_from AND o.order_date < c.valid_to
GROUP BY c.city, c.current_city
```

One query, both views: $50 bought in Toronto by a customer who now lives in Ottawa, $215 bought in Ottawa. The price is that each change must update the current columns on **all** of a customer's rows.

Two others you may hear of: **type 4** moves fast-changing attributes (age band, income band) out into a small separate "mini-dimension" with its own key on the fact, and **type 7** puts both the version key and the durable customer id on the fact so reports can join either way. Both are refinements of the five above.

| Type | What happens on a change | History kept | Rows per customer |
|---|---|---|---|
| 0 | nothing | the original only | 1 |
| 1 | overwrite | none | 1 |
| 2 | close row, add row | all of it | 1 per version |
| 3 | move old value to previous_ column | one step | 1 |
| 6 | type 2, plus current_ columns overwritten | all, plus "now" on every row | 1 per version |

The type is chosen **per column**, not per table. Northbay might keep `joined_on` as type 0, fix `email` as type 1, and track `city` and `loyalty_tier` as type 2.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an attribute that changes is a function of time, not a constant. Type 1 keeps only its latest value; type 2 stores the whole function as a set of intervals.

**Equation:** for customer c, city_c(t) is a step function. Type 2 stores it as pieces [valid_fromᵢ, valid_toᵢ) that **partition** the time line: they don't overlap, and together they cover it. So for any day t exactly one version i has valid_fromᵢ ≤ t < valid_toᵢ, and the fact-to-version join is one-to-one. Type 1 replaces the function with the constant city_c(now): Σ sales by city then becomes Σ by city_c(now), which moves past sales.

**Analogy:** type 1 is a contact card you rub out and rewrite. Type 2 is a passport stamp book: every move adds a page, with the dates on it, and the old pages stay.

**Try it:** Asha's Speaker was bought on 2025-10-05. Which type 2 row covers it? (Key 3: 2025-09-15 ≤ 2025-10-05 < 9999-12-31.)
</details>

## 8. Worked example: Northbay's three re-sign-ups

In August 2025, three Northbay members signed up a second time (customers 601-603, see [SQL Lesson 4.3](/learn/courses/sql/left-join/)), each time on the Silver tier, while their original accounts said Bronze. Suppose the data team decides each re-sign-up is really the same person moving up to Silver on that date. Build their tier history as type 2. The first version uses `1900-01-01` as `valid_from`, a common way to say "true since before our data starts", so purchases from before the recorded `joined_on` still find a row:

```sql
-- noviz
DROP TABLE IF EXISTS tier_history;
CREATE TABLE tier_history AS
SELECT c.customer_id, c.first_name || ' ' || c.last_name AS name, c.loyalty_tier AS tier,
       '1900-01-01' AS valid_from, d.joined_on AS valid_to, 0 AS is_current
FROM customers c JOIN customers d ON d.email = UPPER(c.email) AND d.customer_id > 600
WHERE c.customer_id <= 600
UNION ALL
SELECT c.customer_id, c.first_name || ' ' || c.last_name, d.loyalty_tier, d.joined_on, '9999-12-31', 1
FROM customers c JOIN customers d ON d.email = UPPER(c.email) AND d.customer_id > 600
WHERE c.customer_id <= 600;
SELECT * FROM tier_history ORDER BY customer_id, valid_from;
```

Now their sales by tier, type 2 style (the tier at the time of each order):

```sql
-- try
SELECT h.tier, COUNT(DISTINCT o.order_id) AS orders,
       ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 2) AS sales
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN tier_history h
  ON h.customer_id = o.customer_id
 AND o.order_date >= h.valid_from AND o.order_date < h.valid_to
GROUP BY h.tier
```

Bronze: 9 orders, $85.41. Silver: 3 orders, $122.22. Under type 1 (join only on `is_current = 1`) all 12 orders and $207.63 would count as Silver, and the Silver tier would look as if it had been earning since 2024. A marketing team judging the tier upgrade would be fooled.

## 9. Practice

```sql
-- exercise: Using cust_t2, show Asha's sales by tier at the time of each order.
-- hint: Join asha_orders to cust_t2 on the date range (as in section 5), then GROUP BY c.tier.
SELECT c.tier, SUM(o.amount) AS sales
FROM asha_orders o
JOIN cust_t2 c ON c.customer_id = 1 AND c.is_current = 1
GROUP BY c.tier
-- answer:
SELECT c.tier, SUM(o.amount) AS sales
FROM asha_orders o
JOIN cust_t2 c
  ON c.customer_id = 1
 AND o.order_date >= c.valid_from
 AND o.order_date <  c.valid_to
GROUP BY c.tier
```

```sql
-- exercise: Which version of Asha's row was true on 2025-06-30? Return the customer_key, city and tier.
-- hint: Test the date against valid_from and valid_to with the half-open rule.
SELECT customer_key, city, tier
FROM cust_t2
WHERE is_current = 1
-- answer:
SELECT customer_key, city, tier
FROM cust_t2
WHERE '2025-06-30' >= valid_from AND '2025-06-30' < valid_to
```

```sql
-- exercise: Using tier_history, show each of the three customers with their sales under type 1 (current tier only). One row per customer with name, tier and sales, biggest first.
-- hint: Join orders and order_items to tier_history on customer_id AND h.is_current = 1, then GROUP BY name and tier.
SELECT h.name, h.tier
FROM tier_history h
WHERE h.is_current = 1
-- answer:
SELECT h.name, h.tier, ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 2) AS sales
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN tier_history h ON h.customer_id = o.customer_id AND h.is_current = 1
GROUP BY h.name, h.tier
ORDER BY sales DESC
```

**New words:** *slowly changing dimension (SCD)*, *type 0*, *type 1*, *type 2*, *type 3*, *type 6*, *valid_from*, *valid_to*, *is_current*, *half-open range*.
