---
title: 'Surrogate keys: the warehouse''s own row numbers'
seoTitle: 'Surrogate keys vs natural keys in a data warehouse'
summary: 'Why a warehouse gives every dimension row its own meaningless number, how to make one with ROW_NUMBER, and how an "unknown" row numbered -1 keeps guest orders from vanishing.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is a surrogate key?
    choices: ['The id the source system gave the customer', 'A number the warehouse makes up for each dimension row, with no business meaning', 'A key made by joining two columns together']
    ans: 1
    why: A surrogate key is the warehouse's own integer for a dimension row. It carries no meaning, so it never has to change when the source does.
  - q: 'Guest orders have customer_id NULL. What does the fact load give them?'
    choices: ['NULL, so the joins skip them', 'The key of the special unknown row, -1', 'The key of the first customer']
    ans: 1
    why: Every fact row gets a real key. Guests point at the unknown member (-1), so an inner join to dim_customer keeps them and they show as "Guest / unknown".
  - q: 'Why do slowly changing dimensions (type 2) need surrogate keys?'
    choices: ['Because one customer can have several rows, one per version, and each row needs its own key', 'Because natural keys are always text', 'They do not need them']
    ans: 0
    why: When a customer moves city, type 2 adds a new row with the same customer_id. Only a surrogate key can tell the two versions apart.
sources:
  - 'Kimball Group, Dimensional modeling techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 3: Retail Sales (dimension surrogate keys)'
  - 'SQLite documentation: Window functions (ROW_NUMBER) https://www.sqlite.org/windowfunctions.html'
  - 'Microsoft Learn, T-SQL: CREATE TABLE IDENTITY (Property) https://learn.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql-identity-property'
---

**Module 4 · about 25 minutes · read first: 2.4.** You'll be able to explain why a warehouse uses its own keys, make them with `ROW_NUMBER`, add an "unknown" member, and load a fact table that never loses a row.

<div class="bigidea">A warehouse gives every dimension row its own meaningless whole-number key, so facts never depend on ids that another system can reuse, clash or leave blank.</div>

**In everyday terms:** a cloakroom ticket. The attendant does not file your coat under your name (two people may share it, and some give none). You get ticket 57, which means nothing except "this coat", and it never gets mixed up.

## 1. Why this matters

Every star schema you meet at work joins facts to dimensions on columns called `customer_key`, `product_key` or `date_key`, not on the ids the shop's system uses. People new to BI often ask why. The answer is that source ids are owned by someone else: they get reused, they clash when two systems are merged, and they are missing for guests. A warehouse that leans on them breaks quietly. Surrogate keys are the cheap fix, and every later lesson (history, late data, conformed dimensions) depends on them.

## 2. Natural keys and surrogate keys

A **natural key** (also called a business key) is the id a row has in the source system: `customers.customer_id`, a product's SKU, an employee number. It means something to the business and people type it into searches.

A **surrogate key** is a whole number the warehouse makes up for each dimension row. It means nothing at all. Its only job is to be unique and never change. Fact tables store the surrogate key; the natural key stays in the dimension as an ordinary column so people can still look a customer up.

<!--fig:surrogate-key-map-->

Why not just use the natural key?

- **Two systems, one id.** Northbay's shop numbers customers from 1. If it buys a web shop that also numbers customers from 1, "customer 1" means two people.
- **Missing values.** 482 Northbay orders were placed by guests, with `customer_id` NULL. NULL can't be a key: it matches nothing in a join.
- **History.** When a customer moves city and you keep both versions (type 2, Module 5), one customer_id has two rows. Each row needs its own key.
- **Speed and size.** A small integer joins faster than a long text code, and fact tables have millions of rows.

Here is the clash in miniature. Two systems each have a customer 1 and a customer 2:

```sql
-- try
SELECT 'shop' AS source, customer_id, first_name FROM customers WHERE customer_id IN (1, 2)
UNION ALL
SELECT 'web', 1, 'Tess'
UNION ALL
SELECT 'web', 2, 'Omar'
```

`customer_id` alone can't tell Hiro from Tess. The pair (source, customer_id) can, and the warehouse then gives each pair one simple number.

Switch between Type 1, 2 and 3 and read the sales-by-city report each time.

<figure class="fig" data-fig="@data-scd-types"><figcaption>Notice which method keeps last year's sales in Pune and which rewrites history.</figcaption></figure>


## 3. Making keys with ROW_NUMBER

`ROW_NUMBER() OVER (ORDER BY ...)` numbers rows 1, 2, 3 in the order you choose. That is all a surrogate key needs. Press **Run**, then **Show how it runs**, and notice that the key has nothing to do with the id: sorting by name gives Eli key 1.

```sql
-- try
SELECT ROW_NUMBER() OVER (ORDER BY name) AS customer_key,
       id AS customer_id,
       name
FROM mini_customers
```

Now build the real customer dimension. We number in `customer_id` order (so the keys happen to match the ids, which makes checking easy), tidy the stray spaces in `city`, and then add one extra row: the **unknown member**, key -1, for every fact that has no customer.

```sql
-- noviz
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_customer AS
SELECT ROW_NUMBER() OVER (ORDER BY customer_id) AS customer_key,
       customer_id,
       first_name || ' ' || last_name AS customer_name,
       TRIM(city) AS city,
       loyalty_tier
FROM customers;

INSERT INTO dim_customer VALUES (-1, NULL, 'Guest / unknown', 'Unknown', 'Unknown');

SELECT * FROM dim_customer ORDER BY customer_key LIMIT 4;
```

The table has 604 rows: 603 customers plus the unknown member. Why -1? Any number the key generator will never hand out works; -1 is the common choice because it sorts first and is easy to spot. Some teams add more: -2 "not applicable", -3 "not yet loaded" ([Lesson 5.3](/learn/courses/data-modelling/late-arriving/)).

In a real warehouse the database hands out keys for you: `IDENTITY(1,1)` in SQL Server, `GENERATED ALWAYS AS IDENTITY` in PostgreSQL, `INTEGER PRIMARY KEY` in SQLite. ROW_NUMBER is how you do it by hand, or for a first load.

## 4. Looking the key up in the fact load

The fact load swaps each natural key for its surrogate key. Use a LEFT JOIN, so that rows with no match survive, and `COALESCE(..., -1)` to send them to the unknown member:

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT oi.order_id,
       o.order_date,
       COALESCE(dc.customer_key, -1) AS customer_key,
       oi.product_id,
       oi.quantity,
       ROUND(oi.quantity * oi.unit_price * (1 - oi.discount), 2) AS sales_amount
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
LEFT JOIN dim_customer dc ON dc.customer_id = o.customer_id;

SELECT COUNT(*) AS fact_rows FROM fact_sales;
```

7,310 rows, one per order line, exactly as many as `order_items`. Notice that the unknown row's own `customer_id` is NULL, so guests do not match it in the join (NULL = NULL is not true). COALESCE is what sends them there.

Now any report can inner join safely. Check where the rows went:

```sql
-- try
SELECT d.customer_name = 'Guest / unknown' AS is_guest,
       COUNT(*) AS lines,
       ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
GROUP BY is_guest
```

6,436 lines ($114,066.30) belong to known customers and 874 lines ($15,710.55) to guests. Together that is all 7,310 lines and $129,776.85. Compare a report built on natural keys, which joins orders to customers directly:

```sql
-- try
SELECT COUNT(*) AS lines_kept
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
JOIN customers c ON c.customer_id = o.customer_id
```

Only 6,436 lines. The 874 guest lines simply vanished, and nobody got an error. That silent loss is the main thing the unknown member protects you from.

<div class="meaning">

<dl>
<dt>Natural key (business key)</dt><dd>The id a row has in the source system, such as customer_id or a SKU.</dd>
<dt>Surrogate key</dt><dd>A whole number the warehouse makes up for each dimension row; it means nothing and never changes.</dd>
<dt>Unknown member</dt><dd>A dimension row with a reserved key (here −1) for facts with no or an unmatched natural key.</dd>
<dt>Key lookup</dt><dd>The fact load swapping each natural key for its surrogate key.</dd>
<dt>Physical meaning</dt><dd>The dimension load numbers each row (ROW_NUMBER or IDENTITY) and keeps the natural key as an ordinary column. The fact load LEFT JOINs on the natural key and writes the surrogate, with COALESCE(..., −1) for anything unmatched, so no fact row is lost.</dd>
</dl>

</div>

<div class="myth">

**"Just join facts to customers on customer_id; it is already unique."** Guests have NULL, which matches nothing, so their 874 lines vanish without an error. Two merged systems can also both have a customer 1. The surrogate key and unknown member fix both.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>Source lines.</b> <table class="lk-tbl"><tr><th>line</th><th>customer_id</th></tr><tr><td>1</td><td>10</td></tr><tr><td>2</td><td>NULL</td></tr><tr><td>3</td><td>11</td></tr></table></div>
<div class="step"><b>dim_customer.</b> <table class="lk-tbl"><tr><th>customer_key</th><th>customer_id</th><th>name</th></tr><tr><td>-1</td><td>NULL</td><td>Guest / unknown</td></tr><tr><td>1</td><td>10</td><td>Uma</td></tr><tr><td>2</td><td>11</td><td>Ben</td></tr></table></div>
<div class="step"><b>LEFT JOIN on the natural key.</b> <table class="lk-tbl"><tr><th>line</th><th>customer_key</th></tr><tr><td>1</td><td>1</td></tr><tr><td>2</td><td><mark>NULL</mark></td></tr><tr><td>3</td><td>2</td></tr></table></div>
<div class="step"><b>COALESCE to −1.</b> <table class="lk-tbl"><tr><th>line</th><th>customer_key</th></tr><tr><td>1</td><td>1</td></tr><tr><td>2</td><td><mark>-1</mark></td></tr><tr><td>3</td><td>2</td></tr></table> 3 rows in, 3 out.</div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-unknown-member"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a key is a function that is **injective** (one-to-one): different rows always get different keys. A surrogate key adds a second rule: the key is chosen by the warehouse and is never reused or changed.

**Equation:** let N be the set of natural keys plus one extra value ⊥ for "no customer". The load builds a map k: N → ℤ with k(⊥) = −1, and k(a) ≠ k(b) whenever a ≠ b. Because k is defined for **every** input, including ⊥, the fact-to-dimension join is a total function: each fact row has exactly one partner. An inner join then keeps |fact| rows: 7,310 in, 7,310 out.

**Analogy:** a coat check. You hand in any coat, with or without a name tag, and get a numbered ticket. The number says nothing about the coat, and two coats never share a ticket. A coat with no name tag still gets a ticket, from the "unlabelled" rail.

**Try it:** if you deleted the -1 row and inner joined, how many fact rows would survive? (6,436, the known customers' lines.)
</details>

## 5. Worked example: who are the best customers?

*Question:* who are Northbay's top 3 known customers by sales, and how much of all sales came from guests?

1. Join `fact_sales` to `dim_customer` on `customer_key`.
2. Leave out key -1 for the top list, since "Guest / unknown" is not a person.
3. Sum `sales_amount` per customer.

```sql
-- try
SELECT d.customer_name, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
WHERE f.customer_key <> -1
GROUP BY d.customer_key, d.customer_name
ORDER BY sales DESC
LIMIT 3
```

Leila Garcia ($812.51), Quinn Rossi ($768.25) and Nadia Mensah ($726.21). Grouping by `customer_key`, not by name, matters: two different customers can share a name. Guests bought $15,710.55 of $129,776.85, about 12.1% of sales, which a natural-key report would have hidden.

## 6. Practice

```sql
-- exercise: How many fact rows, and how many different orders, point at the unknown member? Return two numbers.
-- hint: WHERE customer_key = -1, then COUNT(*) and COUNT(DISTINCT order_id).
SELECT COUNT(*) AS lines
FROM fact_sales
-- answer:
SELECT COUNT(*) AS lines, COUNT(DISTINCT order_id) AS orders
FROM fact_sales
WHERE customer_key = -1
```

```sql
-- exercise: Work out the percentage of sales that came from guests, rounded to 1 decimal place. Return one number.
-- hint: SUM(CASE WHEN customer_key = -1 THEN sales_amount END) divided by SUM(sales_amount), times 100.0.
SELECT ROUND(SUM(sales_amount), 1) AS guest_pct
FROM fact_sales
-- answer:
SELECT ROUND(100.0 * SUM(CASE WHEN customer_key = -1 THEN sales_amount END) / SUM(sales_amount), 1) AS guest_pct
FROM fact_sales
```

```sql
-- exercise: Show sales by city from the customer dimension, biggest first, so that guests appear as their own city "Unknown". Show the top 4.
-- hint: Join fact_sales to dim_customer on customer_key, GROUP BY d.city, ORDER BY the total DESC, LIMIT 4.
SELECT d.city, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
WHERE f.customer_key <> -1
GROUP BY d.city
-- answer:
SELECT d.city, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
GROUP BY d.city
ORDER BY sales DESC
LIMIT 4
```

**Try it on your own data:** paste a customer list into [[sql-playground]] and give it keys with `ROW_NUMBER() OVER (ORDER BY ...)`.

<div class="keypoints">

- Natural keys belong to the source: they can be reused, clash between systems or be missing.
- Surrogate keys are made by the warehouse, mean nothing and never change.
- Fact tables store surrogate keys; the natural key stays in the dimension.
- An unknown member (−1) catches facts with no match, so inner joins lose nothing.
- Make keys with ROW_NUMBER by hand, or IDENTITY in the database.

</div>

**New words:** *natural key*, *business key*, *surrogate key*, *unknown member*, *key lookup*.
