---
title: "How a mortgage payment is worked out, with interest and payoff time"
summary: "See how price, down payment, rate and years set a mortgage payment, what the total interest comes to, and how faster or extra payments shorten the loan. Includes Canada's rules."
tools: [mortgage-calculator, loan-payoff-planner, budget-calculator]
updated: 2026-11-10
sources:
  - "Payment: the standard level-payment (annuity) formula. Canadian fixed-rate mortgages are quoted with semi-annual compounding, as the tool page notes."
  - "CMHC premiums and minimum down payments as listed in the tool (cmhc-schl.gc.ca, checked 2026-11-10). Rules change; check the official source."
  - "The home price, rate and other numbers in the worked example are made up for teaching."
---

A mortgage is often the biggest loan a person takes, and small choices add up over 25 years. The [[mortgage-calculator]] shows what a home loan costs each payment, how much of that goes on interest in total, and how long it lasts, with a chart of the balance and a year-by-year table. It is for buyers, people renewing and anyone curious about loans. Before you buy, [[rent-vs-buy]] compares owning with renting; after, the [[loan-payoff-planner]] tests other extra-payment plans, and the [[budget-calculator]] checks the payment fits your month.

## What it is

You borrow the **principal**: the price minus your down payment. Each payment covers that period's interest first, and the rest pays down the principal. Early on, interest takes most of each payment; near the end, almost none.

A fixed payment that clears the loan exactly on time comes from the level-payment formula:

**payment = L × i ÷ (1 − (1 + i)^−n)**

- **L** is the amount borrowed.
- **i** is the interest rate for one payment period.
- **n** is the number of payments (years × payments a year).

How the yearly rate becomes **i** depends on where you are. In many places the yearly rate is simply divided by the number of payments, so 4.5% paid monthly gives i = 0.045 ÷ 12. Canadian fixed-rate mortgages compound twice a year by law, so the monthly rate is (1 + rate ÷ 2)^(1/6) − 1, which is slightly lower. **Canada mode** switches to that rule.

Canada mode also adds **mortgage default insurance** from CMHC (Canada Mortgage and Housing Corporation) when the down payment is under 20%. The premium is a percent of the loan, set by the size of the down payment, and is normally added to what you borrow. The tool also checks Canada's minimum down payment for the price.

**Extra payments** go straight to the principal, so every later payment carries less interest. The **accelerated** options take half (every two weeks) or a quarter (weekly) of the monthly payment. That adds about one extra monthly payment a year.

## How to use it

1. Type the **Home price** and the **Down payment**, and use the small menu beside it to say whether the down payment is a percent or an amount.
2. Type the **Interest rate a year** and the **Amortisation (years)**, the total time you would take to repay (1 to 40 years).
3. Choose **How often you pay**: monthly, semi-monthly, every 2 weeks, weekly, or the accelerated two-week or weekly options.
4. If you plan to pay more, fill in **Extra with every payment** and/or **Extra once a year**.
5. Tick **Canada mode** to use semi-annual compounding and CMHC insurance. A second box lets you choose whether the premium is added to the mortgage.
6. Read the payment, amount borrowed, total interest, total paid back and years to mortgage-free. Open **Year by year** for the table, or download it as a CSV file for a spreadsheet.

## A worked example

A home costs 420,000. The buyer puts 15% down (63,000), so the loan is 357,000. The rate is 4.5% a year over 25 years, paid monthly.

**Standard monthly rate.** i = 0.045 ÷ 12 = 0.00375 and n = 300. The payment comes to **1,984.32 a month**. Total interest is about **238,297**, so about 595,297 is paid back in all.

**Canada mode.** With 15% down, the CMHC premium is 2.80% of 357,000 = **9,996**, added to the loan, which becomes 366,996. The monthly rate is (1.0225)^(1/6) − 1 ≈ 0.0037153. The payment is **2,031.22 a month**, and total interest is about **242,372**. The insurance makes the loan bigger, so it costs more despite the gentler compounding.

**Accelerated every two weeks (Canada mode).** The payment is 2,031.22 ÷ 2 = **1,015.61** every two weeks. That is 26 payments, or 26,405.86 a year, against 24,374.64 a year paid monthly. The loan ends after about **21.7 years**, and total interest falls to about 205,615, roughly 36,757 less.

**200 extra with every monthly payment (Canada mode).** The loan ends after about **21.3 years**, and the tool reports about **41,133** of interest saved, about 3.8 years sooner.

## Where it is used

- **Buying a home.** Compare prices, down payments and rates before talking to a lender.
- **Renewals.** Run the remaining balance at the new rate to see the new payment.
- **Deciding on extra payments.** See what a yearly bonus or a small monthly extra really saves.
- **Teaching.** The year-by-year table shows interest shrinking and principal growing.

## Common mistakes

- **Mixing up the rate rules.** A Canadian quote run without Canada mode, or a US quote run with it, gives a payment off by a little each month and a lot over 25 years.
- **Forgetting the other costs of owning.** Property tax, home insurance and repairs are not in the payment. Budget for them separately.
- **Assuming the rate never changes.** The tool keeps one rate for the whole loan. Most real mortgages reset, so rerun it at each renewal with the new rate.
- **Picking "every 2 weeks" and expecting the accelerated result.** Plain every-two-weeks payments are worked out to finish on the same date as monthly ones. Only the accelerated options shorten the loan.
- **Ignoring lender rules.** Lenders may cap extra payments, and insured Canadian loans have amortisation limits. Check with your lender.

## Questions people ask

**Why does the payoff time show slightly over 25 years?** Rounding the payment to the cent can leave a tiny final payment, which the tool counts.

**Is a longer amortisation always worse?** It lowers each payment but raises the total interest a lot. Some take the longer term for safety and pay extra when they can.

**Do these insurance and down payment rules apply everywhere?** No. CMHC rules are Canadian only, and other countries have their own. Rules change, so check the official source, such as your national housing agency or regulator, and ask a licensed adviser about your own situation.

This article is general education, not financial advice.
