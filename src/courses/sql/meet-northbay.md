---
title: 'Meet Northbay: the practice database'
seoTitle: 'SQL practice database: a retail store with real-looking data'
summary: 'A guided tour of Northbay Retail, the made-up store chain you query in every lesson: ten tables, two years of orders, and a few planted problems to find.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Which table has one row per product inside an order?
    choices: ['orders', 'order_items', 'products']
    ans: 1
    why: orders has one row per checkout; order_items has one row per product in that checkout.
  - q: What does a NULL customer_id in orders mean?
    choices: ['The order was cancelled', 'A guest bought without a loyalty account', 'The order was online']
    ans: 1
    why: Guests have no customer number, so their orders have no customer_id.
  - q: Which store has no city?
    choices: ['Store 1, Northbay Downtown', 'Store 12, Northbay Online', 'None of them']
    ans: 1
    why: Store 12 is the website. It sits in the stores table so every order has a store_id, but it has no city or province.
sources:
  - 'SQLite documentation, SELECT (LIMIT clause) https://www.sqlite.org/lang_select.html'
  - 'Kimball Group, Dimensional Modeling Techniques: Grain https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/grain/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, chapter 3 (Retail Sales)'
---

**Module 1 · about 25 minutes · read first: 1.1.** You'll be able to name every Northbay table, say what one row in each means, and find your way around with `SELECT *` and `LIMIT`.

<div class="bigidea">Before you query a database, learn its map: which tables exist, what one row in each stands for, and which columns point at other tables.</div>

**In everyday terms:** starting a new job in a big supermarket. On day one you walk the aisles: where the stockroom is, which shelf holds what, and that the till receipts are kept in the office. Only then can you answer "how many kettles did we sell?"

## 1. Why this matters

On your first week in any analyst job, before you write a clever query, you have to learn the company's tables: what they're called, what one row means, and where the traps are. This lesson does that for Northbay, the store chain behind every exercise in this course. The habits you practise here (peek at each table, count its rows, look for blanks) are exactly what you'll do with real data.

## 2. The map

Northbay Retail is made up: eleven stores across Canada plus a website, selling groceries, home goods, toys and electronics, with two years of sales (2024 and 2025). The data is generated in your browser from a fixed seed, so you see exactly the same rows as everyone else, and the answers in the lessons always match.

<!--fig:northbay-map-->

Two words you'll meet on the map. A *key* is a column that names each row uniquely, like `store_id`. A column marked → points at a row in another table: `orders.store_id` holds a store number from `stores`. Lesson 4.1 covers keys properly; for now, read → as "look this up in".

## 3. How to peek at a table

Two habits make any new table less scary:

- `SELECT * FROM t LIMIT 5` shows the first five rows, so you see the columns and what the values look like.
- `SELECT COUNT(*) FROM t` tells you how many rows there are.

Every stop on the tour below is one of these. Press **Run** on each; change the numbers and table names as much as you like. If you break something, the **Reset database** button puts it back.

<div class="meaning">

<dl>
<dt>Table</dt><dd>One kind of thing Northbay records: stores, products, customers, orders.</dd>
<dt>Grain</dt><dd>The sentence "one row = one ..." for a table. orders: one checkout. order_items: one product line in a checkout.</dd>
<dt>Key</dt><dd>A column whose value names one row, such as store_id in stores.</dd>
<dt>→ (points at)</dt><dd>A column holding another table's key, such as orders.store_id. Read it as "look this up in stores".</dd>
<dt>NULL</dt><dd>An empty cell: no value at all.</dd>
<dt>LIMIT 5</dt><dd>Show only the first 5 rows, for a quick look.</dd>
<dt>Physical meaning</dt><dd>A sale is not stored in one place. The checkout lives in orders, each product on it in order_items, and the shop and customer are kept once in stores and customers, linked by id numbers.</dd>
</dl>

</div>

<div class="myth">

**"One sale is one row, so orders and order_items have the same number of rows."** One checkout is one row in orders, but it has one row in order_items for every different product on the receipt. Northbay has 4,064 orders and 7,310 order lines. Always ask what one row means before you count anything.

</div>

Watch one receipt land in the tables, one step at a time:

<div class="steps">
<div class="step"><b>The receipt.</b> Order 1010: 1 laundry detergent, 4 packs of bagels, 1 art kit.</div>
<div class="step"><b>orders gets one row.</b> <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th><th>store_id</th></tr><tr><td><mark>1010</mark></td><td>1</td><td>8</td></tr></table></div>
<div class="step"><b>order_items gets one row per product.</b> <table class="lk-tbl"><tr><th>order_id</th><th>product_id</th><th>quantity</th></tr><tr><td>1010</td><td><mark>47</mark></td><td>1</td></tr><tr><td>1010</td><td><mark>11</mark></td><td>4</td></tr><tr><td>1010</td><td><mark>55</mark></td><td>1</td></tr></table></div>
<div class="step"><b>The ids point elsewhere.</b> store_id 8 → Northbay Prairie in stores; customer_id 1 → Hiro Khan in customers; product 11 → Bagels 6 pack in products.</div>
</div>

Count rows at the right grain:

<div class="problem" data-problem="sql-receipt-rows"></div>

## 4. The tour: places

**regions** (4 rows): Ontario South, Ontario North, Prairies and West Coast.

```sql
-- try
SELECT * FROM regions
```

**stores** (12 rows): one row per store, with its city, province, region, opening date and size. Look at the last row: store 12 is *Northbay Online*, the website. It has no city, province, region or size, so those cells are blank. A blank cell in a database is called *NULL* (Lesson 2.4).

```sql
-- try
SELECT store_id, store_name, city, province, region_id
FROM stores
```

## 5. The tour: what Northbay sells

**categories** (10 rows): each category belongs to one *department*: Grocery, Home, Kids or Tech.

```sql
-- try
SELECT * FROM categories
```

**products** (61 rows): `unit_price` is today's shelf price and `unit_cost` is what Northbay pays the supplier, so the difference is the profit on one unit. Here are the Electronics products (category 10):

```sql
-- try
SELECT product_name, brand, unit_price, unit_cost
FROM products
WHERE category_id = 10
```

**promotions** (7 rows): sale periods with a fraction off, so 0.25 means 25% off.

```sql
-- try
SELECT * FROM promotions
```

## 6. The tour: people

**customers** (603 rows): loyalty members. This table is deliberately a little messy, like real data: some emails and loyalty tiers are NULL, a few cities have a stray space at the end, and three people signed up twice. Lessons 2.4, 3.4 and 7.4 hunt these down.

```sql
-- try
SELECT * FROM customers LIMIT 5
```

Look at customer 3: the city looks like "Winnipeg", but it is really "Winnipeg " with a trailing space. You can't see it, which is exactly why it causes trouble later.

**employees** (38 rows): staff, each with a `manager_id` pointing at another employee. The CEO's manager is NULL. Head office staff have no `store_id`.

```sql
-- try
SELECT employee_id, name, store_id, role, manager_id
FROM employees
LIMIT 8
```

## 7. The tour: sales

**orders** (4,064 rows): one row per checkout from 1 January 2024 to 31 December 2025. `channel` is store or online; `status` is completed or cancelled; `promo_id` says which sale was running that day, if any. A NULL `customer_id` means a guest who bought without a loyalty account (482 orders).

```sql
-- try
SELECT * FROM orders LIMIT 5
```

**order_items** (7,310 rows): one row per product in an order. An order of bagels and detergent has two rows here. The money is worked out per line as quantity × unit_price × (1 − discount). Note that `unit_price` here is the price paid on the day, which can differ from today's shelf price in `products`.

```sql
-- try
SELECT * FROM order_items WHERE order_id = 1010
```

**returns** (204 rows): products brought back, with a date and a reason.

```sql
-- try
SELECT * FROM returns LIMIT 5
```

## 8. The tiny tables

**mini_customers** (5 rows) and **mini_orders** (6 rows) are so small you can see every row at once. Lessons use them whenever you should watch a query run step by step. Order 106 belongs to customer 9, who doesn't exist, on purpose.

```sql
-- try
SELECT * FROM mini_orders
```

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** every table has a *grain*: the one sentence that says what a single row stands for. "One row per checkout" (orders) and "one row per product in a checkout" (order_items) are different grains, even though both are about sales.

**Equation:** the number of rows is the *cardinality* of the table, written |orders| = 4,064. Because one order has one or more lines, |order_items| ≥ |orders|: here 7,310 ≥ 4,064, about 1.8 lines per order.

**Analogy:** a shop receipt. The receipt is one row in orders; each printed line on it is one row in order_items. It breaks down a little for returns, which point at a single line of a receipt rather than the whole receipt.

**Try it:** a customer buys 3 kettles in one checkout. How many rows in orders, and how many in order_items? (One and one: the 3 goes in `quantity`.)
</details>

## 9. Worked example

*Question:* order 1010 was placed on 3 January 2024. Who bought it, where, and what was in it?

1. Find the order: `SELECT * FROM orders WHERE order_id = 1010` gives customer 1, store 8, channel store, status completed.
2. Store 8 in `stores` is Northbay Prairie in Winnipeg.
3. Customer 1 in `customers` is Hiro Khan.
4. `order_items` for 1010 has 3 lines: products 47, 11 and 55 (Laundry detergent, Bagels 6 pack, Art kit).

You looked up four tables to answer one question. In Module 4 a *join* will do those look-ups in a single query. For now, try steps 2 and 3 yourself:

```sql
-- try
SELECT store_name, city FROM stores WHERE store_id = 8
```

## 10. Practice

```sql
-- exercise: How many products does Northbay sell? Return one number.
-- hint: COUNT(*) counts the rows of a table.
SELECT * FROM products LIMIT 5
-- answer:
SELECT COUNT(*) FROM products
```

```sql
-- exercise: Show the first 3 rows of the returns table.
-- hint: SELECT * ... LIMIT 3
SELECT * FROM returns
-- answer:
SELECT * FROM returns LIMIT 3
```

```sql
-- exercise: Find the name and city of customer number 3.
-- hint: WHERE customer_id = 3
SELECT first_name, last_name, city
FROM customers
-- answer:
SELECT first_name, last_name, city
FROM customers
WHERE customer_id = 3
```

<div class="keypoints">

- Northbay has places (regions, stores), things it sells (categories, products, promotions), people (customers, employees) and sales (orders, order_items, returns).
- Learn every table's grain: orders is one row per checkout, order_items one row per product in a checkout.
- A column marked → holds another table's key; you look it up there.
- Peek with SELECT * ... LIMIT 5 and count with SELECT COUNT(*).
- NULL means an empty cell: guests have no customer_id; the online store has no city.

</div>

**New words:** *key*, *NULL*, *grain*, *cardinality*, *department*, *guest order*.
