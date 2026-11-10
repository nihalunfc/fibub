---
title: "Retirement planner: how long will my savings last?"
summary: "How a retirement plan is tested month by month in today's money, what drives the answer, and how to read the shortfall or surplus the retirement planner shows."
tools: [retirement-planner, fire-calculator, inflation-calculator, compound-interest]
updated: 2026-11-10
sources:
  - "Standard growth and annuity maths, run month by month. Real return = (1 + return) / (1 + inflation) - 1. The worked example was run through the site's own calculation code."
  - "Pension ages, tax on withdrawals and account rules differ by country and change over time. Check the official source, such as your government's pension service or tax authority."
---

Saving for retirement is a long bet made with guesses about returns, prices and how long you will live. The [[retirement-planner]] turns those guesses into one clear test: does the pot you build last as long as you plan to, and if not, by how much does it fall short? It suits anyone from a first-job saver to someone a few years from stopping work, and it is general education, not personal advice. If you would rather start from a target pot, the [[fire-calculator]] works the other way round; to see how prices erode a fixed sum, try the [[inflation-calculator]]; and [[compound-interest]] shows the growth part on its own.

## What it is

A retirement plan has two phases. In the first, you add money and it grows. In the second, you take money out while what is left keeps growing, usually more slowly because people often move to safer investments.

The planner works in **today's money**. That means it removes inflation (the general rise in prices) from every figure, so a result of 400,000 means "what 400,000 buys now". It does this by turning each return into a **real return**:

real return = (1 + r) / (1 + f) − 1

- **r** is the yearly return you enter (before or after retiring).
- **f** is the yearly inflation you enter.

The pot is then grown, or drawn down, one month at a time. In retirement the monthly withdrawal is your spending minus any pension or other income, so only the gap comes out of savings. The planner also works out the **pot you need** on the day you retire: the sum that, at the post-retirement real return, pays that gap every month until your planned age. The difference between the pot you have and the pot you need is the surplus or shortfall.

One quiet assumption matters: your monthly saving is treated as rising with prices. If you save 500 a month now, you are taken to save whatever 500 is worth in each future year.

## How to use it

1. Pick a currency. It only changes how amounts are shown.
2. Enter your age now, the age you hope to retire and the age you want the money to last until.
3. Enter what you have saved so far and what you put away each month.
4. Enter three yearly percentages: the return while you are still saving, the return once you have retired, and inflation.
5. Enter the monthly spending you expect in retirement and any pension or other income, both in today's prices.
6. Read the three result boxes (the age the money lasts until, the pot at retirement, and the spare or short amount), the sentence under them, and the line chart of savings by age.

## A worked example

Sam is 40 and wants to retire at 65 and plan to age 90. Sam has 50,000 saved and adds 500 a month. Sam guesses a 6% yearly return while working, 4% after retiring, and 2% inflation. In retirement Sam expects to spend 3,000 a month and get a 1,200 a month pension.

- Real return before retiring: 1.06 / 1.02 − 1 ≈ 3.92% a year.
- Real return after retiring: 1.04 / 1.02 − 1 ≈ 1.96% a year.
- Monthly gap to draw from savings: 3,000 − 1,200 = 1,800.

The planner shows a pot of about **382,467** at 65. To pay 1,800 a month for 25 years at the lower real return, Sam would need about **427,449**. So Sam is **short by about 44,982**, and the money runs out at about **age 86 and 8 months**.

Now two small changes, one at a time:

- Retire at 67 instead of 65: the pot grows to about 425,506, the need drops to about 400,361, and the plan has about **25,145 spare**. The money lasts past 90 with roughly 39,302 left.
- Keep 65 but save 700 a month: the pot reaches about 483,133, which is about **55,684 more** than needed.

Working longer helps twice: more saving time and fewer years to fund.

## Where it is used

- **Checking a workplace pension.** Enter the expected pension as other income to see how much your own savings must cover.
- **Talking to a financial adviser.** Run a cautious and a hopeful case first, so you arrive with clear questions.
- **Couples planning together.** Combine savings and spending, or run each person separately and compare.
- **Teaching.** Classes on personal finance use the same two-phase model to show why starting early matters.

## Common mistakes

- **Mixing nominal and today's money.** Enter spending as it would cost now, not a guess at future prices. The planner already handles inflation.
- **Using advertised returns.** Headline returns often ignore fees and bad years. Try a lower figure as well and see if the plan still holds.
- **Forgetting tax.** Withdrawals from some accounts are taxed, and the planner does not include tax. Leave room, and check the official source for your country's rules.
- **Planning to an average lifespan.** Many people live longer than the average. Plans that run to 90 or 95 are more cautious than ones that stop at 80.
- **Treating the result as exact.** Real returns go up and down year to year. Small changes in inputs move the end age a lot, so look at a range of results.

## Questions people ask

**Why does the chart drop to zero and stay there?** Once the pot is empty, the planner stops withdrawals and shows zero. The age where the line hits zero is the "money lasts until" figure.

**Can I model a part-time job in early retirement?** Not as a separate period, but you can add the expected earnings to "Pension or other income" for a rough feel, then try it without.

**Does a bigger pension always fix a shortfall?** It lowers the monthly gap, which lowers the pot you need. With Sam's numbers, each extra 100 a month of pension cuts the pot needed by about 23,700.
