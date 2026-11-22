---
title: 'Reading and drawing ER diagrams'
seoTitle: "ER diagrams and crow's foot notation explained"
summary: "Learn to read an entity-relationship diagram in crow's-foot notation, from one-to-many to many-to-many, then check every line of Northbay's diagram against the real data with SQL."
minutes: 30
updated: 2026-11-22
quiz:
  - q: "In crow's-foot notation, what does a circle next to a crow's foot mean?"
    choices: ['Zero or many', 'Exactly one', 'One or many']
    ans: 0
    why: The symbol nearest the box is the most there can be (the crow's foot means many); the one further out is the least (a circle means zero).
  - q: Northbay orders can have no customer (guests). How is that shown on the customer end of the customers–orders line?
    choices: ['A circle and a bar: zero or one', 'Two bars: exactly one', "A crow's foot"]
    ans: 0
    why: Each order has at most one customer, and guests have none, so the customer end is zero or one.
  - q: How is a many-to-many relationship between orders and products stored in tables?
    choices: ['Through a table in between (order_items) with a key from each side', 'With a list of product ids in orders', 'It cannot be stored']
    ans: 0
    why: A bridge table turns one many-to-many line into two one-to-many lines. order_items has one row per order and product pair.
sources:
  - 'Chen, P. P. (1976), The Entity-Relationship Model: Toward a Unified View of Data, ACM Transactions on Database Systems 1(1) https://doi.org/10.1145/320434.320440'
  - 'SQLite documentation: Foreign key support https://www.sqlite.org/foreignkeys.html'
  - 'Microsoft Learn, Power BI: Model relationships in Power BI Desktop https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-relationships-understand'
---

**Module 1 · about 30 minutes · read first: 1.2.** You'll be able to read crow's-foot ER diagrams, say the cardinality of any relationship, turn a many-to-many into a bridge table, and check a diagram against real data with SQL.

<div class="bigidea">An ER diagram is the map of a database: boxes for things, lines for links, and marks on each line that say how many rows can match.</div>

**In everyday terms:** a family tree. Boxes are people, lines are relationships. Reading "one parent has zero or many children" tells you how the family fits together before you meet anyone.

## 1. Why this matters

When you join a new team, the first thing you're shown is often a diagram of boxes and lines. It's the map of the source system: what joins to what, and which joins can multiply rows. Being able to read it in a minute, and to draw one for a new data source, saves days of trial-and-error queries. Every design in this course also starts life as a diagram.

## 2. Entities, attributes and relationships

An *ER diagram* (entity-relationship diagram) has three ingredients:

- An *entity* is a kind of thing the business keeps records of: a customer, an order, a product. Each becomes a box, and usually a table.
- An *attribute* is a fact about an entity: a customer's city, a product's price. Attributes are listed in the box and become columns.
- A *relationship* is how two entities are linked: a customer *places* orders. Each becomes a line, and in tables a foreign key.

The *cardinality* of a relationship says how many rows on one side can match one row on the other. The three basic kinds are one-to-one, one-to-many and many-to-many.

## 3. Crow's-foot notation

The most common way to draw cardinality is *crow's-foot notation*. Each end of a line carries two marks. The mark next to the box is the most (a bar for one, a three-pronged crow's foot for many); the mark further out is the least (a bar for one, a circle for zero).

<!--fig:northbay-erd-->

Read each line twice, once in each direction, and always start "one X has ...":

- One **order** has *one or many* order lines (bar then crow's foot by order_items). One order line belongs to *exactly one* order.
- One **customer** has *zero or many* orders (a new member may not have bought yet). One order has *zero or one* customer: guests have none.
- One **store** belongs to *zero or one* region: the online store has no region.
- One **order line** has *zero or many* returns.

## 4. Check the diagram against the data

A diagram is a claim. SQL can test it. Does every order really have at least one line, and at most how many?

```sql
-- try
SELECT lines_in_order, COUNT(*) AS orders
FROM (SELECT order_id, COUNT(*) AS lines_in_order FROM order_items GROUP BY order_id)
GROUP BY lines_in_order
ORDER BY lines_in_order
```

Every order has between 1 and 5 lines, so "one or many" is right. Are there orders with no customer?

```sql
-- try
SELECT COUNT(*) AS orders, COUNT(customer_id) AS with_customer, COUNT(*) - COUNT(customer_id) AS guests
FROM orders
```

482 guest orders: the circle on the customer end is needed. A diagram that drew two bars (exactly one customer) would lead an analyst to an inner join that silently drops all of them.

Is the "zero" on the order end real too? Are there customers with no orders at all?

```sql
-- try
SELECT c.customer_id, c.first_name, c.last_name, c.email, c.joined_on
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL
```

Three, and their capitalised emails give them away: they are the duplicate sign-ups from August 2025. The diagram is right that a customer can have zero orders.

## 5. Many-to-many needs a table in between

One order holds many products, and one product appears on many orders. That is *many-to-many*. A relational table can't store it directly (a list of products in one cell breaks 1NF), so the design adds a *bridge table* (also called an associative or junction table) with a foreign key to each side. `order_items` is exactly that: one row per (order, product) pair, plus the facts that belong to the pair, quantity and price paid.

Press **Show how it runs** to watch two orders fan out to their lines, and each line find its one product:

```sql
-- try
SELECT o.order_id, p.product_name, i.quantity
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id
WHERE o.order_id IN (1038, 1040)
```

A table can also have a relationship with itself. Each employee has a manager who is another employee: `employees.manager_id` points at `employees.employee_id`. On a diagram that's a line that loops back to the same box, one manager to zero or many reports.

## 6. Conceptual, logical, physical

Diagrams come in three levels of detail. A *conceptual* model shows only entities and relationships, for talking with the business ("customers place orders at stores"). A *logical* model adds attributes, keys and cardinality, but no database specifics; the figure above is logical. A *physical* model is the real tables with data types, indexes and constraints for one database product. You will draw all three in the capstone.

<div class="meaning">

<dl>
<dt>Entity</dt><dd>A kind of thing the business keeps records of; a box, usually a table.</dd>
<dt>Attribute</dt><dd>A fact about an entity; a column.</dd>
<dt>Relationship</dt><dd>How two entities are linked; a line, usually a foreign key.</dd>
<dt>Cardinality</dt><dd>How many rows on one side can match one row on the other: one-to-one, one-to-many, many-to-many.</dd>
<dt>Bridge table</dt><dd>A table in between that turns a many-to-many into two one-to-many links.</dd>
<dt>Physical meaning</dt><dd>Each line is a foreign key in one table pointing at a key in another. The marks tell you whether a join can drop rows (a circle: zero allowed) or multiply them (a crow's foot: many).</dd>
</dl>

</div>

<div class="myth">

**"If today's data shows at most one, the line is one."** Draw the business rule, not today's data. A line can be returned twice even if nobody has done it yet, and a customer can have zero orders.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>Two boxes.</b> <table class="lk-tbl"><tr><th>customer_id</th><th>name</th></tr><tr><td>10</td><td>Uma</td></tr><tr><td>11</td><td>Ben</td></tr></table> <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th></tr><tr><td>1038</td><td>10</td></tr><tr><td>1039</td><td>10</td></tr><tr><td>1040</td><td>NULL</td></tr></table></div>
<div class="step"><b>Read left to right.</b> One customer has zero or many orders: <table class="lk-tbl"><tr><th>customer</th><th>orders</th></tr><tr><td>Uma</td><td><mark>2</mark></td></tr><tr><td>Ben</td><td><mark>0</mark></td></tr></table></div>
<div class="step"><b>Read right to left.</b> One order has zero or one customer: order 1040 is a guest. <table class="lk-tbl"><tr><th>order_id</th><th>customer</th></tr><tr><td>1038</td><td>Uma</td></tr><tr><td>1039</td><td>Uma</td></tr><tr><td>1040</td><td><mark>none</mark></td></tr></table></div>
<div class="step"><b>Why it matters.</b> An inner join drops the guest: <table class="lk-tbl"><tr><th>order_id</th><th>name</th></tr><tr><td>1038</td><td>Uma</td></tr><tr><td>1039</td><td>Uma</td></tr></table> The circle on the line warned you.</div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-guest-drop"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a relationship is a relation between two sets, and cardinality says what kind of mapping it is.

**Equation:** for orders → customers, each order maps to at most one customer, so it is a *partial function* (partial because guests map to nothing). For order_items → orders, each line maps to exactly one order: a *total function*. Seen from the other side, order → lines is not a function at all (one order, many lines). Many-to-many is a relation R ⊆ Orders × Products, stored as the set of pairs, which is exactly the bridge table's key (order_id, product_id).

**Analogy:** a class register. Each pupil has one form tutor (function); each tutor has many pupils (not a function); pupils and clubs are many-to-many, so the school keeps a separate list of (pupil, club) sign-ups.

**Try it:** stores → regions maps 11 stores to 4 regions and leaves the online store out. Total or partial function? (Partial: one store maps to nothing.)
</details>

## 7. Worked example: draw the returns line

*Question:* what should the ends of the order_items–returns line be?

1. Each return points at one (order_id, product_id) pair. Does every return find its line? An anti-join answers: `SELECT COUNT(*) FROM returns r WHERE NOT EXISTS (SELECT 1 FROM order_items i WHERE i.order_id = r.order_id AND i.product_id = r.product_id)` gives **0**. So the order-line end is *exactly one*.
2. Most lines are never returned: 204 returns against 7,310 lines. So the returns end starts with a circle: *zero or ...*.
3. Could a line have two returns? Run the query below. In today's data the most is 1, but a customer could return two of the three kettles they bought on different days, so the business rule is *zero or many*. Draw the rule, not just today's data.

```sql
-- try
SELECT order_id, product_id, COUNT(*) AS returns_for_line
FROM returns
GROUP BY order_id, product_id
ORDER BY returns_for_line DESC
LIMIT 3
```

## 8. Practice

```sql
-- exercise: Check the stores–regions line: list each region_id with the number of stores in it (the online store's NULL region will show as its own group).
-- hint: GROUP BY region_id and COUNT(*).
SELECT store_id, region_id
FROM stores
-- answer:
SELECT region_id, COUNT(*) AS stores
FROM stores
GROUP BY region_id
```

```sql
-- exercise: Check the categories–products line: show the smallest and largest number of products in any category.
-- hint: Count products per category in a subquery, then take MIN and MAX of that count.
SELECT category_id, COUNT(*) AS products
FROM products
GROUP BY category_id
-- answer:
SELECT MIN(n) AS fewest, MAX(n) AS most
FROM (SELECT category_id, COUNT(*) AS n FROM products GROUP BY category_id)
```

```sql
-- exercise: Check the customers–orders line from the other end: what is the largest number of orders any one customer has placed? Ignore guests.
-- hint: Count orders per customer_id WHERE customer_id IS NOT NULL, then take the MAX.
SELECT COUNT(*) AS orders
FROM orders
WHERE customer_id IS NOT NULL
-- answer:
SELECT MAX(n) AS most_orders
FROM (SELECT customer_id, COUNT(*) AS n FROM orders WHERE customer_id IS NOT NULL GROUP BY customer_id)
```

**Try it on your own data:** describe each table and column of your own source in [[data-dictionary]], then draw its boxes and lines from that list.

<div class="keypoints">

- Entities are boxes, attributes are columns, relationships are lines.
- Crow's foot: the inner mark is the most (bar = one, foot = many), the outer mark the least (bar = one, circle = zero).
- Read every line both ways, starting "one X has ...".
- Many-to-many needs a bridge table, such as order_items.
- Check a diagram against the data with SQL, but draw the business rule.

</div>

**New words:** *ER diagram*, *entity*, *attribute*, *relationship*, *cardinality*, *crow's-foot notation*, *many-to-many*, *bridge table*, *conceptual, logical and physical model*.
