---
title: "Average cost vs FIFO: working out capital gains on shares"
summary: "How the cost of shares you sell is worked out by average cost or first in first out, why the two can differ, and how to check your sales year by year."
tools: [capital-gains, return-calculator, canada-income-tax, uk-income-tax]
updated: 2026-11-10
sources:
  - "Average cost (Canada's adjusted cost base) and first in, first out (FIFO) are standard ways to match sales with purchases. The worked example was run through the site's own calculation code."
  - "Canada's capital gains inclusion rate is 50% at the time of writing (canada.ca, Line 12700). Which method applies, and how gains are taxed, differs by country and can change. Check the official source, such as your tax authority."
---

When you buy the same share several times at different prices and then sell only some of it, a simple question gets tricky: what did the shares you sold actually cost? The [[capital-gains]] calculator answers it from a plain list of your trades. It works out the gain or loss on each sale and for each calendar year, by average cost or by first in, first out, and shows a taxable part using a share you can change. To see how well an investment did over time, use the [[return-calculator]]; to turn a taxable gain into tax, go on to the [[canada-income-tax]] or [[uk-income-tax]] calculator.

## What it is

A **capital gain** is what you get from a sale minus what the sold item cost you:

Gain = proceeds − cost

- **Proceeds** are quantity × sale price, minus any selling fee.
- **Cost** is what you paid for the shares being sold, including buying fees.

A negative result is a **capital loss**.

The tricky bit is the cost. There are two common rules:

- **Average cost** pools every share of the same name you still hold. The cost per share is the pooled cost divided by the pooled quantity. Canada calls this pooled figure the **adjusted cost base (ACB)**. After a sale, the pool shrinks but the average per share stays the same.
- **FIFO** (first in, first out) takes the oldest shares first. A sale uses up the earliest purchase, then the next one, and so on.

Over a whole holding, once everything is sold, both rules give the same total gain. They only split it differently between sales, which matters when the sales fall in different tax years.

The **taxable part** is the gain multiplied by a percentage. In Canada that percentage, the inclusion rate, is 50% at the time of writing. Set it to 100% to see the plain gain. The tool does not apply any tax rate.

## How to use it

1. In the big box, type or paste one line per trade: date (year-month-day), name, buy or sell, quantity, price, and fee if any. Lines can be in any order; the tool sorts them by date.
2. Choose your currency.
3. Choose the **Cost method**: average cost or FIFO.
4. Check the **Taxable share** percentage.
5. Read the four cards: total proceeds, total cost, net gain or loss, and taxable part. Below them, one table lists each sale and another adds them up by year.
6. Save the list of sales as a CSV file if you want to keep it.

## A worked example

Sam makes four trades in a share called XYZ:

```
2023-02-01, XYZ, buy, 50, 40, 10
2023-09-15, XYZ, buy, 150, 30, 10
2024-05-10, XYZ, sell, 120, 45, 10
2025-03-03, XYZ, sell, 80, 28, 10
```

The two buys cost 50 × 40 + 10 = 2,010 and 150 × 30 + 10 = 4,510, so 200 shares cost 6,520 in all. The first sale brings in 120 × 45 − 10 = 5,390; the second, 80 × 28 − 10 = 2,230.

**By average cost**, each share costs 6,520 ÷ 200 = 32.60.

- 2024 sale: cost 120 × 32.60 = 3,912, gain 5,390 − 3,912 = **1,478**.
- 2025 sale: cost 80 × 32.60 = 2,608, loss 2,230 − 2,608 = **−378**.

**By FIFO**, the first sale uses all 50 of the 2023 February shares (2,010) and 70 of the September ones (70 ÷ 150 × 4,510 ≈ 2,104.67).

- 2024 sale: cost ≈ 4,114.67, gain ≈ **1,275.33**.
- 2025 sale: the last 80 shares cost ≈ 2,405.33, loss ≈ **−175.33**.

Both methods give a net gain of 1,100 over the two years. But average cost puts about 202.67 more of the gain into 2024, and a matching extra loss into 2025. With a 50% taxable share, the 2024 taxable part is 739 by average cost and about 637.67 by FIFO.

## Where it is used

- **Checking a broker's statement:** brokers sometimes show a cost figure that is wrong after transfers between accounts. Rebuilding it from your own trades shows where they differ.
- **Planning a sale:** typing a sale you are thinking of making shows the gain before you place the order.
- **Several holdings at once:** each name is tracked on its own, so one list can cover a whole account.
- **Funds and other assets:** the same matching works for fund units or any item bought in lots, as long as the figures are in one currency.
- **Teaching:** switching the method on the same trades shows clearly why the choice of rule changes yearly results.

## Common mistakes

1. **Using the method your country does not allow.** Many countries set the rule. Canada uses average cost, for example. Check the official source before you rely on a figure.
2. **Leaving out fees.** Buying fees raise your cost and selling fees cut your proceeds. Skipping them overstates the gain.
3. **Mixing currencies.** The tool does not convert. Turn foreign trades into one currency at the right rate first.
4. **Forgetting splits and special rules.** Share splits, wash-sale or superficial-loss rules and similar adjustments are not applied. Adjust the figures yourself.
5. **Typing dates the wrong way round.** Use year-month-day, such as 2024-05-10, or the line will be rejected.

## Questions people ask

**Why do both methods give the same total?** Once every share is sold, all the cost has been used up either way. The methods only change which sale gets which part of it.

**Can I enter shares I sold short?** No. If a sale is larger than what you hold on that date, the tool stops and says so.

**Does a loss in one year cancel a gain in another?** That depends on your country's rules for carrying losses. The tool shows each year separately so you can follow them. Check the official source.

This article is general education, not financial or tax advice.
