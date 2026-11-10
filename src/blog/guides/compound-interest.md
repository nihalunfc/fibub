---
title: "Compound interest explained: deposits, fees and today's money"
summary: "How interest on interest builds savings, why fees and inflation matter as much as the rate, and how to model all three with the compound interest calculator."
tools: [compound-interest, inflation-calculator, budget-calculator, sip-calculator]
updated: 2026-11-10
sources:
  - "Standard compound interest: one year of growth is (1 + r/m)^m for a yearly rate r credited m times a year. The worked example was run through the site's own calculation code."
  - "The rule of 72 is a common rule of thumb for doubling time, not an exact result."
  - "Interest on savings may be taxed, and account rules differ by country. Check the official source, such as your tax authority or your bank's terms."
---

Most people know that savings earn interest. Fewer see how much of a long balance is interest on interest, or how much a small fee takes. The [[compound-interest]] calculator takes a starting sum and regular deposits, grows them at a fixed rate, and shows how much of the result is your money, how much is interest, and what the total is worth after rising prices. To find a deposit you can afford, start with the [[budget-calculator]]; for monthly fund investing, the [[sip-calculator]] is built for that job; and the [[inflation-calculator]] goes deeper into what money buys over time.

## What it is

Simple interest pays only on what you put in. Compound interest pays on the whole balance, so once interest is added it starts earning too. For one sum left alone the result is:

A = P × (1 + r/m)^(m × t)

- **A** is the amount at the end.
- **P** is the starting sum.
- **r** is the yearly rate as a decimal (5% is 0.05).
- **m** is how many times a year interest is added (12 for monthly).
- **t** is the number of years.

So 1,000 at 5% added once a year for 10 years becomes 1,000 × 1.05^10, about 1,628.89.

Regular deposits work the same way, each one growing for the time it stays in. The calculator steps through every month, adds deposits when they are due, and applies one month's share of the yearly growth.

Two more forces pull the other way. A **fee** charged as a yearly percentage is taken off the balance bit by bit, so it lowers the whole pot, not just the interest. **Inflation** is the general rise in prices. Dividing a future balance by the total price rise over the years gives its value "in today's money", which is a fairer way to judge whether a goal is enough.

A handy shortcut sits under the results: the **rule of 72**. Divide 72 by the yearly rate after fees and you get the rough number of years it takes for money to double. At 6% that is about 12 years.

## How to use it

1. Choose a currency, then type a **Start amount**. Zero is fine if you are starting from nothing.
2. Type the **Regular deposit**, choose whether it is paid every month or every year, and choose whether it goes in at the start or the end of that period.
3. Enter the yearly **Interest rate**, pick how often interest is added (from daily to yearly) and set the **Years**.
4. If your account or fund charges a yearly fee, type it. If you want the result in today's prices, type an inflation rate.
5. Read the cards for final balance, money put in, interest earned and today's money. A chart compares the balance with what you put in, and the year-by-year table lists every year end. Save the table as a CSV file if you want to keep it.

## A worked example

Lena opens a savings account with 2,000 and plans to add 150 at the end of every month for 20 years. The account pays 6% a year, with interest added monthly.

- **Money she puts in:** 2,000 + 150 × 240 = 38,000.
- **Final balance:** about 75,926.54. Interest makes up about 37,926.54, nearly half.
- **Rule of 72:** 72 ÷ 6 = 12 years to double, roughly.

Now she compares a fund with the same return but a 1% yearly fee. The final balance drops to about 67,039.35. The fee costs her about 8,887 over 20 years, almost a quarter of the interest she would have earned.

Back on the fee-free account, she adds inflation of 2.5% a year. Prices rise by a factor of about 1.639 over 20 years, so the 75,926.54 is worth about 46,335.76 in today's money.

Paying each deposit at the start of the month instead lifts the balance to about 76,273.07; adding interest only yearly lowers it to about 74,430.07.

## Where it is used

- **Comparing savings accounts:** two banks may quote similar rates but add interest at different intervals or charge fees. Running both side by side shows the real gap.
- **Checking fund charges:** typing a fund's ongoing charge as the yearly fee shows its long-term cost in money, not just as a percentage.
- **Planning a goal:** a house deposit, a wedding or school fees can be tested against a deposit amount and a time frame, then checked in today's prices.
- **Debts in reverse:** the same maths explains why an unpaid balance grows. For paying debts down, the [[credit-card-payoff]] tool is the better fit.

## Common mistakes

1. **Comparing rates without checking fees.** A higher rate with a 1.5% fee can lose to a lower rate with none. Put the fee in before you compare.
2. **Judging the final number in future prices.** A balance that sounds large in 25 years may buy far less. Add an inflation rate to see today's value.
3. **Assuming the rate never changes.** The calculator holds one rate for the whole time. Test a lower one too.
4. **Mixing up the deposit timing.** Choose "start" only if the money really goes in at the start of the period, otherwise the result runs slightly high.
5. **Forgetting tax on interest.** Interest may be taxed where you live, which lowers what you keep. Check the official source for your country's rules.

## Questions people ask

**What is the difference between APR and APY?** APR is the yearly rate before compounding. APY (or AER in the UK) includes the effect of interest being added during the year, so it is a little higher. Type the plain yearly rate into the calculator and pick the right interval.

**Can I model a deposit that I stop paying?** Not in one run, as deposits continue to the end. Run the deposit years first, then use that balance as the start amount with no deposit for the remaining years.

This article is general education, not financial advice.
