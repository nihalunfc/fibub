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
sources:
  - 'SQLite documentation, Built-in scalar SQL functions https://www.sqlite.org/lang_corefunc.html'
  - 'PostgreSQL documentation, String functions and operators https://www.postgresql.org/docs/current/functions-string.html'
  - 'Microsoft Learn, TRIM (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/functions/trim-transact-sql'
---

**Module 7 · about 25 minutes · read first: 2.3.** You'll be able to clean and reshape text with TRIM, UPPER, LOWER, SUBSTR, INSTR, REPLACE and ||, and use them to fix the grouping and matching problems that messy text causes.

<div class="bigidea">SQL groups and joins only on values that are exactly equal, so text functions clean values until the ones that mean the same thing look the same.</div>

**In everyday terms:** sorting post into pigeonholes by town. A strict clerk makes separate holes for "Toronto" and "TORONTO ". Cleaning tells the clerk to ignore capitals and spaces.

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

<div class="meaning">

<dl>
<dt>TRIM(x)</dt><dd>Removes spaces from both ends. LTRIM and RTRIM do one end.</dd>
<dt>UPPER(x) / LOWER(x)</dt><dd>All capitals or all small letters, so case stops mattering.</dd>
<dt>SUBSTR(x, start, length)</dt><dd>Cuts out part of the text. Positions start at 1.</dd>
<dt>INSTR(x, 'find')</dt><dd>Where 'find' first appears, or 0 if it is not there.</dd>
<dt>a || b</dt><dd>Joins text (concatenation). A NULL anywhere makes the whole result NULL.</dd>
<dt>Physical meaning</dt><dd>The stored data does not change; each row gets a cleaned copy of the value. Grouping by the cleaned copy merges groups that only differed by spaces or case.</dd>
</dl>

</div>

<div class="myth">

**"'Toronto' and 'Toronto ' are the same city, so GROUP BY will merge them."** To SQL they are different strings: one has an extra character. Group by `TRIM(city)` (and `LOWER` if case varies), and check with `LENGTH(city) <> LENGTH(TRIM(city))`.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>Raw values.</b> <table class="lk-tbl"><tr><th>city</th></tr><tr><td>'Toronto'</td></tr><tr><td>'Toronto&nbsp;'</td></tr><tr><td>'toronto'</td></tr><tr><td>'Ottawa'</td></tr></table> GROUP BY city gives 4 groups.</div>
<div class="step"><b>TRIM.</b> <table class="lk-tbl"><tr><th>TRIM(city)</th></tr><tr><td>'Toronto'</td></tr><tr><td><mark>'Toronto'</mark></td></tr><tr><td>'toronto'</td></tr><tr><td>'Ottawa'</td></tr></table> The trailing space is gone: 3 groups.</div>
<div class="step"><b>LOWER(TRIM()).</b> <table class="lk-tbl"><tr><th>LOWER(TRIM(city))</th></tr><tr><td>'toronto'</td></tr><tr><td>'toronto'</td></tr><tr><td><mark>'toronto'</mark></td></tr><tr><td>'ottawa'</td></tr></table> Now 2 groups: Toronto 3, Ottawa 1.</div>
</div>

<div class="problem" data-problem="sql-trim-groups"></div>

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

<div class="keypoints">

- GROUP BY and joins match text exactly: spaces and capitals count.
- TRIM removes spaces; LOWER or UPPER removes case differences.
- SUBSTR, INSTR and || cut and join text.
- One NULL in a || chain makes the result NULL; use COALESCE(x, '').
- Clean only what should merge; check a sample afterwards.

</div>

**New words:** *TRIM*, *concatenation*, *SUBSTR*, *INSTR*, *pattern*.
