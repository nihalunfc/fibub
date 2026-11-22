---
title: 'Data quality checks in SQL'
seoTitle: 'SQL data quality checks: NULLs, duplicates, orphans, ranges'
summary: 'A short set of queries to run on any new table before you trust it: row counts, missing values, duplicate keys, orphan rows, allowed values and ranges, and business rules. Run them on Northbay and find what is wrong.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: How do you count missing emails in one line?
    choices: ['COUNT(*) - COUNT(email)', 'COUNT(email IS NULL)', 'SUM(email)']
    ans: 0
    why: COUNT(*) counts every row and COUNT(email) only rows where email is not NULL, so the difference is the number of NULLs. COUNT(email IS NULL) counts every row, because the comparison is never NULL itself.
  - q: What is an orphan row?
    choices: ['A row with every column NULL', 'A row whose foreign key points at a row that does not exist', 'A row that appears twice']
    ans: 1
    why: For example an order whose customer_id is not in customers. An anti-join (NOT EXISTS or LEFT JOIN ... IS NULL) finds them. Guest orders with a NULL customer_id are not orphans; they are a known case.
  - q: A check finds 596 orders dated before the customer's sign-up date. What should you do first?
    choices: ['Delete the orders', 'Ask the data owner what the dates mean, and note it in your report', 'Ignore it, the totals are fine']
    ans: 1
    why: A failed check is a question, not an instruction. joined_on might mean the loyalty sign-up rather than the first visit. Find out, write it down, and decide together.
sources:
  - 'dbt documentation, Add data tests to your DAG (unique, not_null, relationships, accepted_values) https://docs.getdbt.com/docs/build/data-tests'
  - 'SQLite documentation, Aggregate functions (count) https://www.sqlite.org/lang_aggfunc.html'
  - 'PostgreSQL documentation, Constraints (foreign keys) https://www.postgresql.org/docs/current/ddl-constraints.html'
  - 'Kimball Group, Dimensional modeling techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
---

**Module 7 · about 35 minutes · read first: 7.4.** You'll be able to run a standard set of quality checks on a table, write each one so that 0 means "fine", and turn the results into a short list of issues for the people who own the data.

<div class="bigidea">A data quality check is a query that counts the rows breaking one rule, written so that 0 means "fine".</div>

**In everyday terms:** a pilot's pre-flight checklist. Each line is a yes-or-no question, and the plane leaves only when every line passes.

## 1. Why this matters

Every dashboard is only as good as the table under it. Analysts who check the data before they build catch the blank emails, the duplicate customers and the cancelled orders before a manager does. The checks are short and the same for every table, and saying "first I profile the data" is a strong answer in any BI interview.

## 2. Size and range

Start with the basics: how many rows, is the key unique, and do the dates cover what you expect?

```sql
-- try
SELECT COUNT(*) AS rows,
       COUNT(DISTINCT order_id) AS distinct_ids,
       MIN(order_date) AS first_day,
       MAX(order_date) AS last_day
FROM orders
```

4,064 rows, 4,064 distinct ids (the key is unique), from 2024-01-01 to 2025-12-31. Write down these numbers; next week, compare. A sudden drop in rows is often the first sign that a load failed.

Press Run the checks, then switch checks off and lower the stop threshold.

<figure class="fig" data-fig="@data-dq-gate"><figcaption>Notice which bad rows slip through when a check is off, and when the gate stops the whole load.</figcaption></figure>


## 3. Missing values

`COUNT(column)` skips NULLs, so `COUNT(*) - COUNT(column)` is the number of missing values. One query covers every column you care about:

```sql
-- try
SELECT COUNT(*) AS customers,
       COUNT(*) - COUNT(email) AS no_email,
       COUNT(*) - COUNT(loyalty_tier) AS no_tier,
       COUNT(*) - COUNT(city) AS no_city
FROM customers
```

**37** customers have no email and **58** no loyalty tier; every customer has a city. A missing value is not always an error: decide for each column whether NULL is allowed. In `orders`, a NULL `customer_id` means a guest checkout, which is normal:

```sql
-- try
SELECT COUNT(*) AS orders,
       SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) AS guest_orders,
       ROUND(100.0 * SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_guest
FROM orders
```

482 guest orders, 11.9%. Any "orders per customer" figure must say whether guests are left out.

## 4. Orphans: keys that point nowhere

An *orphan* is a row whose foreign key points at a row that does not exist. Find them with an anti-join ([Lesson 4.4](/learn/courses/sql/anti-join/)), leaving out the NULLs that are allowed:

```sql
-- try
SELECT COUNT(*) AS orphan_orders
FROM orders o
WHERE o.customer_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM customers c WHERE c.customer_id = o.customer_id)
```

0, which is good. Run the same check from `order_items` to `orders` and from `returns` to `order_items`. Warehouses often do not enforce keys (Northbay does not), so these checks are the only guard.

## 5. Allowed values and ranges

List the distinct values of any column with a short set of options, and look for surprises:

```sql
-- try
SELECT status, channel, COUNT(*) AS orders
FROM orders
GROUP BY status, channel
```

Two statuses, two channels, nothing unexpected. But 119 orders are `cancelled`: every revenue query must filter them out, or it overstates sales by 3,197.81. For numbers, check the minimum and maximum make sense:

```sql
-- try
SELECT MIN(quantity) AS min_qty, MAX(quantity) AS max_qty,
       MIN(discount) AS min_disc, MAX(discount) AS max_disc,
       MIN(unit_price) AS min_price
FROM order_items
```

Quantities 1 to 4, discounts 0 to 0.25, no zero or negative prices.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each check is a rule that every row should satisfy, written as a predicate p(r). The check counts the rows where the rule fails: |σ(¬p)(R)|. Zero means the rule holds for the whole table.

**Equation:** missing values = |R| − |σ(x IS NOT NULL)(R)|. Key uniqueness: |R| = |π_key(R)| as a set, so COUNT(*) − COUNT(DISTINCT key) = 0. Orphans: |R ▷ S| = 0, where ▷ is the anti-join (rows of R with no partner in S). Referential integrity says the foreign key's values are a subset of the key's values: π_fk(R) − {NULL} ⊆ π_key(S).

**Analogy:** a pilot's pre-flight checklist. Every item is a yes/no question, and the plane only leaves when they all pass. It breaks down a little because a pilot's checklist has fixed answers, while a data check that fails often needs a conversation about what the data should be.

**Try it:** customers has 603 rows and 563 distinct LOWER(email) values, with 37 NULL emails. How many extra rows share an email with someone? (603 − 37 − 563 = 3.)
</details>

## 6. Business rules

The hardest checks come from knowing the business. Can someone buy before they sign up?

```sql
-- try
SELECT COUNT(*) AS orders_before_signup,
       COUNT(DISTINCT c.customer_id) AS customers
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_date < c.joined_on
```

**596** orders from 187 customers are dated before the customer's `joined_on`. That is not something SQL can settle. Maybe `joined_on` is when they joined the loyalty programme and their earlier purchases were linked afterwards; maybe it is a bug. Ask the data owner, write the answer down, and say in your report which meaning you used. Other rule ideas: a return date after its order date, online orders always at store 12, prices above cost.

<div class="meaning">

<dl>
<dt>Data quality check</dt><dd>A query that counts rows that break a rule. 0 means the rule holds.</dd>
<dt>COUNT(*) − COUNT(col)</dt><dd>The number of missing (NULL) values in a column.</dd>
<dt>COUNT(*) − COUNT(DISTINCT key)</dt><dd>Extra rows that repeat a key; 0 means the key is unique.</dd>
<dt>Orphan</dt><dd>A row whose foreign key points at a row that does not exist. Found with NOT EXISTS.</dd>
<dt>Referential integrity</dt><dd>The rule that every foreign key value exists in the table it points to.</dd>
<dt>Business rule</dt><dd>A rule from how the business works, such as "no order before sign-up". Failures need a conversation, not just a fix.</dd>
<dt>Physical meaning</dt><dd>Checks only read and count; they never change data. Each one filters the table to the rows that break a rule and returns how many there are.</dd>
</dl>

</div>

<div class="myth">

**"A NULL is always an error."** Sometimes NULL is the correct answer: a NULL customer_id on Northbay means a guest checkout. Decide for each column whether NULL is allowed, and check orphans only among the filled-in keys.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>orders and customers (ids 1 to 5).</b> <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th></tr><tr><td>101</td><td>1</td></tr><tr><td>102</td><td>NULL</td></tr><tr><td>103</td><td>7</td></tr><tr><td>104</td><td>2</td></tr><tr><td>105</td><td>2</td></tr></table></div>
<div class="step"><b>Missing.</b> <code>COUNT(*) - COUNT(customer_id)</code> = 5 − 4 = <mark>1</mark> (a guest order: allowed).</div>
<div class="step"><b>Orphans.</b> Filled-in ids with no customer: <mark>7</mark>. Count = 1: this one needs fixing.</div>
<div class="step"><b>Key unique?</b> <code>COUNT(*) - COUNT(DISTINCT order_id)</code> = 5 − 5 = <mark>0</mark>. Pass.</div>
<div class="step"><b>Report.</b> One line per check: name, count, pass or fail. Run it after every load.</div>
</div>

<div class="problem" data-problem="sql-dq-orphans"></div>

## 7. Worked example: one checklist query

*Question:* put the main checks for Northbay in one result, one row per check, where 0 means fine.

```sql
-- try
SELECT 'orders: duplicate order_id' AS check_name, COUNT(*) - COUNT(DISTINCT order_id) AS problems FROM orders
UNION ALL
SELECT 'customers: missing email', COUNT(*) - COUNT(email) FROM customers
UNION ALL
SELECT 'customers: missing tier', COUNT(*) - COUNT(loyalty_tier) FROM customers
UNION ALL
SELECT 'customers: untidy city', SUM(city <> TRIM(city)) FROM customers
UNION ALL
SELECT 'customers: duplicate email', COUNT(email) - COUNT(DISTINCT LOWER(email)) FROM customers
UNION ALL
SELECT 'order_items: bad quantity or discount', SUM(quantity <= 0 OR discount < 0 OR discount >= 1) FROM order_items
```

1. Each SELECT is one check that returns one number; UNION ALL stacks them. Press **Show how it runs** to watch the parts stack up.
2. Results: duplicate ids 0, missing email **37**, missing tier **58**, untidy city **20**, duplicate email **3**, bad quantities 0.
3. In SQLite, a comparison such as `city <> TRIM(city)` is 1 or 0, so SUM counts the rows where it is true. Elsewhere write `SUM(CASE WHEN ... THEN 1 ELSE 0 END)`.
4. Save the query, run it after every load, and add a row whenever you find a new kind of problem. Turned into a short note, it reads: "Northbay customers: 37 missing emails, 58 missing tiers, 20 cities with trailing spaces (fixed with TRIM in reports), 3 duplicate sign-ups (601 to 603, mapped to 17, 142, 388). Orders: 119 cancelled (excluded), 482 guest orders (counted in sales, not in per-customer figures), 596 dated before sign-up (asked the owner)."

## 8. Practice

```sql
-- exercise: The reverse of an orphan check: list the customers who have never placed an order (customer_id, first_name, last_name, joined_on).
-- hint: NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id).
SELECT customer_id, first_name, last_name, joined_on
FROM customers c
WHERE joined_on >= '2025-12-01'
-- answer:
SELECT customer_id, first_name, last_name, joined_on
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id)
```

Who did you find? Compare the ids with [Lesson 7.4](/learn/courses/sql/duplicates/).

```sql
-- exercise: Check the online rule: count orders where the channel and the store disagree (channel 'online' but store_id is not 12, or channel 'store' but store_id is 12).
-- hint: WHERE (channel = 'online' AND store_id <> 12) OR (channel = 'store' AND store_id = 12).
SELECT COUNT(*) AS mismatched
FROM orders
WHERE channel = 'online'
-- answer:
SELECT COUNT(*) AS mismatched
FROM orders
WHERE (channel = 'online' AND store_id <> 12) OR (channel = 'store' AND store_id = 12)
```

```sql
-- exercise: List each loyalty_tier value (including NULL) with how many customers have it, to see every value the column holds.
-- hint: GROUP BY loyalty_tier. NULL shows up as its own group.
SELECT DISTINCT loyalty_tier
FROM customers
-- answer:
SELECT loyalty_tier, COUNT(*) AS customers
FROM customers
GROUP BY loyalty_tier
```

**Try it on your own data:** [[csv-profiler]] runs the same kind of checks (missing values, distinct values, ranges) on a CSV file in your browser.

<div class="keypoints">

- Write every check so that 0 means fine.
- Profile first: row count, key uniqueness, date range.
- COUNT(*) − COUNT(col) counts missing values; decide where NULL is allowed.
- Find orphans with NOT EXISTS, leaving allowed NULLs out.
- Business-rule failures go to the data owner with the counts.

</div>

**New words:** *data quality check*, *orphan*, *referential integrity*, *business rule*.
