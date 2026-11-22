---
title: Reconciliation, the skill that earns trust
summary: 'When two numbers disagree, bridge one to the other with evidenced steps, find the residual, and add a daily control-total check so it never hides again.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: What is the most common cause of "your number does not match mine"?
    choices: ['Different definitions (tax, refunds, fees) or timing (business date against calendar date)', 'Database corruption', 'A bug in the BI tool']
    ans: 0
    why: Definitions and timing explain most gaps. Genuine data errors are rarer, which is why you bridge before you blame.
  - q: 'A = 50,000. Steps: −6,500 tax, +400 refunds. B = 43,850. What is the residual?'
    choices: ['−50', '0', '+50']
    ans: 0
    why: '50,000 − 6,500 + 400 = 43,900. B − 43,900 = −50.'
  - q: Why must every bridge step be computed from data?
    choices: ['Plugging a step to close the gap makes the residual zero by construction and proves nothing', 'It is faster', 'Finance requires SQL']
    ans: 0
    why: Evidence for each step is what turns a bridge into a proof. A plugged number hides the real problem.
sources:
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley (audit dimensions and data quality)'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 2 (data management and data quality)'
  - 'Dagster documentation: asset checks https://docs.dagster.io/'
---

**Module 6 · about 40 minutes, plus the lab · read first: [2.6](/learn/courses/etl/quality-gates/), [5.6](/learn/courses/etl/metrics-semantic-layer/), [5.7](/learn/courses/etl/proof-restaurant-dbt/).** You'll be able to rebuild a reported number from raw data, bridge two different totals with evidenced steps and a waterfall chart, run a calm "the numbers don't match" investigation, and turn what you learn into an automatic daily check.

<div class="bigidea">When two numbers disagree, do not defend either: walk from one to the other in measured steps, and whatever is left over is the real problem.</div>

## 1. Why this matters

Sooner or later a store manager says "your number is wrong". A junior defends the dashboard. A senior says "let's bridge it", and twenty minutes later shows exactly which part of the difference is definition, timing, scope or a genuine error. That skill is what makes managers trust a data team, and it is the best interview story you can have.

A bridge is like checking a shop till at closing time. The till says $1,200, the cash drawer holds $1,150. You do not argue; you list the card payments, the refund slip, the float you started with, and see what is left. If $0 is left, the till is fine. If $20 is left, now you know exactly what to look for.

## 2. Why two totals differ

Almost every difference is one of these, in roughly this order of how often it happens:

1. **Definition:** gross or net; with or without tax, tips, delivery fees, refunds, staff meals.
2. **Timing:** business date, posting date or calendar date; the 05:00 cut-off; late files; provisional figures.
3. **Scope:** which stores, hotels or campaigns; new or closed sites; test transactions; currency.
4. **Data errors:** duplicates, missing files, a bad join (fan-out), quarantined rows.
5. **Rounding:** per line, per receipt or per day.

Press Next day, then Load changes, then Re-run same load with each write mode.

<figure class="fig" data-fig="@data-watermark-load"><figcaption>Notice that the watermark limits what is copied, and that MERGE is safe to repeat while a blind APPEND makes duplicates.</figcaption></figure>


## 3. The bridge

Start from number A, apply each explained difference as a step, and arrive at number B. What is left unexplained is the residual: the real problem.

| Step | Amount | Evidence |
|---|---|---|
| Store system: September sales, store R104 | $412,880 | The manager's report |
| − Sales tax included in the store figure | −$47,500 | Tax lines in the store export; the store report includes tax |
| − Sales from 23:00 to 01:00 on 30 Sept booked to 1 Oct by the business-day rule | −$1,240 | A query on `fct_order_lines` by `order_ts` |
| + Refunds the store nets out; the BI figure is before refunds | +$2,150 | Refund rows in the refunds table |
| − Duplicate email batch on 14 Sept, ignored by BI | $0 | The landing manifest shows it was correctly skipped |
| **Explained BI figure** | **$366,290** | |
| BI dashboard | $366,140 | |
| **Residual** | **−$150** | Two receipts in quarantine with bad timestamps |

<div class="steps" data-fig="reconciliation-waterfall">
<div class="step"><b>Start.</b> The store system says $412,880 for September. Before touching anything, write down what it includes: tax, calendar dates, refunds netted.</div>
<div class="step"><b>Tax.</b> The store figure includes sales tax; the dashboard does not. The tax lines sum to $47,500. Running figure: $365,380.</div>
<div class="step"><b>Timing.</b> Late-night sales on 30 September belong to 1 October under the 05:00 business-day rule: $1,240. Running figure: $364,140.</div>
<div class="step"><b>Refunds.</b> The store subtracts refunds; the dashboard shows sales before refunds: add back $2,150. Explained figure: $366,290.</div>
<div class="step"><b>Residual.</b> The dashboard shows $366,140. The $150 left over is traced to two receipts sitting in quarantine. That is a data issue with a named cause, and the rest is definitions.</div>
</div>

Draw it as a **waterfall chart**; finance people read waterfalls naturally. Power BI has a waterfall visual, and matplotlib can draw one in a few lines.

<div class="problem" data-problem="reconciliation-residual"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a bridge splits a difference into separate, separately evidenced parts; what is left over is the test.

**Equation:**

```math
B - A = \sum_k \Delta_k + \varepsilon
```

Each step `$\Delta_k$` must be computed from data, never worked out from the gap. You are done when `$|\varepsilon|$` is below a materiality threshold agreed with finance (for example 0.1 % of `$A$`) or traced to named rows.

**Analogy:** an energy budget in a physics experiment. You measure the known losses (friction, heat) separately; whatever energy is still missing tells you whether something unknown is going on.

**Where it breaks:** if you "explain" a step by plugging in whatever closes the gap, `$\varepsilon$` is zero by construction and proves nothing.

**Try it:** A = $100,000; steps −$12,000, +$800, −$300; B = $88,400. Residual? (100,000 − 12,000 + 800 − 300 = 88,500; residual −$100.)
</details>

## 4. The investigation routine

1. **Restate** the question exactly: which number, which report, which filters, which dates, which version.
2. **Reproduce** both numbers yourself from their sources. Save the queries and results in `evidence/`.
3. **Bridge** from one to the other, biggest suspected step first.
4. **Classify** each step and the residual: definition, timing, scope, data error.
5. **Report** in writing: the bridge table, which steps are definition choices (they need a business decision), which are bugs (they need a fix and a test), and who owns each.
6. **Prevent**: add a reconciliation check so this kind of difference is caught automatically next time.

Never say "the data is right" before the bridge is done, and never say "the data is wrong" before it is done either. Use "**not yet checked**" for any step without evidence. Keep a **reconciliation log** in the repo (date, question, outcome, cause, fix). After six months it is a map of where your platform is fragile.

## 5. Make it automatic: control totals

The pipeline engineer's version of a bridge runs every morning without anyone asking. Compare each source's own total (the till system's end-of-day report, the hotel's night audit, the ad platform's billing) with your warehouse, and fail loudly when they drift apart:

```python
@dg.asset_check(asset=dg.AssetKey(["fct_restaurant_daily"]), blocking=True)
def control_totals_match(context, warehouse: WarehouseResource) -> dg.AssetCheckResult:
    rows = warehouse.query("""
        select c.business_date, c.restaurant_id, c.source_total, f.net_sales,
               abs(c.source_total - f.net_sales) as gap
        from ops.pos_control_totals c
        join mart.fct_restaurant_daily f using (business_date, restaurant_id)
        where c.business_date = current_date - 1
          and abs(c.source_total - f.net_sales) > 0.001 * c.source_total   -- 0.1 % materiality
    """)
    return dg.AssetCheckResult(passed=len(rows) == 0, metadata={"failing": len(rows)})
```

The source total must use the same definition as your figure (for example, both before tax), or the check compares apples with oranges. Write that definition down next to the check.

For executive and finance reports add **certification**: a named owner, the semantic model marked *Certified* in Power BI, the daily control-total check, and a rule that a changed definition needs the owner's sign-off, recorded in the metric dictionary.

<div class="meaning">

<dl>
<dt>Bridge</dt><dd>A list of evidenced steps that takes one number to another.</dd>
<dt>Residual</dt><dd>What is left after every evidenced step; the part still to investigate.</dd>
<dt>Materiality</dt><dd>The size of gap small enough to accept, agreed with finance in advance.</dd>
<dt>Control total</dt><dd>A source system's own total, compared with the warehouse every day.</dd>
<dt>Physical meaning</dt><dd>A store manager challenges September sales in a meeting. Twenty minutes later you show a one-page bridge: tax, timing and refunds explain all but $150, and the $150 is two quarantined receipts. The meeting moves on to the business, and the manager trusts the next number you show.</dd>
</dl>

</div>

<div class="myth">

**"A difference means one of the numbers is wrong."** Most of the time both are right under different definitions. The bridge shows which definitions differ, and that is often a business decision (which figure goes on the executive page), not a bug.

</div>

## 6. Try it

1. Make a "store-reported" September figure for R104: a CSV that includes 13 % sales tax, nets refunds, uses calendar dates and counts one re-sent email twice. Ask an AI assistant to generate it from your raw data with those rules, and do not read the script until you finish.
2. Reproduce both numbers with saved queries. Build the bridge table and reach a residual under $50, or trace it to rows.
3. Draw the waterfall in Power BI or matplotlib.
4. Write `docs/reconciliation/2026-09-R104.md` following the six-step routine.
5. Add the daily control-total check above as a blocking Dagster asset check, and make it fail once on purpose.

**What to check:** every bridge step has a query or file as evidence; no step was worked out from the gap; the control-total check blocks the report when you inject a missing file. Commit as `docs+feat(recon): R104 bridge, waterfall, and daily control-total check`.

<div class="keypoints">

- Two totals usually differ by definition, timing, scope, data errors or rounding, roughly in that order.
- A bridge goes from A to B in evidenced steps; the residual is what is left, and no step may be plugged.
- Follow the routine: restate, reproduce, bridge, classify, report, prevent.
- Turn each lesson into a daily control-total check that blocks the report when the source and warehouse drift apart.

</div>
