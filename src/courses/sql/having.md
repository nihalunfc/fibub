---
title: 'HAVING: filtering groups'
seoTitle: 'SQL HAVING vs WHERE explained with examples'
summary: 'WHERE filters rows before grouping; HAVING filters groups after. Learn when to use each, use both in one query, and watch the difference step by step.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Where does a condition like COUNT(*) >= 10 go?'
    choices: ['WHERE', 'HAVING', 'ORDER BY']
    ans: 1
    why: A count only exists once rows are grouped, so the test goes in HAVING, which runs after GROUP BY.
  - q: 'Where should status = ''completed'' go in a query that counts orders per store?'
    choices: ['WHERE, so cancelled rows never reach the groups', 'HAVING, always', 'It does not matter at all']
    ans: 0
    why: It tests single rows, so it belongs in WHERE. That removes rows before they are counted. (HAVING could not even see status per row once grouped.)
  - q: Which runs first?
    choices: ['HAVING', 'WHERE', 'They run at the same time']
    ans: 1
    why: The order is FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.
---

**Module 3 · about 25 minutes · read first: 3.2.** You'll be able to keep only the groups you want with HAVING, choose correctly between WHERE and HAVING, and use both in one query.

## 1. Why this matters

Many questions filter on a total: "customers with 10 or more orders", "products that sold over 300 units", "stores with more than 150 orders this year". These are the questions behind loyalty lists, best-seller lists and stock alerts. Knowing that the total test goes in HAVING, while row tests stay in WHERE, is also a favourite interview question.

## 2. HAVING tests groups

HAVING comes right after GROUP BY. Like WHERE it holds a condition, but it tests each **group**, so it can use aggregates.

```sql
-- try
SELECT customer_id, SUM(amount) AS spent
FROM mini_orders
GROUP BY customer_id
HAVING SUM(amount) > 40
```

Press **Show how it runs**, then **Play**. GROUP BY makes four groups and the aggregate step gives each a total (50, 20, 135, 60). At the HAVING step, customer 2's group (20) fades out. Three groups are left.

## 3. WHERE vs HAVING

The running order explains everything: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.

| | WHERE | HAVING |
|---|---|---|
| Runs | before grouping | after grouping |
| Tests | one row | one group |
| Can use SUM, COUNT...? | no | yes |

Put an aggregate in WHERE and you get an error:

```sql
-- fails
SELECT product_id, SUM(quantity) AS units
FROM order_items
WHERE SUM(quantity) > 300
GROUP BY product_id
```

Move it to HAVING:

```sql
-- try
SELECT product_id, SUM(quantity) AS units
FROM order_items
GROUP BY product_id
HAVING SUM(quantity) > 300
```

Three products have sold more than 300 units: 15 (Milk 2% 4 L), 19 (Eggs dozen) and 20 (Paneer 350 g).

## 4. Using both

Row tests go in WHERE, group tests in HAVING, in the same query. Which stores took more than 150 **completed** orders in 2025?

```sql
-- try
SELECT store_id, COUNT(*) AS orders
FROM orders
WHERE order_date LIKE '2025%' AND status = 'completed'
GROUP BY store_id
HAVING COUNT(*) > 150
ORDER BY orders DESC
```

WHERE removes 2024 and cancelled orders first, so they're never counted. Then HAVING keeps the groups over 150.

Could you put `status = 'completed'` in HAVING instead? In SQLite it may even run, but it would test one leftover status per group rather than every row, and other databases reject it. Rule of thumb: **if the test makes sense for a single row, put it in WHERE.** It's also faster, since the database groups fewer rows.

## 5. Watch out for the NULL group

Who are Northbay's most frequent customers?

```sql
-- try
SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 13
ORDER BY orders DESC
```

The top "customer" has 482 orders and a blank id: it's every guest order lumped into one NULL group. Remove it with a row test in WHERE: `WHERE customer_id IS NOT NULL`. Add it and run again: five real customers have 13 or more orders.

## 6. HAVING as a data-quality check

HAVING is great for finding odd values. Group customers by city and keep the tiny groups:

```sql
-- try
SELECT city, COUNT(*) AS customers
FROM customers
GROUP BY city
HAVING COUNT(*) < 5
```

Eleven "cities" with only 1 to 3 customers each. They look like real cities, but each has a trailing space ("Ottawa " is a different value from "Ottawa"). Rare values are often typos; `GROUP BY ... HAVING COUNT(*) < n` finds them fast. Lesson 7.5 builds a full set of checks like this.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** HAVING is a selection σ applied to the *output* of grouping, while WHERE is a selection applied to the input. Same operator, different table.

**Equation:** WHERE + GROUP BY + HAVING = σ<sub>h</sub>( γ<sub>g; aggs</sub>( σ<sub>w</sub>(T) ) ). A row test can move between the two places only if it uses grouping columns: σ<sub>store_id = 4</sub> gives the same answer before or after γ<sub>store_id</sub>. A test on an aggregate can't move inside, because the aggregate doesn't exist yet.

**Analogy:** a bake sale. WHERE throws out burnt biscuits before they're boxed; HAVING throws out boxes that weigh too little. You can't weigh a box before it's packed. It breaks down a little because SQLite lets you write odd things in HAVING that stricter databases refuse.

**Try it:** HAVING store_id = 4 and WHERE store_id = 4 in a query grouped by store_id: same answer? (Yes, because store_id is a grouping column. WHERE is still the better place.)
</details>

## 7. Worked example

*Question:* which products were returned 8 or more times?

1. Start from `returns`: one row per returned product.
2. Group by `product_id` and count.
3. Keep groups with `COUNT(*) >= 8`, most returned first.

```sql
-- try
SELECT product_id, COUNT(*) AS returns
FROM returns
GROUP BY product_id
HAVING COUNT(*) >= 8
ORDER BY returns DESC
```

4. Result: four products. Product 50 (Sponges 6 pack) leads with **12**, then 46 (Dish soap) and 58 (Bluetooth speaker) with **9** each, and 53 (Plush bear) with **8**. A buyer would check the Sponges first, though a fair comparison also needs how many were *sold* (a rate, not a count), which takes a join (Module 4).

## 8. Practice

```sql
-- exercise: List the order dates (days) with 14 or more orders, busiest first.
-- hint: GROUP BY order_date, then HAVING COUNT(*) >= 14.
SELECT order_date, COUNT(*) AS orders
FROM orders
GROUP BY order_date
ORDER BY orders DESC
-- answer:
SELECT order_date, COUNT(*) AS orders
FROM orders
GROUP BY order_date
HAVING COUNT(*) >= 14
ORDER BY orders DESC
```

```sql
-- exercise: List the customers (not guests) with 13 or more orders: customer_id and their order count.
-- hint: Guests have a NULL customer_id; remove them in WHERE. The count test goes in HAVING.
SELECT customer_id, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 13
-- answer:
SELECT customer_id, COUNT(*) AS orders
FROM orders
WHERE customer_id IS NOT NULL
GROUP BY customer_id
HAVING COUNT(*) >= 13
```

```sql
-- exercise: Which departments have more than 2 categories? Show the department and its number of categories.
-- hint: FROM categories, GROUP BY department, HAVING COUNT(*) > 2.
SELECT department, COUNT(*) AS categories
FROM categories
GROUP BY department
-- answer:
SELECT department, COUNT(*) AS categories
FROM categories
GROUP BY department
HAVING COUNT(*) > 2
```

**New words:** *HAVING*, *group filter*, *row filter*.
