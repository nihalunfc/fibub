---
title: "λ-Sculptorids from comet 46P/Wirtanen: why so few meteors were seen"
summary: "Cameras caught the first meteors from comet 46P/Wirtanen in December 2023, at a ZHR of only 0.65. We work out what an observer could have seen, hour by hour."
tools: [meteor-shower-planner, object-altitude, dark-sky-calendar]
updated: 2026-11-24
sources:
  - "Vida, D., Scott, J. M., Egal, A., Vaubaillon, J., Ye, Q.-Z., Rollinson, D., Sato, M. and Moser, D. E. (2024), Observations of the new meteor shower from comet 46P/Wirtanen, Astronomy & Astrophysics 682: L20, doi:10.1051/0004-6361/202449359. Licence CC BY 4.0 (Creative Commons Attribution), checked on the A&A page, 2026-11-24. Values used here: peak 2023 December 12 at 15:04 UTC (± 1 h), solar longitude 259.988°; activity from 09:06 to 22:53 UTC; peak ZHR 0.65 (+0.24/−0.20); forecast upper limit about ZHR 10; population index measured 3.23, adopted 3.0; median radiant RA 6.89°, Dec −38.89°; geocentric speed 10.00 ± 0.25 km/s; 23 multi-station orbits and 172 single-station meteors, mostly from Western Australia; flux limiting magnitude +5.42, typical camera limit about +6.0; median mass 0.47 g."
  - "Hourly rate formula HR = ZHR × sin(h) / r^(6.5 − LM): International Meteor Organization (imo.net), visual observing handbook."
paper:
  title: "Observations of the new meteor shower from comet 46P/Wirtanen"
  authors: "Vida D, Scott JM, Egal A, Vaubaillon J, Ye Q-Z, Rollinson D, Sato M, Moser DE"
  journal: "Astronomy & Astrophysics"
  year: 2024
  doi: "10.1051/0004-6361/202449359"
  url: "https://www.aanda.org/10.1051/0004-6361/202449359"
  licence: "CC BY 4.0"
  reviewed: true
---

Comet 46P/Wirtanen passed close to Earth in 2018, and models said Earth might cross a stream of its dust on 12 December 2023, giving a brand-new meteor shower. A 2024 letter in *Astronomy & Astrophysics* reports that it did: the Global Meteor Network's cameras, mostly in Western Australia, recorded the first **λ-Sculptorids**. But the shower was weak, a **ZHR of only 0.65**, far below the forecast upper limit of about 10. This article uses the maths of the [[meteor-shower-planner]] to show what that means for a person watching the sky at Perth or Auckland that night, and why cameras were needed. To find the radiant's height for any night and place, use the [[object-altitude]] planner; to pick a moonless night, the [[dark-sky-calendar]].

## The paper in brief

A meteor shower happens when Earth runs through dust left by a comet. The meteors seem to come from one point in the sky, the **radiant**, here in the southern constellation Sculptor (RA 6.89°, Dec −38.89°). The **zenithal hourly rate** (ZHR) is how many meteors one observer would see in an hour with the radiant straight overhead and a perfectly dark sky showing stars to magnitude 6.5. The **population index** r says how quickly the number of meteors grows as you go fainter: r = 3 means three times more meteors for each magnitude fainter.

The cameras recorded 23 meteors from two or more stations, giving orbits, and 172 from single stations, used to measure the rate. The peak came at **15:04 UTC** on 12 December 2023, within the forecast window, with activity lasting about 14 hours. The meteors were very slow (**10 km/s** before Earth's pull, about 15 km/s in the air) and larger than predicted, with a median mass of about half a gram. The authors adopted r = 3.0.

## Checked with the tools

This is a **calculation from the paper's stated values** with the planner's formula, HR = ZHR × sin(h) / r^(6.5 − LM), where h is the radiant's height and LM the faintest star the observer can see. We chose a rural sky (LM 6.0) and held the shower at its peak strength all night, a simplification (**our assumption**).

**Step 1: where the radiant was.** At the peak (23:04 local time in Perth), the radiant stood **44.8°** above Perth's horizon. It had been highest, **83.2°**, at 19:22 local time, still in twilight. From Auckland it was only **6.8°** up at the peak, near dawn. From Toronto it never rose above **7.7°** all day, and at the peak it was 59° below the horizon. That is why the detections came from Australia, and why the four Canadian ones were by radar.

**Step 2: what one person could see.** At Perth, with the peak ZHR of 0.65, the formula gives **0.264 meteors an hour** at the peak: one meteor every four hours or so. Even with the radiant at its highest in full darkness, the best half-hour gives **0.356 an hour**. Over the whole dark part of the night (about 20:46 to 03:46 local time) a single watcher would expect **1.38 meteors** in total (Figure 1). The planner itself would say "The radiant stays too low to see many meteors from here" for any rate under 0.5.

<!-- fig:night -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Expected meteors an hour for one observer under a sky with stars to magnitude 6.0, with the paper's ZHR of 0.65 at its peak and r = 3. At Perth the rate at the peak is 0.26 an hour." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>λ-Sculptorids, night of 12 December 2023</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">λ-Sculptorids, night of 12 December 2023</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="180" y2="180" style="stroke:var(--line)"/><text x="52" y="184" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="128" y2="128" style="stroke:var(--line)"/><text x="52" y="132" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="76" y2="76" style="stroke:var(--line)"/><text x="52" y="80" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="92.9" x2="92.9" y1="232" y2="236" style="stroke:var(--muted)"/><text x="92.9" y="249" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="180" x2="180" y1="232" y2="236" style="stroke:var(--muted)"/><text x="180" y="249" text-anchor="middle" style="fill:var(--muted)">12.5</text><line x1="267.1" x2="267.1" y1="232" y2="236" style="stroke:var(--muted)"/><text x="267.1" y="249" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="354.3" x2="354.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="354.3" y="249" text-anchor="middle" style="fill:var(--muted)">17.5</text><line x1="441.4" x2="441.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="441.4" y="249" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="528.6" x2="528.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="528.6" y="249" text-anchor="middle" style="fill:var(--muted)">22.5</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Hour (UTC) on 12 December 2023</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Meteors an hour, one observer</text><line x1="269.5" x2="269.5" y1="50" y2="232" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="273.5" y="62" text-anchor="start" style="fill:var(--muted)">peak 15:04</text><path d="M67.6 232L85 232L102.5 232L119.9 232L137.3 232L154.8 232L172.2 232L189.6 139.4L207 143.1L224.5 147.8L241.9 153.2L259.3 159.5L276.8 166.2L294.2 173.8L311.6 181.8L329 190.1L346.5 198.5L363.9 206.8L381.3 215.1L398.8 223.2L416.2 230.4L433.6 232L451 232L468.5 232L485.9 232L503.3 232L520.8 232L538.2 232" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M70.2 142L87.6 146.2L105 151.4L122.5 157.1L139.9 163.6L157.3 170.9L174.7 178.2L192.2 186L209.6 194L227 202.1L244.5 209.9L261.9 217.4L279.3 224.5L296.7 232L314.2 232L331.6 232L349 232L366.5 232L383.9 232L401.3 232L418.7 232L436.2 232L453.6 232L471 232L488.5 232L505.9 232L523.3 232L540.7 232" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Perth, measured ZHR 0.65</text><line x1="256.8" x2="268.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="272.8" y="40" style="fill:var(--muted)">Auckland</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Meteors an hour one observer could expect from the λ-Sculptorids through the dark hours at Perth and Auckland, from the Meteor shower planner's maths with the paper's ZHR of 0.65 and r = 3.0, a sky with stars to magnitude 6.0 (our choice), and the shower held at peak strength all night (our simplification). Zero means daylight or twilight.</figcaption></figure>
<!-- /fig:night -->

**Step 3: the sky matters a lot when r is 3.** Each magnitude of brighter sky cuts the rate by a factor of r. Under a perfect sky (LM 6.5) the peak rate at Perth would be 0.458 an hour; under the cameras' flux limit of +5.42 it is **0.140**, 3.28 times fewer than at 6.5. The paper's ZHR range of 0.45 to 0.89 gives 0.18 to 0.36 an hour at the peak (LM 6.0).

**Step 4: the forecast that did not happen.** Had the shower reached the forecast upper limit of ZHR 10, the same watcher at Perth would have seen about **4.06 an hour** at the peak and **21.3** over the night (Figure 2): a pleasant show instead of a near-blank sky. The Moon was no help either way: it was new that night, and 30.8° below the horizon at the peak.

<!-- fig:forecast -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 268" role="img" aria-label="At Perth the forecast upper limit of ZHR 10 would have meant about 4.1 meteors an hour at the peak; the measured ZHR gives 0.26." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>What the forecast upper limit would have given at Perth</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">What the forecast upper limit would have given at Perth</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--line)"/><text x="52" y="226" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="187.6" y2="187.6" style="stroke:var(--line)"/><text x="52" y="191.6" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="153.2" y2="153.2" style="stroke:var(--line)"/><text x="52" y="157.2" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="118.8" y2="118.8" style="stroke:var(--line)"/><text x="52" y="122.8" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="84.4" y2="84.4" style="stroke:var(--line)"/><text x="52" y="88.4" text-anchor="end" style="fill:var(--muted)">8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">10</text><line x1="92.9" x2="92.9" y1="222" y2="226" style="stroke:var(--muted)"/><text x="92.9" y="239" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="180" x2="180" y1="222" y2="226" style="stroke:var(--muted)"/><text x="180" y="239" text-anchor="middle" style="fill:var(--muted)">12.5</text><line x1="267.1" x2="267.1" y1="222" y2="226" style="stroke:var(--muted)"/><text x="267.1" y="239" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="354.3" x2="354.3" y1="222" y2="226" style="stroke:var(--muted)"/><text x="354.3" y="239" text-anchor="middle" style="fill:var(--muted)">17.5</text><line x1="441.4" x2="441.4" y1="222" y2="226" style="stroke:var(--muted)"/><text x="441.4" y="239" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="528.6" x2="528.6" y1="222" y2="226" style="stroke:var(--muted)"/><text x="528.6" y="239" text-anchor="middle" style="fill:var(--muted)">22.5</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--muted)"/><text x="302" y="260" text-anchor="middle" style="fill:var(--ink)">Hour (UTC) on 12 December 2023</text><text transform="translate(14 136) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Meteors an hour, one observer</text><path d="M67.6 222L85 222L102.5 222L119.9 222L137.3 222L154.8 222L172.2 222L189.6 127.9L207 131.5L224.5 136.2L241.9 141.7L259.3 148L276.8 155.1L294.2 162.8L311.6 170.9L329 179.3L346.5 187.8L363.9 196.4L381.3 204.8L398.8 212.9L416.2 220.3L433.6 222L451 222L468.5 222L485.9 222L503.3 222L520.8 222L538.2 222" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M67.6 222L85 222L102.5 222L119.9 222L137.3 222L154.8 222L172.2 222L189.6 215.8L207 216.2L224.5 216.5L241.9 216.8L259.3 217.2L276.8 217.7L294.2 218.2L311.6 218.7L329 219.2L346.5 219.8L363.9 220.3L381.3 221L398.8 221.5L416.2 221.8L433.6 222L451 222L468.5 222L485.9 222L503.3 222L520.8 222L538.2 222" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Forecast limit, ZHR 10</text><line x1="242.4" x2="254.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="258.4" y="40" style="fill:var(--muted)">Measured, ZHR 0.65</text><text class="fibub-mark" x="546" y="260" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The same calculation at Perth with the forecast upper limit (ZHR 10) and with the measured ZHR (0.65).</figcaption></figure>
<!-- /fig:forecast -->

| Check | Paper | Our tool result |
|---|---|---|
| Peak ZHR | 0.65 | 0.264 an hour seen at Perth (LM 6.0, radiant 44.8° up) |
| Best rate through the night | not given | 0.356 an hour (radiant 71°, early in the dark) |
| Meteors over the night, one watcher | not given | 1.38 (measured ZHR), 21.3 (forecast limit) |
| Why Australia | detections from Western Australia | radiant 45° up at Perth, 6.8° at Auckland, never above 7.7° at Toronto |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/lambda-sculptorids-comet-46p-wirtanen-meteor-shower-rates.mjs` in fibub's public code. It calls `hourlyRate` from `src/lib/sci/meteorrate.ts`, the formula the [[meteor-shower-planner]] uses, and repeats the planner's few lines from `src/lib/astro/meteors.ts` and `src/lib/astro/sky.ts` (the same astronomy-engine calls) for the radiant's height every 30 minutes and darkness when the Sun is 12° below the horizon. Those two files cannot be loaded by plain Node, so the script carries a copy.

The ZHR, its range, r = 3.0, the radiant, the peak time and the forecast limit come from the paper. The places (Perth, Auckland, Toronto, from fibub's city list), the rural sky of LM 6.0, and a shower held at peak strength all night are **our choices**. The real shower rose and fell over about 14 hours, so the night totals are upper limits.

## How we test the maths

On every change to fibub, `tests/sci.mjs` and the files in `tests/sci-tools/` check the maths behind the planner:

- With the radiant below the horizon (−5°) the rate must be exactly zero, and the Astronomy course checks use the same formula backwards: 30 meteors in an hour with the radiant at 90° and LM 6.5 is a ZHR of 30, and with the radiant at 30° a ZHR of 60.
- The Sun times that decide when it is dark are pinned to the US Naval Observatory: Toronto's sunrise on 21 June 2026 must come out at 05:36 EDT, within a minute.
- New with this article, in `tests/sci-tools/meteor-shower-planner.mjs`: ZHR 0.65, r = 3 and LM 6.0 with the radiant at 45° must give 0.2654 an hour; the radiant overhead under a perfect sky must give the ZHR itself; and LM 5.42 must cut the rate by 3^1.08 = 3.2756.

## Check it yourself

On the [[object-altitude]] planner:

1. Click *Change*, type **Perth** in *City*, and set *Night of* to **2023-12-12**. Set *Times in* to Perth's time zone.
2. In *Targets*, type **λ-Sculptorid radiant, 6.89, -38.89** and press *Add* (a single decimal right ascension is read as degrees).
3. In the *Summary*, *Meridian (pier flip)* shows about **19:22**: the radiant is highest (about 83° up) before the sky is fully dark. In *Hour by hour*, it is about **45°** up at 23:00 local time.
4. Work the rate by hand: 0.65 × sin 45° ÷ 3^0.5 = **0.27 an hour**, the 0.264 above.

On the [[meteor-shower-planner]]:

5. Keep Perth, pick **Geminids**, and set *Your sky* to **Rural (6.0)**. For December 2026 the planner shows up to **about 40 meteors an hour** before dawn, with *ZHR at peak* 150 and *Population index r* 2.6, the same formula with a far richer shower and a radiant only about 25° up.

## What researchers can use it for

- **Plan a campaign for a predicted outburst**: put the forecast ZHR and r into the formula and see where on Earth the radiant is high in darkness, with the [[meteor-shower-planner]] and the [[object-altitude]] planner.
- **Turn a measured ZHR into what observers saw**, to compare visual reports with camera fluxes.
- **Show why cameras and radar matter** for weak or slow showers: one meteor every four hours is beyond a human watch.
- **Pick the night**: check the Moon with the [[dark-sky-calendar]] before booking time.
- **Teach** how the radiant's height and the sky's darkness change a rate by large factors.

## The fine print

- These are expected rates from the paper's ZHR, not observations. Real counts scatter a lot when the rate is below one an hour.
- We held the shower at peak strength all night; the paper's activity profile rose and fell, so our night totals are upper limits.
- The planner's built-in list does not include the λ-Sculptorids, so step 5 uses the Geminids to show the same formula on the tool page.
- The population index is poorly measured (3.23, +3.03/−0.85), and the rates at bright skies depend strongly on it.
