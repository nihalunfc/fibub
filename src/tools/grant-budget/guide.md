---
name: Grant budget builder
num: 822
shelf: science
section: ethics-and-planning
title: "Research grant budget builder: personnel effort, fringe, raises, indirect costs and totals per year"
summary: "Build a multi-year research budget: people with salary, effort %, fringe rate and yearly raise, plus equipment, travel, consumables and other lines. Indirect costs on the base you choose, with exclusions and a cap. Totals per year, a chart, and CSV for Excel, PDF or Word. Every rate is yours to type."
status: live
ads: false
order: 822
icon: calculator
works: offline
updated: 2026-11-09
related: [data-management-plan, readability-checker]
sources:
  - "The arithmetic (salary x effort x yearly raise, fringe on salary, indirect costs on a base) is written by fibub and checked in the tests against an independent NumPy version on 300 random budgets."
  - "The page has no built-in rates for any funder or organisation: fringe, raise and indirect rates are all typed by the user. The example's numbers are made up."
flow:
  - { icon: resume, label: "People" }
  - { icon: wallet, label: "Costs" }
  - { icon: percent, label: "Indirect" }
  - { icon: table, label: "Totals" }
---

## What it does

Most grant applications ask for a budget broken down by year: who is paid and how much of their time, what you will buy, travel, and the indirect costs your organisation charges on top. This page does the arithmetic and keeps it consistent when you change a number:

- **Personnel.** For each person: the full-time yearly salary in year 1, the **effort** (the share of a full-time year this grant pays, such as 20 % or 50/50/100 % by year), the **fringe** (benefits) rate on salary and a **yearly raise**. Salary in year *y* = salary × (1 + raise)^(y − 1) × effort. The table also shows effort, and the CSV keeps every number.
- **Other direct costs.** Equipment, travel, consumables (supplies) and other lines, with an amount for each year.
- **Indirect costs** (also called overheads or F&A) at your rate, charged on **total direct costs**, **direct costs with exclusions**, **salaries only**, or **salaries and fringe**. With exclusions you can leave whole categories out of the base, mark single lines with **x** (such as tuition), and mark lines with **cap** so only the first part of them counts in the base over the whole grant (some agreements treat subawards this way).
- **Totals per year**: personnel, each category, direct costs, the indirect base, indirect costs and the grand total, with a stacked bar chart.

Nothing is preset: rates and rules differ by organisation and funder, so type the ones from your own agreement and check the official source.

## How to use it

1. Set the **number of years** (1 to 10) and, if you like, a **currency** label.
2. Type the **personnel** lines: `Postdoctoral researcher, 55000, 100, 30, 3`. A first line of column names is fine.
3. Type the **cost lines**: `travel, Conference trips, 3000, 3000, 4500`. You can also open a CSV or Excel file with the same columns.
4. Type the **indirect rate** (one value, or one per year like `50/52/54`) and choose what it is charged on.
5. Read the table and chart. *Download for Excel (CSV)* gives plain numbers (no thousands separators) that open straight in a spreadsheet; *Image*, *PDF* and *Word* make a report.

**Round every amount to whole units** rounds each salary, fringe, cost and indirect amount, as most budget forms ask, so the columns add up exactly. **Remember my numbers in this browser** is off at first; tick it to keep your budget here for next time.

## Worked example

The made-up example is a three-year project with a lead researcher at 20 % effort, a postdoc at 100 % and a graduate student at 50, 50 and then 100 %, fringe rates of 30 % and 10 %, and raises of 3 % and 2 %. Year 2 of the lead researcher is 90,000 × 1.03 × 20 % = **18,540**, plus 30 % fringe = 5,562.

Indirect costs are 50 % of direct costs with exclusions: equipment is left out, the student tuition line is marked **x**, and the partner lab subaward (30,000 in each of years 1 and 2) is marked **cap** with a cap of 25,000. The base is 147,400, 128,077 and 148,013, so indirect costs are 73,700, 64,039 and 74,007. The page shows **Total 715,236 over 3 years**: direct costs 503,490 and indirect costs 211,746.

## Tips

- Check whether your funder wants effort as a percent or in **person-months** (12 × effort for a calendar year).
- Raises often start on a fixed date, not at the start of each grant year; if so, enter a blended raise or type the salaries year by year as separate lines.
- Keep the CSV with your application files, so the justification and the form use the same numbers.

## FAQ

**Why is my indirect base smaller than my direct costs?** Under *direct costs with exclusions*, the categories you tick, lines ending in **x** and the part of **cap** lines above the cap are left out.

**Can I use a different rate each year?** Yes: type `50/52/54`. With fewer rates than years, the last one is used for the rest.

**Is my budget sent anywhere?** No. It is worked out on this page. It is kept in this browser only if you tick *Remember my numbers*.
