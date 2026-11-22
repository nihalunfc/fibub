---
title: 'Snowflakes and outriggers: when a dimension has dimensions'
seoTitle: 'Snowflake schema vs star schema, with SQL examples'
summary: 'Split the product dimension into product, category and department tables and compare it with the flat star version: same answers, more joins. Learn when snowflaking is worth it and what an outrigger is.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is a snowflake schema?
    choices: ['A star schema whose dimensions are normalised into chains of smaller tables', 'A schema with no fact table', 'A star schema stored in the cloud']
    ans: 0
    why: Snowflaking moves repeated attributes, such as category and department, out of the dimension into their own tables, joined by keys.
  - q: 'Sales by department: how many joins does the Northbay snowflake need, compared with the star?'
    choices: ['The same, 1', '3 instead of 1', '1 instead of 3']
    ans: 1
    why: Snowflake goes fact → product → category → department (3 joins). The flat star dimension already has the department on each product row (1 join).
  - q: 'Which is a good reason to use an outrigger?'
    choices: ['To save a few bytes of text', 'A dimension needs a whole set of attributes that another dimension already provides, like a date with its fiscal year and weekday', 'To avoid using a date dimension']
    ans: 1
    why: An outrigger is a dimension referenced from another dimension. Pointing a customer's sign-up date at dim_date gives it every calendar attribute for free.
---

**Module 4 · about 25 minutes · read first: 4.1.** You'll be able to build the same dimension as a star and as a snowflake, show that they give the same answers, and decide which one to use.

## 1. Why this matters

People who learned databases on normal forms ([Lesson 1.2](/learn/courses/data-modelling/normal-forms/)) look at a star schema's dimension, see "Tech" typed on six product rows, and want to split it out. That split is called snowflaking. It is not wrong, but it has costs that show up in every query and every Power BI model. "Star or snowflake?" is one of the most common modelling interview questions, and a good answer needs both sides.

## 2. Star: the flat dimension

In a star schema each dimension is one wide table. Category and department are copied onto every product row. Build it, plus a sales fact for completed orders:

```sql
-- noviz
DROP TABLE IF EXISTS dim_product;
CREATE TABLE dim_product AS
SELECT p.product_id AS product_key, p.product_name, p.brand, c.category_name, c.department
FROM products p JOIN categories c ON c.category_id = p.category_id;

DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT oi.order_id, o.order_date, oi.product_id AS product_key, oi.quantity,
       ROUND(oi.quantity * oi.unit_price * (1 - oi.discount), 2) AS sales_amount
FROM order_items oi JOIN orders o ON o.order_id = oi.order_id
WHERE o.status = 'completed';

SELECT product_key, product_name, category_name, department FROM dim_product WHERE department = 'Tech';
```

Six Tech products, and the words "Electronics" and "Tech" are stored six times. (To keep this lesson short, `product_key` simply reuses `product_id`; [Lesson 4.1](/learn/courses/data-modelling/surrogate-keys/) explains why a real warehouse would make its own.)

## 3. Snowflake: a chain of tables

To **snowflake** a dimension is to normalise it: each level of a hierarchy gets its own table, and each table points to the level above with a key. Product → category → department:

```sql
-- noviz
DROP TABLE IF EXISTS dim_department;
CREATE TABLE dim_department AS
SELECT ROW_NUMBER() OVER (ORDER BY department) AS department_key, department AS department_name
FROM (SELECT DISTINCT department FROM categories);

DROP TABLE IF EXISTS dim_category;
CREATE TABLE dim_category AS
SELECT c.category_id AS category_key, c.category_name, d.department_key
FROM categories c JOIN dim_department d ON d.department_name = c.department;

DROP TABLE IF EXISTS dim_product_sf;
CREATE TABLE dim_product_sf AS
SELECT product_id AS product_key, product_name, brand, category_id AS category_key
FROM products;

SELECT * FROM dim_department;
```

Now "Tech" is stored once, in a 4-row table; categories have 10 rows; products 61. Drawn out, the tables branch away from the fact like the arms of a snowflake, which is where the name comes from.

<!--fig:star-vs-snowflake-->

## 4. Same answer, more joins

Sales by department, the star way: one join.

```sql
-- try
SELECT p.department, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_product p ON p.product_key = f.product_key
GROUP BY p.department
ORDER BY sales DESC
```

The snowflake way: three joins. Press **Show how it runs** and count the join steps.

```sql
-- try
SELECT d.department_name, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_product_sf p ON p.product_key = f.product_key
JOIN dim_category c   ON c.category_key = p.category_key
JOIN dim_department d ON d.department_key = c.department_key
GROUP BY d.department_name
ORDER BY sales DESC
```

Both give Grocery $48,693.73, Home $42,171.60, Tech $20,524.04, Kids $15,189.72. The model changes how far you walk, not where you end up.

## 5. Where the snowflake does win

Renaming "Tech" to "Technology" shows the trade-off in one line each. In the star, every product row in the department changes:

```sql
-- noviz
UPDATE dim_product SET department = 'Technology' WHERE department = 'Tech';
```

In the snowflake, one row changes:

```sql
-- noviz
UPDATE dim_department SET department_name = 'Technology' WHERE department_name = 'Tech';
```

Run both: "6 rows changed" vs "1 row changed". With millions of products that difference matters for the load, and the snowflake can't end up half-renamed. Weigh it up:

| | Star (flat) | Snowflake |
|---|---|---|
| Joins per query | fewer | more |
| Report tools (Power BI, Tableau) | built for it | work, but the model is busier |
| Storage | repeats some text | none repeated |
| Updating a hierarchy label | many rows | one row |
| Users browsing fields | one "Product" folder | several tables to understand |

Kimball's advice, and the usual practice: build stars for what people query. Repeated text in a dimension costs very little, because dimensions are small next to facts. Snowflake only where there is a real reason, for example a big hierarchy that another team owns and updates, and then often flatten it again in a view before the report tool sees it. Power BI in particular works best with stars: its filters flow from each dimension table straight to the fact, and every extra hop is another relationship to manage.

## 6. Outriggers

An **outrigger** is a dimension that is referenced by another dimension instead of by a fact. It is a deliberate, limited snowflake. The classic case is a date inside a dimension: a customer's sign-up date, or a product's launch date. Instead of storing just the date text, the dimension stores a key into `dim_date`, and so gets weekday, fiscal year and holiday flags for free.

Northbay's stores already have one: each store points to `regions`. Here is sales by region, with the region reached through the store (stores → regions is the outrigger):

```sql
-- try
SELECT COALESCE(r.region_name, 'Online') AS region,
       ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 2) AS sales
FROM order_items oi
JOIN orders o  ON o.order_id = oi.order_id
JOIN stores s  ON s.store_id = o.store_id
LEFT JOIN regions r ON r.region_id = s.region_id
WHERE o.status = 'completed'
GROUP BY region
ORDER BY sales DESC
```

Ontario South leads with $42,944.35, then Online with $32,661.99. Use outriggers sparingly: each one is another join, and a chain of them is a snowflake by another name.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a hierarchy is a chain of many-to-one functions. A star stores their composition on each row; a snowflake stores each step separately. Both describe the same function, so both give the same answer.

**Equation:** let c: products → categories and g: categories → departments. The star stores dept(p) = g(c(p)) on every product row; the snowflake stores c and g as two tables and works out g ∘ c at query time with two joins. Same function, different storage: 61 copies of a department name vs 61 + 10 + 4 rows with each name once. Renaming a department changes one star row per product p with g(c(p)) = that department (6 for Tech), but only 1 row in the snowflake.

**Analogy:** a postal address. You can write "Toronto, Ontario, Canada" on every envelope (star), or write a postcode and keep a book that maps postcodes to cities and provinces (snowflake). The book saves ink; the full address is quicker to read.

**Try it:** a product moves from Kitchen to Cleaning. How many rows change in the star? In the snowflake? (One each: its category and department in the star; its category_key in the snowflake.)
</details>

## 7. Worked example: Tech sales by brand

*Question:* in the Technology department (we renamed it above), which brand sold more?

In the snowflake that means walking up to the department to filter, while grouping at the product level:

```sql
-- try
SELECT p.brand, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_product_sf p ON p.product_key = f.product_key
JOIN dim_category c   ON c.category_key = p.category_key
JOIN dim_department d ON d.department_key = c.department_key
WHERE d.department_name = 'Technology'
GROUP BY p.brand
ORDER BY sales DESC
```

Volt North $10,415.16, Pixel Pine $10,108.88: almost level. In the star the same answer needs one join and `WHERE p.department = 'Technology'`. If you had run only one of the two UPDATEs, the two models would now disagree on the department's name, which is the real risk of keeping both shapes around.

## 8. Practice

```sql
-- exercise: Using the snowflake tables, show the top 3 categories by sales.
-- hint: fact_sales → dim_product_sf → dim_category (2 joins), GROUP BY c.category_name, ORDER BY sales DESC, LIMIT 3.
SELECT p.category_key, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_product_sf p ON p.product_key = f.product_key
GROUP BY p.category_key
-- answer:
SELECT c.category_name, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_product_sf p ON p.product_key = f.product_key
JOIN dim_category c   ON c.category_key = p.category_key
GROUP BY c.category_name
ORDER BY sales DESC
LIMIT 3
```

```sql
-- exercise: Using only the snowflake dimension tables (no facts), count the products in each department.
-- hint: dim_product_sf → dim_category → dim_department, GROUP BY d.department_name.
SELECT category_key, COUNT(*) AS products
FROM dim_product_sf
GROUP BY category_key
-- answer:
SELECT d.department_name, COUNT(*) AS products
FROM dim_product_sf p
JOIN dim_category c   ON c.category_key = p.category_key
JOIN dim_department d ON d.department_key = c.department_key
GROUP BY d.department_name
```

```sql
-- exercise: Flatten the snowflake back into a star: one row per product with product_name, category_name and department_name. Show the Toys products.
-- hint: Join the three snowflake tables and filter c.category_name = 'Toys'. This is exactly the view you would give a report tool.
SELECT product_name, category_key
FROM dim_product_sf
-- answer:
SELECT p.product_name, c.category_name, d.department_name
FROM dim_product_sf p
JOIN dim_category c   ON c.category_key = p.category_key
JOIN dim_department d ON d.department_key = c.department_key
WHERE c.category_name = 'Toys'
```

**New words:** *snowflake schema*, *snowflaking*, *hierarchy*, *outrigger*.
