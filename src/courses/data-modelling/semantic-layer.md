---
title: 'The semantic layer and the Power BI star schema'
seoTitle: 'Power BI star schema and the semantic layer explained'
summary: 'A semantic layer turns warehouse tables into business names, relationships and measures that every report shares. Learn what Power BI expects from your model (a star, one-to-many relationships filtering one way, explicit measures, one date table per role) and check a Northbay star is ready for it in live SQL.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: In a Power BI star, which way should a relationship normally filter?
    choices: ['From the fact table to the dimension', 'From the dimension (the "one" side) to the fact (the "many" side), in one direction', 'Both ways, always']
    ans: 1
    why: Picking a department in a slicer filters the product dimension, which filters the fact rows. Microsoft's guidance is to keep bi-directional relationships to a minimum because they can slow models down and confuse users.
  - q: Why define Average order value as a measure (total sales ÷ distinct orders) instead of averaging a column?
    choices: ['Measures look nicer', 'An average of line amounts is a different number; a measure computes the ratio correctly for whatever filter is applied', 'Columns cannot be averaged']
    ans: 1
    why: Ratios are not additive. A measure recomputes the numerator and denominator for each cell of the report, so it is right at every level.
  - q: The fact has an order date and a return date. What does Microsoft recommend for Power BI?
    choices: ['One date table with two active relationships', 'A separate date table per role (Date, Return Date), each with its own active relationship', 'No date table']
    ans: 1
    why: Only one relationship between two tables can be active. Role-playing copies of the date table make each date usable directly in visuals.
sources:
  - 'Microsoft Learn, Understand star schema and the importance for Power BI https://learn.microsoft.com/en-us/power-bi/guidance/star-schema'
  - 'Microsoft Learn, Data Analysis Expressions (DAX) reference https://learn.microsoft.com/en-us/dax/'
  - 'The Kimball Group, Dimensional Modeling Techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
---

**Module 7 · about 30 minutes · read first: 7.4.** You'll be able to explain what a semantic layer is, describe the star schema Power BI works best with, write measures that stay correct under any filter, and run the checks that tell you a star is ready for a report.

<div class="bigidea">A semantic layer sits on top of the star and defines the relationships and measures once, so every report uses the same numbers.</div>

**In everyday terms:** a menu on top of the kitchen. Customers pick "margin" from the menu; they do not need to know which ingredients went into it.

## 1. Why this matters

Most analysts never query the warehouse directly: they open Power BI, Tableau or Looker, which sit on a **semantic layer**. If the model under that layer is a clean star, reports are fast and numbers agree. If it is a pile of flat files joined every which way, you get slow reports, circular relationships and totals that change depending on which visual you look at. BI developer interviews almost always ask "how would you model this for Power BI?"

<div class="meaning">

<dl>
<dt>Semantic layer</dt><dd>The shared definitions of tables, relationships and measures that reports use.</dd>
<dt>Measure</dt><dd>A calculation done at report time, such as SUM(sales).</dd>
<dt>Filter context</dt><dd>The filters a slicer or chart puts on the data before a measure runs.</dd>
<dt>Active relationship</dt><dd>The one relationship used by default between two tables.</dd>
<dt>Row-level security</dt><dd>Rules that show each person only their rows.</dd>
<dt>Physical meaning</dt><dd>The layer stores no extra rows. It stores definitions, and recalculates the measure for whatever filters apply.</dd>
</dl>

</div>

<div class="myth">

**"A margin % can be stored per row and averaged."** An average of row percentages gives wrong results. Store profit and sales, then divide the sums in the measure.

</div>

## 2. What a semantic layer is

A **semantic layer** is a model that sits between the warehouse and the reports and holds, in one place:

- **business names** for tables and columns ("Sales", not `fact_sales.sales_amount`);
- **relationships** between tables, so tools know how to join them;
- **measures**: named calculations such as Total Sales or Average Order Value, defined once and reused by every report;
- **hierarchies** (Year → Month → Day) and formats;
- **security**, such as row-level security (a store manager sees only their store).

Examples: a Power BI **semantic model** (called a dataset until 2023), dbt's Semantic Layer, Looker's LookML, Cube. The star schema you have built in this course is what each of them wants to sit on.

## 3. What Power BI wants

Microsoft's own modelling guidance is plain about it ([Understand star schema and the importance for Power BI](https://learn.microsoft.com/en-us/power-bi/guidance/star-schema) and [bi-directional relationship guidance](https://learn.microsoft.com/en-us/power-bi/guidance/relationships-bidirectional-filtering), checked 22 Nov 2026, check the official page). In short:

1. **A star.** Keep dimension tables and fact tables separate; don't mix the two kinds in one table.
2. **One-to-many relationships.** The "one" side is the dimension (each key once), the "many" side is the fact.
3. **Single-direction filters.** Filters flow from dimension to fact. Microsoft recommends using bi-directional relationships as little as possible: they can slow queries and confuse report users.
4. **One active relationship between two tables.** For an order date and a return date, use a separate date table per role.
5. **Explicit measures** for anything that should not simply be summed (prices, ratios, averages), with the raw column hidden.
6. **SCD2 is built in the warehouse.** Power Query can't produce a type 2 dimension itself, but a model can load one the warehouse already built.

So the work in this course (stars, surrogate keys, conformed and role-playing dimensions, SCD2) is exactly the preparation Power BI needs. The [Power BI course](/learn/courses/power-bi/) picks up from here with the report side.

## 4. Build the model to hand over

A small Northbay star: a full date table, products, customers (with the -1 Unknown member), sales at order-line grain, and returns with two dates.

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
DROP TABLE IF EXISTS fact_returns;
DROP TABLE IF EXISTS dim_date;
DROP TABLE IF EXISTS dim_product;
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_date AS
WITH RECURSIVE d(day) AS (SELECT '2024-01-01' UNION ALL SELECT date(day, '+1 day') FROM d WHERE day < '2025-12-31')
SELECT CAST(replace(day, '-', '') AS INTEGER) AS date_key, day AS full_date,
       CAST(strftime('%Y', day) AS INTEGER) AS year, CAST(strftime('%m', day) AS INTEGER) AS month
FROM d;
CREATE TABLE dim_product AS
SELECT p.product_id AS product_key, p.product_name, c.category_name, c.department, p.unit_price AS list_price
FROM products p JOIN categories c ON c.category_id = p.category_id;
CREATE TABLE dim_customer AS
SELECT -1 AS customer_key, 'Guest' AS customer_name, 'Unknown' AS loyalty_tier
UNION ALL SELECT customer_id, first_name || ' ' || last_name, COALESCE(loyalty_tier, 'None') FROM customers;
CREATE TABLE fact_sales AS
SELECT o.order_id, CAST(replace(o.order_date, '-', '') AS INTEGER) AS date_key, i.product_id AS product_key,
       COALESCE(o.customer_id, -1) AS customer_key, i.quantity,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed';
CREATE TABLE fact_returns AS
SELECT r.return_id, r.product_id AS product_key,
       CAST(replace(o.order_date, '-', '') AS INTEGER) AS order_date_key,
       CAST(replace(r.return_date, '-', '') AS INTEGER) AS return_date_key, r.reason
FROM returns r JOIN orders o ON o.order_id = r.order_id;
SELECT (SELECT COUNT(*) FROM dim_date) AS dates, (SELECT COUNT(*) FROM fact_sales) AS sales_rows,
       (SELECT COUNT(*) FROM fact_returns) AS return_rows
```

731 dates (every day of 2024 and 2025, with no gaps, as Power BI's time intelligence needs), 7,112 sales lines and 204 returns.

## 5. Check the relationships are one-to-many

Before a model goes to Power BI, prove each dimension key is unique and each fact key is found. If the "one" side has duplicates, Power BI either refuses the relationship or makes it many-to-many, and totals break.

```sql
-- try
SELECT 'dim_product' AS dim, COUNT(*) AS rows, COUNT(DISTINCT product_key) AS distinct_keys FROM dim_product
UNION ALL SELECT 'dim_customer', COUNT(*), COUNT(DISTINCT customer_key) FROM dim_customer
UNION ALL SELECT 'dim_date', COUNT(*), COUNT(DISTINCT date_key) FROM dim_date
```

Rows equal distinct keys in each: three clean one-to-many relationships. (Lesson [7.4](/learn/courses/data-modelling/testing/) has the full set of tests.)

## 6. How a filter flows: slicers are WHERE, measures are aggregates

When a report user picks **Year = 2025** in a slicer and drops **Department** and **Total Sales** into a table, Power BI does what this SQL does: the filter lands on the dimension, flows one way along the relationship to the fact, and the measure is computed over the fact rows that survive.

```sql
-- try
SELECT p.department, ROUND(SUM(f.sales_amount), 2) AS total_sales
FROM fact_sales f
JOIN dim_date d    ON d.date_key = f.date_key         -- slicer: Year = 2025
JOIN dim_product p ON p.product_key = f.product_key   -- rows of the visual
WHERE d.year = 2025
GROUP BY p.department
ORDER BY total_sales DESC
```

Each cell of the visual is one group here. The set of filters that applies to a cell is called its **filter context**. A measure is just a calculation that is re-evaluated in every filter context.

## 7. Measures that stay right: ratios

**Average order value** is total sales ÷ number of orders. Averaging the line amounts gives a different, wrong answer, because an order has several lines:

```sql
-- try
SELECT c.loyalty_tier,
       ROUND(SUM(f.sales_amount) / COUNT(DISTINCT f.order_id), 2) AS avg_order_value,
       ROUND(AVG(f.sales_amount), 2) AS avg_line_amount_wrong
FROM fact_sales f
JOIN dim_customer c ON c.customer_key = f.customer_key
WHERE c.customer_key <> -1
GROUP BY c.loyalty_tier
ORDER BY c.loyalty_tier
```

Bronze: $32.05 per order, but the average line is only $17.73. In Power BI the right version is an explicit DAX measure, defined once:

```text
Total Sales = SUM ( 'Sales'[Sales Amount] )
Orders = DISTINCTCOUNT ( 'Sales'[Order ID] )
Average Order Value = DIVIDE ( [Total Sales], [Orders] )
```

Hide the raw Sales Amount column and every report uses the measures. The same applies to `list_price` in dim_product: a price should never be summed, so it gets a measure (such as an average) and the column is hidden.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** sums are **additive**: the total of the parts equals the sum over all rows, so a total line can simply add the cells. Ratios are not: the ratio of totals is not the sum (or average) of ratios. A measure must recompute numerator and denominator in each filter context, then divide.

**Equation:** AOV = Σ sales ÷ |distinct orders|. For two groups, AOV_total = (S₁ + S₂) ÷ (n₁ + n₂), which is a weighted average of AOV₁ and AOV₂ with weights n₁ and n₂, not their plain average. Power BI's DIVIDE does this in each context; summing an AOV column would not.

**Analogy:** two classes' average marks. The school's average isn't the mean of the two class averages unless both classes have the same number of pupils.

**Try it:** group A has $300 over 10 orders, group B $100 over 2 orders. What is the overall AOV? ($400 ÷ 12 ≈ $33.33, not the mean of $30 and $50.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>Facts.</b> <table class="lk-tbl"><tr><th>region</th><th>sales</th><th>profit</th></tr><tr><td>East</td><td>100</td><td>20</td></tr><tr><td>East</td><td>300</td><td>30</td></tr><tr><td>West</td><td>200</td><td>40</td></tr></table></div>
<div class="step"><b>A bad measure.</b> Average of row margins for East: (20% + 10%) / 2 = 15%.</div>
<div class="step"><b>A good measure.</b> <code>SUM(profit) / SUM(sales)</code> for East: 50 / 400 = <mark>12.5%</mark>.</div>
<div class="step"><b>A slicer applies.</b> Choose West: the same measure re-runs on only West rows, 40 / 200 = 20%.</div>
<div class="step"><b>Define once.</b> Every report that uses the Margin % measure gets the same answer.</div>
</div>

<div class="problem" data-problem="dm-measure-ratio"></div>

## 8. Worked example: one date table per role

Returns have two dates. "Returns in 2025" can mean returned in 2025 or ordered in 2025. In Power BI only one relationship between Returns and Date can be active, so Microsoft recommends a second date table, Return Date, with its own active relationship. In SQL that is the same dimension joined twice under two names:

```sql
-- try
SELECT od.year AS order_year, rd.year AS return_year, COUNT(*) AS returns
FROM fact_returns r
JOIN dim_date od ON od.date_key = r.order_date_key
JOIN dim_date rd ON rd.date_key = r.return_date_key
GROUP BY od.year, rd.year
ORDER BY od.year, rd.year
```

1. 96 items were ordered and returned in 2024.
2. 4 were ordered in late 2024 and returned in 2025.
3. 104 were ordered and returned in 2025.

So "returns in 2025" is 108 by return date but 104 by order date. With two date tables, the report author picks the meaning explicitly, and a slicer on Return Date can't be mistaken for one on Order Date. Name the columns so they describe themselves: Return Year, Return Month.

## 9. Practice

```sql
-- exercise: Write the "slicer" query for Year = 2024: total sales by month (month number and total), in month order.
-- hint: JOIN dim_date, WHERE d.year = 2024, GROUP BY d.month, ORDER BY d.month.
SELECT d.month, f.sales_amount
FROM fact_sales f
JOIN dim_date d ON d.date_key = f.date_key
-- answer:
SELECT d.month, ROUND(SUM(f.sales_amount), 2) AS total_sales
FROM fact_sales f
JOIN dim_date d ON d.date_key = f.date_key
WHERE d.year = 2024
GROUP BY d.month
ORDER BY d.month
```

```sql
-- exercise: Compute Average order value for guests and for members: one row each (label 'Guest' or 'Member'), as total sales divided by distinct orders, rounded to 2 decimals.
-- hint: CASE WHEN customer_key = -1 THEN 'Guest' ELSE 'Member' END, then SUM(sales_amount) / COUNT(DISTINCT order_id).
SELECT customer_key, AVG(sales_amount)
FROM fact_sales
GROUP BY customer_key
-- answer:
SELECT CASE WHEN customer_key = -1 THEN 'Guest' ELSE 'Member' END AS who,
       ROUND(SUM(sales_amount) / COUNT(DISTINCT order_id), 2) AS avg_order_value
FROM fact_sales
GROUP BY who
```

```sql
-- exercise: Count 2025 returns by reason using the Return Date role (returns whose return_date_key falls in 2025), most common first.
-- hint: JOIN dim_date on return_date_key, WHERE year = 2025, GROUP BY reason.
SELECT reason, COUNT(*) AS returns
FROM fact_returns
GROUP BY reason
-- answer:
SELECT r.reason, COUNT(*) AS returns
FROM fact_returns r
JOIN dim_date rd ON rd.date_key = r.return_date_key
WHERE rd.year = 2025
GROUP BY r.reason
ORDER BY returns DESC
```

<div class="keypoints">

- The semantic layer holds definitions, not copies of data.
- Relationships should be one-to-many from dimension to fact.
- Slicers filter first; measures aggregate after.
- Ratios: sum the parts, then divide.

</div>

**New words:** *semantic layer*, *semantic model*, *measure*, *filter context*, *active relationship*, *bi-directional relationship*, *row-level security*.
