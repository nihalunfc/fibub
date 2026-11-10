---
title: "How a SIP grows: monthly investing, step-ups and lumpsums explained"
summary: "What a systematic investment plan is, how monthly compounding builds its value, and how to test returns, a yearly step-up and a lumpsum with the SIP calculator."
tools: [sip-calculator, compound-interest, inflation-calculator, india-income-tax]
updated: 2026-11-10
sources:
  - "Future value of equal payments made at the start of each period (an annuity due), with the monthly rate taken as the yearly rate divided by 12. The worked example was run through the site's own calculation code and checked against the closed formula."
  - "Tax on fund gains and the rules for SIPs differ by country and by fund type. Check the official source, such as your tax authority or market regulator."
---

Putting the same sum into a fund every month is one of the simplest ways to build savings, but it is hard to picture what the habit adds up to after ten or twenty years. The [[sip-calculator]] estimates that figure for any return you pick, splits it into your own money and growth, and lets you test a yearly raise or a one-off starting amount. For a savings account or a deposit that pays a stated rate, the [[compound-interest]] calculator fits better, and the [[inflation-calculator]] shows what a future sum might buy in today's prices.

## What it is

SIP stands for systematic investment plan. The term is most common in India, but the idea works anywhere: a fixed amount goes into a fund on a set day each month.

Each instalment starts growing as soon as it is invested. Growth in one month is added to the pot, so next month's growth is worked out on a slightly bigger amount. That is compounding.

The calculator treats each instalment as paid at the start of the month. With a level SIP the value after n months is:

FV = P × ((1 + i)^n − 1) ÷ i × (1 + i)

- **FV** is the future value, the estimated pot at the end.
- **P** is the monthly instalment.
- **i** is the monthly rate: the yearly return divided by 12, written as a decimal (12% a year gives 0.01).
- **n** is the number of monthly instalments (years × 12).

The final "× (1 + i)" is there because a start-of-month payment earns one extra month of growth compared with an end-of-month one.

Two optional extras change the picture. A **step-up** raises the instalment by a set percentage once a year, which suits people whose pay rises over time. A **lumpsum** is a single amount invested on day one that grows alongside the monthly payments.

## How to use it

1. Pick a currency from the list. It only changes how amounts are shown.
2. Type your monthly instalment in **Monthly SIP**.
3. Enter the **Expected return** as a yearly percentage and the number of **Years** (1 to 60).
4. If your instalment will rise each year, type the percentage in the step-up box. Leave it at 0 otherwise.
5. If you are starting with a sum already saved, type it in the lumpsum box.
6. Read the four result cards: future value, the amount you invested, the estimated gains and the share of the pot that is gains. Below them, a chart traces value against money invested, and a year-by-year table lists the totals at each year end. The table can be saved as a CSV file.

## A worked example

Ravi plans to invest 5,000 a month for 15 years and wants to see a range of outcomes.

- **At 10% a year:** he puts in 5,000 × 180 = 900,000. The estimated value is about 2,089,621, so the gains are about 1,189,621, roughly 57% of the pot.
- **At 8% a year:** the value falls to about 1,741,726.
- **At 12% a year:** it rises to about 2,522,880.

The gap between 8% and 12% is close to 781,000, on exactly the same deposits. That is why it pays to test more than one rate.

Now Ravi tries a 5% step-up at 10%. His instalment becomes 5,250 in year two, about 5,513 in year three, and so on. He now invests about 1,294,714 in total, and the estimated value grows to about 2,749,965, some 660,000 more than the level plan.

Last, he keeps the level 5,000 but adds a 50,000 lumpsum at the start. The estimate becomes about 2,312,317 on 950,000 invested.

The table also shows how slowly the early years move. With the level plan at 10%, the value is about 390,412 after 5 years and about 1,032,760 after 10. More than half the final value is built in the last 5 years.

## Where it is used

- **Household goal planning:** parents put a rough figure on a child's college fund by trying a monthly sum and a time frame.
- **Retirement saving:** a long horizon with a step-up that tracks expected pay rises shows how a growing habit compares with a fixed one. The [[retirement-planner]] goes further for that job.
- **Comparing with fixed deposits:** run the same monthly sum at a cautious fund return and at a deposit rate.

## Common mistakes

1. **Treating the expected return as a promise.** Funds rise and fall, and past returns do not set future ones. Running a low, a middle and a high rate shows the range, and planning around the low end is the cautious habit.
2. **Ignoring rising prices.** A big number in 20 years buys less than it would today. Take the future value to the inflation calculator before deciding it is enough.
3. **Forgetting charges and tax.** The estimate leaves out fund fees and tax on gains. Both can trim the final figure noticeably over long periods.
4. **Setting a step-up you cannot keep.** A 10% yearly raise sounds easy in year two and much harder in year twelve. A rise that could still be kept up in a bad year is the safer test.
5. **Stopping in a downturn.** The maths assumes every instalment is paid. A missed month also loses all its future growth.

## Questions people ask

**Can I use it for a monthly deposit into a savings account?** You can, with the account rate as the return, but the compound interest calculator lets you set how often interest is added and include a fee, which suits accounts better.

**Is a step-up better than a bigger SIP from day one?** Starting bigger usually ends higher, because the early money has longer to grow. A step-up helps when you cannot afford the bigger sum yet.

**How are gains on a SIP taxed?** It depends on where you live, the fund type and how long you hold each unit. Check the official source before you rely on any after-tax figure.
