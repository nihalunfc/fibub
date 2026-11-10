---
name: RRSP or TFSA
num: 1736
shelf: money
code: T770
section: retirement
title: "RRSP vs TFSA calculator 2026: which account leaves you more after tax"
summary: "Compare the same savings in an RRSP and a TFSA after tax, using your tax rate now and in retirement, and work out your 2026 TFSA and RRSP contribution room."
seoTitle: "RRSP vs TFSA calculator 2026, with contribution room"
status: live
ads: true
order: 1736
icon: scale
works: offline
updated: 2026-11-10
related: [canada-income-tax, compound-interest, fhsa-calculator, cpp-oas-age]
sources:
  - "TFSA dollar limits 2009 to 2026 (2026: $7,000) and RRSP dollar limits (2026: $33,810): CRA, MP, DB, RRSP, DPSP, ALDA, TFSA limits, YMPE and the YAMPE, https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html (checked 2026-11-10)"
  - "RRSP room is 18% of the previous year's earned income up to the dollar limit, minus your pension adjustment, plus unused room; TFSA room builds from the year you turn 18 or become resident, and withdrawals are added back the next year: CRA rules as summarised on canada.ca (checked 2026-11-10). The comparison maths is fibub's own: TFSA = savings x growth; RRSP = savings / (1 - tax now) x growth x (1 - tax later)."
flow:
  - { icon: wallet, label: "Savings" }
  - { icon: percent, label: "Tax rates" }
  - { icon: scale, label: "Compare" }
  - { icon: check, label: "Your room" }
---

## What it does

An RRSP gives you a tax refund now and taxes the money when you take it out. A TFSA gives no refund, but growth and withdrawals are tax-free. Which one leaves you more depends almost entirely on one thing: your tax rate now compared with your tax rate when you withdraw. This calculator puts the same after-tax money into each account and shows what you keep at the end.

A second panel works out your 2026 room: TFSA room from the year you turned 18, and new RRSP room from last year's earned income. To find your marginal tax rate, use the [[canada-income-tax|Canada tax calculator]]; saving for a first home? Compare with the [[fhsa-calculator]].

## How to use it

1. Type the **money you have to save** after tax, and whether you save it every year or once.
2. Enter the **years** until you take it out and a **yearly return**.
3. Enter your **tax rate now** and the rate you expect **when you take it out** (both marginal rates).
4. Choose what happens to the **RRSP refund**.
5. Read the two results and the line underneath. For room, fill in the lower panel.

## What each setting does

- **Refund added to the RRSP:** you contribute more so the refund pays for the extra. This is the fair, like-for-like comparison.
- **Refund put into a TFSA:** the RRSP gets your money and the refund grows tax-free beside it.
- **Refund spent:** shows what happens if the refund is not saved; the RRSP usually loses.
- **Pension adjustment:** the box 52 amount on your T4 if you have a workplace pension; it reduces new RRSP room.

## Worked example

You save $5,000 a year for 25 years at 5%. Your tax rate is 30% now and 20% later. The TFSA ends at $250,567. The RRSP gets $7,143 a year (with the refund), grows to $357,953, and after 20% tax leaves $286,363, so the RRSP wins. Set both rates to 30% and the RRSP also leaves $250,567: equal rates give an equal outcome.

Born in 1995 and never contributed? Your TFSA room from 2013 to 2026 is $89,000.

## FAQs

**Which should I pick if I am not sure?** If your income is low now, the TFSA usually wins; if it is high now and will be lower in retirement, the RRSP usually wins. Many people use both.

**What about OAS and GIS?** RRSP withdrawals count as income and can reduce income-tested benefits; TFSA withdrawals do not. See the [[cpp-oas-age]] tool for the OAS clawback.

**Is my room exact?** No. Your real figures are on CRA My Account or your Notice of Assessment. Check the official source. Not financial or tax advice.
