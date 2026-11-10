---
title: "How to calculate compound interest (with monthly deposits)"
summary: "Grow the start amount by (1 + r/m)^(m×t), add the growth of each regular deposit, and subtract what you paid in to get the interest. Worked example and checks."
tools: [compound-interest, savings-goal, sip-calculator]
updated: 2026-11-10
sources:
  - "Standard compound interest and future value of an ordinary annuity formulas. Example numbers worked with fibub's own src/lib/money/growth.ts."
---

Compound interest is interest that is itself paid interest later on. To work it out, grow your start amount by (1 + r/m) once for every period interest is added, then add what each regular deposit grows to. The [[compound-interest]] calculator does both at once and splits the final balance into the money you put in and the interest earned.

## What you need

- **A start amount.** Zero is fine if you are starting from nothing.
- **A regular deposit**, if you plan one, and whether it goes in monthly or yearly.
- **The yearly interest rate.** For a savings account this is on the bank's page. For an investment, choose a cautious guess, because returns are not fixed.
- **How often interest is added**: daily, monthly, yearly and so on. The account terms usually say.
- **How many years.**

If you would rather start from a target ("I want 20,000 in 5 years"), the [[savings-goal]] tool works backwards to the monthly amount. For monthly investing in funds, the [[sip-calculator]] is built around that habit.

## Step by step

For a single sum with no deposits, the formula is:

**A = P × (1 + r/m)^(m × t)**

- **A** is the amount at the end.
- **P** is the start amount (the principal).
- **r** is the yearly rate as a decimal (6% is 0.06).
- **m** is how many times a year interest is added (12 for monthly).
- **t** is the number of years.

Regular deposits each grow for a different length of time. With a deposit D at the end of every period, and the same period for deposits and interest, their total is:

**D × ((1 + i)^n − 1) ÷ i**

where i = r/m is the rate per period and n = m × t is the number of periods. Add the two parts to get the final balance. Interest earned is the final balance minus everything you paid in.

With the calculator:

1. Choose a currency and type the **Start amount**.
2. Type the **Regular deposit**, then choose **Deposit every** (month or year) and whether it is made at the start or the end of the period.
3. Enter the **Interest rate**, pick how often **Interest added** happens, and type the **Years**.
4. Leave **Yearly fee** and **Inflation** at 0 for a plain answer, or fill them in to see the effect of fund charges and rising prices.
5. Read the four cards: **Final balance**, **You put in**, **Interest earned** and **In today's money**. Below them are a growth chart and a **Year by year** table you can save as a CSV file.

## A worked example

Priya puts 5,000 into a savings account and adds 200 at the end of every month. The account pays 6% a year, added monthly. She leaves it for 15 years.

- Rate per month: i = 0.06 ÷ 12 = 0.005. Number of months: n = 12 × 15 = 180.
- Start amount: 5,000 × 1.005^180 = **12,270.47**.
- Deposits: 200 × (1.005^180 − 1) ÷ 0.005 = **58,163.74**.
- Final balance: 12,270.47 + 58,163.74 = **70,434.21**.
- Money she put in: 5,000 + 200 × 180 = **41,000**.
- Interest earned: 70,434.21 − 41,000 = **29,434.21**.

The calculator gives the same final balance and shows about 41,873 after 10 years, when 29,000 has gone in. The interest grows faster in the later years because there is more money earning it.

Two more tests change the picture:

- If interest were added only once a year instead of monthly, the final balance falls to about 69,365.
- With a 1% yearly fee and 2% inflation, the balance is about 63,996, which is worth roughly 47,550 in today's money.

## Check your answer

- **Rule of 72.** Divide 72 by the rate to get a rough doubling time. At 6%, money doubles in about 12 years, so 5,000 on its own should be a bit over 10,000 after 12 years and around 12,000 after 15. It is: 12,270.
- **Interest can never be negative** unless a fee is larger than the rate. If the result is below what you put in, check the fee box.
- **More frequent compounding adds a little, not a lot.** Monthly against yearly at 6% differs by about 1.5% here. A big jump means a typing slip, such as 60 instead of 6.
- **Start against end deposits.** Deposits at the start of each month should give a slightly higher balance, since each one earns one more month of interest.

## Questions people ask

**What is the difference between simple and compound interest?** Simple interest is paid only on the original amount, so it grows in a straight line. Compound interest is paid on the growing balance, so the growth speeds up over time.

**Is APY the same as the interest rate?** Not quite. APY (or AER in the UK) already includes the effect of compounding over one year, so it is a little higher than the stated rate when interest is added more than once a year. Check which one your bank quotes.

**Is the interest taxed?** In many countries interest and investment gains can be taxed, and some accounts are sheltered. The rules change by country and by account, so check the official source where you live. This is general education, not financial advice.
