---
title: 'Self-joins: a table joined to itself'
seoTitle: 'SQL self join explained: employees and managers'
summary: 'Join a table to a second copy of itself to put each employee next to their manager, find duplicate customers, or compare rows in the same table. Uses Northbay staff and sign-ups.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Why must you give the table two different aliases in a self-join?
    choices: ['SQL needs to know which copy each column comes from', 'It makes the query faster', 'Aliases are optional in self-joins']
    ans: 0
    why: Both copies have the same column names. e.name and m.name tell SQL (and readers) which copy you mean.
  - q: 'employees e JOIN employees m ON m.employee_id = e.manager_id: who is missing from the result?'
    choices: ['The CEO, whose manager_id is NULL', 'Every store manager', 'Nobody']
    ans: 0
    why: An inner join drops rows with no match. The CEO has no manager, so use a LEFT JOIN to keep her.
  - q: 'When pairing rows of the same table, why write a.customer_id < b.customer_id rather than <>?'
    choices: ['< is faster', '< keeps each pair once and never pairs a row with itself', '<> is not allowed']
    ans: 1
    why: With <> you get both (17, 601) and (601, 17). With < you get only (17, 601), and a row can never be less than itself.
sources:
  - 'PostgreSQL documentation, Joins Between Tables (self join) https://www.postgresql.org/docs/current/tutorial-join.html'
  - 'SQLite documentation, SELECT: The FROM clause and table aliases https://www.sqlite.org/lang_select.html#fromclause'
  - 'Molinaro, A. and de Graaf, R. (2020), SQL Cookbook, 2nd edition, O''Reilly, chapter 3 (Working with Multiple Tables)'
---

**Module 4 · about 25 minutes · read first: 4.3.** You'll be able to join a table to itself, show each employee with their manager, and compare rows of the same table without counting pairs twice.

<div class="bigidea">A self-join joins a table to a second copy of itself, using two aliases, so a row can be matched with another row of the same table.</div>

**In everyday terms:** a class photo where every student holds a card with their buddy's name. To list "student and buddy", you look at the photo twice: once to read the student, once to find the buddy's face.

## 1. Why this matters

Some tables point at themselves. An employee's manager is another employee; a product can replace an older product; a customer can refer a friend. HR reports, org charts, duplicate checks and "compare this row with that row" questions all need a **self-join**. Interviewers love the "employees who earn more than their manager" question for exactly this reason.

## 2. Two copies of one table

A self-join is an ordinary join where both sides are the same table. The trick is to give it two aliases, so you can pretend there are two tables. In `employees`, `manager_id` holds the `employee_id` of that person's manager, so it is a foreign key into its own table.

Start with the people in head office and the online team (no `store_id`, or store 12), so the picture stays small. Press **Show how it runs** and watch each employee find their manager in the second copy.

```sql
-- try
SELECT e.name AS employee, e.role, m.name AS manager
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.store_id IS NULL OR e.store_id = 12
```

Read `e` as "the employee" and `m` as "the manager". Riya and Tom report to Morgan Ellis; Hana and Olivia report to Tom Becker.

## 3. Keep the person at the top

Morgan Ellis, the CEO, is missing. Her `manager_id` is NULL, so the inner join found no match. Use a left join to keep everyone:

```sql
-- try
SELECT e.employee_id, e.name AS employee, e.role,
       COALESCE(m.name, '(nobody)') AS manager
FROM employees e
LEFT JOIN employees m ON m.employee_id = e.manager_id
WHERE e.store_id IS NULL OR e.store_id = 12
ORDER BY e.employee_id
```

Now all five appear, with "(nobody)" for the CEO. The full table has 38 staff; drop the WHERE to see them all.

<div class="meaning">

<dl>
<dt>Self-join</dt><dd>A join where both sides are the same table.</dd>
<dt>Two aliases (e, m)</dt><dd>Nicknames that let you treat one table as two: "the employee" and "the manager".</dd>
<dt>manager_id → employee_id</dt><dd>A foreign key that points into its own table.</dd>
<dt>a.id &lt; b.id</dt><dd>When pairing rows, stops a row pairing with itself and keeps each pair once.</dd>
<dt>Direct report</dt><dd>Someone whose manager_id is this person.</dd>
<dt>Physical meaning</dt><dd>The database reads the same rows twice and puts a matching pair side by side, so columns from two different rows (an employee's and their manager's) end up on one line where you can compare them.</dd>
</dl>

</div>

<div class="myth">

**"To find pairs in one table, join ON a.city = b.city."** That pairs every row with itself and lists every pair twice (A–B and B–A). Add `a.id < b.id`: no self-pairs, each pair once. With n rows sharing a value you get n(n − 1)/2 pairs.

</div>

Watch a self-join run, one step at a time (the live boxes' **Show how it runs** button animates the real employees):

<div class="steps">
<div class="step"><b>One table, read as e.</b> <table class="lk-tbl"><tr><th>employee_id</th><th>name</th><th>manager_id</th></tr><tr><td>1</td><td>Morgan</td><td><i>NULL</i></td></tr><tr><td>2</td><td>Riya</td><td>1</td></tr><tr><td>3</td><td>Tom</td><td>1</td></tr><tr><td>4</td><td>Hana</td><td>3</td></tr></table></div>
<div class="step"><b>The same table, read again as m.</b> Each e row looks up its manager_id in m.employee_id.</div>
<div class="step"><b>Matches side by side.</b> <table class="lk-tbl"><tr><th>employee</th><th>manager</th></tr><tr><td>Riya</td><td><mark>Morgan</mark></td></tr><tr><td>Tom</td><td><mark>Morgan</mark></td></tr><tr><td>Hana</td><td><mark>Tom</mark></td></tr></table></div>
<div class="step"><b>Morgan is missing.</b> Her manager_id is NULL, so the inner join drops her. A LEFT JOIN keeps her with a blank manager.</div>
</div>

The ids in this picture are simplified. Now count pairs yourself:

<div class="problem" data-problem="sql-self-join-pairs"></div>

## 4. Comparing a row with its partner

Once the manager's columns sit next to the employee's, you can compare them. *Question:* who was hired **before** their own manager?

```sql
-- try
SELECT e.name AS employee, e.hired_on,
       m.name AS manager, m.hired_on AS manager_hired_on
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.hired_on < m.hired_on
```

Three people: Uma Murphy, Quinn Brown and Fatima Gagnon. Each joined before the current store manager took over. (Swap the test to `e.salary > m.salary` for the classic interview question; at Northbay nobody out-earns their manager, so it returns no rows.)

## 5. Pairs within one table

A self-join can also pair rows that share something, without a pointer column. Here is how to find customers who signed up twice: same first and last name, and the same email once capitals are ignored.

```sql
-- try
SELECT a.customer_id AS first_id, b.customer_id AS second_id,
       a.first_name, a.last_name, a.email, b.email AS other_email
FROM customers a
JOIN customers b
  ON  a.first_name = b.first_name
  AND a.last_name  = b.last_name
  AND LOWER(a.email) = LOWER(b.email)
  AND a.customer_id < b.customer_id
```

Three pairs: 17 and 601, 142 and 602, 388 and 603. The condition `a.customer_id < b.customer_id` does two jobs: it stops a row pairing with itself (17 with 17), and it keeps each pair once instead of twice (17–601 but not 601–17). You will clean these up properly in [Lesson 7.4](/learn/courses/sql/duplicates/).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a self-join is a join of a table with a renamed copy of itself. Renaming (ρ) is what makes the two sides distinguishable.

**Equation:** ρ_e(Employees) ⋈_{e.manager_id = m.employee_id} ρ_m(Employees). For pairs within one table, the condition a.id < b.id picks one of the two ordered pairs (a, b) and (b, a) and removes the diagonal (a, a). From n rows that gives at most n(n − 1)/2 pairs instead of n².

**Analogy:** a class photo where every student holds a card with the name of their buddy. To list "student and buddy", you look at the photo twice: once to read the student, once to find the buddy's face.

**Try it:** the 11 physical stores (store 12 has no province). How many store pairs share a province, counting each pair once? (Use stores a JOIN stores b ON a.province = b.province AND a.store_id < b.store_id. The answer is 22: Ontario's 7 stores make 21 pairs and Alberta's 2 make 1.)
</details>

## 6. Worked example: who has the most direct reports?

*Question:* which managers have the most people reporting straight to them?

1. Join each employee `e` to their manager `m`.
2. Group by the manager, and count the employees.

```sql
-- try
SELECT m.name AS manager, m.role, COUNT(*) AS direct_reports
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
GROUP BY m.employee_id, m.name, m.role
ORDER BY direct_reports DESC
LIMIT 3
```

Riya Sethi (VP Operations) has **11**, one manager per physical store. Every store manager has 2. A self-join only goes up one level; to walk the whole chain from an associate to the CEO you need a recursive query, in [Lesson 5.5](/learn/courses/sql/recursive-cte/).

## 7. Practice

```sql
-- exercise: List every store employee who works in a different store from their manager, or whose manager has no store. Show the employee's name, their store_id, and the manager's name.
-- hint: Self-join on m.employee_id = e.manager_id, then WHERE e.store_id IS NOT NULL AND (m.store_id IS NULL OR m.store_id <> e.store_id).
SELECT e.name, e.store_id
FROM employees e
WHERE e.store_id IS NOT NULL
-- answer:
SELECT e.name, e.store_id, m.name AS manager
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
WHERE e.store_id IS NOT NULL
  AND (m.store_id IS NULL OR m.store_id <> e.store_id)
```

```sql
-- exercise: For each employee, show their name, salary, their manager's salary, and the gap (manager's salary minus theirs). Leave out the CEO. Biggest gap first.
-- hint: e JOIN m on m.employee_id = e.manager_id; the gap is m.salary - e.salary; ORDER BY gap DESC.
-- check: set
SELECT e.name, e.salary
FROM employees e
-- answer:
SELECT e.name, e.salary, m.salary AS manager_salary, m.salary - e.salary AS gap
FROM employees e
JOIN employees m ON m.employee_id = e.manager_id
ORDER BY gap DESC
```

```sql
-- exercise: List pairs of associates who work in the same store. Show both names and the store_id, each pair once.
-- hint: employees a JOIN employees b ON a.store_id = b.store_id AND a.employee_id < b.employee_id, then keep rows where both roles are 'Associate'.
SELECT a.name, b.name, a.store_id
FROM employees a
JOIN employees b ON a.store_id = b.store_id
WHERE a.role = 'Associate' AND b.role = 'Associate'
-- answer:
SELECT a.name, b.name, a.store_id
FROM employees a
JOIN employees b ON a.store_id = b.store_id AND a.employee_id < b.employee_id
WHERE a.role = 'Associate' AND b.role = 'Associate'
```

<div class="keypoints">

- A self-join is an ordinary join with the same table on both sides and two aliases.
- Use it when a column points into its own table, such as manager_id.
- A LEFT self-join keeps the row at the top (the CEO, whose manager is NULL).
- With both rows on one line you can compare them: hired before the manager, earns more.
- When pairing rows that share a value, add a.id &lt; b.id: n rows give n(n − 1)/2 pairs.

</div>

**New words:** *self-join*, *renaming*, *direct report*.
