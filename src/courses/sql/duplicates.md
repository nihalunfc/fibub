---
title: 'Finding and removing duplicates'
seoTitle: 'SQL find and remove duplicates with GROUP BY and ROW_NUMBER'
summary: 'Find exact copies with GROUP BY and HAVING, find the same person signed up twice by matching a cleaned key, and keep one row per key with ROW_NUMBER, without deleting real customers by mistake.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: How do you list values of email that appear more than once?
    choices: ['SELECT email FROM customers WHERE COUNT(*) > 1', 'SELECT email, COUNT(*) FROM customers GROUP BY email HAVING COUNT(*) > 1', 'SELECT DISTINCT email FROM customers']
    ans: 1
    why: GROUP BY makes one group per email and HAVING keeps the groups with more than one row. COUNT cannot go in WHERE, and DISTINCT hides duplicates instead of showing them.
  - q: You keep rn = 1 from ROW_NUMBER() OVER (PARTITION BY LOWER(email) ...). What happens to the 37 customers with no email?
    choices: ['They are all kept', 'They all fall into one NULL partition, so only one of them is kept', 'The query fails']
    ans: 1
    why: PARTITION BY puts all NULLs in the same group. Give each NULL its own key, for example COALESCE(LOWER(email), 'no-email-' || customer_id), or leave those rows out of the dedup.
  - q: Why is matching on first name and last name a weak way to find duplicate people?
    choices: ['Names cannot be compared in SQL', 'Different people often share a name, so it finds false matches', 'It is too slow']
    ans: 1
    why: In Northbay, 15 name-and-city pairs appear twice or more, but only 3 are really the same person. Match on something closer to unique, such as a cleaned email, and check by hand.
sources:
  - 'SQLite documentation, SELECT DISTINCT https://www.sqlite.org/lang_select.html#distinct'
  - 'SQLite documentation, Window functions: row_number https://www.sqlite.org/windowfunctions.html#builtins'
  - 'Microsoft Learn, ROW_NUMBER (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/functions/row-number-transact-sql'
  - 'Molinaro, A. and de Graaf, R. (2020), SQL Cookbook, 2nd edition, O''Reilly, chapter 4 (deleting duplicate records)'
---

**Module 7 · about 30 minutes · read first: 6.3.** You'll be able to find exact duplicate rows, find the same thing recorded twice under slightly different values, and keep one row per key safely with ROW_NUMBER.

<div class="bigidea">Decide what makes two rows "the same" (the key), find keys that appear more than once, and keep one row per key with ROW_NUMBER.</div>

**In everyday terms:** a cloakroom where each coat should have its own ticket number. Two tickets with the same number is a duplicate; "17" and "17 " written sloppily are the same ticket in disguise.

## 1. Why this matters

Duplicates inflate every count: customers, revenue, sign-ups. They come from files loaded twice, retries, and people signing up again with a different spelling. "Find and remove duplicates" is one of the most-asked SQL interview tasks, and in real work the hard part is not the SQL but deciding what "the same" means.

## 2. Exact copies

An *exact duplicate* is a row identical in every column to another. Here is `mini_orders` as if two rows had been loaded twice:

```sql
-- try
WITH loaded AS (
  SELECT * FROM mini_orders
  UNION ALL
  SELECT * FROM mini_orders WHERE order_id IN (101, 104)
)
SELECT order_id, customer_id, item, amount, COUNT(*) AS copies
FROM loaded
GROUP BY order_id, customer_id, item, amount
HAVING COUNT(*) > 1
```

Press **Show how it runs** and watch GROUP BY: orders 101 and 104 form groups of 2, and HAVING keeps only those. To remove exact copies, `SELECT DISTINCT *` is enough, because DISTINCT drops rows that are copies of an earlier row.

Switch between the four operations and add ids to either list to see how duplicates are handled.

<figure class="fig" data-fig="@data-set-ops"><figcaption>Notice that UNION removes duplicates, UNION ALL keeps them, and EXCEPT depends on which list comes first.</figcaption></figure>


## 3. Duplicates of a key

More often the rows differ a little, but they should be one: the same *key* (the thing that should be unique) appears twice. Is any email used by two customers?

```sql
-- try
SELECT email, COUNT(*) AS n
FROM customers
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1
```

No rows. But [Lesson 7.2](/learn/courses/sql/text/) found 3 emails in capitals. Compare a cleaned key instead:

```sql
-- try
SELECT LOWER(TRIM(email)) AS email_key, COUNT(*) AS n
FROM customers
WHERE email IS NOT NULL
GROUP BY email_key
HAVING COUNT(*) > 1
```

Three people signed up twice. Look at them side by side:

```sql
-- try
SELECT customer_id, first_name, last_name, email, city, joined_on, loyalty_tier
FROM customers
WHERE LOWER(email) IN ('uma.novak17@example.com', 'yara.garcia142@example.com', 'noah.martin388@example.com')
ORDER BY LOWER(email), joined_on
```

Each pair has the same name and city; the second account (ids 601 to 603) joined in August 2025 with the email in capitals and a Silver tier.

## 4. Do not match on names alone

Names feel like a natural key, but people share names:

```sql
-- try
SELECT first_name, last_name, TRIM(city) AS city, COUNT(*) AS n
FROM customers
GROUP BY first_name, last_name, TRIM(city)
HAVING COUNT(*) > 1
ORDER BY n DESC
```

**15** groups, but only 3 are real duplicates. Even "Noah Martin, Edmonton" has 3 rows: two are the same person, the third is someone else. A *false positive* is a match that is not real. Merging these would combine strangers' purchase histories. Use the most reliable key you have, and check a sample by eye before changing anything.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a key should be an injective map from rows to people: different rows give different key values. A duplicate is a pair of rows that the key maps to the same value, or that should have been mapped to the same value.

**Equation:** for key function k, duplicates are the classes { r : k(r) = v } with size > 1, which is exactly γ(k; COUNT) followed by σ(COUNT > 1). Choosing k is the real decision. k = email finds 0 classes; k = LOWER(email) finds 3; k = (first, last, city) finds 15. A coarser k (one that merges more values) finds more classes, both true and false. Keeping one row per class is ROW_NUMBER over partition k, then σ(rn = 1), which gives exactly one row per distinct k.

**Analogy:** a cloakroom ticket. Each coat should have its own number. Two tickets with the same number is a duplicate key; two tickets that differ only by being written in capitals is the same ticket in disguise. It breaks down a little because coats do not share names, and people do.

**Try it:** with k = LOWER(email), 603 customers and 3 classes of size 2 (ignoring NULLs). How many rows are left after keeping one per class? (600.)
</details>

## 5. Keep one row per key

The pattern from [Lesson 6.3](/learn/courses/sql/top-n-per-group/): number the rows inside each key, ordered so the row you want to keep comes first, then keep row 1. Here the rule is "keep the earliest sign-up". Watch it on the six rows:

```sql
-- try
SELECT customer_id, email, joined_on,
       ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY joined_on, customer_id) AS rn
FROM customers
WHERE customer_id IN (17, 142, 388, 601, 602, 603)
```

At the OVER step, each email is a partition of 2 rows, and the older account gets 1.

**The NULL trap.** PARTITION BY puts every NULL in one group. Run the same idea on the whole table and count what you would throw away:

```sql
-- try
WITH r AS (
  SELECT customer_id,
         ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY joined_on, customer_id) AS rn
  FROM customers
)
SELECT COUNT(*) AS would_remove
FROM r
WHERE rn > 1
```

**39**, not 3: the 3 real duplicates plus 36 of the 37 customers with no email. Give each NULL its own key:

```sql
-- try
WITH r AS (
  SELECT customer_id, first_name, last_name, email, joined_on,
         ROW_NUMBER() OVER (PARTITION BY COALESCE(LOWER(email), 'no-email-' || customer_id) ORDER BY joined_on, customer_id) AS rn
  FROM customers
)
SELECT COUNT(*) AS kept
FROM r
WHERE rn = 1
```

600 kept: 603 minus the 3 duplicates.

<div class="meaning">

<dl>
<dt>Exact duplicate</dt><dd>A row identical in every column to another row. SELECT DISTINCT removes these.</dd>
<dt>Key</dt><dd>The column (or columns) that should be unique, such as a cleaned email.</dd>
<dt>GROUP BY key HAVING COUNT(*) &gt; 1</dt><dd>Lists the keys that appear more than once.</dd>
<dt>False positive</dt><dd>Two rows that look like a duplicate but are different things, such as two people with the same name.</dd>
<dt>NULL trap</dt><dd>PARTITION BY puts every NULL key into one group, so a dedupe would throw away all but one of them.</dd>
<dt>Physical meaning</dt><dd>Finding duplicates groups rows by the key and counts them. Removing them numbers the rows inside each key and keeps only number 1, so the row count drops by exactly the number of extra copies.</dd>
</dl>

</div>

<div class="myth">

**"Matching on first and last name finds the duplicate customers."** People share names: on Northbay, 15 name-and-city groups repeat but only 3 are real duplicates. Use the most reliable key you have (a cleaned email), and check a sample before you delete anything.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>Customers.</b> <table class="lk-tbl"><tr><th>id</th><th>email</th><th>joined</th></tr><tr><td>17</td><td>uma@x.ca</td><td>2024-03</td></tr><tr><td>601</td><td>UMA@x.ca</td><td>2025-08</td></tr><tr><td>20</td><td>NULL</td><td>2024-05</td></tr><tr><td>21</td><td>NULL</td><td>2024-06</td></tr></table></div>
<div class="step"><b>Clean the key.</b> LOWER(email): 17 and 601 both become <mark>uma@x.ca</mark>.</div>
<div class="step"><b>Number inside each key.</b> <code>ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY joined)</code> <table class="lk-tbl"><tr><th>id</th><th>key</th><th>rn</th></tr><tr><td>17</td><td>uma@x.ca</td><td>1</td></tr><tr><td>601</td><td>uma@x.ca</td><td><mark>2</mark></td></tr><tr><td>20</td><td>NULL</td><td>1</td></tr><tr><td>21</td><td>NULL</td><td><mark>2</mark></td></tr></table></div>
<div class="step"><b>The trap.</b> Customer 21 is not a duplicate: the two NULLs were put in one group. Use <code>COALESCE(LOWER(email), 'no-email-' || id)</code> so each NULL is its own key.</div>
<div class="step"><b>Keep rn = 1.</b> Only 601 goes: 4 rows become <mark>3</mark>.</div>
</div>

<div class="problem" data-problem="sql-dedupe-removed"></div>

## 6. Worked example

*Question:* make a clean customer table, and a map from each duplicate id to the id that is kept (so orders can be pointed at the right person).

```sql
-- noviz
DROP TABLE IF EXISTS customer_map;
CREATE TABLE customer_map AS
SELECT customer_id,
       FIRST_VALUE(customer_id) OVER (PARTITION BY COALESCE(LOWER(email), 'no-email-' || customer_id) ORDER BY joined_on, customer_id) AS keep_id
FROM customers;
SELECT customer_id, keep_id
FROM customer_map
WHERE customer_id <> keep_id;
```

1. `FIRST_VALUE(x) OVER (...)` gives the first row's value in each window, so every row learns the id of its key's earliest account.
2. Only three rows differ from their own id: **601 → 17, 602 → 142, 603 → 388**.
3. A report then joins orders to `customer_map` and groups by `keep_id`. (The duplicate accounts have no orders in Northbay, but in real data they usually do.)
4. The clean customer list is every customer whose id equals its keep_id: 600 rows.

In a real warehouse you would rarely DELETE the extra rows: build a cleaned table or view, and keep the raw data so the rule can be changed later.

## 7. Practice

```sql
-- exercise: How many distinct customers are there if you count cleaned emails (LOWER) and ignore customers with no email?
-- hint: COUNT(DISTINCT LOWER(email)). COUNT DISTINCT already skips NULLs.
SELECT COUNT(DISTINCT email) AS people
FROM customers
-- answer:
SELECT COUNT(DISTINCT LOWER(email)) AS people
FROM customers
```

```sql
-- exercise: Possible double checkouts: find known customers (customer_id not NULL) with more than one order on the same day. Show customer_id, order_date and the number of orders.
-- hint: GROUP BY customer_id, order_date HAVING COUNT(*) > 1.
SELECT customer_id, order_date, COUNT(*) AS n
FROM orders
WHERE customer_id IS NOT NULL
GROUP BY customer_id, order_date
-- answer:
SELECT customer_id, order_date, COUNT(*) AS n
FROM orders
WHERE customer_id IS NOT NULL
GROUP BY customer_id, order_date
HAVING COUNT(*) > 1
```

You will find 12 customer-days. They are not necessarily mistakes (people do shop twice in a day), which is the point: a duplicate check gives you a list to look into, not a list to delete.

```sql
-- exercise: List the ids of the duplicate accounts to remove: rows that are not the earliest sign-up for their LOWER(email), leaving customers with no email alone.
-- hint: ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY joined_on, customer_id) in a CTE with WHERE email IS NOT NULL, then keep rn > 1.
SELECT customer_id
FROM customers
WHERE email IS NOT NULL
-- answer:
WITH r AS (
  SELECT customer_id,
         ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY joined_on, customer_id) AS rn
  FROM customers
  WHERE email IS NOT NULL
)
SELECT customer_id
FROM r
WHERE rn > 1
```

**Try it on your own data:** [[data-cleaner]] removes duplicate rows from a CSV, and [[merge-csv]] helps when the duplicates come from joining two files.

<div class="keypoints">

- SELECT DISTINCT removes exact copies; most real duplicates differ a little.
- Find repeated keys with GROUP BY key HAVING COUNT(*) > 1, on a cleaned key.
- Keep one row per key with ROW_NUMBER() OVER (PARTITION BY key ORDER BY rule) and rn = 1.
- Give NULL keys their own value, or they are treated as one group.
- Names alone give false positives; check before deleting.

</div>

**New words:** *exact duplicate*, *key*, *false positive*, *FIRST_VALUE*.
