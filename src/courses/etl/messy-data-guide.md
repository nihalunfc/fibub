---
title: The messy-data field guide
summary: 'A field guide to the traps in every dataset: day-first dates, business days past midnight, broken encodings, Excel, micros, currencies and footers.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A restaurant order is stamped 2026-09-15 03:10 and the business day ends at 05:00. What is its business date?
    choices: ['2026-09-14', '2026-09-15', 'It depends only on the time zone']
    ans: 0
    why: Before the cut-off, an order belongs to the previous business day.
  - q: A CSV ends with the row "TOTAL,,,,8123.40". What is the best use of it?
    choices: ['Load it as a normal row', 'Remove it from the data, but check it equals your own sum', 'Use it instead of computing the sum']
    ans: 1
    why: The source handed you a control total. Use it as a free reconciliation check.
  - q: Why test date parsing with a day greater than 12?
    choices: ['Days above 12 are invalid', 'Only then does a day/month swap fail instead of silently giving a wrong date', 'Parsers are slower for big numbers']
    ans: 1
    why: 04/09 parses both ways. 13/09 parses only one way, so the test catches the wrong format.
sources:
  - 'Python documentation: Codecs and standard encodings (cp1252, utf-8-sig) https://docs.python.org/3/library/codecs.html'
  - 'Polars user guide: strings, temporal data and time zones https://docs.pola.rs/'
  - 'Microsoft Support: Date systems in Excel (support.microsoft.com)'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 3 (date dimension and fiscal or business calendars)'
---

**Module 2 · about 40 minutes · read first: 2.2.** You'll be able to fix day-first dates, time zones and business days that cross midnight, repair broken text encodings, read awkward Excel files, normalise money, and strip footer rows safely.

<div class="bigidea">Messy data is not random: the same dozen traps appear in every company, and once you can name them on sight, each one has a small, tested fix.</div>

## 1. Why this matters

Recognising these traps at a glance is a large part of what "experienced" means in data work. This lesson is a field guide, like a guide to birds: a picture of each trap, where it lives, and the fix. Every one of them is planted somewhere in the course data.

## 2. Dates and time

**Day first or month first?** `04/09/2026` is 4 Sept in Canada and UK style and 9 April in US style. Never let a parser guess. Set the format per source, and test with a date whose day is above 12.

```python
pl.col("sold_at").str.strptime(pl.Datetime, "%d/%m/%Y %H:%M")      # grocery emails: day first
```

**Time zones.** Store time stamps in UTC with the zone recorded, or as local time with an explicit zone column. Ontario switches between EST (UTC−5) and EDT (UTC−4), so one night a year has 23 hours and one has 25.

**Business day.** Restaurants and hotels stay open past midnight. In the course's restaurant data the business day runs 05:00 to 04:59, so an order at 01:30 on the 15th belongs to the 14th.

```python
.with_columns(business_date=(pl.col("order_ts") - pl.duration(hours=5)).dt.date())
```

Watch six orders change day when you move the line from midnight to 05:00:

<div class="steps" data-fig="messy-data-guide-business-day">
<div class="step"><b>Six orders</b> at one restaurant, from 19:30 on the 14th to 05:18 on the 15th, worth $42, $28, $35, $22, $18 and $31.</div>
<div class="step"><b>Calendar date:</b> split at midnight. The 14th gets $105; the 15th gets $71, including the two late-night orders at 01:24 and 04:12 that the night shift served.</div>
<div class="step"><b>Business date:</b> move the line to 05:00. Subtract 5 hours from each time stamp and take the date. Those two late-night orders slide back to the 14th.</div>
<div class="step"><b>Result.</b> The 14th now has $145 and the 15th $31. $40 of sales moved back to the night they belonged to, which is how the restaurant's own end-of-day report counts them.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a business day is the calendar day of a clock shifted back by the cut-off.

**Equation:**

```math
\text{bdate}(t) = \text{date}(t - c)
```

where `$c$` is the cut-off: 5 hours for this restaurant group, often 3 to 6 hours in hospitality, set by the night audit.

**Analogy:** a shift worker's "day" that starts when they clock in, not at midnight. Where it breaks: daylight-saving nights. A 23-hour business day has fewer hours of sales, so per-hour comparisons need the real length.

**Try it:** an order at 2026-09-15 04:20 with `$c = 5$` hours. Business date? *(2026-09-14.)* At 05:01? *(2026-09-15.)*
</details>

<div class="problem" data-problem="messy-data-guide-business-day"></div>

Press Run the checks, then switch checks off and lower the stop threshold.

<figure class="fig" data-fig="@data-dq-gate"><figcaption>Notice which bad rows slip through when a check is off, and when the gate stops the whole load.</figcaption></figure>


## 3. Text and encoding

- **Windows-1252 against UTF-8.** These are two ways of turning letters into bytes. `Jalapeño` written in Windows-1252 (cp1252) and read as UTF-8 becomes `Jalape�o`. Know the encoding per source, or detect it per file (the `charset-normalizer` library), and decode explicitly. One brand in the course data writes cp1252.
- **Byte-order marks.** An invisible character at the very start of some files sticks to the first column name. Read with `encoding="utf-8-sig"`.
- **Spaces and case in codes.** `" r104"` and `"R104 "` are the same store. Trim and upper-case codes in staging, once.
- **Numbers as text:** `"1,234.50"`, `"(12.00)"` for a negative, a `$` sign, `"-"` for zero.

## 4. Excel

Excel is a presentation format pretending to be a data format. Watch for header rows that are not on row 1, merged cells, several sheets, hidden rows, dates stored as **serial numbers** (a count of days from a starting date; in the default Windows system, day 1 is 1 January 1900), and formulas whose saved value is out of date.

```python
import polars as pl
df = pl.read_excel("sales_R104_20260914.xlsx", sheet_name="Sales", engine="calamine")   # fast Rust reader
```

## 5. Money

| Trap | Example in the course data | Fix |
|---|---|---|
| **Micros** | `spend_micros = 152340000` | Divide by 1,000,000 in staging and name it `spend` |
| **Mixed currency** | Some ad rows have `currency: USD` | Convert with a dated exchange-rate table; keep both the original and the reporting currency |
| **Refunds as negatives** | Grocery `qty < 0` in some files | Split into sales and refunds; never let them quietly cancel out |
| **Tax in or out** | Unknown until you ask | Write the rule in the contract, one per source |
| **Rounding** | Line totals and receipt totals differ by cents | Round at the level the source rounds at |

<div class="problem" data-problem="messy-data-guide-micros"></div>

## 6. Footers and junk rows

CSV exports from tills and accounting systems often end with blank rows and a `TOTAL` row. Drop rows whose key is empty, but **first check the total row against your own sum**. It is a free reconciliation check the source gave you.

<div class="meaning">

<dl>
<dt>Day first</dt><dd>Dates written day/month/year. Set the format per source; never let a parser guess.</dd>
<dt>Business date</dt><dd>The trading day a sale belongs to: the calendar date of the time stamp minus the cut-off.</dd>
<dt>Encoding</dt><dd>The rule that turns letters into bytes. Read a file with the wrong one and accented letters break.</dd>
<dt>Micros</dt><dd>Money stored as millionths of a unit, as whole numbers, to avoid rounding errors.</dd>
<dt>Control total</dt><dd>A total the source gives you, to check your own sum against.</dd>
<dt>Physical meaning</dt><dd>Write every fix as a named, tested function in one module (<code>clean/rules.py</code>), with a docstring that says which source and why: "till day ends at 04:59, confirmed with operations, 2 Sept 2026". A year later nobody will ask how a rule works; they will ask why it is there and whether it can go. The docstring answers that, and the test with the nasty example stops anyone breaking it.</dd>
</dl>

</div>

<div class="myth">

**"My dates parsed without errors, so they are right."** A day/month swap on 4 Sept gives a perfectly valid 9 April, with no error at all. Silent success is the danger. Test every date format with a day above 12, and check the range of dates you get (a month of September data should not contain April).

</div>

## 7. Try it

1. Create `clean/rules.py` with `parse_day_first`, `business_date(ts, cutoff_hours)`, `decode_bytes(b, source)`, `parse_money_text`, `micros_to_units` and `drop_footer_rows` (which also returns the dropped rows).
2. Write a test for each with the nasty case: 13/09 against 09/13, 04:59 against 05:00, cp1252 `ñ`, `"(12.00)"`, a `TOTAL` row.
3. Apply them to the till staging from Lesson 2.2: add `business_date`, decode the cp1252 brand's files correctly, and move `00/00/0000` rows into a rejects table.
4. Apply them to the grocery attachments: day-first dates, Excel reading, refunds split out, footer rows checked against their totals where present.
5. Compare revenue by calendar date and by business date for one restaurant. How much moves? Save the chart in `docs/`.

Commit: `feat(clean): tested cleaning rules for dates, encodings, money and footers`.

**What to check:** after decoding, searching the item notes for `Jalape` finds `Jalapeño` and never `Jalape?o` or `Jalape�o`; and the business-date chart shows late-night revenue moving to the previous day.

## 8. Practice

1. A grocery file has `qty = -2` on a row. What do you do?
2. An Excel date column shows `46279`. What is it?
3. Why keep the original amount and currency after converting to CAD?

<details>
<summary>Answers</summary>

1. It is a refund (or a correction). Keep it, but put it in a refunds measure so sales and refunds are both visible rather than netted silently.
2. An Excel serial date: a count of days from Excel's starting point. 46279 is 14 Sept 2026. Convert it with your reader's date option or a tested helper, then check the result lands in the expected month.
3. So anyone can check the conversion, redo it with a corrected rate, and report in either currency.
</details>

**New words:** *day first*, *UTC*, *business date*, *cut-off*, *encoding*, *byte-order mark*, *serial date*, *micros*, *control total*.

<div class="keypoints">

- Fix date formats per source and test with a day above 12; store time zones explicitly.
- Business date = calendar date of (time stamp − cut-off); late-night sales belong to the night before.
- Decode text with the source's real encoding, and trim and upper-case codes once in staging.
- Normalise money in staging (micros, currencies, refunds) and use footer totals as free checks.

</div>
