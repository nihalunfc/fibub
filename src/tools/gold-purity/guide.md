---
name: Gold purity
num: 1607
shelf: collecting
section: metals
title: "Gold purity: karat to fineness and per cent, with today's price per gram"
seoTitle: "Gold karat to fineness and per cent converter"
summary: "Convert gold karat to fineness (916, 750, 585) and per cent pure, and see what each karat is worth per gram, per 10 grams and per tola at today's gold price."
status: live
ads: false
order: 1607
icon: percent
works: online
updated: 2026-11-10
related: [melt-value, bullion-weights, specific-gravity]
sources:
  - "Karat is parts of pure gold out of 24, so fineness = karat ÷ 24 × 1,000 (exact arithmetic; 24 karat is pure)."
  - "Gold price: daily rates from the free exchange-api by Fawaz Ahmed (github.com/fawazahmed0/exchange-api, CC0 public domain), fetched by fibub's server every few hours, or a price you type. Tola = 11.6638038 g."
flow:
  - { icon: sliders, label: "Purity" }
  - { icon: currency, label: "Price" }
  - { icon: scale, label: "Per gram" }
  - { icon: check, label: "Compare" }
---

## What it does

Gold is sold by purity, but the same purity is written three ways: karat (22k), fineness (916) and per cent (91.6%). This tool converts between all three as you type, so a stamp on a ring or a line on a dealer's quote makes sense at once.

It also lists the common karats from 24 down to 9, and works out what the gold in each is worth per gram, per 10 grams and per tola at today's gold price or one you type. Weigh a piece on a scale, then use [[bullion-weights]] for grams, tola or grains and [[melt-value]] for the total metal value of a whole piece.

## How to use it

1. Type a karat, a fineness or a per cent. The other two boxes fill in.
2. Pick your currency in the price box. Type your own gold price if you have a quote.
3. Read the table: the highlighted row matches the purity you typed.

## What each setting does

- **Karat**: how many parts out of 24 are pure gold. 24 is pure, 18 means three quarters.
- **Fineness**: parts per thousand, as stamped on hallmarks (750, 916, 999).
- **Per cent**: the same figure as a percentage.
- **Currency and Price per**: the currency and whether you think in troy ounces or grams.
- **Your price**: replaces today's price. Tick Remember to keep it on this device only.

## Worked example

22 karat is 22 ÷ 24 = 0.91667 pure, so 916.7 fineness and 91.67%. If gold is 100 per gram, a gram of 22 karat jewellery holds 91.67 worth of gold, 10 g holds 916.67, and a tola (11.6638 g) holds about 1,069.

## FAQs

**Why does 22k say 916 and not 916.7?** Hallmarks round it. The exact value is 916.67. Likewise 14k is exactly 583.3 but is usually stamped 585, and 18k is exactly 750.

**Is this what a jeweller will pay me?** No. This is the value of the pure gold only. Buyers deduct their costs, and sellers may add making charges. Always get a dealer's quote.

**Can this tell me if my piece is really that karat?** No. It only converts numbers. To check a piece, weigh it in water with [[specific-gravity]] and compare, and if it's far off, ask a jeweller or an assay office to test it.

**Where does the price come from?** A free public daily rate file, fetched by fibub's server. Nothing about you is sent or kept. If it can't load, rough values are shown and labelled, so type your own price.
