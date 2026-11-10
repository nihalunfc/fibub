---
name: Melt value
num: 1601
shelf: collecting
section: metals
title: "Melt value calculator: silver and gold coins at today's price"
seoTitle: "Coin melt value calculator: silver and gold today"
summary: "See what the gold, silver or platinum in your coins, bars and jewellery is worth at today's spot price, or at a price you type. Includes common coins, tola and pavan."
status: live
ads: false
order: 1601
icon: coin
works: online
updated: 2026-11-10
related: [gold-purity, bullion-weights, bullion-premium, coin-check]
sources:
  - "Spot prices: daily rates from the free exchange-api by Fawaz Ahmed (github.com/fawazahmed0/exchange-api, CC0 public domain), fetched by fibub's server once every few hours. If they can't be loaded, rough built-in values are shown and labelled."
  - "Coin weights and fineness: the issuing mints' published specifications (US Mint, Royal Mint, Royal Canadian Mint, South African Mint, India Government Mint). Check your coin against its mint's figures."
  - "Troy ounce = 31.1034768 g and tola = 180 grains = 11.6638038 g (exact definitions)."
flow:
  - { icon: currency, label: "Price" }
  - { icon: coin, label: "Add coins" }
  - { icon: scale, label: "Weigh" }
  - { icon: calculator, label: "Metal value" }
---

## What it does

Melt value is what the pure gold, silver, platinum or palladium inside a coin, bar or piece of jewellery is worth at today's spot price. It is the floor under the price of most bullion coins and old silver coins, so it's the first number to know before you buy, sell or insure them.

This calculator takes the weight and the fineness (how much of it is pure metal), works out the pure metal, and multiplies by the spot price. It shows today's price in 22 currencies, and you can type your own price for any metal, for example the rate your local jeweller or dealer quotes. Check the fineness with [[gold-purity]], convert tola, grains or pennyweight with [[bullion-weights]], and see how much over metal value you are paying with [[bullion-premium]].

## How to use it

1. Pick your currency and whether you think in troy ounces or grams. Today's spot price for each metal is shown with its date.
2. To use your own price, type it in **Your price**. Leave it empty to use today's.
3. Add your pieces: choose a common coin from the list, or **Add your own** and type the weight, unit and fineness. Change **How many** for a roll or a bag.
4. Read the total and the pure metal per metal at the bottom.

## What each setting does

- **Currency**: the currency for prices and results. Rates are converted from US dollars with the same day's exchange rates.
- **Price per**: show and type prices per troy ounce or per gram.
- **Your price**: replaces today's spot price for that metal. Tick **Remember my prices** to keep it on this device; **Clear my prices** removes it.
- **Weight** and unit: grams, troy ounces, grains, pennyweight, tola or kilograms.
- **Fineness**: parts of pure metal per thousand. 999 is fine, 925 is sterling, 900 is old coin silver, 916.7 is 22 karat gold.
- **Remember my list**: keeps your list of pieces in this browser only. Untick it to delete it.

## Worked example

A Morgan dollar weighs 26.73 g and is 900 fine, so it holds 26.73 × 0.900 = 24.057 g of pure silver. That is 24.057 ÷ 31.1035 = 0.7734 troy ounces. At a silver price of 30 dollars an ounce, its melt value is 0.7734 × 30 = 23.20 dollars. Ten 90% dimes (2.5 g each) hold 0.7234 oz between them, worth 21.70 dollars at the same price.

## FAQs

**Why is a dealer's price different?** Spot is the wholesale price for large bars. Dealers add a premium when they sell and take a margin when they buy. Jewellers may also deduct making charges and wastage.

**My coin is worn. Does that matter?** Yes, a little. Worn coins weigh less than new ones. Weigh yours on a scale that reads to 0.01 g and type the real weight. Check it against the official figure with [[coin-check]].

**Is it worth more than melt?** Many coins are, because of their date, condition or rarity. This tool only works out the metal. Ask a dealer or a collectors' club for a collector's price.

**Where do today's prices come from?** From a free, public-domain daily rate file. fibub's server fetches it a few times a day; your browser only talks to fibub, and nothing about you is sent or kept. If the rates can't be loaded, the page says so and shows rough values. Type your own price then.

**Is my list sent anywhere?** No. The maths happens in your browser, and the list is only kept on this device if you tick the box.
