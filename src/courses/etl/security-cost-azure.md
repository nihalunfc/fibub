---
title: Security, cost and operations in Azure
summary: 'Run pipelines with managed identities and Key Vault instead of stored secrets, lock rows down per client, practise a restore, and keep a serverless database from billing all day.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A Dagster VM in Azure needs to write to Azure SQL. What is the most secure setup?
    choices: ['The VM''s managed identity mapped to a database user with only the rights it needs', 'The SQL admin login in docker-compose.yml', 'Allow all Azure services in the firewall and skip sign-in']
    ans: 0
    why: No secret exists to leak, and the identity can do only its job.
  - q: Power BI refreshes every 15 minutes against a serverless Azure SQL database with auto-pause. What happens to the cost?
    choices: ['It drops to zero', 'The database rarely pauses, so you pay for compute most of the day', 'The refreshes fail']
    ans: 1
    why: Auto-pause saves money only if the database stays idle for longer than the pause delay.
  - q: Where should card numbers be stored in your BI warehouse?
    choices: ['In a masked column', 'Nowhere: keep payment data in payment systems and load only tokens or totals', 'Encrypted in the mart schema']
    ans: 1
    why: Storing card numbers brings the warehouse into PCI DSS scope. Analytics never needs them.
sources:
  - 'Microsoft Learn: What are managed identities for Azure resources? https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview'
  - 'Microsoft Learn: Row-level security https://learn.microsoft.com/en-us/sql/relational-databases/security/row-level-security'
  - 'Microsoft Learn: Serverless compute tier for Azure SQL Database https://learn.microsoft.com/en-us/azure/azure-sql/database/serverless-tier-overview'
  - 'Microsoft Learn: Restore a database from a backup (point-in-time restore) https://learn.microsoft.com/en-us/azure/azure-sql/database/recovery-using-backups'
---

**Module 4 · about 40 minutes · read first: [4.2](/learn/courses/etl/azure-sql-hands-on/), [4.5](/learn/courses/etl/tsql-for-warehouses/).** You'll be able to run a pipeline with no stored passwords, keep the secrets that must exist in Key Vault, give each role only what it needs, filter rows per client inside the database, practise a restore, and estimate and cap what a serverless database costs.

<div class="bigidea">Treat company data like a hotel treats guests' rooms: every person and program gets a key card that opens only their doors, the master keys sit in a safe, there is a spare plan if a room floods, and the lights switch off when nobody is in.</div>

## 1. Why this matters

Data people are trusted with customer, revenue and payroll data. A pipeline that shows you handle **identity, secrets, access and cost** the way a security or finance team expects answers their questions before they ask. In regulated businesses (hotel payments, retail loyalty programmes) it decides whether your work goes live at all.

## 2. Identity and secrets

- **Managed identity.** An Azure resource (a VM, a Container App, a Function, Data Factory) gets its own Microsoft Entra identity. Make that identity a database user (`create user [vm-p2d-dagster] from external provider`) and grant it rights. The code uses `DefaultAzureCredential` from [Lesson 4.2](/learn/courses/etl/azure-sql-hands-on/). No password exists.
- **Key Vault.** For secrets that must exist (a vendor's SFTP key, an ad platform's API token), store them in Azure Key Vault. Give the pipeline's managed identity the *Key Vault Secrets User* role. Rotating a secret then happens in one place.

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

kv = SecretClient("https://kv-p2d.vault.azure.net", DefaultAzureCredential())
ads_token = kv.get_secret("ads-api-token").value        # never print or log it
```

## 3. Access inside the database

- **Roles per purpose:** `loader` (writes raw, stg, ops), `transformer` (dbt: writes mart), `report_reader` (reads mart), `analyst` (reads stg and mart).
- **Row-level security (RLS):** a filter function decides which rows each user sees, so a client manager sees only their own client's campaigns, enforced by the database itself. Power BI has its own RLS too ([Lesson 6.4](/learn/courses/etl/refresh-security-delivery/)); for DirectQuery and shared databases, database RLS is the stronger guarantee.
- **Dynamic data masking** shows `aXXX@XXXX.com` instead of an email to users without the right permission.
- **Auditing** to a storage account or Log Analytics: who queried what, and when.

```sql
create function ops.fn_client_filter(@client varchar(50))
returns table with schemabinding as
return select 1 as ok
       where @client = cast(session_context(N'client') as varchar(50)) or is_member('db_owner') = 1;

create security policy ops.client_policy
  add filter predicate ops.fn_client_filter(client) on mart.fct_ads_daily
  with (state = on);

-- the app sets the client for this session, then queries normally
exec sp_set_session_context @key = N'client', @value = 'Client A', @read_only = 1;
select sum(spend) from mart.fct_ads_daily;      -- only Client A's rows
```

## 4. Backups and restore

Azure SQL Database takes automatic backups and supports **point-in-time restore** (PITR) within a retention window (7 days by default, configurable), plus optional long-term retention. A restore creates a **new database** beside the old one; you then copy back what you need or swap. Practise it once, before you need it: delete a table, restore to ten minutes before, compare. A backup you have never restored is a hope, not a plan.

## 5. Cost: when serverless bills you

**Serverless** compute bills for vCore time while the database is active, then pauses after an **auto-pause delay** of idle time (you choose the delay, within limits Microsoft sets). While paused you pay only for storage. **Provisioned** compute bills every hour of the month. Serverless costs more per vCore-hour, so it wins only when the database is idle much of the time.

Like a taxi meter that keeps running for a while after you get out. One long ride a day is cheap. Many short rides spread across the day keep it running all day.

<div class="steps" data-fig="security-cost-azure-serverless">
<div class="step"><b>A quiet day.</b> The pipeline loads for one hour, 05:00 to 06:00. Nothing else touches the database.</div>
<div class="step"><b>The pause delay.</b> With a 1-hour auto-pause delay, the database stays awake until 07:00, then pauses. Billed: about 2 hours.</div>
<div class="step"><b>Refreshes everywhere.</b> Power BI is set to refresh every 30 minutes from 07:00 to 19:00. Each refresh wakes it before it can pause, so it is awake from 05:00 to about 20:00: about 15 billed hours.</div>
<div class="step"><b>Line them up.</b> Two refreshes: one right after the load, one at noon. The first overlaps the load's delay; the noon one costs its own delay. Billed: under 4 hours, with the data no less fresh, because the data only changes once a day.</div>
</div>

<div class="problem" data-problem="security-cost-azure-serverless"></div>

Practical cost controls: a **budget with alerts** on the resource group; the shortest auto-pause delay that suits your refreshes; refreshes timed to the loads; no geo-replication you do not need; a monthly look at storage growth; and the free offer for a portfolio project. Prices change, so take the per-vCore-hour price from the Azure pricing page when you do the sums.

<div class="meaning">

<dl>
<dt>Managed identity</dt><dd>An Azure-issued identity for a VM or service, so code there can sign in with no stored password.</dd>
<dt>Key Vault</dt><dd>The safe for the secrets that must exist, read at run time by identities allowed to.</dd>
<dt>Row-level security</dt><dd>A database rule that filters rows per user, so each person sees only their slice whatever tool they use.</dd>
<dt>Auto-pause delay</dt><dd>How long a serverless database stays awake, and billed, after the last activity before it sleeps.</dd>
<dt>Physical meaning</dt><dd>An agency's database cost jumps from a few dollars to a few hundred one month. The bill shows the database never paused: someone set a dashboard to refresh every 15 minutes, all night. Moving the refresh to just after the morning load brings the bill back, with no loss of freshness.</dd>
</dl>

</div>

<div class="myth">

**"Serverless means you only pay when queries run."** You pay while the database is awake, which includes the auto-pause delay after each burst of activity. Frequent small refreshes keep it awake all day, and then serverless can cost more than provisioned.

</div>

Write a one-page **runbook** per environment: which identities exist and what they can do, where secrets live, how to restore, how to rotate a vendor key, budget and alert thresholds, and who owns it. It is dull, and it is exactly what a manager in a regulated business wants to see. In the README's data-handling section, mention the privacy law that applies where you work (for example PIPEDA in Canada) and PCI DSS for card data: never store card numbers in an analytics warehouse; load tokens or totals instead.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** serverless bills compute only while awake; provisioned bills every hour. The break-even depends on how much of the month the database is awake.

**Equation:** with price per vCore-hour `$p$`, vCores `$v$`, and about 730 hours in a month:

```math
C_{\text{serverless}} \approx p_s \cdot \bar v \cdot h_{\text{awake}}, \qquad C_{\text{provisioned}} \approx p_p \cdot v \cdot 730
```

Serverless wins when `$h_{\text{awake}} / 730 < (p_p v) / (p_s \bar v)$`. Each activity window adds its own length **plus** the auto-pause delay to `$h_{\text{awake}}$`, unless windows overlap.

**Analogy:** a taxi against leasing a car. A taxi is cheap for one trip a day and expensive if you keep it waiting outside all day.

**Where it breaks:** frequent refreshes merge into one long awake period. Line them up with the loads.

**Try it:** a 1-hour load and 4 refreshes of 10 minutes, spread hours apart, with a 1-hour delay. Awake hours a day? (Load 1 + 1 = 2 h; each refresh 1/6 + 1 ≈ 1.17 h, × 4 ≈ 4.67 h; total ≈ 6.67 h a day, about 200 h in a 30-day month.)
</details>

## 6. Try it

1. Create a Key Vault, store the fake ads API token, and read it from Python with `DefaultAzureCredential` (signed in with `az login`).
2. Create the roles `loader`, `transformer`, `report_reader` and `analyst`. For each, test that a forbidden action fails (on the local container, use contained SQL users).
3. Add RLS on `mart.fct_ads_daily` by client using `sp_set_session_context`. Test as two different client managers.
4. Restore drill: in Azure, delete a table and do a point-in-time restore; on the local container, `BACKUP DATABASE` then `RESTORE` to a new name.
5. Write `docs/runbook.md` and `docs/cost.md` (your estimate, the refresh schedule you chose, and a screenshot of the budget alert).

**What to check:** the two client managers see different totals from the same query; the restored copy has the deleted table; your cost note shows awake hours per day and how you reduced them. Commit as `docs+feat(security): managed identity, Key Vault, roles, RLS, restore drill, cost note`.

<div class="keypoints">

- Managed identities remove passwords; Key Vault holds the secrets that must exist, read at run time.
- Give each role only what it needs, and enforce per-client rows with database row-level security.
- Automatic backups allow point-in-time restore to a new database; practise the restore before you need it.
- Serverless bills while awake, including the auto-pause delay after every burst; align refreshes with loads.
- Never store card numbers in an analytics warehouse; load tokens or totals.

</div>
