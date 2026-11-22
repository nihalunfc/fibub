---
title: Slicers, cross-filtering and interactions
seoTitle: 'Power BI slicers, sync slicers and edit interactions'
summary: Slicers let people filter the report; visuals filter each other when clicked. Control both with sync slicers and Edit interactions, and write titles that say what is selected.
minutes: 14
updated: 2026-11-22
quiz:
  - q: You click a bar and another visual should NOT change. What do you use?
    choices: ['Delete the visual', 'Format > Edit interactions, then set the other visual to None', 'A bookmark']
    ans: 1
    why: Edit interactions lets you choose, per visual, whether a selection filters, highlights or does nothing to each other visual.
  - q: How do you keep the same Year slicer selection on every page?
    choices: ['Copy it to each page and hope', 'View > Sync slicers', 'Use a measure']
    ans: 1
    why: Sync slicers links copies of a slicer across pages so they share one selection (and can be hidden on some pages).
  - q: What does SELECTEDVALUE(Store[Region], "all regions") return when two regions are selected?
    choices: ['The first region', '"all regions"', 'An error']
    ans: 1
    why: SELECTEDVALUE returns the single value when exactly one is visible, otherwise the alternate result.
---

**Module 7 · about 14 minutes · read first: 5.1.** You'll be able to set up slicers and interactions so the report behaves the way readers expect.

## 1. Why this matters

Interactivity is what makes Power BI more than a printed report. Badly set up, it confuses people ("why did that chart go blank?"). Well set up, managers answer their own questions.

## 2. Slicers

- **Slicer visual:** pick a field (Store[Region], Date[Year]). Styles: list, dropdown, tiles, between (for numbers and dates), relative date ("last 3 months").
- **Single select** for things like Year when combining years makes no sense.
- **Sync slicers** (View > Sync slicers) shares a selection across pages.
- **Filters pane** for filters readers shouldn't change (hide or lock them) and for page- or report-wide filters.

Every selection becomes part of each visual's filter context (Lesson 5.1).

## 3. Cross-filtering and highlighting

Click a bar and other visuals on the page react: by default they **highlight** (show the selected part darker) or **filter**. Select a visual, then **Format > Edit interactions**: icons appear on the other visuals to choose **Filter**, **Highlight** or **None**. Typical choices: the card row should filter; a "total company" chart should ignore clicks (None).

## 4. Say what is selected

Readers forget what they clicked. Put the selection in titles with a measure (visual Format > Title > fx > choose the measure):

<!--fig:dax-pad v-title-->

<details class="maths" open>
<summary>Principle</summary>

**Principle:** every interaction is just another filter in the filter context. A slicer adds filters to all visuals it's connected to; a click adds a filter to visuals set to Filter; Edit interactions decides which visuals receive which filters.

**Try it:** a card shows Total Sales with Region = West sliced. Someone clicks the Home bar in a chart set to filter. What does the card show? (West sales of Home products.)
</details>

## 5. Worked example

*The store manager's report.* A Store slicer (single select, synced on all pages), a Year slicer (single select), and a relative date slicer "last 13 weeks" on the trend page only. The "Chain total" card is set to None for the Store slicer interaction, so managers always see their store next to the chain. Titles read "Sales for Rideau, 2025".

## 6. Practice

1. Write a title measure that lists all selected stores, separated by commas. (Hint: CONCATENATEX(VALUES(Store[Store]), Store[Store], ", ").)
2. Which slicer style suits dates for "last 30 days"?
3. A chart goes blank when someone selects a store that sells no Outdoor goods. Is that a bug?

<details>
<summary>Answers</summary>

1. `Stores = CONCATENATEX(VALUES(Store[Store]), Store[Store], ", ")`.
2. A relative date slicer.
3. No: the filter context has no rows for that combination. Add a message measure such as "No sales for this selection" with IF(ISBLANK(…)).
</details>
