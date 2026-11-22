---
title: 'Additive, semi-additive and non-additive measures'
seoTitle: 'Additive vs semi-additive vs non-additive measures'
summary: 'Some numbers add up across everything, some across everything but time, and some never. Spot the three kinds on Northbay data and dodge the classic traps: averages of averages, summed distinct counts and summed balances.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: Members on file at month end can be added across provinces but not across months. What kind of measure is it?
    choices: ['Semi-additive', 'Additive', 'Non-additive']
    ans: 0
    why: It is a level (a balance). Adding provinces in the same month is fine; adding months counts the same people again.
  - q: 'Monthly distinct customers in 2025 add up to far more than the distinct customers for the year. Why?'
    choices: ['Customers who bought in several months are counted once per month', 'Some months are missing', 'COUNT DISTINCT is broken']
    ans: 0
    why: Distinct counts are non-additive. The months overlap in people, so their sum double counts repeat customers.
  - q: What should a fact table store so a margin % can be worked out correctly at any level?
    choices: ['The additive parts: sales amount and cost amount', 'The margin % on each row', 'Only the margin %, averaged']
    ans: 0
    why: Store numerator and denominator as additive facts, and divide the sums at report time. A stored percentage can't be added or averaged correctly.
sources:
  - 'Kimball Group, Dimensional modeling techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 4: Inventory (semi-additive facts)'
  - 'Microsoft Learn, DAX: LASTNONBLANK function https://learn.microsoft.com/en-us/dax/lastnonblank-function-dax'
---

**Module 3 · about 30 minutes · read first: 3.2.** You'll be able to classify any measure as additive, semi-additive or non-additive, total each kind correctly, and avoid averages of averages, summed distinct counts and summed balances.

<div class="bigidea">Only some numbers can be added up: sales add along everything, balances add across places but not across time, and ratios, averages and distinct counts never add.</div>

**In everyday terms:** a car journey. Kilometres driven each day add up to the trip. The fuel gauge each evening does not: adding five evening readings is meaningless. Your average speed each day cannot be averaged either, because the days were different lengths.

## 1. Why this matters

A BI tool will happily sum any number you drag into a visual. Whether that sum means anything depends on the measure. Most wrong dashboards come from three habits: averaging averages, adding distinct counts, and adding balances over time. Modellers prevent them by storing the right facts and marking which measures may be summed along which dimensions. In Power BI, this is the difference between a column you sum and a DAX measure you write with care.

## 2. Three kinds of measure

- An *additive* measure can be summed along **every** dimension: sales amount, quantity, cost. Sales by store add to sales by region add to total sales; days add to months.
- A *semi-additive* measure can be summed along **some** dimensions but not time: balances and levels, such as stock on hand, account balance or members on file. Adding provinces in the same month is fine; adding months is not.
- A *non-additive* measure can't be summed along **any** dimension: ratios, percentages, averages, unit prices and distinct counts.

Build a small fact table and a monthly membership snapshot to test each kind:

```sql
-- try
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT o.order_date, CAST(strftime('%Y', o.order_date) AS INTEGER) AS year, strftime('%Y-%m', o.order_date) AS month,
       o.store_id AS store_key, o.customer_id AS customer_key, c.department, i.order_id, i.quantity,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount,
       ROUND(i.quantity * p.unit_cost, 2) AS cost_amount
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed';
DROP TABLE IF EXISTS snap_members;
CREATE TABLE snap_members AS
WITH RECURSIVE months(m) AS (SELECT '2025-01-01' UNION ALL SELECT date(m, '+1 month') FROM months WHERE m < '2025-12-01')
SELECT strftime('%Y-%m', m) AS month, c.province, COUNT(*) AS members_at_month_end
FROM months
JOIN customers c ON c.joined_on <= date(m, '+1 month', '-1 day')
GROUP BY month, c.province;
SELECT * FROM snap_members WHERE month IN ('2025-01', '2025-12') ORDER BY month, province;
```

Tap a value in one or two dimensions and watch the fact rows light up.

<figure class="fig" data-fig="@data-star-slice"><figcaption>Notice that the filter is on the dimension but the numbers come from the fact table.</figcaption></figure>


## 3. Additive: sum along anything

Sales by store, summed, equals total sales. So do sales by month, by department, by customer. Check one:

```sql
-- try
SELECT (SELECT ROUND(SUM(s), 2) FROM (SELECT SUM(sales_amount) AS s FROM fact_sales GROUP BY store_key)) AS sum_of_store_totals,
       (SELECT ROUND(SUM(s), 2) FROM (SELECT SUM(sales_amount) AS s FROM fact_sales GROUP BY month)) AS sum_of_month_totals,
       ROUND(SUM(sales_amount), 2) AS grand_total
FROM fact_sales
```

All three match. Additive facts are the friendliest: any slice, any roll-up, plain SUM. That's why earlier lessons stored amounts rather than prices and rates.

## 4. Semi-additive: not across time

Members on file at month end, per province. Across provinces, in one month, adding is fine: it gives Northbay's total members that month. Across months, adding counts the same people over and over:

```sql
-- try
SELECT province,
       SUM(members_at_month_end) AS wrong_sum_over_2025,
       MAX(CASE WHEN month = '2025-12' THEN members_at_month_end END) AS at_year_end,
       ROUND(AVG(members_at_month_end), 1) AS monthly_average
FROM snap_members
GROUP BY province
ORDER BY province
```

Ontario ends 2025 with 372 members and averages 340.2 over the year, but the sum says 4,082, more than six times all the people Northbay has ever signed up. For a level over time, use the **last** value (members at year end) or the **average** (typical members during the year), never the sum. In Power BI, measures like this use LASTNONBLANK or a similar time function; in SQL, pick the last period with a CASE or a window function.

## 5. Non-additive trap 1: the average of averages

A report shows the average order line value for each department, and someone adds a "total" row by averaging the four averages:

```sql
-- try
WITH per_dept AS (
  SELECT department, COUNT(*) AS lines, AVG(sales_amount) AS avg_line
  FROM fact_sales GROUP BY department
)
SELECT department, lines, ROUND(avg_line, 2) AS avg_line_value FROM per_dept
UNION ALL
SELECT 'Average of the 4 averages', SUM(lines), ROUND(AVG(avg_line), 2) FROM per_dept
UNION ALL
SELECT 'True average line', COUNT(*), ROUND(SUM(sales_amount) / COUNT(*), 2) FROM fact_sales
```

The average of averages says $35.41; the true average line is $17.80, half as much. Averaging the four numbers gives each department an equal vote, so Tech's 377 lines count as much as Grocery's 5,139. The true figure is a ratio of sums: total sales ÷ total lines. (Averages of averages only come out right when every group has the same count, which in real data is almost never.)

## 6. Non-additive trap 2: distinct counts

How many different customers bought something in 2025? Adding the monthly counts is quick and wrong:

```sql
-- try
SELECT (SELECT SUM(n) FROM (SELECT COUNT(DISTINCT customer_key) AS n FROM fact_sales WHERE year = 2025 GROUP BY month)) AS sum_of_monthly_distincts,
       COUNT(DISTINCT customer_key) AS distinct_customers_2025
FROM fact_sales
WHERE year = 2025
```

The months add up to 1,698, but only 583 different customers bought in 2025. A customer who bought in five months is counted five times in the sum. Distinct counts must be recounted from the atomic rows at every level you report. That's one more reason to keep the atomic grain: a monthly summary table can't give you the yearly distinct count.

<div class="meaning">

<dl>
<dt>Additive</dt><dd>Can be summed along every dimension: sales amount, quantity, cost.</dd>
<dt>Semi-additive</dt><dd>Can be summed along some dimensions but not time: balances, stock, members on file.</dd>
<dt>Non-additive</dt><dd>Cannot be summed along any dimension: ratios, percentages, averages, prices, distinct counts.</dd>
<dt>Ratio of sums</dt><dd>The right way to roll up a rate: SUM(numerator) ÷ SUM(denominator).</dd>
<dt>Physical meaning</dt><dd>SUM gives the right total only when the parts do not overlap and the measure behaves like a count of money or things. For levels the same people appear in every month; for distinct counts the same customer appears in many groups.</dd>
</dl>

</div>

<div class="myth">

**"The total of a column of averages is their average."** Each group gets an equal vote, so Tech's 377 lines count as much as Grocery's 5,139: $35.41 instead of the true $17.80. Divide total sales by total lines.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>Groups.</b> <table class="lk-tbl"><tr><th>dept</th><th>lines</th><th>sales</th><th>avg</th></tr><tr><td>Grocery</td><td>9</td><td>90</td><td>10</td></tr><tr><td>Tech</td><td>1</td><td>50</td><td>50</td></tr></table></div>
<div class="step"><b>Average of averages.</b> (10 + 50) ÷ 2 = <mark>30</mark>. Wrong: Tech has one line.</div>
<div class="step"><b>Ratio of sums.</b> <table class="lk-tbl"><tr><th>sales</th><th>lines</th><th>avg line</th></tr><tr><td>140</td><td>10</td><td><mark>14</mark></td></tr></table></div>
<div class="step"><b>Distinct counts.</b> <table class="lk-tbl"><tr><th>month</th><th>customers</th></tr><tr><td>Jan</td><td>A, B</td></tr><tr><td>Feb</td><td>B, C</td></tr></table> Sum of months 4; different customers <mark>3</mark>.</div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-avg-of-avgs"></div>

<div class="problem" data-problem="dm-distinct-sum"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a measure is additive along a dimension when it behaves like a sum: the total for a group equals the sum of the totals of its parts.

**Equation:** for disjoint slices A and B, an additive measure m has m(A ∪ B) = m(A) + m(B), the defining property of a linear (additive) function. SUM has it. COUNT DISTINCT breaks it: |X ∪ Y| = |X| + |Y| − |X ∩ Y|, and the overlap term is the repeat customers. AVG breaks it: avg(A ∪ B) = (Σ_A + Σ_B) ÷ (n_A + n_B), a weighted average, not avg(A) + avg(B), nor their plain mean. A level L is additive across provinces (disjoint people) but not across months (the same people appear in each month).

**Analogy:** money in jars is additive. The number of different coin designs in each jar isn't: two jars of 10 designs each might hold 12 designs between them.

**Try it:** January has 100 buyers, February 80, and 30 bought in both. How many distinct buyers in the two months? (100 + 80 − 30 = 150.)
</details>

## 7. Worked example: margin % done right

*Question:* what was Northbay's gross margin % in each year?

```sql
-- try
SELECT year,
       ROUND(SUM(sales_amount), 2) AS sales,
       ROUND(SUM(cost_amount), 2) AS cost,
       ROUND(100.0 * (SUM(sales_amount) - SUM(cost_amount)) / SUM(sales_amount), 1) AS margin_pct,
       ROUND(AVG(100.0 * (sales_amount - cost_amount) / sales_amount), 1) AS avg_of_line_margin_pct
FROM fact_sales
GROUP BY year
```

1. `sales` and `cost` are additive, so the yearly sums are safe.
2. `margin_pct` divides the sums: the correct, money-weighted margin.
3. `avg_of_line_margin_pct` averages each line's percentage, so a $3 bag of chips weighs as much as a $90 duvet. It says 34.4% for 2024 instead of the true 40.6%: six points out, because low-margin grocery lines are many but small.
4. The modelling rule: store numerators and denominators as additive facts; never store a ratio you'll need to roll up.

## 8. Practice

```sql
-- exercise: Show the true average order value per year: SUM(sales_amount) / COUNT(DISTINCT order_id), rounded to 2 decimals.
-- hint: GROUP BY year. Divide the sums inside each year, don't average per-store values.
SELECT year, ROUND(AVG(sales_amount), 2) AS aov
FROM fact_sales
GROUP BY year
-- answer:
SELECT year, ROUND(SUM(sales_amount) / COUNT(DISTINCT order_id), 2) AS aov
FROM fact_sales
GROUP BY year
```

```sql
-- exercise: How many distinct customers (ignore guests) bought from each store in 2025? Show store_key and the count, store_key in order. (Add the counts up in your head: the total is far more than the 583 who bought anywhere.)
-- hint: COUNT(DISTINCT customer_key) counts non-NULL keys only, so guests drop out by themselves. GROUP BY store_key.
SELECT store_key, COUNT(*) AS lines
FROM fact_sales
WHERE year = 2025
GROUP BY store_key
-- answer:
SELECT store_key, COUNT(DISTINCT customer_key) AS customers
FROM fact_sales
WHERE year = 2025
GROUP BY store_key
ORDER BY store_key
```

```sql
-- exercise: From snap_members, show Northbay's total members at the end of each month of 2025 (summing provinces is fine within a month), in month order.
-- hint: GROUP BY month and SUM(members_at_month_end): that sum is across provinces only.
SELECT SUM(members_at_month_end) AS members
FROM snap_members
-- answer:
SELECT month, SUM(members_at_month_end) AS members
FROM snap_members
GROUP BY month
ORDER BY month
```

**Try it on your own data:** [[grouped-data-stats]] shows how a mean worked out from groups differs from the mean of the raw values.

<div class="keypoints">

- Additive measures (amounts, quantities) sum along any dimension.
- Semi-additive measures (levels, balances) sum across places, not time: take the last value or an average.
- Non-additive measures (ratios, averages, distinct counts) must be recomputed at each level.
- Store numerators and denominators as additive facts, never the ratio.
- Distinct counts need the atomic rows, another reason to keep the atomic grain.

</div>

**New words:** *additive*, *semi-additive*, *non-additive*, *average of averages*, *ratio of sums*.
