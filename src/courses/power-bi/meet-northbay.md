---
title: 'Meet Northbay Goods: the data for this course'
seoTitle: 'Practice dataset for Power BI: Northbay Goods retail data'
summary: A made-up Ontario retail chain with five stores, twelve products and two years of order lines. Download the five CSV files, see how the tables fit together, and learn what one row of each table means.
minutes: 12
updated: 2026-11-22
quiz:
  - q: What does one row of the Sales table mean?
    choices: ['One day of sales for one store', 'One order line: one product bought in one store on one day', 'One customer']
    ans: 1
    why: The grain of Sales is the order line. Knowing the grain tells you what COUNTROWS(Sales) counts and which questions the table can answer.
  - q: Why does Sales hold ProductKey instead of the product name and category?
    choices: ['To save typing', 'The details live once in the Product table and are looked up through the relationship', 'Power BI cannot store text']
    ans: 1
    why: Keys link the fact table to the dimension tables. The name and category are stored once in Product, which keeps the model small and consistent.
  - q: Why can't Targets be related directly to the daily Date table?
    choices: ['Targets has no numbers', 'Targets is monthly, so one target row matches many days', 'Targets is too big']
    ans: 1
    why: Targets has a different grain (month × store). Lesson 6.4 shows how to compare monthly targets with daily sales.
---

**Module 1 · about 12 minutes · read first: 1.1.** You'll be able to download the course data, describe each table's grain, and read the model diagram.

## 1. Why this matters

Learning on real-looking data beats learning on a list of fruit. Northbay Goods is a made-up chain, but it behaves like a real retailer: weekends are busier, snow shovels sell in winter, earbuds peak before the holidays, prices rose about 4 % in 2025 and a fifth store opened in March 2025. Those quirks are on purpose: each one turns into a lesson (a store that did not exist last year breaks naive growth measures, for example).

## 2. The model in one picture

<!--fig:model-map-->

## 3. The five tables

| Table | One row is… | Key columns |
|---|---|---|
| **Sales** (fact) | one order line: a product bought in a store on a day | Date, StoreKey, ProductKey, Quantity, UnitPrice, UnitCost, Amount |
| **Product** | one product | ProductKey, Product, Category |
| **Store** | one store | StoreKey, Store, City, Region, OpenDate |
| **Date** | one calendar day, 2024 to 2025 | Date, Year, Quarter, Month, YearMonth, Weekday |
| **Targets** | one store's sales target for one month | YearMonth, StoreKey, Target |

**Fact tables** record events and hold numbers you add up (Quantity, Amount). **Dimension tables** describe the who, what, where and when, and hold the words you filter and group by (Category, Region, Month). Module 3 goes deeper.

`Amount` is `Quantity × UnitPrice`, already worked out, as many till systems do. `UnitCost` lets you work out margin.

## 4. Get the files

<!--fig:northbay-data-->

You don't need the files for the practice editors in this course: they run on the same data inside your browser. You need them for the hands-on parts in Power BI Desktop, starting in Lesson 1.4.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** before any formula, know the **grain** of each table: what one row means. Most wrong numbers in BI come from adding up rows at the wrong grain (for example, adding a monthly target to every day).

**Rule:** a fact table's grain is the most detailed event it records. Every column in it must be true for exactly that event.

**Try it:** what is the grain of a table with columns StoreKey, Week, Staff Hours? (One store for one week.)
</details>

## 5. Worked example

*How many order lines did Queen Street have on its busiest day?* You'd filter Store to Queen Street, group Sales by Date, count rows per date and take the largest. In DAX that becomes `MAXX(VALUES('Date'[Date]), CALCULATE(COUNTROWS(Sales)))`, which you'll be able to read by the end of Module 5. For now, notice the plan: filter a dimension, count fact rows, group by another dimension.

## 6. Practice

1. Which table would you filter to see only the East region, and which table holds the numbers that change?
2. Store 5 (Forks Market) opened on 2025-03-01. What will its sales be for January 2024?
3. Is "Category" a fact or a dimension attribute?

<details>
<summary>Answers</summary>

1. Filter Store[Region]; the numbers are in Sales.
2. Nothing (blank): it had no order lines before it opened.
3. A dimension attribute: it describes a product and is used to group and filter.
</details>
