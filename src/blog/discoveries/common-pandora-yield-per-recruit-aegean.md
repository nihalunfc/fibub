---
title: "Common pandora growth, mortality and yield per recruit in the Aegean"
summary: "A 2025 study ages 589 common pandora by their otoliths and finds the central Aegean stock lightly fished. We rebuild its growth, mortality and yield-per-recruit numbers with fibub's fisheries tools."
tools: [yield-per-recruit, von-bertalanffy-fitter, fish-length-weight]
updated: 2026-11-16
sources:
  - "Theocharis, A., Vardali, S. and Klaoudatos, D. (2025), Age, Growth, and Mortality of the Common Pandora (Pagellus erythrinus, L. 1758) in the Central Aegean Sea: Insights into Population Dynamics, Fishes 10(4): 160, doi:10.3390/fishes10040160. Licence CC BY (Creative Commons Attribution), checked on the MDPI page, 2026-11-16. Values used here: 589 fish of 10.9 to 34.0 cm caught by bottom trawl in May 2021 to 2024; nine age classes; L∞ 39.53 cm, K 0.16 per year, t0 −1.53 years; φ' 2.39; length-weight b 2.49; longest life 17 years; inflection at 5.3 years; M 0.321, Z 0.52, F 0.2 per year, E 0.38; lengths at 25, 50 and 75 % retention 15.21, 19.18 and 21.74 cm; age at 50 % capture 2.63 years; F for E = 0.5 of 0.32; FMSY 0.33."
  - "Yield per recruit: Beverton, R. J. H. and Holt, S. J. (1957), On the Dynamics of Exploited Fish Populations, Fishery Investigations Series II, 19. F0.1: Gulland, J. A. and Boerema, L. K. (1973), Fishery Bulletin 71: 325-335."
  - "Natural mortality from growth, M = 4.118 K^0.73 L∞^-0.33: Then, A. Y. et al. (2015), ICES Journal of Marine Science 72: 82-92. Longest life about t0 + 3/K: Taylor, C. C. (1958), Journal du Conseil 23: 366-370."
paper:
  title: "Age, Growth, and Mortality of the Common Pandora (Pagellus erythrinus, L. 1758) in the Central Aegean Sea: Insights into Population Dynamics"
  authors: "Theocharis A, Vardali S, Klaoudatos D"
  journal: "Fishes"
  year: 2025
  doi: "10.3390/fishes10040160"
  url: "https://www.mdpi.com/2410-3888/10/4/160"
  licence: "CC BY"
  reviewed: true
---

The common pandora, *Pagellus erythrinus*, is a pink sea bream sold in fish markets all round the Mediterranean, and one of the main catches of Greek bottom trawlers. A 2025 paper in *Fishes* works out how fast it grows and how fast it dies in the central Aegean Sea, and whether fishing is taking too much. This article shows how fibub's [[yield-per-recruit]] tool and [[von-bertalanffy-fitter]] turn the paper's handful of numbers into the advice managers need, and how to check each one. The same team's study of large-eye dentex is covered in [[blog:discoveries/large-eye-dentex-growth-otoliths-pagasitikos|our dentex article]].

## The paper in brief

The authors aged 589 pandora, 10.9 to 34.0 cm long, from trawl catches in four spring seasons, by counting the yearly bands in their **otoliths** (ear stones). The fish fell into nine age classes. Their **von Bertalanffy growth curve**, L(t) = L∞ (1 − e^(−K (t − t0))), has L∞ = 39.53 cm (the length an average fish would approach), K = 0.16 per year (how fast it gets there) and t0 = −1.53 years. From the lengths they estimate **total mortality** Z = 0.52 per year, split into **natural mortality** M = 0.321 (disease, predators, old age) and **fishing mortality** F = 0.2. Only 38 % of deaths are caused by fishing (the **exploitation rate** E = F/Z), below the 50 % often used as a warning line, so the authors judge the stock in good shape.

## Checked with the tools

Everything here is a **recomputation from the values printed in the paper**; we have none of its raw data. We assumed fish join the stock (recruit) at 1 year old, and expressed yield per recruit in thousandths of the asymptotic weight W∞, because the paper does not give the length-weight constant a.

**Step 1: growth checks.** The growth performance index φ' = log10 K + 2 log10 L∞ comes out at **2.398**, matching the paper's 2.39. The fish reach 19.18 cm, the length at which half of them are kept by the trawl net, at **2.62 years** on the curve, matching the paper's 2.63. The rule of thumb that fish live to about t0 + 3/K gives **17.2 years**, the paper's 17. And the age at which a fish puts on weight fastest, t0 + ln 3 / K, is **5.34 years**, the paper's 5.3 (Figure 2).

<!-- fig:growth -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 260" role="img" aria-label="The paper's growth curve for common pandora: fish reach the 19.2 cm length at which half are kept by the trawl at about 2.6 years, and gain weight fastest at about 5.3 years." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Growth and the age fish are first caught</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Growth and the age fish are first caught</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--line)"/><text x="52" y="218" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="170.7" y2="170.7" style="stroke:var(--line)"/><text x="52" y="174.7" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="127.3" y2="127.3" style="stroke:var(--line)"/><text x="52" y="131.3" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="84" y2="84" style="stroke:var(--line)"/><text x="52" y="88" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="40.7" y2="40.7" style="stroke:var(--line)"/><text x="52" y="44.7" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="214" y2="218" style="stroke:var(--muted)"/><text x="58" y="231" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="214" y2="218" style="stroke:var(--muted)"/><text x="180" y="231" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="302" x2="302" y1="214" y2="218" style="stroke:var(--muted)"/><text x="302" y="231" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="424" x2="424" y1="214" y2="218" style="stroke:var(--muted)"/><text x="424" y="231" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="546" x2="546" y1="214" y2="218" style="stroke:var(--muted)"/><text x="546" y="231" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--muted)"/><text x="302" y="252" text-anchor="middle" style="fill:var(--ink)">Age (years)</text><text transform="translate(14 123) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Total length (cm)</text><line x1="58" x2="546" y1="42.7" y2="42.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="37.7" text-anchor="end" style="fill:var(--muted)">L∞ 39.5 cm</text><line x1="58" x2="546" y1="130.9" y2="130.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="125.9" text-anchor="end" style="fill:var(--muted)">half retained 19.2 cm</text><line x1="122.2" x2="122.2" y1="32" y2="214" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="126.2" y="44" text-anchor="start" style="fill:var(--muted)">2.63 y</text><line x1="188.3" x2="188.3" y1="32" y2="214" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="192.3" y="44" text-anchor="start" style="fill:var(--muted)">5.3 y, fastest weight gain</text><path d="M58 176.8L64.1 171.5L70.2 166.5L76.3 161.7L82.4 157L88.5 152.5L94.6 148.2L100.7 144.1L106.8 140.1L112.9 136.3L119 132.6L125.1 129.1L131.2 125.7L137.3 122.4L143.4 119.3L149.5 116.3L155.6 113.4L161.7 110.7L167.8 108L173.9 105.4L180 103L186.1 100.6L192.2 98.3L198.3 96.1L204.4 94.1L210.5 92L216.6 90.1L222.7 88.2L228.8 86.5L234.9 84.7L241 83.1L247.1 81.5L253.2 80L259.3 78.5L265.4 77.1L271.5 75.8L277.6 74.5L283.7 73.2L289.8 72L295.9 70.9L302 69.8L308.1 68.7L314.2 67.7L320.3 66.7L326.4 65.8L332.5 64.9L338.6 64L344.7 63.2L350.8 62.4L356.9 61.6L363 60.9L369.1 60.1L375.2 59.5L381.3 58.8L387.4 58.2L393.5 57.6L399.6 57L405.7 56.4L411.8 55.9L417.9 55.4L424 54.9L430.1 54.4L436.2 53.9L442.3 53.5L448.4 53.1L454.5 52.7L460.6 52.3L466.7 51.9L472.8 51.5L478.9 51.2L485 50.9L491.1 50.5L497.2 50.2L503.3 49.9L509.4 49.6L515.5 49.4L521.6 49.1L527.7 48.9L533.8 48.6L539.9 48.4L546 48.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/></svg><figcaption>Figure 2. The paper's von Bertalanffy growth curve (L∞ 39.53 cm, K 0.16, t0 −1.53), with the length at which half the fish are retained by the trawl and the age of fastest weight gain worked out from it.</figcaption></figure>
<!-- /fig:growth -->

**Step 2: mortality checks.** Then and colleagues' formula, M = 4.118 K^0.73 L∞^−0.33, gives **M = 0.321 per year**, exactly the paper's value, so this is the method it used. F = Z − M = 0.52 − 0.321 = 0.2, and E = 0.2 ÷ 0.52 = **0.385**, the paper's 0.38. The paper's "E = 0.5 would need F = 0.32" is simply F = M.

**Step 3: yield per recruit.** The Beverton-Holt model adds up, over a fish's life, the weight it would give to the catch at a given F. With first capture at 2.63 years, the [[yield-per-recruit]] maths gives:

- **Fmax = 1.08 per year**, the F that takes the most weight per fish (E = 0.77);
- **F0.1 = 0.31 per year**, the cautious target where one more unit of fishing adds only a tenth of what the first unit did (E = 0.49);
- at today's **F = 0.2**, a yield of 54.6 thousandths of W∞ per recruit, about **75 % of the most possible** (Figure 1).

Today's F is below F0.1, and F0.1 lands close to the paper's own FMSY of 0.33 from a different method. Both routes agree that there is room to fish a little harder, but not much more before the gains flatten out.

<!-- fig:ypr -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Beverton-Holt yield per recruit for common pandora. With first capture at 2.63 years, F0.1 is 0.31 and Fmax 1.08 per year; today's F of 0.2 sits below both." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Common pandora: yield per recruit against fishing</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Common pandora: yield per recruit against fishing</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="207.1" y2="207.1" style="stroke:var(--line)"/><text x="52" y="211.1" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="162.2" y2="162.2" style="stroke:var(--line)"/><text x="52" y="166.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="117.3" y2="117.3" style="stroke:var(--line)"/><text x="52" y="121.3" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="72.4" y2="72.4" style="stroke:var(--line)"/><text x="52" y="76.4" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="252" y2="256" style="stroke:var(--muted)"/><text x="180" y="269" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="424" x2="424" y1="252" y2="256" style="stroke:var(--muted)"/><text x="424" y="269" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Fishing mortality F (per year)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Yield per recruit (‰ of W∞)</text><line x1="106.8" x2="106.8" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="110.8" y="62" text-anchor="start" style="fill:var(--muted)">now 0.2</text><line x1="133.6" x2="133.6" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="137.6" y="76" text-anchor="start" style="fill:var(--muted)">F0.1 0.31</text><line x1="320.3" x2="320.3" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="324.3" y="90" text-anchor="start" style="fill:var(--muted)">Fmax 1.08</text><path d="M58 252L64.1 223.7L70.2 201L76.3 182.5L82.4 167.5L88.5 155.2L94.6 145L100.7 136.5L106.8 129.4L112.9 123.4L119 118.4L125.1 114.1L131.2 110.5L137.3 107.3L143.4 104.7L149.5 102.4L155.6 100.4L161.7 98.7L167.8 97.2L173.9 95.9L180 94.8L186.1 93.8L192.2 92.9L198.3 92.2L204.4 91.5L210.5 91L216.6 90.5L222.7 90L228.8 89.7L234.9 89.3L241 89.1L247.1 88.8L253.2 88.6L259.3 88.4L265.4 88.3L271.5 88.2L277.6 88.1L283.7 88L289.8 87.9L295.9 87.9L302 87.8L308.1 87.8L314.2 87.8L320.3 87.8L326.4 87.8L332.5 87.8L338.6 87.8L344.7 87.9L350.8 87.9L356.9 87.9L363 88L369.1 88L375.2 88L381.3 88.1L387.4 88.2L393.5 88.2L399.6 88.3L405.7 88.3L411.8 88.4L417.9 88.4L424 88.5L430.1 88.6L436.2 88.6L442.3 88.7L448.4 88.8L454.5 88.8L460.6 88.9L466.7 89L472.8 89L478.9 89.1L485 89.2L491.1 89.2L497.2 89.3L503.3 89.4L509.4 89.4L515.5 89.5L521.6 89.6L527.7 89.6L533.8 89.7L539.9 89.8L546 89.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 252L64.1 228.5L70.2 209.1L76.3 193L82.4 179.5L88.5 168L94.6 158.3L100.7 150.1L106.8 142.9L112.9 136.7L119 131.4L125.1 126.7L131.2 122.6L137.3 118.9L143.4 115.7L149.5 112.8L155.6 110.2L161.7 107.9L167.8 105.8L173.9 103.9L180 102.2L186.1 100.7L192.2 99.3L198.3 98L204.4 96.8L210.5 95.7L216.6 94.7L222.7 93.8L228.8 93L234.9 92.2L241 91.4L247.1 90.8L253.2 90.1L259.3 89.5L265.4 89L271.5 88.5L277.6 88L283.7 87.6L289.8 87.2L295.9 86.8L302 86.4L308.1 86L314.2 85.7L320.3 85.4L326.4 85.1L332.5 84.9L338.6 84.6L344.7 84.3L350.8 84.1L356.9 83.9L363 83.7L369.1 83.5L375.2 83.3L381.3 83.1L387.4 82.9L393.5 82.8L399.6 82.6L405.7 82.5L411.8 82.3L417.9 82.2L424 82.1L430.1 82L436.2 81.8L442.3 81.7L448.4 81.6L454.5 81.5L460.6 81.4L466.7 81.3L472.8 81.2L478.9 81.2L485 81.1L491.1 81L497.2 80.9L503.3 80.8L509.4 80.7L515.5 80.7L521.6 80.6L527.7 80.5L533.8 80.5L539.9 80.4L546 80.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">First caught at 2.63 years</text><line x1="271.2" x2="283.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="287.2" y="40" style="fill:var(--muted)">First caught at 4 years</text></svg><figcaption>Figure 1. Yield per recruit against fishing mortality, from the paper's growth and mortality values with the Yield per recruit tool's Beverton-Holt maths (recruitment at age 1 and W∞ scaled to 1000 are our assumptions). Solid: first capture at the paper's 2.63 years; dashed: if fish were first caught at 4 years.</figcaption></figure>
<!-- /fig:ypr -->

**Step 4: what if fish were caught later?** With a wider net mesh, so that fish were first caught at 4 years instead of 2.63, yield per recruit keeps climbing up to F = 5 (no Fmax) and F0.1 rises to 0.39. At today's F of 0.2, though, catching later gives slightly *less* (48.6 against 54.6), because natural deaths (M = 0.32) are high for a fish growing at K = 0.16: many fish die before they could be caught. Bigger meshes pay off mainly if fishing pressure rises.

| Check | Paper | Our tool result |
|---|---|---|
| φ' | 2.39 | 2.398 |
| Age at 19.18 cm | 2.63 years | 2.62 years |
| Longest life | 17 years | 17.2 years (t0 + 3/K) |
| Natural mortality M | 0.321 | 0.321 (Then et al. 2015) |
| Exploitation rate E | 0.38 | 0.385 |
| Reference F | FMSY 0.33 | F0.1 0.31, Fmax 1.08 |

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/common-pandora-yield-per-recruit-aegean.mjs` in fibub's public code. It calls `ypr` and `refPoints` from `src/lib/sci/ypr.ts`, the Beverton-Holt maths behind the [[yield-per-recruit]] tool, and `vb` from `src/lib/sci/vbgf.ts`, the growth curve behind the [[von-bertalanffy-fitter]]. The natural mortality, longest life and inflection formulas are worked out in the script itself.

All growth and mortality values, the 2.63-year age at first capture and the 17-year longest life come from the paper. Recruitment at age 1 and W∞ = 1000 are **our assumptions**; changing W∞ scales every yield but leaves F0.1 and Fmax where they are. The 4-year capture age is a **what-if** of ours, not a scenario from the paper.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/yield-per-recruit.mjs`:

- The Beverton-Holt formula must equal SciPy's numerical integration of a cohort's catch: 283.438 per recruit for M 0.3, K 0.25, t0 −0.5, W∞ 2500, first capture at 3 years and F 0.5.
- The same stock's Fmax must be 1.0744 and F0.1 0.3318, as SciPy's optimiser and root-finder give.
- New with this article: the pandora inputs must give F0.1 0.3103, Fmax 1.075 and 54.63 per recruit at F 0.2, so any change to the tool that moves these numbers is caught.

## Check it yourself

On the [[yield-per-recruit]] tool, in the yield per recruit card:

1. Type **0.321** in *Natural mortality M (per year)*, **0.16** in *Growth K (per year)* and **-1.53** in *t₀ (years)*.
2. Type **1000** in *W∞, asymptotic weight*, **1** in *Age at recruitment tr (years)*, **2.63** in *Age at first capture tc (years)* and **17** in *Maximum age tλ*.
3. Type **0.2** in *Current fishing mortality F*.
4. The headline reads **F0.1 0.31, Fmax 1.08 per year**. *At current F* shows about **54.6 per recruit**, 0.64 × F0.1.
5. Change *Age at first capture tc* to **4**: *Fmax* now says there is no maximum up to F = 5, and *At current F* falls to about 48.6.

## What researchers can use it for

- **Turn a growth-and-mortality paper into reference points** (F0.1, Fmax) with the [[yield-per-recruit]] tool, and compare them with the current F.
- **Test mesh-size rules**: change the age at first capture and see whether catching fish later helps at today's fishing pressure.
- **Sanity-check published tables**: φ', M from Then's formula, E = F/Z and the age at a given length are quick to recompute.
- **Fit growth from your own otolith readings** with the [[von-bertalanffy-fitter]], and turn lengths into weights with the [[fish-length-weight]] tool.
- **Teach** why high natural mortality makes F0.1 a safer target than Fmax.

## The fine print

- These are recomputations from the paper's printed values, not a new stock assessment.
- Yield per recruit ignores how many young fish are produced: a stock can look fine per recruit while its spawning stock shrinks.
- The Beverton-Holt model assumes weight grows as the cube of length; the paper's b of 2.49 means the real fish are a little slimmer, which shifts yields slightly but not the reference points much.
- The paper's samples come only from spring trawl catches, which may miss the largest and smallest fish.
