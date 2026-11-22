---
title: What SQL is and why analysts use it
seoTitle: 'What is SQL? A beginner''s guide for data analysts'
summary: 'SQL is the language for asking questions of tables. Run your first queries in the browser and see why almost every data and BI job asks for it.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: What do you tell the database when you write SQL?
    choices: ['Step by step how to find the rows', 'What answer you want, and it works out how', 'Which file on the disk to open']
    ans: 1
    why: SQL is declarative. You describe the result you want; the database plans how to get it.
  - q: What does a SELECT query hand back?
    choices: ['A table of rows and columns', 'A chart', 'A changed database']
    ans: 0
    why: Every SELECT returns a table, even if it has one row and one column.
  - q: 'Does running SELECT * FROM customers change the customers table?'
    choices: ['Yes, it removes the rows it shows', 'No, SELECT only reads', 'Only if you press Run twice']
    ans: 1
    why: SELECT only reads. Changing data uses other statements (INSERT, UPDATE, DELETE), covered much later.
sources:
  - 'SQLite documentation, SELECT https://www.sqlite.org/lang_select.html'
  - 'PostgreSQL documentation, Tutorial: The SQL Language https://www.postgresql.org/docs/current/tutorial-sql.html'
  - 'Microsoft Learn, SELECT (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql'
  - 'Codd, E. F. (1970), A Relational Model of Data for Large Shared Data Banks, Communications of the ACM 13(6), 377-387'
---

**Module 1 · about 20 minutes · read first: nothing.** You'll be able to say what SQL is, run your first query, and read a simple query out loud in plain English.

<div class="bigidea">SQL is a short, English-like language for asking questions of tables: you say what answer you want, and the database works out how to find it.</div>

**In everyday terms:** ordering at a café. You say "a large latte, no sugar"; you don't walk behind the counter and tell the barista which buttons to press. A query is your order, and the database is the barista.

## 1. Why this matters

Nearly every company keeps its sales, customers and stock in a *database*, and the people who answer questions about that data (analysts, BI developers, data scientists) ask those questions in SQL. That is why analyst and BI job ads ask for SQL again and again, and why interviews often include a live SQL test. The good news: you need only a small part of the language to be useful, and you can start in the next two minutes.

## 2. A database is a set of tables

A *table* looks like a spreadsheet: a name, a few named columns, and many rows. A *database* is a set of tables that belong together. In this course you'll use the database of Northbay Retail, a made-up Canadian store chain, with tables for stores, products, customers and orders.

Here is the smallest table in it, five customers. Press **Run**.

```sql
-- try
SELECT * FROM mini_customers
```

You've just run a *query*: a question written in SQL. `SELECT *` means "all the columns", and `FROM mini_customers` names the table. The answer comes back as a table too.

Press Play to watch each row being tested, then move the slider and switch between AND, OR and NOT.

<figure class="fig" data-fig="@data-where-flow"><figcaption>Notice that every row is judged on its own, and that a row exactly on the boundary is dropped by a strict greater-than.</figcaption></figure>


## 3. SQL says what, not how

SQL stands for Structured Query Language (people say "S-Q-L" or "sequel"; both are fine). It is *declarative*: you describe the answer you want, and the database works out how to find it. You never write loops or open files.

Read this query out loud: "select the name and city from mini customers where the city is Toronto".

```sql
-- try
SELECT name, city
FROM mini_customers
WHERE city = 'Toronto'
```

Now press **Show how it runs** and then **Play**. Watch the steps: FROM fetches all five rows, WHERE fades out the three that aren't in Toronto, and SELECT keeps only the two columns you asked for. That picture (start with a table, throw rows away, keep some columns) is most of SQL.

<div class="meaning">

<dl>
<dt>Database</dt><dd>A set of tables that belong together, such as all of Northbay's stores, products and orders.</dd>
<dt>Table</dt><dd>A named grid of rows and columns. Every row has the same columns.</dd>
<dt>Query</dt><dd>A question written in SQL. It always hands back a table.</dd>
<dt>SELECT ... FROM ...</dt><dd>"Show me these columns from this table."</dd>
<dt>WHERE</dt><dd>"Only the rows that pass this test."</dd>
<dt>Declarative</dt><dd>You describe the result, not the steps to get it.</dd>
<dt>Physical meaning</dt><dd>A SELECT reads rows, throws away the ones that fail the test, keeps the columns you named and hands you a new, temporary table. The stored table is never changed.</dd>
</dl>

</div>

<div class="myth">

**"Running a query changes or moves the data."** A SELECT only reads. It makes a fresh answer table each time and leaves the real table exactly as it was, so you can run it a hundred times without harm. Changing data takes different statements (INSERT, UPDATE, DELETE), which come much later.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query in the same way):

<div class="steps">
<div class="step"><b>FROM mini_customers.</b> Fetch every row. <table class="lk-tbl"><tr><th>id</th><th>name</th><th>city</th></tr><tr><td>1</td><td>Asha</td><td>Toronto</td></tr><tr><td>2</td><td>Ben</td><td>Ottawa</td></tr><tr><td>3</td><td>Chen</td><td>Toronto</td></tr><tr><td>4</td><td>Dina</td><td>Hamilton</td></tr><tr><td>5</td><td>Eli</td><td>Ottawa</td></tr></table></div>
<div class="step"><b>WHERE city = 'Toronto'.</b> Test each row; keep the ones that pass. <table class="lk-tbl"><tr><th>id</th><th>name</th><th>city</th></tr><tr><td>1</td><td>Asha</td><td><mark>Toronto</mark></td></tr><tr><td>3</td><td>Chen</td><td><mark>Toronto</mark></td></tr></table></div>
<div class="step"><b>SELECT name, city.</b> Keep only the columns you asked for. <table class="lk-tbl"><tr><th>name</th><th>city</th></tr><tr><td><mark>Asha</mark></td><td>Toronto</td></tr><tr><td><mark>Chen</mark></td><td>Toronto</td></tr></table></div>
<div class="step"><b>The answer.</b> A new table of 2 rows and 2 columns. mini_customers still has all 5 rows.</div>
</div>

Try one yourself. Each time you press **New numbers** you get a fresh table:

<div class="problem" data-problem="sql-first-query-cells"></div>

## 4. Questions a store actually asks

The same few words scale up to real questions. How many orders did Northbay take in 2025?

```sql
-- try
SELECT COUNT(*) AS orders_2025
FROM orders
WHERE order_date LIKE '2025%'
```

How many came through the website and how many in stores? Run it, then change `2025` to `2024` and run again.

```sql
-- try
SELECT channel, COUNT(*) AS orders
FROM orders
WHERE order_date LIKE '2025%'
GROUP BY channel
```

Don't worry about `COUNT`, `LIKE` or `GROUP BY` yet; each has its own lesson. Notice instead that the query reads almost like the question.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a table is a *relation*: a set of rows, where every row has the same named columns. A query is a function that takes relations in and gives one relation back. That is why you can feed the answer of one query into another.

**Equation:** answer = q(tables). For the Toronto query, q keeps the rows where city = 'Toronto' (written σ, *selection*) and then keeps two columns (written π, *projection*): answer = π<sub>name, city</sub>( σ<sub>city = 'Toronto'</sub>( mini_customers ) ).

**Analogy:** a library catalogue. You ask "all books by this author, title only", and the librarian decides which shelf to walk to first. It breaks down a little because real tables can hold the same row twice, which a pure set cannot (SQL tables are *bags*, more on that in Module 3).

**Try it:** what is π<sub>city</sub>( mini_customers ) as a set? (Toronto, Ottawa, Hamilton: three values, because a set keeps each once.)
</details>

## 5. Worked example

*Question:* what did order 1010 contain, and what was it worth?

```sql
-- try
SELECT order_id, product_id, quantity, unit_price
FROM order_items
WHERE order_id = 1010
```

1. The order has 3 lines: product 47 (Laundry detergent, 1 × $14.99), product 11 (Bagels 6 pack, 4 × $4.49) and product 55 (Art kit, 1 × $24.99).
2. Line values: 14.99, 4 × 4.49 = 17.96, and 24.99.
3. Order value: 14.99 + 17.96 + 24.99 = **$57.94**.

SQL can do the sum for you:

```sql
-- try
SELECT SUM(quantity * unit_price) AS order_value
FROM order_items
WHERE order_id = 1010
```

## 6. SQLite, SQL Server, PostgreSQL

There is one SQL standard and many databases that speak it with small accents. This course runs *SQLite* in your browser, so nothing is installed and nothing you type leaves your device. Almost everything you learn works the same in SQL Server, PostgreSQL, MySQL and BigQuery; where it differs, the lesson says so in one line.

## 7. Practice

```sql
-- exercise: Show every row and column of the mini_orders table.
-- hint: SELECT * FROM the table's name.
SELECT * FROM mini_customers
-- answer:
SELECT * FROM mini_orders
```

```sql
-- exercise: List the name of every mini customer who lives in Ottawa.
-- hint: WHERE city = 'Ottawa'. Text goes in single quotes.
SELECT name
FROM mini_customers
-- answer:
SELECT name
FROM mini_customers
WHERE city = 'Ottawa'
```

```sql
-- exercise: How many orders did Northbay take in 2024?
-- hint: Copy the 2025 query from section 4 and change the year.
SELECT COUNT(*) AS orders
FROM orders
-- answer:
SELECT COUNT(*) AS orders
FROM orders
WHERE order_date LIKE '2024%'
```

**Try it on your own data:** load a CSV into [[sql-playground]] and query it the same way.

<div class="keypoints">

- SQL is the language for asking questions of tables; almost every data and BI job uses it.
- A database is a set of tables; a table is rows and columns.
- SQL is declarative: you say what you want, the database plans how.
- Every SELECT hands back a table and never changes the stored data.
- FROM picks the table, WHERE keeps rows, SELECT keeps columns.

</div>

**New words:** *database*, *table*, *query*, *declarative*, *relation*, *SQLite*.
