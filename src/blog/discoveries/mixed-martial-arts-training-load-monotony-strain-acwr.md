---
title: "Training monotony below 1: rebuilding an MMA camp's weekly load"
summary: "A study of 14 mixed martial arts athletes reports weekly session-RPE loads, monotony and strain. We rebuild a camp that matches them, show what a monotony under 1 implies, and find a strain value that cannot follow from the other two."
tools: [training-load, heart-rate-zones, vo2max-estimator, jump-height]
updated: 2026-11-24
sources:
  - "Kirk C, Langan-Evans C, Clark DR, Morton JP (2021), Quantification of training load distribution in mixed martial arts athletes: A lack of periodisation and load management, PLoS ONE 16(5): e0251266, doi:10.1371/journal.pone.0251266. Licence CC BY 4.0, stated on the PLOS article page and confirmed in the Crossref record, checked 2026-11-24; not retracted or corrected. Values used here: 14 competitive MMA athletes from four clubs (7 preparing for a bout), age 22.4 +/- 4.4 years, mass 71.3 +/- 7.7 kg, stature 171 +/- 9.9 cm; 405 sessions over 8 weeks after a familiarisation week; session RPE on Foster's 0-10 scale, collected 10-30 minutes after each session; weekly mean session-RPE load 1,287 to 1,791 AU; weekly mean monotony 0.63 to 0.83 AU, between-week monotony 2.3 +/- 0.7; weekly mean strain 1,143 to 1,819 AU; weekly training duration 3.9 to 5.3 hours; 47 % of training time at low, 33 % at moderate and 20 % at high intensity; an abrupt reduction in the week before a bout with no matching change in fatigue."
  - "Foster C (1998), Medicine and Science in Sports and Exercise 30: 1164-1168 (monotony = mean daily load / SD of daily load; strain = weekly load x monotony)."
  - "Foster C, Florhaug JA, Franklin J et al. (2001), Journal of Strength and Conditioning Research 15: 109-115 (session RPE x minutes)."
  - "Hulin BT, Gabbett TJ, Blanch P et al. (2014), British Journal of Sports Medicine 48: 708-712, and Williams S, West S, Cross MJ, Stokes KA (2017), British Journal of Sports Medicine 51: 209-210 (the rolling and EWMA acute:chronic workload ratio)."
paper:
  title: "Quantification of training load distribution in mixed martial arts athletes: A lack of periodisation and load management"
  authors: "Kirk C, Langan-Evans C, Clark DR, Morton JP"
  journal: "PLoS ONE"
  year: 2021
  doi: "10.1371/journal.pone.0251266"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0251266"
  licence: "CC BY 4.0"
  reviewed: true
---

Mixed martial arts fighters train hard and plan little: that was the finding of a PLOS ONE study that tracked 405 training sessions by 14 competitive MMA athletes across eight weeks, and found almost no week-to-week change in load, and then an abrupt drop in the week before a bout. The paper reports its loads in the standard currency of session RPE: weekly load, **monotony** and **strain**. Those three are tied together by a definition, which makes them checkable. This article shows how the [[training-load]] tool rebuilds a camp that produces the paper's weekly numbers, what a monotony below 1 tells you about the week it came from, and which published value cannot follow from the others. For the measures beside load, set intensity bands with [[heart-rate-zones]], track aerobic fitness with the [[vo2max-estimator]] and watch neuromuscular freshness with [[jump-height]].

## The paper in brief

Fourteen athletes (age 22.4 years, mass 71.3 kg) from four clubs logged every session for **eight weeks**, seven of them preparing for a bout. Each session was scored on Foster's **0 to 10 RPE scale** 10 to 30 minutes afterwards, and the session load is that rating times the session's minutes, in arbitrary units (AU).

The weekly group means: **load 1,287 to 1,791 AU**, **monotony 0.63 to 0.83**, **strain 1,143 to 1,819 AU**, and **3.9 to 5.3 hours** of training. Of the training time, 47 % was low intensity, 33 % moderate and 20 % high. Between weeks, monotony was **2.3 +/- 0.7**. There were no meaningful differences between the eight weeks in duration, load, monotony, strain, fatigue or soreness: the only clear change was the drop before a bout, and even that was not followed by any change in reported fatigue. The authors read this as a lack of periodisation.

Two definitions matter here, both from Foster (1998). **Monotony** is the mean daily load of a week divided by the standard deviation of those seven daily loads (rest days counted as zero). **Strain** is the weekly total load times the monotony. Nothing else goes into them.

## Checked with the tools

**Step 1: what a monotony below 1 means.** Monotony under 1 means the standard deviation of the daily loads is larger than their mean, which happens when several days are empty. If a week's training is spread evenly over *k* days at the same load each, monotony depends only on *k* and nothing else, not even on how big the loads are. The tool's weekly maths gives:

| Training days a week (equal loads) | Monotony |
|---|---|
| 2 | 0.59 |
| 3 | 0.80 |
| 4 | 1.07 |
| 5 | 1.46 |
| 6 | 2.27 |

So the paper's range of 0.63 to 0.83 is the signature of **two to three equal training days**, or four uneven ones. That is the useful reading of a number which, printed alone, looks like a typing error: these athletes trained in a few heavy blocks, not little and often.

**Step 2: a camp that reproduces the paper's weekly numbers.** We built an **eight-week reconstruction** (ours, not the paper's data): four sessions a week on Monday, Wednesday, Friday and Saturday, of 90, 50, 75 and 40 minutes at RPE 8, 5, 6 and 3, with each week's minutes scaled between 0.92 and 1.15, and a bout week at 0.55. Run through the tool:

| Week | Our weekly load (AU) | Monotony | Strain (AU) | Duration (h) |
|---|---|---|---|---|
| 1 | 1,540 | 0.80 | 1,225 | 4.3 |
| 2 | 1,661 | 0.80 | 1,321 | 4.6 |
| 3 | 1,468 | 0.79 | 1,167 | 4.1 |
| 4 | 1,727 | 0.80 | 1,373 | 4.8 |
| 5 | 1,540 | 0.80 | 1,225 | 4.3 |
| 6 | 1,763 | 0.80 | 1,402 | 4.9 |
| 7 | 1,419 | 0.80 | 1,128 | 3.9 |
| 8 (bout week) | 852 | 0.79 | 677 | 2.4 |

Weeks 1 to 7 land inside every one of the paper's ranges: load 1,419 to 1,763 against its 1,287 to 1,791; monotony 0.79 to 0.80 against 0.63 to 0.83; strain 1,128 to 1,402 against 1,143 to 1,819; duration 3.9 to 4.9 hours against 3.9 to 5.3. So a camp of four uneven sessions a week really does produce these numbers, and the paper's description is internally plausible.

<!-- fig:daily -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 265" role="img" aria-label="Daily session-RPE loads of a reconstructed eight-week mixed martial arts camp of four uneven sessions a week, with the bout week scaled to 55 %. A reconstruction built to match the published weekly means, not the study data." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>A reconstructed eight-week MMA camp</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">A reconstructed eight-week MMA camp</text><rect x="485" y="32" width="61" height="187" style="fill:var(--accent-soft)"/><text x="515.5" y="46" text-anchor="middle" style="fill:var(--muted)">bout week</text><line x1="58" x2="546" y1="219" y2="219" style="stroke:var(--line)"/><text x="52" y="223" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="177.4" y2="177.4" style="stroke:var(--line)"/><text x="52" y="181.4" text-anchor="end" style="fill:var(--muted)">200</text><line x1="58" x2="546" y1="135.9" y2="135.9" style="stroke:var(--line)"/><text x="52" y="139.9" text-anchor="end" style="fill:var(--muted)">400</text><line x1="58" x2="546" y1="94.3" y2="94.3" style="stroke:var(--line)"/><text x="52" y="98.3" text-anchor="end" style="fill:var(--muted)">600</text><line x1="58" x2="546" y1="52.8" y2="52.8" style="stroke:var(--line)"/><text x="52" y="56.8" text-anchor="end" style="fill:var(--muted)">800</text><line x1="58" x2="58" y1="219" y2="223" style="stroke:var(--muted)"/><text x="58" y="236" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="119" x2="119" y1="219" y2="223" style="stroke:var(--muted)"/><text x="119" y="236" text-anchor="middle" style="fill:var(--muted)">7</text><line x1="180" x2="180" y1="219" y2="223" style="stroke:var(--muted)"/><text x="180" y="236" text-anchor="middle" style="fill:var(--muted)">14</text><line x1="241" x2="241" y1="219" y2="223" style="stroke:var(--muted)"/><text x="241" y="236" text-anchor="middle" style="fill:var(--muted)">21</text><line x1="302" x2="302" y1="219" y2="223" style="stroke:var(--muted)"/><text x="302" y="236" text-anchor="middle" style="fill:var(--muted)">28</text><line x1="363" x2="363" y1="219" y2="223" style="stroke:var(--muted)"/><text x="363" y="236" text-anchor="middle" style="fill:var(--muted)">35</text><line x1="424" x2="424" y1="219" y2="223" style="stroke:var(--muted)"/><text x="424" y="236" text-anchor="middle" style="fill:var(--muted)">42</text><line x1="485" x2="485" y1="219" y2="223" style="stroke:var(--muted)"/><text x="485" y="236" text-anchor="middle" style="fill:var(--muted)">49</text><line x1="546" x2="546" y1="219" y2="223" style="stroke:var(--muted)"/><text x="546" y="236" text-anchor="middle" style="fill:var(--muted)">56</text><line x1="58" x2="546" y1="219" y2="219" style="stroke:var(--muted)"/><text x="302" y="257" text-anchor="middle" style="fill:var(--ink)">Day of the camp</text><text transform="translate(14 125.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Session-RPE load (AU)</text><path d="M58 69.4L66.7 69.4L66.7 219L75.4 219L75.4 167.1L84.1 167.1L84.1 219L92.9 219L92.9 125.5L101.6 125.5L101.6 194.1L110.3 194.1L110.3 219L119 219L119 57.8L127.7 57.8L127.7 219L136.4 219L136.4 162.9L145.1 162.9L145.1 219L153.9 219L153.9 118L162.6 118L162.6 192.2L171.3 192.2L171.3 219L180 219L180 76L188.7 76L188.7 219L197.4 219L197.4 169.1L206.1 169.1L206.1 219L214.9 219L214.9 130.5L223.6 130.5L223.6 195.3L232.3 195.3L232.3 219L241 219L241 51.1L249.7 51.1L249.7 219L258.4 219L258.4 160.8L267.1 160.8L267.1 219L275.9 219L275.9 114.3L284.6 114.3L284.6 191L293.3 191L293.3 219L302 219L302 69.4L310.7 69.4L310.7 219L319.4 219L319.4 167.1L328.1 167.1L328.1 219L336.9 219L336.9 125.5L345.6 125.5L345.6 194.1L354.3 194.1L354.3 219L363 219L363 47.8L371.7 47.8L371.7 219L380.4 219L380.4 159.8L389.1 159.8L389.1 219L397.9 219L397.9 111.8L406.6 111.8L406.6 190.3L415.3 190.3L415.3 219L424 219L424 81L432.7 81L432.7 219L441.4 219L441.4 171.2L450.1 171.2L450.1 219L458.9 219L458.9 133L467.6 133L467.6 195.9L476.3 195.9L476.3 219L485 219L485 135.9L493.7 135.9L493.7 219L502.4 219L502.4 189.9L511.1 189.9L511.1 219L519.9 219L519.9 167.9L528.6 167.9L528.6 205.3L537.3 205.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="257" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The daily session-RPE loads of our reconstructed camp: four uneven sessions a week, with the bout week at 55 %. Weeks 1 to 7 fall inside every weekly range the paper reports. A reconstruction, not the study's own sessions.</figcaption></figure>
<!-- /fig:daily -->

**Step 3: one published number cannot follow from the others.** Because strain is load times monotony, a week's strain can never be larger than its load times its monotony. Taking the paper's own maxima, the largest possible weekly strain is **1,791 x 0.83 = 1,487 AU**, but the reported maximum strain is **1,819 AU**. Turning it round, the monotony implied by the reported strains and loads is strain / load, which runs from **0.89 to 1.02** depending on how the extremes pair up, and the low end of that is already above the printed monotony maximum of 0.83.

So at least one of the three published ranges uses a different recipe. The likeliest candidate: monotony computed over **training days only**, ignoring rest days. For our reconstruction's first week, dropping the three rest days raises monotony from **0.80 to 1.47** and strain from 1,225 to **2,269 AU**. Monotony is sensitive to that choice in a way that load is not, which is why Foster's definition, with rest days as zeros, needs to be stated every time.

<!-- fig:monodays -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 265" role="img" aria-label="Foster monotony for a week whose load is spread equally over one to six days, with rest days counted as zero. The published range of 0.63 to 0.83 matches two to three equal days, or four uneven ones." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Monotony depends on how many days you train</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Monotony depends on how many days you train</text><rect x="58" y="32" width="488" height="187" style="fill:var(--accent-soft)"/><line x1="58" x2="546" y1="219" y2="219" style="stroke:var(--line)"/><text x="52" y="223" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="181.6" y2="181.6" style="stroke:var(--line)"/><text x="52" y="185.6" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="144.2" y2="144.2" style="stroke:var(--line)"/><text x="52" y="148.2" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="106.8" y2="106.8" style="stroke:var(--line)"/><text x="52" y="110.8" text-anchor="end" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="69.4" y2="69.4" style="stroke:var(--line)"/><text x="52" y="73.4" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">2.5</text><line x1="58" x2="58" y1="219" y2="223" style="stroke:var(--muted)"/><text x="58" y="236" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="155.6" x2="155.6" y1="219" y2="223" style="stroke:var(--muted)"/><text x="155.6" y="236" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="253.2" x2="253.2" y1="219" y2="223" style="stroke:var(--muted)"/><text x="253.2" y="236" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="350.8" x2="350.8" y1="219" y2="223" style="stroke:var(--muted)"/><text x="350.8" y="236" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="448.4" x2="448.4" y1="219" y2="223" style="stroke:var(--muted)"/><text x="448.4" y="236" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="546" x2="546" y1="219" y2="223" style="stroke:var(--muted)"/><text x="546" y="236" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="219" y2="219" style="stroke:var(--muted)"/><text x="302" y="257" text-anchor="middle" style="fill:var(--ink)">Training days in the week (equal loads)</text><text transform="translate(14 125.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Training monotony</text><line x1="58" x2="546" y1="171.9" y2="171.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="166.9" text-anchor="end" style="fill:var(--muted)">paper's 0.63</text><line x1="58" x2="546" y1="156.9" y2="156.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="151.9" text-anchor="end" style="fill:var(--muted)">paper's 0.83</text><path d="M58 190.7L155.6 175.2L253.2 159L350.8 139L448.4 109.5L546 49.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="257" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Foster's monotony for a week spread equally over one to six days, with rest days as zeros. It does not depend on how big the loads are, only on how they are spread, so the paper's 0.63 to 0.83 points to very few training days.</figcaption></figure>
<!-- /fig:monodays -->

**Step 4: the taper, in numbers the paper did not report.** The paper notes an abrupt reduction before the bout but reports no acute:chronic workload ratio. The tool computes both of the usual forms on our reconstruction: on the last day of the bout week, the rolling 7:28 ratio falls to **0.61** and the exponentially weighted ratio to **0.67**, from around 1.0 in the steady weeks. Both are well under the 0.8 mark often used as a lower comfort limit, which puts a number on the paper's observation that the pre-bout week is a sudden unloading rather than a planned taper.

| Check | Paper | Our tool result |
|---|---|---|
| Weekly load, weeks 1 to 7 | 1,287 to 1,791 AU | 1,419 to 1,763 AU (reconstruction) |
| Monotony | 0.63 to 0.83 | 0.79 to 0.80, matching 4 uneven training days |
| Strain | 1,143 to 1,819 AU | 1,128 to 1,402 AU; maximum possible from the paper's own load and monotony is 1,487 AU |
| Monotony implied by strain / load | not given | 0.89 to 1.02, above the printed monotony |
| ACWR in the bout week | not given | 0.61 rolling, 0.67 EWMA |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/mixed-martial-arts-training-load-monotony-strain-acwr.mjs` in fibub's public code. It calls `parseSessions`, `sessionLoad`, `daily` and `weeks` from `src/lib/sci/trainload.ts`, the maths behind the [[training-load]] tool: `weeks` builds Monday-to-Sunday weeks with rest days as zeros and returns the total, Foster's monotony and strain; `daily` returns each day's load with the rolling 7-day and 28-day sums, their ratio, and the EWMA ratio with lambda = 2/(N+1).

From the paper: the 8-week length, the Foster 0-10 session-RPE method, and the weekly ranges for load, monotony, strain and duration that our reconstruction is checked against. **Ours:** the four-session week, its minutes and RPEs, the weekly scaling factors and the 0.55 bout week. The session log is a **reconstruction**, not the study's data, which is not published session by session.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/training-load.mjs`, which pins the tool against pandas:

- a 35-session log must give the same daily loads (rest days as zeros), the same rolling 7-day acute and 28-day chronic sums and their ratio, and the same EWMA ratio, for session RPE, Banister TRIMP and Edwards TRIMP, to one part in a million;
- the Monday-to-Sunday weekly totals, monotony (sample SD, n - 1) and strain must match pandas' `resample('W-SUN')` with `std(ddof=1)`;
- a single-session week must leave monotony blank rather than divide by zero, and Banister TRIMP must match the formula by hand;
- new with this article: our reconstructed camp must keep giving weekly loads of 1,540 and 852 AU in weeks 1 and 8, a monotony of 0.79541 in week 1 with a strain of 1,224.9 AU, and a rolling ACWR of 0.6114 with an EWMA ratio of 0.6674 on the last day; and a week of k equal training days must give monotony 0.5855 for k = 2, 0.8018 for k = 3 and 1.0690 for k = 4, whatever the load.

## Check it yourself

On the [[training-load]] page, in the session log:

1. Set *Load to track* to **Session RPE (RPE × minutes)**.
2. Clear the log box (*One session per line: date, minutes, RPE...*) and paste our first two weeks, one session per line: **2026-01-05, 90, 8**; **2026-01-07, 50, 5**; **2026-01-09, 75, 6**; **2026-01-10, 40, 3**; **2026-01-12, 97, 8**; **2026-01-14, 54, 5**; **2026-01-16, 81, 6**; **2026-01-17, 43, 3**.
3. The weekly table shows week 1 with a total of **1,540 AU**, monotony **0.80** and strain **1,225 AU**; week 2 totals **1,661 AU**. Both weeks sit inside the paper's ranges.
4. Add a fifth session to week 1, **2026-01-06, 50, 5**, and watch monotony climb from 0.80 to **0.99** and strain from 1,225 to **1,767 AU**, while the weekly total rises only 16 %: it is the spread of the week, not its size, that monotony measures.
5. Delete that line again, then add the remaining six weeks (scale the minutes by 0.95, 1.12, 1.0, 1.15, 0.92 and 0.55) and read the *acute:chronic workload ratio* in the daily table: about 1.0 through the steady weeks, falling to **0.61** at the end of the bout week, with the EWMA version at **0.67**.
6. Press *Download daily results (CSV)* to take the daily loads, both ratios, monotony and strain into your own analysis, or *Load example* to see the format on a ready-made log.

## What researchers can use it for

- **Audit a published load table.** Strain must equal load times monotony, and monotony falls out of how many days a week were used. One multiplication catches a mismatch.
- **State your monotony recipe, and show what the other one would give.** Rest days in or out changes monotony by half again, as our week 1 shows (0.80 against 1.47).
- **Add the ACWR a paper left out** by rebuilding a plausible session log from its weekly means, then reading the rolling and EWMA ratios, which answer different questions about the same taper.
- **Design a week to a target monotony** before the camp starts: pick the weekly load, then let the tool tell you how to spread it across days.
- **Compare load metrics on the same sessions**, since the tool computes session RPE, Banister TRIMP (from average heart rate) and Edwards TRIMP (from minutes in zones) side by side, and they rank weeks differently.

## The fine print

- The session log here is **our reconstruction** built to match the paper's published weekly ranges. The study's own session-by-session data is not published, and no claim is made that our week looks like any real athlete's.
- The paper's values are **group means per week** across 14 athletes. A mean of monotonies is not the monotony of the mean athlete, which is a second reason published strain can drift away from mean load times mean monotony, although in our 14-athlete simulation that term was under 1 %.
- Session RPE depends on how and when athletes are asked; this study asked 10 to 30 minutes after each session, which is the usual advice.
- The ACWR is reported here because the tool computes it, not because it predicts injury: its usefulness is disputed, and both the rolling and EWMA forms depend strongly on the window chosen.
- This is a 2021 paper, older than most we cover, kept because its weekly load, monotony and strain are all published together, which is rare.
