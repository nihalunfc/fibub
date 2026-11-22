---
title: Dimensional modelling and grain
summary: 'Model a business process as facts and dimensions at a declared grain, pick the right fact table type and catch fan-out before it doubles a dashboard.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: What should you decide first when you design a fact table?
    choices: ['The column names', 'The grain: what one row stands for', 'Which visuals the dashboard will use']
    ans: 1
    why: Every other choice (dimensions, measures, keys, tests) follows from the grain. Say it in one sentence before you write any SQL.
  - q: A hotel table holds room nights on the books for each stay date, as of each day. Which kind of fact table is it?
    choices: ['Transaction', 'Periodic snapshot', 'Factless']
    ans: 1
    why: One row per entity per snapshot date is a periodic snapshot. Its measure is semi-additive, so you never add it up across snapshot dates.
  - q: Revenue doubles after you add one join. What is the most likely cause?
    choices: ['Fan-out: the joined table has more than one row for some fact rows', 'Wrong data types', 'A missing index']
    ans: 0
    why: Joining to a table at a finer grain repeats fact rows. Check the grain of both sides of every join and compare SUM before and after.
sources:
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapters 1 to 3 (the four-step design, fact table types, the bus matrix)'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 8 (data modelling for analytics)'
  - 'DuckDB documentation: joins https://duckdb.org/docs/'
---

**Module 5 · about 35 minutes · read first: [2.5](/learn/courses/etl/duplicates-entity-resolution/), [4.3](/learn/courses/etl/loading-patterns/).** You'll be able to turn a business process into a star schema at a declared grain, choose between the four kinds of fact table, draw a bus matrix, and prove a join has not multiplied your rows.

<div class="bigidea">Before any column, say in one sentence what one row means: that sentence (the grain) decides every table, join and total that follows.</div>

## 1. Why this matters

Your pipeline from Modules 1 to 4 now lands clean, deduplicated rows in a warehouse every morning. Analysts can query it, but every one of them would write their own joins, and some of those joins would be wrong. **Dimensional modelling** (Ralph Kimball's method) shapes the warehouse into tables that are hard to misuse: one table of events with numbers, surrounded by small tables that describe them.

If you have done the Power BI course, you met the star schema from the report side in [Star schema: facts and dimensions](/learn/courses/power-bi/star-schema/). This lesson is the engineer's side: you build the star in the warehouse, so every tool on top (Power BI, Metabase, a notebook) gets the same correct shape for free.

Think of a library. The **fact table** is the loans ledger: one line per book borrowed, with the date and how many days. The **dimensions** are the catalogue cards: who the member is, what the book is, which branch. The ledger is long and thin; the cards are short and wide. You never copy the book's whole description onto each loan line; you write its catalogue number.

## 2. The four-step design

1. **Pick the business process.** "Customers order food", "guests book rooms", "we buy ads". A process, not a department or a report.
2. **Declare the grain.** One row = one order line, or one booking night, or one campaign per day. Write it as a sentence before you choose any column.
3. **Identify the dimensions.** The who, what, where and when that describe a row: date, restaurant, menu item, channel.
4. **Identify the facts.** The numbers measured at that grain: quantity, gross revenue, discount, food cost.

```text
            dim_date ─┐
     dim_restaurant ──┤
       dim_menu_item ─┼──► fct_order_lines   (grain: one line of one order)
         dim_channel ─┘      qty, gross_revenue, discount, food_cost
```

The grain sentence is the most useful line in the whole model. Put it in the table's description, word for word:

> *fct_order_lines: one row per line item on a till order, after removing re-sent batches; the business date uses the 05:00 cut-off.*

When someone asks for a column that does not fit the grain, such as an order-level delivery fee on a line-level table, the answer is a second fact table at order grain (`fct_orders`), not a trick that repeats or splits the fee across lines.

## 3. Four kinds of fact table

| Kind | Grain | Example | Add up over time? |
|---|---|---|---|
| **Transaction** | One event | An order line, an ad click, a booking created | Yes |
| **Periodic snapshot** | One thing per period | Stock per store per SKU per day; rooms on the books per stay date, as of each day | **No** (semi-additive) |
| **Accumulating snapshot** | One process, updated as it moves | A booking: created, confirmed, arrived, departed, with a date for each milestone | Mostly no |
| **Factless** | An event with no number | A promotion was active for item X on day Y; a store was open | Count the rows |

A transaction table is a diary: one entry per thing that happened. A periodic snapshot is a photo taken every evening: it shows the state, and you do not add photos together. An accumulating snapshot is a parcel tracking page: one line per parcel, with a box filled in at each stage.

<div class="problem" data-problem="dimensional-modelling-grain-snapshot"></div>

## 4. The bus matrix

Most companies run several processes. The **bus matrix** lists them as rows and the dimensions as columns, with a tick where they meet. A dimension used by several processes is **conformed**: the same keys and the same attributes everywhere, so you can put retail sales and restaurant orders on one page by date and location.

| Process | Date | Location | Product or menu item | Channel | Campaign | Guest |
|---|---|---|---|---|---|---|
| Retail sales | ✓ | ✓ (store) | ✓ (SKU) | | | |
| Restaurant orders | ✓ | ✓ (restaurant) | ✓ (menu item) | ✓ | | |
| Hotel bookings | ✓ (created, arrival) | ✓ (hotel) | | ✓ | | ✓ |
| Ad performance | ✓ | | | ✓ | ✓ | |

Build each conformed dimension once (`dim_date`, `dim_location`, `dim_channel`) and reuse it. Two teams with two date tables will one day disagree on what "week 1" means.

## 5. Fan-out: the silent double count

Joining a fact table to anything at a **finer** grain multiplies rows. Nothing errors. The numbers just grow.

<div class="steps" data-fig="dimensional-modelling-grain-fanout">
<div class="step"><b>The fact.</b> Three order lines: burger $10, fries $4, shake $5. Grain: one row per order line. SUM(revenue) = $19.</div>
<div class="step"><b>The other table.</b> <code>promotions</code> has one row per item per active promotion. The burger is in two promotions, the fries in one, the shake in none.</div>
<div class="step"><b>The join.</b> <code>left join promotions using (menu_item_id)</code>. The burger line finds two matches, so it comes out twice.</div>
<div class="step"><b>The damage.</b> Four rows. SUM(revenue) now says $29: ten dollars of sales that never happened, and no error message.</div>
<div class="step"><b>The fix.</b> Bring the other table to the fact's grain first (one row per item, with a promotion count or list), or keep it out of revenue queries. Three rows, $19 again.</div>
</div>

You can reproduce it in DuckDB in a minute:

```sql
create table lines as select * from (values ('L1','burger',10), ('L2','fries',4), ('L3','shake',5)) t(line_id, item, revenue);
create table promotions as select * from (values ('burger','combo'), ('burger','app10'), ('fries','combo')) t(item, promo);

select sum(revenue) from lines;                                   -- 19
select sum(revenue) from lines left join promotions using (item); -- 29: fan-out

-- fix: collapse the finer table to the fact's grain before joining
with promo_per_item as (select item, count(*) as promo_count from promotions group by item)
select sum(revenue) from lines left join promo_per_item using (item); -- 19
```

The guard is a habit: **know the grain on both sides of every join**, and test `count(*)` and `sum(measure)` before and after. In Lesson [5.4](/learn/courses/etl/dbt-basics/) that check becomes an automatic test.

<div class="problem" data-problem="dimensional-modelling-grain-fanout"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a measure can be summed along a dimension only if that dimension splits the events into groups that do not overlap. Otherwise it is semi-additive or non-additive.

**Equation:** a measure `$m$` is additive along dimension `$d$` when

```math
\sum_{v \in d} m(v) = m(\text{all})
```

Stock on hand is additive across stores (each unit sits in one store) but not across days: the same box is counted again every evening.

**Analogy:** mass and temperature. Pour two buckets together and the masses add, the temperatures do not. Revenue behaves like mass. Average check behaves like temperature. Stock behaves like mass across places and like a state across time.

**Try it:** a store's stock is 100 on Monday, 80 on Tuesday and 120 on Wednesday. Is the stock "for the three days" 300? (No. Use the last value, 120, or the average, 100, depending on the question.)
</details>

<div class="meaning">

<dl>
<dt>Grain</dt><dd>What one row stands for, said in a sentence: "one line of one order".</dd>
<dt>Fact table</dt><dd>The long table of events or states, holding numbers and keys to dimensions.</dd>
<dt>Dimension</dt><dd>A short, wide table that describes the who, what, where and when of a fact.</dd>
<dt>Conformed dimension</dt><dd>One dimension shared by several fact tables, with the same keys and attributes everywhere.</dd>
<dt>Fan-out</dt><dd>Rows multiplied by a join to a table at a finer grain.</dd>
<dt>Physical meaning</dt><dd>A finance manager compares last month's revenue on two dashboards built by two teams and finds a 7 % gap. One team joined to a promotions table and fanned out. With a grain sentence on every table and a before-and-after sum test, that dashboard would never have shipped.</dd>
</dl>

</div>

<div class="myth">

**"If the join runs without an error, the numbers are right."** SQL never warns you about fan-out. A join to a table with two rows per key quietly doubles those fact rows. The only defence is knowing the grain of both sides and checking totals before and after.

</div>

## 6. Try it

1. Write grain sentences for four tables of a restaurant group: order lines, orders (one row per order), daily restaurant sales (a periodic snapshot), and menu price history.
2. Draw the bus matrix for four businesses: a retailer, a restaurant group, a hotel group and an ad agency. Save it as `docs/bus-matrix.md` in a new repo called `restaurant-dbt` (you will build on it all module).
3. Sketch the star for the restaurant group: `fct_order_lines`, `fct_orders`, `dim_date`, `dim_restaurant`, `dim_menu_item`, `dim_channel`. Decide whether brand is its own dimension or an attribute of restaurant, and write one line saying why.
4. Run the DuckDB fan-out example above, then rebuild it with your own data from Module 2.
5. Design an accumulating snapshot for hotel bookings with a column per milestone date and two lag measures (lead time; days from booking to cancellation).

**What to check:** every table has a grain sentence; your fan-out query shows the inflated total and the fixed one; the bus matrix has at least three conformed dimensions. Commit as `docs: grain statements, bus matrix, star designs`.

**New words:** *grain*, *fact table*, *dimension*, *transaction fact*, *periodic snapshot*, *accumulating snapshot*, *factless fact*, *bus matrix*, *conformed dimension*, *fan-out*.

<div class="keypoints">

- Design in four steps: business process, grain, dimensions, facts. The grain sentence comes before any column.
- Transaction facts add up over time; periodic snapshots do not (use the last value or an average); factless facts are counted.
- Conformed dimensions, listed in a bus matrix, let different processes be compared on one page.
- Fan-out happens when you join to a finer grain. Check the grain of both sides and compare count and sum before and after.

</div>
