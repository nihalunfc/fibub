---
title: "How to add or remove GST, HST, VAT and sales tax from a price"
seoTitle: "Add or remove GST, HST, VAT and sales tax | fibub"
summary: "The maths behind adding tax to a price and taking it back out of a receipt total, with worked examples for Quebec, British Columbia, Texas, Saudi Arabia and India."
tools: [sales-tax-calculator, percentage-calculator, invoice-maker, unit-price]
updated: 2026-11-10
sources:
  - "Canada GST/HST rates: CRA, GST/HST calculator (and rates), canada.ca (checked 2026-11-10). PST: British Columbia 7% (gov.bc.ca); Quebec QST 9.975% (Revenu Québec) (checked 2026-11-10)."
  - "US state rates (state level only, as of 1 July 2026): Tax Foundation, State and local sales tax rates, midyear 2026 (checked 2026-11-10). A research body, not a government source: check your state's revenue department."
  - "Saudi Arabia VAT 15% (zatca.gov.sa, checked 2026-11-10). India GST 5%, 18% and 40% from 22 September 2025 (PIB, 56th GST Council meeting, checked 2026-11-10)."
  - "General education only, not tax advice. Rates and exemptions change: check the official source."
---

A price tag and a receipt can hide two different numbers: the price before tax and the total you actually pay. The [[sales-tax-calculator]] moves between them in either direction. It adds tax to a pre-tax price, or it takes the tax back out of a total that already includes it, and it splits the tax into its parts where a place charges more than one. It is useful for shoppers checking a receipt, freelancers pricing work and small shops filling in their books. The rates it uses were checked on 10 November 2026 against the CRA, provincial finance pages, Revenu Québec, the Tax Foundation's July 2026 table, gov.uk, India's PIB and the Gulf tax authorities, so check the official source for anything that matters. For a discount before tax, use the [[percentage-calculator]], and to bill a client with tax lines included, the [[invoice-maker]].

## What it is

Sales taxes go by many names: GST and HST in Canada, PST or QST in some provinces, sales tax in US states, VAT in the UK and the Gulf, GST in India. For a single item the maths is the same everywhere.

**Adding tax.** If **P** is the price before tax and **t** is the rate in percent:

- tax = P × t ÷ 100
- total = P × (1 + t ÷ 100)

**Removing tax.** If **T** is a total that already includes tax:

- P = T ÷ (1 + t ÷ 100)
- tax = T − P

The second pair is where people slip. The tax was worked out on the smaller pre-tax price, so you must divide by (1 + t ÷ 100). Taking t percent off the total takes off too much.

**Taxes with parts.** Where two taxes apply, such as GST plus PST, the tool adds the rates to find the total rate, works out the pre-tax price once, then charges each part on that same price. Each part has its own line in the table.

## How to use it

1. Pick the region tab: **Canada**, **US**, **UK**, **India**, **Gulf** or **Any rate**.
2. Type the **Amount**.
3. Under **This amount is**, choose **before tax (add tax)** or **with tax (take it out)**.
4. Choose the place or rate. Canada lists each province or territory with its taxes. The US lists each state's own rate and has a box for the **Local (city + county) rate %**. The UK has three VAT rates. India has the GST rates and a box for a sale between two states. The Gulf tab lists four countries. **Any rate** takes your own.
5. Read **Before tax**, **Tax** and **Total with tax**, then the table with one line for each part.

## A worked example

**Quebec, taking tax out.** A receipt in Montreal says 57.49 in total. Quebec charges GST 5% and QST 9.975%, a total rate of 14.975%.

- Before tax: 57.49 ÷ 1.14975 = **50.00**
- GST: 50.00 × 5% = **2.50**
- QST: 50.00 × 9.975% = **4.99**
- Check: 50.00 + 2.50 + 4.99 = 57.49

**British Columbia, adding tax.** A bike costs 250.00 before tax. GST 5% is 12.50 and PST 7% is 17.50, so the total is **280.00**.

**Texas, with a local rate.** Texas's state rate in the tool is 6.25%. If your receipt shows a city and county rate of 2%, type 2 in the local box. On 80.00, state tax is 5.00 and local tax is 1.60, so the total is **86.60** at 8.25%.

**Saudi Arabia, taking VAT out.** A bill of 230 SAR with 15% VAT inside it was 230 ÷ 1.15 = **200 SAR** before tax, with **30 SAR** of VAT.

**India, between two states.** An invoice of ₹2,360 at 18% GST, seller in one state and buyer in another: tick the box for different states. Before tax: 2,360 ÷ 1.18 = **₹2,000**, all of the **₹360** tax as IGST.

## Where it is used

- **Shopping**: check that a receipt charged the rate you expected, or compare a tax-inclusive price abroad with a pre-tax price at home. For pack sizes, compare with [[unit-price]] too.
- **Freelancing and small business**: quote a client a price before tax, then show the tax lines on the bill.
- **Bookkeeping**: split a pile of receipts into the price and the tax you may be able to claim back.
- **Travel**: see how much of a hotel or restaurant total in another country is VAT.
- **Teaching**: the forward and reverse formulas are a clean lesson in percentages.

## Common mistakes

1. **Taking the rate off the total.** 13% off 113.00 is 14.69, but the HST inside it is 13.00. Always divide.
2. **Forgetting local tax in the US.** The state list shows the state rate only. Cities and counties can add several percent, so type your local rate from a receipt or your state's revenue site.
3. **Assuming every item uses the standard rate.** Food, books, children's clothes and many services can be taxed at a lower rate or not at all. Check the official source for your item.
4. **Using the wrong Indian split.** Inside one state the tax is half CGST and half SGST. Between states it is all IGST. Tick the box only for a sale between states.
5. **Rounding each part too early.** Work from the full pre-tax price, then round the final lines, as the tool does.

## Questions people ask

**Why does Quebec show two tax lines?** Quebec charges GST and QST separately, both on the price before tax, so the tool lists each one.

**Do Qatar and Kuwait appear in the Gulf tab?** No. The tool notes that they have no VAT yet.

**Can I use it for several items at once?** Type the sum of the pre-tax prices, if they all share one rate. Items at different rates need one sum per rate.

**Is anything I type saved?** No. All the sums happen in your browser.
