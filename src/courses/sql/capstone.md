---
title: 'Capstone: the Northbay SQL casebook'
seoTitle: 'SQL portfolio project for data analysts: a SQL casebook'
summary: 'Your portfolio project: answer 30 business questions about Northbay in SQL, publish them as a tidy GitHub repo (question, query, result, one-line insight), and learn how to present it on a portfolio and in interviews.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: What should every entry in the casebook have?
    choices: ['Only the SQL query', 'The question, the query, the result and a one-line insight', 'A long essay on the method']
    ans: 1
    why: 'A reader (often a hiring manager with two minutes) wants to see that you can turn a question into a correct query and the result into a business sentence.'
  - q: 'Promotion days average 8.01 completed orders and other days 5.09. What is the most honest insight?'
    choices: ['Promotions cause 57% more orders', 'Promotion days are busier, but promotions run in busy seasons like Black Friday, so part of the lift may be the season', 'Promotions make no difference']
    ans: 1
    why: 'A comparison like this shows a link, not a cause. Saying what else could explain it is what makes an analyst trustworthy.'
  - q: Why write down your definitions (such as what revenue means) at the top of the README?
    choices: ['It makes the repo longer', 'So every answer uses the same rules and a reader can check them', 'GitHub requires it']
    ans: 1
    why: 'Thirty answers that each define revenue differently can''t be compared. One stated definition makes the casebook consistent and checkable.'
---

**Module 10 · about 35 minutes to read, a few weekends to build · read first: the whole course.** You'll be able to plan, build and present a SQL portfolio project that shows employers you can answer real business questions.

## 1. Why this matters

Certificates say you studied SQL; a casebook *shows* you can use it. Hiring managers for analyst and BI roles look for exactly this: clear questions, correct queries, sensible results and a short business takeaway. It also gives you a ready answer to "tell me about a project you're proud of", and thirty worked examples to revise from before every interview.

## 2. What the casebook is

The **Northbay SQL casebook** is a public GitHub repository with 30 business questions about Northbay, each answered with:

1. **The question**, in business words.
2. **The query**, readable ([Lesson 9.4](/learn/courses/sql/readable-sql/)).
3. **The result**, as a small table (top rows only if it's long).
4. **The insight**: one sentence a manager could act on.

You write every query yourself in the [sandbox](/learn/courses/sql/sandbox/) or any lesson editor. The worked starters below show the standard to aim for; the other questions are yours.

## 3. Definitions first

Write these at the top of your README and stick to them, so all 30 answers agree:

- **Revenue** = SUM(quantity × unit_price × (1 − discount)) over order_items in **completed** orders.
- **Order** = one row in orders; **customer** = a non-NULL customer_id (guests are counted separately).
- **Period**: calendar months and years by order_date; the data runs from 1 January 2024 to 31 December 2025.
- **Return rate** = completed orders with at least one return ÷ completed orders.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a metric is a function from a set of rows to a number. Defining it once, with its filter and its aggregate, makes every answer in the casebook a value of the *same* function on a different slice.

**Equation:** revenue(S) = Σ<sub>r ∈ S</sub> q·p·(1 − d), where S = σ<sub>status='completed' ∧ slice</sub>(orders ⋈ order_items). Because SUM is additive, revenue over disjoint slices adds up: revenue(2024) + revenue(2025) = revenue(all). That is a free check for your casebook: the parts must add to the whole. (A rate or an average is not additive; never add two return rates.)

**Analogy:** a recipe card. Once "a cup" is defined, every recipe in the book means the same amount.

**Try it:** your channel answers give store revenue $42,206.49 and online $11,778.96 for 2024. What must the 2024 total be? ($53,985.45, which matches $53,985.46 to within the one-cent rounding of each part. Rounding differences of a cent are fine; bigger gaps mean a filter differs.)
</details>

## 4. The 30 questions

Answer them in any order. Each one names the main skill in brackets so you can go back to the lesson.

**Sales**
1. What were total revenue and completed orders in 2024 and 2025, and the year-over-year growth? (GROUP BY, growth)
2. What is monthly revenue, with month-over-month and year-over-year growth? (LAG)
3. Which month was the best ever, and which was the worst? (ORDER BY, LIMIT)
4. What is the average order value by year and by channel? (COUNT DISTINCT)
5. What share of revenue comes from each department each year? (window SUM)
6. What is the running total of revenue through 2025, and when did it pass 2024's full-year total? (running totals)

**Customers**
7. How many customers ordered each month, and how many of them were new that month? (cohorts)
8. Build a monthly cohort retention table for the 2024 cohorts. (cohorts)
9. What is the customer funnel from member to first, second, fifth and tenth order? (funnels)
10. Score every customer with RFM and size each segment by customers and revenue. (NTILE, CASE)
11. Who are the top 10 customers by revenue, and what share of revenue do the top 10% bring in? (ranking, NTILE)
12. What share of orders are from guests, by channel and year? (NULL)

**Products**
13. What are the 10 best-selling products by quantity and by revenue? Are they the same? (GROUP BY)
14. Which product sold best in each department in 2025? (top N per group)
15. Which pairs of products are bought together most often? (self-join)
16. Which products have the highest return rate, among products with at least 50 lines sold? (HAVING)
17. What is the gross margin by category, using unit_cost from products? (joins, arithmetic)
18. Which products sold in fewer than 18 of the 24 months? (calendar table)

**Stores and channels**
19. Rank the physical stores by 2025 revenue and by revenue per square foot. (ranking)
20. How fast did online grow compared with stores, by quarter? (pivot, growth)
21. Which weekday is busiest in each channel? (dates, pivot)
22. What is each store's longest streak of days with sales? (gaps and islands)
23. How did Calgary and Edmonton (Northbay Stampede and Northbay River Valley) compare month by month? (pivot)
24. Which region grew the most from 2024 to 2025? (joins to regions)

**Operations and data quality**
25. What are the most common return reasons, by channel? (pivot)
26. How many days after the order do returns arrive, on average and by reason? (dates)
27. Do promotion days have more orders than other days? What else could explain the difference? (CASE, honest comparisons)
28. What share of orders were cancelled, by channel and month? Any month that stands out? (rates)
29. Find the data-quality problems: duplicate customers, NULL emails and tiers, cities with stray spaces. How many of each? (data quality)
30. Write the org chart: every employee with their manager, and the number of people under each manager. (self-join, recursive CTE)

## 5. Three worked starters

**Question 1.** What were revenue and completed orders by year, and the growth?

```sql
-- try
WITH yearly AS (
  SELECT strftime('%Y', o.order_date) AS year,
         COUNT(DISTINCT o.order_id) AS orders,
         SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY year
)
SELECT year, orders,
       ROUND(revenue, 2) AS revenue,
       ROUND(revenue / orders, 2) AS avg_order_value,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY year)) / LAG(revenue) OVER (ORDER BY year), 1) AS revenue_growth_pct
FROM yearly
ORDER BY year
```

*Result:* 2024: 1,754 orders, $53,985.46. 2025: 2,191 orders, $72,594.52, growth 34.5%. Average order value rose from $30.78 to $33.13.

*Insight:* "Revenue grew 34.5% in 2025, from both more orders (+25%) and bigger baskets (+8%)."

**Question 27.** Do promotion days have more orders?

```sql
-- try
WITH daily AS (
  SELECT order_date,
         MAX(promo_id IS NOT NULL) AS promo_day,
         COUNT(*) AS orders
  FROM orders
  WHERE status = 'completed'
  GROUP BY order_date
)
SELECT CASE WHEN promo_day = 1 THEN 'Promotion' ELSE 'Normal' END AS day_type,
       COUNT(*) AS days,
       ROUND(AVG(orders), 2) AS avg_orders_per_day
FROM daily
GROUP BY day_type
```

*Result:* 76 promotion days average 8.01 completed orders; 655 normal days average 5.09.

*Insight:* "Promotion days are about 57% busier, but two of the seven promotions are Black Friday and one is Boxing Week, already busy times, so not all of the lift is the discount." This is the kind of honest caveat interviewers love.

**Question 12 (part).** What share of each channel's orders are from guests?

```sql
-- try
SELECT channel,
       COUNT(*) AS orders,
       COUNT(*) - COUNT(customer_id) AS guest_orders,
       ROUND(100.0 * (COUNT(*) - COUNT(customer_id)) / COUNT(*), 1) AS guest_pct
FROM orders
GROUP BY channel
```

*Insight:* write your own. Is the guest share similar in both channels? What would a loyalty team do with that?

## 6. How to lay out the repo

Name it something like `northbay-sql-casebook`. A layout that is easy to browse on GitHub:

```
northbay-sql-casebook/
├── README.md              ← start here: summary, definitions, the 30 questions with links
├── queries/
│   ├── 01-sales/
│   │   ├── q01-revenue-by-year.sql
│   │   └── q02-monthly-growth.sql
│   ├── 02-customers/
│   ├── 03-products/
│   ├── 04-stores-channels/
│   └── 05-operations-quality/
├── results/
│   └── q01-revenue-by-year.md   ← the result table (or a .csv)
└── images/                       ← one or two charts, at most
```

At the top of each .sql file, a comment block: the question number and wording, the definitions it uses, and the date you ran it.

**The README** does most of the work, because most visitors never open a folder. Put in it:

1. **One paragraph** saying what this is: "30 business questions about a fictional Canadian retail chain, answered in SQL (SQLite dialect)."
2. **Three headline insights**, each one sentence with a number.
3. **The data**: Northbay Retail is a made-up practice database from fibub's free SQL course, generated in the browser. Name the tables and link to [Lesson 1.2](/learn/courses/sql/meet-northbay/). Say plainly that the data is not real.
4. **Definitions** (section 3 above).
5. **The questions**: a table with number, question, skill and a link to the query file. For your best 5–8 questions, show the query, the result and the insight right in the README.
6. **What I'd do next**: two or three lines, such as "add a dashboard" or "repeat the analysis on a public dataset".

One entry in the README looks like this:

```
### Q27. Do promotion days have more orders?
Query: queries/05-operations-quality/q27-promotion-days.sql

| day_type  | days | avg_orders_per_day |
|-----------|------|--------------------|
| Normal    | 655  | 5.09               |
| Promotion | 76   | 8.01               |

Insight: promotion days are ~57% busier, but most promotions fall in busy seasons, so the true effect of the discount is smaller.
```

## 7. Presenting it

**On your portfolio site or LinkedIn:** a short card with the title, one sentence ("30 retail questions answered in SQL: cohorts, funnels, RFM, window functions"), your best insight with its number, one chart, and the GitHub link. Pin the repo on your GitHub profile.

**In an interview,** when asked about a project, use a short structure:

1. **Context** (one sentence): "I wanted to practise the questions a retail analyst gets, so I answered 30 of them on a practice database."
2. **One question in depth:** pick a hard one you can explain without notes (cohort retention, RFM or gaps-and-islands). Say what the business would want, the grain, the CTE steps, one trap you hit and how you checked the answer.
3. **The insight and the caveat:** "Promotion days were 57% busier, but they fall in peak seasons, so I wouldn't credit the discount with all of that."
4. **What you'd do with real data:** "With a real calendar of campaigns, I'd compare each promotion with the same weeks the year before."

Be ready to write one of your queries again live: interviewers sometimes ask. Choose questions you really understand over the cleverest ones.

## 8. Practice

Two of the thirty, checked for you, to warm up:

```sql
-- exercise: Question 28 (part). What share of orders were cancelled in each channel? Show channel, orders, cancelled and the cancelled % (2 decimals).
-- hint: SUM(status = 'cancelled') counts cancellations; divide by COUNT(*) with 100.0.
SELECT channel, COUNT(*) AS orders
FROM orders
GROUP BY channel
-- answer:
SELECT channel,
       COUNT(*) AS orders,
       SUM(status = 'cancelled') AS cancelled,
       ROUND(100.0 * SUM(status = 'cancelled') / COUNT(*), 2) AS cancelled_pct
FROM orders
GROUP BY channel
```

```sql
-- exercise: Question 26 (part). On average, how many days after the order date do returns happen, by reason? Show reason and the average (1 decimal), longest first.
-- hint: Join returns to orders on order_id, then AVG(julianday(return_date) - julianday(order_date)).
SELECT reason, COUNT(*) AS returns
FROM returns
GROUP BY reason
-- answer:
SELECT r.reason,
       ROUND(AVG(julianday(r.return_date) - julianday(o.order_date)), 1) AS avg_days
FROM returns r
JOIN orders o ON o.order_id = r.order_id
GROUP BY r.reason
ORDER BY avg_days DESC
```

**Try it on your own data:** once the casebook is done, repeat five of the questions on a public dataset with [[sql-playground]] and add them as a bonus section; tidy the CSV first with [[data-cleaner]].

**New words:** *casebook*, *metric definition*, *insight*, *caveat*.
