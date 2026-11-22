---
title: 'Capstone: the Northbay sales dashboard brief'
seoTitle: 'Power BI portfolio project: retail sales dashboard brief'
summary: A realistic brief from Northbay's head of retail. Turn it into a list of questions, measures and pages before you open Power BI, the way a BI developer scopes real work.
minutes: 15
updated: 2026-11-22
quiz:
  - q: What should you write first when you get a dashboard brief?
    choices: ['DAX', 'The questions the dashboard must answer, and who asks them', 'The colour theme']
    ans: 1
    why: Questions decide measures and pages. Building visuals before agreeing on questions is the most common cause of rework.
  - q: Which measure answers "are we ahead of last year so far?"
    choices: ['Total Sales', 'Pace % (YTD vs YTD last year)', 'Order Lines']
    ans: 1
    why: Pace compares the year to date with the same period last year (Lesson 6.4).
  - q: Why agree definitions (for example "sales excludes tax") at the start?
    choices: ['To fill the document', 'So the dashboard''s numbers match finance and nobody argues about them later', 'Power BI needs it']
    ans: 1
    why: Most dashboard disputes are about definitions, not code. Writing them down first prevents it.
---

**Module 9 · about 15 minutes · read first: Modules 1 to 6.** You'll turn a business brief into a build plan.

## 1. Why this matters

Interviewers ask "walk me through a dashboard you built". The best answers start with the business question, not the tool. This capstone gives you a project to talk about, with the same steps real BI work follows.

## 2. The brief

> **From:** Head of Retail, Northbay Goods
> **To:** BI team
>
> Store managers keep asking how they're doing and we answer with spreadsheets. I want one report they open every Monday. They need to see this year against last year and against target, which categories are driving it, and which products are selling or sitting. Regional managers want the same for their region; I want the whole chain. It should work on a phone. Can we have something by the end of the month?

## 3. Turn it into questions

| Who | Question | Measure(s) | Visual |
|---|---|---|---|
| Store manager | How am I doing this year? | Sales YTD, Pace %, Target YTD, vs Target % | Cards |
| Store manager | Is the trend up or down? | Total Sales, Sales LY, 3M Avg | Line chart by month |
| Store manager | Which categories drive the change? | Sales, Growth % by category | Sorted bar, or waterfall |
| Store manager | What is selling or sitting? | Units, Sales, Margin %, Product Rank, Sales 28d | Matrix by product |
| Regional manager | How do my stores compare? | Same measures by store, Share of Region | Bar chart, matrix |
| Head of retail | Where are we behind? | vs Target % by store, sorted | Bar with target line |

## 4. Definitions to agree

- **Sales:** `Sales[Amount]` (quantity × price charged), before tax, after discounts.
- **Last year:** same calendar dates one year earlier.
- **Like-for-like:** only stores open for both full periods (Forks Market is excluded until March 2026).
- **Target:** from the planning team's monthly targets table, by store.
- **Week starts:** Monday.

## 5. Plan the build

1. Model: Northbay star schema with Date marked, Targets related to Store (done in Module 3).
2. Measures in a `_Measures` table, in display folders: Base, Time, Target, Rank.
3. Pages: Overview (chain), Region, Store detail (drill through), Product (tooltip page for trends).
4. Security: roles for store and regional managers (Lesson 8.2).
5. Mobile layout for the Overview and Store pages.

Check your core measures now; you'll use them in the build:

<!--fig:dax-pad cap-cards-->

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a dashboard is a set of answers to agreed questions for named people. Every visual should map to a row in the questions table; anything that doesn't is decoration.

**Try it:** add one question of your own to the table, with its measure and visual.
</details>

## 6. Practice

1. Which question in the table needs RLS to answer correctly for each person?
2. Write the definition you'd agree for "units sold".
3. What would you ask the head of retail before starting? Write three questions.

<details>
<summary>Answers</summary>

1. All of them: each manager must see only their store or region, so the same measures need RLS.
2. Example: sum of Sales[Quantity] on order lines, excluding returns, by sale date.
3. Examples: Who exactly will use it and on what device? Should returns be subtracted? What decision should a manager make after looking at it?
</details>
