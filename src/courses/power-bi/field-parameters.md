---
title: Field parameters and calculation groups
seoTitle: 'Power BI field parameters and calculation groups explained'
summary: Let readers pick which measure or dimension a visual shows with field parameters, and avoid writing the same time intelligence for every measure with calculation groups.
minutes: 14
updated: 2026-11-22
quiz:
  - q: What does a field parameter let a report reader do?
    choices: ['Edit DAX', 'Switch which measures or columns a visual uses, from a slicer', 'Change the data source']
    ans: 1
    why: Modeling > New parameter > Fields creates a table and slicer; the visual then shows whichever field the reader picks.
  - q: What problem do calculation groups solve?
    choices: ['Slow refresh', 'Writing YTD, LY and growth versions of every measure by hand', 'Security']
    ans: 1
    why: A calculation group defines YTD, LY and so on once, as calculation items, and applies them to any measure.
  - q: In a calculation item, what does SELECTEDMEASURE() mean?
    choices: ['The first measure in the model', 'Whatever measure the visual is currently showing', 'A random measure']
    ans: 1
    why: SELECTEDMEASURE() is a placeholder for the measure being evaluated, so CALCULATE(SELECTEDMEASURE(), DATESYTD('Date'[Date])) is "YTD of anything".
---

**Module 8 · about 14 minutes · read first: 6.2.** You'll be able to add measure switching with field parameters and explain calculation groups.

## 1. Why this matters

Without these, models grow to hundreds of near-duplicate measures (Sales YTD, Units YTD, Margin YTD, Sales LY, Units LY…) and pages fill with near-duplicate charts. Both features are recent favourites in interviews for mid-level roles.

## 2. Field parameters

**Modeling > New parameter > Fields**, pick Total Sales, Units and Margin, tick "Add slicer". Power BI creates a small table and a slicer; put the parameter on a visual's values, and readers switch measures from the slicer. It also works for dimensions: one chart that can show sales by Store, Category or Region.

The classic DAX pattern behind it (still useful when you need more control) is a disconnected table of choices plus a SWITCH:

<!--fig:dax-pad field-param-->

In a real model, `Pick` would be `SELECTEDVALUE(Choice[Measure], "Sales")` from a slicer on a small table of names.

## 3. Calculation groups

A calculation group is a special table whose rows (calculation items) are formulas applied to whatever measure is in the visual:

```
Time Calc[Item] =
    "Current" : SELECTEDMEASURE()
    "YTD"     : CALCULATE(SELECTEDMEASURE(), DATESYTD('Date'[Date]))
    "LY"      : CALCULATE(SELECTEDMEASURE(), SAMEPERIODLASTYEAR('Date'[Date]))
    "YoY %"   : VAR Cur = SELECTEDMEASURE()
                VAR LY = CALCULATE(SELECTEDMEASURE(), SAMEPERIODLASTYEAR('Date'[Date]))
                RETURN DIVIDE(Cur - LY, LY)
```

Create it in Model view (Calculation group, in recent Power BI versions) or with Tabular Editor. Put the group's column on a matrix's columns and any measure on values: you get Current, YTD, LY and YoY % for that measure without writing those measures. Format strings can change per item (YoY % shows as a percentage).

<details class="maths" open>
<summary>Principle</summary>

**Principle:** separate *what* is measured (Sales, Units, Margin) from *how* it's transformed (YTD, LY, growth). With m measures and t transformations you write m + t definitions instead of m × t.

**Try it:** 6 base measures and 5 time views. How many measures without calculation groups? (30.) With? (6 measures + 5 items.)
</details>

## 4. Worked example

*Northbay's KPI matrix.* Rows: Store. Columns: the Time Calc group (Current, YTD, LY, YoY %). Values: a field parameter that switches between Total Sales, Units and Margin. One visual answers 36 questions, with 3 measures and 4 calculation items behind it.

## 5. Practice

1. Make a field parameter for Store[Store], Product[Category] and Store[Region] and use it on a bar chart's axis.
2. Write a calculation item "MTD".
3. Why can calculation groups confuse report authors?

<details>
<summary>Answers</summary>

1. Modeling > New parameter > Fields > choose the three columns > put the parameter on the axis.
2. `CALCULATE(SELECTEDMEASURE(), DATESMTD('Date'[Date]))`.
3. They change every measure in the visual, including ones where the item makes no sense (YoY % of a count of stores); good naming and documentation help.
</details>
