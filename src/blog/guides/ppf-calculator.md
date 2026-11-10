---
title: "How a PPF account grows: deposit timing, interest and extensions"
summary: "Why the date you pay into a Public Provident Fund matters, how its once-a-year interest builds over 15 years, and what extending the account adds."
tools: [ppf-calculator, sip-calculator, compound-interest, india-income-tax]
updated: 2026-11-10
sources:
  - "Monthly interest on the lowest balance between the 5th and the month end, credited at the end of the financial year; 15-year term with 5-year extensions; deposits from Rs 500 to Rs 1,50,000 a year: Public Provident Fund Scheme, 2019."
  - "The rate is set by the Government of India every quarter (7.1% for October to December 2026). Check the official source, such as National Savings Institute (nsiindia.gov.in) or your bank or post office."
  - "The worked example was run through the site's own calculation code."
---

The Public Provident Fund (PPF) is a long-term savings account backed by the Government of India. It is slow and steady: money goes in each year, a rate set by the government is applied, and the account runs for at least 15 years. The [[ppf-calculator]] turns your yearly deposit, the current rate and the way you pay in into a maturity value, a growth chart and a table for every year. To weigh PPF against a market-linked monthly plan, open the [[sip-calculator]]; to see the general idea of interest on interest, the [[compound-interest]] calculator helps; and for the tax side of deposits, the [[india-income-tax|India income tax calculator]] is the next stop.

## What it is

PPF interest is worked out in a slightly unusual way. Each month, the account earns one twelfth of the yearly rate, but only on the **lowest balance between the 5th and the last day of that month**. Those twelve small amounts are added together and credited once, at the end of March, which closes the financial year (April to March).

So within a year the interest is simple, and across years it compounds: next year, last year's interest is part of the balance that earns.

For one year the idea is:

Interest = (rate ÷ 12) × (sum of the twelve monthly lowest balances)

- **rate** is the yearly PPF rate as a decimal (7.1% is 0.071).
- **monthly lowest balance** is what sits in the account from the 5th to the month end.

This rule is why timing matters. Money paid by 5 April counts for all twelve months. Money paid on the 6th of a month misses that month. A deposit made in March earns nothing until the next year.

The account matures after 15 full financial years. After that you can keep it open in blocks of 5 years, with or without fresh deposits, and the balance keeps earning.

## How to use it

1. Type your **Deposit each year** in rupees. The tool accepts ₹500 to ₹1,50,000, the scheme's limits.
2. Check the **Interest rate**. It starts at the current quarter's rate; change it if the government has reset it.
3. Under **When you pay in**, choose one payment by 5 April, twelve equal payments by the 5th of each month, or one payment at the end of the year in March.
4. If your account is already open, type its balance in **Already in the account**.
5. Choose whether to **extend** after 15 years (5 to 20 more years) and whether to keep paying in during those years.
6. Read the four cards (maturity value, money paid in, interest earned, years), then the chart and the year-by-year table. The table can be saved as a CSV file.

## A worked example

Arjun plans to put ₹60,000 a year into PPF at 7.1% for 15 years. He pays in ₹9,00,000 in all. He tries the three timing choices:

| When he pays | First-year interest | After 15 years |
|---|---|---|
| ₹60,000 by 5 April | ₹4,260 | about ₹16,27,284 |
| ₹5,000 by the 5th of each month | about ₹2,308 | about ₹15,77,840 |
| ₹60,000 in March | ₹0 | about ₹15,19,406 |

The first row is easy to check: 60,000 × 0.071 = 4,260 for a full year. Paying once in April instead of in March is worth about ₹1,07,878 more by maturity, with exactly the same money paid in.

He then picks "5 more years (20 in all)" with the April timing:

- **Keep paying in:** he puts in ₹12,00,000 and the balance reaches about ₹26,63,315.
- **No new deposits:** he stops at ₹9,00,000 paid in, and the balance still grows to about ₹22,93,035, simply from interest on the 15-year sum.

## Where it is used

- **Long goals:** a child's higher studies or a top-up for retirement fit the 15-year horizon.
- **Planning the yearly limit:** families who split savings between PPF and other schemes can test how much of the ₹1,50,000 limit to use.
- **Comparing with other savings:** the year table makes it easy to set PPF beside a fixed deposit from the [[fd-calculator]] or a fund plan from the SIP tool.
- **Deciding on extension:** near year 15, people can see what five more years add, with and without deposits.
- **Explaining timing to others:** the three timing choices show in rupees why an early April payment is a common habit.

## Common mistakes

1. **Assuming the rate is fixed.** It can change every quarter. Run the tool at a lower rate too, and check the official source for the current one.
2. **Paying after the 5th.** A payment on the 6th earns nothing for that month. Pay by the 5th to get that month's interest.
3. **Going over the yearly limit.** Money above ₹1,50,000 in a financial year does not earn interest under the scheme. The tool will not accept a higher figure.
4. **Mixing calendar and financial years.** The PPF year runs April to March. Count your deposits that way.
5. **Treating the result as exact.** Real accounts round interest and may see several rates over 15 years. Use the figure as an estimate.

## Questions people ask

**Why does monthly paying earn less than one April payment?** Because most of the money arrives later in the year and so sits in the account for fewer months. The total paid in is the same.

**Can I see what an account I opened years ago will reach?** Partly. Type today's balance in "Already in the account". The tool treats it as the starting balance and runs a fresh 15 years from there, so read the table row for the number of years your account has left.

**Does PPF beat a fixed deposit?** It depends on the rates at the time and on tax, which differs by person. Run both tools with the same yearly amount and check the official source for the tax rules.

This article is general education, not financial or tax advice.
