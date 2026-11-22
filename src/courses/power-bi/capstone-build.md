---
title: Building the capstone step by step
seoTitle: 'Build a Power BI retail sales dashboard step by step'
summary: Build the Northbay dashboard yourself in Power BI Desktop, page by page, with checkpoints to confirm your numbers match before you move on.
minutes: 60
updated: 2026-11-22
quiz:
  - q: Why check your measure totals against the practice editor before designing pages?
    choices: ['To save colours', 'Fixing a wrong number after the pages are built means redoing visuals; checking first catches model or DAX errors early', 'It is required by Power BI']
    ans: 1
    why: Numbers first, design second. A checkpoint after each layer stops errors from spreading.
  - q: Which page should be the drill-through target?
    choices: ['Overview', 'Store detail, with Store[Store] in its Drill through well', 'All pages']
    ans: 1
    why: Drill through goes from a summary to one item's details; the store page shows one store.
  - q: What is the last step before publishing?
    choices: ['Add more visuals', 'Test RLS with View as, check mobile layout, and run Performance Analyzer', 'Delete the date table']
    ans: 1
    why: Security, phone layout and speed are what readers notice first. Test them before anyone else does.
---

**Module 9 · about 60 minutes of work (spread it over a few sessions) · needs: Power BI Desktop and the Northbay files.** You'll build the full dashboard. Do it yourself: it's your portfolio piece, and you'll explain every part in interviews.

## 1. Model (checkpoint 1)

1. Start from your `northbay.pbix` from Lesson 1.4, or load the five CSVs again.
2. In Power Query: check types; make `Targets[YearMonth]` text; remove nothing you need.
3. Model view: Sales to Product, Store and Date; Targets to Store. Single direction. Mark Date as the date table; sort Month by MonthNo.
4. Turn off auto date/time.

**Checkpoint:** a table visual of `Store[Store]` and `SUM(Sales[Amount])` shows Queen Street 146,082.36 and a total of 465,909.04 (check against the editor below).

<!--fig:dax-pad first-total-->

## 2. Measures (checkpoint 2)

Create a `_Measures` table (Home > Enter data, one empty column, then hide the column). Add, with display folders:

- **Base:** Total Sales, Units, Order Lines, Total Cost, Total Margin, Margin %.
- **Time:** Sales LY, Growth %, Sales YTD, Sales YTD LY, Pace %, Sales 28d, 3M Avg.
- **Target:** Target, Target YTD, vs Target %.
- **Rank:** Product Rank, Store Rank (with ISINSCOPE).
- **Labels:** Title, Data As Of.

**Checkpoint:** with Year = 2025, Sales YTD = 262,471, Pace % ≈ 29.0 %, Target YTD = 246,300, vs Target % ≈ 6.6 %. Use the capstone editor in Lesson 9.1 to compare region by region.

## 3. Pages

**Overview (chain):** four cards; line chart of Total Sales and Sales LY by YearMonth; bar of vs Target % by store, sorted; Year and Region slicers (synced).

**Region:** bar of Total Sales by store with Share of Region; matrix of category × store with Growth %.

**Store detail (drill-through target on Store[Store]):** title measure; cards; line chart with 3M Avg; product matrix with Units, Total Sales, Margin %, Product Rank, Sales 28d; conditional formatting on Margin % (with icons, not colour alone).

**Product tooltip page:** a small line chart of Sales 28d by month and the product's rank.

## 4. Finish

1. Theme: one accent colour, grey for last year, status colours only for vs Target.
2. Titles that state the message; alt text on each visual.
3. RLS roles: Store (via a security table) and Region; test with View as.
4. Mobile layout for Overview and Store detail.
5. Performance Analyzer: every visual under one second.
6. Save as `northbay-dashboard.pbix`; take screenshots of each page for your write-up.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** build in layers and test each layer: data, model, measures, visuals, security. A wrong number found at the measure layer takes minutes to fix; found by a manager, it costs trust.

**Try it:** keep a short build log as you go (what you did, what broke, how you fixed it). It becomes your interview story.
</details>

## 5. Stretch goals

- Like-for-like growth, excluding stores not open in both periods.
- A waterfall from last year's sales to this year's by category.
- A calculation group for Current / YTD / LY / YoY %.
- A "What sold out?" page using a stock table you generate yourself.

## 6. Practice

1. Your Pace % differs from the checkpoint. List three places to look.
2. Why put Data As Of on every page?
3. What do you show on the Overview for a regional manager with RLS?

<details>
<summary>Answers</summary>

1. The date table (marked? complete?), the relationship Sales[Date] to Date[Date], and the Year slicer (single select on 2025?).
2. So readers know how fresh the numbers are and notice a failed refresh.
3. The same page: RLS filters it to their region automatically.
</details>
