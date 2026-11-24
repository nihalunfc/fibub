---
title: "Food carbon footprints over 20 versus 100 years: how much is methane?"
summary: "A 2026 paper recomputes the footprint of 222 foods over 20 and 100 years. We use its numbers to back out the methane in each food and rerun two diets in the carbon footprint calculator."
tools: [carbon-footprint, lca-compare, scope-emissions]
updated: 2026-11-24
sources:
  - "Osborn, K., Crocker, S., Presley, K., Shenkiryk, A., Spire, M., Molidor, J., Kapur, M. and Jay, J. A. (2026), Comparison of food carbon footprints using 20- and 100-year timeframes, Frontiers in Sustainable Food Systems 10, doi:10.3389/fsufs.2026.1717648. Licence CC BY 4.0, checked in the Crossref record (no correction or retraction), 2026-11-24. Values used here (kg CO2e per kg of food, 20-year / 100-year): beef 70.55 / 28.73, lamb 60.27 / 27.91, cheddar 21.49 / 9.78, butter 24.88 / 11.52, milk 3.05 / 1.39, shrimp 16.34 / 14.85, chicken breast 4.63 / 4.12, rice 6.48 / 2.66, black beans 0.68 / 0.62, apple 0.35 / 0.34; category means: red meat 62.43 / 26.71, dairy 12.50 / 5.74, vegetables 0.78 / 0.73. The publisher page was read in full text; its licence line was not shown there, so the licence is from Crossref."
  - "Methane global warming potentials of 80.8 (20-year) and 27.0 (100-year) for non-fossil methane, and 273 for nitrous oxide over both periods: IPCC Sixth Assessment Report, Working Group I, Chapter 7, Table 7.15. Our assumption for the back-calculation; the paper's own factors were not read by us."
paper:
  title: "Comparison of food carbon footprints using 20- and 100-year timeframes"
  authors: "Osborn K, Crocker S, Presley K, Shenkiryk A, Spire M, Molidor J, Kapur M, Jay JA"
  journal: "Frontiers in Sustainable Food Systems"
  year: 2026
  doi: "10.3389/fsufs.2026.1717648"
  url: "https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2026.1717648/full"
  licence: "CC BY 4.0"
  reviewed: true
---

A carbon footprint is a single number, but behind it sits a choice: how long do you count the warming of each gas? Methane traps much more heat than carbon dioxide, but it breaks down in about a decade, so over 20 years it counts for far more than over 100. A 2026 paper recalculated the footprint of 222 foods both ways, and the gap is large for beef, dairy and rice. This article takes the paper's per-food numbers, works out how much methane they imply, and redoes the sums for two made-up diets in the [[carbon-footprint]] calculator. To compare whole products, see the [[lca-compare]] tool; for a company, the [[scope-emissions]] calculator.

## The paper in brief

A footprint in **CO₂e** (carbon dioxide equivalent) adds up each gas's emissions, multiplied by its **global warming potential**, GWP, the warming it causes over a stated period compared with CO₂. The usual period is 100 years (GWP100). The authors repeated 222 food items with a 20-year period (GWP20), keeping everything else the same. The result: red meat's footprint rises by a factor of about 2.34, dairy about 2.2, vegetables only about 7 %. They also compared 15 university dining-hall meals under both periods. The methane-heavy foods carry the change, because nitrous oxide's potential is the same (273) over both periods, so only methane moves.

## Checked with the tools

This is a **recomputation from the paper's printed per-food values**, plus a **simulation** of two diets whose amounts are our own.

**Step 1: the ratios.** Dividing each food's 20-year value by its 100-year value gives beef 2.46, rice 2.44, cheddar 2.20, milk 2.19, butter 2.16, lamb 2.16, but chicken 1.12, shrimp 1.10, black beans 1.10 and apple 1.03. The category means give 62.43 ÷ 26.71 = 2.34 for red meat (the paper says about 2.34) and 0.78 ÷ 0.73 = 1.07 for vegetables, a 6.8 % rise (the paper says about 7 %).

<!-- fig:ratios -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="Ratio of the 20-year to the 100-year footprint for ten foods, from Beef 2.46, Rice 2.44, Cheddar cheese 2.20, Milk 2.19, Butter 2.16, Lamb 2.16, Chicken breast 1.12, Shrimp 1.10, Black beans 1.10, Apple 1.03." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How much worse each food looks over 20 years</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How much worse each food looks over 20 years</text><line x1="58" x2="546" y1="222.1" y2="222.1" style="stroke:var(--line)"/><text x="52" y="226.1" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="162.7" y2="162.7" style="stroke:var(--line)"/><text x="52" y="166.7" text-anchor="end" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="103.3" y2="103.3" style="stroke:var(--line)"/><text x="52" y="107.3" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="43.9" y2="43.9" style="stroke:var(--line)"/><text x="52" y="47.9" text-anchor="end" style="fill:var(--muted)">2.5</text><line x1="131.2" x2="131.2" y1="234" y2="238" style="stroke:var(--muted)"/><text x="131.2" y="251" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="228.8" x2="228.8" y1="234" y2="238" style="stroke:var(--muted)"/><text x="228.8" y="251" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="326.4" x2="326.4" y1="234" y2="238" style="stroke:var(--muted)"/><text x="326.4" y="251" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="424" x2="424" y1="234" y2="238" style="stroke:var(--muted)"/><text x="424" y="251" text-anchor="middle" style="fill:var(--muted)">8</text><line x1="521.6" x2="521.6" y1="234" y2="238" style="stroke:var(--muted)"/><text x="521.6" y="251" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Food, ordered by ratio (1 = Beef … 10 = Apple)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">GWP20 ÷ GWP100</text><line x1="58" x2="546" y1="222.1" y2="222.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="217.1" text-anchor="end" style="fill:var(--muted)">no difference</text><circle cx="82.4" cy="49.1" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="131.2" cy="51.5" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="180" cy="79.9" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="228.8" cy="80.2" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="277.6" cy="84.3" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="326.4" cy="84.4" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="375.2" cy="207.4" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="424" cy="210.2" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="472.8" cy="210.6" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="521.6" cy="218.7" r="5" style="fill:var(--c-blog);opacity:1"/><text class="fibub-mark" x="546" y="272" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The paper's 20-year value divided by its 100-year value for ten foods. Order, left to right: 1 Beef, 2 Rice, 3 Cheddar cheese, 4 Milk, 5 Butter, 6 Lamb, 7 Chicken breast, 8 Shrimp, 9 Black beans, 10 Apple.</figcaption></figure>
<!-- /fig:ratios -->

**Step 2: how much methane is in each food?** Both footprints are CO₂ + N₂O + CH₄ parts. Subtract them and only methane is left: GWP20 − GWP100 = (80.8 − 27.0) × kg CH₄. For beef that is (70.55 − 28.73) ÷ 53.8 = **0.78 kg of methane per kilogram of beef**, and methane's share of the 100-year footprint is 0.78 × 27.0 ÷ 28.73 = **73 %**. For red meat on average, 0.66 kg. Rice comes out at 0.071 kg of methane per kilogram (72 % of its 100-year footprint), cheddar at 0.22 kg (60 %), milk at 0.031 kg (60 %), chicken at 0.0095 kg (6 %) and apple at 0.0002 kg (1.5 %). These use the IPCC's methane potentials (**our assumption**) and assume that any difference between the two timeframes is methane.

**Step 3: two diets.** We made up two one-person diets, in kilograms a year: *meat and dairy* (15 kg beef, 20 kg chicken, 10 kg cheddar, 25 kg rice, 5 kg black beans, 30 kg apples) and *plant-leaning* (3 kg beef, 15 kg chicken, 5 kg cheddar, 25 kg rice, 25 kg black beans, 60 kg apples). They are not typical diets and not advice. Summing amount × factor, as the calculator does:

| Diet | 100-year basis | 20-year basis | Ratio |
|---|---|---|---|
| Meat and dairy | 690.95 kg CO₂e | 1,541.65 kg | 2.23 |
| Plant-leaning | 299.29 kg | 588.55 kg | 1.97 |

Swapping to the plant-leaning diet cuts the footprint by 56.7 % on a 100-year basis and by **61.8 %** on a 20-year basis. The ranking does not change, but the size of the saving does, and that is the practical point of the paper: a timeframe is a decision, not a measurement.

<!-- fig:diets -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Footprint of two made-up yearly diets with the paper's per-kilogram values: Meat and dairy 1542 kg on a 20-year basis and 691 kg on a 100-year basis; Plant-leaning 589 kg on a 20-year basis and 299 kg on a 100-year basis." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Two made-up diets, one year, one person</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Two made-up diets, one year, one person</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="192.6" y2="192.6" style="stroke:var(--line)"/><text x="52" y="196.6" text-anchor="end" style="fill:var(--muted)">500</text><line x1="58" x2="546" y1="133.2" y2="133.2" style="stroke:var(--line)"/><text x="52" y="137.2" text-anchor="end" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="73.8" y2="73.8" style="stroke:var(--line)"/><text x="52" y="77.8" text-anchor="end" style="fill:var(--muted)">1.5e+3</text><line x1="180" x2="180" y1="252" y2="256" style="stroke:var(--muted)"/><text x="180" y="269" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="424" x2="424" y1="252" y2="256" style="stroke:var(--muted)"/><text x="424" y="269" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Diet (1 = Meat and dairy, 2 = Plant-leaning)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">kg CO₂e per year</text><circle cx="180" cy="68.8" r="6" style="fill:var(--c-blog);opacity:1"/><circle cx="424" cy="182" r="6" style="fill:var(--c-blog);opacity:1"/><circle cx="180" cy="169.9" r="6" style="fill:var(--c-tools);opacity:1"/><circle cx="424" cy="216.5" r="6" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">20-year basis</text><circle cx="182.6" cy="36" r="4" style="fill:var(--c-tools)"/><text x="193.6" y="40" style="fill:var(--muted)">100-year basis</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The yearly footprint of two made-up diets (our amounts) using the paper's per-kilogram factors, summed the way the Carbon footprint calculator sums food lines.</figcaption></figure>
<!-- /fig:diets -->

## How we made the graphs

The script `scripts/blog-figures/food-carbon-footprint-gwp20-vs-gwp100-methane-share.mjs` calls `footprint` from `src/lib/sci/footprint.ts`, the maths of the [[carbon-footprint]] calculator (amount × factor, summed by category, per person). The per-kilogram values are from the paper's text. The two diets, and the IPCC methane potentials used to back out methane, are **our assumptions**. The ratios and methane shares are plain arithmetic in the script.

## How we test the maths

On every change, `tests/sci.mjs` runs `tests/sci-tools/carbon-footprint.mjs`, which pins the tool against pandas sums and GeographicLib distances over 6,101 checks. New with this article:

- The meat-and-dairy diet must total 1,541.65 kg CO₂e on the 20-year factors and 690.95 kg on the 100-year factors.
- The plant-leaning diet must total 588.55 and 299.29 kg, a 61.8 % and 56.7 % cut.

## Check it yourself

On the [[carbon-footprint]] calculator:

1. Set *People in the household* to **1** and press **Clear all amounts**.
2. In *Food (per person)* use **Add a line** until there are six lines. For each, type the *Item*, the *Amount* **in kg**, the *Unit* **kg** and the *kg CO₂e per kg* factor: **Beef 15, 28.73**; **Chicken breast 20, 4.12**; **Cheddar cheese 10, 9.78**; **Rice 25, 2.66**; **Black beans 5, 0.62**; **Apple 30, 0.34**.
3. The food total should read **690.95 kg** (the 100-year basis). Press **Keep as a scenario** and name it *100-year*.
4. Change the six factors to **70.55, 4.63, 21.49, 6.48, 0.68, 0.35** and the total becomes **1,541.65 kg**. Keep it as *20-year*.
5. Compare the two scenarios side by side: the 20-year total is 2.23 times the 100-year total.

## What researchers can use it for

- **Running a footprint under two timeframes** and reporting both, rather than only the default.
- **Finding the methane in a food's footprint** from two published values, as in Step 2.
- **Checking an LCA table** by looking at the 20- to 100-year ratio: a ratio near 1 means little methane, above 2 means a lot.
- **Comparing diets or menus** in a dining hall with the same food list and two factor sets (see the [[lca-compare]] tool for products).
- **Teaching** why the same activity can look cleaner or dirtier depending on the accounting period.

## The fine print

- The back-calculated methane uses our IPCC factors and assumes that CO₂ and N₂O are the same in both columns. If the paper used slightly different potentials, the kilograms of methane would shift a little.
- Our two diets are invented for illustration and are not typical or recommended diets.
- We used only ten items and three category means from the paper's text. The paper's own meal comparison, in a figure, is not recomputed.
- Food footprints vary a lot with country and farm; the paper's values are averages, and the calculator multiplies whatever factors you give it.
