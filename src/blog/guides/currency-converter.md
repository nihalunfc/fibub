---
title: "How to convert currency and see what your bank really charges"
summary: "Turn an amount into 22 currencies at the daily mid-market rate, then test a bank, card or transfer offer to see how much of your money goes on its markup and fees."
tools: [currency-converter, trip-splitter, sales-tax-calculator]
updated: 2026-11-10
sources:
  - "Daily mid-market rates: the free exchange-api by Fawaz Ahmed (CC0), collected by fibub.com's own server, as named on the tool page."
  - "The rates in the worked example below are made up for teaching. They are not a real day's rates."
---

When money crosses a border, two numbers matter: its worth at a fair rate, and what arrives after the bank takes its share. The [[currency-converter]] gives you both. It is for anyone sending money to family, paying a bill abroad, buying travel cash or reading a foreign receipt. If you are sharing holiday costs in more than one currency, carry on with the [[trip-splitter]], and if a price abroad has tax added at the till, the [[sales-tax-calculator]] works out the final figure.

## What it is

Every currency has a price in terms of every other one. Banks quote two prices: a lower one when they buy a currency from you and a higher one when they sell it to you. The **mid-market rate** is the point halfway between them. With no profit built in, it is the best yardstick for an offer.

The tool keeps one daily rate for each currency, written as "how many units buy one US dollar". To go from currency A to currency B it divides by A's figure and multiplies by B's:

**rate (1 A in B) = B per dollar ÷ A per dollar**

So you never need a direct A-to-B quote; the dollar acts as a common middle step.

An offer from a bank or transfer service usually costs you in two ways. The first is a **markup**: their rate is a little worse than mid-market. The second is a **fee**, either a flat amount, a percent of what you send, or both. The tool takes the fees off first, converts the rest at their rate, and compares:

- **You get** = (amount − flat fee − amount × fee% ÷ 100) × their rate
- **Shortfall** = fair amount − you get
- **Rate gap** = (1 − their rate ÷ mid-market rate) × 100%

The shortfall shows the whole cost, while the rate gap shows the markup on its own.

## How to use it

1. Type the **Amount** and choose the **From** currency it is in.
2. Choose the **To** currency. The converted amount appears at once, with the one-unit rate both ways under it. Press **Swap** to turn the pair around (this also clears any offer rate or own rate you typed).
3. Open **Check a bank or transfer offer** and type **Their rate**, written as 1 From = this many To.
4. Add a **Fixed fee (From)**, a **Fee %**, or both, exactly as the offer lists them. The tool tells you what you get, how far short of the fair amount that is, and how far their rate sits below mid-market.
5. If the page could not load today's rates, or you are checking an old receipt, open **Use my own rate** and type the rate you know.
6. Scroll to the table to see the same amount in every currency, plus what one unit of each is worth in your From currency.

## A worked example

Say you are in the UK and need to send 2,000 GBP to the UAE. For this example, imagine the day's rates are 1 US dollar = 0.79 GBP and 1 US dollar = 3.6725 AED.

**Fair amount.** 1 GBP = 3.6725 ÷ 0.79 = 4.6487 AED. So 2,000 GBP is 2,000 × 3.6725 ÷ 0.79 ≈ 9,297.47 AED.

**The offer.** A service quotes 4.52 AED per GBP, charges a flat 10 GBP and takes 0.5% of the amount.

- The percent fee is 2,000 × 0.5 ÷ 100 = 10 GBP.
- Left to convert: 2,000 − 10 − 10 = 1,980 GBP.
- You get: 1,980 × 4.52 = 8,949.60 AED.
- Shortfall: 9,297.47 − 8,949.60 = 347.87 AED, which is 3.74% of the fair amount.
- Rate gap: (1 − 4.52 ÷ 4.6487) × 100 ≈ 2.77%.

Most of the cost here is in the rate, not the fees. Try a second offer and pick the one with the smaller shortfall.

## Where it is used

- **Sending money home.** Compare services on what actually arrives, not on the advertised fee.
- **Travel.** Check a currency exchange counter's board rate before you hand over cash, or read a card statement to see what a foreign purchase really cost.
- **Small business invoices.** A freelancer paid in another currency can see how much the payment platform kept.
- **Online shopping.** Compare a foreign shop's price with a local one.

## Common mistakes

- **Typing the offer rate the wrong way round.** The box wants 1 From = this many To. If the result says you get *more* than the fair amount, you have probably entered the inverse; the tool warns you about this.
- **Ignoring the rate when a service says "zero fees".** A no-fee offer can still cost more than one with a fee, because the markup is hidden in the rate. Always compare the shortfall.
- **Treating the daily rate as live.** The page uses one rate per day: right for planning, not for timing a trade.
- **Forgetting both fees.** Many offers have a flat fee and a percent. Fill in both boxes, or the comparison looks better than it is.
- **Trusting a fallback rate.** If the page says it could not load today's rates, the built-in values are rough. Type a current rate under "Use my own rate".

## Questions people ask

**Is the mid-market rate one I can actually get?** Usually not. Banks, cards and transfer services all add something, so treat it as the best case to measure offers against.

**Why does a small percentage matter so much?** A shortfall of under 4% on one transfer looks minor, but on 2,000 GBP a month it comes to about 4,174 AED a year (347.87 × 12) in the example above. Small gaps add up on regular payments.

**Can I use it for rules like transfer limits or reporting?** No. Limits, taxes and reporting rules on money sent abroad vary by country and change over time. Check the official source, such as your central bank or tax office, before you send large amounts.

This article is general education, not financial advice.
