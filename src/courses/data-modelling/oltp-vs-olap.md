---
title: 'Two kinds of database: running the shop and understanding it'
seoTitle: 'OLTP vs OLAP explained with examples'
summary: 'An OLTP database runs the business one small transaction at a time; an OLAP warehouse answers big questions across years of history. See both kinds of query on Northbay and why they need differently shaped tables.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: Which question is a typical OLTP query?
    choices: ['Total sales per region per year', 'The products and quantities in order 1038', 'Average basket size by month']
    ans: 1
    why: OLTP queries touch a few rows found by their key, such as one order. The other two scan thousands of rows and add them up, which is OLAP work.
  - q: Why do most companies copy data out of the till database into a separate warehouse?
    choices: ['Big analytical scans would slow the tills down, and the till database keeps no history', 'SQL only works in a warehouse', 'Warehouses are always cheaper']
    ans: 0
    why: Long scans compete with checkouts for the same database, and operational systems overwrite old values. A warehouse is loaded in batches, keeps history and is shaped for reading.
  - q: 'How are OLAP tables usually shaped compared with OLTP tables?'
    choices: ['Fewer, wider tables that repeat some values on purpose', 'Exactly the same', 'One column per table']
    ans: 0
    why: Analytical tables trade some repetition for fewer joins and simpler queries. Operational tables avoid repetition so each fact is changed in one place.
sources:
  - 'Microsoft Learn, Azure Architecture Center: Online transaction processing (OLTP) https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/online-transaction-processing'
  - 'Microsoft Learn, Azure Architecture Center: Online analytical processing (OLAP) https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/online-analytical-processing'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 1: Data Warehousing, Business Intelligence and Dimensional Modeling Primer'
---

**Module 1 · about 20 minutes · read first: [SQL for analysts 4.2](/learn/courses/sql/inner-join/).** You'll be able to tell an operational (OLTP) query from an analytical (OLAP) one, say why they live in different databases, and explain why that changes how tables are designed.

<div class="bigidea">An OLTP database runs the business one tiny change at a time; an OLAP warehouse reads huge piles of history to answer questions, so the two are shaped differently.</div>

**In everyday terms:** a shop till and the year-end stocktake. The till rings up one sale in a second. The stocktake counts everything in the shop and adds it up. You would not do the stocktake at the till during the lunch rush.

## 1. Why this matters

Every BI job starts with the same surprise: the data you need lives in a database built for something else. The tills, the website and the stock system are built to take thousands of tiny updates safely. Dashboards need to read millions of rows and add them up. A data model is the bridge between those two worlds, and this course is about building it. Interviewers often open with "what is the difference between OLTP and OLAP?"

## 2. Two jobs, two databases

*OLTP* (online transaction processing) is the database that runs the business. Each checkout at a Northbay till writes one row to `orders` and a few rows to `order_items`, and it must never lose or double one.

*OLAP* (online analytical processing) is the database that helps people understand the business: sales per month, best products, returns by region. It reads lots of rows and writes almost none, apart from a nightly load. That database is usually called a *data warehouse*.

<!--fig:oltp-olap-->

## 3. An OLTP query: one order, found by its key

When a customer asks "what did I buy?", the till looks up one order by its key. Only four rows of `order_items` are touched.

```sql
-- try
SELECT o.order_id, o.order_date, p.product_name, i.quantity, i.unit_price, i.discount
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id
WHERE o.order_id = 1038
```

Order 1038 was placed at store 2 on 10 January 2024, during the Winter warm-up sale, so every line has a 10% discount. Press **Show how it runs** and notice that WHERE leaves just four rows: OLTP work is small and precise.

## 4. An OLAP query: everything, added up

A manager asks how each department sold, year by year. Now every order line in two years is read, joined and summed.

```sql
-- try
SELECT c.department,
       strftime('%Y', o.order_date) AS year,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed'
GROUP BY c.department, year
ORDER BY c.department, year
```

Count what each query had to read:

```sql
-- try
SELECT 'OLTP: order 1038' AS query, COUNT(*) AS order_lines_read FROM order_items WHERE order_id = 1038
UNION ALL
SELECT 'OLAP: departments by year', COUNT(*) FROM order_items
```

The department query reads all 7,310 order lines to return 8 rows. On Northbay that takes a blink. On a real chain with a billion lines, running it on the till database at lunchtime would slow down every checkout. That is the main reason the two jobs get separate databases.

## 5. Why the shapes differ

The OLTP tables above are *normalised*: each fact is stored once. The department "Home" is written in one row of `categories`, not on every order line. That is perfect for writing, because a renamed department is one update. But to read it, the OLAP query had to walk through three joins.

A warehouse flips the trade-off. It is loaded in batches, then only read, so it can afford to repeat "Home" on many rows if that makes questions shorter and faster. The next two lessons show both sides: [normal forms](/learn/courses/data-modelling/normal-forms/) and [why analytics breaks the rules](/learn/courses/data-modelling/why-denormalise/).

One more difference: history. The till database stores a customer's *current* loyalty tier. If Uma moves from Bronze to Gold, the old value is overwritten. A warehouse is expected to remember that she was Bronze last year, so last year's report doesn't change. Module 5 is all about that.

<div class="meaning">

<dl>
<dt>OLTP</dt><dd>Online transaction processing: the database that takes each sale, payment or sign-up as it happens.</dd>
<dt>OLAP</dt><dd>Online analytical processing: reading many rows and adding them up to answer a question.</dd>
<dt>Data warehouse</dt><dd>A separate database, loaded in batches, that keeps history and is shaped for reading.</dd>
<dt>Selectivity</dt><dd>Rows a query touches divided by all rows in the table. Near 0 is OLTP work; near 1 is OLAP work.</dd>
<dt>Physical meaning</dt><dd>An OLTP query finds a handful of rows by their key and changes or shows them. An OLAP query scans nearly every row, joins it to its descriptions and squeezes it into a few totals.</dd>
</dl>

</div>

<div class="myth">

**"A warehouse is just a copy of the live database."** A copy would still need many joins for every question, and it would still forget old values. A warehouse is reshaped for reading and keeps history that the live system overwrites.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>The till database.</b> <table class="lk-tbl"><tr><th>order_id</th><th>product</th><th>qty</th></tr><tr><td>1038</td><td>Eggs</td><td>2</td></tr><tr><td>1038</td><td>Kettle</td><td>1</td></tr><tr><td>1039</td><td>Bananas</td><td>6</td></tr></table></div>
<div class="step"><b>OLTP: one order by its key.</b> <code>WHERE order_id = 1038</code> <table class="lk-tbl"><tr><th>order_id</th><th>product</th><th>qty</th></tr><tr><td><mark>1038</mark></td><td><mark>Eggs</mark></td><td><mark>2</mark></td></tr><tr><td><mark>1038</mark></td><td><mark>Kettle</mark></td><td><mark>1</mark></td></tr></table> 2 of 3 rows touched.</div>
<div class="step"><b>OLAP: read everything.</b> Every row is read, for every order ever placed: <table class="lk-tbl"><tr><th>rows read</th><th>rows in table</th></tr><tr><td><mark>3</mark></td><td>3</td></tr></table></div>
<div class="step"><b>Add it up.</b> <code>SUM(qty)</code> <table class="lk-tbl"><tr><th>total_qty</th></tr><tr><td><mark>9</mark></td></tr></table> Many rows in, one number out.</div>
<div class="step"><b>Split the jobs.</b> The till keeps taking sales; a nightly load copies the rows into a warehouse, where the big reads cannot slow a checkout.</div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-selectivity"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the two workloads touch very different fractions of the data. OLTP reads a tiny slice found by key; OLAP reads nearly all of it and squeezes it into a few numbers.

**Equation:** for a query, the *selectivity* is s = rows touched ÷ rows in the table. The order lookup has s = 4 ÷ 7,310 ≈ 0.0005. The department report has s = 7,310 ÷ 7,310 = 1, and an output of 8 rows: a reduction of about 900 to 1.

**Analogy:** a librarian fetching one book by its shelf number (OLTP) versus a researcher counting every book published each year (OLAP). The first needs a good catalogue; the second needs the books arranged by year, or a ready-made tally.

**Try it:** a query that lists the 4 orders of customer 17 out of 4,064 orders. Is s close to 0 or close to 1? (Close to 0: about 0.001, so it is OLTP-style work.)
</details>

## 6. Worked example

*Question:* is "Home sales in 2025" an OLTP or an OLAP question, and what is the answer?

1. It needs every completed 2025 order line in a Home category, not one row found by key, so it is **OLAP**.
2. The query above already answers it: Home, 2025, **$23,566.55**.
3. Compare 2024: $18,605.36. Growth = 23,566.55 ÷ 18,605.36 − 1 ≈ **26.7%**.
4. To get there the database joined four tables and read 7,310 lines. In a warehouse we would design a table where the same answer needs one join or none. That design is what the rest of this course builds.

## 7. Practice

```sql
-- exercise: OLTP-style lookup: list order_id, order_date, store_id and status for every order placed by customer 17.
-- hint: Filter orders with WHERE customer_id = 17.
SELECT order_id, order_date, store_id, status
FROM orders
-- answer:
SELECT order_id, order_date, store_id, status
FROM orders
WHERE customer_id = 17
```

```sql
-- exercise: OLAP-style summary: show completed sales per year and channel (store or online), rounded to 2 decimals, ordered by year then channel.
-- hint: Join order_items to orders, keep status = 'completed', and GROUP BY strftime('%Y', order_date) and channel.
SELECT strftime('%Y', o.order_date) AS year, o.channel, COUNT(*) AS lines
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
GROUP BY year, o.channel
ORDER BY year, o.channel
-- answer:
SELECT strftime('%Y', o.order_date) AS year, o.channel,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
WHERE o.status = 'completed'
GROUP BY year, o.channel
ORDER BY year, o.channel
```

```sql
-- exercise: How many order lines does the department report have to read for 2025 only? Count the order_items rows whose order is dated in 2025.
-- hint: COUNT(*) after joining to orders, with WHERE order_date LIKE '2025%'.
SELECT COUNT(*) AS lines
FROM order_items
-- answer:
SELECT COUNT(*) AS lines
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
WHERE o.order_date LIKE '2025%'
```

<div class="keypoints">

- OLTP runs the business: many tiny writes and lookups by key.
- OLAP understands the business: big reads that add up many rows.
- Big scans on the till database slow down checkouts, so analysis moves to a warehouse.
- OLTP tables avoid repetition; warehouse tables repeat some values on purpose to need fewer joins.
- A warehouse also keeps history that the live system overwrites.

</div>

**New words:** *OLTP*, *OLAP*, *data warehouse*, *normalised*, *selectivity*.
