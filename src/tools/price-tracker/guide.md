---
name: Price tracker
num: 2124
shelf: money
code: T950
section: shopping
title: "Black Friday price tracker: log prices and check if a sale is a real deal"
seoTitle: "Black Friday price tracker: is the deal real? Free"
summary: "Log the prices you see for each item over the weeks before a sale, then see if the Black Friday price is really lower, how much is truly off, whether the store's 'was' price is inflated, and your basket total against a budget."
status: live
ads: false
order: 2124
icon: chart
works: offline
updated: 2026-11-13
related: [unit-price, percentage-calculator, budget-calculator, sales-tax-calculator]
sources:
  - "Method: the sale price is compared with the lowest and the median of the prices you logged in the window you choose (30, 60 or 90 days). fibub reads no store websites; every price comes from you."
flow:
  - { icon: pencil, label: "Add items" }
  - { icon: calendar, label: "Log prices" }
  - { icon: chart, label: "Compare" }
  - { icon: check, label: "Real deal?" }
---

## What it does

Big sales such as Black Friday and Cyber Monday are full of price tags that say "was 299.99, now 179.99". Sometimes the "was" price is real. Often the item sold for about the same price a few weeks earlier, or the "was" price was never charged at all. This tracker lets you find out from your own notes instead of trusting the sticker.

Add the things you want to buy, and each time you see a price (in a shop, a flyer or online), log it with the date. On sale day, log the sale price too. The tracker compares the newest price with the prices you saw in the last 30, 60 or 90 days. It tells you whether the sale price is a **real deal** (lower than anything you saw), the **same** as its recent low, or **not a deal**. It also shows the real percentage off and flags a "was" price that is higher than any price you actually saw. Tick the items you plan to buy to get a basket total and see how it fits your budget.

It reads no store websites and sends nothing anywhere, so it works with any shop and any currency. To compare pack sizes use [[unit-price]], add the tax at the till with [[sales-tax-calculator]], and plan the whole month with the [[budget-calculator]].

## How to use it

1. Type an item's name under **Add an item** and press **Add item**. You can add the store too.
2. Each time you see its price, pick the date and type the price, then press **Log price**. Start a few weeks before the sale if you can. Logging another price on the same day replaces the old one.
3. On sale day, log the sale price. The verdict appears in bold above the item's price list.
4. If the shop shows a "was" or "regular" price, type it in **Store's "was" price** to see whether its claimed discount holds up.
5. Tick **Buying this** for the items you plan to get, and type a budget at the top to see what is left.
6. Tick **Remember my list on this device** if you want your list to be there next time. Download a CSV to keep a copy in a spreadsheet.

The page opens with two example items so you can see how it works. Press **Clear list** to start your own.

## What each setting does

- **Compare with the last**: how far back the tracker looks for earlier prices, 30, 60 or 90 days before the newest price. 90 days covers the usual run-up to Black Friday, so it is the default.
- **My budget**: the most you want to spend. The summary shows how much is left or how far over you are.
- **Buying this**: counts the item in the basket total. Untick items you are only watching.
- **How many**: the number you plan to buy, used in the basket total.
- **Store's "was" price**: the reference price the shop prints. If it is above every price you saw in the window, it is flagged as inflated.
- **Remember my list on this device**: off by default. When ticked, the list is saved in this browser only. Unticking it or pressing **Clear list** deletes it.

## Worked example

You want headphones. You saw them at 199.99 on 1 October, 179.99 on 20 October and 229.99 on 10 November. On Black Friday, 27 November, they are 179.99 with a sign saying "was 299.99, save 40%".

The lowest price you saw in the 90 days before was 179.99, so the verdict is **Same as its recent low: not a special deal**. The typical (median) price of your three earlier checks is 199.99, so the real saving is 10.0%, not 40%. And because 299.99 is higher than any price you saw, the claimed 40% off is flagged as inflated.

An air fryer you saw at 129.99 and then 119.99 drops to 89.99. That is 25.0% below the lowest price you saw, so it is a **real deal**. With both ticked and a budget of 400, the basket is 269.98, you save 55.00 against the typical prices (324.98), and 130.02 of your budget is left.

## FAQs

**Does it check store websites for me?** No. Reading prices from shops would need a server and would send your list somewhere. Every price comes from you, which also means it works for any shop, flyer or market stall, in any country.

**Why compare with the lowest price and not the "was" price?** Because the "was" price is set by the seller. The lowest price you saw recently is what you could actually have paid, so a sale is only a real deal if it beats that.

**What counts as the same price?** Anything within half a percent of your earlier low, so a few cents of difference does not count as a deal.

**Where is my list kept?** Only in this browser, and only if you tick the remember box. Nothing is uploaded. Clearing your browser data also clears it.

**Does it add sales tax?** No, prices are compared as you type them. Use the [[sales-tax-calculator]] to see the price at the till.
