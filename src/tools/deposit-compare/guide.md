---
name: Deposit compare
num: 2263
shelf: money
code: T999
section: interest
title: "NRE vs NRO vs FCNR deposit calculator: which leaves the most after tax"
summary: "Compare an NRE fixed deposit, an NRO fixed deposit and an FCNR(B) deposit for money held abroad, after Indian tax and a changing rupee."
status: live
ads: false
order: 2263
icon: bank
works: offline
updated: 2026-11-16
related: [fd-calculator, currency-converter, india-income-tax]
sources:
  - "Income Tax Department e-filing portal, Non-resident FAQs: NRE interest exempt under section 10(4)(ii) of the Income-tax Act, 1961 for a person resident outside India under FEMA, kept in Schedule IV of the Income-tax Act, 2025, which applies to tax years from 1 April 2026; eligibility follows FEMA status, not tax residence (incometax.gov.in, checked 2026-11-16)."
  - "FCNR(B) interest: exempt for a non-resident or a not ordinarily resident person under section 10(15)(iv)(fa) of the 1961 Act; the matching 2025 Act entry was not confirmed, so check the official source (checked 2026-11-16)."
  - "NRO interest: tax cut at source for non-residents under section 195 of the 1961 Act (section 393 of the 2025 Act) at 30% plus surcharge and 4% cess; a tax treaty rate can apply with a tax residency certificate and Form 10F. The tax rate is editable (checked 2026-11-16)."
  - "Interest maths: compound interest at the rate and frequency you choose; NRO tax is taken from each year's interest. Estimate, not legal or tax advice."
flow:
  - { icon: currency, label: "Amount" }
  - { icon: percent, label: "Rates" }
  - { icon: calculator, label: "Compare" }
  - { icon: check, label: "Best one" }
---

## What it does

If you live outside India and hold savings in dollars, dirhams or pounds, banks in India offer three kinds of deposit: an NRE fixed deposit (in rupees, interest tax-free in India), an NRO fixed deposit (in rupees, interest taxed in India), and an FCNR(B) deposit (kept in your own currency, interest tax-free in India while you are non-resident). Rupee rates are usually higher, but the rupee tends to fall, which eats into that gain when you convert back. This tool puts the three side by side in your currency and in rupees.

Check the bank's plain rupee figures with the [[fd-calculator]], convert amounts with the [[currency-converter]], and see your tax in India with [[india-income-tax]].

## How to use it

1. Pick your currency, the amount, today's rupee rate and the number of years.
2. Type the rates your bank offers for each deposit.
3. Set the tax on NRO interest and how much you expect the rupee to fall each year.
4. Read the table: the highlighted row leaves the most in your currency.

## What each setting does

- **Interest added:** how often interest is added (quarterly is usual for rupee deposits).
- **Expected rupee fall:** 2% means one unit buys 2% more rupees each year.
- **Tax on NRO interest:** 31.2% is 30% plus 4% cess; a treaty rate such as 10% or 15% can apply instead.

## Worked example

US$10,000 at ₹88, for 3 years, quarterly interest, rupee falling 2% a year (₹93.39 at the end). NRE at 6.5% grows to ₹10,67,799, about US$11,434, or 4.57% a year in dollars. NRO at 6.5% with 31.2% tax grows to ₹10,06,598, about US$10,779, or 2.53% a year. FCNR(B) at 4% grows to US$11,268, or 4.06% a year. NRE leaves the most; if the rupee fell 3% a year instead, the FCNR(B) deposit would come out ahead.

## FAQs

**Who can open these accounts?** A person resident outside India under FEMA. FEMA status depends on why you are abroad and for how long, not only on tax days, so check with your bank.

**Is NRE interest tax-free abroad too?** Not always. Your home country may tax it.

**What happens when I move back?** NRE accounts must be changed to resident accounts and their interest becomes taxable. An FCNR(B) deposit can run to maturity, and its interest stays tax-free in India while you are not ordinarily resident.
