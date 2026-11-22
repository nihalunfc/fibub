---
title: Scheduled refresh and gateways
seoTitle: 'Power BI scheduled refresh, gateways and incremental refresh'
summary: Keep published reports up to date automatically. Set scheduled refresh, connect on-premises data through a gateway, use incremental refresh for big tables, and fix the usual refresh failures.
minutes: 14
updated: 2026-11-22
sources:
  - 'Microsoft Learn, Data refresh in Power BI: https://learn.microsoft.com/power-bi/connect-data/refresh-data'
quiz:
  - q: When do you need an on-premises data gateway?
    choices: ['Always', 'When the source is inside the company network (a local SQL Server, files on a shared drive), not in the cloud', 'Never']
    ans: 1
    why: The Service runs in Microsoft's cloud and can't reach a server or folder inside your network without a gateway installed there.
  - q: What does incremental refresh do?
    choices: ['Refreshes only new and recent data, keeping older partitions unchanged', 'Refreshes faster by skipping all data', 'Deletes old data']
    ans: 0
    why: Large fact tables are split by date; only recent periods are reloaded, which makes refresh much faster.
  - q: A refresh fails with "column 'Qty' not found". What happened?
    choices: ['The gateway is off', 'The source changed (column renamed), so a Power Query step can''t find it', 'The licence expired']
    ans: 1
    why: Source changes break steps that refer to columns by name. Fix the step (Lesson 2.5) and ask the source owner to warn you next time.
---

**Module 8 · about 14 minutes · read first: 8.3.** You'll be able to keep reports fresh and fix failed refreshes.

## 1. Why this matters

Stale data destroys trust faster than anything. A BI developer is responsible for refreshes running, and for noticing first when they don't.

## 2. Import, DirectQuery and refresh

- **Import** (the default): data is copied into the model; reports are fast; data is as fresh as the last refresh.
- **DirectQuery**: every visual queries the source live; always current, slower, with some DAX limits.
- **Direct Lake** (Microsoft Fabric): reads Delta tables in OneLake directly, close to import speed without copying.

For import, set **scheduled refresh** on the semantic model in the Service: Settings > Refresh, up to 8 times a day with Pro (48 on a Premium or Fabric capacity). Turn on failure emails.

## 3. Gateways

Cloud sources (Azure SQL, SharePoint Online, many SaaS apps) need only credentials. Sources inside the company network need an **on-premises data gateway**: a Windows service installed on an always-on machine inside the network, managed by IT. In the Service you map each data source in the model to a gateway connection.

## 4. Incremental refresh

For big fact tables, define parameters `RangeStart` and `RangeEnd` in Power Query, filter the date column with them, and set an incremental refresh policy (for example, store 5 years, refresh the last 10 days). The Service then reloads only recent partitions. It needs a date column and a source that can filter by date efficiently (query folding).

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a refresh replays your Power Query steps against the source as it is now. Anything that changed in the source (a renamed column, a new value type, a moved file, an expired password) can break a step, so build steps that are robust (Lesson 2.1) and monitor refresh history.

**Try it:** list three source changes that would break a refresh. (A renamed column, a file path change, credentials that expired.)
</details>

## 5. Worked example

*Monday 7 AM, the overview shows Friday's data.* Refresh history says "Data source error: the credentials are invalid". The service account's password was rotated over the weekend. Update the credentials in the gateway connection, refresh now, and send a note to the report's readers. Then ask IT to tell the BI team before rotations, and add the refresh time to the report ("Data as of 2025-12-08 06:00") so readers can see freshness.

## 6. Practice

1. Your source is an Excel file on someone's desktop. Why is that a problem for scheduled refresh, and what's better?
2. When would you choose DirectQuery over import?
3. Write a measure for "Data as of" using the latest date in Sales.

<details>
<summary>Answers</summary>

1. The file is only reachable when that computer is on and a gateway can see it. Put it in SharePoint or OneDrive for work, or load it into a database.
2. When data must be near real time or is too big to import, and the source is fast enough.
3. `Data As Of = "Data as of " & FORMAT(MAX(Sales[Date]), "yyyy-MM-dd")`.
</details>
