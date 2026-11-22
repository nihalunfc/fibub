---
title: Power BI and DAX interview questions
seoTitle: 'Power BI and DAX interview questions with answers'
summary: 30 questions that come up in junior BI and Power BI developer interviews, with short model answers, the lesson that explains each, and how they map to the PL-300 exam.
minutes: 25
updated: 2026-11-22
sources:
  - 'Microsoft Learn, Exam PL-300 study guide (skills measured), checked 2026-11-22: https://learn.microsoft.com/credentials/certifications/resources/study-guides/pl-300'
  - 'Microsoft Learn, Understand star schema and the importance for Power BI: https://learn.microsoft.com/power-bi/guidance/star-schema'
quiz:
  - q: An interviewer asks the difference between a measure and a calculated column. What is the key point?
    choices: ['Measures are faster to type', 'A calculated column is worked out once per row at refresh and stored; a measure is worked out at query time in the current filter context', 'There is no difference']
    ans: 1
    why: Stored per row versus calculated per cell of the visual. That decides memory use and whether slicers change the result.
  - q: What does CALCULATE do, in one sentence?
    choices: ['It adds numbers up', 'It evaluates an expression in a filter context it changes first, and turns any row context into filter context', 'It creates a new table']
    ans: 1
    why: Changing the filter context (and context transition) is the whole job of CALCULATE.
  - q: How should you answer a question you don't know?
    choices: ['Make something up confidently', 'Say what you do know, how you would find out, and where you would test it', 'Change the subject']
    ans: 1
    why: Interviewers want to see how you think. A clear plan to find the answer is a good answer.
---

**Module 9 · about 25 minutes · read first: the whole course, or the lessons each answer links.** You'll be ready for the Power BI and DAX questions in a junior BI or data analyst interview, and know which lesson to revise for each.

## 1. Why this matters

Most Power BI interviews follow the same pattern: a few questions on the model, a few on DAX (always CALCULATE and filter context), one on time intelligence, one on performance or security, and a "tell me about a dashboard you built". If you can answer the 30 below in your own words, and show the capstone, you are well prepared.

Read each question, say your answer out loud, then open the model answer. Don't memorise the wording: interviewers notice. Understand the idea and use your Northbay examples.

<details class="maths" open><summary>Principle: the answer shape that works</summary>

1. **Define it** in one sentence.
2. **Give an example** from a real model (Northbay works: "Total Sales by Store, with a Region slicer").
3. **Say a trap or a trade-off** ("it can double count if...", "it is slower because..."). This is what separates a strong answer from a memorised one.

Keep each answer under a minute. If they want more, they will ask.
</details>

## 2. Power Query and data preparation

**1. What is Power Query, and when would you clean data there rather than in DAX?**
<details><summary>Model answer</summary>
Power Query is the step-by-step data preparation tool (the M language behind it). Clean, reshape and combine data there, before it is loaded: removing rows, fixing types, splitting columns, unpivoting, merging. DAX is for calculations on the loaded model. Rule of thumb: as far upstream as possible, so every report gets clean data and the model stays small. <a href="/learn/courses/power-bi/power-query-basics/">Lesson 2.1</a>
</details>

**2. What is the difference between Merge and Append?**
<details><summary>Model answer</summary>
Append stacks tables with the same columns on top of each other (January sales + February sales). Merge joins tables side by side on a matching key, like a SQL join (order lines + product details). <a href="/learn/courses/power-bi/merge-append/">Lesson 2.3</a>
</details>

**3. Which join kinds does Merge offer, and which is the default?**
<details><summary>Model answer</summary>
Left outer (default), right outer, full outer, inner, left anti and right anti. Left outer keeps every row of the first table. Inner silently drops rows with no match, so check row counts. Anti joins are handy data quality checks (sales for products missing from the product list). <a href="/learn/courses/power-bi/merge-append/">Lesson 2.3</a>
</details>

**4. What is query folding and why does it matter?**
<details><summary>Model answer</summary>
Folding is Power Query turning your steps into one query the source (such as SQL Server) runs itself. It matters for speed: filtering 10 million rows in the database is far faster than downloading them first. Some steps (such as adding an index or certain custom columns) break folding, so put foldable steps first. Right-click a step and look for View Native Query. <a href="/learn/courses/power-bi/m-language/">Lesson 2.5</a>
</details>

**5. When would you unpivot?**
<details><summary>Model answer</summary>
When values are spread across columns, such as one column per month. Unpivot turns them into two columns (Month, Value), so you can filter, relate to the date table and use one measure instead of twelve. <a href="/learn/courses/power-bi/unpivot-group/">Lesson 2.4</a>
</details>

## 3. Data modelling

**6. What is a star schema, and why is it recommended?**
<details><summary>Model answer</summary>
A fact table of events (sales lines) in the middle, with dimension tables (Date, Product, Store) around it, joined one-to-many. It is recommended because filters flow cleanly from dimensions to facts, DAX stays simple, the VertiPaq engine compresses it well, and each attribute lives in one place. <a href="/learn/courses/power-bi/star-schema/">Lesson 3.1</a>
</details>

**7. What do cardinality and cross-filter direction mean on a relationship?**
<details><summary>Model answer</summary>
Cardinality is how rows match: one-to-many is the normal dimension to fact link. Cross-filter direction is which way filters travel: single (dimension filters fact) is the default and safest. Both directions can be needed for some many-to-many cases but can create ambiguity and slow things down, so use it sparingly, or turn it on in one measure with CROSSFILTER. <a href="/learn/courses/power-bi/relationships/">Lesson 3.2</a>
</details>

**8. What is the difference between an active and an inactive relationship?**
<details><summary>Model answer</summary>
Only one relationship between two tables can be active (solid line); it is used automatically. Others are inactive (dashed), such as Ship Date alongside Order Date. Use one in a measure with CALCULATE([Total Sales], USERELATIONSHIP(Sales[ShipDate], 'Date'[Date])). <a href="/learn/courses/power-bi/relationships/">Lesson 3.2</a>
</details>

**9. Why do you need a date table, and what makes it valid?**
<details><summary>Model answer</summary>
Time intelligence functions need one row per day with no gaps, covering whole years, with a Date column of date type. Mark it as a date table. It also gives you Year, Month, Quarter and so on to slice by, consistently across every fact table. Auto date/time creates hidden tables per date column, which bloats the model; turn it off. <a href="/learn/courses/power-bi/date-table/">Lesson 3.3</a>
</details>

**10. Calculated column or measure?**
<details><summary>Model answer</summary>
A calculated column is computed once per row at refresh and stored, so it costs memory but can be used on rows, in slicers and in relationships (for example a price band). A measure is computed at query time for each cell of a visual, in the current filter context, and stores nothing (for example Total Sales, Margin %). Default to measures for anything you add up or divide. <a href="/learn/courses/power-bi/calculated-columns/">Lesson 3.4</a>
</details>

**11. What problems does a flat, one-big-table model cause?**
<details><summary>Model answer</summary>
Repeated text (bigger file), attributes that can disagree between rows, awkward handling of facts at a different grain (monthly targets beside daily sales), and harder DAX. Splitting into a star fixes all four. <a href="/learn/courses/power-bi/modelling-mistakes/">Lesson 3.5</a>
</details>

## 4. DAX fundamentals

**12. What is the difference between SUM and SUMX?**
<details><summary>Model answer</summary>
SUM adds one column. SUMX is an iterator: it walks a table row by row, evaluates an expression on each row (row context), then adds the results. Use SUMX when the value has to be calculated per row first, such as Quantity × UnitPrice. <a href="/learn/courses/power-bi/iterators/">Lesson 4.3</a>
</details>

**13. Why use DIVIDE instead of the / operator?**
<details><summary>Model answer</summary>
DIVIDE returns blank (or a value you choose) when the denominator is zero or blank, instead of an error or infinity. Visuals stay clean. <a href="/learn/courses/power-bi/divide-and-ratios/">Lesson 4.2</a>
</details>

**14. What is the difference between RELATED and RELATEDTABLE?**
<details><summary>Model answer</summary>
RELATED fetches one value from the "one" side for the current row on the "many" side (a sales line's product category). RELATEDTABLE goes the other way and returns the matching rows from the many side (all sales lines for this product), usually wrapped in COUNTROWS or SUMX. <a href="/learn/courses/power-bi/related-lookups/">Lesson 4.4</a>
</details>

**15. Why use variables?**
<details><summary>Model answer</summary>
VAR names a step, so the formula is easier to read, the step is calculated once instead of several times (faster), and you can debug by returning a variable. A variable is evaluated where it is defined, so its value does not change inside a later CALCULATE. <a href="/learn/courses/power-bi/variables-if-switch/">Lesson 4.5</a>
</details>

## 5. Filter context and CALCULATE

**16. Explain row context and filter context.**
<details><summary>Model answer</summary>
Filter context is the set of filters on a cell: from rows and columns of the visual, slicers, filters panes and CALCULATE. It decides which rows a measure sees. Row context is "the current row" while a calculated column or an iterator such as SUMX runs. Row context does not filter anything by itself. <a href="/learn/courses/power-bi/filter-context/">Lesson 5.1</a>
</details>

**17. What does CALCULATE do?**
<details><summary>Model answer</summary>
It evaluates an expression after changing the filter context: each filter argument replaces any existing filter on the same column (unless wrapped in KEEPFILTERS), other filters stay. It also performs context transition. Example: CALCULATE([Total Sales], Product[Category] = "Home") shows Home sales on every row, even on the Electronics row. <a href="/learn/courses/power-bi/calculate/">Lesson 5.2</a>
</details>

**18. How do you calculate percent of total?**
<details><summary>Model answer</summary>
DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Store))). ALL removes the Store filter for the denominator, so every row is divided by the chain total. Use ALLSELECTED instead if the total should respect the slicers. <a href="/learn/courses/power-bi/all-and-percent-of-total/">Lesson 5.3</a>
</details>

**19. What is the difference between ALL, ALLEXCEPT and ALLSELECTED?**
<details><summary>Model answer</summary>
ALL removes filters from a table or columns. ALLEXCEPT removes all filters from a table except the columns you list. ALLSELECTED removes the filters coming from the visual's own rows and columns but keeps outside filters such as slicers, so "percent of what I've selected". <a href="/learn/courses/power-bi/all-and-percent-of-total/">Lesson 5.3</a>
</details>

**20. When must you use FILTER inside CALCULATE?**
<details><summary>Model answer</summary>
When the condition is not a simple column = value test: it compares a measure, or uses columns from more than one table, or needs row by row logic, such as FILTER(Sales, Sales[Quantity] * Sales[UnitPrice] > 100). Filter a column, not a whole big table, where you can, because FILTER over a fact table is slow. <a href="/learn/courses/power-bi/filter-function/">Lesson 5.4</a>
</details>

**21. What is context transition?**
<details><summary>Model answer</summary>
When CALCULATE runs inside a row context (in an iterator or calculated column), it turns the current row into a filter context. Every measure reference has an invisible CALCULATE, so referring to [Total Sales] inside SUMX(Store, ...) gives each store's own sales. Over a fact table without a unique key it can also give surprising results and is slow. <a href="/learn/courses/power-bi/context-transition/">Lesson 5.5</a>
</details>

Try the classic demonstration: the same SUM with and without CALCULATE inside an iterator. Press Run, then "Show me what happened".

<!--fig:dax-pad ct-demo-->

**22. How would you rank products by sales?**
<details><summary>Model answer</summary>
RANKX(ALL(Product[Product]), [Total Sales]). ALL makes it compare against every product, not just the one on the current row (which would always rank 1). For a top 3, use TOPN or a visual-level Top N filter. <a href="/learn/courses/power-bi/ranking-topn/">Lesson 5.6</a>
</details>

## 6. Time intelligence

**23. How do you calculate year to date and last year?**
<details><summary>Model answer</summary>
YTD: TOTALYTD([Total Sales], 'Date'[Date]) or CALCULATE([Total Sales], DATESYTD('Date'[Date])). Last year: CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date])). Both need a marked, complete date table. Growth % is DIVIDE([Total Sales] - [Sales LY], [Sales LY]). <a href="/learn/courses/power-bi/ytd-mtd/">Lesson 6.1</a>, <a href="/learn/courses/power-bi/last-year-growth/">Lesson 6.2</a>
</details>

**24. How do you make a rolling 3-month average?**
<details><summary>Model answer</summary>
CALCULATE([Total Sales], DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -3, MONTH)) divided by 3 (or by the number of months that actually have data). <a href="/learn/courses/power-bi/rolling-windows/">Lesson 6.3</a>
</details>

**25. Targets are by month and store, sales are by day. How do you compare them?**
<details><summary>Model answer</summary>
Keep the targets as their own fact table at month grain, related to Store, and either relate them to a month column or move the date filter across in the measure with TREATAS(VALUES('Date'[YearMonth]), Targets[YearMonth]). Then show both at month level or above, never by day. <a href="/learn/courses/power-bi/pace-and-targets/">Lesson 6.4</a>
</details>

## 7. Reports, performance, security and the service

**26. How do you choose a visual?**
<details><summary>Model answer</summary>
From the question: compare categories with a bar chart, a trend over time with a line, one number against a target with a card or KPI, parts of a whole (few parts) with a stacked bar. Avoid pie charts with many slices and 3D. Every page should answer one question for one audience. <a href="/learn/courses/power-bi/choosing-visuals/">Lesson 7.1</a>
</details>

**27. A report is slow. What do you do?**
<details><summary>Model answer</summary>
Measure first with Performance Analyzer to find which visual and whether the time is DAX or rendering. Then: fewer visuals per page, remove unused columns and high-cardinality text, use a star schema, replace FILTER over the whole fact table with column filters, use variables, avoid iterating over the fact table when a SUM will do, and check that Power Query steps fold. <a href="/learn/courses/power-bi/performance/">Lesson 8.1</a>
</details>

**28. What is row-level security and how do you set it up?**
<details><summary>Model answer</summary>
RLS limits which rows a user sees. In Desktop, Manage roles: add a role with a DAX filter on a dimension, such as Store[Region] = "West". Test with View as. In the service, assign people or groups to the role. Dynamic RLS uses USERPRINCIPALNAME() against a table of users and regions, so one role serves everyone. <a href="/learn/courses/power-bi/row-level-security/">Lesson 8.2</a>
</details>

**29. What is the difference between a report, a dashboard, a semantic model and an app in the Power BI service?**
<details><summary>Model answer</summary>
The semantic model (formerly dataset) is the data and measures. A report is pages of visuals built on it. A dashboard is a single page of tiles pinned from reports. An app packages reports and dashboards from a workspace for a wider audience. <a href="/learn/courses/power-bi/publish-share/">Lesson 8.3</a>
</details>

**30. When do you need a gateway?**
<details><summary>Model answer</summary>
When the service has to refresh data that lives on a private network or a PC (an on-premises SQL Server, files on a shared drive). Cloud sources such as SharePoint Online or Azure SQL don't need one. Schedule refresh in the semantic model settings, up to 8 times a day on Pro. <a href="/learn/courses/power-bi/refresh-gateways/">Lesson 8.4</a>
</details>

## 8. The questions about you

These matter as much as the technical ones. Prepare them with your capstone.

- **"Tell me about a dashboard you built."** Use your two-minute story from <a href="/learn/courses/power-bi/portfolio-writeup/">Lesson 9.3</a>: problem, users, model, two measures and why, what changed for the reader.
- **"How do you check your numbers are right?"** Reconcile totals with the source (row counts, a total in SQL or Excel), test measures on a small filter you can add up by hand, and check blanks and duplicates.
- **"A manager says the number is wrong. What do you do?"** Ask which number, which filters and what they expected; reproduce it; check the definition (gross or net? which date?); fix or explain, and write the definition down.
- **"How do you handle a request you think is a bad idea?"** Ask what decision it supports, then suggest the simplest thing that answers that.

## 9. Mapping to the PL-300 exam

The Microsoft Power BI Data Analyst exam (PL-300) has four areas. The skills measured change from time to time, so check the official study guide on Microsoft Learn before you book.

| PL-300 area | Course modules |
|---|---|
| Prepare the data | 2 (Power Query) |
| Model the data | 3, 4, 5, 6 (modelling, DAX, time intelligence) and 8.1 (performance) |
| Visualise and analyse the data | 7 (reports), 5.6 (ranking) |
| Manage and secure Power BI | 8.2 to 8.5 (security, sharing, refresh) |

The exam also expects hands-on time in Power BI Desktop and the service. Build the capstone, then practise with Microsoft's free sample files.

## 10. Practice

1. Pick five questions at random and answer each out loud in under a minute. Record yourself. Did you define, give an example and name a trap?
2. Explain context transition to a friend who doesn't use Power BI, using a shopping receipt as the example.
3. Write down three numbers from your capstone you could quote in an interview (for example "Queen Street is 31 % of chain sales", "Forks Market opened in March 2025, so its growth needs a like-for-like view").

<details><summary>Answers</summary>

1. There's no single right answer. A good one names the idea in one line, uses a concrete example, and mentions one limit.
2. For example: "Imagine going through a receipt line by line (row context). When you ask 'what did we sell of this product in total?', you take this line's product and use it as a filter on all receipts (filter context). CALCULATE does that hand-over."
3. From Northbay: Queen Street had 146,082 of 465,909 in sales (31 %); Electronics is the biggest category (36 %) but has the lowest margin outside Grocery (about 49 %); 2025 year to date beat target by about 7 %.
</details>
