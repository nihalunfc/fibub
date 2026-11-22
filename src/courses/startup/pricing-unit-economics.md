---
title: 'Pricing and unit economics'
seoTitle: 'Startup pricing and unit economics: LTV, CAC, margin'
summary: 'How to set a price and check that each customer makes you money: gross margin, customer acquisition cost (CAC), churn, lifetime value (LTV) and payback, with a calculator in rupees, Canadian or US dollars, and why sales tax is not your revenue.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'Price ₹1,000 a month, cost to serve ₹300, payment fees 2 %. Gross margin per month?'
    choices: ['₹700', '₹680', '₹1,000']
    ans: 1
    why: '1,000 − 300 − 20 (2 % fees) = ₹680.'
  - q: 'If 5 % of customers leave each month, how long does the average customer stay?'
    choices: ['5 months', '20 months', '95 months']
    ans: 1
    why: 'Average lifetime ≈ 1 ÷ monthly churn = 1 ÷ 0.05 = 20 months.'
  - q: 'You charge a customer $100 plus $13 HST. What is your revenue?'
    choices: ['$113', '$100', '$87']
    ans: 1
    why: 'The $13 is tax you collect for the government. Your revenue is $100.'
sources:
  - 'CRA, Charge and collect the GST/HST: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html'
  - 'GST portal (India): https://www.gst.gov.in'
  - 'SBA, Calculate your startup costs: https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs'
---

<!--fig:country-->

**Module 2 · about 15 minutes · school maths.** You'll be able to set a starting price and check that each customer is worth more than it costs to win them.

## 1. Three ways to set a price

- **Cost-plus:** cost to make or serve, plus a margin. Simple, but ignores what customers would pay.
- **Competitor-based:** near what alternatives cost. Safe, but you inherit their mistakes.
- **Value-based:** a share of the money or time you save the customer. Usually the highest sensible price, and the best for B2B.

Start with value, check against competitors, and make sure it beats cost by a wide margin. It's easier to lower a price than raise it.

> **Key idea:** Prices you quote to customers are *before* sales tax unless you say "tax included". GST, HST and US sales tax belong to the government (Module 7). Retail prices in India are usually shown tax-inclusive (MRP), while Canadian and US shelf prices usually exclude tax.

## 2. Unit economics: one customer at a time

| Term | Meaning | Formula |
|---|---|---|
| Gross margin | What's left from each sale after direct costs | price − cost to serve − payment fees |
| CAC | Cost to win one customer | marketing and sales spend ÷ new customers |
| Churn | Share of customers who leave each period | lost ÷ customers at start |
| Lifetime | Average months a customer stays | 1 ÷ monthly churn |
| LTV | Gross margin over a customer's lifetime | margin per month × lifetime |
| Payback | Months to earn back CAC | CAC ÷ margin per month |

<!--fig:unit-econ-->

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a business grows profitably only if each customer is worth more than they cost to win: `$\text{LTV} > \text{CAC}$`, ideally by 3 times.

**Equations:** `$\text{LTV} = \dfrac{m}{c}$`, where *m* is gross margin per month and *c* is monthly churn as a decimal. Payback `$= \text{CAC} / m$`.

**Why 1 ÷ churn?** If 5 % leave each month, on average a customer survives 1 ÷ 0.05 = 20 months (a geometric distribution).
</details>

## 3. Worked example

*Made-up numbers.* Ravi charges ₹1,500 a month per pharmacy. SMS and hosting cost ₹250 per pharmacy, payment fees 2 % (₹30). He spends ₹45,000 on visits and ads and wins 10 pharmacies, so CAC = ₹4,500. Churn is 3 % a month.

- Margin: 1,500 − 250 − 30 = **₹1,220** a month (81 %).
- Lifetime: 1 ÷ 0.03 ≈ **33 months**.
- LTV: 1,220 × 33 ≈ **₹40,700**.
- LTV : CAC ≈ **9 : 1**. Payback ≈ 4,500 ÷ 1,220 ≈ **3.7 months**.

Excellent unit economics. If he registers for GST (Module 7), he adds 18 % on top: the pharmacy pays ₹1,770 and Ravi passes ₹270 to the government (less any input tax credit).

## 4. Practice

1. Price $49/month, cost to serve $9, fees 3 %, churn 4 %, CAC $300. Work out margin, LTV, payback.
2. What three levers improve LTV : CAC?
3. A product sells for ₹1,180 including 18 % GST. What is the price before GST?

<details>
<summary>Answers</summary>

1. Margin 49 − 9 − 1.47 = $38.53; lifetime 25 months; LTV ≈ $963; payback ≈ 7.8 months.
2. Raise price or margin, cut churn, cut CAC.
3. 1,180 ÷ 1.18 = ₹1,000.
</details>

**Next:** [Break-even and runway](/learn/courses/startup/break-even-runway/). The [[sales-tax-calculator]] adds or removes GST, HST or sales tax from any price.

**New words:** *gross margin*, *CAC*, *churn*, *LTV*, *payback period*, *value-based pricing*.

<p class="su-asof">Updated November 2026. Not tax advice.</p>
