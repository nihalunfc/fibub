---
title: 'Capstone part 1: design the Northbay warehouse'
seoTitle: 'Data warehouse design project: bus matrix, grain, ERD'
summary: 'Start the Northbay warehouse portfolio project: profile the source in live SQL, choose business processes, fill in the bus matrix, declare each fact table''s grain, draw the ERD and write the data dictionary and design decisions you will build from in part 2.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Why profile the source before drawing the model?
    choices: ['To make the project longer', 'So grain, keys and rules come from what the data really contains (duplicates, NULLs, odd values), not from guesses', 'Profiling replaces the design']
    ans: 1
    why: A grain you declare must be unique in the data, and every NULL or odd value needs a rule. Checking first saves rebuilding later.
  - q: What does each cell of a bus matrix say?
    choices: ['How many rows a table has', 'That a business process (row) uses a dimension (column), so that dimension must be conformed across those processes', 'Which server holds the table']
    ans: 1
    why: The bus matrix is the warehouse plan. A column with several ticks is a dimension that several fact tables share, so it must be built once and conformed.
  - q: Which is a correct grain statement?
    choices: ['fact_sales holds sales data', 'fact_sales has one row per product on each completed order', 'fact_sales is big']
    ans: 1
    why: A grain says exactly what one row represents, in business words. It decides which dimensions and measures can belong to the table.
---

**Module 8 · about 35 minutes · read first: 2.5, 5.2.** You'll be able to profile a source database in SQL, turn the profile into a bus matrix, grain statements, an ERD and a data dictionary, and write down the design decisions a reviewer will ask about. This is part 1 of the **Northbay warehouse** portfolio project.

## 1. Why this matters

"Tell me about a warehouse you designed" is the opening question of most data modelling interviews, and a GitHub repo with a clear design document answers it before you are asked. Part 1 produces the documents; [part 2](/learn/courses/data-modelling/capstone-build/) builds and tests the warehouse in your browser; [part 3](/learn/courses/data-modelling/capstone-cloud/) moves it to a real database and puts it on your portfolio.

**The brief.** Northbay Retail (12 stores including the online shop, about 600 loyalty members, two years of orders) wants one warehouse that answers: sales by day, store, product and customer tier; returns and why; how promotions perform; and how each store is doing day by day. Customer tier and city must be reportable "as they were" at the time of each sale.

## 2. Step 1: profile the source

Profile before you design. Start with what is there:

```sql
-- noviz
SELECT m.name AS table_name, COUNT(p.name) AS columns
FROM sqlite_master m
JOIN pragma_table_info(m.name) p
WHERE m.type = 'table' AND m.name NOT LIKE 'mini_%'
GROUP BY m.name
ORDER BY m.name
```

Ten source tables. Now check the things that decide the design: is the candidate grain unique, where are the NULLs, and what values do the codes take?

```sql
-- try
SELECT COUNT(*) AS lines,
       COUNT(DISTINCT order_id || '-' || product_id) AS distinct_order_product
FROM order_items
```

7,310 lines and 7,310 distinct order-product pairs: **(order_id, product_id) is unique**, so "one row per product on an order" is a safe grain.

```sql
-- try
SELECT channel, status, COUNT(*) AS orders,
       SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) AS guest_orders,
       SUM(CASE WHEN promo_id IS NOT NULL THEN 1 ELSE 0 END) AS promo_orders
FROM orders
GROUP BY channel, status
ORDER BY channel, status
```

Two channels, two statuses, guests in both, and promotions on some orders. Each of those needs a rule. Write down every finding:

| Finding | Design rule |
|---|---|
| 482 orders have no customer (guests) | map to customer key -1 "Guest" |
| 119 orders are cancelled | leave out of fact_sales; count them in fact_store_daily |
| store 12 is online, with NULL city and region | store dimension shows "Online" for city, province and region |
| 20 customer cities have trailing spaces | trim in staging |
| 3 customers signed up twice (same email in capitals) | keep both rows (both have orders), add a `party_email` column so counts of people can de-duplicate |
| 596 orders are dated before the customer's sign-up date | the first version of each customer is valid from 1900-01-01, not from joined_on, so every order finds a customer row |
| returns have no quantity | assume the whole line was returned; write it down as an assumption |
| 37 emails and 58 tiers are NULL | tier → 'None', email kept NULL (not used in reports) |

## 3. Step 2: business processes and the bus matrix

Four business processes come from the brief. Their shared dimensions go across the top. A tick means "this process uses this dimension":

| Process (fact table) | Date | Product | Store | Customer | Promotion | Return reason |
|---|---|---|---|---|---|---|
| Sales (fact_sales) | ✓ order date | ✓ | ✓ | ✓ | ✓ | |
| Returns (fact_returns) | ✓ order date, return date | ✓ | ✓ | ✓ | | ✓ |
| Store day (fact_store_daily) | ✓ | | ✓ | | | |
| Promotion coverage (stretch goal) | ✓ | ✓ | | | ✓ | |

Date, Product, Store and Customer are used by several processes, so they must be **conformed**: built once, same keys and same attribute values everywhere ([Lesson 4.3](/learn/courses/data-modelling/conformed-dimensions/)).

## 4. Step 3: declare each grain

Write one sentence per fact table, then its type, keys and measures:

- **fact_sales**: one row per product on each completed order. *Transaction fact.* Keys: date_key, product_key, store_key, customer_key, promotion_key; degenerate dimension order_id. Measures: quantity, gross_amount (quantity × price), discount_amount, sales_amount (after discount), cost_amount. All additive.
- **fact_returns**: one row per returned product. *Transaction fact.* Keys: order_date_key and return_date_key (role-playing), product_key, store_key, customer_key, return_reason_key; order_id. Measures: returned_quantity, refund_amount.
- **fact_store_daily**: one row per store per day, including days with no sales. *Periodic snapshot.* Measures: orders, cancelled_orders, lines, sales_amount. Additive across stores; across days too, as these are flows, not balances ([Lesson 3.5](/learn/courses/data-modelling/additivity/)).

Check the returns grain against the data before you commit to it:

```sql
-- try
SELECT COUNT(*) AS returns,
       COUNT(DISTINCT order_id || '-' || product_id) AS distinct_lines_returned,
       SUM(CASE WHEN i.order_id IS NULL THEN 1 ELSE 0 END) AS returns_without_a_sale
FROM returns r
LEFT JOIN order_items i USING (order_id, product_id)
```

204 returns, 204 distinct lines, and every return matches a sold line. One row per return is safe, and each can be priced from its order line.

## 5. Step 4: the ERD

<!--fig:capstone-erd-->

Draw it with the facts in the middle and the dimensions around them, crow's feet on the fact side (many) and a single bar on the dimension side (one). Tools: any diagram tool, [dbdiagram.io](https://dbdiagram.io/) style text, or Mermaid's `erDiagram` written in a code block marked `mermaid` in the repo's README, which GitHub draws as a diagram:

```text
erDiagram
  dim_date     ||--o{ fact_sales   : "order date"
  dim_product  ||--o{ fact_sales   : sold
  dim_store    ||--o{ fact_sales   : "sold at"
  dim_customer ||--o{ fact_sales   : "bought by"
  dim_date     ||--o{ fact_returns : "return date"
  dim_store    ||--o{ fact_store_daily : "per day"
```

## 6. Step 5: dimensions, history and keys

| Dimension | Key | Natural key | Main attributes | History |
|---|---|---|---|---|
| dim_date | date_key (yyyymmdd) | full_date | year, quarter, month, month name, weekday, is_weekend, is_promo_day | none (type 0) |
| dim_product | product_key | product_id | name, brand, category, department, list_price | type 1 (overwrite) |
| dim_store | store_key | store_id | name, city, province, region, opened_on, size band | type 1 |
| dim_customer | customer_key | customer_id | name, city, province, loyalty_tier, party_email | **type 2 on city, province, tier**, valid_from, valid_to, is_current |
| dim_promotion | promotion_key | promo_id | name, discount, start, end; -1 = "No promotion" | type 1 |
| dim_return_reason | return_reason_key | reason text | reason, reason group | type 1 |

Every dimension gets a -1 "Unknown" (or "Guest", "No promotion") row so no fact key is ever NULL ([Lesson 4.1](/learn/courses/data-modelling/surrogate-keys/)).

## 7. Step 6: the data dictionary

A **data dictionary** lists every table and column with its type, meaning, source and rules. Start it from the database itself, then add the meanings by hand:

```sql
-- try
SELECT m.name AS table_name, p.cid + 1 AS position, p.name AS column_name, p.type AS data_type
FROM sqlite_master m
JOIN pragma_table_info(m.name) p
WHERE m.name IN ('orders', 'order_items')
ORDER BY m.name, p.cid
```

For the warehouse, one row per column like this:

| Table | Column | Type | Meaning | Source / rule |
|---|---|---|---|---|
| fact_sales | sales_amount | DECIMAL(12,2) | value of the line after discount | order_items: quantity × unit_price × (1 − discount), rounded to cents |
| fact_sales | customer_key | INT | who bought it, as they were on the order date | dim_customer row valid on order_date; -1 for guests |
| dim_customer | is_current | BIT | 1 for the latest version of the customer | set by the SCD2 load |

fibub's [[data-dictionary]] tool can turn a table like this into a tidy document to commit next to your SQL.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a grain is an **index set**: the set of key combinations that identify one row. Declaring it means claiming the map from (order_id, product_id) to a row is a function and is injective: each pair appears at most once. Profiling tests that claim on real data.

**Equation:** grain G is valid when |table| = |distinct values of G|. For order_items, 7,310 = 7,310, so G = (order_id, product_id) holds. A dimension can join to the fact only if it is a function of the grain: product attributes depend on product_id ⊂ G, so they fit; an order-level total does not depend on product_id, so it does not belong at this grain as an additive measure.

**Analogy:** a seating plan. The grain is "one seat per row and number". If two tickets show the same seat, the plan is wrong, however nice the theatre.

**Try it:** a table has 5,000 rows and 4,980 distinct (store, date) pairs. Is (store, date) its grain? (No: 20 rows share a pair, so something else, perhaps a till or shift, is part of the grain.)
</details>

## 8. Worked example: the design decisions document

Reviewers read decisions more closely than diagrams. Write a short `docs/decisions.md` with one numbered entry per choice, each saying what, why and the alternative you rejected. Three examples, with the numbers that justify them:

1. **Cancelled orders are not in fact_sales.** 119 of 4,064 orders (2.9%) are cancelled; finance reports completed sales only. Alternative rejected: keep them with a status column, which would force a filter into every measure.
2. **Customer history is type 2 on city, province and tier.** Marketing asks "what tier were they when they bought?" (the brief). Name changes are type 1.
3. **Guests map to customer -1.** 482 orders (11.9%) have no customer. A NULL key would drop them from any report that joins to dim_customer.

## 9. Practice

```sql
-- exercise: Profile the customers table: return the number of rows, the number of NULL emails, the number of NULL tiers and the number of cities with spaces at either end.
-- hint: COUNT(*), then SUM(CASE WHEN ... THEN 1 ELSE 0 END) for each check; city <> trim(city) finds the spaces.
SELECT COUNT(*) AS customers
FROM customers
-- answer:
SELECT COUNT(*) AS customers,
       SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) AS null_emails,
       SUM(CASE WHEN loyalty_tier IS NULL THEN 1 ELSE 0 END) AS null_tiers,
       SUM(CASE WHEN city <> trim(city) THEN 1 ELSE 0 END) AS spaced_cities
FROM customers
```

```sql
-- exercise: The store-day snapshot needs one row per store per day, even with no sales. How many rows will it have for 2024-2025? Count the store-day pairs that have at least one order, and compare with 12 stores × 731 days.
-- hint: COUNT(DISTINCT store_id || '-' || order_date) from orders, and 12 * 731 as a second column.
SELECT COUNT(*) AS store_days_with_orders
FROM orders
-- answer:
SELECT COUNT(DISTINCT store_id || '-' || order_date) AS store_days_with_orders,
       12 * 731 AS store_days_in_snapshot
FROM orders
```

```sql
-- exercise: Check the promotion rule: list each promotion with how many orders fell inside its dates and how many orders carry its promo_id. They should match.
-- hint: LEFT JOIN orders on order_date BETWEEN start_date AND end_date, and count orders whose promo_id equals the promotion's.
SELECT promo_id, promo_name
FROM promotions
-- answer:
SELECT p.promo_id, p.promo_name,
       COUNT(o.order_id) AS orders_in_dates,
       SUM(CASE WHEN o.promo_id = p.promo_id THEN 1 ELSE 0 END) AS orders_tagged
FROM promotions p
LEFT JOIN orders o ON o.order_date BETWEEN p.start_date AND p.end_date
GROUP BY p.promo_id, p.promo_name
ORDER BY p.promo_id
```

**Try it on your own data:** profile any CSV with [[csv-profiler]] before you design a model for it.

**New words:** *source profiling*, *design decision*, *data dictionary*, *index set*.
