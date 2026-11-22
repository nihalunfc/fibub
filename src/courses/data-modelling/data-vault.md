---
title: 'Data Vault: hubs, links and satellites'
seoTitle: 'Data Vault modelling explained: hubs, links, satellites'
summary: 'Data Vault splits a warehouse into hubs (business keys), links (relationships) and satellites (descriptive history), loaded insert-only. Build a small vault for Northbay customers and orders in live SQL, load a second day of changes, and turn it back into a star.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: What does a hub table hold?
    choices: ['Every descriptive attribute of a customer', 'One row per business key (such as a customer number), with a hash key, load date and record source', 'Sales amounts']
    ans: 1
    why: A hub is just the list of business keys the business uses to identify a thing. Descriptions go in satellites; relationships go in links.
  - q: A customer moves city. What happens in a Data Vault?
    choices: ['The hub row is updated', 'A new satellite row is inserted with the new city and a new load date; nothing is updated or deleted', 'The link is deleted']
    ans: 1
    why: Vaults are insert-only. The satellite gains a row whenever the descriptive values change, so the full history is kept automatically.
  - q: Why do analysts usually not report straight from the raw vault?
    choices: ['Vaults have no history', 'Answering a question needs many joins and "latest row" logic, so marts (often stars) are built on top', 'SQL cannot read vault tables']
    ans: 1
    why: The vault is built for loading and auditing, not for easy querying. Information marts on top give analysts a simple star.
sources:
  - 'Linstedt, D. and Olschimke, M. (2015), Building a Scalable Data Warehouse with Data Vault 2.0, Morgan Kaufmann'
  - 'Data Vault Alliance, Data Vault basics https://datavaultalliance.com/'
  - 'The Kimball Group, Dimensional Modeling Techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
---

**Module 6 · about 30 minutes · read first: 6.1.** You'll be able to name the three Data Vault table types, build a hub, a link and a satellite in SQL, load a day of changes insert-only, and rebuild a star dimension from the vault.

<div class="bigidea">A Data Vault splits the warehouse into hubs (business keys), links (relationships) and satellites (changing details), and only ever inserts.</div>

**In everyday terms:** a library. Hubs are the catalogue cards (one per book). Links are the loan slips tying a book to a member. Satellites are the notes about the book or member that you keep adding to.

## 1. Why this matters

Data Vault is common in banks, insurers, telecoms and large public bodies, where dozens of source systems change all the time and auditors want to see exactly what arrived, when and from where. If you join such a team you will query hubs, links and satellites from day one. Even if you never build one, knowing the pattern makes you better at loading history and at answering "where did this number come from?"

<div class="meaning">

<dl>
<dt>Hub</dt><dd>One row per business key (a customer number, a product code).</dd>
<dt>Link</dt><dd>One row per relationship between hubs (customer buys product).</dd>
<dt>Satellite</dt><dd>Descriptive columns for a hub or link, with a new row for every change.</dd>
<dt>Hash key / hash diff</dt><dd>A fixed-length fingerprint of the key / of the details, to spot changes quickly.</dd>
<dt>Load date, record source</dt><dd>When and from where each row arrived.</dd>
<dt>Insert-only</dt><dd>Rows are never updated or deleted.</dd>
<dt>Physical meaning</dt><dd>Every change adds one satellite row. History is complete and loads can run in parallel, at the price of more joins to read it.</dd>
</dl>

</div>

<div class="myth">

**"A vault is something users query directly."** A vault is a staging-style integration layer. Users read from information marts (often stars) built on top of it.

</div>

## 2. Three kinds of table

Data Vault was created by Dan Linstedt in the 1990s. Its current version, Data Vault 2.0, splits everything into three table types:

- A **hub** lists the **business keys** of one core thing: one row per customer number, product code or order number. It holds the key, a **hash key** made from it, the **load date** (when it first arrived) and the **record source** (which system sent it). Nothing else.
- A **link** records a relationship between hubs: "this order was placed by this customer". One row per distinct combination of hub keys, again with a load date and record source.
- A **satellite** holds the descriptive attributes of a hub (or a link), with history: email, city, loyalty tier. Each change adds a row with a new load date.

<!--fig:vault-tables-->

Every table is **insert-only**. Nothing is updated or deleted. A new source system adds new satellites without touching what is there, which is why vaults cope well with change.

## 3. Hash keys, and a stand-in for this course

Instead of numbering rows, Data Vault 2.0 computes each hub's key from the business key with a hash function, usually **MD5** or **SHA-1/SHA-256**, applied to the cleaned key (for example `MD5(UPPER(TRIM(customer_id)))`). The same business key always gives the same hash, in any system, so tables can be loaded in parallel without looking each other up.

SQLite, the database in your browser, has no MD5 function. So in this lesson we use a simple, deterministic stand-in: multiply the number by a large constant (2,654,435,761, a classic multiplicative hashing constant), keep the remainder after dividing by 2³², and write it as 8 hex digits. It has the property that matters here: same key in, same key out.

```sql
-- try
SELECT customer_id,
       printf('%08x', (customer_id * 2654435761) % 4294967296) AS customer_hk
FROM customers
WHERE customer_id IN (1, 2, 17, 601)
```

In a real warehouse you would write, for example, `CONVERT(CHAR(32), HASHBYTES('MD5', UPPER(TRIM(CAST(customer_id AS VARCHAR(20))))), 2)` in SQL Server, or `MD5(UPPER(TRIM(customer_id::text)))` in PostgreSQL, Snowflake or DuckDB.

## 4. Build the vault (load 1)

Run this once to create a hub for customers and orders, a link between them, and a satellite of customer details. Everything gets load date 2025-12-31 and record source `northbay_crm` or `northbay_pos`.

```sql
-- noviz
DROP TABLE IF EXISTS hub_customer;
DROP TABLE IF EXISTS hub_order;
DROP TABLE IF EXISTS link_order;
DROP TABLE IF EXISTS sat_customer;
CREATE TABLE hub_customer (customer_hk TEXT PRIMARY KEY, customer_bk INTEGER, load_date TEXT, record_source TEXT);
CREATE TABLE hub_order (order_hk TEXT PRIMARY KEY, order_bk INTEGER, load_date TEXT, record_source TEXT);
CREATE TABLE link_order (link_order_hk TEXT PRIMARY KEY, order_hk TEXT, customer_hk TEXT, load_date TEXT, record_source TEXT);
CREATE TABLE sat_customer (customer_hk TEXT, load_date TEXT, hash_diff TEXT,
  email TEXT, city TEXT, province TEXT, loyalty_tier TEXT, record_source TEXT,
  PRIMARY KEY (customer_hk, load_date));
-- the "ghost" customer for guest orders, like the -1 unknown member in a star
INSERT INTO hub_customer VALUES ('00000000', NULL, '1900-01-01', 'system');
INSERT INTO hub_customer
SELECT printf('%08x', (customer_id * 2654435761) % 4294967296), customer_id, '2025-12-31', 'northbay_crm'
FROM customers;
INSERT INTO hub_order
SELECT printf('%08x', (order_id * 2654435761) % 4294967296), order_id, '2025-12-31', 'northbay_pos'
FROM orders;
INSERT INTO link_order
SELECT printf('%08x', (order_id * 2654435761 + COALESCE(customer_id, 0) * 40503) % 4294967296),
       printf('%08x', (order_id * 2654435761) % 4294967296),
       COALESCE(printf('%08x', (customer_id * 2654435761) % 4294967296), '00000000'),
       '2025-12-31', 'northbay_pos'
FROM orders;
INSERT INTO sat_customer
SELECT printf('%08x', (customer_id * 2654435761) % 4294967296), '2025-12-31',
       lower(COALESCE(email, '')) || '|' || trim(city) || '|' || province || '|' || COALESCE(loyalty_tier, ''),
       lower(email), trim(city), province, loyalty_tier, 'northbay_crm'
FROM customers;
SELECT (SELECT COUNT(*) FROM hub_customer) AS hub_customer, (SELECT COUNT(*) FROM hub_order) AS hub_order,
       (SELECT COUNT(*) FROM link_order) AS link_order, (SELECT COUNT(*) FROM sat_customer) AS sat_customer
```

604 hub customers (603 real plus the ghost), 4,064 hub orders, 4,064 links and 603 satellite rows. The 482 guest orders link to the ghost key `00000000`, so no link points at nothing.

The **hash diff** column is a fingerprint of all the descriptive values in the row. To spot a change you compare one column instead of five. Here it is the values joined with `|`; real systems hash that string with MD5 too.

## 5. Load 2: changes arrive, nothing is updated

The next day the CRM sends its customer list again. Customer 2 moved up to Silver, customer 4 moved from Vancouver to Calgary, and a new customer 604 signed up. Make that delivery as a staging table:

```sql
-- noviz
DROP TABLE IF EXISTS stg_crm_customers;
CREATE TABLE stg_crm_customers AS
SELECT customer_id, email, trim(city) AS city, province, loyalty_tier FROM customers;
UPDATE stg_crm_customers SET loyalty_tier = 'Silver' WHERE customer_id = 2;
UPDATE stg_crm_customers SET city = 'Calgary', province = 'AB' WHERE customer_id = 4;
INSERT INTO stg_crm_customers VALUES (604, 'kai.osei604@example.com', 'Ottawa', 'ON', 'Bronze');
SELECT COUNT(*) AS rows_delivered FROM stg_crm_customers
```

Now the two standard vault loads. The hub gets only keys it has never seen. The satellite gets a row only where the hash diff differs from that customer's latest row:

```sql
-- noviz
INSERT INTO hub_customer
SELECT printf('%08x', (s.customer_id * 2654435761) % 4294967296), s.customer_id, '2026-01-01', 'northbay_crm'
FROM stg_crm_customers s
WHERE NOT EXISTS (SELECT 1 FROM hub_customer h WHERE h.customer_bk = s.customer_id);

INSERT INTO sat_customer
SELECT x.customer_hk, '2026-01-01', x.hash_diff, lower(x.email), x.city, x.province, x.loyalty_tier, 'northbay_crm'
FROM (SELECT printf('%08x', (customer_id * 2654435761) % 4294967296) AS customer_hk,
             lower(COALESCE(email, '')) || '|' || city || '|' || province || '|' || COALESCE(loyalty_tier, '') AS hash_diff,
             email, city, province, loyalty_tier
      FROM stg_crm_customers) x
WHERE x.hash_diff IS NOT (SELECT s.hash_diff FROM sat_customer s
                          WHERE s.customer_hk = x.customer_hk
                          ORDER BY s.load_date DESC LIMIT 1);
SELECT load_date, COUNT(*) AS sat_rows FROM sat_customer GROUP BY load_date
```

Load 2 inserted exactly 3 satellite rows (two changes and one new customer) out of 604 delivered. Run the load block again: it inserts nothing, because the hashes now match. That property, running twice gives the same result, is called **idempotence** ([Lesson 7.3](/learn/courses/data-modelling/audit-columns/)).

Customer 4's whole story is now in the satellite:

```sql
-- try
SELECT h.customer_bk, s.load_date, s.city, s.province, s.loyalty_tier, s.record_source
FROM hub_customer h
JOIN sat_customer s ON s.customer_hk = h.customer_hk
WHERE h.customer_bk IN (2, 4)
ORDER BY h.customer_bk, s.load_date
```

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a hash key is a **function** from business keys to fixed-length codes: h(k). Because it is a function, every loader computes the same code for the same key without asking a central counter. Ideally it is also **injective** (two different keys never give the same code), which is why real vaults use long hashes like MD5 (128 bits) or SHA-256.

**Equation:** with n keys and a b-bit hash, the chance of any collision is about n² ÷ 2^(b+1). For our 32-bit stand-in and 4,064 orders: 4,064² ÷ 2³³ ≈ 0.002. For MD5 and a billion keys: 10¹⁸ ÷ 2¹²⁹ ≈ 1.5 × 10⁻²¹. Tiny, but this is why the stand-in is for learning only.

**Analogy:** a satellite is a diary. You never rub out yesterday's entry; you write today's below it. The hub is the diary's cover with the owner's name.

**Try it:** a satellite has 603 rows and a load changes 2 customers and adds 1. How many rows after? (606.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>Hub_customer.</b> <table class="lk-tbl"><tr><th>hash</th><th>customer_id</th><th>load_date</th><th>source</th></tr><tr><td>a1f</td><td>C1</td><td>Jan 1</td><td>shop</td></tr></table> The key only, once.</div>
<div class="step"><b>Hub_product and link.</b> <table class="lk-tbl"><tr><th>link</th><th>cust</th><th>prod</th></tr><tr><td>x7</td><td>a1f</td><td>p9d</td></tr></table> The link records that C1 bought a product.</div>
<div class="step"><b>Satellite.</b> <table class="lk-tbl"><tr><th>hub</th><th>city</th><th>load_date</th></tr><tr><td>a1f</td><td>Toronto</td><td>Jan 1</td></tr></table></div>
<div class="step"><b>City changes.</b> No update. <table class="lk-tbl"><tr><th>hub</th><th>city</th><th>load_date</th></tr><tr><td>a1f</td><td>Toronto</td><td>Jan 1</td></tr><tr><td>a1f</td><td><mark>Ottawa</mark></td><td><mark>Mar 1</mark></td></tr></table> A new row is inserted.</div>
<div class="step"><b>Build the star.</b> A view takes the latest satellite row per hub and shows it as a dimension.</div>
</div>

<div class="problem" data-problem="dm-vault-rows"></div>

## 6. Worked example: from vault to star

Analysts want dim_customer, not three tables. An **information mart** (the vault world's name for a reporting layer, usually Kimball stars) is built from the vault with "latest satellite row per hub key":

```sql
-- try
WITH latest AS (
  SELECT customer_hk, city, province, loyalty_tier,
         ROW_NUMBER() OVER (PARTITION BY customer_hk ORDER BY load_date DESC) AS rn
  FROM sat_customer
)
SELECT h.customer_bk AS customer_id, l.city, l.province, l.loyalty_tier
FROM hub_customer h
JOIN latest l ON l.customer_hk = h.customer_hk AND l.rn = 1
WHERE h.customer_bk IN (2, 4, 604)
ORDER BY h.customer_bk
```

Three steps, with numbers:

1. sat_customer holds 606 rows for 604 customers: customers 2 and 4 have two rows each.
2. ROW_NUMBER numbers each customer's rows newest first; `rn = 1` keeps one row per customer, so 604 rows.
3. Joining the hub gives back the business key. Customer 4 now shows Calgary, AB; customer 2 shows Silver.

Keep `rn = 1` and you get an SCD1 dimension. Keep every row with its load date as valid_from, and the next row's load date as valid_to, and you get an SCD2 dimension for free ([Lesson 5.2](/learn/courses/data-modelling/scd2-by-hand/)).

## 7. When to use a vault

Good fit: many source systems, frequent source changes, strict audit ("show me what system X said on 3 March"), large teams loading in parallel. Poor fit: one or two sources and a small team, where a vault doubles the number of tables before anyone sees a dashboard. Data Vault and Kimball are not rivals: the vault is the integration layer, the stars on top are for people.

## 8. Practice

```sql
-- exercise: How many orders does each customer have in the vault? Use link_order and hub_customer, show customer_bk and the order count for the 5 customers with the most orders (ties broken by customer_bk). Leave out the ghost.
-- hint: JOIN link_order to hub_customer on customer_hk, filter customer_bk IS NOT NULL, GROUP BY customer_bk, ORDER BY COUNT(*) DESC, customer_bk, LIMIT 5.
SELECT h.customer_bk
FROM hub_customer h
LIMIT 5
-- answer:
SELECT h.customer_bk, COUNT(*) AS orders
FROM link_order l
JOIN hub_customer h ON h.customer_hk = l.customer_hk
WHERE h.customer_bk IS NOT NULL
GROUP BY h.customer_bk
ORDER BY orders DESC, h.customer_bk
LIMIT 5
```

```sql
-- exercise: List the customers (customer_bk) that have more than one satellite row, with how many rows each has.
-- hint: GROUP BY customer_hk in sat_customer, HAVING COUNT(*) > 1, and join the hub for the business key.
SELECT customer_hk, COUNT(*)
FROM sat_customer
GROUP BY customer_hk
-- answer:
SELECT h.customer_bk, COUNT(*) AS versions
FROM sat_customer s
JOIN hub_customer h ON h.customer_hk = s.customer_hk
GROUP BY h.customer_bk
HAVING COUNT(*) > 1
```

```sql
-- exercise: How many orders are linked to the ghost customer '00000000'? It should match the number of guest orders.
-- hint: COUNT(*) FROM link_order WHERE customer_hk = '00000000'.
SELECT COUNT(*) AS guest_links
FROM link_order
-- answer:
SELECT COUNT(*) AS guest_links
FROM link_order
WHERE customer_hk = '00000000'
```

<div class="keypoints">

- Hubs hold keys, links hold relationships, satellites hold details.
- Every load is insert-only, so history is never lost.
- Hash keys let tables load in parallel.
- Users query marts built on top, not the vault itself.

</div>

**New words:** *Data Vault*, *hub*, *link*, *satellite*, *business key*, *hash key*, *hash diff*, *load date*, *record source*, *ghost record*, *insert-only*, *information mart*.
