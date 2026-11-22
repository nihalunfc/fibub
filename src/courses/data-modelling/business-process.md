---
title: 'Start from a business process'
seoTitle: 'Dimensional modelling: start from a business process'
summary: 'Kimball-style design starts with a business process such as selling or returning, not with a report or a department. Find Northbay''s processes, measure how many events each one makes, and meet the four design steps.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Which of these is a business process in the Kimball sense?
    choices: ['Customers returning products', 'The finance department', 'The monthly sales dashboard']
    ans: 0
    why: A business process is an activity that happens again and again and leaves records, usually named with a verb. Departments and reports use processes; they are not processes.
  - q: What is the first of the four design steps?
    choices: ['Pick the business process', 'List the dimensions', 'Write the CREATE TABLE statements']
    ans: 0
    why: Process, then grain, then dimensions, then facts. Everything else depends on which process you are modelling.
  - q: Why not build one table per report?
    choices: ['Reports overlap and change, so the same numbers end up computed differently in many places', 'Reports cannot be built from tables', 'It uses too few tables']
    ans: 0
    why: Modelling the process once gives every report the same numbers. Report-shaped tables multiply and drift apart.
---

**Module 2 · about 25 minutes · read first: 1.3.** You'll be able to name the business processes in a company, find the source rows each one leaves, size them with SQL, and say the four steps of a dimensional design.

## 1. Why this matters

The usual request sounds like "can you build me a sales dashboard?". If you build a table shaped like that one dashboard, the next request needs another table, and soon five tables give five different sales totals. *Dimensional modelling*, the approach Ralph Kimball made popular, avoids that by modelling what the business **does** rather than what one report shows. Most warehouses you will meet, and most Power BI models, follow it.

## 2. What a business process is

A *business process* is an activity the organisation performs again and again, where each occurrence leaves a record. It is usually a verb: *sell*, *return*, *ship*, *pay*, *sign up*. Each occurrence is an *event*, with a when, a where, a who, a what, and some numbers.

Departments are not processes (Finance uses many processes). Reports are not processes (a report reads from one or more). At Northbay:

| Process | One event is ... | Source rows |
|---|---|---|
| Selling | a product bought on an order | `orders` + `order_items` |
| Returning | a product brought back | `returns` |
| Signing up members | a new loyalty member | `customers.joined_on` |
| Running promotions | a sale period at the stores | `promotions` |
| Staffing | an employee working at a store | `employees` |

## 3. Look at one event

Every event carries the same kind of context. Here are three returns with their who, what, where and when, plus why:

```sql
-- try
SELECT r.return_id, r.return_date, r.reason,
       o.store_id, o.customer_id, p.product_name
FROM returns r
JOIN orders o ON o.order_id = r.order_id
JOIN products p ON p.product_id = r.product_id
ORDER BY r.return_id
LIMIT 3
```

Return 1 happened on 14 January 2024 at store 2: customer 10 brought back Laundry detergent because it was the wrong size. When (date), where (store), who (customer), what (product), why (reason). Those questions will become the *dimensions* in Lesson 2.3.

## 4. Size each process

Before choosing where to start, find out how much each process produces. One UNION ALL gives a quick census:

```sql
-- try
SELECT 'Selling (order lines)' AS process, COUNT(*) AS events FROM order_items
UNION ALL
SELECT 'Returning', COUNT(*) FROM returns
UNION ALL
SELECT 'Signing up members', COUNT(*) FROM customers
UNION ALL
SELECT 'Running promotions', COUNT(*) FROM promotions
UNION ALL
SELECT 'Staffing', COUNT(*) FROM employees
```

And how do two processes move over time? Put sales lines and returns side by side by month:

```sql
-- try
SELECT month,
       SUM(process = 'sale') AS sale_lines,
       SUM(process = 'return') AS returns
FROM (
  SELECT strftime('%Y-%m', o.order_date) AS month, 'sale' AS process
  FROM order_items i JOIN orders o ON o.order_id = i.order_id
  UNION ALL
  SELECT strftime('%Y-%m', return_date), 'return' FROM returns
)
GROUP BY month
ORDER BY month
LIMIT 12
```

The two move together: December 2024 had 409 sale lines and 13 returns, February 180 and 7. Selling is by far the biggest process and the one almost every question touches, so it is where Northbay's warehouse starts.

## 5. The four design steps

Once a process is chosen, every dimensional design follows the same four steps, in this order:

<!--fig:four-steps-->

The rest of this module takes them one at a time: [grain](/learn/courses/data-modelling/declare-grain/), [facts and dimensions](/learn/courses/data-modelling/facts-and-dimensions/), and putting them together in [the star schema](/learn/courses/data-modelling/star-schema/). After that, [the bus matrix](/learn/courses/data-modelling/bus-matrix/) plans all the processes together.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a business process is a stream of events, and a fact table is that stream written down, one row per event (or per bundle of events, as later lessons show).

**Equation:** let E be the set of events of a process. A fact table is a function F: E → D₁ × D₂ × … × Dₖ × ℝʲ that gives each event its k context values (date, store, product, ...) and its j measurements (quantity, amount). Different processes have different E, so they get different fact tables, even when they share some Dᵢ.

**Analogy:** a shop's diary. Each line records one thing that happened: when, who, what, how much. You keep one diary per kind of happening (sales, returns, deliveries) rather than one diary per person who reads it.

**Try it:** is "monthly sales by region" a process, an event or a report? (A report: it summarises events of the selling process.)
</details>

## 6. Worked example: which process first?

*Question:* Northbay can fund one fact table this quarter. Selling or returning?

1. **Volume and reach.** Selling has 7,310 events; returning has 204. Nearly every dashboard (sales, margin, basket size, store league tables) needs selling.
2. **Readiness.** Both sources are clean and keyed. Returns point back at order lines, so they are easiest to add once selling is modelled.
3. **Value.** Returns matter (refunds cost money), but a return rate needs sales as the denominator anyway.
4. Decision: **selling first**, returns second, and both will share the same date, product, store and customer tables. Good teams score each process on business value and on how hard the data is, then start top right: high value, easy data.

## 7. Practice

```sql
-- exercise: The signing-up process: count new loyalty members per year of joined_on, oldest year first.
-- hint: GROUP BY strftime('%Y', joined_on) and ORDER BY it.
SELECT joined_on
FROM customers
-- answer:
SELECT strftime('%Y', joined_on) AS year, COUNT(*) AS new_members
FROM customers
GROUP BY year
ORDER BY year
```

```sql
-- exercise: The returning process: count returns per reason, most common first.
-- hint: GROUP BY reason, ORDER BY COUNT(*) DESC.
SELECT reason
FROM returns
-- answer:
SELECT reason, COUNT(*) AS returns
FROM returns
GROUP BY reason
ORDER BY returns DESC
```

```sql
-- exercise: Size the selling process by year: show the number of order lines per year of order_date.
-- hint: Join order_items to orders and GROUP BY strftime('%Y', order_date).
SELECT COUNT(*) AS lines
FROM order_items
-- answer:
SELECT strftime('%Y', o.order_date) AS year, COUNT(*) AS lines
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
GROUP BY year
```

**New words:** *dimensional modelling*, *business process*, *event*, *four-step design*.
