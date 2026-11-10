---
title: "How to pay off a loan faster (and see how much interest you save)"
summary: "Pay a little more than your monthly payment, or add lump sums, so the balance falls sooner. See the interest saved and the new end date, with a worked example."
tools: [loan-payoff-planner, budget-calculator, loan-comparison]
updated: 2026-11-10
sources:
  - "Standard fixed-rate amortisation formula, M = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), with r the monthly rate. Example numbers worked with fibub's own src/lib/loan.ts."
---

The quickest way to clear a loan sooner is to pay extra on top of your normal monthly payment, either a small amount every month or a lump sum now and then, and ask the lender to put it against the balance. The [[loan-payoff-planner]] shows exactly how much interest each extra payment saves and how many months it cuts off.

## What you need

- **What you still owe today.** Your latest statement or the lender's app shows it.
- **The yearly interest rate** on the loan.
- **The time left**, in years and months.
- **Your monthly payment**, if you know it. The planner can work it out, but if your lender charges a slightly different amount, type the real one.
- **An idea of what you could spare.** A spare 100 a month or a yearly bonus both count. If you are not sure, the [[budget-calculator|budget planner]] helps you find it first.

## Step by step

A fixed-rate loan is paid off in equal monthly payments. Each month the lender charges interest on what you still owe, takes it out of your payment, and uses the rest to shrink the balance. The fixed payment comes from this formula:

**M = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)**

Here M is the monthly payment, P is the balance, r is the yearly rate divided by 12 (as a decimal), and n is the number of months left. Because interest is charged on the balance, anything that makes the balance smaller earlier also makes every later interest charge smaller. More of each future payment then goes to the loan itself, and the end date moves closer.

To try it with the planner:

1. In **Your loan**, type the amount still owed, the interest rate and the years and months left. Set **Next payment** to the right month.
2. Read the line under the boxes: it gives your monthly payment, the total interest if you change nothing, and your last payment date.
3. Type an amount in **What does one extra payment do?** to see the effect of a single lump sum paid next month.
4. Look down the **Ready-made plans** table. It compares paying 5% or 10% more each month, one or two extra payments a year, and a few lump-sum ideas. Press **Use** on any row to copy it into your own plan.
5. Under **Your prepayment plan**, add rows with **+ Add a prepayment**. Each row has an amount, how often (once, every month, every 3, 6 or 12 months, or a gap you choose), a start month and an optional end month.
6. Choose **Finish sooner** to keep the same payment and end early, or **Lower my EMI** to keep the end date and pay less each month.
7. Read the result cards, the balance chart and the **Year by year** table. A CSV button saves the monthly schedule.

## A worked example

Sam owes 250,000 on a home loan at 6% a year, with 25 years (300 months) left.

- Monthly rate: 6 ÷ 12 = 0.5%, so r = 0.005.
- Monthly payment: 250,000 × 0.005 × 1.005^300 ÷ (1.005^300 − 1) = about **1,610.75**.
- In the first month, interest is 250,000 × 0.005 = 1,250.00, so only 360.75 of the payment reduces the loan.
- If Sam changes nothing, total interest over 25 years is about **233,226**.

Now Sam adds 200 extra every month, starting with the first payment, and keeps **Finish sooner** ticked:

- The loan ends after 236 months instead of 300, which is **5 years 4 months sooner**.
- Total interest drops to about 175,580, a saving of about **57,646**.
- Sam pays 47,000 extra in total over those 236 months, so each 1 of extra money saves roughly 1.23 in interest.

As a second test, Sam types 5,000 into the one-extra-payment box instead. That single payment next month saves about **16,534** in interest and ends the loan **1 year 1 month** sooner. Each 1 paid in early saves about 3.31, because it stops interest building on that money for almost the whole term.

## Check your answer

- **First-month interest** should equal balance × yearly rate ÷ 12. If 250,000 × 6% ÷ 12 is not about 1,250, a box has a typing slip.
- **Total paid with no extras** should be close to monthly payment × months. Here 1,610.75 × 300 = 483,225, and 483,225 − 250,000 = 233,225, matching the interest figure.
- **Early money beats late money.** A lump sum paid in year 1 should always save more than the same sum paid in year 20. If it does not, check the start month on that row.
- **Your lender's figures** may differ by a few units because of rounding, payment dates or fees.

## Questions people ask

**Is it better to pay extra every month or one lump sum?** For the same total, money paid earlier saves more. A monthly top-up is easier to keep up; a lump sum suits a bonus or refund. Try both.

**Will my lender charge a fee for paying early?** Some do, especially on fixed-rate loans, and some cap how much you may prepay each year. Rules vary by country and by contract, so check your loan agreement and the official source for your country before you pay.

**Should I pay off the loan or save the money instead?** That depends on your rate, your emergency savings and your other debts, and is a personal choice. As general education, many people keep a cash cushion first and clear the most expensive debt before cheaper debt. The [[loan-comparison]] tool helps when you want to see which of several loans costs most.
