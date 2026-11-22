---
title: 'Inmon and the enterprise warehouse'
seoTitle: 'Inmon vs Kimball data warehouse, explained simply'
summary: 'Bill Inmon builds one integrated, normalised enterprise warehouse first and feeds data marts from it; Ralph Kimball builds conformed star schemas straight away. Build a small Inmon-style warehouse and a dependent mart from Northbay, and learn when each approach fits.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: In Inmon's design, what does the central enterprise data warehouse look like?
    choices: ['A set of star schemas, one per business process', 'An integrated, normalised (roughly 3NF) model of the whole business', 'A single wide table with every column']
    ans: 1
    why: Inmon's warehouse is normalised and organised by subject (customer, product, sale). Star-shaped data marts are built from it afterwards for reporting.
  - q: What is a dependent data mart?
    choices: ['A mart loaded straight from the source systems', 'A mart built only from the enterprise warehouse, so it agrees with every other mart', 'A mart that depends on Power BI']
    ans: 1
    why: Dependent marts take their data from the central warehouse, never from the sources directly. Because every mart is fed from the same integrated copy, their numbers agree.
  - q: Which is a fair reason to choose Kimball over Inmon for a small team?
    choices: ['Kimball forbids normalised tables', 'Kimball delivers a usable star for one business process quickly, then grows through conformed dimensions', 'Inmon cannot store history']
    ans: 1
    why: Kimball's bus approach ships value one process at a time. Inmon asks for more modelling up front across the whole business, which pays off in large organisations with many sources.
---

**Module 6 · about 25 minutes · read first: 2.4.** You'll be able to explain Inmon's "enterprise warehouse first" approach, build a small normalised warehouse with a dependent data mart in SQL, and say when you would pick Inmon, Kimball or a mix.

## 1. Why this matters

Every warehouse you join was built on some philosophy, even if nobody wrote it down. Banks, insurers and governments often have a large normalised "enterprise data warehouse" with star-shaped marts on top; many younger companies went straight to Kimball stars. Knowing both lets you read an unfamiliar warehouse quickly, and "Inmon or Kimball?" is a classic interview question.

## 2. Two fathers of the warehouse

**Bill Inmon** described the data warehouse in the early 1990s as a store of data that is:

- **subject-oriented**: organised around things the business cares about (customer, product, sale), not around one application;
- **integrated**: the same customer, product or code means the same thing, whichever source it came from;
- **time-variant**: it keeps history, so you can ask about any past date;
- **non-volatile**: once loaded, rows are added to, not edited away.

His design, often called the **Corporate Information Factory**, builds one central **enterprise data warehouse (EDW)** in a normalised model (roughly third normal form, [Lesson 1.2](/learn/courses/data-modelling/normal-forms/)). Reporting then uses **dependent data marts**: smaller, often star-shaped, subject-area tables built *from* the EDW.

**Ralph Kimball** turned it around: build star schemas for one business process at a time, and tie them together with **conformed dimensions** and the bus matrix ([Lesson 2.5](/learn/courses/data-modelling/bus-matrix/)). There is no separate normalised layer that users must go through.

<!--fig:inmon-kimball-->

People call them **top-down** (Inmon: design the enterprise model, then the marts) and **bottom-up** (Kimball: deliver marts, and the warehouse is their sum). Both end in stars for reporting. The real difference is what sits in the middle.

## 3. Build a tiny EDW

Northbay's own tables are already normalised: orders point to stores, stores to regions, products to categories. An Inmon EDW keeps that shape, but **integrates** the data on the way in. Two things in Northbay need integrating: emails written in capitals, and cities with stray spaces. Run this to build the EDW layer:

```sql
-- noviz
DROP TABLE IF EXISTS edw_customer;
DROP TABLE IF EXISTS edw_order;
DROP TABLE IF EXISTS edw_order_line;
CREATE TABLE edw_customer AS
SELECT customer_id, first_name, last_name,
       lower(email) AS email,          -- one spelling of every email
       trim(city)   AS city,           -- no stray spaces
       province, joined_on, loyalty_tier
FROM customers;
CREATE TABLE edw_order AS
SELECT order_id, customer_id, store_id, order_date, channel, status
FROM orders;
CREATE TABLE edw_order_line AS
SELECT order_id, product_id, quantity, unit_price, discount
FROM order_items;
SELECT COUNT(*) AS customers, (SELECT COUNT(*) FROM edw_order) AS orders,
       (SELECT COUNT(*) FROM edw_order_line) AS lines
FROM edw_customer
```

603 customers, 4,064 orders and 7,310 lines. Stores, regions, products and categories are already clean, so the EDW would keep them as they are. See what trimming alone did to the customer cities:

```sql
-- try
SELECT (SELECT COUNT(DISTINCT city) FROM customers) AS raw_city_spellings,
       (SELECT COUNT(DISTINCT city) FROM edw_customer) AS edw_cities
```

22 spellings in the source, 11 real cities in the EDW. Every report built on the EDW gets the clean list for free.

Integration goes further than tidying text. Three people signed up twice. An enterprise warehouse records that customer 601 and customer 17 are the same **party** (a person or organisation the business deals with), so every mart counts people the same way:

```sql
-- try
SELECT c.customer_id,
       (SELECT MIN(c2.customer_id) FROM edw_customer c2
        WHERE c2.email = c.email) AS party_id,
       c.first_name, c.last_name, c.email
FROM edw_customer c
WHERE c.email IN (SELECT email FROM edw_customer
                  GROUP BY email HAVING COUNT(*) > 1)
ORDER BY party_id, c.customer_id
```

Six rows, three parties. Doing this once in the EDW means nobody repeats (or forgets) it in a report.

## 4. A dependent data mart

The mart is built **only from EDW tables**, never from the raw sources. Here it is as a view: completed revenue by month, province and department, which is what a sales dashboard needs.

```sql
-- noviz
DROP VIEW IF EXISTS mart_sales_month;
CREATE VIEW mart_sales_month AS
SELECT substr(o.order_date, 1, 7) AS month,
       COALESCE(s.province, 'Online') AS province,
       cat.department,
       ROUND(SUM(l.quantity * l.unit_price * (1 - l.discount)), 2) AS revenue,
       COUNT(DISTINCT o.order_id) AS orders
FROM edw_order_line l
JOIN edw_order o    ON o.order_id = l.order_id
JOIN stores s       ON s.store_id = o.store_id
JOIN products p     ON p.product_id = l.product_id
JOIN categories cat ON cat.category_id = p.category_id
WHERE o.status = 'completed'
GROUP BY 1, 2, 3;
SELECT * FROM mart_sales_month ORDER BY month, province, department LIMIT 8
```

Notice the four joins inside the view. Normalised data is great for loading and integrating, but every question needs many joins. That is exactly why Inmon puts marts on top: users query the mart, not the EDW.

```sql
-- try
SELECT province, ROUND(SUM(revenue), 2) AS revenue
FROM mart_sales_month
GROUP BY province
ORDER BY revenue DESC
```

Ontario leads with $59,660.61, then Online with $32,661.99. Because every mart is fed from the same EDW, a "customers" mart and a "sales" mart will always agree about provinces, departments and people.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** in Inmon's design, every mart is a *function* of the EDW. If the EDW is right, every mart computed from it is consistent with every other mart, because they share one input.

**Equation:** mart₁ = f₁(EDW), mart₂ = f₂(EDW). Normalising splits a table R into pieces R₁, R₂ along a functional dependency (store_id → province), and the split is **lossless**: R = R₁ ⋈ R₂. So the mart can always rebuild the wide rows with joins; nothing was lost by normalising.

**Analogy:** a central kitchen that makes the sauces once, and many restaurants that plate them differently. Kimball's bus is more like each restaurant cooking for itself from a shared, agreed recipe book (the conformed dimensions).

**Try it:** if a fix to customer cities is made in the EDW, how many marts need changing by hand? (None. They are rebuilt from the EDW, so the fix flows into all of them.)
</details>

## 5. Worked example: when the middle layer earns its keep

*Question:* Northbay buys a smaller chain whose till system writes province names in full ("Ontario") and uses its own customer numbers. Where should those be matched to Northbay's codes?

1. **Kimball:** in the load of each conformed dimension. dim_store and dim_customer gain rows from the new chain; every fact table that uses them gets the new keys. One place per dimension, and you need discipline so every load uses the conformed version.
2. **Inmon:** in the EDW. Store and customer from both chains are integrated once, into normalised tables with one code per province and a party id per person. Every mart is rebuilt from the EDW and needs no change.
3. **What the numbers look like:** with today's data, the EDW maps 603 customer rows to 600 people. After the merger, the same query maps both chains' customers into parties, and every mart counts people in that one way.

Either works. Inmon pays more up front (model the whole business), and gains most when there are many messy sources. Kimball pays less up front and ships the first star sooner.

## 6. Which one, in real life?

Most modern warehouses are **hybrids**:

| Situation | Usual choice |
|---|---|
| A few sources, one team, need a dashboard this quarter | Kimball stars straight from staging |
| Dozens of source systems, strong audit needs (bank, insurer, government) | An integrated normalised or Data Vault core ([Lesson 6.2](/learn/courses/data-modelling/data-vault/)), with Kimball marts on top |
| Cloud warehouse with dbt | staging → core (often normalised or lightly dimensional) → marts as stars ([Lesson 7.1](/learn/courses/data-modelling/layers/)) |

Whatever the middle looks like, the layer people actually query is almost always a star. That is why the rest of this course stays Kimball-first.

## 7. Practice

```sql
-- exercise: Using only the EDW tables (edw_order, edw_order_line) plus stores, show completed revenue per channel (store or online), highest first, rounded to 2 decimals.
-- hint: Join edw_order_line to edw_order on order_id, keep status = 'completed', GROUP BY channel.
SELECT o.channel
FROM edw_order o
-- answer:
SELECT o.channel,
       ROUND(SUM(l.quantity * l.unit_price * (1 - l.discount)), 2) AS revenue
FROM edw_order_line l
JOIN edw_order o ON o.order_id = l.order_id
WHERE o.status = 'completed'
GROUP BY o.channel
ORDER BY revenue DESC
```

```sql
-- exercise: Count how many distinct people (parties) Northbay has, using email to match duplicates. Customers with no email count as their own person.
-- hint: Count DISTINCT COALESCE(email, 'id:' || customer_id) in edw_customer.
SELECT COUNT(*) AS people
FROM edw_customer
-- answer:
SELECT COUNT(DISTINCT COALESCE(email, 'id:' || customer_id)) AS people
FROM edw_customer
```

```sql
-- exercise: From the mart view mart_sales_month, list each department's 2025 revenue, highest first.
-- hint: Filter month LIKE '2025-%', then GROUP BY department.
SELECT department, revenue
FROM mart_sales_month
-- answer:
SELECT department, ROUND(SUM(revenue), 2) AS revenue
FROM mart_sales_month
WHERE month LIKE '2025-%'
GROUP BY department
ORDER BY revenue DESC
```

**New words:** *enterprise data warehouse (EDW)*, *Corporate Information Factory*, *dependent data mart*, *subject-oriented*, *integrated*, *time-variant*, *non-volatile*, *party*, *top-down*, *bottom-up*.
