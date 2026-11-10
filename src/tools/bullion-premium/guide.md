---
name: Bullion premium
num: 1609
shelf: collecting
code: T729
section: metals
title: "Bullion premium calculator: compare gold and silver coins and bars"
seoTitle: "Bullion premium over spot calculator"
summary: "Compare coins and bars by price per pure gram and premium over spot. Enter what each dealer asks and see which gold or silver product is cheapest for the metal you get."
status: live
ads: false
order: 1609
icon: chart
works: online
updated: 2026-11-10
related: [melt-value, bullion-weights, auction-costs]
sources:
  - "Premium = (price asked − metal value) ÷ metal value, where metal value = pure weight × spot price. Price per pure gram = price ÷ (weight × fineness ÷ 1,000). Plain arithmetic."
  - "Spot prices: daily rates from the free exchange-api by Fawaz Ahmed (github.com/fawazahmed0/exchange-api, CC0 public domain), fetched by fibub's server every few hours, or a price you type. Troy ounce = 31.1034768 g."
flow:
  - { icon: currency, label: "Spot" }
  - { icon: coin, label: "Add items" }
  - { icon: percent, label: "Premium" }
  - { icon: check, label: "Cheapest" }
---

## What it does

Dealers sell coins and bars above the spot price of the metal. That extra is the premium. A small bar and a collector coin can look similar on a price list but cost very different amounts for the same amount of gold or silver.

Add the products you are comparing, each with its weight, fineness and the price you were quoted. The tool shows the price per pure gram and per pure troy ounce, the metal value at spot, and the premium over spot, sorted with the cheapest first. Work out what a piece is worth as metal with [[melt-value]], and convert odd units with [[bullion-weights]]. If you are bidding at an auction instead, the extra fees are in [[auction-costs]].

## How to use it

1. Choose your currency and, if you have a dealer's quote, type your own spot price.
2. Fill in the first row, then use **Add a product** for each other offer.
3. Read the table. The lowest premium is marked.

## What each setting does

- **Metal**: gold, silver, platinum or palladium. Each uses its own spot price.
- **Weight and unit**: the weight of the coin or bar. Use the pure-metal weight stated by the mint or dealer.
- **Fineness**: parts of pure metal per thousand (999.9 for most gold bars, 916.7 for 22 karat coins, 999 for silver).
- **Price asked**: the total price for one piece, in the chosen currency.

## Worked example

A 1 oz gold coin of 999.9 fineness is quoted at 4,200 when spot gold is 4,000 per troy ounce. The metal is worth 0.9999 × 4,000 = 3,999.60. The premium is 200.40 ÷ 3,999.60 = 5.0%. The price per pure troy ounce is 4,200.42.

## FAQs

**What is a normal premium?** It varies by product, size, dealer and market. Small bars and new coins usually cost more over spot than large bars. Compare several dealers rather than trusting one figure.

**Why compare per pure gram?** It removes the effect of size and fineness, so a 10 g bar, a 1 oz coin and a 22 karat piece can be lined up fairly. Only compare the same metal.

**Does a premium mean I can sell for more?** No. Buyers usually pay less than their selling price. Check the buy-back price too.

**Are the prices live?** The spot price is a daily rate, not a live tick, and may be a few hours old. Type your dealer's spot for a precise comparison.
