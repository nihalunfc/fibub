---
title: 'Facts and dimensions'
seoTitle: 'Facts vs dimensions in a data warehouse, with examples'
summary: 'Facts are the numbers an event measures; dimensions are the words that describe it. Sort every Northbay column into one or the other, handle the tricky ones like unit price and discount, and compute sales, cost and margin at the line grain.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: Which Northbay column is a fact at the order-line grain?
    choices: ['quantity', 'brand', 'city']
    ans: 0
    why: quantity is a number measured by the sale itself and adds up across lines. brand and city describe the product and store, so they are dimension attributes.
  - q: 'A store''s size_sqft is a number. Is it a fact in the sales fact table?'
    choices: ['No, it describes the store, so it is a dimension attribute', 'Yes, every number is a fact', 'Only on weekends']
    ans: 0
    why: Size doesn't come from the sale and summing it across sales is meaningless. It belongs on the store dimension, where you can group by size bands.
  - q: Why store discount_amount rather than the discount rate as the fact?
    choices: ['Amounts add up across lines; rates do not', 'Rates take more space', 'SQL cannot store fractions']
    ans: 0
    why: Two lines at 10% off don't make 20% off. Store additive amounts, and work out rates in the report as a ratio of sums.
---

**Module 2 · about 30 minutes · read first: 2.2.** You'll be able to sort any column into fact or dimension, choose additive facts over rates and unit prices, and compute line-level sales, cost and margin.

## 1. Why this matters

Once the grain is set, every column you add is either a number you measure or a word you describe things with. Getting that split right is what makes a model easy to use in Power BI or Tableau: facts go in the Values well, dimension attributes go on the axes and in the filters. Get it wrong and users drag a price into a SUM, or can't filter by something they need.

## 2. Two kinds of column

At the grain "one row per product on a completed order":

- A *fact* (or *measure*) is a number produced by the event itself: how many, how much. Quantity, sales amount and cost amount. You usually add facts up.
- A *dimension* is the context of the event: when, where, who, what, why, how. Each dimension has *attributes*, mostly text: the product's name, brand, category and department; the store's city and region; the customer's tier. You filter and group by dimension attributes.

A quick test for any column: **would you add it up, or group by it?** Add up → fact. Group by → dimension attribute.

| Column | Fact or dimension? | Why |
|---|---|---|
| quantity | fact | measured by the sale, adds up |
| order_date | dimension (date) | when |
| store_id, city, region | dimension (store) | where |
| customer_id, loyalty_tier | dimension (customer) | who |
| product_id, brand, department | dimension (product) | what |
| promo_id | dimension (promotion) | why it was cheap |
| size_sqft | dimension attribute | a number, but it describes the store |
| unit_price, discount | neither, as stored | turn them into amounts (section 4) |

## 3. Facts at the grain

Here are the facts for one order, worked out line by line from the source columns:

```sql
-- try
SELECT i.order_id, p.product_name, i.quantity,
       ROUND(i.quantity * i.unit_price, 2) AS gross_amount,
       ROUND(i.quantity * i.unit_price * i.discount, 2) AS discount_amount,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount,
       ROUND(i.quantity * p.unit_cost, 2) AS cost_amount
FROM order_items i
JOIN products p ON p.product_id = i.product_id
WHERE i.order_id = 1038
```

Every one of those columns is true for its line and can be added across lines: the order's gross amount is the sum of its lines' gross amounts, and so on. (`unit_cost` here is today's cost from `products`; a real warehouse would record the cost at the time of sale. Module 5 deals with values that change.)

## 4. The tricky columns

**Unit price.** It is a number on the line, but adding prices across lines means nothing: a kettle at $44.99 plus bananas at $1.99 is not a price. Store the *extended* amount (quantity × price) as the fact. If someone needs an average price, it is SUM(sales_amount) ÷ SUM(quantity).

**Discount rate.** Two lines at 10% off do not make 20% off. Store `discount_amount` instead and work out the rate as SUM(discount_amount) ÷ SUM(gross_amount).

**Numbers that describe.** A store's floor space, a product's shelf price today, a customer's year of birth: numeric, but they describe a thing rather than measure the event. They are dimension attributes, and often more useful as bands ("small, medium, large store").

```sql
-- try
SELECT CASE WHEN s.size_sqft >= 18000 THEN 'large' WHEN s.size_sqft >= 15000 THEN 'medium' ELSE 'small' END AS store_size,
       COUNT(DISTINCT s.store_id) AS stores,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
JOIN stores s ON s.store_id = o.store_id
WHERE o.status = 'completed' AND s.size_sqft IS NOT NULL
GROUP BY store_size
ORDER BY sales DESC
```

Here size is grouped by, never summed: a dimension attribute doing its job.

**Order id.** Every line carries its order number. It's not a measure, and it has no attributes left (date, store and customer have their own dimensions). It stays in the fact table as a plain label so you can count orders and trace a line back to its receipt. Kimball calls this a *degenerate dimension*; [Lesson 4.5](/learn/courses/data-modelling/junk-degenerate/) covers it.

## 5. Dimensions are wide and descriptive

A good dimension has many attributes, written as words people use. "Grocery" beats a code `G`; "Ontario South" beats region 1. Every attribute you add is a new way to slice every fact. Look at how much one product row can tell a report:

```sql
-- try
SELECT p.product_id, p.product_name, p.brand, c.category_name, c.department, p.unit_price AS shelf_price
FROM products p
JOIN categories c ON c.category_id = p.category_id
WHERE p.product_id IN (19, 54)
```

Facts tables are the opposite: narrow (a few keys and numbers) and very long (one row per event). Dimension tables are wide and short (one row per product, store or customer). That contrast is the shape of the star schema in the next lesson.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** dimension attributes split the fact rows into groups; facts are the numbers you add inside each group.

**Equation:** an attribute such as department is a function a: rows → {Grocery, Home, Kids, Tech}. Its values *partition* the rows into disjoint groups. For an additive fact m, the group totals add back to the grand total: Σ over groups of (Σ m in the group) = Σ m over all rows. A rate such as discount r does not have this property: the overall rate is Σ(r × gross) ÷ Σ gross, a weighted average, not Σ r.

**Analogy:** sorting coins into jars by country. However you sort them, the total money is the same (an additive fact). But the "average coin size" of the jars doesn't add up to anything.

**Try it:** department splits the 7,112 completed lines into four groups. Must the four groups' line counts add up to 7,112? (Yes: every line is in exactly one department.)
</details>

## 6. Worked example: margin by department

*Question:* which department makes the most gross margin, in dollars and as a percentage?

```sql
-- try
SELECT c.department,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales,
       ROUND(SUM(i.quantity * p.unit_cost), 2) AS cost,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)) - SUM(i.quantity * p.unit_cost), 2) AS margin,
       ROUND(100.0 * (SUM(i.quantity * i.unit_price * (1 - i.discount)) - SUM(i.quantity * p.unit_cost))
             / SUM(i.quantity * i.unit_price * (1 - i.discount)), 1) AS margin_pct
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed'
GROUP BY c.department
ORDER BY margin DESC
```

1. Sales, cost and margin are additive facts: each department's figure is a plain SUM over its lines.
2. Margin % is not stored anywhere. It is worked out per group as SUM(margin) ÷ SUM(sales). Averaging each line's margin % would give a different, wrong answer, because a $1.99 line would count as much as a $89.99 one.
3. Read the result. Grocery sells the most ($48,694.13) but keeps only 30.8% of it. Home makes the most margin in dollars, $19,745.56 at 46.8%. Kids has the highest margin % (47.1%) but the smallest dollar margin. "Most profitable" depends on which of the two you mean, so say which in the report.

## 7. Practice

```sql
-- exercise: For completed orders, show the overall discount rate as a percentage per year: SUM(discount_amount) / SUM(gross_amount) × 100, rounded to 2 decimals.
-- hint: discount_amount = quantity * unit_price * discount; gross_amount = quantity * unit_price. GROUP BY strftime('%Y', order_date).
SELECT strftime('%Y', o.order_date) AS year, ROUND(AVG(i.discount) * 100, 2) AS discount_pct
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
WHERE o.status = 'completed'
GROUP BY year
-- answer:
SELECT strftime('%Y', o.order_date) AS year,
       ROUND(100.0 * SUM(i.quantity * i.unit_price * i.discount) / SUM(i.quantity * i.unit_price), 2) AS discount_pct
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
WHERE o.status = 'completed'
GROUP BY year
```

```sql
-- exercise: Average price paid per unit, per department: SUM(sales_amount) / SUM(quantity), rounded to 2 decimals, for completed orders.
-- hint: sales_amount = quantity * unit_price * (1 - discount). Divide the two sums inside each department group.
SELECT c.department, ROUND(SUM(i.unit_price), 2) AS price
FROM order_items i
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
GROUP BY c.department
-- answer:
SELECT c.department,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)) / SUM(i.quantity), 2) AS avg_price_paid
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed'
GROUP BY c.department
```

```sql
-- exercise: Use a dimension attribute: show completed sales by customer loyalty tier, biggest first. Keep guest orders (they land in the blank group, with members who have no tier).
-- hint: LEFT JOIN customers so guest orders stay; GROUP BY loyalty_tier.
SELECT o.customer_id, COUNT(*) AS orders
FROM orders o
GROUP BY o.customer_id
-- answer:
SELECT c.loyalty_tier,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
LEFT JOIN customers c ON c.customer_id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.loyalty_tier
ORDER BY sales DESC
```

**New words:** *fact*, *measure*, *dimension*, *attribute*, *extended amount*, *degenerate dimension*.
