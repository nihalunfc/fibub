---
title: Bookmarks, buttons and navigation
seoTitle: 'Power BI bookmarks, buttons and page navigation'
summary: Make reports feel like apps. Use buttons and the page navigator to move between pages, bookmarks to save views, and the selection pane to show and hide visuals, without overdoing it.
minutes: 12
updated: 2026-11-22
quiz:
  - q: What does a bookmark save?
    choices: ['The data', 'The current state of a page: filters, slicers, sort, and which visuals are visible (depending on its options)', 'The DAX code']
    ans: 1
    why: Bookmarks capture a view. Their options (Data, Display, Current page) control what is restored.
  - q: Which is the simplest way to add page navigation buttons?
    choices: ['Bookmarks for each page', 'Insert > Buttons > Navigator > Page navigator', 'Drill through']
    ans: 1
    why: The page navigator creates a button per page automatically and keeps up when pages are added or renamed.
  - q: Why can too many bookmarks be a problem?
    choices: ['They slow down DAX', 'They are hard to maintain: every change to the page may need every bookmark updated', 'They cost money']
    ans: 1
    why: Bookmarks save a snapshot. Changing visuals later can leave old bookmarks showing outdated states.
---

**Module 7 · about 12 minutes · read first: 7.2.** You'll be able to add navigation and saved views to a report.

## 1. Why this matters

Managers open a report on a phone between meetings. Clear navigation and one-click views ("my store", "this month") make it usable without training.

## 2. Page navigation

**Insert > Buttons > Navigator > Page navigator** adds a row of buttons, one per page, that updates itself. Style it like tabs at the top of each page (copy it to every page). Hide helper pages (tooltips, drill through) with right-click > Hide page, and they won't appear in the navigator.

For one-off links, any button (or shape or image) can have an **Action**: Page navigation, Back, Bookmark, Drill through, Q&A or Web URL.

## 3. Bookmarks

1. **View > Bookmarks** opens the pane. Set up the page as you want (slicer selections, a sort, hidden visuals) and **Add**.
2. Each bookmark's menu has **Data** (filters and slicers), **Display** (visibility, spotlight), **Current page** and **Selected visuals**. Untick Data for a bookmark that only shows or hides visuals without changing the reader's filters.
3. Point a button's Action at the bookmark.

Common uses: a "Reset filters" button; a toggle between a chart and a table of the same data (two bookmarks with one visual hidden in each, set in **View > Selection**); guided "story" views for a presentation.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a bookmark stores a filter context and a display state. Clicking it puts both back. Keep the number small: each one is a snapshot you'll have to update when the page changes.

**Rule of thumb:** prefer built-in features (page navigator, field parameters in Lesson 8.5, the visual's own "show as table") over bookmark tricks when they do the job.
</details>

## 4. Worked example

*A chart/table toggle on the Store page.* Put a line chart and a matrix in the same place. In the Selection pane, hide the matrix, add bookmark "Chart view" (Data unticked). Show the matrix, hide the chart, add bookmark "Table view" (Data unticked). Two buttons, "Chart" and "Table", each pointing to a bookmark. Readers switch views without losing their slicer selection.

## 5. Practice

1. Add a page navigator to your Northbay report.
2. Make a "Reset" button that clears all slicers.
3. Why untick Data on a show/hide bookmark?

<details>
<summary>Answers</summary>

1. Insert > Buttons > Navigator > Page navigator, then copy to each page.
2. Clear all slicers, add bookmark "Reset" (Data ticked), add a button with Action > Bookmark > Reset. (There's also a built-in Clear all slicers button action.)
3. So clicking it doesn't overwrite the reader's current filters.
</details>
