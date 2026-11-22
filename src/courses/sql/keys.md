---
title: 'Keys: how tables point at each other'
seoTitle: 'SQL primary key and foreign key explained simply'
summary: 'A primary key names each row once; a foreign key points at a row in another table. Learn to spot both, check them with a query, and see why every join depends on them.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: What must be true of a primary key column?
    choices: ['It is a number', 'Every row has a value and no two rows share one', 'It is the first column in the table']
    ans: 1
    why: A primary key picks out exactly one row. That means no NULLs and no repeats. It can be text or a mix of columns.
  - q: 'In orders, what is customer_id?'
    choices: ['The primary key of orders', 'A foreign key that points at customers', 'A copy of the customer name']
    ans: 1
    why: Each order says which customer placed it by storing that customer's key. A column that holds another table's key is a foreign key.
  - q: 'order_items has no single id column. What identifies one row?'
    choices: ['order_id alone', 'product_id alone', 'order_id and product_id together']
    ans: 2
    why: One order has many lines and one product appears in many orders, but each product appears once per order. The pair is a composite key.
sources:
  - 'Microsoft Learn, Primary and foreign key constraints https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints'
  - 'PostgreSQL documentation, Constraints (primary keys and foreign keys) https://www.postgresql.org/docs/current/ddl-constraints.html'
  - 'SQLite documentation, SQLite Foreign Key Support https://www.sqlite.org/foreignkeys.html'
  - 'Kimball Group, Dimensional Modeling Techniques: Dimension Surrogate Keys https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/dimension-surrogate-key/'
---

**Module 4 · about 20 minutes · read first: 3.5.** You'll be able to find the primary and foreign keys in a database, check them with a query, and say which column a join should match on.

<div class="bigidea">A primary key names each row of a table uniquely, and a foreign key is a column that points at another table's primary key; joins follow these pointers.</div>

**In everyday terms:** a passport number and a boarding pass. Each passport number belongs to exactly one person (primary key); a boarding pass quotes a passport number to say whose it is (foreign key). A boarding pass with a number that was never issued is an orphan.

## 1. Why this matters

Real data is split across many tables: customers in one, orders in another, products in a third. Keys are the labels that let you put them back together. Every join you write in this module matches one table's key with another table's pointer to it. When a dashboard number is wrong, a broken or misunderstood key is the first thing an experienced analyst checks.

## 2. Primary key: one name per row

A **primary key** is a column (or set of columns) whose value is different on every row and never empty. In Northbay, `customers.customer_id`, `orders.order_id` and `products.product_id` are primary keys. If you know the key, you know exactly one row.

Start small. In `mini_customers`, `id` is the key: five rows, five different ids.

```sql
-- try
SELECT id, name, city
FROM mini_customers
```

A key must be unique, so this check should give the same number twice. Run it on the real customers table:

```sql
-- try
SELECT COUNT(*) AS rows_in_table,
       COUNT(DISTINCT customer_id) AS different_ids
FROM customers
```

Both are 603, so `customer_id` is unique. A name is not: try swapping `customer_id` for `first_name` and watch the second number drop.

Drag the table size up to 100 million rows, then press Look up a new id.

<figure class="fig" data-fig="@data-index-lookup"><figcaption>Notice that the scan grows with the table while the index needs only a few page reads.</figcaption></figure>


## 3. Foreign key: a pointer to another table

A **foreign key** is a column that holds another table's primary key. `mini_orders.customer_id` says which customer placed each order. Order 101 has `customer_id` 1, so it belongs to Asha.

```sql
-- try
SELECT order_id, customer_id, item, amount
FROM mini_orders
```

Look at order 106: `customer_id` is 9, but there is no customer 9. That is an **orphan**: a foreign key that points at nothing. Northbay's tables, like many data warehouses, describe their keys but don't enforce them, so orphans can slip in. You will see in [Lesson 4.2](/learn/courses/sql/inner-join/) that an inner join quietly drops them.

Here are Northbay's main pointers:

- `orders.customer_id` → `customers.customer_id` (NULL for guests)
- `orders.store_id` → `stores.store_id`
- `order_items.order_id` → `orders.order_id`, and `order_items.product_id` → `products.product_id`
- `products.category_id` → `categories.category_id`
- `employees.manager_id` → `employees.employee_id` (a table pointing at itself; see [Lesson 4.6](/learn/courses/sql/self-join/))

<div class="meaning">

<dl>
<dt>Primary key</dt><dd>A column (or set of columns) that is different on every row and never empty.</dd>
<dt>Foreign key</dt><dd>A column holding another table's primary key: a pointer.</dd>
<dt>Orphan</dt><dd>A foreign key value that points at no row.</dd>
<dt>Composite key</dt><dd>A key made of two or more columns together, such as (order_id, product_id).</dd>
<dt>Surrogate / natural key</dt><dd>A made-up id number / a real-world value such as an email.</dd>
<dt>Uniqueness test</dt><dd>COUNT(*) = COUNT(DISTINCT key): any gap means repeated values.</dd>
<dt>Physical meaning</dt><dd>Keys are how split-up tables get put back together. A join matches a foreign key to a primary key; if the "primary" key repeats, rows get copied, and if a pointer is an orphan, rows go missing.</dd>
</dl>

</div>

<div class="myth">

**"If a column is called id, it must be unique."** A name is a promise, not a check. Northbay describes its keys but does not enforce them, like many warehouses. Test it: COUNT(*) − COUNT(DISTINCT id) must be 0. Anything else is the number of extra copies.

</div>

Watch a pointer get followed, one step at a time:

<div class="steps">
<div class="step"><b>mini_customers: id is the primary key.</b> Five rows, five different ids. <table class="lk-tbl"><tr><th>id</th><th>name</th></tr><tr><td>1</td><td>Asha</td></tr><tr><td>2</td><td>Ben</td></tr><tr><td>3</td><td>Chen</td></tr><tr><td>4</td><td>Dina</td></tr><tr><td>5</td><td>Eli</td></tr></table></div>
<div class="step"><b>mini_orders: customer_id is a foreign key.</b> <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th></tr><tr><td>101</td><td>1</td></tr><tr><td>103</td><td>2</td></tr><tr><td>106</td><td><mark>9</mark></td></tr></table></div>
<div class="step"><b>Follow the pointer.</b> 101 → id 1 → Asha. 103 → id 2 → Ben.</div>
<div class="step"><b>An orphan.</b> 106 → id 9 → <mark>no such row</mark>. A join will lose this order (Lesson 4.2).</div>
</div>

Press **Show how it runs** on the boxes above to see the real tables. Then test a key yourself:

<div class="problem" data-problem="sql-key-dupes"></div>

## 4. Composite keys and natural keys

Some tables have no single id. In `order_items`, one order has several lines and one product is sold many times, but a product appears only once per order. So the pair (`order_id`, `product_id`) is the key. A key made of two or more columns is a **composite key**.

```sql
-- try
SELECT COUNT(*) AS lines,
       COUNT(DISTINCT order_id || '-' || product_id) AS different_pairs
FROM order_items
```

Both are 7,310, so the pair is unique. (`||` glues text together; in SQL Server use `CONCAT(order_id, '-', product_id)`.)

A **surrogate key** is a made-up number like `customer_id`. A **natural key** is something from the real world, like an email address. Natural keys look tempting but break: Northbay has three people who signed up twice, once in lower case and once in capitals, so the "same" email appears under two ids.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a table is a set of rows, and a key is a rule that tells rows apart. If K is a key of table R, no two different rows agree on K.

**Equation:** K is a key when the map row → K(row) is **injective** (one-to-one): r₁ ≠ r₂ ⇒ K(r₁) ≠ K(r₂). As a count: |R| = |π_K(R)|, the number of rows equals the number of distinct key values. A foreign key F in S pointing at R says π_F(S) ⊆ π_K(R): every pointer lands on a real row.

**Analogy:** a key is a passport number. Two people can share a name and a birthday, but not a passport number. A foreign key is a boarding pass that quotes a passport number; an orphan is a boarding pass for a passport that was never issued.

**Try it:** is `orders.store_id` a key of `orders`? (No: thousands of orders share each store, so it fails the count test. It is a foreign key.)
</details>

## 5. Worked example

*Question:* do all of Northbay's order pointers land on a real row?

1. Every `orders.store_id` matches a store: counting orders with no matching store gives **0**.
2. Every `orders.customer_id` that isn't NULL matches a customer. The 482 NULLs are guests, which is allowed.
3. The other way round, **3** customers (601, 602, 603) have no orders at all. They are the duplicate sign-ups.

That last kind of check, "rows with no match", is so useful it has its own lesson: [Lesson 4.4](/learn/courses/sql/anti-join/).

## 6. Practice

```sql
-- exercise: Check whether product_id is unique in products. Show the number of rows and the number of different product_id values.
-- hint: COUNT(*) counts rows; COUNT(DISTINCT product_id) counts different values.
SELECT COUNT(*) AS rows_in_table
FROM products
-- answer:
SELECT COUNT(*) AS rows_in_table,
       COUNT(DISTINCT product_id) AS different_ids
FROM products
```

```sql
-- exercise: Find emails that belong to more than one customer once you ignore capitals. Show the lower-case email and how many customers have it.
-- hint: GROUP BY LOWER(email), then HAVING COUNT(*) > 1.
SELECT LOWER(email) AS email, COUNT(*) AS customers
FROM customers
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1
-- answer:
SELECT LOWER(email) AS email, COUNT(*) AS customers
FROM customers
WHERE email IS NOT NULL
GROUP BY LOWER(email)
HAVING COUNT(*) > 1
```

**Try it on your own data:** load a CSV into [[sql-playground]] and run the COUNT vs COUNT DISTINCT check on the column you think is the key.

<div class="keypoints">

- A primary key is unique and never empty: knowing it gives you exactly one row.
- A foreign key holds another table's primary key; an orphan points at nothing.
- Test a key with COUNT(*) versus COUNT(DISTINCT key); they must match.
- A composite key uses several columns together, like (order_id, product_id).
- Surrogate ids are safer than natural keys such as emails or names.

</div>

**New words:** *primary key*, *foreign key*, *orphan*, *composite key*, *surrogate key*, *natural key*.
