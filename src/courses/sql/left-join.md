---
title: LEFT JOIN and finding what is missing
seoTitle: 'SQL LEFT JOIN explained with examples'
summary: 'A left join keeps every row of the first table, matched or not, and fills the gaps with NULL. Learn when to use it, the WHERE trap that turns it back into an inner join, and how to count matches correctly.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'mini_customers LEFT JOIN mini_orders: what do Dina and Eli get in the order columns?'
    choices: ['They are left out', 'NULL', 'Zero']
    ans: 1
    why: A left join keeps every row from the left table. Where there is no match, the right table's columns are filled with NULL.
  - q: 'You LEFT JOIN orders to customers and then write WHERE o.order_date >= ''2025-12-01''. What happens to customers with no December orders?'
    choices: ['They stay, with NULL dates', 'They are dropped, because NULL >= a date is not true', 'The query fails']
    ans: 1
    why: Unmatched rows have NULL in o.order_date, and WHERE keeps only rows where the test is true. Put the condition in ON to keep them.
  - q: 'After a LEFT JOIN, which counts orders per customer correctly, giving 0 to customers with none?'
    choices: ['COUNT(*)', 'COUNT(o.order_id)', 'SUM(1)']
    ans: 1
    why: COUNT(*) counts the filled-in row, giving 1. COUNT(o.order_id) skips NULLs, so a customer with no orders gets 0.
sources:
  - 'SQLite documentation, SELECT: The FROM clause and joins https://www.sqlite.org/lang_select.html#fromclause'
  - 'PostgreSQL documentation, Table Expressions: Joined Tables https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-JOIN'
  - 'Microsoft Learn, Joins (SQL Server): outer joins https://learn.microsoft.com/en-us/sql/relational-databases/performance/joins'
---

**Module 4 · about 30 minutes · read first: 4.2.** You'll be able to keep unmatched rows with a left join, find rows with no match, and avoid the two mistakes that make left-join numbers wrong.

<div class="bigidea">A left join keeps every row of the first table, joins matches as usual, and fills the right table's columns with NULL where nothing matches.</div>

**In everyday terms:** a class register. Every student on the list gets a line, whether or not they handed in homework; those who didn't get a blank in the homework column. An inner join is the pile of homework sheets, where missing students don't appear at all.

## 1. Why this matters

Business questions often care most about what is *not* there: customers who stopped buying, products that never sold, stores with no sales on a day. An inner join throws exactly those rows away. In [Lesson 4.2](/learn/courses/sql/inner-join/) an inner join silently lost every online order. The left join is how analysts keep the whole picture.

## 2. Keep everything on the left

A **left join** (also written `LEFT OUTER JOIN`) keeps every row of the table written first, the **left table**. Rows that find a match are joined as usual. Rows that don't are kept anyway, with **NULL** in every column from the right table.

Press **Run**, then **Show how it runs**, and compare with the inner join you watched in the last lesson.

```sql
-- try
SELECT c.id, c.name, o.order_id, o.item
FROM mini_customers c
LEFT JOIN mini_orders o ON o.customer_id = c.id
```

Things to notice:

- Asha and Chen still appear twice (two orders each).
- Dina and Eli are now kept, with NULL `order_id` and `item`.
- Order 106 (customer 9) is still missing: it is on the *right*, and a left join only protects the left.

The order you write the tables in matters. Swap them and you keep every order instead, including 106 with a NULL name:

```sql
-- try
SELECT o.order_id, o.item, c.name
FROM mini_orders o
LEFT JOIN mini_customers c ON o.customer_id = c.id
```

A `RIGHT JOIN` keeps the right table instead, and a `FULL JOIN` keeps both sides. Most analysts rewrite a right join as a left join with the tables swapped, because it reads more easily. (SQLite supports both since version 3.39; so do SQL Server and PostgreSQL.)

<div class="meaning">

<dl>
<dt>LEFT JOIN</dt><dd>Keep every row of the left table (the one written first).</dd>
<dt>Left table</dt><dd>The table before LEFT JOIN: the one you are protecting.</dd>
<dt>NULL padding</dt><dd>The blanks a left row gets in the right table's columns when nothing matches.</dd>
<dt>WHERE right_key IS NULL</dt><dd>Keeps only the left rows that found no match.</dd>
<dt>ON vs WHERE</dt><dd>Tests on the right table go in ON (they decide matches); tests in WHERE run after and can remove the padded rows.</dd>
<dt>Physical meaning</dt><dd>The result has at least as many rows as the left table: one per match, or one padded row for a left row with no match. COUNT(*) counts those padded rows, COUNT(right column) does not.</dd>
</dl>

</div>

<div class="myth">

**"A WHERE on the right table just narrows a left join."** It undoes it. Padded rows have NULL in the right table's columns, and NULL fails the test, so they vanish and you are back to an inner join. Put conditions on the right table in ON; keep WHERE for the left table (or for IS NULL checks).

</div>

Watch the left join above run, one step at a time (the live box's **Show how it runs** button animates the real query):

<div class="steps">
<div class="step"><b>Start from every customer.</b> <table class="lk-tbl"><tr><th>id</th><th>name</th></tr><tr><td>1</td><td>Asha</td></tr><tr><td>2</td><td>Ben</td></tr><tr><td>3</td><td>Chen</td></tr><tr><td>4</td><td>Dina</td></tr><tr><td>5</td><td>Eli</td></tr></table></div>
<div class="step"><b>Join matching orders.</b> Asha and Chen get two rows each, Ben one.</div>
<div class="step"><b>Pad the rest with NULL.</b> 5 matched + 2 padded = 7 rows. <table class="lk-tbl"><tr><th>name</th><th>order_id</th><th>item</th></tr><tr><td>Asha</td><td>101</td><td>Kettle</td></tr><tr><td>Asha</td><td>102</td><td>Bagels</td></tr><tr><td>Ben</td><td>103</td><td>Puzzle</td></tr><tr><td>Chen</td><td>104</td><td>Duvet</td></tr><tr><td>Chen</td><td>105</td><td>Kettle</td></tr><tr><td>Dina</td><td><mark><i>NULL</i></mark></td><td><mark><i>NULL</i></mark></td></tr><tr><td>Eli</td><td><mark><i>NULL</i></mark></td><td><mark><i>NULL</i></mark></td></tr></table></div>
<div class="step"><b>WHERE o.order_id IS NULL.</b> Only the unmatched: Dina and Eli, the customers with no orders.</div>
<div class="step"><b>Order 106 is still missing.</b> It sits in the right table, and a left join only protects the left.</div>
</div>

<div class="problem" data-problem="sql-left-join-count"></div>

Pick a join type and press Play (or drag Rows built) to watch the result table being made one row at a time. Compare INNER with LEFT, then with FULL.

<figure class="fig" data-fig="@data-join-types"><figcaption>Notice which rows only some joins keep, and where NULL appears: always on the side that had no partner.</figcaption></figure>


## 3. Finding what is missing

The NULLs are a feature. Rows with NULL in the right table's key are exactly the rows that found no match. Add `WHERE <right key> IS NULL` and you have a list of what is missing:

```sql
-- try
SELECT c.customer_id, c.first_name, c.last_name, c.joined_on
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL
```

Three customers have never ordered: 601, 602 and 603, the duplicate sign-ups from August 2025. Test the right table's key (or another column that is never NULL there), not a column that could be NULL on a real match. This pattern is called an anti-join; [Lesson 4.4](/learn/courses/sql/anti-join/) shows two other ways to write it.

## 4. Trap 1: a WHERE on the right table

*Question:* which customers did **not** order in December 2025? A first try:

```sql
-- try
SELECT COUNT(DISTINCT c.customer_id) AS customers
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_date >= '2025-12-01'
```

224 customers, and every one of them *did* order in December. The WHERE threw away all the unmatched rows, because for them `o.order_date` is NULL and `NULL >= '2025-12-01'` is not true. A WHERE test on the right table turns a left join back into an inner join.

The fix: put conditions about the right table in `ON`. Then they decide which rows *match*, and unmatched customers survive with NULLs.

```sql
-- try
SELECT COUNT(*) AS customers_without_december_orders
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.customer_id
 AND o.order_date >= '2025-12-01'
WHERE o.order_id IS NULL
```

379 customers placed no order in December 2025 (and 224 + 379 = 603, every customer). Rule of thumb: in a left join, filters on the **left** table go in WHERE, filters on the **right** table go in ON.

## 5. Trap 2: COUNT(*) after a left join

A customer with no orders still has one row in the result (filled with NULLs). `COUNT(*)` counts rows, so it gives that customer 1. `COUNT(o.order_id)` counts only non-NULL values, so it gives 0. Run this and compare the two columns for Dina and Eli:

```sql
-- try
SELECT c.name,
       COUNT(*)          AS count_star,
       COUNT(o.order_id) AS orders
FROM mini_customers c
LEFT JOIN mini_orders o ON o.customer_id = c.id
GROUP BY c.name
```

The same goes for sums: `SUM(o.amount)` is NULL for a customer with no orders. Wrap it as `COALESCE(SUM(o.amount), 0)` if you want a 0.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a left join is an inner join plus the left rows that found no partner, padded with NULLs.

**Equation:** A ⟕ B = (A ⋈ B) ∪ ((A − π_A(A ⋈ B)) × {NULL…}). Its size is at least |A|: every left row appears once if it has no match, or once per match if it has some. For mini_customers that is 5 joined rows + 2 padded rows = 7.

**Analogy:** a class register. Every student on the list gets a line, whether or not they handed in homework. Those who didn't get a blank in the "homework" column. An inner join is a pile of homework sheets: students with nothing handed in aren't in it at all.

**Try it:** mini_orders LEFT JOIN mini_customers: how many rows? (6: five matched orders plus order 106 with a NULL name.)
</details>

## 6. Worked example: orders by region, nothing lost

In the last lesson, inner-joining orders → stores → regions lost 1,059 online orders. With left joins, every order is kept and the online ones land in a NULL region. `COALESCE` gives that group a readable name:

```sql
-- try
SELECT COALESCE(r.region_name, 'Online (no region)') AS region,
       COUNT(*) AS orders
FROM orders o
LEFT JOIN stores s  ON s.store_id = o.store_id
LEFT JOIN regions r ON r.region_id = s.region_id
GROUP BY region
ORDER BY orders DESC
```

Now the five rows add up to 4,064, every order: Ontario South 1,364, Online 1,059, Prairies 835, Ontario North 529, West Coast 277. Once a chain of joins uses LEFT JOIN, keep the later ones LEFT too: an inner join further down would drop the NULL rows again.

## 7. Practice

```sql
-- exercise: List every mini customer with the number of orders they placed, including customers with 0.
-- hint: LEFT JOIN mini_orders, GROUP BY the customer, and use COUNT(o.order_id), not COUNT(*).
SELECT c.name, COUNT(*) AS orders
FROM mini_customers c
JOIN mini_orders o ON o.customer_id = c.id
GROUP BY c.name
-- answer:
SELECT c.name, COUNT(o.order_id) AS orders
FROM mini_customers c
LEFT JOIN mini_orders o ON o.customer_id = c.id
GROUP BY c.name
```

```sql
-- exercise: How many Gold customers placed no order in November 2025? Return one number.
-- hint: Put the November date test in ON (o.order_date LIKE '2025-11%'), keep c.loyalty_tier = 'Gold' in WHERE with o.order_id IS NULL.
SELECT COUNT(*) AS gold_without_november_orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE c.loyalty_tier = 'Gold'
  AND o.order_date LIKE '2025-11%'
  AND o.order_id IS NULL
-- answer:
SELECT COUNT(*) AS gold_without_november_orders
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.customer_id
 AND o.order_date LIKE '2025-11%'
WHERE c.loyalty_tier = 'Gold'
  AND o.order_id IS NULL
```

```sql
-- exercise: Show every product with the number of times it was returned, including products never returned (0). Show the 5 least-returned, fewest first, then by product name.
-- hint: products LEFT JOIN returns ON product_id, COUNT(r.return_id), ORDER BY the count then the name, LIMIT 5.
SELECT p.product_name, COUNT(*) AS returns
FROM products p
JOIN returns r ON r.product_id = p.product_id
GROUP BY p.product_name
ORDER BY returns, p.product_name
LIMIT 5
-- answer:
SELECT p.product_name, COUNT(r.return_id) AS returns
FROM products p
LEFT JOIN returns r ON r.product_id = p.product_id
GROUP BY p.product_name
ORDER BY returns, p.product_name
LIMIT 5
```

<div class="keypoints">

- LEFT JOIN keeps every left row; unmatched ones get NULL in the right table's columns.
- The result has at least as many rows as the left table.
- WHERE right_key IS NULL lists the left rows with no match.
- Filters on the right table belong in ON, not WHERE.
- After a left join, count with COUNT(right column), not COUNT(*), and wrap sums in COALESCE.
- Once a chain of joins uses LEFT JOIN, keep the later joins LEFT too.

</div>

**New words:** *left join*, *left table*, *right join*, *full join*, *COALESCE*.
