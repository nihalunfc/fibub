---
title: 'Text functions'
seoTitle: 'SQL string functions: TRIM, UPPER, SUBSTR, REPLACE, concat'
summary: 'Trim stray spaces, fix capitals, cut out part of a string, join strings together and search inside text, using the messy customer data in Northbay.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: "GROUP BY city shows both 'Toronto' and 'Toronto ' (with a space). Which fixes it?"
    choices: ['GROUP BY UPPER(city)', 'GROUP BY TRIM(city)', 'GROUP BY LENGTH(city)']
    ans: 1
    why: TRIM removes spaces at the start and end, so both values become 'Toronto' and fall into one group.
  - q: "What does SUBSTR(email, INSTR(email, '@') + 1) give for 'asha@example.com'?"
    choices: ['asha', 'example.com', '@example.com']
    ans: 1
    why: INSTR finds the position of the @ (5). SUBSTR from position 6 to the end gives everything after the @, the domain.
  - q: Which operator joins two strings in SQLite and PostgreSQL?
    choices: ['+', '||', '&']
    ans: 1
    why: The standard operator is ||. SQL Server uses + for strings, and CONCAT() works in all three.
---

**Module 7 · about 25 minutes · read first: 2.3.** You'll be able to clean and reshape text with TRIM, UPPER, LOWER, SUBSTR, INSTR, REPLACE and ||, and use them to fix the grouping and matching problems that messy text causes.

## 1. Why this matters

Text typed by people and copied between systems is messy: trailing spaces, mixed capitals, names in one column that a report needs in two. These small differences split groups in two and make joins miss. Northbay's customer table has exactly these problems planted in it, so you can see the damage and fix it.

## 2. The damage: one city, two groups

Count customers per city. Look closely at the list:

```sql
-- try
SELECT city, COUNT(*) AS customers
FROM customers
GROUP BY city
ORDER BY city
```

There are **22** rows for 11 cities. `'Toronto'` and `'Toronto '` (with a trailing space) are different strings, so GROUP BY keeps them apart. Making the spaces visible helps; `||` joins strings, so wrap the value in brackets:

```sql
-- try
SELECT customer_id, '[' || city || ']' AS shown,
       LENGTH(city) AS len, LENGTH(TRIM(city)) AS trimmed_len
FROM customers
WHERE city <> TRIM(city)
LIMIT 5
```

## 3. Cleaning functions

- `TRIM(x)`: removes spaces at both ends. `LTRIM` and `RTRIM` do one end. `TRIM(x, '.')` removes other characters.
- `UPPER(x)`, `LOWER(x)`: all capitals or all small letters.
- `REPLACE(x, 'old', 'new')`: swaps every copy of one piece of text.
- `LENGTH(x)`: number of characters.

```sql
-- try
SELECT TRIM(city) AS city, COUNT(*) AS customers
FROM customers
GROUP BY TRIM(city)
ORDER BY customers DESC
```

Eleven rows now, and Toronto has **66** customers (64 + 2). Press **Show how it runs** and watch the GROUP BY step: the trimmed values fall into one coloured group.

## 4. Cutting and joining

- `SUBSTR(x, start, length)`: part of a string. Positions start at 1. Leave out the length to go to the end.
- `INSTR(x, 'find')`: the position where 'find' first appears, or 0.
- `a || b`: joins strings (*concatenation*).

```sql
-- try
SELECT customer_id,
       first_name || ' ' || last_name AS full_name,
       SUBSTR(first_name, 1, 1) || '. ' || last_name AS short_name,
       SUBSTR(email, INSTR(email, '@') + 1) AS domain
FROM customers
WHERE customer_id <= 5
```

Watch the SELECT step build three new columns from the old ones. One NULL in a `||` chain makes the whole result NULL; wrap risky parts in `COALESCE(x, '')`.

Dialects: SQL Server uses `+` or `CONCAT()` to join, `LEN()` for length, `SUBSTRING()` and `CHARINDEX('@', email)`. PostgreSQL uses `||`, `SUBSTRING()` and `POSITION('@' IN email)`. `CONCAT()` works in all three and treats NULL as empty text.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** GROUP BY and joins compare values for exact equality. Cleaning applies a function f to every value so that values meant to be equal become equal: f is chosen so f('Toronto ') = f('Toronto').

**Equation:** grouping by f(city) puts rows into the classes { r : f(r.city) = v }. If f merges more values (TRIM then LOWER), there are fewer classes: |image of LOWER(TRIM(x))| ≤ |image of TRIM(x)| ≤ |image of x|. Here 22 raw values → 11 trimmed values. Good cleaning merges only values that mean the same thing; over-cleaning (say, keeping only the first letter) merges things that differ.

**Analogy:** sorting post into pigeonholes by name. If one envelope says "Toronto" and another "TORONTO ", a strict clerk makes two holes. Cleaning tells the clerk to ignore case and spaces. It breaks down a little because a clerk can guess, and SQL never does: it only merges what f makes identical.

**Try it:** values 'Ottawa', 'ottawa ', 'OTTAWA'. How many groups with GROUP BY TRIM(x)? With LOWER(TRIM(x))? (3, then 1.)
</details>

## 5. Searching inside text

`LIKE` matches patterns: `%` is any run of characters, `_` is exactly one.

```sql
-- try
SELECT product_name,
       REPLACE(product_name, ' pack', '-pack') AS tidy_name
FROM products
WHERE product_name LIKE '%pack%'
```

Seven products have "pack" in the name. Note: in SQLite `LIKE` ignores case for plain letters, but `=` does not, so `email = 'UMA.NOVAK17@EXAMPLE.COM'` and `email = 'uma.novak17@example.com'` find different rows. Compare `LOWER(email)` when case should not matter. In PostgreSQL LIKE is case-sensitive and `ILIKE` ignores case.

## 6. Worked example

*Question:* which email domains do Northbay's customers use, ignoring case?

```sql
-- try
SELECT LOWER(SUBSTR(email, INSTR(email, '@') + 1)) AS domain,
       COUNT(*) AS customers
FROM customers
GROUP BY domain
ORDER BY customers DESC
```

1. INSTR finds the @, SUBSTR keeps what follows it.
2. Without LOWER there would be 3 groups: `example.com` (563), `EXAMPLE.COM` (3) and NULL. With LOWER, the 3 capitalised ones join the rest: **566**.
3. The NULL row is the 37 customers with no email: SUBSTR of NULL is NULL.
4. The 3 capitalised emails belong to the duplicate customers you will hunt in [Lesson 7.4](/learn/courses/sql/duplicates/).

## 7. Practice

```sql
-- exercise: List each customer's first and last name joined with a space as full_name, for customers 1 to 5.
-- hint: first_name || ' ' || last_name.
SELECT first_name, last_name
FROM customers
WHERE customer_id <= 5
-- answer:
SELECT first_name || ' ' || last_name AS full_name
FROM customers
WHERE customer_id <= 5
```

```sql
-- exercise: How many customers have a city with a space at the start or end? Give one number.
-- hint: WHERE city <> TRIM(city), then COUNT(*).
SELECT COUNT(*) AS untidy
FROM customers
-- answer:
SELECT COUNT(*) AS untidy
FROM customers
WHERE city <> TRIM(city)
```

```sql
-- exercise: Show the part of each email before the @ (the user name) for customers 1 to 5, as user_name.
-- hint: SUBSTR(email, 1, INSTR(email, '@') - 1).
SELECT customer_id, email
FROM customers
WHERE customer_id <= 5
-- answer:
SELECT customer_id, SUBSTR(email, 1, INSTR(email, '@') - 1) AS user_name
FROM customers
WHERE customer_id <= 5
```

**Try it on your own data:** [[text-cleaner]] trims spaces and fixes case in pasted text; [[regex-tester]] helps when a pattern is too hard for LIKE.

**New words:** *TRIM*, *concatenation*, *SUBSTR*, *INSTR*, *pattern*.
