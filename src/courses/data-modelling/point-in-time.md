---
title: 'Point-in-time questions: "as it was" vs "as it is"'
seoTitle: 'Point in time reporting with SCD type 2 in SQL'
summary: 'One type 2 dimension answers three different questions: the tier a customer had when they bought, the tier they have now, and the tier they had on any date you pick. Write all three in SQL and learn which one a report needs.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'A fact table joined to a type 2 dimension on customer_key gives which view?'
    choices: ['As it is today', 'As it was when each fact happened', 'As of the end of last year']
    ans: 1
    why: The load gave each fact the key of the version valid on its date, so joining on that key reports the attributes as they were at the time.
  - q: 'How do you get "as it is" from a type 2 dimension?'
    choices: ['Join the fact''s version to the same customer''s current row, through the natural (durable) key', 'Join on customer_key and filter is_current = 1', 'It can''t be done']
    ans: 0
    why: Filtering is_current = 1 after joining on customer_key just drops every fact that points at an old version. Step from the version to customer_id, then to the current row.
  - q: 'How many Silver members did Northbay have on 31 March 2025?'
    choices: ['Count rows where loyalty_tier = ''Silver''', 'Count rows where loyalty_tier = ''Silver'' and valid_from <= ''2025-03-31'' < valid_to', 'Count rows where is_current = 1 and loyalty_tier = ''Silver''']
    ans: 1
    why: An "as of" question keeps the one version valid on that date for each customer. All rows would count old and new versions; is_current gives today's count.
sources:
  - 'The Kimball Group, Dimensional Modeling Techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball Group, Design Tip #152 on slowly changing dimension types https://www.kimballgroup.com/2013/02/design-tip-152-slowly-changing-dimension-types-0-4-5-6-7/'
  - 'SQLite documentation, SQL language reference https://www.sqlite.org/lang.html'
---

**Module 5 · about 30 minutes · read first: 5.2.** You'll be able to answer "as it was", "as it is" and "as of a date" questions from one type 2 dimension, and say which one a business question needs.

<div class="bigidea">One type 2 dimension can answer three different questions: what was true then, what is true now, and what was true on a chosen date.</div>

**In everyday terms:** looking at an old photo album. "As it was" shows the photo taken that day. "As it is" shows how everyone looks today. "As of" picks a date and shows the photo from then.

## 1. Why this matters

Once a dimension keeps history, every report has to choose which history to show. "Sales by loyalty tier" can mean the tier at the time of each sale, or the tier the customer has now. A finance report usually needs the first; a marketing team planning next month's Gold campaign usually wants the second. Mixing them up gives numbers that are each correct, but answer a different question from the one asked. Being able to say "which version do you mean?" and then write it is a mark of a senior analyst.

<div class="meaning">

<dl>
<dt>As it was</dt><dd>Join each fact to the version valid when the fact happened (the surrogate key stored on the fact).</dd>
<dt>As it is</dt><dd>Join through the durable key to the current version.</dd>
<dt>As of a date</dt><dd>Pick the version valid on that date for everyone, then group the facts by it.</dd>
<dt>Durable key</dt><dd>A customer key that never changes across versions.</dd>
<dt>Point-in-time</dt><dd>A view of the data at one moment.</dd>
<dt>Physical meaning</dt><dd>The same fact rows are grouped under different dimension rows. Only the join changes; nothing in the tables moves.</dd>
</dl>

</div>

<div class="myth">

**""The current tier" and "the tier then" are the same thing if you join on customer_id."** Joining on the durable key sends every sale to the current version, which is "as it is". "As it was" uses the surrogate key already stored on each fact.

</div>

## 2. Northbay's tier review

On 1 July 2025 Northbay ran a tier review and moved some members up a tier (Bronze to Silver, Silver to Gold). Build a type 2 customer dimension with that history, and a fact table whose keys were looked up by order date, as in [Lesson 5.2](/learn/courses/data-modelling/scd2-by-hand/). (Which members moved is made up for this lesson: every fourth member who is Silver or Gold today.)

```sql
-- noviz
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_customer AS
WITH versions AS (
  SELECT customer_id, first_name || ' ' || last_name AS customer_name,
         CASE loyalty_tier WHEN 'Gold' THEN 'Silver' ELSE 'Bronze' END AS loyalty_tier,
         '1900-01-01' AS valid_from, '2025-07-01' AS valid_to, 0 AS is_current
  FROM customers
  WHERE customer_id % 4 = 0 AND loyalty_tier IN ('Silver', 'Gold')
  UNION ALL
  SELECT customer_id, first_name || ' ' || last_name, loyalty_tier,
         CASE WHEN customer_id % 4 = 0 AND loyalty_tier IN ('Silver', 'Gold') THEN '2025-07-01' ELSE '1900-01-01' END,
         '9999-12-31', 1
  FROM customers
)
SELECT ROW_NUMBER() OVER (ORDER BY customer_id, valid_from) AS customer_key, *
FROM versions;

DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT oi.order_id, o.order_date,
       COALESCE(d.customer_key, -1) AS customer_key,
       ROUND(oi.quantity * oi.unit_price * (1 - oi.discount), 2) AS sales_amount
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
LEFT JOIN dim_customer d
  ON d.customer_id = o.customer_id
 AND o.order_date >= d.valid_from AND o.order_date < d.valid_to
WHERE o.status = 'completed';

SELECT COUNT(*) AS versions, SUM(is_current) AS customers,
       COUNT(*) - SUM(is_current) AS upgraded
FROM dim_customer;
```

650 versions for 603 customers: 47 members were upgraded and so have two rows. Look at one of them:

```sql
-- try
SELECT customer_key, customer_id, customer_name, loyalty_tier, valid_from, valid_to, is_current
FROM dim_customer
WHERE customer_id IN (8, 12)
```

Gurpreet Wilson (customer 8) was Bronze under key 8 until 1 July 2025 and is Silver under key 9 since. Yusuf Ahmed (12) was never upgraded and has one row. Guest sales point at key -1, which has no dimension row in this lesson, so the queries below cover members only.

<!--fig:as-was-as-is-->

## 3. As it was

The fact already stores the key of the version that was true on the order date. So "as it was" is just the ordinary join:

```sql
-- try
SELECT COALESCE(d.loyalty_tier, 'No tier') AS tier_at_time_of_sale,
       ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
GROUP BY tier_at_time_of_sale
ORDER BY sales DESC
```

Bronze $70,430.47, Silver $20,757.14, No tier $10,522.57, Gold $9,606.61. Every sale is filed under the tier the member actually had when they paid. This view never changes after the fact is loaded: a report run today on 2024 sales gives the same answer it gave in 2024. Auditors and finance like that.

## 4. As it is

To report every sale under the member's **current** tier, step from the version the fact points at to the same customer's current version, through the natural key. The natural key is what ties all of a customer's versions together; Kimball calls it the **durable key**. Press **Show how it runs** and watch the second join find the current row.

```sql
-- try
SELECT COALESCE(cur.loyalty_tier, 'No tier') AS tier_now,
       ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d   ON d.customer_key = f.customer_key
JOIN dim_customer cur ON cur.customer_id = d.customer_id AND cur.is_current = 1
GROUP BY tier_now
ORDER BY sales DESC
```

Bronze $66,412.23, Silver $24,286.07, No tier $10,522.57, Gold $10,095.92. Silver gained $3,528.93 and Gold $489.31, all of it bought by members back when they were a tier lower. The total is the same; only the labels moved. This view changes every time someone is upgraded, which is exactly what "as it is" means.

A common mistake is to write "as it is" like this:

```sql
-- try
SELECT COALESCE(d.loyalty_tier, 'No tier') AS tier,
       ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
WHERE d.is_current = 1
GROUP BY tier
ORDER BY sales DESC
```

It looks reasonable, but it **drops** every sale that points at an old version: the upgraded members' sales from before July vanish. Compare the totals: this query's tiers add up to $106,809.24, while the other two both add up to $111,316.79 of member sales. $4,507.55 went missing without an error. Filtering `is_current` belongs on the dimension you step **to**, never on the one the fact points at.

Teams that run many "as it is" reports often add the current value to every version, type 6 style ([Lesson 5.1](/learn/courses/data-modelling/scd-types/)), so the second join isn't needed. A view does the same without changing the table:

```sql
-- noviz
DROP VIEW IF EXISTS dim_customer_t6;
CREATE VIEW dim_customer_t6 AS
SELECT d.*, cur.loyalty_tier AS current_tier
FROM dim_customer d
JOIN dim_customer cur ON cur.customer_id = d.customer_id AND cur.is_current = 1;
```

## 5. As of a date

The third question has nothing to do with sales dates: "what did the membership look like on 31 March 2025?" Keep, for each customer, the one version valid on that date. With half-open ranges that is a single condition:

```sql
-- try
SELECT COALESCE(loyalty_tier, 'No tier') AS tier, COUNT(*) AS members
FROM dim_customer
WHERE valid_from <= '2025-03-31' AND '2025-03-31' < valid_to
GROUP BY tier
ORDER BY members DESC
```

On 31 March 2025: 396 Bronze, 101 Silver, 58 with no tier and 48 Gold, 603 members in all, one row each. Today (`is_current = 1`) the counts are 355 Bronze, 136 Silver, 58 no tier, 54 Gold. An "as of" date can also be applied to facts: "sales for all of 2025, labelled by the tier each member had at year end" joins each fact to the version valid on `'2025-12-31'`. Finance teams use this for year-end segment reports.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a type 2 dimension stores each attribute as a function of two things, the customer and the time. A report fixes the time in one of three ways.

**Equation:** let tier(c, t) be customer c's tier at time t, and let a fact f have customer c(f) and date t(f).
- As it was: label f with tier(c(f), t(f)), the time varies with the fact.
- As it is: label f with tier(c(f), now), the time fixed at today.
- As of T: label with tier(c(f), T), the time fixed at a date you choose. "As it is" is just "as of today".
Each labelling is a partition of the same facts, so all three give the same grand total; only the split between tiers differs. The is_current mistake is not a partition: it keeps only facts with t(f) in the current version's range.

**Analogy:** photos of a school class. "As it was" labels each photo with the pupils' classes in the year it was taken. "As it is" relabels every old photo with the class each pupil is in now. "As of" picks one year's class list and uses it for every photo.

**Try it:** Gurpreet Wilson's order on 2024-12-10: what tier is it under as it was, as it is, and as of 2025-03-31? (Bronze, Silver, Bronze.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>Asha's versions.</b> <table class="lk-tbl"><tr><th>key</th><th>tier</th><th>from</th></tr><tr><td>1</td><td>Silver</td><td>Jan 1</td></tr><tr><td>2</td><td>Gold</td><td>Jul 1</td></tr></table></div>
<div class="step"><b>Her sales.</b> <table class="lk-tbl"><tr><th>sale</th><th>date</th><th>amount</th><th>customer_key</th></tr><tr><td>1</td><td>Mar 5</td><td>50</td><td>1</td></tr><tr><td>2</td><td>Aug 9</td><td>70</td><td>2</td></tr></table></div>
<div class="step"><b>As it was.</b> Follow the key on each sale. <table class="lk-tbl"><tr><th>tier</th><th>total</th></tr><tr><td>Silver</td><td>50</td></tr><tr><td>Gold</td><td>70</td></tr></table></div>
<div class="step"><b>As it is.</b> Join through the durable key to the current row. <table class="lk-tbl"><tr><th>tier</th><th>total</th></tr><tr><td><mark>Gold</mark></td><td><mark>120</mark></td></tr></table> Silver disappears: the old sale is re-labelled.</div>
<div class="step"><b>As of Jun 1.</b> Everyone gets the tier valid on that date, so both sales count as Silver.</div>
</div>

<div class="problem" data-problem="dm-asof-sales"></div>

## 6. Worked example: did the July upgrades pay off?

*Question:* did the 47 upgraded members spend more after the review than before, compared with everyone else?

This needs both views at once: "as it is" (or simply "has more than one version") to pick out **who** was upgraded, and the order date to split **when**.

```sql
-- try
WITH upgraded AS (
  SELECT customer_id FROM dim_customer GROUP BY customer_id HAVING COUNT(*) > 1
)
SELECT CASE WHEN d.customer_id IN (SELECT customer_id FROM upgraded) THEN 'upgraded' ELSE 'others' END AS grp,
       CASE WHEN f.order_date < '2025-07-01' THEN '2025 H1' ELSE '2025 H2' END AS half,
       COUNT(DISTINCT d.customer_id) AS buyers,
       ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
WHERE f.order_date LIKE '2025%'
GROUP BY grp, half
ORDER BY grp, half
```

Upgraded members went from $1,749.89 in the first half of 2025 to $3,122.31 in the second (+78%). Everyone else went from $26,960.82 to $32,047.40 (+19%). The second half is busier for everyone (November and December), which is why the comparison group matters. Be careful before calling it a win: 47 members is a small group, they were not picked at random, and in Northbay's made-up data the review didn't change anyone's behaviour, so some of this gap is plain chance. A real analysis would test whether the gap is bigger than chance. The modelling point stands, though: without the type 2 history you couldn't even tell which sales came before the upgrade.

## 7. Practice

```sql
-- exercise: Show Gurpreet Wilson's (customer_id 8) sales under the tier at the time of sale.
-- hint: Join fact_sales to dim_customer on customer_key, filter d.customer_id = 8, GROUP BY d.loyalty_tier.
SELECT d.loyalty_tier, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_id = 8 AND d.is_current = 1
GROUP BY d.loyalty_tier
-- answer:
SELECT d.loyalty_tier, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
WHERE d.customer_id = 8
GROUP BY d.loyalty_tier
```

```sql
-- exercise: How many members were Gold on 2025-06-30, and how many on 2025-07-01? Return two rows: the date and the count.
-- hint: Two SELECTs joined with UNION ALL, each counting Gold rows valid on its date (valid_from <= date AND date < valid_to).
SELECT '2025-06-30' AS on_date, COUNT(*) AS gold
FROM dim_customer
WHERE loyalty_tier = 'Gold'
-- answer:
SELECT '2025-06-30' AS on_date, COUNT(*) AS gold
FROM dim_customer
WHERE loyalty_tier = 'Gold' AND valid_from <= '2025-06-30' AND '2025-06-30' < valid_to
UNION ALL
SELECT '2025-07-01', COUNT(*)
FROM dim_customer
WHERE loyalty_tier = 'Gold' AND valid_from <= '2025-07-01' AND '2025-07-01' < valid_to
```

```sql
-- exercise: Using the dim_customer_t6 view, show 2024 sales split by tier at the time and current tier, with members only. Order by sales, biggest first.
-- hint: Join fact_sales to dim_customer_t6 on customer_key, filter order_date LIKE '2024%', GROUP BY loyalty_tier and current_tier. Use COALESCE for members with no tier.
SELECT COALESCE(d.current_tier, 'No tier') AS tier_now, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer_t6 d ON d.customer_key = f.customer_key
WHERE f.order_date LIKE '2024%'
GROUP BY tier_now
-- answer:
SELECT COALESCE(d.loyalty_tier, 'No tier') AS tier_then,
       COALESCE(d.current_tier, 'No tier') AS tier_now,
       ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer_t6 d ON d.customer_key = f.customer_key
WHERE f.order_date LIKE '2024%'
GROUP BY tier_then, tier_now
ORDER BY sales DESC
```

**Try it on your own data:** load a history table into [[sql-playground]] and try the three questions with your own valid_from and valid_to columns.

<div class="keypoints">

- "As it was" follows the surrogate key stored on the fact.
- "As it is" joins through the durable key to the current row.
- "As of" fixes one date for everybody.
- Name the question before choosing the join.

</div>

**New words:** *as it was*, *as it is*, *as of*, *durable key*, *point-in-time*.
