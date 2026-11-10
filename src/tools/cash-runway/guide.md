---
name: Cash runway
num: 1758
shelf: money
section: small-business
title: "Cash runway calculator: how many months until the money runs out"
summary: "Find how many months your cash will last and the date it hits zero, from your monthly burn or your revenue and costs, with growth."
status: live
ads: false
order: 1758
icon: sliders
works: offline
updated: 2026-11-10
related: [break-even, budget-calculator, invoice-maker, percentage-calculator]
sources:
  - "Plain arithmetic: runway = cash / monthly net burn, month by month when revenue or costs change."
flow:
  - { icon: wallet, label: "Cash" }
  - { icon: chart, label: "Burn" }
  - { icon: calendar, label: "Runway" }
---

## What it does

Runway is how long your cash lasts at the current rate of spending. Start-ups, small shops, freelancers between contracts and anyone living off savings can use it to see how long they have to fix things, raise money or find work.

Enter the cash you have and either a single monthly burn or your monthly revenue and costs. Add growth if revenue or costs are changing. The tool counts month by month and shows when cash reaches zero. It pairs with [[break-even]] to see what sales stop the burn, and with the [[budget-calculator]] to cut costs.

## How to use it

1. Enter the **cash** you have now.
2. Pick **I know my monthly burn**, or **I know revenue and costs**.
3. Enter the amounts. Add monthly **growth** if they change.
4. Read the months left, the zero-cash date and the chart.

## What each setting does

- **Monthly burn:** cash going out each month, net of any money coming in.
- **Revenue growth:** how much revenue rises (or falls, with a minus) each month, compounded.
- **Cost growth:** the same for costs.
- **Start date:** the date the zero-cash date counts from. It defaults to today.

## Worked example

You have 120,000 and spend 10,000 a month more than you earn. With no growth, 120,000 / 10,000 = 12 months. If your costs rise 2% each month the cash lasts about 10.9 months instead, because each month burns a little more. If revenue of 4,000 grows 10% a month against costs of 10,000, the gap closes and the cash may last much longer. Use [[invoice-maker]] to bill customers faster.

## FAQs

**Why does the date not match 30-day months?** The date adds the months at an average of 30.44 days.

**What if I make money?** If revenue is at or above costs and stays there, cash never runs out and the tool says so.

**Is this a forecast?** No, just arithmetic on your inputs. Not financial advice.
