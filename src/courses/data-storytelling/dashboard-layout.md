---
title: 'Dashboard layout: the five-second test'
seoTitle: 'Dashboard layout best practices and the 5-second test'
summary: Put the most important numbers where eyes go first (top left), then trends, then detail. Grids, white space, one question per page, and the five-second test for any dashboard.
minutes: 11
updated: 2026-11-22
quiz:
  - q: Where do readers usually look first on a dashboard page?
    choices: ['Bottom right', 'Top left', 'The centre']
    ans: 1
    why: In left-to-right languages, people scan from the top left, across, then down.
  - q: What is the five-second test?
    choices: ['Loading time must be under 5 seconds', 'Show the page for 5 seconds and ask what the viewer remembers; it should be the main message', 'Update every 5 seconds']
    ans: 1
    why: If the main point isn't caught in 5 seconds, the layout or design is hiding it.
  - q: How many main questions should one dashboard page answer?
    choices: ['One', 'As many as fit', 'At least five']
    ans: 0
    why: One page, one purpose. Add pages (or drill through) for other questions.
---

**Module 4 · about 11 minutes · read first: 4.3.** You'll be able to lay out a dashboard page so the most important information is seen first.

## 1. Why this matters

Even with perfect charts, a dashboard fails if the headline numbers are buried at the bottom right next to a logo. Layout decides the order in which people see things. Getting it right is free, and it's easy to test.

## 2. The idea in one picture

<!--fig:ds-chart layout-->

## 3. Layout rules

1. **One page, one question:** "How is the region doing this month?" Other questions get their own page or a drill-through.
2. **Top left is prime space:** KPI cards across the top, most important first.
3. **Then the trend:** a line of the main KPI over time, full width.
4. **Then the breakdown:** by store, category or product.
5. **Filters together,** at the top or left, clearly labelled with what's selected.
6. **A grid:** align everything to columns; same gaps; same card sizes.
7. **White space:** leave room. A cramped page looks harder than it is.
8. **Title and date:** "West region, sales to 30 Nov 2025 · refreshed daily at 6 am".
9. **Phone view:** if managers read it on phones, design a phone layout too (Power BI has a mobile layout editor).

<details class="maths" open><summary>Principle</summary>

**Principle:** visual hierarchy. Size, position and contrast tell readers what matters most. Eye-tracking studies of web pages show readers scan in an F or Z shape from the top left; a dashboard should put its answers along that path.

**Physical meaning:** your eyes jump (saccades) and stop (fixations) a few times a second. In the first five seconds you get maybe 10 to 15 stops. Make sure they land on the answers.
</details>

## 4. The five-second test

Show the page to someone for five seconds, hide it, and ask: "What was it about? What was the main number? Is it good or bad?" If they can't say, change the layout or the design, then test again. It's the quickest usability test there is, and you can do it with any colleague.

## 5. Worked example

*Northbay's first dashboard draft:* a product table fills the top left, slicers and the logo top right, store chart in the middle, KPI cards in a row at the bottom. In a five-second test, a colleague remembered "a big table of products".

*Redesign:* four cards across the top (Sales vs target, Like-for-like growth, Margin %, Average sale), monthly trend below, store and product charts side by side at the bottom, slicers in a slim bar. The colleague now remembers "sales are 7 % over target, December was big".

## 6. Practice

1. Where should the "last refreshed" date go?
2. A manager wants 14 visuals on one page. What do you suggest?
3. Run a five-second test on any dashboard you can find. What did you remember?

<details><summary>Answers</summary>

1. Near the title, small but visible, so readers know how fresh the data is.
2. Ask which questions they need answered; group visuals into pages by question (overview, stores, products) with navigation or drill-through.
3. If you remembered a logo or a table instead of a number and whether it's good, the layout needs work.
</details>

Next, Module 5: building the story.
