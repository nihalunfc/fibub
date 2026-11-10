---
name: Coin counter
num: 1610
shelf: collecting
section: coins-notes
title: "Coin counter: count coins by weight or by hand and add up the value"
seoTitle: "Count coins by weight calculator"
summary: "Count a jar of coins by weighing it: type the weight of one coin and the total, and get the number of coins and their value. Or tally coins by hand. US, Canadian and UK presets."
status: live
ads: false
order: 1610
icon: calculator
works: offline
updated: 2026-11-10
related: [melt-value, bullion-weights]
sources:
  - "Number of coins = (total weight − container weight) ÷ weight of one coin, rounded to the nearest whole coin. Plain arithmetic."
  - "Preset coin weights are the issuing mints' published specifications (US Mint, Royal Canadian Mint, Royal Mint). Coins wear and specifications change over the years, so check the weight of your own coins."
flow:
  - { icon: coin, label: "Pick coin" }
  - { icon: scale, label: "Weigh" }
  - { icon: calculator, label: "Count" }
  - { icon: currency, label: "Total" }
---

## What it does

Counting a jar of coins one by one is slow. If you know what one coin weighs, you can weigh the lot and divide. This tool does that for several kinds of coin at once, rounds to the nearest whole coin, and multiplies by the face value to give the total. It also shows the unrounded figure, so you can see if the weights look right.

You can also count by hand: pick the coin, type how many you have, and get the value. Presets fill in current US, Canadian and UK coins with their published weights, and you can edit any row for other currencies. If the coins are old silver ones, find what the metal is worth with [[melt-value]], and convert odd weights with [[bullion-weights]].

## How to use it

1. Optional: choose a currency to fill in its coins. Set the symbol you want shown.
2. In **Count by weight**, weigh one kind of coin in its container, type that total, and the weight of the empty container.
3. Read the number of coins and the value. Add a row for each other kind.
4. Switch to **Count by hand** if you counted them yourself.

## What each setting does

- **Face value**: what one coin is worth (0.25 for a quarter).
- **One coin (g)**: the weight of one coin in grams.
- **Total weighed (g)**: the weight of everything on the scale.
- **Container (g)**: the empty jar or bag, taken off the total.
- **Currency symbol**: shown in front of the totals only.

## Worked example

A jar holds 1,250 g of 5 g coins, and the empty jar weighs 50 g. The coins weigh 1,250 − 50 = 1,200 g, and 1,200 ÷ 5 = 240 coins. At a face value of 0.25 each, that is 60.00.

## FAQs

**Why isn't my count a whole number?** Coins wear, and different years can differ slightly. The tool rounds to the nearest coin and warns you when the figure is not close to a whole number. Weigh a small known group of coins to get a better single-coin weight.

**Can I mix coin types in one weighing?** No. Weigh each kind separately, or the count will be wrong.

**Are the weights exact?** They are the mints' published figures for current coins. Older coins and some years differ, so type your own weights if you can.

**Is anything sent anywhere?** No. It runs in your browser and works offline once the page has loaded. Nothing is stored.
