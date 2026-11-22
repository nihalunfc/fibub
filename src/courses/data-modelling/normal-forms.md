---
title: 'Normal forms: 1NF, 2NF and 3NF'
seoTitle: 'Database normalization 1NF 2NF 3NF explained with examples'
summary: 'Take one messy spreadsheet-style table of Northbay orders and normalise it, step by step, into first, second and third normal form with live SQL. See the update, insert and delete problems each step removes.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: A table has a column products holding 'Kettle x1, Duvet x2'. Which normal form does it break?
    choices: ['First (1NF): one value per cell', 'Second (2NF)', 'Third (3NF)']
    ans: 0
    why: First normal form asks for one value in each cell and no repeating groups. A list inside a cell is a repeating group.
  - q: 'The key of a table is (order_id, product_id), and product_name depends only on product_id. What is wrong?'
    choices: ['A partial dependency, so it breaks 2NF', 'A transitive dependency, so it breaks 3NF', 'Nothing']
    ans: 0
    why: product_name depends on part of the key, not the whole key. Second normal form moves it to a products table keyed by product_id.
  - q: 'In orders(order_id, store_id, store_city), store_city depends on store_id, which depends on order_id. Which form does it break?'
    choices: ['1NF', '2NF', '3NF']
    ans: 2
    why: That is a transitive dependency, order_id → store_id → store_city. Third normal form moves store_city to a stores table.
sources:
  - 'Codd, E. F. (1970), A Relational Model of Data for Large Shared Data Banks, Communications of the ACM 13(6) https://doi.org/10.1145/362384.362685'
  - 'Kent, W. (1983), A Simple Guide to Five Normal Forms in Relational Database Theory, Communications of the ACM 26(2) https://doi.org/10.1145/358024.358054'
  - 'Microsoft Learn: Description of the database normalization basics https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description'
---

**Module 1 · about 35 minutes · read first: 1.1.** You'll be able to spot repeating groups, partial dependencies and transitive dependencies, and split a flat table into first, second and third normal form with SQL.

<div class="bigidea">Normalising splits one messy table into several tidy ones so that every fact is stored in exactly one place.</div>

**In everyday terms:** an address book. If you write a friend's address on every birthday card list, every list, and every party plan, a move means hunting down every copy. Keep the address once in the address book and point to it.

## 1. Why this matters

Every operational database you will pull data from was designed with normal forms in mind, and so were most of its quirks. Knowing them lets you read a source system quickly, see where the same fact is stored twice, and explain to a developer why their spreadsheet export double-counts. You also need them to know *which* rules a warehouse breaks on purpose, in the next lesson.

## 2. The messy starting point

Imagine Northbay's first week of sale orders kept in a spreadsheet: one row per order, with the products crammed into one cell. Run this to build it (43 orders from 8 to 14 January 2024).

```sql
-- try
-- noviz
DROP TABLE IF EXISTS flat_orders;
CREATE TABLE flat_orders AS
SELECT o.order_id, o.order_date,
       c.first_name || ' ' || c.last_name AS customer_name, c.city AS customer_city,
       s.store_name, s.city AS store_city,
       group_concat(p.product_name || ' x' || i.quantity, ', ') AS products
FROM orders o
LEFT JOIN customers c ON c.customer_id = o.customer_id
JOIN stores s ON s.store_id = o.store_id
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id
WHERE o.order_date BETWEEN '2024-01-08' AND '2024-01-14'
GROUP BY o.order_id;
SELECT * FROM flat_orders LIMIT 6;
```

It looks friendly, but try asking it a question. How many units of eggs were sold this week? The number is buried inside text, so SQL can only guess with LIKE, and it can't add up the quantities:

```sql
-- try
SELECT COUNT(*) AS orders_mentioning_eggs
FROM flat_orders
WHERE products LIKE '%Eggs%'
```

## 3. First normal form (1NF): one value per cell

A table is in *1NF* when every cell holds a single value and there are no repeating groups (no lists, no columns like product1, product2, product3). The fix is one row per product on each order, an *order line*. Its key becomes the pair (order_id, product_id).

```sql
-- try
-- noviz
DROP TABLE IF EXISTS sales_1nf;
CREATE TABLE sales_1nf AS
SELECT o.order_id, i.product_id, o.order_date,
       o.customer_id, c.first_name || ' ' || c.last_name AS customer_name, c.city AS customer_city,
       o.store_id, s.store_name, s.city AS store_city,
       p.product_name, k.category_name, k.department,
       i.quantity, i.unit_price
FROM orders o
LEFT JOIN customers c ON c.customer_id = o.customer_id
JOIN stores s ON s.store_id = o.store_id
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id
JOIN categories k ON k.category_id = p.category_id
WHERE o.order_date BETWEEN '2024-01-08' AND '2024-01-14';
SELECT COUNT(*) AS lines FROM sales_1nf;
```

73 rows now, and the eggs question is easy:

```sql
-- try
SELECT product_name, SUM(quantity) AS units
FROM sales_1nf
WHERE product_name LIKE 'Eggs%'
GROUP BY product_name
```

But look at the repetition. Order 1038 has four lines, so its date, customer and store are written four times. "Grocery" is written on most rows. Repetition causes three classic problems, called *anomalies*:

- **Update anomaly:** rename a product and you must change every row that mentions it. Miss one and the table contradicts itself.
- **Insert anomaly:** a new product with no sales yet has nowhere to live, because every row needs an order.
- **Delete anomaly:** delete the only order of a product and you lose the product's name and category too.

Watch the update anomaly happen. Someone renames Eggs on one order only:

```sql
-- try
-- noviz
UPDATE sales_1nf SET product_name = 'Eggs (dozen)' WHERE order_id = 1038 AND product_name = 'Eggs dozen';
SELECT product_id, product_name, COUNT(*) AS rows_with_this_name
FROM sales_1nf
WHERE product_name LIKE 'Eggs%'
GROUP BY product_id, product_name;
```

One product id, two names. Which one is right? The table can't say.

## 4. Dependencies: what decides what

To fix the repetition we need one idea. Column B *depends on* column A (written A → B) when knowing A tells you B exactly: each A value always comes with the same B. This is called a *functional dependency*. In our table, product_id → product_name, and order_id → order_date.

You can test a dependency with GROUP BY: for each A, count the different Bs. If every count is 1, the dependency holds in this data.

```sql
-- try
SELECT order_id, COUNT(DISTINCT order_date) AS dates, COUNT(DISTINCT store_name) AS stores, COUNT(*) AS lines
FROM sales_1nf
GROUP BY order_id
HAVING COUNT(*) > 1
```

Every order with several lines has exactly 1 date and 1 store: order_id → order_date and order_id → store_name.

## 5. Second normal form (2NF): the whole key

A table is in *2NF* when it is in 1NF and every non-key column depends on the **whole** key, not just part of it. Our key is (order_id, product_id), but:

- order_date, customer and store depend only on order_id (part of the key);
- product_name, category and department depend only on product_id (the other part).

Each of these is a *partial dependency*. The fix: give each part of the key its own table, and keep only what needs both parts (quantity and price paid) in the lines table.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS orders_2nf;
DROP TABLE IF EXISTS products_2nf;
DROP TABLE IF EXISTS lines_2nf;
CREATE TABLE orders_2nf AS
  SELECT DISTINCT order_id, order_date, customer_id, customer_name, customer_city, store_id, store_name, store_city FROM sales_1nf;
CREATE TABLE products_2nf AS
  SELECT DISTINCT product_id, product_name, category_name, department FROM sales_1nf WHERE order_id <> 1038;
CREATE TABLE lines_2nf AS
  SELECT order_id, product_id, quantity, unit_price FROM sales_1nf;
SELECT (SELECT COUNT(*) FROM orders_2nf) AS orders, (SELECT COUNT(*) FROM products_2nf) AS products, (SELECT COUNT(*) FROM lines_2nf) AS lines;
```

(We skipped order 1038's lines when building products, a quick way to leave the bad "Eggs (dozen)" name behind. Section 7 shows what that shortcut costs.) Now a product's name lives in one row: rename it once and every order sees the new name.

## 6. Third normal form (3NF): nothing but the key

A table is in *3NF* when it is in 2NF and no non-key column depends on another non-key column. In `orders_2nf`, store_city depends on store_id, and store_id depends on order_id. That chain, order_id → store_id → store_city, is a *transitive dependency*. The same goes for the customer columns, and for department in `products_2nf` (it depends on category_name).

The fix is the same move again: each "deciding" column gets its own table.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS customers_3nf;
DROP TABLE IF EXISTS stores_3nf;
DROP TABLE IF EXISTS orders_3nf;
DROP TABLE IF EXISTS categories_3nf;
DROP TABLE IF EXISTS products_3nf;
CREATE TABLE customers_3nf AS SELECT DISTINCT customer_id, customer_name, customer_city FROM orders_2nf WHERE customer_id IS NOT NULL;
CREATE TABLE stores_3nf AS SELECT DISTINCT store_id, store_name, store_city FROM orders_2nf;
CREATE TABLE orders_3nf AS SELECT order_id, order_date, customer_id, store_id FROM orders_2nf;
CREATE TABLE categories_3nf AS SELECT DISTINCT category_name, department FROM products_2nf;
CREATE TABLE products_3nf AS SELECT product_id, product_name, category_name FROM products_2nf;
SELECT * FROM categories_3nf ORDER BY department, category_name;
```

"Grocery" is now written once per category instead of once per order line. Look familiar? This is almost exactly how Northbay's real tables (`orders`, `order_items`, `customers`, `stores`, `products`, `categories`) are laid out. The source system is already in 3NF.

<div class="meaning">

<dl>
<dt>1NF</dt><dd>One value per cell and no repeating groups (no lists, no product1, product2 columns).</dd>
<dt>2NF</dt><dd>1NF, and every non-key column depends on the whole key, not part of it.</dd>
<dt>3NF</dt><dd>2NF, and no non-key column depends on another non-key column.</dd>
<dt>Functional dependency (A → B)</dt><dd>Knowing A tells you B exactly: each A always comes with the same B.</dd>
<dt>Anomaly</dt><dd>A problem caused by repetition: an update missed in one copy, a thing that cannot be inserted, or a fact lost on delete.</dd>
<dt>Physical meaning</dt><dd>Each step moves columns that are decided by something other than the whole key into their own small table, and leaves a key behind to join them back. Repeated text becomes one row that many rows point to.</dd>
</dl>

</div>

<div class="myth">

**"Normalising means making as many tables as possible."** Each split must follow a real dependency, and the tables must join back to exactly the original rows (lossless). Splitting at random loses rows or creates ones that never existed.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>Messy start.</b> <table class="lk-tbl"><tr><th>order</th><th>products</th></tr><tr><td>1038</td><td>Eggs, Kettle</td></tr><tr><td>1039</td><td>Eggs</td></tr></table></div>
<div class="step"><b>1NF: one value per cell.</b> <table class="lk-tbl"><tr><th>order</th><th>product</th></tr><tr><td><mark>1038</mark></td><td><mark>Eggs</mark></td></tr><tr><td><mark>1038</mark></td><td><mark>Kettle</mark></td></tr><tr><td>1039</td><td>Eggs</td></tr></table> Key: (order, product).</div>
<div class="step"><b>Repetition shows.</b> Add the category: <table class="lk-tbl"><tr><th>order</th><th>product</th><th>category</th></tr><tr><td>1038</td><td>Eggs</td><td><mark>Grocery</mark></td></tr><tr><td>1038</td><td>Kettle</td><td>Home</td></tr><tr><td>1039</td><td>Eggs</td><td><mark>Grocery</mark></td></tr></table> "Grocery" for Eggs is stored twice.</div>
<div class="step"><b>2NF: split by part of the key.</b> category depends only on product, so it moves out: <table class="lk-tbl"><tr><th>product</th><th>category</th></tr><tr><td>Eggs</td><td>Grocery</td></tr><tr><td>Kettle</td><td>Home</td></tr></table></div>
<div class="step"><b>3NF: split chains.</b> department depends on category, not on product: <table class="lk-tbl"><tr><th>category</th><th>department</th></tr><tr><td><mark>Grocery</mark></td><td>Grocery</td></tr><tr><td><mark>Home</mark></td><td>Home</td></tr></table> Each fact now lives once.</div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-1nf-rows"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a functional dependency is a function. A → B means there is a function f with B = f(A) for every row. A *key* K is a set of columns where every other column is a function of K, and no two rows share a K value.

**Equation:** in sales_1nf the key is K = (order_id, product_id). 2NF asks that each non-key column be f(K) but not f(part of K). 3NF asks that it be f(K) directly, never g(h(K)) through another non-key column. A popular summary: each column depends on "the key, the whole key, and nothing but the key".

**Analogy:** a phone book where every entry also prints the full town history. If the history changes, you must reprint every entry in that town. Store the history once, under the town's name, and point to it.

**Try it:** in `orders_2nf`, does customer_city depend on the whole key, part of a key, or on another non-key column? (On customer_id, a non-key column: a transitive dependency, which breaks 3NF.)
</details>

## 7. Worked example: did we lose anything?

Splitting tables is only safe if joining them back gives the original rows. That is called a *lossless* decomposition. Check it:

```sql
-- try
SELECT COUNT(*) AS rows_back, ROUND(SUM(l.quantity * l.unit_price), 2) AS value
FROM lines_2nf l
JOIN orders_3nf o ON o.order_id = l.order_id
JOIN stores_3nf s ON s.store_id = o.store_id
JOIN products_3nf p ON p.product_id = l.product_id
JOIN categories_3nf k ON k.category_name = p.category_name
```

1. sales_1nf had **73** lines worth **$915.69** (quantity × price, before discount). The join gives back only **72** lines worth **$880.70**.
2. The missing $34.99 is the Board game on order 1038. It was the only Board game sold that week, and we built `products_2nf` without order 1038, so the product vanished and its line has nothing to join to. That is the delete anomaly in disguise.
3. The cure: fix the bad value first, then build each lookup table from the **full** data.

```sql
-- try
-- noviz
UPDATE sales_1nf SET product_name = 'Eggs dozen' WHERE product_id = 19;
DROP TABLE IF EXISTS products_2nf;
DROP TABLE IF EXISTS products_3nf;
CREATE TABLE products_2nf AS SELECT DISTINCT product_id, product_name, category_name, department FROM sales_1nf;
CREATE TABLE products_3nf AS SELECT product_id, product_name, category_name FROM products_2nf;
SELECT COUNT(*) AS rows_back, ROUND(SUM(l.quantity * l.unit_price), 2) AS value
FROM lines_2nf l
JOIN orders_3nf o ON o.order_id = l.order_id
JOIN stores_3nf s ON s.store_id = o.store_id
JOIN products_3nf p ON p.product_id = l.product_id
JOIN categories_3nf k ON k.category_name = p.category_name;
```

Now all **73** lines and **$915.69** come back. Notice the cost, though: five joins just to rebuild one row per line. That is the price of 3NF when you *read*, and the reason the next lesson exists.

## 8. Practice

```sql
-- exercise: Test the dependency category_name → department in sales_1nf: list each category_name with the number of different departments it has.
-- hint: GROUP BY category_name and COUNT(DISTINCT department). Every count should be 1.
SELECT category_name, department
FROM sales_1nf
-- answer:
SELECT category_name, COUNT(DISTINCT department) AS departments
FROM sales_1nf
GROUP BY category_name
```

```sql
-- exercise: Northbay's real orders table has a channel column. Show each store_id = 12 test (1 or 0) with each channel and the number of orders, to see whether channel depends on store_id.
-- hint: GROUP BY store_id = 12, channel. If each test value has one channel, then store_id → channel, a transitive dependency in orders.
SELECT channel, COUNT(*) AS orders
FROM orders
GROUP BY channel
-- answer:
SELECT store_id = 12 AS is_online_store, channel, COUNT(*) AS orders
FROM orders
GROUP BY store_id = 12, channel
```

```sql
-- exercise: Put the week's customers into 3NF yourself: list each customer_id with how many orders they placed in orders_3nf, joined to customers_3nf for the name, most orders first then by customer_id.
-- hint: JOIN orders_3nf to customers_3nf ON customer_id, GROUP BY the id and name, ORDER BY the count DESC, customer_id.
SELECT customer_id, COUNT(*) AS orders
FROM orders_3nf
GROUP BY customer_id
-- answer:
SELECT c.customer_id, c.customer_name, COUNT(*) AS orders
FROM orders_3nf o
JOIN customers_3nf c ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
ORDER BY orders DESC, c.customer_id
```

**Try it on your own data:** paste a CSV into [[csv-profiler]] to see which columns repeat the same values, a quick hint of where a table could be split; then try the split in [[sql-playground]].

<div class="keypoints">

- 1NF: one value per cell, no repeating groups.
- 2NF: every non-key column depends on the whole key.
- 3NF: no non-key column depends on another non-key column ("the key, the whole key, and nothing but the key").
- Repetition causes update, insert and delete anomalies.
- A split is only safe if joining back gives exactly the original rows (lossless).

</div>

**New words:** *first normal form (1NF)*, *repeating group*, *anomaly*, *functional dependency*, *second normal form (2NF)*, *partial dependency*, *third normal form (3NF)*, *transitive dependency*, *lossless decomposition*.
