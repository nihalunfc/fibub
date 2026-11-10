---
title: "How to calculate straight-line depreciation (with a worked example)"
summary: "Take the cost, subtract what it will be worth at the end, and divide by its useful life in years. A worked example for a delivery van, with checks."
tools: [depreciation, break-even, percentage-calculator]
updated: 2026-11-10
sources:
  - "Standard accounting formula: annual straight-line depreciation = (cost − salvage value) ÷ useful life. Numbers worked with fibub's own depreciation code. Tax depreciation follows separate national rules."
---

Straight-line depreciation is the cost of an asset minus its expected value at the end (salvage), divided by the number of years you will use it. You charge that same amount every year. The [[depreciation]] calculator builds the full year-by-year schedule, and it can also show faster methods for comparison. To see how the yearly charge affects your prices, add it to your fixed costs in [[break-even]].

## What you need

- **Cost**: what you paid to get the asset ready to use. That usually includes delivery and set-up, not just the sticker price.
- **Salvage value** (also called residual value): what you expect to sell it for, or get as scrap, at the end. Zero is fine if you will run it into the ground.
- **Useful life in years**: how long the business will use it, not how long it could physically last.

One caution: the depreciation in your own accounts is not always the amount your tax authority allows. Tax systems use their own classes, rates and first-year rules, so check the official source for your country.

## Step by step

The formula:

**Yearly depreciation = (cost − salvage value) ÷ useful life**

The part being spread, cost minus salvage, is called the **depreciable amount**. Each year:

**Accumulated depreciation** = all the yearly charges so far

**Book value** = cost − accumulated depreciation

Book value falls by the same step each year and lands exactly on the salvage value at the end.

With the tool:

1. Open [[depreciation]] and choose your currency.
2. Type the **Cost** and the **Salvage value at the end**.
3. Leave **Method** on *Straight line* and enter the **Life in years** (1 to 100).
4. Read the three boxes (year 1 depreciation, total depreciation, book value at the end), the line chart of book value, and the **Schedule** table.
5. Press **Download CSV** to take the schedule into a spreadsheet or send it to whoever keeps your books.

The tool works in whole years. If you bought the asset partway through a year, your accountant may charge only part of a year in year one; the schedule here does not.

## A worked example

A small bakery buys a delivery van.

- Cost, including registration and racking: **32,000**
- Expected resale value after 7 years: **4,000**
- Useful life: **7 years**

Depreciable amount = 32,000 − 4,000 = 28,000.

Yearly depreciation = 28,000 ÷ 7 = **4,000 a year**.

| Year | Depreciation | Accumulated | Book value |
|---|---|---|---|
| 1 | 4,000 | 4,000 | 28,000 |
| 2 | 4,000 | 8,000 | 24,000 |
| 3 | 4,000 | 12,000 | 20,000 |
| 4 | 4,000 | 16,000 | 16,000 |
| 5 | 4,000 | 20,000 | 12,000 |
| 6 | 4,000 | 24,000 | 8,000 |
| 7 | 4,000 | 28,000 | 4,000 |

So the van costs the bakery 4,000 a year, or about 333 a month, before fuel, insurance and repairs. If the bakery spreads that over a year of deliveries, it becomes a fixed cost to cover in its prices.

For contrast, switch **Method** to *Declining balance* and leave the rate blank for double declining. Year 1 then jumps to about 9,142.86, because a falling balance front-loads the charge. Same van, same total over its life, very different first year.

## Check your answer

- **The last book value equals salvage.** Year 7 ends at 4,000, the resale value you entered. If it does not, the life or salvage was typed wrong.
- **Yearly charge × life = depreciable amount.** 4,000 × 7 = 28,000 = 32,000 − 4,000.
- **The rate is steady.** 4,000 is 12.5% of the 32,000 cost every year, which is the depreciable share (87.5%) divided by 7. The [[percentage-calculator]] makes this quick to confirm. A straight-line rate that changes from year to year means you are not on straight line.

## Questions people ask

**Why not just count the whole cost in the year I buy it?** Because the van earns money for seven years. Spreading the cost lines up the expense with the years it helps you, so one year does not look like a disaster and the next six look too good. Some tax systems do allow a large first-year write-off, which is a separate tax rule; check the official source.

**What if I sell the asset early?** Compare the sale price with the book value on that date. Getting more than book value is a gain; less is a loss. Your bookkeeper records it, and the tax treatment depends on where you are.

**Can land be depreciated?** Usually not in ordinary accounts, because land is not used up. Buildings on it are. This is general education, not accounting or tax advice.
