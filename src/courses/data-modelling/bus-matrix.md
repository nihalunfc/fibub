---
title: 'The bus matrix: planning a whole warehouse'
seoTitle: 'Kimball bus matrix explained with an example'
summary: 'A warehouse grows one business process at a time. The bus matrix lists every process against the dimensions they share, so each new fact table plugs into the same date, product and store tables. Build two facts on shared dimensions and compare them with a drill-across query.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: What are the rows and columns of a bus matrix?
    choices: ['Rows are business processes, columns are dimensions', 'Rows are tables, columns are columns', 'Rows are reports, columns are users']
    ans: 0
    why: Each row becomes a fact table, each column a dimension built once and shared. A mark shows which processes use which dimension.
  - q: What is a conformed dimension?
    choices: ['One dimension table (or exact subset) shared by several fact tables, with the same keys and labels', 'A dimension with no attributes', 'A dimension that changes daily']
    ans: 0
    why: Shared keys and labels are what let you put sales and returns side by side. Two private product tables would soon disagree.
  - q: How should you compare sales and returns by department?
    choices: ['Sum each fact table to department separately, then join the two results', 'Join fact_sales to fact_returns on product_key and sum', 'Union the two fact tables and average']
    ans: 0
    why: Joining two fact tables directly multiplies rows. Drilling across sums each one to the shared grain first, then joins one row to one row.
---

**Module 2 · about 30 minutes · read first: 2.4.** You'll be able to draw a bus matrix for a company, explain conformed dimensions, and compare two fact tables safely with a drill-across query.

## 1. Why this matters

Nobody builds a whole warehouse at once. Teams add one process at a time, often years apart, often different people. Without a plan, each project builds its own product table and its own idea of "region", and soon sales and returns can't be compared because they disagree on what a product is. The *bus matrix* is the one-page plan that prevents this. It's also a great artefact for a portfolio or an interview.

## 2. One page, every process

A *bus matrix* is a grid: one row per business process, one column per dimension, and a mark where a process uses a dimension. Here is Northbay's, including the fact tables you'll build in Module 3:

<!--fig:bus-matrix-->

Reading it:

- **Across a row:** the dimensions one fact table needs. Sales needs five.
- **Down a column:** every fact table that will share that dimension. Date is used by everything; Employee only by staffing.
- **Where to start:** the dimensions with the most marks (Date, Store, Product) are worth building carefully first, because everything will reuse them.

The name comes from electronics: a *bus* is a shared connector that many parts plug into. Conformed dimensions are the warehouse's bus.

## 3. Conformed dimensions

A dimension is *conformed* when every fact table that uses it uses the **same** one: the same keys, the same attribute names, the same spellings. "Ontario South" means the same stores in the sales report and the returns report. A fact table can also use an exact subset of a conformed dimension, such as a month-level slice of the date dimension; [Lesson 4.3](/learn/courses/data-modelling/conformed-dimensions/) goes further.

Let's build two dimensions once and hang two fact tables off them. First the shared product and store dimensions (the same design as [Lesson 2.4](/learn/courses/data-modelling/star-schema/)):

```sql
-- try
-- noviz
DROP TABLE IF EXISTS dim_product;
CREATE TABLE dim_product AS
SELECT p.product_id AS product_key, p.product_name, p.brand, c.category_name AS category, c.department
FROM products p JOIN categories c ON c.category_id = p.category_id;
DROP TABLE IF EXISTS dim_store;
CREATE TABLE dim_store AS
SELECT s.store_id AS store_key, s.store_name, COALESCE(r.region_name, 'Online') AS region
FROM stores s LEFT JOIN regions r ON r.region_id = s.region_id;
SELECT COUNT(*) AS products, (SELECT COUNT(*) FROM dim_store) AS stores FROM dim_product;
```

Then two fact tables, each at its own grain, both using the same keys:

```sql
-- try
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT CAST(strftime('%Y%m%d', o.order_date) AS INTEGER) AS date_key, i.product_id AS product_key, o.store_id AS store_key,
       i.order_id, i.quantity, ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount
FROM order_items i JOIN orders o ON o.order_id = i.order_id
WHERE o.status = 'completed';
DROP TABLE IF EXISTS fact_returns;
CREATE TABLE fact_returns AS
SELECT CAST(strftime('%Y%m%d', r.return_date) AS INTEGER) AS date_key, r.product_id AS product_key, o.store_id AS store_key,
       r.order_id, r.reason, 1 AS return_count,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS return_amount
FROM returns r
JOIN orders o ON o.order_id = r.order_id
JOIN order_items i ON i.order_id = r.order_id AND i.product_id = r.product_id;
SELECT (SELECT COUNT(*) FROM fact_sales) AS sales_rows, (SELECT COUNT(*) FROM fact_returns) AS return_rows;
```

(We treat each return as the whole line coming back, since `returns` has no quantity.)

## 4. Drill across, the safe way

The question "what share of each department's sales comes back?" needs both fact tables. The tempting query joins them directly on product. Don't:

```sql
-- try
SELECT p.department, ROUND(SUM(s.sales_amount), 2) AS sales, ROUND(SUM(r.return_amount), 2) AS returned
FROM fact_sales s
JOIN fact_returns r ON r.product_key = s.product_key
JOIN dim_product p ON p.product_key = s.product_key
GROUP BY p.department
```

Home shows $173,461.25 of sales, but Home really sold $42,171.60. Every sale of a product pairs with every return of that product, so both totals balloon (and products never returned vanish altogether). Two fact tables are never joined row to row.

The right pattern is *drill-across*: sum each fact table to the shared dimension separately, then join the two small results, one row to one row.

```sql
-- try
WITH s AS (
  SELECT p.department, SUM(f.sales_amount) AS sales
  FROM fact_sales f JOIN dim_product p ON p.product_key = f.product_key
  GROUP BY p.department
), r AS (
  SELECT p.department, SUM(f.return_amount) AS returned, SUM(f.return_count) AS returns
  FROM fact_returns f JOIN dim_product p ON p.product_key = f.product_key
  GROUP BY p.department
)
SELECT s.department, ROUND(s.sales, 2) AS sales, r.returns, ROUND(r.returned, 2) AS returned,
       ROUND(100.0 * r.returned / s.sales, 1) AS return_pct
FROM s LEFT JOIN r ON r.department = s.department
ORDER BY return_pct DESC
```

This only works because both facts use the **same** `dim_product`. If returns had its own product table where "Kids" was called "Toys & Games", the join on department would quietly drop a row. Conformed dimensions are what make drill-across possible.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** two fact tables can be compared only on dimensions they share, and only after each is summed to that shared grain.

**Equation:** let S and R be the sales and returns facts, and a the department attribute. Drill-across computes ΣS grouped by a and ΣR grouped by a, then joins on a. Because each side has one row per department, the join is one-to-one. Joining first gives, for each product, (sales rows) × (return rows) pairs, so SUM(sales) becomes Σ over products of sales × (number of returns): a product, not a sum.

**Analogy:** two class registers, attendance and test scores. To compare classes, total each register by class, then put the two class totals side by side. Pairing every attendance mark with every test score would be nonsense.

**Try it:** a product has 10 sale rows and 2 return rows. In the bad direct join, how many times is each sale counted? (Twice: once per return row.)
</details>

## 5. Worked example: Northbay's matrix, row by row

*Question:* which order should Northbay build its fact tables in?

1. **Sales** first: 5 dimensions, the most questions. Building it creates Date, Product, Store, Customer and Promotion.
2. **Returns** next: every dimension it needs already exists, so it's a quick win. The drill-across above already shows why it's worth having: Tech loses 8.4% of its sales value to returns and Kids 6.3%, against 1.3% for Grocery.
3. **Daily store sales** (a snapshot) and **order to return** (a lifecycle) reuse the same dimensions again: Lessons 3.2 and 3.3.
4. **Promotion coverage** needs only Date, Store and Promotion: Lesson 3.4.
5. **Staffing** needs a new Employee dimension, so it waits until someone asks for labour reports.
6. Each new row in the matrix is cheaper than the last, because the columns already exist. That's the whole point.

## 6. Practice

```sql
-- exercise: Drill across by region: show each region's sales and number of returns, from fact_sales and fact_returns joined to dim_store, region A to Z.
-- hint: One CTE sums sales per region, another counts returns per region; then LEFT JOIN them on region.
SELECT st.region, COUNT(*) AS returns
FROM fact_returns f
JOIN dim_store st ON st.store_key = f.store_key
GROUP BY st.region
-- answer:
WITH s AS (
  SELECT st.region, SUM(f.sales_amount) AS sales
  FROM fact_sales f JOIN dim_store st ON st.store_key = f.store_key GROUP BY st.region
), r AS (
  SELECT st.region, SUM(f.return_count) AS returns
  FROM fact_returns f JOIN dim_store st ON st.store_key = f.store_key GROUP BY st.region
)
SELECT s.region, ROUND(s.sales, 2) AS sales, r.returns
FROM s LEFT JOIN r ON r.region = s.region
ORDER BY s.region
```

```sql
-- exercise: Drill across by year: show sales and returned amount per year (year = date_key / 10000), oldest first.
-- hint: In SQLite, integer division date_key / 10000 gives the year. Sum each fact per year in its own CTE, then join on year.
SELECT date_key / 10000 AS year, ROUND(SUM(sales_amount), 2) AS sales
FROM fact_sales
GROUP BY year
-- answer:
WITH s AS (SELECT date_key / 10000 AS year, SUM(sales_amount) AS sales FROM fact_sales GROUP BY year),
     r AS (SELECT date_key / 10000 AS year, SUM(return_amount) AS returned FROM fact_returns GROUP BY year)
SELECT s.year, ROUND(s.sales, 2) AS sales, ROUND(r.returned, 2) AS returned
FROM s LEFT JOIN r ON r.year = s.year
ORDER BY s.year
```

```sql
-- exercise: Which brand has the highest return rate by value? Drill across by brand and show the top 3 brands by returned ÷ sales × 100 (1 decimal).
-- hint: Same pattern with p.brand instead of department; ORDER BY the rate DESC, LIMIT 3.
SELECT p.brand, COUNT(*) AS returns
FROM fact_returns f JOIN dim_product p ON p.product_key = f.product_key
GROUP BY p.brand
ORDER BY returns DESC
LIMIT 3
-- answer:
WITH s AS (SELECT p.brand, SUM(f.sales_amount) AS sales FROM fact_sales f JOIN dim_product p ON p.product_key = f.product_key GROUP BY p.brand),
     r AS (SELECT p.brand, SUM(f.return_amount) AS returned FROM fact_returns f JOIN dim_product p ON p.product_key = f.product_key GROUP BY p.brand)
SELECT s.brand, ROUND(100.0 * r.returned / s.sales, 1) AS return_pct
FROM s JOIN r ON r.brand = s.brand
ORDER BY return_pct DESC
LIMIT 3
```

**New words:** *bus matrix*, *conformed dimension*, *drill-across*, *stovepipe*.
