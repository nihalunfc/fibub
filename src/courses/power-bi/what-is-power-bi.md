---
title: What Power BI is and what a BI developer does
seoTitle: 'What is Power BI? A plain introduction for beginners'
summary: Power BI turns raw business data into reports people use to decide things. See the path data takes, what each part of Power BI does, and what BI developers and analysts do all day.
minutes: 12
updated: 2026-11-22
quiz:
  - q: Which part of Power BI cleans and reshapes data before it reaches the model?
    choices: ['DAX', 'Power Query', 'The Power BI Service']
    ans: 1
    why: Power Query fetches and cleans data (Module 2). DAX calculates on the cleaned model, and the Service shares the finished report.
  - q: What is a measure?
    choices: ['A column you type into the data', 'A formula that sums up data and changes with the filters in the report', 'A chart type']
    ans: 1
    why: A measure such as Total Sales = SUM(Sales[Amount]) is worked out again for every cell of every visual, using that cell's filters. It is the heart of Power BI.
  - q: Which job usually owns the whole path, from data sources to a shared report?
    choices: ['A BI developer', 'A report reader', 'A database administrator only']
    ans: 0
    why: BI developers connect sources, model, write DAX, design reports and publish. Analysts often focus on the model, measures and report; readers use the result.
---

**Module 1 · about 12 minutes.** You'll be able to say what Power BI does, name its parts, and describe a BI developer's work in an interview.

## 1. Why this matters

Every company keeps data: till sales, stock counts, web orders, staff rotas. Very few people can read millions of rows. Business intelligence (BI) turns those rows into a handful of numbers and charts that answer real questions: *Are we ahead of last year? Which stores are behind target? What sold out?* Power BI is the most widely used BI tool in Canada, the US, the UK and India, and "Power BI and DAX" appears in most data analyst and BI developer job ads.

## 2. The idea in one picture

<!--fig:bi-pipeline-->

Data takes the same path in every Power BI project:

1. **Sources.** Excel files, CSV exports, SQL databases, SharePoint lists, web APIs.
2. **Power Query** gets the data and cleans it with recorded steps: fix types, remove junk rows, merge tables.
3. **The model** stores the clean tables and the relationships between them (a *semantic model*).
4. **DAX** (Data Analysis Expressions) is the formula language for *measures*: Total Sales, Sales Last Year, Growth %.
5. **The report** puts measures on visuals: cards, bar charts, tables, maps, with slicers to filter.
6. **The Power BI Service** (app.powerbi.com) shares the report in a browser, refreshes the data on a schedule and controls who sees what.

The free **Power BI Desktop** app covers steps 2 to 5. Sharing (step 6) needs a work account and usually a Pro or Fabric licence, which employers provide.

## 3. What makes Power BI different from Excel

Excel works cell by cell: you write a formula in C2 and copy it down. Power BI works with whole tables and **measures that recalculate for each part of the report**. Write `Total Sales = SUM(Sales[Amount])` once, and it gives the right number in a card, per store in a bar chart, per month in a line chart and per region in a table, because each cell brings its own *filter context* (Module 5). One definition, used everywhere, always agreeing with itself: that is why companies trust it for their official numbers.

<!--fig:dax-pad first-total-->

## 4. Who does what

| Role | Typical work in Power BI |
|---|---|
| **BI developer** | Connects sources, builds Power Query and the model, writes complex DAX, designs reports, publishes, sets refresh and security. Often also SQL and data warehouse work. |
| **Data or business analyst** | Builds reports on an existing model, writes measures, answers business questions, explains the numbers to managers. |
| **Report reader** | Managers and staff who use the report, filter it and export to Excel. |

A typical BI developer's week: a sales manager asks "why is Rideau behind?"; you check the data, add a measure for pace against last year, fix a refresh that failed because a column was renamed in the source file, and present the new page on Thursday. The skills behind that week are exactly the modules of this course.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** clean once, model once, define each number once. Every report page then reuses the same measures, so two pages can never disagree about "Total Sales".

**Analogy:** a restaurant kitchen. Power Query is the prep station (wash and chop), the model is the walk-in fridge (everything labelled, in its place), DAX is the recipe card, and the report is the plate that goes to the table.

**Try it:** in the editor above, the measure is written once. Changing "Split by" re-runs the same measure with different filters. Count how many different numbers one line of DAX gave you.
</details>

## 5. Worked example

*Northbay Goods, the made-up chain in this course.* The regional manager asks: "Which category grew most this year?" Without BI: export four spreadsheets, copy and paste, build a pivot, hope nobody sorted a column wrongly. With Power BI: the model already holds every order line; one measure `Total Sales`, one more `Sales Last Year` (Lesson 6.2) and one `Growth %` give a table by category in a minute, and next month it refreshes itself.

## 6. Practice

1. Put these in the order data travels: report, Power Query, source file, model, DAX.
2. Name one task a BI developer does that a report reader never does.
3. Why is a measure better than typing a total into a cell?

<details>
<summary>Answers</summary>

1. Source file, Power Query, model, DAX, report.
2. Any of: build Power Query steps, design relationships, write measures, publish, set refresh or security.
3. It recalculates for every filter and every visual, and there is only one definition, so the numbers always agree and update with new data.
</details>

## 7. Next

Next, Lesson 1.2 introduces Northbay Goods, the data you'll use all course. If you like to look at a file before loading it, the [[csv-profiler]] shows every column's type, blanks and odd values in your browser.
