---
title: 'Conformed dimensions: one product table for every fact'
seoTitle: 'Conformed dimensions explained, with drill-across SQL'
summary: 'When sales and returns share one product dimension, their numbers line up and you can put them side by side. Build it, then compare the right way to combine two fact tables with the wrong one.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What makes a dimension conformed?
    choices: ['It has no NULLs', 'Several fact tables use the same table (or an exact subset of it), with the same keys and the same labels', 'It is joined to only one fact table']
    ans: 1
    why: Conformed means shared and identical. Sales and returns both point at dim_product, so "Tech" means the same products in both.
  - q: 'You want units sold and items returned per department. What is the safe way?'
    choices: ['Join fact_sales to fact_returns on product_key, then sum', 'Sum each fact by department separately, then join the two results on department', 'UNION the two fact tables']
    ans: 1
    why: Joining two facts on product_key pairs every sale with every return of that product and inflates both. Aggregating each to the shared level first, then joining, is called drilling across.
  - q: 'A monthly targets table is set per category, not per product. Which dimension should it use?'
    choices: ['dim_product, with a made-up product per category', 'A shrunken dimension: one row per category, with labels copied from dim_product', 'No dimension at all']
    ans: 1
    why: A shrunken dimension is an exact rollup of the full one. Its category names match dim_product's, so targets and sales still line up.
---

**Module 4 · about 25 minutes · read first: 4.1 and 2.5.** You'll be able to build one product dimension that two fact tables share, combine their numbers safely with a drill-across query, and spot a dimension that doesn't conform.

## 1. Why this matters

Managers rarely want one fact on its own. They want sales next to returns, sales next to targets, stock next to sales. If each of those was built by a different team with its own product list, "Electronics" in one report and "Tech" in another quietly mean different things, and the numbers never tie out. **Conformed dimensions** are how a warehouse keeps one meaning for each label across every fact table. They are the columns of the bus matrix from [Lesson 2.5](/learn/courses/data-modelling/bus-matrix/).

## 2. One dimension, many facts

A dimension is **conformed** when every fact table that uses it points at the same table (or an exact subset of it), with the same keys, the same column names and the same values. Build Northbay's product dimension once, with its category and department copied in:

```sql
-- noviz
DROP TABLE IF EXISTS dim_product;
CREATE TABLE dim_product AS
SELECT ROW_NUMBER() OVER (ORDER BY p.product_id) AS product_key,
       p.product_id, p.product_name, p.brand, c.category_name, c.department
FROM products p
JOIN categories c ON c.category_id = p.category_id;

SELECT * FROM dim_product WHERE product_id IN (1, 33, 56);
```

Now two fact tables, at two different grains, both using `product_key`. Sales has one row per completed order line; returns has one row per item brought back.

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT oi.order_id, o.order_date, dp.product_key, oi.quantity,
       ROUND(oi.quantity * oi.unit_price * (1 - oi.discount), 2) AS sales_amount
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
JOIN dim_product dp ON dp.product_id = oi.product_id
WHERE o.status = 'completed';

DROP TABLE IF EXISTS fact_returns;
CREATE TABLE fact_returns AS
SELECT r.return_id, r.order_id, r.return_date, dp.product_key, r.reason
FROM returns r
JOIN dim_product dp ON dp.product_id = r.product_id;

SELECT (SELECT COUNT(*) FROM fact_sales) AS sales_lines,
       (SELECT COUNT(*) FROM fact_returns) AS returned_items;
```

7,112 sales lines and 204 returned items. Each fact can be sliced by anything in `dim_product`, and because the dimension is the same table, "Tech" picks out exactly the same 6 products in both.

<!--fig:conformed-dims-->

## 3. The wrong way: joining two facts

The tempting query joins the two fact tables on `product_key` and sums:

```sql
-- try
SELECT dp.department,
       COUNT(*) AS rows_after_join,
       ROUND(SUM(s.sales_amount), 2) AS "sales?"
FROM fact_sales s
JOIN fact_returns r ON r.product_key = s.product_key
JOIN dim_product dp ON dp.product_key = s.product_key
GROUP BY dp.department
```

Grocery shows 11,223 rows and $93,584.40 of "sales", but Grocery only had 5,139 completed lines worth $48,693.73. Every sale of a product was paired with every return of that product: a many-to-many join, the **fan-out** from [SQL Lesson 4.5](/learn/courses/sql/fan-out/). (Departments whose products were never returned would also disappear.) Two fact tables share dimensions; they should almost never be joined to each other.

## 4. The right way: drill across

**Drilling across** means: aggregate each fact on its own to the level you want, using the shared dimension's columns, then join the small results on those columns.

```sql
-- try
WITH s AS (
  SELECT dp.department, COUNT(*) AS lines, ROUND(SUM(f.sales_amount), 2) AS sales
  FROM fact_sales f JOIN dim_product dp ON dp.product_key = f.product_key
  GROUP BY dp.department
), r AS (
  SELECT dp.department, COUNT(*) AS returns
  FROM fact_returns f JOIN dim_product dp ON dp.product_key = f.product_key
  GROUP BY dp.department
)
SELECT s.department, s.lines, s.sales, COALESCE(r.returns, 0) AS returns,
       ROUND(100.0 * COALESCE(r.returns, 0) / s.lines, 1) AS returns_per_100_lines
FROM s
LEFT JOIN r ON r.department = s.department
ORDER BY returns_per_100_lines DESC
```

Now each number is right: Tech 30 returns per 377 lines (8.0 per 100), Kids 6.7, Home 6.1, Grocery 1.5. The join works only because both sides say "Tech" in exactly the same way. That is the whole point of conforming. The LEFT JOIN keeps a department with no returns at 0 instead of dropping it.

## 5. What happens when dimensions don't conform

Suppose the returns team kept its own spreadsheet with its own department names. Watch the drill-across fall apart:

```sql
-- try
WITH returns_team(department, returns) AS (
  VALUES ('Groceries', 75), ('Home', 76), ('Toys & Kids', 23), ('Tech', 30)
), s AS (
  SELECT dp.department, COUNT(*) AS lines
  FROM fact_sales f JOIN dim_product dp ON dp.product_key = f.product_key
  GROUP BY dp.department
)
SELECT s.department, s.lines, rt.returns
FROM s
LEFT JOIN returns_team rt ON rt.department = s.department
```

Grocery and Kids get NULL returns: "Groceries" ≠ "Grocery", "Toys & Kids" ≠ "Kids". Nothing errors, the report just looks as if those departments never had returns. Real cases are worse: the same names but different products behind them (one team counts cleaning products as Home, another as Grocery). The fix is organisational as much as technical: agree one product dimension, owned by one team, and make every fact load look up its keys there.

A conformed dimension doesn't always have to be the full table. A **shrunken dimension** is an exact rollup of it, such as one row per category, for facts that are recorded at that level (monthly targets per category, say). It is built **from** `dim_product`, so its labels can't drift:

```sql
-- noviz
DROP TABLE IF EXISTS dim_category;
CREATE TABLE dim_category AS
SELECT ROW_NUMBER() OVER (ORDER BY department, category_name) AS category_key,
       category_name, department
FROM (SELECT DISTINCT category_name, department FROM dim_product);

SELECT * FROM dim_category;
```

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** two facts can be compared only through the attributes they share. Aggregating each to that shared level first turns two big tables into two small functions on the same domain, which can then be joined one-to-one.

**Equation:** let g: products → departments be the department attribute in dim_product. Sales gives S(dept) = Σ sales over lines whose product p has g(p) = dept; returns gives R(dept) the same way. Both are functions on the same set of departments, so S ⋈ R on department is one-to-one (4 rows). Joining the raw facts on product instead gives, for each product, (sales lines) × (returns) rows: |S ⋈ R| = Σₚ nₚ·mₚ, which is why Grocery grew from 5,139 rows to 11,223.

**Analogy:** two shops with the same till categories can add up their takings by category and compare the slips. If one shop calls it "Groceries" and the other "Food", the slips don't line up, however carefully each was added.

**Try it:** a product had 3 sales lines and 2 returns. How many rows does joining the facts on product_key make for it? (3 × 2 = 6.)
</details>

## 6. Worked example: return rate by category

*Question:* which categories come back most often, per 100 lines sold?

The same drill-across, one level lower in the shared dimension:

```sql
-- try
WITH s AS (
  SELECT dp.category_name, COUNT(*) AS lines
  FROM fact_sales f JOIN dim_product dp ON dp.product_key = f.product_key
  GROUP BY dp.category_name
), r AS (
  SELECT dp.category_name, COUNT(*) AS returns
  FROM fact_returns f JOIN dim_product dp ON dp.product_key = f.product_key
  GROUP BY dp.category_name
)
SELECT s.category_name, s.lines, COALESCE(r.returns, 0) AS returns,
       ROUND(100.0 * COALESCE(r.returns, 0) / s.lines, 1) AS per_100
FROM s LEFT JOIN r ON r.category_name = s.category_name
ORDER BY per_100 DESC
LIMIT 5
```

Electronics (8.0), Toys (6.7), Cleaning (6.4), Kitchen (6.1) and Bedding (5.3) lead; every food category is under 2. A buyer can act on that because the categories in both counts are guaranteed to be the same products.

## 7. Practice

```sql
-- exercise: Show the number of returned items per brand, most first, top 3. Use fact_returns and the conformed dim_product.
-- hint: Join fact_returns to dim_product on product_key, GROUP BY dp.brand, ORDER BY the count DESC, LIMIT 3.
SELECT r.reason, COUNT(*) AS returns
FROM fact_returns r
GROUP BY r.reason
-- answer:
SELECT dp.brand, COUNT(*) AS returns
FROM fact_returns r
JOIN dim_product dp ON dp.product_key = r.product_key
GROUP BY dp.brand
ORDER BY returns DESC
LIMIT 3
```

```sql
-- exercise: Drill across by month for 2025: one row per month with sales lines (by order_date) and returned items (by return_date).
-- hint: Two CTEs grouped by substr(date, 1, 7), each filtered to 2025, then LEFT JOIN on the month.
SELECT substr(order_date, 1, 7) AS month, COUNT(*) AS lines
FROM fact_sales
WHERE order_date LIKE '2025%'
GROUP BY month
-- answer:
WITH s AS (
  SELECT substr(order_date, 1, 7) AS month, COUNT(*) AS lines
  FROM fact_sales WHERE order_date LIKE '2025%' GROUP BY month
), r AS (
  SELECT substr(return_date, 1, 7) AS month, COUNT(*) AS returns
  FROM fact_returns WHERE return_date LIKE '2025%' GROUP BY month
)
SELECT s.month, s.lines, COALESCE(r.returns, 0) AS returns
FROM s LEFT JOIN r ON r.month = s.month
```

```sql
-- exercise: Using the shrunken dim_category, count how many categories each department has, most first.
-- hint: GROUP BY department on dim_category, ORDER BY the count DESC, then department.
SELECT department FROM dim_category
-- answer:
SELECT department, COUNT(*) AS categories
FROM dim_category
GROUP BY department
ORDER BY categories DESC, department
```

**New words:** *conformed dimension*, *drill across*, *shrunken dimension*.
