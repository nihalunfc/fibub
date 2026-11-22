---
title: Your first report in 15 minutes
seoTitle: 'Build your first Power BI report step by step'
summary: Load the Northbay files into Power BI Desktop, connect the tables, write one measure and build a page with a card, a bar chart, a line chart and a slicer.
minutes: 20
updated: 2026-11-22
quiz:
  - q: In Model view, which way do you drag to relate Sales to Product?
    choices: ['From Sales[ProductKey] to Product[ProductKey] (either direction works; Power BI sets one-to-many)', 'From Sales[Amount] to Product[UnitPrice]', 'You cannot relate them']
    ans: 0
    why: Relationships join matching key columns. Power BI sees that ProductKey is unique in Product and makes it one (Product) to many (Sales).
  - q: Why write a measure instead of dragging the Amount column into a visual?
    choices: ['Dragging is not allowed', 'A named measure is defined once, can be formatted and reused, and can grow into more complex logic', 'Measures are faster to type']
    ans: 1
    why: Dragging a column makes an implicit sum that is hard to reuse. Explicit measures are the professional habit and are needed for anything beyond a plain sum.
  - q: You click the Home bar in a bar chart and the line chart changes. What happened?
    choices: ['The data was deleted', 'Cross-filtering: the click filtered the other visuals on the page', 'The measure was rewritten']
    ans: 1
    why: Visuals on a page filter each other by default. Lesson 7.2 shows how to control it with Edit interactions.
---

**Module 1 · about 20 minutes · needs: Power BI Desktop and the five CSV files from Lesson 1.2.** You'll build a one-page report and see a measure respond to filters.

## 1. Why this matters

The fastest way to understand Power BI is to make one small report end to end. Everything after this lesson goes deeper into one of these steps.

## 2. Load the data

1. **Home > Get data > Text/CSV**, pick `northbay-sales.csv`, then **Load** (not Transform for now).
2. Repeat for product, store, date and targets. In the **Data** pane you now see five tables.
3. Open **Table view** and click Sales: check that Date shows as a date and Amount as a number (a ∑ icon). If not, Lesson 2.2 fixes types.

## 3. Connect the tables

1. Open **Model view**. Power BI may already have guessed some relationships; check each line.
2. Drag `Sales[ProductKey]` onto `Product[ProductKey]`. Do the same for StoreKey to `Store` and Date to `'Date'[Date]`, and `Targets[StoreKey]` to `Store[StoreKey]`.
3. Each line should show **1** at the dimension end and **\*** at the Sales end, with an arrow pointing to Sales. Your model now matches the diagram in Lesson 1.2.
4. Select the Date table, then **Table tools > Mark as date table**, and choose the Date column.

## 4. Write a measure

On the Home ribbon, **New measure**, type:

```
Total Sales = SUM(Sales[Amount])
```

Press Enter. In the measure's **Measure tools** ribbon, set the format to Currency with 0 decimals. Try the same measure right here:

<!--fig:dax-pad first-total-->

## 5. Build the page

1. **Card:** pick the Card visual, drop `Total Sales` into it.
2. **Bar chart:** clustered bar chart, `Product[Category]` on the Y-axis, `Total Sales` on the X-axis.
3. **Line chart:** `'Date'[YearMonth]` on the X-axis, `Total Sales` on the Y-axis.
4. **Slicer:** a slicer with `Store[Region]`.
5. Click a region in the slicer, then a bar in the bar chart. Every visual changes: the one measure is being worked out again for whatever is selected.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a visual never stores numbers. Each time you click, Power BI builds the *filter context* for every cell (slicer selection + the bar you clicked + the row or axis of that cell) and evaluates the measure inside it.

**Try it:** with nothing selected, read the card. Select West in the slicer and read it again. Same measure, different filter context, different answer.
</details>

## 6. Worked example

*Check your numbers.* With no filters, the card shows the total of every order line. In the editor above, split by nothing (one total) and compare. Then split by `Product[Category]`: the four category values should add up to the total. Checking that parts add up to the whole is the first habit of a careful BI developer.

## 7. Practice

1. Change the bar chart to show stores instead of categories.
2. Add a second card with `Units = SUM(Sales[Quantity])`.
3. Save the file as `northbay.pbix`. You'll keep building on it through the course.

<details>
<summary>Answers</summary>

1. Replace Product[Category] on the Y-axis with Store[Store]. Queen Street should be the top bar.
2. New measure > `Units = SUM(Sales[Quantity])`, then a Card visual with Units.
3. File > Save as.
</details>
