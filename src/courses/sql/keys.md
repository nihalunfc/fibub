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
---

**Module 4 · about 20 minutes · read first: 3.5.** You'll be able to find the primary and foreign keys in a database, check them with a query, and say which column a join should match on.

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

**New words:** *primary key*, *foreign key*, *orphan*, *composite key*, *surrogate key*, *natural key*.
