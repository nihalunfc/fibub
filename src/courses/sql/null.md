---
title: "NULL: the value that isn't there"
seoTitle: 'SQL NULL explained: IS NULL, COALESCE and common traps'
summary: 'NULL means unknown or missing, and it breaks the usual rules: = NULL finds nothing, NOT IN can return nothing, and arithmetic with NULL gives NULL. Learn IS NULL, COALESCE and the traps.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: How do you find customers with no email?
    choices: ['WHERE email = NULL', 'WHERE email IS NULL', 'WHERE email = '''' ']
    ans: 1
    why: Nothing is ever equal to NULL, not even NULL, so = NULL finds no rows. IS NULL is the special test for it.
  - q: What is 5 + NULL?
    choices: ['5', '0', 'NULL']
    ans: 2
    why: An unknown plus 5 is still unknown, so arithmetic with NULL gives NULL.
  - q: 'WHERE loyalty_tier <> ''Gold'' keeps which rows?'
    choices: ['Every customer who is not Gold, including those with no tier', 'Bronze and Silver customers only; NULL tiers are dropped', 'Only Gold customers']
    ans: 1
    why: NULL <> 'Gold' is unknown, not true, so WHERE drops those rows. Add OR loyalty_tier IS NULL to keep them.
sources:
  - 'SQLite documentation, NULL Handling in SQLite Versus Other Database Engines https://www.sqlite.org/nulls.html'
  - 'Microsoft Learn, NULL and UNKNOWN (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/language-elements/null-and-unknown-transact-sql'
  - 'PostgreSQL documentation, Conditional Expressions (COALESCE, NULLIF) https://www.postgresql.org/docs/current/functions-conditional.html'
---

**Module 2 · about 30 minutes · read first: 2.3.** You'll be able to find and replace missing values, explain why `= NULL` never works, and avoid the NULL traps in `<>` and `NOT IN`.

<div class="bigidea">NULL means "no value here", and any comparison with it is neither true nor false but unknown, so WHERE quietly drops those rows.</div>

**In everyday terms:** a form with a blank box for "favourite colour". Is the blank "blue"? You can't say. Is it "not blue"? You can't say that either. SQL treats the blank the same way: every question about it gets "don't know".

## 1. Why this matters

Real data is full of gaps: customers who skipped the email box, guest checkouts with no customer number, an online store with no city. SQL marks every gap as NULL, and NULL quietly changes the answers of filters, counts and averages. Many "the numbers don't add up" problems in BI teams come down to one unhandled NULL.

## 2. What NULL means

*NULL* means "no value here": unknown, missing or not applicable. It is not zero and it is not an empty piece of text `''`; it is the absence of a value.

In Northbay, store 12 (the website) has no city, and head office staff have no store:

```sql
-- try
SELECT employee_id, name, store_id, role
FROM employees
WHERE store_id IS NULL
```

Three people work at head office. Press **Show how it runs**: at the WHERE step only the rows with an empty store_id survive.

## 3. = NULL finds nothing

The natural thing to type is wrong:

```sql
-- try
SELECT COUNT(*) AS found
FROM customers
WHERE email = NULL
```

0, even though 37 customers have no email. Comparing anything with NULL, even NULL itself, gives *unknown*, and WHERE keeps only rows where the test is *true*. Use `IS NULL` and `IS NOT NULL`:

```sql
-- try
SELECT customer_id, first_name, last_name, email
FROM customers
WHERE email IS NULL
```

## 4. Three-valued logic

In SQL a test can be **true**, **false** or **unknown**. Run this and look at the blanks: each blank is NULL, meaning unknown.

```sql
-- try
SELECT NULL = NULL AS equal,
       NULL + 5 AS plus,
       NULL || 'x' AS joined,
       1 IN (1, NULL) AS in_list,
       2 NOT IN (1, NULL) AS not_in_list
```

- `NULL = NULL` is unknown: two unknown values might or might not be equal.
- `NULL + 5` is NULL: unknown plus 5 is still unknown.
- `1 IN (1, NULL)` is true: 1 matched, so the NULL doesn't matter.
- `2 NOT IN (1, NULL)` is unknown: 2 might be equal to the unknown value.

<div class="meaning">

<dl>
<dt>NULL</dt><dd>No value: unknown, missing or not applicable. Not 0 and not empty text ''.</dd>
<dt>IS NULL / IS NOT NULL</dt><dd>The only tests that find (or skip) blanks.</dd>
<dt>Unknown</dt><dd>The third answer a test can give, besides true and false. WHERE drops it.</dd>
<dt>COALESCE(a, b)</dt><dd>The first value that is not NULL: fills a blank with a default.</dd>
<dt>NULLIF(a, b)</dt><dd>Gives NULL when a = b, for example to avoid dividing by zero.</dd>
<dt>Physical meaning</dt><dd>A NULL cell holds nothing. Any test on it (=, &lt;&gt;, &gt;, NOT IN) is unknown, so the row fails both a filter and its opposite, and silently falls out of both answers.</dd>
</dl>

</div>

<div class="myth">

**"WHERE tier = 'Gold' and WHERE tier &lt;&gt; 'Gold' together cover every row."** Rows with a NULL tier fail both tests. Northbay has 54 Gold and 491 not-Gold customers, which is 545, not 603. If the blanks should count, add `OR tier IS NULL`.

</div>

Watch the &lt;&gt; trap happen, one step at a time:

<div class="steps">
<div class="step"><b>Five customers.</b> <table class="lk-tbl"><tr><th>id</th><th>tier</th></tr><tr><td>1</td><td>Gold</td></tr><tr><td>2</td><td>Silver</td></tr><tr><td>3</td><td><i>NULL</i></td></tr><tr><td>4</td><td>Bronze</td></tr><tr><td>5</td><td><i>NULL</i></td></tr></table></div>
<div class="step"><b>Test tier &lt;&gt; 'Gold'.</b> <table class="lk-tbl"><tr><th>id</th><th>tier</th><th>test</th></tr><tr><td>1</td><td>Gold</td><td>false</td></tr><tr><td>2</td><td>Silver</td><td>true</td></tr><tr><td>3</td><td><i>NULL</i></td><td><mark>unknown</mark></td></tr><tr><td>4</td><td>Bronze</td><td>true</td></tr><tr><td>5</td><td><i>NULL</i></td><td><mark>unknown</mark></td></tr></table></div>
<div class="step"><b>WHERE keeps only true.</b> 2 rows, not 4. <table class="lk-tbl"><tr><th>id</th><th>tier</th></tr><tr><td>2</td><td>Silver</td></tr><tr><td>4</td><td>Bronze</td></tr></table></div>
<div class="step"><b>Add OR tier IS NULL.</b> The blanks come back: 4 rows. <table class="lk-tbl"><tr><th>id</th><th>tier</th></tr><tr><td>2</td><td>Silver</td></tr><tr><td><mark>3</mark></td><td><i>NULL</i></td></tr><tr><td>4</td><td>Bronze</td></tr><tr><td><mark>5</mark></td><td><i>NULL</i></td></tr></table></div>
</div>

Press **Show how it runs** on any live box in this lesson to watch the real rows fade out. Then try it:

<div class="problem" data-problem="sql-null-not-equal"></div>

## 5. The <> trap

How many customers are *not* Gold?

```sql
-- try
SELECT COUNT(*) AS not_gold
FROM customers
WHERE loyalty_tier <> 'Gold'
```

491. But there are 603 customers and 54 are Gold, so you'd expect 549. The missing 58 have a NULL tier: `NULL <> 'Gold'` is unknown, so WHERE drops them. If they should count, say so:

```sql
-- try
SELECT COUNT(*) AS not_gold
FROM customers
WHERE loyalty_tier <> 'Gold' OR loyalty_tier IS NULL
```

## 6. The NOT IN trap

If the list after `NOT IN` contains a NULL, every test is unknown or false, so you get no rows at all. Here it is with a typed list:

```sql
-- try
SELECT store_name
FROM stores
WHERE store_id NOT IN (1, 2, NULL)
```

No rows. With a typed list you'd never write NULL, but in Lesson 5.2 the list comes from a subquery, and then a single NULL in a column wipes out the answer. `NOT EXISTS` (Lesson 4.4) doesn't have this problem.

## 7. COALESCE: fill in a default

`COALESCE(a, b, ...)` returns the first value that isn't NULL. Use it to show a label instead of a blank:

```sql
-- try
SELECT customer_id, first_name,
       COALESCE(loyalty_tier, 'No tier') AS tier,
       COALESCE(email, '(none)') AS email
FROM customers
WHERE customer_id <= 12
```

SQL Server also has `ISNULL(a, b)` and older SQLite code uses `IFNULL(a, b)`; COALESCE works in all of them. The opposite, `NULLIF(a, b)`, turns a value into NULL when a = b, which is handy to avoid dividing by zero: `x / NULLIF(y, 0)`.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** SQL uses *three-valued logic*. Besides true (T) and false (F) there is unknown (U). WHERE keeps a row only when its test is T; both F and U are dropped.

**Equation:** AND takes the "worst" value: T AND U = U, F AND U = F. OR takes the "best": T OR U = T, F OR U = U. NOT U = U. So x NOT IN (1, NULL) = (x ≠ 1) AND (x ≠ NULL) = (x ≠ 1) AND U, which is never T. And for any arithmetic f, f(NULL) = NULL.

**Analogy:** a form with a blank box. Is the blank equal to "Gold"? You can't say, so you can't say it isn't, either. It breaks down a little for GROUP BY and DISTINCT, which put all NULLs together in one group as if they were equal.

**Try it:** what is (NULL = 1) OR (1 = 1)? (True: U OR T = T, so that row would be kept.)
</details>

## 8. Worked example

*Question:* what share of Northbay's orders were placed by guests (no customer_id)?

1. Total orders: 4,064.
2. Guest orders: `WHERE customer_id IS NULL` gives 482.
3. Share: 482 / 4,064 = 0.1186, so about **11.9%**.

```sql
-- try
SELECT COUNT(*) AS all_orders,
       COUNT(*) - COUNT(customer_id) AS guest_orders,
       ROUND((COUNT(*) - COUNT(customer_id)) * 100.0 / COUNT(*), 1) AS guest_pct
FROM orders
```

This uses a trick you'll meet properly in Lesson 3.1: `COUNT(*)` counts every row, while `COUNT(customer_id)` skips NULLs, so the difference is the number of NULLs.

## 9. Practice

```sql
-- exercise: List the first name, last name and city of every customer who has no loyalty tier.
-- hint: WHERE loyalty_tier IS NULL (not = NULL).
SELECT first_name, last_name, city
FROM customers
WHERE loyalty_tier = NULL
-- answer:
SELECT first_name, last_name, city
FROM customers
WHERE loyalty_tier IS NULL
```

```sql
-- exercise: Count the orders that were NOT placed during a promotion (promo_id is empty).
-- hint: COUNT(*) with WHERE promo_id IS NULL.
SELECT COUNT(*) AS orders
FROM orders
WHERE promo_id IS NOT NULL
-- answer:
SELECT COUNT(*) AS orders
FROM orders
WHERE promo_id IS NULL
```

```sql
-- exercise: List every store's name and city, showing 'Online' instead of a blank for the store with no city.
-- hint: COALESCE(city, 'Online')
SELECT store_name, city
FROM stores
-- answer:
SELECT store_name, COALESCE(city, 'Online') AS city
FROM stores
```

<div class="keypoints">

- NULL means no value; it is not 0 and not ''.
- = NULL never finds anything. Use IS NULL and IS NOT NULL.
- Tests on NULL give unknown, and WHERE drops unknown rows.
- &lt;&gt; and NOT IN silently skip NULLs; a NULL inside a NOT IN list empties the answer.
- COALESCE fills blanks with a default; NULLIF(y, 0) avoids division by zero.

</div>

**New words:** *NULL*, *IS NULL*, *three-valued logic*, *unknown*, *COALESCE*, *NULLIF*.
