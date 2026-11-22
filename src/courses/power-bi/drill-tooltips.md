---
title: Drill down, drill through and tooltips
seoTitle: 'Power BI drill down, drill through and report page tooltips'
summary: Let readers go from summary to detail without crowding the page. Set up hierarchies to drill down, drill-through pages for one item's details, and tooltip pages that appear on hover.
minutes: 14
updated: 2026-11-22
quiz:
  - q: What is the difference between drill down and drill through?
    choices: ['None', 'Drill down goes to the next level in the same visual (year to month); drill through opens another page filtered to the item you right-clicked', 'Drill through only works on maps']
    ans: 1
    why: Drill down moves within a hierarchy in place. Drill through jumps to a detail page carrying the selection as a filter.
  - q: What makes a page a drill-through target?
    choices: ['Its name', 'A field in the page''s Drill through well (for example Store[Store])', 'A bookmark']
    ans: 1
    why: Put the field in the Drill through well on the page's Build pane; then right-clicking that field anywhere offers "Drill through" to the page.
  - q: Why use a report page tooltip?
    choices: ['To add decoration', 'To show a small extra summary for the hovered item without taking space on the main page', 'To print the report']
    ans: 1
    why: Tooltip pages show context (trend, top product) on hover, keeping the main page clean.
---

**Module 7 · about 14 minutes · read first: 7.2.** You'll be able to give readers detail on demand: drill down, drill through and tooltip pages.

## 1. Why this matters

A good report shows the summary first and details when asked. Cramming every detail onto one page makes it unreadable; these three features keep it clean.

## 2. Drill down

Put several fields from a **hierarchy** on an axis, for example Date: Year, Quarter, Month. The visual shows years; the drill arrows let readers go down a level (all months) or expand a chosen year. Make your own hierarchy in the Data pane: right-click Year > Create hierarchy, then add Quarter and Month to it. Turn off the automatic date hierarchy (auto date/time) and build this one on your own date table.

## 3. Drill through

1. Make a page called "Store detail".
2. In its Build pane, drag `Store[Store]` into **Drill through**. Power BI adds a Back button.
3. Build the page with store-level visuals: trend, category mix, product table.
4. On any other page, right-click a store (a bar, a table row) > **Drill through > Store detail**. The page opens filtered to that store.

Use a title measure on the detail page so it says which store it's showing (`SELECTEDVALUE(Store[Store])`).

## 4. Tooltip pages

1. New page; in Format > Page information, turn on **Allow use as tooltip**; in Canvas settings choose the Tooltip size.
2. Put a few small visuals on it: a mini trend, the top product, margin %.
3. On the main chart: Format > Properties > Tooltips > Type **Report page**, choose the page.

Now hovering over a store shows its mini summary. A measure like this is typical on a tooltip page:

<!--fig:dax-pad v-tooltip-->

<details class="maths" open>
<summary>Principle</summary>

**Principle:** drill through and tooltips pass the hovered or right-clicked item to another page as a filter. On that page, every measure is evaluated in a filter context that includes that item, so the same measures give that item's numbers.

**Try it:** a tooltip page shows `Total Sales` and the hovered bar is Rideau in 2025. Which filter context does the tooltip's card use? (Store = Rideau and Year = 2025, plus any page slicers.)
</details>

## 5. Worked example

*From chain to product in three clicks.* Overview page: sales by region. Right-click West > drill through to Region detail: sales by store. Right-click Harbour Front > drill through to Store detail: product table and trend. Hover a product: tooltip with its 28-day trend. No page has more than five visuals.

## 6. Practice

1. Make a Date hierarchy Year > Quarter > Month and use it on a column chart.
2. Set up a drill-through page for Product[Category].
3. What does the Back button on a drill-through page do?

<details>
<summary>Answers</summary>

1. Right-click 'Date'[Year] > Create hierarchy, then drag Quarter and Month into it.
2. New page, drag Product[Category] into the Drill through well, build the visuals.
3. Returns to the page the reader came from (Ctrl+click in Desktop).
</details>
