---
title: Dashboards people read in ten seconds
summary: 'Design pages from decisions, lay out KPIs, trend and breakdown, pick honest charts, and feed every page a true "data as of" time and missing-source banner.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: What is the best chart to compare net sales across 18 restaurants?
    choices: ['A pie chart', 'A sorted horizontal bar chart', 'A bubble chart']
    ans: 1
    why: People compare positions along a common scale most accurately. Sorting puts the answer in order.
  - q: Where should the "Data as of" time on a dashboard come from?
    choices: ['The time the report was opened', 'The Power BI refresh time', 'The latest successful load in the pipeline''s audit table']
    ans: 2
    why: A refresh can succeed on stale data. Only the pipeline knows when the data itself last arrived.
  - q: A KPI tile shows "Net sales $48,210". What is missing?
    choices: ['A comparison, such as against the same weekday last year or the budget', 'More decimal places', 'A pie chart']
    ans: 0
    why: A number with nothing to compare it to cannot tell anyone whether the day was good or bad.
sources:
  - 'Cleveland, W. S. and McGill, R. (1984), Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods, Journal of the American Statistical Association 79(387), 531-554 https://doi.org/10.1080/01621459.1984.10478080'
  - 'Few, S. (2013), Information Dashboard Design, 2nd edition, Analytics Press'
  - 'Microsoft Learn: Performance Analyzer in Power BI Desktop https://learn.microsoft.com/power-bi/create-reports/desktop-performance-analyzer'
---

**Module 6 · about 35 minutes, plus the lab · read first: [6.2](/learn/courses/etl/dax-correct/).** The design basics are taught in depth in the [Data storytelling course](/learn/courses/data-storytelling/): [dashboard layout](/learn/courses/data-storytelling/dashboard-layout/), [KPI cards](/learn/courses/data-storytelling/kpi-cards/) and [compared to what?](/learn/courses/data-storytelling/compared-to-what/). Here you'll apply them to the restaurant and hotel marts and add the parts only a pipeline can supply: a true freshness time, a missing-source banner and tables shaped so every visual is quick.

<div class="bigidea">A dashboard is judged in its first ten seconds: one page per audience, the key number top left with a comparison beside it, and an honest line saying how fresh the data is.</div>

## 1. Why this matters

Can a restaurant area manager see, within ten seconds, whether yesterday was good, why, and what to look at next? If not, the pipeline behind it might as well not exist. This is the most visible part of your portfolio, and the part where engineers most often stop too early.

A good dashboard is like a car's instrument panel: speed in the middle, fuel and warnings where your eye falls, and nothing you do not need while driving. Nobody wants a panel that lists every sensor in the engine.

## 2. Start from decisions

For each audience, write three questions and the decision each one drives:

| Audience | Question | Decision |
|---|---|---|
| Area manager (restaurants) | Which restaurants were below the same weekday last year yesterday? | Call those managers by 10:00 |
| Revenue manager (hotels) | Where is pace behind for the next 30 days? | Open a promotion or push a channel |
| Agency account lead | Which campaigns' return on ad spend fell this week? | Move budget |
| Finance | Is month-to-date net sales on budget? | Start forecast conversations |

One page per audience. If a visual answers none of the questions on the list, it does not go on the page. The Data storytelling lesson [Know your audience](/learn/courses/data-storytelling/know-your-audience/) goes deeper.

## 3. Page anatomy

```text
┌──────────────────────────────────────────────────────────────┐
│ Title · Data as of 14 Sep 06:42 · Filters (brand, region)     │
├───────────┬───────────┬───────────┬──────────────────────────┤
│ Net sales │  Orders   │ Avg check │ Food cost %              │  ← KPI tiles: value, vs last year, sparkline
├───────────┴───────────┴───────────┴──────────────────────────┤
│ Trend: net sales by business day vs same weekday last year    │  ← one line plus a reference line
├──────────────────────────────┬───────────────────────────────┤
│ Breakdown: by restaurant      │ Mix: channel share by week    │  ← sorted bars, not pies
├──────────────────────────────┴───────────────────────────────┤
│ Detail: table with conditional formatting; drill-through page │
└──────────────────────────────────────────────────────────────┘
```

People read from the top left. Put the one number that matters there, with its comparison.

## 4. Visual rules, briefly

- **Bars to compare, lines for time,** tables to look things up. Pies only for two or three parts of a whole, if ever.
- **Sort** bars by value, and start bar axes at zero.
- **Colour means something**: one neutral colour for data, one accent for "look here". Never rely on red and green alone; add a label or icon for colour-blind readers.
- **Label directly** instead of using a legend; remove gridlines, borders and 3D.
- **A comparison beside every KPI**: against last year, the budget or last week.

These rules come from measurement, not taste. People judge position along a shared scale most accurately, then length, then angle and area, with colour shade least accurate. That is why a sorted bar chart beats a map of bubbles for the actual comparison.

<div class="problem" data-problem="ten-second-dashboards-bubble"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** how accurately people judge a quantity depends on how it is drawn. Position and length are read almost in proportion; area is underestimated.

**Equation:** perceived size `$\psi$` grows with drawn area `$A$` roughly as a power below 1 (Stevens' power law),

```math
\psi \propto A^{0.7} \text{ to } A^{0.8}, \qquad \psi \propto L^{1} \text{ for length}
```

So a bubble with twice the area looks only about `$2^{0.7} \approx 1.6$` times as big.

**Analogy:** choosing a measuring tool. A ruler (position, length) gives precise readings; judging by eye how much paint covers a wall (area) does not.

**Where it breaks:** on maps, location itself carries meaning. Keep the map, and put a sorted bar chart beside it for the comparison.

**Try it:** bubble B has twice the area of bubble A. With `$\psi \propto A^{0.7}$`, how much bigger does it look? (About 1.62 times, not 2.)
</details>

## 5. What the pipeline must supply

A design is only as honest as the data under it. Three things come from you, not from the report author.

**A true "data as of" time.** It comes from `ops.load_audit`, the table where your pipeline records each successful load (Module 3), not from the report's refresh time. A refresh can run perfectly on yesterday's data.

**A missing-source banner.** If a hotel's file did not arrive, the page should say "Hotel H3 not received; H3 excluded", not show a mysterious 20 % drop in occupancy.

<div class="steps">
<div class="step"><b>The audit table.</b> At 06:42 the pipeline writes one row per source to <code>ops.load_audit</code>: H1 ok, H2 ok, H3 missing, H4 ok, H5 ok.</div>
<div class="step"><b>A mart for the page.</b> dbt builds <code>mart.freshness</code>: as_of = 06:42 (latest successful load), sources_expected = 5, sources_loaded = 4, missing = "H3".</div>
<div class="step"><b>Two measures.</b> <code>As Of = "Data as of " & FORMAT(MAX(freshness[as_of]), "d mmm hh:mm")</code>, and a Banner measure that returns text only when loaded &lt; expected.</div>
<div class="step"><b>The page.</b> The header reads "Data as of 14 Sep 06:42", and an amber card says "H3 not received; H3 excluded from totals".</div>
<div class="step"><b>The next morning.</b> H3 arrives, all five load, the banner measure returns blank and the card disappears by itself.</div>
</div>

```dax
Banner =
VAR expected = SUM ( freshness[sources_expected] )
VAR loaded   = SUM ( freshness[sources_loaded] )
RETURN IF ( loaded < expected, "Not received: " & MAX ( freshness[missing] ) & ". Excluded from totals." )
```

**Tables shaped for speed.** Use **Performance Analyzer** in Power BI Desktop to see each visual's query and render time. Aim for a second or two per visual. When a visual is slow because it scans 50 million order lines to draw daily totals, the fix is a daily mart (`fct_restaurant_daily`) from dbt, not a cleverer chart. [Faster reports](/learn/courses/power-bi/performance/) in the Power BI course covers the report side.

<div class="meaning">

<dl>
<dt>Audience page</dt><dd>One page per group of people, built from the questions they need answered.</dd>
<dt>KPI tile</dt><dd>A key number with a comparison (last year, budget) and often a small trend line.</dd>
<dt>Data as of</dt><dd>The time the newest data was loaded, taken from the pipeline's audit table.</dd>
<dt>Missing-source banner</dt><dd>A message that appears only when an expected source did not load.</dd>
<dt>Physical meaning</dt><dd>At 07:30 a hotel general manager sees occupancy down 18 % and starts calling staff. The real cause was a file that had not arrived. With the banner, the page says "H3 not received" and nobody acts on a number that is not real.</dd>
</dl>

</div>

<div class="myth">

**"The refresh time tells people how fresh the data is."** The refresh can succeed at 07:00 while the newest data is from yesterday, because the load was late. Only the pipeline's own record of the last successful load can say how fresh the numbers really are.

</div>

## 6. Try it

1. Write the audience, question and decision table for a restaurant operations page and a hotel revenue page.
2. Build both pages in Power BI following the anatomy, using your Lesson 6.2 measures.
3. Build `mart.freshness` in dbt from `ops.load_audit`, then the "Data as of" card and the banner measure. Test the banner by deleting one source's file and rerunning.
4. Add a drill-through page for one restaurant and a tooltip with its 28-day trend.
5. Run Performance Analyzer and fix the slowest visual, in dbt if the cause is the table's shape.
6. Show the page to someone (or ask an AI model to play a busy area manager) and watch where they hesitate. Fix those three spots.
7. Export screenshots for the README and record a 60-second walkthrough.

**What to check:** every visual answers a question on your list; every KPI has a comparison; the banner appears with a missing source and disappears when it arrives; no visual takes more than about two seconds. Commit as `feat(powerbi): restaurant ops and hotel revenue pages with freshness banner`.

<div class="keypoints">

- Design from decisions: one page per audience, three questions each, nothing that does not serve them.
- Layout: KPIs with comparisons top left, a trend, a sorted breakdown, then detail.
- Position and length are read accurately; area and colour shade are not. Prefer sorted bars.
- The pipeline supplies the truth about freshness: "data as of" from the audit table and a banner for missing sources.

</div>
