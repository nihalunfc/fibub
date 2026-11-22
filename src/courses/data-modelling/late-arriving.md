---
title: 'Late-arriving facts and dimensions'
seoTitle: 'Late arriving dimensions and facts in a data warehouse'
summary: 'Sometimes a sale arrives before the customer it belongs to, and sometimes an old sale turns up after the customer has changed. Handle both: the unknown member and back-fill, inferred members, and looking up the version that was true on the fact''s date.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'An order arrives for customer 366, who is not in dim_customer yet. Which is NOT a sound way to load it?'
    choices: ['Point it at the unknown member and back-fill the key later', 'Add an inferred member row for customer 366 and use its key', 'Leave the order out until the customer arrives, and don''t record it anywhere']
    ans: 2
    why: Dropping the fact makes totals wrong with no trace. The other two keep every sale; they differ in whether the fact or the dimension is fixed later.
  - q: What is an inferred member?
    choices: ['A placeholder dimension row made from a fact''s natural key, filled in when the real data arrives', 'A customer guessed by a machine learning model', 'The -1 unknown row']
    ans: 0
    why: The load knows the natural key (customer 366) but nothing else, so it adds a row with that key and "Not yet known" attributes. Later it overwrites that row in place.
  - q: 'A July sale arrives in November. The customer moved in September (type 2). Which version should the fact point at?'
    choices: ['The current version, from September', 'The version valid on the sale''s date in July', 'The first version ever']
    ans: 1
    why: Late facts are looked up by their own date, not by the load date. Using is_current = 1 would file July's sale under the September city.
sources:
  - 'The Kimball Group, Dimensional Modeling Techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, chapter 19 (ETL subsystems and techniques: late arriving data)'
  - 'Kimball Group, Design Tip #57: Early arriving facts https://www.kimballgroup.com/2004/05/design-tip-57-early-arriving-facts/'
---

**Module 5 · about 30 minutes · read first: 5.2.** You'll be able to load a fact whose customer hasn't arrived yet, repair it when the customer does arrive, and look up the right version for a fact that turns up late.

<div class="bigidea">Data does not always arrive in order: a sale can show up before its customer, or after the customer has changed, and the warehouse needs a rule for both.</div>

**In everyday terms:** a parcel that arrives before the shop has your name on file. The shop writes "unknown customer" on a temporary card, and fills in the real name when you register.

## 1. Why this matters

Data never arrives in a neat order. The till sends sales every few minutes; the loyalty system sends new members once a night, or once a week, or after a failed job is fixed. A shop's paper receipts from a power cut get typed in a week later. If the warehouse assumes "dimensions first, then facts, all on time", it drops rows or files them under the wrong customer, and nobody notices until a total doesn't match the finance system. Kimball calls these **late-arriving dimensions** (or early-arriving facts) and **late-arriving facts**.

<div class="meaning">

<dl>
<dt>Early-arriving fact</dt><dd>A fact whose dimension row does not exist yet.</dd>
<dt>Late-arriving fact</dt><dd>A fact that arrives after the dimension has already changed.</dd>
<dt>Inferred member</dt><dd>A placeholder dimension row made so the fact can load now. It is filled in later.</dd>
<dt>Back-fill</dt><dd>Fix the fact's key after the real dimension row arrives.</dd>
<dt>Restatement</dt><dd>Past report numbers change after late data is added.</dd>
<dt>Physical meaning</dt><dd>Late data either adds a placeholder row to the dimension, or moves existing fact rows from one key to another. Either way, totals for past periods may change.</dd>
</dl>

</div>

<div class="myth">

**"Drop the fact or load it with NULL until the customer arrives."** Dropping loses sales. NULL keys break joins and totals. Load it against an inferred member (or an "Unknown" row) and repair it later.

</div>

## 2. A fact arrives before its customer

Imagine the loyalty system's nightly extract has been failing since 30 November 2025. Our customer dimension has only members who joined before 1 December; anyone who joined later is missing. To keep it simple, `customer_key` reuses `customer_id` here.

```sql
-- noviz
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_customer AS
SELECT customer_id AS customer_key, customer_id,
       first_name || ' ' || last_name AS customer_name, TRIM(city) AS city, loyalty_tier,
       0 AS is_inferred
FROM customers
WHERE joined_on < '2025-12-01';
INSERT INTO dim_customer VALUES (-1, NULL, 'Guest / unknown', 'Unknown', 'Unknown', 0);

SELECT COUNT(*) AS dimension_rows FROM dim_customer;
```

594 rows: 593 members plus the unknown member. Ten members who joined in December are missing. Now load December 2025's sales. The important habit: **keep the source's natural key on the fact** (`source_customer_id`), even though reports never use it. It is what makes a repair possible.

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT oi.order_id, o.order_date,
       o.customer_id AS source_customer_id,
       COALESCE(d.customer_key, -1) AS customer_key,
       ROUND(oi.quantity * oi.unit_price * (1 - oi.discount), 2) AS sales_amount
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
LEFT JOIN dim_customer d ON d.customer_id = o.customer_id
WHERE o.order_date LIKE '2025-12%';
```

```sql
-- try
SELECT CASE WHEN source_customer_id IS NULL THEN 'real guest' ELSE 'customer not loaded yet' END AS why_unknown,
       COUNT(*) AS lines,
       ROUND(SUM(sales_amount), 2) AS sales
FROM fact_sales
WHERE customer_key = -1
GROUP BY why_unknown
```

82 of December's 575 lines landed on the unknown member. 74 are real guests and will stay there. But 8 lines ($191.19) belong to real customers who simply haven't arrived yet. Nothing was lost, which is the job of the unknown member, but those 8 lines now need fixing.

## 3. Option A: back-fill the fact

When the late customers finally arrive, add them to the dimension, then re-point the fact rows that are on -1 **and** have a natural key:

```sql
-- noviz
INSERT INTO dim_customer
SELECT customer_id, customer_id, first_name || ' ' || last_name, TRIM(city), loyalty_tier, 0
FROM customers
WHERE joined_on >= '2025-12-01';

UPDATE fact_sales
SET customer_key = (SELECT d.customer_key FROM dim_customer d
                    WHERE d.customer_id = fact_sales.source_customer_id)
WHERE customer_key = -1
  AND source_customer_id IS NOT NULL;
```

The UPDATE changes 8 rows. Check:

```sql
-- try
SELECT COUNT(*) AS lines_on_unknown,
       SUM(source_customer_id IS NOT NULL) AS still_waiting
FROM fact_sales
WHERE customer_key = -1
```

74 lines left on -1, all genuine guests; 0 still waiting. This is the **back-fill**: the dimension is fixed by an insert, the fact by an update.

The catch: fact tables are huge, often partitioned by date, and many teams treat them as insert-only. Updating last month's partition every time a customer is late is slow and makes yesterday's reports change. That is why many warehouses prefer option B.

## 4. Option B: inferred members

An **inferred member** is a placeholder dimension row, created by the fact load itself, for a natural key the dimension doesn't know yet. It gets a real surrogate key straight away, so the fact can be loaded with its final key and never touched again. Only the dimension row is fixed later.

Rewind: take the December joiners out again, as if they had not arrived, and let the fact load create placeholders for the ones it needs:

```sql
-- noviz
DELETE FROM dim_customer
WHERE customer_id IN (SELECT customer_id FROM customers WHERE joined_on >= '2025-12-01');

INSERT INTO dim_customer
SELECT DISTINCT o.customer_id, o.customer_id, 'Not yet known', 'Not yet known', 'Not yet known', 1
FROM orders o
WHERE o.order_date LIKE '2025-12%'
  AND o.customer_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM dim_customer d WHERE d.customer_id = o.customer_id);

SELECT * FROM dim_customer WHERE is_inferred = 1;
```

Four placeholders: customers 30, 202, 357 and 366, the only December joiners who also bought in December. Now reload December's facts; this time every known customer finds a key:

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT oi.order_id, o.order_date,
       o.customer_id AS source_customer_id,
       COALESCE(d.customer_key, -1) AS customer_key,
       ROUND(oi.quantity * oi.unit_price * (1 - oi.discount), 2) AS sales_amount
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
LEFT JOIN dim_customer d ON d.customer_id = o.customer_id
WHERE o.order_date LIKE '2025-12%';

SELECT SUM(customer_key = -1) AS lines_on_unknown FROM fact_sales;
```

74, only the guests. When the loyalty extract finally runs, the dimension load **overwrites** each placeholder in place (type 1 style, not a new type 2 version, because the placeholder was never true) and clears the flag. `UPDATE ... FROM` works in SQLite and PostgreSQL; SQL Server writes it as `UPDATE d SET ... FROM dim_customer d JOIN customers c ON ...`.

```sql
-- noviz
UPDATE dim_customer
SET customer_name = c.first_name || ' ' || c.last_name,
    city = TRIM(c.city),
    loyalty_tier = c.loyalty_tier,
    is_inferred = 0
FROM customers c
WHERE c.customer_id = dim_customer.customer_id
  AND dim_customer.is_inferred = 1;
```

```sql
-- try
SELECT d.customer_name, d.city, d.loyalty_tier, COUNT(*) AS lines, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
WHERE f.source_customer_id IN (30, 202, 357, 366)
GROUP BY d.customer_name, d.city, d.loyalty_tier
```

The fact rows never moved, yet they now show Kofi Das (Niagara Falls, Gold, $115.95), Gurpreet Brown ($51.26), Pierre Khan ($19.99) and Sofia Murphy ($3.99). The `is_inferred` flag is worth keeping: a daily check that counts placeholders older than a few days tells you a feed is stuck.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the fact-to-dimension lookup must be a total function at load time, even when the dimension is incomplete. The unknown member and inferred members are two ways to extend the dimension so every fact has a partner.

**Equation:** let K be the natural keys seen in facts and D ⊆ K those in the dimension. Option A maps K ∖ D to one value, −1, so the map is total but not injective: four different customers collapse onto one row, and the information is kept only in source_customer_id. Option B adds a new row for each key in K ∖ D, so the map stays **injective**: each natural key has its own surrogate key from the start, and filling in attributes later changes no key.

**Analogy:** a hotel guest arrives before their booking reaches the front desk. Option A: give them the spare "walk-in" room and move them later. Option B: give them a proper room now with "name to follow" on the door, and write the name in when the booking arrives. Nobody has to change rooms.

**Try it:** a fact load sees natural keys {30, 202, 357, 366, 999} and the dimension has none of them. How many inferred rows does option B add? (5.)
</details>

## 5. A fact arrives after its customer changed

The opposite problem: the customer is there, but an **old** fact arrives late. Say the Toronto store finds a box of paper receipts from 20 July 2025 and types them in on 2 November. Isaac Kumar, from [Lesson 5.2](/learn/courses/data-modelling/scd2-by-hand/), bought something on one of them. By November his dimension has three versions:

```sql
-- noviz
DROP TABLE IF EXISTS dim_isaac;
CREATE TABLE dim_isaac (customer_key INTEGER, customer_id INTEGER, city TEXT, loyalty_tier TEXT,
                        valid_from TEXT, valid_to TEXT, is_current INTEGER);
INSERT INTO dim_isaac VALUES
  (7,   7, 'Edmonton', 'Bronze', '1900-01-01', '2025-06-01', 0),
  (606, 7, 'Toronto',  'Gold',   '2025-06-01', '2025-10-01', 0),
  (609, 7, 'Ottawa',   'Gold',   '2025-10-01', '9999-12-31', 1);

DROP TABLE IF EXISTS late_receipts;
CREATE TABLE late_receipts (receipt_id INTEGER, customer_id INTEGER, sale_date TEXT, loaded_on TEXT, amount REAL);
INSERT INTO late_receipts VALUES (90001, 7, '2025-07-20', '2025-11-02', 42.50);
```

The easy mistake is to look up the **current** row, as you would for a fact arriving on time:

```sql
-- try
SELECT r.receipt_id, r.sale_date, d.customer_key, d.city
FROM late_receipts r
JOIN dim_isaac d ON d.customer_id = r.customer_id AND d.is_current = 1
```

Key 609, Ottawa: wrong. In July Isaac lived in Toronto. For on-time facts "current" and "valid on the sale date" are the same row, which is why the shortcut seems to work. For late facts they are not. Always look up by the fact's **own** date:

```sql
-- try
SELECT r.receipt_id, r.sale_date, d.customer_key, d.city, d.loyalty_tier
FROM late_receipts r
JOIN dim_isaac d
  ON d.customer_id = r.customer_id
 AND r.sale_date >= d.valid_from
 AND r.sale_date <  d.valid_to
```

Key 606, Toronto, Gold. If you write every fact load with the date-range lookup from the start, late facts need no special handling at all.

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>A sale arrives for customer C9.</b> <table class="lk-tbl"><tr><th>sale</th><th>cust</th><th>amount</th></tr><tr><td>501</td><td>C9</td><td>40</td></tr></table> dim_customer has no C9 yet.</div>
<div class="step"><b>Inferred member.</b> <table class="lk-tbl"><tr><th>key</th><th>cust</th><th>name</th></tr><tr><td><mark>77</mark></td><td>C9</td><td><mark>Unknown</mark></td></tr></table> Create a placeholder so the sale can load with key 77.</div>
<div class="step"><b>Fact loads.</b> <table class="lk-tbl"><tr><th>sale</th><th>customer_key</th><th>amount</th></tr><tr><td>501</td><td><mark>77</mark></td><td>40</td></tr></table></div>
<div class="step"><b>The real customer arrives.</b> <table class="lk-tbl"><tr><th>key</th><th>cust</th><th>name</th></tr><tr><td>77</td><td>C9</td><td><mark>Chloe</mark></td></tr></table> Fill in the placeholder. The fact needs no change.</div>
<div class="step"><b>Late fact, old date.</b> A sale from February arrives in April. Look up the version that was valid <i>in February</i>, not the current one.</div>
</div>

<div class="problem" data-problem="dm-late-key"></div>

## 6. Worked example: what a late fact changes

Late facts also change numbers people have already seen. Suppose July's Toronto sales report went out on 1 August. When receipt 90001 is loaded in November, July's Toronto total grows by $42.50. Three habits keep that honest:

1. **Record when each fact was loaded** (`loaded_on`, an audit column, [Lesson 7.3](/learn/courses/data-modelling/audit-columns/)), separately from when it happened.
2. **Report "as known on"** when it matters: filter `loaded_on <= '2025-08-01'` to reproduce the report exactly as it was first sent.
3. **Flag restatements:** a monthly check that counts facts whose `loaded_on` month is later than their `sale_date` month.

```sql
-- try
SELECT receipt_id, sale_date, loaded_on,
       CAST(julianday(loaded_on) - julianday(sale_date) AS INTEGER) AS days_late,
       CASE WHEN substr(loaded_on, 1, 7) > substr(sale_date, 1, 7) THEN 'restates a closed month' ELSE 'on time' END AS effect
FROM late_receipts
```

105 days late, and it restates July. Finance teams usually want to know.

## 7. Practice

```sql
-- exercise: In fact_sales, count December lines by customer type: 'guest' (key -1) or 'member'. Return two rows.
-- hint: CASE WHEN customer_key = -1 THEN 'guest' ELSE 'member' END, then GROUP BY it.
SELECT COUNT(*) AS lines
FROM fact_sales
-- answer:
SELECT CASE WHEN customer_key = -1 THEN 'guest' ELSE 'member' END AS customer_type, COUNT(*) AS lines
FROM fact_sales
GROUP BY customer_type
```

```sql
-- exercise: Three more late receipts arrive for Isaac (customer 7), dated 2025-03-14, 2025-06-01 and 2025-12-02. Return each date with the customer_key and city it should get.
-- hint: Put the dates in a CTE with VALUES, then join dim_isaac on the half-open range.
WITH late(sale_date) AS (VALUES ('2025-03-14'), ('2025-06-01'), ('2025-12-02'))
SELECT l.sale_date, d.customer_key, d.city
FROM late l
JOIN dim_isaac d ON d.is_current = 1
-- answer:
WITH late(sale_date) AS (VALUES ('2025-03-14'), ('2025-06-01'), ('2025-12-02'))
SELECT l.sale_date, d.customer_key, d.city
FROM late l
JOIN dim_isaac d
  ON l.sale_date >= d.valid_from
 AND l.sale_date <  d.valid_to
```

```sql
-- exercise: Show the 3 members (not guests) with the most December lines, with their line count, most first, ties broken by name.
-- hint: Join fact_sales to dim_customer on customer_key, exclude key -1, GROUP BY the customer, ORDER BY the count DESC then name, LIMIT 3.
SELECT d.customer_name, COUNT(*) AS lines
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
GROUP BY d.customer_name
-- answer:
SELECT d.customer_name, COUNT(f.order_id) AS lines
FROM dim_customer d
JOIN fact_sales f ON f.customer_key = d.customer_key
WHERE d.customer_key <> -1
GROUP BY d.customer_key, d.customer_name
ORDER BY lines DESC, d.customer_name
LIMIT 3
```

<div class="keypoints">

- Never drop a late fact and never load it with NULL.
- An inferred member lets the fact load now; update it when the customer arrives.
- A late fact needs the dimension version valid on the fact's own date.
- Late data can restate past totals; say so in the report notes.

</div>

**New words:** *late-arriving dimension*, *early-arriving fact*, *late-arriving fact*, *back-fill*, *inferred member*, *restatement*.
