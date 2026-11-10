---
name: Residency days
num: 1778
shelf: money
code: T812
section: income-tax
title: "Tax residency day counter: 183 days and the US substantial presence test"
summary: "List your trips and count the days in each country for a calendar, UK or Indian tax year, with 183-day markers and the US substantial presence test."
status: live
ads: false
order: 1778
icon: calendar
works: offline
updated: 2026-11-10
related: [canada-income-tax, uk-income-tax, india-income-tax, us-paycheck]
sources:
  - "IRS, Substantial presence test: 31 days this year and current + 1/3 prior + 1/6 the year before >= 183 (irs.gov, checked 2026-11-10). gov.uk, Tax on foreign income, Residence: UK tax year 6 April to 5 April, 183-day automatic test, 16 and 46 day overseas tests (checked 2026-11-10). Income Tax Department of India, Residence in India chart: 182 days, or 60 days plus 365 days in the 4 earlier years (checked 2026-11-10). Canada: the 183-day sojourner rule is from the CRA residency pages, which could not be opened when this was written, so check the official source."
flow:
  - { icon: calendar, label: "Add trips" }
  - { icon: flag, label: "Pick year" }
  - { icon: calculator, label: "Count days" }
  - { icon: check, label: "See markers" }
---

## What it does

Many countries look at how many days you spend there when deciding whether you owe tax as a resident. This tool does the counting. List each stay with the country and the dates, choose the year type, and it adds up your days in every country, shows how far you are from the usual 183-day marks, and runs the United States substantial presence test over three years.

It only counts days. Once you have the numbers, estimate the tax with the [[canada-income-tax]], [[uk-income-tax]] or [[india-income-tax]] calculators.

## How to use it

1. Add each stay: country, the day you arrived and the day you left. Include time at home so there are no gaps.
2. Choose the year type: calendar year, UK tax year (6 April to 5 April) or Indian financial year (1 April to 31 March), and the year it starts.
3. Check how day counting works for your country. Most countries count both the arrival and departure day; the UK counts days you are there at midnight.
4. Read the table of days and markers, and the US test below it.

## What each setting does

- **Year type:** sets the start and end dates of the period counted.
- **Day counting:** "Arrival and departure days both count" suits the US, Canada and India. "Midnight" counts the arrival day but not the day you left.
- **Keep my trips on this device:** off by default. If ticked, your list is saved in this browser only, so you can add trips through the year. Untick it or press Clear all trips to remove it.

## Worked example

Suppose 100 days in the United States this year, 181 last year and 365 the year before. The test adds 100 + 181/3 + 365/6, which is about 221, and you were there at least 31 days this year, so the test is met. With 100 days this year and none before, the total is only 100, so it is not.

## FAQs

**Is 183 days the rule everywhere?** No. It is a common marker. The UK also looks at ties and the 16 and 46 day tests, India uses 182 days or 60 days plus 365 days over four years, and Canada looks mainly at ties to Canada. Check the official source.

**Do treaties matter?** Yes, a tax treaty can decide which country taxes you when two countries both say you are resident.

**Are my trips uploaded?** No. They stay in this page.
