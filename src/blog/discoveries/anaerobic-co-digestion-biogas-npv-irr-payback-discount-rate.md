---
title: "NPV 19 m, IRR 36 %, payback 3 years: can all three be true?"
summary: "A 2025 techno-economic study of anaerobic co-digestion reports three headline finance numbers. A simple payback of three years caps the IRR at 33 %, so we use fibub's NPV and IRR tool to find the cash-flow shape that makes 36 % possible."
tools: [npv-irr-calculator, lcoe-calculator, inflation-calculator, uncertainty-calculator]
updated: 2026-11-24
sources:
  - "Gao, R., Li, D. and Zhang, D. (2025), An AI Agent for Techno-Economic Analysis of Anaerobic Co-Digestion in Renewable Energy Applications, Energies 18(21): 5632, doi:10.3390/en18215632. Licence CC BY 4.0, confirmed from the Crossref record for the DOI on 2026-11-24 (no retraction or correction is recorded). Values used here: the mix2 membrane configuration reaches a net present value of GBP 19 million, an internal rate of return of 36 % and a payback period of 3 years; membrane upgrading gives net revenues of GBP 4.0 million a year against GBP 3.5 million for cryogenic upgrading, with energy use of 2400 against 3000 MWh a year; the sensitivity analysis finds natural gas prices and tax rates critical and water costs negligible. The digester capital cost equation is 3395.42 (D1^0.6999 + D2^0.6999) in GBP, updated from 2013 with CEPCI indices of 567.3 and 790.7, and annual operation and maintenance is 7 % of that capital cost."
  - "Standard discounted-cash-flow definitions (net present value, internal rate of return, simple and discounted payback, profitability index, modified IRR, equivalent annual amount) as implemented in src/lib/sci/npv.ts and checked against numpy-financial."
paper:
  title: "An AI Agent for Techno-Economic Analysis of Anaerobic Co-Digestion in Renewable Energy Applications"
  authors: "Gao R, Li D, Zhang D"
  journal: "Energies"
  year: 2025
  doi: "10.3390/en18215632"
  url: "https://www.mdpi.com/1996-1073/18/21/5632"
  licence: "CC BY 4.0"
  reviewed: true
---

Techno-economic papers usually end with three numbers: a net present value, an internal rate of return and a payback period. Readers treat them as three separate facts, but they are not independent, and one of them can rule out another. A 2025 study in *Energies* built a language-model agent that sets up and runs techno-economic models of **anaerobic co-digestion**, the breaking down of mixed organic waste by microbes without oxygen to make biogas, and reports a net present value of GBP 19 million, an internal rate of return of 36 % and a payback of 3 years for its best configuration. We put those three numbers through the [[npv-irr-calculator|NPV and IRR tool]], find that they cannot all hold for a steady income, and work out the cash-flow shape that makes them fit. For the neighbouring jobs, see [[lcoe-calculator]] for cost per unit of energy, [[inflation-calculator]] for real against nominal money and [[uncertainty-calculator]] for carrying errors through a calculation.

## The paper in brief

The authors wired a large language model to a set of process and costing equations so that a user can describe a co-digestion plant in words and get a full techno-economic model back: digester sizing, biogas yield, upgrading to biomethane, combined heat and power, digestate treatment and the money. Their digester capital cost follows a scaling law in digester volume, 3395.42 × (D₁^0.6999 + D₂^0.6999) pounds, brought forward from 2013 prices with chemical plant cost indices, and operation and maintenance is set at 7 % of that capital cost a year.

Four scenarios are compared. **Membrane** upgrading beats **cryogenic** upgrading, giving net revenues of GBP 4.0 million a year against 3.5 million while using 2400 rather than 3000 MWh a year. The best feedstock mix, called mix2, reaches **NPV GBP 19 million, IRR 36 % and a 3-year payback**. The sensitivity analysis finds that natural gas prices and tax rates matter and water costs do not.

## Checked with the tools

**Step 1: the payback period caps the IRR.** If a plant costs *C* today and then earns the same amount *A* every year, its simple payback is *P* = *C* / *A*. Discount that steady income for ever and its present value is *A* / *r*, so the internal rate of return — the rate at which the present value equals *C* — satisfies *A* / *r* = *C*, that is **r = 1 / P**. A longer life can only bring the IRR closer to that limit from below, never past it. The tool's own `irrAll` function confirms it: with a 3-year payback and 60 years of level income, the IRR is 33.333 %; at 20 years it is 33.226 %.

| Simple payback | Highest possible IRR (level income) |
|---|---|
| 2 years | 50.0 % |
| 2.5 years | 40.0 % |
| 3 years | **33.3 %** |
| 4 years | 25.0 % |
| 5 years | 20.0 % |

So a 3-year payback and an IRR of **36 %** cannot both come from a steady income, whatever the project's life. Figure 1 shows both curves: the level-income line flattens out under 33.3 % and never touches 36 %.

<!-- fig:ceiling -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="Internal rate of return against project life for a plant whose simple payback is 3 years. With level cash flows the IRR can never pass 33.3 %; with cash flows growing 4.2 % a year it reaches the paper's 36 % at 20 years." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>A 3-year payback puts a ceiling on the IRR</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">A 3-year payback puts a ceiling on the IRR</text><line x1="58" x2="546" y1="221.2" y2="221.2" style="stroke:var(--line)"/><text x="52" y="225.2" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="139.7" y2="139.7" style="stroke:var(--line)"/><text x="52" y="143.7" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="58.2" y2="58.2" style="stroke:var(--line)"/><text x="52" y="62.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="110.3" x2="110.3" y1="262" y2="266" style="stroke:var(--muted)"/><text x="110.3" y="279" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="197.4" x2="197.4" y1="262" y2="266" style="stroke:var(--muted)"/><text x="197.4" y="279" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="284.6" x2="284.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="284.6" y="279" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="371.7" x2="371.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="371.7" y="279" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="458.9" x2="458.9" y1="262" y2="266" style="stroke:var(--muted)"/><text x="458.9" y="279" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Project life (years)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">IRR (% a year)</text><line x1="58" x2="546" y1="85.3" y2="85.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="80.3" text-anchor="end" style="fill:var(--muted)">ceiling 33.3 %</text><line x1="58" x2="546" y1="74.5" y2="74.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="69.5" text-anchor="end" style="fill:var(--muted)">the paper's 36 %</text><path d="M58 316L75.4 221.2L92.9 169.9L110.3 140.3L127.7 122.2L145.1 110.7L162.6 103.1L180 97.9L197.4 94.4L214.9 91.9L232.3 90.1L249.7 88.8L267.1 87.9L284.6 87.2L302 86.8L319.4 86.4L336.9 86.1L354.3 85.9L371.7 85.8L389.1 85.7L406.6 85.6L424 85.5L441.4 85.5L458.9 85.4L476.3 85.4L493.7 85.4L511.1 85.4L528.6 85.4L546 85.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 319.6L75.4 221.2L92.9 167L110.3 135.3L127.7 115.7L145.1 103.1L162.6 94.6L180 88.8L197.4 84.8L214.9 81.9L232.3 79.8L249.7 78.3L267.1 77.2L284.6 76.3L302 75.7L319.4 75.3L336.9 74.9L354.3 74.7L371.7 74.5L389.1 74.3L406.6 74.2L424 74.1L441.4 74L458.9 74L476.3 74L493.7 73.9L511.1 73.9L528.6 73.9L546 73.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Level cash flows</text><line x1="199.2" x2="211.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="215.2" y="40" style="fill:var(--muted)">Growing 4.2 % a year</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. What a three-year simple payback allows. Worked out with the NPV and IRR tool’s own `irrAll` function for project lives of 2 to 30 years.</figcaption></figure>
<!-- /fig:ceiling -->

**Step 2: find the cash flow that does fit.** The way out is income that **grows**. Early years then pay the capital back fast (a short payback) while later years keep adding value (a high IRR). Taking the paper's GBP 4.0 million as the first full year's net revenue, a 20-year life (**our assumption**; the paper does not state one in its readable text) and a payback of exactly 3.0 years, we asked the tool for the growth rate that lands the IRR on 36 %, then for the discount rate that lands the NPV on GBP 19 million.

| Quantity | Value |
|---|---|
| Capital cost, implied | **GBP 12.51 million** |
| Net revenue, year 1 | GBP 4.0 million (the paper's figure) |
| Growth in net revenue | **4.18 % a year** |
| Project life | 20 years (our assumption) |
| Simple payback | 3.000 years (the paper's 3) |
| Internal rate of return | 36.00 % (the paper's 36 %) |
| Discount rate needed | **15.16 % a year** |
| Net present value at that rate | GBP 19.00 million (the paper's 19) |

All three headline numbers come out together, and the price of making them fit is a pair of readings the paper does not print: the project is being discounted at about **15 %**, a private-sector hurdle rate rather than a public one, and its income is assumed to **rise about 4 % a year**, which is just what the paper's own sensitivity analysis implies when it calls natural gas prices critical. Figure 2 is the tool's NPV profile for that cash flow: GBP 19 million at 15.2 %, zero at 36 %.

<!-- fig:profile -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 290" role="img" aria-label="Net present value of the reconstructed 20-year cash flow against the discount rate. It passes GBP 19 million at 15.2 % and zero at the 36 % internal rate of return." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>NPV profile of the reconstructed project</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">NPV profile of the reconstructed project</text><line x1="58" x2="546" y1="227.7" y2="227.7" style="stroke:var(--line)"/><text x="52" y="231.7" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="162.5" y2="162.5" style="stroke:var(--line)"/><text x="52" y="166.5" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="97.2" y2="97.2" style="stroke:var(--line)"/><text x="52" y="101.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="58" y1="244" y2="248" style="stroke:var(--muted)"/><text x="58" y="261" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="244" y2="248" style="stroke:var(--muted)"/><text x="155.6" y="261" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="253.2" x2="253.2" y1="244" y2="248" style="stroke:var(--muted)"/><text x="253.2" y="261" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="350.8" x2="350.8" y1="244" y2="248" style="stroke:var(--muted)"/><text x="350.8" y="261" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="448.4" x2="448.4" y1="244" y2="248" style="stroke:var(--muted)"/><text x="448.4" y="261" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="546" x2="546" y1="244" y2="248" style="stroke:var(--muted)"/><text x="546" y="261" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--muted)"/><text x="302" y="282" text-anchor="middle" style="fill:var(--ink)">Discount rate (% a year)</text><text transform="translate(14 138) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">NPV (GBP million)</text><line x1="58" x2="546" y1="227.7" y2="227.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="58" x2="546" y1="165.7" y2="165.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="160.7" text-anchor="end" style="fill:var(--muted)">the paper's NPV, GBP 19 m</text><line x1="206" x2="206" y1="32" y2="244" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="210" y="44" text-anchor="start" style="fill:var(--muted)">15.2 %</text><line x1="409.4" x2="409.4" y1="32" y2="244" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="405.4" y="44" text-anchor="end" style="fill:var(--muted)">IRR 36 %</text><path d="M58 -127.1L62.9 -104.6L67.8 -83.7L72.6 -64.4L77.5 -46.4L82.4 -29.8L87.3 -14.3L92.2 0.1L97 13.5L101.9 26L106.8 37.7L111.7 48.6L116.6 58.7L121.4 68.2L126.3 77.1L131.2 85.4L136.1 93.2L141 100.6L145.8 107.4L150.7 113.9L155.6 120L160.5 125.7L165.4 131.1L170.2 136.1L175.1 140.9L180 145.5L184.9 149.7L189.8 153.8L194.6 157.6L199.5 161.2L204.4 164.7L209.3 167.9L214.2 171L219 173.9L223.9 176.7L228.8 179.4L233.7 181.9L238.6 184.3L243.4 186.6L248.3 188.8L253.2 190.9L258.1 192.9L263 194.8L267.8 196.7L272.7 198.4L277.6 200.1L282.5 201.7L287.4 203.2L292.2 204.7L297.1 206.1L302 207.5L306.9 208.8L311.8 210L316.6 211.3L321.5 212.4L326.4 213.5L331.3 214.6L336.2 215.7L341 216.7L345.9 217.6L350.8 218.6L355.7 219.5L360.6 220.4L365.4 221.2L370.3 222L375.2 222.8L380.1 223.6L385 224.3L389.8 225L394.7 225.7L399.6 226.4L404.5 227.1L409.4 227.7L414.2 228.3L419.1 228.9L424 229.5L428.9 230.1L433.8 230.6L438.6 231.1L443.5 231.7L448.4 232.2L453.3 232.7L458.2 233.1L463 233.6L467.9 234.1L472.8 234.5L477.7 234.9L482.6 235.4L487.4 235.8L492.3 236.2L497.2 236.6L502.1 237L507 237.3L511.8 237.7L516.7 238.1L521.6 238.4L526.5 238.7L531.4 239.1L536.2 239.4L541.1 239.7L546 240" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="282" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The NPV profile of the 20-year cash flow that reproduces all three of the paper’s headline numbers at once. The dashed verticals mark the discount rate that gives GBP 19 million and the 36 % internal rate of return.</figcaption></figure>
<!-- /fig:profile -->

The tool adds three more numbers for the same project: the **discounted** payback is 4.21 years rather than 3.00, the profitability index is 2.52 (every pound of capital returns 2.52 pounds of present value), and the modified IRR, which assumes spare cash is reinvested at the discount rate instead of at the IRR, is a much soberer **20.6 %**. For a project reported at 36 %, that gap is the single most useful thing a reader can know.

The same arithmetic also sharpens the paper's membrane-against-cryogenic comparison. GBP 0.5 million a year of extra net revenue, for 20 years, discounted at 15.16 %, is worth about GBP 3.1 million in present value, so the upgrading choice is roughly a sixth of the whole project's NPV.

## How we made the graphs

Both charts and every number come from `scripts/blog-figures/anaerobic-co-digestion-biogas-npv-irr-payback-discount-rate.mjs` in fibub's public code. It calls `npv`, `irrAll`, `payback`, `mirr`, `profitabilityIndex` and `equivalentAnnuity` from `src/lib/sci/npv.ts`, the maths behind the [[npv-irr-calculator|NPV and IRR tool]]. The growth rate and the discount rate are each found by bisection on those same functions, not by a formula of ours.

The inputs taken from the paper are GBP 4.0 million a year of net revenue, NPV GBP 19 million, IRR 36 % and a payback of 3 years. The 20-year life, the smooth constant growth rate and the assumption that the paper's payback is the **simple** (undiscounted) one are **our assumptions**. Nothing here is a reconstruction of the paper's own cash-flow table, which is not in the text we could read; it is a demonstration of which cash flows are consistent with the numbers it prints.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/npv-irr-calculator.mjs`, which pins this maths against `numpy_financial` 1.1 and `numpy.roots` on six projects:

- The example project −10,000 then 3000, 4200, 4800, 2500, 1500 must give NPV 2443.5738 at 10 %, a single IRR of 20.0142 %, MIRR 15.9325 % at an 8 % finance and 12 % reinvestment rate, and payback and discounted payback matching `numpy.cumsum`.
- A project with three sign changes (−1000, 6000, −11000, 6000) must return **all three** of its IRRs, 0 %, 100 % and 200 %, matching the real roots from `numpy.roots`, because reporting only the first would be misleading.
- The double root of −1, 2, −1 must be found, and a project with no sign change must return no IRR at all.
- New with this article: level cash flows with a simple payback of P years must give an IRR that approaches 1 / P from below over 60 years (33.333 % for P = 3), and the 20-year reconstructed biogas cash flow must give an IRR of 36.000 %, a simple payback of 3.0000 years, an NPV of GBP 19.000 million at 15.1610 %, a discounted payback of 4.206 years, a profitability index of 2.519 and a modified IRR of 20.61 %.

## Check it yourself

On the [[npv-irr-calculator|NPV and IRR tool]]:

1. Clear the cash-flow box and paste the reconstructed project, in GBP million, one year per line (today first):

```
-12.51
4
4.17
4.34
4.52
4.71
4.91
5.11
5.33
5.55
5.78
6.02
6.27
6.53
6.81
7.09
7.39
7.70
8.02
8.35
8.70
```

2. Set *Discount rate (% per period)* to **15.16**, leave *Periods are* on **Years**, and set *Currency sign* to **£**.
3. You should read an NPV of about **£19.00 million**, one *IRR* of **36.00 %**, a *payback* of **3.00 years** and a *discounted payback* of about **4.19 years**.
4. Change the discount rate to **36** and watch the NPV fall to zero: that is what an internal rate of return means.
5. Set the discount rate back to **15** and read the *profitability index* (about **2.55**) and the *equivalent yearly amount* (about **£3.09 million**), then leave the two MIRR boxes empty so they follow the discount rate: the modified IRR is about **20.5 %**, far below 36 %.
6. Now flatten the project: replace every yearly figure with **4.17** and keep the −12.51. The payback stays near 3 years but the IRR drops to about **33 %** and will not go higher however many extra years you add.

## What researchers can use it for

- **Audit a published appraisal in two minutes.** Type the capital cost and the cash flows, or work backwards from the reported payback as we did, and see whether NPV, IRR and payback can hold together.
- **Report the discount rate and the project life.** Our reconstruction shows why: without them an NPV is not reproducible, and the same plant can be worth GBP 19 million or GBP 33 million.
- **Prefer the modified IRR for long projects.** A plain IRR of 36 % assumes every pound of surplus is reinvested at 36 %. The tool's MIRR says what happens at a realistic rate.
- **Check for several IRRs.** Any project with a mid-life overhaul or a decommissioning cost has more than one sign change, and the tool returns every root instead of the first one a spreadsheet happens to find.
- **Compare options at the margin**, as with membrane against cryogenic upgrading here: discount the difference in cash flows rather than two whole projects.

## The fine print

- The paper does not print its capital cost, discount rate, project life or cash-flow table in the text we could read. The 20-year life and the smooth growth are **ours**, chosen to reproduce its three published numbers, and other combinations also work: a 15-year life needs 4.89 % growth and a 13.9 % discount rate, a 30-year life 3.96 % and 16.2 %.
- Our cash flow is a **reconstruction**, not the paper's data. It shows what is consistent with the published figures, not what the authors actually modelled.
- We read "payback period" as the simple, undiscounted one, which is the usual meaning. If the paper means the discounted payback, its numbers would need an even faster-growing income.
- The paper's own caution applies: its figures depend on natural gas prices and tax rates, both of which move.
- General information about project appraisal, not investment advice.
