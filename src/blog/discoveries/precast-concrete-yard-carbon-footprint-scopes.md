---
title: "Rebuilding a precast concrete yard's carbon footprint, row by row"
summary: "A 2025 case study puts a Thai precast yard at 915.489 tCO2e, 98 % of it Scope 3. We rebuild the whole inventory in fibub's Scope emissions tool, match it to the last kilogram, and find two arithmetic slips."
tools: [scope-emissions, carbon-footprint, lca-compare]
updated: 2026-11-24
sources:
  - "Suriyanon, N., Sutheerawatthana, P., Rinchumphu, D. and Suksawat, R. (2025), Carbon footprint assessment of a precast concrete yard: A case study from Thailand, Construction Economics and Building 25(2), doi:10.5130/AJCEB.v25i2.9030. Licence CC BY 4.0, checked on the journal's article page and in the Crossref record, 2026-11-24. Values used here: the yard's 2022 production of 2,054.60 m3 (67.84 % of a 3,028.80 m3 capacity); total 915.489 tCO2e with Scope 1 6.759 (0.74 %), Scope 2 10.790 (1.18 %) and Scope 3 897.940 (98.08 %); intensity 0.445580 tCO2e per m3; every activity amount and emission factor in the paper's Scope 1, 2 and 3 tables (LPG 420 kg at 3.1134, gasoline 218 L at 2.1894, diesel 950 L at 2.7406, R-410A 0.30 and 0.32 kg at GWP 2,090, septic-tank methane 38.34 kg at GWP 28, electricity 15,618 and 5,967 kWh at 0.4999, ready-mix concrete 2,198 m3 at 294, reinforcement bar 65,743.43 kg at 2.14, wire mesh 44,064.84 kg at 1.6382, tap water 14,765 m3 at 0.541, freight in tonne-kilometres and empty-return kilometres, waste and commuting rows); the factors' sources (Thailand Greenhouse Gas Management Organization, and Ecoinvent 2.2 with IPCC 2007 GWP100a for wire mesh); the full-capacity scenario (1,343.600 tCO2e, 0.443608 t per m3); ready-mix 70.59 % of the footprint and 71.84 % with its transport; and the 143.40 m3 over-order."
  - "Inventory structure and scope definitions: GHG Protocol Corporate Accounting and Reporting Standard (WRI and WBCSD, revised 2004) and the Corporate Value Chain (Scope 3) Standard (2011). Structure only; fibub builds in no emission factors."
paper:
  title: "Carbon footprint assessment of a precast concrete yard: A case study from Thailand"
  authors: "Suriyanon N, Sutheerawatthana P, Rinchumphu D, Suksawat R"
  journal: "Construction Economics and Building"
  year: 2025
  doi: "10.5130/AJCEB.v25i2.9030"
  url: "https://epress.lib.uts.edu.au/journals/index.php/AJCEB/article/view/9030"
  licence: "CC BY 4.0"
  reviewed: true
---

A carbon footprint is a long multiplication: every amount of fuel, electricity, material, lorry journey and bag of waste times a factor in kilograms of CO₂e per unit, added up in the three scopes of the GHG Protocol. That makes a published footprint one of the few results in science you can check completely, if the authors print their activity data and their factors. A 2025 case study in *Construction Economics and Building* does exactly that for a precast concrete yard in Chiang Mai, Thailand, for the year 2022. We typed all 35 of its activity rows into the maths behind fibub's [[scope-emissions]] tool and got the paper's headline total back to within one kilogram in 915 tonnes. Along the way two small arithmetic slips turned up. For a household rather than a workplace, see the [[carbon-footprint]] calculator; to compare two ways of making the same thing, [[lca-compare]].

## The paper in brief

The yard cast 2,054.60 m³ of precast parts in 2022 (56 detached-house sets and 76 semi-detached), about 68 % of its capacity. The authors built a full inventory: direct fuel and refrigerant leaks (Scope 1), purchased electricity (Scope 2), and purchased goods, upstream energy, inbound and outbound lorry trips, waste and commuting (Scope 3), with factors from Thailand's Greenhouse Gas Management Organization and, for wire mesh, from Ecoinvent.

The result: **915.489 tCO₂e, of which 98.08 % is Scope 3**, and **ready-mix concrete alone is 70.59 %**. Emissions per cubic metre were 0.445580 t. Running the yard at full capacity would spread the small fixed part thinner and cut intensity by less than half a per cent, so the only real lever is the concrete: buying less of it, or buying it from a supplier with a lower factor.

## Checked with the tools

The tool takes one line per activity — year, type, description, amount, unit, factor — sorts the lines into scopes and categories, and totals them. We wrote the paper's tables as 35 such lines and read the result.

| Check | Paper | Scope emissions tool |
|---|---|---|
| Scope 1 | 6.759 t | 6.758 t |
| Scope 2 (location-based) | 10.790 t | 10.790 t |
| Scope 3 | 897.940 t | 897.940 t |
| **Total** | **915.489 t** | **915.488 t** |
| Scope shares | 0.74 / 1.18 / 98.08 % | 0.74 / 1.18 / 98.08 % |
| Purchased goods and services | 869.388 t | 869.389 t |
| Upstream transportation | 18.643 t | 18.641 t |
| Ready-mix share | 70.59 % | 70.59 % |
| Ready-mix with its transport | 71.84 % | 71.84 % |
| Intensity | 0.445580 t per m³ | 0.445580 t per m³ |
| At full capacity | 1,343.600 t, 0.443608 t per m³ | 1,343.599 t, 0.443608 t per m³, −0.44 % |

The one-kilogram gaps are rounding: the paper rounds each line to three decimals of a tonne before adding, the tool adds in kilograms. Two rows (other yard material transport, office paper transport) are printed only as group remainders of 0.582 and 0.037 t, so they went in as single lumps.

<!-- fig:cats -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 260" role="img" aria-label="Each of the 10 activity categories in the rebuilt inventory, in tonnes of CO2e on a log scale. Purchased goods and services dominates at 869.389 t." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Where the yard’s carbon comes from</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Where the yard’s carbon comes from</text><line x1="58" x2="546" y1="201.9" y2="201.9" style="stroke:var(--line)"/><text x="52" y="205.9" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="161.4" y2="161.4" style="stroke:var(--line)"/><text x="52" y="165.4" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="121" y2="121" style="stroke:var(--line)"/><text x="52" y="125" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="80.5" y2="80.5" style="stroke:var(--line)"/><text x="52" y="84.5" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="40.1" y2="40.1" style="stroke:var(--line)"/><text x="52" y="44.1" text-anchor="end" style="fill:var(--muted)">1000</text><line x1="86.7" x2="86.7" y1="214" y2="218" style="stroke:var(--muted)"/><text x="86.7" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="134.5" x2="134.5" y1="214" y2="218" style="stroke:var(--muted)"/><text x="134.5" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="182.4" x2="182.4" y1="214" y2="218" style="stroke:var(--muted)"/><text x="182.4" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="230.2" x2="230.2" y1="214" y2="218" style="stroke:var(--muted)"/><text x="230.2" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="278.1" x2="278.1" y1="214" y2="218" style="stroke:var(--muted)"/><text x="278.1" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="325.9" x2="325.9" y1="214" y2="218" style="stroke:var(--muted)"/><text x="325.9" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="373.8" x2="373.8" y1="214" y2="218" style="stroke:var(--muted)"/><text x="373.8" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="421.6" x2="421.6" y1="214" y2="218" style="stroke:var(--muted)"/><text x="421.6" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="469.5" x2="469.5" y1="214" y2="218" style="stroke:var(--muted)"/><text x="469.5" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="517.3" x2="517.3" y1="214" y2="218" style="stroke:var(--muted)"/><text x="517.3" y="231" text-anchor="middle" style="fill:var(--muted)"></text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--muted)"/><text x="302" y="252" text-anchor="middle" style="fill:var(--ink)">Category (GHG Protocol)</text><text transform="translate(14 123) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">t CO₂e (log scale)</text><circle cx="86.7" cy="156.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="134.5" cy="141.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="182.4" cy="156.9" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="230.2" cy="160.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="278.1" cy="119.6" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="325.9" cy="42.5" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="373.8" cy="145" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="421.6" cy="110" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="469.5" cy="165.9" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="517.3" cy="128.3" r="4" style="fill:var(--c-blog);opacity:1"/><text class="fibub-mark" x="546" y="252" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The rebuilt inventory by GHG Protocol category, in tonnes of CO₂e on a log scale. Left to right: Stationary combustion, Mobile combustion, Fugitive (refrigerant leaks), Process emissions, Purchased electricity, Purchased goods and services, Fuel- and energy-related activities, Upstream transportation, Waste generated in operations, Employee commuting.</figcaption></figure>
<!-- /fig:cats -->

**Slip one: the upstream-electricity rows.** In the Scope 3 energy table both grid-loss rows carry 21,585 kWh, the *total* electricity, but their emissions (1.541 and 0.589 t) are those of 15,618 and 5,967 kWh at 0.0987 kg per kWh. Taking the table's amounts at face value doubles that category: **4.261 t instead of 2.130 t**. The published total is the correct one; only the printed amounts are wrong. This is exactly the sort of thing a row-by-row rebuild catches, because the tool multiplies what you type.

**Slip two: the over-ordering saving.** The yard bought 2,198 m³ of ready-mix to make 2,054.60 m³ of product, an excess of 143.40 m³. The paper calls that 6.98 % (143.40 ÷ 2,054.60) and multiplies by the 71.84 % that ready-mix and its transport make up, giving a possible saving of 5.01 %. But the emissions to be saved are a share of what was *bought*: 143.40 ÷ 2,198 = **6.52 %**, so the saving is 6.52 % × 71.84 % = **4.69 %** of the footprint, about 42.9 t. Still the biggest single lever by far, and still worth chasing; just not quite 5 %.

**What capacity can and cannot do.** Figure 2 runs the tool's intensity arithmetic across outputs from 1,000 to 3,029 m³, treating the office as fixed and the rest as proportional to output (**our assumption**, following the paper's own scenario). The curve is almost flat — 0.4456 t per m³ at the real output, 0.4436 at capacity — because 98 % of the footprint is bought materials that scale with what you make. The lower line is the same yard with the concrete over-order removed, a step that moves the intensity about twenty times more than filling the order book.

<!-- fig:intensity -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 283" role="img" aria-label="Emissions intensity against yearly output. Because 98 % of the footprint is purchased materials and their transport, filling the yard to capacity moves the intensity only from 0.4456 to 0.4436 t per m3, while cutting the concrete over-order saves about 4.7 %." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Carbon per cubic metre against output</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Carbon per cubic metre against output</text><line x1="58" x2="546" y1="237" y2="237" style="stroke:var(--line)"/><text x="52" y="241" text-anchor="end" style="fill:var(--muted)">0.41</text><line x1="58" x2="546" y1="199.6" y2="199.6" style="stroke:var(--line)"/><text x="52" y="203.6" text-anchor="end" style="fill:var(--muted)">0.42</text><line x1="58" x2="546" y1="162.2" y2="162.2" style="stroke:var(--line)"/><text x="52" y="166.2" text-anchor="end" style="fill:var(--muted)">0.43</text><line x1="58" x2="546" y1="124.8" y2="124.8" style="stroke:var(--line)"/><text x="52" y="128.8" text-anchor="end" style="fill:var(--muted)">0.44</text><line x1="58" x2="546" y1="87.4" y2="87.4" style="stroke:var(--line)"/><text x="52" y="91.4" text-anchor="end" style="fill:var(--muted)">0.45</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">0.46</text><line x1="58" x2="58" y1="237" y2="241" style="stroke:var(--muted)"/><text x="58" y="254" text-anchor="middle" style="fill:var(--muted)">1e+3</text><line x1="177" x2="177" y1="237" y2="241" style="stroke:var(--muted)"/><text x="177" y="254" text-anchor="middle" style="fill:var(--muted)">1.5e+3</text><line x1="296" x2="296" y1="237" y2="241" style="stroke:var(--muted)"/><text x="296" y="254" text-anchor="middle" style="fill:var(--muted)">2e+3</text><line x1="415.1" x2="415.1" y1="237" y2="241" style="stroke:var(--muted)"/><text x="415.1" y="254" text-anchor="middle" style="fill:var(--muted)">2.5e+3</text><line x1="534.1" x2="534.1" y1="237" y2="241" style="stroke:var(--muted)"/><text x="534.1" y="254" text-anchor="middle" style="fill:var(--muted)">3e+3</text><line x1="58" x2="546" y1="237" y2="237" style="stroke:var(--muted)"/><text x="302" y="275" text-anchor="middle" style="fill:var(--ink)">Yearly production (m³ of precast)</text><text transform="translate(14 143.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">t CO₂e per m³</text><line x1="309" x2="309" y1="50" y2="237" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="313" y="62" text-anchor="start" style="fill:var(--muted)">2054.6 m³ actual</text><line x1="541" x2="541" y1="50" y2="237" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="537" y="62" text-anchor="end" style="fill:var(--muted)">capacity</text><path d="M58 79.7L67.5 81.6L77 83.2L86.6 84.8L96.1 86.2L105.6 87.6L115.1 88.9L124.7 90.1L134.2 91.2L143.7 92.2L153.2 93.2L162.7 94.1L172.3 95L181.8 95.9L191.3 96.7L200.8 97.4L210.4 98.1L219.9 98.8L229.4 99.5L238.9 100.1L248.4 100.7L258 101.3L267.5 101.8L277 102.3L286.5 102.8L296 103.3L305.6 103.8L315.1 104.2L324.6 104.6L334.1 105.1L343.7 105.5L353.2 105.8L362.7 106.2L372.2 106.5L381.7 106.9L391.3 107.2L400.8 107.6L410.3 107.9L419.8 108.2L429.4 108.5L438.9 108.8L448.4 109L457.9 109.3L467.4 109.5L477 109.8L486.5 110L496 110.3L505.5 110.5L515.1 110.7L524.6 111L534.1 111.1L543.6 111.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 159L67.5 160.7L77 162.3L86.6 163.8L96.1 165.2L105.6 166.5L115.1 167.7L124.7 168.8L134.2 169.9L143.7 170.9L153.2 171.8L162.7 172.7L172.3 173.6L181.8 174.4L191.3 175.1L200.8 175.8L210.4 176.5L219.9 177.2L229.4 177.8L238.9 178.4L248.4 179L258 179.5L267.5 180L277 180.5L286.5 181L296 181.4L305.6 181.9L315.1 182.3L324.6 182.7L334.1 183.1L343.7 183.5L353.2 183.9L362.7 184.2L372.2 184.5L381.7 184.9L391.3 185.2L400.8 185.5L410.3 185.8L419.8 186.1L429.4 186.4L438.9 186.6L448.4 186.9L457.9 187.1L467.4 187.4L477 187.6L486.5 187.9L496 188.1L505.5 188.3L515.1 188.5L524.6 188.7L534.1 188.9L543.6 189.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">As built</text><line x1="141.6" x2="153.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="157.6" y="40" style="fill:var(--muted)">With no ready-mix over-ordering</text><text class="fibub-mark" x="546" y="275" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Emissions per cubic metre against yearly output, worked out with the tool’s intensity arithmetic. The office is treated as fixed and everything else as proportional to output (our assumption, following the paper’s own capacity scenario).</figcaption></figure>
<!-- /fig:intensity -->

## How we made the graphs

Both charts and every number come from `scripts/blog-figures/precast-concrete-yard-carbon-footprint-scopes.mjs` in fibub's public code. It calls `readRows`, `totals`, `intensity` and `change` from `src/lib/sci/ghgscopes.ts`, the maths behind the [[scope-emissions]] tool. The script holds the paper's 35 activity rows with their factors, so anyone can read exactly which number came from where.

Everything numeric is the paper's: amounts, factors, production volume and capacity. **Our choices**: mapping each row to one of the tool's activity types (the septic tank's methane goes in as a Scope 1 process emission at GWP 28, as the paper does); entering the production volume where the tool asks for employees, so its "tonnes per employee" becomes tonnes per cubic metre; and the fixed-office assumption in Figure 2. fibub builds in **no** emission factors at all, by design: every factor here is one the paper names, with its source.

## How we test the maths

`tests/sci.mjs` runs `tests/sci-tools/scope-emissions.mjs` on every change to fibub. It works on a made-up two-year company and checks, against the same sums in pandas:

- 2024 Scope 1 29,500 kg, Scope 2 32,000 kg location-based and 36,000 kg market-based, Scope 3 69,400 kg, totals 130.9 t and 134.9 t.
- A green tariff in 2025 drops market-based Scope 2 to 3,800 kg and the total to 99.12 t, a change of −35.78 t and −26.5 %.
- Intensity of 11.24 t per employee and 67.45 t per million of revenue in 2024, and nothing at all when employees or revenue are missing.
- A refrigerant row is 2 kg × GWP 2,000 = 4,000 kg, and a Scope 2 row with no market factor falls back to its location factor.
- New with this article: the paper's 35 rows must give Scope 1 6,757.8 kg, Scope 2 10,790.4 kg, Scope 3 897,940 kg and a total within 1.5 kg of 915.489 t, with the ready-mix share at 70.59 % and the intensity at 0.445580 t per m³.

## Check it yourself

On the [[scope-emissions]] page you can paste a small part of the paper's inventory and watch it add up:

1. In *Activity data*, clear the box and paste these nine lines (the yard's Scope 1 and 2, plus its ready-mix concrete):

   `2022,stationary,LPG rebar cutter,420,kg,3.1134`
   `2022,mobile,Gasoline vibrator,218,L,2.1894`
   `2022,mobile,Diesel truck,950,L,2.7406`
   `2022,refrigerant,R-410A yard,0.30,kg,2090`
   `2022,refrigerant,R-410A office,0.32,kg,2090`
   `2022,process,Septic tank methane,38.34,kg,28`
   `2022,electricity,Casting yards,15618,kWh,0.4999`
   `2022,electricity,Office,5967,kWh,0.4999`
   `2022,goods,Ready-mix concrete,2198,m3,294`

2. The *Inventory* card reads **2022: 663.76 t CO₂e**, with *Scope 1* **6.76**, *Scope 2, location-based* **10.79**, *Scope 3* **646.21** and *Total* **663.76**.
3. *By category, 2022* shows **1 Purchased goods and services 646.21 t, 97 %** against *Purchased electricity* **10.79 t, 2 %**. One material swamps everything else.
4. In *Organisation*, type **2054.6** in the 2022 *Employees* box. The *t per employee* line becomes **0.32**: with the production volume typed in place of people, that is tonnes per cubic metre for this part of the inventory.
5. Change the ready-mix amount from 2,198 to **2,054.6**, the volume actually needed, and the total falls to **621.60 t**. That single edit is the paper's main recommendation.

## What researchers can use it for

- **Audit a published footprint** by retyping its activity table: a rebuild that misses by more than rounding means a factor, an amount or a boundary is not what the paper says.
- **Keep factors visible**: the tool stores no factor table, so every number in your inventory carries the source you typed it from, which is what a reviewer asks for.
- **Test a reduction scenario** before costing it, as with the over-order above, and check the arithmetic base of any "percentage saved" claim.
- **Split fixed from variable emissions** and show intensity against output, so a works manager can see what capacity will and will not buy.
- **Teach the three scopes** on a real inventory of 35 rows rather than an invented one.

## The fine print

- Every amount and factor here is the paper's. We re-did its arithmetic; we did not re-measure the yard, and we cannot check whether the boundary or the factor choices are right.
- Two freight rows exist in our rebuild only as the paper's group remainders, so that category is reproduced to about 2 kg.
- The tool's "tonnes per employee" is used here as tonnes per cubic metre. That is a convenience, not a feature.
- The paper's text also gives the total as 914.729 t in one place and 915.489 t elsewhere; the intensity it reports matches 915.489 t, which is what we reproduce.
- A formal inventory needs more than arithmetic: boundaries, base-year recalculation, data quality and often verification. This is a check of the sums.
