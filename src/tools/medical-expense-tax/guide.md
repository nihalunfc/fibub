---
name: Medical expense tax helper
num: 1971
shelf: money
code: T846
section: medical-tax
title: "Medical expense tax credit and deduction calculator"
summary: "Add your medical costs and see the Canada credit (best 12 months), the US itemised deduction or the India 80DDB deduction, with sources and dates."
status: live
ads: false
order: 1971
icon: calculator
works: offline
updated: 2026-11-10
related: [medical-bill-checker, claim-packet, canada-income-tax]
sources:
  - "Canada: Canada Revenue Agency, lines 33099 and 33199, eligible medical expenses; fixed threshold $2,834 for the 2025 tax year, https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/lines-33099-33199-eligible-medical-expenses-you-claim-on-your-tax-return.html (checked 2026-11-10). The 2026 threshold was not confirmed, so the field is editable."
  - "Canada credit rates: lowest federal rate, as used by the Canada income tax calculator on this site (14.5% for 2025, 14% for 2026); check canada.ca."
  - "United States: IRS Topic 502, Medical and dental expenses, and Schedule A, https://www.irs.gov/taxtopics/tc502 (7.5% of AGI, checked 2026-11-10)."
  - "India: Income Tax Department, section 80DDB, https://www.incometax.gov.in/ (limit 40,000 rupees; 1,00,000 for senior citizens; checked 2026-11-10). Reduction by insurance reimbursement is from the rule text: check the official source."
  - "United Kingdom: no general relief for medical expenses (GOV.UK, checked 2026-11-10)."
flow:
  - { icon: flag, label: "Pick country" }
  - { icon: pencil, label: "Add costs" }
  - { icon: calculator, label: "See total" }
  - { icon: download, label: "Download" }
---

## What it does

Keep a list of your medical costs, then see how a tax rule would treat the total. For Canada it finds the best 12-month period, any 12 months that end in the tax year, takes off the lesser of 3% of net income or the fixed threshold, and applies the federal credit rate. For the United States it takes 7.5% of your adjusted gross income off the total. For India it applies the section 80DDB limit after insurance paid back. The UK has no general relief, and the tool says so.

It works out numbers from what you type. It does not say whether a cost qualifies: each country publishes its own list, and the sources are shown. Before you file, use the [[canada-income-tax]] calculator for the rest of your return, tidy the receipts with the [[claim-packet|claim packet builder]], and check a hospital bill with the [[medical-bill-checker]].

## How to use it

1. Pick the country.
2. Add each cost: date, person, what it was, the amount you paid, and what insurance paid back. Or open a CSV with those columns.
3. Fill in the figures for your country, such as net income or AGI.
4. Read the result and download a CSV or a PDF, Word or image summary.

## What each option does

- **Tax year and threshold (Canada)**: the threshold is $2,834 for 2025. It is editable because the 2026 figure is not confirmed. Check canada.ca.
- **Another dependant (Canada)**: switches the net income to that person's, since that claim is separate.
- **AGI (US)**: your adjusted gross income. The deduction only helps if you itemise.
- **Age 60 or older (India)**: uses the higher limit.

## Worked example

US: costs of 10,000 and AGI of 60,000. 7.5% of AGI is 4,500, so the itemised amount is 5,500. India, age 60 or older: costs of 1,20,000 less 20,000 from insurance is 1,00,000, which equals the limit.

## FAQs

**Can I claim this?** The tool cannot tell you. Check the official list and a tax professional.

**Is my data stored?** No. It is not saved anywhere unless you download it.

**What about health insurance premiums in India?** Those fall under another deduction and are not worked out here.

This is not tax, billing or legal advice.
