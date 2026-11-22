---
title: Quality gates, quarantine and the data quality report
summary: 'Quarantine bad rows with reasons, run freshness, volume, schema, validity and referential checks, and flag odd volumes with a robust z-score.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Why use the median and MAD rather than the mean and standard deviation for volume checks?
    choices: ['They are faster to compute', 'Outliers such as a double load inflate the mean and standard deviation and hide the next anomaly', 'MAD is always smaller']
    ans: 1
    why: Robust statistics resist the very contamination you are trying to detect.
  - q: The freshness check could not connect to the manifest database. What status should it report?
    choices: ['pass', 'fail with observed = 0', 'unavailable, reported separately']
    ans: 2
    why: A check that could not run is neither a pass nor a zero. Say so.
  - q: What should happen to a row with an unknown menu_item_id?
    choices: ['Drop it', 'Map it to the closest item', 'Quarantine it with reason "unknown_item" so it can be replayed when the menu is updated']
    ans: 2
    why: New items often reach the tills before the menu table is updated. Replay fixes it later.
sources:
  - 'Leys, C., Ley, C., Klein, O., Bernard, P. and Licata, L. (2013), Detecting outliers: Do not use standard deviation around the mean, use absolute deviation around the median, Journal of Experimental Social Psychology 49(4), 764-766 https://doi.org/10.1016/j.jesp.2013.03.013'
  - 'Iglewicz, B. and Hoaglin, D. C. (1993), How to Detect and Handle Outliers, ASQC Quality Press (the modified z-score and the 3.5 cut-off)'
  - 'Dagster documentation: asset checks https://docs.dagster.io/'
  - 'dbt documentation: data tests https://docs.getdbt.com/'
---

**Module 2 · about 40 minutes · read first: 2.1, 2.5.** You'll be able to split rows into good and quarantined with reasons, write checks in the five families, flag unusual volumes with a robust z-score, and produce a daily data quality report with owners and runbook lines.

<div class="bigidea">A quality gate is airport security for rows: every row is checked against the same rules, anything doubtful is set aside with a note saying why (never thrown away), and the count of passengers in always equals the count out plus those held back.</div>

## 1. Why this matters

When a number is wrong, the first question is "did the checks catch it?". You want to be able to answer: "yes, here is the alert from 06:12, and the affected rows are in quarantine with a reason". That one sentence is what makes a BI team trusted.

## 2. The five families of checks

| Family | Question | Example |
|---|---|---|
| **Freshness** | Did today's data arrive on time? | The latest hotel file was received before 06:00 |
| **Volume** | Is the amount normal? | Till lines per restaurant are within the usual range |
| **Schema** | Same columns and types as the contract? | pandera strict mode (Lesson 2.1) |
| **Validity** | Are the values inside the rules? | `qty ≥ 1`, dates parse, channel is in the list |
| **Referential** | Do the keys exist in the reference data? | Every `menu_item_id` is on the menu |

On top of these come **reconciliation** checks (Module 6): totals that match the source's own control totals.

<div class="problem" data-problem="quality-gates-freshness"></div>

## 3. Quarantine, do not drop

```python
from datetime import datetime, timezone
import polars as pl

def split_valid(df: pl.DataFrame, menu_ids: list[str]) -> tuple[pl.DataFrame, pl.DataFrame]:
    reasons = pl.concat_str([
        pl.when(pl.col("order_ts").is_null()).then(pl.lit("bad_timestamp;")),
        pl.when(pl.col("qty") < 1).then(pl.lit("qty_lt_1;")),
        pl.when(~pl.col("menu_item_id").is_in(menu_ids)).then(pl.lit("unknown_item;")),
    ], ignore_nulls=True)
    df = df.with_columns(reject_reason=reasons)
    good = df.filter(pl.col("reject_reason") == "").drop("reject_reason")
    bad = df.filter(pl.col("reject_reason") != "").with_columns(
        quarantined_at=pl.lit(datetime.now(timezone.utc)))
    assert good.height + bad.height == df.height, "rows vanished at the gate"
    return good, bad
```

The quarantine table keeps every original column plus `reject_reason`, `src_file` and `quarantined_at`. A row can carry several reasons. When the source fixes the problem (the menu table gains the new item), you **replay** the quarantined rows through the gate.

<div class="steps" data-fig="quality-gates-gate">
<div class="step"><b>Six rows wait.</b> The rules: the time stamp parses, the quantity is at least 1, and the item is on the menu.</div>
<div class="step"><b>Rows 1 and 2.</b> Fries pass. The Shake row has <code>qty 0</code>, so it gets the reason <code>qty_lt_1</code> and goes to quarantine.</div>
<div class="step"><b>Rows 3 and 4.</b> The Taco passes. Row 4's item is not on the menu yet: reason <code>unknown_item</code>.</div>
<div class="step"><b>Rows 5 and 6</b> pass every rule and go to staging.</div>
<div class="step"><b>Count.</b> 6 in = 4 good + 2 quarantined. Nothing vanished, and when the new menu item is added, row 4 can be replayed.</div>
</div>

## 4. Volume anomalies, robustly

The mean and standard deviation are pulled around by the very outliers you are looking for. Use the **median** (the middle value) and the **MAD**, the median absolute deviation (the middle distance from the median), over the same weekday in recent weeks. The [Statistics course](/learn/courses/statistics/) explains both in depth.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a robust z-score measures how far a value is from typical, in units of typical spread, and outliers barely move it.

**Equation:**

```math
\tilde z = \frac{x - \operatorname{median}(X)}{1.4826 \cdot \operatorname{MAD}(X)}, \qquad \operatorname{MAD} = \operatorname{median}\big(|X_i - \operatorname{median}(X)|\big)
```

Flag `$|\tilde z| > 3.5$`. The 1.4826 makes the MAD comparable with the standard deviation for normally distributed data.

**Analogy:** astronomers measure the sky's background brightness with a median, because one bright star would ruin an average. Where it breaks: seasons and holidays. Compare like with like (same weekday, a holiday calendar), or you will flag every long weekend.

**Try it:** the last six Saturdays had 510, 498, 530, 505, 515 and 2,400 lines (one was a double load). Median? *(512.5.)* Would a mean-based check flag next Saturday's 1,020? *(Mean ≈ 826, standard deviation ≈ 772, z ≈ 0.25: no. Robust: MAD = 11, `$\tilde z$` ≈ 31: yes.)*
</details>

<div class="problem" data-problem="quality-gates-robust-z"></div>

## 5. Tools

- **pandera:** contracts in Python, next to the code (Lesson 2.1).
- **Great Expectations:** a large library of ready-made checks with generated documentation; more setup.
- **Soda Core:** checks written in YAML (`row_count > 0`, `missing_count(order_id) = 0`) that run against warehouses.
- **dbt tests** (Module 5) and **Dagster asset checks** (Module 3): checks where the pipeline runs. Most teams end up with these two plus a few pandera contracts at the edge.

<div class="meaning">

<dl>
<dt>Quality gate</dt><dd>The point where every row is checked against rules before it reaches staging.</dd>
<dt>Quarantine</dt><dd>A table of rejected rows with all their columns and the reasons, ready to be replayed.</dd>
<dt>Freshness</dt><dd>Whether data arrived by the agreed time.</dd>
<dt>Robust z-score</dt><dd>Distance from the median in units of MAD: a volume check that one bad day cannot fool.</dd>
<dt>Unavailable</dt><dd>The status of a check that could not run. Not a pass, not a zero.</dd>
<dt>Physical meaning</dt><dd>If a check fires every day, people stop reading all of them. So every alert has an owner and a runbook line ("if this fires, look for .partial files in the SFTP folder; if present, wait 30 minutes"); warnings go to a daily digest and only blockers wake someone; and noisy checks are tuned or deleted every month. A report that says "2 fails, 5 warns, 1 unavailable" with the fails first is one a manager will actually read.</dd>
</dl>

</div>

<div class="myth">

**"No alerts means the data is fine."** It may mean the checks did not run. A check that failed to connect, or had no data to look at, must report **unavailable**, shown separately, never folded into "pass". The same goes for missing data on a chart: unavailable is not zero.

</div>

## 6. Try it

1. Write `split_valid` for the till data and the grocery sales. Save quarantine to `data/quarantine/<source>/business_date=…/`.
2. Write each check as a small function that returns `{check, source, business_date, status (pass, warn, fail or unavailable), observed, expected, detail}`.
3. Freshness from the manifest; volume with a robust z per restaurant per weekday; schema from the contract; validity and referential from the quarantine counts.
4. Store every result in a `dq_results` table in DuckDB, one row per check per day.
5. Render `reports/dq_<date>.html`: a summary line ("2 fails, 5 warns, 1 unavailable"), then failures first, each with its runbook line.

Commit: `feat(dq): quarantine, five check families, robust volume anomalies, daily DQ report`.

**What to check:** the report shows store R107's four silent days (as fails or unavailable, not as zero sales) and the late hotel file as a freshness breach, and for every source rows in = good + quarantined.

## 7. Practice

1. A row has `qty = 0` and an unknown item. How many reasons does it get?
2. Why compare Saturdays only with Saturdays?
3. Name the check family: (a) the `price` column became text; (b) half the usual rows; (c) the hotel file arrived at 07:15.

<details>
<summary>Answers</summary>

1. Two: `qty_lt_1;unknown_item;`. Recording every reason saves a second round of fixes.
2. Restaurants sell very differently by weekday. Comparing a Saturday with a Tuesday would flag normal weekends as anomalies.
3. (a) schema; (b) volume; (c) freshness.
</details>

**New words:** *quality gate*, *quarantine*, *replay*, *freshness*, *volume check*, *referential check*, *median*, *MAD*, *robust z-score*, *runbook*, *unavailable*.

<div class="keypoints">

- Five families of checks: freshness, volume, schema, validity and referential (plus reconciliation later).
- Quarantine bad rows with every reason and all their columns; never drop them, and replay them when fixed.
- Flag volumes with a robust z-score (median and MAD) against the same weekday.
- Every alert has an owner and a runbook line; "unavailable" is reported separately from pass and from zero.

</div>
