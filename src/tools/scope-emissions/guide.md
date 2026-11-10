---
name: Scope emissions
num: 506
shelf: science
section: carbon-and-energy-accounting
title: "Scope emissions"
summary: "Build a small organisation's greenhouse gas inventory from activity rows (fuel, refrigerant leaks with your GWP, electricity, travel, commuting, purchased goods) times your own emission factors. Totals by scope and category, Scope 2 both location- and market-based, tonnes per employee and per million of revenue, year-on-year change, CSV in and out and a PDF or Word report."
status: live
ads: true
order: 506
icon: table
works: offline
updated: 2026-11-09
related: [carbon-footprint, lca-compare, tree-carbon, solar-pv-yield, lcoe-calculator, unit-converter, landfill-gas]
sources:
  - "Structure and scope definitions after the GHG Protocol Corporate Accounting and Reporting Standard (WRI/WBCSD, revised 2004), the GHG Protocol Scope 2 Guidance (2015) and the Corporate Value Chain (Scope 3) Standard (2011). The page uses the general definitions and category names only."
  - "No emission factors or GWP tables are built in. The example company and every number in it are made up, with rounded factors chosen only to show the sums."
  - "Arithmetic written by fibub and checked against pandas."
flow:
  - { icon: table, label: "Activities" }
  - { icon: sliders, label: "Factors" }
  - { icon: chart, label: "Scopes" }
  - { icon: calendar, label: "Year on year" }
---

## What it does

The **GHG Protocol** is the most widely used way for organisations to count their greenhouse gas emissions. It sorts them into three **scopes**:

- **Scope 1**: direct emissions from things the organisation owns or controls, such as gas boilers, company vans and refrigerant that leaks from air conditioning.
- **Scope 2**: emissions from making the electricity, heat, steam and cooling it buys. They are reported two ways: **location-based**, with the average factor of the grid where the energy is used, and **market-based**, with the factor of the supply actually contracted (a green tariff, a certificate, or else the residual mix).
- **Scope 3**: all other indirect emissions in the value chain, in 15 categories, such as purchased goods (1), waste (5), business travel (6) and employee commuting (7).

This page does the inventory arithmetic for a small business. Each **activity row** is amount × factor = kg CO₂e; for a refrigerant leak, the factor is the gas's global warming potential (GWP). It adds the rows up by year, scope and category, shows both Scope 2 totals, works out **intensity** (tonnes per employee and per million of revenue) and the **change from the year before**, and gives CSV and report downloads.

No factors are built in. Use the ones from your country's official sources, your supplier and the GWP values your rules name.

Estimate a household's share with the [[carbon-footprint|carbon footprint calculator]], and weigh up two products over their whole life with the [[lca-compare|life cycle comparison]].

## How to use it

1. Paste or type the rows: **year, type, description, amount, unit, factor, market factor**. *Open a file* reads a CSV, TSV or Excel sheet; *Add a row with a form* builds one row at a time and explains each type. The type is a short id such as `electricity`, `refrigerant` or `commuting` (see *Types, scopes and categories*).
2. For electricity and purchased heat, add a market factor if you have one. Left empty, the location factor is used in the market-based total and the page notes it.
3. Type employees and revenue for each year for the intensity lines.
4. Choose whether the headline total uses market- or location-based Scope 2.
5. Download the rows with their results, the summary table, or the report.

## Worked example

The made-up example is a small workshop with 12 staff in 2024 and 13 in 2025:

- 2024, Scope 1: 60,000 kWh gas × 0.2 + 5,000 L diesel × 2.7 + 2 kg refrigerant × GWP 2,000 = **29.50 t**.
- 2024, Scope 2: 80,000 kWh × 0.4 = **32.00 t** location-based; × 0.45 (a supplier factor) = **36.00 t** market-based.
- 2024, Scope 3: goods 45.00 t + waste 4.00 t + flights 6.00 t + commuting 14.40 t = **69.40 t**.
- 2024 total, market-based: **134.90 t**, or 11.24 t per employee and 67.45 t per million of revenue.
- In 2025 the business moved to a green tariff (market factor 0.05): Scope 2 market-based falls to 3.80 t and the total to **99.12 t**, **−26.5 %**. Location-based, the fall is only 5.1 %, because the grid itself changed little.

## Tips

- Report both Scope 2 figures; they answer different questions.
- Spend-based Scope 3 (money × factor) is a rough start. Replace the largest lines with supplier or activity data over time.
- Keep the same factor sources between years, or recalculate the earlier year, so the change reflects what you did rather than new factors.

## FAQ

**Is this a certified carbon calculator?** No. It follows the GHG Protocol's structure for learning and internal planning. A formal inventory sets boundaries, a base year, data quality checks and may need third-party verification.

**Which GWP should I use?** The one your reporting scheme names, usually from a specific IPCC assessment report. Type it as the factor of the refrigerant row.

**Why does the market-based total need a residual-mix factor?** Without contracts, the energy you buy is the part of the grid nobody claimed, which is usually more carbon-intensive than the grid average. Using the plain grid average would double count the green power others bought.
