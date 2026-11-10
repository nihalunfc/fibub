---
name: Sales tax
num: 1731
shelf: money
section: shopping
title: "Sales tax calculator: add or remove GST, HST, VAT and US sales tax"
summary: "Add tax to a price or take it out of a tax-inclusive total: Canada GST/HST/PST/QST by province, US state plus local sales tax, UK VAT, India GST with the CGST/SGST or IGST split, and Gulf VAT."
seoTitle: "Sales tax calculator: GST, HST, VAT, US sales tax"
status: live
ads: true
order: 1731
icon: percent
works: offline
updated: 2026-11-10
related: [percentage-calculator, tip-calculator, budget-calculator]
sources:
  - "Canada GST/HST by province (Nova Scotia 14% from 1 April 2025): CRA, GST/HST calculator (and rates), https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html (checked 2026-11-10)"
  - "PST: British Columbia 7% https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/pst ; Manitoba RST 7% https://www.gov.mb.ca/finance/taxation/taxes/retail.html ; Saskatchewan 6% https://www.saskatchewan.ca/business/taxes-licensing-and-reporting/provincial-taxes-policies-and-bulletins/provincial-sales-tax ; Quebec QST 9.975%, Revenu Québec, https://www.revenuquebec.ca/en/businesses/consumption-taxes/gsthst-and-qst/basic-rules-for-applying-the-gsthst-and-qst/tables-of-gst-and-qst-rates/ (all checked 2026-11-10)"
  - "US state rates (state level only, as of 1 July 2026): Tax Foundation, State and local sales tax rates, midyear 2026, https://taxfoundation.org/data/all/state/2026-sales-tax-rates-midyear/ (checked 2026-11-10; a research body, not a government source: check your state's revenue department)"
  - "UK VAT 20%, 5%, 0%: gov.uk, VAT rates, https://www.gov.uk/vat-rates (checked 2026-11-10)"
  - "India GST 5% / 18% / 40% from 22 September 2025: PIB, Recommendations of the 56th GST Council meeting, https://www.pib.gov.in/PressReleasePage.aspx?PRID=2163555 (checked 2026-11-10). 3% (gold, silver) and 0.25% (rough diamonds) special rates: estimate, check the official source"
  - "Gulf VAT: UAE 5% (tax.gov.ae), Saudi Arabia 15% (zatca.gov.sa), Bahrain 10% (nbr.gov.bh), Oman 5% (https://tms.taxoman.gov.om/portal/tax-rate) (checked 2026-11-10)"
flow:
  - { icon: wallet, label: "Price" }
  - { icon: flag, label: "Where" }
  - { icon: percent, label: "Tax rate" }
  - { icon: calculator, label: "Total" }
---

## What it does

Type a price and pick where you are. The calculator adds the right sales tax, GST or VAT to a pre-tax price, or takes the tax back out of a total that already includes it. It shows the price before tax, the tax, the total and, where a tax has parts, each part on its own line: GST and PST in Canada, state and local tax in the US, CGST and SGST in India. Everything is worked out in your browser.

For discounts and markups use the [[percentage-calculator]], and for a restaurant bill the [[tip-calculator]].

## How to use it

1. Pick the **region** tab: Canada, US, UK, India, Gulf or Any rate.
2. Type the **amount**.
3. Choose whether the amount is **before tax** (add tax) or **with tax** (take it out).
4. Pick the province, state, rate or country.

## What each option does

- **Canada**: each province's GST, HST, PST or QST. Quebec's QST is on the price before GST.
- **US**: the state's own rate, plus a box for your city and county rate, which can add several percent.
- **UK**: VAT at 20% standard, 5% reduced or 0% zero rate.
- **India**: GST at 5%, 18% or 40% since September 2025, plus 3% for gold. Within one state the tax is half CGST and half SGST; between states it is all IGST.
- **Gulf**: VAT in the UAE (5%), Saudi Arabia (15%), Bahrain (10%) and Oman (5%).
- **Any rate**: type your own.

## Worked example

A jacket costs $100 in Ontario. HST is 13%, so the total is **$113.00**. The other way round, a receipt total of $113 with 13% HST inside it was $100 before tax: 113 ÷ 1.13 = 100.

In India, ₹1,000 at 18% GST within one state adds ₹90 CGST and ₹90 SGST, so the total is ₹1,180.

## FAQs

**Why not just take 13% off the total?** Because the tax was worked out on the smaller pre-tax price. 13% of $113 is $14.69, not the $13 of tax inside it.

**Are the rates always right for my item?** Not always. Groceries, books, children's clothes and many services have lower rates or none. Check the official source.

**Is anything saved?** No. Nothing you type leaves the page. Not financial or tax advice.
