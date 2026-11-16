---
name: Residency days
num: 1778
shelf: money
code: T812
section: income-tax
title: "Tax residency day counter: 183 days and the US substantial presence test"
summary: "List your trips and count the days in each country for a calendar, UK or Indian tax year, with 183-day markers, the US substantial presence test and your Indian residency status."
status: live
ads: false
order: 1778
icon: calendar
works: offline
updated: 2026-11-16
related: [canada-income-tax, uk-income-tax, india-income-tax, us-paycheck]
sources:
  - "IRS, Substantial presence test: 31 days this year and current + 1/3 prior + 1/6 the year before >= 183 (irs.gov, checked 2026-11-10). gov.uk, Tax on foreign income, Residence: UK tax year 6 April to 5 April, 183-day automatic test, 16 and 46 day overseas tests (checked 2026-11-10). Income Tax Department of India, Residence in India chart: 182 days, or 60 days plus 365 days in the 4 earlier years (checked 2026-11-10). Income-tax Act, 2025, section 6 (tax years from 1 April 2026): 6(2)(a) 182 days; 6(2)(b) 60 days plus 365 days in the 4 earlier years; 6(3) and 6(4) replace 60 with 182 for a citizen leaving for a job abroad and for a citizen or person of Indian origin on a visit; 6(5) makes it 120 days when income other than foreign income is over Rs 15 lakh; 6(7) deemed resident citizen; 6(13) not ordinarily resident (Income Tax Department e-filing portal, Non-resident FAQs, and the Act; checked 2026-11-16; estimate, not legal or tax advice). Canada: the 183-day sojourner rule is from the CRA residency pages, which could not be opened when this was written, so check the official source."
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
5. For the Indian financial year, answer the few questions under **Indian residency status** to see whether you are resident, resident but not ordinarily resident (RNOR) or non-resident.

## What each setting does

- **Year type:** sets the start and end dates of the period counted.
- **Day counting:** "Arrival and departure days both count" suits the US, Canada and India. "Midnight" counts the arrival day but not the day you left.
- **Indian residency status:** your citizenship, whether you came on a visit or left for a job, Indian income over ₹15 lakh, tax liability elsewhere and two not-ordinarily-resident ticks. Days in the 4 earlier years come from your trips unless you type them.
- **Keep my trips on this device:** off by default. If ticked, your list is saved in this browser only, so you can add trips through the year. Untick it or press Clear all trips to remove it.

## Worked example

Suppose 100 days in the United States this year, 181 last year and 365 the year before. The test adds 100 + 181/3 + 365/6, which is about 221, and you were there at least 31 days this year, so the test is met. With 100 days this year and none before, the total is only 100, so it is not.

For India: a citizen visiting from abroad with 130 days this year, 400 days in the 4 earlier years and Indian income over ₹15 lakh meets the 120-day test, so is resident but not ordinarily resident. With income under ₹15 lakh the 60 days become 182, so the same visitor is non-resident.

## Tax residence and FEMA are different

Your income-tax status decides what India taxes. FEMA, the foreign exchange law, separately decides whether you are a "person resident outside India" who may hold NRE and FCNR(B) accounts; it looks at why you left or came (a job, business or an uncertain stay) rather than only at days, so the two can differ in the same year.

## FAQs

**Is 183 days the rule everywhere?** No. It is a common marker. The UK also looks at ties and the 16 and 46 day tests, India uses 182 days or 60 days plus 365 days over four years, and Canada looks mainly at ties to Canada. Check the official source.

**Do treaties matter?** Yes, a tax treaty can decide which country taxes you when two countries both say you are resident.

**Are my trips uploaded?** No. They stay in this page.
