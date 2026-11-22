---
title: 'COUNT DISTINCT and counting the right thing'
seoTitle: 'SQL COUNT DISTINCT explained: counting unique values'
summary: 'COUNT(*) counts rows, COUNT(DISTINCT x) counts different values. Learn which one a question needs, why distinct counts never add up across groups, and how messy values inflate them.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'In orders, what does COUNT(DISTINCT customer_id) count?'
    choices: ['Orders', 'Different customers who ordered', 'Guest orders']
    ans: 1
    why: Each customer number is counted once, however many orders it has. NULLs (guests) are not counted.
  - q: 561 customers ordered in 2024 and 584 in 2025. How many ordered in 2024 or 2025?
    choices: ['1,145', 'Somewhere between 584 and 1,145; you must count it', '584']
    ans: 1
    why: Many customers ordered in both years and would be counted twice. Distinct counts don't add up across groups; you count again over the combined rows (it is 600).
  - q: 'Why can COUNT(DISTINCT city) be too high?'
    choices: ['Values that look the same differ by spaces or capitals', 'DISTINCT counts NULL as a city', 'It counts rows, not values']
    ans: 0
    why: '''Ottawa'' and ''Ottawa '' are different values. Clean first, e.g. COUNT(DISTINCT TRIM(city)).'
sources:
  - 'SQLite documentation, Built-in Aggregate Functions (count with DISTINCT) https://www.sqlite.org/lang_aggfunc.html'
  - 'Microsoft Learn, COUNT (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/functions/count-transact-sql'
  - 'Kimball Group, Additive, Semi-Additive, and Non-Additive Facts https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/additive-semi-additive-non-additive-fact/'
---

**Module 3 · about 25 minutes · read first: 3.3.** You'll be able to choose between counting rows and counting different values, explain why distinct counts don't add up, and spot values that are only *nearly* the same.

<div class="bigidea">COUNT(*) counts rows, COUNT(DISTINCT x) counts different values, and distinct counts from separate groups never add up to the whole.</div>

**In everyday terms:** a gym. Counting visits is COUNT(*); counting members who came is COUNT(DISTINCT member). Monday's members plus Tuesday's members overcounts everyone who came on both days.

## 1. Why this matters

"How many customers did we have last month?" sounds simple, but `COUNT(*)` on orders gives orders, not customers, and the two can differ by a factor of six. Active customers, unique visitors and products sold are all distinct counts, and they are among the most reported (and most misreported) numbers in any business.

## 2. Rows vs different values

- `COUNT(*)` counts rows.
- `COUNT(x)` counts rows where x is not NULL.
- `COUNT(DISTINCT x)` counts the different non-NULL values of x.

```sql
-- try
SELECT COUNT(*) AS orders,
       COUNT(customer_id) AS orders_with_customer,
       COUNT(DISTINCT customer_id) AS customers
FROM mini_orders
```

Six orders, but only four different customers (1, 2, 3 and 9), because customers 1 and 3 ordered twice. Press **Show how it runs** and look at the customer_id column: count the different numbers yourself.

## 3. The same question on Northbay

```sql
-- try
SELECT COUNT(*) AS orders,
       COUNT(customer_id) AS member_orders,
       COUNT(DISTINCT customer_id) AS customers_who_ordered
FROM orders
```

4,064 orders, of which 3,582 were by members, placed by 600 different members. On average a member placed 3,582 / 600 ≈ 6 orders over the two years.

Pick the count that matches the noun in the question: "how many **orders**" is COUNT(*); "how many **customers**" is COUNT(DISTINCT customer_id).

<div class="meaning">

<dl>
<dt>COUNT(*)</dt><dd>Number of rows (orders, visits, lines).</dd>
<dt>COUNT(DISTINCT x)</dt><dd>Number of different non-NULL values of x (customers, products).</dd>
<dt>Additive</dt><dd>A number you can add across groups: row counts, sums.</dd>
<dt>Non-additive</dt><dd>A number you cannot add across groups: distinct counts, averages.</dd>
<dt>Physical meaning</dt><dd>COUNT(DISTINCT) puts each value through a sieve that lets it pass only once, then counts what passed. Someone who appears in two groups passes once in each group but only once overall.</dd>
</dl>

</div>

<div class="myth">

**"Customers in 2024 plus customers in 2025 is how many customers we had."** Anyone who bought in both years is counted twice. 561 + 584 = 1,145, but only 600 customers ordered at all. Never add distinct counts; count again over the combined rows.

</div>

Watch it happen, one step at a time (press **Show how it runs** on any live box to see real rows):

<div class="steps">
<div class="step"><b>Orders in two months.</b> <table class="lk-tbl"><tr><th>month</th><th>customer</th></tr><tr><td>Jan</td><td>Asha</td></tr><tr><td>Jan</td><td>Ben</td></tr><tr><td>Jan</td><td>Asha</td></tr><tr><td>Feb</td><td>Ben</td></tr><tr><td>Feb</td><td>Chen</td></tr></table></div>
<div class="step"><b>COUNT(*) per month.</b> Jan 3, Feb 2. These add up: 3 + 2 = 5 orders.</div>
<div class="step"><b>COUNT(DISTINCT customer) per month.</b> Jan {Asha, Ben} = 2, Feb {Ben, Chen} = 2. <table class="lk-tbl"><tr><th>month</th><th>customers</th></tr><tr><td>Jan</td><td><mark>2</mark></td></tr><tr><td>Feb</td><td><mark>2</mark></td></tr></table></div>
<div class="step"><b>Over both months.</b> {Asha, Ben, Chen} = 3, not 2 + 2 = 4. Ben is in both months, so adding counts him twice.</div>
</div>

<div class="problem" data-problem="sql-distinct-overlap"></div>

## 4. Distinct counts don't add up

Count customers per year:

```sql
-- try
SELECT strftime('%Y', order_date) AS year,
       COUNT(*) AS orders,
       COUNT(DISTINCT customer_id) AS customers
FROM orders
GROUP BY strftime('%Y', order_date)
```

The orders column adds up: 1,801 + 2,263 = 4,064. The customers column doesn't: 561 + 584 = 1,145, but only 600 customers exist. Anyone who ordered in both years is counted once in each year. The same happens with channels:

```sql
-- try
SELECT channel, COUNT(DISTINCT customer_id) AS customers
FROM orders
GROUP BY channel
```

482 + 594 = 1,076 again overshoots 600, because many people shop both online and in store. **Never add up distinct counts** from different groups; count again over the combined rows. In Power BI and Tableau, this is why "distinct count" totals at the bottom of a table often look smaller than the sum of the rows above: they're right.

## 5. Nearly the same is not the same

DISTINCT compares values exactly. Spaces and capitals make new values:

```sql
-- try
SELECT COUNT(DISTINCT city) AS raw_cities,
       COUNT(DISTINCT TRIM(city)) AS clean_cities
FROM customers
```

22 "cities" before trimming, 11 after. The three customers who signed up twice used their email in capitals:

```sql
-- try
SELECT COUNT(email) AS emails,
       COUNT(DISTINCT email) AS distinct_emails,
       COUNT(DISTINCT LOWER(email)) AS distinct_people
FROM customers
```

566 distinct emails, but only 563 once capitals are ignored. Cleaning before counting is so common that Module 7 spends two lessons on it.

The opposite trap: don't count *people* by name. There are 603 customer rows but only 486 different first-and-last-name pairs, because different people share names. Count by the key (customer_id) or something truly unique (email), not by a label.

## 6. DISTINCT inside other aggregates

DISTINCT works in SUM and AVG too, but it is rarely what you want there: `SUM(DISTINCT amount)` adds each different amount once, so two $45 Kettles count as one $45.

```sql
-- try
SELECT SUM(amount) AS total, SUM(DISTINCT amount) AS distinct_total
FROM mini_orders
```

265 vs 220. If you find yourself reaching for SUM(DISTINCT ...), the real problem is usually duplicated rows from a join (Lesson 4.5).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** COUNT(*) is the size of a *bag* (repeats count); COUNT(DISTINCT x) is the size of a *set* (each value once). The set of values in a column is δ(π<sub>x</sub>(T)), and its size is the column's *cardinality*.

**Equation:** row counts are additive over a partition: |A ∪ B| = |A| + |B| when A and B share no rows. Distinct counts are not: for the sets of customers, |A ∪ B| = |A| + |B| − |A ∩ B|. With 2024 and 2025: 600 = 561 + 584 − |both|, so 545 customers ordered in both years.

**Analogy:** counting visits to a gym vs counting members who visited. Monday's members plus Tuesday's members overcounts anyone who came both days. It breaks down a little with NULL: COUNT(DISTINCT) ignores NULL, while SELECT DISTINCT keeps one NULL row.

**Try it:** online 482 customers, store 594, total 600. How many shopped both ways? (482 + 594 − 600 = 476.)
</details>

## 7. Worked example

*Question:* how many returns were there, on how many different orders, and how many different products?

1. Rows: `COUNT(*)` over returns.
2. Orders: `COUNT(DISTINCT order_id)`.
3. Products: `COUNT(DISTINCT product_id)`.

```sql
-- try
SELECT COUNT(*) AS returned_lines,
       COUNT(DISTINCT order_id) AS orders_with_a_return,
       COUNT(DISTINCT product_id) AS products_returned
FROM returns
```

4. 204 returned lines on **201** orders, so 3 orders had two products sent back. If the question is "what share of orders had a return?", the top of the fraction is 201, not 204. Saying 204 would overstate it slightly; on bigger data the gap can be large.

## 8. Practice

```sql
-- exercise: How many different products have ever been ordered? Return one number.
-- hint: COUNT(DISTINCT product_id) FROM order_items.
SELECT COUNT(product_id) AS products
FROM order_items
-- answer:
SELECT COUNT(DISTINCT product_id) AS products
FROM order_items
```

```sql
-- exercise: For each store_id, count the different customers who ordered there. Show the top 3 stores by that number.
-- hint: GROUP BY store_id, COUNT(DISTINCT customer_id), ORDER BY ... DESC, LIMIT 3.
SELECT store_id, COUNT(*) AS customers
FROM orders
GROUP BY store_id
ORDER BY customers DESC
LIMIT 3
-- answer:
SELECT store_id, COUNT(DISTINCT customer_id) AS customers
FROM orders
GROUP BY store_id
ORDER BY customers DESC
LIMIT 3
```

```sql
-- exercise: In how many different months (year and month) did Northbay take orders? Use strftime('%Y-%m', order_date).
-- hint: COUNT(DISTINCT strftime('%Y-%m', order_date)).
SELECT COUNT(DISTINCT strftime('%m', order_date)) AS months
FROM orders
-- answer:
SELECT COUNT(DISTINCT strftime('%Y-%m', order_date)) AS months
FROM orders
```

<div class="keypoints">

- Match the count to the noun: "how many orders" is COUNT(*); "how many customers" is COUNT(DISTINCT customer_id).
- COUNT(DISTINCT x) ignores NULLs.
- Distinct counts don't add up across groups; overlap = sum of parts − whole.
- Clean before counting: trailing spaces and capitals make new "different" values.
- Count people by a key, not by a name; SUM(DISTINCT) is almost never what you want.

</div>

**New words:** *COUNT DISTINCT*, *cardinality*, *additive*, *non-additive*, *inclusion-exclusion*.
