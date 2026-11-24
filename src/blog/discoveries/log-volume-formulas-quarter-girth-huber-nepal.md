---
title: "Quarter girth or Huber: why two log volume formulas differ by exactly 4/π"
summary: "A 2026 study of 168 felled trees in Nepal finds Huber's formula gives 27.34 % more wood than the quarter-girth formula. We show with fibub's log scale calculator that the gap is the constant 4/π, and that it explains the paper's two timber-loss figures too."
tools: [log-scale-calculator, forest-inventory-summary, tree-height-basal-area]
updated: 2026-11-24
sources:
  - "Karki, P., Dangal, S. and Cedamon, E. (2026), Exploring the Volume Paradox: Comparing Different Formulas for Estimating the Wood Volume of Trees and Logs in Nepal, Scientifica 2026(1): 4884890, doi:10.1155/sci5/4884890. Licence CC BY 4.0, checked in the article's Crossref record, 2026-11-24. Values used here: 168 felled trees and 1,192 logs; Huber's formula gives 27.34 % more volume than the quarter-girth formula; one-way ANOVA across the four formulas p = 0.00004; timber losses in felling and bucking 37.06 % with the quarter-girth formula and 19.86 % with Huber's; the allometric equation gave about 0.8 % less timber and 78.6 % more firewood than the form-factor formula."
  - "Quarter girth (Hoppus) rule, Smalian, Huber and Newton formulas: standard forest mensuration, as in Avery and Burkhart, Forest Measurements. Formulas only; no volume tables are reproduced."
paper:
  title: "Exploring the Volume Paradox: Comparing Different Formulas for Estimating the Wood Volume of Trees and Logs in Nepal"
  authors: "Karki P, Dangal S, Cedamon E"
  journal: "Scientifica"
  year: 2026
  doi: "10.1155/sci5/4884890"
  url: "https://onlinelibrary.wiley.com/doi/10.1155/sci5/4884890"
  licence: "CC BY 4.0"
  reviewed: true
---

Two foresters can measure the same log and write down volumes that differ by a quarter, without either of them making a mistake, because they used different formulas. A 2026 paper in *Scientifica* measured 168 felled trees and 1,192 logs in Nepal and compared four ways of turning diameters into cubic metres. Its headline number is that **Huber's formula gives 27.34 % more volume than the quarter-girth formula**. This article shows with the [[log-scale-calculator]] that this gap is not a property of Nepali trees at all: it is the constant 4/π, baked into the quarter-girth rule, and it turns up a second time in the paper's timber-loss figures. Before scaling logs, measure the standing trees with the [[tree-height-basal-area]] and total the stand with the [[forest-inventory-summary]].

## The paper in brief

The authors worked in community-managed forest in Nepal, where timber is bought and sold by rules that long predate pocket calculators. They felled and bucked trees in harvesting coupes, measured 168 of them and 1,192 randomly chosen logs, and worked out the volume of each in four ways: the **quarter-girth (Hoppus) formula**, which squares a quarter of the girth; a **form-factor** formula; an **allometric equation** fitted to diameter and height; and **Huber's formula**, which multiplies the length by the cross-section area at the middle of the log.

The four did not agree. A one-way analysis of variance gave p = 0.00004 for the differences in mean volume per tree, and Tukey's test put the quarter-girth and form-factor formulas apart from the allometric equation for standing timber. Huber's formula came out 27.34 % above quarter girth. Switching from the form factor to the allometric equation moved timber volume by only about 0.8 %, but firewood volume by 78.6 %. The authors also report the timber lost between the standing tree and the stacked logs: **37.06 % by quarter girth and 19.86 % by Huber's formula**.

## Checked with the tools

Everything below is **recomputed from geometry**, not from the paper's measurements, which we do not have.

**Step 1: where 27.34 % comes from.** Huber's formula takes the circle's area, πd²/4, at the middle of the log. The quarter-girth rule instead takes a quarter of the girth, πd/4, and squares it: π²d²/16. Divide one by the other and the diameter cancels:

> (πd²/4) ÷ (π²d²/16) = 4/π = 1.27324

So Huber's formula is **27.32 % above quarter girth for every log ever measured**, whatever its diameter, length or taper. The paper's 27.34 % is that constant, to two decimal places. The quarter-girth rule is not wrong, it is deliberate: the missing 21.5 % of the cross-section was the old allowance for the slabs and sawdust lost in squaring a round log, so the figure is meant to be a sawn-timber estimate rather than a volume of wood.

Our made-up metric log (small end 25 cm, large end 30 cm, middle 27.5 cm, length 2.5 m), run through the tool's own functions, gives Smalian 0.14972 m³, Huber 0.14849 m³ and Newton 0.14890 m³, while quarter girth at mid-length gives 0.11662 m³. Huber ÷ quarter girth = 1.27324 again.

**Step 2: how the other formulas behave.** Smalian, Huber and Newton all use real cross-section areas, so they differ only in how they handle taper, and only by a little. Figure 1 takes the same 2.5 m log and lets its taper grow from nothing to 6 cm of diameter per metre, dividing each formula by the true volume of a cone frustum (which is what Newton's formula returns exactly).

<!-- fig:ratios -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="For a 2.5 m log with a 25 cm small end, Smalian rises above the true volume as the taper grows, Huber falls a little below it, and the quarter-girth formula sits a flat 21.5 per cent below it whatever the taper." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Each formula against the log’s true volume</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Each formula against the log’s true volume</text><line x1="58" x2="546" y1="223.1" y2="223.1" style="stroke:var(--line)"/><text x="52" y="227.1" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="165.4" y2="165.4" style="stroke:var(--line)"/><text x="52" y="169.4" text-anchor="end" style="fill:var(--muted)">0.9</text><line x1="58" x2="546" y1="107.7" y2="107.7" style="stroke:var(--line)"/><text x="52" y="111.7" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1.1</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="139.3" y="269" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="220.7" x2="220.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="220.7" y="269" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="383.3" x2="383.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="383.3" y="269" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="464.7" x2="464.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="464.7" y="269" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Taper (cm of diameter per metre)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Volume ÷ true volume</text><line x1="58" x2="546" y1="107.7" y2="107.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="102.7" text-anchor="end" style="fill:var(--muted)">true volume (Newton)</text><path d="M58 107.7L66.1 107.7L74.3 107.7L82.4 107.6L90.5 107.6L98.7 107.5L106.8 107.4L114.9 107.3L123.1 107.1L131.2 107L139.3 106.8L147.5 106.7L155.6 106.5L163.7 106.3L171.9 106.1L180 105.8L188.1 105.6L196.3 105.4L204.4 105.1L212.5 104.8L220.7 104.5L228.8 104.3L236.9 103.9L245.1 103.6L253.2 103.3L261.3 103L269.5 102.6L277.6 102.3L285.7 101.9L293.9 101.6L302 101.2L310.1 100.8L318.3 100.4L326.4 100L334.5 99.6L342.7 99.2L350.8 98.8L358.9 98.4L367.1 98L375.2 97.6L383.3 97.1L391.5 96.7L399.6 96.2L407.7 95.8L415.9 95.3L424 94.9L432.1 94.4L440.3 93.9L448.4 93.5L456.5 93L464.7 92.5L472.8 92L480.9 91.6L489.1 91.1L497.2 90.6L505.3 90.1L513.5 89.6L521.6 89.1L529.7 88.6L537.9 88.1L546 87.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 107.7L66.1 107.7L74.3 107.7L82.4 107.8L90.5 107.8L98.7 107.8L106.8 107.9L114.9 107.9L123.1 108L131.2 108.1L139.3 108.2L147.5 108.2L155.6 108.3L163.7 108.4L171.9 108.5L180 108.6L188.1 108.8L196.3 108.9L204.4 109L212.5 109.2L220.7 109.3L228.8 109.4L236.9 109.6L245.1 109.8L253.2 109.9L261.3 110.1L269.5 110.2L277.6 110.4L285.7 110.6L293.9 110.8L302 111L310.1 111.2L318.3 111.4L326.4 111.5L334.5 111.7L342.7 112L350.8 112.2L358.9 112.4L367.1 112.6L375.2 112.8L383.3 113L391.5 113.2L399.6 113.5L407.7 113.7L415.9 113.9L424 114.1L432.1 114.4L440.3 114.6L448.4 114.8L456.5 115.1L464.7 115.3L472.8 115.5L480.9 115.8L489.1 116L497.2 116.3L505.3 116.5L513.5 116.8L521.6 117L529.7 117.3L537.9 117.5L546 117.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 231.6L66.1 231.6L74.3 231.6L82.4 231.6L90.5 231.6L98.7 231.7L106.8 231.7L114.9 231.7L123.1 231.8L131.2 231.9L139.3 231.9L147.5 232L155.6 232.1L163.7 232.1L171.9 232.2L180 232.3L188.1 232.4L196.3 232.5L204.4 232.6L212.5 232.7L220.7 232.8L228.8 232.9L236.9 233L245.1 233.2L253.2 233.3L261.3 233.4L269.5 233.6L277.6 233.7L285.7 233.8L293.9 234L302 234.1L310.1 234.3L318.3 234.4L326.4 234.6L334.5 234.7L342.7 234.9L350.8 235.1L358.9 235.2L367.1 235.4L375.2 235.6L383.3 235.7L391.5 235.9L399.6 236.1L407.7 236.2L415.9 236.4L424 236.6L432.1 236.8L440.3 237L448.4 237.2L456.5 237.3L464.7 237.5L472.8 237.7L480.9 237.9L489.1 238.1L497.2 238.3L505.3 238.5L513.5 238.7L521.6 238.9L529.7 239.1L537.9 239.3L546 239.5" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Smalian</text><line x1="134.4" x2="146.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="150.4" y="40" style="fill:var(--muted)">Huber</text><line x1="196.4" x2="208.4" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="212.4" y="40" style="fill:var(--muted)">Quarter girth</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Our own made-up log, 2.5 m long with a 25 cm small end, as its taper grows. Each formula is divided by the true volume of a cone frustum, which is what Newton’s formula gives. Worked out with the Log scale calculator’s own functions.</figcaption></figure>
<!-- /fig:ratios -->

Smalian creeps **above** the truth as the taper grows (+0.5 % at 2 cm/m, +2.6 % at 5 cm/m) because averaging the two end areas over-weights the fat end; Huber creeps the same distance below. Quarter girth sits on a flat line at 0.785 of the true volume, moving only because the mid-diameter moves. In other words: the choice between Smalian, Huber and Newton is worth a few per cent and depends on log shape, while the choice of quarter girth is worth 21.5 % and depends on nothing.

**Step 3: the loss figures carry the same constant.** The paper reports felling-and-bucking losses of 37.06 % and 19.86 %. Those look like two different measurements. They are not. The share of wood that survives to the log yard is 100 − 37.06 = 62.94 % by quarter girth and 100 − 19.86 = 80.14 % by Huber, and

> 80.14 ÷ 62.94 = 1.2733, which is 4/π again.

Feed 62.94 % into the factor and you get 80.14 %, so a loss of **19.862 %** against the paper's 19.86 %. Figure 2 draws the whole line, with the paper's pair of figures on it.

<!-- fig:loss -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 270" role="img" aria-label="A straight line: swapping the quarter-girth formula for Huber multiplies the volume that reaches the yard by 4 divided by pi, so a 37.06 per cent loss becomes 19.86 per cent." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Timber "loss" depends on the formula</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Timber "loss" depends on the formula</text><line x1="58" x2="546" y1="192" y2="192" style="stroke:var(--line)"/><text x="52" y="196" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="128" y2="128" style="stroke:var(--line)"/><text x="52" y="132" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="64" y2="64" style="stroke:var(--line)"/><text x="52" y="68" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="224" y2="228" style="stroke:var(--muted)"/><text x="58" y="241" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="180" x2="180" y1="224" y2="228" style="stroke:var(--muted)"/><text x="180" y="241" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="302" x2="302" y1="224" y2="228" style="stroke:var(--muted)"/><text x="302" y="241" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="424" x2="424" y1="224" y2="228" style="stroke:var(--muted)"/><text x="424" y="241" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="546" x2="546" y1="224" y2="228" style="stroke:var(--muted)"/><text x="546" y="241" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--muted)"/><text x="302" y="262" text-anchor="middle" style="fill:var(--ink)">Loss worked out with the quarter-girth formula (%)</text><text transform="translate(14 128) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Loss with Huber’s formula (%)</text><line x1="58" x2="546" y1="192" y2="192" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="187" text-anchor="end" style="fill:var(--muted)">no loss at all</text><line x1="266.1" x2="266.1" y1="32" y2="224" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="270.1" y="44" text-anchor="start" style="fill:var(--muted)">the paper: 37.06 % and 19.86 %</text><path d="M546 35L533.8 39L521.6 43.1L509.4 47.2L497.2 51.3L485 55.3L472.8 59.4L460.6 63.5L448.4 67.6L436.2 71.6L424 75.7L411.8 79.8L399.6 83.9L387.4 87.9L375.2 92L363 96.1L350.8 100.2L338.6 104.2L326.4 108.3L314.2 112.4L302 116.5L289.8 120.5L277.6 124.6L265.4 128.7L253.2 132.8L241 136.8L228.8 140.9L216.6 145L204.4 149.1L192.2 153.1L180 157.2L167.8 161.3L155.6 165.4L143.4 169.4L131.2 173.5L119 177.6L106.8 181.7L94.6 185.7L82.4 189.8L70.2 193.9L58 197.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="266.1" cy="128.4" r="4" style="fill:var(--c-tools);opacity:1"/><text class="fibub-mark" x="546" y="262" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same logs, the same trees, two formulas. Because the quarter-girth formula is a fixed 4/π below the true cross-section, a felling-and-bucking loss of 37.06 % by quarter girth is 19.86 % by Huber. The dot is the pair of figures the paper reports.</figcaption></figure>
<!-- /fig:loss -->

So the two loss figures are one measurement expressed in two units. If the trees were scaled by quarter girth and the logs by Huber's formula, more than a third of the apparent "loss" would vanish on paper alone.

| Check | Paper | Tool and geometry |
|---|---|---|
| Huber over quarter girth | 27.34 % more | 4/π − 1 = 27.324 %, for any log |
| Loss, quarter girth → Huber | 37.06 % → 19.86 % | 19.862 %, from 62.94 % × 4/π |
| Smalian over Huber, 2 cm/m taper | not reported | +0.83 % (0.14972 vs 0.14849 m³) |
| Quarter girth against true volume | not reported | 0.785 of it, flat in taper |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/log-volume-formulas-quarter-girth-huber-nepal.mjs` in fibub's public code. It calls `area`, `smalian`, `huber`, `newton` and `scaleLog` from `src/lib/sci/logscale.ts`, the maths behind the [[log-scale-calculator]]. The quarter-girth volume is the one line of arithmetic the tool does not hold, (πd/4)² × L, applied to the same mid-diameter the tool gives to Huber's formula.

The only inputs from the paper are the four percentages quoted above. The log sizes (25, 27.5 and 30 cm, 2.5 m long) and the taper range are **our own made-up logs**, chosen to be ordinary; the reference shape is a cone frustum, which is **our assumption** about log form, and it is the assumption that makes Newton's formula exact.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/log-scale-calculator.mjs`, which pins the tool against an independent Python calculation:

- A 16-inch, 16-foot log must give 144 board feet by Doyle and 166.24 by the Scribner formula.
- The International ¼-inch rule must stay within 0.5 % of Grosenbaugh's 1952 closed-form fit of the same rule for every log from 8 to 30 inches and 8 to 20 feet.
- An imperial log (16 in small end, 19 in large, 17.4 in middle, 16 ft) must give 26.9217 ft³ by Smalian, 26.4208 by Huber and 26.5878 by Newton.
- New with this article: our metric log must give 0.1497165 m³ by Smalian, 0.1484893 by Huber and 0.1488984 by Newton, and Huber ÷ quarter girth must equal 4/π to 12 decimal places.

## Check it yourself

On the [[log-scale-calculator]]:

1. Set *Units* to **cm and metres (m³)**.
2. Clear the log box and type one row: **L1,25,2.5,30,27.5** (name, small end, length, large end, middle).
3. The *Volume* card shows **Smalian 0.14972 m³**, **Huber 0.14849 m³** and **Newton 0.14890 m³** for that log.
4. Multiply Huber by 0.7854 (that is π/4) to get the quarter-girth volume: **0.11662 m³**. Divide the other way, 0.14849 ÷ 0.11662, and you are back to 1.2732.
5. Now add a log with no taper at all, **L2,25,2.5,25,25**: Smalian, Huber and Newton all read 0.12272 m³. Every difference between those three formulas is taper.
6. Change the middle diameter of L1 to 28.5 and watch Huber pass Smalian: a bulge in the middle of a log flips which formula reads high.

## What researchers can use it for

- **Say which formula you used.** A volume with no formula named is not a measurement. Run both and quote the ratio, as the paper does.
- **Convert old records.** Timber sold under quarter girth can be put on the same footing as cubic volume by multiplying by 4/π, with no field work.
- **Check a loss or recovery percentage** before explaining it biologically: work out what the same figure would be under the other formula, as in Figure 2.
- **Choose where to spend measurement effort.** Figure 1 says the middle diameter (Huber) or all three (Newton) is worth a few per cent; use the [[tree-height-basal-area]] for the standing stand and the [[forest-inventory-summary]] to add plots up.
- **Teach it in one screen.** Two rows in the tool show students that formula choice, not measurement skill, dominates the answer.

## The fine print

- We did not re-analyse the paper's data. The agreement between its percentages and 4/π is arithmetic on the published figures.
- The 27.32 % constant assumes quarter girth is taken at the same place as Huber's mid-diameter. Rules that use the small end, or girth over bark, differ by more.
- Our reference shape is a cone frustum. Real logs are closer to a paraboloid near the butt, which shifts the Smalian and Huber lines in Figure 1 a little, but not the flat quarter-girth line.
- The paper's firewood and allometric comparisons depend on its own fitted equation, which we cannot check without its data.
