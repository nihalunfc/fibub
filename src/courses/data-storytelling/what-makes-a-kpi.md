---
title: What makes a good KPI
seoTitle: 'What is a KPI? How to choose good key performance indicators'
summary: A KPI is a number tied to a goal that someone can act on. How to choose KPIs that matter, define them so nobody argues, and avoid vanity metrics and too many KPIs.
minutes: 12
updated: 2026-11-22
quiz:
  - q: What turns a metric into a KPI?
    choices: ['Putting it on a dashboard', 'Linking it to a goal, with a target and an owner who can act on it', 'Making it big']
    ans: 1
    why: A KPI measures progress towards something that matters, and someone is responsible for moving it.
  - q: Which is a vanity metric for a shop?
    choices: ['Margin %', 'Website page views, with no link to sales', 'Sales vs target']
    ans: 1
    why: It can grow while the business doesn't. It feels good but drives no decision.
  - q: Why write down a KPI definition (formula, filters, timing)?
    choices: ['For the auditors only', 'So everyone calculates it the same way and meetings discuss the business, not whose number is right', 'It is not needed']
    ans: 1
    why: '"Sales" can mean gross or net, by order date or ship date. Define it once.'
---

**Module 4 · about 12 minutes · read first: 1.2.** You'll be able to choose KPIs for a business, define them precisely and spot vanity metrics.

## 1. Why this matters

Dashboards often show 20 numbers and nobody knows which matter. A good set of 3 to 6 KPIs tells a team, every morning, whether they're on track. In BI interviews you'll often be asked "which KPIs would you put on this dashboard, and why?"; the answer shows whether you understand the business.

## 2. The idea in one picture

A KPI card for Northbay: the number, what it's compared to, and its trend. Try changing what it's compared with:

<!--fig:kpi-builder-->

## 3. What makes a good KPI

A useful test is whether it is:

1. **Tied to a goal.** "Grow profitably" → Sales vs target, Margin %.
2. **Actionable.** Someone can change it by doing something. Store managers can affect sales; they can't affect the exchange rate.
3. **Owned.** A named person or team answers for it.
4. **Compared.** It has a target, last year or a benchmark (Lesson 4.2).
5. **Clearly defined.** Formula, filters, time, source, written down.
6. **Few.** 3 to 6 on a main page. More KPIs means less focus.

**Leading vs lagging:** sales are a *lagging* indicator (they tell you what happened). Footfall, conversion rate or stock availability are *leading* (they warn you before sales move). A good set has both.

**Vanity metrics** grow without the business improving: page views, app downloads, "total customers ever". They feel good and drive no decision.

<details class="maths" open><summary>Principle</summary>

**Principle:** Goodhart's law: "when a measure becomes a target, it ceases to be a good measure." If stores are judged only on sales, they may discount heavily and destroy margin. Pair KPIs that balance each other: Sales with Margin %, speed with quality.

**Analogy:** a car dashboard. A few gauges (speed, fuel, warning lights) you can act on while driving. Not the tyre pressure history of the last five years.
</details>

## 4. Worked example

*Northbay's regional manager wants a weekly dashboard.* Candidate KPIs:

| KPI | Definition | Why it's there |
|---|---|---|
| Sales vs target | SUM(Sales[Amount]) ÷ target for the same stores and period − 1 | The main goal |
| Like-for-like growth | Sales of stores open in both years vs last year | Fair growth, not inflated by new stores |
| Margin % | (Sales − cost) ÷ Sales | Balances sales: growth must be profitable |
| Average sale | Sales ÷ number of sales lines | Explains whether growth comes from more or bigger sales |

Rejected: "Number of products in the catalogue" (no decision), "Total sales since opening" (only goes up).

## 5. Practice

1. Is "number of transactions" a KPI or a supporting metric for Northbay? Why?
2. Give a KPI that balances "Sales vs target".
3. Write a definition for "Monthly sales" that would end arguments.

<details><summary>Answers</summary>

1. Usually a supporting metric: it helps explain sales (more customers vs bigger baskets) but on its own isn't the goal.
2. Margin %, so stores don't hit sales targets by discounting.
3. For example: "Sum of Sales[Amount] (after discounts, before tax) for lines with an order date in the calendar month, all open stores, refunds excluded. Source: Northbay sales system, refreshed daily."
</details>

Next, Lesson 4.2: what to compare a KPI with.
