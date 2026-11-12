---
name: On-road price
num: 1800
shelf: vehicles
code: T890
countries: [india, canada, usa]
section: vehicle-buying
title: "On-road price calculator: car and bike road tax, insurance, TCS and out-the-door price"
summary: "Turn an ex-showroom or sticker price into the full on-road (out-the-door) price for a car or two-wheeler in India, Canada or the US, itemised, with the loan you need after the down payment."
status: live
ads: true
order: 1800
icon: calculator
works: offline
updated: 2026-11-10
related: [car-loan, sales-tax-calculator, lease-vs-buy]
sources:
  - "India TCS: 1% on a motor vehicle worth over 10 lakh rupees, section 206C(1F), Income Tax Department (incometaxindia.gov.in). Checked 2026-11-10, check the official source."
  - "India road tax: set by each state's motor vehicles taxation law, by price slab, fuel and owner. The state rates in the tool are rough estimates for a petrol vehicle, not confirmed on each state's site; type the rate from your dealer or state transport department."
  - "Canada GST/HST: Canada Revenue Agency rate table (canada.ca, GST/HST calculator and rates, from 1 April 2025: Ontario 13%, Nova Scotia 14%, New Brunswick, Newfoundland and Labrador and PEI 15%, elsewhere 5% GST). PST/QST rates are the general provincial rates (estimate for vehicles). Checked 2026-11-10, check the official source."
  - "US: sales tax on vehicles is set by each state and locality; the 7% default is only a placeholder."
flow:
  - { icon: coin, label: "Price" }
  - { icon: percent, label: "Taxes" }
  - { icon: table, label: "Itemised" }
  - { icon: bank, label: "Loan" }
---

## What it does

The price on the advert is rarely what you pay. In India the ex-showroom price leaves out road tax, registration, insurance and a FASTag; in Canada and the US the sticker price leaves out freight, fees and sales tax. This calculator adds each one, shows every line, and gives the total you hand over before you drive away.

Pick a car or a two-wheeler and where you are buying. Every rate is editable, so you can match your dealer's quote line by line. Once you know the total, [[car-loan]] works out the monthly payment on what you borrow, [[lease-vs-buy]] compares it with a lease, and [[sales-tax-calculator]] handles tax on anything else.

## How to use it

1. Choose the vehicle and the country.
2. In India, pick your state and type the ex-showroom price. In Canada pick the province; in the US type your combined sales tax rate.
3. Fill in the fees from the dealer's quote. Leave a box at 0 if it does not apply.
4. Type your down payment to see the loan amount.

## What each setting does

- **Road tax**: a one-time (lifetime) tax most Indian states charge as a percent of the ex-showroom price. The state list fills in a rough rate; the vehicle switch changes it for two-wheelers.
- **TCS**: dealers must collect 1% tax at source on a vehicle over 10 lakh. It is not a cost in the end: it shows in your tax credit statement and counts against your income tax.
- **Registration and smart card, FASTag, insurance**: type the figures on your quote. First-year insurance usually includes the compulsory third-party cover.
- **GST/HST and PST/QST**: Canadian taxes on the price, freight and dealer fees. Choosing a province fills them in.
- **Tax only on price minus trade-in** (US): most states tax the price after the trade-in; some tax the full price.

## Worked example

An 8,00,000 car in a state with 10% road tax: road tax 80,000, registration 1,000, insurance 30,000 and FASTag 500 make an on-road price of 9,11,500. In Ontario, a 30,000 car with 2,000 freight at 13% HST is 32,000 + 4,160 = 36,160 out the door.

## FAQs

**Why is my state's rate different on the dealer's quote?** Road tax depends on the price slab, fuel (electric vehicles often pay little or none), and whether a company or a person owns the vehicle. Type the dealer's rate.

**Can I skip the dealer's accessories or extended warranty?** Usually yes. Set them to 0 here to see the saving.

Not tax advice; check the official source and the written quote.
