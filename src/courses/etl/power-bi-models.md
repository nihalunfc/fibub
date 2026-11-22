---
title: Power BI data models that stay fast
summary: 'Hand the warehouse star to Power BI intact: Import or DirectQuery, thin folding Power Query, fewer distinct values for a smaller model, PBIP in git.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Which relationship should normally link dim_restaurant to fct_order_lines?
    choices: ['Many-to-many, both directions', 'One-to-many from the dimension to the fact, single direction', 'One-to-one']
    ans: 1
    why: Dimensions filter facts. Keep relationships one-to-many and single direction unless you know exactly why not.
  - q: Why split an order timestamp into a date column and a time column before importing?
    choices: ['Power BI cannot read timestamps', 'Fewer distinct values per column compress far better in Import mode', 'Relationships need it']
    ans: 1
    why: Model size depends on distinct values per column. A timestamp to the second has millions; a date has hundreds and a time to the minute 1,440.
  - q: Why save a report as .pbip?
    choices: ['The model and report become text files that can be compared and reviewed in git', 'It refreshes faster', 'It encrypts the data']
    ans: 0
    why: PBIP is version control for BI. A .pbix is a single binary file that git cannot compare.
sources:
  - 'Microsoft Learn: Power BI semantic model modes (Import, DirectQuery, composite) https://learn.microsoft.com/power-bi/'
  - 'Microsoft Learn: Power BI Desktop projects (PBIP) https://learn.microsoft.com/power-bi/developer/projects/projects-overview'
  - 'Russo, M. and Ferrari, A. (2019), The Definitive Guide to DAX, 2nd edition, Microsoft Press, Chapters 17 and 18 (the VertiPaq engine and model size)'
---

**Module 6 · about 35 minutes, plus the lab · read first: [5.1](/learn/courses/etl/dimensional-modelling-grain/), [5.7](/learn/courses/etl/proof-restaurant-dbt/), and for the Power BI basics, [Star schema](/learn/courses/power-bi/star-schema/) and [Relationships](/learn/courses/power-bi/relationships/).** You'll be able to choose a storage mode for a medium company, load only the marts through a read-only login, check that Power Query folds back to the warehouse, find and cut the columns that make a model big, and keep the report in git.

<div class="bigidea">If the warehouse star reaches Power BI unchanged, the report stays small, fast and simple; most slow or wrong reports are model problems that started upstream.</div>

## 1. Why this matters

The [Power BI course](/learn/courses/power-bi/) teaches how to build a model inside Power BI. This lesson is the hand-off from the pipeline side: what your marts should look like so the Power BI developer (possibly you) does no reshaping at all. When the model is a clean star of marts, DAX stays short and visuals are quick. When it is a pile of raw tables fixed up in Power Query, every refresh is slow and every number needs explaining.

A good hand-off is like delivering flat-pack furniture with every screw labelled and the pieces in build order. A bad one is a box of loose wood and a note saying "you'll figure it out".

## 2. Storage modes, from the pipeline's side

| Mode | How it works | Use when |
|---|---|---|
| **Import** | Data is compressed into the model and refreshed on a schedule or a trigger | The default. Fastest visuals, all of DAX available |
| **DirectQuery** | Each visual sends SQL to the warehouse live | Data too big to import, or near real time needed, and the warehouse is fast |
| **Composite** | Big fact in DirectQuery, dimensions and a summary table imported | Very large facts with summary dashboards |
| **Direct Lake** | Reads Delta tables in OneLake directly | Microsoft Fabric shops |

For a medium company with a few gigabytes of marts on Azure SQL, **Import with a refresh triggered when the pipeline finishes** (Lesson [6.4](/learn/courses/etl/refresh-security-delivery/)) is almost always right. DirectQuery moves the load onto your warehouse: every slicer click becomes a query, so you would need to size and index for that.

Tap a value in one or two dimensions and watch the fact rows light up.

<figure class="fig" data-fig="@data-star-slice"><figcaption>Notice that the filter is on the dimension but the numbers come from the fact table.</figcaption></figure>


## 3. What to hand over

- Load **marts only**, from the `mart` schema, with the read-only `report_reader` login from [Lesson 4.6](/learn/courses/etl/security-cost-azure/). Never raw or staging tables.
- Relationships: **one-to-many** from dimension to fact, **single direction**. If the model needs a bi-directional or many-to-many relationship, the warehouse is usually missing a bridge table or a dimension.
- `dim_date` comes from the warehouse and is **marked as the date table**; turn off *Auto date/time* (it creates hidden tables for every date column). See [A proper date table](/learn/courses/power-bi/date-table/).
- Hide the fact foreign keys and technical columns (`_loaded_at`, `_batch_id`). Measures live in a `_Measures` table.
- A fact with several dates (booking created, arrival) gets one active relationship to `dim_date` and inactive ones used with `USERELATIONSHIP` in DAX: the *role-playing* dimension.
- Columns people slice by (brand, region, `is_comparable`) come from dbt, not from DAX calculated columns. [Calculated columns or measures?](/learn/courses/power-bi/calculated-columns/) explains why.

## 4. Power Query: thin and folding

Power Query shapes data on the way in. **Query folding** means your steps are translated into one SQL query that runs in the warehouse. Once a step cannot fold (some custom columns, merges with a file), every later step runs on the refreshing machine, row by row. Right-click a step and choose *View Native Query* to check: if it is greyed out, that step did not fold.

The rule for a pipeline team: **transformations belong in dbt.** Power Query only picks tables and columns and holds two parameters, `SqlServer` and `SqlDatabase`, so the same report points at dev or prod. The [Power Query basics](/learn/courses/power-bi/power-query-basics/) lesson shows the editor itself.

## 5. Why some columns are huge

Import mode (the VertiPaq engine) stores each column on its own. It builds a dictionary of the column's distinct values, stores each row as a small number pointing into that dictionary, and squeezes repeated runs.

<div class="steps" data-fig="power-bi-models-dictionary">
<div class="step"><b>A text column.</b> Eight rows of <code>channel</code>: app, counter, app, delivery, drive_thru, counter, app, app.</div>
<div class="step"><b>Dictionary.</b> Four distinct values, each stored once: 0 app, 1 counter, 2 delivery, 3 drive_thru.</div>
<div class="step"><b>Bit-packing.</b> Four values need only 2 bits per row (00 to 11). Eight rows take 16 bits, instead of eight words of text.</div>
<div class="step"><b>Run-length encoding.</b> After sorting, repeats collapse into pairs: (app, 4), (counter, 2), (delivery, 1), (drive_thru, 1).</div>
<div class="step"><b>The expensive column.</b> An order ID is different on every row: the dictionary is as big as the column and nothing repeats. Timestamps to the second behave the same way.</div>
</div>

So model size depends on **distinct values per column**, far more than on the number of rows. The usual fixes, all done in dbt before Power BI sees the data:

- Split timestamps into a date and a time (to the minute, if seconds are not needed), or drop the time.
- Do not import IDs (order ID, GUIDs, email addresses) unless a visual needs them.
- Round numbers that do not need full precision (cost to the cent, not to eight decimals).
- Pre-aggregate: if every page shows daily totals, import `fct_restaurant_daily`, not 50 million order lines.

<div class="problem" data-problem="power-bi-models-bits"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a column's stored size grows with the number of bits needed to tell its distinct values apart, not with the length of the text.

**Equation:** in a simple model, a column of `$N$` rows with `$D$` distinct values needs about

```math
N \cdot \lceil \log_2 D \rceil \text{ bits}
```

for the row indexes, plus a dictionary of `$D$` values, before run-length encoding shrinks it further on sorted data.

**Analogy:** a classroom where every pupil has one of four coloured badges. You can record each pupil with a 2-bit code. If instead every pupil has a unique name badge, you need a full name list and a longer code per pupil.

**Where it breaks:** the real engine adds more tricks (value encoding for some numbers, segment sizes), so treat this as a guide to which columns are expensive, not an exact size. Measure with a tool such as VertiPaq Analyzer in DAX Studio.

**Try it:** 50 million rows. Column A has 4 distinct values, column B 1 million. Index bits per row? (A: 2 bits; B: 20 bits, ten times bigger before any run-length savings.)
</details>

## 6. PBIP: Power BI in git

Save as a **Power BI Project (.pbip)**: the report and the semantic model become folders of text files (TMDL for the model, JSON for the report). Git can compare them, so a changed measure shows up as a reviewable line in a pull request. Commit the PBIP folder. A `.pbix` file is binary and can contain imported data: keep only synthetic data in anything you publish or commit.

Two free tools are worth knowing: **DAX Studio** with VertiPaq Analyzer shows size per column, and **Tabular Editor** edits measures and runs best-practice rules. Removing or splitting the three biggest columns often halves a model.

<div class="meaning">

<dl>
<dt>Import mode</dt><dd>Data copied and compressed into the model; fast visuals, refreshed after each load.</dd>
<dt>Query folding</dt><dd>Power Query steps turned into one SQL query that the warehouse runs.</dd>
<dt>Cardinality</dt><dd>The number of distinct values in a column; the main driver of model size.</dd>
<dt>PBIP</dt><dd>A Power BI project saved as text folders, so it lives in git like code.</dd>
<dt>Physical meaning</dt><dd>A 1.2 GB model takes 40 minutes to refresh and times out on busy mornings. Removing the order ID and splitting one timestamp in dbt brings it to 380 MB and 9 minutes, and the 08:00 dashboard is on time again.</dd>
</dl>

</div>

<div class="myth">

**"A model with more rows is always bigger."** A 50-million-row column with four distinct values can be smaller than a 5-million-row column of unique IDs. Look at distinct values per column first, then rows.

</div>

## 7. Try it

1. Install Power BI Desktop (free, Windows). Connect to your Azure SQL `mart` schema (or a local SQL Server container) with the read-only login, in **Import** mode, using `SqlServer` and `SqlDatabase` parameters.
2. Load `fct_order_lines`, `fct_restaurant_daily`, `dim_date`, `dim_restaurant`, `dim_menu_item`, `dim_channel`, plus the hotel `fct_bookings` from Project 3.
3. Set one-to-many single-direction relationships, mark the date table, turn off auto date/time, hide keys, add `_Measures`.
4. Check folding on each query. Add one step that cannot fold and watch *View Native Query* grey out. Remove it.
5. Run VertiPaq Analyzer in DAX Studio; screenshot the model size; remove or split the biggest column in dbt and compare.
6. Save as PBIP in a new repo `chain-dashboards/powerbi/`. Change one measure and look at the diff.

No Windows computer? Do steps 2, 5 and 6 on paper: list each column's distinct count with a SQL `count(distinct ...)` query and estimate which are expensive.

**What to check:** only mart tables are loaded; every query folds; you can name the three largest columns and what you did about them; the PBIP diff shows your measure change. Commit as `feat(powerbi): star model on the marts, PBIP format`.

<div class="keypoints">

- Import with a refresh after the load is the right default for a medium company; DirectQuery puts every click on the warehouse.
- Hand over marts only, one-to-many single-direction relationships, a marked date table, and slicing columns built in dbt.
- Keep Power Query thin so it folds; transformations belong in dbt.
- Model size follows distinct values per column: split timestamps, drop IDs, pre-aggregate. Keep the report in git as PBIP.

</div>
