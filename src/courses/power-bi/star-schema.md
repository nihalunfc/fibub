---
title: 'Star schema: facts and dimensions'
seoTitle: 'Star schema in Power BI: fact and dimension tables'
summary: Why Power BI models are built as a star, with one fact table of events in the middle and dimension tables around it, and how to decide which columns go where.
minutes: 15
updated: 2026-11-22
quiz:
  - q: Which of these belongs in a fact table?
    choices: ['Store city', 'Quantity sold on an order line', 'Product category']
    ans: 1
    why: Facts are measurements of events, the numbers you add up. City and category describe things, so they belong in dimensions.
  - q: What is a surrogate key such as ProductKey for?
    choices: ['Decoration', 'A short, stable, unique number that links the fact table to the dimension', 'Sorting by price']
    ans: 1
    why: Keys are compact to store and never change even if the product is renamed, so relationships stay intact.
  - q: Why is one huge flat table a poor model in Power BI?
    choices: ['Power BI cannot load wide tables', 'Repeated text bloats it, and other fact tables cannot share its dimensions', 'Flat tables cannot be filtered']
    ans: 1
    why: The same words repeat on every row, and a second fact (like Targets) can't share filters with it. A star keeps each description once and lets every fact use it.
---

**Module 3 · about 15 minutes · read first: 1.2.** You'll be able to sort columns into facts and dimensions and explain why the star shape matters.

## 1. Why this matters

The model decides how easy every later step is. A good star makes DAX short and reports fast; a messy model makes even simple measures wrong. "What is a star schema?" is a standard BI interview question.

## 2. The idea in one picture

<!--fig:star-vs-flat-->

## 3. Facts and dimensions

**Fact tables** record events at a fixed grain: an order line, a stock count, a website visit, a monthly target. They are long (thousands to billions of rows) and thin: dates, keys and numbers.

**Dimension tables** describe the things in those events: product, store, customer, date. They are short and wide: one row per thing, with all its descriptive columns (name, category, region, opening date).

The fact table sits in the middle with a relationship to each dimension, which is why it looks like a star:

<!--fig:model-map-->

How to sort a column:

| Ask | If yes, it's… |
|---|---|
| Is it a number you'd add up or average? (Quantity, Amount, Cost) | a fact column |
| Is it a word or category you'd filter or group by? (Region, Category) | a dimension column |
| Does it describe a thing that appears in many events? (product details) | a dimension column, in that thing's table |
| Is it a key linking an event to a thing? (ProductKey in Sales) | a foreign key in the fact table |

## 4. Snowflakes and why to avoid them

A **snowflake** splits dimensions further: Product → Subcategory → Category tables. It saves a little space but adds relationships, slows filtering and confuses report users. In Power BI, **flatten** these back into one Product table with Power Query merges (Lesson 2.3). Keep the star.

<details class="maths" open>
<summary>Principle</summary>

**Principle (Kimball):** model around business processes. Each process (selling, planning, stocking) gets its own fact table at its own grain, and shared dimensions (Date, Store, Product) connect them, so you can compare sales with targets by store and month in one visual.

**Try it:** a new "Stock" table records units on hand per store per product per day. Which existing dimensions can it share? (Store, Product and Date.)
</details>

## 5. Worked example

*A colleague hands you one flat export with 22 columns: Date, Store Name, City, Region, Store Manager, Product, Category, Supplier, Quantity, Price, Cost, …* Split it: Date stays (to relate to the Date table); store columns go to a Store dimension with a StoreKey; product columns go to Product with a ProductKey; Sales keeps Date, StoreKey, ProductKey, Quantity, Price, Cost. In Power Query: reference the flat query three times, keep the relevant columns, remove duplicates in each dimension, add an index as the key, and merge the key back into the fact. The model gets smaller and every measure gets simpler.

## 6. Practice

1. Fact or dimension column: Unit cost, Store opening date, Return reason, Units returned?
2. Why is Date its own dimension instead of just a column in Sales?
3. You need sales and targets on the same chart by region. Which shared dimension makes that work?

<details>
<summary>Answers</summary>

1. Unit cost: fact. Store opening date: dimension (Store). Return reason: dimension (it describes the return). Units returned: fact.
2. So every fact table can be filtered by the same Year, Month and Quarter columns, and so time intelligence functions work (Lesson 3.3).
3. Store (Region lives in Store, and both Sales and Targets relate to it).
</details>
